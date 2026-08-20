import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, ".repeat(40);
const IMPORTED_COMMENT = "imported comment";
const ENTRY_COMMENT = "entry comment";
const EXPORT_COMMENT = "export comment";

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await testMergedOptions();
		await testClearedOptions();
		await testPrecedence();
		await testDistinctOptionsPerEntry();
		await testUnsharedOptions();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testMergedOptions() {
	const zipFs = new zip.ZipFS();
	const zipEntry = zipFs.addText("file.txt", TEXT_CONTENT, { comment: ENTRY_COMMENT, level: 0 });
	zipEntry.setOptions({ lastModDate: new Date(0) });
	zipEntry.setOptions({ comment: EXPORT_COMMENT });
	if (zipEntry.options.level !== 0) {
		throw new Error("setOptions replaced the options instead of merging them");
	}
	const [entry] = await getEntries(await zipFs.exportUint8Array());
	if (entry.compressionMethod != 0x00 || entry.comment != EXPORT_COMMENT || entry.lastModDate.getTime() !== 0) {
		throw new Error("merged options did not reach the exported entry");
	}
}

async function testClearedOptions() {
	const zipFs = new zip.ZipFS();
	const zipEntry = zipFs.addText("file.txt", TEXT_CONTENT, { comment: ENTRY_COMMENT, level: 0 });
	zipEntry.setOptions({ level: undefined });
	if ("level" in zipEntry.options) {
		throw new Error("setOptions stored an undefined value instead of removing the option");
	}
	const [entry] = await getEntries(await zipFs.exportUint8Array());
	if (entry.compressionMethod != 0x08 || entry.comment != ENTRY_COMMENT) {
		throw new Error("clearing an option did not restore the default value");
	}
}

async function testPrecedence() {
	const source = await buildSourceArchive();
	const importedComment = await getExportedComment(source, () => { }, {});
	if (importedComment != IMPORTED_COMMENT) {
		throw new Error("the imported comment is not kept by default");
	}
	const exportComment = await getExportedComment(source, () => { }, { comment: EXPORT_COMMENT });
	if (exportComment != EXPORT_COMMENT) {
		throw new Error("the export options no longer override the imported metadata");
	}
	const entryComment = await getExportedComment(source, zipEntry => zipEntry.setOptions({ comment: ENTRY_COMMENT }), { comment: EXPORT_COMMENT });
	if (entryComment != ENTRY_COMMENT) {
		throw new Error("the entry options do not override the export options");
	}
	const clearedComment = await getExportedComment(source, zipEntry => {
		zipEntry.setOptions({ comment: ENTRY_COMMENT });
		zipEntry.setOptions({ comment: undefined });
	}, { comment: EXPORT_COMMENT });
	if (clearedComment != EXPORT_COMMENT) {
		throw new Error("clearing an entry option does not restore the export option");
	}
	const restoredComment = await getExportedComment(source, zipEntry => {
		zipEntry.setOptions({ comment: ENTRY_COMMENT });
		zipEntry.setOptions({ comment: undefined });
	}, {});
	if (restoredComment != IMPORTED_COMMENT) {
		throw new Error("clearing an entry option does not restore the imported metadata");
	}
}

async function testDistinctOptionsPerEntry() {
	const zipFs = new zip.ZipFS();
	const directoryEntry = zipFs.addDirectory("directory");
	directoryEntry.setOptions({ comment: ENTRY_COMMENT });
	directoryEntry.addText("stored.txt", TEXT_CONTENT).setOptions({ level: 0 });
	directoryEntry.addText("deflated.txt", TEXT_CONTENT);
	const entries = await getEntries(await zipFs.exportUint8Array());
	const directory = entries.find(entry => entry.directory);
	const stored = entries.find(entry => entry.filename.endsWith("stored.txt"));
	const deflated = entries.find(entry => entry.filename.endsWith("deflated.txt"));
	if (directory.comment != ENTRY_COMMENT) {
		throw new Error("setOptions is ignored by directory entries");
	}
	if (stored.compressionMethod != 0x00 || deflated.compressionMethod != 0x08) {
		throw new Error("setOptions applied to an entry reached its siblings");
	}
}

async function testUnsharedOptions() {
	const zipFs = new zip.ZipFS();
	const sharedOptions = { comment: ENTRY_COMMENT };
	const firstEntry = zipFs.addText("first.txt", TEXT_CONTENT, sharedOptions);
	const secondEntry = zipFs.addText("second.txt", TEXT_CONTENT, sharedOptions);
	firstEntry.setOptions({ comment: EXPORT_COMMENT });
	if (secondEntry.options.comment != ENTRY_COMMENT || sharedOptions.comment != ENTRY_COMMENT) {
		throw new Error("setOptions modified the options object shared with another entry");
	}
	const clonedEntry = firstEntry.clone();
	firstEntry.setOptions({ comment: IMPORTED_COMMENT });
	if (clonedEntry.options.comment != EXPORT_COMMENT) {
		throw new Error("setOptions modified the options of a clone");
	}
}

async function buildSourceArchive() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("file.txt", new zip.TextReader(TEXT_CONTENT), { comment: IMPORTED_COMMENT });
	return await zipWriter.close();
}

async function getExportedComment(source, setEntryOptions, exportOptions) {
	const zipFs = new zip.ZipFS();
	await zipFs.importUint8Array(source);
	setEntryOptions(zipFs.find("file.txt"));
	const [entry] = await getEntries(await zipFs.exportUint8Array(exportOptions));
	return entry.comment;
}

function getEntries(data) {
	return new zip.ZipReader(new zip.Uint8ArrayReader(data)).getEntries();
}
