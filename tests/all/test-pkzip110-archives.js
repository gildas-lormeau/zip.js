/* global URL, fetch, TextDecoder */

import * as zip from "../zip-lib.js";

const COMPRESSION_METHOD_SHRINK = 1;
const COMPRESSION_METHOD_IMPLODE = 6;
const IMPLODE_LARGE_WINDOW_LITERAL_TREE = 0x0006;
const VERSION_MADE_BY_110 = 11;
const BIG_FIXTURE_REPETITIONS = 80;

export { test };

async function test() {
	let testOK = true;
	try {
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_SHRINK,
			format: "shrink",
			codecURI: new URL("../vendor/shrink-codec.js", import.meta.url).href
		});
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_IMPLODE,
			format: "implode",
			codecURI: new URL("../vendor/implode-codec.js", import.meta.url).href
		});
		const loremText = new TextDecoder().decode(await (await fetch(new URL("../data/lorem.txt", import.meta.url).href)).arrayBuffer());
		const bigText = loremText.repeat(BIG_FIXTURE_REPETITIONS);
		testOK = testOK && await testFixture("lorem-110-shrink.zip", COMPRESSION_METHOD_SHRINK, 0x0000, loremText);
		testOK = testOK && await testFixture("lorem-110-shrink-big.zip", COMPRESSION_METHOD_SHRINK, 0x0000, bigText);
		testOK = testOK && await testFixture("lorem-110-implode.zip", COMPRESSION_METHOD_IMPLODE, 0x0000, loremText);
		testOK = testOK && await testFixture("lorem-110-implode-big.zip", COMPRESSION_METHOD_IMPLODE, IMPLODE_LARGE_WINDOW_LITERAL_TREE, bigText);
		testOK = testOK && await testSelfExtracting(loremText);
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_SHRINK);
		zip.unregisterCodec(COMPRESSION_METHOD_IMPLODE);
		await zip.terminateWorkers();
	}
	if (!testOK) {
		throw new Error();
	}
}

function getReader(name, options) {
	const url = new URL(`./../data/${name}`, import.meta.url).href;
	return new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }), options);
}

async function testFixture(name, compressionMethod, bitFlag, expectedText) {
	const zipReader = getReader(name);
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter());
	await zipReader.close();
	return entry.compressionMethod == compressionMethod && entry.rawBitFlag == bitFlag &&
		entry.versionMadeBy == VERSION_MADE_BY_110 && text == expectedText;
}

async function testSelfExtracting(expectedText) {
	const zipReader = getReader("lorem-110-sfx.exe", { extractPrependedData: true });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter());
	await zipReader.close();
	return zipReader.prependedData.length == 12022 &&
		entry.compressionMethod == COMPRESSION_METHOD_IMPLODE && text == expectedText;
}
