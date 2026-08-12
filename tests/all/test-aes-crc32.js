/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });
const PASSWORD = "password";
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const AES_EXTRA_FIELD_TYPE = 0x9901;
const AE_1_VERSION = 1;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	if (zip.ERR_INVALID_CRC32 != zip.ERR_INVALID_SIGNATURE || zip.ERR_INVALID_AUTHENTICATION_CODE != zip.ERR_INVALID_SIGNATURE) {
		throw new Error();
	}
	try {
		const plainEntry = await readEntryMetadata(await writeEntry());
		if (plainEntry.crc32 === undefined || plainEntry.crc32 != plainEntry.signature) {
			throw new Error();
		}
		const crc32 = plainEntry.crc32;
		const aes2Data = await writeEntry(PASSWORD);
		const aes2Entry = await readEntryMetadata(aes2Data);
		if (aes2Entry.crc32 !== undefined || aes2Entry.signature != 0 || aes2Entry.extraFieldAES.vendorVersion != 2) {
			throw new Error();
		}
		if (await readEntry(aes2Data, { checkCrc32: true }) != TEXT_CONTENT) {
			throw new Error();
		}
		const ae1Data = patchAE1(aes2Data, crc32);
		const ae1Entry = await readEntryMetadata(ae1Data);
		if (ae1Entry.crc32 != crc32 || ae1Entry.extraFieldAES.vendorVersion != AE_1_VERSION) {
			throw new Error();
		}
		if (await readEntry(ae1Data, { checkCrc32: true }) != TEXT_CONTENT) {
			throw new Error();
		}
		const corruptedAe1Data = patchAE1(aes2Data, crc32 ^ 0xffffffff);
		if (await readEntry(corruptedAe1Data) != TEXT_CONTENT) {
			throw new Error();
		}
		await expectError(corruptedAe1Data, { checkCrc32: true }, zip.ERR_INVALID_CRC32);
		await expectError(corruptedAe1Data, { checkSignature: true }, zip.ERR_INVALID_CRC32);
		const tamperedData = tamperAuthenticationCode(aes2Data);
		await expectError(tamperedData, {}, zip.ERR_INVALID_AUTHENTICATION_CODE);
		if (await readEntry(tamperedData, { checkAuthenticationCode: false }) != TEXT_CONTENT) {
			throw new Error();
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function writeEntry(password) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { dataDescriptor: false });
	const entry = await zipWriter.add(FILENAME, new zip.BlobReader(BLOB), { password });
	await zipWriter.close();
	if (password && (entry.signature !== undefined || entry.crc32 !== undefined)) {
		throw new Error();
	}
	return new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
}

async function readEntryMetadata(array) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array));
	try {
		const entries = await zipReader.getEntries();
		return entries[0];
	} finally {
		await zipReader.close();
	}
}

async function readEntry(array, options) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array));
	try {
		const entries = await zipReader.getEntries();
		return await entries[0].getData(new zip.TextWriter(), Object.assign({ password: PASSWORD }, options));
	} finally {
		await zipReader.close();
	}
}

async function expectError(array, options, message) {
	try {
		await readEntry(array, options);
		throw new Error();
	} catch (error) {
		if (error.message != message) {
			throw error;
		}
	}
}

function patchAE1(data, crc32) {
	const array = data.slice();
	const view = new DataView(array.buffer);
	view.setUint32(14, crc32, true);
	patchAESVersion(view, 30 + view.getUint16(26, true), view.getUint16(28, true));
	const centralDirectoryOffset = findCentralDirectoryOffset(view, array.length);
	view.setUint32(centralDirectoryOffset + 16, crc32, true);
	patchAESVersion(view,
		centralDirectoryOffset + 46 + view.getUint16(centralDirectoryOffset + 28, true),
		view.getUint16(centralDirectoryOffset + 30, true));
	return array;
}

function patchAESVersion(view, offset, length) {
	const endOffset = offset + length;
	while (offset < endOffset) {
		const type = view.getUint16(offset, true);
		const size = view.getUint16(offset + 2, true);
		if (type == AES_EXTRA_FIELD_TYPE) {
			view.setUint16(offset + 4, AE_1_VERSION, true);
		}
		offset += 4 + size;
	}
}

function tamperAuthenticationCode(data) {
	const array = data.slice();
	const view = new DataView(array.buffer);
	const dataOffset = 30 + view.getUint16(26, true) + view.getUint16(28, true);
	const centralDirectoryOffset = findCentralDirectoryOffset(view, array.length);
	const compressedSize = view.getUint32(centralDirectoryOffset + 20, true);
	array[dataOffset + compressedSize - 1] ^= 0x01;
	return array;
}

function findCentralDirectoryOffset(view, length) {
	for (let offset = length - 22; offset >= 0; offset--) {
		if (view.getUint32(offset, true) == END_OF_CENTRAL_DIRECTORY_SIGNATURE) {
			return view.getUint32(offset + 16, true);
		}
	}
	throw new Error();
}
