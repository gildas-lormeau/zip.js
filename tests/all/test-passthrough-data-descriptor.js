/* global Blob, TransformStream, TextEncoder */

// A pass-through entry whose CRC-32 and sizes are all known before its data is written needs no data
// descriptor: the local header can carry them, like it does for a folder or an empty entry, and the entry
// keeps the direct write path. The descriptor stays when a value is unknown (a readable of unknown size,
// ZipCrypto whose check byte depends on bit 3) or when the option is set explicitly, so a copy made with
// the `entry` option keeps the shape of its source.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt";
const CONTENT = new TextEncoder().encode(TEXT_CONTENT);
const PASSWORD = "password";
const BITFLAG_DATA_DESCRIPTOR = 0x8;
const HEADER_OFFSET_CRC32 = 14;
const HEADER_OFFSET_COMPRESSED_SIZE = 18;
const MAX_32_BITS = 0xffffffff;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	const stored = await readSource({ level: 0 });
	const deflated = await readSource({});
	const aes = await readSource({ password: PASSWORD });
	const zipCrypto = await readSource({ password: PASSWORD, zipCrypto: true });
	const { crc32, uncompressedSize } = stored.entry;

	await checkEntry("stored pass-through", false, new zip.Uint8ArrayReader(stored.data),
		{ passThrough: true, crc32, uncompressedSize, compressionMethod: 0 });
	await checkEntry("deflated pass-through", false, new zip.Uint8ArrayReader(deflated.data),
		{ passThrough: true, crc32, uncompressedSize, compressionMethod: 8 });
	await checkEntry("stored pass-through with the deprecated signature option", false, new zip.Uint8ArrayReader(stored.data),
		{ passThrough: true, signature: crc32, uncompressedSize, compressionMethod: 0 });
	await checkEntry("zip64 pass-through", false, new zip.Uint8ArrayReader(stored.data),
		{ passThrough: true, crc32, uncompressedSize, compressionMethod: 0, zip64: true });
	await checkEntry("explicit dataDescriptor false", false, new zip.Uint8ArrayReader(stored.data),
		{ passThrough: true, crc32, uncompressedSize, compressionMethod: 0, dataDescriptor: false });
	await checkEntry("AES entry encrypted by the writer", false, new zip.Uint8ArrayReader(deflated.data),
		{ passThrough: "compressed", crc32, uncompressedSize, compressionMethod: 8, password: PASSWORD }, PASSWORD);
	await checkEntry("AES AE-2 entry copied without a CRC-32", false, new zip.Uint8ArrayReader(aes.data),
		{ passThrough: true, encrypted: true, encryptionStrength: 3, uncompressedSize, compressionMethod: 8 }, PASSWORD);

	await checkEntry("explicit dataDescriptor true", true, new zip.Uint8ArrayReader(stored.data),
		{ passThrough: true, crc32, uncompressedSize, compressionMethod: 0, dataDescriptor: true });
	await checkEntry("readable of unknown size", true, { readable: new Blob([stored.data]).stream() },
		{ passThrough: true, crc32, uncompressedSize, compressionMethod: 0 });
	await checkEntry("ZipCrypto entry copied by hand", true, new zip.Uint8ArrayReader(zipCrypto.data),
		{ passThrough: true, encrypted: true, zipCrypto: true, crc32, uncompressedSize, compressionMethod: 8, rawLastModDate: zipCrypto.entry.rawLastModDate }, PASSWORD);
	await checkEntry("ZipCrypto entry encrypted by the writer", true, new zip.Uint8ArrayReader(deflated.data),
		{ passThrough: "compressed", crc32, uncompressedSize, compressionMethod: 8, password: PASSWORD, zipCrypto: true }, PASSWORD);
	await checkEntry("copy with the entry option keeps the source shape", true, new zip.Uint8ArrayReader(aes.data),
		{ passThrough: true, entry: aes.entry }, PASSWORD);
	await checkEntry("stored entry compressed by the writer", true, new zip.Uint8ArrayReader(CONTENT), { level: 0 });
	await zip.terminateWorkers();
}

async function readSource(options) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), options);
	await zipWriter.add("lorem.txt", new zip.Uint8ArrayReader(CONTENT));
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await zipWriter.close()), { password: PASSWORD });
	const [entry] = await zipReader.getEntries();
	const data = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	await zipReader.close();
	return { entry, data };
}

async function checkEntry(description, expectedDataDescriptor, reader, options, password) {
	let tempStreamCreated = false;
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), {
		createTempStream: () => {
			tempStreamCreated = true;
			return new TransformStream();
		}
	});
	await zipWriter.add("lorem.txt", reader, options);
	const data = await zipWriter.close();
	const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
	const dataDescriptorBit = Boolean(dataView.getUint16(6, true) & BITFLAG_DATA_DESCRIPTOR);
	if (dataDescriptorBit != expectedDataDescriptor) {
		throw new Error(description + ": expected bit 3 to be " + expectedDataDescriptor + ", got " + dataDescriptorBit);
	}
	if (tempStreamCreated) {
		throw new Error(description + ": expected the direct write path, a temp stream was created");
	}
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict", checkCrc32: true, checkOverlappingEntry: true, password });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter());
	await zipReader.close();
	if (text != TEXT_CONTENT) {
		throw new Error(description + ": the entry must read back under strict checks");
	}
	if (!expectedDataDescriptor) {
		const headerCrc32 = dataView.getUint32(HEADER_OFFSET_CRC32, true);
		const headerCompressedSize = dataView.getUint32(HEADER_OFFSET_COMPRESSED_SIZE, true);
		const expectedCrc32 = entry.crc32 === undefined ? 0 : entry.crc32;
		const expectedCompressedSize = options.zip64 ? MAX_32_BITS : entry.compressedSize;
		if (headerCrc32 != expectedCrc32 || headerCompressedSize != expectedCompressedSize) {
			throw new Error(description + ": the local header must carry the CRC-32 and the compressed size, got " +
				headerCrc32.toString(16) + " and " + headerCompressedSize);
		}
	}
}
