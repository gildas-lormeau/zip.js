/* global Blob, TextEncoder */

import * as zip from "../zip-lib.js";

export { test };

// The Info-ZIP Unicode Path extra field (0x7075) can override an entry's filename after it has been
// decoded from the central directory. The directory flag must be derived from that final filename,
// not the pre-override one, otherwise entry.directory can contradict entry.filename (e.g. a name
// overridden to end with "/" would still be reported as a file).
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		// raw name has no trailing slash, the override adds one: the entry must be a directory
		await check("dir", "dir/", "dir/", true);
		// raw name has a trailing slash, the override removes it: the entry must be a file
		await check("dir/", "dir", "dir", false);
		// an unknown version means an unknown layout: the override must be ignored
		await checkUnknownVersion();
	} finally {
		await zip.terminateWorkers();
	}
}

async function check(rawName, overrideName, expectedFilename, expectedDirectory) {
	const bytes = craftArchive(rawName, overrideName);
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])));
	const [entry] = await reader.getEntries();
	await reader.close();
	if (entry.filename != expectedFilename) {
		throw new Error("filename " + JSON.stringify(entry.filename) + ", expected " + JSON.stringify(expectedFilename));
	}
	if (entry.directory != expectedDirectory) {
		throw new Error(JSON.stringify(entry.filename) + ": directory=" + entry.directory + ", expected " + expectedDirectory);
	}
	if (entry.filename.endsWith("/") != entry.directory) {
		throw new Error("directory flag contradicts the final filename " + JSON.stringify(entry.filename));
	}
}

async function checkUnknownVersion() {
	const bytes = craftArchive("dir", "dir/", 2);
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])));
	const [entry] = await reader.getEntries();
	await reader.close();
	if (entry.filename != "dir") {
		throw new Error("the override of a version 2 field must be ignored, got " + JSON.stringify(entry.filename));
	}
	const { extraFieldUnicodePath } = entry;
	if (!extraFieldUnicodePath || extraFieldUnicodePath.version != 2 || extraFieldUnicodePath.valid) {
		throw new Error("a version 2 field must be exposed but reported as invalid");
	}
}

function crc32(bytes) {
	let crc = 0xFFFFFFFF;
	for (let index = 0; index < bytes.length; index++) {
		crc ^= bytes[index];
		for (let bit = 0; bit < 8; bit++) {
			crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
		}
	}
	return (crc ^ 0xFFFFFFFF) >>> 0;
}

// build a minimal archive with one empty STORE entry named `rawName`, carrying a valid 0x7075
// Unicode Path extra field (in the central directory) that overrides the filename to `overrideName`
function craftArchive(rawName, overrideName, version = 1) {
	const encoder = new TextEncoder();
	const rawBytes = encoder.encode(rawName);
	const overrideBytes = encoder.encode(overrideName);
	const body = new Uint8Array(5 + overrideBytes.length);
	const bodyView = new DataView(body.buffer);
	bodyView.setUint8(0, version);
	bodyView.setUint32(1, crc32(rawBytes), true);
	body.set(overrideBytes, 5);
	const extra = new Uint8Array(4 + body.length);
	const extraView = new DataView(extra.buffer);
	extraView.setUint16(0, 0x7075, true);
	extraView.setUint16(2, body.length, true);
	extra.set(body, 4);

	const fnLen = rawBytes.length;
	const efLen = extra.length;
	const localHeaderLength = 30 + fnLen + efLen;
	const centralHeaderLength = 46 + fnLen + efLen;
	const out = new Uint8Array(localHeaderLength + centralHeaderLength + 22);
	const view = new DataView(out.buffer);
	let offset = 0;
	// local file header (bit 11 clear so the 0x7075 override is honored)
	view.setUint32(offset, 0x04034b50, true); offset += 4;
	view.setUint16(offset, 10, true); offset += 2;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 0x21, true); offset += 2;
	view.setUint32(offset, 0, true); offset += 4;
	view.setUint32(offset, 0, true); offset += 4;
	view.setUint32(offset, 0, true); offset += 4;
	view.setUint16(offset, fnLen, true); offset += 2;
	view.setUint16(offset, efLen, true); offset += 2;
	out.set(rawBytes, offset); offset += fnLen;
	out.set(extra, offset); offset += efLen;
	const centralHeaderOffset = offset;
	// central directory header (MS-DOS, no unix mode, no directory bit in external attributes)
	view.setUint32(offset, 0x02014b50, true); offset += 4;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 10, true); offset += 2;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 0x21, true); offset += 2;
	view.setUint32(offset, 0, true); offset += 4;
	view.setUint32(offset, 0, true); offset += 4;
	view.setUint32(offset, 0, true); offset += 4;
	view.setUint16(offset, fnLen, true); offset += 2;
	view.setUint16(offset, efLen, true); offset += 2;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint32(offset, 0, true); offset += 4;
	view.setUint32(offset, 0, true); offset += 4;
	out.set(rawBytes, offset); offset += fnLen;
	out.set(extra, offset); offset += efLen;
	// end of central directory record
	view.setUint32(offset, 0x06054b50, true); offset += 4;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 0, true); offset += 2;
	view.setUint16(offset, 1, true); offset += 2;
	view.setUint16(offset, 1, true); offset += 2;
	view.setUint32(offset, centralHeaderLength, true); offset += 4;
	view.setUint32(offset, centralHeaderOffset, true); offset += 4;
	view.setUint16(offset, 0, true);
	return out;
}
