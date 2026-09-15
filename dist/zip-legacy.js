(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
})(this, (function (exports) { 'use strict';

	const { Array, Object, String, Number, BigInt, Math, Date, Map, Set, Response, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, document, crypto, btoa, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream, navigator, Worker, Symbol, setTimeout, clearTimeout, structuredClone } = typeof globalThis !== 'undefined' ? globalThis : self;

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
	const BITFLAG_COMPRESSED_PATCHED_DATA = 0b100000;
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

	const VERSION_STORE = 0x0A;
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
	const SYMBOL_ASYNC_DISPOSE = Symbol.asyncDispose || Symbol();

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
	const OPTION_CHECK_LOCAL_FILENAME = "checkLocalFilename";
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
	const OPTION_CENTRAL_EXTRA_FIELD = "centralExtraField";
	const OPTION_STRICTNESS = "strictness";
	const OPTION_FILENAME_VALIDATION = "filenameValidation";
	const OPTION_NORMALIZE_FILENAME = "normalizeFilename";
	const OPTION_MAX_APPENDED_DATA_SIZE = "maxAppendedDataSize";
	const OPTION_DECRYPT_CENTRAL_DIRECTORY = "decryptCentralDirectory";
	const OPTION_SIGN_CENTRAL_DIRECTORY = "signCentralDirectory";
	const OPTION_ENTRY = "entry";
	const TEXT_TYPE_FILENAME = "filename";
	const TEXT_TYPE_COMMENT = "comment";
	const STRICTNESS_STRICT = "strict";
	const STRICTNESS_BALANCED = "balanced";
	const STRICTNESS_TOLERANT = "tolerant";
	const PASS_THROUGH_COMPRESSED = "compressed";

	const ERR_INVALID_FUNCTION_OPTION = "Invalid option (must be a function)";
	const ERR_INVALID_SIGNAL = "Invalid signal (must be an AbortSignal instance)";
	const ERR_INVALID_PASSWORD_TYPE = "Invalid password (password must be a string, rawPassword must be a Uint8Array)";
	const ERR_INVALID_PASS_THROUGH_VALUE = "Invalid passThrough option (must be a boolean or 'compressed')";
	const ERR_ABORTED = "The operation was aborted";
	const ABORT_ERROR_NAME = "AbortError";

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

	function throwIfAborted(signal) {
		if (signal && signal.aborted) {
			throw signal.reason === UNDEFINED_VALUE ? new DOMException(ERR_ABORTED, ABORT_ERROR_NAME) : signal.reason;
		}
	}

	function checkPasswordOption(password, rawPassword) {
		if ((password && typeof password != STRING_TYPE) || (rawPassword && !(rawPassword instanceof Uint8Array))) {
			throw new Error(ERR_INVALID_PASSWORD_TYPE);
		}
	}

	function checkPassThroughOption(passThrough) {
		if (passThrough !== UNDEFINED_VALUE && typeof passThrough != BOOLEAN_TYPE && passThrough !== PASS_THROUGH_COMPRESSED) {
			throw new Error(ERR_INVALID_PASS_THROUGH_VALUE);
		}
		return passThrough;
	}

	function checkInteger(value, maxValue, errorMessage) {
		if (!Number.isInteger(value) || value < 0 || value > maxValue) {
			throw new Error(errorMessage);
		}
	}

	function checkIntegerOption(value, maxValue, errorMessage) {
		if (value !== UNDEFINED_VALUE) {
			checkInteger(value, maxValue, errorMessage);
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
	const ERR_INVALID_BASE_URI = "Invalid baseURI (must be a string)";
	const ERR_INVALID_URI = "Invalid URI (must be a string or a function returning a string)";
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
	const PROPERTY_NAME_BASE_URI = "baseURI";

	const URI_PROPERTY_NAMES = [
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
		PROPERTY_NAME_BASE_URI,
		...URI_PROPERTY_NAMES,
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
		} else if (propertyName == PROPERTY_NAME_BASE_URI) {
			if (propertyValue && typeof propertyValue != STRING_TYPE) {
				throw new Error(ERR_INVALID_BASE_URI);
			}
		} else if (URI_PROPERTY_NAMES.includes(propertyName)) {
			if (propertyValue && typeof propertyValue != STRING_TYPE && typeof propertyValue != FUNCTION_TYPE) {
				throw new Error(ERR_INVALID_URI);
			}
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

	const n=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],e=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],o=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],a=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],f=new Uint8Array(288);f.fill(8,0,144),f.fill(9,144,256),f.fill(7,256,280),f.fill(8,280,288);const r=new Uint8Array(30).fill(5);function l(n){const t=new Uint16Array(16);for(const e of n)t[e]++;t[0]=0;const e=new Uint16Array(17);for(let n=1;n<=15;n++)e[n+1]=e[n]+t[n];const o=new Uint16Array(n.length);for(let t=0;t<n.length;t++)n[t]&&(o[e[n[t]]++]=t);return {lengthCounts:t,symbols:o}}const c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=(d=()=>function(c){let s=0,d=0,X=0,v=new Uint8Array(1024),g=0,W=0;for(;!W;){W=V(1);const n=V(2);if(0==n)O();else if(1==n)B(l(f),l(r));else {if(2!=n)throw new Error("invalid deflate block type");B(...b());}}return v.subarray(0,g);function u(){if(s>=c.length)throw new Error("unexpected end of deflate data");return c[s++]}function V(n){for(;X<n;)d|=u()<<X,X+=8;const t=d&(1<<n)-1;return d>>>=n,X-=n,t}function O(){d=0,X=0;const n=u()|u()<<8;s+=2,p(g+n);for(let t=0;t<n;t++)v[g++]=u();}function B(a,f){let r=z(a);for(;256!=r;){if(r<256)p(g+1),v[g++]=r;else {const a=r-257,l=n[a]+V(t[a]),c=z(f),s=e[c]+V(o[c]);p(g+l);const d=g-s;for(let n=0;n<l;n++)v[g++]=v[d+n];}r=z(a);}}function b(){const n=V(5)+257,t=V(5)+1,e=V(4)+4,o=new Uint8Array(19);for(let n=0;n<e;n++)o[a[n]]=V(3);const f=l(o),r=new Uint8Array(n+t);let c=0;for(;c<r.length;){const n=z(f);if(n<16)r[c++]=n;else if(16==n){const n=r[c-1];let t=V(2)+3;for(;t--;)r[c++]=n;}else c+=17==n?V(3)+3:V(7)+11;}return [l(r.subarray(0,n)),l(r.subarray(n))]}function z(n){const{lengthCounts:t,symbols:e}=n;let o=0,a=0,f=0;for(let n=1;n<=15;n++){o|=V(1);const r=t[n];if(o-a<r)return e[f+(o-a)];f+=r,a=a+r<<1,o<<=1;}throw new Error("invalid huffman code")}function p(n){if(v.length<n){let t=2*v.length;for(;t<n;)t*=2;const e=new Uint8Array(t);e.set(v.subarray(0,g)),v=e;}}}(function(n){const t=(n=String(n).replace(/[^A-Za-z0-9+/=]/g,"")).length,e=[];for(let o=0;o<t;o+=4){const t=c.indexOf(n[o])<<18|c.indexOf(n[o+1])<<12|(63&c.indexOf(n[o+2]))<<6|63&c.indexOf(n[o+3]);e.push(t>>16&255),"="!==n[o+2]&&e.push(t>>8&255),"="!==n[o+3]&&e.push(255&t);}return new Uint8Array(e)}("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")),n=>n({workerURI:n=>{const t="text/javascript";let e=d();if("string"==typeof e&&(e=(new TextEncoder).encode(e)),n){const n=new Blob([e],{type:t});return URL.createObjectURL(n)}return "data:"+t+";base64,"+function(n){let t="";const e=n.length;let o=0;for(;o+2<e;o+=3){const e=n[o]<<16|n[o+1]<<8|n[o+2];t+=c[e>>18&63]+c[e>>12&63]+c[e>>6&63]+c[63&e];}const a=e-o;if(1===a){const e=n[o]<<16;t+=c[e>>18&63]+c[e>>12&63]+"==";}else if(2===a){const e=n[o]<<16|n[o+1]<<8;t+=c[e>>18&63]+c[e>>12&63]+c[e>>6&63]+"=";}return t}(e)}}));var d;

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


	function isErrorObject(error) {
		return Boolean(error) && typeof error == "object";
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
	// slower). Signedness is irrelevant to the result: the reads mask/shift it and the final
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
	const [T0$1, T1$1, T2$1, T3$1, T4, T5, T6, T7] = T;

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
						T3$1[b & 0xFF] ^ T2$1[(b >>> 8) & 0xFF] ^ T1$1[(b >>> 16) & 0xFF] ^ T0$1[(b >>> 24) & 0xFF];
				}
			}
			// Remaining tail (and non-typed inputs) byte-at-a-time with the base table.
			for (; offset < length; offset++) {
				crc = (crc >>> 8) ^ T0$1[(crc ^ data[offset]) & 0xFF];
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

	const BLOCK_LENGTH$1 = 16;
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

	function createEngine$1(key, authenticationKey) {
		initTables();
		const roundKeys = new Int32Array(ROUND_KEYS_LENGTH);
		const rounds = expandKey(key, roundKeys);
		const keystream = new Int32Array(BLOCK_LENGTH$1 / 4);
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
			for (; offset + BLOCK_LENGTH$1 <= length; offset += BLOCK_LENGTH$1) {
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
	const ERR_INVALID_AUTHENTICATION_CODE = "Invalid authentication code";
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
	const PBKDF2_ITERATIONS = 1000;
	const BASE_KEY_ALGORITHM = Object.assign({ hash: HASH_ALGORITHM }, PBKDF2_ALGORITHM);
	const DERIVED_BITS_ALGORITHM = Object.assign({ iterations: PBKDF2_ITERATIONS, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);
	const DERIVED_BITS_USAGE = ["deriveBits"];
	const SALT_LENGTH = [8, 12, 16];
	const KEY_LENGTH = [16, 24, 32];
	const AUTHENTICATION_CODE_LENGTH = 10;
	const PASSWORD_VERIFICATION_LENGTH = 2;
	// deno-lint-ignore valid-typeof
	const CRYPTO_API_SUPPORTED = typeof crypto != UNDEFINED_TYPE;
	const subtle = CRYPTO_API_SUPPORTED && crypto.subtle;
	const SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof subtle != UNDEFINED_TYPE;

	let DERIVE_BITS_SUPPORTED = SUBTLE_API_SUPPORTED && typeof subtle.importKey == FUNCTION_TYPE && typeof subtle.deriveBits == FUNCTION_TYPE;
	let createEngine = createEngine$1;

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
						await createDecryptionKeys(aesCrypto, strength, password, subarray(chunk, 0, SALT_LENGTH[strength] + PASSWORD_VERIFICATION_LENGTH));
						chunk = subarray(chunk, SALT_LENGTH[strength] + PASSWORD_VERIFICATION_LENGTH);
						if (checkPasswordOnly) {
							disposeEngine(aesCrypto);
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
						engine,
						pendingInput,
						ready
					} = this;
					if (engine) {
						await ready;
						const originalAuthenticationCode = subarray(pendingInput, pendingInput.length - AUTHENTICATION_CODE_LENGTH);
						const decryptedChunkArray = new Uint8Array(subarray(pendingInput, 0, pendingInput.length - AUTHENTICATION_CODE_LENGTH));
						engine.process(decryptedChunkArray, true);
						const authenticationCode = engine.digest();
						let invalidAuthenticationCode = pendingInput.length < AUTHENTICATION_CODE_LENGTH ? 1 : 0;
						for (let indexByte = 0; indexByte < AUTHENTICATION_CODE_LENGTH; indexByte++) {
							invalidAuthenticationCode |= authenticationCode[indexByte] ^ originalAuthenticationCode[indexByte];
						}
						if (invalidAuthenticationCode && checkAuthenticationCode) {
							throw new Error(ERR_INVALID_AUTHENTICATION_CODE);
						}
						controller.enqueue(decryptedChunkArray);
					}
				},
				cancel() {
					disposeEngine(this);
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
					controller.enqueue(append(aesCrypto, chunk, output, preamble.length, 0, false));
				},
				async flush(controller) {
					const {
						engine,
						pendingInput,
						ready
					} = this;
					if (engine) {
						await ready;
						const encryptedChunkArray = new Uint8Array(pendingInput);
						engine.process(encryptedChunkArray, false);
						const authenticationCode = subarray(engine.digest(), 0, AUTHENTICATION_CODE_LENGTH);
						controller.enqueue(concat(encryptedChunkArray, authenticationCode));
					}
				},
				cancel() {
					disposeEngine(this);
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

	function append(aesCrypto, input, output, paddingStart, paddingEnd, decrypt) {
		const {
			engine,
			pendingInput
		} = aesCrypto;
		if (pendingInput.length) {
			input = concat(pendingInput, input);
		}
		const inputLength = input.length - paddingEnd;
		const alignedLength = inputLength - (inputLength % BLOCK_LENGTH);
		output = expand(output, paddingStart + alignedLength);
		if (alignedLength) {
			const chunk = subarray(output, paddingStart, paddingStart + alignedLength);
			chunk.set(subarray(input, 0, alignedLength));
			engine.process(chunk, decrypt);
		}
		aesCrypto.pendingInput = subarray(input, alignedLength);
		return output;
	}

	async function createDecryptionKeys(decrypt, strength, password, preamble) {
		const passwordVerificationKey = await createKeys$1(decrypt, strength, password, subarray(preamble, 0, SALT_LENGTH[strength]));
		const passwordVerification = subarray(preamble, SALT_LENGTH[strength]);
		if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
			disposeEngine(decrypt);
			throw new Error(ERR_INVALID_PASSWORD);
		}
	}

	function disposeEngine({ engine }) {
		if (engine && engine.dispose) {
			engine.dispose();
		}
	}

	async function createEncryptionKeys(encrypt, strength, password) {
		const salt = getRandomValues(new Uint8Array(SALT_LENGTH[strength]));
		const passwordVerification = await createKeys$1(encrypt, strength, password, salt);
		return concat(salt, passwordVerification);
	}

	async function createKeys$1(aesCrypto, strength, password, salt) {
		aesCrypto.password = null;
		const keyLength = KEY_LENGTH[strength];
		const compositeKey = await deriveKey(password, salt, keyLength * 2 + PASSWORD_VERIFICATION_LENGTH);
		aesCrypto.engine = createEngine(subarray(compositeKey, 0, keyLength), subarray(compositeKey, keyLength, keyLength * 2));
		return subarray(compositeKey, keyLength * 2);
	}

	async function deriveKey(password, salt, length) {
		if (DERIVE_BITS_SUPPORTED) {
			try {
				const baseKey = await subtle.importKey(RAW_FORMAT, password, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
				return new Uint8Array(await subtle.deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), baseKey, length * 8));
			} catch {
				DERIVE_BITS_SUPPORTED = false;
			}
		}
		return pbkdf2(password, salt, PBKDF2_ITERATIONS, length);
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
	const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";

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

	function getRegisteredCodecs() {
		return Array.from(registeredCodecs.values(), codec => Object.assign({}, codec, codecStreams.get(codec.format)));
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
	const ERR_INVALID_CRC32 = "Invalid CRC32";
	const FORMAT_DEFLATE_RAW = "deflate-raw";
	const FORMAT_DEFLATE64_RAW = "deflate64-raw";
	const FORMAT_GZIP = "gzip";
	const GZIP_HEADER_LENGTH = 10;
	const GZIP_TRAILER_LENGTH = 8;
	const GZIP_HEADER_BYTES = [0x1f, 0x8b, 0x08];

	class DeflateStream extends TransformStream {

		constructor(options, { chunkSize, CompressionStreamFallback, CompressionStream }) {
			super({});
			const { compressed, encrypted, useCompressionStream, zipCrypto, computeCrc32, level, deflate64, format, compressionMethod, inputSize } = options;
			const stream = this;
			let crc32Stream, encryptionStream, gzipCrc32Stream;
			let readable = super.readable;
			const codecStreams = format && getCodecStreams(format);
			const GzipCompressionStream = getGzipCompressionStream(useCompressionStream, CompressionStream, CompressionStreamFallback);
			const useGzipCrc32 = computeCrc32 && compressed && !deflate64 && !codecStreams && (!encrypted || zipCrypto) && Boolean(GzipCompressionStream);
			if ((!encrypted || zipCrypto) && computeCrc32 && !useGzipCrc32) {
				crc32Stream = new Crc32Stream();
				readable = pipeThrough(readable, crc32Stream);
			}
			if (compressed) {
				if (codecStreams) {
					readable = pipeThroughBackpressured(readable, createCodecStream(codecStreams.CompressionStream, format, { level, chunkSize, compressionMethod, uncompressedSize: inputSize }));
				} else if (useGzipCrc32) {
					gzipCrc32Stream = new GzipToRawDeflateStream();
					readable = pipeThroughBackpressured(readable, new GzipCompressionStream(FORMAT_GZIP, { level, chunkSize }));
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

	function pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize, crc32) {
		const writer = gzipStream.writable.getWriter();
		const reader = gzipStream.readable.getReader();
		const outputCrc32 = crc32 === UNDEFINED_VALUE ? new Crc32() : UNDEFINED_VALUE;
		let outputLength = 0;
		let inputDone = false;
		let trailerWritten = false;
		let idleCheckArmed = false;
		let readCount = 0;
		let readPending = false;
		let resolveTrailerReady, rejectTrailerReady;
		const trailerReady = new Promise((resolve, reject) => {
			resolveTrailerReady = resolve;
			rejectTrailerReady = reject;
		});
		trailerReady.catch(() => { });
		pump();
		return new ReadableStream({
			async pull(controller) {
				let result;
				try {
					result = await read();
				} catch (error) {
					throw trailerWritten ? getTrailerError(error) : error;
				}
				const { value, done } = result;
				if (done) {
					controller.close();
				} else {
					outputLength += value.length;
					if (outputLength > outputSize) {
						const error = new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
						rejectTrailerReady(error);
						await cancel(reader, error);
						throw error;
					}
					if (outputCrc32) {
						outputCrc32.append(value);
					}
					controller.enqueue(value);
				}
			},
			cancel(reason) {
				rejectTrailerReady(reason);
				return reader.cancel(reason);
			}
		});

		async function pump() {
			const inputReader = readable.getReader();
			try {
				const header = new Uint8Array(GZIP_HEADER_LENGTH);
				header.set(GZIP_HEADER_BYTES);
				await writer.write(header);
				for (; ;) {
					await writer.ready;
					const { value, done } = await inputReader.read();
					if (done) {
						break;
					}
					await writer.write(value);
				}
				inputDone = true;
				if (readPending) {
					armIdleCheck();
				}
				await trailerReady;
				const trailer = new Uint8Array(GZIP_TRAILER_LENGTH);
				const dataView = getDataView(trailer);
				dataView.setUint32(0, outputCrc32 ? outputCrc32.get() : crc32, true);
				dataView.setUint32(4, outputSize, true);
				trailerWritten = true;
				await writer.write(trailer);
				await writer.close();
			} catch (error) {
				await abort(writer, error);
				await cancel(inputReader, error);
			}
		}

		function read() {
			readCount++;
			readPending = true;
			const result = reader.read();
			result.then(onReadSettled, onReadSettled);
			if (inputDone) {
				armIdleCheck();
			}
			return result;
		}

		function onReadSettled() {
			readPending = false;
		}

		async function armIdleCheck() {
			if (!idleCheckArmed) {
				idleCheckArmed = true;
				const count = readCount;
				await nextTask();
				idleCheckArmed = false;
				if (readPending) {
					if (readCount == count) {
						resolveTrailerReady();
					} else {
						armIdleCheck();
					}
				}
			}
		}

		function getTrailerError(error) {
			const trailerError = new Error(outputLength == outputSize ? ERR_INVALID_CRC32 : ERR_INVALID_UNCOMPRESSED_SIZE);
			trailerError.cause = error;
			return trailerError;
		}
	}

	function nextTask() {
		return new Promise(resolve => {
			const { port1, port2 } = new MessageChannel();
			port2.onmessage = () => {
				port1.close();
				port2.close();
				resolve();
			};
			port1.postMessage(UNDEFINED_VALUE);
		});
	}

	class InflateStream extends TransformStream {

		constructor(options, { chunkSize, DecompressionStreamFallback, DecompressionStream }) {
			super({});
			const { zipCrypto, encrypted, checkCrc32, crc32, compressed, useCompressionStream, deflate64, format, compressionMethod, rawBitFlag, outputSize } = options;
			let crc32Stream, decryptionStream, gzipFallback;
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
						gzipFallback = true;
						readable = pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize, crc32);
					}
				}
				readable = mapInflateStreamError(readable);
			}
			if (checkCrc32 && !gzipFallback) {
				crc32Stream = new Crc32Stream();
				readable = pipeThrough(readable, crc32Stream);
			}
			setReadable(this, readable, () => {
				if (crc32Stream) {
					const computedCrc32 = new DataView(crc32Stream.value.buffer).getUint32(0, false);
					if (crc32 != computedCrc32) {
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
			throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		}
		return new CodecStreamClass(format, options);
	}

	function getGzipCompressionStream(useCompressionStream, CompressionStreamNative, CompressionStreamFallback) {
		if (useCompressionStream && CompressionStreamNative) {
			return CompressionStreamNative;
		} else if (CompressionStreamFallback && CompressionStreamFallback.requiresModule) {
			return CompressionStreamFallback;
		}
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
			let outputSize = 0;
			if (!Number.isFinite(chunkSize) || chunkSize < 1) {
				chunkSize = DEFAULT_CHUNK_SIZE;
			}
			super({
				transform(chunk, controller) {
					pendingChunks.push(chunk);
					pendingLength += chunk.length;
					while (pendingLength > chunkSize) {
						outputSize += chunkSize;
						controller.enqueue(shiftChunk());
					}
				},
				flush(controller) {
					if (pendingLength) {
						outputSize += pendingLength;
						controller.enqueue(concatChunks(pendingChunks, pendingLength));
					}
				}
			});
			Object.defineProperty(this, "outputSize", {
				get: () => outputSize
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
			return await loadModule(config);
		}
		return false;
	}

	async function loadModule(config) {
		if (initModule) {
			try {
				await initModule(config);
				return true;
			} catch {
				// ignored
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

		constructor(workerData, { readable, writable }, workerOptions, onTaskFinished) {
			const { options, config, streamOptions, useWebWorkers, transferStreams, workerURI } = workerOptions;
			let { createWorker } = workerOptions;
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
				workerOptions,
				workerURI,
				createWorker,
				transferStreams,
				terminate() {
					return new Promise(resolve => {
						const { worker, busy } = workerData;
						if (busy) {
							workerData.terminateResolvers = workerData.terminateResolvers || [];
							workerData.terminateResolvers.push(resolve);
						} else {
							if (worker) {
								worker.terminate();
								workerData.worker = null;
							}
							resolve();
						}
						workerData.interface = null;
					});
				},
				onTaskFinished() {
					if (workerData.busy) {
						const { terminateResolvers, worker } = workerData;
						if (terminateResolvers) {
							workerData.terminateResolvers = null;
							if (worker) {
								workerData.terminated = true;
								worker.terminate();
							}
						}
						workerData.busy = false;
						const pendingTasks = onTaskFinished(workerData);
						if (terminateResolvers) {
							terminateResolvers.forEach(resolve => resolve(pendingTasks));
						}
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

	async function runWorker$1({ options, readable, writable, onTaskFinished, workerOptions }, config) {
		let codecStream, chunkStream, modulePromise;
		try {
			if (options.compressed && !options.format) {
				const deflate = options.codecType.startsWith(CODEC_DEFLATE);
				const FallbackStream = deflate ? config.CompressionStreamFallback : config.DecompressionStreamFallback;
				const NativeStream = deflate ? config.CompressionStream : config.DecompressionStream;
				if (!options.useCompressionStream) {
					if (!await moduleLoaded() && (!FallbackStream || FallbackStream.requiresModule)) {
						options.useCompressionStream = true;
					}
				} else if (FallbackStream && FallbackStream.requiresModule && !supportsDeflateRaw(NativeStream)) {
					await moduleLoaded();
				}
			}
			if (options.encrypted && !options.zipCrypto) {
				await moduleLoaded();
			}
			codecStream = new CodecStream(options, config);
			chunkStream = new ChunkStream(getChunkSize(config));
			await readable
				.pipeThrough(codecStream)
				.pipeThrough(chunkStream)
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
				const outputSize = chunkStream ? chunkStream.outputSize : 0;
				workerOptions.outputSize = outputSize;
				if (isErrorObject(error)) {
					try {
						error.outputSize = outputSize;
					} catch {
						// ignored
					}
				}
			}
			throw error;
		} finally {
			onTaskFinished();
		}

		function moduleLoaded() {
			if (!modulePromise) {
				modulePromise = loadModule(config);
			}
			return modulePromise;
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
			rejectResult = error => {
				const { outputSize, workerOptions } = workerData;
				workerOptions.outputSize = outputSize;
				if (isErrorObject(error)) {
					try {
						error.outputSize = outputSize;
					} catch {
						// ignored
					}
				}
				reject(error);
			};
		});
		Object.assign(workerData, {
			reader: null,
			writer: null,
			outputSize: 0,
			destinationFailed: false,
			destinationError: null,
			resolveResult,
			rejectResult,
			result
		});
		const { readable, options } = workerData;
		const { writable, closed, abortPipe } = watchClosedStream(workerData.writable, workerData);
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
			const { outputSize, workerOptions, destinationFailed, destinationError } = workerData;
			workerOptions.outputSize = outputSize;
			const workerFailed = isErrorObject(error) && (error.codecImportFailed || error.workerStartupFailed);
			const reportedError = destinationFailed && !workerFailed ? destinationError : error;
			if (isErrorObject(reportedError)) {
				try {
					reportedError.outputSize = outputSize;
				} catch {
					// ignored
				}
			}
			throw reportedError;
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

	function watchClosedStream(writableSource, workerData) {
		const abortController = new AbortController();
		let aborting;
		const { writable, readable } = new TransformStream({
			transform(chunk, controller) {
				workerData.outputSize += chunk.length;
				controller.enqueue(chunk);
			}
		});
		const closed = readable.pipeTo(writableSource, { preventClose: true, preventAbort: true, signal: abortController.signal });
		closed.catch(error => {
			if (!aborting) {
				Object.assign(workerData, { destinationFailed: true, destinationError: error });
			}
		});
		return {
			writable, closed, abortPipe: () => {
				aborting = true;
				abortController.abort();
			}
		};
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
		const { type, value, messageId, result, error, errorValue } = data;
		const { reader, writer, resolveResult, rejectResult, onTaskFinished, generation } = workerData;
		const stale = () => workerData.generation != generation;
		try {
			if (error) {
				fail(getResponseError(error, errorValue));
			} else {
				if (type == MESSAGE_PULL) {
					const { value, done } = await reader.read();
					if (!stale()) {
						sendMessage({ type: MESSAGE_DATA, value, done, messageId }, workerData);
					}
				}
				if (type == MESSAGE_DATA) {
					const chunk = new Uint8Array(value);
					await writer.ready;
					await writer.write(chunk);
					if (!stale()) {
						sendMessage({ type: MESSAGE_ACK_DATA, messageId }, workerData);
					}
				}
				if (type == MESSAGE_CLOSE) {
					succeed(result);
				}
			}
		} catch (error) {
			if (!stale()) {
				terminateWorker$1(workerData);
				fail(error);
			}
		}

		function fail(error) {
			if (!stale()) {
				rejectResult(error);
				releaseWriter();
				if (!(isErrorObject(error) && error.codecImportFailed)) {
					onTaskFinished();
				}
			}
		}

		function succeed(result) {
			if (!stale()) {
				resolveResult(result);
				releaseWriter();
				onTaskFinished();
			}
		}

		function releaseWriter() {
			if (writer) {
				writer.releaseLock();
			}
		}
	}

	function getResponseError(errorData, errorValue) {
		const { message, stack, code, name, outputSize, cause, codecImportFailed } = errorData;
		let responseError;
		if (errorValue) {
			responseError = errorValue.value;
		} else {
			responseError = Object.assign(new Error(message), { stack, code, name });
			if (cause) {
				responseError.cause = Object.assign(new Error(cause.message), { name: cause.name });
			}
		}
		if (isErrorObject(responseError)) {
			try {
				if (outputSize !== UNDEFINED_VALUE) {
					responseError.outputSize = outputSize;
				}
				if (codecImportFailed) {
					responseError.codecImportFailed = true;
				}
				if (errorValue) {
					if (responseError.name !== name) {
						responseError.name = name;
					}
					if (responseError.code !== code) {
						responseError.code = code;
					}
				}
			} catch {
				// ignored
			}
		}
		return responseError;
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
			if (workerData.terminated) {
				workerData.terminated = false;
				return runPendingRequestsInline();
			} else if (pendingRequests.length) {
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
			resolve(new CodecWorker({}, stream, getInlineWorkerOptions(workerOptions), onInlineTaskFinished));
			armStarvationTimeout();
		}
	}

	function runPendingRequestsInline() {
		const tasks = pendingRequests.splice(0).map(({ resolve, stream, workerOptions }) => new Promise(resolveTask => {
			resolve(new CodecWorker({}, stream, getInlineWorkerOptions(workerOptions), () => {
				onInlineTaskFinished();
				resolveTask();
			}));
		}));
		clearStarvationTimeout();
		return Promise.all(tasks);
	}

	function getInlineWorkerOptions(workerOptions) {
		return Object.assign({}, workerOptions, { useWebWorkers: false, workerURI: UNDEFINED_VALUE, createWorker: UNDEFINED_VALUE });
	}

	function onInlineTaskFinished() {
		clearStarvationTimeout();
		armStarvationTimeout();
	}

	function terminateWorker(workerData, workerOptions) {
		const { config } = workerOptions;
		const { terminateWorkerTimeout } = config;
		if (Number.isFinite(terminateWorkerTimeout) && terminateWorkerTimeout >= 0) {
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

	function clearTerminateTimeout(workerData) {
		const { terminateTimeout } = workerData;
		if (terminateTimeout) {
			clearTimeout(terminateTimeout);
			workerData.terminateTimeout = null;
		}
	}

	async function terminateWorkers() {
		await Promise.allSettled([
			runPendingRequestsInline(),
			...pool.map(workerData => {
				clearTerminateTimeout(workerData);
				return workerData.terminate();
			})
		]);
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

	const CP437 = "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\u00B6\u00A7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\u00C7\u00FC\u00E9\u00E2\u00E4\u00E0\u00E5\u00E7\u00EA\u00EB\u00E8\u00EF\u00EE\u00EC\u00C4\u00C5\u00C9\u00E6\u00C6\u00F4\u00F6\u00F2\u00FB\u00F9\u00FF\u00D6\u00DC\u00A2\u00A3\u00A5\u20A7\u0192\u00E1\u00ED\u00F3\u00FA\u00F1\u00D1\u00AA\u00BA\u00BF\u2310\u00AC\u00BD\u00BC\u00A1\u00AB\u00BB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\u00DF\u0393\u03C0\u03A3\u03C3\u00B5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\u00B1\u2265\u2264\u2320\u2321\u00F7\u2248\u00B0\u2219\u00B7\u221A\u207F\u00B2\u25A0\u00A0".split("");

	function decodeCP437(stringValue) {
		let result = "";
		for (let indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) {
			result += CP437[stringValue[indexCharacter]];
		}
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


	function decodeText(value, encoding) {
		return decode(value, encoding, true);
	}

	function isUTF8Text(value) {
		if (value.some(byte => byte > 0x7f)) {
			try {
				new TextDecoder("utf-8", { fatal: true }).decode(value);
				return true;
			} catch {
				return false;
			}
		} else {
			return false;
		}
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
	const MIN_SUCCESS_HTTP_STATUS = 200;
	const MAX_SUCCESS_HTTP_STATUS = 299;
	const ERR_HTTP_RANGE = "HTTP Range not supported";
	const ERR_HTTP_RESOURCE_CHANGED = "HTTP resource changed";
	const ERR_ITERATOR_COMPLETED_TOO_SOON = "Writer iterator completed too soon";
	const ERR_WRITER_NOT_INITIALIZED = "Writer not initialized";
	const ERR_WRITER_SIZE_NOT_WRITABLE = "Invalid writer (size must be writable)";

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
						chunkOffset += data.length;
					}
					if ((size !== UNDEFINED_VALUE && chunkOffset >= size) || (!data.length && dataSize)) {
						controller.close();
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
			// deno-lint-ignore valid-typeof
			if (typeof sourceBlob.stream == FUNCTION_TYPE) {
				if (!offset && readSize >= size) {
					return toCompatibleReadable(sourceBlob.stream());
				}
				if (blobSliceReliable) {
					return toCompatibleReadable(sourceBlob.slice(offset, offset + readSize).stream());
				}
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
			const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, combineSizeEocd ? -65557 : undefined));
			const acceptRanges = response.headers.get(HTTP_HEADER_ACCEPT_RANGES);
			if (!forceRangeRequests && (!acceptRanges || acceptRanges.toLowerCase() != HTTP_RANGE_UNIT)) {
				throw new Error(ERR_HTTP_RANGE);
			} else {
				let eocdCache;
				if (combineSizeEocd && response.status == 206) {
					eocdCache = new Uint8Array(await response.arrayBuffer());
				}
				setResourceValidators(httpReader, response);
				const contentSize = getContentRangeSize(response);
				if (contentSize === UNDEFINED_VALUE) {
					await getContentLength(httpReader, sendRequest, getRequestData);
				} else {
					httpReader.size = contentSize;
				}
				if (eocdCache && eocdCache.length && getContentRangeOffset(response) === httpReader.size - eocdCache.length) {
					httpReader.eocdCache = eocdCache;
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
			if (index >= size || length === 0) {
				return EMPTY_UINT8_ARRAY;
			} else {
				if (index + length > size) {
					length = size - index;
				}
				if (eocdCache && index >= size - eocdCache.length) {
					const cacheIndex = index - (size - eocdCache.length);
					return eocdCache.slice(cacheIndex, cacheIndex + length);
				}
				const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, index, length));
				if (response.status != 206) {
					throw new Error(ERR_HTTP_RANGE);
				}
				const rangeStart = getContentRangeOffset(response);
				if (rangeStart !== UNDEFINED_VALUE && rangeStart != index) {
					throw new Error(ERR_HTTP_RANGE);
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
			const rangeStart = getContentRangeOffset(response);
			if (rangeStart !== UNDEFINED_VALUE && rangeStart != windowOffset) {
				throw new Error(ERR_HTTP_RANGE);
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

	function getContentRangeOffset(response) {
		const contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);
		if (contentRangeHeader) {
			const rangeStart = Number(contentRangeHeader.trim().split(/[\s-]+/)[1]);
			if (!Number.isNaN(rangeStart)) {
				return rangeStart;
			}
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
		if (response.status >= MIN_SUCCESS_HTTP_STATUS && response.status <= MAX_SUCCESS_HTTP_STATUS) {
			return response;
		} else {
			throw response.status == 416 ? new Error(ERR_HTTP_RANGE) : new Error(ERR_HTTP_STATUS + (response.statusText || response.status));
		}
	}

	function sendXMLHttpRequest(method, { url }, headers) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.addEventListener("load", () => {
				if (request.status >= MIN_SUCCESS_HTTP_STATUS && request.status <= MAX_SUCCESS_HTTP_STATUS) {
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
			try {
				writer.size = writer.size === UNDEFINED_VALUE ? 0 : writer.size;
			} catch {
				throw new Error(ERR_WRITER_SIZE_NOT_WRITABLE);
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


	function addWarning(warnings, reason, filename) {
		if (!warnings.some(warning => warning.reason == reason)) {
			const warning = { reason };
			if (filename !== UNDEFINED_VALUE) {
				warning.filename = filename;
			}
			warnings.push(warning);
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

	function getEncryptionOverhead(encrypted, zipCrypto, encryptionStrength) {
		return encrypted ? (zipCrypto ? 12 : 16 + encryptionStrength * 4) : 0;
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
	const ERR_SPLIT_ZIP_FILE = "Split zip file";
	const ERR_OVERLAPPING_ENTRY = "Overlapping entry found";
	const ERR_ENTRY_DATA_OUT_OF_BOUNDS = "Entry data out of bounds";
	const ERR_AMBIGUOUS_ARCHIVE = "Ambiguous archive";
	const ERR_ENCRYPTED_CENTRAL_DIRECTORY = "Encrypted central directory is not supported";
	const ERR_UNSAFE_FILENAME = "Unsafe filename";
	const ERR_INVALID_STRICTNESS = "Invalid strictness (must be 'strict', 'balanced' or 'tolerant')";
	const ERR_INVALID_FILENAME_VALIDATION = "Invalid filenameValidation (must be 'strict', 'balanced' or 'tolerant')";
	const ERR_INVALID_MAX_APPENDED_DATA_SIZE = "Invalid maxAppendedDataSize (must be a number greater than or equal to 0)";
	const ERR_UNSUPPORTED_UINT64 = "64-bit value exceeds Number.MAX_SAFE_INTEGER";
	const WARNING_UNSORTED_CENTRAL_DIRECTORY = "unsorted central directory";
	const WARNING_UNKNOWN_VERSION = "unknown version needed to extract";
	const WARNING_COMPRESSED_PATCHED_DATA = "compressed patched data";
	const WARNING_MALFORMED_EXTRA_FIELD = "malformed extra field";
	const WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA = "unknown zip64 extensible data";
	const WARNING_WRAPPED_ENTRIES_COUNT = "wrapped entries count";
	const WARNING_APPENDED_DATA = "appended data";
	const WARNING_PREPENDED_DATA = "prepended data";
	const WARNING_PREPENDED_CENTRAL_DIRECTORY = "prepended central directory";
	const WARNING_TRAILING_CENTRAL_DIRECTORY_DATA = "trailing central directory data";
	const WARNING_DUPLICATE_FILENAME = "duplicate filename";
	const WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY = "mismatched zip64 end of central directory record";
	const WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY = "multiple end of central directory records";
	const WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME = "mismatched local file header (filename)";
	const WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG = "mismatched local file header (general purpose bit flag)";
	const WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD = "mismatched local file header (compression method)";
	const WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES = "mismatched local file header (crc32 or sizes)";
	const MAX_KNOWN_VERSION = 63;
	const DRIVE_LETTER_REGEXP = /^[a-zA-Z]:/;
	const PARENT_DIRECTORY_REGEXP = /(^|[\\/])\.\.([\\/]|$)/;
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
	const MAX_SAFE_UINT64 = BigInt(Number.MAX_SAFE_INTEGER);
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
				readRanges: { indexes: new Set(), sortedRanges: [], pendingRanges: [] }
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
			const warnings = zipReader.warnings = [];
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
				throwAmbiguousArchive(WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY);
			}
			const endOfDirectoryView = getDataView(endOfDirectoryInfo);
			let directoryDataLength = getUint32$1(endOfDirectoryView, 12);
			let directoryDataOffset = getUint32$1(endOfDirectoryView, 16);
			const commentOffset = endOfDirectoryInfo.offset;
			const commentLength = getUint16$1(endOfDirectoryView, 20);
			const appendedDataOffset = commentOffset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
			const appendedDataLength = reader.size - appendedDataOffset;
			if (appendedDataLength > maxAppendedDataSize) {
				throwAmbiguousArchive(WARNING_APPENDED_DATA);
			}
			if (appendedDataLength > 0) {
				addWarning(warnings, WARNING_APPENDED_DATA);
			}
			let lastDiskNumber = getUint16$1(endOfDirectoryView, 4);
			const expectedLastDiskNumber = reader.lastDiskNumber || 0;
			let diskNumber = getUint16$1(endOfDirectoryView, 6);
			let filesLength = getUint16$1(endOfDirectoryView, 10);
			let prependedDataLength = 0;
			let prependedCentralDirectory;
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
							getBigUint64(endOfDirectoryView, 4) - (ZIP64_END_OF_CENTRAL_DIR_LENGTH - 12),
							reader.size - directoryDataOffset - ZIP64_END_OF_CENTRAL_DIR_LENGTH);
						if (extensibleDataLength > 0) {
							zip64EndOfDirectoryLength += extensibleDataLength;
							const rawExtensibleData = await readUint8Array(reader, directoryDataOffset + ZIP64_END_OF_CENTRAL_DIR_LENGTH, extensibleDataLength);
							directoryEncryptionInfo = getDirectoryEncryptionInfo(rawExtensibleData);
						}
					}
					if (lastDiskNumber == MAX_16_BITS) {
						lastDiskNumber = getUint32$1(endOfDirectoryView, 16);
					} else if (lastDiskNumber != getUint32$1(endOfDirectoryView, 16)) {
						reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
					}
					if (diskNumber == MAX_16_BITS) {
						diskNumber = getUint32$1(endOfDirectoryView, 20);
					} else if (diskNumber != getUint32$1(endOfDirectoryView, 20)) {
						reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
					}
					if (filesLength == MAX_16_BITS) {
						filesLength = getBigUint64(endOfDirectoryView, 32);
					} else if (filesLength != getBigUint64(endOfDirectoryView, 32)) {
						reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
					}
					if (directoryDataLength == MAX_32_BITS) {
						directoryDataLength = getBigUint64(endOfDirectoryView, 40);
					} else if (directoryDataLength != getBigUint64(endOfDirectoryView, 40)) {
						reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
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
							prependedCentralDirectory = storedPointsAtDirectory;
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
			if (directoryEncryptionInfo && !decryptedDirectory &&
				(directoryArray.length < 4 || getUint32$1(directoryView, 0) == CENTRAL_FILE_HEADER_SIGNATURE)) {
				addWarning(warnings, WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA);
			}
			startOffset = directoryDataOffset;
			const filenameEncoding = getOptionValue$1(zipReader, options, OPTION_FILENAME_ENCODING);
			const commentEncoding = getOptionValue$1(zipReader, options, OPTION_COMMENT_ENCODING);
			const filenames = new Set();
			let duplicateFilename;
			let previousEntryPosition = -1;
			const recoverWrappedFilesLength = !checkAmbiguity && !zip64EndOfDirectory;
			if (!filesLength && recoverWrappedFilesLength) {
				filesLength = getWrappedFilesLength(directoryView, directoryArray, offset);
				if (filesLength) {
					addWarning(warnings, WARNING_WRAPPED_ENTRIES_COUNT);
				}
			}
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const fileEntry = new ZipEntry(reader, zipReader.options);
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
				const commentLength = getUint16$1(directoryView, offset + 32);
				const endOffset = commentOffset + commentLength;
				const rawEntryData = new Uint8Array(directoryArray.subarray(filenameOffset, endOffset));
				const rawFilename = rawEntryData.subarray(0, fileEntry.filenameLength);
				const rawComment = rawEntryData.subarray(fileEntry.filenameLength + fileEntry.extraFieldLength);
				const filenameUTF8 = languageEncodingFlag || (!filenameEncoding && isUTF8Text(rawFilename));
				const commentUTF8 = languageEncodingFlag || (!commentEncoding && isUTF8Text(rawComment));
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
					rawExtraField: rawEntryData.subarray(fileEntry.filenameLength, fileEntry.filenameLength + fileEntry.extraFieldLength),
					rawComment,
					filename,
					comment
				});
				if (readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6)) {
					addWarning(warnings, WARNING_MALFORMED_EXTRA_FIELD, filename);
				}
				fileEntry.offset += prependedDataLength;
				const entryPosition = getDiskOffset$1(reader, fileEntry.diskNumberStart) + fileEntry.offset;
				startOffset = Math.min(entryPosition, startOffset);
				if (entryPosition < previousEntryPosition) {
					addWarning(warnings, WARNING_UNSORTED_CENTRAL_DIRECTORY, filename);
				}
				previousEntryPosition = entryPosition;
				if ((fileEntry.version & MAX_8_BITS) > MAX_KNOWN_VERSION) {
					addWarning(warnings, WARNING_UNKNOWN_VERSION, filename);
				}
				if ((fileEntry.rawBitFlag & BITFLAG_COMPRESSED_PATCHED_DATA) == BITFLAG_COMPRESSED_PATCHED_DATA) {
					addWarning(warnings, WARNING_COMPRESSED_PATCHED_DATA, filename);
				}
				if (filenames.has(fileEntry.filename)) {
					duplicateFilename = true;
				}
				filenames.add(fileEntry.filename);
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
					executable,
					directory: modeIsDir || upperIsDir || (msDosCompatible && msdosAttributes.directory) || fileEntry.filename.endsWith(DIRECTORY_SIGNATURE),
					zipCrypto: fileEntry.encrypted && !fileEntry.extraFieldAES
				});
				const entry = new Entry(fileEntry);
				entry.getData = (writer, options) => fileEntry.getData(writer, entry, zipReader.readRanges, options);
				entry.arrayBuffer = async options => {
					const writer = new TransformStream();
					const arrayBufferPromise = streamToBlob(writer.readable).then(blob => blob.arrayBuffer());
					arrayBufferPromise.catch(() => { });
					await fileEntry.getData(writer, entry, zipReader.readRanges,
						Object.assign({}, options, { preventClose: false }));
					return arrayBufferPromise;
				};
				offset = endOffset;
				if (indexFile == filesLength - 1 && recoverWrappedFilesLength) {
					const wrappedFilesLength = getWrappedFilesLength(directoryView, directoryArray, offset);
					if (wrappedFilesLength) {
						filesLength += wrappedFilesLength;
						addWarning(warnings, WARNING_WRAPPED_ENTRIES_COUNT);
					}
				}
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
			let digitalSignature = readDigitalSignature(directoryArray.subarray(offset)) ||
				(decryptedDirectory ? readDigitalSignature(dataAfterEncryptedDirectory) : UNDEFINED_VALUE);
			if (!digitalSignature && !decryptedDirectory) {
				const signatureRecordOffset = directoryDataOffset + offset;
				const signatureRecordLength = Math.min(centralDirectoryEndOffset - signatureRecordOffset, 6 + MAX_16_BITS);
				if (signatureRecordLength >= 6) {
					digitalSignature = readDigitalSignature(await readUint8Array(reader, signatureRecordOffset, signatureRecordLength));
				}
			}
			if (digitalSignature) {
				zipReader.digitalSignature = digitalSignature;
				offsetAfterSignature = offset + 6 + digitalSignature.length;
			}
			if ((offset != declaredDirectoryDataLength && offsetAfterSignature != declaredDirectoryDataLength) ||
				(!decryptedDirectory && offset != directoryDataLength && offsetAfterSignature != directoryDataLength)) {
				reportAmbiguity(checkAmbiguity, warnings, WARNING_TRAILING_CENTRAL_DIRECTORY_DATA);
			}
			if (duplicateFilename) {
				reportAmbiguity(checkAmbiguity, warnings, WARNING_DUPLICATE_FILENAME);
			}
			const extractPrependedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_PREPENDED_DATA);
			const extractAppendedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_APPENDED_DATA);
			const splitZipSignatureLength = (checkAmbiguity || extractPrependedData) && filesLength &&
				startOffset == SPLIT_ZIP_FILE_SIGNATURE_LENGTH && await startsWithSplitZipMarker(reader) ? SPLIT_ZIP_FILE_SIGNATURE_LENGTH : 0;
			if (checkAmbiguity && (prependedDataLength || (filesLength && startOffset > splitZipSignatureLength))) {
				throwAmbiguousArchive(WARNING_PREPENDED_DATA);
			}
			if (prependedDataLength || (filesLength && startOffset > SPLIT_ZIP_FILE_SIGNATURE_LENGTH)) {
				addWarning(warnings, WARNING_PREPENDED_DATA);
			}
			if (prependedCentralDirectory) {
				addWarning(warnings, WARNING_PREPENDED_CENTRAL_DIRECTORY);
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

		[SYMBOL_ASYNC_DISPOSE]() {
			return this.close();
		}
	}

	class ZipReaderStream {

		constructor(options = {}) {
			let sourceController;
			const { readable, writable } = new TransformStream({
				start(controller) {
					sourceController = controller;
				}
			});
			const zipReader = new ZipReader(readable, options);
			const gen = zipReader.getEntriesGenerator();
			const pendingEntries = new Set();
			this.readable = new ReadableStream({
				async pull(controller) {
					const { done, value } = await gen.next();
					if (done)
						return controller.close();
					const entryStream = createEntryStream(value, pendingEntries);
					const chunk = {
						...value,
						readable: entryStream.readable
					};
					delete chunk.getData;
					Object.defineProperties(chunk, {
						localDirectory: {
							get: () => value.localDirectory,
							enumerable: true
						},
						warnings: {
							get: () => value.warnings,
							enumerable: true
						}
					});
					controller.enqueue(chunk);
				},
				async cancel(reason) {
					const entryStreams = Array.from(pendingEntries);
					pendingEntries.clear();
					sourceController.error(reason);
					await Promise.allSettled(entryStreams.map(entryStream => entryStream.cancel(reason)));
					await Promise.allSettled([gen.return(), zipReader.close()]);
				}
			});
			this.writable = writable;
		}
	}

	function createEntryStream(entry, pendingEntries) {
		const { readable, writable } = new TransformStream();
		let dataReader;
		const entryStream = {
			cancel: async reason => {
				pendingEntries.delete(entryStream);
				await (dataReader ? dataReader.cancel(reason) : readable.cancel(reason));
			}
		};
		entryStream.readable = new ReadableStream({
			async pull(controller) {
				if (!dataReader) {
					dataReader = readable.getReader();
					pendingEntries.add(entryStream);
					getData();
				}
				const { done, value } = await dataReader.read();
				if (done) {
					controller.close();
				} else {
					controller.enqueue(value);
				}
			},
			cancel: reason => entryStream.cancel(reason)
		}, { highWaterMark: 0 });
		return entryStream;

		async function getData() {
			try {
				await entry.getData(writable, { preventClose: false });
			} catch (error) {
				try {
					await writable.abort(error);
				} catch {
					// ignored
				}
			} finally {
				pendingEntries.delete(entryStream);
			}
		}
	}

	async function isZipFile(reader, options = {}) {
		reader = new GenericReader(reader);
		await initStream(reader);
		if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
			reader = new BlobReader(await streamToBlob(reader.readable));
			await initStream(reader);
		}
		if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
			return false;
		}
		const strictness = getStrictness(options, {});
		const rejectAmbiguousEndOfDirectory = strictness != STRICTNESS_TOLERANT;
		const maxAppendedDataSize = getMaxAppendedDataSize(options[OPTION_MAX_APPENDED_DATA_SIZE], strictness);
		const { endOfDirectoryInfo, endOfDirectoryReachingEndCount } = await findEndOfCentralDirectory(reader, rejectAmbiguousEndOfDirectory, maxAppendedDataSize);
		if (!endOfDirectoryInfo || (strictness == STRICTNESS_STRICT && endOfDirectoryReachingEndCount > 1)) {
			return false;
		}
		const commentLength = getUint16$1(getDataView(endOfDirectoryInfo), 20);
		const appendedDataOffset = endOfDirectoryInfo.offset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
		return reader.size - appendedDataOffset <= maxAppendedDataSize;
	}

	class ZipEntry {

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
			const warnings = fileEntry.warnings = [];
			const localHeaderOffset = getDiskOffset$1(reader, diskNumberStart) + offset;
			const dataArray = await readUint8Array(reader, localHeaderOffset, HEADER_SIZE);
			const dataView = getDataView(dataArray);
			let password = getOptionValue$1(zipEntry, options, OPTION_PASSWORD);
			let rawPassword = getOptionValue$1(zipEntry, options, OPTION_RAW_PASSWORD);
			const passThrough = checkPassThroughOption(getOptionValue$1(zipEntry, options, OPTION_PASS_THROUGH));
			const passThroughCompression = Boolean(passThrough);
			const passThroughEncryption = passThrough === true;
			checkPasswordOption(password, rawPassword);
			password = password && password.length && password;
			rawPassword = rawPassword && rawPassword.length && rawPassword;
			if (extraFieldAES) {
				if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
					throw new Error(ERR_UNSUPPORTED_COMPRESSION);
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
			const dataOffset = localDirectory.dataOffset = localHeaderOffset + HEADER_SIZE + filenameLength + extraFieldLength;
			const checkLocalDirectoryOption = getOptionValue$1(zipEntry, options, OPTION_CHECK_LOCAL_DIRECTORY);
			const entryStrictness = getStrictness(options, zipEntry.options);
			const checkLocalDirectory = getCheckLocalDirectory(checkLocalDirectoryOption, entryStrictness);
			const checkLocalFilenameOption = getOptionValue$1(zipEntry, options, OPTION_CHECK_LOCAL_FILENAME);
			const checkLocalFilename = getCheckLocalFilename(
				checkLocalFilenameOption === UNDEFINED_VALUE ? checkLocalDirectoryOption : checkLocalFilenameOption, entryStrictness);
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
			if (readCommonFooter(zipEntry, localDirectory, dataView, 4, true)) {
				addWarning(warnings, WARNING_MALFORMED_EXTRA_FIELD);
			}
			validateLocalDirectory(zipEntry, localDirectory, rawLocalFilename, checkLocalFilename, checkLocalDirectory ? UNDEFINED_VALUE : warnings);
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
			const checkPasswordOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_PASSWORD_ONLY);
			const encrypted = zipEntry.encrypted && localDirectory.encrypted && (!passThroughEncryption || checkPasswordOnly);
			const zipCrypto = encrypted && !extraFieldAES;
			if (!passThroughEncryption) {
				fileEntry.zipCrypto = zipCrypto;
			}
			if (encrypted && (localDirectory.rawBitFlag & BITFLAG_STRONG_ENCRYPTION) == BITFLAG_STRONG_ENCRYPTION) {
				throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
			}
			const registeredCodec = passThroughCompression ? UNDEFINED_VALUE : getRegisteredCodec(compressionMethod);
			if (compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE && compressionMethod != COMPRESSION_METHOD_DEFLATE_64 && !registeredCodec && !passThroughCompression) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
			if (encrypted) {
				if (!zipCrypto && (extraFieldAES.strength < 1 || extraFieldAES.strength > 3)) {
					throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
				} else if (!password && !rawPassword) {
					throw new Error(ERR_ENCRYPTED);
				}
			}
			if (dataOffset + compressedSize > reader.size) {
				throw new Error(ERR_ENTRY_DATA_OUT_OF_BOUNDS);
			}
			const size = compressedSize;
			const signal = checkSignalOption(getOptionValue$1(zipEntry, options, OPTION_SIGNAL));
			throwIfAborted(signal);
			let checkOverlappingEntry = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY);
			const checkOverlappingEntryOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY);
			if (checkOverlappingEntryOnly) {
				checkOverlappingEntry = true;
			}
			const { onstart, onprogress, onend } = options;
			const compressed = compressionMethod != COMPRESSION_METHOD_STORE && !passThroughCompression;
			const outputSize = passThroughCompression ?
				compressedSize - getEncryptionOverhead(encrypted, zipCrypto, extraFieldAES && extraFieldAES.strength) :
				uncompressedSize;
			const deflate64 = compressionMethod == COMPRESSION_METHOD_DEFLATE_64;
			let useCompressionStream = getOptionValue$1(zipEntry, options, OPTION_USE_COMPRESSION_STREAM);
			if (deflate64) {
				useCompressionStream = false;
			}
			const checkCrc32Option = getOptionValue$1(zipEntry, options, OPTION_CHECK_CRC32);
			const checkCrc32 = (checkCrc32Option === UNDEFINED_VALUE ?
				getOptionValue$1(zipEntry, options, OPTION_CHECK_SIGNATURE) :
				checkCrc32Option) && !passThroughCompression &&
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
			let writable, abortError, aborted;
			try {
				if (!checkOverlappingEntryOnly) {
					if (checkPasswordOnly) {
						writer = new WritableStream();
					}
					writer = new GenericWriter(writer);
					await initStream(writer, getDecodableOutputSize(outputSize, compressedSize, compressed));
					({ writable } = writer);
					const readable = toCompatibleReadable(reader.createReadable({ offset: dataOffset, size }));
					const { outputSize: writtenSize } = await runWorker({ readable, writable }, workerOptions);
					if (writtenSize != outputSize) {
						throw Object.assign(new Error(ERR_INVALID_UNCOMPRESSED_SIZE), { outputSize: writtenSize });
					}
					writer.size += writtenSize;
				}
			} catch (error) {
				const { outputSize: failedOutputSize } = workerOptions;
				if (failedOutputSize !== UNDEFINED_VALUE) {
					writer.size += failedOutputSize;
				} else if (isErrorObject(error) && error.outputSize !== UNDEFINED_VALUE) {
					writer.size += error.outputSize;
				}
				if (!checkPasswordOnly || !isErrorObject(error) || error.message != ERR_ABORT_CHECK_PASSWORD) {
					abortError = error;
					aborted = true;
					throw error;
				}
			} finally {
				const preventClose = !ownsWritable(writer) && getOptionValue$1(zipEntry, options, OPTION_PREVENT_CLOSE);
				if (!preventClose && writable && !writable.locked) {
					const writableWriter = writable.getWriter();
					if (aborted) {
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
	}

	function detectEncryptedCentralDirectory(directoryView) {
		const maxOffset = Math.min(directoryView.byteLength, 1024) - 3;
		for (let offset = 0; offset < maxOffset; offset++) {
			if (getUint32$1(directoryView, offset) == ARCHIVE_EXTRA_DATA_SIGNATURE) {
				return true;
			}
		}
		return false;
	}

	function getWrappedFilesLength(directoryView, directoryArray, offset) {
		let wrappedFilesLength = 0;
		while (offset + CENTRAL_FILE_HEADER_LENGTH <= directoryArray.length && getUint32$1(directoryView, offset) == CENTRAL_FILE_HEADER_SIGNATURE) {
			offset += CENTRAL_FILE_HEADER_LENGTH +
				getUint16$1(directoryView, offset + 28) + getUint16$1(directoryView, offset + 30) + getUint16$1(directoryView, offset + 32);
			wrappedFilesLength++;
		}
		return wrappedFilesLength % (MAX_16_BITS + 1) ? 0 : wrappedFilesLength;
	}

	function readDigitalSignature(signatureRecordArray) {
		if (signatureRecordArray.length >= 6) {
			const signatureRecordView = getDataView(signatureRecordArray);
			if (getUint32$1(signatureRecordView, 0) == DIGITAL_SIGNATURE_RECORD_SIGNATURE) {
				const signatureDataLength = getUint16$1(signatureRecordView, 4);
				if (6 + signatureDataLength <= signatureRecordArray.length) {
					return new Uint8Array(signatureRecordArray.subarray(6, 6 + signatureDataLength));
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
				compressedSize: getBigUint64(extensibleDataView, 2),
				uncompressedSize: getBigUint64(extensibleDataView, 10),
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
		let malformedExtraField = false;
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
			malformedExtraField = true;
		}
		if (offsetExtraField > rawExtraField.length) {
			malformedExtraField = true;
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
		return malformedExtraField;
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
		const version = getUint8(extraFieldView, 0);
		Object.assign(extraFieldUnicode, {
			version,
			[propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
			valid: version == 1 && !fileEntry.bitFlag.languageEncodingFlag && nameCrc32 == getUint32$1(computedCrc32View, 0)
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
		const { indexes, sortedRanges, pendingRanges } = readRanges;
		if (!indexes.has(index)) {
			const overlappingRange = findOverlappingRange(sortedRanges, range) || pendingRanges.find(otherRange => rangesOverlap(range, otherRange));
			if (overlappingRange) {
				const error = new Error(ERR_OVERLAPPING_ENTRY);
				error.overlappingEntry = overlappingRange.fileEntry;
				throw error;
			}
			indexes.add(index);
			pendingRanges.push(range);
			if (pendingRanges.length * pendingRanges.length > sortedRanges.length) {
				pendingRanges.sort((range, otherRange) => range.start - otherRange.start);
				readRanges.sortedRanges = mergeRanges(sortedRanges, pendingRanges);
				pendingRanges.length = 0;
			}
		}
	}

	function findOverlappingRange(sortedRanges, range) {
		let low = 0;
		let high = sortedRanges.length;
		while (low < high) {
			const middle = (low + high) >>> 1;
			if (sortedRanges[middle].start < range.start) {
				low = middle + 1;
			} else {
				high = middle;
			}
		}
		const previousRange = sortedRanges[low - 1];
		const nextRange = sortedRanges[low];
		if (previousRange && rangesOverlap(range, previousRange)) {
			return previousRange;
		}
		if (nextRange && rangesOverlap(range, nextRange)) {
			return nextRange;
		}
	}

	function rangesOverlap(range, otherRange) {
		return range.start < otherRange.end && otherRange.start < range.end;
	}

	function mergeRanges(sortedRanges, pendingRanges) {
		const mergedRanges = [];
		let indexSorted = 0;
		let indexPending = 0;
		while (indexSorted < sortedRanges.length || indexPending < pendingRanges.length) {
			if (indexPending == pendingRanges.length || (indexSorted < sortedRanges.length && sortedRanges[indexSorted].start < pendingRanges[indexPending].start)) {
				mergedRanges.push(sortedRanges[indexSorted++]);
			} else {
				mergedRanges.push(pendingRanges[indexPending++]);
			}
		}
		return mergedRanges;
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
		if (PARENT_DIRECTORY_REGEXP.test(filename) || filename.startsWith("/") || filename.startsWith("\\") || DRIVE_LETTER_REGEXP.test(filename)) {
			return true;
		}
		return filenameValidation == STRICTNESS_STRICT && (pathParts.includes(".") || pathParts.includes("") || filename.includes("\0"));
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
		return { offset, buffer: new Uint8Array(scanArray.subarray(indexByte, indexByte + END_OF_CENTRAL_DIR_LENGTH)).buffer };
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

	function validateLocalDirectory(zipEntry, localDirectory, rawLocalFilename, checkLocalFilename, warnings) {
		const { rawFilename } = zipEntry;
		const reject = !warnings;
		const maskedLocalDirectory = zipEntry.decryptedDirectory &&
			(localDirectory.rawBitFlag & BITFLAG_MASKED_LOCAL_HEADERS) == BITFLAG_MASKED_LOCAL_HEADERS;
		if (checkLocalFilename && !maskedLocalDirectory &&
			(rawLocalFilename.length != rawFilename.length ||
				rawLocalFilename.some((byteValue, indexByte) => byteValue != rawFilename[indexByte]))) {
			reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME);
		}
		if ((localDirectory.rawBitFlag & BITFLAG_AMBIGUITY_MASK) != (zipEntry.rawBitFlag & BITFLAG_AMBIGUITY_MASK)) {
			reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG);
		}
		if (localDirectory.compressionMethod != zipEntry.compressionMethod) {
			reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD);
		}
		if (!localDirectory.bitFlag.dataDescriptor && !maskedLocalDirectory &&
			(localDirectory.crc32 || localDirectory.compressedSize || localDirectory.uncompressedSize) &&
			(localDirectory.crc32 != zipEntry.crc32 ||
				localDirectory.compressedSize != zipEntry.compressedSize ||
				localDirectory.uncompressedSize != zipEntry.uncompressedSize)) {
			reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES);
		}
	}

	function reportAmbiguity(reject, warnings, reason) {
		if (reject) {
			throwAmbiguousArchive(reason);
		} else {
			addWarning(warnings, reason);
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
		const result = new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
		return result < MIN_DATE ? MIN_DATE : result;
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
		const value = view.getBigUint64(offset, true);
		if (value > MAX_SAFE_UINT64) {
			throw new Error(ERR_UNSUPPORTED_UINT64);
		}
		return Number(value);
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
		ERR_INVALID_STRICTNESS: ERR_INVALID_STRICTNESS,
		ERR_INVALID_UNCOMPRESSED_SIZE: ERR_INVALID_UNCOMPRESSED_SIZE,
		ERR_LOCAL_FILE_HEADER_NOT_FOUND: ERR_LOCAL_FILE_HEADER_NOT_FOUND,
		ERR_OVERLAPPING_ENTRY: ERR_OVERLAPPING_ENTRY,
		ERR_SPLIT_ZIP_FILE: ERR_SPLIT_ZIP_FILE,
		ERR_UNSAFE_FILENAME: ERR_UNSAFE_FILENAME,
		ERR_UNSUPPORTED_COMPRESSION: ERR_UNSUPPORTED_COMPRESSION,
		ERR_UNSUPPORTED_ENCRYPTION: ERR_UNSUPPORTED_ENCRYPTION,
		ERR_UNSUPPORTED_UINT64: ERR_UNSUPPORTED_UINT64,
		ERR_WORKER_STARTUP_TIMEOUT: ERR_WORKER_STARTUP_TIMEOUT,
		WARNING_APPENDED_DATA: WARNING_APPENDED_DATA,
		WARNING_COMPRESSED_PATCHED_DATA: WARNING_COMPRESSED_PATCHED_DATA,
		WARNING_DUPLICATE_FILENAME: WARNING_DUPLICATE_FILENAME,
		WARNING_MALFORMED_EXTRA_FIELD: WARNING_MALFORMED_EXTRA_FIELD,
		WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG: WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG,
		WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD: WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD,
		WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES: WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES,
		WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME: WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME,
		WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY: WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY,
		WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY: WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY,
		WARNING_PREPENDED_CENTRAL_DIRECTORY: WARNING_PREPENDED_CENTRAL_DIRECTORY,
		WARNING_PREPENDED_DATA: WARNING_PREPENDED_DATA,
		WARNING_TRAILING_CENTRAL_DIRECTORY_DATA: WARNING_TRAILING_CENTRAL_DIRECTORY_DATA,
		WARNING_UNKNOWN_VERSION: WARNING_UNKNOWN_VERSION,
		WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA: WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA,
		WARNING_UNSORTED_CENTRAL_DIRECTORY: WARNING_UNSORTED_CENTRAL_DIRECTORY,
		WARNING_WRAPPED_ENTRIES_COUNT: WARNING_WRAPPED_ENTRIES_COUNT,
		ZipReader: ZipReader,
		ZipReaderStream: ZipReaderStream,
		isZipFile: isZipFile
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
	const ERR_UNSUPPORTED_SPLIT_USDZ = "Split zip files are not supported in USDZ files";
	const ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH = "Encryption is not supported when the 'passThrough' option is set to true (use 'compressed' instead)";
	const ERR_INVALID_EXTRAFIELD = "Invalid extra field (must be a Map)";
	const ERR_INVALID_EXTRAFIELD_TYPE = "Invalid extra field type (must be integer 0..65535)";
	const ERR_INVALID_EXTRAFIELD_DATA_TYPE = "Invalid extra field data (must be a Uint8Array)";
	const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
	const MIN_UNIX_TIME = -2147483648;
	const MAX_UNIX_TIME = 2147483647;
	const MIN_NTFS_TIME = BigInt(0);
	const MAX_NTFS_TIME = BigInt("0x7fffffffffffffff");
	const ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported (set the 'zip64' option to 'true')";
	const ERR_UNDEFINED_UNCOMPRESSED_SIZE = "Undefined uncompressed size";
	const ERR_UNDEFINED_COMPRESSION_METHOD = "Undefined compression method";
	const ERR_UNDEFINED_CRC32 = "Undefined CRC32";
	const ERR_UNDETERMINED_SIZE = "Undetermined size";
	const ERR_UNDEFINED_READER = "Undefined reader";
	const ERR_INVALID_READER = "Invalid reader (must be a Reader instance, a ReadableStream instance, or an object with a 'readable' property)";
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
	const ERR_INVALID_ENTRY = "Invalid entry option (must be an entry returned by ZipReader#getEntries())";
	const ERR_ZIP_CRYPTO_LAST_MOD_DATE = "The last modification date of an entry encrypted with ZipCrypto cannot be changed when passThrough is set";
	const WARNING_COMPRESSION_UNAVAILABLE = "compression unavailable";
	const WARNING_CLAMPED_LAST_MODIFICATION_DATE = "clamped last modification date";

	const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
	const EXTRAFIELD_OFFSET_AES_VENDOR_VERSION = 4;
	const EXTRAFIELD_OFFSET_AES_COMPRESSION_METHOD = 9;
	const EXTRAFIELD_USDZ_MAX_LENGTH = 67;
	const MIN_PRINTABLE_ASCII_CHARACTER_CODE = 0x20;
	const MAX_PRINTABLE_ASCII_CHARACTER_CODE = 0x7e;
	const VENDOR_VERSION_AE_1 = 1;
	const INFOZIP_EXTRA_FIELD_TYPE = "infozip";
	const UNIX_EXTRA_FIELD_TYPE = "unix";
	const LEVEL_BY_BITFLAG_LEVEL = [8, 9, 5, 3];
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
			if (addSplitZipSignature && options[OPTION_USDZ]) {
				throw new Error(ERR_UNSUPPORTED_SPLIT_USDZ);
			}
			Object.assign(this, {
				writer,
				addSplitZipSignature,
				options,
				fileEntries: new Map(),
				filenames: new Set(),
				offset: options[OPTION_OFFSET] === UNDEFINED_VALUE ? writer.size || writer.writable.size || 0 : options[OPTION_OFFSET],
				initialOffset: options[OPTION_OFFSET] === UNDEFINED_VALUE ? 0 : options[OPTION_OFFSET] - (writer.size || writer.writable.size || 0),
				pendingAddFileCalls: new Set(),
				pendingErrors: [],
				warnings: [],
				bufferedWrites: 0,
				directWrites: 0,
				lastFileEntry: UNDEFINED_VALUE,
				archiveClosed: false
			});
		}

		prependZip(reader) {
			return watchPromiseError(this, prependZipEntries(this, reader));
		}

		appendZip(reader) {
			return watchPromiseError(this, this.appendZipEntries(reader));
		}

		async appendZipEntries(reader) {
			const zipWriter = this;
			const { pendingAddFileCalls, filenames, fileEntries } = zipWriter;
			while (pendingAddFileCalls.size) {
				await Promise.allSettled(Array.from(pendingAddFileCalls));
			}
			let resolveAppendZip;
			const promiseAppendZip = new Promise(resolve => resolveAppendZip = resolve);
			pendingAddFileCalls.add(promiseAppendZip);
			const appendedFilenames = [];
			let releaseLockWriter;
			try {
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
				await initStream(zipWriter.writer);
				const { directoryOffset } = zipReader$1;
				entries.forEach(({ filename }) => {
					if (filenames.has(filename)) {
						throw new Error(ERR_DUPLICATED_NAME);
					}
					filenames.add(filename);
					appendedFilenames.push(filename);
				});
				zipWriter.writerLocked = true;
				const { lockWriter } = zipWriter;
				zipWriter.lockWriter = new Promise(resolve => releaseLockWriter = () => {
					zipWriter.writerLocked = false;
					resolve();
				});
				await lockWriter;
				if (zipWriter.addSplitZipSignature) {
					delete zipWriter.addSplitZipSignature;
					if (!await startsWithSplitZipSignature(reader)) {
						await writeData(zipWriter.writer, getSplitZipSignatureArray());
						zipWriter.offset += SPLIT_ZIP_FILE_SIGNATURE_LENGTH;
					}
				}
				const entryPositions = await copyZipData(zipWriter, reader, entries, directoryOffset);
				entries.forEach(entry => {
					const {
						version,
						rawLastModDate,
						rawFilename,
						bitFlag,
						encrypted,
						uncompressedSize,
						compressedSize,
						extraFieldZip64
					} = entry;
					let {
						compressionMethod,
						rawExtraField,
					} = entry;
					const { level, languageEncodingFlag, dataDescriptor } = bitFlag;
					rawExtraField = removeExtraFieldZip64(rawExtraField || EMPTY_UINT8_ARRAY);
					if (entry.extraFieldAES) {
						compressionMethod = COMPRESSION_METHOD_AES;
					}
					const extraFieldLength = getLength(rawExtraField);
					const zip64UncompressedSize = Boolean(extraFieldZip64) && extraFieldZip64.uncompressedSize !== UNDEFINED_VALUE;
					const zip64CompressedSize = Boolean(extraFieldZip64) && extraFieldZip64.compressedSize !== UNDEFINED_VALUE;
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
						zip64Enabled: true,
						zip64UncompressedSize,
						zip64CompressedSize,
						offset,
						diskNumberStart,
						zip64DiskNumberStart: false,
						rawExtraFieldZip64: EMPTY_UINT8_ARRAY,
						rawExtraFieldAES: EMPTY_UINT8_ARRAY,
						rawExtraFieldExtendedTimestamp: EMPTY_UINT8_ARRAY,
						rawExtraFieldNTFS: EMPTY_UINT8_ARRAY,
						rawExtraFieldUnix: EMPTY_UINT8_ARRAY,
						rawExtraField,
						rawCentralExtraField: EMPTY_UINT8_ARRAY,
						headerArray,
						headerView
					});
					fileEntries.set(entry.filename, entry);
				});
			} catch (error) {
				appendedFilenames.forEach(filename => filenames.delete(filename));
				throw error;
			} finally {
				resolveAppendZip();
				pendingAddFileCalls.delete(promiseAppendZip);
				if (releaseLockWriter) {
					releaseLockWriter();
				}
			}
		}

		add(name = "", reader, options = {}) {
			const zipWriter = this;
			const { pendingAddFileCalls } = zipWriter;
			const promiseAddFile = addFileEntry(zipWriter, name, reader, options);
			pendingAddFileCalls.add(promiseAddFile);
			const deletePendingAddFileCall = () => pendingAddFileCalls.delete(promiseAddFile);
			Promise.prototype.then.call(promiseAddFile, deletePendingAddFileCall, deletePendingAddFileCall);
			return watchPromiseError(zipWriter, promiseAddFile);
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
			if (zipWriter.archiveClosed) {
				return getWriterData(writer);
			}
			if (!(comment instanceof Uint8Array)) {
				throw new Error(ERR_INVALID_COMMENT_TYPE);
			}
			if (getLength(comment) > MAX_16_BITS) {
				throw new Error(ERR_INVALID_COMMENT);
			}
			while (pendingAddFileCalls.size) {
				await Promise.allSettled(Array.from(pendingAddFileCalls));
			}
			await Promise.allSettled(zipWriter.pendingErrors.map(watcher => watcher.recorded));
			const unobservedWatchers = zipWriter.pendingErrors.filter(watcher => watcher.failed && !watcher.observed);
			if (unobservedWatchers.length) {
				const unobservedErrors = unobservedWatchers.map(watcher => watcher.error);
				unobservedWatchers.forEach(watcher => watcher.observed = true);
				const [error] = unobservedErrors;
				try {
					error.entryErrors = unobservedErrors;
				} catch {
					// ignored
				}
				throw error;
			}
			await closeFile(zipWriter, comment, options);
			zipWriter.archiveClosed = true;
			const preventClose = !ownsWritable(writer) && getOptionValue(zipWriter, options, OPTION_PREVENT_CLOSE);
			if (!preventClose) {
				await writable.getWriter().close();
			}
			return getWriterData(writer);
		}

		[SYMBOL_ASYNC_DISPOSE]() {
			return this.close();
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
					await abortWritable(zipWriter, error);
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
			const { zipWriter } = this;
			const results = await Promise.allSettled(Array.from(this.pendingAddFileCalls));
			const entryErrors = results.filter(result => result.status == "rejected").map(result => result.reason);
			if (entryErrors.length) {
				const [error] = entryErrors;
				try {
					error.entryErrors = entryErrors;
				} catch {
					// ignored
				}
				await abortWritable(zipWriter, error);
				throw error;
			}
			try {
				return await zipWriter.close(comment, options);
			} catch (error) {
				await abortWritable(zipWriter, error);
				throw error;
			}
		}
	}

	class WatchedPromise extends Promise {

		then(onFulfilled, onRejected) {
			const { watcher } = this;
			if (watcher) {
				watcher.observed = true;
			}
			return super.then(onFulfilled, onRejected);
		}
	}

	function getWriterData(writer) {
		return writer.getData ? writer.getData() : writer.writable;
	}

	function watchPromiseError(zipWriter, promise) {
		const watchedPromise = new WatchedPromise((resolve, reject) => Promise.prototype.then.call(promise, resolve, reject));
		const watcher = {};
		watchedPromise.watcher = watcher;
		watcher.recorded = Promise.prototype.then.call(watchedPromise, UNDEFINED_VALUE,
			error => Object.assign(watcher, { failed: true, error }));
		zipWriter.pendingErrors.push(watcher);
		return watchedPromise;
	}

	async function prependZipEntries(zipWriter, reader) {
		if (zipWriter.filenames.size) {
			throw new Error(ERR_ZIP_NOT_EMPTY);
		}
		await zipWriter.appendZipEntries(reader);
	}

	async function addFileEntry(zipWriter, name, reader, options) {
		options = Object.assign({}, options);
		const entry = options[OPTION_ENTRY];
		if (entry !== UNDEFINED_VALUE) {
			const { entryOptions, passThroughOptions } = getSourceEntryOptions(entry,
				checkPassThroughOption(getOptionValue(zipWriter, options, OPTION_PASS_THROUGH)),
				getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE));
			delete options[OPTION_ENTRY];
			options = Object.assign(entryOptions, passThroughOptions, options);
		}
		if (getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY) && !name.endsWith(DIRECTORY_SIGNATURE)) {
			name += DIRECTORY_SIGNATURE;
		}
		if (zipWriter.filenames.has(name)) {
			throw new Error(ERR_DUPLICATED_NAME);
		}
		zipWriter.filenames.add(name);
		if (workers < getConfiguration().maxWorkers) {
			workers++;
		} else {
			await new Promise(resolve => pendingEntries.push(resolve));
		}
		try {
			return await addFile(zipWriter, name, reader, options);
		} catch (error) {
			zipWriter.filenames.delete(name);
			throw error;
		} finally {
			const pendingEntry = pendingEntries.shift();
			if (pendingEntry) {
				pendingEntry();
			} else {
				workers--;
			}
		}
	}

	async function abortWritable(zipWriter, error) {
		try {
			await zipWriter.writer.writable.abort(error);
		} catch {
			// ignored
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
		const previousFileEntry = zipWriter.lastFileEntry;
		const pendingFileEntry = {};
		let releaseLockFileEntry;
		if (metadataInfo.resolvedOptions.keepOrder) {
			pendingFileEntry.lockFileEntry = new Promise(resolve => releaseLockFileEntry = resolve);
		}
		zipWriter.lastFileEntry = pendingFileEntry;
		let fileEntry;
		try {
			const { resolvedOptions } = metadataInfo;
			if (resolvedOptions.level != 0 && resolvedOptions.compressionMethod === UNDEFINED_VALUE &&
				!resolvedOptions.passThroughCompression && !(await supportsDeflate(getConfiguration()))) {
				resolvedOptions.level = 0;
				addWarning(zipWriter.warnings, WARNING_COMPRESSION_UNAVAILABLE, name);
			}
			const sizesInfo = await resolveSizes(zipWriter, reader, metadataInfo, options);
			({ reader } = sizesInfo);
			const diskOffset = getDiskOffset(zipWriter.writer);
			const diskNumber = getDiskNumber(zipWriter.writer);
			let crc32 = options.crc32 === UNDEFINED_VALUE ? options[PROPERTY_NAME_SIGNATURE] : options.crc32;
			const storesAE2 = sizesInfo.resolvedOptions.encrypted && !resolvedOptions.zipCrypto;
			if (resolvedOptions.passThroughCompression && !resolvedOptions.passThroughEncryption && storesAE2) {
				crc32 = UNDEFINED_VALUE;
			}
			if (resolvedOptions.passThroughCompression && reader && !storesAE2 && crc32 === UNDEFINED_VALUE) {
				throw new Error(ERR_UNDEFINED_CRC32);
			}
			options = Object.assign({}, options, attributesInfo.resolvedOptions, metadataInfo.resolvedOptions, sizesInfo.resolvedOptions, {
				signature: options[PROPERTY_NAME_SIGNATURE],
				crc32,
				offset: zipWriter.offset - diskOffset,
				diskNumberStart: diskNumber,
				[OPTION_USDZ]: zipWriter.options[OPTION_USDZ]
			});
			const headerInfo = getHeaderInfo(options);
			if (headerInfo.lastModDateClamped) {
				addWarning(zipWriter.warnings, WARNING_CLAMPED_LAST_MODIFICATION_DATE, name);
			}
			const dataDescriptorInfo = getDataDescriptorInfo(options);
			const metadataSize = getLength(headerInfo.localHeaderArray, dataDescriptorInfo.dataDescriptorArray);
			fileEntry = await getFileEntry(zipWriter, name, reader, {
				headerInfo,
				dataDescriptorInfo,
				metadataSize,
				fileEntry: pendingFileEntry,
				previousFileEntry,
				releaseLockFileEntry
			}, options);
		} catch (error) {
			zipWriter.fileEntries.delete(name);
			throw error;
		} finally {
			if (releaseLockFileEntry) {
				releaseLockFileEntry(previousFileEntry && previousFileEntry.lockFileEntry);
			}
		}
		Object.assign(fileEntry, {
			name,
			comment,
			extraField
		});
		return new Entry(fileEntry);
	}

	function getSourceEntryOptions(entry, passThrough, lastModDateOverride) {
		if (entry === null || typeof entry != OBJECT_TYPE || Array.isArray(entry)) {
			throw new Error(ERR_INVALID_ENTRY);
		}
		const {
			externalFileAttributes,
			versionMadeBy,
			comment,
			lastModDate,
			rawLastModDate,
			creationDate,
			lastAccessDate,
			uncompressedSize,
			encrypted,
			zipCrypto,
			crc32,
			compressionMethod,
			extraFieldAES,
			extraFieldUnix,
			internalFileAttributes,
			extraField,
			bitFlag,
			directory,
			uid,
			gid
		} = entry;
		const entryOptions = {
			externalFileAttributes,
			versionMadeBy,
			comment,
			lastModDate,
			creationDate,
			lastAccessDate,
			internalFileAttributes,
			directory
		};
		if (bitFlag && bitFlag.languageEncodingFlag) {
			entryOptions[OPTION_USE_UNICODE_FILE_NAMES] = true;
		}
		const userExtraField = getUserExtraField(extraField);
		if (userExtraField) {
			entryOptions[PROPERTY_NAME_EXTRA_FIELD] = userExtraField;
		}
		if (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE) {
			Object.assign(entryOptions, {
				uid,
				gid,
				unixExtraFieldType: extraFieldUnix ? UNIX_EXTRA_FIELD_TYPE : INFOZIP_EXTRA_FIELD_TYPE
			});
		}
		const passThroughOptions = {};
		if (passThrough && !directory) {
			Object.assign(passThroughOptions, {
				uncompressedSize,
				crc32,
				compressionMethod
			});
			if (passThrough !== PASS_THROUGH_COMPRESSED) {
				Object.assign(passThroughOptions, {
					encrypted,
					zipCrypto,
					encryptionStrength: extraFieldAES ? extraFieldAES.strength : UNDEFINED_VALUE
				});
			}
			if (bitFlag) {
				passThroughOptions.dataDescriptor = bitFlag.dataDescriptor;
				passThroughOptions[OPTION_LEVEL] = LEVEL_BY_BITFLAG_LEVEL[bitFlag.level];
			}
			if (lastModDateOverride === UNDEFINED_VALUE) {
				passThroughOptions.rawLastModDate = rawLastModDate;
			} else if (passThrough !== PASS_THROUGH_COMPRESSED && zipCrypto && (!bitFlag || bitFlag.dataDescriptor) &&
				lastModDateOverride instanceof Date &&
				getDosTimeHighByte(lastModDateOverride) != ((rawLastModDate >>> 8) & MAX_8_BITS)) {
				throw new Error(ERR_ZIP_CRYPTO_LAST_MOD_DATE);
			}
		}
		return { entryOptions, passThroughOptions };
	}

	function getDosTimeHighByte(lastModDate) {
		let dosLastModDate = new Date(Math.ceil(Math.floor(lastModDate.getTime() / 1000) / 2) * 2000);
		if (dosLastModDate < MIN_DATE) {
			dosLastModDate = MIN_DATE;
		} else if (dosLastModDate > MAX_DATE) {
			dosLastModDate = MAX_DATE;
		}
		return ((dosLastModDate.getHours() << 3) | (dosLastModDate.getMinutes() >> 3)) & MAX_8_BITS;
	}

	function resolveAttributes(zipWriter, name, options) {
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
		checkIntegerOption(uid, MAX_32_BITS, ERR_INVALID_UID);
		checkIntegerOption(gid, MAX_32_BITS, ERR_INVALID_GID);
		checkIntegerOption(unixMode, MAX_16_BITS, ERR_INVALID_UNIX_MODE);
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
		checkIntegerOption(msdosAttributesRaw, MAX_8_BITS, ERR_INVALID_MSDOS_ATTRIBUTES);
		if (msdosAttributes && (typeof msdosAttributes !== OBJECT_TYPE || Array.isArray(msdosAttributes))) {
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
		const version = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION);
		if (version !== UNDEFINED_VALUE && version > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		const lastModDate = getDateOptionValue(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE, new Date());
		const rawLastModDate = getOptionValue(zipWriter, options, PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
		const lastAccessDate = getDateOptionValue(zipWriter, options, PROPERTY_NAME_LAST_ACCESS_DATE);
		const creationDate = getDateOptionValue(zipWriter, options, PROPERTY_NAME_CREATION_DATE);
		const internalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES, 0);
		const passThrough = checkPassThroughOption(getOptionValue(zipWriter, options, OPTION_PASS_THROUGH));
		const passThroughCompression = Boolean(passThrough);
		const passThroughEncryption = passThrough === true;
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
		throwIfAborted(signal);
		const useUnicodeFileNames = getOptionValue(zipWriter, options, OPTION_USE_UNICODE_FILE_NAMES,
			!isPrintableASCIIText(rawFilename) || !isPrintableASCIIText(rawComment));
		const compressionMethod = getOptionValue(zipWriter, options, PROPERTY_NAME_COMPRESSION_METHOD);
		const registeredCodec = passThroughCompression || compressionMethod === UNDEFINED_VALUE ? UNDEFINED_VALUE : getRegisteredCodec(compressionMethod);
		if (!passThroughCompression && compressionMethod !== UNDEFINED_VALUE &&
			compressionMethod !== COMPRESSION_METHOD_STORE && compressionMethod !== COMPRESSION_METHOD_DEFLATE && !registeredCodec) {
			throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		}
		let level = getNumberOptionValue(zipWriter, options, OPTION_LEVEL);
		checkIntegerOption(level, MAX_LEVEL, ERR_INVALID_LEVEL);
		if (zipWriter.options[OPTION_USDZ]) {
			if (password !== UNDEFINED_VALUE || rawPassword !== UNDEFINED_VALUE) {
				throw new Error(ERR_UNSUPPORTED_ENCRYPTION_USDZ);
			}
			if (level === UNDEFINED_VALUE && compressionMethod === UNDEFINED_VALUE) {
				level = 0;
			}
		}
		if (passThroughCompression) {
			level = toNumber(options[OPTION_LEVEL]);
		}
		let useCompressionStream = getOptionValue(zipWriter, options, OPTION_USE_COMPRESSION_STREAM);
		let dataDescriptor = getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR);
		if (bufferedWrite && dataDescriptor === UNDEFINED_VALUE) {
			dataDescriptor = false;
		}
		if (dataDescriptor === UNDEFINED_VALUE || (zipCrypto && !passThroughEncryption)) {
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
		const rawCentralExtraField = serializeExtraField(options[OPTION_CENTRAL_EXTRA_FIELD]);
		return {
			comment,
			resolvedOptions: {
				rawFilename,
				rawComment,
				version,
				lastModDate,
				rawLastModDate,
				lastAccessDate,
				creationDate,
				internalFileAttributes,
				passThroughCompression,
				passThroughEncryption,
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
				rawLocalExtraField,
				rawCentralExtraField
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
			checkInteger(type, MAX_16_BITS, ERR_INVALID_EXTRAFIELD_TYPE);
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
		if (metadata.passThroughCompression && !reader && !getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY)) {
			throw new Error(ERR_UNDEFINED_READER);
		}
		let contentSize;
		if (reader) {
			reader = new GenericReader(reader);
			await initStream(reader);
			if (!reader.readable && !reader.readUint8Array) {
				throw new Error(ERR_INVALID_READER);
			}
			({ size: contentSize } = reader);
		}
		return Object.assign({ reader }, resolveEntrySizes(zipWriter, Boolean(reader), contentSize, metadata, options));
	}

	function resolveEntrySizes(zipWriter, hasContent, contentSize, metadata, options) {
		const { passThroughCompression, passThroughEncryption, zipCrypto, password, rawPassword, encryptionStrength } = metadata;
		let { dataDescriptor, zip64, level, compressionMethod } = metadata;
		let maximumCompressedSize = 0;
		let uncompressedSize = 0;
		let unknownSize = false;
		if (passThroughCompression && hasContent) {
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
		if (hasContent && passThroughEncryption && !encrypted && getLength(password, rawPassword)) {
			throw new Error(ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH);
		}
		const encryptedEntry = hasContent && (Boolean((password && getLength(password)) || (rawPassword && getLength(rawPassword))) || (passThroughEncryption && encrypted));
		if (!hasContent) {
			level = 0;
			compressionMethod = COMPRESSION_METHOD_STORE;
		}
		const encryptionOverhead = getEncryptionOverhead(encryptedEntry, zipCrypto, encryptionStrength);
		if (hasContent) {
			if (!passThroughCompression) {
				if (contentSize === UNDEFINED_VALUE) {
					dataDescriptor = true;
					if (zip64 || zip64 === UNDEFINED_VALUE) {
						zip64 = unknownSize = true;
						maximumCompressedSize = MAX_32_BITS + 1;
					}
				} else {
					options.uncompressedSize = uncompressedSize = contentSize;
					maximumCompressedSize = (isCompressed(compressionMethod, level) ? getMaximumCompressedSize(uncompressedSize) : uncompressedSize) + encryptionOverhead;
				}
			} else {
				options.uncompressedSize = uncompressedSize;
				maximumCompressedSize = contentSize === UNDEFINED_VALUE ?
					getMaximumCompressedSize(uncompressedSize) + encryptionOverhead :
					contentSize + (passThroughEncryption ? 0 : encryptionOverhead);
			}
		}
		const emptyEntry = !encryptedEntry && (!hasContent || (contentSize === 0 && !passThroughCompression)) && !isCompressed(compressionMethod, level);
		if (emptyEntry && getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR) === UNDEFINED_VALUE) {
			dataDescriptor = false;
		}
		const zip64UncompressedSize = zip64Enabled || unknownSize || uncompressedSize >= MAX_32_BITS;
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
				emptyEntry,
				zip64,
				zip64Enabled,
				unknownSize,
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
			fileEntries,
			writer
		} = zipWriter;
		const {
			keepOrder,
			dataDescriptor,
			emptyEntry,
			signal
		} = options;
		const {
			headerInfo,
			fileEntry: pendingFileEntry,
			previousFileEntry,
			releaseLockFileEntry
		} = entryInfo;
		const usdz = zipWriter.options[OPTION_USDZ];
		let fileEntry = pendingFileEntry;
		let bufferedWrite;
		let directWrite;
		let releaseLockWriter;
		let writingBufferedEntryData;
		let writingEntryData;
		let writerSizeBeforeEntry;
		let flushedBufferedSize = 0;
		let fileWriter;
		const lockPreviousFileEntry = keepOrder && previousFileEntry ? previousFileEntry.lockFileEntry : UNDEFINED_VALUE;
		fileEntries.set(name, fileEntry);
		try {
			if (options.bufferedWrite || !keepOrder || zipWriter.writerLocked || zipWriter.bufferedWrites || zipWriter.directWrites || (!dataDescriptor && !emptyEntry)) {
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
				directWrite = true;
				zipWriter.directWrites++;
				fileWriter = writer;
				await lockPreviousFileEntry;
				await requestLockWriter();
			}
			await initStream(fileWriter);
			const diskOffset = getDiskOffset(writer);
			if (zipWriter.addSplitZipSignature && !bufferedWrite) {
				await writeSplitZipSignature(zipWriter, writer);
			}
			if (usdz && !bufferedWrite) {
				appendExtraFieldUSDZ(entryInfo, zipWriter.offset - diskOffset);
			}
			const { localHeaderArray } = headerInfo;
			if (!bufferedWrite) {
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
				if (zipWriter.addSplitZipSignature) {
					await writeSplitZipSignature(zipWriter, writer);
				}
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
			if (directWrite) {
				zipWriter.directWrites--;
			}
			if (releaseLockFileEntry) {
				releaseLockFileEntry(lockPreviousFileEntry);
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
			extraFieldExtendedTimestampTime,
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
			useUnicodeFileNames,
			zip64,
			zip64Enabled,
			zip64UncompressedSize,
			zip64CompressedSize,
			zipCrypto,
			dataDescriptor,
			directory,
			executable,
			versionMadeBy,
			rawComment,
			rawExtraField,
			rawCentralExtraField,
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
			passThroughCompression,
			passThroughEncryption,
			format,
			codecURI
		} = options;
		const fileEntry = {
			lockFileEntry,
			versionMadeBy,
			zip64,
			zip64Enabled,
			directory: Boolean(directory),
			executable: Boolean(executable),
			filenameUTF8: Boolean(useUnicodeFileNames),
			rawFilename,
			commentUTF8: Boolean(useUnicodeFileNames),
			rawComment,
			rawExtraFieldZip64,
			localExtraFieldZip64Length,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldUnix,
			rawExtraFieldAES,
			rawExtraField,
			rawCentralExtraField,
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
		if (!passThroughCompression) {
			uncompressedSize = 0;
		}
		const { writable } = writer;
		if (reader) {
			const size = reader.size;
			const readable = toCompatibleReadable(createReadable(reader, { size }));
			const workerOptions = {
				options: {
					codecType: CODEC_DEFLATE,
					inputSize: size,
					level,
					rawPassword,
					password,
					encryptionStrength,
					zipCrypto: encrypted && zipCrypto,
					passwordVerification: encrypted && zipCrypto && (rawLastModDate >> 8) & MAX_8_BITS,
					computeCrc32: !passThroughCompression,
					compressed: compressed && !passThroughCompression,
					encrypted: encrypted && !passThroughEncryption,
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
				if (!passThroughCompression) {
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
				const { outputSize: failedOutputSize } = workerOptions;
				if (failedOutputSize !== UNDEFINED_VALUE) {
					writer.size += failedOutputSize;
				} else if (isErrorObject(error) && error.outputSize !== UNDEFINED_VALUE) {
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
			crc32: encrypted && !zipCrypto && !passThroughCompression ? UNDEFINED_VALUE : crc32,
			extraFieldExtendedTimestampFlag,
			extraFieldExtendedTimestampTime,
			zip64UncompressedSize,
			zip64CompressedSize
		});
		return fileEntry;
	}

	function getHeaderInfo(options) {
		const {
			rawFilename,
			lastModDate,
			rawLastModDate: rawLastModDateOption,
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
			passThroughCompression,
			encrypted,
			zip64UncompressedSize,
			zip64CompressedSize,
			uncompressedSize,
			unknownSize,
			crc32
		} = options;
		let { version, compressionMethod } = options;
		const compressed = !directory && isCompressed(compressionMethod, level);
		let rawLocalExtraFieldZip64;
		const uncompressedFile = passThroughCompression || !compressed;
		const zip64ExtraFieldComplete = zip64 && (options.bufferedWrite || !dataDescriptor || ((!zip64UncompressedSize && !zip64CompressedSize) || (uncompressedFile && !unknownSize)));
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
					const encryptionOverhead = getEncryptionOverhead(encrypted, zipCrypto, encryptionStrength);
					extraFieldZip64.writeUint64(passThroughCompression ? 0 : uncompressedSize + encryptionOverhead);
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
		let extraFieldExtendedTimestampTime;
		if (extendedTimestamp) {
			const lastModTimeUnix = getTimeUnix(lastModDate);
			const lastModTimeUnixInRange = inUnixTimeRange(lastModTimeUnix);
			if (lastModTimeUnixInRange) {
				const extraFieldTimestampLength = 9 + (lastAccessDate ? 4 : 0) + (creationDate ? 4 : 0);
				const extraFieldTimestamp = createRecordWriter(extraFieldTimestampLength);
				extraFieldExtendedTimestampFlag = 0x1 + (lastAccessDate ? 0x2 : 0) + (creationDate ? 0x4 : 0);
				extraFieldExtendedTimestampTime = lastModTimeUnix;
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
			if (unixExtraFieldType == INFOZIP_EXTRA_FIELD_TYPE && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE)) {
				const uidBytes = packUnixId(uid === UNDEFINED_VALUE ? 0 : uid);
				const gidBytes = packUnixId(gid === UNDEFINED_VALUE ? 0 : gid);
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
		if (version === UNDEFINED_VALUE) {
			version = compressionMethod == COMPRESSION_METHOD_STORE && !directory && !encrypted ? VERSION_STORE : VERSION_DEFLATE;
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
			if (passThroughCompression && crc32 !== UNDEFINED_VALUE) {
				rawExtraFieldAES[EXTRAFIELD_OFFSET_AES_VENDOR_VERSION] = VENDOR_VERSION_AE_1;
			}
			setUint16(getDataView(rawExtraFieldAES), EXTRAFIELD_OFFSET_AES_COMPRESSION_METHOD, compressionMethod);
			compressionMethod = COMPRESSION_METHOD_AES;
		}
		const localExtraFieldZip64Length = writeLocalExtraFieldZip64 ? getLength(rawLocalExtraFieldZip64) : 0;
		const extraFieldLength = localExtraFieldZip64Length + getLength(rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField, rawLocalExtraField);
		const maximumUsdzExtraFieldLength = options[OPTION_USDZ] ? EXTRAFIELD_USDZ_MAX_LENGTH : 0;
		if (extraFieldLength + maximumUsdzExtraFieldLength > MAX_16_BITS) {
			throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
		}
		const dosLastModDate = new Date(Math.ceil(Math.floor(lastModDate.getTime() / 1000) / 2) * 2000);
		const clampedLastModDate = dosLastModDate < MIN_DATE ? MIN_DATE : dosLastModDate > MAX_DATE ? MAX_DATE : dosLastModDate;
		const storedLastModDate = getLength(rawExtraFieldExtendedTimestamp) ?
			new Date(getTimeUnix(lastModDate) * 1000) :
			getLength(rawExtraFieldNTFS) ? lastModDate : clampedLastModDate;
		const {
			headerArray,
			headerView,
			rawLastModDate
		} = getHeaderArrayData({
			version,
			bitFlag: getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod),
			compressionMethod,
			uncompressedSize,
			lastModDate: clampedLastModDate,
			rawLastModDate: rawLastModDateOption,
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
			lastModDate: storedLastModDate,
			lastModDateClamped: storedLastModDate === clampedLastModDate && dosLastModDate.getTime() != clampedLastModDate.getTime(),
			rawLastModDate,
			encrypted,
			compressed,
			version,
			compressionMethod,
			extraFieldExtendedTimestampFlag,
			extraFieldExtendedTimestampTime,
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
		const dataArray = new Uint8Array(4);
		const dataView = getDataView(dataArray);
		dataView.setUint32(0, id, true);
		let length = 4;
		while (length > 1 && dataArray[length - 1] === 0) {
			length--;
		}
		return dataArray.subarray(0, length);
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
		passThroughCompression,
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
		if ((!encrypted || zipCrypto || passThroughCompression) && crc32 !== UNDEFINED_VALUE) {
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
	}, localHeaderView, { dataDescriptor, passThroughCompression }) {
		if (!dataDescriptor) {
			if (!encrypted || (passThroughCompression && crc32 !== UNDEFINED_VALUE)) {
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
		const { directoryDataLength, zip64Entries } = createDirectoryRecords(zipWriter.fileEntries);
		const { directoryStart, directoryEnd, directoryArray } = await writeDirectoryRecords(zipWriter, directoryDataLength, options);
		const signatureLength = await writeDigitalSignatureRecord(zipWriter, directoryArray, options);
		await writeEndOfDirectoryRecord(zipWriter, comment, options, { directoryStart, directoryEnd, directoryDataLength, signatureLength, zip64Entries });
	}

	function createDirectoryRecords(files) {
		let directoryDataLength = 0;
		let zip64Entries = false;
		for (const [, fileEntry] of files) {
			const {
				rawFilename,
				rawExtraFieldAES,
				rawComment,
				rawExtraFieldNTFS,
				rawExtraFieldUnix,
				rawExtraField,
				rawCentralExtraField,
				extraFieldExtendedTimestampFlag,
				extraFieldExtendedTimestampTime,
				zip64Enabled,
				uncompressedSize,
				compressedSize
			} = fileEntry;
			let { zip64UncompressedSize, zip64CompressedSize } = fileEntry;
			if (!zip64Enabled) {
				if (zip64UncompressedSize && uncompressedSize < MAX_32_BITS) {
					zip64UncompressedSize = fileEntry.zip64UncompressedSize = false;
				}
				if (zip64CompressedSize && compressedSize < MAX_32_BITS) {
					zip64CompressedSize = fileEntry.zip64CompressedSize = false;
				}
			}
			zip64Entries = zip64Entries || zip64UncompressedSize || zip64CompressedSize;
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
			if (extraFieldExtendedTimestampTime === UNDEFINED_VALUE) {
				rawExtraFieldTimestamp = EMPTY_UINT8_ARRAY;
			} else {
				const extraFieldTimestamp = createRecordWriter(9);
				extraFieldTimestamp.writeUint16(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
				extraFieldTimestamp.writeUint16(5);
				extraFieldTimestamp.writeUint8(extraFieldExtendedTimestampFlag);
				extraFieldTimestamp.writeUint32(extraFieldExtendedTimestampTime);
				rawExtraFieldTimestamp = extraFieldTimestamp.array;
			}
			fileEntry.rawExtraFieldExtendedTimestamp = rawExtraFieldTimestamp;
			const extraFieldLength = getLength(
				rawExtraFieldZip64,
				rawExtraFieldAES,
				rawExtraFieldNTFS,
				rawExtraFieldUnix,
				rawExtraFieldTimestamp,
				rawExtraField,
				rawCentralExtraField);
			if (extraFieldLength > MAX_16_BITS) {
				throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
			}
			directoryDataLength += CENTRAL_FILE_HEADER_LENGTH + getLength(rawFilename, rawComment) + extraFieldLength;
		}
		return { directoryDataLength, zip64Entries };
	}

	async function writeDirectoryRecords(zipWriter, directoryDataLength, options) {
		const { fileEntries, writer } = zipWriter;
		const directoryArray = new Uint8Array(directoryDataLength);
		await initStream(writer);
		let offset = 0;
		let directoryDiskOffset = 0;
		let directoryStartDiskNumber = getDiskNumber(writer);
		let directoryStartDiskOffset = getDiskOffset(writer);
		let directoryEndDiskEntriesLength = 0;
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
				rawCentralExtraField,
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
			const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField, rawCentralExtraField);
			const directoryRecordLength = CENTRAL_FILE_HEADER_LENGTH + getLength(rawFilename, rawComment) + extraFieldLength;
			if (exceedsAvailableSize(writer, offset + directoryRecordLength - directoryDiskOffset)) {
				await writeData(writer, directoryArray.slice(directoryDiskOffset, offset));
				directoryDiskOffset = offset;
				directoryEndDiskEntriesLength = 0;
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
			directoryRecord.writeBytes(rawCentralExtraField);
			directoryRecord.writeBytes(rawComment);
			arraySet(directoryArray, directoryRecord.array, offset);
			offset += directoryRecordLength;
			directoryEndDiskEntriesLength++;
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
			directoryEnd: { diskNumber: getDiskNumber(writer), entriesLength: directoryEndDiskEntriesLength },
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
			const { writer } = zipWriter;
			if (exceedsAvailableSize(writer, getLength(signatureRecord.array))) {
				await writer.closeDisk();
			}
			await writeData(writer, signatureRecord.array);
			return 6 + signatureDataLength;
		}
		return 0;
	}

	async function writeEndOfDirectoryRecord(zipWriter, comment, options, cdInfo) {
		const { writer } = zipWriter;
		const { directoryStart, directoryEnd, signatureLength, zip64Entries } = cdInfo;
		let { directoryDataLength } = cdInfo;
		let fileEntriesLength = zipWriter.fileEntries.size;
		let diskNumber = directoryStart.diskNumber;
		let directoryOffset = getSegmentOffset(zipWriter, directoryStart);
		const commentLength = getLength(comment);
		if (commentLength > MAX_16_BITS) {
			throw new Error(ERR_INVALID_COMMENT);
		}
		let zip64 = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIP64);
		let lastDiskNumber = getDiskNumber(writer);
		if (exceedsAvailableSize(writer, (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH) + commentLength)) {
			lastDiskNumber++;
		}
		if (directoryOffset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || fileEntriesLength >= MAX_16_BITS || lastDiskNumber >= MAX_16_BITS) {
			if (zip64 === false) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			} else {
				zip64 = true;
			}
		} else if (zip64 === UNDEFINED_VALUE && zip64Entries) {
			zip64 = true;
		}
		const endOfdirectoryRecord = createRecordWriter(zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH);
		if (exceedsAvailableSize(writer, getLength(endOfdirectoryRecord.array) + commentLength)) {
			await writer.closeDisk();
		}
		lastDiskNumber = getDiskNumber(writer);
		let diskFileEntriesLength = lastDiskNumber == directoryEnd.diskNumber ? directoryEnd.entriesLength : 0;
		if (zip64) {
			endOfdirectoryRecord.writeUint32(ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
			endOfdirectoryRecord.writeUint64(44);
			endOfdirectoryRecord.writeUint16(45);
			endOfdirectoryRecord.writeUint16(45);
			endOfdirectoryRecord.writeUint32(lastDiskNumber);
			endOfdirectoryRecord.writeUint32(diskNumber);
			endOfdirectoryRecord.writeUint64(diskFileEntriesLength);
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
			diskFileEntriesLength = MAX_16_BITS;
			fileEntriesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			directoryDataLength = MAX_32_BITS;
		}
		endOfdirectoryRecord.writeUint32(END_OF_CENTRAL_DIR_SIGNATURE);
		endOfdirectoryRecord.writeUint16(lastDiskNumber);
		endOfdirectoryRecord.writeUint16(diskNumber);
		endOfdirectoryRecord.writeUint16(diskFileEntriesLength);
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

	function removeExtraFieldZip64(rawExtraField) {
		const rawExtraFieldView = getDataView(rawExtraField);
		let offsetExtraField = 0;
		while (offsetExtraField + 4 <= getLength(rawExtraField)) {
			const size = 4 + getUint16(rawExtraFieldView, offsetExtraField + 2);
			if (getUint16(rawExtraFieldView, offsetExtraField) == EXTRAFIELD_TYPE_ZIP64) {
				return removeExtraFieldZip64(concat(
					rawExtraField.subarray(0, offsetExtraField),
					rawExtraField.subarray(Math.min(offsetExtraField + size, getLength(rawExtraField)))));
			}
			offsetExtraField += size;
		}
		return rawExtraField;
	}

	async function copyZipData(zipWriter, reader, entries, directoryOffset) {
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
			const baseOffset = zipWriter.offset;
			await copyData(zipWriter, reader, 0, directoryOffset);
			entries.forEach(entry => entryPositions.set(entry, {
				offset: baseOffset + getSourceOffset(reader, entry),
				diskNumberStart: 0
			}));
		}
		return entryPositions;
	}

	async function copyData(zipWriter, reader, offset, size) {
		if (size > 0) {
			const { writer } = zipWriter;
			let copiedLength = 0;
			try {
				await flushBufferedData(createReadable(reader, { offset, size }), writer, UNDEFINED_VALUE, chunkLength => copiedLength += chunkLength);
			} catch (error) {
				zipWriter.hasCorruptedEntries = true;
				try {
					error.corruptedEntry = true;
				} catch {
					// ignored
				}
				throw error;
			} finally {
				writer.size += copiedLength;
				zipWriter.offset += copiedLength;
			}
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

	async function writeSplitZipSignature(zipWriter, writer) {
		delete zipWriter.addSplitZipSignature;
		await writeData(writer, getSplitZipSignatureArray());
		zipWriter.offset += SPLIT_ZIP_FILE_SIGNATURE_LENGTH;
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

	function isPrintableASCIIText(rawText) {
		return rawText.every(characterCode =>
			characterCode >= MIN_PRINTABLE_ASCII_CHARACTER_CODE && characterCode <= MAX_PRINTABLE_ASCII_CHARACTER_CODE);
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


	function getSupportedCompressionMethods() {
		const { CompressionStream, DecompressionStream, CompressionStreamFallback, DecompressionStreamFallback } = getConfiguration();
		const supportedMethods = [{
			compressionMethod: COMPRESSION_METHOD_STORE,
			compression: true,
			decompression: true,
			registered: false
		}, {
			compressionMethod: COMPRESSION_METHOD_DEFLATE,
			compression: formatSupported(CompressionStreamFallback, FORMAT_DEFLATE_RAW) ||
				formatSupported(CompressionStream, FORMAT_DEFLATE_RAW) || formatSupported(CompressionStream, FORMAT_GZIP),
			decompression: formatSupported(DecompressionStreamFallback, FORMAT_DEFLATE_RAW) ||
				formatSupported(DecompressionStream, FORMAT_DEFLATE_RAW) || formatSupported(DecompressionStream, FORMAT_GZIP),
			registered: false
		}, {
			compressionMethod: COMPRESSION_METHOD_DEFLATE_64,
			compression: false,
			decompression: formatSupported(DecompressionStreamFallback, FORMAT_DEFLATE64_RAW) ||
				formatSupported(DecompressionStream, FORMAT_DEFLATE64_RAW),
			registered: false
		}];
		for (const codec of getRegisteredCodecs()) {
			const codecStreams = getCodecStreams(codec.format);
			supportedMethods.push({
				compressionMethod: codec.compressionMethod,
				// deno-lint-ignore valid-typeof
				compression: codecStreams ? typeof codecStreams.CompressionStream == FUNCTION_TYPE : UNDEFINED_VALUE,
				// deno-lint-ignore valid-typeof
				decompression: codecStreams ? typeof codecStreams.DecompressionStream == FUNCTION_TYPE : UNDEFINED_VALUE,
				registered: true
			});
		}
		return supportedMethods;
	}

	function formatSupported(StreamClass, format) {
		if (!StreamClass) {
			return false;
		}
		const { supportedFormats } = StreamClass;
		if (supportedFormats) {
			return supportedFormats.includes(format);
		}
		return supportsFormat(StreamClass, format);
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

	const VERSION = "2.15.0";

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


	s(setDefaultConfiguration);

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
	exports.ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND;
	exports.ERR_EOCDR_NOT_FOUND = ERR_EOCDR_NOT_FOUND;
	exports.ERR_EXTRAFIELD_ZIP64_NOT_FOUND = ERR_EXTRAFIELD_ZIP64_NOT_FOUND;
	exports.ERR_HTTP_RANGE = ERR_HTTP_RANGE;
	exports.ERR_HTTP_RESOURCE_CHANGED = ERR_HTTP_RESOURCE_CHANGED;
	exports.ERR_HTTP_STATUS = ERR_HTTP_STATUS;
	exports.ERR_INVALID_AUTHENTICATION_CODE = ERR_INVALID_AUTHENTICATION_CODE;
	exports.ERR_INVALID_BASE_URI = ERR_INVALID_BASE_URI;
	exports.ERR_INVALID_CODEC_DEFINITION = ERR_INVALID_CODEC_DEFINITION;
	exports.ERR_INVALID_CODEC_MODULE = ERR_INVALID_CODEC_MODULE;
	exports.ERR_INVALID_COMMENT = ERR_INVALID_COMMENT;
	exports.ERR_INVALID_COMMENT_TYPE = ERR_INVALID_COMMENT_TYPE;
	exports.ERR_INVALID_COMPRESSED_DATA = ERR_INVALID_COMPRESSED_DATA;
	exports.ERR_INVALID_CRC32 = ERR_INVALID_CRC32;
	exports.ERR_INVALID_DATE = ERR_INVALID_DATE;
	exports.ERR_INVALID_ENCRYPTION_STRENGTH = ERR_INVALID_ENCRYPTION_STRENGTH;
	exports.ERR_INVALID_ENTRY = ERR_INVALID_ENTRY;
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
	exports.ERR_INVALID_PASS_THROUGH_VALUE = ERR_INVALID_PASS_THROUGH_VALUE;
	exports.ERR_INVALID_READER = ERR_INVALID_READER;
	exports.ERR_INVALID_SIGNAL = ERR_INVALID_SIGNAL;
	exports.ERR_INVALID_SIGNATURE_DATA = ERR_INVALID_SIGNATURE_DATA;
	exports.ERR_INVALID_STRICTNESS = ERR_INVALID_STRICTNESS;
	exports.ERR_INVALID_UID = ERR_INVALID_UID;
	exports.ERR_INVALID_UNCOMPRESSED_SIZE = ERR_INVALID_UNCOMPRESSED_SIZE;
	exports.ERR_INVALID_UNIX_EXTRA_FIELD_TYPE = ERR_INVALID_UNIX_EXTRA_FIELD_TYPE;
	exports.ERR_INVALID_UNIX_ID_SIZE = ERR_INVALID_UNIX_ID_SIZE;
	exports.ERR_INVALID_UNIX_MODE = ERR_INVALID_UNIX_MODE;
	exports.ERR_INVALID_URI = ERR_INVALID_URI;
	exports.ERR_INVALID_VERSION = ERR_INVALID_VERSION;
	exports.ERR_ITERATOR_COMPLETED_TOO_SOON = ERR_ITERATOR_COMPLETED_TOO_SOON;
	exports.ERR_LOCAL_FILE_HEADER_NOT_FOUND = ERR_LOCAL_FILE_HEADER_NOT_FOUND;
	exports.ERR_OVERLAPPING_ENTRY = ERR_OVERLAPPING_ENTRY;
	exports.ERR_RESERVED_COMPRESSION_METHOD = ERR_RESERVED_COMPRESSION_METHOD;
	exports.ERR_SPLIT_ZIP_FILE = ERR_SPLIT_ZIP_FILE;
	exports.ERR_UNDEFINED_COMPRESSION_METHOD = ERR_UNDEFINED_COMPRESSION_METHOD;
	exports.ERR_UNDEFINED_CRC32 = ERR_UNDEFINED_CRC32;
	exports.ERR_UNDEFINED_READER = ERR_UNDEFINED_READER;
	exports.ERR_UNDEFINED_UNCOMPRESSED_SIZE = ERR_UNDEFINED_UNCOMPRESSED_SIZE;
	exports.ERR_UNDETERMINED_SIZE = ERR_UNDETERMINED_SIZE;
	exports.ERR_UNSAFE_FILENAME = ERR_UNSAFE_FILENAME;
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION;
	exports.ERR_UNSUPPORTED_CONTEXT = ERR_UNSUPPORTED_CONTEXT;
	exports.ERR_UNSUPPORTED_CRYPTO_API = ERR_UNSUPPORTED_CRYPTO_API;
	exports.ERR_UNSUPPORTED_ENCRYPTION = ERR_UNSUPPORTED_ENCRYPTION;
	exports.ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH = ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH;
	exports.ERR_UNSUPPORTED_ENCRYPTION_USDZ = ERR_UNSUPPORTED_ENCRYPTION_USDZ;
	exports.ERR_UNSUPPORTED_FORMAT = ERR_UNSUPPORTED_FORMAT;
	exports.ERR_UNSUPPORTED_SPLIT_USDZ = ERR_UNSUPPORTED_SPLIT_USDZ;
	exports.ERR_UNSUPPORTED_UINT64 = ERR_UNSUPPORTED_UINT64;
	exports.ERR_WORKER_STARTUP_TIMEOUT = ERR_WORKER_STARTUP_TIMEOUT;
	exports.ERR_WRITER_NOT_INITIALIZED = ERR_WRITER_NOT_INITIALIZED;
	exports.ERR_WRITER_SIZE_NOT_WRITABLE = ERR_WRITER_SIZE_NOT_WRITABLE;
	exports.ERR_ZIP_CRYPTO_LAST_MOD_DATE = ERR_ZIP_CRYPTO_LAST_MOD_DATE;
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
	exports.VERSION = VERSION;
	exports.WARNING_APPENDED_DATA = WARNING_APPENDED_DATA;
	exports.WARNING_CLAMPED_LAST_MODIFICATION_DATE = WARNING_CLAMPED_LAST_MODIFICATION_DATE;
	exports.WARNING_COMPRESSED_PATCHED_DATA = WARNING_COMPRESSED_PATCHED_DATA;
	exports.WARNING_COMPRESSION_UNAVAILABLE = WARNING_COMPRESSION_UNAVAILABLE;
	exports.WARNING_DUPLICATE_FILENAME = WARNING_DUPLICATE_FILENAME;
	exports.WARNING_MALFORMED_EXTRA_FIELD = WARNING_MALFORMED_EXTRA_FIELD;
	exports.WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG = WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG;
	exports.WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD = WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD;
	exports.WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES = WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES;
	exports.WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME = WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME;
	exports.WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY = WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY;
	exports.WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY = WARNING_MULTIPLE_END_OF_CENTRAL_DIRECTORY;
	exports.WARNING_PREPENDED_CENTRAL_DIRECTORY = WARNING_PREPENDED_CENTRAL_DIRECTORY;
	exports.WARNING_PREPENDED_DATA = WARNING_PREPENDED_DATA;
	exports.WARNING_TRAILING_CENTRAL_DIRECTORY_DATA = WARNING_TRAILING_CENTRAL_DIRECTORY_DATA;
	exports.WARNING_UNKNOWN_VERSION = WARNING_UNKNOWN_VERSION;
	exports.WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA = WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA;
	exports.WARNING_UNSORTED_CENTRAL_DIRECTORY = WARNING_UNSORTED_CENTRAL_DIRECTORY;
	exports.WARNING_WRAPPED_ENTRIES_COUNT = WARNING_WRAPPED_ENTRIES_COUNT;
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
	exports.getRegisteredCodecs = getRegisteredCodecs;
	exports.getSupportedCompressionMethods = getSupportedCompressionMethods;
	exports.isZipFile = isZipFile;
	exports.registerCodec = registerCodec;
	exports.resetConfiguration = resetConfiguration;
	exports.terminateWorkers = terminateWorkers;
	exports.unregisterCodec = unregisterCodec;

}));
