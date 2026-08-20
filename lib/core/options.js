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

import {
	BOOLEAN_TYPE,
	FUNCTION_TYPE,
	STRING_TYPE,
	UNDEFINED_VALUE
} from "./constants.js";

const OPTION_FILENAME_ENCODING = "filenameEncoding";
const OPTION_COMMENT_ENCODING = "commentEncoding";
const OPTION_DECODE_TEXT = "decodeText";
const OPTION_EXTRACT_PREPENDED_DATA = "extractPrependedData";
const OPTION_EXTRACT_APPENDED_DATA = "extractAppendedData";
const OPTION_PASSWORD = "password";
const OPTION_RAW_PASSWORD = "rawPassword";
const OPTION_PASS_THROUGH = "passThrough";
const OPTION_SIGNAL = "signal";
const OPTION_CHECK_PASSWORD_ONLY = "checkPasswordOnly";
const OPTION_CHECK_OVERLAPPING_ENTRY_ONLY = "checkOverlappingEntryOnly";
const OPTION_CHECK_OVERLAPPING_ENTRY = "checkOverlappingEntry";
const OPTION_CHECK_AMBIGUITY = "checkAmbiguity";
const OPTION_CHECK_LOCAL_DIRECTORY = "checkLocalDirectory";
const OPTION_CHECK_SIGNATURE = "checkSignature";
const OPTION_CHECK_CRC32 = "checkCrc32";
const OPTION_CHECK_AUTHENTICATION_CODE = "checkAuthenticationCode";
const OPTION_USE_WEB_WORKERS = "useWebWorkers";
const OPTION_USE_COMPRESSION_STREAM = "useCompressionStream";
const OPTION_TRANSFER_STREAMS = "transferStreams";
const OPTION_PREVENT_CLOSE = "preventClose";
const OPTION_ENCRYPTION_STRENGTH = "encryptionStrength";
const OPTION_EXTENDED_TIMESTAMP = "extendedTimestamp";
const OPTION_NTFS_TIMESTAMP = "ntfsTimestamp";
const OPTION_KEEP_ORDER = "keepOrder";
const OPTION_LEVEL = "level";
const OPTION_BUFFERED_WRITE = "bufferedWrite";
const OPTION_CREATE_TEMP_STREAM = "createTempStream";
const OPTION_DATA_DESCRIPTOR_SIGNATURE = "dataDescriptorSignature";
const OPTION_USE_UNICODE_FILE_NAMES = "useUnicodeFileNames";
const OPTION_DATA_DESCRIPTOR = "dataDescriptor";
const OPTION_SUPPORT_ZIP64_SPLIT_FILE = "supportZip64SplitFile";
const OPTION_ENCODE_TEXT = "encodeText";
const OPTION_OFFSET = "offset";
const OPTION_USDZ = "usdz";
const OPTION_UNIX_EXTRA_FIELD_TYPE = "unixExtraFieldType";
const OPTION_LOCAL_EXTRA_FIELD = "localExtraField";
const OPTION_STRICTNESS = "strictness";
const OPTION_FILENAME_VALIDATION = "filenameValidation";
const OPTION_NORMALIZE_FILENAME = "normalizeFilename";
const OPTION_MAX_APPENDED_DATA_SIZE = "maxAppendedDataSize";
const OPTION_DECRYPT_CENTRAL_DIRECTORY = "decryptCentralDirectory";
const OPTION_SIGN_CENTRAL_DIRECTORY = "signCentralDirectory";
const TEXT_TYPE_FILENAME = "filename";
const TEXT_TYPE_COMMENT = "comment";
const STRICTNESS_STRICT = "strict";
const STRICTNESS_BALANCED = "balanced";
const STRICTNESS_TOLERANT = "tolerant";

const ERR_INVALID_FUNCTION_OPTION = "Invalid option (must be a function)";
const ERR_INVALID_SIGNAL = "Invalid signal (must be an AbortSignal instance)";
const ERR_INVALID_PASSWORD_TYPE = "Invalid password (password must be a string, rawPassword must be a Uint8Array)";

export {
	OPTION_FILENAME_ENCODING,
	OPTION_COMMENT_ENCODING,
	OPTION_DECODE_TEXT,
	OPTION_EXTRACT_PREPENDED_DATA,
	OPTION_EXTRACT_APPENDED_DATA,
	OPTION_PASSWORD,
	OPTION_RAW_PASSWORD,
	OPTION_PASS_THROUGH,
	OPTION_SIGNAL,
	OPTION_CHECK_PASSWORD_ONLY,
	OPTION_CHECK_OVERLAPPING_ENTRY_ONLY,
	OPTION_CHECK_OVERLAPPING_ENTRY,
	OPTION_CHECK_AMBIGUITY,
	OPTION_CHECK_LOCAL_DIRECTORY,
	OPTION_CHECK_SIGNATURE,
	OPTION_CHECK_CRC32,
	OPTION_CHECK_AUTHENTICATION_CODE,
	OPTION_USE_WEB_WORKERS,
	OPTION_USE_COMPRESSION_STREAM,
	OPTION_TRANSFER_STREAMS,
	OPTION_PREVENT_CLOSE,
	OPTION_ENCRYPTION_STRENGTH,
	OPTION_EXTENDED_TIMESTAMP,
	OPTION_NTFS_TIMESTAMP,
	OPTION_KEEP_ORDER,
	OPTION_LEVEL,
	OPTION_BUFFERED_WRITE,
	OPTION_CREATE_TEMP_STREAM,
	OPTION_DATA_DESCRIPTOR_SIGNATURE,
	OPTION_USE_UNICODE_FILE_NAMES,
	OPTION_DATA_DESCRIPTOR,
	OPTION_SUPPORT_ZIP64_SPLIT_FILE,
	OPTION_ENCODE_TEXT,
	OPTION_OFFSET,
	OPTION_USDZ,
	OPTION_UNIX_EXTRA_FIELD_TYPE,
	OPTION_LOCAL_EXTRA_FIELD,
	OPTION_STRICTNESS,
	OPTION_FILENAME_VALIDATION,
	OPTION_NORMALIZE_FILENAME,
	OPTION_MAX_APPENDED_DATA_SIZE,
	OPTION_DECRYPT_CENTRAL_DIRECTORY,
	OPTION_SIGN_CENTRAL_DIRECTORY,
	TEXT_TYPE_FILENAME,
	TEXT_TYPE_COMMENT,
	STRICTNESS_STRICT,
	STRICTNESS_BALANCED,
	STRICTNESS_TOLERANT,
	ERR_INVALID_FUNCTION_OPTION,
	ERR_INVALID_SIGNAL,
	ERR_INVALID_PASSWORD_TYPE,
	checkFunctionOption,
	checkSignalOption,
	checkPasswordOption,
	toNumber
};

function checkFunctionOption(value) {
	if (value && typeof value != FUNCTION_TYPE) {
		throw new Error(ERR_INVALID_FUNCTION_OPTION);
	}
	return value;
}

function checkSignalOption(signal) {
	if (signal && (typeof signal.addEventListener != FUNCTION_TYPE || typeof signal.aborted != BOOLEAN_TYPE)) {
		throw new Error(ERR_INVALID_SIGNAL);
	}
	return signal || UNDEFINED_VALUE;
}

function checkPasswordOption(password, rawPassword) {
	if ((password && typeof password != STRING_TYPE) || (rawPassword && !(rawPassword instanceof Uint8Array))) {
		throw new Error(ERR_INVALID_PASSWORD_TYPE);
	}
}

function toNumber(value) {
	return typeof value == STRING_TYPE && value.trim() ? Number(value) : value;
}