/* global setTimeout, clearTimeout, Blob */

// Locks the password candidates of the filesystem API: the `passwords` list and the `requestPassword`
// function, through the import options, the `readerOptions` of an export and the options of `get*()`.
// The fixture holds two AES entries under different passwords, a ZipCrypto entry and a plain entry, so a
// candidate accepted by one entry is tried first on the next one and rejected there. The ZipCrypto entry
// also serves the false accept case: its one-byte check accepts one wrong password in 256, found by
// brute force on the encryption header with the key schedule below rather than with the library, since an
// aborted probe read leaks its WebAssembly buffers on the engines without the `cancel` transformer hook,
// and that password must be demoted by the read that follows. Only the errors a false accept produces
// demote a candidate: a stored ZipCrypto entry read through a reader failing the chunk reads starting
// inside the entry body checks that another failure of the read is reported as-is, its first chunks
// left readable so that the probe of the password passes and the end of central directory scan, which
// reads across the whole file, unaffected. The final ERR_INVALID_PASSWORD error carries the error
// raised by the last candidate as its cause. The ZipCrypto header is random, so the fixture is
// regenerated until none of the wrong candidates tried on that entry passes its one-byte check by
// chance (2 in 256 per run otherwise), which would turn the ERR_INVALID_PASSWORD the hook expects
// into the error of the read that follows the false accept.

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
const STORED_ENTRY = { name: "zipcrypto-stored.txt", password: "gamma", zipCrypto: true, level: 0, content: TEXT_CONTENT.repeat(2) };
const READER_ERROR_MESSAGE = "simulated reader failure";
const READABLE_BODY_LENGTH = 1024;
const FALSE_ACCEPT_ERRORS = [zip.ERR_INVALID_CRC32, zip.ERR_INVALID_COMPRESSED_DATA, zip.ERR_INVALID_UNCOMPRESSED_SIZE];
const EXPORT_PASSWORD = "export";
const MAX_FALSE_ACCEPT_ATTEMPTS = 8192;
const MAX_FIXTURE_ATTEMPTS = 64;
const ZIPCRYPTO_ENTRY_NAME = "zipcrypto-gamma.txt";
const WRONG_CANDIDATES = ["wrong", "alpha", "beta"];
const ZIPCRYPTO_HEADER_LENGTH = 12;
const CRC32_TABLE = createCrc32Table();
const TIMEOUT = 20000;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const source = await createSourceWithoutFalseAccept(ENTRIES, ZIPCRYPTO_ENTRY_NAME, WRONG_CANDIDATES);
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
	await testReaderFailureKeepsItsError();
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
	const error = await assertRejects(() => entry.getText(undefined, { passwords: ["wrong", "beta"] }), zip.ERR_INVALID_PASSWORD, "read with wrong passwords");
	assertCause(error, [zip.ERR_INVALID_PASSWORD], "read with wrong passwords");
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
	const error = await assertRejects(() => entry.getText(undefined, { passwords: ["wrong"] }), zip.ERR_INVALID_PASSWORD, "give up after a wrong candidate");
	assertCause(error, [zip.ERR_INVALID_PASSWORD], "give up after a wrong candidate");
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
	const { header, verificationByte } = await readZipCryptoHeader(source, "zipcrypto-gamma.txt");
	let falseAccept, rejected;
	for (let attempt = 0; attempt < MAX_FALSE_ACCEPT_ATTEMPTS && !(falseAccept && rejected); attempt++) {
		const candidate = "wrong" + attempt;
		if (getZipCryptoCheckByte(header, candidate) == verificationByte) {
			falseAccept = falseAccept || candidate;
		} else {
			rejected = rejected || candidate;
		}
	}
	if (!falseAccept) {
		throw new Error("no wrong password accepted by the ZipCrypto check in " + MAX_FALSE_ACCEPT_ATTEMPTS + " attempts");
	}
	const fs = await importSource(source, {});
	const entry = fs.find("zipcrypto-gamma.txt");
	if (!await entry.checkPassword(falseAccept) || await entry.checkPassword(rejected)) {
		throw new Error("the ZipCrypto check of the test disagrees with the library");
	}
	const text = await entry.getText(undefined, { passwords: [falseAccept, "gamma"] });
	if (text != TEXT_CONTENT + "zipcrypto-gamma.txt") {
		throw new Error("unexpected content after a false accept");
	}
	const otherFs = await importSource(source, {});
	const error = await assertRejects(() => otherFs.find("zipcrypto-gamma.txt").getText(undefined, { passwords: [falseAccept] }), zip.ERR_INVALID_PASSWORD, "false accept alone");
	assertCause(error, FALSE_ACCEPT_ERRORS, "false accept alone");
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

async function testReaderFailureKeepsItsError() {
	const source = await createSource([STORED_ENTRY]);
	const array = new Uint8Array(await source.arrayBuffer());
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(array));
	const [entry] = await zipReader.getEntries();
	await zipReader.close();
	const bodyOffset = entry.offset + ZIPCRYPTO_HEADER_LENGTH + READABLE_BODY_LENGTH;
	const reader = new FailingReader(array, bodyOffset, bodyOffset + READABLE_BODY_LENGTH);
	const fs = new zip.ZipFS();
	await fs.importZip(reader);
	const fileEntry = fs.find(STORED_ENTRY.name);
	let probePassed;
	try {
		probePassed = await fileEntry.checkPassword(STORED_ENTRY.password);
	} catch (error) {
		throw new Error("the probe of the password reads into the failing range of the test reader", { cause: error });
	}
	if (!probePassed) {
		throw new Error("the probe of the password rejected the right password");
	}
	await assertRejects(() => fileEntry.getText(undefined, { passwords: ["wrong", STORED_ENTRY.password] }), READER_ERROR_MESSAGE, "reader failure with the password among the candidates");
	let promptedWith;
	await assertRejects(() => fileEntry.getText(undefined, {
		requestPassword(entry, error) {
			promptedWith = error && error.message;
			return STORED_ENTRY.password;
		}
	}), READER_ERROR_MESSAGE, "reader failure with the password given by requestPassword");
	if (promptedWith !== undefined) {
		throw new Error("requestPassword called again after a reader failure, with " + promptedWith);
	}
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

async function readZipCryptoHeader(source, filename) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(source));
	const entries = await zipReader.getEntries();
	const entry = entries.find(entry => entry.filename == filename);
	const data = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	await zipReader.close();
	const verificationByte = entry.bitFlag.dataDescriptor ? (entry.rawLastModDate >>> 8) & 0xff : (entry.crc32 >>> 24) & 0xff;
	return { header: data.slice(0, ZIPCRYPTO_HEADER_LENGTH), verificationByte };
}

function getZipCryptoCheckByte(header, password) {
	const keys = [0x12345678, 0x23456789, 0x34567890];
	for (let index = 0; index < password.length; index++) {
		updateZipCryptoKeys(keys, password.charCodeAt(index));
	}
	let byte;
	for (let index = 0; index < header.length; index++) {
		const temp = (keys[2] | 2) >>> 0;
		byte = header[index] ^ ((Math.imul(temp, temp ^ 1) >>> 8) & 0xff);
		updateZipCryptoKeys(keys, byte);
	}
	return byte;
}

function updateZipCryptoKeys(keys, byte) {
	keys[0] = updateCrc32(keys[0], byte);
	keys[1] = (Math.imul((keys[1] + (keys[0] & 0xff)) >>> 0, 134775813) + 1) >>> 0;
	keys[2] = updateCrc32(keys[2], keys[1] >>> 24);
}

function updateCrc32(crc, byte) {
	return (CRC32_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)) >>> 0;
}

function createCrc32Table() {
	const table = new Uint32Array(256);
	for (let index = 0; index < 256; index++) {
		let value = index;
		for (let bit = 0; bit < 8; bit++) {
			value = value & 1 ? 0xEDB88320 ^ (value >>> 1) : value >>> 1;
		}
		table[index] = value >>> 0;
	}
	return table;
}

async function createSourceWithoutFalseAccept(entries, filename, candidates) {
	for (let attempt = 0; attempt < MAX_FIXTURE_ATTEMPTS; attempt++) {
		const source = await createSource(entries);
		const { header, verificationByte } = await readZipCryptoHeader(source, filename);
		if (candidates.every(candidate => getZipCryptoCheckByte(header, candidate) != verificationByte)) {
			return source;
		}
	}
	throw new Error("no fixture without a false accept of a wrong candidate in " + MAX_FIXTURE_ATTEMPTS + " attempts");
}

async function createSource(entries) {
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
	for (const { name, password, zipCrypto, level, content = TEXT_CONTENT + name } of entries) {
		await zipWriter.add(name, new zip.TextReader(content), { password, zipCrypto, level });
	}
	return zipWriter.close();
}

class FailingReader extends zip.Reader {
	constructor(array, failureStart, failureEnd) {
		super();
		this.array = array;
		this.size = array.length;
		this.failureStart = failureStart;
		this.failureEnd = failureEnd;
	}

	async readUint8Array(index, length) {
		if (index >= this.failureStart && index < this.failureEnd) {
			throw new Error(READER_ERROR_MESSAGE);
		}
		return this.array.slice(index, index + length);
	}
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
			return error;
		}
		throw new Error(description + " rejected with " + error.message + " instead of " + message, { cause: error });
	}
	throw new Error(description + " did not reject");
}

function assertCause(error, messages, description) {
	const { cause } = error;
	if (!cause || typeof cause != "object" || !messages.includes(cause.message)) {
		throw new Error(description + ": the error does not carry the error raised by the last candidate as its cause, got " + (cause && cause.message));
	}
}

function withTimeout(promise, description) {
	let timeout;
	return Promise.race([
		promise,
		new Promise((_, reject) => timeout = setTimeout(() => reject(new Error("timeout: " + description)), TIMEOUT))
	]).finally(() => clearTimeout(timeout));
}
