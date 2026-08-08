/* global URL, setTimeout, clearTimeout */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const ERROR_WORKER_URI = new URL("../data/error-worker.js", import.meta.url).href;
const HANG_TIMEOUT = 10000;

export { test };

async function test() {
	// build the test zip without workers so that the worker created below is the first one
	zip.configure({ chunkSize: 128, useWebWorkers: false });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	const blob = await blobWriter.getData();
	try {
		// a worker script that fails to run must make the operation fail
		// (or run inline without workers) instead of hanging forever
		zip.configure({ useWebWorkers: true, workerURI: ERROR_WORKER_URI });
		let timeoutId;
		const result = await Promise.race([
			readEntry(blob).then(() => "settled", () => "settled"),
			new Promise(resolve => timeoutId = setTimeout(() => resolve("timeout"), HANG_TIMEOUT))
		]);
		clearTimeout(timeoutId);
		if (result != "settled") {
			throw new Error(result);
		}
	} finally {
		await zip.terminateWorkers();
		zip.resetConfiguration();
	}
	// the restored worker configuration must be effective
	const text = await readEntry(blob);
	await zip.terminateWorkers();
	if (text != TEXT_CONTENT) {
		throw new Error();
	}
}

async function readEntry(blob) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
	try {
		const entries = await zipReader.getEntries();
		return await entries[0].getData(new zip.TextWriter());
	} finally {
		await zipReader.close();
	}
}
