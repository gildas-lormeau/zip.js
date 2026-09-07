/* global WritableStream, ReadableStream, TextEncoder, TextDecoder, Blob, AbortController */

import * as zip from "../zip-lib.js";

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await testAbortedBufferedFlush();
		await testFailedDirectWrite();
	} finally {
		await zip.terminateWorkers();
	}
}

// When a buffered entry's flush is aborted mid-stream, the writer must advance its offset only by
// the bytes that actually reached the writer. Advancing by the full buffered size would corrupt
// the offsets of every entry written after the aborted one, producing an archive whose central
// directory points past the end of the file.
async function testAbortedBufferedFlush() {
	const controller = new AbortController();
	const chunks = [];
	let localHeaderSeen = false;
	// destination that aborts entry "big.bin"'s flush the moment its local header is written
	const writable = new WritableStream({
		write(chunk) {
			chunks.push(chunk.slice());
			if (!localHeaderSeen && contains(chunk, "big.bin")) {
				localHeaderSeen = true;
				controller.abort();
			}
		}
	});
	const zipWriter = new zip.ZipWriter(writable);
	// "first.txt" is written before the aborted entry, "last.txt" after it
	await zipWriter.add("first.txt", new zip.TextReader("first-entry"), { level: 0, bufferedWrite: true });
	let aborted = false;
	try {
		await zipWriter.add("big.bin", new zip.Uint8ArrayReader(new Uint8Array(100000).fill(0x41)),
			{ level: 0, bufferedWrite: true, signal: controller.signal });
	} catch (error) {
		aborted = error.corruptedEntry === true;
	}
	await zipWriter.add("last.txt", new zip.TextReader("last-entry"), { level: 0, bufferedWrite: true });
	await zipWriter.close();

	const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer());
	if (!aborted) {
		throw new Error("the aborted entry should reject with corruptedEntry");
	}
	// every surviving entry's central-directory offset must match its real local-header position
	for (const name of ["first.txt", "last.txt"]) {
		const actual = localHeaderOffset(bytes, name);
		const recorded = centralDirectoryOffset(bytes, name);
		if (actual == -1) {
			throw new Error("missing local header for " + name);
		}
		if (actual != recorded) {
			throw new Error("offset mismatch for " + name + ": recorded " + recorded + ", actual " + actual);
		}
	}
	// the end-of-central-directory record must point at the real central directory
	if (endOfCentralDirectoryOffset(bytes) != firstCentralDirectoryOffset(bytes)) {
		throw new Error("end of central directory points to the wrong offset");
	}
	// the surviving entries must still read back correctly
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])));
	const entries = await reader.getEntries();
	const contents = {};
	for (const entry of entries) {
		contents[entry.filename] = await entry.getData(new zip.TextWriter());
	}
	await reader.close();
	if (entries.length != 2 || contents["first.txt"] != "first-entry" || contents["last.txt"] != "last-entry") {
		throw new Error("surviving entries did not read back correctly");
	}
}

// The counterpart on the direct write path, where the recovery reads error.outputSize instead. That number
// used to come from the codec, which counts what it emits, while a ChunkStream sits between the codec and
// the writer: whatever was still in that buffer when the pipe aborted was counted as written and never was.
// The offsets of every entry after the failed one were then too high by exactly one chunkSize, 65536 bytes
// at the default, and a strict read of the salvaged archive failed with ERR_AMBIGUOUS_ARCHIVE. It stayed
// invisible because the failing entry has to be larger than one chunk for anything to be flushed at all.
async function testFailedDirectWrite() {
	const chunks = [];
	const writable = new WritableStream({ write: chunk => chunks.push(chunk.slice()) });
	const zipWriter = new zip.ZipWriter(writable, { level: 0 });
	await zipWriter.add("first.txt", new zip.TextReader("first-entry"));
	let pulls = 0;
	let failed = false;
	try {
		await zipWriter.add("failing.bin", new ReadableStream({
			pull(controller) {
				if (pulls++ < 3) {
					controller.enqueue(new Uint8Array(50000).fill(0x42));
				} else {
					controller.error(new Error("simulated mid-entry failure"));
				}
			}
		}));
	} catch (error) {
		failed = error.corruptedEntry === true;
	}
	await zipWriter.add("last.txt", new zip.TextReader("last-entry"));
	await zipWriter.close();
	const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer());
	if (!failed) {
		throw new Error("the failing entry should reject with corruptedEntry");
	}
	for (const name of ["first.txt", "last.txt"]) {
		const actual = localHeaderOffset(bytes, name);
		const recorded = centralDirectoryOffset(bytes, name);
		if (actual != recorded) {
			throw new Error("offset mismatch for " + name + ": recorded " + recorded + ", actual " + actual);
		}
	}
	const recordedDirectoryOffset = endOfCentralDirectoryOffset(bytes);
	const actualDirectoryOffset = firstCentralDirectoryOffset(bytes);
	if (recordedDirectoryOffset != actualDirectoryOffset) {
		throw new Error("end of central directory points to " + recordedDirectoryOffset +
			", the central directory is at " + actualDirectoryOffset);
	}
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])), { strictness: "strict" });
	const entries = await reader.getEntries();
	const contents = {};
	for (const entry of entries) {
		contents[entry.filename] = await entry.getData(new zip.TextWriter());
	}
	await reader.close();
	if (entries.length != 2 || contents["first.txt"] != "first-entry" || contents["last.txt"] != "last-entry") {
		throw new Error("surviving entries did not read back correctly");
	}
}

function contains(bytes, text) {
	const needle = new TextEncoder().encode(text);
	outer: for (let index = 0; index + needle.length <= bytes.length; index++) {
		for (let offset = 0; offset < needle.length; offset++) {
			if (bytes[index + offset] != needle[offset]) {
				continue outer;
			}
		}
		return true;
	}
	return false;
}

function localHeaderOffset(bytes, name) {
	const view = new DataView(bytes.buffer);
	for (let index = 0; index + 4 <= bytes.length; index++) {
		if (view.getUint32(index, true) == 0x04034b50) {
			const filenameLength = view.getUint16(index + 26, true);
			if (new TextDecoder().decode(bytes.subarray(index + 30, index + 30 + filenameLength)) == name) {
				return index;
			}
		}
	}
	return -1;
}

function centralDirectoryOffset(bytes, name) {
	const view = new DataView(bytes.buffer);
	for (let index = 0; index + 4 <= bytes.length; index++) {
		if (view.getUint32(index, true) == 0x02014b50) {
			const filenameLength = view.getUint16(index + 28, true);
			if (new TextDecoder().decode(bytes.subarray(index + 46, index + 46 + filenameLength)) == name) {
				return view.getUint32(index + 42, true);
			}
		}
	}
	return -1;
}

function firstCentralDirectoryOffset(bytes) {
	const view = new DataView(bytes.buffer);
	for (let index = 0; index + 4 <= bytes.length; index++) {
		if (view.getUint32(index, true) == 0x02014b50) {
			return index;
		}
	}
	return -1;
}

function endOfCentralDirectoryOffset(bytes) {
	const view = new DataView(bytes.buffer);
	for (let index = bytes.length - 22; index >= 0; index--) {
		if (view.getUint32(index, true) == 0x06054b50) {
			return view.getUint32(index + 16, true);
		}
	}
	return -1;
}
