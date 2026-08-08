/* global Blob, TransformStream, Uint8Array, DataView, btoa */

import * as zip from "../zip-lib.js";

export { test };

const TEXT_CONTENT = "The quick brown fox jumps over the lazy dog. ".repeat(40);
const COMPRESSION_METHOD_XOR = 93;
const FORMAT_XOR = "xor-test";
const FORMAT_XOR_URI = "xor-test-uri";
const VERSION_NEEDED_XOR = 63;
const XOR_MASK = 0x55;

const XOR_MODULE_CODE = `class XorStream extends TransformStream {
	constructor() {
		super({
			transform(chunk, controller) {
				const output = new Uint8Array(chunk.length);
				for (let indexByte = 0; indexByte < chunk.length; indexByte++) {
					output[indexByte] = chunk[indexByte] ^ ${XOR_MASK};
				}
				controller.enqueue(output);
			}
		});
	}
}
export { XorStream as CompressionStream, XorStream as DecompressionStream };`;

class XorStream extends TransformStream {
	constructor() {
		super({
			transform(chunk, controller) {
				const output = new Uint8Array(chunk.length);
				for (let indexByte = 0; indexByte < chunk.length; indexByte++) {
					output[indexByte] = chunk[indexByte] ^ XOR_MASK;
				}
				controller.enqueue(output);
			}
		});
	}
}

async function test() {
	try {
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_XOR,
			format: FORMAT_XOR,
			CompressionStream: XorStream,
			DecompressionStream: XorStream,
			versionNeeded: VERSION_NEEDED_XOR
		});
		checkInvalidDefinitions();
		const bytes = await checkRoundTrip();
		await checkEncryptedRoundTrip();
		zip.unregisterCodec(COMPRESSION_METHOD_XOR);
		await checkUnsupported(bytes);
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_XOR,
			format: FORMAT_XOR_URI,
			codecURI: "data:text/javascript;base64," + btoa(XOR_MODULE_CODE),
			versionNeeded: VERSION_NEEDED_XOR
		});
		await checkRoundTrip();
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_XOR);
		await zip.terminateWorkers();
	}
}

function checkInvalidDefinitions() {
	checkThrows(() => zip.registerCodec({ compressionMethod: 8, format: FORMAT_XOR, CompressionStream: XorStream }), zip.ERR_RESERVED_COMPRESSION_METHOD);
	checkThrows(() => zip.registerCodec({ compressionMethod: 94, format: FORMAT_XOR }), zip.ERR_INVALID_CODEC_DEFINITION);
	checkThrows(() => zip.registerCodec({ format: FORMAT_XOR, CompressionStream: XorStream }), zip.ERR_INVALID_CODEC_DEFINITION);
}

function checkThrows(callback, expectedMessage) {
	let error;
	try {
		callback();
	} catch (callbackError) {
		error = callbackError;
	}
	if (!error || error.message != expectedMessage) {
		throw new Error("expected error " + JSON.stringify(expectedMessage) + ", got " + (error && error.message));
	}
}

async function checkRoundTrip() {
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await writer.add("entry.txt", new zip.TextReader(TEXT_CONTENT), { compressionMethod: COMPRESSION_METHOD_XOR });
	const bytes = await writer.close();
	const { method, version, firstDataByte } = readFirstEntryHeader(bytes);
	if (method != COMPRESSION_METHOD_XOR) {
		throw new Error("header method " + method + ", expected " + COMPRESSION_METHOD_XOR);
	}
	if (version != VERSION_NEEDED_XOR) {
		throw new Error("header version " + version + ", expected " + VERSION_NEEDED_XOR);
	}
	if (firstDataByte != ("T".charCodeAt(0) ^ XOR_MASK)) {
		throw new Error("entry data did not go through the codec");
	}
	const content = await readFirstEntry(bytes, {});
	if (content != TEXT_CONTENT) {
		throw new Error("entry did not round-trip");
	}
	return bytes;
}

async function checkEncryptedRoundTrip() {
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { password: "password" });
	await writer.add("entry.txt", new zip.TextReader(TEXT_CONTENT), { compressionMethod: COMPRESSION_METHOD_XOR });
	const bytes = await writer.close();
	const content = await readFirstEntry(bytes, { password: "password" });
	if (content != TEXT_CONTENT) {
		throw new Error("encrypted entry did not round-trip");
	}
}

async function checkUnsupported(bytes) {
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await checkRejects(() => writer.add("entry.txt", new zip.TextReader(TEXT_CONTENT), { compressionMethod: COMPRESSION_METHOD_XOR }));
	await checkRejects(() => readFirstEntry(bytes, {}));
}

async function checkRejects(callback) {
	let error;
	try {
		await callback();
	} catch (callbackError) {
		error = callbackError;
	}
	if (!error || error.message != zip.ERR_UNSUPPORTED_COMPRESSION) {
		throw new Error("expected error " + JSON.stringify(zip.ERR_UNSUPPORTED_COMPRESSION) + ", got " + (error && error.message));
	}
}

async function readFirstEntry(bytes, options) {
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])), { checkSignature: true });
	try {
		const [entry] = await reader.getEntries();
		return await entry.getData(new zip.TextWriter(), options);
	} finally {
		await reader.close();
	}
}

function readFirstEntryHeader(bytes) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const version = view.getUint16(4, true);
	const method = view.getUint16(8, true);
	const filenameLength = view.getUint16(26, true);
	const extraFieldLength = view.getUint16(28, true);
	const firstDataByte = bytes[30 + filenameLength + extraFieldLength];
	return { method, version, firstDataByte };
}
