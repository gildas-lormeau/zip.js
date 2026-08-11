/* global URL */

import * as zip from "../zip-lib.js";

const secureZipUrl = new URL("./../data/lorem-secure-full.zip", import.meta.url).href;

export { test };

async function test() {
	const errorEncrypted = await getEntriesError(new zip.Uint8ArrayReader(buildArchive(true)));
	const errorCorrupted = await getEntriesError(new zip.Uint8ArrayReader(buildArchive(false)));
	const errorSecureZip = await getEntriesError(new zip.HttpReader(secureZipUrl, { preventHeadRequest: true }));
	await zip.terminateWorkers();
	if (!errorEncrypted || errorEncrypted.message != zip.ERR_ENCRYPTED_CENTRAL_DIRECTORY ||
		!errorCorrupted || errorCorrupted.message != zip.ERR_CENTRAL_DIRECTORY_NOT_FOUND ||
		!errorSecureZip || errorSecureZip.message != zip.ERR_ENCRYPTED_CENTRAL_DIRECTORY) {
		throw new Error();
	}
}

async function getEntriesError(reader) {
	try {
		await new zip.ZipReader(reader).getEntries();
	} catch (error) {
		return error;
	}
}

function buildArchive(withArchiveExtraDataRecord) {
	const data = new Uint8Array(78);
	const view = new DataView(data.buffer);
	for (let indexByte = 0; indexByte < 56; indexByte++) {
		data[indexByte] = (indexByte * 37 + 11) & 0xff;
	}
	if (withArchiveExtraDataRecord) {
		view.setUint32(16, 0x08064b50, true);
		view.setUint32(20, 8, true);
	}
	view.setUint32(56, 0x06054b50, true);
	view.setUint16(64, 2, true);
	view.setUint16(66, 2, true);
	view.setUint32(68, 56, true);
	view.setUint32(72, 0, true);
	return data;
}
