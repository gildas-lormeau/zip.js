/* global TextEncoder */

import * as zip from "../zip-lib.js";
import { decodeCP437 } from "../../lib/core/util/decode-cp437.js";

// The CP437 table is a 256-entry string literal decoding the names of the entries not marked as
// UTF-8. A missing or extra entry shifts every following character. The table used to carry a
// runtime check of its own length, useless once the table became unable to lose or gain entries,
// i.e. once it was written with escape sequences, so the invariant is verified here instead.
// The characters past ASCII are the ones libiconv decodes CP437 into. The control range holds the
// IBM graphic characters instead, which is the convention of the DOS tools writing these names,
// where libiconv keeps the control characters themselves.
const CONTROL_RANGE = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼";
const CHARACTERS_PAST_ASCII = "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ";
const BYTES_PAST_ASCII = new Uint8Array(Array.from({ length: 128 }, (_, indexByte) => 0x80 + indexByte));
const PLACEHOLDER_FILENAME = "P".repeat(BYTES_PAST_ASCII.length);

export { test };

async function test() {
	checkTable();
	await checkArchive();
}

function checkTable() {
	const allBytes = new Uint8Array(Array.from({ length: 256 }, (_, indexByte) => indexByte));
	const decoded = decodeCP437(allBytes);
	if (decoded.includes("undefined")) {
		throw new Error("the table holds less than 256 entries, a byte decodes to an undefined entry");
	}
	if (decoded.length != 256) {
		throw new Error(`the table must hold 256 entries, it decodes 256 bytes into ${decoded.length} characters`);
	}
	check(decoded.slice(0, CONTROL_RANGE.length), CONTROL_RANGE, "the control range");
	for (let byteValue = 0x20; byteValue < 0x7F; byteValue++) {
		check(decoded[byteValue], String.fromCharCode(byteValue), `the printable ASCII character ${byteValue}`);
	}
	check(decoded.slice(0x80), CHARACTERS_PAST_ASCII, "the characters past ASCII");
}

async function checkArchive() {
	// the writer encodes the names it is given, so the name is written as ASCII and patched with the
	// raw bytes afterwards, in the local file header and in the central directory
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { useUnicodeFileNames: false });
	await zipWriter.add(PLACEHOLDER_FILENAME, new zip.TextReader("data"));
	const data = await zipWriter.close();
	const patchedCount = patchFilename(data, new TextEncoder().encode(PLACEHOLDER_FILENAME), BYTES_PAST_ASCII);
	if (patchedCount != 2) {
		throw new Error(`the name must be patched in the local file header and in the central directory, ${patchedCount} occurrence(s) found`);
	}
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = await zipReader.getEntries();
	const warnings = zipReader.warnings.map(({ reason }) => reason);
	await zipReader.close();
	check(entries[0].filename, CHARACTERS_PAST_ASCII, "the name of the entry read back");
	if (warnings.length) {
		throw new Error(`reading a name holding every character past ASCII must not warn, got ${warnings.join(", ")}`);
	}
}

function patchFilename(data, placeholderBytes, rawFilename) {
	let patchedCount = 0;
	for (let offset = 0; offset <= data.length - placeholderBytes.length; offset++) {
		if (placeholderBytes.every((byteValue, indexByte) => data[offset + indexByte] == byteValue)) {
			data.set(rawFilename, offset);
			offset += placeholderBytes.length - 1;
			patchedCount++;
		}
	}
	return patchedCount;
}

function check(value, expectedValue, label) {
	if (value != expectedValue) {
		throw new Error(`${label}: expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(value)}`);
	}
}
