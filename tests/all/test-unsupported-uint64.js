import * as zip from "../zip-lib.js";

export { test };

const ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 0x06064b50;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
const EXTRAFIELD_TYPE_ZIP64 = 0x0001;
const CENTRAL_FILE_HEADER_LENGTH = 46;
const CENTRAL_HEADER_FILENAME_LENGTH_OFFSET = 28;
const ZIP64_END_OF_CENTRAL_DIR_OFFSET_POSITION = 48;
const UNSAFE_VALUE = BigInt(Number.MAX_SAFE_INTEGER) + 1n;

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await testUnsafeValue(patchDirectoryOffset);
		await testUnsafeValue(patchExtraFieldZip64);
	} finally {
		await zip.terminateWorkers();
	}
}

async function testUnsafeValue(patchZipData) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { zip64: true });
	await zipWriter.add("filename.txt", new zip.TextReader("Lorem ipsum"));
	const zipData = await zipWriter.close();
	patchZipData(zipData);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(zipData));
	try {
		await zipReader.getEntries();
		throw new Error();
	} catch (error) {
		if (error.message != zip.ERR_UNSUPPORTED_UINT64) {
			throw error;
		}
	} finally {
		await zipReader.close();
	}
}

function patchDirectoryOffset(zipData) {
	const dataView = new DataView(zipData.buffer, zipData.byteOffset, zipData.byteLength);
	const offset = findSignature(dataView, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
	dataView.setBigUint64(offset + ZIP64_END_OF_CENTRAL_DIR_OFFSET_POSITION, UNSAFE_VALUE, true);
}

function patchExtraFieldZip64(zipData) {
	const dataView = new DataView(zipData.buffer, zipData.byteOffset, zipData.byteLength);
	const centralHeaderOffset = findSignature(dataView, CENTRAL_FILE_HEADER_SIGNATURE);
	const filenameLength = dataView.getUint16(centralHeaderOffset + CENTRAL_HEADER_FILENAME_LENGTH_OFFSET, true);
	let extraFieldOffset = centralHeaderOffset + CENTRAL_FILE_HEADER_LENGTH + filenameLength;
	while (dataView.getUint16(extraFieldOffset, true) != EXTRAFIELD_TYPE_ZIP64) {
		extraFieldOffset += 4 + dataView.getUint16(extraFieldOffset + 2, true);
	}
	dataView.setBigUint64(extraFieldOffset + 4, UNSAFE_VALUE, true);
}

function findSignature(dataView, signature) {
	let offset = 0;
	while (dataView.getUint32(offset, true) != signature) {
		offset++;
	}
	return offset;
}
