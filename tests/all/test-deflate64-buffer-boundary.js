/* global URL */

import * as zip from "../zip-lib.js";
import { CompressionStreamZlib, DecompressionStreamZlib } from "../../lib/core/streams/zlib-js/zlib-streams.min.js";

// the first match fills the 64KB output buffer of the codec exactly, so the maximal match that follows
// starts with no room left: the codec fills a whole buffer without consuming any input, which used to
// abort the entry with a Z_BUF_ERROR because no consumed input was read as no progress
const TEXT_CONTENT = "A".repeat(1 + 65535 + 65538) + "B".repeat(1000);
const url = new URL("./../data/boundary-match-deflate64.zip", import.meta.url).href;
// absolute so that the worker is found when the suite runs against the built files, where relative
// URIs resolve next to index.min.js instead of next to lib/
const nativeWorkerURI = new URL("./../../lib/core/web-worker-native.js", import.meta.url).href;

export { test };

async function test() {
	// wasm implementation (index.js flavor, the suite default)
	await testEntry();
	try {
		// JS implementation, configured like index-native.js does
		zip.configure({
			workerURI: nativeWorkerURI,
			wasmURI: null,
			CompressionStreamFallback: CompressionStreamZlib,
			DecompressionStreamFallback: DecompressionStreamZlib
		});
		await testEntry();
	} finally {
		zip.resetConfiguration();
	}
}

async function testEntry() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }), { checkCrc32: true });
	try {
		const entries = await zipReader.getEntries();
		const text = await entries[0].getData(new zip.TextWriter());
		if (TEXT_CONTENT != text) {
			throw new Error();
		}
	} finally {
		await zipReader.close();
		await zip.terminateWorkers();
	}
}
