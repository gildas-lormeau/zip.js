/* global Worker, URL */

import { getConfiguration, setDefaultConfiguration } from "../../lib/core/configuration.js";

export { test };

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ".repeat(100);
const FILENAME = "lorem.txt";
const WORKER_SCRIPT_URI = new URL("../data/custom-engine-worker.js", import.meta.url);
const LEGACY_WORKER_SCRIPT_URI = new URL("../data/legacy-engine-worker.js", import.meta.url);

async function test() {
	const { workerURI, wasmURI, useCompressionStream } = getConfiguration();
	const zip = await import("../../lib/zip-core-custom.js");
	try {
		await testWorker(zip, WORKER_SCRIPT_URI);
		await testWorker(zip, LEGACY_WORKER_SCRIPT_URI);
	} finally {
		setDefaultConfiguration({ workerURI, wasmURI, useCompressionStream });
		zip.configure({ createWorker: null });
		await zip.terminateWorkers();
	}
}

async function testWorker(zip, workerScriptURI) {
	let createdWorkers = 0;
	zip.configure({
		useCompressionStream: false,
		createWorker: () => {
			createdWorkers++;
			return new Worker(workerScriptURI, { type: "module" });
		}
	});
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
	await zip.terminateWorkers();
}
