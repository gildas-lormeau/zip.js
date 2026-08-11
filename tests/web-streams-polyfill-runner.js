/* global Blob, TextDecoder, setTimeout, clearTimeout */

import {
	ReadableStream as PolyfillReadableStream,
	WritableStream as PolyfillWritableStream,
	TransformStream as PolyfillTransformStream
} from "npm:web-streams-polyfill@4.3.0";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const TIMEOUT = 10000;

const nativeReadablePrototype = Object.getPrototypeOf(new Blob([""]).stream());
globalThis.ReadableStream = PolyfillReadableStream;
globalThis.WritableStream = PolyfillWritableStream;
globalThis.TransformStream = PolyfillTransformStream;

let zip;

main();

async function main() {
	zip = await import("../lib/zip-native.js");
	zip.configure({ useWebWorkers: false });

	await roundTrip("polyfilled globals, full native platform streams");

	delete nativeReadablePrototype.pipeThrough;
	delete nativeReadablePrototype.pipeTo;
	delete globalThis.CompressionStream;
	delete globalThis.DecompressionStream;

	await roundTrip("polyfilled globals, Firefox 79 platform streams");
}

async function roundTrip(name) {
	try {
		await withTimeout((async () => {
			const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
			await zipWriter.add(FILENAME, new zip.BlobReader(new Blob([TEXT_CONTENT])));
			const zipBlob = await zipWriter.close();
			const zipReader = new zip.ZipReader(new zip.BlobReader(zipBlob));
			const entries = await zipReader.getEntries();
			const data = await entries[0].getData(new zip.Uint8ArrayWriter());
			await zipReader.close();
			if (TEXT_CONTENT != new TextDecoder().decode(data)) {
				throw new Error("Invalid content");
			}
		})());
	} catch (error) {
		error.message = name + ": " + error.message;
		throw error;
	}
}

async function withTimeout(promise) {
	let timeoutId;
	const timeout = new Promise((_, reject) => {
		timeoutId = setTimeout(() => reject(new Error("Timeout")), TIMEOUT);
	});
	try {
		return await Promise.race([promise, timeout]);
	} finally {
		clearTimeout(timeoutId);
	}
}
