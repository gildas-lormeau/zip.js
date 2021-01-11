/*
 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright 
 notice, this list of conditions and the following disclaimer in 
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
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

/// wrapper for pako (https://github.com/nodeca/pako)

/* globals pako */

(globalThis => {

	"use strict";

	class Codec {

		constructor(isDeflater, options) {
			const newOptions = { raw: true, chunkSize: 512 * 1024 };
			if (options && typeof options.level == "number") {
				newOptions.level = options.level;
			}
			this.backEnd = isDeflater ? new pako.Deflate(newOptions) : new pako.Inflate(newOptions);
			this.chunks = [];
			this.dataLength = 0;
			this.backEnd.onData = this.onData.bind(this);
		}

		onData(chunk) {
			this.chunks.push(chunk);
			this.dataLength += chunk.length;
		}

		fetchData() {
			const backEnd = this.backEnd;
			if (backEnd.err !== 0) {
				throw new Error(backEnd.msg);
			}
			const chunks = this.chunks;
			let data;
			if (chunks.length == 1) {
				data = chunks[0];
			} else if (chunks.length > 1) {
				data = new Uint8Array(this.dataLength);
				for (let indexChunk = 0, offset = 0; indexChunk < chunks.length; indexChunk++) {
					const chunk = chunks[indexChunk];
					data.set(chunk, offset);
					offset += chunk.length;
				}
			}
			chunks.length = 0;
			this.dataLength = 0;
			return data;
		}

		append(bytes) {
			this.backEnd.push(bytes, false);
			return this.fetchData();
		}

		flush() {
			this.backEnd.push(new Uint8Array(0), true);
			return this.fetchData();
		}
	}

	class Deflater extends Codec {

		constructor(options) {
			super(true, options);
		}
	}

	class Inflater extends Codec {

		constructor() {
			super(false);
		}
	}

	globalThis.ZipDeflater = globalThis._pako_Deflater = Deflater;
	globalThis.ZipInflater = globalThis._pako_Inflater = Inflater;

})(this);