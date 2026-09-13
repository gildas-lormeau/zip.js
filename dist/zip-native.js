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

	const n=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],r=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],c=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],s=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],e=new Uint8Array(288);e.fill(8,0,144),e.fill(9,144,256),e.fill(7,256,280),e.fill(8,280,288);const u=new Uint8Array(30).fill(5);function f(n){const r=new Uint16Array(16);for(const c of n)r[c]++;r[0]=0;const c=new Uint16Array(17);for(let n=1;n<=15;n++)c[n+1]=c[n]+r[n];const t=new Uint16Array(n.length);for(let r=0;r<n.length;r++)n[r]&&(t[c[n[r]]++]=r);return {lengthCounts:r,symbols:t}}const i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=(v=()=>function(i){let o=0,v=0,O=0,E=new Uint8Array(1024),l=0,C=0;for(;!C;){C=g(1);const n=g(2);if(0==n)B();else if(1==n)V(f(e),f(u));else {if(2!=n)throw new Error("invalid deflate block type");V(...L());}}return E.subarray(0,l);function W(){if(o>=i.length)throw new Error("unexpected end of deflate data");return i[o++]}function g(n){for(;O<n;)v|=W()<<O,O+=8;const r=v&(1<<n)-1;return v>>>=n,O-=n,r}function B(){v=0,O=0;const n=W()|W()<<8;o+=2,b(l+n);for(let r=0;r<n;r++)E[l++]=W();}function V(s,e){let u=a(s);for(;256!=u;){if(u<256)b(l+1),E[l++]=u;else {const s=u-257,f=n[s]+g(r[s]),i=a(e),o=c[i]+g(t[i]);b(l+f);const v=l-o;for(let n=0;n<f;n++)E[l++]=E[v+n];}u=a(s);}}function L(){const n=g(5)+257,r=g(5)+1,c=g(4)+4,t=new Uint8Array(19);for(let n=0;n<c;n++)t[s[n]]=g(3);const e=f(t),u=new Uint8Array(n+r);let i=0;for(;i<u.length;){const n=a(e);if(n<16)u[i++]=n;else if(16==n){const n=u[i-1];let r=g(2)+3;for(;r--;)u[i++]=n;}else i+=17==n?g(3)+3:g(7)+11;}return [f(u.subarray(0,n)),f(u.subarray(n))]}function a(n){const{lengthCounts:r,symbols:c}=n;let t=0,s=0,e=0;for(let n=1;n<=15;n++){t|=g(1);const u=r[n];if(t-s<u)return c[e+(t-s)];e+=u,s=s+u<<1,t<<=1;}throw new Error("invalid huffman code")}function b(n){if(E.length<n){let r=2*E.length;for(;r<n;)r*=2;const c=new Uint8Array(r);c.set(E.subarray(0,l)),E=c;}}}(function(n){const r=(n=String(n).replace(/[^A-Za-z0-9+/=]/g,"")).length,c=[];for(let t=0;t<r;t+=4){const r=i.indexOf(n[t])<<18|i.indexOf(n[t+1])<<12|(63&i.indexOf(n[t+2]))<<6|63&i.indexOf(n[t+3]);c.push(r>>16&255),"="!==n[t+2]&&c.push(r>>8&255),"="!==n[t+3]&&c.push(255&r);}return new Uint8Array(c)}("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")),n=>n({workerURI:n=>{const r="text/javascript";let c=v();if("string"==typeof c&&(c=(new TextEncoder).encode(c)),n){const n=new Blob([c],{type:r});return URL.createObjectURL(n)}return "data:"+r+";base64,"+function(n){let r="";const c=n.length;let t=0;for(;t+2<c;t+=3){const c=n[t]<<16|n[t+1]<<8|n[t+2];r+=i[c>>18&63]+i[c>>12&63]+i[c>>6&63]+i[63&c];}const s=c-t;if(1===s){const c=n[t]<<16;r+=i[c>>18&63]+i[c>>12&63]+"==";}else if(2===s){const c=n[t]<<16|n[t+1]<<8;r+=i[c>>18&63]+i[c>>12&63]+i[c>>6&63]+"=";}return r}(c)}}));var v;

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
	const [T0$1, T1$1, T2$1, T3$1, T4, T5, T6, T7] = T$1;

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
	const GZIP_OUTPUT_STALL_TIMEOUT = 5000;

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
			let crc32Stream, decryptionStream, gzipCrc32;
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
						gzipCrc32 = new Crc32();
						readable = pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize, gzipCrc32);
					}
				}
				readable = mapInflateStreamError(readable);
			}
			if (checkCrc32 && !gzipCrc32) {
				crc32Stream = new Crc32Stream();
				readable = pipeThrough(readable, crc32Stream);
			}
			setReadable(this, readable, () => {
				if (checkCrc32) {
					const computedCrc32 = gzipCrc32 ? gzipCrc32.get() >>> 0 : new DataView(crc32Stream.value.buffer).getUint32(0, false);
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
		setDefaultConfiguration({ baseURI: (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('zip-native.js', document.baseURI).href)) });
	} catch {
		// ignored
	}

	var{Uint8Array:p,Uint16Array:g,Int32Array:R,TransformStream:H,Math:z,Error:L,Array:k}=globalThis,pe=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],Z=new p(0),qe=new g(0),de=[];for(let e=0;e<6;e++)de.push(e,0==e?8:4);de.push(0,1);var Se=[];for(let e=0;e<14;e++)Se.push(e,0==e?4:2);var Ee=new g([0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576]),ge=new g([0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0]);function M(e,t,n,r,i){if(0==i)return;let f=e instanceof p?e:new p(e.buffer,e.byteOffset,e.byteLength),_=n instanceof p?n.subarray(r,r+i):new p(n.buffer,n.byteOffset+r,i);f.set(_,t);}function Ve(e,t,n){0!=n&&(e instanceof p?e:new p(e.buffer,e.byteOffset,e.byteLength)).fill(0,t,t+n);}function je(){return {next_in:Z,next_in_index:0,avail_in:0,total_in:0,next_out:Z,next_out_index:0,avail_out:0,total_out:0,msg:"",t:0,i:0,_:0,l:void 0}}function Je(e,t){let n=1<<t;return {o:e,u:new p(n),h:n,k:t,m:0,v:0,p:0,T:0}}function te(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1];for(let e=0;e<i;e++)t.push(r);}return new g(t)}var ne=class{constructor(e,t){this.I=e,this.M=t,this.C=0;}},re=class{constructor(e,t,n,r,i){this.Z=e,this.W=t,this.q=n,this.S=r,this.L=i;}};function D_(e){return Q_[e<-6||e>2?9:2-e]||""}function we(e,t){try{e.msg=D_(t);}catch(n){e.msg="zlib error "+String(t)+" ("+n+")";}return t}function $e(e,t){let n=e>>>0,r=0;for(let e=0;e<t;e++)r=r<<1|1&n,n>>>=1;return r}function T(e,t){e.$[e.D++]=t;}function Ae(e,t){T(e,255&t),T(e,t>>>8&255);}function e_(e,t,n){let r=255&n,i=65535&t,f=e.A+e.H;return e.$[f]=255&i,e.$[f+1]=i>>>8&255,e.$[f+2]=r,e.H+=3,i=i-1&65535,e.N[__[r]+ie+1].j++,e.U[y_(i)].j++,e.H==e.R}function De(e,t){let n=255&t,r=e.A+e.H;return e.$[r]=0,e.$[r+1]=0,e.$[r+2]=n,e.H+=3,e.N[n].j++,e.H==e.R}function ye(e){return e.h-ae}function y_(e){return e<256?A_[e]:A_[256+(e>>7)]}function v_(e){let t=Ce+7,n=1<<t,r=(1<<t)-1,i=z.floor((t+I-1)/I),f=1<<8+Ce;return {...Je(e,15),o:e,Y:42,P:0,B:void 0,F:32767,G:t,O:n,V:r,X:i,J:new g(32768),K:new g(n),ee:f,$:new p(32768),te:0,ne:32768,D:0,re:0,ie:0,fe:0,_e:0,le:0,oe:-2,ue:0,ae:0,ce:0,se:0,he:0,de:0,we:0,be:0,ke:0,ge:0,me:0,ve:0,pe:0,xe:0,Te:new R(2*Te+1),ye:new p(2*Te+1),Ie:new g(be+1),H:0,R:0,ze:Z,A:0,Me:0,Ce:0,Ze:8,We:32768,qe:0,Se:0,Le:0,N:new k(fe).fill(0).map(()=>Q()),U:new k(2*me+1).fill(0).map(()=>Q()),$e:new k(2*oe+1).fill(0).map(()=>Q()),De:w_(),Ae:w_(),He:w_()}}function I_(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1],f=Q();f.Qe=r,f.je=i,t.push(f);}return t}function Q(){return {j:0,Qe:0,Ne:0,je:0}}function w_(){return new ne([],dn(null,Z,0,0,0))}function dn(e,t,n,r,i){return new re(e,t,n,r,i)}function $_(){let e=new k(288).fill(0);for(let t=0;t<=143;t++)e[t]=8;for(let t=144;t<=255;t++)e[t]=9;for(let t=256;t<=279;t++)e[t]=7;for(let t=280;t<=287;t++)e[t]=8;return e}function k_(e){let{code:t,length:n}=mn(e),r=new g(2*e.length),i=0;for(let f=0;f<e.length;f++){let e=n[f]||0,_=t[f]||0;r[i++]=e?$e(_,e):0,r[i++]=e;}return new g(r)}function et(e,t,n){let r=0;for(let n=0;n<e.length;n++){let i=t[n]?1<<t[n]:1,f=e[n]+i-1;f>r&&(r=f);}r<n&&(r=n);let i=new p(r+1);for(let n=0;n<=r;n++)for(let r=0;r<e.length;r++){let f=t[r]?1<<t[r]:1,_=e[r];if(n>=_&&n<=_+f-1){i[n]=r;break}}let f=0;for(let n=0;n<e.length-1;n++){let r=t[n]?1<<t[n]:1,i=e[n]+r-1;i>f&&(f=i);}return i[f]=e.length-1,i}function _t(e,t){let n=0;for(let r=0;r<e.length;r++){let i=t[r]?1<<t[r]:1,f=e[r]+i-1;f>n&&(n=f);}let r=new p(n+1);for(let i=0;i<=n;i++)for(let n=0;n<e.length;n++){let f=t[n]?1<<t[n]:1,_=e[n];if(i>=_&&i<=_+f-1){r[i]=n;break}}return r}function tt(e){let t=new p(512),n=e.length-1;for(let r=0;r<256;r++)t[r]=r<=n?e[r]:e[n];for(let r=256;r<=n;r++){let n=r>>7;t[256+(n>255?255:n)]=e[r];}for(let e=257;e<512;e++)0==t[e]&&(t[e]=t[e-1]);return t}function mn(e){let t=z.max(...e),n=new k(t+1).fill(0);for(let t of e)t>0&&n[t]++;let r=new k(e.length).fill(0),i=new k(t+1).fill(0),f=0;for(let e=1;e<=t;e++)f=f+n[e-1]<<1,i[e]=f;for(let t=0;t<e.length;t++){let n=e[t];0!=n&&(r[t]=i[n]++);}return {code:r,length:e}}var Ce=8,I=3,ee=258,ae=ee+I+1,nt=4096,Ue=16,He=ee,bn=29,ie=256,Te=ie+1+bn,me=30,oe=19,fe=2*Te+1,be=15,rt=9,at=255,it=32,ot=4,ve=256,t_=16,n_=17,r_=18,ft=0,N_=1,lt=2,$=-1,Q_=["need dictionary","stream end","","file error","stream error","data error","insufficient memory","buffer error",""],a_=te(de),i_=te(Se),Be=new g(19);Be[16]=2,Be[17]=3,Be[18]=7;var hn=k_($_()),sn=k_(new k(30).fill(5)),Fe=I_(hn),R_=I_(sn),__=et(ge,a_,ee),A_=tt(_t(Ee,i_));function he(e,t,n){if(void 0===t||void 0===n)return 1;let r=65535&e,i=e>>>16&65535,f=0;for(;n>0;){let e=n>2e3?2e3:n;n-=e;do{r=r+t[f++]|0,i=i+r|0;}while(--e);r%=65521,i%=65521;}return (i<<16|r)>>>0}var Ze=[[],[],[],[],[],[],[],[]];for(let e=0;e<256;e++){let t=e;for(let e=0;e<8;e++)t=1&t?3988292384^t>>>1:t>>>1;Ze[0][e]=t;}for(let e=0;e<256;e++)for(let t=1;t<8;t++){let n=Ze[t-1][e];Ze[t][e]=n>>>8^Ze[0][255&n];}var[ut,xn,pn,Sn,En,gn,Tn,wn]=Ze;function W(e=0,t,n){if(!t)return 0;void 0===n&&(n=t.length);let r=0|~e,i=0;if((n=z.min(n,t.length))>=8){let e=new DataView(t.buffer,t.byteOffset,n),f=n-8;for(;i<=f;i+=8){let t=r^e.getInt32(i,true),n=e.getInt32(i+4,true);r=wn[255&t]^Tn[t>>>8&255]^gn[t>>>16&255]^En[t>>>24&255]^Sn[255&n]^pn[n>>>8&255]^xn[n>>>16&255]^ut[n>>>24&255];}}for(;i<n;i++)r=r>>>8^ut[255&(r^t[i])];return (4294967295^r)>>>0}function xt(e){16==e.T?(Ae(e,e.p),e.p=0,e.T=0):e.T>=8&&(T(e,e.p),e.p>>=8,e.T-=8);}function pt(e){e.T>8?Ae(e,e.p):e.T>0&&T(e,e.p),e.Me=1+(e.T-1&7),e.p=0,e.T=0;}function An(e,t,n){let r,i,f=[],_=0;for(r=1;r<=be;r++)_=_+n[r-1]<<1,f[r]=_;for(i=0;i<=t;i++){let t=e[i].je;0!=t&&(e[i].Qe=$e(f[t]++,t));}}function C(e,t,n){e.T>Ue-n?(e.p=65535&(e.p|t<<e.T),Ae(e,e.p),e.p=t>>Ue-e.T&65535,e.T+=n-Ue):(e.p=65535&(e.p|t<<e.T),e.T+=n);}function St(e){for(let t=0;t<e.N.length;t++)e.N[t].j=0;for(let t=0;t<e.U.length;t++)e.U[t].j=0;for(let t=0;t<e.$e.length;t++)e.$e[t].j=0;e.N[ve].j=1,e.ie=e.fe=0,e.H=e._e=0;}function Et(e){if(e.N&&e.N.length>=fe)for(let t=0;t<fe;t++)e.N[t]=Q();else {e.N=[];for(let t=0;t<fe;t++)e.N.push(Q());}if(e.U&&e.U.length>=2*me+1)for(let t=0;t<2*me+1;t++)e.U[t]=Q();else {e.U=[];for(let t=0;t<2*me+1;t++)e.U.push(Q());}if(e.$e&&e.$e.length>=2*oe+1)for(let t=0;t<2*oe+1;t++)e.$e[t]=Q();else {e.$e=[];for(let t=0;t<2*oe+1;t++)e.$e.push(Q());}e.De=new ne(e.N,new re(Fe,a_,ie+1,Te,be)),e.Ae=new ne(e.U,new re(R_,i_,0,me,be)),e.He=new ne(e.$e,new re(null,Be,0,oe,7)),e.p=0,e.T=0,e.Me=0,St(e);}var se=1;function Dn(e,t,n){return n=e.Te[se],e.Te[se]=e.Te[e.Se--],z_(e,t,se),n}function mt(e,t,n,r){return e[t].j<e[n].j||e[t].j==e[n].j&&r[t]<=r[n]}function z_(e,t,n){let r=e.Te[n],i=n<<1;for(;i<=e.Se&&(i<e.Se&&mt(t,e.Te[i+1],e.Te[i],e.ye)&&i++,!mt(t,r,e.Te[i],e.ye));)e.Te[n]=e.Te[i],n=i,i<<=1;e.Te[n]=r;}function yn(e,t){let n,r,i,f,_,l,o=t.I,u=t.C,a=t.M.Z,c=t.M.W,s=t.M.q,h=t.M.L,d=0;for(f=0;f<=be;f++)e.Ie[f]=0;for(o[e.Te[e.Le]].je=0,n=e.Le+1;n<fe;n++)r=e.Te[n],f=o[o[r].Ne].je+1,f>h&&(f=h,d++),o[r].je=f,!(r>u)&&(e.Ie[f]++,_=0,r>=s&&(_=c[r-s]),l=o[r].j,e.ie+=l*(f+_),a&&(e.fe+=l*(a[r].je+_)));if(0!=d){do{for(f=h-1;0==e.Ie[f];)f--;e.Ie[f]--,e.Ie[f+1]+=2,e.Ie[h]--,d-=2;}while(d>0);for(f=h;0!=f;f--)for(r=e.Ie[f];0!=r;)i=e.Te[--n],!(i>u)&&(o[i].je!=f&&(e.ie+=(f-o[i].je)*o[i].j,o[i].je=f),r--);}}function L_(e,t){let n,r,i,f=t.I,_=t.M.Z,l=t.M.S,o=-1;for(e.Se=0,e.Le=fe,n=0;n<l;n++)0!=f[n].j?(e.Te[++e.Se]=o=n,e.ye[n]=0):f[n].je=0;for(;e.Se<2;)i=e.Te[++e.Se]=o<2?++o:0,f[i].j=1,e.ye[i]=0,e.ie--,_&&(e.fe-=_[i].je);for(t.C=o,n=z.floor(e.Se/2);n>=1;n--)z_(e,f,n);i=l;do{n=Dn(e,f,n),r=e.Te[se],e.Te[--e.Le]=n,e.Te[--e.Le]=r,f[i].j=f[n].j+f[r].j,e.ye[i]=(e.ye[n]>=e.ye[r]?e.ye[n]:e.ye[r])+1,f[n].Ne=f[r].Ne=i,e.Te[se]=i++,z_(e,f,se);}while(e.Se>=2);e.Te[--e.Le]=e.Te[se],yn(e,t),An(f,t.C,e.Ie);}function bt(e,t,n){let r,i,f=-1,_=t[0].je,l=0,o=7,u=4;for(0==_&&(o=138,u=3),t[n+1].je=65535,r=0;r<=n;r++)i=_,_=t[r+1].je,!(++l<o&&i==_)&&(l<u?e.$e[i].j+=l:0!=i?(i!=f&&e.$e[i].j++,e.$e[t_].j++):l<=10?e.$e[n_].j++:e.$e[r_].j++,l=0,f=i,0==_?(o=138,u=3):i==_?(o=6,u=3):(o=7,u=4));}function ht(e,t,n){let r,i=-1,f=t[0].je,_=0,l=7,o=4;0==f&&(l=138,o=3);for(let u=0;u<=n;u++)if(r=f,f=t[u+1].je,!(++_<l&&r==f)){if(_<o)do{C(e,e.$e[r].Qe,e.$e[r].je);}while(0!=--_);else 0!=r?(r!=i&&(C(e,e.$e[r].Qe,e.$e[r].je),_--),C(e,e.$e[t_].Qe,e.$e[t_].je),C(e,_-3,2)):_<=10?(C(e,e.$e[n_].Qe,e.$e[n_].je),C(e,_-3,3)):(C(e,e.$e[r_].Qe,e.$e[r_].je),C(e,_-11,7));_=0,i=r,0==f?(l=138,o=3):r==f?(l=6,o=3):(l=7,o=4);}}function vn(e){let t;for(bt(e,e.N,e.De.C),bt(e,e.U,e.Ae.C),L_(e,e.He),t=oe-1;t>=3&&0==e.$e[pe[t]].je;t--);return e.ie+=3*(t+1)+5+5+4,t}function In(e,t,n,r){let i;for(C(e,t-257,5),C(e,n-1,5),C(e,r-4,4),i=0;i<r;i++)C(e,e.$e[pe[i]].je,3);ht(e,e.N,t-1),ht(e,e.U,n-1);}function Pe(e,t,n,r,i=0){C(e,(ft<<1)+r,3),pt(e),Ae(e,n),Ae(e,~n),n&&t&&M(e.$,e.D,t,i,n),e.D+=n;}function gt(e){xt(e);}function Tt(e){C(e,N_<<1,3),C(e,Fe[ve].Qe,Fe[ve].je),xt(e);}function st(e,t,n){let r,i,f,_,l=0;if(0!=e.H)do{r=255&e.ze[l],r+=(255&e.ze[l+1])<<8,i=e.ze[l+2],l+=3,0==r?C(e,t[i].Qe,t[i].je):(f=__[i],C(e,t[f+ie+1].Qe,t[f+ie+1].je),_=a_[f],0!=_&&(i-=ge[f],C(e,i,_)),r--,f=y_(r),C(e,n[f].Qe,n[f].je),_=i_[f],0!=_&&(r-=Ee[f],C(e,r,_)));}while(l<e.H);C(e,t[ve].Qe,t[ve].je);}function kn(e){let t,n=4093624447;for(t=0;t<=31;t++,n>>=1)if(1&n&&0!=e.N[t].j)return 0;if(0!=e.N[9].j||0!=e.N[10].j||0!=e.N[13].j)return 1;for(t=32;t<ie;t++)if(0!=e.N[t].j)return 1;return 0}function wt(e,t,n,r,i=0){let f,_,l=0;e.ke>0?(2==e.o.t&&(e.o.t=kn(e)),L_(e,e.De),L_(e,e.Ae),l=vn(e),f=e.ie+3+7>>3,_=e.fe+3+7>>3,(_<=f||4==e.ge)&&(f=_)):f=_=n+5,n+4<=f&&t?Pe(e,t,n,r,i):_==f?(C(e,(N_<<1)+r,3),st(e,Fe,R_)):(C(e,(lt<<1)+r,3),In(e,e.De.C+1,e.Ae.C+1,l+1),st(e,e.N,e.U)),St(e),r&&pt(e);}function vt(){let e=je();return e.l=v_(e),e}var Ye=[{Ue:Lt,Re:0,Ye:0,Ee:0,Pe:0},{Ue:U_,Re:4,Ye:4,Ee:8,Pe:4},{Ue:U_,Re:4,Ye:5,Ee:16,Pe:8},{Ue:U_,Re:4,Ye:6,Ee:32,Pe:32},{Ue:Ne,Re:4,Ye:4,Ee:16,Pe:16},{Ue:Ne,Re:8,Ye:16,Ee:32,Pe:32},{Ue:Ne,Re:8,Ye:16,Ee:128,Pe:128},{Ue:Ne,Re:8,Ye:32,Ee:128,Pe:256},{Ue:Ne,Re:32,Ye:128,Ee:258,Pe:1024},{Ue:Ne,Re:32,Ye:258,Ee:258,Pe:4096}];function At(e){return 2*e-(e>4?9:0)}function l_(e,t,n){return ((t<<e.X^n)&e.V)>>>0}function u_(e,t){e.be=l_(e,e.be,e.u[t+(I-1)]);let n=e.J[t&e.F]=e.K[e.be];return e.K[e.be]=t,n}function It(e){e.K[e.O-1]=0,Ve(e.K,0,(e.O-1)*e.K.BYTES_PER_ELEMENT);}function Un(e){let t,n,r=e.h;for(t=e.O;t>0;)t--,n=e.K[t],e.K[t]=n>=r?n-r:0;for(t=r;t>0;)t--,n=e.J[t],e.J[t]=n>=r?n-r:0;}function H_(e,t,n,r){let i=e.avail_in;return i>r&&(i=r),0==i?0:(e.avail_in-=i,M(t,n,e.next_in,e.next_in_index,i),1==e.l.P?e.i=he(e.i,new p(t.buffer,t.byteOffset+n,i),i):2==e.l.P&&(e.i=W(e.i,new p(t.buffer,t.byteOffset+n,i),i)),e.next_in_index+=i,e.total_in+=i,i)}function c_(e){let t,n,r=e.h;do{if(n=e.We-e.ce-e.ae,0==n&&0==e.ae&&0==e.ce?n=r:-1==n&&n--,e.ae>=r+ye(e)&&(M(e.u,0,e.u,r,r-n),e.qe-=r,e.ae-=r,e.ue-=r,e.le>e.ae&&(e.le=e.ae),Un(e),n+=r),0==e.o.avail_in)break;if(t=H_(e.o,e.u,e.ae+e.ce,n),e.ce+=t,e.ce+e.le>=I){let t=e.ae-e.le;for(e.be=e.u[t],e.be=l_(e,e.be,e.u[t+1]);e.le&&(e.be=l_(e,e.be,e.u[t+I-1]),e.J[t&e.F]=e.K[e.be],e.K[e.be]=t,t++,e.le--,!(e.ce+e.le<I)););}}while(e.ce<ae&&0!=e.o.avail_in);if(e.m<e.We){let t,n=e.ae+e.ce;e.m<n?(t=e.We-n,t>He&&(t=He),Ve(e.u,n,t),e.m=n+t):e.m<n+He&&(t=n+He-e.m,t>e.We-e.m&&(t=e.We-e.m),Ve(e.u,e.m,t),e.m+=t);}}function kt(e,t,n=8,r=15,i=Ce,f=0){let _=1;if(!e)return  -2;if(e.msg="",-1==t&&(t=6),r<0){if(_=0,r<-15)return  -2;r=-r;}else r>15&&(_=2,r-=16);if(i<1||i>rt||8!=n||r<8||r>15||t<0||t>9||f<0||f>4||8==r&&1!=_)return  -2;8==r&&(r=9);let l=v_(e);return l?(e.l=l,l.o=e,l.Y=42,l.P=_,l.B=void 0,l.k=r,l.h=1<<l.k,l.F=l.h-1,l.G=i+7,l.O=1<<l.G,l.V=l.O-1,l.X=(l.G+I-1)/I,l.u=new p(2*l.h),l.J=new g(l.h),l.K=new g(l.O),l.m=0,l.ee=1<<i+6,l.$=new p(l.ee*ot),l.ne=4*l.ee,l.u&&l.J&&l.K&&l.$?(l.ze=l.$.subarray(l.ee),l.A=l.te+l.ee,l.R=3*(l.ee-1),l.ke=t,l.ge=f,l.Ze=n,Fn(e)):(l.Y=666,e.msg=D_(-4),P_(e),-4)):-4}function Z_(e){if(null==e)return  true;let t=e.l;return !t||t.o!=e||42!=t.Y&&57!=t.Y&&69!=t.Y&&73!=t.Y&&91!=t.Y&&103!=t.Y&&113!=t.Y&&666!=t.Y}function Hn(e){let t;return Z_(e)?-2:(e.total_in=e.total_out=0,e.msg="",e.t=2,t=e.l,t.D=0,t.re=t.te,t.P<0&&(t.P=-t.P),t.Y=2==t.P?57:42,e.i=2==t.P?W(0):he(0),t.oe=-2,Et(t),0)}function Bn(e){e.We=2*e.h,It(e),e.xe=Ye[e.ke].Ye,e.me=Ye[e.ke].Re,e.ve=Ye[e.ke].Ee,e.pe=Ye[e.ke].Pe,e.ae=0,e.ue=0,e.ce=0,e.le=0,e.se=e.he=I-1,e.we=0,e.be=0;}function Fn(e){let t=Hn(e);return 0==t&&Bn(e.l),t}function Me(e,t){T(e,t>>8),T(e,255&t);}function q(e){let t,n=e.l;gt(n),t=n.D,t>e.avail_out&&(t=e.avail_out),0!=t&&(M(e.next_out,e.next_out_index,n.$,n.re,t),e.next_out_index+=t,n.re+=t,e.total_out+=t,e.avail_out-=t,n.D-=t,0==n.D&&(n.re=n.te));}function Ie(e,t){let n=e.l;n.B&&n.B.Be&&(e.i=W(e.i,new p(n.$.buffer,n.te+t,n.D-t),n.D-t));}function Nt(e,t){let n,r=e.l;if(Z_(e)||t>5||t<0)return we(e,-2);if(!e.next_out||0!=e.avail_in&&!e.next_in||666==r.Y&&4!=t)return we(e,-2);if(0==e.avail_out)return we(e,-5);if(n=r.oe,r.oe=t,0!=r.D){if(q(e),0==e.avail_out)return r.oe=$,0}else if(0==e.avail_in&&At(t)<=At(n)&&4!=t)return we(e,-5);if(666==r.Y&&0!=e.avail_in)return we(e,-5);if(42==r.Y&&0==r.P&&(r.Y=113),42==r.Y){let t,n=8+(r.k-8<<4)<<8;if(t=r.ge>=2||r.ke<2?0:r.ke<6?1:6==r.ke?2:3,n|=t<<6,0!=r.ae&&(n|=it),n+=31-n%31,Me(r,n),0!=r.ae&&(Me(r,e.i>>16),Me(r,65535&e.i)),e.i=1,r.Y=113,q(e),0!=r.D)return r.oe=$,0}if(57==r.Y)if(e.i=W(0),T(r,31),T(r,139),T(r,8),r.B)T(r,(r.B.Fe?1:0)+(r.B.Be?2:0)+(null==r.B.Ge?0:4)+(null==r.B.Oe?0:8)+(null==r.B.Ve?0:16)),T(r,255&r.B.Xe),T(r,r.B.Xe>>>8&255),T(r,r.B.Xe>>>16&255),T(r,r.B.Xe>>>24&255),T(r,9==r.ke?2:r.ge>=2||r.ke<2?4:0),T(r,255&r.B.Je),null!=r.B.Ge&&(T(r,255&r.B.Ke),T(r,r.B.Ke>>>8&255)),r.B.Be&&(e.i=W(e.i,r.$,r.D)),r.Ce=0,r.Y=69;else if(T(r,0),T(r,0),T(r,0),T(r,0),T(r,0),T(r,9==r.ke?2:r.ge>=2||r.ke<2?4:0),T(r,at),r.Y=113,q(e),0!=r.D)return r.oe=$,0;if(69==r.Y){if(r.B&&null!=r.B.Ge){let t=r.D,n=(65535&r.B.Ke)-r.Ce;for(;r.D+n>r.ne;){let i=r.ne-r.D;if(M(r.$,r.D,r.B.Ge,r.Ce,i),r.D=r.ne,Ie(e,t),r.Ce+=i,q(e),0!=r.D)return r.oe=$,0;t=0,n-=i;}M(r.$,r.D,r.B.Ge,r.Ce,n),r.D+=n,Ie(e,t),r.Ce=0;}r.Y=73;}if(73==r.Y){if(r.B&&r.B.Oe&&r.B.Oe.length){let t,n=r.D;do{if(r.D==r.ne){if(Ie(e,n),q(e),0!=r.D)return r.oe=$,0;n=0;}t=r.B.Oe[r.Ce++],T(r,t);}while(0!=t);Ie(e,n),r.Ce=0;}r.Y=91;}if(91==r.Y){if(r.B&&r.B.Ve&&r.B.Ve.length){let t,n=r.D;do{if(r.D==r.ne){if(Ie(e,n),q(e),0!=r.D)return r.oe=$,0;n=0;}t=r.B.Ve[r.Ce++],T(r,t);}while(0!=t);Ie(e,n);}r.Y=103;}if(103==r.Y){if(r.B&&r.B.Be){if(r.D+2>r.ne&&(q(e),0!=r.D))return r.oe=$,0;T(r,255&e.i),T(r,e.i>>>8&255),e.i=W(0);}if(r.Y=113,q(e),0!=r.D)return r.oe=$,0}if(0!=e.avail_in||0!=r.ce||0!=t&&666!=r.Y){let n=0==r.ke?Lt(r,t):2==r.ge?Pn(r,t):3==r.ge?Zn(r,t):Ye[r.ke].Ue(r,t);if((2==n||3==n)&&(r.Y=666),0==n||2==n)return 0==e.avail_out&&(r.oe=$),0;if(1==n&&(1==t?Tt(r):5!=t&&(Pe(r,null,0,0),3==t&&(It(r),0==r.ce&&(r.ae=0,r.ue=0,r.le=0))),q(e),0==e.avail_out))return r.oe=$,0}return 4!=t?0:r.P<=0?1:(2==r.P?(T(r,255&e.i),T(r,e.i>>>8&255),T(r,e.i>>>16&255),T(r,e.i>>>24&255),T(r,255&e.total_in),T(r,e.total_in>>>8&255),T(r,e.total_in>>>16&255),T(r,e.total_in>>>24&255)):(Me(r,e.i>>>16&65535),Me(r,65535&e.i)),q(e),r.P>0&&(r.P=-r.P),0!=r.D?0:1)}function P_(e){if(Z_(e))return  -2;let t=e.l,n=t.Y;return t.u=Z,t.J=qe,t.K=qe,t.$=Z,t.ze=Z,t.Te=new R(0),t.ye=Z,t.Ie=qe,t.N.length=0,t.U.length=0,t.$e.length=0,t.B=void 0,t.te=0,t.re=0,t.A=0,113==n?-3:0}function Rt(e,t){let n,r,i=e.pe,f=e.ae,_=e.he,l=e.ve,o=e.ae>ye(e)?e.ae-ye(e):0,u=e.J,a=e.F,c=e.u,s=e.ce,h=ee<s?ee:s,d=c[f],w=c[f+1],b=c[f+_-1],k=c[f+_];_>=e.me&&(i>>=2),l>s&&(l=s);do{if(n=t,c[n+_]!=k||c[n+_-1]!=b||c[n]!=d||c[n+1]!=w)continue;let i=2;for(;i<h&&c[f+i]==c[n+i];)i++;if(r=i,r>_){if(e.qe=t,_=r,r>=l)break;b=c[f+_-1],k=c[f+_];}}while((t=u[t&a])>o&&0!=--i);return _<=s?_:s}function zt(e,t){wt(e,e.u,e.ae-e.ue,t,e.ue),e.ue=e.ae,q(e.o);}function j(e,t){return zt(e,t?1:0),0==e.o.avail_out?t?2:0:null}var Dt=65535;function ke(e,t){return e<t?e:t}function Lt(e,t){let n,r,i,f=ke(e.ne-5,e.h),_=0,l=e.o.avail_in;do{if(n=Dt,i=e.T+42>>3,e.o.avail_out<i||(i=e.o.avail_out-i,r=e.ae-e.ue,n>r+e.o.avail_in&&(n=r+e.o.avail_in),n>i&&(n=i),n<f&&(0==n&&4!=t||0==t||n!=r+e.o.avail_in)))break;_=4==t&&n==r+e.o.avail_in?1:0,Pe(e,null,0,_),e.$[e.D-4]=n,e.$[e.D-3]=n>>8,e.$[e.D-2]=~n,e.$[e.D-1]=~n>>8,q(e.o),r&&(r>n&&(r=n),M(e.o.next_out,e.o.next_out_index,e.u,e.ue,r),e.o.next_out_index+=r,e.o.avail_out-=r,e.o.total_out+=r,e.ue+=r,n-=r),n&&(H_(e.o,e.o.next_out,e.o.next_out_index,n),e.o.next_out_index+=n,e.o.avail_out-=n,e.o.total_out+=n);}while(0==_);if(l-=e.o.avail_in,l){if(l>=e.h){e._e=2;let t=e.o.next_in_index-e.h;M(e.u,0,e.o.next_in,t,e.h),e.ae=e.h,e.le=e.ae;}else e.We-e.ae<=l&&(e.ae-=e.h,M(e.u,0,e.u,e.h,e.ae),e._e<2&&e._e++,e.le>e.ae&&(e.le=e.ae)),M(e.u,e.ae,e.o.next_in,e.o.next_in_index-l,l),e.ae+=l,e.le+=ke(l,e.h-e.le);e.ue=e.ae;}return e.m<e.ae&&(e.m=e.ae),_?(e.Me=8,3):0!=t&&4!=t&&0==e.o.avail_in&&e.ae==e.ue?1:(i=e.We-e.ae,e.o.avail_in>i&&e.ue>=e.h&&(e.ue-=e.h,e.ae-=e.h,M(e.u,0,e.u,e.h,e.ae),e._e<2&&e._e++,i+=e.h,e.le>e.ae&&(e.le=e.ae)),i>e.o.avail_in&&(i=e.o.avail_in),i&&(H_(e.o,e.u,e.ae,i),e.ae+=i,e.le+=ke(i,e.h-e.le)),e.m<e.ae&&(e.m=e.ae),i=e.T+42>>3,i=ke(e.ne-i,Dt),f=ke(i,e.h),r=e.ae-e.ue,(r>=f||(r||4==t)&&0!=t&&0==e.o.avail_in&&r<=i)&&(n=ke(r,i),_=4==t&&0==e.o.avail_in&&n==r?1:0,Pe(e,e.u,n,_,e.ue),e.ue+=n,q(e.o)),_&&(e.Me=8),_?2:0)}function U_(e,t){let n,r=false;for(;;){if(e.ce<ae){if(c_(e),e.ce<ae&&0==t)return 0;if(0==e.ce)break}if(n=0,e.ce>=I&&(n=u_(e,e.ae)),0!=n&&e.ae-n<=ye(e)&&(e.se=Rt(e,n)),e.se>=I)if(e.ae,e.qe,e.se,r=e_(e,e.ae-e.qe,e.se-I),e.ce-=e.se,e.se<=e.xe&&e.ce>=I){e.se--;do{e.ae++,n=u_(e,e.ae);}while(0!=--e.se);e.ae++;}else e.ae+=e.se,e.se=0,e.be=e.u[e.ae],e.be=l_(e,e.be,e.u[e.ae+1]);else r=De(e,e.u[e.ae]),e.ce--,e.ae++;if(r){let t=j(e,false);if(null!=t)return t}}if(e.le=e.ae<I-1?e.ae:I-1,4==t){let t=j(e,true);return null!=t?t:3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}function Ne(e,t){let n,r=false;for(;;){if(e.ce<ae){if(c_(e),e.ce<ae&&0==t)return 0;if(0==e.ce)break}if(n=0,e.ce>=I&&(n=u_(e,e.ae)),e.he=e.se,e.de=e.qe,e.se=I-1,0!=n&&e.he<e.xe&&e.ae-n<=ye(e)&&(e.se=Rt(e,n),e.se<=5&&(1==e.ge||e.se==I&&e.ae-e.qe>nt)&&(e.se=I-1)),e.he>=I&&e.se<=e.he){let t=e.ae+e.ce-I;e.ae,e.de,e.he,r=e_(e,e.ae-1-e.de,e.he-I),e.ce-=e.he-1,e.he-=2;do{++e.ae<=t&&(n=u_(e,e.ae));}while(0!=--e.he);if(e.we=0,e.se=I-1,e.ae++,r){let t=j(e,false);if(null!=t)return t}}else if(e.we){if(r=De(e,e.u[e.ae-1]),r&&zt(e,0),e.ae++,e.ce--,0==e.o.avail_out)return 0}else e.we=1,e.ae++,e.ce--;}if(e.we&&(r=De(e,e.u[e.ae-1]),e.we=0),e.le=e.ae<I-1?e.ae:I-1,4==t){let t=j(e,true);return null!=t?t:3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}function Zn(e,t){let n,r,i,f;for(;;){if(e.ce<=ee){if(c_(e),e.ce<=ee&&0==t)return 0;if(0==e.ce)break}if(e.se=0,e.ce>=I&&e.ae>0&&(i=e.ae-1,r=e.u[i],r==++i&&r==++i&&r==++i)){f=e.ae+ee;do{}while(r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&i<f);e.se=ee-(f-i),e.se>e.ce&&(e.se=e.ce);}if(e.se>=I?(e.ae,e.ae,e.se,n=e_(e,1,e.se-I),e.ce-=e.se,e.ae+=e.se,e.se=0):(n=De(e,e.u[e.ae]),e.ce--,e.ae++),n){let t=j(e,false);if(null!=t)return t}}if(e.le=0,4==t){let t=j(e,true);return null!=t?t:3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}function Pn(e,t){let n=false;for(;;){if(0==e.ce&&(c_(e),0==e.ce)){if(0==t)return 0;break}if(e.se=0,n=De(e,e.u[e.ae]),e.ce--,e.ae++,n){let t=j(e,false);if(null!=t)return t}}if(e.le=0,4==t){let t=j(e,true);return null!=t?t:3}if(e.H){let t=j(e,false);if(null!=t)return t}return 1}var ue=852,d_=592,m_=594,Ot=Ee.map(e=>e+1),Ct=ge.subarray(0,-1).map(e=>e+3),Mn=[16,1,73,1,200,1],Yn=[144,1,72,1,78,1],Ut=Se.map(qt),Ht=Se.map(Vt);Ut.push(64,2),Ht.push(142,2);var Bt=de.slice(0,-2).map(qt),Ft=de.slice(0,-2).map(Vt);Bt.push(...Mn),Ft.push(...Yn);var Zt=new g([...Ct,258,0,0]),Pt=new g([...Ct,3,0,0]),Mt=te(Bt),Yt=te(Ft),Xt=new g([...Ot,0,0]),Wt=new g([...Ot,32769,49153]),Gt=te(Ut),Kt=te(Ht);function qt(e,t){return t%2?e:e+16}function Vt(e,t){return t%2?e:e+128}function Jt(e,t){let n,r=e.l,i=e.next_in_index,f=e.next_out_index,_=e.next_in,l=e.next_out,o=r.u,u=r.p>>>0,a=r.T>>>0,c=r.et,s=r.tt,h=(1<<r.nt)-1,d=(1<<r.rt)-1,w=r.h>>>0,b=r.m>>>0,k=r.v>>>0,g=r.it,m=f-(t-e.avail_out),v=f+(e.avail_out-257),p=i+(e.avail_in-5),x=0,T=0,y=0,I=0;e:do{for(;a<15;){if(!(i<_.length))break e;u+=_[i++]<<a,a+=8;}n=c[u&h];t:for(;;){if(y=n>>>16&255,u>>>=y,a-=y,y=n>>>24,0==y){l[f++]=65535&n;break}if(16&y){if(x=65535&n,y&=15,y){for(;a<y;){if(!(i<_.length)){r.ft=16200;break e}u+=_[i++]<<a,a+=8;}x+=u&(1<<y)-1,u>>>=y,a-=y;}for(;a<15;){if(!(i<_.length)){r.ft=16200;break e}u+=_[i++]<<a,a+=8;}n=s[u&d];n:for(;;){if(y=n>>>16&255,u>>>=y,a-=y,y=n>>>24,16&y){if(T=65535&n,y&=15,y){for(;a<y;){if(!(i<_.length)){r.ft=16200;break e}u+=_[i++]<<a,a+=8;}T+=u&(1<<y)-1,u>>>=y,a-=y;}let t=x,c=f-m;if(T>c){let n=T-c;if(n>b&&g){e.msg="invalid distance too far back",r.ft=16209;break e}if(0==k){if(I=w-n,!(n<t)){for(let e=0;e<t;++e)l[f++]=o[I++];continue e}for(let e=0;e<n;++e)l[f++]=o[I++];t-=n,I=f-T;}else if(k<n){I=w+k-n;let e=n-k;if(!(e<t)){for(let e=0;e<t;++e)l[f++]=o[I++];continue e}for(let t=0;t<e;++t)l[f++]=o[I++];if(t-=e,I=0,!(k<t)){for(let e=0;e<t;++e)l[f++]=o[I++];continue e}for(let e=0;e<k;++e)l[f++]=o[I++];t-=k,I=f-T;}else {if(I=k-n,!(n<t)){for(let e=0;e<t;++e)l[f++]=o[I++];continue e}for(let e=0;e<n;++e)l[f++]=o[I++];t-=n,I=f-T;}for(;t>2;)l[f++]=l[I++],l[f++]=l[I++],l[f++]=l[I++],t-=3;t&&(l[f++]=l[I++],t>1&&(l[f++]=l[I++]));}else {for(I=f-T;t>2;)l[f++]=l[I++],l[f++]=l[I++],l[f++]=l[I++],t-=3;t&&(l[f++]=l[I++],t>1&&(l[f++]=l[I++]));}break}if(64&y){e.msg="invalid distance code",r.ft=16209;break e}n=s[(65535&n)+(u&(1<<y)-1)];continue n}break}if(64&y){if(32&y){r.ft=16191;break e}e.msg="invalid literal/length code",r.ft=16209;break e}n=c[(65535&n)+(u&(1<<y)-1)];continue t}}while(i<p&&f<v);let z=a>>3;i-=z,a-=z<<3,u&=(1<<a)-1,e.next_in_index=i,e.next_out_index=f,e.avail_in=i<p?p-i+5:5-(i-p),e.avail_out=f<v?v-f+257:257-(f-v),r.p=u>>>0,r.T=a>>>0;}var Xn=new R(0);function M_(e,t){let n=Xn,r=t?ue+m_:ue+d_;return {...Je(e,0),o:e,ft:16180,_t:false,P:0,lt:false,ot:0,ut:0,ct:0,st:0,u:Z,ht:0,dt:0,Ge:0,et:n,tt:n,nt:0,rt:0,wt:0,bt:0,kt:0,gt:0,vt:n,xt:new g(320),Tt:new g(288),yt:new R(r),It:0,it:true,zt:0,Mt:0,Ct:t}}function We(e,t,n){return e<<24|t<<16|n}function b_(e=0,t=0,n=0){return We(e,t,n)}function h_(e=1){return We(64,e,0)}function Qt(e=0){return We(96,e,0)}function Y_(e){return ((255&e)<<24|(e>>8&255)<<16|(e>>16&255)<<8|e>>24&255)>>>0}var Le=15,Gn={Ct:false,Zt:Zt,Wt:Mt,qt:Xt,St:Gt,Lt:20,$t:257,Dt:0,At:d_,Ht:false,Qt:true},Kn={Ct:true,Zt:Pt,Wt:Yt,qt:Wt,St:Kt,Lt:19,$t:256,Dt:-1,At:m_,Ht:true,Qt:false};function Oe(e,t,n,r,i,f,_,l){let o,u,a,c,s,h,d,w,b,k,m,v,p,x,T,y,I,z,M,C=new g(Le+1),Z=new g(Le+1),W=l?Kn:Gn;for(o=0;o<=Le;o++)C[o]=0;for(u=0;u<n;u++)C[t[u]]++;for(s=i.jt,c=Le;c>=1&&0==C[c];c--);if(s>c&&(s=c),0==c)return W.Qt?(T=h_(1),r.jt[0]=T,r.jt[1]=T,i.jt=1,0):-1;for(a=1;a<c&&0==C[a];a++);for(s<a&&(s=a),w=1,o=1;o<=Le;o++)if(w<<=1,w-=C[o],w<0)return  -1;if(w>0&&(0==e||1!=c))return  -1;for(Z[1]=0,o=1;o<Le;o++)Z[o+1]=Z[o]+C[o];for(u=0;u<n;u++)0!=t[u]&&(f[Z[t[u]]++]=u);switch(e){case 0:I=z=f,M=W.Lt;break;case 1:I=W.Zt,z=W.Wt,M=W.$t;break;default:I=W.qt,z=W.St,M=W.Dt;}if(k=0,u=0,o=a,y=_.jt,h=s,d=0,p=-1,b=1<<s,x=b-1,1==e&&(W.Ht?b>=ue:b>ue)||2==e&&(W.Ht?b>=W.At:b>W.At))return 1;for(;;){T=qn(f,u,o,d,e,I,z,M,W.Ct),m=1<<o-d,v=1<<h,a=v;do{v-=m;let e=(k>>d)+v;r.jt[y+e]=T;}while(0!=v);for(m=1<<o-1;k&m;)m>>=1;if(0!=m?(k&=m-1,k+=m):k=0,u++,0==--C[o]){if(o==c)break;o=t[f[u]];}if(o>s&&(k&x)!=p){for(0==d&&(d=s),y+=1<<h,h=o-d,w=1<<h;h+d<c&&(w-=C[h+d],!(w<=0));)h++,w<<=1;if(b+=1<<h,1==e&&(W.Ht?b>=ue:b>ue)||2==e&&(W.Ht?b>=W.At:b>W.At))return 1;p=k&x,r.jt[_.jt+p]=We(h,s,y-_.jt);}}if(0!=k)for(T=h_(o-d);0!=k;){for(0!=d&&(k&x)!=p&&(d=0,o=s,y=_.jt,h=s,T=h_(o)),r.jt[y+(k>>d)]=T,m=1<<o-1;k&m;)m>>=1;0!=m?(k&=m-1,k+=m):k=0;}return _.jt+=b,i.jt=s,0}function qn(e,t,n,r,i,f,_,l,o){let u;if(o?e[t]<l:e[t]+1<l)u=b_(0,n-r,e[t]);else if(o?e[t]>l:e[t]>=l)if(o&&1==i){let i=e[t]-257;u=b_(_[i],n-r,f[i]);}else {let i=o?e[t]:e[t]-l;u=b_(_[i],n-r,f[i]);}else u=Qt(n-r);return u}var p_=new R(0),Qn={Nt:true,Ut:new R(544),Rt:p_,Yt:p_},$n={Nt:true,Ut:new R(544),Rt:p_,Yt:p_};function $t(){let e=je();return e.l=M_(e,false),e}function Ge(e){let t;return !(e&&(t=e.l,!(!t||t.o!=e||t.Ct&&(t.ft<16191||t.ft>16209)||!t.Ct&&(t.ft<16180||t.ft>16211))))}function er(e){let t;return Ge(e)?-2:(t=e.l,e.total_in=e.total_out=t.st=0,e.msg="",t.P&&(e.i=1&t.P),t.ft=t.Ct?16191:16180,t._t=false,t.lt=false,t.ot=-1,t.ut=t.Ct?65536:32768,delete t.B,t.p=0,t.T=0,t.et=t.yt,t.tt=t.yt,t.vt=t.yt,t.it=true,t.zt=-1,0)}function _r(e){let t;return Ge(e)?-2:(t=e.l,t.h=0,t.m=0,t.v=0,er(e))}function tr(e,t){let n,r;if(Ge(e))return  -2;if(r=e.l,t<0){if(t<-16)return  -2;n=0,r.Ct=-16==t,t=-t;}else n=5+(t>>4),r.Ct=false,t<48&&(t&=15);let i=r.Ct?16:15;return t&&(t<8||t>i)?-2:(r.u.length>0&&r.k!=t&&(r.u=Z),r.P=n,r.k=t,_r(e))}function en(e,t){let n,r;if(!e)return  -2;e.msg="";let i=-16==t;return r=M_(e,i),e.l=r,r.o=e,r.ft=i?16191:16180,n=tr(e,t),n}function nr(e){let t=e.Ct?$n:Qn,n={jt:0};if(t.Nt){let r,i,f;for(r=0;r<144;)e.xt[r++]=8;for(;r<256;)e.xt[r++]=9;for(;r<280;)e.xt[r++]=7;for(;r<288;)e.xt[r++]=8;t.Ut.fill(0),f=t.Ut,t.Rt=f,i=9;let _={jt:f},l={jt:i},o={jt:0};for(Oe(1,e.xt,288,_,l,e.Tt,o,e.Ct),f=_.jt,i=l.jt,e.It=o.jt,r=0;r<32;)e.xt[r++]=5;i=5;let u=o.jt,a={jt:f},c={jt:i};n.jt=u,Oe(2,e.xt,32,a,c,e.Tt,n,e.Ct),t.Yt=f.slice(u),t.Nt=false;}e.et=t.Rt,e.nt=9,e.tt=t.Yt,e.rt=5,e.It=n.jt;}function rr(e,t,n){let r=e.l;if(!(r.u&&0!=r.u.length||(r.u=new p(1<<r.k),r.u)))return 1;if(0==r.h&&(r.h=1<<r.k,r.v=0,r.m=0),n>=r.h)M(r.u,0,t,t.length-r.h,r.h),r.v=0,r.m=r.h;else {let e=r.h-r.v;e>n&&(e=n),M(r.u,r.v,t,t.length-n,e),(n-=e)?(M(r.u,0,t,t.length-n,n),r.v=n,r.m=r.h):(r.v+=e,r.v==r.h&&(r.v=0),r.m<r.h&&(r.m+=e));}return 0}var S_=class extends L{constructor(){super("Need more input");}};function _n(e,t){let n,r,i,f,_,l,o,u,a,c,s,h,d,w,b,k,g,m=new p(4);if(Ge(e)||!e.next_out||!e.next_in&&0!=e.avail_in)return  -2;l=0,u=0,o=0,a=0,r=Z,i=0,f=Z,_=0,n=e.l,16191==n.ft&&(n.ft=16192),I(),c=l,s=o,g=0;try{for(;;)switch(n.ft){case 16180:if(0==n.P){n.ft=16192;break}if(S(16),2&n.P&&35615==u){0==n.k&&(n.k=15),n.ct=W(0),n.ct=T(n.ct,u),C(),n.ft=16181;break}if(n.B&&(n.B.Et=-1),!(1&n.P)||((L(8)<<8)+(u>>8))%31){e.msg="incorrect header check",n.ft=16209;break}if(8!=L(4)){e.msg="unknown compression method",n.ft=16209;break}if($(4),k=L(4)+8,0==n.k&&(n.k=k),k>15||k>n.k){e.msg="invalid window size",n.ft=16209;break}n.ut=1<<k,n.ot=0,e.i=n.ct=he(0),n.ft=512&u?16189:16191,C();break;case 16181:if(S(16),n.ot=u,8!=(255&n.ot)){e.msg="unknown compression method",n.ft=16209;break}if(57344&n.ot){e.msg="unknown header flags set",n.ft=16209;break}n.B&&(n.B.Fe=u>>8&1),512&n.ot&&4&n.P&&(n.ct=T(n.ct,u)),C(),n.ft=16182;case 16182:S(32),n.B&&(n.B.Xe=u),512&n.ot&&4&n.P&&(n.ct=y(n.ct,u)),C(),n.ft=16183;case 16183:S(16),n.B&&(n.B.Pt=255&u,n.B.Je=u>>8),512&n.ot&&4&n.P&&(n.ct=T(n.ct,u)),C(),n.ft=16184;case 16184:1024&n.ot?(S(16),n.ht=u,n.B&&(n.B.Ke=u),512&n.ot&&4&n.P&&(n.ct=T(n.ct,u)),C()):n.B&&(n.B.Ge=Z),n.ft=16185;case 16185:if(1024&n.ot&&(h=n.ht,h>l&&(h=l),h&&(n.B&&n.B.Ge&&n.B.Bt&&(k=n.B.Ke-n.ht)<n.B.Bt&&M(n.B.Ge,k,r,i,h),512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),l-=h,i+=h,n.ht-=h),n.ht))return v();n.ht=0,n.ft=16186;case 16186:if(2048&n.ot){if(0==l)return v();h=0;do{k=r[i+h++],n.B&&n.B.Ft&&n.ht<n.B.Ft&&(n.B.Oe[n.ht++]=k);}while(k&&h<l);if(512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),l-=h,i+=h,k)return v()}else n.B&&(n.B.Oe=Z);n.ht=0,n.ft=16187;case 16187:if(4096&n.ot){if(0==l)return v();h=0;do{k=r[i+h++],n.B&&n.B.Gt&&n.ht<n.B.Gt&&(n.B.Ve[n.ht++]=k);}while(k&&h<l);if(512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),l-=h,i+=h,k)return v()}else n.B&&(n.B.Ve=Z);n.ft=16188;case 16188:if(512&n.ot){if(S(16),4&n.P&&u!=(65535&n.ct)){e.msg="header crc mismatch",n.ft=16209;break}C();}n.B&&(n.B.Be=n.ot>>9&1,n.B.Et=1),e.i=n.ct=W(0),n.ft=16191;break;case 16189:S(32),e.i=n.ct=Y_(u),C(),n.ft=16190;case 16190:if(!n.lt)return z(),2;e.i=n.ct=he(0),n.ft=16191;case 16191:if(5==t||6==t)return v();case 16192:if(n._t){D(),n.ft=16206;break}switch(S(3),n._t=!!L(1),$(1),L(2)){case 0:n.ft=16193;break;case 1:if(nr(n),n.ft=16199,6==t)return $(2),v();break;case 2:n.ft=16196;break;case 3:e.msg="invalid block type",n.ft=16209;}$(2);break;case 16193:if(D(),S(32),(65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",n.ft=16209;break}if(n.ht=65535&u,C(),n.ft=16194,6==t)return v();case 16194:n.ft=16195;case 16195:if(h=n.ht,h){if(h>l&&(h=l),h>o&&(h=o),0==h)return v();M(f,_,r,i,h),l-=h,i+=h,o-=h,_+=h,n.ht-=h;break}n.ft=16191;break;case 16196:if(S(14),n.bt=L(5)+257,$(5),n.kt=L(5)+1,$(5),n.wt=L(4)+4,$(4),n.bt>286||!n.Ct&&n.kt>30){e.msg=n.Ct?"too many length":"too many length or distance symbols",n.ft=16209;break}n.gt=0,n.ft=16197;case 16197:for(;n.gt<n.wt;)S(3),n.xt[pe[n.gt++]]=L(3),$(3);for(;n.gt<19;)n.xt[pe[n.gt++]]=0;n.vt=n.yt,n.et=n.tt=n.vt,n.nt=7;let c={jt:n.vt},m={jt:n.nt},p={jt:0};if(g=Oe(0,n.xt,19,c,m,n.Tt,p,n.Ct),n.vt=c.jt,n.nt=m.jt,g){e.msg="invalid code lengths set",n.ft=16209;break}n.gt=0,n.ft=16198;case 16198:for(;n.gt<n.bt+n.kt;){for(;w=n.et[L(n.nt)],!((w>>>16&255)<=a);)q();if((65535&w)<16)$(w>>>16&255),n.xt[n.gt++]=65535&w;else {if(16==(65535&w)){if(S(2+(w>>>16&255)),$(w>>>16&255),0==n.gt){e.msg="invalid bit length repeat",n.ft=16209;break}k=n.xt[n.gt-1],h=3+L(2),$(2);}else 17==(65535&w)?(S(3+(w>>>16&255)),$(w>>>16&255),k=0,h=3+L(3),$(3)):(S(7+(w>>>16&255)),$(w>>>16&255),k=0,h=11+L(7),$(7));if(n.gt+h>n.bt+n.kt){e.msg="invalid bit length repeat",n.ft=16209;break}for(;h--;)n.xt[n.gt++]=k;}}if(16209==n.ft)break;if(0==n.xt[256]){e.msg="invalid code -- missing end-of-block",n.ft=16209;break}n.vt=n.yt,n.nt=9;let A={jt:n.vt},H={jt:n.nt},Q={jt:0};g=Oe(1,n.xt,n.bt,A,H,n.Tt,Q,n.Ct),n.vt=A.jt,n.nt=H.jt;let j=Q.jt;if(n.et=n.vt.slice(0,j),g){e.msg="invalid literal/lengths set",n.ft=16209;break}n.rt=6;let N=n.xt.subarray(n.bt,n.bt+n.kt),U={jt:n.vt},R={jt:n.rt},Y={jt:j};if(g=Oe(2,N,n.kt,U,R,n.Tt,Y,n.Ct),n.vt=U.jt,n.rt=R.jt,n.tt=n.vt.slice(j),g){e.msg="invalid distances set",n.ft=16209;break}if(n.ft=16199,6==t)return v();case 16199:n.ft=16200;case 16200:if(!n.Ct&&l>=6&&o>=258){z(),Jt(e,s),I(),16191==n.ft&&(n.zt=-1);break}for(n.zt=0;w=n.et[L(n.nt)],!((w>>>16&255)<=a);)q();if(w>>>24&&!(w>>>24&240)){for(b=w;w=n.et[(65535&b)+(L((b>>>16&255)+(b>>>24))>>(b>>>16&255))],!((b>>>16&255)+(w>>>16&255)<=a);)q();$(b>>>16&255),n.zt+=b>>>16&255;}if($(w>>>16&255),n.zt+=w>>>16&255,n.ht=65535&w,!(w>>>24)){n.ft=16205;break}if(w>>>24&32){n.zt=-1,n.ft=16191;break}if(w>>>24&64){e.msg="invalid literal/length code",n.ft=16209;break}n.Ge=w>>>24&(n.Ct?31:15),n.ft=16201;case 16201:n.Ge&&(S(n.Ge),n.ht+=L(n.Ge),$(n.Ge),n.zt+=n.Ge),n.Mt=n.ht,n.ft=16202;case 16202:for(;w=n.tt[L(n.rt)],!((w>>>16&255)<=a);)q();if(!(w>>>24&240)){for(b=w;w=n.tt[(65535&b)+(L((b>>>16&255)+(b>>>24))>>(b>>>16&255))],!((b>>>16&255)+(w>>>16&255)<=a);)q();$(b>>>16&255),n.zt+=b>>>16&255;}if($(w>>>16&255),n.zt+=w>>>16&255,w>>>24&64){e.msg="invalid distance code",n.ft=16209;break}n.dt=65535&w,n.Ge=w>>>24&15,n.ft=16203;case 16203:n.Ge&&(S(n.Ge),n.dt+=L(n.Ge),$(n.Ge),n.zt+=n.Ge),n.ft=16204;case 16204:if(0==o)return v();if(h=s-o,n.dt>h){if(h=n.dt-h,h>n.m&&n.it){e.msg="invalid distance too far back",n.ft=16209;break}h>n.v?(h-=n.v,d=n.h-h):d=n.v-h,h>n.ht&&(h=n.ht),h>o&&(h=o);for(let e=0;e<h;++e)f[_]=255&n.u[d],++_,++d;}else {d=_-n.dt,h=n.ht,h>o&&(h=o);for(let e=0;e<h;++e)f[_]=f[d],++_,++d;}h>o&&(h=o),o-=h,n.ht-=h,0==n.ht&&(n.ft=16200);break;case 16205:if(0==o)return v();f[_++]=n.ht,o--,n.ft=16200;break;case 16206:if(n.P){if(S(32),s-=o,e.total_out+=s,n.st+=s,4&n.P&&s){let t=f.subarray(_-s,_);e.i=n.ct=x(n.ct,t,s);}if(s=o,4&n.P&&(n.ot?u:Y_(u)>>>0)!=n.ct){e.msg="incorrect data check",n.ft=16209;break}C();}n.ft=16207;case 16207:if(n.P&&n.ot){if(S(32),4&n.P&&u!=(4294967295&n.st)){e.msg="incorrect length check",n.ft=16209;break}C();}n.ft=16208;case 16208:return g=1,v();case 16209:return g=-3,v();case 16210:return -4;default:return -2}}catch(e){if(e instanceof S_)return v();throw e}function v(){if(z(),n.h||s!=e.avail_out&&n.ft<16209&&((n.Ct?n.ft<16208:n.ft<16206)||4!=t)){let t=s-e.avail_out;if(rr(e,e.next_out.subarray(e.next_out_index-t,e.next_out_index),t))return n.ft=16210,-4}return c-=e.avail_in,s-=e.avail_out,e.total_in+=c,e.total_out+=s,n.st+=s,4&n.P&&s&&(e.i=n.ct=x(n.ct,e.next_out.subarray(e.next_out_index-s,e.next_out_index),s)),e.t=n.T+(n._t?64:0)+(16191==n.ft?128:0)+(16199==n.ft||16194==n.ft?256:0),(0==c&&0==s&&0==g||4==t&&0==g)&&(g=-5),g}function x(e,t,r){return n.ot?W(e,t,r):he(e,t,r)}function T(e,t){return m[0]=255&t,m[1]=t>>>8&255,W(e,m,2)>>>0}function y(e,t){return m[0]=255&t,m[1]=t>>>8&255,m[2]=t>>>16&255,m[3]=t>>>24&255,W(e,m,4)>>>0}function I(){f=e.next_out,_=e.next_out_index,o=e.avail_out,r=e.next_in,i=e.next_in_index,l=e.avail_in,u=n.p,a=n.T;}function z(){e.next_out=f,e.next_out_index=_,e.avail_out=o,e.next_in=r,e.next_in_index=i,e.avail_in=l,n.p=u,n.T=a;}function C(){u=0,a=0;}function q(){if(0==l)throw new S_;l--,u+=(255&r[i])<<a,i++,u>>>=0,a+=8;}function S(e){for(;a<e;)q();}function L(e){return u&(1<<e)-1}function $(e){u>>>=e,a-=e;}function D(){u>>>=7&a,a-=7&a;}}function tn(e){return Ge(e)?-2:0}var X_=65536,ar=32768,W_=class{constructor(e=16,t=X_){this.Ot=[],this.Vt=e;for(let n=0;n<z.min(e,4);n++)this.Ot.push(new p(t));}acquire(e=X_){for(let t=this.Ot.length-1;t>=0;t--){let n=this.Ot[t];if(n.length>=e)return this.Ot.splice(t,1),n}return new p(e)}release(e){this.Ot.length<this.Vt&&this.Ot.push(e);}};function nn(e){let t=new W_(32,X_),n=null;function r(){let t=e.Xt(),n=e.Jt(t);if(0!=n&&0!=n)throw new L("init failed: "+n);return {o:t}}function i(e){try{t.release(e);}catch{}}return new H({start(){},transform(f,_){n||(n=r());let l=n.o;if(n.Kt)return;let o=0;for(;o<f.length;){let r=z.min(f.length-o,ar),u=f.subarray(o,o+r);for(l.next_in=u,l.next_in_index=0,l.avail_in=u.length;l.avail_in>0;){let r=t.acquire(),f=false;try{l.next_out=r,l.next_out_index=0,l.avail_out=r.length;let i=e.en(l,0),o=r.length-l.avail_out;if(o>0){let e=!1,n={tn:r.subarray(0,o),release:()=>{e||(e=!0,t.release(r));}};f=!0,_.enqueue(n);}if(1==i){n.Kt=!0;break}if(0!=i)throw new L("process error: "+i)}finally{f||i(r);}}if(n.Kt)break;o+=r;}},flush(f){if(n&&n.Kt)return;n||(n=r());let _=n.o;for(;;){let n=t.acquire(),r=false;try{_.next_out=n,_.next_out_index=0,_.avail_out=n.length;let i=e.en(_,4),l=n.length-_.avail_out;if(l>0){let e=!1,i={tn:n.subarray(0,l),release:()=>{e||(e=!0,t.release(n));}};r=!0,f.enqueue(i);}if(1==i)break;if(0!=i)throw new L("finalization error: "+i)}finally{r||i(n);}}let l=e.nn(_);if(0!=l&&0!=l)throw new L("end failed: "+l)}})}function rn(){return new H({start(){},transform(e,t){try{t.enqueue(e.tn.slice(0));}finally{e.release();}},flush(){}})}function ir(e="deflate",t){let n="gzip"==e?31:"deflate-raw"==e?-15:15,r=t&&"number"==typeof t.level?t.level:-1;return nn({Xt:()=>vt(),Jt:e=>kt(e,r,8,n,8,0),en:Nt,nn:P_})}function or(e="deflate"){let t="gzip"==e?31:"deflate-raw"==e?-15:"deflate64-raw"==e?-16:15;return nn({Xt:()=>$t(),Jt:e=>en(e,t),en:_n,nn:tn})}var E_=class{constructor(e="deflate",t){let n=ir(e,t);this.writable=n.writable,this.readable=n.readable.pipeThrough(rn());}},g_=class{constructor(e="deflate"){let t=or(e);this.writable=t.writable,this.readable=t.readable.pipeThrough(rn());}};

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


	o(setDefaultConfiguration);

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
