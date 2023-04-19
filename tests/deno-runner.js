/* global Deno */

// Install Deno from https://deno.land and run `deno test --allow-read ./deno-runner.js`

import tests from "./tests-data.js";

for (const testData of tests) {
	if (!testData.env || testData.env.includes("deno")) {
		Deno.test({
			name: testData.title,
			fn: async () => (await import("./all/" + testData.script)).test(),
			sanitizeResources: testData.sanitizeResources === undefined || testData.sanitizeResources === true
		});
	}
}