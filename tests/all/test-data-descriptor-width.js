/* global TextEncoder */

// The width of the sizes of a data descriptor is not told reliably by either record: the local file header
// is written before a streaming writer knows the sizes, and the zip64 extra field of the central directory
// record, written last, describes that record, not the descriptor.
// Go's archive/zip gives a small entry placed past 4 GiB a zip64 extra field in the central directory
// record for its offset alone, no local zip64 field and a 4-byte descriptor, while its large streamed
// entries get an 8-byte descriptor with no local field either. The reader used to take 8 bytes whenever
// either record carried the field, then read the sizes of the small entry across the next record, which the
// 64-bit guard rejected under checkOverlappingEntry. It now keeps the layout whose values agree with the
// central directory, among the two widths with and without the signature, and falls back to the announced
// width when none does. The archives below are built by hand; the ones past 4 GiB sit behind a reader that
// fakes the prefix, so the offsets are real and nothing that large is allocated.

import * as zip from "../zip-lib.js";

const FOUR_GIB = 0x100000000;
const MAX_32_BITS = 0xFFFFFFFF;
const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
const DATA_DESCRIPTOR_SIGNATURE = 0x08074b50;
const ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 0x06064b50;
const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 0x07064b50;
const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
const EXTRAFIELD_TYPE_ZIP64 = 0x0001;
const BITFLAG_DATA_DESCRIPTOR = 0x0008;
const FIRST_CONTENT = "first entry, streamed with a data descriptor ".repeat(4);
const SECOND_CONTENT = "second entry, right after the descriptor ".repeat(4);
const CRC32_TABLE = new Int32Array(256).map((_, index) => {
	let value = index;
	for (let bit = 0; bit < 8; bit++) {
		value = value & 1 ? 0xEDB88320 ^ (value >>> 1) : value >>> 1;
	}
	return value;
});
const CASES = [
	{ label: "4-byte signed descriptor, offsets past 4 GiB", prefix: FOUR_GIB, descriptor: { zip64: false, signature: true } },
	{ label: "4-byte signed descriptor, offsets below 4 GiB", prefix: 0, descriptor: { zip64: false, signature: true } },
	{ label: "4-byte unsigned descriptor, offsets past 4 GiB", prefix: FOUR_GIB, descriptor: { zip64: false, signature: false } },
	{ label: "8-byte descriptor, zip64 sizes in the central directory only", prefix: 0, descriptor: { zip64: true, signature: true }, directorySizes64: true },
	{ label: "8-byte descriptor, zip64 field in neither record", prefix: 0, descriptor: { zip64: true, signature: true } },
	{ label: "8-byte unsigned descriptor, zip64 field in neither record", prefix: 0, descriptor: { zip64: true, signature: false } }
];

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		for (const testCase of CASES) {
			for (const order of [[0, 1], [1, 0]]) {
				await checkArchive(testCase, order);
			}
		}
		await checkCorruptDescriptor();
	} finally {
		await zip.terminateWorkers();
	}
}

async function checkArchive(testCase, order) {
	const { label, prefix, descriptor, directorySizes64 } = testCase;
	const bytes = buildArchive({ prefix, descriptor, directorySizes64 });
	const zipReader = new zip.ZipReader(new PrefixedReader(prefix, bytes), { checkOverlappingEntry: true });
	const entries = await zipReader.getEntries();
	for (const index of order) {
		const entry = entries[index];
		const content = await entry.getData(new zip.TextWriter());
		if (content != (index ? SECOND_CONTENT : FIRST_CONTENT)) {
			throw new Error(label + ": the content of entry " + index + " must be read");
		}
		if (entry.warnings.length) {
			throw new Error(label + ": unexpected warnings " + JSON.stringify(entry.warnings.map(warning => warning.reason)));
		}
	}
	await zipReader.close();
	const { dataDescriptor } = entries[0].localDirectory;
	if (!dataDescriptor || dataDescriptor.zip64 != descriptor.zip64 || dataDescriptor.signature != descriptor.signature ||
		dataDescriptor.crc32 != entries[0].crc32 || dataDescriptor.compressedSize != FIRST_CONTENT.length ||
		dataDescriptor.uncompressedSize != FIRST_CONTENT.length) {
		throw new Error(label + ": the data descriptor must be read with its own layout, got " + JSON.stringify(dataDescriptor));
	}
}

async function checkCorruptDescriptor() {
	const bytes = buildArchive({ prefix: 0, descriptor: { zip64: false, signature: true }, corruptDescriptor: true });
	const zipReader = new zip.ZipReader(new PrefixedReader(0, bytes), { checkOverlappingEntry: true });
	const entries = await zipReader.getEntries();
	for (const entry of entries) {
		await entry.getData(new zip.TextWriter());
	}
	await zipReader.close();
	const { dataDescriptor } = entries[0].localDirectory;
	if (!dataDescriptor || dataDescriptor.signature || dataDescriptor.zip64) {
		throw new Error("a descriptor agreeing with no layout must be read at the announced width without the signature, got " + JSON.stringify(dataDescriptor));
	}
}

function buildArchive({ prefix, descriptor, directorySizes64, corruptDescriptor }) {
	const encoder = new TextEncoder();
	const parts = [];
	let length = 0;
	const push = (...chunks) => chunks.forEach(chunk => {
		parts.push(chunk);
		length += chunk.length;
	});
	const zip64Offsets = prefix >= MAX_32_BITS;
	const zip64 = zip64Offsets || directorySizes64;
	const entries = [
		{ name: "streamed.txt", data: encoder.encode(FIRST_CONTENT), descriptor },
		{ name: "second.txt", data: encoder.encode(SECOND_CONTENT) }
	];
	for (const entry of entries) {
		entry.crc32 = crc32(entry.data);
		entry.offset = prefix + length;
		const name = encoder.encode(entry.name);
		const streamed = Boolean(entry.descriptor);
		push(uint32(LOCAL_FILE_HEADER_SIGNATURE), uint16(20), uint16(streamed ? BITFLAG_DATA_DESCRIPTOR : 0), uint16(0), uint16(0), uint16(0x0021),
			uint32(streamed ? 0 : entry.crc32), uint32(streamed ? 0 : entry.data.length), uint32(streamed ? 0 : entry.data.length),
			uint16(name.length), uint16(0), name, entry.data);
		if (streamed) {
			const size = entry.descriptor.zip64 ? uint64 : uint32;
			if (entry.descriptor.signature) {
				push(uint32(DATA_DESCRIPTOR_SIGNATURE));
			}
			push(uint32(corruptDescriptor ? entry.crc32 ^ 0xFFFFFFFF : entry.crc32), size(entry.data.length), size(entry.data.length));
		}
	}
	const directoryOffset = prefix + length;
	for (const entry of entries) {
		const name = encoder.encode(entry.name);
		const extraField = [];
		if (directorySizes64) {
			extraField.push(uint64(entry.data.length), uint64(entry.data.length));
		}
		if (zip64Offsets) {
			extraField.push(uint64(entry.offset));
		}
		const extraFieldLength = extraField.reduce((total, part) => total + part.length, 0);
		const size = directorySizes64 ? MAX_32_BITS : entry.data.length;
		push(uint32(CENTRAL_FILE_HEADER_SIGNATURE), uint16(zip64 ? 45 : 20), uint16(zip64 ? 45 : 20), uint16(entry.descriptor ? BITFLAG_DATA_DESCRIPTOR : 0),
			uint16(0), uint16(0), uint16(0x0021), uint32(entry.crc32), uint32(size), uint32(size), uint16(name.length),
			uint16(extraFieldLength ? extraFieldLength + 4 : 0), uint16(0), uint16(0), uint16(0), uint32(0),
			uint32(zip64Offsets ? MAX_32_BITS : entry.offset), name);
		if (extraFieldLength) {
			push(uint16(EXTRAFIELD_TYPE_ZIP64), uint16(extraFieldLength), ...extraField);
		}
	}
	const directoryLength = prefix + length - directoryOffset;
	if (zip64) {
		const endOfDirectoryOffset = prefix + length;
		push(uint32(ZIP64_END_OF_CENTRAL_DIR_SIGNATURE), uint64(44), uint16(45), uint16(45), uint32(0), uint32(0), uint64(2), uint64(2),
			uint64(directoryLength), uint64(directoryOffset));
		push(uint32(ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE), uint32(0), uint64(endOfDirectoryOffset), uint32(1));
	}
	push(uint32(END_OF_CENTRAL_DIR_SIGNATURE), uint16(0), uint16(0), uint16(2), uint16(2), uint32(directoryLength),
		uint32(zip64Offsets ? MAX_32_BITS : directoryOffset), uint16(0));
	const bytes = new Uint8Array(length);
	let offset = 0;
	for (const part of parts) {
		bytes.set(part, offset);
		offset += part.length;
	}
	return bytes;
}

class PrefixedReader extends zip.Reader {
	constructor(prefixLength, bytes) {
		super();
		this.prefixLength = prefixLength;
		this.bytes = bytes;
		this.size = prefixLength + bytes.length;
	}

	readUint8Array(index, length) {
		const result = new Uint8Array(length);
		const start = Math.max(index, this.prefixLength) - this.prefixLength;
		const end = Math.min(index + length, this.size) - this.prefixLength;
		if (end > start) {
			result.set(this.bytes.subarray(start, end), Math.max(this.prefixLength - index, 0));
		}
		return result;
	}
}

function crc32(bytes) {
	let value = -1;
	for (const byte of bytes) {
		value = CRC32_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
	}
	return (value ^ -1) >>> 0;
}

function uint16(value) {
	return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
}

function uint32(value) {
	return new Uint8Array([value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff]);
}

function uint64(value) {
	const bytes = new Uint8Array(8);
	new DataView(bytes.buffer).setBigUint64(0, BigInt(value), true);
	return bytes;
}
