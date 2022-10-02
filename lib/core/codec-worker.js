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

/* global Worker, URL, TransformStream, WritableStream */

import {
	UNDEFINED_TYPE
} from "./constants.js";
import {
	CodecStream,
	MESSAGE_EVENT_TYPE,
	MESSAGE_START,
	MESSAGE_PULL,
	MESSAGE_DATA,
	MESSAGE_ACK_DATA,
	MESSAGE_CLOSE
} from "./streams/codec-stream.js";

// deno-lint-ignore valid-typeof
const WEB_WORKERS_SUPPORTED = typeof Worker != UNDEFINED_TYPE;

export {
	CodecWorker
};

class CodecWorker {

	constructor(workerData, stream, workerOptions, onTaskFinished) {
		const { readable, writable } = stream;
		const { options, config, streamOptions, useWebWorkers, transferStreams, scripts } = workerOptions;
		const { signal } = streamOptions;
		Object.assign(workerData, {
			busy: true,
			readable: readable.pipeThrough(new ReadableStreamHooks(readable, streamOptions, config), { signal }),
			writable,
			options: Object.assign({}, options),
			scripts,
			transferStreams,
			terminate() {
				const { worker, busy } = workerData;
				if (worker && !busy) {
					worker.terminate();
					workerData.interface = null;
				}
			},
			onTaskFinished() {
				workerData.busy = false;
				onTaskFinished(workerData);
			}
		});
		return (useWebWorkers && WEB_WORKERS_SUPPORTED ? createWebWorkerInterface : createWorkerInterface)(workerData, config);
	}
}

class ReadableStreamHooks extends TransformStream {

	constructor(readableSource, { onstart, onprogress, size, onend }, { chunkSize }) {
		let chunkOffset = 0;
		super({
			start() {
				if (onstart) {
					callHandler(onstart, size);
				}
			},
			async transform(chunk, controller) {
				chunkOffset += chunk.length;
				if (onprogress) {
					await callHandler(onprogress, chunkOffset, size);
				}
				controller.enqueue(chunk);
			},
			flush() {
				readableSource.size = chunkOffset;
				if (onend) {
					callHandler(onend, chunkOffset);
				}
			}
		}, { highWaterMark: 1, size: () => chunkSize });
	}
}

async function callHandler(handler, ...parameters) {
	try {
		await handler(...parameters);
	} catch (_error) {
		// ignored
	}
}

function createWorkerInterface(workerData, config) {
	return {
		run: () => runWorker(workerData, config)
	};
}

function createWebWorkerInterface(workerData, { baseURL, chunkSize }) {
	if (!workerData.interface) {
		Object.assign(workerData, {
			worker: getWebWorker(workerData.scripts[0], baseURL, workerData),
			interface: {
				run: () => runWebWorker(workerData, { chunkSize })
			}
		});
	}
	return workerData.interface;
}

async function runWorker({ options, readable, writable, onTaskFinished }, config) {
	const codecStream = new CodecStream(options, config);
	try {
		await readable.pipeThrough(codecStream).pipeTo(writable, { preventClose: true, preventAbort: true });
		const {
			signature,
			size
		} = codecStream;
		return {
			signature,
			size
		};
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
	const { writable, closed } = detectClosedStream(workerData.writable);
	const streamsTransferred = sendMessage({
		type: MESSAGE_START,
		scripts: workerData.scripts.slice(1),
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
	try {
		await writable.close();
	} catch (_error) {
		// ignored
	}
	await closed;
	return resultValue;
}

function detectClosedStream(writableSource) {
	const writer = writableSource.getWriter();
	let resolveStreamClosed;
	const closed = new Promise(resolve => resolveStreamClosed = resolve);
	const writable = new WritableStream({
		async write(chunk) {
			await writer.ready;
			await writer.write(chunk);
		},
		close() {
			writer.releaseLock();
			resolveStreamClosed();
		},
		abort(reason) {
			writer.abort(reason);
		}
	});
	return { writable, closed };
}

let classicWorkersSupported = true;
let transferStreamsSupported = true;

function getWebWorker(url, baseURL, workerData) {
	const workerOptions = { type: "module" };
	let scriptUrl, worker;
	if (typeof url == "function") {
		url = url();
	}
	try {
		scriptUrl = new URL(url, baseURL);
	} catch (_error) {
		scriptUrl = url;
	}
	if (classicWorkersSupported) {
		try {
			worker = new Worker(scriptUrl);
		} catch (_error) {
			classicWorkersSupported = false;
			worker = new Worker(scriptUrl, workerOptions);
		}
	} else {
		worker = new Worker(scriptUrl, workerOptions);
	}
	worker.addEventListener(MESSAGE_EVENT_TYPE, event => onMessage(event, workerData));
	return worker;
}

function sendMessage(message, { worker, writer, onTaskFinished, transferStreams }) {
	try {
		let { data, readable, writable } = message;
		const transferrables = [];
		if (data) {
			const { buffer, length } = data;
			if (length != buffer.byteLength) {
				data = new Uint8Array(data);
			}
			message.data = data.buffer;
			transferrables.push(message.data);
		}
		if (transferStreams && transferStreamsSupported) {
			if (readable) {
				transferrables.push(readable);
			}
			if (writable) {
				transferrables.push(writable);
			}
		} else {
			message.readable = message.writable = null;
		}
		if (transferrables.length) {
			try {
				worker.postMessage(message, transferrables);
				return true;
			} catch (_error) {
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

async function onMessage(event, workerData) {
	const message = event.data;
	const { reader, writer, resolveResult, rejectResult, onTaskFinished } = workerData;
	const { type, data, messageId, result } = message;
	const reponseError = message.error;
	try {
		if (reponseError) {
			const { message, stack, code, name } = reponseError;
			const error = new Error(message);
			Object.assign(error, { stack, code, name });
			close(error);
		} else {
			if (type == MESSAGE_PULL) {
				const { value, done } = await reader.read();
				sendMessage({ type: MESSAGE_DATA, data: value, done, messageId }, workerData);
			}
			if (type == MESSAGE_DATA) {
				await writer.ready;
				await writer.write(new Uint8Array(data));
				sendMessage({ type: MESSAGE_ACK_DATA, messageId }, workerData);
			}
			if (type == MESSAGE_CLOSE) {
				close(null, result);
			}
		}
	} catch (error) {
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