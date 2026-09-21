/* global ReadableStream, WritableStream, AbortController, setTimeout */

// The AES engine of the WebAssembly module allocates a context per stream that digest() or dispose()
// gives back. The streams used to dispose it in the transformer cancel() hook of a TransformStream,
// which Node and Deno call and no browser does, so a read or write torn down after the header and
// before the flush leaked one context per stream in every browser, and this test proves nothing
// under test-ci and everything on the browser matrix. The engine factory is wrapped to count the
// contexts created and released around reads torn down by their writer, by a corrupted body and by
// an abort signal, and writes torn down by their source and by their destination, on a stored and on
// a deflated entry. Workers are off because a worker installs its own engine factory, and the test
// returns when the library under test is a bundle, whose module graph the factory cannot reach.

import * as zip from "../zip-lib.js";
import { ZipReader } from "../../lib/zip-fs-wasm.js";
import { setAESEngine } from "../../lib/core/streams/aes-crypto-stream.js";
import { createAESEngine } from "../../lib/core/streams/zlib-wasm/zlib-streams-loader.js";

const ITERATIONS = 25;
const ENTRY_SIZE = 200007;
const PASSWORD = "password";
const ENTRIES = [{ name: "stored.bin", level: 0 }, { name: "deflated.bin", level: 5 }];

let created = 0;
let released = 0;
let withoutContext = 0;

export { test };

async function test() {
	if (zip.ZipReader != ZipReader) {
		return;
	}
	try {
		zip.resetConfiguration();
		zip.configure({ useWebWorkers: false });
		await zip.terminateWorkers();
		setAESEngine(countingEngine);
		const data = await writeArchive();
		if (!created) {
			throw new Error("the counting engine is not in use");
		}
		if (withoutContext) {
			throw new Error("the module engine is not in use: " + withoutContext + " of " + created + " engines have no context");
		}
		for (const { name, level } of ENTRIES) {
			for (let index = 0; index < ITERATIONS; index++) {
				const label = name + " " + index;
				await checkReadTornDownByWriter(data, name, label);
				await checkReadTornDownByCorruptedBody(data, name, label);
				await checkReadTornDownBySignal(data, name, label);
				await checkWriteTornDownBySource(name, level, label);
				await checkWriteTornDownByDestination(name, level, label);
			}
		}
		await checkReadBack(data);
	} finally {
		setAESEngine(createAESEngine);
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function checkReadTornDownByWriter(data, name, label) {
	const entry = await getEntry(data, name);
	const writable = new WritableStream({
		write() {
			throw new Error("writer failed");
		}
	});
	await expectRejection(entry.getData(writable, { password: PASSWORD }), label + " read torn down by its writer");
	await checkReleased(label + " read torn down by its writer");
}

async function checkReadTornDownByCorruptedBody(data, name, label) {
	const corrupted = data.slice();
	const { offset } = await getEntry(data, name);
	const dataView = new DataView(corrupted.buffer);
	const start = offset + 30 + dataView.getUint16(offset + 26, true) + dataView.getUint16(offset + 28, true) + 4096;
	for (let index = start; index < start + 256; index++) {
		corrupted[index] ^= 0xff;
	}
	const entry = await getEntry(corrupted, name);
	await expectRejection(entry.getData(new zip.Uint8ArrayWriter(), { password: PASSWORD }), label + " read of a corrupted body");
	await checkReleased(label + " read of a corrupted body");
}

async function checkReadTornDownBySignal(data, name, label) {
	const entry = await getEntry(data, name);
	const controller = new AbortController();
	let progressCalls = 0;
	const promise = entry.getData(new zip.Uint8ArrayWriter(), {
		password: PASSWORD,
		signal: controller.signal,
		onprogress() {
			if (++progressCalls == 2) {
				controller.abort(new Error("aborted"));
			}
		}
	});
	await expectRejection(promise, label + " read torn down by its signal");
	await checkReleased(label + " read torn down by its signal");
}

async function checkWriteTornDownBySource(name, level, label) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await expectRejection(zipWriter.add(name, { readable: failingReadable() }, { password: PASSWORD, level }), label + " write torn down by its source");
	await checkReleased(label + " write torn down by its source");
}

async function checkWriteTornDownByDestination(name, level, label) {
	let writes = 0;
	const writable = new WritableStream({
		write() {
			if (++writes == 2) {
				throw new Error("destination failed");
			}
		}
	});
	const zipWriter = new zip.ZipWriter(writable);
	await expectRejection(zipWriter.add(name, new zip.Uint8ArrayReader(pattern(ENTRY_SIZE, 0)), { password: PASSWORD, level }), label + " write torn down by its destination");
	await checkReleased(label + " write torn down by its destination");
}

async function checkReadBack(data) {
	for (const { name } of ENTRIES) {
		const entry = await getEntry(data, name);
		const content = await entry.getData(new zip.Uint8ArrayWriter(), { password: PASSWORD });
		if (!sameBytes(content, pattern(ENTRY_SIZE, 0))) {
			throw new Error(name + " does not read back after the aborted operations");
		}
	}
	await checkReleased("the reads at the end");
}

async function writeArchive() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (const { name, level } of ENTRIES) {
		await zipWriter.add(name, new zip.Uint8ArrayReader(pattern(ENTRY_SIZE, 0)), { password: PASSWORD, level });
	}
	return zipWriter.close();
}

async function getEntry(data, name) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = await zipReader.getEntries();
	return entries.find(entry => entry.filename == name);
}

function countingEngine(key, authenticationKey) {
	const engine = createAESEngine(key, authenticationKey);
	let live = true;
	created++;
	if (!engine.dispose) {
		withoutContext++;
	}
	return {
		process: engine.process,
		digest() {
			release();
			return engine.digest();
		},
		dispose() {
			release();
			if (engine.dispose) {
				engine.dispose();
			}
		}
	};

	function release() {
		if (live) {
			live = false;
			released++;
		}
	}
}

async function checkReleased(label) {
	for (let attempt = 0; attempt < 100 && released != created; attempt++) {
		await new Promise(resolve => setTimeout(resolve, 10));
	}
	if (released != created) {
		throw new Error(label + ": " + (created - released) + " of " + created + " AES engines not released");
	}
}

async function expectRejection(promise, label) {
	let error;
	try {
		await promise;
	} catch (rejection) {
		error = rejection;
	}
	if (!error) {
		throw new Error(label + " did not reject");
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
				controller.enqueue(pattern(ENTRY_SIZE, 0));
			}
		}
	});
}

function pattern(size, seed) {
	const bytes = new Uint8Array(size);
	let state = seed + 0x9e3779b9;
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
