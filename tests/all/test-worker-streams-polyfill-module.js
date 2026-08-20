/* global Worker, URL */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ".repeat(100);
const FILENAME = "lorem.txt";
const WORKER_SCRIPT_URI = new URL("./worker-streams-polyfill-module.js", import.meta.url);

export { test };

// the streams transferred to the worker are created by the engine, so they only pipe through the
// polyfilled streams of the worker if zip.js adapts them to the implementation of the worker scope.
// a single worker makes the second task reuse the worker of the first one, which is the moment
// where the streams are transferred. Bun does not support transferable streams, so it only covers
// the worker exchanging the data with messages
async function test() {
	const workerErrors = [];
	let createdWorkers = 0;
	zip.configure({
		maxWorkers: 1,
		createWorker: () => {
			createdWorkers++;
			const worker = new Worker(WORKER_SCRIPT_URI, { type: "module" });
			worker.addEventListener("error", event => {
				event.preventDefault();
				workerErrors.push(event.message);
			});
			return worker;
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
		if (!createdWorkers) {
			throw new Error("createWorker not called");
		}
		if (workerErrors.length) {
			throw new Error("the worker failed to start: " + workerErrors.join(", "));
		}
		if (text != TEXT_CONTENT) {
			throw new Error("Invalid entry content");
		}
	} finally {
		zip.configure({ createWorker: null });
		await zip.terminateWorkers();
	}
}
