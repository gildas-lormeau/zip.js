/* global navigator, Blob, crypto */

// End-to-end test of createOPFSTempStream against the real Origin Private File System. Runs in a
// browser only (no headless JS runtime exposes OPFS). A small entry stays in memory, a large
// incompressible entry spills to a real OPFS file; the temp directory is checked to be empty
// afterwards (no leak) and the archive is verified to round-trip byte-for-byte.

import * as zip from "../zip-lib.js";

const DIRECTORY_NAME = ".zip.js-temp";

export { test };

async function test() {
	if (!(navigator.storage && navigator.storage.getDirectory)) {
		throw new Error("OPFS is not available in this environment");
	}
	await removeTempDirectory();
	const smallData = randomBytes(200);                // below threshold -> in-memory path
	const largeData = randomBytes(2 * 1024 * 1024);    // above the 1 MiB default -> spills to OPFS

	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, {
		bufferedWrite: true,
		createTempStream: zip.createOPFSTempStream()
	});
	await zipWriter.add("small.bin", new zip.BlobReader(new Blob([smallData])));
	await zipWriter.add("large.bin", new zip.BlobReader(new Blob([largeData])));
	await zipWriter.close();

	const remaining = await countTempFiles();
	if (remaining != 0) {
		throw new Error("OPFS temp files leaked: " + remaining);
	}

	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const got = {};
	for (const entry of entries) {
		got[entry.filename] = new Uint8Array(await entry.getData(new zip.Uint8ArrayWriter()));
	}
	await zipReader.close();
	await zip.terminateWorkers();
	if (!bytesEqual(got["small.bin"], smallData) || !bytesEqual(got["large.bin"], largeData)) {
		throw new Error("content mismatch after OPFS round-trip");
	}
}

async function countTempFiles() {
	const root = await navigator.storage.getDirectory();
	let directoryHandle;
	try {
		directoryHandle = await root.getDirectoryHandle(DIRECTORY_NAME, { create: false });
	} catch {
		return 0;
	}
	let count = 0;
	for await (const name of directoryHandle.keys()) {
		void name;
		count++;
	}
	return count;
}

async function removeTempDirectory() {
	const root = await navigator.storage.getDirectory();
	try {
		await root.removeEntry(DIRECTORY_NAME, { recursive: true });
	} catch {
		// the directory does not exist yet; ignored
	}
}

function randomBytes(length) {
	const array = new Uint8Array(length);
	for (let offset = 0; offset < length; offset += 65536) {
		crypto.getRandomValues(array.subarray(offset, Math.min(offset + 65536, length)));
	}
	return array;
}

function bytesEqual(a, b) {
	if (!a || !b || a.length != b.length) {
		return false;
	}
	for (let index = 0; index < a.length; index++) {
		if (a[index] != b[index]) {
			return false;
		}
	}
	return true;
}
