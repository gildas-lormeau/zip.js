/* global TextEncoder */

import * as zip from "../zip-lib.js";

const LAST_MOD_DATE = new Date(2026, 0, 1, 12, 0, 0);
const SPLIT_ZIP_FILE_SIGNATURE = [0x50, 0x4b, 0x07, 0x08];
const RAW_BIT_FLAGS = 0x1040;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });
	try {
		await appendsBetweenAddedEntries();
		await appendsSeveralZipFiles();
		await rejectsDuplicateFilenames();
		await serializesConcurrentCalls();
		await completesBeforeAnUnawaitedClose();
		await marksAFailedCopyAsCorrupted();
		await keepsThePrependZipGuard();
		await copiesOnlyTheFilteredEntries();
		await replacesAnEntryThroughTheFilter();
		await keepsEveryEntryWithAPermissiveFilter();
		await acceptsAnAsyncFilter();
		await letsTheFilterReadTheEntryData();
		await dropsTheBytesOutsideTheEntriesWhenFiltering();
		await filtersIntoASplitZipFile();
		await keepsTheRawBitFlag();
		await rejectsAFilterWhichIsNotAFunction();
	} finally {
		await zip.terminateWorkers();
	}
}

async function appendsBetweenAddedEntries() {
	const source = await buildZipFile(["s1.txt", "s2.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter, "a.txt");
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source));
	await addEntry(zipWriter, "b.txt");
	const output = await zipWriter.close();
	const directOutput = await buildZipFile(["a.txt", "s1.txt", "s2.txt", "b.txt"]);
	if (!equalBytes(output, directOutput)) {
		throw new Error("expected the same bytes as a direct write, got " + output.length + " vs " + directOutput.length + " bytes");
	}
	await checkEntries(output, ["a.txt", "s1.txt", "s2.txt", "b.txt"]);
}

async function appendsSeveralZipFiles() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.appendZip(new zip.Uint8ArrayReader(await buildZipFile(["x.txt"])));
	await zipWriter.appendZip(new zip.Uint8ArrayReader(await buildZipFile(["y.txt"])));
	await checkEntries(await zipWriter.close(), ["x.txt", "y.txt"]);
}

async function rejectsDuplicateFilenames() {
	const source = await buildZipFile(["s1.txt", "s2.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter, "s2.txt");
	let error;
	try {
		await zipWriter.appendZip(new zip.Uint8ArrayReader(source));
	} catch (appendError) {
		error = appendError;
	}
	if (!error || error.message != zip.ERR_DUPLICATED_NAME) {
		throw new Error("expected a duplicate filename error, got " + (error ? error.message : "no error"));
	}
	await addEntry(zipWriter, "s1.txt");
	await checkEntries(await zipWriter.close(), ["s2.txt", "s1.txt"]);
}

async function serializesConcurrentCalls() {
	const source = await buildZipFile(["s1.txt", "s2.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	const pendingAdd = addEntry(zipWriter, "a.txt");
	const pendingAppendZip = zipWriter.appendZip(new zip.Uint8ArrayReader(source));
	const pendingLateAdd = addEntry(zipWriter, "b.txt");
	await Promise.all([pendingAdd, pendingAppendZip, pendingLateAdd]);
	await checkEntries(await zipWriter.close(), ["a.txt", "s1.txt", "s2.txt", "b.txt"], { ignoreOrder: true });
}

async function completesBeforeAnUnawaitedClose() {
	const source = await buildZipFile(["s1.txt", "s2.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	zipWriter.appendZip(new zip.Uint8ArrayReader(source));
	await checkEntries(await zipWriter.close(), ["s1.txt", "s2.txt"]);
}

async function marksAFailedCopyAsCorrupted() {
	const sourceWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await sourceWriter.add("s1.txt", new zip.TextReader("x".repeat(600)), { level: 0, lastModDate: LAST_MOD_DATE });
	await sourceWriter.add("s2.txt", new zip.TextReader("y".repeat(600)), { level: 0, lastModDate: LAST_MOD_DATE });
	const source = await sourceWriter.close();
	const failingReader = new zip.Uint8ArrayReader(source);
	const readUint8Array = failingReader.readUint8Array.bind(failingReader);
	failingReader.readUint8Array = (index, length, ...args) => {
		if (index >= 400 && index < 800) {
			throw new Error("failing reader");
		}
		return readUint8Array(index, length, ...args);
	};
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter, "a.txt");
	let error;
	try {
		await zipWriter.appendZip(failingReader);
	} catch (appendError) {
		error = appendError;
	}
	if (!error || !error.corruptedEntry || !zipWriter.hasCorruptedEntries) {
		throw new Error("expected the failed copy to mark the zip as corrupted, got " + (error ? error.message : "no error"));
	}
	await addEntry(zipWriter, "s1.txt");
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await zipWriter.close()), { checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	if (entries.map(entry => entry.filename).join() != "a.txt,s1.txt" ||
		!contents.every((content, entryIndex) => content == "content of " + entries[entryIndex].filename)) {
		throw new Error("expected the entries written around the failed copy to stay readable");
	}
}

async function keepsThePrependZipGuard() {
	const source = await buildZipFile(["s1.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter, "a.txt");
	let error;
	try {
		await zipWriter.prependZip(new zip.Uint8ArrayReader(source));
	} catch (prependError) {
		error = prependError;
	}
	await zipWriter.close();
	if (!error || error.message != zip.ERR_ZIP_NOT_EMPTY) {
		throw new Error("expected prependZip to reject a non-empty zip, got " + (error ? error.message : "no error"));
	}
}

// the entries left out leave no bytes behind: the output is the archive a direct write of the kept entries
// produces, so the filter is the copy-through edit of an existing zip file
async function copiesOnlyTheFilteredEntries() {
	const source = await buildZipFile(["s1.txt", "s2.txt", "s3.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	const seen = [];
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), {
		filter(entry) {
			seen.push(entry.filename);
			return entry.filename != "s2.txt";
		}
	});
	const output = await zipWriter.close();
	if (seen.join() != "s1.txt,s2.txt,s3.txt") {
		throw new Error("expected the filter to see every entry in order, got " + seen.join());
	}
	const directOutput = await buildZipFile(["s1.txt", "s3.txt"]);
	if (!equalBytes(output, directOutput)) {
		throw new Error("expected the same bytes as a direct write of the kept entries, got " + output.length + " vs " + directOutput.length + " bytes");
	}
	await checkEntries(output, ["s1.txt", "s3.txt"]);
}

// replacing = leaving the entry out and adding its replacement; the duplicate check must only see the kept names
async function replacesAnEntryThroughTheFilter() {
	const source = await buildZipFile(["s1.txt", "s2.txt", "s3.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter, "s2.txt");
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), { filter: entry => entry.filename != "s2.txt" });
	await checkEntries(await zipWriter.close(), ["s2.txt", "s1.txt", "s3.txt"]);
}

async function keepsEveryEntryWithAPermissiveFilter() {
	const source = await buildZipFile(["s1.txt", "s2.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), { filter: () => true });
	const output = await zipWriter.close();
	if (!equalBytes(output, source)) {
		throw new Error("expected a permissive filter to copy the zip file as-is");
	}
}

async function acceptsAnAsyncFilter() {
	const source = await buildZipFile(["s1.txt", "s2.txt", "s3.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), {
		filter: entry => Promise.resolve(entry.filename == "s3.txt")
	});
	await checkEntries(await zipWriter.close(), ["s3.txt"]);
}

// the filter runs before the source is closed, so it can decide on the content of an entry
async function letsTheFilterReadTheEntryData() {
	const source = await buildZipFile(["s1.txt", "s2.txt", "s3.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), {
		filter: async entry => (await entry.getData(new zip.TextWriter())) != "content of s2.txt"
	});
	await checkEntries(await zipWriter.close(), ["s1.txt", "s3.txt"]);
}

// a self-extracting stub before the first entry is copied by a plain appendZip and dropped by a filtered one
async function dropsTheBytesOutsideTheEntriesWhenFiltering() {
	const stub = new TextEncoder().encode("#!/bin/sh\nexit 0\n");
	const archive = await buildZipFile(["s1.txt", "s2.txt"]);
	const source = new Uint8Array(stub.length + archive.length);
	source.set(stub);
	source.set(archive, stub.length);
	const plainWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await plainWriter.appendZip(new zip.Uint8ArrayReader(source));
	const plainOutput = await plainWriter.close();
	if (plainOutput.length != source.length) {
		throw new Error("expected a plain copy to keep the stub, got " + plainOutput.length + " vs " + source.length + " bytes");
	}
	const filteringWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await filteringWriter.appendZip(new zip.Uint8ArrayReader(source), { filter: () => true });
	const filteredOutput = await filteringWriter.close();
	if (!equalBytes(filteredOutput, archive)) {
		throw new Error("expected a filtered copy to drop the stub, got " + filteredOutput.length + " vs " + archive.length + " bytes");
	}
}

// the first disk starts with the split zip file signature whether or not the source carries one: the filter
// copies from the first kept entry, so the signature of the source is never copied
async function filtersIntoASplitZipFile() {
	const filenames = ["s1.txt", "s2.txt", "s3.txt", "s4.txt"];
	await filterIntoASplitZipFile(await buildZipFile(filenames), "a source without the split zip file signature");
	const sourceWriters = [];
	const sourceZipWriter = new zip.ZipWriter(nextDiskWriter(sourceWriters, 1 << 20));
	for (const filename of filenames) {
		await addEntry(sourceZipWriter, filename);
	}
	await sourceZipWriter.close();
	const [splitSource] = await Promise.all(sourceWriters.map(writer => writer.getData()));
	if (sourceWriters.length != 1 || !startsWithSplitZipSignature(splitSource)) {
		throw new Error("expected a single disk starting with the split zip file signature");
	}
	await filterIntoASplitZipFile(splitSource, "a source starting with the split zip file signature");
}

async function filterIntoASplitZipFile(source, description) {
	const writers = [];
	const zipWriter = new zip.ZipWriter(nextDiskWriter(writers, 150));
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), { filter: entry => entry.filename != "s2.txt" && entry.filename != "s4.txt" });
	await addEntry(zipWriter, "a.txt");
	await zipWriter.close();
	const disks = await Promise.all(writers.map(writer => writer.getData()));
	if (disks.length < 2) {
		throw new Error("expected the output to span several disks with " + description + ", got " + disks.length);
	}
	if (!startsWithSplitZipSignature(disks[0])) {
		throw new Error("expected the first disk to start with the split zip file signature with " + description);
	}
	const zipReader = new zip.ZipReader(new zip.SplitDataReader(disks.map(disk => new zip.Uint8ArrayReader(disk))), { strictness: "strict", checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	const filenames = entries.map(entry => entry.filename);
	if (filenames.join() != "s1.txt,s3.txt,a.txt") {
		throw new Error("expected entries s1.txt,s3.txt,a.txt in the split output with " + description + ", got " + filenames.join());
	}
	if (!contents.every((content, entryIndex) => content == "content of " + filenames[entryIndex])) {
		throw new Error("expected the entry contents to be preserved in the split output with " + description);
	}
}

// the bit flag of a copied entry is written as-is, including the bits zip.js never sets itself
async function keepsTheRawBitFlag() {
	const source = await buildZipFile(["s1.txt"]);
	const view = new DataView(source.buffer, source.byteOffset, source.byteLength);
	const centralDirectoryOffset = view.getUint32(source.length - 22 + 16, true);
	view.setUint16(6, view.getUint16(6, true) | RAW_BIT_FLAGS, true);
	view.setUint16(centralDirectoryOffset + 8, view.getUint16(centralDirectoryOffset + 8, true) | RAW_BIT_FLAGS, true);
	for (const options of [{}, { filter: () => true }]) {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.appendZip(new zip.Uint8ArrayReader(source), options);
		const output = await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(output), { strictness: "strict", checkCrc32: true });
		const [entry] = await zipReader.getEntries();
		const content = await entry.getData(new zip.TextWriter());
		await zipReader.close();
		if ((entry.rawBitFlag & RAW_BIT_FLAGS) != RAW_BIT_FLAGS || content != "content of s1.txt") {
			throw new Error("expected the bit flag to be copied as-is, got 0x" + entry.rawBitFlag.toString(16));
		}
	}
}

function* nextDiskWriter(writers, maxSize) {
	while (true) {
		const writer = new zip.Uint8ArrayWriter();
		writer.maxSize = maxSize;
		writers.push(writer);
		yield writer;
	}
}

function startsWithSplitZipSignature(disk) {
	return SPLIT_ZIP_FILE_SIGNATURE.every((byte, index) => disk[index] == byte);
}

async function rejectsAFilterWhichIsNotAFunction() {
	const source = await buildZipFile(["s1.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	let error;
	try {
		await zipWriter.appendZip(new zip.Uint8ArrayReader(source), { filter: "s1.txt" });
	} catch (appendError) {
		error = appendError;
	}
	if (!error || error.message != zip.ERR_INVALID_FUNCTION_OPTION) {
		throw new Error("expected an invalid function option error, got " + (error ? error.message : "no error"));
	}
	await checkEntries(await zipWriter.close(), []);
}

async function buildZipFile(filenames) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (const filename of filenames) {
		await addEntry(zipWriter, filename);
	}
	return zipWriter.close();
}

function addEntry(zipWriter, filename) {
	return zipWriter.add(filename, new zip.TextReader("content of " + filename), { lastModDate: LAST_MOD_DATE });
}

async function checkEntries(data, expectedFilenames, { ignoreOrder } = {}) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict", checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	let filenames = entries.map(entry => entry.filename);
	if (ignoreOrder) {
		filenames = filenames.slice().sort();
		expectedFilenames = expectedFilenames.slice().sort();
	}
	if (filenames.join() != expectedFilenames.join()) {
		throw new Error("expected entries " + expectedFilenames.join() + ", got " + filenames.join());
	}
	if (!contents.every((content, entryIndex) => content == "content of " + entries[entryIndex].filename)) {
		throw new Error("expected the entry contents to be preserved");
	}
}

function equalBytes(first, second) {
	return first.length == second.length && first.every((byte, index) => byte == second[index]);
}
