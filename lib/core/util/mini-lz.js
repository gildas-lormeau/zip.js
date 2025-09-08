/*
 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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

const BASE64_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function base64Decode(b64) {
	b64 = String(b64).replace(/[^A-Za-z0-9+/=]/g, "");
	const len = b64.length;
	const out = [];
	for (let i = 0; i < len; i += 4) {
		const a = BASE64_TABLE.indexOf(b64[i]);
		const b = BASE64_TABLE.indexOf(b64[i + 1]);
		const c = BASE64_TABLE.indexOf(b64[i + 2]);
		const d = BASE64_TABLE.indexOf(b64[i + 3]);
		const n = (a << 18) | (b << 12) | ((c & 63) << 6) | (d & 63);
		out.push((n >> 16) & 0xff);
		if (b64[i + 2] !== "=") {
			out.push((n >> 8) & 0xff);
		}
		if (b64[i + 3] !== "=") {
			out.push(n & 0xff);
		}
	}
	return new Uint8Array(out);
}

export function base64Encode(bytes) {
	let out = "";
	const len = bytes.length;
	let i = 0;
	for (; i + 2 < len; i += 3) {
		const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
		out += BASE64_TABLE[(n >> 18) & 63] + BASE64_TABLE[(n >> 12) & 63] + BASE64_TABLE[(n >> 6) & 63] + BASE64_TABLE[n & 63];
	}
	const rem = len - i;
	if (rem === 1) {
		const n = bytes[i] << 16;
		out += BASE64_TABLE[(n >> 18) & 63] + BASE64_TABLE[(n >> 12) & 63] + "==";
	} else if (rem === 2) {
		const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
		out += BASE64_TABLE[(n >> 18) & 63] + BASE64_TABLE[(n >> 12) & 63] + BASE64_TABLE[(n >> 6) & 63] + "=";
	}
	return out;
}

export function decompress(src) {
	src = base64Decode(src);
	let out = new Uint8Array(1024);
	let outLen = 0;
	for (let i = 0; i < src.length;) {
		const ctrl = src[i++];
		if ((ctrl & 0x80) === 0) {
			const L = ctrl;
			ensure(outLen + L);
			for (let j = 0; j < L && i < src.length; j++) {
				out[outLen++] = src[i++];
			}
		} else {
			const L = (ctrl & 0x7f) + 3;
			const off = (src[i++] << 8) | src[i++];
			const start = outLen - off;
			ensure(outLen + L);
			for (let k = 0; k < L; k++) {
				out[outLen++] = out[start + k];
			}
		}
	}
	const data = new Uint8Array(out.buffer.slice(0, outLen));
	return base64Encode(data);

	function ensure(n) {
		if (out.length < n) {
			let nl = out.length * 2;
			while (nl < n) {
				nl *= 2;
			}
			const nbuf = new Uint8Array(nl);
			nbuf.set(out.subarray(0, outLen));
			out = nbuf;
		}
	};
}

export function compress(input) {
	const src = new Uint8Array(input);
	const N = src.length;
	const out = [];
	const litBuf = [];
	const MAX_OFFSET = 0xffff;
	const MAX_MATCH = 130;
	const MAX_CANDIDATES = 64;
	const map = new Map();
	let i = 0;
	while (i < N) {
		let bestLen = 0, bestOff = 0;
		if (i + 2 < N) {
			const key = (src[i] << 16) | (src[i + 1] << 8) | src[i + 2];
			const cand = map.get(key) || [];
			for (let c = cand.length - 1; c >= 0; c--) {
				const j = cand[c];
				const off = i - j;
				if (off <= 0 || off > MAX_OFFSET) {
					continue;
				}
				let k = 0;
				while (k < MAX_MATCH && i + k < N && src[j + k] === src[i + k]) {
					k++;
				}
				if (k > bestLen && k >= 3) {
					bestLen = k; bestOff = off;
					if (bestLen === MAX_MATCH) {
						break;
					}
				}
			}
		}

		if (bestLen >= 3) {
			if (litBuf.length) {
				flushLiterals();
			}
			let remain = bestLen;
			let produced = 0;
			while (remain > 0) {
				const take = Math.min(remain, MAX_MATCH);
				out.push(0x80 | ((take - 3) & 0x7f));
				out.push((bestOff >> 8) & 0xff);
				out.push(bestOff & 0xff);
				remain -= take;
				produced += take;
			}
			const start = i;
			for (let p = start; p < start + produced; p++) {
				addPos(p);
			}
			i += produced;
		} else {
			litBuf.push(src[i]);
			addPos(i);
			i++;
			if (litBuf.length === 127) {
				flushLiterals();
			}
		}
	}
	if (litBuf.length) {
		flushLiterals();
	}
	const u8 = new Uint8Array(out);
	return base64Encode(u8);

	function flushLiterals() {
		while (litBuf.length) {
			const take = Math.min(127, litBuf.length);
			out.push(take);
			for (let t = 0; t < take; t++) {
				out.push(litBuf.shift());
			}
		}
	}

	function addPos(pos) {
		if (pos + 2 < N) {
			const key = (src[pos] << 16) | (src[pos + 1] << 8) | src[pos + 2];
			const arr = map.get(key) || [];
			arr.push(pos);
			if (arr.length > MAX_CANDIDATES) {
				arr.shift();
			}
			map.set(key, arr);
		}
	}
}