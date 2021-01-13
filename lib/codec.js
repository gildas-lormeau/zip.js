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

 THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
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

/* global ZipInflater, ZipDeflater, ZipEncrypt, ZipDecrypt */

"use strict";

import Crc32 from "./crc32.js";
import createWorkerCodec from "./workers.js";

const ERR_INVALID_SIGNATURE = "Invalid signature";

class Inflater {

	constructor(options) {
		this.signature = options.inputSignature;
		this.encrypted = Boolean(options.inputPassword);
		this.signed = options.inputSigned;
		this.compressed = options.inputCompressed;
		this.inflater = this.compressed && new ZipInflater();
		this.crc32 = this.signed && this.signed && new Crc32();
		this.decryption = this.encrypted && new ZipDecrypt(options.inputPassword);
	}

	async append(data) {
		if (this.encrypted) {
			data = await this.decryption.append(data);
		}
		if (this.compressed && data.length) {
			data = await this.inflater.append(data);
		}
		if (!this.encrypted && this.signed) {
			this.crc32.append(data);
		}
		return data;
	}

	async flush() {
		let signature, data = new Uint8Array(0);
		if (this.encrypted) {
			const result = await this.decryption.flush();
			if (!result.valid) {
				throw new Error(ERR_INVALID_SIGNATURE);
			}
			data = result.data;
		} else if (this.signed) {
			const dataViewSignature = new DataView(new Uint8Array(4).buffer);
			signature = this.crc32.get();
			dataViewSignature.setUint32(0, signature);
			if (this.signature != dataViewSignature.getUint32(0, false)) {
				throw new Error(ERR_INVALID_SIGNATURE);
			}
		}
		if (this.compressed) {
			data = (await this.inflater.append(data)) || new Uint8Array(0);
			await this.inflater.flush();
		}
		return { data, signature };
	}
}

class Deflater {

	constructor(options) {
		this.encrypted = options.outputEncrypted;
		this.signed = options.outputSigned;
		this.compressed = options.outputCompressed;
		this.deflater = this.compressed && new ZipDeflater({ level: options.level });
		this.crc32 = this.signed && new Crc32();
		this.encrypt = this.encrypted && new ZipEncrypt(options.outputPassword);
	}

	async append(inputData) {
		let data = inputData;
		if (this.compressed && inputData.length) {
			data = await this.deflater.append(inputData);
		}
		if (this.encrypted) {
			data = await this.encrypt.append(data);
		} else if (this.signed) {
			this.crc32.append(inputData);
		}
		return data;
	}

	async flush() {
		let data = new Uint8Array(0), signature;
		if (this.compressed) {
			data = (await this.deflater.flush()) || new Uint8Array(0);
		}
		if (this.encrypted) {
			data = await this.encrypt.append(data);
			const result = await this.encrypt.flush();
			signature = result.signature;
			const newData = new Uint8Array(data.length + result.data.length);
			newData.set(data, 0);
			newData.set(result.data, data.length);
			data = newData;
		} else if (this.signed) {
			signature = this.crc32.get();
		}
		return { data, signature };
	}
}

export default createCodec;

async function createCodec(config, options) {
	const webWorkersEnabled =
		options.inputCompressed || options.inputSigned || options.inputEncrypted ||
		options.outputCompressed || options.outputSigned || !options.outputEncrypted;
	if (config.useWebWorkers && webWorkersEnabled) {
		return createWorkerCodec(config, options);
	} else {
		if (options.codecType == "deflate") {
			return new Deflater(options);
		} else if (options.codecType == "inflate") {
			return new Inflater(options);
		}
	}
}