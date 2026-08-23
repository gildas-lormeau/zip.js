/* global TextEncoder */

import * as zip from "../zip-lib.js";

export { test };

const MAX_ENTRIES_16_BITS = 65536;

// A producer which does not support Zip64 can write more than 65535 entries with a wrapped 16-bit
// entry count in the end of central directory record. The reader must keep reading central directory
// records past the declared count and accept the result when the total is congruent modulo 65536,
// like Go's archive/zip and 7-Zip. Records left over without congruence stay ignored, and the
// "strict" mode still rejects the archive as ambiguous.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await checkWrappedCount(MAX_ENTRIES_16_BITS + 2);
		await checkWrappedCount(MAX_ENTRIES_16_BITS);
		await checkNonCongruentCount();
		await checkStrictRejection();
	} finally {
		await zip.terminateWorkers();
	}
}

async function checkWrappedCount(entriesLength) {
	const entries = await readEntries(craftArchive(entriesLength));
	if (entries.length != entriesLength) {
		throw new Error("all the entries must be read despite the wrapped count, got " + entries.length + " of " + entriesLength);
	}
	if (entries[0].filename != entryFilename(0) || entries[entriesLength - 1].filename != entryFilename(entriesLength - 1)) {
		throw new Error("the recovered entries must be the written entries");
	}
}

async function checkNonCongruentCount() {
	const entries = await readEntries(craftArchive(3, 2));
	if (entries.length != 2) {
		throw new Error("a non-congruent count must not be recovered, got " + entries.length + " entries");
	}
}

async function checkStrictRejection() {
	try {
		await readEntries(craftArchive(MAX_ENTRIES_16_BITS + 2), { strictness: "strict" });
	} catch (error) {
		if (error.message.startsWith(zip.ERR_AMBIGUOUS_ARCHIVE)) {
			return;
		}
		throw error;
	}
	throw new Error("the strict mode must reject a wrapped entry count as ambiguous");
}

async function readEntries(bytes, options) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes), options);
	try {
		return await zipReader.getEntries();
	} finally {
		await zipReader.close();
	}
}

function entryFilename(indexEntry) {
	return indexEntry.toString(36).padStart(4, "0");
}

// build an archive of `entriesLength` empty STORE entries whose end of central directory record
// declares `declaredLength` entries (the wrapped 16-bit count by default)
function craftArchive(entriesLength, declaredLength = entriesLength % MAX_ENTRIES_16_BITS) {
	const encoder = new TextEncoder();
	const filenameLength = 4;
	const localHeaderLength = 30 + filenameLength;
	const centralHeaderLength = 46 + filenameLength;
	const centralDirectoryOffset = localHeaderLength * entriesLength;
	const centralDirectoryLength = centralHeaderLength * entriesLength;
	const out = new Uint8Array(centralDirectoryOffset + centralDirectoryLength + 22);
	const view = new DataView(out.buffer);
	for (let indexEntry = 0; indexEntry < entriesLength; indexEntry++) {
		const filenameBytes = encoder.encode(entryFilename(indexEntry));
		let offset = localHeaderLength * indexEntry;
		view.setUint32(offset, 0x04034b50, true);
		view.setUint16(offset + 4, 10, true);
		view.setUint16(offset + 26, filenameLength, true);
		out.set(filenameBytes, offset + 30);
		offset = centralDirectoryOffset + centralHeaderLength * indexEntry;
		view.setUint32(offset, 0x02014b50, true);
		view.setUint16(offset + 6, 10, true);
		view.setUint16(offset + 28, filenameLength, true);
		view.setUint32(offset + 42, localHeaderLength * indexEntry, true);
		out.set(filenameBytes, offset + 46);
	}
	const endOfDirectoryOffset = centralDirectoryOffset + centralDirectoryLength;
	view.setUint32(endOfDirectoryOffset, 0x06054b50, true);
	view.setUint16(endOfDirectoryOffset + 8, declaredLength, true);
	view.setUint16(endOfDirectoryOffset + 10, declaredLength, true);
	view.setUint32(endOfDirectoryOffset + 12, centralDirectoryLength, true);
	view.setUint32(endOfDirectoryOffset + 16, centralDirectoryOffset, true);
	return out;
}
