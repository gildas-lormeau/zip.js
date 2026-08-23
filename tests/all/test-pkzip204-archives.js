/* global fetch, URL */

import * as zip from "../zip-lib.js";

const LOREM_PREFIX = "Lorem ipsum";
const VOLUME_LABEL_ATTRIBUTE = 0x08;
const SPANNING_SIGNATURE = 0x08074b50;

export { test };

async function test() {
	let testOK = true;
	testOK = testOK && await testCompressionLevel("lorem-204-max.zip", 0x0002);
	testOK = testOK && await testCompressionLevel("lorem-204-fast.zip", 0x0004);
	testOK = testOK && await testCompressionLevel("lorem-204-superfast.zip", 0x0006);
	testOK = testOK && await testVolumeLabel();
	testOK = testOK && await testSelfExtracting("lorem-204-sfx.exe", 15349);
	testOK = testOK && await testSelfExtracting("lorem-204-sfx-junior.exe", 3002);
	testOK = testOK && await testSpanned();
	testOK = testOK && await testAttributes();
	testOK = testOK && await testComments();
	await zip.terminateWorkers();
	if (!testOK) {
		throw new Error();
	}
}

function getReader(name, options) {
	const url = new URL(`./../data/${name}`, import.meta.url).href;
	return new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }), options);
}

async function testCompressionLevel(name, expectedBitFlag) {
	const [entry] = await getReader(name).getEntries();
	const text = await entry.getData(new zip.TextWriter());
	return entry.compressionMethod == 8 && entry.rawBitFlag == expectedBitFlag && text.startsWith(LOREM_PREFIX);
}

async function testVolumeLabel() {
	const [loremEntry, labelEntry] = await getReader("lorem-204-label.zip").getEntries();
	const text = await loremEntry.getData(new zip.TextWriter());
	return labelEntry.filename == "LOREMVOL" && !labelEntry.directory &&
		(labelEntry.externalFileAttributes & VOLUME_LABEL_ATTRIBUTE) == VOLUME_LABEL_ATTRIBUTE &&
		labelEntry.uncompressedSize == 0 && labelEntry.rawLastModDate == 0 &&
		labelEntry.lastModDate.getTime() == new Date(1980, 0, 1).getTime() &&
		text.startsWith(LOREM_PREFIX);
}

async function testSelfExtracting(name, expectedPrependedDataLength) {
	const zipReader = getReader(name, { extractPrependedData: true });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter());
	return zipReader.prependedData.length == expectedPrependedDataLength && text.startsWith(LOREM_PREFIX);
}

async function testAttributes() {
	const expectedAttributes = new Map([
		["HIDDEN.TXT", 0x22],
		["SYSTEM.TXT", 0x24],
		["RDONLY.TXT", 0x21],
		["PLAIN.TXT", 0x20]
	]);
	const entries = await getReader("lorem-204-attributes.zip").getEntries();
	const text = await entries[0].getData(new zip.TextWriter());
	return entries.length == expectedAttributes.size && text.startsWith(LOREM_PREFIX) &&
		entries.every(entry => entry.externalFileAttributes == expectedAttributes.get(entry.filename));
}

async function testComments() {
	const zipReader = getReader("lorem-204-comments.zip", { commentEncoding: "cp437" });
	const [entry] = await zipReader.getEntries();
	const globalComment = zipReader.comment;
	return entry.comment == "Comentario: Café ñoño ▓▒░" && entry.rawComment.length == 25 &&
		globalComment.length == 36 && globalComment.includes(0xa0) && globalComment.includes(0xb0);
}

async function testSpanned() {
	const urls = ["random-204-span.z01", "random-204-span.zip"]
		.map(name => new URL(`./../data/${name}`, import.meta.url).href);
	const readers = urls.map(url => new zip.HttpReader(url, { preventHeadRequest: true }));
	const zipReader = new zip.ZipReader(new zip.SplitDataReader(readers));
	const [entry] = await zipReader.getEntries();
	const data = await entry.getData(new zip.Uint8ArrayWriter());
	const firstSegment = new Uint8Array(await (await fetch(urls[0])).arrayBuffer());
	const signature = new DataView(firstSegment.buffer).getUint32(0, true);
	await zipReader.close();
	return signature == SPANNING_SIGNATURE && entry.filename == "BIG.BIN" &&
		entry.compressionMethod == 0 && data.length == 200000;
}
