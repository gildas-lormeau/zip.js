// Bit 6 of the general purpose bit flag declares strong encryption, which zip.js does not support.
// The check used to read the local file header alone, so a bit set there only rejected an AES entry
// the central directory describes, and a bit set in the central directory only was ignored. The
// bit is now compared between the two records like bit 0: a disagreement is rejected as ambiguous
// under the default strictness, and a tolerant reader follows the central directory, which decrypts
// the entry with the warning in the first case and reports unsupported encryption in the second.

import * as zip from "../zip-lib.js";

const CONTENT = "strong encryption flag mismatch ".repeat(8);
const FILENAME = "entry.txt";
const PASSWORD = "password";
const BITFLAG_STRONG_ENCRYPTION = 0x40;
const LOCAL_HEADER_BITFLAG_OFFSET = 6;
const CENTRAL_HEADER_BITFLAG_OFFSET = 8;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		const bytes = await writeEntry();
		const localOnly = setStrongEncryptionBit(bytes.slice(), true, false);
		await expectAmbiguity(localOnly, {}, "local only");
		await expectContent(localOnly, { strictness: "tolerant" }, [zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG], "local only");
		const centralOnly = setStrongEncryptionBit(bytes.slice(), false, true);
		await expectAmbiguity(centralOnly, {}, "central directory only");
		await expectError(centralOnly, { strictness: "tolerant" }, zip.ERR_UNSUPPORTED_ENCRYPTION, "central directory only");
		const both = setStrongEncryptionBit(bytes.slice(), true, true);
		for (const options of [{}, { strictness: "tolerant" }]) {
			await expectError(both, options, zip.ERR_UNSUPPORTED_ENCRYPTION, "both records");
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function writeEntry() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, new zip.TextReader(CONTENT), { password: PASSWORD });
	return zipWriter.close();
}

function setStrongEncryptionBit(bytes, local, central) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	if (local) {
		setBit(view, LOCAL_HEADER_BITFLAG_OFFSET);
	}
	if (central) {
		setBit(view, findCentralDirectory(view) + CENTRAL_HEADER_BITFLAG_OFFSET);
	}
	return bytes;
}

function setBit(view, offset) {
	view.setUint16(offset, view.getUint16(offset, true) | BITFLAG_STRONG_ENCRYPTION, true);
}

// scanned backwards, so the encrypted data of the entry is never searched
function findCentralDirectory(view) {
	for (let offset = view.byteLength - 4; offset >= 0; offset--) {
		if (view.getUint32(offset, true) == CENTRAL_FILE_HEADER_SIGNATURE) {
			return offset;
		}
	}
	throw new Error("central directory not found");
}

async function expectAmbiguity(bytes, options, label) {
	const error = await readError(bytes, options);
	if (!error || error.message != zip.ERR_AMBIGUOUS_ARCHIVE || error.reason != zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG) {
		throw new Error(label + ": expected " + zip.ERR_AMBIGUOUS_ARCHIVE + " with the reason " + zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG +
			", got " + (error ? error.message + " " + error.reason : "no error"));
	}
}

async function expectError(bytes, options, message, label) {
	const error = await readError(bytes, options);
	if (!error || error.message != message) {
		throw new Error(label + ": expected " + message + ", got " + (error ? error.message : "no error"));
	}
}

async function readError(bytes, options) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes), options);
	const [entry] = await zipReader.getEntries();
	let error;
	try {
		await entry.getData(new zip.TextWriter(), { password: PASSWORD });
	} catch (thrown) {
		error = thrown;
	}
	await zipReader.close();
	return error;
}

async function expectContent(bytes, options, expectedReasons, label) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes), options);
	const [entry] = await zipReader.getEntries();
	const content = await entry.getData(new zip.TextWriter(), { password: PASSWORD });
	await zipReader.close();
	if (content != CONTENT) {
		throw new Error(label + ": a tolerant reader must decrypt the entry as the central directory declares");
	}
	const reasons = entry.warnings.map(warning => warning.reason);
	if (reasons.length != expectedReasons.length || expectedReasons.some(reason => !reasons.includes(reason))) {
		throw new Error(label + ": expected the warnings " + JSON.stringify(expectedReasons) + ", got " + JSON.stringify(reasons));
	}
}
