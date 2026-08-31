/* global TextEncoder */

import * as zip from "../zip-lib.js";
import { decodeCP437 } from "../../lib/core/util/decode-cp437.js";

// The CP437 table is a 256-entry string literal decoding the names of the entries not marked as
// UTF-8. A missing or extra entry shifts every following character. The table used to carry a
// runtime check of its own length, useless once the table became unable to lose or gain entries,
// i.e. once it was written with escape sequences, so the invariant is verified here instead.
// The expected values are written with escape sequences, so that they cannot be corrupted by the
// charset this file itself is parsed with. The characters past ASCII are the ones libiconv decodes
// CP437 into. The control range holds the IBM graphic characters instead, which is the convention
// of the DOS tools writing these names, where libiconv keeps the control characters themselves.
const CONTROL_RANGE = "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\u00B6\u00A7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC";
const CHARACTERS_PAST_ASCII = "\u00C7\u00FC\u00E9\u00E2\u00E4\u00E0\u00E5\u00E7\u00EA\u00EB\u00E8\u00EF\u00EE\u00EC\u00C4\u00C5\u00C9\u00E6\u00C6\u00F4\u00F6\u00F2\u00FB\u00F9\u00FF\u00D6\u00DC\u00A2\u00A3\u00A5\u20A7\u0192\u00E1\u00ED\u00F3\u00FA\u00F1\u00D1\u00AA\u00BA\u00BF\u2310\u00AC\u00BD\u00BC\u00A1\u00AB\u00BB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\u00DF\u0393\u03C0\u03A3\u03C3\u00B5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\u00B1\u2265\u2264\u2320\u2321\u00F7\u2248\u00B0\u2219\u00B7\u221A\u207F\u00B2\u25A0\u00A0";
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
