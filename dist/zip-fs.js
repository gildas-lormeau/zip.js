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
	const ERR_HTTP_RANGE = "HTTP Range not supported";
	const TEXT_PLAIN = "text/plain";

	class Stream {

		constructor() {
			this.size = 0;
		}

		init() {
			this.initialized = true;
		}
	}
	class Reader extends Stream {
	}

	class Writer extends Stream {

		writeUint8Array(array) {
			this.size += array.length;
		}
	}

	class TextReader extends Reader {

		constructor(text) {
			super();
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
			super.writeUint8Array(array);
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
			let dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=") {
				dataEnd--;
			}
			this.dataStart = dataURI.indexOf(",") + 1;
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
			super.writeUint8Array(array);
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
			super.writeUint8Array(array);
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
			this.size = array.length;
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
			super.writeUint8Array(array);
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

	const MAX_32_BITS = 0xffffffff;
	const MAX_16_BITS = 0xffff;
	const COMPRESSION_METHOD_DEFLATE = 0x08;
	const COMPRESSION_METHOD_STORE = 0x00;
	const COMPRESSION_METHOD_AES = 0x63;

	const LOCAL_FILE_HEADER_SIGNATURE = 0x504b0304;
	const DATA_DESCRIPTOR_RECORD_SIGNATURE = 0x504b0708;
	const CENTRAL_FILE_HEADER_SIGNATURE = 0x504b0102;
	const END_OF_CENTRAL_DIR_SIGNATURE = 0x504b0506;
	const ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 0x504b0606;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 0x504b0607;
	const END_OF_CENTRAL_DIR_LENGTH = 22;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH = 20;
	const ZIP64_END_OF_CENTRAL_DIR_LENGTH = 56;
	const ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH = END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LENGTH;

	const EXTRA_FIELD_TYPE_ZIP64 = 0x0001;
	const EXTRA_FIELD_TYPE_AES = 0x9901;
	const EXTRA_FIELD_TYPE_UNICODE_PATH = 0x7075;
	const EXTRA_FIELD_TYPE_UNICODE_COMMENT = 0x6375;

	const BITFLAG_ENCRYPTED = 0x01;
	const BITFLAG_LEVEL = 0x06;
	const BITFLAG_DATA_DESCRIPTOR = 0x0008;
	const BITFLAG_ENHANCED_DEFLATING = 0x0010;
	const BITFLAG_LANG_ENCODING_FLAG = 0x0800;
	const FILE_ATTR_MSDOS_DIR_MASK = 0x10;

	const VERSION_DEFLATE = 0x14;
	const VERSION_ZIP64 = 0x2D;
	const VERSION_AES = 0x33;

	const DIRECTORY_SIGNATURE = "/";

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

	const ERR_INVALID_PASSORD = "Invalid pasword";
	const BLOCK_LENGTH = 16;
	const RAW_FORMAT = "raw";
	const PBKDF2_ALGORITHM = { name: "PBKDF2" };
	const SIGNATURE_ALGORITHM = { name: "HMAC" };
	const HASH_FUNCTION = "SHA-1";
	const CRYPTO_KEY_ALGORITHM = { name: "AES-CTR" };
	const BASE_KEY_ALGORITHM = Object.assign({ hash: SIGNATURE_ALGORITHM }, PBKDF2_ALGORITHM);
	const DERIVED_BITS_ALGORITHM = Object.assign({ iterations: 1000, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);
	const AUTHENTICATION_ALGORITHM = Object.assign({ hash: HASH_FUNCTION }, SIGNATURE_ALGORITHM);
	const CRYPTO_ALGORITHM = Object.assign({ length: BLOCK_LENGTH }, CRYPTO_KEY_ALGORITHM);
	const DERIVED_BITS_USAGE = ["deriveBits"];
	const SIGN_USAGE = ["sign"];
	const DERIVED_BITS_LENGTH = 528;
	const PREAMBULE_LENGTH = 18;
	const SIGNATURE_LENGTH = 10;
	const COUNTER_DEFAULT_VALUE = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	const subtle = crypto.subtle;

	class ZipDecrypt {

		constructor(password, signed) {
			this.password = password;
			this.signed = signed;
			this.input = signed && new Uint8Array(0);
			this.pendingInput = new Uint8Array(0);
		}

		async append(input) {
			const decrypt = async (offset = 0) => {
				if (offset + BLOCK_LENGTH <= buferredInput.length - SIGNATURE_LENGTH) {
					const chunkToDecrypt = buferredInput.subarray(offset, offset + BLOCK_LENGTH);
					const outputChunk = await subtle.decrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), this.keys.decrypt, chunkToDecrypt);
					incrementCounter(this.counter);
					output.set(new Uint8Array(outputChunk), offset);
					return decrypt(offset + BLOCK_LENGTH);
				} else {
					this.pendingInput = buferredInput.subarray(offset);
					if (this.signed) {
						this.input = concat(this.input, input);
					}
					return output;
				}
			};

			if (this.password) {
				const preambule = input.subarray(0, PREAMBULE_LENGTH);
				await createDecryptionKeys(this, preambule, this.password);
				this.password = null;
				input = input.subarray(PREAMBULE_LENGTH);
			}
			let output = new Uint8Array(input.length - SIGNATURE_LENGTH - ((input.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
			let buferredInput = input;
			if (this.pendingInput.length) {
				buferredInput = concat(this.pendingInput, input);
				output = expand(output, buferredInput.length - SIGNATURE_LENGTH - ((buferredInput.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
			}
			return decrypt();
		}

		async flush() {
			const pendingInput = this.pendingInput;
			const keys = this.keys;
			const chunkToDecrypt = pendingInput.subarray(0, pendingInput.length - SIGNATURE_LENGTH);
			const originalSignatureArray = pendingInput.subarray(pendingInput.length - SIGNATURE_LENGTH);
			let decryptedChunkArray = new Uint8Array(0);
			if (chunkToDecrypt.length) {
				const decryptedChunk = await subtle.decrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), keys.decrypt, chunkToDecrypt);
				decryptedChunkArray = new Uint8Array(decryptedChunk);
			}
			let valid = true;
			if (this.signed) {
				const signature = await subtle.sign(SIGNATURE_ALGORITHM, keys.authentication, this.input.subarray(0, this.input.length - SIGNATURE_LENGTH));
				const signatureArray = new Uint8Array(signature);
				this.input = null;
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

	class ZipEncrypt {

		constructor(password) {
			this.password = password;
			this.output = new Uint8Array(0);
			this.pendingInput = new Uint8Array(0);
		}

		async append(input) {
			const encrypt = async (offset = 0) => {
				if (offset + BLOCK_LENGTH <= input.length) {
					const chunkToEncrypt = input.subarray(offset, offset + BLOCK_LENGTH);
					const outputChunk = await subtle.encrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), this.keys.encrypt, chunkToEncrypt);
					incrementCounter(this.counter);
					output.set(new Uint8Array(outputChunk), offset + preambule.length);
					return encrypt(offset + BLOCK_LENGTH);
				} else {
					this.pendingInput = input.subarray(offset);
					this.output = concat(this.output, output);
					return output;
				}
			};

			let preambule = new Uint8Array(0);
			if (this.password) {
				preambule = await createEncryptionKeys(this, this.password);
				this.password = null;
			}
			let output = new Uint8Array(preambule.length + input.length - (input.length % BLOCK_LENGTH));
			output.set(preambule, 0);
			if (this.pendingInput.length) {
				input = concat(this.pendingInput, input);
				output = expand(output, input.length - (input.length % BLOCK_LENGTH));
			}
			return encrypt();
		}

		async flush() {
			let encryptedChunkArray = new Uint8Array(0);
			if (this.pendingInput.length) {
				const encryptedChunk = await subtle.encrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), this.keys.encrypt, this.pendingInput);
				encryptedChunkArray = new Uint8Array(encryptedChunk);
				this.output = concat(this.output, encryptedChunkArray);
			}
			const signature = await subtle.sign(SIGNATURE_ALGORITHM, this.keys.authentication, this.output.subarray(PREAMBULE_LENGTH));
			this.output = null;
			const signatureArray = new Uint8Array(signature).subarray(0, SIGNATURE_LENGTH);
			return {
				data: concat(encryptedChunkArray, signatureArray),
				signature: signatureArray
			};
		}
	}

	async function createDecryptionKeys(decrypt, preambuleArray, password) {
		decrypt.counter = new Uint8Array(COUNTER_DEFAULT_VALUE);
		const salt = preambuleArray.subarray(0, 16);
		const passwordVerification = preambuleArray.subarray(16);
		const encodedPassword = (new TextEncoder()).encode(password);
		const basekey = await subtle.importKey(RAW_FORMAT, encodedPassword, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
		const derivedBits = await subtle.deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), basekey, DERIVED_BITS_LENGTH);
		const compositeKey = new Uint8Array(derivedBits);
		const passwordVerificationKey = compositeKey.subarray(64);
		decrypt.keys = {
			decrypt: await subtle.importKey(RAW_FORMAT, compositeKey.subarray(0, 32), CRYPTO_KEY_ALGORITHM, true, ["decrypt"]),
			authentication: await subtle.importKey(RAW_FORMAT, compositeKey.subarray(32, 64), AUTHENTICATION_ALGORITHM, false, SIGN_USAGE),
			passwordVerification: passwordVerificationKey
		};
		if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
			throw new Error(ERR_INVALID_PASSORD);
		}
	}

	async function createEncryptionKeys(encrypt, password) {
		encrypt.counter = new Uint8Array(COUNTER_DEFAULT_VALUE);
		const salt = crypto.getRandomValues(new Uint8Array(16));
		const encodedPassword = (new TextEncoder()).encode(password);
		const basekey = await subtle.importKey(RAW_FORMAT, encodedPassword, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
		const derivedBits = await subtle.deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), basekey, DERIVED_BITS_LENGTH);
		const compositeKey = new Uint8Array(derivedBits);
		encrypt.keys = {
			encrypt: await subtle.importKey(RAW_FORMAT, compositeKey.subarray(0, 32), CRYPTO_KEY_ALGORITHM, true, ["encrypt"]),
			authentication: await subtle.importKey(RAW_FORMAT, compositeKey.subarray(32, 64), AUTHENTICATION_ALGORITHM, false, SIGN_USAGE),
			passwordVerification: compositeKey.subarray(64)
		};
		return concat(salt, encrypt.keys.passwordVerification);
	}

	function incrementCounter(counter) {
		for (let indexCounter = 0; indexCounter < 16; indexCounter++) {
			if (counter[indexCounter] == 255) {
				counter[indexCounter] = 0;
			} else {
				counter[indexCounter]++;
				break;
			}
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

	const CODEC_DEFLATE = "deflate";
	const CODEC_INFLATE = "inflate";
	const ERR_INVALID_SIGNATURE = "Invalid signature";

	class Inflate {

		constructor(options) {
			this.signature = options.inputSignature;
			this.encrypted = Boolean(options.inputPassword);
			this.signed = options.inputSigned;
			this.compressed = options.inputCompressed;
			this.inflate = this.compressed && new ZipInflate();
			this.crc32 = this.signed && this.signed && new Crc32();
			this.decrypt = this.encrypted && new ZipDecrypt(options.inputPassword);
		}

		async append(data) {
			if (this.encrypted) {
				data = await this.decrypt.append(data);
			}
			if (this.compressed && data.length) {
				data = await this.inflate.append(data);
			}
			if (!this.encrypted && this.signed) {
				this.crc32.append(data);
			}
			return data;
		}

		async flush() {
			let signature, data = new Uint8Array(0);
			if (this.encrypted) {
				const result = await this.decrypt.flush();
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
				data = (await this.inflate.append(data)) || new Uint8Array(0);
				await this.inflate.flush();
			}
			return { data, signature };
		}
	}

	class Deflate {

		constructor(options) {
			this.encrypted = options.outputEncrypted;
			this.signed = options.outputSigned;
			this.compressed = options.outputCompressed;
			this.deflate = this.compressed && new ZipDeflate({ level: options.level || 5 });
			this.crc32 = this.signed && new Crc32();
			this.encrypt = this.encrypted && new ZipEncrypt(options.outputPassword);
		}

		async append(inputData) {
			let data = inputData;
			if (this.compressed && inputData.length) {
				data = await this.deflate.append(inputData);
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
				data = (await this.deflate.flush()) || new Uint8Array(0);
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

	function createCodec(options) {
		if (options.codecType.startsWith(CODEC_DEFLATE)) {
			return new Deflate(options);
		} else if (options.codecType.startsWith(CODEC_INFLATE)) {
			return new Inflate(options);
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

	const MESSAGE_INIT = "init";
	const MESSAGE_APPEND = "append";
	const MESSAGE_FLUSH = "flush";
	const MESSAGE_EVENT_TYPE = "message";

	const Z_WORKER_SCRIPT_PATH = "z-worker.js";
	const DEFAULT_WORKER_SCRIPTS = {
		deflate: [Z_WORKER_SCRIPT_PATH, "deflate.js"],
		inflate: [Z_WORKER_SCRIPT_PATH, "inflate.js"]
	};
	const workers = {
		pool: [],
		pendingRequests: []
	};

	function createWorkerCodec(config, options) {
		const pool = workers.pool;
		const streamCopy =
			!options.inputCompressed && !options.inputSigned && !options.inputEncrypted &&
			!options.outputCompressed && !options.outputSigned && !options.outputEncrypted;
		let scripts;
		if (options.useWebWorkers || (options.useWebWorkers === undefined && config.useWebWorkers && !streamCopy)) {
			const codecType = options.codecType;
			if (config.workerScripts != null && config.workerScriptsPath != null) {
				throw new Error("Either workerScripts or workerScriptsPath may be set, not both");
			}
			if (config.workerScripts) {
				scripts = config.workerScripts[codecType];
				if (!Array.isArray(scripts)) {
					throw new Error("workerScripts." + codecType + " must be an array");
				}
				scripts = resolveURLs(scripts);
			} else {
				scripts = DEFAULT_WORKER_SCRIPTS[codecType].slice(0);
				scripts[0] = (config.workerScriptsPath || "") + scripts[0];
			}
		}
		if (pool.length < config.maxWorkers) {
			const workerData = { busy: true, options, scripts };
			pool.push(workerData);
			return scripts ? createWebWorkerInterface(workerData) : createWorkerInterface(workerData);
		} else {
			const workerData = pool.find(workerData => !workerData.busy);
			if (workerData) {
				return getWorkerInterface(workerData);
			} else {
				return new Promise(resolve => workers.pendingRequests.push({ resolve, options, scripts }));
			}
		}
	}

	function getWorkerInterface(workerData, options, scripts) {
		workerData.busy = true;
		workerData.options = options;
		workerData.scripts = scripts;
		return scripts ? createWebWorkerInterface(workerData) : createWorkerInterface(workerData);
	}

	function createWorkerInterface(workerData) {
		const interfaceCodec = createCodec(workerData.options);
		const append = interfaceCodec.append.bind(interfaceCodec);
		const flush = interfaceCodec.flush.bind(interfaceCodec);
		interfaceCodec.append = async data => {
			try {
				return await append(data);
			} catch (error) {
				onTaskFinished(workerData);
				throw error;
			}
		};
		interfaceCodec.flush = async () => {
			try {
				return await flush();
			} finally {
				onTaskFinished(workerData);
			}
		};
		return interfaceCodec;
	}

	function createWebWorkerInterface(workerData) {
		let task;
		if (!workerData.interface) {
			workerData.worker = new Worker(workerData.scripts[0]);
			workerData.worker.addEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
			workerData.interface = {
				append(data) {
					return initAndSendMessage({ type: MESSAGE_APPEND, data });
				},
				flush() {
					return initAndSendMessage({ type: MESSAGE_FLUSH });
				}
			};
		}
		return workerData.interface;

		async function initAndSendMessage(message) {
			if (!task) {
				const scripts = workerData.scripts.slice(1);
				await sendMessage(Object.assign({ type: MESSAGE_INIT, options: workerData.options, scripts }));
			}
			return sendMessage(message);
		}

		function sendMessage(message) {
			const worker = workerData.worker;
			const result = new Promise((resolve, reject) => task = { resolve, reject });
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
				task = null;
				onTaskFinished(workerData);
			}
			return result;
		}

		function onMessage(event) {
			const message = event.data;
			if (task) {
				const reponseError = message.error;
				if (reponseError) {
					const error = new Error(reponseError.message);
					error.stack = reponseError.stack;
					task.reject(error);
					task = null;
					onTaskFinished(workerData);
				} else if (message.type == MESSAGE_INIT || message.type == MESSAGE_FLUSH || message.type == MESSAGE_APPEND) {
					if (message.type == MESSAGE_FLUSH) {
						task.resolve({ data: new Uint8Array(message.data), signature: message.signature });
						task = null;
						onTaskFinished(workerData);
					} else {
						task.resolve(message.data && new Uint8Array(message.data));
					}
				}
			}
		}
	}

	function onTaskFinished(workerData) {
		workerData.busy = false;
		if (workers.pendingRequests.length) {
			const [{ resolve, options, scripts }] = workers.pendingRequests.splice(0, 1);
			resolve(getWorkerInterface(workerData, options, scripts));
		} else {
			if (workerData.worker) {
				workerData.worker.terminate();
			}
			workers.pool = workers.pool.filter(data => data != workerData);
		}
	}

	function resolveURLs(urls) {
		if (typeof document != "undefined") {
			return urls.map(url => new URL(url, document.baseURI).href);
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

	const ERR_BAD_FORMAT = "File format is not recognized";
	const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
	const ERR_EOCDR_ZIP64_NOT_FOUND = "End of Zip64 central directory not found";
	const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
	const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
	const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
	const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
	const ERR_ENCRYPTED = "File contains encrypted entry";
	const ERR_UNSUPPORTED_ENCRYPTION = "Encryption not supported";
	const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
	const CHARSET_UTF8 = "utf-8";
	const CHARSET_WIN_1252 = "windows-1252";
	const ZIP64_PROPERTIES = ["uncompressedSize", "compressedSize", "offset"];

	class ZipReader {

		constructor(reader, options = {}, config = {}) {
			this.reader = reader;
			this.options = options;
			this.config = config;
		}

		async getEntries() {
			const reader = this.reader;
			if (!reader.initialized) {
				await reader.init();
			}
			const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS);
			if (!endOfDirectoryInfo) {
				throw new Error(ERR_EOCDR_NOT_FOUND);
			}
			const endOfDirectoryView = new DataView(endOfDirectoryInfo.buffer);
			let zip64;
			let directoryDataOffset = endOfDirectoryView.getUint32(16, true);
			let filesLength = endOfDirectoryView.getUint16(8, true);
			if (directoryDataOffset == MAX_32_BITS || filesLength == MAX_16_BITS) {
				zip64 = true;
				const endOfDirectoryLocatorArray = await reader.readUint8Array(endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);
				const endOfDirectoryLocatorView = new DataView(endOfDirectoryLocatorArray.buffer);
				if (Number(endOfDirectoryLocatorView.getUint32(0, false)) != ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
					throw new Error(ERR_EOCDR_ZIP64_NOT_FOUND);
				}
				directoryDataOffset = Number(endOfDirectoryLocatorView.getBigUint64(8, true));
				const endOfDirectoryArray = await reader.readUint8Array(directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
				const endOfDirectoryView = new DataView(endOfDirectoryArray.buffer);
				if (Number(endOfDirectoryView.getUint32(0, false)) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
					throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
				}
				filesLength = Number(endOfDirectoryView.getBigUint64(24, true));
				directoryDataOffset -= Number(endOfDirectoryView.getBigUint64(40, true));
			}
			if (directoryDataOffset < 0 || (!zip64 && (directoryDataOffset >= reader.size || filesLength >= MAX_16_BITS))) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const directoryArray = await reader.readUint8Array(directoryDataOffset, reader.size - directoryDataOffset);
			const directoryView = new DataView(directoryArray.buffer);
			const entries = [];
			let offset = 0;
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const fileEntry = new Entry(this.reader, this.config, this.options);
				if (directoryView.getUint32(offset, false) != CENTRAL_FILE_HEADER_SIGNATURE) {
					throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
				}
				fileEntry.compressedSize = 0;
				fileEntry.uncompressedSize = 0;
				readCommonHeader(fileEntry, directoryView, offset + 6);
				fileEntry.commentLength = directoryView.getUint16(offset + 32, true);
				fileEntry.directory = ((directoryView.getUint8(offset + 38) & FILE_ATTR_MSDOS_DIR_MASK) == FILE_ATTR_MSDOS_DIR_MASK);
				fileEntry.offset = directoryView.getUint32(offset + 42, true);
				fileEntry.rawFilename = directoryArray.subarray(offset + 46, offset + 46 + fileEntry.filenameLength);
				fileEntry.filename = decodeString(fileEntry.rawFilename, fileEntry.bitFlag.languageEncodingFlag ? CHARSET_UTF8 : this.options.filenameEncoding || CHARSET_WIN_1252);
				if (!fileEntry.directory && fileEntry.filename && fileEntry.filename.charAt(fileEntry.filename.length - 1) == DIRECTORY_SIGNATURE) {
					fileEntry.directory = true;
				}
				fileEntry.rawExtraField = directoryArray.subarray(offset + 46 + fileEntry.filenameLength, offset + 46 + fileEntry.filenameLength + fileEntry.extraFieldLength);
				readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
				fileEntry.rawComment = directoryArray.subarray(offset + 46 + fileEntry.filenameLength + fileEntry.extraFieldLength, offset + 46
					+ fileEntry.filenameLength + fileEntry.extraFieldLength + fileEntry.commentLength);
				fileEntry.comment = decodeString(fileEntry.rawComment, fileEntry.bitFlag.languageEncodingFlag ? CHARSET_UTF8 : this.options.commentEncoding || CHARSET_WIN_1252);
				entries.push(fileEntry);
				offset += 46 + fileEntry.filenameLength + fileEntry.extraFieldLength + fileEntry.commentLength;
			}
			return entries;
		}

		async close() {
		}
	}

	class Entry {

		constructor(reader, config, options) {
			this.reader = reader;
			this.config = config;
			this.options = options;
		}

		async getData(writer, options = {}) {
			const reader = this.reader;
			if (!reader.initialized) {
				await reader.init();
			}
			const dataArray = await reader.readUint8Array(this.offset, 30);
			const dataView = new DataView(dataArray.buffer);
			const password = options.password === undefined ? this.options.password : options.password;
			let inputPassword = password && password.length && password;
			if (this.extraFieldAES) {
				if (this.extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
					throw new Error(ERR_UNSUPPORTED_COMPRESSION);
				}
				if (this.extraFieldAES.strength != 3) {
					throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
				}
			}
			if (this.compressionMethod != COMPRESSION_METHOD_STORE && this.compressionMethod != COMPRESSION_METHOD_DEFLATE) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
			if (dataView.getUint32(0, false) != LOCAL_FILE_HEADER_SIGNATURE) {
				throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
			}
			const localDirectory = this.localDirectory = {};
			readCommonHeader(localDirectory, dataView, 4);
			localDirectory.rawExtraField = dataArray.subarray(this.offset + 30 + localDirectory.filenameLength, this.offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength);
			readCommonFooter(this, localDirectory, dataView, 4);
			let dataOffset = this.offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength;
			const inputEncrypted = this.bitFlag.encrypted && localDirectory.bitFlag.encrypted;
			if (inputEncrypted && !inputPassword) {
				throw new Error(ERR_ENCRYPTED);
			}
			const codec = await createWorkerCodec(this.config, {
				codecType: CODEC_INFLATE,
				inputPassword,
				inputSigned: options.checkSignature === undefined ? this.options.checkSignature : options.checkSignature,
				inputSignature: this.signature,
				inputCompressed: this.compressionMethod != 0,
				inputEncrypted,
				useWebWorkers: options.useWebWorkers === undefined ? this.options.useWebWorkers : options.useWebWorkers
			});
			if (!writer.initialized) {
				await writer.init();
			}
			await processData(codec, reader, writer, dataOffset, this.compressedSize, this.config, { onprogress: options.onprogress });
			return writer.getData();
		}
	}

	function readCommonHeader(directory, dataView, offset) {
		directory.version = dataView.getUint16(offset, true);
		const rawBitFlag = directory.rawBitFlag = dataView.getUint16(offset + 2, true);
		directory.bitFlag = {
			encrypted: (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED,
			level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
			dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
			languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
		};
		directory.encrypted = directory.bitFlag.encrypted;
		directory.rawLastModDate = dataView.getUint32(offset + 6, true);
		directory.lastModDate = getDate(directory.rawLastModDate);
		directory.filenameLength = dataView.getUint16(offset + 22, true);
		directory.extraFieldLength = dataView.getUint16(offset + 24, true);
	}

	function readCommonFooter(fileEntry, directory, dataView, offset) {
		const rawExtraField = directory.rawExtraField;
		const extraField = directory.extraField = new Map();
		const rawExtraFieldView = new DataView(new Uint8Array(rawExtraField).buffer);
		let offsetExtraField = 0;
		try {
			while (offsetExtraField < rawExtraField.length) {
				const type = rawExtraFieldView.getUint16(offsetExtraField, true);
				const size = rawExtraFieldView.getUint16(offsetExtraField + 2, true);
				extraField.set(type, {
					type,
					data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
				});
				offsetExtraField += 4 + size;
			}
		} catch (error) {
			// ignored
		}
		const compressionMethod = dataView.getUint16(offset + 4, true);
		directory.signature = dataView.getUint32(offset + 10, true);
		directory.uncompressedSize = dataView.getUint32(offset + 18, true);
		directory.compressedSize = dataView.getUint32(offset + 14, true);
		const extraFieldZip64 = directory.extraFieldZip64 = extraField.get(EXTRA_FIELD_TYPE_ZIP64);
		if (extraFieldZip64) {
			readExtraFieldZip64(extraFieldZip64, directory);
		}
		const extraFieldUnicodePath = directory.extraFieldUnicodePath = extraField.get(EXTRA_FIELD_TYPE_UNICODE_PATH);
		if (extraFieldUnicodePath) {
			readExtraFieldUnicode(extraFieldUnicodePath, "filename", "rawFilename", directory, fileEntry);
		}
		let extraFieldUnicodeComment = directory.extraFieldUnicodeComment = extraField.get(EXTRA_FIELD_TYPE_UNICODE_COMMENT);
		if (extraFieldUnicodeComment) {
			readExtraFieldUnicode(extraFieldUnicodeComment, "comment", "rawComment", directory, fileEntry);
		}
		const extraFieldAES = directory.extraFieldAES = extraField.get(EXTRA_FIELD_TYPE_AES);
		if (extraFieldAES) {
			readExtraFieldAES(extraFieldAES, directory, compressionMethod);
		} else {
			directory.compressionMethod = compressionMethod;
		}
		if (directory.compressionMethod == COMPRESSION_METHOD_DEFLATE) {
			directory.bitFlag.enhancedDeflating = (directory.rawBitFlag & BITFLAG_ENHANCED_DEFLATING) != BITFLAG_ENHANCED_DEFLATING;
		}
	}

	function readExtraFieldZip64(extraFieldZip64, directory) {
		directory.zip64 = true;
		const extraFieldView = new DataView(extraFieldZip64.data.buffer);
		extraFieldZip64.values = [];
		for (let indexValue = 0; indexValue < Math.floor(extraFieldZip64.data.length / 8); indexValue++) {
			extraFieldZip64.values.push(Number(extraFieldView.getBigUint64(0 + indexValue * 8, true)));
		}
		const missingProperties = ZIP64_PROPERTIES.filter(propertyName => directory[propertyName] == MAX_32_BITS);
		for (let indexMissingProperty = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
			extraFieldZip64[missingProperties[indexMissingProperty]] = extraFieldZip64.values[indexMissingProperty];
		}
		ZIP64_PROPERTIES.forEach(propertyName => {
			if (directory[propertyName] == MAX_32_BITS) {
				if (extraFieldZip64 && extraFieldZip64[propertyName] !== undefined) {
					directory[propertyName] = extraFieldZip64 && extraFieldZip64[propertyName];
				} else {
					throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
				}
			}
		});
	}

	function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
		const extraFieldView = new DataView(extraFieldUnicode.data.buffer);
		extraFieldUnicode.version = extraFieldView.getUint8(0);
		extraFieldUnicode.signature = extraFieldView.getUint32(1, true);
		const crc32 = new Crc32();
		crc32.append(fileEntry[rawPropertyName]);
		const dataViewSignature = new DataView(new Uint8Array(4).buffer);
		dataViewSignature.setUint32(0, crc32.get());
		extraFieldUnicode[propertyName] = (new TextDecoder()).decode(extraFieldUnicode.data.subarray(5));
		if (extraFieldUnicode.signature == dataViewSignature.getUint32(0, false)) {
			directory[propertyName] = extraFieldUnicode[propertyName];
		}
	}

	function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
		if (extraFieldAES) {
			const extraFieldView = new DataView(extraFieldAES.data.buffer);
			extraFieldAES.vendorVersion = extraFieldView.getUint8(0);
			extraFieldAES.vendorId = extraFieldView.getUint8(2);
			const strength = extraFieldView.getUint8(4);
			extraFieldAES.strength = strength;
			extraFieldAES.originalCompressionMethod = compressionMethod;
			directory.compressionMethod = extraFieldAES.compressionMethod = extraFieldView.getUint16(5, true);
		} else {
			directory.compressionMethod = compressionMethod;
		}
	}

	async function seekSignature(reader, signature, minimumBytes, maximumLength) {
		const signatureArray = new Uint8Array(4);
		const signatureView = new DataView(signatureArray.buffer);
		signatureView.setUint32(0, signature);
		if (reader.size < minimumBytes) {
			throw new Error(ERR_BAD_FORMAT);
		}
		const maximumBytes = minimumBytes + maximumLength;
		let offset = minimumBytes;
		let dataInfo = await seek(offset);
		if (!dataInfo) {
			dataInfo = await seek(Math.min(maximumBytes, reader.size));
		}
		return dataInfo;

		async function seek(length) {
			const offset = reader.size - length;
			const bytes = await reader.readUint8Array(offset, length);
			for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) {
				if (bytes[indexByte] == signatureArray[0] && bytes[indexByte + 1] == signatureArray[1] &&
					bytes[indexByte + 2] == signatureArray[2] && bytes[indexByte + 3] == signatureArray[3]) {
					return {
						offset,
						buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
					};
				}
			}
		}
	}

	function decodeString(value, encoding) {
		return (new TextDecoder(encoding)).decode(value);
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

	const ERR_DUPLICATED_NAME = "File already exists";
	const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
	const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
	const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
	const ERR_INVALID_VERSION = "Version exceeds 65535";
	const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
	const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";

	const EXTRAFIELD_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);

	class ZipWriter {

		constructor(writer, options = {}, config = {}) {
			this.writer = writer;
			this.options = options;
			this.config = config;
			this.files = new Map();
			this.offset = writer.size;
			this.zip64 = options.zip64;
		}

		async add(name = "", reader, options = {}) {
			name = name.trim();
			if (options.directory && (!name.length || name.charAt(name.length - 1) != DIRECTORY_SIGNATURE)) {
				name += DIRECTORY_SIGNATURE;
			}
			if (this.files.has(name)) {
				throw new Error(ERR_DUPLICATED_NAME);
			}
			options.comment = getBytes(encodeUTF8(options.comment || ""));
			if (options.comment.length > MAX_16_BITS) {
				throw new Error(ERR_INVALID_ENTRY_COMMENT);
			}
			options.zip64 = options.zip64 || this.zip64;
			await addFile(this, name, reader, options);
		}

		async close(comment) {
			const writer = this.writer;
			const files = this.files;
			let offset = 0, directoryDataLength = 0, directoryOffset = this.offset, filesLength = files.size;
			if (comment && comment.length) {
				if (comment.length <= MAX_16_BITS) {
					directoryView.setUint16(offset + 20, comment.length, true);
				} else {
					throw new Error(ERR_INVALID_COMMENT);
				}
			}
			for (const [, fileEntry] of files) {
				directoryDataLength += 46 + fileEntry.filename.length + fileEntry.comment.length + fileEntry.extraFieldZip64.length + fileEntry.extraFieldAES.length + fileEntry.rawExtraField.length;
			}
			if (directoryOffset + directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS) {
				this.zip64 = true;
			}
			const directoryArray = new Uint8Array(directoryDataLength + (this.zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH));
			const directoryView = new DataView(directoryArray.buffer);
			this.options.version = this.options.version || VERSION_DEFLATE;
			for (const [, fileEntry] of files) {
				const filename = fileEntry.filename;
				const extraFieldZip64 = fileEntry.extraFieldZip64;
				const extraFieldAES = fileEntry.extraFieldAES;
				const extraFieldLength = extraFieldZip64.length + extraFieldAES.length + fileEntry.rawExtraField.length;
				directoryView.setUint32(offset, CENTRAL_FILE_HEADER_SIGNATURE);
				if (fileEntry.zip64) {
					directoryView.setUint16(offset + 4, this.options.version > VERSION_ZIP64 ? this.options : VERSION_ZIP64, true);
				} if (fileEntry.encrypted) {
					directoryView.setUint16(offset + 4, this.options.version > VERSION_AES ? this.options : VERSION_AES, true);
				} else {
					directoryView.setUint16(offset + 4, this.options.version > VERSION_DEFLATE ? this.options : VERSION_DEFLATE, true);
				}
				directoryArray.set(fileEntry.headerArray, offset + 6);
				directoryView.setUint16(offset + 30, extraFieldLength, true);
				directoryView.setUint16(offset + 32, fileEntry.comment.length, true);
				if (fileEntry.directory) {
					directoryView.setUint8(offset + 38, FILE_ATTR_MSDOS_DIR_MASK);
				}
				if (fileEntry.zip64) {
					directoryView.setUint32(offset + 42, MAX_32_BITS, true);
				} else {
					directoryView.setUint32(offset + 42, fileEntry.offset, true);
				}
				directoryArray.set(filename, offset + 46);
				directoryArray.set(extraFieldZip64, offset + 46 + filename.length);
				directoryArray.set(extraFieldAES, offset + 46 + filename.length + extraFieldZip64.length);
				directoryArray.set(fileEntry.rawExtraField, 46 + filename.length + extraFieldZip64.length + extraFieldAES.length);
				directoryArray.set(fileEntry.comment, offset + 46 + filename.length + extraFieldLength);
				offset += 46 + filename.length + extraFieldLength + fileEntry.comment.length;
			}
			if (this.zip64) {
				directoryView.setUint32(offset, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
				directoryView.setBigUint64(offset + 4, BigInt(44), true);
				directoryView.setUint16(offset + 12, 45, true);
				directoryView.setUint16(offset + 14, 45, true);
				directoryView.setBigUint64(offset + 24, BigInt(filesLength), true);
				directoryView.setBigUint64(offset + 32, BigInt(filesLength), true);
				directoryView.setBigUint64(offset + 40, BigInt(directoryDataLength), true);
				directoryView.setBigUint64(offset + 48, BigInt(directoryOffset), true);
				directoryView.setUint32(offset + 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
				directoryView.setBigUint64(offset + 64, BigInt(directoryOffset + directoryDataLength), true);
				directoryView.setUint32(offset + 72, 1, true);
				filesLength = MAX_16_BITS;
				directoryOffset = MAX_32_BITS;
				offset += 76;
			}
			directoryView.setUint32(offset, END_OF_CENTRAL_DIR_SIGNATURE);
			directoryView.setUint16(offset + 8, filesLength, true);
			directoryView.setUint16(offset + 10, filesLength, true);
			directoryView.setUint32(offset + 12, directoryDataLength, true);
			directoryView.setUint32(offset + 16, directoryOffset, true);
			await writer.writeUint8Array(directoryArray);
			if (comment && comment.length) {
				await writer.writeUint8Array(comment);
			}
			return writer.getData();
		}
	}

	async function addFile(zipWriter, name, reader, options) {
		const files = zipWriter.files, writer = zipWriter.writer;
		files.set(name, null);
		let resolveLockWrite;
		try {
			let fileWriter, fileEntry;
			try {
				if (options.bufferedWrite || zipWriter.options.bufferedWrite || zipWriter.lockWrite) {
					fileWriter = new Uint8ArrayWriter();
					fileWriter.init();
				} else {
					zipWriter.lockWrite = new Promise(resolve => resolveLockWrite = resolve);
					if (!writer.initialized) {
						await writer.init();
					}
					fileWriter = writer;
				}
				if (zipWriter.offset >= MAX_32_BITS || (reader && (reader.size >= MAX_32_BITS || zipWriter.offset + reader.size >= MAX_32_BITS))) {
					options.zip64 = true;
				}
				fileEntry = await createFileEntry(name, reader, fileWriter, zipWriter.config, zipWriter.options, options);
			} catch (error) {
				files.delete(name);
				throw error;
			}
			files.set(name, fileEntry);
			if (fileWriter != writer) {
				if (zipWriter.lockWrite) {
					await zipWriter.lockWrite;
				}
				await writer.writeUint8Array(fileWriter.getData());
			}
			fileEntry.offset = zipWriter.offset;
			if (fileEntry.zip64) {
				const extraFieldZip64View = new DataView(fileEntry.extraFieldZip64.buffer);
				extraFieldZip64View.setBigUint64(20, BigInt(fileEntry.offset), true);
			}
			zipWriter.offset += fileEntry.length;
		} finally {
			if (resolveLockWrite) {
				zipWriter.lockWrite = null;
				resolveLockWrite();
			}
		}
	}

	async function createFileEntry(name, reader, writer, config, zipWriterOptions, options) {
		const filename = getBytes(encodeUTF8(name));
		const date = options.lastModDate || new Date();
		const headerArray = new Uint8Array(26);
		const headerView = new DataView(headerArray.buffer);
		const password = options.password === undefined ? zipWriterOptions.password : options.password;
		const outputPassword = password && password.length && password;
		const level = options.level === undefined ? zipWriterOptions.level : options.level;
		const compressed = level !== 0 && !options.directory;
		const outputSigned = password === undefined || !password.length;
		const zip64 = options.zip64;
		let extraFieldAES;
		if (outputPassword) {
			extraFieldAES = new Uint8Array(EXTRAFIELD_AES.length + 2);
			const extraFieldAESView = new DataView(extraFieldAES.buffer);
			extraFieldAESView.setUint16(0, EXTRA_FIELD_TYPE_AES, true);
			extraFieldAES.set(EXTRAFIELD_AES, 2);
		} else {
			extraFieldAES = new Uint8Array(0);
		}
		const fileEntry = {
			zip64,
			headerArray: headerArray,
			directory: options.directory,
			filename: filename,
			comment: options.comment,
			extraFieldZip64: zip64 ? new Uint8Array(28) : new Uint8Array(0),
			extraFieldAES,
			rawExtraField: new Uint8Array(0)
		};
		const extraField = options.extraField;
		if (filename.length > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_NAME);
		}
		if (extraField) {
			let extraFieldSize = 4, offset = 0;
			extraField.forEach(data => extraFieldSize += data.length);
			const rawExtraField = fileEntry.rawExtraField = new Uint8Array(extraFieldSize);
			extraField.forEach((data, type) => {
				if (type > MAX_16_BITS) {
					throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
				}
				if (data.length > MAX_16_BITS) {
					throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
				}
				rawExtraField.set(new Uint16Array([type]), offset);
				rawExtraField.set(new Uint16Array([data.length]), offset + 2);
				rawExtraField.set(data, offset + 4);
				offset += 4 + data.length;
			});
		}
		options.bitFlag = BITFLAG_DATA_DESCRIPTOR | BITFLAG_LANG_ENCODING_FLAG;
		options.version = (options.version === undefined ? zipWriterOptions.version : options.version) || VERSION_DEFLATE;
		if (options.version > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		options.compressionMethod = COMPRESSION_METHOD_STORE;
		if (compressed) {
			options.compressionMethod = COMPRESSION_METHOD_DEFLATE;
		}
		if (zip64) {
			options.version = options.version > VERSION_ZIP64 ? options.version : VERSION_ZIP64;
		}
		if (outputPassword) {
			fileEntry.encrypted = true;
			options.version = options.version > VERSION_AES ? options.version : VERSION_AES;
			options.bitFlag = options.bitFlag | BITFLAG_ENCRYPTED;
			options.compressionMethod = COMPRESSION_METHOD_AES;
			if (compressed) {
				fileEntry.extraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
			}
		}
		headerView.setUint16(0, options.version, true);
		headerView.setUint16(2, options.bitFlag, true);
		headerView.setUint16(4, options.compressionMethod, true);
		headerView.setUint16(6, (((date.getHours() << 6) | date.getMinutes()) << 5) | date.getSeconds() / 2, true);
		headerView.setUint16(8, ((((date.getFullYear() - 1980) << 4) | (date.getMonth() + 1)) << 5) | date.getDate(), true);
		headerView.setUint16(22, filename.length, true);
		headerView.setUint16(24, 0, true);
		const fileDataArray = new Uint8Array(30 + filename.length);
		const fileDataView = new DataView(fileDataArray.buffer);
		fileDataView.setUint32(0, LOCAL_FILE_HEADER_SIGNATURE);
		fileDataArray.set(headerArray, 4);
		fileDataArray.set(filename, 30);
		let result;
		if (reader) {
			if (!reader.initialized) {
				await reader.init();
			}
			const codec = await createWorkerCodec(config, {
				codecType: CODEC_DEFLATE,
				level,
				outputPassword: password,
				outputSigned,
				outputCompressed: compressed,
				outputEncrypted: Boolean(password),
				useWebWorkers: options.useWebWorkers === undefined ? zipWriterOptions.useWebWorkers : options.useWebWorkers
			});
			await writer.writeUint8Array(fileDataArray);
			result = await processData(codec, reader, writer, 0, reader.size, config, { onprogress: options.onprogress });
			fileEntry.compressedSize = result.length;
		} else {
			await writer.writeUint8Array(fileDataArray);
		}
		const footerArray = new Uint8Array(zip64 ? 24 : 16);
		const footerView = new DataView(footerArray.buffer);
		footerView.setUint32(0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
		if (reader) {
			if (!outputPassword && result.signature !== undefined) {
				headerView.setUint32(10, result.signature, true);
				footerView.setUint32(4, result.signature, true);
			}
			if (zip64) {
				headerView.setUint32(14, MAX_32_BITS, true);
				footerView.setBigUint64(8, BigInt(fileEntry.compressedSize), true);
				headerView.setUint32(18, MAX_32_BITS, true);
				footerView.setBigUint64(16, BigInt(reader.size), true);
				const extraFieldZip64View = new DataView(fileEntry.extraFieldZip64.buffer);
				extraFieldZip64View.setUint16(0, EXTRA_FIELD_TYPE_ZIP64, true);
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

	const FUNCTION_TYPE = "function";

	var streamCodecShim = (library, options = {}) => {
		return {
			ZipDeflate: createCodecClass(library.Deflate, options.deflate),
			ZipInflate: createCodecClass(library.Inflate, options.inflate)
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
				this.codec = new constructor(Object.assign({}, constructorOptions, options));
				if (typeof this.codec.onData == FUNCTION_TYPE) {
					this.codec.onData = onData;
				} else if (typeof this.codec.on == FUNCTION_TYPE) {
					this.codec.on("data", onData);
				} else {
					throw new Error("Cannot register the callback function");
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


	const CHUNK_SIZE = 512 * 1024;

	class ZipEntry {
		constructor(fs, name, params, parent) {
			if (fs.root && parent && parent.getChildByName(name)) {
				throw new Error("Entry filename already exists");
			}
			if (!params) {
				params = {};
			}
			this.fs = fs;
			this.name = name;
			this.id = fs.entries.length;
			this.parent = parent;
			this.children = [];
			this.zipVersion = params.zipVersion || 0x14;
			this.uncompressedSize = 0;
			fs.entries.push(this);
			if (parent) {
				this.parent.children.push(this);
			}
		}
		moveTo(target) {
			if (target.directory) {
				if (!target.isDescendantOf(this)) {
					if (this != target) {
						if (target.getChildByName(this.name)) {
							throw new Error("Entry filename already exists");
						}
						detach(this);
						this.parent = target;
						target.children.push(this);
					}
				} else {
					throw new Error("Entry is a ancestor of target entry");
				}
			} else {
				throw new Error("Target entry is not a directory");
			}
		}
		getFullname() {
			let fullname = this.name, entry = this.parent;
			while (entry) {
				fullname = (entry.name ? entry.name + "/" : "") + fullname;
				entry = entry.parent;
			}
			return fullname;
		}
		isDescendantOf(ancestor) {
			let entry = this.parent;
			while (entry && entry.id != ancestor.id) {
				entry = entry.parent;
			}
			return Boolean(entry);
		}
	}

	class ZipFileEntry extends ZipEntry {
		constructor(fs, name, params, parent) {
			super(fs, name, params, parent);
			this.Reader = params.Reader;
			this.Writer = params.Writer;
			this.data = params.data;
			if (params.getData) {
				this.getData = params.getData;
			}
		}
		async getData(writer, options = {}) {
			if (!writer || (writer.constructor == this.Writer && this.data)) {
				return this.data;
			} else {
				if (!this.reader) {
					this.reader = new this.Reader(this.data);
				}
				await this.reader.init();
				await writer.init();
				this.uncompressedSize = this.reader.size;
				return bufferedCopy(this.reader, writer, options);
			}
		}
		getText(encoding, options) {
			return this.getData(new TextWriter(encoding), options);
		}
		getBlob(mimeType, options) {
			return this.getData(new BlobWriter(mimeType), options);
		}
		getData64URI(mimeType, options) {
			return this.getData(new Data64URIWriter(mimeType), options);
		}
	}

	class ZipDirectoryEntry extends ZipEntry {
		constructor(fs, name, params, parent) {
			super(fs, name, params, parent);
			this.directory = true;
		}
		addDirectory(name) {
			return addChild(this, name, null, true);
		}
		addText(name, text) {
			return addChild(this, name, {
				data: text,
				Reader: TextReader,
				Writer: TextWriter
			});
		}
		addBlob(name, blob) {
			return addChild(this, name, {
				data: blob,
				Reader: BlobReader,
				Writer: BlobWriter
			});
		}
		addData64URI(name, dataURI) {
			return addChild(this, name, {
				data: dataURI,
				Reader: Data64URIReader,
				Writer: Data64URIWriter
			});
		}
		addHttpContent(name, url, options = {}) {
			return addChild(this, name, {
				data: url,
				Reader: options.useRangeHeader ? HttpRangeReader : HttpReader
			});
		}
		addFileEntry(fileEntry) {
			addFileEntry(this, fileEntry);
		}
		async addData(name, params) {
			return addChild(this, name, params);
		}
		async importBlob(blob, options = {}) {
			await this.importZip(new BlobReader(blob), options);
		}
		async importData64URI(dataURI, options = {}) {
			await this.importZip(new Data64URIReader(dataURI), options);
		}
		async importHttpContent(URL, options = {}) {
			await this.importZip(options.useRangeHeader ? new HttpRangeReader(URL) : new HttpReader(URL), options);
		}
		async exportBlob(options = {}) {
			return this.exportZip(new BlobWriter("application/zip"), options);
		}
		async exportData64URI(options = {}) {
			return this.exportZip(new Data64URIWriter("application/zip"), options);
		}
		async importZip(reader, options) {
			await reader.init();
			const zipReader = new ZipReader$1(reader);
			const entries = await zipReader.getEntries();
			let currentIndex = 0;
			const totalSize = getTotalSize(entries, "compressedSize");
			entries.forEach(entry => {
				let parent = this, path = entry.filename.split("/"), name = path.pop();
				path.forEach(pathPart => parent = parent.getChildByName(pathPart) || new ZipDirectoryEntry(this.fs, pathPart, null, parent));
				if (!entry.directory) {
					let currentIndexEntry = currentIndex;
					addChild(parent, name, {
						data: entry,
						Reader: getZipBlobReader(Object.assign({}, options, {
							onprogress: indexProgress => {
								if (options.onprogress) {
									options.onprogress(currentIndexEntry + indexProgress, totalSize);
								}
							}
						}))
					});
					currentIndex += entry.compressedSize;
				}
			});
		}
		async exportZip(writer, options) {
			await initReaders(this);
			const zipWriter = new ZipWriter$1(writer);
			await exportZip(zipWriter, this, getTotalSize([this], "uncompressedSize"), options);
			await zipWriter.close();
			return writer.getData();
		}
		getChildByName(name) {
			for (let childIndex = 0; childIndex < this.children.length; childIndex++) {
				const child = this.children[childIndex];
				if (child.name == name)
					return child;
			}
		}
	}


	class FS {
		constructor() {
			resetFS(this);
		}
		remove(entry) {
			detach(entry);
			this.entries[entry.id] = null;
		}
		find(fullname) {
			const path = fullname.split("/");
			let node = this.root;
			for (let index = 0; node && index < path.length; index++) {
				node = node.getChildByName(path[index]);
			}
			return node;
		}
		getById(id) {
			return this.entries[id];
		}
		async importBlob(blob) {
			resetFS(this);
			await this.root.importBlob(blob);
		}
		async importData64URI(dataURI) {
			resetFS(this);
			await this.root.importData64URI(dataURI);
		}
		async importHttpContent(url, options) {
			this.entries = [];
			this.root = new ZipDirectoryEntry(this);
			await this.root.importHttpContent(url, options);
		}
		async exportBlob(options) {
			return this.root.exportBlob(options);
		}
		async exportData64URI(options) {
			return this.root.exportData64URI(options);
		}
	}

	const fs = { FS, ZipDirectoryEntry, ZipFileEntry };
	function getTotalSize(entries, propertyName) {
		let size = 0;
		entries.forEach(process);
		return size;

		function process(entry) {
			size += entry[propertyName];
			if (entry.children) {
				entry.children.forEach(process);
			}
		}
	}

	function getZipBlobReader(options) {
		return class {

			constructor(entry) {
				this.entry = entry;
				this.size = 0;
			}

			async readUint8Array(index, length) {
				if (!this.blobReader) {
					const data = await this.entry.getData(new BlobWriter(), options);
					this.data = data;
					this.blobReader = new BlobReader(data);
				}
				return this.blobReader.readUint8Array(index, length);
			}

			async init() {
				this.size = this.entry.uncompressedSize;
			}
		};
	}

	async function initReaders(entry) {
		if (entry.children.length) {
			for (const child of entry.children) {
				if (child.directory) {
					await initReaders(child);
				} else {
					child.reader = new child.Reader(child.data);
					await child.reader.init();
					child.uncompressedSize = child.reader.size;
				}
			}
		}
	}

	function detach(entry) {
		const children = entry.parent.children;
		children.forEach((child, index) => {
			if (child.id == entry.id)
				children.splice(index, 1);
		});
	}

	async function exportZip(zipWriter, entry, totalSize, options) {
		let currentIndex = 0;
		await process(zipWriter, entry);

		async function process(zipWriter, entry) {
			await exportChild();

			async function exportChild() {
				let index = 0;
				for (const child of entry.children) {
					let currentIndexEntry = currentIndex;
					await zipWriter.add(child.getFullname(), child.reader, Object.assign({
						directory: child.directory,
						version: child.zipVersion
					}, options, {
						onprogress: indexProgress => {
							if (options.onprogress) {
								options.onprogress(currentIndexEntry + index + indexProgress, totalSize);
							}
						}
					}));
					currentIndex += child.uncompressedSize;
					await process(zipWriter, child);
					index++;
				}
			}
		}
	}

	async function addFileEntry(zipEntry, fileEntry) {
		if (fileEntry.isDirectory) {
			await process(zipEntry, fileEntry);
		} else {
			await new Promise((resolve, reject) => {
				fileEntry.file(file => {
					zipEntry.addBlob(fileEntry.name, file);
					resolve();
				}, reject);
			});
		}

		function getChildren(fileEntry) {
			return new Promise((resolve, reject) => {
				let entries = [];
				if (fileEntry.isDirectory) {
					readEntries(fileEntry.createReader());
				}
				if (fileEntry.isFile) {
					resolve(entries);
				}

				function readEntries(directoryReader) {
					directoryReader.readEntries(temporaryEntries => {
						if (!temporaryEntries.length) {
							resolve(entries);
						} else {
							entries = entries.concat(temporaryEntries);
							readEntries(directoryReader);
						}
					}, reject);
				}
			});
		}

		async function process(zipEntry, fileEntry) {
			const children = await getChildren(fileEntry);
			for (const child of children) {
				if (child.isDirectory) {
					await process(zipEntry.addDirectory(child.name));
				}
				await new Promise((resolve, reject) => {
					if (child.isFile) {
						child.file(file => {
							const childZipEntry = zipEntry.addBlob(child.name, file);
							childZipEntry.uncompressedSize = file.size;
							resolve(childZipEntry);
						}, reject);
					}
				});

			}
		}
	}

	function resetFS(fs) {
		fs.entries = [];
		fs.root = new ZipDirectoryEntry(fs);
	}

	async function bufferedCopy(reader, writer, options) {
		return stepCopy();

		async function stepCopy(chunkIndex = 0) {
			const index = chunkIndex * CHUNK_SIZE;
			if (options.onprogress) {
				options.onprogress(index, reader.size);
			}
			if (index < reader.size) {
				const array = await reader.readUint8Array(index, Math.min(CHUNK_SIZE, reader.size - index));
				await writer.writeUint8Array(array);
				return stepCopy(chunkIndex + 1);
			} else {
				return writer.getData();
			}
		}
	}

	function addChild(parent, name, params, directory) {
		if (parent.directory) {
			return directory ? new ZipDirectoryEntry(parent.fs, name, params, parent) : new ZipFileEntry(parent.fs, name, params, parent);
		} else {
			throw new Error("Parent entry is not a directory");
		}
	}

	exports.BlobReader = BlobReader;
	exports.BlobWriter = BlobWriter;
	exports.Data64URIReader = Data64URIReader;
	exports.Data64URIWriter = Data64URIWriter;
	exports.ERR_BAD_FORMAT = ERR_BAD_FORMAT;
	exports.ERR_CENTRAL_DIRECTORY_NOT_FOUND = ERR_CENTRAL_DIRECTORY_NOT_FOUND;
	exports.ERR_DUPLICATED_NAME = ERR_DUPLICATED_NAME;
	exports.ERR_ENCRYPTED = ERR_ENCRYPTED;
	exports.ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND;
	exports.ERR_EOCDR_NOT_FOUND = ERR_EOCDR_NOT_FOUND;
	exports.ERR_EOCDR_ZIP64_NOT_FOUND = ERR_EOCDR_ZIP64_NOT_FOUND;
	exports.ERR_EXTRAFIELD_ZIP64_NOT_FOUND = ERR_EXTRAFIELD_ZIP64_NOT_FOUND;
	exports.ERR_HTTP_RANGE = ERR_HTTP_RANGE;
	exports.ERR_INVALID_COMMENT = ERR_INVALID_COMMENT;
	exports.ERR_INVALID_ENTRY_COMMENT = ERR_INVALID_ENTRY_COMMENT;
	exports.ERR_INVALID_ENTRY_NAME = ERR_INVALID_ENTRY_NAME;
	exports.ERR_INVALID_EXTRAFIELD_DATA = ERR_INVALID_EXTRAFIELD_DATA;
	exports.ERR_INVALID_EXTRAFIELD_TYPE = ERR_INVALID_EXTRAFIELD_TYPE;
	exports.ERR_INVALID_PASSORD = ERR_INVALID_PASSORD;
	exports.ERR_INVALID_SIGNATURE = ERR_INVALID_SIGNATURE;
	exports.ERR_INVALID_VERSION = ERR_INVALID_VERSION;
	exports.ERR_LOCAL_FILE_HEADER_NOT_FOUND = ERR_LOCAL_FILE_HEADER_NOT_FOUND;
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION;
	exports.ERR_UNSUPPORTED_ENCRYPTION = ERR_UNSUPPORTED_ENCRYPTION;
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
	exports.fs = fs;
	exports.getMimeType = getMimeType;
	exports.initShimAsyncCodec = streamCodecShim;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
