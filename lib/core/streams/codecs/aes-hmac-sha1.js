/*
 Copyright (c) 2026 Gildas Lormeau. All rights reserved.

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
const ROUND_KEYS_LENGTH = 60;
const SHA1_BLOCK_LENGTH = 64;
const SHA1_DIGEST_LENGTH = 20;
const SHA1_SCHEDULE_LENGTH = 80;
const SHA1_LENGTH_OFFSET = 56;
const SHA1_PADDING = new Uint8Array([0x80]);
const SHA1_ZERO = new Uint8Array(1);
const SHA1_INITIAL_STATE = new Int32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
const HMAC_INNER_PADDING = 0x36;
const HMAC_OUTER_PADDING = 0x5c;
const S_BOX = new Uint8Array(256);
const T0 = new Int32Array(256);
const T1 = new Int32Array(256);
const T2 = new Int32Array(256);
const T3 = new Int32Array(256);

let tablesInitialized = false;

export {
	createEngine,
	pbkdf2
};

function createEngine(key, authenticationKey) {
	initTables();
	const roundKeys = new Int32Array(ROUND_KEYS_LENGTH);
	const rounds = expandKey(key, roundKeys);
	const counter = new Uint8Array(BLOCK_LENGTH);
	const keystream = new Int32Array(BLOCK_LENGTH / 4);
	const hmac = createHmac(authenticationKey);
	return {
		process(data, decrypt) {
			if (decrypt) {
				hmac.update(data, 0, data.length);
			}
			encrypt(data);
			if (!decrypt) {
				hmac.update(data, 0, data.length);
			}
		},
		digest() {
			return hmac.digest();
		}
	};

	function encrypt(data) {
		const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
		const length = data.length;
		let offset = 0;
		for (; offset + BLOCK_LENGTH <= length; offset += BLOCK_LENGTH) {
			nextKeystream();
			view.setInt32(offset, view.getInt32(offset) ^ keystream[0]);
			view.setInt32(offset + 4, view.getInt32(offset + 4) ^ keystream[1]);
			view.setInt32(offset + 8, view.getInt32(offset + 8) ^ keystream[2]);
			view.setInt32(offset + 12, view.getInt32(offset + 12) ^ keystream[3]);
		}
		if (offset < length) {
			nextKeystream();
			for (let indexByte = 0; offset < length; offset++, indexByte++) {
				data[offset] ^= keystream[indexByte >> 2] >>> (24 - 8 * (indexByte & 3));
			}
		}
	}

	function nextKeystream() {
		for (let indexByte = 0; indexByte < BLOCK_LENGTH; indexByte++) {
			counter[indexByte]++;
			if (counter[indexByte] !== 0) {
				break;
			}
		}
		let s0 = ((counter[0] << 24) | (counter[1] << 16) | (counter[2] << 8) | counter[3]) ^ roundKeys[0];
		let s1 = ((counter[4] << 24) | (counter[5] << 16) | (counter[6] << 8) | counter[7]) ^ roundKeys[1];
		let s2 = ((counter[8] << 24) | (counter[9] << 16) | (counter[10] << 8) | counter[11]) ^ roundKeys[2];
		let s3 = ((counter[12] << 24) | (counter[13] << 16) | (counter[14] << 8) | counter[15]) ^ roundKeys[3];
		let indexKey = 4;
		for (let round = 1; round < rounds; round++, indexKey += 4) {
			const t0 = T0[s0 >>> 24] ^ T1[(s1 >>> 16) & 255] ^ T2[(s2 >>> 8) & 255] ^ T3[s3 & 255] ^ roundKeys[indexKey];
			const t1 = T0[s1 >>> 24] ^ T1[(s2 >>> 16) & 255] ^ T2[(s3 >>> 8) & 255] ^ T3[s0 & 255] ^ roundKeys[indexKey + 1];
			const t2 = T0[s2 >>> 24] ^ T1[(s3 >>> 16) & 255] ^ T2[(s0 >>> 8) & 255] ^ T3[s1 & 255] ^ roundKeys[indexKey + 2];
			const t3 = T0[s3 >>> 24] ^ T1[(s0 >>> 16) & 255] ^ T2[(s1 >>> 8) & 255] ^ T3[s2 & 255] ^ roundKeys[indexKey + 3];
			s0 = t0;
			s1 = t1;
			s2 = t2;
			s3 = t3;
		}
		keystream[0] = ((S_BOX[s0 >>> 24] << 24) | (S_BOX[(s1 >>> 16) & 255] << 16) | (S_BOX[(s2 >>> 8) & 255] << 8) | S_BOX[s3 & 255]) ^ roundKeys[indexKey];
		keystream[1] = ((S_BOX[s1 >>> 24] << 24) | (S_BOX[(s2 >>> 16) & 255] << 16) | (S_BOX[(s3 >>> 8) & 255] << 8) | S_BOX[s0 & 255]) ^ roundKeys[indexKey + 1];
		keystream[2] = ((S_BOX[s2 >>> 24] << 24) | (S_BOX[(s3 >>> 16) & 255] << 16) | (S_BOX[(s0 >>> 8) & 255] << 8) | S_BOX[s1 & 255]) ^ roundKeys[indexKey + 2];
		keystream[3] = ((S_BOX[s3 >>> 24] << 24) | (S_BOX[(s0 >>> 16) & 255] << 16) | (S_BOX[(s1 >>> 8) & 255] << 8) | S_BOX[s2 & 255]) ^ roundKeys[indexKey + 3];
	}
}

function pbkdf2(password, salt, iterations, length) {
	const hmac = createHmac(password);
	const result = new Uint8Array(length);
	const block = new Uint8Array(salt.length + 4);
	const blockView = new DataView(block.buffer);
	block.set(salt);
	for (let indexBlock = 1, offset = 0; offset < length; indexBlock++, offset += SHA1_DIGEST_LENGTH) {
		blockView.setUint32(salt.length, indexBlock);
		hmac.update(block, 0, block.length);
		let previous = hmac.digest();
		const output = previous.slice();
		for (let iteration = 1; iteration < iterations; iteration++) {
			hmac.update(previous, 0, SHA1_DIGEST_LENGTH);
			previous = hmac.digest();
			for (let indexByte = 0; indexByte < SHA1_DIGEST_LENGTH; indexByte++) {
				output[indexByte] ^= previous[indexByte];
			}
		}
		result.set(output.subarray(0, Math.min(SHA1_DIGEST_LENGTH, length - offset)), offset);
	}
	return result;
}

function createHmac(key) {
	const sha1 = createSha1();
	const innerKey = new Uint8Array(SHA1_BLOCK_LENGTH);
	const outerKey = new Uint8Array(SHA1_BLOCK_LENGTH);
	if (key.length > SHA1_BLOCK_LENGTH) {
		sha1.update(key, 0, key.length);
		key = sha1.digest();
	}
	for (let indexByte = 0; indexByte < SHA1_BLOCK_LENGTH; indexByte++) {
		const keyByte = indexByte < key.length ? key[indexByte] : 0;
		innerKey[indexByte] = keyByte ^ HMAC_INNER_PADDING;
		outerKey[indexByte] = keyByte ^ HMAC_OUTER_PADDING;
	}
	sha1.update(innerKey, 0, SHA1_BLOCK_LENGTH);
	return {
		update(data, offset, length) {
			sha1.update(data, offset, length);
		},
		digest() {
			const innerDigest = sha1.digest();
			sha1.update(outerKey, 0, SHA1_BLOCK_LENGTH);
			sha1.update(innerDigest, 0, SHA1_DIGEST_LENGTH);
			const result = sha1.digest();
			sha1.update(innerKey, 0, SHA1_BLOCK_LENGTH);
			return result;
		}
	};
}

function createSha1() {
	const state = new Int32Array(SHA1_INITIAL_STATE);
	const schedule = new Int32Array(SHA1_SCHEDULE_LENGTH);
	const block = new Uint8Array(SHA1_BLOCK_LENGTH);
	const blockView = new DataView(block.buffer);
	const lengthBytes = new Uint8Array(8);
	let blockLength = 0;
	let totalLength = 0;
	return {
		update,
		digest
	};

	function update(data, offset, length) {
		const end = offset + length;
		totalLength += length;
		if (blockLength) {
			while (offset < end && blockLength < SHA1_BLOCK_LENGTH) {
				block[blockLength++] = data[offset++];
			}
			if (blockLength == SHA1_BLOCK_LENGTH) {
				compress(blockView, 0);
				blockLength = 0;
			}
		}
		if (offset + SHA1_BLOCK_LENGTH <= end) {
			const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
			for (; offset + SHA1_BLOCK_LENGTH <= end; offset += SHA1_BLOCK_LENGTH) {
				compress(view, offset);
			}
		}
		while (offset < end) {
			block[blockLength++] = data[offset++];
		}
	}

	function digest() {
		const bits = totalLength * 8;
		const high = Math.floor(bits / 0x100000000);
		const low = bits >>> 0;
		update(SHA1_PADDING, 0, 1);
		while (blockLength != SHA1_LENGTH_OFFSET) {
			update(SHA1_ZERO, 0, 1);
		}
		lengthBytes[0] = high >>> 24;
		lengthBytes[1] = high >>> 16;
		lengthBytes[2] = high >>> 8;
		lengthBytes[3] = high;
		lengthBytes[4] = low >>> 24;
		lengthBytes[5] = low >>> 16;
		lengthBytes[6] = low >>> 8;
		lengthBytes[7] = low;
		update(lengthBytes, 0, 8);
		const result = new Uint8Array(SHA1_DIGEST_LENGTH);
		const resultView = new DataView(result.buffer);
		for (let indexWord = 0; indexWord < state.length; indexWord++) {
			resultView.setInt32(4 * indexWord, state[indexWord]);
		}
		state.set(SHA1_INITIAL_STATE);
		blockLength = 0;
		totalLength = 0;
		return result;
	}

	function compress(view, offset) {
		for (let index = 0; index < 16; index++) {
			schedule[index] = view.getInt32(offset + 4 * index);
		}
		for (let index = 16; index < SHA1_SCHEDULE_LENGTH; index++) {
			const word = schedule[index - 3] ^ schedule[index - 8] ^ schedule[index - 14] ^ schedule[index - 16];
			schedule[index] = (word << 1) | (word >>> 31);
		}
		let a = state[0];
		let b = state[1];
		let c = state[2];
		let d = state[3];
		let e = state[4];
		let t;
		for (let index = 0; index < 20; index++) {
			t = (((a << 5) | (a >>> 27)) + ((b & c) | (~b & d)) + e + 0x5A827999 + schedule[index]) | 0;
			e = d;
			d = c;
			c = (b << 30) | (b >>> 2);
			b = a;
			a = t;
		}
		for (let index = 20; index < 40; index++) {
			t = (((a << 5) | (a >>> 27)) + (b ^ c ^ d) + e + 0x6ED9EBA1 + schedule[index]) | 0;
			e = d;
			d = c;
			c = (b << 30) | (b >>> 2);
			b = a;
			a = t;
		}
		for (let index = 40; index < 60; index++) {
			t = (((a << 5) | (a >>> 27)) + ((b & c) | (b & d) | (c & d)) + e + 0x8F1BBCDC + schedule[index]) | 0;
			e = d;
			d = c;
			c = (b << 30) | (b >>> 2);
			b = a;
			a = t;
		}
		for (let index = 60; index < SHA1_SCHEDULE_LENGTH; index++) {
			t = (((a << 5) | (a >>> 27)) + (b ^ c ^ d) + e + 0xCA62C1D6 + schedule[index]) | 0;
			e = d;
			d = c;
			c = (b << 30) | (b >>> 2);
			b = a;
			a = t;
		}
		state[0] = (state[0] + a) | 0;
		state[1] = (state[1] + b) | 0;
		state[2] = (state[2] + c) | 0;
		state[3] = (state[3] + d) | 0;
		state[4] = (state[4] + e) | 0;
	}
}

function initTables() {
	if (!tablesInitialized) {
		let p = 1;
		let q = 1;
		do {
			p = (p ^ (p << 1) ^ ((p & 0x80) ? 0x1b : 0)) & 255;
			q = (q ^ (q << 1)) & 255;
			q = (q ^ (q << 2)) & 255;
			q = (q ^ (q << 4)) & 255;
			if (q & 0x80) {
				q ^= 0x09;
			}
			S_BOX[p] = (q ^ ((q << 1) | (q >> 7)) ^ ((q << 2) | (q >> 6)) ^ ((q << 3) | (q >> 5)) ^ ((q << 4) | (q >> 4)) ^ 0x63) & 255;
		} while (p != 1);
		S_BOX[0] = 0x63;
		for (let index = 0; index < 256; index++) {
			const s = S_BOX[index];
			const s2 = multiplyByTwo(s);
			const t = (s2 << 24) | (s << 16) | (s << 8) | (s2 ^ s);
			T0[index] = t;
			T1[index] = (t >>> 8) | (t << 24);
			T2[index] = (t >>> 16) | (t << 16);
			T3[index] = (t >>> 24) | (t << 8);
		}
		tablesInitialized = true;
	}
}

function expandKey(key, roundKeys) {
	const keyWords = key.length >> 2;
	const rounds = keyWords + 6;
	const total = 4 * (rounds + 1);
	let roundConstant = 1;
	for (let index = 0; index < keyWords; index++) {
		roundKeys[index] = (key[4 * index] << 24) | (key[4 * index + 1] << 16) | (key[4 * index + 2] << 8) | key[4 * index + 3];
	}
	for (let index = keyWords; index < total; index++) {
		let word = roundKeys[index - 1];
		if (index % keyWords == 0) {
			word = substituteWord((word << 8) | (word >>> 24)) ^ (roundConstant << 24);
			roundConstant = multiplyByTwo(roundConstant);
		} else if (keyWords > 6 && index % keyWords == 4) {
			word = substituteWord(word);
		}
		roundKeys[index] = roundKeys[index - keyWords] ^ word;
	}
	return rounds;
}

function substituteWord(word) {
	return (S_BOX[word >>> 24] << 24) | (S_BOX[(word >>> 16) & 255] << 16) | (S_BOX[(word >>> 8) & 255] << 8) | S_BOX[word & 255];
}

function multiplyByTwo(value) {
	return ((value << 1) ^ ((value >> 7) * 0x1b)) & 255;
}
