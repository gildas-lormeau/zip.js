/* global URL */

import * as zip from "../zip-lib.js";

const url = new URL("./../data/lorem-deflate64.zip", import.meta.url).href;

export { test };

async function test() {
	try {
		await zip.terminateWorkers();
		zip.configure({ useWebWorkers: false, wasmURI: "file:///nonexistent/zip-module.wasm" });
		let caughtError;
		try {
			await readFirstEntry();
		} catch (error) {
			caughtError = error;
		}
		if (!caughtError || caughtError.message != "WASM module not loaded") {
			throw new Error("expected a WASM module error, got: " + caughtError);
		}
		if (!caughtError.cause) {
			throw new Error("expected the module load error as cause");
		}
		zip.resetConfiguration();
		zip.configure({ useWebWorkers: false });
		await readFirstEntry();
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function readFirstEntry() {
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }));
	const [entry] = await zipReader.getEntries();
	const data = await entry.getData(new zip.Uint8ArrayWriter());
	await zipReader.close();
	if (!data.length) {
		throw new Error("empty content");
	}
}
