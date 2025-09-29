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
	CodecStream,
	ChunkStream,
	MESSAGE_EVENT_TYPE,
	MESSAGE_START,
	MESSAGE_PULL,
	MESSAGE_DATA,
	MESSAGE_ACK_DATA,
	MESSAGE_CLOSE
} from "./streams/codec-stream.js";

const pendingPullMessages = new Map();
const pendingDataMessages = new Map();

let abortController, messageId = 0;

addEventListener(MESSAGE_EVENT_TYPE, ({ data }) => {
	const { type, messageId, value, done } = data;
	try {
		if (type == MESSAGE_START) {
			init(data);
		}
		if (type == MESSAGE_DATA) {
			const resolve = pendingPullMessages.get(messageId);
			pendingPullMessages.delete(messageId);
			resolve({ value: new Uint8Array(value), done });
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

async function init(message) {
	let codecStream;
	try {
		const { options, config } = message;
		if (!options.useCompressionStream) {
			try {
				await self.initModule(message.config);
			} catch {
				options.useCompressionStream = true;
			}
		}
		config.CompressionStream = self.CompressionStream;
		config.DecompressionStream = self.DecompressionStream;
		const strategy = { highWaterMark: 1 };
		const readable = message.readable || new ReadableStream({
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
		const writable = message.writable || new WritableStream({
			async write(value) {
				let resolveAckData;
				const ackData = new Promise(resolve => resolveAckData = resolve);
				pendingDataMessages.set(messageId, resolveAckData);
				sendMessage({ type: MESSAGE_DATA, value, messageId });
				messageId = (messageId + 1) % Number.MAX_SAFE_INTEGER;
				await ackData;
			}
		}, strategy);
		const codecStream = new CodecStream(options, config);
		abortController = new AbortController();
		const { signal } = abortController;
		await readable
			.pipeThrough(codecStream)
			.pipeThrough(new ChunkStream(config.chunkSize))
			.pipeTo(writable, { signal, preventClose: true, preventAbort: true });
		await writable.getWriter().close();
		const {
			signature,
			inputSize,
			outputSize
		} = codecStream;
		sendMessage({
			type: MESSAGE_CLOSE,
			result: {
				signature,
				inputSize,
				outputSize
			}
		});
	} catch (error) {
		error.outputSize = codecStream ? codecStream.outputSize : 0;
		sendErrorMessage(error);
	}
}

function sendMessage(message) {
	let { value } = message;
	if (value) {
		if (value.length) {
			try {
				value = new Uint8Array(value);
				message.value = value.buffer;
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
	const { message, stack, code, name, outputSize } = error;
	postMessage({ error: { message, stack, code, name, outputSize } });
}
