/* global Blob, FileReader */

"use strict";

import * as zip from "../../index.js";

const FILENAME = "lorem.txt";
const size = 512000 + Math.floor(Math.random() * 512000);
const BLOB = new getBlob(size);

export { test };

async function test() {
	zip.configure({
		workerScripts: {
			deflate: ["../dist/z-worker-pako.js", "../tests/vendor/pako_deflate.min.js"]
		}
	});
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const data = await entries[0].getData(new zip.BlobWriter(zip.getMimeType(entries[0].filename)));
	await zipReader.close();
	if (!((await getBlobText(getBlob(size))) == (await getBlobText(data)) && entries[0].filename == FILENAME && entries[0].uncompressedSize == size)) {
		throw new Error();
	}
}

async function getBlobText(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = event => resolve(event.target.result);
		reader.onerror = () => reject(reader.error);
		reader.readAsText(blob);
	});
}

function getBlob(size) {
	const data = new Uint8Array(size);
	for (let indexData = 0; indexData < data.length; indexData++) {
		data[indexData] = 65 + (indexData % 26);
	}
	return new Blob([data]);
}