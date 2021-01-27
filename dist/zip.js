(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
}(this, (function (exports) { 'use strict';

	const FUNCTION_TYPE = "function";

	var streamCodecShim = (library, options = {}) => {
		return {
			Deflate: createCodecClass(library.Deflate, options.deflate),
			Inflate: createCodecClass(library.Inflate, options.inflate)
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

	const MAX_32_BITS = 0xffffffff;
	const MAX_16_BITS = 0xffff;
	const COMPRESSION_METHOD_DEFLATE = 0x08;
	const COMPRESSION_METHOD_STORE = 0x00;
	const COMPRESSION_METHOD_AES = 0x63;

	const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
	const DATA_DESCRIPTOR_RECORD_SIGNATURE = 0x08074b50;
	const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
	const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
	const ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 0x06064b50;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 0x07064b50;
	const END_OF_CENTRAL_DIR_LENGTH = 22;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH = 20;
	const ZIP64_END_OF_CENTRAL_DIR_LENGTH = 56;
	const ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH = END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LENGTH;

	const ZIP64_TOTAL_NUMBER_OF_DISKS = 1;

	const EXTRAFIELD_TYPE_ZIP64 = 0x0001;
	const EXTRAFIELD_TYPE_AES = 0x9901;
	const EXTRAFIELD_TYPE_UNICODE_PATH = 0x7075;
	const EXTRAFIELD_TYPE_UNICODE_COMMENT = 0x6375;

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

	const CP437 = [
		"\0", "☺", "☻", "♥", "♦", "♣", "♠", "•", "◘", "○", "◙", "♂", "♀", "♪", "♫", "☼", "►", "◄", "↕", "‼", "¶", "§", "▬", "↨", "↑", "↓", "→", "←", "∟", "↔", "▲", "▼",
		" ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
		"@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
		"`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "⌂",
		"Ç", "ü", "é", "â", "ä", "à", "å", "ç", "ê", "ë", "è", "ï", "î", "ì", "Ä", "Å", "É", "æ", "Æ", "ô", "ö", "ò", "û", "ù", "ÿ", "Ö", "Ü", "¢", "£", "¥", "₧", "ƒ",
		"á", "í", "ó", "ú", "ñ", "Ñ", "ª", "º", "¿", "⌐", "¬", "½", "¼", "¡", "«", "»", "░", "▒", "▓", "│", "┤", "╡", "╢", "╖", "╕", "╣", "║", "╗", "╝", "╜", "╛", "┐",
		"└", "┴", "┬", "├", "─", "┼", "╞", "╟", "╚", "╔", "╩", "╦", "╠", "═", "╬", "╧", "╨", "╤", "╥", "╙", "╘", "╒", "╓", "╫", "╪", "┘", "┌", "█", "▄", "▌", "▐", "▀",
		"α", "ß", "Γ", "π", "Σ", "σ", "µ", "τ", "Φ", "Θ", "Ω", "δ", "∞", "φ", "ε", "∩", "≡", "±", "≥", "≤", "⌠", "⌡", "÷", "≈", "°", "∙", "·", "√", "ⁿ", "²", "■", " "];


	var decodeCP437 = stringValue => {
		let result = "";
		for (let indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) {
			result += CP437[stringValue[indexCharacter]];
		}
		return result;
	};

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

	const ERR_INVALID_PASSWORD = "Invalid pasword";
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
	const SALT_LENGTH = [8, 12, 16];
	const KEY_LENGTH = [16, 24, 32];
	const SIGNATURE_LENGTH = 10;
	const COUNTER_DEFAULT_VALUE = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	const subtle = crypto.subtle;

	class Decrypt {

		constructor(password, signed, strength) {
			this.password = password;
			this.signed = signed;
			this.strength = strength - 1;
			this.input = signed && new Uint8Array(0);
			this.pendingInput = new Uint8Array(0);
		}

		async append(input) {
			const decrypt = async (offset = 0) => {
				if (offset + BLOCK_LENGTH <= bufferedInput.length - SIGNATURE_LENGTH) {
					const chunkToDecrypt = bufferedInput.subarray(offset, offset + BLOCK_LENGTH);
					const outputChunk = await subtle.decrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), this.keys.key, chunkToDecrypt);
					incrementCounter(this.counter);
					output.set(new Uint8Array(outputChunk), offset);
					return decrypt(offset + BLOCK_LENGTH);
				} else {
					this.pendingInput = bufferedInput.subarray(offset);
					if (this.signed) {
						this.input = concat(this.input, input);
					}
					return output;
				}
			};

			if (this.password) {
				const preambule = input.subarray(0, SALT_LENGTH[this.strength] + 2);
				await createDecryptionKeys(this, preambule, this.password);
				this.password = null;
				input = input.subarray(SALT_LENGTH[this.strength] + 2);
			}
			let output = new Uint8Array(input.length - SIGNATURE_LENGTH - ((input.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
			let bufferedInput = input;
			if (this.pendingInput.length) {
				bufferedInput = concat(this.pendingInput, input);
				output = expand(output, bufferedInput.length - SIGNATURE_LENGTH - ((bufferedInput.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
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
				const decryptedChunk = await subtle.decrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), keys.key, chunkToDecrypt);
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

	class Encrypt {

		constructor(password, strength) {
			this.password = password;
			this.strength = strength - 1;
			this.output = new Uint8Array(0);
			this.pendingInput = new Uint8Array(0);
		}

		async append(input) {
			const encrypt = async (offset = 0) => {
				if (offset + BLOCK_LENGTH <= input.length) {
					const chunkToEncrypt = input.subarray(offset, offset + BLOCK_LENGTH);
					const outputChunk = await subtle.encrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), this.keys.key, chunkToEncrypt);
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
				const encryptedChunk = await subtle.encrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), this.keys.key, this.pendingInput);
				encryptedChunkArray = new Uint8Array(encryptedChunk);
				this.output = concat(this.output, encryptedChunkArray);
			}
			const signature = await subtle.sign(SIGNATURE_ALGORITHM, this.keys.authentication, this.output.subarray(SALT_LENGTH[this.strength] + 2));
			this.output = null;
			const signatureArray = new Uint8Array(signature).subarray(0, SIGNATURE_LENGTH);
			return {
				data: concat(encryptedChunkArray, signatureArray),
				signature: signatureArray
			};
		}
	}

	async function createDecryptionKeys(decrypt, preambuleArray, password) {
		await createKeys(decrypt, password, preambuleArray.subarray(0, SALT_LENGTH[decrypt.strength]), ["decrypt"]);
		const passwordVerification = preambuleArray.subarray(SALT_LENGTH[decrypt.strength]);
		const passwordVerificationKey = decrypt.keys.passwordVerification;
		if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
			throw new Error(ERR_INVALID_PASSWORD);
		}
	}

	async function createEncryptionKeys(encrypt, password) {
		const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH[encrypt.strength]));
		await createKeys(encrypt, password, salt, ["encrypt"]);
		return concat(salt, encrypt.keys.passwordVerification);
	}

	async function createKeys(target, password, salt, keyUsage) {
		target.counter = new Uint8Array(COUNTER_DEFAULT_VALUE);
		const encodedPassword = (new TextEncoder()).encode(password);
		const basekey = await subtle.importKey(RAW_FORMAT, encodedPassword, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
		const derivedBits = await subtle.deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), basekey, 8 * ((KEY_LENGTH[target.strength] * 2) + 2));
		const compositeKey = new Uint8Array(derivedBits);
		target.keys = {
			key: await subtle.importKey(RAW_FORMAT, compositeKey.subarray(0, KEY_LENGTH[target.strength]), CRYPTO_KEY_ALGORITHM, true, keyUsage),
			authentication: await subtle.importKey(RAW_FORMAT, compositeKey.subarray(KEY_LENGTH[target.strength], KEY_LENGTH[target.strength] * 2), AUTHENTICATION_ALGORITHM, false, SIGN_USAGE),
			passwordVerification: compositeKey.subarray(KEY_LENGTH[target.strength] * 2)
		};
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

	const CODEC_DEFLATE = "deflate";
	const CODEC_INFLATE = "inflate";
	const ERR_INVALID_SIGNATURE = "Invalid signature";

	class Inflate {

		constructor(options) {
			this.signature = options.inputSignature;
			this.encrypted = Boolean(options.inputPassword);
			this.signed = options.inputSigned;
			this.compressed = options.inputCompressed;
			this.inflate = options.inputCompressed && new options.codecConstructor();
			this.crc32 = options.inputSigned && new Crc32();
			this.decrypt = this.encrypted && new Decrypt(options.inputPassword, options.inputSigned, options.inputEncryptionStrength);
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
			this.deflate = options.outputCompressed && new options.codecConstructor({ level: options.level || 5 });
			this.crc32 = options.outputSigned && new Crc32();
			this.encrypt = this.encrypted && new Encrypt(options.outputPassword, options.outputEncryptionStrength);
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

	const MESSAGE_INIT = "init";
	const MESSAGE_APPEND = "append";
	const MESSAGE_FLUSH = "flush";
	const MESSAGE_EVENT_TYPE = "message";

	const workers = {
		pool: [],
		pendingRequests: []
	};

	function createWorkerCodec(options, config) {
		const pool = workers.pool;
		const streamCopy =
			!options.inputCompressed && !options.inputSigned && !options.inputEncrypted &&
			!options.outputCompressed && !options.outputSigned && !options.outputEncrypted;
		const webWorker = options.useWebWorkers || (options.useWebWorkers === undefined && config.useWebWorkers && !streamCopy);
		let scripts;
		if (webWorker) {
			const codecType = options.codecType;
			if (config.workerScripts) {
				scripts = config.workerScripts[codecType];
			}
		}
		if (pool.length < config.maxWorkers) {
			const workerData = {};
			pool.push(workerData);
			return getWorkerInterface(workerData, options, webWorker, scripts);
		} else {
			const workerData = pool.find(workerData => !workerData.busy);
			if (workerData) {
				return getWorkerInterface(workerData, options, webWorker, scripts);
			} else {
				return new Promise(resolve => workers.pendingRequests.push({ resolve, options, webWorker, scripts }));
			}
		}
	}

	function getWorkerInterface(workerData, options, webWorker, scripts) {
		workerData.busy = true;
		workerData.options = options;
		workerData.scripts = scripts;
		workerData.webWorker = webWorker;
		return webWorker ? createWebWorkerInterface(workerData) : createWorkerInterface(workerData);
	}

	function createWorkerInterface(workerData) {
		const interfaceCodec = createCodec(workerData.options);
		return {
			async append(data) {
				try {
					return await interfaceCodec.append(data);
				} catch (error) {
					onTaskFinished(workerData);
					throw error;
				}
			},
			async flush() {
				try {
					return await interfaceCodec.flush();
				} finally {
					onTaskFinished(workerData);
				}
			}
		};
	}

	function createWebWorkerInterface(workerData) {
		let task;
		if (!workerData.interface) {
			workerData.worker = new Worker(new URL(workerData.scripts[0], (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('zip.js', document.baseURI).href))));
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
				const options = workerData.options;
				const scripts = workerData.scripts ? workerData.scripts.slice(1) : [];
				await sendMessage(Object.assign({
					scripts,
					type: MESSAGE_INIT, options: {
						codecType: options.codecType,
						inputPassword: options.inputPassword,
						inputEncryptionStrength: options.inputEncryptionStrength,
						inputSigned: options.inputSigned,
						inputSignature: options.signature,
						inputCompressed: options.inputCompressed,
						inputEncrypted: options.inputEncrypted,
						level: options.level,
						outputPassword: options.outputPassword,
						outputEncryptionStrength: options.outputEncryptionStrength,
						outputSigned: options.outputSigned,
						outputCompressed: options.outputCompressed,
						outputEncrypted: options.outputEncrypted
					}
				}));
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
			const [{ resolve, options, webWorker, scripts }] = workers.pendingRequests.splice(0, 1);
			resolve(getWorkerInterface(workerData, options, webWorker, scripts));
		} else {
			if (workerData.worker) {
				workerData.worker.terminate();
			}
			workers.pool = workers.pool.filter(data => data != workerData);
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

	const PROPERTY_NAMES = [
		"filename", "rawFilename", "directory", "encrypted", "compressedSize", "uncompressedSize",
		"lastModDate", "rawLastModDate", "comment", "rawComment", "signature", "extraField",
		"rawExtraField", "bitFlag", "extraFieldZip64", "extraFieldUnicodePath", "extraFieldUnicodeComment",
		"extraFieldAES", "filenameUTF8", "commentUTF8"];

	class Entry {

		constructor(data) {
			PROPERTY_NAMES.forEach(name => this[name] = data[name]);
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

	const ERR_BAD_FORMAT = "File format is not recognized";
	const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
	const ERR_EOCDR_ZIP64_NOT_FOUND = "End of Zip64 central directory not found";
	const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
	const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
	const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
	const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
	const ERR_ENCRYPTED = "File contains encrypted entry";
	const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
	const CHARSET_UTF8 = "utf-8";
	const ZIP64_PROPERTIES = ["uncompressedSize", "compressedSize", "offset"];
	class ZipReader {

		constructor(reader, options = {}, config = {}) {
			this.reader = reader;
			this.options = options;
			this.config = config;
		}

		async getEntries(options = {}) {
			const reader = this.reader;
			if (!reader.initialized) {
				await reader.init();
			}
			if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS);
			if (!endOfDirectoryInfo) {
				throw new Error(ERR_EOCDR_NOT_FOUND);
			}
			const endOfDirectoryView = new DataView(endOfDirectoryInfo.buffer);
			let zip64;
			let directoryDataOffset = getUint32(endOfDirectoryView, 16);
			let filesLength = getUint16(endOfDirectoryView, 8);
			if (directoryDataOffset == MAX_32_BITS || filesLength == MAX_16_BITS) {
				zip64 = true;
				const endOfDirectoryLocatorArray = await reader.readUint8Array(endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);
				const endOfDirectoryLocatorView = new DataView(endOfDirectoryLocatorArray.buffer);
				if (Number(getUint32(endOfDirectoryLocatorView, 0)) != ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
					throw new Error(ERR_EOCDR_ZIP64_NOT_FOUND);
				}
				directoryDataOffset = Number(getBigUint64(endOfDirectoryLocatorView, 8));
				const endOfDirectoryArray = await reader.readUint8Array(directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
				const endOfDirectoryView = new DataView(endOfDirectoryArray.buffer);
				if (Number(getUint32(endOfDirectoryView, 0)) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
					throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
				}
				filesLength = Number(getBigUint64(endOfDirectoryView, 24));
				directoryDataOffset -= Number(getBigUint64(endOfDirectoryView, 40));
			}
			if (directoryDataOffset < 0 || (!zip64 && (directoryDataOffset >= reader.size || filesLength >= MAX_16_BITS))) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const directoryArray = await reader.readUint8Array(directoryDataOffset, reader.size - directoryDataOffset);
			const directoryView = new DataView(directoryArray.buffer);
			const entries = [];
			let offset = 0;
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const fileEntry = new ZipEntry(this.reader, this.config, this.options);
				if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
					throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
				}
				fileEntry.compressedSize = 0;
				fileEntry.uncompressedSize = 0;
				readCommonHeader(fileEntry, directoryView, offset + 6);
				fileEntry.commentLength = getUint16(directoryView, offset + 32);
				fileEntry.directory = (getUint8(directoryView, offset + 38) & FILE_ATTR_MSDOS_DIR_MASK) == FILE_ATTR_MSDOS_DIR_MASK;
				fileEntry.offset = getUint32(directoryView, offset + 42);
				fileEntry.rawFilename = directoryArray.subarray(offset + 46, offset + 46 + fileEntry.filenameLength);
				const filenameEncoding = options.filenameEncoding === undefined ? this.options.filenameEncoding : options.filenameEncoding;
				fileEntry.filenameUTF8 = fileEntry.commentUTF8 = Boolean(fileEntry.bitFlag.languageEncodingFlag);
				fileEntry.filename = decodeString(fileEntry.rawFilename, fileEntry.filenameUTF8 ? CHARSET_UTF8 : filenameEncoding);
				if (!fileEntry.directory && fileEntry.filename && fileEntry.filename.charAt(fileEntry.filename.length - 1) == DIRECTORY_SIGNATURE) {
					fileEntry.directory = true;
				}
				fileEntry.rawExtraField = directoryArray.subarray(offset + 46 + fileEntry.filenameLength, offset + 46 + fileEntry.filenameLength + fileEntry.extraFieldLength);
				fileEntry.rawComment = directoryArray.subarray(offset + 46 + fileEntry.filenameLength + fileEntry.extraFieldLength, offset + 46
					+ fileEntry.filenameLength + fileEntry.extraFieldLength + fileEntry.commentLength);
				const commentEncoding = options.commentEncoding === undefined ? this.options.commentEncoding : options.commentEncoding;
				fileEntry.comment = decodeString(fileEntry.rawComment, fileEntry.commentUTF8 ? CHARSET_UTF8 : commentEncoding);
				readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
				const entry = new Entry(fileEntry);
				entry.getData = (writer, options) => fileEntry.getData(writer, options);
				entries.push(entry);
				offset += 46 + fileEntry.filenameLength + fileEntry.extraFieldLength + fileEntry.commentLength;
			}
			return entries;
		}

		async close() {
		}
	}

	class ZipEntry {

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
			const inputPassword = password && password.length && password;
			if (this.extraFieldAES) {
				if (this.extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
					throw new Error(ERR_UNSUPPORTED_COMPRESSION);
				}
			}
			if (this.compressionMethod != COMPRESSION_METHOD_STORE && this.compressionMethod != COMPRESSION_METHOD_DEFLATE) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
			if (getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
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
			const codec = await createWorkerCodec({
				codecType: CODEC_INFLATE,
				codecConstructor: this.config.Inflate,
				inputPassword,
				inputEncryptionStrength: this.extraFieldAES && this.extraFieldAES.strength,
				inputSigned: options.checkSignature === undefined ? this.options.checkSignature : options.checkSignature,
				inputSignature: this.signature,
				inputCompressed: this.compressionMethod != 0,
				inputEncrypted,
				useWebWorkers: options.useWebWorkers === undefined ? this.options.useWebWorkers : options.useWebWorkers
			}, this.config);
			if (!writer.initialized) {
				await writer.init();
			}
			await processData(codec, reader, writer, dataOffset, this.compressedSize, this.config, { onprogress: options.onprogress });
			return writer.getData();
		}
	}

	function readCommonHeader(directory, dataView, offset) {
		directory.version = getUint16(dataView, offset);
		const rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
		directory.bitFlag = {
			encrypted: (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED,
			level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
			dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
			languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
		};
		directory.encrypted = directory.bitFlag.encrypted;
		directory.rawLastModDate = getUint32(dataView, offset + 6);
		directory.lastModDate = getDate(directory.rawLastModDate);
		directory.filenameLength = getUint16(dataView, offset + 22);
		directory.extraFieldLength = getUint16(dataView, offset + 24);
	}

	function readCommonFooter(fileEntry, directory, dataView, offset) {
		const rawExtraField = directory.rawExtraField;
		const extraField = directory.extraField = new Map();
		const rawExtraFieldView = new DataView(new Uint8Array(rawExtraField).buffer);
		let offsetExtraField = 0;
		try {
			while (offsetExtraField < rawExtraField.length) {
				const type = getUint16(rawExtraFieldView, offsetExtraField);
				const size = getUint16(rawExtraFieldView, offsetExtraField + 2);
				extraField.set(type, {
					type,
					data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
				});
				offsetExtraField += 4 + size;
			}
		} catch (error) {
			// ignored
		}
		const compressionMethod = getUint16(dataView, offset + 4);
		directory.signature = getUint32(dataView, offset + 10);
		directory.uncompressedSize = getUint32(dataView, offset + 18);
		directory.compressedSize = getUint32(dataView, offset + 14);
		const extraFieldZip64 = directory.extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
		if (extraFieldZip64) {
			readExtraFieldZip64(extraFieldZip64, directory);
		}
		const extraFieldUnicodePath = directory.extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
		if (extraFieldUnicodePath) {
			readExtraFieldUnicode(extraFieldUnicodePath, "filename", "rawFilename", directory, fileEntry);
		}
		let extraFieldUnicodeComment = directory.extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
		if (extraFieldUnicodeComment) {
			readExtraFieldUnicode(extraFieldUnicodeComment, "comment", "rawComment", directory, fileEntry);
		}
		const extraFieldAES = directory.extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
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
			extraFieldZip64.values.push(Number(getBigUint64(extraFieldView, 0 + indexValue * 8)));
		}
		const missingProperties = ZIP64_PROPERTIES.filter(propertyName => directory[propertyName] == MAX_32_BITS);
		for (let indexMissingProperty = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
			extraFieldZip64[missingProperties[indexMissingProperty]] = extraFieldZip64.values[indexMissingProperty];
		}
		ZIP64_PROPERTIES.forEach(propertyName => {
			if (directory[propertyName] == MAX_32_BITS) {
				if (extraFieldZip64 && extraFieldZip64[propertyName] !== undefined) {
					directory[propertyName] = extraFieldZip64[propertyName];
				} else {
					throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
				}
			}
		});
	}

	function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
		const extraFieldView = new DataView(extraFieldUnicode.data.buffer);
		extraFieldUnicode.version = getUint8(extraFieldView, 0);
		extraFieldUnicode.signature = getUint32(extraFieldView, 1);
		const crc32 = new Crc32();
		crc32.append(fileEntry[rawPropertyName]);
		const dataViewSignature = new DataView(new Uint8Array(4).buffer);
		dataViewSignature.setUint32(0, crc32.get(), true);
		extraFieldUnicode[propertyName] = (new TextDecoder()).decode(extraFieldUnicode.data.subarray(5));
		extraFieldUnicode.valid = !fileEntry.bitFlag.languageEncodingFlag && extraFieldUnicode.signature == getUint32(dataViewSignature, 0);
		if (extraFieldUnicode.valid) {
			directory[propertyName] = extraFieldUnicode[propertyName];
			directory[propertyName + "UTF8"] = true;
		}
	}

	function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
		if (extraFieldAES) {
			const extraFieldView = new DataView(extraFieldAES.data.buffer);
			extraFieldAES.vendorVersion = getUint8(extraFieldView, 0);
			extraFieldAES.vendorId = getUint8(extraFieldView, 2);
			const strength = getUint8(extraFieldView, 4);
			extraFieldAES.strength = strength;
			extraFieldAES.originalCompressionMethod = compressionMethod;
			directory.compressionMethod = extraFieldAES.compressionMethod = getUint16(extraFieldView, 5);
		} else {
			directory.compressionMethod = compressionMethod;
		}
	}

	async function seekSignature(reader, signature, minimumBytes, maximumLength) {
		const signatureArray = new Uint8Array(4);
		const signatureView = new DataView(signatureArray.buffer);
		setUint32(signatureView, 0, signature);
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
		if (!encoding || encoding.trim().toLowerCase() == "cp437") {
			return decodeCP437(value);
		} else {
			return (new TextDecoder(encoding)).decode(value);
		}
	}

	function getDate(timeRaw) {
		const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
		try {
			return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
		} catch (error) {
			// ignored
		}
	}

	function getUint8(view, offset) {
		return view.getUint8(offset);
	}

	function getUint16(view, offset) {
		return view.getUint16(offset, true);
	}

	function getUint32(view, offset) {
		return view.getUint32(offset, true);
	}

	function getBigUint64(view, offset) {
		return view.getBigUint64(offset, true);
	}

	function setUint32(view, offset, value) {
		view.setUint32(offset, value, true);
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

	const ERR_HTTP_STATUS = "HTTP error ";
	const ERR_HTTP_RANGE = "HTTP Range not supported";
	const TEXT_PLAIN = "text/plain";

	class Stream {

		constructor() {
			this.size = 0;
		}

		async init() {
			this.initialized = true;
		}
	}
	class Reader extends Stream {
	}

	class Writer extends Stream {

		async writeUint8Array(array) {
			this.size += array.length;
		}
	}

	class TextReader extends Reader {

		constructor(text) {
			super();
			this.blobReader = new BlobReader(new Blob([text], { type: TEXT_PLAIN }));
		}

		async init() {
			await super.init();
			this.blobReader.init();
			this.size = this.blobReader.size;
		}

		async readUint8Array(offset, length) {
			return this.blobReader.readUint8Array(offset, length);
		}
	}

	class TextWriter extends Writer {

		constructor(encoding) {
			super();
			this.encoding = encoding;
			this.blob = new Blob([], { type: TEXT_PLAIN });
		}

		async writeUint8Array(array) {
			await super.writeUint8Array(array);
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

		async readUint8Array(offset, length) {
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

		async writeUint8Array(array) {
			await super.writeUint8Array(array);
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

		async readUint8Array(offset, length) {
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

		async writeUint8Array(array) {
			await super.writeUint8Array(array);
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
			await super.init();
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

		async init() {
			await super.init();
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

		async readUint8Array(index, length) {
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

		async readUint8Array(index, length) {
			return this.array.slice(index, index + length);
		}
	}

	class Uint8ArrayWriter extends Writer {

		constructor() {
			super();
			this.array = new Uint8Array(0);
		}

		async writeUint8Array(array) {
			await super.writeUint8Array(array);
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

	const ERR_DUPLICATED_NAME = "File already exists";
	const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
	const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
	const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
	const ERR_INVALID_VERSION = "Version exceeds 65535";
	const ERR_INVALID_DATE = "The minimum year for the date is 1980";
	const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
	const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
	const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";

	const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
	const EXTRAFIELD_LENGTH_ZIP64 = 24;

	class ZipWriter {

		constructor(writer, options = {}, config = {}) {
			this.writer = writer;
			this.options = options;
			this.config = config;
			this.files = new Map();
			this.offset = writer.size;
		}

		async add(name = "", reader, options = {}) {
			name = name.trim();
			if (options.directory && (!name.length || name.charAt(name.length - 1) != DIRECTORY_SIGNATURE)) {
				name += DIRECTORY_SIGNATURE;
			}
			if (this.files.has(name)) {
				throw new Error(ERR_DUPLICATED_NAME);
			}
			const rawFilename = (new TextEncoder()).encode(name);
			if (rawFilename.length > MAX_16_BITS) {
				throw new Error(ERR_INVALID_ENTRY_NAME);
			}
			const comment = options.comment || "";
			const rawComment = (new TextEncoder()).encode(comment);
			if (rawComment.length > MAX_16_BITS) {
				throw new Error(ERR_INVALID_ENTRY_COMMENT);
			}
			const version = this.options.version || options.version || 0;
			if (version > MAX_16_BITS) {
				throw new Error(ERR_INVALID_VERSION);
			}
			const lastModDate = options.lastModDate || new Date();
			if (lastModDate.getFullYear() < 1980) {
				throw new Error(ERR_INVALID_DATE);
			}
			const password = options.password === undefined ? this.options.password : options.password;
			const encryptionStrength = (options.encryptionStrength === undefined ? this.options.encryptionStrength : options.encryptionStrength) || 3;
			if (password !== undefined && encryptionStrength !== undefined && (encryptionStrength < 1 || encryptionStrength > 3)) {
				throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
			}
			if (reader && !reader.initialized) {
				await reader.init();
			}
			let rawExtraField = new Uint8Array(0);
			const extraField = options.extraField;
			if (extraField) {
				let extraFieldSize = 4, offset = 0;
				extraField.forEach(data => extraFieldSize += data.length);
				rawExtraField = new Uint8Array(extraFieldSize);
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
			const zip64 = options.zip64 || this.options.zip64 || this.offset >= MAX_32_BITS || (reader && (reader.size >= MAX_32_BITS || this.offset + reader.size >= MAX_32_BITS));
			const level = options.level === undefined ? this.options.level : options.level;
			const useWebWorkers = options.useWebWorkers === undefined ? this.options.useWebWorkers : options.useWebWorkers;
			const fileEntry = await addFile(this, name, reader, Object.assign({}, options,
				{ rawFilename, rawComment, version, lastModDate, rawExtraField, zip64, password, level, useWebWorkers, encryptionStrength }));
			fileEntry.filename = name;
			fileEntry.comment = comment;
			fileEntry.extraField = extraField;
			return new Entry(fileEntry);
		}

		async close(comment = new Uint8Array(0)) {
			const writer = this.writer;
			const files = this.files;
			let offset = 0, directoryDataLength = 0, directoryOffset = this.offset, filesLength = files.size;
			for (const [, fileEntry] of files) {
				directoryDataLength += 46 + fileEntry.rawFilename.length + fileEntry.rawComment.length + fileEntry.rawExtraFieldZip64.length + fileEntry.rawExtraFieldAES.length + fileEntry.rawExtraField.length;
			}
			const zip64 = this.options.zip64 || directoryOffset + directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS;
			const directoryArray = new Uint8Array(directoryDataLength + (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH));
			const directoryView = new DataView(directoryArray.buffer);
			if (comment.length) {
				if (comment.length <= MAX_16_BITS) {
					setUint16(directoryView, offset + 20, comment.length);
				} else {
					throw new Error(ERR_INVALID_COMMENT);
				}
			}
			for (const [, fileEntry] of files) {
				const rawFilename = fileEntry.rawFilename;
				const rawExtraFieldZip64 = fileEntry.rawExtraFieldZip64;
				const rawExtraFieldAES = fileEntry.rawExtraFieldAES;
				const extraFieldLength = rawExtraFieldZip64.length + rawExtraFieldAES.length + fileEntry.rawExtraField.length;
				setUint32$1(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
				setUint16(directoryView, offset + 4, fileEntry.version);
				directoryArray.set(fileEntry.headerArray, offset + 6);
				setUint16(directoryView, offset + 30, extraFieldLength);
				setUint16(directoryView, offset + 32, fileEntry.rawComment.length);
				if (fileEntry.directory) {
					setUint8(directoryView, offset + 38, FILE_ATTR_MSDOS_DIR_MASK);
				}
				if (fileEntry.zip64) {
					setUint32$1(directoryView, offset + 42, MAX_32_BITS);
				} else {
					setUint32$1(directoryView, offset + 42, fileEntry.offset);
				}
				directoryArray.set(rawFilename, offset + 46);
				directoryArray.set(rawExtraFieldZip64, offset + 46 + rawFilename.length);
				directoryArray.set(rawExtraFieldAES, offset + 46 + rawFilename.length + rawExtraFieldZip64.length);
				directoryArray.set(fileEntry.rawExtraField, 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length);
				directoryArray.set(fileEntry.rawComment, offset + 46 + rawFilename.length + extraFieldLength);
				offset += 46 + rawFilename.length + extraFieldLength + fileEntry.rawComment.length;
			}
			if (zip64) {
				setUint32$1(directoryView, offset, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
				setBigUint64(directoryView, offset + 4, BigInt(44));
				setUint16(directoryView, offset + 12, 45);
				setUint16(directoryView, offset + 14, 45);
				setBigUint64(directoryView, offset + 24, BigInt(filesLength));
				setBigUint64(directoryView, offset + 32, BigInt(filesLength));
				setBigUint64(directoryView, offset + 40, BigInt(directoryDataLength));
				setBigUint64(directoryView, offset + 48, BigInt(directoryOffset));
				setUint32$1(directoryView, offset + 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
				setBigUint64(directoryView, offset + 64, BigInt(directoryOffset + directoryDataLength));
				setUint32$1(directoryView, offset + 72, ZIP64_TOTAL_NUMBER_OF_DISKS);
				filesLength = MAX_16_BITS;
				directoryOffset = MAX_32_BITS;
				offset += 76;
			}
			setUint32$1(directoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
			setUint16(directoryView, offset + 8, filesLength);
			setUint16(directoryView, offset + 10, filesLength);
			setUint32$1(directoryView, offset + 12, directoryDataLength);
			setUint32$1(directoryView, offset + 16, directoryOffset);
			await writer.writeUint8Array(directoryArray);
			await writer.writeUint8Array(comment);
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
					await fileWriter.init();
				} else {
					zipWriter.lockWrite = new Promise(resolve => resolveLockWrite = resolve);
					if (!writer.initialized) {
						await writer.init();
					}
					fileWriter = writer;
				}
				fileEntry = await createFileEntry(reader, fileWriter, zipWriter.config, options);
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
				const rawExtraFieldZip64View = new DataView(fileEntry.rawExtraFieldZip64.buffer);
				setBigUint64(rawExtraFieldZip64View, 20, BigInt(fileEntry.offset));
			}
			zipWriter.offset += fileEntry.length;
			return fileEntry;
		} finally {
			if (resolveLockWrite) {
				zipWriter.lockWrite = null;
				resolveLockWrite();
			}
		}
	}

	async function createFileEntry(reader, writer, config, options) {
		const rawFilename = options.rawFilename;
		const lastModDate = options.lastModDate;
		const outputPassword = options.password;
		const outputEncrypted = Boolean(outputPassword && outputPassword.length);
		const level = options.level;
		const outputCompressed = level !== 0 && !options.directory;
		const zip64 = options.zip64;
		let rawExtraFieldAES, outputEncryptionStrength;
		if (outputEncrypted) {
			rawExtraFieldAES = new Uint8Array(EXTRAFIELD_DATA_AES.length + 2);
			const extraFieldAESView = new DataView(rawExtraFieldAES.buffer);
			setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
			rawExtraFieldAES.set(EXTRAFIELD_DATA_AES, 2);
			outputEncryptionStrength = options.encryptionStrength;
			setUint8(extraFieldAESView, 8, outputEncryptionStrength);
		} else {
			rawExtraFieldAES = new Uint8Array(0);
		}
		const fileEntry = {
			version: options.version || VERSION_DEFLATE,
			zip64,
			directory: Boolean(options.directory),
			filenameUTF8: true,
			rawFilename,
			commentUTF8: true,
			rawComment: options.rawComment,
			rawExtraFieldZip64: zip64 ? new Uint8Array(EXTRAFIELD_LENGTH_ZIP64 + 4) : new Uint8Array(0),
			rawExtraFieldAES: rawExtraFieldAES,
			rawExtraField: options.rawExtraField
		};
		let bitFlag = BITFLAG_DATA_DESCRIPTOR | BITFLAG_LANG_ENCODING_FLAG;
		let compressionMethod = COMPRESSION_METHOD_STORE;
		if (outputCompressed) {
			compressionMethod = COMPRESSION_METHOD_DEFLATE;
		}
		if (zip64) {
			fileEntry.version = fileEntry.version > VERSION_ZIP64 ? fileEntry.version : VERSION_ZIP64;
		}
		if (outputEncrypted) {
			fileEntry.version = fileEntry.version > VERSION_AES ? fileEntry.version : VERSION_AES;
			bitFlag = bitFlag | BITFLAG_ENCRYPTED;
			compressionMethod = COMPRESSION_METHOD_AES;
			if (outputCompressed) {
				fileEntry.rawExtraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
			}
		}
		const headerArray = fileEntry.headerArray = new Uint8Array(26);
		const headerView = new DataView(headerArray.buffer);
		setUint16(headerView, 0, fileEntry.version);
		setUint16(headerView, 2, bitFlag);
		setUint16(headerView, 4, compressionMethod);
		setUint16(headerView, 6, (((lastModDate.getHours() << 6) | lastModDate.getMinutes()) << 5) | lastModDate.getSeconds() / 2);
		setUint16(headerView, 8, ((((lastModDate.getFullYear() - 1980) << 4) | (lastModDate.getMonth() + 1)) << 5) | lastModDate.getDate());
		setUint16(headerView, 22, rawFilename.length);
		setUint16(headerView, 24, 0);
		const rawLastModDate = headerView.getUint32(6, true);
		const fileDataArray = new Uint8Array(30 + rawFilename.length);
		const fileDataView = new DataView(fileDataArray.buffer);
		setUint32$1(fileDataView, 0, LOCAL_FILE_HEADER_SIGNATURE);
		fileDataArray.set(headerArray, 4);
		fileDataArray.set(rawFilename, 30);
		let result, uncompressedSize = 0, compressedSize = 0;
		if (reader) {
			uncompressedSize = reader.size;
			const codec = await createWorkerCodec({
				codecType: CODEC_DEFLATE,
				codecConstructor: config.Deflate,
				level,
				outputPassword,
				outputEncryptionStrength,
				outputSigned: true,
				outputCompressed,
				outputEncrypted,
				useWebWorkers: options.useWebWorkers
			}, config);
			await writer.writeUint8Array(fileDataArray);
			result = await processData(codec, reader, writer, 0, uncompressedSize, config, { onprogress: options.onprogress });
			compressedSize = result.length;
		} else {
			await writer.writeUint8Array(fileDataArray);
		}
		const footerArray = new Uint8Array(zip64 ? 24 : 16);
		const footerView = new DataView(footerArray.buffer);
		setUint32$1(footerView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
		if (reader) {
			if (!outputEncrypted && result.signature !== undefined) {
				setUint32$1(headerView, 10, result.signature);
				setUint32$1(footerView, 4, result.signature);
				fileEntry.signature = result.signature;
			}
			if (zip64) {
				const rawExtraFieldZip64View = new DataView(fileEntry.rawExtraFieldZip64.buffer);
				setUint16(rawExtraFieldZip64View, 0, EXTRAFIELD_TYPE_ZIP64);
				setUint16(rawExtraFieldZip64View, 2, EXTRAFIELD_LENGTH_ZIP64);
				setUint32$1(headerView, 14, MAX_32_BITS);
				setBigUint64(footerView, 8, BigInt(compressedSize));
				setBigUint64(rawExtraFieldZip64View, 12, BigInt(compressedSize));
				setUint32$1(headerView, 18, MAX_32_BITS);
				setBigUint64(footerView, 16, BigInt(uncompressedSize));
				setBigUint64(rawExtraFieldZip64View, 4, BigInt(uncompressedSize));
			} else {
				setUint32$1(headerView, 14, compressedSize);
				setUint32$1(footerView, 8, compressedSize);
				setUint32$1(headerView, 18, uncompressedSize);
				setUint32$1(footerView, 12, uncompressedSize);
			}
		}
		await writer.writeUint8Array(footerArray);
		fileEntry.compressedSize = compressedSize;
		fileEntry.uncompressedSize = uncompressedSize;
		fileEntry.lastModDate = lastModDate;
		fileEntry.rawLastModDate = rawLastModDate;
		fileEntry.encrypted = outputEncrypted;
		fileEntry.length = fileDataArray.length + (result ? result.length : 0) + footerArray.length;
		return fileEntry;
	}

	function setUint8(view, offset, value) {
		view.setUint8(offset, value);
	}

	function setUint16(view, offset, value) {
		view.setUint16(offset, value, true);
	}

	function setUint32$1(view, offset, value) {
		view.setUint32(offset, value, true);
	}

	function setBigUint64(view, offset, value) {
		view.setBigUint64(offset, value, true);
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

	const DEFAULT_CONFIGURATION = {
		chunkSize: 512 * 1024,
		maxWorkers: (typeof navigator != "undefined" && navigator.hardwareConcurrency) || 2,
		useWebWorkers: true,
		workerScripts: undefined
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
		if (configuration.chunkSize !== undefined) {
			config.chunkSize = configuration.chunkSize;
		}
		if (configuration.maxWorkers !== undefined) {
			config.maxWorkers = configuration.maxWorkers;
		}
		if (configuration.useWebWorkers !== undefined) {
			config.useWebWorkers = configuration.useWebWorkers;
		}
		if (configuration.Deflate !== undefined) {
			config.Deflate = configuration.Deflate;
		}
		if (configuration.Inflate !== undefined) {
			config.Inflate = configuration.Inflate;
		}
		if (configuration.workerScripts !== undefined) {
			if (configuration.workerScripts.deflate) {
				if (!Array.isArray(configuration.workerScripts.deflate)) {
					throw new Error("workerScripts.deflate must be an array");
				}
				if (!config.workerScripts) {
					config.workerScripts = {};
				}
				config.workerScripts.deflate = configuration.workerScripts.deflate;
			}
			if (configuration.workerScripts.inflate) {
				if (!Array.isArray(configuration.workerScripts.inflate)) {
					throw new Error("workerScripts.inflate must be an array");
				}
				if (!config.workerScripts) {
					config.workerScripts = {};
				}
				config.workerScripts.inflate = configuration.workerScripts.inflate;
			}
		}
	}

	function getMimeType() {
		return "application/octet-stream";
	}

	var configureWebWorker = ()=>{const e=URL.createObjectURL(new Blob(["("+(()=>{class t{constructor(){this.crc=-1,this.table=(()=>{const t=[];for(let e=0;e<256;e++){let n=e;for(let t=0;t<8;t++)1&n?n=n>>>1^3988292384:n>>>=1;t[e]=n;}return t})();}append(t){const e=this.table;let n=0|this.crc;for(let i=0,a=0|t.length;i<a;i++)n=n>>>8^e[255&(n^t[i])];this.crc=n;}get(){return ~this.crc}}const e={name:"PBKDF2"},n={name:"HMAC"},i={name:"AES-CTR"},a=Object.assign({hash:n},e),r=Object.assign({iterations:1e3,hash:{name:"SHA-1"}},e),s=Object.assign({hash:"SHA-1"},n),l=Object.assign({length:16},i),o=["deriveBits"],_=["sign"],d=[8,12,16],u=[16,24,32],f=[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],c=crypto.subtle;class h{constructor(t,e,n){this.password=t,this.signed=e,this.strength=n-1,this.input=e&&new Uint8Array(0),this.pendingInput=new Uint8Array(0);}async append(t){const e=async(a=0)=>{if(a+16<=i.length-10){const t=i.subarray(a,a+16),r=await c.decrypt(Object.assign({counter:this.counter},l),this.keys.key,t);return x(this.counter),n.set(new Uint8Array(r),a),e(a+16)}return this.pendingInput=i.subarray(a),this.signed&&(this.input=p(this.input,t)),n};if(this.password){const e=t.subarray(0,d[this.strength]+2);await async function(t,e,n){await w(t,n,e.subarray(0,d[t.strength]),["decrypt"]);const i=e.subarray(d[t.strength]),a=t.keys.passwordVerification;if(a[0]!=i[0]||a[1]!=i[1])throw new Error("Invalid pasword")}(this,e,this.password),this.password=null,t=t.subarray(d[this.strength]+2);}let n=new Uint8Array(t.length-10-(t.length-10)%16),i=t;return this.pendingInput.length&&(i=p(this.pendingInput,t),n=g(n,i.length-10-(i.length-10)%16)),e()}async flush(){const t=this.pendingInput,e=this.keys,i=t.subarray(0,t.length-10),a=t.subarray(t.length-10);let r=new Uint8Array(0);if(i.length){const t=await c.decrypt(Object.assign({counter:this.counter},l),e.key,i);r=new Uint8Array(t);}let s=!0;if(this.signed){const t=await c.sign(n,e.authentication,this.input.subarray(0,this.input.length-10)),i=new Uint8Array(t);this.input=null;for(let t=0;t<10;t++)i[t]!=a[t]&&(s=!1);}return {valid:s,data:r}}}class b{constructor(t,e){this.password=t,this.strength=e-1,this.output=new Uint8Array(0),this.pendingInput=new Uint8Array(0);}async append(t){const e=async(a=0)=>{if(a+16<=t.length){const r=t.subarray(a,a+16),s=await c.encrypt(Object.assign({counter:this.counter},l),this.keys.key,r);return x(this.counter),i.set(new Uint8Array(s),a+n.length),e(a+16)}return this.pendingInput=t.subarray(a),this.output=p(this.output,i),i};let n=new Uint8Array(0);this.password&&(n=await async function(t,e){const n=crypto.getRandomValues(new Uint8Array(d[t.strength]));return await w(t,e,n,["encrypt"]),p(n,t.keys.passwordVerification)}(this,this.password),this.password=null);let i=new Uint8Array(n.length+t.length-t.length%16);return i.set(n,0),this.pendingInput.length&&(t=p(this.pendingInput,t),i=g(i,t.length-t.length%16)),e()}async flush(){let t=new Uint8Array(0);if(this.pendingInput.length){const e=await c.encrypt(Object.assign({counter:this.counter},l),this.keys.key,this.pendingInput);t=new Uint8Array(e),this.output=p(this.output,t);}const e=await c.sign(n,this.keys.authentication,this.output.subarray(d[this.strength]+2));this.output=null;const i=new Uint8Array(e).subarray(0,10);return {data:p(t,i),signature:i}}}async function w(t,e,n,l){t.counter=new Uint8Array(f);const d=(new TextEncoder).encode(e),h=await c.importKey("raw",d,a,!1,o),b=await c.deriveBits(Object.assign({salt:n},r),h,8*(2*u[t.strength]+2)),w=new Uint8Array(b);t.keys={key:await c.importKey("raw",w.subarray(0,u[t.strength]),i,!0,l),authentication:await c.importKey("raw",w.subarray(u[t.strength],2*u[t.strength]),s,!1,_),passwordVerification:w.subarray(2*u[t.strength])};}function x(t){for(let e=0;e<16;e++){if(255!=t[e]){t[e]++;break}t[e]=0;}}function p(t,e){let n=t;return t.length+e.length&&(n=new Uint8Array(t.length+e.length),n.set(t,0),n.set(e,t.length)),n}function g(t,e){if(e&&e>t.length){const n=t;(t=new Uint8Array(e)).set(n,0);}return t}class y{constructor(e){this.signature=e.inputSignature,this.encrypted=Boolean(e.inputPassword),this.signed=e.inputSigned,this.compressed=e.inputCompressed,this.inflate=e.inputCompressed&&new e.codecConstructor,this.crc32=e.inputSigned&&new t,this.decrypt=this.encrypted&&new h(e.inputPassword,e.inputSigned,e.inputEncryptionStrength);}async append(t){return this.encrypted&&(t=await this.decrypt.append(t)),this.compressed&&t.length&&(t=await this.inflate.append(t)),!this.encrypted&&this.signed&&this.crc32.append(t),t}async flush(){let t,e=new Uint8Array(0);if(this.encrypted){const t=await this.decrypt.flush();if(!t.valid)throw new Error("Invalid signature");e=t.data;}else if(this.signed){const e=new DataView(new Uint8Array(4).buffer);if(t=this.crc32.get(),e.setUint32(0,t),this.signature!=e.getUint32(0,!1))throw new Error("Invalid signature")}return this.compressed&&(e=await this.inflate.append(e)||new Uint8Array(0),await this.inflate.flush()),{data:e,signature:t}}}class m{constructor(e){this.encrypted=e.outputEncrypted,this.signed=e.outputSigned,this.compressed=e.outputCompressed,this.deflate=e.outputCompressed&&new e.codecConstructor({level:e.level||5}),this.crc32=e.outputSigned&&new t,this.encrypt=this.encrypted&&new b(e.outputPassword,e.outputEncryptionStrength);}async append(t){let e=t;return this.compressed&&t.length&&(e=await this.deflate.append(t)),this.encrypted?e=await this.encrypt.append(e):this.signed&&this.crc32.append(t),e}async flush(){let t,e=new Uint8Array(0);if(this.compressed&&(e=await this.deflate.flush()||new Uint8Array(0)),this.encrypted){e=await this.encrypt.append(e);const n=await this.encrypt.flush();t=n.signature;const i=new Uint8Array(e.length+n.data.length);i.set(e,0),i.set(n.data,e.length),e=i;}else this.signed&&(t=this.crc32.get());return {data:e,signature:t}}}const v={init(t){t.scripts&&t.scripts.length&&importScripts.apply(void 0,t.scripts);const e=t.options;self.initCodec&&self.initCodec(),e.codecType.startsWith("deflate")?e.codecConstructor=self.Deflate:e.codecType.startsWith("inflate")&&(e.codecConstructor=self.Inflate),k=function(t){return t.codecType.startsWith("deflate")?new m(t):t.codecType.startsWith("inflate")?new y(t):void 0}(e);},append:async t=>({data:await k.append(t.data)}),flush:()=>k.flush()};let k;function A(t){return t.map((([t,e])=>new Array(t).fill(e,0,t))).flat()}addEventListener("message",(async t=>{const e=t.data,n=e.type,i=v[n];if(i)try{const t=await i(e)||{};if(t.type=n,t.data)try{postMessage(t,[t.data.buffer]);}catch(e){postMessage(t);}else postMessage(t);}catch(t){postMessage({type:n,error:{message:t.message,stack:t.stack}});}}));const U=[0,1,2,3].concat(...A([[2,4],[2,5],[4,6],[4,7],[8,8],[8,9],[16,10],[16,11],[32,12],[32,13],[64,14],[64,15],[2,0],[1,16],[1,17],[2,18],[2,19],[4,20],[4,21],[8,22],[8,23],[16,24],[16,25],[32,26],[32,27],[64,28],[64,29]]));function I(){const t=this;function e(t,e){let n=0;do{n|=1&t,t>>>=1,n<<=1;}while(--e>0);return n>>>1}t.build_tree=function(n){const i=t.dyn_tree,a=t.stat_desc.static_tree,r=t.stat_desc.elems;let s,l,o,_=-1;for(n.heap_len=0,n.heap_max=573,s=0;s<r;s++)0!==i[2*s]?(n.heap[++n.heap_len]=_=s,n.depth[s]=0):i[2*s+1]=0;for(;n.heap_len<2;)o=n.heap[++n.heap_len]=_<2?++_:0,i[2*o]=1,n.depth[o]=0,n.opt_len--,a&&(n.static_len-=a[2*o+1]);for(t.max_code=_,s=Math.floor(n.heap_len/2);s>=1;s--)n.pqdownheap(i,s);o=r;do{s=n.heap[1],n.heap[1]=n.heap[n.heap_len--],n.pqdownheap(i,1),l=n.heap[1],n.heap[--n.heap_max]=s,n.heap[--n.heap_max]=l,i[2*o]=i[2*s]+i[2*l],n.depth[o]=Math.max(n.depth[s],n.depth[l])+1,i[2*s+1]=i[2*l+1]=o,n.heap[1]=o++,n.pqdownheap(i,1);}while(n.heap_len>=2);n.heap[--n.heap_max]=n.heap[1],function(e){const n=t.dyn_tree,i=t.stat_desc.static_tree,a=t.stat_desc.extra_bits,r=t.stat_desc.extra_base,s=t.stat_desc.max_length;let l,o,_,d,u,f,c=0;for(d=0;d<=15;d++)e.bl_count[d]=0;for(n[2*e.heap[e.heap_max]+1]=0,l=e.heap_max+1;l<573;l++)o=e.heap[l],d=n[2*n[2*o+1]+1]+1,d>s&&(d=s,c++),n[2*o+1]=d,o>t.max_code||(e.bl_count[d]++,u=0,o>=r&&(u=a[o-r]),f=n[2*o],e.opt_len+=f*(d+u),i&&(e.static_len+=f*(i[2*o+1]+u)));if(0!==c){do{for(d=s-1;0===e.bl_count[d];)d--;e.bl_count[d]--,e.bl_count[d+1]+=2,e.bl_count[s]--,c-=2;}while(c>0);for(d=s;0!==d;d--)for(o=e.bl_count[d];0!==o;)_=e.heap[--l],_>t.max_code||(n[2*_+1]!=d&&(e.opt_len+=(d-n[2*_+1])*n[2*_],n[2*_+1]=d),o--);}}(n),function(t,n,i){const a=[];let r,s,l,o=0;for(r=1;r<=15;r++)a[r]=o=o+i[r-1]<<1;for(s=0;s<=n;s++)l=t[2*s+1],0!==l&&(t[2*s]=e(a[l]++,l));}(i,t.max_code,n.bl_count);};}function E(t,e,n,i,a){const r=this;r.static_tree=t,r.extra_bits=e,r.extra_base=n,r.elems=i,r.max_length=a;}function S(t,e,n,i,a){const r=this;r.good_length=t,r.max_lazy=e,r.nice_length=n,r.max_chain=i,r.func=a;}I._length_code=[0,1,2,3,4,5,6,7].concat(...A([[2,8],[2,9],[2,10],[2,11],[4,12],[4,13],[4,14],[4,15],[8,16],[8,17],[8,18],[8,19],[16,20],[16,21],[16,22],[16,23],[32,24],[32,25],[32,26],[31,27],[1,28]])),I.base_length=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],I.base_dist=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],I.d_code=function(t){return t<256?U[t]:U[256+(t>>>7)]},I.extra_lbits=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],I.extra_dbits=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],I.extra_blbits=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],I.bl_order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],E.static_ltree=[12,8,140,8,76,8,204,8,44,8,172,8,108,8,236,8,28,8,156,8,92,8,220,8,60,8,188,8,124,8,252,8,2,8,130,8,66,8,194,8,34,8,162,8,98,8,226,8,18,8,146,8,82,8,210,8,50,8,178,8,114,8,242,8,10,8,138,8,74,8,202,8,42,8,170,8,106,8,234,8,26,8,154,8,90,8,218,8,58,8,186,8,122,8,250,8,6,8,134,8,70,8,198,8,38,8,166,8,102,8,230,8,22,8,150,8,86,8,214,8,54,8,182,8,118,8,246,8,14,8,142,8,78,8,206,8,46,8,174,8,110,8,238,8,30,8,158,8,94,8,222,8,62,8,190,8,126,8,254,8,1,8,129,8,65,8,193,8,33,8,161,8,97,8,225,8,17,8,145,8,81,8,209,8,49,8,177,8,113,8,241,8,9,8,137,8,73,8,201,8,41,8,169,8,105,8,233,8,25,8,153,8,89,8,217,8,57,8,185,8,121,8,249,8,5,8,133,8,69,8,197,8,37,8,165,8,101,8,229,8,21,8,149,8,85,8,213,8,53,8,181,8,117,8,245,8,13,8,141,8,77,8,205,8,45,8,173,8,109,8,237,8,29,8,157,8,93,8,221,8,61,8,189,8,125,8,253,8,19,9,275,9,147,9,403,9,83,9,339,9,211,9,467,9,51,9,307,9,179,9,435,9,115,9,371,9,243,9,499,9,11,9,267,9,139,9,395,9,75,9,331,9,203,9,459,9,43,9,299,9,171,9,427,9,107,9,363,9,235,9,491,9,27,9,283,9,155,9,411,9,91,9,347,9,219,9,475,9,59,9,315,9,187,9,443,9,123,9,379,9,251,9,507,9,7,9,263,9,135,9,391,9,71,9,327,9,199,9,455,9,39,9,295,9,167,9,423,9,103,9,359,9,231,9,487,9,23,9,279,9,151,9,407,9,87,9,343,9,215,9,471,9,55,9,311,9,183,9,439,9,119,9,375,9,247,9,503,9,15,9,271,9,143,9,399,9,79,9,335,9,207,9,463,9,47,9,303,9,175,9,431,9,111,9,367,9,239,9,495,9,31,9,287,9,159,9,415,9,95,9,351,9,223,9,479,9,63,9,319,9,191,9,447,9,127,9,383,9,255,9,511,9,0,7,64,7,32,7,96,7,16,7,80,7,48,7,112,7,8,7,72,7,40,7,104,7,24,7,88,7,56,7,120,7,4,7,68,7,36,7,100,7,20,7,84,7,52,7,116,7,3,8,131,8,67,8,195,8,35,8,163,8,99,8,227,8],E.static_dtree=[0,5,16,5,8,5,24,5,4,5,20,5,12,5,28,5,2,5,18,5,10,5,26,5,6,5,22,5,14,5,30,5,1,5,17,5,9,5,25,5,5,5,21,5,13,5,29,5,3,5,19,5,11,5,27,5,7,5,23,5],E.static_l_desc=new E(E.static_ltree,I.extra_lbits,257,286,15),E.static_d_desc=new E(E.static_dtree,I.extra_dbits,0,30,15),E.static_bl_desc=new E(null,I.extra_blbits,0,19,7);const C=[new S(0,0,0,0,0),new S(4,4,8,4,1),new S(4,5,16,8,1),new S(4,6,32,32,1),new S(4,4,16,16,2),new S(8,16,32,32,2),new S(8,16,128,128,2),new S(8,32,128,256,2),new S(32,128,258,1024,2),new S(32,258,258,4096,2)],j=["need dictionary","stream end","","","stream error","data error","","buffer error","",""];function M(t,e,n,i){const a=t[2*e],r=t[2*n];return a<r||a==r&&i[e]<=i[n]}function D(){const t=this;let e,n,i,a,r,s,l,o,_,d,u,f,c,h,b,w,x,p,g,y,m,v,k,A,U,S,D,O,P,T,z,B,V;const q=new I,K=new I,R=new I;let W,H,L,F,G,J,N,Q;function X(){let e;for(e=0;e<286;e++)z[2*e]=0;for(e=0;e<30;e++)B[2*e]=0;for(e=0;e<19;e++)V[2*e]=0;z[512]=1,t.opt_len=t.static_len=0,L=G=0;}function Y(t,e){let n,i=-1,a=t[1],r=0,s=7,l=4;0===a&&(s=138,l=3),t[2*(e+1)+1]=65535;for(let o=0;o<=e;o++)n=a,a=t[2*(o+1)+1],++r<s&&n==a||(r<l?V[2*n]+=r:0!==n?(n!=i&&V[2*n]++,V[32]++):r<=10?V[34]++:V[36]++,r=0,i=n,0===a?(s=138,l=3):n==a?(s=6,l=3):(s=7,l=4));}function Z(e){t.pending_buf[t.pending++]=e;}function $(t){Z(255&t),Z(t>>>8&255);}function tt(t,e){let n;const i=e;Q>16-i?(n=t,N|=n<<Q&65535,$(N),N=n>>>16-Q,Q+=i-16):(N|=t<<Q&65535,Q+=i);}function et(t,e){const n=2*t;tt(65535&e[n],65535&e[n+1]);}function nt(t,e){let n,i,a=-1,r=t[1],s=0,l=7,o=4;for(0===r&&(l=138,o=3),n=0;n<=e;n++)if(i=r,r=t[2*(n+1)+1],!(++s<l&&i==r)){if(s<o)do{et(i,V);}while(0!=--s);else 0!==i?(i!=a&&(et(i,V),s--),et(16,V),tt(s-3,2)):s<=10?(et(17,V),tt(s-3,3)):(et(18,V),tt(s-11,7));s=0,a=i,0===r?(l=138,o=3):i==r?(l=6,o=3):(l=7,o=4);}}function it(){16==Q?($(N),N=0,Q=0):Q>=8&&(Z(255&N),N>>>=8,Q-=8);}function at(e,n){let i,a,r;if(t.pending_buf[F+2*L]=e>>>8&255,t.pending_buf[F+2*L+1]=255&e,t.pending_buf[W+L]=255&n,L++,0===e?z[2*n]++:(G++,e--,z[2*(I._length_code[n]+256+1)]++,B[2*I.d_code(e)]++),0==(8191&L)&&D>2){for(i=8*L,a=m-x,r=0;r<30;r++)i+=B[2*r]*(5+I.extra_dbits[r]);if(i>>>=3,G<Math.floor(L/2)&&i<Math.floor(a/2))return !0}return L==H-1}function rt(e,n){let i,a,r,s,l=0;if(0!==L)do{i=t.pending_buf[F+2*l]<<8&65280|255&t.pending_buf[F+2*l+1],a=255&t.pending_buf[W+l],l++,0===i?et(a,e):(r=I._length_code[a],et(r+256+1,e),s=I.extra_lbits[r],0!==s&&(a-=I.base_length[r],tt(a,s)),i--,r=I.d_code(i),et(r,n),s=I.extra_dbits[r],0!==s&&(i-=I.base_dist[r],tt(i,s)));}while(l<L);et(256,e),J=e[513];}function st(){Q>8?$(N):Q>0&&Z(255&N),N=0,Q=0;}function lt(e,n,i){tt(0+(i?1:0),3),function(e,n,i){st(),J=8,$(n),$(~n),t.pending_buf.set(o.subarray(e,e+n),t.pending),t.pending+=n;}(e,n);}function ot(e,n,i){let a,r,s=0;D>0?(q.build_tree(t),K.build_tree(t),s=function(){let e;for(Y(z,q.max_code),Y(B,K.max_code),R.build_tree(t),e=18;e>=3&&0===V[2*I.bl_order[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(),a=t.opt_len+3+7>>>3,r=t.static_len+3+7>>>3,r<=a&&(a=r)):a=r=n+5,n+4<=a&&-1!=e?lt(e,n,i):r==a?(tt(2+(i?1:0),3),rt(E.static_ltree,E.static_dtree)):(tt(4+(i?1:0),3),function(t,e,n){let i;for(tt(t-257,5),tt(e-1,5),tt(n-4,4),i=0;i<n;i++)tt(V[2*I.bl_order[i]+1],3);nt(z,t-1),nt(B,e-1);}(q.max_code+1,K.max_code+1,s+1),rt(z,B)),X(),i&&st();}function _t(t){ot(x>=0?x:-1,m-x,t),x=m,e.flush_pending();}function dt(){let t,n,i,a;do{if(a=_-k-m,0===a&&0===m&&0===k)a=r;else if(-1==a)a--;else if(m>=r+r-262){o.set(o.subarray(r,r+r),0),v-=r,m-=r,x-=r,t=c,i=t;do{n=65535&u[--i],u[i]=n>=r?n-r:0;}while(0!=--t);t=r,i=t;do{n=65535&d[--i],d[i]=n>=r?n-r:0;}while(0!=--t);a+=r;}if(0===e.avail_in)return;t=e.read_buf(o,m+k,a),k+=t,k>=3&&(f=255&o[m],f=(f<<w^255&o[m+1])&b);}while(k<262&&0!==e.avail_in)}function ut(t){let e,n,i=U,a=m,s=A;const _=m>r-262?m-(r-262):0;let u=T;const f=l,c=m+258;let h=o[a+s-1],b=o[a+s];A>=P&&(i>>=2),u>k&&(u=k);do{if(e=t,o[e+s]==b&&o[e+s-1]==h&&o[e]==o[a]&&o[++e]==o[a+1]){a+=2,e++;do{}while(o[++a]==o[++e]&&o[++a]==o[++e]&&o[++a]==o[++e]&&o[++a]==o[++e]&&o[++a]==o[++e]&&o[++a]==o[++e]&&o[++a]==o[++e]&&o[++a]==o[++e]&&a<c);if(n=258-(c-a),a=c-258,n>s){if(v=t,s=n,n>=u)break;h=o[a+s-1],b=o[a+s];}}}while((t=65535&d[t&f])>_&&0!=--i);return s<=k?s:k}function ft(e){return e.total_in=e.total_out=0,e.msg=null,t.pending=0,t.pending_out=0,n=113,a=0,q.dyn_tree=z,q.stat_desc=E.static_l_desc,K.dyn_tree=B,K.stat_desc=E.static_d_desc,R.dyn_tree=V,R.stat_desc=E.static_bl_desc,N=0,Q=0,J=8,X(),function(){_=2*r,u[c-1]=0;for(let t=0;t<c-1;t++)u[t]=0;S=C[D].max_lazy,P=C[D].good_length,T=C[D].nice_length,U=C[D].max_chain,m=0,x=0,k=0,p=A=2,y=0,f=0;}(),0}t.depth=[],t.bl_count=[],t.heap=[],z=[],B=[],V=[],t.pqdownheap=function(e,n){const i=t.heap,a=i[n];let r=n<<1;for(;r<=t.heap_len&&(r<t.heap_len&&M(e,i[r+1],i[r],t.depth)&&r++,!M(e,a,i[r],t.depth));)i[n]=i[r],n=r,r<<=1;i[n]=a;},t.deflateInit=function(e,n,a,_,f,x){return _||(_=8),f||(f=8),x||(x=0),e.msg=null,-1==n&&(n=6),f<1||f>9||8!=_||a<9||a>15||n<0||n>9||x<0||x>2?-2:(e.dstate=t,s=a,r=1<<s,l=r-1,h=f+7,c=1<<h,b=c-1,w=Math.floor((h+3-1)/3),o=new Uint8Array(2*r),d=[],u=[],H=1<<f+6,t.pending_buf=new Uint8Array(4*H),i=4*H,F=Math.floor(H/2),W=3*H,D=n,O=x,ft(e))},t.deflateEnd=function(){return 42!=n&&113!=n&&666!=n?-2:(t.pending_buf=null,u=null,d=null,o=null,t.dstate=null,113==n?-3:0)},t.deflateParams=function(t,e,n){let i=0;return -1==e&&(e=6),e<0||e>9||n<0||n>2?-2:(C[D].func!=C[e].func&&0!==t.total_in&&(i=t.deflate(1)),D!=e&&(D=e,S=C[D].max_lazy,P=C[D].good_length,T=C[D].nice_length,U=C[D].max_chain),O=n,i)},t.deflateSetDictionary=function(t,e,i){let a,s=i,_=0;if(!e||42!=n)return -2;if(s<3)return 0;for(s>r-262&&(s=r-262,_=i-s),o.set(e.subarray(_,_+s),0),m=s,x=s,f=255&o[0],f=(f<<w^255&o[1])&b,a=0;a<=s-3;a++)f=(f<<w^255&o[a+2])&b,d[a&l]=u[f],u[f]=a;return 0},t.deflate=function(_,h){let U,I,M,P,T;if(h>4||h<0)return -2;if(!_.next_out||!_.next_in&&0!==_.avail_in||666==n&&4!=h)return _.msg=j[4],-2;if(0===_.avail_out)return _.msg=j[7],-5;var z;if(e=_,P=a,a=h,42==n&&(I=8+(s-8<<4)<<8,M=(D-1&255)>>1,M>3&&(M=3),I|=M<<6,0!==m&&(I|=32),I+=31-I%31,n=113,Z((z=I)>>8&255),Z(255&z)),0!==t.pending){if(e.flush_pending(),0===e.avail_out)return a=-1,0}else if(0===e.avail_in&&h<=P&&4!=h)return e.msg=j[7],-5;if(666==n&&0!==e.avail_in)return _.msg=j[7],-5;if(0!==e.avail_in||0!==k||0!=h&&666!=n){switch(T=-1,C[D].func){case 0:T=function(t){let n,a=65535;for(a>i-5&&(a=i-5);;){if(k<=1){if(dt(),0===k&&0==t)return 0;if(0===k)break}if(m+=k,k=0,n=x+a,(0===m||m>=n)&&(k=m-n,m=n,_t(!1),0===e.avail_out))return 0;if(m-x>=r-262&&(_t(!1),0===e.avail_out))return 0}return _t(4==t),0===e.avail_out?4==t?2:0:4==t?3:1}(h);break;case 1:T=function(t){let n,i=0;for(;;){if(k<262){if(dt(),k<262&&0==t)return 0;if(0===k)break}if(k>=3&&(f=(f<<w^255&o[m+2])&b,i=65535&u[f],d[m&l]=u[f],u[f]=m),0!==i&&(m-i&65535)<=r-262&&2!=O&&(p=ut(i)),p>=3)if(n=at(m-v,p-3),k-=p,p<=S&&k>=3){p--;do{m++,f=(f<<w^255&o[m+2])&b,i=65535&u[f],d[m&l]=u[f],u[f]=m;}while(0!=--p);m++;}else m+=p,p=0,f=255&o[m],f=(f<<w^255&o[m+1])&b;else n=at(0,255&o[m]),k--,m++;if(n&&(_t(!1),0===e.avail_out))return 0}return _t(4==t),0===e.avail_out?4==t?2:0:4==t?3:1}(h);break;case 2:T=function(t){let n,i,a=0;for(;;){if(k<262){if(dt(),k<262&&0==t)return 0;if(0===k)break}if(k>=3&&(f=(f<<w^255&o[m+2])&b,a=65535&u[f],d[m&l]=u[f],u[f]=m),A=p,g=v,p=2,0!==a&&A<S&&(m-a&65535)<=r-262&&(2!=O&&(p=ut(a)),p<=5&&(1==O||3==p&&m-v>4096)&&(p=2)),A>=3&&p<=A){i=m+k-3,n=at(m-1-g,A-3),k-=A-1,A-=2;do{++m<=i&&(f=(f<<w^255&o[m+2])&b,a=65535&u[f],d[m&l]=u[f],u[f]=m);}while(0!=--A);if(y=0,p=2,m++,n&&(_t(!1),0===e.avail_out))return 0}else if(0!==y){if(n=at(0,255&o[m-1]),n&&_t(!1),m++,k--,0===e.avail_out)return 0}else y=1,m++,k--;}return 0!==y&&(n=at(0,255&o[m-1]),y=0),_t(4==t),0===e.avail_out?4==t?2:0:4==t?3:1}(h);}if(2!=T&&3!=T||(n=666),0==T||2==T)return 0===e.avail_out&&(a=-1),0;if(1==T){if(1==h)tt(2,3),et(256,E.static_ltree),it(),1+J+10-Q<9&&(tt(2,3),et(256,E.static_ltree),it()),J=7;else if(lt(0,0,!1),3==h)for(U=0;U<c;U++)u[U]=0;if(e.flush_pending(),0===e.avail_out)return a=-1,0}}return 4!=h?0:1};}function O(){const t=this;t.next_in_index=0,t.next_out_index=0,t.avail_in=0,t.total_in=0,t.avail_out=0,t.total_out=0;}function P(t){const e=new O,n=512,i=new Uint8Array(n);let a=t?t.level:-1;void 0===a&&(a=-1),e.deflateInit(a),e.next_out=i,this.append=function(t,a){let r,s,l=0,o=0,_=0;const d=[];if(t.length){e.next_in_index=0,e.next_in=t,e.avail_in=t.length;do{if(e.next_out_index=0,e.avail_out=n,r=e.deflate(0),0!=r)throw new Error("deflating: "+e.msg);e.next_out_index&&(e.next_out_index==n?d.push(new Uint8Array(i)):d.push(new Uint8Array(i.subarray(0,e.next_out_index)))),_+=e.next_out_index,a&&e.next_in_index>0&&e.next_in_index!=l&&(a(e.next_in_index),l=e.next_in_index);}while(e.avail_in>0||0===e.avail_out);return s=new Uint8Array(_),d.forEach((function(t){s.set(t,o),o+=t.length;})),s}},this.flush=function(){let t,a,r=0,s=0;const l=[];do{if(e.next_out_index=0,e.avail_out=n,t=e.deflate(4),1!=t&&0!=t)throw new Error("deflating: "+e.msg);n-e.avail_out>0&&l.push(new Uint8Array(i.subarray(0,e.next_out_index))),s+=e.next_out_index;}while(e.avail_in>0||0===e.avail_out);return e.deflateEnd(),a=new Uint8Array(s),l.forEach((function(t){a.set(t,r),r+=t.length;})),a};}O.prototype={deflateInit:function(t,e){const n=this;return n.dstate=new D,e||(e=15),n.dstate.deflateInit(n,t,e)},deflate:function(t){const e=this;return e.dstate?e.dstate.deflate(e,t):-2},deflateEnd:function(){const t=this;if(!t.dstate)return -2;const e=t.dstate.deflateEnd();return t.dstate=null,e},deflateParams:function(t,e){const n=this;return n.dstate?n.dstate.deflateParams(n,t,e):-2},deflateSetDictionary:function(t,e){const n=this;return n.dstate?n.dstate.deflateSetDictionary(n,t,e):-2},read_buf:function(t,e,n){const i=this;let a=i.avail_in;return a>n&&(a=n),0===a?0:(i.avail_in-=a,t.set(i.next_in.subarray(i.next_in_index,i.next_in_index+a),e),i.next_in_index+=a,i.total_in+=a,a)},flush_pending:function(){const t=this;let e=t.dstate.pending;e>t.avail_out&&(e=t.avail_out),0!==e&&(t.next_out.set(t.dstate.pending_buf.subarray(t.dstate.pending_out,t.dstate.pending_out+e),t.next_out_index),t.next_out_index+=e,t.dstate.pending_out+=e,t.total_out+=e,t.avail_out-=e,t.dstate.pending-=e,0===t.dstate.pending&&(t.dstate.pending_out=0));}};const T=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],z=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],B=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],V=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],q=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],K=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],R=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];function W(){let t,e,n,i,a,r;function s(t,e,s,l,o,_,d,u,f,c,h){let b,w,x,p,g,y,m,v,k,A,U,I,E,S,C;A=0,g=s;do{n[t[e+A]]++,A++,g--;}while(0!==g);if(n[0]==s)return d[0]=-1,u[0]=0,0;for(v=u[0],y=1;y<=15&&0===n[y];y++);for(m=y,v<y&&(v=y),g=15;0!==g&&0===n[g];g--);for(x=g,v>g&&(v=g),u[0]=v,S=1<<y;y<g;y++,S<<=1)if((S-=n[y])<0)return -3;if((S-=n[g])<0)return -3;for(n[g]+=S,r[1]=y=0,A=1,E=2;0!=--g;)r[E]=y+=n[A],E++,A++;g=0,A=0;do{0!==(y=t[e+A])&&(h[r[y]++]=g),A++;}while(++g<s);for(s=r[x],r[0]=g=0,A=0,p=-1,I=-v,a[0]=0,U=0,C=0;m<=x;m++)for(b=n[m];0!=b--;){for(;m>I+v;){if(p++,I+=v,C=x-I,C=C>v?v:C,(w=1<<(y=m-I))>b+1&&(w-=b+1,E=m,y<C))for(;++y<C&&!((w<<=1)<=n[++E]);)w-=n[E];if(C=1<<y,c[0]+C>1440)return -3;a[p]=U=c[0],c[0]+=C,0!==p?(r[p]=g,i[0]=y,i[1]=v,y=g>>>I-v,i[2]=U-a[p-1]-y,f.set(i,3*(a[p-1]+y))):d[0]=U;}for(i[1]=m-I,A>=s?i[0]=192:h[A]<l?(i[0]=h[A]<256?0:96,i[2]=h[A++]):(i[0]=_[h[A]-l]+16+64,i[2]=o[h[A++]-l]),w=1<<m-I,y=g>>>I;y<C;y+=w)f.set(i,3*(U+y));for(y=1<<m-1;0!=(g&y);y>>>=1)g^=y;for(g^=y,k=(1<<I)-1;(g&k)!=r[p];)p--,I-=v,k=(1<<I)-1;}return 0!==S&&1!=x?-5:0}function l(s){let l;for(t||(t=[],e=[],n=new Int32Array(16),i=[],a=new Int32Array(15),r=new Int32Array(16)),e.length<s&&(e=[]),l=0;l<s;l++)e[l]=0;for(l=0;l<16;l++)n[l]=0;for(l=0;l<3;l++)i[l]=0;a.set(n.subarray(0,15),0),r.set(n.subarray(0,16),0);}this.inflate_trees_bits=function(n,i,a,r,o){let _;return l(19),t[0]=0,_=s(n,0,19,19,null,null,a,i,r,t,e),-3==_?o.msg="oversubscribed dynamic bit lengths tree":-5!=_&&0!==i[0]||(o.msg="incomplete dynamic bit lengths tree",_=-3),_},this.inflate_trees_dynamic=function(n,i,a,r,o,_,d,u,f){let c;return l(288),t[0]=0,c=s(a,0,n,257,V,q,_,r,u,t,e),0!=c||0===r[0]?(-3==c?f.msg="oversubscribed literal/length tree":-4!=c&&(f.msg="incomplete literal/length tree",c=-3),c):(l(288),c=s(a,n,i,0,K,R,d,o,u,t,e),0!=c||0===o[0]&&n>257?(-3==c?f.msg="oversubscribed distance tree":-5==c?(f.msg="incomplete distance tree",c=-3):-4!=c&&(f.msg="empty distance tree with lengths",c=-3),c):0)};}function H(){const t=this;let e,n,i,a,r=0,s=0,l=0,o=0,_=0,d=0,u=0,f=0,c=0,h=0;function b(t,e,n,i,a,r,s,l){let o,_,d,u,f,c,h,b,w,x,p,g,y,m,v,k;h=l.next_in_index,b=l.avail_in,f=s.bitb,c=s.bitk,w=s.write,x=w<s.read?s.read-w-1:s.end-w,p=T[t],g=T[e];do{for(;c<20;)b--,f|=(255&l.read_byte(h++))<<c,c+=8;if(o=f&p,_=n,d=i,k=3*(d+o),0!==(u=_[k]))for(;;){if(f>>=_[k+1],c-=_[k+1],0!=(16&u)){for(u&=15,y=_[k+2]+(f&T[u]),f>>=u,c-=u;c<15;)b--,f|=(255&l.read_byte(h++))<<c,c+=8;for(o=f&g,_=a,d=r,k=3*(d+o),u=_[k];;){if(f>>=_[k+1],c-=_[k+1],0!=(16&u)){for(u&=15;c<u;)b--,f|=(255&l.read_byte(h++))<<c,c+=8;if(m=_[k+2]+(f&T[u]),f>>=u,c-=u,x-=y,w>=m)v=w-m,w-v>0&&2>w-v?(s.window[w++]=s.window[v++],s.window[w++]=s.window[v++],y-=2):(s.window.set(s.window.subarray(v,v+2),w),w+=2,v+=2,y-=2);else {v=w-m;do{v+=s.end;}while(v<0);if(u=s.end-v,y>u){if(y-=u,w-v>0&&u>w-v)do{s.window[w++]=s.window[v++];}while(0!=--u);else s.window.set(s.window.subarray(v,v+u),w),w+=u,v+=u,u=0;v=0;}}if(w-v>0&&y>w-v)do{s.window[w++]=s.window[v++];}while(0!=--y);else s.window.set(s.window.subarray(v,v+y),w),w+=y,v+=y,y=0;break}if(0!=(64&u))return l.msg="invalid distance code",y=l.avail_in-b,y=c>>3<y?c>>3:y,b+=y,h-=y,c-=y<<3,s.bitb=f,s.bitk=c,l.avail_in=b,l.total_in+=h-l.next_in_index,l.next_in_index=h,s.write=w,-3;o+=_[k+2],o+=f&T[u],k=3*(d+o),u=_[k];}break}if(0!=(64&u))return 0!=(32&u)?(y=l.avail_in-b,y=c>>3<y?c>>3:y,b+=y,h-=y,c-=y<<3,s.bitb=f,s.bitk=c,l.avail_in=b,l.total_in+=h-l.next_in_index,l.next_in_index=h,s.write=w,1):(l.msg="invalid literal/length code",y=l.avail_in-b,y=c>>3<y?c>>3:y,b+=y,h-=y,c-=y<<3,s.bitb=f,s.bitk=c,l.avail_in=b,l.total_in+=h-l.next_in_index,l.next_in_index=h,s.write=w,-3);if(o+=_[k+2],o+=f&T[u],k=3*(d+o),0===(u=_[k])){f>>=_[k+1],c-=_[k+1],s.window[w++]=_[k+2],x--;break}}else f>>=_[k+1],c-=_[k+1],s.window[w++]=_[k+2],x--;}while(x>=258&&b>=10);return y=l.avail_in-b,y=c>>3<y?c>>3:y,b+=y,h-=y,c-=y<<3,s.bitb=f,s.bitk=c,l.avail_in=b,l.total_in+=h-l.next_in_index,l.next_in_index=h,s.write=w,0}t.init=function(t,r,s,l,o,_){e=0,u=t,f=r,i=s,c=l,a=o,h=_,n=null;},t.proc=function(t,w,x){let p,g,y,m,v,k,A,U=0,I=0,E=0;for(E=w.next_in_index,m=w.avail_in,U=t.bitb,I=t.bitk,v=t.write,k=v<t.read?t.read-v-1:t.end-v;;)switch(e){case 0:if(k>=258&&m>=10&&(t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,x=b(u,f,i,c,a,h,t,w),E=w.next_in_index,m=w.avail_in,U=t.bitb,I=t.bitk,v=t.write,k=v<t.read?t.read-v-1:t.end-v,0!=x)){e=1==x?7:9;break}l=u,n=i,s=c,e=1;case 1:for(p=l;I<p;){if(0===m)return t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);x=0,m--,U|=(255&w.read_byte(E++))<<I,I+=8;}if(g=3*(s+(U&T[p])),U>>>=n[g+1],I-=n[g+1],y=n[g],0===y){o=n[g+2],e=6;break}if(0!=(16&y)){_=15&y,r=n[g+2],e=2;break}if(0==(64&y)){l=y,s=g/3+n[g+2];break}if(0!=(32&y)){e=7;break}return e=9,w.msg="invalid literal/length code",x=-3,t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);case 2:for(p=_;I<p;){if(0===m)return t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);x=0,m--,U|=(255&w.read_byte(E++))<<I,I+=8;}r+=U&T[p],U>>=p,I-=p,l=f,n=a,s=h,e=3;case 3:for(p=l;I<p;){if(0===m)return t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);x=0,m--,U|=(255&w.read_byte(E++))<<I,I+=8;}if(g=3*(s+(U&T[p])),U>>=n[g+1],I-=n[g+1],y=n[g],0!=(16&y)){_=15&y,d=n[g+2],e=4;break}if(0==(64&y)){l=y,s=g/3+n[g+2];break}return e=9,w.msg="invalid distance code",x=-3,t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);case 4:for(p=_;I<p;){if(0===m)return t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);x=0,m--,U|=(255&w.read_byte(E++))<<I,I+=8;}d+=U&T[p],U>>=p,I-=p,e=5;case 5:for(A=v-d;A<0;)A+=t.end;for(;0!==r;){if(0===k&&(v==t.end&&0!==t.read&&(v=0,k=v<t.read?t.read-v-1:t.end-v),0===k&&(t.write=v,x=t.inflate_flush(w,x),v=t.write,k=v<t.read?t.read-v-1:t.end-v,v==t.end&&0!==t.read&&(v=0,k=v<t.read?t.read-v-1:t.end-v),0===k)))return t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);t.window[v++]=t.window[A++],k--,A==t.end&&(A=0),r--;}e=0;break;case 6:if(0===k&&(v==t.end&&0!==t.read&&(v=0,k=v<t.read?t.read-v-1:t.end-v),0===k&&(t.write=v,x=t.inflate_flush(w,x),v=t.write,k=v<t.read?t.read-v-1:t.end-v,v==t.end&&0!==t.read&&(v=0,k=v<t.read?t.read-v-1:t.end-v),0===k)))return t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);x=0,t.window[v++]=o,k--,e=0;break;case 7:if(I>7&&(I-=8,m++,E--),t.write=v,x=t.inflate_flush(w,x),v=t.write,k=v<t.read?t.read-v-1:t.end-v,t.read!=t.write)return t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);e=8;case 8:return x=1,t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);case 9:return x=-3,t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x);default:return x=-2,t.bitb=U,t.bitk=I,w.avail_in=m,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=v,t.inflate_flush(w,x)}},t.free=function(){};}W.inflate_trees_fixed=function(t,e,n,i){return t[0]=9,e[0]=5,n[0]=z,i[0]=B,0};const L=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];function F(t,e){const n=this;let i,a=0,r=0,s=0,l=0;const o=[0],_=[0],d=new H;let u=0,f=new Int32Array(4320);const c=new W;n.bitk=0,n.bitb=0,n.window=new Uint8Array(e),n.end=e,n.read=0,n.write=0,n.reset=function(t,e){e&&(e[0]=0),6==a&&d.free(t),a=0,n.bitk=0,n.bitb=0,n.read=n.write=0;},n.reset(t,null),n.inflate_flush=function(t,e){let i,a,r;return a=t.next_out_index,r=n.read,i=(r<=n.write?n.write:n.end)-r,i>t.avail_out&&(i=t.avail_out),0!==i&&-5==e&&(e=0),t.avail_out-=i,t.total_out+=i,t.next_out.set(n.window.subarray(r,r+i),a),a+=i,r+=i,r==n.end&&(r=0,n.write==n.end&&(n.write=0),i=n.write-r,i>t.avail_out&&(i=t.avail_out),0!==i&&-5==e&&(e=0),t.avail_out-=i,t.total_out+=i,t.next_out.set(n.window.subarray(r,r+i),a),a+=i,r+=i),t.next_out_index=a,n.read=r,e},n.proc=function(t,e){let h,b,w,x,p,g,y,m;for(x=t.next_in_index,p=t.avail_in,b=n.bitb,w=n.bitk,g=n.write,y=g<n.read?n.read-g-1:n.end-g;;){let v,k,A,U,I,E,S,C;switch(a){case 0:for(;w<3;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}switch(h=7&b,u=1&h,h>>>1){case 0:b>>>=3,w-=3,h=7&w,b>>>=h,w-=h,a=1;break;case 1:v=[],k=[],A=[[]],U=[[]],W.inflate_trees_fixed(v,k,A,U),d.init(v[0],k[0],A[0],0,U[0],0),b>>>=3,w-=3,a=6;break;case 2:b>>>=3,w-=3,a=3;break;case 3:return b>>>=3,w-=3,a=9,t.msg="invalid block type",e=-3,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e)}break;case 1:for(;w<32;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}if((~b>>>16&65535)!=(65535&b))return a=9,t.msg="invalid stored block lengths",e=-3,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);r=65535&b,b=w=0,a=0!==r?2:0!==u?7:0;break;case 2:if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);if(0===y&&(g==n.end&&0!==n.read&&(g=0,y=g<n.read?n.read-g-1:n.end-g),0===y&&(n.write=g,e=n.inflate_flush(t,e),g=n.write,y=g<n.read?n.read-g-1:n.end-g,g==n.end&&0!==n.read&&(g=0,y=g<n.read?n.read-g-1:n.end-g),0===y)))return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);if(e=0,h=r,h>p&&(h=p),h>y&&(h=y),n.window.set(t.read_buf(x,h),g),x+=h,p-=h,g+=h,y-=h,0!=(r-=h))break;a=0!==u?7:0;break;case 3:for(;w<14;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}if(s=h=16383&b,(31&h)>29||(h>>5&31)>29)return a=9,t.msg="too many length or distance symbols",e=-3,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);if(h=258+(31&h)+(h>>5&31),!i||i.length<h)i=[];else for(m=0;m<h;m++)i[m]=0;b>>>=14,w-=14,l=0,a=4;case 4:for(;l<4+(s>>>10);){for(;w<3;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}i[L[l++]]=7&b,b>>>=3,w-=3;}for(;l<19;)i[L[l++]]=0;if(o[0]=7,h=c.inflate_trees_bits(i,o,_,f,t),0!=h)return -3==(e=h)&&(i=null,a=9),n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);l=0,a=5;case 5:for(;h=s,!(l>=258+(31&h)+(h>>5&31));){let r,d;for(h=o[0];w<h;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}if(h=f[3*(_[0]+(b&T[h]))+1],d=f[3*(_[0]+(b&T[h]))+2],d<16)b>>>=h,w-=h,i[l++]=d;else {for(m=18==d?7:d-14,r=18==d?11:3;w<h+m;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}if(b>>>=h,w-=h,r+=b&T[m],b>>>=m,w-=m,m=l,h=s,m+r>258+(31&h)+(h>>5&31)||16==d&&m<1)return i=null,a=9,t.msg="invalid bit length repeat",e=-3,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);d=16==d?i[m-1]:0;do{i[m++]=d;}while(0!=--r);l=m;}}if(_[0]=-1,I=[],E=[],S=[],C=[],I[0]=9,E[0]=6,h=s,h=c.inflate_trees_dynamic(257+(31&h),1+(h>>5&31),i,I,E,S,C,f,t),0!=h)return -3==h&&(i=null,a=9),e=h,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);d.init(I[0],E[0],f,S[0],f,C[0]),a=6;case 6:if(n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,1!=(e=d.proc(n,t,e)))return n.inflate_flush(t,e);if(e=0,d.free(t),x=t.next_in_index,p=t.avail_in,b=n.bitb,w=n.bitk,g=n.write,y=g<n.read?n.read-g-1:n.end-g,0===u){a=0;break}a=7;case 7:if(n.write=g,e=n.inflate_flush(t,e),g=n.write,y=g<n.read?n.read-g-1:n.end-g,n.read!=n.write)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);a=8;case 8:return e=1,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);case 9:return e=-3,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);default:return e=-2,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e)}}},n.free=function(t){n.reset(t,null),n.window=null,f=null;},n.set_dictionary=function(t,e,i){n.window.set(t.subarray(e,e+i),0),n.read=n.write=i;},n.sync_point=function(){return 1==a?1:0};}const G=[0,0,255,255];function J(){const t=this;function e(t){return t&&t.istate?(t.total_in=t.total_out=0,t.msg=null,t.istate.mode=7,t.istate.blocks.reset(t,null),0):-2}t.mode=0,t.method=0,t.was=[0],t.need=0,t.marker=0,t.wbits=0,t.inflateEnd=function(e){return t.blocks&&t.blocks.free(e),t.blocks=null,0},t.inflateInit=function(n,i){return n.msg=null,t.blocks=null,i<8||i>15?(t.inflateEnd(n),-2):(t.wbits=i,n.istate.blocks=new F(n,1<<i),e(n),0)},t.inflate=function(t,e){let n,i;if(!t||!t.istate||!t.next_in)return -2;const a=t.istate;for(e=4==e?-5:0,n=-5;;)switch(a.mode){case 0:if(0===t.avail_in)return n;if(n=e,t.avail_in--,t.total_in++,8!=(15&(a.method=t.read_byte(t.next_in_index++)))){a.mode=13,t.msg="unknown compression method",a.marker=5;break}if(8+(a.method>>4)>a.wbits){a.mode=13,t.msg="invalid window size",a.marker=5;break}a.mode=1;case 1:if(0===t.avail_in)return n;if(n=e,t.avail_in--,t.total_in++,i=255&t.read_byte(t.next_in_index++),((a.method<<8)+i)%31!=0){a.mode=13,t.msg="incorrect header check",a.marker=5;break}if(0==(32&i)){a.mode=7;break}a.mode=2;case 2:if(0===t.avail_in)return n;n=e,t.avail_in--,t.total_in++,a.need=(255&t.read_byte(t.next_in_index++))<<24&4278190080,a.mode=3;case 3:if(0===t.avail_in)return n;n=e,t.avail_in--,t.total_in++,a.need+=(255&t.read_byte(t.next_in_index++))<<16&16711680,a.mode=4;case 4:if(0===t.avail_in)return n;n=e,t.avail_in--,t.total_in++,a.need+=(255&t.read_byte(t.next_in_index++))<<8&65280,a.mode=5;case 5:return 0===t.avail_in?n:(n=e,t.avail_in--,t.total_in++,a.need+=255&t.read_byte(t.next_in_index++),a.mode=6,2);case 6:return a.mode=13,t.msg="need dictionary",a.marker=0,-2;case 7:if(n=a.blocks.proc(t,n),-3==n){a.mode=13,a.marker=0;break}if(0==n&&(n=e),1!=n)return n;n=e,a.blocks.reset(t,a.was),a.mode=12;case 12:return 1;case 13:return -3;default:return -2}},t.inflateSetDictionary=function(t,e,n){let i=0,a=n;if(!t||!t.istate||6!=t.istate.mode)return -2;const r=t.istate;return a>=1<<r.wbits&&(a=(1<<r.wbits)-1,i=n-a),r.blocks.set_dictionary(e,i,a),r.mode=7,0},t.inflateSync=function(t){let n,i,a,r,s;if(!t||!t.istate)return -2;const l=t.istate;if(13!=l.mode&&(l.mode=13,l.marker=0),0===(n=t.avail_in))return -5;for(i=t.next_in_index,a=l.marker;0!==n&&a<4;)t.read_byte(i)==G[a]?a++:a=0!==t.read_byte(i)?0:4-a,i++,n--;return t.total_in+=i-t.next_in_index,t.next_in_index=i,t.avail_in=n,l.marker=a,4!=a?-3:(r=t.total_in,s=t.total_out,e(t),t.total_in=r,t.total_out=s,l.mode=7,0)},t.inflateSyncPoint=function(t){return t&&t.istate&&t.istate.blocks?t.istate.blocks.sync_point():-2};}function N(){}function Q(){const t=new N,e=new Uint8Array(512);let n=!1;t.inflateInit(),t.next_out=e,this.append=function(i,a){const r=[];let s,l,o=0,_=0,d=0;if(0!==i.length){t.next_in_index=0,t.next_in=i,t.avail_in=i.length;do{if(t.next_out_index=0,t.avail_out=512,0!==t.avail_in||n||(t.next_in_index=0,n=!0),s=t.inflate(0),n&&-5===s){if(0!==t.avail_in)throw new Error("inflating: bad input")}else if(0!==s&&1!==s)throw new Error("inflating: "+t.msg);if((n||1===s)&&t.avail_in===i.length)throw new Error("inflating: bad input");t.next_out_index&&(512===t.next_out_index?r.push(new Uint8Array(e)):r.push(new Uint8Array(e.subarray(0,t.next_out_index)))),d+=t.next_out_index,a&&t.next_in_index>0&&t.next_in_index!=o&&(a(t.next_in_index),o=t.next_in_index);}while(t.avail_in>0||0===t.avail_out);return l=new Uint8Array(d),r.forEach((function(t){l.set(t,_),_+=t.length;})),l}},this.flush=function(){t.inflateEnd();};}N.prototype={inflateInit:function(t){const e=this;return e.istate=new J,t||(t=15),e.istate.inflateInit(e,t)},inflate:function(t){const e=this;return e.istate?e.istate.inflate(e,t):-2},inflateEnd:function(){const t=this;if(!t.istate)return -2;const e=t.istate.inflateEnd(t);return t.istate=null,e},inflateSync:function(){const t=this;return t.istate?t.istate.inflateSync(t):-2},inflateSetDictionary:function(t,e){const n=this;return n.istate?n.istate.inflateSetDictionary(n,t,e):-2},read_byte:function(t){return this.next_in.subarray(t,t+1)[0]},read_buf:function(t,e){return this.next_in.subarray(t,t+e)}},self.initCodec=()=>{self.Deflate=P,self.Inflate=Q;};}).toString()+")()"]));configure({workerScripts:{inflate:[e],deflate:[e]}});};

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

	configureWebWorker();

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
	exports.ERR_INVALID_DATE = ERR_INVALID_DATE;
	exports.ERR_INVALID_ENCRYPTION_STRENGTH = ERR_INVALID_ENCRYPTION_STRENGTH;
	exports.ERR_INVALID_ENTRY_COMMENT = ERR_INVALID_ENTRY_COMMENT;
	exports.ERR_INVALID_ENTRY_NAME = ERR_INVALID_ENTRY_NAME;
	exports.ERR_INVALID_EXTRAFIELD_DATA = ERR_INVALID_EXTRAFIELD_DATA;
	exports.ERR_INVALID_EXTRAFIELD_TYPE = ERR_INVALID_EXTRAFIELD_TYPE;
	exports.ERR_INVALID_PASSWORD = ERR_INVALID_PASSWORD;
	exports.ERR_INVALID_SIGNATURE = ERR_INVALID_SIGNATURE;
	exports.ERR_INVALID_VERSION = ERR_INVALID_VERSION;
	exports.ERR_LOCAL_FILE_HEADER_NOT_FOUND = ERR_LOCAL_FILE_HEADER_NOT_FOUND;
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION;
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
	exports.initShimAsyncCodec = streamCodecShim;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
