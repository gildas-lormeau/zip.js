/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const PASSWORD = "password";
const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
const DATA_DESCRIPTOR_SIGNATURE = 0x08074b50;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	let blobWriter = new zip.BlobWriter("application/zip");
	let zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	let zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	let entries = await zipReader.getEntries();
	const expectedCrc32 = entries[0].crc32;
	await zipReader.close();
	blobWriter = new zip.BlobWriter("application/zip");
	zipWriter = new zip.ZipWriter(blobWriter, { password: PASSWORD, encryptionStrength: 3 });
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	entries = await zipReader.getEntries();
	const rawData = await entries[0].getData(new zip.BlobWriter(), { passThrough: true });
	await zipReader.close();
	const uncompressedSize = TEXT_CONTENT.length;
	const ae1Bytes = await rewrite(rawData, uncompressedSize, { crc32: expectedCrc32 }, expectedCrc32);
	const localHeaderOffset = findSignature(ae1Bytes, LOCAL_FILE_HEADER_SIGNATURE);
	const centralHeaderOffset = findSignature(ae1Bytes, CENTRAL_FILE_HEADER_SIGNATURE);
	const dataDescriptorOffset = findSignature(ae1Bytes.subarray(localHeaderOffset + 4, centralHeaderOffset), DATA_DESCRIPTOR_SIGNATURE) + localHeaderOffset + 4;
	if (readUint32(ae1Bytes, localHeaderOffset + 14) != 0 ||
		readUint32(ae1Bytes, dataDescriptorOffset + 4) != expectedCrc32 ||
		readUint32(ae1Bytes, centralHeaderOffset + 16) != expectedCrc32 ||
		getVendorVersion(ae1Bytes, localHeaderOffset) != 1 ||
		getVendorVersion(ae1Bytes, centralHeaderOffset) != 1) {
		throw new Error();
	}
	const ae1BufferedBytes = await rewrite(rawData, uncompressedSize, { crc32: expectedCrc32, dataDescriptor: false }, expectedCrc32);
	const bufferedLocalHeaderOffset = findSignature(ae1BufferedBytes, LOCAL_FILE_HEADER_SIGNATURE);
	if (readUint32(ae1BufferedBytes, bufferedLocalHeaderOffset + 14) != expectedCrc32 ||
		getVendorVersion(ae1BufferedBytes, bufferedLocalHeaderOffset) != 1) {
		throw new Error();
	}
	const ae2Bytes = await rewrite(rawData, uncompressedSize, {}, undefined);
	const ae2CentralHeaderOffset = findSignature(ae2Bytes, CENTRAL_FILE_HEADER_SIGNATURE);
	if (readUint32(ae2Bytes, ae2CentralHeaderOffset + 16) != 0 ||
		getVendorVersion(ae2Bytes, ae2CentralHeaderOffset) != 2) {
		throw new Error();
	}
	for (const bytes of [ae1Bytes, ae1BufferedBytes, ae2Bytes]) {
		zipReader = new zip.ZipReader(new zip.BlobReader(new Blob([bytes])), { checkCrc32: true });
		entries = await zipReader.getEntries();
		const data = await entries[0].getData(new zip.TextWriter(), { password: PASSWORD });
		await zipReader.close();
		if (data != TEXT_CONTENT) {
			throw new Error();
		}
	}
	await zip.terminateWorkers();
}

async function rewrite(rawData, uncompressedSize, options, expectedEntryCrc32) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	const entry = await zipWriter.add(FILENAME, new zip.BlobReader(rawData), Object.assign({
		passThrough: true,
		encrypted: true,
		encryptionStrength: 3,
		uncompressedSize,
		compressionMethod: 8
	}, options));
	await zipWriter.close();
	if (entry.crc32 !== expectedEntryCrc32) {
		throw new Error();
	}
	return new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
}

function findSignature(bytes, signature) {
	for (let offset = 0; offset < bytes.length - 3; offset++) {
		if (readUint32(bytes, offset) == signature) {
			return offset;
		}
	}
	throw new Error();
}

function getVendorVersion(bytes, headerOffset) {
	for (let offset = headerOffset; offset < bytes.length - 1; offset++) {
		if (bytes[offset] == 0x01 && bytes[offset + 1] == 0x99) {
			return bytes[offset + 4];
		}
	}
	throw new Error();
}

function readUint32(bytes, offset) {
	return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, true);
}
