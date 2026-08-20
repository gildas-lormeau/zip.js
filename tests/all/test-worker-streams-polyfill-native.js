/* global URL */

import { testWithWorkerScript } from "./test-worker-streams-polyfill.js";

const WORKER_SCRIPT_URI = new URL("./worker-streams-polyfill-native.js", import.meta.url);

export { test };

// the two worker builds bundle different codecs, and the codec builds its transform streams from
// the globals of the worker: the wasm worker cannot run the JavaScript codec at all, so this is the
// only test running it in a scope where the Streams API is polyfilled, which is the scope of the
// browsers old enough to need the native build in the first place
function test() {
	return testWithWorkerScript(WORKER_SCRIPT_URI);
}
