/* global URL, WebAssembly, fetch */

// The *_process exports of the wasm codec pack the produced byte count in the low 24 bits and the
// zlib status code in the top byte. Their error paths used to return a bare negative int, which
// zlib-streams.js decoded as 16777214 produced bytes and copied out of the heap into a 64KB buffer,
// so an out-of-memory codec failure surfaced as "RangeError: offset is out of bounds". The wasm is
// vendored as a binary, so nothing else in this suite would notice it being re-vendored stale.
// The module uses bulk memory operations, which browsers older than the ones running the WebAssembly
// build reject at validation, hence the wasmBuild feature this test is registered with.
const wasmURI = new URL("./../../lib/core/streams/zlib-wasm/zlib-streams.wasm", import.meta.url).href;
const PROCESS_EXPORT_NAMES = ["deflate_process", "inflate_process", "inflate9_process"];
const Z_STREAM_ERROR = -2;

export { test };

async function test() {
	const arrayBuffer = await (await fetch(wasmURI)).arrayBuffer();
	const { instance } = await WebAssembly.instantiate(arrayBuffer);
	const out = instance.exports.malloc(64 * 1024);
	for (const name of PROCESS_EXPORT_NAMES) {
		// a null stream handle takes the Z_STREAM_ERROR path of every process function
		const result = instance.exports[name](0, 0, 0, out, 64 * 1024, 0);
		const produced = result & 0x00ffffff;
		const code = (result >> 24) & 0xff;
		const signedCode = (code & 0x80) ? code - 256 : code;
		if (produced !== 0 || signedCode !== Z_STREAM_ERROR) {
			throw new Error(`${name}: produced ${produced} and code ${signedCode}, expected 0 and ${Z_STREAM_ERROR}`);
		}
	}
}
