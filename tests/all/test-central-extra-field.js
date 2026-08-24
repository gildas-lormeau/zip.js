/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const FILENAME = "lorem.txt";
const CENTRAL_EXTRA_FIELD_TYPE = 0x6c78;
const CENTRAL_EXTRA_FIELD_DATA = new Uint8Array([5, 6, 7, 8]);
const LOCAL_EXTRA_FIELD_TYPE = 0x0202;
const LOCAL_EXTRA_FIELD_DATA = new Uint8Array([9]);
const SHARED_EXTRA_FIELD_TYPE = 0x0101;
const SHARED_EXTRA_FIELD_DATA = new Uint8Array([1, 2, 3, 4]);

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await testCentralExtraField();
		await testInvalidType();
		await testInvalidData();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testCentralExtraField() {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.BlobReader(new Blob([TEXT_CONTENT])), {
		extraField: new Map([[SHARED_EXTRA_FIELD_TYPE, SHARED_EXTRA_FIELD_DATA]]),
		localExtraField: new Map([[LOCAL_EXTRA_FIELD_TYPE, LOCAL_EXTRA_FIELD_DATA]]),
		centralExtraField: new Map([[CENTRAL_EXTRA_FIELD_TYPE, CENTRAL_EXTRA_FIELD_DATA]])
	});
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	try {
		const entries = await zipReader.getEntries();
		const entry = entries[0];
		const centralExtraField = entry.extraField.get(CENTRAL_EXTRA_FIELD_TYPE);
		if (!centralExtraField ||
			centralExtraField.data.length != CENTRAL_EXTRA_FIELD_DATA.length ||
			centralExtraField.data.some((value, indexValue) => value != CENTRAL_EXTRA_FIELD_DATA[indexValue]) ||
			entry.extraField.get(LOCAL_EXTRA_FIELD_TYPE) ||
			!entry.extraField.get(SHARED_EXTRA_FIELD_TYPE)) {
			throw new Error("unexpected extra fields in the central directory record");
		}
		const text = await entry.getData(new zip.TextWriter());
		if (text != TEXT_CONTENT) {
			throw new Error();
		}
		const { localDirectory } = entry;
		if (localDirectory.extraField.get(CENTRAL_EXTRA_FIELD_TYPE) ||
			!localDirectory.extraField.get(LOCAL_EXTRA_FIELD_TYPE) ||
			!localDirectory.extraField.get(SHARED_EXTRA_FIELD_TYPE)) {
			throw new Error("unexpected extra fields in the local file header");
		}
	} finally {
		await zipReader.close();
	}
}

async function testInvalidType() {
	const errorMessage = await writeInvalidEntry(new Map([[0x10000, new Uint8Array(4)]]));
	if (errorMessage != zip.ERR_INVALID_EXTRAFIELD_TYPE) {
		throw new Error();
	}
}

async function testInvalidData() {
	const errorMessage = await writeInvalidEntry(new Map([[CENTRAL_EXTRA_FIELD_TYPE, new Uint8Array(65536)]]));
	if (errorMessage != zip.ERR_INVALID_EXTRAFIELD_DATA) {
		throw new Error();
	}
}

async function writeInvalidEntry(centralExtraField) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	let errorMessage;
	try {
		await zipWriter.add(FILENAME, new zip.BlobReader(new Blob([TEXT_CONTENT])), { centralExtraField });
	} catch (error) {
		errorMessage = error.message;
	}
	await zipWriter.close();
	return errorMessage;
}
