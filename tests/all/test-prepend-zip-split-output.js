// prependZip copies the source into the writer before any entry is added. When the output is itself split, those
// bytes have to flow across the output disks like any other data, and the disks of the source have nothing to do
// with the disks of the output: an entry can start on one disk of the source and land on another disk of the
// output. The two disk sizes are independent, including when the output fits on a single disk. The copied entries
// are therefore relocated to the disk they land on: an entry pointing at disk 0 with an offset past the end of
// disk 0 is read back by zip.js, which sums the disk sizes, but is rejected by the other implementations.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "The quick brown fox jumps over the lazy dog. ".repeat(1200);
const ENTRY_COUNT = 6;
const SOURCE_DISK_SIZE = 40000;
const OUTPUT_DISK_SIZES = [5000, 15000, SOURCE_DISK_SIZE, 100000, 10000000];
const ADDED_FILENAME = "added.txt";
const SPLIT_ZIP_FILE_SIGNATURE = [0x50, 0x4b, 0x07, 0x08];
const LOCAL_FILE_HEADER_SIGNATURE = [0x50, 0x4b, 0x03, 0x04];
const LOCAL_FILE_HEADER_LENGTH = 30;
const SMALL_TEXT_CONTENT = "The quick brown fox jumps over the lazy dog. ".repeat(4);
const SMALL_DISK_SIZES_START = 300;
const SMALL_DISK_SIZES_COUNT = 80;

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
	await keepsLocalHeadersWholeAcrossDisks();
	await zip.terminateWorkers();
}

async function prependIntoSplitOutput(disks, outputDiskSize) {
	const source = disks.map(disk => new zip.Uint8ArrayReader(disk));
	const outputDisks = await prependAndClose(source, outputDiskSize, TEXT_CONTENT);
	await checkEntries(outputDisks, "output disks of " + outputDiskSize + " bytes", TEXT_CONTENT);
}

async function prependSingleZipFileIntoSplitOutput() {
	const source = await buildZipFile(TEXT_CONTENT);
	const outputDisks = await prependAndClose(new zip.Uint8ArrayReader(source), 15000, TEXT_CONTENT);
	await checkEntries(outputDisks, "a single zip file split into output disks", TEXT_CONTENT);
}

async function keepsLocalHeadersWholeAcrossDisks() {
	const source = await buildZipFile(SMALL_TEXT_CONTENT);
	for (let index = 0; index < SMALL_DISK_SIZES_COUNT; index++) {
		const outputDiskSize = SMALL_DISK_SIZES_START + index;
		const outputDisks = await prependAndClose(new zip.Uint8ArrayReader(source), outputDiskSize, SMALL_TEXT_CONTENT);
		await checkEntries(outputDisks, "small output disks of " + outputDiskSize + " bytes", SMALL_TEXT_CONTENT);
	}
}

async function prependAndClose(source, outputDiskSize, content) {
	const diskWriters = [];
	const zipWriter = new zip.ZipWriter(nextDiskWriter(diskWriters, outputDiskSize));
	await zipWriter.prependZip(source);
	await zipWriter.add(ADDED_FILENAME, new zip.TextReader(content), { level: 0 });
	await zipWriter.close();
	return Promise.all(diskWriters.map(diskWriter => diskWriter.getData()));
}

async function checkEntries(outputDisks, description, content) {
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
	if (contents.some(entryContent => entryContent != content)) {
		throw new Error("unexpected content from " + description);
	}
	checkDiskLayout(outputDisks, entries, description);
}

function checkDiskLayout(outputDisks, entries, description) {
	if (outputDisks.length > 1 && !startsWith(outputDisks[0], 0, SPLIT_ZIP_FILE_SIGNATURE)) {
		throw new Error("the first disk of " + description + " does not start with the split zip file signature");
	}
	entries.forEach(({ filename, diskNumberStart, offset }) => {
		const disk = outputDisks[diskNumberStart];
		if (!disk) {
			throw new Error(filename + " points at disk " + diskNumberStart + " of " + description +
				", which only has " + outputDisks.length + " disks");
		}
		if (!startsWith(disk, offset, LOCAL_FILE_HEADER_SIGNATURE)) {
			throw new Error(filename + " does not point at a local file header in disk " + diskNumberStart +
				" of " + description + " (offset " + offset + ", disk size " + disk.length + ")");
		}
		const headerLength = getLocalHeaderLength(disk, offset);
		if (offset + headerLength > disk.length) {
			throw new Error("the local file header of " + filename + " is split across the disks of " + description +
				" (offset " + offset + ", length " + headerLength + ", disk size " + disk.length + ")");
		}
	});
}

function getLocalHeaderLength(disk, offset) {
	const view = new DataView(disk.buffer, disk.byteOffset, disk.length);
	return LOCAL_FILE_HEADER_LENGTH + view.getUint16(offset + 26, true) + view.getUint16(offset + 28, true);
}

function startsWith(disk, offset, signature) {
	return signature.every((byte, index) => disk[offset + index] == byte);
}

async function buildZipFile(content) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (let index = 0; index < ENTRY_COUNT; index++) {
		await zipWriter.add("entry-" + index + ".txt", new zip.TextReader(content), { level: 0 });
	}
	return zipWriter.close();
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
