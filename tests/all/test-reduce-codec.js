/* global URL, fetch */

import * as zip from "../zip-lib.js";
import { expand } from "../vendor/expand.js";

export { test };

const COMPRESSION_METHODS_REDUCE = [2, 3, 4, 5];
const FORMAT_REDUCE = "reduce";
const CODEC_URI = new URL("../vendor/reduce-codec.js", import.meta.url).href;
const DLE_BYTE = 144;
const VECTOR_CAPACITY = 100;

async function test() {
	checkVectors();
	try {
		for (const compressionMethod of COMPRESSION_METHODS_REDUCE) {
			zip.registerCodec({
				compressionMethod,
				format: FORMAT_REDUCE,
				codecURI: CODEC_URI
			});
		}
		const loremData = await readFixture("lorem.txt");
		const hamletData = await readFixture("hamlet-2048.txt");
		const zerosData = new Uint8Array(hamletData.length + 1024);
		zerosData.set(hamletData);
		for (const [methodIndex, compressionMethod] of COMPRESSION_METHODS_REDUCE.entries()) {
			await checkFixture(`lorem-reduce-${methodIndex + 1}.zip`, loremData, compressionMethod);
		}
		await checkFixture("hamlet-reduce-pkzip092.zip", hamletData, 5);
		await checkFixture("zeros-reduce-pkzip092.zip", zerosData, 5);
		await checkWriteRejected();
	} finally {
		for (const compressionMethod of COMPRESSION_METHODS_REDUCE) {
			zip.unregisterCodec(compressionMethod);
		}
		await zip.terminateWorkers();
	}
}

function checkVectors() {
	const overlapStream = buildStream([
		...emptyFollowerSets(),
		..."fa-la-l".split("").map(character => [character.charCodeAt(0), 8]),
		[DLE_BYTE, 8], [7 - 3, 8], [6 - 1, 8],
		["!".charCodeAt(0), 8]
	]);
	checkVector(expand(overlapStream, 15, 4).output, "fa-la-la-la-la!");
	const dleLiteralStream = buildStream([...emptyFollowerSets(), ["x".charCodeAt(0), 8], [DLE_BYTE, 8], [0, 8]]);
	checkVector(expand(dleLiteralStream, 2, 4).output, "x" + String.fromCharCode(DLE_BYTE));
	const extraLengthStream = buildStream([
		...emptyFollowerSets(),
		...Array.from({ length: 30 }, () => [42, 8]),
		[DLE_BYTE, 8], [15, 8], [24 - 3 - 15, 8], [30 - 1, 8]
	]);
	checkVector(expand(extraLengthStream, 54, 4).output, "*".repeat(54));
	checkVectorRejected(() => expand(extraLengthStream, 53, 4));
	checkVectorRejected(() => expand(extraLengthStream.slice(0, extraLengthStream.length - 1), 54, 4));
	checkVectorRejected(() => expand(buildStream([[33, 6]]), VECTOR_CAPACITY, 4));
	const followerSets = [
		...Array.from({ length: 255 }, () => [0, 6]),
		[1, 6], ["a".charCodeAt(0), 8]
	];
	const followerStream = buildStream([...followerSets, [0, 1], [0, 1], ["b".charCodeAt(0), 8]]);
	checkVector(expand(followerStream, 2, 4).output, "ab");
	checkVectorRejected(() => expand(buildStream([...followerSets, [0, 1], [1, 1]]), VECTOR_CAPACITY, 4));
}

function checkVector(output, expected) {
	const text = String.fromCharCode(...output);
	if (text != expected) {
		throw new Error("vector decompressed to " + JSON.stringify(text));
	}
}

function checkVectorRejected(runVector) {
	let error;
	try {
		runVector();
	} catch (vectorError) {
		error = vectorError;
	}
	if (!error) {
		throw new Error("expected vector to be rejected");
	}
}

function emptyFollowerSets() {
	return Array.from({ length: 256 }, () => [0, 6]);
}

function buildStream(codes) {
	const bytes = [];
	let bitBuffer = 0;
	let bitCount = 0;
	for (const [value, size] of codes) {
		bitBuffer |= value << bitCount;
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

async function readFixture(name) {
	return new Uint8Array(await (await fetch(new URL(`../data/${name}`, import.meta.url).href)).arrayBuffer());
}

async function checkFixture(name, expectedData, expectedMethod) {
	const url = new URL(`../data/${name}`, import.meta.url).href;
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }), { checkCrc32: true });
	const [entry] = await zipReader.getEntries();
	const data = await entry.getData(new zip.Uint8ArrayWriter());
	await zipReader.close();
	if (entry.compressionMethod != expectedMethod) {
		throw new Error("unexpected compression method " + entry.compressionMethod);
	}
	if (data.length != expectedData.length || !data.every((byte, index) => byte == expectedData[index])) {
		throw new Error(name + " did not decompress to the expected content");
	}
}

async function checkWriteRejected() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	let error;
	try {
		await zipWriter.add("entry.txt", new zip.TextReader("data"), { compressionMethod: COMPRESSION_METHODS_REDUCE[0] });
	} catch (writerError) {
		error = writerError;
	}
	if (!error || error.message != zip.ERR_UNSUPPORTED_COMPRESSION) {
		throw new Error("expected write to be rejected for the decompression-only codec");
	}
}
