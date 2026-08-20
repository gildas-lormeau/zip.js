/* global Blob */

// Locks the pass-through contract of the fs zip export API: setting `passThrough` in `readerOptions`
// exports the entries as-is, exactly as importing them with `passThrough` does. Both spellings must
// produce the same bytes, whatever the compression method and the encryption of the source entries.
// The top-level `passThrough` option is a writer option: it declares that the data returned by the
// Reader instances is already compressed, which the export can only honor when the uncompressed size
// of every entry is known. It must name that mistake instead of failing on a missing size.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(20);
const STORED_CONTENT = new Uint8Array([1, 2, 3, 4, 5]);
const DIRECTORY_NAME = "dir";
const FILENAME = "lorem.txt";
const STORED_FILENAME = "stored.bin";
const PASSWORD = "password";
const EXPORT_PASS_THROUGH_OPTIONS = { readerOptions: { passThrough: true } };

export { test };

async function test() {
	await testSameBytesAsImportPassThrough({});
	await testSameBytesAsImportPassThrough({ level: 0 });
	await testSameBytesAsImportPassThrough({ password: PASSWORD });
	await testSameBytesAsImportPassThrough({ password: PASSWORD, zipCrypto: true });
	await testExportedSize();
	await testAddedEntriesAreCompressed();
	await testWriterPassThroughIsRejected();
	await testWriterPassThroughWithKnownSizes();
	await testDirectoriesIgnoreWriterPassThrough();
	await zip.terminateWorkers();
}

async function testDirectoriesIgnoreWriterPassThrough() {
	const fs = new zip.ZipFS();
	fs.addDirectory(DIRECTORY_NAME);
	const options = { lastModDate: new Date(0) };
	const predictedSize = await fs.getExportedSize(Object.assign({ passThrough: true }, options));
	const bytes = new Uint8Array(await (await fs.exportBlob(Object.assign({ passThrough: true }, options))).arrayBuffer());
	const reference = new Uint8Array(await (await fs.exportBlob(options)).arrayBuffer());
	if (!bytesEqual(bytes, reference)) {
		throw new Error("the writer option should not change the bytes of a tree of directories");
	}
	if (predictedSize != bytes.length) {
		throw new Error("expected a predicted size of " + bytes.length + ", got " + predictedSize);
	}
}

async function testWriterPassThroughIsRejected() {
	const fs = await importBlob(await createSourceBlob({}));
	fs.addText("added.txt", TEXT_CONTENT);
	await assertInvalidPassThrough("exportBlob", () => fs.exportBlob({ passThrough: true }));
	await assertInvalidPassThrough("getExportedSize", () => fs.getExportedSize({ passThrough: true }));
	await assertInvalidPassThrough("exportBlob of an imported entry", async () => {
		const importedFs = await importBlob(await createSourceBlob({}));
		return importedFs.exportBlob({ passThrough: true });
	});
}

async function testWriterPassThroughWithKnownSizes() {
	// the same source for both spellings: two source blobs would be written at two different times,
	// and that time lands in the compared bytes twice, as a dos date and as a 0x5455 extra field
	// whose one second resolution is what actually bounds how close the two writes must be
	const source = await createSourceBlob({});
	const importedFs = await importBlob(source, { passThrough: true });
	const importedBytes = await exportBytes(source, {}, EXPORT_PASS_THROUGH_OPTIONS);
	const bothSpellings = new Uint8Array(await (await importedFs.exportBlob({ passThrough: true })).arrayBuffer());
	if (!bytesEqual(bothSpellings, importedBytes)) {
		throw new Error("the writer option should be redundant when every entry is already exported as-is");
	}
	const fs = new zip.ZipFS();
	const compressed = await getCompressedContent();
	fs.addDirectory(DIRECTORY_NAME).addUint8Array(FILENAME, compressed.data, {
		uncompressedSize: compressed.uncompressedSize,
		crc32: compressed.crc32,
		compressionMethod: 8
	});
	const exported = await importBlob(await fs.exportBlob({ passThrough: true }));
	if (await exported.find(DIRECTORY_NAME + "/" + FILENAME).getText() != TEXT_CONTENT) {
		throw new Error("unexpected content for the entry added as-is");
	}
}

async function getCompressedContent() {
	const fs = await importBlob(await createSourceBlob({}), { passThrough: true });
	const entry = fs.find(DIRECTORY_NAME + "/" + FILENAME);
	return {
		data: await entry.getUint8Array(),
		uncompressedSize: entry.data.uncompressedSize,
		crc32: entry.data.signature
	};
}

async function assertInvalidPassThrough(label, run) {
	let error;
	try {
		await run();
	} catch (runError) {
		error = runError;
	}
	if (!error || error.message != zip.ERR_INVALID_PASS_THROUGH) {
		throw new Error("expected an " + zip.ERR_INVALID_PASS_THROUGH + " error from " + label + ", got " + (error && error.message));
	}
}

async function testSameBytesAsImportPassThrough(sourceOptions) {
	const source = await createSourceBlob(sourceOptions);
	const importTimeBytes = await exportBytes(source, { passThrough: true }, {});
	const exportTimeBytes = await exportBytes(source, {}, EXPORT_PASS_THROUGH_OPTIONS);
	if (!bytesEqual(importTimeBytes, exportTimeBytes)) {
		throw new Error("the exported bytes should not depend on the pass-through spelling, with " + JSON.stringify(sourceOptions));
	}
	await assertContent(exportTimeBytes, sourceOptions.password);
}

async function testExportedSize() {
	const fs = await importBlob(await createSourceBlob({}));
	const exportedSize = await fs.getExportedSize(EXPORT_PASS_THROUGH_OPTIONS);
	const blob = await fs.exportBlob(EXPORT_PASS_THROUGH_OPTIONS);
	if (exportedSize != blob.size) {
		throw new Error("expected an exported size of " + blob.size + " got " + exportedSize);
	}
}

async function testAddedEntriesAreCompressed() {
	const fs = await importBlob(await createSourceBlob({}));
	const importedEntry = fs.find(DIRECTORY_NAME + "/" + FILENAME);
	const { compressedSize } = importedEntry.data;
	fs.addText("added.txt", TEXT_CONTENT);
	const exported = await importBlob(await fs.exportBlob(EXPORT_PASS_THROUGH_OPTIONS));
	if (exported.find(DIRECTORY_NAME + "/" + FILENAME).data.compressedSize != compressedSize) {
		throw new Error("the imported entry should have been exported as-is");
	}
	const addedEntry = exported.getChildByName("added.txt");
	if (addedEntry.data.compressedSize >= addedEntry.data.uncompressedSize) {
		throw new Error("the added entry should have been compressed");
	}
	if (await addedEntry.getText() != TEXT_CONTENT) {
		throw new Error("unexpected content for the added entry");
	}
}

async function createSourceBlob(options) {
	const fs = new zip.ZipFS();
	fs.addDirectory(DIRECTORY_NAME).addText(FILENAME, TEXT_CONTENT);
	fs.addUint8Array(STORED_FILENAME, STORED_CONTENT, { level: 0 });
	return fs.exportBlob(options);
}

async function exportBytes(source, importOptions, exportOptions) {
	const fs = await importBlob(source, importOptions);
	return new Uint8Array(await (await fs.exportBlob(exportOptions)).arrayBuffer());
}

async function importBlob(blob, options = {}) {
	const fs = new zip.ZipFS();
	await fs.importBlob(blob, options);
	return fs;
}

async function assertContent(bytes, password) {
	const fs = await importBlob(new Blob([bytes]));
	const text = await fs.find(DIRECTORY_NAME + "/" + FILENAME).getText(null, { password });
	if (text != TEXT_CONTENT) {
		throw new Error("unexpected content \"" + text + "\"");
	}
	const stored = await fs.getChildByName(STORED_FILENAME).getUint8Array({ password });
	if (!bytesEqual(stored, STORED_CONTENT)) {
		throw new Error("unexpected content for " + STORED_FILENAME);
	}
}

function bytesEqual(left, right) {
	if (left.length != right.length) {
		return false;
	}
	for (let index = 0; index < left.length; index++) {
		if (left[index] != right[index]) {
			return false;
		}
	}
	return true;
}
