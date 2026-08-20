/* global WritableStream, TextDecoder, setTimeout, clearTimeout */

// Locks `preventClose` across the three layers: it is honored when the caller owns the writable and
// forced off when the Writer instance owns it and returns the written data, since such a writer only
// produces its data once its writable is closed. Every call is guarded by a timeout because the
// failure mode of the second case is a deadlock rather than an error.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(20);
const FILENAME = "lorem.txt";
const PREVENT_CLOSE_OPTIONS = { preventClose: true };
const TIMEOUT = 10000;

export { test };

async function test() {
	await testReaderPreventClose();
	await testWriterPreventClose();
	await testEntryPreventClose(createAddedEntry(), "added entry");
	await testEntryPreventClose(await createImportedEntry(), "imported entry");
	await testEntriesConcatenatedIntoOneWritable();
	await testExportPreventClose();
	await zip.terminateWorkers();
}

async function testReaderPreventClose() {
	const target = createTarget();
	await withTimeout(getFirstEntry().then(entry => entry.getData(target, PREVENT_CLOSE_OPTIONS)), "reader writable");
	if (target.closed) {
		throw new Error("caller writable closed by the reader with preventClose");
	}
	assertText(target.getText(), "reader writable");

	const entry = await getFirstEntry();
	assertText(await withTimeout(entry.getData(new zip.TextWriter(), PREVENT_CLOSE_OPTIONS), "reader TextWriter"), "reader TextWriter");
	const blob = await withTimeout((await getFirstEntry()).getData(new zip.BlobWriter(), PREVENT_CLOSE_OPTIONS), "reader BlobWriter");
	assertSize(blob.size, "reader BlobWriter");

	const readerOptionsEntry = await getFirstEntry(PREVENT_CLOSE_OPTIONS);
	assertText(await withTimeout(readerOptionsEntry.getData(new zip.TextWriter()), "ZipReader option"), "ZipReader option");
}

async function testWriterPreventClose() {
	const target = createTarget();
	for (const name of ["first.txt", "second.txt"]) {
		const zipWriter = new zip.ZipWriter(target, PREVENT_CLOSE_OPTIONS);
		await zipWriter.add(name, new zip.TextReader(name));
		await withTimeout(zipWriter.close(), "writer writable");
	}
	if (target.closed) {
		throw new Error("caller writable closed by the writer with preventClose");
	}
	await target.writable.getWriter().close();

	const zipWriter = new zip.ZipWriter(new zip.BlobWriter(), PREVENT_CLOSE_OPTIONS);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	const blob = await withTimeout(zipWriter.close(), "writer BlobWriter");
	if (!blob.size) {
		throw new Error("empty zip file with preventClose");
	}
}

async function testEntryPreventClose(entry, label) {
	const target = createTarget();
	await withTimeout(entry.getData({ writable: target.writable }, PREVENT_CLOSE_OPTIONS), "getData of " + label);
	if (target.closed) {
		throw new Error("caller writable closed with preventClose (" + label + ")");
	}
	assertText(target.getText(), "getData of " + label);
	await target.writable.getWriter().close();

	assertText(await withTimeout(entry.getText(null, PREVENT_CLOSE_OPTIONS), "getText of " + label), "getText of " + label);
	assertSize((await withTimeout(entry.getBlob(null, PREVENT_CLOSE_OPTIONS), "getBlob of " + label)).size, "getBlob of " + label);
	assertSize((await withTimeout(entry.getUint8Array(PREVENT_CLOSE_OPTIONS), "getUint8Array of " + label)).length, "getUint8Array of " + label);
	assertSize((await withTimeout(entry.getArrayBuffer(PREVENT_CLOSE_OPTIONS), "getArrayBuffer of " + label)).byteLength, "getArrayBuffer of " + label);

	const closedTarget = createTarget();
	await withTimeout(entry.getWritable(closedTarget.writable), "getWritable of " + label);
	if (!closedTarget.closed) {
		throw new Error("caller writable not closed without preventClose (" + label + ")");
	}
}

async function testEntriesConcatenatedIntoOneWritable() {
	const fs = new zip.ZipFS();
	fs.addText("first.txt", "first");
	fs.addText("second.txt", "second");
	const target = createTarget();
	for (const name of ["first.txt", "second.txt"]) {
		await withTimeout(fs.getChildByName(name).getWritable(target.writable, PREVENT_CLOSE_OPTIONS), name);
	}
	await target.writable.getWriter().close();
	if (target.getText() != "firstsecond") {
		throw new Error("unexpected concatenated content");
	}
}

async function testExportPreventClose() {
	const target = createTarget();
	await withTimeout(createExportedFS().exportWritable(target.writable, PREVENT_CLOSE_OPTIONS), "exportWritable");
	if (target.closed) {
		throw new Error("exported writable closed with preventClose");
	}
	await target.writable.getWriter().close();
	await assertExportedContent(target.getBytes(), "exportWritable");

	const blob = await withTimeout(createExportedFS().exportBlob(PREVENT_CLOSE_OPTIONS), "exportBlob");
	const array = await withTimeout(createExportedFS().exportUint8Array(PREVENT_CLOSE_OPTIONS), "exportUint8Array");
	const dataURI = await withTimeout(createExportedFS().exportData64URI(PREVENT_CLOSE_OPTIONS), "exportData64URI");
	if (!blob.size || blob.size != array.length || !dataURI.startsWith("data:")) {
		throw new Error("unexpected exported data with preventClose");
	}
	await assertExportedContent(array, "exportUint8Array");
}

function createExportedFS() {
	const fs = new zip.ZipFS();
	fs.addText(FILENAME, TEXT_CONTENT);
	return fs;
}

function createAddedEntry() {
	return new zip.ZipFS().addText(FILENAME, TEXT_CONTENT);
}

async function createImportedEntry() {
	const importedFS = new zip.ZipFS();
	await importedFS.importBlob(await createExportedFS().exportBlob());
	return importedFS.getChildByName(FILENAME);
}

async function getFirstEntry(options) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(await createExportedFS().exportBlob()), options);
	return (await zipReader.getEntries())[0];
}

async function assertExportedContent(bytes, label) {
	const fs = new zip.ZipFS();
	await fs.importUint8Array(bytes);
	assertText(await fs.getChildByName(FILENAME).getText(), label);
}

function createTarget() {
	const chunks = [];
	const target = {
		closed: false,
		getText() {
			const decoder = new TextDecoder();
			let text = "";
			chunks.forEach(chunk => text += decoder.decode(chunk, { stream: true }));
			return text + decoder.decode();
		},
		getBytes() {
			let size = 0;
			chunks.forEach(chunk => size += chunk.length);
			const bytes = new Uint8Array(size);
			let offset = 0;
			chunks.forEach(chunk => {
				bytes.set(chunk, offset);
				offset += chunk.length;
			});
			return bytes;
		}
	};
	target.writable = new WritableStream({
		write(chunk) {
			chunks.push(chunk);
		},
		close() {
			target.closed = true;
		}
	});
	return target;
}

function assertText(text, label) {
	if (text != TEXT_CONTENT) {
		throw new Error("unexpected content with " + label);
	}
}

function assertSize(size, label) {
	if (size != TEXT_CONTENT.length) {
		throw new Error("unexpected size with " + label);
	}
}

async function withTimeout(promise, label) {
	let timeoutId;
	const timeout = new Promise((_, reject) => timeoutId = setTimeout(() => reject(new Error("timed out with " + label)), TIMEOUT));
	try {
		return await Promise.race([promise, timeout]);
	} finally {
		clearTimeout(timeoutId);
	}
}
