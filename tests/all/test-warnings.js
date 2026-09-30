/* global TextEncoder, ReadableStream */

import * as zip from "../zip-lib.js";
import { readTextFromReadable } from "../stream-helpers.js";

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
		await checkPrependedCentralDirectory();
		await checkUnknownVersion();
		await checkCompressedPatchedData();
		await checkUnsortedCentralDirectory();
		await checkDuplicateFilename();
		await checkMalformedCentralExtraField();
		await checkMalformedLocalExtraField();
		await checkTrailingCentralDirectoryData();
		await checkMismatchedCentralDirectoryOffset();
		await checkCentralDirectoryOffsetPastTheEnd();
		await checkCentralDirectoryOffsetBeforeTheDirectory();
		await checkShiftedZip64Offsets();
		await checkMissingZip64ExtraField();
		await checkMismatchedLocalFileHeader();
		await checkUnknownZip64ExtensibleData();
		await checkMismatchedZip64EndOfCentralDirectory();
		await checkReaderStreamChunk();
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

// two archives with the same layout concatenated: the stored central directory offset of the last
// one lands exactly on the central directory of the first, so both offsets dereference and readers
// disagree on which archive the file holds (7-Zip reports the first, Info-ZIP and zip.js the last)
async function checkPrependedCentralDirectory() {
	const archive = await buildArchive();
	const data = concat(archive, await buildArchive());
	const { reader, entries } = await readEntries(data);
	assertWarning(reader.warnings, zip.WARNING_PREPENDED_CENTRAL_DIRECTORY);
	assertWarning(reader.warnings, zip.WARNING_PREPENDED_DATA);
	assert(entries.length == 2, "the entries of the last archive must be reported");
	await assertStrictRejection(data, zip.WARNING_PREPENDED_DATA);
	const { reader: benignReader } = await readEntries(concat(new Uint8Array(archive.length), archive));
	assertWarning(benignReader.warnings, zip.WARNING_PREPENDED_DATA);
	assert(!benignReader.warnings.some(warning => warning.reason == zip.WARNING_PREPENDED_CENTRAL_DIRECTORY),
		"a prefix holding no central directory must not deposit the warning");
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

// the stored central directory offset points past the directory actually found: first with intact local
// header offsets (a damaged end of central directory record), then with every offset shifted by the same
// amount (an archive written with absolute offsets whose prefix was removed), whose entries must be found
// at the shifted positions
async function checkMismatchedCentralDirectoryOffset() {
	const damaged = await buildArchive();
	const damagedView = getView(damaged);
	const endOfDirectoryOffset = findEndOfCentralDirectory(damaged);
	damagedView.setUint32(endOfDirectoryOffset + 16, damagedView.getUint32(endOfDirectoryOffset + 16, true) + 1, true);
	const shifted = await buildArchive();
	const shiftedView = getView(shifted);
	const centralDirectoryOffset = shiftedView.getUint32(endOfDirectoryOffset + 16, true);
	const centralDirectoryLength = shiftedView.getUint32(endOfDirectoryOffset + 12, true);
	shiftedView.setUint32(endOfDirectoryOffset + 16, centralDirectoryOffset + JUNK_LENGTH, true);
	for (let offset = centralDirectoryOffset; offset < centralDirectoryOffset + centralDirectoryLength; offset += centralDirectoryLength / 2) {
		shiftedView.setUint32(offset + 42, shiftedView.getUint32(offset + 42, true) + JUNK_LENGTH, true);
	}
	for (const [label, data] of [["a damaged end of central directory record", damaged], ["shifted offsets", shifted]]) {
		const { reader, entries } = await readEntries(data);
		assertWarning(reader.warnings, zip.WARNING_MISMATCHED_CENTRAL_DIRECTORY_OFFSET);
		assert(!reader.warnings.some(warning => warning.reason == zip.WARNING_PREPENDED_DATA),
			"no data is prepended with " + label);
		assert(entries.length == 2, "the entries must stay listed with " + label);
		assert(await entries[0].getData(new zip.TextWriter()) == "first content", "the first entry must stay readable with " + label);
		assert(await entries[1].getData(new zip.TextWriter()) == "second content", "the second entry must stay readable with " + label);
		await assertStrictRejection(data, zip.WARNING_MISMATCHED_CENTRAL_DIRECTORY_OFFSET);
	}
}

// the stored central directory offset lands past the end of the file or too close to it to hold a record:
// first damaged records with intact entries, then archives written behind a prefix later removed whose
// comment or zip64 records sit between the central directory and the end of the file
async function checkCentralDirectoryOffsetPastTheEnd() {
	const damaged = await buildArchive();
	const endOfDirectoryOffset = findEndOfCentralDirectory(damaged);
	getView(damaged).setUint32(endOfDirectoryOffset + 16, damaged.length + JUNK_LENGTH, true);
	const truncated = await buildArchive();
	getView(truncated).setUint32(endOfDirectoryOffset + 16, truncated.length - 2, true);
	const commented = await buildArchive({}, {}, new TextEncoder().encode("archive comment"));
	shiftOffsets(commented, commented.length + JUNK_LENGTH);
	const zip64 = await buildArchive({}, { zip64: true });
	shiftOffsets(zip64, zip64.length + JUNK_LENGTH);
	const cases = [
		["a damaged end of central directory record", damaged],
		["a stored offset just before the end of the file", truncated],
		["a removed prefix and a comment", commented],
		["a removed prefix and zip64 records", zip64]
	];
	for (const [label, data] of cases) {
		const { reader, entries } = await readEntries(data);
		assertWarning(reader.warnings, zip.WARNING_MISMATCHED_CENTRAL_DIRECTORY_OFFSET);
		assert(!reader.warnings.some(warning => warning.reason == zip.WARNING_PREPENDED_DATA),
			"no data is prepended with " + label);
		assert(entries.length == 2, "the entries must stay listed with " + label);
		assert(await entries[0].getData(new zip.TextWriter()) == "first content", "the first entry must stay readable with " + label);
		assert(await entries[1].getData(new zip.TextWriter()) == "second content", "the second entry must stay readable with " + label);
		await assertStrictRejection(data, zip.WARNING_MISMATCHED_CENTRAL_DIRECTORY_OFFSET);
	}
}

// the stored central directory offset lands before the directory while the entries sit where their records
// say: a damaged offset, then a declared length short of exactly one record whose count matches, both of which
// used to be diagnosed as prepended data with every entry shifted past its local file header
async function checkCentralDirectoryOffsetBeforeTheDirectory() {
	const damaged = await buildArchive();
	const endOfDirectoryOffset = findEndOfCentralDirectory(damaged);
	const damagedView = getView(damaged);
	damagedView.setUint32(endOfDirectoryOffset + 16, damagedView.getUint32(endOfDirectoryOffset + 16, true) - 1, true);
	const shortened = await buildArchive();
	const shortenedView = getView(shortened);
	const centralDirectoryLength = shortenedView.getUint32(endOfDirectoryOffset + 12, true);
	shortenedView.setUint32(endOfDirectoryOffset + 12, centralDirectoryLength / 2, true);
	shortenedView.setUint16(endOfDirectoryOffset + 8, 1, true);
	shortenedView.setUint16(endOfDirectoryOffset + 10, 1, true);
	for (const [label, data, filenames] of [["a damaged offset", damaged, ["aa.txt", "bb.txt"]], ["a shortened directory", shortened, ["bb.txt"]]]) {
		const { reader, entries } = await readEntries(data, { extractPrependedData: true });
		assertWarning(reader.warnings, zip.WARNING_MISMATCHED_CENTRAL_DIRECTORY_OFFSET);
		assert(entries.map(entry => entry.filename).join() == filenames.join(), "the entries must stay listed with " + label);
		assert(reader.warnings.some(warning => warning.reason == zip.WARNING_PREPENDED_DATA) == (entries[0].offset > 0),
			"the bytes before the first listed entry are the prepended data with " + label);
		assert(reader.prependedData.length == entries[0].offset, "the prepended data must stop at the first listed entry with " + label);
		for (const entry of entries) {
			assert(await entry.getData(new zip.TextWriter()) == (entry.filename == "aa.txt" ? "first content" : "second content"),
				entry.filename + " must stay readable with " + label);
		}
		await assertStrictRejection(data, zip.WARNING_MISMATCHED_CENTRAL_DIRECTORY_OFFSET);
	}
}

// the offsets of the records are saturated and resolved by their zip64 extra fields, and every offset is off by
// the same amount, as after a removed prefix: the probe deciding whether the entries moved must read the zip64
// field rather than the sentinel
async function checkShiftedZip64Offsets() {
	const data = saturateOffsets(await buildArchive(), JUNK_LENGTH);
	const { reader, entries } = await readEntries(data);
	assertWarning(reader.warnings, zip.WARNING_MISMATCHED_CENTRAL_DIRECTORY_OFFSET);
	assert(!reader.warnings.some(warning => warning.reason == zip.WARNING_PREPENDED_DATA), "no data is prepended with shifted zip64 offsets");
	assert(entries.length == 2, "the entries must stay listed with shifted zip64 offsets");
	assert(await entries[0].getData(new zip.TextWriter()) == "first content", "the first entry must stay readable with shifted zip64 offsets");
	assert(await entries[1].getData(new zip.TextWriter()) == "second content", "the second entry must stay readable with shifted zip64 offsets");
	const { reader: intactReader, entries: intactEntries } = await readEntries(saturateOffsets(await buildArchive(), 0));
	assert(!intactReader.warnings.length, "saturated offsets resolved by zip64 fields must not warn");
	assert(await intactEntries[1].getData(new zip.TextWriter()) == "second content", "the entries must stay readable with saturated offsets");
}

// one central directory record carries the Zip64 sentinel in its compressed size or in its offset with no Zip64
// extra field: that entry is unreadable but fully parsed otherwise, the other one must stay listed and readable,
// the sentinel offset must not pass for a position, and strict rejects the archive
async function checkMissingZip64ExtraField() {
	for (const [label, fieldOffset] of [["compressed size", 20], ["offset", 42]]) {
		const data = await buildArchive();
		const view = getView(data);
		const centralDirectoryOffset = view.getUint32(findEndOfCentralDirectory(data) + 16, true);
		view.setUint32(centralDirectoryOffset + fieldOffset, 0xffffffff, true);
		const { reader, entries } = await readEntries(data);
		const warning = assertWarning(reader.warnings, zip.WARNING_MISSING_ZIP64_EXTRA_FIELD);
		assert(warning.filename == "aa.txt", "the warning must name the entry lacking the zip64 field in its " + label);
		assert(reader.warnings.length == 1, "no other warning must be deposited with a sentinel " + label +
			", got " + JSON.stringify(reader.warnings.map(warning => warning.reason)));
		assert(entries.length == 2, "the other entries must stay listed with a sentinel " + label);
		assert(entries[0].compressionMethod === 0, "the damaged entry must be parsed past its sentinel " + label);
		assert(await entries[1].getData(new zip.TextWriter()) == "second content", "the intact entry must stay readable with a sentinel " + label);
		let error;
		try {
			await entries[0].getData(new zip.TextWriter());
		} catch (thrown) {
			error = thrown;
		}
		assert(error && error.message == zip.ERR_EXTRAFIELD_ZIP64_NOT_FOUND, "reading the damaged entry must fail with the zip64 field error");
		let strictError;
		try {
			await readEntries(data, { strictness: "strict" });
		} catch (thrown) {
			strictError = thrown;
		}
		assert(strictError && strictError.message == zip.ERR_EXTRAFIELD_ZIP64_NOT_FOUND, "strict must reject the archive with the zip64 field error");
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
	const { reader: prependedReader, entries: prependedEntries } = await readEntries(concat(new Uint8Array(JUNK_LENGTH), data));
	assertWarning(prependedReader.warnings, zip.WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA);
	assertWarning(prependedReader.warnings, zip.WARNING_PREPENDED_DATA);
	assert(prependedEntries.length == 2, "the entries must stay listed behind prepended data with zip64 extensible data");
	assert(await prependedEntries[1].getData(new zip.TextWriter()) == "second content", "the entries must stay readable behind prepended data with zip64 extensible data");
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

// The chunks of a ZipReaderStream are built from the entry, which getData() enriches while the data
// is read, so a chunk must expose what getData() deposits rather than a copy taken before it ran.
async function checkReaderStreamChunk() {
	const data = await buildArchive();
	getView(data).setUint16(8, 8, true);
	const source = new ReadableStream({
		start(controller) {
			controller.enqueue(data);
			controller.close();
		}
	});
	const entriesStream = source.pipeThrough(new zip.ZipReaderStream({ strictness: "tolerant" }));
	const reader = entriesStream.getReader();
	const chunks = [];
	for (; ;) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		await readTextFromReadable(value.readable);
		chunks.push(value);
	}
	const [chunk] = chunks;
	assert(chunks.length == 2, "every entry of the archive must be streamed, got " + chunks.length);
	assert(chunk.localDirectory, "a chunk must expose the local directory deposited by getData()");
	assert(chunk.localDirectory.compressionMethod == 8, "the local directory of the chunk must hold the local header values");
	assertWarning(chunk.warnings, zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD);
	assert(chunk.getData === undefined, "a chunk must not expose getData()");
	reader.releaseLock();
}

async function buildArchive(options = {}, writerOptions = {}, comment) {
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter(), Object.assign({ level: 0 }, writerOptions));
	await writer.add("aa.txt", new zip.TextReader("first content"), options);
	await writer.add("bb.txt", new zip.TextReader("second content"), options);
	return writer.close(comment);
}

// rebuilds the central directory with saturated offsets resolved by zip64 extra fields, every offset shifted
// by delta bytes, and a stored central directory offset shifted by the same amount
function saturateOffsets(data, delta) {
	const view = getView(data);
	const endOfDirectoryOffset = findEndOfCentralDirectory(data);
	const centralDirectoryOffset = view.getUint32(endOfDirectoryOffset + 16, true);
	const records = [];
	let offset = centralDirectoryOffset;
	while (offset < endOfDirectoryOffset) {
		const recordLength = 46 + view.getUint16(offset + 28, true) + view.getUint16(offset + 30, true) + view.getUint16(offset + 32, true);
		const record = new Uint8Array(recordLength + 12);
		record.set(data.subarray(offset, offset + recordLength));
		const recordView = getView(record);
		recordView.setUint16(recordLength, 0x0001, true);
		recordView.setUint16(recordLength + 2, 8, true);
		recordView.setBigUint64(recordLength + 4, BigInt(recordView.getUint32(42, true) + delta), true);
		recordView.setUint16(6, 45, true);
		recordView.setUint32(42, 0xffffffff, true);
		recordView.setUint16(30, recordView.getUint16(30, true) + 12, true);
		records.push(record);
		offset += recordLength;
	}
	const result = concat(data.subarray(0, centralDirectoryOffset), ...records, data.subarray(endOfDirectoryOffset));
	const resultView = getView(result);
	const resultEndOfDirectoryOffset = findEndOfCentralDirectory(result);
	resultView.setUint32(resultEndOfDirectoryOffset + 12, records.reduce((length, record) => length + record.length, 0), true);
	resultView.setUint32(resultEndOfDirectoryOffset + 16, centralDirectoryOffset + delta, true);
	return result;
}

// rewrites every offset as if the archive had been written behind a prefix of delta bytes
function shiftOffsets(data, delta) {
	const view = getView(data);
	const endOfDirectoryOffset = findEndOfCentralDirectory(data);
	let centralDirectoryOffset = view.getUint32(endOfDirectoryOffset + 16, true);
	if (centralDirectoryOffset == 0xffffffff) {
		const zip64Offset = Number(view.getBigUint64(endOfDirectoryOffset - 12, true));
		centralDirectoryOffset = Number(view.getBigUint64(zip64Offset + 48, true));
		view.setBigUint64(zip64Offset + 48, BigInt(centralDirectoryOffset + delta), true);
	} else {
		view.setUint32(endOfDirectoryOffset + 16, centralDirectoryOffset + delta, true);
	}
	for (let offset = centralDirectoryOffset; view.getUint32(offset, true) == 0x02014b50;
		offset += 46 + view.getUint16(offset + 28, true) + view.getUint16(offset + 30, true) + view.getUint16(offset + 32, true)) {
		assert(view.getUint32(offset + 42, true) != 0xffffffff, "the local header offsets must fit in 32 bits");
		view.setUint32(offset + 42, view.getUint32(offset + 42, true) + delta, true);
	}
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
