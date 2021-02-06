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
		intro:
			`
			import { configure } from "./core/configuration.js"; 
			export default () => { 
				if (typeof URL.createObjectURL == "function") {
					const code = (() => {
			`,
		file: "lib/z-worker-inline.js",
		outro:
			`		}).toString(); 				
					const uri = URL.createObjectURL(new Blob(["(" + code + ")()"], { type : "text/javascript" })); 
					configure({ workerScripts: { inflate: [uri], deflate: [uri] } });
				}
			};`,
		format: "esm",
		plugins: [terser()]
	}]
}];
