import { test } from "bun:test";

import tests from "./tests-data.js";

for (const testData of tests) {
	if (!testData.env || testData.env.includes("bun")) {
		test(testData.title, async () => (await import("./all/" + testData.script)).test());
	}
}