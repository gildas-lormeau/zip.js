/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: "text/plain" });

export { test };

async function test() {
	// an invalid chunk size must not crash or hang the codec streams
	try {
		for (const chunkSize of [0, -1, undefined, null]) {
			zip.configure({ chunkSize, useWebWorkers: true });
			const blobWriter = new zip.BlobWriter("application/zip");
			const zipWriter = new zip.ZipWriter(blobWriter);
			await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
			await zipWriter.close();
			const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
			const entries = await zipReader.getEntries();
			const text = await entries[0].getData(new zip.TextWriter(), { checkCrc32: true });
			await zipReader.close();
			if (text != TEXT_CONTENT) {
				throw new Error();
			}
		}
	} finally {
		await zip.terminateWorkers();
		zip.configure({ chunkSize: 64 * 1024 });
	}
}
