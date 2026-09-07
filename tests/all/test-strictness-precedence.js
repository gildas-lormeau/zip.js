import * as zip from "../zip-lib.js";

export { test };

const APPENDED_DATA_LENGTH = 30;
const OVER_BALANCED_APPENDED_DATA_LENGTH = 70000;
const PREPENDED_DATA_LENGTH = 64;
const LOCAL_HEADER_CRC32_OFFSET = 14;
const LOCAL_HEADER_FILENAME_OFFSET = 30;
const UNDEFINED_REASON = null;

const CASES = [
	{ name: "no option", readerOptions: {}, callOptions: {}, filenameChecked: false, headerChecked: true },
	{ name: "checkAmbiguity on the call", readerOptions: {}, callOptions: { checkAmbiguity: true }, filenameChecked: true, headerChecked: true },
	{ name: "checkAmbiguity on the reader", readerOptions: { checkAmbiguity: true }, callOptions: {}, filenameChecked: true, headerChecked: true },
	{ name: "strictness on the reader", readerOptions: { strictness: "strict" }, callOptions: {}, filenameChecked: true, headerChecked: true },
	{ name: "checkAmbiguity over a tolerant reader", readerOptions: { strictness: "tolerant" }, callOptions: { checkAmbiguity: true }, filenameChecked: true, headerChecked: true },
	{ name: "checkAmbiguity over a balanced reader", readerOptions: { strictness: "balanced" }, callOptions: { checkAmbiguity: true }, filenameChecked: true, headerChecked: true },
	{ name: "checkAmbiguity false over a strict reader", readerOptions: { strictness: "strict" }, callOptions: { checkAmbiguity: false }, filenameChecked: false, headerChecked: true },
	{ name: "strictness over a checking reader", readerOptions: { checkAmbiguity: true }, callOptions: { strictness: "tolerant" }, filenameChecked: false, headerChecked: false },
	{ name: "strictness wins at the same level", readerOptions: {}, callOptions: { strictness: "tolerant", checkAmbiguity: true }, filenameChecked: false, headerChecked: false }
];

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });
	try {
		const zipData = await createZipData();
		const appendedData = appendData(zipData, APPENDED_DATA_LENGTH);
		const overBalancedData = appendData(zipData, OVER_BALANCED_APPENDED_DATA_LENGTH);
		const mismatchedCrc32Data = patch(zipData, LOCAL_HEADER_CRC32_OFFSET);
		const mismatchedFilenameData = patch(zipData, LOCAL_HEADER_FILENAME_OFFSET);
		for (const testCase of CASES) {
			await assertGetEntries(testCase, appendedData);
			await assertLocalDirectoryChecked(mismatchedFilenameData, testCase.readerOptions, testCase.callOptions, testCase.filenameChecked, `${testCase.name} (filename)`);
			await assertLocalDirectoryChecked(mismatchedCrc32Data, testCase.readerOptions, testCase.callOptions, testCase.headerChecked, `${testCase.name} (crc32)`);
		}
		await assertAccepted(overBalancedData, { strictness: "tolerant" }, { checkAmbiguity: false }, "checkAmbiguity false keeps a tolerant reader tolerant");
		await assertRejected(overBalancedData, { strictness: "balanced" }, { checkAmbiguity: false }, "checkAmbiguity false keeps a balanced reader balanced");
		await assertInvalidStrictness({ strictness: "bogus" }, {}, "invalid strictness on the reader");
		await assertInvalidStrictness({}, { strictness: "bogus" }, "invalid strictness on the call");
		await assertInvalidStrictness({ strictness: "bogus" }, { strictness: "tolerant" }, "invalid strictness on the reader with a valid call value");
		await assertLocalDirectoryChecked(mismatchedFilenameData, {}, { checkLocalDirectory: true }, true, "checkLocalDirectory on the call compares the filename");
		await assertLocalDirectoryChecked(mismatchedFilenameData, { checkLocalDirectory: true }, {}, true, "checkLocalDirectory on the reader compares the filename");
		await assertLocalDirectoryChecked(mismatchedCrc32Data, { checkLocalDirectory: false }, {}, false, "checkLocalDirectory false skips the whole comparison");
		await assertLocalDirectoryChecked(mismatchedCrc32Data, { strictness: "strict" }, { checkLocalDirectory: false }, false, "checkLocalDirectory false over a strict reader");
		await assertLocalDirectoryChecked(mismatchedCrc32Data, { checkLocalDirectory: false }, { strictness: "strict" }, false, "checkLocalDirectory false beats a strict call");
		await assertCheckLocalFilename(mismatchedFilenameData, mismatchedCrc32Data);
		await assertSelfExtracting(mismatchedCrc32Data, mismatchedFilenameData);
		await assertReadCounts();
	} finally {
		await zip.terminateWorkers();
	}
}

async function createZipData(writerOptions = {}) {
	const uint8ArrayWriter = new zip.Uint8ArrayWriter();
	const zipWriter = new zip.ZipWriter(uint8ArrayWriter, { compressionMethod: 0, dataDescriptor: false, ...writerOptions });
	await zipWriter.add("file.txt", new zip.TextReader("content"));
	await zipWriter.close();
	return uint8ArrayWriter.getData();
}

function appendData(zipData, length) {
	const appendedData = new Uint8Array(zipData.length + length);
	appendedData.set(zipData);
	appendedData.fill(0x5a, zipData.length);
	return appendedData;
}

function patch(zipData, offset) {
	const patchedData = zipData.slice();
	patchedData[offset] ^= 0xff;
	return patchedData;
}

async function assertGetEntries(testCase, data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), testCase.readerOptions);
	let rejected = false;
	try {
		await zipReader.getEntries(testCase.callOptions);
	} catch (error) {
		if (error.message != zip.ERR_AMBIGUOUS_ARCHIVE) {
			throw error;
		}
		rejected = true;
	}
	if (rejected !== testCase.filenameChecked) {
		throw new Error(`${testCase.name}: getEntries ${rejected ? "rejected" : "accepted"} appended data, expected the opposite`);
	}
}

async function assertLocalDirectoryChecked(data, readerOptions, callOptions, expected, name) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), readerOptions);
	const entries = await zipReader.getEntries();
	let rejected = false;
	try {
		await entries[0].getData(new zip.Uint8ArrayWriter(), callOptions);
	} catch (error) {
		if (error.message != zip.ERR_AMBIGUOUS_ARCHIVE) {
			throw error;
		}
		rejected = true;
	}
	await zipReader.close();
	if (rejected !== expected) {
		throw new Error(`${name}: getData ${rejected ? "rejected" : "accepted"} a mismatched local file header, expected the opposite`);
	}
}

// checkLocalFilename selects what is compared, checkLocalDirectory decides whether a difference throws or
// warns. The two are separate options because they are separate axes: the filename costs an extra read, the
// severity costs nothing. Their combination is the only way to obtain a mismatched filename as a warning.
async function assertCheckLocalFilename(mismatchedFilenameData, mismatchedCrc32Data) {
	await assertLocalDirectoryWarned(mismatchedFilenameData, { checkLocalFilename: true, checkLocalDirectory: false }, {},
		zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME, "the filename compared while the mismatch only warns");
	await assertLocalDirectoryWarned(mismatchedFilenameData, {}, { checkLocalFilename: true, checkLocalDirectory: false },
		zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME, "the same pair passed to the call");
	await assertLocalDirectoryWarned(mismatchedFilenameData, { strictness: "tolerant", checkLocalFilename: true }, {},
		zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME, "the filename added to a tolerant reader");
	await assertLocalDirectoryWarned(mismatchedFilenameData, { strictness: "strict", checkLocalFilename: false }, {},
		UNDEFINED_REASON, "the filename dropped from a strict reader");
	await assertLocalDirectoryChecked(mismatchedFilenameData, { strictness: "strict", checkLocalFilename: false }, {}, false,
		"checkLocalFilename false drops the filename comparison at strict");
	await assertLocalDirectoryChecked(mismatchedCrc32Data, { strictness: "strict", checkLocalFilename: false }, {}, true,
		"checkLocalFilename false keeps every other strict comparison");
	await assertLocalDirectoryChecked(mismatchedFilenameData, { checkLocalFilename: true }, {}, true,
		"checkLocalFilename true throws at balanced, where checkLocalDirectory still rejects");
	await assertLocalDirectoryChecked(mismatchedFilenameData, { checkLocalFilename: false }, { checkLocalFilename: true }, true,
		"checkLocalFilename on the call beats the reader");
}

async function assertLocalDirectoryWarned(data, readerOptions, callOptions, expectedReason, name) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), readerOptions);
	const [entry] = await zipReader.getEntries();
	await entry.getData(new zip.Uint8ArrayWriter(), callOptions);
	await zipReader.close();
	const reasons = entry.warnings.map(({ reason }) => reason);
	const expectedReasons = expectedReason == UNDEFINED_REASON ? [] : [expectedReason];
	if (reasons.length != expectedReasons.length || reasons.some((reason, index) => reason != expectedReasons[index])) {
		throw new Error(`${name}: expected ${JSON.stringify(expectedReasons)} on the entry, got ${JSON.stringify(reasons)}`);
	}
}

async function assertSelfExtracting(mismatchedCrc32Data, mismatchedFilenameData) {
	const readerOptions = { extractPrependedData: true };
	await assertLocalDirectoryChecked(prependData(mismatchedCrc32Data), readerOptions, {}, true, "self-extracting archive compares the header by default");
	await assertLocalDirectoryChecked(prependData(mismatchedFilenameData), readerOptions, {}, false, "self-extracting archive skips the filename by default");
	await assertLocalDirectoryChecked(prependData(mismatchedFilenameData), { ...readerOptions, checkLocalDirectory: true }, {}, true, "self-extracting archive compares the filename on request");
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(prependData(mismatchedCrc32Data)), { ...readerOptions, checkAmbiguity: true });
	try {
		await zipReader.getEntries();
	} catch (error) {
		if (error.reason != zip.WARNING_PREPENDED_DATA) {
			throw error;
		}
		return;
	}
	throw new Error("self-extracting archive: checkAmbiguity was expected to reject prepended data");
}

function prependData(zipData) {
	const prependedData = new Uint8Array(PREPENDED_DATA_LENGTH + zipData.length);
	prependedData.fill(0x4d, 0, PREPENDED_DATA_LENGTH);
	prependedData.set(zipData, PREPENDED_DATA_LENGTH);
	return prependedData;
}

async function assertReadCounts() {
	const data = await createZipData({ extendedTimestamp: false });
	const counts = {};
	for (const [label, readerOptions] of [
		["tolerant", { strictness: "tolerant" }],
		["balanced", { strictness: "balanced" }],
		["strict", { strictness: "strict" }],
		["strictWithoutFilename", { strictness: "strict", checkLocalFilename: false }],
		["tolerantWithFilename", { strictness: "tolerant", checkLocalFilename: true }]
	]) {
		counts[label] = await countGetDataReads(data, readerOptions);
	}
	if (counts.balanced !== counts.tolerant) {
		throw new Error(`the balanced local file header comparison must read nothing extra, got ${counts.balanced} reads against ${counts.tolerant}`);
	}
	if (counts.strict <= counts.tolerant) {
		throw new Error(`comparing the filename must read the filename, got ${counts.strict} reads against ${counts.tolerant}`);
	}
	// the extra read follows the filename comparison, not the strictness, in both directions
	if (counts.strictWithoutFilename !== counts.tolerant) {
		throw new Error(`checkLocalFilename false must drop the filename read at strict, got ${counts.strictWithoutFilename} reads against ${counts.tolerant}`);
	}
	if (counts.tolerantWithFilename !== counts.strict) {
		throw new Error(`checkLocalFilename true must add the filename read at tolerant, got ${counts.tolerantWithFilename} reads against ${counts.strict}`);
	}
}

async function countGetDataReads(data, readerOptions) {
	let reads = 0;
	const countingReader = new zip.Uint8ArrayReader(data);
	const readUint8Array = countingReader.readUint8Array.bind(countingReader);
	countingReader.readUint8Array = (offset, length) => {
		reads++;
		return readUint8Array(offset, length);
	};
	const zipReader = new zip.ZipReader(countingReader, readerOptions);
	const entries = await zipReader.getEntries();
	const readsBeforeGetData = reads;
	await entries[0].getData(new zip.Uint8ArrayWriter());
	await zipReader.close();
	return reads - readsBeforeGetData;
}

async function assertAccepted(data, readerOptions, callOptions, name) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), readerOptions);
	const entries = await zipReader.getEntries(callOptions);
	await zipReader.close();
	if (entries.length != 1) {
		throw new Error(`${name}: expected 1 entry`);
	}
}

async function assertRejected(data, readerOptions, callOptions, name) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), readerOptions);
	try {
		await zipReader.getEntries(callOptions);
	} catch (error) {
		if (error.message != zip.ERR_AMBIGUOUS_ARCHIVE) {
			throw error;
		}
		return;
	}
	throw new Error(`${name}: expected an ambiguous archive error`);
}

async function assertInvalidStrictness(readerOptions, callOptions, name) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await createZipData()), readerOptions);
	try {
		await zipReader.getEntries(callOptions);
	} catch (error) {
		if (error.message != zip.ERR_INVALID_STRICTNESS) {
			throw error;
		}
		return;
	}
	throw new Error(`${name}: expected an invalid strictness error`);
}
