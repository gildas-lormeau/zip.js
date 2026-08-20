// prependZip used to hand ZipReader the readable of the source instead of the source itself, so even a
// seekable source was read twice: once in full because ZipReader buffers a stream into a blob before it
// can find the central directory, then again for the bytes copied to the output. Reading the central
// directory through the reader turns the first pass into a few range reads, which for an HttpReader is
// the difference between downloading the archive twice and downloading it once. Reading through the reader
// also gives an array of readers the meaning it has everywhere else, the disks of a split zip file: the
// disks are written out as a single zip file, so each prepended entry is relocated to the offset it takes
// once the disks follow each other.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "x".repeat(50000);
const ENTRY_COUNT = 20;
const ADDED_FILENAME = "added.txt";
const DISK_SIZE = 100000;

export { test };

async function test() {
	const sourceData = await buildSourceZip();
	await readsTheSourceOnce(sourceData);
	await flattensASplitZipFile();
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

async function flattensASplitZipFile() {
	const diskWriters = [];
	const zipWriter = new zip.ZipWriter(nextDiskWriter(diskWriters));
	for (let index = 0; index < ENTRY_COUNT; index++) {
		await zipWriter.add("entry-" + index + ".txt", new zip.TextReader(TEXT_CONTENT), { level: 0 });
	}
	await zipWriter.close();
	const disks = await Promise.all(diskWriters.map(diskWriter => diskWriter.getData()));
	if (disks.length < 3) {
		throw new Error("expected the source to be split into several disks, got " + disks.length);
	}
	await prependAndCheck(disks.map(disk => new zip.Uint8ArrayReader(disk)), "an array of disks");
	await prependAndCheck(new zip.SplitDataReader(disks.map(disk => new zip.Uint8ArrayReader(disk))), "a SplitDataReader instance");
}

async function* nextDiskWriter(diskWriters) {
	for (; ;) {
		const diskWriter = new zip.Uint8ArrayWriter();
		diskWriter.maxSize = DISK_SIZE;
		diskWriters.push(diskWriter);
		yield diskWriter;
	}
}

async function prependAndCheck(source, description) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.prependZip(source);
	await zipWriter.add(ADDED_FILENAME, new zip.TextReader(TEXT_CONTENT));
	const data = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { checkCrc32: true });
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
