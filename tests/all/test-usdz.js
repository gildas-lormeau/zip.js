/* global Blob */

import * as zip from "../zip-lib.js";

const KB = 1024;
const ENTRIES_DATA = [
	{ name: "entry #1", blob: getBlob(8.5 * KB) }, { name: "entry #2", blob: getBlob(5.2 * KB) }, { name: "entry #3", blob: getBlob(4.7 * KB) },
	{ name: "entry #4", blob: getBlob(2.8 * KB) }, { name: "entry #5", blob: getBlob(1.9 * KB) }, { name: "entry #6", blob: getBlob(2.2 * KB) },
	{ name: "entry #7", blob: getBlob(5.1 * KB) }, { name: "entry #8", blob: getBlob(2.6 * KB) }, { name: "entry #9", blob: getBlob(3.1 * KB) }];

export { test };

async function test() {
	const blobWriter = new zip.BlobWriter("model/vnd.usdz+zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { usdz: true });
	for (const entryData of ENTRIES_DATA) {
		await zipWriter.add(entryData.name, new zip.BlobReader(entryData.blob));
	}
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	let indexEntry = 0;
	let testOK = true;
	for (const entry of entries) {
		const blob = await entry.getData(new zip.BlobWriter("application/octet-stream"));
		const testDataAlignment = ((entry.localDirectory.filenameLength + entry.localDirectory.rawExtraField.length + entry.offset + 30) % 64) == 0;
		const testExtraField = Boolean(entry.localDirectory.extraFieldUSDZ);
		const testStored = entry.compressionMethod == 0;
		testOK = testOK && testDataAlignment && testExtraField && testStored && compareResult(blob, indexEntry);
		indexEntry++;
	}
	let testPasswordRejected = false;
	const encryptedZipWriter = new zip.ZipWriter(new zip.BlobWriter("model/vnd.usdz+zip"), { usdz: true, password: "password" });
	try {
		await encryptedZipWriter.add(ENTRIES_DATA[0].name, new zip.BlobReader(ENTRIES_DATA[0].blob));
	} catch (error) {
		testPasswordRejected = error.message == zip.ERR_UNSUPPORTED_ENCRYPTION_USDZ;
	}
	let testHugeExtraFieldRejected = false;
	const hugeExtraFieldZipWriter = new zip.ZipWriter(new zip.BlobWriter("model/vnd.usdz+zip"), { usdz: true, extendedTimestamp: false });
	try {
		await hugeExtraFieldZipWriter.add(ENTRIES_DATA[0].name, new zip.BlobReader(ENTRIES_DATA[0].blob), {
			extraField: new Map([[0x7000, new Uint8Array(65520)]])
		});
	} catch (error) {
		testHugeExtraFieldRejected = error.message == zip.ERR_INVALID_EXTRAFIELD_DATA;
	}
	await zip.terminateWorkers();
	if (!testOK || !testPasswordRejected || !testHugeExtraFieldRejected) {
		throw new Error();
	}
}

async function compareResult(result, index) {
	const valueInput = new Uint8Array(await ENTRIES_DATA[index].blob.arrayBuffer());
	const valueOutput = new Uint8Array(await result.arrayBuffer());
	if (valueInput.length != valueOutput.length) {
		return false;
	}
	for (let indexValue = 0, n = valueInput.length; indexValue < n; indexValue++) {
		if (valueInput[indexValue] != valueOutput[indexValue]) {
			return false;
		}
	}
	return true;
}

function getBlob(size) {
	const data = new Uint8Array(Math.floor(size + (Math.floor(Math.random() * 128))));
	for (let indexData = 0; indexData < data.length; indexData++) {
		data[indexData] = Math.floor(Math.random() * 256);
	}
	return new Blob([data]);
}