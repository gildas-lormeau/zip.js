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

/* global TransformStream */

let wasm, malloc, free, memory, initError;

export function setWasmExports(wasmAPI) {
	wasm = wasmAPI;
	({ malloc, free, memory } = wasm);
	if (typeof malloc !== "function" || typeof free !== "function" || !memory) {
		wasm = malloc = free = memory = null;
		throw new Error("Invalid WASM module");
	}
}

export function setInitError(error) {
	initError = error;
}

export function resetWasmExports() {
	wasm = malloc = free = memory = initError = null;
}

function _make(isCompress, type, options = {}) {
	if (!wasm) {
		const error = new Error("WASM module not loaded");
		error.cause = initError;
		throw error;
	}
	const level = (typeof options.level === "number") ? options.level : -1;
	const outBufferSize = (typeof options.outBuffer === "number") ? options.outBuffer : 64 * 1024;
	const inBufferSize = (typeof options.inBufferSize === "number") ? options.inBufferSize : 64 * 1024;

	return new TransformStream({
		start() {
			try {
				let result;
				this.out = malloc(outBufferSize);
				this.in = malloc(inBufferSize);
				this.inBufferSize = inBufferSize;
				if (!this.out || !this.in) {
					throw new Error("allocation failed");
				}
				this._scratch = new Uint8Array(outBufferSize);
				if (isCompress) {
					this._process = wasm.deflate_process;
					this._last_consumed = wasm.deflate_last_consumed;
					this._end = wasm.deflate_end;
					this.streamHandle = wasm.deflate_new();
					if (type === "gzip") {
						result = wasm.deflate_init_gzip(this.streamHandle, level);
					} else if (type === "deflate-raw") {
						result = wasm.deflate_init_raw(this.streamHandle, level);
					} else {
						result = wasm.deflate_init(this.streamHandle, level);
					}
				} else {
					if (type === "deflate64-raw") {
						this._process = wasm.inflate9_process;
						this._last_consumed = wasm.inflate9_last_consumed;
						this._end = wasm.inflate9_end;
						this.streamHandle = wasm.inflate9_new();
						result = wasm.inflate9_init_raw(this.streamHandle);
					} else {
						this._process = wasm.inflate_process;
						this._last_consumed = wasm.inflate_last_consumed;
						this._end = wasm.inflate_end;
						this.streamHandle = wasm.inflate_new();
						if (type === "deflate-raw") {
							result = wasm.inflate_init_raw(this.streamHandle);
						} else if (type === "gzip") {
							result = wasm.inflate_init_gzip(this.streamHandle);
						} else {
							result = wasm.inflate_init(this.streamHandle);
						}
					}
				}
				if (result !== 0) {
					throw new Error("init failed:" + result);
				}
			} catch (error) {
				disposeStream(this);
				throw error;
			}
		},
		transform(chunk, controller) {
			try {
				const buffer = chunk;
				const heap = new Uint8Array(memory.buffer);
				const process = this._process;
				const last_consumed = this._last_consumed;
				const out = this.out;
				const scratch = this._scratch;
				let offset = 0;
				while (offset < buffer.length) {
					const toRead = Math.min(buffer.length - offset, 32 * 1024);
					if (!this.in || this.inBufferSize < toRead) {
						if (this.in && free) {
							free(this.in);
							this.in = 0;
						}
						this.in = malloc(toRead);
						this.inBufferSize = toRead;
						if (!this.in) {
							throw new Error("allocation failed");
						}
					}
					heap.set(buffer.subarray(offset, offset + toRead), this.in);
					const result = process(this.streamHandle, this.in, toRead, out, outBufferSize, 0);
					const prod = result & 0x00ffffff;
					if (prod) {
						scratch.set(heap.subarray(out, out + prod), 0);
						controller.enqueue(scratch.slice(0, prod));
					}
					if (!isCompress) {
						const code = (result >> 24) & 0xff;
						const signedCode = (code & 0x80) ? code - 256 : code;
						if (signedCode < 0) {
							throw new Error("process error:" + signedCode);
						}
					}
					const consumed = last_consumed(this.streamHandle);
					if (consumed === 0) {
						break;
					}
					offset += consumed;
				}
			} catch (error) {
				disposeStream(this);
				controller.error(error);
			}
		},
		flush(controller) {
			try {
				const heap = new Uint8Array(memory.buffer);
				const process = this._process;
				const out = this.out;
				const scratch = this._scratch;
				while (true) {
					const result = process(this.streamHandle, 0, 0, out, outBufferSize, 4);
					const produced = result & 0x00ffffff;
					const code = (result >> 24) & 0xff;
					if (!isCompress) {
						const signedCode = (code & 0x80) ? code - 256 : code;
						if (signedCode < 0) {
							throw new Error("process error:" + signedCode);
						}
					}
					if (produced) {
						scratch.set(heap.subarray(out, out + produced), 0);
						controller.enqueue(scratch.slice(0, produced));
					}
					if (code === 1 || produced === 0) {
						break;
					}
				}
			} catch (error) {
				controller.error(error);
			} finally {
				const result = disposeStream(this);
				if (result !== 0) {
					controller.error(new Error("end error:" + result));
				}
			}
		},
		cancel() {
			// release the stream handle and buffers when the pipeline is aborted,
			// they would be leaked in the process-lifetime wasm heap otherwise
			disposeStream(this);
		}
	});

	function disposeStream(state) {
		let endResult = 0;
		if (state.streamHandle && state._end) {
			endResult = state._end(state.streamHandle);
		}
		state.streamHandle = 0;
		if (state.in && free) {
			free(state.in);
		}
		state.in = 0;
		if (state.out && free) {
			free(state.out);
		}
		state.out = 0;
		return endResult;
	}
}

export class CompressionStreamZlib {
	constructor(type = "deflate", options) {
		return _make(true, type, options);
	}
}
export class DecompressionStreamZlib {
	constructor(type = "deflate", options) {
		return _make(false, type, options);
	}
}
// These codecs are backed by the WASM module; they are unusable until setWasmExports() has run.
// The worker uses this flag to know it must fall back to the native CompressionStream when the
// module fails to load, rather than discarding a self-contained codec supplied through config.
CompressionStreamZlib.requiresModule = true;
DecompressionStreamZlib.requiresModule = true;