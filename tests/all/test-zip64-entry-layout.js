/* global ReadableStream, TextEncoder */

// An entry read from a stream of unknown size must commit to zip64 in its local header: the size of
// the data descriptor is decided before the first byte is written. Once the entry is complete the
// central directory knows the real sizes, so it must drop that commitment when they fit in 32 bits.
// macOS Archive Utility reads the 32-bit fields of the central directory and ignores the zip64 extra
// field of an entry unless the archive ends with a zip64 end of central directory record, so an
// entry left marked as zip64 in an archive that does not announce zip64 is read as 4GB of data.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const FILENAME = "entry.bin";
const PASSWORD = "secret";
const MAX_32_BITS = 0xffffffff;
const ZIP64_EXTRA_FIELD_TYPE = 0x0001;
const ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 0x06064b50;
const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;

export { test };

async function test() {
	await downgradesTheCentralDirectoryOfAStreamedEntry();
	await announcesZip64WhenAnEntryStaysZip64();
	await zip.terminateWorkers();
}

async function downgradesTheCentralDirectoryOfAStreamedEntry() {
	const entryOptions = [
		{ compressionMethod: 0 },
		{ compressionMethod: 8 },
		{ compressionMethod: 0, password: PASSWORD },
		{ compressionMethod: 0, password: PASSWORD, zipCrypto: true }
	];
	for (const options of entryOptions) {
		const label = JSON.stringify(options);
		const archive = await buildZipFile(options);
		const local = readLocalHeader(archive);
		const central = readCentralHeader(archive);
		if (!local.dataDescriptor || !local.extraFieldZip64) {
			throw new Error("expected a streamed zip64 local header, " + label);
		}
		if (local.extraFieldZip64.some(size => size != 0)) {
			throw new Error("expected zero placeholders in the local zip64 extra field, got " + local.extraFieldZip64.join(", ") + ", " + label);
		}
		if (central.extraFieldZip64 || central.compressedSize == MAX_32_BITS || central.uncompressedSize != TEXT_CONTENT.length) {
			throw new Error("expected a central directory without zip64, " + label);
		}
		if (findZip64EndOfCentralDirectory(archive) !== undefined) {
			throw new Error("expected no zip64 end of central directory record, " + label);
		}
		await checkContent(archive, options.password);
	}
}

async function announcesZip64WhenAnEntryStaysZip64() {
	const archive = await buildZipFile({ zip64: true });
	const central = readCentralHeader(archive);
	if (!central.extraFieldZip64 || central.uncompressedSize != MAX_32_BITS) {
		throw new Error("expected the central directory of an explicit zip64 entry to stay zip64");
	}
	if (findZip64EndOfCentralDirectory(archive) === undefined) {
		throw new Error("expected a zip64 end of central directory record");
	}
	await checkContent(archive);
}

async function buildZipFile(options) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, createStream(), options);
	return zipWriter.close();
}

function createStream() {
	return new ReadableStream({
		start(controller) {
			controller.enqueue(new TextEncoder().encode(TEXT_CONTENT));
			controller.close();
		}
	});
}

async function checkContent(archive, password) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(archive), { strictness: "strict", checkCrc32: true, password });
	const entries = await zipReader.getEntries();
	const content = await entries[0].getData(new zip.TextWriter());
	await zipReader.close();
	if (entries.length != 1 || content != TEXT_CONTENT) {
		throw new Error("expected one readable entry, got " + entries.length + " entries");
	}
}

function readLocalHeader(archive) {
	const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
	const nameLength = view.getUint16(26, true);
	return {
		dataDescriptor: Boolean(view.getUint16(6, true) & 0x08),
		compressedSize: view.getUint32(18, true),
		uncompressedSize: view.getUint32(22, true),
		extraFieldZip64: readExtraFieldZip64(view, 30 + nameLength, view.getUint16(28, true))
	};
}

function readCentralHeader(archive) {
	const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
	const offset = findCentralDirectory(archive);
	const nameLength = view.getUint16(offset + 28, true);
	return {
		compressedSize: view.getUint32(offset + 20, true),
		uncompressedSize: view.getUint32(offset + 24, true),
		extraFieldZip64: readExtraFieldZip64(view, offset + 46 + nameLength, view.getUint16(offset + 30, true))
	};
}

function readExtraFieldZip64(view, offset, length) {
	const end = offset + length;
	while (offset < end) {
		const type = view.getUint16(offset, true);
		const size = view.getUint16(offset + 2, true);
		if (type == ZIP64_EXTRA_FIELD_TYPE) {
			const sizes = [];
			for (let index = 0; index + 8 <= size; index += 8) {
				sizes.push(Number(view.getBigUint64(offset + 4 + index, true)));
			}
			return sizes;
		}
		offset += 4 + size;
	}
}

function findCentralDirectory(archive) {
	const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
	const offsetZip64 = findZip64EndOfCentralDirectory(archive);
	if (offsetZip64 !== undefined) {
		return Number(view.getBigUint64(offsetZip64 + 48, true));
	}
	for (let offset = archive.length - 22; offset >= 0; offset--) {
		if (view.getUint32(offset, true) == END_OF_CENTRAL_DIR_SIGNATURE) {
			return view.getUint32(offset + 16, true);
		}
	}
	throw new Error("no end of central directory record");
}

function findZip64EndOfCentralDirectory(archive) {
	const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
	for (let offset = archive.length - 4; offset >= 0; offset--) {
		if (view.getUint32(offset, true) == ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
			return offset;
		}
	}
}
