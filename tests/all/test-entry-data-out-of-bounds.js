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
			const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { dataDescriptor: false });
			await zipWriter.add("filename.txt", new zip.TextReader("Lorem ipsum"), { compressionMethod });
			const zipData = await zipWriter.close();
			declareSizeBeyondArchive(zipData);
			const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(zipData));
			const entries = await zipReader.getEntries();
			try {
				await entries[0].getData(new zip.Uint8ArrayWriter());
				throw new Error();
			} catch (error) {
				if (error.message != zip.ERR_ENTRY_DATA_OUT_OF_BOUNDS) {
					throw error;
				}
			}
			await zipReader.close();
		}
	} finally {
		await zip.terminateWorkers();
	}
}

function declareSizeBeyondArchive(zipData) {
	const dataView = new DataView(zipData.buffer, zipData.byteOffset, zipData.byteLength);
	dataView.setUint32(LOCAL_HEADER_COMPRESSED_SIZE_OFFSET, DECLARED_SIZE, true);
	dataView.setUint32(LOCAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, DECLARED_SIZE, true);
	let centralHeaderOffset = 0;
	while (dataView.getUint32(centralHeaderOffset, true) != CENTRAL_FILE_HEADER_SIGNATURE) {
		centralHeaderOffset++;
	}
	dataView.setUint32(centralHeaderOffset + CENTRAL_HEADER_COMPRESSED_SIZE_OFFSET, DECLARED_SIZE, true);
	dataView.setUint32(centralHeaderOffset + CENTRAL_HEADER_UNCOMPRESSED_SIZE_OFFSET, DECLARED_SIZE, true);
}
