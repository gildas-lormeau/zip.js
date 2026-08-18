import * as zip from "../zip-lib.js";

export { test };

const APPENDED_DATA_LENGTH = 30;
const OVER_BALANCED_APPENDED_DATA_LENGTH = 70000;
const LOCAL_HEADER_CRC32_OFFSET = 14;

const CASES = [
	{ name: "no option", readerOptions: {}, callOptions: {}, strict: false },
	{ name: "checkAmbiguity on the call", readerOptions: {}, callOptions: { checkAmbiguity: true }, strict: true },
	{ name: "checkAmbiguity on the reader", readerOptions: { checkAmbiguity: true }, callOptions: {}, strict: true },
	{ name: "strictness on the reader", readerOptions: { strictness: "strict" }, callOptions: {}, strict: true },
	{ name: "checkAmbiguity over a tolerant reader", readerOptions: { strictness: "tolerant" }, callOptions: { checkAmbiguity: true }, strict: true },
	{ name: "checkAmbiguity over a balanced reader", readerOptions: { strictness: "balanced" }, callOptions: { checkAmbiguity: true }, strict: true },
	{ name: "checkAmbiguity false over a strict reader", readerOptions: { strictness: "strict" }, callOptions: { checkAmbiguity: false }, strict: false },
	{ name: "strictness over a checking reader", readerOptions: { checkAmbiguity: true }, callOptions: { strictness: "tolerant" }, strict: false },
	{ name: "strictness wins at the same level", readerOptions: {}, callOptions: { strictness: "tolerant", checkAmbiguity: true }, strict: false }
];

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });
	try {
		const zipData = await createZipData();
		const appendedData = appendData(zipData, APPENDED_DATA_LENGTH);
		const overBalancedData = appendData(zipData, OVER_BALANCED_APPENDED_DATA_LENGTH);
		const mismatchedData = zipData.slice();
		mismatchedData[LOCAL_HEADER_CRC32_OFFSET] ^= 0xff;
		for (const testCase of CASES) {
			await assertGetEntries(testCase, appendedData);
			await assertGetData(testCase, mismatchedData);
		}
		await assertAccepted(overBalancedData, { strictness: "tolerant" }, { checkAmbiguity: false }, "checkAmbiguity false keeps a tolerant reader tolerant");
		await assertRejected(overBalancedData, { strictness: "balanced" }, { checkAmbiguity: false }, "checkAmbiguity false keeps a balanced reader balanced");
		await assertInvalidStrictness({ strictness: "bogus" }, {}, "invalid strictness on the reader");
		await assertInvalidStrictness({}, { strictness: "bogus" }, "invalid strictness on the call");
		await assertInvalidStrictness({ strictness: "bogus" }, { strictness: "tolerant" }, "invalid strictness on the reader with a valid call value");
	} finally {
		await zip.terminateWorkers();
	}
}

async function createZipData() {
	const uint8ArrayWriter = new zip.Uint8ArrayWriter();
	const zipWriter = new zip.ZipWriter(uint8ArrayWriter, { compressionMethod: 0, dataDescriptor: false });
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
	if (rejected !== testCase.strict) {
		throw new Error(`${testCase.name}: getEntries ${rejected ? "rejected" : "accepted"} appended data, expected the opposite`);
	}
}

async function assertGetData(testCase, data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), testCase.readerOptions);
	const entries = await zipReader.getEntries();
	let rejected = false;
	try {
		await entries[0].getData(new zip.Uint8ArrayWriter(), testCase.callOptions);
	} catch (error) {
		if (error.message != zip.ERR_AMBIGUOUS_ARCHIVE) {
			throw error;
		}
		rejected = true;
	}
	await zipReader.close();
	if (rejected !== testCase.strict) {
		throw new Error(`${testCase.name}: getData ${rejected ? "rejected" : "accepted"} a mismatched local file header, expected the opposite`);
	}
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
