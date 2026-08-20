// checkSignature is the deprecated alias of checkCrc32, read as a fallback in zip-reader.js when checkCrc32 is
// undefined. No other test passes the deprecated name any more, so without this one the fallback and its
// precedence rule are unexercised and could be dropped without any test failing.

import * as zip from "../zip-lib.js";

const FILENAME = "hello.txt";
const TEXT_CONTENT = "The quick brown fox jumps over the lazy dog.";
const LOCAL_HEADER_LENGTH = 30;
const HEADER_OFFSET_FILENAME_LENGTH = 26;
const HEADER_OFFSET_EXTRAFIELD_LENGTH = 28;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });
	const zipFile = await buildZipFileWithCorruptedData();
	await checkInvalidCrc32IsDetected(zipFile, { checkSignature: true }, "checkSignature");
	await checkInvalidCrc32IsDetected(zipFile, { checkCrc32: true }, "checkCrc32");
	await checkInvalidCrc32IsIgnored(zipFile, {}, "no option");
	await checkInvalidCrc32IsIgnored(zipFile, { checkSignature: false }, "checkSignature false");
	await checkInvalidCrc32IsIgnored(zipFile, { checkCrc32: false, checkSignature: true }, "checkCrc32 false and checkSignature true");
	await zip.terminateWorkers();
}

async function buildZipFileWithCorruptedData() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), { level: 0 });
	const zipFile = await zipWriter.close();
	const headerView = new DataView(zipFile.buffer, zipFile.byteOffset, zipFile.length);
	const dataOffset = LOCAL_HEADER_LENGTH +
		headerView.getUint16(HEADER_OFFSET_FILENAME_LENGTH, true) +
		headerView.getUint16(HEADER_OFFSET_EXTRAFIELD_LENGTH, true);
	zipFile[dataOffset] = zipFile[dataOffset] ^ 0xff;
	return zipFile;
}

async function checkInvalidCrc32IsDetected(zipFile, options, description) {
	try {
		await getData(zipFile, options);
	} catch (error) {
		if (error.message == zip.ERR_INVALID_CRC32) {
			return;
		}
		throw error;
	}
	throw new Error("expected " + description + " to detect the invalid crc32");
}

async function checkInvalidCrc32IsIgnored(zipFile, options, description) {
	const data = await getData(zipFile, options);
	if (data[0] == TEXT_CONTENT.charCodeAt(0)) {
		throw new Error("expected " + description + " to return the corrupted content");
	}
}

async function getData(zipFile, options) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(zipFile));
	try {
		const [entry] = await zipReader.getEntries();
		return await entry.getData(new zip.Uint8ArrayWriter(), options);
	} finally {
		await zipReader.close();
	}
}
