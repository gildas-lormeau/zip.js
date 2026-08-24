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

/* global WritableStream, ReadableStream, TransformStream */
// deno-lint-ignore-file no-this-alias

import {
	MAX_32_BITS,
	MAX_16_BITS,
	MAX_8_BITS,
	COMPRESSION_METHOD_DEFLATE,
	COMPRESSION_METHOD_STORE,
	COMPRESSION_METHOD_AES,
	SPLIT_ZIP_FILE_SIGNATURE,
	TEMPORARY_SPLIT_ZIP_FILE_SIGNATURE,
	SPLIT_ZIP_FILE_SIGNATURE_LENGTH,
	DATA_DESCRIPTOR_RECORD_SIGNATURE,
	DATA_DESCRIPTOR_RECORD_LENGTH,
	DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH,
	DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH,
	LOCAL_FILE_HEADER_SIGNATURE,
	ARCHIVE_EXTRA_DATA_SIGNATURE,
	DIGITAL_SIGNATURE_RECORD_SIGNATURE,
	CENTRAL_FILE_HEADER_SIGNATURE,
	CENTRAL_FILE_HEADER_LENGTH,
	END_OF_CENTRAL_DIR_SIGNATURE,
	ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE,
	ZIP64_END_OF_CENTRAL_DIR_SIGNATURE,
	EXTRAFIELD_TYPE_ZIP64,
	EXTRAFIELD_TYPE_UNICODE_PATH,
	EXTRAFIELD_TYPE_UNICODE_COMMENT,
	EXTRAFIELD_TYPE_AES,
	EXTRAFIELD_TYPE_NTFS,
	EXTRAFIELD_TYPE_NTFS_TAG1,
	EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP,
	EXTRAFIELD_TYPE_INFOZIP,
	EXTRAFIELD_TYPE_UNIX,
	EXTRAFIELD_TYPE_UNIX_TYPE1,
	EXTRAFIELD_TYPE_PKWARE_UNIX,
	EXTRAFIELD_TYPE_USDZ,
	END_OF_CENTRAL_DIR_LENGTH,
	ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH,
	ZIP64_END_OF_CENTRAL_DIR_LENGTH,
	BITFLAG_ENCRYPTED,
	BITFLAG_STRONG_ENCRYPTION,
	BITFLAG_COMPRESSED_PATCHED_DATA,
	BITFLAG_MASKED_LOCAL_HEADERS,
	BITFLAG_LEVEL,
	BITFLAG_DATA_DESCRIPTOR,
	BITFLAG_LANG_ENCODING_FLAG,
	FILE_ATTR_MSDOS_DIR_MASK,
	FILE_ATTR_MSDOS_READONLY_MASK,
	FILE_ATTR_MSDOS_HIDDEN_MASK,
	FILE_ATTR_MSDOS_SYSTEM_MASK,
	FILE_ATTR_MSDOS_ARCHIVE_MASK,
	FILE_ATTR_UNIX_TYPE_MASK,
	FILE_ATTR_UNIX_TYPE_DIR,
	FILE_ATTR_UNIX_TYPE_SYMLINK,
	FILE_ATTR_UNIX_EXECUTABLE_MASK,
	FILE_ATTR_UNIX_DEFAULT_MASK,
	DIRECTORY_SIGNATURE,
	HEADER_SIZE,
	HEADER_OFFSET_SIGNATURE,
	HEADER_OFFSET_COMPRESSED_SIZE,
	HEADER_OFFSET_UNCOMPRESSED_SIZE,
	UNDEFINED_VALUE,
	COMPRESSION_METHOD_DEFLATE_64,
	FILE_ATTR_UNIX_SETUID_MASK,
	FILE_ATTR_UNIX_SETGID_MASK,
	FILE_ATTR_UNIX_STICKY_MASK,
	NUMBER_TYPE,
	EMPTY_UINT8_ARRAY,
	MIN_DATE
} from "./constants.js";
import { getConfiguration } from "./configuration.js";
import { getRegisteredCodec } from "./codec-registry.js";
import {
	runWorker,
	CODEC_INFLATE,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_CRC32,
	ERR_INVALID_AUTHENTICATION_CODE,
	ERR_INVALID_PASSWORD,
	ERR_INVALID_UNCOMPRESSED_SIZE,
	ERR_INVALID_COMPRESSED_DATA,
	ERR_ABORT_CHECK_PASSWORD,
	ERR_WORKER_STARTUP_TIMEOUT
} from "./codec-pool.js";
import {
	initStream,
	readUint8Array,
	BlobReader,
	GenericReader,
	GenericWriter,
	ownsWritable
} from "./io.js";
import { decodeText } from "./util/decode-text.js";
import { getDataView } from "./util/array.js";
import { toCompatibleReadable, streamToBlob } from "./util/compatible-streams.js";
import { Crc32 } from "./streams/codecs/crc32.js";
import {
	PROPERTY_NAME_RAW_FILENAME,
	PROPERTY_NAME_FILENAME,
	PROPERTY_NAME_RAW_COMMENT,
	PROPERTY_NAME_COMMENT,
	PROPERTY_NAME_UNCOMPRESSED_SIZE,
	PROPERTY_NAME_COMPRESSED_SIZE,
	PROPERTY_NAME_OFFSET,
	PROPERTY_NAME_DISK_NUMBER_START,
	PROPERTY_NAME_LAST_MODIFICATION_DATE,
	PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE,
	PROPERTY_NAME_LAST_ACCESS_DATE,
	PROPERTY_NAME_RAW_LAST_ACCESS_DATE,
	PROPERTY_NAME_CREATION_DATE,
	PROPERTY_NAME_RAW_CREATION_DATE,
	Entry
} from "./zip-entry.js";
import {
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
	OPTION_STRICTNESS,
	OPTION_FILENAME_VALIDATION,
	OPTION_NORMALIZE_FILENAME,
	OPTION_MAX_APPENDED_DATA_SIZE,
	OPTION_DECRYPT_CENTRAL_DIRECTORY,
	TEXT_TYPE_FILENAME,
	TEXT_TYPE_COMMENT,
	STRICTNESS_STRICT,
	STRICTNESS_BALANCED,
	STRICTNESS_TOLERANT,
	OPTION_USE_WEB_WORKERS,
	OPTION_USE_COMPRESSION_STREAM,
	OPTION_TRANSFER_STREAMS,
	OPTION_PREVENT_CLOSE,
	checkFunctionOption,
	checkSignalOption,
	checkPasswordOption,
	toNumber
} from "./options.js";

const ERR_BAD_FORMAT = "File format is not recognized";
const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
const ERR_ENCRYPTED = "File contains encrypted entry";
const ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
const ERR_SPLIT_ZIP_FILE = "Split zip file";
const ERR_OVERLAPPING_ENTRY = "Overlapping entry found";
const ERR_ENTRY_DATA_OUT_OF_BOUNDS = "Entry data out of bounds";
const ERR_AMBIGUOUS_ARCHIVE = "Ambiguous archive";
const ERR_ENCRYPTED_CENTRAL_DIRECTORY = "Encrypted central directory is not supported";
const ERR_UNSAFE_FILENAME = "Unsafe filename";
const ERR_INVALID_STRICTNESS = "Invalid strictness (must be 'strict', 'balanced' or 'tolerant')";
const ERR_INVALID_FILENAME_VALIDATION = "Invalid filenameValidation (must be 'strict', 'balanced' or 'tolerant')";
const ERR_INVALID_MAX_APPENDED_DATA_SIZE = "Invalid maxAppendedDataSize (must be a number greater than or equal to 0)";
const ERR_UNSUPPORTED_UINT64 = "64-bit value exceeds Number.MAX_SAFE_INTEGER";
const WARNING_UNSORTED_CENTRAL_DIRECTORY = "unsorted central directory";
const WARNING_UNKNOWN_VERSION = "unknown version needed to extract";
const WARNING_COMPRESSED_PATCHED_DATA = "compressed patched data";
const WARNING_MALFORMED_EXTRA_FIELD = "malformed extra field";
const WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA = "unknown zip64 extensible data";
const WARNING_WRAPPED_ENTRIES_COUNT = "wrapped entries count";
const WARNING_APPENDED_DATA = "appended data";
const WARNING_PREPENDED_DATA = "prepended data";
const WARNING_TRAILING_CENTRAL_DIRECTORY_DATA = "trailing central directory data";
const WARNING_DUPLICATE_FILENAME = "duplicate filename";
const WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY = "mismatched zip64 end of central directory record";
const WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG = "mismatched local file header (general purpose bit flag)";
const WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD = "mismatched local file header (compression method)";
const WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES = "mismatched local file header (crc32 or sizes)";
const MAX_KNOWN_VERSION = 63;
const DRIVE_LETTER_REGEXP = /^[a-zA-Z]:/;
const CHARSET_UTF8 = "utf-8";
const PROPERTY_NAME_UTF8_SUFFIX = "UTF8";
const CHARSET_CP437 = "cp437";
const BITFLAG_AMBIGUITY_MASK = BITFLAG_ENCRYPTED | BITFLAG_DATA_DESCRIPTOR | BITFLAG_LANG_ENCODING_FLAG;
const VENDOR_VERSION_AE_1 = 1;
const ZIP64_PROPERTIES = [
	[PROPERTY_NAME_UNCOMPRESSED_SIZE, MAX_32_BITS],
	[PROPERTY_NAME_COMPRESSED_SIZE, MAX_32_BITS],
	[PROPERTY_NAME_OFFSET, MAX_32_BITS],
	[PROPERTY_NAME_DISK_NUMBER_START, MAX_16_BITS]
];
const ZIP64_EXTRACTION = {
	[MAX_16_BITS]: {
		getValue: getUint32,
		bytes: 4
	},
	[MAX_32_BITS]: {
		getValue: getBigUint64,
		bytes: 8
	}
};
const MAX_SAFE_UINT64 = BigInt(Number.MAX_SAFE_INTEGER);
const MAX_END_OF_CENTRAL_DIR_PROBES = 64;
const MAX_DEFLATE_EXPANSION_RATIO = 1032;
const CENTRAL_DIRECTORY_UNREACHABLE = 0;
const CENTRAL_DIRECTORY_PLAUSIBLE = 1;
const CENTRAL_DIRECTORY_REACHABLE = 2;

class ZipReader {

	constructor(reader, options = {}) {
		Object.assign(this, {
			reader: new GenericReader(reader),
			options,
			readRanges: new Map()
		});
	}

	async* getEntriesGenerator(options = {}) {
		const zipReader = this;
		let { reader } = zipReader;
		await initStream(reader);
		if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
			reader = new BlobReader(await streamToBlob(reader.readable));
			await initStream(reader);
		}
		if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
			throw new Error(ERR_BAD_FORMAT);
		}
		const warnings = zipReader.warnings = [];
		const strictness = getStrictness(options, zipReader.options);
		const checkAmbiguity = strictness == STRICTNESS_STRICT;
		const rejectAmbiguousEndOfDirectory = strictness != STRICTNESS_TOLERANT;
		const maxAppendedDataSize = getMaxAppendedDataSize(getOptionValue(zipReader, options, OPTION_MAX_APPENDED_DATA_SIZE), strictness);
		const filenameValidation = getFilenameValidation(getOptionValue(zipReader, options, OPTION_FILENAME_VALIDATION), strictness);
		const normalizeFilename = getOptionValue(zipReader, options, OPTION_NORMALIZE_FILENAME);
		const { endOfDirectoryInfo, endOfDirectoryReachingEndCount } = await findEndOfCentralDirectory(reader, rejectAmbiguousEndOfDirectory, maxAppendedDataSize);
		if (!endOfDirectoryInfo) {
			if (await startsWithSplitZipSignature(reader)) {
				throw new Error(ERR_SPLIT_ZIP_FILE);
			} else {
				throw new Error(ERR_EOCDR_NOT_FOUND);
			}
		}
		if (rejectAmbiguousEndOfDirectory && endOfDirectoryReachingEndCount > 1) {
			throwAmbiguousArchive("multiple end of central directory records");
		}
		const endOfDirectoryView = getDataView(endOfDirectoryInfo);
		let directoryDataLength = getUint32(endOfDirectoryView, 12);
		let directoryDataOffset = getUint32(endOfDirectoryView, 16);
		const commentOffset = endOfDirectoryInfo.offset;
		const commentLength = getUint16(endOfDirectoryView, 20);
		const appendedDataOffset = commentOffset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
		const appendedDataLength = reader.size - appendedDataOffset;
		if (appendedDataLength > maxAppendedDataSize) {
			throwAmbiguousArchive(WARNING_APPENDED_DATA);
		}
		if (appendedDataLength > 0) {
			addWarning(warnings, WARNING_APPENDED_DATA);
		}
		let lastDiskNumber = getUint16(endOfDirectoryView, 4);
		const expectedLastDiskNumber = reader.lastDiskNumber || 0;
		let diskNumber = getUint16(endOfDirectoryView, 6);
		let filesLength = getUint16(endOfDirectoryView, 10);
		let prependedDataLength = 0;
		let startOffset;
		let zip64EndOfDirectory;
		let zip64EndOfDirectoryVersion2;
		let zip64EndOfDirectoryLength = ZIP64_END_OF_CENTRAL_DIR_LENGTH;
		let directoryEncryptionInfo;
		const requiresZip64 = directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS || diskNumber == MAX_16_BITS;
		if (directoryDataOffset != MAX_32_BITS && diskNumber != MAX_16_BITS) {
			directoryDataOffset += getDiskOffset(reader, diskNumber);
		}
		if (requiresZip64) {
			const endOfDirectoryLocatorArray = endOfDirectoryInfo.offset >= ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH ?
				await readUint8Array(reader, endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH) :
				EMPTY_UINT8_ARRAY;
			const endOfDirectoryLocatorView = getDataView(endOfDirectoryLocatorArray);
			if (endOfDirectoryLocatorArray.length == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH &&
				getUint32(endOfDirectoryLocatorView, 0) == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
				directoryDataOffset = getDiskOffset(reader, getUint32(endOfDirectoryLocatorView, 4)) + getBigUint64(endOfDirectoryLocatorView, 8);
				let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
				let endOfDirectoryView = getDataView(endOfDirectoryArray);
				const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
				if ((endOfDirectoryArray.length < ZIP64_END_OF_CENTRAL_DIR_LENGTH || getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) &&
					directoryDataOffset != expectedDirectoryDataOffset && expectedDirectoryDataOffset >= 0) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = expectedDirectoryDataOffset;
					if (directoryDataOffset > originalDirectoryDataOffset) {
						prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
					}
					endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
					endOfDirectoryView = getDataView(endOfDirectoryArray);
				}
				if (endOfDirectoryArray.length < ZIP64_END_OF_CENTRAL_DIR_LENGTH || getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
					throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
				}
				zip64EndOfDirectory = true;
				zip64EndOfDirectoryVersion2 = getBigUint64(endOfDirectoryView, 4) > ZIP64_END_OF_CENTRAL_DIR_LENGTH - 12;
				if (zip64EndOfDirectoryVersion2) {
					const extensibleDataLength = Math.min(
						getBigUint64(endOfDirectoryView, 4) - (ZIP64_END_OF_CENTRAL_DIR_LENGTH - 12),
						reader.size - directoryDataOffset - ZIP64_END_OF_CENTRAL_DIR_LENGTH);
					if (extensibleDataLength > 0) {
						zip64EndOfDirectoryLength += extensibleDataLength;
						const rawExtensibleData = await readUint8Array(reader, directoryDataOffset + ZIP64_END_OF_CENTRAL_DIR_LENGTH, extensibleDataLength);
						directoryEncryptionInfo = getDirectoryEncryptionInfo(rawExtensibleData);
					}
				}
				if (lastDiskNumber == MAX_16_BITS) {
					lastDiskNumber = getUint32(endOfDirectoryView, 16);
				} else if (lastDiskNumber != getUint32(endOfDirectoryView, 16)) {
					reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
				}
				if (diskNumber == MAX_16_BITS) {
					diskNumber = getUint32(endOfDirectoryView, 20);
				} else if (diskNumber != getUint32(endOfDirectoryView, 20)) {
					reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
				}
				if (filesLength == MAX_16_BITS) {
					filesLength = getBigUint64(endOfDirectoryView, 32);
				} else if (filesLength != getBigUint64(endOfDirectoryView, 32)) {
					reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
				}
				if (directoryDataLength == MAX_32_BITS) {
					directoryDataLength = getBigUint64(endOfDirectoryView, 40);
				} else if (directoryDataLength != getBigUint64(endOfDirectoryView, 40)) {
					reportAmbiguity(checkAmbiguity, warnings, WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY);
				}
				directoryDataOffset = getDiskOffset(reader, diskNumber) + getBigUint64(endOfDirectoryView, 48) + prependedDataLength;
			}
		}
		let declaredDirectoryDataLength = directoryDataLength;
		const centralDirectoryEndOffset = endOfDirectoryInfo.offset -
			(zip64EndOfDirectory ? zip64EndOfDirectoryLength + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH : 0);
		if (directoryDataOffset >= reader.size) {
			prependedDataLength = reader.size - directoryDataOffset - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
			directoryDataOffset = reader.size - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
		}
		if (expectedLastDiskNumber != lastDiskNumber) {
			throw new Error(ERR_SPLIT_ZIP_FILE);
		}
		if (directoryDataOffset < 0) {
			throw new Error(ERR_BAD_FORMAT);
		}
		let offset = 0;
		let directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
		let directoryView = getDataView(directoryArray);
		if (directoryDataLength) {
			if (directoryArray.length < 4) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const expectedDirectoryDataOffset = centralDirectoryEndOffset - directoryDataLength;
			if (directoryDataOffset != expectedDirectoryDataOffset && diskNumber == lastDiskNumber) {
				const storedPointsAtDirectory = getUint32(directoryView, offset) == CENTRAL_FILE_HEADER_SIGNATURE ||
					Boolean(directoryEncryptionInfo && directoryEncryptionInfo.compressedSize) ||
					detectEncryptedCentralDirectory(directoryView);
				let reconcile = !storedPointsAtDirectory;
				if (!reconcile && expectedDirectoryDataOffset >= 0 && expectedDirectoryDataOffset + 4 <= reader.size) {
					const expectedSignatureArray = await readUint8Array(reader, expectedDirectoryDataOffset, 4);
					reconcile = getUint32(getDataView(expectedSignatureArray), 0) == CENTRAL_FILE_HEADER_SIGNATURE;
				}
				if (reconcile) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = expectedDirectoryDataOffset;
					if (directoryDataOffset > originalDirectoryDataOffset) {
						prependedDataLength += directoryDataOffset - originalDirectoryDataOffset;
					}
					directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
					directoryView = getDataView(directoryArray);
				}
			}
		}
		const expectedDirectoryDataLength = centralDirectoryEndOffset - directoryDataOffset;
		if (directoryDataLength != expectedDirectoryDataLength && expectedDirectoryDataLength >= 0 && diskNumber == lastDiskNumber) {
			directoryDataLength = expectedDirectoryDataLength;
			directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
			directoryView = getDataView(directoryArray);
		}
		if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
			throw new Error(ERR_BAD_FORMAT);
		}
		zipReader.directoryOffset = directoryDataOffset;
		zipReader.directoryLength = declaredDirectoryDataLength;
		const decryptCentralDirectory = getFunctionOptionValue(zipReader, options, OPTION_DECRYPT_CENTRAL_DIRECTORY);
		let decryptedDirectory, dataAfterEncryptedDirectory;
		if (decryptCentralDirectory && filesLength && directoryArray.length >= 4 &&
			getUint32(directoryView, 0) != CENTRAL_FILE_HEADER_SIGNATURE &&
			(zip64EndOfDirectoryVersion2 || detectEncryptedCentralDirectory(directoryView))) {
			const encryptedDirectoryDataLength = getEncryptedDirectoryDataLength(directoryEncryptionInfo, declaredDirectoryDataLength, directoryArray.length);
			dataAfterEncryptedDirectory = directoryArray.subarray(encryptedDirectoryDataLength);
			directoryArray = await decryptCentralDirectory(directoryArray.subarray(0, encryptedDirectoryDataLength), directoryEncryptionInfo);
			directoryView = getDataView(directoryArray);
			declaredDirectoryDataLength = directoryArray.length;
			decryptedDirectory = true;
		}
		if (directoryEncryptionInfo && !decryptedDirectory &&
			(directoryArray.length < 4 || getUint32(directoryView, 0) == CENTRAL_FILE_HEADER_SIGNATURE)) {
			addWarning(warnings, WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA);
		}
		startOffset = directoryDataOffset;
		const filenameEncoding = getOptionValue(zipReader, options, OPTION_FILENAME_ENCODING);
		const commentEncoding = getOptionValue(zipReader, options, OPTION_COMMENT_ENCODING);
		const filenames = new Set();
		let duplicateFilename;
		let previousEntryPosition = -1;
		const recoverWrappedFilesLength = !checkAmbiguity && !zip64EndOfDirectory;
		if (!filesLength && recoverWrappedFilesLength) {
			filesLength = getWrappedFilesLength(directoryView, directoryArray, offset);
			if (filesLength) {
				addWarning(warnings, WARNING_WRAPPED_ENTRIES_COUNT);
			}
		}
		for (let indexFile = 0; indexFile < filesLength; indexFile++) {
			const fileEntry = new ZipEntry(reader, zipReader.options);
			if (offset + CENTRAL_FILE_HEADER_LENGTH > directoryArray.length || getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
				if (indexFile == 0 && !decryptedDirectory && (zip64EndOfDirectoryVersion2 || detectEncryptedCentralDirectory(directoryView))) {
					throw new Error(ERR_ENCRYPTED_CENTRAL_DIRECTORY);
				}
				throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
			}
			readCommonHeader(fileEntry, directoryView, offset + 6);
			const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
			const filenameOffset = offset + CENTRAL_FILE_HEADER_LENGTH;
			const extraFieldOffset = filenameOffset + fileEntry.filenameLength;
			const commentOffset = extraFieldOffset + fileEntry.extraFieldLength;
			const versionMadeBy = getUint16(directoryView, offset + 4);
			const msDosCompatible = versionMadeBy >> 8 == 0;
			const unixCompatible = versionMadeBy >> 8 == 3;
			const rawFilename = directoryArray.subarray(filenameOffset, extraFieldOffset);
			const commentLength = getUint16(directoryView, offset + 32);
			const endOffset = commentOffset + commentLength;
			const rawComment = directoryArray.subarray(commentOffset, endOffset);
			const filenameUTF8 = languageEncodingFlag;
			const commentUTF8 = languageEncodingFlag;
			const externalFileAttributes = getUint32(directoryView, offset + 38);
			const msdosAttributesRaw = externalFileAttributes & MAX_8_BITS;
			const msdosAttributes = {
				readOnly: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_READONLY_MASK),
				hidden: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_HIDDEN_MASK),
				system: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_SYSTEM_MASK),
				directory: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_DIR_MASK),
				archive: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_ARCHIVE_MASK)
			};
			const offsetFileEntry = getUint32(directoryView, offset + 42);
			const decode = getFunctionOptionValue(zipReader, options, OPTION_DECODE_TEXT) || decodeText;
			const rawFilenameEncoding = filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437;
			const rawCommentEncoding = commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437;
			let filename = decode(rawFilename, rawFilenameEncoding, TEXT_TYPE_FILENAME);
			if (filename === UNDEFINED_VALUE) {
				filename = decodeText(rawFilename, rawFilenameEncoding);
			}
			if (normalizeFilename) {
				const normalizedFilename = normalizeFilename(filename);
				if (normalizedFilename !== UNDEFINED_VALUE) {
					filename = normalizedFilename;
				}
			}
			if (isUnsafeFilename(filename, filenameValidation)) {
				const error = new Error(ERR_UNSAFE_FILENAME);
				error.filename = filename;
				throw error;
			}
			let comment = decode(rawComment, rawCommentEncoding, TEXT_TYPE_COMMENT);
			if (comment === UNDEFINED_VALUE) {
				comment = decodeText(rawComment, rawCommentEncoding);
			}
			Object.assign(fileEntry, {
				index: indexFile,
				decryptedDirectory,
				versionMadeBy,
				msDosCompatible,
				zip64: false,
				compressedSize: 0,
				uncompressedSize: 0,
				commentLength,
				offset: offsetFileEntry,
				diskNumberStart: getUint16(directoryView, offset + 34),
				internalFileAttributes: getUint16(directoryView, offset + 36),
				externalFileAttributes,
				msdosAttributesRaw,
				msdosAttributes,
				rawFilename,
				filenameUTF8,
				commentUTF8,
				rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset),
				rawComment,
				filename,
				comment
			});
			if (readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6)) {
				addWarning(warnings, WARNING_MALFORMED_EXTRA_FIELD, filename);
			}
			fileEntry.offset += prependedDataLength;
			const entryPosition = getDiskOffset(reader, fileEntry.diskNumberStart) + fileEntry.offset;
			startOffset = Math.min(entryPosition, startOffset);
			if (entryPosition < previousEntryPosition) {
				addWarning(warnings, WARNING_UNSORTED_CENTRAL_DIRECTORY, filename);
			}
			previousEntryPosition = entryPosition;
			if ((fileEntry.version & MAX_8_BITS) > MAX_KNOWN_VERSION) {
				addWarning(warnings, WARNING_UNKNOWN_VERSION, filename);
			}
			if ((fileEntry.rawBitFlag & BITFLAG_COMPRESSED_PATCHED_DATA) == BITFLAG_COMPRESSED_PATCHED_DATA) {
				addWarning(warnings, WARNING_COMPRESSED_PATCHED_DATA, filename);
			}
			if (filenames.has(fileEntry.filename)) {
				duplicateFilename = true;
			}
			filenames.add(fileEntry.filename);
			const unixExternalUpper = (fileEntry.externalFileAttributes >> 16) & MAX_16_BITS;
			if (fileEntry.unixMode === UNDEFINED_VALUE && (unixExternalUpper & (FILE_ATTR_UNIX_DEFAULT_MASK | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_TYPE_DIR)) != 0) {
				fileEntry.unixMode = unixExternalUpper;
			}
			const setuid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETUID_MASK);
			const setgid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETGID_MASK);
			const sticky = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_STICKY_MASK);
			const unixType = fileEntry.unixMode === UNDEFINED_VALUE ? unixExternalUpper : fileEntry.unixMode;
			const symlink = (unixType & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_SYMLINK;
			const executable = !symlink && ((fileEntry.unixMode !== UNDEFINED_VALUE)
				? ((fileEntry.unixMode & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0)
				: (unixCompatible && ((unixExternalUpper & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0)));
			const modeIsDir = fileEntry.unixMode !== UNDEFINED_VALUE && ((fileEntry.unixMode & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR);
			const upperIsDir = ((unixExternalUpper & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR);
			Object.assign(fileEntry, {
				setuid,
				setgid,
				sticky,
				symlink,
				unixExternalUpper,
				internalFileAttribute: fileEntry.internalFileAttributes,
				externalFileAttribute: fileEntry.externalFileAttributes,
				executable,
				directory: modeIsDir || upperIsDir || (msDosCompatible && msdosAttributes.directory) || fileEntry.filename.endsWith(DIRECTORY_SIGNATURE),
				zipCrypto: fileEntry.encrypted && !fileEntry.extraFieldAES
			});
			const entry = new Entry(fileEntry);
			entry.getData = (writer, options) => fileEntry.getData(writer, entry, zipReader.readRanges, options);
			entry.arrayBuffer = async options => {
				const writer = new TransformStream();
				const arrayBufferPromise = streamToBlob(writer.readable).then(blob => blob.arrayBuffer());
				arrayBufferPromise.catch(() => { });
				await fileEntry.getData(writer, entry, zipReader.readRanges, options);
				return arrayBufferPromise;
			};
			offset = endOffset;
			if (indexFile == filesLength - 1 && recoverWrappedFilesLength) {
				const wrappedFilesLength = getWrappedFilesLength(directoryView, directoryArray, offset);
				if (wrappedFilesLength) {
					filesLength += wrappedFilesLength;
					addWarning(warnings, WARNING_WRAPPED_ENTRIES_COUNT);
				}
			}
			const { onprogress } = options;
			if (onprogress) {
				try {
					await onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
				} catch {
					// ignored
				}
			}
			yield entry;
		}
		let offsetAfterSignature = offset;
		let digitalSignature = readDigitalSignature(directoryArray.subarray(offset)) ||
			(decryptedDirectory ? readDigitalSignature(dataAfterEncryptedDirectory) : UNDEFINED_VALUE);
		if (!digitalSignature && !decryptedDirectory) {
			const signatureRecordOffset = directoryDataOffset + offset;
			const signatureRecordLength = Math.min(centralDirectoryEndOffset - signatureRecordOffset, 6 + MAX_16_BITS);
			if (signatureRecordLength >= 6) {
				digitalSignature = readDigitalSignature(await readUint8Array(reader, signatureRecordOffset, signatureRecordLength));
			}
		}
		if (digitalSignature) {
			zipReader.digitalSignature = digitalSignature;
			offsetAfterSignature = offset + 6 + digitalSignature.length;
		}
		if ((offset != declaredDirectoryDataLength && offsetAfterSignature != declaredDirectoryDataLength) ||
			(!decryptedDirectory && offset != directoryDataLength && offsetAfterSignature != directoryDataLength)) {
			reportAmbiguity(checkAmbiguity, warnings, WARNING_TRAILING_CENTRAL_DIRECTORY_DATA);
		}
		if (duplicateFilename) {
			reportAmbiguity(checkAmbiguity, warnings, WARNING_DUPLICATE_FILENAME);
		}
		const extractPrependedData = getOptionValue(zipReader, options, OPTION_EXTRACT_PREPENDED_DATA);
		const extractAppendedData = getOptionValue(zipReader, options, OPTION_EXTRACT_APPENDED_DATA);
		const splitZipSignatureLength = (checkAmbiguity || extractPrependedData) && filesLength &&
			startOffset == SPLIT_ZIP_FILE_SIGNATURE_LENGTH && await startsWithSplitZipMarker(reader) ? SPLIT_ZIP_FILE_SIGNATURE_LENGTH : 0;
		if (checkAmbiguity && (prependedDataLength || (filesLength && startOffset > splitZipSignatureLength))) {
			throwAmbiguousArchive(WARNING_PREPENDED_DATA);
		}
		if (prependedDataLength || (filesLength && startOffset > SPLIT_ZIP_FILE_SIGNATURE_LENGTH)) {
			addWarning(warnings, WARNING_PREPENDED_DATA);
		}
		if (extractPrependedData) {
			zipReader.prependedData = startOffset > splitZipSignatureLength ?
				await readUint8Array(reader, splitZipSignatureLength, startOffset - splitZipSignatureLength) :
				EMPTY_UINT8_ARRAY;
		}
		zipReader.comment = commentLength ? await readUint8Array(reader, commentOffset + END_OF_CENTRAL_DIR_LENGTH, commentLength) : EMPTY_UINT8_ARRAY;
		if (extractAppendedData) {
			zipReader.appendedData = appendedDataOffset < reader.size ? await readUint8Array(reader, appendedDataOffset, reader.size - appendedDataOffset) : EMPTY_UINT8_ARRAY;
		}
		return true;
	}

	async getEntries(options = {}) {
		const entries = [];
		for await (const entry of this.getEntriesGenerator(options)) {
			entries.push(entry);
		}
		return entries;
	}

	async close() {
		const { reader } = this;
		if (!reader.readUint8Array && reader.readable && !reader.readable.locked) {
			await reader.readable.cancel();
		}
	}
}

class ZipReaderStream {

	constructor(options = {}) {
		const { readable, writable } = new TransformStream();
		const gen = new ZipReader(readable, options).getEntriesGenerator();
		this.readable = new ReadableStream({
			async pull(controller) {
				const { done, value } = await gen.next();
				if (done)
					return controller.close();
				const chunk = {
					...value,
					readable: (function () {
						const { readable, writable } = new TransformStream();
						if (value.getData) {
							getData();
							return readable;
						}

						async function getData() {
							try {
								await value.getData(writable);
							} catch (error) {
								try {
									await writable.abort(error);
								} catch {
									// ignored
								}
							}
						}
					})()
				};
				delete chunk.getData;
				controller.enqueue(chunk);
			}
		});
		this.writable = writable;
	}
}

async function isZipFile(reader, options = {}) {
	reader = new GenericReader(reader);
	await initStream(reader);
	if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
		reader = new BlobReader(await streamToBlob(reader.readable));
		await initStream(reader);
	}
	if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
		return false;
	}
	const strictness = getStrictness(options, {});
	const rejectAmbiguousEndOfDirectory = strictness != STRICTNESS_TOLERANT;
	const maxAppendedDataSize = getMaxAppendedDataSize(options[OPTION_MAX_APPENDED_DATA_SIZE], strictness);
	const { endOfDirectoryInfo, endOfDirectoryReachingEndCount } = await findEndOfCentralDirectory(reader, rejectAmbiguousEndOfDirectory, maxAppendedDataSize);
	if (!endOfDirectoryInfo || (strictness == STRICTNESS_STRICT && endOfDirectoryReachingEndCount > 1)) {
		return false;
	}
	const commentLength = getUint16(getDataView(endOfDirectoryInfo), 20);
	const appendedDataOffset = endOfDirectoryInfo.offset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
	return reader.size - appendedDataOffset <= maxAppendedDataSize;
}

export {
	ZipReader,
	isZipFile,
	ZipReaderStream,
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
	ERR_INVALID_CRC32,
	ERR_INVALID_AUTHENTICATION_CODE,
	ERR_INVALID_PASSWORD,
	ERR_INVALID_UNCOMPRESSED_SIZE,
	ERR_INVALID_COMPRESSED_DATA,
	ERR_SPLIT_ZIP_FILE,
	ERR_OVERLAPPING_ENTRY,
	ERR_ENTRY_DATA_OUT_OF_BOUNDS,
	ERR_AMBIGUOUS_ARCHIVE,
	ERR_ENCRYPTED_CENTRAL_DIRECTORY,
	ERR_UNSAFE_FILENAME,
	ERR_INVALID_STRICTNESS,
	ERR_INVALID_FILENAME_VALIDATION,
	ERR_INVALID_MAX_APPENDED_DATA_SIZE,
	ERR_UNSUPPORTED_UINT64,
	ERR_WORKER_STARTUP_TIMEOUT,
	WARNING_UNSORTED_CENTRAL_DIRECTORY,
	WARNING_UNKNOWN_VERSION,
	WARNING_COMPRESSED_PATCHED_DATA,
	WARNING_MALFORMED_EXTRA_FIELD,
	WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA,
	WARNING_WRAPPED_ENTRIES_COUNT,
	WARNING_APPENDED_DATA,
	WARNING_PREPENDED_DATA,
	WARNING_TRAILING_CENTRAL_DIRECTORY_DATA,
	WARNING_DUPLICATE_FILENAME,
	WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY,
	WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG,
	WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD,
	WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES
};

class ZipEntry {

	constructor(reader, options) {
		Object.assign(this, {
			reader,
			options
		});
	}

	async getData(writer, fileEntry, readRanges, options = {}) {
		const zipEntry = this;
		const config = getConfiguration();
		const {
			reader,
			index,
			offset,
			diskNumberStart,
			extraFieldAES,
			extraFieldZip64,
			compressionMethod,
			bitFlag,
			rawBitFlag,
			crc32,
			rawLastModDate,
			uncompressedSize,
			compressedSize
		} = zipEntry;
		const {
			dataDescriptor
		} = bitFlag;
		const localDirectory = fileEntry.localDirectory = {};
		const warnings = fileEntry.warnings = [];
		const localHeaderOffset = getDiskOffset(reader, diskNumberStart) + offset;
		const dataArray = await readUint8Array(reader, localHeaderOffset, HEADER_SIZE);
		const dataView = getDataView(dataArray);
		let password = getOptionValue(zipEntry, options, OPTION_PASSWORD);
		let rawPassword = getOptionValue(zipEntry, options, OPTION_RAW_PASSWORD);
		const passThrough = getOptionValue(zipEntry, options, OPTION_PASS_THROUGH);
		checkPasswordOption(password, rawPassword);
		password = password && password.length && password;
		rawPassword = rawPassword && rawPassword.length && rawPassword;
		if (extraFieldAES) {
			if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
		}
		if (dataArray.length < HEADER_SIZE || getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
			throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
		}
		readCommonHeader(localDirectory, dataView, 4);
		const {
			extraFieldLength,
			filenameLength
		} = localDirectory;
		const dataOffset = localDirectory.dataOffset = localHeaderOffset + HEADER_SIZE + filenameLength + extraFieldLength;
		const checkLocalDirectoryOption = getOptionValue(zipEntry, options, OPTION_CHECK_LOCAL_DIRECTORY);
		const entryStrictness = getStrictness(options, zipEntry.options);
		const checkLocalDirectory = getCheckLocalDirectory(checkLocalDirectoryOption, entryStrictness);
		const checkLocalFilename = getCheckLocalFilename(checkLocalDirectoryOption, entryStrictness);
		let rawLocalFilename = EMPTY_UINT8_ARRAY;
		if (checkLocalFilename && (filenameLength || extraFieldLength)) {
			const trailingDataArray = await readUint8Array(reader, localHeaderOffset + HEADER_SIZE, filenameLength + extraFieldLength);
			rawLocalFilename = trailingDataArray.subarray(0, filenameLength);
			localDirectory.rawExtraField = trailingDataArray.subarray(filenameLength);
		} else {
			localDirectory.rawExtraField = extraFieldLength ?
				await readUint8Array(reader, localHeaderOffset + HEADER_SIZE + filenameLength, extraFieldLength) :
				EMPTY_UINT8_ARRAY;
		}
		if (checkLocalFilename) {
			localDirectory.rawFilename = rawLocalFilename;
		}
		if (readCommonFooter(zipEntry, localDirectory, dataView, 4, true)) {
			addWarning(warnings, WARNING_MALFORMED_EXTRA_FIELD);
		}
		validateLocalDirectory(zipEntry, localDirectory, rawLocalFilename, checkLocalFilename, checkLocalDirectory ? UNDEFINED_VALUE : warnings);
		const { lastAccessDate, creationDate, uid, gid } = localDirectory;
		if (lastAccessDate) {
			fileEntry.lastAccessDate = lastAccessDate;
		}
		if (creationDate) {
			fileEntry.creationDate = creationDate;
		}
		if (uid !== UNDEFINED_VALUE && fileEntry.uid === UNDEFINED_VALUE) {
			fileEntry.uid = uid;
		}
		if (gid !== UNDEFINED_VALUE && fileEntry.gid === UNDEFINED_VALUE) {
			fileEntry.gid = gid;
		}
		const encrypted = zipEntry.encrypted && localDirectory.encrypted && !passThrough;
		const zipCrypto = encrypted && !extraFieldAES;
		if (!passThrough) {
			fileEntry.zipCrypto = zipCrypto;
		}
		if (encrypted && (localDirectory.rawBitFlag & BITFLAG_STRONG_ENCRYPTION) == BITFLAG_STRONG_ENCRYPTION) {
			throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
		}
		const registeredCodec = passThrough ? UNDEFINED_VALUE : getRegisteredCodec(compressionMethod);
		if (compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE && compressionMethod != COMPRESSION_METHOD_DEFLATE_64 && !registeredCodec && !passThrough) {
			throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		}
		if (encrypted) {
			if (!zipCrypto && (extraFieldAES.strength < 1 || extraFieldAES.strength > 3)) {
				throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
			} else if (!password && !rawPassword) {
				throw new Error(ERR_ENCRYPTED);
			}
		}
		if (dataOffset + compressedSize > reader.size) {
			throw new Error(ERR_ENTRY_DATA_OUT_OF_BOUNDS);
		}
		const size = compressedSize;
		const readable = toCompatibleReadable(reader.createReadable({ offset: dataOffset, size }));
		const signal = checkSignalOption(getOptionValue(zipEntry, options, OPTION_SIGNAL));
		const checkPasswordOnly = getOptionValue(zipEntry, options, OPTION_CHECK_PASSWORD_ONLY);
		let checkOverlappingEntry = getOptionValue(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY);
		const checkOverlappingEntryOnly = getOptionValue(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY);
		if (checkOverlappingEntryOnly) {
			checkOverlappingEntry = true;
		}
		const { onstart, onprogress, onend } = options;
		const compressed = compressionMethod != COMPRESSION_METHOD_STORE && !passThrough;
		const outputSize = passThrough ? compressedSize : uncompressedSize;
		const deflate64 = compressionMethod == COMPRESSION_METHOD_DEFLATE_64;
		let useCompressionStream = getOptionValue(zipEntry, options, OPTION_USE_COMPRESSION_STREAM);
		if (deflate64) {
			useCompressionStream = false;
		}
		const checkCrc32Option = getOptionValue(zipEntry, options, OPTION_CHECK_CRC32);
		const checkCrc32 = (checkCrc32Option === UNDEFINED_VALUE ?
			getOptionValue(zipEntry, options, OPTION_CHECK_SIGNATURE) :
			checkCrc32Option) && !passThrough &&
			(!encrypted || zipCrypto || (extraFieldAES && extraFieldAES.vendorVersion == VENDOR_VERSION_AE_1));
		const workerOptions = {
			options: {
				codecType: CODEC_INFLATE,
				password,
				rawPassword,
				zipCrypto,
				encryptionStrength: extraFieldAES && extraFieldAES.strength,
				checkCrc32,
				checkAuthenticationCode: getOptionValue(zipEntry, options, OPTION_CHECK_AUTHENTICATION_CODE),
				passwordVerification: zipCrypto && (dataDescriptor ? ((rawLastModDate >>> 8) & MAX_8_BITS) : ((crc32 >>> 24) & MAX_8_BITS)),
				outputSize,
				crc32,
				compressed,
				encrypted,
				useWebWorkers: getOptionValue(zipEntry, options, OPTION_USE_WEB_WORKERS),
				useCompressionStream,
				transferStreams: getOptionValue(zipEntry, options, OPTION_TRANSFER_STREAMS),
				deflate64,
				format: registeredCodec ? registeredCodec.format : UNDEFINED_VALUE,
				codecURI: registeredCodec ? registeredCodec.codecURI : UNDEFINED_VALUE,
				compressionMethod,
				rawBitFlag,
				checkPasswordOnly
			},
			config,
			streamOptions: { signal, size, onstart, onprogress, onend }
		};
		if (checkOverlappingEntry) {
			await detectOverlappingEntry({
				reader,
				fileEntry,
				index,
				offset: localHeaderOffset,
				crc32,
				compressedSize,
				uncompressedSize,
				dataOffset,
				dataDescriptor: dataDescriptor || localDirectory.bitFlag.dataDescriptor,
				extraFieldZip64: extraFieldZip64 || localDirectory.extraFieldZip64,
				readRanges
			});
		}
		let writable, abortError;
		try {
			if (!checkOverlappingEntryOnly) {
				if (checkPasswordOnly) {
					writer = new WritableStream();
				}
				writer = new GenericWriter(writer);
				await initStream(writer, getDecodableOutputSize(outputSize, compressedSize, compressed));
				({ writable } = writer);
				const { outputSize: writtenSize } = await runWorker({ readable, writable }, workerOptions);
				writer.size += writtenSize;
				if (writtenSize != outputSize) {
					throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
				}
			}
		} catch (error) {
			if (error.outputSize !== UNDEFINED_VALUE) {
				writer.size += error.outputSize;
			}
			if (!checkPasswordOnly || error.message != ERR_ABORT_CHECK_PASSWORD) {
				abortError = error;
				throw error;
			}
		} finally {
			const preventClose = !ownsWritable(writer) && getOptionValue(zipEntry, options, OPTION_PREVENT_CLOSE);
			if (!preventClose && writable && !writable.locked) {
				const writableWriter = writable.getWriter();
				if (abortError) {
					try {
						await writableWriter.abort(abortError);
					} catch {
						// the error being propagated is more relevant; ignored
					}
				} else {
					await writableWriter.close();
				}
			}
		}
		return checkPasswordOnly || checkOverlappingEntryOnly ? UNDEFINED_VALUE : writer.getData ? writer.getData() : writable;
	}
}

function detectEncryptedCentralDirectory(directoryView) {
	const maxOffset = Math.min(directoryView.byteLength, 1024) - 3;
	for (let offset = 0; offset < maxOffset; offset++) {
		if (getUint32(directoryView, offset) == ARCHIVE_EXTRA_DATA_SIGNATURE) {
			return true;
		}
	}
	return false;
}

function getWrappedFilesLength(directoryView, directoryArray, offset) {
	let wrappedFilesLength = 0;
	while (offset + CENTRAL_FILE_HEADER_LENGTH <= directoryArray.length && getUint32(directoryView, offset) == CENTRAL_FILE_HEADER_SIGNATURE) {
		offset += CENTRAL_FILE_HEADER_LENGTH +
			getUint16(directoryView, offset + 28) + getUint16(directoryView, offset + 30) + getUint16(directoryView, offset + 32);
		wrappedFilesLength++;
	}
	return wrappedFilesLength % (MAX_16_BITS + 1) ? 0 : wrappedFilesLength;
}

function readDigitalSignature(signatureRecordArray) {
	if (signatureRecordArray.length >= 6) {
		const signatureRecordView = getDataView(signatureRecordArray);
		if (getUint32(signatureRecordView, 0) == DIGITAL_SIGNATURE_RECORD_SIGNATURE) {
			const signatureDataLength = getUint16(signatureRecordView, 4);
			if (6 + signatureDataLength <= signatureRecordArray.length) {
				return signatureRecordArray.subarray(6, 6 + signatureDataLength);
			}
		}
	}
}

function getEncryptedDirectoryDataLength(directoryEncryptionInfo, declaredDirectoryDataLength, directoryDataLength) {
	const encryptedDirectoryDataLength = directoryEncryptionInfo && directoryEncryptionInfo.compressedSize ?
		directoryEncryptionInfo.compressedSize :
		declaredDirectoryDataLength;
	return encryptedDirectoryDataLength > 0 && encryptedDirectoryDataLength <= directoryDataLength ?
		encryptedDirectoryDataLength :
		directoryDataLength;
}

function getDirectoryEncryptionInfo(rawExtensibleData) {
	const directoryEncryptionInfo = { rawExtensibleData };
	if (rawExtensibleData.length >= 28) {
		const extensibleDataView = getDataView(rawExtensibleData);
		const hashDataLength = getUint16(extensibleDataView, 26);
		Object.assign(directoryEncryptionInfo, {
			compressionMethod: getUint16(extensibleDataView, 0),
			compressedSize: getBigUint64(extensibleDataView, 2),
			uncompressedSize: getBigUint64(extensibleDataView, 10),
			encryptionAlgorithm: getUint16(extensibleDataView, 18),
			bitLength: getUint16(extensibleDataView, 20),
			flags: getUint16(extensibleDataView, 22),
			hashAlgorithm: getUint16(extensibleDataView, 24),
			hashData: rawExtensibleData.subarray(28, 28 + hashDataLength)
		});
	}
	return directoryEncryptionInfo;
}

function readCommonHeader(directory, dataView, offset) {
	const rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
	const encrypted = (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED;
	const rawLastModDate = getUint32(dataView, offset + 6);
	Object.assign(directory, {
		encrypted,
		version: getUint16(dataView, offset),
		bitFlag: {
			level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
			dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
			languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
		},
		rawLastModDate,
		lastModDate: getDate(rawLastModDate),
		filenameLength: getUint16(dataView, offset + 22),
		extraFieldLength: getUint16(dataView, offset + 24)
	});
}

function readCommonFooter(fileEntry, directory, dataView, offset, localDirectory) {
	const { rawExtraField } = directory;
	const extraField = directory.extraField = new Map();
	const rawExtraFieldView = getDataView(rawExtraField);
	let offsetExtraField = 0;
	let malformedExtraField = false;
	try {
		while (offsetExtraField < rawExtraField.length) {
			const type = getUint16(rawExtraFieldView, offsetExtraField);
			const size = getUint16(rawExtraFieldView, offsetExtraField + 2);
			extraField.set(type, {
				type,
				data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
			});
			offsetExtraField += 4 + size;
		}
	} catch {
		malformedExtraField = true;
	}
	if (offsetExtraField > rawExtraField.length) {
		malformedExtraField = true;
	}
	const compressionMethod = getUint16(dataView, offset + 4);
	Object.assign(directory, {
		signature: getUint32(dataView, offset + HEADER_OFFSET_SIGNATURE),
		crc32: getUint32(dataView, offset + HEADER_OFFSET_SIGNATURE),
		compressedSize: getUint32(dataView, offset + HEADER_OFFSET_COMPRESSED_SIZE),
		uncompressedSize: getUint32(dataView, offset + HEADER_OFFSET_UNCOMPRESSED_SIZE)
	});
	const extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
	if (extraFieldZip64) {
		readExtraFieldZip64(extraFieldZip64, directory);
		directory.extraFieldZip64 = extraFieldZip64;
	}
	const extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
	if (extraFieldUnicodePath) {
		readExtraFieldUnicode(extraFieldUnicodePath, PROPERTY_NAME_FILENAME, PROPERTY_NAME_RAW_FILENAME, directory, fileEntry);
		directory.extraFieldUnicodePath = extraFieldUnicodePath;
	}
	const extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
	if (extraFieldUnicodeComment) {
		readExtraFieldUnicode(extraFieldUnicodeComment, PROPERTY_NAME_COMMENT, PROPERTY_NAME_RAW_COMMENT, directory, fileEntry);
		directory.extraFieldUnicodeComment = extraFieldUnicodeComment;
	}
	const extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
	if (extraFieldAES && extraFieldAES.data.length >= 7) {
		readExtraFieldAES(extraFieldAES, directory, compressionMethod);
		directory.extraFieldAES = extraFieldAES;
	} else {
		directory.compressionMethod = compressionMethod;
	}
	const extraFieldPkwareUnix = extraField.get(EXTRAFIELD_TYPE_PKWARE_UNIX);
	if (extraFieldPkwareUnix) {
		readExtraFieldUnixDates(extraFieldPkwareUnix, directory);
		directory.extraFieldPkwareUnix = extraFieldPkwareUnix;
	}
	const extraFieldUnixType1 = extraField.get(EXTRAFIELD_TYPE_UNIX_TYPE1);
	if (extraFieldUnixType1) {
		readExtraFieldUnixDates(extraFieldUnixType1, directory);
		directory.extraFieldUnixType1 = extraFieldUnixType1;
	}
	const extraFieldNTFS = extraField.get(EXTRAFIELD_TYPE_NTFS);
	if (extraFieldNTFS) {
		readExtraFieldNTFS(extraFieldNTFS, directory);
		directory.extraFieldNTFS = extraFieldNTFS;
	}
	const extraFieldUnix = extraField.get(EXTRAFIELD_TYPE_UNIX);
	let unixIdsRead;
	if (extraFieldUnix) {
		unixIdsRead = readExtraFieldUnix(extraFieldUnix, directory, false);
		directory.extraFieldUnix = extraFieldUnix;
	}
	if (!unixIdsRead) {
		const extraFieldInfoZip = extraField.get(EXTRAFIELD_TYPE_INFOZIP);
		if (extraFieldInfoZip) {
			readExtraFieldUnix(extraFieldInfoZip, directory, true);
			directory.extraFieldInfoZip = extraFieldInfoZip;
		}
	}
	const extraFieldExtendedTimestamp = extraField.get(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
	if (extraFieldExtendedTimestamp) {
		readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory);
		directory.extraFieldExtendedTimestamp = extraFieldExtendedTimestamp;
	}
	const extraFieldUSDZ = extraField.get(EXTRAFIELD_TYPE_USDZ);
	if (extraFieldUSDZ) {
		directory.extraFieldUSDZ = extraFieldUSDZ;
	}
	return malformedExtraField;
}

function readExtraFieldZip64(extraFieldZip64, directory) {
	directory.zip64 = true;
	const extraFieldView = getDataView(extraFieldZip64.data);
	const missingProperties = ZIP64_PROPERTIES.filter(([propertyName, max]) => directory[propertyName] == max);
	const requiredLength = missingProperties.reduce((length, [, max]) => length + ZIP64_EXTRACTION[max].bytes, 0);
	if (extraFieldZip64.data.length < requiredLength) {
		throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
	}
	for (let indexMissingProperty = 0, offset = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
		const [propertyName, max] = missingProperties[indexMissingProperty];
		const extraction = ZIP64_EXTRACTION[max];
		directory[propertyName] = extraFieldZip64[propertyName] = extraction.getValue(extraFieldView, offset);
		offset += extraction.bytes;
	}
}

function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
	if (extraFieldUnicode.data.length < 5) {
		extraFieldUnicode.valid = false;
		return;
	}
	const extraFieldView = getDataView(extraFieldUnicode.data);
	const computedCrc32 = new Crc32();
	computedCrc32.append(fileEntry[rawPropertyName]);
	const computedCrc32View = getDataView(new Uint8Array(4));
	computedCrc32View.setUint32(0, computedCrc32.get(), true);
	const nameCrc32 = getUint32(extraFieldView, 1);
	const version = getUint8(extraFieldView, 0);
	Object.assign(extraFieldUnicode, {
		version,
		[propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
		valid: version == 1 && !fileEntry.bitFlag.languageEncodingFlag && nameCrc32 == getUint32(computedCrc32View, 0)
	});
	if (extraFieldUnicode.valid) {
		directory[propertyName] = extraFieldUnicode[propertyName];
		directory[propertyName + PROPERTY_NAME_UTF8_SUFFIX] = true;
	}
}

function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
	const extraFieldView = getDataView(extraFieldAES.data);
	const strength = getUint8(extraFieldView, 4);
	Object.assign(extraFieldAES, {
		vendorVersion: getUint8(extraFieldView, 0),
		vendorId: getUint8(extraFieldView, 2),
		strength,
		originalCompressionMethod: compressionMethod,
		compressionMethod: getUint16(extraFieldView, 5)
	});
	directory.compressionMethod = extraFieldAES.compressionMethod;
	if (extraFieldAES.vendorVersion != VENDOR_VERSION_AE_1) {
		directory.crc32 = UNDEFINED_VALUE;
	}
}

function readExtraFieldNTFS(extraFieldNTFS, directory) {
	const extraFieldView = getDataView(extraFieldNTFS.data);
	let offsetExtraField = 4;
	let tag1Data;
	try {
		while (offsetExtraField < extraFieldNTFS.data.length && !tag1Data) {
			const tagValue = getUint16(extraFieldView, offsetExtraField);
			const attributeSize = getUint16(extraFieldView, offsetExtraField + 2);
			if (tagValue == EXTRAFIELD_TYPE_NTFS_TAG1) {
				tag1Data = extraFieldNTFS.data.slice(offsetExtraField + 4, offsetExtraField + 4 + attributeSize);
			}
			offsetExtraField += 4 + attributeSize;
		}
	} catch {
		// ignored
	}
	if (tag1Data && tag1Data.length == 24) {
		const tag1View = getDataView(tag1Data);
		const rawLastModDate = tag1View.getBigUint64(0, true);
		const rawLastAccessDate = tag1View.getBigUint64(8, true);
		const rawCreationDate = tag1View.getBigUint64(16, true);
		Object.assign(extraFieldNTFS, {
			rawLastModDate,
			rawLastAccessDate,
			rawCreationDate
		});
		const lastModDate = getDateNTFS(rawLastModDate);
		const lastAccessDate = getDateNTFS(rawLastAccessDate);
		const creationDate = getDateNTFS(rawCreationDate);
		const extraFieldData = { lastModDate, lastAccessDate, creationDate };
		Object.assign(extraFieldNTFS, extraFieldData);
		Object.assign(directory, extraFieldData, { rawLastAccessDate, rawCreationDate });
	}
}

function readExtraFieldUnixDates(extraField, directory) {
	if (extraField.data.length < 8) {
		return;
	}
	const extraFieldView = getDataView(extraField.data);
	const lastAccessDate = new Date((getUint32(extraFieldView, 0) | 0) * 1000);
	const lastModDate = new Date((getUint32(extraFieldView, 4) | 0) * 1000);
	const extraFieldData = { lastAccessDate, lastModDate };
	if (extraField.data.length >= 12) {
		extraFieldData.uid = getUint16(extraFieldView, 8);
		extraFieldData.gid = getUint16(extraFieldView, 10);
	}
	Object.assign(extraField, extraFieldData);
	Object.assign(directory, extraFieldData);
}

function readExtraFieldUnix(extraField, directory, isInfoZip) {
	try {
		const view = getDataView(extraField.data);
		let uid, gid;
		if (isInfoZip) {
			let offset = 0;
			const version = getUint8(view, offset++);
			const uidSize = getUint8(view, offset++);
			uid = unpackUnixId(extraField.data.subarray(offset, offset + uidSize));
			offset += uidSize;
			const gidSize = getUint8(view, offset++);
			gid = unpackUnixId(extraField.data.subarray(offset, offset + gidSize));
			Object.assign(extraField, { version, uid, gid });
		} else if (extraField.data.length >= 4) {
			uid = getUint16(view, 0);
			gid = getUint16(view, 2);
			Object.assign(extraField, { uid, gid });
		}
		if (uid !== UNDEFINED_VALUE) {
			directory.uid = uid;
		}
		if (gid !== UNDEFINED_VALUE) {
			directory.gid = gid;
		}
		return uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE;
	} catch {
		// ignored
	}
}

function unpackUnixId(bytes) {
	const buffer = new Uint8Array(4);
	buffer.set(bytes, 0);
	const view = new DataView(buffer.buffer, buffer.byteOffset, 4);
	return view.getUint32(0, true);
}

function readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory) {
	if (!extraFieldExtendedTimestamp.data.length) {
		return;
	}
	const extraFieldView = getDataView(extraFieldExtendedTimestamp.data);
	const flags = getUint8(extraFieldView, 0);
	const timeProperties = [];
	const timeRawProperties = [];
	if (localDirectory) {
		if ((flags & 0x1) == 0x1) {
			timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
			timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
		}
		if ((flags & 0x2) == 0x2) {
			timeProperties.push(PROPERTY_NAME_LAST_ACCESS_DATE);
			timeRawProperties.push(PROPERTY_NAME_RAW_LAST_ACCESS_DATE);
		}
		if ((flags & 0x4) == 0x4) {
			timeProperties.push(PROPERTY_NAME_CREATION_DATE);
			timeRawProperties.push(PROPERTY_NAME_RAW_CREATION_DATE);
		}
	} else if (extraFieldExtendedTimestamp.data.length >= 5) {
		timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
		timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
	}
	let offset = 1;
	timeProperties.forEach((propertyName, indexProperty) => {
		if (extraFieldExtendedTimestamp.data.length >= offset + 4) {
			const time = getUint32(extraFieldView, offset);
			directory[propertyName] = extraFieldExtendedTimestamp[propertyName] = new Date((time | 0) * 1000);
			const rawPropertyName = timeRawProperties[indexProperty];
			extraFieldExtendedTimestamp[rawPropertyName] = time;
		}
		offset += 4;
	});
}

async function detectOverlappingEntry({
	reader,
	fileEntry,
	index,
	offset,
	crc32,
	compressedSize,
	uncompressedSize,
	dataOffset,
	dataDescriptor,
	extraFieldZip64,
	readRanges
}) {
	let dataDescriptorLength = 0;
	if (dataDescriptor) {
		if (extraFieldZip64) {
			dataDescriptorLength = DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH;
		} else {
			dataDescriptorLength = DATA_DESCRIPTOR_RECORD_LENGTH;
		}
	}
	if (dataDescriptorLength) {
		const dataDescriptorArray = await readUint8Array(reader, dataOffset + compressedSize, dataDescriptorLength + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH);
		const dataDescriptorView = getDataView(dataDescriptorArray);
		let signature = dataDescriptorArray.length == dataDescriptorLength + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH &&
			getUint32(dataDescriptorView, 0) == DATA_DESCRIPTOR_RECORD_SIGNATURE;
		if (signature) {
			const signedDataDescriptor = readDataDescriptor(dataDescriptorView, DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH, extraFieldZip64);
			const matchCrc32 = (fileEntry.encrypted && !fileEntry.zipCrypto) || signedDataDescriptor.crc32 == crc32;
			if (matchCrc32 &&
				signedDataDescriptor.compressedSize == compressedSize &&
				signedDataDescriptor.uncompressedSize == uncompressedSize) {
				dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
			} else {
				signature = false;
			}
		}
		if (dataDescriptorArray.length >= dataDescriptorLength) {
			const localDataDescriptor = readDataDescriptor(dataDescriptorView, signature ? DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH : 0, extraFieldZip64);
			localDataDescriptor.signature = signature;
			fileEntry.localDirectory.dataDescriptor = localDataDescriptor;
		}
	}
	const range = {
		start: offset,
		end: dataOffset + compressedSize + dataDescriptorLength,
		fileEntry
	};
	for (const [otherIndex, otherRange] of readRanges) {
		if (otherIndex != index && range.start < otherRange.end && otherRange.start < range.end) {
			const error = new Error(ERR_OVERLAPPING_ENTRY);
			error.overlappingEntry = otherRange.fileEntry;
			throw error;
		}
	}
	readRanges.set(index, range);
}

function readDataDescriptor(dataDescriptorView, offset, extraFieldZip64) {
	const crc32 = getUint32(dataDescriptorView, offset);
	let compressedSize;
	let uncompressedSize;
	if (extraFieldZip64) {
		compressedSize = getBigUint64(dataDescriptorView, offset + 4);
		uncompressedSize = getBigUint64(dataDescriptorView, offset + 12);
	} else {
		compressedSize = getUint32(dataDescriptorView, offset + 4);
		uncompressedSize = getUint32(dataDescriptorView, offset + 8);
	}
	return { crc32, compressedSize, uncompressedSize };
}

function getDiskOffset(reader, diskNumber) {
	return reader.getDiskOffset ? reader.getDiskOffset(diskNumber) : 0;
}

async function startsWithSplitZipSignature(reader) {
	return await getFirstSignature(reader) == SPLIT_ZIP_FILE_SIGNATURE;
}

async function startsWithSplitZipMarker(reader) {
	const signature = await getFirstSignature(reader);
	return signature == SPLIT_ZIP_FILE_SIGNATURE || signature == TEMPORARY_SPLIT_ZIP_FILE_SIGNATURE;
}

async function getFirstSignature(reader) {
	const signatureArray = await readUint8Array(reader, 0, SPLIT_ZIP_FILE_SIGNATURE_LENGTH);
	return getUint32(getDataView(signatureArray));
}

function isStrictnessValue(value) {
	return value === STRICTNESS_STRICT || value === STRICTNESS_BALANCED || value === STRICTNESS_TOLERANT;
}

function getDecodableOutputSize(outputSize, compressedSize, compressed) {
	return Math.min(outputSize, compressed ? compressedSize * MAX_DEFLATE_EXPANSION_RATIO : compressedSize);
}

function getStrictness(options, inheritedOptions) {
	return resolveStrictness(options, resolveStrictness(inheritedOptions, STRICTNESS_BALANCED));
}

function resolveStrictness(options, inheritedStrictness) {
	const strictness = options[OPTION_STRICTNESS];
	if (strictness !== UNDEFINED_VALUE) {
		if (!isStrictnessValue(strictness)) {
			throw new Error(ERR_INVALID_STRICTNESS);
		}
		return strictness;
	}
	const checkAmbiguity = options[OPTION_CHECK_AMBIGUITY];
	if (checkAmbiguity === UNDEFINED_VALUE) {
		return inheritedStrictness;
	}
	if (checkAmbiguity) {
		return STRICTNESS_STRICT;
	}
	return inheritedStrictness == STRICTNESS_TOLERANT ? STRICTNESS_TOLERANT : STRICTNESS_BALANCED;
}

function getCheckLocalDirectory(checkLocalDirectory, strictness) {
	if (checkLocalDirectory === UNDEFINED_VALUE) {
		return strictness != STRICTNESS_TOLERANT;
	}
	return Boolean(checkLocalDirectory);
}

function getCheckLocalFilename(checkLocalFilename, strictness) {
	if (checkLocalFilename === UNDEFINED_VALUE) {
		return strictness == STRICTNESS_STRICT;
	}
	return Boolean(checkLocalFilename);
}

function getFilenameValidation(filenameValidation, strictness) {
	if (filenameValidation === UNDEFINED_VALUE) {
		return strictness;
	}
	if (!isStrictnessValue(filenameValidation)) {
		throw new Error(ERR_INVALID_FILENAME_VALIDATION);
	}
	return filenameValidation;
}

function isUnsafeFilename(filename, filenameValidation) {
	if (filenameValidation == STRICTNESS_TOLERANT) {
		return false;
	}
	const pathParts = filename.split("/");
	if (pathParts.length > 1 && pathParts[pathParts.length - 1] === "") {
		pathParts.pop();
	}
	if (pathParts.includes("..") || filename.startsWith("/") || filename.startsWith("\\\\") || DRIVE_LETTER_REGEXP.test(filename)) {
		return true;
	}
	return filenameValidation == STRICTNESS_STRICT && (pathParts.includes(".") || pathParts.includes(""));
}

function getMaxAppendedDataSize(maxAppendedDataSize, strictness) {
	if (maxAppendedDataSize !== UNDEFINED_VALUE) {
		const size = toNumber(maxAppendedDataSize);
		if (typeof size != NUMBER_TYPE || Number.isNaN(size) || size < 0) {
			throw new Error(ERR_INVALID_MAX_APPENDED_DATA_SIZE);
		}
		return size;
	}
	if (strictness == STRICTNESS_STRICT) {
		return 0;
	}
	if (strictness == STRICTNESS_TOLERANT) {
		return Infinity;
	}
	return MAX_16_BITS;
}

async function findEndOfCentralDirectory(reader, rejectAmbiguous, maxAppendedDataSize) {
	const { size } = reader;
	const anchoredLength = Math.min(size, END_OF_CENTRAL_DIR_LENGTH + MAX_16_BITS);
	const remoteProbeBudget = { count: MAX_END_OF_CENTRAL_DIR_PROBES };
	let endOfDirectoryInfo;
	let plausibleEndOfDirectoryInfo;
	let endOfDirectoryReachingEndCount = 0;
	for await (const [anchoredView, anchoredOffset, anchoredArray, indexByte, offset] of scanEndOfCentralDirectory(reader, anchoredLength)) {
		const commentLength = getUint16(anchoredView, indexByte + 20);
		if (offset + END_OF_CENTRAL_DIR_LENGTH + commentLength == size) {
			const reachability = await getCentralDirectoryReachability(reader, anchoredView, anchoredOffset, indexByte, offset, size, remoteProbeBudget);
			if (reachability == CENTRAL_DIRECTORY_REACHABLE) {
				if (!endOfDirectoryInfo) {
					endOfDirectoryInfo = getEndOfCentralDirectoryInfo(anchoredArray, indexByte, offset);
				}
				endOfDirectoryReachingEndCount++;
				if (!rejectAmbiguous || endOfDirectoryReachingEndCount > 1) {
					break;
				}
			} else if (reachability == CENTRAL_DIRECTORY_PLAUSIBLE && !plausibleEndOfDirectoryInfo) {
				plausibleEndOfDirectoryInfo = getEndOfCentralDirectoryInfo(anchoredArray, indexByte, offset);
			}
		}
	}
	if (!endOfDirectoryInfo) {
		endOfDirectoryInfo = plausibleEndOfDirectoryInfo;
	}
	if (!endOfDirectoryInfo) {
		endOfDirectoryInfo = await seekEndOfCentralDirectory(reader, maxAppendedDataSize, remoteProbeBudget);
	}
	return { endOfDirectoryInfo, endOfDirectoryReachingEndCount };
}

async function seekEndOfCentralDirectory(reader, maxAppendedDataSize, remoteProbeBudget) {
	const { size } = reader;
	const searchLength = Math.min(size, maxAppendedDataSize == Infinity ? size :
		END_OF_CENTRAL_DIR_LENGTH + MAX_16_BITS + maxAppendedDataSize);
	let firstSignatureInfo, plausibleInfo;
	for await (const [searchView, searchOffset, searchArray, indexByte, offset] of scanEndOfCentralDirectory(reader, searchLength)) {
		const record = getEndOfCentralDirectoryInfo(searchArray, indexByte, offset);
		if (!firstSignatureInfo) {
			firstSignatureInfo = record;
		}
		const reachability = await getCentralDirectoryReachability(reader, searchView, searchOffset, indexByte, offset, size, remoteProbeBudget);
		if (reachability == CENTRAL_DIRECTORY_REACHABLE) {
			return record;
		}
		if (reachability == CENTRAL_DIRECTORY_PLAUSIBLE && !plausibleInfo) {
			plausibleInfo = record;
		}
	}
	return plausibleInfo || firstSignatureInfo;
}

async function* scanEndOfCentralDirectory(reader, scanLength) {
	const scanOffset = reader.size - scanLength;
	const scanArray = await readUint8Array(reader, scanOffset, scanLength);
	const scanView = getDataView(scanArray);
	for (let indexByte = scanArray.length - END_OF_CENTRAL_DIR_LENGTH; indexByte >= 0; indexByte--) {
		if (getUint32(scanView, indexByte) == END_OF_CENTRAL_DIR_SIGNATURE) {
			yield [scanView, scanOffset, scanArray, indexByte, scanOffset + indexByte];
		}
	}
}

function getEndOfCentralDirectoryInfo(scanArray, indexByte, offset) {
	return { offset, buffer: scanArray.slice(indexByte, indexByte + END_OF_CENTRAL_DIR_LENGTH).buffer };
}

async function getCentralDirectoryReachability(reader, view, anchoredOffset, indexByte, offset, size, remoteProbeBudget) {
	const filesLength = getUint16(view, indexByte + 10);
	const directoryDataLength = getUint32(view, indexByte + 12);
	const directoryDataOffset = getUint32(view, indexByte + 16);
	if (filesLength == MAX_16_BITS || directoryDataLength == MAX_32_BITS || directoryDataOffset == MAX_32_BITS) {
		const locatorSignature = await readSignature(reader, view, anchoredOffset, offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, size, remoteProbeBudget);
		return locatorSignature == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE ? CENTRAL_DIRECTORY_REACHABLE : CENTRAL_DIRECTORY_UNREACHABLE;
	}
	if (!filesLength && !directoryDataLength) {
		return CENTRAL_DIRECTORY_PLAUSIBLE;
	}
	const directoryDiskNumber = getUint16(view, indexByte + 6);
	for (const centralDirectoryOffset of [offset - directoryDataLength, getDiskOffset(reader, directoryDiskNumber) + directoryDataOffset]) {
		if (await readSignature(reader, view, anchoredOffset, centralDirectoryOffset, size, remoteProbeBudget) == CENTRAL_FILE_HEADER_SIGNATURE) {
			return CENTRAL_DIRECTORY_REACHABLE;
		}
	}
	return CENTRAL_DIRECTORY_UNREACHABLE;
}

async function readSignature(reader, view, anchoredOffset, signatureOffset, size, remoteProbeBudget) {
	if (signatureOffset < 0 || signatureOffset + 4 > size) {
		return UNDEFINED_VALUE;
	}
	if (signatureOffset >= anchoredOffset) {
		return getUint32(view, signatureOffset - anchoredOffset);
	}
	if (remoteProbeBudget.count > 0) {
		remoteProbeBudget.count--;
		const signatureArray = await readUint8Array(reader, signatureOffset, 4);
		return getUint32(getDataView(signatureArray), 0);
	}
	return UNDEFINED_VALUE;
}

function validateLocalDirectory(zipEntry, localDirectory, rawLocalFilename, checkLocalFilename, warnings) {
	const { rawFilename } = zipEntry;
	const reject = !warnings;
	const maskedLocalDirectory = zipEntry.decryptedDirectory &&
		(localDirectory.rawBitFlag & BITFLAG_MASKED_LOCAL_HEADERS) == BITFLAG_MASKED_LOCAL_HEADERS;
	if (checkLocalFilename && !maskedLocalDirectory &&
		(rawLocalFilename.length != rawFilename.length ||
			rawLocalFilename.some((byteValue, indexByte) => byteValue != rawFilename[indexByte]))) {
		reportAmbiguity(reject, warnings, "mismatched local file header (filename)");
	}
	if ((localDirectory.rawBitFlag & BITFLAG_AMBIGUITY_MASK) != (zipEntry.rawBitFlag & BITFLAG_AMBIGUITY_MASK)) {
		reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG);
	}
	if (localDirectory.compressionMethod != zipEntry.compressionMethod) {
		reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD);
	}
	if (!localDirectory.bitFlag.dataDescriptor && !maskedLocalDirectory &&
		(localDirectory.crc32 || localDirectory.compressedSize || localDirectory.uncompressedSize) &&
		(localDirectory.crc32 != zipEntry.crc32 ||
			localDirectory.compressedSize != zipEntry.compressedSize ||
			localDirectory.uncompressedSize != zipEntry.uncompressedSize)) {
		reportAmbiguity(reject, warnings, WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES);
	}
}

function reportAmbiguity(reject, warnings, reason) {
	if (reject) {
		throwAmbiguousArchive(reason);
	} else {
		addWarning(warnings, reason);
	}
}

function addWarning(warnings, reason, filename) {
	if (!warnings.some(warning => warning.reason == reason)) {
		const warning = { reason };
		if (filename !== UNDEFINED_VALUE) {
			warning.filename = filename;
		}
		warnings.push(warning);
	}
}

function throwAmbiguousArchive(reason) {
	const error = new Error(ERR_AMBIGUOUS_ARCHIVE);
	error.reason = reason;
	throw error;
}

function getOptionValue(zipReader, options, name) {
	return options[name] === UNDEFINED_VALUE ? zipReader.options[name] : options[name];
}

function getFunctionOptionValue(zipReader, options, name) {
	return checkFunctionOption(getOptionValue(zipReader, options, name));
}


function getDate(timeRaw) {
	const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & MAX_16_BITS;
	const result = new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
	return result < MIN_DATE ? MIN_DATE : result;
}

function getDateNTFS(timeRaw) {
	return new Date((Number((timeRaw / BigInt(10000)) - BigInt(11644473600000))));
}

function getUint8(view, offset) {
	return view.getUint8(offset);
}

function getUint16(view, offset) {
	return view.getUint16(offset, true);
}

function getUint32(view, offset) {
	return view.getUint32(offset, true);
}

function getBigUint64(view, offset) {
	const value = view.getBigUint64(offset, true);
	if (value > MAX_SAFE_UINT64) {
		throw new Error(ERR_UNSUPPORTED_UINT64);
	}
	return Number(value);
}
