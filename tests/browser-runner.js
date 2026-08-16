import { fileURLToPath } from "node:url";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import httpServer from "http-server";
import { chromium, firefox, webkit } from "playwright";

const SUITE_TIMEOUT = 600000;
const POLL_INTERVAL = 500;

main({
	browserName: process.argv[2],
	headless: !process.argv.includes("--headful"),
});

async function main({ browserName, headless }) {
	const server = httpServer.createServer({ root: fileURLToPath(new URL("..", import.meta.url)), cache: -1 });
	await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
	const { port } = server.server.address();
	const profileDirectory = await mkdtemp(join(tmpdir(), "zip-js-tests-"));
	const browserContext = await launchBrowserContext(profileDirectory, { browserName, headless });
	const page = await browserContext.newPage();
	const pageErrors = [];
	page.on("pageerror", error => pageErrors.push(error.message));
	await page.goto("http://127.0.0.1:" + port + "/tests/");
	const testResults = await getTestResults(page);
	await browserContext.close();
	await rm(profileDirectory, { recursive: true, force: true });
	server.close();
	for (const failure of testResults.failures) {
		console.error("FAIL " + failure.title + " (" + failure.script + ")");
		console.error("  " + (failure.stack || failure.message || "unknown error"));
	}
	if (testResults.failures.length && pageErrors.length) {
		console.error("page errors:");
		for (const pageError of pageErrors) {
			console.error("  " + pageError);
		}
	}
	console.log(browserName + ": " + testResults.passed + " pass, " + testResults.failures.length + " fail" +
		(testResults.skipped ? ", " + testResults.skipped + " skipped" : ""));
	process.exit(testResults.failures.length || !testResults.done ? 1 : 0);
}

async function launchBrowserContext(profileDirectory, { browserName, headless }) {
	try {
		if (browserName == "chrome") {
			return await chromium.launchPersistentContext(profileDirectory, { channel: "chrome", headless });
		}
		if (browserName == "firefox") {
			return await firefox.launchPersistentContext(profileDirectory, { headless });
		}
		if (browserName == "webkit") {
			return await webkit.launchPersistentContext(profileDirectory, { headless });
		}
	} catch (error) {
		console.error(error.message);
		console.error("run: npx playwright install " + browserName);
		process.exit(1);
	}
	console.error("usage: node ./tests/browser-runner.js chrome|firefox|webkit [--headful]");
	process.exit(1);
}

async function getTestResults(page) {
	const startTime = Date.now();
	let lastFinishedCount = 0;
	while (Date.now() - startTime < SUITE_TIMEOUT) {
		const testResults = await page.evaluate(() => globalThis.testResults);
		if (testResults) {
			if (testResults.done) {
				return testResults;
			}
			const finishedCount = testResults.passed + (testResults.skipped || 0) + testResults.failures.length;
			if (finishedCount >= lastFinishedCount + 50) {
				lastFinishedCount = finishedCount;
				console.log(finishedCount + "/" + testResults.total);
			}
		}
		await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
	}
	const testResults = (await page.evaluate(() => globalThis.testResults)) || { passed: 0, failures: [], total: 0 };
	testResults.failures.push({ title: "suite", script: "browser-runner.js", message: "timeout after " + SUITE_TIMEOUT + "ms" });
	return testResults;
}
