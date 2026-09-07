import { readdirSync, readFileSync } from "fs";
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

// the type tests have the same failure mode and no runner to notice it: tsc compiles the files the
// tsconfig lists and says nothing about the ones it does not, so a new test-*-types.ts that is never
// added to the list passes forever without being compiled once. Two of them had.
const TYPE_TEST_CONFIGS = [
	"tsconfig.json",
	"tsconfig-declarations.json"
];

const testsDirectory = join(dirname(fileURLToPath(import.meta.url)), "all");
const typesDirectory = join(dirname(fileURLToPath(import.meta.url)), "types");
const files = new Set(readdirSync(testsDirectory).filter(name => /^test-.*\.[cm]?js$/.test(name)));
const registered = testsData.map(({ script }) => script.replace("./", ""));
const typeFiles = new Set(readdirSync(typesDirectory).filter(name => /^test-.*\.ts$/.test(name)));
const registeredTypeFiles = TYPE_TEST_CONFIGS.flatMap(name =>
	JSON.parse(readFileSync(join(typesDirectory, name), "utf-8")).files.map(file => file.replace("./", "")));
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
registeredTypeFiles.forEach(name => {
	if (!typeFiles.has(name)) {
		errors.push(`"${name}" does not match a file in tests/types`);
	}
});
const duplicateTypeFiles = registeredTypeFiles.filter((name, index) => registeredTypeFiles.indexOf(name) != index);
duplicateTypeFiles.forEach(name => errors.push(`"${name}" is registered more than once in the tests/types configurations`));
typeFiles.forEach(name => {
	if (!registeredTypeFiles.includes(name)) {
		errors.push(`"${name}" is not registered in any of the tests/types configurations, so it is never compiled`);
	}
});

if (errors.length) {
	errors.forEach(error => console.error(error));
	process.exit(1);
}
console.log(`${registered.length} tests registered, ${registeredTypeFiles.length} type tests registered, all resolved`);
