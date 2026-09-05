/* global URL, TextEncoder */

import * as zip from "../zip-lib.js";
import { CompressionStreamZlib, DecompressionStreamZlib } from "../../lib/core/streams/zlib-js/zlib-streams.min.js";

// the JS codec copies a match either from its sliding window or from the output buffer; a match
// straddling the point where the window wraps used to have its tail read from the output buffer,
// which returns the wrong bytes with no error at all on a raw deflate stream, cf.
// https://github.com/gildas-lormeau/zlib-streams-ts. the entry below is large enough to wrap the
// 32 KB window and mixes text with incompressible islands, which produces the long distances that
// reach across the wrap point
const CONTENT = getContent();
// absolute so that the worker is found when the suite runs against the built files, where relative
// URIs resolve next to index.min.js instead of next to lib/
const nativeWorkerURI = new URL("./../../lib/core/web-worker-native.js", import.meta.url).href;

export { test };

async function test() {
	const zipData = await createZipData();
	// wasm implementation (index.js flavor, the suite default)
	await testEntry(zipData);
	try {
		// JS implementation, configured like index-native.js does
		zip.configure({
			workerURI: nativeWorkerURI,
			wasmURI: null,
			CompressionStreamFallback: CompressionStreamZlib,
			DecompressionStreamFallback: DecompressionStreamZlib
		});
		await testEntry(zipData);
	} finally {
		zip.resetConfiguration();
	}
}

async function createZipData() {
	zip.configure({ useWebWorkers: false });
	try {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.add("data.bin", new zip.Uint8ArrayReader(CONTENT), { level: 9 });
		return await zipWriter.close();
	} finally {
		zip.resetConfiguration();
	}
}

async function testEntry(zipData) {
	// a small chunk size splits the compressed data into many codec calls, so that matches reach
	// back past the start of the current output buffer and are copied from the window
	zip.configure({ chunkSize: 8192, useWebWorkers: true, useCompressionStream: false });
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(zipData));
	try {
		const entries = await zipReader.getEntries();
		const data = await entries[0].getData(new zip.Uint8ArrayWriter());
		if (data.length != CONTENT.length) {
			throw new Error(`${data.length} bytes instead of ${CONTENT.length}`);
		}
		for (let index = 0; index < data.length; index++) {
			if (data[index] != CONTENT[index]) {
				throw new Error(`wrong byte at offset ${index}`);
			}
		}
	} finally {
		await zipReader.close();
		await zip.terminateWorkers();
	}
}

function getContent() {
	const fragments = [
		"if (state->mode == LEN) {",
		"strm->msg = (char *)",
		"state->offset = (unsigned)",
		"return Z_DATA_ERROR;",
		"unsigned char FAR *from;",
		"state->length = (unsigned)here.val;",
		"hold += (unsigned long)(*next++) << bits;",
		"bits += 8;",
		"case LENLENS:",
		"break;",
		"}",
		"\n"
	];
	const parts = [];
	let seed = 2024;
	for (let index = 0; index < 15000; index++) {
		seed = (seed * 1103515245 + 12345) & 0x7fffffff;
		parts.push(fragments[seed % fragments.length]);
		if (index % 12 == 11) {
			parts.push("\n");
		}
	}
	const content = new TextEncoder().encode(parts.join(" "));
	for (let start = 5000; start < content.length - 400; start += 20000) {
		for (let index = 0; index < 300; index++) {
			seed = (seed * 1103515245 + 12345) & 0x7fffffff;
			content[start + index] = seed & 0xff;
		}
	}
	return content;
}
