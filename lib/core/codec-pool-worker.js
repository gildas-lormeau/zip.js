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

const WEB_WORKERS_SUPPORTED = typeof Worker != UNDEFINED_TYPE;

export {
	CodecWorker
};

class CodecWorker {

	constructor(workerData, stream, workerOptions, onTaskFinished) {
		const { readable, writable } = stream;
		const { options, config, streamOptions, useWebWorkers, transferStreams, scripts } = workerOptions;
		Object.assign(workerData, {
			busy: true,
			readable,
			writable,
			options: Object.assign({}, options),
			scripts,
			transferStreams,
			terminate() {
				if (workerData.worker && !workerData.busy) {
					workerData.worker.terminate();
					workerData.interface = null;
				}
			},
			onTaskFinished() {
				workerData.busy = false;
				onTaskFinished(workerData);
			}
		});
		const { signal, onstart, onprogress, size, onend } = streamOptions;
		let chunkOffset = 0;
		const transformer = {};
		if (onstart) {
			transformer.start = () => callHandler(onstart, size);
		}
		transformer.transform = async (chunk, controller) => {
			chunkOffset += chunk.length;
			if (onprogress) {
				await callHandler(onprogress, chunkOffset, size);
			}
			controller.enqueue(chunk);
		};
		transformer.flush = () => {
			readable.size = chunkOffset;
			if (onend) {
				callHandler(onend, chunkOffset);
			}
		};
		workerData.readable = readable.pipeThrough(new TransformStream(transformer, { highWaterMark: 1, size: () => config.chunkSize }), { signal });
		return useWebWorkers && WEB_WORKERS_SUPPORTED ? createWebWorkerInterface(workerData, config) : createWorkerInterface(workerData, config);
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
	const codecStream = new CodecStream(workerData.options, config);
	const { onTaskFinished } = workerData;
	const codec = {
		async run() {
			try {
				await workerData.readable.pipeThrough(codecStream).pipeTo(workerData.writable, { preventClose: true, preventAbort: true });
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
	};
	return codec;
}

function createWebWorkerInterface(workerData, { baseURL, chunkSize }) {
	Object.assign(workerData, {
		streams: {},
		result: new Promise((resolve, reject) => {
			workerData.resolveResult = resolve;
			workerData.rejectResult = reject;
		})
	});
	if (!workerData.interface) {
		workerData.worker = getWorker(workerData.scripts[0], baseURL, workerData);
		workerData.interface = {
			async run() {
				const { readable, options } = workerData;
				const { writable, closed } = detectClosedStream(workerData.writable);
				const streamsTransferred = sendMessage({
					type: MESSAGE_START,
					scripts: workerData.scripts.slice(1),
					options,
					config: { chunkSize },
					readable,
					writable
				}, workerData);
				if (!streamsTransferred) {
					Object.assign(workerData.streams, {
						reader: readable.getReader(),
						writer: writable.getWriter()
					});
				}
				const result = await workerData.result;
				try {
					await writable.close();
				} catch (_error) {
					// ignored
				}
				await closed;
				return result;
			}
		};
	}
	return workerData.interface;
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
		async close() {
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

function getWorker(url, baseURL, workerData) {
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
			worker = new Worker(scriptUrl, {});
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
			} catch (error) {
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
	const { resolveResult, rejectResult, onTaskFinished, streams } = workerData;
	const { reader, writer } = streams;
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