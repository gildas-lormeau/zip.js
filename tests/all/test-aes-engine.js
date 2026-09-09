/* global crypto, TextEncoder */

// The AES engine behind AESEncryptionStream/AESDecryptionStream: AES-CTR with the WinZip counter,
// HMAC-SHA1 and PBKDF2-HMAC-SHA1. Pinned by the RFC vectors, cross-checked against Web Crypto where it
// exists, then driven through the library with sizes around every block and chunk boundary.

import * as zip from "../zip-lib.js";
import { createEngine, pbkdf2 } from "../../lib/core/streams/codecs/aes-hmac-sha1.js";

const KEY_LENGTHS = [16, 24, 32];
const ENTRY_SIZES = [0, 1, 15, 16, 17, 31, 32, 33, 65535, 65536, 65537, 200007];
const PASSWORD = "password";
const encoder = new TextEncoder();

export { test };

async function test() {
	await checkHmacVectors();
	await checkPbkdf2Vectors();
	await checkAgainstWebCrypto();
	await checkRoundTrips();
	await checkWebCryptoFallback();
	await zip.terminateWorkers();
}

// RFC 2202 cases 1, 2, 3 and 7; case 7 exercises a key longer than the SHA-1 block
async function checkHmacVectors() {
	const vectors = [
		[new Uint8Array(20).fill(0x0b), encoder.encode("Hi There"), "b617318655057264e28bc0b6fb378c8ef146be00"],
		[encoder.encode("Jefe"), encoder.encode("what do ya want for nothing?"), "effcdf6ae5eb2fa2d27416d5f184df9c259a7c79"],
		[new Uint8Array(20).fill(0xaa), new Uint8Array(50).fill(0xdd), "125d7342b9ac11cd91a39af48aa17b4f63f175d3"],
		[new Uint8Array(80).fill(0xaa), encoder.encode("Test Using Larger Than Block-Size Key - Hash Key First"), "aa4ae5e15272d00e95705637ce8a3b55ed402112"]
	];
	for (const [key, data, expected] of vectors) {
		if (hex(hmac(key, data)) != expected) {
			throw new Error("HMAC-SHA1 vector failed for key length " + key.length);
		}
	}
}

// RFC 6070 cases 1 to 4
async function checkPbkdf2Vectors() {
	const vectors = [
		["password", "salt", 1, 20, "0c60c80f961f0e71f3a9b524af6012062fe037a6"],
		["password", "salt", 2, 20, "ea6c014dc72d6f8ccd1ed92ace1d41f0d8de8957"],
		["password", "salt", 4096, 20, "4b007901b765489abead49d926f721d065a429c1"],
		["passwordPASSWORDpassword", "saltSALTsaltSALTsaltSALTsaltSALTsalt", 4096, 25, "3d2eec4fe41c849b80c8d83662c0e44a8b291a964cf2f07038"]
	];
	for (const [password, salt, iterations, length, expected] of vectors) {
		if (hex(pbkdf2(encoder.encode(password), encoder.encode(salt), iterations, length)) != expected) {
			throw new Error("PBKDF2 vector failed for " + iterations + " iterations");
		}
	}
}

// the block cipher, the MAC over uneven chunks and the key derivation against the platform's own
async function checkAgainstWebCrypto() {
	const subtle = typeof crypto != "undefined" && crypto.subtle;
	if (!subtle) {
		return;
	}
	for (const keyLength of KEY_LENGTHS) {
		const key = pattern(keyLength, 3);
		const counterBlock = new Uint8Array(16);
		counterBlock[0] = 1;
		let expected;
		try {
			const cbcKey = await subtle.importKey("raw", key, "AES-CBC", false, ["encrypt"]);
			expected = new Uint8Array(await subtle.encrypt({ name: "AES-CBC", iv: new Uint8Array(16) }, cbcKey, counterBlock)).subarray(0, 16);
		} catch {
			// Chrome implements no 192-bit AES in Web Crypto; the round trips below still cover that size
			continue;
		}
		const keystream = new Uint8Array(16);
		createEngine(key, key).process(keystream, false);
		if (!sameBytes(keystream, expected)) {
			throw new Error("the first keystream block must be the block cipher of counter 1 for AES-" + keyLength * 8);
		}
	}
	const data = pattern(100003, 5);
	const authenticationKey = pattern(32, 7);
	const engine = createEngine(pattern(32, 9), authenticationKey);
	const copy = data.slice();
	engine.process(copy.subarray(0, 65535), true);
	engine.process(copy.subarray(65535, 65535 + 17), true);
	engine.process(copy.subarray(65535 + 17), true);
	const hmacKey = await subtle.importKey("raw", authenticationKey, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
	if (!sameBytes(engine.digest(), new Uint8Array(await subtle.sign("HMAC", hmacKey, data)))) {
		throw new Error("the authentication code must not depend on how the data was chunked");
	}
	const password = encoder.encode(PASSWORD);
	const salt = pattern(16, 11);
	const baseKey = await subtle.importKey("raw", password, "PBKDF2", false, ["deriveBits"]);
	const derived = new Uint8Array(await subtle.deriveBits({ name: "PBKDF2", salt, iterations: 1000, hash: "SHA-1" }, baseKey, 66 * 8));
	if (!sameBytes(pbkdf2(password, salt, 1000, 66), derived)) {
		throw new Error("the JavaScript PBKDF2 must derive the same key as Web Crypto");
	}
}

async function checkRoundTrips() {
	for (const encryptionStrength of [1, 2, 3]) {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		let index = 0;
		for (const size of ENTRY_SIZES) {
			await zipWriter.add("entry-" + size + (index % 2 ? ".bin" : ".txt"), new zip.Uint8ArrayReader(pattern(size, index)),
				{ password: PASSWORD, encryptionStrength, level: index % 2 ? 0 : undefined });
			index++;
		}
		await checkEntries(await zipWriter.close(), {});
	}
}

// the module keeps using Web Crypto until a call fails, then derives keys in JavaScript for good. An
// archive written before the switch must read after it, which proves the two derivations agree, and
// the test runs in-thread so the switch happens in this module instance and not in a worker.
async function checkWebCryptoFallback() {
	const subtle = typeof crypto != "undefined" && crypto.subtle;
	if (!subtle) {
		return;
	}
	const options = { useWebWorkers: false };
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), options);
	await zipWriter.add("entry-200007.txt", new zip.Uint8ArrayReader(pattern(200007, 0)), { password: PASSWORD });
	const data = await zipWriter.close();
	const importKey = subtle.importKey;
	try {
		subtle.importKey = () => {
			throw new Error("Web Crypto unavailable");
		};
	} catch {
		return;
	}
	try {
		await checkEntries(data, options, [200007]);
		const fallbackWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), options);
		await fallbackWriter.add("entry-65537.txt", new zip.Uint8ArrayReader(pattern(65537, 0)), { password: PASSWORD });
		await checkEntries(await fallbackWriter.close(), options, [65537]);
	} finally {
		subtle.importKey = importKey;
	}
}

async function checkEntries(data, options, sizes = ENTRY_SIZES) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), Object.assign({ password: PASSWORD, checkCrc32: true }, options));
	const entries = await zipReader.getEntries();
	if (entries.length != sizes.length) {
		throw new Error("expected " + sizes.length + " entries, got " + entries.length);
	}
	for (let index = 0; index < entries.length; index++) {
		const content = await entries[index].getData(new zip.Uint8ArrayWriter());
		if (!sameBytes(content, pattern(sizes[index], index))) {
			throw new Error("entry " + entries[index].filename + " did not decrypt to its content");
		}
	}
	await zipReader.close();
}

function hmac(key, data) {
	const engine = createEngine(new Uint8Array(16), key);
	engine.process(data.slice(), true);
	return engine.digest();
}

function pattern(size, seed) {
	return new Uint8Array(size).map((_, index) => (index * 131 + seed * 17 + (index >> 8)) & 0xff);
}

function sameBytes(first, second) {
	return first.length == second.length && first.every((value, index) => value == second[index]);
}

function hex(bytes) {
	return Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
}
