import * as zip from "../zip-lib.js";

const VERSION_STORE = 10;
const VERSION_DEFLATE = 20;
const VERSION_ZIP64 = 45;
const VERSION_AES = 51;
const TEXT_CONTENT = "Lorem ipsum dolor sit amet";

export { test };

async function test() {
	let testOK = true;
	testOK = testOK && await testVersion(VERSION_STORE, { level: 0 });
	testOK = testOK && await testVersion(VERSION_DEFLATE, {});
	testOK = testOK && await testVersion(VERSION_DEFLATE, { level: 0, password: "password", zipCrypto: true });
	testOK = testOK && await testVersion(VERSION_ZIP64, { level: 0, zip64: true });
	testOK = testOK && await testVersion(VERSION_AES, { level: 0, password: "password" });
	testOK = testOK && await testVersion(VERSION_STORE + 1, { level: 0, version: VERSION_STORE + 1 });
	testOK = testOK && await testDirectoryVersion();
	await zip.terminateWorkers();
	if (!testOK) {
		throw new Error();
	}
}

async function testVersion(expectedVersion, options) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("entry.txt", new zip.TextReader(TEXT_CONTENT), options);
	const data = await zipWriter.close();
	const [entry] = await new zip.ZipReader(new zip.Uint8ArrayReader(data), { password: "password" }).getEntries();
	return entry.version == expectedVersion;
}

async function testDirectoryVersion() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("directory/", undefined, { directory: true });
	const data = await zipWriter.close();
	const [entry] = await new zip.ZipReader(new zip.Uint8ArrayReader(data)).getEntries();
	return entry.version == VERSION_DEFLATE;
}
