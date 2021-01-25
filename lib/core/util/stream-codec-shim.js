
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

"use strict";

const FUNCTION_TYPE = "function";

export default (library, options = {}) => {
	return {
		Deflate: createCodecClass(library.Deflate, options.deflate),
		Inflate: createCodecClass(library.Inflate, options.inflate)
	};
};

function createCodecClass(constructor, constructorOptions) {
	return class {
		constructor(options) {
			const onData = data => {
				if (this.pendingData) {
					const pendingData = this.pendingData;
					this.pendingData = new Uint8Array(pendingData.length + data.length);
					this.pendingData.set(pendingData, 0);
					this.pendingData.set(data, pendingData.length);
				} else {
					this.pendingData = new Uint8Array(data);
				}
			};
			this.codec = new constructor(Object.assign({}, constructorOptions, options));
			if (typeof this.codec.onData == FUNCTION_TYPE) {
				this.codec.onData = onData;
			} else if (typeof this.codec.on == FUNCTION_TYPE) {
				this.codec.on("data", onData);
			} else {
				throw new Error("Cannot register the callback function");
			}
		}
		async append(data) {
			this.codec.push(data);
			return getResponse(this);
		}
		async flush() {
			this.codec.push(new Uint8Array(0), true);
			return getResponse(this);
		}
	};

	function getResponse(codec) {
		if (codec.pendingData) {
			const output = codec.pendingData;
			codec.pendingData = null;
			return output;
		} else {
			return new Uint8Array(0);
		}
	}
}