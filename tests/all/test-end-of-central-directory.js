import * as zip from "../zip-lib.js";

const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;

export { test };

async function test() {
	zip.configure({ useWebWorkers: true });
	try {
		// a benign comment that happens to embed the end of central directory signature must still open:
		// the record is selected by reaching the end of the file, not by being the first signature scanned
		const comment = new Uint8Array(40);
		comment.set([0x50, 0x4b, 0x05, 0x06], 5);
		await expectFilenames(await buildZip(["a.txt"], comment), ["a.txt"]);

		// an append-remnant archive ([old zip][new zip]) has two end of central directory records but only the
		// last reaches the end of the file; it must open and expose the appended (current) directory
		const oldZip = await buildZip(["old1.txt", "old2.txt"]);
		const newZip = await buildZip(["old1.txt", "old2.txt", "added.txt"]);
		const appendRemnant = concat(oldZip, newZip);
		await expectFilenames(appendRemnant, ["old1.txt", "old2.txt", "added.txt"]);

		// when the appended archive shares the byte layout of the one it followed, the stale central directory
		// offset still lands on the previous (identical) directory. Selecting it would expose the stale directory,
		// so the reconciled offset — anchored to the end of the file — must be preferred and the appended
		// directory (identical filename length keeps both halves byte-aligned) wins
		const firstHalf = await buildZip(["reala.txt"]);
		const secondHalf = await buildZip(["evilb.txt"]);
		await expectFilenames(concat(firstHalf, secondHalf), ["evilb.txt"]);

		// a comment-cloak polyglot embeds a whole second archive inside the outer record's comment, so two
		// records reach the end of the file and each dereferences to a central directory: genuinely ambiguous
		const inner = await buildZip(["evil.sh"]);
		const cloak = await buildZip(["safe.txt"], inner);
		await expectAmbiguous(cloak, zip.WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY);
		await expectAmbiguous(cloak, zip.WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY, { checkAmbiguity: true });
		await expectAmbiguous(cloak, zip.WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY, { strictness: "strict" });
		// tolerant recovers deterministically by picking the last end-anchored record (the inner archive)
		await expectFilenames(cloak, ["evil.sh"], { strictness: "tolerant" });

		// appended data is bounded by strictness: strict rejects any, balanced tolerates up to a 16-bit
		// comment's worth, tolerant accepts any amount
		const base = await buildZip(["a.txt"]);
		const smallAppended = appendFiller(base, 64);
		const largeAppended = appendFiller(base, 70000);
		await expectAmbiguous(smallAppended, zip.WARNING_APPENDED_DATA, { strictness: "strict" });
		await expectFilenames(smallAppended, ["a.txt"]);
		await expectAmbiguous(largeAppended, zip.WARNING_APPENDED_DATA);
		await expectFilenames(largeAppended, ["a.txt"], { strictness: "tolerant" });
		await expectFilenames(largeAppended, ["a.txt"], { maxAppendedDataSize: 128 * 1024 });

		// an explicit maxAppendedDataSize takes precedence over the strictness default at every level, including
		// tolerant (which otherwise never rejects): data over the cap but within the search window is reported as
		// appended data, while a cap too small to reach the record surfaces the record as missing
		const withinWindow = appendFiller(base, 2048);
		await expectFilenames(withinWindow, ["a.txt"], { strictness: "tolerant" });
		await expectAmbiguous(withinWindow, zip.WARNING_APPENDED_DATA, { strictness: "tolerant", maxAppendedDataSize: 1024 });
		await expectError(largeAppended, zip.ERR_EOCDR_NOT_FOUND, { strictness: "tolerant", maxAppendedDataSize: 1024 });

		// appended data that embeds a stray end of central directory signature nearer the end than the real
		// record must not hijack the fallback used when no record is end-anchored: skipping the stray signature,
		// the reader recovers the record that actually points to a directory
		const strayFiller = appendFiller(base, 200);
		new DataView(strayFiller.buffer).setUint32(base.length + 40, END_OF_CENTRAL_DIR_SIGNATURE, true);
		await expectFilenames(strayFiller, ["a.txt"], { strictness: "tolerant" });
		await expectFilenames(strayFiller, ["a.txt"], { maxAppendedDataSize: 1024 });

		// a clean archive reads identically under every strictness level
		const clean = await buildZip(["x.txt", "y.txt"]);
		for (const strictness of ["strict", "balanced", "tolerant"]) {
			await expectFilenames(clean, ["x.txt", "y.txt"], { strictness });
		}

		// a comment stuffed with thousands of anchored but unreachable end of central directory records must not
		// amplify into one read per record: the reachability check is served from the tail window already in
		// memory and out-of-window probes are capped, so opening the real archive stays cheap
		const stuffed = stuffWithUnreachableRecords(await buildZip(["real.txt"], new Uint8Array(2000 * 22)), 2000);
		const countingReader = new CountingReader(stuffed);
		const stuffedZipReader = new zip.ZipReader(countingReader);
		try {
			const filenames = (await stuffedZipReader.getEntries()).map(entry => entry.filename);
			if (filenames.join(",") != "real.txt") {
				throw new Error("expected [real.txt] but read [" + filenames + "]");
			}
			if (countingReader.reads > 100) {
				throw new Error("end of central directory scan issued " + countingReader.reads + " reads (expected the amplification to be bounded)");
			}
		} finally {
			await stuffedZipReader.close();
		}

		// a comment whose bytes happen to end in an end of central directory record that points to no central
		// directory must not forge a second record: an empty record (files = 0, central directory length = 0) is
		// unfalsifiable, and a saturated (zip64-looking) record without its locator is not backed by anything.
		// Either would previously outrank the genuine directory — the archive was refused as ambiguous, or read
		// as empty under tolerant. The real directory must win under every strictness level instead.
		const emptyRecordComment = fakeEndOfDirectoryRecord({});
		const saturatedRecordComment = fakeEndOfDirectoryRecord({ filesLength: 0xFFFF, directoryDataLength: 0xFFFFFFFF, directoryDataOffset: 0xFFFFFFFF });
		for (const strictness of ["strict", "balanced", "tolerant"]) {
			await expectFilenames(await buildZip(["real.txt"], emptyRecordComment), ["real.txt"], { strictness });
			await expectFilenames(await buildZip(["real.txt"], saturatedRecordComment), ["real.txt"], { strictness });
		}

		// a genuine empty archive (no reachable directory to point at) must still open under every strictness
		// level, including behind a self-extracting stub
		const emptyArchive = await buildZip([]);
		for (const strictness of ["strict", "balanced", "tolerant"]) {
			await expectFilenames(emptyArchive, [], { strictness });
		}
		await expectFilenames(concat(new Uint8Array(500).fill(0x90), emptyArchive), []);
	} finally {
		await zip.terminateWorkers();
	}
}

// builds a bare 22-byte end of central directory record with the given fields, used as archive-comment bytes
// that impersonate a second record
function fakeEndOfDirectoryRecord({ filesLength = 0, directoryDataLength = 0, directoryDataOffset = 0 }) {
	const record = new Uint8Array(22);
	const view = new DataView(record.buffer);
	view.setUint32(0, END_OF_CENTRAL_DIR_SIGNATURE, true);
	view.setUint16(8, filesLength, true);
	view.setUint16(10, filesLength, true);
	view.setUint32(12, directoryDataLength, true);
	view.setUint32(16, directoryDataOffset, true);
	return record;
}

// counts every readUint8Array call so a test can assert the reader is not driven into unbounded I/O
class CountingReader extends zip.Reader {
	constructor(array) {
		super();
		this.array = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
		this.size = this.array.length;
		this.reads = 0;
	}
	readUint8Array(index, length) {
		this.reads++;
		return this.array.slice(index, index + length);
	}
}

// overwrites the trailing comment of `array` with `count` fake end of central directory records, each one
// anchored to the end of the file (so it is a scan candidate) but pointing at an unreachable central directory
// (so it is correctly rejected). Returns the patched array.
function stuffWithUnreachableRecords(array, count) {
	const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
	const size = array.length;
	const commentStart = size - count * 22;
	for (let index = 0; index < count; index++) {
		const recordOffset = commentStart + index * 22;
		view.setUint32(recordOffset, END_OF_CENTRAL_DIR_SIGNATURE, true);
		view.setUint16(recordOffset + 8, 1, true);
		view.setUint16(recordOffset + 10, 1, true);
		view.setUint32(recordOffset + 12, 1, true);
		view.setUint32(recordOffset + 16, 0xFEFEFEFE, true);
		view.setUint16(recordOffset + 20, size - recordOffset - 22, true);
	}
	return array;
}

async function buildZip(filenames, comment) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { level: 0, dataDescriptor: false, extendedTimestamp: false });
	for (const filename of filenames) {
		await zipWriter.add(filename, new zip.TextReader("content-of-" + filename));
	}
	await zipWriter.close(comment && comment.length ? comment : undefined);
	return new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
}

function concat(first, second) {
	const array = new Uint8Array(first.length + second.length);
	array.set(first);
	array.set(second, first.length);
	return array;
}

function appendFiller(array, length) {
	const result = new Uint8Array(array.length + length);
	result.set(array);
	result.fill(0x5a, array.length);
	return result;
}

function countEndOfDirectorySignatures(array) {
	const view = new DataView(array.buffer);
	let count = 0;
	for (let indexByte = 0; indexByte + 4 <= array.length; indexByte++) {
		if (view.getUint32(indexByte, true) == END_OF_CENTRAL_DIR_SIGNATURE) {
			count++;
		}
	}
	return count;
}

async function expectFilenames(array, expectedFilenames, options) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), options);
	try {
		const entries = await zipReader.getEntries();
		const filenames = entries.map(entry => entry.filename);
		if (filenames.join(",") != expectedFilenames.join(",")) {
			throw new Error("expected [" + expectedFilenames + "] but read [" + filenames + "]");
		}
		for (let indexEntry = 0; indexEntry < entries.length; indexEntry++) {
			const data = await entries[indexEntry].getData(new zip.TextWriter());
			if (data != "content-of-" + expectedFilenames[indexEntry]) {
				throw new Error("unexpected content for " + expectedFilenames[indexEntry]);
			}
		}
	} finally {
		await zipReader.close();
	}
}

async function expectAmbiguous(array, reason, options) {
	// make sure the fixture really does contain more than one end of central directory signature
	if (countEndOfDirectorySignatures(array) < 2 && reason == zip.WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY) {
		throw new Error("fixture is not multi-record");
	}
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), options);
	try {
		await zipReader.getEntries();
		throw new Error("expected an ambiguous archive error (" + reason + ")");
	} catch (error) {
		if (error.message != zip.ERR_AMBIGUOUS_ARCHIVE || error.reason != reason) {
			throw error;
		}
	} finally {
		await zipReader.close();
	}
}

async function expectError(array, message, options) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array), options);
	try {
		await zipReader.getEntries();
		throw new Error("expected error: " + message);
	} catch (error) {
		if (error.message != message) {
			throw error;
		}
	} finally {
		await zipReader.close();
	}
}
