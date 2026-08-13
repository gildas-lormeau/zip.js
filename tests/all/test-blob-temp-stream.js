/* global Blob, crypto, ReadableStream */

// Exercises `createBlobTempStream` end-to-end. It checks the hybrid behaviour by spying on the
// global `Response` constructor (the helper builds its spill Blob with `new Response(stream).blob()`):
// a small entry stays in memory and constructs no Response, a large incompressible entry above the
// threshold spills into exactly one Blob, and the archive round-trips byte-for-byte through both
// paths. The Uint8ArrayWriter output keeps the spy free of the BlobWriter's own Response usage.
// When the global streams are polyfilled, the helper accumulates chunks instead of using Response,
// so the spy assertions only run when platform streams match the global ones.

import * as zip from "../zip-lib.js";

export { test };

async function test() {
	const smallData = randomBytes(200);
	const largeData = randomBytes(512 * 1024);
	const OriginalResponse = globalThis.Response;
	let responseCount = 0;
	globalThis.Response = class extends OriginalResponse {
		constructor(...args) {
			super(...args);
			responseCount++;
		}
	};
	let zipData;
	try {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), {
			bufferedWrite: true,
			createTempStream: zip.createBlobTempStream({ thresholdBytes: 64 * 1024 })
		});
		const responseUsedForSpills = new Blob([]).stream() instanceof ReadableStream;
		await zipWriter.add("small.bin", new zip.BlobReader(new Blob([smallData])));
		if (responseUsedForSpills && responseCount != 0) {
			throw new Error("small entry spilled to a Blob instead of staying in memory");
		}
		await zipWriter.add("large.bin", new zip.BlobReader(new Blob([largeData])));
		if (responseUsedForSpills && responseCount != 1) {
			throw new Error("large entry did not spill to exactly one Blob: " + responseCount);
		}
		zipData = await zipWriter.close();
	} finally {
		globalThis.Response = OriginalResponse;
	}

	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(zipData));
	const entries = await zipReader.getEntries();
	const got = {};
	for (const entry of entries) {
		got[entry.filename] = new Uint8Array(await entry.getData(new zip.Uint8ArrayWriter()));
	}
	await zipReader.close();
	await zip.terminateWorkers();
	if (!bytesEqual(got["small.bin"], smallData) || !bytesEqual(got["large.bin"], largeData)) {
		throw new Error("content mismatch after Blob temp stream round-trip");
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
