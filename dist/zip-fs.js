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
	const STRING_TYPE = "string";
	const NUMBER_TYPE = "number";

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
		"createWorker",
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
		"CompressionStreamFallback",
		"DecompressionStreamFallback"
	];

	const config = { ...DEFAULT_CONFIGURATION };

	function getConfiguration() {
		return config;
	}

	function getChunkSize(config) {
		return Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
	}

	function configure(configuration) {
		configuration = normalizeConfiguration(configuration);
		for (const propertyName of CONFIGURABLE_PROPERTY_NAMES) {
			const propertyValue = configuration[propertyName];
			if (propertyValue !== UNDEFINED_VALUE) {
				config[propertyName] = propertyValue;
			}
		}
	}

	function normalizeConfiguration(configuration) {
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
		configuration = normalizeConfiguration(configuration);
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

	var workerCode = "(function (factory) {\n\ttypeof define === 'function' && define.amd ? define(factory) :\n\tfactory();\n})((function () { 'use strict';\n\n\tconst { Array, Object, Number, Math, Error, Uint8Array, Uint16Array, Uint32Array, Int32Array, Map, DataView, Promise, TextEncoder, crypto, postMessage, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream } = self;\n\n\t/*\n\t Copyright (c) 2022 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tconst UNDEFINED_VALUE = undefined;\n\tconst UNDEFINED_TYPE = \"undefined\";\n\tconst FUNCTION_TYPE = \"function\";\n\n\tconst EMPTY_UINT8_ARRAY = new Uint8Array();\n\n\t/*\n\t Copyright (c) 2022 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\t// Slicing-by-8 CRC-32 (Intel / zlib). The eight 256-entry tables let the inner loop\n\t// consume 8 bytes per iteration with a shorter dependency chain, ~4x the byte-at-a-time\n\t// rate (measured ~320 -> ~1400 MB/s on 64KB chunks).\n\t//\n\t// Every table MUST stay a PACKED_SMI array: build with array literals (not `new Array(n)`,\n\t// which is HOLEY) and store the signed int32 XOR result (no `>>> 0`). An unsigned or holey\n\t// table becomes a V8 FixedDoubleArray whose every hot-loop lookup unboxes a double (~1.6x\n\t// slower). Signedness is irrelevant to the result — the reads mask/shift it and the final\n\t// `~crc` normalizes it. Do NOT reintroduce `>>> 0` here or switch to `new Array(256)`.\n\tconst T = [[], [], [], [], [], [], [], []];\n\tfor (let n = 0; n < 256; n++) {\n\t\tlet t = n;\n\t\tfor (let j = 0; j < 8; j++) {\n\t\t\tt = (t & 1) ? (t >>> 1) ^ 0xEDB88320 : t >>> 1;\n\t\t}\n\t\tT[0][n] = t;\n\t}\n\tfor (let n = 0; n < 256; n++) {\n\t\tfor (let k = 1; k < 8; k++) {\n\t\t\tconst previous = T[k - 1][n];\n\t\t\tT[k][n] = (previous >>> 8) ^ T[0][previous & 0xFF];\n\t\t}\n\t}\n\tconst [T0, T1, T2, T3, T4, T5, T6, T7] = T;\n\n\tclass Crc32 {\n\n\t\tconstructor(crc) {\n\t\t\tthis.crc = crc || -1;\n\t\t}\n\n\t\tappend(data) {\n\t\t\tlet crc = this.crc | 0;\n\t\t\tconst length = data.length | 0;\n\t\t\tlet offset = 0;\n\t\t\t// Process 8 bytes per iteration over the typed-array body. DataView.getInt32(le)\n\t\t\t// reads an unaligned little-endian word as a signed int32 (no double boxing), so no\n\t\t\t// alignment or endianness handling is needed; data.buffer guards non-typed inputs.\n\t\t\tif (length >= 8 && data.buffer) {\n\t\t\t\tconst view = new DataView(data.buffer, data.byteOffset, length);\n\t\t\t\tconst end = length - 8;\n\t\t\t\tfor (; offset <= end; offset += 8) {\n\t\t\t\t\tconst a = crc ^ view.getInt32(offset, true);\n\t\t\t\t\tconst b = view.getInt32(offset + 4, true);\n\t\t\t\t\tcrc = T7[a & 0xFF] ^ T6[(a >>> 8) & 0xFF] ^ T5[(a >>> 16) & 0xFF] ^ T4[(a >>> 24) & 0xFF] ^\n\t\t\t\t\t\tT3[b & 0xFF] ^ T2[(b >>> 8) & 0xFF] ^ T1[(b >>> 16) & 0xFF] ^ T0[(b >>> 24) & 0xFF];\n\t\t\t\t}\n\t\t\t}\n\t\t\t// Remaining tail (and non-typed inputs) byte-at-a-time with the base table.\n\t\t\tfor (; offset < length; offset++) {\n\t\t\t\tcrc = (crc >>> 8) ^ T0[(crc ^ data[offset]) & 0xFF];\n\t\t\t}\n\t\t\tthis.crc = crc;\n\t\t}\n\n\t\tget() {\n\t\t\treturn ~this.crc;\n\t\t}\n\t}\n\n\t/*\n\t Copyright (c) 2022 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tclass Crc32Stream extends TransformStream {\n\n\t\tconstructor() {\n\t\t\t// deno-lint-ignore prefer-const\n\t\t\tlet stream;\n\t\t\tconst crc32 = new Crc32();\n\t\t\tsuper({\n\t\t\t\ttransform(chunk, controller) {\n\t\t\t\t\tcrc32.append(chunk);\n\t\t\t\t\tcontroller.enqueue(chunk);\n\t\t\t\t},\n\t\t\t\tflush() {\n\t\t\t\t\tconst value = new Uint8Array(4);\n\t\t\t\t\tconst dataView = new DataView(value.buffer);\n\t\t\t\t\tdataView.setUint32(0, crc32.get());\n\t\t\t\t\tstream.value = value;\n\t\t\t\t}\n\t\t\t});\n\t\t\tstream = this;\n\t\t}\n\t}\n\n\t/*\n\t Copyright (c) 2022 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tfunction encodeText(value) {\n\t\t// deno-lint-ignore valid-typeof\n\t\tif (typeof TextEncoder == UNDEFINED_TYPE) {\n\t\t\tvalue = unescape(encodeURIComponent(value));\n\t\t\tconst result = new Uint8Array(value.length);\n\t\t\tfor (let i = 0; i < result.length; i++) {\n\t\t\t\tresult[i] = value.charCodeAt(i);\n\t\t\t}\n\t\t\treturn result;\n\t\t} else {\n\t\t\treturn new TextEncoder().encode(value);\n\t\t}\n\t}\n\n\t/*\n\t Copyright (c) 2026 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright\n\t notice, this list of conditions and the following disclaimer in\n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tfunction concat(first, second) {\n\t\tconst result = new Uint8Array(first.length + second.length);\n\t\tresult.set(first);\n\t\tresult.set(second, first.length);\n\t\treturn result;\n\t}\n\n\tfunction toExactUint8Array(array) {\n\t\treturn array.byteOffset || array.byteLength != array.buffer.byteLength ? new Uint8Array(array) : array;\n\t}\n\n\tfunction getDataView(array) {\n\t\treturn new DataView(array.buffer, array.byteOffset, array.byteLength);\n\t}\n\n\t// Derived from https://github.com/xqdoo00o/jszip/blob/master/lib/sjcl.js and https://github.com/bitwiseshiftleft/sjcl\n\n\t// deno-lint-ignore-file no-this-alias\n\n\t/*\n\t * SJCL is open. You can use, modify and redistribute it under a BSD\n\t * license or under the GNU GPL, version 2.0.\n\t */\n\n\t/** @fileOverview Javascript cryptography implementation.\n\t *\n\t * Crush to remove comments, shorten variable names and\n\t * generally reduce transmission size.\n\t *\n\t * @author Emily Stark\n\t * @author Mike Hamburg\n\t * @author Dan Boneh\n\t */\n\n\t/*jslint indent: 2, bitwise: false, nomen: false, plusplus: false, white: false, regexp: false */\n\n\t/** @fileOverview Arrays of bits, encoded as arrays of Numbers.\n\t *\n\t * @author Emily Stark\n\t * @author Mike Hamburg\n\t * @author Dan Boneh\n\t */\n\n\t/**\n\t * Arrays of bits, encoded as arrays of Numbers.\n\t * @namespace\n\t * @description\n\t * <p>\n\t * These objects are the currency accepted by SJCL's crypto functions.\n\t * </p>\n\t *\n\t * <p>\n\t * Most of our crypto primitives operate on arrays of 4-byte words internally,\n\t * but many of them can take arguments that are not a multiple of 4 bytes.\n\t * This library encodes arrays of bits (whose size need not be a multiple of 8\n\t * bits) as arrays of 32-bit words.  The bits are packed, big-endian, into an\n\t * array of words, 32 bits at a time.  Since the words are double-precision\n\t * floating point numbers, they fit some extra data.  We use this (in a private,\n\t * possibly-changing manner) to encode the number of bits actually  present\n\t * in the last word of the array.\n\t * </p>\n\t *\n\t * <p>\n\t * Because bitwise ops clear this out-of-band data, these arrays can be passed\n\t * to ciphers like AES which want arrays of words.\n\t * </p>\n\t */\n\tconst bitArray = {\n\t\t/**\n\t\t * Concatenate two bit arrays.\n\t\t * @param {bitArray} a1 The first array.\n\t\t * @param {bitArray} a2 The second array.\n\t\t * @return {bitArray} The concatenation of a1 and a2.\n\t\t */\n\t\tconcat(a1, a2) {\n\t\t\tif (a1.length === 0 || a2.length === 0) {\n\t\t\t\treturn a1.concat(a2);\n\t\t\t}\n\n\t\t\tconst last = a1[a1.length - 1], shift = bitArray.getPartial(last);\n\t\t\tif (shift === 32) {\n\t\t\t\treturn a1.concat(a2);\n\t\t\t} else {\n\t\t\t\treturn bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Find the length of an array of bits.\n\t\t * @param {bitArray} a The array.\n\t\t * @return {Number} The length of a, in bits.\n\t\t */\n\t\tbitLength(a) {\n\t\t\tconst l = a.length;\n\t\t\tif (l === 0) {\n\t\t\t\treturn 0;\n\t\t\t}\n\t\t\tconst x = a[l - 1];\n\t\t\treturn (l - 1) * 32 + bitArray.getPartial(x);\n\t\t},\n\n\t\t/**\n\t\t * Truncate an array.\n\t\t * @param {bitArray} a The array.\n\t\t * @param {Number} len The length to truncate to, in bits.\n\t\t * @return {bitArray} A new array, truncated to len bits.\n\t\t */\n\t\tclamp(a, len) {\n\t\t\tif (a.length * 32 < len) {\n\t\t\t\treturn a;\n\t\t\t}\n\t\t\ta = a.slice(0, Math.ceil(len / 32));\n\t\t\tconst l = a.length;\n\t\t\tlen = len & 31;\n\t\t\tif (l > 0 && len) {\n\t\t\t\ta[l - 1] = bitArray.partial(len, a[l - 1] & 0x80000000 >> (len - 1), 1);\n\t\t\t}\n\t\t\treturn a;\n\t\t},\n\n\t\t/**\n\t\t * Make a partial word for a bit array.\n\t\t * @param {Number} len The number of bits in the word.\n\t\t * @param {Number} x The bits.\n\t\t * @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.\n\t\t * @return {Number} The partial word.\n\t\t */\n\t\tpartial(len, x, _end) {\n\t\t\tif (len === 32) {\n\t\t\t\treturn x;\n\t\t\t}\n\t\t\treturn (_end ? x | 0 : x << (32 - len)) + len * 0x10000000000;\n\t\t},\n\n\t\t/**\n\t\t * Get the number of bits used by a partial word.\n\t\t * @param {Number} x The partial word.\n\t\t * @return {Number} The number of bits used by the partial word.\n\t\t */\n\t\tgetPartial(x) {\n\t\t\treturn Math.round(x / 0x10000000000) || 32;\n\t\t},\n\n\t\t/** Shift an array right.\n\t\t * @param {bitArray} a The array to shift.\n\t\t * @param {Number} shift The number of bits to shift.\n\t\t * @param {Number} [carry=0] A byte to carry in\n\t\t * @param {bitArray} [out=[]] An array to prepend to the output.\n\t\t * @private\n\t\t */\n\t\t_shiftRight(a, shift, carry, out) {\n\t\t\tif (out === undefined) {\n\t\t\t\tout = [];\n\t\t\t}\n\n\t\t\tfor (; shift >= 32; shift -= 32) {\n\t\t\t\tout.push(carry);\n\t\t\t\tcarry = 0;\n\t\t\t}\n\t\t\tif (shift === 0) {\n\t\t\t\treturn out.concat(a);\n\t\t\t}\n\n\t\t\tfor (let i = 0; i < a.length; i++) {\n\t\t\t\tout.push(carry | a[i] >>> shift);\n\t\t\t\tcarry = a[i] << (32 - shift);\n\t\t\t}\n\t\t\tconst last2 = a.length ? a[a.length - 1] : 0;\n\t\t\tconst shift2 = bitArray.getPartial(last2);\n\t\t\tout.push(bitArray.partial(shift + shift2 & 31, (shift + shift2 > 32) ? carry : out.pop(), 1));\n\t\t\treturn out;\n\t\t}\n\t};\n\n\t/** @fileOverview Bit array codec implementations.\n\t *\n\t * @author Emily Stark\n\t * @author Mike Hamburg\n\t * @author Dan Boneh\n\t */\n\n\t/**\n\t * Arrays of bytes\n\t * @namespace\n\t */\n\tconst codec = {\n\t\tbytes: {\n\t\t\t/** Convert from a bitArray to an array of bytes. */\n\t\t\tfromBits(arr) {\n\t\t\t\tconst bl = bitArray.bitLength(arr);\n\t\t\t\tconst byteLength = bl / 8;\n\t\t\t\tconst out = new Uint8Array(byteLength);\n\t\t\t\tlet tmp;\n\t\t\t\tfor (let i = 0; i < byteLength; i++) {\n\t\t\t\t\tif ((i & 3) === 0) {\n\t\t\t\t\t\ttmp = arr[i / 4];\n\t\t\t\t\t}\n\t\t\t\t\tout[i] = tmp >>> 24;\n\t\t\t\t\ttmp <<= 8;\n\t\t\t\t}\n\t\t\t\treturn out;\n\t\t\t},\n\t\t\t/** Convert from an array of bytes to a bitArray. */\n\t\t\ttoBits(bytes) {\n\t\t\t\tconst out = [];\n\t\t\t\tlet i;\n\t\t\t\tlet tmp = 0;\n\t\t\t\tfor (i = 0; i < bytes.length; i++) {\n\t\t\t\t\ttmp = tmp << 8 | bytes[i];\n\t\t\t\t\tif ((i & 3) === 3) {\n\t\t\t\t\t\tout.push(tmp);\n\t\t\t\t\t\ttmp = 0;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif (i & 3) {\n\t\t\t\t\tout.push(bitArray.partial(8 * (i & 3), tmp));\n\t\t\t\t}\n\t\t\t\treturn out;\n\t\t\t}\n\t\t}\n\t};\n\n\tconst hash = {};\n\n\t/**\n\t * Context for a SHA-1 operation in progress.\n\t * @constructor\n\t */\n\thash.sha1 = class {\n\t\tconstructor(hash) {\n\t\t\tconst sha1 = this;\n\t\t\t/**\n\t\t\t * The hash's block size, in bits.\n\t\t\t * @constant\n\t\t\t */\n\t\t\tsha1.blockSize = 512;\n\t\t\t/**\n\t\t\t * The SHA-1 initialization vector.\n\t\t\t * @private\n\t\t\t */\n\t\t\tsha1._init = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];\n\t\t\t/**\n\t\t\t * The SHA-1 hash key.\n\t\t\t * @private\n\t\t\t */\n\t\t\tsha1._key = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];\n\t\t\tif (hash) {\n\t\t\t\tsha1._h = hash._h.slice(0);\n\t\t\t\tsha1._buffer = hash._buffer.slice(0);\n\t\t\t\tsha1._length = hash._length;\n\t\t\t} else {\n\t\t\t\tsha1.reset();\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Reset the hash state.\n\t\t * @return this\n\t\t */\n\t\treset() {\n\t\t\tconst sha1 = this;\n\t\t\tsha1._h = sha1._init.slice(0);\n\t\t\tsha1._buffer = [];\n\t\t\tsha1._length = 0;\n\t\t\treturn sha1;\n\t\t}\n\n\t\t/**\n\t\t * Input several words to the hash.\n\t\t * @param {bitArray|String} data the data to hash.\n\t\t * @return this\n\t\t */\n\t\tupdate(data) {\n\t\t\tconst sha1 = this;\n\t\t\tif (typeof data === \"string\") {\n\t\t\t\tdata = codec.utf8String.toBits(data);\n\t\t\t}\n\t\t\tconst b = sha1._buffer = bitArray.concat(sha1._buffer, data);\n\t\t\tconst ol = sha1._length;\n\t\t\tconst nl = sha1._length = ol + bitArray.bitLength(data);\n\t\t\tif (nl > 9007199254740991) {\n\t\t\t\tthrow new Error(\"Cannot hash more than 2^53 - 1 bits\");\n\t\t\t}\n\t\t\tconst c = new Uint32Array(b);\n\t\t\tlet j = 0;\n\t\t\tfor (let i = sha1.blockSize + ol - ((sha1.blockSize + ol) & (sha1.blockSize - 1)); i <= nl;\n\t\t\t\ti += sha1.blockSize) {\n\t\t\t\tsha1._block(c.subarray(16 * j, 16 * (j + 1)));\n\t\t\t\tj += 1;\n\t\t\t}\n\t\t\tb.splice(0, 16 * j);\n\t\t\treturn sha1;\n\t\t}\n\n\t\t/**\n\t\t * Complete hashing and output the hash value.\n\t\t * @return {bitArray} The hash value, an array of 5 big-endian words. TODO\n\t\t */\n\t\tfinalize() {\n\t\t\tconst sha1 = this;\n\t\t\tlet b = sha1._buffer;\n\t\t\tconst h = sha1._h;\n\n\t\t\t// Round out and push the buffer\n\t\t\tb = bitArray.concat(b, [bitArray.partial(1, 1)]);\n\t\t\t// Round out the buffer to a multiple of 16 words, less the 2 length words.\n\t\t\tfor (let i = b.length + 2; i & 15; i++) {\n\t\t\t\tb.push(0);\n\t\t\t}\n\n\t\t\t// append the length\n\t\t\tb.push(Math.floor(sha1._length / 0x100000000));\n\t\t\tb.push(sha1._length | 0);\n\n\t\t\twhile (b.length) {\n\t\t\t\tsha1._block(b.splice(0, 16));\n\t\t\t}\n\n\t\t\tsha1.reset();\n\t\t\treturn h;\n\t\t}\n\n\t\t/**\n\t\t * The SHA-1 logical functions f(0), f(1), ..., f(79).\n\t\t * @private\n\t\t */\n\t\t_f(t, b, c, d) {\n\t\t\tif (t <= 19) {\n\t\t\t\treturn (b & c) | (~b & d);\n\t\t\t} else if (t <= 39) {\n\t\t\t\treturn b ^ c ^ d;\n\t\t\t} else if (t <= 59) {\n\t\t\t\treturn (b & c) | (b & d) | (c & d);\n\t\t\t} else if (t <= 79) {\n\t\t\t\treturn b ^ c ^ d;\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Circular left-shift operator.\n\t\t * @private\n\t\t */\n\t\t_S(n, x) {\n\t\t\treturn (x << n) | (x >>> 32 - n);\n\t\t}\n\n\t\t/**\n\t\t * Perform one cycle of SHA-1.\n\t\t * @param {Uint32Array|bitArray} words one block of words.\n\t\t * @private\n\t\t */\n\t\t_block(words) {\n\t\t\tconst sha1 = this;\n\t\t\tconst h = sha1._h;\n\t\t\t// When words is passed to _block, it has 16 elements. SHA1 _block\n\t\t\t// function extends words with new elements (at the end there are 80 elements). \n\t\t\t// The problem is that if we use Uint32Array instead of Array, \n\t\t\t// the length of Uint32Array cannot be changed. Thus, we replace words with a \n\t\t\t// normal Array here.\n\t\t\tconst w = Array(80); // do not use Uint32Array here as the instantiation is slower\n\t\t\tfor (let j = 0; j < 16; j++) {\n\t\t\t\tw[j] = words[j];\n\t\t\t}\n\n\t\t\tlet a = h[0];\n\t\t\tlet b = h[1];\n\t\t\tlet c = h[2];\n\t\t\tlet d = h[3];\n\t\t\tlet e = h[4];\n\n\t\t\tfor (let t = 0; t <= 79; t++) {\n\t\t\t\tif (t >= 16) {\n\t\t\t\t\tw[t] = sha1._S(1, w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16]);\n\t\t\t\t}\n\t\t\t\tconst tmp = (sha1._S(5, a) + sha1._f(t, b, c, d) + e + w[t] +\n\t\t\t\t\tsha1._key[Math.floor(t / 20)]) | 0;\n\t\t\t\te = d;\n\t\t\t\td = c;\n\t\t\t\tc = sha1._S(30, b);\n\t\t\t\tb = a;\n\t\t\t\ta = tmp;\n\t\t\t}\n\n\t\t\th[0] = (h[0] + a) | 0;\n\t\t\th[1] = (h[1] + b) | 0;\n\t\t\th[2] = (h[2] + c) | 0;\n\t\t\th[3] = (h[3] + d) | 0;\n\t\t\th[4] = (h[4] + e) | 0;\n\t\t}\n\t};\n\n\t/** @fileOverview Low-level AES implementation.\n\t *\n\t * This file contains a low-level implementation of AES, optimized for\n\t * size and for efficiency on several browsers.  It is based on\n\t * OpenSSL's aes_core.c, a public-domain implementation by Vincent\n\t * Rijmen, Antoon Bosselaers and Paulo Barreto.\n\t *\n\t * An older version of this implementation is available in the public\n\t * domain, but this one is (c) Emily Stark, Mike Hamburg, Dan Boneh,\n\t * Stanford University 2008-2010 and BSD-licensed for liability\n\t * reasons.\n\t *\n\t * @author Emily Stark\n\t * @author Mike Hamburg\n\t * @author Dan Boneh\n\t */\n\n\tconst cipher = {};\n\n\t/**\n\t * Schedule out an AES key for both encryption and decryption.  This\n\t * is a low-level class.  Use a cipher mode to do bulk encryption.\n\t *\n\t * @constructor\n\t * @param {Array} key The key as an array of 4, 6 or 8 words.\n\t */\n\tcipher.aes = class {\n\t\tconstructor(key) {\n\t\t\t/**\n\t\t\t * The expanded S-box and inverse S-box tables.  These will be computed\n\t\t\t * on the client so that we don't have to send them down the wire.\n\t\t\t *\n\t\t\t * There are two tables, _tables[0] is for encryption and\n\t\t\t * _tables[1] is for decryption.\n\t\t\t *\n\t\t\t * The first 4 sub-tables are the expanded S-box with MixColumns.  The\n\t\t\t * last (_tables[01][4]) is the S-box itself.\n\t\t\t *\n\t\t\t * @private\n\t\t\t */\n\t\t\tconst aes = this;\n\t\t\taes._tables = [[[], [], [], [], []], [[], [], [], [], []]];\n\n\t\t\tif (!aes._tables[0][0][0]) {\n\t\t\t\taes._precompute();\n\t\t\t}\n\n\t\t\tconst sbox = aes._tables[0][4];\n\t\t\tconst decTable = aes._tables[1];\n\t\t\tconst keyLen = key.length;\n\n\t\t\tlet i, encKey, decKey, rcon = 1;\n\n\t\t\tif (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) {\n\t\t\t\tthrow new Error(\"invalid aes key size\");\n\t\t\t}\n\n\t\t\taes._key = [encKey = key.slice(0), decKey = []];\n\n\t\t\t// schedule encryption keys\n\t\t\tfor (i = keyLen; i < 4 * keyLen + 28; i++) {\n\t\t\t\tlet tmp = encKey[i - 1];\n\n\t\t\t\t// apply sbox\n\t\t\t\tif (i % keyLen === 0 || (keyLen === 8 && i % keyLen === 4)) {\n\t\t\t\t\ttmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255] << 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255];\n\n\t\t\t\t\t// shift rows and add rcon\n\t\t\t\t\tif (i % keyLen === 0) {\n\t\t\t\t\t\ttmp = tmp << 8 ^ tmp >>> 24 ^ rcon << 24;\n\t\t\t\t\t\trcon = rcon << 1 ^ (rcon >> 7) * 283;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tencKey[i] = encKey[i - keyLen] ^ tmp;\n\t\t\t}\n\n\t\t\t// schedule decryption keys\n\t\t\tfor (let j = 0; i; j++, i--) {\n\t\t\t\tconst tmp = encKey[j & 3 ? i : i - 4];\n\t\t\t\tif (i <= 4 || j < 4) {\n\t\t\t\t\tdecKey[j] = tmp;\n\t\t\t\t} else {\n\t\t\t\t\tdecKey[j] = decTable[0][sbox[tmp >>> 24]] ^\n\t\t\t\t\t\tdecTable[1][sbox[tmp >> 16 & 255]] ^\n\t\t\t\t\t\tdecTable[2][sbox[tmp >> 8 & 255]] ^\n\t\t\t\t\t\tdecTable[3][sbox[tmp & 255]];\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t// public\n\t\t/* Something like this might appear here eventually\n\t\tname: \"AES\",\n\t\tblockSize: 4,\n\t\tkeySizes: [4,6,8],\n\t\t*/\n\n\t\t/**\n\t\t * Encrypt an array of 4 big-endian words.\n\t\t * @param {Array} data The plaintext.\n\t\t * @return {Array} The ciphertext.\n\t\t */\n\t\tencrypt(data) {\n\t\t\treturn this._crypt(data, 0);\n\t\t}\n\n\t\t/**\n\t\t * Decrypt an array of 4 big-endian words.\n\t\t * @param {Array} data The ciphertext.\n\t\t * @return {Array} The plaintext.\n\t\t */\n\t\tdecrypt(data) {\n\t\t\treturn this._crypt(data, 1);\n\t\t}\n\n\t\t/**\n\t\t * Expand the S-box tables.\n\t\t *\n\t\t * @private\n\t\t */\n\t\t_precompute() {\n\t\t\tconst encTable = this._tables[0];\n\t\t\tconst decTable = this._tables[1];\n\t\t\tconst sbox = encTable[4];\n\t\t\tconst sboxInv = decTable[4];\n\t\t\tconst d = [];\n\t\t\tconst th = [];\n\t\t\tlet xInv, x2, x4, x8;\n\n\t\t\t// Compute double and third tables\n\t\t\tfor (let i = 0; i < 256; i++) {\n\t\t\t\tth[(d[i] = i << 1 ^ (i >> 7) * 283) ^ i] = i;\n\t\t\t}\n\n\t\t\tfor (let x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {\n\t\t\t\t// Compute sbox\n\t\t\t\tlet s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;\n\t\t\t\ts = s >> 8 ^ s & 255 ^ 99;\n\t\t\t\tsbox[x] = s;\n\t\t\t\tsboxInv[s] = x;\n\n\t\t\t\t// Compute MixColumns\n\t\t\t\tx8 = d[x4 = d[x2 = d[x]]];\n\t\t\t\tlet tDec = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;\n\t\t\t\tlet tEnc = d[s] * 0x101 ^ s * 0x1010100;\n\n\t\t\t\tfor (let i = 0; i < 4; i++) {\n\t\t\t\t\tencTable[i][x] = tEnc = tEnc << 24 ^ tEnc >>> 8;\n\t\t\t\t\tdecTable[i][s] = tDec = tDec << 24 ^ tDec >>> 8;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t// Compactify.  Considerable speedup on Firefox.\n\t\t\tfor (let i = 0; i < 5; i++) {\n\t\t\t\tencTable[i] = encTable[i].slice(0);\n\t\t\t\tdecTable[i] = decTable[i].slice(0);\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Encryption and decryption core.\n\t\t * @param {Array} input Four words to be encrypted or decrypted.\n\t\t * @param dir The direction, 0 for encrypt and 1 for decrypt.\n\t\t * @return {Array} The four encrypted or decrypted words.\n\t\t * @private\n\t\t */\n\t\t_crypt(input, dir) {\n\t\t\tif (input.length !== 4) {\n\t\t\t\tthrow new Error(\"invalid aes block size\");\n\t\t\t}\n\n\t\t\tconst key = this._key[dir];\n\n\t\t\tconst nInnerRounds = key.length / 4 - 2;\n\t\t\tconst out = [0, 0, 0, 0];\n\t\t\tconst table = this._tables[dir];\n\n\t\t\t// load up the tables\n\t\t\tconst t0 = table[0];\n\t\t\tconst t1 = table[1];\n\t\t\tconst t2 = table[2];\n\t\t\tconst t3 = table[3];\n\t\t\tconst sbox = table[4];\n\n\t\t\t// state variables a,b,c,d are loaded with pre-whitened data\n\t\t\tlet a = input[0] ^ key[0];\n\t\t\tlet b = input[dir ? 3 : 1] ^ key[1];\n\t\t\tlet c = input[2] ^ key[2];\n\t\t\tlet d = input[dir ? 1 : 3] ^ key[3];\n\t\t\tlet kIndex = 4;\n\t\t\tlet a2, b2, c2;\n\n\t\t\t// Inner rounds.  Cribbed from OpenSSL.\n\t\t\tfor (let i = 0; i < nInnerRounds; i++) {\n\t\t\t\ta2 = t0[a >>> 24] ^ t1[b >> 16 & 255] ^ t2[c >> 8 & 255] ^ t3[d & 255] ^ key[kIndex];\n\t\t\t\tb2 = t0[b >>> 24] ^ t1[c >> 16 & 255] ^ t2[d >> 8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];\n\t\t\t\tc2 = t0[c >>> 24] ^ t1[d >> 16 & 255] ^ t2[a >> 8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];\n\t\t\t\td = t0[d >>> 24] ^ t1[a >> 16 & 255] ^ t2[b >> 8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];\n\t\t\t\tkIndex += 4;\n\t\t\t\ta = a2; b = b2; c = c2;\n\t\t\t}\n\n\t\t\t// Last round.\n\t\t\tfor (let i = 0; i < 4; i++) {\n\t\t\t\tout[dir ? 3 & -i : i] =\n\t\t\t\t\tsbox[a >>> 24] << 24 ^\n\t\t\t\t\tsbox[b >> 16 & 255] << 16 ^\n\t\t\t\t\tsbox[c >> 8 & 255] << 8 ^\n\t\t\t\t\tsbox[d & 255] ^\n\t\t\t\t\tkey[kIndex++];\n\t\t\t\ta2 = a; a = b; b = c; c = d; d = a2;\n\t\t\t}\n\n\t\t\treturn out;\n\t\t}\n\t};\n\n\t/** @fileOverview CTR mode implementation.\n\t *\n\t * Special thanks to Roy Nicholson for pointing out a bug in our\n\t * implementation.\n\t *\n\t * @author Emily Stark\n\t * @author Mike Hamburg\n\t * @author Dan Boneh\n\t */\n\n\t/** Brian Gladman's CTR Mode.\n\t* @constructor\n\t* @param {Object} _prf The aes instance to generate key.\n\t* @param {bitArray} _iv The iv for ctr mode, it must be 128 bits.\n\t*/\n\n\tconst mode = {};\n\n\t/**\n\t * Brian Gladman's CTR Mode.\n\t * @namespace\n\t */\n\tmode.ctrGladman = class {\n\t\tconstructor(prf, iv) {\n\t\t\tthis._prf = prf;\n\t\t\tthis._initIv = iv;\n\t\t\tthis._iv = iv;\n\t\t}\n\n\t\treset() {\n\t\t\tthis._iv = this._initIv;\n\t\t}\n\n\t\t/** Input some data to calculate.\n\t\t * @param {bitArray} data the data to process, it must be intergral multiple of 128 bits unless it's the last.\n\t\t */\n\t\tupdate(data) {\n\t\t\treturn this.calculate(this._prf, data, this._iv);\n\t\t}\n\n\t\tincWord(word) {\n\t\t\tif (((word >> 24) & 0xff) === 0xff) { //overflow\n\t\t\t\tlet b1 = (word >> 16) & 0xff;\n\t\t\t\tlet b2 = (word >> 8) & 0xff;\n\t\t\t\tlet b3 = word & 0xff;\n\n\t\t\t\tif (b1 === 0xff) { // overflow b1   \n\t\t\t\t\tb1 = 0;\n\t\t\t\t\tif (b2 === 0xff) {\n\t\t\t\t\t\tb2 = 0;\n\t\t\t\t\t\tif (b3 === 0xff) {\n\t\t\t\t\t\t\tb3 = 0;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t++b3;\n\t\t\t\t\t\t}\n\t\t\t\t\t} else {\n\t\t\t\t\t\t++b2;\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\t++b1;\n\t\t\t\t}\n\n\t\t\t\tword = 0;\n\t\t\t\tword += (b1 << 16);\n\t\t\t\tword += (b2 << 8);\n\t\t\t\tword += b3;\n\t\t\t} else {\n\t\t\t\tword += (0x01 << 24);\n\t\t\t}\n\t\t\treturn word;\n\t\t}\n\n\t\tincCounter(counter) {\n\t\t\tif ((counter[0] = this.incWord(counter[0])) === 0) {\n\t\t\t\t// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8\n\t\t\t\tcounter[1] = this.incWord(counter[1]);\n\t\t\t}\n\t\t}\n\n\t\tcalculate(prf, data, iv) {\n\t\t\tlet l;\n\t\t\tif (!(l = data.length)) {\n\t\t\t\treturn [];\n\t\t\t}\n\t\t\tconst bl = bitArray.bitLength(data);\n\t\t\tfor (let i = 0; i < l; i += 4) {\n\t\t\t\tthis.incCounter(iv);\n\t\t\t\tconst e = prf.encrypt(iv);\n\t\t\t\tdata[i] ^= e[0];\n\t\t\t\tdata[i + 1] ^= e[1];\n\t\t\t\tdata[i + 2] ^= e[2];\n\t\t\t\tdata[i + 3] ^= e[3];\n\t\t\t}\n\t\t\treturn bitArray.clamp(data, bl);\n\t\t}\n\t};\n\n\tconst misc = {\n\t\timportKey(password) {\n\t\t\treturn new misc.hmacSha1(codec.bytes.toBits(password));\n\t\t},\n\t\tpbkdf2(prf, salt, count, length) {\n\t\t\tcount = count || 10000;\n\t\t\tif (length < 0 || count < 0) {\n\t\t\t\tthrow new Error(\"invalid params to pbkdf2\");\n\t\t\t}\n\t\t\tconst byteLength = ((length >> 5) + 1) << 2;\n\t\t\tlet u, ui, i, j, k;\n\t\t\tconst arrayBuffer = new ArrayBuffer(byteLength);\n\t\t\tconst out = new DataView(arrayBuffer);\n\t\t\tlet outLength = 0;\n\t\t\tconst b = bitArray;\n\t\t\tsalt = codec.bytes.toBits(salt);\n\t\t\tfor (k = 1; outLength < (byteLength || 1); k++) {\n\t\t\t\tu = ui = prf.encrypt(b.concat(salt, [k]));\n\t\t\t\tfor (i = 1; i < count; i++) {\n\t\t\t\t\tui = prf.encrypt(ui);\n\t\t\t\t\tfor (j = 0; j < ui.length; j++) {\n\t\t\t\t\t\tu[j] ^= ui[j];\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tfor (i = 0; outLength < (byteLength || 1) && i < u.length; i++) {\n\t\t\t\t\tout.setInt32(outLength, u[i]);\n\t\t\t\t\toutLength += 4;\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn arrayBuffer.slice(0, length / 8);\n\t\t}\n\t};\n\n\t/** @fileOverview HMAC implementation.\n\t *\n\t * @author Emily Stark\n\t * @author Mike Hamburg\n\t * @author Dan Boneh\n\t */\n\n\t/** HMAC with the specified hash function.\n\t * @constructor\n\t * @param {bitArray} key the key for HMAC.\n\t * @param {Object} [Hash=hash.sha1] The hash function to use.\n\t */\n\tmisc.hmacSha1 = class {\n\n\t\tconstructor(key) {\n\t\t\tconst hmac = this;\n\t\t\tconst Hash = hmac._hash = hash.sha1;\n\t\t\tconst exKey = [[], []];\n\t\t\thmac._baseHash = [new Hash(), new Hash()];\n\t\t\tconst bs = hmac._baseHash[0].blockSize / 32;\n\n\t\t\tif (key.length > bs) {\n\t\t\t\tkey = new Hash().update(key).finalize();\n\t\t\t}\n\n\t\t\tfor (let i = 0; i < bs; i++) {\n\t\t\t\texKey[0][i] = key[i] ^ 0x36363636;\n\t\t\t\texKey[1][i] = key[i] ^ 0x5C5C5C5C;\n\t\t\t}\n\n\t\t\thmac._baseHash[0].update(exKey[0]);\n\t\t\thmac._baseHash[1].update(exKey[1]);\n\t\t\thmac._resultHash = new Hash(hmac._baseHash[0]);\n\t\t}\n\t\treset() {\n\t\t\tconst hmac = this;\n\t\t\thmac._resultHash = new hmac._hash(hmac._baseHash[0]);\n\t\t\thmac._updated = false;\n\t\t}\n\n\t\tupdate(data) {\n\t\t\tconst hmac = this;\n\t\t\thmac._updated = true;\n\t\t\thmac._resultHash.update(data);\n\t\t}\n\n\t\tdigest() {\n\t\t\tconst hmac = this;\n\t\t\tconst w = hmac._resultHash.finalize();\n\t\t\tconst result = new (hmac._hash)(hmac._baseHash[1]).update(w).finalize();\n\n\t\t\thmac.reset();\n\n\t\t\treturn result;\n\t\t}\n\n\t\tencrypt(data) {\n\t\t\tif (!this._updated) {\n\t\t\t\tthis.update(data);\n\t\t\t\treturn this.digest(data);\n\t\t\t} else {\n\t\t\t\tthrow new Error(\"encrypt on already updated hmac called!\");\n\t\t\t}\n\t\t}\n\t};\n\n\t/*\n\t Copyright (c) 2022 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tconst GET_RANDOM_VALUES_SUPPORTED = typeof crypto != UNDEFINED_TYPE && typeof crypto.getRandomValues == FUNCTION_TYPE;\n\n\tconst ERR_INVALID_PASSWORD = \"Invalid password\";\n\tconst ERR_INVALID_SIGNATURE = \"Invalid signature\";\n\tconst ERR_INVALID_AUTHENTICATION_CODE = ERR_INVALID_SIGNATURE;\n\tconst ERR_ABORT_CHECK_PASSWORD = \"zipjs-abort-check-password\";\n\tconst ERR_UNSUPPORTED_CRYPTO_API = \"Crypto API not supported\";\n\n\tfunction getRandomValues(array) {\n\t\tif (GET_RANDOM_VALUES_SUPPORTED) {\n\t\t\treturn crypto.getRandomValues(array);\n\t\t} else {\n\t\t\tthrow new Error(ERR_UNSUPPORTED_CRYPTO_API);\n\t\t}\n\t}\n\n\t/*\n\t Copyright (c) 2022 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tconst BLOCK_LENGTH = 16;\n\tconst RAW_FORMAT = \"raw\";\n\tconst PBKDF2_ALGORITHM = { name: \"PBKDF2\" };\n\tconst HASH_ALGORITHM = { name: \"HMAC\" };\n\tconst HASH_FUNCTION = \"SHA-1\";\n\tconst BASE_KEY_ALGORITHM = Object.assign({ hash: HASH_ALGORITHM }, PBKDF2_ALGORITHM);\n\tconst DERIVED_BITS_ALGORITHM = Object.assign({ iterations: 1000, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);\n\tconst DERIVED_BITS_USAGE = [\"deriveBits\"];\n\tconst SALT_LENGTH = [8, 12, 16];\n\tconst KEY_LENGTH = [16, 24, 32];\n\tconst AUTHENTICATION_CODE_LENGTH = 10;\n\tconst COUNTER_DEFAULT_VALUE = [0, 0, 0, 0];\n\t// deno-lint-ignore valid-typeof\n\tconst CRYPTO_API_SUPPORTED = typeof crypto != UNDEFINED_TYPE;\n\tconst subtle = CRYPTO_API_SUPPORTED && crypto.subtle;\n\tconst SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof subtle != UNDEFINED_TYPE;\n\tconst codecBytes = codec.bytes;\n\tconst Aes = cipher.aes;\n\tconst CtrGladman = mode.ctrGladman;\n\tconst HmacSha1 = misc.hmacSha1;\n\n\tlet IMPORT_KEY_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.importKey == FUNCTION_TYPE;\n\tlet DERIVE_BITS_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.deriveBits == FUNCTION_TYPE;\n\n\tclass AESDecryptionStream extends TransformStream {\n\n\t\tconstructor({ password, rawPassword, encryptionStrength, checkPasswordOnly, checkAuthenticationCode = true }) {\n\t\t\tsuper({\n\t\t\t\tstart() {\n\t\t\t\t\tinitAesCrypto(this, password, rawPassword, encryptionStrength);\n\t\t\t\t},\n\t\t\t\tasync transform(chunk, controller) {\n\t\t\t\t\tconst aesCrypto = this;\n\t\t\t\t\tconst {\n\t\t\t\t\t\tpassword,\n\t\t\t\t\t\tstrength,\n\t\t\t\t\t\tresolveReady,\n\t\t\t\t\t\tready\n\t\t\t\t\t} = aesCrypto;\n\t\t\t\t\tif (password) {\n\t\t\t\t\t\tawait createDecryptionKeys(aesCrypto, strength, password, subarray(chunk, 0, SALT_LENGTH[strength] + 2));\n\t\t\t\t\t\tchunk = subarray(chunk, SALT_LENGTH[strength] + 2);\n\t\t\t\t\t\tif (checkPasswordOnly) {\n\t\t\t\t\t\t\tcontroller.error(new Error(ERR_ABORT_CHECK_PASSWORD));\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tresolveReady();\n\t\t\t\t\t\t}\n\t\t\t\t\t} else {\n\t\t\t\t\t\tawait ready;\n\t\t\t\t\t}\n\t\t\t\t\tconst output = new Uint8Array(chunk.length - AUTHENTICATION_CODE_LENGTH - ((chunk.length - AUTHENTICATION_CODE_LENGTH) % BLOCK_LENGTH));\n\t\t\t\t\tcontroller.enqueue(append(aesCrypto, chunk, output, 0, AUTHENTICATION_CODE_LENGTH, true));\n\t\t\t\t},\n\t\t\t\tasync flush(controller) {\n\t\t\t\t\tconst {\n\t\t\t\t\t\tctr,\n\t\t\t\t\t\thmac,\n\t\t\t\t\t\tpending,\n\t\t\t\t\t\tready\n\t\t\t\t\t} = this;\n\t\t\t\t\tif (hmac && ctr) {\n\t\t\t\t\t\tawait ready;\n\t\t\t\t\t\tconst chunkToDecrypt = subarray(pending, 0, pending.length - AUTHENTICATION_CODE_LENGTH);\n\t\t\t\t\t\tconst originalAuthenticationCode = subarray(pending, pending.length - AUTHENTICATION_CODE_LENGTH);\n\t\t\t\t\t\tlet decryptedChunkArray = EMPTY_UINT8_ARRAY;\n\t\t\t\t\t\tif (chunkToDecrypt.length) {\n\t\t\t\t\t\t\tconst encryptedChunk = toBits(codecBytes, chunkToDecrypt);\n\t\t\t\t\t\t\thmac.update(encryptedChunk);\n\t\t\t\t\t\t\tconst decryptedChunk = ctr.update(encryptedChunk);\n\t\t\t\t\t\t\tdecryptedChunkArray = fromBits(codecBytes, decryptedChunk);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tconst authenticationCode = subarray(fromBits(codecBytes, hmac.digest()), 0, AUTHENTICATION_CODE_LENGTH);\n\t\t\t\t\t\tlet invalidAuthenticationCode = pending.length < AUTHENTICATION_CODE_LENGTH ? 1 : 0;\n\t\t\t\t\t\tfor (let indexByte = 0; indexByte < AUTHENTICATION_CODE_LENGTH; indexByte++) {\n\t\t\t\t\t\t\tinvalidAuthenticationCode |= authenticationCode[indexByte] ^ originalAuthenticationCode[indexByte];\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif (invalidAuthenticationCode && checkAuthenticationCode) {\n\t\t\t\t\t\t\tthrow new Error(ERR_INVALID_AUTHENTICATION_CODE);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tcontroller.enqueue(decryptedChunkArray);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t}\n\n\tclass AESEncryptionStream extends TransformStream {\n\n\t\tconstructor({ password, rawPassword, encryptionStrength }) {\n\t\t\tsuper({\n\t\t\t\tstart() {\n\t\t\t\t\tinitAesCrypto(this, password, rawPassword, encryptionStrength);\n\t\t\t\t},\n\t\t\t\tasync transform(chunk, controller) {\n\t\t\t\t\tconst aesCrypto = this;\n\t\t\t\t\tconst {\n\t\t\t\t\t\tpassword,\n\t\t\t\t\t\tstrength,\n\t\t\t\t\t\tresolveReady,\n\t\t\t\t\t\tready\n\t\t\t\t\t} = aesCrypto;\n\t\t\t\t\tlet preamble = EMPTY_UINT8_ARRAY;\n\t\t\t\t\tif (password) {\n\t\t\t\t\t\tpreamble = await createEncryptionKeys(aesCrypto, strength, password);\n\t\t\t\t\t\tresolveReady();\n\t\t\t\t\t} else {\n\t\t\t\t\t\tawait ready;\n\t\t\t\t\t}\n\t\t\t\t\tconst output = new Uint8Array(preamble.length + chunk.length - (chunk.length % BLOCK_LENGTH));\n\t\t\t\t\toutput.set(preamble, 0);\n\t\t\t\t\tcontroller.enqueue(append(aesCrypto, chunk, output, preamble.length, 0));\n\t\t\t\t},\n\t\t\t\tasync flush(controller) {\n\t\t\t\t\tconst {\n\t\t\t\t\t\tctr,\n\t\t\t\t\t\thmac,\n\t\t\t\t\t\tpending,\n\t\t\t\t\t\tready\n\t\t\t\t\t} = this;\n\t\t\t\t\tif (hmac && ctr) {\n\t\t\t\t\t\tawait ready;\n\t\t\t\t\t\tlet encryptedChunkArray = EMPTY_UINT8_ARRAY;\n\t\t\t\t\t\tif (pending.length) {\n\t\t\t\t\t\t\tconst encryptedChunk = ctr.update(toBits(codecBytes, pending));\n\t\t\t\t\t\t\thmac.update(encryptedChunk);\n\t\t\t\t\t\t\tencryptedChunkArray = fromBits(codecBytes, encryptedChunk);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tconst authenticationCode = fromBits(codecBytes, hmac.digest()).slice(0, AUTHENTICATION_CODE_LENGTH);\n\t\t\t\t\t\tcontroller.enqueue(concat(encryptedChunkArray, authenticationCode));\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t}\n\n\tfunction initAesCrypto(aesCrypto, password, rawPassword, encryptionStrength) {\n\t\tObject.assign(aesCrypto, {\n\t\t\tready: new Promise(resolve => aesCrypto.resolveReady = resolve),\n\t\t\tpassword: encodePassword(password, rawPassword),\n\t\t\tstrength: encryptionStrength - 1,\n\t\t\tpending: EMPTY_UINT8_ARRAY\n\t\t});\n\t}\n\n\tfunction append(aesCrypto, input, output, paddingStart, paddingEnd, verifyAuthenticationCode) {\n\t\tconst {\n\t\t\tctr,\n\t\t\thmac,\n\t\t\tpending\n\t\t} = aesCrypto;\n\t\tif (pending.length) {\n\t\t\tinput = concat(pending, input);\n\t\t}\n\t\tconst inputLength = input.length - paddingEnd;\n\t\toutput = expand(output, paddingStart + (inputLength - (inputLength % BLOCK_LENGTH)));\n\t\tlet offset;\n\t\tfor (offset = 0; offset <= inputLength - BLOCK_LENGTH; offset += BLOCK_LENGTH) {\n\t\t\tconst inputChunk = toBits(codecBytes, subarray(input, offset, offset + BLOCK_LENGTH));\n\t\t\tif (verifyAuthenticationCode) {\n\t\t\t\thmac.update(inputChunk);\n\t\t\t}\n\t\t\tconst outputChunk = ctr.update(inputChunk);\n\t\t\tif (!verifyAuthenticationCode) {\n\t\t\t\thmac.update(outputChunk);\n\t\t\t}\n\t\t\toutput.set(fromBits(codecBytes, outputChunk), offset + paddingStart);\n\t\t}\n\t\taesCrypto.pending = subarray(input, offset);\n\t\treturn output;\n\t}\n\n\tasync function createDecryptionKeys(decrypt, strength, password, preamble) {\n\t\tconst passwordVerificationKey = await createKeys$1(decrypt, strength, password, subarray(preamble, 0, SALT_LENGTH[strength]));\n\t\tconst passwordVerification = subarray(preamble, SALT_LENGTH[strength]);\n\t\tif (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {\n\t\t\tthrow new Error(ERR_INVALID_PASSWORD);\n\t\t}\n\t}\n\n\tasync function createEncryptionKeys(encrypt, strength, password) {\n\t\tconst salt = getRandomValues(new Uint8Array(SALT_LENGTH[strength]));\n\t\tconst passwordVerification = await createKeys$1(encrypt, strength, password, salt);\n\t\treturn concat(salt, passwordVerification);\n\t}\n\n\tasync function createKeys$1(aesCrypto, strength, password, salt) {\n\t\taesCrypto.password = null;\n\t\tconst baseKey = await importKey(RAW_FORMAT, password, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);\n\t\tconst derivedBits = await deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), baseKey, 8 * ((KEY_LENGTH[strength] * 2) + 2));\n\t\tconst compositeKey = new Uint8Array(derivedBits);\n\t\tconst key = toBits(codecBytes, subarray(compositeKey, 0, KEY_LENGTH[strength]));\n\t\tconst authentication = toBits(codecBytes, subarray(compositeKey, KEY_LENGTH[strength], KEY_LENGTH[strength] * 2));\n\t\tconst passwordVerification = subarray(compositeKey, KEY_LENGTH[strength] * 2);\n\t\tObject.assign(aesCrypto, {\n\t\t\tkeys: {\n\t\t\t\tkey,\n\t\t\t\tauthentication,\n\t\t\t\tpasswordVerification\n\t\t\t},\n\t\t\tctr: new CtrGladman(new Aes(key), Array.from(COUNTER_DEFAULT_VALUE)),\n\t\t\thmac: new HmacSha1(authentication)\n\t\t});\n\t\treturn passwordVerification;\n\t}\n\n\tasync function importKey(format, password, algorithm, extractable, keyUsages) {\n\t\tif (IMPORT_KEY_SUPPORTED) {\n\t\t\ttry {\n\t\t\t\treturn await subtle.importKey(format, password, algorithm, extractable, keyUsages);\n\t\t\t} catch {\n\t\t\t\tIMPORT_KEY_SUPPORTED = false;\n\t\t\t\treturn misc.importKey(password);\n\t\t\t}\n\t\t} else {\n\t\t\treturn misc.importKey(password);\n\t\t}\n\t}\n\n\tasync function deriveBits(algorithm, baseKey, length) {\n\t\tif (DERIVE_BITS_SUPPORTED) {\n\t\t\ttry {\n\t\t\t\treturn await subtle.deriveBits(algorithm, baseKey, length);\n\t\t\t} catch {\n\t\t\t\tDERIVE_BITS_SUPPORTED = false;\n\t\t\t\treturn misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);\n\t\t\t}\n\t\t} else {\n\t\t\treturn misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);\n\t\t}\n\t}\n\n\tfunction encodePassword(password, rawPassword) {\n\t\tif (rawPassword === UNDEFINED_VALUE) {\n\t\t\treturn encodeText(password);\n\t\t} else {\n\t\t\treturn rawPassword;\n\t\t}\n\t}\n\n\tfunction expand(inputArray, length) {\n\t\tif (length && length > inputArray.length) {\n\t\t\tconst array = inputArray;\n\t\t\tinputArray = new Uint8Array(length);\n\t\t\tinputArray.set(array, 0);\n\t\t}\n\t\treturn inputArray;\n\t}\n\n\tfunction subarray(array, begin, end) {\n\t\treturn array.subarray(begin, end);\n\t}\n\n\tfunction fromBits(codecBytes, chunk) {\n\t\treturn codecBytes.fromBits(chunk);\n\t}\n\tfunction toBits(codecBytes, chunk) {\n\t\treturn codecBytes.toBits(chunk);\n\t}\n\n\t/*\n\t Copyright (c) 2022 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tconst HEADER_LENGTH = 12;\n\n\tclass ZipCryptoDecryptionStream extends TransformStream {\n\n\t\tconstructor({ password, rawPassword, passwordVerification, checkPasswordOnly }) {\n\t\t\tsuper({\n\t\t\t\tstart() {\n\t\t\t\t\tinitZipCrypto(this, password, rawPassword, passwordVerification);\n\t\t\t\t},\n\t\t\t\ttransform(chunk, controller) {\n\t\t\t\t\tconst zipCrypto = this;\n\t\t\t\t\tif (zipCrypto.password || zipCrypto.rawPassword) {\n\t\t\t\t\t\tconst decryptedHeader = decrypt(zipCrypto, chunk.subarray(0, HEADER_LENGTH));\n\t\t\t\t\t\tzipCrypto.password = zipCrypto.rawPassword = null;\n\t\t\t\t\t\tif ((decryptedHeader[HEADER_LENGTH - 1] ^ zipCrypto.passwordVerification) != 0) {\n\t\t\t\t\t\t\tthrow new Error(ERR_INVALID_PASSWORD);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tchunk = chunk.subarray(HEADER_LENGTH);\n\t\t\t\t\t}\n\t\t\t\t\tif (checkPasswordOnly) {\n\t\t\t\t\t\tcontroller.error(new Error(ERR_ABORT_CHECK_PASSWORD));\n\t\t\t\t\t} else {\n\t\t\t\t\t\tcontroller.enqueue(decrypt(zipCrypto, chunk));\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t}\n\n\tclass ZipCryptoEncryptionStream extends TransformStream {\n\n\t\tconstructor({ password, rawPassword, passwordVerification }) {\n\t\t\tsuper({\n\t\t\t\tstart() {\n\t\t\t\t\tinitZipCrypto(this, password, rawPassword, passwordVerification);\n\t\t\t\t},\n\t\t\t\ttransform(chunk, controller) {\n\t\t\t\t\tconst zipCrypto = this;\n\t\t\t\t\tlet output;\n\t\t\t\t\tlet offset;\n\t\t\t\t\tif (zipCrypto.password || zipCrypto.rawPassword) {\n\t\t\t\t\t\tzipCrypto.password = zipCrypto.rawPassword = null;\n\t\t\t\t\t\tconst header = getRandomValues(new Uint8Array(HEADER_LENGTH));\n\t\t\t\t\t\theader[HEADER_LENGTH - 1] = zipCrypto.passwordVerification;\n\t\t\t\t\t\toutput = new Uint8Array(chunk.length + header.length);\n\t\t\t\t\t\toutput.set(encrypt(zipCrypto, header), 0);\n\t\t\t\t\t\toffset = HEADER_LENGTH;\n\t\t\t\t\t} else {\n\t\t\t\t\t\toutput = new Uint8Array(chunk.length);\n\t\t\t\t\t\toffset = 0;\n\t\t\t\t\t}\n\t\t\t\t\toutput.set(encrypt(zipCrypto, chunk), offset);\n\t\t\t\t\tcontroller.enqueue(output);\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t}\n\n\tfunction initZipCrypto(zipCrypto, password, rawPassword, passwordVerification) {\n\t\tObject.assign(zipCrypto, {\n\t\t\tpassword,\n\t\t\trawPassword,\n\t\t\tpasswordVerification\n\t\t});\n\t\tcreateKeys(zipCrypto, password, rawPassword);\n\t}\n\n\tfunction decrypt(target, input) {\n\t\tconst output = new Uint8Array(input.length);\n\t\tfor (let index = 0; index < input.length; index++) {\n\t\t\toutput[index] = getByte(target) ^ input[index];\n\t\t\tupdateKeys(target, output[index]);\n\t\t}\n\t\treturn output;\n\t}\n\n\tfunction encrypt(target, input) {\n\t\tconst output = new Uint8Array(input.length);\n\t\tfor (let index = 0; index < input.length; index++) {\n\t\t\toutput[index] = getByte(target) ^ input[index];\n\t\t\tupdateKeys(target, input[index]);\n\t\t}\n\t\treturn output;\n\t}\n\n\tfunction createKeys(target, password, rawPassword) {\n\t\tconst keys = [0x12345678, 0x23456789, 0x34567890];\n\t\tObject.assign(target, {\n\t\t\tkeys,\n\t\t\tcrcKey0: new Crc32(keys[0]),\n\t\t\tcrcKey2: new Crc32(keys[2])\n\t\t});\n\t\tif (rawPassword) {\n\t\t\tfor (let index = 0; index < rawPassword.length; index++) {\n\t\t\t\tupdateKeys(target, rawPassword[index]);\n\t\t\t}\n\t\t} else {\n\t\t\tfor (let index = 0; index < password.length; index++) {\n\t\t\t\tupdateKeys(target, password.charCodeAt(index));\n\t\t\t}\n\t\t}\n\t}\n\n\tfunction updateKeys(target, byte) {\n\t\tlet [, key1] = target.keys;\n\t\ttarget.crcKey0.append([byte]);\n\t\tconst key0 = ~target.crcKey0.get();\n\t\tkey1 = getInt32(Math.imul(getInt32(key1 + getInt8(key0)), 134775813) + 1);\n\t\ttarget.crcKey2.append([key1 >>> 24]);\n\t\tconst key2 = ~target.crcKey2.get();\n\t\ttarget.keys = [key0, key1, key2];\n\t}\n\n\tfunction getByte(target) {\n\t\tconst temp = target.keys[2] | 2;\n\t\treturn getInt8(Math.imul(temp, (temp ^ 1)) >>> 8);\n\t}\n\n\tfunction getInt8(number) {\n\t\treturn number & 0xFF;\n\t}\n\n\tfunction getInt32(number) {\n\t\treturn number & 0xFFFFFFFF;\n\t}\n\n\t/*\n\t Copyright (c) 2026 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright\n\t notice, this list of conditions and the following disclaimer in\n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tfunction toCompatibleReadable(readable) {\n\t\tif (readable instanceof ReadableStream) {\n\t\t\treturn readable;\n\t\t}\n\t\tconst reader = readable.getReader();\n\t\treturn new ReadableStream({\n\t\t\tasync pull(controller) {\n\t\t\t\tconst { value, done } = await reader.read();\n\t\t\t\tif (done) {\n\t\t\t\t\tcontroller.close();\n\t\t\t\t} else {\n\t\t\t\t\tcontroller.enqueue(value);\n\t\t\t\t}\n\t\t\t},\n\t\t\tcancel(reason) {\n\t\t\t\treturn reader.cancel(reason);\n\t\t\t}\n\t\t});\n\t}\n\n\t/*\n\t Copyright (c) 2025 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright\n\t notice, this list of conditions and the following disclaimer in\n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\tconst ERR_INVALID_CODEC_MODULE = \"Invalid codec module\";\n\tconst codecStreams = new Map();\n\n\tfunction getCodecStreams(format) {\n\t\treturn codecStreams.get(format);\n\t}\n\n\tfunction setCodecStreams(format, streams) {\n\t\tconst { CompressionStream, DecompressionStream } = streams;\n\t\tif (typeof CompressionStream != FUNCTION_TYPE && typeof DecompressionStream != FUNCTION_TYPE) {\n\t\t\tthrow new Error(ERR_INVALID_CODEC_MODULE);\n\t\t}\n\t\tcodecStreams.set(format, { CompressionStream, DecompressionStream });\n\t}\n\n\tasync function ensureCodecStreams(format, codecURI) {\n\t\tif (!codecStreams.has(format) && codecURI) {\n\t\t\tsetCodecStreams(format, await import(/* webpackIgnore: true */ /* @vite-ignore */ codecURI));\n\t\t}\n\t}\n\n\t/*\n\t Copyright (c) 2025 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tconst ERR_INVALID_UNCOMPRESSED_SIZE = \"Invalid uncompressed size\";\n\tconst ERR_INVALID_COMPRESSED_DATA = \"Invalid compressed data\";\n\tconst ERR_INVALID_CRC32 = ERR_INVALID_SIGNATURE;\n\tconst ERR_UNSUPPORTED_COMPRESSION = \"Compression method not supported\";\n\tconst FORMAT_DEFLATE_RAW = \"deflate-raw\";\n\tconst FORMAT_DEFLATE64_RAW = \"deflate64-raw\";\n\tconst FORMAT_GZIP = \"gzip\";\n\tconst GZIP_HEADER_LENGTH = 10;\n\tconst GZIP_TRAILER_LENGTH = 8;\n\tconst GZIP_HEADER_BYTES = [0x1f, 0x8b, 0x08];\n\tconst GZIP_OUTPUT_STALL_TIMEOUT = 5000;\n\n\tclass DeflateStream extends TransformStream {\n\n\t\tconstructor(options, { chunkSize, CompressionStreamFallback, CompressionStream }) {\n\t\t\tsuper({});\n\t\t\tconst { compressed, encrypted, useCompressionStream, zipCrypto, computeCrc32, level, deflate64, format, compressionMethod } = options;\n\t\t\tconst stream = this;\n\t\t\tlet crc32Stream, encryptionStream, gzipCrc32Stream;\n\t\t\tlet readable = super.readable;\n\t\t\tconst codecStreams = format && getCodecStreams(format);\n\t\t\tconst useGzipCrc32 = computeCrc32 && compressed && !deflate64 && !codecStreams && (!encrypted || zipCrypto) &&\n\t\t\t\tBoolean(useCompressionStream && CompressionStream);\n\t\t\tif ((!encrypted || zipCrypto) && computeCrc32 && !useGzipCrc32) {\n\t\t\t\tcrc32Stream = new Crc32Stream();\n\t\t\t\treadable = pipeThrough(readable, crc32Stream);\n\t\t\t}\n\t\t\tif (compressed) {\n\t\t\t\tif (codecStreams) {\n\t\t\t\t\treadable = pipeThroughBackpressured(readable, createCodecStream(codecStreams.CompressionStream, format, { level, chunkSize, compressionMethod }));\n\t\t\t\t} else if (useGzipCrc32) {\n\t\t\t\t\tgzipCrc32Stream = new GzipToRawDeflateStream();\n\t\t\t\t\treadable = pipeThroughBackpressured(readable, new CompressionStream(FORMAT_GZIP));\n\t\t\t\t\treadable = pipeThrough(readable, gzipCrc32Stream);\n\t\t\t\t} else {\n\t\t\t\t\ttry {\n\t\t\t\t\t\treadable = pipeThroughCompressionStream(readable, useCompressionStream, { level, chunkSize }, CompressionStream, CompressionStreamFallback);\n\t\t\t\t\t} catch (error) {\n\t\t\t\t\t\tlet gzipStream;\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tgzipStream = new CompressionStream(FORMAT_GZIP);\n\t\t\t\t\t\t} catch {\n\t\t\t\t\t\t\tthrow error;\n\t\t\t\t\t\t}\n\t\t\t\t\t\treadable = pipeThroughBackpressured(readable, gzipStream);\n\t\t\t\t\t\treadable = pipeThrough(readable, new GzipToRawDeflateStream());\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (encrypted) {\n\t\t\t\tif (zipCrypto) {\n\t\t\t\t\treadable = pipeThrough(readable, new ZipCryptoEncryptionStream(options));\n\t\t\t\t} else {\n\t\t\t\t\tencryptionStream = new AESEncryptionStream(options);\n\t\t\t\t\treadable = pipeThrough(readable, encryptionStream);\n\t\t\t\t}\n\t\t\t}\n\t\t\tsetReadable(stream, readable, () => {\n\t\t\t\tif ((!encrypted || zipCrypto) && computeCrc32) {\n\t\t\t\t\tstream.crc32 = useGzipCrc32 ? gzipCrc32Stream.crc32 : new DataView(crc32Stream.value.buffer).getUint32(0);\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t}\n\n\tclass GzipToRawDeflateStream extends TransformStream {\n\n\t\tconstructor() {\n\t\t\t// deno-lint-ignore prefer-const\n\t\t\tlet stream;\n\t\t\tlet headerBytesLeft = GZIP_HEADER_LENGTH;\n\t\t\tlet trailerCandidate = new Uint8Array(0);\n\t\t\tsuper({\n\t\t\t\ttransform(chunk, controller) {\n\t\t\t\t\tif (headerBytesLeft) {\n\t\t\t\t\t\tconst droppedLength = Math.min(headerBytesLeft, chunk.length);\n\t\t\t\t\t\theaderBytesLeft -= droppedLength;\n\t\t\t\t\t\tchunk = chunk.subarray(droppedLength);\n\t\t\t\t\t\tif (!chunk.length) {\n\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tconst availableLength = trailerCandidate.length + chunk.length;\n\t\t\t\t\tif (availableLength <= GZIP_TRAILER_LENGTH) {\n\t\t\t\t\t\ttrailerCandidate = concat(trailerCandidate, chunk);\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\tconst emitLength = availableLength - GZIP_TRAILER_LENGTH;\n\t\t\t\t\tconst emittedFromTrailer = Math.min(emitLength, trailerCandidate.length);\n\t\t\t\t\tcontroller.enqueue(concat(\n\t\t\t\t\t\ttrailerCandidate.subarray(0, emittedFromTrailer),\n\t\t\t\t\t\tchunk.subarray(0, emitLength - emittedFromTrailer)));\n\t\t\t\t\ttrailerCandidate = concat(\n\t\t\t\t\t\ttrailerCandidate.subarray(emittedFromTrailer),\n\t\t\t\t\t\tchunk.subarray(emitLength - emittedFromTrailer));\n\t\t\t\t},\n\t\t\t\tflush() {\n\t\t\t\t\tconst dataView = getDataView(trailerCandidate);\n\t\t\t\t\tstream.crc32 = dataView.getUint32(0, true);\n\t\t\t\t\tstream.uncompressedSize = dataView.getUint32(4, true);\n\t\t\t\t}\n\t\t\t});\n\t\t\tstream = this;\n\t\t}\n\t}\n\n\tfunction pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize) {\n\t\tconst crc32 = new Crc32();\n\t\tlet outputLength = 0;\n\t\tlet inputDone = false;\n\t\tlet watchdogTimeout;\n\t\tlet resolveTrailerReady, rejectTrailerReady;\n\t\tconst trailerReady = new Promise((resolve, reject) => {\n\t\t\tresolveTrailerReady = resolve;\n\t\t\trejectTrailerReady = reject;\n\t\t});\n\t\ttrailerReady.catch(() => { });\n\t\tif (!outputSize) {\n\t\t\tresolveTrailerReady();\n\t\t}\n\t\tconst gzipWrapStream = new TransformStream({\n\t\t\tstart(controller) {\n\t\t\t\tconst header = new Uint8Array(GZIP_HEADER_LENGTH);\n\t\t\t\theader.set(GZIP_HEADER_BYTES);\n\t\t\t\tcontroller.enqueue(header);\n\t\t\t},\n\t\t\ttransform(chunk, controller) {\n\t\t\t\tcontroller.enqueue(chunk);\n\t\t\t},\n\t\t\tasync flush(controller) {\n\t\t\t\tinputDone = true;\n\t\t\t\tstartWatchdog();\n\t\t\t\ttry {\n\t\t\t\t\tawait trailerReady;\n\t\t\t\t} finally {\n\t\t\t\t\tstopWatchdog();\n\t\t\t\t}\n\t\t\t\tconst trailer = new Uint8Array(GZIP_TRAILER_LENGTH);\n\t\t\t\tconst dataView = getDataView(trailer);\n\t\t\t\tdataView.setUint32(0, crc32.get(), true);\n\t\t\t\tdataView.setUint32(4, outputSize, true);\n\t\t\t\tcontroller.enqueue(trailer);\n\t\t\t},\n\t\t\tcancel(reason) {\n\t\t\t\trejectTrailerReady(reason);\n\t\t\t}\n\t\t});\n\t\tconst outputStream = new TransformStream({\n\t\t\ttransform(chunk, controller) {\n\t\t\t\tcrc32.append(chunk);\n\t\t\t\toutputLength += chunk.length;\n\t\t\t\tif (outputLength >= outputSize) {\n\t\t\t\t\tresolveTrailerReady();\n\t\t\t\t} else if (inputDone) {\n\t\t\t\t\tstartWatchdog();\n\t\t\t\t}\n\t\t\t\tcontroller.enqueue(chunk);\n\t\t\t},\n\t\t\tcancel(reason) {\n\t\t\t\trejectTrailerReady(reason);\n\t\t\t}\n\t\t});\n\t\treadable = pipeThrough(readable, gzipWrapStream);\n\t\treadable = pipeThroughBackpressured(readable, gzipStream);\n\t\treturn pipeThrough(readable, outputStream);\n\n\t\tfunction startWatchdog() {\n\t\t\tstopWatchdog();\n\t\t\twatchdogTimeout = setTimeout(() => rejectTrailerReady(new Error(ERR_INVALID_UNCOMPRESSED_SIZE)), GZIP_OUTPUT_STALL_TIMEOUT);\n\t\t}\n\n\t\tfunction stopWatchdog() {\n\t\t\tclearTimeout(watchdogTimeout);\n\t\t}\n\t}\n\n\tclass InflateStream extends TransformStream {\n\n\t\tconstructor(options, { chunkSize, DecompressionStreamFallback, DecompressionStream }) {\n\t\t\tsuper({});\n\t\t\tconst { zipCrypto, encrypted, checkCrc32, crc32, compressed, useCompressionStream, deflate64, format, compressionMethod, rawBitFlag, outputSize } = options;\n\t\t\tlet crc32Stream, decryptionStream;\n\t\t\tlet readable = super.readable;\n\t\t\tif (encrypted) {\n\t\t\t\tif (zipCrypto) {\n\t\t\t\t\treadable = pipeThrough(readable, new ZipCryptoDecryptionStream(options));\n\t\t\t\t} else {\n\t\t\t\t\tdecryptionStream = new AESDecryptionStream(options);\n\t\t\t\t\treadable = pipeThrough(readable, decryptionStream);\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (compressed) {\n\t\t\t\tconst codecStreams = format && getCodecStreams(format);\n\t\t\t\tif (codecStreams) {\n\t\t\t\t\treadable = pipeThroughBackpressured(readable, createCodecStream(codecStreams.DecompressionStream, format, { chunkSize, compressionMethod, rawBitFlag, uncompressedSize: outputSize }));\n\t\t\t\t} else {\n\t\t\t\t\ttry {\n\t\t\t\t\t\treadable = pipeThroughCompressionStream(readable, useCompressionStream, { chunkSize, deflate64 }, DecompressionStream, DecompressionStreamFallback);\n\t\t\t\t\t} catch (error) {\n\t\t\t\t\t\tif (deflate64 || outputSize === UNDEFINED_VALUE) {\n\t\t\t\t\t\t\tthrow error;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tlet gzipStream;\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tgzipStream = new DecompressionStream(FORMAT_GZIP);\n\t\t\t\t\t\t} catch {\n\t\t\t\t\t\t\tthrow error;\n\t\t\t\t\t\t}\n\t\t\t\t\t\treadable = pipeThroughGzipDecompressionStream(readable, gzipStream, outputSize);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treadable = mapInflateStreamError(readable);\n\t\t\t}\n\t\t\tif (checkCrc32) {\n\t\t\t\tcrc32Stream = new Crc32Stream();\n\t\t\t\treadable = pipeThrough(readable, crc32Stream);\n\t\t\t}\n\t\t\tsetReadable(this, readable, () => {\n\t\t\t\tif (checkCrc32) {\n\t\t\t\t\tconst computedCrc32View = new DataView(crc32Stream.value.buffer);\n\t\t\t\t\tif (crc32 != computedCrc32View.getUint32(0, false)) {\n\t\t\t\t\t\tthrow new Error(ERR_INVALID_CRC32);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t}\n\n\tconst formatSupportByStream = new Map();\n\n\tfunction supportsFormat(StreamClass, format) {\n\t\tif (!StreamClass) {\n\t\t\treturn false;\n\t\t}\n\t\tlet supportByFormat = formatSupportByStream.get(StreamClass);\n\t\tif (!supportByFormat) {\n\t\t\tsupportByFormat = new Map();\n\t\t\tformatSupportByStream.set(StreamClass, supportByFormat);\n\t\t}\n\t\tlet supported = supportByFormat.get(format);\n\t\tif (supported === UNDEFINED_VALUE) {\n\t\t\ttry {\n\t\t\t\tnew StreamClass(format);\n\t\t\t\tsupported = true;\n\t\t\t} catch {\n\t\t\t\tsupported = false;\n\t\t\t}\n\t\t\tsupportByFormat.set(format, supported);\n\t\t}\n\t\treturn supported;\n\t}\n\n\tfunction supportsDeflateRaw(StreamClass) {\n\t\treturn supportsFormat(StreamClass, FORMAT_DEFLATE_RAW);\n\t}\n\n\tfunction setReadable(stream, readable, flush) {\n\t\treadable = pipeThrough(readable, new TransformStream({ flush }));\n\t\tObject.defineProperty(stream, \"readable\", {\n\t\t\tget() {\n\t\t\t\treturn readable;\n\t\t\t}\n\t\t});\n\t}\n\n\tfunction createCodecStream(CodecStreamClass, format, options) {\n\t\tif (!CodecStreamClass) {\n\t\t\tthrow new Error(ERR_UNSUPPORTED_COMPRESSION);\n\t\t}\n\t\treturn new CodecStreamClass(format, options);\n\t}\n\n\tfunction pipeThroughCompressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamFallback) {\n\t\tconst Stream = useCompressionStream && CompressionStreamNative ?\n\t\t\tCompressionStreamNative :\n\t\t\tCompressionStreamFallback || CompressionStreamNative;\n\t\tconst format = options.deflate64 ? FORMAT_DEFLATE64_RAW : FORMAT_DEFLATE_RAW;\n\t\tlet codecStream;\n\t\ttry {\n\t\t\tcodecStream = new Stream(format, options);\n\t\t} catch (error) {\n\t\t\tif (useCompressionStream && CompressionStreamFallback && Stream != CompressionStreamFallback) {\n\t\t\t\tcodecStream = new CompressionStreamFallback(format, options);\n\t\t\t} else {\n\t\t\t\tthrow error;\n\t\t\t}\n\t\t}\n\t\treturn pipeThroughBackpressured(readable, codecStream);\n\t}\n\n\tfunction pipeThrough(readable, transformStream) {\n\t\treturn toCompatibleReadable(readable).pipeThrough(transformStream);\n\t}\n\n\tfunction pipeThroughBackpressured(readable, transformStream) {\n\t\tconst writer = transformStream.writable.getWriter();\n\t\tconst reader = readable.getReader();\n\t\tpump();\n\t\treturn transformStream.readable;\n\n\t\tasync function pump() {\n\t\t\ttry {\n\t\t\t\tfor (; ;) {\n\t\t\t\t\tawait writer.ready;\n\t\t\t\t\tconst result = await reader.read();\n\t\t\t\t\tif (result.done) {\n\t\t\t\t\t\tawait writer.close();\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t\tawait writer.write(result.value);\n\t\t\t\t}\n\t\t\t} catch (error) {\n\t\t\t\tawait abort(writer, error);\n\t\t\t\tawait cancel(reader, error);\n\t\t\t}\n\t\t}\n\t}\n\n\tasync function abort(writer, error) {\n\t\ttry {\n\t\t\tawait writer.abort(error);\n\t\t} catch {\n\t\t\t// ignored: the writable may already be errored/closed\n\t\t}\n\t}\n\n\tasync function cancel(reader, error) {\n\t\ttry {\n\t\t\tawait reader.cancel(error);\n\t\t} catch {\n\t\t\t// ignored: the readable may already be errored/closed\n\t\t}\n\t}\n\n\tfunction mapInflateStreamError(readable) {\n\t\tconst reader = readable.getReader();\n\t\treturn new ReadableStream({\n\t\t\tasync pull(controller) {\n\t\t\t\tlet result;\n\t\t\t\ttry {\n\t\t\t\t\tresult = await reader.read();\n\t\t\t\t} catch (error) {\n\t\t\t\t\tif (error && error.message) {\n\t\t\t\t\t\tthrow error;\n\t\t\t\t\t}\n\t\t\t\t\tconst mappedError = new Error(ERR_INVALID_COMPRESSED_DATA);\n\t\t\t\t\tmappedError.cause = error;\n\t\t\t\t\tthrow mappedError;\n\t\t\t\t}\n\t\t\t\tconst { value, done } = result;\n\t\t\t\tif (done) {\n\t\t\t\t\tcontroller.close();\n\t\t\t\t} else {\n\t\t\t\t\tcontroller.enqueue(value);\n\t\t\t\t}\n\t\t\t},\n\t\t\tcancel(reason) {\n\t\t\t\treturn reader.cancel(reason);\n\t\t\t}\n\t\t});\n\t}\n\n\t/*\n\t Copyright (c) 2022 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tconst DEFAULT_CHUNK_SIZE = 64 * 1024;\n\tconst MESSAGE_EVENT_TYPE = \"message\";\n\tconst MESSAGE_START = \"start\";\n\tconst MESSAGE_PULL = \"pull\";\n\tconst MESSAGE_DATA = \"data\";\n\tconst MESSAGE_ACK_DATA = \"ack\";\n\tconst MESSAGE_CLOSE = \"close\";\n\tconst MESSAGE_READY = \"ready\";\n\tconst CODEC_DEFLATE = \"deflate\";\n\tconst CODEC_INFLATE = \"inflate\";\n\n\tclass CodecStream extends TransformStream {\n\n\t\tconstructor(options, config) {\n\t\t\tsuper({});\n\t\t\tconst codec = this;\n\t\t\tconst { codecType } = options;\n\t\t\tlet Stream;\n\t\t\tif (codecType.startsWith(CODEC_DEFLATE)) {\n\t\t\t\tStream = DeflateStream;\n\t\t\t} else if (codecType.startsWith(CODEC_INFLATE)) {\n\t\t\t\tStream = InflateStream;\n\t\t\t}\n\t\t\tcodec.outputSize = 0;\n\t\t\tlet inputSize = 0;\n\t\t\tconst stream = new Stream(options, config);\n\t\t\tconst readable = super.readable;\n\t\t\tconst inputSizeStream = new TransformStream({\n\t\t\t\ttransform(chunk, controller) {\n\t\t\t\t\tif (chunk && chunk.length) {\n\t\t\t\t\t\tinputSize += chunk.length;\n\t\t\t\t\t\tcontroller.enqueue(chunk);\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tflush() {\n\t\t\t\t\tObject.assign(codec, {\n\t\t\t\t\t\tinputSize\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t});\n\t\t\tconst outputSizeStream = new TransformStream({\n\t\t\t\ttransform(chunk, controller) {\n\t\t\t\t\tif (chunk && chunk.length) {\n\t\t\t\t\t\tcontroller.enqueue(chunk);\n\t\t\t\t\t\tcodec.outputSize += chunk.length;\n\t\t\t\t\t\tif (options.outputSize !== UNDEFINED_VALUE && codec.outputSize > options.outputSize) {\n\t\t\t\t\t\t\tthrow new Error(ERR_INVALID_UNCOMPRESSED_SIZE);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tflush() {\n\t\t\t\t\tconst { crc32 } = stream;\n\t\t\t\t\tObject.assign(codec, {\n\t\t\t\t\t\tcrc32,\n\t\t\t\t\t\tinputSize\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t});\n\t\t\tObject.defineProperty(codec, \"readable\", {\n\t\t\t\tget() {\n\t\t\t\t\treturn readable.pipeThrough(inputSizeStream).pipeThrough(stream).pipeThrough(outputSizeStream);\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t}\n\n\tclass ChunkStream extends TransformStream {\n\n\t\tconstructor(chunkSize) {\n\t\t\tconst pendingChunks = [];\n\t\t\tlet pendingLength = 0;\n\t\t\tif (!Number.isFinite(chunkSize) || chunkSize < 1) {\n\t\t\t\tchunkSize = DEFAULT_CHUNK_SIZE;\n\t\t\t}\n\t\t\tsuper({\n\t\t\t\ttransform(chunk, controller) {\n\t\t\t\t\tpendingChunks.push(chunk);\n\t\t\t\t\tpendingLength += chunk.length;\n\t\t\t\t\twhile (pendingLength > chunkSize) {\n\t\t\t\t\t\tcontroller.enqueue(shiftChunk());\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tflush(controller) {\n\t\t\t\t\tif (pendingLength) {\n\t\t\t\t\t\tcontroller.enqueue(concatChunks(pendingChunks, pendingLength));\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t});\n\n\t\t\tfunction shiftChunk() {\n\t\t\t\tconst result = new Uint8Array(chunkSize);\n\t\t\t\tlet resultOffset = 0;\n\t\t\t\twhile (resultOffset < chunkSize) {\n\t\t\t\t\tconst firstChunk = pendingChunks[0];\n\t\t\t\t\tconst remainingLength = chunkSize - resultOffset;\n\t\t\t\t\tif (firstChunk.length <= remainingLength) {\n\t\t\t\t\t\tresult.set(firstChunk, resultOffset);\n\t\t\t\t\t\tresultOffset += firstChunk.length;\n\t\t\t\t\t\tpendingChunks.shift();\n\t\t\t\t\t} else {\n\t\t\t\t\t\tresult.set(firstChunk.subarray(0, remainingLength), resultOffset);\n\t\t\t\t\t\tpendingChunks[0] = firstChunk.subarray(remainingLength);\n\t\t\t\t\t\tresultOffset += remainingLength;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tpendingLength -= chunkSize;\n\t\t\t\treturn result;\n\t\t\t}\n\n\t\t\tfunction concatChunks(chunks, length) {\n\t\t\t\tconst result = new Uint8Array(length);\n\t\t\t\tlet offset = 0;\n\t\t\t\tfor (const chunk of chunks) {\n\t\t\t\t\tresult.set(chunk, offset);\n\t\t\t\t\toffset += chunk.length;\n\t\t\t\t}\n\t\t\t\treturn result;\n\t\t\t}\n\t\t}\n\t}\n\n\t/*\n\t Copyright (c) 2025 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tconst MINIMUM_CHUNK_SIZE = 64;\n\tlet maxWorkers = 2;\n\ttry {\n\t\tif (typeof navigator != UNDEFINED_TYPE && navigator.hardwareConcurrency) {\n\t\t\tmaxWorkers = navigator.hardwareConcurrency;\n\t\t}\n\t} catch {\n\t\t// ignored\n\t}\n\t({\n\t\tCompressionStream: typeof CompressionStream != UNDEFINED_TYPE && CompressionStream,\n\t\tDecompressionStream: typeof DecompressionStream != UNDEFINED_TYPE && DecompressionStream\n\t});\n\n\tfunction getChunkSize(config) {\n\t\treturn Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);\n\t}\n\n\t/// <reference types=\"../../index.d.ts\" />\n\n\n\tconst pendingPullMessages = new Map();\n\tconst pendingDataMessages = new Map();\n\n\tlet abortController, messageId = 0;\n\n\tfunction initWorker(options = {}) {\n\t\tconst { init } = options;\n\t\tconst CompressionStreamFallback = options.CompressionStreamFallback || options.CompressionStreamZlib;\n\t\tconst DecompressionStreamFallback = options.DecompressionStreamFallback || options.DecompressionStreamZlib;\n\t\tself.initModule = async config => {\n\t\t\tif (init) {\n\t\t\t\tawait init(config);\n\t\t\t}\n\t\t\tif (CompressionStreamFallback) {\n\t\t\t\tconfig.CompressionStreamFallback = CompressionStreamFallback;\n\t\t\t}\n\t\t\tif (DecompressionStreamFallback) {\n\t\t\t\tconfig.DecompressionStreamFallback = DecompressionStreamFallback;\n\t\t\t}\n\t\t};\n\t}\n\n\taddEventListener(MESSAGE_EVENT_TYPE, ({ data }) => {\n\t\tconst { type, messageId, value, done } = data;\n\t\ttry {\n\t\t\tif (type == MESSAGE_START) {\n\t\t\t\tinit(data);\n\t\t\t}\n\t\t\tif (type == MESSAGE_DATA) {\n\t\t\t\tconst resolve = pendingPullMessages.get(messageId);\n\t\t\t\tpendingPullMessages.delete(messageId);\n\t\t\t\tresolve({ value: value || new Uint8Array(), done });\n\t\t\t}\n\t\t\tif (type == MESSAGE_ACK_DATA) {\n\t\t\t\tconst resolve = pendingDataMessages.get(messageId);\n\t\t\t\tpendingDataMessages.delete(messageId);\n\t\t\t\tresolve();\n\t\t\t}\n\t\t\tif (type == MESSAGE_CLOSE) {\n\t\t\t\tabortController.abort();\n\t\t\t}\n\t\t} catch (error) {\n\t\t\tsendErrorMessage(error);\n\t\t}\n\t});\n\n\tpostMessage({ type: MESSAGE_READY });\n\n\tasync function init(message) {\n\t\tlet codecStream, writable;\n\t\ttry {\n\t\t\tconst { options, config } = message;\n\t\t\tif (options.format) {\n\t\t\t\ttry {\n\t\t\t\t\tawait ensureCodecStreams(options.format, options.codecURI);\n\t\t\t\t} catch (error) {\n\t\t\t\t\terror.codecImportFailed = true;\n\t\t\t\t\tthrow error;\n\t\t\t\t}\n\t\t\t}\n\t\t\tconfig.CompressionStream = self.CompressionStream;\n\t\t\tconfig.DecompressionStream = self.DecompressionStream;\n\t\t\tif (options.compressed && !options.format) {\n\t\t\t\tif (!options.useCompressionStream) {\n\t\t\t\t\ttry {\n\t\t\t\t\t\tawait self.initModule(message.config);\n\t\t\t\t\t} catch {\n\t\t\t\t\t\toptions.useCompressionStream = true;\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tconst NativeStream = options.codecType.startsWith(CODEC_DEFLATE) ?\n\t\t\t\t\t\tconfig.CompressionStream :\n\t\t\t\t\t\tconfig.DecompressionStream;\n\t\t\t\t\tif (!supportsDeflateRaw(NativeStream)) {\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tawait self.initModule(message.config);\n\t\t\t\t\t\t} catch {\n\t\t\t\t\t\t\t// ignored\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (!config.CompressionStreamFallback && config.CompressionStreamZlib) {\n\t\t\t\tconfig.CompressionStreamFallback = config.CompressionStreamZlib;\n\t\t\t}\n\t\t\tif (!config.DecompressionStreamFallback && config.DecompressionStreamZlib) {\n\t\t\t\tconfig.DecompressionStreamFallback = config.DecompressionStreamZlib;\n\t\t\t}\n\t\t\tconst strategy = { highWaterMark: 1 };\n\t\t\tconst readable = message.readable || new ReadableStream({\n\t\t\t\tasync pull(controller) {\n\t\t\t\t\tconst result = new Promise(resolve => pendingPullMessages.set(messageId, resolve));\n\t\t\t\t\tsendMessage({ type: MESSAGE_PULL, messageId });\n\t\t\t\t\tmessageId = (messageId + 1) % Number.MAX_SAFE_INTEGER;\n\t\t\t\t\tconst { value, done } = await result;\n\t\t\t\t\tcontroller.enqueue(value);\n\t\t\t\t\tif (done) {\n\t\t\t\t\t\tcontroller.close();\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}, strategy);\n\t\t\twritable = message.writable || new WritableStream({\n\t\t\t\tasync write(value) {\n\t\t\t\t\tlet resolveAckData;\n\t\t\t\t\tconst ackData = new Promise(resolve => resolveAckData = resolve);\n\t\t\t\t\tpendingDataMessages.set(messageId, resolveAckData);\n\t\t\t\t\tsendMessage({ type: MESSAGE_DATA, value, messageId });\n\t\t\t\t\tmessageId = (messageId + 1) % Number.MAX_SAFE_INTEGER;\n\t\t\t\t\tawait ackData;\n\t\t\t\t}\n\t\t\t}, strategy);\n\t\t\tcodecStream = new CodecStream(options, config);\n\t\t\tabortController = new AbortController();\n\t\t\tconst { signal } = abortController;\n\t\t\tawait readable\n\t\t\t\t.pipeThrough(codecStream)\n\t\t\t\t.pipeThrough(new ChunkStream(getChunkSize(config)))\n\t\t\t\t.pipeTo(writable, { signal, preventClose: true, preventAbort: true });\n\t\t\tawait writable.getWriter().close();\n\t\t\tconst {\n\t\t\t\tcrc32,\n\t\t\t\tinputSize,\n\t\t\t\toutputSize\n\t\t\t} = codecStream;\n\t\t\tsendMessage({\n\t\t\t\ttype: MESSAGE_CLOSE,\n\t\t\t\tresult: {\n\t\t\t\t\tcrc32,\n\t\t\t\t\tinputSize,\n\t\t\t\t\toutputSize\n\t\t\t\t}\n\t\t\t});\n\t\t} catch (error) {\n\t\t\terror.outputSize = codecStream ? codecStream.outputSize : 0;\n\t\t\tif (writable && !writable.locked) {\n\t\t\t\ttry {\n\t\t\t\t\tawait writable.getWriter().close();\n\t\t\t\t} catch {\n\t\t\t\t\t// ignored\n\t\t\t\t}\n\t\t\t}\n\t\t\tsendErrorMessage(error);\n\t\t}\n\t}\n\n\tfunction sendMessage(message) {\n\t\tconst { value } = message;\n\t\tif (value) {\n\t\t\tif (value.length) {\n\t\t\t\ttry {\n\t\t\t\t\tmessage.value = toExactUint8Array(value).buffer;\n\t\t\t\t\tpostMessage(message, [message.value]);\n\t\t\t\t} catch {\n\t\t\t\t\tpostMessage(message);\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tpostMessage(message);\n\t\t\t}\n\t\t} else {\n\t\t\tpostMessage(message);\n\t\t}\n\t}\n\n\tfunction sendErrorMessage(error = new Error(\"Unknown error\")) {\n\t\tconst { message, stack, code, name, outputSize, cause, codecImportFailed } = error;\n\t\tconst errorData = { message, stack, code, name, outputSize };\n\t\tif (cause) {\n\t\t\terrorData.cause = { name: cause.name, message: cause.message };\n\t\t}\n\t\tif (codecImportFailed) {\n\t\t\terrorData.codecImportFailed = true;\n\t\t}\n\t\tpostMessage({ error: errorData });\n\t}\n\n\t/*\n\t Copyright (c) 2025 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\t/* global TransformStream */\n\n\tlet wasm, malloc, free, memory, initError;\n\n\tfunction setWasmExports(wasmAPI) {\n\t\twasm = wasmAPI;\n\t\t({ malloc, free, memory } = wasm);\n\t\tif (typeof malloc !== \"function\" || typeof free !== \"function\" || !memory) {\n\t\t\twasm = malloc = free = memory = null;\n\t\t\tthrow new Error(\"Invalid WASM module\");\n\t\t}\n\t}\n\n\tfunction setInitError(error) {\n\t\tinitError = error;\n\t}\n\n\tfunction _make(isCompress, type, options = {}) {\n\t\tif (!wasm) {\n\t\t\tconst error = new Error(\"WASM module not loaded\");\n\t\t\terror.cause = initError;\n\t\t\tthrow error;\n\t\t}\n\t\tconst level = (typeof options.level === \"number\") ? options.level : -1;\n\t\tconst outBufferSize = (typeof options.outBuffer === \"number\") ? options.outBuffer : 64 * 1024;\n\t\tconst inBufferSize = (typeof options.inBufferSize === \"number\") ? options.inBufferSize : 64 * 1024;\n\n\t\treturn new TransformStream({\n\t\t\tstart() {\n\t\t\t\ttry {\n\t\t\t\t\tlet result;\n\t\t\t\t\tthis.out = malloc(outBufferSize);\n\t\t\t\t\tthis.in = malloc(inBufferSize);\n\t\t\t\t\tthis.inBufferSize = inBufferSize;\n\t\t\t\t\tif (!this.out || !this.in) {\n\t\t\t\t\t\tthrow new Error(\"allocation failed\");\n\t\t\t\t\t}\n\t\t\t\t\tthis._scratch = new Uint8Array(outBufferSize);\n\t\t\t\t\tif (isCompress) {\n\t\t\t\t\t\tthis._process = wasm.deflate_process;\n\t\t\t\t\t\tthis._last_consumed = wasm.deflate_last_consumed;\n\t\t\t\t\t\tthis._end = wasm.deflate_end;\n\t\t\t\t\t\tthis.streamHandle = wasm.deflate_new();\n\t\t\t\t\t\tif (type === \"gzip\") {\n\t\t\t\t\t\t\tresult = wasm.deflate_init_gzip(this.streamHandle, level);\n\t\t\t\t\t\t} else if (type === \"deflate-raw\") {\n\t\t\t\t\t\t\tresult = wasm.deflate_init_raw(this.streamHandle, level);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tresult = wasm.deflate_init(this.streamHandle, level);\n\t\t\t\t\t\t}\n\t\t\t\t\t} else {\n\t\t\t\t\t\tif (type === \"deflate64-raw\") {\n\t\t\t\t\t\t\tthis._process = wasm.inflate9_process;\n\t\t\t\t\t\t\tthis._last_consumed = wasm.inflate9_last_consumed;\n\t\t\t\t\t\t\tthis._end = wasm.inflate9_end;\n\t\t\t\t\t\t\tthis.streamHandle = wasm.inflate9_new();\n\t\t\t\t\t\t\tresult = wasm.inflate9_init_raw(this.streamHandle);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tthis._process = wasm.inflate_process;\n\t\t\t\t\t\t\tthis._last_consumed = wasm.inflate_last_consumed;\n\t\t\t\t\t\t\tthis._end = wasm.inflate_end;\n\t\t\t\t\t\t\tthis.streamHandle = wasm.inflate_new();\n\t\t\t\t\t\t\tif (type === \"deflate-raw\") {\n\t\t\t\t\t\t\t\tresult = wasm.inflate_init_raw(this.streamHandle);\n\t\t\t\t\t\t\t} else if (type === \"gzip\") {\n\t\t\t\t\t\t\t\tresult = wasm.inflate_init_gzip(this.streamHandle);\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tresult = wasm.inflate_init(this.streamHandle);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tif (result !== 0) {\n\t\t\t\t\t\tthrow new Error(\"init failed:\" + result);\n\t\t\t\t\t}\n\t\t\t\t} catch (error) {\n\t\t\t\t\tdisposeStream(this);\n\t\t\t\t\tthrow error;\n\t\t\t\t}\n\t\t\t},\n\t\t\ttransform(chunk, controller) {\n\t\t\t\ttry {\n\t\t\t\t\tconst buffer = chunk;\n\t\t\t\t\tconst heap = new Uint8Array(memory.buffer);\n\t\t\t\t\tconst process = this._process;\n\t\t\t\t\tconst last_consumed = this._last_consumed;\n\t\t\t\t\tconst out = this.out;\n\t\t\t\t\tconst scratch = this._scratch;\n\t\t\t\t\tlet offset = 0;\n\t\t\t\t\twhile (offset < buffer.length) {\n\t\t\t\t\t\tconst toRead = Math.min(buffer.length - offset, 32 * 1024);\n\t\t\t\t\t\tif (!this.in || this.inBufferSize < toRead) {\n\t\t\t\t\t\t\tif (this.in && free) {\n\t\t\t\t\t\t\t\tfree(this.in);\n\t\t\t\t\t\t\t\tthis.in = 0;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tthis.in = malloc(toRead);\n\t\t\t\t\t\t\tthis.inBufferSize = toRead;\n\t\t\t\t\t\t\tif (!this.in) {\n\t\t\t\t\t\t\t\tthrow new Error(\"allocation failed\");\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\theap.set(buffer.subarray(offset, offset + toRead), this.in);\n\t\t\t\t\t\tconst result = process(this.streamHandle, this.in, toRead, out, outBufferSize, 0);\n\t\t\t\t\t\tconst prod = result & 0x00ffffff;\n\t\t\t\t\t\tif (prod) {\n\t\t\t\t\t\t\tscratch.set(heap.subarray(out, out + prod), 0);\n\t\t\t\t\t\t\tcontroller.enqueue(scratch.slice(0, prod));\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif (!isCompress) {\n\t\t\t\t\t\t\tconst code = (result >> 24) & 0xff;\n\t\t\t\t\t\t\tconst signedCode = (code & 0x80) ? code - 256 : code;\n\t\t\t\t\t\t\tif (signedCode < 0) {\n\t\t\t\t\t\t\t\tthrow new Error(\"process error:\" + signedCode);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\tconst consumed = last_consumed(this.streamHandle);\n\t\t\t\t\t\tif (consumed === 0) {\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t\toffset += consumed;\n\t\t\t\t\t}\n\t\t\t\t} catch (error) {\n\t\t\t\t\tdisposeStream(this);\n\t\t\t\t\tcontroller.error(error);\n\t\t\t\t}\n\t\t\t},\n\t\t\tflush(controller) {\n\t\t\t\ttry {\n\t\t\t\t\tconst heap = new Uint8Array(memory.buffer);\n\t\t\t\t\tconst process = this._process;\n\t\t\t\t\tconst out = this.out;\n\t\t\t\t\tconst scratch = this._scratch;\n\t\t\t\t\twhile (true) {\n\t\t\t\t\t\tconst result = process(this.streamHandle, 0, 0, out, outBufferSize, 4);\n\t\t\t\t\t\tconst produced = result & 0x00ffffff;\n\t\t\t\t\t\tconst code = (result >> 24) & 0xff;\n\t\t\t\t\t\tif (!isCompress) {\n\t\t\t\t\t\t\tconst signedCode = (code & 0x80) ? code - 256 : code;\n\t\t\t\t\t\t\tif (signedCode < 0) {\n\t\t\t\t\t\t\t\tthrow new Error(\"process error:\" + signedCode);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif (produced) {\n\t\t\t\t\t\t\tscratch.set(heap.subarray(out, out + produced), 0);\n\t\t\t\t\t\t\tcontroller.enqueue(scratch.slice(0, produced));\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif (code === 1 || produced === 0) {\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t} catch (error) {\n\t\t\t\t\tcontroller.error(error);\n\t\t\t\t} finally {\n\t\t\t\t\tconst result = disposeStream(this);\n\t\t\t\t\tif (result !== 0) {\n\t\t\t\t\t\tcontroller.error(new Error(\"end error:\" + result));\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t},\n\t\t\tcancel() {\n\t\t\t\t// release the stream handle and buffers when the pipeline is aborted,\n\t\t\t\t// they would be leaked in the process-lifetime wasm heap otherwise\n\t\t\t\tdisposeStream(this);\n\t\t\t}\n\t\t});\n\n\t\tfunction disposeStream(state) {\n\t\t\tlet endResult = 0;\n\t\t\tif (state.streamHandle && state._end) {\n\t\t\t\tendResult = state._end(state.streamHandle);\n\t\t\t}\n\t\t\tstate.streamHandle = 0;\n\t\t\tif (state.in && free) {\n\t\t\t\tfree(state.in);\n\t\t\t}\n\t\t\tstate.in = 0;\n\t\t\tif (state.out && free) {\n\t\t\t\tfree(state.out);\n\t\t\t}\n\t\t\tstate.out = 0;\n\t\t\treturn endResult;\n\t\t}\n\t}\n\n\tclass CompressionStreamZlib {\n\t\tconstructor(type = \"deflate\", options) {\n\t\t\treturn _make(true, type, options);\n\t\t}\n\t}\n\tclass DecompressionStreamZlib {\n\t\tconstructor(type = \"deflate\", options) {\n\t\t\treturn _make(false, type, options);\n\t\t}\n\t}\n\t// These codecs are backed by the WASM module; they are unusable until setWasmExports() has run.\n\t// The worker uses this flag to know it must fall back to the native CompressionStream when the\n\t// module fails to load, rather than discarding a self-contained codec supplied through config.\n\tCompressionStreamZlib.requiresModule = true;\n\tDecompressionStreamZlib.requiresModule = true;\n\n\t/*\n\t Copyright (c) 2025 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tlet initializedModule = false;\n\n\tasync function initModule(wasmURI, { baseURI }) {\n\t\tif (!initializedModule) {\n\t\t\ttry {\n\t\t\t\tawait instantiateModule(wasmURI, baseURI);\n\t\t\t\tinitializedModule = true;\n\t\t\t} catch (error) {\n\t\t\t\tsetInitError(error);\n\t\t\t\tthrow error;\n\t\t\t}\n\t\t}\n\t}\n\n\tasync function instantiateModule(wasmURI, baseURI) {\n\t\tlet arrayBuffer, uri;\n\t\ttry {\n\t\t\ttry {\n\t\t\t\turi = new URL(wasmURI, baseURI);\n\t\t\t} catch {\n\t\t\t\t// ignored\n\t\t\t}\n\t\t\tconst response = await fetch(uri);\n\t\t\tarrayBuffer = await response.arrayBuffer();\n\t\t} catch (error) {\n\t\t\tif (wasmURI.startsWith(\"data:application/wasm;base64,\")) {\n\t\t\t\tarrayBuffer = arrayBufferFromDataURI(wasmURI);\n\t\t\t} else {\n\t\t\t\tthrow error;\n\t\t\t}\n\t\t}\n\t\tconst wasmInstance = await WebAssembly.instantiate(arrayBuffer);\n\t\tsetWasmExports(wasmInstance.instance.exports);\n\t}\n\n\tfunction arrayBufferFromDataURI(dataURI) {\n\t\tconst base64 = dataURI.split(\",\")[1];\n\t\tconst binary = atob(base64);\n\t\tconst len = binary.length;\n\t\tconst bytes = new Uint8Array(len);\n\t\tfor (let i = 0; i < len; ++i) {\n\t\t\tbytes[i] = binary.charCodeAt(i);\n\t\t}\n\t\treturn bytes.buffer;\n\t}\n\n\t/*\n\t Copyright (c) 2025 Gildas Lormeau. All rights reserved.\n\n\t Redistribution and use in source and binary forms, with or without\n\t modification, are permitted provided that the following conditions are met:\n\n\t 1. Redistributions of source code must retain the above copyright notice,\n\t this list of conditions and the following disclaimer.\n\n\t 2. Redistributions in binary form must reproduce the above copyright \n\t notice, this list of conditions and the following disclaimer in \n\t the documentation and/or other materials provided with the distribution.\n\n\t 3. The names of the authors may not be used to endorse or promote products\n\t derived from this software without specific prior written permission.\n\n\t THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,\n\t INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\n\t FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,\n\t INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,\n\t INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,\n\t OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF\n\t LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING\n\t NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,\n\t EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\n\n\tinitWorker({\n\t\tCompressionStreamFallback: CompressionStreamZlib,\n\t\tDecompressionStreamFallback: DecompressionStreamZlib,\n\t\tinit: config => initModule(config.wasmURI, config)\n\t});\n\n}));\n";

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
	const FIXED_LITERAL_LENGTHS$1 = new Uint8Array(288);
	FIXED_LITERAL_LENGTHS$1.fill(8, 0, 144);
	FIXED_LITERAL_LENGTHS$1.fill(9, 144, 256);
	FIXED_LITERAL_LENGTHS$1.fill(7, 256, 280);
	FIXED_LITERAL_LENGTHS$1.fill(8, 280, 288);
	new Uint8Array(30).fill(5);

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
	const BASE64_TABLE$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

	function base64Encode$1(bytes) {
		let out = "";
		const len = bytes.length;
		let i = 0;
		for (; i + 2 < len; i += 3) {
			const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
			out += BASE64_TABLE$1[(n >> 18) & 63] + BASE64_TABLE$1[(n >> 12) & 63] + BASE64_TABLE$1[(n >> 6) & 63] + BASE64_TABLE$1[n & 63];
		}
		const rem = len - i;
		if (rem === 1) {
			const n = bytes[i] << 16;
			out += BASE64_TABLE$1[(n >> 18) & 63] + BASE64_TABLE$1[(n >> 12) & 63] + "==";
		} else if (rem === 2) {
			const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
			out += BASE64_TABLE$1[(n >> 18) & 63] + BASE64_TABLE$1[(n >> 12) & 63] + BASE64_TABLE$1[(n >> 6) & 63] + "=";
		}
		return out;
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


	function createConfigureWebWorker(getSource) {
		return configure => configure({
			workerURI: useBlobURI => {
				const type = "text/javascript";
				let source = getSource();
				if (typeof source == "string") {
					source = new TextEncoder().encode(source);
				}
				if (useBlobURI) {
					const blob = new Blob([source], { type });
					return URL.createObjectURL(blob);
				} else {
					return "data:" + type + ";base64," + base64Encode$1(source);
				}
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


	const configureWebWorker = createConfigureWebWorker(() => workerCode);

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
						pending,
						ready
					} = this;
					if (hmac && ctr) {
						await ready;
						const chunkToDecrypt = subarray(pending, 0, pending.length - AUTHENTICATION_CODE_LENGTH);
						const originalAuthenticationCode = subarray(pending, pending.length - AUTHENTICATION_CODE_LENGTH);
						let decryptedChunkArray = EMPTY_UINT8_ARRAY;
						if (chunkToDecrypt.length) {
							const encryptedChunk = toBits(codecBytes, chunkToDecrypt);
							hmac.update(encryptedChunk);
							const decryptedChunk = ctr.update(encryptedChunk);
							decryptedChunkArray = fromBits(codecBytes, decryptedChunk);
						}
						const authenticationCode = subarray(fromBits(codecBytes, hmac.digest()), 0, AUTHENTICATION_CODE_LENGTH);
						let invalidAuthenticationCode = pending.length < AUTHENTICATION_CODE_LENGTH ? 1 : 0;
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
			pending: EMPTY_UINT8_ARRAY
		});
	}

	function append(aesCrypto, input, output, paddingStart, paddingEnd, verifyAuthenticationCode) {
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
			if (verifyAuthenticationCode) {
				hmac.update(inputChunk);
			}
			const outputChunk = ctr.update(inputChunk);
			if (!verifyAuthenticationCode) {
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


	const HTTP_HEADER_CONTENT_TYPE = "Content-Type";

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
		if (responseSupportsGlobalReadable()) {
			const options = {};
			if (contentType) {
				options.headers = [[HTTP_HEADER_CONTENT_TYPE, contentType]];
			}
			return new Response(readable, options).blob();
		}
		const chunks = [];
		return readable
			.pipeTo(new WritableStream({
				write(chunk) {
					chunks.push(chunk);
				}
			}))
			.then(() => new Blob(chunks, contentType ? { type: contentType } : {}));
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
			writer.blob = streamToBlob(transformStream.readable, contentType);
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
		PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP,
		PROPERTY_NAME_EXTRA_FIELD_USDZ
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
			getValue: getUint32,
			bytes: 4
		},
		[MAX_32_BITS]: {
			getValue: getBigUint64,
			bytes: 8
		}
	};
	const MAX_END_OF_CENTRAL_DIR_PROBES = 64;
	const CENTRAL_DIRECTORY_UNREACHABLE = 0;
	const CENTRAL_DIRECTORY_PLAUSIBLE = 1;
	const CENTRAL_DIRECTORY_REACHABLE = 2;

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
				reader = new BlobReader(await streamToBlob(reader.readable));
				await initStream(reader);
			}
			if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const strictness = getStrictness(getOptionValue$1(zipReader, options, OPTION_STRICTNESS), getOptionValue$1(zipReader, options, OPTION_CHECK_AMBIGUITY));
			const checkAmbiguity = strictness == STRICTNESS_STRICT;
			const rejectAmbiguousEndOfDirectory = strictness != STRICTNESS_TOLERANT;
			const maxAppendedDataSize = getMaxAppendedDataSize(getOptionValue$1(zipReader, options, OPTION_MAX_APPENDED_DATA_SIZE), strictness);
			const filenameValidation = getFilenameValidation(getOptionValue$1(zipReader, options, OPTION_FILENAME_VALIDATION), strictness);
			const normalizeFilename = getOptionValue$1(zipReader, options, OPTION_NORMALIZE_FILENAME);
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
					if (zip64EndOfDirectoryVersion2) {
						const extensibleDataLength = Math.min(
							Number(getBigUint64(endOfDirectoryView, 4)) - (ZIP64_END_OF_CENTRAL_DIR_LENGTH - 12),
							reader.size - directoryDataOffset - ZIP64_END_OF_CENTRAL_DIR_LENGTH);
						if (extensibleDataLength > 0) {
							const rawExtensibleData = await readUint8Array(reader, directoryDataOffset + ZIP64_END_OF_CENTRAL_DIR_LENGTH, extensibleDataLength);
							directoryEncryptionInfo = getDirectoryEncryptionInfo(rawExtensibleData);
						}
					}
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
			let declaredDirectoryDataLength = directoryDataLength;
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
			zipReader.directoryOffset = directoryDataOffset;
			zipReader.directoryLength = declaredDirectoryDataLength;
			const decryptCentralDirectory = getOptionValue$1(zipReader, options, OPTION_DECRYPT_CENTRAL_DIRECTORY);
			let decryptedDirectory;
			if (decryptCentralDirectory && filesLength && directoryArray.length >= 4 &&
				getUint32(directoryView, 0) != CENTRAL_FILE_HEADER_SIGNATURE &&
				(zip64EndOfDirectoryVersion2 || detectEncryptedCentralDirectory(directoryView))) {
				directoryArray = await decryptCentralDirectory(directoryArray, directoryEncryptionInfo);
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
				const fileEntry = new ZipEntry$1(reader, config, zipReader.options);
				if (offset + CENTRAL_FILE_HEADER_LENGTH > directoryArray.length || getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
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
			if (offset + 6 <= directoryArray.length && getUint32(directoryView, offset) == DIGITAL_SIGNATURE_RECORD_SIGNATURE) {
				const signatureDataLength = getUint16(directoryView, offset + 4);
				if (offset + 6 + signatureDataLength <= directoryArray.length) {
					zipReader.digitalSignature = directoryArray.subarray(offset + 6, offset + 6 + signatureDataLength);
					offsetAfterSignature = offset + 6 + signatureDataLength;
				}
			}
			if (checkAmbiguity && offset != declaredDirectoryDataLength && offsetAfterSignature != declaredDirectoryDataLength) {
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

	let ZipEntry$1 = class ZipEntry {

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
					outputSize: passThrough ? compressedSize : uncompressedSize,
					crc32,
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
					abortError = error;
					throw error;
				}
			} finally {
				const preventClose = getOptionValue$1(zipEntry, options, OPTION_PREVENT_CLOSE);
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
			if (getUint32(directoryView, offset) == ARCHIVE_EXTRA_DATA_SIGNATURE) {
				return true;
			}
		}
		return false;
	}

	function getDirectoryEncryptionInfo(rawExtensibleData) {
		const directoryEncryptionInfo = { rawExtensibleData };
		if (rawExtensibleData.length >= 28) {
			const extensibleDataView = getDataView(rawExtensibleData);
			const hashDataLength = getUint16(extensibleDataView, 26);
			Object.assign(directoryEncryptionInfo, {
				compressionMethod: getUint16(extensibleDataView, 0),
				compressedSize: Number(getBigUint64(extensibleDataView, 2)),
				uncompressedSize: Number(getBigUint64(extensibleDataView, 10)),
				encryptionAlgorithm: getUint16(extensibleDataView, 18),
				bitLength: getUint16(extensibleDataView, 20),
				flags: getUint16(extensibleDataView, 22),
				hashAlgorithm: getUint16(extensibleDataView, 24),
				hashData: rawExtensibleData.subarray(28, 28 + hashDataLength)
			});
		}
		return directoryEncryptionInfo;
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
			crc32: getUint32(dataView, offset + HEADER_OFFSET_SIGNATURE),
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
		const computedCrc32 = new Crc32();
		computedCrc32.append(fileEntry[rawPropertyName]);
		const computedCrc32View = getDataView(new Uint8Array(4));
		computedCrc32View.setUint32(0, computedCrc32.get(), true);
		const nameCrc32 = getUint32(extraFieldView, 1);
		Object.assign(extraFieldUnicode, {
			version: getUint8(extraFieldView, 0),
			[propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
			valid: !fileEntry.bitFlag.languageEncodingFlag && nameCrc32 == getUint32(computedCrc32View, 0)
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
	}

	function readExtraFieldUnixDates(extraField, directory) {
		if (extraField.data.length < 8) {
			return;
		}
		const extraFieldView = getDataView(extraField.data);
		const lastAccessDate = new Date(getUint32(extraFieldView, 0) * 1000);
		const lastModDate = new Date(getUint32(extraFieldView, 4) * 1000);
		const extraFieldData = { lastAccessDate, lastModDate };
		if (extraField.data.length >= 12) {
			extraFieldData.uid = getUint16(extraFieldView, 8);
			extraFieldData.gid = getUint16(extraFieldView, 10);
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
			const dataDescriptorSignature = dataDescriptorArray.length == dataDescriptorLength + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH &&
				getUint32(getDataView(dataDescriptorArray), 0) == DATA_DESCRIPTOR_RECORD_SIGNATURE;
			if (dataDescriptorSignature) {
				const readCrc32 = getUint32(getDataView(dataDescriptorArray), 4);
				let readCompressedSize;
				let readUncompressedSize;
				if (extraFieldZip64) {
					readCompressedSize = getBigUint64(getDataView(dataDescriptorArray), 8);
					readUncompressedSize = getBigUint64(getDataView(dataDescriptorArray), 16);
				} else {
					readCompressedSize = getUint32(getDataView(dataDescriptorArray), 8);
					readUncompressedSize = getUint32(getDataView(dataDescriptorArray), 12);
				}
				const matchCrc32 = (fileEntry.encrypted && !fileEntry.zipCrypto) || readCrc32 == crc32;
				if (matchCrc32 &&
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

	function isStrictnessValue(value) {
		return value === STRICTNESS_STRICT || value === STRICTNESS_BALANCED || value === STRICTNESS_TOLERANT;
	}

	function getStrictness(strictness, checkAmbiguity) {
		if (strictness === UNDEFINED_VALUE) {
			return checkAmbiguity ? STRICTNESS_STRICT : STRICTNESS_BALANCED;
		}
		if (!isStrictnessValue(strictness)) {
			throw new Error(ERR_INVALID_STRICTNESS);
		}
		return strictness;
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
			const size = toNumber$1(maxAppendedDataSize);
			if (typeof size != NUMBER_TYPE || !(size >= 0)) {
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

	function toNumber$1(value) {
		return typeof value == STRING_TYPE && value.trim() ? Number(value) : value;
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
	const MIN_NTFS_TIME = BigInt(0);
	const MAX_NTFS_TIME = BigInt("0x7fffffffffffffff");
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
	const ERR_INVALID_LEVEL = "Invalid level (must be integer 0..9)";
	const ERR_INVALID_PASSWORD_TYPE = "Invalid password (password must be a string, rawPassword must be a Uint8Array)";
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
				const { crc32 } = entry;
				if (crc32 !== UNDEFINED_VALUE) {
					setUint32(headerView, HEADER_OFFSET_SIGNATURE, crc32);
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
			// deno-lint-ignore valid-typeof
			if (typeof entry == STRING_TYPE) {
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
				crc32: options.crc32 === UNDEFINED_VALUE ? options[PROPERTY_NAME_SIGNATURE] : options.crc32,
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
		let rawFilename = encode(name, TEXT_TYPE_FILENAME);
		if (rawFilename === UNDEFINED_VALUE) {
			rawFilename = encodeText(name);
		}
		if (getLength(rawFilename) > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_NAME);
		}
		const comment = options[PROPERTY_NAME_COMMENT] || "";
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
		const lastModDate = getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE, new Date());
		const lastAccessDate = getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_ACCESS_DATE);
		const creationDate = getOptionValue(zipWriter, options, PROPERTY_NAME_CREATION_DATE);
		const internalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES, 0);
		const passThrough = getOptionValue(zipWriter, options, OPTION_PASS_THROUGH);
		let password, rawPassword;
		if (!passThrough) {
			password = getOptionValue(zipWriter, options, OPTION_PASSWORD);
			rawPassword = getOptionValue(zipWriter, options, OPTION_RAW_PASSWORD);
			if ((password && typeof password != STRING_TYPE) || (rawPassword && !(rawPassword instanceof Uint8Array))) {
				throw new Error(ERR_INVALID_PASSWORD_TYPE);
			}
		}
		const encryptionStrength = getNumberOptionValue(zipWriter, options, OPTION_ENCRYPTION_STRENGTH, 3);
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
		let extraFieldSize = 0;
		let offset = 0;
		extraField.forEach(data => extraFieldSize += 4 + getLength(data));
		const rawExtraField = new Uint8Array(extraFieldSize);
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
		return rawExtraField;
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
			crc32,
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
			encrypted,
			zipCrypto,
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
					extraFieldNTFS.uint64(lastAccessDate ? getTimeNTFS(lastAccessDate) : lastModTimeNTFS);
					extraFieldNTFS.uint64(creationDate ? getTimeNTFS(creationDate) : lastModTimeNTFS);
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
		localHeader.bytes(rawLocalExtraField);
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
		const directoryDataLength = createDirectoryRecords(zipWriter.files);
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
		return {
			directoryStart: { diskNumber: directoryStartDiskNumber, diskOffset: directoryStartDiskOffset },
			directoryArray
		};
	}

	async function writeDigitalSignatureRecord(zipWriter, directoryArray, options) {
		const signCentralDirectory = getOptionValue(zipWriter, options, OPTION_SIGN_CENTRAL_DIRECTORY);
		if (signCentralDirectory) {
			const signatureData = await signCentralDirectory(directoryArray);
			const signatureDataLength = getLength(signatureData);
			if (signatureDataLength > MAX_16_BITS) {
				throw new Error(ERR_INVALID_SIGNATURE_DATA);
			}
			const signatureRecord = createRecordWriter(6 + signatureDataLength);
			signatureRecord.uint32(DIGITAL_SIGNATURE_RECORD_SIGNATURE);
			signatureRecord.uint16(signatureDataLength);
			signatureRecord.bytes(signatureData);
			await writeData(zipWriter.writer, signatureRecord.array);
			return 6 + signatureDataLength;
		}
		return 0;
	}

	async function writeEndOfDirectoryRecord(zipWriter, comment, options, cdInfo) {
		const { writer } = zipWriter;
		const { directoryStart, signatureLength } = cdInfo;
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
			endOfdirectoryRecord.uint64(BigInt(getSegmentOffset(zipWriter, writer)) + BigInt(directoryDataLength) + BigInt(signatureLength));
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

	function getNumberOptionValue(zipWriter, options, name, defaultValue) {
		return toNumber(getOptionValue(zipWriter, options, name, defaultValue));
	}

	function toNumber(value) {
		return typeof value == STRING_TYPE && value.trim() ? Number(value) : value;
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
		setDefaultConfiguration({ baseURI: (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('zip-fs.js', document.baseURI).href)) });
	} catch {
		// ignored
	}

	var data = "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";

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
	const MAX_CODE_LENGTH = 15;
	const END_OF_BLOCK = 256;
	const LENGTH_BASES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
	const LENGTH_EXTRA_BITS = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
	const DISTANCE_BASES = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
	const DISTANCE_EXTRA_BITS = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
	const CODE_LENGTH_CODE_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
	const FIXED_LITERAL_LENGTHS = new Uint8Array(288);
	FIXED_LITERAL_LENGTHS.fill(8, 0, 144);
	FIXED_LITERAL_LENGTHS.fill(9, 144, 256);
	FIXED_LITERAL_LENGTHS.fill(7, 256, 280);
	FIXED_LITERAL_LENGTHS.fill(8, 280, 288);
	const FIXED_DISTANCE_LENGTHS = new Uint8Array(30).fill(5);

	function inflateRaw(input) {
		let inputIndex = 0;
		let bitBuffer = 0;
		let bitCount = 0;
		let output = new Uint8Array(1024);
		let outputLength = 0;
		let lastBlock = 0;
		while (!lastBlock) {
			lastBlock = readBits(1);
			const blockType = readBits(2);
			if (blockType == 0) {
				copyStoredBlock();
			} else if (blockType == 1) {
				inflateBlock(buildHuffmanTable(FIXED_LITERAL_LENGTHS), buildHuffmanTable(FIXED_DISTANCE_LENGTHS));
			} else if (blockType == 2) {
				inflateBlock(...readDynamicTables());
			} else {
				throw new Error("invalid deflate block type");
			}
		}
		return output.subarray(0, outputLength);

		function readByte() {
			if (inputIndex >= input.length) {
				throw new Error("unexpected end of deflate data");
			}
			return input[inputIndex++];
		}

		function readBits(count) {
			while (bitCount < count) {
				bitBuffer |= readByte() << bitCount;
				bitCount += 8;
			}
			const value = bitBuffer & ((1 << count) - 1);
			bitBuffer >>>= count;
			bitCount -= count;
			return value;
		}

		function copyStoredBlock() {
			bitBuffer = 0;
			bitCount = 0;
			const length = readByte() | (readByte() << 8);
			inputIndex += 2;
			ensureOutput(outputLength + length);
			for (let indexByte = 0; indexByte < length; indexByte++) {
				output[outputLength++] = readByte();
			}
		}

		function inflateBlock(literalTable, distanceTable) {
			let symbol = decodeSymbol(literalTable);
			while (symbol != END_OF_BLOCK) {
				if (symbol < END_OF_BLOCK) {
					ensureOutput(outputLength + 1);
					output[outputLength++] = symbol;
				} else {
					const lengthIndex = symbol - 257;
					const length = LENGTH_BASES[lengthIndex] + readBits(LENGTH_EXTRA_BITS[lengthIndex]);
					const distanceIndex = decodeSymbol(distanceTable);
					const distance = DISTANCE_BASES[distanceIndex] + readBits(DISTANCE_EXTRA_BITS[distanceIndex]);
					ensureOutput(outputLength + length);
					const copyStart = outputLength - distance;
					for (let indexByte = 0; indexByte < length; indexByte++) {
						output[outputLength++] = output[copyStart + indexByte];
					}
				}
				symbol = decodeSymbol(literalTable);
			}
		}

		function readDynamicTables() {
			const literalLengthCount = readBits(5) + 257;
			const distanceLengthCount = readBits(5) + 1;
			const codeLengthCount = readBits(4) + 4;
			const codeLengthLengths = new Uint8Array(19);
			for (let indexCode = 0; indexCode < codeLengthCount; indexCode++) {
				codeLengthLengths[CODE_LENGTH_CODE_ORDER[indexCode]] = readBits(3);
			}
			const codeLengthTable = buildHuffmanTable(codeLengthLengths);
			const lengths = new Uint8Array(literalLengthCount + distanceLengthCount);
			let indexLength = 0;
			while (indexLength < lengths.length) {
				const symbol = decodeSymbol(codeLengthTable);
				if (symbol < 16) {
					lengths[indexLength++] = symbol;
				} else if (symbol == 16) {
					const previousLength = lengths[indexLength - 1];
					let repeatCount = readBits(2) + 3;
					while (repeatCount--) {
						lengths[indexLength++] = previousLength;
					}
				} else {
					const repeatCount = symbol == 17 ? readBits(3) + 3 : readBits(7) + 11;
					indexLength += repeatCount;
				}
			}
			return [
				buildHuffmanTable(lengths.subarray(0, literalLengthCount)),
				buildHuffmanTable(lengths.subarray(literalLengthCount))
			];
		}

		function decodeSymbol(table) {
			const { lengthCounts, symbols } = table;
			let code = 0;
			let first = 0;
			let index = 0;
			for (let length = 1; length <= MAX_CODE_LENGTH; length++) {
				code |= readBits(1);
				const count = lengthCounts[length];
				if (code - first < count) {
					return symbols[index + (code - first)];
				}
				index += count;
				first = (first + count) << 1;
				code <<= 1;
			}
			throw new Error("invalid huffman code");
		}

		function ensureOutput(length) {
			if (output.length < length) {
				let newLength = output.length * 2;
				while (newLength < length) {
					newLength *= 2;
				}
				const newOutput = new Uint8Array(newLength);
				newOutput.set(output.subarray(0, outputLength));
				output = newOutput;
			}
		}
	}

	function buildHuffmanTable(codeLengths) {
		const lengthCounts = new Uint16Array(MAX_CODE_LENGTH + 1);
		for (const length of codeLengths) {
			lengthCounts[length]++;
		}
		lengthCounts[0] = 0;
		const offsets = new Uint16Array(MAX_CODE_LENGTH + 2);
		for (let length = 1; length <= MAX_CODE_LENGTH; length++) {
			offsets[length + 1] = offsets[length] + lengthCounts[length];
		}
		const symbols = new Uint16Array(codeLengths.length);
		for (let symbol = 0; symbol < codeLengths.length; symbol++) {
			if (codeLengths[symbol]) {
				symbols[offsets[codeLengths[symbol]]++] = symbol;
			}
		}
		return { lengthCounts, symbols };
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
	const BASE64_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

	function base64Decode(b64) {
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

	function base64Encode(bytes) {
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


	function configureZlibModule(configure) {
		let dataURI;
		configure({
			wasmURI: () => {
				if (!dataURI) {
					dataURI = "data:application/wasm;base64," + base64Encode(inflateRaw(base64Decode(data)));
				}
				return dataURI;
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


	configureZlibModule(setDefaultConfiguration);

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
	const ERR_ABORT_EXPORT = "zipjs-abort-export";
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
				options: params.options,
				id: fs.entryIdCounter++,
				parent,
				children: [],
				uncompressedSize: params.uncompressedSize || 0,
				passThrough: params.passThrough
			});
			if (parent || !fs.root) {
				fs.entries[zipEntry.id] = zipEntry;
			}
			if (parent) {
				zipEntry.parent.children.push(zipEntry);
			}
		}

		moveTo(target) {
			// deprecated
			const zipEntry = this;
			zipEntry.fs.move(zipEntry, target);
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
			if (!writer || (writer.constructor == zipEntry.Writer && zipEntry.data)) {
				return zipEntry.data;
			} else {
				const reader = zipEntry.reader = createReader(zipEntry.Reader, zipEntry.data, options);
				const uncompressedSize = zipEntry.data ? zipEntry.data.uncompressedSize : reader.size;
				await Promise.all([initStream(reader), initStream(writer, uncompressedSize)]);
				const { readable } = reader;
				const { signal } = options;
				zipEntry.uncompressedSize = reader.size;
				await toCompatibleReadable(readable).pipeTo(toCompatibleWritable(writer.writable), { signal });
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
				uncompressedSize: text.length
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

		addData(name, params) {
			return addChild(this, name, params);
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
			await initStream(reader);
			const zipReader = new ZipReader(reader, options);
			const importedEntries = [];
			const entries = await zipReader.getEntries();
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
							uncompressedSize: entry.uncompressedSize,
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
			const [readers] = await Promise.all([initReaders(zipEntry, options.readerOptions), initStream(writer)]);
			const zipWriter = new ZipWriter(writer, options);
			await exportZip(zipWriter, zipEntry, getTotalSize([zipEntry], "uncompressedSize"), options, readers);
			await zipWriter.close();
			return writer.getData ? writer.getData() : writer.writable;
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


	class FS {

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

		addData(name, params) {
			return this.root.addData(name, params);
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

		isPasswordProtected() {
			return this.root.isPasswordProtected();
		}

		checkPassword(password, options) {
			return this.root.checkPassword(password, options);
		}
	}

	const fs = { FS, ZipDirectoryEntry, ZipFileEntry };

	function getTotalSize(entries, propertyName) {
		let size = 0;
		const pendingEntries = Array.from(entries);
		while (pendingEntries.length) {
			const entry = pendingEntries.pop();
			size += entry[propertyName] || 0;
			for (const child of entry.children) {
				pendingEntries.push(child);
			}
		}
		return size;
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
				zipBlobReader.size = zipBlobReader.entry.uncompressedSize;
				const data = await zipBlobReader.entry.getData(new BlobWriter(), Object.assign({}, options, zipBlobReader.options));
				zipBlobReader.data = data;
				zipBlobReader.blobReader = new BlobReader(data);
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
		if (!signal) {
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
		const selectedEntry = entry;
		const entryOffsets = new Map();
		await process(zipWriter, entry);

		async function process(zipWriter, entry) {
			await exportChild();

			async function exportChild() {
				if (options.bufferedWrite) {
					const results = await Promise.allSettled(entry.children.map(processChild));
					const errorResult = results.find(result => result.status == "rejected");
					if (errorResult) {
						throw errorResult.reason;
					}
				} else {
					for (const child of entry.children) {
						await processChild(child);
					}
				}
			}

			async function processChild(child) {
				const name = options.relativePath ? child.getRelativeName(selectedEntry) : child.getFullname();
				const childOptions = child.options || {};
				let zipEntryOptions = {};
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
					zipEntryOptions = {
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
						zipEntryOptions.extraField = userExtraField;
					}
					if (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE) {
						Object.assign(zipEntryOptions, {
							uid,
							gid,
							unixExtraFieldType: options.unixExtraFieldType || INFOZIP_EXTRA_FIELD_TYPE
						});
					}
					if (child.passThrough) {
						let level, encryptionStrength;
						if (compressionMethod === 0) {
							level = 0;
						}
						if (extraFieldAES) {
							encryptionStrength = extraFieldAES.strength;
						}
						zipEntryOptions = Object.assign(zipEntryOptions, {
							passThrough: true,
							encrypted,
							zipCrypto,
							crc32,
							uncompressedSize,
							level,
							encryptionStrength,
							compressionMethod
						});
					}
				}
				await zipWriter.add(name, readers.get(child), Object.assign({}, options, zipEntryOptions, childOptions, {
					directory: child.directory,
					onprogress: async indexProgress => {
						if (options.onprogress) {
							entryOffsets.set(name, indexProgress);
							try {
								await options.onprogress(Array.from(entryOffsets.values()).reduce((previousValue, currentValue) => previousValue + currentValue), totalSize);
							} catch {
								// ignored
							}
						}
					}
				}));
				await process(zipWriter, child);
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
							parentEntry.addData(file.name, {
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
						const directoryEntry = parentEntry.addDirectory(handle.name);
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
		const totalSize = getTotalSize([zipEntry], "uncompressedSize");
		const writtenSizes = new Map();
		const abortController = new AbortController();
		const { signal } = abortController;
		const releaseSignal = forwardAbort(options.signal, abortController);
		const exportedEntryNames = [];
		try {
			await exportChildren(zipEntry, directoryHandle);
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
				if (isExportAborted(signal.reason)) {
					return;
				}
				throw signal.reason;
			}
			try {
				if (child.directory) {
					const childDirectoryHandle = await parentHandle.getDirectoryHandle(child.name, { create: true });
					await exportChildren(child, childDirectoryHandle);
				} else {
					const fileHandle = await parentHandle.getFileHandle(child.name, { create: true });
					const writable = await fileHandle.createWritable();
					await child.getData({ writable }, Object.assign({}, options, {
						signal,
						onprogress: async progress => {
							if (options.onprogress) {
								writtenSizes.set(child.id, progress);
								try {
									await options.onprogress(Array.from(writtenSizes.values()).reduce((previousValue, currentValue) => previousValue + currentValue, 0), totalSize);
								} catch {
									// ignored
								}
							}
						}
					}));
					exportedEntryNames.push(child.getRelativeName(zipEntry));
				}
			} catch (error) {
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


	configureWebWorker(setDefaultConfiguration);

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
	exports.ERR_INVALID_COMPRESSED_DATA = ERR_INVALID_COMPRESSED_DATA;
	exports.ERR_INVALID_CRC32 = ERR_INVALID_CRC32;
	exports.ERR_INVALID_ENCRYPTION_STRENGTH = ERR_INVALID_ENCRYPTION_STRENGTH;
	exports.ERR_INVALID_ENTRY_COMMENT = ERR_INVALID_ENTRY_COMMENT;
	exports.ERR_INVALID_ENTRY_NAME = ERR_INVALID_ENTRY_NAME;
	exports.ERR_INVALID_EXTRAFIELD_DATA = ERR_INVALID_EXTRAFIELD_DATA;
	exports.ERR_INVALID_EXTRAFIELD_TYPE = ERR_INVALID_EXTRAFIELD_TYPE;
	exports.ERR_INVALID_FILENAME_VALIDATION = ERR_INVALID_FILENAME_VALIDATION;
	exports.ERR_INVALID_GID = ERR_INVALID_GID;
	exports.ERR_INVALID_LEVEL = ERR_INVALID_LEVEL;
	exports.ERR_INVALID_MAX_APPENDED_DATA_SIZE = ERR_INVALID_MAX_APPENDED_DATA_SIZE;
	exports.ERR_INVALID_MSDOS_ATTRIBUTES = ERR_INVALID_MSDOS_ATTRIBUTES;
	exports.ERR_INVALID_MSDOS_DATA = ERR_INVALID_MSDOS_DATA;
	exports.ERR_INVALID_PASSWORD = ERR_INVALID_PASSWORD;
	exports.ERR_INVALID_PASSWORD_TYPE = ERR_INVALID_PASSWORD_TYPE;
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
	exports.ERR_UNDEFINED_READER = ERR_UNDEFINED_READER;
	exports.ERR_UNDEFINED_UNCOMPRESSED_SIZE = ERR_UNDEFINED_UNCOMPRESSED_SIZE;
	exports.ERR_UNSAFE_FILENAME = ERR_UNSAFE_FILENAME;
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION$1;
	exports.ERR_UNSUPPORTED_CONTEXT = ERR_UNSUPPORTED_CONTEXT;
	exports.ERR_UNSUPPORTED_CRYPTO_API = ERR_UNSUPPORTED_CRYPTO_API;
	exports.ERR_UNSUPPORTED_ENCRYPTION = ERR_UNSUPPORTED_ENCRYPTION;
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
	exports.terminateWorkers = terminateWorkersAndModule;
	exports.unregisterCodec = unregisterCodec;

}));
