(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
})(this, (function (exports) { 'use strict';

	const { Array, Object, String, Number, BigInt, Math, Date, Map, Set, Response, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, document, crypto, btoa, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream, navigator } = typeof globalThis !== 'undefined' ? globalThis : this || self;

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

	class Crc32 {

		constructor(crc) {
			this.crc = crc || -1;
		}

		append(data) {
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

	class Crc32Stream extends TransformStream {

		constructor() {
			const crc32 = new Crc32();
			super({
				transform(chunk) {
					crc32.append(chunk);
				},
				flush(controller) {
					const value = new Uint8Array(4);
					const dataView = new DataView(value.buffer);
					dataView.setUint32(0, crc32.get());
					controller.enqueue(value);
				}
			});
		}
	}

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

	function encodeText(value) {
		if (typeof TextEncoder == "undefined") {
			value = unescape(encodeURIComponent(value));
			const result = new Uint8Array(value.length);
			for (let i = 0; i < result.length; i++) {
				result[i] = value.charCodeAt(i);
			}
			return result;
		} else {
			return new TextEncoder().encode(value);
		}
	}

	// Derived from https://github.com/xqdoo00o/jszip/blob/master/lib/sjcl.js and https://github.com/bitwiseshiftleft/sjcl

	/*// deno-lint-ignore-file no-this-alias *

	/*
	 * SJCL is open. You can use, modify and redistribute it under a BSD
	 * license or under the GNU GPL, version 2.0.
	 */

	/** @fileOverview Javascript cryptography implementation.
	 *
	 * Crush to remove comments, shorten variable names and
	 * generally reduce transmission size.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/*jslint indent: 2, bitwise: false, nomen: false, plusplus: false, white: false, regexp: false */

	/** @fileOverview Arrays of bits, encoded as arrays of Numbers.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/**
	 * Arrays of bits, encoded as arrays of Numbers.
	 * @namespace
	 * @description
	 * <p>
	 * These objects are the currency accepted by SJCL's crypto functions.
	 * </p>
	 *
	 * <p>
	 * Most of our crypto primitives operate on arrays of 4-byte words internally,
	 * but many of them can take arguments that are not a multiple of 4 bytes.
	 * This library encodes arrays of bits (whose size need not be a multiple of 8
	 * bits) as arrays of 32-bit words.  The bits are packed, big-endian, into an
	 * array of words, 32 bits at a time.  Since the words are double-precision
	 * floating point numbers, they fit some extra data.  We use this (in a private,
	 * possibly-changing manner) to encode the number of bits actually  present
	 * in the last word of the array.
	 * </p>
	 *
	 * <p>
	 * Because bitwise ops clear this out-of-band data, these arrays can be passed
	 * to ciphers like AES which want arrays of words.
	 * </p>
	 */
	const bitArray = {
		/**
		 * Concatenate two bit arrays.
		 * @param {bitArray} a1 The first array.
		 * @param {bitArray} a2 The second array.
		 * @return {bitArray} The concatenation of a1 and a2.
		 */
		concat(a1, a2) {
			if (a1.length === 0 || a2.length === 0) {
				return a1.concat(a2);
			}

			const last = a1[a1.length - 1], shift = bitArray.getPartial(last);
			if (shift === 32) {
				return a1.concat(a2);
			} else {
				return bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
			}
		},

		/**
		 * Find the length of an array of bits.
		 * @param {bitArray} a The array.
		 * @return {Number} The length of a, in bits.
		 */
		bitLength(a) {
			const l = a.length;
			if (l === 0) {
				return 0;
			}
			const x = a[l - 1];
			return (l - 1) * 32 + bitArray.getPartial(x);
		},

		/**
		 * Truncate an array.
		 * @param {bitArray} a The array.
		 * @param {Number} len The length to truncate to, in bits.
		 * @return {bitArray} A new array, truncated to len bits.
		 */
		clamp(a, len) {
			if (a.length * 32 < len) {
				return a;
			}
			a = a.slice(0, Math.ceil(len / 32));
			const l = a.length;
			len = len & 31;
			if (l > 0 && len) {
				a[l - 1] = bitArray.partial(len, a[l - 1] & 0x80000000 >> (len - 1), 1);
			}
			return a;
		},

		/**
		 * Make a partial word for a bit array.
		 * @param {Number} len The number of bits in the word.
		 * @param {Number} x The bits.
		 * @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.
		 * @return {Number} The partial word.
		 */
		partial(len, x, _end) {
			if (len === 32) {
				return x;
			}
			return (_end ? x | 0 : x << (32 - len)) + len * 0x10000000000;
		},

		/**
		 * Get the number of bits used by a partial word.
		 * @param {Number} x The partial word.
		 * @return {Number} The number of bits used by the partial word.
		 */
		getPartial(x) {
			return Math.round(x / 0x10000000000) || 32;
		},

		/** Shift an array right.
		 * @param {bitArray} a The array to shift.
		 * @param {Number} shift The number of bits to shift.
		 * @param {Number} [carry=0] A byte to carry in
		 * @param {bitArray} [out=[]] An array to prepend to the output.
		 * @private
		 */
		_shiftRight(a, shift, carry, out) {
			if (out === undefined) {
				out = [];
			}

			for (; shift >= 32; shift -= 32) {
				out.push(carry);
				carry = 0;
			}
			if (shift === 0) {
				return out.concat(a);
			}

			for (let i = 0; i < a.length; i++) {
				out.push(carry | a[i] >>> shift);
				carry = a[i] << (32 - shift);
			}
			const last2 = a.length ? a[a.length - 1] : 0;
			const shift2 = bitArray.getPartial(last2);
			out.push(bitArray.partial(shift + shift2 & 31, (shift + shift2 > 32) ? carry : out.pop(), 1));
			return out;
		}
	};

	/** @fileOverview Bit array codec implementations.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/**
	 * Arrays of bytes
	 * @namespace
	 */
	const codec = {
		bytes: {
			/** Convert from a bitArray to an array of bytes. */
			fromBits(arr) {
				const bl = bitArray.bitLength(arr);
				const byteLength = bl / 8;
				const out = new Uint8Array(byteLength);
				let tmp;
				for (let i = 0; i < byteLength; i++) {
					if ((i & 3) === 0) {
						tmp = arr[i / 4];
					}
					out[i] = tmp >>> 24;
					tmp <<= 8;
				}
				return out;
			},
			/** Convert from an array of bytes to a bitArray. */
			toBits(bytes) {
				const out = [];
				let i;
				let tmp = 0;
				for (i = 0; i < bytes.length; i++) {
					tmp = tmp << 8 | bytes[i];
					if ((i & 3) === 3) {
						out.push(tmp);
						tmp = 0;
					}
				}
				if (i & 3) {
					out.push(bitArray.partial(8 * (i & 3), tmp));
				}
				return out;
			}
		}
	};

	const hash = {};

	/**
	 * Context for a SHA-1 operation in progress.
	 * @constructor
	 */
	hash.sha1 = function (hash) {
		if (hash) {
			this._h = hash._h.slice(0);
			this._buffer = hash._buffer.slice(0);
			this._length = hash._length;
		} else {
			this.reset();
		}
	};

	hash.sha1.prototype = {
		/**
		 * The hash's block size, in bits.
		 * @constant
		 */
		blockSize: 512,

		/**
		 * Reset the hash state.
		 * @return this
		 */
		reset() {
			const sha1 = this;
			sha1._h = this._init.slice(0);
			sha1._buffer = [];
			sha1._length = 0;
			return sha1;
		},

		/**
		 * Input several words to the hash.
		 * @param {bitArray|String} data the data to hash.
		 * @return this
		 */
		update(data) {
			const sha1 = this;
			if (typeof data === "string") {
				data = codec.utf8String.toBits(data);
			}
			const b = sha1._buffer = bitArray.concat(sha1._buffer, data);
			const ol = sha1._length;
			const nl = sha1._length = ol + bitArray.bitLength(data);
			if (nl > 9007199254740991) {
				throw new Error("Cannot hash more than 2^53 - 1 bits");
			}
			const c = new Uint32Array(b);
			let j = 0;
			for (let i = sha1.blockSize + ol - ((sha1.blockSize + ol) & (sha1.blockSize - 1)); i <= nl;
				i += sha1.blockSize) {
				sha1._block(c.subarray(16 * j, 16 * (j + 1)));
				j += 1;
			}
			b.splice(0, 16 * j);
			return sha1;
		},

		/**
		 * Complete hashing and output the hash value.
		 * @return {bitArray} The hash value, an array of 5 big-endian words. TODO
		 */
		finalize() {
			const sha1 = this;
			let b = sha1._buffer;
			const h = sha1._h;

			// Round out and push the buffer
			b = bitArray.concat(b, [bitArray.partial(1, 1)]);
			// Round out the buffer to a multiple of 16 words, less the 2 length words.
			for (let i = b.length + 2; i & 15; i++) {
				b.push(0);
			}

			// append the length
			b.push(Math.floor(sha1._length / 0x100000000));
			b.push(sha1._length | 0);

			while (b.length) {
				sha1._block(b.splice(0, 16));
			}

			sha1.reset();
			return h;
		},

		/**
		 * The SHA-1 initialization vector.
		 * @private
		 */
		_init: [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],

		/**
		 * The SHA-1 hash key.
		 * @private
		 */
		_key: [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6],

		/**
		 * The SHA-1 logical functions f(0), f(1), ..., f(79).
		 * @private
		 */
		_f(t, b, c, d) {
			if (t <= 19) {
				return (b & c) | (~b & d);
			} else if (t <= 39) {
				return b ^ c ^ d;
			} else if (t <= 59) {
				return (b & c) | (b & d) | (c & d);
			} else if (t <= 79) {
				return b ^ c ^ d;
			}
		},

		/**
		 * Circular left-shift operator.
		 * @private
		 */
		_S(n, x) {
			return (x << n) | (x >>> 32 - n);
		},

		/**
		 * Perform one cycle of SHA-1.
		 * @param {Uint32Array|bitArray} words one block of words.
		 * @private
		 */
		_block(words) {
			const sha1 = this;
			const h = sha1._h;
			// When words is passed to _block, it has 16 elements. SHA1 _block
			// function extends words with new elements (at the end there are 80 elements). 
			// The problem is that if we use Uint32Array instead of Array, 
			// the length of Uint32Array cannot be changed. Thus, we replace words with a 
			// normal Array here.
			const w = Array(80); // do not use Uint32Array here as the instantiation is slower
			for (let j = 0; j < 16; j++) {
				w[j] = words[j];
			}

			let a = h[0];
			let b = h[1];
			let c = h[2];
			let d = h[3];
			let e = h[4];

			for (let t = 0; t <= 79; t++) {
				if (t >= 16) {
					w[t] = sha1._S(1, w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16]);
				}
				const tmp = (sha1._S(5, a) + sha1._f(t, b, c, d) + e + w[t] +
					sha1._key[Math.floor(t / 20)]) | 0;
				e = d;
				d = c;
				c = sha1._S(30, b);
				b = a;
				a = tmp;
			}

			h[0] = (h[0] + a) | 0;
			h[1] = (h[1] + b) | 0;
			h[2] = (h[2] + c) | 0;
			h[3] = (h[3] + d) | 0;
			h[4] = (h[4] + e) | 0;
		}
	};

	/** @fileOverview Low-level AES implementation.
	 *
	 * This file contains a low-level implementation of AES, optimized for
	 * size and for efficiency on several browsers.  It is based on
	 * OpenSSL's aes_core.c, a public-domain implementation by Vincent
	 * Rijmen, Antoon Bosselaers and Paulo Barreto.
	 *
	 * An older version of this implementation is available in the public
	 * domain, but this one is (c) Emily Stark, Mike Hamburg, Dan Boneh,
	 * Stanford University 2008-2010 and BSD-licensed for liability
	 * reasons.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	const cipher = {};

	/**
	 * Schedule out an AES key for both encryption and decryption.  This
	 * is a low-level class.  Use a cipher mode to do bulk encryption.
	 *
	 * @constructor
	 * @param {Array} key The key as an array of 4, 6 or 8 words.
	 */
	cipher.aes = class {
		constructor(key) {
			/**
			 * The expanded S-box and inverse S-box tables.  These will be computed
			 * on the client so that we don't have to send them down the wire.
			 *
			 * There are two tables, _tables[0] is for encryption and
			 * _tables[1] is for decryption.
			 *
			 * The first 4 sub-tables are the expanded S-box with MixColumns.  The
			 * last (_tables[01][4]) is the S-box itself.
			 *
			 * @private
			 */
			const aes = this;
			aes._tables = [[[], [], [], [], []], [[], [], [], [], []]];

			if (!aes._tables[0][0][0]) {
				aes._precompute();
			}

			const sbox = aes._tables[0][4];
			const decTable = aes._tables[1];
			const keyLen = key.length;

			let i, encKey, decKey, rcon = 1;

			if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) {
				throw new Error("invalid aes key size");
			}

			aes._key = [encKey = key.slice(0), decKey = []];

			// schedule encryption keys
			for (i = keyLen; i < 4 * keyLen + 28; i++) {
				let tmp = encKey[i - 1];

				// apply sbox
				if (i % keyLen === 0 || (keyLen === 8 && i % keyLen === 4)) {
					tmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255] << 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255];

					// shift rows and add rcon
					if (i % keyLen === 0) {
						tmp = tmp << 8 ^ tmp >>> 24 ^ rcon << 24;
						rcon = rcon << 1 ^ (rcon >> 7) * 283;
					}
				}

				encKey[i] = encKey[i - keyLen] ^ tmp;
			}

			// schedule decryption keys
			for (let j = 0; i; j++, i--) {
				const tmp = encKey[j & 3 ? i : i - 4];
				if (i <= 4 || j < 4) {
					decKey[j] = tmp;
				} else {
					decKey[j] = decTable[0][sbox[tmp >>> 24]] ^
						decTable[1][sbox[tmp >> 16 & 255]] ^
						decTable[2][sbox[tmp >> 8 & 255]] ^
						decTable[3][sbox[tmp & 255]];
				}
			}
		}
		// public
		/* Something like this might appear here eventually
		name: "AES",
		blockSize: 4,
		keySizes: [4,6,8],
		*/

		/**
		 * Encrypt an array of 4 big-endian words.
		 * @param {Array} data The plaintext.
		 * @return {Array} The ciphertext.
		 */
		encrypt(data) {
			return this._crypt(data, 0);
		}

		/**
		 * Decrypt an array of 4 big-endian words.
		 * @param {Array} data The ciphertext.
		 * @return {Array} The plaintext.
		 */
		decrypt(data) {
			return this._crypt(data, 1);
		}

		/**
		 * Expand the S-box tables.
		 *
		 * @private
		 */
		_precompute() {
			const encTable = this._tables[0];
			const decTable = this._tables[1];
			const sbox = encTable[4];
			const sboxInv = decTable[4];
			const d = [];
			const th = [];
			let xInv, x2, x4, x8;

			// Compute double and third tables
			for (let i = 0; i < 256; i++) {
				th[(d[i] = i << 1 ^ (i >> 7) * 283) ^ i] = i;
			}

			for (let x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
				// Compute sbox
				let s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
				s = s >> 8 ^ s & 255 ^ 99;
				sbox[x] = s;
				sboxInv[s] = x;

				// Compute MixColumns
				x8 = d[x4 = d[x2 = d[x]]];
				let tDec = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
				let tEnc = d[s] * 0x101 ^ s * 0x1010100;

				for (let i = 0; i < 4; i++) {
					encTable[i][x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
					decTable[i][s] = tDec = tDec << 24 ^ tDec >>> 8;
				}
			}

			// Compactify.  Considerable speedup on Firefox.
			for (let i = 0; i < 5; i++) {
				encTable[i] = encTable[i].slice(0);
				decTable[i] = decTable[i].slice(0);
			}
		}

		/**
		 * Encryption and decryption core.
		 * @param {Array} input Four words to be encrypted or decrypted.
		 * @param dir The direction, 0 for encrypt and 1 for decrypt.
		 * @return {Array} The four encrypted or decrypted words.
		 * @private
		 */
		_crypt(input, dir) {
			if (input.length !== 4) {
				throw new Error("invalid aes block size");
			}

			const key = this._key[dir];

			const nInnerRounds = key.length / 4 - 2;
			const out = [0, 0, 0, 0];
			const table = this._tables[dir];

			// load up the tables
			const t0 = table[0];
			const t1 = table[1];
			const t2 = table[2];
			const t3 = table[3];
			const sbox = table[4];

			// state variables a,b,c,d are loaded with pre-whitened data
			let a = input[0] ^ key[0];
			let b = input[dir ? 3 : 1] ^ key[1];
			let c = input[2] ^ key[2];
			let d = input[dir ? 1 : 3] ^ key[3];
			let kIndex = 4;
			let a2, b2, c2;

			// Inner rounds.  Cribbed from OpenSSL.
			for (let i = 0; i < nInnerRounds; i++) {
				a2 = t0[a >>> 24] ^ t1[b >> 16 & 255] ^ t2[c >> 8 & 255] ^ t3[d & 255] ^ key[kIndex];
				b2 = t0[b >>> 24] ^ t1[c >> 16 & 255] ^ t2[d >> 8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];
				c2 = t0[c >>> 24] ^ t1[d >> 16 & 255] ^ t2[a >> 8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];
				d = t0[d >>> 24] ^ t1[a >> 16 & 255] ^ t2[b >> 8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];
				kIndex += 4;
				a = a2; b = b2; c = c2;
			}

			// Last round.
			for (let i = 0; i < 4; i++) {
				out[dir ? 3 & -i : i] =
					sbox[a >>> 24] << 24 ^
					sbox[b >> 16 & 255] << 16 ^
					sbox[c >> 8 & 255] << 8 ^
					sbox[d & 255] ^
					key[kIndex++];
				a2 = a; a = b; b = c; c = d; d = a2;
			}

			return out;
		}
	};

	/**
	 * Random values
	 * @namespace
	 */
	const random = {
		/** 
		 * Generate random words with pure js, cryptographically not as strong & safe as native implementation.
		 * @param {TypedArray} typedArray The array to fill.
		 * @return {TypedArray} The random values.
		 */
		getRandomValues(typedArray) {
			const words = new Uint32Array(typedArray.buffer);
			const r = (m_w) => {
				let m_z = 0x3ade68b1;
				const mask = 0xffffffff;
				return function () {
					m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
					m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
					const result = ((((m_z << 0x10) + m_w) & mask) / 0x100000000) + .5;
					return result * (Math.random() > .5 ? 1 : -1);
				};
			};
			for (let i = 0, rcache; i < typedArray.length; i += 4) {
				const _r = r((rcache || Math.random()) * 0x100000000);
				rcache = _r() * 0x3ade67b7;
				words[i / 4] = (_r() * 0x100000000) | 0;
			}
			return typedArray;
		}
	};

	/** @fileOverview CTR mode implementation.
	 *
	 * Special thanks to Roy Nicholson for pointing out a bug in our
	 * implementation.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** Brian Gladman's CTR Mode.
	* @constructor
	* @param {Object} _prf The aes instance to generate key.
	* @param {bitArray} _iv The iv for ctr mode, it must be 128 bits.
	*/

	const mode = {};

	/**
	 * Brian Gladman's CTR Mode.
	 * @namespace
	 */
	mode.ctrGladman = class {
		constructor(prf, iv) {
			this._prf = prf;
			this._initIv = iv;
			this._iv = iv;
		}

		reset() {
			this._iv = this._initIv;
		}

		/** Input some data to calculate.
		 * @param {bitArray} data the data to process, it must be intergral multiple of 128 bits unless it's the last.
		 */
		update(data) {
			return this.calculate(this._prf, data, this._iv);
		}

		incWord(word) {
			if (((word >> 24) & 0xff) === 0xff) { //overflow
				let b1 = (word >> 16) & 0xff;
				let b2 = (word >> 8) & 0xff;
				let b3 = word & 0xff;

				if (b1 === 0xff) { // overflow b1   
					b1 = 0;
					if (b2 === 0xff) {
						b2 = 0;
						if (b3 === 0xff) {
							b3 = 0;
						} else {
							++b3;
						}
					} else {
						++b2;
					}
				} else {
					++b1;
				}

				word = 0;
				word += (b1 << 16);
				word += (b2 << 8);
				word += b3;
			} else {
				word += (0x01 << 24);
			}
			return word;
		}

		incCounter(counter) {
			if ((counter[0] = this.incWord(counter[0])) === 0) {
				// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
				counter[1] = this.incWord(counter[1]);
			}
		}

		calculate(prf, data, iv) {
			let l;
			if (!(l = data.length)) {
				return [];
			}
			const bl = bitArray.bitLength(data);
			for (let i = 0; i < l; i += 4) {
				this.incCounter(iv);
				const e = prf.encrypt(iv);
				data[i] ^= e[0];
				data[i + 1] ^= e[1];
				data[i + 2] ^= e[2];
				data[i + 3] ^= e[3];
			}
			return bitArray.clamp(data, bl);
		}
	};

	const misc = {
		importKey(password) {
			return new misc.hmacSha1(codec.bytes.toBits(password));
		},
		pbkdf2(prf, salt, count, length) {
			count = count || 10000;
			if (length < 0 || count < 0) {
				throw new Error("invalid params to pbkdf2");
			}
			const byteLength = ((length >> 5) + 1) << 2;
			let u, ui, i, j, k;
			const arrayBuffer = new ArrayBuffer(byteLength);
			const out = new DataView(arrayBuffer);
			let outLength = 0;
			const b = bitArray;
			salt = codec.bytes.toBits(salt);
			for (k = 1; outLength < (byteLength || 1); k++) {
				u = ui = prf.encrypt(b.concat(salt, [k]));
				for (i = 1; i < count; i++) {
					ui = prf.encrypt(ui);
					for (j = 0; j < ui.length; j++) {
						u[j] ^= ui[j];
					}
				}
				for (i = 0; outLength < (byteLength || 1) && i < u.length; i++) {
					out.setInt32(outLength, u[i]);
					outLength += 4;
				}
			}
			return arrayBuffer.slice(0, length / 8);
		}
	};

	/** @fileOverview HMAC implementation.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** HMAC with the specified hash function.
	 * @constructor
	 * @param {bitArray} key the key for HMAC.
	 * @param {Object} [Hash=hash.sha1] The hash function to use.
	 */
	misc.hmacSha1 = class {

		constructor(key) {
			const hmac = this;
			const Hash = hmac._hash = hash.sha1;
			const exKey = [[], []];
			const bs = Hash.prototype.blockSize / 32;
			hmac._baseHash = [new Hash(), new Hash()];

			if (key.length > bs) {
				key = Hash.hash(key);
			}

			for (let i = 0; i < bs; i++) {
				exKey[0][i] = key[i] ^ 0x36363636;
				exKey[1][i] = key[i] ^ 0x5C5C5C5C;
			}

			hmac._baseHash[0].update(exKey[0]);
			hmac._baseHash[1].update(exKey[1]);
			hmac._resultHash = new Hash(hmac._baseHash[0]);
		}
		reset() {
			const hmac = this;
			hmac._resultHash = new hmac._hash(hmac._baseHash[0]);
			hmac._updated = false;
		}

		update(data) {
			const hmac = this;
			hmac._updated = true;
			hmac._resultHash.update(data);
		}

		digest() {
			const hmac = this;
			const w = hmac._resultHash.finalize();
			const result = new (hmac._hash)(hmac._baseHash[1]).update(w).finalize();

			hmac.reset();

			return result;
		}

		encrypt(data) {
			if (!this._updated) {
				this.update(data);
				return this.digest(data);
			} else {
				throw new Error("encrypt on already updated hmac called!");
			}
		}
	};

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

	const GET_RANDOM_VALUES_SUPPORTED = typeof crypto != "undefined" && typeof crypto.getRandomValues == "function";

	const ERR_INVALID_PASSWORD = "Invalid password";
	const ERR_INVALID_SIGNATURE = "Invalid signature";

	function getRandomValues(array) {
		if (GET_RANDOM_VALUES_SUPPORTED) {
			return crypto.getRandomValues(array);
		} else {
			return random.getRandomValues(array);
		}
	}

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

	const BLOCK_LENGTH = 16;
	const RAW_FORMAT = "raw";
	const PBKDF2_ALGORITHM = { name: "PBKDF2" };
	const HASH_ALGORITHM = { name: "HMAC" };
	const HASH_FUNCTION = "SHA-1";
	const BASE_KEY_ALGORITHM = Object.assign({ hash: HASH_ALGORITHM }, PBKDF2_ALGORITHM);
	const DERIVED_BITS_ALGORITHM = Object.assign({ iterations: 1000, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);
	const DERIVED_BITS_USAGE = ["deriveBits"];
	const SALT_LENGTH = [8, 12, 16];
	const KEY_LENGTH = [16, 24, 32];
	const SIGNATURE_LENGTH = 10;
	const COUNTER_DEFAULT_VALUE = [0, 0, 0, 0];
	const UNDEFINED_TYPE$1 = "undefined";
	const FUNCTION_TYPE = "function";
	const CRYPTO_API_SUPPORTED = typeof crypto != UNDEFINED_TYPE$1;
	const subtle = CRYPTO_API_SUPPORTED && crypto.subtle;
	const SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof subtle != UNDEFINED_TYPE$1;
	const IMPORT_KEY_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.importKey == FUNCTION_TYPE;
	const DERIVE_BITS_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.deriveBits == FUNCTION_TYPE;
	const codecBytes = codec.bytes;
	const Aes = cipher.aes;
	const CtrGladman = mode.ctrGladman;
	const HmacSha1 = misc.hmacSha1;

	class AESDecryptionStream extends TransformStream {

		constructor(password, signed, strength) {
			super({
				start() {
					Object.assign(this, {
						ready: new Promise(resolve => this.resolveReady = resolve),
						password,
						signed,
						strength: strength - 1,
						pending: new Uint8Array()
					});
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
						await createDecryptionKeys(aesCrypto, strength, password, subarray(chunk, 0, SALT_LENGTH[strength] + 2));
						chunk = subarray(chunk, SALT_LENGTH[strength] + 2);
						resolveReady();
					} else {
						await ready;
					}
					const output = new Uint8Array(chunk.length - SIGNATURE_LENGTH - ((chunk.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
					controller.enqueue(append(aesCrypto, chunk, output, 0, SIGNATURE_LENGTH, true));
				},
				async flush(controller) {
					const {
						signed,
						ctr,
						hmac,
						pending,
						ready
					} = this;
					await ready;
					const chunkToDecrypt = subarray(pending, 0, pending.length - SIGNATURE_LENGTH);
					const originalSignature = subarray(pending, pending.length - SIGNATURE_LENGTH);
					let decryptedChunkArray = new Uint8Array();
					if (chunkToDecrypt.length) {
						const encryptedChunk = toBits(codecBytes, chunkToDecrypt);
						hmac.update(encryptedChunk);
						const decryptedChunk = ctr.update(encryptedChunk);
						decryptedChunkArray = fromBits(codecBytes, decryptedChunk);
					}
					if (signed) {
						const signature = subarray(fromBits(codecBytes, hmac.digest()), 0, SIGNATURE_LENGTH);
						for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) {
							if (signature[indexSignature] != originalSignature[indexSignature]) {
								throw new Error(ERR_INVALID_SIGNATURE);
							}
						}
					}
					controller.enqueue(decryptedChunkArray);
				}
			});
		}
	}

	class AESEncryptionStream extends TransformStream {

		constructor(password, strength) {
			let stream;
			super({
				start() {
					Object.assign(this, {
						ready: new Promise(resolve => this.resolveReady = resolve),
						password,
						strength: strength - 1,
						pending: new Uint8Array()
					});
				},
				async transform(chunk, controller) {
					const aesCrypto = this;
					const {
						password,
						strength,
						resolveReady,
						ready
					} = aesCrypto;
					let preamble = new Uint8Array();
					if (password) {
						preamble = await createEncryptionKeys(aesCrypto, strength, password);
						resolveReady();
					} else {
						await ready;
					}
					const output = new Uint8Array(preamble.length + chunk.length - (chunk.length % BLOCK_LENGTH));
					output.set(preamble, 0);
					controller.enqueue(append(aesCrypto, chunk, output, preamble.length, 0));
				},
				async flush(controller) {
					const {
						ctr,
						hmac,
						pending,
						ready
					} = this;
					await ready;
					let encryptedChunkArray = new Uint8Array();
					if (pending.length) {
						const encryptedChunk = ctr.update(toBits(codecBytes, pending));
						hmac.update(encryptedChunk);
						encryptedChunkArray = fromBits(codecBytes, encryptedChunk);
					}
					stream.signature = fromBits(codecBytes, hmac.digest()).slice(0, SIGNATURE_LENGTH);
					controller.enqueue(concat(encryptedChunkArray, stream.signature));
				}
			});
			stream = this;
		}
	}

	function append(aesCrypto, input, output, paddingStart, paddingEnd, verifySignature) {
		const {
			ctr,
			hmac,
			pending
		} = aesCrypto;
		const inputLength = input.length - paddingEnd;
		if (pending.length) {
			input = concat(pending, input);
			output = expand(output, inputLength - (inputLength % BLOCK_LENGTH));
		}
		let offset;
		for (offset = 0; offset <= inputLength - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
			const inputChunk = toBits(codecBytes, subarray(input, offset, offset + BLOCK_LENGTH));
			if (verifySignature) {
				hmac.update(inputChunk);
			}
			const outputChunk = ctr.update(inputChunk);
			if (!verifySignature) {
				hmac.update(outputChunk);
			}
			output.set(fromBits(codecBytes, outputChunk), offset + paddingStart);
		}
		aesCrypto.pending = subarray(input, offset);
		return output;
	}

	async function createDecryptionKeys(decrypt, strength, password, preamble) {
		const passwordVerificationKey = await createKeys$1(decrypt, strength, password, subarray(preamble, 0, SALT_LENGTH[strength]));
		const passwordVerification = subarray(preamble, SALT_LENGTH[strength]);
		if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
			throw new Error(ERR_INVALID_PASSWORD);
		}
	}

	async function createEncryptionKeys(encrypt, strength, password) {
		const salt = getRandomValues(new Uint8Array(SALT_LENGTH[strength]));
		const passwordVerification = await createKeys$1(encrypt, strength, password, salt);
		return concat(salt, passwordVerification);
	}

	async function createKeys$1(aesCrypto, strength, password, salt) {
		aesCrypto.password = null;
		const encodedPassword = encodeText(password);
		const baseKey = await importKey(RAW_FORMAT, encodedPassword, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
		const derivedBits = await deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), baseKey, 8 * ((KEY_LENGTH[strength] * 2) + 2));
		const compositeKey = new Uint8Array(derivedBits);
		const key = toBits(codecBytes, subarray(compositeKey, 0, KEY_LENGTH[strength]));
		const authentication = toBits(codecBytes, subarray(compositeKey, KEY_LENGTH[strength], KEY_LENGTH[strength] * 2));
		const passwordVerification = subarray(compositeKey, KEY_LENGTH[strength] * 2);
		Object.assign(aesCrypto, {
			keys: {
				key,
				authentication,
				passwordVerification
			},
			ctr: new CtrGladman(new Aes(key), Array.from(COUNTER_DEFAULT_VALUE)),
			hmac: new HmacSha1(authentication)
		});
		return passwordVerification;
	}

	function importKey(format, password, algorithm, extractable, keyUsages) {
		if (IMPORT_KEY_SUPPORTED) {
			return subtle.importKey(format, password, algorithm, extractable, keyUsages);
		} else {
			return misc.importKey(password);
		}
	}

	async function deriveBits(algorithm, baseKey, length) {
		if (DERIVE_BITS_SUPPORTED) {
			return await subtle.deriveBits(algorithm, baseKey, length);
		} else {
			return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
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

	function subarray(array, begin, end) {
		return array.subarray(begin, end);
	}

	function fromBits(codecBytes, chunk) {
		return codecBytes.fromBits(chunk);
	}
	function toBits(codecBytes, chunk) {
		return codecBytes.toBits(chunk);
	}

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

	const HEADER_LENGTH = 12;

	class ZipCryptoDecryptionStream extends TransformStream {

		constructor(password, passwordVerification) {
			super({
				start() {
					Object.assign(this, {
						password,
						passwordVerification
					});
					createKeys(this, password);
				},
				transform(chunk, controller) {
					const zipCrypto = this;
					if (zipCrypto.password) {
						const decryptedHeader = decrypt(zipCrypto, chunk.subarray(0, HEADER_LENGTH));
						zipCrypto.password = null;
						if (decryptedHeader[HEADER_LENGTH - 1] != zipCrypto.passwordVerification) {
							throw new Error(ERR_INVALID_PASSWORD);
						}
						chunk = chunk.subarray(HEADER_LENGTH);
					}
					controller.enqueue(decrypt(zipCrypto, chunk));
				}
			});
		}
	}

	class ZipCryptoEncryptionStream extends TransformStream {

		constructor(password, passwordVerification) {
			super({
				start() {
					Object.assign(this, {
						password,
						passwordVerification
					});
					createKeys(this, password);
				},
				transform(chunk, controller) {
					const zipCrypto = this;
					let output;
					let offset;
					if (zipCrypto.password) {
						zipCrypto.password = null;
						const header = getRandomValues(new Uint8Array(HEADER_LENGTH));
						header[HEADER_LENGTH - 1] = zipCrypto.passwordVerification;
						output = new Uint8Array(chunk.length + header.length);
						output.set(encrypt(zipCrypto, header), 0);
						offset = HEADER_LENGTH;
					} else {
						output = new Uint8Array(chunk.length);
						offset = 0;
					}
					output.set(encrypt(zipCrypto, chunk), offset);
					controller.enqueue(output);
				}
			});
		}
	}

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
		const keys = [0x12345678, 0x23456789, 0x34567890];
		Object.assign(target, {
			keys,
			crcKey0: new Crc32(keys[0]),
			crcKey2: new Crc32(keys[2]),
		});
		for (let index = 0; index < password.length; index++) {
			updateKeys(target, password.charCodeAt(index));
		}
	}

	function updateKeys(target, byte) {
		let [key0, key1, key2] = target.keys;
		target.crcKey0.append([byte]);
		key0 = ~target.crcKey0.get();
		key1 = getInt32(Math.imul(getInt32(key1 + getInt8(key0)), 134775813) + 1);
		target.crcKey2.append([key1 >>> 24]);
		key2 = ~target.crcKey2.get();
		target.keys = [key0, key1, key2];
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

	const COMPRESSION_FORMAT = "deflate-raw";

	class DeflateStream extends TransformStream {

		constructor(options, { chunkSize, CompressionStream, CompressionStreamNative }) {
			super({});
			const { compressed, encrypted, useCompressionStream, password, passwordVerification, encryptionStrength, zipCrypto, signed, level } = options;
			const stream = this;
			let crc32Stream, encryptionStream;
			let readable = filterEmptyChunks(super.readable);
			if ((!encrypted || zipCrypto) && signed) {
				[readable, crc32Stream] = readable.tee();
				crc32Stream = pipeThrough(crc32Stream, new Crc32Stream());
			}
			if (compressed) {
				readable = pipeThroughCommpressionStream(readable, useCompressionStream, { level, chunkSize }, CompressionStreamNative, CompressionStream);
			}
			if (encrypted) {
				if (zipCrypto) {
					readable = pipeThrough(readable, new ZipCryptoEncryptionStream(password, passwordVerification));
				} else {
					encryptionStream = new AESEncryptionStream(password, encryptionStrength);
					readable = pipeThrough(readable, encryptionStream);
				}
			}
			setReadable(stream, readable, async () => {
				let signature;
				if (encrypted && !zipCrypto) {
					signature = encryptionStream.signature;
				}
				if ((!encrypted || zipCrypto) && signed) {
					signature = await crc32Stream.getReader().read();
					signature = new DataView(signature.value.buffer).getUint32(0);
				}
				stream.signature = signature;
			});
		}
	}

	class InflateStream extends TransformStream {

		constructor(options, { chunkSize, DecompressionStream, DecompressionStreamNative }) {
			super({});
			const { zipCrypto, encrypted, password, passwordVerification, signed, signature, encryptionStrength, compressed, useCompressionStream } = options;
			let crc32Stream, decryptionStream;
			let readable = filterEmptyChunks(super.readable);
			if (encrypted) {
				if (zipCrypto) {
					readable = pipeThrough(readable, new ZipCryptoDecryptionStream(password, passwordVerification));
				} else {
					decryptionStream = new AESDecryptionStream(password, signed, encryptionStrength);
					readable = pipeThrough(readable, decryptionStream);
				}
			}
			if (compressed) {
				readable = pipeThroughCommpressionStream(readable, useCompressionStream, { chunkSize }, DecompressionStreamNative, DecompressionStream);
			}
			if ((!encrypted || zipCrypto) && signed) {
				[readable, crc32Stream] = readable.tee();
				crc32Stream = pipeThrough(crc32Stream, new Crc32Stream());
			}
			setReadable(this, readable, async () => {
				if ((!encrypted || zipCrypto) && signed) {
					const streamSignature = await crc32Stream.getReader().read();
					const dataViewSignature = new DataView(streamSignature.value.buffer);
					if (signature != dataViewSignature.getUint32(0, false)) {
						throw new Error(ERR_INVALID_SIGNATURE);
					}
				}
			});
		}
	}

	function filterEmptyChunks(readable) {
		return pipeThrough(readable, new TransformStream({
			transform(chunk, controller) {
				if (chunk && chunk.length) {
					controller.enqueue(chunk);
				}
			}
		}));
	}

	function setReadable(stream, readable, flush) {
		readable = pipeThrough(readable, new TransformStream({ flush }));
		Object.defineProperty(stream, "readable", {
			get() {
				return readable;
			}
		});
	}

	function pipeThroughCommpressionStream(readable, useCompressionStream, options, CodecStreamNative, CodecStream) {
		try {
			const CompressionStream = useCompressionStream && CodecStreamNative ? CodecStreamNative : CodecStream;
			readable = pipeThrough(readable, new CompressionStream(COMPRESSION_FORMAT, options));
		} catch (error) {
			if (useCompressionStream) {
				readable = pipeThrough(readable, new CodecStream(COMPRESSION_FORMAT, options));
			} else {
				throw error;
			}
		}
		return readable;
	}

	function pipeThrough(readable, transformStream) {
		return readable.pipeThrough(transformStream);
	}

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

	/*
	 * This program is based on JZlib 1.0.2 ymnk, JCraft,Inc.
	 * JZlib is based on zlib-1.1.3, so all credit should go authors
	 * Jean-loup Gailly(jloup@gzip.org) and Mark Adler(madler@alumni.caltech.edu)
	 * and contributors of zlib.
	 */

	/* global TransformStream */

	class CodecStream extends TransformStream {

		constructor(Codec, options) {
			const codec = new Codec(options);
			super({
				transform(chunk, controller) {
					controller.enqueue(codec.append(chunk));
				},
				flush(controller) {
					const chunk = codec.flush();
					if (chunk) {
						controller.enqueue(chunk);
					}
				}
			});
		}
	}

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

	const CODEC_DEFLATE = "deflate";
	const CODEC_INFLATE = "inflate";
	const MESSAGE_EVENT_TYPE = "message";
	const MESSAGE_START = "start";
	const MESSAGE_PULL = "pull";
	const MESSAGE_DATA = "data";
	const MESSAGE_ACK_DATA = "ack";
	const MESSAGE_CLOSE = "close";

	class Codec {

		constructor(readable, writable, options, config) {
			const { codecType } = options;
			let CodecStream;
			if (codecType.startsWith(CODEC_DEFLATE)) {
				CodecStream = DeflateStream;
			} else if (codecType.startsWith(CODEC_INFLATE)) {
				CodecStream = InflateStream;
			}
			Object.assign(this, {
				CodecStream,
				readable,
				writable,
				options,
				config
			});
		}

		async run() {
			const {
				CodecStream,
				readable,
				writable,
				options,
				config
			} = this;
			const stream = new CodecStream(options, config);
			let size = 0;
			await readable
				.pipeThrough(stream)
				.pipeThrough(new TransformStream({
					transform(chunk, controller) {
						if (chunk && chunk.length) {
							size += chunk.length;
							controller.enqueue(chunk);
						}
					}
				}))
				.pipeTo(writable, { preventClose: true, preventAbort: true });
			const { signature } = stream;
			return { size, signature };
		}
	}

	function getCodecStreamClass(Codec) {
		return class extends CodecStream {
			constructor(algorithm, options) {
				super(Codec, options);
			}
		};
	}

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
	const EXTRAFIELD_TYPE_NTFS = 0x000a;
	const EXTRAFIELD_TYPE_NTFS_TAG1 = 0x0001;
	const EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 0x5455;
	const EXTRAFIELD_TYPE_UNICODE_PATH = 0x7075;
	const EXTRAFIELD_TYPE_UNICODE_COMMENT = 0x6375;

	const BITFLAG_ENCRYPTED = 0x01;
	const BITFLAG_LEVEL = 0x06;
	const BITFLAG_DATA_DESCRIPTOR = 0x0008;
	const BITFLAG_LANG_ENCODING_FLAG = 0x0800;
	const FILE_ATTR_MSDOS_DIR_MASK = 0x10;

	const VERSION_DEFLATE = 0x14;
	const VERSION_ZIP64 = 0x2D;
	const VERSION_AES = 0x33;

	const DIRECTORY_SIGNATURE = "/";

	const MAX_DATE = new Date(2107, 11, 31);
	const MIN_DATE = new Date(1980, 0, 1);

	const UNDEFINED_VALUE = undefined;
	const UNDEFINED_TYPE = "undefined";

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

	const MINIMUM_CHUNK_SIZE = 64;
	let maxWorkers = 2;
	try {
		if (typeof navigator != UNDEFINED_TYPE && navigator.hardwareConcurrency) {
			maxWorkers = navigator.hardwareConcurrency;
		}
	} catch (_error) {
		// ignored
	}
	const DEFAULT_CONFIGURATION = {
		chunkSize: 512 * 1024,
		maxWorkers,
		terminateWorkerTimeout: 5000,
		useWebWorkers: true,
		useCompressionStream: true,
		workerScripts: UNDEFINED_VALUE,
		CompressionStreamNative: typeof CompressionStream != UNDEFINED_TYPE && CompressionStream,
		DecompressionStreamNative: typeof DecompressionStream != UNDEFINED_TYPE && DecompressionStream
	};

	const config = Object.assign({}, DEFAULT_CONFIGURATION);

	function getConfiguration() {
		return config;
	}

	function getChunkSize(config) {
		return Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
	}

	function configure(configuration) {
		const {
			baseURL,
			chunkSize,
			maxWorkers,
			terminateWorkerTimeout,
			useCompressionStream,
			useWebWorkers,
			Deflate,
			Inflate,
			CompressionStream,
			DecompressionStream,
			workerScripts
		} = configuration;
		setIfDefined("baseURL", baseURL);
		setIfDefined("chunkSize", chunkSize);
		setIfDefined("maxWorkers", maxWorkers);
		setIfDefined("terminateWorkerTimeout", terminateWorkerTimeout);
		setIfDefined("useCompressionStream", useCompressionStream);
		setIfDefined("useWebWorkers", useWebWorkers);
		if (Deflate) {
			config.CompressionStream = getCodecStreamClass(Deflate);
		}
		if (Inflate) {
			config.DecompressionStream = getCodecStreamClass(Inflate);
		}
		setIfDefined("CompressionStream", CompressionStream);
		setIfDefined("DecompressionStream", DecompressionStream);
		if (workerScripts !== UNDEFINED_VALUE) {
			const { deflate, inflate } = workerScripts;
			if (deflate || inflate) {
				if (!config.workerScripts) {
					config.workerScripts = {};
				}
			}
			if (deflate) {
				if (!Array.isArray(deflate)) {
					throw new Error("workerScripts.deflate must be an array");
				}
				config.workerScripts.deflate = deflate;
			}
			if (inflate) {
				if (!Array.isArray(inflate)) {
					throw new Error("workerScripts.inflate must be an array");
				}
				config.workerScripts.inflate = inflate;
			}
		}
	}

	function setIfDefined(propertyName, propertyValue) {
		if (propertyValue !== UNDEFINED_VALUE) {
			config[propertyName] = propertyValue;
		}
	}

	function e(e){const t=()=>URL.createObjectURL(new Blob(['const{Array:e,Object:t,Math:n,Error:r,Uint8Array:s,Uint16Array:i,Uint32Array:o,Int32Array:c,Map:f,DataView:a,Promise:l,TextEncoder:u,crypto:w,postMessage:h,TransformStream:d,ReadableStream:p,WritableStream:y,CompressionStream:m,DecompressionStream:b}=self,g=[];for(let e=0;256>e;e++){let t=e;for(let e=0;8>e;e++)1&t?t=t>>>1^3988292384:t>>>=1;g[e]=t}class k{constructor(e){this.t=e||-1}append(e){let t=0|this.t;for(let n=0,r=0|e.length;r>n;n++)t=t>>>8^g[255&(t^e[n])];this.t=t}get(){return~this.t}}class v extends d{constructor(){const e=new k;super({transform(t){e.append(t)},flush(t){const n=new s(4);new a(n.buffer).setUint32(0,e.get()),t.enqueue(n)}})}}const S={concat(e,t){if(0===e.length||0===t.length)return e.concat(t);const n=e[e.length-1],r=S.i(n);return 32===r?e.concat(t):S.o(t,r,0|n,e.slice(0,e.length-1))},l(e){const t=e.length;if(0===t)return 0;const n=e[t-1];return 32*(t-1)+S.i(n)},u(e,t){if(32*e.length<t)return e;const r=(e=e.slice(0,n.ceil(t/32))).length;return t&=31,r>0&&t&&(e[r-1]=S.h(t,e[r-1]&2147483648>>t-1,1)),e},h:(e,t,n)=>32===e?t:(n?0|t:t<<32-e)+1099511627776*e,i:e=>n.round(e/1099511627776)||32,o(e,t,n,r){for(void 0===r&&(r=[]);t>=32;t-=32)r.push(n),n=0;if(0===t)return r.concat(e);for(let s=0;s<e.length;s++)r.push(n|e[s]>>>t),n=e[s]<<32-t;const s=e.length?e[e.length-1]:0,i=S.i(s);return r.push(S.h(t+i&31,t+i>32?n:r.pop(),1)),r}},C={p:{m(e){const t=S.l(e)/8,n=new s(t);let r;for(let s=0;t>s;s++)0==(3&s)&&(r=e[s/4]),n[s]=r>>>24,r<<=8;return n},g(e){const t=[];let n,r=0;for(n=0;n<e.length;n++)r=r<<8|e[n],3==(3&n)&&(t.push(r),r=0);return 3&n&&t.push(S.h(8*(3&n),r)),t}}},z={k:function(e){e?(this.v=e.v.slice(0),this.S=e.S.slice(0),this.C=e.C):this.reset()}};z.k.prototype={blockSize:512,reset(){const e=this;return e.v=this._.slice(0),e.S=[],e.C=0,e},update(e){const t=this;"string"==typeof e&&(e=C.I.g(e));const n=t.S=S.concat(t.S,e),s=t.C,i=t.C=s+S.l(e);if(i>9007199254740991)throw new r("Cannot hash more than 2^53 - 1 bits");const c=new o(n);let f=0;for(let e=t.blockSize+s-(t.blockSize+s&t.blockSize-1);i>=e;e+=t.blockSize)t.A(c.subarray(16*f,16*(f+1))),f+=1;return n.splice(0,16*f),t},D(){const e=this;let t=e.S;const r=e.v;t=S.concat(t,[S.h(1,1)]);for(let e=t.length+2;15&e;e++)t.push(0);for(t.push(n.floor(e.C/4294967296)),t.push(0|e.C);t.length;)e.A(t.splice(0,16));return e.reset(),r},_:[1732584193,4023233417,2562383102,271733878,3285377520],V:[1518500249,1859775393,2400959708,3395469782],R:(e,t,n,r)=>e>19?e>39?e>59?e>79?void 0:t^n^r:t&n|t&r|n&r:t^n^r:t&n|~t&r,B:(e,t)=>t<<e|t>>>32-e,A(t){const r=this,s=r.v,i=e(80);for(let e=0;16>e;e++)i[e]=t[e];let o=s[0],c=s[1],f=s[2],a=s[3],l=s[4];for(let e=0;79>=e;e++){16>e||(i[e]=r.B(1,i[e-3]^i[e-8]^i[e-14]^i[e-16]));const t=r.B(5,o)+r.R(e,c,f,a)+l+i[e]+r.V[n.floor(e/20)]|0;l=a,a=f,f=r.B(30,c),c=o,o=t}s[0]=s[0]+o|0,s[1]=s[1]+c|0,s[2]=s[2]+f|0,s[3]=s[3]+a|0,s[4]=s[4]+l|0}};const _={getRandomValues(e){const t=new o(e.buffer),r=e=>{let t=987654321;const r=4294967295;return()=>(t=36969*(65535&t)+(t>>16)&r,(((t<<16)+(e=18e3*(65535&e)+(e>>16)&r)&r)/4294967296+.5)*(n.random()>.5?1:-1))};for(let s,i=0;i<e.length;i+=4){const e=r(4294967296*(s||n.random()));s=987654071*e(),t[i/4]=4294967296*e()|0}return e}},I={importKey:e=>new I.M(C.p.g(e)),K(e,t,n,s){if(n=n||1e4,0>s||0>n)throw new r("invalid params to pbkdf2");const i=1+(s>>5)<<2;let o,c,f,l,u;const w=new ArrayBuffer(i),h=new a(w);let d=0;const p=S;for(t=C.p.g(t),u=1;(i||1)>d;u++){for(o=c=e.encrypt(p.concat(t,[u])),f=1;n>f;f++)for(c=e.encrypt(c),l=0;l<c.length;l++)o[l]^=c[l];for(f=0;(i||1)>d&&f<o.length;f++)h.setInt32(d,o[f]),d+=4}return w.slice(0,s/8)},M:class{constructor(e){const t=this,n=t.N=z.k,r=[[],[]],s=n.prototype.blockSize/32;t.P=[new n,new n],e.length>s&&(e=n.hash(e));for(let t=0;s>t;t++)r[0][t]=909522486^e[t],r[1][t]=1549556828^e[t];t.P[0].update(r[0]),t.P[1].update(r[1]),t.U=new n(t.P[0])}reset(){const e=this;e.U=new e.N(e.P[0]),e.T=!1}update(e){this.T=!0,this.U.update(e)}digest(){const e=this,t=e.U.D(),n=new e.N(e.P[1]).update(t).D();return e.reset(),n}encrypt(e){if(this.T)throw new r("encrypt on already updated hmac called!");return this.update(e),this.digest(e)}}},x=void 0!==w&&"function"==typeof w.getRandomValues;function A(e){return x?w.getRandomValues(e):_.getRandomValues(e)}const D={name:"PBKDF2"},V=t.assign({hash:{name:"HMAC"}},D),R=t.assign({iterations:1e3,hash:{name:"SHA-1"}},D),B=["deriveBits"],E=[8,12,16],M=[16,24,32],K=[0,0,0,0],N=void 0!==w,P=N&&w.subtle,U=N&&void 0!==P,T=N&&U&&"function"==typeof P.importKey,W=N&&U&&"function"==typeof P.deriveBits,H=C.p,L=class{constructor(e){const t=this;t.W=[[[],[],[],[],[]],[[],[],[],[],[]]],t.W[0][0][0]||t.H();const n=t.W[0][4],s=t.W[1],i=e.length;let o,c,f,a=1;if(4!==i&&6!==i&&8!==i)throw new r("invalid aes key size");for(t.V=[c=e.slice(0),f=[]],o=i;4*i+28>o;o++){let e=c[o-1];(o%i==0||8===i&&o%i==4)&&(e=n[e>>>24]<<24^n[e>>16&255]<<16^n[e>>8&255]<<8^n[255&e],o%i==0&&(e=e<<8^e>>>24^a<<24,a=a<<1^283*(a>>7))),c[o]=c[o-i]^e}for(let e=0;o;e++,o--){const t=c[3&e?o:o-4];f[e]=4>=o||4>e?t:s[0][n[t>>>24]]^s[1][n[t>>16&255]]^s[2][n[t>>8&255]]^s[3][n[255&t]]}}encrypt(e){return this.L(e,0)}decrypt(e){return this.L(e,1)}H(){const e=this.W[0],t=this.W[1],n=e[4],r=t[4],s=[],i=[];let o,c,f,a;for(let e=0;256>e;e++)i[(s[e]=e<<1^283*(e>>7))^e]=e;for(let l=o=0;!n[l];l^=c||1,o=i[o]||1){let i=o^o<<1^o<<2^o<<3^o<<4;i=i>>8^255&i^99,n[l]=i,r[i]=l,a=s[f=s[c=s[l]]];let u=16843009*a^65537*f^257*c^16843008*l,w=257*s[i]^16843008*i;for(let n=0;4>n;n++)e[n][l]=w=w<<24^w>>>8,t[n][i]=u=u<<24^u>>>8}for(let n=0;5>n;n++)e[n]=e[n].slice(0),t[n]=t[n].slice(0)}L(e,t){if(4!==e.length)throw new r("invalid aes block size");const n=this.V[t],s=n.length/4-2,i=[0,0,0,0],o=this.W[t],c=o[0],f=o[1],a=o[2],l=o[3],u=o[4];let w,h,d,p=e[0]^n[0],y=e[t?3:1]^n[1],m=e[2]^n[2],b=e[t?1:3]^n[3],g=4;for(let e=0;s>e;e++)w=c[p>>>24]^f[y>>16&255]^a[m>>8&255]^l[255&b]^n[g],h=c[y>>>24]^f[m>>16&255]^a[b>>8&255]^l[255&p]^n[g+1],d=c[m>>>24]^f[b>>16&255]^a[p>>8&255]^l[255&y]^n[g+2],b=c[b>>>24]^f[p>>16&255]^a[y>>8&255]^l[255&m]^n[g+3],g+=4,p=w,y=h,m=d;for(let e=0;4>e;e++)i[t?3&-e:e]=u[p>>>24]<<24^u[y>>16&255]<<16^u[m>>8&255]<<8^u[255&b]^n[g++],w=p,p=y,y=m,m=b,b=w;return i}},j=class{constructor(e,t){this.j=e,this.F=t,this.O=t}reset(){this.O=this.F}update(e){return this.q(this.j,e,this.O)}G(e){if(255==(e>>24&255)){let t=e>>16&255,n=e>>8&255,r=255&e;255===t?(t=0,255===n?(n=0,255===r?r=0:++r):++n):++t,e=0,e+=t<<16,e+=n<<8,e+=r}else e+=1<<24;return e}J(e){0===(e[0]=this.G(e[0]))&&(e[1]=this.G(e[1]))}q(e,t,n){let r;if(!(r=t.length))return[];const s=S.l(t);for(let s=0;r>s;s+=4){this.J(n);const r=e.encrypt(n);t[s]^=r[0],t[s+1]^=r[1],t[s+2]^=r[2],t[s+3]^=r[3]}return S.u(t,s)}},F=I.M;class O extends d{constructor(e,n,i){super({start(){t.assign(this,{ready:new l((e=>this.X=e)),password:e,signed:n,Y:i-1,pending:new s})},async transform(e,t){const n=this,{password:i,Y:o,X:c,ready:f}=n;i?(await(async(e,t,n,s)=>{const i=await J(e,t,n,X(s,0,E[t])),o=X(s,E[t]);if(i[0]!=o[0]||i[1]!=o[1])throw new r("Invalid password")})(n,o,i,X(e,0,E[o]+2)),e=X(e,E[o]+2),c()):await f;const a=new s(e.length-10-(e.length-10)%16);t.enqueue(G(n,e,a,0,10,!0))},async flush(e){const{signed:t,Z:n,$:i,pending:o,ready:c}=this;await c;const f=X(o,0,o.length-10),a=X(o,o.length-10);let l=new s;if(f.length){const e=Z(H,f);i.update(e);const t=n.update(e);l=Y(H,t)}if(t){const e=X(Y(H,i.digest()),0,10);for(let t=0;10>t;t++)if(e[t]!=a[t])throw new r("Invalid signature")}e.enqueue(l)}})}}class q extends d{constructor(e,n){let r;super({start(){t.assign(this,{ready:new l((e=>this.X=e)),password:e,Y:n-1,pending:new s})},async transform(e,t){const n=this,{password:r,Y:i,X:o,ready:c}=n;let f=new s;r?(f=await(async(e,t,n)=>{const r=A(new s(E[t]));return Q(r,await J(e,t,n,r))})(n,i,r),o()):await c;const a=new s(f.length+e.length-e.length%16);a.set(f,0),t.enqueue(G(n,e,a,f.length,0))},async flush(e){const{Z:t,$:n,pending:i,ready:o}=this;await o;let c=new s;if(i.length){const e=t.update(Z(H,i));n.update(e),c=Y(H,e)}r.signature=Y(H,n.digest()).slice(0,10),e.enqueue(Q(c,r.signature))}}),r=this}}function G(e,t,n,r,i,o){const{Z:c,$:f,pending:a}=e,l=t.length-i;let u;for(a.length&&(t=Q(a,t),n=((e,t)=>{if(t&&t>e.length){const n=e;(e=new s(t)).set(n,0)}return e})(n,l-l%16)),u=0;l-16>=u;u+=16){const e=Z(H,X(t,u,u+16));o&&f.update(e);const s=c.update(e);o||f.update(s),n.set(Y(H,s),u+r)}return e.pending=X(t,u),n}async function J(n,r,i,o){n.password=null;const c=(e=>{if(void 0===u){const t=new s((e=unescape(encodeURIComponent(e))).length);for(let n=0;n<t.length;n++)t[n]=e.charCodeAt(n);return t}return(new u).encode(e)})(i),f=await((e,t,n,r,s)=>T?P.importKey("raw",t,n,!1,s):I.importKey(t))(0,c,V,0,B),a=await(async(e,t,n)=>W?await P.deriveBits(e,t,n):I.K(t,e.salt,R.iterations,n))(t.assign({salt:o},R),f,8*(2*M[r]+2)),l=new s(a),w=Z(H,X(l,0,M[r])),h=Z(H,X(l,M[r],2*M[r])),d=X(l,2*M[r]);return t.assign(n,{keys:{key:w,ee:h,passwordVerification:d},Z:new j(new L(w),e.from(K)),$:new F(h)}),d}function Q(e,t){let n=e;return e.length+t.length&&(n=new s(e.length+t.length),n.set(e,0),n.set(t,e.length)),n}function X(e,t,n){return e.subarray(t,n)}function Y(e,t){return e.m(t)}function Z(e,t){return e.g(t)}class $ extends d{constructor(e,n){super({start(){t.assign(this,{password:e,passwordVerification:n}),re(this,e)},transform(e,t){const n=this;if(n.password){const t=te(n,e.subarray(0,12));if(n.password=null,t[11]!=n.passwordVerification)throw new r("Invalid password");e=e.subarray(12)}t.enqueue(te(n,e))}})}}class ee extends d{constructor(e,n){super({start(){t.assign(this,{password:e,passwordVerification:n}),re(this,e)},transform(e,t){const n=this;let r,i;if(n.password){n.password=null;const t=A(new s(12));t[11]=n.passwordVerification,r=new s(e.length+t.length),r.set(ne(n,t),0),i=12}else r=new s(e.length),i=0;r.set(ne(n,e),i),t.enqueue(r)}})}}function te(e,t){const n=new s(t.length);for(let r=0;r<t.length;r++)n[r]=ie(e)^t[r],se(e,n[r]);return n}function ne(e,t){const n=new s(t.length);for(let r=0;r<t.length;r++)n[r]=ie(e)^t[r],se(e,t[r]);return n}function re(e,n){const r=[305419896,591751049,878082192];t.assign(e,{keys:r,te:new k(r[0]),ne:new k(r[2])});for(let t=0;t<n.length;t++)se(e,n.charCodeAt(t))}function se(e,t){let[r,s,i]=e.keys;e.te.append([t]),r=~e.te.get(),s=ce(n.imul(ce(s+oe(r)),134775813)+1),e.ne.append([s>>>24]),i=~e.ne.get(),e.keys=[r,s,i]}function ie(e){const t=2|e.keys[2];return oe(n.imul(t,1^t)>>>8)}function oe(e){return 255&e}function ce(e){return 4294967295&e}class fe extends d{constructor(e,{chunkSize:t,CompressionStream:n,re:r}){super({});const{compressed:s,encrypted:i,useCompressionStream:o,password:c,passwordVerification:f,encryptionStrength:l,zipCrypto:u,signed:w,level:h}=e,d=this;let p,y,m=le(super.readable);i&&!u||!w||([m,p]=m.tee(),p=he(p,new v)),s&&(m=we(m,o,{level:h,chunkSize:t},r,n)),i&&(u?m=he(m,new ee(c,f)):(y=new q(c,l),m=he(m,y))),ue(d,m,(async()=>{let e;i&&!u&&(e=y.signature),i&&!u||!w||(e=await p.getReader().read(),e=new a(e.value.buffer).getUint32(0)),d.signature=e}))}}class ae extends d{constructor(e,{chunkSize:t,DecompressionStream:n,se:s}){super({});const{zipCrypto:i,encrypted:o,password:c,passwordVerification:f,signed:l,signature:u,encryptionStrength:w,compressed:h,useCompressionStream:d}=e;let p,y,m=le(super.readable);o&&(i?m=he(m,new $(c,f)):(y=new O(c,l,w),m=he(m,y))),h&&(m=we(m,d,{chunkSize:t},s,n)),o&&!i||!l||([m,p]=m.tee(),p=he(p,new v)),ue(this,m,(async()=>{if((!o||i)&&l){const e=await p.getReader().read(),t=new a(e.value.buffer);if(u!=t.getUint32(0,!1))throw new r("Invalid signature")}}))}}function le(e){return he(e,new d({transform(e,t){e&&e.length&&t.enqueue(e)}}))}function ue(e,n,r){n=he(n,new d({flush:r})),t.defineProperty(e,"readable",{get:()=>n})}function we(e,t,n,r,s){try{e=he(e,new(t&&r?r:s)("deflate-raw",n))}catch(r){if(!t)throw r;e=he(e,new s("deflate-raw",n))}return e}function he(e,t){return e.pipeThrough(t)}class de extends d{constructor(e,t){const n=new e(t);super({transform(e,t){t.enqueue(n.append(e))},flush(e){const t=n.flush();t&&e.enqueue(t)}})}}class pe{constructor(e,n,r,s){const{codecType:i}=r;let o;i.startsWith("deflate")?o=fe:i.startsWith("inflate")&&(o=ae),t.assign(this,{ie:o,readable:e,writable:n,options:r,config:s})}async oe(){const{ie:e,readable:t,writable:n,options:r,config:s}=this,i=new e(r,s);let o=0;await t.pipeThrough(i).pipeThrough(new d({transform(e,t){e&&e.length&&(o+=e.length,t.enqueue(e))}})).pipeTo(n,{ce:!0,fe:!0});const{signature:c}=i;return{size:o,signature:c}}}function ye(e){return class extends de{constructor(t,n){super(e,n)}}}const me=new f,be=new f;let ge,ke=0;async function ve(e){try{const{options:t,scripts:n,config:r}=e;n&&n.length&&importScripts.apply(void 0,n),self.initCodec&&self.initCodec(),r.re=self.CompressionStream,r.se=self.DecompressionStream,self.Deflate&&(r.CompressionStream=ye(self.Deflate)),self.Inflate&&(r.DecompressionStream=ye(self.Inflate));const s={highWaterMark:1,size:()=>r.chunkSize},i=e.readable||new p({async pull(e){let t=new l((e=>me.set(ke,e)));Se({type:"pull",messageId:ke}),ke=(ke+1)%Number.MAX_SAFE_INTEGER;const{value:n,done:r}=await t;e.enqueue(n),r&&e.close()}},s),o=e.writable||new y({async write(e){let t;const n=new l((e=>t=e));be.set(ke,t),Se({type:"data",data:e,messageId:ke}),ke=(ke+1)%Number.MAX_SAFE_INTEGER,await n}},s);ge=new pe(i,o,t,r);const c=await ge.oe();try{await o.close()}catch(e){}Se({type:"close",result:c})}catch(e){Ce(e)}}function Se(e){if(e.data){let{data:t}=e;if(t&&t.length)try{t=new s(t),e.data=t.buffer,h(e,[e.data])}catch(t){h(e)}else h(e)}else h(e)}function Ce(e){const{message:t,stack:n,code:r,name:s}=e;h({error:{message:t,stack:n,code:r,name:s}})}function ze(t){return _e(t.map((([t,n])=>new e(t).fill(n,0,t))))}function _e(t){return t.reduce(((t,n)=>t.concat(e.isArray(n)?_e(n):n)),[])}addEventListener("message",(async e=>{const t=e.data,{type:n,messageId:r,data:i,done:o}=t;try{if("start"==n&&ve(t),"data"==n){const e=me.get(r);me.delete(r),e({value:new s(i),done:o})}if("ack"==n){const e=be.get(r);be.delete(r),e()}}catch(e){Ce(e)}}));const Ie=[0,1,2,3].concat(...ze([[2,4],[2,5],[4,6],[4,7],[8,8],[8,9],[16,10],[16,11],[32,12],[32,13],[64,14],[64,15],[2,0],[1,16],[1,17],[2,18],[2,19],[4,20],[4,21],[8,22],[8,23],[16,24],[16,25],[32,26],[32,27],[64,28],[64,29]]));function xe(){const e=this;function t(e,t){let n=0;do{n|=1&e,e>>>=1,n<<=1}while(--t>0);return n>>>1}e.ae=r=>{const s=e.le,i=e.we.ue,o=e.we.he;let c,f,a,l=-1;for(r.de=0,r.pe=573,c=0;o>c;c++)0!==s[2*c]?(r.ye[++r.de]=l=c,r.me[c]=0):s[2*c+1]=0;for(;2>r.de;)a=r.ye[++r.de]=2>l?++l:0,s[2*a]=1,r.me[a]=0,r.be--,i&&(r.ge-=i[2*a+1]);for(e.ke=l,c=n.floor(r.de/2);c>=1;c--)r.ve(s,c);a=o;do{c=r.ye[1],r.ye[1]=r.ye[r.de--],r.ve(s,1),f=r.ye[1],r.ye[--r.pe]=c,r.ye[--r.pe]=f,s[2*a]=s[2*c]+s[2*f],r.me[a]=n.max(r.me[c],r.me[f])+1,s[2*c+1]=s[2*f+1]=a,r.ye[1]=a++,r.ve(s,1)}while(r.de>=2);r.ye[--r.pe]=r.ye[1],(t=>{const n=e.le,r=e.we.ue,s=e.we.Se,i=e.we.Ce,o=e.we.ze;let c,f,a,l,u,w,h=0;for(l=0;15>=l;l++)t._e[l]=0;for(n[2*t.ye[t.pe]+1]=0,c=t.pe+1;573>c;c++)f=t.ye[c],l=n[2*n[2*f+1]+1]+1,l>o&&(l=o,h++),n[2*f+1]=l,f>e.ke||(t._e[l]++,u=0,i>f||(u=s[f-i]),w=n[2*f],t.be+=w*(l+u),r&&(t.ge+=w*(r[2*f+1]+u)));if(0!==h){do{for(l=o-1;0===t._e[l];)l--;t._e[l]--,t._e[l+1]+=2,t._e[o]--,h-=2}while(h>0);for(l=o;0!==l;l--)for(f=t._e[l];0!==f;)a=t.ye[--c],a>e.ke||(n[2*a+1]!=l&&(t.be+=(l-n[2*a+1])*n[2*a],n[2*a+1]=l),f--)}})(r),((e,n,r)=>{const s=[];let i,o,c,f=0;for(i=1;15>=i;i++)s[i]=f=f+r[i-1]<<1;for(o=0;n>=o;o++)c=e[2*o+1],0!==c&&(e[2*o]=t(s[c]++,c))})(s,e.ke,r._e)}}function Ae(e,t,n,r,s){const i=this;i.ue=e,i.Se=t,i.Ce=n,i.he=r,i.ze=s}xe.Ie=[0,1,2,3,4,5,6,7].concat(...ze([[2,8],[2,9],[2,10],[2,11],[4,12],[4,13],[4,14],[4,15],[8,16],[8,17],[8,18],[8,19],[16,20],[16,21],[16,22],[16,23],[32,24],[32,25],[32,26],[31,27],[1,28]])),xe.xe=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],xe.Ae=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],xe.De=e=>256>e?Ie[e]:Ie[256+(e>>>7)],xe.Ve=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],xe.Re=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],xe.Be=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],xe.Ee=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];const De=ze([[144,8],[112,9],[24,7],[8,8]]);Ae.Me=_e([12,140,76,204,44,172,108,236,28,156,92,220,60,188,124,252,2,130,66,194,34,162,98,226,18,146,82,210,50,178,114,242,10,138,74,202,42,170,106,234,26,154,90,218,58,186,122,250,6,134,70,198,38,166,102,230,22,150,86,214,54,182,118,246,14,142,78,206,46,174,110,238,30,158,94,222,62,190,126,254,1,129,65,193,33,161,97,225,17,145,81,209,49,177,113,241,9,137,73,201,41,169,105,233,25,153,89,217,57,185,121,249,5,133,69,197,37,165,101,229,21,149,85,213,53,181,117,245,13,141,77,205,45,173,109,237,29,157,93,221,61,189,125,253,19,275,147,403,83,339,211,467,51,307,179,435,115,371,243,499,11,267,139,395,75,331,203,459,43,299,171,427,107,363,235,491,27,283,155,411,91,347,219,475,59,315,187,443,123,379,251,507,7,263,135,391,71,327,199,455,39,295,167,423,103,359,231,487,23,279,151,407,87,343,215,471,55,311,183,439,119,375,247,503,15,271,143,399,79,335,207,463,47,303,175,431,111,367,239,495,31,287,159,415,95,351,223,479,63,319,191,447,127,383,255,511,0,64,32,96,16,80,48,112,8,72,40,104,24,88,56,120,4,68,36,100,20,84,52,116,3,131,67,195,35,163,99,227].map(((e,t)=>[e,De[t]])));const Ve=ze([[30,5]]);function Re(e,t,n,r,s){const i=this;i.Ke=e,i.Ne=t,i.Pe=n,i.Ue=r,i.Te=s}Ae.We=_e([0,16,8,24,4,20,12,28,2,18,10,26,6,22,14,30,1,17,9,25,5,21,13,29,3,19,11,27,7,23].map(((e,t)=>[e,Ve[t]]))),Ae.He=new Ae(Ae.Me,xe.Ve,257,286,15),Ae.Le=new Ae(Ae.We,xe.Re,0,30,15),Ae.je=new Ae(null,xe.Be,0,19,7);const Be=[new Re(0,0,0,0,0),new Re(4,4,8,4,1),new Re(4,5,16,8,1),new Re(4,6,32,32,1),new Re(4,4,16,16,2),new Re(8,16,32,32,2),new Re(8,16,128,128,2),new Re(8,32,128,256,2),new Re(32,128,258,1024,2),new Re(32,258,258,4096,2)],Ee=["need dictionary","stream end","","","stream error","data error","","buffer error","",""];function Me(e,t,n,r){const s=e[2*t],i=e[2*n];return i>s||s==i&&r[t]<=r[n]}function Ke(){const e=this;let t,r,o,c,f,a,l,u,w,h,d,p,y,m,b,g,k,v,S,C,z,_,I,x,A,D,V,R,B,E,M,K,N;const P=new xe,U=new xe,T=new xe;let W,H,L,j,F,O;function q(){let t;for(t=0;286>t;t++)M[2*t]=0;for(t=0;30>t;t++)K[2*t]=0;for(t=0;19>t;t++)N[2*t]=0;M[512]=1,e.be=e.ge=0,H=L=0}function G(e,t){let n,r=-1,s=e[1],i=0,o=7,c=4;0===s&&(o=138,c=3),e[2*(t+1)+1]=65535;for(let f=0;t>=f;f++)n=s,s=e[2*(f+1)+1],++i<o&&n==s||(c>i?N[2*n]+=i:0!==n?(n!=r&&N[2*n]++,N[32]++):i>10?N[36]++:N[34]++,i=0,r=n,0===s?(o=138,c=3):n==s?(o=6,c=3):(o=7,c=4))}function J(t){e.Fe[e.pending++]=t}function Q(e){J(255&e),J(e>>>8&255)}function X(e,t){let n;const r=t;O>16-r?(n=e,F|=n<<O&65535,Q(F),F=n>>>16-O,O+=r-16):(F|=e<<O&65535,O+=r)}function Y(e,t){const n=2*e;X(65535&t[n],65535&t[n+1])}function Z(e,t){let n,r,s=-1,i=e[1],o=0,c=7,f=4;for(0===i&&(c=138,f=3),n=0;t>=n;n++)if(r=i,i=e[2*(n+1)+1],++o>=c||r!=i){if(f>o)do{Y(r,N)}while(0!=--o);else 0!==r?(r!=s&&(Y(r,N),o--),Y(16,N),X(o-3,2)):o>10?(Y(18,N),X(o-11,7)):(Y(17,N),X(o-3,3));o=0,s=r,0===i?(c=138,f=3):r==i?(c=6,f=3):(c=7,f=4)}}function $(){16==O?(Q(F),F=0,O=0):8>O||(J(255&F),F>>>=8,O-=8)}function ee(t,r){let s,i,o;if(e.Oe[H]=t,e.qe[H]=255&r,H++,0===t?M[2*r]++:(L++,t--,M[2*(xe.Ie[r]+256+1)]++,K[2*xe.De(t)]++),0==(8191&H)&&V>2){for(s=8*H,i=z-k,o=0;30>o;o++)s+=K[2*o]*(5+xe.Re[o]);if(s>>>=3,L<n.floor(H/2)&&s<n.floor(i/2))return!0}return H==W-1}function te(t,n){let r,s,i,o,c=0;if(0!==H)do{r=e.Oe[c],s=e.qe[c],c++,0===r?Y(s,t):(i=xe.Ie[s],Y(i+256+1,t),o=xe.Ve[i],0!==o&&(s-=xe.xe[i],X(s,o)),r--,i=xe.De(r),Y(i,n),o=xe.Re[i],0!==o&&(r-=xe.Ae[i],X(r,o)))}while(H>c);Y(256,t),j=t[513]}function ne(){O>8?Q(F):O>0&&J(255&F),F=0,O=0}function re(t,n,r){X(0+(r?1:0),3),((t,n)=>{ne(),j=8,Q(n),Q(~n),e.Fe.set(u.subarray(t,t+n),e.pending),e.pending+=n})(t,n)}function se(n){((t,n,r)=>{let s,i,o=0;V>0?(P.ae(e),U.ae(e),o=(()=>{let t;for(G(M,P.ke),G(K,U.ke),T.ae(e),t=18;t>=3&&0===N[2*xe.Ee[t]+1];t--);return e.be+=14+3*(t+1),t})(),s=e.be+3+7>>>3,i=e.ge+3+7>>>3,i>s||(s=i)):s=i=n+5,n+4>s||-1==t?i==s?(X(2+(r?1:0),3),te(Ae.Me,Ae.We)):(X(4+(r?1:0),3),((e,t,n)=>{let r;for(X(e-257,5),X(t-1,5),X(n-4,4),r=0;n>r;r++)X(N[2*xe.Ee[r]+1],3);Z(M,e-1),Z(K,t-1)})(P.ke+1,U.ke+1,o+1),te(M,K)):re(t,n,r),q(),r&&ne()})(0>k?-1:k,z-k,n),k=z,t.Ge()}function ie(){let e,n,r,s;do{if(s=w-I-z,0===s&&0===z&&0===I)s=f;else if(-1==s)s--;else if(z>=f+f-262){u.set(u.subarray(f,f+f),0),_-=f,z-=f,k-=f,e=y,r=e;do{n=65535&d[--r],d[r]=f>n?0:n-f}while(0!=--e);e=f,r=e;do{n=65535&h[--r],h[r]=f>n?0:n-f}while(0!=--e);s+=f}if(0===t.Je)return;e=t.Qe(u,z+I,s),I+=e,3>I||(p=255&u[z],p=(p<<g^255&u[z+1])&b)}while(262>I&&0!==t.Je)}function oe(e){let t,n,r=A,s=z,i=x;const o=z>f-262?z-(f-262):0;let c=E;const a=l,w=z+258;let d=u[s+i-1],p=u[s+i];B>x||(r>>=2),c>I&&(c=I);do{if(t=e,u[t+i]==p&&u[t+i-1]==d&&u[t]==u[s]&&u[++t]==u[s+1]){s+=2,t++;do{}while(u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&w>s);if(n=258-(w-s),s=w-258,n>i){if(_=e,i=n,n>=c)break;d=u[s+i-1],p=u[s+i]}}}while((e=65535&h[e&a])>o&&0!=--r);return i>I?I:i}e.me=[],e._e=[],e.ye=[],M=[],K=[],N=[],e.ve=(t,n)=>{const r=e.ye,s=r[n];let i=n<<1;for(;i<=e.de&&(i<e.de&&Me(t,r[i+1],r[i],e.me)&&i++,!Me(t,s,r[i],e.me));)r[n]=r[i],n=i,i<<=1;r[n]=s},e.Xe=(t,S,_,H,L,G)=>(H||(H=8),L||(L=8),G||(G=0),t.Ye=null,-1==S&&(S=6),1>L||L>9||8!=H||9>_||_>15||0>S||S>9||0>G||G>2?-2:(t.Ze=e,a=_,f=1<<a,l=f-1,m=L+7,y=1<<m,b=y-1,g=n.floor((m+3-1)/3),u=new s(2*f),h=[],d=[],W=1<<L+6,e.Fe=new s(4*W),o=4*W,e.Oe=new i(W),e.qe=new s(W),V=S,R=G,(t=>(t.$e=t.et=0,t.Ye=null,e.pending=0,e.tt=0,r=113,c=0,P.le=M,P.we=Ae.He,U.le=K,U.we=Ae.Le,T.le=N,T.we=Ae.je,F=0,O=0,j=8,q(),(()=>{w=2*f,d[y-1]=0;for(let e=0;y-1>e;e++)d[e]=0;D=Be[V].Ne,B=Be[V].Ke,E=Be[V].Pe,A=Be[V].Ue,z=0,k=0,I=0,v=x=2,C=0,p=0})(),0))(t))),e.nt=()=>42!=r&&113!=r&&666!=r?-2:(e.qe=null,e.Oe=null,e.Fe=null,d=null,h=null,u=null,e.Ze=null,113==r?-3:0),e.rt=(e,t,n)=>{let r=0;return-1==t&&(t=6),0>t||t>9||0>n||n>2?-2:(Be[V].Te!=Be[t].Te&&0!==e.$e&&(r=e.st(1)),V!=t&&(V=t,D=Be[V].Ne,B=Be[V].Ke,E=Be[V].Pe,A=Be[V].Ue),R=n,r)},e.it=(e,t,n)=>{let s,i=n,o=0;if(!t||42!=r)return-2;if(3>i)return 0;for(i>f-262&&(i=f-262,o=n-i),u.set(t.subarray(o,o+i),0),z=i,k=i,p=255&u[0],p=(p<<g^255&u[1])&b,s=0;i-3>=s;s++)p=(p<<g^255&u[s+2])&b,h[s&l]=d[p],d[p]=s;return 0},e.st=(n,s)=>{let i,w,m,A,B;if(s>4||0>s)return-2;if(!n.ot||!n.ct&&0!==n.Je||666==r&&4!=s)return n.Ye=Ee[4],-2;if(0===n.ft)return n.Ye=Ee[7],-5;var E;if(t=n,A=c,c=s,42==r&&(w=8+(a-8<<4)<<8,m=(V-1&255)>>1,m>3&&(m=3),w|=m<<6,0!==z&&(w|=32),w+=31-w%31,r=113,J((E=w)>>8&255),J(255&E)),0!==e.pending){if(t.Ge(),0===t.ft)return c=-1,0}else if(0===t.Je&&A>=s&&4!=s)return t.Ye=Ee[7],-5;if(666==r&&0!==t.Je)return n.Ye=Ee[7],-5;if(0!==t.Je||0!==I||0!=s&&666!=r){switch(B=-1,Be[V].Te){case 0:B=(e=>{let n,r=65535;for(r>o-5&&(r=o-5);;){if(1>=I){if(ie(),0===I&&0==e)return 0;if(0===I)break}if(z+=I,I=0,n=k+r,(0===z||z>=n)&&(I=z-n,z=n,se(!1),0===t.ft))return 0;if(z-k>=f-262&&(se(!1),0===t.ft))return 0}return se(4==e),0===t.ft?4==e?2:0:4==e?3:1})(s);break;case 1:B=(e=>{let n,r=0;for(;;){if(262>I){if(ie(),262>I&&0==e)return 0;if(0===I)break}if(3>I||(p=(p<<g^255&u[z+2])&b,r=65535&d[p],h[z&l]=d[p],d[p]=z),0===r||(z-r&65535)>f-262||2!=R&&(v=oe(r)),3>v)n=ee(0,255&u[z]),I--,z++;else if(n=ee(z-_,v-3),I-=v,v>D||3>I)z+=v,v=0,p=255&u[z],p=(p<<g^255&u[z+1])&b;else{v--;do{z++,p=(p<<g^255&u[z+2])&b,r=65535&d[p],h[z&l]=d[p],d[p]=z}while(0!=--v);z++}if(n&&(se(!1),0===t.ft))return 0}return se(4==e),0===t.ft?4==e?2:0:4==e?3:1})(s);break;case 2:B=(e=>{let n,r,s=0;for(;;){if(262>I){if(ie(),262>I&&0==e)return 0;if(0===I)break}if(3>I||(p=(p<<g^255&u[z+2])&b,s=65535&d[p],h[z&l]=d[p],d[p]=z),x=v,S=_,v=2,0!==s&&D>x&&f-262>=(z-s&65535)&&(2!=R&&(v=oe(s)),5>=v&&(1==R||3==v&&z-_>4096)&&(v=2)),3>x||v>x)if(0!==C){if(n=ee(0,255&u[z-1]),n&&se(!1),z++,I--,0===t.ft)return 0}else C=1,z++,I--;else{r=z+I-3,n=ee(z-1-S,x-3),I-=x-1,x-=2;do{++z>r||(p=(p<<g^255&u[z+2])&b,s=65535&d[p],h[z&l]=d[p],d[p]=z)}while(0!=--x);if(C=0,v=2,z++,n&&(se(!1),0===t.ft))return 0}}return 0!==C&&(n=ee(0,255&u[z-1]),C=0),se(4==e),0===t.ft?4==e?2:0:4==e?3:1})(s)}if(2!=B&&3!=B||(r=666),0==B||2==B)return 0===t.ft&&(c=-1),0;if(1==B){if(1==s)X(2,3),Y(256,Ae.Me),$(),9>1+j+10-O&&(X(2,3),Y(256,Ae.Me),$()),j=7;else if(re(0,0,!1),3==s)for(i=0;y>i;i++)d[i]=0;if(t.Ge(),0===t.ft)return c=-1,0}}return 4!=s?0:1}}function Ne(){const e=this;e.lt=0,e.ut=0,e.Je=0,e.$e=0,e.ft=0,e.et=0}function Pe(e){const t=new Ne,i=(o=e&&e.chunkSize?e.chunkSize:65536)+5*(n.floor(o/16383)+1);var o;const c=new s(i);let f=e?e.level:-1;void 0===f&&(f=-1),t.Xe(f),t.ot=c,this.append=(e,n)=>{let o,f,a=0,l=0,u=0;const w=[];if(e.length){t.lt=0,t.ct=e,t.Je=e.length;do{if(t.ut=0,t.ft=i,o=t.st(0),0!=o)throw new r("deflating: "+t.Ye);t.ut&&(t.ut==i?w.push(new s(c)):w.push(c.slice(0,t.ut))),u+=t.ut,n&&t.lt>0&&t.lt!=a&&(n(t.lt),a=t.lt)}while(t.Je>0||0===t.ft);return w.length>1?(f=new s(u),w.forEach((e=>{f.set(e,l),l+=e.length}))):f=w[0]||new s,f}},this.flush=()=>{let e,n,o=0,f=0;const a=[];do{if(t.ut=0,t.ft=i,e=t.st(4),1!=e&&0!=e)throw new r("deflating: "+t.Ye);i-t.ft>0&&a.push(c.slice(0,t.ut)),f+=t.ut}while(t.Je>0||0===t.ft);return t.nt(),n=new s(f),a.forEach((e=>{n.set(e,o),o+=e.length})),n}}Ne.prototype={Xe(e,t){const n=this;return n.Ze=new Ke,t||(t=15),n.Ze.Xe(n,e,t)},st(e){const t=this;return t.Ze?t.Ze.st(t,e):-2},nt(){const e=this;if(!e.Ze)return-2;const t=e.Ze.nt();return e.Ze=null,t},rt(e,t){const n=this;return n.Ze?n.Ze.rt(n,e,t):-2},it(e,t){const n=this;return n.Ze?n.Ze.it(n,e,t):-2},Qe(e,t,n){const r=this;let s=r.Je;return s>n&&(s=n),0===s?0:(r.Je-=s,e.set(r.ct.subarray(r.lt,r.lt+s),t),r.lt+=s,r.$e+=s,s)},Ge(){const e=this;let t=e.Ze.pending;t>e.ft&&(t=e.ft),0!==t&&(e.ot.set(e.Ze.Fe.subarray(e.Ze.tt,e.Ze.tt+t),e.ut),e.ut+=t,e.Ze.tt+=t,e.et+=t,e.ft-=t,e.Ze.pending-=t,0===e.Ze.pending&&(e.Ze.tt=0))}};const Ue=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],Te=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],We=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],He=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],Le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],je=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],Fe=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];function Oe(){let e,t,n,r,s,i;function o(e,t,o,c,f,a,l,u,w,h,d){let p,y,m,b,g,k,v,S,C,z,_,I,x,A,D;z=0,g=o;do{n[e[t+z]]++,z++,g--}while(0!==g);if(n[0]==o)return l[0]=-1,u[0]=0,0;for(S=u[0],k=1;15>=k&&0===n[k];k++);for(v=k,k>S&&(S=k),g=15;0!==g&&0===n[g];g--);for(m=g,S>g&&(S=g),u[0]=S,A=1<<k;g>k;k++,A<<=1)if(0>(A-=n[k]))return-3;if(0>(A-=n[g]))return-3;for(n[g]+=A,i[1]=k=0,z=1,x=2;0!=--g;)i[x]=k+=n[z],x++,z++;g=0,z=0;do{0!==(k=e[t+z])&&(d[i[k]++]=g),z++}while(++g<o);for(o=i[m],i[0]=g=0,z=0,b=-1,I=-S,s[0]=0,_=0,D=0;m>=v;v++)for(p=n[v];0!=p--;){for(;v>I+S;){if(b++,I+=S,D=m-I,D=D>S?S:D,(y=1<<(k=v-I))>p+1&&(y-=p+1,x=v,D>k))for(;++k<D&&(y<<=1)>n[++x];)y-=n[x];if(D=1<<k,h[0]+D>1440)return-3;s[b]=_=h[0],h[0]+=D,0!==b?(i[b]=g,r[0]=k,r[1]=S,k=g>>>I-S,r[2]=_-s[b-1]-k,w.set(r,3*(s[b-1]+k))):l[0]=_}for(r[1]=v-I,o>z?d[z]<c?(r[0]=256>d[z]?0:96,r[2]=d[z++]):(r[0]=a[d[z]-c]+16+64,r[2]=f[d[z++]-c]):r[0]=192,y=1<<v-I,k=g>>>I;D>k;k+=y)w.set(r,3*(_+k));for(k=1<<v-1;0!=(g&k);k>>>=1)g^=k;for(g^=k,C=(1<<I)-1;(g&C)!=i[b];)b--,I-=S,C=(1<<I)-1}return 0!==A&&1!=m?-5:0}function f(o){let f;for(e||(e=[],t=[],n=new c(16),r=[],s=new c(15),i=new c(16)),t.length<o&&(t=[]),f=0;o>f;f++)t[f]=0;for(f=0;16>f;f++)n[f]=0;for(f=0;3>f;f++)r[f]=0;s.set(n.subarray(0,15),0),i.set(n.subarray(0,16),0)}this.wt=(n,r,s,i,c)=>{let a;return f(19),e[0]=0,a=o(n,0,19,19,null,null,s,r,i,e,t),-3==a?c.Ye="oversubscribed dynamic bit lengths tree":-5!=a&&0!==r[0]||(c.Ye="incomplete dynamic bit lengths tree",a=-3),a},this.ht=(n,r,s,i,c,a,l,u,w)=>{let h;return f(288),e[0]=0,h=o(s,0,n,257,He,Le,a,i,u,e,t),0!=h||0===i[0]?(-3==h?w.Ye="oversubscribed literal/length tree":-4!=h&&(w.Ye="incomplete literal/length tree",h=-3),h):(f(288),h=o(s,n,r,0,je,Fe,l,c,u,e,t),0!=h||0===c[0]&&n>257?(-3==h?w.Ye="oversubscribed distance tree":-5==h?(w.Ye="incomplete distance tree",h=-3):-4!=h&&(w.Ye="empty distance tree with lengths",h=-3),h):0)}}function qe(){const e=this;let t,n,r,s,i=0,o=0,c=0,f=0,a=0,l=0,u=0,w=0,h=0,d=0;function p(e,t,n,r,s,i,o,c){let f,a,l,u,w,h,d,p,y,m,b,g,k,v,S,C;d=c.lt,p=c.Je,w=o.dt,h=o.yt,y=o.write,m=y<o.read?o.read-y-1:o.end-y,b=Ue[e],g=Ue[t];do{for(;20>h;)p--,w|=(255&c.bt(d++))<<h,h+=8;if(f=w&b,a=n,l=r,C=3*(l+f),0!==(u=a[C]))for(;;){if(w>>=a[C+1],h-=a[C+1],0!=(16&u)){for(u&=15,k=a[C+2]+(w&Ue[u]),w>>=u,h-=u;15>h;)p--,w|=(255&c.bt(d++))<<h,h+=8;for(f=w&g,a=s,l=i,C=3*(l+f),u=a[C];;){if(w>>=a[C+1],h-=a[C+1],0!=(16&u)){for(u&=15;u>h;)p--,w|=(255&c.bt(d++))<<h,h+=8;if(v=a[C+2]+(w&Ue[u]),w>>=u,h-=u,m-=k,v>y){S=y-v;do{S+=o.end}while(0>S);if(u=o.end-S,k>u){if(k-=u,y-S>0&&u>y-S)do{o.gt[y++]=o.gt[S++]}while(0!=--u);else o.gt.set(o.gt.subarray(S,S+u),y),y+=u,S+=u,u=0;S=0}}else S=y-v,y-S>0&&2>y-S?(o.gt[y++]=o.gt[S++],o.gt[y++]=o.gt[S++],k-=2):(o.gt.set(o.gt.subarray(S,S+2),y),y+=2,S+=2,k-=2);if(y-S>0&&k>y-S)do{o.gt[y++]=o.gt[S++]}while(0!=--k);else o.gt.set(o.gt.subarray(S,S+k),y),y+=k,S+=k,k=0;break}if(0!=(64&u))return c.Ye="invalid distance code",k=c.Je-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.dt=w,o.yt=h,c.Je=p,c.$e+=d-c.lt,c.lt=d,o.write=y,-3;f+=a[C+2],f+=w&Ue[u],C=3*(l+f),u=a[C]}break}if(0!=(64&u))return 0!=(32&u)?(k=c.Je-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.dt=w,o.yt=h,c.Je=p,c.$e+=d-c.lt,c.lt=d,o.write=y,1):(c.Ye="invalid literal/length code",k=c.Je-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.dt=w,o.yt=h,c.Je=p,c.$e+=d-c.lt,c.lt=d,o.write=y,-3);if(f+=a[C+2],f+=w&Ue[u],C=3*(l+f),0===(u=a[C])){w>>=a[C+1],h-=a[C+1],o.gt[y++]=a[C+2],m--;break}}else w>>=a[C+1],h-=a[C+1],o.gt[y++]=a[C+2],m--}while(m>=258&&p>=10);return k=c.Je-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.dt=w,o.yt=h,c.Je=p,c.$e+=d-c.lt,c.lt=d,o.write=y,0}e.init=(e,i,o,c,f,a)=>{t=0,u=e,w=i,r=o,h=c,s=f,d=a,n=null},e.kt=(e,y,m)=>{let b,g,k,v,S,C,z,_=0,I=0,x=0;for(x=y.lt,v=y.Je,_=e.dt,I=e.yt,S=e.write,C=S<e.read?e.read-S-1:e.end-S;;)switch(t){case 0:if(C>=258&&v>=10&&(e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,m=p(u,w,r,h,s,d,e,y),x=y.lt,v=y.Je,_=e.dt,I=e.yt,S=e.write,C=S<e.read?e.read-S-1:e.end-S,0!=m)){t=1==m?7:9;break}c=u,n=r,o=h,t=1;case 1:for(b=c;b>I;){if(0===v)return e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);m=0,v--,_|=(255&y.bt(x++))<<I,I+=8}if(g=3*(o+(_&Ue[b])),_>>>=n[g+1],I-=n[g+1],k=n[g],0===k){f=n[g+2],t=6;break}if(0!=(16&k)){a=15&k,i=n[g+2],t=2;break}if(0==(64&k)){c=k,o=g/3+n[g+2];break}if(0!=(32&k)){t=7;break}return t=9,y.Ye="invalid literal/length code",m=-3,e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);case 2:for(b=a;b>I;){if(0===v)return e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);m=0,v--,_|=(255&y.bt(x++))<<I,I+=8}i+=_&Ue[b],_>>=b,I-=b,c=w,n=s,o=d,t=3;case 3:for(b=c;b>I;){if(0===v)return e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);m=0,v--,_|=(255&y.bt(x++))<<I,I+=8}if(g=3*(o+(_&Ue[b])),_>>=n[g+1],I-=n[g+1],k=n[g],0!=(16&k)){a=15&k,l=n[g+2],t=4;break}if(0==(64&k)){c=k,o=g/3+n[g+2];break}return t=9,y.Ye="invalid distance code",m=-3,e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);case 4:for(b=a;b>I;){if(0===v)return e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);m=0,v--,_|=(255&y.bt(x++))<<I,I+=8}l+=_&Ue[b],_>>=b,I-=b,t=5;case 5:for(z=S-l;0>z;)z+=e.end;for(;0!==i;){if(0===C&&(S==e.end&&0!==e.read&&(S=0,C=S<e.read?e.read-S-1:e.end-S),0===C&&(e.write=S,m=e.vt(y,m),S=e.write,C=S<e.read?e.read-S-1:e.end-S,S==e.end&&0!==e.read&&(S=0,C=S<e.read?e.read-S-1:e.end-S),0===C)))return e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);e.gt[S++]=e.gt[z++],C--,z==e.end&&(z=0),i--}t=0;break;case 6:if(0===C&&(S==e.end&&0!==e.read&&(S=0,C=S<e.read?e.read-S-1:e.end-S),0===C&&(e.write=S,m=e.vt(y,m),S=e.write,C=S<e.read?e.read-S-1:e.end-S,S==e.end&&0!==e.read&&(S=0,C=S<e.read?e.read-S-1:e.end-S),0===C)))return e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);m=0,e.gt[S++]=f,C--,t=0;break;case 7:if(I>7&&(I-=8,v++,x--),e.write=S,m=e.vt(y,m),S=e.write,C=S<e.read?e.read-S-1:e.end-S,e.read!=e.write)return e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);t=8;case 8:return m=1,e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);case 9:return m=-3,e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m);default:return m=-2,e.dt=_,e.yt=I,y.Je=v,y.$e+=x-y.lt,y.lt=x,e.write=S,e.vt(y,m)}},e.St=()=>{}}Oe.Ct=(e,t,n,r)=>(e[0]=9,t[0]=5,n[0]=Te,r[0]=We,0);const Ge=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];function Je(e,t){const n=this;let r,i=0,o=0,f=0,a=0;const l=[0],u=[0],w=new qe;let h=0,d=new c(4320);const p=new Oe;n.yt=0,n.dt=0,n.gt=new s(t),n.end=t,n.read=0,n.write=0,n.reset=(e,t)=>{t&&(t[0]=0),6==i&&w.St(e),i=0,n.yt=0,n.dt=0,n.read=n.write=0},n.reset(e,null),n.vt=(e,t)=>{let r,s,i;return s=e.ut,i=n.read,r=(i>n.write?n.end:n.write)-i,r>e.ft&&(r=e.ft),0!==r&&-5==t&&(t=0),e.ft-=r,e.et+=r,e.ot.set(n.gt.subarray(i,i+r),s),s+=r,i+=r,i==n.end&&(i=0,n.write==n.end&&(n.write=0),r=n.write-i,r>e.ft&&(r=e.ft),0!==r&&-5==t&&(t=0),e.ft-=r,e.et+=r,e.ot.set(n.gt.subarray(i,i+r),s),s+=r,i+=r),e.ut=s,n.read=i,t},n.kt=(e,t)=>{let s,c,y,m,b,g,k,v;for(m=e.lt,b=e.Je,c=n.dt,y=n.yt,g=n.write,k=g<n.read?n.read-g-1:n.end-g;;){let S,C,z,_,I,x,A,D;switch(i){case 0:for(;3>y;){if(0===b)return n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);t=0,b--,c|=(255&e.bt(m++))<<y,y+=8}switch(s=7&c,h=1&s,s>>>1){case 0:c>>>=3,y-=3,s=7&y,c>>>=s,y-=s,i=1;break;case 1:S=[],C=[],z=[[]],_=[[]],Oe.Ct(S,C,z,_),w.init(S[0],C[0],z[0],0,_[0],0),c>>>=3,y-=3,i=6;break;case 2:c>>>=3,y-=3,i=3;break;case 3:return c>>>=3,y-=3,i=9,e.Ye="invalid block type",t=-3,n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t)}break;case 1:for(;32>y;){if(0===b)return n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);t=0,b--,c|=(255&e.bt(m++))<<y,y+=8}if((~c>>>16&65535)!=(65535&c))return i=9,e.Ye="invalid stored block lengths",t=-3,n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);o=65535&c,c=y=0,i=0!==o?2:0!==h?7:0;break;case 2:if(0===b)return n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);if(0===k&&(g==n.end&&0!==n.read&&(g=0,k=g<n.read?n.read-g-1:n.end-g),0===k&&(n.write=g,t=n.vt(e,t),g=n.write,k=g<n.read?n.read-g-1:n.end-g,g==n.end&&0!==n.read&&(g=0,k=g<n.read?n.read-g-1:n.end-g),0===k)))return n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);if(t=0,s=o,s>b&&(s=b),s>k&&(s=k),n.gt.set(e.Qe(m,s),g),m+=s,b-=s,g+=s,k-=s,0!=(o-=s))break;i=0!==h?7:0;break;case 3:for(;14>y;){if(0===b)return n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);t=0,b--,c|=(255&e.bt(m++))<<y,y+=8}if(f=s=16383&c,(31&s)>29||(s>>5&31)>29)return i=9,e.Ye="too many length or distance symbols",t=-3,n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);if(s=258+(31&s)+(s>>5&31),!r||r.length<s)r=[];else for(v=0;s>v;v++)r[v]=0;c>>>=14,y-=14,a=0,i=4;case 4:for(;4+(f>>>10)>a;){for(;3>y;){if(0===b)return n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);t=0,b--,c|=(255&e.bt(m++))<<y,y+=8}r[Ge[a++]]=7&c,c>>>=3,y-=3}for(;19>a;)r[Ge[a++]]=0;if(l[0]=7,s=p.wt(r,l,u,d,e),0!=s)return-3==(t=s)&&(r=null,i=9),n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);a=0,i=5;case 5:for(;s=f,258+(31&s)+(s>>5&31)>a;){let o,w;for(s=l[0];s>y;){if(0===b)return n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);t=0,b--,c|=(255&e.bt(m++))<<y,y+=8}if(s=d[3*(u[0]+(c&Ue[s]))+1],w=d[3*(u[0]+(c&Ue[s]))+2],16>w)c>>>=s,y-=s,r[a++]=w;else{for(v=18==w?7:w-14,o=18==w?11:3;s+v>y;){if(0===b)return n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);t=0,b--,c|=(255&e.bt(m++))<<y,y+=8}if(c>>>=s,y-=s,o+=c&Ue[v],c>>>=v,y-=v,v=a,s=f,v+o>258+(31&s)+(s>>5&31)||16==w&&1>v)return r=null,i=9,e.Ye="invalid bit length repeat",t=-3,n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);w=16==w?r[v-1]:0;do{r[v++]=w}while(0!=--o);a=v}}if(u[0]=-1,I=[],x=[],A=[],D=[],I[0]=9,x[0]=6,s=f,s=p.ht(257+(31&s),1+(s>>5&31),r,I,x,A,D,d,e),0!=s)return-3==s&&(r=null,i=9),t=s,n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);w.init(I[0],x[0],d,A[0],d,D[0]),i=6;case 6:if(n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,1!=(t=w.kt(n,e,t)))return n.vt(e,t);if(t=0,w.St(e),m=e.lt,b=e.Je,c=n.dt,y=n.yt,g=n.write,k=g<n.read?n.read-g-1:n.end-g,0===h){i=0;break}i=7;case 7:if(n.write=g,t=n.vt(e,t),g=n.write,k=g<n.read?n.read-g-1:n.end-g,n.read!=n.write)return n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);i=8;case 8:return t=1,n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);case 9:return t=-3,n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t);default:return t=-2,n.dt=c,n.yt=y,e.Je=b,e.$e+=m-e.lt,e.lt=m,n.write=g,n.vt(e,t)}}},n.St=e=>{n.reset(e,null),n.gt=null,d=null},n.zt=(e,t,r)=>{n.gt.set(e.subarray(t,t+r),0),n.read=n.write=r},n._t=()=>1==i?1:0}const Qe=[0,0,255,255];function Xe(){const e=this;function t(e){return e&&e.It?(e.$e=e.et=0,e.Ye=null,e.It.mode=7,e.It.xt.reset(e,null),0):-2}e.mode=0,e.method=0,e.At=[0],e.Dt=0,e.marker=0,e.Vt=0,e.Rt=t=>(e.xt&&e.xt.St(t),e.xt=null,0),e.Bt=(n,r)=>(n.Ye=null,e.xt=null,8>r||r>15?(e.Rt(n),-2):(e.Vt=r,n.It.xt=new Je(n,1<<r),t(n),0)),e.Et=(e,t)=>{let n,r;if(!e||!e.It||!e.ct)return-2;const s=e.It;for(t=4==t?-5:0,n=-5;;)switch(s.mode){case 0:if(0===e.Je)return n;if(n=t,e.Je--,e.$e++,8!=(15&(s.method=e.bt(e.lt++)))){s.mode=13,e.Ye="unknown compression method",s.marker=5;break}if(8+(s.method>>4)>s.Vt){s.mode=13,e.Ye="invalid win size",s.marker=5;break}s.mode=1;case 1:if(0===e.Je)return n;if(n=t,e.Je--,e.$e++,r=255&e.bt(e.lt++),((s.method<<8)+r)%31!=0){s.mode=13,e.Ye="incorrect header check",s.marker=5;break}if(0==(32&r)){s.mode=7;break}s.mode=2;case 2:if(0===e.Je)return n;n=t,e.Je--,e.$e++,s.Dt=(255&e.bt(e.lt++))<<24&4278190080,s.mode=3;case 3:if(0===e.Je)return n;n=t,e.Je--,e.$e++,s.Dt+=(255&e.bt(e.lt++))<<16&16711680,s.mode=4;case 4:if(0===e.Je)return n;n=t,e.Je--,e.$e++,s.Dt+=(255&e.bt(e.lt++))<<8&65280,s.mode=5;case 5:return 0===e.Je?n:(n=t,e.Je--,e.$e++,s.Dt+=255&e.bt(e.lt++),s.mode=6,2);case 6:return s.mode=13,e.Ye="need dictionary",s.marker=0,-2;case 7:if(n=s.xt.kt(e,n),-3==n){s.mode=13,s.marker=0;break}if(0==n&&(n=t),1!=n)return n;n=t,s.xt.reset(e,s.At),s.mode=12;case 12:return e.Je=0,1;case 13:return-3;default:return-2}},e.Mt=(e,t,n)=>{let r=0,s=n;if(!e||!e.It||6!=e.It.mode)return-2;const i=e.It;return s<1<<i.Vt||(s=(1<<i.Vt)-1,r=n-s),i.xt.zt(t,r,s),i.mode=7,0},e.Kt=e=>{let n,r,s,i,o;if(!e||!e.It)return-2;const c=e.It;if(13!=c.mode&&(c.mode=13,c.marker=0),0===(n=e.Je))return-5;for(r=e.lt,s=c.marker;0!==n&&4>s;)e.bt(r)==Qe[s]?s++:s=0!==e.bt(r)?0:4-s,r++,n--;return e.$e+=r-e.lt,e.lt=r,e.Je=n,c.marker=s,4!=s?-3:(i=e.$e,o=e.et,t(e),e.$e=i,e.et=o,c.mode=7,0)},e.Nt=e=>e&&e.It&&e.It.xt?e.It.xt._t():-2}function Ye(){}function Ze(e){const t=new Ye,i=e&&e.chunkSize?n.floor(2*e.chunkSize):131072,o=new s(i);let c=!1;t.Bt(),t.ot=o,this.append=(e,n)=>{const f=[];let a,l,u=0,w=0,h=0;if(0!==e.length){t.lt=0,t.ct=e,t.Je=e.length;do{if(t.ut=0,t.ft=i,0!==t.Je||c||(t.lt=0,c=!0),a=t.Et(0),c&&-5===a){if(0!==t.Je)throw new r("inflating: bad input")}else if(0!==a&&1!==a)throw new r("inflating: "+t.Ye);if((c||1===a)&&t.Je===e.length)throw new r("inflating: bad input");t.ut&&(t.ut===i?f.push(new s(o)):f.push(o.slice(0,t.ut))),h+=t.ut,n&&t.lt>0&&t.lt!=u&&(n(t.lt),u=t.lt)}while(t.Je>0||0===t.ft);return f.length>1?(l=new s(h),f.forEach((e=>{l.set(e,w),w+=e.length}))):l=f[0]||new s,l}},this.flush=()=>{t.Rt()}}Ye.prototype={Bt(e){const t=this;return t.It=new Xe,e||(e=15),t.It.Bt(t,e)},Et(e){const t=this;return t.It?t.It.Et(t,e):-2},Rt(){const e=this;if(!e.It)return-2;const t=e.It.Rt(e);return e.It=null,t},Kt(){const e=this;return e.It?e.It.Kt(e):-2},Mt(e,t){const n=this;return n.It?n.It.Mt(n,e,t):-2},bt(e){return this.ct[e]},Qe(e,t){return this.ct.subarray(e,e+t)}},self.initCodec=()=>{self.Deflate=Pe,self.Inflate=Ze};\n'],{type:"text/javascript"}));e({workerScripts:{inflate:[t],deflate:[t]}});}

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

	function getMimeType() {
		return "application/octet-stream";
	}

	function initShimAsyncCodec(library, options = {}, registerDataHandler) {
		return {
			Deflate: createCodecClass(library.Deflate, options.deflate, registerDataHandler),
			Inflate: createCodecClass(library.Inflate, options.inflate, registerDataHandler)
		};
	}

	function createCodecClass(constructor, constructorOptions, registerDataHandler) {
		return class {

			constructor(options) {
				const codecAdapter = this;
				const onData = data => {
					if (codecAdapter.pendingData) {
						const { pendingData } = codecAdapter;
						codecAdapter.pendingData = new Uint8Array(pendingData.length + data.length);
						pendingData.set(pendingData, 0);
						pendingData.set(data, pendingData.length);
					} else {
						codecAdapter.pendingData = new Uint8Array(data);
					}
				};
				if (Object.hasOwn(options, "level") && options.level === undefined) {
					delete options.level;
				}
				codecAdapter.codec = new constructor(Object.assign({}, constructorOptions, options));
				registerDataHandler(codecAdapter.codec, onData);
			}
			append(data) {
				this.codec.push(data);
				return getResponse(this);
			}
			flush() {
				this.codec.push(new Uint8Array(), true);
				return getResponse(this);
			}
		};

		function getResponse(codec) {
			if (codec.pendingData) {
				const output = codec.pendingData;
				codec.pendingData = null;
				return output;
			} else {
				return new Uint8Array();
			}
		}
	}

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

	let workersSupported;
	let classicWorkersSupported = true;
	let transferStreamsSupported = true;

	class CodecWorker {

		constructor(workerData, stream, workerOptions, onTaskFinished) {
			const { readable, writable } = stream;
			const { options, config, streamOptions, useWebWorkers, transferStreams, scripts } = workerOptions;
			Object.assign(workerData, {
				busy: true,
				readable,
				writable,
				options: Object.assign({}, options),
				scripts,
				transferStreams,
				terminate() {
					if (workerData.worker && !workerData.busy) {
						workerData.worker.terminate();
						workerData.interface = null;
					}
				},
				onTaskFinished() {
					workerData.busy = false;
					onTaskFinished(workerData);
				}
			});
			const { signal, onstart, onprogress, size, onend } = streamOptions;
			let chunkOffset = 0;
			const transformer = {};
			if (onstart) {
				transformer.start = () => callHandler(onstart, size);
			}
			transformer.transform = async (chunk, controller) => {
				chunkOffset += chunk.length;
				if (onprogress) {
					await callHandler(onprogress, chunkOffset, size);
				}
				controller.enqueue(chunk);
			};
			transformer.flush = () => {
				readable.size = chunkOffset;
				if (onend) {
					callHandler(onend, chunkOffset);
				}
			};
			workerData.readable = readable.pipeThrough(new TransformStream(transformer, { highWaterMark: 1, size: () => config.chunkSize }), { signal });
			if (workersSupported === UNDEFINED_VALUE) {
				workersSupported = typeof Worker != UNDEFINED_TYPE;
			}
			return useWebWorkers && workersSupported ? createWebWorkerInterface(workerData, config) : createWorkerInterface(workerData, config);
		}
	}

	async function callHandler(handler, ...parameters) {
		try {
			await handler(...parameters);
		} catch (_error) {
			// ignored
		}
	}

	function createWorkerInterface(workerData, config) {
		const interfaceCodec = new Codec(workerData.readable, workerData.writable, workerData.options, config);
		const { onTaskFinished } = workerData;
		const codec = {
			async run() {
				try {
					return await interfaceCodec.run();
				} finally {
					onTaskFinished();
				}
			}
		};
		return codec;
	}

	function createWebWorkerInterface(workerData, { baseURL, chunkSize }) {
		const workerOptions = { type: "module" };
		Object.assign(workerData, {
			streams: {},
			result: new Promise((resolve, reject) => {
				workerData.resolveResult = resolve;
				workerData.rejectResult = reject;
			})
		});
		if (!workerData.interface) {
			if (!classicWorkersSupported) {
				workerData.worker = getWorker(workerOptions);
			} else {
				try {
					workerData.worker = getWorker({});
				} catch (_error) {
					classicWorkersSupported = false;
					workerData.worker = getWorker(workerOptions);
				}
			}
			workerData.worker.addEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
			workerData.interface = {
				async run() {
					const { readable, options } = workerData;
					const writer = workerData.writable.getWriter();
					let resolveStreamClosed, streamClosed;
					streamClosed = new Promise(resolve => resolveStreamClosed = resolve);
					const writable = new WritableStream({
						async write(chunk) {
							await writer.ready;
							await writer.write(chunk);
						},
						async close() {
							writer.releaseLock();
							resolveStreamClosed();
						},
						abort(reason) {
							writer.abort(reason);
						}
					});
					const scripts = workerData.scripts.slice(1);
					const message = { type: MESSAGE_START, scripts, options, config: { chunkSize } };
					if (workerData.transferStreams && transferStreamsSupported) {
						const streamsTransferred = sendMessage({ ...message, readable, writable });
						if (!streamsTransferred) {
							transferStreamsSupported = false;
							initStreams(readable, writable);
						}
					} else {
						sendMessage(message);
						initStreams(readable, writable);
					}
					const result = await workerData.result;
					try {
						await writable.close();
					} catch (_error) {
						// ignored
					}
					await streamClosed;
					return result;
				}
			};
		}
		return workerData.interface;

		function initStreams(readable, writable) {
			Object.assign(workerData.streams, {
				reader: readable.getReader(),
				writer: writable.getWriter()
			});
		}

		function getWorker(options) {
			let url, scriptUrl;
			url = workerData.scripts[0];
			if (typeof url == "function") {
				url = url();
			}
			try {
				scriptUrl = new URL(url, baseURL);
			} catch (_error) {
				scriptUrl = url;
			}
			return new Worker(scriptUrl, options);
		}

		function sendMessage(message) {
			const { worker, writer, onTaskFinished } = workerData;
			try {
				let { data, readable, writable } = message;
				const transferrables = [];
				if (data) {
					const { buffer, length } = data;
					if (length != buffer.byteLength) {
						data = new Uint8Array(data);
					}
					message.data = data.buffer;
					transferrables.push(message.data);
				}
				if (readable) {
					transferrables.push(readable);
				}
				if (writable) {
					transferrables.push(writable);
				}
				if (transferrables.length) {
					try {
						worker.postMessage(message, transferrables);
						return true;
					} catch (error) {
						message.readable = message.writable = null;
						worker.postMessage(message);
					}
				} else {
					worker.postMessage(message);
				}
			} catch (error) {
				if (writer) {
					writer.releaseLock();
				}
				onTaskFinished();
				throw error;
			}
		}

		async function onMessage(event) {
			const message = event.data;
			const { resolveResult, rejectResult, onTaskFinished } = workerData;
			const { reader, writer } = workerData.streams;
			const { type, data, messageId, result } = message;
			const reponseError = message.error;
			try {
				if (reponseError) {
					const { message, stack, code, name } = reponseError;
					const error = new Error(message);
					Object.assign(error, { stack, code, name });
					close(error);
				} else {
					if (type == MESSAGE_PULL) {
						const { value, done } = await reader.read();
						sendMessage({ type: MESSAGE_DATA, data: value, done, messageId });
					}
					if (type == MESSAGE_DATA) {
						await writer.ready;
						await writer.write(new Uint8Array(data));
						sendMessage({ type: MESSAGE_ACK_DATA, messageId });
					}
					if (type == MESSAGE_CLOSE) {
						close(null, result);
					}
				}
			} catch (error) {
				close(error);
			}

			function close(error, result) {
				if (error) {
					rejectResult(error);
				} else {
					resolveResult(result);
				}
				if (writer) {
					writer.releaseLock();
				}
				onTaskFinished();
			}
		}
	}

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

	let pool = [];
	const pendingRequests = [];

	let indexWorker = 0;

	async function runWorker(stream, workerOptions) {
		const { options, config } = workerOptions;
		const { transferStreams, useWebWorkers, useCompressionStream, codecType, compressed, signed, encrypted } = options;
		const { workerScripts } = config;
		workerOptions.transferStreams = transferStreams || transferStreams === UNDEFINED_VALUE;
		const streamCopy = !compressed && !signed && !encrypted && !workerOptions.transferStreams;
		workerOptions.useWebWorkers = !streamCopy && (useWebWorkers || (useWebWorkers === UNDEFINED_VALUE && config.useWebWorkers));
		workerOptions.scripts = workerOptions.useWebWorkers && workerScripts ? workerScripts[codecType] : [];
		options.useCompressionStream = useCompressionStream || (useCompressionStream === UNDEFINED_VALUE && config.useCompressionStream);
		let worker;
		if (pool.length < config.maxWorkers) {
			const workerData = { indexWorker };
			indexWorker++;
			pool.push(workerData);
			worker = new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
		} else {
			const workerData = pool.find(workerData => !workerData.busy);
			if (workerData) {
				clearTerminateTimeout(workerData);
				worker = new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
			} else {
				worker = await new Promise(resolve => pendingRequests.push({ resolve, stream, workerOptions }));
			}
		}
		return worker.run();

		function onTaskFinished(workerData) {
			if (pendingRequests.length) {
				const [{ resolve, stream, workerOptions }] = pendingRequests.splice(0, 1);
				resolve(new CodecWorker(workerData, stream, workerOptions, onTaskFinished));
			} else if (workerData.worker) {
				const { terminateWorkerTimeout } = config;
				clearTerminateTimeout(workerData);
				if (Number.isFinite(terminateWorkerTimeout) && terminateWorkerTimeout >= 0) {
					workerData.terminateTimeout = setTimeout(() => {
						pool = pool.filter(data => data != workerData);
						workerData.terminate();
					}, terminateWorkerTimeout);
				}
			} else {
				pool = pool.filter(data => data != workerData);
			}
		}
	}

	function clearTerminateTimeout(workerData) {
		const { terminateTimeout } = workerData;
		if (terminateTimeout) {
			clearTimeout(terminateTimeout);
			workerData.terminateTimeout = null;
		}
	}

	function terminateWorkers() {
		pool.forEach(workerData => {
			clearTerminateTimeout(workerData);
			workerData.terminate();
		});
	}

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

	/* global Blob, atob, btoa, XMLHttpRequest, URL, fetch, ReadableStream, WritableStream, FileReader, TransformStream, Response */

	const ERR_HTTP_STATUS = "HTTP error ";
	const ERR_HTTP_RANGE = "HTTP Range not supported";

	const CONTENT_TYPE_TEXT_PLAIN = "text/plain";
	const HTTP_HEADER_CONTENT_LENGTH = "Content-Length";
	const HTTP_HEADER_CONTENT_RANGE = "Content-Range";
	const HTTP_HEADER_ACCEPT_RANGES = "Accept-Ranges";
	const HTTP_HEADER_RANGE = "Range";
	const HTTP_HEADER_CONTENT_TYPE = "Content-Type";
	const HTTP_METHOD_HEAD = "HEAD";
	const HTTP_METHOD_GET = "GET";
	const HTTP_RANGE_UNIT = "bytes";
	const DEFAULT_CHUNK_SIZE = 64 * 1024;

	const PROPERTY_NAME_WRITABLE = "writable";

	class Stream {

		constructor() {
			this.size = 0;
		}

		init() {
			this.initialized = true;
		}
	}

	class Reader extends Stream {

		get readable() {
			const reader = this;
			const { chunkSize = DEFAULT_CHUNK_SIZE } = reader;
			const readable = new ReadableStream({
				start() {
					this.chunkOffset = 0;
				},
				async pull(controller) {
					const { offset = 0, size, diskNumberStart } = readable;
					const { chunkOffset } = this;
					controller.enqueue(await readUint8Array(reader, offset + chunkOffset, Math.min(chunkSize, size - chunkOffset), diskNumberStart));
					if (chunkOffset + chunkSize > size) {
						controller.close();
					} else {
						this.chunkOffset += chunkSize;
					}
				}
			});
			return readable;
		}
	}

	class Writer extends Stream {

		constructor() {
			super();
			const writer = this;
			const writable = new WritableStream({
				write(chunk) {
					return writer.writeUint8Array(chunk);
				}
			});
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
				get() {
					return writable;
				}
			});
		}

		writeUint8Array() {
			// abstract
		}
	}

	class Data64URIReader extends Reader {

		constructor(dataURI) {
			super();
			let dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=") {
				dataEnd--;
			}
			const dataStart = dataURI.indexOf(",") + 1;
			Object.assign(this, {
				dataURI,
				dataStart,
				size: Math.floor((dataEnd - dataStart) * 0.75)
			});
		}

		readUint8Array(offset, length) {
			const {
				dataStart,
				dataURI
			} = this;
			const dataArray = new Uint8Array(length);
			const start = Math.floor(offset / 3) * 4;
			const bytes = atob(dataURI.substring(start + dataStart, Math.ceil((offset + length) / 3) * 4 + dataStart));
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
			Object.assign(this, {
				data: "data:" + (contentType || "") + ";base64,",
				pending: []
			});
		}

		writeUint8Array(array) {
			const writer = this;
			let indexArray = 0;
			let dataString = writer.pending;
			const delta = writer.pending.length;
			writer.pending = "";
			for (indexArray = 0; indexArray < (Math.floor((delta + array.length) / 3) * 3) - delta; indexArray++) {
				dataString += String.fromCharCode(array[indexArray]);
			}
			for (; indexArray < array.length; indexArray++) {
				writer.pending += String.fromCharCode(array[indexArray]);
			}
			if (dataString.length > 2) {
				writer.data += btoa(dataString);
			} else {
				writer.pending = dataString;
			}
		}

		getData() {
			return this.data + btoa(this.pending);
		}
	}

	class BlobReader extends Reader {

		constructor(blob) {
			super();
			Object.assign(this, {
				blob,
				size: blob.size
			});
		}

		async readUint8Array(offset, length) {
			const reader = this;
			return new Uint8Array(await reader.blob.slice(offset, offset + length).arrayBuffer());
		}
	}

	class BlobWriter extends Stream {

		constructor(contentType) {
			super();
			const writer = this;
			const transformStream = new TransformStream();
			const headers = [];
			if (contentType) {
				headers.push([HTTP_HEADER_CONTENT_TYPE, contentType]);
			}
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
				get() {
					return transformStream.writable;
				}
			});
			writer.blob = new Response(transformStream.readable, { headers }).blob();
		}

		getData() {
			return this.blob;
		}
	}

	class TextReader extends BlobReader {

		constructor(text) {
			super(new Blob([text], { type: CONTENT_TYPE_TEXT_PLAIN }));
		}
	}

	class TextWriter extends BlobWriter {

		constructor(encoding) {
			super(encoding);
			Object.assign(this, {
				encoding,
				utf8: !encoding || encoding.toLowerCase() == "utf-8"
			});
		}

		async getData() {
			const {
				encoding,
				utf8
			} = this;
			const blob = await super.getData();
			if (blob.text && utf8) {
				return blob.text();
			} else {
				const reader = new FileReader();
				return new Promise((resolve, reject) => {
					Object.assign(reader, {
						onload: ({ target }) => resolve(target.result),
						onerror: () => reject(reader.error)
					});
					reader.readAsText(blob, encoding);
				});
			}
		}
	}

	class FetchReader extends Reader {

		constructor(url, options) {
			super();
			createHtpReader(this, url, options);
		}

		async init() {
			super.init();
			await initHttpReader(this, sendFetchRequest, getFetchRequestData);
		}

		readUint8Array(index, length) {
			return readUint8ArrayHttpReader(this, index, length, sendFetchRequest, getFetchRequestData);
		}
	}

	class XHRReader extends Reader {

		constructor(url, options) {
			super();
			createHtpReader(this, url, options);
		}

		async init() {
			super.init();
			await initHttpReader(this, sendXMLHttpRequest, getXMLHttpRequestData);
		}

		readUint8Array(index, length) {
			return readUint8ArrayHttpReader(this, index, length, sendXMLHttpRequest, getXMLHttpRequestData);
		}
	}

	function createHtpReader(httpReader, url, options) {
		const {
			preventHeadRequest,
			useRangeHeader,
			forceRangeRequests
		} = options;
		options = Object.assign({}, options);
		delete options.preventHeadRequest;
		delete options.useRangeHeader;
		delete options.forceRangeRequests;
		delete options.useXHR;
		Object.assign(httpReader, {
			url,
			options,
			preventHeadRequest,
			useRangeHeader,
			forceRangeRequests
		});
	}

	async function initHttpReader(httpReader, sendRequest, getRequestData) {
		const {
			url,
			useRangeHeader,
			forceRangeRequests
		} = httpReader;
		if (isHttpFamily(url) && (useRangeHeader || forceRangeRequests)) {
			const { headers } = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader));
			if (!forceRangeRequests && headers.get(HTTP_HEADER_ACCEPT_RANGES) != HTTP_RANGE_UNIT) {
				throw new Error(ERR_HTTP_RANGE);
			} else {
				let contentSize;
				const contentRangeHeader = headers.get(HTTP_HEADER_CONTENT_RANGE);
				if (contentRangeHeader) {
					const splitHeader = contentRangeHeader.trim().split(/\s*\/\s*/);
					if (splitHeader.length) {
						const headerValue = splitHeader[1];
						if (headerValue && headerValue != "*") {
							contentSize = Number(headerValue);
						}
					}
				}
				if (contentSize === UNDEFINED_VALUE) {
					await getContentLength(httpReader, sendRequest, getRequestData);
				} else {
					httpReader.size = contentSize;
				}
			}
		} else {
			await getContentLength(httpReader, sendRequest, getRequestData);
		}
	}

	async function readUint8ArrayHttpReader(httpReader, index, length, sendRequest, getRequestData) {
		const {
			data,
			useRangeHeader,
			forceRangeRequests,
			options
		} = httpReader;
		if (useRangeHeader || forceRangeRequests) {
			const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, index, length));
			if (response.status != 206) {
				throw new Error(ERR_HTTP_RANGE);
			}
			return new Uint8Array(await response.arrayBuffer());
		} else {
			if (!data) {
				await getRequestData(httpReader, options);
			}
			return new Uint8Array(data.subarray(index, index + length));
		}
	}

	function getRangeHeaders(httpReader, index = 0, length = 1) {
		return Object.assign({}, getHeaders(httpReader), { [HTTP_HEADER_RANGE]: HTTP_RANGE_UNIT + "=" + index + "-" + (index + length - 1) });
	}

	function getHeaders({ options }) {
		const { headers } = options;
		if (headers) {
			if (Symbol.iterator in headers) {
				return Object.fromEntries(headers);
			} else {
				return headers;
			}
		}
	}

	async function getFetchRequestData(httpReader) {
		await getRequestData(httpReader, sendFetchRequest);
	}

	async function getXMLHttpRequestData(httpReader) {
		await getRequestData(httpReader, sendXMLHttpRequest);
	}

	async function getRequestData(httpReader, sendRequest) {
		const response = await sendRequest(HTTP_METHOD_GET, httpReader, getHeaders(httpReader));
		httpReader.data = new Uint8Array(await response.arrayBuffer());
		if (!httpReader.size) {
			httpReader.size = httpReader.data.length;
		}
	}

	async function getContentLength(httpReader, sendRequest, getRequestData) {
		if (httpReader.preventHeadRequest) {
			await getRequestData(httpReader, httpReader.options);
		} else {
			const response = await sendRequest(HTTP_METHOD_HEAD, httpReader, getHeaders(httpReader));
			const contentLength = response.headers.get(HTTP_HEADER_CONTENT_LENGTH);
			if (contentLength) {
				httpReader.size = Number(contentLength);
			} else {
				await getRequestData(httpReader, httpReader.options);
			}
		}
	}

	async function sendFetchRequest(method, { options, url }, headers) {
		const response = await fetch(url, Object.assign({}, options, { method, headers }));
		if (response.status < 400) {
			return response;
		} else {
			throw response.status == 416 ? new Error(ERR_HTTP_RANGE) : new Error(ERR_HTTP_STATUS + (response.statusText || response.status));
		}
	}

	function sendXMLHttpRequest(method, { url }, headers) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.addEventListener("load", () => {
				if (request.status < 400) {
					const headers = [];
					request.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach(header => {
						const splitHeader = header.trim().split(/\s*:\s*/);
						splitHeader[0] = splitHeader[0].trim().replace(/^[a-z]|-[a-z]/g, value => value.toUpperCase());
						headers.push(splitHeader);
					});
					resolve({
						status: request.status,
						arrayBuffer: () => request.response,
						headers: new Map(headers)
					});
				} else {
					reject(request.status == 416 ? new Error(ERR_HTTP_RANGE) : new Error(ERR_HTTP_STATUS + (request.statusText || request.status)));
				}
			}, false);
			request.addEventListener("error", event => reject(event.detail.error), false);
			request.open(method, url);
			if (headers) {
				for (const entry of Object.entries(headers)) {
					request.setRequestHeader(entry[0], entry[1]);
				}
			}
			request.responseType = "arraybuffer";
			request.send();
		});
	}

	class HttpReader extends Reader {

		constructor(url, options = {}) {
			super();
			Object.assign(this, {
				url,
				reader: options.useXHR ? new XHRReader(url, options) : new FetchReader(url, options)
			});
		}

		set size(value) {
			// ignored
		}

		get size() {
			return this.reader.size;
		}

		async init() {
			super.init();
			await this.reader.init();
		}

		readUint8Array(index, length) {
			return this.reader.readUint8Array(index, length);
		}
	}

	class HttpRangeReader extends HttpReader {

		constructor(url, options = {}) {
			options.useRangeHeader = true;
			super(url, options);
		}
	}


	class Uint8ArrayReader extends Reader {

		constructor(array) {
			super();
			Object.assign(this, {
				array,
				size: array.length
			});
		}

		readUint8Array(index, length) {
			return this.array.slice(index, index + length);
		}
	}

	class Uint8ArrayWriter extends Writer {

		init(initSize = 0) {
			super.init();
			Object.assign(this, {
				offset: 0,
				array: new Uint8Array(initSize)
			});
		}

		writeUint8Array(array) {
			const writer = this;
			if (writer.offset + array.length > writer.array.length) {
				const previousArray = writer.array;
				writer.array = new Uint8Array(previousArray.length + array.length);
				writer.array.set(previousArray);
			}
			writer.array.set(array, writer.offset);
			writer.offset += array.length;
		}

		getData() {
			return this.array;
		}
	}

	class SplitZipReader extends Reader {

		constructor(readers) {
			super();
			this.readers = readers;
		}

		async init() {
			super.init();
			const reader = this;
			const { readers } = reader;
			reader.lastDiskNumber = 0;
			await Promise.all(readers.map(async diskReader => {
				await diskReader.init();
				reader.size += diskReader.size;
			}));
		}

		async readUint8Array(offset, length, diskNumber = 0) {
			const reader = this;
			const { readers } = this;
			let result;
			let currentDiskNumber = diskNumber;
			if (currentDiskNumber == -1) {
				currentDiskNumber = readers.length - 1;
			}
			let currentReaderOffset = offset;
			while (currentReaderOffset >= readers[currentDiskNumber].size) {
				currentReaderOffset -= readers[currentDiskNumber].size;
				currentDiskNumber++;
			}
			const currentReader = readers[currentDiskNumber];
			const currentReaderSize = currentReader.size;
			if (currentReaderOffset + length <= currentReaderSize) {
				result = await readUint8Array(currentReader, currentReaderOffset, length);
			} else {
				const chunkLength = currentReaderSize - currentReaderOffset;
				result = new Uint8Array(length);
				result.set(await readUint8Array(currentReader, currentReaderOffset, chunkLength));
				result.set(await reader.readUint8Array(offset + chunkLength, length - chunkLength, diskNumber), chunkLength);
			}
			reader.lastDiskNumber = Math.max(currentDiskNumber, reader.lastDiskNumber);
			return result;
		}
	}

	function isHttpFamily(url) {
		const { baseURL } = getConfiguration();
		const { protocol } = new URL(url, baseURL);
		return protocol == "http:" || protocol == "https:";
	}

	async function initStream(stream, initSize) {
		if (stream.init && !stream.initialized) {
			await stream.init(initSize);
		}
	}

	function readUint8Array(reader, offset, size, diskNumber) {
		return reader.readUint8Array(offset, size, diskNumber);
	}

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

	/* global TextDecoder */

	const CP437 = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split("");
	const VALID_CP437 = CP437.length == 256;

	function decodeCP437(stringValue) {
		if (VALID_CP437) {
			let result = "";
			for (let indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) {
				result += CP437[stringValue[indexCharacter]];
			}
			return result;
		} else {
			return new TextDecoder().decode(stringValue);
		}
	}

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

	function decodeText(value, encoding) {
		if (encoding && encoding.trim().toLowerCase() == "cp437") {
			return decodeCP437(value);
		} else {
			return new TextDecoder(encoding).decode(value);
		}
	}

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

	const PROPERTY_NAMES = [
		"filename", "rawFilename", "directory", "encrypted", "compressedSize", "uncompressedSize",
		"lastModDate", "rawLastModDate", "comment", "rawComment", "signature", "extraField",
		"rawExtraField", "bitFlag", "extraFieldZip64", "extraFieldUnicodePath", "extraFieldUnicodeComment",
		"extraFieldAES", "filenameUTF8", "commentUTF8", "offset", "zip64", "compressionMethod",
		"extraFieldNTFS", "lastAccessDate", "creationDate", "extraFieldExtendedTimestamp",
		"version", "versionMadeBy", "msDosCompatible", "internalFileAttribute", "externalFileAttribute"];

	class Entry {

		constructor(data) {
			PROPERTY_NAMES.forEach(name => this[name] = data[name]);
		}

	}

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

	const SPLIT_ZIP_FILE_SIGNATURE = 0x08074b50;
	const ERR_BAD_FORMAT = "File format is not recognized";
	const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
	const ERR_EOCDR_ZIP64_NOT_FOUND = "End of Zip64 central directory not found";
	const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
	const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
	const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
	const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
	const ERR_ENCRYPTED = "File contains encrypted entry";
	const ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
	const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
	const ERR_SPLIT_ZIP_FILE = "Split zip file";
	const CHARSET_UTF8 = "utf-8";
	const CHARSET_CP437 = "cp437";
	const ZIP64_PROPERTIES = [
		["uncompressedSize", MAX_32_BITS],
		["compressedSize", MAX_32_BITS],
		["offset", MAX_32_BITS],
		["diskNumberStart", MAX_16_BITS]
	];
	const ZIP64_EXTRACTION = {
		[MAX_16_BITS]: {
			getValue: getUint32,
			bytes: 4
		},
		[MAX_32_BITS]: {
			getValue: getBigUint64,
			bytes: 8
		}
	};

	class ZipReader {

		constructor(reader, options = {}) {
			if (reader instanceof ReadableStream) {
				reader = {
					readable: reader
				};
			}
			Object.assign(this, {
				reader,
				options,
				config: getConfiguration()
			});
		}

		async* getEntriesGenerator(options = {}) {
			const zipReader = this;
			let { reader } = zipReader;
			const { config } = zipReader;
			await initStream(reader);
			if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
				if (Array.isArray(reader)) {
					reader = new SplitZipReader(reader);
				} else {
					reader = new BlobReader(await new Response(reader.readable).blob());
				}
				await initStream(reader);
			}
			if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
				throw new Error(ERR_BAD_FORMAT);
			}
			reader.chunkSize = getChunkSize(config);
			const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, reader.size, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS * 16);
			if (!endOfDirectoryInfo) {
				const signatureArray = await readUint8Array(reader, 0, 4);
				const signatureView = getDataView$1(signatureArray);
				if (getUint32(signatureView) == SPLIT_ZIP_FILE_SIGNATURE) {
					throw new Error(ERR_SPLIT_ZIP_FILE);
				} else {
					throw new Error(ERR_EOCDR_NOT_FOUND);
				}
			}
			const { lastDiskNumber } = reader;
			const endOfDirectoryView = getDataView$1(endOfDirectoryInfo);
			let directoryDataLength = getUint32(endOfDirectoryView, 12);
			let directoryDataOffset = getUint32(endOfDirectoryView, 16);
			const commentOffset = endOfDirectoryInfo.offset;
			const commentLength = getUint16(endOfDirectoryView, 20);
			const appendedDataOffset = commentOffset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
			let diskNumber = getUint16(endOfDirectoryView, 4);
			if (lastDiskNumber !== UNDEFINED_VALUE && diskNumber != lastDiskNumber) {
				throw new Error(ERR_SPLIT_ZIP_FILE);
			}
			let filesLength = getUint16(endOfDirectoryView, 8);
			let prependedDataLength = 0;
			let startOffset = 0;
			if (directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS || diskNumber == MAX_16_BITS) {
				const endOfDirectoryLocatorArray = await readUint8Array(reader, endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);
				const endOfDirectoryLocatorView = getDataView$1(endOfDirectoryLocatorArray);
				if (getUint32(endOfDirectoryLocatorView, 0) != ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
					throw new Error(ERR_EOCDR_ZIP64_NOT_FOUND);
				}
				directoryDataOffset = getBigUint64(endOfDirectoryLocatorView, 8);
				let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH, -1);
				let endOfDirectoryView = getDataView$1(endOfDirectoryArray);
				const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
				if (getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = expectedDirectoryDataOffset;
					prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
					endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH, -1);
					endOfDirectoryView = getDataView$1(endOfDirectoryArray);
				}
				if (getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
					throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
				}
				if (diskNumber == MAX_16_BITS) {
					diskNumber = getUint32(endOfDirectoryView, 16);
				}
				if (filesLength == MAX_16_BITS) {
					filesLength = getBigUint64(endOfDirectoryView, 32);
				}
				if (directoryDataLength == MAX_32_BITS) {
					directoryDataLength = getBigUint64(endOfDirectoryView, 40);
				}
				directoryDataOffset -= directoryDataLength;
			}
			if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
				throw new Error(ERR_BAD_FORMAT);
			}
			let offset = 0;
			let directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
			let directoryView = getDataView$1(directoryArray);
			if (directoryDataLength) {
				const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - directoryDataLength;
				if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = expectedDirectoryDataOffset;
					prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
					directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
					directoryView = getDataView$1(directoryArray);
				}
			}
			if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const filenameEncoding = getOptionValue$1(zipReader, options, "filenameEncoding");
			const commentEncoding = getOptionValue$1(zipReader, options, "commentEncoding");
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const fileEntry = new ZipEntry(reader, config, zipReader.options);
				if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
					throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
				}
				readCommonHeader(fileEntry, directoryView, offset + 6);
				const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
				const filenameOffset = offset + 46;
				const extraFieldOffset = filenameOffset + fileEntry.filenameLength;
				const commentOffset = extraFieldOffset + fileEntry.extraFieldLength;
				const versionMadeBy = getUint16(directoryView, offset + 4);
				const msDosCompatible = (versionMadeBy & 0) == 0;
				const rawFilename = directoryArray.subarray(filenameOffset, extraFieldOffset);
				const commentLength = getUint16(directoryView, offset + 32);
				const endOffset = commentOffset + commentLength;
				const rawComment = directoryArray.subarray(commentOffset, endOffset);
				const filenameUTF8 = languageEncodingFlag;
				const commentUTF8 = languageEncodingFlag;
				const directory = msDosCompatible && ((getUint8(directoryView, offset + 38) & FILE_ATTR_MSDOS_DIR_MASK) == FILE_ATTR_MSDOS_DIR_MASK);
				const offsetFileEntry = getUint32(directoryView, offset + 42) + prependedDataLength;
				Object.assign(fileEntry, {
					versionMadeBy,
					msDosCompatible,
					compressedSize: 0,
					uncompressedSize: 0,
					commentLength,
					directory,
					offset: offsetFileEntry,
					diskNumberStart: getUint16(directoryView, offset + 34),
					internalFileAttribute: getUint16(directoryView, offset + 36),
					externalFileAttribute: getUint32(directoryView, offset + 38),
					rawFilename,
					filenameUTF8,
					commentUTF8,
					rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset)
				});
				const [filename, comment] = await Promise.all([
					decodeText(rawFilename, filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437),
					decodeText(rawComment, commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437)
				]);
				Object.assign(fileEntry, {
					rawComment,
					filename,
					comment,
					directory: directory || filename.endsWith(DIRECTORY_SIGNATURE)
				});
				startOffset = Math.max(offsetFileEntry, startOffset);
				await readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
				const entry = new Entry(fileEntry);
				entry.getData = (writer, options) => fileEntry.getData(writer, entry, options);
				offset = endOffset;
				const { onprogress } = options;
				if (onprogress) {
					try {
						await onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
					} catch (_error) {
						// ignored
					}
				}
				yield entry;
			}
			const extractPrependedData = getOptionValue$1(zipReader, options, "extractPrependedData");
			const extractAppendedData = getOptionValue$1(zipReader, options, "extractAppendedData");
			if (extractPrependedData) {
				zipReader.prependedData = startOffset > 0 ? await readUint8Array(reader, 0, startOffset) : new Uint8Array();
			}
			zipReader.comment = commentLength ? await readUint8Array(reader, commentOffset + END_OF_CENTRAL_DIR_LENGTH, commentLength) : new Uint8Array();
			if (extractAppendedData) {
				zipReader.appendedData = appendedDataOffset < reader.size ? await readUint8Array(reader, appendedDataOffset, reader.size - appendedDataOffset) : new Uint8Array();
			}
			return true;
		}

		async getEntries(options = {}) {
			const entries = [];
			for await (const entry of this.getEntriesGenerator(options)) {
				entries.push(entry);
			}
			return entries;
		}

		async close() {
		}
	}

	class ZipEntry {

		constructor(reader, config, options) {
			Object.assign(this, {
				reader,
				config,
				options
			});
		}

		async getData(writer, fileEntry, options = {}) {
			const zipEntry = this;
			const {
				reader,
				offset,
				diskNumberStart,
				extraFieldAES,
				compressionMethod,
				config,
				bitFlag,
				signature,
				rawLastModDate,
				uncompressedSize,
				compressedSize
			} = zipEntry;
			const localDirectory = zipEntry.localDirectory = {};
			let dataArray = await readUint8Array(reader, offset, 30, diskNumberStart);
			const dataView = getDataView$1(dataArray);
			let password = getOptionValue$1(zipEntry, options, "password");
			password = password && password.length && password;
			if (extraFieldAES) {
				if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
					throw new Error(ERR_UNSUPPORTED_COMPRESSION);
				}
			}
			if (compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
			if (getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
				throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
			}
			readCommonHeader(localDirectory, dataView, 4);
			localDirectory.rawExtraField = localDirectory.extraFieldLength ?
				await readUint8Array(reader, offset + 30 + localDirectory.filenameLength, localDirectory.extraFieldLength, diskNumberStart) :
				new Uint8Array();
			await readCommonFooter(zipEntry, localDirectory, dataView, 4);
			Object.assign(fileEntry, {
				lastAccessDate: localDirectory.lastAccessDate,
				creationDate: localDirectory.creationDate
			});
			const encrypted = zipEntry.encrypted && localDirectory.encrypted;
			const zipCrypto = encrypted && !extraFieldAES;
			if (encrypted) {
				if (!zipCrypto && extraFieldAES.strength === UNDEFINED_VALUE) {
					throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
				} else if (!password) {
					throw new Error(ERR_ENCRYPTED);
				}
			}
			const dataOffset = offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength;
			const readable = reader.readable;
			readable.diskNumberStart = diskNumberStart;
			readable.offset = dataOffset;
			const size = readable.size = compressedSize;
			if (writer instanceof WritableStream) {
				writer = {
					writable: writer
				};
			}
			const { writable } = writer;
			if (writable.size === UNDEFINED_VALUE) {
				writable.size = 0;
			}
			const signal = getOptionValue$1(zipEntry, options, "signal");
			await initStream(writer, uncompressedSize);
			const { onstart, onprogress, onend } = options;
			const workerOptions = {
				options: {
					codecType: CODEC_INFLATE,
					password,
					zipCrypto,
					encryptionStrength: extraFieldAES && extraFieldAES.strength,
					signed: getOptionValue$1(zipEntry, options, "checkSignature"),
					passwordVerification: zipCrypto && (bitFlag.dataDescriptor ? ((rawLastModDate >>> 8) & 0xFF) : ((signature >>> 24) & 0xFF)),
					signature,
					compressed: compressionMethod != 0,
					encrypted,
					useWebWorkers: getOptionValue$1(zipEntry, options, "useWebWorkers"),
					useCompressionStream: getOptionValue$1(zipEntry, options, "useCompressionStream"),
					transferStreams: getOptionValue$1(zipEntry, options, "transferStreams")
				},
				config,
				streamOptions: { signal, size, onstart, onprogress, onend }
			};
			writable.size += (await runWorker({ readable, writable }, workerOptions)).size;
			const preventClose = getOptionValue$1(zipEntry, options, "preventClose");
			if (!preventClose) {
				await writable.close();
			}
			return writer.getData ? writer.getData() : writable;
		}
	}

	function readCommonHeader(directory, dataView, offset) {
		const rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
		const encrypted = (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED;
		const rawLastModDate = getUint32(dataView, offset + 6);
		Object.assign(directory, {
			encrypted,
			version: getUint16(dataView, offset),
			bitFlag: {
				level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
				dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
				languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
			},
			rawLastModDate,
			lastModDate: getDate(rawLastModDate),
			filenameLength: getUint16(dataView, offset + 22),
			extraFieldLength: getUint16(dataView, offset + 24)
		});
	}

	async function readCommonFooter(fileEntry, directory, dataView, offset) {
		const { rawExtraField } = directory;
		const extraField = directory.extraField = new Map();
		const rawExtraFieldView = getDataView$1(new Uint8Array(rawExtraField));
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
		} catch (_error) {
			// ignored
		}
		const compressionMethod = getUint16(dataView, offset + 4);
		Object.assign(directory, {
			signature: getUint32(dataView, offset + 10),
			uncompressedSize: getUint32(dataView, offset + 18),
			compressedSize: getUint32(dataView, offset + 14)
		});
		const extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
		if (extraFieldZip64) {
			readExtraFieldZip64(extraFieldZip64, directory);
			directory.extraFieldZip64 = extraFieldZip64;
		}
		const extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
		if (extraFieldUnicodePath) {
			await readExtraFieldUnicode(extraFieldUnicodePath, "filename", "rawFilename", directory, fileEntry);
			directory.extraFieldUnicodePath = extraFieldUnicodePath;
		}
		const extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
		if (extraFieldUnicodeComment) {
			await readExtraFieldUnicode(extraFieldUnicodeComment, "comment", "rawComment", directory, fileEntry);
			directory.extraFieldUnicodeComment = extraFieldUnicodeComment;
		}
		const extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
		if (extraFieldAES) {
			readExtraFieldAES(extraFieldAES, directory, compressionMethod);
			directory.extraFieldAES = extraFieldAES;
		} else {
			directory.compressionMethod = compressionMethod;
		}
		const extraFieldNTFS = extraField.get(EXTRAFIELD_TYPE_NTFS);
		if (extraFieldNTFS) {
			readExtraFieldNTFS(extraFieldNTFS, directory);
			directory.extraFieldNTFS = extraFieldNTFS;
		}
		const extraFieldExtendedTimestamp = extraField.get(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
		if (extraFieldExtendedTimestamp) {
			readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory);
			directory.extraFieldExtendedTimestamp = extraFieldExtendedTimestamp;
		}
	}

	function readExtraFieldZip64(extraFieldZip64, directory) {
		directory.zip64 = true;
		const extraFieldView = getDataView$1(extraFieldZip64.data);
		const missingProperties = ZIP64_PROPERTIES.filter(([propertyName, max]) => directory[propertyName] == max);
		for (let indexMissingProperty = 0, offset = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
			const [propertyName, max] = missingProperties[indexMissingProperty];
			if (directory[propertyName] == max) {
				const extraction = ZIP64_EXTRACTION[max];
				directory[propertyName] = extraFieldZip64[propertyName] = extraction.getValue(extraFieldView, offset);
				offset += extraction.bytes;
			} else if (extraFieldZip64[propertyName]) {
				throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
			}
		}
	}

	async function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
		const extraFieldView = getDataView$1(extraFieldUnicode.data);
		const crc32 = new Crc32();
		crc32.append(fileEntry[rawPropertyName]);
		const dataViewSignature = getDataView$1(new Uint8Array(4));
		dataViewSignature.setUint32(0, crc32.get(), true);
		Object.assign(extraFieldUnicode, {
			version: getUint8(extraFieldView, 0),
			signature: getUint32(extraFieldView, 1),
			[propertyName]: await decodeText(extraFieldUnicode.data.subarray(5)),
			valid: !fileEntry.bitFlag.languageEncodingFlag && extraFieldUnicode.signature == getUint32(dataViewSignature, 0)
		});
		if (extraFieldUnicode.valid) {
			directory[propertyName] = extraFieldUnicode[propertyName];
			directory[propertyName + "UTF8"] = true;
		}
	}

	function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
		const extraFieldView = getDataView$1(extraFieldAES.data);
		const strength = getUint8(extraFieldView, 4);
		Object.assign(extraFieldAES, {
			vendorVersion: getUint8(extraFieldView, 0),
			vendorId: getUint8(extraFieldView, 2),
			strength,
			originalCompressionMethod: compressionMethod,
			compressionMethod: getUint16(extraFieldView, 5)
		});
		directory.compressionMethod = extraFieldAES.compressionMethod;
	}

	function readExtraFieldNTFS(extraFieldNTFS, directory) {
		const extraFieldView = getDataView$1(extraFieldNTFS.data);
		let offsetExtraField = 4;
		let tag1Data;
		try {
			while (offsetExtraField < extraFieldNTFS.data.length && !tag1Data) {
				const tagValue = getUint16(extraFieldView, offsetExtraField);
				const attributeSize = getUint16(extraFieldView, offsetExtraField + 2);
				if (tagValue == EXTRAFIELD_TYPE_NTFS_TAG1) {
					tag1Data = extraFieldNTFS.data.slice(offsetExtraField + 4, offsetExtraField + 4 + attributeSize);
				}
				offsetExtraField += 4 + attributeSize;
			}
		} catch (_error) {
			// ignored
		}
		try {
			if (tag1Data && tag1Data.length == 24) {
				const tag1View = getDataView$1(tag1Data);
				const rawLastModDate = tag1View.getBigUint64(0, true);
				const rawLastAccessDate = tag1View.getBigUint64(8, true);
				const rawCreationDate = tag1View.getBigUint64(16, true);
				Object.assign(extraFieldNTFS, {
					rawLastModDate,
					rawLastAccessDate,
					rawCreationDate
				});
				const lastModDate = getDateNTFS(rawLastModDate);
				const lastAccessDate = getDateNTFS(rawLastAccessDate);
				const creationDate = getDateNTFS(rawCreationDate);
				const extraFieldData = { lastModDate, lastAccessDate, creationDate };
				Object.assign(extraFieldNTFS, extraFieldData);
				Object.assign(directory, extraFieldData);
			}
		} catch (_error) {
			// ignored
		}
	}

	function readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory) {
		const extraFieldView = getDataView$1(extraFieldExtendedTimestamp.data);
		const flags = getUint8(extraFieldView, 0);
		const timeProperties = [];
		const timeRawProperties = [];
		if ((flags & 0x1) == 0x1) {
			timeProperties.push("lastModDate");
			timeRawProperties.push("rawLastModDate");
		}
		if ((flags & 0x2) == 0x2) {
			timeProperties.push("lastAccessDate");
			timeRawProperties.push("rawLastAccessDate");
		}
		if ((flags & 0x4) == 0x4) {
			timeProperties.push("creationDate");
			timeRawProperties.push("rawCreationDate");
		}
		let offset = 1;
		timeProperties.forEach((propertyName, indexProperty) => {
			if (extraFieldExtendedTimestamp.data.length >= offset + 4) {
				const time = getUint32(extraFieldView, offset);
				directory[propertyName] = extraFieldExtendedTimestamp[propertyName] = new Date(time * 1000);
				const rawPropertyName = timeRawProperties[indexProperty];
				extraFieldExtendedTimestamp[rawPropertyName] = time;
			}
			offset += 4;
		});
	}

	async function seekSignature(reader, signature, startOffset, minimumBytes, maximumLength) {
		const signatureArray = new Uint8Array(4);
		const signatureView = getDataView$1(signatureArray);
		setUint32$1(signatureView, 0, signature);
		const maximumBytes = minimumBytes + maximumLength;
		return (await seek(minimumBytes)) || await seek(Math.min(maximumBytes, startOffset));

		async function seek(length) {
			const offset = startOffset - length;
			const bytes = await readUint8Array(reader, offset, length);
			for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) {
				if (bytes[indexByte] == signatureArray[0] && bytes[indexByte + 1] == signatureArray[1] &&
					bytes[indexByte + 2] == signatureArray[2] && bytes[indexByte + 3] == signatureArray[3]) {
					return {
						offset: offset + indexByte,
						buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
					};
				}
			}
		}
	}

	function getOptionValue$1(zipReader, options, name) {
		return options[name] === UNDEFINED_VALUE ? zipReader.options[name] : options[name];
	}

	function getDate(timeRaw) {
		const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
		try {
			return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
		} catch (_error) {
			// ignored
		}
	}

	function getDateNTFS(timeRaw) {
		return new Date((Number((timeRaw / BigInt(10000)) - BigInt(11644473600000))));
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
		return Number(view.getBigUint64(offset, true));
	}

	function setUint32$1(view, offset, value) {
		view.setUint32(offset, value, true);
	}

	function getDataView$1(array) {
		return new DataView(array.buffer);
	}

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

	const ERR_DUPLICATED_NAME = "File already exists";
	const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
	const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
	const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
	const ERR_INVALID_VERSION = "Version exceeds 65535";
	const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
	const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
	const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
	const ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported (make sure 'keepOrder' is set to 'true')";

	const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
	const EXTRAFIELD_LENGTH_ZIP64 = 24;

	let workers = 0;
	const pendingEntries = [];

	class ZipWriter {

		constructor(writer, options = {}) {
			if (writer instanceof WritableStream) {
				writer = { writable: writer };
			}
			if (writer.writable.size === UNDEFINED_VALUE) {
				writer.writable.size = 0;
			}
			Object.assign(this, {
				writer,
				options,
				config: getConfiguration(),
				files: new Map(),
				filenames: new Set(),
				offset: writer.writable.size,
				pendingEntriesSize: 0,
				pendingAddFileCalls: new Set()
			});
		}

		async add(name = "", reader, options = {}) {
			const zipWriter = this;
			const {
				pendingAddFileCalls,
				config
			} = zipWriter;
			if (workers < config.maxWorkers) {
				workers++;
			} else {
				await new Promise(resolve => pendingEntries.push(resolve));
			}
			let promiseAddFile;
			try {
				name = name.trim();
				if (zipWriter.filenames.has(name)) {
					throw new Error(ERR_DUPLICATED_NAME);
				}
				zipWriter.filenames.add(name);
				promiseAddFile = addFile(zipWriter, name, reader, options);
				pendingAddFileCalls.add(promiseAddFile);
				return await promiseAddFile;
			} catch (error) {
				zipWriter.filenames.delete(name);
				throw error;
			} finally {
				pendingAddFileCalls.delete(promiseAddFile);
				const pendingEntry = pendingEntries.shift();
				if (pendingEntry) {
					pendingEntry();
				} else {
					workers--;
				}
			}
		}

		async close(comment = new Uint8Array(), options = {}) {
			const { pendingAddFileCalls, writer } = this;
			const { writable } = writer;
			while (pendingAddFileCalls.size) {
				await Promise.all(Array.from(pendingAddFileCalls));
			}
			await closeFile(this, comment, options);
			if (!writer.preventClose && !options.preventClose) {
				await writable.close();
			}
			return writer.getData ? writer.getData() : writable;
		}
	}

	async function addFile(zipWriter, name, reader, options) {
		name = name.trim();
		if (options.directory && (!name.endsWith(DIRECTORY_SIGNATURE))) {
			name += DIRECTORY_SIGNATURE;
		} else {
			options.directory = name.endsWith(DIRECTORY_SIGNATURE);
		}
		const rawFilename = encodeText(name);
		if (getLength(rawFilename) > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_NAME);
		}
		const comment = options.comment || "";
		const rawComment = encodeText(comment);
		if (getLength(rawComment) > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_COMMENT);
		}
		const version = zipWriter.options.version || options.version || 0;
		if (version > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		const versionMadeBy = zipWriter.options.versionMadeBy || options.versionMadeBy || 20;
		if (versionMadeBy > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		const lastModDate = getOptionValue(zipWriter, options, "lastModDate") || new Date();
		const lastAccessDate = getOptionValue(zipWriter, options, "lastAccessDate");
		const creationDate = getOptionValue(zipWriter, options, "creationDate");
		const password = getOptionValue(zipWriter, options, "password");
		const encryptionStrength = getOptionValue(zipWriter, options, "encryptionStrength") || 3;
		const zipCrypto = getOptionValue(zipWriter, options, "zipCrypto");
		if (password !== UNDEFINED_VALUE && encryptionStrength !== UNDEFINED_VALUE && (encryptionStrength < 1 || encryptionStrength > 3)) {
			throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
		}
		let rawExtraField = new Uint8Array();
		const { extraField } = options;
		if (extraField) {
			let extraFieldSize = 0;
			let offset = 0;
			extraField.forEach(data => extraFieldSize += 4 + getLength(data));
			rawExtraField = new Uint8Array(extraFieldSize);
			extraField.forEach((data, type) => {
				if (type > MAX_16_BITS) {
					throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
				}
				if (getLength(data) > MAX_16_BITS) {
					throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
				}
				arraySet(rawExtraField, new Uint16Array([type]), offset);
				arraySet(rawExtraField, new Uint16Array([getLength(data)]), offset + 2);
				arraySet(rawExtraField, data, offset + 4);
				offset += 4 + getLength(data);
			});
		}
		let extendedTimestamp = getOptionValue(zipWriter, options, "extendedTimestamp");
		if (extendedTimestamp === UNDEFINED_VALUE) {
			extendedTimestamp = true;
		}
		let maximumCompressedSize = 0;
		let maximumEntrySize = 0;
		let keepOrder = getOptionValue(zipWriter, options, "keepOrder");
		if (keepOrder === UNDEFINED_VALUE) {
			keepOrder = true;
		}
		let uncompressedSize = 0;
		let msDosCompatible = getOptionValue(zipWriter, options, "msDosCompatible");
		if (msDosCompatible === UNDEFINED_VALUE) {
			msDosCompatible = true;
		}
		const internalFileAttribute = getOptionValue(zipWriter, options, "internalFileAttribute") || 0;
		const externalFileAttribute = getOptionValue(zipWriter, options, "externalFileAttribute") || 0;
		let zip64 = getOptionValue(zipWriter, options, "zip64");
		if (reader) {
			if (reader instanceof ReadableStream) {
				reader = {
					readable: reader
				};
			}
			await initStream(reader);
			if (reader.size === UNDEFINED_VALUE) {
				options.dataDescriptor = true;
				if (zip64 || zip64 === UNDEFINED_VALUE) {
					zip64 = true;
					maximumCompressedSize = MAX_32_BITS;
				}
			} else {
				uncompressedSize = reader.size;
				maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
			}
		}
		if (zipWriter.offset + zipWriter.pendingEntriesSize >= MAX_32_BITS ||
			uncompressedSize >= MAX_32_BITS ||
			maximumCompressedSize >= MAX_32_BITS) {
			if (zip64 === false || !keepOrder) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			} else {
				zip64 = true;
			}
		}
		zip64 = zip64 || false;
		const level = getOptionValue(zipWriter, options, "level");
		const useWebWorkers = getOptionValue(zipWriter, options, "useWebWorkers");
		const bufferedWrite = getOptionValue(zipWriter, options, "bufferedWrite");
		let dataDescriptor = getOptionValue(zipWriter, options, "dataDescriptor");
		let dataDescriptorSignature = getOptionValue(zipWriter, options, "dataDescriptorSignature");
		const signal = getOptionValue(zipWriter, options, "signal");
		const useCompressionStream = getOptionValue(zipWriter, options, "useCompressionStream");
		if (dataDescriptor === UNDEFINED_VALUE) {
			dataDescriptor = true;
		}
		if (dataDescriptor && dataDescriptorSignature === UNDEFINED_VALUE) {
			dataDescriptorSignature = false;
		}
		options = Object.assign({}, options, {
			rawFilename,
			rawComment,
			version,
			versionMadeBy,
			lastModDate,
			lastAccessDate,
			creationDate,
			rawExtraField,
			zip64,
			password,
			level,
			useWebWorkers,
			encryptionStrength,
			extendedTimestamp,
			zipCrypto,
			bufferedWrite,
			keepOrder,
			dataDescriptor,
			dataDescriptorSignature,
			signal,
			msDosCompatible,
			internalFileAttribute,
			externalFileAttribute,
			useCompressionStream
		});
		const headerInfo = getHeaderInfo(options);
		const dataDescriptorInfo = getDataDescriptorInfo(options);
		maximumEntrySize = getLength(headerInfo.localHeaderArray, dataDescriptorInfo.dataDescriptorArray) + maximumCompressedSize;
		zipWriter.pendingEntriesSize += maximumEntrySize;
		let fileEntry;
		try {
			fileEntry = await getFileEntry(zipWriter, name, reader, { headerInfo, dataDescriptorInfo }, options);
		} catch (error) {
			if (!error.corruptedEntry && maximumEntrySize) {
				zipWriter.pendingEntriesSize -= maximumEntrySize;
			}
			throw error;
		}
		Object.assign(fileEntry, { name, comment, extraField });
		return new Entry(fileEntry);
	}

	async function getFileEntry(zipWriter, name, reader, entryInfo, options) {
		const {
			files,
			writer
		} = zipWriter;
		const {
			keepOrder,
			dataDescriptor,
			zipCrypto,
			signal
		} = options;
		const previousFileEntry = Array.from(files.values()).pop();
		let fileEntry = {};
		let bufferedWrite;
		let releaseLockWriter;
		let releaseLockCurrentFileEntry;
		let writingBufferedEntryData;
		let writingEntryData;
		let fileWriter;
		files.set(name, fileEntry);
		try {
			let lockPreviousFileEntry;
			if (keepOrder) {
				lockPreviousFileEntry = previousFileEntry && previousFileEntry.lock;
				requestLockCurrentFileEntry();
			}
			if (options.bufferedWrite || zipWriter.lockWriter || !dataDescriptor) {
				fileWriter = new BlobWriter();
				fileWriter.writable.size = 0;
				bufferedWrite = true;
				await initStream(writer);
			} else {
				fileWriter = writer;
				zipWriter.lockWriter = Promise.resolve();
				releaseLockWriter = () => delete zipWriter.lockWriter;
			}
			await initStream(fileWriter);
			if (!bufferedWrite) {
				await lockPreviousFileEntry;
			}
			writingEntryData = true;
			fileEntry = await createFileEntry(reader, fileWriter, fileEntry, entryInfo, zipWriter.config, options);
			writingEntryData = false;
			files.set(name, fileEntry);
			fileEntry.filename = name;
			if (bufferedWrite) {
				await fileWriter.writable.close();
				let blob = await fileWriter.getData();
				await lockPreviousFileEntry;
				await requestLockWriter();
				writingBufferedEntryData = true;
				const { writable } = writer;
				if (!dataDescriptor) {
					const arrayBuffer = await sliceAsArrayBuffer(blob, 0, 26);
					const arrayBufferView = new DataView(arrayBuffer);
					if (!fileEntry.encrypted || zipCrypto) {
						setUint32(arrayBufferView, 14, fileEntry.signature);
					}
					if (fileEntry.zip64) {
						setUint32(arrayBufferView, 18, MAX_32_BITS);
						setUint32(arrayBufferView, 22, MAX_32_BITS);
					} else {
						setUint32(arrayBufferView, 18, fileEntry.compressedSize);
						setUint32(arrayBufferView, 22, fileEntry.uncompressedSize);
					}
					await writeData(writable, new Uint8Array(arrayBuffer));
					blob = blob.slice(arrayBuffer.byteLength);
				}
				await blob.stream().pipeTo(writable, { preventClose: true, signal });
				writingBufferedEntryData = false;
			}
			fileEntry.offset = zipWriter.offset;
			if (fileEntry.zip64) {
				const rawExtraFieldZip64View = getDataView(fileEntry.rawExtraFieldZip64);
				setBigUint64(rawExtraFieldZip64View, 20, BigInt(fileEntry.offset));
			} else if (fileEntry.offset >= MAX_32_BITS) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			}
			zipWriter.offset += fileEntry.length;
			return fileEntry;
		} catch (error) {
			if ((bufferedWrite && writingBufferedEntryData) || (!bufferedWrite && writingEntryData)) {
				zipWriter.hasCorruptedEntries = true;
				if (error) {
					error.corruptedEntry = true;
				}
				if (bufferedWrite) {
					zipWriter.offset += fileWriter.writable.size;
				} else {
					zipWriter.offset = fileWriter.writable.size;
				}
			}
			files.delete(name);
			throw error;
		} finally {
			if (releaseLockCurrentFileEntry) {
				releaseLockCurrentFileEntry();
			}
			if (releaseLockWriter) {
				releaseLockWriter();
			}
		}

		function requestLockCurrentFileEntry() {
			fileEntry.lock = new Promise(resolve => releaseLockCurrentFileEntry = resolve);
		}

		async function requestLockWriter() {
			const { lockWriter } = zipWriter;
			if (lockWriter) {
				await lockWriter.then(() => delete zipWriter.lockWriter);
				return requestLockWriter();
			} else {
				zipWriter.lockWriter = new Promise(resolve => releaseLockWriter = resolve);
			}
		}
	}

	async function createFileEntry(reader, writer, pendingFileEntry, entryInfo, config, options) {
		const {
			headerInfo,
			dataDescriptorInfo
		} = entryInfo;
		const {
			localHeaderArray,
			headerArray,
			lastModDate,
			rawLastModDate,
			encrypted,
			compressed,
			version,
			compressionMethod,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldAES
		} = headerInfo;
		const { dataDescriptorArray } = dataDescriptorInfo;
		const {
			rawFilename,
			lastAccessDate,
			creationDate,
			password,
			level,
			zip64,
			zipCrypto,
			dataDescriptor,
			directory,
			versionMadeBy,
			rawComment,
			rawExtraField,
			useWebWorkers,
			onstart,
			onprogress,
			onend,
			signal,
			encryptionStrength,
			extendedTimestamp,
			msDosCompatible,
			internalFileAttribute,
			externalFileAttribute,
			useCompressionStream
		} = options;
		const fileEntry = {
			lock: pendingFileEntry.lock,
			versionMadeBy,
			zip64,
			directory: Boolean(directory),
			filenameUTF8: true,
			rawFilename,
			commentUTF8: true,
			rawComment,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldAES,
			rawExtraField,
			extendedTimestamp,
			msDosCompatible,
			internalFileAttribute,
			externalFileAttribute
		};
		let uncompressedSize = 0;
		let signature;
		let compressedSize = 0;
		const { writable } = writer;
		if (reader) {
			reader.chunkSize = getChunkSize(config);
			await writeData(writable, localHeaderArray);
			const readable = reader.readable;
			const size = readable.size = reader.size;
			const workerOptions = {
				options: {
					codecType: CODEC_DEFLATE,
					level,
					password,
					encryptionStrength,
					zipCrypto: encrypted && zipCrypto,
					passwordVerification: encrypted && zipCrypto && (rawLastModDate >> 8) & 0xFF,
					signed: true,
					compressed,
					encrypted,
					useWebWorkers,
					useCompressionStream,
					transferStreams: false
				},
				config,
				streamOptions: { signal, size, onstart, onprogress, onend }
			};
			const result = await runWorker({ readable, writable }, workerOptions);
			writable.size += result.size;
			signature = result.signature;
			uncompressedSize = reader.size = readable.size;
			compressedSize = result.size;
		} else {
			await writeData(writable, localHeaderArray);
		}
		const rawExtraFieldZip64 = zip64 ? new Uint8Array(EXTRAFIELD_LENGTH_ZIP64 + 4) : new Uint8Array();
		if (reader) {
			setEntryInfo({
				signature,
				rawExtraFieldZip64,
				compressedSize,
				uncompressedSize,
				headerInfo,
				dataDescriptorInfo
			}, options);
		}
		if (dataDescriptor) {
			await writeData(writable, dataDescriptorArray);
		}
		Object.assign(fileEntry, {
			compressedSize,
			lastModDate,
			rawLastModDate,
			creationDate,
			lastAccessDate,
			encrypted,
			length: getLength(localHeaderArray, dataDescriptorArray) + compressedSize,
			compressionMethod,
			version,
			headerArray,
			signature,
			rawExtraFieldZip64
		});
		return fileEntry;
	}

	function getHeaderInfo(options) {
		const {
			rawFilename,
			lastModDate,
			lastAccessDate,
			creationDate,
			password,
			level,
			zip64,
			zipCrypto,
			dataDescriptor,
			directory,
			rawExtraField,
			encryptionStrength,
			extendedTimestamp,
		} = options;
		const compressed = level !== 0 && !directory;
		const encrypted = Boolean(password && getLength(password));
		let rawExtraFieldAES;
		if (encrypted && !zipCrypto) {
			rawExtraFieldAES = new Uint8Array(getLength(EXTRAFIELD_DATA_AES) + 2);
			const extraFieldAESView = getDataView(rawExtraFieldAES);
			setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
			arraySet(rawExtraFieldAES, EXTRAFIELD_DATA_AES, 2);
			setUint8(extraFieldAESView, 8, encryptionStrength);
		} else {
			rawExtraFieldAES = new Uint8Array();
		}
		let rawExtraFieldNTFS;
		let rawExtraFieldExtendedTimestamp;
		if (extendedTimestamp) {
			rawExtraFieldExtendedTimestamp = new Uint8Array(9 + (lastAccessDate ? 4 : 0) + (creationDate ? 4 : 0));
			const extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
			setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
			setUint16(extraFieldExtendedTimestampView, 2, getLength(rawExtraFieldExtendedTimestamp) - 4);
			const extraFieldExtendedTimestampFlag = 0x1 + (lastAccessDate ? 0x2 : 0) + (creationDate ? 0x4 : 0);
			setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
			setUint32(extraFieldExtendedTimestampView, 5, Math.floor(lastModDate.getTime() / 1000));
			if (lastAccessDate) {
				setUint32(extraFieldExtendedTimestampView, 9, Math.floor(lastAccessDate.getTime() / 1000));
			}
			if (creationDate) {
				setUint32(extraFieldExtendedTimestampView, 13, Math.floor(creationDate.getTime() / 1000));
			}
			try {
				rawExtraFieldNTFS = new Uint8Array(36);
				const extraFieldNTFSView = getDataView(rawExtraFieldNTFS);
				const lastModTimeNTFS = getTimeNTFS(lastModDate);
				setUint16(extraFieldNTFSView, 0, EXTRAFIELD_TYPE_NTFS);
				setUint16(extraFieldNTFSView, 2, 32);
				setUint16(extraFieldNTFSView, 8, EXTRAFIELD_TYPE_NTFS_TAG1);
				setUint16(extraFieldNTFSView, 10, 24);
				setBigUint64(extraFieldNTFSView, 12, lastModTimeNTFS);
				setBigUint64(extraFieldNTFSView, 20, getTimeNTFS(lastAccessDate) || lastModTimeNTFS);
				setBigUint64(extraFieldNTFSView, 28, getTimeNTFS(creationDate) || lastModTimeNTFS);
			} catch (_error) {
				rawExtraFieldNTFS = new Uint8Array();
			}
		} else {
			rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array();
		}
		let bitFlag = BITFLAG_LANG_ENCODING_FLAG;
		if (dataDescriptor) {
			bitFlag = bitFlag | BITFLAG_DATA_DESCRIPTOR;
		}
		let compressionMethod = COMPRESSION_METHOD_STORE;
		if (compressed) {
			compressionMethod = COMPRESSION_METHOD_DEFLATE;
		}
		let version = options.version || VERSION_DEFLATE;
		if (zip64) {
			version = version > VERSION_ZIP64 ? version : VERSION_ZIP64;
		}
		if (encrypted) {
			bitFlag = bitFlag | BITFLAG_ENCRYPTED;
			if (!zipCrypto) {
				version = version > VERSION_AES ? version : VERSION_AES;
				compressionMethod = COMPRESSION_METHOD_AES;
				if (compressed) {
					rawExtraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
				}
			}
		}
		const headerArray = new Uint8Array(26);
		const headerView = getDataView(headerArray);
		setUint16(headerView, 0, version);
		setUint16(headerView, 2, bitFlag);
		setUint16(headerView, 4, compressionMethod);
		const dateArray = new Uint32Array(1);
		const dateView = getDataView(dateArray);
		let lastModDateMsDos;
		if (lastModDate < MIN_DATE) {
			lastModDateMsDos = MIN_DATE;
		} else if (lastModDate > MAX_DATE) {
			lastModDateMsDos = MAX_DATE;
		} else {
			lastModDateMsDos = lastModDate;
		}
		setUint16(dateView, 0, (((lastModDateMsDos.getHours() << 6) | lastModDateMsDos.getMinutes()) << 5) | lastModDateMsDos.getSeconds() / 2);
		setUint16(dateView, 2, ((((lastModDateMsDos.getFullYear() - 1980) << 4) | (lastModDateMsDos.getMonth() + 1)) << 5) | lastModDateMsDos.getDate());
		const rawLastModDate = dateArray[0];
		setUint32(headerView, 6, rawLastModDate);
		setUint16(headerView, 22, getLength(rawFilename));
		const extraFieldLength = getLength(rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField);
		setUint16(headerView, 24, extraFieldLength);
		const localHeaderArray = new Uint8Array(30 + getLength(rawFilename) + extraFieldLength);
		const localHeaderView = getDataView(localHeaderArray);
		setUint32(localHeaderView, 0, LOCAL_FILE_HEADER_SIGNATURE);
		arraySet(localHeaderArray, headerArray, 4);
		arraySet(localHeaderArray, rawFilename, 30);
		arraySet(localHeaderArray, rawExtraFieldAES, 30 + getLength(rawFilename));
		arraySet(localHeaderArray, rawExtraFieldExtendedTimestamp, 30 + getLength(rawFilename, rawExtraFieldAES));
		arraySet(localHeaderArray, rawExtraFieldNTFS, 30 + getLength(rawFilename, rawExtraFieldAES, rawExtraFieldExtendedTimestamp));
		arraySet(localHeaderArray, rawExtraField, 30 + getLength(rawFilename, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS));
		return {
			localHeaderArray,
			headerArray,
			headerView,
			lastModDate,
			rawLastModDate,
			encrypted,
			compressed,
			version,
			compressionMethod,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldAES
		};
	}

	function getDataDescriptorInfo(options) {
		const {
			zip64,
			dataDescriptor,
			dataDescriptorSignature
		} = options;
		let dataDescriptorArray = new Uint8Array();
		let dataDescriptorView, dataDescriptorOffset = 0;
		if (dataDescriptor) {
			dataDescriptorArray = new Uint8Array(zip64 ? (dataDescriptorSignature ? 24 : 20) : (dataDescriptorSignature ? 16 : 12));
			dataDescriptorView = getDataView(dataDescriptorArray);
			if (dataDescriptorSignature) {
				dataDescriptorOffset = 4;
				setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
			}
		}
		return {
			dataDescriptorArray,
			dataDescriptorView,
			dataDescriptorOffset
		};
	}

	function setEntryInfo(entryInfo, options) {
		const {
			signature,
			rawExtraFieldZip64,
			compressedSize,
			uncompressedSize,
			headerInfo,
			dataDescriptorInfo
		} = entryInfo;
		const {
			headerView,
			encrypted
		} = headerInfo;
		const {
			dataDescriptorView,
			dataDescriptorOffset
		} = dataDescriptorInfo;
		const {
			zip64,
			zipCrypto,
			dataDescriptor
		} = options;
		if ((!encrypted || zipCrypto) && signature !== UNDEFINED_VALUE) {
			setUint32(headerView, 10, signature);
			if (dataDescriptor) {
				setUint32(dataDescriptorView, dataDescriptorOffset, signature);
			}
		}
		if (zip64) {
			const rawExtraFieldZip64View = getDataView(rawExtraFieldZip64);
			setUint16(rawExtraFieldZip64View, 0, EXTRAFIELD_TYPE_ZIP64);
			setUint16(rawExtraFieldZip64View, 2, EXTRAFIELD_LENGTH_ZIP64);
			setUint32(headerView, 14, MAX_32_BITS);
			setBigUint64(rawExtraFieldZip64View, 12, BigInt(compressedSize));
			setUint32(headerView, 18, MAX_32_BITS);
			setBigUint64(rawExtraFieldZip64View, 4, BigInt(uncompressedSize));
			if (dataDescriptor) {
				setBigUint64(dataDescriptorView, dataDescriptorOffset + 4, BigInt(compressedSize));
				setBigUint64(dataDescriptorView, dataDescriptorOffset + 12, BigInt(uncompressedSize));
			}
		} else {
			setUint32(headerView, 14, compressedSize);
			setUint32(headerView, 18, uncompressedSize);
			if (dataDescriptor) {
				setUint32(dataDescriptorView, dataDescriptorOffset + 4, compressedSize);
				setUint32(dataDescriptorView, dataDescriptorOffset + 8, uncompressedSize);
			}
		}
	}

	async function closeFile(zipWriter, comment, options) {
		const { files } = zipWriter;
		let offset = 0;
		let directoryDataLength = 0;
		let directoryOffset = zipWriter.offset;
		let filesLength = files.size;
		for (const [, {
			rawFilename,
			rawExtraFieldZip64,
			rawExtraFieldAES,
			rawExtraField,
			rawComment,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS
		}] of files) {
			directoryDataLength += 46 +
				getLength(
					rawFilename,
					rawComment,
					rawExtraFieldZip64,
					rawExtraFieldAES,
					rawExtraFieldExtendedTimestamp,
					rawExtraFieldNTFS,
					rawExtraField);
		}
		let zip64 = options.zip64 || zipWriter.options.zip64 || false;
		if (directoryOffset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS) {
			if (options.zip64 === false || zipWriter.options.zip64 === false) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			} else {
				zip64 = true;
			}
		}
		const directoryArray = new Uint8Array(directoryDataLength + (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH));
		const directoryView = getDataView(directoryArray);
		for (const [indexFileEntry, fileEntry] of Array.from(files.values()).entries()) {
			const {
				offset: fileEntryOffset,
				rawFilename,
				rawExtraFieldZip64,
				rawExtraFieldAES,
				rawExtraFieldNTFS,
				rawExtraField,
				rawComment,
				versionMadeBy,
				headerArray,
				directory,
				zip64,
				msDosCompatible,
				internalFileAttribute,
				externalFileAttribute,
				extendedTimestamp,
				lastModDate
			} = fileEntry;
			let rawExtraFieldExtendedTimestamp;
			if (extendedTimestamp) {
				rawExtraFieldExtendedTimestamp = new Uint8Array(9);
				const extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
				setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
				setUint16(extraFieldExtendedTimestampView, 2, getLength(rawExtraFieldExtendedTimestamp) - 4);
				setUint8(extraFieldExtendedTimestampView, 4, 0x1);
				setUint32(extraFieldExtendedTimestampView, 5, Math.floor(lastModDate.getTime() / 1000));
			} else {
				rawExtraFieldExtendedTimestamp = new Uint8Array();
			}
			const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField);
			setUint32(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
			setUint16(directoryView, offset + 4, versionMadeBy);
			arraySet(directoryArray, headerArray, offset + 6);
			setUint16(directoryView, offset + 30, extraFieldLength);
			setUint16(directoryView, offset + 32, getLength(rawComment));
			setUint16(directoryView, offset + 36, internalFileAttribute);
			if (externalFileAttribute) {
				setUint32(directoryView, offset + 38, externalFileAttribute);
			} else if (directory && msDosCompatible) {
				setUint8(directoryView, offset + 38, FILE_ATTR_MSDOS_DIR_MASK);
			}
			if (zip64) {
				setUint32(directoryView, offset + 42, MAX_32_BITS);
			} else {
				setUint32(directoryView, offset + 42, fileEntryOffset);
			}
			arraySet(directoryArray, rawFilename, offset + 46);
			arraySet(directoryArray, rawExtraFieldZip64, offset + 46 + getLength(rawFilename));
			arraySet(directoryArray, rawExtraFieldAES, offset + 46 + getLength(rawFilename, rawExtraFieldZip64));
			arraySet(directoryArray, rawExtraFieldExtendedTimestamp, offset + 46 + getLength(rawFilename, rawExtraFieldZip64, rawExtraFieldAES));
			arraySet(directoryArray, rawExtraFieldNTFS, offset + 46 + getLength(rawFilename, rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp));
			arraySet(directoryArray, rawExtraField, offset + 46 + getLength(rawFilename, rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS));
			arraySet(directoryArray, rawComment, offset + 46 + getLength(rawFilename) + extraFieldLength);
			offset += 46 + getLength(rawFilename, rawComment) + extraFieldLength;
			if (options.onprogress) {
				try {
					await options.onprogress(indexFileEntry + 1, files.size, new Entry(fileEntry));
				} catch (_error) {
					// ignored
				}
			}
		}
		if (zip64) {
			setUint32(directoryView, offset, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
			setBigUint64(directoryView, offset + 4, BigInt(44));
			setUint16(directoryView, offset + 12, 45);
			setUint16(directoryView, offset + 14, 45);
			setBigUint64(directoryView, offset + 24, BigInt(filesLength));
			setBigUint64(directoryView, offset + 32, BigInt(filesLength));
			setBigUint64(directoryView, offset + 40, BigInt(directoryDataLength));
			setBigUint64(directoryView, offset + 48, BigInt(directoryOffset));
			setUint32(directoryView, offset + 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
			setBigUint64(directoryView, offset + 64, BigInt(directoryOffset) + BigInt(directoryDataLength));
			setUint32(directoryView, offset + 72, ZIP64_TOTAL_NUMBER_OF_DISKS);
			filesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			directoryDataLength = MAX_32_BITS;
			offset += 76;
		}
		setUint32(directoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
		setUint16(directoryView, offset + 8, filesLength);
		setUint16(directoryView, offset + 10, filesLength);
		setUint32(directoryView, offset + 12, directoryDataLength);
		setUint32(directoryView, offset + 16, directoryOffset);
		const commentLength = getLength(comment);
		if (commentLength) {
			if (commentLength <= MAX_16_BITS) {
				setUint16(directoryView, offset + 20, commentLength);
			} else {
				throw new Error(ERR_INVALID_COMMENT);
			}
		}
		const { writable } = zipWriter.writer;
		await initStream(zipWriter.writer);
		await writeData(writable, directoryArray);
		if (commentLength) {
			await writeData(writable, comment);
		}
	}

	function sliceAsArrayBuffer(blob, start, end) {
		if (start || end) {
			return blob.slice(start, end).arrayBuffer();
		} else {
			return blob.arrayBuffer();
		}
	}

	async function writeData(writable, array) {
		const streamWriter = writable.getWriter();
		await streamWriter.ready;
		writable.size += getLength(array);
		await streamWriter.write(array);
		streamWriter.releaseLock();
	}

	function getTimeNTFS(date) {
		if (date) {
			return ((BigInt(date.getTime()) + BigInt(11644473600000)) * BigInt(10000));
		}
	}

	function getOptionValue(zipWriter, options, name) {
		return options[name] === UNDEFINED_VALUE ? zipWriter.options[name] : options[name];
	}

	function getMaximumCompressedSize(uncompressedSize) {
		return uncompressedSize + (5 * (Math.floor(uncompressedSize / 16383) + 1));
	}

	function setUint8(view, offset, value) {
		view.setUint8(offset, value);
	}

	function setUint16(view, offset, value) {
		view.setUint16(offset, value, true);
	}

	function setUint32(view, offset, value) {
		view.setUint32(offset, value, true);
	}

	function setBigUint64(view, offset, value) {
		view.setBigUint64(offset, value, true);
	}

	function arraySet(array, typedArray, offset) {
		array.set(typedArray, offset);
	}

	function getDataView(array) {
		return new DataView(array.buffer);
	}

	function getLength(...arrayLikes) {
		let result = 0;
		arrayLikes.forEach(arrayLike => arrayLike && (result += arrayLike.length));
		return result;
	}

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

	let baseURL;
	try {
		baseURL = (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('zip.js', document.baseURI).href));
	} catch (error) {
		// ignored
	}
	configure({ baseURL });
	e(configure);

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
	exports.ERR_INVALID_ENCRYPTION_STRENGTH = ERR_INVALID_ENCRYPTION_STRENGTH;
	exports.ERR_INVALID_ENTRY_COMMENT = ERR_INVALID_ENTRY_COMMENT;
	exports.ERR_INVALID_ENTRY_NAME = ERR_INVALID_ENTRY_NAME;
	exports.ERR_INVALID_EXTRAFIELD_DATA = ERR_INVALID_EXTRAFIELD_DATA;
	exports.ERR_INVALID_EXTRAFIELD_TYPE = ERR_INVALID_EXTRAFIELD_TYPE;
	exports.ERR_INVALID_PASSWORD = ERR_INVALID_PASSWORD;
	exports.ERR_INVALID_SIGNATURE = ERR_INVALID_SIGNATURE;
	exports.ERR_INVALID_VERSION = ERR_INVALID_VERSION;
	exports.ERR_LOCAL_FILE_HEADER_NOT_FOUND = ERR_LOCAL_FILE_HEADER_NOT_FOUND;
	exports.ERR_SPLIT_ZIP_FILE = ERR_SPLIT_ZIP_FILE;
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION;
	exports.ERR_UNSUPPORTED_ENCRYPTION = ERR_UNSUPPORTED_ENCRYPTION;
	exports.ERR_UNSUPPORTED_FORMAT = ERR_UNSUPPORTED_FORMAT;
	exports.HttpRangeReader = HttpRangeReader;
	exports.HttpReader = HttpReader;
	exports.Reader = Reader;
	exports.SplitZipReader = SplitZipReader;
	exports.TextReader = TextReader;
	exports.TextWriter = TextWriter;
	exports.Uint8ArrayReader = Uint8ArrayReader;
	exports.Uint8ArrayWriter = Uint8ArrayWriter;
	exports.Writer = Writer;
	exports.ZipReader = ZipReader;
	exports.ZipWriter = ZipWriter;
	exports.configure = configure;
	exports.getMimeType = getMimeType;
	exports.initShimAsyncCodec = initShimAsyncCodec;
	exports.initStream = initStream;
	exports.readUint8Array = readUint8Array;
	exports.terminateWorkers = terminateWorkers;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
