// Under checkOverlappingEntry the layout of a data descriptor is chosen by comparing its CRC-32 and sizes with
// the central directory. The CRC-32 comparison used to be skipped for every AES entry, although an AE-1 entry
// stores one; it is now skipped only when the central directory stores none, i.e. for AE-2 entries. An AE-1
// entry whose descriptor CRC-32 disagrees is therefore read at the announced width without the signature, like
// any other descriptor agreeing with no layout, where its signed layout used to be accepted on the sizes alone.
// The writer emits AE-2 only, so the AE-1 entries are patched from an AE-2 one, as test-aes-crc32.js does.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ".repeat(20);
const FILENAME = "lorem.txt";
const PASSWORD = "password";
const AE_1_VERSION = 1;
const EXTRAFIELD_TYPE_AES = 0x9901;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
const DATA_DESCRIPTOR_SIGNATURE = 0x08074b50;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		const crc32 = await readPlainCrc32();
		const ae2Data = await writeEntry();
		await expectDescriptor(ae2Data, { signature: true, crc32: 0 }, "AE-2");
		await expectDescriptor(patchAE1(ae2Data, crc32, crc32), { signature: true, crc32 }, "AE-1 with an agreeing descriptor");
		await expectDescriptor(patchAE1(ae2Data, crc32, 0), { signature: false }, "AE-1 with a disagreeing descriptor");
	} finally {
		await zip.terminateWorkers();
	}
}

async function readPlainCrc32() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	const entry = await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	return entry.crc32;
}

async function writeEntry() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { dataDescriptorSignature: true });
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), { password: PASSWORD });
	return zipWriter.close();
}

async function expectDescriptor(data, expected, label) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { checkOverlappingEntry: true });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter(), { password: PASSWORD });
	await zipReader.close();
	if (text != TEXT_CONTENT) {
		throw new Error(label + ": the entry must be read");
	}
	const { dataDescriptor } = entry.localDirectory;
	const matched = expected.signature;
	if (!dataDescriptor || dataDescriptor.zip64 || dataDescriptor.signature != expected.signature ||
		(matched && (dataDescriptor.crc32 != expected.crc32 ||
			dataDescriptor.compressedSize != entry.compressedSize || dataDescriptor.uncompressedSize != entry.uncompressedSize))) {
		throw new Error(label + ": expected " + JSON.stringify(expected) + ", got " + JSON.stringify(dataDescriptor));
	}
}

function patchAE1(data, crc32, descriptorCrc32) {
	const array = data.slice();
	const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
	const filenameLength = view.getUint16(26, true);
	const extraFieldLength = view.getUint16(28, true);
	patchAESVersion(view, 30 + filenameLength, extraFieldLength);
	const centralDirectoryOffset = findCentralDirectory(view);
	const compressedSize = view.getUint32(centralDirectoryOffset + 20, true);
	const descriptorOffset = 30 + filenameLength + extraFieldLength + compressedSize;
	if (view.getUint32(descriptorOffset, true) != DATA_DESCRIPTOR_SIGNATURE) {
		throw new Error("the data descriptor signature is not where the central directory says");
	}
	view.setUint32(descriptorOffset + 4, descriptorCrc32, true);
	view.setUint32(centralDirectoryOffset + 16, crc32, true);
	patchAESVersion(view, centralDirectoryOffset + 46 + view.getUint16(centralDirectoryOffset + 28, true), view.getUint16(centralDirectoryOffset + 30, true));
	return array;
}

function patchAESVersion(view, offset, length) {
	const end = offset + length;
	while (offset + 4 <= end) {
		const type = view.getUint16(offset, true);
		const size = view.getUint16(offset + 2, true);
		if (type == EXTRAFIELD_TYPE_AES) {
			view.setUint16(offset + 4, AE_1_VERSION, true);
			return;
		}
		offset += 4 + size;
	}
	throw new Error("AES extra field not found");
}

function findCentralDirectory(view) {
	for (let offset = view.byteLength - 4; offset >= 0; offset--) {
		if (view.getUint32(offset, true) == CENTRAL_FILE_HEADER_SIGNATURE) {
			return offset;
		}
	}
	throw new Error("central directory not found");
}
