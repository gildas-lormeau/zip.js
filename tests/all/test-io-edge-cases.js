/* global Response */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const SEGMENT_SIZE = 100;

export { test };

async function test() {
	await testSplitDataWriterExactFill();
	await testSplitDataWriterEmpty();
	await testSplitDataWriterCloseDisk();
	await testSplitStateNotLeakedOnWriters();
	await testHttpReaderIgnoredRangeRequest();
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

function* blobWriterGenerator(writers, count) {
	for (let indexWriter = 0; indexWriter < count; indexWriter++) {
		const blobWriter = new zip.BlobWriter("application/octet-stream");
		writers.push(blobWriter);
		yield blobWriter;
	}
}
