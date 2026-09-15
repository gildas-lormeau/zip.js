/* global CompressionStream, DecompressionStream */

// Drives the gzip fallback taken when the host codec lacks "deflate-raw", through wrappers that
// refuse that format. On the read side the trailer carries the CRC-32 and the size declared by the
// entry and the host inflater verifies both, so a corrupted CRC-32 fails even with checkCrc32 off,
// and a wrong size fails as soon as the output has been read, without a watchdog.

import * as zip from "../zip-lib.js";

const CONTENT = "lorem ipsum dolor sit amet ".repeat(2000);
const PASSWORD = "password";
const CENTRAL_HEADER_SIGNATURE = [0x50, 0x4b, 0x01, 0x02];
const CENTRAL_HEADER_CRC32_OFFSET = 16;
const CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET = 24;

export { test };

class LegacyCompressionStream {
	constructor(format, options) {
		if (format != "gzip" && format != "deflate") {
			throw new TypeError("Unsupported format: " + format);
		}
		return new CompressionStream(format, options);
	}
}

class LegacyDecompressionStream {
	constructor(format, options) {
		if (format != "gzip" && format != "deflate") {
			throw new TypeError("Unsupported format: " + format);
		}
		return new DecompressionStream(format, options);
	}
}

async function test() {
	try {
		await zip.terminateWorkers();
		zip.configure({
			useWebWorkers: false,
			wasmURI: "file:///nonexistent/zip-module.wasm",
			CompressionStream: LegacyCompressionStream,
			DecompressionStream: LegacyDecompressionStream
		});
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 9 });
		await zipWriter.add("entry.txt", new zip.TextReader(CONTENT));
		await zipWriter.add("empty.txt", new zip.TextReader(""));
		await zipWriter.add("secure.txt", new zip.TextReader(CONTENT), { password: PASSWORD });
		const data = await zipWriter.close();
		let entries = await getEntries(data);
		if (entries[0].compressedSize >= entries[0].uncompressedSize) {
			throw new Error("expected a compressed entry");
		}
		const text = await entries[0].getData(new zip.TextWriter(), { checkCrc32: true });
		if (text != CONTENT) {
			throw new Error("unexpected content");
		}
		const emptyText = await entries[1].getData(new zip.TextWriter(), { checkCrc32: true });
		if (emptyText != "") {
			throw new Error("unexpected empty entry content");
		}
		const secureText = await entries[2].getData(new zip.TextWriter(), { password: PASSWORD });
		if (secureText != CONTENT) {
			throw new Error("unexpected encrypted entry content");
		}
		const corruptedCrcData = patchFirstCentralHeader(data, CENTRAL_HEADER_CRC32_OFFSET, 0xdeadbeef);
		entries = await getEntries(corruptedCrcData);
		for (const checkCrc32 of [false, true]) {
			await expectError(entries[0], { checkCrc32 }, zip.ERR_INVALID_CRC32, "a corrupted crc32 and checkCrc32 " + checkCrc32);
		}
		const shrunkSizeData = patchFirstCentralHeader(data, CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, entries[0].uncompressedSize - 1);
		entries = await getEntries(shrunkSizeData);
		await expectError(entries[0], {}, zip.ERR_INVALID_UNCOMPRESSED_SIZE, "a shrunk uncompressed size");
		const grownSizeData = patchFirstCentralHeader(data, CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, entries[0].uncompressedSize + 1000);
		entries = await getEntries(grownSizeData);
		await expectError(entries[0], {}, zip.ERR_INVALID_UNCOMPRESSED_SIZE, "a grown uncompressed size");
		zip.resetConfiguration();
		zip.configure({ useWebWorkers: false });
		entries = await getEntries(data);
		for (const entry of [entries[0], entries[2]]) {
			const entryText = await entry.getData(new zip.TextWriter(), { checkCrc32: true, password: PASSWORD });
			if (entryText != CONTENT) {
				throw new Error("unexpected content read back with the default config");
			}
		}
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function getEntries(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	return entries;
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
