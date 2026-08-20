// The first disk of a split zip file starts with the 4-byte spanning signature, so the first entry sits at
// offset 4 instead of 0. The ambiguity check behind the strictness "strict" read that as prepended data and
// rejected every split zip file, including the ones zip.js writes. The value, the length and the position of
// those bytes are defined by the format, and the offsets stored in the central directory already account for
// them, so no other parser can read the archive differently: they are neither an ambiguity nor prepended data.
// Any other 4 bytes in front of the first entry still are both.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "x".repeat(50000);
const ENTRY_COUNT = 8;
const DISK_SIZE = 100000;
const SPLIT_ZIP_SIGNATURE = new Uint8Array([0x50, 0x4b, 0x07, 0x08]);
const OTHER_PREFIX = new Uint8Array([0x4d, 0x4d, 0x4d, 0x4d]);

export { test };

async function test() {
	await readsASplitZipFileInStrictMode();
	await acceptsTheSpanningSignatureAsTheArchiveStart();
	await rejectsAnyOtherPrefix();
	await extractsAnyOtherPrefixAsPrependedData();
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

async function acceptsTheSpanningSignatureAsTheArchiveStart() {
	const data = await buildPrefixedZipFile(SPLIT_ZIP_SIGNATURE);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data),
		{ strictness: "strict", extractPrependedData: true });
	const entries = await zipReader.getEntries();
	const { prependedData } = zipReader;
	await zipReader.close();
	if (entries[0].offset != SPLIT_ZIP_SIGNATURE.length) {
		throw new Error("expected the entry at offset " + SPLIT_ZIP_SIGNATURE.length + ", got " + entries[0].offset);
	}
	if (prependedData.length) {
		throw new Error("expected no prepended data, got " + prependedData.length + " bytes");
	}
}

async function rejectsAnyOtherPrefix() {
	const data = await buildPrefixedZipFile(OTHER_PREFIX);
	let error;
	try {
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict" });
		await zipReader.getEntries();
		await zipReader.close();
	} catch (thrown) {
		error = thrown;
	}
	if (!error || error.message != zip.ERR_AMBIGUOUS_ARCHIVE || error.reason != "prepended data") {
		throw new Error("expected " + zip.ERR_AMBIGUOUS_ARCHIVE + " (prepended data), got " +
			(error ? error.message + " (" + error.reason + ")" : "no error"));
	}
}

async function extractsAnyOtherPrefixAsPrependedData() {
	const data = await buildPrefixedZipFile(OTHER_PREFIX);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { extractPrependedData: true });
	await zipReader.getEntries();
	const { prependedData } = zipReader;
	await zipReader.close();
	if (OTHER_PREFIX.some((byte, index) => prependedData[index] != byte) || prependedData.length != OTHER_PREFIX.length) {
		throw new Error("expected " + OTHER_PREFIX.length + " bytes of prepended data, got " + prependedData.length);
	}
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
