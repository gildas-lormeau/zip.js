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

/* global TransformStream, ReadableStream, setTimeout, clearTimeout */
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
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_AUTHENTICATION_CODE,
	ERR_ABORT_CHECK_PASSWORD,
	ERR_UNSUPPORTED_CRYPTO_API
} from "./common-crypto.js";
import { UNDEFINED_VALUE } from "../constants.js";
import { concat, getDataView } from "../util/array.js";
import { toCompatibleReadable } from "../util/compatible-streams.js";
import { getCodecStreams } from "../codec-registry.js";

const ERR_INVALID_UNCOMPRESSED_SIZE = "Invalid uncompressed size";
const ERR_INVALID_COMPRESSED_DATA = "Invalid compressed data";
const ERR_INVALID_CRC32 = ERR_INVALID_SIGNATURE;
const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
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
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_CRC32,
	ERR_INVALID_AUTHENTICATION_CODE,
	ERR_INVALID_UNCOMPRESSED_SIZE,
	ERR_INVALID_COMPRESSED_DATA,
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
