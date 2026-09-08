/* global setTimeout */

import * as zip from "../zip-lib.js";

export { test };

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ".repeat(64);
const BLOCKED_CONTENT = new Uint8Array(1024 * 1024);
const BLOCKING_READ = 3;

async function test() {
	await testResolvesOnceThePoolIsEmpty();
	await testWaitsForACodecRunningWithoutAWorker();
}

// terminateWorkers() is declared to return a promise resolved once the pool is empty. The entry
// points wrapping it must keep that contract, otherwise awaiting it resolves on the same tick and
// the caller cannot know when the workers are gone.
async function testResolvesOnceThePoolIsEmpty() {
	zip.configure({ useWebWorkers: true });
	const result = zip.terminateWorkers();
	assert(result !== undefined && typeof result.then == "function",
		"terminateWorkers() must return a promise, got " + typeof result);
	await result;
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("lorem.txt", new zip.TextReader(TEXT_CONTENT));
	const data = await zipWriter.close();
	await zip.terminateWorkers();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	try {
		const [entry] = await zipReader.getEntries();
		const content = await entry.getData(new zip.TextWriter());
		assert(content == TEXT_CONTENT, "the data must stay readable after the workers are terminated");
	} finally {
		await zipReader.close();
		await zip.terminateWorkers();
	}
}

// The same contract has to hold for a codec running without a web worker, which is what
// `useWebWorkers: false` and every worker fallback give. Resolving there while the codec is still
// running let the wasm entry point reset the module underneath it, and the entry being written
// failed with an internal TypeError instead of completing.
async function testWaitsForACodecRunningWithoutAWorker() {
	zip.configure({ useWebWorkers: false, chunkSize: 65536 });
	let startReading, releaseReader;
	const reading = new Promise(resolve => startReading = resolve);
	const blocked = new Promise(resolve => releaseReader = resolve);
	let reads = 0;
	class BlockingReader extends zip.Reader {
		constructor() {
			super();
			this.size = BLOCKED_CONTENT.length;
		}
		async readUint8Array(index, length) {
			reads++;
			if (reads == BLOCKING_READ) {
				startReading();
				await blocked;
			}
			return BLOCKED_CONTENT.slice(index, index + length);
		}
	}
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	const adding = zipWriter.add("blocked.bin", new BlockingReader());
	await reading;
	const terminating = zip.terminateWorkers();
	const state = await Promise.race([
		terminating.then(() => "resolved"),
		new Promise(resolve => setTimeout(() => resolve("pending"), 100))
	]);
	assert(state == "pending", "terminateWorkers() must not resolve while a codec runs without a web worker");
	releaseReader();
	await terminating;
	await adding;
	const data = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	try {
		const [entry] = await zipReader.getEntries();
		assert(entry.uncompressedSize == BLOCKED_CONTENT.length,
			"the entry written across the terminate must be intact, got " + entry.uncompressedSize);
	} finally {
		await zipReader.close();
		await zip.terminateWorkers();
	}
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}
