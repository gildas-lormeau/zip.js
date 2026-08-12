import * as zip from "../zip-lib.js";

const CONTENT = "lorem ipsum dolor sit amet ".repeat(500);

export { test };

async function test() {
	try {
		await zip.terminateWorkers();
		zip.configure({
			useWebWorkers: false,
			wasmURI: "file:///nonexistent/zip-module.wasm",
			CompressionStream: null,
			DecompressionStream: null
		});
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 9 });
		await zipWriter.add("entry.txt", new zip.TextReader(CONTENT));
		const data = await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		const [entry] = await zipReader.getEntries();
		if (entry.compressionMethod != 0) {
			throw new Error("expected a stored entry");
		}
		const text = await entry.getData(new zip.TextWriter(), { checkSignature: true });
		if (text != CONTENT) {
			throw new Error("unexpected content");
		}
		await zipReader.close();
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}
