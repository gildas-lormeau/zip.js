/* global URL, fetch, TextDecoder, Uint8Array */

import * as zip from "../zip-lib.js";
import { unshrink } from "../vendor/unshrink.js";

export { test };

const COMPRESSION_METHOD_SHRINK = 1;
const FORMAT_SHRINK = "shrink";
const CODEC_URI = new URL("../vendor/shrink-codec.js", import.meta.url).href;
const BIG_FIXTURE_REPETITIONS = 80;
const DEFAULT_CODE_SIZE = 9;
const VECTOR_CAPACITY = 100;
const VECTORS = [
	{ codes: ["a", "b", "c", 257, 259], expected: "abcabca" },
	{ codes: ["a", "b", 456], error: true },
	{ codes: ["a", "n", "b", 257, 260], expected: "anbanana" },
	{ codes: ["a", "b", "c", 258, 256, 2, 257], error: true },
	{ codes: ["a", 257], expected: "aaa" },
	{ codes: [257], error: true },
	{ codes: [256, 1, ["a", 10]], expected: "a" },
	{ codes: [256, 2, "a"], expected: "a" },
	{ codes: ["a", "b", "c", "d", 259, 256, 2, "x", 257], error: true },
	{ codes: ["a", "b", "c", "d", 259, 256, 2, "x", "y", "z", "0", 257], expected: "abcdcdxyz0yzx" },
	{ codes: ["a", "b", "c", "d", "e", "f", 261, 256, 2, "a", "n", "b", 258, 257, 261, 257], expected: "abcdefefanbananaaanaanaa" },
	{ codes: ["a", "b", 257, 256, 2, "a", 257], error: true },
	{ codes: ["a", "b", 257, 256, 2, "a", "b", 256, 2, "x", 258], expected: "abababxbx" },
	{ codes: [], expected: "" }
];

async function test() {
	checkVectors();
	try {
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_SHRINK,
			format: FORMAT_SHRINK,
			codecURI: CODEC_URI
		});
		const loremText = new TextDecoder().decode(await (await fetch(new URL("../data/lorem.txt", import.meta.url).href)).arrayBuffer());
		await checkFixture("lorem-shrink.zip", loremText);
		await checkFixture("lorem-shrink-big.zip", loremText.repeat(BIG_FIXTURE_REPETITIONS));
		await checkWriteRejected();
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_SHRINK);
		await zip.terminateWorkers();
	}
}

function checkVectors() {
	for (const [vectorIndex, { codes, expected, error }] of VECTORS.entries()) {
		const input = buildStream(codes);
		if (error) {
			let vectorError;
			try {
				unshrink(input, VECTOR_CAPACITY);
			} catch (unshrinkError) {
				vectorError = unshrinkError;
			}
			if (!vectorError) {
				throw new Error("expected vector " + vectorIndex + " to be rejected");
			}
		} else {
			const { output } = unshrink(input, expected.length);
			const text = String.fromCharCode(...output);
			if (text != expected) {
				throw new Error("vector " + vectorIndex + " decompressed to " + JSON.stringify(text));
			}
		}
	}
}

function buildStream(codes) {
	const bytes = [];
	let bitBuffer = 0;
	let bitCount = 0;
	for (const code of codes) {
		const [value, size] = Array.isArray(code) ? code : [code, DEFAULT_CODE_SIZE];
		bitBuffer |= (typeof value == "string" ? value.charCodeAt(0) : value) << bitCount;
		bitCount += size;
		while (bitCount >= 8) {
			bytes.push(bitBuffer & 0xff);
			bitBuffer >>>= 8;
			bitCount -= 8;
		}
	}
	if (bitCount) {
		bytes.push(bitBuffer & 0xff);
	}
	return new Uint8Array(bytes);
}

async function checkFixture(name, expectedText) {
	const url = new URL(`../data/${name}`, import.meta.url).href;
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }), { checkSignature: true });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter());
	await zipReader.close();
	if (entry.compressionMethod != COMPRESSION_METHOD_SHRINK) {
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
		await zipWriter.add("entry.txt", new zip.TextReader("data"), { compressionMethod: COMPRESSION_METHOD_SHRINK });
	} catch (writerError) {
		error = writerError;
	}
	if (!error || error.message != zip.ERR_UNSUPPORTED_COMPRESSION) {
		throw new Error("expected write to be rejected for the decompression-only codec");
	}
}
