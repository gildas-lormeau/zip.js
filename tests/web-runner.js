/* global document, location, addEventListener, setTimeout, clearTimeout, URLSearchParams */

import tests from "./tests-data.js";

const MAX_PARALLEL_TESTS = 16;
const TEST_TIMEOUT = 120000;
const LOADER_PATH = "/tests/all/loader.html#";

const urlParams = new URLSearchParams(location.search);
const browserTests = tests.filter(test => !test.env || test.env.includes("browser"));
const keepTests = urlParams.has("keepTests");
const withStreamsPolyfill = urlParams.has("withStreamsPolyfill");
const testResults = { done: false, total: browserTests.length, passed: 0, failures: [] };
globalThis.testResults = testResults;

const statusElement = document.getElementById("status");
const tableElement = document.getElementById("tests");
const pendingTests = new Map();
let nextTestIndex = 0;

addEventListener("message", event => {
	const result = JSON.parse(event.data);
	const pendingTest = pendingTests.get(result.script);
	if (pendingTest) {
		completeTest(pendingTest, result.error);
	}
});
while (nextTestIndex < Math.min(MAX_PARALLEL_TESTS, browserTests.length)) {
	startTest(browserTests[nextTestIndex++]);
}
updateStatus();

function startTest(test) {
	const row = document.createElement("tr");
	const titleCell = document.createElement("td");
	const frameCell = document.createElement("td");
	const link = document.createElement("a");
	const iframe = document.createElement("iframe");
	link.textContent = test.title;
	link.target = test.script;
	link.href = iframe.src = LOADER_PATH + encodeURIComponent(JSON.stringify({ script: test.script, withStreamsPolyfill }));
	titleCell.appendChild(link);
	frameCell.appendChild(iframe);
	row.appendChild(titleCell);
	row.appendChild(frameCell);
	tableElement.appendChild(row);
	const timeoutId = setTimeout(() => {
		const pendingTest = pendingTests.get(test.script);
		if (pendingTest) {
			completeTest(pendingTest, { message: "timeout after " + TEST_TIMEOUT + "ms" });
		}
	}, TEST_TIMEOUT);
	pendingTests.set(test.script, { test, row, timeoutId });
}

function completeTest({ test, row, timeoutId }, error) {
	clearTimeout(timeoutId);
	pendingTests.delete(test.script);
	if (error) {
		testResults.failures.push({ title: test.title, script: test.script, message: error.message, stack: error.stack });
		row.className = "failed";
		const errorCell = document.createElement("td");
		errorCell.textContent = error.message || "error";
		row.appendChild(errorCell);
	} else if (keepTests) {
		testResults.passed++;
		row.className = "passed";
	} else {
		testResults.passed++;
		row.remove();
	}
	if (nextTestIndex < browserTests.length) {
		startTest(browserTests[nextTestIndex++]);
	}
	updateStatus();
}

function updateStatus() {
	const finishedCount = testResults.passed + testResults.failures.length;
	if (finishedCount == testResults.total) {
		testResults.done = true;
		const failedCount = testResults.failures.length;
		statusElement.textContent = failedCount ?
			"FAILED — " + failedCount + " of " + testResults.total + " tests" :
			"OK — " + testResults.total + " tests";
		statusElement.className = failedCount ? "failed" : "passed";
		document.title = (failedCount ? "FAILED" : "OK") + " — zip.js tests";
	} else {
		statusElement.textContent = finishedCount + "/" + testResults.total;
	}
}
