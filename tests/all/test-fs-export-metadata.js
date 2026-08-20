// Locks the precedence of the export options of the filesystem API over the metadata of the entries
// imported from a zip file. An export without options preserves the source metadata, an explicit
// option overrides it exactly as it does for the entries added through the API, and the options
// describing the data written as-is are never overridden, otherwise the headers of the entries would
// describe content that is not there.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(8);
const IMPORTED_FILENAME = "imported.txt";
const ADDED_FILENAME = "added.txt";
const CUSTOM_FIELD_TYPE = 0x6666;
const SOURCE_OPTIONS = {
	lastModDate: new Date("2001-01-01T00:00:00.000Z"),
	creationDate: new Date("2001-02-02T00:00:00.000Z"),
	lastAccessDate: new Date("2001-03-03T00:00:00.000Z"),
	comment: "source comment",
	versionMadeBy: 40,
	internalFileAttributes: 1,
	unixMode: 0o644,
	uid: 501,
	gid: 20,
	extraField: new Map([[CUSTOM_FIELD_TYPE, new Uint8Array([1, 2, 3, 4])]])
};
const EXPORT_OPTIONS = {
	lastModDate: new Date("2020-06-15T12:00:00.000Z"),
	creationDate: new Date("2020-07-16T12:00:00.000Z"),
	lastAccessDate: new Date("2020-08-17T12:00:00.000Z"),
	comment: "export comment",
	versionMadeBy: 60,
	internalFileAttributes: 0,
	externalFileAttributes: 0o100777 << 16,
	uid: 0,
	gid: 0,
	extraField: new Map([[CUSTOM_FIELD_TYPE, new Uint8Array([5, 6, 7, 8])]])
};
const METADATA_PROPERTY_NAMES = [
	"lastModDate", "creationDate", "lastAccessDate", "comment", "versionMadeBy",
	"internalFileAttributes", "externalFileAttributes", "uid", "gid"
];

export { test };

async function test() {
	try {
		await testDefaultExportPreservesSourceMetadata();
		await testExportOptionsOverrideSourceMetadata();
		await testPassThroughOptionsAreNotOverridden();
		await testEntryOptionsWin();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testDefaultExportPreservesSourceMetadata() {
	const [sourceEntry] = await readArchive(await createSourceArchive());
	const [importedEntry] = await exportTree({});
	assertSameMetadata("a default export", importedEntry, sourceEntry);
	assertSameExtraField("a default export", importedEntry, [1, 2, 3, 4]);
}

async function testExportOptionsOverrideSourceMetadata() {
	const [importedEntry, addedEntry] = await exportTree(EXPORT_OPTIONS);
	assertSameMetadata("an explicit export option", importedEntry, addedEntry);
	assertSameExtraField("an explicit export option", importedEntry, [5, 6, 7, 8]);
}

async function testPassThroughOptionsAreNotOverridden() {
	const [reference] = await exportTree({ readerOptions: { passThrough: true } }, { passThrough: true });
	for (const dataOptions of [{ level: 9, compressionMethod: 0 }, { crc32: 0, uncompressedSize: 7 }]) {
		let importedEntry;
		try {
			[importedEntry] = await exportTree(Object.assign({ readerOptions: { passThrough: true } }, dataOptions), { passThrough: true });
		} catch (error) {
			throw new Error("the export options should not describe the data written as-is, got " + error.message, { cause: error });
		}
		if (importedEntry.compressionMethod != reference.compressionMethod ||
			importedEntry.uncompressedSize != reference.uncompressedSize ||
			importedEntry.compressedSize != reference.compressedSize) {
			throw new Error("the export options should not describe the data written as-is, got method " +
				importedEntry.compressionMethod + " and sizes " + importedEntry.uncompressedSize + "/" + importedEntry.compressedSize);
		}
	}
	const [entryWithMetadata] = await exportTree(Object.assign({ readerOptions: { passThrough: true } }, EXPORT_OPTIONS), { passThrough: true });
	if (entryWithMetadata.comment != EXPORT_OPTIONS.comment) {
		throw new Error("expected the comment \"" + EXPORT_OPTIONS.comment + "\" for an entry written as-is, got \"" + entryWithMetadata.comment + "\"");
	}
}

async function testEntryOptionsWin() {
	const zipFs = new zip.ZipFS();
	zipFs.root.addText(ADDED_FILENAME, TEXT_CONTENT, { comment: "entry comment" });
	const [entry] = await readArchive(await zipFs.exportUint8Array(EXPORT_OPTIONS));
	if (entry.comment != "entry comment") {
		throw new Error("expected the options of the entry to win, got the comment \"" + entry.comment + "\"");
	}
}

async function createSourceArchive() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(IMPORTED_FILENAME, new zip.TextReader(TEXT_CONTENT), SOURCE_OPTIONS);
	return zipWriter.close();
}

async function exportTree(exportOptions, importOptions = {}) {
	const zipFs = new zip.ZipFS();
	await zipFs.importUint8Array(await createSourceArchive(), importOptions);
	zipFs.root.addText(ADDED_FILENAME, TEXT_CONTENT);
	const entries = await readArchive(await zipFs.exportUint8Array(exportOptions));
	return [entries.find(entry => entry.filename == IMPORTED_FILENAME), entries.find(entry => entry.filename == ADDED_FILENAME)];
}

async function readArchive(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict", checkCrc32: true });
	const entries = await zipReader.getEntries();
	for (const entry of entries) {
		const text = await entry.getData(new zip.TextWriter());
		if (text != TEXT_CONTENT) {
			throw new Error("the content of " + entry.filename + " is corrupted");
		}
	}
	await zipReader.close();
	return entries;
}

function assertSameMetadata(label, entry, referenceEntry) {
	for (const propertyName of METADATA_PROPERTY_NAMES) {
		const value = getComparableValue(entry[propertyName]);
		const referenceValue = getComparableValue(referenceEntry[propertyName]);
		if (value !== referenceValue) {
			throw new Error("expected " + propertyName + " to be " + referenceValue + " with " + label + ", got " + value);
		}
	}
}

function assertSameExtraField(label, entry, expectedData) {
	const customField = entry.extraField.get(CUSTOM_FIELD_TYPE);
	if (!customField || customField.data.join() != expectedData.join()) {
		throw new Error("expected the extra field " + expectedData.join() + " with " + label +
			", got " + (customField && customField.data.join()));
	}
}

function getComparableValue(value) {
	return value instanceof Date ? value.getTime() : value;
}
