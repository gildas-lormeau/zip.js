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

/* global self, importScripts, addEventListener, postMessage, ReadableStream, WritableStream */

import {
	Codec,
	CODEC_DEFLATE,
	CODEC_INFLATE,
	MESSAGE_EVENT_TYPE,
	MESSAGE_START,
	MESSAGE_PULL,
	MESSAGE_DATA,
	MESSAGE_ACK_DATA,
	MESSAGE_CLOSE
} from "./codec-interface.js";

const pendingPullMessages = new Map();
const pendingDataMessages = new Map();
let codec;
let messageId = 0;

addEventListener(MESSAGE_EVENT_TYPE, async event => {
	const message = event.data;
	const { type, messageId, data, done } = message;
	try {
		if (type == MESSAGE_START) {
			init(message);
		}
		if (type == MESSAGE_DATA) {
			const resolve = pendingPullMessages.get(messageId);
			pendingPullMessages.delete(messageId);
			resolve({ value: new Uint8Array(data), done });
		}
		if (type == MESSAGE_ACK_DATA) {
			const resolve = pendingDataMessages.get(messageId);
			pendingDataMessages.delete(messageId);
			resolve();
		}
	} catch (error) {
		postMessage({ error: { message: error.message, stack: error.stack } });
	}
});

async function init(message) {
	try {
		const { options, scripts, config } = message;
		const { codecType } = options;
		if (scripts && scripts.length) {
			importScripts.apply(undefined, scripts);
		}
		if (self.initCodec) {
			self.initCodec();
		}
		let codecConstructor;
		if (codecType.startsWith(CODEC_DEFLATE)) {
			codecConstructor = self.Deflate;
		} else if (codecType.startsWith(CODEC_INFLATE)) {
			codecConstructor = self.Inflate;
		}
		const strategy = { highWaterMark: 1, size: () => config.chunkSize };
		const readable = new ReadableStream({
			async pull(controller) {
				let result = new Promise(resolve => pendingPullMessages.set(messageId, resolve));
				sendMessage({ type: MESSAGE_PULL, messageId });
				messageId = (messageId + 1) % Number.MAX_SAFE_INTEGER;
				const { value, done } = await result;
				controller.enqueue(value);
				if (done) {
					controller.close();
				}
			}
		}, strategy);
		const writable = new WritableStream({
			async write(data) {
				let resolveAckData;
				const ackData = new Promise(resolve => resolveAckData = resolve);
				pendingDataMessages.set(messageId, resolveAckData);
				sendMessage({ type: MESSAGE_DATA, data, messageId });
				messageId = (messageId + 1) % Number.MAX_SAFE_INTEGER;
				await ackData;
			}
		}, strategy);
		codec = new Codec(codecConstructor, readable, writable, options, config);
		const result = await codec.run();
		sendMessage({ type: MESSAGE_CLOSE, result });
	} catch (error) {
		const { message, stack } = error;
		postMessage({ error: { message, stack } });
	}
}

function sendMessage(message) {
	if (message.data) {
		let { data } = message;
		if (data && data.length) {
			try {
				data = new Uint8Array(data);
				message.data = data.buffer;
				postMessage(message, [message.data]);
			} catch (_error) {
				postMessage(message);
			}
		} else {
			postMessage(message);
		}
	} else {
		postMessage(message);
	}
}