/* eslint-disable no-console */
/* global zip, document, Blob */

"use strict";

const KB = 1024;
const ENTRIES_DATA = [
	{ name: "entry #1", blob: getBlob(8.5 * KB) }, { name: "entry #2", blob: getBlob(10.2 * KB) }, { name: "entry #3", blob: getBlob(64.7 * KB) },
	{ name: "entry #4", blob: getBlob(2.8 * KB) }, { name: "entry #5", blob: getBlob(30.9 * KB) }, { name: "entry #6", blob: getBlob(76.2 * KB) },
	{ name: "entry #7", blob: getBlob(5.1 * KB) }, { name: "entry #8", blob: getBlob(42.6 * KB) }, { name: "entry #9", blob: getBlob(3.1 * KB) }];

test().catch(error => console.error(error));

async function test() {
	document.body.innerHTML = "...";
	zip.configure({ chunkSize: 512 });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await Promise.all(ENTRIES_DATA.map(async entryData => {
		await zipWriter.add(entryData.name, new zip.BlobReader(entryData.blob));
	}));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blobWriter.getData()));
	const entries = await zipReader.getEntries();
	if (JSON.stringify(ENTRIES_DATA.map(entry => entry.name)) ==
		JSON.stringify(entries.sort((entry1, entry2) => entry1.offset - entry2.offset).map(entry => entry.filename))) {
		document.body.innerHTML = "ok";
	}
}

function getBlob(size) {
	const data = new Float64Array(Math.floor(size / 8));
	for (let indexData = 0; indexData < data.length; indexData++) {
		data[indexData] = Math.random();
	}
	return new Blob([data]);
}