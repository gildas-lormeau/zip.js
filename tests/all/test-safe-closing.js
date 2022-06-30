/* global Blob, FileReader */

import * as zip from "../../index.js";

const KB = 1024;
const ENTRIES_DATA = [
	{ name: "entry #1", blob: getBlob(8.5 * KB) }, { name: "entry #2", blob: getBlob(5.2 * KB) }, { name: "entry #3", blob: getBlob(4.7 * KB) },
	{ name: "entry #4", blob: getBlob(2.8 * KB) }, { name: "entry #5", blob: getBlob(1.9 * KB) }, { name: "entry #6", blob: getBlob(2.2 * KB) },
	{ name: "entry #7", blob: getBlob(5.1 * KB) }, { name: "entry #8", blob: getBlob(2.6 * KB) }, { name: "entry #9", blob: getBlob(3.1 * KB) }];

export { test };

async function test() {
	zip.configure({ chunkSize: 512, maxWorkers: 4 });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	ENTRIES_DATA.map(entryData => zipWriter.add(entryData.name, new zip.BlobReader(entryData.blob))); // missing await when calling zipWriter.add
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const results = await Promise.all(entries.slice(0, ENTRIES_DATA.length).map(async (entry, indexEntry) => {
		const blob = await entry.getData(new zip.BlobWriter("application/octet-stream"));
		return compareResult(blob, ENTRIES_DATA[indexEntry].blob);
	}));
	zip.terminateWorkers();
	return !results.includes(false);
}

function compareResult(result, value) {
	return new Promise(resolve => {
		const fileReaderInput = new FileReader();
		const fileReaderOutput = new FileReader();
		let loadCount = 0;
		fileReaderInput.readAsArrayBuffer(value);
		fileReaderOutput.readAsArrayBuffer(result);
		fileReaderInput.onload = fileReaderOutput.onload = () => {
			loadCount++;
			if (loadCount == 2) {
				const valueInput = new Float64Array(fileReaderInput.result);
				const valueOutput = new Float64Array(fileReaderOutput.result);
				if (valueInput.length != valueOutput.length) {
					resolve(false);
					return;
				}
				for (let indexValue = 0, n = valueInput.length; indexValue < n; indexValue++) {
					if (valueInput[indexValue] != valueOutput[indexValue]) {
						resolve(false);
						return;
					}
				}
				resolve(true);
			}
		};
	});
}

function getBlob(size) {
	const data = new Float64Array(Math.floor(size / 8));
	for (let indexData = 0; indexData < data.length; indexData++) {
		data[indexData] = Math.random();
	}
	return new Blob([data]);
}