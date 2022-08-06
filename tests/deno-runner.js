/* global Deno */

// Install Deno from https://deno.land and run `deno test --allow-read ./deno-runner.js`

import tests from "./tests-data.js";

for (const test of tests) {
	if (!test.env || test.env.includes("deno")) {
		Deno.test({
			name: test.title,
			fn: async () => (await import("./all/" + test.script)).test(),
			sanitizeResources: test.sanitizeResources === undefined || test.sanitizeResources === true
		});
	}
}