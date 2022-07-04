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

/* global Worker, URL */

import { createCodec, MESSAGE_EVENT_TYPE, MESSAGE_START, MESSAGE_PULL, MESSAGE_DATA, MESSAGE_ABORT } from "./codec.js";

let classicWorkersSupported = true;

export {
	getWorker
};

function getWorker(workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts) {
	Object.assign(workerData, {
		busy: true,
		codecConstructor,
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
	return webWorker ? createWebWorkerInterface(workerData, config) : createWorkerInterface(workerData, config);
}

function createWorkerInterface(workerData, config) {
	const interfaceCodec = createCodec(workerData.codecConstructor, workerData.options, config);
	const codec = {
		abort() {
			interfaceCodec.abort();
			workerData.onTaskFinished();
		},
		start() {
			return interfaceCodec.start();
		}
	};
	interfaceCodec.pull = () => codec.pull();
	interfaceCodec.ondata = data => ondata(workerData, codec, data);
	return codec;
}

function createWebWorkerInterface(workerData, { baseURL, chunkSize }) {
	const workerOptions = { type: "module" };
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
			abort() {
				sendMessage({ type: MESSAGE_ABORT });
				workerData.onTaskFinished();
			},
			start() {
				const options = workerData.options;
				const scripts = workerData.scripts.slice(1);
				sendMessage({ type: MESSAGE_START, scripts, options, config: { chunkSize } });
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
		const worker = workerData.worker;
		try {
			if (message.data) {
				try {
					message.data = message.data.buffer;
					worker.postMessage(message, [message.data]);
				} catch (_error) {
					worker.postMessage(message);
				}
			} else {
				worker.postMessage(message);
			}
		} catch (error) {
			workerData.onTaskFinished();
			throw error;
		}
	}

	async function onMessage(event) {
		const message = event.data;
		const reponseError = message.error;
		const codec = workerData.interface;
		try {
			if (reponseError) {
				const error = new Error(reponseError.message);
				error.stack = reponseError.stack;
				codec.onerror(error);
				workerData.onTaskFinished();
			} else {
				if (message.type == MESSAGE_PULL) {
					const { value, done } = await codec.pull();
					sendMessage({ type: MESSAGE_DATA, data: value, done, messageId: message.messageId });
				}
				if (message.type == MESSAGE_DATA) {
					const { value } = message.data;
					if (value && value.data) {
						value.data = new Uint8Array(value.data);
					}
					await ondata(workerData, codec, message.data);
				}
			}
		} catch (error) {
			codec.onerror(error);
			workerData.onTaskFinished();
		}
	}
}

async function ondata(workerData, codec, data) {
	let { value, done } = data;
	if (done) {
		await codec.ondata({ value: { data: value.data, signature: value.signature }, done });
		workerData.onTaskFinished();
	} else if (value.data) {
		await codec.ondata({ value: { data: value.data } });
	}
}