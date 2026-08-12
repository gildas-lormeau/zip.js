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
	const ARCHIVE_EXTRA_DATA_SIGNATURE = 0x08064b50;
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
	const BITFLAG_STRONG_ENCRYPTION = 0b1000000;
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
		workerStartupTimeout: 5000,
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
		"workerStartupTimeout",
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

	const r=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],n=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],e=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],f=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],i=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],l=new Uint8Array(288);l.fill(8,0,144),l.fill(9,144,256),l.fill(7,256,280),l.fill(8,280,288);const o=new Uint8Array(30).fill(5);function h(r){const n=new Uint16Array(16);for(const e of r)n[e]++;n[0]=0;const e=new Uint16Array(17);for(let r=1;15>=r;r++)e[r+1]=e[r]+n[r];const f=new Uint16Array(r.length);for(let n=0;n<r.length;n++)r[n]&&(f[e[r[n]]++]=n);return {l:n,symbols:f}}const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function q$1(q){q({workerURI:q=>{const s="text/javascript",w=(t=>{let q=0,s=0,w=0,U=new Uint8Array(1024),y=0,c=0;for(;!c;){c=X(1);const r=X(2);if(0==r)j();else if(1==r)x(h(l),h(o));else {if(2!=r)throw Error("invalid deflate block type");x(...M());}}return U.subarray(0,y);function u(){if(q>=t.length)throw Error("unexpected end of deflate data");return t[q++]}function X(r){for(;r>w;)s|=u()<<w,w+=8;const n=s&(1<<r)-1;return s>>>=r,w-=r,n}function j(){s=0,w=0;const r=u()|u()<<8;q+=2,W(y+r);for(let n=0;r>n;n++)U[y++]=u();}function x(i,l){let o=z(i);for(;256!=o;){if(256>o)W(y+1),U[y++]=o;else {const i=o-257,h=r[i]+X(n[i]),t=z(l),q=e[t]+X(f[t]);W(y+h);const s=y-q;for(let r=0;h>r;r++)U[y++]=U[s+r];}o=z(i);}}function M(){const r=X(5)+257,n=X(5)+1,e=X(4)+4,f=new Uint8Array(19);for(let r=0;e>r;r++)f[i[r]]=X(3);const l=h(f),o=new Uint8Array(r+n);let t=0;for(;t<o.length;){const r=z(l);if(16>r)o[t++]=r;else if(16==r){const r=o[t-1];let n=X(2)+3;for(;n--;)o[t++]=r;}else t+=17==r?X(3)+3:X(7)+11;}return [h(o.subarray(0,r)),h(o.subarray(r))]}function z(r){const{l:n,symbols:e}=r;let f=0,i=0,l=0;for(let r=1;15>=r;r++){f|=X(1);const o=n[r];if(o>f-i)return e[l+(f-i)];l+=o,i=i+o<<1,f<<=1;}throw Error("invalid huffman code")}function W(r){if(U.length<r){let n=2*U.length;for(;r>n;)n*=2;const e=new Uint8Array(n);e.set(U.subarray(0,y)),U=e;}}})((r=>{const n=(r=(r+"").replace(/[^A-Za-z0-9+/=]/g,"")).length,e=[];for(let f=0;n>f;f+=4){const n=t.indexOf(r[f])<<18|t.indexOf(r[f+1])<<12|(63&t.indexOf(r[f+2]))<<6|63&t.indexOf(r[f+3]);e.push(n>>16&255),"="!==r[f+2]&&e.push(n>>8&255),"="!==r[f+3]&&e.push(255&n);}return new Uint8Array(e)})("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"));if(q){const r=new Blob([w],{type:s});return URL.createObjectURL(r)}return "data:"+s+";base64,"+(r=>{let n="";const e=r.length;let f=0;for(;e>f+2;f+=3){const e=r[f]<<16|r[f+1]<<8|r[f+2];n+=t[e>>18&63]+t[e>>12&63]+t[e>>6&63]+t[63&e];}const i=e-f;if(1===i){const e=r[f]<<16;n+=t[e>>18&63]+t[e>>12&63]+"==";}else if(2===i){const e=r[f]<<16|r[f+1]<<8;n+=t[e>>18&63]+t[e>>12&63]+t[e>>6&63]+"=";}return n})(w)}});}

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
			setCodecStreams(format, await import(/* webpackIgnore: true */ /* @vite-ignore */ codecURI));
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
	const T$1 = [[], [], [], [], [], [], [], []];
	for (let n = 0; n < 256; n++) {
		let t = n;
		for (let j = 0; j < 8; j++) {
			t = (t & 1) ? (t >>> 1) ^ 0xEDB88320 : t >>> 1;
		}
		T$1[0][n] = t;
	}
	for (let n = 0; n < 256; n++) {
		for (let k = 1; k < 8; k++) {
			const previous = T$1[k - 1][n];
			T$1[k][n] = (previous >>> 8) ^ T$1[0][previous & 0xFF];
		}
	}
	const [T0, T1, T2, T3, T4, T5, T6, T7] = T$1;

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
						if ((decryptedHeader[HEADER_LENGTH - 1] ^ zipCrypto.passwordVerification) != 0) {
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


	function toCompatibleReadable(readable) {
		if (readable instanceof ReadableStream) {
			return readable;
		}
		const reader = readable.getReader();
		return new ReadableStream({
			async pull(controller) {
				const { value, done } = await reader.read();
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

	function toCompatibleWritable(writable) {
		if (writable instanceof WritableStream) {
			return writable;
		}
		const writer = writable.getWriter();
		return new WritableStream({
			write(chunk) {
				return writer.write(chunk);
			},
			close() {
				return writer.close();
			},
			abort(reason) {
				return writer.abort(reason);
			}
		});
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
	const GZIP_HEADER_BYTES = [0x1f, 0x8b, 0x08];
	const GZIP_OUTPUT_STALL_TIMEOUT = 5000;

	class DeflateStream extends TransformStream {

		constructor(options, { chunkSize, CompressionStreamZlib, CompressionStream }) {
			super({});
			const { compressed, encrypted, useCompressionStream, zipCrypto, signed, level, deflate64, format, compressionMethod } = options;
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
					readable = pipeThroughBackpressured(readable, createCodecStream(codecStreams.CompressionStream, format, { level, chunkSize, compressionMethod }));
				} else if (useGzipCrc32) {
					gzipCrc32Stream = new GzipToRawDeflateStream();
					readable = pipeThroughBackpressured(readable, new CompressionStream(FORMAT_GZIP));
					readable = pipeThrough(readable, gzipCrc32Stream);
				} else {
					try {
						readable = pipeThroughCompressionStream(readable, useCompressionStream, { level, chunkSize }, CompressionStream, CompressionStreamZlib);
					} catch (error) {
						let gzipStream;
						try {
							gzipStream = new CompressionStream(FORMAT_GZIP);
						} catch {
							throw error;
						}
						readable = pipeThroughBackpressured(readable, gzipStream);
						readable = pipeThrough(readable, new GzipToRawDeflateStream());
					}
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

	function pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize) {
		const crc32 = new Crc32();
		let outputLength = 0;
		let inputDone = false;
		let watchdogTimeout;
		let resolveTrailerReady, rejectTrailerReady;
		const trailerReady = new Promise((resolve, reject) => {
			resolveTrailerReady = resolve;
			rejectTrailerReady = reject;
		});
		trailerReady.catch(() => { });
		if (!outputSize) {
			resolveTrailerReady();
		}
		const gzipWrapStream = new TransformStream({
			start(controller) {
				const header = new Uint8Array(GZIP_HEADER_LENGTH);
				header.set(GZIP_HEADER_BYTES);
				controller.enqueue(header);
			},
			transform(chunk, controller) {
				controller.enqueue(chunk);
			},
			async flush(controller) {
				inputDone = true;
				startWatchdog();
				try {
					await trailerReady;
				} finally {
					stopWatchdog();
				}
				const trailer = new Uint8Array(GZIP_TRAILER_LENGTH);
				const dataView = getDataView(trailer);
				dataView.setUint32(0, crc32.get(), true);
				dataView.setUint32(4, outputSize, true);
				controller.enqueue(trailer);
			},
			cancel(reason) {
				rejectTrailerReady(reason);
			}
		});
		const outputStream = new TransformStream({
			transform(chunk, controller) {
				crc32.append(chunk);
				outputLength += chunk.length;
				if (outputLength >= outputSize) {
					resolveTrailerReady();
				} else if (inputDone) {
					startWatchdog();
				}
				controller.enqueue(chunk);
			},
			cancel(reason) {
				rejectTrailerReady(reason);
			}
		});
		readable = pipeThrough(readable, gzipWrapStream);
		readable = pipeThroughBackpressured(readable, gzipStream);
		return pipeThrough(readable, outputStream);

		function startWatchdog() {
			stopWatchdog();
			watchdogTimeout = setTimeout(() => rejectTrailerReady(new Error(ERR_INVALID_UNCOMPRESSED_SIZE)), GZIP_OUTPUT_STALL_TIMEOUT);
		}

		function stopWatchdog() {
			clearTimeout(watchdogTimeout);
		}
	}

	class InflateStream extends TransformStream {

		constructor(options, { chunkSize, DecompressionStreamZlib, DecompressionStream }) {
			super({});
			const { zipCrypto, encrypted, signed, signature, compressed, useCompressionStream, deflate64, format, compressionMethod, rawBitFlag, outputSize } = options;
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
					readable = pipeThroughBackpressured(readable, createCodecStream(codecStreams.DecompressionStream, format, { chunkSize, compressionMethod, rawBitFlag, uncompressedSize: outputSize }));
				} else {
					try {
						readable = pipeThroughCompressionStream(readable, useCompressionStream, { chunkSize, deflate64 }, DecompressionStream, DecompressionStreamZlib);
					} catch (error) {
						if (deflate64 || outputSize === UNDEFINED_VALUE) {
							throw error;
						}
						let gzipStream;
						try {
							gzipStream = new DecompressionStream(FORMAT_GZIP);
						} catch {
							throw error;
						}
						readable = pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize);
					}
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

	const formatSupportByStream = new Map();

	function supportsFormat(StreamClass, format) {
		if (!StreamClass) {
			return false;
		}
		let supportByFormat = formatSupportByStream.get(StreamClass);
		if (!supportByFormat) {
			supportByFormat = new Map();
			formatSupportByStream.set(StreamClass, supportByFormat);
		}
		let supported = supportByFormat.get(format);
		if (supported === UNDEFINED_VALUE) {
			try {
				new StreamClass(format);
				supported = true;
			} catch {
				supported = false;
			}
			supportByFormat.set(format, supported);
		}
		return supported;
	}

	function supportsDeflateRaw(StreamClass) {
		return supportsFormat(StreamClass, FORMAT_DEFLATE_RAW);
	}

	function supportsGzip(StreamClass) {
		return supportsFormat(StreamClass, FORMAT_GZIP);
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

	function pipeThroughCompressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamZlib) {
		const Stream = useCompressionStream && CompressionStreamNative ?
			CompressionStreamNative :
			CompressionStreamZlib || CompressionStreamNative;
		const format = options.deflate64 ? FORMAT_DEFLATE64_RAW : FORMAT_DEFLATE_RAW;
		let codecStream;
		try {
			codecStream = new Stream(format, options);
		} catch (error) {
			if (useCompressionStream && CompressionStreamZlib && Stream != CompressionStreamZlib) {
				codecStream = new CompressionStreamZlib(format, options);
			} else {
				throw error;
			}
		}
		return pipeThroughBackpressured(readable, codecStream);
	}

	function pipeThrough(readable, transformStream) {
		return toCompatibleReadable(readable).pipeThrough(transformStream);
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
	const ERR_WORKER_STARTUP_TIMEOUT = "Worker startup timeout";

	let webWorkerSupported, webWorkerSource, webWorkerURI, webWorkerOptions;
	let transferStreamsSupported = true;
	try {
		transferStreamsSupported = typeof structuredClone == FUNCTION_TYPE && structuredClone(new DOMException("", "AbortError")).code !== UNDEFINED_VALUE;
	} catch {
		// ignored
	}
	let initModule = () => { };

	async function supportsDeflate(config) {
		const { CompressionStream: NativeStream, CompressionStreamZlib: ZlibStream } = config;
		if (ZlibStream && !ZlibStream.requiresModule) {
			return true;
		}
		if (supportsDeflateRaw(NativeStream) || supportsGzip(NativeStream)) {
			return true;
		}
		if (ZlibStream) {
			try {
				await initModule(config);
				return true;
			} catch {
				return false;
			}
		}
		return false;
	}

	function resetWebWorkerSupport() {
		webWorkerSupported = UNDEFINED_VALUE;
	}

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
		const { baseURI, chunkSize, workerStartupTimeout } = config;
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
				workerAlive: false,
				terminated: false,
				interface: {
					run: async () => {
						try {
							return await runWebWorker(workerData, { chunkSize, wasmURI, baseURI, workerStartupTimeout });
						} catch (error) {
							if (error && error.workerStartupFailed) {
								webWorkerSupported = false;
								const { reader } = workerData;
								if (reader) {
									reader.releaseLock();
								}
								workerData.reader = null;
								workerData.writer = null;
								return runWorker$1(workerData, config);
							}
							throw error;
						}
					}
				}
			});
		}
		return workerData.interface;
	}

	async function runWorker$1({ options, readable, writable, onTaskFinished }, config) {
		let codecStream;
		try {
			if (options.compressed && !options.format) {
				const deflate = options.codecType.startsWith(CODEC_DEFLATE);
				const ZlibStream = deflate ? config.CompressionStreamZlib : config.DecompressionStreamZlib;
				const NativeStream = deflate ? config.CompressionStream : config.DecompressionStream;
				if (!options.useCompressionStream) {
					try {
						await initModule(config);
					} catch {
						if (!ZlibStream || ZlibStream.requiresModule) {
							options.useCompressionStream = true;
						}
					}
				} else if (ZlibStream && ZlibStream.requiresModule && !supportsDeflateRaw(NativeStream)) {
					try {
						await initModule(config);
					} catch {
						// ignored
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
		const { workerStartupTimeout } = config;
		if (!workerData.workerAlive && Number.isFinite(workerStartupTimeout) && workerStartupTimeout >= 0) {
			workerData.startupTimeout = setTimeout(() => onStartupTimeout(workerData), workerStartupTimeout);
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
		worker.addEventListener(MESSAGE_EVENT_TYPE, event => {
			workerData.workerAlive = true;
			clearStartupTimeout(workerData);
			onMessage(event, workerData);
		});
		worker.addEventListener(ERROR_EVENT_TYPE, event => onWorkerError(event, workerData));
		worker.addEventListener(MESSAGE_ERROR_EVENT_TYPE, event => onWorkerError(event, workerData));
		return worker;
	}

	function onStartupTimeout(workerData) {
		workerData.startupTimeout = null;
		if (workerData.workerAlive) {
			return;
		}
		const { rejectResult, writer } = workerData;
		terminateWorker$1(workerData);
		workerData.worker = null;
		if (rejectResult) {
			const error = new Error(ERR_WORKER_STARTUP_TIMEOUT);
			error.workerStartupFailed = true;
			rejectResult(error);
			if (writer) {
				writer.releaseLock();
			}
		}
	}

	function clearStartupTimeout(workerData) {
		const { startupTimeout } = workerData;
		if (startupTimeout) {
			clearTimeout(startupTimeout);
			workerData.startupTimeout = null;
		}
	}

	function onWorkerError(event, workerData) {
		if (event.preventDefault) {
			event.preventDefault();
		}
		clearStartupTimeout(workerData);
		const { workerAlive, rejectResult, writer, onTaskFinished } = workerData;
		terminateWorker$1(workerData);
		if (!workerAlive) {
			workerData.worker = null;
		}
		if (rejectResult) {
			let error = event.error || new Error(event.message || ERROR_EVENT_TYPE);
			if (!workerAlive) {
				error = Object.assign(new Error(error.message || ERROR_EVENT_TYPE), { workerStartupFailed: true });
			}
			rejectResult(error);
			if (writer) {
				writer.releaseLock();
			}
			if (workerAlive) {
				onTaskFinished();
			}
		}
	}

	function sendMessage(message, { worker, writer, transferStreams, workerAlive }) {
		try {
			const { value, readable, writable } = message;
			const transferables = [];
			if (value) {
				message.value = toExactUint8Array(value);
				transferables.push(message.value.buffer);
			}
			if (transferStreams && transferStreamsSupported && workerAlive) {
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
				const { message, stack, code, name, outputSize, cause } = error;
				const responseError = new Error(message);
				Object.assign(responseError, { stack, code, name, outputSize });
				if (cause) {
					responseError.cause = Object.assign(new Error(cause.message), { name: cause.name });
				}
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
		resetWebWorkerSupport();
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
				return toCompatibleReadable(blob.stream());
			}
			if (blobSliceReliable) {
				return toCompatibleReadable(blob.slice(offset, offset + readSize).stream());
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

	function responseSupportsGlobalReadable() {
		return typeof Blob.prototype.stream != FUNCTION_TYPE || new Blob([]).stream() instanceof ReadableStream;
	}

	class BlobWriter extends Stream {

		constructor(contentType) {
			super();
			const writer = this;
			const transformStream = new TransformStream();
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
				get() {
					return transformStream.writable;
				}
			});
			if (responseSupportsGlobalReadable()) {
				const headers = [];
				if (contentType) {
					headers.push([HTTP_HEADER_CONTENT_TYPE, contentType]);
				}
				writer.blob = new Response(transformStream.readable, { headers }).blob();
			} else {
				const chunks = [];
				writer.blob = transformStream.readable
					.pipeTo(new WritableStream({
						write(chunk) {
							chunks.push(chunk);
						}
					}))
					.then(() => new Blob(chunks, { type: contentType }));
			}
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
			const diskOffset = diskOffsets[diskNumber];
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
			if (reader instanceof ReadableStream || typeof reader.getReader == FUNCTION_TYPE) {
				reader = {
					readable: toCompatibleReadable(reader)
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
			if (writer instanceof WritableStream || typeof writer.getWriter == FUNCTION_TYPE) {
				writer = {
					writable: toCompatibleWritable(writer)
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
	const ERR_ENCRYPTED_CENTRAL_DIRECTORY = "Encrypted central directory is not supported";
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
			let zip64EndOfDirectoryVersion2;
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
					zip64EndOfDirectoryVersion2 = getBigUint64(endOfDirectoryView, 4) > ZIP64_END_OF_CENTRAL_DIR_LENGTH - 12;
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
					if (indexFile == 0 && (zip64EndOfDirectoryVersion2 || detectEncryptedCentralDirectory(directoryView))) {
						throw new Error(ERR_ENCRYPTED_CENTRAL_DIRECTORY);
					}
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
				rawBitFlag,
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
			if (encrypted && (localDirectory.rawBitFlag & BITFLAG_STRONG_ENCRYPTION) == BITFLAG_STRONG_ENCRYPTION) {
				throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
			}
			const registeredCodec = passThrough ? UNDEFINED_VALUE : getRegisteredCodec(compressionMethod);
			if (compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE && compressionMethod != COMPRESSION_METHOD_DEFLATE_64 && !registeredCodec && !passThrough) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION$1);
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
			const readable = toCompatibleReadable(reader.createReadable({ offset: dataOffset, size }));
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
					compressionMethod,
					rawBitFlag,
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

	function detectEncryptedCentralDirectory(directoryView) {
		const maxOffset = Math.min(directoryView.byteLength, 1024) - 3;
		for (let offset = 0; offset < maxOffset; offset++) {
			if (getUint32(directoryView, offset) == ARCHIVE_EXTRA_DATA_SIGNATURE) {
				return true;
			}
		}
		return false;
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
		ERR_ENCRYPTED_CENTRAL_DIRECTORY: ERR_ENCRYPTED_CENTRAL_DIRECTORY,
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
			const { resolvedOptions } = metadataInfo;
			if (resolvedOptions.level != 0 && resolvedOptions.compressionMethod === UNDEFINED_VALUE &&
				!resolvedOptions.passThrough && !(await supportsDeflate(zipWriter.config))) {
				resolvedOptions.level = 0;
			}
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
		let externalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES);
		const externalFileAttributesProvided = externalFileAttributes !== UNDEFINED_VALUE;
		if (!externalFileAttributesProvided) {
			externalFileAttributes = 0;
		}
		if (!options[PROPERTY_NAME_DIRECTORY] && name.endsWith(DIRECTORY_SIGNATURE)) {
			options[PROPERTY_NAME_DIRECTORY] = true;
		}
		const directory = getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY);
		if (directory) {
			if (!name.endsWith(DIRECTORY_SIGNATURE)) {
				name += DIRECTORY_SIGNATURE;
			}
			if (!externalFileAttributesProvided) {
				externalFileAttributes = FILE_ATTR_MSDOS_DIR_MASK;
				if (!msDosCompatible) {
					externalFileAttributes |= (FILE_ATTR_UNIX_TYPE_DIR | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_DEFAULT_MASK) << 16;
				}
			}
		} else if (!msDosCompatible && !externalFileAttributesProvided) {
			if (executable) {
				externalFileAttributes = (FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_DEFAULT_MASK) << 16;
			} else {
				externalFileAttributes = FILE_ATTR_UNIX_DEFAULT_MASK << 16;
			}
		}
		let unixExternalUpper;
		if (!msDosCompatible) {
			const unixModeProvided = unixMode !== UNDEFINED_VALUE || Boolean(setuid || setgid || sticky);
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
			if (!externalFileAttributesProvided || unixModeProvided) {
				if (directory) {
					unixMode |= FILE_ATTR_UNIX_TYPE_DIR;
				}
				externalFileAttributes = ((unixMode & MAX_16_BITS) << 16) | (externalFileAttributes & MAX_16_BITS);
			}
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
			const readable = toCompatibleReadable(reader.createReadable ? reader.createReadable() : reader.readable);
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
					codecURI,
					compressionMethod
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
		const dosLastModDate = new Date(Math.ceil(lastModDate.getTime() / 2000) * 2000);
		const {
			headerArray,
			headerView,
			rawLastModDate
		} = getHeaderArrayData({
			version,
			bitFlag: getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod),
			compressionMethod,
			uncompressedSize,
			lastModDate: dosLastModDate < MIN_DATE ? MIN_DATE : dosLastModDate > MAX_DATE ? MAX_DATE : dosLastModDate,
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
		setDefaultConfiguration({ baseURI: (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('zip-native.js', document.baseURI).href)) });
	} catch {
		// ignored
	}

	var{Uint8Array:p,Uint16Array:g,Int32Array:R,TransformStream:H,Math:z,Error:L,Array:k}=globalThis,pe=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],Z=new p(0),qe=new g(0),de=[];for(let e=0;e<6;e++)de.push(e,0==e?8:4);de.push(0,1);var Se=[];for(let e=0;e<14;e++)Se.push(e,0==e?4:2);var Ee=new g([0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576]),ge=new g([0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0]);function M(e,t,n,r,i){if(0==i)return;let f=e instanceof p?e:new p(e.buffer,e.byteOffset,e.byteLength),_=n instanceof p?n.subarray(r,r+i):new p(n.buffer,n.byteOffset+r,i);f.set(_,t);}function Ve(e,t,n){0!=n&&(e instanceof p?e:new p(e.buffer,e.byteOffset,e.byteLength)).fill(0,t,t+n);}function je(){return {next_in:Z,next_in_index:0,avail_in:0,total_in:0,next_out:Z,next_out_index:0,avail_out:0,total_out:0,msg:"",t:0,i:0,_:0,l:void 0}}function Je(e,t){let n=1<<t;return {o:e,u:new p(n),h:n,v:t,k:0,m:0,p:0,T:0}}function te(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1];for(let e=0;e<i;e++)t.push(r);}return new g(t)}var ne=class{constructor(e,t){this.M=e,this.C=t,this.Z=0;}},re=class{constructor(e,t,n,r,i){this.W=e,this.q=t,this.S=n,this.L=r,this.$=i;}};function D_(e){return Q_[e<-6||e>2?9:2-e]||""}function we(e,t){try{e.msg=D_(t);}catch(n){e.msg="zlib error "+String(t)+" ("+n+")";}return t}function $e(e,t){let n=e>>>0,r=0;for(let e=0;e<t;e++)r=r<<1|1&n,n>>>=1;return r}function T(e,t){e.D[e.A++]=t;}function Ae(e,t){T(e,255&t),T(e,t>>>8&255);}function e_(e,t,n){let r=255&n,i=65535&t,f=e.I+e.H;return e.D[f]=255&i,e.D[f+1]=i>>>8&255,e.D[f+2]=r,e.H+=3,i=i-1&65535,e.N[__[r]+ie+1].j++,e.U[y_(i)].j++,e.H==e.R}function De(e,t){let n=255&t,r=e.I+e.H;return e.D[r]=0,e.D[r+1]=0,e.D[r+2]=n,e.H+=3,e.N[n].j++,e.H==e.R}function ye(e){return e.h-ae}function y_(e){return e<256?A_[e]:A_[256+(e>>7)]}function v_(e){let t=Ce+7,n=1<<t,r=(1<<t)-1,i=z.floor((t+v-1)/v),f=1<<8+Ce;return {...Je(e,15),o:e,Y:42,P:0,B:void 0,F:32767,G:t,O:n,V:r,X:i,J:new g(32768),K:new g(n),ee:f,D:new p(32768),te:0,ne:32768,A:0,re:0,ie:0,fe:0,_e:0,le:0,oe:-2,ue:0,ae:0,ce:0,se:0,he:0,de:0,we:0,be:0,ve:0,ke:0,ge:0,me:0,pe:0,xe:0,Te:new R(2*Te+1),ye:new p(2*Te+1),ze:new g(be+1),H:0,R:0,Me:Z,I:0,Ce:0,Ze:0,We:8,qe:32768,Se:0,Le:0,$e:0,N:new k(fe).fill(0).map(()=>Q()),U:new k(2*me+1).fill(0).map(()=>Q()),De:new k(2*oe+1).fill(0).map(()=>Q()),Ae:w_(),Ie:w_(),He:w_()}}function I_(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1],f=Q();f.Qe=r,f.je=i,t.push(f);}return t}function Q(){return {j:0,Qe:0,Ne:0,je:0}}function w_(){return new ne([],dn(null,Z,0,0,0))}function dn(e,t,n,r,i){return new re(e,t,n,r,i)}function $_(){let e=new k(288).fill(0);for(let t=0;t<=143;t++)e[t]=8;for(let t=144;t<=255;t++)e[t]=9;for(let t=256;t<=279;t++)e[t]=7;for(let t=280;t<=287;t++)e[t]=8;return e}function k_(e){let{code:t,length:n}=mn(e),r=new g(2*e.length),i=0;for(let f=0;f<e.length;f++){let e=n[f]||0,_=t[f]||0;r[i++]=e?$e(_,e):0,r[i++]=e;}return new g(r)}function et(e,t,n){let r=0;for(let n=0;n<e.length;n++){let i=t[n]?1<<t[n]:1,f=e[n]+i-1;f>r&&(r=f);}r<n&&(r=n);let i=new p(r+1);for(let n=0;n<=r;n++)for(let r=0;r<e.length;r++){let f=t[r]?1<<t[r]:1,_=e[r];if(n>=_&&n<=_+f-1){i[n]=r;break}}let f=0;for(let n=0;n<e.length-1;n++){let r=t[n]?1<<t[n]:1,i=e[n]+r-1;i>f&&(f=i);}return i[f]=e.length-1,i}function _t(e,t){let n=0;for(let r=0;r<e.length;r++){let i=t[r]?1<<t[r]:1,f=e[r]+i-1;f>n&&(n=f);}let r=new p(n+1);for(let i=0;i<=n;i++)for(let n=0;n<e.length;n++){let f=t[n]?1<<t[n]:1,_=e[n];if(i>=_&&i<=_+f-1){r[i]=n;break}}return r}function tt(e){let t=new p(512),n=e.length-1;for(let r=0;r<256;r++)t[r]=r<=n?e[r]:e[n];for(let r=256;r<=n;r++){let n=r>>7;t[256+(n>255?255:n)]=e[r];}for(let e=257;e<512;e++)0==t[e]&&(t[e]=t[e-1]);return t}function mn(e){let t=z.max(...e),n=new k(t+1).fill(0);for(let t of e)t>0&&n[t]++;let r=new k(e.length).fill(0),i=new k(t+1).fill(0),f=0;for(let e=1;e<=t;e++)f=f+n[e-1]<<1,i[e]=f;for(let t=0;t<e.length;t++){let n=e[t];0!=n&&(r[t]=i[n]++);}return {code:r,length:e}}var Ce=8,v=3,ee=258,ae=ee+v+1,nt=4096,Ue=16,He=ee,bn=29,ie=256,Te=ie+1+bn,me=30,oe=19,fe=2*Te+1,be=15,rt=9,at=255,it=32,ot=4,ve=256,t_=16,n_=17,r_=18,ft=0,N_=1,lt=2,$=-1,Q_=["need dictionary","stream end","","file error","stream error","data error","insufficient memory","buffer error",""],a_=te(de),i_=te(Se),Be=new g(19);Be[16]=2,Be[17]=3,Be[18]=7;var hn=k_($_()),sn=k_(new k(30).fill(5)),Fe=I_(hn),R_=I_(sn),__=et(ge,a_,ee),A_=tt(_t(Ee,i_));function he(e,t,n){if(void 0===t||void 0===n)return 1;let r=65535&e,i=e>>>16&65535,f=0;for(;n>0;){let e=n>2e3?2e3:n;n-=e;do{r=r+t[f++]|0,i=i+r|0;}while(--e);r%=65521,i%=65521;}return (i<<16|r)>>>0}var Ze=[[],[],[],[],[],[],[],[]];for(let e=0;e<256;e++){let t=e;for(let e=0;e<8;e++)t=1&t?3988292384^t>>>1:t>>>1;Ze[0][e]=t;}for(let e=0;e<256;e++)for(let t=1;t<8;t++){let n=Ze[t-1][e];Ze[t][e]=n>>>8^Ze[0][255&n];}var[ut,xn,pn,Sn,En,gn,Tn,wn]=Ze;function W(e=0,t,n){if(!t)return 0;void 0===n&&(n=t.length);let r=0|~e,i=0;if((n=z.min(n,t.length))>=8){let e=new DataView(t.buffer,t.byteOffset,n),f=n-8;for(;i<=f;i+=8){let t=r^e.getInt32(i,true),n=e.getInt32(i+4,true);r=wn[255&t]^Tn[t>>>8&255]^gn[t>>>16&255]^En[t>>>24&255]^Sn[255&n]^pn[n>>>8&255]^xn[n>>>16&255]^ut[n>>>24&255];}}for(;i<n;i++)r=r>>>8^ut[255&(r^t[i])];return (4294967295^r)>>>0}function xt(e){16==e.T?(Ae(e,e.p),e.p=0,e.T=0):e.T>=8&&(T(e,e.p),e.p>>=8,e.T-=8);}function pt(e){e.T>8?Ae(e,e.p):e.T>0&&T(e,e.p),e.Ce=1+(e.T-1&7),e.p=0,e.T=0;}function An(e,t,n){let r,i,f=[],_=0;for(r=1;r<=be;r++)_=_+n[r-1]<<1,f[r]=_;for(i=0;i<=t;i++){let t=e[i].je;0!=t&&(e[i].Qe=$e(f[t]++,t));}}function C(e,t,n){e.T>Ue-n?(e.p=65535&(e.p|t<<e.T),Ae(e,e.p),e.p=t>>Ue-e.T&65535,e.T+=n-Ue):(e.p=65535&(e.p|t<<e.T),e.T+=n);}function St(e){for(let t=0;t<e.N.length;t++)e.N[t].j=0;for(let t=0;t<e.U.length;t++)e.U[t].j=0;for(let t=0;t<e.De.length;t++)e.De[t].j=0;e.N[ve].j=1,e.ie=e.fe=0,e.H=e._e=0;}function Et(e){if(e.N&&e.N.length>=fe)for(let t=0;t<fe;t++)e.N[t]=Q();else {e.N=[];for(let t=0;t<fe;t++)e.N.push(Q());}if(e.U&&e.U.length>=2*me+1)for(let t=0;t<2*me+1;t++)e.U[t]=Q();else {e.U=[];for(let t=0;t<2*me+1;t++)e.U.push(Q());}if(e.De&&e.De.length>=2*oe+1)for(let t=0;t<2*oe+1;t++)e.De[t]=Q();else {e.De=[];for(let t=0;t<2*oe+1;t++)e.De.push(Q());}e.Ae=new ne(e.N,new re(Fe,a_,ie+1,Te,be)),e.Ie=new ne(e.U,new re(R_,i_,0,me,be)),e.He=new ne(e.De,new re(null,Be,0,oe,7)),e.p=0,e.T=0,e.Ce=0,St(e);}var se=1;function Dn(e,t,n){return n=e.Te[se],e.Te[se]=e.Te[e.Le--],z_(e,t,se),n}function mt(e,t,n,r){return e[t].j<e[n].j||e[t].j==e[n].j&&r[t]<=r[n]}function z_(e,t,n){let r=e.Te[n],i=n<<1;for(;i<=e.Le&&(i<e.Le&&mt(t,e.Te[i+1],e.Te[i],e.ye)&&i++,!mt(t,r,e.Te[i],e.ye));)e.Te[n]=e.Te[i],n=i,i<<=1;e.Te[n]=r;}function yn(e,t){let n,r,i,f,_,l,o=t.M,u=t.Z,a=t.C.W,c=t.C.q,s=t.C.S,h=t.C.$,d=0;for(f=0;f<=be;f++)e.ze[f]=0;for(o[e.Te[e.$e]].je=0,n=e.$e+1;n<fe;n++)r=e.Te[n],f=o[o[r].Ne].je+1,f>h&&(f=h,d++),o[r].je=f,!(r>u)&&(e.ze[f]++,_=0,r>=s&&(_=c[r-s]),l=o[r].j,e.ie+=l*(f+_),a&&(e.fe+=l*(a[r].je+_)));if(0!=d){do{for(f=h-1;0==e.ze[f];)f--;e.ze[f]--,e.ze[f+1]+=2,e.ze[h]--,d-=2;}while(d>0);for(f=h;0!=f;f--)for(r=e.ze[f];0!=r;)i=e.Te[--n],!(i>u)&&(o[i].je!=f&&(e.ie+=(f-o[i].je)*o[i].j,o[i].je=f),r--);}}function L_(e,t){let n,r,i,f=t.M,_=t.C.W,l=t.C.L,o=-1;for(e.Le=0,e.$e=fe,n=0;n<l;n++)0!=f[n].j?(e.Te[++e.Le]=o=n,e.ye[n]=0):f[n].je=0;for(;e.Le<2;)i=e.Te[++e.Le]=o<2?++o:0,f[i].j=1,e.ye[i]=0,e.ie--,_&&(e.fe-=_[i].je);for(t.Z=o,n=z.floor(e.Le/2);n>=1;n--)z_(e,f,n);i=l;do{n=Dn(e,f,n),r=e.Te[se],e.Te[--e.$e]=n,e.Te[--e.$e]=r,f[i].j=f[n].j+f[r].j,e.ye[i]=(e.ye[n]>=e.ye[r]?e.ye[n]:e.ye[r])+1,f[n].Ne=f[r].Ne=i,e.Te[se]=i++,z_(e,f,se);}while(e.Le>=2);e.Te[--e.$e]=e.Te[se],yn(e,t),An(f,t.Z,e.ze);}function bt(e,t,n){let r,i,f=-1,_=t[0].je,l=0,o=7,u=4;for(0==_&&(o=138,u=3),t[n+1].je=65535,r=0;r<=n;r++)i=_,_=t[r+1].je,!(++l<o&&i==_)&&(l<u?e.De[i].j+=l:0!=i?(i!=f&&e.De[i].j++,e.De[t_].j++):l<=10?e.De[n_].j++:e.De[r_].j++,l=0,f=i,0==_?(o=138,u=3):i==_?(o=6,u=3):(o=7,u=4));}function ht(e,t,n){let r,i=-1,f=t[0].je,_=0,l=7,o=4;0==f&&(l=138,o=3);for(let u=0;u<=n;u++)if(r=f,f=t[u+1].je,!(++_<l&&r==f)){if(_<o)do{C(e,e.De[r].Qe,e.De[r].je);}while(0!=--_);else 0!=r?(r!=i&&(C(e,e.De[r].Qe,e.De[r].je),_--),C(e,e.De[t_].Qe,e.De[t_].je),C(e,_-3,2)):_<=10?(C(e,e.De[n_].Qe,e.De[n_].je),C(e,_-3,3)):(C(e,e.De[r_].Qe,e.De[r_].je),C(e,_-11,7));_=0,i=r,0==f?(l=138,o=3):r==f?(l=6,o=3):(l=7,o=4);}}function vn(e){let t;for(bt(e,e.N,e.Ae.Z),bt(e,e.U,e.Ie.Z),L_(e,e.He),t=oe-1;t>=3&&0==e.De[pe[t]].je;t--);return e.ie+=3*(t+1)+5+5+4,t}function In(e,t,n,r){let i;for(C(e,t-257,5),C(e,n-1,5),C(e,r-4,4),i=0;i<r;i++)C(e,e.De[pe[i]].je,3);ht(e,e.N,t-1),ht(e,e.U,n-1);}function Pe(e,t,n,r,i=0){C(e,(ft<<1)+r,3),pt(e),Ae(e,n),Ae(e,~n),n&&t&&M(e.D,e.A,t,i,n),e.A+=n;}function gt(e){xt(e);}function Tt(e){C(e,N_<<1,3),C(e,Fe[ve].Qe,Fe[ve].je),xt(e);}function st(e,t,n){let r,i,f,_,l=0;if(0!=e.H)do{r=255&e.Me[l],r+=(255&e.Me[l+1])<<8,i=e.Me[l+2],l+=3,0==r?C(e,t[i].Qe,t[i].je):(f=__[i],C(e,t[f+ie+1].Qe,t[f+ie+1].je),_=a_[f],0!=_&&(i-=ge[f],C(e,i,_)),r--,f=y_(r),C(e,n[f].Qe,n[f].je),_=i_[f],0!=_&&(r-=Ee[f],C(e,r,_)));}while(l<e.H);C(e,t[ve].Qe,t[ve].je);}function kn(e){let t,n=4093624447;for(t=0;t<=31;t++,n>>=1)if(1&n&&0!=e.N[t].j)return 0;if(0!=e.N[9].j||0!=e.N[10].j||0!=e.N[13].j)return 1;for(t=32;t<ie;t++)if(0!=e.N[t].j)return 1;return 0}function wt(e,t,n,r,i=0){let f,_,l=0;e.ve>0?(2==e.o.t&&(e.o.t=kn(e)),L_(e,e.Ae),L_(e,e.Ie),l=vn(e),f=e.ie+3+7>>3,_=e.fe+3+7>>3,(_<=f||4==e.ke)&&(f=_)):f=_=n+5,n+4<=f&&t?Pe(e,t,n,r,i):_==f?(C(e,(N_<<1)+r,3),st(e,Fe,R_)):(C(e,(lt<<1)+r,3),In(e,e.Ae.Z+1,e.Ie.Z+1,l+1),st(e,e.N,e.U)),St(e),r&&pt(e);}function vt(){let e=je();return e.l=v_(e),e}var Ye=[{Ue:Lt,Re:0,Ye:0,Ee:0,Pe:0},{Ue:U_,Re:4,Ye:4,Ee:8,Pe:4},{Ue:U_,Re:4,Ye:5,Ee:16,Pe:8},{Ue:U_,Re:4,Ye:6,Ee:32,Pe:32},{Ue:Ne,Re:4,Ye:4,Ee:16,Pe:16},{Ue:Ne,Re:8,Ye:16,Ee:32,Pe:32},{Ue:Ne,Re:8,Ye:16,Ee:128,Pe:128},{Ue:Ne,Re:8,Ye:32,Ee:128,Pe:256},{Ue:Ne,Re:32,Ye:128,Ee:258,Pe:1024},{Ue:Ne,Re:32,Ye:258,Ee:258,Pe:4096}];function At(e){return 2*e-(e>4?9:0)}function l_(e,t,n){return ((t<<e.X^n)&e.V)>>>0}function u_(e,t){e.be=l_(e,e.be,e.u[t+(v-1)]);let n=e.J[t&e.F]=e.K[e.be];return e.K[e.be]=t,n}function It(e){e.K[e.O-1]=0,Ve(e.K,0,(e.O-1)*e.K.BYTES_PER_ELEMENT);}function Un(e){let t,n,r=e.h;for(t=e.O;t>0;)t--,n=e.K[t],e.K[t]=n>=r?n-r:0;for(t=r;t>0;)t--,n=e.J[t],e.J[t]=n>=r?n-r:0;}function H_(e,t,n,r){let i=e.avail_in;return i>r&&(i=r),0==i?0:(e.avail_in-=i,M(t,n,e.next_in,e.next_in_index,i),1==e.l.P?e.i=he(e.i,new p(t.buffer,t.byteOffset+n,i),i):2==e.l.P&&(e.i=W(e.i,new p(t.buffer,t.byteOffset+n,i),i)),e.next_in_index+=i,e.total_in+=i,i)}function c_(e){let t,n,r=e.h;do{if(n=e.qe-e.ce-e.ae,0==n&&0==e.ae&&0==e.ce?n=r:-1==n&&n--,e.ae>=r+ye(e)&&(M(e.u,0,e.u,r,r-n),e.Se-=r,e.ae-=r,e.ue-=r,e.le>e.ae&&(e.le=e.ae),Un(e),n+=r),0==e.o.avail_in)break;if(t=H_(e.o,e.u,e.ae+e.ce,n),e.ce+=t,e.ce+e.le>=v){let t=e.ae-e.le;for(e.be=e.u[t],e.be=l_(e,e.be,e.u[t+1]);e.le&&(e.be=l_(e,e.be,e.u[t+v-1]),e.J[t&e.F]=e.K[e.be],e.K[e.be]=t,t++,e.le--,!(e.ce+e.le<v)););}}while(e.ce<ae&&0!=e.o.avail_in);if(e.k<e.qe){let t,n=e.ae+e.ce;e.k<n?(t=e.qe-n,t>He&&(t=He),Ve(e.u,n,t),e.k=n+t):e.k<n+He&&(t=n+He-e.k,t>e.qe-e.k&&(t=e.qe-e.k),Ve(e.u,e.k,t),e.k+=t);}}function kt(e,t,n=8,r=15,i=Ce,f=0){let _=1;if(!e)return  -2;if(e.msg="",-1==t&&(t=6),r<0){if(_=0,r<-15)return  -2;r=-r;}else r>15&&(_=2,r-=16);if(i<1||i>rt||8!=n||r<8||r>15||t<0||t>9||f<0||f>4||8==r&&1!=_)return  -2;8==r&&(r=9);let l=v_(e);return l?(e.l=l,l.o=e,l.Y=42,l.P=_,l.B=void 0,l.v=r,l.h=1<<l.v,l.F=l.h-1,l.G=i+7,l.O=1<<l.G,l.V=l.O-1,l.X=(l.G+v-1)/v,l.u=new p(2*l.h),l.J=new g(l.h),l.K=new g(l.O),l.k=0,l.ee=1<<i+6,l.D=new p(l.ee*ot),l.ne=4*l.ee,l.u&&l.J&&l.K&&l.D?(l.Me=l.D.subarray(l.ee),l.I=l.te+l.ee,l.R=3*(l.ee-1),l.ve=t,l.ke=f,l.We=n,Fn(e)):(l.Y=666,e.msg=D_(-4),P_(e),-4)):-4}function Z_(e){if(null==e)return  true;let t=e.l;return !t||t.o!=e||42!=t.Y&&57!=t.Y&&69!=t.Y&&73!=t.Y&&91!=t.Y&&103!=t.Y&&113!=t.Y&&666!=t.Y}function Hn(e){let t;return Z_(e)?-2:(e.total_in=e.total_out=0,e.msg="",e.t=2,t=e.l,t.A=0,t.re=t.te,t.P<0&&(t.P=-t.P),t.Y=2==t.P?57:42,e.i=2==t.P?W(0):he(0),t.oe=-2,Et(t),0)}function Bn(e){e.qe=2*e.h,It(e),e.xe=Ye[e.ve].Ye,e.ge=Ye[e.ve].Re,e.me=Ye[e.ve].Ee,e.pe=Ye[e.ve].Pe,e.ae=0,e.ue=0,e.ce=0,e.le=0,e.se=e.he=v-1,e.we=0,e.be=0;}function Fn(e){let t=Hn(e);return 0==t&&Bn(e.l),t}function Me(e,t){T(e,t>>8),T(e,255&t);}function q(e){let t,n=e.l;gt(n),t=n.A,t>e.avail_out&&(t=e.avail_out),0!=t&&(M(e.next_out,e.next_out_index,n.D,n.re,t),e.next_out_index+=t,n.re+=t,e.total_out+=t,e.avail_out-=t,n.A-=t,0==n.A&&(n.re=n.te));}function Ie(e,t){let n=e.l;n.B&&n.B.Be&&(e.i=W(e.i,new p(n.D.buffer,n.te+t,n.A-t),n.A-t));}function Nt(e,t){let n,r=e.l;if(Z_(e)||t>5||t<0)return we(e,-2);if(!e.next_out||0!=e.avail_in&&!e.next_in||666==r.Y&&4!=t)return we(e,-2);if(0==e.avail_out)return we(e,-5);if(n=r.oe,r.oe=t,0!=r.A){if(q(e),0==e.avail_out)return r.oe=$,0}else if(0==e.avail_in&&At(t)<=At(n)&&4!=t)return we(e,-5);if(666==r.Y&&0!=e.avail_in)return we(e,-5);if(42==r.Y&&0==r.P&&(r.Y=113),42==r.Y){let t,n=8+(r.v-8<<4)<<8;if(t=r.ke>=2||r.ve<2?0:r.ve<6?1:6==r.ve?2:3,n|=t<<6,0!=r.ae&&(n|=it),n+=31-n%31,Me(r,n),0!=r.ae&&(Me(r,e.i>>16),Me(r,65535&e.i)),e.i=1,r.Y=113,q(e),0!=r.A)return r.oe=$,0}if(57==r.Y)if(e.i=W(0),T(r,31),T(r,139),T(r,8),r.B)T(r,(r.B.Fe?1:0)+(r.B.Be?2:0)+(null==r.B.Ge?0:4)+(null==r.B.Oe?0:8)+(null==r.B.Ve?0:16)),T(r,255&r.B.Xe),T(r,r.B.Xe>>>8&255),T(r,r.B.Xe>>>16&255),T(r,r.B.Xe>>>24&255),T(r,9==r.ve?2:r.ke>=2||r.ve<2?4:0),T(r,255&r.B.Je),null!=r.B.Ge&&(T(r,255&r.B.Ke),T(r,r.B.Ke>>>8&255)),r.B.Be&&(e.i=W(e.i,r.D,r.A)),r.Ze=0,r.Y=69;else if(T(r,0),T(r,0),T(r,0),T(r,0),T(r,0),T(r,9==r.ve?2:r.ke>=2||r.ve<2?4:0),T(r,at),r.Y=113,q(e),0!=r.A)return r.oe=$,0;if(69==r.Y){if(r.B&&null!=r.B.Ge){let t=r.A,n=(65535&r.B.Ke)-r.Ze;for(;r.A+n>r.ne;){let i=r.ne-r.A;if(M(r.D,r.A,r.B.Ge,r.Ze,i),r.A=r.ne,Ie(e,t),r.Ze+=i,q(e),0!=r.A)return r.oe=$,0;t=0,n-=i;}M(r.D,r.A,r.B.Ge,r.Ze,n),r.A+=n,Ie(e,t),r.Ze=0;}r.Y=73;}if(73==r.Y){if(r.B&&r.B.Oe&&r.B.Oe.length){let t,n=r.A;do{if(r.A==r.ne){if(Ie(e,n),q(e),0!=r.A)return r.oe=$,0;n=0;}t=r.B.Oe[r.Ze++],T(r,t);}while(0!=t);Ie(e,n),r.Ze=0;}r.Y=91;}if(91==r.Y){if(r.B&&r.B.Ve&&r.B.Ve.length){let t,n=r.A;do{if(r.A==r.ne){if(Ie(e,n),q(e),0!=r.A)return r.oe=$,0;n=0;}t=r.B.Ve[r.Ze++],T(r,t);}while(0!=t);Ie(e,n);}r.Y=103;}if(103==r.Y){if(r.B&&r.B.Be){if(r.A+2>r.ne&&(q(e),0!=r.A))return r.oe=$,0;T(r,255&e.i),T(r,e.i>>>8&255),e.i=W(0);}if(r.Y=113,q(e),0!=r.A)return r.oe=$,0}if(0!=e.avail_in||0!=r.ce||0!=t&&666!=r.Y){let n=0==r.ve?Lt(r,t):2==r.ke?Pn(r,t):3==r.ke?Zn(r,t):Ye[r.ve].Ue(r,t);if((2==n||3==n)&&(r.Y=666),0==n||2==n)return 0==e.avail_out&&(r.oe=$),0;if(1==n&&(1==t?Tt(r):5!=t&&(Pe(r,null,0,0),3==t&&(It(r),0==r.ce&&(r.ae=0,r.ue=0,r.le=0))),q(e),0==e.avail_out))return r.oe=$,0}return 4!=t?0:r.P<=0?1:(2==r.P?(T(r,255&e.i),T(r,e.i>>>8&255),T(r,e.i>>>16&255),T(r,e.i>>>24&255),T(r,255&e.total_in),T(r,e.total_in>>>8&255),T(r,e.total_in>>>16&255),T(r,e.total_in>>>24&255)):(Me(r,e.i>>>16&65535),Me(r,65535&e.i)),q(e),r.P>0&&(r.P=-r.P),0!=r.A?0:1)}function P_(e){if(Z_(e))return  -2;let t=e.l,n=t.Y;return t.u=Z,t.J=qe,t.K=qe,t.D=Z,t.Me=Z,t.Te=new R(0),t.ye=Z,t.ze=qe,t.N.length=0,t.U.length=0,t.De.length=0,t.B=void 0,t.te=0,t.re=0,t.I=0,113==n?-3:0}function Rt(e,t){let n,r,i=e.pe,f=e.ae,_=e.he,l=e.me,o=e.ae>ye(e)?e.ae-ye(e):0,u=e.J,a=e.F,c=e.u,s=e.ce,h=ee<s?ee:s,d=c[f],w=c[f+1],b=c[f+_-1],v=c[f+_];_>=e.ge&&(i>>=2),l>s&&(l=s);do{if(n=t,c[n+_]!=v||c[n+_-1]!=b||c[n]!=d||c[n+1]!=w)continue;let i=2;for(;i<h&&c[f+i]==c[n+i];)i++;if(r=i,r>_){if(e.Se=t,_=r,r>=l)break;b=c[f+_-1],v=c[f+_];}}while((t=u[t&a])>o&&0!=--i);return _<=s?_:s}function zt(e,t){wt(e,e.u,e.ae-e.ue,t,e.ue),e.ue=e.ae,q(e.o);}function j(e,t){return zt(e,t?1:0),0==e.o.avail_out?t?2:0:null}var Dt=65535;function ke(e,t){return e<t?e:t}function Lt(e,t){let n,r,i,f=ke(e.ne-5,e.h),_=0,l=e.o.avail_in;do{if(n=Dt,i=e.T+42>>3,e.o.avail_out<i||(i=e.o.avail_out-i,r=e.ae-e.ue,n>r+e.o.avail_in&&(n=r+e.o.avail_in),n>i&&(n=i),n<f&&(0==n&&4!=t||0==t||n!=r+e.o.avail_in)))break;_=4==t&&n==r+e.o.avail_in?1:0,Pe(e,null,0,_),e.D[e.A-4]=n,e.D[e.A-3]=n>>8,e.D[e.A-2]=~n,e.D[e.A-1]=~n>>8,q(e.o),r&&(r>n&&(r=n),M(e.o.next_out,e.o.next_out_index,e.u,e.ue,r),e.o.next_out_index+=r,e.o.avail_out-=r,e.o.total_out+=r,e.ue+=r,n-=r),n&&(H_(e.o,e.o.next_out,e.o.next_out_index,n),e.o.next_out_index+=n,e.o.avail_out-=n,e.o.total_out+=n);}while(0==_);if(l-=e.o.avail_in,l){if(l>=e.h){e._e=2;let t=e.o.next_in_index-e.h;M(e.u,0,e.o.next_in,t,e.h),e.ae=e.h,e.le=e.ae;}else e.qe-e.ae<=l&&(e.ae-=e.h,M(e.u,0,e.u,e.h,e.ae),e._e<2&&e._e++,e.le>e.ae&&(e.le=e.ae)),M(e.u,e.ae,e.o.next_in,e.o.next_in_index-l,l),e.ae+=l,e.le+=ke(l,e.h-e.le);e.ue=e.ae;}return e.k<e.ae&&(e.k=e.ae),_?(e.Ce=8,3):0!=t&&4!=t&&0==e.o.avail_in&&e.ae==e.ue?1:(i=e.qe-e.ae,e.o.avail_in>i&&e.ue>=e.h&&(e.ue-=e.h,e.ae-=e.h,M(e.u,0,e.u,e.h,e.ae),e._e<2&&e._e++,i+=e.h,e.le>e.ae&&(e.le=e.ae)),i>e.o.avail_in&&(i=e.o.avail_in),i&&(H_(e.o,e.u,e.ae,i),e.ae+=i,e.le+=ke(i,e.h-e.le)),e.k<e.ae&&(e.k=e.ae),i=e.T+42>>3,i=ke(e.ne-i,Dt),f=ke(i,e.h),r=e.ae-e.ue,(r>=f||(r||4==t)&&0!=t&&0==e.o.avail_in&&r<=i)&&(n=ke(r,i),_=4==t&&0==e.o.avail_in&&n==r?1:0,Pe(e,e.u,n,_,e.ue),e.ue+=n,q(e.o)),_&&(e.Ce=8),_?2:0)}function U_(e,t){let n,r=false;for(;;){if(e.ce<ae){if(c_(e),e.ce<ae&&0==t)return 0;if(0==e.ce)break}if(n=0,e.ce>=v&&(n=u_(e,e.ae)),0!=n&&e.ae-n<=ye(e)&&(e.se=Rt(e,n)),e.se>=v)if(e.ae,e.Se,e.se,r=e_(e,e.ae-e.Se,e.se-v),e.ce-=e.se,e.se<=e.xe&&e.ce>=v){e.se--;do{e.ae++,n=u_(e,e.ae);}while(0!=--e.se);e.ae++;}else e.ae+=e.se,e.se=0,e.be=e.u[e.ae],e.be=l_(e,e.be,e.u[e.ae+1]);else r=De(e,e.u[e.ae]),e.ce--,e.ae++;if(r){let t=j(e,false);if(null!=t)return t}}if(e.le=e.ae<v-1?e.ae:v-1,4==t){return j(e,true)??3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}function Ne(e,t){let n,r=false;for(;;){if(e.ce<ae){if(c_(e),e.ce<ae&&0==t)return 0;if(0==e.ce)break}if(n=0,e.ce>=v&&(n=u_(e,e.ae)),e.he=e.se,e.de=e.Se,e.se=v-1,0!=n&&e.he<e.xe&&e.ae-n<=ye(e)&&(e.se=Rt(e,n),e.se<=5&&(1==e.ke||e.se==v&&e.ae-e.Se>nt)&&(e.se=v-1)),e.he>=v&&e.se<=e.he){let t=e.ae+e.ce-v;e.ae,e.de,e.he,r=e_(e,e.ae-1-e.de,e.he-v),e.ce-=e.he-1,e.he-=2;do{++e.ae<=t&&(n=u_(e,e.ae));}while(0!=--e.he);if(e.we=0,e.se=v-1,e.ae++,r){let t=j(e,false);if(null!=t)return t}}else if(e.we){if(r=De(e,e.u[e.ae-1]),r&&zt(e,0),e.ae++,e.ce--,0==e.o.avail_out)return 0}else e.we=1,e.ae++,e.ce--;}if(e.we&&(r=De(e,e.u[e.ae-1]),e.we=0),e.le=e.ae<v-1?e.ae:v-1,4==t){return j(e,true)??3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}function Zn(e,t){let n,r,i,f;for(;;){if(e.ce<=ee){if(c_(e),e.ce<=ee&&0==t)return 0;if(0==e.ce)break}if(e.se=0,e.ce>=v&&e.ae>0&&(i=e.ae-1,r=e.u[i],r==++i&&r==++i&&r==++i)){f=e.ae+ee;do{}while(r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&i<f);e.se=ee-(f-i),e.se>e.ce&&(e.se=e.ce);}if(e.se>=v?(e.ae,e.ae,e.se,n=e_(e,1,e.se-v),e.ce-=e.se,e.ae+=e.se,e.se=0):(n=De(e,e.u[e.ae]),e.ce--,e.ae++),n){let t=j(e,false);if(null!=t)return t}}if(e.le=0,4==t){return j(e,true)??3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}function Pn(e,t){let n=false;for(;;){if(0==e.ce&&(c_(e),0==e.ce)){if(0==t)return 0;break}if(e.se=0,n=De(e,e.u[e.ae]),e.ce--,e.ae++,n){let t=j(e,false);if(null!=t)return t}}if(e.le=0,4==t){return j(e,true)??3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}var ue=852,d_=592,m_=594,Ot=Ee.map(e=>e+1),Ct=ge.subarray(0,-1).map(e=>e+3),Mn=[16,1,73,1,200,1],Yn=[144,1,72,1,78,1],Ut=Se.map(qt),Ht=Se.map(Vt);Ut.push(64,2),Ht.push(142,2);var Bt=de.slice(0,-2).map(qt),Ft=de.slice(0,-2).map(Vt);Bt.push(...Mn),Ft.push(...Yn);var Zt=new g([...Ct,258,0,0]),Pt=new g([...Ct,3,0,0]),Mt=te(Bt),Yt=te(Ft),Xt=new g([...Ot,0,0]),Wt=new g([...Ot,32769,49153]),Gt=te(Ut),Kt=te(Ht);function qt(e,t){return t%2?e:e+16}function Vt(e,t){return t%2?e:e+128}function Jt(e,t){let n,r=e.l,i=e.next_in_index,f=e.next_out_index,_=e.next_in,l=e.next_out,o=r.u,u=r.p>>>0,a=r.T>>>0,c=r.et,s=r.tt,h=(1<<r.nt)-1,d=(1<<r.rt)-1,w=r.h>>>0,b=r.k>>>0,v=r.m>>>0,k=r.it,g=f-(t-e.avail_out),m=f+(e.avail_out-257),p=i+(e.avail_in-5),x=0,T=0,y=0,z=0;e:do{for(;a<15;){if(!(i<_.length))break e;u+=_[i++]<<a,a+=8;}n=c[u&h];t:for(;;){if(y=n>>>16&255,u>>>=y,a-=y,y=n>>>24,0==y){l[f++]=65535&n;break}if(16&y){if(x=65535&n,y&=15,y){for(;a<y;){if(!(i<_.length)){r.ft=16200;break e}u+=_[i++]<<a,a+=8;}x+=u&(1<<y)-1,u>>>=y,a-=y;}for(;a<15;){if(!(i<_.length)){r.ft=16200;break e}u+=_[i++]<<a,a+=8;}n=s[u&d];n:for(;;){if(y=n>>>16&255,u>>>=y,a-=y,y=n>>>24,16&y){if(T=65535&n,y&=15,y){for(;a<y;){if(!(i<_.length)){r.ft=16200;break e}u+=_[i++]<<a,a+=8;}T+=u&(1<<y)-1,u>>>=y,a-=y;}let t=x,c=f-g;if(T>c){let n=T-c;if(n>b&&k){e.msg="invalid distance too far back",r.ft=16209;break e}if(0==v){if(z=w-n,!(n<t)){for(let e=0;e<t;++e)l[f++]=o[z++];continue e}for(let e=0;e<n;++e)l[f++]=o[z++];t-=n,z=f-T;}else if(v<n){z=w+v-n;let e=n-v;if(!(e<t)){for(let e=0;e<t;++e)l[f++]=o[z++];continue e}for(let t=0;t<e;++t)l[f++]=o[z++];if(t-=e,z=0,v<t){for(let e=0;e<v;++e)l[f++]=o[z++];t-=v,z=f-T;}}else {if(z=v-n,!(n<t)){for(let e=0;e<t;++e)l[f++]=o[z++];continue e}for(let e=0;e<n;++e)l[f++]=o[z++];t-=n,z=f-T;}for(;t>2;)l[f++]=l[z++],l[f++]=l[z++],l[f++]=l[z++],t-=3;t&&(l[f++]=l[z++],t>1&&(l[f++]=l[z++]));}else {for(z=f-T;t>2;)l[f++]=l[z++],l[f++]=l[z++],l[f++]=l[z++],t-=3;t&&(l[f++]=l[z++],t>1&&(l[f++]=l[z++]));}break}if(64&y){e.msg="invalid distance code",r.ft=16209;break e}n=s[(65535&n)+(u&(1<<y)-1)];continue n}break}if(64&y){if(32&y){r.ft=16191;break e}e.msg="invalid literal/length code",r.ft=16209;break e}n=c[(65535&n)+(u&(1<<y)-1)];continue t}}while(i<p&&f<m);let M=a>>3;i-=M,a-=M<<3,u&=(1<<a)-1,e.next_in_index=i,e.next_out_index=f,e.avail_in=i<p?p-i+5:5-(i-p),e.avail_out=f<m?m-f+257:257-(f-m),r.p=u>>>0,r.T=a>>>0;}var Xn=new R(0);function M_(e,t){let n=Xn,r=t?ue+m_:ue+d_;return {...Je(e,0),o:e,ft:16180,_t:false,P:0,lt:false,ot:0,ut:0,ct:0,st:0,u:Z,ht:0,dt:0,Ge:0,et:n,tt:n,nt:0,rt:0,wt:0,bt:0,vt:0,kt:0,gt:n,xt:new g(320),Tt:new g(288),yt:new R(r),zt:0,it:true,Mt:0,Ct:0,Zt:t}}function We(e,t,n){return e<<24|t<<16|n}function b_(e=0,t=0,n=0){return We(e,t,n)}function h_(e=1){return We(64,e,0)}function Qt(e=0){return We(96,e,0)}function Y_(e){return (255&e)<<24|(e>>8&255)<<16|(e>>16&255)<<8|e>>24&255}var Le=15,Gn={Zt:false,Wt:Zt,qt:Mt,St:Xt,Lt:Gt,$t:20,Dt:257,At:0,It:d_,Ht:false,Qt:true},Kn={Zt:true,Wt:Pt,qt:Yt,St:Wt,Lt:Kt,$t:19,Dt:256,At:-1,It:m_,Ht:true,Qt:false};function Oe(e,t,n,r,i,f,_,l){let o,u,a,c,s,h,d,w,b,v,k,m,p,x,T,y,z,M,C,Z=new g(Le+1),W=new g(Le+1),q=l?Kn:Gn;for(o=0;o<=Le;o++)Z[o]=0;for(u=0;u<n;u++)Z[t[u]]++;for(s=i.jt,c=Le;c>=1&&0==Z[c];c--);if(s>c&&(s=c),0==c)return q.Qt?(T=h_(1),r.jt[0]=T,r.jt[1]=T,i.jt=1,0):-1;for(a=1;a<c&&0==Z[a];a++);for(s<a&&(s=a),w=1,o=1;o<=Le;o++)if(w<<=1,w-=Z[o],w<0)return  -1;if(w>0&&(0==e||1!=c))return  -1;for(W[1]=0,o=1;o<Le;o++)W[o+1]=W[o]+Z[o];for(u=0;u<n;u++)0!=t[u]&&(f[W[t[u]]++]=u);switch(e){case 0:z=M=f,C=q.$t;break;case 1:z=q.Wt,M=q.qt,C=q.Dt;break;default:z=q.St,M=q.Lt,C=q.At;}if(v=0,u=0,o=a,y=_.jt,h=s,d=0,p=-1,b=1<<s,x=b-1,1==e&&(q.Ht?b>=ue:b>ue)||2==e&&(q.Ht?b>=q.It:b>q.It))return 1;for(;;){T=qn(f,u,o,d,e,z,M,C,q.Zt),k=1<<o-d,m=1<<h,a=m;do{m-=k;let e=(v>>d)+m;r.jt[y+e]=T;}while(0!=m);for(k=1<<o-1;v&k;)k>>=1;if(0!=k?(v&=k-1,v+=k):v=0,u++,0==--Z[o]){if(o==c)break;o=t[f[u]];}if(o>s&&(v&x)!=p){for(0==d&&(d=s),y+=1<<h,h=o-d,w=1<<h;h+d<c&&(w-=Z[h+d],!(w<=0));)h++,w<<=1;if(b+=1<<h,1==e&&(q.Ht?b>=ue:b>ue)||2==e&&(q.Ht?b>=q.It:b>q.It))return 1;p=v&x,r.jt[_.jt+p]=We(h,s,y-_.jt);}}if(0!=v)for(T=h_(o-d);0!=v;){for(0!=d&&(v&x)!=p&&(d=0,o=s,y=_.jt,h=s,T=h_(o)),r.jt[y+(v>>d)]=T,k=1<<o-1;v&k;)k>>=1;0!=k?(v&=k-1,v+=k):v=0;}return _.jt+=b,i.jt=s,0}function qn(e,t,n,r,i,f,_,l,o){let u;if(o?e[t]<l:e[t]+1<l)u=b_(0,n-r,e[t]);else if(o?e[t]>l:e[t]>=l)if(o&&1==i){let i=e[t]-257;u=b_(_[i],n-r,f[i]);}else {let i=o?e[t]:e[t]-l;u=b_(_[i],n-r,f[i]);}else u=Qt(n-r);return u}var p_=new R(0),Qn={Nt:true,Ut:new R(544),Rt:p_,Yt:p_},$n={Nt:true,Ut:new R(544),Rt:p_,Yt:p_};function $t(){let e=je();return e.l=M_(e,false),e}function Ge(e){let t;return !(e&&(t=e.l,!(!t||t.o!=e||t.Zt&&(t.ft<16191||t.ft>16209)||!t.Zt&&(t.ft<16180||t.ft>16211))))}function er(e){let t;return Ge(e)?-2:(t=e.l,e.total_in=e.total_out=t.st=0,e.msg="",t.P&&(e.i=1&t.P),t.ft=t.Zt?16191:16180,t._t=false,t.lt=false,t.ot=-1,t.ut=t.Zt?65536:32768,delete t.B,t.p=0,t.T=0,t.et=t.yt,t.tt=t.yt,t.gt=t.yt,t.it=true,t.Mt=-1,0)}function _r(e){let t;return Ge(e)?-2:(t=e.l,t.h=0,t.k=0,t.m=0,er(e))}function tr(e,t){let n,r;if(Ge(e))return  -2;if(r=e.l,t<0){if(t<-16)return  -2;n=0,r.Zt=-16==t,t=-t;}else n=5+(t>>4),r.Zt=false,t<48&&(t&=15);let i=r.Zt?16:15;return t&&(t<8||t>i)?-2:(r.u.length>0&&r.v!=t&&(r.u=Z),r.P=n,r.v=t,_r(e))}function en(e,t){let n,r;if(!e)return  -2;e.msg="";let i=-16==t;return r=M_(e,i),e.l=r,r.o=e,r.ft=i?16191:16180,n=tr(e,t),n}function nr(e){let t=e.Zt?$n:Qn,n={jt:0};if(t.Nt){let r,i,f;for(r=0;r<144;)e.xt[r++]=8;for(;r<256;)e.xt[r++]=9;for(;r<280;)e.xt[r++]=7;for(;r<288;)e.xt[r++]=8;t.Ut.fill(0),f=t.Ut,t.Rt=f,i=9;let _={jt:f},l={jt:i},o={jt:0};for(Oe(1,e.xt,288,_,l,e.Tt,o,e.Zt),f=_.jt,i=l.jt,e.zt=o.jt,r=0;r<32;)e.xt[r++]=5;i=5;let u=o.jt,a={jt:f},c={jt:i};n.jt=u,Oe(2,e.xt,32,a,c,e.Tt,n,e.Zt),t.Yt=f.slice(u),t.Nt=false;}e.et=t.Rt,e.nt=9,e.tt=t.Yt,e.rt=5,e.zt=n.jt;}function rr(e,t,n){let r=e.l;if(!(r.u&&0!=r.u.length||(r.u=new p(1<<r.v),r.u)))return 1;if(0==r.h&&(r.h=1<<r.v,r.m=0,r.k=0),n>=r.h)M(r.u,0,t,t.length-r.h,r.h),r.m=0,r.k=r.h;else {let e=r.h-r.m;e>n&&(e=n),M(r.u,r.m,t,t.length-n,e),(n-=e)?(M(r.u,0,t,t.length-n,n),r.m=n,r.k=r.h):(r.m+=e,r.m==r.h&&(r.m=0),r.k<r.h&&(r.k+=e));}return 0}var S_=class extends L{constructor(){super("Need more input");}};function _n(e,t){let n,r,i,f,_,l,o,u,a,c,s,h,d,w,b,v,k,g=new p(4);if(Ge(e)||!e.next_out||!e.next_in&&0!=e.avail_in)return  -2;l=0,u=0,o=0,a=0,r=Z,i=0,f=Z,_=0,n=e.l,16191==n.ft&&(n.ft=16192),z(),c=l,s=o,k=0;try{for(;;)switch(n.ft){case 16180:if(0==n.P){n.ft=16192;break}if(L(16),2&n.P&&35615==u){0==n.v&&(n.v=15),n.ct=W(0),n.ct=T(n.ct,u),q(),n.ft=16181;break}if(n.B&&(n.B.Et=-1),!(1&n.P)||(($(8)<<8)+(u>>8))%31){e.msg="incorrect header check",n.ft=16209;break}if(8!=$(4)){e.msg="unknown compression method",n.ft=16209;break}if(D(4),v=$(4)+8,0==n.v&&(n.v=v),v>15||v>n.v){e.msg="invalid window size",n.ft=16209;break}n.ut=1<<v,n.ot=0,e.i=n.ct=he(0),n.ft=512&u?16189:16191,q();break;case 16181:if(L(16),n.ot=u,8!=(255&n.ot)){e.msg="unknown compression method",n.ft=16209;break}if(57344&n.ot){e.msg="unknown header flags set",n.ft=16209;break}n.B&&(n.B.Fe=u>>8&1),512&n.ot&&4&n.P&&(n.ct=T(n.ct,u)),q(),n.ft=16182;case 16182:L(32),n.B&&(n.B.Xe=u),512&n.ot&&4&n.P&&(n.ct=y(n.ct,u)),q(),n.ft=16183;case 16183:L(16),n.B&&(n.B.Pt=255&u,n.B.Je=u>>8),512&n.ot&&4&n.P&&(n.ct=T(n.ct,u)),q(),n.ft=16184;case 16184:1024&n.ot?(L(16),n.ht=u,n.B&&(n.B.Ke=u),512&n.ot&&4&n.P&&(n.ct=T(n.ct,u)),q()):n.B&&(n.B.Ge=Z),n.ft=16185;case 16185:if(1024&n.ot&&(h=n.ht,h>l&&(h=l),h&&(n.B&&n.B.Ge&&n.B.Bt&&(v=n.B.Ke-n.ht)<n.B.Bt&&M(n.B.Ge,v,r,i,h),512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),l-=h,i+=h,n.ht-=h),n.ht))return m();n.ht=0,n.ft=16186;case 16186:if(2048&n.ot){if(0==l)return m();h=0;do{v=r[i+h++],n.B&&n.B.Ft&&n.ht<n.B.Ft&&(n.B.Oe[n.ht++]=v);}while(v&&h<l);if(512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),l-=h,i+=h,v)return m()}else n.B&&(n.B.Oe=Z);n.ht=0,n.ft=16187;case 16187:if(4096&n.ot){if(0==l)return m();h=0;do{v=r[i+h++],n.B&&n.B.Gt&&n.ht<n.B.Gt&&(n.B.Ve[n.ht++]=v);}while(v&&h<l);if(512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),l-=h,i+=h,v)return m()}else n.B&&(n.B.Ve=Z);n.ft=16188;case 16188:if(512&n.ot){if(L(16),4&n.P&&u!=(65535&n.ct)){e.msg="header crc mismatch",n.ft=16209;break}q();}n.B&&(n.B.Be=n.ot>>9&1,n.B.Et=1),e.i=n.ct=W(0),n.ft=16191;break;case 16189:L(32),e.i=n.ct=Y_(u),q(),n.ft=16190;case 16190:if(!n.lt)return C(),2;e.i=n.ct=he(0),n.ft=16191;case 16191:if(5==t||6==t)return m();case 16192:if(n._t){A(),n.ft=16206;break}switch(L(3),n._t=!!$(1),D(1),$(2)){case 0:n.ft=16193;break;case 1:if(nr(n),n.ft=16199,6==t)return D(2),m();break;case 2:n.ft=16196;break;case 3:e.msg="invalid block type",n.ft=16209;}D(2);break;case 16193:if(A(),L(32),(65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",n.ft=16209;break}if(n.ht=65535&u,q(),n.ft=16194,6==t)return m();case 16194:n.ft=16195;case 16195:if(h=n.ht,h){if(h>l&&(h=l),h>o&&(h=o),0==h)return m();M(f,_,r,i,h),l-=h,i+=h,o-=h,_+=h,n.ht-=h;break}n.ft=16191;break;case 16196:if(L(14),n.bt=$(5)+257,D(5),n.vt=$(5)+1,D(5),n.wt=$(4)+4,D(4),n.bt>286||!n.Zt&&n.vt>30){e.msg=n.Zt?"too many length":"too many length or distance symbols",n.ft=16209;break}n.kt=0,n.ft=16197;case 16197:for(;n.kt<n.wt;)L(3),n.xt[pe[n.kt++]]=$(3),D(3);for(;n.kt<19;)n.xt[pe[n.kt++]]=0;n.gt=n.yt,n.et=n.tt=n.gt,n.nt=7;let c={jt:n.gt},g={jt:n.nt},p={jt:0};if(k=Oe(0,n.xt,19,c,g,n.Tt,p,n.Zt),n.gt=c.jt,n.nt=g.jt,k){e.msg="invalid code lengths set",n.ft=16209;break}n.kt=0,n.ft=16198;case 16198:for(;n.kt<n.bt+n.vt;){for(;w=n.et[$(n.nt)],!((w>>>16&255)<=a);)S();if((65535&w)<16)D(w>>>16&255),n.xt[n.kt++]=65535&w;else {if(16==(65535&w)){if(L(2+(w>>>16&255)),D(w>>>16&255),0==n.kt){e.msg="invalid bit length repeat",n.ft=16209;break}v=n.xt[n.kt-1],h=3+$(2),D(2);}else 17==(65535&w)?(L(3+(w>>>16&255)),D(w>>>16&255),v=0,h=3+$(3),D(3)):(L(7+(w>>>16&255)),D(w>>>16&255),v=0,h=11+$(7),D(7));if(n.kt+h>n.bt+n.vt){e.msg="invalid bit length repeat",n.ft=16209;break}for(;h--;)n.xt[n.kt++]=v;}}if(16209==n.ft)break;if(0==n.xt[256]){e.msg="invalid code -- missing end-of-block",n.ft=16209;break}n.gt=n.yt,n.nt=9;let I={jt:n.gt},H={jt:n.nt},Q={jt:0};k=Oe(1,n.xt,n.bt,I,H,n.Tt,Q,n.Zt),n.gt=I.jt,n.nt=H.jt;let j=Q.jt;if(n.et=n.gt.slice(0,j),k){e.msg="invalid literal/lengths set",n.ft=16209;break}n.rt=6;let N=n.xt.subarray(n.bt,n.bt+n.vt),U={jt:n.gt},R={jt:n.rt},Y={jt:j};if(k=Oe(2,N,n.vt,U,R,n.Tt,Y,n.Zt),n.gt=U.jt,n.rt=R.jt,n.tt=n.gt.slice(j),k){e.msg="invalid distances set",n.ft=16209;break}if(n.ft=16199,6==t)return m();case 16199:n.ft=16200;case 16200:if(!n.Zt&&l>=6&&o>=258){C(),Jt(e,s),z(),16191==n.ft&&(n.Mt=-1);break}for(n.Mt=0;w=n.et[$(n.nt)],!((w>>>16&255)<=a);)S();if(w>>>24&&!(w>>>24&240)){for(b=w;w=n.et[(65535&b)+($((b>>>16&255)+(b>>>24))>>(b>>>16&255))],!((b>>>16&255)+(w>>>16&255)<=a);)S();D(b>>>16&255),n.Mt+=b>>>16&255;}if(D(w>>>16&255),n.Mt+=w>>>16&255,n.ht=65535&w,!(w>>>24)){n.ft=16205;break}if(w>>>24&32){n.Mt=-1,n.ft=16191;break}if(w>>>24&64){e.msg="invalid literal/length code",n.ft=16209;break}n.Ge=w>>>24&(n.Zt?31:15),n.ft=16201;case 16201:n.Ge&&(L(n.Ge),n.ht+=$(n.Ge),D(n.Ge),n.Mt+=n.Ge),n.Ct=n.ht,n.ft=16202;case 16202:for(;w=n.tt[$(n.rt)],!((w>>>16&255)<=a);)S();if(!(w>>>24&240)){for(b=w;w=n.tt[(65535&b)+($((b>>>16&255)+(b>>>24))>>(b>>>16&255))],!((b>>>16&255)+(w>>>16&255)<=a);)S();D(b>>>16&255),n.Mt+=b>>>16&255;}if(D(w>>>16&255),n.Mt+=w>>>16&255,w>>>24&64){e.msg="invalid distance code",n.ft=16209;break}n.dt=65535&w,n.Ge=w>>>24&15,n.ft=16203;case 16203:n.Ge&&(L(n.Ge),n.dt+=$(n.Ge),D(n.Ge),n.Mt+=n.Ge),n.ft=16204;case 16204:if(0==o)return m();if(h=s-o,n.dt>h){if(h=n.dt-h,h>n.k&&n.it){e.msg="invalid distance too far back",n.ft=16209;break}h>n.m?(h-=n.m,d=n.h-h):d=n.m-h,h>n.ht&&(h=n.ht),h>o&&(h=o);for(let e=0;e<h;++e)f[_]=255&n.u[d],++_,++d;}else {d=_-n.dt,h=n.ht,h>o&&(h=o);for(let e=0;e<h;++e)f[_]=f[d],++_,++d;}h>o&&(h=o),o-=h,n.ht-=h,0==n.ht&&(n.ft=16200);break;case 16205:if(0==o)return m();f[_++]=n.ht,o--,n.ft=16200;break;case 16206:if(n.P){if(L(32),s-=o,e.total_out+=s,n.st+=s,4&n.P&&s){let t=f.subarray(_-s,_);e.i=n.ct=x(n.ct,t,s);}if(s=o,4&n.P&&(n.ot?u:Y_(u)>>>0)!=n.ct){e.msg="incorrect data check",n.ft=16209;break}q();}n.ft=16207;case 16207:if(n.P&&n.ot){if(L(32),4&n.P&&u!=(4294967295&n.st)){e.msg="incorrect length check",n.ft=16209;break}q();}n.ft=16208;case 16208:return k=1,m();case 16209:return k=-3,m();case 16210:return -4;default:return -2}}catch(e){if(e instanceof S_)return m();throw e}function m(){if(C(),n.h||s!=e.avail_out&&n.ft<16209&&(n.Zt?n.ft<16208:n.ft<16206)||4!=t){let t=s-e.avail_out;if(rr(e,e.next_out.subarray(e.next_out_index-t,e.next_out_index),t))return n.ft=16210,-4}return c-=e.avail_in,s-=e.avail_out,e.total_in+=c,e.total_out+=s,n.st+=s,4&n.P&&s&&(e.i=n.ct=x(n.ct,e.next_out.subarray(e.next_out_index-s,e.next_out_index),s)),e.t=n.T+(n._t?64:0)+(16191==n.ft?128:0)+(16199==n.ft||16194==n.ft?256:0),(0==c&&0==s&&0==k||4==t&&0==k)&&(k=-5),k}function x(e,t,r){return n.ot?W(e,t,r):he(e,t,r)}function T(e,t){return g[0]=255&t,g[1]=t>>>8&255,W(e,g,2)>>>0}function y(e,t){return g[0]=255&t,g[1]=t>>>8&255,g[2]=t>>>16&255,g[3]=t>>>24&255,W(e,g,4)>>>0}function z(){f=e.next_out,_=e.next_out_index,o=e.avail_out,r=e.next_in,i=e.next_in_index,l=e.avail_in,u=n.p,a=n.T;}function C(){e.next_out=f,e.next_out_index=_,e.avail_out=o,e.next_in=r,e.next_in_index=i,e.avail_in=l,n.p=u,n.T=a;}function q(){u=0,a=0;}function S(){if(0==l)throw new S_;l--,u+=(255&r[i])<<a,i++,u>>>=0,a+=8;}function L(e){for(;a<e;)S();}function $(e){return u&(1<<e)-1}function D(e){u>>>=e,a-=e;}function A(){u>>>=7&a,a-=7&a;}}function tn(e){return Ge(e)?-2:0}var X_=65536,ar=32768,W_=class{constructor(e=16,t=X_){this.Ot=[],this.Vt=e;for(let n=0;n<z.min(e,4);n++)this.Ot.push(new p(t));}acquire(e=X_){for(let t=this.Ot.length-1;t>=0;t--){let n=this.Ot[t];if(n.length>=e)return this.Ot.splice(t,1),n}return new p(e)}release(e){this.Ot.length<this.Vt&&this.Ot.push(e);}};function nn(e){let t=new W_(32,X_),n=null;function r(){let t=e.Xt(),n=e.Jt(t);if(0!=n&&0!=n)throw new L("init failed: "+n);return {o:t}}function i(e){try{t.release(e);}catch{}}return new H({start(){},transform(f,_){n||(n=r());let l=n.o;if(n.Kt)return;let o=0;for(;o<f.length;){let r=z.min(f.length-o,ar),u=f.subarray(o,o+r);for(l.next_in=u,l.next_in_index=0,l.avail_in=u.length;l.avail_in>0;){let r=t.acquire(),f=false;try{l.next_out=r,l.next_out_index=0,l.avail_out=r.length;let i=e.en(l,0),o=r.length-l.avail_out;if(o>0){let e=!1,n={tn:r.subarray(0,o),release:()=>{e||(e=!0,t.release(r));}};f=!0,_.enqueue(n);}if(1==i){n.Kt=!0;break}if(0!=i)throw new L("process error: "+i)}finally{f||i(r);}}if(n.Kt)break;o+=r;}},flush(f){if(n&&n.Kt)return;n||(n=r());let _=n.o;for(;;){let n=t.acquire(),r=false;try{_.next_out=n,_.next_out_index=0,_.avail_out=n.length;let i=e.en(_,4),l=n.length-_.avail_out;if(l>0){let e=!1,i={tn:n.subarray(0,l),release:()=>{e||(e=!0,t.release(n));}};r=!0,f.enqueue(i);}if(1==i)break;if(0!=i)throw new L("finalization error: "+i)}finally{r||i(n);}}let l=e.nn(_);if(0!=l&&0!=l)throw new L("end failed: "+l)}})}function rn(){return new H({start(){},transform(e,t){try{t.enqueue(e.tn.slice(0));}finally{e.release();}},flush(){}})}function ir(e="deflate",t){let n="gzip"==e?31:"deflate-raw"==e?-15:15,r=t&&"number"==typeof t.level?t.level:-1;return nn({Xt:()=>vt(),Jt:e=>kt(e,r,8,n,8,0),en:Nt,nn:P_})}function or(e="deflate"){let t="gzip"==e?31:"deflate-raw"==e?-15:"deflate64-raw"==e?-16:15;return nn({Xt:()=>$t(),Jt:e=>en(e,t),en:_n,nn:tn})}var E_=class{constructor(e="deflate",t){let n=ir(e,t);this.writable=n.writable,this.readable=n.readable.pipeThrough(rn());}},g_=class{constructor(e="deflate"){let t=or(e);this.writable=t.writable,this.readable=t.readable.pipeThrough(rn());}};

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


	setDefaultConfiguration({
		workerURI: "./core/web-worker-native.js",
		wasmURI: null,
		CompressionStreamZlib: E_,
		DecompressionStreamZlib: g_
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


	q$1(setDefaultConfiguration);

	exports.BlobReader = BlobReader;
	exports.BlobWriter = BlobWriter;
	exports.Data64URIReader = Data64URIReader;
	exports.Data64URIWriter = Data64URIWriter;
	exports.ERR_AMBIGUOUS_ARCHIVE = ERR_AMBIGUOUS_ARCHIVE;
	exports.ERR_BAD_FORMAT = ERR_BAD_FORMAT;
	exports.ERR_CENTRAL_DIRECTORY_NOT_FOUND = ERR_CENTRAL_DIRECTORY_NOT_FOUND;
	exports.ERR_DUPLICATED_NAME = ERR_DUPLICATED_NAME;
	exports.ERR_ENCRYPTED = ERR_ENCRYPTED;
	exports.ERR_ENCRYPTED_CENTRAL_DIRECTORY = ERR_ENCRYPTED_CENTRAL_DIRECTORY;
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
