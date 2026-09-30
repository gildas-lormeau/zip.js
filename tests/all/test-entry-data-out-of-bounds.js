import * as zip from "../zip-lib.js";

export { test };

const LOCAL_HEADER_COMPRESSED_SIZE_OFFSET = 18;
const LOCAL_HEADER_UNCOMPRESSED_SIZE_OFFSET = 22;
const CENTRAL_HEADER_COMPRESSED_SIZE_OFFSET = 20;
const CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET = 24;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
const DECLARED_SIZE = 0x40000000;

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		for (const compressionMethod of [0, 8]) {
			await testRejectedEntry(compressionMethod, true, zip.ERR_ENTRY_DATA_OUT_OF_BOUNDS);
			await testRejectedEntry(compressionMethod, false, zip.ERR_INVALID_UNCOMPRESSED_SIZE);
			await testEntryStretchedOverTheDirectory(compressionMethod);
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function testRejectedEntry(compressionMethod, declareCompressedSize, expectedError) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { dataDescriptor: false });
	await zipWriter.add("filename.txt", new zip.TextReader("Lorem ipsum"), { compressionMethod });
	const zipData = await zipWriter.close();
	declareSizeBeyondArchive(zipData, declareCompressedSize);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(zipData));
	const entries = await zipReader.getEntries();
	const writer = new zip.Uint8ArrayWriter();
	try {
		await entries[0].getData(writer);
		throw new Error();
	} catch (error) {
		if (error.message != expectedError) {
			throw error;
		}
	}
	if (writer.array !== undefined && writer.array.length >= DECLARED_SIZE) {
		throw new Error("declared size drove the output allocation");
	}
	await zipReader.close();
}

// the stored entry is stretched to end exactly at the end of the file, so that it covers the central directory
// without crossing the end of the file; only the bound at the directory can reject it
async function testEntryStretchedOverTheDirectory(compressionMethod) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { dataDescriptor: false });
	await zipWriter.add("filename.txt", new zip.TextReader("Lorem ipsum"), { compressionMethod });
	const zipData = await zipWriter.close();
	const dataView = new DataView(zipData.buffer, zipData.byteOffset, zipData.byteLength);
	const centralHeaderOffset = findCentralHeaderOffset(dataView);
	const dataOffset = 30 + dataView.getUint16(26, true) + dataView.getUint16(28, true);
	const stretchedSize = zipData.length - dataOffset;
	dataView.setUint32(LOCAL_HEADER_COMPRESSED_SIZE_OFFSET, stretchedSize, true);
	dataView.setUint32(centralHeaderOffset + CENTRAL_HEADER_COMPRESSED_SIZE_OFFSET, stretchedSize, true);
	dataView.setUint32(LOCAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, stretchedSize, true);
	dataView.setUint32(centralHeaderOffset + CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, stretchedSize, true);
	for (const options of [{}, { strictness: "tolerant" }, { checkOverlappingEntry: true }]) {
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(zipData), options);
		const entries = await zipReader.getEntries();
		let error;
		try {
			await entries[0].getData(new zip.Uint8ArrayWriter());
		} catch (thrown) {
			error = thrown;
		}
		if (!error || error.message != zip.ERR_ENTRY_DATA_OUT_OF_BOUNDS) {
			throw new Error("expected the stretched entry to be rejected with " + JSON.stringify(options) + ", got " + (error ? error.message : "no error"));
		}
		await zipReader.close();
	}
}

function findCentralHeaderOffset(dataView) {
	let centralHeaderOffset = 0;
	while (dataView.getUint32(centralHeaderOffset, true) != CENTRAL_FILE_HEADER_SIGNATURE) {
		centralHeaderOffset++;
	}
	return centralHeaderOffset;
}

function declareSizeBeyondArchive(zipData, declareCompressedSize) {
	const dataView = new DataView(zipData.buffer, zipData.byteOffset, zipData.byteLength);
	const centralHeaderOffset = findCentralHeaderOffset(dataView);
	if (declareCompressedSize) {
		dataView.setUint32(LOCAL_HEADER_COMPRESSED_SIZE_OFFSET, DECLARED_SIZE, true);
		dataView.setUint32(centralHeaderOffset + CENTRAL_HEADER_COMPRESSED_SIZE_OFFSET, DECLARED_SIZE, true);
	}
	dataView.setUint32(LOCAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, DECLARED_SIZE, true);
	dataView.setUint32(centralHeaderOffset + CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, DECLARED_SIZE, true);
}
