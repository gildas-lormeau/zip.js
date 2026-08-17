/* global Blob */

// Locks the entry options of `addFileSystemHandle` / `addFileSystemEntry`, which walk a directory
// handle and add one entry per file and per directory found. The options are documented for the
// call, not for the files it happens to contain, so the directories created along the way must
// carry them exactly like the files do, except for the dates the files get from their own handle.
// The tree is exported and read back, so the check is on the zip file itself rather than on the
// state of the filesystem entries.

import * as zip from "../zip-lib.js";

const FILE_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const FILE_DATE = new Date("2010-11-12T13:14:16.000Z");
const OPTION_DATE = new Date("2020-01-02T03:04:06.000Z");
const COMMENT = "handle comment";
const DIRECTORY_NAMES = ["root/", "root/sub/"];
const FILE_NAMES = ["root/readme.txt", "root/sub/nested.txt"];

export { test };

async function test() {
	try {
		await testOptions({ comment: COMMENT, lastModDate: OPTION_DATE }, OPTION_DATE);
		await testOptions({ comment: COMMENT }, FILE_DATE);
	} finally {
		await zip.terminateWorkers();
	}
}

async function testOptions(options, expectedFileDate) {
	const zipFs = new zip.fs.FS();
	await zipFs.addFileSystemHandle(createSourceHandle(), options);
	const entries = await readEntries(await zipFs.exportUint8Array());
	assertNames(entries);
	for (const name of DIRECTORY_NAMES) {
		assertEntry(entries.get(name), options.lastModDate, name);
	}
	for (const name of FILE_NAMES) {
		assertEntry(entries.get(name), expectedFileDate, name);
	}
}

function assertNames(entries) {
	const names = [...entries.keys()].sort().join(",");
	const expectedNames = [...DIRECTORY_NAMES, ...FILE_NAMES].sort().join(",");
	if (names != expectedNames) {
		throw new Error("expected the entries " + expectedNames + ", got " + names);
	}
}

function assertEntry(entry, expectedDate, name) {
	if (entry.comment != COMMENT) {
		throw new Error("expected the comment \"" + COMMENT + "\" for " + name + ", got \"" + entry.comment + "\"");
	}
	if (expectedDate && entry.lastModDate.getTime() != expectedDate.getTime()) {
		throw new Error("expected the date " + expectedDate.toISOString() + " for " + name +
			", got " + entry.lastModDate.toISOString());
	}
}

async function readEntries(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = new Map();
	for (const entry of await zipReader.getEntries()) {
		entries.set(entry.filename, entry);
	}
	await zipReader.close();
	return entries;
}

// Mock of the read surface used by addFileSystemHandle: `kind`, `name`, `values()` and `getFile()`.
function createSourceHandle() {
	return directoryHandle("root", [
		fileHandle("readme.txt"),
		directoryHandle("sub", [fileHandle("nested.txt")])
	]);

	function directoryHandle(name, children) {
		return {
			kind: "directory",
			name,
			async *values() {
				for (const child of children) {
					yield child;
				}
			}
		};
	}

	function fileHandle(name) {
		return {
			kind: "file",
			name,
			async getFile() {
				const blob = new Blob([FILE_CONTENT]);
				return {
					name,
					size: blob.size,
					lastModified: FILE_DATE.getTime(),
					stream: () => blob.stream()
				};
			}
		};
	}
}
