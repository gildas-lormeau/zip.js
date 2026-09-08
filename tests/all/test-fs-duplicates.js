/* global TextEncoder */

import * as zip from "../zip-lib.js";

const FIRST_CONTENT = "first";
const SECOND_CONTENT = "second";
const UNRELATED_CONTENT = "unrelated";
// the messages are read from the library rather than copied: a copy drifts the day one of them is reworded,
// and this file held "Entry is a ancestor of target entry" until the article was fixed
const { ERR_DUPLICATE_IMPORTED_ENTRY, ERR_INVALID_DUPLICATES, ERR_ENTRY_EXISTS, ERR_ANCESTOR_ENTRY } = zip;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await testDuplicateNames();
		await testInvalidOption();
		await testFileUsedAsDirectory();
		await testDirectoryUsedAsFile();
		await testTwoDirectoryRecords();
		await testFailedImportKeepsPreviousContent();
		testSlashedNamesBuildTheTree();
		await testSlashedNamesRoundTrip();
		testRename();
	} finally {
		await zip.terminateWorkers();
	}
}

// an archive holding the same filename twice: throw by default, otherwise keep the first or the last
async function testDuplicateNames() {
	const data = await writeDuplicateZip();
	await checkThrows(() => importArray(data), ERR_DUPLICATE_IMPORTED_ENTRY, "a duplicate filename must be refused by default");
	for (const [duplicates, expectedContent] of [["keep-first", FIRST_CONTENT], ["keep-last", SECOND_CONTENT]]) {
		const fs = await importArray(data, { duplicates });
		const text = await fs.find("a/dup.txt").getText();
		if (text != expectedContent) {
			throw new Error(`${duplicates} must keep ${expectedContent}, got ${text}`);
		}
		const unrelatedText = await fs.find("z/keep.txt").getText();
		if (unrelatedText != UNRELATED_CONTENT) {
			throw new Error(`${duplicates} must keep the entries that do not collide`);
		}
		// a resolved collision leaves one entry per name, so the exported size stays predictable
		const predictedSize = await fs.getExportedSize({ level: 0 });
		const exportedSize = (await fs.exportUint8Array({ level: 0 })).length;
		if (predictedSize != exportedSize) {
			throw new Error(`${duplicates}: getExportedSize() returned ${predictedSize}, the export is ${exportedSize} bytes`);
		}
	}
}

async function testInvalidOption() {
	const data = await writeZip(zipWriter => zipWriter.add("file.txt", new zip.TextReader(FIRST_CONTENT)));
	await checkThrows(() => importArray(data, { duplicates: "keep-them-all" }), ERR_INVALID_DUPLICATES, "an unknown duplicates value must be refused");
}

// a name used both as a file and as a directory prefix is governed by the same option
async function testFileUsedAsDirectory() {
	const data = await writeZip(async zipWriter => {
		await zipWriter.add("collision", new zip.TextReader(FIRST_CONTENT));
		await zipWriter.add("collision/file.txt", new zip.TextReader(SECOND_CONTENT));
		await zipWriter.add("z/keep.txt", new zip.TextReader(UNRELATED_CONTENT));
	});
	await checkThrows(() => importArray(data), ERR_DUPLICATE_IMPORTED_ENTRY, "a file used as a directory must be refused by default");
	const keptFirst = await importArray(data, { duplicates: "keep-first" });
	if (keptFirst.find("collision").directory || keptFirst.find("collision/file.txt")) {
		throw new Error("keep-first must keep the file and drop the entry below it");
	}
	const keptLast = await importArray(data, { duplicates: "keep-last" });
	if (!keptLast.find("collision").directory || !keptLast.find("collision/file.txt")) {
		throw new Error("keep-last must replace the file with the directory holding the entry");
	}
	for (const fs of [keptFirst, keptLast]) {
		if (!fs.find("z/keep.txt")) {
			throw new Error("the entries that do not collide must be kept");
		}
	}
}

// the reverse order of testFileUsedAsDirectory: the directory is populated first and the file claims the
// node last, which is the one collision where keep-last also drops entries that did not collide, since a
// file node cannot hold them
async function testDirectoryUsedAsFile() {
	const data = await writeZip(async zipWriter => {
		await zipWriter.add("collision/", null, { directory: true });
		await zipWriter.add("collision/deep/file.txt", new zip.TextReader(FIRST_CONTENT));
		await zipWriter.add("./collision", new zip.TextReader(SECOND_CONTENT));
		await zipWriter.add("z/keep.txt", new zip.TextReader(UNRELATED_CONTENT));
	});
	await checkThrows(() => importArray(data), ERR_DUPLICATE_IMPORTED_ENTRY, "a directory used as a file must be refused by default");
	const keptFirst = await importArray(data, { duplicates: "keep-first" });
	if (!keptFirst.find("collision").directory || await keptFirst.find("collision/deep/file.txt").getText() != FIRST_CONTENT) {
		throw new Error("keep-first must keep the directory and everything below it");
	}
	const keptLast = await importArray(data, { duplicates: "keep-last" });
	const replaced = keptLast.find("collision");
	if (replaced.directory || await replaced.getText() != SECOND_CONTENT) {
		throw new Error("keep-last must replace the directory with the file claiming the node");
	}
	const fullnames = keptLast.getChildren({ recursive: true }).map(entry => entry.getFullname());
	if (fullnames.some(fullname => fullname.startsWith("collision/"))) {
		throw new Error(`keep-last must drop the whole subtree the file node cannot hold, got ${JSON.stringify(fullnames)}`);
	}
	const exportedNames = await getExportedFilenames(keptLast);
	if (JSON.stringify(exportedNames) != JSON.stringify(["collision", "z/keep.txt"])) {
		throw new Error(`the dropped subtree must be gone from the export too, got ${JSON.stringify(exportedNames)}`);
	}
	for (const fs of [keptFirst, keptLast]) {
		if (!fs.find("z/keep.txt")) {
			throw new Error("the entries that do not collide with the node must be kept");
		}
	}
}

// two directory records claiming the same node are a collision like any other, and the entries already
// imported below the node survive it: the option replaces the record held by the node, not the node
async function testTwoDirectoryRecords() {
	const data = await writeZip(async zipWriter => {
		await zipWriter.add("collision/", null, { directory: true, comment: FIRST_CONTENT });
		await zipWriter.add("collision/file.txt", new zip.TextReader(UNRELATED_CONTENT));
		await zipWriter.add("./collision/", null, { directory: true, comment: SECOND_CONTENT });
		await zipWriter.add("z/keep.txt", new zip.TextReader(UNRELATED_CONTENT));
	});
	await checkThrows(() => importArray(data), ERR_DUPLICATE_IMPORTED_ENTRY, "two directory records must be refused by default");
	for (const [duplicates, expectedComment] of [["keep-first", FIRST_CONTENT], ["keep-last", SECOND_CONTENT]]) {
		const fs = await importArray(data, { duplicates });
		const directory = fs.find("collision");
		if (!directory || !directory.directory || directory.data.comment != expectedComment) {
			throw new Error(`${duplicates} must keep the ${expectedComment} directory record, got ` +
				(directory && directory.data ? directory.data.comment : "no record"));
		}
		if (await fs.find("collision/file.txt").getText() != UNRELATED_CONTENT) {
			throw new Error(`${duplicates} must keep the entries held by the directory`);
		}
		if (!fs.find("z/keep.txt")) {
			throw new Error("the entries that do not collide must be kept");
		}
	}
	// an implicitly created directory is not a duplicate, it is the node the record was missing
	const implicitData = await writeZip(async zipWriter => {
		await zipWriter.add("implicit/file.txt", new zip.TextReader(UNRELATED_CONTENT));
		await zipWriter.add("implicit/", null, { directory: true, comment: FIRST_CONTENT });
	});
	const fs = await importArray(implicitData);
	if (fs.find("implicit").data.comment != FIRST_CONTENT) {
		throw new Error("a record arriving after the entries below it must still be adopted by the node");
	}
}

// a rejected import must leave the filesystem exactly as it was
async function testFailedImportKeepsPreviousContent() {
	const data = await writeDuplicateZip();
	const fs = new zip.ZipFS();
	fs.addText("previous.txt", FIRST_CONTENT);
	const previousEntry = fs.find("previous.txt");
	await checkThrows(() => fs.importUint8Array(data), ERR_DUPLICATE_IMPORTED_ENTRY, "the import must fail");
	if (fs.children.length != 1 || fs.find("previous.txt") != previousEntry) {
		throw new Error("a failed import must not modify the filesystem");
	}
	if (await previousEntry.getText() != FIRST_CONTENT) {
		throw new Error("the content held before a failed import must still be readable");
	}
	// the same rule applies when importing into a directory instead of the root
	const directory = fs.addDirectory("target");
	directory.addText("kept.txt", UNRELATED_CONTENT);
	await checkThrows(() => directory.importZip(new zip.Uint8ArrayReader(data)), ERR_DUPLICATE_IMPORTED_ENTRY, "the import into a directory must fail");
	if (directory.children.length != 1 || directory.children[0].name != "kept.txt") {
		throw new Error("a failed import must not leave partially built entries behind");
	}
}

// a "/" in the name passed to an add* method builds path segments, like an imported filename does
function testSlashedNamesBuildTheTree() {
	const fs = new zip.ZipFS();
	const entry = fs.addText("deep/dir/file.txt", FIRST_CONTENT);
	if (entry.name != "file.txt" || entry.getFullname() != "deep/dir/file.txt") {
		throw new Error("a slashed name must be split into path segments");
	}
	if (fs.children.length != 1 || fs.children[0].name != "deep" || !fs.children[0].directory) {
		throw new Error("the directories of the path must be created");
	}
	// the two spellings of the same path now collide instead of producing an unexportable tree
	checkThrowsSync(() => fs.addDirectory("deep").addDirectory("dir").addText("file.txt", SECOND_CONTENT),
		ERR_ENTRY_EXISTS, "both spellings of the same path must collide");
}

// the directories created that way are implicit: they are not written, so the bytes do not change
async function testSlashedNamesRoundTrip() {
	const fs = new zip.ZipFS();
	fs.addText("deep/dir/file.txt", FIRST_CONTENT);
	const data = await fs.exportUint8Array();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const filenames = (await zipReader.getEntries()).map(({ filename }) => filename);
	await zipReader.close();
	if (filenames.length != 1 || filenames[0] != "deep/dir/file.txt") {
		throw new Error(`the exported zip file must hold the single entry, got ${JSON.stringify(filenames)}`);
	}
	const importedFs = await importArray(data);
	const fullnames = importedFs.getChildren({ recursive: true }).map(entry => entry.getFullname());
	const expectedFullnames = fs.getChildren({ recursive: true }).map(entry => entry.getFullname());
	if (JSON.stringify(fullnames) != JSON.stringify(expectedFullnames)) {
		throw new Error(`exporting and importing must rebuild the same tree, got ${JSON.stringify(fullnames)}`);
	}
}

function testRename() {
	const fs = new zip.ZipFS();
	const entry = fs.addText("file.txt", FIRST_CONTENT);
	// renaming an entry to the name it already has is a no-op, not a collision with itself
	entry.rename("file.txt");
	if (entry.name != "file.txt") {
		throw new Error("renaming an entry to its own name must keep it");
	}
	// a "/" in the new name moves the entry, like it does when the entry is added
	entry.rename("moved/file.txt");
	if (entry.getFullname() != "moved/file.txt" || fs.find("moved/file.txt") != entry) {
		throw new Error("renaming with a path must move the entry");
	}
	const sibling = fs.addText("sibling.txt", SECOND_CONTENT);
	checkThrowsSync(() => sibling.rename("moved"), ERR_ENTRY_EXISTS, "renaming onto an existing sibling must throw");
	const directory = fs.addDirectory("directory");
	checkThrowsSync(() => directory.rename("directory/inner"), ERR_ANCESTOR_ENTRY, "renaming an entry into itself must throw");
}

// the writer refuses to store the same name twice, so the duplicate is made by patching the bytes
async function writeDuplicateZip() {
	const data = await writeZip(async zipWriter => {
		await zipWriter.add("a/dup.txt", new zip.TextReader(FIRST_CONTENT));
		await zipWriter.add("b/dup.txt", new zip.TextReader(SECOND_CONTENT));
		await zipWriter.add("z/keep.txt", new zip.TextReader(UNRELATED_CONTENT));
	});
	const [firstByte, ...nextBytes] = new TextEncoder().encode("b/dup.txt");
	const replacedByte = new TextEncoder().encode("a")[0];
	for (let offset = 0; offset <= data.length - nextBytes.length - 1; offset++) {
		if (data[offset] == firstByte && nextBytes.every((byteValue, indexByte) => data[offset + indexByte + 1] == byteValue)) {
			data[offset] = replacedByte;
		}
	}
	return data;
}

async function writeZip(addEntries) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 0 });
	await addEntries(zipWriter);
	return await zipWriter.close();
}

async function getExportedFilenames(fs) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await fs.exportUint8Array()));
	try {
		return (await zipReader.getEntries()).map(({ filename }) => filename);
	} finally {
		await zipReader.close();
	}
}

async function importArray(data, options) {
	const fs = new zip.ZipFS();
	await fs.importUint8Array(data, options);
	return fs;
}

async function checkThrows(operation, expectedMessage, label) {
	let thrownError;
	try {
		await operation();
	} catch (error) {
		thrownError = error;
	}
	checkError(thrownError, expectedMessage, label);
}

function checkThrowsSync(operation, expectedMessage, label) {
	let thrownError;
	try {
		operation();
	} catch (error) {
		thrownError = error;
	}
	checkError(thrownError, expectedMessage, label);
}

function checkError(thrownError, expectedMessage, label) {
	if (!thrownError) {
		throw new Error(`${label}: no error thrown`);
	}
	if (thrownError.message != expectedMessage) {
		throw new Error(`${label}: expected ${JSON.stringify(expectedMessage)}, got ${JSON.stringify(thrownError.message)}`);
	}
}
