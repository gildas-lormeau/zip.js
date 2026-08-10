const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 0x07064b50;
const DATA_DESCRIPTOR_RECORD_SIGNATURE = 0x08074b50;
const LOCAL_FILE_HEADER_LENGTH = 30;
const CENTRAL_FILE_HEADER_LENGTH = 46;
const END_OF_CENTRAL_DIR_LENGTH = 22;
const BITFLAG_DATA_DESCRIPTOR = 0x8;

export { parseZip };

function parseZip(data) {
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	const eocd = findEndOfCentralDirectory(data, view);
	const zip64 = eocd.offset >= 20 && view.getUint32(eocd.offset - 20, true) == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE;
	const entries = [];
	let directoryOffset = eocd.directoryOffset;
	for (let indexEntry = 0; indexEntry < eocd.totalEntries; indexEntry++) {
		const cd = parseCentralDirectoryEntry(data, view, directoryOffset);
		directoryOffset = cd.endOffset;
		const local = parseLocalHeader(data, view, cd.localHeaderOffset);
		const payload = { start: local.endOffset, end: local.endOffset + cd.compressedSize };
		let dataDescriptor = null;
		let entryEndOffset = payload.end;
		if (local.bitFlag & BITFLAG_DATA_DESCRIPTOR) {
			dataDescriptor = parseDataDescriptor(data, view, payload.end, cd);
			entryEndOffset = dataDescriptor.endOffset;
		}
		entries.push({ index: indexEntry, cd, local, payload, dataDescriptor, startOffset: cd.localHeaderOffset, endOffset: entryEndOffset });
	}
	const gaps = findGaps(data, entries, eocd, zip64);
	return { data, entries, eocd, zip64, gaps };
}

function findEndOfCentralDirectory(data, view) {
	for (let offset = data.length - END_OF_CENTRAL_DIR_LENGTH; offset >= 0; offset--) {
		if (view.getUint32(offset, true) == END_OF_CENTRAL_DIR_SIGNATURE) {
			const commentLength = view.getUint16(offset + 20, true);
			if (offset + END_OF_CENTRAL_DIR_LENGTH + commentLength == data.length) {
				return {
					offset,
					diskNumber: view.getUint16(offset + 4, true),
					directoryDiskNumber: view.getUint16(offset + 6, true),
					diskEntries: view.getUint16(offset + 8, true),
					totalEntries: view.getUint16(offset + 10, true),
					directorySize: view.getUint32(offset + 12, true),
					directoryOffset: view.getUint32(offset + 16, true),
					commentBytes: data.slice(offset + END_OF_CENTRAL_DIR_LENGTH)
				};
			}
		}
	}
	throw new Error("End of central directory record not found");
}

function parseCentralDirectoryEntry(data, view, offset) {
	if (view.getUint32(offset, true) != CENTRAL_FILE_HEADER_SIGNATURE) {
		throw new Error("Invalid central directory record at offset " + offset);
	}
	const filenameLength = view.getUint16(offset + 28, true);
	const extraFieldLength = view.getUint16(offset + 30, true);
	const commentLength = view.getUint16(offset + 32, true);
	const filenameOffset = offset + CENTRAL_FILE_HEADER_LENGTH;
	const extraFieldOffset = filenameOffset + filenameLength;
	const commentOffset = extraFieldOffset + extraFieldLength;
	const extraFieldBytes = data.slice(extraFieldOffset, extraFieldOffset + extraFieldLength);
	return {
		offset,
		versionMadeBy: view.getUint16(offset + 4, true),
		versionNeeded: view.getUint16(offset + 6, true),
		bitFlag: view.getUint16(offset + 8, true),
		compressionMethod: view.getUint16(offset + 10, true),
		rawLastModDate: view.getUint32(offset + 12, true),
		crc32: view.getUint32(offset + 16, true),
		compressedSize: view.getUint32(offset + 20, true),
		uncompressedSize: view.getUint32(offset + 24, true),
		diskNumberStart: view.getUint16(offset + 34, true),
		internalFileAttributes: view.getUint16(offset + 36, true),
		externalFileAttributes: view.getUint32(offset + 38, true),
		localHeaderOffset: view.getUint32(offset + 42, true),
		filenameBytes: data.slice(filenameOffset, filenameOffset + filenameLength),
		extraFieldBytes,
		extraFields: parseExtraFields(extraFieldBytes),
		commentBytes: data.slice(commentOffset, commentOffset + commentLength),
		endOffset: commentOffset + commentLength
	};
}

function parseLocalHeader(data, view, offset) {
	if (view.getUint32(offset, true) != LOCAL_FILE_HEADER_SIGNATURE) {
		throw new Error("Invalid local file header at offset " + offset);
	}
	const filenameLength = view.getUint16(offset + 26, true);
	const extraFieldLength = view.getUint16(offset + 28, true);
	const filenameOffset = offset + LOCAL_FILE_HEADER_LENGTH;
	const extraFieldOffset = filenameOffset + filenameLength;
	const extraFieldBytes = data.slice(extraFieldOffset, extraFieldOffset + extraFieldLength);
	return {
		offset,
		versionNeeded: view.getUint16(offset + 4, true),
		bitFlag: view.getUint16(offset + 6, true),
		compressionMethod: view.getUint16(offset + 8, true),
		rawLastModDate: view.getUint32(offset + 10, true),
		crc32: view.getUint32(offset + 14, true),
		compressedSize: view.getUint32(offset + 18, true),
		uncompressedSize: view.getUint32(offset + 22, true),
		filenameBytes: data.slice(filenameOffset, filenameOffset + filenameLength),
		extraFieldBytes,
		extraFields: parseExtraFields(extraFieldBytes),
		endOffset: extraFieldOffset + extraFieldLength
	};
}

function parseDataDescriptor(data, view, offset, cd) {
	const matchesAt = valuesOffset =>
		view.getUint32(valuesOffset, true) == cd.crc32 &&
		view.getUint32(valuesOffset + 4, true) == cd.compressedSize &&
		view.getUint32(valuesOffset + 8, true) == cd.uncompressedSize;
	let signaturePresent;
	if (view.getUint32(offset, true) == DATA_DESCRIPTOR_RECORD_SIGNATURE) {
		signaturePresent = matchesAt(offset + 4) || !matchesAt(offset);
	} else {
		signaturePresent = false;
	}
	const valuesOffset = signaturePresent ? offset + 4 : offset;
	return {
		offset,
		signaturePresent,
		crc32: view.getUint32(valuesOffset, true),
		compressedSize: view.getUint32(valuesOffset + 4, true),
		uncompressedSize: view.getUint32(valuesOffset + 8, true),
		endOffset: valuesOffset + 12
	};
}

function parseExtraFields(bytes) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const fields = [];
	let offset = 0;
	while (offset + 4 <= bytes.length) {
		const type = view.getUint16(offset, true);
		const size = view.getUint16(offset + 2, true);
		if (offset + 4 + size > bytes.length) {
			break;
		}
		fields.push({ type, data: bytes.slice(offset + 4, offset + 4 + size) });
		offset += 4 + size;
	}
	if (offset != bytes.length) {
		fields.push({ type: null, data: bytes.slice(offset) });
	}
	return fields;
}

function findGaps(data, entries, eocd, zip64) {
	const regions = entries.map(entry => [entry.startOffset, entry.endOffset]);
	regions.push([eocd.directoryOffset, eocd.directoryOffset + eocd.directorySize]);
	regions.push([zip64 ? eocd.offset - 20 : eocd.offset, data.length]);
	regions.sort((regionA, regionB) => regionA[0] - regionB[0]);
	const gaps = [];
	let covered = 0;
	for (const [start, end] of regions) {
		if (start > covered) {
			gaps.push({ start: covered, end: start });
		}
		covered = Math.max(covered, end);
	}
	if (covered < data.length) {
		gaps.push({ start: covered, end: data.length });
	}
	return gaps;
}
