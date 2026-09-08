// Copying one entry from a ZipReader into a ZipWriter needs about ten properties forwarded, and a caller
// who forwards the obvious subset gets silent corruption rather than an error: an encrypted entry lands
// marked `encrypted=false` over untouched ciphertext. The `entry` option hands the source entry to the
// writer instead, which knows the whole set. The oracle used here is byte identity: an archive copied
// entry by entry with `{ passThrough: true, entry }` must be the archive it was read from.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.".repeat(8);
const PASSWORD = "password";
const NEW_PASSWORD = "new-password";
const USER_EXTRA_FIELD_TYPE = 0xcafe;
const USER_EXTRA_FIELD_DATA = new Uint8Array([1, 2, 3, 4]);
const SOURCE_DATE = new Date("2001-02-03T04:05:06Z");

export { test };

async function test() {
	try {
		await copiesAnArchiveByteForByte();
		await copiesDirectoriesThroughTheSamePath();
		await renamesWhileCopying();
		await lettingTheCallerOverrideWhatTheEntryDeclares();
		await forwardsOnlyTheCompressionStageWhenReencrypting();
		await keepsTheMetadataWithoutPassThrough();
		await rejectsAZipCryptoDateChange();
		await allowsAZipCryptoDateChangeWhenOnlyTheCompressionStagePasses();
		await rejectsAnAE2SourceWhichWouldStoreNoChecksum();
		await rejectsValuesWhichAreNotEntries();
	} finally {
		await zip.terminateWorkers();
	}
}

// The whole point, on an archive holding every shape the writer can produce: user extra fields, unix ids,
// non-default attributes, a comment, an explicit date, AES, ZipCrypto, a stored entry and a directory.
async function copiesAnArchiveByteForByte() {
	const source = await buildSourceArchive();
	const copy = await copyArchive(source, () => ({ passThrough: true }));
	assertSameBytes(copy, source, "expected the copied archive to be identical to the source");
	const entries = await readEntries(copy);
	const encrypted = entries.filter(entry => entry.encrypted);
	if (encrypted.length != 2) {
		throw new Error("expected 2 encrypted entries in the copy, got " + encrypted.length);
	}
	for (const entry of entries) {
		if (!entry.directory) {
			const text = await entry.getData(new zip.TextWriter(), { password: PASSWORD, checkCrc32: true });
			if (entry.filename != "stored.bin" && text != TEXT_CONTENT) {
				throw new Error("expected " + entry.filename + " to read back");
			}
		}
	}
}

// A directory has no data to pass through, so the caller would otherwise have to special-case it. The
// option carries `directory` too, which keeps the copy loop uniform.
async function copiesDirectoriesThroughTheSamePath() {
	const source = await buildSourceArchive();
	const entries = await readEntries(source);
	const directory = entries.find(entry => entry.directory);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(directory.filename, null, { passThrough: true, entry: directory });
	const [copied] = await readEntries(await zipWriter.close());
	if (!copied.directory) {
		throw new Error("expected the copied entry to be a directory");
	}
	if (copied.comment != directory.comment) {
		throw new Error("expected the comment to be preserved, got " + JSON.stringify(copied.comment));
	}
	if (copied.externalFileAttributes != directory.externalFileAttributes) {
		throw new Error("expected the attributes to be preserved, got " + copied.externalFileAttributes);
	}
}

// The name stays an argument, so a copy can be re-pathed while everything else is carried over.
async function renamesWhileCopying() {
	const source = await buildSourceArchive();
	const copy = await copyArchive(source, entry => ({ passThrough: true, name: "page1/" + entry.filename }));
	const entries = await readEntries(copy);
	for (const entry of entries) {
		if (!entry.filename.startsWith("page1/")) {
			throw new Error("expected the entry to be renamed, got " + entry.filename);
		}
	}
	const [plain] = entries;
	if (plain.internalFileAttributes != 1 || plain.uid != 501 || plain.comment != "a comment") {
		throw new Error("expected the metadata to survive the rename");
	}
	if (plain.lastModDate.getTime() != SOURCE_DATE.getTime()) {
		throw new Error("expected the date to survive the rename, got " + plain.lastModDate.toISOString());
	}
}

// The entry is a source of defaults, not an override: an option written by the caller wins.
async function lettingTheCallerOverrideWhatTheEntryDeclares() {
	const source = await buildSourceArchive();
	const copy = await copyArchive(source, () => ({
		passThrough: true,
		comment: "replaced",
		internalFileAttributes: 0,
		lastAccessDate: undefined
	}));
	for (const entry of await readEntries(copy)) {
		if (entry.comment != "replaced") {
			throw new Error("expected the comment to be overridden, got " + JSON.stringify(entry.comment));
		}
		if (entry.internalFileAttributes !== 0) {
			throw new Error("expected the internal attributes to be overridden, got " + entry.internalFileAttributes);
		}
	}
}

// `passThrough` is a depth, and so is the option: with `"compressed"` the encryption stage runs for real,
// so the scheme of the source must not be carried over. Forwarding it would silently rekey a ZipCrypto
// entry back into ZipCrypto while the caller asked for AES.
async function forwardsOnlyTheCompressionStageWhenReencrypting() {
	const source = await buildSourceArchive();
	const entries = await readEntries(source);
	for (const entry of entries) {
		if (entry.directory) {
			continue;
		}
		const data = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: "compressed", password: PASSWORD });
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.add(entry.filename, new zip.Uint8ArrayReader(data), {
			passThrough: "compressed",
			entry,
			password: NEW_PASSWORD
		});
		const [copied] = await readEntries(await zipWriter.close());
		if (!copied.encrypted || copied.zipCrypto) {
			throw new Error(entry.filename + ": expected an AES entry, got zipCrypto=" + Boolean(copied.zipCrypto));
		}
		if (!copied.extraFieldAES || copied.extraFieldAES.vendorVersion != 2) {
			throw new Error(entry.filename + ": expected an AE-2 entry after a new encryption");
		}
		const text = await copied.getData(new zip.TextWriter(), { password: NEW_PASSWORD });
		if (entry.filename != "stored.bin" && text != TEXT_CONTENT) {
			throw new Error(entry.filename + ": the content did not survive the rekey");
		}
	}
}

// Without `passThrough` the content is compressed again, and only the metadata half of the entry applies.
async function keepsTheMetadataWithoutPassThrough() {
	const source = await buildSourceArchive();
	const [entry] = await readEntries(source);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(entry.filename, new zip.TextReader(TEXT_CONTENT), { entry, level: 0 });
	const [copied] = await readEntries(await zipWriter.close());
	if (copied.compressionMethod !== 0) {
		throw new Error("expected the entry to be stored, got method " + copied.compressionMethod);
	}
	if (copied.comment != "a comment" || copied.uid != 501 || copied.internalFileAttributes != 1) {
		throw new Error("expected the metadata of the source entry to be carried over");
	}
	const text = await copied.getData(new zip.TextWriter(), { checkCrc32: true });
	if (text != TEXT_CONTENT) {
		throw new Error("expected the recompressed entry to read back");
	}
}

// The ZipCrypto verification byte is derived from the date of the source entry when a data descriptor is
// used, so changing the date makes the copy undecryptable. The writer refuses instead of writing it. Only
// the high byte of the DOS time reaches that verification byte, so a date change that leaves it alone is
// accepted, which is the branch the fixed source date above keeps this test on the right side of.
async function rejectsAZipCryptoDateChange() {
	const source = await buildSourceArchive();
	const entry = (await readEntries(source)).find(candidate => candidate.zipCrypto);
	const data = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	await assertThrows(() => {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		return zipWriter.add(entry.filename, new zip.Uint8ArrayReader(data), {
			passThrough: true,
			entry,
			lastModDate: new Date("2011-12-13T14:15:16Z")
		});
	}, zip.ERR_ZIP_CRYPTO_LAST_MOD_DATE, "changing the date of a ZipCrypto entry");
	const sameHighByteDate = new Date(SOURCE_DATE.getTime() + 60000);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(entry.filename, new zip.Uint8ArrayReader(data), {
		passThrough: true,
		entry,
		lastModDate: sameHighByteDate
	});
	const [copied] = await readEntries(await zipWriter.close());
	if (copied.lastModDate.getTime() != sameHighByteDate.getTime()) {
		throw new Error("expected a date change keeping the DOS time high byte to be accepted");
	}
	const text = await copied.getData(new zip.TextWriter(), { password: PASSWORD });
	if (text != TEXT_CONTENT) {
		throw new Error("expected the copy to stay decryptable after that date change");
	}
}

// The refusal above exists because ZipCrypto derives its password verification byte from the date, and
// passThrough: true keeps the ciphertext the source built from the old one. Under "compressed" the
// encryption stage runs again, or does not run at all, so the date is free to change and refusing it would
// block the rekey that value was added for.
async function allowsAZipCryptoDateChangeWhenOnlyTheCompressionStagePasses() {
	const source = await buildSourceArchive();
	const entry = (await readEntries(source)).find(candidate => candidate.zipCrypto);
	const data = await entry.getData(new zip.Uint8ArrayWriter(), { password: PASSWORD, passThrough: "compressed" });
	const lastModDate = new Date("2011-12-13T14:15:16Z");
	for (const { label, options } of [
		{ label: "into a plain entry", options: {} },
		{ label: "rekeyed into AES", options: { password: NEW_PASSWORD } }
	]) {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.add(entry.filename, new zip.Uint8ArrayReader(data),
			Object.assign({ passThrough: "compressed", entry, lastModDate }, options));
		const [copied] = await readEntries(await zipWriter.close());
		if (copied.lastModDate.getTime() != lastModDate.getTime()) {
			throw new Error("expected the new date to survive a compressed copy " + label +
				", got " + copied.lastModDate.toISOString());
		}
	}
}

// An AE-2 entry stores no plaintext checksum, so decrypting it into an entry which does store one cannot
// produce a valid checksum without inflating the content. The writer refuses rather than storing a zero.
async function rejectsAnAE2SourceWhichWouldStoreNoChecksum() {
	const source = await buildSourceArchive();
	const entry = (await readEntries(source)).find(candidate => candidate.filename == "aes.txt");
	const data = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: "compressed", password: PASSWORD });
	await assertThrows(() => {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		return zipWriter.add(entry.filename, new zip.Uint8ArrayReader(data), { passThrough: "compressed", entry });
	}, zip.ERR_UNDEFINED_CRC32, "decrypting an AE-2 entry into an unencrypted one");
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(entry.filename, new zip.Uint8ArrayReader(data), {
		passThrough: "compressed",
		entry,
		password: NEW_PASSWORD
	});
	const [copied] = await readEntries(await zipWriter.close());
	const text = await copied.getData(new zip.TextWriter(), { password: NEW_PASSWORD });
	if (text != TEXT_CONTENT) {
		throw new Error("expected the same entry to rekey into AES, where no checksum is stored");
	}
}

async function rejectsValuesWhichAreNotEntries() {
	for (const value of [null, "lorem.txt", 42, [], true]) {
		await assertThrows(() => {
			const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
			return zipWriter.add("lorem.txt", new zip.TextReader(TEXT_CONTENT), { entry: value });
		}, zip.ERR_INVALID_ENTRY, "the entry option set to " + JSON.stringify(value));
	}
}

async function buildSourceArchive() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("plain.txt", new zip.TextReader(TEXT_CONTENT), {
		comment: "a comment",
		uid: 501,
		gid: 20,
		unixMode: 0o100755,
		extraField: new Map([[USER_EXTRA_FIELD_TYPE, USER_EXTRA_FIELD_DATA]]),
		internalFileAttributes: 1,
		lastModDate: SOURCE_DATE
	});
	await zipWriter.add("aes.txt", new zip.TextReader(TEXT_CONTENT), { password: PASSWORD, encryptionStrength: 3 });
	// the date is pinned because rejectsAZipCryptoDateChange compares its DOS time high byte to a fixed one,
	// and the current time matches that byte for eight minutes of every day, which turned CI red once
	await zipWriter.add("zipcrypto.txt", new zip.TextReader(TEXT_CONTENT),
		{ password: PASSWORD, zipCrypto: true, lastModDate: SOURCE_DATE });
	await zipWriter.add("stored.bin", new zip.Uint8ArrayReader(new Uint8Array(64).fill(7)), { level: 0 });
	// entries whose headers differ from what the writer would choose by itself: the byte-identity oracle is
	// blind to anything the fixture leaves at a default, which is how three forwarding gaps got through
	await zipWriter.add("fast.txt", new zip.TextReader(TEXT_CONTENT), { level: 1 });
	await zipWriter.add("max.txt", new zip.TextReader(TEXT_CONTENT), { level: 9 });
	await zipWriter.add("flagged.txt", new zip.TextReader(TEXT_CONTENT), { useUnicodeFileNames: true });
	await zipWriter.add("unixids.txt", new zip.TextReader(TEXT_CONTENT),
		{ uid: 1000, gid: 100, unixExtraFieldType: "unix" });
	await zipWriter.add("dir/", null, { directory: true, comment: "a directory" });
	return await zipWriter.close();
}

async function copyArchive(archive, getOptions) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(archive));
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (const entry of await zipReader.getEntries()) {
		const options = getOptions(entry);
		const { name = entry.filename } = options;
		delete options.name;
		const reader = entry.directory ? null :
			new zip.Uint8ArrayReader(await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true }));
		await zipWriter.add(name, reader, Object.assign({ entry }, options));
	}
	await zipReader.close();
	return await zipWriter.close();
}

async function readEntries(archive) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(archive));
	return await zipReader.getEntries();
}

function assertSameBytes(actual, expected, message) {
	if (actual.length != expected.length) {
		throw new Error(message + " (" + actual.length + " bytes instead of " + expected.length + ")");
	}
	for (let index = 0; index < actual.length; index++) {
		if (actual[index] != expected[index]) {
			throw new Error(message + " (first difference at offset " + index + ")");
		}
	}
}

async function assertThrows(run, expectedMessage, description) {
	let thrownError;
	try {
		await run();
	} catch (error) {
		thrownError = error;
	}
	if (!thrownError) {
		throw new Error("expected " + description + " to be rejected");
	}
	if (thrownError.message != expectedMessage) {
		throw new Error("expected \"" + expectedMessage + "\" for " + description + ", got \"" + thrownError.message + "\"");
	}
}
