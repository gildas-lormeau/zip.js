/* global Blob, TransformStream, btoa, URL, fetch */

import * as zip from "../zip-lib.js";

export { test };

const COMPRESSION_METHOD_LZMA = 14;
const COMPRESSION_METHOD_PPMD = 98;
const FORMAT_FAKE = "fake-test";
const BITFLAG_LZMA_EOS = 0x2;
const FIXTURE_PASSWORD = "lorem.txt";
const LOREM_PREFIX = "Lorem ipsum";

const TEXT_CONTENT = "The quick brown fox jumps over the lazy dog. ".repeat(40);
const COMPRESSION_METHOD_XOR = 93;
const COMPRESSION_METHOD_ECHO = 94;
const COMPRESSION_METHOD_XOR_HIGH = 0x1234;
const FORMAT_XOR = "xor-test";
const FORMAT_ECHO = "echo-test";
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
		await checkCompressionOptions();
		await checkWorkerCompressionOptions();
		const bytes = await checkRoundTrip();
		await checkEncryptedRoundTrip();
		await checkEncryptedHighMethodRoundTrip();
		zip.unregisterCodec(COMPRESSION_METHOD_XOR);
		await checkUnsupported(bytes);
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_XOR,
			format: FORMAT_XOR_URI,
			codecURI: "data:text/javascript;base64," + btoa(XOR_MODULE_CODE),
			versionNeeded: VERSION_NEEDED_XOR
		});
		await checkRoundTrip();
		await checkDecompressionOptions();
		await checkWorkerDecompressionOptions();
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_XOR);
		await zip.terminateWorkers();
	}
}

async function checkCompressionOptions() {
	const constructorArgs = [];
	class EchoCompressionStream extends TransformStream {
		constructor(format, options) {
			super({
				transform(chunk, controller) {
					controller.enqueue(chunk);
				}
			});
			constructorArgs.push({ format, options });
		}
	}
	try {
		zip.registerCodec({ compressionMethod: COMPRESSION_METHOD_ECHO, format: FORMAT_ECHO, CompressionStream: EchoCompressionStream });
		const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await writer.add("entry.txt", new zip.TextReader(TEXT_CONTENT), { compressionMethod: COMPRESSION_METHOD_ECHO });
		await writer.close();
		checkCompressionArgs(constructorArgs[0]);
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_ECHO);
	}
}

function checkCompressionArgs({ format, options }) {
	if (format != FORMAT_ECHO) {
		throw new Error("unexpected codec format " + format);
	}
	if (options.compressionMethod != COMPRESSION_METHOD_ECHO) {
		throw new Error("unexpected codec compressionMethod " + options.compressionMethod);
	}
	if (options.uncompressedSize != TEXT_CONTENT.length) {
		throw new Error("unexpected codec uncompressedSize " + options.uncompressedSize);
	}
	if (typeof options.chunkSize != "number") {
		throw new Error("missing codec chunkSize");
	}
}

async function checkWorkerCompressionOptions() {
	const moduleCode = `class AssertOptionsStream extends TransformStream {
	constructor(format, options) {
		super({ transform(chunk, controller) { controller.enqueue(chunk); } });
		if (format != "${FORMAT_ECHO}" || options.compressionMethod != ${COMPRESSION_METHOD_ECHO} || options.uncompressedSize != ${TEXT_CONTENT.length}) {
			throw new Error("compression codec options not transmitted to worker");
		}
	}
}
export { AssertOptionsStream as CompressionStream };`;
	try {
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_ECHO,
			format: FORMAT_ECHO,
			codecURI: "data:text/javascript;base64," + btoa(moduleCode)
		});
		const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await writer.add("entry.txt", new zip.TextReader(TEXT_CONTENT), { compressionMethod: COMPRESSION_METHOD_ECHO });
		await writer.close();
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_ECHO);
	}
}

async function checkDecompressionOptions() {
	const loremBytes = new Uint8Array(await (await fetch(fixtureURL("lorem.txt"))).arrayBuffer());
	const constructorArgs = [];
	class FakeDecompressionStream extends TransformStream {
		constructor(format, options) {
			super({
				transform() { },
				flush(controller) {
					controller.enqueue(loremBytes.slice());
				}
			});
			constructorArgs.push({ format, options });
		}
	}
	try {
		zip.registerCodec({ compressionMethod: COMPRESSION_METHOD_PPMD, format: FORMAT_FAKE, DecompressionStream: FakeDecompressionStream });
		zip.registerCodec({ compressionMethod: COMPRESSION_METHOD_LZMA, format: FORMAT_FAKE, DecompressionStream: FakeDecompressionStream });
		const contentPpmd = await readFixtureEntry("lorem-ppmd.zip", { checkCrc32: true });
		const contentAes = await readFixtureEntry("lorem-ppmd-aes.zip", { checkCrc32: true, password: FIXTURE_PASSWORD });
		await readFixtureEntry("lorem-lzma.zip", {});
		await readFixtureEntry("lorem-lzma-eos.zip", {});
		if (!contentPpmd.startsWith(LOREM_PREFIX) || !contentAes.startsWith(LOREM_PREFIX)) {
			throw new Error("fake codec output did not round-trip");
		}
		const [ppmd, ppmdAES, lzma, lzmaEOS] = constructorArgs;
		checkDecompressionArgs(ppmd, COMPRESSION_METHOD_PPMD, loremBytes.length);
		checkDecompressionArgs(ppmdAES, COMPRESSION_METHOD_PPMD, loremBytes.length);
		checkDecompressionArgs(lzma, COMPRESSION_METHOD_LZMA, loremBytes.length);
		checkDecompressionArgs(lzmaEOS, COMPRESSION_METHOD_LZMA, loremBytes.length);
		if ((ppmd.options.rawBitFlag & BITFLAG_LZMA_EOS) || (lzma.options.rawBitFlag & BITFLAG_LZMA_EOS)) {
			throw new Error("unexpected end-of-stream marker bit");
		}
		if (!(lzmaEOS.options.rawBitFlag & BITFLAG_LZMA_EOS)) {
			throw new Error("missing end-of-stream marker bit");
		}
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_PPMD);
		zip.unregisterCodec(COMPRESSION_METHOD_LZMA);
	}
}

function checkDecompressionArgs({ format, options }, expectedMethod, expectedUncompressedSize) {
	if (format != FORMAT_FAKE) {
		throw new Error("unexpected codec format " + format);
	}
	if (options.compressionMethod != expectedMethod) {
		throw new Error("unexpected codec compressionMethod " + options.compressionMethod);
	}
	if (options.uncompressedSize != expectedUncompressedSize) {
		throw new Error("unexpected codec uncompressedSize " + options.uncompressedSize);
	}
	if (typeof options.rawBitFlag != "number") {
		throw new Error("missing codec rawBitFlag");
	}
	if (typeof options.chunkSize != "number") {
		throw new Error("missing codec chunkSize");
	}
}

async function checkWorkerDecompressionOptions() {
	const moduleCode = `class EchoOptionsStream extends TransformStream {
	constructor(format, { compressionMethod, rawBitFlag, uncompressedSize }) {
		super({
			transform() { },
			flush(controller) {
				const output = new Uint8Array(uncompressedSize).fill(32);
				output.set(new TextEncoder().encode(JSON.stringify({ compressionMethod, rawBitFlag, uncompressedSize })));
				controller.enqueue(output);
			}
		});
	}
}
export { EchoOptionsStream as DecompressionStream };`;
	try {
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_LZMA,
			format: "echo-options-test",
			codecURI: "data:text/javascript;base64," + btoa(moduleCode)
		});
		const content = await readFixtureEntry("lorem-lzma-eos.zip", {});
		const { compressionMethod, rawBitFlag, uncompressedSize } = JSON.parse(content);
		if (compressionMethod != COMPRESSION_METHOD_LZMA || !(rawBitFlag & BITFLAG_LZMA_EOS) || !(uncompressedSize > 0)) {
			throw new Error("codec options not transmitted to workers: " + content);
		}
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_LZMA);
	}
}

function fixtureURL(name) {
	return new URL(`./../data/${name}`, import.meta.url).href;
}

async function readFixtureEntry(name, options) {
	const reader = new zip.ZipReader(new zip.HttpReader(fixtureURL(name), { preventHeadRequest: true }));
	try {
		const [entry] = await reader.getEntries();
		return await entry.getData(new zip.TextWriter(), options);
	} finally {
		await reader.close();
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

async function checkEncryptedHighMethodRoundTrip() {
	try {
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_XOR_HIGH,
			format: FORMAT_XOR,
			CompressionStream: XorStream,
			DecompressionStream: XorStream,
			versionNeeded: VERSION_NEEDED_XOR
		});
		const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { password: "password" });
		await writer.add("entry.txt", new zip.TextReader(TEXT_CONTENT), { compressionMethod: COMPRESSION_METHOD_XOR_HIGH });
		const bytes = await writer.close();
		const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])), { checkCrc32: true });
		try {
			const [entry] = await reader.getEntries();
			if (entry.compressionMethod != COMPRESSION_METHOD_XOR_HIGH) {
				throw new Error("AES extra field method " + entry.compressionMethod + ", expected " + COMPRESSION_METHOD_XOR_HIGH);
			}
			const content = await entry.getData(new zip.TextWriter(), { password: "password" });
			if (content != TEXT_CONTENT) {
				throw new Error("encrypted high-method entry did not round-trip");
			}
		} finally {
			await reader.close();
		}
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_XOR_HIGH);
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
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])), { checkCrc32: true });
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
