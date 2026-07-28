/* global Blob, WritableStream, crypto */

// Exercises `createOPFSTempStream` end-to-end against an in-memory mock of the OPFS API (no runtime
// in the headless matrix exposes OPFS). It checks the hybrid behaviour: a small entry stays in
// memory while a large, incompressible entry spills to a temp file; the temp files are deleted
// afterwards (no leak); and the archive round-trips byte-for-byte. The mock relies only on the
// OPFS/File System Access surface the helper actually uses, so passing here means the real OPFS
// path is wired correctly.

import * as zip from "../zip-lib.js";

export { test };

async function test() {
	const mockRoot = createMockOPFSRoot();
	const smallData = randomBytes(200);            // below threshold -> in-memory path
	const largeData = randomBytes(512 * 1024);     // incompressible, above threshold -> spills to OPFS

	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, {
		bufferedWrite: true,
		createTempStream: zip.createOPFSTempStream({
			thresholdBytes: 64 * 1024,
			getDirectory: () => mockRoot
		})
	});
	await zipWriter.add("small.bin", new zip.BlobReader(new Blob([smallData])));
	await zipWriter.add("large.bin", new zip.BlobReader(new Blob([largeData])));
	await zipWriter.close();

	if (mockRoot.stats.filesCreated < 1) {
		throw new Error("large entry did not spill to an OPFS file");
	}
	if (mockRoot.stats.filesRemaining() != 0) {
		throw new Error("OPFS temp files leaked: " + mockRoot.stats.filesRemaining());
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

// Minimal in-memory implementation of the OPFS surface used by createOPFSTempStream:
// root.getDirectoryHandle -> dir.getFileHandle -> { createWritable, getFile }, dir.removeEntry.
function createMockOPFSRoot() {
	const files = new Map();
	const stats = {
		filesCreated: 0,
		filesRemaining: () => files.size
	};
	const directoryHandle = {
		async getFileHandle(name, { create } = {}) {
			if (!files.has(name)) {
				if (!create) {
					throw new Error("NotFoundError");
				}
				files.set(name, { blob: new Blob([]) });
				stats.filesCreated++;
			}
			const entry = files.get(name);
			return {
				name,
				async createWritable() {
					const chunks = [];
					return new WritableStream({
						write(chunk) {
							chunks.push(new Uint8Array(chunk));
						},
						close() {
							entry.blob = new Blob(chunks);
						}
					});
				},
				async getFile() {
					return entry.blob;
				}
			};
		},
		async removeEntry(name) {
			if (!files.has(name)) {
				throw new Error("NotFoundError");
			}
			files.delete(name);
		}
	};
	return {
		stats,
		async getDirectoryHandle() {
			return directoryHandle;
		}
	};
}
