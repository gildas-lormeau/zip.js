// The error messages the library builds and deliberately does not export, with the reason for each.
//
// The rule the exports audit enforces is that every message a build can surface to its caller is an exported
// constant, so that the caller can identify the error by comparing it against something the package provides
// rather than against a string copied out of the source. A message listed here is one that rule would ask for
// and that is better left out. An entry that stops applying, i.e. a message that is no longer built or is now
// exported, fails the audit, so this file cannot keep rows that describe nothing.
//
// INTERNAL_MESSAGES is keyed by the constant name, EXEMPT_MODULES and LITERAL_MESSAGES by the path of the
// module building the message, the latter listing the literal texts that module is allowed to build.

const INTERNAL_MESSAGES = {
	ERR_ABORT_CHECK_PASSWORD: "a sentinel the AES and ZipCrypto streams error with so that zip-reader.js can " +
		"recognize the end of a checkPasswordOnly read, and which it swallows at the one place it can appear",
	ERR_ABORT_EXPORT: "a sentinel exportFileSystemHandle throws at itself to unwind the entries still in " +
		"flight after the first failure, recognized by isExportAborted() and never rethrown"
};

// modules whose messages are not written here at all: the generated files the build produces from the inline
// templates, which both linters skip for the same reason
const EXEMPT_MODULES = {
	"lib/core/web-worker-inline-wasm.js": "build output, minified, carrying the bootstrap inflate that " +
		"unpacks the embedded module: its messages report a corrupt payload, i.e. a broken build rather than " +
		"anything the caller did",
	"lib/core/web-worker-inline-native.js": "same",
	"lib/core/zlib-streams-inline.js": "same"
};

const LITERAL_MESSAGES = {
	"lib/core/io.js": {
		"Network error": "only the XHR path builds it, since fetch() rejects with its own TypeError before " +
			"io.js sees the failure, so a caller comparing against it would miss the default path entirely. " +
			"Exporting it would promise an identification that only holds for useXHR: true"
	},
	"lib/core/codec-worker-web.js": {
		"": "the argument of a DOMException built to probe whether structuredClone preserves the code " +
			"property, never thrown"
	},
	"lib/core/web-worker-base.js": {
		"Unknown error": "the placeholder for a worker that failed without reporting anything, so the " +
			"message is the absence of an identification rather than one a caller could act on"
	},
	"lib/core/streams/zlib-wasm/zlib-streams.js": {
		"Invalid WASM module": "the WASM codec reports its own plumbing failures, and the ones that happen " +
			"while the module loads are already handled by falling back to the JS codec",
		"WASM module not loaded": "same",
		"allocation failed": "same",
		"init failed:": "a zlib return code rendered as text, so the message carries a number and is not " +
			"comparable against a constant anyway",
		"process error:": "same",
		"end error:": "same"
	}
};

export { INTERNAL_MESSAGES, EXEMPT_MODULES, LITERAL_MESSAGES };
