import { babel } from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import fs from "fs";

const bundledTerserOptions = {
	compress: {
		unsafe: true,
		unsafe_comps: true,
		unsafe_symbols: true,
		unsafe_proto: true,
		keep_fargs: false,
		passes: 3,
		ecma: "5"
	}
};

const inlineTerserOptions = {
	compress: {
		unsafe: true,
		unsafe_comps: true,
		unsafe_math: true,
		unsafe_symbols: true,
		unsafe_proto: true,
		keep_fargs: false,
		passes: 3,
		ecma: "5"
	},
	mangle: {
		properties: {
			reserved: ["codecType", "config", "salt", "iterations", "keys", "password", "encryptionStrength", "encrypted", "signed", "compressed", "level", "zipCrypto", "passwordVerification"]
		}
	}
};

const babelPresets = [
	[
		"@babel/preset-env",
		{
			corejs: 3,
			modules: false,
			useBuiltIns: "usage",
			targets: {
				ie: "11",
				safari: "10"
			}
		}
	]
];

const bundledPlugins = [
	commonjs(),
	resolve(),
	babel({
		babelHelpers: "bundled",
		babelrc: false,
		exclude: "node_modules/**",
		presets: babelPresets,
		compact: false,
		plugins: [["babel-plugin-transform-async-to-promises", { externalHelpers: true }]]
	})
];

const inlinePlugins = [
	commonjs(),
	resolve(),
	babel({
		babelHelpers: "inline",
		babelrc: false,
		exclude: "node_modules/**",
		presets: babelPresets,
		compact: false
	})
];

export default [{
	input: "lib/z-worker.js",
	output: [{
		file: "lib/z-worker-inline.js",
		format: "es",
		plugins: [terser(inlineTerserOptions)]
	}],
	plugins: inlinePlugins
}, {
	input: "lib/z-worker-inline-template-base64.js",
	output: [{
		file: "lib/z-worker-inline.js",
		format: "es"
	}],
	plugins: [
		replace({
			preventAssignment: true,
			"__workerCode__": () => JSON.stringify(fs.readFileSync("lib/z-worker-inline.js", { encoding: "base64" }))
		}),
		terser(bundledTerserOptions)
	]
}, {
	input: ["lib/zip.js"],
	output: [{
		file: "dist/zip-es5.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		file: "dist/zip-es5.js",
		format: "umd",
		name: "zip"
	}],
	plugins: bundledPlugins
}, {
	input: ["lib/zip-full.js"],
	output: [{
		file: "dist/zip-full-es5.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		file: "dist/zip-full-es5.js",
		format: "umd",
		name: "zip"
	}],
	plugins: bundledPlugins
}, {
	input: "lib/zip-no-worker.js",
	output: [{
		file: "dist/zip-no-worker-es5.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: bundledPlugins
}, {
	input: "lib/zip-no-worker-deflate.js",
	output: [{
		file: "dist/zip-no-worker-deflate-es5.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: bundledPlugins
}, {
	input: "lib/zip-no-worker-inflate.js",
	output: [{
		file: "dist/zip-no-worker-inflate-es5.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: bundledPlugins
}, {
	input: "lib/zip-fs.js",
	output: [{
		file: "dist/zip-fs-es5.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		file: "dist/zip-fs-es5.js",
		format: "umd",
		name: "zip"
	}],
	plugins: bundledPlugins
}, {
	input: "index.js",
	output: [{
		file: "dist/zip-fs-full-es5.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		file: "dist/zip-fs-full-es5.js",
		format: "umd",
		name: "zip"
	}],
	plugins: bundledPlugins
}, {
	input: "lib/z-worker-bootstrap-pako.js",
	output: [{
		file: "dist/z-worker-pako-es5.js",
		format: "iife",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: inlinePlugins
}, {
	input: "lib/z-worker-bootstrap-fflate.js",
	output: [{
		file: "dist/z-worker-fflate-es5.js",
		format: "iife",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: inlinePlugins
}, {
	input: "lib/z-worker.js",
	output: [{
		file: "dist/z-worker-es5.js",
		format: "iife",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: inlinePlugins
}];