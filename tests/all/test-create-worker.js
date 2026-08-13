/* global Worker, URL */

import * as zip from "../zip-lib.js";

export { test };

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ".repeat(100);
const FILENAME = "lorem.txt";
const WORKER_SCRIPT_URI = new URL("../../lib/core/web-worker-wasm.js", import.meta.url);

async function test() {
	let createdWorkers = 0;
	zip.configure({
		createWorker: () => {
			createdWorkers++;
			return new Worker(WORKER_SCRIPT_URI, { type: "module" });
		}
	});
	try {
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter);
		await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
		await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
		const entries = await zipReader.getEntries();
		const text = await entries[0].getData(new zip.TextWriter());
		await zipReader.close();
		if (text != TEXT_CONTENT) {
			throw new Error("Invalid entry content");
		}
		if (!createdWorkers) {
			throw new Error("createWorker not called");
		}
	} finally {
		zip.configure({ createWorker: null });
		await zip.terminateWorkers();
	}
}
