import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { compress } from "./lib/core/util/mini-lz.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyWasmModule() {
	return {
		name: "copy-wasm",
		buildStart() {
			const wasmSrc = path.resolve(__dirname, "lib/core/streams/zlib/zlib-streams.wasm");
			const wasmDest = path.resolve(__dirname, "dist/zip-module.wasm");
			try {
				fs.copyFileSync(wasmSrc, wasmDest);
			} catch (e) {
				this.warn && this.warn("copy-wasm: failed to copy wasm file: " + e.message);
			}
		}
	};
}

const bundledTerserOptions = {
	compress: {
		unsafe: true,
		unsafe_arrows: true,
		unsafe_comps: true,
		unsafe_symbols: true,
		unsafe_proto: true,
		keep_fargs: false,
		passes: 3,
		ecma: "2020"
	}
};

const inlineTerserOptions = {
	compress: {
		unsafe: true,
		unsafe_arrows: true,
		unsafe_comps: true,
		unsafe_math: true,
		unsafe_symbols: true,
		unsafe_proto: true,
		keep_fargs: false,
		passes: 3,
		ecma: "2020"
	},
	mangle: {
		properties: {
			reserved: ["codecType", "config", "salt", "iterations", "keys", "password", "rawPassword", "encryptionStrength", "encrypted", "signed", "compressed", "level", "zipCrypto", "passwordVerification", "pull", "enqueue", "close", "messageId", "chunkSize", "useCompressionStream", "preventAbort", "preventClose", "checkPasswordOnly", "inputSize", "outputSize", "wasmURI", "malloc", "free", "inflate_new", "inflate_init_raw", "inflate_init_gzip", "inflate_init", "inflate_process", "inflate_last_consumed", "inflate_end", "inflate9_new", "inflate9_init_raw", "inflate9_process", "inflate9_last_consumed", "inflate9_end", "deflate_new", "deflate_init_raw", "deflate_init_gzip", "deflate_init", "deflate_process", "deflate_last_consumed", "deflate_end"]
		}
	}
};

const GLOBALS = "const { Array, Object, String, Number, BigInt, Math, Date, Map, Set, Response, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, document, crypto, btoa, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream, navigator, Worker } = typeof globalThis !== 'undefined' ? globalThis : this || self;";
const GLOBALS_WORKER = "const { Array, Object, Number, Math, Error, Uint8Array, Uint16Array, Uint32Array, Int32Array, Map, DataView, Promise, TextEncoder, crypto, postMessage, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream } = self;";

export default [{
	input: "lib/core/web-worker.js",
	output: [{
		intro: GLOBALS_WORKER,
		file: "lib/core/web-worker-inline.js",
		format: "umd",
		plugins: [terser(inlineTerserOptions)]
	}]
}, {
	input: "lib/core/web-worker-inline-template.js",
	output: [{
		file: "lib/core/web-worker-inline.js",
		format: "es"
	}],
	plugins: [
		replace({
			preventAssignment: true,
			"__workerCode__": () => fs.readFileSync("lib/core/web-worker-inline.js").toString()
		}),
		terser(bundledTerserOptions)
	]
}, {
	input: "lib/core/zlib-streams-inline-template.js",
	output: [{
		file: "lib/core/zlib-streams-inline.js",
		format: "es"
	}],
	plugins: [
		copyWasmModule(),
		replace({
			preventAssignment: true,
			"__wasmBinary__": () => compress(fs.readFileSync("lib/core/streams/zlib/zlib-streams.wasm"))
		}),
		terser(bundledTerserOptions)
	]
}, {
	input: ["lib/zip.js"],
	output: [{
		intro: GLOBALS,
		file: "dist/zip.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip.js",
		format: "umd",
		name: "zip"
	}]
}, {
	input: ["lib/zip-core.js"],
	output: [{
		intro: GLOBALS,
		file: "dist/zip-core.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip-core.js",
		format: "umd",
		name: "zip"
	}]
}, {
	input: "lib/zip-fs-core.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-fs-core.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip-fs-core.js",
		format: "umd",
		name: "zip"
	}]
}, {
	input: "lib/zip-fs.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-fs.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip-fs.js",
		format: "umd",
		name: "zip"
	}, {
		file: "index.cjs",
		format: "cjs"
	}, {
		file: "index.min.js",
		format: "es",
		plugins: [terser(bundledTerserOptions)]
	}]
}, {
	input: "lib/core/web-worker.js",
	output: [{
		intro: GLOBALS_WORKER,
		file: "dist/zip-web-worker.js",
		format: "iife",
		plugins: [terser(bundledTerserOptions)]
	}]
}];