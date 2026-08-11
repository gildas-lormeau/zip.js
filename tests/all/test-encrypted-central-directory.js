import * as zip from "../zip-lib.js";

export { test };

async function test() {
	const errorEncrypted = await getEntriesError(buildArchive(true));
	const errorCorrupted = await getEntriesError(buildArchive(false));
	await zip.terminateWorkers();
	if (!errorEncrypted || errorEncrypted.message != zip.ERR_ENCRYPTED_CENTRAL_DIRECTORY ||
		!errorCorrupted || errorCorrupted.message != zip.ERR_CENTRAL_DIRECTORY_NOT_FOUND) {
		throw new Error();
	}
}

async function getEntriesError(data) {
	try {
		await new zip.ZipReader(new zip.Uint8ArrayReader(data)).getEntries();
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
