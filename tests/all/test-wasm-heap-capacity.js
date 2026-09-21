/* global WebAssembly, ReadableStream, WritableStream, AbortController, Blob, setTimeout */

// The wasm codec allocates two 64 KB buffers and its zlib state in a heap that never grows, and
// gives them back when its readable is cancelled or its writable aborted. A read or write torn down
// by the consumer reaches the codec through the hand-pulled wrappers of the entry stream, which
// forward the cancel to what they wrap. Under web-streams-polyfill, cancelling a piped TransformStream
// can throw out of the enqueue() of the stream upstream of it, and the wrappers used to error there
// instead of cancelling the codec, so the pair stayed allocated for the life of the page. The heap
// capacity is measured in 64 KB blocks through the exports captured from WebAssembly.instantiate,
// and has to be the same after reads torn down by their writer, by a corrupted body and by an abort
// signal, and after writes torn down by their source and by their destination, on a plain and on
// an encrypted deflated entry, since the AES contexts live in the same heap. Workers are off because
// the heap lives in the scope running the codec, the native codec is off so the wasm one runs on
// every engine, and the test returns when the library under test is a bundle, whose module graph
// the loader import cannot reach.

import * as zip from "../zip-lib.js";
import { ZipReader } from "../../lib/zip-fs-wasm.js";
import { resetWasmModule } from "../../lib/core/streams/zlib-wasm/zlib-streams-loader.js";

const ITERATIONS = 25;
const ENTRY_SIZE = 200007;
const LEVEL = 5;
const PASSWORD = "password";
const ENTRIES = [{ name: "deflated.bin" }, { name: "encrypted.bin", password: PASSWORD }];
const BLOCK_LENGTH = 65536;

let exports;
let capacity;

export { test };

async function test() {
	if (zip.ZipReader != ZipReader) {
		return;
	}
	const { instantiate } = WebAssembly;
	WebAssembly.instantiate = (...args) => instantiate.apply(WebAssembly, args).then(result => {
		exports = result.instance.exports;
		return result;
	});
	try {
		zip.resetConfiguration();
		zip.configure({ useWebWorkers: false, useCompressionStream: false });
		await zip.terminateWorkers();
		resetWasmModule();
		const data = await writeArchive();
		if (!exports) {
			throw new Error("the wasm module was not instantiated through WebAssembly.instantiate");
		}
		await checkReadBack(data);
		capacity = measureCapacity();
		for (const entry of ENTRIES) {
			for (let index = 0; index < ITERATIONS; index++) {
				const label = entry.name + " " + index;
				await checkReadTornDownByWriter(data, entry, label);
				await checkReadTornDownByCorruptedBody(data, entry, label);
				await checkReadTornDownBySignal(data, entry, label);
				await checkWriteTornDownBySource(entry, label);
				await checkWriteTornDownByDestination(entry, label);
			}
		}
		await checkReadBack(data);
		await checkCapacity("the reads at the end");
	} finally {
		WebAssembly.instantiate = instantiate;
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function checkReadTornDownByWriter(data, { name, password }, label) {
	const entry = await getEntry(data, name);
	const writable = new WritableStream({
		write() {
			throw new Error("writer failed");
		}
	});
	await expectRejection(entry.getData(writable, { password }), label + " read torn down by its writer");
	await checkCapacity(label + " read torn down by its writer");
}

async function checkReadTornDownByCorruptedBody(data, { name, password }, label) {
	const corrupted = data.slice();
	const { offset } = await getEntry(data, name);
	const dataView = new DataView(corrupted.buffer);
	const start = offset + 30 + dataView.getUint16(offset + 26, true) + dataView.getUint16(offset + 28, true) + 4096;
	for (let position = start; position < start + 256; position++) {
		corrupted[position] ^= 0xff;
	}
	const entry = await getEntry(corrupted, name);
	await expectRejection(entry.getData(new zip.Uint8ArrayWriter(), { password, checkCrc32: true }), label + " read of a corrupted body");
	await checkCapacity(label + " read of a corrupted body");
}

async function checkReadTornDownBySignal(data, { name, password }, label) {
	const entry = await getEntry(data, name);
	const controller = new AbortController();
	let progressCalls = 0;
	const promise = entry.getData(new zip.Uint8ArrayWriter(), {
		password,
		signal: controller.signal,
		onprogress() {
			if (++progressCalls == 2) {
				controller.abort(new Error("aborted"));
			}
		}
	});
	// Chrome 76 to 79 ignore the signal option of pipeTo(), so this read may complete there
	await settle(promise);
	await checkCapacity(label + " read torn down by its signal");
}

async function checkWriteTornDownBySource({ name, password }, label) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await expectRejection(zipWriter.add(name, { readable: failingReadable() }, { password, level: LEVEL }), label + " write torn down by its source");
	await checkCapacity(label + " write torn down by its source");
}

async function checkWriteTornDownByDestination({ name, password }, label) {
	let writes = 0;
	const writable = new WritableStream({
		write() {
			if (++writes == 2) {
				throw new Error("destination failed");
			}
		}
	});
	const zipWriter = new zip.ZipWriter(writable);
	await expectRejection(zipWriter.add(name, new zip.Uint8ArrayReader(pattern(ENTRY_SIZE)), { password, level: LEVEL }), label + " write torn down by its destination");
	await checkCapacity(label + " write torn down by its destination");
}

async function checkReadBack(data) {
	for (const { name, password } of ENTRIES) {
		const entry = await getEntry(data, name);
		const content = await entry.getData(new zip.Uint8ArrayWriter(), { password });
		if (!sameBytes(content, pattern(ENTRY_SIZE))) {
			throw new Error(name + " does not read back");
		}
	}
}

async function writeArchive() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (const { name, password } of ENTRIES) {
		await zipWriter.add(name, new zip.Uint8ArrayReader(pattern(ENTRY_SIZE)), { password, level: LEVEL });
	}
	return zipWriter.close();
}

async function getEntry(data, name) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(new Blob([data])));
	const entries = await zipReader.getEntries();
	return entries.find(entry => entry.filename == name);
}

function measureCapacity() {
	const blocks = [];
	let block;
	while ((block = exports.malloc(BLOCK_LENGTH))) {
		blocks.push(block);
	}
	blocks.forEach(block => exports.free(block));
	return blocks.length;
}

async function checkCapacity(label) {
	let measured = measureCapacity();
	for (let attempt = 0; attempt < 100 && measured != capacity; attempt++) {
		await new Promise(resolve => setTimeout(resolve, 10));
		measured = measureCapacity();
	}
	if (measured != capacity) {
		throw new Error(label + ": " + measured + " of " + capacity + " heap blocks available");
	}
}

async function expectRejection(promise, label) {
	if (!await settle(promise)) {
		throw new Error(label + " did not reject");
	}
}

async function settle(promise) {
	try {
		await promise;
	} catch (error) {
		return error || new Error("rejected without a reason");
	}
}

function failingReadable() {
	let pulled = false;
	return new ReadableStream({
		pull(controller) {
			if (pulled) {
				controller.error(new Error("source failed"));
			} else {
				pulled = true;
				controller.enqueue(pattern(ENTRY_SIZE));
			}
		}
	});
}

function pattern(size) {
	const bytes = new Uint8Array(size);
	let state = 0x9e3779b9;
	for (let index = 0; index < size; index++) {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;
		bytes[index] = state & 0xff;
	}
	return bytes;
}

function sameBytes(first, second) {
	return first.length == second.length && first.every((value, index) => value == second[index]);
}
