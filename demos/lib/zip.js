(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
}(this, (function (exports) { 'use strict';

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

	const ERR_HTTP_STATUS = "HTTP error ";
	const ERR_HTTP_RANGE = "HTTP Range not supported.";
	const TEXT_PLAIN = "text/plain";

	class Reader {
		init() {
			this.initialized = true;
		}
	}

	class Writer {
		init() {
			this.initialized = true;
		}
	}

	class TextReader extends Reader {

		constructor(text) {
			super();
			this.size = 0;
			this.blobReader = new BlobReader(new Blob([text], { type: TEXT_PLAIN }));
		}

		init() {
			super.init();
			this.blobReader.init();
			this.size = this.blobReader.size;
		}

		readUint8Array(offset, length) {
			return this.blobReader.readUint8Array(offset, length);
		}
	}

	class TextWriter extends Writer {

		constructor(encoding) {
			super();
			this.encoding = encoding;
			this.blob = new Blob([], { type: TEXT_PLAIN });
		}

		writeUint8Array(array) {
			this.blob = new Blob([this.blob, array.buffer], { type: TEXT_PLAIN });
		}

		getData() {
			const reader = new FileReader();
			return new Promise((resolve, reject) => {
				reader.onload = event => resolve(event.target.result);
				reader.onerror = reject;
				reader.readAsText(this.blob, this.encoding);
			});
		}
	}

	class Data64URIReader extends Reader {

		constructor(dataURI) {
			super();
			this.dataURI = dataURI;
			let dataEnd = this.dataURI.length;
			while (this.dataURI.charAt(dataEnd - 1) == "=") {
				dataEnd--;
			}
			this.dataStart = this.dataURI.indexOf(",") + 1;
			this.size = Math.floor((dataEnd - this.dataStart) * 0.75);
		}

		readUint8Array(offset, length) {
			const dataArray = new Uint8Array(length);
			const start = Math.floor(offset / 3) * 4;
			const bytes = atob(this.dataURI.substring(start + this.dataStart, Math.ceil((offset + length) / 3) * 4 + this.dataStart));
			const delta = offset - Math.floor(start / 4) * 3;
			for (let indexByte = delta; indexByte < delta + length; indexByte++) {
				dataArray[indexByte - delta] = bytes.charCodeAt(indexByte);
			}
			return dataArray;
		}
	}

	class Data64URIWriter extends Writer {

		constructor(contentType) {
			super();
			this.data = "data:" + (contentType || "") + ";base64,";
			this.pending = [];
		}

		writeUint8Array(array) {
			let indexArray = 0, dataString = this.pending;
			const delta = this.pending.length;
			this.pending = "";
			for (indexArray = 0; indexArray < (Math.floor((delta + array.length) / 3) * 3) - delta; indexArray++) {
				dataString += String.fromCharCode(array[indexArray]);
			}
			for (; indexArray < array.length; indexArray++) {
				this.pending += String.fromCharCode(array[indexArray]);
			}
			if (dataString.length > 2) {
				this.data += btoa(dataString);
			} else {
				this.pending = dataString;
			}
		}

		getData() {
			return this.data + btoa(this.pending);
		}
	}

	class BlobReader extends Reader {

		constructor(blob) {
			super();
			this.blob = blob;
			this.size = blob.size;
		}

		readUint8Array(offset, length) {
			const reader = new FileReader();
			return new Promise((resolve, reject) => {
				reader.onload = event => resolve(new Uint8Array(event.target.result));
				reader.onerror = reject;
				reader.readAsArrayBuffer(this.blob.slice(offset, offset + length));
			});
		}
	}

	class BlobWriter extends Writer {

		constructor(contentType) {
			super();
			this.offset = 0;
			this.contentType = contentType;
			this.blob = new Blob([], { type: contentType });
		}

		writeUint8Array(array) {
			this.blob = new Blob([this.blob, array.buffer], { type: this.contentType });
			this.offset = this.blob.size;
		}

		getData() {
			return this.blob;
		}
	}

	class HttpReader extends Reader {

		constructor(url) {
			super();
			this.url = url;
			this.size = 0;
		}

		async init() {
			super.init();
			if (isHttpFamily(this.url)) {
				return new Promise((resolve, reject) => {
					const request = new XMLHttpRequest();
					request.addEventListener("load", () => {
						if (request.status < 400) {
							this.size = Number(request.getResponseHeader("Content-Length"));
							if (!this.size) {
								getData().then(() => resolve()).catch(reject);
							} else {
								resolve();
							}
						} else {
							reject(ERR_HTTP_STATUS + (request.statusText || request.status) + ".");
						}
					}, false);
					request.addEventListener("error", reject, false);
					request.open("HEAD", this.url);
					request.send();
				});
			} else {
				await getData();
			}
		}

		async readUint8Array(index, length) {
			if (!this.data) {
				await getData(this, this.url);
			}
			return new Uint8Array(this.data.subarray(index, index + length));
		}
	}

	class HttpRangeReader extends Reader {

		constructor(url) {
			super();
			this.url = url;
			this.size = 0;
		}

		init() {
			super.init();
			return new Promise((resolve, reject) => {
				const request = new XMLHttpRequest();
				request.addEventListener("load", () => {
					if (request.status < 400) {
						this.size = Number(request.getResponseHeader("Content-Length"));
						if (request.getResponseHeader("Accept-Ranges") == "bytes") {
							resolve();
						} else {
							reject(new Error(ERR_HTTP_RANGE));
						}
					} else {
						reject(ERR_HTTP_STATUS + (request.statusText || request.status) + ".");
					}
				}, false);
				request.addEventListener("error", reject, false);
				request.open("HEAD", this.url);
				request.send();
			});
		}

		readUint8Array(index, length) {
			return new Promise((resolve, reject) => {
				const request = new XMLHttpRequest();
				request.open("GET", this.url);
				request.responseType = "arraybuffer";
				request.setRequestHeader("Range", "bytes=" + index + "-" + (index + length - 1));
				request.addEventListener("load", () => {
					if (request.status < 400) {
						resolve(new Uint8Array(request.response));
					} else {
						reject(ERR_HTTP_STATUS + (request.statusText || request.status) + ".");
					}
				}, false);
				request.addEventListener("error", reject, false);
				request.send();
			});
		}
	}

	class Uint8ArrayReader extends Reader {

		constructor(array) {
			super();
			this.array = array;
			this.size = this.array.length;
		}

		readUint8Array(index, length) {
			return this.array.slice(index, index + length);
		}
	}

	class Uint8ArrayWriter extends Writer {

		constructor() {
			super();
			this.array = new Uint8Array(0);
		}

		writeUint8Array(array) {
			const previousArray = this.array;
			this.array = new Uint8Array(previousArray.length + array.length);
			this.array.set(previousArray);
			this.array.set(array, previousArray.length);
		}

		getData() {
			return this.array;
		}
	}

	function isHttpFamily(url) {
		if (typeof document != "undefined") {
			const anchor = document.createElement("a");
			anchor.href = url;
			return anchor.protocol == "http:" || anchor.protocol == "https:";
		} else {
			return /^https?:\/\//i.test(url);
		}
	}

	function getData(httpReader, url) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.addEventListener("load", () => {
				if (request.status < 400) {
					if (!httpReader.size) {
						httpReader.size = Number(request.getResponseHeader("Content-Length")) || Number(request.response.byteLength);
					}
					httpReader.data = new Uint8Array(request.response);
					resolve();
				} else {
					reject(ERR_HTTP_STATUS + (request.statusText || request.status) + ".");
				}
			}, false);
			request.addEventListener("error", reject, false);
			request.open("GET", url);
			request.responseType = "arraybuffer";
			request.send();
		});
	}

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
			for (let offset = 0, length = data.length | 0; offset < length; offset++) {
				crc = (crc >>> 8) ^ table[(crc ^ data[offset]) & 0xFF];
			}
			this.crc = crc;
		}

		get() {
			return ~this.crc;
		}
	}

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

	const Z_WORKER_SCRIPT_PATH = "z-worker.js";
	const DEFAULT_WORKER_SCRIPTS = {
		deflate: [Z_WORKER_SCRIPT_PATH, "deflate.js", "crypto.js"],
		inflate: [Z_WORKER_SCRIPT_PATH, "inflate.js", "crypto.js"]
	};
	const workers = {
		pool: [],
		pendingRequests: []
	};

	function createWorkerCodec(config, options) {
		const codecType = options.codecType;
		if (config.workerScripts != null && config.workerScriptsPath != null) {
			throw new Error("Either zip.workerScripts or zip.workerScriptsPath may be set, not both.");
		}
		let scripts;
		if (config.workerScripts) {
			scripts = config.workerScripts[codecType];
			if (!Array.isArray(scripts)) {
				throw new Error("zip.workerScripts." + codecType + " must be an array.");
			}
			scripts = resolveURLs(scripts);
		} else {
			scripts = DEFAULT_WORKER_SCRIPTS[codecType].slice(0);
			scripts[0] = (config.workerScriptsPath || "") + scripts[0];
		}
		if (workers.pool.length < config.maxWorkers) {
			const workerData = { worker: new Worker(scripts[0]), busy: true, options, scripts };
			workers.pool.push(workerData);
			createWorkerInterface(workerData);
			return workerData.interface;
		} else {
			const availableWorkerData = workers.pool.find(workerData => !workerData.busy);
			if (availableWorkerData) {
				availableWorkerData.busy = true;
				availableWorkerData.options = options;
				availableWorkerData.scripts = scripts;
				return availableWorkerData.interface;
			} else {
				return new Promise(resolve => workers.pendingRequests.push({ resolve, options, scripts }));
			}
		}
	}

	function createWorkerInterface(workerData) {
		const worker = workerData.worker;
		let task;
		worker.addEventListener("message", onMessage, false);
		workerData.interface = {
			async append(data) {
				if (!task) {
					await sendMessage(Object.assign({ type: "init", options: workerData.options, scripts: workerData.scripts.slice(1) }));
				}
				return sendMessage({ type: "append", data });
			},
			async flush() {
				if (!task) {
					await sendMessage(Object.assign({ type: "init", options: workerData.options, scripts: workerData.scripts.slice(1) }));
				}
				return sendMessage({ type: "flush" });
			}
		};

		function sendMessage(message) {
			try {
				if (message.data) {
					try {
						worker.postMessage(message, [message.data.buffer]);
					} catch (error) {
						worker.postMessage(message);
					}
				} else {
					worker.postMessage(message);
				}
			} catch (error) {
				task.reject(error);
				worker.removeEventListener("message", onMessage, false);
			}
			return new Promise((resolve, reject) => task = { resolve, reject });
		}

		function onMessage(event) {
			const message = event.data;
			if (task) {
				if (message.error) {
					const error = new Error(message.error.message);
					error.stack = message.error.stack;
					task.reject(error);
					worker.removeEventListener("message", onMessage, false);
				} else if (message.type == "init" || message.type == "flush" || message.type == "append") {
					if (message.type == "flush") {
						task.resolve({ data: new Uint8Array(message.data), signature: message.signature });
						task = null;
						terminateWorker(workerData);
					} else {
						task.resolve(message.data && new Uint8Array(message.data));
					}
				}
			}
		}
	}

	function terminateWorker(workerData) {
		workerData.busy = false;
		if (workers.pendingRequests.length) {
			const [{ resolve, options, scripts }] = workers.pendingRequests.splice(0, 1);
			workerData.busy = true;
			workerData.options = options;
			workerData.scripts = scripts;
			resolve(workerData.interface);
		} else {
			workerData.worker.terminate();
			workers.pool = workers.pool.filter(data => data != workerData);
		}
	}

	function resolveURLs(urls) {
		if (typeof document != "undefined") {
			const anchorElement = document.createElement("a");
			return urls.map(url => {
				anchorElement.href = url;
				return anchorElement.href;
			});
		} else {
			return urls;
		}
	}

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

	async function createCodec(config, options) {
		const webWorkersEnabled =
			options.inputCompressed || options.inputSigned || options.inputEncrypted ||
			options.outputCompressed || options.outputSigned || options.outputEncrypted;
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

	const MINIMUM_CHUNK_SIZE = 64;

	async function processData(codec, reader, writer, offset, inputLength, config, options) {
		const chunkSize = Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
		return processChunk();

		async function processChunk(chunkIndex = 0, length = 0) {
			const chunkOffset = chunkIndex * chunkSize;
			if (chunkOffset < inputLength) {
				const inputData = await reader.readUint8Array(chunkOffset + offset, Math.min(chunkSize, inputLength - chunkOffset));
				const data = await codec.append(inputData);
				length += await writeData(writer, data);
				if (options.onprogress) {
					options.onprogress(chunkOffset + inputData.length, inputLength);
				}
				return processChunk(chunkIndex + 1, length);
			} else {
				const result = await codec.flush();
				length += await writeData(writer, result.data);
				return { signature: result.signature, length };
			}
		}
	}

	async function writeData(writer, data) {
		if (data.length) {
			await writer.writeUint8Array(data);
		}
		return data.length;
	}

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

	const ERR_BAD_FORMAT = "File format is not recognized.";
	const ERR_EOCDR_NOT_FOUND = "End of central directory not found.";
	const ERR_ENCRYPTED = "File contains encrypted entry.";
	const EXTENDED_US_ASCII = ["\u00C7", "\u00FC", "\u00E9", "\u00E2", "\u00E4", "\u00E0", "\u00E5", "\u00E7", "\u00EA", "\u00EB",
		"\u00E8", "\u00EF", "\u00EE", "\u00EC", "\u00C4", "\u00C5", "\u00C9", "\u00E6", "\u00C6", "\u00F4", "\u00F6", "\u00F2", "\u00FB", "\u00F9",
		"\u00FF", "\u00D6", "\u00DC", "\u00F8", "\u00A3", "\u00D8", "\u00D7", "\u0192", "\u00E1", "\u00ED", "\u00F3", "\u00FA", "\u00F1", "\u00D1",
		"\u00AA", "\u00BA", "\u00BF", "\u00AE", "\u00AC", "\u00BD", "\u00BC", "\u00A1", "\u00AB", "\u00BB", "_", "_", "_", "\u00A6", "\u00A6",
		"\u00C1", "\u00C2", "\u00C0", "\u00A9", "\u00A6", "\u00A6", "+", "+", "\u00A2", "\u00A5", "+", "+", "-", "-", "+", "-", "+", "\u00E3",
		"\u00C3", "+", "+", "-", "-", "\u00A6", "-", "+", "\u00A4", "\u00F0", "\u00D0", "\u00CA", "\u00CB", "\u00C8", "i", "\u00CD", "\u00CE",
		"\u00CF", "+", "+", "_", "_", "\u00A6", "\u00CC", "_", "\u00D3", "\u00DF", "\u00D4", "\u00D2", "\u00F5", "\u00D5", "\u00B5", "\u00FE",
		"\u00DE", "\u00DA", "\u00DB", "\u00D9", "\u00FD", "\u00DD", "\u00AF", "\u00B4", "\u00AD", "\u00B1", "_", "\u00BE", "\u00B6", "\u00A7",
		"\u00F7", "\u00B8", "\u00B0", "\u00A8", "\u00B7", "\u00B9", "\u00B3", "\u00B2", "_", " "];
	const MAX_ZIP_COMMENT_SIZE = 65536;

	class ZipReader {

		constructor(reader, options = {}, config = {}) {
			this.reader = reader;
			this.options = options;
			this.config = config;
		}

		async getEntries() {
			if (!this.reader.initialized) {
				await this.reader.init();
			}
			const directoryInfo = await seekSignature(this.reader, [0x50, 0x4b, 0x05, 0x06], 22, MAX_ZIP_COMMENT_SIZE);
			if (directoryInfo) {
				let zip64, directoryDataView = new DataView(directoryInfo.buffer);
				let dataLength = directoryDataView.getUint32(16, true);
				let filesLength = directoryDataView.getUint16(8, true);
				if (dataLength == 0xffffffff || filesLength == 0xffff) {
					zip64 = true;
					const directoryLocatorArray = await this.reader.readUint8Array(directoryInfo.offset - 20, 20);
					const directoryLocatorView = new DataView(directoryLocatorArray.buffer);
					if (Number(directoryLocatorView.getUint32(0, false)) != 0x504b0607) {
						throw new Error(ERR_BAD_FORMAT);
					}
					dataLength = Number(directoryLocatorView.getBigUint64(8, true));
					const directoryDataArray = await this.reader.readUint8Array(dataLength, 56);
					const directoryDataView = new DataView(directoryDataArray.buffer);
					if (Number(directoryDataView.getUint32(0, false)) != 0x504b0606) {
						throw new Error(ERR_BAD_FORMAT);
					}
					filesLength = Number(directoryDataView.getBigUint64(24, true));
					dataLength -= Number(directoryDataView.getBigUint64(40, true));
				}
				if (dataLength < 0 || (!zip64 && (dataLength >= this.reader.size || filesLength >= 0xffff))) {
					throw new Error(ERR_BAD_FORMAT);
				}
				const dataArray = await this.reader.readUint8Array(dataLength, this.reader.size - dataLength);
				directoryDataView = new DataView(dataArray.buffer);
				const entries = [];
				let offset = 0;
				for (let indexFile = 0; indexFile < filesLength; indexFile++) {
					const entry = new Entry(this);
					if (directoryDataView.getUint32(offset, false) != 0x504b0102) {
						throw new Error(ERR_BAD_FORMAT);
					}
					entry.compressedSize = 0;
					entry.uncompressedSize = 0;
					readCommonHeader(entry, directoryDataView, offset + 6, true);
					entry.commentLength = directoryDataView.getUint16(offset + 32, true);
					entry.directory = ((directoryDataView.getUint8(offset + 38) & 0x10) == 0x10);
					entry.offset = directoryDataView.getUint32(offset + 42, true);
					entry.rawFilename = dataArray.subarray(offset + 46, offset + 46 + entry.filenameLength);
					const filename = getString(entry.rawFilename);
					entry.filename = ((entry.bitFlag & 0x0800) == 0x0800) ? decodeUTF8(filename) : decodeASCII(filename);
					if (!entry.directory && entry.filename.charAt(entry.filename.length - 1) == "/") {
						entry.directory = true;
					}
					entry.rawExtraField = dataArray.subarray(offset + 46 + entry.filenameLength, offset + 46 + entry.filenameLength + entry.extraFieldLength);
					readExtraField(entry, offset);
					entry.rawComment = dataArray.subarray(offset + 46 + entry.filenameLength + entry.extraFieldLength, offset + 46
						+ entry.filenameLength + entry.extraFieldLength + entry.commentLength);
					const comment = getString(entry.rawComment);
					entry.comment = ((entry.bitFlag & 0x0800) == 0x0800) ? decodeUTF8(comment) : decodeASCII(comment);
					entries.push(entry);
					offset += 46 + entry.filenameLength + entry.extraFieldLength + entry.commentLength;
				}
				return entries;
			} else {
				throw new Error(ERR_EOCDR_NOT_FOUND);
			}
		}

		async close() {
		}
	}

	class Entry {

		constructor(zipReader) {
			this.reader = zipReader.reader;
			this.config = zipReader.config;
		}

		async getData(writer, options = {}) {
			if (!this.reader.initialized) {
				await this.reader.init();
			}
			const dataArray = await this.reader.readUint8Array(this.offset, 30);
			const dataView = new DataView(dataArray.buffer);
			let inputPassword = options.password && options.password.length && options.password;
			if (dataView.getUint32(0, false) != 0x504b0304) {
				throw ERR_BAD_FORMAT;
			}
			readCommonHeader(this, dataView, 4, false);
			let dataOffset = this.offset + 30 + this.filenameLength + this.extraFieldLength;
			await writer.init();
			if (this.passwordProtected && !inputPassword) {
				throw new Error(ERR_ENCRYPTED);
			}
			const codec = await createCodec(this.config, {
				codecType: "inflate",
				inputPassword,
				inputSigned: options.checkSignature,
				inputSignature: this.signature,
				inputCompressed: this.compressionMethod != 0,
				inputEncrypted: this.passwordProtected
			});
			await processData(codec, this.reader, writer, dataOffset, this.compressedSize, this.config, { onprogress: options.onprogress });
			return writer.getData();
		}
	}

	function readCommonHeader(entry, dataView, offset, centralDirectory) {
		entry.version = dataView.getUint16(offset, true);
		entry.bitFlag = dataView.getUint16(offset + 2, true);
		entry.compressionMethod = dataView.getUint16(offset + 4, true);
		entry.lastModDateRaw = dataView.getUint32(offset + 6, true);
		entry.lastModDate = getDate(entry.lastModDateRaw);
		if ((entry.bitFlag & 0x01) == 0x01) {
			entry.passwordProtected = true;
		}
		if (centralDirectory || (entry.bitFlag & 0x08) != 0x08) {
			entry.signature = dataView.getUint32(offset + 10, true);
			entry.compressedSize = dataView.getUint32(offset + 14, true);
			entry.uncompressedSize = dataView.getUint32(offset + 18, true);
		}
		entry.filenameLength = dataView.getUint16(offset + 22, true);
		entry.extraFieldLength = dataView.getUint16(offset + 24, true);
	}

	function readExtraField(entry, offset) {
		if (entry.rawExtraField) {
			entry.zip64 = true;
			const rawExtraFieldView = new DataView(new Uint8Array(entry.rawExtraField).buffer);
			entry.extraField = new Map();
			let offsetExtraField = 0;
			while (offsetExtraField < entry.rawExtraField.length) {
				const type = rawExtraFieldView.getUint16(offsetExtraField, true);
				const size = rawExtraFieldView.getUint16(offsetExtraField + 2, true);
				entry.extraField.set(type, {
					type,
					size,
					data: entry.rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
				});
				offsetExtraField += 4 + size;
			}
			const zip64ExtraField = entry.extraField.get(0x01);
			const encryptionExtraField = entry.extraField.get(0x9901);
			if (zip64ExtraField) {
				const zip64ExtraFieldView = new DataView(zip64ExtraField.data.buffer);
				if (zip64ExtraField.data.length >= 8) {
					entry.uncompressedSize = Number(zip64ExtraFieldView.getBigUint64(0, true));
					if (zip64ExtraField.data.length >= 16) {
						entry.compressedSize = Number(zip64ExtraFieldView.getBigUint64(8, true));
						if (zip64ExtraField.data.length >= 24) {
							entry.offset = Number(zip64ExtraFieldView.getBigUint64(offset + 16, true));
						}
					}
				}
			}
			if (encryptionExtraField) {
				const encryptionExtraFieldView = new DataView(encryptionExtraField.data.buffer);
				entry.compressionMethod = encryptionExtraFieldView.getUint16(5, true);
			}
		}
	}

	async function seekSignature(reader, signature, minimumBytes, maximumLength) {
		if (reader.size < minimumBytes) {
			throw new Error(ERR_BAD_FORMAT);
		}
		const maximumBytes = minimumBytes + maximumLength;
		let offset = minimumBytes;
		let directoryInfo = await seek(offset);
		if (!directoryInfo) {
			directoryInfo = await seek(Math.min(maximumBytes, reader.size));
		}
		if (!directoryInfo) {
			throw new Error(ERR_BAD_FORMAT);
		}
		return directoryInfo;

		async function seek(length) {
			const offset = reader.size - length;
			const bytes = await reader.readUint8Array(offset, length);
			for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) {
				if (bytes[indexByte] == signature[0] && bytes[indexByte + 1] == signature[1] && bytes[indexByte + 2] == signature[2] && bytes[indexByte + 3] == signature[3]) {
					return {
						offset,
						buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
					};
				}
			}
		}
	}

	function decodeASCII(str) {
		let result = "";
		for (let indexTable = 0; indexTable < str.length; indexTable++) {
			const charCode = str.charCodeAt(indexTable) & 0xFF;
			if (charCode > 127) {
				result += EXTENDED_US_ASCII[charCode - 128];
			} else {
				result += String.fromCharCode(charCode);
			}
		}
		return result;
	}

	function decodeUTF8(string) {
		return decodeURIComponent(escape(string));
	}

	function getString(bytes) {
		let result = "";
		for (let indexByte = 0; indexByte < bytes.length; indexByte++) {
			result += String.fromCharCode(bytes[indexByte]);
		}
		return result;
	}

	function getDate(timeRaw) {
		const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
		try {
			return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
		} catch (error) {
			// ignored
		}
	}

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

	const ERR_DUPLICATED_NAME = "File already exists.";
	const ERR_ZIP_FILE_COMMENT = "Zip file comment exceeds 64KB.";

	class ZipWriter {

		constructor(writer, options = {}, config = {}) {
			this.writer = writer;
			this.options = options;
			this.config = config;
			this.files = new Map();
			this.offset = 0;
			this.zip64 = options.zip64;
		}

		async add(name, reader, options = {}) {
			let writer;
			if (options.bufferedWrite) {
				writer = new Uint8ArrayWriter();
				writer.init();
			} else {
				if (!this.writer.initialized) {
					await this.writer.init();
				}
				writer = this.writer;
			}
			name = name.trim();
			if (options.directory && name.charAt(name.length - 1) != "/") {
				name += "/";
			}
			options.zip64 = options.zip64 || this.zip64;
			if (this.files.has(name)) {
				throw new Error(ERR_DUPLICATED_NAME);
			}
			this.files.set(name, null);
			const fileEntry = await createFileEntry(name, reader, writer, this.config, options);
			this.files.set(name, fileEntry);
			if (options.bufferedWrite) {
				await this.writer.writeUint8Array(writer.getData());
			}
			fileEntry.offset = this.offset;
			if (fileEntry.offset >= 0xffffffff) {
				fileEntry.zip64 = true;
			}
			if (fileEntry.zip64) {
				const extraFieldViewZip64 = new DataView(fileEntry.extraFieldZip64.buffer);
				extraFieldViewZip64.setBigUint64(20, BigInt(fileEntry.offset), true);
			}
			this.offset += fileEntry.length;
		}

		async close(comment) {
			let offset = 0, directoryDataLength = 0, directoryOffset = this.offset, filesLength = this.files.size;
			for (const [, file] of this.files) {
				directoryDataLength += 46 + file.filename.length + file.comment.length + file.extraFieldZip64.length + file.extraFieldEncryption.length + file.rawExtraField.length;
			}
			if (this.zip64 || directoryOffset + directoryDataLength >= 0xffffffff || filesLength >= 0xffff) {
				this.zip64 = true;
			}
			const directoryDataArray = new Uint8Array(directoryDataLength + (this.zip64 ? 98 : 22));
			const directoryDataView = new DataView(directoryDataArray.buffer);
			for (const [, file] of this.files) {
				const extraFieldLength = file.extraFieldZip64.length + file.extraFieldEncryption.length + file.rawExtraField.length;
				directoryDataView.setUint32(offset, 0x504b0102);
				if (file.zip64) {
					directoryDataView.setUint16(offset + 4, 0x2d00);
				} else {
					directoryDataView.setUint16(offset + 4, 0x1400);
				}
				directoryDataArray.set(file.headerArray, offset + 6);
				directoryDataView.setUint16(offset + 30, extraFieldLength, true);
				directoryDataView.setUint16(offset + 32, file.comment.length, true);
				if (file.directory) {
					directoryDataView.setUint8(offset + 38, 0x10);
				}
				if (file.zip64) {
					directoryDataView.setUint32(offset + 42, 0xffffffff, true);
				} else {
					directoryDataView.setUint32(offset + 42, file.offset, true);
				}
				directoryDataArray.set(file.filename, offset + 46);
				directoryDataArray.set(file.extraFieldZip64, offset + 46 + file.filename.length);
				directoryDataArray.set(file.extraFieldEncryption, offset + 46 + file.filename.length + file.extraFieldZip64.length);
				directoryDataArray.set(file.rawExtraField, 46 + file.filename.length + file.extraFieldZip64.length + file.extraFieldEncryption.length);
				directoryDataArray.set(file.comment, offset + 46 + file.filename.length + extraFieldLength);
				offset += 46 + file.filename.length + extraFieldLength + file.comment.length;
			}
			if (this.zip64) {
				directoryDataView.setUint32(offset, 0x504b0606);
				directoryDataView.setBigUint64(offset + 4, BigInt(44), true);
				directoryDataView.setUint16(offset + 12, 45, true);
				directoryDataView.setUint16(offset + 14, 45, true);
				directoryDataView.setBigUint64(offset + 24, BigInt(filesLength), true);
				directoryDataView.setBigUint64(offset + 32, BigInt(filesLength), true);
				directoryDataView.setBigUint64(offset + 40, BigInt(directoryDataLength), true);
				directoryDataView.setBigUint64(offset + 48, BigInt(directoryOffset), true);
				directoryDataView.setUint32(offset + 56, 0x504b0607);
				directoryDataView.setBigUint64(offset + 64, BigInt(directoryOffset + directoryDataLength), true);
				directoryDataView.setUint32(offset + 72, 1, true);
				filesLength = 0xffff;
				directoryOffset = 0xffffffff;
				offset += 76;
			}
			directoryDataView.setUint32(offset, 0x504b0506);
			directoryDataView.setUint16(offset + 8, filesLength, true);
			directoryDataView.setUint16(offset + 10, filesLength, true);
			directoryDataView.setUint32(offset + 12, directoryDataLength, true);
			directoryDataView.setUint32(offset + 16, directoryOffset, true);
			if (comment && comment.length) {
				if (comment.length <= 65536) {
					directoryDataView.setUint16(offset + 20, comment.length, true);
				} else {
					throw new Error(ERR_ZIP_FILE_COMMENT);
				}
			}
			await this.writer.writeUint8Array(directoryDataArray);
			if (comment && comment.length) {
				await this.writer.writeUint8Array(comment);
			}
			return this.writer.getData();
		}
	}

	async function createFileEntry(name, reader, writer, config, options) {
		const filename = getBytes(encodeUTF8(name));
		const date = options.lastModDate || new Date();
		const headerArray = new Uint8Array(26);
		const headerView = new DataView(headerArray.buffer);
		const outputPassword = options.password && options.password.length && options.password;
		const compressed = options.level !== 0 && !options.directory;
		const outputSigned = options.password === undefined || !options.password.length;
		const zip64 = (options.zip64 || Boolean(reader && reader.size >= 0xffffffff));
		const fileEntry = {
			zip64,
			headerArray: headerArray,
			directory: options.directory,
			filename: filename,
			comment: getBytes(encodeUTF8(options.comment || "")),
			extraFieldZip64: zip64 ? new Uint8Array(28) : new Uint8Array(0),
			extraFieldEncryption: outputPassword ? new Uint8Array([0x01, 0x99, 0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]) : new Uint8Array(0),
			rawExtraField: new Uint8Array(0)
		};	
		if (options.extraField) {
			let extraFieldSize = 4, offset = 0;
			options.extraField.forEach(data => extraFieldSize += data.length);
			fileEntry.rawExtraField = new Uint8Array(extraFieldSize);
			options.extraField.forEach((data, type) => {
				fileEntry.rawExtraField.set(new Uint16Array([type]), offset);
				fileEntry.rawExtraField.set(new Uint16Array([data.length]), offset + 2);
				fileEntry.rawExtraField.set(data, offset + 4);
				offset += 4 + data.length;
			});
		}
		options.generalPurposeBitFlag = 0x08;
		options.version = options.version || 0x14;
		options.generalPurposeBitFlag = 0x08;
		options.compressionMethod = 0;
		if (compressed) {
			options.compressionMethod = 0x08;
		}
		if (zip64) {
			options.version = options.version > 0x2D ? options.version : 0x2D;
		}
		if (outputPassword) {
			options.version = options.version > 0x33 ? options.version : 0x33;
			options.generalPurposeBitFlag = 0x09;
			options.compressionMethod = 0x63;
			if (compressed) {
				fileEntry.extraFieldEncryption[9] = 0x08;
			}
		}
		headerView.setUint16(0, options.version, true);
		headerView.setUint16(2, options.generalPurposeBitFlag, true);
		headerView.setUint16(4, options.compressionMethod, true);
		headerView.setUint16(6, (((date.getHours() << 6) | date.getMinutes()) << 5) | date.getSeconds() / 2, true);
		headerView.setUint16(8, ((((date.getFullYear() - 1980) << 4) | (date.getMonth() + 1)) << 5) | date.getDate(), true);
		headerView.setUint16(22, filename.length, true);
		const extraFieldLength = fileEntry.extraFieldZip64.length + fileEntry.extraFieldEncryption.length + fileEntry.rawExtraField.length;
		headerView.setUint16(24, extraFieldLength, true);
		const fileDataArray = new Uint8Array(30 + filename.length + extraFieldLength);
		const fileDataView = new DataView(fileDataArray.buffer);
		fileDataView.setUint32(0, 0x504b0304);
		fileDataArray.set(headerArray, 4);
		fileDataArray.set(filename, 30);
		fileDataArray.set(fileEntry.extraFieldZip64, 30 + filename.length);
		fileDataArray.set(fileEntry.extraFieldEncryption, 30 + filename.length + fileEntry.extraFieldZip64.length);
		fileDataArray.set(fileEntry.rawExtraField, 30 + filename.length + fileEntry.extraFieldZip64.length + fileEntry.extraFieldEncryption.length);
		await writer.writeUint8Array(fileDataArray);
		let result;
		if (reader) {
			await reader.init();
			const codec = await createCodec(config, {
				codecType: "deflate",
				level: options.level,
				outputPassword: options.password,
				outputSigned,
				outputCompressed: compressed,
				outputEncrypted: Boolean(options.password)
			});
			result = await processData(codec, reader, writer, 0, reader.size, config, { onprogress: options.onprogress });
			fileEntry.compressedSize = result.length;
		}
		const footerArray = new Uint8Array(zip64 ? 24 : 16);
		const footerView = new DataView(footerArray.buffer);
		footerView.setUint32(0, 0x504b0708);
		if (reader) {
			if (!outputPassword && result.signature !== undefined) {
				headerView.setUint32(10, result.signature, true);
				footerView.setUint32(4, result.signature, true);
			}
			if (zip64) {
				headerView.setUint32(14, 0xffffffff, true);
				footerView.setBigUint64(8, BigInt(fileEntry.compressedSize), true);
				headerView.setUint32(18, 0xffffffff, true);
				footerView.setBigUint64(16, BigInt(reader.size), true);
				const extraFieldZip64View = new DataView(fileEntry.extraFieldZip64.buffer);
				extraFieldZip64View.setUint16(0, 0x01, true);
				extraFieldZip64View.setUint16(2, 24, true);
				extraFieldZip64View.setBigUint64(4, BigInt(reader.size), true);
				extraFieldZip64View.setBigUint64(12, BigInt(fileEntry.compressedSize), true);
			} else {
				headerView.setUint32(14, fileEntry.compressedSize, true);
				footerView.setUint32(8, fileEntry.compressedSize, true);
				headerView.setUint32(18, reader.size, true);
				footerView.setUint32(12, reader.size, true);
			}
		}
		await writer.writeUint8Array(footerArray);
		fileEntry.length = fileDataArray.length + (result ? result.length : 0) + footerArray.length;
		return fileEntry;
	}

	function encodeUTF8(string) {
		return unescape(encodeURIComponent(string));
	}

	function getBytes(string) {
		const bytes = [];
		for (let indexString = 0; indexString < string.length; indexString++) {
			bytes.push(string.charCodeAt(indexString));
		}
		return bytes;
	}

	var asyncCodecShim = (library, options = {}) => {
		return {
			ZipDeflater: createCodecClass(library.Deflate, options.deflate),
			ZipInflater: createCodecClass(library.Inflate, options.inflate)
		};
	};

	function createCodecClass(constructor, constructorOptions) {
		return class {
			constructor(options) {
				const onData = data => {
					if (this.pendingData) {
						const pendingData = this.pendingData;
						this.pendingData = new Uint8Array(pendingData.length + data.length);
						this.pendingData.set(pendingData, 0);
						this.pendingData.set(data, pendingData.length);
					} else {
						this.pendingData = new Uint8Array(data);
					}
				};
				this.codec = new constructor(constructorOptions);
				if (typeof this.codec.onData == "function") {
					this.codec.onData = onData;
				} else if (typeof this.codec.on == "function") {
					this.codec.on("data", onData);
				} else if (options.registerCallbackFunction) {
					options.registerCallbackFunction(this.codec, onData);
				} else {
					throw new Error("Cannot register the callback function.");
				}
			}
			async append(data) {
				this.codec.push(data);
				return getResponse(this);
			}
			async flush() {
				this.codec.push(new Uint8Array(0), true);
				return getResponse(this);
			}
		};

		function getResponse(codec) {
			if (codec.pendingData) {
				const output = codec.pendingData;
				codec.pendingData = null;
				return output;
			} else {
				return new Uint8Array(0);
			}
		}
	}

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

	const DEFAULT_CONFIGURATION = {
		chunkSize: 512 * 1024,
		maxWorkers: (typeof navigator != "undefined" && navigator.hardwareConcurrency) || 2,
		workerScriptsPath: undefined,
		useWebWorkers: true
	};

	let config = Object.assign({}, DEFAULT_CONFIGURATION);

	class ZipReader$1 extends ZipReader {

		constructor(reader, options) {
			super(reader, options, config);
		}
	}

	class ZipWriter$1 extends ZipWriter {

		constructor(writer, options) {
			super(writer, options, config);
		}
	}

	function configure(configuration) {
		config = Object.assign({}, config, configuration);
	}

	function getMimeType() {
		return "application/octet-stream";
	}

	exports.BlobReader = BlobReader;
	exports.BlobWriter = BlobWriter;
	exports.Data64URIReader = Data64URIReader;
	exports.Data64URIWriter = Data64URIWriter;
	exports.HttpRangeReader = HttpRangeReader;
	exports.HttpReader = HttpReader;
	exports.Reader = Reader;
	exports.TextReader = TextReader;
	exports.TextWriter = TextWriter;
	exports.Uint8ArrayReader = Uint8ArrayReader;
	exports.Uint8ArrayWriter = Uint8ArrayWriter;
	exports.Writer = Writer;
	exports.ZipReader = ZipReader$1;
	exports.ZipWriter = ZipWriter$1;
	exports.configure = configure;
	exports.getMimeType = getMimeType;
	exports.initShimAsyncCodec = asyncCodecShim;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
