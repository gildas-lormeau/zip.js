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

import {
	MAX_16_BITS,
	COMPRESSION_METHOD_STORE,
	COMPRESSION_METHOD_DEFLATE,
	COMPRESSION_METHOD_DEFLATE_64,
	COMPRESSION_METHOD_AES,
	FUNCTION_TYPE,
	STRING_TYPE
} from "./constants.js";

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

export {
	ERR_INVALID_CODEC_DEFINITION,
	ERR_RESERVED_COMPRESSION_METHOD,
	ERR_INVALID_CODEC_MODULE,
	registerCodec,
	unregisterCodec,
	getRegisteredCodec,
	getCodecStreams,
	setCodecStreams,
	ensureCodecStreams
};

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
