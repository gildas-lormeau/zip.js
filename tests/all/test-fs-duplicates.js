/* global TextEncoder */

import * as zip from "../zip-lib.js";

const FIRST_CONTENT = "first";
const SECOND_CONTENT = "second";
const UNRELATED_CONTENT = "unrelated";
const ERR_DUPLICATE_IMPORTED_ENTRY = "Duplicate entry filename in the imported zip file";
const ERR_INVALID_DUPLICATES = "Invalid duplicates option (must be \"throw\", \"keep-first\" or \"keep-last\")";
const ERR_ENTRY_EXISTS = "Entry filename already exists";
const ERR_ANCESTOR_ENTRY = "Entry is a ancestor of target entry";

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await testDuplicateNames();
		await testInvalidOption();
		await testFileUsedAsDirectory();
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
