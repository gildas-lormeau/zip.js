import { test, mock, beforeEach } from "node:test";
import { setMaxListeners } from "node:events";
import { openAsBlob } from "node:fs";
import { fileURLToPath } from "node:url";

import tests from "./tests-data.js";
import { resetConfiguration, terminateWorkers } from "./zip-lib.js";

setMaxListeners(100);

beforeEach(() => globalThis.fetch = mock.fn(async url => {
	const blob = await openAsBlob(fileURLToPath(url));
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