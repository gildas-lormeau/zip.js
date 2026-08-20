/* global navigator, TextEncoder */

// End-to-end test of FS#exportFileSystemHandle against the real Origin Private File System (browser
// only). It builds a tree, exports it to an OPFS directory, then re-imports that directory with
// FS#addFileSystemHandle and checks the round-trip matches. The OPFS directory is removed afterwards.

import * as zip from "../zip-lib.js";

const DIRECTORY_NAME = ".zip.js-export-test";
const TEXT_ENCODER = new TextEncoder();

export { test };

async function test() {
	if (!(navigator.storage && navigator.storage.getDirectory)) {
		throw new Error("OPFS is not available in this environment");
	}
	const root = await navigator.storage.getDirectory();
	await removeDirectory(root);

	const fs = new zip.ZipFS();
	fs.addText("readme.txt", "hello world");
	const subDirectory = fs.addDirectory("sub");
	subDirectory.addText("nested.txt", "nested content");
	fs.addUint8Array("data.bin", new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]));

	const targetHandle = await root.getDirectoryHandle(DIRECTORY_NAME, { create: true });
	await fs.exportFileSystemHandle(targetHandle);

	// re-import the exported directory and compare
	const importedFs = new zip.ZipFS();
	await importedFs.addFileSystemHandle(targetHandle);
	const exportedRoot = importedFs.find(DIRECTORY_NAME);

	assertText(await getText(exportedRoot, "readme.txt"), "hello world");
	assertText(await getText(exportedRoot, "sub/nested.txt"), "nested content");
	const bin = await exportedRoot.getChildByName("data.bin").getUint8Array();
	if (!bytesEqual(bin, new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]))) {
		throw new Error("data.bin mismatch after OPFS round-trip");
	}

	await removeDirectory(root);
	await zip.terminateWorkers();

	async function getText(directoryEntry, relativePath) {
		const entry = importedFs.find(directoryEntry.getFullname() + "/" + relativePath);
		return entry.getText();
	}
}

function assertText(actual, expected) {
	if (actual != expected) {
		throw new Error("expected \"" + expected + "\" got \"" + actual + "\"");
	}
	if (!bytesEqual(TEXT_ENCODER.encode(actual), TEXT_ENCODER.encode(expected))) {
		throw new Error("byte mismatch");
	}
}

async function removeDirectory(root) {
	try {
		await root.removeEntry(DIRECTORY_NAME, { recursive: true });
	} catch {
		// the directory does not exist yet; ignored
	}
}

function bytesEqual(a, b) {
	if (!a || !b || a.length != b.length) {
		return false;
	}
	for (let index = 0; index < a.length; index++) {
		if (a[index] != b[index]) {
			return false;
		}
	}
	return true;
}
