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
	await readIntactEntriesInReverse(array.slice());
	await detectsAnOverlapUnderTheLocalDirectoryCheck(array.slice(), recordOffsets);
	// forge the last entry so that its data range contains the second entry entirely, ending before the
	// central directory since the data of an entry is bounded by it
	const containerDataOffset = 30 + view.getUint16(26, true) + view.getUint16(28, true);
	view.setUint32(recordOffsets[2] + 42, 0, true);
	view.setUint32(recordOffsets[2] + 20, directoryOffset - containerDataOffset - 1, true);
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
	}
	// and the container checked first, so that the contained entry is the one detected
	const reverseZipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), { checkOverlappingEntry: true, checkLocalDirectory: false });
	const reverseEntries = await reverseZipReader.getEntries();
	try {
		await reverseEntries[2].getData(new zip.BlobWriter(), { checkOverlappingEntryOnly: true });
		try {
			await reverseEntries[1].getData(new zip.BlobWriter(), { checkOverlappingEntryOnly: true });
			throw new Error();
		} catch (error) {
			if (error.message != zip.ERR_OVERLAPPING_ENTRY) {
				throw error;
			}
			if (error.overlappingEntry !== reverseEntries[2]) {
				throw new Error("expected the error to carry the container entry, got " + error.overlappingEntry, { cause: error });
			}
		}
	} finally {
		await reverseZipReader.close();
		await zip.terminateWorkers();
	}
}

// a real byte overlap: the first entry is stretched 10 bytes into the local file header of the second one, in
// its local file header and in its central directory record alike, so the default local directory check passes
// and only the overlap detection can tell the two entries apart
async function detectsAnOverlapUnderTheLocalDirectoryCheck(array, recordOffsets) {
	const view = new DataView(array.buffer);
	const dataOffset = 30 + view.getUint16(26, true) + view.getUint16(28, true);
	const secondEntryOffset = view.getUint32(recordOffsets[1] + 42, true);
	const stretchedSize = secondEntryOffset + 10 - dataOffset;
	for (const [sizeOffset, uncompressedSizeOffset] of [[18, 22], [recordOffsets[0] + 20, recordOffsets[0] + 24]]) {
		view.setUint32(sizeOffset, stretchedSize, true);
		view.setUint32(uncompressedSizeOffset, stretchedSize, true);
	}
	const lenientZipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array));
	const lenientEntries = await lenientZipReader.getEntries();
	try {
		const stretchedData = await lenientEntries[0].getData(new zip.Uint8ArrayWriter());
		const content = await lenientEntries[1].getData(new zip.TextWriter());
		if (stretchedData.length != stretchedSize || content != CONTENTS[1]) {
			throw new Error("expected both entries to be readable without the overlap check, got " + stretchedData.length + " bytes and " + content);
		}
	} finally {
		await lenientZipReader.close();
	}
	for (const [firstIndex, secondIndex] of [[0, 1], [1, 0]]) {
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), { checkOverlappingEntry: true });
		const entries = await zipReader.getEntries();
		try {
			await entries[firstIndex].getData(new zip.BlobWriter());
			try {
				await entries[secondIndex].getData(new zip.BlobWriter());
				throw new Error("expected the overlap to be detected when reading entry " + secondIndex + " after entry " + firstIndex);
			} catch (error) {
				if (error.message != zip.ERR_OVERLAPPING_ENTRY) {
					throw error;
				}
				if (error.overlappingEntry !== entries[firstIndex]) {
					throw new Error("expected the error to carry entry " + firstIndex + ", got " + error.overlappingEntry, { cause: error });
				}
			}
		} finally {
			await zipReader.close();
		}
	}
}

// adjacent entries checked out of order, and one of them twice, must pass: the check compares the
// new range with its neighbours by offset, not with the entries in reading order
async function readIntactEntriesInReverse(array) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), { checkOverlappingEntryOnly: true });
	const entries = await zipReader.getEntries();
	try {
		for (const entry of [...entries].reverse()) {
			await entry.getData(new zip.BlobWriter());
		}
		await entries[0].getData(new zip.BlobWriter());
		const content = await entries[1].getData(new zip.TextWriter(), { checkOverlappingEntryOnly: false });
		if (content != CONTENTS[1]) {
			throw new Error("expected the entry to stay readable after the check, got " + content);
		}
	} finally {
		await zipReader.close();
	}
}
