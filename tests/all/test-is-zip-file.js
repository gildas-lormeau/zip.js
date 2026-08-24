/* global Blob */

import * as zip from "../zip-lib.js";

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add("lorem.txt", new zip.TextReader("Lorem ipsum dolor sit amet"));
	const blob = await zipWriter.close();
	const emptyZipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
	const emptyZipBlob = await emptyZipWriter.close();
	const results = [
		[await zip.isZipFile(new zip.BlobReader(blob)), true],
		[await zip.isZipFile(new zip.BlobReader(blob), { strictness: "strict" }), true],
		[await zip.isZipFile(new zip.Uint8ArrayReader(new Uint8Array(await blob.arrayBuffer()))), true],
		[await zip.isZipFile(new zip.BlobReader(emptyZipBlob)), true],
		[await zip.isZipFile(new zip.BlobReader(new Blob([new Uint8Array(1024).fill(7)]))), false],
		[await zip.isZipFile(new zip.BlobReader(new Blob([new Uint8Array(5)]))), false],
		[await zip.isZipFile(new zip.BlobReader(new Blob([]))), false],
		[await zip.isZipFile(new zip.BlobReader(new Blob([new Uint8Array(128).fill(1), blob]))), true],
		[await zip.isZipFile(new zip.BlobReader(new Blob([blob, new Uint8Array(16)]))), true],
		[await zip.isZipFile(new zip.BlobReader(new Blob([blob, new Uint8Array(16)])), { strictness: "strict" }), false],
		[await zip.isZipFile(new zip.BlobReader(new Blob([blob, new Uint8Array(80000)]))), false],
		[await zip.isZipFile(new zip.BlobReader(new Blob([blob, new Uint8Array(80000)])), { strictness: "tolerant" }), true],
		[await zip.isZipFile(new zip.BlobReader(new Blob([blob, new Uint8Array(80000)])), { maxAppendedDataSize: 100000 }), true],
		[await zip.isZipFile(blob.stream()), true]
	];
	const failedIndex = results.findIndex(([actual, expected]) => actual !== expected);
	if (failedIndex != -1) {
		throw new Error("unexpected isZipFile result for the case at index " + failedIndex);
	}
	try {
		await zip.isZipFile(new zip.BlobReader(blob), { strictness: "invalid" });
		throw new Error("invalid strictness not detected");
	} catch (error) {
		if (error.message != zip.ERR_INVALID_STRICTNESS) {
			throw error;
		}
	}
}
