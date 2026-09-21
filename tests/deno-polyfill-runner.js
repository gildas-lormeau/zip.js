// Runs the test list the way the Firefox 79 CI lane does, on Deno: the stream globals come from
// web-streams-polyfill, the readables the platform hands back have no pipeTo() or pipeThrough(),
// and CompressionStream is missing. The polyfill only loads in browsers where TransformStream is
// missing, so a test that fails on that lane alone cannot be re-run in a browser on a developer
// machine; this runner is the local gate for it. The library and the tests are imported after the
// globals are swapped, so that every stream class captured at load time is the polyfilled one.
// web-streams-polyfill-runner.js covers the native build with one round trip.

import {
	ReadableStream as PolyfillReadableStream,
	WritableStream as PolyfillWritableStream,
	TransformStream as PolyfillTransformStream
} from "npm:web-streams-polyfill@4.3.0";

const nativeReadablePrototype = Object.getPrototypeOf(new Blob([""]).stream());
globalThis.ReadableStream = PolyfillReadableStream;
globalThis.WritableStream = PolyfillWritableStream;
globalThis.TransformStream = PolyfillTransformStream;
delete nativeReadablePrototype.pipeThrough;
delete nativeReadablePrototype.pipeTo;
delete globalThis.CompressionStream;
delete globalThis.DecompressionStream;

const FEATURE_PROBES = {
	compressionStream: () => typeof CompressionStream == "function"
};

const { default: tests } = await import("./tests-data.js");
const { resetConfiguration, terminateWorkers } = await import("./zip-lib.js");

for (const testData of tests) {
	if (!testData.env || testData.env.includes("deno")) {
		const missingFeatures = (testData.features || []).filter(feature => FEATURE_PROBES[feature] && !FEATURE_PROBES[feature]());
		Deno.test({
			name: testData.title + (missingFeatures.length ? " (requires " + missingFeatures.join(", ") + ")" : ""),
			ignore: missingFeatures.length > 0,
			fn: async () => {
				try {
					await (await import("./all/" + testData.script)).test();
				} finally {
					await terminateWorkers();
					resetConfiguration();
				}
			},
			sanitizeResources: testData.sanitizeResources === undefined || testData.sanitizeResources === true
		});
	}
}
