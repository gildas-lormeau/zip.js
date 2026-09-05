import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import testsData from "./tests-data.js";

// tests-data.js names the test files as strings, and nothing resolved them against the filesystem:
// "./test-arrayBuffer.js" pointed at test-arraybuffer.js and ran anyway on the case-insensitive
// filesystems of macOS and Windows, which are the only ones the browser jobs run on. It would have
// thrown ERR_MODULE_NOT_FOUND on Linux. This compares the two lists as strings, so the mismatch is
// caught on every platform.

// loaded as worker payloads by test-sw.js and test-web-worker.js, so they are files under all/ that
// are deliberately not registered as tests
const WORKER_SCRIPTS = [
	"test-sw-worker.js",
	"test-web-worker-worker.js"
];

const directory = join(dirname(fileURLToPath(import.meta.url)), "all");
const files = new Set(readdirSync(directory).filter(name => /^test-.*\.[cm]?js$/.test(name)));
const registered = testsData.map(({ script }) => script.replace("./", ""));
const errors = [];

registered.forEach((name, index) => {
	if (!files.has(name)) {
		errors.push(`${testsData[index].title}: "${name}" does not match a file in tests/all`);
	}
});
const duplicates = registered.filter((name, index) => registered.indexOf(name) != index);
duplicates.forEach(name => errors.push(`"${name}" is registered more than once`));
files.forEach(name => {
	if (!registered.includes(name) && !WORKER_SCRIPTS.includes(name)) {
		errors.push(`"${name}" is not registered in tests-data.js and is not a worker payload`);
	}
});
WORKER_SCRIPTS.forEach(name => {
	if (!files.has(name)) {
		errors.push(`"${name}" is declared as a worker payload but does not exist`);
	}
});

if (errors.length) {
	errors.forEach(error => console.error(error));
	process.exit(1);
}
console.log(`${registered.length} tests registered, all resolved`);
