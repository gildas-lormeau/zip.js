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
const ZIP_LIB_PATH = "/tests/zip-lib.js";
const BUILD_MODULES = {
	wasm: null,
	native: "../lib/zip-fs-native.js",
	external: "../lib/zip-fs-external.js",
	dist: "../index.min.js"
};

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
		"build": {
			type: "string",
		},
	},
});

if (args.values.help) {
	showHelp();
	process.exit(0);
}

if (args.values.build && !(args.values.build in BUILD_MODULES)) {
	console.error("unknown build: " + args.values.build + ", expected " + Object.keys(BUILD_MODULES).join("|"));
	process.exit(1);
}

main({
	browserName: args.positionals[0],
	headless: !args.values["headful"],
	executablePath: args.values["exe-path"],
	urlSearch: args.values["url-search"],
	buildModule: BUILD_MODULES[args.values.build],
});

function showHelp() {
	const usage = "usage: node ./tests/browser-runner.js chrome|firefox|safari [-h|--help] [--headful] [--exe-path <path>] [--url-search <search>] [--build wasm|native|external|dist]";
	process.stdout.write(usage);
}

async function main({ browserName, headless, executablePath, urlSearch, buildModule }) {
	const serverOptions = { root: fileURLToPath(new URL("..", import.meta.url)), cache: -1 };
	if (buildModule) {
		serverOptions.before = [(request, response) => {
			if (request.url.split("?")[0] == ZIP_LIB_PATH) {
				response.writeHead(200, { "Content-Type": "text/javascript" });
				response.end("export * from \"" + buildModule + "\";");
			} else {
				response.emit("next");
			}
		}];
	}
	const server = httpServer.createServer(serverOptions);
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
		if (browserName == "safari") {
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
