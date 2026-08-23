/* global URL */

import * as zip from "../zip-lib.js";

const LOREM_PREFIX = "Lorem ipsum";
const VOLUME_LABEL_ATTRIBUTE = 0x08;

export { test };

async function test() {
	let testOK = true;
	testOK = testOK && await testCompressionLevel("lorem-204-max.zip", 0x0002);
	testOK = testOK && await testCompressionLevel("lorem-204-fast.zip", 0x0004);
	testOK = testOK && await testCompressionLevel("lorem-204-superfast.zip", 0x0006);
	testOK = testOK && await testVolumeLabel();
	testOK = testOK && await testSelfExtracting("lorem-204-sfx.exe", 15349);
	testOK = testOK && await testSelfExtracting("lorem-204-sfx-junior.exe", 3002);
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
		text.startsWith(LOREM_PREFIX);
}

async function testSelfExtracting(name, expectedPrependedDataLength) {
	const zipReader = getReader(name, { extractPrependedData: true });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter());
	return zipReader.prependedData.length == expectedPrependedDataLength && text.startsWith(LOREM_PREFIX);
}
