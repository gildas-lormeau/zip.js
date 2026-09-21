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

/* global TransformStream, ReadableStream */
// deno-lint-ignore-file no-this-alias

import { Crc32 } from "./codecs/crc32.js";
import { Crc32Stream } from "./crc32-stream.js";
import {
	AESEncryptionStream,
	AESDecryptionStream
} from "./aes-crypto-stream.js";
import {
	ZipCryptoEncryptionStream,
	ZipCryptoDecryptionStream
} from "./zip-crypto-stream.js";
import {
	ERR_INVALID_PASSWORD,
	ERR_INVALID_AUTHENTICATION_CODE,
	ERR_ABORT_CHECK_PASSWORD,
	ERR_UNSUPPORTED_CRYPTO_API
} from "./common-crypto.js";
import { UNDEFINED_VALUE } from "../constants.js";
import { concat, getDataView } from "../util/array.js";
import { toCompatibleReadable } from "../util/compatible-streams.js";
import { isErrorObject } from "../util/error.js";
import { getCodecStreams, ERR_UNSUPPORTED_COMPRESSION } from "../codec-registry.js";

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

export {
	DeflateStream,
	InflateStream,
	supportsFormat,
	supportsDeflateRaw,
	supportsGzip,
	FORMAT_DEFLATE_RAW,
	FORMAT_DEFLATE64_RAW,
	FORMAT_GZIP,
	ERR_INVALID_PASSWORD,
	ERR_INVALID_CRC32,
	ERR_INVALID_AUTHENTICATION_CODE,
	ERR_INVALID_UNCOMPRESSED_SIZE,
	ERR_INVALID_COMPRESSED_DATA,
	ERR_CODEC_OUT_OF_MEMORY,
	ERR_ABORT_CHECK_PASSWORD,
	ERR_UNSUPPORTED_CRYPTO_API
};

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
