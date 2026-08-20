// The first disk of a split zip file starts with the 4-byte spanning signature, so the first entry sits at
// offset 4 instead of 0. The ambiguity check behind the strictness "strict" read that as prepended data and
// rejected every split zip file, including the ones zip.js writes. The value, the length and the position of
// those bytes are defined by the format, and the offsets stored in the central directory already account for
// them, so no other parser can read the archive differently: they are neither an ambiguity nor prepended data.
// A splitting process that ends up needing a single segment writes the temporary spanning marker instead
// (APPNOTE 8.5.4), which is the same 4 bytes at the same place and means the same thing to a reader.
// Any other 4 bytes in front of the first entry still are both an ambiguity and prepended data.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "x".repeat(50000);
const ENTRY_COUNT = 8;
const DISK_SIZE = 100000;
const SPLIT_ZIP_SIGNATURE = new Uint8Array([0x50, 0x4b, 0x07, 0x08]);
const TEMPORARY_SPLIT_ZIP_SIGNATURE = new Uint8Array([0x50, 0x4b, 0x30, 0x30]);
const OTHER_PREFIXES = [
	new Uint8Array([0x4d, 0x4d, 0x4d, 0x4d]),
	new Uint8Array([0x50, 0x4b, 0x07, 0x09]),
	new Uint8Array([0x50, 0x4b, 0x30, 0x31])
];

export { test };

async function test() {
	await readsASplitZipFileInStrictMode();
	await acceptsTheMarkerAsTheArchiveStart(SPLIT_ZIP_SIGNATURE, "the spanning signature");
	await acceptsTheMarkerAsTheArchiveStart(TEMPORARY_SPLIT_ZIP_SIGNATURE, "the temporary spanning marker");
	for (const prefix of OTHER_PREFIXES) {
		await rejectsAnyOtherPrefix(prefix);
		await extractsAnyOtherPrefixAsPrependedData(prefix);
	}
	await zip.terminateWorkers();
}

async function readsASplitZipFileInStrictMode() {
	const disks = await buildSplitZipFile();
	if (disks.length < 3) {
		throw new Error("expected the archive to be split into several disks, got " + disks.length);
	}
	if (SPLIT_ZIP_SIGNATURE.some((byte, index) => disks[0][index] != byte)) {
		throw new Error("expected the first disk to start with the spanning signature");
	}
	const zipReader = new zip.ZipReader(disks.map(disk => new zip.Uint8ArrayReader(disk)),
		{ strictness: "strict", extractPrependedData: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	const { prependedData } = zipReader;
	await zipReader.close();
	if (entries.length != ENTRY_COUNT) {
		throw new Error("expected " + ENTRY_COUNT + " entries, got " + entries.length);
	}
	if (contents.some(content => content != TEXT_CONTENT)) {
		throw new Error("unexpected entry content");
	}
	if (prependedData.length) {
		throw new Error("expected the spanning signature not to be reported as prepended data, got " +
			prependedData.length + " bytes");
	}
}

async function acceptsTheMarkerAsTheArchiveStart(marker, description) {
	const data = await buildPrefixedZipFile(marker);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data),
		{ strictness: "strict", extractPrependedData: true });
	const entries = await zipReader.getEntries();
	const { prependedData } = zipReader;
	await zipReader.close();
	if (entries[0].offset != marker.length) {
		throw new Error("expected the entry after " + description + " at offset " + marker.length +
			", got " + entries[0].offset);
	}
	if (prependedData.length) {
		throw new Error("expected " + description + " not to be reported as prepended data, got " +
			prependedData.length + " bytes");
	}
}

async function rejectsAnyOtherPrefix(prefix) {
	const data = await buildPrefixedZipFile(prefix);
	let error;
	try {
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict" });
		await zipReader.getEntries();
		await zipReader.close();
	} catch (thrown) {
		error = thrown;
	}
	if (!error || error.message != zip.ERR_AMBIGUOUS_ARCHIVE || error.reason != "prepended data") {
		throw new Error("expected " + zip.ERR_AMBIGUOUS_ARCHIVE + " (prepended data) for the prefix " +
			getHexadecimalValue(prefix) + ", got " + (error ? error.message + " (" + error.reason + ")" : "no error"));
	}
}

async function extractsAnyOtherPrefixAsPrependedData(prefix) {
	const data = await buildPrefixedZipFile(prefix);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { extractPrependedData: true });
	await zipReader.getEntries();
	const { prependedData } = zipReader;
	await zipReader.close();
	if (prefix.some((byte, index) => prependedData[index] != byte) || prependedData.length != prefix.length) {
		throw new Error("expected " + prefix.length + " bytes of prepended data for the prefix " +
			getHexadecimalValue(prefix) + ", got " + prependedData.length);
	}
}

function getHexadecimalValue(prefix) {
	return Array.from(prefix).map(byte => byte.toString(16).padStart(2, "0")).join(" ");
}

async function buildSplitZipFile() {
	const diskWriters = [];
	const zipWriter = new zip.ZipWriter(nextDiskWriter(diskWriters));
	for (let index = 0; index < ENTRY_COUNT; index++) {
		await zipWriter.add("entry-" + index + ".txt", new zip.TextReader(TEXT_CONTENT), { level: 0 });
	}
	await zipWriter.close();
	return Promise.all(diskWriters.map(diskWriter => diskWriter.getData()));
}

async function* nextDiskWriter(diskWriters) {
	for (; ;) {
		const diskWriter = new zip.Uint8ArrayWriter();
		diskWriter.maxSize = DISK_SIZE;
		diskWriters.push(diskWriter);
		yield diskWriter;
	}
}

async function buildPrefixedZipFile(prefix) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { offset: prefix.length });
	await zipWriter.add("entry.txt", new zip.TextReader(TEXT_CONTENT));
	const data = await zipWriter.close();
	const prefixedData = new Uint8Array(prefix.length + data.length);
	prefixedData.set(prefix);
	prefixedData.set(data, prefix.length);
	return prefixedData;
}
