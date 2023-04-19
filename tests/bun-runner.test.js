/* global globalThis, Bun */

import { test, beforeEach } from "bun:test";

import tests from "./tests-data.js";

beforeEach(() => globalThis.fetch = async (url) => {
	const file = await Bun.file("." + url.toString().match(/(\/data\/.*)/)[1]);
	return {
		status: 200,
		body: file.stream(),
		arrayBuffer: () => file.arrayBuffer()
	};
});

for (const testData of tests) {
	if (!testData.env || testData.env.includes("bun")) {
		test(testData.title, async () => (await import("./all/" + testData.script)).test());
	}
}