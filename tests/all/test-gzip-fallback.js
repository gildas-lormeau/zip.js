/* global CompressionStream, DecompressionStream */

import * as zip from "../zip-lib.js";

const CONTENT = "lorem ipsum dolor sit amet ".repeat(2000);
const PASSWORD = "password";

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
		let zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		let entries = await zipReader.getEntries();
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
		let caughtError;
		try {
			await entries[2].getData(new zip.TextWriter(), { password: PASSWORD });
		} catch (error) {
			caughtError = error;
		}
		if (!caughtError || caughtError.message != "WASM module not loaded") {
			throw new Error("expected a WASM module error for the encrypted entry, got: " + caughtError);
		}
		await zipReader.close();
		zip.resetConfiguration();
		zip.configure({ useWebWorkers: false });
		zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		entries = await zipReader.getEntries();
		for (const entry of [entries[0], entries[2]]) {
			const entryText = await entry.getData(new zip.TextWriter(), { checkSignature: true, password: PASSWORD });
			if (entryText != CONTENT) {
				throw new Error("unexpected content read back with the default config");
			}
		}
		await zipReader.close();
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}
