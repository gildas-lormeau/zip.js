/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });
const PASSWORD = "password";
const SALT_LENGTH = 16;
const PASSWORD_VERIFICATION_LENGTH = 2;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB), { password: PASSWORD, level: 0 });
	await zipWriter.close();
	const array = new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
	if (await readEntry(array) != TEXT_CONTENT) {
		throw new Error();
	}
	const view = new DataView(array.buffer, array.byteOffset, array.length);
	const filenameLength = view.getUint16(26, true);
	const extraFieldLength = view.getUint16(28, true);
	const encryptedDataOffset = 30 + filenameLength + extraFieldLength + SALT_LENGTH + PASSWORD_VERIFICATION_LENGTH;
	array[encryptedDataOffset + 16] ^= 0x01;
	try {
		await readEntry(array);
		throw new Error();
	} catch (error) {
		if (error.message != zip.ERR_INVALID_AUTHENTICATION_CODE) {
			throw error;
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function readEntry(array) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array));
	try {
		const entries = await zipReader.getEntries();
		return await entries[0].getData(new zip.TextWriter(), { password: PASSWORD });
	} finally {
		await zipReader.close();
	}
}
