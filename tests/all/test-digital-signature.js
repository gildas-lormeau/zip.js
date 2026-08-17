import * as zip from "../zip-lib.js";

const DIGITAL_SIGNATURE_RECORD_SIGNATURE = 0x05054b50;
const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
const TEXT_CONTENT = "Lorem ipsum dolor sit amet";
const SIGNATURE_DATA = new Uint8Array([0x30, 0x82, 0x01, 0x02, 0xde, 0xad, 0xbe, 0xef]);

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	let signedDirectory;
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("first.txt", new zip.TextReader(TEXT_CONTENT));
	await zipWriter.add("second.txt", new zip.TextReader(TEXT_CONTENT));
	const data = await zipWriter.close(undefined, {
		signCentralDirectory(directory) {
			signedDirectory = directory.slice();
			return SIGNATURE_DATA;
		}
	});
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = await zipReader.getEntries();
	const content = await entries[0].getData(new zip.TextWriter());
	await zipReader.close();
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	const recordOffset = zipReader.directoryOffset + zipReader.directoryLength;
	let endOfDirectoryOffset = data.length - 22;
	while (endOfDirectoryOffset >= 0 && view.getUint32(endOfDirectoryOffset, true) != END_OF_CENTRAL_DIR_SIGNATURE) {
		endOfDirectoryOffset--;
	}
	const signedRegion = data.subarray(zipReader.directoryOffset, zipReader.directoryOffset + zipReader.directoryLength);
	const errorTooLarge = await getCloseError({ signCentralDirectory: () => new Uint8Array(0x10000) });
	const zip64OK = await testZip64();
	const filesystemOK = await testFilesystem();
	if (!zip64OK ||
		!filesystemOK ||
		entries.length != 2 ||
		entries[0].filename != "first.txt" ||
		entries[1].filename != "second.txt" ||
		content != TEXT_CONTENT ||
		!equalArrays(zipReader.digitalSignature, SIGNATURE_DATA) ||
		!equalArrays(signedRegion, signedDirectory) ||
		view.getUint32(recordOffset, true) != DIGITAL_SIGNATURE_RECORD_SIGNATURE ||
		view.getUint16(recordOffset + 4, true) != SIGNATURE_DATA.length ||
		recordOffset + 6 + SIGNATURE_DATA.length != endOfDirectoryOffset ||
		!errorTooLarge || errorTooLarge.message != zip.ERR_INVALID_SIGNATURE_DATA) {
		throw new Error("Digital signature record test failed");
	}
	await zip.terminateWorkers();
}

async function testZip64() {
	let signedDirectory;
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { zip64: true });
	await zipWriter.add("entry.txt", new zip.TextReader(TEXT_CONTENT));
	const data = await zipWriter.close(undefined, {
		signCentralDirectory(directory) {
			signedDirectory = directory.slice();
			return SIGNATURE_DATA;
		}
	});
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict" });
	const entries = await zipReader.getEntries();
	const content = await entries[0].getData(new zip.TextWriter());
	const signedRegion = data.subarray(zipReader.directoryOffset, zipReader.directoryOffset + zipReader.directoryLength);
	return entries.length == 1 &&
		content == TEXT_CONTENT &&
		equalArrays(zipReader.digitalSignature, SIGNATURE_DATA) &&
		equalArrays(signedRegion, signedDirectory);
}

async function testFilesystem() {
	let signedDirectory;
	const zipFs = new zip.fs.FS();
	zipFs.addText("entry.txt", TEXT_CONTENT);
	const data = await zipFs.exportUint8Array({
		signCentralDirectory(directory) {
			signedDirectory = directory.slice();
			return SIGNATURE_DATA;
		}
	});
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict" });
	const entries = await zipReader.getEntries();
	const signedRegion = data.subarray(zipReader.directoryOffset, zipReader.directoryOffset + zipReader.directoryLength);
	return entries.length == 1 &&
		equalArrays(zipReader.digitalSignature, SIGNATURE_DATA) &&
		equalArrays(signedRegion, signedDirectory);
}

async function getCloseError(options) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("entry.txt", new zip.TextReader(TEXT_CONTENT));
	try {
		await zipWriter.close(undefined, options);
	} catch (error) {
		return error;
	}
}

function equalArrays(first, second) {
	return first && second && first.length == second.length && first.every((value, index) => value == second[index]);
}
