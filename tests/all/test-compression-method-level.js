/* global Blob */

import * as zip from "../zip-lib.js";

export { test };

const TEXT_CONTENT = "The quick brown fox jumps over the lazy dog. ".repeat(40);
const COMPRESSION_METHOD_STORE = 0;
const COMPRESSION_METHOD_DEFLATE = 8;

// The data the writer actually produces must match the compression method it records in the header.
// When both compressionMethod and level are given they can contradict each other; the explicit
// method wins (STORE never compresses, DEFLATE always does). Before the fix,
// {compressionMethod:0, level:9} deflated the data but labeled it STORE, and
// {compressionMethod:8, level:0} stored the data but labeled it DEFLATE - both unreadable.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		// explicit STORE must stay stored regardless of level
		await check({ compressionMethod: 0, level: 9 }, COMPRESSION_METHOD_STORE, false);
		await check({ compressionMethod: 0, level: 0 }, COMPRESSION_METHOD_STORE, false);
		// explicit DEFLATE must stay deflated regardless of level
		await check({ compressionMethod: 8, level: 0 }, COMPRESSION_METHOD_DEFLATE, true);
		await check({ compressionMethod: 8, level: 9 }, COMPRESSION_METHOD_DEFLATE, true);
		// no explicit method: the level decides (compress unless it is zero)
		await check({ level: 0 }, COMPRESSION_METHOD_STORE, false);
		await check({ level: 9 }, COMPRESSION_METHOD_DEFLATE, true);
	} finally {
		await zip.terminateWorkers();
	}
}

async function check(options, expectedMethod, expectDeflateFormat) {
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await writer.add("entry.txt", new zip.TextReader(TEXT_CONTENT), options);
	const bytes = await writer.close();
	const { method, deflateFormat } = readFirstEntryHeader(bytes);
	const label = JSON.stringify(options);
	if (method != expectedMethod) {
		throw new Error(label + ": header method " + method + ", expected " + expectedMethod);
	}
	// STORE means the stored bytes equal the source bytes; DEFLATE means they are a deflate stream
	if (deflateFormat != expectDeflateFormat) {
		throw new Error(label + ": data is " + (deflateFormat ? "deflated" : "stored") +
			" but the method says " + (expectedMethod == COMPRESSION_METHOD_STORE ? "STORE" : "DEFLATE"));
	}
	// the entry must read back to the original content
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])), { checkCrc32: true });
	const [entry] = await reader.getEntries();
	const content = await entry.getData(new zip.TextWriter());
	await reader.close();
	if (content != TEXT_CONTENT) {
		throw new Error(label + ": entry did not round-trip");
	}
}

// return the first local file header's compression method, and whether its payload is a raw copy of
// the (known) source text (STORE) rather than a deflate stream
function readFirstEntryHeader(bytes) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const method = view.getUint16(8, true);
	const filenameLength = view.getUint16(26, true);
	const extraFieldLength = view.getUint16(28, true);
	const dataStart = 30 + filenameLength + extraFieldLength;
	// STORE writes the source bytes verbatim; the source is ASCII, so a stored payload starts with
	// the source's first bytes while a deflate stream does not
	const storedPrefix = "The quick";
	let stored = true;
	for (let index = 0; index < storedPrefix.length; index++) {
		if (bytes[dataStart + index] != storedPrefix.charCodeAt(index)) {
			stored = false;
			break;
		}
	}
	return { method, deflateFormat: !stored };
}
