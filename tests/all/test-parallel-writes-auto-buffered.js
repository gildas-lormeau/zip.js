/* global Blob, FileReader, setTimeout */

import * as zip from "../../index.js";

const KB = 1024;
const ENTRIES_DATA = [
	{ name: "entry #1", blob: getBlob(8.5 * KB) }, { name: "entry #2", blob: getBlob(5.2 * KB) }, { name: "entry #3", blob: getBlob(4.7 * KB) },
	{ name: "entry #4", blob: getBlob(2.8 * KB) }, { name: "entry #5", blob: getBlob(1.9 * KB) }, { name: "entry #6", blob: getBlob(2.2 * KB) },
	{ name: "entry #7", blob: getBlob(5.1 * KB) }, { name: "entry #8", blob: getBlob(2.6 * KB) }, { name: "entry #9", blob: getBlob(3.1 * KB) }];
const ENTRIES_DATA_PASS2 = [
	{ name: "entry #1 (pass #2)", blob: getBlob(3.5 * KB) }, { name: "entry #2 (pass #2)", blob: getBlob(2.2 * KB) }, { name: "entry #3 (pass #2)", blob: getBlob(7.7 * KB) },
	{ name: "entry #4 (pass #2)", blob: getBlob(1.3 * KB) }, { name: "entry #5 (pass #2)", blob: getBlob(5.2 * KB) }, { name: "entry #6 (pass #2)", blob: getBlob(4.1 * KB) },
	{ name: "entry #7 (pass #2)", blob: getBlob(1.0 * KB) }, { name: "entry #8 (pass #2)", blob: getBlob(6.2 * KB) }, { name: "entry #9 (pass #2)", blob: getBlob(8.4 * KB) }];


export { test };

async function test() {
	zip.configure({ chunkSize: 512 });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await Promise.all(ENTRIES_DATA.map(entryData => zipWriter.add(entryData.name, new zip.BlobReader(entryData.blob), { level: Math.random() > .5 ? 5 : 0 })));
	await Promise.all(ENTRIES_DATA_PASS2.map((entryData, indexEntry) =>
		new Promise((resolve, reject) => {
			setTimeout(async () => {
				try {
					resolve(await zipWriter.add(entryData.name, new zip.BlobReader(entryData.blob), { useWebWorkers: Math.random() > .5 }));
				} catch (error) {
					reject(error);
				}
			}, Math.random() * 250 + (indexEntry * 100));
		})
	));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const results = await Promise.all(entries.slice(0, ENTRIES_DATA.length).map(async (entry, indexEntry) => {
		const blob = await entry.getData(new zip.BlobWriter("application/octet-stream"));
		return compareResult(blob, ENTRIES_DATA[indexEntry].blob);
	}));
	const results2 = await Promise.all(entries.slice(ENTRIES_DATA.length).map(async entry => {
		const blob = await entry.getData(new zip.BlobWriter("application/octet-stream"));
		return compareResult(blob, ENTRIES_DATA_PASS2.find(otherEntry => otherEntry.name == entry.filename).blob);
	}));
	zip.terminateWorkers();
	return !results.includes(false) && !results2.includes(false);
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