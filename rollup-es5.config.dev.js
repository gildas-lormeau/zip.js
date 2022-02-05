import { babel } from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import fs from "fs";

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
		format: "umd"
	}],
	plugins: inlinePlugins
}, {
	input: "lib/z-worker-inline-template-base64.js",
	output: [{
		file: "lib/z-worker-inline.js",
		format: "es"
	}],
	plugins: [replace({
		preventAssignment: true,
		"__workerCode__": () => JSON.stringify(fs.readFileSync("lib/z-worker-inline.js", { encoding: "base64" }))
	})]
}, {
	input: ["lib/zip.js"],
	output: [{
		file: "dist/zip-es5.min.js",
		format: "umd",
		name: "zip"
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
		name: "zip"
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
		name: "zip"
	}],
	plugins: bundledPlugins
}, {
	input: "lib/zip-no-worker-deflate.js",
	output: [{
		file: "dist/zip-no-worker-deflate-es5.min.js",
		format: "umd",
		name: "zip"
	}],
	plugins: bundledPlugins
}, {
	input: "lib/zip-no-worker-inflate.js",
	output: [{
		file: "dist/zip-no-worker-inflate-es5.min.js",
		format: "umd",
		name: "zip"
	}],
	plugins: bundledPlugins
}, {
	input: "lib/zip-fs.js",
	output: [{
		file: "dist/zip-fs-es5.min.js",
		format: "umd",
		name: "zip"
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
		name: "zip"
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
		format: "iife"
	}],
	plugins: inlinePlugins
}, {
	input: "lib/z-worker-bootstrap-fflate.js",
	output: [{
		file: "dist/z-worker-fflate-es5.js",
		format: "iife"
	}],
	plugins: inlinePlugins
}, {
	input: "lib/z-worker.js",
	output: [{
		file: "dist/z-worker-es5.js",
		format: "iife"
	}],
	plugins: inlinePlugins
}];