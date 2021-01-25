import { terser } from "rollup-plugin-terser";

export default [
	{
		input: "lib/z-worker.js",
		output: [
			{
				file: "lib/z-worker-inline.js",
				format: "es",
				name: "worker",
				plugins: [
					terser()
				]
			}
		]
	},
	{
		input: "lib/z-worker-inline.js",
		output: [
			{
				file: "lib/z-worker-inline.js",
				format: "esm",
				name: "worker",
				intro: "import { configure } from \"./core/zip-core.js\"; function configureWebWorker() { const uri = URL.createObjectURL(new Blob([`",
				outro: "`])); configure({ workerScripts: { inflate: [uri], deflate: [uri] } }); } export default configureWebWorker;",
				plugins: [
					terser()
				]
			}
		]
	}
];