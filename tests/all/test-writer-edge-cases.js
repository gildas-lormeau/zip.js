/* global TextEncoder, WritableStream */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await testDuplicateDirectoryName();
		await testPaddedFilenames();
		await testCommentTooLong();
		await testZipWriterStreamError();
		await testWriterSizeMustBeWritable();
		await testWriterSizeKeepsItsStartingOffset();
	} finally {
		await zip.terminateWorkers();
	}
}

// filenames with leading or trailing whitespace are legal in zip files and must be
// preserved by the writer and by the filesystem import/export round trip
async function testPaddedFilenames() {
	const paddedFilenames = [" leading.txt", "trailing.txt ", " both.txt ", "dir /"];
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(paddedFilenames[0], new zip.TextReader(TEXT_CONTENT));
	await zipWriter.add(paddedFilenames[1], new zip.TextReader(TEXT_CONTENT));
	await zipWriter.add(" both.txt ", new zip.TextReader(TEXT_CONTENT));
	await zipWriter.add("dir ", undefined, { directory: true });
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	const filenames = entries.map(entry => entry.filename);
	if (filenames.length != paddedFilenames.length || paddedFilenames.some(filename => !filenames.includes(filename))) {
		throw new Error("expected padded filenames to be preserved by the writer");
	}
	const zipFs = new zip.ZipFS();
	await zipFs.importBlob(await blobWriter.getData());
	const exportedReader = new zip.ZipReader(new zip.BlobReader(await zipFs.exportBlob()));
	const exportedEntries = await exportedReader.getEntries();
	await exportedReader.close();
	const exportedFilenames = exportedEntries.map(entry => entry.filename);
	if (paddedFilenames.some(filename => !exportedFilenames.includes(filename))) {
		throw new Error("expected padded filenames to be preserved by the filesystem round trip");
	}
}

// "folder" with the directory option and "folder/" must be detected as duplicates
async function testDuplicateDirectoryName() {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add("folder", undefined, { directory: true });
	try {
		await zipWriter.add("folder/", undefined, { directory: true });
		throw new Error("duplicate name not detected");
	} catch (error) {
		if (error.message != zip.ERR_DUPLICATED_NAME) {
			throw error;
		}
	}
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	if (entries.length != 1) {
		throw new Error();
	}
}

// an oversized archive comment must be rejected before the central directory
// is written, leaving the writer able to retry with a valid comment
async function testCommentTooLong() {
	const referenceSize = (await writeZip(new Uint8Array(0))).size;
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	try {
		await zipWriter.close(new Uint8Array(65536));
		throw new Error("comment not rejected");
	} catch (error) {
		if (error.message != zip.ERR_INVALID_COMMENT) {
			throw error;
		}
	}
	await zipWriter.close(new Uint8Array(0));
	const blob = await blobWriter.getData();
	if (blob.size != referenceSize) {
		throw new Error("unexpected data written before the comment was rejected");
	}
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	if (entries.length != 1) {
		throw new Error();
	}

	async function writeZip(comment) {
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter);
		await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
		await zipWriter.close(comment);
		return blobWriter.getData();
	}
}

// a failed add() through ZipWriterStream must error the returned writable, reject close() and
// abort the archive readable, so that a consumer piping it neither hangs nor keeps a partial file
async function testZipWriterStreamError() {
	const zipWriterStream = new zip.ZipWriterStream();
	let drainError;
	const drained = zipWriterStream.readable.pipeTo(new WritableStream({})).catch(error => drainError = error);
	const firstWritable = zipWriterStream.writable("entry.txt");
	const firstWriter = firstWritable.getWriter();
	await firstWriter.write(new TextEncoder().encode(TEXT_CONTENT));
	await firstWriter.close();
	const secondWritable = zipWriterStream.writable("entry.txt");
	const secondWriter = secondWritable.getWriter();
	let writableErrored = false;
	try {
		await secondWriter.write(new TextEncoder().encode(TEXT_CONTENT));
		await secondWriter.close();
	} catch (error) {
		writableErrored = error.message == zip.ERR_DUPLICATED_NAME;
	}
	let closeRejected = false;
	try {
		await zipWriterStream.close();
	} catch (error) {
		closeRejected = error.message == zip.ERR_DUPLICATED_NAME && error.entryErrors.length == 1;
	}
	await drained;
	if (!writableErrored || !closeRejected || !drainError || drainError.message != zip.ERR_DUPLICATED_NAME) {
		throw new Error("expected the duplicate entry to error the writable, close() and the readable");
	}
}

// zip.js writes the number of bytes written into the size property of a caller-supplied writer, so a writer
// refusing the assignment cannot work. It used to fail with a bare engine TypeError naming no zip.js concept,
// and only for some shapes at construction: a getter returning a number passed the "is it undefined" test and
// died later, inside writeData, once the first entry had already reached the caller's writable.
async function testWriterSizeMustBeWritable() {
	const descriptors = {
		"a getter returning a number": { get: () => 0, configurable: true },
		"a getter returning undefined": { get: () => undefined, configurable: true },
		"a read-only property": { value: 0, writable: false, configurable: true }
	};
	for (const [description, descriptor] of Object.entries(descriptors)) {
		const writer = Object.defineProperty({ writable: new WritableStream({ write() { } }) }, "size", descriptor);
		let thrownError;
		try {
			const zipWriter = new zip.ZipWriter(writer);
			await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
			await zipWriter.close();
		} catch (error) {
			thrownError = error;
		}
		if (!thrownError || thrownError.message != zip.ERR_WRITER_SIZE_NOT_WRITABLE) {
			throw new Error("expected " + description + " to be rejected, got " + (thrownError ? thrownError.message : "no error"));
		}
	}
	const frozen = Object.freeze({ writable: new WritableStream({ write() { } }) });
	try {
		new zip.ZipWriter(frozen);
		throw new Error("expected a frozen writer to be rejected");
	} catch (error) {
		if (error.message != zip.ERR_WRITER_SIZE_NOT_WRITABLE) {
			throw error;
		}
	}
}

// the guard assigns to size to find out whether it can, so it must not disturb the documented contract: a
// value set before the first write is the starting offset, and an unset one becomes 0.
async function testWriterSizeKeepsItsStartingOffset() {
	const writer = { writable: new WritableStream({ write() { } }), size: 1000 };
	const zipWriter = new zip.ZipWriter(writer);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	if (writer.size <= 1000) {
		throw new Error("expected the starting offset to be kept, got " + writer.size);
	}
	const unset = { writable: new WritableStream({ write() { } }) };
	new zip.ZipWriter(unset);
	if (unset.size !== 0) {
		throw new Error("expected an unset size to become 0, got " + unset.size);
	}
	const settable = { writable: new WritableStream({ write() { } }) };
	let stored = 0;
	Object.defineProperty(settable, "size", { get: () => stored, set: value => { stored = value; }, configurable: true });
	const settableWriter = new zip.ZipWriter(settable);
	await settableWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await settableWriter.close();
	if (!stored) {
		throw new Error("expected an accessor pair to be accepted and written through, got " + stored);
	}
}
