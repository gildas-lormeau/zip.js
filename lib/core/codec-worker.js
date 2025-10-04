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

/* global Worker, URL, TransformStream, WritableStream */

import {
	UNDEFINED_TYPE,
	FUNCTION_TYPE
} from "./constants.js";
import {
	CodecStream,
	ChunkStream,
	MESSAGE_EVENT_TYPE,
	MESSAGE_START,
	MESSAGE_PULL,
	MESSAGE_DATA,
	MESSAGE_ACK_DATA,
	MESSAGE_CLOSE
} from "./streams/codec-stream.js";

// deno-lint-ignore valid-typeof
let WEB_WORKERS_SUPPORTED = typeof Worker != UNDEFINED_TYPE;
let initModule = () => { };

export {
	CodecWorker,
	configureWorker
};

function configureWorker({ initModule: initModuleFunction }) {
	initModule = initModuleFunction;
}

class CodecWorker {

	constructor(workerData, { readable, writable }, { options, config, streamOptions, useWebWorkers, transferStreams, workerURI }, onTaskFinished) {
		const { signal } = streamOptions;
		Object.assign(workerData, {
			busy: true,
			readable: readable
				.pipeThrough(new ChunkStream(config.chunkSize))
				.pipeThrough(new ProgressWatcherStream(streamOptions), { signal }),
			writable,
			options: Object.assign({}, options),
			workerURI,
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
		});
		return (useWebWorkers && WEB_WORKERS_SUPPORTED ? createWebWorkerInterface : createWorkerInterface)(workerData, config);
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

function createWebWorkerInterface(workerData, config) {
	const { baseURI, chunkSize } = config;
	let { wasmURI } = config;

	if (!workerData.interface) {
		// deno-lint-ignore valid-typeof
		if (typeof wasmURI == FUNCTION_TYPE) {
			wasmURI = wasmURI();
		}
		let worker;
		try {
			worker = getWebWorker(workerData.workerURI, baseURI, workerData);
		} catch {
			WEB_WORKERS_SUPPORTED = false;
			return createWorkerInterface(workerData, config);
		}
		Object.assign(workerData, {
			worker,
			interface: {
				run: () => runWebWorker(workerData, { chunkSize, wasmURI, baseURI })
			}
		});
	}
	return workerData.interface;
}

async function runWorker({ options, readable, writable, onTaskFinished }, config) {
	let codecStream;
	try {
		if (!options.useCompressionStream) {
			try {
				await initModule(config);
			} catch {
				options.useCompressionStream = true;
			}
		}
		codecStream = new CodecStream(options, config);
		await readable.pipeThrough(codecStream).pipeTo(writable, { preventClose: true, preventAbort: true });
		const {
			signature,
			inputSize,
			outputSize
		} = codecStream;
		return {
			signature,
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

async function runWebWorker(workerData, config) {
	let resolveResult, rejectResult;
	const result = new Promise((resolve, reject) => {
		resolveResult = resolve;
		rejectResult = reject;
	});
	Object.assign(workerData, {
		reader: null,
		writer: null,
		resolveResult,
		rejectResult,
		result
	});
	const { readable, options } = workerData;
	const { writable, closed } = watchClosedStream(workerData.writable);
	const streamsTransferred = sendMessage({
		type: MESSAGE_START,
		options,
		config,
		readable,
		writable
	}, workerData);
	if (!streamsTransferred) {
		Object.assign(workerData, {
			reader: readable.getReader(),
			writer: writable.getWriter()
		});
	}
	const resultValue = await result;
	if (!streamsTransferred) {
		await writable.getWriter().close();
	}
	await closed;
	return resultValue;
}

function watchClosedStream(writableSource) {
	let resolveStreamClosed;
	const closed = new Promise(resolve => resolveStreamClosed = resolve);
	const writable = new WritableStream({
		async write(chunk) {
			const writer = writableSource.getWriter();
			await writer.ready;
			await writer.write(chunk);
			writer.releaseLock();
		},
		close() {
			resolveStreamClosed();
		},
		abort(reason) {
			const writer = writableSource.getWriter();
			return writer.abort(reason);
		}
	});
	return { writable, closed };
}

let transferStreamsSupported = true;

function getWebWorker(url, baseURI, workerData) {
	const workerOptions = { type: "module" };
	let scriptUrl, worker;
	// deno-lint-ignore valid-typeof
	if (typeof url == FUNCTION_TYPE) {
		url = url();
	}
	if (url.startsWith("data:") || url.startsWith("blob:")) {
		try {
			worker = new Worker(url);
		} catch {
			worker = new Worker(url, workerOptions);
		}
	} else {
		try {
			scriptUrl = new URL(url, baseURI);
		} catch {
			scriptUrl = url;
		}
		worker = new Worker(scriptUrl, workerOptions);
	}
	worker.addEventListener(MESSAGE_EVENT_TYPE, event => onMessage(event, workerData));
	return worker;
}

function sendMessage(message, { worker, writer, onTaskFinished, transferStreams }) {
	try {
		const { value, readable, writable } = message;
		const transferables = [];
		if (value) {
			message.value = value;
			transferables.push(message.value.buffer);
		}
		if (transferStreams && transferStreamsSupported) {
			if (readable) {
				transferables.push(readable);
			}
			if (writable) {
				transferables.push(writable);
			}
		} else {
			message.readable = message.writable = null;
		}
		if (transferables.length) {
			try {
				worker.postMessage(message, transferables);
				return true;
			} catch {
				transferStreamsSupported = false;
				message.readable = message.writable = null;
				worker.postMessage(message);
			}
		} else {
			worker.postMessage(message);
		}
	} catch (error) {
		if (writer) {
			writer.releaseLock();
		}
		onTaskFinished();
		throw error;
	}
}

async function onMessage({ data }, workerData) {
	const { type, value, messageId, result, error } = data;
	const { reader, writer, resolveResult, rejectResult, onTaskFinished } = workerData;
	try {
		if (error) {
			const { message, stack, code, name, outputSize } = error;
			const responseError = new Error(message);
			Object.assign(responseError, { stack, code, name, outputSize });
			close(responseError);
		} else {
			if (type == MESSAGE_PULL) {
				const { value, done } = await reader.read();
				sendMessage({ type: MESSAGE_DATA, value, done, messageId }, workerData);
			}
			if (type == MESSAGE_DATA) {
				await writer.ready;
				await writer.write(new Uint8Array(value));
				sendMessage({ type: MESSAGE_ACK_DATA, messageId }, workerData);
			}
			if (type == MESSAGE_CLOSE) {
				close(null, result);
			}
		}
	} catch (error) {
		sendMessage({ type: MESSAGE_CLOSE, messageId }, workerData);
		close(error);
	}

	function close(error, result) {
		if (error) {
			rejectResult(error);
		} else {
			resolveResult(result);
		}
		if (writer) {
			writer.releaseLock();
		}
		onTaskFinished();
	}
}