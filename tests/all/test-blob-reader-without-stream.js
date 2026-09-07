/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";

export { test };

// BlobReader reads its source with stream() when it can, and falls back to slice()/arrayBuffer()
// otherwise, so a Blob-like source exposing only size, slice and arrayBuffer is readable too.
async function test() {
	zip.configure({ chunkSize: 64, useWebWorkers: false });
	try {
		const blob = new Blob([TEXT_CONTENT]);
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.add(FILENAME, new zip.BlobReader(withoutStream(blob)));
		const data = await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		try {
			const [entry] = await zipReader.getEntries();
			const content = await entry.getData(new zip.TextWriter());
			if (content != TEXT_CONTENT) {
				throw new Error("the content read back from a source without stream() must be unchanged");
			}
		} finally {
			await zipReader.close();
		}
	} finally {
		await zip.terminateWorkers();
	}
}

function withoutStream(blob) {
	return {
		size: blob.size,
		slice: (start, end) => withoutStream(blob.slice(start, end)),
		arrayBuffer: () => blob.arrayBuffer()
	};
}
