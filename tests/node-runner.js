import { test, mock, beforeEach } from "node:test";
import { setMaxListeners } from "node:events";
import { openAsBlob } from "node:fs";

import tests from "./tests-data.js";
import { resetConfiguration, terminateWorkers } from "./zip-lib.js";

setMaxListeners(100);

beforeEach(() => globalThis.fetch = mock.fn(async url => {
	const blob = await openAsBlob("." + url.toString().match(/(\/data\/.*)/)[1]);
	return {
		status: 200,
		body: blob.stream(),
		arrayBuffer: () => blob.arrayBuffer()
	};
}));

for (const testData of tests) {
	if (!testData.env || testData.env.includes("node")) {
		test({
			name: testData.title,
			fn: async () => {
				try {
					await (await import("./all/" + testData.script)).test();
				} finally {
					await terminateWorkers();
					resetConfiguration();
				}
			}
		});
	}
}