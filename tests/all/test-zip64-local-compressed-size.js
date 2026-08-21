/* global Blob */

import * as zip from "../zip-lib.js";

export { test };

// On the direct write path (no buffering, so updateLocalHeader never patches the header) the local
// zip64 extra field's compressed-size slot is written ahead of the data. Plain STORE can assume
// compressedSize == uncompressedSize, but an encrypted STORE entry adds the encryption overhead and
// a passthrough entry carries an independent compressed size. Recording the uncompressed size in
// those cases makes the local header disagree with the data descriptor and the central directory.
// The slot must therefore hold either the real compressed size or a zip64 placeholder (0), never a
// third, wrong value.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		// encrypted STORE: compressed size is uncompressed size + encryption overhead
		await checkEncryptedStore("AES-256", { level: 0, zip64: true, password: "secret", encryptionStrength: 3 });
		await checkEncryptedStore("ZipCrypto", { level: 0, zip64: true, password: "secret", zipCrypto: true });
		// passthrough: compressed size is independent of (and here far smaller than) uncompressed size
		await checkPassThrough();
	} finally {
		await zip.terminateWorkers();
	}
}

async function checkEncryptedStore(label, options) {
	const uncompressedSize = 1000;
	const data = new Uint8Array(uncompressedSize).fill(0x41);
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await writer.add("entry.bin", new zip.Uint8ArrayReader(data), options);
	const bytes = await writer.close();
	const { localCompressed, centralCompressed } = zip64CompressedSizes(bytes);
	if (localCompressed != centralCompressed) {
		throw new Error(label + ": local zip64 compressed size " + localCompressed +
			" disagrees with the central directory " + centralCompressed);
	}
	if (localCompressed == uncompressedSize) {
		throw new Error(label + ": local zip64 compressed size still records the uncompressed size");
	}
	// the entry must still read back correctly
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])));
	const [entry] = await reader.getEntries();
	const back = await entry.getData(new zip.Uint8ArrayWriter(), { password: options.password });
	await reader.close();
	if (back.length != uncompressedSize || back.some(byte => byte != 0x41)) {
		throw new Error(label + ": entry did not round-trip");
	}
}

async function checkPassThrough() {
	const text = "Lorem ipsum dolor sit amet ".repeat(80);
	// produce a genuinely-compressed zip64 entry, then read its raw deflated bytes back
	let writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await writer.add("lorem.txt", new zip.TextReader(text), { zip64: true });
	const compressedZip = await writer.close();
	let reader = new zip.ZipReader(new zip.BlobReader(new Blob([compressedZip])));
	let [entry] = await reader.getEntries();
	const raw = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	const { signature, compressionMethod } = entry;
	await reader.close();
	// re-wrap the raw deflated bytes as a zip64 passthrough entry on the direct path
	writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await writer.add("lorem.txt", new zip.Uint8ArrayReader(raw),
		{ zip64: true, passThrough: true, uncompressedSize: text.length, signature, compressionMethod });
	const passThroughZip = await writer.close();
	const { localCompressed, centralCompressed } = zip64CompressedSizes(passThroughZip);
	// the raw deflated data is far smaller than the text, so the uncompressed size is a clear "lie"
	if (localCompressed != 0 && localCompressed != centralCompressed) {
		throw new Error("passthrough: local zip64 compressed size " + localCompressed +
			" is neither a placeholder nor the real compressed size " + centralCompressed);
	}
	if (localCompressed == text.length) {
		throw new Error("passthrough: local zip64 compressed size records the uncompressed size");
	}
	reader = new zip.ZipReader(new zip.BlobReader(new Blob([passThroughZip])));
	[entry] = await reader.getEntries();
	const back = await entry.getData(new zip.TextWriter(), { checkCrc32: true });
	await reader.close();
	if (back != text) {
		throw new Error("passthrough: entry did not round-trip");
	}
}

// read the compressed size the first entry advertises in its local header and in its central
// directory record, resolving the zip64 extra field (0x0001) when the 32-bit field is a sentinel
function zip64CompressedSizes(bytes) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	// local header at offset 0: compressed at 18, uncompressed at 22, filename length at 26,
	// extra length at 28, variable data from 30
	const localCompressed = resolveCompressed(view, 18, 22, 26, 28, 30);
	// first central-directory record: compressed at +20, uncompressed at +24, filename length at
	// +28, extra length at +30, variable data from +46
	let centralCompressed = -1;
	for (let index = 0; index + 4 <= bytes.length; index++) {
		if (view.getUint32(index, true) == 0x02014b50) {
			centralCompressed = resolveCompressed(view, index + 20, index + 24, index + 28, index + 30, index + 46);
			break;
		}
	}
	return { localCompressed, centralCompressed };
}

// the zip64 sub-field lists only the sizes whose 32-bit field holds the 0xFFFFFFFF sentinel, and
// the uncompressed size always precedes the compressed size
function resolveCompressed(view, compressedOffset, uncompressedOffset, filenameLengthOffset, extraLengthOffset, extraStart) {
	if (view.getUint32(compressedOffset, true) != 0xFFFFFFFF) {
		return view.getUint32(compressedOffset, true);
	}
	const uncompressedSentinel = view.getUint32(uncompressedOffset, true) == 0xFFFFFFFF;
	let offset = extraStart + view.getUint16(filenameLengthOffset, true);
	const end = offset + view.getUint16(extraLengthOffset, true);
	while (offset + 4 <= end) {
		const tag = view.getUint16(offset, true);
		const dataSize = view.getUint16(offset + 2, true);
		if (tag == 0x0001) {
			return Number(view.getBigUint64(offset + 4 + (uncompressedSentinel ? 8 : 0), true));
		}
		offset += 4 + dataSize;
	}
	return -1;
}
