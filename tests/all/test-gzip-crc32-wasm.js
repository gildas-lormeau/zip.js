/* global CompressionStream */

// Checks the gzip route of the wasm deflate: a fallback codec that requires the module is opened as
// gzip so the CRC-32 comes from its trailer, a fallback without the flag keeps raw deflate and the
// separate CRC pass, and the entries written through the wasm read back on both codecs with the CRC
// check on, at the level they asked for. The module flag is declared in index.d.ts, so the spy that
// stands for the wasm codec sets it the way a user class would and the minified builds read it.

import * as zip from "../zip-lib.js";

const PASSWORD = "password";
const TEXT = generateText(4000);
const ENTRIES = [
	["level1.txt", TEXT, { level: 1 }],
	["level9.txt", TEXT, { level: 9 }],
	["empty.txt", "", { level: 5 }],
	["zipcrypto.txt", TEXT, { level: 5, password: PASSWORD, zipCrypto: true }],
	["aes.txt", TEXT, { level: 5, password: PASSWORD }]
];

export { test };

async function test() {
	try {
		await zip.terminateWorkers();
		zip.configure({ useWebWorkers: false, useCompressionStream: false });
		const data = await writeEntries();
		const [level1, level9] = await readEntries(data);
		if (level1.compressedSize >= level1.uncompressedSize || level1.compressedSize <= level9.compressedSize) {
			throw new Error("expected the level to reach the codec, got " + level1.compressedSize + " bytes at level 1 and " + level9.compressedSize + " at level 9");
		}
		zip.resetConfiguration();
		zip.configure({ useWebWorkers: false });
		await readEntries(data);
		const formats = [];
		class SpyFallback {
			constructor(format, options) {
				formats.push(format);
				return new CompressionStream(format, options);
			}
		}
		class ModuleFallback extends SpyFallback { }
		ModuleFallback.requiresModule = true;
		zip.configure({ useCompressionStream: false, CompressionStreamFallback: ModuleFallback });
		await readEntries(await writeEntries([ENTRIES[1]]));
		zip.configure({ CompressionStreamFallback: SpyFallback });
		await readEntries(await writeEntries([ENTRIES[1]]));
		if (formats.join() != "gzip,deflate-raw") {
			throw new Error("expected the gzip route for the module codec and raw deflate for the port, got " + formats.join());
		}
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function writeEntries(entries = ENTRIES) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (const [name, content, options] of entries) {
		await zipWriter.add(name, new zip.TextReader(content), options);
	}
	return zipWriter.close();
}

async function readEntries(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = await zipReader.getEntries();
	for (const entry of entries) {
		const [, content] = ENTRIES.find(([name]) => name == entry.filename);
		const text = await entry.getData(new zip.TextWriter(), { checkCrc32: true, password: PASSWORD });
		if (text != content) {
			throw new Error("unexpected content in " + entry.filename);
		}
	}
	await zipReader.close();
	return entries;
}

function generateText(wordCount) {
	const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"];
	let seed = 42;
	const result = [];
	for (let index = 0; index < wordCount; index++) {
		seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
		result.push(words[seed % words.length]);
	}
	return result.join(" ");
}
