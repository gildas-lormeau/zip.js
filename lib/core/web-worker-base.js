/// <reference types="../../index.d.ts" />

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

/* global self, addEventListener, postMessage, ReadableStream, WritableStream, AbortController */

import {
	CODEC_DEFLATE,
	CodecStream,
	ChunkStream,
	supportsDeflateRaw,
	MESSAGE_EVENT_TYPE,
	MESSAGE_START,
	MESSAGE_PULL,
	MESSAGE_DATA,
	MESSAGE_ACK_DATA,
	MESSAGE_CLOSE,
	MESSAGE_READY
} from "./streams/codec-stream.js";
import { getChunkSize } from "./configuration.js";
import { toCompatibleReadable, toCompatibleWritable } from "./util/compatible-streams.js";
import { toExactUint8Array } from "./util/array.js";
import { ensureCodecStreams } from "./codec-registry.js";

const pendingPullMessages = new Map();
const pendingDataMessages = new Map();

let abortController, messageId = 0;

export { initWorker };

function initWorker(options = {}) {
	const { init } = options;
	const CompressionStreamFallback = options.CompressionStreamFallback || options.CompressionStreamZlib;
	const DecompressionStreamFallback = options.DecompressionStreamFallback || options.DecompressionStreamZlib;
	self.initModule = async config => {
		if (init) {
			await init(config);
		}
		if (CompressionStreamFallback) {
			config.CompressionStreamFallback = CompressionStreamFallback;
		}
		if (DecompressionStreamFallback) {
			config.DecompressionStreamFallback = DecompressionStreamFallback;
		}
	};
}

addEventListener(MESSAGE_EVENT_TYPE, ({ data }) => {
	const { type, messageId, value, done } = data;
	try {
		if (type == MESSAGE_START) {
			init(data);
		}
		if (type == MESSAGE_DATA) {
			const resolve = pendingPullMessages.get(messageId);
			pendingPullMessages.delete(messageId);
			resolve({ value: value || new Uint8Array(), done });
		}
		if (type == MESSAGE_ACK_DATA) {
			const resolve = pendingDataMessages.get(messageId);
			pendingDataMessages.delete(messageId);
			resolve();
		}
		if (type == MESSAGE_CLOSE) {
			abortController.abort();
		}
	} catch (error) {
		sendErrorMessage(error);
	}
});

postMessage({ type: MESSAGE_READY });

async function init(message) {
	let codecStream, writable;
	try {
		const { options, config } = message;
		if (options.format) {
			try {
				await ensureCodecStreams(options.format, options.codecURI);
			} catch (error) {
				error.codecImportFailed = true;
				throw error;
			}
		}
		config.CompressionStream = self.CompressionStream;
		config.DecompressionStream = self.DecompressionStream;
		if (options.compressed && !options.format) {
			if (!options.useCompressionStream) {
				try {
					await self.initModule(message.config);
				} catch {
					options.useCompressionStream = true;
				}
			} else {
				const NativeStream = options.codecType.startsWith(CODEC_DEFLATE) ?
					config.CompressionStream :
					config.DecompressionStream;
				if (!supportsDeflateRaw(NativeStream)) {
					try {
						await self.initModule(message.config);
					} catch {
						// ignored
					}
				}
			}
		}
		if (!config.CompressionStreamFallback && config.CompressionStreamZlib) {
			config.CompressionStreamFallback = config.CompressionStreamZlib;
		}
		if (!config.DecompressionStreamFallback && config.DecompressionStreamZlib) {
			config.DecompressionStreamFallback = config.DecompressionStreamZlib;
		}
		const strategy = { highWaterMark: 1 };
		const readable = message.readable ? toCompatibleReadable(message.readable) : new ReadableStream({
			async pull(controller) {
				const result = new Promise(resolve => pendingPullMessages.set(messageId, resolve));
				sendMessage({ type: MESSAGE_PULL, messageId });
				messageId = (messageId + 1) % Number.MAX_SAFE_INTEGER;
				const { value, done } = await result;
				controller.enqueue(value);
				if (done) {
					controller.close();
				}
			}
		}, strategy);
		writable = message.writable ? toCompatibleWritable(message.writable) : new WritableStream({
			async write(value) {
				let resolveAckData;
				const ackData = new Promise(resolve => resolveAckData = resolve);
				pendingDataMessages.set(messageId, resolveAckData);
				sendMessage({ type: MESSAGE_DATA, value, messageId });
				messageId = (messageId + 1) % Number.MAX_SAFE_INTEGER;
				await ackData;
			}
		}, strategy);
		codecStream = new CodecStream(options, config);
		abortController = new AbortController();
		const { signal } = abortController;
		await readable
			.pipeThrough(codecStream)
			.pipeThrough(new ChunkStream(getChunkSize(config)))
			.pipeTo(writable, { signal, preventClose: true, preventAbort: true });
		await writable.getWriter().close();
		const {
			crc32,
			inputSize,
			outputSize
		} = codecStream;
		sendMessage({
			type: MESSAGE_CLOSE,
			result: {
				crc32,
				inputSize,
				outputSize
			}
		});
	} catch (error) {
		error.outputSize = codecStream ? codecStream.outputSize : 0;
		if (writable && !writable.locked) {
			try {
				await writable.getWriter().close();
			} catch {
				// ignored
			}
		}
		sendErrorMessage(error);
	}
}

function sendMessage(message) {
	const { value } = message;
	if (value) {
		if (value.length) {
			try {
				message.value = toExactUint8Array(value).buffer;
				postMessage(message, [message.value]);
			} catch {
				postMessage(message);
			}
		} else {
			postMessage(message);
		}
	} else {
		postMessage(message);
	}
}

function sendErrorMessage(error = new Error("Unknown error")) {
	const { message, stack, code, name, outputSize, cause, codecImportFailed } = error;
	const errorData = { message, stack, code, name, outputSize };
	if (cause) {
		errorData.cause = { name: cause.name, message: cause.message };
	}
	if (codecImportFailed) {
		errorData.codecImportFailed = true;
	}
	postMessage({ error: errorData });
}
