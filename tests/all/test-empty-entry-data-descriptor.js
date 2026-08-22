/* global TransformStream */

// A data descriptor carries the CRC-32 and the sizes when they are unknown while the local header is
// written. For a folder or an empty entry stored without compression or encryption, all three values are
// known to be zero in advance, so the descriptor is skipped by default (Info-ZIP and 7-Zip do the same)
// unless the dataDescriptor option is set explicitly. These entries also keep taking the direct write
// path: skipping the descriptor must not make them allocate a temp stream like other descriptor-less
// entries do.

import * as zip from "../zip-lib.js";

const DATA_DESCRIPTOR_SIGNATURE = 0x08074b50;
const BITFLAG_DATA_DESCRIPTOR = 0x8;
const LAST_MOD_DATE = new Date(2026, 0, 1, 12, 0, 0);

export { test };

async function test() {
	await skipsTheDataDescriptorForKnownEmptyEntries();
	await keepsTheDataDescriptorElsewhere();
	await keepsTheDirectWritePath();
	await zip.terminateWorkers();
}

async function skipsTheDataDescriptorForKnownEmptyEntries() {
	await checkDataDescriptor("folder", false, writer =>
		writer.add("folder/", null, { lastModDate: LAST_MOD_DATE, directory: true }));
	await checkDataDescriptor("empty stored entry", false, writer =>
		writer.add("empty.txt", new zip.TextReader(""), { lastModDate: LAST_MOD_DATE, level: 0 }));
	await checkDataDescriptor("entry without reader", false, writer =>
		writer.add("empty.txt", null, { lastModDate: LAST_MOD_DATE }));
}

async function keepsTheDataDescriptorElsewhere() {
	await checkDataDescriptor("folder with an explicit descriptor", true, writer =>
		writer.add("folder/", null, { lastModDate: LAST_MOD_DATE, directory: true, dataDescriptor: true }));
	await checkDataDescriptor("empty compressed entry", true, writer =>
		writer.add("empty.txt", new zip.TextReader(""), { lastModDate: LAST_MOD_DATE }));
	await checkDataDescriptor("empty encrypted entry", true, writer =>
		writer.add("empty.txt", new zip.TextReader(""), { lastModDate: LAST_MOD_DATE, level: 0, password: "password" }));
	await checkDataDescriptor("stored entry with content", true, writer =>
		writer.add("entry.txt", new zip.TextReader("content"), { lastModDate: LAST_MOD_DATE, level: 0 }));
}

async function keepsTheDirectWritePath() {
	let tempStreamCreated = false;
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), {
		createTempStream: () => {
			tempStreamCreated = true;
			return new TransformStream();
		}
	});
	await zipWriter.add("folder/", null, { lastModDate: LAST_MOD_DATE, directory: true });
	await zipWriter.add("empty.txt", new zip.TextReader(""), { lastModDate: LAST_MOD_DATE, level: 0 });
	await zipWriter.close();
	if (tempStreamCreated) {
		throw new Error("expected known-empty entries to be written directly, a temp stream was created");
	}
}

async function checkDataDescriptor(description, expectedDataDescriptor, addEntry) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter);
	const data = await zipWriter.close();
	const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
	const bitFlag = dataView.getUint16(6, true);
	let dataDescriptorFound = false;
	for (let offset = 0; offset < data.length - 4 && !dataDescriptorFound; offset++) {
		dataDescriptorFound = dataView.getUint32(offset, true) == DATA_DESCRIPTOR_SIGNATURE;
	}
	const dataDescriptorBit = Boolean(bitFlag & BITFLAG_DATA_DESCRIPTOR);
	if (dataDescriptorBit != expectedDataDescriptor || dataDescriptorFound != expectedDataDescriptor) {
		throw new Error("expected " + description + " to be written with" + (expectedDataDescriptor ? "" : "out") +
			" a data descriptor, got bit 3: " + dataDescriptorBit + " and record: " + dataDescriptorFound);
	}
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict", checkCrc32: true, password: "password" });
	const entries = await zipReader.getEntries();
	await zipReader.close();
	if (entries.length != 1) {
		throw new Error("expected " + description + " to stay readable, got " + entries.length + " entries");
	}
}
