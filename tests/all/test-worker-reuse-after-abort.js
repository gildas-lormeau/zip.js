/* global Blob, AbortController, navigator */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME_1 = "first.txt";
const FILENAME_2 = "second.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: "text/plain" });

export { test };

async function test() {
	// a single worker slot with a queued second task: aborting the first task while
	// its worker runs must not corrupt or reject the queued task reusing the slot
	zip.configure({ chunkSize: 128, useWebWorkers: true, maxWorkers: 1 });
	try {
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter);
		await zipWriter.add(FILENAME_1, new zip.BlobReader(BLOB));
		await zipWriter.add(FILENAME_2, new zip.BlobReader(BLOB));
		await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
		const entries = await zipReader.getEntries();
		const controller = new AbortController();
		const signal = controller.signal;
		const abortedResult = entries[0].getData(new zip.TextWriter(), {
			onstart: () => controller.abort(),
			signal
		});
		const queuedResult = entries[1].getData(new zip.TextWriter());
		let aborted = false;
		try {
			await abortedResult;
		} catch {
			aborted = true;
		}
		const secondText = await queuedResult;
		await zipReader.close();
		if (!aborted || secondText != TEXT_CONTENT) {
			throw new Error();
		}
	} finally {
		await zip.terminateWorkers();
		// deno-lint-ignore valid-typeof
		zip.configure({ maxWorkers: typeof navigator != "undefined" && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 2 });
	}
}
