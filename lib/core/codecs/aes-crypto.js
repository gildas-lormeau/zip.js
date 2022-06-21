/*
 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright 
 notice, this list of conditions and the following disclaimer in 
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* global crypto */
// deno-lint-ignore-file no-this-alias

import encodeText from "./../util/encode-text.js";
import { cipher, codec, misc, mode, random } from "./sjcl.js";

const ERR_INVALID_PASSWORD = "Invalid pasword";
const BLOCK_LENGTH = 16;
const RAW_FORMAT = "raw";
const PBKDF2_ALGORITHM = { name: "PBKDF2" };
const HASH_ALGORITHM = { name: "HMAC" };
const HASH_FUNCTION = "SHA-1";
const BASE_KEY_ALGORITHM = Object.assign({ hash: HASH_ALGORITHM }, PBKDF2_ALGORITHM);
const DERIVED_BITS_ALGORITHM = Object.assign({ iterations: 1000, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);
const DERIVED_BITS_USAGE = ["deriveBits"];
const SALT_LENGTH = [8, 12, 16];
const KEY_LENGTH = [16, 24, 32];
const SIGNATURE_LENGTH = 10;
const COUNTER_DEFAULT_VALUE = [0, 0, 0, 0];
const CRYPTO_API_SUPPORTED = typeof crypto != "undefined";
const SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof crypto.subtle != "undefined";
const codecBytes = codec.bytes;
const Aes = cipher.aes;
const CtrGladman = mode.ctrGladman;
const HmacSha1 = misc.hmacSha1;
class AESDecrypt {

	constructor(password, signed, strength) {
		Object.assign(this, {
			password,
			signed,
			strength: strength - 1,
			pendingInput: new Uint8Array(0)
		});
	}

	async append(input) {
		const aesCrypto = this;
		if (aesCrypto.password) {
			const preamble = subarray(input, 0, SALT_LENGTH[aesCrypto.strength] + 2);
			await createDecryptionKeys(aesCrypto, preamble, aesCrypto.password);
			aesCrypto.password = null;
			aesCrypto.aesCtrGladman = new CtrGladman(new Aes(aesCrypto.keys.key), Array.from(COUNTER_DEFAULT_VALUE));
			aesCrypto.hmac = new HmacSha1(aesCrypto.keys.authentication);
			input = subarray(input, SALT_LENGTH[aesCrypto.strength] + 2);
		}
		const output = new Uint8Array(input.length - SIGNATURE_LENGTH - ((input.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
		return append(aesCrypto, input, output, 0, SIGNATURE_LENGTH, true);
	}

	flush() {
		const aesCrypto = this;
		const pendingInput = aesCrypto.pendingInput;
		const chunkToDecrypt = subarray(pendingInput, 0, pendingInput.length - SIGNATURE_LENGTH);
		const originalSignature = subarray(pendingInput, pendingInput.length - SIGNATURE_LENGTH);
		let decryptedChunkArray = new Uint8Array(0);
		if (chunkToDecrypt.length) {
			const encryptedChunk = codecBytes.toBits(chunkToDecrypt);
			aesCrypto.hmac.update(encryptedChunk);
			const decryptedChunk = aesCrypto.aesCtrGladman.update(encryptedChunk);
			decryptedChunkArray = codecBytes.fromBits(decryptedChunk);
		}
		let valid = true;
		if (aesCrypto.signed) {
			const signature = subarray(codecBytes.fromBits(aesCrypto.hmac.digest()), 0, SIGNATURE_LENGTH);
			for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) {
				if (signature[indexSignature] != originalSignature[indexSignature]) {
					valid = false;
				}
			}
		}
		return {
			valid,
			data: decryptedChunkArray
		};
	}
}

class AESEncrypt {

	constructor(password, strength) {
		Object.assign(this, {
			password,
			strength: strength - 1,
			pendingInput: new Uint8Array(0)
		});
	}

	async append(input) {
		const aesCrypto = this;
		let preamble = new Uint8Array(0);
		if (aesCrypto.password) {
			preamble = await createEncryptionKeys(aesCrypto, aesCrypto.password);
			aesCrypto.password = null;
			aesCrypto.aesCtrGladman = new CtrGladman(new Aes(aesCrypto.keys.key), Array.from(COUNTER_DEFAULT_VALUE));
			aesCrypto.hmac = new HmacSha1(aesCrypto.keys.authentication);
		}
		const output = new Uint8Array(preamble.length + input.length - (input.length % BLOCK_LENGTH));
		output.set(preamble, 0);
		return append(aesCrypto, input, output, preamble.length, 0);
	}

	flush() {
		const aesCrypto = this;
		let encryptedChunkArray = new Uint8Array(0);
		if (aesCrypto.pendingInput.length) {
			const encryptedChunk = aesCrypto.aesCtrGladman.update(codecBytes.toBits(aesCrypto.pendingInput));
			aesCrypto.hmac.update(encryptedChunk);
			encryptedChunkArray = codecBytes.fromBits(encryptedChunk);
		}
		const signature = subarray(codecBytes.fromBits(aesCrypto.hmac.digest()), 0, SIGNATURE_LENGTH);
		return {
			data: concat(encryptedChunkArray, signature),
			signature
		};
	}
}

export {
	AESDecrypt,
	AESEncrypt,
	ERR_INVALID_PASSWORD
};

function append(aesCrypto, input, output, paddingStart, paddingEnd, verifySignature) {
	const inputLength = input.length - paddingEnd;
	if (aesCrypto.pendingInput.length) {
		input = concat(aesCrypto.pendingInput, input);
		output = expand(output, inputLength - (inputLength % BLOCK_LENGTH));
	}
	let offset;
	for (offset = 0; offset <= inputLength - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
		const inputChunk = codecBytes.toBits(subarray(input, offset, offset + BLOCK_LENGTH));
		if (verifySignature) {
			aesCrypto.hmac.update(inputChunk);
		}
		const outputChunk = aesCrypto.aesCtrGladman.update(inputChunk);
		if (!verifySignature) {
			aesCrypto.hmac.update(outputChunk);
		}
		output.set(codecBytes.fromBits(outputChunk), offset + paddingStart);
	}
	aesCrypto.pendingInput = subarray(input, offset);
	return output;
}

async function createDecryptionKeys(decrypt, preambleArray, password) {
	await createKeys(decrypt, password, subarray(preambleArray, 0, SALT_LENGTH[decrypt.strength]));
	const passwordVerification = subarray(preambleArray, SALT_LENGTH[decrypt.strength]);
	const passwordVerificationKey = decrypt.keys.passwordVerification;
	if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
		throw new Error(ERR_INVALID_PASSWORD);
	}
}

async function createEncryptionKeys(encrypt, password) {
	const salt = getRandomValues(new Uint8Array(SALT_LENGTH[encrypt.strength]));
	await createKeys(encrypt, password, salt);
	return concat(salt, encrypt.keys.passwordVerification);
}

async function createKeys(target, password, salt) {
	const encodedPassword = encodeText(password);
	const basekey = await importKey(RAW_FORMAT, encodedPassword, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
	const derivedBits = await deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), basekey, 8 * ((KEY_LENGTH[target.strength] * 2) + 2));
	const compositeKey = new Uint8Array(derivedBits);
	target.keys = {
		key: codecBytes.toBits(subarray(compositeKey, 0, KEY_LENGTH[target.strength])),
		authentication: codecBytes.toBits(subarray(compositeKey, KEY_LENGTH[target.strength], KEY_LENGTH[target.strength] * 2)),
		passwordVerification: subarray(compositeKey, KEY_LENGTH[target.strength] * 2)
	};
}

function getRandomValues(array) {
	if (CRYPTO_API_SUPPORTED && typeof crypto.getRandomValues == "function") {
		return crypto.getRandomValues(array);
	} else {
		return random.getRandomValues(array);
	}
}

function importKey(format, password, algorithm, extractable, keyUsages) {
	if (CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof crypto.subtle.importKey == "function") {
		return crypto.subtle.importKey(format, password, algorithm, extractable, keyUsages);
	} else {
		return misc.importKey(password);
	}
}

async function deriveBits(algorithm, baseKey, length) {
	if (CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof crypto.subtle.deriveBits == "function") {
		return await crypto.subtle.deriveBits(algorithm, baseKey, length);
	} else {
		return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
	}
}

function concat(leftArray, rightArray) {
	let array = leftArray;
	if (leftArray.length + rightArray.length) {
		array = new Uint8Array(leftArray.length + rightArray.length);
		array.set(leftArray, 0);
		array.set(rightArray, leftArray.length);
	}
	return array;
}

function expand(inputArray, length) {
	if (length && length > inputArray.length) {
		const array = inputArray;
		inputArray = new Uint8Array(length);
		inputArray.set(array, 0);
	}
	return inputArray;
}

function subarray(array, begin, end) {
	return array.subarray(begin, end);
}