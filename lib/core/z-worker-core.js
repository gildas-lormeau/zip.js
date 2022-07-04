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

/* global self, importScripts, addEventListener, postMessage */

import {
	createCodec,
	CODEC_DEFLATE,
	CODEC_INFLATE,
	MESSAGE_EVENT_TYPE,
	MESSAGE_START,
	MESSAGE_PULL,
	MESSAGE_DATA,
	MESSAGE_ABORT,
} from "./codecs/codec.js";

const pendingMessages = new Map();
let codec;
let messageId = 0;

addEventListener(MESSAGE_EVENT_TYPE, async event => {
	const message = event.data;
	const type = message.type;
	try {
		if (type == MESSAGE_START) {
			init(message);
		}
		if (type == MESSAGE_DATA) {
			const { resolve } = pendingMessages.get(message.messageId);
			pendingMessages.delete(message.messageId);
			resolve({ value: new Uint8Array(message.data), done: message.done });
		}
		if (type == MESSAGE_ABORT) {
			codec.abort();
		}
	} catch (error) {
		postMessage({ error: { message: error.message, stack: error.stack } });
	}
});

async function init(message) {
	try {
		if (message.scripts && message.scripts.length) {
			importScripts.apply(undefined, message.scripts);
		}
		const options = message.options;
		if (self.initCodec) {
			self.initCodec();
		}
		let codecConstructor;
		if (options.codecType.startsWith(CODEC_DEFLATE)) {
			codecConstructor = self.Deflate;
		} else if (options.codecType.startsWith(CODEC_INFLATE)) {
			codecConstructor = self.Inflate;
		}
		codec = createCodec(codecConstructor, options, message.config);
		codec.ondata = data => sendMessage({ type: MESSAGE_DATA, data });
		codec.onerror = error => postMessage({ error: { message: error.message, stack: error.stack } });
		codec.pull = () => {
			const result = new Promise((resolve, reject) => pendingMessages.set(messageId, { resolve, reject }));
			sendMessage({ type: MESSAGE_PULL, messageId });
			messageId++;
			return result;
		};
		await codec.start();
	} catch (error) {
		postMessage({ error: { message: error.message, stack: error.stack } });
	}
}

function sendMessage(message) {
	if (message.data) {
		const data = message.data.value.data;
		if (data && data.length) {
			try {
				message.data.value.data = data.buffer;
				postMessage(message, [message.data.value.data]);
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