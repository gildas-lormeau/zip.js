/* global Blob */

import * as zip from "../../index.js";

const KB = 1024;
const ENTRIES_DATA = [
	{ name: "entry #1", blob: getBlob(8.5 * KB) }, { name: "entry #2", blob: getBlob(100.2 * KB) }, { name: "entry #3", blob: getBlob(640.7 * KB) },
	{ name: "entry #4", blob: getBlob(200.8 * KB) }, { name: "entry #5", blob: getBlob(3.9 * KB) }, { name: "entry #6", blob: getBlob(7.2 * KB) },
	{ name: "entry #7", blob: getBlob(5.1 * KB) }, { name: "entry #8", blob: getBlob(4.6 * KB) }, { name: "entry #9", blob: getBlob(3.1 * KB) }];

export { test };

async function test() {
	zip.configure({ chunkSize: 512, useWebWorkers: true, maxWorkers: 4 });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { keepOrder: true });
	await Promise.all(ENTRIES_DATA.map(entryData => zipWriter.add(entryData.name, new zip.BlobReader(entryData.blob))));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	await zip.terminateWorkers();
	if (JSON.stringify(ENTRIES_DATA.map(entry => entry.name)) !=
		JSON.stringify(entries.sort((entry1, entry2) => entry1.offset - entry2.offset).map(entry => entry.filename))) {
		throw new Error();
	}
}

function getBlob(size) {
	const data = new Float64Array(Math.floor(size / 8));
	for (let indexData = 0; indexData < data.length; indexData++) {
		data[indexData] = Math.random();
	}
	return new Blob([data]);
}