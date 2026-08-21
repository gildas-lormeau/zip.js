(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
})(this, (function (exports) { 'use strict';

	const { Array, Object, String, Number, BigInt, Math, Date, Map, Set, Response, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, document, crypto, btoa, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream, navigator, Worker, Symbol, setTimeout, clearTimeout, structuredClone } = typeof globalThis !== 'undefined' ? globalThis : this || self;

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
	const TEMPORARY_SPLIT_ZIP_FILE_SIGNATURE = 0x30304b50;
	const DATA_DESCRIPTOR_RECORD_SIGNATURE = SPLIT_ZIP_FILE_SIGNATURE;
	const ARCHIVE_EXTRA_DATA_SIGNATURE = 0x08064b50;
	const DIGITAL_SIGNATURE_RECORD_SIGNATURE = 0x05054b50;
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
	const SPLIT_ZIP_FILE_SIGNATURE_LENGTH = 4;

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
	const EXTRAFIELD_TYPE_UNIX_TYPE1 = 0x5855;
	const EXTRAFIELD_TYPE_PKWARE_UNIX = 0x000d;

	const BITFLAG_ENCRYPTED = 0b1;
	const BITFLAG_LEVEL = 0b0110;
	const BITFLAG_LEVEL_MAX_MASK = 0b010;
	const BITFLAG_LEVEL_FAST_MASK = 0b100;
	const BITFLAG_LEVEL_SUPER_FAST_MASK = 0b110;
	const BITFLAG_DATA_DESCRIPTOR = 0b1000;
	const BITFLAG_STRONG_ENCRYPTION = 0b1000000;
	const BITFLAG_LANG_ENCODING_FLAG = 0b100000000000;
	const BITFLAG_MASKED_LOCAL_HEADERS = 0b10000000000000;
	const FILE_ATTR_MSDOS_DIR_MASK = 0b10000;
	const FILE_ATTR_MSDOS_READONLY_MASK = 0x01;
	const FILE_ATTR_MSDOS_HIDDEN_MASK = 0x02;
	const FILE_ATTR_MSDOS_SYSTEM_MASK = 0x04;
	const FILE_ATTR_MSDOS_ARCHIVE_MASK = 0x20;
	const FILE_ATTR_UNIX_TYPE_MASK = 0o170000;
	const FILE_ATTR_UNIX_TYPE_DIR = 0o040000;
	const FILE_ATTR_UNIX_TYPE_SYMLINK = 0o120000;
	const FILE_ATTR_UNIX_TYPE_FILE = 0o100000;
	const FILE_ATTR_UNIX_EXECUTABLE_MASK = 0o111;
	const FILE_ATTR_UNIX_DEFAULT_MASK = 0o644;
	const FILE_ATTR_UNIX_SETUID_MASK = 0o4000;
	const FILE_ATTR_UNIX_SETGID_MASK = 0o2000;
	const FILE_ATTR_UNIX_STICKY_MASK = 0o1000;

	const VERSION_DEFLATE = 0x14;
	const VERSION_ZIP64 = 0x2D;
	const VERSION_AES = 0x33;

	const VERSION_MADE_BY_MSDOS = 0x0014;
	const VERSION_MADE_BY_UNIX = 0x0300;

	const DIRECTORY_SIGNATURE = "/";

	const HEADER_SIZE = 30;
	const HEADER_OFFSET_VERSION = 0;
	const HEADER_OFFSET_SIGNATURE = 10;
	const HEADER_OFFSET_COMPRESSED_SIZE = 14;
	const HEADER_OFFSET_UNCOMPRESSED_SIZE = 18;
	const HEADER_OFFSET_FILENAME_LENGTH = 22;
	const HEADER_OFFSET_EXTRAFIELD_LENGTH = 24;
	const LOCAL_HEADER_COMMON_OFFSET = 4;

	const MAX_DATE = new Date(2107, 11, 31, 23, 59, 58);
	const MIN_DATE = new Date(1980, 0, 1);

	const UNDEFINED_VALUE = undefined;
	const INFINITY_VALUE = Infinity;
	const UNDEFINED_TYPE = "undefined";
	const FUNCTION_TYPE = "function";
	const OBJECT_TYPE = "object";
	const STRING_TYPE = "string";
	const NUMBER_TYPE = "number";
	const BOOLEAN_TYPE = "boolean";

	const EMPTY_UINT8_ARRAY = new Uint8Array();

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
	const OPTION_CHECK_LOCAL_DIRECTORY = "checkLocalDirectory";
	const OPTION_CHECK_SIGNATURE = "checkSignature";
	const OPTION_CHECK_CRC32 = "checkCrc32";
	const OPTION_CHECK_AUTHENTICATION_CODE = "checkAuthenticationCode";
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
	const OPTION_LOCAL_EXTRA_FIELD = "localExtraField";
	const OPTION_STRICTNESS = "strictness";
	const OPTION_FILENAME_VALIDATION = "filenameValidation";
	const OPTION_NORMALIZE_FILENAME = "normalizeFilename";
	const OPTION_MAX_APPENDED_DATA_SIZE = "maxAppendedDataSize";
	const OPTION_DECRYPT_CENTRAL_DIRECTORY = "decryptCentralDirectory";
	const OPTION_SIGN_CENTRAL_DIRECTORY = "signCentralDirectory";
	const TEXT_TYPE_FILENAME = "filename";
	const TEXT_TYPE_COMMENT = "comment";
	const STRICTNESS_STRICT = "strict";
	const STRICTNESS_BALANCED = "balanced";
	const STRICTNESS_TOLERANT = "tolerant";

	const ERR_INVALID_FUNCTION_OPTION = "Invalid option (must be a function)";
	const ERR_INVALID_SIGNAL = "Invalid signal (must be an AbortSignal instance)";
	const ERR_INVALID_PASSWORD_TYPE = "Invalid password (password must be a string, rawPassword must be a Uint8Array)";

	function checkFunctionOption(value) {
		if (value && typeof value != FUNCTION_TYPE) {
			throw new Error(ERR_INVALID_FUNCTION_OPTION);
		}
		return value;
	}

	function checkSignalOption(signal) {
		if (signal && (typeof signal.addEventListener != FUNCTION_TYPE || typeof signal.aborted != BOOLEAN_TYPE)) {
			throw new Error(ERR_INVALID_SIGNAL);
		}
		return signal || UNDEFINED_VALUE;
	}

	function checkPasswordOption(password, rawPassword) {
		if ((password && typeof password != STRING_TYPE) || (rawPassword && !(rawPassword instanceof Uint8Array))) {
			throw new Error(ERR_INVALID_PASSWORD_TYPE);
		}
	}

	function toNumber(value) {
		return typeof value == STRING_TYPE && value.trim() ? Number(value) : value;
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


	const DEFAULT_CHUNK_SIZE$1 = 64 * 1024;
	const MINIMUM_CHUNK_SIZE = 64;
	const MINIMUM_PROPERTY_VALUE = 1;
	const ERR_INVALID_MAX_WORKERS = "Invalid maxWorkers (must be an integer greater than 0)";
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
		chunkSize: DEFAULT_CHUNK_SIZE$1,
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

	const PROPERTY_NAME_MAX_WORKERS = "maxWorkers";

	const STRING_PROPERTY_NAMES = [
		"baseURI",
		"wasmURI",
		"workerURI"
	];
	const BOOLEAN_PROPERTY_NAMES = [
		"useCompressionStream",
		"useWebWorkers",
		"transferStreams"
	];
	const NUMBER_PROPERTY_NAMES = [
		"chunkSize",
		PROPERTY_NAME_MAX_WORKERS,
		"terminateWorkerTimeout",
		"workerStarvationTimeout",
		"workerStartupTimeout"
	];
	const FUNCTION_PROPERTY_NAMES = [
		"createWorker",
		"CompressionStream",
		"DecompressionStream",
		"CompressionStreamFallback",
		"DecompressionStreamFallback"
	];
	const CONFIGURABLE_PROPERTY_NAMES = [
		...STRING_PROPERTY_NAMES,
		...BOOLEAN_PROPERTY_NAMES,
		...NUMBER_PROPERTY_NAMES,
		...FUNCTION_PROPERTY_NAMES
	];

	const config = { ...DEFAULT_CONFIGURATION };

	function getConfiguration() {
		return config;
	}

	function getChunkSize(config) {
		return normalizeChunkSize(config.chunkSize);
	}

	function normalizeChunkSize(chunkSize) {
		chunkSize = toNumber(chunkSize);
		return Number.isInteger(chunkSize) && chunkSize >= MINIMUM_PROPERTY_VALUE ? Math.max(chunkSize, MINIMUM_CHUNK_SIZE) : DEFAULT_CHUNK_SIZE$1;
	}

	function configure(configuration) {
		Object.assign(config, checkConfiguration(normalizeConfiguration(configuration)));
	}

	function checkConfiguration(configuration) {
		const checkedConfiguration = {};
		for (const propertyName of CONFIGURABLE_PROPERTY_NAMES) {
			const propertyValue = configuration[propertyName];
			if (propertyValue !== UNDEFINED_VALUE) {
				checkedConfiguration[propertyName] = checkPropertyValue(propertyName, propertyValue);
			}
		}
		return checkedConfiguration;
	}

	function checkPropertyValue(propertyName, propertyValue) {
		if (NUMBER_PROPERTY_NAMES.includes(propertyName)) {
			propertyValue = toNumber(propertyValue);
			if (propertyName == PROPERTY_NAME_MAX_WORKERS && (!Number.isInteger(propertyValue) || propertyValue < MINIMUM_PROPERTY_VALUE)) {
				throw new Error(ERR_INVALID_MAX_WORKERS);
			}
		} else if (FUNCTION_PROPERTY_NAMES.includes(propertyName)) {
			checkFunctionOption(propertyValue);
		}
		return propertyValue;
	}

	function normalizeConfiguration(configuration) {
		configuration = configuration || {};
		const { CompressionStreamZlib, DecompressionStreamZlib } = configuration;
		if (CompressionStreamZlib === UNDEFINED_VALUE && DecompressionStreamZlib === UNDEFINED_VALUE) {
			return configuration;
		}
		const normalizedConfiguration = Object.assign({}, configuration);
		if (normalizedConfiguration.CompressionStreamFallback === UNDEFINED_VALUE) {
			normalizedConfiguration.CompressionStreamFallback = CompressionStreamZlib;
		}
		if (normalizedConfiguration.DecompressionStreamFallback === UNDEFINED_VALUE) {
			normalizedConfiguration.DecompressionStreamFallback = DecompressionStreamZlib;
		}
		return normalizedConfiguration;
	}

	function setDefaultConfiguration(configuration) {
		const checkedConfiguration = checkConfiguration(normalizeConfiguration(configuration));
		Object.assign(DEFAULT_CONFIGURATION, checkedConfiguration);
		Object.assign(config, checkedConfiguration);
	}

	function resetConfiguration() {
		for (const propertyName of CONFIGURABLE_PROPERTY_NAMES) {
			delete config[propertyName];
		}
		Object.assign(config, DEFAULT_CONFIGURATION);
	}

	const n=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],r=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],e=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],f=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],t=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],o=new Uint8Array(288);o.fill(8,0,144),o.fill(9,144,256),o.fill(7,256,280),o.fill(8,280,288);const u=new Uint8Array(30).fill(5);function a(n){const r=new Uint16Array(16);for(const e of n)r[e]++;r[0]=0;const e=new Uint16Array(17);for(let n=1;n<=15;n++)e[n+1]=e[n]+r[n];const f=new Uint16Array(n.length);for(let r=0;r<n.length;r++)n[r]&&(f[e[n[r]]++]=r);return {o:r,symbols:f}}const s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",p$1=(l=()=>(s=>{let p=0,l=0,U=0,K=new Uint8Array(1024),x=0,w=0;for(;!w;){w=i(1);const n=i(2);if(0==n)c();else if(1==n)j(a(o),a(u));else {if(2!=n)throw Error("invalid deflate block type");j(...y());}}return K.subarray(0,x);function b(){if(p>=s.length)throw Error("unexpected end of deflate data");return s[p++]}function i(n){for(;U<n;)l|=b()<<U,U+=8;const r=l&(1<<n)-1;return l>>>=n,U-=n,r}function c(){l=0,U=0;const n=b()|b()<<8;p+=2,V(x+n);for(let r=0;r<n;r++)K[x++]=b();}function j(t,o){let u=C(t);for(;256!=u;){if(u<256)V(x+1),K[x++]=u;else {const t=u-257,a=n[t]+i(r[t]),s=C(o),p=e[s]+i(f[s]);V(x+a);const l=x-p;for(let n=0;n<a;n++)K[x++]=K[l+n];}u=C(t);}}function y(){const n=i(5)+257,r=i(5)+1,e=i(4)+4,f=new Uint8Array(19);for(let n=0;n<e;n++)f[t[n]]=i(3);const o=a(f),u=new Uint8Array(n+r);let s=0;for(;s<u.length;){const n=C(o);if(n<16)u[s++]=n;else if(16==n){const n=u[s-1];let r=i(2)+3;for(;r--;)u[s++]=n;}else s+=17==n?i(3)+3:i(7)+11;}return [a(u.subarray(0,n)),a(u.subarray(n))]}function C(n){const{o:r,symbols:e}=n;let f=0,t=0,o=0;for(let n=1;n<=15;n++){f|=i(1);const u=r[n];if(f-t<u)return e[o+(f-t)];o+=u,t=t+u<<1,f<<=1;}throw Error("invalid huffman code")}function V(n){if(K.length<n){let r=2*K.length;for(;r<n;)r*=2;const e=new Uint8Array(r);e.set(K.subarray(0,x)),K=e;}}})((n=>{const r=(n=(n+"").replace(/[^A-Za-z0-9+/=]/g,"")).length,e=[];for(let f=0;f<r;f+=4){const r=s.indexOf(n[f])<<18|s.indexOf(n[f+1])<<12|(63&s.indexOf(n[f+2]))<<6|63&s.indexOf(n[f+3]);e.push(r>>16&255),"="!==n[f+2]&&e.push(r>>8&255),"="!==n[f+3]&&e.push(255&r);}return new Uint8Array(e)})("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")),n=>n({workerURI:n=>{const r="text/javascript";let e=l();if("string"==typeof e&&(e=(new TextEncoder).encode(e)),n){const n=new Blob([e],{type:r});return URL.createObjectURL(n)}return "data:"+r+";base64,"+(n=>{let r="";const e=n.length;let f=0;for(;f+2<e;f+=3){const e=n[f]<<16|n[f+1]<<8|n[f+2];r+=s[e>>18&63]+s[e>>12&63]+s[e>>6&63]+s[63&e];}const t=e-f;if(1===t){const e=n[f]<<16;r+=s[e>>18&63]+s[e>>12&63]+"==";}else if(2===t){const e=n[f]<<16|n[f+1]<<8;r+=s[e>>18&63]+s[e>>12&63]+s[e>>6&63]+"=";}return r})(e)}}));var l;

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
	const ERR_INVALID_AUTHENTICATION_CODE = ERR_INVALID_SIGNATURE;
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
	const AUTHENTICATION_CODE_LENGTH = 10;
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

		constructor({ password, rawPassword, encryptionStrength, checkPasswordOnly, checkAuthenticationCode = true }) {
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
					const output = new Uint8Array(chunk.length - AUTHENTICATION_CODE_LENGTH - ((chunk.length - AUTHENTICATION_CODE_LENGTH) % BLOCK_LENGTH));
					controller.enqueue(append(aesCrypto, chunk, output, 0, AUTHENTICATION_CODE_LENGTH, true));
				},
				async flush(controller) {
					const {
						ctr,
						hmac,
						pendingInput,
						ready
					} = this;
					if (hmac && ctr) {
						await ready;
						const chunkToDecrypt = subarray(pendingInput, 0, pendingInput.length - AUTHENTICATION_CODE_LENGTH);
						const originalAuthenticationCode = subarray(pendingInput, pendingInput.length - AUTHENTICATION_CODE_LENGTH);
						let decryptedChunkArray = EMPTY_UINT8_ARRAY;
						if (chunkToDecrypt.length) {
							const encryptedChunk = toBits(codecBytes, chunkToDecrypt);
							hmac.update(encryptedChunk);
							const decryptedChunk = ctr.update(encryptedChunk);
							decryptedChunkArray = fromBits(codecBytes, decryptedChunk);
						}
						const authenticationCode = subarray(fromBits(codecBytes, hmac.digest()), 0, AUTHENTICATION_CODE_LENGTH);
						let invalidAuthenticationCode = pendingInput.length < AUTHENTICATION_CODE_LENGTH ? 1 : 0;
						for (let indexByte = 0; indexByte < AUTHENTICATION_CODE_LENGTH; indexByte++) {
							invalidAuthenticationCode |= authenticationCode[indexByte] ^ originalAuthenticationCode[indexByte];
						}
						if (invalidAuthenticationCode && checkAuthenticationCode) {
							throw new Error(ERR_INVALID_AUTHENTICATION_CODE);
						}
						controller.enqueue(decryptedChunkArray);
					}
				}
			});
		}
	}

	class AESEncryptionStream extends TransformStream {

		constructor({ password, rawPassword, encryptionStrength }) {
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
						pendingInput,
						ready
					} = this;
					if (hmac && ctr) {
						await ready;
						let encryptedChunkArray = EMPTY_UINT8_ARRAY;
						if (pendingInput.length) {
							const encryptedChunk = ctr.update(toBits(codecBytes, pendingInput));
							hmac.update(encryptedChunk);
							encryptedChunkArray = fromBits(codecBytes, encryptedChunk);
						}
						const authenticationCode = fromBits(codecBytes, hmac.digest()).slice(0, AUTHENTICATION_CODE_LENGTH);
						controller.enqueue(concat(encryptedChunkArray, authenticationCode));
					}
				}
			});
		}
	}

	function initAesCrypto(aesCrypto, password, rawPassword, encryptionStrength) {
		Object.assign(aesCrypto, {
			ready: new Promise(resolve => aesCrypto.resolveReady = resolve),
			password: encodePassword(password, rawPassword),
			strength: encryptionStrength - 1,
			pendingInput: EMPTY_UINT8_ARRAY
		});
	}

	function append(aesCrypto, input, output, paddingStart, paddingEnd, verifyAuthenticationCode) {
		const {
			ctr,
			hmac,
			pendingInput
		} = aesCrypto;
		if (pendingInput.length) {
			input = concat(pendingInput, input);
		}
		const inputLength = input.length - paddingEnd;
		output = expand(output, paddingStart + (inputLength - (inputLength % BLOCK_LENGTH)));
		let offset;
		for (offset = 0; offset <= inputLength - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
			const inputChunk = toBits(codecBytes, subarray(input, offset, offset + BLOCK_LENGTH));
			if (verifyAuthenticationCode) {
				hmac.update(inputChunk);
			}
			const outputChunk = ctr.update(inputChunk);
			if (!verifyAuthenticationCode) {
				hmac.update(outputChunk);
			}
			output.set(fromBits(codecBytes, outputChunk), offset + paddingStart);
		}
		aesCrypto.pendingInput = subarray(input, offset);
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

	function streamToBlob(readable, contentType) {
		readable = toCompatibleReadable(readable);
		const blobOptions = contentType ? { type: contentType } : {};
		if (responseSupportsGlobalReadable()) {
			return new Response(readable).blob().then(blob => contentType ? new Blob([blob], blobOptions) : blob);
		}
		const chunks = [];
		return readable
			.pipeTo(new WritableStream({
				write(chunk) {
					chunks.push(chunk);
				}
			}))
			.then(() => new Blob(chunks, blobOptions));
	}

	function responseSupportsGlobalReadable() {
		return typeof Blob.prototype.stream != FUNCTION_TYPE || new Blob([]).stream() instanceof ReadableStream;
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


	const ERR_INVALID_CODEC_DEFINITION = "Invalid codec definition";
	const ERR_RESERVED_COMPRESSION_METHOD = "Reserved compression method";
	const ERR_INVALID_CODEC_MODULE = "Invalid codec module";

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
	const ERR_INVALID_CRC32 = ERR_INVALID_SIGNATURE;
	const ERR_UNSUPPORTED_COMPRESSION$2 = "Compression method not supported";
	const FORMAT_DEFLATE_RAW = "deflate-raw";
	const FORMAT_DEFLATE64_RAW = "deflate64-raw";
	const FORMAT_GZIP = "gzip";
	const GZIP_HEADER_LENGTH = 10;
	const GZIP_TRAILER_LENGTH = 8;
	const GZIP_HEADER_BYTES = [0x1f, 0x8b, 0x08];
	const GZIP_OUTPUT_STALL_TIMEOUT = 5000;

	class DeflateStream extends TransformStream {

		constructor(options, { chunkSize, CompressionStreamFallback, CompressionStream }) {
			super({});
			const { compressed, encrypted, useCompressionStream, zipCrypto, computeCrc32, level, deflate64, format, compressionMethod } = options;
			const stream = this;
			let crc32Stream, encryptionStream, gzipCrc32Stream;
			let readable = super.readable;
			const codecStreams = format && getCodecStreams(format);
			const useGzipCrc32 = computeCrc32 && compressed && !deflate64 && !codecStreams && (!encrypted || zipCrypto) &&
				Boolean(useCompressionStream && CompressionStream);
			if ((!encrypted || zipCrypto) && computeCrc32 && !useGzipCrc32) {
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
						readable = pipeThroughCompressionStream(readable, useCompressionStream, { level, chunkSize }, CompressionStream, CompressionStreamFallback);
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
				if ((!encrypted || zipCrypto) && computeCrc32) {
					stream.crc32 = useGzipCrc32 ? gzipCrc32Stream.crc32 : new DataView(crc32Stream.value.buffer).getUint32(0);
				}
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
					stream.crc32 = dataView.getUint32(0, true);
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

		constructor(options, { chunkSize, DecompressionStreamFallback, DecompressionStream }) {
			super({});
			const { zipCrypto, encrypted, checkCrc32, crc32, compressed, useCompressionStream, deflate64, format, compressionMethod, rawBitFlag, outputSize } = options;
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
						readable = pipeThroughCompressionStream(readable, useCompressionStream, { chunkSize, deflate64 }, DecompressionStream, DecompressionStreamFallback);
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
			if (checkCrc32) {
				crc32Stream = new Crc32Stream();
				readable = pipeThrough(readable, crc32Stream);
			}
			setReadable(this, readable, () => {
				if (checkCrc32) {
					const computedCrc32View = new DataView(crc32Stream.value.buffer);
					if (crc32 != computedCrc32View.getUint32(0, false)) {
						throw new Error(ERR_INVALID_CRC32);
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

	function pipeThroughCompressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamFallback) {
		const Stream = useCompressionStream && CompressionStreamNative ?
			CompressionStreamNative :
			CompressionStreamFallback || CompressionStreamNative;
		const format = options.deflate64 ? FORMAT_DEFLATE64_RAW : FORMAT_DEFLATE_RAW;
		let codecStream;
		try {
			codecStream = new Stream(format, options);
		} catch (error) {
			if (useCompressionStream && CompressionStreamFallback && Stream != CompressionStreamFallback) {
				codecStream = new CompressionStreamFallback(format, options);
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
					const { crc32 } = stream;
					Object.assign(codec, {
						crc32,
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


	const ERR_WORKER_STARTUP_TIMEOUT = "Worker startup timeout";

	let webWorkerSupported, createWorkerFailed, webWorkerBackend;
	let initModule = () => { };

	function setWebWorkerBackend(backend) {
		webWorkerBackend = backend;
	}

	async function supportsDeflate(config) {
		const { CompressionStream: NativeStream, CompressionStreamFallback: FallbackStream } = config;
		if (FallbackStream && !FallbackStream.requiresModule) {
			return true;
		}
		if (supportsDeflateRaw(NativeStream) || supportsGzip(NativeStream)) {
			return true;
		}
		if (FallbackStream) {
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
		createWorkerFailed = false;
	}

	function disableWebWorker(workerData) {
		if (workerData.createWorker) {
			createWorkerFailed = true;
		} else {
			webWorkerSupported = false;
		}
	}

	class CodecWorker {

		constructor(workerData, { readable, writable }, { options, config, streamOptions, useWebWorkers, transferStreams, workerURI, createWorker }, onTaskFinished) {
			const { signal } = streamOptions;
			if (createWorkerFailed) {
				createWorker = UNDEFINED_VALUE;
			}
			Object.assign(workerData, {
				busy: true,
				generation: (workerData.generation || 0) + 1,
				readable: readable
					.pipeThrough(new ChunkStream(getChunkSize(config)))
					.pipeThrough(new ProgressWatcherStream(streamOptions), { signal }),
				writable,
				options: Object.assign({}, options),
				workerURI,
				createWorker,
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
			return (useWebWorkers && webWorkerBackend && ((webWorkerSupported && workerURI) || createWorker) ? webWorkerBackend : createWorkerInterface)(workerData, config);
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

	async function runWorker$1({ options, readable, writable, onTaskFinished }, config) {
		let codecStream;
		try {
			if (options.compressed && !options.format) {
				const deflate = options.codecType.startsWith(CODEC_DEFLATE);
				const FallbackStream = deflate ? config.CompressionStreamFallback : config.DecompressionStreamFallback;
				const NativeStream = deflate ? config.CompressionStream : config.DecompressionStream;
				if (!options.useCompressionStream) {
					try {
						await initModule(config);
					} catch {
						if (!FallbackStream || FallbackStream.requiresModule) {
							options.useCompressionStream = true;
						}
					}
				} else if (FallbackStream && FallbackStream.requiresModule && !supportsDeflateRaw(NativeStream)) {
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
				crc32,
				inputSize,
				outputSize
			} = codecStream;
			return {
				crc32,
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

	let webWorkerSource, webWorkerURI, webWorkerOptions;
	let transferStreamsSupported = true;
	try {
		transferStreamsSupported = typeof structuredClone == FUNCTION_TYPE && structuredClone(new DOMException("", "AbortError")).code !== UNDEFINED_VALUE;
	} catch {
		// ignored
	}

	setWebWorkerBackend(createWebWorkerInterface);

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
				disableWebWorker(workerData);
				return createWorkerInterface(workerData, config);
			}
			Object.assign(workerData, {
				worker,
				workerAlive: false,
				terminated: false,
				startupError: null,
				interface: {
					run: async () => {
						try {
							return await runWebWorker(workerData, { chunkSize, wasmURI, baseURI, workerStartupTimeout });
						} catch (error) {
							if (error && error.workerStartupFailed) {
								disableWebWorker(workerData);
								releaseWorkerStreams(workerData);
								return runWorker$1(workerData, config);
							}
							if (error && error.codecImportFailed) {
								if (workerData.reader) {
									releaseWorkerStreams(workerData);
									return runWorker$1(workerData, config);
								}
								workerData.onTaskFinished();
							}
							throw error;
						}
					}
				}
			});
		}
		return workerData.interface;
	}

	async function runWebWorker(workerData, config) {
		if (!workerData.worker) {
			const { startupError } = workerData;
			workerData.startupError = null;
			const error = startupError || new Error(ERR_WORKER_STARTUP_TIMEOUT);
			error.workerStartupFailed = true;
			throw error;
		}
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

	function releaseWorkerStreams(workerData) {
		const { reader } = workerData;
		if (reader) {
			reader.releaseLock();
		}
		workerData.reader = null;
		workerData.writer = null;
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
		const { createWorker } = workerData;
		let worker, resolvedURI, resolvedOptions;
		if (createWorker) {
			worker = createWorker();
		} else if (webWorkerURI === UNDEFINED_VALUE || webWorkerSource !== url) {
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
					if (isModuleType) {
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
		let error = event.error || new Error(event.message || ERROR_EVENT_TYPE);
		if (!workerAlive) {
			error = Object.assign(new Error(error.message || ERROR_EVENT_TYPE), { workerStartupFailed: true });
			workerData.startupError = error;
		}
		if (rejectResult) {
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
				const { message, stack, code, name, outputSize, cause, codecImportFailed } = error;
				const responseError = new Error(message);
				Object.assign(responseError, { stack, code, name, outputSize });
				if (cause) {
					responseError.cause = Object.assign(new Error(cause.message), { name: cause.name });
				}
				if (codecImportFailed) {
					responseError.codecImportFailed = true;
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
			if (!(error && error.codecImportFailed)) {
				onTaskFinished();
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


	let pool = [];
	const pendingRequests = [];
	let starvationTimeout;
	let starvationDelay;

	let indexWorker = 0;

	async function runWorker(stream, workerOptions) {
		const { options, config } = workerOptions;
		const { transferStreams, useWebWorkers, useCompressionStream, compressed, checkCrc32, computeCrc32, encrypted, format, codecURI } = options;
		const { workerURI, createWorker, maxWorkers } = config;
		if (format) {
			if (codecURI) {
				options.codecURI = resolveCodecURI(codecURI, config.baseURI);
			}
			await ensureCodecStreams(format, options.codecURI);
		}
		workerOptions.transferStreams = !format && (transferStreams || (transferStreams === UNDEFINED_VALUE && config.transferStreams));
		const streamCopy = !compressed && !checkCrc32 && !computeCrc32 && !encrypted;
		const workerSupported = format === UNDEFINED_VALUE || Boolean(options.codecURI);
		workerOptions.useWebWorkers = !streamCopy && workerSupported && (useWebWorkers || (useWebWorkers === UNDEFINED_VALUE && config.useWebWorkers));
		workerOptions.workerURI = workerOptions.useWebWorkers && workerURI ? workerURI : UNDEFINED_VALUE;
		workerOptions.createWorker = workerOptions.useWebWorkers && createWorker ? createWorker : UNDEFINED_VALUE;
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
			const inlineWorkerOptions = Object.assign({}, workerOptions, { useWebWorkers: false, workerURI: UNDEFINED_VALUE, createWorker: UNDEFINED_VALUE });
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
		return decode(value, encoding, true);
	}

	function decodeTextRemovingBOM(value, encoding) {
		return decode(value, encoding, false);
	}

	function decode(value, encoding, ignoreBOM) {
		if (encoding && encoding.trim().toLowerCase() == "cp437") {
			return decodeCP437(value);
		} else {
			return new TextDecoder(encoding, { ignoreBOM }).decode(value);
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
			chunkSize = normalizeChunkSize(chunkSize);
			return new ReadableStream({
				async pull(controller) {
					const dataSize = size === UNDEFINED_VALUE ? chunkSize : Math.min(chunkSize, size - chunkOffset);
					const data = await readUint8Array(reader, offset + chunkOffset, dataSize);
					if (data.length) {
						controller.enqueue(data);
					}
					if ((chunkOffset + chunkSize >= size) || (!data.length && dataSize)) {
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
				contentType,
				data: "data:" + (contentType || "") + ";base64,",
				pendingCharacters: ""
			});
		}

		writeUint8Array(array) {
			const writer = this;
			let indexArray;
			let dataString = writer.pendingCharacters;
			const delta = writer.pendingCharacters.length;
			writer.pendingCharacters = "";
			for (indexArray = 0; indexArray < (Math.floor((delta + array.length) / 3) * 3) - delta; indexArray++) {
				dataString += String.fromCharCode(array[indexArray]);
			}
			for (; indexArray < array.length; indexArray++) {
				writer.pendingCharacters += String.fromCharCode(array[indexArray]);
			}
			if (dataString.length > 2) {
				writer.data += btoa(dataString);
			} else {
				writer.pendingCharacters = dataString + writer.pendingCharacters;
			}
		}

		getData() {
			return this.data + btoa(this.pendingCharacters);
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
				sourceBlob: blob,
				size: blob.size
			});
			if (!blobSliceProbe) {
				probeBlobSliceReliability();
			}
		}

		createReadable(options) {
			const reader = this;
			const { sourceBlob, size } = reader;
			const { offset = 0, size: readSize = size - offset } = options || {};
			if (!offset && readSize >= size) {
				return toCompatibleReadable(sourceBlob.stream());
			}
			if (blobSliceReliable) {
				return toCompatibleReadable(sourceBlob.slice(offset, offset + readSize).stream());
			}
			return super.createReadable(options);
		}

		async readUint8Array(offset, length) {
			const reader = this;
			const offsetEnd = offset + length;
			const readsWholeBlob = !offset && offsetEnd >= reader.size;
			const blob = readsWholeBlob ? reader.sourceBlob : reader.sourceBlob.slice(offset, offsetEnd);
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
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
				get() {
					return transformStream.writable;
				}
			});
			writer.contentType = contentType;
			writer.blobPromise = streamToBlob(transformStream.readable, contentType);
			writer.blobPromise.catch(() => { });
		}

		getData() {
			return this.blobPromise;
		}
	}

	class TextReader extends BlobReader {

		constructor(text) {
			super(new Blob([text], { type: CONTENT_TYPE_TEXT_PLAIN }));
		}
	}

	function getTextSize(text) {
		let size = 0;
		for (let indexCharacter = 0; indexCharacter < text.length; indexCharacter++) {
			const characterCode = text.charCodeAt(indexCharacter);
			if (characterCode < 0x80) {
				size += 1;
			} else if (characterCode < 0x800) {
				size += 2;
			} else if (characterCode < 0xd800 || characterCode >= 0xe000) {
				size += 3;
			} else if (characterCode < 0xdc00 && (text.charCodeAt(indexCharacter + 1) & 0xfc00) == 0xdc00) {
				size += 4;
				indexCharacter++;
			} else {
				size += 3;
			}
		}
		return size;
	}

	class TextWriter extends BlobWriter {

		constructor(encoding) {
			super();
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
				return decodeTextRemovingBOM(new Uint8Array(await blob.arrayBuffer()), encoding);
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
		if (isHttpFamily(url) && (useRangeHeader || forceRangeRequests) && (typeof preventHeadRequest == UNDEFINED_TYPE || preventHeadRequest)) {
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
			reader.lastDiskNumber = 0;
			const readers = reader.readers = await Promise.all(reader.readers.map(initDiskReader));
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

	function ownsWritable(writer) {
		return Boolean(writer && writer.getData);
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

	async function initDiskReader(diskReader) {
		diskReader = new GenericReader(diskReader);
		await initStream(diskReader);
		if (diskReader.size === UNDEFINED_VALUE || !diskReader.readUint8Array) {
			diskReader = new BlobReader(await streamToBlob(diskReader.readable));
			await initStream(diskReader);
		}
		return diskReader;
	}

	function readUint8Array(reader, offset, size) {
		return reader.readUint8Array(offset, size);
	}

	function createReadable(reader, options) {
		if (reader.createReadable) {
			return reader.createReadable(options);
		} else if (reader.readUint8Array) {
			return Reader.prototype.createReadable.call(reader, options);
		} else {
			return reader.readable;
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
	const PROPERTY_NAME_DEPRECATED_INTERNAL_FILE_ATTRIBUTES = "internalFileAttribute";
	const PROPERTY_NAME_DEPRECATED_EXTERNAL_FILE_ATTRIBUTES = "externalFileAttribute";
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
	const PROPERTY_NAME_SYMLINK = "symlink";
	const PROPERTY_NAME_COMPRESSION_METHOD = "compressionMethod";
	const PROPERTY_NAME_SIGNATURE = "signature";
	const PROPERTY_NAME_CRC32 = "crc32";
	const PROPERTY_NAME_EXTRA_FIELD = "extraField";
	const PROPERTY_NAME_EXTRA_FIELD_INFOZIP = "extraFieldInfoZip";
	const PROPERTY_NAME_EXTRA_FIELD_UNIX = "extraFieldUnix";
	const PROPERTY_NAME_EXTRA_FIELD_UNIX_TYPE1 = "extraFieldUnixType1";
	const PROPERTY_NAME_EXTRA_FIELD_PKWARE_UNIX = "extraFieldPkwareUnix";
	const PROPERTY_NAME_UID = "uid";
	const PROPERTY_NAME_GID = "gid";
	const PROPERTY_NAME_UNIX_MODE = "unixMode";
	const PROPERTY_NAME_SETUID = "setuid";
	const PROPERTY_NAME_SETGID = "setgid";
	const PROPERTY_NAME_STICKY = "sticky";
	const PROPERTY_NAME_BITFLAG = "bitFlag";
	const PROPERTY_NAME_RAW_BITFLAG = "rawBitFlag";
	const PROPERTY_NAME_FILENAME_LENGTH = "filenameLength";
	const PROPERTY_NAME_EXTRA_FIELD_LENGTH = "extraFieldLength";
	const PROPERTY_NAME_UNIX_EXTERNAL_UPPER = "unixExternalUpper";
	const PROPERTY_NAME_FILENAME_UTF8 = "filenameUTF8";
	const PROPERTY_NAME_COMMENT_UTF8 = "commentUTF8";
	const PROPERTY_NAME_RAW_EXTRA_FIELD = "rawExtraField";
	const PROPERTY_NAME_EXTRA_FIELD_ZIP64 = "extraFieldZip64";
	const PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH = "extraFieldUnicodePath";
	const PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT = "extraFieldUnicodeComment";
	const PROPERTY_NAME_EXTRA_FIELD_AES = "extraFieldAES";
	const PROPERTY_NAME_EXTRA_FIELD_NTFS = "extraFieldNTFS";
	const PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP = "extraFieldExtendedTimestamp";
	const PROPERTY_NAME_EXTRA_FIELD_USDZ = "extraFieldUSDZ";

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
		PROPERTY_NAME_RAW_LAST_ACCESS_DATE,
		PROPERTY_NAME_CREATION_DATE,
		PROPERTY_NAME_RAW_CREATION_DATE,
		PROPERTY_NAME_OFFSET,
		PROPERTY_NAME_DISK_NUMBER_START,
		PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES,
		PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES,
		PROPERTY_NAME_DEPRECATED_INTERNAL_FILE_ATTRIBUTES,
		PROPERTY_NAME_DEPRECATED_EXTERNAL_FILE_ATTRIBUTES,
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
		PROPERTY_NAME_SYMLINK,
		PROPERTY_NAME_COMPRESSION_METHOD,
		PROPERTY_NAME_SIGNATURE,
		PROPERTY_NAME_CRC32,
		PROPERTY_NAME_EXTRA_FIELD,
		PROPERTY_NAME_EXTRA_FIELD_UNIX,
		PROPERTY_NAME_EXTRA_FIELD_INFOZIP,
		PROPERTY_NAME_EXTRA_FIELD_UNIX_TYPE1,
		PROPERTY_NAME_EXTRA_FIELD_PKWARE_UNIX,
		PROPERTY_NAME_UID,
		PROPERTY_NAME_GID,
		PROPERTY_NAME_UNIX_MODE,
		PROPERTY_NAME_UNIX_EXTERNAL_UPPER,
		PROPERTY_NAME_SETUID,
		PROPERTY_NAME_SETGID,
		PROPERTY_NAME_STICKY,
		PROPERTY_NAME_BITFLAG,
		PROPERTY_NAME_RAW_BITFLAG,
		PROPERTY_NAME_FILENAME_LENGTH,
		PROPERTY_NAME_EXTRA_FIELD_LENGTH,
		PROPERTY_NAME_FILENAME_UTF8,
		PROPERTY_NAME_COMMENT_UTF8,
		PROPERTY_NAME_RAW_EXTRA_FIELD,
		PROPERTY_NAME_EXTRA_FIELD_ZIP64,
		PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH,
		PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT,
		PROPERTY_NAME_EXTRA_FIELD_AES,
		PROPERTY_NAME_EXTRA_FIELD_NTFS,
		PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP,
		PROPERTY_NAME_EXTRA_FIELD_USDZ
	];

	class Entry {

		constructor(data) {
			PROPERTY_NAMES.forEach(name => this[name] = data[name]);
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
	const ERR_ENTRY_DATA_OUT_OF_BOUNDS = "Entry data out of bounds";
	const ERR_AMBIGUOUS_ARCHIVE = "Ambiguous archive";
	const ERR_ENCRYPTED_CENTRAL_DIRECTORY = "Encrypted central directory is not supported";
	const ERR_UNSAFE_FILENAME = "Unsafe filename";
	const ERR_INVALID_STRICTNESS = "Invalid strictness (must be 'strict', 'balanced' or 'tolerant')";
	const ERR_INVALID_FILENAME_VALIDATION = "Invalid filenameValidation (must be 'strict', 'balanced' or 'tolerant')";
	const ERR_INVALID_MAX_APPENDED_DATA_SIZE = "Invalid maxAppendedDataSize (must be a number greater than or equal to 0)";
	const DRIVE_LETTER_REGEXP = /^[a-zA-Z]:/;
	const CHARSET_UTF8 = "utf-8";
	const PROPERTY_NAME_UTF8_SUFFIX = "UTF8";
	const CHARSET_CP437 = "cp437";
	const BITFLAG_AMBIGUITY_MASK = BITFLAG_ENCRYPTED | BITFLAG_DATA_DESCRIPTOR | BITFLAG_LANG_ENCODING_FLAG;
	const VENDOR_VERSION_AE_1$1 = 1;
	const ZIP64_PROPERTIES = [
		[PROPERTY_NAME_UNCOMPRESSED_SIZE, MAX_32_BITS],
		[PROPERTY_NAME_COMPRESSED_SIZE, MAX_32_BITS],
		[PROPERTY_NAME_OFFSET, MAX_32_BITS],
		[PROPERTY_NAME_DISK_NUMBER_START, MAX_16_BITS]
	];
	const ZIP64_EXTRACTION = {
		[MAX_16_BITS]: {
			getValue: getUint32$1,
			bytes: 4
		},
		[MAX_32_BITS]: {
			getValue: getBigUint64,
			bytes: 8
		}
	};
	const MAX_END_OF_CENTRAL_DIR_PROBES = 64;
	const MAX_DEFLATE_EXPANSION_RATIO = 1032;
	const CENTRAL_DIRECTORY_UNREACHABLE = 0;
	const CENTRAL_DIRECTORY_PLAUSIBLE = 1;
	const CENTRAL_DIRECTORY_REACHABLE = 2;

	class ZipReader {

		constructor(reader, options = {}) {
			Object.assign(this, {
				reader: new GenericReader(reader),
				options,
				readRanges: new Map()
			});
		}

		async* getEntriesGenerator(options = {}) {
			const zipReader = this;
			let { reader } = zipReader;
			await initStream(reader);
			if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
				reader = new BlobReader(await streamToBlob(reader.readable));
				await initStream(reader);
			}
			if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const strictness = getStrictness(options, zipReader.options);
			const checkAmbiguity = strictness == STRICTNESS_STRICT;
			const rejectAmbiguousEndOfDirectory = strictness != STRICTNESS_TOLERANT;
			const maxAppendedDataSize = getMaxAppendedDataSize(getOptionValue$1(zipReader, options, OPTION_MAX_APPENDED_DATA_SIZE), strictness);
			const filenameValidation = getFilenameValidation(getOptionValue$1(zipReader, options, OPTION_FILENAME_VALIDATION), strictness);
			const normalizeFilename = getOptionValue$1(zipReader, options, OPTION_NORMALIZE_FILENAME);
			const { endOfDirectoryInfo, endOfDirectoryReachingEndCount } = await findEndOfCentralDirectory(reader, rejectAmbiguousEndOfDirectory, maxAppendedDataSize);
			if (!endOfDirectoryInfo) {
				if (await startsWithSplitZipSignature$1(reader)) {
					throw new Error(ERR_SPLIT_ZIP_FILE);
				} else {
					throw new Error(ERR_EOCDR_NOT_FOUND);
				}
			}
			if (rejectAmbiguousEndOfDirectory && endOfDirectoryReachingEndCount > 1) {
				throwAmbiguousArchive("multiple end of central directory records");
			}
			const endOfDirectoryView = getDataView(endOfDirectoryInfo);
			let directoryDataLength = getUint32$1(endOfDirectoryView, 12);
			let directoryDataOffset = getUint32$1(endOfDirectoryView, 16);
			const commentOffset = endOfDirectoryInfo.offset;
			const commentLength = getUint16$1(endOfDirectoryView, 20);
			const appendedDataOffset = commentOffset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
			if (reader.size - appendedDataOffset > maxAppendedDataSize) {
				throwAmbiguousArchive("appended data");
			}
			let lastDiskNumber = getUint16$1(endOfDirectoryView, 4);
			const expectedLastDiskNumber = reader.lastDiskNumber || 0;
			let diskNumber = getUint16$1(endOfDirectoryView, 6);
			let filesLength = getUint16$1(endOfDirectoryView, 10);
			let prependedDataLength = 0;
			let startOffset;
			let zip64EndOfDirectory;
			let zip64EndOfDirectoryVersion2;
			let zip64EndOfDirectoryLength = ZIP64_END_OF_CENTRAL_DIR_LENGTH;
			let directoryEncryptionInfo;
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
					getUint32$1(endOfDirectoryLocatorView, 0) == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
					directoryDataOffset = getDiskOffset$1(reader, getUint32$1(endOfDirectoryLocatorView, 4)) + getBigUint64(endOfDirectoryLocatorView, 8);
					let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
					let endOfDirectoryView = getDataView(endOfDirectoryArray);
					const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
					if ((endOfDirectoryArray.length < ZIP64_END_OF_CENTRAL_DIR_LENGTH || getUint32$1(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) &&
						directoryDataOffset != expectedDirectoryDataOffset && expectedDirectoryDataOffset >= 0) {
						const originalDirectoryDataOffset = directoryDataOffset;
						directoryDataOffset = expectedDirectoryDataOffset;
						if (directoryDataOffset > originalDirectoryDataOffset) {
							prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
						}
						endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
						endOfDirectoryView = getDataView(endOfDirectoryArray);
					}
					if (endOfDirectoryArray.length < ZIP64_END_OF_CENTRAL_DIR_LENGTH || getUint32$1(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
						throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
					}
					zip64EndOfDirectory = true;
					zip64EndOfDirectoryVersion2 = getBigUint64(endOfDirectoryView, 4) > ZIP64_END_OF_CENTRAL_DIR_LENGTH - 12;
					if (zip64EndOfDirectoryVersion2) {
						const extensibleDataLength = Math.min(
							Number(getBigUint64(endOfDirectoryView, 4)) - (ZIP64_END_OF_CENTRAL_DIR_LENGTH - 12),
							reader.size - directoryDataOffset - ZIP64_END_OF_CENTRAL_DIR_LENGTH);
						if (extensibleDataLength > 0) {
							zip64EndOfDirectoryLength += extensibleDataLength;
							const rawExtensibleData = await readUint8Array(reader, directoryDataOffset + ZIP64_END_OF_CENTRAL_DIR_LENGTH, extensibleDataLength);
							directoryEncryptionInfo = getDirectoryEncryptionInfo(rawExtensibleData);
						}
					}
					if (lastDiskNumber == MAX_16_BITS) {
						lastDiskNumber = getUint32$1(endOfDirectoryView, 16);
					} else if (checkAmbiguity && lastDiskNumber != getUint32$1(endOfDirectoryView, 16)) {
						throwAmbiguousArchive("mismatched zip64 end of central directory record");
					}
					if (diskNumber == MAX_16_BITS) {
						diskNumber = getUint32$1(endOfDirectoryView, 20);
					} else if (checkAmbiguity && diskNumber != getUint32$1(endOfDirectoryView, 20)) {
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
			let declaredDirectoryDataLength = directoryDataLength;
			const centralDirectoryEndOffset = endOfDirectoryInfo.offset -
				(zip64EndOfDirectory ? zip64EndOfDirectoryLength + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH : 0);
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
					const storedPointsAtDirectory = getUint32$1(directoryView, offset) == CENTRAL_FILE_HEADER_SIGNATURE ||
						Boolean(directoryEncryptionInfo && directoryEncryptionInfo.compressedSize) ||
						detectEncryptedCentralDirectory(directoryView);
					let reconcile = !storedPointsAtDirectory;
					if (!reconcile && expectedDirectoryDataOffset >= 0 && expectedDirectoryDataOffset + 4 <= reader.size) {
						const expectedSignatureArray = await readUint8Array(reader, expectedDirectoryDataOffset, 4);
						reconcile = getUint32$1(getDataView(expectedSignatureArray), 0) == CENTRAL_FILE_HEADER_SIGNATURE;
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
			zipReader.directoryOffset = directoryDataOffset;
			zipReader.directoryLength = declaredDirectoryDataLength;
			const decryptCentralDirectory = getFunctionOptionValue$1(zipReader, options, OPTION_DECRYPT_CENTRAL_DIRECTORY);
			let decryptedDirectory, dataAfterEncryptedDirectory;
			if (decryptCentralDirectory && filesLength && directoryArray.length >= 4 &&
				getUint32$1(directoryView, 0) != CENTRAL_FILE_HEADER_SIGNATURE &&
				(zip64EndOfDirectoryVersion2 || detectEncryptedCentralDirectory(directoryView))) {
				const encryptedDirectoryDataLength = getEncryptedDirectoryDataLength(directoryEncryptionInfo, declaredDirectoryDataLength, directoryArray.length);
				dataAfterEncryptedDirectory = directoryArray.subarray(encryptedDirectoryDataLength);
				directoryArray = await decryptCentralDirectory(directoryArray.subarray(0, encryptedDirectoryDataLength), directoryEncryptionInfo);
				directoryView = getDataView(directoryArray);
				declaredDirectoryDataLength = directoryArray.length;
				decryptedDirectory = true;
			}
			startOffset = directoryDataOffset;
			const filenameEncoding = getOptionValue$1(zipReader, options, OPTION_FILENAME_ENCODING);
			const commentEncoding = getOptionValue$1(zipReader, options, OPTION_COMMENT_ENCODING);
			const filenames = checkAmbiguity ? new Set() : UNDEFINED_VALUE;
			let duplicateFilename;
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const fileEntry = new ZipEntry$1(reader, zipReader.options);
				if (offset + CENTRAL_FILE_HEADER_LENGTH > directoryArray.length || getUint32$1(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
					if (indexFile == 0 && !decryptedDirectory && (zip64EndOfDirectoryVersion2 || detectEncryptedCentralDirectory(directoryView))) {
						throw new Error(ERR_ENCRYPTED_CENTRAL_DIRECTORY);
					}
					throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
				}
				readCommonHeader(fileEntry, directoryView, offset + 6);
				const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
				const filenameOffset = offset + CENTRAL_FILE_HEADER_LENGTH;
				const extraFieldOffset = filenameOffset + fileEntry.filenameLength;
				const commentOffset = extraFieldOffset + fileEntry.extraFieldLength;
				const versionMadeBy = getUint16$1(directoryView, offset + 4);
				const msDosCompatible = versionMadeBy >> 8 == 0;
				const unixCompatible = versionMadeBy >> 8 == 3;
				const rawFilename = directoryArray.subarray(filenameOffset, extraFieldOffset);
				const commentLength = getUint16$1(directoryView, offset + 32);
				const endOffset = commentOffset + commentLength;
				const rawComment = directoryArray.subarray(commentOffset, endOffset);
				const filenameUTF8 = languageEncodingFlag;
				const commentUTF8 = languageEncodingFlag;
				const externalFileAttributes = getUint32$1(directoryView, offset + 38);
				const msdosAttributesRaw = externalFileAttributes & MAX_8_BITS;
				const msdosAttributes = {
					readOnly: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_READONLY_MASK),
					hidden: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_HIDDEN_MASK),
					system: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_SYSTEM_MASK),
					directory: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_DIR_MASK),
					archive: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_ARCHIVE_MASK)
				};
				const offsetFileEntry = getUint32$1(directoryView, offset + 42);
				const decode = getFunctionOptionValue$1(zipReader, options, OPTION_DECODE_TEXT) || decodeText;
				const rawFilenameEncoding = filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437;
				const rawCommentEncoding = commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437;
				let filename = decode(rawFilename, rawFilenameEncoding, TEXT_TYPE_FILENAME);
				if (filename === UNDEFINED_VALUE) {
					filename = decodeText(rawFilename, rawFilenameEncoding);
				}
				if (normalizeFilename) {
					const normalizedFilename = normalizeFilename(filename);
					if (normalizedFilename !== UNDEFINED_VALUE) {
						filename = normalizedFilename;
					}
				}
				if (isUnsafeFilename(filename, filenameValidation)) {
					const error = new Error(ERR_UNSAFE_FILENAME);
					error.filename = filename;
					throw error;
				}
				let comment = decode(rawComment, rawCommentEncoding, TEXT_TYPE_COMMENT);
				if (comment === UNDEFINED_VALUE) {
					comment = decodeText(rawComment, rawCommentEncoding);
				}
				Object.assign(fileEntry, {
					index: indexFile,
					decryptedDirectory,
					versionMadeBy,
					msDosCompatible,
					zip64: false,
					compressedSize: 0,
					uncompressedSize: 0,
					commentLength,
					offset: offsetFileEntry,
					diskNumberStart: getUint16$1(directoryView, offset + 34),
					internalFileAttributes: getUint16$1(directoryView, offset + 36),
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
				const unixType = fileEntry.unixMode === UNDEFINED_VALUE ? unixExternalUpper : fileEntry.unixMode;
				const symlink = (unixType & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_SYMLINK;
				const executable = !symlink && ((fileEntry.unixMode !== UNDEFINED_VALUE)
					? ((fileEntry.unixMode & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0)
					: (unixCompatible && ((unixExternalUpper & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0)));
				const modeIsDir = fileEntry.unixMode !== UNDEFINED_VALUE && ((fileEntry.unixMode & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR);
				const upperIsDir = ((unixExternalUpper & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR);
				Object.assign(fileEntry, {
					setuid,
					setgid,
					sticky,
					symlink,
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
					const arrayBufferPromise = streamToBlob(writer.readable).then(blob => blob.arrayBuffer());
					arrayBufferPromise.catch(() => { });
					await fileEntry.getData(writer, entry, zipReader.readRanges, options);
					return arrayBufferPromise;
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
			let offsetAfterSignature = offset;
			const digitalSignature = readDigitalSignature(directoryArray.subarray(offset)) ||
				(decryptedDirectory ? readDigitalSignature(dataAfterEncryptedDirectory) : UNDEFINED_VALUE);
			if (digitalSignature) {
				zipReader.digitalSignature = digitalSignature;
				offsetAfterSignature = offset + 6 + digitalSignature.length;
			}
			if (checkAmbiguity && offset != declaredDirectoryDataLength && offsetAfterSignature != declaredDirectoryDataLength) {
				throwAmbiguousArchive("trailing central directory data");
			}
			if (duplicateFilename) {
				throwAmbiguousArchive("duplicate filename");
			}
			const extractPrependedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_PREPENDED_DATA);
			const extractAppendedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_APPENDED_DATA);
			const splitZipSignatureLength = (checkAmbiguity || extractPrependedData) && filesLength &&
				startOffset == SPLIT_ZIP_FILE_SIGNATURE_LENGTH && await startsWithSplitZipMarker(reader) ? SPLIT_ZIP_FILE_SIGNATURE_LENGTH : 0;
			if (checkAmbiguity && (prependedDataLength || (filesLength && startOffset > splitZipSignatureLength))) {
				throwAmbiguousArchive("prepended data");
			}
			if (extractPrependedData) {
				zipReader.prependedData = startOffset > splitZipSignatureLength ?
					await readUint8Array(reader, splitZipSignatureLength, startOffset - splitZipSignatureLength) :
					EMPTY_UINT8_ARRAY;
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
			const { reader } = this;
			if (!reader.readUint8Array && reader.readable && !reader.readable.locked) {
				await reader.readable.cancel();
			}
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

	let ZipEntry$1 = class ZipEntry {

		constructor(reader, options) {
			Object.assign(this, {
				reader,
				options
			});
		}

		async getData(writer, fileEntry, readRanges, options = {}) {
			const zipEntry = this;
			const config = getConfiguration();
			const {
				reader,
				index,
				offset,
				diskNumberStart,
				extraFieldAES,
				extraFieldZip64,
				compressionMethod,
				bitFlag,
				rawBitFlag,
				crc32,
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
			checkPasswordOption(password, rawPassword);
			password = password && password.length && password;
			rawPassword = rawPassword && rawPassword.length && rawPassword;
			if (extraFieldAES) {
				if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
					throw new Error(ERR_UNSUPPORTED_COMPRESSION$1);
				}
			}
			if (dataArray.length < HEADER_SIZE || getUint32$1(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
				throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
			}
			readCommonHeader(localDirectory, dataView, 4);
			const {
				extraFieldLength,
				filenameLength
			} = localDirectory;
			const checkLocalDirectoryOption = getOptionValue$1(zipEntry, options, OPTION_CHECK_LOCAL_DIRECTORY);
			const entryStrictness = getStrictness(options, zipEntry.options);
			const checkLocalDirectory = getCheckLocalDirectory(checkLocalDirectoryOption, entryStrictness);
			const checkLocalFilename = getCheckLocalFilename(checkLocalDirectoryOption, entryStrictness);
			let rawLocalFilename = EMPTY_UINT8_ARRAY;
			if (checkLocalFilename && (filenameLength || extraFieldLength)) {
				const trailingDataArray = await readUint8Array(reader, localHeaderOffset + HEADER_SIZE, filenameLength + extraFieldLength);
				rawLocalFilename = trailingDataArray.subarray(0, filenameLength);
				localDirectory.rawExtraField = trailingDataArray.subarray(filenameLength);
			} else {
				localDirectory.rawExtraField = extraFieldLength ?
					await readUint8Array(reader, localHeaderOffset + HEADER_SIZE + filenameLength, extraFieldLength) :
					EMPTY_UINT8_ARRAY;
			}
			if (checkLocalFilename) {
				localDirectory.rawFilename = rawLocalFilename;
			}
			readCommonFooter(zipEntry, localDirectory, dataView, 4, true);
			if (checkLocalDirectory) {
				validateLocalDirectory(zipEntry, localDirectory, rawLocalFilename, checkLocalFilename);
			}
			const { lastAccessDate, creationDate, uid, gid } = localDirectory;
			if (lastAccessDate) {
				fileEntry.lastAccessDate = lastAccessDate;
			}
			if (creationDate) {
				fileEntry.creationDate = creationDate;
			}
			if (uid !== UNDEFINED_VALUE && fileEntry.uid === UNDEFINED_VALUE) {
				fileEntry.uid = uid;
			}
			if (gid !== UNDEFINED_VALUE && fileEntry.gid === UNDEFINED_VALUE) {
				fileEntry.gid = gid;
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
			if (dataOffset + compressedSize > reader.size) {
				throw new Error(ERR_ENTRY_DATA_OUT_OF_BOUNDS);
			}
			const size = compressedSize;
			const readable = toCompatibleReadable(reader.createReadable({ offset: dataOffset, size }));
			const signal = checkSignalOption(getOptionValue$1(zipEntry, options, OPTION_SIGNAL));
			const checkPasswordOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_PASSWORD_ONLY);
			let checkOverlappingEntry = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY);
			const checkOverlappingEntryOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY);
			if (checkOverlappingEntryOnly) {
				checkOverlappingEntry = true;
			}
			const { onstart, onprogress, onend } = options;
			const compressed = compressionMethod != COMPRESSION_METHOD_STORE && !passThrough;
			const outputSize = passThrough ? compressedSize : uncompressedSize;
			const deflate64 = compressionMethod == COMPRESSION_METHOD_DEFLATE_64;
			let useCompressionStream = getOptionValue$1(zipEntry, options, OPTION_USE_COMPRESSION_STREAM);
			if (deflate64) {
				useCompressionStream = false;
			}
			const checkCrc32Option = getOptionValue$1(zipEntry, options, OPTION_CHECK_CRC32);
			const checkCrc32 = (checkCrc32Option === UNDEFINED_VALUE ?
				getOptionValue$1(zipEntry, options, OPTION_CHECK_SIGNATURE) :
				checkCrc32Option) && !passThrough &&
				(!encrypted || zipCrypto || (extraFieldAES && extraFieldAES.vendorVersion == VENDOR_VERSION_AE_1$1));
			const workerOptions = {
				options: {
					codecType: CODEC_INFLATE,
					password,
					rawPassword,
					zipCrypto,
					encryptionStrength: extraFieldAES && extraFieldAES.strength,
					checkCrc32,
					checkAuthenticationCode: getOptionValue$1(zipEntry, options, OPTION_CHECK_AUTHENTICATION_CODE),
					passwordVerification: zipCrypto && (dataDescriptor ? ((rawLastModDate >>> 8) & MAX_8_BITS) : ((crc32 >>> 24) & MAX_8_BITS)),
					outputSize,
					crc32,
					compressed,
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
					crc32,
					compressedSize,
					uncompressedSize,
					dataOffset,
					dataDescriptor: dataDescriptor || localDirectory.bitFlag.dataDescriptor,
					extraFieldZip64: extraFieldZip64 || localDirectory.extraFieldZip64,
					readRanges
				});
			}
			let writable, abortError;
			try {
				if (!checkOverlappingEntryOnly) {
					if (checkPasswordOnly) {
						writer = new WritableStream();
					}
					writer = new GenericWriter(writer);
					await initStream(writer, getDecodableOutputSize(outputSize, compressedSize, compressed));
					({ writable } = writer);
					const { outputSize: writtenSize } = await runWorker({ readable, writable }, workerOptions);
					writer.size += writtenSize;
					if (writtenSize != outputSize) {
						throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
					}
				}
			} catch (error) {
				if (error.outputSize !== UNDEFINED_VALUE) {
					writer.size += error.outputSize;
				}
				if (!checkPasswordOnly || error.message != ERR_ABORT_CHECK_PASSWORD) {
					abortError = error;
					throw error;
				}
			} finally {
				const preventClose = !ownsWritable(writer) && getOptionValue$1(zipEntry, options, OPTION_PREVENT_CLOSE);
				if (!preventClose && writable && !writable.locked) {
					const writableWriter = writable.getWriter();
					if (abortError) {
						try {
							await writableWriter.abort(abortError);
						} catch {
							// the error being propagated is more relevant; ignored
						}
					} else {
						await writableWriter.close();
					}
				}
			}
			return checkPasswordOnly || checkOverlappingEntryOnly ? UNDEFINED_VALUE : writer.getData ? writer.getData() : writable;
		}
	};

	function detectEncryptedCentralDirectory(directoryView) {
		const maxOffset = Math.min(directoryView.byteLength, 1024) - 3;
		for (let offset = 0; offset < maxOffset; offset++) {
			if (getUint32$1(directoryView, offset) == ARCHIVE_EXTRA_DATA_SIGNATURE) {
				return true;
			}
		}
		return false;
	}

	function readDigitalSignature(signatureRecordArray) {
		if (signatureRecordArray.length >= 6) {
			const signatureRecordView = getDataView(signatureRecordArray);
			if (getUint32$1(signatureRecordView, 0) == DIGITAL_SIGNATURE_RECORD_SIGNATURE) {
				const signatureDataLength = getUint16$1(signatureRecordView, 4);
				if (6 + signatureDataLength <= signatureRecordArray.length) {
					return signatureRecordArray.subarray(6, 6 + signatureDataLength);
				}
			}
		}
	}

	function getEncryptedDirectoryDataLength(directoryEncryptionInfo, declaredDirectoryDataLength, directoryDataLength) {
		const encryptedDirectoryDataLength = directoryEncryptionInfo && directoryEncryptionInfo.compressedSize ?
			directoryEncryptionInfo.compressedSize :
			declaredDirectoryDataLength;
		return encryptedDirectoryDataLength > 0 && encryptedDirectoryDataLength <= directoryDataLength ?
			encryptedDirectoryDataLength :
			directoryDataLength;
	}

	function getDirectoryEncryptionInfo(rawExtensibleData) {
		const directoryEncryptionInfo = { rawExtensibleData };
		if (rawExtensibleData.length >= 28) {
			const extensibleDataView = getDataView(rawExtensibleData);
			const hashDataLength = getUint16$1(extensibleDataView, 26);
			Object.assign(directoryEncryptionInfo, {
				compressionMethod: getUint16$1(extensibleDataView, 0),
				compressedSize: Number(getBigUint64(extensibleDataView, 2)),
				uncompressedSize: Number(getBigUint64(extensibleDataView, 10)),
				encryptionAlgorithm: getUint16$1(extensibleDataView, 18),
				bitLength: getUint16$1(extensibleDataView, 20),
				flags: getUint16$1(extensibleDataView, 22),
				hashAlgorithm: getUint16$1(extensibleDataView, 24),
				hashData: rawExtensibleData.subarray(28, 28 + hashDataLength)
			});
		}
		return directoryEncryptionInfo;
	}

	function readCommonHeader(directory, dataView, offset) {
		const rawBitFlag = directory.rawBitFlag = getUint16$1(dataView, offset + 2);
		const encrypted = (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED;
		const rawLastModDate = getUint32$1(dataView, offset + 6);
		Object.assign(directory, {
			encrypted,
			version: getUint16$1(dataView, offset),
			bitFlag: {
				level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
				dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
				languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
			},
			rawLastModDate,
			lastModDate: getDate(rawLastModDate),
			filenameLength: getUint16$1(dataView, offset + 22),
			extraFieldLength: getUint16$1(dataView, offset + 24)
		});
	}

	function readCommonFooter(fileEntry, directory, dataView, offset, localDirectory) {
		const { rawExtraField } = directory;
		const extraField = directory.extraField = new Map();
		const rawExtraFieldView = getDataView(rawExtraField);
		let offsetExtraField = 0;
		try {
			while (offsetExtraField < rawExtraField.length) {
				const type = getUint16$1(rawExtraFieldView, offsetExtraField);
				const size = getUint16$1(rawExtraFieldView, offsetExtraField + 2);
				extraField.set(type, {
					type,
					data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
				});
				offsetExtraField += 4 + size;
			}
		} catch {
			// ignored
		}
		const compressionMethod = getUint16$1(dataView, offset + 4);
		Object.assign(directory, {
			signature: getUint32$1(dataView, offset + HEADER_OFFSET_SIGNATURE),
			crc32: getUint32$1(dataView, offset + HEADER_OFFSET_SIGNATURE),
			compressedSize: getUint32$1(dataView, offset + HEADER_OFFSET_COMPRESSED_SIZE),
			uncompressedSize: getUint32$1(dataView, offset + HEADER_OFFSET_UNCOMPRESSED_SIZE)
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
		const extraFieldPkwareUnix = extraField.get(EXTRAFIELD_TYPE_PKWARE_UNIX);
		if (extraFieldPkwareUnix) {
			readExtraFieldUnixDates(extraFieldPkwareUnix, directory);
			directory.extraFieldPkwareUnix = extraFieldPkwareUnix;
		}
		const extraFieldUnixType1 = extraField.get(EXTRAFIELD_TYPE_UNIX_TYPE1);
		if (extraFieldUnixType1) {
			readExtraFieldUnixDates(extraFieldUnixType1, directory);
			directory.extraFieldUnixType1 = extraFieldUnixType1;
		}
		const extraFieldNTFS = extraField.get(EXTRAFIELD_TYPE_NTFS);
		if (extraFieldNTFS) {
			readExtraFieldNTFS(extraFieldNTFS, directory);
			directory.extraFieldNTFS = extraFieldNTFS;
		}
		const extraFieldUnix = extraField.get(EXTRAFIELD_TYPE_UNIX);
		let unixIdsRead;
		if (extraFieldUnix) {
			unixIdsRead = readExtraFieldUnix(extraFieldUnix, directory, false);
			directory.extraFieldUnix = extraFieldUnix;
		}
		if (!unixIdsRead) {
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
		const computedCrc32 = new Crc32();
		computedCrc32.append(fileEntry[rawPropertyName]);
		const computedCrc32View = getDataView(new Uint8Array(4));
		computedCrc32View.setUint32(0, computedCrc32.get(), true);
		const nameCrc32 = getUint32$1(extraFieldView, 1);
		Object.assign(extraFieldUnicode, {
			version: getUint8(extraFieldView, 0),
			[propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
			valid: !fileEntry.bitFlag.languageEncodingFlag && nameCrc32 == getUint32$1(computedCrc32View, 0)
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
			compressionMethod: getUint16$1(extraFieldView, 5)
		});
		directory.compressionMethod = extraFieldAES.compressionMethod;
		if (extraFieldAES.vendorVersion != VENDOR_VERSION_AE_1$1) {
			directory.crc32 = UNDEFINED_VALUE;
		}
	}

	function readExtraFieldNTFS(extraFieldNTFS, directory) {
		const extraFieldView = getDataView(extraFieldNTFS.data);
		let offsetExtraField = 4;
		let tag1Data;
		try {
			while (offsetExtraField < extraFieldNTFS.data.length && !tag1Data) {
				const tagValue = getUint16$1(extraFieldView, offsetExtraField);
				const attributeSize = getUint16$1(extraFieldView, offsetExtraField + 2);
				if (tagValue == EXTRAFIELD_TYPE_NTFS_TAG1) {
					tag1Data = extraFieldNTFS.data.slice(offsetExtraField + 4, offsetExtraField + 4 + attributeSize);
				}
				offsetExtraField += 4 + attributeSize;
			}
		} catch {
			// ignored
		}
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
			Object.assign(directory, extraFieldData, { rawLastAccessDate, rawCreationDate });
		}
	}

	function readExtraFieldUnixDates(extraField, directory) {
		if (extraField.data.length < 8) {
			return;
		}
		const extraFieldView = getDataView(extraField.data);
		const lastAccessDate = new Date((getUint32$1(extraFieldView, 0) | 0) * 1000);
		const lastModDate = new Date((getUint32$1(extraFieldView, 4) | 0) * 1000);
		const extraFieldData = { lastAccessDate, lastModDate };
		if (extraField.data.length >= 12) {
			extraFieldData.uid = getUint16$1(extraFieldView, 8);
			extraFieldData.gid = getUint16$1(extraFieldView, 10);
		}
		Object.assign(extraField, extraFieldData);
		Object.assign(directory, extraFieldData);
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
				uid = getUint16$1(view, 0);
				gid = getUint16$1(view, 2);
				Object.assign(extraField, { uid, gid });
			}
			if (uid !== UNDEFINED_VALUE) {
				directory.uid = uid;
			}
			if (gid !== UNDEFINED_VALUE) {
				directory.gid = gid;
			}
			return uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE;
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
				const time = getUint32$1(extraFieldView, offset);
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
		crc32,
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
			const dataDescriptorView = getDataView(dataDescriptorArray);
			let signature = dataDescriptorArray.length == dataDescriptorLength + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH &&
				getUint32$1(dataDescriptorView, 0) == DATA_DESCRIPTOR_RECORD_SIGNATURE;
			if (signature) {
				const signedDataDescriptor = readDataDescriptor(dataDescriptorView, DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH, extraFieldZip64);
				const matchCrc32 = (fileEntry.encrypted && !fileEntry.zipCrypto) || signedDataDescriptor.crc32 == crc32;
				if (matchCrc32 &&
					signedDataDescriptor.compressedSize == compressedSize &&
					signedDataDescriptor.uncompressedSize == uncompressedSize) {
					dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
				} else {
					signature = false;
				}
			}
			if (dataDescriptorArray.length >= dataDescriptorLength) {
				const localDataDescriptor = readDataDescriptor(dataDescriptorView, signature ? DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH : 0, extraFieldZip64);
				localDataDescriptor.signature = signature;
				fileEntry.localDirectory.dataDescriptor = localDataDescriptor;
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

	function readDataDescriptor(dataDescriptorView, offset, extraFieldZip64) {
		const crc32 = getUint32$1(dataDescriptorView, offset);
		let compressedSize;
		let uncompressedSize;
		if (extraFieldZip64) {
			compressedSize = getBigUint64(dataDescriptorView, offset + 4);
			uncompressedSize = getBigUint64(dataDescriptorView, offset + 12);
		} else {
			compressedSize = getUint32$1(dataDescriptorView, offset + 4);
			uncompressedSize = getUint32$1(dataDescriptorView, offset + 8);
		}
		return { crc32, compressedSize, uncompressedSize };
	}

	function getDiskOffset$1(reader, diskNumber) {
		return reader.getDiskOffset ? reader.getDiskOffset(diskNumber) : 0;
	}

	async function startsWithSplitZipSignature$1(reader) {
		return await getFirstSignature(reader) == SPLIT_ZIP_FILE_SIGNATURE;
	}

	async function startsWithSplitZipMarker(reader) {
		const signature = await getFirstSignature(reader);
		return signature == SPLIT_ZIP_FILE_SIGNATURE || signature == TEMPORARY_SPLIT_ZIP_FILE_SIGNATURE;
	}

	async function getFirstSignature(reader) {
		const signatureArray = await readUint8Array(reader, 0, SPLIT_ZIP_FILE_SIGNATURE_LENGTH);
		return getUint32$1(getDataView(signatureArray));
	}

	function isStrictnessValue(value) {
		return value === STRICTNESS_STRICT || value === STRICTNESS_BALANCED || value === STRICTNESS_TOLERANT;
	}

	function getDecodableOutputSize(outputSize, compressedSize, compressed) {
		return Math.min(outputSize, compressed ? compressedSize * MAX_DEFLATE_EXPANSION_RATIO : compressedSize);
	}

	function getStrictness(options, inheritedOptions) {
		return resolveStrictness(options, resolveStrictness(inheritedOptions, STRICTNESS_BALANCED));
	}

	function resolveStrictness(options, inheritedStrictness) {
		const strictness = options[OPTION_STRICTNESS];
		if (strictness !== UNDEFINED_VALUE) {
			if (!isStrictnessValue(strictness)) {
				throw new Error(ERR_INVALID_STRICTNESS);
			}
			return strictness;
		}
		const checkAmbiguity = options[OPTION_CHECK_AMBIGUITY];
		if (checkAmbiguity === UNDEFINED_VALUE) {
			return inheritedStrictness;
		}
		if (checkAmbiguity) {
			return STRICTNESS_STRICT;
		}
		return inheritedStrictness == STRICTNESS_TOLERANT ? STRICTNESS_TOLERANT : STRICTNESS_BALANCED;
	}

	function getCheckLocalDirectory(checkLocalDirectory, strictness) {
		if (checkLocalDirectory === UNDEFINED_VALUE) {
			return strictness != STRICTNESS_TOLERANT;
		}
		return Boolean(checkLocalDirectory);
	}

	function getCheckLocalFilename(checkLocalFilename, strictness) {
		if (checkLocalFilename === UNDEFINED_VALUE) {
			return strictness == STRICTNESS_STRICT;
		}
		return Boolean(checkLocalFilename);
	}

	function getFilenameValidation(filenameValidation, strictness) {
		if (filenameValidation === UNDEFINED_VALUE) {
			return strictness;
		}
		if (!isStrictnessValue(filenameValidation)) {
			throw new Error(ERR_INVALID_FILENAME_VALIDATION);
		}
		return filenameValidation;
	}

	function isUnsafeFilename(filename, filenameValidation) {
		if (filenameValidation == STRICTNESS_TOLERANT) {
			return false;
		}
		const pathParts = filename.split("/");
		if (pathParts.length > 1 && pathParts[pathParts.length - 1] === "") {
			pathParts.pop();
		}
		if (pathParts.includes("..") || filename.startsWith("/") || filename.startsWith("\\\\") || DRIVE_LETTER_REGEXP.test(filename)) {
			return true;
		}
		return filenameValidation == STRICTNESS_STRICT && (pathParts.includes(".") || pathParts.includes(""));
	}

	function getMaxAppendedDataSize(maxAppendedDataSize, strictness) {
		if (maxAppendedDataSize !== UNDEFINED_VALUE) {
			const size = toNumber(maxAppendedDataSize);
			if (typeof size != NUMBER_TYPE || Number.isNaN(size) || size < 0) {
				throw new Error(ERR_INVALID_MAX_APPENDED_DATA_SIZE);
			}
			return size;
		}
		if (strictness == STRICTNESS_STRICT) {
			return 0;
		}
		if (strictness == STRICTNESS_TOLERANT) {
			return Infinity;
		}
		return MAX_16_BITS;
	}

	async function findEndOfCentralDirectory(reader, rejectAmbiguous, maxAppendedDataSize) {
		const { size } = reader;
		const anchoredLength = Math.min(size, END_OF_CENTRAL_DIR_LENGTH + MAX_16_BITS);
		const remoteProbeBudget = { count: MAX_END_OF_CENTRAL_DIR_PROBES };
		let endOfDirectoryInfo;
		let plausibleEndOfDirectoryInfo;
		let endOfDirectoryReachingEndCount = 0;
		for await (const [anchoredView, anchoredOffset, anchoredArray, indexByte, offset] of scanEndOfCentralDirectory(reader, anchoredLength)) {
			const commentLength = getUint16$1(anchoredView, indexByte + 20);
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
			if (getUint32$1(scanView, indexByte) == END_OF_CENTRAL_DIR_SIGNATURE) {
				yield [scanView, scanOffset, scanArray, indexByte, scanOffset + indexByte];
			}
		}
	}

	function getEndOfCentralDirectoryInfo(scanArray, indexByte, offset) {
		return { offset, buffer: scanArray.slice(indexByte, indexByte + END_OF_CENTRAL_DIR_LENGTH).buffer };
	}

	async function getCentralDirectoryReachability(reader, view, anchoredOffset, indexByte, offset, size, remoteProbeBudget) {
		const filesLength = getUint16$1(view, indexByte + 10);
		const directoryDataLength = getUint32$1(view, indexByte + 12);
		const directoryDataOffset = getUint32$1(view, indexByte + 16);
		if (filesLength == MAX_16_BITS || directoryDataLength == MAX_32_BITS || directoryDataOffset == MAX_32_BITS) {
			const locatorSignature = await readSignature(reader, view, anchoredOffset, offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, size, remoteProbeBudget);
			return locatorSignature == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE ? CENTRAL_DIRECTORY_REACHABLE : CENTRAL_DIRECTORY_UNREACHABLE;
		}
		if (!filesLength && !directoryDataLength) {
			return CENTRAL_DIRECTORY_PLAUSIBLE;
		}
		const directoryDiskNumber = getUint16$1(view, indexByte + 6);
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
			return getUint32$1(view, signatureOffset - anchoredOffset);
		}
		if (remoteProbeBudget.count > 0) {
			remoteProbeBudget.count--;
			const signatureArray = await readUint8Array(reader, signatureOffset, 4);
			return getUint32$1(getDataView(signatureArray), 0);
		}
		return UNDEFINED_VALUE;
	}

	function validateLocalDirectory(zipEntry, localDirectory, rawLocalFilename, checkLocalFilename) {
		const { rawFilename } = zipEntry;
		const maskedLocalDirectory = zipEntry.decryptedDirectory &&
			(localDirectory.rawBitFlag & BITFLAG_MASKED_LOCAL_HEADERS) == BITFLAG_MASKED_LOCAL_HEADERS;
		if (checkLocalFilename && !maskedLocalDirectory &&
			(rawLocalFilename.length != rawFilename.length ||
				rawLocalFilename.some((byteValue, indexByte) => byteValue != rawFilename[indexByte]))) {
			throwAmbiguousArchive("mismatched local file header (filename)");
		}
		if ((localDirectory.rawBitFlag & BITFLAG_AMBIGUITY_MASK) != (zipEntry.rawBitFlag & BITFLAG_AMBIGUITY_MASK)) {
			throwAmbiguousArchive("mismatched local file header (general purpose bit flag)");
		}
		if (localDirectory.compressionMethod != zipEntry.compressionMethod) {
			throwAmbiguousArchive("mismatched local file header (compression method)");
		}
		if (!localDirectory.bitFlag.dataDescriptor && !maskedLocalDirectory &&
			(localDirectory.crc32 || localDirectory.compressedSize || localDirectory.uncompressedSize) &&
			(localDirectory.crc32 != zipEntry.crc32 ||
				localDirectory.compressedSize != zipEntry.compressedSize ||
				localDirectory.uncompressedSize != zipEntry.uncompressedSize)) {
			throwAmbiguousArchive("mismatched local file header (crc32 or sizes)");
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

	function getFunctionOptionValue$1(zipReader, options, name) {
		return checkFunctionOption(getOptionValue$1(zipReader, options, name));
	}


	function getDate(timeRaw) {
		const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & MAX_16_BITS;
		return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
	}

	function getDateNTFS(timeRaw) {
		return new Date((Number((timeRaw / BigInt(10000)) - BigInt(11644473600000))));
	}

	function getUint8(view, offset) {
		return view.getUint8(offset);
	}

	function getUint16$1(view, offset) {
		return view.getUint16(offset, true);
	}

	function getUint32$1(view, offset) {
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
		ERR_ENTRY_DATA_OUT_OF_BOUNDS: ERR_ENTRY_DATA_OUT_OF_BOUNDS,
		ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND: ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND,
		ERR_EOCDR_NOT_FOUND: ERR_EOCDR_NOT_FOUND,
		ERR_EXTRAFIELD_ZIP64_NOT_FOUND: ERR_EXTRAFIELD_ZIP64_NOT_FOUND,
		ERR_INVALID_AUTHENTICATION_CODE: ERR_INVALID_AUTHENTICATION_CODE,
		ERR_INVALID_COMPRESSED_DATA: ERR_INVALID_COMPRESSED_DATA,
		ERR_INVALID_CRC32: ERR_INVALID_CRC32,
		ERR_INVALID_FILENAME_VALIDATION: ERR_INVALID_FILENAME_VALIDATION,
		ERR_INVALID_MAX_APPENDED_DATA_SIZE: ERR_INVALID_MAX_APPENDED_DATA_SIZE,
		ERR_INVALID_PASSWORD: ERR_INVALID_PASSWORD,
		ERR_INVALID_SIGNATURE: ERR_INVALID_SIGNATURE,
		ERR_INVALID_STRICTNESS: ERR_INVALID_STRICTNESS,
		ERR_INVALID_UNCOMPRESSED_SIZE: ERR_INVALID_UNCOMPRESSED_SIZE,
		ERR_LOCAL_FILE_HEADER_NOT_FOUND: ERR_LOCAL_FILE_HEADER_NOT_FOUND,
		ERR_OVERLAPPING_ENTRY: ERR_OVERLAPPING_ENTRY,
		ERR_SPLIT_ZIP_FILE: ERR_SPLIT_ZIP_FILE,
		ERR_UNSAFE_FILENAME: ERR_UNSAFE_FILENAME,
		ERR_UNSUPPORTED_COMPRESSION: ERR_UNSUPPORTED_COMPRESSION$1,
		ERR_UNSUPPORTED_ENCRYPTION: ERR_UNSUPPORTED_ENCRYPTION,
		ERR_WORKER_STARTUP_TIMEOUT: ERR_WORKER_STARTUP_TIMEOUT,
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
	const ERR_INVALID_COMMENT_TYPE = "Invalid zip file comment (must be a Uint8Array)";
	const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
	const ERR_INVALID_ENTRY_COMMENT_TYPE = "Invalid file entry comment (must be a string)";
	const ERR_INVALID_DATE = "Invalid date (must be a valid Date instance)";
	const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
	const ERR_INVALID_VERSION = "Version exceeds 65535";
	const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
	const ERR_UNSUPPORTED_ENCRYPTION_USDZ = "Encryption is not supported in USDZ files";
	const ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH = "Encryption is not supported when the 'passThrough' option is set";
	const ERR_INVALID_EXTRAFIELD = "Invalid extra field (must be a Map)";
	const ERR_INVALID_EXTRAFIELD_TYPE = "Invalid extra field type (must be integer 0..65535)";
	const ERR_INVALID_EXTRAFIELD_DATA_TYPE = "Invalid extra field data (must be a Uint8Array)";
	const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
	const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
	const MIN_UNIX_TIME = -2147483648;
	const MAX_UNIX_TIME = 2147483647;
	const MIN_NTFS_TIME = BigInt(0);
	const MAX_NTFS_TIME = BigInt("0x7fffffffffffffff");
	const ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported (set the 'zip64' option to 'true')";
	const ERR_UNDEFINED_UNCOMPRESSED_SIZE = "Undefined uncompressed size";
	const ERR_UNDEFINED_COMPRESSION_METHOD = "Undefined compression method";
	const ERR_UNDETERMINED_SIZE = "Undetermined size";
	const ERR_UNDEFINED_READER = "Undefined reader";
	const ERR_ZIP_NOT_EMPTY = "Zip file not empty";
	const ERR_INVALID_UID = "Invalid uid (must be integer 0..2^32-1)";
	const ERR_INVALID_GID = "Invalid gid (must be integer 0..2^32-1)";
	const ERR_INVALID_UNIX_MODE = "Invalid UNIX mode (must be integer 0..65535)";
	const ERR_INVALID_UNIX_EXTRA_FIELD_TYPE = "Invalid unixExtraFieldType (must be 'infozip' or 'unix')";
	const ERR_INVALID_UNIX_ID_SIZE = "uid/gid must be 0..65535 for unixExtraFieldType 'unix' (use 'infozip' for larger ids)";
	const ERR_INVALID_MSDOS_ATTRIBUTES = "Invalid msdosAttributesRaw (must be integer 0..255)";
	const ERR_INVALID_MSDOS_DATA = "Invalid msdosAttributes (must be an object with boolean flags)";
	const ERR_INVALID_LEVEL = "Invalid level (must be integer 0..9)";
	const ERR_INVALID_SIGNATURE_DATA = "Signature data exceeds 64KB";

	const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
	const EXTRAFIELD_OFFSET_AES_VENDOR_VERSION = 4;
	const VENDOR_VERSION_AE_1 = 1;
	const INFOZIP_EXTRA_FIELD_TYPE$1 = "infozip";
	const UNIX_EXTRA_FIELD_TYPE = "unix";
	const MAX_LEVEL = 9;

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
				fileEntries: new Map(),
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
			if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
				reader = new BlobReader(await streamToBlob(reader.readable));
				await initStream(reader);
			}
			const { ZipReader } = await Promise.resolve().then(function () { return zipReader; });
			const zipReader$1 = new ZipReader(reader);
			const entries = await zipReader$1.getEntries();
			await zipReader$1.close();
			await initStream(this.writer);
			const { directoryOffset } = zipReader$1;
			let splitZipSignatureLength = 0;
			if (this.addSplitZipSignature) {
				delete this.addSplitZipSignature;
				if (!await startsWithSplitZipSignature(reader)) {
					await writeData(this.writer, getSplitZipSignatureArray());
					splitZipSignatureLength = SPLIT_ZIP_FILE_SIGNATURE_LENGTH;
					this.offset += splitZipSignatureLength;
				}
			}
			const entryPositions = await copyZipData(this, reader, entries, directoryOffset, splitZipSignatureLength);
			this.filenames = new Set(entries.map(entry => entry.filename));
			this.fileEntries = new Map(entries.map(entry => {
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
				const { crc32 } = entry;
				if (crc32 !== UNDEFINED_VALUE) {
					setUint32(headerView, HEADER_OFFSET_SIGNATURE, crc32);
				}
				const { offset, diskNumberStart } = entryPositions.get(entry);
				Object.assign(entry, {
					zip64UncompressedSize,
					zip64CompressedSize,
					offset,
					diskNumberStart,
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
			const { pendingAddFileCalls } = zipWriter;
			if (workers < getConfiguration().maxWorkers) {
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
			const { filenames, fileEntries } = this;
			// deno-lint-ignore valid-typeof
			if (typeof entry == STRING_TYPE) {
				entry = fileEntries.get(entry);
			}
			if (entry && entry.filename !== UNDEFINED_VALUE) {
				const { filename } = entry;
				if (filenames.has(filename) && fileEntries.has(filename)) {
					filenames.delete(filename);
					fileEntries.delete(filename);
					return true;
				}
			}
			return false;
		}

		async close(comment = EMPTY_UINT8_ARRAY, options = {}) {
			const zipWriter = this;
			const { pendingAddFileCalls, writer } = this;
			const { writable } = writer;
			if (!(comment instanceof Uint8Array)) {
				throw new Error(ERR_INVALID_COMMENT_TYPE);
			}
			if (getLength(comment) > MAX_16_BITS) {
				throw new Error(ERR_INVALID_COMMENT);
			}
			while (pendingAddFileCalls.size) {
				await Promise.allSettled(Array.from(pendingAddFileCalls));
			}
			await closeFile(zipWriter, comment, options);
			const preventClose = !ownsWritable(writer) && getOptionValue(zipWriter, options, OPTION_PREVENT_CLOSE);
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
		zipWriter.fileEntries.set(name, UNDEFINED_VALUE);
		let fileEntry;
		try {
			const { resolvedOptions } = metadataInfo;
			if (resolvedOptions.level != 0 && resolvedOptions.compressionMethod === UNDEFINED_VALUE &&
				!resolvedOptions.passThrough && !(await supportsDeflate(getConfiguration()))) {
				resolvedOptions.level = 0;
			}
			const sizesInfo = await resolveSizes(zipWriter, reader, metadataInfo, options);
			({ reader } = sizesInfo);
			const diskOffset = getDiskOffset(zipWriter.writer);
			const diskNumber = getDiskNumber(zipWriter.writer);
			options = Object.assign({}, options, attributesInfo.resolvedOptions, metadataInfo.resolvedOptions, sizesInfo.resolvedOptions, {
				signature: options[PROPERTY_NAME_SIGNATURE],
				crc32: options.crc32 === UNDEFINED_VALUE ? options[PROPERTY_NAME_SIGNATURE] : options.crc32,
				offset: zipWriter.offset - diskOffset,
				diskNumberStart: diskNumber
			});
			const headerInfo = getHeaderInfo(options);
			const dataDescriptorInfo = getDataDescriptorInfo(options);
			const metadataSize = getLength(headerInfo.localHeaderArray, dataDescriptorInfo.dataDescriptorArray);
			fileEntry = await getFileEntry(zipWriter, name, reader, { headerInfo, dataDescriptorInfo, metadataSize }, options);
		} catch (error) {
			zipWriter.fileEntries.delete(name);
			throw error;
		}
		Object.assign(fileEntry, {
			name,
			comment,
			extraField,
			[PROPERTY_NAME_DEPRECATED_INTERNAL_FILE_ATTRIBUTES]: fileEntry.internalFileAttributes,
			[PROPERTY_NAME_DEPRECATED_EXTERNAL_FILE_ATTRIBUTES]: fileEntry.externalFileAttributes
		});
		return new Entry(fileEntry);
	}

	function resolveAttributes(zipWriter, name, options) {
		name = name.trim();
		let msDosCompatible = getOptionValue(zipWriter, options, PROPERTY_NAME_MS_DOS_COMPATIBLE);
		let versionMadeBy = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION_MADE_BY, msDosCompatible ? VERSION_MADE_BY_MSDOS : VERSION_MADE_BY_UNIX);
		const executable = getOptionValue(zipWriter, options, PROPERTY_NAME_EXECUTABLE);
		const uid = getNumberOptionValue(zipWriter, options, PROPERTY_NAME_UID);
		const gid = getNumberOptionValue(zipWriter, options, PROPERTY_NAME_GID);
		let unixMode = getNumberOptionValue(zipWriter, options, PROPERTY_NAME_UNIX_MODE);
		let unixExtraFieldType = getOptionValue(zipWriter, options, OPTION_UNIX_EXTRA_FIELD_TYPE);
		let setuid = getOptionValue(zipWriter, options, PROPERTY_NAME_SETUID);
		let setgid = getOptionValue(zipWriter, options, PROPERTY_NAME_SETGID);
		let sticky = getOptionValue(zipWriter, options, PROPERTY_NAME_STICKY);
		if (uid !== UNDEFINED_VALUE && (!Number.isInteger(uid) || uid < 0 || uid > MAX_32_BITS)) {
			throw new Error(ERR_INVALID_UID);
		}
		if (gid !== UNDEFINED_VALUE && (!Number.isInteger(gid) || gid < 0 || gid > MAX_32_BITS)) {
			throw new Error(ERR_INVALID_GID);
		}
		if (unixMode !== UNDEFINED_VALUE && (!Number.isInteger(unixMode) || unixMode < 0 || unixMode > MAX_16_BITS)) {
			throw new Error(ERR_INVALID_UNIX_MODE);
		}
		if (unixExtraFieldType !== UNDEFINED_VALUE && unixExtraFieldType !== INFOZIP_EXTRA_FIELD_TYPE$1 && unixExtraFieldType !== UNIX_EXTRA_FIELD_TYPE) {
			throw new Error(ERR_INVALID_UNIX_EXTRA_FIELD_TYPE);
		}
		if (unixExtraFieldType === UNIX_EXTRA_FIELD_TYPE &&
			((uid !== UNDEFINED_VALUE && uid > MAX_16_BITS) || (gid !== UNDEFINED_VALUE && gid > MAX_16_BITS))) {
			throw new Error(ERR_INVALID_UNIX_ID_SIZE);
		}
		if (unixExtraFieldType === UNDEFINED_VALUE && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE)) {
			unixExtraFieldType = INFOZIP_EXTRA_FIELD_TYPE$1;
		}
		let msdosAttributesRaw = getNumberOptionValue(zipWriter, options, PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW);
		let msdosAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_MSDOS_ATTRIBUTES);
		const hasUnixMetadata = uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE || unixMode !== UNDEFINED_VALUE || unixExtraFieldType || executable;
		const hasMsDosProvided = msdosAttributesRaw !== UNDEFINED_VALUE || msdosAttributes !== UNDEFINED_VALUE;
		if (hasUnixMetadata) {
			msDosCompatible = false;
			versionMadeBy = (versionMadeBy & MAX_8_BITS) | VERSION_MADE_BY_UNIX;
		} else if (hasMsDosProvided) {
			msDosCompatible = true;
			versionMadeBy = (versionMadeBy & MAX_8_BITS);
		}
		if (msdosAttributesRaw !== UNDEFINED_VALUE && (!Number.isInteger(msdosAttributesRaw) || msdosAttributesRaw < 0 || msdosAttributesRaw > MAX_8_BITS)) {
			throw new Error(ERR_INVALID_MSDOS_ATTRIBUTES);
		}
		if (msdosAttributes && (typeof msdosAttributes !== OBJECT_TYPE || Array.isArray(msdosAttributes))) {
			throw new Error(ERR_INVALID_MSDOS_DATA);
		}
		if (versionMadeBy > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		let externalFileAttributes = getAliasedOptionValue(zipWriter, options, PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES, PROPERTY_NAME_DEPRECATED_EXTERNAL_FILE_ATTRIBUTES);
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
		if (!msDosCompatible) {
			const unixModeProvided = unixMode !== UNDEFINED_VALUE || Boolean(setuid || setgid || sticky);
			const defaultUnixMode = (externalFileAttributes >> 16) & MAX_16_BITS;
			unixMode = unixMode === UNDEFINED_VALUE ? defaultUnixMode : (unixMode & MAX_16_BITS);
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
					unixMode = (unixMode & ~FILE_ATTR_UNIX_TYPE_MASK) | FILE_ATTR_UNIX_TYPE_DIR;
				} else if (!(unixMode & FILE_ATTR_UNIX_TYPE_MASK)) {
					unixMode |= FILE_ATTR_UNIX_TYPE_FILE;
				}
				externalFileAttributes = ((unixMode & MAX_16_BITS) << 16) | (externalFileAttributes & MAX_16_BITS);
			}
		}
		({ msdosAttributesRaw, msdosAttributes } = normalizeMsdosAttributes(msdosAttributesRaw, msdosAttributes));
		if (hasMsDosProvided) {
			externalFileAttributes = (externalFileAttributes & MAX_32_BITS) | (msdosAttributesRaw & MAX_8_BITS);
		}
		const unixExternalUpper = (externalFileAttributes >> 16) & MAX_16_BITS;
		const symlink = unixMode !== UNDEFINED_VALUE && ((unixMode & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_SYMLINK);
		return {
			name,
			resolvedOptions: {
				versionMadeBy,
				msDosCompatible: Boolean(msDosCompatible),
				externalFileAttributes,
				unixExternalUpper,
				uid,
				gid,
				unixMode,
				unixExtraFieldType,
				symlink,
				setuid,
				setgid,
				sticky,
				msdosAttributesRaw,
				msdosAttributes
			}
		};
	}

	function resolveMetadata(zipWriter, name, options) {
		const encode = getFunctionOptionValue(zipWriter, options, OPTION_ENCODE_TEXT) || encodeText;
		let rawFilename = encode(name, TEXT_TYPE_FILENAME);
		if (rawFilename === UNDEFINED_VALUE) {
			rawFilename = encodeText(name);
		}
		if (getLength(rawFilename) > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_NAME);
		}
		const comment = options[PROPERTY_NAME_COMMENT] || "";
		// deno-lint-ignore valid-typeof
		if (typeof comment != STRING_TYPE) {
			throw new Error(ERR_INVALID_ENTRY_COMMENT_TYPE);
		}
		let rawComment = encode(comment, TEXT_TYPE_COMMENT);
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
		const lastModDate = getDateOptionValue(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE, new Date());
		const lastAccessDate = getDateOptionValue(zipWriter, options, PROPERTY_NAME_LAST_ACCESS_DATE);
		const creationDate = getDateOptionValue(zipWriter, options, PROPERTY_NAME_CREATION_DATE);
		const internalFileAttributes = getAliasedOptionValue(zipWriter, options, PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES, PROPERTY_NAME_DEPRECATED_INTERNAL_FILE_ATTRIBUTES, 0);
		const passThrough = getOptionValue(zipWriter, options, OPTION_PASS_THROUGH);
		const password = getOptionValue(zipWriter, options, OPTION_PASSWORD);
		const rawPassword = getOptionValue(zipWriter, options, OPTION_RAW_PASSWORD);
		checkPasswordOption(password, rawPassword);
		const encryptionStrength = getNumberOptionValue(zipWriter, options, OPTION_ENCRYPTION_STRENGTH, 3);
		const zipCrypto = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIPCRYPTO);
		const extendedTimestamp = getOptionValue(zipWriter, options, OPTION_EXTENDED_TIMESTAMP, true);
		const ntfsTimestamp = getOptionValue(zipWriter, options, OPTION_NTFS_TIMESTAMP);
		const keepOrder = getOptionValue(zipWriter, options, OPTION_KEEP_ORDER, true);
		const useWebWorkers = getOptionValue(zipWriter, options, OPTION_USE_WEB_WORKERS);
		const transferStreams = getOptionValue(zipWriter, options, OPTION_TRANSFER_STREAMS);
		const bufferedWrite = getOptionValue(zipWriter, options, OPTION_BUFFERED_WRITE);
		const createTempStream = getFunctionOptionValue(zipWriter, options, OPTION_CREATE_TEMP_STREAM);
		const dataDescriptorSignature = getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR_SIGNATURE, true);
		const signal = checkSignalOption(getOptionValue(zipWriter, options, OPTION_SIGNAL));
		const useUnicodeFileNames = getOptionValue(zipWriter, options, OPTION_USE_UNICODE_FILE_NAMES, true);
		const compressionMethod = getOptionValue(zipWriter, options, PROPERTY_NAME_COMPRESSION_METHOD);
		const registeredCodec = passThrough || compressionMethod === UNDEFINED_VALUE ? UNDEFINED_VALUE : getRegisteredCodec(compressionMethod);
		if (!passThrough && compressionMethod !== UNDEFINED_VALUE &&
			compressionMethod !== COMPRESSION_METHOD_STORE && compressionMethod !== COMPRESSION_METHOD_DEFLATE && !registeredCodec) {
			throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		}
		let level = getNumberOptionValue(zipWriter, options, OPTION_LEVEL);
		if (level !== UNDEFINED_VALUE && (!Number.isInteger(level) || level < 0 || level > MAX_LEVEL)) {
			throw new Error(ERR_INVALID_LEVEL);
		}
		if (zipWriter.options[OPTION_USDZ]) {
			if (password !== UNDEFINED_VALUE || rawPassword !== UNDEFINED_VALUE) {
				throw new Error(ERR_UNSUPPORTED_ENCRYPTION_USDZ);
			}
			if (level === UNDEFINED_VALUE && compressionMethod === UNDEFINED_VALUE) {
				level = 0;
			}
		}
		if (passThrough) {
			level = UNDEFINED_VALUE;
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
		if (!zipCrypto && (password !== UNDEFINED_VALUE || rawPassword !== UNDEFINED_VALUE) && !(Number.isInteger(encryptionStrength) && encryptionStrength >= 1 && encryptionStrength <= 3)) {
			throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
		}
		const rawExtraField = serializeExtraField(options[PROPERTY_NAME_EXTRA_FIELD]);
		const rawLocalExtraField = serializeExtraField(options[OPTION_LOCAL_EXTRA_FIELD]);
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
				rawExtraField,
				rawLocalExtraField
			}
		};
	}

	function serializeExtraField(extraField) {
		if (!extraField) {
			return EMPTY_UINT8_ARRAY;
		}
		if (!(extraField instanceof Map)) {
			throw new Error(ERR_INVALID_EXTRAFIELD);
		}
		let extraFieldSize = 0;
		let offset = 0;
		extraField.forEach((data, type) => {
			if (!Number.isInteger(type) || type < 0 || type > MAX_16_BITS) {
				throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
			}
			if (!(data instanceof Uint8Array)) {
				throw new Error(ERR_INVALID_EXTRAFIELD_DATA_TYPE);
			}
			if (getLength(data) > MAX_16_BITS) {
				throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
			}
			extraFieldSize += 4 + getLength(data);
		});
		const rawExtraField = new Uint8Array(extraFieldSize);
		const rawExtraFieldView = getDataView(rawExtraField);
		extraField.forEach((data, type) => {
			setUint16(rawExtraFieldView, offset, type);
			setUint16(rawExtraFieldView, offset + 2, getLength(data));
			arraySet(rawExtraField, data, offset + 4);
			offset += 4 + getLength(data);
		});
		return rawExtraField;
	}

	async function resolveSizes(zipWriter, reader, { resolvedOptions: metadata }, options) {
		if (metadata.passThrough && !reader && !getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY)) {
			throw new Error(ERR_UNDEFINED_READER);
		}
		let contentSize;
		if (reader) {
			reader = new GenericReader(reader);
			await initStream(reader);
			({ size: contentSize } = reader);
		}
		return Object.assign({ reader }, resolveEntrySizes(zipWriter, Boolean(reader), contentSize, metadata, options));
	}

	function resolveEntrySizes(zipWriter, hasContent, contentSize, metadata, options) {
		const { passThrough, zipCrypto, password, rawPassword, encryptionStrength } = metadata;
		let { dataDescriptor, zip64, level, compressionMethod } = metadata;
		let maximumCompressedSize = 0;
		let uncompressedSize = 0;
		if (passThrough && hasContent) {
			uncompressedSize = options[PROPERTY_NAME_UNCOMPRESSED_SIZE];
			if (uncompressedSize === UNDEFINED_VALUE) {
				throw new Error(ERR_UNDEFINED_UNCOMPRESSED_SIZE);
			}
			if (compressionMethod === UNDEFINED_VALUE) {
				throw new Error(ERR_UNDEFINED_COMPRESSION_METHOD);
			}
		}
		const zip64Enabled = zip64 === true;
		const encrypted = getOptionValue(zipWriter, options, PROPERTY_NAME_ENCRYPTED);
		if (hasContent && passThrough && !encrypted && getLength(password, rawPassword)) {
			throw new Error(ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH);
		}
		const encryptedEntry = hasContent && (Boolean((password && getLength(password)) || (rawPassword && getLength(rawPassword))) || (passThrough && encrypted));
		if (!hasContent) {
			level = 0;
			compressionMethod = COMPRESSION_METHOD_STORE;
		}
		const encryptionOverhead = encryptedEntry ? (zipCrypto ? 12 : 16 + encryptionStrength * 4) : 0;
		if (hasContent) {
			if (!passThrough) {
				if (contentSize === UNDEFINED_VALUE) {
					dataDescriptor = true;
					if (zip64 || zip64 === UNDEFINED_VALUE) {
						zip64 = true;
						uncompressedSize = maximumCompressedSize = MAX_32_BITS + 1;
					}
				} else {
					options.uncompressedSize = uncompressedSize = contentSize;
					maximumCompressedSize = (isCompressed(compressionMethod, level) ? getMaximumCompressedSize(uncompressedSize) : uncompressedSize) + encryptionOverhead;
				}
			} else {
				options.uncompressedSize = uncompressedSize;
				maximumCompressedSize = contentSize === UNDEFINED_VALUE ? getMaximumCompressedSize(uncompressedSize) + encryptionOverhead : contentSize;
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
			maximumCompressedSize,
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

	async function getEntriesSize(writerOptions, entries, writeOrderGuaranteed, comment) {
		const zipWriter = { options: writerOptions };
		if (checkFunctionOption(writerOptions[OPTION_SIGN_CENTRAL_DIRECTORY])) {
			throw new Error(ERR_UNDETERMINED_SIZE);
		}
		if (comment !== UNDEFINED_VALUE && !(comment instanceof Uint8Array)) {
			throw new Error(ERR_INVALID_COMMENT_TYPE);
		}
		const commentLength = getLength(comment);
		if (commentLength > MAX_16_BITS) {
			throw new Error(ERR_INVALID_COMMENT);
		}
		const usdz = writerOptions[OPTION_USDZ];
		const files = new Map();
		let layoutDependsOnWriteOrder = Boolean(usdz);
		let offset = 0;
		for (const entry of entries) {
			let { name } = entry;
			const { size } = entry;
			const options = Object.assign({}, entry.options);
			name = name.trim();
			if (getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY) && !name.endsWith(DIRECTORY_SIGNATURE)) {
				name += DIRECTORY_SIGNATURE;
			}
			const attributesInfo = resolveAttributes(zipWriter, name, options);
			({ name } = attributesInfo);
			const { resolvedOptions: metadata } = resolveMetadata(zipWriter, name, options);
			if (metadata.level != 0 && metadata.compressionMethod === UNDEFINED_VALUE &&
				!metadata.passThrough && !(await supportsDeflate(getConfiguration()))) {
				metadata.level = 0;
			}
			const hasContent = !getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY);
			if (hasContent && size === UNDEFINED_VALUE) {
				throw new Error(ERR_UNDETERMINED_SIZE);
			}
			const { maximumCompressedSize, resolvedOptions: sizes } = resolveEntrySizes(zipWriter, hasContent, size, metadata, options);
			if (hasContent && !metadata.passThrough && isCompressed(sizes.compressionMethod, sizes.level)) {
				throw new Error(ERR_UNDETERMINED_SIZE);
			}
			const entryOptions = Object.assign({}, options, attributesInfo.resolvedOptions, metadata, sizes);
			const headerInfo = getHeaderInfo(entryOptions);
			const dataDescriptorInfo = getDataDescriptorInfo(entryOptions);
			const entryInfo = {
				headerInfo,
				metadataSize: getLength(headerInfo.localHeaderArray, dataDescriptorInfo.dataDescriptorArray)
			};
			if (usdz) {
				appendExtraFieldUSDZ(entryInfo, offset);
			}
			const compressedSize = hasContent ? maximumCompressedSize : 0;
			if (offset >= MAX_32_BITS) {
				layoutDependsOnWriteOrder = true;
			}
			files.set(name, Object.assign({}, entryOptions, headerInfo, {
				offset,
				diskNumberStart: 0,
				compressedSize
			}));
			offset += entryInfo.metadataSize + compressedSize;
		}
		if (layoutDependsOnWriteOrder && !writeOrderGuaranteed) {
			throw new Error(ERR_UNDETERMINED_SIZE);
		}
		const directoryDataLength = createDirectoryRecords(files);
		let zip64 = getOptionValue(zipWriter, writerOptions, PROPERTY_NAME_ZIP64);
		if (offset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || files.size >= MAX_16_BITS) {
			if (zip64 === false) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			} else {
				zip64 = true;
			}
		}
		return offset + directoryDataLength + commentLength + (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH);
	}

	async function getFileEntry(zipWriter, name, reader, entryInfo, options) {
		const {
			fileEntries,
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
		fileEntries.set(name, fileEntry);
		zipWriter.lastFileEntry = fileEntry;
		try {
			let lockPreviousFileEntry;
			if (keepOrder) {
				lockPreviousFileEntry = previousFileEntry && previousFileEntry.lockFileEntry;
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
				await writeData(writer, getSplitZipSignatureArray());
				zipWriter.offset += SPLIT_ZIP_FILE_SIGNATURE_LENGTH;
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
			fileEntry = await createFileEntry(reader, fileWriter, fileEntry, entryInfo, getConfiguration(), options);
			if (!bufferedWrite) {
				writingEntryData = false;
			}
			fileEntries.set(name, fileEntry);
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
			fileEntries.delete(name);
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
			fileEntry.lockFileEntry = new Promise(resolve => releaseLockCurrentFileEntry = resolve);
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

	async function createFileEntry(reader, writer, { diskNumberStart, lockFileEntry }, entryInfo, config, options) {
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
			symlink,
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
			lockFileEntry,
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
			symlink: Boolean(symlink),
			setuid,
			setgid,
			sticky,
			unixExternalUpper,
			msdosAttributesRaw,
			msdosAttributes
		};
		let {
			crc32,
			uncompressedSize
		} = options;
		let compressedSize = 0;
		if (!passThrough) {
			uncompressedSize = 0;
		}
		const { writable } = writer;
		if (reader) {
			const readable = toCompatibleReadable(createReadable(reader));
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
					computeCrc32: !passThrough,
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
					if (!encrypted || zipCrypto) {
						crc32 = result.crc32;
					}
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
			crc32,
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
			encrypted: Boolean(encrypted),
			zipCrypto: Boolean(zipCrypto),
			size: metadataSize + compressedSize,
			compressionMethod,
			version,
			headerArray,
			headerView,
			signature: crc32,
			crc32: encrypted && !zipCrypto && !passThrough ? UNDEFINED_VALUE : crc32,
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
			rawLocalExtraField,
			encryptionStrength,
			extendedTimestamp,
			ntfsTimestamp,
			passThrough,
			encrypted,
			zip64UncompressedSize,
			zip64CompressedSize,
			uncompressedSize,
			crc32
		} = options;
		let { version, compressionMethod } = options;
		const compressed = !directory && isCompressed(compressionMethod, level);
		let rawLocalExtraFieldZip64;
		const uncompressedFile = passThrough || !compressed;
		const zip64ExtraFieldComplete = zip64 && (options.bufferedWrite || !dataDescriptor || ((!zip64UncompressedSize && !zip64CompressedSize) || uncompressedFile));
		const writeLocalExtraFieldZip64 = zip64ExtraFieldComplete || (zip64 && dataDescriptor && (zip64UncompressedSize || zip64CompressedSize));
		if (zip64 && (zip64UncompressedSize || zip64CompressedSize)) {
			const length = 4 + 16;
			const extraFieldZip64 = createRecordWriter(length);
			extraFieldZip64.writeUint16(EXTRAFIELD_TYPE_ZIP64);
			extraFieldZip64.writeUint16(length - 4);
			rawLocalExtraFieldZip64 = extraFieldZip64.array;
			if (zip64ExtraFieldComplete) {
				extraFieldZip64.writeUint64(uncompressedSize);
				if (uncompressedFile) {
					const encryptionOverhead = encrypted ? (zipCrypto ? 12 : 16 + encryptionStrength * 4) : 0;
					extraFieldZip64.writeUint64(passThrough ? 0 : uncompressedSize + encryptionOverhead);
				}
			}
		} else {
			rawLocalExtraFieldZip64 = EMPTY_UINT8_ARRAY;
		}
		let rawExtraFieldAES;
		if (encrypted && !zipCrypto) {
			const extraFieldAES = createRecordWriter(getLength(EXTRAFIELD_DATA_AES) + 2);
			extraFieldAES.writeUint16(EXTRAFIELD_TYPE_AES);
			extraFieldAES.writeBytes(EXTRAFIELD_DATA_AES);
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
				extraFieldTimestamp.writeUint16(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
				extraFieldTimestamp.writeUint16(extraFieldTimestampLength - 4);
				extraFieldTimestamp.writeUint8(extraFieldExtendedTimestampFlag);
				extraFieldTimestamp.writeUint32(lastModTimeUnix);
				if (lastAccessDate) {
					extraFieldTimestamp.writeUint32(clampUnixTime(getTimeUnix(lastAccessDate)));
				}
				if (creationDate) {
					extraFieldTimestamp.writeUint32(clampUnixTime(getTimeUnix(creationDate)));
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
					extraFieldNTFS.writeUint16(EXTRAFIELD_TYPE_NTFS);
					extraFieldNTFS.writeUint16(32);
					extraFieldNTFS.skip(4);
					extraFieldNTFS.writeUint16(EXTRAFIELD_TYPE_NTFS_TAG1);
					extraFieldNTFS.writeUint16(24);
					extraFieldNTFS.writeUint64(lastModTimeNTFS);
					extraFieldNTFS.writeUint64(lastAccessDate ? getTimeNTFS(lastAccessDate) : lastModTimeNTFS);
					extraFieldNTFS.writeUint64(creationDate ? getTimeNTFS(creationDate) : lastModTimeNTFS);
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
			if (unixExtraFieldType == INFOZIP_EXTRA_FIELD_TYPE$1 && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE)) {
				const uidBytes = packUnixId(uid);
				const gidBytes = packUnixId(gid);
				const payloadLength = 3 + uidBytes.length + gidBytes.length;
				const extraFieldUnix = createRecordWriter(4 + payloadLength);
				extraFieldUnix.writeUint16(EXTRAFIELD_TYPE_INFOZIP);
				extraFieldUnix.writeUint16(payloadLength);
				extraFieldUnix.writeUint8(1);
				extraFieldUnix.writeUint8(uidBytes.length);
				extraFieldUnix.writeBytes(uidBytes);
				extraFieldUnix.writeUint8(gidBytes.length);
				extraFieldUnix.writeBytes(gidBytes);
				rawExtraFieldUnix = extraFieldUnix.array;
			} else if (unixExtraFieldType == UNIX_EXTRA_FIELD_TYPE && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE)) {
				const extraFieldUnix = createRecordWriter(8);
				extraFieldUnix.writeUint16(EXTRAFIELD_TYPE_UNIX);
				extraFieldUnix.writeUint16(4);
				extraFieldUnix.writeUint16((uid === UNDEFINED_VALUE ? 0 : uid) & MAX_16_BITS);
				extraFieldUnix.writeUint16((gid === UNDEFINED_VALUE ? 0 : gid) & MAX_16_BITS);
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
			if (passThrough && crc32 !== UNDEFINED_VALUE) {
				rawExtraFieldAES[EXTRAFIELD_OFFSET_AES_VENDOR_VERSION] = VENDOR_VERSION_AE_1;
			}
			rawExtraFieldAES[9] = compressionMethod;
			compressionMethod = COMPRESSION_METHOD_AES;
		}
		const localExtraFieldZip64Length = writeLocalExtraFieldZip64 ? getLength(rawLocalExtraFieldZip64) : 0;
		const extraFieldLength = localExtraFieldZip64Length + getLength(rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField, rawLocalExtraField);
		if (extraFieldLength > MAX_16_BITS) {
			throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
		}
		const dosLastModDate = new Date(Math.ceil(Math.floor(lastModDate.getTime() / 1000) / 2) * 2000);
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
		localHeader.writeUint32(LOCAL_FILE_HEADER_SIGNATURE);
		localHeader.writeBytes(headerArray);
		localHeader.writeBytes(rawFilename);
		if (writeLocalExtraFieldZip64) {
			localHeader.writeBytes(rawLocalExtraFieldZip64);
		}
		localHeader.writeBytes(rawExtraFieldAES);
		localHeader.writeBytes(rawExtraFieldExtendedTimestamp);
		localHeader.writeBytes(rawExtraFieldNTFS);
		localHeader.writeBytes(rawExtraFieldUnix);
		localHeader.writeBytes(rawExtraField);
		localHeader.writeBytes(rawLocalExtraField);
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
		crc32,
		compressedSize,
		uncompressedSize,
		headerInfo,
		dataDescriptorInfo
	}, {
		zip64,
		zipCrypto,
		passThrough,
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
		if ((!encrypted || zipCrypto || passThrough) && crc32 !== UNDEFINED_VALUE) {
			setUint32(headerView, HEADER_OFFSET_SIGNATURE, crc32);
			if (dataDescriptor) {
				setUint32(dataDescriptorView, dataDescriptorOffset, crc32);
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
		crc32,
		compressedSize,
		uncompressedSize,
		zip64UncompressedSize,
		zip64CompressedSize
	}, localHeaderView, { dataDescriptor, passThrough }) {
		if (!dataDescriptor) {
			if (!encrypted || (passThrough && crc32 !== UNDEFINED_VALUE)) {
				setUint32(localHeaderView, HEADER_OFFSET_SIGNATURE + LOCAL_HEADER_COMMON_OFFSET, crc32);
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
		const directoryDataLength = createDirectoryRecords(zipWriter.fileEntries);
		const { directoryStart, directoryArray } = await writeDirectoryRecords(zipWriter, directoryDataLength, options);
		const signatureLength = await writeDigitalSignatureRecord(zipWriter, directoryArray, options);
		await writeEndOfDirectoryRecord(zipWriter, comment, options, { directoryStart, directoryDataLength, signatureLength });
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
				extraFieldZip64.writeUint16(EXTRAFIELD_TYPE_ZIP64);
				extraFieldZip64.writeUint16(length - 4);
				if (zip64UncompressedSize) {
					extraFieldZip64.writeUint64(uncompressedSize);
				}
				if (zip64CompressedSize) {
					extraFieldZip64.writeUint64(compressedSize);
				}
				if (zip64Offset) {
					extraFieldZip64.writeUint64(fileEntry.offset);
				}
				if (zip64DiskNumberStart) {
					extraFieldZip64.writeUint32(fileEntry.diskNumberStart);
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
				extraFieldTimestamp.writeUint16(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
				extraFieldTimestamp.writeUint16(5);
				extraFieldTimestamp.writeUint8(extraFieldExtendedTimestampFlag);
				extraFieldTimestamp.writeUint32(lastModTimeUnix);
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
		const { fileEntries, writer } = zipWriter;
		const directoryArray = new Uint8Array(directoryDataLength);
		await initStream(writer);
		let offset = 0;
		let directoryDiskOffset = 0;
		let directoryStartDiskNumber = getDiskNumber(writer);
		let directoryStartDiskOffset = getDiskOffset(writer);
		for (const [indexFileEntry, fileEntry] of Array.from(fileEntries.values()).entries()) {
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
			directoryRecord.writeUint32(CENTRAL_FILE_HEADER_SIGNATURE);
			directoryRecord.writeUint16(versionMadeBy);
			directoryRecord.writeBytes(headerArray.subarray(0, HEADER_SIZE - 4 - 2));
			directoryRecord.writeUint16(extraFieldLength);
			directoryRecord.writeUint16(getLength(rawComment));
			directoryRecord.writeUint16(zip64DiskNumberStart ? MAX_16_BITS : diskNumberStart);
			directoryRecord.writeUint16(internalFileAttributes);
			directoryRecord.writeUint32(externalFileAttributes);
			directoryRecord.writeUint32(zip64Offset ? MAX_32_BITS : fileEntryOffset);
			directoryRecord.writeBytes(rawFilename);
			directoryRecord.writeBytes(rawExtraFieldZip64);
			directoryRecord.writeBytes(rawExtraFieldAES);
			directoryRecord.writeBytes(rawExtraFieldExtendedTimestamp);
			directoryRecord.writeBytes(rawExtraFieldNTFS);
			directoryRecord.writeBytes(rawExtraFieldUnix);
			directoryRecord.writeBytes(rawExtraField);
			directoryRecord.writeBytes(rawComment);
			arraySet(directoryArray, directoryRecord.array, offset);
			offset += directoryRecordLength;
			if (options.onprogress) {
				try {
					await options.onprogress(indexFileEntry + 1, fileEntries.size, new Entry(fileEntry));
				} catch {
					// ignored
				}
			}
		}
		await writeData(writer, directoryDiskOffset ? directoryArray.slice(directoryDiskOffset) : directoryArray);
		return {
			directoryStart: { diskNumber: directoryStartDiskNumber, diskOffset: directoryStartDiskOffset },
			directoryArray
		};
	}

	async function writeDigitalSignatureRecord(zipWriter, directoryArray, options) {
		const signCentralDirectory = getFunctionOptionValue(zipWriter, options, OPTION_SIGN_CENTRAL_DIRECTORY);
		if (signCentralDirectory) {
			const signatureData = await signCentralDirectory(directoryArray);
			const signatureDataLength = getLength(signatureData);
			if (signatureDataLength > MAX_16_BITS) {
				throw new Error(ERR_INVALID_SIGNATURE_DATA);
			}
			const signatureRecord = createRecordWriter(6 + signatureDataLength);
			signatureRecord.writeUint32(DIGITAL_SIGNATURE_RECORD_SIGNATURE);
			signatureRecord.writeUint16(signatureDataLength);
			signatureRecord.writeBytes(signatureData);
			await writeData(zipWriter.writer, signatureRecord.array);
			return 6 + signatureDataLength;
		}
		return 0;
	}

	async function writeEndOfDirectoryRecord(zipWriter, comment, options, cdInfo) {
		const { writer } = zipWriter;
		const { directoryStart, signatureLength } = cdInfo;
		let { directoryDataLength } = cdInfo;
		let fileEntriesLength = zipWriter.fileEntries.size;
		let diskNumber = directoryStart.diskNumber;
		let directoryOffset = getSegmentOffset(zipWriter, directoryStart);
		let lastDiskNumber = getDiskNumber(writer);
		if (exceedsAvailableSize(writer, END_OF_CENTRAL_DIR_LENGTH)) {
			lastDiskNumber++;
		}
		let zip64 = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIP64);
		if (directoryOffset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || fileEntriesLength >= MAX_16_BITS || lastDiskNumber >= MAX_16_BITS) {
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
			endOfdirectoryRecord.writeUint32(ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
			endOfdirectoryRecord.writeUint64(44);
			endOfdirectoryRecord.writeUint16(45);
			endOfdirectoryRecord.writeUint16(45);
			endOfdirectoryRecord.writeUint32(lastDiskNumber);
			endOfdirectoryRecord.writeUint32(diskNumber);
			endOfdirectoryRecord.writeUint64(fileEntriesLength);
			endOfdirectoryRecord.writeUint64(fileEntriesLength);
			endOfdirectoryRecord.writeUint64(directoryDataLength);
			endOfdirectoryRecord.writeUint64(directoryOffset);
			endOfdirectoryRecord.writeUint32(ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
			endOfdirectoryRecord.writeUint32(lastDiskNumber);
			endOfdirectoryRecord.writeUint64(BigInt(getSegmentOffset(zipWriter, writer)) + BigInt(directoryDataLength) + BigInt(signatureLength));
			endOfdirectoryRecord.writeUint32(lastDiskNumber + 1);
			const supportZip64SplitFile = getOptionValue(zipWriter, options, OPTION_SUPPORT_ZIP64_SPLIT_FILE, true);
			if (supportZip64SplitFile) {
				lastDiskNumber = MAX_16_BITS;
				diskNumber = MAX_16_BITS;
			}
			fileEntriesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			directoryDataLength = MAX_32_BITS;
		}
		endOfdirectoryRecord.writeUint32(END_OF_CENTRAL_DIR_SIGNATURE);
		endOfdirectoryRecord.writeUint16(lastDiskNumber);
		endOfdirectoryRecord.writeUint16(diskNumber);
		endOfdirectoryRecord.writeUint16(fileEntriesLength);
		endOfdirectoryRecord.writeUint16(fileEntriesLength);
		endOfdirectoryRecord.writeUint32(directoryDataLength);
		endOfdirectoryRecord.writeUint32(directoryOffset);
		endOfdirectoryRecord.writeUint16(commentLength);
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
			writeUint8: value => { setUint8(view, offset, value); offset += 1; },
			writeUint16: value => { setUint16(view, offset, value); offset += 2; },
			writeUint32: value => { setUint32(view, offset, value); offset += 4; },
			writeUint64: value => { setBigUint64(view, offset, BigInt(value)); offset += 8; },
			writeBytes: value => { arraySet(array, value, offset); offset += getLength(value); },
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

	async function startsWithSplitZipSignature(reader) {
		const signatureArray = await readUint8Array(reader, 0, SPLIT_ZIP_FILE_SIGNATURE_LENGTH);
		return getUint32(getDataView(signatureArray), 0) == SPLIT_ZIP_FILE_SIGNATURE;
	}

	async function copyZipData(zipWriter, reader, entries, directoryOffset, splitZipSignatureLength) {
		const { writer } = zipWriter;
		const entryPositions = new Map();
		if (writer.closeDisk) {
			const sortedEntries = Array.from(entries).sort((firstEntry, secondEntry) =>
				getSourceOffset(reader, firstEntry) - getSourceOffset(reader, secondEntry));
			let copiedLength = 0;
			for (const entry of sortedEntries) {
				const sourceOffset = getSourceOffset(reader, entry);
				await copyData(zipWriter, reader, copiedLength, sourceOffset - copiedLength);
				if (exceedsAvailableSize(writer, await getLocalHeaderLength(reader, sourceOffset))) {
					await writer.closeDisk();
				}
				entryPositions.set(entry, {
					offset: getSegmentOffset(zipWriter, writer),
					diskNumberStart: getDiskNumber(writer)
				});
				copiedLength = sourceOffset;
			}
			await copyData(zipWriter, reader, copiedLength, directoryOffset - copiedLength);
		} else {
			await copyData(zipWriter, reader, 0, directoryOffset);
			entries.forEach(entry => entryPositions.set(entry, {
				offset: splitZipSignatureLength + getSourceOffset(reader, entry),
				diskNumberStart: 0
			}));
		}
		return entryPositions;
	}

	async function copyData(zipWriter, reader, offset, size) {
		if (size > 0) {
			const { writer } = zipWriter;
			await createReadable(reader, { offset, size }).pipeTo(writer.writable, { preventClose: true, preventAbort: true });
			writer.size += size;
			zipWriter.offset += size;
		}
	}

	async function getLocalHeaderLength(reader, offset) {
		const headerArray = await readUint8Array(reader, offset, HEADER_SIZE);
		if (getLength(headerArray) < HEADER_SIZE) {
			return HEADER_SIZE;
		}
		const headerView = getDataView(headerArray);
		return HEADER_SIZE +
			getUint16(headerView, HEADER_OFFSET_FILENAME_LENGTH + LOCAL_HEADER_COMMON_OFFSET) +
			getUint16(headerView, HEADER_OFFSET_EXTRAFIELD_LENGTH + LOCAL_HEADER_COMMON_OFFSET);
	}

	function getSourceOffset(reader, { offset, diskNumberStart }) {
		return offset + (reader.getDiskOffset ? reader.getDiskOffset(diskNumberStart) : 0);
	}

	function getSplitZipSignatureArray() {
		const signatureArray = new Uint8Array(SPLIT_ZIP_FILE_SIGNATURE_LENGTH);
		setUint32(getDataView(signatureArray), 0, SPLIT_ZIP_FILE_SIGNATURE);
		return signatureArray;
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
			const timeNTFS = ((BigInt(date.getTime()) + BigInt(11644473600000)) * BigInt(10000));
			return timeNTFS < MIN_NTFS_TIME ? MIN_NTFS_TIME : timeNTFS > MAX_NTFS_TIME ? MAX_NTFS_TIME : timeNTFS;
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

	function getDateOptionValue(zipWriter, options, name, defaultValue) {
		const date = getOptionValue(zipWriter, options, name, defaultValue);
		if (date === null) {
			return defaultValue;
		}
		if (date !== UNDEFINED_VALUE && (typeof date.getTime != FUNCTION_TYPE || Number.isNaN(date.getTime()))) {
			throw new Error(ERR_INVALID_DATE);
		}
		return date;
	}

	function getFunctionOptionValue(zipWriter, options, name) {
		return checkFunctionOption(getOptionValue(zipWriter, options, name));
	}

	function getAliasedOptionValue(zipWriter, options, name, deprecatedName, defaultValue) {
		const value = getAliasedValue(options, name, deprecatedName);
		const result = value === UNDEFINED_VALUE ? getAliasedValue(zipWriter.options, name, deprecatedName) : value;
		return result === UNDEFINED_VALUE ? defaultValue : result;
	}

	function getAliasedValue(options, name, deprecatedName) {
		return options[name] === UNDEFINED_VALUE ? options[deprecatedName] : options[name];
	}

	function getNumberOptionValue(zipWriter, options, name, defaultValue) {
		return toNumber(getOptionValue(zipWriter, options, name, defaultValue));
	}


	function getMaximumCompressedSize(uncompressedSize) {
		return uncompressedSize + (5 * (Math.floor(uncompressedSize / 16383) + 1));
	}

	function isCompressed(compressionMethod, level) {
		return compressionMethod === UNDEFINED_VALUE
			? (level === UNDEFINED_VALUE || level > 0)
			: compressionMethod !== COMPRESSION_METHOD_STORE;
	}

	function getUint16(view, offset) {
		return view.getUint16(offset, true);
	}

	function getUint32(view, offset) {
		return view.getUint32(offset, true);
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
		headerRecord.writeUint16(version);
		headerRecord.writeUint16(bitFlag);
		headerRecord.writeUint16(compressionMethod);
		if (rawLastModDate === UNDEFINED_VALUE) {
			const dateArray = new Uint32Array(1);
			const dateView = getDataView(dateArray);
			setUint16(dateView, 0, (((lastModDate.getHours() << 6) | lastModDate.getMinutes()) << 5) | lastModDate.getSeconds() / 2);
			setUint16(dateView, 2, ((((lastModDate.getFullYear() - 1980) << 4) | (lastModDate.getMonth() + 1)) << 5) | lastModDate.getDate());
			rawLastModDate = dateArray[0];
		}
		headerRecord.writeUint32(rawLastModDate);
		headerRecord.skip(4);
		if (zip64CompressedSize || compressedSize !== UNDEFINED_VALUE) {
			headerRecord.writeUint32(zip64CompressedSize ? MAX_32_BITS : compressedSize);
		} else {
			headerRecord.skip(4);
		}
		if (zip64UncompressedSize || uncompressedSize !== UNDEFINED_VALUE) {
			headerRecord.writeUint32(zip64UncompressedSize ? MAX_32_BITS : uncompressedSize);
		} else {
			headerRecord.skip(4);
		}
		headerRecord.writeUint16(getLength(rawFilename));
		headerRecord.writeUint16(extraFieldLength);
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


	function getMimeType$1() {
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
				fileName = getRandomFileName$1();
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

	function getRandomFileName$1() {
		if (crypto.randomUUID) {
			return crypto.randomUUID();
		}
		return Array.from(crypto.getRandomValues(new Uint8Array(16)), byteValue => byteValue.toString(16).padStart(2, "0")).join("");
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
				blobPromise = streamToBlob(transformStream.readable);
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
				fileName = getRandomFileName();
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

	function getRandomFileName() {
		if (crypto.randomUUID) {
			return crypto.randomUUID();
		}
		return Array.from(crypto.getRandomValues(new Uint8Array(16)), byteValue => byteValue.toString(16).padStart(2, "0")).join("");
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
		setDefaultConfiguration({ baseURI: (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('zip-fs-native.js', document.baseURI).href)) });
	} catch {
		// ignored
	}

	var{Uint8Array:p,Uint16Array:g,Int32Array:R,TransformStream:H,Math:z,Error:L,Array:k}=globalThis,pe=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],Z=new p(0),qe=new g(0),de=[];for(let e=0;e<6;e++)de.push(e,0==e?8:4);de.push(0,1);var Se=[];for(let e=0;e<14;e++)Se.push(e,0==e?4:2);var Ee=new g([0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576]),ge=new g([0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0]);function M(e,t,n,r,i){if(0==i)return;let f=e instanceof p?e:new p(e.buffer,e.byteOffset,e.byteLength),_=n instanceof p?n.subarray(r,r+i):new p(n.buffer,n.byteOffset+r,i);f.set(_,t);}function Ve(e,t,n){0!=n&&(e instanceof p?e:new p(e.buffer,e.byteOffset,e.byteLength)).fill(0,t,t+n);}function je(){return {next_in:Z,next_in_index:0,avail_in:0,total_in:0,next_out:Z,next_out_index:0,avail_out:0,total_out:0,msg:"",t:0,i:0,_:0,l:void 0}}function Je(e,t){let n=1<<t;return {o:e,u:new p(n),h:n,v:t,k:0,m:0,p:0,T:0}}function te(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1];for(let e=0;e<i;e++)t.push(r);}return new g(t)}var ne=class{constructor(e,t){this.M=e,this.C=t,this.Z=0;}},re=class{constructor(e,t,n,r,i){this.W=e,this.q=t,this.S=n,this.L=r,this.$=i;}};function D_(e){return Q_[e<-6||e>2?9:2-e]||""}function we(e,t){try{e.msg=D_(t);}catch(n){e.msg="zlib error "+String(t)+" ("+n+")";}return t}function $e(e,t){let n=e>>>0,r=0;for(let e=0;e<t;e++)r=r<<1|1&n,n>>>=1;return r}function T(e,t){e.D[e.A++]=t;}function Ae(e,t){T(e,255&t),T(e,t>>>8&255);}function e_(e,t,n){let r=255&n,i=65535&t,f=e.I+e.H;return e.D[f]=255&i,e.D[f+1]=i>>>8&255,e.D[f+2]=r,e.H+=3,i=i-1&65535,e.N[__[r]+ie+1].j++,e.U[y_(i)].j++,e.H==e.R}function De(e,t){let n=255&t,r=e.I+e.H;return e.D[r]=0,e.D[r+1]=0,e.D[r+2]=n,e.H+=3,e.N[n].j++,e.H==e.R}function ye(e){return e.h-ae}function y_(e){return e<256?A_[e]:A_[256+(e>>7)]}function v_(e){let t=Ce+7,n=1<<t,r=(1<<t)-1,i=z.floor((t+v-1)/v),f=1<<8+Ce;return {...Je(e,15),o:e,Y:42,P:0,B:void 0,F:32767,G:t,O:n,V:r,X:i,J:new g(32768),K:new g(n),ee:f,D:new p(32768),te:0,ne:32768,A:0,re:0,ie:0,fe:0,_e:0,le:0,oe:-2,ue:0,ae:0,ce:0,se:0,he:0,de:0,we:0,be:0,ve:0,ke:0,ge:0,me:0,pe:0,xe:0,Te:new R(2*Te+1),ye:new p(2*Te+1),ze:new g(be+1),H:0,R:0,Me:Z,I:0,Ce:0,Ze:0,We:8,qe:32768,Se:0,Le:0,$e:0,N:new k(fe).fill(0).map(()=>Q()),U:new k(2*me+1).fill(0).map(()=>Q()),De:new k(2*oe+1).fill(0).map(()=>Q()),Ae:w_(),Ie:w_(),He:w_()}}function I_(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1],f=Q();f.Qe=r,f.je=i,t.push(f);}return t}function Q(){return {j:0,Qe:0,Ne:0,je:0}}function w_(){return new ne([],dn(null,Z,0,0,0))}function dn(e,t,n,r,i){return new re(e,t,n,r,i)}function $_(){let e=new k(288).fill(0);for(let t=0;t<=143;t++)e[t]=8;for(let t=144;t<=255;t++)e[t]=9;for(let t=256;t<=279;t++)e[t]=7;for(let t=280;t<=287;t++)e[t]=8;return e}function k_(e){let{code:t,length:n}=mn(e),r=new g(2*e.length),i=0;for(let f=0;f<e.length;f++){let e=n[f]||0,_=t[f]||0;r[i++]=e?$e(_,e):0,r[i++]=e;}return new g(r)}function et(e,t,n){let r=0;for(let n=0;n<e.length;n++){let i=t[n]?1<<t[n]:1,f=e[n]+i-1;f>r&&(r=f);}r<n&&(r=n);let i=new p(r+1);for(let n=0;n<=r;n++)for(let r=0;r<e.length;r++){let f=t[r]?1<<t[r]:1,_=e[r];if(n>=_&&n<=_+f-1){i[n]=r;break}}let f=0;for(let n=0;n<e.length-1;n++){let r=t[n]?1<<t[n]:1,i=e[n]+r-1;i>f&&(f=i);}return i[f]=e.length-1,i}function _t(e,t){let n=0;for(let r=0;r<e.length;r++){let i=t[r]?1<<t[r]:1,f=e[r]+i-1;f>n&&(n=f);}let r=new p(n+1);for(let i=0;i<=n;i++)for(let n=0;n<e.length;n++){let f=t[n]?1<<t[n]:1,_=e[n];if(i>=_&&i<=_+f-1){r[i]=n;break}}return r}function tt(e){let t=new p(512),n=e.length-1;for(let r=0;r<256;r++)t[r]=r<=n?e[r]:e[n];for(let r=256;r<=n;r++){let n=r>>7;t[256+(n>255?255:n)]=e[r];}for(let e=257;e<512;e++)0==t[e]&&(t[e]=t[e-1]);return t}function mn(e){let t=z.max(...e),n=new k(t+1).fill(0);for(let t of e)t>0&&n[t]++;let r=new k(e.length).fill(0),i=new k(t+1).fill(0),f=0;for(let e=1;e<=t;e++)f=f+n[e-1]<<1,i[e]=f;for(let t=0;t<e.length;t++){let n=e[t];0!=n&&(r[t]=i[n]++);}return {code:r,length:e}}var Ce=8,v=3,ee=258,ae=ee+v+1,nt=4096,Ue=16,He=ee,bn=29,ie=256,Te=ie+1+bn,me=30,oe=19,fe=2*Te+1,be=15,rt=9,at=255,it=32,ot=4,ve=256,t_=16,n_=17,r_=18,ft=0,N_=1,lt=2,$=-1,Q_=["need dictionary","stream end","","file error","stream error","data error","insufficient memory","buffer error",""],a_=te(de),i_=te(Se),Be=new g(19);Be[16]=2,Be[17]=3,Be[18]=7;var hn=k_($_()),sn=k_(new k(30).fill(5)),Fe=I_(hn),R_=I_(sn),__=et(ge,a_,ee),A_=tt(_t(Ee,i_));function he(e,t,n){if(void 0===t||void 0===n)return 1;let r=65535&e,i=e>>>16&65535,f=0;for(;n>0;){let e=n>2e3?2e3:n;n-=e;do{r=r+t[f++]|0,i=i+r|0;}while(--e);r%=65521,i%=65521;}return (i<<16|r)>>>0}var Ze=[[],[],[],[],[],[],[],[]];for(let e=0;e<256;e++){let t=e;for(let e=0;e<8;e++)t=1&t?3988292384^t>>>1:t>>>1;Ze[0][e]=t;}for(let e=0;e<256;e++)for(let t=1;t<8;t++){let n=Ze[t-1][e];Ze[t][e]=n>>>8^Ze[0][255&n];}var[ut,xn,pn,Sn,En,gn,Tn,wn]=Ze;function W(e=0,t,n){if(!t)return 0;void 0===n&&(n=t.length);let r=0|~e,i=0;if((n=z.min(n,t.length))>=8){let e=new DataView(t.buffer,t.byteOffset,n),f=n-8;for(;i<=f;i+=8){let t=r^e.getInt32(i,true),n=e.getInt32(i+4,true);r=wn[255&t]^Tn[t>>>8&255]^gn[t>>>16&255]^En[t>>>24&255]^Sn[255&n]^pn[n>>>8&255]^xn[n>>>16&255]^ut[n>>>24&255];}}for(;i<n;i++)r=r>>>8^ut[255&(r^t[i])];return (4294967295^r)>>>0}function xt(e){16==e.T?(Ae(e,e.p),e.p=0,e.T=0):e.T>=8&&(T(e,e.p),e.p>>=8,e.T-=8);}function pt(e){e.T>8?Ae(e,e.p):e.T>0&&T(e,e.p),e.Ce=1+(e.T-1&7),e.p=0,e.T=0;}function An(e,t,n){let r,i,f=[],_=0;for(r=1;r<=be;r++)_=_+n[r-1]<<1,f[r]=_;for(i=0;i<=t;i++){let t=e[i].je;0!=t&&(e[i].Qe=$e(f[t]++,t));}}function C(e,t,n){e.T>Ue-n?(e.p=65535&(e.p|t<<e.T),Ae(e,e.p),e.p=t>>Ue-e.T&65535,e.T+=n-Ue):(e.p=65535&(e.p|t<<e.T),e.T+=n);}function St(e){for(let t=0;t<e.N.length;t++)e.N[t].j=0;for(let t=0;t<e.U.length;t++)e.U[t].j=0;for(let t=0;t<e.De.length;t++)e.De[t].j=0;e.N[ve].j=1,e.ie=e.fe=0,e.H=e._e=0;}function Et(e){if(e.N&&e.N.length>=fe)for(let t=0;t<fe;t++)e.N[t]=Q();else {e.N=[];for(let t=0;t<fe;t++)e.N.push(Q());}if(e.U&&e.U.length>=2*me+1)for(let t=0;t<2*me+1;t++)e.U[t]=Q();else {e.U=[];for(let t=0;t<2*me+1;t++)e.U.push(Q());}if(e.De&&e.De.length>=2*oe+1)for(let t=0;t<2*oe+1;t++)e.De[t]=Q();else {e.De=[];for(let t=0;t<2*oe+1;t++)e.De.push(Q());}e.Ae=new ne(e.N,new re(Fe,a_,ie+1,Te,be)),e.Ie=new ne(e.U,new re(R_,i_,0,me,be)),e.He=new ne(e.De,new re(null,Be,0,oe,7)),e.p=0,e.T=0,e.Ce=0,St(e);}var se=1;function Dn(e,t,n){return n=e.Te[se],e.Te[se]=e.Te[e.Le--],z_(e,t,se),n}function mt(e,t,n,r){return e[t].j<e[n].j||e[t].j==e[n].j&&r[t]<=r[n]}function z_(e,t,n){let r=e.Te[n],i=n<<1;for(;i<=e.Le&&(i<e.Le&&mt(t,e.Te[i+1],e.Te[i],e.ye)&&i++,!mt(t,r,e.Te[i],e.ye));)e.Te[n]=e.Te[i],n=i,i<<=1;e.Te[n]=r;}function yn(e,t){let n,r,i,f,_,l,o=t.M,u=t.Z,a=t.C.W,c=t.C.q,s=t.C.S,h=t.C.$,d=0;for(f=0;f<=be;f++)e.ze[f]=0;for(o[e.Te[e.$e]].je=0,n=e.$e+1;n<fe;n++)r=e.Te[n],f=o[o[r].Ne].je+1,f>h&&(f=h,d++),o[r].je=f,!(r>u)&&(e.ze[f]++,_=0,r>=s&&(_=c[r-s]),l=o[r].j,e.ie+=l*(f+_),a&&(e.fe+=l*(a[r].je+_)));if(0!=d){do{for(f=h-1;0==e.ze[f];)f--;e.ze[f]--,e.ze[f+1]+=2,e.ze[h]--,d-=2;}while(d>0);for(f=h;0!=f;f--)for(r=e.ze[f];0!=r;)i=e.Te[--n],!(i>u)&&(o[i].je!=f&&(e.ie+=(f-o[i].je)*o[i].j,o[i].je=f),r--);}}function L_(e,t){let n,r,i,f=t.M,_=t.C.W,l=t.C.L,o=-1;for(e.Le=0,e.$e=fe,n=0;n<l;n++)0!=f[n].j?(e.Te[++e.Le]=o=n,e.ye[n]=0):f[n].je=0;for(;e.Le<2;)i=e.Te[++e.Le]=o<2?++o:0,f[i].j=1,e.ye[i]=0,e.ie--,_&&(e.fe-=_[i].je);for(t.Z=o,n=z.floor(e.Le/2);n>=1;n--)z_(e,f,n);i=l;do{n=Dn(e,f,n),r=e.Te[se],e.Te[--e.$e]=n,e.Te[--e.$e]=r,f[i].j=f[n].j+f[r].j,e.ye[i]=(e.ye[n]>=e.ye[r]?e.ye[n]:e.ye[r])+1,f[n].Ne=f[r].Ne=i,e.Te[se]=i++,z_(e,f,se);}while(e.Le>=2);e.Te[--e.$e]=e.Te[se],yn(e,t),An(f,t.Z,e.ze);}function bt(e,t,n){let r,i,f=-1,_=t[0].je,l=0,o=7,u=4;for(0==_&&(o=138,u=3),t[n+1].je=65535,r=0;r<=n;r++)i=_,_=t[r+1].je,!(++l<o&&i==_)&&(l<u?e.De[i].j+=l:0!=i?(i!=f&&e.De[i].j++,e.De[t_].j++):l<=10?e.De[n_].j++:e.De[r_].j++,l=0,f=i,0==_?(o=138,u=3):i==_?(o=6,u=3):(o=7,u=4));}function ht(e,t,n){let r,i=-1,f=t[0].je,_=0,l=7,o=4;0==f&&(l=138,o=3);for(let u=0;u<=n;u++)if(r=f,f=t[u+1].je,!(++_<l&&r==f)){if(_<o)do{C(e,e.De[r].Qe,e.De[r].je);}while(0!=--_);else 0!=r?(r!=i&&(C(e,e.De[r].Qe,e.De[r].je),_--),C(e,e.De[t_].Qe,e.De[t_].je),C(e,_-3,2)):_<=10?(C(e,e.De[n_].Qe,e.De[n_].je),C(e,_-3,3)):(C(e,e.De[r_].Qe,e.De[r_].je),C(e,_-11,7));_=0,i=r,0==f?(l=138,o=3):r==f?(l=6,o=3):(l=7,o=4);}}function vn(e){let t;for(bt(e,e.N,e.Ae.Z),bt(e,e.U,e.Ie.Z),L_(e,e.He),t=oe-1;t>=3&&0==e.De[pe[t]].je;t--);return e.ie+=3*(t+1)+5+5+4,t}function In(e,t,n,r){let i;for(C(e,t-257,5),C(e,n-1,5),C(e,r-4,4),i=0;i<r;i++)C(e,e.De[pe[i]].je,3);ht(e,e.N,t-1),ht(e,e.U,n-1);}function Pe(e,t,n,r,i=0){C(e,(ft<<1)+r,3),pt(e),Ae(e,n),Ae(e,~n),n&&t&&M(e.D,e.A,t,i,n),e.A+=n;}function gt(e){xt(e);}function Tt(e){C(e,N_<<1,3),C(e,Fe[ve].Qe,Fe[ve].je),xt(e);}function st(e,t,n){let r,i,f,_,l=0;if(0!=e.H)do{r=255&e.Me[l],r+=(255&e.Me[l+1])<<8,i=e.Me[l+2],l+=3,0==r?C(e,t[i].Qe,t[i].je):(f=__[i],C(e,t[f+ie+1].Qe,t[f+ie+1].je),_=a_[f],0!=_&&(i-=ge[f],C(e,i,_)),r--,f=y_(r),C(e,n[f].Qe,n[f].je),_=i_[f],0!=_&&(r-=Ee[f],C(e,r,_)));}while(l<e.H);C(e,t[ve].Qe,t[ve].je);}function kn(e){let t,n=4093624447;for(t=0;t<=31;t++,n>>=1)if(1&n&&0!=e.N[t].j)return 0;if(0!=e.N[9].j||0!=e.N[10].j||0!=e.N[13].j)return 1;for(t=32;t<ie;t++)if(0!=e.N[t].j)return 1;return 0}function wt(e,t,n,r,i=0){let f,_,l=0;e.ve>0?(2==e.o.t&&(e.o.t=kn(e)),L_(e,e.Ae),L_(e,e.Ie),l=vn(e),f=e.ie+3+7>>3,_=e.fe+3+7>>3,(_<=f||4==e.ke)&&(f=_)):f=_=n+5,n+4<=f&&t?Pe(e,t,n,r,i):_==f?(C(e,(N_<<1)+r,3),st(e,Fe,R_)):(C(e,(lt<<1)+r,3),In(e,e.Ae.Z+1,e.Ie.Z+1,l+1),st(e,e.N,e.U)),St(e),r&&pt(e);}function vt(){let e=je();return e.l=v_(e),e}var Ye=[{Ue:Lt,Re:0,Ye:0,Ee:0,Pe:0},{Ue:U_,Re:4,Ye:4,Ee:8,Pe:4},{Ue:U_,Re:4,Ye:5,Ee:16,Pe:8},{Ue:U_,Re:4,Ye:6,Ee:32,Pe:32},{Ue:Ne,Re:4,Ye:4,Ee:16,Pe:16},{Ue:Ne,Re:8,Ye:16,Ee:32,Pe:32},{Ue:Ne,Re:8,Ye:16,Ee:128,Pe:128},{Ue:Ne,Re:8,Ye:32,Ee:128,Pe:256},{Ue:Ne,Re:32,Ye:128,Ee:258,Pe:1024},{Ue:Ne,Re:32,Ye:258,Ee:258,Pe:4096}];function At(e){return 2*e-(e>4?9:0)}function l_(e,t,n){return ((t<<e.X^n)&e.V)>>>0}function u_(e,t){e.be=l_(e,e.be,e.u[t+(v-1)]);let n=e.J[t&e.F]=e.K[e.be];return e.K[e.be]=t,n}function It(e){e.K[e.O-1]=0,Ve(e.K,0,(e.O-1)*e.K.BYTES_PER_ELEMENT);}function Un(e){let t,n,r=e.h;for(t=e.O;t>0;)t--,n=e.K[t],e.K[t]=n>=r?n-r:0;for(t=r;t>0;)t--,n=e.J[t],e.J[t]=n>=r?n-r:0;}function H_(e,t,n,r){let i=e.avail_in;return i>r&&(i=r),0==i?0:(e.avail_in-=i,M(t,n,e.next_in,e.next_in_index,i),1==e.l.P?e.i=he(e.i,new p(t.buffer,t.byteOffset+n,i),i):2==e.l.P&&(e.i=W(e.i,new p(t.buffer,t.byteOffset+n,i),i)),e.next_in_index+=i,e.total_in+=i,i)}function c_(e){let t,n,r=e.h;do{if(n=e.qe-e.ce-e.ae,0==n&&0==e.ae&&0==e.ce?n=r:-1==n&&n--,e.ae>=r+ye(e)&&(M(e.u,0,e.u,r,r-n),e.Se-=r,e.ae-=r,e.ue-=r,e.le>e.ae&&(e.le=e.ae),Un(e),n+=r),0==e.o.avail_in)break;if(t=H_(e.o,e.u,e.ae+e.ce,n),e.ce+=t,e.ce+e.le>=v){let t=e.ae-e.le;for(e.be=e.u[t],e.be=l_(e,e.be,e.u[t+1]);e.le&&(e.be=l_(e,e.be,e.u[t+v-1]),e.J[t&e.F]=e.K[e.be],e.K[e.be]=t,t++,e.le--,!(e.ce+e.le<v)););}}while(e.ce<ae&&0!=e.o.avail_in);if(e.k<e.qe){let t,n=e.ae+e.ce;e.k<n?(t=e.qe-n,t>He&&(t=He),Ve(e.u,n,t),e.k=n+t):e.k<n+He&&(t=n+He-e.k,t>e.qe-e.k&&(t=e.qe-e.k),Ve(e.u,e.k,t),e.k+=t);}}function kt(e,t,n=8,r=15,i=Ce,f=0){let _=1;if(!e)return  -2;if(e.msg="",-1==t&&(t=6),r<0){if(_=0,r<-15)return  -2;r=-r;}else r>15&&(_=2,r-=16);if(i<1||i>rt||8!=n||r<8||r>15||t<0||t>9||f<0||f>4||8==r&&1!=_)return  -2;8==r&&(r=9);let l=v_(e);return l?(e.l=l,l.o=e,l.Y=42,l.P=_,l.B=void 0,l.v=r,l.h=1<<l.v,l.F=l.h-1,l.G=i+7,l.O=1<<l.G,l.V=l.O-1,l.X=(l.G+v-1)/v,l.u=new p(2*l.h),l.J=new g(l.h),l.K=new g(l.O),l.k=0,l.ee=1<<i+6,l.D=new p(l.ee*ot),l.ne=4*l.ee,l.u&&l.J&&l.K&&l.D?(l.Me=l.D.subarray(l.ee),l.I=l.te+l.ee,l.R=3*(l.ee-1),l.ve=t,l.ke=f,l.We=n,Fn(e)):(l.Y=666,e.msg=D_(-4),P_(e),-4)):-4}function Z_(e){if(null==e)return  true;let t=e.l;return !t||t.o!=e||42!=t.Y&&57!=t.Y&&69!=t.Y&&73!=t.Y&&91!=t.Y&&103!=t.Y&&113!=t.Y&&666!=t.Y}function Hn(e){let t;return Z_(e)?-2:(e.total_in=e.total_out=0,e.msg="",e.t=2,t=e.l,t.A=0,t.re=t.te,t.P<0&&(t.P=-t.P),t.Y=2==t.P?57:42,e.i=2==t.P?W(0):he(0),t.oe=-2,Et(t),0)}function Bn(e){e.qe=2*e.h,It(e),e.xe=Ye[e.ve].Ye,e.ge=Ye[e.ve].Re,e.me=Ye[e.ve].Ee,e.pe=Ye[e.ve].Pe,e.ae=0,e.ue=0,e.ce=0,e.le=0,e.se=e.he=v-1,e.we=0,e.be=0;}function Fn(e){let t=Hn(e);return 0==t&&Bn(e.l),t}function Me(e,t){T(e,t>>8),T(e,255&t);}function q(e){let t,n=e.l;gt(n),t=n.A,t>e.avail_out&&(t=e.avail_out),0!=t&&(M(e.next_out,e.next_out_index,n.D,n.re,t),e.next_out_index+=t,n.re+=t,e.total_out+=t,e.avail_out-=t,n.A-=t,0==n.A&&(n.re=n.te));}function Ie(e,t){let n=e.l;n.B&&n.B.Be&&(e.i=W(e.i,new p(n.D.buffer,n.te+t,n.A-t),n.A-t));}function Nt(e,t){let n,r=e.l;if(Z_(e)||t>5||t<0)return we(e,-2);if(!e.next_out||0!=e.avail_in&&!e.next_in||666==r.Y&&4!=t)return we(e,-2);if(0==e.avail_out)return we(e,-5);if(n=r.oe,r.oe=t,0!=r.A){if(q(e),0==e.avail_out)return r.oe=$,0}else if(0==e.avail_in&&At(t)<=At(n)&&4!=t)return we(e,-5);if(666==r.Y&&0!=e.avail_in)return we(e,-5);if(42==r.Y&&0==r.P&&(r.Y=113),42==r.Y){let t,n=8+(r.v-8<<4)<<8;if(t=r.ke>=2||r.ve<2?0:r.ve<6?1:6==r.ve?2:3,n|=t<<6,0!=r.ae&&(n|=it),n+=31-n%31,Me(r,n),0!=r.ae&&(Me(r,e.i>>16),Me(r,65535&e.i)),e.i=1,r.Y=113,q(e),0!=r.A)return r.oe=$,0}if(57==r.Y)if(e.i=W(0),T(r,31),T(r,139),T(r,8),r.B)T(r,(r.B.Fe?1:0)+(r.B.Be?2:0)+(null==r.B.Ge?0:4)+(null==r.B.Oe?0:8)+(null==r.B.Ve?0:16)),T(r,255&r.B.Xe),T(r,r.B.Xe>>>8&255),T(r,r.B.Xe>>>16&255),T(r,r.B.Xe>>>24&255),T(r,9==r.ve?2:r.ke>=2||r.ve<2?4:0),T(r,255&r.B.Je),null!=r.B.Ge&&(T(r,255&r.B.Ke),T(r,r.B.Ke>>>8&255)),r.B.Be&&(e.i=W(e.i,r.D,r.A)),r.Ze=0,r.Y=69;else if(T(r,0),T(r,0),T(r,0),T(r,0),T(r,0),T(r,9==r.ve?2:r.ke>=2||r.ve<2?4:0),T(r,at),r.Y=113,q(e),0!=r.A)return r.oe=$,0;if(69==r.Y){if(r.B&&null!=r.B.Ge){let t=r.A,n=(65535&r.B.Ke)-r.Ze;for(;r.A+n>r.ne;){let i=r.ne-r.A;if(M(r.D,r.A,r.B.Ge,r.Ze,i),r.A=r.ne,Ie(e,t),r.Ze+=i,q(e),0!=r.A)return r.oe=$,0;t=0,n-=i;}M(r.D,r.A,r.B.Ge,r.Ze,n),r.A+=n,Ie(e,t),r.Ze=0;}r.Y=73;}if(73==r.Y){if(r.B&&r.B.Oe&&r.B.Oe.length){let t,n=r.A;do{if(r.A==r.ne){if(Ie(e,n),q(e),0!=r.A)return r.oe=$,0;n=0;}t=r.B.Oe[r.Ze++],T(r,t);}while(0!=t);Ie(e,n),r.Ze=0;}r.Y=91;}if(91==r.Y){if(r.B&&r.B.Ve&&r.B.Ve.length){let t,n=r.A;do{if(r.A==r.ne){if(Ie(e,n),q(e),0!=r.A)return r.oe=$,0;n=0;}t=r.B.Ve[r.Ze++],T(r,t);}while(0!=t);Ie(e,n);}r.Y=103;}if(103==r.Y){if(r.B&&r.B.Be){if(r.A+2>r.ne&&(q(e),0!=r.A))return r.oe=$,0;T(r,255&e.i),T(r,e.i>>>8&255),e.i=W(0);}if(r.Y=113,q(e),0!=r.A)return r.oe=$,0}if(0!=e.avail_in||0!=r.ce||0!=t&&666!=r.Y){let n=0==r.ve?Lt(r,t):2==r.ke?Pn(r,t):3==r.ke?Zn(r,t):Ye[r.ve].Ue(r,t);if((2==n||3==n)&&(r.Y=666),0==n||2==n)return 0==e.avail_out&&(r.oe=$),0;if(1==n&&(1==t?Tt(r):5!=t&&(Pe(r,null,0,0),3==t&&(It(r),0==r.ce&&(r.ae=0,r.ue=0,r.le=0))),q(e),0==e.avail_out))return r.oe=$,0}return 4!=t?0:r.P<=0?1:(2==r.P?(T(r,255&e.i),T(r,e.i>>>8&255),T(r,e.i>>>16&255),T(r,e.i>>>24&255),T(r,255&e.total_in),T(r,e.total_in>>>8&255),T(r,e.total_in>>>16&255),T(r,e.total_in>>>24&255)):(Me(r,e.i>>>16&65535),Me(r,65535&e.i)),q(e),r.P>0&&(r.P=-r.P),0!=r.A?0:1)}function P_(e){if(Z_(e))return  -2;let t=e.l,n=t.Y;return t.u=Z,t.J=qe,t.K=qe,t.D=Z,t.Me=Z,t.Te=new R(0),t.ye=Z,t.ze=qe,t.N.length=0,t.U.length=0,t.De.length=0,t.B=void 0,t.te=0,t.re=0,t.I=0,113==n?-3:0}function Rt(e,t){let n,r,i=e.pe,f=e.ae,_=e.he,l=e.me,o=e.ae>ye(e)?e.ae-ye(e):0,u=e.J,a=e.F,c=e.u,s=e.ce,h=ee<s?ee:s,d=c[f],w=c[f+1],b=c[f+_-1],v=c[f+_];_>=e.ge&&(i>>=2),l>s&&(l=s);do{if(n=t,c[n+_]!=v||c[n+_-1]!=b||c[n]!=d||c[n+1]!=w)continue;let i=2;for(;i<h&&c[f+i]==c[n+i];)i++;if(r=i,r>_){if(e.Se=t,_=r,r>=l)break;b=c[f+_-1],v=c[f+_];}}while((t=u[t&a])>o&&0!=--i);return _<=s?_:s}function zt(e,t){wt(e,e.u,e.ae-e.ue,t,e.ue),e.ue=e.ae,q(e.o);}function j(e,t){return zt(e,t?1:0),0==e.o.avail_out?t?2:0:null}var Dt=65535;function ke(e,t){return e<t?e:t}function Lt(e,t){let n,r,i,f=ke(e.ne-5,e.h),_=0,l=e.o.avail_in;do{if(n=Dt,i=e.T+42>>3,e.o.avail_out<i||(i=e.o.avail_out-i,r=e.ae-e.ue,n>r+e.o.avail_in&&(n=r+e.o.avail_in),n>i&&(n=i),n<f&&(0==n&&4!=t||0==t||n!=r+e.o.avail_in)))break;_=4==t&&n==r+e.o.avail_in?1:0,Pe(e,null,0,_),e.D[e.A-4]=n,e.D[e.A-3]=n>>8,e.D[e.A-2]=~n,e.D[e.A-1]=~n>>8,q(e.o),r&&(r>n&&(r=n),M(e.o.next_out,e.o.next_out_index,e.u,e.ue,r),e.o.next_out_index+=r,e.o.avail_out-=r,e.o.total_out+=r,e.ue+=r,n-=r),n&&(H_(e.o,e.o.next_out,e.o.next_out_index,n),e.o.next_out_index+=n,e.o.avail_out-=n,e.o.total_out+=n);}while(0==_);if(l-=e.o.avail_in,l){if(l>=e.h){e._e=2;let t=e.o.next_in_index-e.h;M(e.u,0,e.o.next_in,t,e.h),e.ae=e.h,e.le=e.ae;}else e.qe-e.ae<=l&&(e.ae-=e.h,M(e.u,0,e.u,e.h,e.ae),e._e<2&&e._e++,e.le>e.ae&&(e.le=e.ae)),M(e.u,e.ae,e.o.next_in,e.o.next_in_index-l,l),e.ae+=l,e.le+=ke(l,e.h-e.le);e.ue=e.ae;}return e.k<e.ae&&(e.k=e.ae),_?(e.Ce=8,3):0!=t&&4!=t&&0==e.o.avail_in&&e.ae==e.ue?1:(i=e.qe-e.ae,e.o.avail_in>i&&e.ue>=e.h&&(e.ue-=e.h,e.ae-=e.h,M(e.u,0,e.u,e.h,e.ae),e._e<2&&e._e++,i+=e.h,e.le>e.ae&&(e.le=e.ae)),i>e.o.avail_in&&(i=e.o.avail_in),i&&(H_(e.o,e.u,e.ae,i),e.ae+=i,e.le+=ke(i,e.h-e.le)),e.k<e.ae&&(e.k=e.ae),i=e.T+42>>3,i=ke(e.ne-i,Dt),f=ke(i,e.h),r=e.ae-e.ue,(r>=f||(r||4==t)&&0!=t&&0==e.o.avail_in&&r<=i)&&(n=ke(r,i),_=4==t&&0==e.o.avail_in&&n==r?1:0,Pe(e,e.u,n,_,e.ue),e.ue+=n,q(e.o)),_&&(e.Ce=8),_?2:0)}function U_(e,t){let n,r=false;for(;;){if(e.ce<ae){if(c_(e),e.ce<ae&&0==t)return 0;if(0==e.ce)break}if(n=0,e.ce>=v&&(n=u_(e,e.ae)),0!=n&&e.ae-n<=ye(e)&&(e.se=Rt(e,n)),e.se>=v)if(e.ae,e.Se,e.se,r=e_(e,e.ae-e.Se,e.se-v),e.ce-=e.se,e.se<=e.xe&&e.ce>=v){e.se--;do{e.ae++,n=u_(e,e.ae);}while(0!=--e.se);e.ae++;}else e.ae+=e.se,e.se=0,e.be=e.u[e.ae],e.be=l_(e,e.be,e.u[e.ae+1]);else r=De(e,e.u[e.ae]),e.ce--,e.ae++;if(r){let t=j(e,false);if(null!=t)return t}}if(e.le=e.ae<v-1?e.ae:v-1,4==t){let t=j(e,true);return null!=t?t:3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}function Ne(e,t){let n,r=false;for(;;){if(e.ce<ae){if(c_(e),e.ce<ae&&0==t)return 0;if(0==e.ce)break}if(n=0,e.ce>=v&&(n=u_(e,e.ae)),e.he=e.se,e.de=e.Se,e.se=v-1,0!=n&&e.he<e.xe&&e.ae-n<=ye(e)&&(e.se=Rt(e,n),e.se<=5&&(1==e.ke||e.se==v&&e.ae-e.Se>nt)&&(e.se=v-1)),e.he>=v&&e.se<=e.he){let t=e.ae+e.ce-v;e.ae,e.de,e.he,r=e_(e,e.ae-1-e.de,e.he-v),e.ce-=e.he-1,e.he-=2;do{++e.ae<=t&&(n=u_(e,e.ae));}while(0!=--e.he);if(e.we=0,e.se=v-1,e.ae++,r){let t=j(e,false);if(null!=t)return t}}else if(e.we){if(r=De(e,e.u[e.ae-1]),r&&zt(e,0),e.ae++,e.ce--,0==e.o.avail_out)return 0}else e.we=1,e.ae++,e.ce--;}if(e.we&&(r=De(e,e.u[e.ae-1]),e.we=0),e.le=e.ae<v-1?e.ae:v-1,4==t){let t=j(e,true);return null!=t?t:3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}function Zn(e,t){let n,r,i,f;for(;;){if(e.ce<=ee){if(c_(e),e.ce<=ee&&0==t)return 0;if(0==e.ce)break}if(e.se=0,e.ce>=v&&e.ae>0&&(i=e.ae-1,r=e.u[i],r==++i&&r==++i&&r==++i)){f=e.ae+ee;do{}while(r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&i<f);e.se=ee-(f-i),e.se>e.ce&&(e.se=e.ce);}if(e.se>=v?(e.ae,e.ae,e.se,n=e_(e,1,e.se-v),e.ce-=e.se,e.ae+=e.se,e.se=0):(n=De(e,e.u[e.ae]),e.ce--,e.ae++),n){let t=j(e,false);if(null!=t)return t}}if(e.le=0,4==t){let t=j(e,true);return null!=t?t:3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}function Pn(e,t){let n=false;for(;;){if(0==e.ce&&(c_(e),0==e.ce)){if(0==t)return 0;break}if(e.se=0,n=De(e,e.u[e.ae]),e.ce--,e.ae++,n){let t=j(e,false);if(null!=t)return t}}if(e.le=0,4==t){let t=j(e,true);return null!=t?t:3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}var ue=852,d_=592,m_=594,Ot=Ee.map(e=>e+1),Ct=ge.subarray(0,-1).map(e=>e+3),Mn=[16,1,73,1,200,1],Yn=[144,1,72,1,78,1],Ut=Se.map(qt),Ht=Se.map(Vt);Ut.push(64,2),Ht.push(142,2);var Bt=de.slice(0,-2).map(qt),Ft=de.slice(0,-2).map(Vt);Bt.push(...Mn),Ft.push(...Yn);var Zt=new g([...Ct,258,0,0]),Pt=new g([...Ct,3,0,0]),Mt=te(Bt),Yt=te(Ft),Xt=new g([...Ot,0,0]),Wt=new g([...Ot,32769,49153]),Gt=te(Ut),Kt=te(Ht);function qt(e,t){return t%2?e:e+16}function Vt(e,t){return t%2?e:e+128}function Jt(e,t){let n,r=e.l,i=e.next_in_index,f=e.next_out_index,_=e.next_in,l=e.next_out,o=r.u,u=r.p>>>0,a=r.T>>>0,c=r.et,s=r.tt,h=(1<<r.nt)-1,d=(1<<r.rt)-1,w=r.h>>>0,b=r.k>>>0,v=r.m>>>0,k=r.it,g=f-(t-e.avail_out),m=f+(e.avail_out-257),p=i+(e.avail_in-5),x=0,T=0,y=0,z=0;e:do{for(;a<15;){if(!(i<_.length))break e;u+=_[i++]<<a,a+=8;}n=c[u&h];t:for(;;){if(y=n>>>16&255,u>>>=y,a-=y,y=n>>>24,0==y){l[f++]=65535&n;break}if(16&y){if(x=65535&n,y&=15,y){for(;a<y;){if(!(i<_.length)){r.ft=16200;break e}u+=_[i++]<<a,a+=8;}x+=u&(1<<y)-1,u>>>=y,a-=y;}for(;a<15;){if(!(i<_.length)){r.ft=16200;break e}u+=_[i++]<<a,a+=8;}n=s[u&d];n:for(;;){if(y=n>>>16&255,u>>>=y,a-=y,y=n>>>24,16&y){if(T=65535&n,y&=15,y){for(;a<y;){if(!(i<_.length)){r.ft=16200;break e}u+=_[i++]<<a,a+=8;}T+=u&(1<<y)-1,u>>>=y,a-=y;}let t=x,c=f-g;if(T>c){let n=T-c;if(n>b&&k){e.msg="invalid distance too far back",r.ft=16209;break e}if(0==v){if(z=w-n,!(n<t)){for(let e=0;e<t;++e)l[f++]=o[z++];continue e}for(let e=0;e<n;++e)l[f++]=o[z++];t-=n,z=f-T;}else if(v<n){z=w+v-n;let e=n-v;if(!(e<t)){for(let e=0;e<t;++e)l[f++]=o[z++];continue e}for(let t=0;t<e;++t)l[f++]=o[z++];if(t-=e,z=0,v<t){for(let e=0;e<v;++e)l[f++]=o[z++];t-=v,z=f-T;}}else {if(z=v-n,!(n<t)){for(let e=0;e<t;++e)l[f++]=o[z++];continue e}for(let e=0;e<n;++e)l[f++]=o[z++];t-=n,z=f-T;}for(;t>2;)l[f++]=l[z++],l[f++]=l[z++],l[f++]=l[z++],t-=3;t&&(l[f++]=l[z++],t>1&&(l[f++]=l[z++]));}else {for(z=f-T;t>2;)l[f++]=l[z++],l[f++]=l[z++],l[f++]=l[z++],t-=3;t&&(l[f++]=l[z++],t>1&&(l[f++]=l[z++]));}break}if(64&y){e.msg="invalid distance code",r.ft=16209;break e}n=s[(65535&n)+(u&(1<<y)-1)];continue n}break}if(64&y){if(32&y){r.ft=16191;break e}e.msg="invalid literal/length code",r.ft=16209;break e}n=c[(65535&n)+(u&(1<<y)-1)];continue t}}while(i<p&&f<m);let M=a>>3;i-=M,a-=M<<3,u&=(1<<a)-1,e.next_in_index=i,e.next_out_index=f,e.avail_in=i<p?p-i+5:5-(i-p),e.avail_out=f<m?m-f+257:257-(f-m),r.p=u>>>0,r.T=a>>>0;}var Xn=new R(0);function M_(e,t){let n=Xn,r=t?ue+m_:ue+d_;return {...Je(e,0),o:e,ft:16180,_t:false,P:0,lt:false,ot:0,ut:0,ct:0,st:0,u:Z,ht:0,dt:0,Ge:0,et:n,tt:n,nt:0,rt:0,wt:0,bt:0,vt:0,kt:0,gt:n,xt:new g(320),Tt:new g(288),yt:new R(r),zt:0,it:true,Mt:0,Ct:0,Zt:t}}function We(e,t,n){return e<<24|t<<16|n}function b_(e=0,t=0,n=0){return We(e,t,n)}function h_(e=1){return We(64,e,0)}function Qt(e=0){return We(96,e,0)}function Y_(e){return (255&e)<<24|(e>>8&255)<<16|(e>>16&255)<<8|e>>24&255}var Le=15,Gn={Zt:false,Wt:Zt,qt:Mt,St:Xt,Lt:Gt,$t:20,Dt:257,At:0,It:d_,Ht:false,Qt:true},Kn={Zt:true,Wt:Pt,qt:Yt,St:Wt,Lt:Kt,$t:19,Dt:256,At:-1,It:m_,Ht:true,Qt:false};function Oe(e,t,n,r,i,f,_,l){let o,u,a,c,s,h,d,w,b,v,k,m,p,x,T,y,z,M,C,Z=new g(Le+1),W=new g(Le+1),q=l?Kn:Gn;for(o=0;o<=Le;o++)Z[o]=0;for(u=0;u<n;u++)Z[t[u]]++;for(s=i.jt,c=Le;c>=1&&0==Z[c];c--);if(s>c&&(s=c),0==c)return q.Qt?(T=h_(1),r.jt[0]=T,r.jt[1]=T,i.jt=1,0):-1;for(a=1;a<c&&0==Z[a];a++);for(s<a&&(s=a),w=1,o=1;o<=Le;o++)if(w<<=1,w-=Z[o],w<0)return  -1;if(w>0&&(0==e||1!=c))return  -1;for(W[1]=0,o=1;o<Le;o++)W[o+1]=W[o]+Z[o];for(u=0;u<n;u++)0!=t[u]&&(f[W[t[u]]++]=u);switch(e){case 0:z=M=f,C=q.$t;break;case 1:z=q.Wt,M=q.qt,C=q.Dt;break;default:z=q.St,M=q.Lt,C=q.At;}if(v=0,u=0,o=a,y=_.jt,h=s,d=0,p=-1,b=1<<s,x=b-1,1==e&&(q.Ht?b>=ue:b>ue)||2==e&&(q.Ht?b>=q.It:b>q.It))return 1;for(;;){T=qn(f,u,o,d,e,z,M,C,q.Zt),k=1<<o-d,m=1<<h,a=m;do{m-=k;let e=(v>>d)+m;r.jt[y+e]=T;}while(0!=m);for(k=1<<o-1;v&k;)k>>=1;if(0!=k?(v&=k-1,v+=k):v=0,u++,0==--Z[o]){if(o==c)break;o=t[f[u]];}if(o>s&&(v&x)!=p){for(0==d&&(d=s),y+=1<<h,h=o-d,w=1<<h;h+d<c&&(w-=Z[h+d],!(w<=0));)h++,w<<=1;if(b+=1<<h,1==e&&(q.Ht?b>=ue:b>ue)||2==e&&(q.Ht?b>=q.It:b>q.It))return 1;p=v&x,r.jt[_.jt+p]=We(h,s,y-_.jt);}}if(0!=v)for(T=h_(o-d);0!=v;){for(0!=d&&(v&x)!=p&&(d=0,o=s,y=_.jt,h=s,T=h_(o)),r.jt[y+(v>>d)]=T,k=1<<o-1;v&k;)k>>=1;0!=k?(v&=k-1,v+=k):v=0;}return _.jt+=b,i.jt=s,0}function qn(e,t,n,r,i,f,_,l,o){let u;if(o?e[t]<l:e[t]+1<l)u=b_(0,n-r,e[t]);else if(o?e[t]>l:e[t]>=l)if(o&&1==i){let i=e[t]-257;u=b_(_[i],n-r,f[i]);}else {let i=o?e[t]:e[t]-l;u=b_(_[i],n-r,f[i]);}else u=Qt(n-r);return u}var p_=new R(0),Qn={Nt:true,Ut:new R(544),Rt:p_,Yt:p_},$n={Nt:true,Ut:new R(544),Rt:p_,Yt:p_};function $t(){let e=je();return e.l=M_(e,false),e}function Ge(e){let t;return !(e&&(t=e.l,!(!t||t.o!=e||t.Zt&&(t.ft<16191||t.ft>16209)||!t.Zt&&(t.ft<16180||t.ft>16211))))}function er(e){let t;return Ge(e)?-2:(t=e.l,e.total_in=e.total_out=t.st=0,e.msg="",t.P&&(e.i=1&t.P),t.ft=t.Zt?16191:16180,t._t=false,t.lt=false,t.ot=-1,t.ut=t.Zt?65536:32768,delete t.B,t.p=0,t.T=0,t.et=t.yt,t.tt=t.yt,t.gt=t.yt,t.it=true,t.Mt=-1,0)}function _r(e){let t;return Ge(e)?-2:(t=e.l,t.h=0,t.k=0,t.m=0,er(e))}function tr(e,t){let n,r;if(Ge(e))return  -2;if(r=e.l,t<0){if(t<-16)return  -2;n=0,r.Zt=-16==t,t=-t;}else n=5+(t>>4),r.Zt=false,t<48&&(t&=15);let i=r.Zt?16:15;return t&&(t<8||t>i)?-2:(r.u.length>0&&r.v!=t&&(r.u=Z),r.P=n,r.v=t,_r(e))}function en(e,t){let n,r;if(!e)return  -2;e.msg="";let i=-16==t;return r=M_(e,i),e.l=r,r.o=e,r.ft=i?16191:16180,n=tr(e,t),n}function nr(e){let t=e.Zt?$n:Qn,n={jt:0};if(t.Nt){let r,i,f;for(r=0;r<144;)e.xt[r++]=8;for(;r<256;)e.xt[r++]=9;for(;r<280;)e.xt[r++]=7;for(;r<288;)e.xt[r++]=8;t.Ut.fill(0),f=t.Ut,t.Rt=f,i=9;let _={jt:f},l={jt:i},o={jt:0};for(Oe(1,e.xt,288,_,l,e.Tt,o,e.Zt),f=_.jt,i=l.jt,e.zt=o.jt,r=0;r<32;)e.xt[r++]=5;i=5;let u=o.jt,a={jt:f},c={jt:i};n.jt=u,Oe(2,e.xt,32,a,c,e.Tt,n,e.Zt),t.Yt=f.slice(u),t.Nt=false;}e.et=t.Rt,e.nt=9,e.tt=t.Yt,e.rt=5,e.zt=n.jt;}function rr(e,t,n){let r=e.l;if(!(r.u&&0!=r.u.length||(r.u=new p(1<<r.v),r.u)))return 1;if(0==r.h&&(r.h=1<<r.v,r.m=0,r.k=0),n>=r.h)M(r.u,0,t,t.length-r.h,r.h),r.m=0,r.k=r.h;else {let e=r.h-r.m;e>n&&(e=n),M(r.u,r.m,t,t.length-n,e),(n-=e)?(M(r.u,0,t,t.length-n,n),r.m=n,r.k=r.h):(r.m+=e,r.m==r.h&&(r.m=0),r.k<r.h&&(r.k+=e));}return 0}var S_=class extends L{constructor(){super("Need more input");}};function _n(e,t){let n,r,i,f,_,l,o,u,a,c,s,h,d,w,b,v,k,g=new p(4);if(Ge(e)||!e.next_out||!e.next_in&&0!=e.avail_in)return  -2;l=0,u=0,o=0,a=0,r=Z,i=0,f=Z,_=0,n=e.l,16191==n.ft&&(n.ft=16192),z(),c=l,s=o,k=0;try{for(;;)switch(n.ft){case 16180:if(0==n.P){n.ft=16192;break}if(L(16),2&n.P&&35615==u){0==n.v&&(n.v=15),n.ct=W(0),n.ct=T(n.ct,u),q(),n.ft=16181;break}if(n.B&&(n.B.Et=-1),!(1&n.P)||(($(8)<<8)+(u>>8))%31){e.msg="incorrect header check",n.ft=16209;break}if(8!=$(4)){e.msg="unknown compression method",n.ft=16209;break}if(D(4),v=$(4)+8,0==n.v&&(n.v=v),v>15||v>n.v){e.msg="invalid window size",n.ft=16209;break}n.ut=1<<v,n.ot=0,e.i=n.ct=he(0),n.ft=512&u?16189:16191,q();break;case 16181:if(L(16),n.ot=u,8!=(255&n.ot)){e.msg="unknown compression method",n.ft=16209;break}if(57344&n.ot){e.msg="unknown header flags set",n.ft=16209;break}n.B&&(n.B.Fe=u>>8&1),512&n.ot&&4&n.P&&(n.ct=T(n.ct,u)),q(),n.ft=16182;case 16182:L(32),n.B&&(n.B.Xe=u),512&n.ot&&4&n.P&&(n.ct=y(n.ct,u)),q(),n.ft=16183;case 16183:L(16),n.B&&(n.B.Pt=255&u,n.B.Je=u>>8),512&n.ot&&4&n.P&&(n.ct=T(n.ct,u)),q(),n.ft=16184;case 16184:1024&n.ot?(L(16),n.ht=u,n.B&&(n.B.Ke=u),512&n.ot&&4&n.P&&(n.ct=T(n.ct,u)),q()):n.B&&(n.B.Ge=Z),n.ft=16185;case 16185:if(1024&n.ot&&(h=n.ht,h>l&&(h=l),h&&(n.B&&n.B.Ge&&n.B.Bt&&(v=n.B.Ke-n.ht)<n.B.Bt&&M(n.B.Ge,v,r,i,h),512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),l-=h,i+=h,n.ht-=h),n.ht))return m();n.ht=0,n.ft=16186;case 16186:if(2048&n.ot){if(0==l)return m();h=0;do{v=r[i+h++],n.B&&n.B.Ft&&n.ht<n.B.Ft&&(n.B.Oe[n.ht++]=v);}while(v&&h<l);if(512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),l-=h,i+=h,v)return m()}else n.B&&(n.B.Oe=Z);n.ht=0,n.ft=16187;case 16187:if(4096&n.ot){if(0==l)return m();h=0;do{v=r[i+h++],n.B&&n.B.Gt&&n.ht<n.B.Gt&&(n.B.Ve[n.ht++]=v);}while(v&&h<l);if(512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),l-=h,i+=h,v)return m()}else n.B&&(n.B.Ve=Z);n.ft=16188;case 16188:if(512&n.ot){if(L(16),4&n.P&&u!=(65535&n.ct)){e.msg="header crc mismatch",n.ft=16209;break}q();}n.B&&(n.B.Be=n.ot>>9&1,n.B.Et=1),e.i=n.ct=W(0),n.ft=16191;break;case 16189:L(32),e.i=n.ct=Y_(u),q(),n.ft=16190;case 16190:if(!n.lt)return C(),2;e.i=n.ct=he(0),n.ft=16191;case 16191:if(5==t||6==t)return m();case 16192:if(n._t){A(),n.ft=16206;break}switch(L(3),n._t=!!$(1),D(1),$(2)){case 0:n.ft=16193;break;case 1:if(nr(n),n.ft=16199,6==t)return D(2),m();break;case 2:n.ft=16196;break;case 3:e.msg="invalid block type",n.ft=16209;}D(2);break;case 16193:if(A(),L(32),(65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",n.ft=16209;break}if(n.ht=65535&u,q(),n.ft=16194,6==t)return m();case 16194:n.ft=16195;case 16195:if(h=n.ht,h){if(h>l&&(h=l),h>o&&(h=o),0==h)return m();M(f,_,r,i,h),l-=h,i+=h,o-=h,_+=h,n.ht-=h;break}n.ft=16191;break;case 16196:if(L(14),n.bt=$(5)+257,D(5),n.vt=$(5)+1,D(5),n.wt=$(4)+4,D(4),n.bt>286||!n.Zt&&n.vt>30){e.msg=n.Zt?"too many length":"too many length or distance symbols",n.ft=16209;break}n.kt=0,n.ft=16197;case 16197:for(;n.kt<n.wt;)L(3),n.xt[pe[n.kt++]]=$(3),D(3);for(;n.kt<19;)n.xt[pe[n.kt++]]=0;n.gt=n.yt,n.et=n.tt=n.gt,n.nt=7;let c={jt:n.gt},g={jt:n.nt},p={jt:0};if(k=Oe(0,n.xt,19,c,g,n.Tt,p,n.Zt),n.gt=c.jt,n.nt=g.jt,k){e.msg="invalid code lengths set",n.ft=16209;break}n.kt=0,n.ft=16198;case 16198:for(;n.kt<n.bt+n.vt;){for(;w=n.et[$(n.nt)],!((w>>>16&255)<=a);)S();if((65535&w)<16)D(w>>>16&255),n.xt[n.kt++]=65535&w;else {if(16==(65535&w)){if(L(2+(w>>>16&255)),D(w>>>16&255),0==n.kt){e.msg="invalid bit length repeat",n.ft=16209;break}v=n.xt[n.kt-1],h=3+$(2),D(2);}else 17==(65535&w)?(L(3+(w>>>16&255)),D(w>>>16&255),v=0,h=3+$(3),D(3)):(L(7+(w>>>16&255)),D(w>>>16&255),v=0,h=11+$(7),D(7));if(n.kt+h>n.bt+n.vt){e.msg="invalid bit length repeat",n.ft=16209;break}for(;h--;)n.xt[n.kt++]=v;}}if(16209==n.ft)break;if(0==n.xt[256]){e.msg="invalid code -- missing end-of-block",n.ft=16209;break}n.gt=n.yt,n.nt=9;let I={jt:n.gt},H={jt:n.nt},Q={jt:0};k=Oe(1,n.xt,n.bt,I,H,n.Tt,Q,n.Zt),n.gt=I.jt,n.nt=H.jt;let j=Q.jt;if(n.et=n.gt.slice(0,j),k){e.msg="invalid literal/lengths set",n.ft=16209;break}n.rt=6;let N=n.xt.subarray(n.bt,n.bt+n.vt),U={jt:n.gt},R={jt:n.rt},Y={jt:j};if(k=Oe(2,N,n.vt,U,R,n.Tt,Y,n.Zt),n.gt=U.jt,n.rt=R.jt,n.tt=n.gt.slice(j),k){e.msg="invalid distances set",n.ft=16209;break}if(n.ft=16199,6==t)return m();case 16199:n.ft=16200;case 16200:if(!n.Zt&&l>=6&&o>=258){C(),Jt(e,s),z(),16191==n.ft&&(n.Mt=-1);break}for(n.Mt=0;w=n.et[$(n.nt)],!((w>>>16&255)<=a);)S();if(w>>>24&&!(w>>>24&240)){for(b=w;w=n.et[(65535&b)+($((b>>>16&255)+(b>>>24))>>(b>>>16&255))],!((b>>>16&255)+(w>>>16&255)<=a);)S();D(b>>>16&255),n.Mt+=b>>>16&255;}if(D(w>>>16&255),n.Mt+=w>>>16&255,n.ht=65535&w,!(w>>>24)){n.ft=16205;break}if(w>>>24&32){n.Mt=-1,n.ft=16191;break}if(w>>>24&64){e.msg="invalid literal/length code",n.ft=16209;break}n.Ge=w>>>24&(n.Zt?31:15),n.ft=16201;case 16201:n.Ge&&(L(n.Ge),n.ht+=$(n.Ge),D(n.Ge),n.Mt+=n.Ge),n.Ct=n.ht,n.ft=16202;case 16202:for(;w=n.tt[$(n.rt)],!((w>>>16&255)<=a);)S();if(!(w>>>24&240)){for(b=w;w=n.tt[(65535&b)+($((b>>>16&255)+(b>>>24))>>(b>>>16&255))],!((b>>>16&255)+(w>>>16&255)<=a);)S();D(b>>>16&255),n.Mt+=b>>>16&255;}if(D(w>>>16&255),n.Mt+=w>>>16&255,w>>>24&64){e.msg="invalid distance code",n.ft=16209;break}n.dt=65535&w,n.Ge=w>>>24&15,n.ft=16203;case 16203:n.Ge&&(L(n.Ge),n.dt+=$(n.Ge),D(n.Ge),n.Mt+=n.Ge),n.ft=16204;case 16204:if(0==o)return m();if(h=s-o,n.dt>h){if(h=n.dt-h,h>n.k&&n.it){e.msg="invalid distance too far back",n.ft=16209;break}h>n.m?(h-=n.m,d=n.h-h):d=n.m-h,h>n.ht&&(h=n.ht),h>o&&(h=o);for(let e=0;e<h;++e)f[_]=255&n.u[d],++_,++d;}else {d=_-n.dt,h=n.ht,h>o&&(h=o);for(let e=0;e<h;++e)f[_]=f[d],++_,++d;}h>o&&(h=o),o-=h,n.ht-=h,0==n.ht&&(n.ft=16200);break;case 16205:if(0==o)return m();f[_++]=n.ht,o--,n.ft=16200;break;case 16206:if(n.P){if(L(32),s-=o,e.total_out+=s,n.st+=s,4&n.P&&s){let t=f.subarray(_-s,_);e.i=n.ct=x(n.ct,t,s);}if(s=o,4&n.P&&(n.ot?u:Y_(u)>>>0)!=n.ct){e.msg="incorrect data check",n.ft=16209;break}q();}n.ft=16207;case 16207:if(n.P&&n.ot){if(L(32),4&n.P&&u!=(4294967295&n.st)){e.msg="incorrect length check",n.ft=16209;break}q();}n.ft=16208;case 16208:return k=1,m();case 16209:return k=-3,m();case 16210:return -4;default:return -2}}catch(e){if(e instanceof S_)return m();throw e}function m(){if(C(),n.h||s!=e.avail_out&&n.ft<16209&&(n.Zt?n.ft<16208:n.ft<16206)||4!=t){let t=s-e.avail_out;if(rr(e,e.next_out.subarray(e.next_out_index-t,e.next_out_index),t))return n.ft=16210,-4}return c-=e.avail_in,s-=e.avail_out,e.total_in+=c,e.total_out+=s,n.st+=s,4&n.P&&s&&(e.i=n.ct=x(n.ct,e.next_out.subarray(e.next_out_index-s,e.next_out_index),s)),e.t=n.T+(n._t?64:0)+(16191==n.ft?128:0)+(16199==n.ft||16194==n.ft?256:0),(0==c&&0==s&&0==k||4==t&&0==k)&&(k=-5),k}function x(e,t,r){return n.ot?W(e,t,r):he(e,t,r)}function T(e,t){return g[0]=255&t,g[1]=t>>>8&255,W(e,g,2)>>>0}function y(e,t){return g[0]=255&t,g[1]=t>>>8&255,g[2]=t>>>16&255,g[3]=t>>>24&255,W(e,g,4)>>>0}function z(){f=e.next_out,_=e.next_out_index,o=e.avail_out,r=e.next_in,i=e.next_in_index,l=e.avail_in,u=n.p,a=n.T;}function C(){e.next_out=f,e.next_out_index=_,e.avail_out=o,e.next_in=r,e.next_in_index=i,e.avail_in=l,n.p=u,n.T=a;}function q(){u=0,a=0;}function S(){if(0==l)throw new S_;l--,u+=(255&r[i])<<a,i++,u>>>=0,a+=8;}function L(e){for(;a<e;)S();}function $(e){return u&(1<<e)-1}function D(e){u>>>=e,a-=e;}function A(){u>>>=7&a,a-=7&a;}}function tn(e){return Ge(e)?-2:0}var X_=65536,ar=32768,W_=class{constructor(e=16,t=X_){this.Ot=[],this.Vt=e;for(let n=0;n<z.min(e,4);n++)this.Ot.push(new p(t));}acquire(e=X_){for(let t=this.Ot.length-1;t>=0;t--){let n=this.Ot[t];if(n.length>=e)return this.Ot.splice(t,1),n}return new p(e)}release(e){this.Ot.length<this.Vt&&this.Ot.push(e);}};function nn(e){let t=new W_(32,X_),n=null;function r(){let t=e.Xt(),n=e.Jt(t);if(0!=n&&0!=n)throw new L("init failed: "+n);return {o:t}}function i(e){try{t.release(e);}catch{}}return new H({start(){},transform(f,_){n||(n=r());let l=n.o;if(n.Kt)return;let o=0;for(;o<f.length;){let r=z.min(f.length-o,ar),u=f.subarray(o,o+r);for(l.next_in=u,l.next_in_index=0,l.avail_in=u.length;l.avail_in>0;){let r=t.acquire(),f=false;try{l.next_out=r,l.next_out_index=0,l.avail_out=r.length;let i=e.en(l,0),o=r.length-l.avail_out;if(o>0){let e=!1,n={tn:r.subarray(0,o),release:()=>{e||(e=!0,t.release(r));}};f=!0,_.enqueue(n);}if(1==i){n.Kt=!0;break}if(0!=i)throw new L("process error: "+i)}finally{f||i(r);}}if(n.Kt)break;o+=r;}},flush(f){if(n&&n.Kt)return;n||(n=r());let _=n.o;for(;;){let n=t.acquire(),r=false;try{_.next_out=n,_.next_out_index=0,_.avail_out=n.length;let i=e.en(_,4),l=n.length-_.avail_out;if(l>0){let e=!1,i={tn:n.subarray(0,l),release:()=>{e||(e=!0,t.release(n));}};r=!0,f.enqueue(i);}if(1==i)break;if(0!=i)throw new L("finalization error: "+i)}finally{r||i(n);}}let l=e.nn(_);if(0!=l&&0!=l)throw new L("end failed: "+l)}})}function rn(){return new H({start(){},transform(e,t){try{t.enqueue(e.tn.slice(0));}finally{e.release();}},flush(){}})}function ir(e="deflate",t){let n="gzip"==e?31:"deflate-raw"==e?-15:15,r=t&&"number"==typeof t.level?t.level:-1;return nn({Xt:()=>vt(),Jt:e=>kt(e,r,8,n,8,0),en:Nt,nn:P_})}function or(e="deflate"){let t="gzip"==e?31:"deflate-raw"==e?-15:"deflate64-raw"==e?-16:15;return nn({Xt:()=>$t(),Jt:e=>en(e,t),en:_n,nn:tn})}var E_=class{constructor(e="deflate",t){let n=ir(e,t);this.writable=n.writable,this.readable=n.readable.pipeThrough(rn());}},g_=class{constructor(e="deflate"){let t=or(e);this.writable=t.writable,this.readable=t.readable.pipeThrough(rn());}};

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
		CompressionStreamFallback: E_,
		DecompressionStreamFallback: g_
	});

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


	const ERR_ENTRY_EXISTS = "Entry filename already exists";
	const ERR_READABLE_CONSUMED = "Readable stream already consumed";
	const ERR_INVALID_PASS_THROUGH = "Invalid passThrough option (use readerOptions.passThrough or set uncompressedSize for each entry)";
	const ERR_INVALID_READER_OPTIONS = "Invalid readerOptions (must be an object)";
	const ERR_ABORT_EXPORT = "zipjs-abort-export";
	const ERR_ABORTED = "The operation was aborted";
	const ABORT_ERROR_NAME = "AbortError";
	const INFOZIP_EXTRA_FIELD_TYPE = "infozip";
	const INTERPRETED_EXTRA_FIELD_TYPES = new Set([
		EXTRAFIELD_TYPE_ZIP64,
		EXTRAFIELD_TYPE_AES,
		EXTRAFIELD_TYPE_NTFS,
		EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP,
		EXTRAFIELD_TYPE_UNICODE_PATH,
		EXTRAFIELD_TYPE_UNICODE_COMMENT,
		EXTRAFIELD_TYPE_USDZ,
		EXTRAFIELD_TYPE_INFOZIP,
		EXTRAFIELD_TYPE_UNIX,
		EXTRAFIELD_TYPE_UNIX_TYPE1,
		EXTRAFIELD_TYPE_PKWARE_UNIX
	]);

	class ZipEntry {

		constructor(fs, name, params, parent) {
			const zipEntry = this;
			if (fs.root && parent && parent.getChildByName(name)) {
				throw new Error(ERR_ENTRY_EXISTS);
			}
			if (!params) {
				params = {};
			}
			Object.assign(zipEntry, {
				fs,
				name,
				data: params.data,
				options: params.options && Object.assign({}, params.options),
				id: fs.entryIdCounter++,
				parent,
				children: [],
				uncompressedSize: params.uncompressedSize || 0,
				undeterminedSize: params.undeterminedSize || params.uncompressedSize === UNDEFINED_VALUE,
				passThrough: params.passThrough,
				defaultLastModDate: params.defaultLastModDate || new Date()
			});
			if (parent || !fs.root) {
				fs.entries[zipEntry.id] = zipEntry;
			}
			if (parent) {
				zipEntry.parent.children.push(zipEntry);
			}
		}

		getFullname() {
			return this.getRelativeName();
		}

		getRelativeName(ancestor = this.fs.root) {
			const zipEntry = this;
			let relativeName = zipEntry.name;
			let entry = zipEntry.parent;
			while (entry && entry != ancestor) {
				relativeName = (entry.name ? entry.name + "/" : "") + relativeName;
				entry = entry.parent;
			}
			return relativeName;
		}

		isDescendantOf(ancestor) {
			let entry = this.parent;
			while (entry && entry.id != ancestor.id) {
				entry = entry.parent;
			}
			return Boolean(entry);
		}

		rename(name) {
			const parent = this.parent;
			if (parent && parent.getChildByName(name)) {
				throw new Error(ERR_ENTRY_EXISTS);
			} else {
				this.name = name;
			}
		}

		setOptions(options) {
			const entryOptions = Object.assign({}, this.options, options);
			this.options = Object.fromEntries(Object.entries(entryOptions).filter(([, value]) => value !== UNDEFINED_VALUE));
		}
	}

	class ZipFileEntry extends ZipEntry {

		constructor(fs, name, params, parent) {
			super(fs, name, params, parent);
			const zipEntry = this;
			zipEntry.Reader = params.Reader;
			zipEntry.Writer = params.Writer;
			if (params.getData) {
				zipEntry.getData = params.getData;
			}
		}

		clone() {
			return new ZipFileEntry(this.fs, this.name, this);
		}

		async getData(writer, options = {}) {
			const zipEntry = this;
			if (!writer || (writer.constructor == zipEntry.Writer && zipEntry.data && keepsContentType(writer, zipEntry.data))) {
				return zipEntry.data;
			} else {
				const reader = zipEntry.reader = createReader(zipEntry.Reader, zipEntry.data, options);
				const dataSize = zipEntry.uncompressedSize || reader.size;
				await Promise.all([initStream(reader), initStream(writer, dataSize)]);
				const signal = checkSignalOption(options.signal);
				const readable = createProgressReadable(zipEntry, reader, options, signal);
				const preventClose = !ownsWritable(writer) && Boolean(options.preventClose);
				zipEntry.uncompressedSize = reader.size;
				await toCompatibleReadable(readable).pipeTo(toCompatibleWritable(writer.writable), { signal, preventClose, preventAbort: preventClose });
				return writer.getData ? writer.getData() : writer.writable;
			}
		}

		isPasswordProtected() {
			return Boolean(this.data && this.data.encrypted);
		}

		async checkPassword(password, options = {}) {
			const zipEntry = this;
			if (zipEntry.isPasswordProtected()) {
				try {
					await zipEntry.data.getData(null, Object.assign({}, options, {
						password,
						checkPasswordOnly: true
					}));
					return true;
				} catch (error) {
					if (error.message == ERR_INVALID_PASSWORD) {
						return false;
					} else {
						throw error;
					}
				}
			} else {
				return true;
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

		getUint8Array(options) {
			return this.getData(new Uint8ArrayWriter(), options);
		}

		getWritable(writable = new WritableStream(), options) {
			return this.getData({ writable }, options);
		}

		async getArrayBuffer(options) {
			const array = await this.getUint8Array(options);
			return toExactUint8Array(array).buffer;
		}

		replaceBlob(blob) {
			Object.assign(this, {
				data: blob,
				Reader: BlobReader,
				Writer: BlobWriter,
				reader: null
			});
		}

		replaceText(text) {
			Object.assign(this, {
				data: text,
				Reader: TextReader,
				Writer: TextWriter,
				reader: null
			});
		}

		replaceData64URI(dataURI) {
			Object.assign(this, {
				data: dataURI,
				Reader: Data64URIReader,
				Writer: Data64URIWriter,
				reader: null
			});
		}

		replaceUint8Array(array) {
			Object.assign(this, {
				data: array,
				Reader: Uint8ArrayReader,
				Writer: Uint8ArrayWriter,
				reader: null
			});
		}

		replaceReadable(readable) {
			Object.assign(this, {
				data: null,
				Reader: getReadableReader(readable),
				Writer: null,
				reader: null
			});
		}
	}

	class ZipDirectoryEntry extends ZipEntry {

		constructor(fs, name, params, parent) {
			super(fs, name, params, parent);
			this.directory = true;
		}

		clone(deepClone) {
			const zipEntry = this;
			const clonedEntry = new ZipDirectoryEntry(zipEntry.fs, zipEntry.name, zipEntry);
			if (deepClone) {
				clonedEntry.children = zipEntry.children.map(child => {
					const childClone = child.clone(deepClone);
					childClone.parent = clonedEntry;
					return childClone;
				});
			}
			return clonedEntry;
		}

		addDirectory(name, options) {
			return addChild(this, name, { options }, true);
		}

		addText(name, text, options = {}) {
			return addChild(this, name, {
				data: text,
				Reader: TextReader,
				Writer: TextWriter,
				options,
				uncompressedSize: getTextSize(text)
			});
		}

		addBlob(name, blob, options = {}) {
			return addChild(this, name, {
				data: blob,
				Reader: BlobReader,
				Writer: BlobWriter,
				options,
				uncompressedSize: blob.size
			});
		}

		addData64URI(name, dataURI, options = {}) {
			let dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=") {
				dataEnd--;
			}
			const dataStart = dataURI.indexOf(",") + 1;
			return addChild(this, name, {
				data: dataURI,
				Reader: Data64URIReader,
				Writer: Data64URIWriter,
				options,
				uncompressedSize: Math.floor((dataEnd - dataStart) * 0.75)
			});
		}

		addUint8Array(name, array, options = {}) {
			return addChild(this, name, {
				data: array,
				Reader: Uint8ArrayReader,
				Writer: Uint8ArrayWriter,
				options,
				uncompressedSize: array.length
			});
		}

		addHttpContent(name, url, options = {}) {
			return addChild(this, name, {
				data: url,
				Reader: class extends HttpReader {
					constructor(url) {
						super(url, options);
					}
				},
				options
			});
		}

		addReadable(name, readable, options = {}) {
			return addChild(this, name, {
				Reader: getReadableReader(readable),
				options
			});
		}

		addFileSystemEntry(fileSystemEntry, options = {}) {
			return addFileSystemHandle(this, fileSystemEntry, options);
		}

		addFileSystemHandle(handle, options = {}) {
			return addFileSystemHandle(this, handle, options);
		}

		addFile(file, options = {}) {
			options = Object.assign({}, options);
			if (!options.lastModDate) {
				options.lastModDate = new Date(file.lastModified);
			}
			return addChild(this, file.name, {
				data: file,
				Reader: function () {
					const readable = file.stream();
					const size = file.size;
					return { readable, size };
				},
				options,
				uncompressedSize: file.size
			});
		}

		importBlob(blob, options) {
			return this.importZip(new BlobReader(blob), options);
		}

		importData64URI(dataURI, options) {
			return this.importZip(new Data64URIReader(dataURI), options);
		}

		importUint8Array(array, options) {
			return this.importZip(new Uint8ArrayReader(array), options);
		}

		importHttpContent(url, options) {
			return this.importZip(new HttpReader(url, options), options);
		}

		importReadable(readable, options) {
			return this.importZip({ readable }, options);
		}

		exportBlob(options = {}) {
			return this.exportZip(new BlobWriter(options.mimeType || "application/zip"), options);
		}

		exportData64URI(options = {}) {
			return this.exportZip(new Data64URIWriter(options.mimeType || "application/zip"), options);
		}

		exportUint8Array(options = {}) {
			return this.exportZip(new Uint8ArrayWriter(), options);
		}

		async exportWritable(writable = new WritableStream(), options = {}) {
			await this.exportZip({ writable }, options);
			return writable;
		}

		exportFileSystemHandle(handle, options = {}) {
			return exportFileSystemHandle(this, handle, options);
		}

		async importZip(reader, options = {}) {
			let zipReader;
			if (reader && typeof reader.getEntries == FUNCTION_TYPE) {
				zipReader = reader;
				options = Object.assign({}, zipReader.options, options);
			} else {
				await initStream(reader);
				zipReader = new ZipReader(reader, options);
			}
			const importedEntries = [];
			const entries = await zipReader.getEntries(options);
			for (const entry of entries) {
				let parent = this;
				try {
					const path = entry.filename.split("/").filter(pathPart => pathPart != "" && pathPart != ".");
					const name = path.pop();
					path.forEach(pathPart => {
						const previousParent = parent;
						parent = parent.getChildByName(pathPart);
						if (parent) {
							if (!parent.directory) {
								throw new Error(ERR_ENTRY_EXISTS);
							}
						} else {
							parent = new ZipDirectoryEntry(this.fs, pathPart, { data: null }, previousParent);
							importedEntries.push(parent);
						}
					});
					if (!entry.directory) {
						importedEntries.push(addChild(parent, name, {
							data: entry,
							Reader: getZipBlobReader(Object.assign({}, options)),
							uncompressedSize: options.passThrough ? entry.compressedSize : entry.uncompressedSize,
							passThrough: options.passThrough
						}));
					} else {
						let directoryEntry = parent;
						if (name) {
							directoryEntry = parent.getChildByName(name);
							if (directoryEntry) {
								if (!directoryEntry.directory) {
									throw new Error(ERR_ENTRY_EXISTS);
								}
							} else {
								directoryEntry = new ZipDirectoryEntry(this.fs, name, { data: null }, parent);
								importedEntries.push(directoryEntry);
							}
						}
						if (directoryEntry != this && !directoryEntry.data) {
							directoryEntry.data = entry;
						}
					}
				} catch (error) {
					try {
						error.cause = {
							entry
						};
					} catch {
						// ignored
					}
					throw error;
				}
			}
			return importedEntries;
		}

		async exportZip(writer, options = {}) {
			const zipEntry = this;
			options = Object.assign({}, options);
			if (options.bufferedWrite === UNDEFINED_VALUE) {
				options.bufferedWrite = true;
			}
			const [readers] = await Promise.all([initReaders(zipEntry, checkReaderOptions(options.readerOptions)), initStream(writer)]);
			const zipWriter = new ZipWriter(writer, options);
			await exportZip(zipWriter, zipEntry, getTotalSize([zipEntry], getUncompressedSize), options, readers);
			await zipWriter.close(options.globalComment);
			return writer.getData ? writer.getData() : writer.writable;
		}

		getExportedSize(options = {}) {
			const zipEntry = this;
			options = Object.assign({}, options);
			checkReaderOptions(options.readerOptions);
			if (options.bufferedWrite === UNDEFINED_VALUE) {
				options.bufferedWrite = true;
			}
			const writeOrderGuaranteed = !options.bufferedWrite ||
				(options.keepOrder !== false && zipEntry.children.every(child => !child.children.length));
			return getEntriesSize(options, zipEntry.getChildren({ recursive: true }).filter(child => !isImplicitDirectory(child)).map(child => {
				const { name, entryOptions } = getChildEntryOptions(child, zipEntry, options);
				return { name, size: child.directory ? 0 : getDeterminedSize(child, isPassThrough(child, options)), options: entryOptions };
			}), writeOrderGuaranteed, options.globalComment);
		}

		getChildByName(name) {
			const children = this.children;
			for (let childIndex = 0; childIndex < children.length; childIndex++) {
				const child = children[childIndex];
				if (child.name == name) {
					return child;
				}
			}
		}

		getChildren(options = {}) {
			return collectChildren(this, options.recursive);
		}

		isPasswordProtected() {
			const children = this.children;
			for (let childIndex = 0; childIndex < children.length; childIndex++) {
				const child = children[childIndex];
				if (child.isPasswordProtected()) {
					return true;
				}
			}
			return false;
		}

		async checkPassword(password, options = {}) {
			const children = this.children;
			const result = await Promise.all(children.map(child => child.checkPassword(password, options)));
			return !result.includes(false);
		}
	}


	class ZipFS {

		constructor() {
			resetFS(this);
		}

		get children() {
			return this.root.children;
		}

		remove(entry) {
			detach(entry);
			const removedEntries = [entry];
			while (removedEntries.length) {
				const removedEntry = removedEntries.pop();
				this.entries[removedEntry.id] = null;
				for (const child of removedEntry.children) {
					removedEntries.push(child);
				}
			}
			entry.parent = UNDEFINED_VALUE;
		}

		move(entry, destination) {
			if (entry == this.root) {
				throw new Error("Root directory cannot be moved");
			} else {
				if (destination.directory) {
					if (!destination.isDescendantOf(entry)) {
						if (entry != destination) {
							const existingChild = destination.getChildByName(entry.name);
							if (existingChild) {
								if (existingChild != entry) {
									throw new Error(ERR_ENTRY_EXISTS);
								}
							} else {
								detach(entry);
								entry.parent = destination;
								destination.children.push(entry);
								registerEntries(this, entry);
							}
						}
					} else {
						throw new Error("Entry is a ancestor of target entry");
					}
				} else {
					throw new Error("Target entry is not a directory");
				}
			}
		}

		find(fullname) {
			const path = fullname.split("/");
			let node = this.root;
			for (let index = 0; node && index < path.length; index++) {
				node = node.getChildByName(path[index]);
			}
			if (!node) {
				node = this.entries.find(entry => entry && (entry == this.root || entry.isDescendantOf(this.root)) &&
					entry.getRelativeName() == fullname);
			}
			return node;
		}

		getById(id) {
			return this.entries[id];
		}

		getChildByName(name) {
			return this.root.getChildByName(name);
		}

		getChildren(options) {
			return this.root.getChildren(options);
		}

		addDirectory(name, options) {
			return this.root.addDirectory(name, options);
		}

		addText(name, text, options) {
			return this.root.addText(name, text, options);
		}

		addBlob(name, blob, options) {
			return this.root.addBlob(name, blob, options);
		}

		addData64URI(name, dataURI, options) {
			return this.root.addData64URI(name, dataURI, options);
		}

		addUint8Array(name, array, options) {
			return this.root.addUint8Array(name, array, options);
		}

		addHttpContent(name, url, options) {
			return this.root.addHttpContent(name, url, options);
		}

		addReadable(name, readable, options) {
			return this.root.addReadable(name, readable, options);
		}

		addFileSystemEntry(fileSystemEntry, options) {
			return this.root.addFileSystemEntry(fileSystemEntry, options);
		}

		addFileSystemHandle(handle, options) {
			return this.root.addFileSystemHandle(handle, options);
		}

		addFile(file, options) {
			return this.root.addFile(file, options);
		}

		importBlob(blob, options) {
			resetFS(this);
			return this.root.importBlob(blob, options);
		}

		importData64URI(dataURI, options) {
			resetFS(this);
			return this.root.importData64URI(dataURI, options);
		}

		importUint8Array(array, options) {
			resetFS(this);
			return this.root.importUint8Array(array, options);
		}

		importHttpContent(url, options) {
			resetFS(this);
			return this.root.importHttpContent(url, options);
		}

		importReadable(readable, options) {
			resetFS(this);
			return this.root.importReadable(readable, options);
		}

		importZip(reader, options) {
			resetFS(this);
			return this.root.importZip(reader, options);
		}

		exportBlob(options) {
			return this.root.exportBlob(options);
		}

		exportData64URI(options) {
			return this.root.exportData64URI(options);
		}

		exportUint8Array(options) {
			return this.root.exportUint8Array(options);
		}

		exportWritable(writable, options) {
			return this.root.exportWritable(writable, options);
		}

		exportFileSystemHandle(handle, options) {
			return this.root.exportFileSystemHandle(handle, options);
		}

		exportZip(writer, options) {
			return this.root.exportZip(writer, options);
		}

		getExportedSize(options) {
			return this.root.getExportedSize(options);
		}

		isPasswordProtected() {
			return this.root.isPasswordProtected();
		}

		checkPassword(password, options) {
			return this.root.checkPassword(password, options);
		}
	}

	const fs = { FS: ZipFS, ZipDirectoryEntry, ZipFileEntry };

	function getTotalSize(entries, getEntrySize) {
		let size = 0;
		const pendingEntries = Array.from(entries);
		while (pendingEntries.length) {
			const entry = pendingEntries.pop();
			size += getEntrySize(entry) || 0;
			for (const child of entry.children) {
				pendingEntries.push(child);
			}
		}
		return size;
	}

	function getUncompressedSize(entry) {
		return entry.uncompressedSize;
	}

	function getExtractedSize(entry, passThrough) {
		const { data } = entry;
		return passThrough && data instanceof Entry ? data.compressedSize : entry.uncompressedSize;
	}

	function getReadableReader(readable) {
		let consumed;
		return function () {
			if (consumed) {
				throw new Error(ERR_READABLE_CONSUMED);
			}
			consumed = true;
			return { readable };
		};
	}

	function getZipBlobReader(options) {
		return class extends Reader {

			constructor(entry, options = {}) {
				super();
				this.entry = entry;
				this.options = options;
			}

			async init() {
				const zipBlobReader = this;
				const readerOptions = Object.assign({}, options, zipBlobReader.options);
				const { checkOverlappingEntry, checkOverlappingEntryOnly } = readerOptions;
				const data = await zipBlobReader.entry.getData(new BlobWriter(), Object.assign(readerOptions, {
					checkPasswordOnly: false,
					checkOverlappingEntry: checkOverlappingEntryOnly || checkOverlappingEntry,
					checkOverlappingEntryOnly: false,
					preventClose: false
				}));
				zipBlobReader.data = data;
				zipBlobReader.blobReader = new BlobReader(data);
				zipBlobReader.size = data.size;
				super.init();
			}

			readUint8Array(index, length) {
				return this.blobReader.readUint8Array(index, length);
			}
		};
	}

	function createReader(Reader, data, options) {
		return Reader.prototype ? new Reader(data, options) : Reader(data, options);
	}

	function keepsContentType(writer, data) {
		const { contentType } = writer;
		if (contentType === UNDEFINED_VALUE) {
			return true;
		} else if (writer.constructor == BlobWriter) {
			return data.type == contentType;
		} else if (writer.constructor == Data64URIWriter) {
			return data.startsWith(writer.data);
		} else {
			return true;
		}
	}

	function createProgressReadable(zipEntry, reader, options, signal) {
		const { onstart, onprogress, onend } = options;
		const { readable } = reader;
		const coreReaderReportsProgress = zipEntry.data instanceof Entry;
		if (coreReaderReportsProgress || (!onstart && !onprogress && !onend)) {
			return readable;
		} else {
			return toCompatibleReadable(readable).pipeThrough(new ProgressWatcherStream({ onstart, onprogress, onend, size: reader.size }), { signal });
		}
	}

	async function initReaders(entry, options) {
		const fileEntries = [];
		const pendingEntries = [entry];
		const readers = new Map();
		while (pendingEntries.length) {
			const pendingEntry = pendingEntries.pop();
			for (const child of pendingEntry.children) {
				if (child.directory) {
					pendingEntries.push(child);
				} else {
					fileEntries.push(child);
				}
			}
		}
		await Promise.all(fileEntries.map(async child => {
			const reader = child.reader = createReader(child.Reader, child.data, options);
			readers.set(child, reader);
			try {
				await initStream(reader);
			} catch (error) {
				try {
					error.entryId = child.id;
					error.cause = {
						entry: child
					};
				} catch {
					// ignored
				}
				throw error;
			}
			if (reader.size !== UNDEFINED_VALUE) {
				child.uncompressedSize = reader.size;
				child.undeterminedSize = false;
			}
		}));
		return readers;
	}

	function detach(entry) {
		if (entry.parent) {
			const children = entry.parent.children;
			children.forEach((child, index) => {
				if (child.id == entry.id) {
					children.splice(index, 1);
				}
			});
		}
	}

	function forwardAbort(signal, abortController) {
		if (!checkSignalOption(signal)) {
			return () => { };
		}
		if (signal.aborted) {
			abortController.abort(signal.reason);
			return () => { };
		}
		const abort = () => abortController.abort(signal.reason);
		signal.addEventListener("abort", abort, { once: true });
		return () => signal.removeEventListener("abort", abort);
	}

	function isExportAborted(error) {
		return Boolean(error) && error.message == ERR_ABORT_EXPORT;
	}

	function aggregateEntryErrors(errors) {
		const [error] = errors;
		const otherErrors = errors
			.slice(1)
			.flatMap(otherError => [otherError, ...(otherError && otherError.entryErrors || [])])
			.filter(otherError => otherError !== error);
		if (otherErrors.length) {
			try {
				error.entryErrors = [...(error.entryErrors || []), ...otherErrors];
			} catch {
				// ignored
			}
		}
		return error;
	}

	function getChildEntryOptions(child, selectedEntry, options) {
		const name = options.relativePath ? child.getRelativeName(selectedEntry) : child.getFullname();
		const childOptions = child.options || {};
		let zipEntryMetadata = {};
		let passThroughOptions = {};
		if (child.data instanceof Entry) {
			const {
				externalFileAttributes,
				versionMadeBy,
				comment,
				lastModDate,
				creationDate,
				lastAccessDate,
				uncompressedSize,
				encrypted,
				zipCrypto,
				crc32,
				compressionMethod,
				extraFieldAES,
				internalFileAttributes,
				extraField,
				uid,
				gid
			} = child.data;
			zipEntryMetadata = {
				externalFileAttributes,
				versionMadeBy,
				comment,
				lastModDate,
				creationDate,
				lastAccessDate,
				internalFileAttributes
			};
			const userExtraField = getUserExtraField(extraField);
			if (userExtraField) {
				zipEntryMetadata.extraField = userExtraField;
			}
			if (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE) {
				Object.assign(zipEntryMetadata, {
					uid,
					gid,
					unixExtraFieldType: INFOZIP_EXTRA_FIELD_TYPE
				});
			}
			if (isPassThrough(child, options)) {
				let encryptionStrength;
				if (extraFieldAES) {
					encryptionStrength = extraFieldAES.strength;
				}
				passThroughOptions = {
					passThrough: true,
					encrypted,
					zipCrypto,
					crc32,
					uncompressedSize,
					encryptionStrength,
					compressionMethod
				};
			}
		}
		const entryOptions = Object.assign({ lastModDate: child.defaultLastModDate }, zipEntryMetadata, options, childOptions, passThroughOptions, { directory: child.directory });
		if (!child.directory && entryOptions.passThrough && entryOptions.uncompressedSize === UNDEFINED_VALUE) {
			throw new Error(ERR_INVALID_PASS_THROUGH);
		}
		return { name, entryOptions };
	}

	function getDeterminedSize(child, passThrough) {
		const { reader } = child;
		if (reader && reader.size !== UNDEFINED_VALUE) {
			return reader.size;
		}
		return child.undeterminedSize ? UNDEFINED_VALUE : getExtractedSize(child, passThrough);
	}

	function checkReaderOptions(readerOptions) {
		if (readerOptions && (typeof readerOptions != OBJECT_TYPE || Array.isArray(readerOptions))) {
			throw new Error(ERR_INVALID_READER_OPTIONS);
		}
		return readerOptions;
	}

	function isPassThrough(child, options) {
		const { readerOptions } = options;
		return Boolean(!child.directory && (child.passThrough || (readerOptions && readerOptions.passThrough)));
	}

	function isImplicitDirectory(child) {
		return child.directory && child.data === null;
	}

	function getUserExtraField(extraField) {
		if (extraField) {
			const userExtraField = new Map();
			extraField.forEach((field, type) => {
				if (!INTERPRETED_EXTRA_FIELD_TYPES.has(type)) {
					userExtraField.set(type, field.data);
				}
			});
			if (userExtraField.size) {
				return userExtraField;
			}
		}
	}

	async function exportZip(zipWriter, entry, totalSize, options, readers) {
		const { onstart, onprogress, onend, onentryprogress } = options;
		const selectedEntry = entry;
		const totalEntries = getTotalSize(entry.children, child => isImplicitDirectory(child) ? 0 : 1);
		let writtenSize = 0;
		let writtenEntries = 0;
		if (onstart) {
			await callHandler(onstart, totalSize);
		}
		if (options.bufferedWrite) {
			await processChildren(entry);
		} else {
			for (const child of entry.getChildren({ recursive: true })) {
				await addChild(child);
			}
		}
		if (onend) {
			await callHandler(onend, writtenSize);
		}

		async function processChildren(entry) {
			const results = await Promise.allSettled(entry.children.map(async child => {
				await addChild(child);
				await processChildren(child);
			}));
			const errorResult = results.find(result => result.status == "rejected");
			if (errorResult) {
				throw errorResult.reason;
			}
		}

		async function addChild(child) {
			if (isImplicitDirectory(child)) {
				return;
			}
			const { name, entryOptions } = getChildEntryOptions(child, selectedEntry, options);
			let entryWrittenSize = 0;
			const entryMetadata = await zipWriter.add(name, readers.get(child), Object.assign(entryOptions, {
				onstart: UNDEFINED_VALUE,
				onend: UNDEFINED_VALUE,
				onprogress: async indexProgress => {
					writtenSize += indexProgress - entryWrittenSize;
					entryWrittenSize = indexProgress;
					if (onprogress) {
						await callHandler(onprogress, writtenSize, totalSize);
					}
				}
			}));
			writtenEntries++;
			if (onentryprogress) {
				await callHandler(onentryprogress, writtenEntries, totalEntries, entryMetadata);
			}
		}
	}

	function addFileSystemHandle(zipEntry, handle, options) {
		return addFile(zipEntry, handle, []);

		async function addFile(parentEntry, handle, addedEntries, parentName = "") {
			if (handle) {
				const entryName = parentName ? parentName + "/" + handle.name : handle.name;
				try {
					if (handle.isFile || handle.isDirectory) {
						handle = await transformToFileSystemhandle(handle);
					}
					if (handle.kind == "file") {
						const file = await handle.getFile();
						addedEntries.push(
							addChild(parentEntry, file.name, {
								Reader: function () {
									const readable = file.stream();
									const size = file.size;
									return { readable, size };
								},
								options: Object.assign({}, { lastModDate: new Date(file.lastModified) }, options),
								uncompressedSize: file.size
							})
						);
					} else if (handle.kind == "directory") {
						const directoryEntry = parentEntry.addDirectory(handle.name, options);
						addedEntries.push(directoryEntry);
						for await (const childHandle of handle.values()) {
							await addFile(directoryEntry, childHandle, addedEntries, entryName);
						}
					}
				} catch (error) {
					try {
						if (error.entryName === UNDEFINED_VALUE) {
							error.entryName = entryName;
						}
					} catch {
						// ignored
					}
					throw error;
				}
			}
			return addedEntries;
		}
	}

	async function exportFileSystemHandle(zipEntry, directoryHandle, options) {
		const { onstart, onprogress, onend } = options;
		const readerOptions = checkReaderOptions(options.readerOptions);
		const abortController = new AbortController();
		const { signal } = abortController;
		const releaseSignal = forwardAbort(options.signal, abortController);
		const getDataOptions = Object.assign({}, options, readerOptions, {
			signal,
			onstart: UNDEFINED_VALUE,
			onprogress: UNDEFINED_VALUE,
			onend: UNDEFINED_VALUE,
			preventClose: false
		});
		const totalSize = getTotalSize([zipEntry], entry => getExtractedSize(entry, getDataOptions.passThrough));
		const exportedEntryNames = [];
		let exportAborted = false;
		let writtenSize = 0;
		try {
			if (onstart) {
				await callHandler(onstart, totalSize);
			}
			await exportChildren(zipEntry, directoryHandle);
			if (onend) {
				await callHandler(onend, writtenSize);
			}
		} catch (error) {
			try {
				error.exportedEntryNames = exportedEntryNames;
			} catch {
				// ignored
			}
			throw error;
		} finally {
			releaseSignal();
		}
		return directoryHandle;

		function createProgressWritable(writable) {
			const writer = writable.getWriter();
			return new WritableStream({
				async write(chunk) {
					await writer.write(chunk);
					writtenSize += chunk.length;
					if (onprogress) {
						await callHandler(onprogress, writtenSize, totalSize);
					}
				},
				close() {
					return writer.close();
				},
				abort(reason) {
					return writer.abort(reason);
				}
			});
		}

		async function exportChildren(entry, parentHandle) {
			if (options.concurrent) {
				const results = await Promise.allSettled(entry.children.map(child => exportChild(child, parentHandle)));
				const rejectedResults = results.filter(result => result.status == "rejected");
				if (rejectedResults.length) {
					const failedResults = rejectedResults.filter(result => !isExportAborted(result.reason));
					const reportedResults = failedResults.length ? failedResults : rejectedResults;
					throw aggregateEntryErrors(reportedResults.map(result => result.reason));
				}
			} else {
				for (const child of entry.children) {
					await exportChild(child, parentHandle);
				}
			}
		}

		async function exportChild(child, parentHandle) {
			if (signal.aborted) {
				if (exportAborted || isExportAborted(signal.reason)) {
					return;
				}
				throw signal.reason === UNDEFINED_VALUE ? new DOMException(ERR_ABORTED, ABORT_ERROR_NAME) : signal.reason;
			}
			try {
				if (child.directory) {
					const childDirectoryHandle = await parentHandle.getDirectoryHandle(child.name, { create: true });
					await exportChildren(child, childDirectoryHandle);
				} else {
					const fileHandle = await parentHandle.getFileHandle(child.name, { create: true });
					const writable = await fileHandle.createWritable();
					try {
						await child.getData({ writable: createProgressWritable(writable) }, getDataOptions);
					} catch (error) {
						throw exportAborted ? new Error(ERR_ABORT_EXPORT) : error;
					}
					exportedEntryNames.push(child.getRelativeName(zipEntry));
				}
			} catch (error) {
				exportAborted = true;
				abortController.abort(new Error(ERR_ABORT_EXPORT));
				try {
					if (error.entryName === UNDEFINED_VALUE) {
						error.entryName = child.getRelativeName(zipEntry);
						error.entryId = child.id;
					}
				} catch {
					// ignored
				}
				throw error;
			}
		}
	}

	async function transformToFileSystemhandle(entry) {
		const handle = {
			name: entry.name
		};
		if (entry.isFile) {
			handle.kind = "file";
			handle.getFile = () =>
				new Promise((resolve, reject) => entry.file(resolve, reject));
		}
		if (entry.isDirectory) {
			handle.kind = "directory";
			const handles = await transformToFileSystemhandles(entry);
			handle.values = () => handles;
		}
		return handle;
	}

	async function transformToFileSystemhandles(entry) {
		const entries = [];
		function readEntries(directoryReader, resolve, reject) {
			directoryReader.readEntries(async (entriesPart) => {
				if (!entriesPart.length) {
					resolve(entries);
				} else {
					for (const entry of entriesPart) {
						entries.push(await transformToFileSystemhandle(entry));
					}
					readEntries(directoryReader, resolve, reject);
				}
			}, reject);
		}
		await new Promise((resolve, reject) =>
			readEntries(entry.createReader(), resolve, reject)
		);
		return {
			[Symbol.iterator]() {
				let entryIndex = 0;
				return {
					next() {
						const result = {
							value: entries[entryIndex],
							done: entryIndex == entries.length
						};
						entryIndex++;
						return result;
					}
				};
			}
		};
	}

	function resetFS(fs) {
		fs.entries = [];
		fs.entryIdCounter = 0;
		fs.root = new ZipDirectoryEntry(fs);
	}

	function collectChildren(directory, recursive) {
		const children = [];
		const pendingDirectories = [directory];
		let directoryIndex = 0;
		while (directoryIndex < pendingDirectories.length) {
			for (const child of pendingDirectories[directoryIndex++].children) {
				children.push(child);
				if (recursive) {
					pendingDirectories.push(child);
				}
			}
		}
		return children;
	}

	function registerEntries(fs, entry) {
		const pendingEntries = [entry];
		while (pendingEntries.length) {
			const pendingEntry = pendingEntries.pop();
			fs.entries[pendingEntry.id] = pendingEntry;
			for (const child of pendingEntry.children) {
				pendingEntries.push(child);
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

	const encodedMimeTypes = "application:0andrew-inset ez,2nodex anx,1pplixware aw,1tom!,4cat!,4serv! atomsrv,5vc!,0bbolin lin,0ccxml!,1dmi-capability cdmia,6ontainer cdmic,5domain cdmid,5object cdmio,5queue cdmiq,1u-seeme cu,0davmount!,1ocbook! dbk,1sptype tsp,2sc+der,4! xdssc,0ecmascript es ecma,1mma!,1nvoy evy,1pub+zip,1xi,0font-tdpfr pfr,1ractals fif,1uturesplash spl,0gml!,1px!,1xf,1zip gz tgz,0hta,1yperstudio stk,0inkml! ink inkml,2ternet-property-stream acx,1pfix,0java-archive jar,5serialized-object ser,5vm class,1sonml+json,0lost! lostxml,0m3g,1ac-binhex40 hqx,2ds!,2rc mrc,4xml! mrcx,2thematica nb ma mb,4ml! mathml mml,1box,1ediaservercontrol! mscml,2talink!,84! meta4,3s!,1ods!,1p21 m21 mp21,24 mp4s,1saccess mdb,2word doc dot wiz,1xf,0oda,1ebps-package! opf,1gg ogx,1lescript axs,1mdoc!,1nenote onetoc onetoc2 onetmp onepkg,1xps,0patch-ops-error! xer,1df,1gp-encrypted pgp,4keys key,4signature asc sig,1ics-rules prf,1kcs10 p10,47-mime p7m p7c,6signature p7s,48 p8,2ix-attr-cert ac,5crl crl,5pkipath pkipath,4cmp pki,1ls!,1ostscript ps ai eps epsi epsf eps2 eps3,1rs.cww cww,1skc! pskcxml,0rar,1df!,1eginfo! rif,2lax-ng-compact-syntax rnc,2source-lists! rl,e-diff! rld,1ls-services! rs,1pki-ghostbusters gbr,5manifest mft,5roa roa,1sd!,2s!,1tf,0sbml!,1cvp-cv-request scq,asponse scs,5vp-request spq,asponse spp,1dp,1et-payment-initiation setpay,4registration-initiation setreg,1hf!,1mil! smi smil,1parql-query rq,7results! srx,1rgs gram,4! grxml,2u!,1sdl!,2ml!,0tei! tei teicorpus,1hraud! tfi,1imestamped-data tsd,0vnd.3gpp.pic-bw-large plb,gsmall psb,gvar pvb,82.tcap tcap,5m.post-it-notes pwn,4accpac.simply.aso aso,iimp imp,6ucobol acu,9rp atc acutc,5dobe.air-application-installer-package+zip air,aformscentral.fcdt fcdt,bxp fxp fxpl,axdp! xdp,bfdf xfdf,5head.space ahead,5irzip.filesecure.azf azf,os azs,5mazon.ebook azw,6ericandynamics.acc acc,6iga.ami ami,5ndroid.package-archive apk,6ser-web-certificate-issue-initiation cii,efunds-transfer-initiation fti,6tix.game-component atx,5pple.installer! mpkg,ampegurl m3u8,5ristanetworks.swi swi,5straea-software.iota iota,5udiograph aep,4blueice.multipass mpm,5mi bmi,5usinessobjects rep,4chemdraw! cdxml,6ipnuts.karaoke-mmd mmd,5inderella cdy,5laymore cla,6oanto.rp9 rp9,7nk.c4group c4g c4d c4f c4p c4u,6uetrust.cartomobile-config c11amc,w-pkg c11amz,5ommonspace csp,6ntact.cmsg cdbcmsg,6smocaller cmc,5rick.clicker clkx,h.keyboard clkk,ipalette clkp,itemplate clkt,iwordbank clkw,7ticaltools.wbs! wbs,5tc-posml pml,5ups-ppd ppd,6rl.car car,9pcurl pcurl,4dart dart,6ta-vision.rdz rdz,5ebian.binary-package deb udeb,6ce.data uvf uvvf uvd uvvd,9ttml! uvt uvvt,9unspecified uvx uvvx,9zip uvz uvvz,6novo.fcselayout-link fe_launch,5na dna,5olby.mlp mlp,5pgraph dpg,5reamfactory dfac,5s-keypoint kpxx,5vb.ait ait,8service svc,5ynageo geo,4ecowin.chart mag,5nliven nml,5pson.esf esf,amsf msf,aquickanime qam,asalt slt,bsf ssf,5szigno3! es3 et3,5zpix-album ez2,apackage ez3,4fdf fdf,6sn.mseed mseed,9seed seed dataless,5lographit gph,6uxtime.clip ftc,5ramemaker fm frame maker book,6ogans.fnc fnc,cltf ltf,5sc.weblaunch fsc,5ujitsu.oasys oas,h2 oa2,h3 oa3,hgp fg5,hprs bh2,8xerox.ddd ddd,focuworks xdw,n.binder xbd,6zzysheet fzs,4genomatix.tuxedo txd,6ogebra.file ggb,dtool ggt,7metry-explorer gex gre,7next gxt,7plan g2w,7space g3w,5mx gmx,5oogle-earth.kml! kml,jz kmz,5rafeq gqf gqs,6oove-account gac,bhelp ghf,bidentity-message gim,cnjector grv,btool-message gtm,gtemplate tpl,bvcard vcg,4hal! hal,6ndheld-entertainment! zmm,5bci hbci,5he.lesson-player les,5p-hpgl hpgl,9id hpid,9s hps,7jlyt jlt,7pcl pcl,axl pclxl,5ydrostatix.sof-data sfd-hdstx,5zn-3d-crossword x3d,4ibm.minipay mpy,9odcap afp listafp list3820,8rights-management irm,8secure-container sc,5ccprofile icc icm,5gloader igl,5mmervision-ivp ivp,iu ivu,5nsors.igm igm,6tercon.formnet xpw xpx,9geo i2g,7u.qbo qbo,afx qfx,5punplugged.rcprofile rcprofile,5repository.package! irp,5s-xpr xpr,6ac.fcs fcs,4jam jam,5cp.javame.midlet-rms rms,5isp jisp,5oost.joda-archive joda,4kahootz ktz ktr,5de.karbon karbon,9chart chrt,9formula kfo,9ivio flw,9ontour kon,9presenter kpr kpt,9spread ksp,9word kwd kwt,5enameaapp htke,5idspiration kia,6nar kne knp,5oan skp skd skt skm,6dak-descriptor sse,4las.las! lasxml,5lamagraphics.life-balance.desktop lbd,vexchange! lbe,5otus-1-2-3 123,aapproach apr,afreelance pre,anotes nsf,aorganizer org,ascreencam scm,awordpro lwp,4macports.portpkg portpkg,5cd mcd,5edcalcdata mc1,7iastation.cdkey cdkey,5fer mwf,6mp mfm,5icrografx.flo flo,figx igx,6f mif,5obius.daf daf,cis dis,bmbk mbk,cqy mqy,csl msl,bplc plc,btxf txf,6phun.application mpn,bcertificate mpc,6zilla.xul! xul,5s-artgalry cil,7cab-compressed cab,7excel xls xlb xlt xlm xla xlc xlw,c.addin.macroenabled.12 xlam,dsheet.binary.macroenabled.12 xlsb,jmacroenabled.12 xlsm,dtemplate.macroenabled.12 xltm,7fontobject eot,7htmlhelp chm,7ims ims,7lrm lrm,7officetheme thmx,8utlook msg,7pki.seccat cat,ctl stl,acertstore sst,8owerpoint ppt pps pot ppa pwz,h.addin.macroenabled.12 ppam,ipresentation.macroenabled.12 pptm,islide.macroenabled.12 sldm,nshow.macroenabled.12 ppsm,itemplate.macroenabled.12 potm,8roject mpp mpt,7word.document.macroenabled.12 docm,ctemplate.macroenabled.12 dotm,aks wps wks wcm wdb,8pl wpl,7xpsdocument xps,6eq mseq,5usician mus,6vee.style msty,5ynfc taglet,4neurolanguage.nlu nlu,5itf ntf nitf,5oblenet-directory nnd,dsealer nns,dweb nnw,6kia.n-gage.data ngdat,hsymbian.install n-gage,aradio-preset rpst,ms rpss,6vadigm.edm edm,fx edx,ext ext,4oasis.opendocument.chart odc,s-template otc,ndatabase odb,nformula odf,u-template odft,ngraphics odg,v-template otg,nimage odi,s-template oti,npresentation odp,z-template otp,nspreadsheet ods,y-template ots,ntext odt,r-master odm otm,stemplate ott,sweb oth,5lpc-sugar xo,5ma.dd2! dd2,5penofficeorg.extension oxt,8xmlformats-officedocument.presentationml.presentation pptx,zresentationml.slide sldx,zresentationml.slideshow ppsx,zresentationml.template potx,yspreadsheetml.sheet xlsx,zpreadsheetml.template xltx,ywordprocessingml.document docx,zordprocessingml.template dotx,5sgeo.mapguide.package mgp,7i.dp dp,9subsystem esa,4palm pdb pqa oprc,6waafile paw,5g.format str,7osasli ei6,5icsel efif,5mi.widget wg,5ocketlearn plf,6werbuilder6 pbd,5reviewsystems.box box,6oteus.magazine mgz,5ublishare-delta-tree qps,5vi.ptid1 ptid,4quark.quarkxpress qxd qxt qwd qwt qxl qxb,4realvnc.bed bed,6cordare.musicxml mxl,m! musicxml,5ig.cryptonote cryptonote,5n-realmedia rm,g-vbr rmvb,5oute66.link66! link66,4sailingtracker.track st,5eemail see,6ma sema,7d semd,7f semf,5hana.informed.formdata ifm,ntemplate itp,jinterchange iif,jpackage ipk,5imtech-mindmapper twd twds,5maf mmf,7rt.teacher teacher,5olent.sdkm! sdkm sdkd,5potfire.dxp dxp,dsfs sfs,5qlite3 db sqlite sqlite3 db-wal sqlite-wal db-shm sqlite-shm,5tardivision.calc sdc,ihart sds,hdraw sda,himpress sdd,hmath sdf smf,hwriter sdw vor,n-global sgl,6epmania.package smzip,estepchart sm,5un.xml.calc sxc,g.template stc,cdraw sxd,g.template std,cimpress sxi,j.template sti,cmath sxm,cwriter sxw,i.global sxg,jtemplate stw,6s-calendar sus susp,5vd svd,5ymbian.install sis sisx,6ncml! xsm,a.dm+wbxml bdm,d! xdm,4tao.intent-module-archive tao,5cpdump.pcap pcap cap dmp,5mobile-livetv tmo,5rid.tpt tpt,7scape.mxs mxs,6ueapp tra,4ufdl ufd ufdl,5iq.theme utz,5majin umj,5nity unityweb,5oml! uoml,4vcx vcx,5isio vsd vst vss vsw vsdx vssx vstx vssm vstm,9nary vis,5sf vsf,4wap.sic sic,9lc slc,8wbxml wbxml,9mlc wmlc,bscriptc wmlsc,5ebturbo wtb,5olfram.player nbp,6rdperfect wpd,f5.1 wp5,5qd wqd,5t.stf stf,4xara xar,5fdl xfdl,4yamaha.hv-dic hvd,escript hvs,evoice hvp,bopenscoreformat osf,q.osfpvg! osfpvg,bsmaf-audio saf,gphrase spf,5ellowriver-custom-menu cmp,4zul zir zirz,5zazz.deck! zaz,1oicexml! vxml,0widget wgt,2nhlp hlp,1sdl!,2policy!,0x-123 wk,27z-compressed 7z,2abiword abw,3ce-compressed ace,3pple-diskimage dmg,3uthorware-bin aab x32 u32 vox,dmap aam,dseg aas,2bcpio bcpio,3ittorrent torrent,3lorb blb blorb,3zip bz,62 bz2 boz,2cbr cbr cba cbt cb7,4z cbz,3df cdf cda,4link vcd,3fs-compressed cfs,3hat chat,4ess-pgn pgn,3ompress z,4nference nsc,3pio cpio,3sh csh,2dgc-compressed dgc,3irector dir dxr cst cct cxt w3d fgd swa,3ms dms,3oom wad,3tbncx! ncx,5ook! dtb,5resource! res,3vi dvi,2eva eva,2font-bdf bdf,7ghostscript gsf,7linux-psf psf,7pcf pcf,7snf snf,7ttf ttf ttc,8ype1 pfa pfb pfm afm,3reearc arc,6mind mm,2gca-compressed gca,3lulx ulx,3numeric gnumeric,3o-sgf sgf,3ramps-xml gramps,5phing-calculator gcf,3tar gtar taz,2hdf hdf,3ttpd-eruby rhtml,8php phtml pht php,b-source phps,b3 php3,c-preprocessed php3p,b4 php4,b5 php5,2ica ica,3nfo info,4stall-instructions install,4ternet-signup ins isp,3phone iii,3so9660-image iso,2java-jnlp-file jnlp,3mol jmz,2killustrator kil,3rita kra krz,2latex latex,3yx lyx,3zh-compressed lzh lha,4x lzx,2maker frm fb fbdoc,3ie mie,3obipocket-ebook prc mobi,3s-application application,5installer msi,5shortcut lnk,5wmd wmd,5xbap xbap,4binder obd,4cardfile crd,5lip clp,4dos-program com exe bat dll,4mediaview mvb m13 m14,6tafile wmf wmz emf emz,5oney mny,4publisher pub,4schedule scd,4terminal trm,4write wri,2netcdf nc,3s-proxy-autoconfig pac dat,3wc nwc,3zb nzb,2object o,3z-application oza,2perfmon pma pmc pmr pmw,5l pm pl,3kcs12 p12 pfx,67-certificates p7b spc,creqresp p7r,3ython-code pyc pyo,2qgis qgs shp shx,3uicktimeplayer qtl,2redhat-package-manager rpm rpa,4search-info-systems ris,3uby rb,2sh sh,4ar shar,4ockwave-flash swf swfl,3ilverlight scr,d-app xap,3ql sql,3tuffit sit,9x sitx,3ubrip srt,3v4cpio sv4cpio,6rc sv4crc,2t3vm-image t3,3ar tar,3ex-gf gf,6pk pk,6tfm tfm,5info texinfo texi,3gif obj,3rash ~ % bak old sik,2ustar ustar,2wais-source src,3ingz wz,2x509-ca-cert crt der cer,3cf xcf,3fig fig,3liff! xlf,3pinstall xpi,3z xz,2zmachine z1 z2 z3 z4 z5 z6 z7 z8,1aml!,1cap-diff! xdf,1enc!,1html! xhtml xht,1ml xml xsl xsd xpdl,3-dtd dtd,1op!,1proc! xpl,1slt!,2pf!,1v! mxml xhvml xvml xvm,0yaml yaml yml,2ng,1in!,1nd.ms-pkipko pko,0zip;audio:0aac,1dpcm adp,1iff aiff aif aff,1mr,3-wb awb,1nnodex axa,0basic au snd,0flac,0midi mid midi kar rmi,1p4 mp4a,2eg mpga mpega mp3 m4a mp2a m2a m3a,4url m3u,0ogg oga ogg spx,1pus,0prs.sid sid,0s3m,1ilk sil,0vnd.dece.audio uva uvva,5igital-winds eol,5ra dra,5ts dts,7.hd dtshd,4lucent.voice lvp,4ms-playready.media.pya pya,4nuera.ecelp4800 ecelp4800,f7470 ecelp7470,f9600 ecelp9600,4rip rip,0wav,1ebm weba,0x-aiff aifc,2caf caf,2gsm gsm,2matroska mka,3s-wax wax,6ma wma,2pn-realaudio ram,e-plugin rmp,2realaudio ra,2sd2 sd2,1m;chemical:0x-alchemy alc,2cache cac cache,7-csf csf,5tvs-binary cbin cascii ctab,3dx cdx,3hem3d c3d,3if cif,3mdf cmdf,4l cml,3ompass cpa,3rossfire bsd,3sml csml csm,3tx ctx,3xf cxf cef,2embl-dl-nucleotide emb embl,2gamess-input inp gam gamin,4ussian-checkpoint fch fchk,cube cub,binput gau gjc gjf,blog gal,3cg8-sequence gcg,3enbank gen,2hin hin,2isostar istr ist,2jcamp-dx jdx dx,2kinemage kin,2macmolecule mcm,5romodel-input mmod,3dl-molfile mol,6rdfile rd,7xnfile rxn,6sdfile sd,6tgf tgf,3mcif mcif,3ol2 mol2,5conn-Z b,4pac-graph gpt,8input mop mopcrt zmt,8out moo,2ncbi-asn1 asn,b-ascii prt ent,cbinary val,2rosdal ros,2swissprot sw,2vamas-iso14976 vms,3md vmd,2xtel xtel,3yz xyz;font:0otf,0woff,42;image:0avif avif avifs,0bmp,0cgm,1is-cod cod,0g3fax g3,1if,0heic heif heic,0ief,0jpeg jpeg jpg jpe jfif jfif-tbnl jif,0ktx,0pcx,1jpeg pjpg,1ng,1rs.btif btif,0sgi,1vg! svg svgz,0tiff tiff tif,0vnd.adobe.photoshop psd,4dece.graphic uvi uvvi uvg uvvg,5jvu djvu djv,5wg dwg,5xf dxf,4fastbidsheet fbs,5px fpx,5st fst,5ujixerox.edmics-mmr mmr,lrlc rlc,4ms-modi mdi,7photo wdp,4net-fpx npx,4wap.wbmp wbmp,4xiff xif,0webp,0x-3ds 3ds,2adobe-dng dng,2canon-cr2 cr2,aw crw,3mu-raster ras,4x cmx,3oreldraw cdr,bpattern pat,btemplate cdt,7photopaint cpt,2epson-erf erf,2freehand fh fhc fh4 fh5 fh7,3uji-raf raf,2icns icns,4on ico,2jg art,3ng jng,2kodak-dcr dcr,8k25 k25,9dc kdc,2minolta-mrw mrw,2nikon-nef nef,2olympus-orf orf,2panasonic-raw raw rw2 rwl,3entax-pef pef ptx,3ict pic pct,3ortable-anymap pnm,bbitmap pbm,bgraymap pgm,bpixmap ppm,2rgb rgb,2sigma-x3f x3f,3ony-arw arw,7sr2 sr2,9f srf,2tga tga,2xbitmap xbm,3pixmap xpm,3windowdump xwd;message:0rfc822 eml mime mht mhtml nws;model:0iges igs iges,0mesh msh mesh silo,0vnd.collada! dae,4dwf dwf,4gdl gdl,5tw gtw,4mts mts,4usdz+zip usdz,4vtu vtu,1rml wrl vrml,0x3d+binary x3db x3dbz,4vrml x3dv x3dvz,3! x3dz;text:0cache-manifest manifest appcache,2lendar ics icz ifb,1ss,2v,0h323 323,1tml html htm shtml stm,0iuls uls,0javascript js,1son,0markdown md markdown mdown markdn,0n3,0plain txt text brf conf def list log in bas diff ksh,1rs.lines.tag dsc,0richtext rtx,0scriptlet sct wsc,1gml sgml sgm,0tab-separated-values tsv,1exmacs tm,1roff t tr roff man me ms,1urtle ttl,0uri-list uri uris urls,0vcard,1nd.curl curl,8.dcurl dcurl,9mcurl mcurl,9scurl scurl,4dvb.subtitle sub,4fly fly,5mi.flexstor flx,4graphviz gv,4in3d.3dml 3dml,9spot spot,4sun.j2me.app-descriptor jad,4wap.si si,9l sl,8wml wml,bscript wmls,0webviewhtml htt,0x-asm s asm,2bibtex bib,3oo boo,2c c h dic,3++hdr h++ hpp hxx hh,5src c++ cpp cxx cc,3omponent htc,2diff patch,3src d,2fortran f for f77 f90,2haskell hs,2java java,2literate-haskell lhs,2moc moc,2nfo nfo,2opml opml,2pascal p pas pp inc,3cs-gcd gcd,3ython py,2scala scala,3etext etx,3fv sfv,2tcl tcl tk,3ex tex ltx sty cls,2uuencode uu,2vcalendar vcs,5rd vcf;video:03gpp 3gp,42 3g2,0annodex axv,0dl,1v dif dv,0fli,0gl,0h261,33,34,0jpeg jpgv,2m jpm jpgm,0mj2 mj2 mjp2,1p2t ts,24 mp4 mp4v mpg4,2eg mpeg mpg mpe m1v m2v mp2 mpa mpv2,0ogg ogv,0quicktime qt mov,0vnd.dece.hd uvh uvvh,9mobile uvm uvvm,9pd uvp uvvp,9sd uvs uvvs,9video uvv uvvv,5vb.file dvb,4fvt fvt,4mpegurl mxu m4u,5s-playready.media.pyv pyv,4uvvu.mp4 uvu uvvu,4vivo viv,0webm,0x-f4v f4v,3lv flv,2la-asf lsf lsx,2m4v m4v,3atroska mpv mkv mk3d mks,3ng mng,3s-asf asf asx asr,5vob vob,5wm wm,7v wmv,7x wmx,6vx wvx,4video avi,2sgi-movie movie,3mv smv;x-conference:0x-cooltalk ice;x-world:0x-vrml vrm flr wrz xaf xof";

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


	let mimeTypes;

	function getMimeType(filename) {
		return filename && getMimeTypes()[filename.split(".").pop().toLowerCase()] || getMimeType$1();
	}

	function getMimeTypes() {
		if (!mimeTypes) {
			mimeTypes = decodeMimeTypes(encodedMimeTypes);
		}
		return mimeTypes;
	}

	function decodeMimeTypes(data) {
		const mimeTypes = Object.create(null);
		for (const block of data.split(";")) {
			const colonIndex = block.indexOf(":");
			const type = block.slice(0, colonIndex);
			let previousSubtype = "";
			for (const entry of block.slice(colonIndex + 1).split(",")) {
				const tokens = entry.split(" ");
				const subtype = previousSubtype.slice(0, Number.parseInt(tokens[0][0], 36)) + tokens[0].slice(1);
				previousSubtype = subtype;
				const expandedSubtype = subtype.replace(/!/g, "+xml");
				const extensions = tokens.length > 1 ? tokens.slice(1) : [expandedSubtype.split("+")[0]];
				for (const extension of extensions) {
					mimeTypes[extension] = type + "/" + expandedSubtype;
				}
			}
		}
		return mimeTypes;
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


	p$1(setDefaultConfiguration);

	exports.BlobReader = BlobReader;
	exports.BlobWriter = BlobWriter;
	exports.Data64URIReader = Data64URIReader;
	exports.Data64URIWriter = Data64URIWriter;
	exports.ERR_ABORTED = ERR_ABORTED;
	exports.ERR_AMBIGUOUS_ARCHIVE = ERR_AMBIGUOUS_ARCHIVE;
	exports.ERR_BAD_FORMAT = ERR_BAD_FORMAT;
	exports.ERR_CENTRAL_DIRECTORY_NOT_FOUND = ERR_CENTRAL_DIRECTORY_NOT_FOUND;
	exports.ERR_DUPLICATED_NAME = ERR_DUPLICATED_NAME;
	exports.ERR_ENCRYPTED = ERR_ENCRYPTED;
	exports.ERR_ENCRYPTED_CENTRAL_DIRECTORY = ERR_ENCRYPTED_CENTRAL_DIRECTORY;
	exports.ERR_ENTRY_DATA_OUT_OF_BOUNDS = ERR_ENTRY_DATA_OUT_OF_BOUNDS;
	exports.ERR_ENTRY_EXISTS = ERR_ENTRY_EXISTS;
	exports.ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND;
	exports.ERR_EOCDR_NOT_FOUND = ERR_EOCDR_NOT_FOUND;
	exports.ERR_EXTRAFIELD_ZIP64_NOT_FOUND = ERR_EXTRAFIELD_ZIP64_NOT_FOUND;
	exports.ERR_HTTP_RANGE = ERR_HTTP_RANGE;
	exports.ERR_HTTP_RESOURCE_CHANGED = ERR_HTTP_RESOURCE_CHANGED;
	exports.ERR_INVALID_AUTHENTICATION_CODE = ERR_INVALID_AUTHENTICATION_CODE;
	exports.ERR_INVALID_CODEC_DEFINITION = ERR_INVALID_CODEC_DEFINITION;
	exports.ERR_INVALID_CODEC_MODULE = ERR_INVALID_CODEC_MODULE;
	exports.ERR_INVALID_COMMENT = ERR_INVALID_COMMENT;
	exports.ERR_INVALID_COMMENT_TYPE = ERR_INVALID_COMMENT_TYPE;
	exports.ERR_INVALID_COMPRESSED_DATA = ERR_INVALID_COMPRESSED_DATA;
	exports.ERR_INVALID_CRC32 = ERR_INVALID_CRC32;
	exports.ERR_INVALID_DATE = ERR_INVALID_DATE;
	exports.ERR_INVALID_ENCRYPTION_STRENGTH = ERR_INVALID_ENCRYPTION_STRENGTH;
	exports.ERR_INVALID_ENTRY_COMMENT = ERR_INVALID_ENTRY_COMMENT;
	exports.ERR_INVALID_ENTRY_COMMENT_TYPE = ERR_INVALID_ENTRY_COMMENT_TYPE;
	exports.ERR_INVALID_ENTRY_NAME = ERR_INVALID_ENTRY_NAME;
	exports.ERR_INVALID_EXTRAFIELD = ERR_INVALID_EXTRAFIELD;
	exports.ERR_INVALID_EXTRAFIELD_DATA = ERR_INVALID_EXTRAFIELD_DATA;
	exports.ERR_INVALID_EXTRAFIELD_DATA_TYPE = ERR_INVALID_EXTRAFIELD_DATA_TYPE;
	exports.ERR_INVALID_EXTRAFIELD_TYPE = ERR_INVALID_EXTRAFIELD_TYPE;
	exports.ERR_INVALID_FILENAME_VALIDATION = ERR_INVALID_FILENAME_VALIDATION;
	exports.ERR_INVALID_FUNCTION_OPTION = ERR_INVALID_FUNCTION_OPTION;
	exports.ERR_INVALID_GID = ERR_INVALID_GID;
	exports.ERR_INVALID_LEVEL = ERR_INVALID_LEVEL;
	exports.ERR_INVALID_MAX_APPENDED_DATA_SIZE = ERR_INVALID_MAX_APPENDED_DATA_SIZE;
	exports.ERR_INVALID_MAX_WORKERS = ERR_INVALID_MAX_WORKERS;
	exports.ERR_INVALID_MSDOS_ATTRIBUTES = ERR_INVALID_MSDOS_ATTRIBUTES;
	exports.ERR_INVALID_MSDOS_DATA = ERR_INVALID_MSDOS_DATA;
	exports.ERR_INVALID_PASSWORD = ERR_INVALID_PASSWORD;
	exports.ERR_INVALID_PASSWORD_TYPE = ERR_INVALID_PASSWORD_TYPE;
	exports.ERR_INVALID_PASS_THROUGH = ERR_INVALID_PASS_THROUGH;
	exports.ERR_INVALID_READER_OPTIONS = ERR_INVALID_READER_OPTIONS;
	exports.ERR_INVALID_SIGNAL = ERR_INVALID_SIGNAL;
	exports.ERR_INVALID_SIGNATURE = ERR_INVALID_SIGNATURE;
	exports.ERR_INVALID_SIGNATURE_DATA = ERR_INVALID_SIGNATURE_DATA;
	exports.ERR_INVALID_STRICTNESS = ERR_INVALID_STRICTNESS;
	exports.ERR_INVALID_UID = ERR_INVALID_UID;
	exports.ERR_INVALID_UNCOMPRESSED_SIZE = ERR_INVALID_UNCOMPRESSED_SIZE;
	exports.ERR_INVALID_UNIX_EXTRA_FIELD_TYPE = ERR_INVALID_UNIX_EXTRA_FIELD_TYPE;
	exports.ERR_INVALID_UNIX_ID_SIZE = ERR_INVALID_UNIX_ID_SIZE;
	exports.ERR_INVALID_UNIX_MODE = ERR_INVALID_UNIX_MODE;
	exports.ERR_INVALID_VERSION = ERR_INVALID_VERSION;
	exports.ERR_ITERATOR_COMPLETED_TOO_SOON = ERR_ITERATOR_COMPLETED_TOO_SOON;
	exports.ERR_LOCAL_FILE_HEADER_NOT_FOUND = ERR_LOCAL_FILE_HEADER_NOT_FOUND;
	exports.ERR_OVERLAPPING_ENTRY = ERR_OVERLAPPING_ENTRY;
	exports.ERR_READABLE_CONSUMED = ERR_READABLE_CONSUMED;
	exports.ERR_RESERVED_COMPRESSION_METHOD = ERR_RESERVED_COMPRESSION_METHOD;
	exports.ERR_SPLIT_ZIP_FILE = ERR_SPLIT_ZIP_FILE;
	exports.ERR_UNDEFINED_COMPRESSION_METHOD = ERR_UNDEFINED_COMPRESSION_METHOD;
	exports.ERR_UNDEFINED_READER = ERR_UNDEFINED_READER;
	exports.ERR_UNDEFINED_UNCOMPRESSED_SIZE = ERR_UNDEFINED_UNCOMPRESSED_SIZE;
	exports.ERR_UNDETERMINED_SIZE = ERR_UNDETERMINED_SIZE;
	exports.ERR_UNSAFE_FILENAME = ERR_UNSAFE_FILENAME;
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION$1;
	exports.ERR_UNSUPPORTED_CONTEXT = ERR_UNSUPPORTED_CONTEXT;
	exports.ERR_UNSUPPORTED_CRYPTO_API = ERR_UNSUPPORTED_CRYPTO_API;
	exports.ERR_UNSUPPORTED_ENCRYPTION = ERR_UNSUPPORTED_ENCRYPTION;
	exports.ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH = ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH;
	exports.ERR_UNSUPPORTED_ENCRYPTION_USDZ = ERR_UNSUPPORTED_ENCRYPTION_USDZ;
	exports.ERR_UNSUPPORTED_FORMAT = ERR_UNSUPPORTED_FORMAT;
	exports.ERR_WORKER_STARTUP_TIMEOUT = ERR_WORKER_STARTUP_TIMEOUT;
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
	exports.ZipDirectoryEntry = ZipDirectoryEntry;
	exports.ZipEntry = ZipEntry;
	exports.ZipFS = ZipFS;
	exports.ZipFileEntry = ZipFileEntry;
	exports.ZipReader = ZipReader;
	exports.ZipReaderStream = ZipReaderStream;
	exports.ZipWriter = ZipWriter;
	exports.ZipWriterStream = ZipWriterStream;
	exports.configure = configure;
	exports.createBlobTempStream = createBlobTempStream;
	exports.createOPFSTempStream = createOPFSTempStream;
	exports.createSyncAccessHandleTempStream = createSyncAccessHandleTempStream;
	exports.fs = fs;
	exports.getMimeType = getMimeType;
	exports.registerCodec = registerCodec;
	exports.resetConfiguration = resetConfiguration;
	exports.terminateWorkers = terminateWorkers;
	exports.unregisterCodec = unregisterCodec;

}));
