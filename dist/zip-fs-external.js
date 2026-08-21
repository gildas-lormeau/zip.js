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


function configureExternalAssets() {
	setDefaultConfiguration({
		workerURI: new URL("./zip-web-worker.js", import.meta.url).href,
		wasmURI: new URL("./zip-module.wasm", import.meta.url).href
	});
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
		try {
			await initModule$1(config);
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
					await initModule$1(config);
				} catch {
					if (!FallbackStream || FallbackStream.requiresModule) {
						options.useCompressionStream = true;
					}
				}
			} else if (FallbackStream && FallbackStream.requiresModule && !supportsDeflateRaw(NativeStream)) {
				try {
					await initModule$1(config);
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
	setDefaultConfiguration({ baseURI: import.meta.url });
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

/* global TransformStream */

let wasm, malloc, free, memory, initError;

function setWasmExports(wasmAPI) {
	wasm = wasmAPI;
	({ malloc, free, memory } = wasm);
	if (typeof malloc !== "function" || typeof free !== "function" || !memory) {
		wasm = malloc = free = memory = null;
		throw new Error("Invalid WASM module");
	}
}

function setInitError(error) {
	initError = error;
}

function resetWasmExports() {
	wasm = malloc = free = memory = initError = null;
}

function _make(isCompress, type, options = {}) {
	if (!wasm) {
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
				this._scratch = new Uint8Array(outBufferSize);
				if (isCompress) {
					this._process = wasm.deflate_process;
					this._last_consumed = wasm.deflate_last_consumed;
					this._end = wasm.deflate_end;
					this.streamHandle = wasm.deflate_new();
					if (type === "gzip") {
						result = wasm.deflate_init_gzip(this.streamHandle, level);
					} else if (type === "deflate-raw") {
						result = wasm.deflate_init_raw(this.streamHandle, level);
					} else {
						result = wasm.deflate_init(this.streamHandle, level);
					}
				} else {
					if (type === "deflate64-raw") {
						this._process = wasm.inflate9_process;
						this._last_consumed = wasm.inflate9_last_consumed;
						this._end = wasm.inflate9_end;
						this.streamHandle = wasm.inflate9_new();
						result = wasm.inflate9_init_raw(this.streamHandle);
					} else {
						this._process = wasm.inflate_process;
						this._last_consumed = wasm.inflate_last_consumed;
						this._end = wasm.inflate_end;
						this.streamHandle = wasm.inflate_new();
						if (type === "deflate-raw") {
							result = wasm.inflate_init_raw(this.streamHandle);
						} else if (type === "gzip") {
							result = wasm.inflate_init_gzip(this.streamHandle);
						} else {
							result = wasm.inflate_init(this.streamHandle);
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
				const scratch = this._scratch;
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
					const prod = result & 0x00ffffff;
					if (prod) {
						scratch.set(heap.subarray(out, out + prod), 0);
						controller.enqueue(scratch.slice(0, prod));
					}
					if (!isCompress) {
						const code = (result >> 24) & 0xff;
						const signedCode = (code & 0x80) ? code - 256 : code;
						if (signedCode < 0) {
							throw new Error("process error:" + signedCode);
						}
					}
					const consumed = last_consumed(this.streamHandle);
					if (consumed === 0) {
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
				const scratch = this._scratch;
				while (true) {
					const result = process(this.streamHandle, 0, 0, out, outBufferSize, 4);
					const produced = result & 0x00ffffff;
					const code = (result >> 24) & 0xff;
					if (!isCompress) {
						const signedCode = (code & 0x80) ? code - 256 : code;
						if (signedCode < 0) {
							throw new Error("process error:" + signedCode);
						}
					}
					if (produced) {
						scratch.set(heap.subarray(out, out + produced), 0);
						controller.enqueue(scratch.slice(0, produced));
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
	constructor(type = "deflate", options) {
		return _make(true, type, options);
	}
}
class DecompressionStreamZlib {
	constructor(type = "deflate", options) {
		return _make(false, type, options);
	}
}
// These codecs are backed by the WASM module; they are unusable until setWasmExports() has run.
// The worker uses this flag to know it must fall back to the native CompressionStream when the
// module fails to load, rather than discarding a self-contained codec supplied through config.
CompressionStreamZlib.requiresModule = true;
DecompressionStreamZlib.requiresModule = true;

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
	setWasmExports(wasmInstance.instance.exports);
}

function resetWasmModule() {
	initializedModule = false;
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

function terminateWorkersAndModule() {
	modulePromise = null;
	terminateWorkers();
	resetWasmModule();
}

/// <reference types="../index.d.ts" />


configureExternalAssets();

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

export { BlobReader, BlobWriter, Data64URIReader, Data64URIWriter, ERR_ABORTED, ERR_AMBIGUOUS_ARCHIVE, ERR_BAD_FORMAT, ERR_CENTRAL_DIRECTORY_NOT_FOUND, ERR_DUPLICATED_NAME, ERR_ENCRYPTED, ERR_ENCRYPTED_CENTRAL_DIRECTORY, ERR_ENTRY_DATA_OUT_OF_BOUNDS, ERR_ENTRY_EXISTS, ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND, ERR_EOCDR_NOT_FOUND, ERR_EXTRAFIELD_ZIP64_NOT_FOUND, ERR_HTTP_RANGE, ERR_HTTP_RESOURCE_CHANGED, ERR_INVALID_AUTHENTICATION_CODE, ERR_INVALID_CODEC_DEFINITION, ERR_INVALID_CODEC_MODULE, ERR_INVALID_COMMENT, ERR_INVALID_COMMENT_TYPE, ERR_INVALID_COMPRESSED_DATA, ERR_INVALID_CRC32, ERR_INVALID_DATE, ERR_INVALID_ENCRYPTION_STRENGTH, ERR_INVALID_ENTRY_COMMENT, ERR_INVALID_ENTRY_COMMENT_TYPE, ERR_INVALID_ENTRY_NAME, ERR_INVALID_EXTRAFIELD, ERR_INVALID_EXTRAFIELD_DATA, ERR_INVALID_EXTRAFIELD_DATA_TYPE, ERR_INVALID_EXTRAFIELD_TYPE, ERR_INVALID_FILENAME_VALIDATION, ERR_INVALID_FUNCTION_OPTION, ERR_INVALID_GID, ERR_INVALID_LEVEL, ERR_INVALID_MAX_APPENDED_DATA_SIZE, ERR_INVALID_MAX_WORKERS, ERR_INVALID_MSDOS_ATTRIBUTES, ERR_INVALID_MSDOS_DATA, ERR_INVALID_PASSWORD, ERR_INVALID_PASSWORD_TYPE, ERR_INVALID_PASS_THROUGH, ERR_INVALID_READER_OPTIONS, ERR_INVALID_SIGNAL, ERR_INVALID_SIGNATURE, ERR_INVALID_SIGNATURE_DATA, ERR_INVALID_STRICTNESS, ERR_INVALID_UID, ERR_INVALID_UNCOMPRESSED_SIZE, ERR_INVALID_UNIX_EXTRA_FIELD_TYPE, ERR_INVALID_UNIX_ID_SIZE, ERR_INVALID_UNIX_MODE, ERR_INVALID_VERSION, ERR_ITERATOR_COMPLETED_TOO_SOON, ERR_LOCAL_FILE_HEADER_NOT_FOUND, ERR_OVERLAPPING_ENTRY, ERR_READABLE_CONSUMED, ERR_RESERVED_COMPRESSION_METHOD, ERR_SPLIT_ZIP_FILE, ERR_UNDEFINED_COMPRESSION_METHOD, ERR_UNDEFINED_READER, ERR_UNDEFINED_UNCOMPRESSED_SIZE, ERR_UNDETERMINED_SIZE, ERR_UNSAFE_FILENAME, ERR_UNSUPPORTED_COMPRESSION$1 as ERR_UNSUPPORTED_COMPRESSION, ERR_UNSUPPORTED_CONTEXT, ERR_UNSUPPORTED_CRYPTO_API, ERR_UNSUPPORTED_ENCRYPTION, ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH, ERR_UNSUPPORTED_ENCRYPTION_USDZ, ERR_UNSUPPORTED_FORMAT, ERR_WORKER_STARTUP_TIMEOUT, ERR_WRITER_NOT_INITIALIZED, ERR_ZIP_NOT_EMPTY, HttpRangeReader, HttpReader, Reader, SplitDataReader, SplitDataWriter, TextReader, TextWriter, Uint8ArrayReader, Uint8ArrayWriter, Writer, ZipDirectoryEntry, ZipEntry, ZipFS, ZipFileEntry, ZipReader, ZipReaderStream, ZipWriter, ZipWriterStream, configure, createBlobTempStream, createOPFSTempStream, createSyncAccessHandleTempStream, fs, getMimeType, registerCodec, resetConfiguration, terminateWorkersAndModule as terminateWorkers, unregisterCodec };
