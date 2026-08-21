/* global fetch, URL */

import * as zip from "../zip-lib.js";

const PASSWORD = "lorem.txt";
const LOREM_PREFIX = "Lorem ipsum";
const DIGITAL_SIGNATURE_RECORD_SIGNATURE = 0x05054b50;

export { test };

async function test() {
	let testOK = true;
	testOK = testOK && await testText("lorem-204.zip", "LOREM.TXT");
	testOK = testOK && await testText("lorem-utf8.zip", "lorem.txt");
	testOK = testOK && await testText("lorem-non-ascii.zip", "lorém.txt");
	testOK = testOK && await testDeflate64();
	testOK = testOK && await testError("lorem-bzip2.zip", {}, zip.ERR_UNSUPPORTED_COMPRESSION);
	testOK = testOK && await testError("lorem-lzma.zip", {}, zip.ERR_UNSUPPORTED_COMPRESSION);
	testOK = testOK && await testError("lorem-lzma-eos.zip", {}, zip.ERR_UNSUPPORTED_COMPRESSION);
	testOK = testOK && await testError("lorem-ppmd.zip", {}, zip.ERR_UNSUPPORTED_COMPRESSION);
	testOK = testOK && await testError("lorem-big-bzip2.zip", {}, zip.ERR_UNSUPPORTED_COMPRESSION);
	for (const variant of ["a1", "a2", "a3", "b1", "b2", "b3"]) {
		testOK = testOK && await testError(`lorem-dcl-implode-${variant}.zip`, {}, zip.ERR_UNSUPPORTED_COMPRESSION);
	}
	for (const method of ["bzip2", "lzma", "ppmd", "dcl-implode"]) {
		testOK = testOK && await testError(`lorem-${method}-encrypted.zip`, { password: PASSWORD }, zip.ERR_UNSUPPORTED_ENCRYPTION);
	}
	for (const method of ["bzip2", "lzma", "ppmd"]) {
		testOK = testOK && await testError(`lorem-${method}-aes.zip`, { password: PASSWORD }, zip.ERR_UNSUPPORTED_COMPRESSION);
	}
	testOK = testOK && await testSelfExtracting();
	testOK = testOK && await testSigned();
	testOK = testOK && await testSignedDirectory();
	testOK = testOK && await testText("lorem-secure-traditional-full.zip", "lorem.txt", { password: PASSWORD });
	testOK = testOK && await testStrongEncryption("lorem-secure.zip", 0x6610, 256, 8);
	testOK = testOK && await testStrongEncryption("lorem-secure-aes128.zip", 0x660e, 128, 8);
	testOK = testOK && await testStrongEncryption("lorem-secure-aes192.zip", 0x660f, 192, 8);
	testOK = testOK && await testStrongEncryption("lorem-secure-store.zip", 0x6610, 256, 0);
	testOK = testOK && await testStrongEncryption("lorem-secure-deflate64.zip", 0x6610, 256, 9);
	testOK = testOK && await testCertificateEncryption();
	testOK = testOK && await testMixedEncryption();
	for (const name of ["lorem-secure-full.zip", "lorem-secure-full-utf8.zip", "lorem-secure-full-small.zip",
		"lorem-secure-full-multi.zip", "lorem-secure-cert-full.zip", "lorem-secure-signed-full.zip"]) {
		testOK = testOK && await testEncryptedDirectory(name);
	}
	await zip.terminateWorkers();
	if (!testOK) {
		throw new Error();
	}
}

async function getFirstEntry(name) {
	const url = new URL(`./../data/${name}`, import.meta.url).href;
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }));
	const entries = await zipReader.getEntries();
	return entries[0];
}

async function testText(name, filename, options = {}) {
	const entry = await getFirstEntry(name);
	const text = await entry.getData(new zip.TextWriter(), options);
	return entry.filename == filename && text.startsWith(LOREM_PREFIX);
}

async function testDeflate64() {
	const entry = await getFirstEntry("lorem-securezip-deflate64.zip");
	const text = await entry.getData(new zip.TextWriter());
	return entry.compressionMethod == 9 && text.startsWith(LOREM_PREFIX);
}

async function testSelfExtracting() {
	const entry = await getFirstEntry("lorem.exe.zip");
	const text = await entry.getData(new zip.TextWriter(), { checkCrc32: true });
	return entry.compressionMethod == 9 && text.startsWith(LOREM_PREFIX);
}

async function testError(name, options, expectedMessage) {
	const entry = await getFirstEntry(name);
	try {
		await entry.getData(new zip.TextWriter(), options);
	} catch (error) {
		return error.message == expectedMessage;
	}
	return false;
}

async function testSigned() {
	const entry = await getFirstEntry("lorem-signed.zip");
	const text = await entry.getData(new zip.TextWriter());
	return entry.extraField.has(0x0014) && entry.extraField.has(0x0016) && text.startsWith(LOREM_PREFIX);
}

async function testSignedDirectory() {
	const url = new URL("./../data/lorem-signed-cd.zip", import.meta.url).href;
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }));
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter());
	const { digitalSignature, directoryOffset, directoryLength } = zipReader;
	const data = new Uint8Array(await (await fetch(url)).arrayBuffer());
	const view = new DataView(data.buffer);
	const signatureRecordOffset = directoryOffset + directoryLength - 6 - digitalSignature.length;
	return Boolean(digitalSignature) && digitalSignature.length == 320 &&
		view.getUint32(signatureRecordOffset, true) == DIGITAL_SIGNATURE_RECORD_SIGNATURE &&
		entry.extraField.has(0x0014) && entry.extraField.has(0x0015) && entry.extraField.has(0x0016) &&
		text.startsWith(LOREM_PREFIX);
}

async function testStrongEncryption(name, encryptionAlgorithm, bitLength, compressionMethod) {
	const entry = await getFirstEntry(name);
	const strongEncryptionData = entry.extraField.get(0x0017).data;
	const view = new DataView(strongEncryptionData.buffer, strongEncryptionData.byteOffset, strongEncryptionData.byteLength);
	const rawData = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	const error = await getDataError(entry, { password: PASSWORD });
	return entry.encrypted && entry.compressionMethod == compressionMethod &&
		view.getUint16(0, true) == 2 &&
		view.getUint16(2, true) == encryptionAlgorithm &&
		view.getUint16(4, true) == bitLength &&
		view.getUint16(6, true) == 1 &&
		rawData.length == entry.compressedSize &&
		Boolean(error) && error.message == zip.ERR_UNSUPPORTED_ENCRYPTION;
}

async function testCertificateEncryption() {
	const entry = await getFirstEntry("lorem-secure-cert.zip");
	const strongEncryptionData = entry.extraField.get(0x0017).data;
	const view = new DataView(strongEncryptionData.buffer, strongEncryptionData.byteOffset, strongEncryptionData.byteLength);
	const rawData = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	const error = await getDataError(entry, {});
	return entry.encrypted && view.getUint16(2, true) == 0x6610 &&
		(view.getUint16(6, true) & 0x0002) == 0x0002 &&
		strongEncryptionData.length > 12 &&
		rawData.length == entry.compressedSize &&
		Boolean(error) && error.message == zip.ERR_UNSUPPORTED_ENCRYPTION;
}

async function testMixedEncryption() {
	const url = new URL("./../data/lorem-secure-mixed.zip", import.meta.url).href;
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }));
	const entries = await zipReader.getEntries();
	const [plainEntry, strongEntry, traditionalEntry] = entries;
	const plainText = await plainEntry.getData(new zip.TextWriter());
	const traditionalText = await traditionalEntry.getData(new zip.TextWriter(), { password: PASSWORD });
	const error = await getDataError(strongEntry, { password: PASSWORD });
	return entries.length == 3 &&
		plainEntry.filename == "plain.txt" && !plainEntry.encrypted && plainText.includes(LOREM_PREFIX) &&
		strongEntry.filename == "strong.txt" && strongEntry.encrypted &&
		traditionalEntry.filename == "traditional.txt" && traditionalEntry.encrypted && traditionalText.includes(LOREM_PREFIX) &&
		Boolean(error) && error.message == zip.ERR_UNSUPPORTED_ENCRYPTION;
}

async function testEncryptedDirectory(name) {
	const url = new URL(`./../data/${name}`, import.meta.url).href;
	try {
		await new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true })).getEntries();
	} catch (error) {
		return error.message == zip.ERR_ENCRYPTED_CENTRAL_DIRECTORY;
	}
	return false;
}

async function getDataError(entry, options) {
	try {
		await entry.getData(new zip.TextWriter(), options);
	} catch (error) {
		return error;
	}
}
