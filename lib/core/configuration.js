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
import {
	checkFunctionOption,
	toNumber
} from "./options.js";

const DEFAULT_CHUNK_SIZE = 64 * 1024;
const MINIMUM_CHUNK_SIZE = 64;
const MINIMUM_PROPERTY_VALUE = 1;
const ERR_INVALID_MAX_WORKERS = "Invalid maxWorkers (must be an integer greater than 0)";
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
	chunkSize: DEFAULT_CHUNK_SIZE,
	maxWorkers,
	terminateWorkerTimeout: 5000,
	workerStarvationTimeout: 5000,
	workerStartupTimeout: 5000,
	useWebWorkers: true,
	useCompressionStream: true,
	transferStreams: true,
	CompressionStream: typeof CompressionStream != UNDEFINED_TYPE && CompressionStream,
	DecompressionStream: typeof DecompressionStream != UNDEFINED_TYPE && DecompressionStream
};

const PROPERTY_NAME_MAX_WORKERS = "maxWorkers";

const STRING_PROPERTY_NAMES = [
	"baseURI",
	"wasmURI",
	"workerURI"
];
const BOOLEAN_PROPERTY_NAMES = [
	"useCompressionStream",
	"useWebWorkers",
	"transferStreams"
];
const NUMBER_PROPERTY_NAMES = [
	"chunkSize",
	PROPERTY_NAME_MAX_WORKERS,
	"terminateWorkerTimeout",
	"workerStarvationTimeout",
	"workerStartupTimeout"
];
const FUNCTION_PROPERTY_NAMES = [
	"createWorker",
	"CompressionStream",
	"DecompressionStream",
	"CompressionStreamFallback",
	"DecompressionStreamFallback"
];
const CONFIGURABLE_PROPERTY_NAMES = [
	...STRING_PROPERTY_NAMES,
	...BOOLEAN_PROPERTY_NAMES,
	...NUMBER_PROPERTY_NAMES,
	...FUNCTION_PROPERTY_NAMES
];

const config = { ...DEFAULT_CONFIGURATION };

export {
	configure,
	setDefaultConfiguration,
	resetConfiguration,
	getConfiguration,
	getChunkSize,
	normalizeChunkSize,
	ERR_INVALID_MAX_WORKERS
};

function getConfiguration() {
	return config;
}

function getChunkSize(config) {
	return normalizeChunkSize(config.chunkSize);
}

function normalizeChunkSize(chunkSize) {
	chunkSize = toNumber(chunkSize);
	return Number.isInteger(chunkSize) && chunkSize >= MINIMUM_PROPERTY_VALUE ? Math.max(chunkSize, MINIMUM_CHUNK_SIZE) : DEFAULT_CHUNK_SIZE;
}

function configure(configuration) {
	Object.assign(config, checkConfiguration(normalizeConfiguration(configuration)));
}

function checkConfiguration(configuration) {
	const checkedConfiguration = {};
	for (const propertyName of CONFIGURABLE_PROPERTY_NAMES) {
		const propertyValue = configuration[propertyName];
		if (propertyValue !== UNDEFINED_VALUE) {
			checkedConfiguration[propertyName] = checkPropertyValue(propertyName, propertyValue);
		}
	}
	return checkedConfiguration;
}

function checkPropertyValue(propertyName, propertyValue) {
	if (NUMBER_PROPERTY_NAMES.includes(propertyName)) {
		propertyValue = toNumber(propertyValue);
		if (propertyName == PROPERTY_NAME_MAX_WORKERS && (!Number.isInteger(propertyValue) || propertyValue < MINIMUM_PROPERTY_VALUE)) {
			throw new Error(ERR_INVALID_MAX_WORKERS);
		}
	} else if (FUNCTION_PROPERTY_NAMES.includes(propertyName)) {
		checkFunctionOption(propertyValue);
	}
	return propertyValue;
}

function normalizeConfiguration(configuration) {
	configuration = configuration || {};
	const { CompressionStreamZlib, DecompressionStreamZlib } = configuration;
	if (CompressionStreamZlib === UNDEFINED_VALUE && DecompressionStreamZlib === UNDEFINED_VALUE) {
		return configuration;
	}
	const normalizedConfiguration = Object.assign({}, configuration);
	if (normalizedConfiguration.CompressionStreamFallback === UNDEFINED_VALUE) {
		normalizedConfiguration.CompressionStreamFallback = CompressionStreamZlib;
	}
	if (normalizedConfiguration.DecompressionStreamFallback === UNDEFINED_VALUE) {
		normalizedConfiguration.DecompressionStreamFallback = DecompressionStreamZlib;
	}
	return normalizedConfiguration;
}

function setDefaultConfiguration(configuration) {
	const checkedConfiguration = checkConfiguration(normalizeConfiguration(configuration));
	Object.assign(DEFAULT_CONFIGURATION, checkedConfiguration);
	Object.assign(config, checkedConfiguration);
}

function resetConfiguration() {
	for (const propertyName of CONFIGURABLE_PROPERTY_NAMES) {
		delete config[propertyName];
	}
	Object.assign(config, DEFAULT_CONFIGURATION);
}
