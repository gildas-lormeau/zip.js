/* global Deno */

import tests from "./tests-data.js";
import { resetConfiguration } from "./zip-lib.js";

for (const testData of tests) {
	if (!testData.env || testData.env.includes("deno")) {
		Deno.test({
			name: testData.title,
			fn: async () => {
				try {
					await (await import("./all/" + testData.script)).test();
				} finally {
					resetConfiguration();
				}
			},
			sanitizeResources: testData.sanitizeResources === undefined || testData.sanitizeResources === true
		});
	}
}