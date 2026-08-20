/* global URL */

import * as zip from "../zip-lib.js";

export { test };

const COMPRESSION_METHOD_ZSTD = 93;
const FORMAT_ZSTD = "zstd";
const ZIP_URL = new URL("../data/lorem-zstd.zip", import.meta.url).href;
const CODEC_URI = new URL("../vendor/zstd-codec.js", import.meta.url).href;
const EXPECTED_PREFIX = "Lorem ipsum dolor sit amet";

async function test() {
	try {
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_ZSTD,
			format: FORMAT_ZSTD,
			codecURI: CODEC_URI
		});
		const zipReader = new zip.ZipReader(new zip.HttpReader(ZIP_URL, { preventHeadRequest: true }), { checkCrc32: true });
		const [entry] = await zipReader.getEntries();
		const text = await entry.getData(new zip.TextWriter());
		await zipReader.close();
		if (entry.compressionMethod != COMPRESSION_METHOD_ZSTD) {
			throw new Error("unexpected compression method " + entry.compressionMethod);
		}
		if (text.length != entry.uncompressedSize || !text.startsWith(EXPECTED_PREFIX)) {
			throw new Error("zstd entry did not decompress to the expected content");
		}
		await checkWriteRejected();
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_ZSTD);
		await zip.terminateWorkers();
	}
}

async function checkWriteRejected() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	let error;
	try {
		await zipWriter.add("entry.txt", new zip.TextReader("data"), { compressionMethod: COMPRESSION_METHOD_ZSTD });
	} catch (writerError) {
		error = writerError;
	}
	if (!error || error.message != zip.ERR_UNSUPPORTED_COMPRESSION) {
		throw new Error("expected write to be rejected for the decompression-only codec");
	}
}
