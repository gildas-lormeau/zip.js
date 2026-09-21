// A corrupted deflated entry rejects with ERR_INVALID_COMPRESSED_DATA whatever inflates it, with the
// error the codec raised as the cause. The native DecompressionStream of Node.js rejects with a
// message-less TypeError, the one of Deno with "corrupt deflate stream", the one of Bun with "inflate
// failed" and the wasm codec with "process error:-3", so a caller comparing against the constant used to
// be right on Node.js only. A codec failure is told from an error fed into the codec by identity, not by
// text, so the failure of the reader of the zip file reaches the caller unchanged, with its own cause.
// Every inflate route is covered: the native and wasm codecs, with and without workers, with and without
// the gzip trailer check that checkCrc32 enables. Bytes trailing a complete deflate stream, i.e. a
// compressedSize larger than the stream, are rejected on every route too: the bundled codecs used to
// drop them and return the content, the native ones never did. On the gzip trailer route the extra
// bytes displace the trailer, and an inflater that reports it once the real trailer has been written,
// as the one of Node.js does, makes the failure read as a CRC-32 mismatch. The cause of the reader
// failure is assigned by hand: engines older than Chrome 93 and Firefox 91 ignore the `cause` option
// of the Error constructor.

import * as zip from "../zip-lib.js";

const ENTRY_NAME = "data.bin";
const ENTRY_SIZE = 200000;
const LOCAL_HEADER_SIZE = 30;
const CORRUPTION_OFFSET = 1024;
const CORRUPTION_LENGTH = 64;
const TRAILING_LENGTH = 512;
const SOURCE_FAILURE_OFFSET = 4096;
const SOURCE_ERROR_MESSAGE = "simulated stream error";
const ROOT_CAUSE_MESSAGE = "disk failure";
const DEFLATE_METHOD = 8;

export { test };

async function test() {
	try {
		const data = await createZip();
		const corrupted = corrupt(data);
		const trailing = await appendTrailingBytes(data);
		for (const useWebWorkers of [false, true]) {
			for (const useCompressionStream of [true, false]) {
				for (const checkCrc32 of [false, true]) {
					const label = "useWebWorkers=" + useWebWorkers + ", useCompressionStream=" + useCompressionStream + ", checkCrc32=" + checkCrc32;
					const readerOptions = { useWebWorkers, useCompressionStream };
					await corruptedEntryIsMapped(corrupted, readerOptions, { checkCrc32 }, label);
					await trailingBytesAreRejected(trailing, readerOptions, { checkCrc32 }, label);
					await sourceFailureIsKept(data, readerOptions, { checkCrc32 }, label);
				}
			}
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function trailingBytesAreRejected(data, readerOptions, options, label) {
	const error = await readEntry(data, readerOptions, options, zip.Uint8ArrayReader);
	if (!error) {
		throw new Error(label + ": the entry with trailing bytes was read without an error");
	}
	const acceptedMessages = options.checkCrc32 ?
		[zip.ERR_INVALID_COMPRESSED_DATA, zip.ERR_INVALID_CRC32] :
		[zip.ERR_INVALID_COMPRESSED_DATA];
	if (!acceptedMessages.includes(error.message)) {
		throw new Error(label + ": expected " + acceptedMessages.join(" or ") + " for the entry with trailing bytes, got " + describe(error));
	}
	if (!error.cause || typeof error.cause != "object") {
		throw new Error(label + ": the error of the entry with trailing bytes does not carry the error of the codec as its cause, got " + describe(error.cause));
	}
}

async function corruptedEntryIsMapped(data, readerOptions, options, label) {
	const error = await readEntry(data, readerOptions, options, zip.Uint8ArrayReader);
	if (!error) {
		throw new Error(label + ": the corrupted entry was read without an error");
	}
	if (error.message != zip.ERR_INVALID_COMPRESSED_DATA) {
		throw new Error(label + ": expected " + zip.ERR_INVALID_COMPRESSED_DATA + " for the corrupted entry, got " + describe(error));
	}
	const { cause } = error;
	if (!cause || typeof cause != "object") {
		throw new Error(label + ": the error of the corrupted entry does not carry the error of the codec as its cause, got " + describe(cause));
	}
	if (cause.message == zip.ERR_INVALID_COMPRESSED_DATA) {
		throw new Error(label + ": the error of the codec was mapped twice");
	}
}

async function sourceFailureIsKept(data, readerOptions, options, label) {
	const rootCause = new Error(ROOT_CAUSE_MESSAGE);
	class FailingReader extends zip.Uint8ArrayReader {
		readUint8Array(index, length) {
			if (index >= LOCAL_HEADER_SIZE + SOURCE_FAILURE_OFFSET) {
				const error = new Error(SOURCE_ERROR_MESSAGE);
				error.cause = rootCause;
				throw error;
			}
			return super.readUint8Array(index, length);
		}
	}
	const error = await readEntry(data, readerOptions, options, FailingReader);
	if (!error) {
		throw new Error(label + ": the entry was read although its reader failed");
	}
	if (error.message != SOURCE_ERROR_MESSAGE) {
		throw new Error(label + ": expected the error of the reader unchanged, got " + describe(error));
	}
	if (!readerOptions.useWebWorkers && error.cause !== rootCause) {
		throw new Error(label + ": the cause of the error of the reader was replaced by " + describe(error.cause));
	}
}

async function readEntry(data, readerOptions, options, Reader) {
	const zipReader = new zip.ZipReader(new Reader(data), readerOptions);
	try {
		const [entry] = await zipReader.getEntries();
		await entry.getData(new zip.Uint8ArrayWriter(), options);
	} catch (error) {
		return error;
	} finally {
		await zipReader.close();
	}
}

async function createZip() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { useWebWorkers: false });
	await zipWriter.add(ENTRY_NAME, new zip.Uint8ArrayReader(pattern(ENTRY_SIZE)), { level: 9 });
	return zipWriter.close();
}

async function appendTrailingBytes(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { useWebWorkers: false });
	const [entry] = await zipReader.getEntries();
	const compressed = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	const { crc32 } = entry;
	await zipReader.close();
	const trailing = new Uint8Array(compressed.length + TRAILING_LENGTH);
	trailing.set(compressed);
	trailing.fill(0x5a, compressed.length);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { useWebWorkers: false });
	await zipWriter.add(ENTRY_NAME, new zip.Uint8ArrayReader(trailing), { passThrough: true, compressionMethod: DEFLATE_METHOD, uncompressedSize: ENTRY_SIZE, crc32 });
	return zipWriter.close();
}

function corrupt(data) {
	const corrupted = data.slice();
	const dataView = new DataView(corrupted.buffer);
	const start = LOCAL_HEADER_SIZE + dataView.getUint16(26, true) + dataView.getUint16(28, true) + CORRUPTION_OFFSET;
	for (let index = start; index < start + CORRUPTION_LENGTH; index++) {
		corrupted[index] ^= 0xff;
	}
	return corrupted;
}

function pattern(size) {
	const bytes = new Uint8Array(size);
	let state = 0x9e3779b9;
	for (let index = 0; index < size; index++) {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;
		bytes[index] = index % 7 ? 65 + (state & 15) : 10;
	}
	return bytes;
}

function describe(error) {
	if (!error || typeof error != "object") {
		return String(error);
	}
	return error.name + ": " + JSON.stringify(error.message) + (error.cause ? " (cause: " + describe(error.cause) + ")" : "");
}
