// A fallback codec that cannot be constructed fails the entry when the native codec is turned off: with
// useCompressionStream false the fallback is the codec the caller asked for, so its error propagates instead
// of being hidden by the gzip route of the native codec. With the native codec allowed the same broken
// fallback stays harmless: a native codec taking "deflate-raw" never reaches it, and one lacking the format
// is rescued on its gzip route.

import * as zip from "../zip-lib.js";

const CONTENT = "lorem ipsum dolor sit amet ".repeat(200);
const ERR_BROKEN_FALLBACK = "broken fallback codec";

export { test };

class BrokenCompressionStream {
	constructor() {
		throw new Error(ERR_BROKEN_FALLBACK);
	}
}

class BrokenDecompressionStream {
	constructor() {
		throw new Error(ERR_BROKEN_FALLBACK);
	}
}

async function test() {
	try {
		await zip.terminateWorkers();
		zip.configure({ useWebWorkers: false });
		const data = await writeEntry();
		zip.configure({
			useCompressionStream: false,
			CompressionStreamFallback: BrokenCompressionStream,
			DecompressionStreamFallback: BrokenDecompressionStream
		});
		await expectBrokenFallback(() => writeEntry(), "add");
		await expectBrokenFallback(() => readEntry(data), "getData");
		zip.configure({ useCompressionStream: true });
		if (await readEntry(await writeEntry()) != CONTENT) {
			throw new Error("expected the native codec to keep the broken fallback harmless");
		}
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

async function writeEntry() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("entry.txt", new zip.TextReader(CONTENT));
	return zipWriter.close();
}

async function readEntry(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter());
	await zipReader.close();
	return text;
}

async function expectBrokenFallback(run, label) {
	let caughtError;
	try {
		await run();
	} catch (error) {
		caughtError = error;
	}
	if (!caughtError || caughtError.message != ERR_BROKEN_FALLBACK) {
		throw new Error("expected " + label + " to fail with the fallback error, got: " + caughtError);
	}
}
