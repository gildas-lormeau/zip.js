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

const t$1=new Uint8Array(288);t$1.fill(8,0,144),t$1.fill(9,144,256),t$1.fill(7,256,280),t$1.fill(8,280,288),new Uint8Array(30).fill(5);const n$1="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e$1=t=>t({workerURI:t=>{const e="text/javascript";let s='!function(t){"function"==typeof define&&define.amd?define(t):t()}(function(){"use strict";const{Array:t,Object:n,Number:e,Math:o,Error:s,Uint8Array:r,Uint16Array:c,Uint32Array:i,Int32Array:a,Map:f,DataView:u,Promise:w,TextEncoder:l,crypto:h,postMessage:p,TransformStream:d,ReadableStream:y,WritableStream:m,CompressionStream:S,DecompressionStream:g}=self,v=void 0,b="undefined",z="function",k=new r,C=[[],[],[],[],[],[],[],[]];for(let t=0;t<256;t++){let n=t;for(let t=0;t<8;t++)n=1&n?n>>>1^3988292384:n>>>1;C[0][t]=n}for(let t=0;t<256;t++)for(let n=1;n<8;n++){const e=C[n-1][t];C[n][t]=e>>>8^C[0][255&e]}const[I,A,x,M,P,D,F,E]=C;class R{constructor(t){this.o=t||-1}append(t){let n=0|this.o;const e=0|t.length;let o=0;if(e>=8&&t.buffer){const s=new u(t.buffer,t.byteOffset,e),r=e-8;for(;o<=r;o+=8){const t=n^s.getInt32(o,!0),e=s.getInt32(o+4,!0);n=E[255&t]^F[t>>>8&255]^D[t>>>16&255]^P[t>>>24&255]^M[255&e]^x[e>>>8&255]^A[e>>>16&255]^I[e>>>24&255]}}for(;o<e;o++)n=n>>>8^I[255&(n^t[o])];this.o=n}get(){return~this.o}}class U extends d{constructor(){let t;const n=new R;super({transform(t,e){n.append(t),e.enqueue(t)},flush(){const e=new r(4);new u(e.buffer).setUint32(0,n.get()),t.value=e}}),t=this}}function B(t,n){const e=new r(t.length+n.length);return e.set(t),e.set(n,t.length),e}function T(t){return new u(t.buffer,t.byteOffset,t.byteLength)}const V=64,W=20,j=new r([128]),K=new r(1),O=new a([1732584193,4023233417,2562383102,271733878,3285377520]),H=new r(256),L=new a(256),N=new a(256),q=new a(256),G=new a(256);let J=!1;function Q(t,n){!function(){if(!J){let t=1,n=1;do{t=255&(t^t<<1^(128&t?27:0)),n=255&(n^n<<1),n=255&(n^n<<2),n=255&(n^n<<4),128&n&&(n^=9),H[t]=255&(n^(n<<1|n>>7)^(n<<2|n>>6)^(n<<3|n>>5)^(n<<4|n>>4)^99)}while(1!=t);H[0]=99;for(let t=0;t<256;t++){const n=H[t],e=$(n),o=e<<24|n<<16|n<<8|e^n;L[t]=o,N[t]=o>>>8|o<<24,q[t]=o>>>16|o<<16,G[t]=o>>>24|o<<8}J=!0}}();const e=new a(60),o=function(t,n){const e=t.length>>2,o=e+6,s=4*(o+1);let r=1;for(let o=0;o<e;o++)n[o]=t[4*o]<<24|t[4*o+1]<<16|t[4*o+2]<<8|t[4*o+3];for(let t=e;t<s;t++){let o=n[t-1];t%e==0?(o=Y(o<<8|o>>>24)^r<<24,r=$(r)):e>6&&t%e==4&&(o=Y(o)),n[t]=n[t-e]^o}return o}(t,e),s=new a(4),r=X(n);let c=0,i=0,f=0,w=0;return{process(t,n){n&&r.update(t,0,t.length),function(t){const n=new u(t.buffer,t.byteOffset,t.byteLength),e=t.length;let o=0;for(;o+16<=e;o+=16)l(),n.setInt32(o,n.getInt32(o)^s[0]),n.setInt32(o+4,n.getInt32(o+4)^s[1]),n.setInt32(o+8,n.getInt32(o+8)^s[2]),n.setInt32(o+12,n.getInt32(o+12)^s[3]);if(o<e){l();for(let n=0;o<e;o++,n++)t[o]^=s[n>>2]>>>24-8*(3&n)}}(t),n||r.update(t,0,t.length)},digest:()=>r.digest()};function l(){c=c+1|0,c||(i=i+1|0,i||(f=f+1|0,f||(w=w+1|0)));let t=Z(c)^e[0],n=Z(i)^e[1],r=Z(f)^e[2],a=Z(w)^e[3],u=L[t>>>24]^N[n>>>16&255]^q[r>>>8&255]^G[255&a]^e[4],l=L[n>>>24]^N[r>>>16&255]^q[a>>>8&255]^G[255&t]^e[5],h=L[r>>>24]^N[a>>>16&255]^q[t>>>8&255]^G[255&n]^e[6],p=L[a>>>24]^N[t>>>16&255]^q[n>>>8&255]^G[255&r]^e[7];t=L[u>>>24]^N[l>>>16&255]^q[h>>>8&255]^G[255&p]^e[8],n=L[l>>>24]^N[h>>>16&255]^q[p>>>8&255]^G[255&u]^e[9],r=L[h>>>24]^N[p>>>16&255]^q[u>>>8&255]^G[255&l]^e[10],a=L[p>>>24]^N[u>>>16&255]^q[l>>>8&255]^G[255&h]^e[11],u=L[t>>>24]^N[n>>>16&255]^q[r>>>8&255]^G[255&a]^e[12],l=L[n>>>24]^N[r>>>16&255]^q[a>>>8&255]^G[255&t]^e[13],h=L[r>>>24]^N[a>>>16&255]^q[t>>>8&255]^G[255&n]^e[14],p=L[a>>>24]^N[t>>>16&255]^q[n>>>8&255]^G[255&r]^e[15],t=L[u>>>24]^N[l>>>16&255]^q[h>>>8&255]^G[255&p]^e[16],n=L[l>>>24]^N[h>>>16&255]^q[p>>>8&255]^G[255&u]^e[17],r=L[h>>>24]^N[p>>>16&255]^q[u>>>8&255]^G[255&l]^e[18],a=L[p>>>24]^N[u>>>16&255]^q[l>>>8&255]^G[255&h]^e[19],u=L[t>>>24]^N[n>>>16&255]^q[r>>>8&255]^G[255&a]^e[20],l=L[n>>>24]^N[r>>>16&255]^q[a>>>8&255]^G[255&t]^e[21],h=L[r>>>24]^N[a>>>16&255]^q[t>>>8&255]^G[255&n]^e[22],p=L[a>>>24]^N[t>>>16&255]^q[n>>>8&255]^G[255&r]^e[23],t=L[u>>>24]^N[l>>>16&255]^q[h>>>8&255]^G[255&p]^e[24],n=L[l>>>24]^N[h>>>16&255]^q[p>>>8&255]^G[255&u]^e[25],r=L[h>>>24]^N[p>>>16&255]^q[u>>>8&255]^G[255&l]^e[26],a=L[p>>>24]^N[u>>>16&255]^q[l>>>8&255]^G[255&h]^e[27],u=L[t>>>24]^N[n>>>16&255]^q[r>>>8&255]^G[255&a]^e[28],l=L[n>>>24]^N[r>>>16&255]^q[a>>>8&255]^G[255&t]^e[29],h=L[r>>>24]^N[a>>>16&255]^q[t>>>8&255]^G[255&n]^e[30],p=L[a>>>24]^N[t>>>16&255]^q[n>>>8&255]^G[255&r]^e[31],t=L[u>>>24]^N[l>>>16&255]^q[h>>>8&255]^G[255&p]^e[32],n=L[l>>>24]^N[h>>>16&255]^q[p>>>8&255]^G[255&u]^e[33],r=L[h>>>24]^N[p>>>16&255]^q[u>>>8&255]^G[255&l]^e[34],a=L[p>>>24]^N[u>>>16&255]^q[l>>>8&255]^G[255&h]^e[35],u=L[t>>>24]^N[n>>>16&255]^q[r>>>8&255]^G[255&a]^e[36],l=L[n>>>24]^N[r>>>16&255]^q[a>>>8&255]^G[255&t]^e[37],h=L[r>>>24]^N[a>>>16&255]^q[t>>>8&255]^G[255&n]^e[38],p=L[a>>>24]^N[t>>>16&255]^q[n>>>8&255]^G[255&r]^e[39];let d=40;o>10&&(t=L[u>>>24]^N[l>>>16&255]^q[h>>>8&255]^G[255&p]^e[40],n=L[l>>>24]^N[h>>>16&255]^q[p>>>8&255]^G[255&u]^e[41],r=L[h>>>24]^N[p>>>16&255]^q[u>>>8&255]^G[255&l]^e[42],a=L[p>>>24]^N[u>>>16&255]^q[l>>>8&255]^G[255&h]^e[43],u=L[t>>>24]^N[n>>>16&255]^q[r>>>8&255]^G[255&a]^e[44],l=L[n>>>24]^N[r>>>16&255]^q[a>>>8&255]^G[255&t]^e[45],h=L[r>>>24]^N[a>>>16&255]^q[t>>>8&255]^G[255&n]^e[46],p=L[a>>>24]^N[t>>>16&255]^q[n>>>8&255]^G[255&r]^e[47],d=48),o>12&&(t=L[u>>>24]^N[l>>>16&255]^q[h>>>8&255]^G[255&p]^e[48],n=L[l>>>24]^N[h>>>16&255]^q[p>>>8&255]^G[255&u]^e[49],r=L[h>>>24]^N[p>>>16&255]^q[u>>>8&255]^G[255&l]^e[50],a=L[p>>>24]^N[u>>>16&255]^q[l>>>8&255]^G[255&h]^e[51],u=L[t>>>24]^N[n>>>16&255]^q[r>>>8&255]^G[255&a]^e[52],l=L[n>>>24]^N[r>>>16&255]^q[a>>>8&255]^G[255&t]^e[53],h=L[r>>>24]^N[a>>>16&255]^q[t>>>8&255]^G[255&n]^e[54],p=L[a>>>24]^N[t>>>16&255]^q[n>>>8&255]^G[255&r]^e[55],d=56),s[0]=(H[u>>>24]<<24|H[l>>>16&255]<<16|H[h>>>8&255]<<8|H[255&p])^e[d],s[1]=(H[l>>>24]<<24|H[h>>>16&255]<<16|H[p>>>8&255]<<8|H[255&u])^e[d+1],s[2]=(H[h>>>24]<<24|H[p>>>16&255]<<16|H[u>>>8&255]<<8|H[255&l])^e[d+2],s[3]=(H[p>>>24]<<24|H[u>>>16&255]<<16|H[l>>>8&255]<<8|H[255&h])^e[d+3]}}function X(t){const n=function(){const t=new a(O),n=new a(16),e=new r(V),s=new u(e.buffer),c=new r(8);let i=0,f=0;return{update:w,digest:function(){const n=8*f,e=o.floor(n/4294967296),s=n>>>0;for(w(j,0,1);56!=i;)w(K,0,1);c[0]=e>>>24,c[1]=e>>>16,c[2]=e>>>8,c[3]=e,c[4]=s>>>24,c[5]=s>>>16,c[6]=s>>>8,c[7]=s,w(c,0,8);const a=new r(W),l=new u(a.buffer);for(let n=0;n<t.length;n++)l.setInt32(4*n,t[n]);return t.set(O),i=0,f=0,a}};function w(t,n,o){const r=n+o;if(f+=o,i){for(;n<r&&i<V;)e[i++]=t[n++];i==V&&(l(s,0),i=0)}if(n+V<=r){const e=new u(t.buffer,t.byteOffset,t.byteLength);for(;n+V<=r;n+=V)l(e,n)}for(;n<r;)e[i++]=t[n++]}function l(e,o){for(let t=0;t<16;t++)n[t]=e.getInt32(o+4*t);let s,r=t[0],c=t[1],i=t[2],a=t[3],f=t[4];for(let t=0;t<15;t+=5)f=(r<<5|r>>>27)+((i^a)&c^a)+f+1518500249+n[t]|0,c=c<<30|c>>>2,a=(f<<5|f>>>27)+((c^i)&r^i)+a+1518500249+n[t+1]|0,r=r<<30|r>>>2,i=(a<<5|a>>>27)+((r^c)&f^c)+i+1518500249+n[t+2]|0,f=f<<30|f>>>2,c=(i<<5|i>>>27)+((f^r)&a^r)+c+1518500249+n[t+3]|0,a=a<<30|a>>>2,r=(c<<5|c>>>27)+((a^f)&i^f)+r+1518500249+n[t+4]|0,i=i<<30|i>>>2;f=(r<<5|r>>>27)+((i^a)&c^a)+f+1518500249+n[15]|0,c=c<<30|c>>>2,s=n[13]^n[8]^n[2]^n[0],s=s<<1|s>>>31,n[0]=s,a=(f<<5|f>>>27)+((c^i)&r^i)+a+1518500249+s|0,r=r<<30|r>>>2,s=n[14]^n[9]^n[3]^n[1],s=s<<1|s>>>31,n[1]=s,i=(a<<5|a>>>27)+((r^c)&f^c)+i+1518500249+s|0,f=f<<30|f>>>2,s=n[15]^n[10]^n[4]^n[2],s=s<<1|s>>>31,n[2]=s,c=(i<<5|i>>>27)+((f^r)&a^r)+c+1518500249+s|0,a=a<<30|a>>>2,s=n[0]^n[11]^n[5]^n[3],s=s<<1|s>>>31,n[3]=s,r=(c<<5|c>>>27)+((a^f)&i^f)+r+1518500249+s|0,i=i<<30|i>>>2;for(let t=20;t<40;t+=5)s=n[t-3&15]^n[t-8&15]^n[t-14&15]^n[15&t],s=s<<1|s>>>31,n[15&t]=s,f=(r<<5|r>>>27)+(c^i^a)+f+1859775393+s|0,c=c<<30|c>>>2,s=n[t-2&15]^n[t-7&15]^n[t-13&15]^n[t+1&15],s=s<<1|s>>>31,n[t+1&15]=s,a=(f<<5|f>>>27)+(r^c^i)+a+1859775393+s|0,r=r<<30|r>>>2,s=n[t-1&15]^n[t-6&15]^n[t-12&15]^n[t+2&15],s=s<<1|s>>>31,n[t+2&15]=s,i=(a<<5|a>>>27)+(f^r^c)+i+1859775393+s|0,f=f<<30|f>>>2,s=n[15&t]^n[t-5&15]^n[t-11&15]^n[t+3&15],s=s<<1|s>>>31,n[t+3&15]=s,c=(i<<5|i>>>27)+(a^f^r)+c+1859775393+s|0,a=a<<30|a>>>2,s=n[t+1&15]^n[t-4&15]^n[t-10&15]^n[t+4&15],s=s<<1|s>>>31,n[t+4&15]=s,r=(c<<5|c>>>27)+(i^a^f)+r+1859775393+s|0,i=i<<30|i>>>2;for(let t=40;t<60;t+=5)s=n[t-3&15]^n[t-8&15]^n[t-14&15]^n[15&t],s=s<<1|s>>>31,n[15&t]=s,f=(r<<5|r>>>27)+(c&i|(c|i)&a)+f+2400959708+s|0,c=c<<30|c>>>2,s=n[t-2&15]^n[t-7&15]^n[t-13&15]^n[t+1&15],s=s<<1|s>>>31,n[t+1&15]=s,a=(f<<5|f>>>27)+(r&c|(r|c)&i)+a+2400959708+s|0,r=r<<30|r>>>2,s=n[t-1&15]^n[t-6&15]^n[t-12&15]^n[t+2&15],s=s<<1|s>>>31,n[t+2&15]=s,i=(a<<5|a>>>27)+(f&r|(f|r)&c)+i+2400959708+s|0,f=f<<30|f>>>2,s=n[15&t]^n[t-5&15]^n[t-11&15]^n[t+3&15],s=s<<1|s>>>31,n[t+3&15]=s,c=(i<<5|i>>>27)+(a&f|(a|f)&r)+c+2400959708+s|0,a=a<<30|a>>>2,s=n[t+1&15]^n[t-4&15]^n[t-10&15]^n[t+4&15],s=s<<1|s>>>31,n[t+4&15]=s,r=(c<<5|c>>>27)+(i&a|(i|a)&f)+r+2400959708+s|0,i=i<<30|i>>>2;for(let t=60;t<80;t+=5)s=n[t-3&15]^n[t-8&15]^n[t-14&15]^n[15&t],s=s<<1|s>>>31,n[15&t]=s,f=(r<<5|r>>>27)+(c^i^a)+f+3395469782+s|0,c=c<<30|c>>>2,s=n[t-2&15]^n[t-7&15]^n[t-13&15]^n[t+1&15],s=s<<1|s>>>31,n[t+1&15]=s,a=(f<<5|f>>>27)+(r^c^i)+a+3395469782+s|0,r=r<<30|r>>>2,s=n[t-1&15]^n[t-6&15]^n[t-12&15]^n[t+2&15],s=s<<1|s>>>31,n[t+2&15]=s,i=(a<<5|a>>>27)+(f^r^c)+i+3395469782+s|0,f=f<<30|f>>>2,s=n[15&t]^n[t-5&15]^n[t-11&15]^n[t+3&15],s=s<<1|s>>>31,n[t+3&15]=s,c=(i<<5|i>>>27)+(a^f^r)+c+3395469782+s|0,a=a<<30|a>>>2,s=n[t+1&15]^n[t-4&15]^n[t-10&15]^n[t+4&15],s=s<<1|s>>>31,n[t+4&15]=s,r=(c<<5|c>>>27)+(i^a^f)+r+3395469782+s|0,i=i<<30|i>>>2;t[0]=t[0]+r|0,t[1]=t[1]+c|0,t[2]=t[2]+i|0,t[3]=t[3]+a|0,t[4]=t[4]+f|0}}(),e=new r(V),s=new r(V);t.length>V&&(n.update(t,0,t.length),t=n.digest());for(let n=0;n<V;n++){const o=n<t.length?t[n]:0;e[n]=54^o,s[n]=92^o}return n.update(e,0,V),{update(t,e,o){n.update(t,e,o)},digest(){const t=n.digest();n.update(s,0,V),n.update(t,0,W);const o=n.digest();return n.update(e,0,V),o}}}function Y(t){return H[t>>>24]<<24|H[t>>>16&255]<<16|H[t>>>8&255]<<8|H[255&t]}function Z(t){return t<<24|(65280&t)<<8|t>>>8&65280|t>>>24}function $(t){return 255&(t<<1^27*(t>>7))}const _=typeof h!=b&&typeof h.getRandomValues==z,tt="Invalid password",nt="zipjs-abort-check-password";function et(t){if(_)return h.getRandomValues(t);throw new s("Crypto API not supported")}const ot={name:"PBKDF2"},st=n.assign({hash:{name:"HMAC"}},ot),rt=n.assign({iterations:1e3,hash:{name:"SHA-1"}},ot),ct=["deriveBits"],it=[8,12,16],at=[16,24,32],ft=10,ut=typeof h!=b,wt=ut&&h.subtle;let lt=ut&&typeof wt!=b&&typeof wt.importKey==z&&typeof wt.deriveBits==z,ht=Q;class pt extends d{constructor({password:t,rawPassword:n,encryptionStrength:e,checkPasswordOnly:o,checkAuthenticationCode:c=!0}){super({start(){yt(this,t,n,e)},async transform(t,n){const e=this,{password:c,strength:i,l:a,ready:f}=e;c?(await async function(t,n,e,o){const r=await gt(t,n,e,bt(o,0,it[n])),c=bt(o,it[n]);if(r[0]!=c[0]||r[1]!=c[1])throw St(t),new s(tt)}(e,i,c,bt(t,0,it[i]+2)),t=bt(t,it[i]+2),o?(St(e),n.error(new s(nt))):a()):await f;const u=new r(t.length-ft-(t.length-ft)%16);n.enqueue(mt(e,t,u,0,ft,!0))},async flush(t){const{h:n,m:e,ready:o}=this;if(n){await o;const i=bt(e,e.length-ft),a=new r(bt(e,0,e.length-ft));n.process(a,!0);const f=n.digest();let u=e.length<ft?1:0;for(let t=0;t<ft;t++)u|=f[t]^i[t];if(u&&c)throw new s("Invalid authentication code");t.enqueue(a)}},cancel(){St(this)}})}}class dt extends d{constructor({password:t,rawPassword:n,encryptionStrength:e}){super({start(){yt(this,t,n,e)},async transform(t,n){const e=this,{password:o,strength:s,l:c,ready:i}=e;let a=k;o?(a=await async function(t,n,e){const o=et(new r(it[n]));return B(o,await gt(t,n,e,o))}(e,s,o),c()):await i;const f=new r(a.length+t.length-t.length%16);f.set(a,0),n.enqueue(mt(e,t,f,a.length,0,!1))},async flush(t){const{h:n,m:e,ready:o}=this;if(n){await o;const s=new r(e);n.process(s,!1);const c=bt(n.digest(),0,ft);t.enqueue(B(s,c))}},cancel(){St(this)}})}}function yt(t,e,o,s){n.assign(t,{ready:new w(n=>t.l=n),password:vt(e,o),strength:s-1,m:k})}function mt(t,n,e,o,s,c){const{h:i,m:a}=t;a.length&&(n=B(a,n));const f=n.length-s,u=f-f%16;if(e=function(t,n){if(n&&n>t.length){const e=t;(t=new r(n)).set(e,0)}return t}(e,o+u),u){const t=bt(e,o,o+u);t.set(bt(n,0,u)),i.process(t,c)}return t.m=bt(n,u),e}function St({h:t}){t&&t.dispose&&t.dispose()}async function gt(t,e,s,c){t.password=null;const i=at[e],a=await async function(t,e,s){if(lt)try{const o=await wt.importKey("raw",t,st,!1,ct);return new r(await wt.deriveBits(n.assign({salt:e},rt),o,8*s))}catch{lt=!1}return function(t,n,e,s){const c=X(t),i=new r(s),a=new r(n.length+4),f=new u(a.buffer);a.set(n);for(let t=1,e=0;e<s;t++,e+=W){f.setUint32(n.length,t),c.update(a,0,a.length);let r=c.digest();const u=r.slice();for(let t=1;t<1e3;t++){c.update(r,0,W),r=c.digest();for(let t=0;t<W;t++)u[t]^=r[t]}i.set(u.subarray(0,o.min(W,s-e)),e)}return i}(t,e,0,s)}(s,c,2*i+2);return t.h=ht(bt(a,0,i),bt(a,i,2*i)),bt(a,2*i)}function vt(t,n){return n===v?function(t){if(typeof l==b){t=unescape(encodeURIComponent(t));const n=new r(t.length);for(let e=0;e<n.length;e++)n[e]=t.charCodeAt(e);return n}return(new l).encode(t)}(t):n}function bt(t,n,e){return t.subarray(n,e)}class zt extends d{constructor({password:t,rawPassword:n,passwordVerification:e,checkPasswordOnly:o}){super({start(){Ct(this,t,n,e)},transform(t,n){const e=this;if(e.password||e.rawPassword){const n=It(e,t.subarray(0,12));if(e.password=e.rawPassword=null,0!=(n[11]^e.passwordVerification))throw new s(tt);t=t.subarray(12)}o?n.error(new s(nt)):n.enqueue(It(e,t))}})}}class kt extends d{constructor({password:t,rawPassword:n,passwordVerification:e}){super({start(){Ct(this,t,n,e)},transform(t,n){const e=this;let o,s;if(e.password||e.rawPassword){e.password=e.rawPassword=null;const n=et(new r(12));n[11]=e.passwordVerification,o=new r(t.length+n.length),o.set(At(e,n),0),s=12}else o=new r(t.length),s=0;o.set(At(e,t),s),n.enqueue(o)}})}}function Ct(t,e,o,s){n.assign(t,{password:e,rawPassword:o,passwordVerification:s}),function(t,e,o){const s=[305419896,591751049,878082192];if(n.assign(t,{keys:s,S:new R(s[0]),v:new R(s[2])}),o)for(let n=0;n<o.length;n++)xt(t,o[n]);else for(let n=0;n<e.length;n++)xt(t,e.charCodeAt(n))}(t,e,o)}function It(t,n){const e=new r(n.length);for(let o=0;o<n.length;o++)e[o]=Mt(t)^n[o],xt(t,e[o]);return e}function At(t,n){const e=new r(n.length);for(let o=0;o<n.length;o++)e[o]=Mt(t)^n[o],xt(t,n[o]);return e}function xt(t,n){let[,e]=t.keys;t.S.append([n]);const s=~t.S.get();e=Dt(o.imul(Dt(e+Pt(s)),134775813)+1),t.v.append([e>>>24]);const r=~t.v.get();t.keys=[s,e,r]}function Mt(t){const n=2|t.keys[2];return Pt(o.imul(n,1^n)>>>8)}function Pt(t){return 255&t}function Dt(t){return 4294967295&t}function Ft(t){if(t instanceof y)return t;const n=t.getReader();return new y({async pull(t){const{value:e,done:o}=await n.read();o?t.close():t.enqueue(e)},cancel:t=>n.cancel(t)})}const Et=new f;function Rt(t){return Et.get(t)}const Ut="Invalid uncompressed size",Bt="deflate-raw",Tt="gzip",Vt=[31,139,8];class Wt extends d{constructor(t,{chunkSize:n,CompressionStreamFallback:e,CompressionStream:o}){super({});const{compressed:s,encrypted:r,useCompressionStream:c,zipCrypto:i,computeCrc32:a,level:f,deflate64:w,format:l,compressionMethod:h,inputSize:p}=t,d=this;let y,m,S,g=super.readable;const v=l&&Rt(l),b=a&&s&&!w&&!v&&(!r||i)&&Boolean(c&&o);if(r&&!i||!a||b||(y=new U,g=qt(g,y)),s)if(v)g=Gt(g,Lt(v.CompressionStream,l,{level:f,chunkSize:n,compressionMethod:h,uncompressedSize:p}));else if(b)S=new jt,g=Gt(g,new o(Tt)),g=qt(g,S);else try{g=Nt(g,c,{level:f,chunkSize:n},o,e)}catch(t){let n;try{n=new o(Tt)}catch{throw t}g=Gt(g,n),g=qt(g,new jt)}r&&(i?g=qt(g,new kt(t)):(m=new dt(t),g=qt(g,m))),Ht(d,g,()=>{r&&!i||!a||(d.crc32=b?S.crc32:new u(y.value.buffer).getUint32(0))})}}class jt extends d{constructor(){let t,n=10,e=new r(0);super({transform(t,s){if(n){const e=o.min(n,t.length);if(n-=e,!(t=t.subarray(e)).length)return}const r=e.length+t.length;if(r<=8)return void(e=B(e,t));const c=r-8,i=o.min(c,e.length);s.enqueue(B(e.subarray(0,i),t.subarray(0,c-i))),e=B(e.subarray(i),t.subarray(c-i))},flush(){const n=T(e);t.crc32=n.getUint32(0,!0),t.uncompressedSize=n.getUint32(4,!0)}}),t=this}}class Kt extends d{constructor(t,{chunkSize:n,DecompressionStreamFallback:e,DecompressionStream:o}){super({});const{zipCrypto:c,encrypted:i,checkCrc32:a,crc32:f,compressed:l,useCompressionStream:h,deflate64:p,format:m,compressionMethod:S,rawBitFlag:g,outputSize:b}=t;let z,k,C=super.readable;if(i&&(c?C=qt(C,new zt(t)):(k=new pt(t),C=qt(C,k))),l){const t=m&&Rt(m);if(t)C=Gt(C,Lt(t.DecompressionStream,m,{chunkSize:n,compressionMethod:S,rawBitFlag:g,uncompressedSize:b}));else try{C=Nt(C,h,{chunkSize:n,deflate64:p},o,e)}catch(t){if(p||b===v)throw t;let n;try{n=new o(Tt)}catch{throw t}C=function(t,n,e){const o=new R;let c,i,a,f=0,u=!1;const l=new w((t,n)=>{i=t,a=n});l.catch(()=>{}),e||i();const h=new d({start(t){const n=new r(10);n.set(Vt),t.enqueue(n)},transform(t,n){n.enqueue(t)},async flush(t){u=!0,y();try{await l}finally{m()}const n=new r(8),s=T(n);s.setUint32(0,o.get(),!0),s.setUint32(4,e,!0),t.enqueue(n)},cancel(t){a(t)}}),p=new d({transform(t,n){o.append(t),f+=t.length,f>=e?i():u&&y(),n.enqueue(t)},cancel(t){a(t)}});return t=qt(t,h),qt(t=Gt(t,n),p);function y(){m(),c=setTimeout(()=>a(new s(Ut)),5e3)}function m(){clearTimeout(c)}}(C,n,b)}C=function(t){const n=t.getReader();return new y({async pull(t){let e;try{e=await n.read()}catch(t){if(t&&t.message)throw t;const n=new s("Invalid compressed data");throw n.cause=t,n}const{value:o,done:r}=e;r?t.close():t.enqueue(o)},cancel:t=>n.cancel(t)})}(C)}a&&(z=new U,C=qt(C,z)),Ht(this,C,()=>{if(a){const t=new u(z.value.buffer);if(f!=t.getUint32(0,!1))throw new s("Invalid CRC32")}})}}const Ot=new f;function Ht(t,e,o){e=qt(e,new d({flush:o})),n.defineProperty(t,"readable",{get:()=>e})}function Lt(t,n,e){if(!t)throw new s("Compression method not supported");return new t(n,e)}function Nt(t,n,e,o,s){const r=n&&o?o:s||o,c=e.deflate64?"deflate64-raw":Bt;let i;try{i=new r(c,e)}catch(t){if(!n||!s||r==s)throw t;i=new s(c,e)}return Gt(t,i)}function qt(t,n){return Ft(t).pipeThrough(n)}function Gt(t,n){const e=n.writable.getWriter(),o=t.getReader();return async function(){try{for(;;){await e.ready;const t=await o.read();if(t.done){await e.close();break}await e.write(t.value)}}catch(t){await async function(t,n){try{await t.abort(n)}catch{}}(e,t),await async function(t,n){try{await t.cancel(n)}catch{}}(o,t)}}(),n.readable}const Jt="data",Qt="deflate";class Xt extends d{constructor(t,e){super({});const o=this,{codecType:r}=t;let c;r.startsWith(Qt)?c=Wt:r.startsWith("inflate")&&(c=Kt),o.outputSize=0;let i=0;const a=new c(t,e),f=super.readable,u=new d({transform(t,n){t&&t.length&&(i+=t.length,n.enqueue(t))},flush(){n.assign(o,{inputSize:i})}}),w=new d({transform(n,e){if(n&&n.length&&(e.enqueue(n),o.outputSize+=n.length,t.outputSize!==v&&o.outputSize>t.outputSize))throw new s(Ut)},flush(){const{crc32:t}=a;n.assign(o,{crc32:t,inputSize:i})}});n.defineProperty(o,"readable",{get:()=>f.pipeThrough(u).pipeThrough(a).pipeThrough(w)})}}class Yt extends d{constructor(t){const o=[];let s=0,c=0;function i(){const n=new r(t);let e=0;for(;e<t;){const s=o[0],r=t-e;s.length<=r?(n.set(s,e),e+=s.length,o.shift()):(n.set(s.subarray(0,r),e),o[0]=s.subarray(r),e+=r)}return s-=t,n}(!e.isFinite(t)||t<1)&&(t=65536),super({transform(n,e){for(o.push(n),s+=n.length;s>t;)c+=t,e.enqueue(i())},flush(t){s&&(c+=s,t.enqueue(function(t,n){const e=new r(n);let o=0;for(const n of t)e.set(n,o),o+=n.length;return e}(o,s)))}}),n.defineProperty(this,"outputSize",{get:()=>c})}}let Zt=2;try{typeof navigator!=b&&navigator.hardwareConcurrency&&(Zt=navigator.hardwareConcurrency)}catch{}function $t(t){return Boolean(t)&&"object"==typeof t}const _t=new f,tn=new f,nn=function(){try{return structuredClone(new s)instanceof s}catch{return!1}}();let en=0;async function on(t){let n,r,c;try{const{options:i,config:a}=t;if(i.format)try{await async function(t,n){!Et.has(t)&&n&&function(t,n){const{CompressionStream:e,DecompressionStream:o}=n;if(typeof e!=z&&typeof o!=z)throw new s("Invalid codec module");Et.set(t,{CompressionStream:e,DecompressionStream:o})}(t,await(import(n)))}(i.format,i.codecURI)}catch(t){if($t(t))try{t.codecImportFailed=!0}catch{}throw t}if(a.CompressionStream=self.CompressionStream,a.DecompressionStream=self.DecompressionStream,i.compressed&&!i.format)if(i.useCompressionStream){if(!function(t,n){if(!t)return!1;let e=Ot.get(t);e||(e=new f,Ot.set(t,e));let o=e.get(n);if(o===v){try{new t(n),o=!0}catch{o=!1}e.set(n,o)}return o}(i.codecType.startsWith(Qt)?a.CompressionStream:a.DecompressionStream,Bt))try{await self.initModule(t.config)}catch{}}else try{await self.initModule(t.config)}catch{i.useCompressionStream=!0}if(i.encrypted&&!i.zipCrypto)try{await self.initModule(t.config)}catch{}!a.CompressionStreamFallback&&a.CompressionStreamZlib&&(a.CompressionStreamFallback=a.CompressionStreamZlib),!a.DecompressionStreamFallback&&a.DecompressionStreamZlib&&(a.DecompressionStreamFallback=a.DecompressionStreamZlib);const u={highWaterMark:1},l=t.readable?Ft(t.readable):new y({async pull(t){const n=new w(t=>_t.set(en,t));sn({type:"pull",messageId:en}),en=(en+1)%e.MAX_SAFE_INTEGER;const{value:o,done:s}=await n;t.enqueue(o),s&&t.close()}},u);c=t.writable?function(t){if(t instanceof m)return t;const n=t.getWriter();return new m({write:t=>n.write(t),close:()=>n.close(),abort:t=>n.abort(t)})}(t.writable):new m({async write(t){let n;const o=new w(t=>n=t);tn.set(en,n),sn({type:Jt,value:t,messageId:en}),en=(en+1)%e.MAX_SAFE_INTEGER,await o}},u),n=new Xt(i,a),r=new Yt(function(t){return s="string"==typeof(n=s=t.chunkSize)&&n.trim()?e(n):n,e.isInteger(s)&&s>=1?o.max(s,64):65536;var n,s}(a)),await l.pipeThrough(n).pipeThrough(r).pipeTo(c,{preventClose:!0,preventAbort:!0}),await c.getWriter().close();const{crc32:h,inputSize:p,outputSize:d}=n;sn({type:"close",result:{crc32:h,inputSize:p,outputSize:d}})}catch(t){const n=r?r.outputSize:0;if($t(t))try{t.outputSize=n}catch{}if(c&&!c.locked)try{await c.getWriter().close()}catch{}rn(t,n)}}function sn(t){const{value:n}=t;if(n)if(n.length)try{t.value=(e=n,e.byteOffset||e.byteLength!=e.buffer.byteLength?new r(e):e).buffer,p(t,[t.value])}catch{p(t)}else p(t);else p(t);var e}function rn(t,n){const{message:e,stack:o,code:r,name:c,outputSize:i,cause:a,codecImportFailed:f}=function(t=new s("Unknown error")){return $t(t)?t:new s(String(t))}(t),u={message:e,stack:o,code:r,name:c,outputSize:i===v?n:i};if(a&&(u.cause={name:a.name,message:a.message}),f&&(u.codecImportFailed=!0),nn)try{return void p({error:u,errorValue:{value:t}})}catch{}p({error:u})}addEventListener("message",({data:t})=>{const{type:n,messageId:e,value:o,done:s}=t;try{if("start"==n&&on(t),n==Jt){const t=_t.get(e);_t.delete(e),t({value:o||new r,done:s})}if("ack"==n){const t=tn.get(e);tn.delete(e),t()}}catch(t){rn(t)}}),p({type:"ready"});const cn="deflate",an="deflate-raw",fn="deflate64-raw",un="gzip";let wn,ln,hn,pn,dn;function yn(t,n,e={}){if(!wn){const t=new s("WASM module not loaded");throw t.cause=dn,t}const c="number"==typeof e.level?e.level:-1,i="number"==typeof e.outBuffer?e.outBuffer:65536,a="number"==typeof e.inBufferSize?e.inBufferSize:65536;return new d({start(){try{let e;if(this.C=ln(i),this.in=ln(a),this.inBufferSize=a,!this.C||!this.in)throw new s("allocation failed");if(t?(this.I=wn.deflate_process,this.A=wn.deflate_last_consumed,this.M=wn.deflate_end,this.P=wn.deflate_new(),e=n===un?wn.deflate_init_gzip(this.P,c):n===an?wn.deflate_init_raw(this.P,c):wn.deflate_init(this.P,c)):n===fn?(this.I=wn.inflate9_process,this.A=wn.inflate9_last_consumed,this.M=wn.inflate9_end,this.P=wn.inflate9_new(),e=wn.inflate9_init_raw(this.P)):(this.I=wn.inflate_process,this.A=wn.inflate_last_consumed,this.M=wn.inflate_end,this.P=wn.inflate_new(),e=n===an?wn.inflate_init_raw(this.P):n===un?wn.inflate_init_gzip(this.P):wn.inflate_init(this.P)),0!==e)throw new s("init failed:"+e)}catch(t){throw f(this),t}},transform(t,n){try{const e=t,c=new r(pn.buffer),a=this.I,f=this.A,u=this.C;let w=0;for(;w<e.length;){const t=o.min(e.length-w,32768);if((!this.in||this.inBufferSize<t)&&(this.in&&hn&&(hn(this.in),this.in=0),this.in=ln(t),this.inBufferSize=t,!this.in))throw new s("allocation failed");c.set(e.subarray(w,w+t),this.in);const r=a(this.P,this.in,t,u,i,0),l=r>>24&255,h=128&l?l-256:l;if(h<0)throw new s("process error:"+h);const p=16777215&r;p&&n.enqueue(c.slice(u,u+p));const d=f(this.P);if(0===d&&0===p)break;w+=d}}catch(t){f(this),n.error(t)}},flush(t){try{const n=new r(pn.buffer),e=this.I,o=this.C;for(;;){const r=e(this.P,0,0,o,i,4),c=r>>24&255,a=128&c?c-256:c;if(a<0)throw new s("process error:"+a);const f=16777215&r;if(f&&t.enqueue(n.slice(o,o+f)),1===c||0===f)break}}catch(n){t.error(n)}finally{const n=f(this);0!==n&&t.error(new s("end error:"+n))}},cancel(){f(this)}});function f(t){let n=0;return t.P&&t.M&&(n=t.M(t.P)),t.P=0,t.in&&hn&&hn(t.in),t.in=0,t.C&&hn&&hn(t.C),t.C=0,n}}class mn{constructor(t=cn,n){return yn(!0,t,n)}}class Sn{constructor(t=cn,n){return yn(!1,t,n)}}mn.D=!0,Sn.D=!0,mn.F=[cn,an,un],Sn.F=[cn,an,un,fn];const gn=65536;let vn,bn;function zn(t){return new r(t.memory.buffer)}let kn=!1;!function(t={}){const{init:n,R:e}=t,o=t.CompressionStreamFallback||t.CompressionStreamZlib,s=t.DecompressionStreamFallback||t.DecompressionStreamZlib;e&&(ht=e||Q),self.initModule=async t=>{n&&await n(t),o&&(t.CompressionStreamFallback=o),s&&(t.DecompressionStreamFallback=s)}}({CompressionStreamFallback:mn,DecompressionStreamFallback:Sn,R:function(t,n){const e=vn;let o=e?function(t,n,e){bn||(bn=t.malloc(gn));const o=bn?t.aes_hmac_new():0;if(o){const s=zn(t);if(s.set(n,bn),s.set(e,bn+n.length),t.aes_hmac_init(o,bn,n.length,bn+n.length,e.length))return t.aes_hmac_end(o,0),0}return o}(e,t,n):0;if(!o)return Q(t,n);const s=bn;return{process(t,n){for(let r=0;r<t.length;r+=gn){const c=t.subarray(r,r+gn),i=zn(e);i.set(c,s),e.aes_hmac_process(o,s,c.length,n?1:0),c.set(i.subarray(s,s+c.length))}},digest:()=>(e.aes_hmac_end(o,s),o=0,zn(e).slice(s,s+20)),dispose(){o&&(e.aes_hmac_end(o,0),o=0)}}},init:t=>async function(t,{baseURI:n}){if(!kn)try{await async function(t,n){let e,o;try{try{o=new URL(t,n)}catch{}const s=await fetch(o);e=await s.arrayBuffer()}catch(n){if(!t.startsWith("data:application/wasm;base64,"))throw n;e=function(t){const n=t.split(",")[1],e=atob(n),o=e.length,s=new r(o);for(let t=0;t<o;++t)s[t]=e.charCodeAt(t);return s.buffer}(t)}const c=await WebAssembly.instantiate(e);var i;(function(t){if(wn=t,({malloc:ln,free:hn,memory:pn}=wn),"function"!=typeof ln||"function"!=typeof hn||!pn)throw wn=ln=hn=pn=null,new s("Invalid WASM module")})(c.instance.exports),typeof(i=c.instance.exports).aes_hmac_new==z&&(vn=i,bn=0)}(t,n),kn=!0}catch(t){throw function(t){dn=t}(t),t}}(t.wasmURI,t)})});\n';if("string"==typeof s&&(s=(new TextEncoder).encode(s)),t){const t=new Blob([s],{type:e});return URL.createObjectURL(t)}return "data:"+e+";base64,"+function(t){let e="";const s=t.length;let r=0;for(;r+2<s;r+=3){const s=t[r]<<16|t[r+1]<<8|t[r+2];e+=n$1[s>>18&63]+n$1[s>>12&63]+n$1[s>>6&63]+n$1[63&s];}const o=s-r;if(1===o){const s=t[r]<<16;e+=n$1[s>>18&63]+n$1[s>>12&63]+"==";}else if(2===o){const s=t[r]<<16|t[r+1]<<8;e+=n$1[s>>18&63]+n$1[s>>12&63]+n$1[s>>6&63]+"=";}return e}(s)}});

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

function createEngine$2(key, authenticationKey) {
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
let createEngine$1 = createEngine$2;

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

function setAESEngine(createEngineFunction) {
	createEngine$1 = createEngineFunction || createEngine$2;
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
	aesCrypto.engine = createEngine$1(subarray(compositeKey, 0, keyLength), subarray(compositeKey, keyLength, keyLength * 2));
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
const FORMAT_DEFLATE_RAW$1 = "deflate-raw";
const FORMAT_DEFLATE64_RAW$1 = "deflate64-raw";
const FORMAT_GZIP$1 = "gzip";
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
		const useGzipCrc32 = computeCrc32 && compressed && !deflate64 && !codecStreams && (!encrypted || zipCrypto) &&
			Boolean(useCompressionStream && CompressionStream);
		if ((!encrypted || zipCrypto) && computeCrc32 && !useGzipCrc32) {
			crc32Stream = new Crc32Stream();
			readable = pipeThrough(readable, crc32Stream);
		}
		if (compressed) {
			if (codecStreams) {
				readable = pipeThroughBackpressured(readable, createCodecStream(codecStreams.CompressionStream, format, { level, chunkSize, compressionMethod, uncompressedSize: inputSize }));
			} else if (useGzipCrc32) {
				gzipCrc32Stream = new GzipToRawDeflateStream();
				readable = pipeThroughBackpressured(readable, new CompressionStream(FORMAT_GZIP$1));
				readable = pipeThrough(readable, gzipCrc32Stream);
			} else {
				try {
					readable = pipeThroughCompressionStream(readable, useCompressionStream, { level, chunkSize }, CompressionStream, CompressionStreamFallback);
				} catch (error) {
					let gzipStream;
					try {
						gzipStream = new CompressionStream(FORMAT_GZIP$1);
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
						gzipStream = new DecompressionStream(FORMAT_GZIP$1);
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
	return supportsFormat(StreamClass, FORMAT_DEFLATE_RAW$1);
}

function supportsGzip(StreamClass) {
	return supportsFormat(StreamClass, FORMAT_GZIP$1);
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

function pipeThroughCompressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamFallback) {
	const Stream = useCompressionStream && CompressionStreamNative ?
		CompressionStreamNative :
		CompressionStreamFallback || CompressionStreamNative;
	const format = options.deflate64 ? FORMAT_DEFLATE64_RAW$1 : FORMAT_DEFLATE_RAW$1;
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
let initModule$1 = () => { };

function configureWorker({ initModule: initModuleFunction }) {
	initModule$1 = initModuleFunction;
}

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
	if (initModule$1) {
		try {
			await initModule$1(config);
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
						terminateResolvers.forEach(resolve => resolve());
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
			const rawFilename = directoryArray.subarray(filenameOffset, extraFieldOffset);
			const commentLength = getUint16$1(directoryView, offset + 32);
			const endOffset = commentOffset + commentLength;
			const rawComment = directoryArray.subarray(commentOffset, endOffset);
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
				rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset),
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
		compression: formatSupported(CompressionStreamFallback, FORMAT_DEFLATE_RAW$1) ||
			formatSupported(CompressionStream, FORMAT_DEFLATE_RAW$1) || formatSupported(CompressionStream, FORMAT_GZIP$1),
		decompression: formatSupported(DecompressionStreamFallback, FORMAT_DEFLATE_RAW$1) ||
			formatSupported(DecompressionStream, FORMAT_DEFLATE_RAW$1) || formatSupported(DecompressionStream, FORMAT_GZIP$1),
		registered: false
	}, {
		compressionMethod: COMPRESSION_METHOD_DEFLATE_64,
		compression: false,
		decompression: formatSupported(DecompressionStreamFallback, FORMAT_DEFLATE64_RAW$1) ||
			formatSupported(DecompressionStream, FORMAT_DEFLATE64_RAW$1),
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

const VERSION = "2.14.1";

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
	setDefaultConfiguration({ baseURI: (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index.cjs', document.baseURI).href)) });
} catch {
	// ignored
}

const n=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],r=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],o=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],f=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],e=new Uint8Array(288);e.fill(8,0,144),e.fill(9,144,256),e.fill(7,256,280),e.fill(8,280,288);const b=new Uint8Array(30).fill(5);function p(n){const t=new Uint16Array(16);for(const r of n)t[r]++;t[0]=0;const r=new Uint16Array(17);for(let n=1;n<=15;n++)r[n+1]=r[n]+t[n];const o=new Uint16Array(n.length);for(let t=0;t<n.length;t++)n[t]&&(o[r[n[t]]++]=t);return {o:t,symbols:o}}const X="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function s(s){let Y;s({wasmURI:()=>(Y||(Y="data:application/wasm;base64,"+function(n){let t="";const r=n.length;let o=0;for(;o+2<r;o+=3){const r=n[o]<<16|n[o+1]<<8|n[o+2];t+=X[r>>18&63]+X[r>>12&63]+X[r>>6&63]+X[63&r];}const f=r-o;if(1===f){const r=n[o]<<16;t+=X[r>>18&63]+X[r>>12&63]+"==";}else if(2===f){const r=n[o]<<16|n[o+1]<<8;t+=X[r>>18&63]+X[r>>12&63]+X[r>>6&63]+"=";}return t}(function(X){let s=0,Y=0,l=0,x=new Uint8Array(1024),w=0,c=0;for(;!c;){c=a(1);const n=a(2);if(0==n)P();else if(1==n)B(p(e),p(b));else {if(2!=n)throw new Error("invalid deflate block type");B(...R());}}return x.subarray(0,w);function U(){if(s>=X.length)throw new Error("unexpected end of deflate data");return X[s++]}function a(n){for(;l<n;)Y|=U()<<l,l+=8;const t=Y&(1<<n)-1;return Y>>>=n,l-=n,t}function P(){Y=0,l=0;const n=U()|U()<<8;s+=2,W(w+n);for(let t=0;t<n;t++)x[w++]=U();}function B(f,e){let b=h(f);for(;256!=b;){if(b<256)W(w+1),x[w++]=b;else {const f=b-257,p=n[f]+a(t[f]),X=h(e),s=r[X]+a(o[X]);W(w+p);const Y=w-s;for(let n=0;n<p;n++)x[w++]=x[Y+n];}b=h(f);}}function R(){const n=a(5)+257,t=a(5)+1,r=a(4)+4,o=new Uint8Array(19);for(let n=0;n<r;n++)o[f[n]]=a(3);const e=p(o),b=new Uint8Array(n+t);let X=0;for(;X<b.length;){const n=h(e);if(n<16)b[X++]=n;else if(16==n){const n=b[X-1];let t=a(2)+3;for(;t--;)b[X++]=n;}else X+=17==n?a(3)+3:a(7)+11;}return [p(b.subarray(0,n)),p(b.subarray(n))]}function h(n){const{o:t,symbols:r}=n;let o=0,f=0,e=0;for(let n=1;n<=15;n++){o|=a(1);const b=t[n];if(o-f<b)return r[e+(o-f)];e+=b,f=f+b<<1,o<<=1;}throw new Error("invalid huffman code")}function W(n){if(x.length<n){let t=2*x.length;for(;t<n;)t*=2;const r=new Uint8Array(t);r.set(x.subarray(0,w)),x=r;}}}(function(n){const t=(n=String(n).replace(/[^A-Za-z0-9+/=]/g,"")).length,r=[];for(let o=0;o<t;o+=4){const t=X.indexOf(n[o])<<18|X.indexOf(n[o+1])<<12|(63&X.indexOf(n[o+2]))<<6|63&X.indexOf(n[o+3]);r.push(t>>16&255),"="!==n[o+2]&&r.push(t>>8&255),"="!==n[o+3]&&r.push(255&t);}return new Uint8Array(r)}("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")))),Y)});}

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

/* global TransformStream */

const FORMAT_DEFLATE = "deflate";
const FORMAT_DEFLATE_RAW = "deflate-raw";
const FORMAT_DEFLATE64_RAW = "deflate64-raw";
const FORMAT_GZIP = "gzip";

let wasm$1, malloc, free, memory, initError;

function setWasmExports$1(wasmAPI) {
	wasm$1 = wasmAPI;
	({ malloc, free, memory } = wasm$1);
	if (typeof malloc !== "function" || typeof free !== "function" || !memory) {
		wasm$1 = malloc = free = memory = null;
		throw new Error("Invalid WASM module");
	}
}

function setInitError(error) {
	initError = error;
}

function resetWasmExports$1() {
	wasm$1 = malloc = free = memory = initError = null;
}

function _make(isCompress, type, options = {}) {
	if (!wasm$1) {
		const error = new Error("WASM module not loaded");
		error.cause = initError;
		throw error;
	}
	const level = (typeof options.level === "number") ? options.level : -1;
	const outBufferSize = (typeof options.outBuffer === "number") ? options.outBuffer : 64 * 1024;
	const inBufferSize = (typeof options.inBufferSize === "number") ? options.inBufferSize : 64 * 1024;

	return new TransformStream({
		start() {
			try {
				let result;
				this.out = malloc(outBufferSize);
				this.in = malloc(inBufferSize);
				this.inBufferSize = inBufferSize;
				if (!this.out || !this.in) {
					throw new Error("allocation failed");
				}
				if (isCompress) {
					this._process = wasm$1.deflate_process;
					this._last_consumed = wasm$1.deflate_last_consumed;
					this._end = wasm$1.deflate_end;
					this.streamHandle = wasm$1.deflate_new();
					if (type === FORMAT_GZIP) {
						result = wasm$1.deflate_init_gzip(this.streamHandle, level);
					} else if (type === FORMAT_DEFLATE_RAW) {
						result = wasm$1.deflate_init_raw(this.streamHandle, level);
					} else {
						result = wasm$1.deflate_init(this.streamHandle, level);
					}
				} else {
					if (type === FORMAT_DEFLATE64_RAW) {
						this._process = wasm$1.inflate9_process;
						this._last_consumed = wasm$1.inflate9_last_consumed;
						this._end = wasm$1.inflate9_end;
						this.streamHandle = wasm$1.inflate9_new();
						result = wasm$1.inflate9_init_raw(this.streamHandle);
					} else {
						this._process = wasm$1.inflate_process;
						this._last_consumed = wasm$1.inflate_last_consumed;
						this._end = wasm$1.inflate_end;
						this.streamHandle = wasm$1.inflate_new();
						if (type === FORMAT_DEFLATE_RAW) {
							result = wasm$1.inflate_init_raw(this.streamHandle);
						} else if (type === FORMAT_GZIP) {
							result = wasm$1.inflate_init_gzip(this.streamHandle);
						} else {
							result = wasm$1.inflate_init(this.streamHandle);
						}
					}
				}
				if (result !== 0) {
					throw new Error("init failed:" + result);
				}
			} catch (error) {
				disposeStream(this);
				throw error;
			}
		},
		transform(chunk, controller) {
			try {
				const buffer = chunk;
				const heap = new Uint8Array(memory.buffer);
				const process = this._process;
				const last_consumed = this._last_consumed;
				const out = this.out;
				let offset = 0;
				while (offset < buffer.length) {
					const toRead = Math.min(buffer.length - offset, 32 * 1024);
					if (!this.in || this.inBufferSize < toRead) {
						if (this.in && free) {
							free(this.in);
							this.in = 0;
						}
						this.in = malloc(toRead);
						this.inBufferSize = toRead;
						if (!this.in) {
							throw new Error("allocation failed");
						}
					}
					heap.set(buffer.subarray(offset, offset + toRead), this.in);
					const result = process(this.streamHandle, this.in, toRead, out, outBufferSize, 0);
					// checked before the byte count is used, so a status code can never be read as one
					const code = (result >> 24) & 0xff;
					const signedCode = (code & 0x80) ? code - 256 : code;
					if (signedCode < 0) {
						throw new Error("process error:" + signedCode);
					}
					const prod = result & 0x00ffffff;
					if (prod) {
						controller.enqueue(heap.slice(out, out + prod));
					}
					const consumed = last_consumed(this.streamHandle);
					if (consumed === 0 && prod === 0) {
						break;
					}
					offset += consumed;
				}
			} catch (error) {
				disposeStream(this);
				controller.error(error);
			}
		},
		flush(controller) {
			try {
				const heap = new Uint8Array(memory.buffer);
				const process = this._process;
				const out = this.out;
				while (true) {
					const result = process(this.streamHandle, 0, 0, out, outBufferSize, 4);
					const code = (result >> 24) & 0xff;
					const signedCode = (code & 0x80) ? code - 256 : code;
					if (signedCode < 0) {
						throw new Error("process error:" + signedCode);
					}
					const produced = result & 0x00ffffff;
					if (produced) {
						controller.enqueue(heap.slice(out, out + produced));
					}
					if (code === 1 || produced === 0) {
						break;
					}
				}
			} catch (error) {
				controller.error(error);
			} finally {
				const result = disposeStream(this);
				if (result !== 0) {
					controller.error(new Error("end error:" + result));
				}
			}
		},
		cancel() {
			// release the stream handle and buffers when the pipeline is aborted,
			// they would be leaked in the process-lifetime wasm heap otherwise
			disposeStream(this);
		}
	});

	function disposeStream(state) {
		let endResult = 0;
		if (state.streamHandle && state._end) {
			endResult = state._end(state.streamHandle);
		}
		state.streamHandle = 0;
		if (state.in && free) {
			free(state.in);
		}
		state.in = 0;
		if (state.out && free) {
			free(state.out);
		}
		state.out = 0;
		return endResult;
	}
}

class CompressionStreamZlib {
	constructor(type = FORMAT_DEFLATE, options) {
		return _make(true, type, options);
	}
}
class DecompressionStreamZlib {
	constructor(type = FORMAT_DEFLATE, options) {
		return _make(false, type, options);
	}
}
// These codecs are backed by the WASM module; they are unusable until setWasmExports() has run.
// The worker uses this flag to know it must fall back to the native CompressionStream when the
// module fails to load, rather than discarding a self-contained codec supplied through config.
CompressionStreamZlib.requiresModule = true;
DecompressionStreamZlib.requiresModule = true;
// Constructing these classes before the module is loaded throws, so capability probes cannot rely
// on trying the constructor; the formats are declared instead, next to the branches implementing
// them in _make().
CompressionStreamZlib.supportedFormats = [FORMAT_DEFLATE, FORMAT_DEFLATE_RAW, FORMAT_GZIP];
DecompressionStreamZlib.supportedFormats = [FORMAT_DEFLATE, FORMAT_DEFLATE_RAW, FORMAT_GZIP, FORMAT_DEFLATE64_RAW];

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


const BUFFER_LENGTH = 64 * 1024;
const DIGEST_LENGTH = 20;

let wasm, buffer;

function setWasmExports(wasmAPI) {
	// deno-lint-ignore valid-typeof
	if (typeof wasmAPI.aes_hmac_new == FUNCTION_TYPE) {
		wasm = wasmAPI;
		buffer = 0;
	}
}

function resetWasmExports() {
	wasm = null;
	buffer = 0;
}

function createEngine(key, authenticationKey) {
	const exports = wasm;
	let context = exports ? createContext(exports, key, authenticationKey) : 0;
	if (!context) {
		return createEngine$2(key, authenticationKey);
	}
	const scratch = buffer;
	return {
		process(data, decrypt) {
			for (let offset = 0; offset < data.length; offset += BUFFER_LENGTH) {
				const chunk = data.subarray(offset, offset + BUFFER_LENGTH);
				const heap = getHeap(exports);
				heap.set(chunk, scratch);
				exports.aes_hmac_process(context, scratch, chunk.length, decrypt ? 1 : 0);
				chunk.set(heap.subarray(scratch, scratch + chunk.length));
			}
		},
		digest() {
			exports.aes_hmac_end(context, scratch);
			context = 0;
			return getHeap(exports).slice(scratch, scratch + DIGEST_LENGTH);
		},
		dispose() {
			if (context) {
				exports.aes_hmac_end(context, 0);
				context = 0;
			}
		}
	};
}

function createContext(exports, key, authenticationKey) {
	if (!buffer) {
		buffer = exports.malloc(BUFFER_LENGTH);
	}
	const context = buffer ? exports.aes_hmac_new() : 0;
	if (context) {
		const heap = getHeap(exports);
		heap.set(key, buffer);
		heap.set(authenticationKey, buffer + key.length);
		if (exports.aes_hmac_init(context, buffer, key.length, buffer + key.length, authenticationKey.length)) {
			exports.aes_hmac_end(context, 0);
			return 0;
		}
	}
	return context;
}

function getHeap(exports) {
	return new Uint8Array(exports.memory.buffer);
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


let initializedModule = false;

async function initModule(wasmURI, { baseURI }) {
	if (!initializedModule) {
		try {
			await instantiateModule(wasmURI, baseURI);
			initializedModule = true;
		} catch (error) {
			setInitError(error);
			throw error;
		}
	}
}

async function instantiateModule(wasmURI, baseURI) {
	let arrayBuffer, uri;
	try {
		try {
			uri = new URL(wasmURI, baseURI);
		} catch {
			// ignored
		}
		const response = await fetch(uri);
		arrayBuffer = await response.arrayBuffer();
	} catch (error) {
		if (wasmURI.startsWith("data:application/wasm;base64,")) {
			arrayBuffer = arrayBufferFromDataURI(wasmURI);
		} else {
			throw error;
		}
	}
	const wasmInstance = await WebAssembly.instantiate(arrayBuffer);
	setWasmExports$1(wasmInstance.instance.exports);
	setWasmExports(wasmInstance.instance.exports);
}

function resetWasmModule() {
	initializedModule = false;
	resetWasmExports$1();
	resetWasmExports();
}

function arrayBufferFromDataURI(dataURI) {
	const base64 = dataURI.split(",")[1];
	const binary = atob(base64);
	const len = binary.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; ++i) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes.buffer;
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


let modulePromise;

setAESEngine(createEngine);
configureWorker({
	initModule: config => {
		if (!modulePromise) {
			let { wasmURI } = config;
			// deno-lint-ignore valid-typeof
			if (typeof wasmURI == FUNCTION_TYPE) {
				wasmURI = wasmURI();
			}
			modulePromise = initModule(wasmURI, config).catch(error => {
				modulePromise = null;
				throw error;
			});
		}
		return modulePromise;
	}
});
setDefaultConfiguration({
	CompressionStreamFallback: CompressionStreamZlib,
	DecompressionStreamFallback: DecompressionStreamZlib
});

async function terminateWorkersAndModule() {
	await terminateWorkers();
	modulePromise = null;
	resetWasmModule();
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
const ERR_ABORT_EXPORT = "zipjs-abort-export";

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
		const duplicates = checkDuplicatesOption(options.duplicates);
		const importedEntries = [];
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
						Reader: getZipBlobReader(Object.assign({}, options)),
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
	}
	return readerOptions;
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


e$1(setDefaultConfiguration);

exports.BlobReader = BlobReader;
exports.BlobWriter = BlobWriter;
exports.Data64URIReader = Data64URIReader;
exports.Data64URIWriter = Data64URIWriter;
exports.ERR_ABORTED = ERR_ABORTED;
exports.ERR_AMBIGUOUS_ARCHIVE = ERR_AMBIGUOUS_ARCHIVE;
exports.ERR_ANCESTOR_ENTRY = ERR_ANCESTOR_ENTRY;
exports.ERR_BAD_FORMAT = ERR_BAD_FORMAT;
exports.ERR_CENTRAL_DIRECTORY_NOT_FOUND = ERR_CENTRAL_DIRECTORY_NOT_FOUND;
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
exports.ERR_INVALID_PASSWORD_TYPE = ERR_INVALID_PASSWORD_TYPE;
exports.ERR_INVALID_PASS_THROUGH = ERR_INVALID_PASS_THROUGH;
exports.ERR_INVALID_PASS_THROUGH_VALUE = ERR_INVALID_PASS_THROUGH_VALUE;
exports.ERR_INVALID_READER = ERR_INVALID_READER;
exports.ERR_INVALID_READER_OPTIONS = ERR_INVALID_READER_OPTIONS;
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
exports.terminateWorkers = terminateWorkersAndModule;
exports.unregisterCodec = unregisterCodec;
