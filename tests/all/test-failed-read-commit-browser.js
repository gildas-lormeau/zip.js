/* global navigator, Blob, crypto */

// Checks that an entry whose read fails leaves nothing behind in a real File System Access
// writable. The central directory is patched so the declared uncompressed size is one byte larger
// than the real content: the entry streams to the writable in full, then the size check in
// zip-reader.js rejects. That error path ends in a `finally` block that calls close() on the
// writable, and close() on a FileSystemWritableFileStream commits the swap file, so a failed read
// is expected to publish a complete file on disk. abort() would discard it instead. Runs in a
// browser only (no headless JS runtime exposes OPFS).

import * as zip from "../zip-lib.js";

const DIRECTORY_NAME = ".zip.js-test-failed-read";
const FILE_NAME = "payload.bin";
const CONTENT_LENGTH = 1024 * 1024;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const END_OF_CENTRAL_DIRECTORY_LENGTH = 22;
const CENTRAL_DIRECTORY_OFFSET_FIELD = 16;
const CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const UNCOMPRESSED_SIZE_FIELD = 24;
const MAX_UINT32 = 0xffffffff;

export { test };

async function test() {
	if (!(navigator.storage && navigator.storage.getDirectory)) {
		throw new Error("OPFS is not available in this environment");
	}
	await removeTestDirectory();
	const content = randomBytes(CONTENT_LENGTH);
	const archive = await buildArchive(content);
	patchUncompressedSize(archive, CONTENT_LENGTH + 1);

	const fileHandle = await createEmptyFile();
	const writable = await fileHandle.createWritable();
	const zipReader = new zip.ZipReader(new zip.BlobReader(new Blob([archive])));
	const [entry] = await zipReader.getEntries();
	let readError;
	try {
		await entry.getData({ writable });
	} catch (error) {
		readError = error;
	}
	await zipReader.close();
	await zip.terminateWorkers();

	const { size } = await fileHandle.getFile();
	await removeTestDirectory();
	if (!readError) {
		throw new Error("expected the patched entry to fail");
	}
	if (size) {
		throw new Error("failed read committed " + size + " bytes (" + readError.message + ")");
	}
}

async function buildArchive(content) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILE_NAME, new zip.BlobReader(new Blob([content])));
	await zipWriter.close();
	return new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
}

function patchUncompressedSize(archive, size) {
	const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
	let endOfCentralDirectoryOffset = archive.length - END_OF_CENTRAL_DIRECTORY_LENGTH;
	while (endOfCentralDirectoryOffset >= 0 &&
		view.getUint32(endOfCentralDirectoryOffset, true) != END_OF_CENTRAL_DIRECTORY_SIGNATURE) {
		endOfCentralDirectoryOffset--;
	}
	if (endOfCentralDirectoryOffset < 0) {
		throw new Error("end of central directory record not found");
	}
	const centralDirectoryOffset = view.getUint32(endOfCentralDirectoryOffset + CENTRAL_DIRECTORY_OFFSET_FIELD, true);
	if (view.getUint32(centralDirectoryOffset, true) != CENTRAL_DIRECTORY_SIGNATURE) {
		throw new Error("central directory header not found");
	}
	const uncompressedSizeOffset = centralDirectoryOffset + UNCOMPRESSED_SIZE_FIELD;
	if (view.getUint32(uncompressedSizeOffset, true) == MAX_UINT32) {
		throw new Error("unexpected zip64 uncompressed size");
	}
	view.setUint32(uncompressedSizeOffset, size, true);
}

async function createEmptyFile() {
	const root = await navigator.storage.getDirectory();
	const directoryHandle = await root.getDirectoryHandle(DIRECTORY_NAME, { create: true });
	return directoryHandle.getFileHandle(FILE_NAME, { create: true });
}

async function removeTestDirectory() {
	const root = await navigator.storage.getDirectory();
	try {
		await root.removeEntry(DIRECTORY_NAME, { recursive: true });
	} catch {
		// the directory does not exist yet; ignored
	}
}

function randomBytes(length) {
	const array = new Uint8Array(length);
	for (let offset = 0; offset < length; offset += 65536) {
		crypto.getRandomValues(array.subarray(offset, Math.min(offset + 65536, length)));
	}
	return array;
}
