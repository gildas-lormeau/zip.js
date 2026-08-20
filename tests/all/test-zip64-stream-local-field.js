/* global ReadableStream, TextEncoder, Blob */

import * as zip from "../zip-lib.js";

const CONTENT = "hello zip64 streaming ".repeat(8);

export { test };

// A streamed (unknown-size) zip64 entry must carry the local zip64 extra field so that a
// forward-only streaming reader can tell the trailing data descriptor holds 8-byte sizes
// (APPNOTE 4.3.9.2). When the local zip64 field is present the 32-bit size fields must hold
// the 0xFFFFFFFF sentinel (APPNOTE 4.5.3), otherwise the field is malformed.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await testStreamedZip64HasLocalField();
		await testNonZip64StreamHasNoLocalField();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testStreamedZip64HasLocalField() {
	// no zip64 option: an unknown-size stream defaults to zip64 + data descriptor
	const bytes = await writeStreamedEntry(CONTENT, { dataDescriptorSignature: true });
	const header = parseLocalHeader(bytes);
	if (!header.dataDescriptor) {
		throw new Error("expected a data descriptor (bit 3)");
	}
	if (header.compressedSize != 0xFFFFFFFF || header.uncompressedSize != 0xFFFFFFFF) {
		throw new Error("expected 0xFFFFFFFF size sentinels in the local header");
	}
	const zip64Field = header.extraFields.find(field => field.tag == 0x0001);
	if (!zip64Field) {
		throw new Error("missing local zip64 extra field");
	}
	if (zip64Field.dataSize != 16) {
		throw new Error("expected a 16-byte zip64 extra field body, got " + zip64Field.dataSize);
	}
	// the extra field length must be consistent (a wrong length makes the next field misparse)
	if (header.extraFieldsConsumed != header.extraFieldLength) {
		throw new Error("local extra fields do not parse cleanly");
	}
	if (dataDescriptorWidth(bytes) != 24) {
		throw new Error("expected an 8-byte (zip64) data descriptor");
	}
	await verifyRoundTrip(bytes, CONTENT);
}

async function testNonZip64StreamHasNoLocalField() {
	// an explicit zip64:false stream stays 32-bit: no local zip64 field, zeroed sizes
	const bytes = await writeStreamedEntry(CONTENT, { zip64: false, dataDescriptorSignature: true });
	const header = parseLocalHeader(bytes);
	if (header.extraFields.some(field => field.tag == 0x0001)) {
		throw new Error("non-zip64 stream must not carry a local zip64 extra field");
	}
	if (header.compressedSize != 0 || header.uncompressedSize != 0) {
		throw new Error("non-zip64 data descriptor entry must zero the local sizes");
	}
	if (dataDescriptorWidth(bytes) != 16) {
		throw new Error("expected a 4-byte (standard) data descriptor");
	}
	await verifyRoundTrip(bytes, CONTENT);
}

async function writeStreamedEntry(text, options) {
	const readable = new ReadableStream({
		start(controller) {
			controller.enqueue(new TextEncoder().encode(text));
			controller.close();
		}
	});
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await writer.add("stream.txt", { readable }, options);
	return writer.close();
}

function parseLocalHeader(bytes) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const bitFlag = view.getUint16(6, true);
	const compressedSize = view.getUint32(18, true);
	const uncompressedSize = view.getUint32(22, true);
	const filenameLength = view.getUint16(26, true);
	const extraFieldLength = view.getUint16(28, true);
	const extraFields = [];
	let offset = 30 + filenameLength;
	const extraFieldStart = offset;
	const extraFieldEnd = offset + extraFieldLength;
	while (offset + 4 <= extraFieldEnd) {
		const tag = view.getUint16(offset, true);
		const dataSize = view.getUint16(offset + 2, true);
		extraFields.push({ tag, dataSize });
		offset += 4 + dataSize;
	}
	return {
		dataDescriptor: (bitFlag & 0x08) != 0,
		compressedSize,
		uncompressedSize,
		extraFieldLength,
		extraFieldsConsumed: offset - extraFieldStart,
		extraFields
	};
}

// distance between the data-descriptor signature and the following central directory:
// 24 => 8-byte (zip64) sizes, 16 => 4-byte sizes
function dataDescriptorWidth(bytes) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	let cdPos = -1;
	for (let index = 0; index + 4 <= bytes.length; index++) {
		if (view.getUint32(index, true) == 0x02014b50) {
			cdPos = index;
			break;
		}
	}
	for (let index = cdPos - 4; index >= 0; index--) {
		if (view.getUint32(index, true) == 0x08074b50) {
			return cdPos - index;
		}
	}
	throw new Error("data descriptor signature not found");
}

async function verifyRoundTrip(bytes, expected) {
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])), { checkCrc32: true });
	const entries = await reader.getEntries();
	const content = await entries[0].getData(new zip.TextWriter());
	await reader.close();
	if (content != expected) {
		throw new Error("round-trip content mismatch");
	}
}
