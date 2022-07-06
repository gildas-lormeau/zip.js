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

/* global ReadableStream, DecompressionStream, CompressionStream */
// deno-lint-ignore-file no-this-alias

import Crc32Stream from "./crc32-stream.js";
import { AESEncryptionStream, AESDecryptionStream, ERR_INVALID_PASSWORD } from "./aes-crypto-stream.js";
import { ZipCryptoDecryptionStream, ZipCryptoEncryptionStream } from "./zip-crypto-stream.js";
import CodecStream from "./codec-stream.js";

const CODEC_DEFLATE = "deflate";
const CODEC_INFLATE = "inflate";
const ERR_INVALID_SIGNATURE = "Invalid signature";
const MESSAGE_EVENT_TYPE = "message";
const MESSAGE_START = "start";
const MESSAGE_PULL = "pull";
const MESSAGE_DATA = "data";
const MESSAGE_ABORT = "abort";
const COMPRESSION_FORMAT = "deflate-raw";
const UNDEFINED_TYPE = "undefined";

class Inflate {

	constructor(codecConstructor, {
		signature,
		password,
		signed,
		compressed,
		zipCrypto,
		passwordVerification,
		encryptionStrength,
		useCompressionStream
	}, { chunkSize }) {
		const codec = this;
		codec.start = async () => {
			const encrypted = Boolean(password);
			Object.assign(codec, {
				signature,
				encrypted,
				signed,
				compressed,
				zipCrypto
			});
			let stream = createReadableStream(codec);
			if (encrypted) {
				if (zipCrypto) {
					stream = stream.pipeThrough(new ZipCryptoDecryptionStream(password, passwordVerification));
				} else {
					codec.decryptStream = new AESDecryptionStream(password, signed, encryptionStrength);
					stream = stream.pipeThrough(codec.decryptStream);
				}
			}
			if (compressed) {
				if ((useCompressionStream !== undefined && !useCompressionStream) || typeof DecompressionStream == UNDEFINED_TYPE) {
					stream = pipeCodecStream(stream);
				} else {
					try {
						stream = stream.pipeThrough(new DecompressionStream(COMPRESSION_FORMAT));
					} catch (_error) {
						stream = pipeCodecStream(stream);
					}
				}
			}
			if ((!encrypted || zipCrypto) && signed) {
				const tee = stream.tee();
				stream = tee[0];
				codec.crc32Stream = tee[1].pipeThrough(new Crc32Stream());
			}
			codec.reader = stream.getReader();
			await codec.read();
		};

		function pipeCodecStream(stream) {
			return stream.pipeThrough(new CodecStream(codecConstructor, { chunkSize }));
		}
	}

	abort() {
		this.aborted = true;
	}

	async read() {
		const codec = this;
		const { value, done } = await codec.reader.read();
		if (value && value.length) {
			codec.ondata({ value: { data: new Uint8Array(value) } });
		}
		if (done) {
			let signature;
			if (codec.encrypted && !codec.zipCrypto) {
				if (!codec.decryptStream.valid) {
					throw new Error(ERR_INVALID_SIGNATURE);
				}
			}
			if ((!codec.encrypted || codec.zipCrypto) && codec.signed) {
				signature = await codec.crc32Stream.getReader().read();
				const dataViewSignature = new DataView(signature.value.buffer);
				if (codec.signature != dataViewSignature.getUint32(0, false)) {
					throw new Error(ERR_INVALID_SIGNATURE);
				}
			}
			codec.ondata({ value: { signature }, done });
		} else {
			await codec.read();
		}
	}
}

class Deflate {

	constructor(codecConstructor, {
		encrypted,
		signed,
		compressed,
		level,
		zipCrypto,
		password,
		passwordVerification,
		encryptionStrength,
		useCompressionStream
	}, { chunkSize }) {
		const codec = this;
		codec.start = async () => {
			Object.assign(codec, {
				encrypted,
				signed,
				compressed,
				zipCrypto
			});
			let stream = createReadableStream(codec);
			if ((!encrypted || zipCrypto) && signed) {
				const tee = stream.tee();
				stream = tee[0];
				codec.crc32Stream = tee[1].pipeThrough(new Crc32Stream({ chunkSize }));
			}
			if (compressed) {
				if ((useCompressionStream !== undefined && !useCompressionStream) || typeof CompressionStream == UNDEFINED_TYPE) {
					stream = pipeCodecStream(stream);
				} else {
					try {
						stream = stream.pipeThrough(new CompressionStream(COMPRESSION_FORMAT));
					} catch (_error) {
						stream = pipeCodecStream(stream);
					}
				}
			}
			if (encrypted) {
				if (zipCrypto) {
					stream = stream.pipeThrough(new ZipCryptoEncryptionStream(password, passwordVerification));
				} else {
					codec.encryptStream = new AESEncryptionStream(password, encryptionStrength);
					stream = stream.pipeThrough(codec.encryptStream);
				}
			}
			codec.reader = stream.getReader();
			await codec.read();
		};

		function pipeCodecStream(stream) {
			return stream.pipeThrough(new CodecStream(codecConstructor, { chunkSize, level }));
		}
	}

	abort() {
		this.aborted = true;
	}

	async read() {
		const codec = this;
		const { value, done } = await codec.reader.read();
		if (value && value.length) {
			codec.ondata({ value: { data: value } });
		}
		if (done) {
			let signature;
			if (codec.encrypted && !codec.zipCrypto) {
				signature = codec.encryptStream.signature;
			}
			if ((!codec.encrypted || codec.zipCrypto) && codec.signed) {
				signature = await codec.crc32Stream.getReader().read();
				signature = new DataView(signature.value.buffer).getUint32(0);
			}
			codec.ondata({ value: { signature }, done });
		} else {
			await codec.read();
		}
	}

}

export {
	Inflate,
	Deflate,
	createCodec,
	CODEC_DEFLATE,
	CODEC_INFLATE,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSWORD,
	MESSAGE_EVENT_TYPE,
	MESSAGE_START,
	MESSAGE_PULL,
	MESSAGE_DATA,
	MESSAGE_ABORT
};

function createCodec(codecConstructor, options, config) {
	if (options.codecType.startsWith(CODEC_DEFLATE)) {
		return new Deflate(codecConstructor, options, config);
	} else if (options.codecType.startsWith(CODEC_INFLATE)) {
		return new Inflate(codecConstructor, options, config);
	}
}

function createReadableStream(codec) {
	return new ReadableStream({
		async pull(controller) {
			const { value, done } = await codec.pull();
			if (value) {
				controller.enqueue(value);
			}
			if (done || codec.aborted) {
				controller.close();
			}
		}
	});
}