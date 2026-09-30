import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 0x07064b50;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await testTruncatedZip64EndOfDirectory();
		await testInvalidZip64Locator();
		await testTruncatedZip64ExtraField();
		await testTruncatedExtraFields();
	} finally {
		await zip.terminateWorkers();
	}
}

// a file containing only an end of central directory record with a zip64
// sentinel must fail with a zip.js error, not an uncaught RangeError
async function testTruncatedZip64EndOfDirectory() {
	const array = new Uint8Array(22);
	const view = new DataView(array.buffer);
	view.setUint32(0, END_OF_CENTRAL_DIR_SIGNATURE, true);
	view.setUint16(8, 0xFFFF, true);
	view.setUint16(10, 0xFFFF, true);
	await expectControlledError(array, zip.ERR_CENTRAL_DIRECTORY_NOT_FOUND);
}

// a zip64 locator whose offset points past the end of the file must fail
// with a zip.js error, not an uncaught RangeError
async function testInvalidZip64Locator() {
	const array = new Uint8Array(42);
	const view = new DataView(array.buffer);
	view.setUint32(0, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE, true);
	view.setBigUint64(8, 0xFFFFFFn, true);
	view.setUint32(16, 1, true);
	view.setUint32(20, END_OF_CENTRAL_DIR_SIGNATURE, true);
	view.setUint32(20 + 16, 0xFFFFFFFF, true);
	await expectControlledError(array, zip.ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
}

// a zip64 extra field too short for the properties it must resolve must fail
// with a zip.js error, not an uncaught RangeError
async function testTruncatedZip64ExtraField() {
	const array = addCentralDirectoryExtraField(await writeZip(), new Uint8Array([0x01, 0x00, 0x00, 0x00]), (view, directoryOffset) => {
		view.setUint32(directoryOffset + 24, 0xFFFFFFFF, true);
	});
	await expectControlledError(array, zip.ERR_EXTRAFIELD_ZIP64_NOT_FOUND, { strictness: "strict" });
	await expectDeferredError(array, zip.ERR_EXTRAFIELD_ZIP64_NOT_FOUND, zip.WARNING_MISSING_ZIP64_EXTRA_FIELD);
}

// truncated Unicode path, AES and extended timestamp extra fields must be
// ignored instead of triggering an uncaught RangeError
async function testTruncatedExtraFields() {
	const extraField = new Uint8Array([
		0x75, 0x70, 0x01, 0x00, 0x2a,
		0x01, 0x99, 0x02, 0x00, 0x2a, 0x2a,
		0x55, 0x54, 0x00, 0x00
	]);
	const array = addCentralDirectoryExtraField(await writeZip(), extraField);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array));
	const entries = await zipReader.getEntries();
	const text = await entries[0].getData(new zip.TextWriter());
	await zipReader.close();
	if (entries[0].filename != FILENAME || text != TEXT_CONTENT) {
		throw new Error();
	}
}

async function writeZip() {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { level: 0, dataDescriptor: false, extendedTimestamp: false });
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	return new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
}

function addCentralDirectoryExtraField(array, extraField, patchDirectoryRecord) {
	const view = new DataView(array.buffer);
	const endOfDirectoryOffset = array.length - 22;
	const directoryOffset = view.getUint32(endOfDirectoryOffset + 16, true);
	const filenameLength = view.getUint16(directoryOffset + 28, true);
	if (view.getUint16(directoryOffset + 30, true) != 0) {
		throw new Error("unexpected extra field in the central directory");
	}
	const insertOffset = directoryOffset + 46 + filenameLength;
	const result = new Uint8Array(array.length + extraField.length);
	result.set(array.subarray(0, insertOffset), 0);
	result.set(extraField, insertOffset);
	result.set(array.subarray(insertOffset), insertOffset + extraField.length);
	const resultView = new DataView(result.buffer);
	resultView.setUint16(directoryOffset + 30, extraField.length, true);
	resultView.setUint32(endOfDirectoryOffset + extraField.length + 12, view.getUint32(endOfDirectoryOffset + 12, true) + extraField.length, true);
	if (patchDirectoryRecord) {
		patchDirectoryRecord(resultView, directoryOffset);
	}
	return result;
}

async function expectControlledError(array, expectedMessage, options) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), options);
	try {
		await zipReader.getEntries();
		throw new Error("no error thrown");
	} catch (error) {
		if (error.message != expectedMessage) {
			throw error;
		}
	} finally {
		await zipReader.close();
	}
}

// at the default strictness the archive stays listable: the damaged entry is reported as a warning and
// only reading its data throws
async function expectDeferredError(array, expectedMessage, expectedReason) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array));
	try {
		const [entry] = await zipReader.getEntries();
		if (!zipReader.warnings.some(warning => warning.reason == expectedReason)) {
			throw new Error("expected the warning " + JSON.stringify(expectedReason) + ", got " + JSON.stringify(zipReader.warnings));
		}
		try {
			await entry.getData(new zip.TextWriter());
			throw new Error("no error thrown when reading the entry");
		} catch (error) {
			if (error.message != expectedMessage) {
				throw error;
			}
		}
	} finally {
		await zipReader.close();
	}
}
