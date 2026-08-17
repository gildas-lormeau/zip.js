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

/* global Worker, TransformStream */

import {
	UNDEFINED_VALUE,
	UNDEFINED_TYPE
} from "./constants.js";
import { getChunkSize } from "./configuration.js";
import {
	CODEC_DEFLATE,
	CodecStream,
	ChunkStream,
	supportsDeflateRaw,
	supportsGzip
} from "./streams/codec-stream.js";

const ERR_WORKER_STARTUP_TIMEOUT = "Worker startup timeout";

let webWorkerSupported, createWorkerFailed, webWorkerBackend;
let initModule = () => { };

export {
	CodecWorker,
	ProgressWatcherStream,
	callHandler,
	configureWorker,
	resetWebWorkerSupport,
	supportsDeflate,
	setWebWorkerBackend,
	disableWebWorker,
	createWorkerInterface,
	runWorker,
	ERR_WORKER_STARTUP_TIMEOUT
};

function configureWorker({ initModule: initModuleFunction }) {
	initModule = initModuleFunction;
}

function setWebWorkerBackend(backend) {
	webWorkerBackend = backend;
}

async function supportsDeflate(config) {
	const { CompressionStream: NativeStream, CompressionStreamFallback: FallbackStream } = config;
	if (FallbackStream && !FallbackStream.requiresModule) {
		return true;
	}
	if (supportsDeflateRaw(NativeStream) || supportsGzip(NativeStream)) {
		return true;
	}
	if (FallbackStream) {
		try {
			await initModule(config);
			return true;
		} catch {
			return false;
		}
	}
	return false;
}

function resetWebWorkerSupport() {
	webWorkerSupported = UNDEFINED_VALUE;
	createWorkerFailed = false;
}

function disableWebWorker(workerData) {
	if (workerData.createWorker) {
		createWorkerFailed = true;
	} else {
		webWorkerSupported = false;
	}
}

class CodecWorker {

	constructor(workerData, { readable, writable }, { options, config, streamOptions, useWebWorkers, transferStreams, workerURI, createWorker }, onTaskFinished) {
		const { signal } = streamOptions;
		if (createWorkerFailed) {
			createWorker = UNDEFINED_VALUE;
		}
		Object.assign(workerData, {
			busy: true,
			generation: (workerData.generation || 0) + 1,
			readable: readable
				.pipeThrough(new ChunkStream(getChunkSize(config)))
				.pipeThrough(new ProgressWatcherStream(streamOptions), { signal }),
			writable,
			options: Object.assign({}, options),
			workerURI,
			createWorker,
			transferStreams,
			terminate() {
				return new Promise(resolve => {
					const { worker, busy } = workerData;
					if (worker) {
						if (busy) {
							workerData.resolveTerminated = resolve;
						} else {
							worker.terminate();
							resolve();
						}
						workerData.interface = null;
					} else {
						resolve();
					}
				});
			},
			onTaskFinished() {
				if (workerData.busy) {
					const { resolveTerminated } = workerData;
					if (resolveTerminated) {
						workerData.resolveTerminated = null;
						workerData.terminated = true;
						workerData.worker.terminate();
						resolveTerminated();
					}
					workerData.busy = false;
					onTaskFinished(workerData);
				}
			}
		});
		if (webWorkerSupported === UNDEFINED_VALUE) {
			// deno-lint-ignore valid-typeof
			webWorkerSupported = typeof Worker != UNDEFINED_TYPE;
		}
		return (useWebWorkers && webWorkerBackend && ((webWorkerSupported && workerURI) || createWorker) ? webWorkerBackend : createWorkerInterface)(workerData, config);
	}
}

class ProgressWatcherStream extends TransformStream {

	constructor({ onstart, onprogress, size, onend }) {
		let chunkOffset = 0;
		super({
			async start() {
				if (onstart) {
					await callHandler(onstart, size);
				}
			},
			async transform(chunk, controller) {
				chunkOffset += chunk.length;
				if (onprogress) {
					await callHandler(onprogress, chunkOffset, size);
				}
				controller.enqueue(chunk);
			},
			async flush() {
				if (onend) {
					await callHandler(onend, chunkOffset);
				}
			}
		});
	}
}

async function callHandler(handler, ...parameters) {
	try {
		await handler(...parameters);
	} catch {
		// ignored
	}
}

function createWorkerInterface(workerData, config) {
	return {
		run: () => runWorker(workerData, config)
	};
}

async function runWorker({ options, readable, writable, onTaskFinished }, config) {
	let codecStream;
	try {
		if (options.compressed && !options.format) {
			const deflate = options.codecType.startsWith(CODEC_DEFLATE);
			const FallbackStream = deflate ? config.CompressionStreamFallback : config.DecompressionStreamFallback;
			const NativeStream = deflate ? config.CompressionStream : config.DecompressionStream;
			if (!options.useCompressionStream) {
				try {
					await initModule(config);
				} catch {
					if (!FallbackStream || FallbackStream.requiresModule) {
						options.useCompressionStream = true;
					}
				}
			} else if (FallbackStream && FallbackStream.requiresModule && !supportsDeflateRaw(NativeStream)) {
				try {
					await initModule(config);
				} catch {
					// ignored
				}
			}
		}
		codecStream = new CodecStream(options, config);
		await readable
			.pipeThrough(codecStream)
			.pipeThrough(new ChunkStream(getChunkSize(config)))
			.pipeTo(writable, { preventClose: true, preventAbort: true });
		const {
			crc32,
			inputSize,
			outputSize
		} = codecStream;
		return {
			crc32,
			inputSize,
			outputSize
		};
	} catch (error) {
		if (codecStream) {
			error.outputSize = codecStream.outputSize;
		}
		throw error;
	} finally {
		onTaskFinished();
	}
}
