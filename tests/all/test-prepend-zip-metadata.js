/* global Blob, TextDecoder */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const BLOB = new Blob([TEXT_CONTENT], { type: "text/plain" });
const PASSWORD = "password";
const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
const COMPRESSION_METHOD_AES = 0x63;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const srcBlobWriter = new zip.BlobWriter("application/zip");
	const srcZipWriter = new zip.ZipWriter(srcBlobWriter);
	await srcZipWriter.add("plain.txt", new zip.BlobReader(BLOB));
	await srcZipWriter.add("secret.txt", new zip.BlobReader(BLOB), { password: PASSWORD });
	await srcZipWriter.close();
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.prependZip(new zip.BlobReader(await srcBlobWriter.getData()));
	await zipWriter.add("extra.txt", new zip.BlobReader(BLOB));
	await zipWriter.close();
	const blob = await blobWriter.getData();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob), { checkCrc32: true });
	const entries = await zipReader.getEntries();
	const [plainText, secretText, extraText] = await Promise.all([
		entries.find(entry => entry.filename == "plain.txt").getData(new zip.TextWriter()),
		entries.find(entry => entry.filename == "secret.txt").getData(new zip.TextWriter(), { password: PASSWORD }),
		entries.find(entry => entry.filename == "extra.txt").getData(new zip.TextWriter())
	]);
	await zipReader.close();
	await zip.terminateWorkers();
	const directoryEntries = readCentralDirectory(new Uint8Array(await blob.arrayBuffer()));
	const plainDirectoryEntry = directoryEntries.get("plain.txt");
	const secretDirectoryEntry = directoryEntries.get("secret.txt");
	if (plainText != TEXT_CONTENT || secretText != TEXT_CONTENT || extraText != TEXT_CONTENT ||
		!plainDirectoryEntry.signature ||
		secretDirectoryEntry.compressionMethod != COMPRESSION_METHOD_AES) {
		throw new Error();
	}
}

function readCentralDirectory(array) {
	const view = new DataView(array.buffer, array.byteOffset, array.length);
	let offset = array.length - 22;
	while (view.getUint32(offset, true) != END_OF_CENTRAL_DIR_SIGNATURE) {
		offset--;
	}
	offset = view.getUint32(offset + 16, true);
	const directoryEntries = new Map();
	while (offset + 4 <= array.length && view.getUint32(offset, true) == CENTRAL_FILE_HEADER_SIGNATURE) {
		const compressionMethod = view.getUint16(offset + 10, true);
		const signature = view.getUint32(offset + 16, true);
		const filenameLength = view.getUint16(offset + 28, true);
		const extraFieldLength = view.getUint16(offset + 30, true);
		const commentLength = view.getUint16(offset + 32, true);
		const filename = new TextDecoder().decode(array.subarray(offset + 46, offset + 46 + filenameLength));
		directoryEntries.set(filename, { compressionMethod, signature });
		offset += 46 + filenameLength + extraFieldLength + commentLength;
	}
	return directoryEntries;
}
