(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
})(this, (function (exports) { 'use strict';

	const { Array, Object, String, Number, BigInt, Math, Date, Map, Set, Response, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, document, crypto, btoa, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream, navigator, Worker } = typeof globalThis !== 'undefined' ? globalThis : this || self;

	var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
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
	const MAX_8_BITS = 0xff;
	const COMPRESSION_METHOD_DEFLATE = 0x08;
	const COMPRESSION_METHOD_DEFLATE_64 = 0x09;
	const COMPRESSION_METHOD_STORE = 0x00;
	const COMPRESSION_METHOD_AES = 0x63;

	const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
	const SPLIT_ZIP_FILE_SIGNATURE = 0x08074b50;
	const DATA_DESCRIPTOR_RECORD_SIGNATURE = SPLIT_ZIP_FILE_SIGNATURE;
	const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
	const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
	const ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 0x06064b50;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 0x07064b50;
	const CENTRAL_FILE_HEADER_LENGTH = 46;
	const END_OF_CENTRAL_DIR_LENGTH = 22;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH = 20;
	const ZIP64_END_OF_CENTRAL_DIR_LENGTH = 56;
	const ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH = END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LENGTH;

	const DATA_DESCRIPTOR_RECORD_LENGTH = 12;
	const DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH = 20;
	const DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH = 4;

	const EXTRAFIELD_TYPE_ZIP64 = 0x0001;
	const EXTRAFIELD_TYPE_AES = 0x9901;
	const EXTRAFIELD_TYPE_NTFS = 0x000a;
	const EXTRAFIELD_TYPE_NTFS_TAG1 = 0x0001;
	const EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 0x5455;
	const EXTRAFIELD_TYPE_UNICODE_PATH = 0x7075;
	const EXTRAFIELD_TYPE_UNICODE_COMMENT = 0x6375;
	const EXTRAFIELD_TYPE_USDZ = 0x1986;
	const EXTRAFIELD_TYPE_INFOZIP = 0x7875;
	const EXTRAFIELD_TYPE_UNIX = 0x7855;

	const BITFLAG_ENCRYPTED = 0b1;
	const BITFLAG_LEVEL = 0b0110;
	const BITFLAG_LEVEL_MAX_MASK = 0b010;
	const BITFLAG_LEVEL_FAST_MASK = 0b100;
	const BITFLAG_LEVEL_SUPER_FAST_MASK = 0b110;
	const BITFLAG_DATA_DESCRIPTOR = 0b1000;
	const BITFLAG_LANG_ENCODING_FLAG = 0b100000000000;
	const FILE_ATTR_MSDOS_DIR_MASK = 0b10000;
	const FILE_ATTR_MSDOS_READONLY_MASK = 0x01;
	const FILE_ATTR_MSDOS_HIDDEN_MASK = 0x02;
	const FILE_ATTR_MSDOS_SYSTEM_MASK = 0x04;
	const FILE_ATTR_MSDOS_ARCHIVE_MASK = 0x20;
	const FILE_ATTR_UNIX_TYPE_MASK = 0o170000;
	const FILE_ATTR_UNIX_TYPE_DIR = 0o040000;
	const FILE_ATTR_UNIX_EXECUTABLE_MASK = 0o111;
	const FILE_ATTR_UNIX_DEFAULT_MASK = 0o644;
	const FILE_ATTR_UNIX_SETUID_MASK = 0o4000;
	const FILE_ATTR_UNIX_SETGID_MASK = 0o2000;
	const FILE_ATTR_UNIX_STICKY_MASK = 0o1000;

	const VERSION_DEFLATE = 0x14;
	const VERSION_ZIP64 = 0x2D;
	const VERSION_AES = 0x33;

	const DIRECTORY_SIGNATURE = "/";

	const HEADER_SIZE = 30;
	const HEADER_OFFSET_VERSION = 0;
	const HEADER_OFFSET_SIGNATURE = 10;
	const HEADER_OFFSET_COMPRESSED_SIZE = 14;
	const HEADER_OFFSET_UNCOMPRESSED_SIZE = 18;
	const LOCAL_HEADER_COMMON_OFFSET = 4;

	const MAX_DATE = new Date(2107, 11, 31, 23, 59, 58);
	const MIN_DATE = new Date(1980, 0, 1);

	const UNDEFINED_VALUE = undefined;
	const INFINITY_VALUE = Infinity;
	const UNDEFINED_TYPE = "undefined";
	const FUNCTION_TYPE = "function";
	const OBJECT_TYPE = "object";

	const EMPTY_UINT8_ARRAY = new Uint8Array();

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


	const MINIMUM_CHUNK_SIZE = 64;
	let maxWorkers = 2;
	try {
		if (typeof navigator != UNDEFINED_TYPE && navigator.hardwareConcurrency) {
			maxWorkers = navigator.hardwareConcurrency;
		}
	} catch {
		// ignored
	}
	const DEFAULT_CONFIGURATION = {
		workerURI: "./core/web-worker-wasm.js",
		wasmURI: "./core/streams/zlib-wasm/zlib-streams.wasm",
		chunkSize: 64 * 1024,
		maxWorkers,
		terminateWorkerTimeout: 5000,
		workerStarvationTimeout: 5000,
		useWebWorkers: true,
		useCompressionStream: true,
		transferStreams: true,
		CompressionStream: typeof CompressionStream != UNDEFINED_TYPE && CompressionStream,
		DecompressionStream: typeof DecompressionStream != UNDEFINED_TYPE && DecompressionStream
	};

	const CONFIGURABLE_PROPERTY_NAMES = [
		"baseURI",
		"wasmURI",
		"workerURI",
		"chunkSize",
		"maxWorkers",
		"terminateWorkerTimeout",
		"workerStarvationTimeout",
		"useCompressionStream",
		"useWebWorkers",
		"transferStreams",
		"CompressionStream",
		"DecompressionStream",
		"CompressionStreamZlib",
		"DecompressionStreamZlib"
	];

	const config = { ...DEFAULT_CONFIGURATION };

	function getConfiguration() {
		return config;
	}

	function getChunkSize(config) {
		return Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
	}

	function configure(configuration) {
		for (const propertyName of CONFIGURABLE_PROPERTY_NAMES) {
			const propertyValue = configuration[propertyName];
			if (propertyValue !== UNDEFINED_VALUE) {
				config[propertyName] = propertyValue;
			}
		}
	}

	function setDefaultConfiguration(configuration) {
		for (const propertyName of CONFIGURABLE_PROPERTY_NAMES) {
			const propertyValue = configuration[propertyName];
			if (propertyValue !== UNDEFINED_VALUE) {
				DEFAULT_CONFIGURATION[propertyName] = propertyValue;
			}
		}
		configure(configuration);
	}

	function resetConfiguration() {
		for (const propertyName of CONFIGURABLE_PROPERTY_NAMES) {
			delete config[propertyName];
		}
		Object.assign(config, DEFAULT_CONFIGURATION);
	}

	const r=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],o=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],t=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],e=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],n=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],f=new Uint8Array(288);f.fill(8,0,144),f.fill(9,144,256),f.fill(7,256,280),f.fill(8,280,288);const l=new Uint8Array(30).fill(5);function W(r){const o=new Uint16Array(16);for(const t of r)o[t]++;o[0]=0;const t=new Uint16Array(17);for(let r=1;15>=r;r++)t[r+1]=t[r]+o[r];const e=new Uint16Array(r.length);for(let o=0;o<r.length;o++)r[o]&&(e[t[r[o]]++]=o);return {o:o,symbols:e}}const s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function N(N){N({workerURI:N=>{const i="text/javascript",H=(s=>{let N=0,i=0,H=0,k=new Uint8Array(1024),v=0,j=0;for(;!j;){j=x(1);const r=x(2);if(0==r)C();else if(1==r)g(W(f),W(l));else {if(2!=r)throw Error("invalid deflate block type");g(...a());}}return k.subarray(0,v);function T(){if(N>=s.length)throw Error("unexpected end of deflate data");return s[N++]}function x(r){for(;r>H;)i|=T()<<H,H+=8;const o=i&(1<<r)-1;return i>>>=r,H-=r,o}function C(){i=0,H=0;const r=T()|T()<<8;N+=2,u(v+r);for(let o=0;r>o;o++)k[v++]=T();}function g(n,f){let l=q(n);for(;256!=l;){if(256>l)u(v+1),k[v++]=l;else {const n=l-257,W=r[n]+x(o[n]),s=q(f),N=t[s]+x(e[s]);u(v+W);const i=v-N;for(let r=0;W>r;r++)k[v++]=k[i+r];}l=q(n);}}function a(){const r=x(5)+257,o=x(5)+1,t=x(4)+4,e=new Uint8Array(19);for(let r=0;t>r;r++)e[n[r]]=x(3);const f=W(e),l=new Uint8Array(r+o);let s=0;for(;s<l.length;){const r=q(f);if(16>r)l[s++]=r;else if(16==r){const r=l[s-1];let o=x(2)+3;for(;o--;)l[s++]=r;}else s+=17==r?x(3)+3:x(7)+11;}return [W(l.subarray(0,r)),W(l.subarray(r))]}function q(r){const{o:o,symbols:t}=r;let e=0,n=0,f=0;for(let r=1;15>=r;r++){e|=x(1);const l=o[r];if(l>e-n)return t[f+(e-n)];f+=l,n=n+l<<1,e<<=1;}throw Error("invalid huffman code")}function u(r){if(k.length<r){let o=2*k.length;for(;r>o;)o*=2;const t=new Uint8Array(o);t.set(k.subarray(0,v)),k=t;}}})((r=>{const o=(r=(r+"").replace(/[^A-Za-z0-9+/=]/g,"")).length,t=[];for(let e=0;o>e;e+=4){const o=s.indexOf(r[e])<<18|s.indexOf(r[e+1])<<12|(63&s.indexOf(r[e+2]))<<6|63&s.indexOf(r[e+3]);t.push(o>>16&255),"="!==r[e+2]&&t.push(o>>8&255),"="!==r[e+3]&&t.push(255&o);}return new Uint8Array(t)})("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"));if(N){const r=new Blob([H],{type:i});return URL.createObjectURL(r)}return "data:"+i+";base64,"+(r=>{let o="";const t=r.length;let e=0;for(;t>e+2;e+=3){const t=r[e]<<16|r[e+1]<<8|r[e+2];o+=s[t>>18&63]+s[t>>12&63]+s[t>>6&63]+s[63&t];}const n=t-e;if(1===n){const t=r[e]<<16;o+=s[t>>18&63]+s[t>>12&63]+"==";}else if(2===n){const t=r[e]<<16|r[e+1]<<8;o+=s[t>>18&63]+s[t>>12&63]+s[t>>6&63]+"=";}return o})(H)}});}

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


	const ERR_INVALID_CODEC_DEFINITION = "Invalid codec definition";
	const ERR_RESERVED_COMPRESSION_METHOD = "Reserved compression method";
	const ERR_INVALID_CODEC_MODULE = "Invalid codec module";

	const STRING_TYPE = "string";
	const RESERVED_COMPRESSION_METHODS = [
		COMPRESSION_METHOD_STORE,
		COMPRESSION_METHOD_DEFLATE,
		COMPRESSION_METHOD_DEFLATE_64,
		COMPRESSION_METHOD_AES
	];

	const registeredCodecs = new Map();
	const codecStreams = new Map();

	function registerCodec(codec = {}) {
		const { compressionMethod, format, codecURI, CompressionStream, DecompressionStream, versionNeeded } = codec;
		if (!Number.isInteger(compressionMethod) || compressionMethod < 0 || compressionMethod > MAX_16_BITS ||
			typeof format != STRING_TYPE || !format.length) {
			throw new Error(ERR_INVALID_CODEC_DEFINITION);
		}
		if (RESERVED_COMPRESSION_METHODS.includes(compressionMethod)) {
			throw new Error(ERR_RESERVED_COMPRESSION_METHOD);
		}
		const hasStreams = typeof CompressionStream == FUNCTION_TYPE || typeof DecompressionStream == FUNCTION_TYPE;
		if (!hasStreams && (typeof codecURI != STRING_TYPE || !codecURI.length)) {
			throw new Error(ERR_INVALID_CODEC_DEFINITION);
		}
		registeredCodecs.set(compressionMethod, { compressionMethod, format, codecURI, versionNeeded });
		if (hasStreams) {
			setCodecStreams(format, { CompressionStream, DecompressionStream });
		}
	}

	function unregisterCodec(compressionMethod) {
		const codec = registeredCodecs.get(compressionMethod);
		if (codec) {
			registeredCodecs.delete(compressionMethod);
			let formatUsed;
			registeredCodecs.forEach(otherCodec => formatUsed = formatUsed || otherCodec.format == codec.format);
			if (!formatUsed) {
				codecStreams.delete(codec.format);
			}
		}
	}

	function getRegisteredCodec(compressionMethod) {
		return registeredCodecs.get(compressionMethod);
	}

	function getCodecStreams(format) {
		return codecStreams.get(format);
	}

	function setCodecStreams(format, streams) {
		const { CompressionStream, DecompressionStream } = streams;
		if (typeof CompressionStream != FUNCTION_TYPE && typeof DecompressionStream != FUNCTION_TYPE) {
			throw new Error(ERR_INVALID_CODEC_MODULE);
		}
		codecStreams.set(format, { CompressionStream, DecompressionStream });
	}

	async function ensureCodecStreams(format, codecURI) {
		if (!codecStreams.has(format) && codecURI) {
			setCodecStreams(format, await import(codecURI));
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

	// Slicing-by-8 CRC-32 (Intel / zlib). The eight 256-entry tables let the inner loop
	// consume 8 bytes per iteration with a shorter dependency chain, ~4x the byte-at-a-time
	// rate (measured ~320 -> ~1400 MB/s on 64KB chunks).
	//
	// Every table MUST stay a PACKED_SMI array: build with array literals (not `new Array(n)`,
	// which is HOLEY) and store the signed int32 XOR result (no `>>> 0`). An unsigned or holey
	// table becomes a V8 FixedDoubleArray whose every hot-loop lookup unboxes a double (~1.6x
	// slower). Signedness is irrelevant to the result — the reads mask/shift it and the final
	// `~crc` normalizes it. Do NOT reintroduce `>>> 0` here or switch to `new Array(256)`.
	const T = [[], [], [], [], [], [], [], []];
	for (let n = 0; n < 256; n++) {
		let t = n;
		for (let j = 0; j < 8; j++) {
			t = (t & 1) ? (t >>> 1) ^ 0xEDB88320 : t >>> 1;
		}
		T[0][n] = t;
	}
	for (let n = 0; n < 256; n++) {
		for (let k = 1; k < 8; k++) {
			const previous = T[k - 1][n];
			T[k][n] = (previous >>> 8) ^ T[0][previous & 0xFF];
		}
	}
	const [T0, T1, T2, T3, T4, T5, T6, T7] = T;

	class Crc32 {

		constructor(crc) {
			this.crc = crc || -1;
		}

		append(data) {
			let crc = this.crc | 0;
			const length = data.length | 0;
			let offset = 0;
			// Process 8 bytes per iteration over the typed-array body. DataView.getInt32(le)
			// reads an unaligned little-endian word as a signed int32 (no double boxing), so no
			// alignment or endianness handling is needed; data.buffer guards non-typed inputs.
			if (length >= 8 && data.buffer) {
				const view = new DataView(data.buffer, data.byteOffset, length);
				const end = length - 8;
				for (; offset <= end; offset += 8) {
					const a = crc ^ view.getInt32(offset, true);
					const b = view.getInt32(offset + 4, true);
					crc = T7[a & 0xFF] ^ T6[(a >>> 8) & 0xFF] ^ T5[(a >>> 16) & 0xFF] ^ T4[(a >>> 24) & 0xFF] ^
						T3[b & 0xFF] ^ T2[(b >>> 8) & 0xFF] ^ T1[(b >>> 16) & 0xFF] ^ T0[(b >>> 24) & 0xFF];
				}
			}
			// Remaining tail (and non-typed inputs) byte-at-a-time with the base table.
			for (; offset < length; offset++) {
				crc = (crc >>> 8) ^ T0[(crc ^ data[offset]) & 0xFF];
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
			// deno-lint-ignore prefer-const
			let stream;
			const crc32 = new Crc32();
			super({
				transform(chunk, controller) {
					crc32.append(chunk);
					controller.enqueue(chunk);
				},
				flush() {
					const value = new Uint8Array(4);
					const dataView = new DataView(value.buffer);
					dataView.setUint32(0, crc32.get());
					stream.value = value;
				}
			});
			stream = this;
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
		// deno-lint-ignore valid-typeof
		if (typeof TextEncoder == UNDEFINED_TYPE) {
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


	function concat(first, second) {
		const result = new Uint8Array(first.length + second.length);
		result.set(first);
		result.set(second, first.length);
		return result;
	}

	function toExactUint8Array(array) {
		return array.byteOffset || array.byteLength != array.buffer.byteLength ? new Uint8Array(array) : array;
	}

	function getDataView(array) {
		return new DataView(array.buffer, array.byteOffset, array.byteLength);
	}

	// Derived from https://github.com/xqdoo00o/jszip/blob/master/lib/sjcl.js and https://github.com/bitwiseshiftleft/sjcl

	// deno-lint-ignore-file no-this-alias

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
	hash.sha1 = class {
		constructor(hash) {
			const sha1 = this;
			/**
			 * The hash's block size, in bits.
			 * @constant
			 */
			sha1.blockSize = 512;
			/**
			 * The SHA-1 initialization vector.
			 * @private
			 */
			sha1._init = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
			/**
			 * The SHA-1 hash key.
			 * @private
			 */
			sha1._key = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];
			if (hash) {
				sha1._h = hash._h.slice(0);
				sha1._buffer = hash._buffer.slice(0);
				sha1._length = hash._length;
			} else {
				sha1.reset();
			}
		}

		/**
		 * Reset the hash state.
		 * @return this
		 */
		reset() {
			const sha1 = this;
			sha1._h = sha1._init.slice(0);
			sha1._buffer = [];
			sha1._length = 0;
			return sha1;
		}

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
		}

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
		}

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
		}

		/**
		 * Circular left-shift operator.
		 * @private
		 */
		_S(n, x) {
			return (x << n) | (x >>> 32 - n);
		}

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
			hmac._baseHash = [new Hash(), new Hash()];
			const bs = hmac._baseHash[0].blockSize / 32;

			if (key.length > bs) {
				key = new Hash().update(key).finalize();
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


	const GET_RANDOM_VALUES_SUPPORTED = typeof crypto != UNDEFINED_TYPE && typeof crypto.getRandomValues == FUNCTION_TYPE;

	const ERR_INVALID_PASSWORD = "Invalid password";
	const ERR_INVALID_SIGNATURE = "Invalid signature";
	const ERR_ABORT_CHECK_PASSWORD = "zipjs-abort-check-password";
	const ERR_UNSUPPORTED_CRYPTO_API = "Crypto API not supported";

	function getRandomValues(array) {
		if (GET_RANDOM_VALUES_SUPPORTED) {
			return crypto.getRandomValues(array);
		} else {
			throw new Error(ERR_UNSUPPORTED_CRYPTO_API);
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
	// deno-lint-ignore valid-typeof
	const CRYPTO_API_SUPPORTED = typeof crypto != UNDEFINED_TYPE;
	const subtle = CRYPTO_API_SUPPORTED && crypto.subtle;
	const SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof subtle != UNDEFINED_TYPE;
	const codecBytes = codec.bytes;
	const Aes = cipher.aes;
	const CtrGladman = mode.ctrGladman;
	const HmacSha1 = misc.hmacSha1;

	let IMPORT_KEY_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.importKey == FUNCTION_TYPE;
	let DERIVE_BITS_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.deriveBits == FUNCTION_TYPE;

	class AESDecryptionStream extends TransformStream {

		constructor({ password, rawPassword, encryptionStrength, checkPasswordOnly }) {
			super({
				start() {
					initAesCrypto(this, password, rawPassword, encryptionStrength);
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
						if (checkPasswordOnly) {
							controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
						} else {
							resolveReady();
						}
					} else {
						await ready;
					}
					const output = new Uint8Array(chunk.length - SIGNATURE_LENGTH - ((chunk.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
					controller.enqueue(append(aesCrypto, chunk, output, 0, SIGNATURE_LENGTH, true));
				},
				async flush(controller) {
					const {
						ctr,
						hmac,
						pending,
						ready
					} = this;
					if (hmac && ctr) {
						await ready;
						const chunkToDecrypt = subarray(pending, 0, pending.length - SIGNATURE_LENGTH);
						const originalSignature = subarray(pending, pending.length - SIGNATURE_LENGTH);
						let decryptedChunkArray = EMPTY_UINT8_ARRAY;
						if (chunkToDecrypt.length) {
							const encryptedChunk = toBits(codecBytes, chunkToDecrypt);
							hmac.update(encryptedChunk);
							const decryptedChunk = ctr.update(encryptedChunk);
							decryptedChunkArray = fromBits(codecBytes, decryptedChunk);
						}
						const signature = subarray(fromBits(codecBytes, hmac.digest()), 0, SIGNATURE_LENGTH);
						let invalidSignature = pending.length < SIGNATURE_LENGTH ? 1 : 0;
						for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) {
							invalidSignature |= signature[indexSignature] ^ originalSignature[indexSignature];
						}
						if (invalidSignature) {
							throw new Error(ERR_INVALID_SIGNATURE);
						}
						controller.enqueue(decryptedChunkArray);
					}
				}
			});
		}
	}

	class AESEncryptionStream extends TransformStream {

		constructor({ password, rawPassword, encryptionStrength }) {
			// deno-lint-ignore prefer-const
			let stream;
			super({
				start() {
					initAesCrypto(this, password, rawPassword, encryptionStrength);
				},
				async transform(chunk, controller) {
					const aesCrypto = this;
					const {
						password,
						strength,
						resolveReady,
						ready
					} = aesCrypto;
					let preamble = EMPTY_UINT8_ARRAY;
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
					if (hmac && ctr) {
						await ready;
						let encryptedChunkArray = EMPTY_UINT8_ARRAY;
						if (pending.length) {
							const encryptedChunk = ctr.update(toBits(codecBytes, pending));
							hmac.update(encryptedChunk);
							encryptedChunkArray = fromBits(codecBytes, encryptedChunk);
						}
						stream.signature = fromBits(codecBytes, hmac.digest()).slice(0, SIGNATURE_LENGTH);
						controller.enqueue(concat(encryptedChunkArray, stream.signature));
					}
				}
			});
			stream = this;
		}
	}

	function initAesCrypto(aesCrypto, password, rawPassword, encryptionStrength) {
		Object.assign(aesCrypto, {
			ready: new Promise(resolve => aesCrypto.resolveReady = resolve),
			password: encodePassword(password, rawPassword),
			strength: encryptionStrength - 1,
			pending: EMPTY_UINT8_ARRAY
		});
	}

	function append(aesCrypto, input, output, paddingStart, paddingEnd, verifySignature) {
		const {
			ctr,
			hmac,
			pending
		} = aesCrypto;
		if (pending.length) {
			input = concat(pending, input);
		}
		const inputLength = input.length - paddingEnd;
		output = expand(output, paddingStart + (inputLength - (inputLength % BLOCK_LENGTH)));
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
		const baseKey = await importKey(RAW_FORMAT, password, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
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

	async function importKey(format, password, algorithm, extractable, keyUsages) {
		if (IMPORT_KEY_SUPPORTED) {
			try {
				return await subtle.importKey(format, password, algorithm, extractable, keyUsages);
			} catch {
				IMPORT_KEY_SUPPORTED = false;
				return misc.importKey(password);
			}
		} else {
			return misc.importKey(password);
		}
	}

	async function deriveBits(algorithm, baseKey, length) {
		if (DERIVE_BITS_SUPPORTED) {
			try {
				return await subtle.deriveBits(algorithm, baseKey, length);
			} catch {
				DERIVE_BITS_SUPPORTED = false;
				return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
			}
		} else {
			return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
		}
	}

	function encodePassword(password, rawPassword) {
		if (rawPassword === UNDEFINED_VALUE) {
			return encodeText(password);
		} else {
			return rawPassword;
		}
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

		constructor({ password, rawPassword, passwordVerification, checkPasswordOnly }) {
			super({
				start() {
					initZipCrypto(this, password, rawPassword, passwordVerification);
				},
				transform(chunk, controller) {
					const zipCrypto = this;
					if (zipCrypto.password || zipCrypto.rawPassword) {
						const decryptedHeader = decrypt(zipCrypto, chunk.subarray(0, HEADER_LENGTH));
						zipCrypto.password = zipCrypto.rawPassword = null;
						if ((decryptedHeader.at(-1) ^ zipCrypto.passwordVerification) != 0) {
							throw new Error(ERR_INVALID_PASSWORD);
						}
						chunk = chunk.subarray(HEADER_LENGTH);
					}
					if (checkPasswordOnly) {
						controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
					} else {
						controller.enqueue(decrypt(zipCrypto, chunk));
					}
				}
			});
		}
	}

	class ZipCryptoEncryptionStream extends TransformStream {

		constructor({ password, rawPassword, passwordVerification }) {
			super({
				start() {
					initZipCrypto(this, password, rawPassword, passwordVerification);
				},
				transform(chunk, controller) {
					const zipCrypto = this;
					let output;
					let offset;
					if (zipCrypto.password || zipCrypto.rawPassword) {
						zipCrypto.password = zipCrypto.rawPassword = null;
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

	function initZipCrypto(zipCrypto, password, rawPassword, passwordVerification) {
		Object.assign(zipCrypto, {
			password,
			rawPassword,
			passwordVerification
		});
		createKeys(zipCrypto, password, rawPassword);
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

	function createKeys(target, password, rawPassword) {
		const keys = [0x12345678, 0x23456789, 0x34567890];
		Object.assign(target, {
			keys,
			crcKey0: new Crc32(keys[0]),
			crcKey2: new Crc32(keys[2])
		});
		if (rawPassword) {
			for (let index = 0; index < rawPassword.length; index++) {
				updateKeys(target, rawPassword[index]);
			}
		} else {
			for (let index = 0; index < password.length; index++) {
				updateKeys(target, password.charCodeAt(index));
			}
		}
	}

	function updateKeys(target, byte) {
		let [, key1] = target.keys;
		target.crcKey0.append([byte]);
		const key0 = ~target.crcKey0.get();
		key1 = getInt32(Math.imul(getInt32(key1 + getInt8(key0)), 134775813) + 1);
		target.crcKey2.append([key1 >>> 24]);
		const key2 = ~target.crcKey2.get();
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


	const ERR_INVALID_UNCOMPRESSED_SIZE = "Invalid uncompressed size";
	const ERR_INVALID_COMPRESSED_DATA = "Invalid compressed data";
	const ERR_UNSUPPORTED_COMPRESSION$2 = "Compression method not supported";
	const FORMAT_DEFLATE_RAW = "deflate-raw";
	const FORMAT_DEFLATE64_RAW = "deflate64-raw";
	const FORMAT_GZIP = "gzip";
	const GZIP_HEADER_LENGTH = 10;
	const GZIP_TRAILER_LENGTH = 8;

	class DeflateStream extends TransformStream {

		constructor(options, { chunkSize, CompressionStreamZlib, CompressionStream }) {
			super({});
			const { compressed, encrypted, useCompressionStream, zipCrypto, signed, level, deflate64, format } = options;
			const stream = this;
			let crc32Stream, encryptionStream, gzipCrc32Stream;
			let readable = super.readable;
			const codecStreams = format && getCodecStreams(format);
			const useGzipCrc32 = signed && compressed && !deflate64 && !codecStreams && (!encrypted || zipCrypto) &&
				Boolean(useCompressionStream && CompressionStream);
			if ((!encrypted || zipCrypto) && signed && !useGzipCrc32) {
				crc32Stream = new Crc32Stream();
				readable = pipeThrough(readable, crc32Stream);
			}
			if (compressed) {
				if (codecStreams) {
					readable = pipeThroughBackpressured(readable, createCodecStream(codecStreams.CompressionStream, format, { level, chunkSize }));
				} else if (useGzipCrc32) {
					gzipCrc32Stream = new GzipToRawDeflateStream();
					readable = pipeThroughBackpressured(readable, new CompressionStream(FORMAT_GZIP));
					readable = pipeThrough(readable, gzipCrc32Stream);
				} else {
					readable = pipeThroughCommpressionStream(readable, useCompressionStream, { level, chunkSize }, CompressionStream, CompressionStreamZlib, CompressionStream);
				}
			}
			if (encrypted) {
				if (zipCrypto) {
					readable = pipeThrough(readable, new ZipCryptoEncryptionStream(options));
				} else {
					encryptionStream = new AESEncryptionStream(options);
					readable = pipeThrough(readable, encryptionStream);
				}
			}
			setReadable(stream, readable, () => {
				let signature;
				if (encrypted && !zipCrypto) {
					signature = encryptionStream.signature;
				}
				if ((!encrypted || zipCrypto) && signed) {
					signature = useGzipCrc32 ? gzipCrc32Stream.signature : new DataView(crc32Stream.value.buffer).getUint32(0);
				}
				stream.signature = signature;
			});
		}
	}

	class GzipToRawDeflateStream extends TransformStream {

		constructor() {
			// deno-lint-ignore prefer-const
			let stream;
			let headerBytesLeft = GZIP_HEADER_LENGTH;
			let trailerCandidate = new Uint8Array(0);
			super({
				transform(chunk, controller) {
					if (headerBytesLeft) {
						const droppedLength = Math.min(headerBytesLeft, chunk.length);
						headerBytesLeft -= droppedLength;
						chunk = chunk.subarray(droppedLength);
						if (!chunk.length) {
							return;
						}
					}
					const availableLength = trailerCandidate.length + chunk.length;
					if (availableLength <= GZIP_TRAILER_LENGTH) {
						trailerCandidate = concat(trailerCandidate, chunk);
						return;
					}
					const emitLength = availableLength - GZIP_TRAILER_LENGTH;
					const emittedFromTrailer = Math.min(emitLength, trailerCandidate.length);
					controller.enqueue(concat(
						trailerCandidate.subarray(0, emittedFromTrailer),
						chunk.subarray(0, emitLength - emittedFromTrailer)));
					trailerCandidate = concat(
						trailerCandidate.subarray(emittedFromTrailer),
						chunk.subarray(emitLength - emittedFromTrailer));
				},
				flush() {
					const dataView = getDataView(trailerCandidate);
					stream.signature = dataView.getUint32(0, true);
					stream.uncompressedSize = dataView.getUint32(4, true);
				}
			});
			stream = this;
		}
	}

	class InflateStream extends TransformStream {

		constructor(options, { chunkSize, DecompressionStreamZlib, DecompressionStream }) {
			super({});
			const { zipCrypto, encrypted, signed, signature, compressed, useCompressionStream, deflate64, format } = options;
			let crc32Stream, decryptionStream;
			let readable = super.readable;
			if (encrypted) {
				if (zipCrypto) {
					readable = pipeThrough(readable, new ZipCryptoDecryptionStream(options));
				} else {
					decryptionStream = new AESDecryptionStream(options);
					readable = pipeThrough(readable, decryptionStream);
				}
			}
			if (compressed) {
				const codecStreams = format && getCodecStreams(format);
				if (codecStreams) {
					readable = pipeThroughBackpressured(readable, createCodecStream(codecStreams.DecompressionStream, format, { chunkSize }));
				} else {
					readable = pipeThroughCommpressionStream(readable, useCompressionStream, { chunkSize, deflate64 }, DecompressionStream, DecompressionStreamZlib, DecompressionStream);
				}
				readable = mapInflateStreamError(readable);
			}
			if ((!encrypted || zipCrypto) && signed) {
				crc32Stream = new Crc32Stream();
				readable = pipeThrough(readable, crc32Stream);
			}
			setReadable(this, readable, () => {
				if ((!encrypted || zipCrypto) && signed) {
					const dataViewSignature = new DataView(crc32Stream.value.buffer);
					if (signature != dataViewSignature.getUint32(0, false)) {
						throw new Error(ERR_INVALID_SIGNATURE);
					}
				}
			});
		}
	}

	function setReadable(stream, readable, flush) {
		readable = pipeThrough(readable, new TransformStream({ flush }));
		Object.defineProperty(stream, "readable", {
			get() {
				return readable;
			}
		});
	}

	function createCodecStream(CodecStreamClass, format, options) {
		if (!CodecStreamClass) {
			throw new Error(ERR_UNSUPPORTED_COMPRESSION$2);
		}
		return new CodecStreamClass(format, options);
	}

	function pipeThroughCommpressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamZlib, CompressionStream) {
		const Stream = useCompressionStream && CompressionStreamNative ? CompressionStreamNative : CompressionStreamZlib || CompressionStream;
		const format = options.deflate64 ? FORMAT_DEFLATE64_RAW : FORMAT_DEFLATE_RAW;
		let codecStream;
		try {
			codecStream = new Stream(format, options);
		} catch (error) {
			if (useCompressionStream) {
				if (CompressionStreamZlib) {
					codecStream = new CompressionStreamZlib(format, options);
				} else if (CompressionStream) {
					codecStream = new CompressionStream(format, options);
				} else {
					throw error;
				}
			} else {
				throw error;
			}
		}
		return pipeThroughBackpressured(readable, codecStream);
	}

	function pipeThrough(readable, transformStream) {
		return readable.pipeThrough(transformStream);
	}

	function pipeThroughBackpressured(readable, transformStream) {
		const writer = transformStream.writable.getWriter();
		const reader = readable.getReader();
		pump();
		return transformStream.readable;

		async function pump() {
			try {
				for (; ;) {
					await writer.ready;
					const result = await reader.read();
					if (result.done) {
						await writer.close();
						break;
					}
					await writer.write(result.value);
				}
			} catch (error) {
				await abort(writer, error);
				await cancel(reader, error);
			}
		}
	}

	async function abort(writer, error) {
		try {
			await writer.abort(error);
		} catch {
			// ignored: the writable may already be errored/closed
		}
	}

	async function cancel(reader, error) {
		try {
			await reader.cancel(error);
		} catch {
			// ignored: the readable may already be errored/closed
		}
	}

	function mapInflateStreamError(readable) {
		const reader = readable.getReader();
		return new ReadableStream({
			async pull(controller) {
				let result;
				try {
					result = await reader.read();
				} catch (error) {
					if (error && error.message) {
						throw error;
					}
					const mappedError = new Error(ERR_INVALID_COMPRESSED_DATA);
					mappedError.cause = error;
					throw mappedError;
				}
				const { value, done } = result;
				if (done) {
					controller.close();
				} else {
					controller.enqueue(value);
				}
			},
			cancel(reason) {
				return reader.cancel(reason);
			}
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


	const DEFAULT_CHUNK_SIZE = 64 * 1024;
	const MESSAGE_EVENT_TYPE = "message";
	const MESSAGE_START = "start";
	const MESSAGE_PULL = "pull";
	const MESSAGE_DATA = "data";
	const MESSAGE_ACK_DATA = "ack";
	const MESSAGE_CLOSE = "close";
	const CODEC_DEFLATE = "deflate";
	const CODEC_INFLATE = "inflate";

	class CodecStream extends TransformStream {

		constructor(options, config) {
			super({});
			const codec = this;
			const { codecType } = options;
			let Stream;
			if (codecType.startsWith(CODEC_DEFLATE)) {
				Stream = DeflateStream;
			} else if (codecType.startsWith(CODEC_INFLATE)) {
				Stream = InflateStream;
			}
			codec.outputSize = 0;
			let inputSize = 0;
			const stream = new Stream(options, config);
			const readable = super.readable;
			const inputSizeStream = new TransformStream({
				transform(chunk, controller) {
					if (chunk && chunk.length) {
						inputSize += chunk.length;
						controller.enqueue(chunk);
					}
				},
				flush() {
					Object.assign(codec, {
						inputSize
					});
				}
			});
			const outputSizeStream = new TransformStream({
				transform(chunk, controller) {
					if (chunk && chunk.length) {
						controller.enqueue(chunk);
						codec.outputSize += chunk.length;
						if (options.outputSize !== UNDEFINED_VALUE && codec.outputSize > options.outputSize) {
							throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
						}
					}
				},
				flush() {
					const { signature } = stream;
					Object.assign(codec, {
						signature,
						inputSize
					});
				}
			});
			Object.defineProperty(codec, "readable", {
				get() {
					return readable.pipeThrough(inputSizeStream).pipeThrough(stream).pipeThrough(outputSizeStream);
				}
			});
		}
	}

	class ChunkStream extends TransformStream {

		constructor(chunkSize) {
			const pendingChunks = [];
			let pendingLength = 0;
			if (!Number.isFinite(chunkSize) || chunkSize < 1) {
				chunkSize = DEFAULT_CHUNK_SIZE;
			}
			super({
				transform(chunk, controller) {
					pendingChunks.push(chunk);
					pendingLength += chunk.length;
					while (pendingLength > chunkSize) {
						controller.enqueue(shiftChunk());
					}
				},
				flush(controller) {
					if (pendingLength) {
						controller.enqueue(concatChunks(pendingChunks, pendingLength));
					}
				}
			});

			function shiftChunk() {
				const result = new Uint8Array(chunkSize);
				let resultOffset = 0;
				while (resultOffset < chunkSize) {
					const firstChunk = pendingChunks[0];
					const remainingLength = chunkSize - resultOffset;
					if (firstChunk.length <= remainingLength) {
						result.set(firstChunk, resultOffset);
						resultOffset += firstChunk.length;
						pendingChunks.shift();
					} else {
						result.set(firstChunk.subarray(0, remainingLength), resultOffset);
						pendingChunks[0] = firstChunk.subarray(remainingLength);
						resultOffset += remainingLength;
					}
				}
				pendingLength -= chunkSize;
				return result;
			}

			function concatChunks(chunks, length) {
				const result = new Uint8Array(length);
				let offset = 0;
				for (const chunk of chunks) {
					result.set(chunk, offset);
					offset += chunk.length;
				}
				return result;
			}
		}
	}

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


	const MODULE_WORKER_OPTIONS = { type: "module" };
	const ERROR_EVENT_TYPE = "error";
	const MESSAGE_ERROR_EVENT_TYPE = "messageerror";

	let webWorkerSupported, webWorkerSource, webWorkerURI, webWorkerOptions;
	let transferStreamsSupported = true;
	try {
		transferStreamsSupported = typeof structuredClone == FUNCTION_TYPE && structuredClone(new DOMException("", "AbortError")).code !== UNDEFINED_VALUE;
	} catch {
		// ignored
	}
	let initModule = () => { };

	class CodecWorker {

		constructor(workerData, { readable, writable }, { options, config, streamOptions, useWebWorkers, transferStreams, workerURI }, onTaskFinished) {
			const { signal } = streamOptions;
			Object.assign(workerData, {
				busy: true,
				generation: (workerData.generation || 0) + 1,
				readable: readable
					.pipeThrough(new ChunkStream(getChunkSize(config)))
					.pipeThrough(new ProgressWatcherStream(streamOptions), { signal }),
				writable,
				options: Object.assign({}, options),
				workerURI,
				transferStreams,
				terminate() {
					return new Promise(resolve => {
						const { worker, busy } = workerData;
						if (worker) {
							if (busy) {
								workerData.resolveTerminated = resolve;
							} else {
								worker.terminate();
								resolve();
							}
							workerData.interface = null;
						} else {
							resolve();
						}
					});
				},
				onTaskFinished() {
					if (workerData.busy) {
						const { resolveTerminated } = workerData;
						if (resolveTerminated) {
							workerData.resolveTerminated = null;
							workerData.terminated = true;
							workerData.worker.terminate();
							resolveTerminated();
						}
						workerData.busy = false;
						onTaskFinished(workerData);
					}
				}
			});
			if (webWorkerSupported === UNDEFINED_VALUE) {
				// deno-lint-ignore valid-typeof
				webWorkerSupported = typeof Worker != UNDEFINED_TYPE;
			}
			return (useWebWorkers && webWorkerSupported ? createWebWorkerInterface : createWorkerInterface)(workerData, config);
		}
	}

	class ProgressWatcherStream extends TransformStream {

		constructor({ onstart, onprogress, size, onend }) {
			let chunkOffset = 0;
			super({
				async start() {
					if (onstart) {
						await callHandler(onstart, size);
					}
				},
				async transform(chunk, controller) {
					chunkOffset += chunk.length;
					if (onprogress) {
						await callHandler(onprogress, chunkOffset, size);
					}
					controller.enqueue(chunk);
				},
				async flush() {
					if (onend) {
						await callHandler(onend, chunkOffset);
					}
				}
			});
		}
	}

	async function callHandler(handler, ...parameters) {
		try {
			await handler(...parameters);
		} catch {
			// ignored
		}
	}

	function createWorkerInterface(workerData, config) {
		return {
			run: () => runWorker$1(workerData, config)
		};
	}

	function createWebWorkerInterface(workerData, config) {
		const { baseURI, chunkSize } = config;
		let { wasmURI } = config;

		if (!workerData.interface) {
			// deno-lint-ignore valid-typeof
			if (typeof wasmURI == FUNCTION_TYPE) {
				wasmURI = wasmURI();
			}
			let worker;
			try {
				worker = getWebWorker(workerData.workerURI, baseURI, workerData);
			} catch {
				webWorkerSupported = false;
				return createWorkerInterface(workerData, config);
			}
			Object.assign(workerData, {
				worker,
				terminated: false,
				interface: {
					run: () => runWebWorker(workerData, { chunkSize, wasmURI, baseURI })
				}
			});
		}
		return workerData.interface;
	}

	async function runWorker$1({ options, readable, writable, onTaskFinished }, config) {
		let codecStream;
		try {
			if (!options.useCompressionStream) {
				try {
					await initModule(config);
				} catch {
					const ZlibStream = options.codecType.startsWith(CODEC_DEFLATE) ?
						config.CompressionStreamZlib :
						config.DecompressionStreamZlib;
					if (!ZlibStream || ZlibStream.requiresModule) {
						options.useCompressionStream = true;
					}
				}
			}
			codecStream = new CodecStream(options, config);
			await readable
				.pipeThrough(codecStream)
				.pipeThrough(new ChunkStream(getChunkSize(config)))
				.pipeTo(writable, { preventClose: true, preventAbort: true });
			const {
				signature,
				inputSize,
				outputSize
			} = codecStream;
			return {
				signature,
				inputSize,
				outputSize
			};
		} catch (error) {
			if (codecStream) {
				error.outputSize = codecStream.outputSize;
			}
			throw error;
		} finally {
			onTaskFinished();
		}
	}

	async function runWebWorker(workerData, config) {
		let resolveResult, rejectResult;
		const result = new Promise((resolve, reject) => {
			resolveResult = resolve;
			rejectResult = reject;
		});
		Object.assign(workerData, {
			reader: null,
			writer: null,
			resolveResult,
			rejectResult,
			result
		});
		const { readable, options } = workerData;
		const { writable, closed, abortPipe } = watchClosedStream(workerData.writable);
		let streamsTransferred;
		try {
			streamsTransferred = sendMessage({
				type: MESSAGE_START,
				options,
				config,
				readable,
				writable
			}, workerData);
		} catch (error) {
			abortPipe();
			try {
				await closed;
			} catch {
				// ignored
			}
			workerData.onTaskFinished();
			throw error;
		}
		if (!streamsTransferred) {
			Object.assign(workerData, {
				reader: readable.getReader(),
				writer: writable.getWriter()
			});
		}
		try {
			const resultValue = await result;
			await closeWritable();
			await closed;
			return resultValue;
		} catch (error) {
			await closeWritable();
			abortPipe();
			try {
				await closed;
			} catch {
				// ignored
			}
			throw error;
		}

		async function closeWritable() {
			if (!streamsTransferred && !writable.locked) {
				try {
					await writable.getWriter().close();
				} catch {
					// ignored
				}
			}
		}
	}

	function watchClosedStream(writableSource) {
		const abortController = new AbortController();
		const { writable, readable } = new TransformStream();
		const closed = readable.pipeTo(writableSource, { preventClose: true, preventAbort: true, signal: abortController.signal });
		closed.catch(() => { });
		return { writable, closed, abortPipe: () => abortController.abort() };
	}

	function terminateWorker$1(workerData) {
		const { worker } = workerData;
		if (worker) {
			try {
				worker.terminate();
			} catch {
				// ignored
			}
		}
		workerData.interface = null;
	}

	function getWebWorker(url, baseURI, workerData, isModuleType, useBlobURI = true) {
		let worker, resolvedURI, resolvedOptions;
		if (webWorkerURI === UNDEFINED_VALUE || webWorkerSource !== url) {
			// deno-lint-ignore valid-typeof
			const isFunctionURI = typeof url == FUNCTION_TYPE;
			if (isFunctionURI) {
				resolvedURI = url(useBlobURI);
			} else {
				resolvedURI = url;
			}
			const isDataURI = resolvedURI.startsWith("data:");
			const isBlobURI = resolvedURI.startsWith("blob:");
			if (isDataURI || isBlobURI) {
				if (isModuleType === UNDEFINED_VALUE) {
					isModuleType = false;
				}
				if (isModuleType) {
					resolvedOptions = MODULE_WORKER_OPTIONS;
				}
				try {
					worker = new Worker(resolvedURI, resolvedOptions);
				} catch (error) {
					if (isBlobURI) {
						try {
							URL.revokeObjectURL(resolvedURI);
						} catch {
							// ignored
						}
					}
					if (isFunctionURI && isBlobURI) {
						return getWebWorker(url, baseURI, workerData, isModuleType, false);
					} else if (!isModuleType) {
						return getWebWorker(url, baseURI, workerData, true, false);
					} else {
						throw error;
					}
				}
			} else {
				if (isModuleType === UNDEFINED_VALUE) {
					isModuleType = true;
				}
				if (isModuleType) {
					resolvedOptions = MODULE_WORKER_OPTIONS;
				}
				try {
					resolvedURI = new URL(resolvedURI, baseURI);
				} catch {
					// ignored
				}
				try {
					worker = new Worker(resolvedURI, resolvedOptions);
				} catch (error) {
					if (!isModuleType) {
						return getWebWorker(url, baseURI, workerData, false, useBlobURI);
					} else {
						throw error;
					}
				}
			}
			webWorkerSource = url;
			webWorkerURI = resolvedURI;
			webWorkerOptions = resolvedOptions;
		} else {
			worker = new Worker(webWorkerURI, webWorkerOptions);
		}
		worker.addEventListener(MESSAGE_EVENT_TYPE, event => onMessage(event, workerData));
		worker.addEventListener(ERROR_EVENT_TYPE, event => onWorkerError(event, workerData));
		worker.addEventListener(MESSAGE_ERROR_EVENT_TYPE, event => onWorkerError(event, workerData));
		return worker;
	}

	function onWorkerError(event, workerData) {
		if (event.preventDefault) {
			event.preventDefault();
		}
		const { rejectResult, writer, onTaskFinished } = workerData;
		terminateWorker$1(workerData);
		if (rejectResult) {
			rejectResult(event.error || new Error(event.message || ERROR_EVENT_TYPE));
			if (writer) {
				writer.releaseLock();
			}
			onTaskFinished();
		}
	}

	function sendMessage(message, { worker, writer, transferStreams }) {
		try {
			const { value, readable, writable } = message;
			const transferables = [];
			if (value) {
				message.value = toExactUint8Array(value);
				transferables.push(message.value.buffer);
			}
			if (transferStreams && transferStreamsSupported) {
				if (readable) {
					transferables.push(readable);
				}
				if (writable) {
					transferables.push(writable);
				}
			} else {
				message.readable = message.writable = null;
			}
			if (transferables.length) {
				try {
					worker.postMessage(message, transferables);
					return true;
				} catch {
					transferStreamsSupported = false;
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
			throw error;
		}
	}

	async function onMessage({ data }, workerData) {
		const { type, value, messageId, result, error } = data;
		const { reader, writer, resolveResult, rejectResult, onTaskFinished, generation } = workerData;
		const stale = () => workerData.generation != generation;
		try {
			if (error) {
				const { message, stack, code, name, outputSize } = error;
				const responseError = new Error(message);
				Object.assign(responseError, { stack, code, name, outputSize });
				close(responseError);
			} else {
				if (type == MESSAGE_PULL) {
					const { value, done } = await reader.read();
					if (!stale()) {
						sendMessage({ type: MESSAGE_DATA, value, done, messageId }, workerData);
					}
				}
				if (type == MESSAGE_DATA) {
					await writer.ready;
					await writer.write(new Uint8Array(value));
					if (!stale()) {
						sendMessage({ type: MESSAGE_ACK_DATA, messageId }, workerData);
					}
				}
				if (type == MESSAGE_CLOSE) {
					close(null, result);
				}
			}
		} catch (error) {
			if (!stale()) {
				terminateWorker$1(workerData);
				close(error);
			}
		}

		function close(error, result) {
			if (stale()) {
				return;
			}
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


	let pool = [];
	const pendingRequests = [];
	let starvationTimeout;
	let starvationDelay;

	let indexWorker = 0;

	async function runWorker(stream, workerOptions) {
		const { options, config } = workerOptions;
		const { transferStreams, useWebWorkers, useCompressionStream, compressed, signed, encrypted, format, codecURI } = options;
		const { workerURI, maxWorkers } = config;
		if (format) {
			if (codecURI) {
				options.codecURI = resolveCodecURI(codecURI, config.baseURI);
			}
			await ensureCodecStreams(format, options.codecURI);
		}
		workerOptions.transferStreams = transferStreams || (transferStreams === UNDEFINED_VALUE && config.transferStreams);
		const streamCopy = !compressed && !signed && !encrypted;
		const workerSupported = format === UNDEFINED_VALUE || Boolean(options.codecURI);
		workerOptions.useWebWorkers = !streamCopy && workerSupported && (useWebWorkers || (useWebWorkers === UNDEFINED_VALUE && config.useWebWorkers));
		workerOptions.workerURI = workerOptions.useWebWorkers && workerURI ? workerURI : UNDEFINED_VALUE;
		options.useCompressionStream = useCompressionStream || (useCompressionStream === UNDEFINED_VALUE && config.useCompressionStream);
		return (await getWorker()).run();

		// deno-lint-ignore require-await
		async function getWorker() {
			const workerData = pool.find(workerData => !workerData.busy);
			if (workerData) {
				clearTerminateTimeout(workerData);
				return new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
			} else if (pool.length < maxWorkers) {
				const workerData = { indexWorker };
				indexWorker++;
				pool.push(workerData);
				return new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
			} else {
				return new Promise(resolve => {
					pendingRequests.push({ resolve, stream, workerOptions });
					starvationDelay = config.workerStarvationTimeout;
					armStarvationTimeout();
				});
			}
		}

		function onTaskFinished(workerData) {
			clearStarvationTimeout();
			if (pendingRequests.length) {
				const [{ resolve, stream, workerOptions }] = pendingRequests.splice(0, 1);
				resolve(new CodecWorker(workerData, stream, workerOptions, onTaskFinished));
				armStarvationTimeout();
			} else if (workerData.worker) {
				clearTerminateTimeout(workerData);
				terminateWorker(workerData, workerOptions);
			} else {
				pool = pool.filter(data => data != workerData);
			}
		}
	}

	function resolveCodecURI(codecURI, baseURI) {
		try {
			return new URL(codecURI, baseURI).toString();
		} catch {
			return codecURI;
		}
	}

	function armStarvationTimeout() {
		if (!starvationTimeout && pendingRequests.length && Number.isFinite(starvationDelay) && starvationDelay >= 0) {
			starvationTimeout = setTimeout(onWorkerStarvation, starvationDelay);
		}
	}

	function clearStarvationTimeout() {
		if (starvationTimeout) {
			clearTimeout(starvationTimeout);
			starvationTimeout = null;
		}
	}

	function onWorkerStarvation() {
		starvationTimeout = null;
		if (pendingRequests.length) {
			const [{ resolve, stream, workerOptions }] = pendingRequests.splice(0, 1);
			const inlineWorkerOptions = Object.assign({}, workerOptions, { useWebWorkers: false, workerURI: UNDEFINED_VALUE });
			resolve(new CodecWorker({}, stream, inlineWorkerOptions, onInlineTaskFinished));
			armStarvationTimeout();
		}
	}

	function onInlineTaskFinished() {
		clearStarvationTimeout();
		armStarvationTimeout();
	}

	function terminateWorker(workerData, workerOptions) {
		const { config } = workerOptions;
		const { terminateWorkerTimeout } = config;
		if (Number.isFinite(terminateWorkerTimeout) && terminateWorkerTimeout >= 0) {
			if (workerData.terminated) {
				workerData.terminated = false;
			} else {
				workerData.terminateTimeout = setTimeout(async () => {
					pool = pool.filter(data => data != workerData);
					try {
						await workerData.terminate();
					} catch {
						// ignored
					}
				}, terminateWorkerTimeout);
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

	async function terminateWorkers() {
		await Promise.allSettled(pool.map(workerData => {
			clearTerminateTimeout(workerData);
			return workerData.terminate();
		}));
	}

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


	const ERR_HTTP_STATUS = "HTTP error ";
	const ERR_HTTP_RANGE = "HTTP Range not supported";
	const ERR_HTTP_RESOURCE_CHANGED = "HTTP resource changed";
	const ERR_ITERATOR_COMPLETED_TOO_SOON = "Writer iterator completed too soon";
	const ERR_WRITER_NOT_INITIALIZED = "Writer not initialized";

	const CONTENT_TYPE_TEXT_PLAIN = "text/plain";
	const HTTP_HEADER_CONTENT_LENGTH = "Content-Length";
	const HTTP_HEADER_CONTENT_ENCODING = "Content-Encoding";
	const HTTP_HEADER_CONTENT_RANGE = "Content-Range";
	const HTTP_HEADER_ACCEPT_RANGES = "Accept-Ranges";
	const HTTP_HEADER_RANGE = "Range";
	const HTTP_HEADER_CONTENT_TYPE = "Content-Type";
	const HTTP_HEADER_ETAG = "Etag";
	const HTTP_HEADER_LAST_MODIFIED = "Last-Modified";
	const HTTP_METHOD_HEAD = "HEAD";
	const HTTP_METHOD_GET = "GET";
	const HTTP_RANGE_UNIT = "bytes";
	const DEFAULT_BUFFER_SIZE = 256 * 1024;
	const DEFAULT_MAXIMUM_RANGE_SIZE = 16 * 1024 * 1024;

	const PROPERTY_NAME_WRITABLE = "writable";
	const DISK_BOUNDARY = Symbol();

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
			return this.createReadable();
		}

		createReadable({ offset = 0, size, chunkSize = getChunkSize(getConfiguration()) } = {}) {
			const reader = this;
			let chunkOffset = 0;
			return new ReadableStream({
				async pull(controller) {
					const dataSize = size === UNDEFINED_VALUE ? chunkSize : Math.min(chunkSize, size - chunkOffset);
					const data = await readUint8Array(reader, offset + chunkOffset, dataSize);
					controller.enqueue(data);
					if ((chunkOffset + chunkSize > size) || (size === UNDEFINED_VALUE && !data.length && dataSize)) {
						controller.close();
					} else {
						chunkOffset += chunkSize;
					}
				}
			});
		}
	}

	class Writer extends Stream {

		constructor() {
			super();
			const writer = this;
			const writable = new WritableStream({
				write(chunk) {
					if (!writer.initialized) {
						throw new Error(ERR_WRITER_NOT_INITIALIZED);
					}
					return writer.writeUint8Array(toExactUint8Array(chunk));
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
			let effectiveLength = 0;
			for (let indexByte = delta; indexByte < delta + length && indexByte < bytes.length; indexByte++) {
				dataArray[indexByte - delta] = bytes.charCodeAt(indexByte);
				effectiveLength++;
			}
			if (effectiveLength < dataArray.length) {
				return dataArray.subarray(0, effectiveLength);
			} else {
				return dataArray;
			}
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
			let indexArray;
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
				writer.pending = dataString + writer.pending;
			}
		}

		getData() {
			return this.data + btoa(this.pending);
		}
	}

	let blobSliceReliable;
	let blobSliceProbe;

	function probeBlobSliceReliability() {
		blobSliceProbe = (async () => {
			try {
				const slicedBlob = new Blob([new Uint8Array(3)]).slice(1, 2);
				const streamReader = slicedBlob.stream().getReader();
				let streamedLength = 0;
				let result = await streamReader.read();
				while (!result.done) {
					streamedLength += result.value.length;
					result = await streamReader.read();
				}
				blobSliceReliable = streamedLength == 1;
			} catch {
				blobSliceReliable = false;
			}
		})();
	}

	class BlobReader extends Reader {

		constructor(blob) {
			super();
			Object.assign(this, {
				blob,
				size: blob.size
			});
			if (!blobSliceProbe) {
				probeBlobSliceReliability();
			}
		}

		createReadable(options) {
			const reader = this;
			const { blob, size } = reader;
			const { offset = 0, size: readSize = size - offset } = options || {};
			if (!offset && readSize >= size) {
				return blob.stream();
			}
			if (blobSliceReliable) {
				return blob.slice(offset, offset + readSize).stream();
			}
			return super.createReadable(options);
		}

		async readUint8Array(offset, length) {
			const reader = this;
			const offsetEnd = offset + length;
			const readsWholeBlob = !offset && offsetEnd >= reader.size;
			const blob = readsWholeBlob ? reader.blob : reader.blob.slice(offset, offsetEnd);
			let arrayBuffer = await blob.arrayBuffer();
			const sliceIgnoredByBuggyImplementation = arrayBuffer.byteLength > length;
			if (sliceIgnoredByBuggyImplementation) {
				arrayBuffer = arrayBuffer.slice(offset, offsetEnd);
			}
			return new Uint8Array(arrayBuffer);
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
			writer.blob.catch(() => { });
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
			createHttpReader(this, url, options);
		}

		async init() {
			await initHttpReader(this, sendFetchRequest, getFetchRequestData);
			super.init();
		}

		createReadable(options) {
			const reader = this;
			const { useRangeHeader, forceRangeRequests, size } = reader;
			if ((useRangeHeader || forceRangeRequests) && size !== UNDEFINED_VALUE) {
				const { offset = 0, size: readSize = size - offset } = options || {};
				if (readSize > 0 && offset < size) {
					return createRangeReadable(reader, offset, Math.min(readSize, size - offset));
				}
			}
			return super.createReadable(options);
		}

		readUint8Array(index, length) {
			return readUint8ArrayHttpReader(this, index, length, sendFetchRequest, getFetchRequestData);
		}
	}

	class XHRReader extends Reader {

		constructor(url, options) {
			super();
			createHttpReader(this, url, options);
		}

		async init() {
			await initHttpReader(this, sendXMLHttpRequest, getXMLHttpRequestData);
			super.init();
		}

		readUint8Array(index, length) {
			return readUint8ArrayHttpReader(this, index, length, sendXMLHttpRequest, getXMLHttpRequestData);
		}
	}

	function createHttpReader(httpReader, url, options) {
		const {
			preventHeadRequest,
			useRangeHeader,
			forceRangeRequests,
			combineSizeEocd,
			checkResourceChanges = true,
			maximumRangeSize = DEFAULT_MAXIMUM_RANGE_SIZE,
			fetch
		} = options;
		options = Object.assign({}, options);
		delete options.preventHeadRequest;
		delete options.useRangeHeader;
		delete options.forceRangeRequests;
		delete options.combineSizeEocd;
		delete options.checkResourceChanges;
		delete options.maximumRangeSize;
		delete options.useXHR;
		delete options.fetch;
		Object.assign(httpReader, {
			url,
			options,
			preventHeadRequest,
			useRangeHeader,
			forceRangeRequests,
			combineSizeEocd,
			checkResourceChanges,
			maximumRangeSize,
			fetch
		});
	}

	async function initHttpReader(httpReader, sendRequest, getRequestData) {
		const {
			url,
			preventHeadRequest,
			useRangeHeader,
			forceRangeRequests,
			combineSizeEocd
		} = httpReader;
		if (isHttpFamily(url) && (useRangeHeader || forceRangeRequests) && (typeof preventHeadRequest == "undefined" || preventHeadRequest)) {
			const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, combineSizeEocd ? -END_OF_CENTRAL_DIR_LENGTH : undefined));
			const acceptRanges = response.headers.get(HTTP_HEADER_ACCEPT_RANGES);
			if (!forceRangeRequests && (!acceptRanges || acceptRanges.toLowerCase() != HTTP_RANGE_UNIT)) {
				throw new Error(ERR_HTTP_RANGE);
			} else {
				if (combineSizeEocd) {
					const eocdCache = new Uint8Array(await response.arrayBuffer());
					if (response.status == 206 && eocdCache.length == END_OF_CENTRAL_DIR_LENGTH) {
						httpReader.eocdCache = eocdCache;
					}
				}
				setResourceValidators(httpReader, response);
				const contentSize = getContentRangeSize(response);
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
			useRangeHeader,
			forceRangeRequests,
			eocdCache,
			size,
			options
		} = httpReader;
		if (useRangeHeader || forceRangeRequests) {
			if (eocdCache && index == size - END_OF_CENTRAL_DIR_LENGTH && length == END_OF_CENTRAL_DIR_LENGTH) {
				return eocdCache;
			}
			if (index >= size || length === 0) {
				return EMPTY_UINT8_ARRAY;
			} else {
				if (index + length > size) {
					length = size - index;
				}
				const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, index, length));
				if (response.status != 206) {
					throw new Error(ERR_HTTP_RANGE);
				}
				const contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);
				if (contentRangeHeader) {
					const rangeStart = Number(contentRangeHeader.trim().split(/[\s-]+/)[1]);
					if (!Number.isNaN(rangeStart) && rangeStart != index) {
						throw new Error(ERR_HTTP_RANGE);
					}
				}
				checkResourceValidators(httpReader, response);
				setResourceValidators(httpReader, response);
				const data = new Uint8Array(await response.arrayBuffer());
				if (data.length != length) {
					throw new Error(ERR_HTTP_RANGE);
				}
				return data;
			}
		} else {
			const { data } = httpReader;
			if (!data) {
				await getRequestData(httpReader, options);
			}
			return httpReader.data.subarray(index, index + length);
		}
	}

	function createRangeReadable(httpReader, offset, size) {
		let bodyReader;
		let windowOffset = offset;
		let windowRemainingLength = 0;
		let remainingLength = size;
		return new ReadableStream({
			start() {
				return openWindow();
			},
			async pull(controller) {
				if (!bodyReader) {
					await openWindow();
				}
				const { value, done } = await bodyReader.read();
				if (done) {
					throw new Error(ERR_HTTP_RANGE);
				}
				const chunk = value.length > windowRemainingLength ? value.subarray(0, windowRemainingLength) : value;
				windowRemainingLength -= chunk.length;
				remainingLength -= chunk.length;
				if (chunk.length) {
					controller.enqueue(chunk);
				}
				if (!windowRemainingLength) {
					await closeWindow();
					if (!remainingLength) {
						controller.close();
					}
				}
			},
			cancel(reason) {
				return bodyReader && bodyReader.cancel(reason);
			}
		});

		async function openWindow() {
			const windowLength = Math.min(httpReader.maximumRangeSize, remainingLength);
			const response = await sendFetchRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, windowOffset, windowLength));
			if (response.status != 206) {
				throw new Error(ERR_HTTP_RANGE);
			}
			const contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);
			if (contentRangeHeader) {
				const rangeStart = Number(contentRangeHeader.trim().split(/[\s-]+/)[1]);
				if (!Number.isNaN(rangeStart) && rangeStart != windowOffset) {
					throw new Error(ERR_HTTP_RANGE);
				}
			}
			checkResourceValidators(httpReader, response);
			setResourceValidators(httpReader, response);
			windowOffset += windowLength;
			windowRemainingLength = windowLength;
			bodyReader = response.body.getReader();
		}

		async function closeWindow() {
			const currentBodyReader = bodyReader;
			bodyReader = UNDEFINED_VALUE;
			await currentBodyReader.cancel();
		}
	}

	function getContentRangeSize(response) {
		const contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);
		if (contentRangeHeader) {
			const headerValue = contentRangeHeader.trim().split(/\s*\/\s*/)[1];
			if (headerValue && headerValue != "*") {
				const contentSize = Number(headerValue);
				if (!Number.isNaN(contentSize)) {
					return contentSize;
				}
			}
		}
	}

	function getResourceValidators({ headers }) {
		return {
			etag: headers.get(HTTP_HEADER_ETAG) || UNDEFINED_VALUE,
			lastModified: headers.get(HTTP_HEADER_LAST_MODIFIED) || UNDEFINED_VALUE
		};
	}

	function setResourceValidators(httpReader, response) {
		const { checkResourceChanges, resourceValidators } = httpReader;
		if (checkResourceChanges && !resourceValidators && response.status == 206) {
			httpReader.resourceValidators = getResourceValidators(response);
		}
	}

	function checkResourceValidators(httpReader, response) {
		const { checkResourceChanges, resourceValidators, size } = httpReader;
		if (checkResourceChanges) {
			const contentRangeSize = getContentRangeSize(response);
			if (contentRangeSize !== UNDEFINED_VALUE && size !== UNDEFINED_VALUE && contentRangeSize != size) {
				throw new Error(ERR_HTTP_RESOURCE_CHANGED);
			}
			if (resourceValidators) {
				const validators = getResourceValidators(response);
				const changed = Object.entries(resourceValidators).some(([name, value]) =>
					value !== UNDEFINED_VALUE && validators[name] !== UNDEFINED_VALUE && value != validators[name]);
				if (changed) {
					throw new Error(ERR_HTTP_RESOURCE_CHANGED);
				}
			}
		}
	}

	function getRangeHeaders(httpReader, index = 0, length = 1) {
		return Object.assign({}, getHeaders(httpReader), { [HTTP_HEADER_RANGE]: HTTP_RANGE_UNIT + "=" + (index < 0 ? index : index + "-" + (index + length - 1)) });
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
		httpReader.size = httpReader.data.length;
	}

	async function getContentLength(httpReader, sendRequest, getRequestData) {
		if (httpReader.preventHeadRequest) {
			await getRequestData(httpReader, httpReader.options);
		} else {
			const response = await sendRequest(HTTP_METHOD_HEAD, httpReader, getHeaders(httpReader));
			const contentLength = response.headers.get(HTTP_HEADER_CONTENT_LENGTH);
			if (contentLength && !response.headers.get(HTTP_HEADER_CONTENT_ENCODING)) {
				httpReader.size = Number(contentLength);
			} else {
				await getRequestData(httpReader, httpReader.options);
			}
		}
	}

	async function sendFetchRequest(method, { fetch: fetchFunction = fetch, options, url }, headers) {
		const response = await fetchFunction(url, Object.assign({}, options, { method, headers }));
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
			request.addEventListener("error", event => reject(event.detail ? event.detail.error : new Error("Network error")), false);
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
				reader: options.useXHR && !options.fetch ? new XHRReader(url, options) : new FetchReader(url, options)
			});
		}

		set size(value) {
			// ignored
		}

		get size() {
			return this.reader.size;
		}

		async init() {
			await this.reader.init();
			super.init();
		}

		createReadable(options) {
			return this.reader.createReadable(options);
		}

		readUint8Array(index, length) {
			return this.reader.readUint8Array(index, length);
		}
	}

	class HttpRangeReader extends HttpReader {

		constructor(url, options = {}) {
			super(url, Object.assign({}, options, { useRangeHeader: true }));
		}
	}


	class Uint8ArrayReader extends Reader {

		constructor(array) {
			super();
			array = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
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

		constructor(defaultBufferSize) {
			super();
			this.defaultBufferSize = defaultBufferSize || DEFAULT_BUFFER_SIZE;
		}

		init(initSize = 0) {
			Object.assign(this, {
				offset: 0,
				array: new Uint8Array(initSize > 0 ? initSize : this.defaultBufferSize)
			});
			super.init();
		}

		writeUint8Array(array) {
			const writer = this;
			const requiredLength = writer.offset + array.length;
			if (requiredLength > writer.array.length) {
				let newLength = writer.array.length ? writer.array.length * 2 : writer.defaultBufferSize;
				while (newLength < requiredLength) {
					newLength *= 2;
				}
				const previousArray = writer.array;
				writer.array = new Uint8Array(newLength);
				writer.array.set(previousArray);
			}
			writer.array.set(array, writer.offset);
			writer.offset += array.length;
		}

		getData() {
			if (this.offset === this.array.length) {
				return this.array;
			} else {
				return this.array.slice(0, this.offset);
			}
		}
	}

	class SplitDataReader extends Reader {

		constructor(readers) {
			super();
			this.readers = readers;
		}

		async init() {
			const reader = this;
			const { readers } = reader;
			reader.lastDiskNumber = 0;
			await Promise.all(readers.map(diskReader => initStream(diskReader)));
			reader.diskOffsets = readers.map(diskReader => {
				const diskOffset = reader.size;
				reader.size += diskReader.size;
				return diskOffset;
			});
			super.init();
		}

		getDiskOffset(diskNumber) {
			const { diskOffsets, size } = this;
			const diskOffset = diskOffsets.at(diskNumber);
			return diskOffset === UNDEFINED_VALUE ? size : diskOffset;
		}

		async readUint8Array(offset, length) {
			const reader = this;
			const { readers } = this;
			let result;
			let currentDiskNumber = 0;
			let currentReaderOffset = offset;
			while (readers[currentDiskNumber] && currentReaderOffset >= readers[currentDiskNumber].size) {
				currentReaderOffset -= readers[currentDiskNumber].size;
				currentDiskNumber++;
			}
			const currentReader = readers[currentDiskNumber];
			if (currentReader) {
				const currentReaderSize = currentReader.size;
				if (currentReaderOffset + length <= currentReaderSize) {
					result = await readUint8Array(currentReader, currentReaderOffset, length);
				} else {
					const chunkLength = currentReaderSize - currentReaderOffset;
					const firstPart = await readUint8Array(currentReader, currentReaderOffset, chunkLength);
					const secondPart = await reader.readUint8Array(offset + chunkLength, length - chunkLength);
					result = concat(firstPart, secondPart);
				}
			} else {
				result = EMPTY_UINT8_ARRAY;
			}
			reader.lastDiskNumber = Math.max(currentDiskNumber, reader.lastDiskNumber);
			return result;
		}
	}

	class SplitDataWriter extends Stream {

		constructor(writerGenerator, maxSize = 4294967295) {
			super();
			const writer = this;
			Object.assign(writer, {
				diskNumber: 0,
				diskOffset: 0,
				size: 0,
				maxSize,
				availableSize: maxSize
			});
			let diskSourceWriter, diskWritable, diskWriter;
			const writable = new WritableStream({
				async write(chunk) {
					if (chunk === DISK_BOUNDARY) {
						if (diskWriter) {
							await endDisk();
						}
						return;
					}
					const { availableSize } = writer;
					if (!diskWriter) {
						const { value, done } = await writerGenerator.next();
						if (done && !value) {
							throw new Error(ERR_ITERATOR_COMPLETED_TOO_SOON);
						} else {
							diskSourceWriter = value;
							diskSourceWriter.size = 0;
							if (diskSourceWriter.maxSize) {
								writer.maxSize = diskSourceWriter.maxSize;
							}
							writer.availableSize = writer.maxSize;
							await initStream(diskSourceWriter);
							diskWritable = value.writable;
							diskWriter = diskWritable.getWriter();
						}
						await this.write(chunk);
					} else if (chunk.length >= availableSize) {
						await writeChunk(chunk.subarray(0, availableSize));
						await endDisk();
						if (chunk.length > availableSize) {
							await this.write(chunk.subarray(availableSize));
						}
					} else {
						await writeChunk(chunk);
					}
				},
				async close() {
					if (diskWriter) {
						await diskWriter.ready;
						await closeDiskWriter();
					}
				},
				async abort(reason) {
					if (diskWriter) {
						await diskWriter.abort(reason);
					}
				}
			});
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
				get() {
					return writable;
				}
			});

			async function writeChunk(chunk) {
				const chunkLength = chunk.length;
				if (chunkLength) {
					await diskWriter.ready;
					await diskWriter.write(chunk);
					diskSourceWriter.size += chunkLength;
					writer.availableSize -= chunkLength;
				}
			}

			async function endDisk() {
				await closeDiskWriter();
				writer.diskOffset += diskSourceWriter.size;
				writer.diskNumber++;
				diskWriter = null;
				writer.availableSize = writer.maxSize;
			}

			async function closeDiskWriter() {
				await diskWriter.close();
			}
		}

		async closeDisk() {
			const streamWriter = this.writable.getWriter();
			try {
				await streamWriter.ready;
				await streamWriter.write(DISK_BOUNDARY);
			} finally {
				streamWriter.releaseLock();
			}
		}
	}

	class GenericReader {

		constructor(reader) {
			if (Array.isArray(reader)) {
				reader = new SplitDataReader(reader);
			}
			if (reader instanceof ReadableStream) {
				reader = {
					readable: reader
				};
			}
			return reader;
		}
	}

	class GenericWriter {

		constructor(writer) {
			if (writer.writable === UNDEFINED_VALUE && typeof writer.next == FUNCTION_TYPE) {
				writer = new SplitDataWriter(writer);
			}
			if (writer instanceof WritableStream) {
				writer = {
					writable: writer
				};
			}
			if (writer.size === UNDEFINED_VALUE) {
				writer.size = 0;
			}
			return writer;
		}
	}

	function isHttpFamily(url) {
		const { baseURI } = getConfiguration();
		const { protocol } = new URL(url, baseURI);
		return protocol == "http:" || protocol == "https:";
	}

	async function initStream(stream, initSize) {
		if (stream.init && !stream.initialized) {
			await stream.init(initSize);
		} else {
			return Promise.resolve();
		}
	}

	function readUint8Array(reader, offset, size) {
		return reader.readUint8Array(offset, size);
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

	const CP437 = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split("");
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
			return new TextDecoder(encoding, { ignoreBOM: true }).decode(value);
		}
	}

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

	const PROPERTY_NAME_FILENAME = "filename";
	const PROPERTY_NAME_RAW_FILENAME = "rawFilename";
	const PROPERTY_NAME_COMMENT = "comment";
	const PROPERTY_NAME_RAW_COMMENT = "rawComment";
	const PROPERTY_NAME_UNCOMPRESSED_SIZE = "uncompressedSize";
	const PROPERTY_NAME_COMPRESSED_SIZE = "compressedSize";
	const PROPERTY_NAME_OFFSET = "offset";
	const PROPERTY_NAME_DISK_NUMBER_START = "diskNumberStart";
	const PROPERTY_NAME_LAST_MODIFICATION_DATE = "lastModDate";
	const PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE = "rawLastModDate";
	const PROPERTY_NAME_LAST_ACCESS_DATE = "lastAccessDate";
	const PROPERTY_NAME_RAW_LAST_ACCESS_DATE = "rawLastAccessDate";
	const PROPERTY_NAME_CREATION_DATE = "creationDate";
	const PROPERTY_NAME_RAW_CREATION_DATE = "rawCreationDate";
	const PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES = "internalFileAttributes";
	const PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES = "externalFileAttributes";
	const PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW = "msdosAttributesRaw";
	const PROPERTY_NAME_MSDOS_ATTRIBUTES = "msdosAttributes";
	const PROPERTY_NAME_MS_DOS_COMPATIBLE = "msDosCompatible";
	const PROPERTY_NAME_ZIP64 = "zip64";
	const PROPERTY_NAME_ENCRYPTED = "encrypted";
	const PROPERTY_NAME_VERSION = "version";
	const PROPERTY_NAME_VERSION_MADE_BY = "versionMadeBy";
	const PROPERTY_NAME_ZIPCRYPTO = "zipCrypto";
	const PROPERTY_NAME_DIRECTORY = "directory";
	const PROPERTY_NAME_EXECUTABLE = "executable";
	const PROPERTY_NAME_COMPRESSION_METHOD = "compressionMethod";
	const PROPERTY_NAME_SIGNATURE = "signature";
	const PROPERTY_NAME_EXTRA_FIELD = "extraField";
	const PROPERTY_NAME_EXTRA_FIELD_INFOZIP = "extraFieldInfoZip";
	const PROPERTY_NAME_EXTRA_FIELD_UNIX = "extraFieldUnix";
	const PROPERTY_NAME_UID = "uid";
	const PROPERTY_NAME_GID = "gid";
	const PROPERTY_NAME_UNIX_MODE = "unixMode";
	const PROPERTY_NAME_SETUID = "setuid";
	const PROPERTY_NAME_SETGID = "setgid";
	const PROPERTY_NAME_STICKY = "sticky";
	const PROPERTY_NAME_BITFLAG = "bitFlag";
	const PROPERTY_NAME_FILENAME_UTF8 = "filenameUTF8";
	const PROPERTY_NAME_COMMENT_UTF8 = "commentUTF8";
	const PROPERTY_NAME_RAW_EXTRA_FIELD = "rawExtraField";
	const PROPERTY_NAME_EXTRA_FIELD_ZIP64 = "extraFieldZip64";
	const PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH = "extraFieldUnicodePath";
	const PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT = "extraFieldUnicodeComment";
	const PROPERTY_NAME_EXTRA_FIELD_AES = "extraFieldAES";
	const PROPERTY_NAME_EXTRA_FIELD_NTFS = "extraFieldNTFS";
	const PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP = "extraFieldExtendedTimestamp";

	const PROPERTY_NAMES = [
		PROPERTY_NAME_FILENAME,
		PROPERTY_NAME_RAW_FILENAME,
		PROPERTY_NAME_UNCOMPRESSED_SIZE,
		PROPERTY_NAME_COMPRESSED_SIZE,
		PROPERTY_NAME_LAST_MODIFICATION_DATE,
		PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE,
		PROPERTY_NAME_COMMENT,
		PROPERTY_NAME_RAW_COMMENT,
		PROPERTY_NAME_LAST_ACCESS_DATE,
		PROPERTY_NAME_CREATION_DATE,
		PROPERTY_NAME_RAW_CREATION_DATE,
		PROPERTY_NAME_OFFSET,
		PROPERTY_NAME_DISK_NUMBER_START,
		PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES,
		PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES,
		PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW,
		PROPERTY_NAME_MSDOS_ATTRIBUTES,
		PROPERTY_NAME_MS_DOS_COMPATIBLE,
		PROPERTY_NAME_ZIP64,
		PROPERTY_NAME_ENCRYPTED,
		PROPERTY_NAME_VERSION,
		PROPERTY_NAME_VERSION_MADE_BY,
		PROPERTY_NAME_ZIPCRYPTO,
		PROPERTY_NAME_DIRECTORY,
		PROPERTY_NAME_EXECUTABLE,
		PROPERTY_NAME_COMPRESSION_METHOD,
		PROPERTY_NAME_SIGNATURE,
		PROPERTY_NAME_EXTRA_FIELD,
		PROPERTY_NAME_EXTRA_FIELD_UNIX,
		PROPERTY_NAME_EXTRA_FIELD_INFOZIP,
		PROPERTY_NAME_UID,
		PROPERTY_NAME_GID,
		PROPERTY_NAME_UNIX_MODE,
		PROPERTY_NAME_SETUID,
		PROPERTY_NAME_SETGID,
		PROPERTY_NAME_STICKY,
		PROPERTY_NAME_BITFLAG,
		PROPERTY_NAME_FILENAME_UTF8,
		PROPERTY_NAME_COMMENT_UTF8,
		PROPERTY_NAME_RAW_EXTRA_FIELD,
		PROPERTY_NAME_EXTRA_FIELD_ZIP64,
		PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH,
		PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT,
		PROPERTY_NAME_EXTRA_FIELD_AES,
		PROPERTY_NAME_EXTRA_FIELD_NTFS,
		PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP
	];

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

	const OPTION_FILENAME_ENCODING = "filenameEncoding";
	const OPTION_COMMENT_ENCODING = "commentEncoding";
	const OPTION_DECODE_TEXT = "decodeText";
	const OPTION_EXTRACT_PREPENDED_DATA = "extractPrependedData";
	const OPTION_EXTRACT_APPENDED_DATA = "extractAppendedData";
	const OPTION_PASSWORD = "password";
	const OPTION_RAW_PASSWORD = "rawPassword";
	const OPTION_PASS_THROUGH = "passThrough";
	const OPTION_SIGNAL = "signal";
	const OPTION_CHECK_PASSWORD_ONLY = "checkPasswordOnly";
	const OPTION_CHECK_OVERLAPPING_ENTRY_ONLY = "checkOverlappingEntryOnly";
	const OPTION_CHECK_OVERLAPPING_ENTRY = "checkOverlappingEntry";
	const OPTION_CHECK_AMBIGUITY = "checkAmbiguity";
	const OPTION_CHECK_SIGNATURE = "checkSignature";
	const OPTION_USE_WEB_WORKERS = "useWebWorkers";
	const OPTION_USE_COMPRESSION_STREAM = "useCompressionStream";
	const OPTION_TRANSFER_STREAMS = "transferStreams";
	const OPTION_PREVENT_CLOSE = "preventClose";
	const OPTION_ENCRYPTION_STRENGTH = "encryptionStrength";
	const OPTION_EXTENDED_TIMESTAMP = "extendedTimestamp";
	const OPTION_NTFS_TIMESTAMP = "ntfsTimestamp";
	const OPTION_KEEP_ORDER = "keepOrder";
	const OPTION_LEVEL = "level";
	const OPTION_BUFFERED_WRITE = "bufferedWrite";
	const OPTION_CREATE_TEMP_STREAM = "createTempStream";
	const OPTION_DATA_DESCRIPTOR_SIGNATURE = "dataDescriptorSignature";
	const OPTION_USE_UNICODE_FILE_NAMES = "useUnicodeFileNames";
	const OPTION_DATA_DESCRIPTOR = "dataDescriptor";
	const OPTION_SUPPORT_ZIP64_SPLIT_FILE = "supportZip64SplitFile";
	const OPTION_ENCODE_TEXT = "encodeText";
	const OPTION_OFFSET = "offset";
	const OPTION_USDZ = "usdz";
	const OPTION_UNIX_EXTRA_FIELD_TYPE = "unixExtraFieldType";
	const OPTION_STRICTNESS = "strictness";
	const OPTION_MAX_APPENDED_DATA_SIZE = "maxAppendedDataSize";
	const STRICTNESS_STRICT = "strict";
	const STRICTNESS_BALANCED = "balanced";
	const STRICTNESS_TOLERANT = "tolerant";

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


	const ERR_BAD_FORMAT = "File format is not recognized";
	const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
	const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
	const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
	const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
	const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
	const ERR_ENCRYPTED = "File contains encrypted entry";
	const ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
	const ERR_UNSUPPORTED_COMPRESSION$1 = "Compression method not supported";
	const ERR_SPLIT_ZIP_FILE = "Split zip file";
	const ERR_OVERLAPPING_ENTRY = "Overlapping entry found";
	const ERR_AMBIGUOUS_ARCHIVE = "Ambiguous archive";
	const CHARSET_UTF8 = "utf-8";
	const PROPERTY_NAME_UTF8_SUFFIX = "UTF8";
	const CHARSET_CP437 = "cp437";
	const BITFLAG_AMBIGUITY_MASK = BITFLAG_ENCRYPTED | BITFLAG_DATA_DESCRIPTOR | BITFLAG_LANG_ENCODING_FLAG;
	const ZIP64_PROPERTIES = [
		[PROPERTY_NAME_UNCOMPRESSED_SIZE, MAX_32_BITS],
		[PROPERTY_NAME_COMPRESSED_SIZE, MAX_32_BITS],
		[PROPERTY_NAME_OFFSET, MAX_32_BITS],
		[PROPERTY_NAME_DISK_NUMBER_START, MAX_16_BITS]
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
			Object.assign(this, {
				reader: new GenericReader(reader),
				options,
				config: getConfiguration(),
				readRanges: new Map()
			});
		}

		async* getEntriesGenerator(options = {}) {
			const zipReader = this;
			let { reader } = zipReader;
			const { config } = zipReader;
			await initStream(reader);
			if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
				reader = new BlobReader(await new Response(reader.readable).blob());
				await initStream(reader);
			}
			if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const strictness = getStrictness(getOptionValue$1(zipReader, options, OPTION_STRICTNESS), getOptionValue$1(zipReader, options, OPTION_CHECK_AMBIGUITY));
			const checkAmbiguity = strictness == STRICTNESS_STRICT;
			const rejectAmbiguousEndOfDirectory = strictness != STRICTNESS_TOLERANT;
			const maxAppendedDataSize = getMaxAppendedDataSize(getOptionValue$1(zipReader, options, OPTION_MAX_APPENDED_DATA_SIZE), strictness);
			const { endOfDirectoryInfo, endOfDirectoryReachingEndCount } = await findEndOfCentralDirectory(reader, rejectAmbiguousEndOfDirectory, maxAppendedDataSize);
			if (!endOfDirectoryInfo) {
				const signatureArray = await readUint8Array(reader, 0, 4);
				const signatureView = getDataView(signatureArray);
				if (getUint32(signatureView) == SPLIT_ZIP_FILE_SIGNATURE) {
					throw new Error(ERR_SPLIT_ZIP_FILE);
				} else {
					throw new Error(ERR_EOCDR_NOT_FOUND);
				}
			}
			if (rejectAmbiguousEndOfDirectory && endOfDirectoryReachingEndCount > 1) {
				throwAmbiguousArchive("multiple end of central directory records");
			}
			const endOfDirectoryView = getDataView(endOfDirectoryInfo);
			let directoryDataLength = getUint32(endOfDirectoryView, 12);
			let directoryDataOffset = getUint32(endOfDirectoryView, 16);
			const commentOffset = endOfDirectoryInfo.offset;
			const commentLength = getUint16(endOfDirectoryView, 20);
			const appendedDataOffset = commentOffset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
			if (reader.size - appendedDataOffset > maxAppendedDataSize) {
				throwAmbiguousArchive("appended data");
			}
			let lastDiskNumber = getUint16(endOfDirectoryView, 4);
			const expectedLastDiskNumber = reader.lastDiskNumber || 0;
			let diskNumber = getUint16(endOfDirectoryView, 6);
			let filesLength = getUint16(endOfDirectoryView, 10);
			let prependedDataLength = 0;
			let startOffset;
			let zip64EndOfDirectory;
			const requiresZip64 = directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS || diskNumber == MAX_16_BITS;
			if (directoryDataOffset != MAX_32_BITS && diskNumber != MAX_16_BITS) {
				directoryDataOffset += getDiskOffset$1(reader, diskNumber);
			}
			if (requiresZip64) {
				const endOfDirectoryLocatorArray = endOfDirectoryInfo.offset >= ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH ?
					await readUint8Array(reader, endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH) :
					EMPTY_UINT8_ARRAY;
				const endOfDirectoryLocatorView = getDataView(endOfDirectoryLocatorArray);
				if (endOfDirectoryLocatorArray.length == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH &&
					getUint32(endOfDirectoryLocatorView, 0) == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
					directoryDataOffset = getDiskOffset$1(reader, getUint32(endOfDirectoryLocatorView, 4)) + getBigUint64(endOfDirectoryLocatorView, 8);
					let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
					let endOfDirectoryView = getDataView(endOfDirectoryArray);
					const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
					if ((endOfDirectoryArray.length < ZIP64_END_OF_CENTRAL_DIR_LENGTH || getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) &&
						directoryDataOffset != expectedDirectoryDataOffset && expectedDirectoryDataOffset >= 0) {
						const originalDirectoryDataOffset = directoryDataOffset;
						directoryDataOffset = expectedDirectoryDataOffset;
						if (directoryDataOffset > originalDirectoryDataOffset) {
							prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
						}
						endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
						endOfDirectoryView = getDataView(endOfDirectoryArray);
					}
					if (endOfDirectoryArray.length < ZIP64_END_OF_CENTRAL_DIR_LENGTH || getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
						throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
					}
					zip64EndOfDirectory = true;
					if (lastDiskNumber == MAX_16_BITS) {
						lastDiskNumber = getUint32(endOfDirectoryView, 16);
					} else if (checkAmbiguity && lastDiskNumber != getUint32(endOfDirectoryView, 16)) {
						throwAmbiguousArchive("mismatched zip64 end of central directory record");
					}
					if (diskNumber == MAX_16_BITS) {
						diskNumber = getUint32(endOfDirectoryView, 20);
					} else if (checkAmbiguity && diskNumber != getUint32(endOfDirectoryView, 20)) {
						throwAmbiguousArchive("mismatched zip64 end of central directory record");
					}
					if (filesLength == MAX_16_BITS) {
						filesLength = getBigUint64(endOfDirectoryView, 32);
					} else if (checkAmbiguity && filesLength != getBigUint64(endOfDirectoryView, 32)) {
						throwAmbiguousArchive("mismatched zip64 end of central directory record");
					}
					if (directoryDataLength == MAX_32_BITS) {
						directoryDataLength = getBigUint64(endOfDirectoryView, 40);
					} else if (checkAmbiguity && directoryDataLength != getBigUint64(endOfDirectoryView, 40)) {
						throwAmbiguousArchive("mismatched zip64 end of central directory record");
					}
					directoryDataOffset = getDiskOffset$1(reader, diskNumber) + getBigUint64(endOfDirectoryView, 48) + prependedDataLength;
				}
			}
			const declaredDirectoryDataLength = directoryDataLength;
			const centralDirectoryEndOffset = endOfDirectoryInfo.offset -
				(zip64EndOfDirectory ? ZIP64_END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH : 0);
			if (directoryDataOffset >= reader.size) {
				prependedDataLength = reader.size - directoryDataOffset - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
				directoryDataOffset = reader.size - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
			}
			if (expectedLastDiskNumber != lastDiskNumber) {
				throw new Error(ERR_SPLIT_ZIP_FILE);
			}
			if (directoryDataOffset < 0) {
				throw new Error(ERR_BAD_FORMAT);
			}
			let offset = 0;
			let directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
			let directoryView = getDataView(directoryArray);
			if (directoryDataLength) {
				if (directoryArray.length < 4) {
					throw new Error(ERR_BAD_FORMAT);
				}
				const expectedDirectoryDataOffset = centralDirectoryEndOffset - directoryDataLength;
				if (directoryDataOffset != expectedDirectoryDataOffset && diskNumber == lastDiskNumber) {
					const storedPointsAtDirectory = getUint32(directoryView, offset) == CENTRAL_FILE_HEADER_SIGNATURE;
					let reconcile = !storedPointsAtDirectory;
					if (!reconcile && expectedDirectoryDataOffset >= 0 && expectedDirectoryDataOffset + 4 <= reader.size) {
						const expectedSignatureArray = await readUint8Array(reader, expectedDirectoryDataOffset, 4);
						reconcile = getUint32(getDataView(expectedSignatureArray), 0) == CENTRAL_FILE_HEADER_SIGNATURE;
					}
					if (reconcile) {
						const originalDirectoryDataOffset = directoryDataOffset;
						directoryDataOffset = expectedDirectoryDataOffset;
						if (directoryDataOffset > originalDirectoryDataOffset) {
							prependedDataLength += directoryDataOffset - originalDirectoryDataOffset;
						}
						directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
						directoryView = getDataView(directoryArray);
					}
				}
			}
			const expectedDirectoryDataLength = centralDirectoryEndOffset - directoryDataOffset;
			if (directoryDataLength != expectedDirectoryDataLength && expectedDirectoryDataLength >= 0 && diskNumber == lastDiskNumber) {
				directoryDataLength = expectedDirectoryDataLength;
				directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
				directoryView = getDataView(directoryArray);
			}
			if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
				throw new Error(ERR_BAD_FORMAT);
			}
			startOffset = directoryDataOffset;
			const filenameEncoding = getOptionValue$1(zipReader, options, OPTION_FILENAME_ENCODING);
			const commentEncoding = getOptionValue$1(zipReader, options, OPTION_COMMENT_ENCODING);
			const filenames = checkAmbiguity ? new Set() : UNDEFINED_VALUE;
			let duplicateFilename;
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const fileEntry = new ZipEntry(reader, config, zipReader.options);
				if (offset + CENTRAL_FILE_HEADER_LENGTH > directoryArray.length || getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
					throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
				}
				readCommonHeader(fileEntry, directoryView, offset + 6);
				const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
				const filenameOffset = offset + CENTRAL_FILE_HEADER_LENGTH;
				const extraFieldOffset = filenameOffset + fileEntry.filenameLength;
				const commentOffset = extraFieldOffset + fileEntry.extraFieldLength;
				const versionMadeBy = getUint16(directoryView, offset + 4);
				const msDosCompatible = versionMadeBy >> 8 == 0;
				const unixCompatible = versionMadeBy >> 8 == 3;
				const rawFilename = directoryArray.subarray(filenameOffset, extraFieldOffset);
				const commentLength = getUint16(directoryView, offset + 32);
				const endOffset = commentOffset + commentLength;
				const rawComment = directoryArray.subarray(commentOffset, endOffset);
				const filenameUTF8 = languageEncodingFlag;
				const commentUTF8 = languageEncodingFlag;
				const externalFileAttributes = getUint32(directoryView, offset + 38);
				const msdosAttributesRaw = externalFileAttributes & MAX_8_BITS;
				const msdosAttributes = {
					readOnly: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_READONLY_MASK),
					hidden: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_HIDDEN_MASK),
					system: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_SYSTEM_MASK),
					directory: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_DIR_MASK),
					archive: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_ARCHIVE_MASK)
				};
				const offsetFileEntry = getUint32(directoryView, offset + 42);
				const decode = getOptionValue$1(zipReader, options, OPTION_DECODE_TEXT) || decodeText;
				const rawFilenameEncoding = filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437;
				const rawCommentEncoding = commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437;
				let filename = decode(rawFilename, rawFilenameEncoding);
				if (filename === UNDEFINED_VALUE) {
					filename = decodeText(rawFilename, rawFilenameEncoding);
				}
				let comment = decode(rawComment, rawCommentEncoding);
				if (comment === UNDEFINED_VALUE) {
					comment = decodeText(rawComment, rawCommentEncoding);
				}
				Object.assign(fileEntry, {
					index: indexFile,
					versionMadeBy,
					msDosCompatible,
					compressedSize: 0,
					uncompressedSize: 0,
					commentLength,
					offset: offsetFileEntry,
					diskNumberStart: getUint16(directoryView, offset + 34),
					internalFileAttributes: getUint16(directoryView, offset + 36),
					externalFileAttributes,
					msdosAttributesRaw,
					msdosAttributes,
					rawFilename,
					filenameUTF8,
					commentUTF8,
					rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset),
					rawComment,
					filename,
					comment
				});
				readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
				fileEntry.offset += prependedDataLength;
				startOffset = Math.min(getDiskOffset$1(reader, fileEntry.diskNumberStart) + fileEntry.offset, startOffset);
				if (checkAmbiguity) {
					if (filenames.has(fileEntry.filename)) {
						duplicateFilename = true;
					}
					filenames.add(fileEntry.filename);
				}
				const unixExternalUpper = (fileEntry.externalFileAttributes >> 16) & MAX_16_BITS;
				if (fileEntry.unixMode === UNDEFINED_VALUE && (unixExternalUpper & (FILE_ATTR_UNIX_DEFAULT_MASK | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_TYPE_DIR)) != 0) {
					fileEntry.unixMode = unixExternalUpper;
				}
				const setuid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETUID_MASK);
				const setgid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETGID_MASK);
				const sticky = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_STICKY_MASK);
				const executable = (fileEntry.unixMode !== UNDEFINED_VALUE)
					? ((fileEntry.unixMode & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0)
					: (unixCompatible && ((unixExternalUpper & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0));
				const modeIsDir = fileEntry.unixMode !== UNDEFINED_VALUE && ((fileEntry.unixMode & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR);
				const upperIsDir = ((unixExternalUpper & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR);
				Object.assign(fileEntry, {
					setuid,
					setgid,
					sticky,
					unixExternalUpper,
					internalFileAttribute: fileEntry.internalFileAttributes,
					externalFileAttribute: fileEntry.externalFileAttributes,
					executable,
					directory: modeIsDir || upperIsDir || (msDosCompatible && msdosAttributes.directory) || (fileEntry.filename.endsWith(DIRECTORY_SIGNATURE) && !fileEntry.uncompressedSize),
					zipCrypto: fileEntry.encrypted && !fileEntry.extraFieldAES
				});
				const entry = new Entry(fileEntry);
				entry.getData = (writer, options) => fileEntry.getData(writer, entry, zipReader.readRanges, options);
				entry.arrayBuffer = async options => {
					const writer = new TransformStream();
					const [arrayBuffer] = await Promise.all([
						new Response(writer.readable).arrayBuffer(),
						fileEntry.getData(writer, entry, zipReader.readRanges, options)]);
					return arrayBuffer;
				};
				offset = endOffset;
				const { onprogress } = options;
				if (onprogress) {
					try {
						await onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
					} catch {
						// ignored
					}
				}
				yield entry;
			}
			if (checkAmbiguity && offset != declaredDirectoryDataLength) {
				throwAmbiguousArchive("trailing central directory data");
			}
			if (duplicateFilename) {
				throwAmbiguousArchive("duplicate filename");
			}
			if (checkAmbiguity && (prependedDataLength || (filesLength && startOffset > 0))) {
				throwAmbiguousArchive("prepended data");
			}
			const extractPrependedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_PREPENDED_DATA);
			const extractAppendedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_APPENDED_DATA);
			if (extractPrependedData) {
				zipReader.prependedData = startOffset > 0 ? await readUint8Array(reader, 0, startOffset) : EMPTY_UINT8_ARRAY;
			}
			zipReader.comment = commentLength ? await readUint8Array(reader, commentOffset + END_OF_CENTRAL_DIR_LENGTH, commentLength) : EMPTY_UINT8_ARRAY;
			if (extractAppendedData) {
				zipReader.appendedData = appendedDataOffset < reader.size ? await readUint8Array(reader, appendedDataOffset, reader.size - appendedDataOffset) : EMPTY_UINT8_ARRAY;
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

	class ZipReaderStream {

		constructor(options = {}) {
			const { readable, writable } = new TransformStream();
			const gen = new ZipReader(readable, options).getEntriesGenerator();
			this.readable = new ReadableStream({
				async pull(controller) {
					const { done, value } = await gen.next();
					if (done)
						return controller.close();
					const chunk = {
						...value,
						readable: (function () {
							const { readable, writable } = new TransformStream();
							if (value.getData) {
								getData();
								return readable;
							}

							async function getData() {
								try {
									await value.getData(writable);
								} catch (error) {
									try {
										await writable.abort(error);
									} catch {
										// ignored
									}
								}
							}
						})()
					};
					delete chunk.getData;
					controller.enqueue(chunk);
				}
			});
			this.writable = writable;
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

		async getData(writer, fileEntry, readRanges, options = {}) {
			const zipEntry = this;
			const {
				reader,
				index,
				offset,
				diskNumberStart,
				extraFieldAES,
				extraFieldZip64,
				compressionMethod,
				config,
				bitFlag,
				signature,
				rawLastModDate,
				uncompressedSize,
				compressedSize
			} = zipEntry;
			const {
				dataDescriptor
			} = bitFlag;
			const localDirectory = fileEntry.localDirectory = {};
			const localHeaderOffset = getDiskOffset$1(reader, diskNumberStart) + offset;
			const dataArray = await readUint8Array(reader, localHeaderOffset, HEADER_SIZE);
			const dataView = getDataView(dataArray);
			let password = getOptionValue$1(zipEntry, options, OPTION_PASSWORD);
			let rawPassword = getOptionValue$1(zipEntry, options, OPTION_RAW_PASSWORD);
			const passThrough = getOptionValue$1(zipEntry, options, OPTION_PASS_THROUGH);
			password = password && password.length && password;
			rawPassword = rawPassword && rawPassword.length && rawPassword;
			if (extraFieldAES) {
				if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
					throw new Error(ERR_UNSUPPORTED_COMPRESSION$1);
				}
			}
			const registeredCodec = passThrough ? UNDEFINED_VALUE : getRegisteredCodec(compressionMethod);
			if ((compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE && compressionMethod != COMPRESSION_METHOD_DEFLATE_64 && !registeredCodec) && !passThrough) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION$1);
			}
			if (dataArray.length < HEADER_SIZE || getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
				throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
			}
			readCommonHeader(localDirectory, dataView, 4);
			const {
				extraFieldLength,
				filenameLength
			} = localDirectory;
			const checkAmbiguity = getStrictness(getOptionValue$1(zipEntry, options, OPTION_STRICTNESS), getOptionValue$1(zipEntry, options, OPTION_CHECK_AMBIGUITY)) == STRICTNESS_STRICT;
			let rawLocalFilename = EMPTY_UINT8_ARRAY;
			if (checkAmbiguity && (filenameLength || extraFieldLength)) {
				const trailingDataArray = await readUint8Array(reader, localHeaderOffset + HEADER_SIZE, filenameLength + extraFieldLength);
				rawLocalFilename = trailingDataArray.subarray(0, filenameLength);
				localDirectory.rawExtraField = trailingDataArray.subarray(filenameLength);
			} else {
				localDirectory.rawExtraField = extraFieldLength ?
					await readUint8Array(reader, localHeaderOffset + HEADER_SIZE + filenameLength, extraFieldLength) :
					EMPTY_UINT8_ARRAY;
			}
			readCommonFooter(zipEntry, localDirectory, dataView, 4, true);
			if (checkAmbiguity) {
				checkLocalDirectory(zipEntry, localDirectory, rawLocalFilename);
			}
			const { lastAccessDate, creationDate } = localDirectory;
			if (lastAccessDate) {
				fileEntry.lastAccessDate = lastAccessDate;
			}
			if (creationDate) {
				fileEntry.creationDate = creationDate;
			}
			const encrypted = zipEntry.encrypted && localDirectory.encrypted && !passThrough;
			const zipCrypto = encrypted && !extraFieldAES;
			if (!passThrough) {
				fileEntry.zipCrypto = zipCrypto;
			}
			if (encrypted) {
				if (!zipCrypto && (extraFieldAES.strength < 1 || extraFieldAES.strength > 3)) {
					throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
				} else if (!password && !rawPassword) {
					throw new Error(ERR_ENCRYPTED);
				}
			}
			const dataOffset = localHeaderOffset + HEADER_SIZE + filenameLength + extraFieldLength;
			const size = compressedSize;
			const readable = reader.createReadable({ offset: dataOffset, size });
			const signal = getOptionValue$1(zipEntry, options, OPTION_SIGNAL);
			const checkPasswordOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_PASSWORD_ONLY);
			let checkOverlappingEntry = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY);
			const checkOverlappingEntryOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY);
			if (checkOverlappingEntryOnly) {
				checkOverlappingEntry = true;
			}
			const { onstart, onprogress, onend } = options;
			const deflate64 = compressionMethod == COMPRESSION_METHOD_DEFLATE_64;
			let useCompressionStream = getOptionValue$1(zipEntry, options, OPTION_USE_COMPRESSION_STREAM);
			if (deflate64) {
				useCompressionStream = false;
			}
			const workerOptions = {
				options: {
					codecType: CODEC_INFLATE,
					password,
					rawPassword,
					zipCrypto,
					encryptionStrength: extraFieldAES && extraFieldAES.strength,
					signed: getOptionValue$1(zipEntry, options, OPTION_CHECK_SIGNATURE) && !passThrough,
					passwordVerification: zipCrypto && (dataDescriptor ? ((rawLastModDate >>> 8) & MAX_8_BITS) : ((signature >>> 24) & MAX_8_BITS)),
					outputSize: passThrough ? compressedSize : uncompressedSize,
					signature,
					compressed: compressionMethod != 0 && !passThrough,
					encrypted,
					useWebWorkers: getOptionValue$1(zipEntry, options, OPTION_USE_WEB_WORKERS),
					useCompressionStream,
					transferStreams: getOptionValue$1(zipEntry, options, OPTION_TRANSFER_STREAMS),
					deflate64,
					format: registeredCodec ? registeredCodec.format : UNDEFINED_VALUE,
					codecURI: registeredCodec ? registeredCodec.codecURI : UNDEFINED_VALUE,
					checkPasswordOnly
				},
				config,
				streamOptions: { signal, size, onstart, onprogress, onend }
			};
			if (checkOverlappingEntry) {
				await detectOverlappingEntry({
					reader,
					fileEntry,
					index,
					offset: localHeaderOffset,
					signature,
					compressedSize,
					uncompressedSize,
					dataOffset,
					dataDescriptor: dataDescriptor || localDirectory.bitFlag.dataDescriptor,
					extraFieldZip64: extraFieldZip64 || localDirectory.extraFieldZip64,
					readRanges
				});
			}
			let writable;
			try {
				if (!checkOverlappingEntryOnly) {
					if (checkPasswordOnly) {
						writer = new WritableStream();
					}
					writer = new GenericWriter(writer);
					await initStream(writer, passThrough ? compressedSize : uncompressedSize);
					({ writable } = writer);
					const { outputSize } = await runWorker({ readable, writable }, workerOptions);
					writer.size += outputSize;
					if (outputSize != (passThrough ? compressedSize : uncompressedSize)) {
						throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
					}
				}
			} catch (error) {
				if (error.outputSize !== UNDEFINED_VALUE) {
					writer.size += error.outputSize;
				}
				if (!checkPasswordOnly || error.message != ERR_ABORT_CHECK_PASSWORD) {
					throw error;
				}
			} finally {
				const preventClose = getOptionValue$1(zipEntry, options, OPTION_PREVENT_CLOSE);
				if (!preventClose && writable && !writable.locked) {
					await writable.getWriter().close();
				}
			}
			return checkPasswordOnly || checkOverlappingEntryOnly ? UNDEFINED_VALUE : writer.getData ? writer.getData() : writable;
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

	function readCommonFooter(fileEntry, directory, dataView, offset, localDirectory) {
		const { rawExtraField } = directory;
		const extraField = directory.extraField = new Map();
		const rawExtraFieldView = getDataView(rawExtraField);
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
		} catch {
			// ignored
		}
		const compressionMethod = getUint16(dataView, offset + 4);
		Object.assign(directory, {
			signature: getUint32(dataView, offset + HEADER_OFFSET_SIGNATURE),
			compressedSize: getUint32(dataView, offset + HEADER_OFFSET_COMPRESSED_SIZE),
			uncompressedSize: getUint32(dataView, offset + HEADER_OFFSET_UNCOMPRESSED_SIZE)
		});
		const extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
		if (extraFieldZip64) {
			readExtraFieldZip64(extraFieldZip64, directory);
			directory.extraFieldZip64 = extraFieldZip64;
		}
		const extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
		if (extraFieldUnicodePath) {
			readExtraFieldUnicode(extraFieldUnicodePath, PROPERTY_NAME_FILENAME, PROPERTY_NAME_RAW_FILENAME, directory, fileEntry);
			directory.extraFieldUnicodePath = extraFieldUnicodePath;
		}
		const extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
		if (extraFieldUnicodeComment) {
			readExtraFieldUnicode(extraFieldUnicodeComment, PROPERTY_NAME_COMMENT, PROPERTY_NAME_RAW_COMMENT, directory, fileEntry);
			directory.extraFieldUnicodeComment = extraFieldUnicodeComment;
		}
		const extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
		if (extraFieldAES && extraFieldAES.data.length >= 7) {
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
		const extraFieldUnix = extraField.get(EXTRAFIELD_TYPE_UNIX);
		if (extraFieldUnix) {
			readExtraFieldUnix(extraFieldUnix, directory, false);
			directory.extraFieldUnix = extraFieldUnix;
		} else {
			const extraFieldInfoZip = extraField.get(EXTRAFIELD_TYPE_INFOZIP);
			if (extraFieldInfoZip) {
				readExtraFieldUnix(extraFieldInfoZip, directory, true);
				directory.extraFieldInfoZip = extraFieldInfoZip;
			}
		}
		const extraFieldExtendedTimestamp = extraField.get(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
		if (extraFieldExtendedTimestamp) {
			readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory);
			directory.extraFieldExtendedTimestamp = extraFieldExtendedTimestamp;
		}
		const extraFieldUSDZ = extraField.get(EXTRAFIELD_TYPE_USDZ);
		if (extraFieldUSDZ) {
			directory.extraFieldUSDZ = extraFieldUSDZ;
		}
	}

	function readExtraFieldZip64(extraFieldZip64, directory) {
		directory.zip64 = true;
		const extraFieldView = getDataView(extraFieldZip64.data);
		const missingProperties = ZIP64_PROPERTIES.filter(([propertyName, max]) => directory[propertyName] == max);
		const requiredLength = missingProperties.reduce((length, [, max]) => length + ZIP64_EXTRACTION[max].bytes, 0);
		if (extraFieldZip64.data.length < requiredLength) {
			throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
		}
		for (let indexMissingProperty = 0, offset = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
			const [propertyName, max] = missingProperties[indexMissingProperty];
			const extraction = ZIP64_EXTRACTION[max];
			directory[propertyName] = extraFieldZip64[propertyName] = extraction.getValue(extraFieldView, offset);
			offset += extraction.bytes;
		}
	}

	function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
		if (extraFieldUnicode.data.length < 5) {
			extraFieldUnicode.valid = false;
			return;
		}
		const extraFieldView = getDataView(extraFieldUnicode.data);
		const crc32 = new Crc32();
		crc32.append(fileEntry[rawPropertyName]);
		const dataViewSignature = getDataView(new Uint8Array(4));
		dataViewSignature.setUint32(0, crc32.get(), true);
		const signature = getUint32(extraFieldView, 1);
		Object.assign(extraFieldUnicode, {
			version: getUint8(extraFieldView, 0),
			[propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
			valid: !fileEntry.bitFlag.languageEncodingFlag && signature == getUint32(dataViewSignature, 0)
		});
		if (extraFieldUnicode.valid) {
			directory[propertyName] = extraFieldUnicode[propertyName];
			directory[propertyName + PROPERTY_NAME_UTF8_SUFFIX] = true;
		}
	}

	function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
		const extraFieldView = getDataView(extraFieldAES.data);
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
		const extraFieldView = getDataView(extraFieldNTFS.data);
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
		} catch {
			// ignored
		}
		try {
			if (tag1Data && tag1Data.length == 24) {
				const tag1View = getDataView(tag1Data);
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
		} catch {
			// ignored
		}
	}

	function readExtraFieldUnix(extraField, directory, isInfoZip) {
		try {
			const view = getDataView(extraField.data);
			let uid, gid;
			if (isInfoZip) {
				let offset = 0;
				const version = getUint8(view, offset++);
				const uidSize = getUint8(view, offset++);
				uid = unpackUnixId(extraField.data.subarray(offset, offset + uidSize));
				offset += uidSize;
				const gidSize = getUint8(view, offset++);
				gid = unpackUnixId(extraField.data.subarray(offset, offset + gidSize));
				Object.assign(extraField, { version, uid, gid });
			} else if (extraField.data.length >= 4) {
				uid = getUint16(view, 0);
				gid = getUint16(view, 2);
				Object.assign(extraField, { uid, gid });
			}
			if (uid !== UNDEFINED_VALUE) {
				directory.uid = uid;
			}
			if (gid !== UNDEFINED_VALUE) {
				directory.gid = gid;
			}
		} catch {
			// ignored
		}
	}

	function unpackUnixId(bytes) {
		const buffer = new Uint8Array(4);
		buffer.set(bytes, 0);
		const view = new DataView(buffer.buffer, buffer.byteOffset, 4);
		return view.getUint32(0, true);
	}

	function readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory) {
		if (!extraFieldExtendedTimestamp.data.length) {
			return;
		}
		const extraFieldView = getDataView(extraFieldExtendedTimestamp.data);
		const flags = getUint8(extraFieldView, 0);
		const timeProperties = [];
		const timeRawProperties = [];
		if (localDirectory) {
			if ((flags & 0x1) == 0x1) {
				timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
				timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
			}
			if ((flags & 0x2) == 0x2) {
				timeProperties.push(PROPERTY_NAME_LAST_ACCESS_DATE);
				timeRawProperties.push(PROPERTY_NAME_RAW_LAST_ACCESS_DATE);
			}
			if ((flags & 0x4) == 0x4) {
				timeProperties.push(PROPERTY_NAME_CREATION_DATE);
				timeRawProperties.push(PROPERTY_NAME_RAW_CREATION_DATE);
			}
		} else if (extraFieldExtendedTimestamp.data.length >= 5) {
			timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
			timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
		}
		let offset = 1;
		timeProperties.forEach((propertyName, indexProperty) => {
			if (extraFieldExtendedTimestamp.data.length >= offset + 4) {
				const time = getUint32(extraFieldView, offset);
				directory[propertyName] = extraFieldExtendedTimestamp[propertyName] = new Date((time | 0) * 1000);
				const rawPropertyName = timeRawProperties[indexProperty];
				extraFieldExtendedTimestamp[rawPropertyName] = time;
			}
			offset += 4;
		});
	}

	async function detectOverlappingEntry({
		reader,
		fileEntry,
		index,
		offset,
		signature,
		compressedSize,
		uncompressedSize,
		dataOffset,
		dataDescriptor,
		extraFieldZip64,
		readRanges
	}) {
		let dataDescriptorLength = 0;
		if (dataDescriptor) {
			if (extraFieldZip64) {
				dataDescriptorLength = DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH;
			} else {
				dataDescriptorLength = DATA_DESCRIPTOR_RECORD_LENGTH;
			}
		}
		if (dataDescriptorLength) {
			const dataDescriptorArray = await readUint8Array(reader, dataOffset + compressedSize, dataDescriptorLength + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH);
			const dataDescriptorSignature = dataDescriptorArray.length == dataDescriptorLength + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH &&
				getUint32(getDataView(dataDescriptorArray), 0) == DATA_DESCRIPTOR_RECORD_SIGNATURE;
			if (dataDescriptorSignature) {
				const readSignature = getUint32(getDataView(dataDescriptorArray), 4);
				let readCompressedSize;
				let readUncompressedSize;
				if (extraFieldZip64) {
					readCompressedSize = getBigUint64(getDataView(dataDescriptorArray), 8);
					readUncompressedSize = getBigUint64(getDataView(dataDescriptorArray), 16);
				} else {
					readCompressedSize = getUint32(getDataView(dataDescriptorArray), 8);
					readUncompressedSize = getUint32(getDataView(dataDescriptorArray), 12);
				}
				const matchSignature = (fileEntry.encrypted && !fileEntry.zipCrypto) || readSignature == signature;
				if (matchSignature &&
					readCompressedSize == compressedSize &&
					readUncompressedSize == uncompressedSize) {
					dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
				}
			}
		}
		const range = {
			start: offset,
			end: dataOffset + compressedSize + dataDescriptorLength,
			fileEntry
		};
		for (const [otherIndex, otherRange] of readRanges) {
			if (otherIndex != index && range.start < otherRange.end && otherRange.start < range.end) {
				const error = new Error(ERR_OVERLAPPING_ENTRY);
				error.overlappingEntry = otherRange.fileEntry;
				throw error;
			}
		}
		readRanges.set(index, range);
	}

	function getDiskOffset$1(reader, diskNumber) {
		return reader.getDiskOffset ? reader.getDiskOffset(diskNumber) : 0;
	}

	function getStrictness(strictness, checkAmbiguity) {
		if (strictness === UNDEFINED_VALUE) {
			return checkAmbiguity ? STRICTNESS_STRICT : STRICTNESS_BALANCED;
		}
		return strictness;
	}

	function getMaxAppendedDataSize(maxAppendedDataSize, strictness) {
		if (maxAppendedDataSize !== UNDEFINED_VALUE) {
			return maxAppendedDataSize;
		}
		if (strictness == STRICTNESS_STRICT) {
			return 0;
		}
		if (strictness == STRICTNESS_TOLERANT) {
			return Infinity;
		}
		return MAX_16_BITS;
	}

	const MAX_END_OF_CENTRAL_DIR_PROBES = 64;

	const CENTRAL_DIRECTORY_UNREACHABLE = 0;
	const CENTRAL_DIRECTORY_PLAUSIBLE = 1;
	const CENTRAL_DIRECTORY_REACHABLE = 2;

	async function findEndOfCentralDirectory(reader, rejectAmbiguous, maxAppendedDataSize) {
		const { size } = reader;
		const anchoredLength = Math.min(size, END_OF_CENTRAL_DIR_LENGTH + MAX_16_BITS);
		const remoteProbeBudget = { count: MAX_END_OF_CENTRAL_DIR_PROBES };
		let endOfDirectoryInfo;
		let plausibleEndOfDirectoryInfo;
		let endOfDirectoryReachingEndCount = 0;
		for await (const [anchoredView, anchoredOffset, anchoredArray, indexByte, offset] of scanEndOfCentralDirectory(reader, anchoredLength)) {
			const commentLength = getUint16(anchoredView, indexByte + 20);
			if (offset + END_OF_CENTRAL_DIR_LENGTH + commentLength == size) {
				const reachability = await getCentralDirectoryReachability(reader, anchoredView, anchoredOffset, indexByte, offset, size, remoteProbeBudget);
				if (reachability == CENTRAL_DIRECTORY_REACHABLE) {
					if (!endOfDirectoryInfo) {
						endOfDirectoryInfo = getEndOfCentralDirectoryInfo(anchoredArray, indexByte, offset);
					}
					endOfDirectoryReachingEndCount++;
					if (!rejectAmbiguous || endOfDirectoryReachingEndCount > 1) {
						break;
					}
				} else if (reachability == CENTRAL_DIRECTORY_PLAUSIBLE && !plausibleEndOfDirectoryInfo) {
					plausibleEndOfDirectoryInfo = getEndOfCentralDirectoryInfo(anchoredArray, indexByte, offset);
				}
			}
		}
		if (!endOfDirectoryInfo) {
			endOfDirectoryInfo = plausibleEndOfDirectoryInfo;
		}
		if (!endOfDirectoryInfo) {
			endOfDirectoryInfo = await seekEndOfCentralDirectory(reader, maxAppendedDataSize, remoteProbeBudget);
		}
		return { endOfDirectoryInfo, endOfDirectoryReachingEndCount };
	}

	async function seekEndOfCentralDirectory(reader, maxAppendedDataSize, remoteProbeBudget) {
		const { size } = reader;
		const searchLength = Math.min(size, maxAppendedDataSize == Infinity ? size :
			END_OF_CENTRAL_DIR_LENGTH + MAX_16_BITS + maxAppendedDataSize);
		let firstSignatureInfo, plausibleInfo;
		for await (const [searchView, searchOffset, searchArray, indexByte, offset] of scanEndOfCentralDirectory(reader, searchLength)) {
			const record = getEndOfCentralDirectoryInfo(searchArray, indexByte, offset);
			if (!firstSignatureInfo) {
				firstSignatureInfo = record;
			}
			const reachability = await getCentralDirectoryReachability(reader, searchView, searchOffset, indexByte, offset, size, remoteProbeBudget);
			if (reachability == CENTRAL_DIRECTORY_REACHABLE) {
				return record;
			}
			if (reachability == CENTRAL_DIRECTORY_PLAUSIBLE && !plausibleInfo) {
				plausibleInfo = record;
			}
		}
		return plausibleInfo || firstSignatureInfo;
	}

	async function* scanEndOfCentralDirectory(reader, scanLength) {
		const scanOffset = reader.size - scanLength;
		const scanArray = await readUint8Array(reader, scanOffset, scanLength);
		const scanView = getDataView(scanArray);
		for (let indexByte = scanArray.length - END_OF_CENTRAL_DIR_LENGTH; indexByte >= 0; indexByte--) {
			if (getUint32(scanView, indexByte) == END_OF_CENTRAL_DIR_SIGNATURE) {
				yield [scanView, scanOffset, scanArray, indexByte, scanOffset + indexByte];
			}
		}
	}

	function getEndOfCentralDirectoryInfo(scanArray, indexByte, offset) {
		return { offset, buffer: scanArray.slice(indexByte, indexByte + END_OF_CENTRAL_DIR_LENGTH).buffer };
	}

	async function getCentralDirectoryReachability(reader, view, anchoredOffset, indexByte, offset, size, remoteProbeBudget) {
		const filesLength = getUint16(view, indexByte + 10);
		const directoryDataLength = getUint32(view, indexByte + 12);
		const directoryDataOffset = getUint32(view, indexByte + 16);
		if (filesLength == MAX_16_BITS || directoryDataLength == MAX_32_BITS || directoryDataOffset == MAX_32_BITS) {
			const locatorSignature = await readSignature(reader, view, anchoredOffset, offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, size, remoteProbeBudget);
			return locatorSignature == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE ? CENTRAL_DIRECTORY_REACHABLE : CENTRAL_DIRECTORY_UNREACHABLE;
		}
		if (!filesLength && !directoryDataLength) {
			return CENTRAL_DIRECTORY_PLAUSIBLE;
		}
		const directoryDiskNumber = getUint16(view, indexByte + 6);
		for (const centralDirectoryOffset of [offset - directoryDataLength, getDiskOffset$1(reader, directoryDiskNumber) + directoryDataOffset]) {
			if (await readSignature(reader, view, anchoredOffset, centralDirectoryOffset, size, remoteProbeBudget) == CENTRAL_FILE_HEADER_SIGNATURE) {
				return CENTRAL_DIRECTORY_REACHABLE;
			}
		}
		return CENTRAL_DIRECTORY_UNREACHABLE;
	}

	async function readSignature(reader, view, anchoredOffset, signatureOffset, size, remoteProbeBudget) {
		if (signatureOffset < 0 || signatureOffset + 4 > size) {
			return UNDEFINED_VALUE;
		}
		if (signatureOffset >= anchoredOffset) {
			return getUint32(view, signatureOffset - anchoredOffset);
		}
		if (remoteProbeBudget.count > 0) {
			remoteProbeBudget.count--;
			const signatureArray = await readUint8Array(reader, signatureOffset, 4);
			return getUint32(getDataView(signatureArray), 0);
		}
		return UNDEFINED_VALUE;
	}

	function checkLocalDirectory(zipEntry, localDirectory, rawLocalFilename) {
		const { rawFilename } = zipEntry;
		if (rawLocalFilename.length != rawFilename.length ||
			rawLocalFilename.some((byteValue, indexByte) => byteValue != rawFilename[indexByte])) {
			throwAmbiguousArchive("mismatched local file header (filename)");
		}
		if ((localDirectory.rawBitFlag & BITFLAG_AMBIGUITY_MASK) != (zipEntry.rawBitFlag & BITFLAG_AMBIGUITY_MASK)) {
			throwAmbiguousArchive("mismatched local file header (general purpose bit flag)");
		}
		if (localDirectory.compressionMethod != zipEntry.compressionMethod) {
			throwAmbiguousArchive("mismatched local file header (compression method)");
		}
		if (!localDirectory.bitFlag.dataDescriptor &&
			(localDirectory.signature || localDirectory.compressedSize || localDirectory.uncompressedSize) &&
			(localDirectory.signature != zipEntry.signature ||
				localDirectory.compressedSize != zipEntry.compressedSize ||
				localDirectory.uncompressedSize != zipEntry.uncompressedSize)) {
			throwAmbiguousArchive("mismatched local file header (signature or sizes)");
		}
	}

	function throwAmbiguousArchive(reason) {
		const error = new Error(ERR_AMBIGUOUS_ARCHIVE);
		error.reason = reason;
		throw error;
	}

	function getOptionValue$1(zipReader, options, name) {
		return options[name] === UNDEFINED_VALUE ? zipReader.options[name] : options[name];
	}

	function getDate(timeRaw) {
		const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & MAX_16_BITS;
		try {
			return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
		} catch {
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

	var zipReader = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ERR_AMBIGUOUS_ARCHIVE: ERR_AMBIGUOUS_ARCHIVE,
		ERR_BAD_FORMAT: ERR_BAD_FORMAT,
		ERR_CENTRAL_DIRECTORY_NOT_FOUND: ERR_CENTRAL_DIRECTORY_NOT_FOUND,
		ERR_ENCRYPTED: ERR_ENCRYPTED,
		ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND: ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND,
		ERR_EOCDR_NOT_FOUND: ERR_EOCDR_NOT_FOUND,
		ERR_EXTRAFIELD_ZIP64_NOT_FOUND: ERR_EXTRAFIELD_ZIP64_NOT_FOUND,
		ERR_INVALID_COMPRESSED_DATA: ERR_INVALID_COMPRESSED_DATA,
		ERR_INVALID_PASSWORD: ERR_INVALID_PASSWORD,
		ERR_INVALID_SIGNATURE: ERR_INVALID_SIGNATURE,
		ERR_INVALID_UNCOMPRESSED_SIZE: ERR_INVALID_UNCOMPRESSED_SIZE,
		ERR_LOCAL_FILE_HEADER_NOT_FOUND: ERR_LOCAL_FILE_HEADER_NOT_FOUND,
		ERR_OVERLAPPING_ENTRY: ERR_OVERLAPPING_ENTRY,
		ERR_SPLIT_ZIP_FILE: ERR_SPLIT_ZIP_FILE,
		ERR_UNSUPPORTED_COMPRESSION: ERR_UNSUPPORTED_COMPRESSION$1,
		ERR_UNSUPPORTED_ENCRYPTION: ERR_UNSUPPORTED_ENCRYPTION,
		ZipReader: ZipReader,
		ZipReaderStream: ZipReaderStream
	});

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


	const ERR_DUPLICATED_NAME = "File already exists";
	const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
	const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
	const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
	const ERR_INVALID_VERSION = "Version exceeds 65535";
	const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
	const ERR_UNSUPPORTED_ENCRYPTION_USDZ = "Encryption is not supported in USDZ files";
	const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
	const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
	const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
	const MIN_UNIX_TIME = -2147483648;
	const MAX_UNIX_TIME = 2147483647;
	const ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported (set the 'zip64' option to 'true')";
	const ERR_UNDEFINED_UNCOMPRESSED_SIZE = "Undefined uncompressed size";
	const ERR_UNDEFINED_READER = "Undefined reader";
	const ERR_ZIP_NOT_EMPTY = "Zip file not empty";
	const ERR_INVALID_UID = "Invalid uid (must be integer 0..2^32-1)";
	const ERR_INVALID_GID = "Invalid gid (must be integer 0..2^32-1)";
	const ERR_INVALID_UNIX_MODE = "Invalid UNIX mode (must be integer 0..65535)";
	const ERR_INVALID_UNIX_EXTRA_FIELD_TYPE = "Invalid unixExtraFieldType (must be 'infozip' or 'unix')";
	const ERR_INVALID_UNIX_ID_SIZE = "uid/gid must be 0..65535 for unixExtraFieldType 'unix' (use 'infozip' for larger ids)";
	const ERR_INVALID_MSDOS_ATTRIBUTES = "Invalid msdosAttributesRaw (must be integer 0..255)";
	const ERR_INVALID_MSDOS_DATA = "Invalid msdosAttributes (must be an object with boolean flags)";

	const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
	const INFOZIP_EXTRA_FIELD_TYPE = "infozip";
	const UNIX_EXTRA_FIELD_TYPE = "unix";

	let workers = 0;
	const pendingEntries = [];

	class ZipWriter {

		constructor(writer, options = {}) {
			writer = new GenericWriter(writer);
			const { availableSize = INFINITY_VALUE, maxSize = INFINITY_VALUE } = writer;
			const addSplitZipSignature =
				availableSize > 0 && availableSize !== INFINITY_VALUE &&
				maxSize > 0 && maxSize !== INFINITY_VALUE;
			Object.assign(this, {
				writer,
				addSplitZipSignature,
				options,
				config: getConfiguration(),
				files: new Map(),
				filenames: new Set(),
				offset: options[OPTION_OFFSET] === UNDEFINED_VALUE ? writer.size || writer.writable.size || 0 : options[OPTION_OFFSET],
				initialOffset: options[OPTION_OFFSET] === UNDEFINED_VALUE ? 0 : options[OPTION_OFFSET] - (writer.size || writer.writable.size || 0),
				pendingAddFileCalls: new Set(),
				bufferedWrites: 0,
				lastFileEntry: UNDEFINED_VALUE
			});
		}

		async prependZip(reader) {
			if (this.filenames.size) {
				throw new Error(ERR_ZIP_NOT_EMPTY);
			}
			reader = new GenericReader(reader);
			await initStream(reader);
			const { ZipReader } = await Promise.resolve().then(function () { return zipReader; });
			const zipReader$1 = new ZipReader(reader.readable);
			const entries = await zipReader$1.getEntries();
			await zipReader$1.close();
			await initStream(this.writer);
			await reader.readable.pipeTo(this.writer.writable, { preventClose: true, preventAbort: true });
			this.writer.size = this.offset = reader.size;
			this.filenames = new Set(entries.map(entry => entry.filename));
			this.files = new Map(entries.map(entry => {
				const {
					version,
					rawLastModDate,
					lastAccessDate,
					creationDate,
					rawFilename,
					bitFlag,
					encrypted,
					uncompressedSize,
					compressedSize,
					zip64
				} = entry;
				let {
					compressionMethod,
					rawExtraFieldZip64,
					rawExtraFieldAES,
					rawExtraFieldExtendedTimestamp,
					rawExtraFieldNTFS,
					rawExtraFieldUnix,
					rawExtraField,
				} = entry;
				const { level, languageEncodingFlag, dataDescriptor } = bitFlag;
				rawExtraFieldZip64 = rawExtraFieldZip64 || EMPTY_UINT8_ARRAY;
				rawExtraFieldAES = rawExtraFieldAES || EMPTY_UINT8_ARRAY;
				rawExtraFieldExtendedTimestamp = rawExtraFieldExtendedTimestamp || EMPTY_UINT8_ARRAY;
				rawExtraFieldNTFS = rawExtraFieldNTFS || EMPTY_UINT8_ARRAY;
				rawExtraFieldUnix = rawExtraFieldUnix || EMPTY_UINT8_ARRAY;
				rawExtraField = rawExtraField || EMPTY_UINT8_ARRAY;
				if (entry.extraFieldAES) {
					compressionMethod = COMPRESSION_METHOD_AES;
				}
				const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField);
				const zip64UncompressedSize = zip64 && uncompressedSize >= MAX_32_BITS;
				const zip64CompressedSize = zip64 && compressedSize >= MAX_32_BITS;
				const bitFlagValue = (getBitFlag(level, languageEncodingFlag, dataDescriptor, encrypted, compressionMethod) & ~BITFLAG_LEVEL) | (level << 1);
				const {
					headerArray,
					headerView
				} = getHeaderArrayData({
					version,
					bitFlag: bitFlagValue,
					compressionMethod,
					uncompressedSize,
					compressedSize,
					rawLastModDate,
					rawFilename,
					zip64CompressedSize,
					zip64UncompressedSize,
					extraFieldLength
				});
				const { signature } = entry;
				if (signature !== UNDEFINED_VALUE) {
					setUint32(headerView, HEADER_OFFSET_SIGNATURE, signature);
				}
				Object.assign(entry, {
					zip64UncompressedSize,
					zip64CompressedSize,
					zip64Offset: zip64 && entry.offset >= MAX_32_BITS,
					diskNumberStart: 0,
					zip64DiskNumberStart: false,
					rawExtraFieldZip64,
					rawExtraFieldAES,
					rawExtraFieldExtendedTimestamp,
					rawExtraFieldNTFS,
					rawExtraFieldUnix,
					rawExtraField,
					extendedTimestamp: rawExtraFieldExtendedTimestamp.length > 0 || rawExtraFieldNTFS.length > 0,
					extraFieldExtendedTimestampFlag: 0x1 + (lastAccessDate ? 0x2 : 0) + (creationDate ? 0x4 : 0),
					headerArray,
					headerView
				});
				return [entry.filename, entry];
			}));
		}

		async add(name = "", reader, options = {}) {
			const zipWriter = this;
			options = Object.assign({}, options);
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
			let nameAdded;
			try {
				name = name.trim();
				if (getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY) && !name.endsWith(DIRECTORY_SIGNATURE)) {
					name += DIRECTORY_SIGNATURE;
				}
				if (zipWriter.filenames.has(name)) {
					throw new Error(ERR_DUPLICATED_NAME);
				}
				zipWriter.filenames.add(name);
				nameAdded = true;
				promiseAddFile = addFile(zipWriter, name, reader, options);
				pendingAddFileCalls.add(promiseAddFile);
				return await promiseAddFile;
			} catch (error) {
				if (nameAdded) {
					zipWriter.filenames.delete(name);
				}
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

		remove(entry) {
			const { filenames, files } = this;
			if (typeof entry == "string") {
				entry = files.get(entry);
			}
			if (entry && entry.filename !== UNDEFINED_VALUE) {
				const { filename } = entry;
				if (filenames.has(filename) && files.has(filename)) {
					filenames.delete(filename);
					files.delete(filename);
					return true;
				}
			}
			return false;
		}

		async close(comment = EMPTY_UINT8_ARRAY, options = {}) {
			const zipWriter = this;
			const { pendingAddFileCalls, writer } = this;
			const { writable } = writer;
			if (getLength(comment) > MAX_16_BITS) {
				throw new Error(ERR_INVALID_COMMENT);
			}
			while (pendingAddFileCalls.size) {
				await Promise.allSettled(Array.from(pendingAddFileCalls));
			}
			await closeFile(zipWriter, comment, options);
			const preventClose = getOptionValue(zipWriter, options, OPTION_PREVENT_CLOSE);
			if (!preventClose) {
				await writable.getWriter().close();
			}
			return writer.getData ? writer.getData() : writable;
		}
	}

	class ZipWriterStream {

		constructor(options = {}) {
			const { readable, writable } = new TransformStream();
			this.readable = readable;
			this.zipWriter = new ZipWriter(writable, options);
			this.pendingAddFileCalls = new Set();
		}

		transform(path) {
			const zipWriter = this.zipWriter;
			let streamController;
			const { readable, writable } = new TransformStream({
				start(controller) {
					streamController = controller;
				},
				flush: () => void closeArchive()
			});
			watchAddFileCall(this, this.zipWriter.add(path, readable), error => streamController.error(error));
			return { readable: this.readable, writable };

			async function closeArchive() {
				try {
					await zipWriter.close();
				} catch (error) {
					try {
						await zipWriter.writer.writable.abort(error);
					} catch {
						// ignored
					}
				}
			}
		}

		writable(path) {
			let streamController;
			const { readable, writable } = new TransformStream({
				start(controller) {
					streamController = controller;
				}
			});
			watchAddFileCall(this, this.zipWriter.add(path, readable), error => streamController.error(error));
			return writable;
		}

		async close(comment = UNDEFINED_VALUE, options = {}) {
			await Promise.all(Array.from(this.pendingAddFileCalls));
			return this.zipWriter.close(comment, options);
		}
	}

	function watchAddFileCall(zipWriterStream, promiseAddFile, onerror) {
		zipWriterStream.pendingAddFileCalls.add(promiseAddFile);
		promiseAddFile.catch(error => {
			try {
				onerror(error);
			} catch {
				// ignored
			}
		});
	}

	async function addFile(zipWriter, name, reader, options) {
		const attributesInfo = resolveAttributes(zipWriter, name, options);
		({ name } = attributesInfo);
		const metadataInfo = resolveMetadata(zipWriter, name, options);
		const { comment } = metadataInfo;
		const extraField = options[PROPERTY_NAME_EXTRA_FIELD];
		zipWriter.files.set(name, UNDEFINED_VALUE);
		let fileEntry;
		try {
			const sizesInfo = await resolveSizes(zipWriter, reader, metadataInfo, options);
			({ reader } = sizesInfo);
			const diskOffset = getDiskOffset(zipWriter.writer);
			const diskNumber = getDiskNumber(zipWriter.writer);
			options = Object.assign({}, options, attributesInfo.resolvedOptions, metadataInfo.resolvedOptions, sizesInfo.resolvedOptions, {
				internalFileAttribute: metadataInfo.resolvedOptions.internalFileAttributes,
				externalFileAttribute: attributesInfo.resolvedOptions.externalFileAttributes,
				signature: options[PROPERTY_NAME_SIGNATURE],
				offset: zipWriter.offset - diskOffset,
				diskNumberStart: diskNumber
			});
			const headerInfo = getHeaderInfo(options);
			const dataDescriptorInfo = getDataDescriptorInfo(options);
			const metadataSize = getLength(headerInfo.localHeaderArray, dataDescriptorInfo.dataDescriptorArray);
			fileEntry = await getFileEntry(zipWriter, name, reader, { headerInfo, dataDescriptorInfo, metadataSize }, options);
		} catch (error) {
			zipWriter.files.delete(name);
			throw error;
		}
		Object.assign(fileEntry, { name, comment, extraField });
		return new Entry(fileEntry);
	}

	function resolveAttributes(zipWriter, name, options) {
		name = name.trim();
		let msDosCompatible = getOptionValue(zipWriter, options, PROPERTY_NAME_MS_DOS_COMPATIBLE);
		let versionMadeBy = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION_MADE_BY, msDosCompatible ? 20 : 768);
		const executable = getOptionValue(zipWriter, options, PROPERTY_NAME_EXECUTABLE);
		const uid = getOptionValue(zipWriter, options, PROPERTY_NAME_UID);
		const gid = getOptionValue(zipWriter, options, PROPERTY_NAME_GID);
		let unixMode = getOptionValue(zipWriter, options, PROPERTY_NAME_UNIX_MODE);
		let unixExtraFieldType = getOptionValue(zipWriter, options, OPTION_UNIX_EXTRA_FIELD_TYPE);
		let setuid = getOptionValue(zipWriter, options, PROPERTY_NAME_SETUID);
		let setgid = getOptionValue(zipWriter, options, PROPERTY_NAME_SETGID);
		let sticky = getOptionValue(zipWriter, options, PROPERTY_NAME_STICKY);
		if (uid !== UNDEFINED_VALUE && (uid < 0 || uid > MAX_32_BITS)) {
			throw new Error(ERR_INVALID_UID);
		}
		if (gid !== UNDEFINED_VALUE && (gid < 0 || gid > MAX_32_BITS)) {
			throw new Error(ERR_INVALID_GID);
		}
		if (unixMode !== UNDEFINED_VALUE && (unixMode < 0 || unixMode > MAX_16_BITS)) {
			throw new Error(ERR_INVALID_UNIX_MODE);
		}
		if (unixExtraFieldType !== UNDEFINED_VALUE && unixExtraFieldType !== INFOZIP_EXTRA_FIELD_TYPE && unixExtraFieldType !== UNIX_EXTRA_FIELD_TYPE) {
			throw new Error(ERR_INVALID_UNIX_EXTRA_FIELD_TYPE);
		}
		if (unixExtraFieldType === UNIX_EXTRA_FIELD_TYPE &&
			((uid !== UNDEFINED_VALUE && uid > MAX_16_BITS) || (gid !== UNDEFINED_VALUE && gid > MAX_16_BITS))) {
			throw new Error(ERR_INVALID_UNIX_ID_SIZE);
		}
		if (unixExtraFieldType === UNDEFINED_VALUE && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE)) {
			unixExtraFieldType = INFOZIP_EXTRA_FIELD_TYPE;
		}
		let msdosAttributesRaw = getOptionValue(zipWriter, options, PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW);
		let msdosAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_MSDOS_ATTRIBUTES);
		const hasUnixMetadata = uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE || unixMode !== UNDEFINED_VALUE || unixExtraFieldType;
		const hasMsDosProvided = msdosAttributesRaw !== UNDEFINED_VALUE || msdosAttributes !== UNDEFINED_VALUE;
		if (hasUnixMetadata) {
			msDosCompatible = false;
			versionMadeBy = (versionMadeBy & MAX_16_BITS) | (3 << 8);
		} else if (hasMsDosProvided) {
			msDosCompatible = true;
			versionMadeBy = (versionMadeBy & MAX_8_BITS);
		}
		if (msdosAttributesRaw !== UNDEFINED_VALUE && (msdosAttributesRaw < 0 || msdosAttributesRaw > MAX_8_BITS)) {
			throw new Error(ERR_INVALID_MSDOS_ATTRIBUTES);
		}
		if (msdosAttributes && typeof msdosAttributes !== OBJECT_TYPE) {
			throw new Error(ERR_INVALID_MSDOS_DATA);
		}
		if (versionMadeBy > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		let externalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES, 0);
		if (!options[PROPERTY_NAME_DIRECTORY] && name.endsWith(DIRECTORY_SIGNATURE)) {
			options[PROPERTY_NAME_DIRECTORY] = true;
		}
		const directory = getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY);
		if (directory) {
			if (!name.endsWith(DIRECTORY_SIGNATURE)) {
				name += DIRECTORY_SIGNATURE;
			}
			if (externalFileAttributes === 0) {
				externalFileAttributes = FILE_ATTR_MSDOS_DIR_MASK;
				if (!msDosCompatible) {
					externalFileAttributes |= (FILE_ATTR_UNIX_TYPE_DIR | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_DEFAULT_MASK) << 16;
				}
			}
		} else if (!msDosCompatible && externalFileAttributes === 0) {
			if (executable) {
				externalFileAttributes = (FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_DEFAULT_MASK) << 16;
			} else {
				externalFileAttributes = FILE_ATTR_UNIX_DEFAULT_MASK << 16;
			}
		}
		let unixExternalUpper;
		if (!msDosCompatible) {
			unixExternalUpper = (externalFileAttributes >> 16) & MAX_16_BITS;
			unixMode = unixMode === UNDEFINED_VALUE ? unixExternalUpper : (unixMode & MAX_16_BITS);
			if (setuid) {
				unixMode |= FILE_ATTR_UNIX_SETUID_MASK;
			} else {
				setuid = Boolean(unixMode & FILE_ATTR_UNIX_SETUID_MASK);
			}
			if (setgid) {
				unixMode |= FILE_ATTR_UNIX_SETGID_MASK;
			} else {
				setgid = Boolean(unixMode & FILE_ATTR_UNIX_SETGID_MASK);
			}
			if (sticky) {
				unixMode |= FILE_ATTR_UNIX_STICKY_MASK;
			} else {
				sticky = Boolean(unixMode & FILE_ATTR_UNIX_STICKY_MASK);
			}
			if (directory) {
				unixMode |= FILE_ATTR_UNIX_TYPE_DIR;
			}
			externalFileAttributes = ((unixMode & MAX_16_BITS) << 16) | (externalFileAttributes & MAX_8_BITS);
		}
		({ msdosAttributesRaw, msdosAttributes } = normalizeMsdosAttributes(msdosAttributesRaw, msdosAttributes));
		if (hasMsDosProvided) {
			externalFileAttributes = (externalFileAttributes & MAX_32_BITS) | (msdosAttributesRaw & MAX_8_BITS);
		}
		return {
			name,
			resolvedOptions: {
				versionMadeBy,
				msDosCompatible,
				externalFileAttributes,
				unixExternalUpper,
				uid,
				gid,
				unixMode,
				unixExtraFieldType,
				setuid,
				setgid,
				sticky,
				msdosAttributesRaw,
				msdosAttributes
			}
		};
	}

	function resolveMetadata(zipWriter, name, options) {
		const encode = getOptionValue(zipWriter, options, OPTION_ENCODE_TEXT, encodeText);
		let rawFilename = encode(name);
		if (rawFilename === UNDEFINED_VALUE) {
			rawFilename = encodeText(name);
		}
		if (getLength(rawFilename) > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_NAME);
		}
		const comment = options[PROPERTY_NAME_COMMENT] || "";
		let rawComment = encode(comment);
		if (rawComment === UNDEFINED_VALUE) {
			rawComment = encodeText(comment);
		}
		if (getLength(rawComment) > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_COMMENT);
		}
		const version = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION, VERSION_DEFLATE);
		if (version > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		const lastModDate = getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE, new Date());
		const lastAccessDate = getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_ACCESS_DATE);
		const creationDate = getOptionValue(zipWriter, options, PROPERTY_NAME_CREATION_DATE);
		const internalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES, 0);
		const passThrough = getOptionValue(zipWriter, options, OPTION_PASS_THROUGH);
		let password, rawPassword;
		if (!passThrough) {
			password = getOptionValue(zipWriter, options, OPTION_PASSWORD);
			rawPassword = getOptionValue(zipWriter, options, OPTION_RAW_PASSWORD);
		}
		const encryptionStrength = getOptionValue(zipWriter, options, OPTION_ENCRYPTION_STRENGTH, 3);
		const zipCrypto = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIPCRYPTO);
		const extendedTimestamp = getOptionValue(zipWriter, options, OPTION_EXTENDED_TIMESTAMP, true);
		const ntfsTimestamp = getOptionValue(zipWriter, options, OPTION_NTFS_TIMESTAMP);
		const keepOrder = getOptionValue(zipWriter, options, OPTION_KEEP_ORDER, true);
		const useWebWorkers = getOptionValue(zipWriter, options, OPTION_USE_WEB_WORKERS);
		const transferStreams = getOptionValue(zipWriter, options, OPTION_TRANSFER_STREAMS);
		const bufferedWrite = getOptionValue(zipWriter, options, OPTION_BUFFERED_WRITE);
		const createTempStream = getOptionValue(zipWriter, options, OPTION_CREATE_TEMP_STREAM);
		const dataDescriptorSignature = getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR_SIGNATURE, true);
		const signal = getOptionValue(zipWriter, options, OPTION_SIGNAL);
		const useUnicodeFileNames = getOptionValue(zipWriter, options, OPTION_USE_UNICODE_FILE_NAMES, true);
		const compressionMethod = getOptionValue(zipWriter, options, PROPERTY_NAME_COMPRESSION_METHOD);
		const registeredCodec = passThrough || compressionMethod === UNDEFINED_VALUE ? UNDEFINED_VALUE : getRegisteredCodec(compressionMethod);
		if (!passThrough && compressionMethod !== UNDEFINED_VALUE &&
			compressionMethod !== COMPRESSION_METHOD_STORE && compressionMethod !== COMPRESSION_METHOD_DEFLATE && !registeredCodec) {
			throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		}
		let level = getOptionValue(zipWriter, options, OPTION_LEVEL);
		if (zipWriter.options[OPTION_USDZ]) {
			if (password !== UNDEFINED_VALUE || rawPassword !== UNDEFINED_VALUE) {
				throw new Error(ERR_UNSUPPORTED_ENCRYPTION_USDZ);
			}
			if (level === UNDEFINED_VALUE && compressionMethod === UNDEFINED_VALUE) {
				level = 0;
			}
		}
		let useCompressionStream = getOptionValue(zipWriter, options, OPTION_USE_COMPRESSION_STREAM);
		let dataDescriptor = getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR);
		if (bufferedWrite && dataDescriptor === UNDEFINED_VALUE) {
			dataDescriptor = false;
		}
		if (dataDescriptor === UNDEFINED_VALUE || zipCrypto) {
			dataDescriptor = true;
		}
		if (level !== UNDEFINED_VALUE && level != 6) {
			useCompressionStream = false;
		}
		if (!useCompressionStream && !registeredCodec && (zipWriter.config.CompressionStream === UNDEFINED_VALUE && zipWriter.config.CompressionStreamZlib === UNDEFINED_VALUE)) {
			level = 0;
		}
		const zip64 = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIP64);
		if (!zipCrypto && (password !== UNDEFINED_VALUE || rawPassword !== UNDEFINED_VALUE) && !(encryptionStrength >= 1 && encryptionStrength <= 3)) {
			throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
		}
		let rawExtraField = EMPTY_UINT8_ARRAY;
		const extraField = options[PROPERTY_NAME_EXTRA_FIELD];
		if (extraField) {
			let extraFieldSize = 0;
			let offset = 0;
			extraField.forEach(data => extraFieldSize += 4 + getLength(data));
			rawExtraField = new Uint8Array(extraFieldSize);
			const rawExtraFieldView = getDataView(rawExtraField);
			extraField.forEach((data, type) => {
				if (type > MAX_16_BITS) {
					throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
				}
				if (getLength(data) > MAX_16_BITS) {
					throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
				}
				setUint16(rawExtraFieldView, offset, type);
				setUint16(rawExtraFieldView, offset + 2, getLength(data));
				arraySet(rawExtraField, data, offset + 4);
				offset += 4 + getLength(data);
			});
		}
		return {
			comment,
			resolvedOptions: {
				rawFilename,
				rawComment,
				version,
				lastModDate,
				lastAccessDate,
				creationDate,
				internalFileAttributes,
				passThrough,
				password,
				rawPassword,
				encryptionStrength,
				zipCrypto,
				extendedTimestamp,
				ntfsTimestamp,
				keepOrder,
				useWebWorkers,
				transferStreams,
				bufferedWrite,
				createTempStream,
				dataDescriptorSignature,
				signal,
				useUnicodeFileNames,
				compressionMethod,
				format: registeredCodec ? registeredCodec.format : UNDEFINED_VALUE,
				codecURI: registeredCodec ? registeredCodec.codecURI : UNDEFINED_VALUE,
				codecVersionNeeded: registeredCodec ? registeredCodec.versionNeeded : UNDEFINED_VALUE,
				level,
				useCompressionStream,
				dataDescriptor,
				zip64,
				rawExtraField
			}
		};
	}

	async function resolveSizes(zipWriter, reader, { resolvedOptions: metadata }, options) {
		const { passThrough, zipCrypto, password, rawPassword, encryptionStrength } = metadata;
		let { dataDescriptor, zip64, level, compressionMethod } = metadata;
		let maximumCompressedSize = 0;
		let uncompressedSize = 0;
		if (passThrough) {
			if (!reader) {
				throw new Error(ERR_UNDEFINED_READER);
			}
			uncompressedSize = options[PROPERTY_NAME_UNCOMPRESSED_SIZE];
			if (uncompressedSize === UNDEFINED_VALUE) {
				throw new Error(ERR_UNDEFINED_UNCOMPRESSED_SIZE);
			}
		}
		const zip64Enabled = zip64 === true;
		const encrypted = getOptionValue(zipWriter, options, PROPERTY_NAME_ENCRYPTED);
		const encryptedEntry = Boolean(reader) && (Boolean((password && getLength(password)) || (rawPassword && getLength(rawPassword))) || (passThrough && encrypted));
		if (!reader) {
			level = 0;
			compressionMethod = COMPRESSION_METHOD_STORE;
		}
		const encryptionOverhead = encryptedEntry ? (zipCrypto ? 12 : 16 + encryptionStrength * 4) : 0;
		if (reader) {
			reader = new GenericReader(reader);
			await initStream(reader);
			if (!passThrough) {
				if (reader.size === UNDEFINED_VALUE) {
					dataDescriptor = true;
					if (zip64 || zip64 === UNDEFINED_VALUE) {
						zip64 = true;
						uncompressedSize = maximumCompressedSize = MAX_32_BITS + 1;
					}
				} else {
					options.uncompressedSize = uncompressedSize = reader.size;
					maximumCompressedSize = getMaximumCompressedSize(uncompressedSize) + encryptionOverhead;
				}
			} else {
				options.uncompressedSize = uncompressedSize;
				maximumCompressedSize = getMaximumCompressedSize(uncompressedSize) + encryptionOverhead;
			}
		}
		const zip64UncompressedSize = zip64Enabled || uncompressedSize >= MAX_32_BITS;
		const zip64CompressedSize = zip64Enabled || maximumCompressedSize >= MAX_32_BITS;
		if (zip64UncompressedSize || zip64CompressedSize) {
			if (zip64 === false) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			} else {
				zip64 = true;
			}
		}
		zip64 = zip64 || false;
		return {
			reader,
			resolvedOptions: {
				dataDescriptor,
				zip64,
				zip64UncompressedSize,
				zip64CompressedSize,
				uncompressedSize,
				level,
				compressionMethod,
				encrypted: encryptedEntry
			}
		};
	}

	async function getFileEntry(zipWriter, name, reader, entryInfo, options) {
		const {
			files,
			writer
		} = zipWriter;
		const {
			keepOrder,
			dataDescriptor,
			signal
		} = options;
		const {
			headerInfo
		} = entryInfo;
		const usdz = zipWriter.options[OPTION_USDZ];
		const previousFileEntry = zipWriter.lastFileEntry;
		let fileEntry = {};
		let bufferedWrite;
		let releaseLockWriter;
		let releaseLockCurrentFileEntry;
		let writingBufferedEntryData;
		let writingEntryData;
		let writerSizeBeforeEntry;
		let flushedBufferedSize = 0;
		let fileWriter;
		files.set(name, fileEntry);
		zipWriter.lastFileEntry = fileEntry;
		try {
			let lockPreviousFileEntry;
			if (keepOrder) {
				lockPreviousFileEntry = previousFileEntry && previousFileEntry.lock;
				requestLockCurrentFileEntry();
			}
			if (options.bufferedWrite || !keepOrder || zipWriter.writerLocked || zipWriter.bufferedWrites || !dataDescriptor) {
				bufferedWrite = true;
				zipWriter.bufferedWrites++;
				if (options.createTempStream) {
					fileWriter = await options.createTempStream();
				} else {
					fileWriter = new TransformStream(UNDEFINED_VALUE, UNDEFINED_VALUE, { highWaterMark: INFINITY_VALUE });
				}
				fileWriter.size = 0;
				await initStream(writer);
			} else {
				fileWriter = writer;
				await requestLockWriter();
			}
			await initStream(fileWriter);
			const diskOffset = getDiskOffset(writer);
			if (zipWriter.addSplitZipSignature) {
				delete zipWriter.addSplitZipSignature;
				const signatureArray = new Uint8Array(4);
				const signatureArrayView = getDataView(signatureArray);
				setUint32(signatureArrayView, 0, SPLIT_ZIP_FILE_SIGNATURE);
				await writeData(writer, signatureArray);
				zipWriter.offset += 4;
			}
			if (usdz && !bufferedWrite) {
				appendExtraFieldUSDZ(entryInfo, zipWriter.offset - diskOffset);
			}
			const { localHeaderArray } = headerInfo;
			if (!bufferedWrite) {
				await lockPreviousFileEntry;
				await skipDiskIfNeeded();
			}
			const diskNumberStart = getDiskNumber(writer);
			const entryOffset = getSegmentOffset(zipWriter, writer);
			fileEntry.diskNumberStart = diskNumberStart;
			if (!bufferedWrite) {
				writingEntryData = true;
				writerSizeBeforeEntry = writer.size;
				await writeData(fileWriter, localHeaderArray);
			}
			fileEntry = await createFileEntry(reader, fileWriter, fileEntry, entryInfo, zipWriter.config, options);
			if (!bufferedWrite) {
				writingEntryData = false;
			}
			files.set(name, fileEntry);
			fileEntry.filename = name;
			if (bufferedWrite) {
				await Promise.all([fileWriter.writable.getWriter().close(), lockPreviousFileEntry]);
				await requestLockWriter();
				writingBufferedEntryData = true;
				writerSizeBeforeEntry = writer.size;
				await skipDiskIfNeeded();
				fileEntry.diskNumberStart = getDiskNumber(writer);
				fileEntry.offset = getSegmentOffset(zipWriter, writer);
				if (usdz) {
					const previousMetadataSize = entryInfo.metadataSize;
					appendExtraFieldUSDZ(entryInfo, zipWriter.offset - getDiskOffset(writer));
					fileEntry.size += entryInfo.metadataSize - previousMetadataSize;
				}
				updateLocalHeader(fileEntry, headerInfo.localHeaderView, options);
				await writeData(writer, headerInfo.localHeaderArray);
				await flushBufferedData(fileWriter.readable, writer, signal, chunkLength => flushedBufferedSize += chunkLength);
				writer.size += fileWriter.size;
				writingBufferedEntryData = false;
			} else {
				fileEntry.diskNumberStart = diskNumberStart;
				fileEntry.offset = entryOffset;
			}
			zipWriter.offset += fileEntry.size;
			return fileEntry;
		} catch (error) {
			if (writingBufferedEntryData || writingEntryData) {
				zipWriter.hasCorruptedEntries = true;
				if (error) {
					try {
						error.corruptedEntry = true;
					} catch {
						// ignored
					}
				}
				zipWriter.offset += writer.size - writerSizeBeforeEntry;
				if (bufferedWrite) {
					zipWriter.offset += flushedBufferedSize;
				}
			}
			files.delete(name);
			throw error;
		} finally {
			if (bufferedWrite) {
				zipWriter.bufferedWrites--;
			}
			if (releaseLockCurrentFileEntry) {
				releaseLockCurrentFileEntry();
			}
			if (releaseLockWriter) {
				releaseLockWriter();
			}
			if (bufferedWrite && fileWriter && fileWriter.dispose) {
				try {
					await fileWriter.dispose();
				} catch {
					// ignored
				}
			}
		}

		function requestLockCurrentFileEntry() {
			fileEntry.lock = new Promise(resolve => releaseLockCurrentFileEntry = resolve);
		}

		async function requestLockWriter() {
			zipWriter.writerLocked = true;
			const { lockWriter } = zipWriter;
			zipWriter.lockWriter = new Promise(resolve => releaseLockWriter = () => {
				zipWriter.writerLocked = false;
				resolve();
			});
			await lockWriter;
		}

		async function skipDiskIfNeeded() {
			if (exceedsAvailableSize(writer, getLength(headerInfo.localHeaderArray))) {
				await writer.closeDisk();
			}
		}
	}

	async function createFileEntry(reader, writer, { diskNumberStart, lock }, entryInfo, config, options) {
		const {
			headerInfo,
			dataDescriptorInfo,
			metadataSize
		} = entryInfo;
		const {
			headerArray,
			headerView,
			lastModDate,
			rawLastModDate,
			encrypted,
			compressed,
			version,
			compressionMethod,
			rawExtraFieldZip64,
			localExtraFieldZip64Length,
			rawExtraFieldExtendedTimestamp,
			extraFieldExtendedTimestampFlag,
			rawExtraFieldNTFS,
			rawExtraFieldUnix,
			rawExtraFieldAES,
		} = headerInfo;
		const { dataDescriptorArray } = dataDescriptorInfo;
		const {
			rawFilename,
			lastAccessDate,
			creationDate,
			password,
			rawPassword,
			level,
			zip64,
			zip64UncompressedSize,
			zip64CompressedSize,
			zipCrypto,
			dataDescriptor,
			directory,
			executable,
			versionMadeBy,
			rawComment,
			rawExtraField,
			useWebWorkers,
			transferStreams,
			onstart,
			onprogress,
			onend,
			signal,
			encryptionStrength,
			extendedTimestamp,
			msDosCompatible,
			internalFileAttributes,
			externalFileAttributes,
			uid,
			gid,
			unixMode,
			setuid,
			setgid,
			sticky,
			unixExternalUpper,
			msdosAttributesRaw,
			msdosAttributes,
			useCompressionStream,
			passThrough,
			format,
			codecURI
		} = options;
		const fileEntry = {
			lock,
			versionMadeBy,
			zip64,
			directory: Boolean(directory),
			executable: Boolean(executable),
			filenameUTF8: true,
			rawFilename,
			commentUTF8: true,
			rawComment,
			rawExtraFieldZip64,
			localExtraFieldZip64Length,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldUnix,
			rawExtraFieldAES,
			rawExtraField,
			extendedTimestamp,
			msDosCompatible,
			internalFileAttributes,
			externalFileAttributes,
			diskNumberStart,
			uid,
			gid,
			unixMode,
			setuid,
			setgid,
			sticky,
			unixExternalUpper,
			msdosAttributesRaw,
			msdosAttributes
		};
		let {
			signature,
			uncompressedSize
		} = options;
		let compressedSize = 0;
		if (!passThrough) {
			uncompressedSize = 0;
		}
		const { writable } = writer;
		if (reader) {
			const readable = reader.createReadable ? reader.createReadable() : reader.readable;
			const size = reader.size;
			const workerOptions = {
				options: {
					codecType: CODEC_DEFLATE,
					level,
					rawPassword,
					password,
					encryptionStrength,
					zipCrypto: encrypted && zipCrypto,
					passwordVerification: encrypted && zipCrypto && (rawLastModDate >> 8) & MAX_8_BITS,
					signed: !passThrough,
					compressed: compressed && !passThrough,
					encrypted: encrypted && !passThrough,
					useWebWorkers,
					useCompressionStream,
					transferStreams,
					format,
					codecURI
				},
				config,
				streamOptions: { signal, size, onstart, onprogress, onend }
			};
			try {
				const result = await runWorker({ readable, writable }, workerOptions);
				compressedSize = result.outputSize;
				writer.size += compressedSize;
				if (!passThrough) {
					uncompressedSize = result.inputSize;
					signature = result.signature;
				}
				if ((!zip64CompressedSize && compressedSize >= MAX_32_BITS) ||
					(!zip64UncompressedSize && uncompressedSize >= MAX_32_BITS)) {
					throw new Error(ERR_UNSUPPORTED_FORMAT);
				}
			} catch (error) {
				if (error.outputSize !== UNDEFINED_VALUE) {
					writer.size += error.outputSize;
				}
				throw error;
			}

		}
		setEntryInfo({
			signature,
			compressedSize,
			uncompressedSize,
			headerInfo,
			dataDescriptorInfo
		}, options);
		if (dataDescriptor) {
			await writeData(writer, dataDescriptorArray);
		}
		Object.assign(fileEntry, {
			uncompressedSize,
			compressedSize,
			lastModDate,
			rawLastModDate,
			creationDate,
			lastAccessDate,
			encrypted,
			zipCrypto,
			size: metadataSize + compressedSize,
			compressionMethod,
			version,
			headerArray,
			headerView,
			signature,
			extraFieldExtendedTimestampFlag,
			zip64UncompressedSize,
			zip64CompressedSize
		});
		return fileEntry;
	}

	function getHeaderInfo(options) {
		const {
			rawFilename,
			lastModDate,
			lastAccessDate,
			creationDate,
			level,
			zip64,
			zipCrypto,
			useUnicodeFileNames,
			dataDescriptor,
			directory,
			rawExtraField,
			encryptionStrength,
			extendedTimestamp,
			ntfsTimestamp,
			passThrough,
			encrypted,
			zip64UncompressedSize,
			zip64CompressedSize,
			uncompressedSize
		} = options;
		let { version, compressionMethod } = options;
		const compressed = !directory && (compressionMethod === UNDEFINED_VALUE
			? (level === UNDEFINED_VALUE || level > 0)
			: compressionMethod !== COMPRESSION_METHOD_STORE);
		let rawLocalExtraFieldZip64;
		const uncompressedFile = passThrough || !compressed;
		const zip64ExtraFieldComplete = zip64 && (options.bufferedWrite || !dataDescriptor || ((!zip64UncompressedSize && !zip64CompressedSize) || uncompressedFile));
		const writeLocalExtraFieldZip64 = zip64ExtraFieldComplete || (zip64 && dataDescriptor && (zip64UncompressedSize || zip64CompressedSize));
		if (zip64 && (zip64UncompressedSize || zip64CompressedSize)) {
			const length = 4 + 16;
			const extraFieldZip64 = createRecordWriter(length);
			extraFieldZip64.uint16(EXTRAFIELD_TYPE_ZIP64);
			extraFieldZip64.uint16(length - 4);
			rawLocalExtraFieldZip64 = extraFieldZip64.array;
			if (zip64ExtraFieldComplete) {
				extraFieldZip64.uint64(uncompressedSize);
				if (uncompressedFile) {
					const encryptionOverhead = encrypted ? (zipCrypto ? 12 : 16 + encryptionStrength * 4) : 0;
					extraFieldZip64.uint64(passThrough ? 0 : uncompressedSize + encryptionOverhead);
				}
			}
		} else {
			rawLocalExtraFieldZip64 = EMPTY_UINT8_ARRAY;
		}
		let rawExtraFieldAES;
		if (encrypted && !zipCrypto) {
			const extraFieldAES = createRecordWriter(getLength(EXTRAFIELD_DATA_AES) + 2);
			extraFieldAES.uint16(EXTRAFIELD_TYPE_AES);
			extraFieldAES.bytes(EXTRAFIELD_DATA_AES);
			rawExtraFieldAES = extraFieldAES.array;
			rawExtraFieldAES[8] = encryptionStrength;
		} else {
			rawExtraFieldAES = EMPTY_UINT8_ARRAY;
		}
		let rawExtraFieldNTFS;
		let rawExtraFieldExtendedTimestamp;
		let extraFieldExtendedTimestampFlag;
		if (extendedTimestamp) {
			const lastModTimeUnix = getTimeUnix(lastModDate);
			const lastModTimeUnixInRange = inUnixTimeRange(lastModTimeUnix);
			if (lastModTimeUnixInRange) {
				const extraFieldTimestampLength = 9 + (lastAccessDate ? 4 : 0) + (creationDate ? 4 : 0);
				const extraFieldTimestamp = createRecordWriter(extraFieldTimestampLength);
				extraFieldExtendedTimestampFlag = 0x1 + (lastAccessDate ? 0x2 : 0) + (creationDate ? 0x4 : 0);
				extraFieldTimestamp.uint16(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
				extraFieldTimestamp.uint16(extraFieldTimestampLength - 4);
				extraFieldTimestamp.uint8(extraFieldExtendedTimestampFlag);
				extraFieldTimestamp.uint32(lastModTimeUnix);
				if (lastAccessDate) {
					extraFieldTimestamp.uint32(clampUnixTime(getTimeUnix(lastAccessDate)));
				}
				if (creationDate) {
					extraFieldTimestamp.uint32(clampUnixTime(getTimeUnix(creationDate)));
				}
				rawExtraFieldExtendedTimestamp = extraFieldTimestamp.array;
			} else {
				rawExtraFieldExtendedTimestamp = EMPTY_UINT8_ARRAY;
			}
			const writeExtraFieldNTFS = ntfsTimestamp === UNDEFINED_VALUE ?
				!lastModTimeUnixInRange || Boolean(lastAccessDate || creationDate) :
				ntfsTimestamp;
			if (writeExtraFieldNTFS) {
				try {
					const lastModTimeNTFS = getTimeNTFS(lastModDate);
					const extraFieldNTFS = createRecordWriter(36);
					extraFieldNTFS.uint16(EXTRAFIELD_TYPE_NTFS);
					extraFieldNTFS.uint16(32);
					extraFieldNTFS.skip(4);
					extraFieldNTFS.uint16(EXTRAFIELD_TYPE_NTFS_TAG1);
					extraFieldNTFS.uint16(24);
					extraFieldNTFS.uint64(lastModTimeNTFS);
					extraFieldNTFS.uint64(getTimeNTFS(lastAccessDate) || lastModTimeNTFS);
					extraFieldNTFS.uint64(getTimeNTFS(creationDate) || lastModTimeNTFS);
					rawExtraFieldNTFS = extraFieldNTFS.array;
				} catch {
					rawExtraFieldNTFS = EMPTY_UINT8_ARRAY;
				}
			} else {
				rawExtraFieldNTFS = EMPTY_UINT8_ARRAY;
			}
		} else {
			rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = EMPTY_UINT8_ARRAY;
		}
		let rawExtraFieldUnix;
		try {
			const { uid, gid, unixExtraFieldType } = options;
			if (unixExtraFieldType == INFOZIP_EXTRA_FIELD_TYPE && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE)) {
				const uidBytes = packUnixId(uid);
				const gidBytes = packUnixId(gid);
				const payloadLength = 3 + uidBytes.length + gidBytes.length;
				const extraFieldUnix = createRecordWriter(4 + payloadLength);
				extraFieldUnix.uint16(EXTRAFIELD_TYPE_INFOZIP);
				extraFieldUnix.uint16(payloadLength);
				extraFieldUnix.uint8(1);
				extraFieldUnix.uint8(uidBytes.length);
				extraFieldUnix.bytes(uidBytes);
				extraFieldUnix.uint8(gidBytes.length);
				extraFieldUnix.bytes(gidBytes);
				rawExtraFieldUnix = extraFieldUnix.array;
			} else if (unixExtraFieldType == UNIX_EXTRA_FIELD_TYPE && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE)) {
				const extraFieldUnix = createRecordWriter(8);
				extraFieldUnix.uint16(EXTRAFIELD_TYPE_UNIX);
				extraFieldUnix.uint16(4);
				extraFieldUnix.uint16((uid === UNDEFINED_VALUE ? 0 : uid) & MAX_16_BITS);
				extraFieldUnix.uint16((gid === UNDEFINED_VALUE ? 0 : gid) & MAX_16_BITS);
				rawExtraFieldUnix = extraFieldUnix.array;
			} else {
				rawExtraFieldUnix = EMPTY_UINT8_ARRAY;
			}
		} catch {
			rawExtraFieldUnix = EMPTY_UINT8_ARRAY;
		}
		if (compressionMethod === UNDEFINED_VALUE) {
			compressionMethod = compressed ? COMPRESSION_METHOD_DEFLATE : COMPRESSION_METHOD_STORE;
		}
		const { codecVersionNeeded } = options;
		if (compressed && codecVersionNeeded !== UNDEFINED_VALUE) {
			version = version > codecVersionNeeded ? version : codecVersionNeeded;
		}
		if (zip64) {
			version = version > VERSION_ZIP64 ? version : VERSION_ZIP64;
		}
		if (encrypted && !zipCrypto) {
			version = version > VERSION_AES ? version : VERSION_AES;
			rawExtraFieldAES[9] = compressionMethod;
			compressionMethod = COMPRESSION_METHOD_AES;
		}
		const localExtraFieldZip64Length = writeLocalExtraFieldZip64 ? getLength(rawLocalExtraFieldZip64) : 0;
		const extraFieldLength = localExtraFieldZip64Length + getLength(rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField);
		if (extraFieldLength > MAX_16_BITS) {
			throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
		}
		const {
			headerArray,
			headerView,
			rawLastModDate
		} = getHeaderArrayData({
			version,
			bitFlag: getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod),
			compressionMethod,
			uncompressedSize,
			lastModDate: lastModDate < MIN_DATE ? MIN_DATE : lastModDate > MAX_DATE ? MAX_DATE : lastModDate,
			rawFilename,
			zip64CompressedSize,
			zip64UncompressedSize,
			extraFieldLength
		});
		const localHeader = createRecordWriter(HEADER_SIZE + getLength(rawFilename) + extraFieldLength);
		const localHeaderArray = localHeader.array;
		const localHeaderView = getDataView(localHeaderArray);
		localHeader.uint32(LOCAL_FILE_HEADER_SIGNATURE);
		localHeader.bytes(headerArray);
		localHeader.bytes(rawFilename);
		if (writeLocalExtraFieldZip64) {
			localHeader.bytes(rawLocalExtraFieldZip64);
		}
		localHeader.bytes(rawExtraFieldAES);
		localHeader.bytes(rawExtraFieldExtendedTimestamp);
		localHeader.bytes(rawExtraFieldNTFS);
		localHeader.bytes(rawExtraFieldUnix);
		localHeader.bytes(rawExtraField);
		if (dataDescriptor) {
			if (!zip64CompressedSize) {
				setUint32(localHeaderView, HEADER_OFFSET_COMPRESSED_SIZE + LOCAL_HEADER_COMMON_OFFSET, 0);
			}
			if (!zip64UncompressedSize) {
				setUint32(localHeaderView, HEADER_OFFSET_UNCOMPRESSED_SIZE + LOCAL_HEADER_COMMON_OFFSET, 0);
			}
		}
		return {
			localHeaderArray,
			localHeaderView,
			headerArray,
			headerView,
			lastModDate,
			rawLastModDate,
			encrypted,
			compressed,
			version,
			compressionMethod,
			extraFieldExtendedTimestampFlag,
			rawExtraFieldZip64: EMPTY_UINT8_ARRAY,
			localExtraFieldZip64Length,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldUnix,
			rawExtraFieldAES,
			extraFieldLength
		};
	}

	function appendExtraFieldUSDZ(entryInfo, zipWriterOffset) {
		const { headerInfo } = entryInfo;
		let { localHeaderArray, extraFieldLength } = headerInfo;
		let extraBytesLength = 64 - ((zipWriterOffset + getLength(localHeaderArray)) % 64);
		if (extraBytesLength < 4) {
			extraBytesLength += 64;
		}
		const rawExtraFieldUSDZ = new Uint8Array(extraBytesLength);
		const extraFieldUSDZView = getDataView(rawExtraFieldUSDZ);
		setUint16(extraFieldUSDZView, 0, EXTRAFIELD_TYPE_USDZ);
		setUint16(extraFieldUSDZView, 2, extraBytesLength - 4);
		const previousLocalHeaderArray = localHeaderArray;
		headerInfo.localHeaderArray = localHeaderArray = new Uint8Array(getLength(previousLocalHeaderArray) + extraBytesLength);
		arraySet(localHeaderArray, previousLocalHeaderArray);
		arraySet(localHeaderArray, rawExtraFieldUSDZ, getLength(previousLocalHeaderArray));
		const localHeaderArrayView = getDataView(localHeaderArray);
		setUint16(localHeaderArrayView, 28, extraFieldLength + extraBytesLength);
		headerInfo.localHeaderView = localHeaderArrayView;
		entryInfo.metadataSize += extraBytesLength;
	}

	function packUnixId(id) {
		if (id === UNDEFINED_VALUE) {
			return EMPTY_UINT8_ARRAY;
		} else {
			const dataArray = new Uint8Array(4);
			const dataView = getDataView(dataArray);
			dataView.setUint32(0, id, true);
			let length = 4;
			while (length > 1 && dataArray[length - 1] === 0) {
				length--;
			}
			return dataArray.subarray(0, length);
		}
	}

	function normalizeMsdosAttributes(msdosAttributesRaw, msdosAttributes) {
		if (msdosAttributesRaw !== UNDEFINED_VALUE) {
			msdosAttributesRaw = msdosAttributesRaw & MAX_8_BITS;
		} else if (msdosAttributes !== UNDEFINED_VALUE) {
			const { readOnly, hidden, system, directory: msdDir, archive } = msdosAttributes;
			let raw = 0;
			if (readOnly) raw |= FILE_ATTR_MSDOS_READONLY_MASK;
			if (hidden) raw |= FILE_ATTR_MSDOS_HIDDEN_MASK;
			if (system) raw |= FILE_ATTR_MSDOS_SYSTEM_MASK;
			if (msdDir) raw |= FILE_ATTR_MSDOS_DIR_MASK;
			if (archive) raw |= FILE_ATTR_MSDOS_ARCHIVE_MASK;
			msdosAttributesRaw = raw & MAX_8_BITS;
		}
		if (msdosAttributes === UNDEFINED_VALUE) {
			msdosAttributes = {
				readOnly: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_READONLY_MASK),
				hidden: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_HIDDEN_MASK),
				system: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_SYSTEM_MASK),
				directory: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_DIR_MASK),
				archive: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_ARCHIVE_MASK)
			};
		}
		return { msdosAttributesRaw, msdosAttributes };
	}

	function getDataDescriptorInfo({
		zip64,
		dataDescriptor,
		dataDescriptorSignature
	}) {
		let dataDescriptorArray = EMPTY_UINT8_ARRAY;
		let dataDescriptorView, dataDescriptorOffset = 0;
		let dataDescriptorLength = zip64 ? DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH : DATA_DESCRIPTOR_RECORD_LENGTH;
		if (dataDescriptorSignature) {
			dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
		}
		if (dataDescriptor) {
			dataDescriptorArray = new Uint8Array(dataDescriptorLength);
			dataDescriptorView = getDataView(dataDescriptorArray);
			if (dataDescriptorSignature) {
				dataDescriptorOffset = DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
				setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
			}
		}
		return {
			dataDescriptorArray,
			dataDescriptorView,
			dataDescriptorOffset
		};
	}

	function setEntryInfo({
		signature,
		compressedSize,
		uncompressedSize,
		headerInfo,
		dataDescriptorInfo
	}, {
		zip64,
		zipCrypto,
		dataDescriptor
	}) {
		const {
			headerView,
			encrypted
		} = headerInfo;
		const {
			dataDescriptorView,
			dataDescriptorOffset
		} = dataDescriptorInfo;
		if ((!encrypted || zipCrypto) && signature !== UNDEFINED_VALUE) {
			setUint32(headerView, HEADER_OFFSET_SIGNATURE, signature);
			if (dataDescriptor) {
				setUint32(dataDescriptorView, dataDescriptorOffset, signature);
			}
		}
		if (zip64) {
			if (dataDescriptor) {
				setBigUint64(dataDescriptorView, dataDescriptorOffset + 4, BigInt(compressedSize));
				setBigUint64(dataDescriptorView, dataDescriptorOffset + 12, BigInt(uncompressedSize));
			}
		} else {
			setUint32(headerView, HEADER_OFFSET_COMPRESSED_SIZE, compressedSize);
			setUint32(headerView, HEADER_OFFSET_UNCOMPRESSED_SIZE, uncompressedSize);
			if (dataDescriptor) {
				setUint32(dataDescriptorView, dataDescriptorOffset + 4, compressedSize);
				setUint32(dataDescriptorView, dataDescriptorOffset + 8, uncompressedSize);
			}
		}
	}

	function updateLocalHeader({
		rawFilename,
		encrypted,
		zip64,
		localExtraFieldZip64Length,
		signature,
		compressedSize,
		uncompressedSize,
		zip64UncompressedSize,
		zip64CompressedSize
	}, localHeaderView, { dataDescriptor }) {
		if (!dataDescriptor) {
			if (!encrypted) {
				setUint32(localHeaderView, HEADER_OFFSET_SIGNATURE + LOCAL_HEADER_COMMON_OFFSET, signature);
			}
			if (!zip64CompressedSize) {
				setUint32(localHeaderView, HEADER_OFFSET_COMPRESSED_SIZE + LOCAL_HEADER_COMMON_OFFSET, compressedSize);
			}
			if (!zip64UncompressedSize) {
				setUint32(localHeaderView, HEADER_OFFSET_UNCOMPRESSED_SIZE + LOCAL_HEADER_COMMON_OFFSET, uncompressedSize);
			}
		}
		if (zip64 && localExtraFieldZip64Length) {
			const localHeaderOffset = HEADER_SIZE + getLength(rawFilename) + 4;
			setBigUint64(localHeaderView, localHeaderOffset, BigInt(uncompressedSize));
			setBigUint64(localHeaderView, localHeaderOffset + 8, BigInt(compressedSize));
		}
	}


	async function closeFile(zipWriter, comment, options) {
		const directoryDataLength = createDirectoryRecords(zipWriter.files);
		const directoryStart = await writeDirectoryRecords(zipWriter, directoryDataLength, options);
		await writeEndOfDirectoryRecord(zipWriter, comment, options, { directoryStart, directoryDataLength });
	}

	function createDirectoryRecords(files) {
		let directoryDataLength = 0;
		for (const [, fileEntry] of files) {
			const {
				rawFilename,
				rawExtraFieldAES,
				rawComment,
				rawExtraFieldNTFS,
				rawExtraFieldUnix,
				rawExtraField,
				extendedTimestamp,
				extraFieldExtendedTimestampFlag,
				lastModDate,
				zip64UncompressedSize,
				zip64CompressedSize,
				uncompressedSize,
				compressedSize
			} = fileEntry;
			const zip64Offset = fileEntry.offset >= MAX_32_BITS;
			const zip64DiskNumberStart = fileEntry.diskNumberStart >= MAX_16_BITS;
			let rawExtraFieldZip64;
			if (zip64Offset || zip64DiskNumberStart || zip64UncompressedSize || zip64CompressedSize) {
				const length = 4 + (zip64UncompressedSize ? 8 : 0) + (zip64CompressedSize ? 8 : 0) + (zip64Offset ? 8 : 0) + (zip64DiskNumberStart ? 4 : 0);
				const extraFieldZip64 = createRecordWriter(length);
				extraFieldZip64.uint16(EXTRAFIELD_TYPE_ZIP64);
				extraFieldZip64.uint16(length - 4);
				if (zip64UncompressedSize) {
					extraFieldZip64.uint64(uncompressedSize);
				}
				if (zip64CompressedSize) {
					extraFieldZip64.uint64(compressedSize);
				}
				if (zip64Offset) {
					extraFieldZip64.uint64(fileEntry.offset);
				}
				if (zip64DiskNumberStart) {
					extraFieldZip64.uint32(fileEntry.diskNumberStart);
				}
				rawExtraFieldZip64 = extraFieldZip64.array;
			} else {
				rawExtraFieldZip64 = EMPTY_UINT8_ARRAY;
			}
			fileEntry.rawExtraFieldZip64 = rawExtraFieldZip64;
			fileEntry.zip64Offset = zip64Offset;
			fileEntry.zip64DiskNumberStart = zip64DiskNumberStart;
			let rawExtraFieldTimestamp;
			const lastModTimeUnix = getTimeUnix(lastModDate);
			if (extendedTimestamp && inUnixTimeRange(lastModTimeUnix)) {
				const extraFieldTimestamp = createRecordWriter(9);
				extraFieldTimestamp.uint16(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
				extraFieldTimestamp.uint16(5);
				extraFieldTimestamp.uint8(extraFieldExtendedTimestampFlag);
				extraFieldTimestamp.uint32(lastModTimeUnix);
				rawExtraFieldTimestamp = extraFieldTimestamp.array;
			} else {
				rawExtraFieldTimestamp = EMPTY_UINT8_ARRAY;
			}
			fileEntry.rawExtraFieldExtendedTimestamp = rawExtraFieldTimestamp;
			const extraFieldLength = getLength(
				rawExtraFieldZip64,
				rawExtraFieldAES,
				rawExtraFieldNTFS,
				rawExtraFieldUnix,
				rawExtraFieldTimestamp,
				rawExtraField);
			if (extraFieldLength > MAX_16_BITS) {
				throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
			}
			directoryDataLength += CENTRAL_FILE_HEADER_LENGTH + getLength(rawFilename, rawComment) + extraFieldLength;
		}
		return directoryDataLength;
	}

	async function writeDirectoryRecords(zipWriter, directoryDataLength, options) {
		const { files, writer } = zipWriter;
		const directoryArray = new Uint8Array(directoryDataLength);
		await initStream(writer);
		let offset = 0;
		let directoryDiskOffset = 0;
		let directoryStartDiskNumber = getDiskNumber(writer);
		let directoryStartDiskOffset = getDiskOffset(writer);
		for (const [indexFileEntry, fileEntry] of Array.from(files.values()).entries()) {
			const {
				offset: fileEntryOffset,
				rawFilename,
				rawExtraFieldZip64,
				rawExtraFieldAES,
				rawExtraFieldExtendedTimestamp,
				rawExtraFieldNTFS,
				rawExtraFieldUnix,
				rawExtraField,
				rawComment,
				versionMadeBy,
				headerArray,
				headerView,
				zip64UncompressedSize,
				zip64CompressedSize,
				zip64DiskNumberStart,
				zip64Offset,
				internalFileAttributes,
				externalFileAttributes,
				diskNumberStart,
				uncompressedSize,
				compressedSize
			} = fileEntry;
			const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField);
			const directoryRecordLength = CENTRAL_FILE_HEADER_LENGTH + getLength(rawFilename, rawComment) + extraFieldLength;
			if (exceedsAvailableSize(writer, offset + directoryRecordLength - directoryDiskOffset)) {
				await writeData(writer, directoryArray.slice(directoryDiskOffset, offset));
				directoryDiskOffset = offset;
				await writer.closeDisk();
			}
			if (indexFileEntry == 0) {
				directoryStartDiskNumber = getDiskNumber(writer);
				directoryStartDiskOffset = getDiskOffset(writer);
			}
			if (!zip64UncompressedSize) {
				setUint32(headerView, HEADER_OFFSET_UNCOMPRESSED_SIZE, uncompressedSize);
			}
			if (!zip64CompressedSize) {
				setUint32(headerView, HEADER_OFFSET_COMPRESSED_SIZE, compressedSize);
			}
			if ((zip64Offset || zip64DiskNumberStart) && fileEntry.version < VERSION_ZIP64) {
				setUint16(headerView, HEADER_OFFSET_VERSION, VERSION_ZIP64);
			}
			const directoryRecord = createRecordWriter(directoryRecordLength);
			directoryRecord.uint32(CENTRAL_FILE_HEADER_SIGNATURE);
			directoryRecord.uint16(versionMadeBy);
			directoryRecord.bytes(headerArray.subarray(0, HEADER_SIZE - 4 - 2));
			directoryRecord.uint16(extraFieldLength);
			directoryRecord.uint16(getLength(rawComment));
			directoryRecord.uint16(zip64DiskNumberStart ? MAX_16_BITS : diskNumberStart);
			directoryRecord.uint16(internalFileAttributes);
			directoryRecord.uint32(externalFileAttributes);
			directoryRecord.uint32(zip64Offset ? MAX_32_BITS : fileEntryOffset);
			directoryRecord.bytes(rawFilename);
			directoryRecord.bytes(rawExtraFieldZip64);
			directoryRecord.bytes(rawExtraFieldAES);
			directoryRecord.bytes(rawExtraFieldExtendedTimestamp);
			directoryRecord.bytes(rawExtraFieldNTFS);
			directoryRecord.bytes(rawExtraFieldUnix);
			directoryRecord.bytes(rawExtraField);
			directoryRecord.bytes(rawComment);
			arraySet(directoryArray, directoryRecord.array, offset);
			offset += directoryRecordLength;
			if (options.onprogress) {
				try {
					await options.onprogress(indexFileEntry + 1, files.size, new Entry(fileEntry));
				} catch {
					// ignored
				}
			}
		}
		await writeData(writer, directoryDiskOffset ? directoryArray.slice(directoryDiskOffset) : directoryArray);
		return { diskNumber: directoryStartDiskNumber, diskOffset: directoryStartDiskOffset };
	}

	async function writeEndOfDirectoryRecord(zipWriter, comment, options, cdInfo) {
		const { writer } = zipWriter;
		const { directoryStart } = cdInfo;
		let { directoryDataLength } = cdInfo;
		let filesLength = zipWriter.files.size;
		let diskNumber = directoryStart.diskNumber;
		let directoryOffset = getSegmentOffset(zipWriter, directoryStart);
		let lastDiskNumber = getDiskNumber(writer);
		if (exceedsAvailableSize(writer, END_OF_CENTRAL_DIR_LENGTH)) {
			lastDiskNumber++;
		}
		let zip64 = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIP64);
		if (directoryOffset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS || lastDiskNumber >= MAX_16_BITS) {
			if (zip64 === false) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			} else {
				zip64 = true;
			}
		}
		const commentLength = getLength(comment);
		if (commentLength > MAX_16_BITS) {
			throw new Error(ERR_INVALID_COMMENT);
		}
		const endOfdirectoryRecord = createRecordWriter(zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH);
		if (exceedsAvailableSize(writer, getLength(endOfdirectoryRecord.array) + commentLength)) {
			await writer.closeDisk();
		}
		lastDiskNumber = getDiskNumber(writer);
		if (zip64) {
			endOfdirectoryRecord.uint32(ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
			endOfdirectoryRecord.uint64(44);
			endOfdirectoryRecord.uint16(45);
			endOfdirectoryRecord.uint16(45);
			endOfdirectoryRecord.uint32(lastDiskNumber);
			endOfdirectoryRecord.uint32(diskNumber);
			endOfdirectoryRecord.uint64(filesLength);
			endOfdirectoryRecord.uint64(filesLength);
			endOfdirectoryRecord.uint64(directoryDataLength);
			endOfdirectoryRecord.uint64(directoryOffset);
			endOfdirectoryRecord.uint32(ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
			endOfdirectoryRecord.uint32(lastDiskNumber);
			endOfdirectoryRecord.uint64(BigInt(getSegmentOffset(zipWriter, writer)) + BigInt(directoryDataLength));
			endOfdirectoryRecord.uint32(lastDiskNumber + 1);
			const supportZip64SplitFile = getOptionValue(zipWriter, options, OPTION_SUPPORT_ZIP64_SPLIT_FILE, true);
			if (supportZip64SplitFile) {
				lastDiskNumber = MAX_16_BITS;
				diskNumber = MAX_16_BITS;
			}
			filesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			directoryDataLength = MAX_32_BITS;
		}
		endOfdirectoryRecord.uint32(END_OF_CENTRAL_DIR_SIGNATURE);
		endOfdirectoryRecord.uint16(lastDiskNumber);
		endOfdirectoryRecord.uint16(diskNumber);
		endOfdirectoryRecord.uint16(filesLength);
		endOfdirectoryRecord.uint16(filesLength);
		endOfdirectoryRecord.uint32(directoryDataLength);
		endOfdirectoryRecord.uint32(directoryOffset);
		endOfdirectoryRecord.uint16(commentLength);
		await writeData(writer, endOfdirectoryRecord.array);
		if (commentLength) {
			await writeData(writer, comment);
		}
	}

	function createRecordWriter(length) {
		const array = new Uint8Array(length);
		const view = getDataView(array);
		let offset = 0;
		return {
			array,
			uint8: value => { setUint8(view, offset, value); offset += 1; },
			uint16: value => { setUint16(view, offset, value); offset += 2; },
			uint32: value => { setUint32(view, offset, value); offset += 4; },
			uint64: value => { setBigUint64(view, offset, BigInt(value)); offset += 8; },
			bytes: value => { arraySet(array, value, offset); offset += getLength(value); },
			skip: count => offset += count
		};
	}

	function getDiskNumber(writer) {
		const { diskNumber = 0 } = writer;
		return diskNumber;
	}

	function getDiskOffset(writer) {
		const { diskOffset = 0 } = writer;
		return diskOffset;
	}

	function exceedsAvailableSize(writer, length) {
		const { availableSize = INFINITY_VALUE } = writer;
		return length > availableSize;
	}

	function getSegmentOffset(zipWriter, { diskNumber = 0, diskOffset = 0 }) {
		return zipWriter.offset - diskOffset - (diskNumber ? zipWriter.initialOffset : 0);
	}

	async function writeData(writer, array) {
		const { writable } = writer;
		const streamWriter = writable.getWriter();
		try {
			await streamWriter.ready;
			writer.size += getLength(array);
			await streamWriter.write(array);
		} finally {
			streamWriter.releaseLock();
		}
	}

	async function flushBufferedData(readable, writer, signal, onChunkWritten) {
		const streamWriter = writer.writable.getWriter();
		try {
			await readable.pipeTo(new WritableStream({
				async write(chunk) {
					await streamWriter.ready;
					await streamWriter.write(chunk);
					onChunkWritten(getLength(chunk));
				}
			}), { preventClose: true, preventAbort: true, signal });
		} finally {
			streamWriter.releaseLock();
		}
	}

	function getTimeNTFS(date) {
		if (date) {
			return ((BigInt(date.getTime()) + BigInt(11644473600000)) * BigInt(10000));
		}
	}

	function getTimeUnix(date) {
		return Math.floor(date.getTime() / 1000);
	}

	function inUnixTimeRange(timeUnix) {
		return timeUnix >= MIN_UNIX_TIME && timeUnix <= MAX_UNIX_TIME;
	}

	function clampUnixTime(timeUnix) {
		return Math.min(MAX_UNIX_TIME, Math.max(MIN_UNIX_TIME, timeUnix));
	}

	function getOptionValue(zipWriter, options, name, defaultValue) {
		const result = options[name] === UNDEFINED_VALUE ? zipWriter.options[name] : options[name];
		return result === UNDEFINED_VALUE ? defaultValue : result;
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


	function getLength(...arrayLikes) {
		let result = 0;
		arrayLikes.forEach(arrayLike => arrayLike && (result += arrayLike.length));
		return result;
	}

	function getHeaderArrayData({
		version,
		bitFlag,
		compressionMethod,
		uncompressedSize,
		compressedSize,
		lastModDate,
		rawLastModDate,
		rawFilename,
		zip64CompressedSize,
		zip64UncompressedSize,
		extraFieldLength
	}) {
		const headerRecord = createRecordWriter(HEADER_SIZE - 4);
		const headerArray = headerRecord.array;
		const headerView = getDataView(headerArray);
		headerRecord.uint16(version);
		headerRecord.uint16(bitFlag);
		headerRecord.uint16(compressionMethod);
		if (rawLastModDate === UNDEFINED_VALUE) {
			const dateArray = new Uint32Array(1);
			const dateView = getDataView(dateArray);
			setUint16(dateView, 0, (((lastModDate.getHours() << 6) | lastModDate.getMinutes()) << 5) | lastModDate.getSeconds() / 2);
			setUint16(dateView, 2, ((((lastModDate.getFullYear() - 1980) << 4) | (lastModDate.getMonth() + 1)) << 5) | lastModDate.getDate());
			rawLastModDate = dateArray[0];
		}
		headerRecord.uint32(rawLastModDate);
		headerRecord.skip(4);
		if (zip64CompressedSize || compressedSize !== UNDEFINED_VALUE) {
			headerRecord.uint32(zip64CompressedSize ? MAX_32_BITS : compressedSize);
		} else {
			headerRecord.skip(4);
		}
		if (zip64UncompressedSize || uncompressedSize !== UNDEFINED_VALUE) {
			headerRecord.uint32(zip64UncompressedSize ? MAX_32_BITS : uncompressedSize);
		} else {
			headerRecord.skip(4);
		}
		headerRecord.uint16(getLength(rawFilename));
		headerRecord.uint16(extraFieldLength);
		return {
			headerArray,
			headerView,
			rawLastModDate
		};
	}

	function getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod) {
		let bitFlag = 0;
		if (useUnicodeFileNames) {
			bitFlag = bitFlag | BITFLAG_LANG_ENCODING_FLAG;
		}
		if (dataDescriptor) {
			bitFlag = bitFlag | BITFLAG_DATA_DESCRIPTOR;
		}
		if (compressionMethod == COMPRESSION_METHOD_DEFLATE || compressionMethod == COMPRESSION_METHOD_DEFLATE_64) {
			if (level >= 0 && level <= 3) {
				bitFlag = bitFlag | BITFLAG_LEVEL_SUPER_FAST_MASK;
			}
			if (level > 3 && level <= 5) {
				bitFlag = bitFlag | BITFLAG_LEVEL_FAST_MASK;
			}
			if (level == 9) {
				bitFlag = bitFlag | BITFLAG_LEVEL_MAX_MASK;
			}
		}
		if (encrypted) {
			bitFlag = bitFlag | BITFLAG_ENCRYPTED;
		}
		return bitFlag;
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


	function getMimeType() {
		return "application/octet-stream";
	}

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


	const DEFAULT_THRESHOLD$2 = 1024 * 1024;
	const DEFAULT_DIRECTORY_NAME$1 = ".zip.js-temp";

	function createOPFSTempStream(options = {}) {
		const {
			thresholdBytes = DEFAULT_THRESHOLD$2,
			directoryName = DEFAULT_DIRECTORY_NAME$1,
			getDirectory = () => navigator.storage.getDirectory()
		} = options;
		let directoryHandlePromise;
		function getTempDirectory() {
			if (!directoryHandlePromise) {
				directoryHandlePromise = Promise.resolve(getDirectory())
					.then(root => root.getDirectoryHandle(directoryName, { create: true }));
			}
			return directoryHandlePromise;
		}
		return function () {
			const memoryChunks = [];
			let bufferedSize = 0;
			let spilled = false;
			let fileName, fileHandle, fileWriter, fileReader;

			async function spillToFile() {
				const directoryHandle = await getTempDirectory();
				fileName = crypto.randomUUID();
				fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
				fileWriter = (await fileHandle.createWritable()).getWriter();
				spilled = true;
				for (const chunk of memoryChunks) {
					await fileWriter.write(chunk);
				}
				memoryChunks.length = 0;
			}

			const writable = new WritableStream({
				async write(chunk) {
					if (spilled) {
						await fileWriter.write(chunk);
					} else {
						memoryChunks.push(chunk);
						bufferedSize += chunk.length;
						if (bufferedSize > thresholdBytes) {
							await spillToFile();
						}
					}
				},
				async close() {
					if (fileWriter) {
						await fileWriter.close();
						fileWriter = null;
					}
				}
			});

			let memoryIndex = 0;
			const readable = new ReadableStream({
				async pull(controller) {
					if (spilled) {
						if (!fileReader) {
							const file = await fileHandle.getFile();
							fileReader = file.stream().getReader();
						}
						const { value, done } = await fileReader.read();
						if (done) {
							controller.close();
						} else {
							controller.enqueue(value);
						}
					} else if (memoryIndex < memoryChunks.length) {
						controller.enqueue(memoryChunks[memoryIndex++]);
					} else {
						controller.close();
					}
				},
				async cancel(reason) {
					if (fileReader) {
						await fileReader.cancel(reason);
					}
				}
			}, { highWaterMark: 0 });
			async function dispose() {
				if (fileWriter) {
					try {
						await fileWriter.close();
					} catch {
						// ignored
					}
					fileWriter = null;
				}
				if (fileName) {
					try {
						const directoryHandle = await getTempDirectory();
						await directoryHandle.removeEntry(fileName);
					} catch {
						// ignored
					}
					fileHandle = fileName = null;
				}
				memoryChunks.length = 0;
			}

			return { writable, readable, dispose };
		};
	}

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


	const DEFAULT_THRESHOLD$1 = 1024 * 1024;

	function createBlobTempStream(options = {}) {
		const {
			thresholdBytes = DEFAULT_THRESHOLD$1
		} = options;
		return function () {
			const memoryChunks = [];
			let bufferedSize = 0;
			let spilled = false;
			let blobWriter, blobPromise, blobReader;

			async function spillToBlob() {
				const transformStream = new TransformStream();
				blobPromise = new Response(transformStream.readable).blob();
				blobWriter = transformStream.writable.getWriter();
				spilled = true;
				for (const chunk of memoryChunks) {
					await blobWriter.write(chunk);
				}
				memoryChunks.length = 0;
			}

			const writable = new WritableStream({
				async write(chunk) {
					if (spilled) {
						await blobWriter.write(chunk);
					} else {
						memoryChunks.push(chunk);
						bufferedSize += chunk.length;
						if (bufferedSize > thresholdBytes) {
							await spillToBlob();
						}
					}
				},
				async close() {
					if (blobWriter) {
						await blobWriter.close();
						blobWriter = null;
					}
				}
			});

			let memoryIndex = 0;
			const readable = new ReadableStream({
				async pull(controller) {
					if (spilled) {
						if (!blobReader) {
							const blob = await blobPromise;
							blobReader = blob.stream().getReader();
						}
						const { value, done } = await blobReader.read();
						if (done) {
							controller.close();
						} else {
							controller.enqueue(value);
						}
					} else if (memoryIndex < memoryChunks.length) {
						controller.enqueue(memoryChunks[memoryIndex++]);
					} else {
						controller.close();
					}
				},
				async cancel(reason) {
					if (blobReader) {
						await blobReader.cancel(reason);
					}
				}
			}, { highWaterMark: 0 });
			async function dispose() {
				if (blobWriter) {
					try {
						await blobWriter.abort();
					} catch {
						// ignored
					}
					blobWriter = null;
				}
				if (blobPromise) {
					blobPromise.catch(() => {
						// ignored
					});
					blobPromise = null;
				}
				memoryChunks.length = 0;
			}

			return { writable, readable, dispose };
		};
	}

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


	const DEFAULT_THRESHOLD = 1024 * 1024;
	const DEFAULT_DIRECTORY_NAME = ".zip.js-temp";
	const READ_CHUNK_SIZE = 512 * 1024;
	const ERR_UNSUPPORTED_CONTEXT = "createSyncAccessHandle is only available in dedicated workers";

	function createSyncAccessHandleTempStream(options = {}) {
		const {
			thresholdBytes = DEFAULT_THRESHOLD,
			directoryName = DEFAULT_DIRECTORY_NAME,
			getDirectory
		} = options;
		if (!getDirectory &&
			(typeof FileSystemFileHandle == "undefined" || !FileSystemFileHandle.prototype.createSyncAccessHandle)) {
			throw new Error(ERR_UNSUPPORTED_CONTEXT);
		}
		const getRootDirectory = getDirectory || (() => navigator.storage.getDirectory());
		let directoryHandlePromise;
		function getTempDirectory() {
			if (!directoryHandlePromise) {
				directoryHandlePromise = Promise.resolve(getRootDirectory())
					.then(root => root.getDirectoryHandle(directoryName, { create: true }));
			}
			return directoryHandlePromise;
		}
		return function () {
			const memoryChunks = [];
			let bufferedSize = 0;
			let spilled = false;
			let fileName, accessHandle;
			let writeOffset = 0;
			let readOffset = 0;

			async function spillToFile() {
				const directoryHandle = await getTempDirectory();
				fileName = crypto.randomUUID();
				const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
				accessHandle = await fileHandle.createSyncAccessHandle();
				spilled = true;
				for (const chunk of memoryChunks) {
					accessHandle.write(chunk, { at: writeOffset });
					writeOffset += chunk.length;
				}
				memoryChunks.length = 0;
			}

			const writable = new WritableStream({
				async write(chunk) {
					if (spilled) {
						accessHandle.write(chunk, { at: writeOffset });
						writeOffset += chunk.length;
					} else {
						memoryChunks.push(chunk);
						bufferedSize += chunk.length;
						if (bufferedSize > thresholdBytes) {
							await spillToFile();
						}
					}
				},
				close() {
					if (accessHandle) {
						accessHandle.flush();
					}
				}
			});

			let memoryIndex = 0;
			const readable = new ReadableStream({
				pull(controller) {
					if (spilled) {
						const remaining = writeOffset - readOffset;
						if (remaining <= 0) {
							controller.close();
							return;
						}
						const buffer = new Uint8Array(Math.min(READ_CHUNK_SIZE, remaining));
						const read = accessHandle.read(buffer, { at: readOffset });
						if (read) {
							readOffset += read;
							controller.enqueue(buffer.subarray(0, read));
						} else {
							controller.close();
						}
					} else if (memoryIndex < memoryChunks.length) {
						controller.enqueue(memoryChunks[memoryIndex++]);
					} else {
						controller.close();
					}
				}
			}, { highWaterMark: 0 });
			async function dispose() {
				if (accessHandle) {
					try {
						accessHandle.close();
					} catch {
						// ignored
					}
					accessHandle = null;
				}
				if (fileName) {
					try {
						const directoryHandle = await getTempDirectory();
						await directoryHandle.removeEntry(fileName);
					} catch {
						// ignored
					}
					fileName = null;
				}
				memoryChunks.length = 0;
			}

			return { writable, readable, dispose };
		};
	}

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


	try {
		setDefaultConfiguration({ baseURI: (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('zip-legacy.js', document.baseURI).href)) });
	} catch {
		// ignored
	}

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


	N(setDefaultConfiguration);

	exports.BlobReader = BlobReader;
	exports.BlobWriter = BlobWriter;
	exports.Data64URIReader = Data64URIReader;
	exports.Data64URIWriter = Data64URIWriter;
	exports.ERR_AMBIGUOUS_ARCHIVE = ERR_AMBIGUOUS_ARCHIVE;
	exports.ERR_BAD_FORMAT = ERR_BAD_FORMAT;
	exports.ERR_CENTRAL_DIRECTORY_NOT_FOUND = ERR_CENTRAL_DIRECTORY_NOT_FOUND;
	exports.ERR_DUPLICATED_NAME = ERR_DUPLICATED_NAME;
	exports.ERR_ENCRYPTED = ERR_ENCRYPTED;
	exports.ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND;
	exports.ERR_EOCDR_NOT_FOUND = ERR_EOCDR_NOT_FOUND;
	exports.ERR_EXTRAFIELD_ZIP64_NOT_FOUND = ERR_EXTRAFIELD_ZIP64_NOT_FOUND;
	exports.ERR_HTTP_RANGE = ERR_HTTP_RANGE;
	exports.ERR_HTTP_RESOURCE_CHANGED = ERR_HTTP_RESOURCE_CHANGED;
	exports.ERR_INVALID_CODEC_DEFINITION = ERR_INVALID_CODEC_DEFINITION;
	exports.ERR_INVALID_CODEC_MODULE = ERR_INVALID_CODEC_MODULE;
	exports.ERR_INVALID_COMMENT = ERR_INVALID_COMMENT;
	exports.ERR_INVALID_COMPRESSED_DATA = ERR_INVALID_COMPRESSED_DATA;
	exports.ERR_INVALID_ENCRYPTION_STRENGTH = ERR_INVALID_ENCRYPTION_STRENGTH;
	exports.ERR_INVALID_ENTRY_COMMENT = ERR_INVALID_ENTRY_COMMENT;
	exports.ERR_INVALID_ENTRY_NAME = ERR_INVALID_ENTRY_NAME;
	exports.ERR_INVALID_EXTRAFIELD_DATA = ERR_INVALID_EXTRAFIELD_DATA;
	exports.ERR_INVALID_EXTRAFIELD_TYPE = ERR_INVALID_EXTRAFIELD_TYPE;
	exports.ERR_INVALID_PASSWORD = ERR_INVALID_PASSWORD;
	exports.ERR_INVALID_SIGNATURE = ERR_INVALID_SIGNATURE;
	exports.ERR_INVALID_UNCOMPRESSED_SIZE = ERR_INVALID_UNCOMPRESSED_SIZE;
	exports.ERR_INVALID_VERSION = ERR_INVALID_VERSION;
	exports.ERR_ITERATOR_COMPLETED_TOO_SOON = ERR_ITERATOR_COMPLETED_TOO_SOON;
	exports.ERR_LOCAL_FILE_HEADER_NOT_FOUND = ERR_LOCAL_FILE_HEADER_NOT_FOUND;
	exports.ERR_OVERLAPPING_ENTRY = ERR_OVERLAPPING_ENTRY;
	exports.ERR_RESERVED_COMPRESSION_METHOD = ERR_RESERVED_COMPRESSION_METHOD;
	exports.ERR_SPLIT_ZIP_FILE = ERR_SPLIT_ZIP_FILE;
	exports.ERR_UNDEFINED_READER = ERR_UNDEFINED_READER;
	exports.ERR_UNDEFINED_UNCOMPRESSED_SIZE = ERR_UNDEFINED_UNCOMPRESSED_SIZE;
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION$1;
	exports.ERR_UNSUPPORTED_ENCRYPTION = ERR_UNSUPPORTED_ENCRYPTION;
	exports.ERR_UNSUPPORTED_ENCRYPTION_USDZ = ERR_UNSUPPORTED_ENCRYPTION_USDZ;
	exports.ERR_UNSUPPORTED_FORMAT = ERR_UNSUPPORTED_FORMAT;
	exports.ERR_WRITER_NOT_INITIALIZED = ERR_WRITER_NOT_INITIALIZED;
	exports.ERR_ZIP_NOT_EMPTY = ERR_ZIP_NOT_EMPTY;
	exports.HttpRangeReader = HttpRangeReader;
	exports.HttpReader = HttpReader;
	exports.Reader = Reader;
	exports.SplitDataReader = SplitDataReader;
	exports.SplitDataWriter = SplitDataWriter;
	exports.TextReader = TextReader;
	exports.TextWriter = TextWriter;
	exports.Uint8ArrayReader = Uint8ArrayReader;
	exports.Uint8ArrayWriter = Uint8ArrayWriter;
	exports.Writer = Writer;
	exports.ZipReader = ZipReader;
	exports.ZipReaderStream = ZipReaderStream;
	exports.ZipWriter = ZipWriter;
	exports.ZipWriterStream = ZipWriterStream;
	exports.configure = configure;
	exports.createBlobTempStream = createBlobTempStream;
	exports.createOPFSTempStream = createOPFSTempStream;
	exports.createSyncAccessHandleTempStream = createSyncAccessHandleTempStream;
	exports.getMimeType = getMimeType;
	exports.registerCodec = registerCodec;
	exports.resetConfiguration = resetConfiguration;
	exports.terminateWorkers = terminateWorkers;
	exports.unregisterCodec = unregisterCodec;

}));
