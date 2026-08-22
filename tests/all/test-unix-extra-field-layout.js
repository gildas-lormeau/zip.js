/* global Blob */

import * as zip from "../zip-lib.js";

export { test };

// The two Info-ZIP Unix extra fields have different layouts (per the Info-ZIP extrafld.txt spec):
//   0x7855 "Ux"  (unix)    : fixed 2-byte uid + gid, no mode (TSize = 4)
//   0x7875 "ux"  (infozip) : version(1) + uidSize(1) + uid + gidSize(1) + gid  (variable length)
// The file mode is carried in the external file attributes, not in the 0x7855 field. This test pins
// the on-disk layout so it cannot silently regress to the old (0x7875-shaped) 0x7855 encoding.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await checkUnixField();
		await checkInfoZipField();
		await checkInfoZipFieldSingleId();
	} finally {
		await zip.terminateWorkers();
	}
}

async function checkUnixField() {
	const bytes = await write({ compressionMethod: 0, unixExtraFieldType: "unix", uid: 1000, gid: 1234, unixMode: 0o100755 });
	const field = localExtraField(bytes, 0x7855);
	if (!field) {
		throw new Error("missing local 0x7855 field");
	}
	// exactly uid(2) + gid(2), little-endian, and nothing else (no version byte, no mode)
	if (field.length != 4) {
		throw new Error("0x7855 body length " + field.length + ", expected 4");
	}
	const view = new DataView(field.buffer, field.byteOffset, field.byteLength);
	if (view.getUint16(0, true) != 1000 || view.getUint16(2, true) != 1234) {
		throw new Error("0x7855 uid/gid not encoded as fixed 2-byte values");
	}
	// uid/gid come from the field, the mode from the external file attributes
	const entry = await read(bytes);
	if (entry.uid != 1000 || entry.gid != 1234) {
		throw new Error("0x7855 uid/gid did not round-trip");
	}
	if ((entry.unixMode & 0xFFFF) != (0o100755 & 0xFFFF)) {
		throw new Error("mode did not round-trip via the external file attributes");
	}
}

async function checkInfoZipField() {
	const bytes = await write({ compressionMethod: 0, unixExtraFieldType: "infozip", uid: 1000, gid: 1234 });
	const field = localExtraField(bytes, 0x7875);
	if (!field) {
		throw new Error("missing local 0x7875 field");
	}
	// version=1, uidSize=2, uid=1000, gidSize=2, gid=1234
	if (field.length != 7 || field[0] != 1 || field[1] != 2 || field[4] != 2) {
		throw new Error("0x7875 field is not version + variable-length uid/gid");
	}
	const view = new DataView(field.buffer, field.byteOffset, field.byteLength);
	if (view.getUint16(2, true) != 1000 || view.getUint16(5, true) != 1234) {
		throw new Error("0x7875 uid/gid mismatch");
	}
	const entry = await read(bytes);
	if (entry.uid != 1000 || entry.gid != 1234) {
		throw new Error("0x7875 uid/gid did not round-trip");
	}
}

// When only one of uid/gid is set, the other defaults to 0 and is still written with a size of at
// least 1: Info-ZIP always emits both ids, and a size of 0 is at the mercy of other parsers.
async function checkInfoZipFieldSingleId() {
	const bytes = await write({ compressionMethod: 0, uid: 1000 });
	const field = localExtraField(bytes, 0x7875);
	if (!field) {
		throw new Error("missing local 0x7875 field");
	}
	// version=1, uidSize=2, uid=1000, gidSize=1, gid=0
	if (field.length != 6 || field[0] != 1 || field[1] != 2 || field[4] != 1 || field[5] != 0) {
		throw new Error("expected the missing gid to be written as a 1-byte 0, got body " + Array.from(field).join(","));
	}
	const entry = await read(bytes);
	if (entry.uid != 1000 || entry.gid != 0) {
		throw new Error("uid-only entry did not round-trip, got " + entry.uid + "/" + entry.gid);
	}
}

async function write(options) {
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await writer.add("file.txt", new zip.Uint8ArrayReader(new Uint8Array([0x41])), options);
	return writer.close();
}

async function read(bytes) {
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])));
	const [entry] = await reader.getEntries();
	await reader.close();
	return entry;
}

// return the body (payload after tag+size) of the given extra field tag in the first local header
function localExtraField(bytes, tag) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const filenameLength = view.getUint16(26, true);
	const extraFieldLength = view.getUint16(28, true);
	let offset = 30 + filenameLength;
	const end = offset + extraFieldLength;
	while (offset + 4 <= end) {
		const fieldTag = view.getUint16(offset, true);
		const fieldSize = view.getUint16(offset + 2, true);
		if (fieldTag == tag) {
			return bytes.subarray(offset + 4, offset + 4 + fieldSize);
		}
		offset += 4 + fieldSize;
	}
	return null;
}
