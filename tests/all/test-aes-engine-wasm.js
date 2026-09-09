// The AES engine linked into the WebAssembly module. It must produce the bytes of the JavaScript
// engine it stands in for, chunk by chunk and in the authentication code; the library must load the
// module before encrypting a stored entry, which never needed it before; and an entry written or read
// while the module cannot load must still be a valid one, through the JavaScript engine. The
// wasmBuild feature gates the test because the module uses bulk memory operations. The engine check
// loads the module from the data URI the library embeds, since fetch() rejects file URLs on node.

import * as zip from "../zip-lib.js";
import { createEngine as createDefaultEngine } from "../../lib/core/streams/codecs/aes-hmac-sha1.js";
import { createAESEngine, initModule } from "../../lib/core/streams/zlib-wasm/zlib-streams-loader.js";
import { configureZlibModule } from "../../lib/core/zlib-streams-inline.js";

const EMPTY_WASM_URI = "data:application/wasm;base64,";
const KEY_LENGTHS = [16, 24, 32];
const CHUNK_LENGTHS = [65536, 16, 4096, 131072, 48];
const ENTRY_SIZE = 200007;
const PASSWORD = "password";

export { test };

async function test() {
	try {
		await checkModuleLoadedForStoredEntry();
		await checkEnginesInterchangeable();
		await checkAgainstDefaultEngine();
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function checkModuleLoadedForStoredEntry() {
	let wasmURIRead = false;
	await zip.terminateWorkers();
	zip.configure({
		useWebWorkers: false,
		wasmURI: () => {
			wasmURIRead = true;
			return EMPTY_WASM_URI;
		}
	});
	const data = await writeEntry();
	if (!wasmURIRead) {
		throw new Error("a stored encrypted entry did not load the module");
	}
	await readEntry(data);
}

async function checkEnginesInterchangeable() {
	zip.resetConfiguration();
	zip.configure({ useWebWorkers: false });
	await zip.terminateWorkers();
	const dataFromModule = await writeEntry();
	zip.configure({ wasmURI: EMPTY_WASM_URI });
	await zip.terminateWorkers();
	await readEntry(dataFromModule);
	const dataFromFallback = await writeEntry();
	zip.resetConfiguration();
	zip.configure({ useWebWorkers: false });
	await zip.terminateWorkers();
	await readEntry(dataFromFallback);
}

async function checkAgainstDefaultEngine() {
	let wasmURI;
	configureZlibModule(configuration => wasmURI = configuration.wasmURI);
	await initModule(wasmURI(), {});
	for (const keyLength of KEY_LENGTHS) {
		const key = pattern(keyLength, 3);
		const authenticationKey = pattern(keyLength, 5);
		for (const decrypt of [false, true]) {
			const expected = pattern(ENTRY_SIZE, 7);
			const actual = expected.slice();
			const defaultEngine = createDefaultEngine(key, authenticationKey);
			const engine = createAESEngine(key, authenticationKey);
			// the engine backed by the module is the one carrying a context to release
			if (!engine.dispose) {
				throw new Error("the module engine is not in use");
			}
			defaultEngine.process(expected, decrypt);
			let offset = 0;
			let index = 0;
			while (offset < actual.length) {
				const length = Math.min(CHUNK_LENGTHS[index++ % CHUNK_LENGTHS.length], actual.length - offset);
				engine.process(actual.subarray(offset, offset + length), decrypt);
				offset += length;
			}
			if (!sameBytes(actual, expected)) {
				throw new Error("the module engine output differs from the JavaScript engine for AES-" + keyLength * 8);
			}
			if (!sameBytes(engine.digest(), defaultEngine.digest())) {
				throw new Error("the module engine authentication code differs from the JavaScript engine for AES-" + keyLength * 8);
			}
		}
	}
	createAESEngine(pattern(32, 1), pattern(32, 2)).dispose();
}

async function writeEntry() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("entry.bin", new zip.Uint8ArrayReader(pattern(ENTRY_SIZE, 0)), { password: PASSWORD, level: 0 });
	return zipWriter.close();
}

async function readEntry(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { password: PASSWORD });
	const [entry] = await zipReader.getEntries();
	const content = await entry.getData(new zip.Uint8ArrayWriter());
	await zipReader.close();
	if (!sameBytes(content, pattern(ENTRY_SIZE, 0))) {
		throw new Error("the entry did not decrypt to its content");
	}
}

function pattern(size, seed) {
	return new Uint8Array(size).map((_, index) => (index * 131 + seed * 17 + (index >> 8)) & 0xff);
}

function sameBytes(first, second) {
	return first.length == second.length && first.every((value, index) => value == second[index]);
}
