/* global URL, fetch */

import * as zip from "../zip-lib.js";

const FIXTURE_URL = new URL("./../data/lorem-7z-zipcrypto.zip", import.meta.url).href;
const PASSWORD = "password";
const TEXT_CONTENT_PREFIX = "Lorem ipsum dolor sit amet";

export { test };

// The ZipCrypto encryption header embeds a check byte derived from the DOS time when the entry has a
// data descriptor, and from the CRC-32 otherwise. Entries copied with passThrough keep that header
// verbatim, so the copy must keep the data descriptor state and the raw DOS date of the source, and
// a date override changing the time must be rejected instead of producing an undecryptable entry.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await checkNoDescriptorCopy();
		await checkLastModDateOverride();
	} finally {
		await zip.terminateWorkers();
	}
}

async function checkNoDescriptorCopy() {
	const fixture = new Uint8Array(await (await fetch(FIXTURE_URL)).arrayBuffer());
	await checkContent(fixture);
	const [sourceEntry] = await readEntries(fixture);
	if (sourceEntry.bitFlag.dataDescriptor) {
		throw new Error("the fixture must not use a data descriptor");
	}
	const copy = await copyPassThrough(fixture);
	const [copiedEntry] = await readEntries(copy);
	if (copiedEntry.bitFlag.dataDescriptor) {
		throw new Error("the copied entry must keep the absence of data descriptor");
	}
	if (copiedEntry.rawLastModDate != sourceEntry.rawLastModDate) {
		throw new Error("the copied entry must keep the raw date of the source entry");
	}
	await checkContent(copy);
}

async function checkLastModDateOverride() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("lorem.txt", new zip.TextReader(TEXT_CONTENT_PREFIX),
		{ password: PASSWORD, zipCrypto: true, lastModDate: new Date(2020, 0, 1, 13, 47, 20) });
	const data = await zipWriter.close();
	await checkContent(await copyPassThrough(data));
	const sameTimeOfDay = await copyPassThrough(data, new Date(2024, 5, 5, 13, 47, 20));
	await checkContent(sameTimeOfDay);
	const [copiedEntry] = await readEntries(sameTimeOfDay);
	if (copiedEntry.lastModDate.getFullYear() != 2024) {
		throw new Error("a date change keeping the time of day must be written");
	}
	try {
		await copyPassThrough(data, new Date(2024, 5, 5, 4, 12, 8));
	} catch (error) {
		if (error.message == zip.ERR_ZIP_CRYPTO_LAST_MOD_DATE) {
			return;
		}
		throw error;
	}
	throw new Error("changing the time of a zipCrypto entry copied with passThrough must throw");
}

async function copyPassThrough(data, lastModDate) {
	const zipFs = new zip.ZipFS();
	await zipFs.importUint8Array(data);
	if (lastModDate) {
		const [entry] = zipFs.root.children;
		entry.setOptions({ lastModDate });
	}
	return zipFs.exportUint8Array({ readerOptions: { passThrough: true } });
}

async function readEntries(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	try {
		return await zipReader.getEntries();
	} finally {
		await zipReader.close();
	}
}

async function checkContent(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter(), { password: PASSWORD });
	await zipReader.close();
	if (!text.startsWith(TEXT_CONTENT_PREFIX)) {
		throw new Error("the entry must decrypt with the original password");
	}
}
