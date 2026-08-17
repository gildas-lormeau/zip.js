/* global Response, WritableStream */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const SEGMENT_SIZE = 100;
const CHUNK_SIZE = 512;

export { test };

async function test() {
	await testSplitDataWriterExactFill();
	await testSplitDataWriterEmpty();
	await testSplitDataWriterCloseDisk();
	await testSplitStateNotLeakedOnWriters();
	await testHttpReaderIgnoredRangeRequest();
	await testReadableChunkBoundaries();
	try {
		await testReadableEntryChunks();
	} finally {
		await zip.terminateWorkers();
	}
}

// a payload filling a bounded number of disks exactly must not pull an
// extra writer from the generator
async function testSplitDataWriterExactFill() {
	const writers = [];
	const splitDataWriter = new zip.SplitDataWriter(blobWriterGenerator(writers, 2), SEGMENT_SIZE);
	await splitDataWriter.init();
	const writer = splitDataWriter.writable.getWriter();
	await writer.write(new Uint8Array(SEGMENT_SIZE).fill(1));
	await writer.write(new Uint8Array(SEGMENT_SIZE).fill(2));
	await writer.close();
	const blobs = await Promise.all(writers.map(writer => writer.getData()));
	if (writers.length != 2 || splitDataWriter.diskNumber != 2 ||
		blobs[0].size != SEGMENT_SIZE || blobs[1].size != SEGMENT_SIZE) {
		throw new Error();
	}
}

// closing without writing any data must not crash
async function testSplitDataWriterEmpty() {
	const writers = [];
	const splitDataWriter = new zip.SplitDataWriter(blobWriterGenerator(writers, 1), SEGMENT_SIZE);
	await splitDataWriter.init();
	await splitDataWriter.writable.getWriter().close();
	if (writers.length != 0) {
		throw new Error();
	}
}

// closeDisk() must end the disk being written after the pending data, open the
// next disk lazily when more data arrives, and be a no-op when no disk is open
async function testSplitDataWriterCloseDisk() {
	const writers = [];
	const splitDataWriter = new zip.SplitDataWriter(blobWriterGenerator(writers, 2), SEGMENT_SIZE);
	await splitDataWriter.init();
	const firstDiskWriter = splitDataWriter.writable.getWriter();
	await firstDiskWriter.write(new Uint8Array(10).fill(1));
	firstDiskWriter.releaseLock();
	await splitDataWriter.closeDisk();
	await splitDataWriter.closeDisk();
	if (writers.length != 1 || splitDataWriter.diskNumber != 1 || splitDataWriter.availableSize != SEGMENT_SIZE) {
		throw new Error();
	}
	const secondDiskWriter = splitDataWriter.writable.getWriter();
	await secondDiskWriter.write(new Uint8Array(20).fill(2));
	await secondDiskWriter.close();
	const blobs = await Promise.all(writers.map(writer => writer.getData()));
	if (writers.length != 2 || splitDataWriter.diskNumber != 1 ||
		blobs[0].size != 10 || blobs[1].size != 20) {
		throw new Error();
	}
}

// internal split bookkeeping must not be stamped onto user-provided writers,
// neither by ZipWriter nor by Entry#getData
async function testSplitStateNotLeakedOnWriters() {
	const SPLIT_STATE_PROPERTY_NAMES = ["diskNumber", "diskOffset", "availableSize", "maxSize"];
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const textWriter = new zip.TextWriter();
	const text = await entries[0].getData(textWriter);
	await zipReader.close();
	await zip.terminateWorkers();
	if (text != TEXT_CONTENT ||
		SPLIT_STATE_PROPERTY_NAMES.some(name => name in blobWriter) ||
		SPLIT_STATE_PROPERTY_NAMES.some(name => name in textWriter)) {
		throw new Error();
	}
}

// a server advertising range support but ignoring the Range header must make
// the reader fail with ERR_HTTP_RANGE instead of caching the whole response
// as the end of central directory record
async function testHttpReaderIgnoredRangeRequest() {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	await zip.terminateWorkers();
	const zipArray = new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
	const originalFetch = globalThis.fetch;
	globalThis.fetch = async () => ({
		status: 200,
		headers: new Map([
			["Accept-Ranges", "bytes"],
			["Content-Length", String(zipArray.length)]
		]),
		arrayBuffer: async () => zipArray.slice().buffer,
		body: new Response(zipArray.slice()).body
	});
	try {
		const zipReader = new zip.ZipReader(new zip.HttpReader("http://localhost/test.zip", {
			useRangeHeader: true,
			combineSizeEocd: true,
			useXHR: false
		}));
		try {
			await zipReader.getEntries();
			throw new Error("no error thrown");
		} catch (error) {
			if (error.message != zip.ERR_HTTP_RANGE) {
				throw error;
			}
		} finally {
			await zipReader.close();
		}
	} finally {
		globalThis.fetch = originalFetch;
	}
}

// a Reader must never hand a zero-length chunk to its consumer, and must stop
// pulling as soon as the requested range is read, whether or not its size is known
async function testReadableChunkBoundaries() {
	for (const size of [0, 1, CHUNK_SIZE - 1, CHUNK_SIZE, CHUNK_SIZE * 2, CHUNK_SIZE * 2 + 1]) {
		const data = new Uint8Array(size).fill(65);
		const expectedLengths = [];
		for (let offset = 0; offset < size; offset += CHUNK_SIZE) {
			expectedLengths.push(Math.min(CHUNK_SIZE, size - offset));
		}
		for (const knownSize of [true, false]) {
			const reader = new TestReader(data);
			const lengths = await getChunkLengths(reader.createReadable(knownSize ?
				{ size, chunkSize: CHUNK_SIZE } :
				{ chunkSize: CHUNK_SIZE }));
			if (lengths.join() != expectedLengths.join()) {
				throw new Error("expected the chunks " + expectedLengths.join() + " for a size of " + size +
					", got " + lengths.join());
			}
			const expectedReadCount = knownSize ? Math.max(1, expectedLengths.length) : expectedLengths.length + 1;
			if (reader.readCount != expectedReadCount) {
				throw new Error("expected " + expectedReadCount + " reads for a size of " + size +
					(knownSize ? " known" : " unknown") + ", got " + reader.readCount);
			}
		}
	}
	const lengths = await getChunkLengths(new TestReader(new Uint8Array(CHUNK_SIZE * 2)).createReadable({
		offset: CHUNK_SIZE,
		size: CHUNK_SIZE,
		chunkSize: CHUNK_SIZE
	}));
	if (lengths.join() != String(CHUNK_SIZE)) {
		throw new Error("expected a single chunk of " + CHUNK_SIZE + " bytes, got " + lengths.join());
	}
}

// the same contract through a zip entry, where the data is read by the codec
async function testReadableEntryChunks() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), { level: 0 });
	await zipWriter.add("empty.txt", new zip.TextReader(""));
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await zipWriter.close()));
	const entries = await zipReader.getEntries();
	for (const entry of entries) {
		const lengths = [];
		await entry.getData({
			writable: new WritableStream({
				write(chunk) {
					lengths.push(chunk.length);
				}
			})
		});
		if (lengths.some(length => !length)) {
			throw new Error("expected no empty chunk for " + entry.filename + ", got " + lengths.join());
		}
	}
	await zipReader.close();
}

class TestReader extends zip.Reader {

	constructor(data) {
		super();
		this.data = data;
		this.size = data.length;
		this.readCount = 0;
	}

	readUint8Array(index, length) {
		this.readCount++;
		return this.data.subarray(index, index + Math.min(length, this.size - index));
	}
}

async function getChunkLengths(readable) {
	const lengths = [];
	const reader = readable.getReader();
	let result = await reader.read();
	while (!result.done) {
		lengths.push(result.value.length);
		result = await reader.read();
	}
	return lengths;
}

function* blobWriterGenerator(writers, count) {
	for (let indexWriter = 0; indexWriter < count; indexWriter++) {
		const blobWriter = new zip.BlobWriter("application/octet-stream");
		writers.push(blobWriter);
		yield blobWriter;
	}
}
