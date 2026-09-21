/* global ReadableStream, TextEncoder */

// A failing source rejects the export with its own error, unchanged. When the entry comes from an
// imported zip file, its data is read while the export initializes its readers, and the error of
// that read used to get a `cause` naming the entry in place of the cause it carried, e.g. the codec
// error behind ERR_INVALID_COMPRESSED_DATA or the failure of the reader of the zip file. The entry
// is now set on the error itself, with its id and its name, and the cause stays.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const ERROR_MESSAGE = "simulated stream error";
const ENTRY_NAME = "data.bin";
const ENTRY_SIZE = 100000;
const LOCAL_HEADER_SIZE = 30;

export { test };

async function test() {
	await sourceStreamFailure();
	await importedEntryFailureKeepsCause();
	await importedCorruptedEntryNamesEntry();
}

async function sourceStreamFailure() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const fs = new zip.ZipFS();
	fs.addText("good1.txt", TEXT_CONTENT);
	fs.addText("good2.txt", TEXT_CONTENT);
	fs.addReadable("bad.txt", new ReadableStream({
		start(controller) {
			controller.enqueue(new TextEncoder().encode(TEXT_CONTENT));
		},
		pull(controller) {
			controller.error(new Error(ERROR_MESSAGE));
		}
	}));
	try {
		await fs.exportBlob();
		throw new Error();
	} catch (error) {
		if (error.message != ERROR_MESSAGE) {
			throw error;
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function importedEntryFailureKeepsCause() {
	zip.configure({ useWebWorkers: false });
	const data = await createZip();
	const rootCause = new Error("disk failure");
	let armed = false;
	class FailingReader extends zip.Uint8ArrayReader {
		readUint8Array(index, length) {
			if (armed && index >= LOCAL_HEADER_SIZE) {
				throw new Error(ERROR_MESSAGE, { cause: rootCause });
			}
			return super.readUint8Array(index, length);
		}
	}
	const fs = new zip.ZipFS();
	await fs.importZip(new FailingReader(data));
	armed = true;
	const error = await captureError(() => fs.exportBlob());
	assertEntryError(error, "the failing reader");
	if (error.message != ERROR_MESSAGE) {
		throw error;
	}
	if (error.cause != rootCause) {
		throw new Error("the export replaced the cause of the error of the reader");
	}
}

async function importedCorruptedEntryNamesEntry() {
	zip.configure({ useWebWorkers: false });
	const data = await createZip();
	const dataView = new DataView(data.buffer);
	const start = LOCAL_HEADER_SIZE + dataView.getUint16(26, true) + dataView.getUint16(28, true) + 1024;
	for (let index = start; index < start + 64; index++) {
		data[index] ^= 0xff;
	}
	const fs = new zip.ZipFS();
	await fs.importUint8Array(data);
	const error = await captureError(() => fs.exportBlob({ readerOptions: { checkCrc32: true } }));
	assertEntryError(error, "the corrupted entry");
}

function assertEntryError(error, label) {
	if (!error) {
		throw new Error(label + ": the export did not fail");
	}
	if (!error.entry || error.entry.name != ENTRY_NAME) {
		throw new Error(label + ": the export error does not carry the entry, got " + (error.entry && error.entry.name));
	}
	if (error.entryId != error.entry.id) {
		throw new Error(label + ": the export error does not carry the id of the entry");
	}
	if (error.entryName != ENTRY_NAME) {
		throw new Error(label + ": the export error does not carry the name of the entry, got " + error.entryName);
	}
	if (error.cause && error.cause.entry) {
		throw new Error(label + ": the export replaced the cause of the error with the entry");
	}
}

async function createZip() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(ENTRY_NAME, new zip.Uint8ArrayReader(pattern(ENTRY_SIZE)), { level: 9 });
	return zipWriter.close();
}

async function captureError(operation) {
	try {
		await operation();
	} catch (error) {
		return error;
	}
}

function pattern(size) {
	const bytes = new Uint8Array(size);
	let state = 0x9e3779b9;
	for (let index = 0; index < size; index++) {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;
		bytes[index] = index % 7 ? 65 + (state & 15) : 10;
	}
	return bytes;
}
