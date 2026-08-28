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
const OPTION_CENTRAL_EXTRA_FIELD = "centralExtraField";
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
const ERR_INVALID_CRC32 = ERR_INVALID_SIGNATURE;
const ERR_UNSUPPORTED_COMPRESSION$2 = "Compression method not supported";
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
		throw new Error(ERR_UNSUPPORTED_COMPRESSION$2);
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
const ERR_UNSUPPORTED_UINT64 = "64-bit value exceeds Number.MAX_SAFE_INTEGER";
const WARNING_UNSORTED_CENTRAL_DIRECTORY = "unsorted central directory";
const WARNING_UNKNOWN_VERSION = "unknown version needed to extract";
const WARNING_COMPRESSED_PATCHED_DATA = "compressed patched data";
const WARNING_MALFORMED_EXTRA_FIELD = "malformed extra field";
const WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA = "unknown zip64 extensible data";
const WARNING_WRAPPED_ENTRIES_COUNT = "wrapped entries count";
const WARNING_APPENDED_DATA = "appended data";
const WARNING_PREPENDED_DATA = "prepended data";
const WARNING_TRAILING_CENTRAL_DIRECTORY_DATA = "trailing central directory data";
const WARNING_DUPLICATE_FILENAME = "duplicate filename";
const WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY = "mismatched zip64 end of central directory record";
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
			throwAmbiguousArchive("multiple end of central directory records");
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
				internalFileAttribute: fileEntry.internalFileAttributes,
				externalFileAttribute: fileEntry.externalFileAttributes,
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
				await fileEntry.getData(writer, entry, zipReader.readRanges, options);
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
		const dataOffset = localDirectory.dataOffset = localHeaderOffset + HEADER_SIZE + filenameLength + extraFieldLength;
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

function validateLocalDirectory(zipEntry, localDirectory, rawLocalFilename, checkLocalFilename, warnings) {
	const { rawFilename } = zipEntry;
	const reject = !warnings;
	const maskedLocalDirectory = zipEntry.decryptedDirectory &&
		(localDirectory.rawBitFlag & BITFLAG_MASKED_LOCAL_HEADERS) == BITFLAG_MASKED_LOCAL_HEADERS;
	if (checkLocalFilename && !maskedLocalDirectory &&
		(rawLocalFilename.length != rawFilename.length ||
			rawLocalFilename.some((byteValue, indexByte) => byteValue != rawFilename[indexByte]))) {
		reportAmbiguity(reject, warnings, "mismatched local file header (filename)");
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

function addWarning(warnings, reason, filename) {
	if (!warnings.some(warning => warning.reason == reason)) {
		const warning = { reason };
		if (filename !== UNDEFINED_VALUE) {
			warning.filename = filename;
		}
		warnings.push(warning);
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
	ERR_INVALID_SIGNATURE: ERR_INVALID_SIGNATURE,
	ERR_INVALID_STRICTNESS: ERR_INVALID_STRICTNESS,
	ERR_INVALID_UNCOMPRESSED_SIZE: ERR_INVALID_UNCOMPRESSED_SIZE,
	ERR_LOCAL_FILE_HEADER_NOT_FOUND: ERR_LOCAL_FILE_HEADER_NOT_FOUND,
	ERR_OVERLAPPING_ENTRY: ERR_OVERLAPPING_ENTRY,
	ERR_SPLIT_ZIP_FILE: ERR_SPLIT_ZIP_FILE,
	ERR_UNSAFE_FILENAME: ERR_UNSAFE_FILENAME,
	ERR_UNSUPPORTED_COMPRESSION: ERR_UNSUPPORTED_COMPRESSION$1,
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
	WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY: WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY,
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
const EXTRAFIELD_OFFSET_AES_COMPRESSION_METHOD = 9;
const EXTRAFIELD_USDZ_MAX_LENGTH = 67;
const VENDOR_VERSION_AE_1 = 1;
const INFOZIP_EXTRA_FIELD_TYPE = "infozip";
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
			pendingErrors: [],
			bufferedWrites: 0,
			lastFileEntry: UNDEFINED_VALUE
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
					extendedTimestamp: false,
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
		const unobservedWatchers = zipWriter.pendingErrors.filter(watcher => watcher.error && !watcher.observed);
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

function watchPromiseError(zipWriter, promise) {
	const watchedPromise = new WatchedPromise((resolve, reject) => Promise.prototype.then.call(promise, resolve, reject));
	const watcher = {};
	watchedPromise.watcher = watcher;
	watcher.recorded = Promise.prototype.then.call(watchedPromise, UNDEFINED_VALUE, error => watcher.error = error);
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
			diskNumberStart: diskNumber,
			[OPTION_USDZ]: zipWriter.options[OPTION_USDZ]
		});
		const headerInfo = getHeaderInfo(options);
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
		extraField,
		[PROPERTY_NAME_DEPRECATED_INTERNAL_FILE_ATTRIBUTES]: fileEntry.internalFileAttributes,
		[PROPERTY_NAME_DEPRECATED_EXTERNAL_FILE_ATTRIBUTES]: fileEntry.externalFileAttributes
	});
	return new Entry(fileEntry);
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
	const version = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION);
	if (version !== UNDEFINED_VALUE && version > MAX_16_BITS) {
		throw new Error(ERR_INVALID_VERSION);
	}
	const lastModDate = getDateOptionValue(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE, new Date());
	const rawLastModDate = getOptionValue(zipWriter, options, PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
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
	checkIntegerOption(level, MAX_LEVEL, ERR_INVALID_LEVEL);
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
	if (dataDescriptor === UNDEFINED_VALUE || (zipCrypto && !passThrough)) {
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
	const emptyEntry = !encryptedEntry && (!hasContent || (contentSize === 0 && !passThrough)) && !isCompressed(compressionMethod, level);
	if (emptyEntry && !zipCrypto && getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR) === UNDEFINED_VALUE) {
		dataDescriptor = false;
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
			emptyEntry,
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
	let releaseLockWriter;
	let writingBufferedEntryData;
	let writingEntryData;
	let writerSizeBeforeEntry;
	let flushedBufferedSize = 0;
	let fileWriter;
	const lockPreviousFileEntry = keepOrder && previousFileEntry ? previousFileEntry.lockFileEntry : UNDEFINED_VALUE;
	fileEntries.set(name, fileEntry);
	try {
		if (options.bufferedWrite || !keepOrder || zipWriter.writerLocked || zipWriter.bufferedWrites || (!dataDescriptor && !emptyEntry)) {
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
				inputSize: size,
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
		if (passThrough && crc32 !== UNDEFINED_VALUE) {
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
	const { directoryStart, directoryEnd, directoryArray } = await writeDirectoryRecords(zipWriter, directoryDataLength, options);
	const signatureLength = await writeDigitalSignatureRecord(zipWriter, directoryArray, options);
	await writeEndOfDirectoryRecord(zipWriter, comment, options, { directoryStart, directoryEnd, directoryDataLength, signatureLength });
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
			rawCentralExtraField,
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
			rawExtraField,
			rawCentralExtraField);
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
	const { directoryStart, directoryEnd, signatureLength } = cdInfo;
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

const VERSION = "2.8.61";

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

const FORMAT_DEFLATE = "deflate";
const FORMAT_DEFLATE_RAW = "deflate-raw";
const FORMAT_DEFLATE64_RAW = "deflate64-raw";
const FORMAT_GZIP = "gzip";

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
					if (type === FORMAT_GZIP) {
						result = wasm.deflate_init_gzip(this.streamHandle, level);
					} else if (type === FORMAT_DEFLATE_RAW) {
						result = wasm.deflate_init_raw(this.streamHandle, level);
					} else {
						result = wasm.deflate_init(this.streamHandle, level);
					}
				} else {
					if (type === FORMAT_DEFLATE64_RAW) {
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
						if (type === FORMAT_DEFLATE_RAW) {
							result = wasm.inflate_init_raw(this.streamHandle);
						} else if (type === FORMAT_GZIP) {
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

export { BlobReader, BlobWriter, Data64URIReader, Data64URIWriter, ERR_AMBIGUOUS_ARCHIVE, ERR_BAD_FORMAT, ERR_CENTRAL_DIRECTORY_NOT_FOUND, ERR_DUPLICATED_NAME, ERR_ENCRYPTED, ERR_ENCRYPTED_CENTRAL_DIRECTORY, ERR_ENTRY_DATA_OUT_OF_BOUNDS, ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND, ERR_EOCDR_NOT_FOUND, ERR_EXTRAFIELD_ZIP64_NOT_FOUND, ERR_HTTP_RANGE, ERR_HTTP_RESOURCE_CHANGED, ERR_INVALID_AUTHENTICATION_CODE, ERR_INVALID_CODEC_DEFINITION, ERR_INVALID_CODEC_MODULE, ERR_INVALID_COMMENT, ERR_INVALID_COMMENT_TYPE, ERR_INVALID_COMPRESSED_DATA, ERR_INVALID_CRC32, ERR_INVALID_DATE, ERR_INVALID_ENCRYPTION_STRENGTH, ERR_INVALID_ENTRY_COMMENT, ERR_INVALID_ENTRY_COMMENT_TYPE, ERR_INVALID_ENTRY_NAME, ERR_INVALID_EXTRAFIELD, ERR_INVALID_EXTRAFIELD_DATA, ERR_INVALID_EXTRAFIELD_DATA_TYPE, ERR_INVALID_EXTRAFIELD_TYPE, ERR_INVALID_FILENAME_VALIDATION, ERR_INVALID_FUNCTION_OPTION, ERR_INVALID_GID, ERR_INVALID_LEVEL, ERR_INVALID_MAX_APPENDED_DATA_SIZE, ERR_INVALID_MAX_WORKERS, ERR_INVALID_MSDOS_ATTRIBUTES, ERR_INVALID_MSDOS_DATA, ERR_INVALID_PASSWORD, ERR_INVALID_PASSWORD_TYPE, ERR_INVALID_SIGNAL, ERR_INVALID_SIGNATURE, ERR_INVALID_SIGNATURE_DATA, ERR_INVALID_STRICTNESS, ERR_INVALID_UID, ERR_INVALID_UNCOMPRESSED_SIZE, ERR_INVALID_UNIX_EXTRA_FIELD_TYPE, ERR_INVALID_UNIX_ID_SIZE, ERR_INVALID_UNIX_MODE, ERR_INVALID_VERSION, ERR_ITERATOR_COMPLETED_TOO_SOON, ERR_LOCAL_FILE_HEADER_NOT_FOUND, ERR_OVERLAPPING_ENTRY, ERR_RESERVED_COMPRESSION_METHOD, ERR_SPLIT_ZIP_FILE, ERR_UNDEFINED_COMPRESSION_METHOD, ERR_UNDEFINED_READER, ERR_UNDEFINED_UNCOMPRESSED_SIZE, ERR_UNDETERMINED_SIZE, ERR_UNSAFE_FILENAME, ERR_UNSUPPORTED_COMPRESSION$1 as ERR_UNSUPPORTED_COMPRESSION, ERR_UNSUPPORTED_CONTEXT, ERR_UNSUPPORTED_CRYPTO_API, ERR_UNSUPPORTED_ENCRYPTION, ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH, ERR_UNSUPPORTED_ENCRYPTION_USDZ, ERR_UNSUPPORTED_FORMAT, ERR_UNSUPPORTED_UINT64, ERR_WORKER_STARTUP_TIMEOUT, ERR_WRITER_NOT_INITIALIZED, ERR_ZIP_NOT_EMPTY, HttpRangeReader, HttpReader, Reader, SplitDataReader, SplitDataWriter, TextReader, TextWriter, Uint8ArrayReader, Uint8ArrayWriter, VERSION, WARNING_APPENDED_DATA, WARNING_COMPRESSED_PATCHED_DATA, WARNING_DUPLICATE_FILENAME, WARNING_MALFORMED_EXTRA_FIELD, WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG, WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD, WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY, WARNING_PREPENDED_DATA, WARNING_TRAILING_CENTRAL_DIRECTORY_DATA, WARNING_UNKNOWN_VERSION, WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA, WARNING_UNSORTED_CENTRAL_DIRECTORY, WARNING_WRAPPED_ENTRIES_COUNT, Writer, ZipReader, ZipReaderStream, ZipWriter, ZipWriterStream, configure, createBlobTempStream, createOPFSTempStream, createSyncAccessHandleTempStream, getMimeType, getRegisteredCodecs, getSupportedCompressionMethods, isZipFile, registerCodec, resetConfiguration, terminateWorkersAndModule as terminateWorkers, unregisterCodec };
