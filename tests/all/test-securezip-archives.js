/* global URL */

import * as zip from "../zip-lib.js";

const PASSWORD = "lorem.txt";
const LOREM_PREFIX = "Lorem ipsum";

export { test };

async function test() {
	let testOK = true;
	testOK = testOK && await testText("lorem-204.zip", "LOREM.TXT");
	testOK = testOK && await testText("lorem-utf8.zip", "lorem.txt");
	testOK = testOK && await testText("lorem-non-ascii.zip", "lorém.txt");
	testOK = testOK && await testDeflate64();
	testOK = testOK && await testError("lorem-bzip2.zip", {}, zip.ERR_UNSUPPORTED_COMPRESSION);
	testOK = testOK && await testError("lorem-lzma.zip", {}, zip.ERR_UNSUPPORTED_COMPRESSION);
	testOK = testOK && await testSigned();
	testOK = testOK && await testError("lorem-secure.zip", { password: PASSWORD }, zip.ERR_UNSUPPORTED_ENCRYPTION);
	testOK = testOK && await testText("lorem-secure-traditional-full.zip", "lorem.txt", { password: PASSWORD });
	await zip.terminateWorkers();
	if (!testOK) {
		throw new Error();
	}
}

async function getFirstEntry(name) {
	const url = new URL(`./../data/${name}`, import.meta.url).href;
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }));
	const entries = await zipReader.getEntries();
	return entries[0];
}

async function testText(name, filename, options = {}) {
	const entry = await getFirstEntry(name);
	const text = await entry.getData(new zip.TextWriter(), options);
	return entry.filename == filename && text.startsWith(LOREM_PREFIX);
}

async function testDeflate64() {
	const entry = await getFirstEntry("lorem-securezip-deflate64.zip");
	const text = await entry.getData(new zip.TextWriter());
	return entry.compressionMethod == 9 && text.startsWith(LOREM_PREFIX);
}

async function testError(name, options, expectedMessage) {
	const entry = await getFirstEntry(name);
	try {
		await entry.getData(new zip.TextWriter(), options);
	} catch (error) {
		return error.message == expectedMessage;
	}
	return false;
}

async function testSigned() {
	const entry = await getFirstEntry("lorem-signed.zip");
	const text = await entry.getData(new zip.TextWriter());
	return entry.extraField.has(0x0014) && entry.extraField.has(0x0016) && text.startsWith(LOREM_PREFIX);
}
