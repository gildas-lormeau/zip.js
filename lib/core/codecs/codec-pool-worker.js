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

import { createCodec } from "./codec.js";

const MESSAGE_INIT = "init";
const MESSAGE_APPEND = "append";
const MESSAGE_FLUSH = "flush";
const MESSAGE_EVENT_TYPE = "message";

let classicWorkersSupported = true;

export default (workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts) => {
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
};

function createWorkerInterface(workerData, config) {
	const interfaceCodec = createCodec(workerData.codecConstructor, workerData.options, config);
	return {
		async append(data) {
			try {
				return await interfaceCodec.append(data);
			} catch (error) {
				workerData.onTaskFinished();
				throw error;
			}
		},
		async flush() {
			try {
				return await interfaceCodec.flush();
			} finally {
				workerData.onTaskFinished();
			}
		},
		abort() {
			workerData.onTaskFinished();
		}
	};
}

function createWebWorkerInterface(workerData, config) {
	let messageTask;
	const workerOptions = { type: "module" };
	if (!workerData.interface) {
		if (!classicWorkersSupported) {
			workerData.worker = getWorker(workerOptions, config.baseURL);
		} else {
			try {
				workerData.worker = getWorker({}, config.baseURL);
			} catch (_error) {
				classicWorkersSupported = false;
				workerData.worker = getWorker(workerOptions, config.baseURL);
			}
		}
		workerData.worker.addEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
		workerData.interface = {
			append(data) {
				return initAndSendMessage({ type: MESSAGE_APPEND, data });
			},
			flush() {
				return initAndSendMessage({ type: MESSAGE_FLUSH });
			},
			abort() {
				workerData.onTaskFinished();
			}
		};
	}
	return workerData.interface;

	function getWorker(options, baseURL) {
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

	async function initAndSendMessage(message) {
		if (!messageTask) {
			const options = workerData.options;
			const scripts = workerData.scripts.slice(1);
			await sendMessage({ scripts, type: MESSAGE_INIT, options, config: { chunkSize: config.chunkSize } });
		}
		return sendMessage(message);
	}

	function sendMessage(message) {
		const worker = workerData.worker;
		const result = new Promise((resolve, reject) => messageTask = { resolve, reject });
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
			messageTask.reject(error);
			messageTask = null;
			workerData.onTaskFinished();
		}
		return result;
	}

	function onMessage(event) {
		const message = event.data;
		if (messageTask) {
			const reponseError = message.error;
			const type = message.type;
			if (reponseError) {
				const error = new Error(reponseError.message);
				error.stack = reponseError.stack;
				messageTask.reject(error);
				messageTask = null;
				workerData.onTaskFinished();
			} else if (type == MESSAGE_INIT || type == MESSAGE_FLUSH || type == MESSAGE_APPEND) {
				const data = message.data;
				if (type == MESSAGE_FLUSH) {
					messageTask.resolve({ data: new Uint8Array(data), signature: message.signature });
					messageTask = null;
					workerData.onTaskFinished();
				} else {
					messageTask.resolve(data && new Uint8Array(data));
				}
			}
		}
	}
}