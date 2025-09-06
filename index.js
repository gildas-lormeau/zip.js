/// <reference types="./index.d.ts" />

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

import { Deflate } from "./lib/core/streams/codecs/deflate.js";
import { Inflate } from "./lib/core/streams/codecs/inflate.js";
import { configure } from "./lib/core/configuration.js";
import { getMimeType } from "./lib/core/util/mime-type.js";
import { terminateWorkers } from "./lib/core/codec-pool.js";

configure({ Deflate, Inflate });

export {
	fs,
	configure,
	initShimAsyncCodec,
	ZipReader,
	ZipWriter,
	ZipReaderStream,
	ZipWriterStream,
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
	SplitZipReader,
	SplitZipWriter,
	SplitDataReader,
	SplitDataWriter,
	ERR_HTTP_RANGE,
	ERR_BAD_FORMAT,
	ERR_EOCDR_NOT_FOUND,
	ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND,
	ERR_CENTRAL_DIRECTORY_NOT_FOUND,
	ERR_LOCAL_FILE_HEADER_NOT_FOUND,
	ERR_EXTRAFIELD_ZIP64_NOT_FOUND,
	ERR_ENCRYPTED,
	ERR_UNSUPPORTED_ENCRYPTION,
	ERR_UNSUPPORTED_COMPRESSION,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_UNCOMPRESSED_SIZE,
	ERR_INVALID_PASSWORD,
	ERR_DUPLICATED_NAME,
	ERR_INVALID_COMMENT,
	ERR_INVALID_ENTRY_NAME,
	ERR_INVALID_ENTRY_COMMENT,
	ERR_INVALID_VERSION,
	ERR_INVALID_EXTRAFIELD_TYPE,
	ERR_INVALID_EXTRAFIELD_DATA,
	ERR_INVALID_ENCRYPTION_STRENGTH,
	ERR_UNSUPPORTED_FORMAT,
	ERR_UNDEFINED_UNCOMPRESSED_SIZE,
	ERR_ZIP_NOT_EMPTY,
	ERR_SPLIT_ZIP_FILE,
	ERR_OVERLAPPING_ENTRY,
	ERR_ITERATOR_COMPLETED_TOO_SOON,
	ERR_WRITER_NOT_INITIALIZED,
	// Security utilities
	extractSafely,
	extractMultipleSafely,
	validateEntriesForExtraction,
	createExtractionConfig,
	validateFilename,
	sanitizeFilename,
	hasPathTraversal,
	isAbsolutePath,
	VALIDATION_STRICT,
	VALIDATION_WARN,
	VALIDATION_NONE,
	ERR_UNSAFE_FILENAME,
	ERR_ABSOLUTE_PATH,
	ERR_PATH_TRAVERSAL,
	ERR_INVALID_CHARACTERS,
	ERR_FILENAME_TOO_LONG,
	ERR_EXTRACTION_OUTSIDE_TARGET
} from "./lib/zip-fs.js";
export { getMimeType, terminateWorkers };
