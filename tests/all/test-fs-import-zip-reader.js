// Locks the import of a ZipReader instance into the filesystem. The instance created by the import
// is not exposed, so passing one is the only way to read the data of the zip file itself: the data
// prepended before it, the data appended after it and its global comment. The options of the
// instance are the defaults of the options passed to the import.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(8);
const FILENAME = "lorem.txt";
const DIRECTORY_NAME = "dir";
const PREPENDED_DATA = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
const APPENDED_DATA = new Uint8Array([9, 10, 11, 12]);
const GLOBAL_COMMENT = new Uint8Array([13, 14, 15]);

export { test };

async function test() {
	try {
		await testZipFileData();
		await testEntries();
		await testReaderOptions();
		await testReaderOptionsAreDefaults();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testZipFileData() {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await createArchive()), {
		extractPrependedData: true,
		extractAppendedData: true,
		maxAppendedDataSize: APPENDED_DATA.length
	});
	await new zip.ZipFS().importZip(zipReader);
	assertBytesEqual("prependedData", zipReader.prependedData, PREPENDED_DATA);
	assertBytesEqual("appendedData", zipReader.appendedData, APPENDED_DATA);
	assertBytesEqual("comment", zipReader.comment, GLOBAL_COMMENT);
}

async function testEntries() {
	const zipFs = new zip.ZipFS();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await createArchive()), { maxAppendedDataSize: APPENDED_DATA.length });
	const importedEntries = await zipFs.importZip(zipReader);
	const entry = zipFs.find(DIRECTORY_NAME + "/" + FILENAME);
	if (!entry || !importedEntries.includes(entry)) {
		throw new Error("expected " + DIRECTORY_NAME + "/" + FILENAME + " to be imported");
	}
	const text = await entry.getText();
	if (text != TEXT_CONTENT) {
		throw new Error("the content of the imported entry is corrupted");
	}
}

async function testReaderOptions() {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await createArchive()), {
		maxAppendedDataSize: APPENDED_DATA.length,
		passThrough: true
	});
	const zipFs = new zip.ZipFS();
	await zipFs.importZip(zipReader);
	const entry = zipFs.find(DIRECTORY_NAME + "/" + FILENAME);
	const exportedEntries = await readArchive(await zipFs.exportUint8Array({ readerOptions: { passThrough: true } }));
	const exportedEntry = exportedEntries.find(exportedEntry => exportedEntry.filename == DIRECTORY_NAME + "/" + FILENAME);
	if (!entry.passThrough || entry.uncompressedSize != entry.data.compressedSize) {
		throw new Error("expected the imported entry to hold the compressed data, got passThrough " + entry.passThrough +
			" and a size of " + entry.uncompressedSize);
	}
	if (exportedEntry.compressionMethod != entry.data.compressionMethod ||
		exportedEntry.uncompressedSize != entry.data.uncompressedSize) {
		throw new Error("expected the entry to be exported as-is, got method " + exportedEntry.compressionMethod +
			" and an uncompressed size of " + exportedEntry.uncompressedSize);
	}
}

async function testReaderOptionsAreDefaults() {
	const data = await createArchive();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { maxAppendedDataSize: 0 });
	let error;
	try {
		await new zip.ZipFS().importZip(zipReader);
	} catch (importError) {
		error = importError;
	}
	if (!error) {
		throw new Error("expected the options of the ZipReader instance to be used");
	}
	await new zip.ZipFS().importZip(new zip.ZipReader(new zip.Uint8ArrayReader(data), { maxAppendedDataSize: 0 }), {
		maxAppendedDataSize: APPENDED_DATA.length
	});
}

async function createArchive() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { offset: PREPENDED_DATA.length });
	await zipWriter.add(DIRECTORY_NAME + "/" + FILENAME, new zip.TextReader(TEXT_CONTENT));
	const data = await zipWriter.close(GLOBAL_COMMENT);
	const archive = new Uint8Array(PREPENDED_DATA.length + data.length + APPENDED_DATA.length);
	archive.set(PREPENDED_DATA);
	archive.set(data, PREPENDED_DATA.length);
	archive.set(APPENDED_DATA, PREPENDED_DATA.length + data.length);
	return archive;
}

async function readArchive(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict", checkCrc32: true });
	const entries = await zipReader.getEntries();
	await zipReader.close();
	return entries;
}

function assertBytesEqual(propertyName, value, expectedValue) {
	if (!value || value.length != expectedValue.length || !expectedValue.every((byte, index) => byte == value[index])) {
		throw new Error("expected " + propertyName + " to be " + expectedValue.join() + ", got " + (value && value.join()));
	}
}
