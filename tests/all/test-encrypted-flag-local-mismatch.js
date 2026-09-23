// The encrypted flag of an entry follows the central directory, like its sizes and its method. A
// local file header whose bit 0 is cleared used to switch decryption off, so a tolerant reader read
// the ciphertext as plaintext and failed on the uncompressed size. The disagreement is still
// rejected as ambiguous under the default strictness; a tolerant reader now decrypts the entry as
// the central directory declares and deposits the mismatched bit flag warning alone.

import * as zip from "../zip-lib.js";

const CONTENT = "encrypted flag cleared in the local header ".repeat(8);
const FILENAME = "entry.txt";
const PASSWORD = "password";
const BITFLAG_ENCRYPTED = 0x1;
const LOCAL_HEADER_BITFLAG_OFFSET = 6;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		for (const options of [{}, { zipCrypto: true }]) {
			const bytes = await writeEntry(options);
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			view.setUint16(LOCAL_HEADER_BITFLAG_OFFSET, view.getUint16(LOCAL_HEADER_BITFLAG_OFFSET, true) & ~BITFLAG_ENCRYPTED, true);
			await expectAmbiguity(bytes, JSON.stringify(options));
			await readTolerant(bytes, JSON.stringify(options));
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function writeEntry(options) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, new zip.TextReader(CONTENT), Object.assign({ password: PASSWORD }, options));
	return zipWriter.close();
}

async function expectAmbiguity(bytes, label) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes));
	const [entry] = await zipReader.getEntries();
	let error;
	try {
		await entry.getData(new zip.TextWriter(), { password: PASSWORD });
	} catch (thrown) {
		error = thrown;
	}
	await zipReader.close();
	if (!error || error.message != zip.ERR_AMBIGUOUS_ARCHIVE || error.reason != zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG) {
		throw new Error(label + ": expected " + zip.ERR_AMBIGUOUS_ARCHIVE + " with the reason " + zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG +
			", got " + (error ? error.message + " " + error.reason : "no error"));
	}
}

async function readTolerant(bytes, label) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes), { strictness: "tolerant" });
	const [entry] = await zipReader.getEntries();
	const content = await entry.getData(new zip.TextWriter(), { password: PASSWORD });
	await zipReader.close();
	if (content != CONTENT) {
		throw new Error(label + ": a tolerant reader must decrypt the entry as the central directory declares");
	}
	const reasons = entry.warnings.map(warning => warning.reason);
	if (reasons.length != 1 || reasons[0] != zip.WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG) {
		throw new Error(label + ": expected the mismatched bit flag warning alone, got " + JSON.stringify(reasons));
	}
}
