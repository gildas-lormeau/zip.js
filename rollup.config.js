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
const DEV = Boolean(process.env.DEV);

generateMimeTypeData();
fs.copyFileSync(path.resolve(__dirname, "lib/core/streams/zlib-wasm/zlib-streams.wasm"), path.resolve(__dirname, "dist/zip-module.wasm"));
fs.copyFileSync(path.resolve(__dirname, "index.d.ts"), path.resolve(__dirname, "index.d.cts"));

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

function minPlugins(mangle) {
	if (DEV) {
		return [];
	}
	return [mangle ? terserMangler(bundledTerserOptions) : terser(bundledTerserOptions)];
}

function inlineWorkerEntry({ input, file, deflate, mangle }) {
	const options = { intro: GLOBALS_WORKER, deflate };
	if (!DEV) {
		options.createPlugins = () => [mangle ? terserMangler(inlineTerserOptions) : terser(inlineTerserOptions)];
	}
	return {
		input,
		output: [{
			file,
			format: "es"
		}],
		plugins: [inlineWorker(options), ...minPlugins(true)]
	};
}

function umdBundleEntry({ input, name, mangle, moduleFile }) {
	const output = [{
		intro: GLOBALS,
		file: "dist/" + name + ".min.js",
		format: "umd",
		name: "zip",
		plugins: minPlugins(mangle)
	}, {
		intro: GLOBALS,
		file: "dist/" + name + ".js",
		format: "umd",
		name: "zip"
	}];
	if (moduleFile) {
		output.push({
			file: moduleFile + ".cjs",
			format: "cjs"
		}, {
			file: moduleFile + ".min.js",
			format: "es",
			plugins: minPlugins(mangle)
		});
	}
	return { input, output };
}

function externalBundleEntry({ input, name }) {
	return {
		input,
		plugins: [externalAssetsReplace()],
		output: [{
			file: "dist/" + name + ".min.js",
			format: "es",
			plugins: minPlugins(true)
		}, {
			file: "dist/" + name + ".js",
			format: "es"
		}]
	};
}

function workerBundleEntry({ input, name, mangle }) {
	return {
		input,
		output: [{
			intro: GLOBALS_WORKER,
			file: "dist/" + name + ".js",
			format: "iife",
			plugins: minPlugins(mangle)
		}]
	};
}

const config = [
	inlineWorkerEntry({ input: "lib/core/web-worker-inline-template.js", file: "lib/core/web-worker-inline-wasm.js", deflate: false, mangle: true }),
	inlineWorkerEntry({ input: "lib/core/web-worker-inline-template-native.js", file: "lib/core/web-worker-inline-native.js", deflate: true, mangle: false }),
	{
		input: "lib/core/zlib-streams-inline-template.js",
		output: [{
			file: "lib/core/zlib-streams-inline.js",
			format: "es"
		}],
		plugins: [inlineBinary(), ...minPlugins(true)]
	},
	umdBundleEntry({ input: "lib/zip-wasm.js", name: "zip", mangle: true }),
	umdBundleEntry({ input: "lib/zip-native.js", name: "zip-native", mangle: false }),
	umdBundleEntry({ input: "lib/zip-legacy.js", name: "zip-legacy", mangle: false }),
	umdBundleEntry({ input: "lib/zip-core.js", name: "zip-core", mangle: true }),
	umdBundleEntry({ input: "lib/core/zip-fs.js", name: "zip-fs-core", mangle: true }),
	umdBundleEntry({ input: "lib/zip-fs-wasm.js", name: "zip-fs", mangle: true, moduleFile: "index" }),
	umdBundleEntry({ input: "lib/zip-fs-native.js", name: "zip-fs-native", mangle: false, moduleFile: "index-native" }),
	externalBundleEntry({ input: "lib/zip-fs-external.js", name: "zip-fs-external" }),
	externalBundleEntry({ input: "lib/zip-fs-core-external.js", name: "zip-fs-core-external" }),
	externalBundleEntry({ input: "lib/zip-core-external.js", name: "zip-core-external" }),
	workerBundleEntry({ input: "lib/core/web-worker-wasm.js", name: "zip-web-worker", mangle: true }),
	workerBundleEntry({ input: "lib/core/web-worker-native.js", name: "zip-web-worker-native", mangle: false })
];

if (!DEV) {
	const lastEntry = config[config.length - 1];
	lastEntry.plugins = [...(lastEntry.plugins || []), checkMangledPropertyNames()];
}

export default config;
