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

/* globals navigator */

"use strict";

import {
	Reader,
	Writer,
	TextReader,
	TextWriter,
	Data64URIReader,
	Data64URIWriter,
	BlobReader,
	BlobWriter,
	HttpReader,
	HttpRangeReader,
	Uint8ArrayReader,
	Uint8ArrayWriter
} from "./stream.js";

import {
	ZipReader as BaseZipReader,
	ERR_BAD_FORMAT,
	ERR_EOCDR_NOT_FOUND,
	ERR_EOCDR_ZIP64_NOT_FOUND,
	ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND,
	ERR_CENTRAL_DIRECTORY_NOT_FOUND,
	ERR_LOCAL_FILE_HEADER_NOT_FOUND,
	ERR_EXTRA_FIELD_ZIP64_NOT_FOUND,
	ERR_ENCRYPTED,
	ERR_UNSUPPORTED_ENCRYPTION,
	ERR_UNSUPPORTED_COMPRESSION,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSORD
} from "./zip-reader.js";

import {
	ZipWriter as BaseZipWriter,
	ERR_DUPLICATED_NAME,
	ERR_INVALID_COMMENT,
	ERR_INVALID_ENTRY_COMMENT
} from "./zip-writer.js";

import {
	default as initShimAsyncCodec
} from "./util/stream-codec-shim.js";

const DEFAULT_CONFIGURATION = {
	chunkSize: 512 * 1024,
	maxWorkers: (typeof navigator != "undefined" && navigator.hardwareConcurrency) || 2,
	workerScriptsPath: undefined,
	useWebWorkers: true
};

let config = Object.assign({}, DEFAULT_CONFIGURATION);

class ZipReader extends BaseZipReader {

	constructor(reader, options) {
		super(reader, options, config);
	}
}

class ZipWriter extends BaseZipWriter {

	constructor(writer, options) {
		super(writer, options, config);
	}
}

export {
	configure,
	initShimAsyncCodec,
	getMimeType,
	ZipReader,
	ZipWriter,
	Reader,
	Writer,
	TextReader,
	TextWriter,
	Data64URIReader,
	Data64URIWriter,
	BlobReader,
	BlobWriter,
	HttpReader,
	HttpRangeReader,
	Uint8ArrayWriter,
	Uint8ArrayReader,
	ERR_BAD_FORMAT,
	ERR_EOCDR_NOT_FOUND,
	ERR_EOCDR_ZIP64_NOT_FOUND,
	ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND,
	ERR_CENTRAL_DIRECTORY_NOT_FOUND,
	ERR_LOCAL_FILE_HEADER_NOT_FOUND,
	ERR_EXTRA_FIELD_ZIP64_NOT_FOUND,
	ERR_ENCRYPTED,
	ERR_UNSUPPORTED_ENCRYPTION,
	ERR_UNSUPPORTED_COMPRESSION,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSORD,
	ERR_DUPLICATED_NAME,
	ERR_INVALID_COMMENT,
	ERR_INVALID_ENTRY_COMMENT
};

function configure(configuration) {
	config = Object.assign({}, config, configuration);
}

function getMimeType() {
	return "application/octet-stream";
}