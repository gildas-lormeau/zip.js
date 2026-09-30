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
		await passesTheExistingEntryToTheFilter();
		await keepsEveryEntryWithAPermissiveFilter();
		await acceptsAnAsyncFilter();
		await letsTheFilterReadTheEntryData();
		await dropsTheBytesOutsideTheEntriesWhenFiltering();
		await dropsTheBytesBetweenTheEntriesWhenFiltering();
		await filtersIntoASplitZipFile();
		await keepsTheRawBitFlag();
		await rejectsARecordPointingInsideAKeptEntry();
		await rejectsARecordPointingPastTheCentralDirectory();
		await rejectsAnEntryWithoutItsZip64Field();
		await rejectsDuplicateFilenamesInTheSource();
		await leavesTheFilterEntriesUntouched();
		await readsTheSourceWithTheReaderOptions();
		await letsTheFilterReadEncryptedEntriesWithTheReaderOptions();
		await rejectsReaderOptionsWhichAreNotAnObject();
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

// the flag says bytes of a broken entry were written: a source failing before the first byte leaves the output intact
async function marksAFailedCopyAsCorrupted() {
	const cleanSource = await buildZipFile(["s1.txt"]);
	const throwingReader = new zip.Uint8ArrayReader(cleanSource);
	const readUint8ArrayClean = throwingReader.readUint8Array.bind(throwingReader);
	throwingReader.readUint8Array = (index, length, ...args) => {
		if (index == 0 && length > 30 && length < cleanSource.length) {
			throw new Error("failing reader");
		}
		return readUint8ArrayClean(index, length, ...args);
	};
	const cleanWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	let cleanError;
	try {
		await cleanWriter.appendZip(throwingReader, { filter: () => true });
	} catch (appendError) {
		cleanError = appendError;
	}
	if (!cleanError || cleanError.corruptedEntry || cleanWriter.hasCorruptedEntries) {
		throw new Error("expected a source failing before the first copied byte to leave the zip clean, got " + (cleanError ? cleanError.message : "no error"));
	}
	await cleanWriter.close();
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

// the filter sees the entry of the current zip sharing the name, whether add() or a previous appendZip wrote it,
// so a duplicate policy is a return value: keep the existing entry, replace it through remove(), or compare them
async function passesTheExistingEntryToTheFilter() {
	const source = await buildZipFile(["s1.txt", "s2.txt", "s3.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	const addedEntry = await addEntry(zipWriter, "s2.txt");
	await zipWriter.appendZip(new zip.Uint8ArrayReader(await buildZipFile(["s3.txt"])));
	const seen = new Map();
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), {
		filter(entry, existingEntry) {
			seen.set(entry.filename, existingEntry);
			return !existingEntry;
		}
	});
	const existingAdded = seen.get("s2.txt");
	const existingAppended = seen.get("s3.txt");
	if (seen.size != 3 || seen.get("s1.txt") !== undefined || !existingAdded || !existingAppended) {
		throw new Error("expected the filter to receive the existing entries of s2.txt and s3.txt only, got " + Array.from(seen.keys()).join());
	}
	if (existingAdded.filename != "s2.txt" || existingAdded.crc32 != addedEntry.crc32 || existingAdded.uncompressedSize != addedEntry.uncompressedSize ||
		existingAdded.lastModDate.getTime() != LAST_MOD_DATE.getTime() || existingAppended.filename != "s3.txt" || existingAppended.crc32 === undefined) {
		throw new Error("expected the existing entries to carry the metadata of the written entries");
	}
	await checkEntries(await zipWriter.close(), ["s2.txt", "s3.txt", "s1.txt"]);
	const replacingWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await replacingWriter.add("s2.txt", new zip.TextReader("old content"), { lastModDate: LAST_MOD_DATE });
	await replacingWriter.appendZip(new zip.Uint8ArrayReader(source), {
		filter(entry, existingEntry) {
			if (existingEntry) {
				if (existingEntry.crc32 == entry.crc32) {
					return false;
				}
				if (!replacingWriter.remove(existingEntry)) {
					throw new Error("expected the existing entry to be removable from the filter");
				}
			}
			return true;
		}
	});
	// the removed entry leaves its bytes at the start of the output, which the strict level reports as prepended data
	await checkEntries(await replacingWriter.close(), ["s1.txt", "s2.txt", "s3.txt"], { strictness: "balanced" });
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

// the bytes left by a removed entry and the padding between two entries are dropped as well, whatever the
// data descriptor layout of the entries: the end of a kept entry is read back from the zip file
async function dropsTheBytesBetweenTheEntriesWhenFiltering() {
	const layouts = [{}, { dataDescriptor: false }, { zip64: true }, { dataDescriptorSignature: false }, { zip64: true, dataDescriptorSignature: false }];
	for (const writerOptions of layouts) {
		const description = JSON.stringify(writerOptions);
		const directOutput = await buildZipFile(["a.txt", "b.txt"], writerOptions);
		const sourceWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), writerOptions);
		await addEntry(sourceWriter, "a.txt");
		await sourceWriter.add("x.txt", new zip.TextReader("x".repeat(160)), { lastModDate: LAST_MOD_DATE });
		await addEntry(sourceWriter, "b.txt");
		sourceWriter.remove("x.txt");
		const removedSource = await sourceWriter.close();
		await expectFilteredOutput(removedSource, directOutput, "a removed entry with " + description);
		const padding = new Uint8Array(7).fill(0xaa);
		const view = new DataView(directOutput.buffer, directOutput.byteOffset, directOutput.byteLength);
		const centralDirectoryOffset = getCentralDirectoryOffset(view);
		const secondRecordOffset = centralDirectoryOffset + 46 + view.getUint16(centralDirectoryOffset + 28, true) +
			view.getUint16(centralDirectoryOffset + 30, true) + view.getUint16(centralDirectoryOffset + 32, true);
		const secondEntryOffset = view.getUint32(secondRecordOffset + 42, true);
		if (secondEntryOffset == 0xffffffff) {
			throw new Error("expected a 32-bit offset in the second record with " + description);
		}
		const paddedSource = new Uint8Array(directOutput.length + padding.length);
		paddedSource.set(directOutput.subarray(0, secondEntryOffset));
		paddedSource.set(padding, secondEntryOffset);
		paddedSource.set(directOutput.subarray(secondEntryOffset), secondEntryOffset + padding.length);
		const paddedView = new DataView(paddedSource.buffer, paddedSource.byteOffset, paddedSource.byteLength);
		paddedView.setUint32(secondRecordOffset + padding.length + 42, secondEntryOffset + padding.length, true);
		setCentralDirectoryOffset(paddedView, centralDirectoryOffset + padding.length, padding.length);
		await expectFilteredOutput(paddedSource, directOutput, "padding between the entries with " + description);
	}
}

function getCentralDirectoryOffset(view) {
	const offset = view.getUint32(view.byteLength - 22 + 16, true);
	if (offset != 0xffffffff) {
		return offset;
	}
	const zip64Offset = Number(view.getBigUint64(view.byteLength - 22 - 12, true));
	return Number(view.getBigUint64(zip64Offset + 48, true));
}

function setCentralDirectoryOffset(view, centralDirectoryOffset, delta) {
	if (view.getUint32(view.byteLength - 22 + 16, true) != 0xffffffff) {
		view.setUint32(view.byteLength - 22 + 16, centralDirectoryOffset, true);
	} else {
		const zip64Offset = Number(view.getBigUint64(view.byteLength - 22 - 12, true)) + delta;
		view.setBigUint64(view.byteLength - 22 - 12, BigInt(zip64Offset), true);
		view.setBigUint64(zip64Offset + 48, BigInt(centralDirectoryOffset), true);
	}
}

async function expectFilteredOutput(source, expectedOutput, description) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), { filter: () => true });
	const output = await zipWriter.close();
	if (!equalBytes(output, expectedOutput)) {
		throw new Error("expected the same bytes as a direct write of the kept entries with " + description + ", got " + output.length + " vs " + expectedOutput.length + " bytes");
	}
	await checkEntries(output, ["a.txt", "b.txt"]);
}

// the regions copied by a filter come from the central directory offsets, so a record lying about its offset
// must be caught before any byte is written: an unkept record inside a kept entry would truncate it silently
async function rejectsARecordPointingInsideAKeptEntry() {
	const source = await buildZipFile(["a.txt", "b.txt", "c.txt"]);
	setRecordOffset(source, 1, 10);
	await expectAppendZipError(source, { filter: entry => entry.filename != "b.txt" }, zip.ERR_OVERLAPPING_ENTRY, "an unkept record inside a kept entry");
	await expectAppendZipError(source, { filter: () => true }, zip.ERR_OVERLAPPING_ENTRY, "a kept record inside another entry");
}

async function rejectsARecordPointingPastTheCentralDirectory() {
	const source = await buildZipFile(["a.txt", "b.txt"]);
	const view = new DataView(source.buffer, source.byteOffset, source.byteLength);
	setRecordOffset(source, 1, view.getUint32(source.length - 22 + 16, true) + 8);
	await expectAppendZipError(source, { filter: () => true }, zip.ERR_LOCAL_FILE_HEADER_NOT_FOUND, "a kept record past the central directory");
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), { filter: entry => entry.filename == "a.txt" });
	const output = await zipWriter.close();
	const directoryOffset = new DataView(output.buffer, output.byteOffset, output.byteLength).getUint32(output.length - 22 + 16, true);
	if (directoryOffset > view.getUint32(source.length - 22 + 16, true)) {
		throw new Error("expected the copied region to stop at the central directory of the source");
	}
	await checkEntries(output, ["a.txt"]);
}

async function expectAppendZipError(source, options, expectedMessage, description) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter, "x.txt");
	let error;
	try {
		await zipWriter.appendZip(new zip.Uint8ArrayReader(source), options);
	} catch (appendError) {
		error = appendError;
	}
	if (!error || error.message != expectedMessage) {
		throw new Error("expected " + expectedMessage + " with " + description + ", got " + (error ? error.message : "no error"));
	}
	if (zipWriter.hasCorruptedEntries) {
		throw new Error("expected nothing to be written with " + description);
	}
	await addEntry(zipWriter, "y.txt");
	await checkEntries(await zipWriter.close(), ["x.txt", "y.txt"]);
}

// a Zip64 sentinel without a Zip64 extra field leaves the entry with unusable sizes (compressed size field) or an
// unusable offset (offset field); appendZip must refuse to copy it rather than write an unreadable entry
async function rejectsAnEntryWithoutItsZip64Field() {
	for (const [fieldOffset, description] of [[20, "a sentinel compressed size"], [42, "a sentinel offset"]]) {
		const source = await buildZipFile(["a.txt", "b.txt"]);
		setRecordField(source, 0, fieldOffset, 0xffffffff);
		await expectAppendZipError(source, {}, zip.ERR_EXTRAFIELD_ZIP64_NOT_FOUND, description + " without a filter");
		await expectAppendZipError(source, { filter: () => true }, zip.ERR_EXTRAFIELD_ZIP64_NOT_FOUND, description + " kept by the filter");
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.appendZip(new zip.Uint8ArrayReader(source), { filter: entry => entry.filename == "b.txt" });
		await checkEntries(await zipWriter.close(), ["b.txt"]);
	}
}

// a ZipWriter holds one entry per filename, so a source whose own names repeat is rejected before any byte is
// written unless the filter keeps one of them
async function rejectsDuplicateFilenamesInTheSource() {
	const source = await buildZipFile(["a.txt", "b.txt"]);
	const view = new DataView(source.buffer, source.byteOffset, source.byteLength);
	const secondEntryOffset = view.getUint32(getRecordOffset(view, 1) + 42, true);
	const filename = new TextEncoder().encode("a.txt");
	source.set(filename, secondEntryOffset + 30);
	source.set(filename, getRecordOffset(view, 1) + 46);
	await expectAppendZipError(source, {}, zip.ERR_DUPLICATED_NAME, "a source with duplicate filenames");
	await expectAppendZipError(source, { filter: () => true }, zip.ERR_DUPLICATED_NAME, "duplicate filenames kept by the filter");
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), { filter: entry => entry.offset == 0 });
	await checkEntries(await zipWriter.close(), ["a.txt"]);
}

// the entries passed to the filter belong to the caller once the callback returns: the copy must not rewrite
// their offsets or hang the fields of the rebuilt central directory on them
async function leavesTheFilterEntriesUntouched() {
	const source = await buildZipFile(["s1.txt", "s2.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter, "a.txt");
	const seen = [];
	const snapshots = [];
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), {
		filter(entry) {
			seen.push(entry);
			snapshots.push(snapshotEntry(entry));
			return true;
		}
	});
	const output = await zipWriter.close();
	seen.forEach((entry, entryIndex) => {
		if (snapshotEntry(entry) != snapshots[entryIndex]) {
			throw new Error("expected the entry " + entry.filename + " seen by the filter to stay unchanged, got " + snapshotEntry(entry));
		}
	});
	await checkEntries(output, ["a.txt", "s1.txt", "s2.txt"]);
}

function snapshotEntry(entry) {
	return JSON.stringify({ keys: Object.keys(entry).sort(), offset: entry.offset, extraFieldLength: entry.rawExtraField.length });
}

function getRecordOffset(view, indexRecord) {
	let recordOffset = view.getUint32(view.byteLength - 22 + 16, true);
	for (let index = 0; index < indexRecord; index++) {
		recordOffset += 46 + view.getUint16(recordOffset + 28, true) + view.getUint16(recordOffset + 30, true) + view.getUint16(recordOffset + 32, true);
	}
	return recordOffset;
}

function setRecordOffset(source, indexRecord, offset) {
	setRecordField(source, indexRecord, 42, offset);
}

function setRecordField(source, indexRecord, fieldOffset, value) {
	const view = new DataView(source.buffer, source.byteOffset, source.byteLength);
	view.setUint32(getRecordOffset(view, indexRecord) + fieldOffset, value, true);
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

// the source is read with the default reader options unless readerOptions says otherwise: a zip file the reader
// rejects by default, here for an unsafe filename, can still be copied as-is
async function readsTheSourceWithTheReaderOptions() {
	const source = await buildZipFile(["../evil.txt", "ok.txt"]);
	await expectAppendZipError(source, {}, zip.ERR_UNSAFE_FILENAME, "an unsafe filename without reader options");
	for (const options of [{ readerOptions: { filenameValidation: "tolerant" } }, { readerOptions: { strictness: "tolerant" }, filter: () => true }]) {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.appendZip(new zip.Uint8ArrayReader(source), options);
		const output = await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(output), { filenameValidation: "tolerant", checkCrc32: true });
		const entries = await zipReader.getEntries();
		const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
		await zipReader.close();
		if (entries.map(entry => entry.filename).join() != "../evil.txt,ok.txt" || contents.join() != "content of ../evil.txt,content of ok.txt") {
			throw new Error("expected the entries to be copied as-is with " + JSON.stringify(options) + ", got " + entries.map(entry => entry.filename).join());
		}
	}
}

async function letsTheFilterReadEncryptedEntriesWithTheReaderOptions() {
	const sourceWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { password: "secret" });
	await addEntry(sourceWriter, "s1.txt");
	await addEntry(sourceWriter, "s2.txt");
	const source = await sourceWriter.close();
	const readData = entry => entry.getData(new zip.TextWriter());
	let error;
	const failingWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	try {
		await failingWriter.appendZip(new zip.Uint8ArrayReader(source), { filter: readData });
	} catch (appendError) {
		error = appendError;
	}
	await failingWriter.close();
	if (!error || error.message != zip.ERR_ENCRYPTED) {
		throw new Error("expected the filter to fail reading an encrypted entry without a password, got " + (error ? error.message : "no error"));
	}
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source), {
		readerOptions: { password: "secret" },
		filter: async entry => (await readData(entry)) == "content of s2.txt"
	});
	const output = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(output), { password: "secret", strictness: "strict", checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(readData));
	await zipReader.close();
	if (entries.map(entry => entry.filename).join() != "s2.txt" || contents.join() != "content of s2.txt") {
		throw new Error("expected the encrypted entry chosen by the filter to be copied, got " + entries.map(entry => entry.filename).join());
	}
}

async function rejectsReaderOptionsWhichAreNotAnObject() {
	const source = await buildZipFile(["s1.txt"]);
	for (const readerOptions of ["secret", ["secret"]]) {
		await expectAppendZipError(source, { readerOptions }, zip.ERR_INVALID_READER_OPTIONS, "readerOptions " + JSON.stringify(readerOptions));
	}
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

async function buildZipFile(filenames, writerOptions = {}) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), writerOptions);
	for (const filename of filenames) {
		await addEntry(zipWriter, filename);
	}
	return zipWriter.close();
}

function addEntry(zipWriter, filename) {
	return zipWriter.add(filename, new zip.TextReader("content of " + filename), { lastModDate: LAST_MOD_DATE });
}

async function checkEntries(data, expectedFilenames, { ignoreOrder, strictness = "strict" } = {}) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness, checkCrc32: true });
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
