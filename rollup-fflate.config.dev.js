// You must install fflate (e.g. npm i fflate) before running this script

import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import fs from "fs";

const GLOBALS = "const { Array, Object, String, Number, BigInt, Math, Date, Map, Set, Response, URL, Error, Uint8Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, document, crypto, btoa, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream, navigator, Worker } = typeof globalThis !== 'undefined' ? globalThis : this || self;";
const GLOBALS_WORKER = "const { Array, Object, Number, Math, Error, Uint8Array, Uint32Array, Int32Array, Map, DataView, Promise, TextEncoder, crypto, postMessage, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream } = self;";

export default [{
	input: "lib/z-worker-fflate.js",
	output: [{
		intro: GLOBALS_WORKER,
		file: "lib/z-worker-inline.js",
		format: "umd"
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/z-worker-inline-template.js",
	output: [{
		file: "lib/z-worker-inline.js",
		format: "es"
	}],
	plugins: [
		replace({
			preventAssignment: true,
			"__workerCode__": () => fs.readFileSync("lib/z-worker-inline.js").toString()
		})
	]
}, {
	input: ["lib/zip.js"],
	output: [{
		intro: GLOBALS,
		file: "dist/zip.min.js",
		format: "umd",
		name: "zip"
	}, {
		intro: GLOBALS,
		file: "dist/zip.js",
		format: "umd",
		name: "zip"
	}],
	plugins: [nodeResolve()]
}, {
	input: ["lib/zip-full-fflate.js"],
	output: [{
		intro: GLOBALS,
		file: "dist/zip-full.min.js",
		format: "umd",
		name: "zip"
	}, {
		intro: GLOBALS,
		file: "dist/zip-full.js",
		format: "umd",
		name: "zip"
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/zip-no-worker-fflate.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-no-worker.min.js",
		format: "umd",
		name: "zip"
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/zip-no-worker-fflate-deflate.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-no-worker-deflate.min.js",
		format: "umd",
		name: "zip"
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/zip-no-worker-fflate-inflate.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-no-worker-inflate.min.js",
		format: "umd",
		name: "zip"
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/zip-fs.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-fs.min.js",
		format: "umd",
		name: "zip"
	}, {
		intro: GLOBALS,
		file: "dist/zip-fs.js",
		format: "umd",
		name: "zip"
	}],
	plugins: [nodeResolve()]
}, {
	input: "index-fflate.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-fs-full.min.js",
		format: "umd",
		name: "zip"
	}, {
		intro: GLOBALS,
		file: "dist/zip-fs-full.js",
		format: "umd",
		name: "zip"
	}, {
		file: "index.cjs",
		format: "cjs"
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/z-worker-fflate.js",
	output: [{
		intro: GLOBALS_WORKER,
		file: "dist/z-worker.js",
		format: "iife"
	}],
	plugins: [nodeResolve()]
}];