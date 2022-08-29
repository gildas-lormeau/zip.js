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

/* global Worker, URL, TransformStream */

import {
	Codec,
	MESSAGE_EVENT_TYPE,
	MESSAGE_START,
	MESSAGE_PULL,
	MESSAGE_DATA,
	MESSAGE_ACK_DATA,
	MESSAGE_CLOSE
} from "./codec-interface.js";

let workersSupported;
let classicWorkersSupported = true;

export {
	CodecWorker
};

class CodecWorker {

	constructor(workerData, stream, workerOptions, onTaskFinished) {
		const { readable, writable } = stream;
		const { options, config, streamOptions, webWorker, scripts, codecConstructor } = workerOptions;
		Object.assign(workerData, {
			busy: true,
			codecConstructor,
			readable,
			writable,
			options: Object.assign({}, options),
			scripts,
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
			transformer.start = () => callHandler(onstart, size());
		}
		transformer.transform = async (chunk, controller) => {
			chunkOffset += chunk.length;
			if (onprogress) {
				await callHandler(onprogress, chunkOffset, size());
			}
			controller.enqueue(chunk);
		};
		transformer.flush = () => {
			readable.size = () => chunkOffset;
			if (onend) {
				callHandler(onend, chunkOffset);
			}
		};
		workerData.readable = readable.pipeThrough(new TransformStream(transformer, { highWaterMark: 1, size: () => config.chunkSize }), { signal });
		if (workersSupported === undefined) {
			workersSupported = typeof Worker != "undefined";
		}
		return webWorker && workersSupported ? createWebWorkerInterface(workerData, config) : createWorkerInterface(workerData, config);
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
	const interfaceCodec = new Codec(workerData.codecConstructor, workerData.readable, workerData.writable, workerData.options, config);
	const { onTaskFinished } = workerData;
	const codec = {
		async run() {
			try {
				return await interfaceCodec.run();
			} finally {
				onTaskFinished();
			}
		}
	};
	return codec;
}

function createWebWorkerInterface(workerData, { baseURL, chunkSize }) {
	const workerOptions = { type: "module" };
	const { readable, writable } = workerData;
	Object.assign(workerData, {
		reader: readable.getReader(),
		writer: writable.getWriter(),
		result: new Promise((resolve, reject) => {
			workerData.resolveResult = resolve;
			workerData.rejectResult = reject;
		})
	});
	if (!workerData.interface) {
		if (!classicWorkersSupported) {
			workerData.worker = getWorker(workerOptions);
		} else {
			try {
				workerData.worker = getWorker({});
			} catch (_error) {
				classicWorkersSupported = false;
				workerData.worker = getWorker(workerOptions);
			}
		}
		workerData.worker.addEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
		workerData.interface = {
			run() {
				const { options } = workerData;
				const scripts = workerData.scripts.slice(1);
				sendMessage({ type: MESSAGE_START, scripts, options, config: { chunkSize } });
				return workerData.result;
			}
		};
	}
	return workerData.interface;

	function getWorker(options) {
		let url, scriptUrl;
		url = workerData.scripts[0];
		if (typeof url == "function") {
			url = url();
		}
		try {
			scriptUrl = new URL(url, baseURL);
		} catch (_error) {
			scriptUrl = url;
		}
		return new Worker(scriptUrl, options);
	}

	function sendMessage(message) {
		const { worker, writer, onTaskFinished } = workerData;
		try {
			let { data } = message;
			if (data) {
				try {
					const { buffer, length } = data;
					if (length != buffer.byteLength) {
						data = new Uint8Array(data);
					}
					message.data = data.buffer;
					worker.postMessage(message, [message.data]);
				} catch (_error) {
					worker.postMessage(message);
				}
			} else {
				worker.postMessage(message);
			}
		} catch (error) {
			writer.releaseLock();
			onTaskFinished();
			throw error;
		}
	}

	async function onMessage(event) {
		const message = event.data;
		const { reader, writer, resolveResult, rejectResult, onTaskFinished } = workerData;
		const { type, data, messageId, result } = message;
		const reponseError = message.error;
		try {
			if (reponseError) {
				const { message, stack } = reponseError;
				const error = new Error(message);
				error.stack = stack;
				close(error);
			} else {
				if (type == MESSAGE_PULL) {
					const { value, done } = await reader.read();
					sendMessage({ type: MESSAGE_DATA, data: value, done, messageId });
				}
				if (type == MESSAGE_DATA) {
					await writer.ready;
					workerData.writable.size += data.byteLength;
					await writer.write(new Uint8Array(data));
					sendMessage({ type: MESSAGE_ACK_DATA, messageId });
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
			writer.releaseLock();
			onTaskFinished();
		}
	}
}