/* global ReadableStream, TextEncoder */

// A zip64 extra field that cannot be read, because it is too short for the sentinels of its record,
// because it is missing behind them or because it holds a value above Number.MAX_SAFE_INTEGER, is
// fatal in the central directory, where the sizes and the offset of an entry have no other source. In the local file header the
// same defect is a local disagreement like any other: the sizes come from the central directory and
// the data offset from the header's own lengths, so the entry stays readable and the field is
// reported as a malformed extra field. An entry without a data descriptor keeps its sentinel sizes,
// which the local file header check reports as mismatched, so the default strictness rejects it and
// a tolerant reader extracts it with the two warnings.

import * as zip from "../zip-lib.js";

const CONTENT = "unreadable zip64 local extra field ".repeat(8);
const FILENAME = "entry.txt";
const EXTRAFIELD_TYPE_ZIP64 = 0x0001;
const EXTRAFIELD_TYPE_FILLER = 0x6666;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
const LOCAL_HEADER_SIZE = 30;
const CENTRAL_HEADER_SIZE = 46;
const UNSAFE_VALUE = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
// once the field is gone from both records, nothing tells the width of the data descriptor any more
const DAMAGES = [
	{ label: "truncated", damage: truncateExtraFieldZip64, directoryError: zip.ERR_EXTRAFIELD_ZIP64_NOT_FOUND, descriptorWidthKnown: true },
	{ label: "unsafe value", damage: writeUnsafeValueInExtraFieldZip64, directoryError: zip.ERR_UNSUPPORTED_UINT64, descriptorWidthKnown: true },
	{ label: "missing", damage: removeExtraFieldZip64, directoryError: zip.ERR_EXTRAFIELD_ZIP64_NOT_FOUND, descriptorWidthKnown: false }
];

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		for (const { label, damage, directoryError, descriptorWidthKnown } of DAMAGES) {
			await streamedEntryStaysReadable(label, damage, descriptorWidthKnown);
			await entryWithoutDataDescriptorIsAmbiguous(label, damage);
			await centralDirectoryStaysFatal(label, damage, directoryError);
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function streamedEntryStaysReadable(label, damage, descriptorWidthKnown) {
	const bytes = await writeEntry({ readable: streamOf(CONTENT) }, {});
	await readEntry(bytes, {}, [], label);
	damageLocalExtraFieldZip64(bytes, damage);
	for (const options of [{}, { strictness: "strict" }]) {
		const { entry, content } = await readEntry(bytes, Object.assign({ checkOverlappingEntry: true }, options), [zip.WARNING_MALFORMED_EXTRA_FIELD], label);
		if (content != CONTENT) {
			throw new Error(label + ": the content must be read from the central directory metadata");
		}
		const { dataDescriptor } = entry.localDirectory;
		if (descriptorWidthKnown && (!dataDescriptor || dataDescriptor.uncompressedSize != CONTENT.length)) {
			throw new Error(label + ": the data descriptor must still be read with 8-byte sizes, got " + JSON.stringify(dataDescriptor));
		}
	}
}

async function entryWithoutDataDescriptorIsAmbiguous(label, damage) {
	const bytes = await writeEntry(new zip.TextReader(CONTENT), { zip64: true, dataDescriptor: false, level: 0 });
	await readEntry(bytes, {}, [], label);
	damageLocalExtraFieldZip64(bytes, damage);
	await expectAmbiguity(bytes, {}, zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES, label);
	const { content } = await readEntry(bytes, { strictness: "tolerant" },
		[zip.WARNING_MALFORMED_EXTRA_FIELD, zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES], label);
	if (content != CONTENT) {
		throw new Error(label + ": a tolerant reader must read the content from the central directory metadata");
	}
}

async function centralDirectoryStaysFatal(label, damage, directoryError) {
	const bytes = await writeEntry(new zip.TextReader(CONTENT), { zip64: true, dataDescriptor: false, level: 0 });
	const view = getView(bytes);
	const directoryOffset = findSignature(view, CENTRAL_FILE_HEADER_SIGNATURE);
	const filenameLength = view.getUint16(directoryOffset + 28, true);
	const extraFieldLength = view.getUint16(directoryOffset + 30, true);
	damage(view, directoryOffset + CENTRAL_HEADER_SIZE + filenameLength, extraFieldLength);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes));
	let error;
	try {
		await zipReader.getEntries();
	} catch (thrown) {
		error = thrown;
	}
	if (!error || error.message != directoryError) {
		throw new Error(label + ": an unreadable zip64 extra field in the central directory must stay fatal, got " + (error ? error.message : "no error"));
	}
}

async function writeEntry(reader, options) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, reader, options);
	return zipWriter.close();
}

function streamOf(text) {
	return new ReadableStream({
		start(controller) {
			controller.enqueue(new TextEncoder().encode(text));
			controller.close();
		}
	});
}

async function readEntry(bytes, options, expectedReasons, label) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes), options);
	const [entry] = await zipReader.getEntries();
	const content = await entry.getData(new zip.TextWriter());
	await zipReader.close();
	if (zipReader.warnings.length) {
		throw new Error(label + ": a local extra field issue must not deposit an archive-level warning, got " + JSON.stringify(zipReader.warnings));
	}
	const reasons = entry.warnings.map(warning => warning.reason);
	if (reasons.length != expectedReasons.length || expectedReasons.some(reason => !reasons.includes(reason))) {
		throw new Error(label + ": expected the warnings " + JSON.stringify(expectedReasons) + ", got " + JSON.stringify(reasons));
	}
	return { entry, content };
}

async function expectAmbiguity(bytes, options, reason, label) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes), options);
	const [entry] = await zipReader.getEntries();
	let error;
	try {
		await entry.getData(new zip.TextWriter());
	} catch (thrown) {
		error = thrown;
	}
	await zipReader.close();
	if (!error || error.message != zip.ERR_AMBIGUOUS_ARCHIVE || error.reason != reason) {
		throw new Error(label + ": expected " + zip.ERR_AMBIGUOUS_ARCHIVE + " with the reason " + reason + ", got " + (error ? error.message + " " + error.reason : "no error"));
	}
}

function damageLocalExtraFieldZip64(bytes, damage) {
	const view = getView(bytes);
	const filenameLength = view.getUint16(26, true);
	const extraFieldLength = view.getUint16(28, true);
	damage(view, LOCAL_HEADER_SIZE + filenameLength, extraFieldLength);
}

// shortens the 16-byte zip64 field to 8 bytes in place: the freed bytes become an unknown extra
// field, so the record keeps its length and the offsets that follow it stay valid
function truncateExtraFieldZip64(view, offset, length) {
	const fieldOffset = findExtraFieldZip64(view, offset, length);
	view.setUint16(fieldOffset + 2, 8, true);
	view.setUint16(fieldOffset + 12, EXTRAFIELD_TYPE_FILLER, true);
	view.setUint16(fieldOffset + 14, 4, true);
}

function writeUnsafeValueInExtraFieldZip64(view, offset, length) {
	const fieldOffset = findExtraFieldZip64(view, offset, length);
	view.setBigUint64(fieldOffset + 4, UNSAFE_VALUE, true);
}

// renames the field, so the record keeps its length and the sentinels have no field behind them
function removeExtraFieldZip64(view, offset, length) {
	const fieldOffset = findExtraFieldZip64(view, offset, length);
	view.setUint16(fieldOffset, EXTRAFIELD_TYPE_FILLER, true);
}

function findExtraFieldZip64(view, offset, length) {
	const end = offset + length;
	while (offset + 4 <= end) {
		const type = view.getUint16(offset, true);
		const size = view.getUint16(offset + 2, true);
		if (type == EXTRAFIELD_TYPE_ZIP64) {
			if (size != 16) {
				throw new Error("expected a 16-byte zip64 extra field, got " + size);
			}
			return offset;
		}
		offset += 4 + size;
	}
	throw new Error("zip64 extra field not found");
}

function findSignature(view, signature) {
	for (let offset = 0; offset + 4 <= view.byteLength; offset++) {
		if (view.getUint32(offset, true) == signature) {
			return offset;
		}
	}
	throw new Error("signature not found");
}

function getView(bytes) {
	return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}
