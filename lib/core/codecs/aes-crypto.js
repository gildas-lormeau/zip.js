/*
 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

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

/* global crypto, TextEncoder */

"use strict";

import { cipher, mode, codec } from "./sjcl.js";

const ERR_INVALID_PASSWORD = "Invalid pasword";
const BLOCK_LENGTH = 16;
const RAW_FORMAT = "raw";
const PBKDF2_ALGORITHM = { name: "PBKDF2" };
const SIGNATURE_ALGORITHM = { name: "HMAC" };
const HASH_FUNCTION = "SHA-1";
const BASE_KEY_ALGORITHM = Object.assign({ hash: SIGNATURE_ALGORITHM }, PBKDF2_ALGORITHM);
const DERIVED_BITS_ALGORITHM = Object.assign({ iterations: 1000, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);
const AUTHENTICATION_ALGORITHM = Object.assign({ hash: HASH_FUNCTION }, SIGNATURE_ALGORITHM);
const DERIVED_BITS_USAGE = ["deriveBits"];
const SIGN_USAGE = ["sign"];
const SALT_LENGTH = [8, 12, 16];
const KEY_LENGTH = [16, 24, 32];
const SIGNATURE_LENGTH = 10;
const COUNTER_DEFAULT_VALUE = [0, 0, 0, 0];
const subtle = crypto.subtle;

class AESDecrypt {

	constructor(password, signed, strength) {
		Object.assign(this, {
			password,
			signed,
			strength: strength - 1,
			input: signed && new Uint8Array(0),
			pendingInput: new Uint8Array(0)
		});
	}

	async append(input) {
		const decrypt = this;
		if (decrypt.password) {
			const preambule = input.subarray(0, SALT_LENGTH[decrypt.strength] + 2);
			await createDecryptionKeys(this, preambule, decrypt.password);
			decrypt.password = null;
			decrypt.aesCtrGladman = new mode.ctrGladman(new cipher.aes(decrypt.keys.key), Array.from(COUNTER_DEFAULT_VALUE));
			input = input.subarray(SALT_LENGTH[decrypt.strength] + 2);
		}
		let output = new Uint8Array(input.length - SIGNATURE_LENGTH - ((input.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
		let bufferedInput = input;
		if (decrypt.pendingInput.length) {
			bufferedInput = concat(decrypt.pendingInput, input);
			output = expand(output, bufferedInput.length - SIGNATURE_LENGTH - ((bufferedInput.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
		}
		let offset;
		for (offset = 0; offset <= bufferedInput.length - SIGNATURE_LENGTH - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
			const inputChunk = bufferedInput.subarray(offset, offset + BLOCK_LENGTH);
			const chunkToDecrypt = codec.bytes.toBits(inputChunk);
			const outputChunk = decrypt.aesCtrGladman.update(chunkToDecrypt);
			output.set(codec.bytes.fromBits(outputChunk), offset);
		}
		decrypt.pendingInput = bufferedInput.subarray(offset);
		if (decrypt.signed) {
			decrypt.input = concat(decrypt.input, input);
		}
		return output;
	}

	async flush() {
		const decrypt = this;
		const pendingInput = decrypt.pendingInput;
		const keys = decrypt.keys;
		const chunkToDecrypt = pendingInput.subarray(0, pendingInput.length - SIGNATURE_LENGTH);
		const originalSignatureArray = pendingInput.subarray(pendingInput.length - SIGNATURE_LENGTH);
		let decryptedChunkArray = new Uint8Array(0);
		if (chunkToDecrypt.length) {
			const decryptedChunk = decrypt.aesCtrGladman.update(codec.bytes.toBits(chunkToDecrypt));
			decryptedChunkArray = codec.bytes.fromBits(decryptedChunk);
		}
		let valid = true;
		if (decrypt.signed) {
			const signature = await subtle.sign(SIGNATURE_ALGORITHM, keys.authentication, decrypt.input.subarray(0, decrypt.input.length - SIGNATURE_LENGTH));
			const signatureArray = new Uint8Array(signature).subarray(0, SIGNATURE_LENGTH);
			decrypt.input = null;
			for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) {
				if (signatureArray[indexSignature] != originalSignatureArray[indexSignature]) {
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
			output: new Uint8Array(0),
			pendingInput: new Uint8Array(0)
		});
	}

	async append(input) {
		const encrypt = this;
		let preambule = new Uint8Array(0);
		if (encrypt.password) {
			preambule = await createEncryptionKeys(this, encrypt.password);
			encrypt.password = null;
			encrypt.aesCtrGladman = new mode.ctrGladman(new cipher.aes(encrypt.keys.key), Array.from(COUNTER_DEFAULT_VALUE));
		}
		let output = new Uint8Array(preambule.length + input.length - (input.length % BLOCK_LENGTH));
		output.set(preambule, 0);
		if (encrypt.pendingInput.length) {
			input = concat(encrypt.pendingInput, input);
			output = expand(output, input.length - (input.length % BLOCK_LENGTH));
		}
		let offset;
		for (offset = 0; offset <= input.length - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
			const chunkToEncrypt = codec.bytes.toBits(input.subarray(offset, offset + BLOCK_LENGTH));
			const outputChunk = encrypt.aesCtrGladman.update(chunkToEncrypt);
			output.set(codec.bytes.fromBits(outputChunk), offset + preambule.length);
		}
		encrypt.pendingInput = input.subarray(offset);
		encrypt.output = concat(encrypt.output, output);
		return output;
	}

	async flush() {
		const encrypt = this;
		let encryptedChunkArray = new Uint8Array(0);
		if (encrypt.pendingInput.length) {
			const encryptedChunk = encrypt.aesCtrGladman.update(codec.bytes.toBits(encrypt.pendingInput));
			encryptedChunkArray = codec.bytes.fromBits(encryptedChunk);
			encrypt.output = concat(encrypt.output, encryptedChunkArray);
		}
		const signature = await subtle.sign(SIGNATURE_ALGORITHM, encrypt.keys.authentication, encrypt.output.subarray(SALT_LENGTH[encrypt.strength] + 2));
		encrypt.output = null;
		const signatureArray = new Uint8Array(signature).subarray(0, SIGNATURE_LENGTH);
		return {
			data: concat(encryptedChunkArray, signatureArray),
			signature: signatureArray
		};
	}
}

export {
	AESDecrypt,
	AESEncrypt,
	ERR_INVALID_PASSWORD
};

async function createDecryptionKeys(decrypt, preambuleArray, password) {
	await createKeys(decrypt, password, preambuleArray.subarray(0, SALT_LENGTH[decrypt.strength]));
	const passwordVerification = preambuleArray.subarray(SALT_LENGTH[decrypt.strength]);
	const passwordVerificationKey = decrypt.keys.passwordVerification;
	if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
		throw new Error(ERR_INVALID_PASSWORD);
	}
}

async function createEncryptionKeys(encrypt, password) {
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH[encrypt.strength]));
	await createKeys(encrypt, password, salt);
	return concat(salt, encrypt.keys.passwordVerification);
}

async function createKeys(target, password, salt) {
	const encodedPassword = (new TextEncoder()).encode(password);
	const basekey = await subtle.importKey(RAW_FORMAT, encodedPassword, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
	const derivedBits = await subtle.deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), basekey, 8 * ((KEY_LENGTH[target.strength] * 2) + 2));
	const compositeKey = new Uint8Array(derivedBits);
	target.keys = {
		key: codec.bytes.toBits(compositeKey.subarray(0, KEY_LENGTH[target.strength])),
		authentication: await subtle.importKey(RAW_FORMAT, compositeKey.subarray(KEY_LENGTH[target.strength], KEY_LENGTH[target.strength] * 2), AUTHENTICATION_ALGORITHM, false, SIGN_USAGE),
		passwordVerification: compositeKey.subarray(KEY_LENGTH[target.strength] * 2)
	};
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