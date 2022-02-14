import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import fs from "fs";

const GLOBALS = "const { Array, Object, String, BigInt, Math, Date, Map, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, FileReader, document, crypto, btoa } = globalThis;";
const GLOBALS_WORKER = "const { Array, Object, Math, Error, Uint8Array, Uint16Array, Uint32Array, Int32Array, DataView, TextEncoder, crypto, postMessage } = globalThis;";

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
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/z-worker.js",
	output: [{
		intro: GLOBALS_WORKER,
		file: "dist/z-worker.js",
		format: "iife"
	}],
	plugins: [nodeResolve()]
}];