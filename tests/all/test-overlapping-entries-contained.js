import * as zip from "../zip-lib.js";

const CONTENTS = ["alpha-content", "beta-content!", "gamma-content"];

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { level: 0, dataDescriptor: false, extendedTimestamp: false });
	for (let indexContent = 0; indexContent < CONTENTS.length; indexContent++) {
		await zipWriter.add("file" + indexContent + ".txt", new zip.TextReader(CONTENTS[indexContent]));
	}
	await zipWriter.close();
	const array = new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
	const view = new DataView(array.buffer);
	const directoryOffset = view.getUint32(array.length - 22 + 16, true);
	let offset = directoryOffset;
	const recordOffsets = [];
	for (let indexRecord = 0; indexRecord < CONTENTS.length; indexRecord++) {
		recordOffsets.push(offset);
		offset += 46 + view.getUint16(offset + 28, true) + view.getUint16(offset + 30, true) + view.getUint16(offset + 32, true);
	}
	// forge the last entry so that its data range contains the second entry entirely
	const containedEntryOffset = view.getUint32(recordOffsets[1] + 42, true);
	view.setUint32(recordOffsets[2] + 42, 0, true);
	view.setUint32(recordOffsets[2] + 20, containedEntryOffset + 200, true);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), { checkOverlappingEntry: true, checkLocalDirectory: false });
	const entries = await zipReader.getEntries();
	try {
		// the contained entry must be checked first to test that detection does not depend on the order
		await entries[1].getData(new zip.BlobWriter(), { checkOverlappingEntryOnly: true });
		try {
			await entries[2].getData(new zip.BlobWriter(), { checkOverlappingEntryOnly: true });
			throw new Error();
		} catch (error) {
			if (error.message != zip.ERR_OVERLAPPING_ENTRY) {
				throw error;
			}
		}
	} finally {
		await zipReader.close();
		await zip.terminateWorkers();
	}
}
