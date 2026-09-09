/*
 Copyright (c) 2026 Gildas Lormeau. All rights reserved.

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

import { FUNCTION_TYPE } from "../../constants.js";
import { createEngine as createDefaultEngine } from "../codecs/aes-hmac-sha1.js";

const BUFFER_LENGTH = 64 * 1024;
const DIGEST_LENGTH = 20;

let wasm, buffer;

export {
	setWasmExports,
	resetWasmExports,
	createEngine
};

function setWasmExports(wasmAPI) {
	// deno-lint-ignore valid-typeof
	if (typeof wasmAPI.aes_hmac_new == FUNCTION_TYPE) {
		wasm = wasmAPI;
		buffer = 0;
	}
}

function resetWasmExports() {
	wasm = null;
	buffer = 0;
}

function createEngine(key, authenticationKey) {
	const exports = wasm;
	let context = exports ? createContext(exports, key, authenticationKey) : 0;
	if (!context) {
		return createDefaultEngine(key, authenticationKey);
	}
	const scratch = buffer;
	return {
		process(data, decrypt) {
			for (let offset = 0; offset < data.length; offset += BUFFER_LENGTH) {
				const chunk = data.subarray(offset, offset + BUFFER_LENGTH);
				const heap = getHeap(exports);
				heap.set(chunk, scratch);
				exports.aes_hmac_process(context, scratch, chunk.length, decrypt ? 1 : 0);
				chunk.set(heap.subarray(scratch, scratch + chunk.length));
			}
		},
		digest() {
			exports.aes_hmac_end(context, scratch);
			context = 0;
			return getHeap(exports).slice(scratch, scratch + DIGEST_LENGTH);
		},
		dispose() {
			if (context) {
				exports.aes_hmac_end(context, 0);
				context = 0;
			}
		}
	};
}

function createContext(exports, key, authenticationKey) {
	if (!buffer) {
		buffer = exports.malloc(BUFFER_LENGTH);
	}
	const context = buffer ? exports.aes_hmac_new() : 0;
	if (context) {
		const heap = getHeap(exports);
		heap.set(key, buffer);
		heap.set(authenticationKey, buffer + key.length);
		if (exports.aes_hmac_init(context, buffer, key.length, buffer + key.length, authenticationKey.length)) {
			exports.aes_hmac_end(context, 0);
			return 0;
		}
	}
	return context;
}

function getHeap(exports) {
	return new Uint8Array(exports.memory.buffer);
}
