import { terser } from "rollup-plugin-terser";

export default [{
	input: "lib/z-worker.js",
	output: [{
		file: "lib/z-worker-inline.js",
		format: "es",
		plugins: [terser()]
	}]
}, {
	input: "lib/z-worker-inline.js",
	output: [{
		file: "lib/z-worker-inline.js",
		format: "esm",
		intro: "import { configure } from './core/zip-core.js'; export default () => { const uri = URL.createObjectURL(new Blob(['(' + (() => {",
		outro: "}).toString() + ')()'])); configure({ workerScripts: { inflate: [uri], deflate: [uri] } }); };",
		plugins: [terser()]
	}]
}];