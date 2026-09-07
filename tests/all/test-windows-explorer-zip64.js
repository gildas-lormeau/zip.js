/* global fetch, URL */

import * as zip from "../zip-lib.js";

// Windows 10 Explorer compressing a 5 GB file of zeros with "Send to > Compressed folder". Three things no
// other fixture in the corpus has together: Deflate64 chosen for an entry too large for 32 bits, a zip64
// entry in an archive carrying NO zip64 end of central directory and no locator, and the two headers
// sentinelling different size fields. Nothing here inflates the entry: the 5 GB round trip costs 33 s, and
// the shape of the headers is the point.
const FIXTURE_URI = new URL("./../data/zeros-explorer-zip64.zip", import.meta.url).href;
const FILENAME = "big.bin";
const UNCOMPRESSED_SIZE = 5000000000;
const COMPRESSED_SIZE = 171739;
const COMPRESSION_METHOD_DEFLATE64 = 9;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const ZIP64_END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06064b50;
const ZIP64_END_OF_CENTRAL_DIRECTORY_LOCATOR_SIGNATURE = 0x07064b50;
const EXTRAFIELD_TYPE_ZIP64 = 0x0001;
const MAX_32_BITS = 0xffffffff;

export { test };

async function test() {
	const data = new Uint8Array(await (await fetch(FIXTURE_URI)).arrayBuffer());
	await readsTheEntryAtEveryStrictness(data);
	carriesNoZip64EndOfCentralDirectory(data);
	sentinelsADifferentSizeInEachHeader(data);
}

async function readsTheEntryAtEveryStrictness(data) {
	for (const strictness of ["strict", "balanced", "tolerant"]) {
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness });
		const entries = await zipReader.getEntries();
		const [entry] = entries;
		// passThrough copies the stored bytes out without inflating them, so the reader still has to locate
		// and bound the data with the zip64 sizes, and it reads 171 KB instead of 5 GB
		const rawData = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
		const { warnings } = zipReader;
		await zipReader.close();
		if (entries.length != 1 || entry.filename != FILENAME || !entry.zip64 ||
			entry.compressionMethod != COMPRESSION_METHOD_DEFLATE64 ||
			entry.uncompressedSize != UNCOMPRESSED_SIZE || entry.compressedSize != COMPRESSED_SIZE ||
			rawData.length != COMPRESSED_SIZE) {
			throw new Error("the entry read at " + strictness + " does not describe the archive");
		}
		if (warnings.length) {
			throw new Error("reading at " + strictness + " warned: " + JSON.stringify(warnings));
		}
	}
}

// the archive is 171 KB with one entry, so every field of the end of central directory fits in 32 bits and
// Explorer omits the zip64 record and its locator entirely, while the entry itself is zip64. Legal, and the
// reason this fixture is worth keeping: every other zip64 archive in the corpus carries the record.
function carriesNoZip64EndOfCentralDirectory(data) {
	for (const { label, signature } of [
		{ label: "zip64 end of central directory", signature: ZIP64_END_OF_CENTRAL_DIRECTORY_SIGNATURE },
		{ label: "zip64 end of central directory locator", signature: ZIP64_END_OF_CENTRAL_DIRECTORY_LOCATOR_SIGNATURE }
	]) {
		if (indexOfSignature(data, signature) != -1) {
			throw new Error("the archive is expected to carry no " + label + " record");
		}
	}
}

// APPNOTE 4.5.3 asks the zip64 field of a LOCAL header to carry both sizes as soon as it is present, while
// the central directory carries only the fields that overflowed. The compressed size is 171739 here, so it
// fits in its 32-bit field: the local header sentinels both sizes and holds 16 bytes, the central directory
// sentinels only the uncompressed size and holds 8. Note that this is not a deferred size, the flags are 0
// and both headers carry the crc32. The cross-check between the two headers has to accept the disagreement.
function sentinelsADifferentSizeInEachHeader(data) {
	const endOfCentralDirectoryOffset = lastIndexOfSignature(data, END_OF_CENTRAL_DIRECTORY_SIGNATURE);
	const centralOffset = getUint32(data, endOfCentralDirectoryOffset + 16);
	const localOffset = getUint32(data, centralOffset + 42);
	const localZip64FieldLength = getZip64FieldLength(data, localOffset + 30 + getUint16(data, localOffset + 26), getUint16(data, localOffset + 28));
	const centralZip64FieldLength = getZip64FieldLength(data, centralOffset + 46 + getUint16(data, centralOffset + 28), getUint16(data, centralOffset + 30));
	if (getUint32(data, localOffset + 18) != MAX_32_BITS || getUint32(data, localOffset + 22) != MAX_32_BITS ||
		localZip64FieldLength != 16) {
		throw new Error("the local header is expected to sentinel both sizes and hold a 16-byte zip64 field");
	}
	if (getUint32(data, centralOffset + 20) != COMPRESSED_SIZE || getUint32(data, centralOffset + 24) != MAX_32_BITS ||
		centralZip64FieldLength != 8) {
		throw new Error("the central directory is expected to sentinel the uncompressed size only and hold an 8-byte zip64 field");
	}
}

function getZip64FieldLength(data, offset, length) {
	for (let position = offset; position + 4 <= offset + length;) {
		const type = getUint16(data, position);
		const size = getUint16(data, position + 2);
		if (type == EXTRAFIELD_TYPE_ZIP64) {
			return size;
		}
		position += 4 + size;
	}
	return -1;
}

function indexOfSignature(data, signature) {
	for (let offset = 0; offset + 4 <= data.length; offset++) {
		if (getUint32(data, offset) == signature) {
			return offset;
		}
	}
	return -1;
}

function lastIndexOfSignature(data, signature) {
	for (let offset = data.length - 4; offset >= 0; offset--) {
		if (getUint32(data, offset) == signature) {
			return offset;
		}
	}
	return -1;
}

function getUint16(data, offset) {
	return data[offset] + data[offset + 1] * 0x100;
}

function getUint32(data, offset) {
	return getUint16(data, offset) + getUint16(data, offset + 2) * 0x10000;
}
