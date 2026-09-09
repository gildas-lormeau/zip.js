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

/* global crypto, TransformStream */
// deno-lint-ignore-file no-this-alias

import { UNDEFINED_VALUE, UNDEFINED_TYPE, FUNCTION_TYPE, EMPTY_UINT8_ARRAY } from "../constants.js";
import { encodeText } from "./../util/encode-text.js";
import { concat } from "./../util/array.js";
import { createEngine as createDefaultEngine, pbkdf2 } from "./codecs/aes-hmac-sha1.js";
import {
	ERR_INVALID_PASSWORD,
	ERR_INVALID_AUTHENTICATION_CODE,
	ERR_ABORT_CHECK_PASSWORD,
	getRandomValues
} from "./common-crypto.js";

const BLOCK_LENGTH = 16;
const RAW_FORMAT = "raw";
const PBKDF2_ALGORITHM = { name: "PBKDF2" };
const HASH_ALGORITHM = { name: "HMAC" };
const HASH_FUNCTION = "SHA-1";
const PBKDF2_ITERATIONS = 1000;
const BASE_KEY_ALGORITHM = Object.assign({ hash: HASH_ALGORITHM }, PBKDF2_ALGORITHM);
const DERIVED_BITS_ALGORITHM = Object.assign({ iterations: PBKDF2_ITERATIONS, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);
const DERIVED_BITS_USAGE = ["deriveBits"];
const SALT_LENGTH = [8, 12, 16];
const KEY_LENGTH = [16, 24, 32];
const AUTHENTICATION_CODE_LENGTH = 10;
const PASSWORD_VERIFICATION_LENGTH = 2;
// deno-lint-ignore valid-typeof
const CRYPTO_API_SUPPORTED = typeof crypto != UNDEFINED_TYPE;
const subtle = CRYPTO_API_SUPPORTED && crypto.subtle;
const SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof subtle != UNDEFINED_TYPE;

let DERIVE_BITS_SUPPORTED = SUBTLE_API_SUPPORTED && typeof subtle.importKey == FUNCTION_TYPE && typeof subtle.deriveBits == FUNCTION_TYPE;
let createEngine = createDefaultEngine;

class AESDecryptionStream extends TransformStream {

	constructor({ password, rawPassword, encryptionStrength, checkPasswordOnly, checkAuthenticationCode = true }) {
		super({
			start() {
				initAesCrypto(this, password, rawPassword, encryptionStrength);
			},
			async transform(chunk, controller) {
				const aesCrypto = this;
				const {
					password,
					strength,
					resolveReady,
					ready
				} = aesCrypto;
				if (password) {
					await createDecryptionKeys(aesCrypto, strength, password, subarray(chunk, 0, SALT_LENGTH[strength] + PASSWORD_VERIFICATION_LENGTH));
					chunk = subarray(chunk, SALT_LENGTH[strength] + PASSWORD_VERIFICATION_LENGTH);
					if (checkPasswordOnly) {
						disposeEngine(aesCrypto);
						controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
					} else {
						resolveReady();
					}
				} else {
					await ready;
				}
				const output = new Uint8Array(chunk.length - AUTHENTICATION_CODE_LENGTH - ((chunk.length - AUTHENTICATION_CODE_LENGTH) % BLOCK_LENGTH));
				controller.enqueue(append(aesCrypto, chunk, output, 0, AUTHENTICATION_CODE_LENGTH, true));
			},
			async flush(controller) {
				const {
					engine,
					pendingInput,
					ready
				} = this;
				if (engine) {
					await ready;
					const originalAuthenticationCode = subarray(pendingInput, pendingInput.length - AUTHENTICATION_CODE_LENGTH);
					const decryptedChunkArray = new Uint8Array(subarray(pendingInput, 0, pendingInput.length - AUTHENTICATION_CODE_LENGTH));
					engine.process(decryptedChunkArray, true);
					const authenticationCode = engine.digest();
					let invalidAuthenticationCode = pendingInput.length < AUTHENTICATION_CODE_LENGTH ? 1 : 0;
					for (let indexByte = 0; indexByte < AUTHENTICATION_CODE_LENGTH; indexByte++) {
						invalidAuthenticationCode |= authenticationCode[indexByte] ^ originalAuthenticationCode[indexByte];
					}
					if (invalidAuthenticationCode && checkAuthenticationCode) {
						throw new Error(ERR_INVALID_AUTHENTICATION_CODE);
					}
					controller.enqueue(decryptedChunkArray);
				}
			},
			cancel() {
				disposeEngine(this);
			}
		});
	}
}

class AESEncryptionStream extends TransformStream {

	constructor({ password, rawPassword, encryptionStrength }) {
		super({
			start() {
				initAesCrypto(this, password, rawPassword, encryptionStrength);
			},
			async transform(chunk, controller) {
				const aesCrypto = this;
				const {
					password,
					strength,
					resolveReady,
					ready
				} = aesCrypto;
				let preamble = EMPTY_UINT8_ARRAY;
				if (password) {
					preamble = await createEncryptionKeys(aesCrypto, strength, password);
					resolveReady();
				} else {
					await ready;
				}
				const output = new Uint8Array(preamble.length + chunk.length - (chunk.length % BLOCK_LENGTH));
				output.set(preamble, 0);
				controller.enqueue(append(aesCrypto, chunk, output, preamble.length, 0, false));
			},
			async flush(controller) {
				const {
					engine,
					pendingInput,
					ready
				} = this;
				if (engine) {
					await ready;
					const encryptedChunkArray = new Uint8Array(pendingInput);
					engine.process(encryptedChunkArray, false);
					const authenticationCode = subarray(engine.digest(), 0, AUTHENTICATION_CODE_LENGTH);
					controller.enqueue(concat(encryptedChunkArray, authenticationCode));
				}
			},
			cancel() {
				disposeEngine(this);
			}
		});
	}
}

export {
	AESDecryptionStream,
	AESEncryptionStream,
	setAESEngine
};

function setAESEngine(createEngineFunction) {
	createEngine = createEngineFunction || createDefaultEngine;
}

function initAesCrypto(aesCrypto, password, rawPassword, encryptionStrength) {
	Object.assign(aesCrypto, {
		ready: new Promise(resolve => aesCrypto.resolveReady = resolve),
		password: encodePassword(password, rawPassword),
		strength: encryptionStrength - 1,
		pendingInput: EMPTY_UINT8_ARRAY
	});
}

function append(aesCrypto, input, output, paddingStart, paddingEnd, decrypt) {
	const {
		engine,
		pendingInput
	} = aesCrypto;
	if (pendingInput.length) {
		input = concat(pendingInput, input);
	}
	const inputLength = input.length - paddingEnd;
	const alignedLength = inputLength - (inputLength % BLOCK_LENGTH);
	output = expand(output, paddingStart + alignedLength);
	if (alignedLength) {
		const chunk = subarray(output, paddingStart, paddingStart + alignedLength);
		chunk.set(subarray(input, 0, alignedLength));
		engine.process(chunk, decrypt);
	}
	aesCrypto.pendingInput = subarray(input, alignedLength);
	return output;
}

async function createDecryptionKeys(decrypt, strength, password, preamble) {
	const passwordVerificationKey = await createKeys(decrypt, strength, password, subarray(preamble, 0, SALT_LENGTH[strength]));
	const passwordVerification = subarray(preamble, SALT_LENGTH[strength]);
	if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
		disposeEngine(decrypt);
		throw new Error(ERR_INVALID_PASSWORD);
	}
}

function disposeEngine({ engine }) {
	if (engine && engine.dispose) {
		engine.dispose();
	}
}

async function createEncryptionKeys(encrypt, strength, password) {
	const salt = getRandomValues(new Uint8Array(SALT_LENGTH[strength]));
	const passwordVerification = await createKeys(encrypt, strength, password, salt);
	return concat(salt, passwordVerification);
}

async function createKeys(aesCrypto, strength, password, salt) {
	aesCrypto.password = null;
	const keyLength = KEY_LENGTH[strength];
	const compositeKey = await deriveKey(password, salt, keyLength * 2 + PASSWORD_VERIFICATION_LENGTH);
	aesCrypto.engine = createEngine(subarray(compositeKey, 0, keyLength), subarray(compositeKey, keyLength, keyLength * 2));
	return subarray(compositeKey, keyLength * 2);
}

async function deriveKey(password, salt, length) {
	if (DERIVE_BITS_SUPPORTED) {
		try {
			const baseKey = await subtle.importKey(RAW_FORMAT, password, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
			return new Uint8Array(await subtle.deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), baseKey, length * 8));
		} catch {
			DERIVE_BITS_SUPPORTED = false;
		}
	}
	return pbkdf2(password, salt, PBKDF2_ITERATIONS, length);
}

function encodePassword(password, rawPassword) {
	if (rawPassword === UNDEFINED_VALUE) {
		return encodeText(password);
	} else {
		return rawPassword;
	}
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
