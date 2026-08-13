/* global document, location, addEventListener, setTimeout, clearTimeout, URLSearchParams, fetch, Worker, Blob, URL, navigator, CompressionStream, structuredClone */

import tests from "./tests-data.js";

const MAX_PARALLEL_TESTS = 16;
const TEST_TIMEOUT = 120000;
const PROBE_TIMEOUT = 5000;
const LOADER_PATH = "/tests/all/loader.html#";

const FEATURE_PROBES = {
	compressionStream: () => typeof CompressionStream == "function",
	structuredClone: () => typeof structuredClone == "function",
	opfs: () => Boolean(navigator.storage && navigator.storage.getDirectory),
	httpRange: async () => {
		const response = await fetch("./index.html", { headers: { Range: "bytes=0-0" }, cache: "no-store" });
		return response.status == 206;
	},
	moduleWorker: () => probeWorker("export {};\npostMessage(true);", { type: "module" }),
	workerDynamicImport: () => probeWorker("import(\"data:text/javascript,export {};\").then(() => postMessage(true), () => postMessage(false));"),
	workerStreams: () => probeWorker("postMessage(typeof TransformStream != \"undefined\");")
};

const urlParams = new URLSearchParams(location.search);
const browserTests = tests.filter(test => !test.env || test.env.includes("browser"));
const keepTests = urlParams.has("keepTests");
const withStreamsPolyfill = urlParams.has("withStreamsPolyfill");
const testResults = { done: false, total: browserTests.length, passed: 0, skipped: 0, failures: [] };
globalThis.testResults = testResults;

const statusElement = document.getElementById("status");
const tableElement = document.getElementById("tests");
const pendingTests = new Map();
const runnableTests = [];
let nextTestIndex = 0;

main();

async function main() {
	const missingFeatures = await getMissingFeatures(browserTests);
	addEventListener("message", event => {
		const result = JSON.parse(event.data);
		const pendingTest = pendingTests.get(result.script);
		if (pendingTest) {
			completeTest(pendingTest, result.error);
		}
	});
	for (const test of browserTests) {
		const testMissingFeatures = (test.features || []).filter(feature => missingFeatures.has(feature));
		if (testMissingFeatures.length) {
			skipTest(test, testMissingFeatures);
		} else {
			runnableTests.push(test);
		}
	}
	while (nextTestIndex < Math.min(MAX_PARALLEL_TESTS, runnableTests.length)) {
		startTest(runnableTests[nextTestIndex++]);
	}
	updateStatus();
}

async function getMissingFeatures(tests) {
	const featureNames = new Set(tests.flatMap(test => test.features || []));
	const missingFeatures = new Set();
	await Promise.all(Array.from(featureNames, async featureName => {
		let available;
		try {
			available = await FEATURE_PROBES[featureName]();
		} catch {
			available = false;
		}
		if (!available) {
			missingFeatures.add(featureName);
		}
	}));
	return missingFeatures;
}

function probeWorker(code, options) {
	return new Promise(resolve => {
		const scriptURI = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
		let worker;
		const timeoutId = setTimeout(() => complete(false), PROBE_TIMEOUT);
		try {
			worker = new Worker(scriptURI, options);
			worker.addEventListener("message", event => complete(Boolean(event.data)));
			worker.addEventListener("error", () => complete(false));
		} catch {
			complete(false);
		}

		function complete(result) {
			clearTimeout(timeoutId);
			URL.revokeObjectURL(scriptURI);
			if (worker) {
				worker.terminate();
			}
			resolve(result);
		}
	});
}

function skipTest(test, missingFeatures) {
	const row = document.createElement("tr");
	const titleCell = document.createElement("td");
	const reasonCell = document.createElement("td");
	titleCell.textContent = test.title;
	reasonCell.textContent = "skipped, requires " + missingFeatures.join(", ");
	row.className = "skipped";
	row.appendChild(titleCell);
	row.appendChild(reasonCell);
	tableElement.appendChild(row);
	testResults.skipped++;
}

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
	if (nextTestIndex < runnableTests.length) {
		startTest(runnableTests[nextTestIndex++]);
	}
	updateStatus();
}

function updateStatus() {
	const finishedCount = testResults.passed + testResults.skipped + testResults.failures.length;
	if (finishedCount == testResults.total) {
		testResults.done = true;
		const failedCount = testResults.failures.length;
		const skippedText = testResults.skipped ? " (" + testResults.skipped + " skipped)" : "";
		statusElement.textContent = (failedCount ?
			"FAILED — " + failedCount + " of " + testResults.total + " tests" :
			"OK — " + testResults.total + " tests") + skippedText;
		statusElement.className = failedCount ? "failed" : "passed";
		document.title = (failedCount ? "FAILED" : "OK") + " — zip.js tests";
	} else {
		statusElement.textContent = finishedCount + "/" + testResults.total;
	}
}
