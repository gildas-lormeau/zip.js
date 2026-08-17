/* global setTimeout, clearTimeout */

// Locks the behavior of the reader options that withhold the content of an entry: `preventClose`,
// `checkPasswordOnly` and `checkOverlappingEntryOnly` cannot apply when the filesystem reads an
// entry to materialize its bytes, so they must be ignored instead of hanging or failing. All three
// spellings are covered: the export options, the import options and the options of `getData`.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(20);
const FILENAME = "lorem.txt";
const WITHHOLDING_OPTIONS = ["preventClose", "checkPasswordOnly", "checkOverlappingEntryOnly"];
const TIMEOUT = 10000;

export { test };

async function test() {
	const source = await createSourceBlob();
	for (const name of WITHHOLDING_OPTIONS) {
		const options = {};
		options[name] = true;
		await testExport(source, name, { readerOptions: options }, {});
		await testExport(source, name, {}, options);
		await testGetData(source, name, options);
	}
	await zip.terminateWorkers();
}

async function createSourceBlob() {
	const fs = new zip.fs.FS();
	fs.addText(FILENAME, TEXT_CONTENT);
	return fs.exportBlob();
}

async function testExport(source, name, exportOptions, importOptions) {
	const fs = await importBlob(source, importOptions);
	const blob = await withTimeout(fs.exportBlob(exportOptions), name);
	await assertText(await importBlob(blob, {}), name, {});
}

async function testGetData(source, name, options) {
	await assertText(await importBlob(source, {}), name, options);
}

async function importBlob(blob, options) {
	const fs = new zip.fs.FS();
	await fs.importBlob(blob, options);
	return fs;
}

async function assertText(fs, name, options) {
	const text = await withTimeout(fs.getChildByName(FILENAME).getText(null, options), name);
	if (text != TEXT_CONTENT) {
		throw new Error("unexpected content with " + name);
	}
}

async function withTimeout(promise, name) {
	let timeoutId;
	const timeout = new Promise((_, reject) => timeoutId = setTimeout(() => reject(new Error("timed out with " + name)), TIMEOUT));
	try {
		return await Promise.race([promise, timeout]);
	} finally {
		clearTimeout(timeoutId);
	}
}
