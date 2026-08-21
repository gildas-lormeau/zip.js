/* global URL */

import * as zip from "../zip-lib.js";

const LOREM_PREFIX = "Lorem ipsum";
const UNCOMPRESSED_SIZE = 1162;
const url = new URL("./../data/lorem-zip64-data-descriptor.zip", import.meta.url).href;

export { test };

async function test() {
	const zipReader = new zip.ZipReader(new zip.HttpReader(url, { preventHeadRequest: true }), { checkOverlappingEntry: true });
	const [entry] = await zipReader.getEntries();
	const text = await entry.getData(new zip.TextWriter(), { checkCrc32: true });
	await zipReader.close();
	await zip.terminateWorkers();
	const { localDirectory } = entry;
	const { dataDescriptor } = localDirectory;
	if (!localDirectory.zip64 || !localDirectory.bitFlag.dataDescriptor) {
		throw new Error("the local header does not declare a zip64 data descriptor");
	}
	if (!dataDescriptor || !dataDescriptor.signature) {
		throw new Error("the data descriptor record has not been read");
	}
	if (dataDescriptor.crc32 != entry.crc32 ||
		dataDescriptor.compressedSize != entry.compressedSize ||
		dataDescriptor.uncompressedSize != UNCOMPRESSED_SIZE) {
		throw new Error("data descriptor mismatch: " + JSON.stringify(dataDescriptor));
	}
	if (!text.startsWith(LOREM_PREFIX) || text.length != UNCOMPRESSED_SIZE) {
		throw new Error("content mismatch");
	}
}
