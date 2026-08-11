/* global URL, fetch, TextDecoder */

import * as zip from "../zip-lib.js";

export { test };

const COMPRESSION_METHOD_IMPLODE = 6;
const FORMAT_IMPLODE = "implode";
const CODEC_URI = new URL("../vendor/implode-codec.js", import.meta.url).href;
const FIXTURE_VARIANTS = ["4k", "4k-lit", "8k", "8k-lit"];
const BIG_FIXTURE_REPETITIONS = 80;

async function test() {
	try {
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_IMPLODE,
			format: FORMAT_IMPLODE,
			codecURI: CODEC_URI
		});
		const loremText = new TextDecoder().decode(await (await fetch(new URL("../data/lorem.txt", import.meta.url).href)).arrayBuffer());
		for (const variant of FIXTURE_VARIANTS) {
			await checkFixture(`lorem-implode-${variant}.zip`, loremText);
		}
		await checkFixture("lorem-implode-big.zip", loremText.repeat(BIG_FIXTURE_REPETITIONS));
		await checkWriteRejected();
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_IMPLODE);
		await zip.terminateWorkers();
	}
}

async function checkFixture(name, expectedText) {
	const url = new URL(`../data/${name}`, import.meta.url).href;
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }), { checkSignature: true });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter());
	await zipReader.close();
	if (entry.compressionMethod != COMPRESSION_METHOD_IMPLODE) {
		throw new Error("unexpected compression method " + entry.compressionMethod);
	}
	if (text != expectedText) {
		throw new Error(name + " did not decompress to the expected content");
	}
}

async function checkWriteRejected() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	let error;
	try {
		await zipWriter.add("entry.txt", new zip.TextReader("data"), { compressionMethod: COMPRESSION_METHOD_IMPLODE });
	} catch (writerError) {
		error = writerError;
	}
	if (!error || error.message != zip.ERR_UNSUPPORTED_COMPRESSION) {
		throw new Error("expected write to be rejected for the decompression-only codec");
	}
}
