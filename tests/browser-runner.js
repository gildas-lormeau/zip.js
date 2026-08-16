import { fileURLToPath } from "node:url";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";

import httpServer from "http-server";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import firefox from "selenium-webdriver/firefox.js";
import safari from "selenium-webdriver/safari.js";

const SUITE_TIMEOUT = 600000;
const POLL_INTERVAL = 500;

const args = parseArgs({
	allowPositionals: true,
	options: {
		"help": {
			type: "boolean",
			short: "h",
		},
		"headful": {
			type: "boolean",
		},
		"exe-path": {
			type: "string",
		},
		"url-search": {
			type: "string",
		},
	},
});

if (args.values.help) {
	showHelp();
	process.exit(0);
}

main({
	browserName: args.positionals[0],
	headless: !args.values["headful"],
	executablePath: args.values["exe-path"],
	urlSearch: args.values["url-search"],
});

function showHelp() {
	const usage = "usage: node ./tests/browser-runner.js chrome|firefox|webkit [-h|--help] [--headful] [--exe-path <path>] [--url-search <search>]";
	process.stdout.write(usage);
}

async function main({ browserName, headless, executablePath, urlSearch }) {
	const server = httpServer.createServer({ root: fileURLToPath(new URL("..", import.meta.url)), cache: -1 });
	await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
	const { port } = server.server.address();
	const profileDirectory = await mkdtemp(join(tmpdir(), "zip-js-tests-"));
	const driver = await launchBrowserDriver(profileDirectory, { browserName, headless, executablePath });

	try {
		await driver.get(`http://127.0.0.1:${port}/tests/${urlSearch ? "?" + urlSearch : ""}`);
		const testResults = await getTestResults(driver);
		for (const failure of testResults.failures) {
			console.error("FAIL " + failure.title + " (" + failure.script + ")");
			console.error("  " + (failure.stack || failure.message || "unknown error"));
		}
		console.log(browserName + ": " + testResults.passed + " pass, " + testResults.failures.length + " fail" +
			(testResults.skipped ? ", " + testResults.skipped + " skipped" : ""));
		process.exit(testResults.failures.length || !testResults.done ? 1 : 0);
	} finally {
		try {
			await driver.quit();
		} catch {
			// ignore quit error for legacy browsers
		}
		await rm(profileDirectory, { recursive: true, force: true });
		server.close();
	}
}

async function launchBrowserDriver(profileDirectory, { browserName, headless, executablePath }) {
	try {
		if (browserName == "chrome") {
			const options = new chrome.Options();
			if (headless) options.addArguments("--headless=new");
			if (executablePath) options.setBinaryPath(executablePath);
			options.addArguments(`--user-data-dir=${profileDirectory}`);
			options.addArguments("--log-level=3");
			return await new Builder().forBrowser("chrome").setChromeOptions(options).build();
		}
		if (browserName == "firefox") {
			const options = new firefox.Options();
			if (headless) options.addArguments("-headless");
			if (executablePath) options.setBinary(executablePath);
			options.addArguments("-profile", profileDirectory);
			const service = new firefox.ServiceBuilder();
			return await new Builder().forBrowser("firefox").setFirefoxOptions(options).setFirefoxService(service).build();
		}
		if (browserName == "webkit") {
			const options = new safari.Options();
			return await new Builder().forBrowser("safari").setSafariOptions(options).build();
		}
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
	showHelp();
	process.exit(1);
}

async function getTestResults(driver) {
	const startTime = Date.now();
	let lastFinishedCount = 0;
	while (Date.now() - startTime < SUITE_TIMEOUT) {
		const testResults = await driver.executeScript("return globalThis.testResults;");
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
	const testResults = (await driver.executeScript("return globalThis.testResults;")) || { passed: 0, failures: [], total: 0 };
	testResults.failures.push({ title: "suite", script: "browser-runner.js", message: "timeout after " + SUITE_TIMEOUT + "ms" });
	return testResults;
}
