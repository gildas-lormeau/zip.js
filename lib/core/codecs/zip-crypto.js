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

import Crc32 from "./crc32.js";
import { ERR_INVALID_PASSWORD } from "./aes-crypto.js";

const HEADER_LENGTH = 12;

class ZipCryptoDecrypt {

	constructor(password, passwordVerification) {
		const zipCrypto = this;
		Object.assign(zipCrypto, {
			password,
			passwordVerification
		});
		createKeys(zipCrypto, password);
	}

	append(input) {
		const zipCrypto = this;
		if (zipCrypto.password) {
			const decryptedHeader = decrypt(zipCrypto, input.subarray(0, HEADER_LENGTH));
			zipCrypto.password = null;
			if (decryptedHeader[HEADER_LENGTH - 1] != zipCrypto.passwordVerification) {
				throw new Error(ERR_INVALID_PASSWORD);
			}
			input = input.subarray(HEADER_LENGTH);
		}
		return decrypt(zipCrypto, input);
	}

	flush() {
		return {
			valid: true,
			data: new Uint8Array(0)
		};
	}
}

class ZipCryptoEncrypt {

	constructor(password, passwordVerification) {
		const zipCrypto = this;
		Object.assign(zipCrypto, {
			password,
			passwordVerification
		});
		createKeys(zipCrypto, password);
	}

	append(input) {
		const zipCrypto = this;
		let output;
		let offset;
		if (zipCrypto.password) {
			zipCrypto.password = null;
			const header = crypto.getRandomValues(new Uint8Array(HEADER_LENGTH));
			header[HEADER_LENGTH - 1] = zipCrypto.passwordVerification;
			output = new Uint8Array(input.length + header.length);
			output.set(encrypt(zipCrypto, header), 0);
			offset = HEADER_LENGTH;
		} else {
			output = new Uint8Array(input.length);
			offset = 0;
		}
		output.set(encrypt(zipCrypto, input), offset);
		return output;
	}

	flush() {
		return {
			data: new Uint8Array(0)
		};
	}
}

export {
	ZipCryptoDecrypt,
	ZipCryptoEncrypt,
	ERR_INVALID_PASSWORD
};

function decrypt(target, input) {
	const output = new Uint8Array(input.length);
	for (let index = 0; index < input.length; index++) {
		output[index] = getByte(target) ^ input[index];
		updateKeys(target, output[index]);
	}
	return output;
}

function encrypt(target, input) {
	const output = new Uint8Array(input.length);
	for (let index = 0; index < input.length; index++) {
		output[index] = getByte(target) ^ input[index];
		updateKeys(target, input[index]);
	}
	return output;
}

function createKeys(target, password) {
	target.keys = [0x12345678, 0x23456789, 0x34567890];
	target.crcKey0 = new Crc32(target.keys[0]);
	target.crcKey2 = new Crc32(target.keys[2]);
	for (let index = 0; index < password.length; index++) {
		updateKeys(target, password.charCodeAt(index));
	}
}

function updateKeys(target, byte) {
	target.crcKey0.append([byte]);
	target.keys[0] = ~target.crcKey0.get();
	target.keys[1] = getInt32(target.keys[1] + getInt8(target.keys[0]));
	target.keys[1] = getInt32(Math.imul(target.keys[1], 134775813) + 1);
	target.crcKey2.append([target.keys[1] >>> 24]);
	target.keys[2] = ~target.crcKey2.get();
}

function getByte(target) {
	const temp = target.keys[2] | 2;
	return getInt8(Math.imul(temp, (temp ^ 1)) >>> 8);
}

function getInt8(number) {
	return number & 0xFF;
}

function getInt32(number) {
	return number & 0xFFFFFFFF;
}