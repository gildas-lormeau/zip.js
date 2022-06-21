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

import { CODEC_DEFLATE, CODEC_INFLATE, createCodec } from "./codecs/codec.js";

const handlers = {
	init(message) {
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
	},
	async append(message) {
		return { data: await codec.append(message.data) };
	},
	flush() {
		return codec.flush();
	}
};

let codec;
addEventListener("message", async event => {
	const message = event.data;
	const type = message.type;
	const handler = handlers[type];
	if (handler) {
		try {
			if (message.data) {
				message.data = new Uint8Array(message.data);
			}
			const response = (await handler(message)) || {};
			response.type = type;
			if (response.data) {
				try {
					response.data = response.data.buffer;
					postMessage(response, [response.data]);
				} catch (_error) {
					postMessage(response);
				}
			} else {
				postMessage(response);
			}
		} catch (error) {
			postMessage({ type, error: { message: error.message, stack: error.stack } });
		}
	}
});