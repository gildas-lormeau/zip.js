/* global Blob */

import * as zip from "../../index.js";

const TEXT_CONTENT = "";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, {
		encodeText: value => { return new Uint8Array(value.split("").reverse().map(char => char.charCodeAt(0))); }
	});
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
	await zipWriter.close();
	let zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	let entries = await zipReader.getEntries();
	await zipReader.close();
	let firstEntry = entries[0];
	if (firstEntry.filename !== FILENAME.split("").reverse().join("")) {
		throw new Error();
	}
	zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()), {
		decodeText: value => { return String.fromCharCode.apply(null, new Uint8Array(value).reverse()); }
	});
	entries = await zipReader.getEntries();
	await zipReader.close();
	firstEntry = entries[0];
	if (firstEntry.filename !== FILENAME) {
		throw new Error();
	}
	await zip.terminateWorkers();
}