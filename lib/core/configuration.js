/*
 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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

const MINIMUM_CHUNK_SIZE = 64;
let maxWorkers = 2;
try {
	if (typeof navigator != UNDEFINED_TYPE && navigator.hardwareConcurrency) {
		maxWorkers = navigator.hardwareConcurrency;
	}
} catch {
	// ignored
}
const DEFAULT_CONFIGURATION = {
	workerURI: "./core/web-worker-wasm.js",
	wasmURI: "./core/streams/zlib-wasm/zlib-streams.wasm",
	chunkSize: 64 * 1024,
	maxWorkers,
	terminateWorkerTimeout: 5000,
	useWebWorkers: true,
	useCompressionStream: true,
	CompressionStream: typeof CompressionStream != UNDEFINED_TYPE && CompressionStream,
	DecompressionStream: typeof DecompressionStream != UNDEFINED_TYPE && DecompressionStream
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
		baseURI,
		chunkSize,
		maxWorkers,
		terminateWorkerTimeout,
		useCompressionStream,
		useWebWorkers,
		CompressionStream,
		DecompressionStream,
		CompressionStreamZlib,
		DecompressionStreamZlib,
		workerURI,
		wasmURI
	} = configuration;
	setIfDefined("baseURI", baseURI);
	setIfDefined("wasmURI", wasmURI);
	setIfDefined("workerURI", workerURI);
	setIfDefined("chunkSize", chunkSize);
	setIfDefined("maxWorkers", maxWorkers);
	setIfDefined("terminateWorkerTimeout", terminateWorkerTimeout);
	setIfDefined("useCompressionStream", useCompressionStream);
	setIfDefined("useWebWorkers", useWebWorkers);
	setIfDefined("CompressionStream", CompressionStream);
	setIfDefined("DecompressionStream", DecompressionStream);
	setIfDefined("CompressionStreamZlib", CompressionStreamZlib);
	setIfDefined("DecompressionStreamZlib", DecompressionStreamZlib);
}

function setIfDefined(propertyName, propertyValue) {
	if (propertyValue !== UNDEFINED_VALUE) {
		config[propertyName] = propertyValue;
	}
}
