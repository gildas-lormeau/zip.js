import js from "@eslint/js";

export default [
	{
		ignores: [
			"**/node_modules/",
			".git/",
			"dist/",
			"**/*-inline.js",
			"lib/core/web-worker-inline-native.js",
			"lib/core/web-worker-inline-wasm.js",
			"lib/core/streams/zlib-js/zlib-streams.min.js",
			"tests/vendor/",
			"tests/corpus/",
			"index.cjs",
			"index.min.js",
			"index-native.cjs",
			"index-native.min.js"
		]
	},
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
			globals: {
				console: "readonly"
			}
		},
		rules: {
			"indent": [
				"error",
				"tab",
				{
					"SwitchCase": 1
				}
			],
			"linebreak-style": [
				"error",
				"unix"
			],
			"quotes": [
				"error",
				"double"
			],
			"semi": [
				"error",
				"always"
			],
			"no-console": [
				"warn"
			]
		}
	},
	{
		files: ["benchmarks/**/*.js", "benchmarks/**/*.mjs", "tests/browser-runner.js", "tests/fidelity/**/*.js", "tests/api-symmetry/**/*.js"],
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				AbortSignal: "readonly",
				Blob: "readonly",
				Buffer: "readonly",
				clearTimeout: "readonly",
				CompressionStream: "readonly",
				crypto: "readonly",
				Deno: "readonly",
				fetch: "readonly",
				performance: "readonly",
				process: "readonly",
				ReadableStream: "readonly",
				setTimeout: "readonly",
				TextDecoder: "readonly",
				TextEncoder: "readonly",
				TransformStream: "readonly",
				URL: "readonly",
				WritableStream: "readonly",
				Worker: "readonly"
			}
		},
		rules: {
			"no-console": "off"
		}
	}
];
