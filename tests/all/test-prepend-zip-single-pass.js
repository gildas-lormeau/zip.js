// prependZip used to hand ZipReader the readable of the source instead of the source itself, so even a
// seekable source was read twice: once in full because ZipReader buffers a stream into a blob before it
// can find the central directory, then again for the bytes copied to the output. Reading the central
// directory through the reader turns the first pass into a few range reads, which for an HttpReader is
// the difference between downloading the archive twice and downloading it once. An array of readers
// keeps the previous path on purpose: prependZip concatenates the pieces into a single archive, while
// ZipReader would read them as the disks of a split zip.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "x".repeat(50000);
const ENTRY_COUNT = 20;
const ADDED_FILENAME = "added.txt";

export { test };

async function test() {
	const sourceData = await buildSourceZip();
	await readsTheSourceOnce(sourceData);
	await concatenatesAnArrayOfReaders(sourceData);
	await zip.terminateWorkers();
}

async function buildSourceZip() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (let index = 0; index < ENTRY_COUNT; index++) {
		await zipWriter.add("entry-" + index + ".txt", new zip.TextReader(TEXT_CONTENT), { level: 0 });
	}
	return zipWriter.close();
}

async function readsTheSourceOnce(sourceData) {
	const reader = new CountingReader(sourceData);
	await prependAndCheck(reader, "a counting reader");
	if (reader.bytesRead > sourceData.length * 1.5) {
		throw new Error("expected the source to be read once, got " + (reader.bytesRead / sourceData.length).toFixed(2) +
			" times its size in " + reader.calls + " calls");
	}
}

async function concatenatesAnArrayOfReaders(sourceData) {
	const middle = Math.floor(sourceData.length / 2);
	await prependAndCheck([
		new zip.Uint8ArrayReader(sourceData.slice(0, middle)),
		new zip.Uint8ArrayReader(sourceData.slice(middle))
	], "an array of readers");
}

async function prependAndCheck(source, description) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.prependZip(source);
	await zipWriter.add(ADDED_FILENAME, new zip.TextReader(TEXT_CONTENT));
	const data = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { checkSignature: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	if (entries.length != ENTRY_COUNT + 1) {
		throw new Error("expected " + (ENTRY_COUNT + 1) + " entries from " + description + " got " + entries.length);
	}
	if (entries[entries.length - 1].filename != ADDED_FILENAME) {
		throw new Error("expected " + ADDED_FILENAME + " last from " + description);
	}
	if (contents.some(content => content != TEXT_CONTENT)) {
		throw new Error("unexpected content from " + description);
	}
}

class CountingReader extends zip.Uint8ArrayReader {

	constructor(array) {
		super(array);
		this.bytesRead = 0;
		this.calls = 0;
	}

	readUint8Array(offset, length) {
		this.bytesRead += length;
		this.calls++;
		return super.readUint8Array(offset, length);
	}
}
