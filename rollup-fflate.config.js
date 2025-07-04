// You must install fflate (e.g. npm i fflate) before running this script

import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import fs from "node:fs";

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
	}
};

const GLOBALS = "const { Array, Object, String, Number, BigInt, Math, Date, Map, Set, Response, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, document, crypto, btoa, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream, navigator, Worker } = typeof globalThis !== 'undefined' ? globalThis : this || self;";
const GLOBALS_WORKER = "const { Array, Object, Number, Math, Error, Uint8Array, Uint16Array, Uint32Array, Int32Array, Map, DataView, Promise, TextEncoder, crypto, postMessage, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream } = self;";

export default [{
	input: "lib/z-worker-fflate.js",
	output: [{
		intro: GLOBALS_WORKER,
		file: "lib/z-worker-inline.js",
		format: "es",
		plugins: [terser(inlineTerserOptions)]
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
	}],
	plugins: [nodeResolve()]
}, {
	input: ["lib/zip-full-fflate.js"],
	output: [{
		intro: GLOBALS,
		file: "dist/zip-full.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
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
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/zip-no-worker-fflate-deflate.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-no-worker-deflate.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/zip-no-worker-fflate-inflate.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-no-worker-inflate.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: [nodeResolve()]
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
	}],
	plugins: [nodeResolve()]
}, {
	input: "index-fflate.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-fs-full.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip-fs-full.js",
		format: "umd",
		name: "zip"
	}, {
		file: "index.cjs",
		format: "cjs"
	}, {
		file: "index.min.js",
		format: "es",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/z-worker-fflate.js",
	output: [{
		intro: GLOBALS_WORKER,
		file: "dist/z-worker.js",
		format: "iife",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: [nodeResolve()]
}];