/* global Worker, URL, setTimeout */

// Checks that terminateWorkers() leaves nothing behind: a request queued while the only worker slot is
// busy must not spawn a worker once the call has resolved, it runs in-process instead and the call waits
// for it. Writers gate their adds on maxWorkers before the pool, so the queue is reached through two
// getData() calls at once. The worker factory counts the workers created. Where no Worker exists the
// factory throws and every codec runs in-process, which the assertions accept.

import * as zip from "../zip-lib.js";

const WORKER_SCRIPT_URI = new URL("../../lib/core/web-worker-wasm.js", import.meta.url);
const ENTRY_SIZE = 16 * 1024 * 1024;
const NAMES = ["first.bin", "second.bin"];

export { test };

async function test() {
	let createdWorkers = 0;
	try {
		const archive = await buildArchive();
		zip.configure({
			useWebWorkers: true,
			maxWorkers: 1,
			createWorker: () => {
				createdWorkers++;
				return new Worker(WORKER_SCRIPT_URI, { type: "module" });
			}
		});
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(archive));
		const entries = await zipReader.getEntries();
		const reads = entries.map(entry => entry.getData(new zip.Uint8ArrayWriter()));
		await waitFor(() => createdWorkers > 0);
		await new Promise(resolve => setTimeout(resolve, 10));
		await zip.terminateWorkers();
		const createdWhenResolved = createdWorkers;
		const outputs = await Promise.all(reads);
		await zipReader.close();
		if (createdWorkers != createdWhenResolved) {
			throw new Error("expected no worker after terminateWorkers() resolved, got " + (createdWorkers - createdWhenResolved));
		}
		if (createdWorkers > 1) {
			throw new Error("expected the queued request to run in-process, got " + createdWorkers + " workers");
		}
		if (outputs.length != NAMES.length || outputs.some(output => output.length != ENTRY_SIZE)) {
			throw new Error("unexpected entry content");
		}
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function buildArchive() {
	zip.configure({ useWebWorkers: false });
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	const data = incompressibleData(ENTRY_SIZE);
	for (const name of NAMES) {
		await zipWriter.add(name, new zip.Uint8ArrayReader(data));
	}
	const archive = await zipWriter.close();
	zip.resetConfiguration();
	await zip.terminateWorkers();
	return archive;
}

async function waitFor(condition) {
	for (let attempt = 0; attempt < 1000 && !condition(); attempt++) {
		await new Promise(resolve => setTimeout(resolve, 5));
	}
	if (!condition()) {
		throw new Error("timeout waiting for the first worker");
	}
}

function incompressibleData(size) {
	const data = new Uint8Array(size);
	let seed = 0x9e3779b9;
	for (let index = 0; index < size; index++) {
		seed ^= seed << 13;
		seed ^= seed >>> 17;
		seed ^= seed << 5;
		data[index] = seed & 0xff;
	}
	return data;
}
