/* global URL */

import * as zip from "../zip-lib.js";

const ARCHIVE_EXTRA_DATA_SIGNATURE = 0x08064b50;
const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
const DIGITAL_SIGNATURE_RECORD_SIGNATURE = 0x05054b50;
const MASKED_BITFLAGS = 0b10000001000001;
const TEXT_CONTENT = "classified payload";
const FILENAME = "secret.txt";
const MASKED_FILENAME = "1";
const SIGNATURE_CONTENT = new Uint8Array([0x30, 0x82, 0x01, 0x0a, 0xde, 0xad, 0xbe, 0xef]);
const XOR_KEY = 0x5a;
const secureZipUrl = new URL("./../data/lorem-secure-full.zip", import.meta.url).href;
const signedSecureZipUrl = new URL("./../data/lorem-secure-signed-full.zip", import.meta.url).href;
const maskedSecureZipUrl = new URL("./../data/lorem-secure-full-utf8.zip", import.meta.url).href;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	const testSyntheticOK = await testSynthetic();
	const testSignedOK = await testSignedDirectory();
	const testMaskedOK = await testMaskedLocalHeaders();
	const testMetadataOK = await testEncryptionMetadata();
	const testSignedMetadataOK = await testSignedEncryptionMetadata();
	const testMaskedMetadataOK = await testMaskedEncryptionMetadata();
	await zip.terminateWorkers();
	if (!testSyntheticOK || !testSignedOK || !testMaskedOK || !testMetadataOK || !testSignedMetadataOK || !testMaskedMetadataOK) {
		throw new Error("Decrypt central directory test failed");
	}
}

async function testSynthetic() {
	const { data } = await buildEncryptedDirectoryArchive();
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
		entries[0].filename == FILENAME &&
		content == TEXT_CONTENT;
}

async function testSignedDirectory() {
	const { data, encryptedDirectoryLength } = await buildEncryptedDirectoryArchive(SIGNATURE_CONTENT);
	let encryptedData;
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), {
		decryptCentralDirectory(directoryData) {
			encryptedData = directoryData;
			return xor(directoryData.subarray(8));
		}
	});
	const entries = await zipReader.getEntries();
	const content = await entries[0].getData(new zip.TextWriter());
	const { digitalSignature } = zipReader;
	return entries.length == 1 &&
		entries[0].filename == FILENAME &&
		content == TEXT_CONTENT &&
		encryptedData.length == encryptedDirectoryLength &&
		Boolean(digitalSignature) &&
		digitalSignature.length == SIGNATURE_CONTENT.length &&
		digitalSignature.every((byteValue, index) => byteValue == SIGNATURE_CONTENT[index]);
}

async function testMaskedLocalHeaders() {
	const { data } = await buildMaskedLocalHeadersArchive();
	const errorWithoutHook = await getEntriesError(new zip.Uint8ArrayReader(data));
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), {
		decryptCentralDirectory(encryptedData) {
			return xor(encryptedData.subarray(8));
		},
		strictness: "strict"
	});
	const entries = await zipReader.getEntries();
	const [entry] = entries;
	const rawContent = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	const maskedError = await getDataError(entry);
	return Boolean(errorWithoutHook) &&
		errorWithoutHook.message == zip.ERR_ENCRYPTED_CENTRAL_DIRECTORY &&
		entries.length == 1 &&
		entry.filename == FILENAME &&
		entry.encrypted &&
		rawContent.length == entry.compressedSize &&
		Boolean(maskedError) &&
		maskedError.message == zip.ERR_UNSUPPORTED_ENCRYPTION;
}

async function testEncryptionMetadata() {
	const { encryptionInfo, encryptedData, error } = await readEncryptionInfo(secureZipUrl);
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

async function testSignedEncryptionMetadata() {
	const { encryptionInfo, encryptedData, error } = await readEncryptionInfo(signedSecureZipUrl);
	return Boolean(error) && error.message == "MARKER" &&
		Boolean(encryptionInfo) &&
		encryptionInfo.encryptionAlgorithm == 0x6610 &&
		encryptionInfo.hashAlgorithm == 0x800c &&
		encryptionInfo.hashData.length == 32 &&
		encryptedData.length == encryptionInfo.compressedSize;
}

async function testMaskedEncryptionMetadata() {
	const { encryptionInfo, encryptedData, error } = await readEncryptionInfo(maskedSecureZipUrl);
	return Boolean(error) && error.message == "MARKER" &&
		Boolean(encryptionInfo) &&
		encryptionInfo.uncompressedSize == 108 &&
		encryptedData.length == encryptionInfo.compressedSize;
}

async function readEncryptionInfo(url) {
	let encryptionInfo, encryptedData, error;
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }), {
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
	return { encryptionInfo, encryptedData, error };
}

async function buildEncryptedDirectoryArchive(signatureContent) {
	const plain = await buildPlainArchive(FILENAME);
	const { endOfDirectoryOffset, directoryOffset, directoryLength } = getDirectoryInfo(plain);
	return assembleEncryptedDirectoryArchive(
		plain.slice(0, directoryOffset),
		plain.slice(directoryOffset, directoryOffset + directoryLength),
		plain.slice(endOfDirectoryOffset),
		signatureContent);
}

async function buildMaskedLocalHeadersArchive() {
	const maskedArchive = await buildPlainArchive(MASKED_FILENAME);
	const plain = await buildPlainArchive(FILENAME);
	const maskedInfo = getDirectoryInfo(maskedArchive);
	const { directoryOffset, directoryLength } = getDirectoryInfo(plain);
	const localPart = maskedArchive.slice(0, maskedInfo.directoryOffset);
	const localView = new DataView(localPart.buffer);
	localView.setUint16(6, localView.getUint16(6, true) | MASKED_BITFLAGS, true);
	localView.setUint32(14, 0, true);
	localView.setUint32(22, 0, true);
	const directory = plain.slice(directoryOffset, directoryOffset + directoryLength);
	const directoryView = new DataView(directory.buffer);
	directoryView.setUint16(8, directoryView.getUint16(8, true) | MASKED_BITFLAGS, true);
	return assembleEncryptedDirectoryArchive(localPart, directory, maskedArchive.slice(maskedInfo.endOfDirectoryOffset));
}

function assembleEncryptedDirectoryArchive(localPart, directory, endOfDirectory, signatureContent) {
	const encryptedDirectory = new Uint8Array(8 + directory.length);
	const encryptedView = new DataView(encryptedDirectory.buffer);
	encryptedView.setUint32(0, ARCHIVE_EXTRA_DATA_SIGNATURE, true);
	encryptedView.setUint32(4, directory.length, true);
	encryptedDirectory.set(xor(directory), 8);
	const signatureRecord = new Uint8Array(signatureContent ? 6 + signatureContent.length : 0);
	if (signatureContent) {
		const signatureView = new DataView(signatureRecord.buffer);
		signatureView.setUint32(0, DIGITAL_SIGNATURE_RECORD_SIGNATURE, true);
		signatureView.setUint16(4, signatureContent.length, true);
		signatureRecord.set(signatureContent, 6);
	}
	const endOfDirectoryView = new DataView(endOfDirectory.buffer);
	endOfDirectoryView.setUint32(12, encryptedDirectory.length, true);
	endOfDirectoryView.setUint32(16, localPart.length, true);
	const data = new Uint8Array(localPart.length + encryptedDirectory.length + signatureRecord.length + endOfDirectory.length);
	data.set(localPart, 0);
	data.set(encryptedDirectory, localPart.length);
	data.set(signatureRecord, localPart.length + encryptedDirectory.length);
	data.set(endOfDirectory, localPart.length + encryptedDirectory.length + signatureRecord.length);
	return { data, encryptedDirectoryLength: encryptedDirectory.length };
}

async function buildPlainArchive(filename) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(filename, new zip.TextReader(TEXT_CONTENT), { dataDescriptor: false });
	return zipWriter.close();
}

function getDirectoryInfo(archive) {
	const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
	let endOfDirectoryOffset = archive.length - 22;
	while (endOfDirectoryOffset >= 0 && view.getUint32(endOfDirectoryOffset, true) != END_OF_CENTRAL_DIR_SIGNATURE) {
		endOfDirectoryOffset--;
	}
	return {
		endOfDirectoryOffset,
		directoryOffset: view.getUint32(endOfDirectoryOffset + 16, true),
		directoryLength: view.getUint32(endOfDirectoryOffset + 12, true)
	};
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

async function getDataError(entry) {
	try {
		await entry.getData(new zip.Uint8ArrayWriter());
	} catch (error) {
		return error;
	}
}
