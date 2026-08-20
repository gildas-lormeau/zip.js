// prependZip copies the data region of the source, i.e. everything before its central directory. The central
// directory and the end of central directory record of the source are rebuilt by the writer, so copying them
// would leave dead bytes in the output: up to half of the file for an archive made of many small entries, and
// a 22-byte record making the output look like an archive with prepended data when the source is empty.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(20);
const ENTRY_COUNT = 20;
const DISK_SIZE = 500;
const ADDED_FILENAME = "added.txt";
const PREFIX = new Uint8Array(64).fill(0x4d);
const LAST_MOD_DATE = new Date(2026, 0, 1, 12, 0, 0);

export { test };

async function test() {
	await copiesOnlyTheDataRegion();
	await copiesOnlyTheDataRegionOfASplitZipFile();
	await prependsNothingWhenTheSourceIsEmpty();
	await keepsTheDataPrependedToTheSource();
	await zip.terminateWorkers();
}

async function copiesOnlyTheDataRegion() {
	const source = await buildZipFile(ENTRY_COUNT);
	const sourceDirectoryOffset = await getDirectoryOffset(new zip.Uint8ArrayReader(source));
	const output = await prependAndAdd(new zip.Uint8ArrayReader(source));
	await checkDataRegion(output, sourceDirectoryOffset, "a single zip file");
	if (!equalBytes(output.subarray(0, sourceDirectoryOffset), source.subarray(0, sourceDirectoryOffset))) {
		throw new Error("the data region of the source was not copied verbatim");
	}
	await checkEntries(output, ENTRY_COUNT + 1);
}

async function copiesOnlyTheDataRegionOfASplitZipFile() {
	const disks = await buildSplitZipFile();
	if (disks.length < 3) {
		throw new Error("expected the source to be split into several disks, got " + disks.length);
	}
	const sourceDirectoryOffset = await getDirectoryOffset(disks.map(disk => new zip.Uint8ArrayReader(disk)));
	const output = await prependAndAdd(disks.map(disk => new zip.Uint8ArrayReader(disk)));
	await checkDataRegion(output, sourceDirectoryOffset, "a split zip file");
	await checkEntries(output, ENTRY_COUNT + 1);
}

async function prependsNothingWhenTheSourceIsEmpty() {
	const source = await buildZipFile(0);
	const output = await prependAndAdd(new zip.Uint8ArrayReader(source));
	const expectedOutput = await buildAddedEntry();
	if (!equalBytes(output, expectedOutput)) {
		throw new Error("prepending an empty zip file did not produce a plain zip file");
	}
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(output), { strictness: "strict", extractPrependedData: true });
	const entries = await zipReader.getEntries();
	const prependedDataLength = zipReader.prependedData.length;
	await zipReader.close();
	if (entries.length != 1 || prependedDataLength) {
		throw new Error("prepending an empty zip file left " + prependedDataLength + " bytes of prepended data");
	}
}

async function keepsTheDataPrependedToTheSource() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { offset: PREFIX.length });
	await zipWriter.add("entry.txt", new zip.TextReader(TEXT_CONTENT), { lastModDate: LAST_MOD_DATE });
	const data = await zipWriter.close();
	const source = new Uint8Array(PREFIX.length + data.length);
	source.set(PREFIX);
	source.set(data, PREFIX.length);
	const output = await prependAndAdd(new zip.Uint8ArrayReader(source));
	if (!equalBytes(output.subarray(0, PREFIX.length), PREFIX)) {
		throw new Error("the data prepended to the source was not copied");
	}
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(output), { extractPrependedData: true, checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	const prependedDataLength = zipReader.prependedData.length;
	await zipReader.close();
	if (entries.length != 2 || contents.some(content => content != TEXT_CONTENT) || prependedDataLength != PREFIX.length) {
		throw new Error("expected 2 entries and " + PREFIX.length + " bytes of prepended data, got " +
			entries.length + " entries and " + prependedDataLength + " bytes");
	}
}

async function checkDataRegion(output, sourceDirectoryOffset, description) {
	const outputDirectoryOffset = await getDirectoryOffset(new zip.Uint8ArrayReader(output));
	const addedEntryLength = await getDirectoryOffset(new zip.Uint8ArrayReader(await buildAddedEntry()));
	const copiedLength = outputDirectoryOffset - addedEntryLength;
	if (copiedLength != sourceDirectoryOffset) {
		throw new Error("expected " + sourceDirectoryOffset + " bytes copied from " + description + ", got " + copiedLength);
	}
}

async function checkEntries(output, expectedCount) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(output), { checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	if (entries.length != expectedCount || contents.some(content => content != TEXT_CONTENT)) {
		throw new Error("expected " + expectedCount + " readable entries, got " + entries.length);
	}
}

async function prependAndAdd(source) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.prependZip(source);
	await zipWriter.add(ADDED_FILENAME, new zip.TextReader(TEXT_CONTENT), { lastModDate: LAST_MOD_DATE });
	return zipWriter.close();
}

async function buildAddedEntry() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(ADDED_FILENAME, new zip.TextReader(TEXT_CONTENT), { lastModDate: LAST_MOD_DATE });
	return zipWriter.close();
}

async function buildZipFile(entryCount) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (let index = 0; index < entryCount; index++) {
		await zipWriter.add("entry-" + index + ".txt", new zip.TextReader(TEXT_CONTENT), { lastModDate: LAST_MOD_DATE });
	}
	return zipWriter.close();
}

async function buildSplitZipFile() {
	const diskWriters = [];
	const zipWriter = new zip.ZipWriter(nextDiskWriter(diskWriters));
	for (let index = 0; index < ENTRY_COUNT; index++) {
		await zipWriter.add("entry-" + index + ".txt", new zip.TextReader(TEXT_CONTENT), { lastModDate: LAST_MOD_DATE });
	}
	await zipWriter.close();
	return Promise.all(diskWriters.map(diskWriter => diskWriter.getData()));
}

async function* nextDiskWriter(diskWriters) {
	for (; ;) {
		const diskWriter = new zip.Uint8ArrayWriter();
		diskWriter.maxSize = DISK_SIZE;
		diskWriters.push(diskWriter);
		yield diskWriter;
	}
}

async function getDirectoryOffset(reader) {
	const zipReader = new zip.ZipReader(reader);
	await zipReader.getEntries();
	const { directoryOffset } = zipReader;
	await zipReader.close();
	return directoryOffset;
}

function equalBytes(first, second) {
	return first.length == second.length && first.every((byte, index) => byte == second[index]);
}
