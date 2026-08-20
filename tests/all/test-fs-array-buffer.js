/* global Blob, TextEncoder */

import * as zip from "../zip-lib.js";

const PASSWORD = "secret";
const TEXT = "Lorem ipsum dolor sit amet.";

export { test };

// getArrayBuffer() must work for every kind of backing data (string, Uint8Array, data URI, Blob)
// and for entries read back from a zip - not only Blob-backed entries - and it must honor the
// options (e.g. the password of an encrypted entry) like the other getData()-based getters.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		const fs = new zip.ZipFS();

		const expected = new TextEncoder().encode(TEXT);
		const text = fs.addText("text.txt", TEXT);
		const array = fs.addUint8Array("array.bin", expected);
		const dataURI = fs.addData64URI("datauri.bin", "data:application/octet-stream;base64,AQIDBA==");
		const blob = fs.addBlob("blob.bin", new Blob([expected]));

		await assertBytes(text, expected, "text-backed entry");
		await assertBytes(array, expected, "Uint8Array-backed entry");
		await assertBytes(dataURI, new Uint8Array([1, 2, 3, 4]), "data-URI-backed entry");
		await assertBytes(blob, expected, "Blob-backed entry");

		// a Uint8Array view (non-zero byteOffset, partial buffer) must yield only its own bytes
		const backing = new Uint8Array([0, 0, 7, 8, 9, 0]);
		const view = fs.addUint8Array("view.bin", backing.subarray(2, 5));
		await assertBytes(view, new Uint8Array([7, 8, 9]), "Uint8Array view entry");

		// options must be honored: read back an encrypted entry and decrypt via getArrayBuffer
		const encryptedZip = await fs.exportUint8Array({ password: PASSWORD, encryptionStrength: 3 });
		const importedFs = new zip.ZipFS();
		await importedFs.importUint8Array(encryptedZip);
		const importedText = importedFs.find("text.txt");
		if (!importedText) {
			throw new Error("imported entry not found");
		}
		await assertBytes(importedText, expected, "encrypted imported entry", { password: PASSWORD });
	} finally {
		await zip.terminateWorkers();
	}
}

async function assertBytes(entry, expected, label, options) {
	const arrayBuffer = await entry.getArrayBuffer(options);
	if (!(arrayBuffer instanceof ArrayBuffer)) {
		throw new Error("getArrayBuffer did not return an ArrayBuffer for the " + label);
	}
	const bytes = new Uint8Array(arrayBuffer);
	if (bytes.length != expected.length || bytes.some((value, index) => value != expected[index])) {
		throw new Error("getArrayBuffer returned wrong bytes for the " + label);
	}
}
