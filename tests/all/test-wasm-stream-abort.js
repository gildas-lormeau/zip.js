/* global ReadableStream, TextEncoder */

// The wasm codec lives in a 16 MB heap that never grows, and a read or write that fails before the
// codec ends has to give its two 64 KB buffers and its zlib state back, or about 120 aborted inflates
// and 40 aborted deflates exhaust the heap of the worker, or of the page without workers, and every
// later entry fails with "allocation failed". The codec used to free them in the transformer cancel()
// hook of a TransformStream, which Node and Deno call and no browser does, so this test proves nothing
// under test-ci and everything on the browser matrix: run it against the unfixed codec in a browser
// with `node tests/browser-runner.js chrome --url-search script=./test-wasm-stream-abort.js`. The
// native codec is forced off so the wasm one runs on every engine, and a single worker slot keeps
// every aborted task on the same heap. A wrong password aborts a read inside the worker, which is
// kept and reused; a failing source aborts a write, which terminates the worker, so that direction
// runs without workers only. Streams are not transferred to the worker: the leak is in the codec
// heap, not in the transfer, and a few hundred transferred pairs crash the renderer of Chromium 87.

import * as zip from "../zip-lib.js";

const ABORTED_READS = 160;
const ABORTED_WRITES = 60;
const PASSWORD = "password";
const WRONG_PASSWORD = "wrong";
const ENTRY_NAME = "entry.txt";
const GOOD_ENTRY_NAME = "good.txt";
const TEXT = generateText(2000);
const ALLOCATION_FAILED = "allocation failed";

export { test };

async function test() {
	try {
		await zip.terminateWorkers();
		for (const useWebWorkers of [false, true]) {
			zip.configure({ useWebWorkers, useCompressionStream: false, maxWorkers: 1 });
			const data = await writeArchive();
			const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
			const [entry] = await zipReader.getEntries();
			for (let index = 0; index < ABORTED_READS; index++) {
				const error = await rejection(entry.getData(new zip.Uint8ArrayWriter(), { password: WRONG_PASSWORD }));
				if (!error || error.message != zip.ERR_INVALID_PASSWORD) {
					throw new Error("aborted read " + index + " (useWebWorkers=" + useWebWorkers + ") " + describe(error));
				}
			}
			const text = await entry.getData(new zip.TextWriter(), { password: PASSWORD });
			await zipReader.close();
			if (text != TEXT) {
				throw new Error("the entry does not read back after " + ABORTED_READS + " aborted reads (useWebWorkers=" + useWebWorkers + ")");
			}
			if (!useWebWorkers) {
				for (let index = 0; index < ABORTED_WRITES; index++) {
					const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
					const error = await rejection(zipWriter.add(ENTRY_NAME, { readable: failingReadable() }));
					if (!error || error.message == ALLOCATION_FAILED) {
						throw new Error("aborted write " + index + " " + describe(error));
					}
					await zipWriter.add(GOOD_ENTRY_NAME, new zip.TextReader(TEXT));
					await zipWriter.close();
				}
			}
		}
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function writeArchive() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(ENTRY_NAME, new zip.TextReader(TEXT), { password: PASSWORD });
	return zipWriter.close();
}

function failingReadable() {
	let pulled = false;
	return new ReadableStream({
		pull(controller) {
			if (pulled) {
				controller.error(new Error("source failed"));
			} else {
				pulled = true;
				controller.enqueue(new TextEncoder().encode(TEXT));
			}
		}
	});
}

async function rejection(promise) {
	try {
		await promise;
	} catch (error) {
		return error;
	}
}

function describe(error) {
	return error ? "rejected with " + (error.message || error) : "did not reject";
}

function generateText(wordCount) {
	const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"];
	let seed = 42;
	const result = [];
	for (let index = 0; index < wordCount; index++) {
		seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
		result.push(words[seed % words.length]);
	}
	return result.join(" ");
}
