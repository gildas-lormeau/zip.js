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

"use strict";

import { createCodec, CODEC_INFLATE, CODEC_DEFLATE, ERR_INVALID_SIGNATURE, ERR_INVALID_PASSWORD } from "./codec.js";

const MESSAGE_INIT = "init";
const MESSAGE_APPEND = "append";
const MESSAGE_FLUSH = "flush";
const MESSAGE_EVENT_TYPE = "message";

const workers = {
	pool: [],
	pendingRequests: []
};

export {
	createWorkerCodec as createCodec,
	CODEC_DEFLATE,
	CODEC_INFLATE,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSWORD
};

function createWorkerCodec(options, config) {
	const pool = workers.pool;
	const streamCopy =
		!options.inputCompressed && !options.inputSigned && !options.inputEncrypted &&
		!options.outputCompressed && !options.outputSigned && !options.outputEncrypted;
	const webWorker = options.useWebWorkers || (options.useWebWorkers === undefined && config.useWebWorkers && !streamCopy);
	let scripts;
	if (webWorker) {
		const codecType = options.codecType;
		if (config.workerScripts) {
			scripts = config.workerScripts[codecType];
		}
	}
	if (pool.length < config.maxWorkers) {
		const workerData = {};
		pool.push(workerData);
		return getWorkerInterface(workerData, options, webWorker, scripts);
	} else {
		const workerData = pool.find(workerData => !workerData.busy);
		if (workerData) {
			return getWorkerInterface(workerData, options, webWorker, scripts);
		} else {
			return new Promise(resolve => workers.pendingRequests.push({ resolve, options, webWorker, scripts }));
		}
	}
}

function getWorkerInterface(workerData, options, webWorker, scripts) {
	workerData.busy = true;
	workerData.options = options;
	workerData.scripts = scripts;
	workerData.webWorker = webWorker;
	return webWorker ? createWebWorkerInterface(workerData) : createWorkerInterface(workerData);
}

function createWorkerInterface(workerData) {
	const interfaceCodec = createCodec(workerData.options);
	return {
		async append(data) {
			try {
				return await interfaceCodec.append(data);
			} catch (error) {
				onTaskFinished(workerData);
				throw error;
			}
		},
		async flush() {
			try {
				return await interfaceCodec.flush();
			} finally {
				onTaskFinished(workerData);
			}
		}
	};
}

function createWebWorkerInterface(workerData) {
	let task;
	if (!workerData.interface) {
		workerData.worker = new Worker(new URL(workerData.scripts[0], import.meta.url));
		workerData.worker.addEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
		workerData.interface = {
			append(data) {
				return initAndSendMessage({ type: MESSAGE_APPEND, data });
			},
			flush() {
				return initAndSendMessage({ type: MESSAGE_FLUSH });
			}
		};
	}
	return workerData.interface;

	async function initAndSendMessage(message) {
		if (!task) {
			const options = workerData.options;
			const scripts = workerData.scripts ? workerData.scripts.slice(1) : [];
			await sendMessage(Object.assign({
				scripts,
				type: MESSAGE_INIT, options: {
					codecType: options.codecType,
					inputPassword: options.inputPassword,
					inputEncryptionStrength: options.inputEncryptionStrength,
					inputSigned: options.inputSigned,
					inputSignature: options.signature,
					inputCompressed: options.inputCompressed,
					inputEncrypted: options.inputEncrypted,
					level: options.level,
					outputPassword: options.outputPassword,
					outputEncryptionStrength: options.outputEncryptionStrength,
					outputSigned: options.outputSigned,
					outputCompressed: options.outputCompressed,
					outputEncrypted: options.outputEncrypted
				}
			}));
		}
		return sendMessage(message);
	}

	function sendMessage(message) {
		const worker = workerData.worker;
		const result = new Promise((resolve, reject) => task = { resolve, reject });
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
			task = null;
			onTaskFinished(workerData);
		}
		return result;
	}

	function onMessage(event) {
		const message = event.data;
		if (task) {
			const reponseError = message.error;
			if (reponseError) {
				const error = new Error(reponseError.message);
				error.stack = reponseError.stack;
				task.reject(error);
				task = null;
				onTaskFinished(workerData);
			} else if (message.type == MESSAGE_INIT || message.type == MESSAGE_FLUSH || message.type == MESSAGE_APPEND) {
				if (message.type == MESSAGE_FLUSH) {
					task.resolve({ data: new Uint8Array(message.data), signature: message.signature });
					task = null;
					onTaskFinished(workerData);
				} else {
					task.resolve(message.data && new Uint8Array(message.data));
				}
			}
		}
	}
}

function onTaskFinished(workerData) {
	workerData.busy = false;
	if (workers.pendingRequests.length) {
		const [{ resolve, options, webWorker, scripts }] = workers.pendingRequests.splice(0, 1);
		resolve(getWorkerInterface(workerData, options, webWorker, scripts));
	} else {
		if (workerData.worker) {
			workerData.worker.terminate();
		}
		workers.pool = workers.pool.filter(data => data != workerData);
	}
}