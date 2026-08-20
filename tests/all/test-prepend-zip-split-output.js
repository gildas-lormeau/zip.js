// prependZip pipes the source into the writer before any entry is added. When the output is itself split, those
// bytes have to flow across the output disks like any other data, and the disks of the source have nothing to do
// with the disks of the output: an entry can start on one disk of the source and land on another disk of the
// output. The two disk sizes are independent, including when the output fits on a single disk.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "The quick brown fox jumps over the lazy dog. ".repeat(1200);
const ENTRY_COUNT = 6;
const SOURCE_DISK_SIZE = 40000;
const OUTPUT_DISK_SIZES = [5000, 15000, SOURCE_DISK_SIZE, 100000, 10000000];
const ADDED_FILENAME = "added.txt";

export { test };

async function test() {
	const disks = await buildSplitZipFile(SOURCE_DISK_SIZE);
	if (disks.length < 3) {
		throw new Error("expected the source to be split into several disks, got " + disks.length);
	}
	for (const outputDiskSize of OUTPUT_DISK_SIZES) {
		await prependIntoSplitOutput(disks, outputDiskSize);
	}
	await prependSingleZipFileIntoSplitOutput();
	await zip.terminateWorkers();
}

async function prependIntoSplitOutput(disks, outputDiskSize) {
	const source = disks.map(disk => new zip.Uint8ArrayReader(disk));
	const outputDisks = await prependAndClose(source, outputDiskSize);
	await checkEntries(outputDisks, "output disks of " + outputDiskSize + " bytes");
}

async function prependSingleZipFileIntoSplitOutput() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (let index = 0; index < ENTRY_COUNT; index++) {
		await zipWriter.add("entry-" + index + ".txt", new zip.TextReader(TEXT_CONTENT), { level: 0 });
	}
	const source = await zipWriter.close();
	const outputDisks = await prependAndClose(new zip.Uint8ArrayReader(source), 15000);
	await checkEntries(outputDisks, "a single zip file split into output disks");
}

async function prependAndClose(source, outputDiskSize) {
	const diskWriters = [];
	const zipWriter = new zip.ZipWriter(nextDiskWriter(diskWriters, outputDiskSize));
	await zipWriter.prependZip(source);
	await zipWriter.add(ADDED_FILENAME, new zip.TextReader(TEXT_CONTENT), { level: 0 });
	await zipWriter.close();
	return Promise.all(diskWriters.map(diskWriter => diskWriter.getData()));
}

async function checkEntries(outputDisks, description) {
	const zipReader = new zip.ZipReader(outputDisks.map(disk => new zip.Uint8ArrayReader(disk)), { checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	if (entries.length != ENTRY_COUNT + 1) {
		throw new Error("expected " + (ENTRY_COUNT + 1) + " entries from " + description + ", got " + entries.length);
	}
	if (entries[entries.length - 1].filename != ADDED_FILENAME) {
		throw new Error("expected " + ADDED_FILENAME + " last from " + description);
	}
	if (contents.some(content => content != TEXT_CONTENT)) {
		throw new Error("unexpected content from " + description);
	}
}

async function buildSplitZipFile(diskSize) {
	const diskWriters = [];
	const zipWriter = new zip.ZipWriter(nextDiskWriter(diskWriters, diskSize));
	for (let index = 0; index < ENTRY_COUNT; index++) {
		await zipWriter.add("entry-" + index + ".txt", new zip.TextReader(TEXT_CONTENT), { level: 0 });
	}
	await zipWriter.close();
	return Promise.all(diskWriters.map(diskWriter => diskWriter.getData()));
}

async function* nextDiskWriter(diskWriters, maxSize) {
	for (; ;) {
		const diskWriter = new zip.Uint8ArrayWriter();
		diskWriter.maxSize = maxSize;
		diskWriters.push(diskWriter);
		yield diskWriter;
	}
}
