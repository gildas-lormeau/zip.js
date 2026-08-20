/* global AbortController */

// Checks that an already aborted signal still aborts the write instead of being rejected by the signal type
// guard added with the other option guards. This is split from test-option-validation.js because it needs the
// `signal` option of pipeTo(), which Chrome 76-79 ignore: there the write runs to completion and there is
// nothing for zip.js to abort, so the runner skips this file rather than reporting a failure.

import * as zip from "../zip-lib.js";

const CONTENT = "The quick brown fox jumps over the lazy dog.".repeat(20);

export { test };

async function test() {
	try {
		await abortedSignalStillAborts();
	} finally {
		await zip.terminateWorkers();
	}
}

async function abortedSignalStillAborts() {
	const abortController = new AbortController();
	abortController.abort();
	const { signal } = abortController;
	let thrownError;
	try {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { signal });
		await zipWriter.add("test.txt", new zip.TextReader(CONTENT), { signal });
		await zipWriter.close();
	} catch (error) {
		thrownError = error;
	}
	if (!thrownError || thrownError.name != "AbortError") {
		throw new Error("expected an aborted signal to abort, got " + thrownError);
	}
}
