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

/* global setTimeout, clearTimeout */

import { CODEC_INFLATE, CODEC_DEFLATE, ERR_INVALID_SIGNATURE, ERR_INVALID_PASSWORD } from "./codec.js";
import getWorker from "./codec-pool-worker.js";

let pool = [];
const pendingRequests = [];

export {
	createCodec,
	terminateWorkers,
	CODEC_DEFLATE,
	CODEC_INFLATE,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSWORD
};

function createCodec(codecConstructor, options, config) {
	const streamCopy = !options.compressed && !options.signed && !options.encrypted;
	const webWorker = !streamCopy && (options.useWebWorkers || (options.useWebWorkers === undefined && config.useWebWorkers));
	const scripts = webWorker && config.workerScripts ? config.workerScripts[options.codecType] : [];
	if (pool.length < config.maxWorkers) {
		const workerData = {};
		pool.push(workerData);
		return getWorker(workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts);
	} else {
		const workerData = pool.find(workerData => !workerData.busy);
		if (workerData) {
			clearTerminateTimeout(workerData);
			return getWorker(workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts);
		} else {
			return new Promise(resolve => pendingRequests.push({ resolve, codecConstructor, options, webWorker, scripts }));
		}
	}

	function onTaskFinished(workerData) {
		if (pendingRequests.length) {
			const [{ resolve, codecConstructor, options, webWorker, scripts }] = pendingRequests.splice(0, 1);
			resolve(getWorker(workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts));
		} else if (workerData.worker) {
			clearTerminateTimeout(workerData);
			if (Number.isFinite(config.terminateWorkerTimeout) && config.terminateWorkerTimeout >= 0) {
				workerData.terminateTimeout = setTimeout(() => {
					pool = pool.filter(data => data != workerData);
					workerData.terminate();
				}, config.terminateWorkerTimeout);
			}
		} else {
			pool = pool.filter(data => data != workerData);
		}
	}
}

function clearTerminateTimeout(workerData) {
	if (workerData.terminateTimeout) {
		clearTimeout(workerData.terminateTimeout);
		workerData.terminateTimeout = null;
	}
}

function terminateWorkers() {
	pool.forEach(workerData => {
		clearTerminateTimeout(workerData);
		workerData.terminate();
	});
}