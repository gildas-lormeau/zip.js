/*
 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright 
 notice, this list of conditions and the following disclaimer in 
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
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

/* global Worker, document, URL */

"use strict";

import { createCodec, CODEC_INFLATE, CODEC_DEFLATE, ERR_INVALID_SIGNATURE, ERR_INVALID_PASSORD } from "./codec.js";

const MESSAGE_INIT = "init";
const MESSAGE_APPEND = "append";
const MESSAGE_FLUSH = "flush";
const MESSAGE_EVENT_TYPE = "message";

const Z_WORKER_SCRIPT_PATH = "z-worker.js";
const DEFAULT_WORKER_SCRIPTS = {
	deflate: [Z_WORKER_SCRIPT_PATH, "deflate.js"],
	inflate: [Z_WORKER_SCRIPT_PATH, "inflate.js"]
};
const workers = {
	pool: [],
	pendingRequests: []
};

export {
	createWorkerCodec as createCodec,
	CODEC_DEFLATE,
	CODEC_INFLATE,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSORD
};

function createWorkerCodec(config, options) {
	const pool = workers.pool;
	let scripts;
	if (config.useWebWorkers) {
		const codecType = options.codecType;
		if (config.workerScripts != null && config.workerScriptsPath != null) {
			throw new Error("Either workerScripts or workerScriptsPath may be set, not both");
		}
		if (config.workerScripts) {
			scripts = config.workerScripts[codecType];
			if (!Array.isArray(scripts)) {
				throw new Error("workerScripts." + codecType + " must be an array");
			}
			scripts = resolveURLs(scripts);
		} else {
			scripts = DEFAULT_WORKER_SCRIPTS[codecType].slice(0);
			scripts[0] = (config.workerScriptsPath || "") + scripts[0];
		}
	}
	if (pool.length < config.maxWorkers) {
		const workerData = { worker: scripts && new Worker(scripts[0]), busy: true, options, scripts };
		pool.push(workerData);
		return scripts ? createWebWorkerInterface(workerData) : createWorkerInterface(workerData);
	} else {
		const availableWorkerData = pool.find(workerData => !workerData.busy);
		if (availableWorkerData) {
			availableWorkerData.busy = true;
			availableWorkerData.options = options;
			availableWorkerData.scripts = scripts;
			return scripts ? availableWorkerData.interface : createWorkerInterface(availableWorkerData);
		} else {
			return new Promise(resolve => workers.pendingRequests.push({ resolve, options, scripts }));
		}
	}
}

async function createWorkerInterface(workerData) {
	const interfaceCodec = createCodec(workerData.options);
	const flush = interfaceCodec.flush.bind(interfaceCodec);
	interfaceCodec.flush = async () => {
		const result = await flush();
		workerData.busy = false;
		if (workers.pendingRequests.length) {
			const [{ resolve, options }] = workers.pendingRequests.splice(0, 1);
			workerData.busy = true;
			workerData.options = options;
			resolve(await createWorkerInterface(workerData));
		} else {
			workers.pool = workers.pool.filter(data => data != workerData);
		}
		return result;
	};
	return interfaceCodec;
}

function createWebWorkerInterface(workerData) {
	const worker = workerData.worker;
	const scripts = workerData.scripts.slice(1);
	let task;
	worker.addEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
	workerData.interface = {
		async append(data) {
			return initAndSendMessage({ type: MESSAGE_APPEND, data });
		},
		async flush() {
			return initAndSendMessage({ type: MESSAGE_FLUSH });
		}
	};
	return workerData.interface;

	async function initAndSendMessage(message) {
		if (!task) {
			await sendMessage(Object.assign({ type: MESSAGE_INIT, options: workerData.options, scripts }));
		}
		return sendMessage(message);
	}

	function sendMessage(message) {
		try {
			if (message.data) {
				try {
					worker.postMessage(message, [message.data.buffer]);
				} catch (error) {
					worker.postMessage(message);
				}
			} else {
				worker.postMessage(message);
			}
		} catch (error) {
			task.reject(error);
			worker.removeEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
		}
		return new Promise((resolve, reject) => task = { resolve, reject });
	}

	function onMessage(event) {
		const message = event.data;
		if (task) {
			const reponseError = message.error;
			if (reponseError) {
				const error = new Error(reponseError.message);
				error.stack = reponseError.stack;
				task.reject(error);
				worker.removeEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
			} else if (message.type == MESSAGE_INIT || message.type == MESSAGE_FLUSH || message.type == MESSAGE_APPEND) {
				if (message.type == MESSAGE_FLUSH) {
					task.resolve({ data: new Uint8Array(message.data), signature: message.signature });
					task = null;
					terminateWebWorker(workerData);
				} else {
					task.resolve(message.data && new Uint8Array(message.data));
				}
			}
		}
	}
}

function terminateWebWorker(workerData) {
	workerData.busy = false;
	if (workers.pendingRequests.length) {
		const [{ resolve, options, scripts }] = workers.pendingRequests.splice(0, 1);
		workerData.busy = true;
		workerData.options = options;
		workerData.scripts = scripts;
		resolve(workerData.interface);
	} else {
		workerData.worker.terminate();
		workers.pool = workers.pool.filter(data => data != workerData);
	}
}

function resolveURLs(urls) {
	if (typeof document != "undefined") {
		return urls.map(url => new URL(url, document.baseURI).href);
	} else {
		return urls;
	}
}