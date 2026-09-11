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
const SHA1_SCHEDULE_LENGTH = 16;
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
	const keystream = new Int32Array(BLOCK_LENGTH / 4);
	const hmac = createHmac(authenticationKey);
	let counter0 = 0;
	let counter1 = 0;
	let counter2 = 0;
	let counter3 = 0;
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
		counter0 = (counter0 + 1) | 0;
		if (!counter0) {
			counter1 = (counter1 + 1) | 0;
			if (!counter1) {
				counter2 = (counter2 + 1) | 0;
				if (!counter2) {
					counter3 = (counter3 + 1) | 0;
				}
			}
		}
		let s0 = swapBytes(counter0) ^ roundKeys[0];
		let s1 = swapBytes(counter1) ^ roundKeys[1];
		let s2 = swapBytes(counter2) ^ roundKeys[2];
		let s3 = swapBytes(counter3) ^ roundKeys[3];
		let t0 = T0[s0 >>> 24] ^ T1[(s1 >>> 16) & 255] ^ T2[(s2 >>> 8) & 255] ^ T3[s3 & 255] ^ roundKeys[4];
		let t1 = T0[s1 >>> 24] ^ T1[(s2 >>> 16) & 255] ^ T2[(s3 >>> 8) & 255] ^ T3[s0 & 255] ^ roundKeys[5];
		let t2 = T0[s2 >>> 24] ^ T1[(s3 >>> 16) & 255] ^ T2[(s0 >>> 8) & 255] ^ T3[s1 & 255] ^ roundKeys[6];
		let t3 = T0[s3 >>> 24] ^ T1[(s0 >>> 16) & 255] ^ T2[(s1 >>> 8) & 255] ^ T3[s2 & 255] ^ roundKeys[7];
		s0 = T0[t0 >>> 24] ^ T1[(t1 >>> 16) & 255] ^ T2[(t2 >>> 8) & 255] ^ T3[t3 & 255] ^ roundKeys[8];
		s1 = T0[t1 >>> 24] ^ T1[(t2 >>> 16) & 255] ^ T2[(t3 >>> 8) & 255] ^ T3[t0 & 255] ^ roundKeys[9];
		s2 = T0[t2 >>> 24] ^ T1[(t3 >>> 16) & 255] ^ T2[(t0 >>> 8) & 255] ^ T3[t1 & 255] ^ roundKeys[10];
		s3 = T0[t3 >>> 24] ^ T1[(t0 >>> 16) & 255] ^ T2[(t1 >>> 8) & 255] ^ T3[t2 & 255] ^ roundKeys[11];
		t0 = T0[s0 >>> 24] ^ T1[(s1 >>> 16) & 255] ^ T2[(s2 >>> 8) & 255] ^ T3[s3 & 255] ^ roundKeys[12];
		t1 = T0[s1 >>> 24] ^ T1[(s2 >>> 16) & 255] ^ T2[(s3 >>> 8) & 255] ^ T3[s0 & 255] ^ roundKeys[13];
		t2 = T0[s2 >>> 24] ^ T1[(s3 >>> 16) & 255] ^ T2[(s0 >>> 8) & 255] ^ T3[s1 & 255] ^ roundKeys[14];
		t3 = T0[s3 >>> 24] ^ T1[(s0 >>> 16) & 255] ^ T2[(s1 >>> 8) & 255] ^ T3[s2 & 255] ^ roundKeys[15];
		s0 = T0[t0 >>> 24] ^ T1[(t1 >>> 16) & 255] ^ T2[(t2 >>> 8) & 255] ^ T3[t3 & 255] ^ roundKeys[16];
		s1 = T0[t1 >>> 24] ^ T1[(t2 >>> 16) & 255] ^ T2[(t3 >>> 8) & 255] ^ T3[t0 & 255] ^ roundKeys[17];
		s2 = T0[t2 >>> 24] ^ T1[(t3 >>> 16) & 255] ^ T2[(t0 >>> 8) & 255] ^ T3[t1 & 255] ^ roundKeys[18];
		s3 = T0[t3 >>> 24] ^ T1[(t0 >>> 16) & 255] ^ T2[(t1 >>> 8) & 255] ^ T3[t2 & 255] ^ roundKeys[19];
		t0 = T0[s0 >>> 24] ^ T1[(s1 >>> 16) & 255] ^ T2[(s2 >>> 8) & 255] ^ T3[s3 & 255] ^ roundKeys[20];
		t1 = T0[s1 >>> 24] ^ T1[(s2 >>> 16) & 255] ^ T2[(s3 >>> 8) & 255] ^ T3[s0 & 255] ^ roundKeys[21];
		t2 = T0[s2 >>> 24] ^ T1[(s3 >>> 16) & 255] ^ T2[(s0 >>> 8) & 255] ^ T3[s1 & 255] ^ roundKeys[22];
		t3 = T0[s3 >>> 24] ^ T1[(s0 >>> 16) & 255] ^ T2[(s1 >>> 8) & 255] ^ T3[s2 & 255] ^ roundKeys[23];
		s0 = T0[t0 >>> 24] ^ T1[(t1 >>> 16) & 255] ^ T2[(t2 >>> 8) & 255] ^ T3[t3 & 255] ^ roundKeys[24];
		s1 = T0[t1 >>> 24] ^ T1[(t2 >>> 16) & 255] ^ T2[(t3 >>> 8) & 255] ^ T3[t0 & 255] ^ roundKeys[25];
		s2 = T0[t2 >>> 24] ^ T1[(t3 >>> 16) & 255] ^ T2[(t0 >>> 8) & 255] ^ T3[t1 & 255] ^ roundKeys[26];
		s3 = T0[t3 >>> 24] ^ T1[(t0 >>> 16) & 255] ^ T2[(t1 >>> 8) & 255] ^ T3[t2 & 255] ^ roundKeys[27];
		t0 = T0[s0 >>> 24] ^ T1[(s1 >>> 16) & 255] ^ T2[(s2 >>> 8) & 255] ^ T3[s3 & 255] ^ roundKeys[28];
		t1 = T0[s1 >>> 24] ^ T1[(s2 >>> 16) & 255] ^ T2[(s3 >>> 8) & 255] ^ T3[s0 & 255] ^ roundKeys[29];
		t2 = T0[s2 >>> 24] ^ T1[(s3 >>> 16) & 255] ^ T2[(s0 >>> 8) & 255] ^ T3[s1 & 255] ^ roundKeys[30];
		t3 = T0[s3 >>> 24] ^ T1[(s0 >>> 16) & 255] ^ T2[(s1 >>> 8) & 255] ^ T3[s2 & 255] ^ roundKeys[31];
		s0 = T0[t0 >>> 24] ^ T1[(t1 >>> 16) & 255] ^ T2[(t2 >>> 8) & 255] ^ T3[t3 & 255] ^ roundKeys[32];
		s1 = T0[t1 >>> 24] ^ T1[(t2 >>> 16) & 255] ^ T2[(t3 >>> 8) & 255] ^ T3[t0 & 255] ^ roundKeys[33];
		s2 = T0[t2 >>> 24] ^ T1[(t3 >>> 16) & 255] ^ T2[(t0 >>> 8) & 255] ^ T3[t1 & 255] ^ roundKeys[34];
		s3 = T0[t3 >>> 24] ^ T1[(t0 >>> 16) & 255] ^ T2[(t1 >>> 8) & 255] ^ T3[t2 & 255] ^ roundKeys[35];
		t0 = T0[s0 >>> 24] ^ T1[(s1 >>> 16) & 255] ^ T2[(s2 >>> 8) & 255] ^ T3[s3 & 255] ^ roundKeys[36];
		t1 = T0[s1 >>> 24] ^ T1[(s2 >>> 16) & 255] ^ T2[(s3 >>> 8) & 255] ^ T3[s0 & 255] ^ roundKeys[37];
		t2 = T0[s2 >>> 24] ^ T1[(s3 >>> 16) & 255] ^ T2[(s0 >>> 8) & 255] ^ T3[s1 & 255] ^ roundKeys[38];
		t3 = T0[s3 >>> 24] ^ T1[(s0 >>> 16) & 255] ^ T2[(s1 >>> 8) & 255] ^ T3[s2 & 255] ^ roundKeys[39];
		let indexKey = 40;
		if (rounds > 10) {
			s0 = T0[t0 >>> 24] ^ T1[(t1 >>> 16) & 255] ^ T2[(t2 >>> 8) & 255] ^ T3[t3 & 255] ^ roundKeys[40];
			s1 = T0[t1 >>> 24] ^ T1[(t2 >>> 16) & 255] ^ T2[(t3 >>> 8) & 255] ^ T3[t0 & 255] ^ roundKeys[41];
			s2 = T0[t2 >>> 24] ^ T1[(t3 >>> 16) & 255] ^ T2[(t0 >>> 8) & 255] ^ T3[t1 & 255] ^ roundKeys[42];
			s3 = T0[t3 >>> 24] ^ T1[(t0 >>> 16) & 255] ^ T2[(t1 >>> 8) & 255] ^ T3[t2 & 255] ^ roundKeys[43];
			t0 = T0[s0 >>> 24] ^ T1[(s1 >>> 16) & 255] ^ T2[(s2 >>> 8) & 255] ^ T3[s3 & 255] ^ roundKeys[44];
			t1 = T0[s1 >>> 24] ^ T1[(s2 >>> 16) & 255] ^ T2[(s3 >>> 8) & 255] ^ T3[s0 & 255] ^ roundKeys[45];
			t2 = T0[s2 >>> 24] ^ T1[(s3 >>> 16) & 255] ^ T2[(s0 >>> 8) & 255] ^ T3[s1 & 255] ^ roundKeys[46];
			t3 = T0[s3 >>> 24] ^ T1[(s0 >>> 16) & 255] ^ T2[(s1 >>> 8) & 255] ^ T3[s2 & 255] ^ roundKeys[47];
			indexKey = 48;
		}
		if (rounds > 12) {
			s0 = T0[t0 >>> 24] ^ T1[(t1 >>> 16) & 255] ^ T2[(t2 >>> 8) & 255] ^ T3[t3 & 255] ^ roundKeys[48];
			s1 = T0[t1 >>> 24] ^ T1[(t2 >>> 16) & 255] ^ T2[(t3 >>> 8) & 255] ^ T3[t0 & 255] ^ roundKeys[49];
			s2 = T0[t2 >>> 24] ^ T1[(t3 >>> 16) & 255] ^ T2[(t0 >>> 8) & 255] ^ T3[t1 & 255] ^ roundKeys[50];
			s3 = T0[t3 >>> 24] ^ T1[(t0 >>> 16) & 255] ^ T2[(t1 >>> 8) & 255] ^ T3[t2 & 255] ^ roundKeys[51];
			t0 = T0[s0 >>> 24] ^ T1[(s1 >>> 16) & 255] ^ T2[(s2 >>> 8) & 255] ^ T3[s3 & 255] ^ roundKeys[52];
			t1 = T0[s1 >>> 24] ^ T1[(s2 >>> 16) & 255] ^ T2[(s3 >>> 8) & 255] ^ T3[s0 & 255] ^ roundKeys[53];
			t2 = T0[s2 >>> 24] ^ T1[(s3 >>> 16) & 255] ^ T2[(s0 >>> 8) & 255] ^ T3[s1 & 255] ^ roundKeys[54];
			t3 = T0[s3 >>> 24] ^ T1[(s0 >>> 16) & 255] ^ T2[(s1 >>> 8) & 255] ^ T3[s2 & 255] ^ roundKeys[55];
			indexKey = 56;
		}
		keystream[0] = ((S_BOX[t0 >>> 24] << 24) | (S_BOX[(t1 >>> 16) & 255] << 16) | (S_BOX[(t2 >>> 8) & 255] << 8) | S_BOX[t3 & 255]) ^ roundKeys[indexKey];
		keystream[1] = ((S_BOX[t1 >>> 24] << 24) | (S_BOX[(t2 >>> 16) & 255] << 16) | (S_BOX[(t3 >>> 8) & 255] << 8) | S_BOX[t0 & 255]) ^ roundKeys[indexKey + 1];
		keystream[2] = ((S_BOX[t2 >>> 24] << 24) | (S_BOX[(t3 >>> 16) & 255] << 16) | (S_BOX[(t0 >>> 8) & 255] << 8) | S_BOX[t1 & 255]) ^ roundKeys[indexKey + 2];
		keystream[3] = ((S_BOX[t3 >>> 24] << 24) | (S_BOX[(t0 >>> 16) & 255] << 16) | (S_BOX[(t1 >>> 8) & 255] << 8) | S_BOX[t2 & 255]) ^ roundKeys[indexKey + 3];
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
		let a = state[0];
		let b = state[1];
		let c = state[2];
		let d = state[3];
		let e = state[4];
		let t;
		for (let index = 0; index < 15; index += 5) {
			e = (((a << 5) | (a >>> 27)) + (((c ^ d) & b) ^ d) + e + 0x5A827999 + schedule[index]) | 0;
			b = (b << 30) | (b >>> 2);
			d = (((e << 5) | (e >>> 27)) + (((b ^ c) & a) ^ c) + d + 0x5A827999 + schedule[index + 1]) | 0;
			a = (a << 30) | (a >>> 2);
			c = (((d << 5) | (d >>> 27)) + (((a ^ b) & e) ^ b) + c + 0x5A827999 + schedule[index + 2]) | 0;
			e = (e << 30) | (e >>> 2);
			b = (((c << 5) | (c >>> 27)) + (((e ^ a) & d) ^ a) + b + 0x5A827999 + schedule[index + 3]) | 0;
			d = (d << 30) | (d >>> 2);
			a = (((b << 5) | (b >>> 27)) + (((d ^ e) & c) ^ e) + a + 0x5A827999 + schedule[index + 4]) | 0;
			c = (c << 30) | (c >>> 2);
		}
		e = (((a << 5) | (a >>> 27)) + (((c ^ d) & b) ^ d) + e + 0x5A827999 + schedule[15]) | 0;
		b = (b << 30) | (b >>> 2);
		t = schedule[13] ^ schedule[8] ^ schedule[2] ^ schedule[0];
		t = (t << 1) | (t >>> 31);
		schedule[0] = t;
		d = (((e << 5) | (e >>> 27)) + (((b ^ c) & a) ^ c) + d + 0x5A827999 + t) | 0;
		a = (a << 30) | (a >>> 2);
		t = schedule[14] ^ schedule[9] ^ schedule[3] ^ schedule[1];
		t = (t << 1) | (t >>> 31);
		schedule[1] = t;
		c = (((d << 5) | (d >>> 27)) + (((a ^ b) & e) ^ b) + c + 0x5A827999 + t) | 0;
		e = (e << 30) | (e >>> 2);
		t = schedule[15] ^ schedule[10] ^ schedule[4] ^ schedule[2];
		t = (t << 1) | (t >>> 31);
		schedule[2] = t;
		b = (((c << 5) | (c >>> 27)) + (((e ^ a) & d) ^ a) + b + 0x5A827999 + t) | 0;
		d = (d << 30) | (d >>> 2);
		t = schedule[0] ^ schedule[11] ^ schedule[5] ^ schedule[3];
		t = (t << 1) | (t >>> 31);
		schedule[3] = t;
		a = (((b << 5) | (b >>> 27)) + (((d ^ e) & c) ^ e) + a + 0x5A827999 + t) | 0;
		c = (c << 30) | (c >>> 2);
		for (let index = 20; index < 40; index += 5) {
			t = schedule[(index - 3) & 15] ^ schedule[(index - 8) & 15] ^ schedule[(index - 14) & 15] ^ schedule[(index) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index) & 15] = t;
			e = (((a << 5) | (a >>> 27)) + (b ^ c ^ d) + e + 0x6ED9EBA1 + t) | 0;
			b = (b << 30) | (b >>> 2);
			t = schedule[(index - 2) & 15] ^ schedule[(index - 7) & 15] ^ schedule[(index - 13) & 15] ^ schedule[(index + 1) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 1) & 15] = t;
			d = (((e << 5) | (e >>> 27)) + (a ^ b ^ c) + d + 0x6ED9EBA1 + t) | 0;
			a = (a << 30) | (a >>> 2);
			t = schedule[(index - 1) & 15] ^ schedule[(index - 6) & 15] ^ schedule[(index - 12) & 15] ^ schedule[(index + 2) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 2) & 15] = t;
			c = (((d << 5) | (d >>> 27)) + (e ^ a ^ b) + c + 0x6ED9EBA1 + t) | 0;
			e = (e << 30) | (e >>> 2);
			t = schedule[(index) & 15] ^ schedule[(index - 5) & 15] ^ schedule[(index - 11) & 15] ^ schedule[(index + 3) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 3) & 15] = t;
			b = (((c << 5) | (c >>> 27)) + (d ^ e ^ a) + b + 0x6ED9EBA1 + t) | 0;
			d = (d << 30) | (d >>> 2);
			t = schedule[(index + 1) & 15] ^ schedule[(index - 4) & 15] ^ schedule[(index - 10) & 15] ^ schedule[(index + 4) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 4) & 15] = t;
			a = (((b << 5) | (b >>> 27)) + (c ^ d ^ e) + a + 0x6ED9EBA1 + t) | 0;
			c = (c << 30) | (c >>> 2);
		}
		for (let index = 40; index < 60; index += 5) {
			t = schedule[(index - 3) & 15] ^ schedule[(index - 8) & 15] ^ schedule[(index - 14) & 15] ^ schedule[(index) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index) & 15] = t;
			e = (((a << 5) | (a >>> 27)) + ((b & c) | ((b | c) & d)) + e + 0x8F1BBCDC + t) | 0;
			b = (b << 30) | (b >>> 2);
			t = schedule[(index - 2) & 15] ^ schedule[(index - 7) & 15] ^ schedule[(index - 13) & 15] ^ schedule[(index + 1) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 1) & 15] = t;
			d = (((e << 5) | (e >>> 27)) + ((a & b) | ((a | b) & c)) + d + 0x8F1BBCDC + t) | 0;
			a = (a << 30) | (a >>> 2);
			t = schedule[(index - 1) & 15] ^ schedule[(index - 6) & 15] ^ schedule[(index - 12) & 15] ^ schedule[(index + 2) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 2) & 15] = t;
			c = (((d << 5) | (d >>> 27)) + ((e & a) | ((e | a) & b)) + c + 0x8F1BBCDC + t) | 0;
			e = (e << 30) | (e >>> 2);
			t = schedule[(index) & 15] ^ schedule[(index - 5) & 15] ^ schedule[(index - 11) & 15] ^ schedule[(index + 3) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 3) & 15] = t;
			b = (((c << 5) | (c >>> 27)) + ((d & e) | ((d | e) & a)) + b + 0x8F1BBCDC + t) | 0;
			d = (d << 30) | (d >>> 2);
			t = schedule[(index + 1) & 15] ^ schedule[(index - 4) & 15] ^ schedule[(index - 10) & 15] ^ schedule[(index + 4) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 4) & 15] = t;
			a = (((b << 5) | (b >>> 27)) + ((c & d) | ((c | d) & e)) + a + 0x8F1BBCDC + t) | 0;
			c = (c << 30) | (c >>> 2);
		}
		for (let index = 60; index < 80; index += 5) {
			t = schedule[(index - 3) & 15] ^ schedule[(index - 8) & 15] ^ schedule[(index - 14) & 15] ^ schedule[(index) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index) & 15] = t;
			e = (((a << 5) | (a >>> 27)) + (b ^ c ^ d) + e + 0xCA62C1D6 + t) | 0;
			b = (b << 30) | (b >>> 2);
			t = schedule[(index - 2) & 15] ^ schedule[(index - 7) & 15] ^ schedule[(index - 13) & 15] ^ schedule[(index + 1) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 1) & 15] = t;
			d = (((e << 5) | (e >>> 27)) + (a ^ b ^ c) + d + 0xCA62C1D6 + t) | 0;
			a = (a << 30) | (a >>> 2);
			t = schedule[(index - 1) & 15] ^ schedule[(index - 6) & 15] ^ schedule[(index - 12) & 15] ^ schedule[(index + 2) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 2) & 15] = t;
			c = (((d << 5) | (d >>> 27)) + (e ^ a ^ b) + c + 0xCA62C1D6 + t) | 0;
			e = (e << 30) | (e >>> 2);
			t = schedule[(index) & 15] ^ schedule[(index - 5) & 15] ^ schedule[(index - 11) & 15] ^ schedule[(index + 3) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 3) & 15] = t;
			b = (((c << 5) | (c >>> 27)) + (d ^ e ^ a) + b + 0xCA62C1D6 + t) | 0;
			d = (d << 30) | (d >>> 2);
			t = schedule[(index + 1) & 15] ^ schedule[(index - 4) & 15] ^ schedule[(index - 10) & 15] ^ schedule[(index + 4) & 15];
			t = (t << 1) | (t >>> 31);
			schedule[(index + 4) & 15] = t;
			a = (((b << 5) | (b >>> 27)) + (c ^ d ^ e) + a + 0xCA62C1D6 + t) | 0;
			c = (c << 30) | (c >>> 2);
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

function swapBytes(value) {
	return (value << 24) | ((value & 0xff00) << 8) | ((value >>> 8) & 0xff00) | (value >>> 24);
}

function multiplyByTwo(value) {
	return ((value << 1) ^ ((value >> 7) * 0x1b)) & 255;
}
