/* global setTimeout */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "content";
const PINNED_DATE = new Date("2001-02-03T04:05:06Z");
const ENTRY_DATE = new Date("1999-12-31T00:00:00Z");
const EXPORT_DELAY = 1100;

export { test };

async function test() {
	await exportsDoNotChangeOverTime();
	await theExportOptionPinsAddedEntries();
	await anEntryDateBeatsTheExportOption();
	await anImportedDateIsKeptAndCanBePinned();
	await zip.terminateWorkers();
}

// an entry added without a date takes the date of the moment it was added, not the date of the
// moment it is written, otherwise exporting the same unchanged tree twice gives two different
// archives; the extended timestamp has a resolution of one second, so a delay above that second is
// enough to see it
async function exportsDoNotChangeOverTime() {
	const fileSystem = new zip.ZipFS();
	fileSystem.addText("a.txt", TEXT_CONTENT);
	fileSystem.addDirectory("d");
	const first = await fileSystem.exportUint8Array();
	await new Promise(resolve => setTimeout(resolve, EXPORT_DELAY));
	const second = await fileSystem.exportUint8Array();
	if (first.length != second.length || first.some((byte, index) => byte != second[index])) {
		throw new Error("expected two exports of the same tree to be identical");
	}
}

// the date taken when the entry was added must stay weaker than the export option, which is how a
// caller pins every date of an archive
async function theExportOptionPinsAddedEntries() {
	const fileSystem = new zip.ZipFS();
	fileSystem.addText("a.txt", TEXT_CONTENT);
	fileSystem.addDirectory("d");
	await assertDates(fileSystem, { lastModDate: PINNED_DATE }, { "a.txt": PINNED_DATE, "d/": PINNED_DATE });
}

async function anEntryDateBeatsTheExportOption() {
	const fileSystem = new zip.ZipFS();
	fileSystem.addText("a.txt", TEXT_CONTENT, { lastModDate: ENTRY_DATE });
	await assertDates(fileSystem, { lastModDate: PINNED_DATE }, { "a.txt": ENTRY_DATE });
}

async function anImportedDateIsKeptAndCanBePinned() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("imported.txt", new zip.TextReader(TEXT_CONTENT), { lastModDate: ENTRY_DATE });
	const data = await zipWriter.close();
	const fileSystem = new zip.ZipFS();
	await fileSystem.importUint8Array(data);
	await assertDates(fileSystem, {}, { "imported.txt": ENTRY_DATE });
	await assertDates(fileSystem, { lastModDate: PINNED_DATE }, { "imported.txt": PINNED_DATE });
}

async function assertDates(fileSystem, options, expectedDates) {
	const data = await fileSystem.exportUint8Array(options);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	for (const [filename, expectedDate] of Object.entries(expectedDates)) {
		const entry = entries.find(entry => entry.filename == filename);
		if (!entry) {
			throw new Error("missing entry " + filename + " in " + entries.map(entry => entry.filename).join(", "));
		}
		if (entry.lastModDate.getTime() != expectedDate.getTime()) {
			throw new Error("expected " + filename + " dated " + expectedDate.toISOString() + ", got " + entry.lastModDate.toISOString());
		}
	}
}
