/* global Blob, btoa */

// Locks the MIME type of the read accessors of a file entry. `getBlob(mimeType)` and
// `getData64URI(mimeType)` must return the requested type, including when the entry was added by
// the matching `add*` method and the stored data declares another type. Without a requested type
// the stored data is returned as is, and `getText(encoding)` never re-decodes an added text. The
// types are taken outside of `text/*`, which Bun rewrites by appending a charset to every blob.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. éàü";
const SOURCE_TYPE = "application/x-source";
const REQUESTED_TYPE = "application/octet-stream";
const DATA_URI = "data:" + SOURCE_TYPE + ";base64," + btoa("abc");

export { test };

async function test() {
	try {
		const zipFs = new zip.fs.FS();
		const blobEntry = zipFs.addBlob("blob.bin", new Blob([TEXT_CONTENT], { type: SOURCE_TYPE }));
		const uriEntry = zipFs.addData64URI("uri.bin", DATA_URI);
		const textEntry = zipFs.addText("text.txt", TEXT_CONTENT);
		await testBlobType(blobEntry, REQUESTED_TYPE, REQUESTED_TYPE);
		await testBlobType(blobEntry, undefined, SOURCE_TYPE);
		await testBlobType(textEntry, REQUESTED_TYPE, REQUESTED_TYPE);
		await testDataURIType(uriEntry, REQUESTED_TYPE, "data:" + REQUESTED_TYPE + ";base64," + btoa("abc"));
		await testDataURIType(uriEntry, undefined, DATA_URI);
		await testText(textEntry, undefined);
		await testText(textEntry, "utf-8");
		await testText(textEntry, "iso-8859-1");
	} finally {
		await zip.terminateWorkers();
	}
}

async function testBlobType(entry, mimeType, expectedType) {
	const blob = await entry.getBlob(mimeType);
	if (blob.type != expectedType) {
		throw new Error("unexpected type " + blob.type + " for " + entry.name);
	}
	if (await blob.text() != TEXT_CONTENT) {
		throw new Error("unexpected content for " + entry.name);
	}
}

async function testDataURIType(entry, mimeType, expectedDataURI) {
	const dataURI = await entry.getData64URI(mimeType);
	if (dataURI != expectedDataURI) {
		throw new Error("unexpected data URI " + dataURI + " for " + entry.name);
	}
}

async function testText(entry, encoding) {
	const text = await entry.getText(encoding);
	if (text != TEXT_CONTENT) {
		throw new Error("unexpected text with encoding " + encoding);
	}
}
