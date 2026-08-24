/* global TextEncoder, WritableStream */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await testDuplicateDirectoryName();
		await testCommentTooLong();
		await testZipWriterStreamError();
	} finally {
		await zip.terminateWorkers();
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
