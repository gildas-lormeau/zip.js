/* global WritableStream, TextDecoder */

// Locks the password contract of the fs export API: the top-level `password` option encrypts the
// exported zip file, while the password decrypting already encrypted entries goes in
// `readerOptions`. `exportFileSystemHandle` writes plain files, so it accepts both spellings.

import * as zip from "../zip-lib.js";

const READ_PASSWORD = "read-password";
const WRITE_PASSWORD = "write-password";
const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	const encryptedBlob = await createEncryptedBlob();
	await testReaderPasswordDecrypts(encryptedBlob);
	await testTopLevelPasswordDoesNotDecrypt(encryptedBlob);
	await testReEncryption(encryptedBlob);
	await testFileSystemHandlePasswords(encryptedBlob);
	await zip.terminateWorkers();
}

async function createEncryptedBlob() {
	const fs = new zip.fs.FS();
	fs.addText(FILENAME, TEXT_CONTENT);
	return fs.exportBlob({ password: READ_PASSWORD });
}

async function testReaderPasswordDecrypts(encryptedBlob) {
	const fs = await importBlob(encryptedBlob);
	const blob = await fs.exportBlob({ readerOptions: { password: READ_PASSWORD } });
	const entry = await getImportedEntry(blob);
	if (entry.data.encrypted) {
		throw new Error("the exported entry should not be encrypted");
	}
	await assertText(entry, {});
}

async function testTopLevelPasswordDoesNotDecrypt(encryptedBlob) {
	const fs = await importBlob(encryptedBlob);
	try {
		await fs.exportBlob({ password: READ_PASSWORD });
	} catch (error) {
		if (error.message == zip.ERR_ENCRYPTED) {
			return;
		}
		throw error;
	}
	throw new Error("the top-level password should not decrypt the imported entries");
}

async function testReEncryption(encryptedBlob) {
	const fs = await importBlob(encryptedBlob);
	const blob = await fs.exportBlob({ password: WRITE_PASSWORD, readerOptions: { password: READ_PASSWORD } });
	const entry = await getImportedEntry(blob);
	if (!entry.data.encrypted) {
		throw new Error("the exported entry should be encrypted");
	}
	await assertText(entry, { password: WRITE_PASSWORD });
	if (await entry.checkPassword(READ_PASSWORD)) {
		throw new Error("the exported entry should not keep the password of the source entry");
	}
}

async function testFileSystemHandlePasswords(encryptedBlob) {
	await exportToHandle(encryptedBlob, { password: READ_PASSWORD });
	await exportToHandle(encryptedBlob, { readerOptions: { password: READ_PASSWORD } });
	await exportToHandle(encryptedBlob, { password: "invalid", readerOptions: { password: READ_PASSWORD } });
}

async function exportToHandle(encryptedBlob, options) {
	const fs = await importBlob(encryptedBlob);
	const target = createMockWriteDirectory();
	await fs.exportFileSystemHandle(target.handle, options);
	const text = new TextDecoder().decode(target.files.get(FILENAME));
	if (text != TEXT_CONTENT) {
		throw new Error("unexpected content \"" + text + "\" with " + JSON.stringify(options));
	}
}

async function importBlob(blob) {
	const fs = new zip.fs.FS();
	await fs.importBlob(blob);
	return fs;
}

async function getImportedEntry(blob) {
	const fs = await importBlob(blob);
	return fs.getChildByName(FILENAME);
}

async function assertText(entry, options) {
	const text = await entry.getText(null, options);
	if (text != TEXT_CONTENT) {
		throw new Error("unexpected content \"" + text + "\"");
	}
}

function createMockWriteDirectory() {
	const files = new Map();
	return {
		files,
		handle: {
			async getFileHandle(name) {
				return {
					async createWritable() {
						const chunks = [];
						return new WritableStream({
							write(chunk) {
								chunks.push(new Uint8Array(chunk));
							},
							close() {
								files.set(name, concatChunks(chunks));
							}
						});
					}
				};
			}
		}
	};
}

function concatChunks(chunks) {
	let length = 0;
	for (const chunk of chunks) {
		length += chunk.length;
	}
	const result = new Uint8Array(length);
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}
	return result;
}
