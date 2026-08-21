/* global TextEncoder */

// A password used to be dropped silently when writing data as-is, producing an archive the caller
// believed was encrypted: at the filesystem level, exporting a tree mixing entries imported as-is and
// entries added normally protected the added ones only. Passing data through an already encrypted entry
// keeps working, since the exported zip file is then encrypted as a whole.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.".repeat(4);
const PASSWORD = "password";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	await passwordRejectedWithPassThrough();
	await emptyPasswordsKeepBeingIgnored();
	await passwordTypeCheckedWithPassThrough();
	await passwordAcceptedWithEncryptedData();
	await exportRejectsPasswordWithPassThroughTree();
	await exportKeepsPasswordWithEncryptedPassThroughTree();
	await zip.terminateWorkers();
}

async function passwordRejectedWithPassThrough() {
	const { data, uncompressedSize, signature, compressionMethod } = await getPassThroughData({});
	await assertThrows({ password: PASSWORD }, { passThrough: true, uncompressedSize, signature, compressionMethod }, data, "constructor password");
	await assertThrows({}, { passThrough: true, uncompressedSize, signature, compressionMethod, password: PASSWORD }, data, "entry password");
	await assertThrows({}, { passThrough: true, uncompressedSize, signature, compressionMethod, rawPassword: new TextEncoder().encode(PASSWORD) }, data, "entry rawPassword");
}

async function emptyPasswordsKeepBeingIgnored() {
	const { data, uncompressedSize, signature, compressionMethod } = await getPassThroughData({});
	for (const passwordOptions of [{}, { password: undefined }, { password: "" }, { password: null }, { rawPassword: new Uint8Array() }]) {
		const entryOptions = Object.assign({ passThrough: true, uncompressedSize, signature, compressionMethod }, passwordOptions);
		const [entry] = await readEntries(await buildZip({}, entryOptions, data));
		if (entry.encrypted) {
			throw new Error("expected no encryption for " + JSON.stringify(passwordOptions));
		}
	}
}

// The type of the password used to be checked only when the data was compressed by the writer.
async function passwordTypeCheckedWithPassThrough() {
	const { data, uncompressedSize, signature, compressionMethod } = await getPassThroughData({});
	const entryOptions = { passThrough: true, uncompressedSize, signature, compressionMethod, password: 42 };
	await assertThrows({}, entryOptions, data, "invalid password type", zip.ERR_INVALID_PASSWORD_TYPE);
}

async function passwordAcceptedWithEncryptedData() {
	const { data, uncompressedSize, compressionMethod } = await getPassThroughData({ password: PASSWORD, encryptionStrength: 3 });
	const entryOptions = { passThrough: true, uncompressedSize, compressionMethod, encrypted: true, encryptionStrength: 3, password: PASSWORD };
	const [entry] = await readEntries(await buildZip({}, entryOptions, data));
	if (!entry.encrypted) {
		throw new Error("expected an encrypted entry");
	}
	const text = await entry.getData(new zip.TextWriter(), { password: PASSWORD });
	if (text != TEXT_CONTENT) {
		throw new Error("expected the content of the encrypted entry to be readable");
	}
}

async function exportRejectsPasswordWithPassThroughTree() {
	const source = await buildFilesystemZip({});
	for (const exportOptions of [{ password: PASSWORD }, { password: PASSWORD, readerOptions: { passThrough: true } }]) {
		const zipFs = new zip.ZipFS();
		await zipFs.importUint8Array(source, exportOptions.readerOptions ? {} : { passThrough: true });
		zipFs.addText("added.txt", TEXT_CONTENT);
		let thrownError;
		try {
			await zipFs.exportUint8Array(exportOptions);
		} catch (error) {
			thrownError = error;
		}
		assertMessage(thrownError, zip.ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH, JSON.stringify(exportOptions));
	}
}

async function exportKeepsPasswordWithEncryptedPassThroughTree() {
	const source = await buildFilesystemZip({ password: PASSWORD });
	const zipFs = new zip.ZipFS();
	await zipFs.importUint8Array(source, { passThrough: true });
	zipFs.addText("added.txt", TEXT_CONTENT);
	const exported = await zipFs.exportUint8Array({ password: PASSWORD });
	const entries = await readEntries(exported);
	if (entries.length != 2) {
		throw new Error("expected 2 entries, got " + entries.length);
	}
	for (const entry of entries) {
		if (!entry.encrypted) {
			throw new Error("expected " + entry.filename + " to be encrypted");
		}
		const text = await entry.getData(new zip.TextWriter(), { password: PASSWORD });
		if (text != TEXT_CONTENT) {
			throw new Error("expected the content of " + entry.filename + " to be readable");
		}
	}
}

async function getPassThroughData(writerOptions) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), writerOptions);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	const [entry] = await readEntries(await zipWriter.close());
	const data = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	return { data, uncompressedSize: entry.uncompressedSize, signature: entry.signature, compressionMethod: entry.compressionMethod };
}

async function buildFilesystemZip(exportOptions) {
	const zipFs = new zip.ZipFS();
	zipFs.addText(FILENAME, TEXT_CONTENT);
	return await zipFs.exportUint8Array(exportOptions);
}

async function buildZip(writerOptions, entryOptions, data) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), writerOptions);
	await zipWriter.add(FILENAME, new zip.Uint8ArrayReader(data), entryOptions);
	return await zipWriter.close();
}

async function readEntries(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	return await zipReader.getEntries();
}

async function assertThrows(writerOptions, entryOptions, data, description, expectedMessage = zip.ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH) {
	let thrownError;
	try {
		await buildZip(writerOptions, entryOptions, data);
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
		throw new Error("expected \"" + expectedMessage + "\" for " + description + ", got \"" + thrownError.message + "\"");
	}
}
