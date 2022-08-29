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

// deno-lint-ignore-file no-this-alias
/* global TransformStream */

import {
	InflateStream,
	DeflateStream,
	ERR_INVALID_PASSWORD,
	ERR_INVALID_SIGNATURE
} from "./streams/zip-entry-stream.js";

const CODEC_DEFLATE = "deflate";
const CODEC_INFLATE = "inflate";
const MESSAGE_EVENT_TYPE = "message";
const MESSAGE_START = "start";
const MESSAGE_PULL = "pull";
const MESSAGE_DATA = "data";
const MESSAGE_ACK_DATA = "ack";
const MESSAGE_CLOSE = "close";

export {
	Codec,
	CODEC_DEFLATE,
	CODEC_INFLATE,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSWORD,
	MESSAGE_EVENT_TYPE,
	MESSAGE_START,
	MESSAGE_PULL,
	MESSAGE_DATA,
	MESSAGE_ACK_DATA,
	MESSAGE_CLOSE
};

class Codec {

	constructor(codecConstructor, readable, writable, options, config) {
		const { codecType } = options;
		if (codecType.startsWith(CODEC_DEFLATE)) {
			this.run = () => run(DeflateStream);
		} else if (codecType.startsWith(CODEC_INFLATE)) {
			this.run = () => run(InflateStream);
		}

		async function run(StreamConstructor) {
			const stream = new StreamConstructor(codecConstructor, options, config);
			await readable
				.pipeThrough(stream)
				.pipeThrough(new TransformStream({
					transform(chunk, controller) {
						if (chunk && chunk.length) {
							writable.size += chunk.length;
							controller.enqueue(chunk);
						}
					}
				}))
				.pipeTo(writable, { preventClose: true, preventAbort: true });
			const { size, signature } = stream;
			return { size, signature };
		}
	}
}