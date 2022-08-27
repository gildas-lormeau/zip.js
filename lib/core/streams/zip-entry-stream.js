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

/* global CompressionStream, DecompressionStream, TransformStream */

import Crc32Stream from "./crc32-stream.js";
import {
	AESEncryptionStream,
	AESDecryptionStream
} from "./aes-crypto-stream.js";
import {
	ZipCryptoEncryptionStream,
	ZipCryptoDecryptionStream,
} from "./zip-crypto-stream.js";
import {
	ERR_INVALID_PASSWORD
} from "./common-crypto.js";
import CodecStream from "./codec-stream.js";

const ERR_INVALID_SIGNATURE = "Invalid signature";
const COMPRESSION_FORMAT = "deflate-raw";
const UNDEFINED_TYPE = "undefined";
const COMPRESSION_STREAM_API_SUPPORTED = typeof CompressionStream == UNDEFINED_TYPE;
const DECOMPRESSION_STREAM_API_SUPPORTED = typeof DecompressionStream == UNDEFINED_TYPE;
let INFLATE_RAW_SUPPORTED = true;
let DEFLATE_RAW_SUPPORTED = true;

class DeflateStream extends TransformStream {

	constructor(codecConstructor, options, { chunkSize }, ...strategies) {
		super({}, ...strategies);
		const { compressed, encrypted, useCompressionStream, password, passwordVerification, encryptionStrength, zipCrypto, signed, level } = options;
		const stream = this;
		let crc32Stream, encryptionStream;
		let readable = filterEmptyChunks(super.readable);
		if ((!encrypted || zipCrypto) && signed) {
			[readable, crc32Stream] = readable.tee();
			crc32Stream = crc32Stream.pipeThrough(new Crc32Stream());
		}
		if (compressed) {
			if ((useCompressionStream !== undefined && !useCompressionStream) || (COMPRESSION_STREAM_API_SUPPORTED && !DEFLATE_RAW_SUPPORTED)) {
				readable = pipeCodecStream(codecConstructor, readable, { chunkSize, level });
			} else {
				try {
					readable = readable.pipeThrough(new CompressionStream(COMPRESSION_FORMAT));
				} catch (_error) {
					DEFLATE_RAW_SUPPORTED = false;
					readable = pipeCodecStream(codecConstructor, readable, { chunkSize, level });
				}
			}
		}
		if (encrypted) {
			if (zipCrypto) {
				readable = readable.pipeThrough(new ZipCryptoEncryptionStream(password, passwordVerification));
			} else {
				encryptionStream = new AESEncryptionStream(password, encryptionStrength);
				readable = readable.pipeThrough(encryptionStream);
			}
		}
		setReadable(stream, readable, async () => {
			let signature;
			if (encrypted && !zipCrypto) {
				signature = encryptionStream.signature;
			}
			if ((!encrypted || zipCrypto) && signed) {
				signature = await crc32Stream.getReader().read();
				signature = new DataView(signature.value.buffer).getUint32(0);
			}
			stream.signature = signature;
		});
	}
}

class InflateStream extends TransformStream {

	constructor(codecConstructor, options, { chunkSize }, ...strategies) {
		super({}, ...strategies);
		const { zipCrypto, encrypted, password, passwordVerification, signed, encryptionStrength, compressed, useCompressionStream } = options;
		const stream = this;
		let crc32Stream, decryptionStream;
		let readable = filterEmptyChunks(super.readable);
		if (encrypted) {
			if (zipCrypto) {
				readable = readable.pipeThrough(new ZipCryptoDecryptionStream(password, passwordVerification));
			} else {
				decryptionStream = new AESDecryptionStream(password, signed, encryptionStrength);
				readable = readable.pipeThrough(decryptionStream);
			}
		}
		if (compressed) {
			if ((useCompressionStream !== undefined && !useCompressionStream) || (DECOMPRESSION_STREAM_API_SUPPORTED && !INFLATE_RAW_SUPPORTED)) {
				readable = pipeCodecStream(codecConstructor, readable, { chunkSize });
			} else {
				try {
					readable = readable.pipeThrough(new DecompressionStream(COMPRESSION_FORMAT));
				} catch (_error) {
					INFLATE_RAW_SUPPORTED = false;
					readable = pipeCodecStream(codecConstructor, readable, { chunkSize });
				}
			}
		}
		if ((!encrypted || zipCrypto) && signed) {
			[readable, crc32Stream] = readable.tee();
			crc32Stream = crc32Stream.pipeThrough(new Crc32Stream());
		}
		setReadable(stream, readable, async () => {
			if (encrypted && !zipCrypto) {
				if (!decryptionStream.valid) {
					throw new Error(ERR_INVALID_SIGNATURE);
				}
			}
			if ((!encrypted || zipCrypto) && signed) {
				const signature = await crc32Stream.getReader().read();
				const dataViewSignature = new DataView(signature.value.buffer);
				if (options.signature != dataViewSignature.getUint32(0, false)) {
					throw new Error(ERR_INVALID_SIGNATURE);
				}
			}
		});
	}
}

export {
	DeflateStream,
	InflateStream,
	ERR_INVALID_PASSWORD,
	ERR_INVALID_SIGNATURE
};

function pipeCodecStream(codecConstructor, readable, options) {
	return readable.pipeThrough(new CodecStream(codecConstructor, options));
}

function filterEmptyChunks(readable) {
	return readable.pipeThrough(new TransformStream({
		transform(chunk, controller) {
			if (chunk && chunk.length) {
				controller.enqueue(chunk);
			}
		}
	}));
}

function setReadable(stream, readable, flush) {
	readable = readable.pipeThrough(new TransformStream({ flush }));
	Object.defineProperty(stream, "readable", {
		get() {
			return readable;
		}
	});
}