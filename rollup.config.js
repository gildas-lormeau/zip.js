import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "url";
import { getReservedPropertyNames } from "./reserved-property-names.js";
import { MANGLED_PROPERTY_NAMES } from "./mangled-property-names.js";
import { generateMimeTypeData } from "./generate-mime-type-data.js";
import { inlineWorker, inlineBinary } from "./rollup-plugin-inline-worker.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyWasmModule() {
	return {
		name: "copy-wasm",
		buildStart() {
			const wasmSrc = path.resolve(__dirname, "lib/core/streams/zlib-wasm/zlib-streams.wasm");
			const wasmDest = path.resolve(__dirname, "dist/zip-module.wasm");
			try {
				fs.copyFileSync(wasmSrc, wasmDest);
			} catch (e) {
				this.warn && this.warn("copy-wasm: failed to copy wasm file: " + e.message);
			}
		}
	};
}

function copyCjsTypes() {
	return {
		name: "copy-cjs-types",
		buildStart() {
			const typesSrc = path.resolve(__dirname, "index.d.ts");
			const typesDest = path.resolve(__dirname, "index.d.cts");
			try {
				fs.copyFileSync(typesSrc, typesDest);
			} catch (e) {
				this.warn && this.warn("copy-cjs-types: failed to copy declaration file: " + e.message);
			}
		}
	};
}

generateMimeTypeData();

const reservedPropertyNames = getReservedPropertyNames();
const MANGLED_PROPERTY_NAMES_PATH = path.resolve(__dirname, "mangled-property-names.js");
const UPDATE_MANGLED_PROPERTY_NAMES = Boolean(process.env.UPDATE_MANGLED_PROPERTY_NAMES);
const mangledPropertyNameCaches = [];

function terserMangler(options) {
	const nameCache = { props: {} };
	mangledPropertyNameCaches.push(nameCache);
	return terser({ ...options, nameCache });
}

function checkMangledPropertyNames() {
	return {
		name: "check-mangled-property-names",
		closeBundle() {
			const names = new Set();
			for (const { props } of mangledPropertyNameCaches) {
				for (const name of Object.keys(props.props || {})) {
					names.add(name.slice(1));
				}
			}
			const mangledNames = [...names].sort();
			if (UPDATE_MANGLED_PROPERTY_NAMES) {
				const entries = mangledNames.map(name => `\t${JSON.stringify(name)}`).join(",\n");
				fs.writeFileSync(MANGLED_PROPERTY_NAMES_PATH, `const MANGLED_PROPERTY_NAMES = [\n${entries}\n];\n\nexport { MANGLED_PROPERTY_NAMES };\n`);
			} else {
				const addedNames = mangledNames.filter(name => !MANGLED_PROPERTY_NAMES.includes(name));
				const removedNames = MANGLED_PROPERTY_NAMES.filter(name => !names.has(name));
				if (addedNames.length || removedNames.length) {
					throw new Error("mangled property names changed" +
						(addedNames.length ? "\n  added: " + addedNames.join(" ") : "") +
						(removedNames.length ? "\n  removed: " + removedNames.join(" ") : "") +
						"\n  an added name must be created and read inside the bundle only, never on an object" +
						" coming from the host, from a user or from a worker message" +
						"\n  once audited, run UPDATE_MANGLED_PROPERTY_NAMES=1 npm run build");
				}
			}
		}
	};
}

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
	},
	mangle: {
		properties: {
			keep_quoted: "strict",
			reserved: reservedPropertyNames
		}
	},
	format: {
		comments: /webpackIgnore|@vite-ignore/
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
			reserved: reservedPropertyNames
		}
	}
};

function externalAssetsReplace() {
	return replace({
		preventAssignment: true,
		delimiters: ["", ""],
		"../../dist/zip-web-worker.js": "./zip-web-worker.js",
		"../../dist/zip-module.wasm": "./zip-module.wasm"
	});
}

const GLOBALS = "const { Array, Object, String, Number, BigInt, Math, Date, Map, Set, Response, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, document, crypto, btoa, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream, navigator, Worker } = typeof globalThis !== 'undefined' ? globalThis : this || self;";
const GLOBALS_WORKER = "const { Array, Object, Number, Math, Error, Uint8Array, Uint16Array, Uint32Array, Int32Array, Map, DataView, Promise, TextEncoder, crypto, postMessage, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream } = self;";

export default [{
	input: "lib/core/web-worker-inline-template.js",
	output: [{
		file: "lib/core/web-worker-inline-wasm.js",
		format: "es"
	}],
	plugins: [
		inlineWorker({ intro: GLOBALS_WORKER, deflate: false, createPlugins: () => [terserMangler(inlineTerserOptions)] }),
		terserMangler(bundledTerserOptions)
	]
}, {
	input: "lib/core/web-worker-inline-template-native.js",
	output: [{
		file: "lib/core/web-worker-inline-native.js",
		format: "es"
	}],
	plugins: [
		inlineWorker({ intro: GLOBALS_WORKER, createPlugins: () => [terser(inlineTerserOptions)] }),
		terserMangler(bundledTerserOptions)
	]
}, {
	input: "lib/core/zlib-streams-inline-template.js",
	output: [{
		file: "lib/core/zlib-streams-inline.js",
		format: "es"
	}],
	plugins: [
		copyWasmModule(),
		copyCjsTypes(),
		inlineBinary(),
		terserMangler(bundledTerserOptions)
	]
}, {
	input: ["lib/zip-wasm.js"],
	output: [{
		intro: GLOBALS,
		file: "dist/zip.min.js",
		format: "umd",
		name: "zip",
		plugins: [terserMangler(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip.js",
		format: "umd",
		name: "zip"
	}]
}, {
	input: ["lib/zip-native.js"],
	output: [{
		intro: GLOBALS,
		file: "dist/zip-native.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip-native.js",
		format: "umd",
		name: "zip"
	}]
}, {
	input: ["lib/zip-legacy.js"],
	output: [{
		intro: GLOBALS,
		file: "dist/zip-legacy.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip-legacy.js",
		format: "umd",
		name: "zip"
	}]
}, {
	input: ["lib/zip-core.js"],
	output: [{
		intro: GLOBALS,
		file: "dist/zip-core.min.js",
		format: "umd",
		name: "zip",
		plugins: [terserMangler(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip-core.js",
		format: "umd",
		name: "zip"
	}]
}, {
	input: "lib/core/zip-fs.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-fs-core.min.js",
		format: "umd",
		name: "zip",
		plugins: [terserMangler(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip-fs-core.js",
		format: "umd",
		name: "zip"
	}]
}, {
	input: "lib/zip-fs-wasm.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-fs.min.js",
		format: "umd",
		name: "zip",
		plugins: [terserMangler(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip-fs.js",
		format: "umd",
		name: "zip"
	}, {
		file: "index.cjs",
		format: "cjs"
	}, {
		file: "index.min.js",
		format: "es",
		plugins: [terserMangler(bundledTerserOptions)]
	}]
}, {
	input: "lib/zip-fs-native.js",
	output: [{
		intro: GLOBALS,
		file: "dist/zip-fs-native.min.js",
		format: "umd",
		name: "zip",
		plugins: [terser(bundledTerserOptions)]
	}, {
		intro: GLOBALS,
		file: "dist/zip-fs-native.js",
		format: "umd",
		name: "zip"
	}, {
		file: "index-native.cjs",
		format: "cjs"
	}, {
		file: "index-native.min.js",
		format: "es",
		plugins: [terser(bundledTerserOptions)]
	}]
}, {
	input: "lib/zip-fs-external.js",
	plugins: [externalAssetsReplace()],
	output: [{
		file: "dist/zip-fs-external.min.js",
		format: "es",
		plugins: [terserMangler(bundledTerserOptions)]
	}, {
		file: "dist/zip-fs-external.js",
		format: "es"
	}]
}, {
	input: "lib/zip-fs-core-external.js",
	plugins: [externalAssetsReplace()],
	output: [{
		file: "dist/zip-fs-core-external.min.js",
		format: "es",
		plugins: [terserMangler(bundledTerserOptions)]
	}, {
		file: "dist/zip-fs-core-external.js",
		format: "es"
	}]
}, {
	input: "lib/zip-core-external.js",
	plugins: [externalAssetsReplace()],
	output: [{
		file: "dist/zip-core-external.min.js",
		format: "es",
		plugins: [terserMangler(bundledTerserOptions)]
	}, {
		file: "dist/zip-core-external.js",
		format: "es"
	}]
}, {
	input: "lib/core/web-worker-wasm.js",
	output: [{
		intro: GLOBALS_WORKER,
		file: "dist/zip-web-worker.js",
		format: "iife",
		plugins: [terserMangler(bundledTerserOptions)]
	}]
}, {
	input: "lib/core/web-worker-native.js",
	output: [{
		intro: GLOBALS_WORKER,
		file: "dist/zip-web-worker-native.js",
		format: "iife",
		plugins: [terser(bundledTerserOptions)]
	}],
	plugins: [checkMangledPropertyNames()]
}];