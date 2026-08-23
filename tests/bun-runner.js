/* global Bun */

import { test, beforeEach } from "bun:test";
import { fileURLToPath } from "node:url";

import tests from "./tests-data.js";
import { resetConfiguration, terminateWorkers } from "./zip-lib.js";

const TEST_TIMEOUT = 30000;

beforeEach(() => globalThis.fetch = async url => {
	const file = await Bun.file(fileURLToPath(url));
	return {
		status: 200,
		body: file.stream(),
		arrayBuffer: () => file.arrayBuffer()
	};
}, TEST_TIMEOUT);

for (const testData of tests) {
	if (!testData.env || testData.env.includes("bun")) {
		test(testData.title, async () => {
			try {
				await (await import("./all/" + testData.script)).test();
			} finally {
				await terminateWorkers();
				resetConfiguration();
			}
		}, TEST_TIMEOUT);
	}
}