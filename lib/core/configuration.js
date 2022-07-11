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

const MINIMUM_CHUNK_SIZE = 64;
const UNDEFINED_TYPE = undefined;
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
	getConfiguration,
	getChunkSize
};

function getConfiguration() {
	return config;
}

function getChunkSize(config) {
	return Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
}

function configure(configuration) {
	const {
		baseURL,
		chunkSize,
		maxWorkers,
		terminateWorkerTimeout,
		useCompressionStream,
		useWebWorkers,
		Deflate,
		Inflate,
		workerScripts
	} = configuration;
	if (baseURL !== UNDEFINED_TYPE) {
		config.baseURL = baseURL;
	}
	if (chunkSize !== UNDEFINED_TYPE) {
		config.chunkSize = chunkSize;
	}
	if (maxWorkers !== UNDEFINED_TYPE) {
		config.maxWorkers = maxWorkers;
	}
	if (terminateWorkerTimeout !== UNDEFINED_TYPE) {
		config.terminateWorkerTimeout = terminateWorkerTimeout;
	}
	if (useCompressionStream !== UNDEFINED_TYPE) {
		config.useCompressionStream = useCompressionStream;
	}
	if (useWebWorkers !== UNDEFINED_TYPE) {
		config.useWebWorkers = useWebWorkers;
	}
	if (Deflate !== UNDEFINED_TYPE) {
		config.Deflate = Deflate;
	}
	if (Inflate !== UNDEFINED_TYPE) {
		config.Inflate = Inflate;
	}
	if (workerScripts !== UNDEFINED_TYPE) {
		const { deflate, inflate } = workerScripts;
		if (deflate || inflate) {
			if (!config.workerScripts) {
				config.workerScripts = {};
			}
		}
		if (deflate) {
			if (!Array.isArray(deflate)) {
				throw new Error("workerScripts.deflate must be an array");
			}
			config.workerScripts.deflate = deflate;
		}
		if (inflate) {
			if (!Array.isArray(inflate)) {
				throw new Error("workerScripts.inflate must be an array");
			}
			config.workerScripts.inflate = inflate;
		}
	}
}
