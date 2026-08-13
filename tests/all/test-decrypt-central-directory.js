/* global URL */

import * as zip from "../zip-lib.js";

const ARCHIVE_EXTRA_DATA_SIGNATURE = 0x08064b50;
const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
const TEXT_CONTENT = "classified payload";
const XOR_KEY = 0x5a;
const secureZipUrl = new URL("./../data/lorem-secure-full.zip", import.meta.url).href;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	const testSyntheticOK = await testSynthetic();
	const testMetadataOK = await testEncryptionMetadata();
	await zip.terminateWorkers();
	if (!testSyntheticOK || !testMetadataOK) {
		throw new Error("Decrypt central directory test failed");
	}
}

async function testSynthetic() {
	const data = await buildEncryptedDirectoryArchive();
	const errorWithoutHook = await getEntriesError(new zip.Uint8ArrayReader(data));
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), {
		decryptCentralDirectory(encryptedData) {
			return xor(encryptedData.subarray(8));
		}
	});
	const entries = await zipReader.getEntries();
	const content = await entries[0].getData(new zip.TextWriter());
	return Boolean(errorWithoutHook) &&
		errorWithoutHook.message == zip.ERR_ENCRYPTED_CENTRAL_DIRECTORY &&
		entries.length == 1 &&
		entries[0].filename == "secret.txt" &&
		content == TEXT_CONTENT;
}

async function testEncryptionMetadata() {
	let encryptionInfo, encryptedData, error;
	const zipReader = new zip.ZipReader(new zip.HttpReader(secureZipUrl, { preventHeadRequest: true }), {
		decryptCentralDirectory(data, info) {
			encryptionInfo = info;
			encryptedData = data;
			throw new Error("MARKER");
		}
	});
	try {
		await zipReader.getEntries();
	} catch (caughtError) {
		error = caughtError;
	}
	return Boolean(error) && error.message == "MARKER" &&
		Boolean(encryptionInfo) &&
		encryptionInfo.compressionMethod == 8 &&
		encryptionInfo.encryptionAlgorithm == 0x6610 &&
		encryptionInfo.bitLength == 256 &&
		encryptionInfo.flags == 1 &&
		encryptionInfo.hashData.length == 4 &&
		encryptionInfo.rawExtensibleData.length == 32 &&
		encryptedData.length == encryptionInfo.compressedSize;
}

async function buildEncryptedDirectoryArchive() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("secret.txt", new zip.TextReader(TEXT_CONTENT));
	const plain = await zipWriter.close();
	const view = new DataView(plain.buffer, plain.byteOffset, plain.byteLength);
	let endOfDirectoryOffset = plain.length - 22;
	while (endOfDirectoryOffset >= 0 && view.getUint32(endOfDirectoryOffset, true) != END_OF_CENTRAL_DIR_SIGNATURE) {
		endOfDirectoryOffset--;
	}
	const directoryOffset = view.getUint32(endOfDirectoryOffset + 16, true);
	const directoryLength = view.getUint32(endOfDirectoryOffset + 12, true);
	const encryptedDirectory = new Uint8Array(8 + directoryLength);
	const encryptedView = new DataView(encryptedDirectory.buffer);
	encryptedView.setUint32(0, ARCHIVE_EXTRA_DATA_SIGNATURE, true);
	encryptedView.setUint32(4, directoryLength, true);
	encryptedDirectory.set(xor(plain.subarray(directoryOffset, directoryOffset + directoryLength)), 8);
	const endOfDirectory = plain.slice(endOfDirectoryOffset);
	const endOfDirectoryView = new DataView(endOfDirectory.buffer);
	endOfDirectoryView.setUint32(12, encryptedDirectory.length, true);
	endOfDirectoryView.setUint32(16, directoryOffset, true);
	const output = new Uint8Array(directoryOffset + encryptedDirectory.length + endOfDirectory.length);
	output.set(plain.subarray(0, directoryOffset), 0);
	output.set(encryptedDirectory, directoryOffset);
	output.set(endOfDirectory, directoryOffset + encryptedDirectory.length);
	return output;
}

function xor(array) {
	const result = new Uint8Array(array.length);
	for (let index = 0; index < array.length; index++) {
		result[index] = array[index] ^ XOR_KEY;
	}
	return result;
}

async function getEntriesError(reader) {
	try {
		await new zip.ZipReader(reader).getEntries();
	} catch (error) {
		return error;
	}
}
