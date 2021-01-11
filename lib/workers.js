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

/* global Worker, document */

"use strict";

const Z_WORKER_SCRIPT_PATH = "z-worker.js";
const DEFAULT_WORKER_SCRIPTS = {
	deflate: [Z_WORKER_SCRIPT_PATH, "deflate.js", "crypto.js"],
	inflate: [Z_WORKER_SCRIPT_PATH, "inflate.js", "crypto.js"]
};
const workers = {
	pool: [],
	pendingRequests: []
};

export default createWorkerCodec;

function createWorkerCodec(config, options) {
	const codecType = options.codecType;
	if (config.workerScripts != null && config.workerScriptsPath != null) {
		throw new Error("Either zip.workerScripts or zip.workerScriptsPath may be set, not both.");
	}
	let scripts;
	if (config.workerScripts) {
		scripts = config.workerScripts[codecType];
		if (!Array.isArray(scripts)) {
			throw new Error("zip.workerScripts." + codecType + " must be an array.");
		}
		scripts = resolveURLs(scripts);
	} else {
		scripts = DEFAULT_WORKER_SCRIPTS[codecType].slice(0);
		scripts[0] = (config.workerScriptsPath || "") + scripts[0];
	}
	if (workers.pool.length < config.maxWorkers) {
		const workerData = { worker: new Worker(scripts[0]), busy: true, options, scripts };
		workers.pool.push(workerData);
		createWorkerInterface(workerData);
		return workerData.interface;
	} else {
		const availableWorkerData = workers.pool.find(workerData => !workerData.busy);
		if (availableWorkerData) {
			availableWorkerData.busy = true;
			availableWorkerData.options = options;
			availableWorkerData.scripts = scripts;
			return availableWorkerData.interface;
		} else {
			return new Promise(resolve => workers.pendingRequests.push({ resolve, options, scripts }));
		}
	}
}

function createWorkerInterface(workerData) {
	const worker = workerData.worker;
	let task;
	worker.addEventListener("message", onMessage, false);
	workerData.interface = {
		async append(data) {
			if (!task) {
				await sendMessage(Object.assign({ type: "init", options: workerData.options, scripts: workerData.scripts.slice(1) }));
			}
			return sendMessage({ type: "append", data });
		},
		async flush() {
			return sendMessage({ type: "flush" });
		}
	};

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
			worker.removeEventListener("message", onMessage, false);
		}
		return new Promise((resolve, reject) => task = { resolve, reject });
	}

	function onMessage(event) {
		const message = event.data;
		if (task) {
			if (message.error) {
				const error = new Error(message.error.message);
				error.stack = message.error.stack;
				task.reject(error);
				worker.removeEventListener("message", onMessage, false);
			} else if (message.type == "init" || message.type == "flush" || message.type == "append") {
				if (message.type == "flush") {
					task.resolve({ data: new Uint8Array(message.data), signature: message.signature });
					task = null;
					terminateWorker(workerData);
				} else {
					task.resolve(message.data && new Uint8Array(message.data));
				}
			}
		}
	}
}

function terminateWorker(workerData) {
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
		const anchorElement = document.createElement("a");
		return urls.map(url => {
			anchorElement.href = url;
			return anchorElement.href;
		});
	} else {
		return urls;
	}
}