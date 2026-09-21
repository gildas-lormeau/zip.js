/* global DecompressionStream */

// Checks the gzip route of the inflate side: with the CRC check on, a codec that requires the module
// or the native codec is opened as gzip and the trailer built from the entry's declared CRC-32 and
// size makes the inflater verify both. The inflater rejects the trailer as a whole, so a corrupted
// CRC-32 and a declared size larger than the data both fail with ERR_INVALID_CRC32, while a declared
// size smaller than the data fails with ERR_INVALID_UNCOMPRESSED_SIZE, counted by zip.js before the
// trailer is reached; with the check off the entry is read raw and a corrupted CRC-32 is not looked
// at. The spy that stands for the wasm codec declares the module flag the way a user class would;
// the raw deflate half runs only where the native codec takes "deflate-raw".

import * as zip from "../zip-lib.js";

const PASSWORD = "password";
const TEXT = generateText(4000);
const ENTRIES = [
	["level5.txt", TEXT, { level: 5 }],
	["empty.txt", "", { level: 5 }],
	["zipcrypto.txt", TEXT, { level: 5, password: PASSWORD, zipCrypto: true }],
	["aes.txt", TEXT, { level: 5, password: PASSWORD }]
];
const CENTRAL_HEADER_SIGNATURE = [0x50, 0x4b, 0x01, 0x02];
const CENTRAL_HEADER_CRC32_OFFSET = 16;
const CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET = 24;

export { test };

async function test() {
	try {
		await zip.terminateWorkers();
		zip.configure({ useWebWorkers: false, useCompressionStream: false });
		const data = await writeEntries();
		await readEntries(data);
		await checkCorruptedEntries(data, false);
		const corruptedCrcData = patchFirstCentralHeader(data, CENTRAL_HEADER_CRC32_OFFSET, 0xdeadbeef);
		const [corruptedEntry] = await getEntries(corruptedCrcData);
		const text = await corruptedEntry.getData(new zip.TextWriter(), { checkCrc32: false });
		if (text != TEXT) {
			throw new Error("unexpected content with the check off");
		}
		zip.resetConfiguration();
		zip.configure({ useWebWorkers: false });
		await readEntries(data);
		await checkCorruptedEntries(data, true);
		const formats = [];
		class SpyFallback {
			constructor(format, options) {
				formats.push(format);
				return new DecompressionStream(format, options);
			}
		}
		class ModuleFallback extends SpyFallback { }
		ModuleFallback.requiresModule = true;
		zip.configure({ useCompressionStream: false, DecompressionStreamFallback: ModuleFallback });
		await readEntries(data, [ENTRIES[0]], { checkCrc32: true });
		const expectedFormats = ["gzip"];
		if (supportsNativeDeflateRaw()) {
			await readEntries(data, [ENTRIES[0]], { checkCrc32: false });
			zip.configure({ DecompressionStreamFallback: SpyFallback });
			await readEntries(data, [ENTRIES[0]], { checkCrc32: true });
			expectedFormats.push("deflate-raw", "deflate-raw");
		}
		if (formats.join() != expectedFormats.join()) {
			throw new Error("expected the gzip route with the check on for the module codec only, got " + formats.join());
		}
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function checkCorruptedEntries(data, useCompressionStream) {
	const label = useCompressionStream ? "native" : "wasm";
	const corruptedCrcData = patchFirstCentralHeader(data, CENTRAL_HEADER_CRC32_OFFSET, 0xdeadbeef);
	let [entry] = await getEntries(corruptedCrcData);
	await expectError(entry, { checkCrc32: true }, zip.ERR_INVALID_CRC32, label + ", a corrupted crc32");
	const shrunkSizeData = patchFirstCentralHeader(data, CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, entry.uncompressedSize - 1);
	[entry] = await getEntries(shrunkSizeData);
	await expectError(entry, { checkCrc32: true }, zip.ERR_INVALID_UNCOMPRESSED_SIZE, label + ", a shrunk uncompressed size");
	const grownSizeData = patchFirstCentralHeader(data, CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, entry.uncompressedSize + 1000);
	[entry] = await getEntries(grownSizeData);
	await expectError(entry, { checkCrc32: true }, zip.ERR_INVALID_CRC32, label + ", a grown uncompressed size");
}

function supportsNativeDeflateRaw() {
	try {
		return Boolean(new DecompressionStream("deflate-raw"));
	} catch {
		return false;
	}
}

async function writeEntries() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (const [name, content, options] of ENTRIES) {
		await zipWriter.add(name, new zip.TextReader(content), options);
	}
	return zipWriter.close();
}

async function getEntries(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	return entries;
}

async function readEntries(data, entriesToRead = ENTRIES, options = { checkCrc32: true }) {
	const entries = await getEntries(data);
	for (const [name, content] of entriesToRead) {
		const entry = entries.find(entry => entry.filename == name);
		const text = await entry.getData(new zip.TextWriter(), Object.assign({ password: PASSWORD }, options));
		if (text != content) {
			throw new Error("unexpected content in " + name);
		}
	}
}

async function expectError(entry, options, message, label) {
	let caughtError;
	try {
		await entry.getData(new zip.TextWriter(), options);
	} catch (error) {
		caughtError = error;
	}
	if (!caughtError || caughtError.message != message) {
		throw new Error("expected " + message + " with " + label + ", got: " + caughtError);
	}
}

function patchFirstCentralHeader(data, offset, value) {
	const patchedData = data.slice();
	for (let indexData = 0; indexData < patchedData.length - 4; indexData++) {
		if (CENTRAL_HEADER_SIGNATURE.every((byte, indexByte) => patchedData[indexData + indexByte] == byte)) {
			new DataView(patchedData.buffer).setUint32(indexData + offset, value, true);
			return patchedData;
		}
	}
	throw new Error("central directory header not found");
}

function generateText(wordCount) {
	const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"];
	let seed = 42;
	const result = [];
	for (let index = 0; index < wordCount; index++) {
		seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
		result.push(words[seed % words.length]);
	}
	return result.join(" ");
}
