/* global setTimeout, clearTimeout */

// Locks the error propagation of `addFileSystemEntry` when reading a nested directory fails: the
// `readEntries` callback is asynchronous, so a rejection raised while converting a nested entry
// must reject the public call instead of becoming an unhandled rejection that leaves it pending.

import * as zip from "../zip-lib.js";

const ERROR_MESSAGE = "simulated permission error";
const TIMEOUT = 2000;

export { test };

async function test() {
	let timeout;
	try {
		const fs = new zip.ZipFS();
		const result = await Promise.race([
			fs.addFileSystemEntry(createRootEntry()).then(() => "resolved", error => error.message),
			new Promise(resolve => timeout = setTimeout(() => resolve("pending"), TIMEOUT))
		]);
		if (result != ERROR_MESSAGE) {
			throw new Error("expected the call to reject with the nested error, got: " + result);
		}
	} finally {
		clearTimeout(timeout);
		await zip.terminateWorkers();
	}
}

function createRootEntry() {
	return createDirectoryEntry("root", [createDirectoryEntry("child", []), createFailingDirectoryEntry("bad")]);
}

function createDirectoryEntry(name, children) {
	return {
		name,
		isFile: false,
		isDirectory: true,
		createReader() {
			let read = false;
			return {
				readEntries(resolve) {
					setTimeout(() => {
						if (read) {
							resolve([]);
						} else {
							read = true;
							resolve(children);
						}
					}, 0);
				}
			};
		}
	};
}

function createFailingDirectoryEntry(name) {
	return {
		name,
		isFile: false,
		isDirectory: true,
		createReader() {
			return {
				readEntries(resolve, reject) {
					setTimeout(() => reject(new Error(ERROR_MESSAGE)), 0);
				}
			};
		}
	};
}
