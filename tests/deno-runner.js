/* global Deno */

// Install Deno from https://deno.land and run `deno test --allow-read ./deno-runner.js`

import tests from "./tests-data.js";

for (const test of tests) {
	if (test.env != "browser") {
		Deno.test({
			name: test.title,
			fn: async () => (await import("./" + (test.env || "all") + "/" + test.script)).test(),
			sanitizeResources: test.sanitizeResources === undefined || test.sanitizeResources === true
		});
	}
}