/* global Worker, URL */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ".repeat(100);
const FILENAME = "lorem.txt";
const WORKER_SCRIPT_URI = new URL("./worker-streams-polyfill.js", import.meta.url);

export { test };

// the worker script installs the polyfill before importing the zip.js worker, which is the only
// moment where it can help: the worker reads TransformStream and the other stream globals when it
// is evaluated, so a polyfill installed in the page never reaches it
async function test() {
	const workerErrors = [];
	let createdWorkers = 0;
	zip.configure({
		createWorker: () => {
			createdWorkers++;
			const worker = new Worker(WORKER_SCRIPT_URI);
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
		// zip.js runs the codec in the main scope when the worker fails to start, so the round trip
		// below would succeed even then: only this assertion detects a worker that never ran
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
