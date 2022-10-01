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

/* global navigator, CompressionStream, DecompressionStream */

import {
	UNDEFINED_VALUE,
	UNDEFINED_TYPE
} from "./constants.js";
import { StreamAdapter } from "./streams/stream-adapter.js";

const MINIMUM_CHUNK_SIZE = 64;
let maxWorkers = 2;
try {
	if (typeof navigator != UNDEFINED_TYPE && navigator.hardwareConcurrency) {
		maxWorkers = navigator.hardwareConcurrency;
	}
} catch (_error) {
	// ignored
}
const DEFAULT_CONFIGURATION = {
	chunkSize: 512 * 1024,
	maxWorkers,
	terminateWorkerTimeout: 5000,
	useWebWorkers: true,
	useCompressionStream: true,
	workerScripts: UNDEFINED_VALUE,
	CompressionStreamNative: typeof CompressionStream != UNDEFINED_TYPE && CompressionStream,
	DecompressionStreamNative: typeof DecompressionStream != UNDEFINED_TYPE && DecompressionStream
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
		CompressionStream,
		DecompressionStream,
		workerScripts
	} = configuration;
	setIfDefined("baseURL", baseURL);
	setIfDefined("chunkSize", chunkSize);
	setIfDefined("maxWorkers", maxWorkers);
	setIfDefined("terminateWorkerTimeout", terminateWorkerTimeout);
	setIfDefined("useCompressionStream", useCompressionStream);
	setIfDefined("useWebWorkers", useWebWorkers);
	if (Deflate) {
		config.CompressionStream = new StreamAdapter(Deflate);
	}
	if (Inflate) {
		config.DecompressionStream = new StreamAdapter(Inflate);
	}
	setIfDefined("CompressionStream", CompressionStream);
	setIfDefined("DecompressionStream", DecompressionStream);
	if (workerScripts !== UNDEFINED_VALUE) {
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

function setIfDefined(propertyName, propertyValue) {
	if (propertyValue !== UNDEFINED_VALUE) {
		config[propertyName] = propertyValue;
	}
}
