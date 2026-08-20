/* global TextEncoder */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, héllo wörld, consectetuer adipiscing elit.";
const FILENAME = "lorem.txt";
const LATIN1_ENCODING = "iso-8859-1";
const CP437_ENCODING = "cp437";
const CP437_BYTES = new Uint8Array([0xC9, 0xCD, 0xBB, 0x20, 0x80, 0x81, 0x82, 0x20, 0xF7, 0xFB]);
const CP437_TEXT = "╔═╗ Çüé ≈√";
const UTF8_BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const latin1Content = Uint8Array.from(TEXT_CONTENT, character => character.charCodeAt(0));
	const utf8Content = new TextEncoder().encode(TEXT_CONTENT);
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter());
	await zipWriter.add("latin1.txt", new zip.Uint8ArrayReader(latin1Content));
	await zipWriter.add("cp437.txt", new zip.Uint8ArrayReader(CP437_BYTES));
	await zipWriter.add(FILENAME, new zip.Uint8ArrayReader(concat(UTF8_BOM, utf8Content)));
	const blob = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
	const entries = await zipReader.getEntries();
	const latin1Entry = entries.find(entry => entry.filename == "latin1.txt");
	const cp437Entry = entries.find(entry => entry.filename == "cp437.txt");
	const bomEntry = entries.find(entry => entry.filename == FILENAME);
	const latin1 = await latin1Entry.getData(new zip.TextWriter(LATIN1_ENCODING));
	const latin1AsUtf8 = await latin1Entry.getData(new zip.TextWriter());
	const cp437 = await cp437Entry.getData(new zip.TextWriter(CP437_ENCODING));
	// "utf8" is a valid encoding label but not the spelling the fast path recognizes, so it decodes
	// through the same branch as any other named encoding
	const bomStrippedByEncoding = await bomEntry.getData(new zip.TextWriter("utf8"));
	const bomStrippedByDefault = await bomEntry.getData(new zip.TextWriter());
	await zipReader.close();
	await zip.terminateWorkers();
	check(latin1, TEXT_CONTENT, "iso-8859-1 content");
	check(cp437, CP437_TEXT, "cp437 content");
	// the byte order mark must not reach the caller, whichever branch decodes the data
	check(bomStrippedByEncoding, TEXT_CONTENT, "byte order mark removed when an encoding is given");
	check(bomStrippedByDefault, TEXT_CONTENT, "byte order mark removed by default");
	if (latin1AsUtf8 == TEXT_CONTENT) {
		throw new Error("the utf-8 reading must differ, otherwise the encoding is never exercised");
	}
}

function check(value, expectedValue, label) {
	if (value != expectedValue) {
		throw new Error(`${label}: expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(value)}`);
	}
}

function concat(...arrays) {
	const result = new Uint8Array(arrays.reduce((size, array) => size + array.length, 0));
	let offset = 0;
	arrays.forEach(array => {
		result.set(array, offset);
		offset += array.length;
	});
	return result;
}
