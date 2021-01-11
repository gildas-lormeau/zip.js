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
			data = this.inflater.append(data);
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
			if (this.signature != dataViewSignature.getUint32(0)) {
				throw new Error(ERR_INVALID_SIGNATURE);
			}
		}
		if (this.compressed) {
			if (data.length) {
				data = this.inflater.append(data);
			}
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
			data = this.deflater.append(inputData);
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
			data = this.deflater.flush();
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