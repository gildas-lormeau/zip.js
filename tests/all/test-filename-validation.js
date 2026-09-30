// Checks the filenameValidation option of the reader. Entry names are validated against the level in
// use, never rewritten, so a name that passes is reported exactly as stored in the central directory.
// The level defaults to the value of the strictness option. A backslash is never converted to a slash:
// it is legal on UNIX file systems and it also occurs as the trail byte of double-byte filenames (CP932
// here) decoded with another charset. A ".." component delimited by backslashes is still rejected,
// because a Windows host resolves it as a parent directory, and no correctly decoded name contains one.
// The name validated is the final one: a valid Unicode Path extra field (0x7075) replaces the decoded name
// before normalization and validation, so it cannot smuggle a name the central directory would not pass.

/* global TextEncoder */

import * as zip from "../zip-lib.js";

const SAFE_NAMES = ["ok.txt", "a/b.txt", "dir/", "a\\b.txt", "..a\\b.txt", "a\\...\\b.txt", "\u00f2\\\u00e9.txt"];
const ESCAPING_NAMES = ["../evil.txt", "a/../../evil.txt", "sub/..", "/abs.txt", "C:/win.txt", "\\\\srv\\share",
	"\\abs.txt", "..\\win.txt", "..\\..\\evil.txt", "a\\..\\evil.txt", "a/..\\evil.txt", "sub\\.."];
const NON_CONFORMANT_NAMES = ["a//b.txt", "./cur.txt", "a/./b.txt", "a\u0000b.txt"];

export { test };

async function test() {
	await levelsRejectExpectedNames();
	await defaultLevelRejectsEscapingNames();
	await strictnessDrivesTheDefaultLevel();
	await filesystemDropsRedundantPathComponents();
	await normalizationRepairsRejectedNames();
	await normalizationRunsAfterDecodingAndBeforeValidation();
	await normalizationDetectsCollisions();
	await filesystemInheritsNormalization();
	await unicodePathOverrideIsValidated();
	await zip.terminateWorkers();
}

async function unicodePathOverrideIsValidated() {
	const data = await buildZip(["safe.txt"], "content", unicodePathExtraField("safe.txt", "../evil.txt"));
	for (const filenameValidation of [undefined, "balanced", "strict"]) {
		try {
			await readEntries(data, { filenameValidation });
		} catch (error) {
			if (error.message != zip.ERR_UNSAFE_FILENAME || error.filename != "../evil.txt") {
				throw error;
			}
			continue;
		}
		throw new Error("expected the Unicode Path override \"../evil.txt\" to be rejected with " + filenameValidation);
	}
	const tolerantEntries = await readEntries(data, { filenameValidation: "tolerant" });
	if (tolerantEntries[0].filename != "../evil.txt") {
		throw new Error("expected the tolerant level to keep the override, got \"" + tolerantEntries[0].filename + "\"");
	}
	let receivedFilename;
	const entries = await readEntries(data, {
		normalizeFilename: filename => {
			receivedFilename = filename;
			return stripLeadingParents(filename);
		}
	});
	if (receivedFilename != "../evil.txt") {
		throw new Error("expected the hook to receive the override, got \"" + receivedFilename + "\"");
	}
	if (entries[0].filename != "evil.txt") {
		throw new Error("expected the repaired override \"evil.txt\" got \"" + entries[0].filename + "\"");
	}
	const untouchedEntries = await readEntries(await buildZip(["safe.txt"], "content", unicodePathExtraField("safe.txt", "other.txt")), {});
	if (untouchedEntries[0].filename != "other.txt") {
		throw new Error("expected a safe override to be kept, got \"" + untouchedEntries[0].filename + "\"");
	}
}

function unicodePathExtraField(rawName, overrideName) {
	const encoder = new TextEncoder();
	const rawBytes = encoder.encode(rawName);
	const overrideBytes = encoder.encode(overrideName);
	const body = new Uint8Array(5 + overrideBytes.length);
	const view = new DataView(body.buffer);
	view.setUint8(0, 1);
	view.setUint32(1, crc32(rawBytes), true);
	body.set(overrideBytes, 5);
	return new Map([[0x7075, body]]);
}

function crc32(bytes) {
	let crc = 0xFFFFFFFF;
	for (let index = 0; index < bytes.length; index++) {
		crc ^= bytes[index];
		for (let bit = 0; bit < 8; bit++) {
			crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
		}
	}
	return (crc ^ 0xFFFFFFFF) >>> 0;
}

async function normalizationRepairsRejectedNames() {
	const entries = await readEntries(await buildZip(["../evil.txt"]), { normalizeFilename: stripLeadingParents });
	if (entries[0].filename != "evil.txt") {
		throw new Error("expected the repaired name \"evil.txt\" got \"" + entries[0].filename + "\"");
	}
	const keptEntries = await readEntries(await buildZip(["kept.txt"]), { normalizeFilename: () => undefined });
	if (keptEntries[0].filename != "kept.txt") {
		throw new Error("expected the decoded name to be kept, got \"" + keptEntries[0].filename + "\"");
	}
	const directoryEntries = await readEntries(await buildZip(["x"], ""), { normalizeFilename: () => "x/" });
	if (!directoryEntries[0].directory) {
		throw new Error("expected the normalized name to be detected as a directory entry");
	}
}

// The hook receives the decoded name and its result is validated, so a hook that fails to repair a name
// does not defeat filenameValidation.
async function normalizationRunsAfterDecodingAndBeforeValidation() {
	let receivedFilename;
	const entries = await readEntries(await buildZip(["original.txt"]), {
		decodeText: () => "decoded.txt",
		normalizeFilename: filename => {
			receivedFilename = filename;
			return "normalized.txt";
		}
	});
	if (receivedFilename != "decoded.txt") {
		throw new Error("expected the hook to receive \"decoded.txt\" got \"" + receivedFilename + "\"");
	}
	if (entries[0].filename != "normalized.txt") {
		throw new Error("expected \"normalized.txt\" got \"" + entries[0].filename + "\"");
	}
	await assertRejected("../evil.txt", { normalizeFilename: filename => filename.replace("evil", "still-evil") },
		"../still-evil.txt");
}

// A normalization collapsing two names into one must not silently shadow an entry.
async function normalizationDetectsCollisions() {
	const data = await buildZip(["a.txt", "/a.txt"]);
	const options = { checkAmbiguity: true, filenameValidation: "balanced", normalizeFilename: stripLeadingSlashes };
	try {
		await readEntries(data, options);
	} catch (error) {
		if (error.message != zip.ERR_AMBIGUOUS_ARCHIVE) {
			throw error;
		}
		return;
	}
	throw new Error("expected colliding normalized names to be reported as an ambiguous archive");
}

async function filesystemInheritsNormalization() {
	const filesystem = new zip.ZipFS();
	await filesystem.importUint8Array(await buildZip(["../evil.txt", "sub/../ok.txt"]), {
		normalizeFilename: stripLeadingParents
	});
	const names = collectNames(filesystem.root).sort().join(",");
	if (names != "evil.txt,sub,sub/ok.txt") {
		throw new Error("expected \"evil.txt,sub,sub/ok.txt\" got \"" + names + "\"");
	}
}

function stripLeadingParents(filename) {
	return filename.split("/").filter(pathPart => pathPart != "..").join("/");
}

function stripLeadingSlashes(filename) {
	return filename.startsWith("/") ? filename.slice(1) : filename;
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
	const filesystem = new zip.ZipFS();
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

async function assertRejected(name, options, expectedFilename = name) {
	try {
		await readEntries(await buildZip([name]), options);
	} catch (error) {
		if (error.message != zip.ERR_UNSAFE_FILENAME) {
			throw error;
		}
		if (error.filename != expectedFilename) {
			throw new Error("expected rejected filename \"" + expectedFilename + "\" got \"" + error.filename + "\"", { cause: error });
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

async function buildZip(names, content = "content", extraField) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { useUnicodeFileNames: !extraField });
	for (const name of names) {
		const directory = name.endsWith("/");
		await zipWriter.add(name, directory ? undefined : new zip.TextReader(content), { directory, extraField });
	}
	return zipWriter.close();
}
