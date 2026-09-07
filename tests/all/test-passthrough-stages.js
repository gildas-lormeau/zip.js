// `passThrough` controls two codec stages, and the pipeline runs them in a fixed order: deflate then
// encrypt on the way in, decrypt then inflate on the way out. `passThrough: "compressed"` skips the
// inner stage only, so the caller deals in compressed but not encrypted bytes. That makes three things
// possible which the boolean cannot express: encrypting an entry without recompressing it, changing the
// password of an entry without recompressing it, and comparing the content of two encrypted entries,
// which never matches through ciphertext because the salt is drawn per entry.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.".repeat(8);
const FILENAME = "lorem.txt";
const PASSWORD = "password";
const NEW_PASSWORD = "new-password";
const ZIP_CRYPTO_OVERHEAD = 12;
const AES_OVERHEAD = [20, 24, 28];

export { test };

async function test() {
	try {
		await encryptsWithoutRecompressing();
		await decryptsWithoutInflating();
		await rekeysAcrossEncryptionSchemes();
		await comparesContentAcrossPasswords();
		await keepsRejectingWhatItRejectedBefore();
		await rejectsUnknownValues();
	} finally {
		await zip.terminateWorkers();
	}
}

// The write side: the input is already deflated, so only the encryption stage runs. The caller supplies
// the CRC, since it cannot be computed from deflated input, but the writer drops it and marks the entry
// AE-2: the encryption stage running makes this a new encryption, and the content it protects was not
// encrypted before, so storing its plaintext checksum would publish what the encryption is hiding. Only
// a verbatim copy, `passThrough: true`, may declare AE-1, and only because the source archive declared it.
async function encryptsWithoutRecompressing() {
	const source = await readSourceEntry(await buildArchive({}));
	const archive = await buildArchive({}, {
		passThrough: "compressed",
		password: PASSWORD,
		compressionMethod: source.compressionMethod,
		uncompressedSize: source.uncompressedSize,
		crc32: source.crc32
	}, source.data);
	const entry = await readSourceEntry(archive, { password: PASSWORD });
	if (!entry.encrypted) {
		throw new Error("expected the entry to be encrypted");
	}
	if (entry.compressionMethod != source.compressionMethod) {
		throw new Error("expected the compression method to be preserved");
	}
	if (entry.compressedSize != source.compressedSize + AES_OVERHEAD[2]) {
		throw new Error("expected " + (source.compressedSize + AES_OVERHEAD[2]) + " compressed bytes, got " + entry.compressedSize);
	}
	if (entry.crc32 !== undefined) {
		throw new Error("expected the CRC32 to be dropped, got " + entry.crc32);
	}
	if (!entry.extraFieldAES || entry.extraFieldAES.vendorVersion != 2) {
		throw new Error("expected an AE-2 entry, since encrypting pass-through content is a new encryption");
	}
	const text = await entry.getData(new zip.TextWriter(), { password: PASSWORD, checkCrc32: true });
	if (text != TEXT_CONTENT) {
		throw new Error("expected the encrypted entry to read back");
	}
}

// The read side, for the four encryption schemes zip.js writes. The decrypted stream must be exactly the
// stored bytes minus the encryption envelope, and it must be byte for byte the deflate stream of the
// same content written without a password.
async function decryptsWithoutInflating() {
	const plain = await readSourceEntry(await buildArchive({}));
	const cases = [
		["ZipCrypto", { password: PASSWORD, zipCrypto: true }, ZIP_CRYPTO_OVERHEAD],
		["AES-128", { password: PASSWORD, encryptionStrength: 1 }, AES_OVERHEAD[0]],
		["AES-192", { password: PASSWORD, encryptionStrength: 2 }, AES_OVERHEAD[1]],
		["AES-256", { password: PASSWORD, encryptionStrength: 3 }, AES_OVERHEAD[2]]
	];
	for (const [label, writerOptions, overhead] of cases) {
		const entry = await readSourceEntry(await buildArchive(writerOptions), {
			password: PASSWORD,
			checkAuthenticationCode: true
		});
		if (entry.compressedSize != plain.compressedSize + overhead) {
			throw new Error(label + ": expected an envelope of " + overhead + " bytes, got " + (entry.compressedSize - plain.compressedSize));
		}
		if (entry.data.length != plain.compressedSize) {
			throw new Error(label + ": expected " + plain.compressedSize + " decrypted bytes, got " + entry.data.length);
		}
		assertSameBytes(entry.data, plain.data, label + ": the decrypted stream differs from the plain deflate stream");
	}
}

// Reading with "compressed" and writing it back with "compressed" changes the password without ever
// inflating the content. The CRC32 survives whenever the source published one, which is every scheme but
// AE-2, where zip.js stores no plaintext CRC32 by design.
async function rekeysAcrossEncryptionSchemes() {
	const schemes = [
		["plain", {}, undefined],
		["ZipCrypto", { password: PASSWORD, zipCrypto: true }, PASSWORD],
		["AES-128", { password: PASSWORD, encryptionStrength: 1 }, PASSWORD],
		["AES-256", { password: PASSWORD }, PASSWORD],
		["AES-256 stored", { password: PASSWORD, level: 0 }, PASSWORD]
	];
	const targets = [
		["plain", {}, {}],
		["ZipCrypto", { password: NEW_PASSWORD, zipCrypto: true }, { password: NEW_PASSWORD }],
		["AES-256", { password: NEW_PASSWORD }, { password: NEW_PASSWORD }]
	];
	for (const [sourceLabel, writerOptions, password] of schemes) {
		const source = await readSourceEntry(await buildArchive(writerOptions), { password });
		for (const [targetLabel, targetOptions, readOptions] of targets) {
			const label = sourceLabel + " -> " + targetLabel;
			const archive = await buildArchive({}, Object.assign({
				passThrough: "compressed",
				compressionMethod: source.compressionMethod,
				uncompressedSize: source.uncompressedSize,
				crc32: source.crc32
			}, targetOptions), source.data);
			const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(archive));
			const [entry] = await zipReader.getEntries();
			const text = await entry.getData(new zip.TextWriter(),
				Object.assign({ checkCrc32: source.crc32 !== undefined }, readOptions));
			await zipReader.close();
			if (text != TEXT_CONTENT) {
				throw new Error(label + ": the content did not survive the rekey");
			}
			if (source.crc32 !== undefined) {
				const expectedCrc32 = targetOptions.password && !targetOptions.zipCrypto ? undefined : source.crc32;
				if (entry.crc32 !== expectedCrc32) {
					throw new Error(label + ": expected the CRC32 " + expectedCrc32 + ", got " + entry.crc32);
				}
			}
		}
	}
}

// Two entries holding the same content encrypted with two different passwords never match through their
// stored bytes, because the salt is drawn per entry. Decrypting without inflating makes them comparable.
async function comparesContentAcrossPasswords() {
	const first = await readSourceEntry(await buildArchive({ password: PASSWORD }), { password: PASSWORD });
	const second = await readSourceEntry(await buildArchive({ password: NEW_PASSWORD }), { password: NEW_PASSWORD });
	assertSameBytes(first.data, second.data, "expected the same content to decrypt to the same deflate stream");
	const stored = await readSourceEntry(await buildArchive({ password: PASSWORD }), { passThrough: true });
	const otherStored = await readSourceEntry(await buildArchive({ password: NEW_PASSWORD }), { passThrough: true });
	if (stored.data.length == otherStored.data.length && stored.data.every((value, index) => value == otherStored.data[index])) {
		throw new Error("expected the stored bytes to differ, the salt is drawn per entry");
	}
}

// The rules the boolean already enforced still apply to the stage that is passed through: a password is
// still refused when both stages are passed through, and the sizes are still the caller's to declare.
async function keepsRejectingWhatItRejectedBefore() {
	const source = await readSourceEntry(await buildArchive({}));
	const common = {
		compressionMethod: source.compressionMethod,
		uncompressedSize: source.uncompressedSize,
		crc32: source.crc32
	};
	await assertThrows(Object.assign({ passThrough: true, password: PASSWORD }, common), source.data,
		zip.ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH, "a password with both stages passed through");
	await assertThrows({ passThrough: "compressed", password: PASSWORD, compressionMethod: source.compressionMethod, crc32: source.crc32 },
		source.data, zip.ERR_UNDEFINED_UNCOMPRESSED_SIZE, "a missing uncompressed size");
	await assertThrows({ passThrough: "compressed", password: PASSWORD, uncompressedSize: source.uncompressedSize, crc32: source.crc32 },
		source.data, zip.ERR_UNDEFINED_COMPRESSION_METHOD, "a missing compression method");
	const encrypted = await buildArchive({ password: PASSWORD });
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(encrypted));
	const [entry] = await zipReader.getEntries();
	let thrownError;
	try {
		await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: "compressed", password: NEW_PASSWORD });
	} catch (error) {
		thrownError = error;
	}
	await zipReader.close();
	assertMessage(thrownError, zip.ERR_INVALID_PASSWORD, "a wrong password on a decrypt-only read");
}

// An unknown value must be refused rather than read as a truthy boolean, which would silently pass both
// stages through. The filesystem API copies entries verbatim, so it refuses the value instead of taking
// it and producing an archive whose entries are marked encrypted over decrypted bytes.
async function rejectsUnknownValues() {
	const source = await readSourceEntry(await buildArchive({}));
	for (const value of ["compress", "raw", 1, {}]) {
		await assertThrows({
			passThrough: value,
			compressionMethod: source.compressionMethod,
			uncompressedSize: source.uncompressedSize,
			crc32: source.crc32
		}, source.data, zip.ERR_INVALID_PASS_THROUGH_VALUE, "the value " + JSON.stringify(value));
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await buildArchive({})));
		const [entry] = await zipReader.getEntries();
		let thrownError;
		try {
			await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: value });
		} catch (error) {
			thrownError = error;
		}
		await zipReader.close();
		assertMessage(thrownError, zip.ERR_INVALID_PASS_THROUGH_VALUE, "reading with the value " + JSON.stringify(value));
	}
	const zipFs = new zip.ZipFS();
	zipFs.addText(FILENAME, TEXT_CONTENT);
	const exported = await zipFs.exportUint8Array();
	for (const run of [
		() => new zip.ZipFS().importUint8Array(exported, { passThrough: "compressed" }),
		() => zipFs.exportUint8Array({ readerOptions: { passThrough: "compressed" } })
	]) {
		let thrownError;
		try {
			await run();
		} catch (error) {
			thrownError = error;
		}
		assertMessage(thrownError, zip.ERR_UNSUPPORTED_PASS_THROUGH_VALUE, "the filesystem API");
	}
}

async function buildArchive(writerOptions, entryOptions, data) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), writerOptions);
	const reader = data ? new zip.Uint8ArrayReader(data) : new zip.TextReader(TEXT_CONTENT);
	await zipWriter.add(FILENAME, reader, entryOptions);
	return await zipWriter.close();
}

async function readSourceEntry(archive, readerOptions = {}) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(archive));
	const [entry] = await zipReader.getEntries();
	const data = await entry.getData(new zip.Uint8ArrayWriter(),
		Object.assign({ passThrough: "compressed" }, readerOptions));
	await zipReader.close();
	return {
		data,
		crc32: entry.crc32,
		compressedSize: entry.compressedSize,
		uncompressedSize: entry.uncompressedSize,
		compressionMethod: entry.compressionMethod,
		encrypted: entry.encrypted,
		extraFieldAES: entry.extraFieldAES,
		getData: (writer, options) => entry.getData(writer, options)
	};
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

async function assertThrows(entryOptions, data, expectedMessage, description) {
	let thrownError;
	try {
		await buildArchive({}, entryOptions, data);
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
