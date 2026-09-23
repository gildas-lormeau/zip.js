// An AES extra field (0x9901) has a meaning only on a record whose compression method is 99. On a
// record that is not encrypted it used to override the compression method and make the entry
// unreadable; it is now ignored and reported as a malformed extra field, on the central directory
// record and on the local file header alike, so the entry is read with the method its record
// declares. On an encrypted record the field keeps its weight, because the data may well be AES
// behind a wrong method, as in tests/data/malformed-aes-method.zip, and the conflict stays rejected.

import * as zip from "../zip-lib.js";

const CONTENT = "stray AES extra field ".repeat(8);
const FILENAME = "entry.txt";
const PASSWORD = "password";
const EXTRAFIELD_TYPE_AES = 0x9901;
const EXTRAFIELD_DATA_AES = new Uint8Array([0x02, 0x00, 0x41, 0x45, 0x03, 0x08, 0x00]);
const COMPRESSION_METHOD_DEFLATE = 8;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await deflateEntryStaysReadable();
		await encryptedEntryStaysRejected();
	} finally {
		await zip.terminateWorkers();
	}
}

async function deflateEntryStaysReadable() {
	const bytes = await writeEntry({ extraField: new Map([[EXTRAFIELD_TYPE_AES, EXTRAFIELD_DATA_AES]]) });
	for (const options of [{}, { strictness: "strict" }]) {
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes), options);
		const [entry] = await zipReader.getEntries();
		if (entry.compressionMethod != COMPRESSION_METHOD_DEFLATE || entry.extraFieldAES) {
			throw new Error("the entry must keep the compression method its record declares and ignore the AES extra field, got " + entry.compressionMethod + (entry.extraFieldAES ? " with the field" : ""));
		}
		const warning = findWarning(zipReader.warnings, zip.WARNING_MALFORMED_EXTRA_FIELD);
		if (warning.filename != FILENAME) {
			throw new Error("the archive-level warning must name the entry, got " + JSON.stringify(warning));
		}
		const content = await entry.getData(new zip.TextWriter());
		await zipReader.close();
		if (content != CONTENT) {
			throw new Error("the entry must be read with the method its record declares");
		}
		findWarning(entry.warnings, zip.WARNING_MALFORMED_EXTRA_FIELD);
	}
}

async function encryptedEntryStaysRejected() {
	const bytes = await writeEntry({ password: PASSWORD, zipCrypto: true, extraField: new Map([[EXTRAFIELD_TYPE_AES, EXTRAFIELD_DATA_AES]]) });
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes));
	const [entry] = await zipReader.getEntries();
	let error;
	try {
		await entry.getData(new zip.TextWriter(), { password: PASSWORD });
	} catch (thrown) {
		error = thrown;
	}
	await zipReader.close();
	if (!error || error.message != zip.ERR_UNSUPPORTED_COMPRESSION) {
		throw new Error("an encrypted entry carrying an AES extra field behind another method must stay rejected, got " + (error ? error.message : "no error"));
	}
}

async function writeEntry(options) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, new zip.TextReader(CONTENT), options);
	return zipWriter.close();
}

function findWarning(warnings, reason) {
	const warning = warnings.find(warning => warning.reason == reason);
	if (!warning) {
		throw new Error("expected the warning " + reason + ", got " + JSON.stringify(warnings.map(warning => warning.reason)));
	}
	return warning;
}
