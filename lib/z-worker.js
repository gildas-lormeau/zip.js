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

/* global createShimCodecs, importScripts, addEventListener, postMessage, ZipInflater, ZipDeflater, ZipEncrypt, ZipDecrypt */

(() => {

	"use strict";

	const ERR_INVALID_SIGNATURE = "Invalid signature";

	class Crc32 {

		constructor() {
			this.crc = -1;
			this.table = (() => {
				const table = [];
				for (let i = 0; i < 256; i++) {
					let t = i;
					for (let j = 0; j < 8; j++) {
						if (t & 1) {
							t = (t >>> 1) ^ 0xEDB88320;
						} else {
							t = t >>> 1;
						}
					}
					table[i] = t;
				}
				return table;
			})();
		}

		append(data) {
			const table = this.table;
			let crc = this.crc | 0;
			for (let offset = 0, len = data.length | 0; offset < len; offset++) {
				crc = (crc >>> 8) ^ table[(crc ^ data[offset]) & 0xFF];
			}
			this.crc = crc;
		}

		get() {
			return ~this.crc;
		}
	}

	const handlers = {
		init,
		append,
		flush,
	};
	let task;
	let initialized;
	addEventListener("message", async event => {
		const message = event.data;
		const type = message.type;
		const handler = handlers[type];
		if (handler) {
			try {
				const response = (await handler(message)) || {};
				response.type = message.type;
				if (response.data) {
					try {
						postMessage(response, [response.data.buffer]);
					} catch (error) {
						postMessage(response);
					}
				} else {
					postMessage(response);
				}

			} catch (error) {
				postMessage({ type, error: { message: error.message, stack: error.stack } });
			}
		}
	});

	function init(message) {
		if (message.scripts && message.scripts.length > 0) {
			if (message.scripts.length) {
				importScripts.apply(undefined, message.scripts);
			}
			if (!initialized && typeof createShimCodecs == "function") {
				initialized = true;
				createShimCodecs();
			}
		}
		const options = message.options;
		task = {
			codecType: options.codecType,
			outputSigned: options.outputSigned,
			outputCompressed: options.outputCompressed,
			outputEncrypted: options.outputEncrypted,
			outputPassword: options.outputPassword,
			inputSigned: options.inputSigned,
			inputSignature: options.inputSignature,
			inputCompressed: options.inputCompressed,
			inputEncrypted: options.inputEncrypted,
			inputPassword: options.inputPassword,
			inputCrc32: options.inputSigned && new Crc32(),
			outputCrc32: options.outputSigned && new Crc32(),
			deflater: options.codecType == "deflate" && new ZipDeflater(),
			inflater: options.codecType == "inflate" && new ZipInflater(),
			decrypt: options.inputEncrypted && new ZipDecrypt(options.inputPassword, options.inputSigned),
			encrypt: options.outputEncrypted && new ZipEncrypt(options.outputPassword)
		};
	}

	async function append(message) {
		const inputData = new Uint8Array(message.data);
		let data = inputData;
		if (task.inputEncrypted) {
			data = await task.decrypt.append(data);
		}
		if (task.inputCompressed && data.length) {
			data = await task.inflater.append(data);
		}
		if (!task.inputEncrypted && task.inputSigned) {
			task.inputCrc32.append(data);
		}
		if (task.outputCompressed && data.length) {
			data = await task.deflater.append(inputData);
		}
		if (task.outputEncrypted) {
			data = await task.encrypt.append(data);
		} else if (task.outputSigned) {
			task.outputCrc32.append(inputData);
		}
		return { data };
	}

	async function flush() {
		let signature, data = new Uint8Array(0);
		if (task.inputEncrypted) {
			const result = await task.decrypt.flush();
			if (!result.valid) {
				throw new Error(ERR_INVALID_SIGNATURE);
			}
			data = result.data;
		} else if (task.inputSigned) {
			const dataViewSignature = new DataView(new Uint8Array(4).buffer);
			signature = task.inputCrc32.get();
			dataViewSignature.setUint32(0, signature);
			if (task.inputSignature != dataViewSignature.getUint32(0, false)) {
				throw new Error(ERR_INVALID_SIGNATURE);
			}
		}
		if (task.inputCompressed) {
			if (data.length) {
				data = await task.inflater.append(data);
			}
			await task.inflater.flush();
		}
		if (task.outputCompressed) {
			data = await task.deflater.flush();
		}
		if (task.outputEncrypted) {
			data = await task.encrypt.append(data);
			const result = await task.encrypt.flush();
			signature = result.signature;
			const newData = new Uint8Array(data.length + result.data.length);
			newData.set(data, 0);
			newData.set(result.data, data.length);
			data = newData;
		} else if (task.outputSigned) {
			signature = task.outputCrc32.get();
		}
		return { data, signature };
	}

})();