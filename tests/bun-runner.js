/* global Bun */

import { test, beforeEach } from "bun:test";

import tests from "./tests-data.js";
import { resetConfiguration, terminateWorkers } from "./zip-lib.js";

beforeEach(() => globalThis.fetch = async url => {
	const file = await Bun.file("." + url.toString().match(/(\/data\/.*)/)[1]);
	return {
		status: 200,
		body: file.stream(),
		arrayBuffer: () => file.arrayBuffer()
	};
});

for (const testData of tests) {
	if (!testData.env || testData.env.includes("bun")) {
		test(testData.title, async () => {
			try {
				await (await import("./all/" + testData.script)).test();
			} finally {
				await terminateWorkers();
				resetConfiguration();
			}
		});
	}
}