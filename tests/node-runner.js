/* global process */
/* eslint-disable no-console */

import data from "./tests-data.js";
runTests();

async function runTests() {
	let passed = true;
	let passedCount = 0;
	const tests = data.filter(test => !test.env || test.env.includes("node"));
	console.log("\u001b[38;5;240mrunning " + tests.length + " tests from ./node-runner.js\u001b[0m");
	const start = Date.now();
	for (const test of tests) {
		const fn = async () => (await import("./all/" + test.script)).test();
		try {
			const start = Date.now();
			console.log(test.title + " ...", (await fn(), "\u001b[32mok\u001b[0m"), "\u001b[38;5;240m(" + delayToString(Date.now() - start) + ")\u001b[0m");
			passedCount++;
		} catch (error) {
			passed = false;
			console.error(test.title + "...", "\u001b[31mFAILED\u001b[0m");
			console.error(error);
		}
	}
	console.log("");
	console.log("\u001b[32mok\u001b[0m", "|", passedCount + " passed", "|", (tests.length - passedCount) + " failed", "\u001b[38;5;240m(" + delayToString(Date.now() - start) + ")\u001b[0m");
	console.log("");
	if (!passed) {
		console.error("\u001b[31merror\u001b[0m: Test failed");
		process.exit(-1);
	}
}

function delayToString(delay) {
	if (delay < 1000) {
		return delay + "ms";
	} else {
		return Math.floor(delay / 1000) + "s";
	}
}