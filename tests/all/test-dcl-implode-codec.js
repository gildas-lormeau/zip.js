/* global URL, Blob */

import * as zip from "../zip-lib.js";

export { test };

const COMPRESSION_METHOD_DCL_IMPLODE = 10;
const FORMAT_DCL_IMPLODE = "dcl-implode";
const VERSION_NEEDED_DCL_IMPLODE = 25;
const CODEC_URI = new URL("../vendor/dcl-implode-codec.js", import.meta.url).href;
const FIXTURE_VARIANTS = ["a1", "a2", "a3", "b1", "b2", "b3"];
const EXPECTED_PREFIX = "Lorem ipsum dolor sit amet";
const TEXT_CONTENT = "The quick brown fox jumps over the lazy dog. ".repeat(40);

async function test() {
	try {
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_DCL_IMPLODE,
			format: FORMAT_DCL_IMPLODE,
			codecURI: CODEC_URI,
			versionNeeded: VERSION_NEEDED_DCL_IMPLODE
		});
		for (const variant of FIXTURE_VARIANTS) {
			await checkFixture(variant);
		}
		await checkRoundTrip();
		await checkRoundTrip({ password: "password", encryptionStrength: 3 });
		await checkRoundTrip({ password: "password", zipCrypto: true });
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_DCL_IMPLODE);
		await zip.terminateWorkers();
	}
}

async function checkFixture(variant) {
	const url = new URL(`../data/lorem-dcl-implode-${variant}.zip`, import.meta.url).href;
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }), { checkCrc32: true });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter());
	await zipReader.close();
	if (entry.compressionMethod != COMPRESSION_METHOD_DCL_IMPLODE) {
		throw new Error("unexpected compression method " + entry.compressionMethod);
	}
	if (text.length != entry.uncompressedSize || !text.startsWith(EXPECTED_PREFIX)) {
		throw new Error("variant " + variant + " did not decompress to the expected content");
	}
}

async function checkRoundTrip(encryptionOptions = {}) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), encryptionOptions);
	await zipWriter.add("entry.txt", new zip.TextReader(TEXT_CONTENT), { compressionMethod: COMPRESSION_METHOD_DCL_IMPLODE });
	const bytes = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])), { checkCrc32: true });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter(), { password: encryptionOptions.password });
	await zipReader.close();
	if (entry.compressionMethod != COMPRESSION_METHOD_DCL_IMPLODE) {
		throw new Error("round trip did not use the registered method");
	}
	if (Boolean(encryptionOptions.password) != entry.encrypted) {
		throw new Error("unexpected encrypted flag " + entry.encrypted);
	}
	if (!encryptionOptions.password && entry.version != VERSION_NEEDED_DCL_IMPLODE) {
		throw new Error("unexpected version needed to extract " + entry.version);
	}
	if (text != TEXT_CONTENT) {
		throw new Error("round trip content mismatch");
	}
}
