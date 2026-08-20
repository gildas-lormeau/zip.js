/* global TextEncoder */

// Locks the global comment of the fs zip export API. The export options are writer options applied
// to every entry, so `comment` is the comment of each entry and the comment of the zip file itself
// needs its own name. `getExportedSize` must count it, and both must reject an oversized one exactly
// like `ZipWriter#close` does.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const FILENAME = "lorem.txt";
const DIRECTORY_NAME = "dir";
const ENTRY_COMMENT = "entry comment";
const GLOBAL_COMMENT = new TextEncoder().encode("global comment");
const OVERSIZED_COMMENT = new Uint8Array(65536);

export { test };

async function test() {
	try {
		await testGlobalComment();
		await testPredictedSize();
		await testOversizedComment();
		await testEntryComment();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testGlobalComment() {
	const data = await createFilesystem().exportUint8Array({ globalComment: GLOBAL_COMMENT });
	const { comment, entries } = await readArchive(data);
	if (!bytesEqual(comment, GLOBAL_COMMENT)) {
		throw new Error("expected the global comment \"" + decode(GLOBAL_COMMENT) + "\", got \"" + decode(comment) + "\"");
	}
	const commentedEntry = entries.find(entry => entry.comment);
	if (commentedEntry) {
		throw new Error("the global comment should not be the comment of " + commentedEntry.filename);
	}
}

async function testPredictedSize() {
	const options = { globalComment: GLOBAL_COMMENT, level: 0 };
	const predictedSize = await createFilesystem().getExportedSize(options);
	const data = await createFilesystem().exportUint8Array(options);
	if (predictedSize != data.length) {
		throw new Error("expected a predicted size of " + data.length + ", got " + predictedSize);
	}
	const referenceSize = await createFilesystem().getExportedSize({ level: 0 });
	if (predictedSize - referenceSize != GLOBAL_COMMENT.length) {
		throw new Error("expected the prediction to grow by " + GLOBAL_COMMENT.length + ", got " + (predictedSize - referenceSize));
	}
}

async function testOversizedComment() {
	const options = { globalComment: OVERSIZED_COMMENT, level: 0 };
	await assertInvalidComment("exportUint8Array", () => createFilesystem().exportUint8Array(options));
	await assertInvalidComment("getExportedSize", () => createFilesystem().getExportedSize(options));
}

async function testEntryComment() {
	const data = await createFilesystem().exportUint8Array({ comment: ENTRY_COMMENT });
	const { comment, entries } = await readArchive(data);
	if (comment.length) {
		throw new Error("expected an empty global comment, got \"" + decode(comment) + "\"");
	}
	const uncommentedEntry = entries.find(entry => entry.comment != ENTRY_COMMENT);
	if (uncommentedEntry) {
		throw new Error("expected the comment \"" + ENTRY_COMMENT + "\" for " + uncommentedEntry.filename +
			", got \"" + uncommentedEntry.comment + "\"");
	}
}

function createFilesystem() {
	const zipFs = new zip.ZipFS();
	zipFs.addDirectory(DIRECTORY_NAME).addText(FILENAME, TEXT_CONTENT);
	return zipFs;
}

async function readArchive(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict" });
	const entries = await zipReader.getEntries();
	const { comment } = zipReader;
	await zipReader.close();
	return { comment, entries };
}

async function assertInvalidComment(label, run) {
	let error;
	try {
		await run();
	} catch (runError) {
		error = runError;
	}
	if (!error || error.message != zip.ERR_INVALID_COMMENT) {
		throw new Error("expected an " + zip.ERR_INVALID_COMMENT + " error from " + label + ", got " + (error && error.message));
	}
}

function decode(comment) {
	return Array.from(comment, value => String.fromCharCode(value)).join("");
}

function bytesEqual(left, right) {
	return left.length == right.length && left.every((value, index) => value == right[index]);
}
