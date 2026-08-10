/* global Blob */

import * as zipDefault from "../zip-lib.js";
import * as zipNative from "../../lib/zip-native.js";

const FILENAME = "file.txt";

export { test };

async function test() {
	await testVariant(zipDefault);
	await testVariant(zipNative);
}

async function testVariant(zip) {
	zip.configure({ useWebWorkers: false });
	try {
		await roundTripEmptyEntry(zip, { compressionMethod: 8, level: 9 });
		await roundTripEmptyEntry(zip, { level: 9 });
		await roundTripEmptyEntry(zip, {});
	} finally {
		await zip.terminateWorkers();
	}
}

async function roundTripEmptyEntry(zip, options) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.BlobReader(new Blob([])), options);
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const [entry] = await zipReader.getEntries();
	if (entry.compressedSize == 0) {
		throw new Error();
	}
	const blob = await entry.getData(new zip.BlobWriter());
	await zipReader.close();
	if (blob.size != 0) {
		throw new Error();
	}
}
