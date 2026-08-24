/* global TextEncoder */

import * as zip from "../zip-lib.js";

export { test };

const END_OF_CENTRAL_DIR_LENGTH = 22;
const JUNK_LENGTH = 16;

// The warnings channel deposits non-fatal diagnostics on ZipReader#warnings during getEntries() and
// on the entry during getData(), only from bytes the parse already read. A check the "strict" mode
// rejects deposits the same reason string at the lower strictness levels instead of throwing.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await checkCleanArchive();
		await checkAppendedData();
		await checkPrependedData();
		await checkUnknownVersion();
		await checkCompressedPatchedData();
		await checkUnsortedCentralDirectory();
		await checkDuplicateFilename();
		await checkMalformedCentralExtraField();
		await checkMalformedLocalExtraField();
		await checkTrailingCentralDirectoryData();
		await checkMismatchedLocalFileHeader();
		await checkUnknownZip64ExtensibleData();
		await checkMismatchedZip64EndOfCentralDirectory();
	} finally {
		await zip.terminateWorkers();
	}
}

async function checkCleanArchive() {
	const data = await buildArchive();
	const { reader, entries } = await readEntries(data);
	assert(!reader.warnings.length, "a well-formed archive must not deposit warnings");
	await entries[0].getData(new zip.TextWriter());
	assert(!entries[0].warnings.length, "a well-formed entry must not deposit warnings");
}

async function checkAppendedData() {
	const data = concat(await buildArchive(), new Uint8Array(JUNK_LENGTH));
	const { reader } = await readEntries(data);
	assertWarning(reader.warnings, zip.WARNING_APPENDED_DATA);
	await assertStrictRejection(data, zip.WARNING_APPENDED_DATA);
}

async function checkPrependedData() {
	const data = concat(new Uint8Array(JUNK_LENGTH), await buildArchive());
	const { reader, entries } = await readEntries(data);
	assertWarning(reader.warnings, zip.WARNING_PREPENDED_DATA);
	assert(entries.length == 2, "the entries must stay readable behind prepended data");
	await assertStrictRejection(data, zip.WARNING_PREPENDED_DATA);
}

async function checkUnknownVersion() {
	const { reader } = await readEntries(await buildArchive({ version: 70 }));
	const warning = assertWarning(reader.warnings, zip.WARNING_UNKNOWN_VERSION);
	assert(warning.filename == "aa.txt", "the warning must name the first offending entry");
	assert(reader.warnings.length == 1, "a repeated reason must be deposited once");
	const { reader: stampedReader } = await readEntries(await buildArchive({ version: 778 }));
	assert(!stampedReader.warnings.length, "a host byte in the high byte of the version must not warn");
}

async function checkCompressedPatchedData() {
	const data = await buildArchive();
	const view = getView(data);
	const centralDirectoryOffset = view.getUint32(findEndOfCentralDirectory(data) + 16, true);
	data[centralDirectoryOffset + 8] |= 0x20;
	const { reader, entries } = await readEntries(data);
	assertWarning(reader.warnings, zip.WARNING_COMPRESSED_PATCHED_DATA);
	assert(entries.length == 2, "the entries must stay listed with the patched data bit set");
}

async function checkUnsortedCentralDirectory() {
	const data = await buildArchive();
	const view = getView(data);
	const endOfDirectoryOffset = findEndOfCentralDirectory(data);
	const centralDirectoryOffset = view.getUint32(endOfDirectoryOffset + 16, true);
	const centralDirectoryLength = view.getUint32(endOfDirectoryOffset + 12, true);
	const recordLength = centralDirectoryLength / 2;
	assert(recordLength == Math.floor(recordLength), "the two central directory records must have the same length");
	const firstRecord = data.slice(centralDirectoryOffset, centralDirectoryOffset + recordLength);
	data.copyWithin(centralDirectoryOffset, centralDirectoryOffset + recordLength, centralDirectoryOffset + centralDirectoryLength);
	data.set(firstRecord, centralDirectoryOffset + recordLength);
	const { reader, entries } = await readEntries(data);
	assertWarning(reader.warnings, zip.WARNING_UNSORTED_CENTRAL_DIRECTORY);
	await entries[0].getData(new zip.TextWriter());
	await entries[1].getData(new zip.TextWriter());
}

async function checkDuplicateFilename() {
	const data = await buildArchive();
	renameEntry(data, "bb.txt", "aa.txt");
	const { reader } = await readEntries(data);
	assertWarning(reader.warnings, zip.WARNING_DUPLICATE_FILENAME);
	await assertStrictRejection(data, zip.WARNING_DUPLICATE_FILENAME);
}

async function checkMalformedCentralExtraField() {
	const data = await buildArchive();
	const view = getView(data);
	const centralDirectoryOffset = view.getUint32(findEndOfCentralDirectory(data) + 16, true);
	const filenameLength = view.getUint16(centralDirectoryOffset + 28, true);
	const extraFieldLength = view.getUint16(centralDirectoryOffset + 30, true);
	assert(extraFieldLength > 0, "the central directory record must carry an extra field to corrupt");
	view.setUint16(centralDirectoryOffset + 46 + filenameLength + 2, 0xff, true);
	const { reader, entries } = await readEntries(data);
	const warning = assertWarning(reader.warnings, zip.WARNING_MALFORMED_EXTRA_FIELD);
	assert(warning.filename == "aa.txt", "the warning must name the entry with the malformed extra field");
	assert(entries.length == 2, "the entries must stay listed with a malformed extra field");
}

async function checkMalformedLocalExtraField() {
	const data = await buildArchive();
	const view = getView(data);
	const localFilenameLength = view.getUint16(26, true);
	const localExtraFieldLength = view.getUint16(28, true);
	assert(localExtraFieldLength > 0, "the local header must carry an extra field to corrupt");
	view.setUint16(30 + localFilenameLength + 2, 0xff, true);
	const { reader, entries } = await readEntries(data);
	assert(!reader.warnings.length, "a local extra field issue must not deposit an archive-level warning");
	await entries[0].getData(new zip.TextWriter());
	assertWarning(entries[0].warnings, zip.WARNING_MALFORMED_EXTRA_FIELD);
	await entries[1].getData(new zip.TextWriter());
	assert(!entries[1].warnings.length, "the intact entry must not deposit warnings");
}

async function checkTrailingCentralDirectoryData() {
	const original = await buildArchive();
	const view = getView(original);
	const endOfDirectoryOffset = findEndOfCentralDirectory(original);
	const centralDirectoryOffset = view.getUint32(endOfDirectoryOffset + 16, true);
	const centralDirectoryLength = view.getUint32(endOfDirectoryOffset + 12, true);
	const junk = new Uint8Array(8).fill(0xaa);
	const data = concat(original.subarray(0, centralDirectoryOffset + centralDirectoryLength), junk,
		original.subarray(centralDirectoryOffset + centralDirectoryLength));
	const declared = data.slice();
	getView(declared).setUint32(endOfDirectoryOffset + junk.length + 12, centralDirectoryLength + junk.length, true);
	for (const [label, bytes] of [["declared", declared], ["undeclared gap", data]]) {
		const { reader, entries } = await readEntries(bytes);
		assertWarning(reader.warnings, zip.WARNING_TRAILING_CENTRAL_DIRECTORY_DATA);
		assert(entries.length == 2, "the entries must stay listed with " + label + " trailing central directory data");
		const content = await entries[0].getData(new zip.TextWriter());
		assert(content == "first content", "the entries must stay readable with " + label + " trailing central directory data");
		await assertStrictRejection(bytes, zip.WARNING_TRAILING_CENTRAL_DIRECTORY_DATA);
	}
}

async function checkMismatchedLocalFileHeader() {
	const data = await buildArchive();
	getView(data).setUint16(8, 8, true);
	const { entries } = await readEntries(data, { strictness: "tolerant" });
	const content = await entries[0].getData(new zip.TextWriter());
	assert(content == "first content", "the content must be read from the central directory metadata");
	assertWarning(entries[0].warnings, zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD);
	const { entries: checkedEntries } = await readEntries(data);
	try {
		await checkedEntries[0].getData(new zip.TextWriter());
	} catch (error) {
		assert(error.message.startsWith(zip.ERR_AMBIGUOUS_ARCHIVE) &&
			error.reason == zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD,
		"the balanced mode must reject the mismatched local file header");
		return;
	}
	throw new Error("the balanced mode must reject the mismatched local file header");
}

async function checkUnknownZip64ExtensibleData() {
	const original = await buildArchive({}, { zip64: true });
	const view = getView(original);
	const endOfDirectoryOffset = findEndOfCentralDirectory(original);
	const zip64Offset = Number(view.getBigUint64(endOfDirectoryOffset - 12, true));
	const extensibleData = new Uint8Array(JUNK_LENGTH).fill(0xaa);
	const data = concat(original.subarray(0, zip64Offset + 56), extensibleData, original.subarray(zip64Offset + 56));
	getView(data).setBigUint64(zip64Offset + 4, BigInt(44 + JUNK_LENGTH), true);
	const { reader, entries } = await readEntries(data);
	assertWarning(reader.warnings, zip.WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA);
	assert(entries.length == 2, "the entries must stay listed with unknown zip64 extensible data");
}

async function checkMismatchedZip64EndOfCentralDirectory() {
	const data = await buildArchive({}, { zip64: true });
	const view = getView(data);
	const endOfDirectoryOffset = findEndOfCentralDirectory(data);
	const zip64Offset = Number(view.getBigUint64(endOfDirectoryOffset - 12, true));
	view.setUint16(endOfDirectoryOffset + 6, 0, true);
	view.setUint32(zip64Offset + 20, 1, true);
	const { reader, entries } = await readEntries(data);
	assertWarning(reader.warnings, zip.WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
	assert(entries.length == 2, "the entries must stay listed with a mismatched zip64 record");
	await assertStrictRejection(data, zip.WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
}

async function buildArchive(options = {}, writerOptions = {}) {
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter(), Object.assign({ level: 0 }, writerOptions));
	await writer.add("aa.txt", new zip.TextReader("first content"), options);
	await writer.add("bb.txt", new zip.TextReader("second content"), options);
	return writer.close();
}

async function readEntries(data, options) {
	const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data), options);
	try {
		const entries = await reader.getEntries();
		return { reader, entries };
	} finally {
		await reader.close();
	}
}

async function assertStrictRejection(data, reason) {
	try {
		await readEntries(data, { strictness: "strict" });
	} catch (error) {
		assert(error.message.startsWith(zip.ERR_AMBIGUOUS_ARCHIVE) && error.reason == reason,
			"the strict mode must reject the archive with the reason " + JSON.stringify(reason));
		return;
	}
	throw new Error("the strict mode must reject the archive deposited as " + JSON.stringify(reason));
}

function renameEntry(data, fromFilename, toFilename) {
	const fromBytes = new TextEncoder().encode(fromFilename);
	const toBytes = new TextEncoder().encode(toFilename);
	assert(fromBytes.length == toBytes.length, "the renamed filenames must have the same length");
	let renamed = 0;
	for (let indexByte = 0; indexByte <= data.length - fromBytes.length; indexByte++) {
		if (fromBytes.every((byteValue, indexFromByte) => data[indexByte + indexFromByte] == byteValue)) {
			data.set(toBytes, indexByte);
			renamed++;
		}
	}
	assert(renamed == 2, "the filename must be replaced in the local and central records");
}

function findEndOfCentralDirectory(data) {
	const view = getView(data);
	for (let offset = data.length - END_OF_CENTRAL_DIR_LENGTH; offset >= 0; offset--) {
		if (view.getUint32(offset, true) == 0x06054b50) {
			return offset;
		}
	}
	throw new Error("end of central directory record not found");
}

function getView(data) {
	return new DataView(data.buffer, data.byteOffset, data.byteLength);
}

function concat(...arrays) {
	const result = new Uint8Array(arrays.reduce((length, array) => length + array.length, 0));
	let offset = 0;
	for (const array of arrays) {
		result.set(array, offset);
		offset += array.length;
	}
	return result;
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function assertWarning(warnings, reason) {
	const warning = warnings.find(warning => warning.reason == reason);
	assert(warning, "the warnings must contain the reason " + JSON.stringify(reason) +
		", got " + JSON.stringify(warnings.map(warning => warning.reason)));
	return warning;
}
