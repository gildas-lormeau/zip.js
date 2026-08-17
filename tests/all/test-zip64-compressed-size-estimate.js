import * as zip from "../zip-lib.js";

const FILENAME = "lorem.txt";
const UNCOMPRESSED_SIZE = 4293657000;
const PASS_THROUGH_DATA = new Uint8Array(100);
const ERR_READER_CONSULTED = "Reader consulted";

export { test };

class SizeOnlyReader extends zip.Reader {

	constructor(size) {
		super();
		this.size = size;
	}

	readUint8Array() {
		throw new Error(ERR_READER_CONSULTED);
	}
}

async function test() {
	await testPassThroughKeepsSizeExact();
	await testStoreSkipsDeflateExpansion();
	await testDeflateStillReservesExpansion();
	await zip.terminateWorkers();
}

async function testPassThroughKeepsSizeExact() {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { passThrough: true, compressionMethod: 8, zip64: false });
	await zipWriter.add(FILENAME, new zip.Uint8ArrayReader(PASS_THROUGH_DATA), { uncompressedSize: UNCOMPRESSED_SIZE, crc32: 0 });
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	if (entries[0].zip64 || entries[0].compressedSize != PASS_THROUGH_DATA.length) {
		throw new Error();
	}
}

async function testStoreSkipsDeflateExpansion() {
	for (const options of [{ level: 0, zip64: false }, { compressionMethod: 0, zip64: false }]) {
		if (await getAddErrorMessage(options) != ERR_READER_CONSULTED) {
			throw new Error();
		}
	}
}

async function testDeflateStillReservesExpansion() {
	if (await getAddErrorMessage({ level: 6, zip64: false }) != zip.ERR_UNSUPPORTED_FORMAT) {
		throw new Error();
	}
}

async function getAddErrorMessage(options) {
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), options);
	try {
		await zipWriter.add(FILENAME, new SizeOnlyReader(UNCOMPRESSED_SIZE));
	} catch (error) {
		return error.message;
	}
}
