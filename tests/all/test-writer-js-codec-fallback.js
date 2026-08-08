// Regression test for codec selection when the WASM module cannot load. Setting useCompressionStream
// to false asks for the zlib codec rather than the native CompressionStream; a caller may also supply
// a self-contained pure-JS codec via CompressionStreamZlib/DecompressionStreamZlib. When the WASM
// module fails to load (here forced with wasmURI:null), the worker used to unconditionally fall back
// to the native CompressionStream, silently discarding the explicitly provided JS codec. It must now
// keep that codec, because — unlike the WASM codec — it does not depend on the module.

/* global CompressionStream, DecompressionStream */

import * as zip from "../zip-lib.js";
import {
	CompressionStreamZlib as JsDeflate,
	DecompressionStreamZlib as JsInflate
} from "../../lib/core/streams/zlib-js/zlib-streams.min.js";

const CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ".repeat(256);

export { test };

async function test() {
	let jsDeflateUsed = false;
	let jsInflateUsed = false;
	let nativeUsed = false;
	const NativeCompression = CompressionStream;
	const NativeDecompression = DecompressionStream;
	// Spies: flag which codec the pipeline actually constructs. Each returns a real instance so the
	// round-trip still works; the assertions below check that the JS port ran and native did not.
	function SpyJsDeflate(format, options) { jsDeflateUsed = true; return new JsDeflate(format, options); }
	function SpyJsInflate(format, options) { jsInflateUsed = true; return new JsInflate(format, options); }
	function SpyNativeCompression(format, options) { nativeUsed = true; return new NativeCompression(format, options); }
	function SpyNativeDecompression(format, options) { nativeUsed = true; return new NativeDecompression(format, options); }
	try {
		// useWebWorkers:false keeps the codec in-process so the supplied classes are honoured (they
		// cannot cross a real worker boundary) and no worker/message-port is created. wasmURI:null
		// forces the module load to fail, exercising the fallback path.
		zip.configure({
			useWebWorkers: false,
			useCompressionStream: false,
			wasmURI: null,
			CompressionStream: SpyNativeCompression,
			DecompressionStream: SpyNativeDecompression,
			CompressionStreamZlib: SpyJsDeflate,
			DecompressionStreamZlib: SpyJsInflate
		});
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.add("lorem.txt", new zip.TextReader(CONTENT));
		const data = await zipWriter.close();

		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		const [entry] = await zipReader.getEntries();
		const content = await entry.getData(new zip.TextWriter());
		await zipReader.close();

		if (content !== CONTENT) {
			throw new Error("round-trip content mismatch");
		}
		if (!jsDeflateUsed) {
			throw new Error("the provided JS deflate codec was discarded (fell back to native) on WASM load failure");
		}
		if (!jsInflateUsed) {
			throw new Error("the provided JS inflate codec was discarded (fell back to native) on WASM load failure");
		}
		if (nativeUsed) {
			throw new Error("the native CompressionStream was used despite an explicitly provided JS codec");
		}
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}
