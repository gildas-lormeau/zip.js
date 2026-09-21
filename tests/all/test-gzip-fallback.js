/* global CompressionStream, DecompressionStream */

// Drives the gzip fallback taken when the host codec lacks "deflate-raw", through wrappers that
// refuse that format. The wrapper fills the fallback slot too, otherwise the native build reads
// through its JavaScript port and never reaches the fallback. On the read side the trailer carries
// the CRC-32 and the size declared by the entry and the host inflater verifies both, so a corrupted
// CRC-32 fails even with checkCrc32 off, a size smaller than the data fails as soon as the output
// exceeds it, and a size larger than the data fails when the inflater rejects the trailer, which it
// reports as a whole, hence with the CRC-32 error; all without a watchdog. An entry without a stored
// CRC-32 (AE-2, what the writer emits for an encrypted entry) gets a trailer carrying the CRC-32 of
// the output received so far: exact on the engines whose inflater enqueues during the write, once
// an empty write has waited for the wrapper to drain its queue, and partial on Node.js, whose
// inflater hands its output over only at the end, so the inflater's rejection of that trailer is
// judged by the output length alone, the end of the entry when it has the stored size and
// ERR_INVALID_UNCOMPRESSED_SIZE otherwise. The wrapper reads the inflater eagerly, since an errored
// stream drops the chunks still queued in it, and paces the input on its own queue instead. No
// idle check is involved; the large entry read several times is what caught the race of the
// previous one.

import * as zip from "../zip-lib.js";

const CONTENT = "lorem ipsum dolor sit amet ".repeat(2000);
const LARGE_CONTENT = "lorem ipsum dolor sit amet ".repeat(80000);
const LARGE_ENTRY_READS = 3;
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
			DecompressionStream: LegacyDecompressionStream,
			DecompressionStreamFallback: LegacyDecompressionStream
		});
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 9 });
		await zipWriter.add("entry.txt", new zip.TextReader(CONTENT));
		await zipWriter.add("empty.txt", new zip.TextReader(""));
		await zipWriter.add("secure.txt", new zip.TextReader(CONTENT), { password: PASSWORD });
		await zipWriter.add("large.txt", new zip.TextReader(LARGE_CONTENT), { password: PASSWORD });
		const data = await zipWriter.close();
		let entries = await getEntries(data);
		if (entries[0].compressedSize >= entries[0].uncompressedSize) {
			throw new Error("expected a compressed entry");
		}
		if (entries[2].crc32 !== undefined || entries[3].crc32 !== undefined) {
			throw new Error("expected encrypted entries without a stored CRC-32");
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
		for (let attempt = 0; attempt < LARGE_ENTRY_READS; attempt++) {
			const largeText = await entries[3].getData(new zip.TextWriter(), { password: PASSWORD });
			if (largeText != LARGE_CONTENT) {
				throw new Error("unexpected large encrypted entry content");
			}
		}
		const corruptedCrcData = patchCentralHeader(data, 0, CENTRAL_HEADER_CRC32_OFFSET, 0xdeadbeef);
		entries = await getEntries(corruptedCrcData);
		for (const checkCrc32 of [false, true]) {
			await expectError(entries[0], { checkCrc32 }, zip.ERR_INVALID_CRC32, "a corrupted crc32 and checkCrc32 " + checkCrc32);
		}
		const shrunkSizeData = patchCentralHeader(data, 0, CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, entries[0].uncompressedSize - 1);
		entries = await getEntries(shrunkSizeData);
		await expectError(entries[0], {}, zip.ERR_INVALID_UNCOMPRESSED_SIZE, "a shrunk uncompressed size");
		const grownSizeData = patchCentralHeader(data, 0, CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, entries[0].uncompressedSize + 1000);
		entries = await getEntries(grownSizeData);
		await expectError(entries[0], {}, zip.ERR_INVALID_CRC32, "a grown uncompressed size");
		const shrunkSecureSizeData = patchCentralHeader(data, 2, CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, entries[2].uncompressedSize - 1);
		entries = await getEntries(shrunkSecureSizeData);
		await expectError(entries[2], { password: PASSWORD }, zip.ERR_INVALID_UNCOMPRESSED_SIZE, "a shrunk uncompressed size without a stored crc32");
		const grownSecureSizeData = patchCentralHeader(data, 2, CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, entries[2].uncompressedSize + 1000);
		entries = await getEntries(grownSecureSizeData);
		await expectError(entries[2], { password: PASSWORD }, zip.ERR_INVALID_UNCOMPRESSED_SIZE, "a grown uncompressed size without a stored crc32");
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

function patchCentralHeader(data, entryIndex, offset, value) {
	const patchedData = data.slice();
	let headerIndex = 0;
	for (let indexData = 0; indexData < patchedData.length - 4; indexData++) {
		if (CENTRAL_HEADER_SIGNATURE.every((byte, indexByte) => patchedData[indexData + indexByte] == byte)) {
			if (headerIndex == entryIndex) {
				new DataView(patchedData.buffer).setUint32(indexData + offset, value, true);
				return patchedData;
			}
			headerIndex++;
		}
	}
	throw new Error("central directory header not found");
}
