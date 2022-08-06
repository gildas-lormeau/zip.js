/* global process */
/* eslint-disable no-console */

import data from "./tests-data.js";
runTests();

async function runTests() {
	let passed = true;
	let passedCount = 0;
	const tests = data.filter(test => !test.env || test.env.includes("node"));
	console.log("running", tests.length, "tests from ./node-runner.js");
	for (const test of tests) {
		const fn = async () => (await import("./all/" + test.script)).test();
		try {
			console.log(test.title + "...", await fn() && "ok");
			passedCount++;
		} catch (error) {
			passed = false;
			console.error(test.title + "...", "FAILED");
			console.error(error);
		}
	}
	console.log("");
	if (passed) {
		console.log("ok", "|", passedCount, "passed");
		console.log("");
	} else {
		console.error("error: Test failed");
		console.log("");
		process.exit(-1);
	}
}