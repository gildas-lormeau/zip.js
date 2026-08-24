/* global URL, navigator */

import * as zip from "../zip-lib.js";

const URL_FIXTURE = new URL("./../data/lorem.zip", import.meta.url).href;

export { test };

// The worker pool is shared by all ZipWriter instances. An add() call queued because the pool is
// saturated by another writer must still register its entry name immediately, so that prependZip
// sees the zip as non-empty instead of interleaving its copy with the queued entry.
async function test() {
	zip.configure({ useWebWorkers: false, maxWorkers: 1 });
	try {
		let releaseGate;
		const gate = new Promise(resolve => releaseGate = resolve);
		const stallingReader = new zip.TextReader("slow content");
		const readUint8Array = stallingReader.readUint8Array.bind(stallingReader);
		stallingReader.readUint8Array = async (...args) => {
			await gate;
			return readUint8Array(...args);
		};
		const busyWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		const pendingSlowAdd = busyWriter.add("slow.txt", stallingReader);
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		const pendingQueuedAdd = zipWriter.add("queued.txt", new zip.TextReader("queued content"));
		let error;
		try {
			await zipWriter.prependZip(new zip.HttpReader(URL_FIXTURE, { preventHeadRequest: true }));
		} catch (prependError) {
			error = prependError;
		}
		releaseGate();
		await Promise.all([pendingSlowAdd, pendingQueuedAdd]);
		await busyWriter.close();
		await zipWriter.close();
		if (!error || error.message != zip.ERR_ZIP_NOT_EMPTY) {
			throw new Error("expected prependZip to see the queued entry, got " + (error ? error.message : "no error"));
		}
	} finally {
		zip.configure({ maxWorkers: (typeof navigator != "undefined" && navigator.hardwareConcurrency) || 2 });
		await zip.terminateWorkers();
	}
}
