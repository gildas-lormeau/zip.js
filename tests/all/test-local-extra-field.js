/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const FILENAME = "lorem.txt";
const UNIX_TYPE1_EXTRA_FIELD_TYPE = 0x5855;
const CUSTOM_EXTRA_FIELD_TYPE = 0x0101;
const CUSTOM_EXTRA_FIELD_DATA = new Uint8Array([1, 2, 3, 4]);
const ATIME = new Date(Date.UTC(2026, 2, 4, 5, 6, 7));
const MTIME = new Date(Date.UTC(2026, 0, 2, 3, 4, 5));
const UID = 1234;
const GID = 4321;
const LAST_MOD_DATE = new Date(2030, 5, 15, 10, 20, 24);

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await testLocalExtraField();
		await testInvalidType();
		await testInvalidData();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testLocalExtraField() {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	const data = new Uint8Array(12);
	const dataView = new DataView(data.buffer);
	dataView.setUint32(0, ATIME.getTime() / 1000, true);
	dataView.setUint32(4, MTIME.getTime() / 1000, true);
	dataView.setUint16(8, UID, true);
	dataView.setUint16(10, GID, true);
	await zipWriter.add(FILENAME, new zip.BlobReader(new Blob([TEXT_CONTENT])), {
		lastModDate: LAST_MOD_DATE,
		extraField: new Map([[CUSTOM_EXTRA_FIELD_TYPE, CUSTOM_EXTRA_FIELD_DATA]]),
		localExtraField: new Map([[UNIX_TYPE1_EXTRA_FIELD_TYPE, data]])
	});
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	try {
		const entries = await zipReader.getEntries();
		const entry = entries[0];
		if (entry.extraField.get(UNIX_TYPE1_EXTRA_FIELD_TYPE) ||
			entry.extraFieldUnixType1 ||
			entry.extraField.get(CUSTOM_EXTRA_FIELD_TYPE).data.length != CUSTOM_EXTRA_FIELD_DATA.length ||
			entry.lastModDate.getTime() != LAST_MOD_DATE.getTime()) {
			throw new Error();
		}
		const text = await entry.getData(new zip.TextWriter());
		if (text != TEXT_CONTENT) {
			throw new Error();
		}
		const { localDirectory } = entry;
		const localExtraField = localDirectory.extraField.get(UNIX_TYPE1_EXTRA_FIELD_TYPE);
		const customExtraField = localDirectory.extraField.get(CUSTOM_EXTRA_FIELD_TYPE);
		if (localExtraField.data.length != 12 ||
			customExtraField.data.length != CUSTOM_EXTRA_FIELD_DATA.length ||
			localDirectory.extraFieldUnixType1.uid != UID ||
			localDirectory.extraFieldUnixType1.gid != GID ||
			localDirectory.extraFieldUnixType1.lastModDate.getTime() != MTIME.getTime() ||
			localDirectory.extraFieldUnixType1.lastAccessDate.getTime() != ATIME.getTime()) {
			throw new Error();
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
	const errorMessage = await writeInvalidEntry(new Map([[CUSTOM_EXTRA_FIELD_TYPE, new Uint8Array(65536)]]));
	if (errorMessage != zip.ERR_INVALID_EXTRAFIELD_DATA) {
		throw new Error();
	}
}

async function writeInvalidEntry(localExtraField) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	let errorMessage;
	try {
		await zipWriter.add(FILENAME, new zip.BlobReader(new Blob([TEXT_CONTENT])), { localExtraField });
	} catch (error) {
		errorMessage = error.message;
	}
	await zipWriter.close();
	return errorMessage;
}
