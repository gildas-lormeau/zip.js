
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

export default (library, options = {}, registerDataHandler) => {
	return {
		Deflate: createCodecClass(library.Deflate, options.deflate, registerDataHandler),
		Inflate: createCodecClass(library.Inflate, options.inflate, registerDataHandler)
	};
};

function createCodecClass(constructor, constructorOptions, registerDataHandler) {
	return class {

		constructor(options) {
			const codecAdapter = this;
			const onData = data => {
				if (codecAdapter.pendingData) {
					const pendingData = codecAdapter.pendingData;
					codecAdapter.pendingData = new Uint8Array(pendingData.length + data.length);
					codecAdapter.pendingData.set(pendingData, 0);
					codecAdapter.pendingData.set(data, pendingData.length);
				} else {
					codecAdapter.pendingData = new Uint8Array(data);
				}
			};
			codecAdapter.codec = new constructor(Object.assign({}, constructorOptions, options));
			registerDataHandler(codecAdapter.codec, onData);
		}
		append(data) {
			this.codec.push(data);
			return getResponse(this);
		}
		flush() {
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