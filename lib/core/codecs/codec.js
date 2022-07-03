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

// deno-lint-ignore-file no-this-alias

import Crc32 from "./crc32.js";
import { AESEncrypt, AESDecrypt, ERR_INVALID_PASSWORD } from "./aes-crypto.js";
import { ZipCryptoDecrypt, ZipCryptoEncrypt } from "./zip-crypto.js";

const CODEC_DEFLATE = "deflate";
const CODEC_INFLATE = "inflate";
const ERR_INVALID_SIGNATURE = "Invalid signature";

class Inflate {

	constructor(codecConstructor, {
		signature,
		password,
		signed,
		compressed,
		zipCrypto,
		passwordVerification,
		encryptionStrength
	}, { chunkSize }) {
		const encrypted = Boolean(password);
		Object.assign(this, {
			signature,
			encrypted,
			signed,
			compressed,
			inflate: compressed && new codecConstructor({ chunkSize }),
			crc32: signed && new Crc32(),
			zipCrypto,
			decrypt: encrypted && zipCrypto ?
				new ZipCryptoDecrypt(password, passwordVerification) :
				new AESDecrypt(password, signed, encryptionStrength)
		});
	}

	async append(data) {
		const codec = this;
		if (codec.encrypted && data.length) {
			data = await codec.decrypt.append(data);
		}
		if (codec.compressed && data.length) {
			data = await codec.inflate.append(data);
		}
		if ((!codec.encrypted || codec.zipCrypto) && codec.signed && data.length) {
			codec.crc32.append(data);
		}
		return data;
	}

	async flush() {
		const codec = this;
		let signature;
		let data = new Uint8Array(0);
		if (codec.encrypted) {
			const result = codec.decrypt.flush();
			if (!result.valid) {
				throw new Error(ERR_INVALID_SIGNATURE);
			}
			data = result.data;
		}
		if ((!codec.encrypted || codec.zipCrypto) && codec.signed) {
			const dataViewSignature = new DataView(new Uint8Array(4).buffer);
			signature = codec.crc32.get();
			dataViewSignature.setUint32(0, signature);
			if (codec.signature != dataViewSignature.getUint32(0, false)) {
				throw new Error(ERR_INVALID_SIGNATURE);
			}
		}
		if (codec.compressed) {
			data = (await codec.inflate.append(data)) || new Uint8Array(0);
			await codec.inflate.flush();
		}
		return { data, signature };
	}
}

class Deflate {

	constructor(codecConstructor, {
		encrypted,
		signed,
		compressed,
		level,
		zipCrypto,
		password,
		passwordVerification,
		encryptionStrength
	}, { chunkSize }) {
		Object.assign(this, {
			encrypted,
			signed,
			compressed,
			deflate: compressed && new codecConstructor({ level: level || 5, chunkSize }),
			crc32: signed && new Crc32(),
			zipCrypto,
			encrypt: encrypted && zipCrypto ?
				new ZipCryptoEncrypt(password, passwordVerification) :
				new AESEncrypt(password, encryptionStrength)
		});
	}

	async append(inputData) {
		const codec = this;
		let data = inputData;
		if (codec.compressed && inputData.length) {
			data = await codec.deflate.append(inputData);
		}
		if (codec.encrypted && data.length) {
			data = await codec.encrypt.append(data);
		}
		if ((!codec.encrypted || codec.zipCrypto) && codec.signed && inputData.length) {
			codec.crc32.append(inputData);
		}
		return data;
	}

	async flush() {
		const codec = this;
		let signature;
		let data = new Uint8Array(0);
		if (codec.compressed) {
			data = (await codec.deflate.flush()) || new Uint8Array(0);
		}
		if (codec.encrypted) {
			data = await codec.encrypt.append(data);
			const result = codec.encrypt.flush();
			signature = result.signature;
			const newData = new Uint8Array(data.length + result.data.length);
			newData.set(data, 0);
			newData.set(result.data, data.length);
			data = newData;
		}
		if ((!codec.encrypted || codec.zipCrypto) && codec.signed) {
			signature = codec.crc32.get();
		}
		return { data, signature };
	}
}

export {
	Inflate,
	Deflate,
	createCodec,
	CODEC_DEFLATE,
	CODEC_INFLATE,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSWORD
};

function createCodec(codecConstructor, options, config) {
	if (options.codecType.startsWith(CODEC_DEFLATE)) {
		return new Deflate(codecConstructor, options, config);
	} else if (options.codecType.startsWith(CODEC_INFLATE)) {
		return new Inflate(codecConstructor, options, config);
	}
}