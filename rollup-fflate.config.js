import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import fs from "fs";

const bundledTerserOptions = {
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

export default [{
	input: "lib/z-worker-fflate.js",
	output: [{
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
		file: "dist/zip.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		file: "dist/zip.js",
		format: "umd",
		name: "zip"
	}],
	plugins: [nodeResolve()]
}, {
	input: ["lib/zip-full-fflate.js"],
	output: [{
		file: "dist/zip-full.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		file: "dist/zip-full.js",
		format: "umd",
		name: "zip"
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/zip-no-worker-fflate.js",
	output: [{
		file: "dist/zip-no-worker.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/zip-no-worker-fflate-deflate.js",
	output: [{
		file: "dist/zip-no-worker-deflate.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/zip-no-worker-fflate-inflate.js",
	output: [{
		file: "dist/zip-no-worker-inflate.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/zip-fs.js",
	output: [{
		file: "dist/zip-fs.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		file: "dist/zip-fs.js",
		format: "umd",
		name: "zip"
	}],
	plugins: [nodeResolve()]
}, {
	input: "index-fflate.js",
	output: [{
		file: "dist/zip-fs-full.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		file: "dist/zip-fs-full.js",
		format: "umd",
		name: "zip"
	}],
	plugins: [nodeResolve()]
}, {
	input: "lib/z-worker.js",
	output: [{
		file: "dist/z-worker.js",
		format: "iife",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: [nodeResolve()]
}];