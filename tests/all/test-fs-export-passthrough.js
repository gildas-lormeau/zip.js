/* global Blob */

// Locks the pass-through contract of the fs zip export API: setting `passThrough` in `readerOptions`
// exports the entries as-is, exactly as importing them with `passThrough` does. Both spellings must
// produce the same bytes, whatever the compression method and the encryption of the source entries.

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
	await zip.terminateWorkers();
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
	const fs = new zip.fs.FS();
	fs.addDirectory(DIRECTORY_NAME).addText(FILENAME, TEXT_CONTENT);
	fs.addUint8Array(STORED_FILENAME, STORED_CONTENT, { level: 0 });
	return fs.exportBlob(options);
}

async function exportBytes(source, importOptions, exportOptions) {
	const fs = await importBlob(source, importOptions);
	return new Uint8Array(await (await fs.exportBlob(exportOptions)).arrayBuffer());
}

async function importBlob(blob, options = {}) {
	const fs = new zip.fs.FS();
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
