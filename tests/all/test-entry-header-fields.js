import * as zip from "../zip-lib.js";

export { test };

const BITFLAG_ENCRYPTED = 0x01;
const BITFLAG_DATA_DESCRIPTOR = 0x08;
const BITFLAG_LANG_ENCODING_FLAG = 0x800;
const MAX_16_BITS = 0xffff;

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	const CASES = [
		{ name: "stored", filename: "hello.txt", options: { compressionMethod: 0 } },
		{ name: "deflated", filename: "hello.txt", options: { compressionMethod: 8 } },
		{ name: "data descriptor", filename: "hello.txt", options: { compressionMethod: 0, dataDescriptor: true }, bitsSet: BITFLAG_DATA_DESCRIPTOR },
		{ name: "encrypted", filename: "hello.txt", options: { compressionMethod: 0, password: "secret" }, bitsSet: BITFLAG_ENCRYPTED },
		{ name: "unicode filename", filename: "ünïcödé-名前.txt", options: { compressionMethod: 0 }, bitsSet: BITFLAG_LANG_ENCODING_FLAG },
		{ name: "unix mode", filename: "hello.txt", options: { compressionMethod: 0, unixMode: 0o100755 }, unixExternalUpper: 0o100755 },
		{ name: "extra field", filename: "hello.txt", options: { compressionMethod: 0, extraField: new Map([[0x9999, new Uint8Array([1, 2, 3, 4])]]) } }
	];

	try {
		for (const testCase of CASES) {
			const blobWriter = new zip.BlobWriter("application/zip");
			const zipWriter = new zip.ZipWriter(blobWriter);
			await zipWriter.add(testCase.filename, new zip.Uint8ArrayReader(new Uint8Array([0x48, 0x69])), testCase.options);
			await zipWriter.close();
			const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()), { password: "secret" });
			const entries = await zipReader.getEntries();
			if (!entries || entries.length !== 1) {
				await zipReader.close();
				throw new Error(`case ${testCase.name}: expected 1 entry`);
			}
			const entry = entries[0];
			if (typeof entry.rawBitFlag != "number") {
				throw new Error(`case ${testCase.name}: rawBitFlag is not exposed`);
			}
			if (Boolean(entry.rawBitFlag & BITFLAG_ENCRYPTED) !== Boolean(entry.encrypted)) {
				throw new Error(`case ${testCase.name}: rawBitFlag disagrees with encrypted`);
			}
			if (Boolean(entry.rawBitFlag & BITFLAG_DATA_DESCRIPTOR) !== Boolean(entry.bitFlag.dataDescriptor)) {
				throw new Error(`case ${testCase.name}: rawBitFlag disagrees with bitFlag.dataDescriptor`);
			}
			if (Boolean(entry.rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) !== Boolean(entry.bitFlag.languageEncodingFlag)) {
				throw new Error(`case ${testCase.name}: rawBitFlag disagrees with bitFlag.languageEncodingFlag`);
			}
			if (testCase.bitsSet !== undefined && (entry.rawBitFlag & testCase.bitsSet) !== testCase.bitsSet) {
				throw new Error(`case ${testCase.name}: expected bits ${testCase.bitsSet.toString(16)} set in rawBitFlag ${entry.rawBitFlag.toString(16)}`);
			}
			if (entry.filenameLength !== entry.rawFilename.length) {
				throw new Error(`case ${testCase.name}: filenameLength ${entry.filenameLength} does not match rawFilename length ${entry.rawFilename.length}`);
			}
			if (entry.extraFieldLength !== entry.rawExtraField.length) {
				throw new Error(`case ${testCase.name}: extraFieldLength ${entry.extraFieldLength} does not match rawExtraField length ${entry.rawExtraField.length}`);
			}
			if (entry.unixExternalUpper !== ((entry.externalFileAttributes >> 16) & MAX_16_BITS)) {
				throw new Error(`case ${testCase.name}: unixExternalUpper ${entry.unixExternalUpper} does not match externalFileAttributes ${entry.externalFileAttributes}`);
			}
			if (testCase.unixExternalUpper !== undefined && entry.unixExternalUpper !== testCase.unixExternalUpper) {
				throw new Error(`case ${testCase.name}: expected unixExternalUpper ${testCase.unixExternalUpper}, got ${entry.unixExternalUpper}`);
			}
			await zipReader.close();
		}
	} finally {
		await zip.terminateWorkers();
	}
}
