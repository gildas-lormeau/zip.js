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
	},
	mangle: {
		properties: {
			reserved: ["codecType", "config", "salt", "iterations", "keys", "password", "encryptionStrength", "encrypted", "signed", "compressed", "level", "zipCrypto", "passwordVerification"]
		}
	}
};

export default [{
	input: "lib/z-worker.js",
	output: [{
		file: "lib/z-worker-inline.js",
		format: "es",
		plugins: [terser(inlineTerserOptions)]
	}]
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
	}]
}, {
	input: ["lib/zip-full.js"],
	output: [{
		file: "dist/zip-full.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		file: "dist/zip-full.js",
		format: "umd",
		name: "zip"
	}]
}, {
	input: "lib/zip-no-worker.js",
	output: [{
		file: "dist/zip-no-worker.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}]
}, {
	input: "lib/zip-no-worker-deflate.js",
	output: [{
		file: "dist/zip-no-worker-deflate.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}]
}, {
	input: "lib/zip-no-worker-inflate.js",
	output: [{
		file: "dist/zip-no-worker-inflate.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}]
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
	}]
}, {
	input: "index.js",
	output: [{
		file: "dist/zip-fs-full.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		file: "dist/zip-fs-full.js",
		format: "umd",
		name: "zip"
	}]
}, {
	input: "lib/z-worker-bootstrap-pako.js",
	output: [{
		file: "dist/z-worker-pako.js",
		format: "iife",
		plugins: [terser(bundledTerserOptions)]
	}]
}, {
	input: "lib/z-worker-bootstrap-fflate.js",
	output: [{
		file: "dist/z-worker-fflate.js",
		format: "iife",
		plugins: [terser(bundledTerserOptions)]
	}]
}, {
	input: "lib/z-worker.js",
	output: [{
		file: "dist/z-worker.js",
		format: "iife",
		plugins: [terser(bundledTerserOptions)]
	}]
}];