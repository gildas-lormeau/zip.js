'use strict';

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
const ABORT_ERROR_NAME$1 = "AbortError";

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
		throw signal.reason === UNDEFINED_VALUE ? new DOMException(ERR_ABORTED, ABORT_ERROR_NAME$1) : signal.reason;
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

const n=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],r=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],l=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],e=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],o=new Uint8Array(288);o.fill(8,0,144),o.fill(9,144,256),o.fill(7,256,280),o.fill(8,280,288);const u=new Uint8Array(30).fill(5);function w(n){const t=new Uint16Array(16);for(const r of n)t[r]++;t[0]=0;const r=new Uint16Array(17);for(let n=1;n<=15;n++)r[n+1]=r[n]+t[n];const l=new Uint16Array(n.length);for(let t=0;t<n.length;t++)n[t]&&(l[r[n[t]]++]=t);return {lengthCounts:t,symbols:l}}const s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",F=(O$1=()=>function(s){let F=0,O=0,a=0,Q=new Uint8Array(1024),c=0,W=0;for(;!W;){W=U(1);const n=U(2);if(0==n)f();else if(1==n)h(w(o),w(u));else {if(2!=n)throw new Error("invalid deflate block type");h(...v());}}return Q.subarray(0,c);function g(){if(F>=s.length)throw new Error("unexpected end of deflate data");return s[F++]}function U(n){for(;a<n;)O|=g()<<a,a+=8;const t=O&(1<<n)-1;return O>>>=n,a-=n,t}function f(){O=0,a=0;const n=g()|g()<<8;F+=2,p(c+n);for(let t=0;t<n;t++)Q[c++]=g();}function h(e,o){let u=L(e);for(;256!=u;){if(u<256)p(c+1),Q[c++]=u;else {const e=u-257,w=n[e]+U(t[e]),s=L(o),F=r[s]+U(l[s]);p(c+w);const O=c-F;for(let n=0;n<w;n++)Q[c++]=Q[O+n];}u=L(e);}}function v(){const n=U(5)+257,t=U(5)+1,r=U(4)+4,l=new Uint8Array(19);for(let n=0;n<r;n++)l[e[n]]=U(3);const o=w(l),u=new Uint8Array(n+t);let s=0;for(;s<u.length;){const n=L(o);if(n<16)u[s++]=n;else if(16==n){const n=u[s-1];let t=U(2)+3;for(;t--;)u[s++]=n;}else s+=17==n?U(3)+3:U(7)+11;}return [w(u.subarray(0,n)),w(u.subarray(n))]}function L(n){const{lengthCounts:t,symbols:r}=n;let l=0,e=0,o=0;for(let n=1;n<=15;n++){l|=U(1);const u=t[n];if(l-e<u)return r[o+(l-e)];o+=u,e=e+u<<1,l<<=1;}throw new Error("invalid huffman code")}function p(n){if(Q.length<n){let t=2*Q.length;for(;t<n;)t*=2;const r=new Uint8Array(t);r.set(Q.subarray(0,c)),Q=r;}}}(function(n){const t=(n=String(n).replace(/[^A-Za-z0-9+/=]/g,"")).length,r=[];for(let l=0;l<t;l+=4){const t=s.indexOf(n[l])<<18|s.indexOf(n[l+1])<<12|(63&s.indexOf(n[l+2]))<<6|63&s.indexOf(n[l+3]);r.push(t>>16&255),"="!==n[l+2]&&r.push(t>>8&255),"="!==n[l+3]&&r.push(255&t);}return new Uint8Array(r)}("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")),n=>n({workerURI:n=>{const t="text/javascript";let r=O$1();if("string"==typeof r&&(r=(new TextEncoder).encode(r)),n){const n=new Blob([r],{type:t});return URL.createObjectURL(n)}return "data:"+t+";base64,"+function(n){let t="";const r=n.length;let l=0;for(;l+2<r;l+=3){const r=n[l]<<16|n[l+1]<<8|n[l+2];t+=s[r>>18&63]+s[r>>12&63]+s[r>>6&63]+s[63&r];}const e=r-l;if(1===e){const r=n[l]<<16;t+=s[r>>18&63]+s[r>>12&63]+"==";}else if(2===e){const r=n[l]<<16|n[l+1]<<8;t+=s[r>>18&63]+s[r>>12&63]+s[r>>6&63]+"=";}return t}(r)}}));var O$1;

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
		const aesCrypto = {};
		super({
			start() {
				initAesCrypto(aesCrypto, password, rawPassword, encryptionStrength);
			},
			async transform(chunk, controller) {
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
				if (aesCrypto.discarded) {
					return;
				}
				const output = new Uint8Array(chunk.length - AUTHENTICATION_CODE_LENGTH - ((chunk.length - AUTHENTICATION_CODE_LENGTH) % BLOCK_LENGTH));
				controller.enqueue(append(aesCrypto, chunk, output, 0, AUTHENTICATION_CODE_LENGTH, true));
			},
			async flush(controller) {
				const {
					engine,
					pendingInput,
					ready
				} = aesCrypto;
				if (engine) {
					await ready;
					if (aesCrypto.discarded) {
						return;
					}
					const originalAuthenticationCode = subarray(pendingInput, pendingInput.length - AUTHENTICATION_CODE_LENGTH);
					const decryptedChunkArray = new Uint8Array(subarray(pendingInput, 0, pendingInput.length - AUTHENTICATION_CODE_LENGTH));
					engine.process(decryptedChunkArray, true);
					const authenticationCode = engine.digest();
					let invalidAuthenticationCode = pendingInput.length < AUTHENTICATION_CODE_LENGTH ? 1 : 0;
					for (let indexByte = 0; indexByte < AUTHENTICATION_CODE_LENGTH; indexByte++) {
						invalidAuthenticationCode |= authenticationCode[indexByte] ^ originalAuthenticationCode[indexByte];
					}
					if (invalidAuthenticationCode && checkAuthenticationCode) {
						controller.error(new Error(ERR_INVALID_AUTHENTICATION_CODE));
						return;
					}
					controller.enqueue(decryptedChunkArray);
				}
			}
		});
		setDisposingReadable(this, aesCrypto);
	}
}

class AESEncryptionStream extends TransformStream {

	constructor({ password, rawPassword, encryptionStrength }) {
		const aesCrypto = {};
		super({
			start() {
				initAesCrypto(aesCrypto, password, rawPassword, encryptionStrength);
			},
			async transform(chunk, controller) {
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
				if (aesCrypto.discarded) {
					return;
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
				} = aesCrypto;
				if (engine) {
					await ready;
					if (aesCrypto.discarded) {
						return;
					}
					const encryptedChunkArray = new Uint8Array(pendingInput);
					engine.process(encryptedChunkArray, false);
					const authenticationCode = subarray(engine.digest(), 0, AUTHENTICATION_CODE_LENGTH);
					controller.enqueue(concat(encryptedChunkArray, authenticationCode));
				}
			}
		});
		setDisposingReadable(this, aesCrypto);
	}
}

function initAesCrypto(aesCrypto, password, rawPassword, encryptionStrength) {
	Object.assign(aesCrypto, {
		ready: new Promise(resolve => aesCrypto.resolveReady = resolve),
		password: encodePassword(password, rawPassword),
		strength: encryptionStrength - 1,
		pendingInput: EMPTY_UINT8_ARRAY,
		discarded: false
	});
}

function setDisposingReadable(stream, aesCrypto) {
	const reader = stream.readable.getReader();
	const readable = new ReadableStream({
		async pull(controller) {
			try {
				const { value, done } = await reader.read();
				if (done) {
					controller.close();
				} else {
					controller.enqueue(value);
				}
			} catch (error) {
				disposeEngine(aesCrypto);
				reader.cancel(error).catch(() => { });
				throw error;
			}
		},
		cancel(reason) {
			disposeEngine(aesCrypto);
			return reader.cancel(reason);
		}
	});
	Object.defineProperty(stream, "readable", {
		get() {
			return readable;
		}
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

function disposeEngine(aesCrypto) {
	const { engine } = aesCrypto;
	aesCrypto.discarded = true;
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
	if (aesCrypto.discarded) {
		disposeEngine(aesCrypto);
	}
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
	const cryptoKeys = [0x12345678, 0x23456789, 0x34567890];
	Object.assign(target, {
		cryptoKeys,
		crcKey0: new Crc32(cryptoKeys[0]),
		crcKey2: new Crc32(cryptoKeys[2])
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
	let [, key1] = target.cryptoKeys;
	target.crcKey0.append([byte]);
	const key0 = ~target.crcKey0.get();
	key1 = getInt32(Math.imul(getInt32(key1 + getInt8(key0)), 134775813) + 1);
	target.crcKey2.append([key1 >>> 24]);
	const key2 = ~target.crcKey2.get();
	target.cryptoKeys = [key0, key1, key2];
}

function getByte(target) {
	const temp = target.cryptoKeys[2] | 2;
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
			try {
				const { value, done } = await reader.read();
				if (done) {
					controller.close();
				} else {
					controller.enqueue(value);
				}
			} catch (error) {
				reader.cancel(error).catch(() => { });
				throw error;
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
const ERR_CODEC_OUT_OF_MEMORY = "Codec out of memory";
const ERR_INVALID_CRC32 = "Invalid CRC32";
const Z_MEM_ERROR_CODE = "Z_MEM_ERROR";
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
		const GzipCompressionStream = getGzipCodecStream(useCompressionStream, CompressionStream, CompressionStreamFallback);
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
					if (!useCompressionStream && CompressionStreamFallback) {
						throw mapMemoryError(error);
					}
					let gzipStream;
					try {
						gzipStream = new CompressionStream(FORMAT_GZIP);
					} catch {
						throw mapMemoryError(error);
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

function pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize, crc32, sourceErrors) {
	const writer = gzipStream.writable.getWriter();
	const reader = gzipStream.readable.getReader();
	const outputCrc32 = crc32 === UNDEFINED_VALUE ? new Crc32() : UNDEFINED_VALUE;
	let outputLength = 0;
	let trailerWritten = false;
	let settled = false;
	let resolvePull, controller;
	const output = new ReadableStream({
		start(streamController) {
			controller = streamController;
		},
		pull() {
			resumePump();
		},
		cancel(reason) {
			settled = true;
			resumePump();
			return reader.cancel(reason);
		}
	});
	pump();
	drain();
	return output;

	async function pump() {
		const inputReader = readable.getReader();
		try {
			const header = new Uint8Array(GZIP_HEADER_LENGTH);
			header.set(GZIP_HEADER_BYTES);
			await writer.write(header);
			for (; ;) {
				await outputCapacity();
				await writer.ready;
				const { value, done } = await readSource(inputReader, sourceErrors);
				if (done) {
					break;
				}
				await writer.write(value);
			}
			if (outputCrc32) {
				await writer.write(new Uint8Array(0));
			}
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

	async function drain() {
		try {
			for (; ;) {
				const { value, done } = await read();
				if (done) {
					break;
				}
				outputLength += value.length;
				if (outputLength > outputSize) {
					throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
				}
				if (outputCrc32) {
					outputCrc32.append(value);
				}
				controller.enqueue(value);
			}
			if (!settled) {
				settled = true;
				controller.close();
			}
		} catch (error) {
			fail(error);
			await cancel(reader, error);
		}
	}

	function read() {
		return reader.read().catch(error => {
			if (trailerWritten) {
				if (!outputCrc32) {
					throw mapError(error, ERR_INVALID_CRC32);
				}
				if (outputLength != outputSize) {
					throw mapError(error, ERR_INVALID_UNCOMPRESSED_SIZE);
				}
				return { done: true };
			}
			throw mapCodecError(error, sourceErrors);
		});
	}

	function outputCapacity() {
		if (!settled && controller.desiredSize <= 0) {
			return new Promise(resolve => resolvePull = resolve);
		}
	}

	function resumePump() {
		if (resolvePull) {
			const resolve = resolvePull;
			resolvePull = UNDEFINED_VALUE;
			resolve();
		}
	}

	function fail(error) {
		if (!settled) {
			settled = true;
			controller.error(error);
			resumePump();
		}
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
			const sourceErrors = new Set();
			const codecStreams = format && getCodecStreams(format);
			let gzipStream;
			if (codecStreams) {
				readable = pipeThroughBackpressured(readable, createCodecStream(codecStreams.DecompressionStream, format, { chunkSize, compressionMethod, rawBitFlag, uncompressedSize: outputSize }), sourceErrors);
			} else {
				const GzipDecompressionStream = getGzipCodecStream(useCompressionStream, DecompressionStream, DecompressionStreamFallback);
				if (checkCrc32 && !deflate64 && crc32 !== UNDEFINED_VALUE && outputSize !== UNDEFINED_VALUE && GzipDecompressionStream) {
					try {
						gzipStream = new GzipDecompressionStream(FORMAT_GZIP, { chunkSize });
					} catch {
						gzipStream = UNDEFINED_VALUE;
					}
				}
				if (!gzipStream) {
					try {
						readable = pipeThroughCompressionStream(readable, useCompressionStream, { chunkSize, deflate64 }, DecompressionStream, DecompressionStreamFallback, sourceErrors);
					} catch (error) {
						if (deflate64 || outputSize === UNDEFINED_VALUE || (!useCompressionStream && DecompressionStreamFallback)) {
							throw mapMemoryError(error);
						}
						try {
							gzipStream = new DecompressionStream(FORMAT_GZIP);
						} catch {
							throw mapMemoryError(error);
						}
					}
				}
			}
			if (gzipStream) {
				gzipCrc32 = true;
				readable = pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize, crc32, sourceErrors);
			} else {
				readable = mapInflateStreamError(readable, sourceErrors);
			}
		}
		if (checkCrc32 && !gzipCrc32) {
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

function getGzipCodecStream(useCompressionStream, CodecStreamNative, CodecStreamFallback) {
	if (useCompressionStream && CodecStreamNative) {
		return CodecStreamNative;
	} else if (CodecStreamFallback && CodecStreamFallback.requiresModule) {
		return CodecStreamFallback;
	}
}

function pipeThroughCompressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamFallback, sourceErrors) {
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
	return pipeThroughBackpressured(readable, codecStream, sourceErrors);
}

function pipeThrough(readable, transformStream) {
	return toCompatibleReadable(readable).pipeThrough(transformStream);
}

function pipeThroughBackpressured(readable, transformStream, sourceErrors) {
	const writer = transformStream.writable.getWriter();
	const reader = readable.getReader();
	pump();
	return transformStream.readable;

	async function pump() {
		try {
			for (; ;) {
				await writer.ready;
				const result = await readSource(reader, sourceErrors);
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

function readSource(reader, sourceErrors) {
	const result = reader.read();
	return sourceErrors ? result.catch(error => {
		sourceErrors.add(error);
		throw error;
	}) : result;
}

function mapCodecError(error, sourceErrors) {
	if (sourceErrors.has(error)) {
		return error;
	}
	return mapError(error, isMemoryError(error) ? ERR_CODEC_OUT_OF_MEMORY : ERR_INVALID_COMPRESSED_DATA);
}

function mapMemoryError(error) {
	return isMemoryError(error) ? mapError(error, ERR_CODEC_OUT_OF_MEMORY) : error;
}

function isMemoryError(error) {
	return isErrorObject(error) && error.code == Z_MEM_ERROR_CODE;
}

function mapError(error, message) {
	const mappedError = new Error(message);
	mappedError.cause = error;
	return mappedError;
}

function mapInflateStreamError(readable, sourceErrors) {
	const reader = readable.getReader();
	return new ReadableStream({
		async pull(controller) {
			try {
				const { value, done } = await reader.read();
				if (done) {
					controller.close();
				} else {
					controller.enqueue(value);
				}
			} catch (error) {
				await cancel(reader, error);
				throw mapCodecError(error, sourceErrors);
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
		const { signal } = workerOptions.streamOptions;
		await readable
			.pipeThrough(codecStream)
			.pipeThrough(chunkStream)
			.pipeTo(writable, { preventClose: true, preventAbort: true, signal });
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
const ABORT_EVENT_TYPE = "abort";

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
	const { signal } = workerData.workerOptions.streamOptions;
	if (signal) {
		const onAbort = () => abortController.abort(signal.reason);
		const removeAbortListener = () => signal.removeEventListener(ABORT_EVENT_TYPE, onAbort);
		signal.addEventListener(ABORT_EVENT_TYPE, onAbort);
		closed.then(removeAbortListener, removeAbortListener);
	}
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
	}
	if (isErrorObject(responseError)) {
		try {
			if (outputSize !== UNDEFINED_VALUE) {
				responseError.outputSize = outputSize;
			}
			if (codecImportFailed) {
				responseError.codecImportFailed = true;
			}
			if (cause && !isErrorObject(responseError.cause)) {
				responseError.cause = Object.assign(new Error(cause.message), { name: cause.name });
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
		const { useRangeHeader, forceRangeRequests, size, eocdCache } = reader;
		if ((useRangeHeader || forceRangeRequests) && size !== UNDEFINED_VALUE) {
			const { offset = 0, size: readSize = size - offset } = options || {};
			const cached = eocdCache && offset >= size - eocdCache.length;
			if (readSize > 0 && offset < size && !cached) {
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
		password = password && password.length ? password : UNDEFINED_VALUE;
		rawPassword = rawPassword && rawPassword.length ? rawPassword : UNDEFINED_VALUE;
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
				throwIfAborted(signal);
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
	const remoteProbeBudget = { remaining: MAX_END_OF_CENTRAL_DIR_PROBES };
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
	if (remoteProbeBudget.remaining > 0) {
		remoteProbeBudget.remaining--;
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
	ERR_CODEC_OUT_OF_MEMORY: ERR_CODEC_OUT_OF_MEMORY,
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
	let password = getOptionValue(zipWriter, options, OPTION_PASSWORD);
	let rawPassword = getOptionValue(zipWriter, options, OPTION_RAW_PASSWORD);
	checkPasswordOption(password, rawPassword);
	password = password && password.length ? password : UNDEFINED_VALUE;
	rawPassword = rawPassword && rawPassword.length ? rawPassword : UNDEFINED_VALUE;
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
	const initialOffset = writerOptions[OPTION_OFFSET] === UNDEFINED_VALUE ? 0 : writerOptions[OPTION_OFFSET];
	let offset = initialOffset;
	let minimumEntrySize = INFINITY_VALUE;
	const entrySizes = [];
	const entriesAlreadyZip64 = new Set();
	for (const entry of entries) {
		let { name } = entry;
		const { size } = entry;
		const options = Object.assign({}, entry.options);
		if (getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY) && !name.endsWith(DIRECTORY_SIGNATURE)) {
			name += DIRECTORY_SIGNATURE;
		}
		const attributesInfo = resolveAttributes(zipWriter, name, options);
		({ name } = attributesInfo);
		const { resolvedOptions: metadata } = resolveMetadata(zipWriter, name, options);
		if (metadata.level != 0 && metadata.compressionMethod === UNDEFINED_VALUE &&
			!metadata.passThroughCompression && !(await supportsDeflate(getConfiguration()))) {
			metadata.level = 0;
		}
		const hasContent = !getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY);
		if (hasContent && size === UNDEFINED_VALUE) {
			throw new Error(ERR_UNDETERMINED_SIZE);
		}
		const { maximumCompressedSize, resolvedOptions: sizes } = resolveEntrySizes(zipWriter, hasContent, size, metadata, options);
		if (hasContent && !metadata.passThroughCompression && isCompressed(sizes.compressionMethod, sizes.level)) {
			throw new Error(ERR_UNDETERMINED_SIZE);
		}
		const entryOptions = Object.assign({}, options, attributesInfo.resolvedOptions, metadata, sizes, { [OPTION_USDZ]: usdz });
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
		files.set(name, Object.assign({}, entryOptions, headerInfo, {
			offset,
			diskNumberStart: 0,
			compressedSize
		}));
		const entrySize = entryInfo.metadataSize + compressedSize;
		entrySizes.push(entrySize);
		entriesAlreadyZip64.add(Boolean(entryOptions.zip64Enabled ||
			entryOptions.uncompressedSize >= MAX_32_BITS || compressedSize >= MAX_32_BITS));
		minimumEntrySize = Math.min(minimumEntrySize, entrySize);
		offset += entrySize;
	}
	const layoutDependsOnWriteOrder = files.size > 1 && (usdz ||
		(offset - minimumEntrySize >= MAX_32_BITS &&
			(entriesAlreadyZip64.size > 1 || countEntriesBefore4GB(entrySizes, initialOffset, true) != countEntriesBefore4GB(entrySizes, initialOffset, false))));
	if (layoutDependsOnWriteOrder && !writeOrderGuaranteed) {
		throw new Error(ERR_UNDETERMINED_SIZE);
	}
	const { directoryDataLength, zip64Entries } = createDirectoryRecords(files);
	let zip64 = getOptionValue(zipWriter, writerOptions, PROPERTY_NAME_ZIP64);
	if (offset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || files.size >= MAX_16_BITS) {
		if (zip64 === false) {
			throw new Error(ERR_UNSUPPORTED_FORMAT);
		} else {
			zip64 = true;
		}
	} else if (zip64 === UNDEFINED_VALUE && zip64Entries) {
		zip64 = true;
	}
	return offset - initialOffset + directoryDataLength + commentLength + (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH);
}

function countEntriesBefore4GB(entrySizes, initialOffset, largestFirst) {
	const ordered = entrySizes.slice().sort((first, second) => largestFirst ? second - first : first - second);
	let position = initialOffset;
	let count = 0;
	for (const entrySize of ordered) {
		if (position >= MAX_32_BITS) {
			break;
		}
		position += entrySize;
		count++;
	}
	return count;
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
			throwIfAborted(signal);
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

const VERSION = "2.17.0";

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
	setDefaultConfiguration({ baseURI: (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index-native.cjs', document.baseURI).href)) });
} catch {
	// ignored
}

var{Uint8Array:p,Uint16Array:g,Int32Array:R,TransformStream:H,Math:O,Error:z,Array:k}=globalThis,pe=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],Z=new p(0),qe=new g(0),de=[];for(let e=0;e<6;e++)de.push(e,0==e?8:4);de.push(0,1);var Se=[];for(let e=0;e<14;e++)Se.push(e,0==e?4:2);var Ee=new g([0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576]),ge=new g([0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0]);function M(e,t,n,r,i){if(0==i)return;let f=e instanceof p?e:new p(e.buffer,e.byteOffset,e.byteLength),l=n instanceof p?n.subarray(r,r+i):new p(n.buffer,n.byteOffset+r,i);f.set(l,t);}function Ve(e,t,n){0!=n&&(e instanceof p?e:new p(e.buffer,e.byteOffset,e.byteLength)).fill(0,t,t+n);}function je(){return {next_in:Z,next_in_index:0,avail_in:0,total_in:0,next_out:Z,next_out_index:0,avail_out:0,total_out:0,msg:"",t:0,i:0,l:0,_:void 0}}function $e(e,t){let n=1<<t;return {o:e,u:new p(n),h:n,k:t,m:0,v:0,p:0,T:0}}function te(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1];for(let e=0;e<i;e++)t.push(r);}return new g(t)}var ne=class{constructor(e,t){this.I=e,this.M=t,this.C=0;}},re=class{constructor(e,t,n,r,i){this.Z=e,this.W=t,this.q=n,this.O=r,this.S=i;}};function D_(e){return J_[e<-6||e>2?9:2-e]||""}function we(e,t){try{e.msg=D_(t);}catch(n){e.msg="zlib error "+String(t)+" ("+n+")";}return t}function Qe(e,t){let n=e>>>0,r=0;for(let e=0;e<t;e++)r=r<<1|1&n,n>>>=1;return r}function T(e,t){e.D[e.j++]=t;}function Ae(e,t){T(e,255&t),T(e,t>>>8&255);}function e_(e,t,n){let r=255&n,i=65535&t,f=e.A+e.N;return e.D[f]=255&i,e.D[f+1]=i>>>8&255,e.D[f+2]=r,e.N+=3,i=i-1&65535,e.H[__[r]+ie+1].R++,e.J[y_(i)].R++,e.N==e.U}function De(e,t){let n=255&t,r=e.A+e.N;return e.D[r]=0,e.D[r+1]=0,e.D[r+2]=n,e.N+=3,e.H[n].R++,e.N==e.U}function ye(e){return e.h-ae}function y_(e){return e<256?A_[e]:A_[256+(e>>7)]}function v_(e){let t=Ce+7,n=1<<t,r=(1<<t)-1,i=O.floor((t+I-1)/I),f=1<<8+Ce;return {...$e(e,15),o:e,Y:42,P:0,B:void 0,F:32767,G:t,V:n,L:r,X:i,$:new g(32768),K:new g(n),ee:f,D:new p(32768),te:0,ne:32768,j:0,re:0,ie:0,fe:0,le:0,_e:0,oe:-2,ae:0,ue:0,ce:0,se:0,he:0,de:0,we:0,be:0,ke:0,ge:0,me:0,ve:0,pe:0,xe:0,Te:new R(2*Te+1),ye:new p(2*Te+1),Ie:new g(be+1),N:0,U:0,Me:Z,A:0,ze:0,Ce:0,Ze:8,We:32768,qe:0,Oe:0,Se:0,H:new k(fe).fill(0).map(()=>J()),J:new k(2*me+1).fill(0).map(()=>J()),De:new k(2*oe+1).fill(0).map(()=>J()),je:w_(),Ae:w_(),Qe:w_()}}function I_(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1],f=J();f.Ne=r,f.Re=i,t.push(f);}return t}function J(){return {R:0,Ne:0,He:0,Re:0}}function w_(){return new ne([],bn(null,Z,0,0,0))}function bn(e,t,n,r,i){return new re(e,t,n,r,i)}function Q_(){let e=new k(288).fill(0);for(let t=0;t<=143;t++)e[t]=8;for(let t=144;t<=255;t++)e[t]=9;for(let t=256;t<=279;t++)e[t]=7;for(let t=280;t<=287;t++)e[t]=8;return e}function k_(e){let{code:t,length:n}=sn(e),r=new g(2*e.length),i=0;for(let f=0;f<e.length;f++){let e=n[f]||0,l=t[f]||0;r[i++]=e?Qe(l,e):0,r[i++]=e;}return new g(r)}function et(e,t,n){let r=0;for(let n=0;n<e.length;n++){let i=t[n]?1<<t[n]:1,f=e[n]+i-1;f>r&&(r=f);}r<n&&(r=n);let i=new p(r+1);for(let n=0;n<=r;n++)for(let r=0;r<e.length;r++){let f=t[r]?1<<t[r]:1,l=e[r];if(n>=l&&n<=l+f-1){i[n]=r;break}}let f=0;for(let n=0;n<e.length-1;n++){let r=t[n]?1<<t[n]:1,i=e[n]+r-1;i>f&&(f=i);}return i[f]=e.length-1,i}function _t(e,t){let n=0;for(let r=0;r<e.length;r++){let i=t[r]?1<<t[r]:1,f=e[r]+i-1;f>n&&(n=f);}let r=new p(n+1);for(let i=0;i<=n;i++)for(let n=0;n<e.length;n++){let f=t[n]?1<<t[n]:1,l=e[n];if(i>=l&&i<=l+f-1){r[i]=n;break}}return r}function tt(e){let t=new p(512),n=e.length-1;for(let r=0;r<256;r++)t[r]=r<=n?e[r]:e[n];for(let r=256;r<=n;r++){let n=r>>7;t[256+(n>255?255:n)]=e[r];}for(let e=257;e<512;e++)0==t[e]&&(t[e]=t[e-1]);return t}function sn(e){let t=O.max(...e),n=new k(t+1).fill(0);for(let t of e)t>0&&n[t]++;let r=new k(e.length).fill(0),i=new k(t+1).fill(0),f=0;for(let e=1;e<=t;e++)f=f+n[e-1]<<1,i[e]=f;for(let t=0;t<e.length;t++){let n=e[t];0!=n&&(r[t]=i[n]++);}return {code:r,length:e}}var Ce=8,I=3,ee=258,ae=ee+I+1,nt=4096,Ue=16,He=ee,hn=29,ie=256,Te=ie+1+hn,me=30,oe=19,fe=2*Te+1,be=15,rt=9,at=255,it=32,ot=4,ve=256,t_=16,n_=17,r_=18,ft=0,N_=1,lt=2,Q=-1,J_=["need dictionary","stream end","","file error","stream error","data error","insufficient memory","buffer error",""],a_=te(de),i_=te(Se),Be=new g(19);Be[16]=2,Be[17]=3,Be[18]=7;var xn=k_(Q_()),pn=k_(new k(30).fill(5)),Fe=I_(xn),R_=I_(pn),__=et(ge,a_,ee),A_=tt(_t(Ee,i_));function se(e,t,n){if(void 0===t||void 0===n)return 1;let r=65535&e,i=e>>>16&65535,f=0;for(;n>0;){let e=n>2e3?2e3:n;n-=e;do{r=r+t[f++]|0,i=i+r|0;}while(--e);r%=65521,i%=65521;}return (i<<16|r)>>>0}var Ze=[[],[],[],[],[],[],[],[]];for(let e=0;e<256;e++){let t=e;for(let e=0;e<8;e++)t=1&t?3988292384^t>>>1:t>>>1;Ze[0][e]=t;}for(let e=0;e<256;e++)for(let t=1;t<8;t++){let n=Ze[t-1][e];Ze[t][e]=n>>>8^Ze[0][255&n];}var[ut,Sn,En,gn,Tn,wn,An,Dn]=Ze;function W(e=0,t,n){if(!t)return 0;void 0===n&&(n=t.length);let r=0|~e,i=0;if((n=O.min(n,t.length))>=8){let e=new DataView(t.buffer,t.byteOffset,n),f=n-8;for(;i<=f;i+=8){let t=r^e.getInt32(i,true),n=e.getInt32(i+4,true);r=Dn[255&t]^An[t>>>8&255]^wn[t>>>16&255]^Tn[t>>>24&255]^gn[255&n]^En[n>>>8&255]^Sn[n>>>16&255]^ut[n>>>24&255];}}for(;i<n;i++)r=r>>>8^ut[255&(r^t[i])];return (4294967295^r)>>>0}function xt(e){16==e.T?(Ae(e,e.p),e.p=0,e.T=0):e.T>=8&&(T(e,e.p),e.p>>=8,e.T-=8);}function pt(e){e.T>8?Ae(e,e.p):e.T>0&&T(e,e.p),e.ze=1+(e.T-1&7),e.p=0,e.T=0;}function yn(e,t,n){let r,i,f=[],l=0;for(r=1;r<=be;r++)l=l+n[r-1]<<1,f[r]=l;for(i=0;i<=t;i++){let t=e[i].Re;0!=t&&(e[i].Ne=Qe(f[t]++,t));}}function C(e,t,n){e.T>Ue-n?(e.p=65535&(e.p|t<<e.T),Ae(e,e.p),e.p=t>>Ue-e.T&65535,e.T+=n-Ue):(e.p=65535&(e.p|t<<e.T),e.T+=n);}function St(e){for(let t=0;t<e.H.length;t++)e.H[t].R=0;for(let t=0;t<e.J.length;t++)e.J[t].R=0;for(let t=0;t<e.De.length;t++)e.De[t].R=0;e.H[ve].R=1,e.ie=e.fe=0,e.N=e.le=0;}function Et(e){if(e.H&&e.H.length>=fe)for(let t=0;t<fe;t++)e.H[t]=J();else {e.H=[];for(let t=0;t<fe;t++)e.H.push(J());}if(e.J&&e.J.length>=2*me+1)for(let t=0;t<2*me+1;t++)e.J[t]=J();else {e.J=[];for(let t=0;t<2*me+1;t++)e.J.push(J());}if(e.De&&e.De.length>=2*oe+1)for(let t=0;t<2*oe+1;t++)e.De[t]=J();else {e.De=[];for(let t=0;t<2*oe+1;t++)e.De.push(J());}e.je=new ne(e.H,new re(Fe,a_,ie+1,Te,be)),e.Ae=new ne(e.J,new re(R_,i_,0,me,be)),e.Qe=new ne(e.De,new re(null,Be,0,oe,7)),e.p=0,e.T=0,e.ze=0,St(e);}var he=1;function vn(e,t,n){return n=e.Te[he],e.Te[he]=e.Te[e.Oe--],z_(e,t,he),n}function mt(e,t,n,r){return e[t].R<e[n].R||e[t].R==e[n].R&&r[t]<=r[n]}function z_(e,t,n){let r=e.Te[n],i=n<<1;for(;i<=e.Oe&&(i<e.Oe&&mt(t,e.Te[i+1],e.Te[i],e.ye)&&i++,!mt(t,r,e.Te[i],e.ye));)e.Te[n]=e.Te[i],n=i,i<<=1;e.Te[n]=r;}function In(e,t){let n,r,i,f,l,_,o=t.I,a=t.C,u=t.M.Z,c=t.M.W,s=t.M.q,h=t.M.S,d=0;for(f=0;f<=be;f++)e.Ie[f]=0;for(o[e.Te[e.Se]].Re=0,n=e.Se+1;n<fe;n++)r=e.Te[n],f=o[o[r].He].Re+1,f>h&&(f=h,d++),o[r].Re=f,!(r>a)&&(e.Ie[f]++,l=0,r>=s&&(l=c[r-s]),_=o[r].R,e.ie+=_*(f+l),u&&(e.fe+=_*(u[r].Re+l)));if(0!=d){do{for(f=h-1;0==e.Ie[f];)f--;e.Ie[f]--,e.Ie[f+1]+=2,e.Ie[h]--,d-=2;}while(d>0);for(f=h;0!=f;f--)for(r=e.Ie[f];0!=r;)i=e.Te[--n],!(i>a)&&(o[i].Re!=f&&(e.ie+=(f-o[i].Re)*o[i].R,o[i].Re=f),r--);}}function O_(e,t){let n,r,i,f=t.I,l=t.M.Z,_=t.M.O,o=-1;for(e.Oe=0,e.Se=fe,n=0;n<_;n++)0!=f[n].R?(e.Te[++e.Oe]=o=n,e.ye[n]=0):f[n].Re=0;for(;e.Oe<2;)i=e.Te[++e.Oe]=o<2?++o:0,f[i].R=1,e.ye[i]=0,e.ie--,l&&(e.fe-=l[i].Re);for(t.C=o,n=O.floor(e.Oe/2);n>=1;n--)z_(e,f,n);i=_;do{n=vn(e,f,n),r=e.Te[he],e.Te[--e.Se]=n,e.Te[--e.Se]=r,f[i].R=f[n].R+f[r].R,e.ye[i]=(e.ye[n]>=e.ye[r]?e.ye[n]:e.ye[r])+1,f[n].He=f[r].He=i,e.Te[he]=i++,z_(e,f,he);}while(e.Oe>=2);e.Te[--e.Se]=e.Te[he],In(e,t),yn(f,t.C,e.Ie);}function bt(e,t,n){let r,i,f=-1,l=t[0].Re,_=0,o=7,a=4;for(0==l&&(o=138,a=3),t[n+1].Re=65535,r=0;r<=n;r++)i=l,l=t[r+1].Re,!(++_<o&&i==l)&&(_<a?e.De[i].R+=_:0!=i?(i!=f&&e.De[i].R++,e.De[t_].R++):_<=10?e.De[n_].R++:e.De[r_].R++,_=0,f=i,0==l?(o=138,a=3):i==l?(o=6,a=3):(o=7,a=4));}function st(e,t,n){let r,i=-1,f=t[0].Re,l=0,_=7,o=4;0==f&&(_=138,o=3);for(let a=0;a<=n;a++)if(r=f,f=t[a+1].Re,!(++l<_&&r==f)){if(l<o)do{C(e,e.De[r].Ne,e.De[r].Re);}while(0!=--l);else 0!=r?(r!=i&&(C(e,e.De[r].Ne,e.De[r].Re),l--),C(e,e.De[t_].Ne,e.De[t_].Re),C(e,l-3,2)):l<=10?(C(e,e.De[n_].Ne,e.De[n_].Re),C(e,l-3,3)):(C(e,e.De[r_].Ne,e.De[r_].Re),C(e,l-11,7));l=0,i=r,0==f?(_=138,o=3):r==f?(_=6,o=3):(_=7,o=4);}}function kn(e){let t;for(bt(e,e.H,e.je.C),bt(e,e.J,e.Ae.C),O_(e,e.Qe),t=oe-1;t>=3&&0==e.De[pe[t]].Re;t--);return e.ie+=3*(t+1)+5+5+4,t}function Nn(e,t,n,r){let i;for(C(e,t-257,5),C(e,n-1,5),C(e,r-4,4),i=0;i<r;i++)C(e,e.De[pe[i]].Re,3);st(e,e.H,t-1),st(e,e.J,n-1);}function Pe(e,t,n,r,i=0){C(e,(ft<<1)+r,3),pt(e),Ae(e,n),Ae(e,~n),n&&t&&M(e.D,e.j,t,i,n),e.j+=n;}function gt(e){xt(e);}function Tt(e){C(e,N_<<1,3),C(e,Fe[ve].Ne,Fe[ve].Re),xt(e);}function ht(e,t,n){let r,i,f,l,_=0;if(0!=e.N)do{r=255&e.Me[_],r+=(255&e.Me[_+1])<<8,i=e.Me[_+2],_+=3,0==r?C(e,t[i].Ne,t[i].Re):(f=__[i],C(e,t[f+ie+1].Ne,t[f+ie+1].Re),l=a_[f],0!=l&&(i-=ge[f],C(e,i,l)),r--,f=y_(r),C(e,n[f].Ne,n[f].Re),l=i_[f],0!=l&&(r-=Ee[f],C(e,r,l)));}while(_<e.N);C(e,t[ve].Ne,t[ve].Re);}function Rn(e){let t,n=4093624447;for(t=0;t<=31;t++,n>>=1)if(1&n&&0!=e.H[t].R)return 0;if(0!=e.H[9].R||0!=e.H[10].R||0!=e.H[13].R)return 1;for(t=32;t<ie;t++)if(0!=e.H[t].R)return 1;return 0}function wt(e,t,n,r,i=0){let f,l,_=0;e.ke>0?(2==e.o.t&&(e.o.t=Rn(e)),O_(e,e.je),O_(e,e.Ae),_=kn(e),f=e.ie+3+7>>3,l=e.fe+3+7>>3,(l<=f||4==e.ge)&&(f=l)):f=l=n+5,n+4<=f&&t?Pe(e,t,n,r,i):l==f?(C(e,(N_<<1)+r,3),ht(e,Fe,R_)):(C(e,(lt<<1)+r,3),Nn(e,e.je.C+1,e.Ae.C+1,_+1),ht(e,e.H,e.J)),St(e),r&&pt(e);}function vt(){let e=je();return e._=v_(e),e}var Ye=[{Je:Ot,Ue:0,Ee:0,Ye:0,Pe:0},{Je:U_,Ue:4,Ee:4,Ye:8,Pe:4},{Je:U_,Ue:4,Ee:5,Ye:16,Pe:8},{Je:U_,Ue:4,Ee:6,Ye:32,Pe:32},{Je:Ne,Ue:4,Ee:4,Ye:16,Pe:16},{Je:Ne,Ue:8,Ee:16,Ye:32,Pe:32},{Je:Ne,Ue:8,Ee:16,Ye:128,Pe:128},{Je:Ne,Ue:8,Ee:32,Ye:128,Pe:256},{Je:Ne,Ue:32,Ee:128,Ye:258,Pe:1024},{Je:Ne,Ue:32,Ee:258,Ye:258,Pe:4096}];function At(e){return 2*e-(e>4?9:0)}function l_(e,t,n){return ((t<<e.X^n)&e.L)>>>0}function u_(e,t){e.be=l_(e,e.be,e.u[t+(I-1)]);let n=e.$[t&e.F]=e.K[e.be];return e.K[e.be]=t,n}function It(e){e.K[e.V-1]=0,Ve(e.K,0,(e.V-1)*e.K.BYTES_PER_ELEMENT);}function Bn(e){let t,n,r=e.h;for(t=e.V;t>0;)t--,n=e.K[t],e.K[t]=n>=r?n-r:0;for(t=r;t>0;)t--,n=e.$[t],e.$[t]=n>=r?n-r:0;}function H_(e,t,n,r){let i=e.avail_in;return i>r&&(i=r),0==i?0:(e.avail_in-=i,M(t,n,e.next_in,e.next_in_index,i),1==e._.P?e.i=se(e.i,new p(t.buffer,t.byteOffset+n,i),i):2==e._.P&&(e.i=W(e.i,new p(t.buffer,t.byteOffset+n,i),i)),e.next_in_index+=i,e.total_in+=i,i)}function c_(e){let t,n,r=e.h;do{if(n=e.We-e.ce-e.ue,0==n&&0==e.ue&&0==e.ce?n=r:-1==n&&n--,e.ue>=r+ye(e)&&(M(e.u,0,e.u,r,r-n),e.qe-=r,e.ue-=r,e.ae-=r,e._e>e.ue&&(e._e=e.ue),Bn(e),n+=r),0==e.o.avail_in)break;if(t=H_(e.o,e.u,e.ue+e.ce,n),e.ce+=t,e.ce+e._e>=I){let t=e.ue-e._e;for(e.be=e.u[t],e.be=l_(e,e.be,e.u[t+1]);e._e&&(e.be=l_(e,e.be,e.u[t+I-1]),e.$[t&e.F]=e.K[e.be],e.K[e.be]=t,t++,e._e--,!(e.ce+e._e<I)););}}while(e.ce<ae&&0!=e.o.avail_in);if(e.m<e.We){let t,n=e.ue+e.ce;e.m<n?(t=e.We-n,t>He&&(t=He),Ve(e.u,n,t),e.m=n+t):e.m<n+He&&(t=n+He-e.m,t>e.We-e.m&&(t=e.We-e.m),Ve(e.u,e.m,t),e.m+=t);}}function kt(e,t,n=8,r=15,i=Ce,f=0){let l=1;if(!e)return  -2;if(e.msg="",-1==t&&(t=6),r<0){if(l=0,r<-15)return  -2;r=-r;}else r>15&&(l=2,r-=16);if(i<1||i>rt||8!=n||r<8||r>15||t<0||t>9||f<0||f>4||8==r&&1!=l)return  -2;8==r&&(r=9);let _=v_(e);return _?(e._=_,_.o=e,_.Y=42,_.P=l,_.B=void 0,_.k=r,_.h=1<<_.k,_.F=_.h-1,_.G=i+7,_.V=1<<_.G,_.L=_.V-1,_.X=(_.G+I-1)/I,_.u=new p(2*_.h),_.$=new g(_.h),_.K=new g(_.V),_.m=0,_.ee=1<<i+6,_.D=new p(_.ee*ot),_.ne=4*_.ee,_.u&&_.$&&_.K&&_.D?(_.Me=_.D.subarray(_.ee),_.A=_.te+_.ee,_.U=3*(_.ee-1),_.ke=t,_.ge=f,_.Ze=n,Pn(e)):(_.Y=666,e.msg=D_(-4),P_(e),-4)):-4}function Z_(e){if(null==e)return  true;let t=e._;return !t||t.o!=e||42!=t.Y&&57!=t.Y&&69!=t.Y&&73!=t.Y&&91!=t.Y&&103!=t.Y&&113!=t.Y&&666!=t.Y}function Fn(e){let t;return Z_(e)?-2:(e.total_in=e.total_out=0,e.msg="",e.t=2,t=e._,t.j=0,t.re=t.te,t.P<0&&(t.P=-t.P),t.Y=2==t.P?57:42,e.i=2==t.P?W(0):se(0),t.oe=-2,Et(t),0)}function Zn(e){e.We=2*e.h,It(e),e.xe=Ye[e.ke].Ee,e.me=Ye[e.ke].Ue,e.ve=Ye[e.ke].Ye,e.pe=Ye[e.ke].Pe,e.ue=0,e.ae=0,e.ce=0,e._e=0,e.se=e.he=I-1,e.we=0,e.be=0;}function Pn(e){let t=Fn(e);return 0==t&&Zn(e._),t}function Me(e,t){T(e,t>>8),T(e,255&t);}function q(e){let t,n=e._;gt(n),t=n.j,t>e.avail_out&&(t=e.avail_out),0!=t&&(M(e.next_out,e.next_out_index,n.D,n.re,t),e.next_out_index+=t,n.re+=t,e.total_out+=t,e.avail_out-=t,n.j-=t,0==n.j&&(n.re=n.te));}function Ie(e,t){let n=e._;n.B&&n.B.Be&&(e.i=W(e.i,new p(n.D.buffer,n.te+t,n.j-t),n.j-t));}function Nt(e,t){let n,r=e._;if(Z_(e)||t>5||t<0)return we(e,-2);if(!e.next_out||0!=e.avail_in&&!e.next_in||666==r.Y&&4!=t)return we(e,-2);if(0==e.avail_out)return we(e,-5);if(n=r.oe,r.oe=t,0!=r.j){if(q(e),0==e.avail_out)return r.oe=Q,0}else if(0==e.avail_in&&At(t)<=At(n)&&4!=t)return we(e,-5);if(666==r.Y&&0!=e.avail_in)return we(e,-5);if(42==r.Y&&0==r.P&&(r.Y=113),42==r.Y){let t,n=8+(r.k-8<<4)<<8;if(t=r.ge>=2||r.ke<2?0:r.ke<6?1:6==r.ke?2:3,n|=t<<6,0!=r.ue&&(n|=it),n+=31-n%31,Me(r,n),0!=r.ue&&(Me(r,e.i>>16),Me(r,65535&e.i)),e.i=1,r.Y=113,q(e),0!=r.j)return r.oe=Q,0}if(57==r.Y)if(e.i=W(0),T(r,31),T(r,139),T(r,8),r.B)T(r,(r.B.Fe?1:0)+(r.B.Be?2:0)+(null==r.B.Ge?0:4)+(null==r.B.Ve?0:8)+(null==r.B.Le?0:16)),T(r,255&r.B.Xe),T(r,r.B.Xe>>>8&255),T(r,r.B.Xe>>>16&255),T(r,r.B.Xe>>>24&255),T(r,9==r.ke?2:r.ge>=2||r.ke<2?4:0),T(r,255&r.B.$e),null!=r.B.Ge&&(T(r,255&r.B.Ke),T(r,r.B.Ke>>>8&255)),r.B.Be&&(e.i=W(e.i,r.D,r.j)),r.Ce=0,r.Y=69;else if(T(r,0),T(r,0),T(r,0),T(r,0),T(r,0),T(r,9==r.ke?2:r.ge>=2||r.ke<2?4:0),T(r,at),r.Y=113,q(e),0!=r.j)return r.oe=Q,0;if(69==r.Y){if(r.B&&null!=r.B.Ge){let t=r.j,n=(65535&r.B.Ke)-r.Ce;for(;r.j+n>r.ne;){let i=r.ne-r.j;if(M(r.D,r.j,r.B.Ge,r.Ce,i),r.j=r.ne,Ie(e,t),r.Ce+=i,q(e),0!=r.j)return r.oe=Q,0;t=0,n-=i;}M(r.D,r.j,r.B.Ge,r.Ce,n),r.j+=n,Ie(e,t),r.Ce=0;}r.Y=73;}if(73==r.Y){if(r.B&&r.B.Ve&&r.B.Ve.length){let t,n=r.j;do{if(r.j==r.ne){if(Ie(e,n),q(e),0!=r.j)return r.oe=Q,0;n=0;}t=r.B.Ve[r.Ce++],T(r,t);}while(0!=t);Ie(e,n),r.Ce=0;}r.Y=91;}if(91==r.Y){if(r.B&&r.B.Le&&r.B.Le.length){let t,n=r.j;do{if(r.j==r.ne){if(Ie(e,n),q(e),0!=r.j)return r.oe=Q,0;n=0;}t=r.B.Le[r.Ce++],T(r,t);}while(0!=t);Ie(e,n);}r.Y=103;}if(103==r.Y){if(r.B&&r.B.Be){if(r.j+2>r.ne&&(q(e),0!=r.j))return r.oe=Q,0;T(r,255&e.i),T(r,e.i>>>8&255),e.i=W(0);}if(r.Y=113,q(e),0!=r.j)return r.oe=Q,0}if(0!=e.avail_in||0!=r.ce||0!=t&&666!=r.Y){let n=0==r.ke?Ot(r,t):2==r.ge?Yn(r,t):3==r.ge?Mn(r,t):Ye[r.ke].Je(r,t);if((2==n||3==n)&&(r.Y=666),0==n||2==n)return 0==e.avail_out&&(r.oe=Q),0;if(1==n&&(1==t?Tt(r):5!=t&&(Pe(r,null,0,0),3==t&&(It(r),0==r.ce&&(r.ue=0,r.ae=0,r._e=0))),q(e),0==e.avail_out))return r.oe=Q,0}return 4!=t?0:r.P<=0?1:(2==r.P?(T(r,255&e.i),T(r,e.i>>>8&255),T(r,e.i>>>16&255),T(r,e.i>>>24&255),T(r,255&e.total_in),T(r,e.total_in>>>8&255),T(r,e.total_in>>>16&255),T(r,e.total_in>>>24&255)):(Me(r,e.i>>>16&65535),Me(r,65535&e.i)),q(e),r.P>0&&(r.P=-r.P),0!=r.j?0:1)}function P_(e){if(Z_(e))return  -2;let t=e._,n=t.Y;return t.u=Z,t.$=qe,t.K=qe,t.D=Z,t.Me=Z,t.Te=new R(0),t.ye=Z,t.Ie=qe,t.H.length=0,t.J.length=0,t.De.length=0,t.B=void 0,t.te=0,t.re=0,t.A=0,113==n?-3:0}function Rt(e,t){let n,r,i=e.pe,f=e.ue,l=e.he,_=e.ve,o=e.ue>ye(e)?e.ue-ye(e):0,a=e.$,u=e.F,c=e.u,s=e.ce,h=ee<s?ee:s,d=c[f],w=c[f+1],b=c[f+l-1],k=c[f+l];l>=e.me&&(i>>=2),_>s&&(_=s);do{if(n=t,c[n+l]!=k||c[n+l-1]!=b||c[n]!=d||c[n+1]!=w)continue;let i=2;for(;i<h&&c[f+i]==c[n+i];)i++;if(r=i,r>l){if(e.qe=t,l=r,r>=_)break;b=c[f+l-1],k=c[f+l];}}while((t=a[t&u])>o&&0!=--i);return l<=s?l:s}function zt(e,t){wt(e,e.u,e.ue-e.ae,t,e.ae),e.ae=e.ue,q(e.o);}function j(e,t){return zt(e,t?1:0),0==e.o.avail_out?t?2:0:null}var Dt=65535;function ke(e,t){return e<t?e:t}function Ot(e,t){let n,r,i,f=ke(e.ne-5,e.h),l=0,_=e.o.avail_in;do{if(n=Dt,i=e.T+42>>3,e.o.avail_out<i||(i=e.o.avail_out-i,r=e.ue-e.ae,n>r+e.o.avail_in&&(n=r+e.o.avail_in),n>i&&(n=i),n<f&&(0==n&&4!=t||0==t||n!=r+e.o.avail_in)))break;l=4==t&&n==r+e.o.avail_in?1:0,Pe(e,null,0,l),e.D[e.j-4]=n,e.D[e.j-3]=n>>8,e.D[e.j-2]=~n,e.D[e.j-1]=~n>>8,q(e.o),r&&(r>n&&(r=n),M(e.o.next_out,e.o.next_out_index,e.u,e.ae,r),e.o.next_out_index+=r,e.o.avail_out-=r,e.o.total_out+=r,e.ae+=r,n-=r),n&&(H_(e.o,e.o.next_out,e.o.next_out_index,n),e.o.next_out_index+=n,e.o.avail_out-=n,e.o.total_out+=n);}while(0==l);if(_-=e.o.avail_in,_){if(_>=e.h){e.le=2;let t=e.o.next_in_index-e.h;M(e.u,0,e.o.next_in,t,e.h),e.ue=e.h,e._e=e.ue;}else e.We-e.ue<=_&&(e.ue-=e.h,M(e.u,0,e.u,e.h,e.ue),e.le<2&&e.le++,e._e>e.ue&&(e._e=e.ue)),M(e.u,e.ue,e.o.next_in,e.o.next_in_index-_,_),e.ue+=_,e._e+=ke(_,e.h-e._e);e.ae=e.ue;}return e.m<e.ue&&(e.m=e.ue),l?(e.ze=8,3):0!=t&&4!=t&&0==e.o.avail_in&&e.ue==e.ae?1:(i=e.We-e.ue,e.o.avail_in>i&&e.ae>=e.h&&(e.ae-=e.h,e.ue-=e.h,M(e.u,0,e.u,e.h,e.ue),e.le<2&&e.le++,i+=e.h,e._e>e.ue&&(e._e=e.ue)),i>e.o.avail_in&&(i=e.o.avail_in),i&&(H_(e.o,e.u,e.ue,i),e.ue+=i,e._e+=ke(i,e.h-e._e)),e.m<e.ue&&(e.m=e.ue),i=e.T+42>>3,i=ke(e.ne-i,Dt),f=ke(i,e.h),r=e.ue-e.ae,(r>=f||(r||4==t)&&0!=t&&0==e.o.avail_in&&r<=i)&&(n=ke(r,i),l=4==t&&0==e.o.avail_in&&n==r?1:0,Pe(e,e.u,n,l,e.ae),e.ae+=n,q(e.o)),l&&(e.ze=8),l?2:0)}function U_(e,t){let n,r=false;for(;;){if(e.ce<ae){if(c_(e),e.ce<ae&&0==t)return 0;if(0==e.ce)break}if(n=0,e.ce>=I&&(n=u_(e,e.ue)),0!=n&&e.ue-n<=ye(e)&&(e.se=Rt(e,n)),e.se>=I)if(e.ue,e.qe,e.se,r=e_(e,e.ue-e.qe,e.se-I),e.ce-=e.se,e.se<=e.xe&&e.ce>=I){e.se--;do{e.ue++,n=u_(e,e.ue);}while(0!=--e.se);e.ue++;}else e.ue+=e.se,e.se=0,e.be=e.u[e.ue],e.be=l_(e,e.be,e.u[e.ue+1]);else r=De(e,e.u[e.ue]),e.ce--,e.ue++;if(r){let t=j(e,false);if(null!=t)return t}}if(e._e=e.ue<I-1?e.ue:I-1,4==t){let t=j(e,true);return null!=t?t:3}if(e.N){let t=j(e,false);if(null!=t)return t}return 1}function Ne(e,t){let n,r=false;for(;;){if(e.ce<ae){if(c_(e),e.ce<ae&&0==t)return 0;if(0==e.ce)break}if(n=0,e.ce>=I&&(n=u_(e,e.ue)),e.he=e.se,e.de=e.qe,e.se=I-1,0!=n&&e.he<e.xe&&e.ue-n<=ye(e)&&(e.se=Rt(e,n),e.se<=5&&(1==e.ge||e.se==I&&e.ue-e.qe>nt)&&(e.se=I-1)),e.he>=I&&e.se<=e.he){let t=e.ue+e.ce-I;e.ue,e.de,e.he,r=e_(e,e.ue-1-e.de,e.he-I),e.ce-=e.he-1,e.he-=2;do{++e.ue<=t&&(n=u_(e,e.ue));}while(0!=--e.he);if(e.we=0,e.se=I-1,e.ue++,r){let t=j(e,false);if(null!=t)return t}}else if(e.we){if(r=De(e,e.u[e.ue-1]),r&&zt(e,0),e.ue++,e.ce--,0==e.o.avail_out)return 0}else e.we=1,e.ue++,e.ce--;}if(e.we&&(r=De(e,e.u[e.ue-1]),e.we=0),e._e=e.ue<I-1?e.ue:I-1,4==t){let t=j(e,true);return null!=t?t:3}if(e.N){let t=j(e,false);if(null!=t)return t}return 1}function Mn(e,t){let n,r,i,f;for(;;){if(e.ce<=ee){if(c_(e),e.ce<=ee&&0==t)return 0;if(0==e.ce)break}if(e.se=0,e.ce>=I&&e.ue>0&&(i=e.ue-1,r=e.u[i],r==++i&&r==++i&&r==++i)){f=e.ue+ee;do{}while(r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&i<f);e.se=ee-(f-i),e.se>e.ce&&(e.se=e.ce);}if(e.se>=I?(e.ue,e.ue,e.se,n=e_(e,1,e.se-I),e.ce-=e.se,e.ue+=e.se,e.se=0):(n=De(e,e.u[e.ue]),e.ce--,e.ue++),n){let t=j(e,false);if(null!=t)return t}}if(e._e=0,4==t){let t=j(e,true);return null!=t?t:3}if(e.N){let t=j(e,false);if(null!=t)return t}return 1}function Yn(e,t){let n=false;for(;;){if(0==e.ce&&(c_(e),0==e.ce)){if(0==t)return 0;break}if(e.se=0,n=De(e,e.u[e.ue]),e.ce--,e.ue++,n){let t=j(e,false);if(null!=t)return t}}if(e._e=0,4==t){let t=j(e,true);return null!=t?t:3}if(e.N){let t=j(e,false);if(null!=t)return t}return 1}var ue=852,d_=592,m_=594,Lt=Ee.map(e=>e+1),Ct=ge.subarray(0,-1).map(e=>e+3),Xn=[16,1,73,1,200,1],Wn=[144,1,72,1,78,1],Ut=Se.map(qt),Ht=Se.map(Vt);Ut.push(64,2),Ht.push(142,2);var Bt=de.slice(0,-2).map(qt),Ft=de.slice(0,-2).map(Vt);Bt.push(...Xn),Ft.push(...Wn);var Zt=new g([...Ct,258,0,0]),Pt=new g([...Ct,3,0,0]),Mt=te(Bt),Yt=te(Ft),Xt=new g([...Lt,0,0]),Wt=new g([...Lt,32769,49153]),Gt=te(Ut),Kt=te(Ht);function qt(e,t){return t%2?e:e+16}function Vt(e,t){return t%2?e:e+128}function $t(e,t){let n,r=e._,i=e.next_in_index,f=e.next_out_index,l=e.next_in,_=e.next_out,o=r.u,a=r.p>>>0,u=r.T>>>0,c=r.et,s=r.tt,h=(1<<r.nt)-1,d=(1<<r.rt)-1,w=r.h>>>0,b=r.m>>>0,k=r.v>>>0,g=r.it,m=f-(t-e.avail_out),v=f+(e.avail_out-257),p=i+(e.avail_in-5),x=0,T=0,y=0,I=0;e:do{for(;u<15;){if(!(i<l.length))break e;a+=l[i++]<<u,u+=8;}n=c[a&h];t:for(;;){if(y=n>>>16&255,a>>>=y,u-=y,y=n>>>24,0==y){_[f++]=65535&n;break}if(16&y){if(x=65535&n,y&=15,y){for(;u<y;){if(!(i<l.length)){r.ft=16200;break e}a+=l[i++]<<u,u+=8;}x+=a&(1<<y)-1,a>>>=y,u-=y;}for(;u<15;){if(!(i<l.length)){r.ft=16200;break e}a+=l[i++]<<u,u+=8;}n=s[a&d];n:for(;;){if(y=n>>>16&255,a>>>=y,u-=y,y=n>>>24,16&y){if(T=65535&n,y&=15,y){for(;u<y;){if(!(i<l.length)){r.ft=16200;break e}a+=l[i++]<<u,u+=8;}T+=a&(1<<y)-1,a>>>=y,u-=y;}let t=x,c=f-m;if(T>c){let n=T-c;if(n>b&&g){e.msg="invalid distance too far back",r.ft=16209;break e}if(0==k){if(I=w-n,!(n<t)){for(let e=0;e<t;++e)_[f++]=o[I++];continue e}for(let e=0;e<n;++e)_[f++]=o[I++];t-=n,I=f-T;}else if(k<n){I=w+k-n;let e=n-k;if(!(e<t)){for(let e=0;e<t;++e)_[f++]=o[I++];continue e}for(let t=0;t<e;++t)_[f++]=o[I++];if(t-=e,I=0,!(k<t)){for(let e=0;e<t;++e)_[f++]=o[I++];continue e}for(let e=0;e<k;++e)_[f++]=o[I++];t-=k,I=f-T;}else {if(I=k-n,!(n<t)){for(let e=0;e<t;++e)_[f++]=o[I++];continue e}for(let e=0;e<n;++e)_[f++]=o[I++];t-=n,I=f-T;}for(;t>2;)_[f++]=_[I++],_[f++]=_[I++],_[f++]=_[I++],t-=3;t&&(_[f++]=_[I++],t>1&&(_[f++]=_[I++]));}else {for(I=f-T;t>2;)_[f++]=_[I++],_[f++]=_[I++],_[f++]=_[I++],t-=3;t&&(_[f++]=_[I++],t>1&&(_[f++]=_[I++]));}break}if(64&y){e.msg="invalid distance code",r.ft=16209;break e}n=s[(65535&n)+(a&(1<<y)-1)];continue n}break}if(64&y){if(32&y){r.ft=16191;break e}e.msg="invalid literal/length code",r.ft=16209;break e}n=c[(65535&n)+(a&(1<<y)-1)];continue t}}while(i<p&&f<v);let M=u>>3;i-=M,u-=M<<3,a&=(1<<u)-1,e.next_in_index=i,e.next_out_index=f,e.avail_in=i<p?p-i+5:5-(i-p),e.avail_out=f<v?v-f+257:257-(f-v),r.p=a>>>0,r.T=u>>>0;}var Gn=new R(0);function M_(e,t){let n=Gn,r=t?ue+m_:ue+d_;return {...$e(e,0),o:e,ft:16180,lt:false,P:0,_t:false,ot:0,ut:0,ct:0,st:0,u:Z,ht:0,dt:0,Ge:0,et:n,tt:n,nt:0,rt:0,wt:0,bt:0,kt:0,gt:0,vt:n,xt:new g(320),Tt:new g(288),yt:new R(r),It:0,it:true,Mt:0,zt:0,Ct:t}}function We(e,t,n){return e<<24|t<<16|n}function b_(e=0,t=0,n=0){return We(e,t,n)}function s_(e=1){return We(64,e,0)}function Jt(e=0){return We(96,e,0)}function Y_(e){return ((255&e)<<24|(e>>8&255)<<16|(e>>16&255)<<8|e>>24&255)>>>0}var Oe=15,qn={Ct:false,Zt:Zt,Wt:Mt,qt:Xt,Ot:Gt,St:20,Dt:257,jt:0,At:d_,Qt:false,Nt:true},Vn={Ct:true,Zt:Pt,Wt:Yt,qt:Wt,Ot:Kt,St:19,Dt:256,jt:-1,At:m_,Qt:true,Nt:false};function Le(e,t,n,r,i,f,l,_){let o,a,u,c,s,h,d,w,b,k,m,v,p,x,T,y,I,M,z,C=new g(Oe+1),Z=new g(Oe+1),W=_?Vn:qn;for(o=0;o<=Oe;o++)C[o]=0;for(a=0;a<n;a++)C[t[a]]++;for(s=i.Rt,c=Oe;c>=1&&0==C[c];c--);if(s>c&&(s=c),0==c)return W.Nt?(T=s_(1),r.Rt[0]=T,r.Rt[1]=T,i.Rt=1,0):-1;for(u=1;u<c&&0==C[u];u++);for(s<u&&(s=u),w=1,o=1;o<=Oe;o++)if(w<<=1,w-=C[o],w<0)return  -1;if(w>0&&(0==e||1!=c))return  -1;for(Z[1]=0,o=1;o<Oe;o++)Z[o+1]=Z[o]+C[o];for(a=0;a<n;a++)0!=t[a]&&(f[Z[t[a]]++]=a);switch(e){case 0:I=M=f,z=W.St;break;case 1:I=W.Zt,M=W.Wt,z=W.Dt;break;default:I=W.qt,M=W.Ot,z=W.jt;}if(k=0,a=0,o=u,y=l.Rt,h=s,d=0,p=-1,b=1<<s,x=b-1,1==e&&(W.Qt?b>=ue:b>ue)||2==e&&(W.Qt?b>=W.At:b>W.At))return 1;for(;;){T=jn(f,a,o,d,e,I,M,z,W.Ct),m=1<<o-d,v=1<<h,u=v;do{v-=m;let e=(k>>d)+v;r.Rt[y+e]=T;}while(0!=v);for(m=1<<o-1;k&m;)m>>=1;if(0!=m?(k&=m-1,k+=m):k=0,a++,0==--C[o]){if(o==c)break;o=t[f[a]];}if(o>s&&(k&x)!=p){for(0==d&&(d=s),y+=1<<h,h=o-d,w=1<<h;h+d<c&&(w-=C[h+d],!(w<=0));)h++,w<<=1;if(b+=1<<h,1==e&&(W.Qt?b>=ue:b>ue)||2==e&&(W.Qt?b>=W.At:b>W.At))return 1;p=k&x,r.Rt[l.Rt+p]=We(h,s,y-l.Rt);}}if(0!=k)for(T=s_(o-d);0!=k;){for(0!=d&&(k&x)!=p&&(d=0,o=s,y=l.Rt,h=s,T=s_(o)),r.Rt[y+(k>>d)]=T,m=1<<o-1;k&m;)m>>=1;0!=m?(k&=m-1,k+=m):k=0;}return l.Rt+=b,i.Rt=s,0}function jn(e,t,n,r,i,f,l,_,o){let a;if(o?e[t]<_:e[t]+1<_)a=b_(0,n-r,e[t]);else if(o?e[t]>_:e[t]>=_)if(o&&1==i){let i=e[t]-257;a=b_(l[i],n-r,f[i]);}else {let i=o?e[t]:e[t]-_;a=b_(l[i],n-r,f[i]);}else a=Jt(n-r);return a}var p_=new R(0),er={Ht:true,Jt:new R(544),Ut:p_,Et:p_},_r={Ht:true,Jt:new R(544),Ut:p_,Et:p_};function Qt(){let e=je();return e._=M_(e,false),e}function Ge(e){let t;return !(e&&(t=e._,!(!t||t.o!=e||t.Ct&&(t.ft<16191||t.ft>16209)||!t.Ct&&(t.ft<16180||t.ft>16211))))}function tr(e){let t;return Ge(e)?-2:(t=e._,e.total_in=e.total_out=t.st=0,e.msg="",t.P&&(e.i=1&t.P),t.ft=t.Ct?16191:16180,t.lt=false,t._t=false,t.ot=-1,t.ut=t.Ct?65536:32768,delete t.B,t.p=0,t.T=0,t.et=t.yt,t.tt=t.yt,t.vt=t.yt,t.it=true,t.Mt=-1,0)}function nr(e){let t;return Ge(e)?-2:(t=e._,t.h=0,t.m=0,t.v=0,tr(e))}function rr(e,t){let n,r;if(Ge(e))return  -2;if(r=e._,t<0){if(t<-16)return  -2;n=0,r.Ct=-16==t,t=-t;}else n=5+(t>>4),r.Ct=false,t<48&&(t&=15);let i=r.Ct?16:15;return t&&(t<8||t>i)?-2:(r.u.length>0&&r.k!=t&&(r.u=Z),r.P=n,r.k=t,nr(e))}function en(e,t){let n,r;if(!e)return  -2;e.msg="";let i=-16==t;return r=M_(e,i),e._=r,r.o=e,r.ft=i?16191:16180,n=rr(e,t),n}function ar(e){let t=e.Ct?_r:er,n={Rt:0};if(t.Ht){let r,i,f;for(r=0;r<144;)e.xt[r++]=8;for(;r<256;)e.xt[r++]=9;for(;r<280;)e.xt[r++]=7;for(;r<288;)e.xt[r++]=8;t.Jt.fill(0),f=t.Jt,t.Ut=f,i=9;let l={Rt:f},_={Rt:i},o={Rt:0};for(Le(1,e.xt,288,l,_,e.Tt,o,e.Ct),f=l.Rt,i=_.Rt,e.It=o.Rt,r=0;r<32;)e.xt[r++]=5;i=5;let a=o.Rt,u={Rt:f},c={Rt:i};n.Rt=a,Le(2,e.xt,32,u,c,e.Tt,n,e.Ct),t.Et=f.slice(a),t.Ht=false;}e.et=t.Ut,e.nt=9,e.tt=t.Et,e.rt=5,e.It=n.Rt;}function ir(e,t,n){let r=e._;if(!(r.u&&0!=r.u.length||(r.u=new p(1<<r.k),r.u)))return 1;if(0==r.h&&(r.h=1<<r.k,r.v=0,r.m=0),n>=r.h)M(r.u,0,t,t.length-r.h,r.h),r.v=0,r.m=r.h;else {let e=r.h-r.v;e>n&&(e=n),M(r.u,r.v,t,t.length-n,e),(n-=e)?(M(r.u,0,t,t.length-n,n),r.v=n,r.m=r.h):(r.v+=e,r.v==r.h&&(r.v=0),r.m<r.h&&(r.m+=e));}return 0}var S_=class extends z{constructor(){super("Need more input");}};function _n(e,t){let n,r,i,f,l,_,o,a,u,c,s,h,d,w,b,k,g,m=new p(4);if(Ge(e)||!e.next_out||!e.next_in&&0!=e.avail_in)return  -2;_=0,a=0,o=0,u=0,r=Z,i=0,f=Z,l=0,n=e._,16191==n.ft&&(n.ft=16192),I(),c=_,s=o,g=0;try{for(;;)switch(n.ft){case 16180:if(0==n.P){n.ft=16192;break}if(O(16),2&n.P&&35615==a){0==n.k&&(n.k=15),n.ct=W(0),n.ct=T(n.ct,a),C(),n.ft=16181;break}if(n.B&&(n.B.Yt=-1),!(1&n.P)||((S(8)<<8)+(a>>8))%31){e.msg="incorrect header check",n.ft=16209;break}if(8!=S(4)){e.msg="unknown compression method",n.ft=16209;break}if(D(4),k=S(4)+8,0==n.k&&(n.k=k),k>15||k>n.k){e.msg="invalid window size",n.ft=16209;break}n.ut=1<<k,n.ot=0,e.i=n.ct=se(0),n.ft=512&a?16189:16191,C();break;case 16181:if(O(16),n.ot=a,8!=(255&n.ot)){e.msg="unknown compression method",n.ft=16209;break}if(57344&n.ot){e.msg="unknown header flags set",n.ft=16209;break}n.B&&(n.B.Fe=a>>8&1),512&n.ot&&4&n.P&&(n.ct=T(n.ct,a)),C(),n.ft=16182;case 16182:O(32),n.B&&(n.B.Xe=a),512&n.ot&&4&n.P&&(n.ct=y(n.ct,a)),C(),n.ft=16183;case 16183:O(16),n.B&&(n.B.Pt=255&a,n.B.$e=a>>8),512&n.ot&&4&n.P&&(n.ct=T(n.ct,a)),C(),n.ft=16184;case 16184:1024&n.ot?(O(16),n.ht=a,n.B&&(n.B.Ke=a),512&n.ot&&4&n.P&&(n.ct=T(n.ct,a)),C()):n.B&&(n.B.Ge=Z),n.ft=16185;case 16185:if(1024&n.ot&&(h=n.ht,h>_&&(h=_),h&&(n.B&&n.B.Ge&&n.B.Bt&&(k=n.B.Ke-n.ht)<n.B.Bt&&M(n.B.Ge,k,r,i,h),512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),_-=h,i+=h,n.ht-=h),n.ht))return v();n.ht=0,n.ft=16186;case 16186:if(2048&n.ot){if(0==_)return v();h=0;do{k=r[i+h++],n.B&&n.B.Ft&&n.ht<n.B.Ft&&(n.B.Ve[n.ht++]=k);}while(k&&h<_);if(512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),_-=h,i+=h,k)return v()}else n.B&&(n.B.Ve=Z);n.ht=0,n.ft=16187;case 16187:if(4096&n.ot){if(0==_)return v();h=0;do{k=r[i+h++],n.B&&n.B.Gt&&n.ht<n.B.Gt&&(n.B.Le[n.ht++]=k);}while(k&&h<_);if(512&n.ot&&4&n.P&&(n.ct=W(n.ct,r.subarray(i,i+h),h)),_-=h,i+=h,k)return v()}else n.B&&(n.B.Le=Z);n.ft=16188;case 16188:if(512&n.ot){if(O(16),4&n.P&&a!=(65535&n.ct)){e.msg="header crc mismatch",n.ft=16209;break}C();}n.B&&(n.B.Be=n.ot>>9&1,n.B.Yt=1),e.i=n.ct=W(0),n.ft=16191;break;case 16189:O(32),e.i=n.ct=Y_(a),C(),n.ft=16190;case 16190:if(!n._t)return z(),2;e.i=n.ct=se(0),n.ft=16191;case 16191:if(5==t||6==t)return v();case 16192:if(n.lt){j(),n.ft=16206;break}switch(O(3),n.lt=!!S(1),D(1),S(2)){case 0:n.ft=16193;break;case 1:if(ar(n),n.ft=16199,6==t)return D(2),v();break;case 2:n.ft=16196;break;case 3:e.msg="invalid block type",n.ft=16209;}D(2);break;case 16193:if(j(),O(32),(65535&a)!=(a>>>16^65535)){e.msg="invalid stored block lengths",n.ft=16209;break}if(n.ht=65535&a,C(),n.ft=16194,6==t)return v();case 16194:n.ft=16195;case 16195:if(h=n.ht,h){if(h>_&&(h=_),h>o&&(h=o),0==h)return v();M(f,l,r,i,h),_-=h,i+=h,o-=h,l+=h,n.ht-=h;break}n.ft=16191;break;case 16196:if(O(14),n.bt=S(5)+257,D(5),n.kt=S(5)+1,D(5),n.wt=S(4)+4,D(4),n.bt>286||!n.Ct&&n.kt>30){e.msg=n.Ct?"too many length":"too many length or distance symbols",n.ft=16209;break}n.gt=0,n.ft=16197;case 16197:for(;n.gt<n.wt;)O(3),n.xt[pe[n.gt++]]=S(3),D(3);for(;n.gt<19;)n.xt[pe[n.gt++]]=0;n.vt=n.yt,n.et=n.tt=n.vt,n.nt=7;let c={Rt:n.vt},m={Rt:n.nt},p={Rt:0};if(g=Le(0,n.xt,19,c,m,n.Tt,p,n.Ct),n.vt=c.Rt,n.nt=m.Rt,g){e.msg="invalid code lengths set",n.ft=16209;break}n.gt=0,n.ft=16198;case 16198:for(;n.gt<n.bt+n.kt;){for(;w=n.et[S(n.nt)],!((w>>>16&255)<=u);)q();if((65535&w)<16)D(w>>>16&255),n.xt[n.gt++]=65535&w;else {if(16==(65535&w)){if(O(2+(w>>>16&255)),D(w>>>16&255),0==n.gt){e.msg="invalid bit length repeat",n.ft=16209;break}k=n.xt[n.gt-1],h=3+S(2),D(2);}else 17==(65535&w)?(O(3+(w>>>16&255)),D(w>>>16&255),k=0,h=3+S(3),D(3)):(O(7+(w>>>16&255)),D(w>>>16&255),k=0,h=11+S(7),D(7));if(n.gt+h>n.bt+n.kt){e.msg="invalid bit length repeat",n.ft=16209;break}for(;h--;)n.xt[n.gt++]=k;}}if(16209==n.ft)break;if(0==n.xt[256]){e.msg="invalid code -- missing end-of-block",n.ft=16209;break}n.vt=n.yt,n.nt=9;let A={Rt:n.vt},Q={Rt:n.nt},N={Rt:0};g=Le(1,n.xt,n.bt,A,Q,n.Tt,N,n.Ct),n.vt=A.Rt,n.nt=Q.Rt;let R=N.Rt;if(n.et=n.vt.slice(0,R),g){e.msg="invalid literal/lengths set",n.ft=16209;break}n.rt=6;let H=n.xt.subarray(n.bt,n.bt+n.kt),J={Rt:n.vt},U={Rt:n.rt},E={Rt:R};if(g=Le(2,H,n.kt,J,U,n.Tt,E,n.Ct),n.vt=J.Rt,n.rt=U.Rt,n.tt=n.vt.slice(R),g){e.msg="invalid distances set",n.ft=16209;break}if(n.ft=16199,6==t)return v();case 16199:n.ft=16200;case 16200:if(!n.Ct&&_>=6&&o>=258){z(),$t(e,s),I(),16191==n.ft&&(n.Mt=-1);break}for(n.Mt=0;w=n.et[S(n.nt)],!((w>>>16&255)<=u);)q();if(w>>>24&&!(w>>>24&240)){for(b=w;w=n.et[(65535&b)+(S((b>>>16&255)+(b>>>24))>>(b>>>16&255))],!((b>>>16&255)+(w>>>16&255)<=u);)q();D(b>>>16&255),n.Mt+=b>>>16&255;}if(D(w>>>16&255),n.Mt+=w>>>16&255,n.ht=65535&w,!(w>>>24)){n.ft=16205;break}if(w>>>24&32){n.Mt=-1,n.ft=16191;break}if(w>>>24&64){e.msg="invalid literal/length code",n.ft=16209;break}n.Ge=w>>>24&(n.Ct?31:15),n.ft=16201;case 16201:n.Ge&&(O(n.Ge),n.ht+=S(n.Ge),D(n.Ge),n.Mt+=n.Ge),n.zt=n.ht,n.ft=16202;case 16202:for(;w=n.tt[S(n.rt)],!((w>>>16&255)<=u);)q();if(!(w>>>24&240)){for(b=w;w=n.tt[(65535&b)+(S((b>>>16&255)+(b>>>24))>>(b>>>16&255))],!((b>>>16&255)+(w>>>16&255)<=u);)q();D(b>>>16&255),n.Mt+=b>>>16&255;}if(D(w>>>16&255),n.Mt+=w>>>16&255,w>>>24&64){e.msg="invalid distance code",n.ft=16209;break}n.dt=65535&w,n.Ge=w>>>24&15,n.ft=16203;case 16203:n.Ge&&(O(n.Ge),n.dt+=S(n.Ge),D(n.Ge),n.Mt+=n.Ge),n.ft=16204;case 16204:if(0==o)return v();if(h=s-o,n.dt>h){if(h=n.dt-h,h>n.m&&n.it){e.msg="invalid distance too far back",n.ft=16209;break}h>n.v?(h-=n.v,d=n.h-h):d=n.v-h,h>n.ht&&(h=n.ht),h>o&&(h=o);for(let e=0;e<h;++e)f[l]=255&n.u[d],++l,++d;}else {d=l-n.dt,h=n.ht,h>o&&(h=o);for(let e=0;e<h;++e)f[l]=f[d],++l,++d;}h>o&&(h=o),o-=h,n.ht-=h,0==n.ht&&(n.ft=16200);break;case 16205:if(0==o)return v();f[l++]=n.ht,o--,n.ft=16200;break;case 16206:if(n.P){if(O(32),s-=o,e.total_out+=s,n.st+=s,4&n.P&&s){let t=f.subarray(l-s,l);e.i=n.ct=x(n.ct,t,s);}if(s=o,4&n.P&&(n.ot?a:Y_(a)>>>0)!=n.ct){e.msg="incorrect data check",n.ft=16209;break}C();}n.ft=16207;case 16207:if(n.P&&n.ot){if(O(32),4&n.P&&a!=(4294967295&n.st)){e.msg="incorrect length check",n.ft=16209;break}C();}n.ft=16208;case 16208:return g=1,v();case 16209:return g=-3,v();case 16210:return -4;default:return -2}}catch(e){if(e instanceof S_)return v();throw e}function v(){if(z(),n.h||s!=e.avail_out&&n.ft<16209&&((n.Ct?n.ft<16208:n.ft<16206)||4!=t)){let t=s-e.avail_out;if(ir(e,e.next_out.subarray(e.next_out_index-t,e.next_out_index),t))return n.ft=16210,-4}return c-=e.avail_in,s-=e.avail_out,e.total_in+=c,e.total_out+=s,n.st+=s,4&n.P&&s&&(e.i=n.ct=x(n.ct,e.next_out.subarray(e.next_out_index-s,e.next_out_index),s)),e.t=n.T+(n.lt?64:0)+(16191==n.ft?128:0)+(16199==n.ft||16194==n.ft?256:0),(0==c&&0==s&&0==g||4==t&&0==g)&&(g=-5),g}function x(e,t,r){return n.ot?W(e,t,r):se(e,t,r)}function T(e,t){return m[0]=255&t,m[1]=t>>>8&255,W(e,m,2)>>>0}function y(e,t){return m[0]=255&t,m[1]=t>>>8&255,m[2]=t>>>16&255,m[3]=t>>>24&255,W(e,m,4)>>>0}function I(){f=e.next_out,l=e.next_out_index,o=e.avail_out,r=e.next_in,i=e.next_in_index,_=e.avail_in,a=n.p,u=n.T;}function z(){e.next_out=f,e.next_out_index=l,e.avail_out=o,e.next_in=r,e.next_in_index=i,e.avail_in=_,n.p=a,n.T=u;}function C(){a=0,u=0;}function q(){if(0==_)throw new S_;_--,a+=(255&r[i])<<u,i++,a>>>=0,u+=8;}function O(e){for(;u<e;)q();}function S(e){return a&(1<<e)-1}function D(e){a>>>=e,u-=e;}function j(){a>>>=7&u,u-=7&u;}}function tn(e){return Ge(e)?-2:0}var X_=65536,or=32768,nn="trailing data after the end of the stream",W_=class{constructor(e=16,t=X_){this.Vt=[],this.Lt=e;for(let n=0;n<O.min(e,4);n++)this.Vt.push(new p(t));}acquire(e=X_){for(let t=this.Vt.length-1;t>=0;t--){let n=this.Vt[t];if(n.length>=e)return this.Vt.splice(t,1),n}return new p(e)}release(e){this.Vt.length<this.Lt&&this.Vt.push(e);}};function rn(e){let t=new W_(32,X_),n=null;function r(){let t=e.Xt(),n=e.$t(t);if(0!=n&&0!=n)throw new z("init failed: "+n);return {o:t}}function i(e){try{t.release(e);}catch{}}return new H({start(){},transform(f,l){n||(n=r());let _=n.o;if(n.Kt){if(f.length)throw new z(nn);return}let o=0;for(;o<f.length;){let r=O.min(f.length-o,or),a=f.subarray(o,o+r);for(_.next_in=a,_.next_in_index=0,_.avail_in=a.length;_.avail_in>0;){let r=t.acquire(),f=false;try{_.next_out=r,_.next_out_index=0,_.avail_out=r.length;let i=e.en(_,0),o=r.length-_.avail_out;if(o>0){let e=!1,n={tn:r.subarray(0,o),release:()=>{e||(e=!0,t.release(r));}};f=!0,l.enqueue(n);}if(1==i){n.Kt=!0;break}if(0!=i)throw new z("process error: "+i)}finally{f||i(r);}}if(n.Kt){if(_.avail_in>0||o+r<f.length)throw new z(nn);break}o+=r;}},flush(f){if(n&&n.Kt)return;n||(n=r());let l=n.o;for(;;){let n=t.acquire(),r=false;try{l.next_out=n,l.next_out_index=0,l.avail_out=n.length;let i=e.en(l,4),_=n.length-l.avail_out;if(_>0){let e=!1,i={tn:n.subarray(0,_),release:()=>{e||(e=!0,t.release(n));}};r=!0,f.enqueue(i);}if(1==i)break;if(0!=i)throw new z("finalization error: "+i)}finally{r||i(n);}}let _=e.nn(l);if(0!=_&&0!=_)throw new z("end failed: "+_)}})}function an(){return new H({start(){},transform(e,t){try{t.enqueue(e.tn.slice(0));}finally{e.release();}},flush(){}})}var fr=new Map([["deflate",15],["gzip",31],["deflate-raw",-15]]),lr=new Map([["deflate",15],["gzip",31],["deflate-raw",-15],["deflate64-raw",-16]]);function on(e,t){let n=e.get(t);if(void 0===n)throw new TypeError(`Unsupported format: ${t}`);return n}function ur(e="deflate",t){let n=on(fr,e),r=t&&"number"==typeof t.level?t.level:-1;return rn({Xt:()=>vt(),$t:e=>kt(e,r,8,n,8,0),en:Nt,nn:P_})}function cr(e="deflate"){let t=on(lr,e);return rn({Xt:()=>Qt(),$t:e=>en(e,t),en:_n,nn:tn})}var E_=class{constructor(e="deflate",t){let n=ur(e,t);this.writable=n.writable,this.readable=n.readable.pipeThrough(an());}},g_=class{constructor(e="deflate"){let t=cr(e);this.writable=t.writable,this.readable=t.readable.pipeThrough(an());}};

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
const ERR_DUPLICATE_IMPORTED_ENTRY = "Duplicate entry filename in the imported zip file";
const ERR_INVALID_DUPLICATES = "Invalid duplicates option (must be \"throw\", \"keep-first\" or \"keep-last\")";
const ERR_ANCESTOR_ENTRY = "Entry is an ancestor of target entry";
const ERR_ROOT_DIRECTORY_NOT_MOVABLE = "Root directory cannot be moved";
const ERR_TARGET_NOT_DIRECTORY = "Target entry is not a directory";
const ERR_PARENT_NOT_DIRECTORY = "Parent entry is not a directory";
const ERR_READABLE_CONSUMED = "Readable stream already consumed";
const DUPLICATES_THROW = "throw";
const DUPLICATES_KEEP_FIRST = "keep-first";
const DUPLICATES_KEEP_LAST = "keep-last";
const DUPLICATES_VALUES = new Set([DUPLICATES_THROW, DUPLICATES_KEEP_FIRST, DUPLICATES_KEEP_LAST]);
const ERR_INVALID_PASS_THROUGH = "Invalid passThrough option (use readerOptions.passThrough or set uncompressedSize for each entry)";
const ERR_INVALID_READER_OPTIONS = "Invalid readerOptions (must be an object)";
const ERR_UNSUPPORTED_PASS_THROUGH_VALUE = "The 'compressed' passThrough option is only supported by Entry#getData() and ZipWriter#add()";
const ERR_INVALID_PASSWORDS = "Invalid passwords option (must be an array of strings)";
const ERR_INVALID_REQUEST_PASSWORD = "Invalid requestPassword option (must be a function returning a string or undefined)";
const ERR_ABORT_EXPORT = "zipjs-abort-export";
const ABORT_ERROR_NAME = "AbortError";
const EMPTY_RAW_PASSWORD = new Uint8Array(0);
const FALSE_ACCEPT_ERRORS = new Set([ERR_INVALID_CRC32, ERR_INVALID_UNCOMPRESSED_SIZE, ERR_INVALID_COMPRESSED_DATA]);

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
		const zipEntry = this;
		let parent = zipEntry.parent;
		if (parent) {
			const path = splitPath(name);
			if (path) {
				name = path.pop();
				parent = getPathParent(parent, path, zipEntry);
			}
			const existingChild = parent.getChildByName(name);
			if (existingChild && existingChild != zipEntry) {
				throw new Error(ERR_ENTRY_EXISTS);
			}
			if (parent != zipEntry.parent) {
				detach(zipEntry);
				zipEntry.parent = parent;
				parent.children.push(zipEntry);
				registerEntries(zipEntry.fs, zipEntry);
			}
		}
		zipEntry.name = name;
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
				if (isErrorObject(error) && error.message == ERR_INVALID_PASSWORD) {
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
		replaceContent(this, {
			data: blob,
			Reader: BlobReader,
			Writer: BlobWriter,
			uncompressedSize: blob.size
		});
	}

	replaceText(text) {
		replaceContent(this, {
			data: text,
			Reader: TextReader,
			Writer: TextWriter,
			uncompressedSize: getTextSize(text)
		});
	}

	replaceData64URI(dataURI) {
		replaceContent(this, {
			data: dataURI,
			Reader: Data64URIReader,
			Writer: Data64URIWriter,
			uncompressedSize: getData64URISize(dataURI)
		});
	}

	replaceUint8Array(array) {
		replaceContent(this, {
			data: array,
			Reader: Uint8ArrayReader,
			Writer: Uint8ArrayWriter,
			uncompressedSize: array.length
		});
	}

	replaceReadable(readable) {
		replaceContent(this, {
			data: null,
			Reader: getReadableReader(readable),
			Writer: null,
			uncompressedSize: UNDEFINED_VALUE
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
		return addChild(this, name, {
			data: dataURI,
			Reader: Data64URIReader,
			Writer: Data64URIWriter,
			options,
			uncompressedSize: getData64URISize(dataURI)
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
		checkPassThroughValue(options.passThrough);
		checkPasswordCandidatesOptions(options);
		const duplicates = checkDuplicatesOption(options.duplicates);
		const importedEntries = [];
		const passwordState = { known: [] };
		const entries = await zipReader.getEntries(options);
		for (const entry of entries) {
			let parent = this;
			try {
				const path = entry.filename.split("/").filter(pathPart => pathPart != "" && pathPart != ".");
				const name = path.pop();
				let skippedEntry = false;
				for (const pathPart of path) {
					const previousParent = parent;
					parent = parent.getChildByName(pathPart);
					if (parent) {
						if (!parent.directory) {
							if (duplicates == DUPLICATES_KEEP_FIRST) {
								skippedEntry = true;
								break;
							} else if (duplicates == DUPLICATES_KEEP_LAST) {
								this.fs.remove(parent);
								parent = new ZipDirectoryEntry(this.fs, pathPart, { data: null }, previousParent);
								importedEntries.push(parent);
							} else {
								throw new Error(ERR_DUPLICATE_IMPORTED_ENTRY);
							}
						}
					} else {
						parent = new ZipDirectoryEntry(this.fs, pathPart, { data: null }, previousParent);
						importedEntries.push(parent);
					}
				}
				if (skippedEntry) {
					continue;
				}
				if (!entry.directory) {
					const existingChild = parent.getChildByName(name);
					if (existingChild) {
						if (duplicates == DUPLICATES_KEEP_FIRST) {
							continue;
						} else if (duplicates == DUPLICATES_KEEP_LAST) {
							this.fs.remove(existingChild);
						} else {
							throw new Error(ERR_DUPLICATE_IMPORTED_ENTRY);
						}
					}
					importedEntries.push(addChild(parent, name, {
						data: entry,
						Reader: getZipBlobReader(Object.assign({}, options), passwordState),
						uncompressedSize: options.passThrough ? entry.compressedSize : entry.uncompressedSize,
						passThrough: options.passThrough
					}));
				} else {
					let directoryEntry = parent;
					if (name) {
						directoryEntry = parent.getChildByName(name);
						if (directoryEntry && (!directoryEntry.directory || directoryEntry.data)) {
							if (duplicates == DUPLICATES_KEEP_FIRST) {
								continue;
							} else if (duplicates == DUPLICATES_KEEP_LAST) {
								if (directoryEntry.directory) {
									directoryEntry.data = entry;
								} else {
									this.fs.remove(directoryEntry);
									directoryEntry = UNDEFINED_VALUE;
								}
							} else {
								throw new Error(ERR_DUPLICATE_IMPORTED_ENTRY);
							}
						}
						if (!directoryEntry) {
							directoryEntry = new ZipDirectoryEntry(this.fs, name, { data: null }, parent);
							importedEntries.push(directoryEntry);
						}
					}
					if (directoryEntry != this && !directoryEntry.data) {
						directoryEntry.data = entry;
					}
				}
			} catch (error) {
				importedEntries.reverse().forEach(importedEntry => this.fs.remove(importedEntry));
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
		const zipWriterProvided = Boolean(writer) && typeof writer.add == FUNCTION_TYPE;
		options = Object.assign({}, options);
		if (!zipWriterProvided && options.bufferedWrite === UNDEFINED_VALUE) {
			options.bufferedWrite = true;
		}
		const [readers] = await Promise.all([
			initReaders(zipEntry, checkReaderOptions(options.readerOptions)),
			zipWriterProvided ? UNDEFINED_VALUE : initStream(writer)
		]);
		const zipWriter = zipWriterProvided ? writer : new ZipWriter(writer, options);
		await exportZip(zipWriter, zipEntry, getTotalSize([zipEntry], getUncompressedSize), options, readers);
		if (zipWriterProvided) {
			return zipWriter;
		}
		await zipWriter.close(options.globalComment);
		return writer.getData ? writer.getData() : writer.writable;
	}

	async getExportedSize(options = {}) {
		const zipEntry = this;
		options = Object.assign({}, options);
		checkReaderOptions(options.readerOptions);
		if (options.bufferedWrite === UNDEFINED_VALUE) {
			options.bufferedWrite = true;
		}
		const children = zipEntry.getChildren({ recursive: true });
		const entries = children.filter(child => !isImplicitDirectory(child)).map(child => {
			const { name, entryOptions } = getChildEntryOptions(child, zipEntry, options);
			return { name, size: child.directory ? 0 : getDeterminedSize(child, isPassThrough(child, options)), options: entryOptions };
		});
		const writeOrderGuaranteed = !options.bufferedWrite ||
			(entries.every(entry => entry.options.keepOrder !== false) &&
				children.every(child => isImplicitDirectory(child) || !child.children.length));
		return await getEntriesSize(options, entries, writeOrderGuaranteed, options.globalComment);
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
			throw new Error(ERR_ROOT_DIRECTORY_NOT_MOVABLE);
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
					throw new Error(ERR_ANCESTOR_ENTRY);
				}
			} else {
				throw new Error(ERR_TARGET_NOT_DIRECTORY);
			}
		}
	}

	find(fullname) {
		const path = fullname.split("/");
		let node = this.root;
		for (let index = 0; node && index < path.length; index++) {
			node = node.directory ? node.getChildByName(path[index]) : UNDEFINED_VALUE;
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
		return resetAndImport(this, root => root.importBlob(blob, options));
	}

	importData64URI(dataURI, options) {
		return resetAndImport(this, root => root.importData64URI(dataURI, options));
	}

	importUint8Array(array, options) {
		return resetAndImport(this, root => root.importUint8Array(array, options));
	}

	importHttpContent(url, options) {
		return resetAndImport(this, root => root.importHttpContent(url, options));
	}

	importReadable(readable, options) {
		return resetAndImport(this, root => root.importReadable(readable, options));
	}

	importZip(reader, options) {
		return resetAndImport(this, root => root.importZip(reader, options));
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

function getZipBlobReader(options, passwordState) {
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
			const data = await readEntryData(zipBlobReader.entry, Object.assign(readerOptions, {
				checkPasswordOnly: false,
				checkOverlappingEntry: checkOverlappingEntryOnly || checkOverlappingEntry,
				checkOverlappingEntryOnly: false,
				preventClose: false
			}), passwordState);
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
		return data.startsWith("data:" + (contentType || "") + ";base64,");
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
				error.entry = child;
				error.entryId = child.id;
				error.entryName = child.getRelativeName(entry);
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
		const passThrough = isPassThrough(child, options);
		const lastModDateOverride = childOptions.lastModDate === UNDEFINED_VALUE ? options.lastModDate : childOptions.lastModDate;
		({ entryOptions: zipEntryMetadata, passThroughOptions } = getSourceEntryOptions(child.data, passThrough, lastModDateOverride));
		if (passThrough) {
			passThroughOptions.passThrough = true;
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
	if (readerOptions) {
		checkPassThroughValue(readerOptions.passThrough);
		checkPasswordCandidatesOptions(readerOptions);
	}
	return readerOptions;
}

function checkPasswordCandidatesOptions(options) {
	const { passwords, requestPassword } = options;
	if (passwords && (!Array.isArray(passwords) || passwords.some(password => typeof password != STRING_TYPE))) {
		throw new Error(ERR_INVALID_PASSWORDS);
	}
	if (requestPassword && typeof requestPassword != FUNCTION_TYPE) {
		throw new Error(ERR_INVALID_REQUEST_PASSWORD);
	}
}

async function readEntryData(entry, options, passwordState) {
	checkPasswordCandidatesOptions(options);
	const { passwords, requestPassword, signal } = options;
	options = Object.assign({}, options);
	delete options.passwords;
	delete options.requestPassword;
	if (!entry.encrypted || options.passThrough || (!passwords && !requestPassword)) {
		return entry.getData(new BlobWriter(), options);
	}
	const tried = new Set();
	let error;
	while (true) {
		for (const candidate of getPasswordCandidates(options, passwordState, passwords)) {
			if (!tried.has(candidate.key)) {
				const result = await tryPasswordCandidate(candidate);
				if (result.done) {
					return result.data;
				}
				error = result.error;
			}
		}
		if (!requestPassword) {
			break;
		}
		if (passwordState.pendingPrompt) {
			await passwordState.pendingPrompt;
			continue;
		}
		let release;
		passwordState.pendingPrompt = new Promise(resolve => release = resolve);
		try {
			const answer = await requestPassword(entry, error);
			if (answer === UNDEFINED_VALUE || answer === null) {
				break;
			}
			// deno-lint-ignore valid-typeof
			if (typeof answer != STRING_TYPE) {
				throw new Error(ERR_INVALID_REQUEST_PASSWORD);
			}
			const result = await tryPasswordCandidate(getPasswordCandidate(answer));
			if (result.done) {
				return result.data;
			}
			error = result.error;
		} finally {
			passwordState.pendingPrompt = UNDEFINED_VALUE;
			release();
		}
	}
	if (!tried.size) {
		throw new Error(ERR_ENCRYPTED);
	}
	const passwordError = new Error(ERR_INVALID_PASSWORD);
	passwordError.cause = error;
	throw passwordError;

	async function tryPasswordCandidate(candidate) {
		tried.add(candidate.key);
		const candidateOptions = Object.assign({}, options, candidate.options);
		if (entry.zipCrypto) {
			candidateOptions.checkCrc32 = true;
			try {
				await entry.getData(null, Object.assign({}, candidateOptions, { checkPasswordOnly: true }));
			} catch (probeError) {
				if (isInvalidPasswordError(probeError)) {
					return { done: false, error: probeError };
				}
				throw probeError;
			}
		}
		try {
			const data = await entry.getData(new BlobWriter(), candidateOptions);
			rememberPassword(passwordState, candidate);
			return { done: true, data };
		} catch (readError) {
			if (isAbortError(readError, signal) || !isWrongPasswordError(readError, entry)) {
				throw readError;
			}
			return { done: false, error: readError };
		}
	}
}

function isInvalidPasswordError(error) {
	return isErrorObject(error) && error.message == ERR_INVALID_PASSWORD;
}

function isWrongPasswordError(error, entry) {
	return isInvalidPasswordError(error) || (entry.zipCrypto && isErrorObject(error) && FALSE_ACCEPT_ERRORS.has(error.message));
}

function isAbortError(error, signal) {
	return Boolean(signal && signal.aborted) || (isErrorObject(error) && error.name == ABORT_ERROR_NAME);
}

function getPasswordCandidates(options, passwordState, passwords) {
	const candidates = [];
	const { password, rawPassword } = options;
	if (rawPassword && rawPassword.length) {
		candidates.push({ key: rawPassword, options: { password: "", rawPassword } });
	}
	if (password) {
		candidates.push(getPasswordCandidate(password));
	}
	candidates.push(...passwordState.known);
	if (passwords) {
		candidates.push(...passwords.filter(password => password).map(getPasswordCandidate));
	}
	return candidates;
}

function getPasswordCandidate(password) {
	return { key: password, options: { password, rawPassword: EMPTY_RAW_PASSWORD } };
}

function rememberPassword(passwordState, candidate) {
	const { known } = passwordState;
	const index = known.findIndex(knownCandidate => knownCandidate.key === candidate.key);
	if (index != -1) {
		known.splice(index, 1);
	}
	known.unshift(candidate);
}

function checkPassThroughValue(passThrough) {
	if (checkPassThroughOption(passThrough) === PASS_THROUGH_COMPRESSED) {
		throw new Error(ERR_UNSUPPORTED_PASS_THROUGH_VALUE);
	}
}

function replaceContent(zipEntry, params) {
	const { uncompressedSize } = params;
	Object.assign(zipEntry, params, {
		reader: null,
		passThrough: UNDEFINED_VALUE,
		uncompressedSize: uncompressedSize === UNDEFINED_VALUE ? 0 : uncompressedSize,
		undeterminedSize: uncompressedSize === UNDEFINED_VALUE
	});
}

function getData64URISize(dataURI) {
	let dataEnd = dataURI.length;
	while (dataURI.charAt(dataEnd - 1) == "=") {
		dataEnd--;
	}
	const dataStart = dataURI.indexOf(",") + 1;
	return Math.floor((dataEnd - dataStart) * 0.75);
}

function isPassThrough(child, options) {
	const { readerOptions } = options;
	return Boolean(!child.directory && (child.passThrough || (readerOptions && readerOptions.passThrough)));
}

function isImplicitDirectory(child) {
	return child.directory && child.data === null;
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
	checkPassThroughValue(options.passThrough);
	checkPasswordCandidatesOptions(options);
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
			throwIfAborted(signal);
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

function resetAndImport(fs, importFunction) {
	const { entries, entryIdCounter, root } = fs;
	resetFS(fs);
	return importFunction(fs.root).catch(error => {
		Object.assign(fs, { entries, entryIdCounter, root });
		throw error;
	});
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
		const path = splitPath(name);
		if (path) {
			name = path.pop();
			parent = getPathParent(parent, path);
		}
		return directory ? new ZipDirectoryEntry(parent.fs, name, params, parent) : new ZipFileEntry(parent.fs, name, params, parent);
	} else {
		throw new Error(ERR_PARENT_NOT_DIRECTORY);
	}
}

function checkDuplicatesOption(duplicates) {
	if (duplicates === UNDEFINED_VALUE) {
		return DUPLICATES_THROW;
	} else if (DUPLICATES_VALUES.has(duplicates)) {
		return duplicates;
	} else {
		throw new Error(ERR_INVALID_DUPLICATES);
	}
}

function splitPath(name) {
	if (name.includes("/")) {
		const path = name.split("/").filter(pathPart => pathPart != "" && pathPart != ".");
		if (path.length) {
			return path;
		}
	}
}

function getPathParent(parent, path, movedEntry) {
	path.forEach(pathPart => {
		const previousParent = parent;
		parent = parent.getChildByName(pathPart);
		if (parent) {
			if (!parent.directory) {
				throw new Error(ERR_ENTRY_EXISTS);
			}
			if (movedEntry && (parent == movedEntry || parent.isDescendantOf(movedEntry))) {
				throw new Error(ERR_ANCESTOR_ENTRY);
			}
		} else {
			parent = new ZipDirectoryEntry(previousParent.fs, pathPart, { data: null }, previousParent);
		}
	});
	return parent;
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


F(setDefaultConfiguration);

exports.BlobReader = BlobReader;
exports.BlobWriter = BlobWriter;
exports.Data64URIReader = Data64URIReader;
exports.Data64URIWriter = Data64URIWriter;
exports.ERR_ABORTED = ERR_ABORTED;
exports.ERR_AMBIGUOUS_ARCHIVE = ERR_AMBIGUOUS_ARCHIVE;
exports.ERR_ANCESTOR_ENTRY = ERR_ANCESTOR_ENTRY;
exports.ERR_BAD_FORMAT = ERR_BAD_FORMAT;
exports.ERR_CENTRAL_DIRECTORY_NOT_FOUND = ERR_CENTRAL_DIRECTORY_NOT_FOUND;
exports.ERR_CODEC_OUT_OF_MEMORY = ERR_CODEC_OUT_OF_MEMORY;
exports.ERR_DUPLICATED_NAME = ERR_DUPLICATED_NAME;
exports.ERR_DUPLICATE_IMPORTED_ENTRY = ERR_DUPLICATE_IMPORTED_ENTRY;
exports.ERR_ENCRYPTED = ERR_ENCRYPTED;
exports.ERR_ENCRYPTED_CENTRAL_DIRECTORY = ERR_ENCRYPTED_CENTRAL_DIRECTORY;
exports.ERR_ENTRY_DATA_OUT_OF_BOUNDS = ERR_ENTRY_DATA_OUT_OF_BOUNDS;
exports.ERR_ENTRY_EXISTS = ERR_ENTRY_EXISTS;
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
exports.ERR_INVALID_DUPLICATES = ERR_INVALID_DUPLICATES;
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
exports.ERR_INVALID_PASSWORDS = ERR_INVALID_PASSWORDS;
exports.ERR_INVALID_PASSWORD_TYPE = ERR_INVALID_PASSWORD_TYPE;
exports.ERR_INVALID_PASS_THROUGH = ERR_INVALID_PASS_THROUGH;
exports.ERR_INVALID_PASS_THROUGH_VALUE = ERR_INVALID_PASS_THROUGH_VALUE;
exports.ERR_INVALID_READER = ERR_INVALID_READER;
exports.ERR_INVALID_READER_OPTIONS = ERR_INVALID_READER_OPTIONS;
exports.ERR_INVALID_REQUEST_PASSWORD = ERR_INVALID_REQUEST_PASSWORD;
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
exports.ERR_PARENT_NOT_DIRECTORY = ERR_PARENT_NOT_DIRECTORY;
exports.ERR_READABLE_CONSUMED = ERR_READABLE_CONSUMED;
exports.ERR_RESERVED_COMPRESSION_METHOD = ERR_RESERVED_COMPRESSION_METHOD;
exports.ERR_ROOT_DIRECTORY_NOT_MOVABLE = ERR_ROOT_DIRECTORY_NOT_MOVABLE;
exports.ERR_SPLIT_ZIP_FILE = ERR_SPLIT_ZIP_FILE;
exports.ERR_TARGET_NOT_DIRECTORY = ERR_TARGET_NOT_DIRECTORY;
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
exports.ERR_UNSUPPORTED_PASS_THROUGH_VALUE = ERR_UNSUPPORTED_PASS_THROUGH_VALUE;
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
exports.getRegisteredCodecs = getRegisteredCodecs;
exports.getSupportedCompressionMethods = getSupportedCompressionMethods;
exports.isZipFile = isZipFile;
exports.registerCodec = registerCodec;
exports.resetConfiguration = resetConfiguration;
exports.terminateWorkers = terminateWorkers;
exports.unregisterCodec = unregisterCodec;
