/* global zip */

// configure all test cases.

zip.configure({
	useWebWorkers: true,
	workerScriptsPath: "../../dist/"
});

// to test third party deflate implementations, comment out "zip.workerScriptsPath =..." and uncomment "zip.workerScripts = ..."
/*
workerScripts = {
	// default zip.js implementation
	deflate: ["../dist/z-worker.js", "../dist/deflate.js", "../dist/crypto.js"],
	inflate: ["../dist/z-worker.js", "../dist/inflate.js", "../dist/crypto.js"],

	// pako
	// deflate: ["../dist/z-worker.js", "../worker-wrappers/pako/pako.min.js", "../pako/codecs.js", "../dist/crypto.js"],
	// inflate: ["../dist/z-worker.js", "../worker-wrappers/pako/pako.min.js", "../pako/codecs.js", "../dist/crypto.js"],
};
*/
