/* global Blob, Response */

// index.d.ts types the prependZip parameter as accepting a ReadableStream, but every stream input used
// to fail with "ReadableStream is already locked": the entries were read from the stream and the same,
// already consumed object was then piped to the output. A seekable reader escaped it only because its
// readable getter mints a new stream on each access.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAMES = ["first.txt", "dir/second.txt", "extra.txt"];

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const sourceData = await buildSourceZip();
	await prependAndCheck(new zip.Uint8ArrayReader(sourceData), "Uint8ArrayReader");
	await prependAndCheck(new Blob([sourceData]).stream(), "Blob stream");
	await prependAndCheck(new Response(sourceData).body, "Response body");
	await zip.terminateWorkers();
}

async function buildSourceZip() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("first.txt", new zip.TextReader(TEXT_CONTENT));
	await zipWriter.add("dir/second.txt", new zip.TextReader(TEXT_CONTENT));
	return zipWriter.close();
}

async function prependAndCheck(source, description) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.prependZip(source);
	await zipWriter.add("extra.txt", new zip.TextReader(TEXT_CONTENT));
	const data = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	const filenames = entries.map(entry => entry.filename);
	if (filenames.join() != FILENAMES.join()) {
		throw new Error("expected " + FILENAMES.join() + " from " + description + " got " + filenames.join());
	}
	if (contents.some(content => content != TEXT_CONTENT)) {
		throw new Error("unexpected content from " + description);
	}
}
