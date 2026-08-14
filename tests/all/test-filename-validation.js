// Checks the filenameValidation option of the reader. Entry names are validated against the level in
// use, never rewritten, so a name that passes is reported exactly as stored in the central directory.
// The level defaults to the value of the strictness option. A backslash is never a path separator: it
// is legal on UNIX file systems and it also occurs as the trail byte of double-byte filenames (CP932
// here) decoded with another charset, so names containing one are only rejected when they also contain
// a rejected path component.

import * as zip from "../zip-lib.js";

const SAFE_NAMES = ["ok.txt", "a/b.txt", "dir/", "..\\win.txt", "\u00f2\\\u00e9.txt"];
const ESCAPING_NAMES = ["../evil.txt", "a/../../evil.txt", "sub/..", "/abs.txt", "C:/win.txt", "\\\\srv\\share"];
const NON_CONFORMANT_NAMES = ["a//b.txt", "./cur.txt", "a/./b.txt"];

export { test };

async function test() {
	await levelsRejectExpectedNames();
	await defaultLevelRejectsEscapingNames();
	await strictnessDrivesTheDefaultLevel();
	await filesystemDropsRedundantPathComponents();
	await zip.terminateWorkers();
}

async function levelsRejectExpectedNames() {
	for (const name of SAFE_NAMES) {
		for (const filenameValidation of ["tolerant", "balanced", "strict"]) {
			await assertAccepted(name, { filenameValidation });
		}
	}
	for (const name of ESCAPING_NAMES) {
		await assertAccepted(name, { filenameValidation: "tolerant" });
		await assertRejected(name, { filenameValidation: "balanced" });
		await assertRejected(name, { filenameValidation: "strict" });
	}
	for (const name of NON_CONFORMANT_NAMES) {
		await assertAccepted(name, { filenameValidation: "tolerant" });
		await assertAccepted(name, { filenameValidation: "balanced" });
		await assertRejected(name, { filenameValidation: "strict" });
	}
}

async function defaultLevelRejectsEscapingNames() {
	await assertRejected("../evil.txt", {});
	await assertAccepted("a//b.txt", {});
	await assertAccepted("ok.txt", {});
}

async function strictnessDrivesTheDefaultLevel() {
	await assertAccepted("../evil.txt", { strictness: "tolerant" });
	await assertRejected("a//b.txt", { strictness: "strict" });
	await assertAccepted("a//b.txt", { strictness: "strict", filenameValidation: "balanced" });
	await assertRejected("../evil.txt", { strictness: "tolerant", filenameValidation: "balanced" });
}

// The filesystem API splits entry names into a tree of entries. Empty and "." path components must not
// become entries of their own, otherwise they shadow the entries of the same tree with a name reported
// identically by getFullname().
async function filesystemDropsRedundantPathComponents() {
	const data = await buildZip(["a//b.txt", "./cur.txt", "/abs.txt", "sub/./deep/x.txt"]);
	const filesystem = new zip.fs.FS();
	await filesystem.importUint8Array(data, { filenameValidation: "tolerant" });
	const names = collectNames(filesystem.root).sort().join(",");
	const expectedNames = "abs.txt,a,a/b.txt,cur.txt,sub,sub/deep,sub/deep/x.txt".split(",").sort().join(",");
	if (names != expectedNames) {
		throw new Error("expected filesystem entries \"" + expectedNames + "\" got \"" + names + "\"");
	}
}

function collectNames(entry) {
	return entry.children.flatMap(child => [child.getFullname(), ...(child.directory ? collectNames(child) : [])]);
}

async function assertAccepted(name, options) {
	const entries = await readEntries(await buildZip([name]), options);
	if (entries[0].filename != name) {
		throw new Error("expected filename \"" + name + "\" got \"" + entries[0].filename + "\"");
	}
}

async function assertRejected(name, options) {
	try {
		await readEntries(await buildZip([name]), options);
	} catch (error) {
		if (error.message != zip.ERR_UNSAFE_FILENAME) {
			throw error;
		}
		if (error.filename != name) {
			throw new Error("expected rejected filename \"" + name + "\" got \"" + error.filename + "\"", { cause: error });
		}
		return;
	}
	throw new Error("expected \"" + name + "\" to be rejected with " + JSON.stringify(options));
}

async function readEntries(data, options) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), options);
	try {
		return await zipReader.getEntries();
	} finally {
		await zipReader.close();
	}
}

async function buildZip(names) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (const name of names) {
		const directory = name.endsWith("/");
		await zipWriter.add(name, directory ? undefined : new zip.TextReader("content"), { directory });
	}
	return zipWriter.close();
}
