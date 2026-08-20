/* global TextEncoder, AbortController, EventTarget */

// Checks that options taking an enumeration of values, a bounded number, or a given shape reject anything
// else instead of silently falling back to a default or failing much later with an error naming an internal
// variable. Every value probed here used to be accepted: an unknown strictness behaved as "balanced", a
// negative or non-numeric level disabled compression altogether, a password of another type produced an
// unencrypted archive, and the function and signal options reached their call site untouched. Values meaning
// "no value" (undefined, the falsy passwords that already stood for "no password", and the falsy functions
// standing for "use the default") must keep working.

import * as zip from "../zip-lib.js";

const CONTENT = "The quick brown fox jumps over the lazy dog.".repeat(20);
const STREAM_PROPERTY_NAMES = ["createWorker", "CompressionStream", "DecompressionStream", "CompressionStreamFallback", "DecompressionStreamFallback"];

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
	await functionOptionsRejectOtherValues();
	await functionOptionsKeepAcceptingFalsyValues();
	await signalRejectsOtherValues();
	await signalKeepsAcceptingAbortSignals();
	await signalAcceptsAnythingShapedLikeASignal();
	await readerPasswordRejectsOtherTypes();
	await readerPasswordKeepsAcceptingEmptyValues();
	await readerOptionsRejectOtherShapes();
	await readerOptionsKeepAcceptingObjectsAndFalsyValues();
	await msdosAttributesRejectOtherShapes();
	await msdosAttributesKeepAcceptingValidValues();
	configureRejectsValuesThatUsedToHang();
	configureKeepsAcceptingValidValues();
	configureRejectsStreamsOfAnotherType();
	configureKeepsAcceptingFalsyStreams();
	await configureLeavesTheConfigurationUntouchedWhenItThrows();
	configureAcceptsAnythingWithoutConfigurableProperties();
	await createReadableNormalizesChunkSizesThatUsedToHang();
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

// msdosAttributesRaw was the only one of the four attribute guards checking the range without checking the
// type, although the message it throws and the documentation both promise an integer: NaN, {} and [] compare
// false against both bounds and used to write 0, while 1.5 wrote 1. msdosAttributes rejected a string but not
// an array, which walks past typeof and used to reset the whole attribute word, dropping the unix mode and
// the made-by-unix marker of the entry without any error.
async function msdosAttributesRejectOtherShapes() {
	for (const msdosAttributesRaw of [NaN, 1.5, -1, 256, {}, [], [1], true, "attributes"]) {
		await assertThrows({ msdosAttributesRaw }, zip.ERR_INVALID_MSDOS_ATTRIBUTES, "msdosAttributesRaw: " + describe(msdosAttributesRaw));
	}
	for (const msdosAttributes of ["readOnly", 42, true, [], [true]]) {
		await assertThrows({ msdosAttributes }, zip.ERR_INVALID_MSDOS_DATA, "msdosAttributes: " + describe(msdosAttributes));
	}
}

// A numeric string keeps working, like every other numeric option.
async function msdosAttributesKeepAcceptingValidValues() {
	const attributeCases = [
		[{ msdosAttributesRaw: 0 }, 0],
		[{ msdosAttributesRaw: 255 }, 255],
		[{ msdosAttributesRaw: "1" }, 1],
		[{ msdosAttributes: {} }, 0],
		[{ msdosAttributes: { readOnly: true, archive: true } }, 0x21]
	];
	for (const [options, expectedAttributes] of attributeCases) {
		const [entry] = await readEntries(await buildZip(options));
		if (entry.msdosAttributesRaw != expectedAttributes) {
			throw new Error("expected msdosAttributesRaw " + expectedAttributes + " for " + JSON.stringify(options) + " got " + entry.msdosAttributesRaw);
		}
	}
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

// Every one of these used to reach the call site untouched and fail there with a raw "X is not a function"
// naming an internal variable, except the two that were not reached at all: createTempStream is only called
// when the buffered write actually spills, so a wrong value survived a small archive, and the central
// directory decryption is skipped unless the directory really is encrypted, so a wrong value was ignored
// outright. The size prediction must reject them too, since it is supposed to throw wherever the export would.
async function functionOptionsRejectOtherValues() {
	for (const value of [42, "encode", {}, [], true, new Uint8Array()]) {
		const description = ": " + String(value);
		await assertThrows({ encodeText: value }, zip.ERR_INVALID_FUNCTION_OPTION, "encodeText" + description);
		await assertThrows({ createTempStream: value }, zip.ERR_INVALID_FUNCTION_OPTION, "createTempStream" + description);
		await assertThrows({ createTempStream: value, bufferedWrite: true }, zip.ERR_INVALID_FUNCTION_OPTION, "createTempStream with bufferedWrite" + description);
		await assertThrows({ signCentralDirectory: value }, zip.ERR_INVALID_FUNCTION_OPTION, "signCentralDirectory" + description);
		await assertCloseThrows({ signCentralDirectory: value }, zip.ERR_INVALID_FUNCTION_OPTION, "close signCentralDirectory" + description);
		await assertExportedSizeThrows({ signCentralDirectory: value }, zip.ERR_INVALID_FUNCTION_OPTION, "getExportedSize signCentralDirectory" + description);
		await assertReadThrows(await buildZip({}), { decodeText: value }, zip.ERR_INVALID_FUNCTION_OPTION, "decodeText" + description);
		await assertReadThrows(await buildZip({}), { decryptCentralDirectory: value }, zip.ERR_INVALID_FUNCTION_OPTION, "decryptCentralDirectory" + description);
	}
}

// A falsy value keeps meaning "use the default". The reader already worked that way, the writer used to
// crash on null since only undefined fell back to the built-in text encoder.
async function functionOptionsKeepAcceptingFalsyValues() {
	for (const value of [undefined, null, 0, ""]) {
		const description = String(value);
		const [entry] = await readEntries(await buildZip({ encodeText: value, createTempStream: value, bufferedWrite: true }), { decodeText: value, decryptCentralDirectory: value });
		if (entry.filename != "test.txt") {
			throw new Error("expected the default text codecs for " + description + " got \"" + entry.filename + "\"");
		}
		await closeZip(undefined, { signCentralDirectory: value });
	}
	let signed = false;
	await closeZip(undefined, { signCentralDirectory: () => { signed = true; return new Uint8Array([1, 2, 3]); } });
	if (!signed) {
		throw new Error("expected the signature function to be called");
	}
}

// The likeliest mistake is passing the AbortController itself instead of its signal, which used to reach
// pipeThrough and fail there with a WebIDL message naming StreamPipeOptions. The three surfaces accepting
// a signal must agree: the writer, the reader and the entries of a filesystem.
async function signalRejectsOtherValues() {
	const data = await buildZip({});
	for (const signal of [42, {}, "abort", new AbortController(), new EventTarget()]) {
		const description = "signal: " + String(signal);
		await assertThrows({ signal }, zip.ERR_INVALID_SIGNAL, description);
		await assertGetDataThrows(data, { signal }, zip.ERR_INVALID_SIGNAL, "reader " + description);
		let thrownError;
		try {
			await buildFileSystem().zipEntry.getData(new zip.Uint8ArrayWriter(), { signal });
		} catch (error) {
			thrownError = error;
		}
		assertMessage(thrownError, zip.ERR_INVALID_SIGNAL, "filesystem entry " + description);
		thrownError = undefined;
		try {
			await buildFileSystem().fileSystem.exportUint8Array({ signal });
		} catch (error) {
			thrownError = error;
		}
		assertMessage(thrownError, zip.ERR_INVALID_SIGNAL, "filesystem export " + description);
	}
}

// A real signal must go through untouched on the three surfaces. That an already aborted one still aborts
// rather than being rejected as invalid is asserted by test-option-validation-abort-signal.js, which needs a
// feature this file does not.
async function signalKeepsAcceptingAbortSignals() {
	for (const signal of [undefined, null, new AbortController().signal]) {
		await buildFileSystem().zipEntry.getData(new zip.Uint8ArrayWriter(), { signal });
		const [entry] = await readEntries(await buildZip({ signal }), { signal });
		await entry.getData(new zip.Uint8ArrayWriter(), { signal });
	}
}

// The check is duck typed rather than an instanceof so that a signal built in another realm keeps working,
// which means an object merely shaped like a signal passes it too. Engines with native streams then reject
// it in pipeTo, and that is their call: what this asserts is that the guard does not claim it is invalid.
async function signalAcceptsAnythingShapedLikeASignal() {
	const signal = { aborted: false, addEventListener() { }, removeEventListener() { } };
	let thrownError;
	try {
		await buildZip({ signal });
	} catch (error) {
		thrownError = error;
	}
	if (thrownError && thrownError.message == zip.ERR_INVALID_SIGNAL) {
		throw new Error("expected a signal shaped object to reach the engine rather than the guard");
	}
}

// The writer has rejected these since c1c4916d while the reader silently dropped them: a number failed the
// truthiness test of the password normalization and the entry died with "File contains encrypted entry", and
// a Uint8Array derived another key and died with "Invalid password". Both hid the actual mistake.
async function readerPasswordRejectsOtherTypes() {
	const data = await buildZip({ password: "secret" });
	for (const password of [42, {}, [], true, new TextEncoder().encode("secret")]) {
		await assertGetDataThrows(data, { password }, zip.ERR_INVALID_PASSWORD_TYPE, "reader password: " + String(password));
	}
	for (const rawPassword of [42, {}, "secret", true]) {
		await assertGetDataThrows(data, { rawPassword }, zip.ERR_INVALID_PASSWORD_TYPE, "reader rawPassword: " + String(rawPassword));
	}
}

// The falsy values standing for "no password" must keep reaching the encrypted entry error rather than the
// new type error, and both spellings of a valid password must still decrypt.
async function readerPasswordKeepsAcceptingEmptyValues() {
	const data = await buildZip({ password: "secret" });
	for (const options of [{}, { password: undefined }, { password: "" }, { password: null }, { rawPassword: new Uint8Array() }]) {
		await assertGetDataThrows(data, options, zip.ERR_ENCRYPTED, "reader " + JSON.stringify(options));
	}
	for (const options of [{ password: "secret" }, { rawPassword: new TextEncoder().encode("secret") }]) {
		const [entry] = await readEntries(data, options);
		const content = await entry.getData(new zip.TextWriter(), options);
		if (content != CONTENT) {
			throw new Error("expected the entry to be decrypted with " + JSON.stringify(options));
		}
	}
}

// readerOptions is the only object-shaped option of the filesystem API which was not checked, msdosAttributes
// already rejected the same mistake. A value of another type was spread blind into the option bag, where a
// string contributes numeric keys and nothing else: passing the password there instead of in an object failed
// with the unrelated ERR_ENCRYPTED, passing passThrough there wrote decompressed bytes without any error, and
// getExportedSize answered ERR_UNDETERMINED_SIZE. The three entry points must agree, and reject before doing
// any work: the directory handle below is an empty object which no export could write to. An array is rejected
// too, since it is ignored in exactly the same way and typeof alone would let it through.
async function readerOptionsRejectOtherShapes() {
	for (const readerOptions of ["secret", 42, true, ["secret"], [], () => "secret"]) {
		const description = "readerOptions: " + describe(readerOptions);
		await assertExportThrows({ readerOptions }, zip.ERR_INVALID_READER_OPTIONS, "export " + description);
		await assertExportedSizeThrows({ readerOptions }, zip.ERR_INVALID_READER_OPTIONS, "getExportedSize " + description);
		await assertExportHandleThrows({ readerOptions }, zip.ERR_INVALID_READER_OPTIONS, "exportFileSystemHandle " + description);
	}
}

// A falsy value keeps meaning "not set", like everywhere else in the API.
async function readerOptionsKeepAcceptingObjectsAndFalsyValues() {
	for (const readerOptions of [undefined, null, false, 0, "", {}, { passThrough: false }]) {
		const description = "readerOptions: " + describe(readerOptions);
		const { fileSystem } = buildFileSystem();
		const [entry] = await readEntries(await fileSystem.exportUint8Array({ readerOptions }));
		if (entry.filename != "test.txt") {
			throw new Error("expected the entry to be exported with " + description + " got \"" + entry.filename + "\"");
		}
		if (typeof await new zip.ZipFS().getExportedSize({ readerOptions }) != "number") {
			throw new Error("expected a size with " + description);
		}
	}
}

function buildFileSystem() {
	const fileSystem = new zip.ZipFS();
	return { fileSystem, zipEntry: fileSystem.addText("test.txt", CONTENT) };
}

async function closeZip(globalComment, closeOptions) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("test.txt", new zip.TextReader(CONTENT));
	return zipWriter.close(globalComment, closeOptions);
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

// A maxWorkers lower than 1 used to deadlock ZipWriter#add for ever, since no entry could start and none
// could release the next one, so it hung with no error at all instead of failing.
function configureRejectsValuesThatUsedToHang() {
	for (const maxWorkers of [0, -1, 0.5, NaN, Infinity, null, true, false, "", " ", "many", {}, []]) {
		assertConfigureThrows({ maxWorkers }, zip.ERR_INVALID_MAX_WORKERS, "maxWorkers: " + describe(maxWorkers));
	}
}

// Numeric strings must keep working here too, and the timeouts must accept them: they gate on
// Number.isFinite(), so a string used to disable the timer silently, leaving every web worker alive.
function configureKeepsAcceptingValidValues() {
	for (const maxWorkers of [1, 4, "4", " 8 "]) {
		zip.configure({ maxWorkers });
	}
	for (const chunkSize of [1, 64, 65536, "65536", 0, -1, null, "big"]) {
		zip.configure({ chunkSize });
	}
	for (const timeout of [0, 300, "300", Infinity]) {
		zip.configure({
			terminateWorkerTimeout: timeout,
			workerStarvationTimeout: timeout,
			workerStartupTimeout: timeout
		});
	}
	zip.resetConfiguration();
}

function configureRejectsStreamsOfAnotherType() {
	for (const propertyName of STREAM_PROPERTY_NAMES) {
		for (const propertyValue of ["nope", {}, 42, []]) {
			assertConfigureThrows({ [propertyName]: propertyValue }, zip.ERR_INVALID_FUNCTION_OPTION,
				propertyName + ": " + describe(propertyValue));
		}
	}
}

// false is the documented value of CompressionStream and DecompressionStream when the environment does not
// provide them, and null is how the entry points excluding a web worker or the WASM module unset their URI.
function configureKeepsAcceptingFalsyStreams() {
	for (const propertyName of STREAM_PROPERTY_NAMES) {
		for (const propertyValue of [false, null, 0, ""]) {
			zip.configure({ [propertyName]: propertyValue });
		}
	}
	zip.resetConfiguration();
}

// A configuration is applied once every value it holds has been checked, so a bag mixing a valid property
// and an invalid one leaves the configuration exactly as it was.
async function configureLeavesTheConfigurationUntouchedWhenItThrows() {
	zip.configure({ chunkSize: 8192 });
	assertConfigureThrows({ chunkSize: 4096, maxWorkers: 0 }, zip.ERR_INVALID_MAX_WORKERS, "a partially valid configuration");
	const readable = new zip.Uint8ArrayReader(new Uint8Array(10000)).createReadable();
	const { value } = await readable.getReader().read();
	if (value.length != 8192) {
		throw new Error("expected the previous chunkSize to be kept, got chunks of " + value.length + " bytes");
	}
	zip.resetConfiguration();
}

// configure() used to throw a TypeError naming a deprecated property when it was called without any argument.
function configureAcceptsAnythingWithoutConfigurableProperties() {
	for (const configuration of [undefined, null, "x", 42, [], true]) {
		zip.configure(configuration);
	}
}

// An invalid chunkSize is tolerated, and the configuration is not the only place it is read from: a chunkSize
// that does not represent a number used to make the readable of createReadable() loop for ever without
// emitting anything, and 0 or a fractional value closed it before any data was read.
async function createReadableNormalizesChunkSizesThatUsedToHang() {
	for (const chunkSize of [0, -1, 0.5, NaN, Infinity, null, true, "big", {}, []]) {
		const readable = new zip.Uint8ArrayReader(new Uint8Array(10)).createReadable({ chunkSize });
		const { value } = await readable.getReader().read();
		if (!value || value.length != 10) {
			throw new Error("expected the whole data for createReadable chunkSize: " + describe(chunkSize));
		}
	}
	const readable = new zip.Uint8ArrayReader(new Uint8Array(10000)).createReadable({ chunkSize: "4096" });
	const { value } = await readable.getReader().read();
	if (value.length != 4096) {
		throw new Error("expected a numeric string chunkSize to be used, got chunks of " + value.length + " bytes");
	}
}

function assertConfigureThrows(configuration, expectedMessage, description) {
	let thrownError;
	try {
		zip.configure(configuration);
	} catch (error) {
		thrownError = error;
	}
	assertMessage(thrownError, expectedMessage, description);
}

function describe(value) {
	return typeof value == "string" || Array.isArray(value) ? JSON.stringify(value) : String(value);
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

async function assertGetDataThrows(data, options, expectedMessage, description) {
	let thrownError;
	try {
		const [entry] = await readEntries(data, options);
		await entry.getData(new zip.Uint8ArrayWriter(), options);
	} catch (error) {
		thrownError = error;
	}
	assertMessage(thrownError, expectedMessage, description);
}

async function assertCloseThrows(closeOptions, expectedMessage, description) {
	let thrownError;
	try {
		await closeZip(undefined, closeOptions);
	} catch (error) {
		thrownError = error;
	}
	assertMessage(thrownError, expectedMessage, description);
}

async function assertExportThrows(options, expectedMessage, description) {
	let thrownError;
	try {
		const { fileSystem } = buildFileSystem();
		await fileSystem.exportUint8Array(options);
	} catch (error) {
		thrownError = error;
	}
	assertMessage(thrownError, expectedMessage, description);
}

async function assertExportHandleThrows(options, expectedMessage, description) {
	let thrownError;
	try {
		const { fileSystem } = buildFileSystem();
		await fileSystem.exportFileSystemHandle({}, options);
	} catch (error) {
		thrownError = error;
	}
	assertMessage(thrownError, expectedMessage, description);
}

async function assertExportedSizeThrows(options, expectedMessage, description) {
	let thrownError;
	try {
		const { fileSystem } = buildFileSystem();
		await fileSystem.getExportedSize(options);
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
