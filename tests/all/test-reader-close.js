/* global ReadableStream */

// Locks what closing a ZipReader instance does. The only resource it can hold is the ReadableStream
// instance it was built over, so closing cancels that stream when nothing has been read from it and
// does nothing in every other case: the Reader instances belong to the caller, and the entries stay
// readable after the call, which the filesystem API relies on when a ZipReader instance is imported.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	try {
		await testCancelsUnreadStream();
		await testKeepsEntriesReadable();
		await testLeavesSeekableReadersAlone();
		await testImportedReader();
		await testPrependZip();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testCancelsUnreadStream() {
	const { readable, isCancelled } = createWatchedStream(await createArchive());
	await new zip.ZipReader(readable).close();
	if (!isCancelled()) {
		throw new Error("expected the stream to be cancelled when no entry has been read");
	}
}

async function testKeepsEntriesReadable() {
	const { readable, isCancelled } = createWatchedStream(await createArchive());
	const zipReader = new zip.ZipReader(readable);
	const [entry] = await zipReader.getEntries();
	await zipReader.close();
	if (isCancelled()) {
		throw new Error("expected the consumed stream not to be cancelled");
	}
	const text = await entry.getData(new zip.TextWriter());
	if (text != TEXT_CONTENT) {
		throw new Error("expected the entry to stay readable after closing, got " + JSON.stringify(text));
	}
}

async function testLeavesSeekableReadersAlone() {
	const reader = new zip.Uint8ArrayReader(await createArchive());
	let readableCount = 0;
	Object.defineProperty(reader, "readable", {
		get() {
			readableCount++;
			return zip.Reader.prototype.createReadable.call(this);
		}
	});
	const zipReader = new zip.ZipReader(reader);
	const [entry] = await zipReader.getEntries();
	await zipReader.close();
	if (readableCount) {
		throw new Error("expected closing not to create a readable stream, got " + readableCount);
	}
	const text = await entry.getData(new zip.TextWriter());
	if (text != TEXT_CONTENT) {
		throw new Error("expected the entry to stay readable after closing, got " + JSON.stringify(text));
	}
}

async function testImportedReader() {
	const { readable } = createWatchedStream(await createArchive());
	const zipFs = new zip.ZipFS();
	const zipReader = new zip.ZipReader(readable);
	await zipFs.importZip(zipReader);
	await zipReader.close();
	const text = await zipFs.find(FILENAME).getText();
	if (text != TEXT_CONTENT) {
		throw new Error("expected the imported entry to stay readable after closing, got " + JSON.stringify(text));
	}
}

async function testPrependZip() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.prependZip(new zip.Uint8ArrayReader(await createArchive()));
	await zipWriter.add("added.txt", new zip.TextReader(TEXT_CONTENT));
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await zipWriter.close()));
	const filenames = (await zipReader.getEntries()).map(entry => entry.filename);
	await zipReader.close();
	if (filenames.join() != [FILENAME, "added.txt"].join()) {
		throw new Error("expected the prepended zip file to be preserved, got " + filenames.join());
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
