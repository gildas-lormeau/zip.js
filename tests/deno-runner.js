/* eslint-disable no-console */

import tests from "./tests-data.js";

test().catch(error => console.error(error));

async function test() {
	for (const test of tests) {
		if (test.env != "browser") {
			const Module = await import("./" + (test.env || "all") + "/" + test.script);
			const result = await Module.test();
			console.log(test.title, result ? "ok" : "...");
		}
	}
}