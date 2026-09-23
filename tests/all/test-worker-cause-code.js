/* global Worker, URL */

// A codec error crosses the worker boundary as a message. The top-level error keeps its code because
// the worker posts it and the main scope re-attaches it, but the cause used to travel as its name and
// message alone, and a structured clone never copies the own properties of an Error either, so
// `error.cause.code` was undefined with workers on every host. The worker below cannot allocate its
// codec and says so with the code of the WASM driver; the cause must arrive with that code.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "worker cause code ".repeat(64);
const FILENAME = "lorem.txt";
const MEMORY_ERROR_CODE = "Z_MEM_ERROR";
const MEMORY_ERROR_MESSAGE = "simulated allocation failure";
const WORKER_SCRIPT_URI = new URL("../data/memory-error-worker.js", import.meta.url);

export { test };

async function test() {
	const bytes = await writeEntry();
	zip.configure({ useWebWorkers: true, useCompressionStream: false, createWorker: () => new Worker(WORKER_SCRIPT_URI, { type: "module" }) });
	try {
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes));
		const [entry] = await zipReader.getEntries();
		let error;
		try {
			await entry.getData(new zip.Uint8ArrayWriter());
		} catch (thrown) {
			error = thrown;
		}
		await zipReader.close();
		if (!error || error.message != zip.ERR_CODEC_OUT_OF_MEMORY) {
			throw new Error("expected " + zip.ERR_CODEC_OUT_OF_MEMORY + " from the worker, got " + (error ? error.message : "no error"));
		}
		const { cause } = error;
		if (!cause || cause.message != MEMORY_ERROR_MESSAGE || cause.code != MEMORY_ERROR_CODE) {
			throw new Error("expected the cause to cross the worker with its code, got " +
				(cause ? JSON.stringify({ name: cause.name, message: cause.message, code: cause.code }) : "no cause"));
		}
	} finally {
		zip.configure({ createWorker: null });
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function writeEntry() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { useWebWorkers: false });
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	return zipWriter.close();
}
