import test from "node:test";

import tests from "./tests-data.js";

for (const testData of tests) {
	if (!testData.env || testData.env.includes("node")) {
		test({
			name: testData.title,
			fn: async () => (await import("./all/" + testData.script)).test()
		});
	}
}