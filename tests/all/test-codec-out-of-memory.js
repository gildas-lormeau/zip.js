/* global TransformStream, WebAssembly */

// A codec that runs out of memory is reported as ERR_CODEC_OUT_OF_MEMORY rather than as invalid
// compressed data, with the error of the codec as the cause. The failure is told by the `code`
// property of that error, "Z_MEM_ERROR", which the bundled wasm codec sets on its allocation
// failures and on zlib's -4; an error without it stays a data error, which the control checks.
// Both moments are covered: a codec that cannot allocate its state when the entry starts, on the
// read and on the write side, and one that fails while inflating. The last part exhausts the real
// wasm heap through the exports captured from WebAssembly.instantiate, the way the heap capacity
// test does, after terminateWorkers() has dropped the module so that it is instantiated again under
// the hook, and returns early when the library under test is a bundle.

import * as zip from "../zip-lib.js";
import { ZipReader } from "../../lib/zip-fs-wasm.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ".repeat(100);
const ENTRY_NAME = "lorem.txt";
const MEMORY_ERROR_CODE = "Z_MEM_ERROR";
const MEMORY_ERROR_MESSAGE = "simulated memory failure";
const DATA_ERROR_MESSAGE = "simulated data failure";
const BLOCK_LENGTH = 65536;

export { test };

async function test() {
	try {
		await zip.terminateWorkers();
		const data = await createZip();
		await mappedWhileInflating(data);
		await mappedWhenTheCodecCannotStart(data);
		await mappedOnTheRealHeap(data);
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function mappedWhileInflating(data) {
	for (const [code, expectedMessage] of [[MEMORY_ERROR_CODE, zip.ERR_CODEC_OUT_OF_MEMORY], [undefined, zip.ERR_INVALID_COMPRESSED_DATA]]) {
		class FailingDecompressionStream extends TransformStream {
			constructor() {
				super({
					transform() {
						throw createError(MEMORY_ERROR_MESSAGE, code);
					}
				});
			}
		}
		zip.configure({ useWebWorkers: false, useCompressionStream: false, DecompressionStreamFallback: FailingDecompressionStream });
		const error = await readEntry(data);
		assertMapped(error, expectedMessage, MEMORY_ERROR_MESSAGE, "a codec failing while inflating with the code " + code);
		zip.resetConfiguration();
	}
}

async function mappedWhenTheCodecCannotStart(data) {
	class UnstartableDecompressionStream {
		constructor() {
			throw createError(MEMORY_ERROR_MESSAGE, MEMORY_ERROR_CODE);
		}
	}
	class UnstartableCompressionStream {
		constructor() {
			throw createError(MEMORY_ERROR_MESSAGE, MEMORY_ERROR_CODE);
		}
	}
	class UnstartableForOtherReasons {
		constructor() {
			throw createError(DATA_ERROR_MESSAGE);
		}
	}
	zip.configure({ useWebWorkers: false, useCompressionStream: false, DecompressionStreamFallback: UnstartableDecompressionStream });
	assertMapped(await readEntry(data), zip.ERR_CODEC_OUT_OF_MEMORY, MEMORY_ERROR_MESSAGE, "a decompression codec that cannot allocate its state");
	zip.resetConfiguration();
	zip.configure({ useWebWorkers: false, useCompressionStream: false, CompressionStreamFallback: UnstartableCompressionStream });
	assertMapped(await writeEntry(), zip.ERR_CODEC_OUT_OF_MEMORY, MEMORY_ERROR_MESSAGE, "a compression codec that cannot allocate its state");
	zip.resetConfiguration();
	zip.configure({ useWebWorkers: false, useCompressionStream: false, DecompressionStreamFallback: UnstartableForOtherReasons });
	const error = await readEntry(data);
	if (!error || error.message != DATA_ERROR_MESSAGE) {
		throw new Error("a codec that cannot start for another reason must keep its error, got " + describe(error));
	}
	zip.resetConfiguration();
}

async function mappedOnTheRealHeap(data) {
	if (zip.ZipReader != ZipReader) {
		return;
	}
	let exports;
	const { instantiate } = WebAssembly;
	WebAssembly.instantiate = (...args) => instantiate.apply(WebAssembly, args).then(result => {
		exports = result.instance.exports;
		return result;
	});
	const blocks = [];
	try {
		zip.configure({ useWebWorkers: false, useCompressionStream: false });
		await zip.terminateWorkers();
		const readBackError = await readEntry(data);
		if (readBackError) {
			throw new Error("the entry does not read back before the heap is exhausted: " + describe(readBackError));
		}
		if (!exports) {
			throw new Error("the wasm module was not instantiated through WebAssembly.instantiate");
		}
		let block;
		while ((block = exports.malloc(BLOCK_LENGTH))) {
			blocks.push(block);
		}
		for (const checkCrc32 of [false, true]) {
			const error = await readEntry(data, { checkCrc32 });
			if (!error || error.message != zip.ERR_CODEC_OUT_OF_MEMORY) {
				throw new Error("expected " + zip.ERR_CODEC_OUT_OF_MEMORY + " on an exhausted heap with checkCrc32 " + checkCrc32 + ", got " + describe(error));
			}
			if (!error.cause || error.cause.code != MEMORY_ERROR_CODE) {
				throw new Error("the error on an exhausted heap does not carry the codec error with its code as its cause, got " + describe(error.cause));
			}
		}
		blocks.splice(0).forEach(block => exports.free(block));
		if (await readEntry(data)) {
			throw new Error("the entry does not read back once the heap is released");
		}
	} finally {
		blocks.forEach(block => exports.free(block));
		WebAssembly.instantiate = instantiate;
		zip.resetConfiguration();
	}
}

function assertMapped(error, expectedMessage, expectedCauseMessage, label) {
	if (!error || error.message != expectedMessage) {
		throw new Error(label + ": expected " + expectedMessage + ", got " + describe(error));
	}
	if (!error.cause || error.cause.message != expectedCauseMessage) {
		throw new Error(label + ": the error does not carry the error of the codec as its cause, got " + describe(error.cause));
	}
}

async function createZip() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { useWebWorkers: false });
	await zipWriter.add(ENTRY_NAME, new zip.TextReader(TEXT_CONTENT), { level: 5 });
	return zipWriter.close();
}

async function readEntry(data, options = {}) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	try {
		const [entry] = await zipReader.getEntries();
		const text = await entry.getData(new zip.TextWriter(), options);
		if (text != TEXT_CONTENT) {
			return new Error("unexpected content");
		}
	} catch (error) {
		return error;
	} finally {
		await zipReader.close();
	}
}

async function writeEntry() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	try {
		await zipWriter.add(ENTRY_NAME, new zip.TextReader(TEXT_CONTENT), { level: 5 });
		await zipWriter.close();
	} catch (error) {
		return error;
	}
}

function createError(message, code) {
	const error = new Error(message);
	if (code) {
		error.code = code;
	}
	return error;
}

function describe(error) {
	if (!error || typeof error != "object") {
		return String(error);
	}
	return error.name + ": " + JSON.stringify(error.message) + (error.code ? " code=" + error.code : "") + (error.cause ? " (cause: " + describe(error.cause) + ")" : "");
}
