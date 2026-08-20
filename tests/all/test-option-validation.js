/* global TextEncoder */

// Checks that options taking an enumeration of values or a bounded number reject anything else instead
// of silently falling back to a default. Every value probed here used to be accepted: an unknown
// strictness behaved as "balanced", a negative or non-numeric level disabled compression altogether,
// and a password of another type produced an unencrypted archive. Values meaning "no value" (undefined,
// and the falsy passwords that already stood for "no password") must keep working.

import * as zip from "../zip-lib.js";

const CONTENT = "The quick brown fox jumps over the lazy dog.".repeat(20);

export { test };

async function test() {
	await levelRejectsValuesOutsideItsRange();
	await levelAcceptsItsWholeRange();
	await numericStringsAreAccepted();
	await passwordRejectsOtherTypes();
	await passwordKeepsAcceptingEmptyValues();
	await encryptionStrengthRejectsNonIntegers();
	await strictnessRejectsUnknownValues();
	await filenameValidationRejectsUnknownValues();
	await maxAppendedDataSizeRejectsInvalidNumbers();
	await unixIdsRejectNonIntegers();
	await globalCommentRejectsOtherTypes();
	await entryCommentRejectsOtherTypes();
	await entryCommentKeepsAcceptingStrings();
	await datesRejectOtherValues();
	await datesKeepAcceptingEmptyValues();
	await extraFieldRejectsOtherShapes();
	await extraFieldKeepsAcceptingValidMaps();
	await zip.terminateWorkers();
}

async function levelRejectsValuesOutsideItsRange() {
	for (const level of [-1, 10, 1.5, NaN, Infinity, null, "fast", "", " ", "1.5", {}, [], true]) {
		await assertThrows({ level }, zip.ERR_INVALID_LEVEL, "level: " + JSON.stringify(level));
	}
}

// Numeric options are read from form controls, query strings and environment variables, which all
// yield strings. These worked before the guards existed, so they must keep working: only values that
// do not represent a number are rejected. The coerced number is what the rest of the writer sees, so
// level "9" must still set the maximum compression bit of the general purpose bit flag.
async function numericStringsAreAccepted() {
	for (const [level, expectedMethod] of [["0", 0], ["6", 8], ["9", 8]]) {
		const [entry] = await readEntries(await buildZip({ level }));
		if (entry.compressionMethod != expectedMethod) {
			throw new Error("expected method " + expectedMethod + " at level \"" + level + "\" got " + entry.compressionMethod);
		}
	}
	const [maximumLevelEntry] = await readEntries(await buildZip({ level: "9" }));
	if (maximumLevelEntry.bitFlag.level != 1) {
		throw new Error("expected the maximum compression bit flag, got " + maximumLevelEntry.bitFlag.level);
	}
	const [encryptedEntry] = await readEntries(await buildZip({ password: "secret", encryptionStrength: "3" }));
	if (encryptedEntry.extraFieldAES.strength != 3) {
		throw new Error("expected strength 3, got " + encryptedEntry.extraFieldAES.strength);
	}
	const [unixEntry] = await readEntries(await buildZip({ uid: "1000", gid: "1000", unixMode: "420" }));
	if (unixEntry.uid != 1000 || unixEntry.gid != 1000) {
		throw new Error("expected uid and gid 1000, got " + unixEntry.uid + " and " + unixEntry.gid);
	}
}

// The guard must not narrow the documented range, and level 0 must keep selecting the STORE method.
async function levelAcceptsItsWholeRange() {
	for (let level = 0; level <= 9; level++) {
		const [entry] = await readEntries(await buildZip({ level }));
		const expectedMethod = level ? 8 : 0;
		if (entry.compressionMethod != expectedMethod) {
			throw new Error("expected method " + expectedMethod + " at level " + level + " got " + entry.compressionMethod);
		}
	}
}

// A password of another type used to be ignored, producing a plain archive with no error at all, and a
// rawPassword passed as a string used to produce an archive that its equivalent password cannot open.
async function passwordRejectsOtherTypes() {
	for (const password of [42, {}, true, ["p"]]) {
		await assertThrows({ password }, zip.ERR_INVALID_PASSWORD_TYPE, "password: " + JSON.stringify(password));
	}
	for (const rawPassword of ["p", 42, []]) {
		await assertThrows({ rawPassword }, zip.ERR_INVALID_PASSWORD_TYPE, "rawPassword: " + JSON.stringify(rawPassword));
	}
}

async function passwordKeepsAcceptingEmptyValues() {
	for (const options of [{}, { password: undefined }, { password: "" }, { password: null }, { rawPassword: new Uint8Array() }]) {
		const [entry] = await readEntries(await buildZip(options));
		if (entry.encrypted) {
			throw new Error("expected no encryption for " + JSON.stringify(options));
		}
	}
	const [encryptedEntry] = await readEntries(await buildZip({ password: "secret" }));
	if (!encryptedEntry.encrypted) {
		throw new Error("expected an encrypted entry");
	}
}

// 2.5 used to pass the range check and fail much later with an opaque "invalid aes key size".
async function encryptionStrengthRejectsNonIntegers() {
	await assertThrows({ password: "secret", encryptionStrength: 2.5 }, zip.ERR_INVALID_ENCRYPTION_STRENGTH, "encryptionStrength: 2.5");
	for (const encryptionStrength of [1, 2, 3]) {
		const [entry] = await readEntries(await buildZip({ password: "secret", encryptionStrength }));
		if (entry.extraFieldAES.strength != encryptionStrength) {
			throw new Error("expected strength " + encryptionStrength + " got " + entry.extraFieldAES.strength);
		}
	}
}

async function strictnessRejectsUnknownValues() {
	const data = await buildZip({});
	for (const strictness of ["tolerent", "TOLERANT", "strict ", 1, null]) {
		await assertReadThrows(data, { strictness }, zip.ERR_INVALID_STRICTNESS, "strictness: " + String(strictness));
	}
	for (const strictness of ["strict", "balanced", "tolerant", undefined]) {
		await readEntries(data, { strictness });
	}
}

async function filenameValidationRejectsUnknownValues() {
	const data = await buildZip({});
	for (const filenameValidation of ["tolerent", "TOLERANT", 0]) {
		await assertReadThrows(data, { filenameValidation }, zip.ERR_INVALID_FILENAME_VALIDATION, "filenameValidation: " + String(filenameValidation));
	}
	for (const filenameValidation of ["strict", "balanced", "tolerant", undefined]) {
		await readEntries(data, { filenameValidation });
	}
}

async function maxAppendedDataSizeRejectsInvalidNumbers() {
	const data = await buildZip({});
	for (const maxAppendedDataSize of [-1, NaN, null, "", " ", "abc", {}]) {
		await assertReadThrows(data, { maxAppendedDataSize }, zip.ERR_INVALID_MAX_APPENDED_DATA_SIZE, "maxAppendedDataSize: " + JSON.stringify(maxAppendedDataSize));
	}
	for (const maxAppendedDataSize of [0, 1024, Infinity, "0", "1024", "Infinity"]) {
		await readEntries(data, { maxAppendedDataSize });
	}
}

// The messages of these guards already promised integers while only the range was checked, so a
// fractional id was silently truncated when written to the extra field.
async function unixIdsRejectNonIntegers() {
	await assertThrows({ uid: 1.5 }, zip.ERR_INVALID_UID, "uid: 1.5");
	await assertThrows({ gid: 1.5 }, zip.ERR_INVALID_GID, "gid: 1.5");
	await assertThrows({ unixMode: 0.5 }, zip.ERR_INVALID_UNIX_MODE, "unixMode: 0.5");
	await readEntries(await buildZip({ uid: 1000, gid: 1000, unixMode: 0o644 }));
}

// The entry comment option is a string while the global comment of close() is raw bytes, so a string
// is the natural mistake here. It used to pass the length check and crash in the record writer, after
// the whole archive had been written. The size prediction must reject it too, since it is supposed to
// throw wherever the export would.
async function globalCommentRejectsOtherTypes() {
	for (const globalComment of ["a global comment", 0, null, [], new ArrayBuffer(4)]) {
		const description = "globalComment: " + String(globalComment);
		let thrownError;
		try {
			await closeZip(globalComment);
		} catch (error) {
			thrownError = error;
		}
		assertMessage(thrownError, zip.ERR_INVALID_COMMENT_TYPE, description);
		thrownError = undefined;
		try {
			await new zip.ZipFS().getExportedSize({ globalComment });
		} catch (error) {
			thrownError = error;
		}
		assertMessage(thrownError, zip.ERR_INVALID_COMMENT_TYPE, "getExportedSize " + description);
	}
	await closeZip(new TextEncoder().encode("a global comment"));
	await closeZip();
	await new zip.ZipFS().getExportedSize({ globalComment: new TextEncoder().encode("a global comment") });
	await new zip.ZipFS().getExportedSize({});
}

// The mirror image of the mistake above: the caller who has just passed raw bytes to close() has every
// reason to expect the entry comment to take bytes too. It used to be accepted silently, String() turning
// the Uint8Array into the comma separated list of its byte values and writing that as the comment of an
// otherwise valid archive. The size prediction must reject it too, since it is supposed to throw wherever
// the export would.
async function entryCommentRejectsOtherTypes() {
	for (const comment of [new TextEncoder().encode("a comment"), 42, {}, ["a comment"], true]) {
		await assertThrows({ comment }, zip.ERR_INVALID_ENTRY_COMMENT_TYPE, "comment: " + String(comment));
	}
	const fileSystem = new zip.ZipFS();
	fileSystem.addText("test.txt", CONTENT, { comment: new TextEncoder().encode("a comment"), level: 0 });
	let thrownError;
	try {
		await fileSystem.getExportedSize();
	} catch (error) {
		thrownError = error;
	}
	assertMessage(thrownError, zip.ERR_INVALID_ENTRY_COMMENT_TYPE, "getExportedSize comment");
}

// The values standing for "no comment" must keep working, and a comment must still be written verbatim.
async function entryCommentKeepsAcceptingStrings() {
	for (const comment of [undefined, "", null, 0]) {
		const [entry] = await readEntries(await buildZip({ comment }));
		if (entry.comment) {
			throw new Error("expected no comment for " + String(comment) + " got \"" + entry.comment + "\"");
		}
	}
	const [entry] = await readEntries(await buildZip({ comment: "a comment" }));
	if (entry.comment != "a comment") {
		throw new Error("expected the comment to be written verbatim, got \"" + entry.comment + "\"");
	}
}

// An invalid Date used to produce an entry carrying no timestamp at all: NaN fails the Unix range test so
// no extended timestamp is written, the NTFS fallback that this failed test enables throws on BigInt(NaN)
// into a catch that empties the field, and the MIN_DATE/MAX_DATE clamp lets it through since both of its
// comparisons against NaN are false, leaving getHours() and friends to coerce the raw DOS date to 0. A
// timestamp in milliseconds is the other likely mistake, since it is what File#lastModified returns.
async function datesRejectOtherValues() {
	for (const propertyName of ["lastModDate", "lastAccessDate", "creationDate"]) {
		for (const date of [new Date("invalid"), 1700000000000, "2023-11-14T22:13:20Z", 0, {}, true]) {
			await assertThrows({ [propertyName]: date }, zip.ERR_INVALID_DATE, propertyName + ": " + String(date));
		}
	}
}

// undefined and null keep meaning "no date": the default applies to the modification date and the two
// others are left out of the extra fields.
async function datesKeepAcceptingEmptyValues() {
	const now = new Date();
	for (const options of [{}, { lastModDate: undefined }, { lastModDate: null }]) {
		const [entry] = await readEntries(await buildZip(options));
		if (Math.abs(entry.lastModDate.getTime() - now.getTime()) > 60000) {
			throw new Error("expected the current date for " + JSON.stringify(options) + " got " + entry.lastModDate.toISOString());
		}
	}
	const [entry] = await readEntries(await buildZip({ lastAccessDate: null, creationDate: null }));
	if (entry.lastAccessDate !== undefined || entry.creationDate !== undefined) {
		throw new Error("expected no access and creation dates, got " + entry.lastAccessDate + " and " + entry.creationDate);
	}
	const dates = { lastModDate: new Date(1700000000000), lastAccessDate: new Date(1700000001000), creationDate: new Date(1700000002000) };
	const [datedEntry] = await readEntries(await buildZip(dates));
	for (const [propertyName, date] of Object.entries(dates)) {
		if (datedEntry[propertyName].getTime() != date.getTime()) {
			throw new Error("expected " + propertyName + " " + date.toISOString() + " got " + datedEntry[propertyName].toISOString());
		}
	}
}

// Three of these shapes used to write a corrupt extra field instead of throwing: an array of pairs made
// forEach pass (pair, index), so the index became the id and the pair became the data; a value of another
// type was written as as many zero bytes as its length; and a negative id was wrapped to 0xFFFF by
// setUint16. The other shapes threw a DataView RangeError naming nothing. The Map of the read side pairs
// each id with an { type, data } object, which is why it must be rejected as data rather than serialized.
async function extraFieldRejectsOtherShapes() {
	const data = new Uint8Array([1, 2, 3, 4]);
	for (const extraField of [new Uint8Array([0xFE, 0xFF, 4, 0, 1, 2, 3, 4]), { 0xFFFE: data }, [[0xFFFE, data]], "extra field", 0xFFFE]) {
		await assertThrows({ extraField }, zip.ERR_INVALID_EXTRAFIELD, "extraField: " + String(extraField));
		await assertThrows({ localExtraField: extraField }, zip.ERR_INVALID_EXTRAFIELD, "localExtraField: " + String(extraField));
	}
	for (const type of [-1, 1.5, 0x10000, NaN, "65534", null]) {
		await assertThrows({ extraField: new Map([[type, data]]) }, zip.ERR_INVALID_EXTRAFIELD_TYPE, "extra field id: " + String(type));
	}
	for (const value of ["text", [1, 2, 3, 4], new ArrayBuffer(4), { type: 0xFFFE, data }, null]) {
		await assertThrows({ extraField: new Map([[0xFFFE, value]]) }, zip.ERR_INVALID_EXTRAFIELD_DATA_TYPE, "extra field data: " + String(value));
	}
	await assertThrows({ extraField: new Map([[0xFFFE, new Uint8Array(0x10000)]]) }, zip.ERR_INVALID_EXTRAFIELD_DATA, "extra field data: 64KB");
}

async function extraFieldKeepsAcceptingValidMaps() {
	const [entry] = await readEntries(await buildZip({ extraField: new Map([[0xFFFE, new Uint8Array([1, 2, 3, 4])], [0xFFFD, new Uint8Array()]]) }));
	const rawExtraField = Array.from(entry.extraField.get(0xFFFE).data);
	if (rawExtraField.join() != "1,2,3,4" || entry.extraField.get(0xFFFD).data.length) {
		throw new Error("expected the extra fields to be written verbatim, got " + JSON.stringify(rawExtraField));
	}
	await buildZip({ extraField: new Map(), localExtraField: new Map() });
}

async function closeZip(globalComment) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("test.txt", new zip.TextReader(CONTENT));
	return zipWriter.close(globalComment);
}

async function buildZip(options) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), options);
	await zipWriter.add("test.txt", new zip.TextReader(CONTENT), options);
	return await zipWriter.close();
}

async function readEntries(data, options) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), options);
	const entries = await zipReader.getEntries();
	await zipReader.close();
	return entries;
}

async function assertThrows(options, expectedMessage, description) {
	let thrownError;
	try {
		await buildZip(options);
	} catch (error) {
		thrownError = error;
	}
	assertMessage(thrownError, expectedMessage, description);
}

async function assertReadThrows(data, options, expectedMessage, description) {
	let thrownError;
	try {
		await readEntries(data, options);
	} catch (error) {
		thrownError = error;
	}
	assertMessage(thrownError, expectedMessage, description);
}

function assertMessage(thrownError, expectedMessage, description) {
	if (!thrownError) {
		throw new Error("expected " + description + " to be rejected");
	}
	if (thrownError.message != expectedMessage) {
		throw new Error("expected \"" + expectedMessage + "\" for " + description + " got \"" + thrownError.message + "\"");
	}
}
