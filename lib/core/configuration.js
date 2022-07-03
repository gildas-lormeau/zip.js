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

/* global navigator */

const DEFAULT_CONFIGURATION = {
	chunkSize: 512 * 1024,
	maxWorkers: (typeof navigator != "undefined" && navigator.hardwareConcurrency) || 2,
	terminateWorkerTimeout: 5000,
	useWebWorkers: true,
	workerScripts: undefined
};

const config = Object.assign({}, DEFAULT_CONFIGURATION);

export {
	configure,
	getConfiguration
};

function getConfiguration() {
	return config;
}

function configure(configuration) {
	if (configuration.baseURL !== undefined) {
		config.baseURL = configuration.baseURL;
	}
	if (configuration.chunkSize !== undefined) {
		config.chunkSize = configuration.chunkSize;
	}
	if (configuration.maxWorkers !== undefined) {
		config.maxWorkers = configuration.maxWorkers;
	}
	if (configuration.terminateWorkerTimeout !== undefined) {
		config.terminateWorkerTimeout = configuration.terminateWorkerTimeout;
	}
	if (configuration.useWebWorkers !== undefined) {
		config.useWebWorkers = configuration.useWebWorkers;
	}
	if (configuration.Deflate !== undefined) {
		config.Deflate = configuration.Deflate;
	}
	if (configuration.Inflate !== undefined) {
		config.Inflate = configuration.Inflate;
	}
	if (configuration.workerScripts !== undefined) {
		if (configuration.workerScripts.deflate) {
			if (!Array.isArray(configuration.workerScripts.deflate)) {
				throw new Error("workerScripts.deflate must be an array");
			}
			if (!config.workerScripts) {
				config.workerScripts = {};
			}
			config.workerScripts.deflate = configuration.workerScripts.deflate;
		}
		if (configuration.workerScripts.inflate) {
			if (!Array.isArray(configuration.workerScripts.inflate)) {
				throw new Error("workerScripts.inflate must be an array");
			}
			if (!config.workerScripts) {
				config.workerScripts = {};
			}
			config.workerScripts.inflate = configuration.workerScripts.inflate;
		}
	}
}
