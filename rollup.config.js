import { terser } from "rollup-plugin-terser";

export default [
	{
		input: "lib/zip.js",
		output: [
			{
				file: "dist/zip.min.js",
				format: "umd",
				name: "zip",
				plugins: [
					terser()
				]
			},
			{
				file: "dist/zip.js",
				format: "umd",
				name: "zip",
				plugins: [
				]
			}
		]
	}, {
		input: "lib/zip-fs.js",
		output: [
			{
				file: "dist/zip-fs.min.js",
				format: "umd",
				name: "zip",
				plugins: [
					terser()
				]
			},
			{
				file: "dist/zip-fs.js",
				format: "umd",
				name: "zip",
				plugins: [
				]
			}
		]
	}, {
		input: "lib/z-worker.js",
		output: [
			{
				file: "dist/z-worker.js",
				format: "iife",
				plugins: [
					terser()
				]
			}
		]
	}, {
		input: "lib/z-worker-pako.js",
		output: [
			{
				file: "dist/z-worker-pako.js",
				format: "iife",
				plugins: [
					terser()
				]
			}
		]
	}
];