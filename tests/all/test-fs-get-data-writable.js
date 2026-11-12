/* global WritableStream, TextDecoder */

// Locks the writer forms accepted by `ZipFileEntry#getData` on an entry added to the filesystem
// API: the declaration accepts a bare `WritableStream` and an object exposing a `writable`
// property, like the core `getData`, so both must be normalized rather than read as a Writer.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";

export { test };

async function test() {
	try {
		const fs = new zip.ZipFS();
		const entry = fs.addText("lorem.txt", TEXT_CONTENT);
		await assertWritten(entry, chunks => new WritableStream({ write(chunk) { chunks.push(chunk); } }), "WritableStream");
		await assertWritten(entry, chunks => ({ writable: new WritableStream({ write(chunk) { chunks.push(chunk); } }) }), "object with a writable property");
	} finally {
		await zip.terminateWorkers();
	}
}

async function assertWritten(entry, createWriter, label) {
	const chunks = [];
	await entry.getData(createWriter(chunks));
	const text = new TextDecoder().decode(concatChunks(chunks));
	if (text != TEXT_CONTENT) {
		throw new Error("unexpected content with a " + label + ": \"" + text + "\"");
	}
}

function concatChunks(chunks) {
	let length = 0;
	for (const chunk of chunks) {
		length += chunk.length;
	}
	const result = new Uint8Array(length);
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}
	return result;
}
