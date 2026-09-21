/* global setTimeout, clearTimeout, Blob */

// Locks the password candidates of the filesystem API: the `passwords` list and the `requestPassword`
// function, through the import options, the `readerOptions` of an export and the options of `get*()`.
// The fixture holds two AES entries under different passwords, a ZipCrypto entry and a plain entry, so a
// candidate accepted by one entry is tried first on the next one and rejected there. The ZipCrypto entry
// also serves the false accept case: its one-byte check accepts one wrong password in 256, found by
// brute force, and that password must be demoted by the read that follows.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(40);
const ENTRIES = [
	{ name: "aes-alpha.txt", password: "alpha" },
	{ name: "aes-beta.txt", password: "beta" },
	{ name: "zipcrypto-gamma.txt", password: "gamma", zipCrypto: true },
	{ name: "plain.txt" }
];
const SHARED_ENTRIES = [
	{ name: "a.txt", password: "shared" },
	{ name: "b.txt", password: "shared" },
	{ name: "c.txt", password: "shared" }
];
const PASSWORDS = ["wrong", "alpha", "beta", "gamma"];
const EXPORT_PASSWORD = "export";
const MAX_FALSE_ACCEPT_ATTEMPTS = 8192;
const TIMEOUT = 20000;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const source = await createSource(ENTRIES);
	const sharedSource = await createSource(SHARED_ENTRIES);
	await testPasswordsAtImport(source);
	await testPasswordsOnRead(source);
	await testPasswordsOnExport(source);
	await testRequestPassword(source);
	await testRequestPasswordGivesUp(source);
	await testRequestPasswordOnExport(source);
	await testSharedPasswordAskedOnce(sharedSource);
	await testFalseAcceptedZipCryptoPassword(source);
	await testCorruptedEntryKeepsItsError(source);
	await testInvalidOptions(source);
	await zip.terminateWorkers();
}

async function testPasswordsAtImport(source) {
	const fs = await importSource(source, { passwords: PASSWORDS });
	await checkContent(fs, {});
	const fsWithPassword = await importSource(source, { password: "wrong", passwords: PASSWORDS });
	await checkContent(fsWithPassword, {});
}

async function testPasswordsOnRead(source) {
	const fs = await importSource(source, {});
	const entry = fs.find("aes-alpha.txt");
	await assertRejects(() => entry.getText(), zip.ERR_ENCRYPTED, "read without password");
	await assertRejects(() => entry.getText(undefined, { passwords: ["wrong", "beta"] }), zip.ERR_INVALID_PASSWORD, "read with wrong passwords");
	await assertRejects(() => entry.getText(undefined, { passwords: [] }), zip.ERR_ENCRYPTED, "read with no candidate");
	await checkContent(fs, { passwords: PASSWORDS });
	const text = await entry.getText(undefined, { passwords: ["wrong"] });
	if (text != TEXT_CONTENT + "aes-alpha.txt") {
		throw new Error("the password accepted by a previous read was not tried first");
	}
	await assertRejects(() => fs.find("aes-beta.txt").getText(undefined, { password: "wrong" }), zip.ERR_INVALID_PASSWORD, "read with a wrong password only");
}

async function testPasswordsOnExport(source) {
	const fs = await importSource(source, {});
	const exported = await withTimeout(fs.exportBlob({ password: EXPORT_PASSWORD, readerOptions: { passwords: PASSWORDS } }), "export with passwords");
	await checkContent(await importSource(exported, { password: EXPORT_PASSWORD }), {});
}

async function testRequestPassword(source) {
	const calls = [];
	const answers = { "aes-alpha.txt": ["wrong", "alpha"], "aes-beta.txt": ["beta"], "zipcrypto-gamma.txt": ["gamma"] };
	const fs = await importSource(source, {
		requestPassword(entry, error) {
			calls.push({ filename: entry.filename, message: error && error.message });
			return answers[entry.filename].shift();
		}
	});
	await checkContent(fs, {});
	const expectedCalls = [
		{ filename: "aes-alpha.txt", message: undefined },
		{ filename: "aes-alpha.txt", message: zip.ERR_INVALID_PASSWORD },
		{ filename: "aes-beta.txt", message: zip.ERR_INVALID_PASSWORD },
		{ filename: "zipcrypto-gamma.txt", message: zip.ERR_INVALID_PASSWORD }
	];
	if (JSON.stringify(calls) != JSON.stringify(expectedCalls)) {
		throw new Error("unexpected requestPassword calls " + JSON.stringify(calls));
	}
	await checkContent(fs, {});
	if (calls.length != expectedCalls.length) {
		throw new Error("requestPassword called again for known passwords");
	}
}

async function testRequestPasswordGivesUp(source) {
	const fs = await importSource(source, { requestPassword: () => undefined });
	const entry = fs.find("aes-alpha.txt");
	await assertRejects(() => entry.getText(), zip.ERR_ENCRYPTED, "give up without candidate");
	await assertRejects(() => entry.getText(undefined, { passwords: ["wrong"] }), zip.ERR_INVALID_PASSWORD, "give up after a wrong candidate");
	await assertRejects(() => entry.getText(undefined, { requestPassword: () => null }), zip.ERR_ENCRYPTED, "give up with null");
	await assertRejects(() => entry.getText(undefined, { requestPassword: () => 42 }), zip.ERR_INVALID_REQUEST_PASSWORD, "answer of another type");
	const plainEntry = fs.find("plain.txt");
	let called = false;
	await plainEntry.getText(undefined, { requestPassword: () => called = true });
	if (called) {
		throw new Error("requestPassword called for a plain entry");
	}
}

async function testRequestPasswordOnExport(source) {
	const fs = await importSource(source, {});
	const calls = [];
	const passwords = Object.fromEntries(ENTRIES.filter(entry => entry.password).map(entry => [entry.name, entry.password]));
	const exported = await withTimeout(fs.exportBlob({
		password: EXPORT_PASSWORD,
		readerOptions: {
			requestPassword(entry) {
				calls.push(entry.filename);
				return passwords[entry.filename];
			}
		}
	}), "export with requestPassword");
	const expectedCalls = Object.keys(passwords).sort();
	if (JSON.stringify(calls.slice().sort()) != JSON.stringify(expectedCalls)) {
		throw new Error("unexpected requestPassword calls on export " + JSON.stringify(calls));
	}
	await checkContent(await importSource(exported, { password: EXPORT_PASSWORD }), {});
}

async function testSharedPasswordAskedOnce(sharedSource) {
	const fs = await importSource(sharedSource, {});
	let calls = 0;
	const exported = await withTimeout(fs.exportBlob({
		readerOptions: {
			async requestPassword() {
				calls++;
				await new Promise(resolve => setTimeout(resolve, 50));
				return "shared";
			}
		}
	}), "export with a shared password");
	if (calls != 1) {
		throw new Error("requestPassword called " + calls + " times for one shared password");
	}
	const exportedFs = await importSource(exported, {});
	for (const { name } of SHARED_ENTRIES) {
		const text = await exportedFs.find(name).getText();
		if (text != TEXT_CONTENT + name) {
			throw new Error("unexpected content of " + name + " after export");
		}
	}
}

async function testFalseAcceptedZipCryptoPassword(source) {
	const fs = await importSource(source, {});
	const entry = fs.find("zipcrypto-gamma.txt");
	let falseAccept;
	for (let attempt = 0; attempt < MAX_FALSE_ACCEPT_ATTEMPTS && !falseAccept; attempt++) {
		const candidate = "wrong" + attempt;
		if (await entry.checkPassword(candidate)) {
			falseAccept = candidate;
		}
	}
	if (!falseAccept) {
		throw new Error("no wrong password accepted by the ZipCrypto check in " + MAX_FALSE_ACCEPT_ATTEMPTS + " attempts");
	}
	const text = await entry.getText(undefined, { passwords: [falseAccept, "gamma"] });
	if (text != TEXT_CONTENT + "zipcrypto-gamma.txt") {
		throw new Error("unexpected content after a false accept");
	}
	const otherFs = await importSource(source, {});
	await assertRejects(() => otherFs.find("zipcrypto-gamma.txt").getText(undefined, { passwords: [falseAccept] }), zip.ERR_INVALID_PASSWORD, "false accept alone");
	let promptedWith;
	const promptedText = await otherFs.find("zipcrypto-gamma.txt").getText(undefined, {
		passwords: [falseAccept],
		requestPassword(entry, error) {
			promptedWith = error && error.message;
			return "gamma";
		}
	});
	if (promptedText != TEXT_CONTENT + "zipcrypto-gamma.txt" || promptedWith === undefined || promptedWith == zip.ERR_INVALID_PASSWORD) {
		throw new Error("the false accept was not reported to requestPassword as a read failure");
	}
}

async function testCorruptedEntryKeepsItsError(source) {
	const array = new Uint8Array(await source.arrayBuffer());
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array));
	const entries = await zipReader.getEntries();
	const entry = entries.find(entry => entry.filename == "aes-alpha.txt");
	await entry.getData(new zip.Uint8ArrayWriter(), { password: "alpha" });
	await zipReader.close();
	const corruptedArray = array.slice();
	corruptedArray[entry.localDirectory.dataOffset + 40] ^= 0xff;
	const fs = await importSource(new Blob([corruptedArray]), { passwords: ["wrong", "alpha"] });
	try {
		await fs.find("aes-alpha.txt").getText();
	} catch (error) {
		if (error.message == zip.ERR_INVALID_PASSWORD || error.message == zip.ERR_ENCRYPTED) {
			throw new Error("a corrupted AES entry read with the right password reported " + error.message, { cause: error });
		}
		return;
	}
	throw new Error("a corrupted AES entry was read without error");
}

async function testInvalidOptions(source) {
	const fs = await importSource(source, {});
	const plainEntry = fs.find("plain.txt");
	for (const passwords of ["alpha", [1], {}, [["alpha"]]]) {
		const description = "passwords: " + JSON.stringify(passwords);
		await assertRejects(() => importSource(source, { passwords }), zip.ERR_INVALID_PASSWORDS, "import " + description);
		await assertRejects(() => fs.exportBlob({ readerOptions: { passwords } }), zip.ERR_INVALID_PASSWORDS, "export " + description);
		await assertRejects(() => fs.getExportedSize({ readerOptions: { passwords } }), zip.ERR_INVALID_PASSWORDS, "getExportedSize " + description);
		await assertRejects(() => fs.exportFileSystemHandle({}, { passwords }), zip.ERR_INVALID_PASSWORDS, "exportFileSystemHandle " + description);
		await assertRejects(() => plainEntry.getText(undefined, { passwords }), zip.ERR_INVALID_PASSWORDS, "getText " + description);
	}
	for (const requestPassword of ["alpha", 42, {}]) {
		const description = "requestPassword: " + JSON.stringify(requestPassword);
		await assertRejects(() => importSource(source, { requestPassword }), zip.ERR_INVALID_REQUEST_PASSWORD, "import " + description);
		await assertRejects(() => fs.exportBlob({ readerOptions: { requestPassword } }), zip.ERR_INVALID_REQUEST_PASSWORD, "export " + description);
		await assertRejects(() => fs.exportFileSystemHandle({}, { readerOptions: { requestPassword } }), zip.ERR_INVALID_REQUEST_PASSWORD, "exportFileSystemHandle " + description);
		await assertRejects(() => plainEntry.getText(undefined, { requestPassword }), zip.ERR_INVALID_REQUEST_PASSWORD, "getText " + description);
	}
	for (const options of [{ passwords: null }, { passwords: false }, { requestPassword: null }, { requestPassword: 0 }]) {
		await importSource(source, options);
		await plainEntry.getText(undefined, options);
	}
}

async function createSource(entries) {
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
	for (const { name, password, zipCrypto } of entries) {
		await zipWriter.add(name, new zip.TextReader(TEXT_CONTENT + name), { password, zipCrypto });
	}
	return zipWriter.close();
}

async function importSource(source, options) {
	const fs = new zip.ZipFS();
	await fs.importBlob(source, options);
	return fs;
}

async function checkContent(fs, options) {
	for (const { name } of ENTRIES) {
		const text = await fs.find(name).getText(undefined, options);
		if (text != TEXT_CONTENT + name) {
			throw new Error("unexpected content of " + name);
		}
	}
}

async function assertRejects(run, message, description) {
	try {
		await withTimeout(run(), description);
	} catch (error) {
		if (error.message == message) {
			return;
		}
		throw new Error(description + " rejected with " + error.message + " instead of " + message, { cause: error });
	}
	throw new Error(description + " did not reject");
}

function withTimeout(promise, description) {
	let timeout;
	return Promise.race([
		promise,
		new Promise((_, reject) => timeout = setTimeout(() => reject(new Error("timeout: " + description)), TIMEOUT))
	]).finally(() => clearTimeout(timeout));
}
