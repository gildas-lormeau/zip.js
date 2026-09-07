/* global ReadableStream, WritableStream */

// Locks the disposal of ZipReader and ZipWriter, i.e. what `await using` runs. The syntax itself is
// not used here because the oldest engines of the matrix cannot parse it, so the method is called by
// hand. Disposing a writer finalizes the zip file, which is only safe because a second close() after
// a successful one now does nothing: before that, closing twice appended a second central directory
// whenever zip.js did not own the writable stream and therefore left it unlocked. The retry after a
// close() that threw is the counterpart, and the salvage contract of ZipWriter#close depends on it.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	try {
		await testCloseTwiceWritesNothing();
		await testFailedCloseCanBeRetried();
		await testReaderDisposeCancelsUnreadStream();
		await testReaderDisposeIsRepeatable();
		await testWriterDisposeFinalizes();
		await testWriterDisposeAfterCloseWritesNothing();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testReaderDisposeCancelsUnreadStream() {
	const { readable, isCancelled } = createWatchedStream(await createArchive());
	await new zip.ZipReader(readable)[Symbol.asyncDispose]();
	if (!isCancelled()) {
		throw new Error("expected disposing to cancel the stream no entry has been read from");
	}
}

async function testReaderDisposeIsRepeatable() {
	const { readable } = createWatchedStream(await createArchive());
	const zipReader = new zip.ZipReader(readable);
	await zipReader.close();
	await zipReader[Symbol.asyncDispose]();
}

async function testWriterDisposeFinalizes() {
	const writer = new zip.Uint8ArrayWriter();
	const zipWriter = new zip.ZipWriter(writer);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter[Symbol.asyncDispose]();
	await assertArchiveHolds(await writer.getData(), "disposing the writer");
}

async function testWriterDisposeAfterCloseWritesNothing() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	const data = await zipWriter.close();
	await zipWriter[Symbol.asyncDispose]();
	await assertArchiveHolds(data, "disposing a closed writer");
}

async function testCloseTwiceWritesNothing() {
	const chunks = [];
	const writable = new WritableStream({
		write(chunk) {
			chunks.push(chunk.slice());
		}
	});
	const zipWriter = new zip.ZipWriter(writable);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close(undefined, { preventClose: true });
	const length = getLength(chunks);
	await zipWriter.close(undefined, { preventClose: true });
	if (getLength(chunks) != length) {
		throw new Error("expected the second close to write nothing, got " + (getLength(chunks) - length) + " bytes");
	}
	await assertArchiveHolds(concatenate(chunks, length), "closing twice");
}

async function testFailedCloseCanBeRetried() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	zipWriter.add("failed.txt", new ReadableStream({
		start(controller) {
			controller.error(new Error("failed entry"));
		}
	}));
	try {
		await zipWriter.close();
		throw new Error("expected the unobserved entry error to be thrown by close");
	} catch (error) {
		if (error.message != "failed entry") {
			throw error;
		}
	}
	await assertArchiveHolds(await zipWriter.close(), "retrying a close that threw");
}

async function assertArchiveHolds(data, context) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = await zipReader.getEntries();
	const filenames = entries.map(entry => entry.filename);
	if (filenames.join() != FILENAME) {
		throw new Error("expected " + JSON.stringify(FILENAME) + " after " + context + ", got " + filenames.join());
	}
	const text = await entries[0].getData(new zip.TextWriter());
	await zipReader.close();
	if (text != TEXT_CONTENT) {
		throw new Error("expected the entry data to survive " + context + ", got " + JSON.stringify(text));
	}
}

async function createArchive() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	return zipWriter.close();
}

function createWatchedStream(data) {
	let cancelled = false;
	const readable = new ReadableStream({
		start(controller) {
			controller.enqueue(data);
			controller.close();
		},
		cancel() {
			cancelled = true;
		}
	});
	return { readable, isCancelled: () => cancelled };
}

function getLength(chunks) {
	return chunks.reduce((total, chunk) => total + chunk.length, 0);
}

function concatenate(chunks, length) {
	const data = new Uint8Array(length);
	let offset = 0;
	chunks.forEach(chunk => {
		data.set(chunk, offset);
		offset += chunk.length;
	});
	return data;
}
