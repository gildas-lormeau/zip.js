/* global CompressionStream, DecompressionStream */

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
		const text = await entries[0].getData(new zip.TextWriter(), { checkSignature: true });
		if (text != CONTENT) {
			throw new Error("unexpected content");
		}
		const emptyText = await entries[1].getData(new zip.TextWriter(), { checkSignature: true });
		if (emptyText != "") {
			throw new Error("unexpected empty entry content");
		}
		const secureText = await entries[2].getData(new zip.TextWriter(), { password: PASSWORD });
		if (secureText != CONTENT) {
			throw new Error("unexpected encrypted entry content");
		}
		const corruptedCrcData = patchFirstCentralHeader(data, CENTRAL_HEADER_CRC32_OFFSET, 0xdeadbeef);
		entries = await getEntries(corruptedCrcData);
		const corruptedCrcText = await entries[0].getData(new zip.TextWriter(), { checkSignature: false });
		if (corruptedCrcText != CONTENT) {
			throw new Error("unexpected content with a corrupted signature");
		}
		let caughtError;
		try {
			await entries[0].getData(new zip.TextWriter(), { checkSignature: true });
		} catch (error) {
			caughtError = error;
		}
		if (!caughtError || caughtError.message != zip.ERR_INVALID_CRC32) {
			throw new Error("expected an invalid signature error, got: " + caughtError);
		}
		const shrunkSizeData = patchFirstCentralHeader(data, CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, entries[0].uncompressedSize - 1);
		entries = await getEntries(shrunkSizeData);
		caughtError = undefined;
		try {
			await entries[0].getData(new zip.TextWriter());
		} catch (error) {
			caughtError = error;
		}
		if (!caughtError) {
			throw new Error("expected an error with a shrunk uncompressed size");
		}
		const grownSizeData = patchFirstCentralHeader(data, CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, entries[0].uncompressedSize + 1000);
		entries = await getEntries(grownSizeData);
		caughtError = undefined;
		try {
			await entries[0].getData(new zip.TextWriter());
		} catch (error) {
			caughtError = error;
		}
		if (!caughtError || caughtError.message != zip.ERR_INVALID_UNCOMPRESSED_SIZE) {
			throw new Error("expected an invalid uncompressed size error, got: " + caughtError);
		}
		zip.resetConfiguration();
		zip.configure({ useWebWorkers: false });
		entries = await getEntries(data);
		for (const entry of [entries[0], entries[2]]) {
			const entryText = await entry.getData(new zip.TextWriter(), { checkSignature: true, password: PASSWORD });
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
