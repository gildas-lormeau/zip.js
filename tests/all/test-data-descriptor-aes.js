// Under checkOverlappingEntry the layout of a data descriptor is chosen by comparing its sizes, and its CRC-32 when
// several layouts qualify and the central directory stores one, with the central directory. An AE-2 entry stores 0
// as its CRC-32 in both records and zip.js leaves it undefined, so its descriptor is chosen on the sizes alone; an
// AE-1 entry stores the CRC-32 of its data, and its descriptor is chosen like the descriptor of any other entry. A
// descriptor whose CRC-32 disagrees with the central directory is still read with the layout its sizes select and
// reports the CRC-32 it stores; it used to be read at the announced width without its signature, i.e. at a layout
// known not to match, its CRC-32 then being the signature bytes and its sizes the fields shifted by four bytes. The
// writer emits AE-2 for every entry it encrypts, so the AE-1 entries are patched from an AE-2 one, as
// test-aes-crc32.js does.

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
		await expectDescriptor(patchAE1(ae2Data, crc32, 0), 0, "AE-1 with a disagreeing descriptor");
		await expectDescriptor(patchAE1(ae2Data, crc32, crc32), crc32, "AE-1 with an agreeing descriptor");
		await expectDescriptor(ae2Data, 0, "AE-2");
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

async function expectDescriptor(data, expectedCrc32, label) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { checkOverlappingEntry: true });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter(), { password: PASSWORD });
	await zipReader.close();
	if (text != TEXT_CONTENT) {
		throw new Error(label + ": the entry must be read");
	}
	const { dataDescriptor } = entry.localDirectory;
	if (!dataDescriptor || !dataDescriptor.signature || dataDescriptor.zip64 || dataDescriptor.crc32 != expectedCrc32 ||
		dataDescriptor.compressedSize != entry.compressedSize || dataDescriptor.uncompressedSize != entry.uncompressedSize) {
		throw new Error(label + ": expected a signed 4-byte descriptor with crc32 " + expectedCrc32 + ", got " + JSON.stringify(dataDescriptor));
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
