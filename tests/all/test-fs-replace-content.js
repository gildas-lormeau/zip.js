/* global Blob, btoa */

import * as zip from "../zip-lib.js";

const ERR_UNDETERMINED_SIZE = "Undetermined size";
const INITIAL_CONTENT = "x";

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await testSizeIsUpdated();
		await testReadableSizeIsUndetermined();
		await testPassThroughIsCleared();
	} finally {
		await zip.terminateWorkers();
	}
}

// replacing the content of an entry must update its size, otherwise the entry keeps describing the
// content it held before and getExportedSize() predicts a size the export does not produce
async function testSizeIsUpdated() {
	const replacements = [
		["replaceText", entry => entry.replaceText("y".repeat(5000)), 5000],
		["replaceUint8Array", entry => entry.replaceUint8Array(new Uint8Array(3000)), 3000],
		["replaceBlob", entry => entry.replaceBlob(new Blob(["z".repeat(1234)])), 1234],
		["replaceData64URI", entry => entry.replaceData64URI("data:text/plain;base64," + btoa("w".repeat(600))), 600]
	];
	for (const [label, replaceContent, expectedSize] of replacements) {
		const fs = new zip.ZipFS();
		const entry = fs.addText("file.txt", INITIAL_CONTENT, { level: 0 });
		replaceContent(entry);
		if (entry.uncompressedSize != expectedSize) {
			throw new Error(`${label} must set the size to ${expectedSize}, got ${entry.uncompressedSize}`);
		}
		// the prediction is only exact for stored entries, the compressed size cannot be predicted
		const predictedSize = await fs.getExportedSize({ level: 0 });
		const exportedSize = (await fs.exportUint8Array({ level: 0 })).length;
		if (predictedSize != exportedSize) {
			throw new Error(`${label}: getExportedSize() returned ${predictedSize}, the export is ${exportedSize} bytes`);
		}
	}
}

// a readable has no known size, so the entry must report an undetermined size like addReadable() does
async function testReadableSizeIsUndetermined() {
	const fs = new zip.ZipFS();
	const entry = fs.addText("file.txt", INITIAL_CONTENT, { level: 0 });
	entry.replaceReadable(new Blob(["y".repeat(5000)]).stream());
	let thrownError;
	try {
		await fs.getExportedSize({ level: 0 });
	} catch (error) {
		thrownError = error;
	}
	if (!thrownError || thrownError.message != ERR_UNDETERMINED_SIZE) {
		throw new Error("getExportedSize() must refuse to predict the size of an entry holding a readable");
	}
	const exportedSize = (await fs.exportUint8Array({ level: 0 })).length;
	if (exportedSize <= 5000) {
		throw new Error(`the readable must still be exported, got ${exportedSize} bytes`);
	}
}

// the pass-through flag describes the bytes imported from a zip file, so replacing them must clear it
async function testPassThroughIsCleared() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("file.txt", new zip.TextReader("original ".repeat(200)));
	const fs = new zip.ZipFS();
	await fs.importUint8Array(await zipWriter.close(), { passThrough: true });
	const entry = fs.find("file.txt");
	if (!entry.passThrough) {
		throw new Error("the entry must be imported as-is");
	}
	entry.replaceText("REPLACED");
	if (entry.passThrough) {
		throw new Error("replacing the content must clear the pass-through flag");
	}
	const data = await fs.exportUint8Array();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const [importedEntry] = await zipReader.getEntries();
	const text = await importedEntry.getData(new zip.TextWriter());
	await zipReader.close();
	if (text != "REPLACED" || importedEntry.uncompressedSize != "REPLACED".length) {
		throw new Error(`the replaced content must be exported, got ${JSON.stringify(text)}`);
	}
}
