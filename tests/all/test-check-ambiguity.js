import * as zip from "../zip-lib.js";

const CONTENTS = ["alpha-content", "beta-content!"];
const EXTRA_DATA_LENGTH = 64;

export { test };

async function test() {
	zip.configure({ useWebWorkers: true });
	try {
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter, { level: 0, dataDescriptor: false });
		for (let indexContent = 0; indexContent < CONTENTS.length; indexContent++) {
			await zipWriter.add("file" + indexContent + ".txt", new zip.TextReader(CONTENTS[indexContent]));
		}
		await zipWriter.close();
		const array = new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
		// a clean archive is not ambiguous
		await readEntries(array);
		// appended data must be rejected
		const appendedArray = new Uint8Array(array.length + EXTRA_DATA_LENGTH);
		appendedArray.set(array);
		appendedArray.fill(0x5a, array.length);
		await expectAmbiguous(appendedArray, "appended data");
		// prepended data must be rejected
		const prependedArray = new Uint8Array(EXTRA_DATA_LENGTH + array.length);
		prependedArray.fill(0x5a, 0, EXTRA_DATA_LENGTH);
		prependedArray.set(array, EXTRA_DATA_LENGTH);
		await expectAmbiguous(prependedArray, "prepended data");
		// a forged entry count that hides trailing central directory records must be rejected
		const hiddenRecordArray = array.slice();
		const hiddenRecordView = new DataView(hiddenRecordArray.buffer);
		const endOfDirectoryOffset = hiddenRecordArray.length - 22;
		hiddenRecordView.setUint16(endOfDirectoryOffset + 8, CONTENTS.length - 1, true);
		hiddenRecordView.setUint16(endOfDirectoryOffset + 10, CONTENTS.length - 1, true);
		await expectAmbiguous(hiddenRecordArray, "trailing central directory data");
		// an end of central directory record disagreeing with its zip64 counterpart must be rejected
		const zip64BlobWriter = new zip.BlobWriter("application/zip");
		const zip64ZipWriter = new zip.ZipWriter(zip64BlobWriter, { zip64: true, level: 0, dataDescriptor: false });
		for (let indexContent = 0; indexContent < CONTENTS.length; indexContent++) {
			await zip64ZipWriter.add("file" + indexContent + ".txt", new zip.TextReader(CONTENTS[indexContent]));
		}
		await zip64ZipWriter.close();
		// zip.js saturates every end of central directory field when zip64 is used; un-saturate the entry
		// count to a value that disagrees with the zip64 record while the other fields stay saturated
		const mismatchedArray = new Uint8Array(await (await zip64BlobWriter.getData()).arrayBuffer());
		const mismatchedView = new DataView(mismatchedArray.buffer);
		const mismatchedEndOfDirectoryOffset = mismatchedArray.length - 22;
		mismatchedView.setUint16(mismatchedEndOfDirectoryOffset + 8, CONTENTS.length - 1, true);
		mismatchedView.setUint16(mismatchedEndOfDirectoryOffset + 10, CONTENTS.length - 1, true);
		await expectAmbiguous(mismatchedArray, "mismatched zip64 end of central directory record");
		// two central directory records sharing a filename must be rejected
		const duplicateArray = array.slice();
		const duplicateView = new DataView(duplicateArray.buffer);
		const duplicateDirectoryOffset = duplicateView.getUint32(duplicateArray.length - 22 + 16, true);
		const firstRecordNameOffset = duplicateDirectoryOffset + 46;
		const firstRecordNameLength = duplicateView.getUint16(duplicateDirectoryOffset + 28, true);
		const firstRecordName = duplicateArray.subarray(firstRecordNameOffset, firstRecordNameOffset + firstRecordNameLength);
		const secondRecordOffset = duplicateDirectoryOffset + 46 + firstRecordNameLength +
			duplicateView.getUint16(duplicateDirectoryOffset + 30, true) + duplicateView.getUint16(duplicateDirectoryOffset + 32, true);
		// overwrite the second record filename with the first one (both names have the same length here)
		duplicateArray.set(firstRecordName, secondRecordOffset + 46);
		await expectAmbiguous(duplicateArray, "duplicate filename");
		// a local file header disagreeing with its central directory record must be rejected when reading the entry
		const localFilenameArray = array.slice();
		localFilenameArray[30] ^= 0x01;
		await expectAmbiguousEntry(localFilenameArray, "mismatched local file header (filename)");
		// ... while the same archive can still be read without the option (the central directory is authoritative)
		await readEntriesUnchecked(localFilenameArray);
		const localBitFlagArray = array.slice();
		const localBitFlagView = new DataView(localBitFlagArray.buffer);
		localBitFlagView.setUint16(6, localBitFlagView.getUint16(6, true) ^ 0x0800, true);
		await expectAmbiguousEntry(localBitFlagArray, "mismatched local file header (general purpose bit flag)");
		const localMethodArray = array.slice();
		new DataView(localMethodArray.buffer).setUint16(8, 8, true);
		await expectAmbiguousEntry(localMethodArray, "mismatched local file header (compression method)");
		const localSignatureArray = array.slice();
		for (let indexByte = 14; indexByte < 18; indexByte++) {
			localSignatureArray[indexByte] ^= 0xff;
		}
		await expectAmbiguousEntry(localSignatureArray, "mismatched local file header (crc32 or sizes)");
		// zeroed out local signature and sizes are tolerated (produced by some streaming writers)
		const localZeroedArray = array.slice();
		localZeroedArray.fill(0, 14, 26);
		await readEntries(localZeroedArray);
	} finally {
		await zip.terminateWorkers();
	}
}

async function readEntries(array) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), { checkAmbiguity: true });
	try {
		const entries = await zipReader.getEntries();
		if (entries.length != CONTENTS.length) {
			throw new Error();
		}
		for (let indexEntry = 0; indexEntry < entries.length; indexEntry++) {
			const data = await entries[indexEntry].getData(new zip.TextWriter());
			if (data != CONTENTS[indexEntry]) {
				throw new Error();
			}
		}
	} finally {
		await zipReader.close();
	}
}

async function readEntriesUnchecked(array) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array));
	try {
		const entries = await zipReader.getEntries();
		for (let indexEntry = 0; indexEntry < entries.length; indexEntry++) {
			const data = await entries[indexEntry].getData(new zip.TextWriter());
			if (data != CONTENTS[indexEntry]) {
				throw new Error();
			}
		}
	} finally {
		await zipReader.close();
	}
}

async function expectAmbiguous(array, reason) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), { checkAmbiguity: true });
	try {
		await zipReader.getEntries();
		throw new Error();
	} catch (error) {
		if (error.message != zip.ERR_AMBIGUOUS_ARCHIVE || error.reason != reason) {
			throw error;
		}
	} finally {
		await zipReader.close();
	}
}

async function expectAmbiguousEntry(array, reason) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), { checkAmbiguity: true });
	try {
		const entries = await zipReader.getEntries();
		try {
			await entries[0].getData(new zip.TextWriter());
			throw new Error();
		} catch (error) {
			if (error.message != zip.ERR_AMBIGUOUS_ARCHIVE || error.reason != reason) {
				throw error;
			}
		}
	} finally {
		await zipReader.close();
	}
}
