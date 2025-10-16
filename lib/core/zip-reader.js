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

/* global Response, WritableStream, ReadableStream, TransformStream */
// deno-lint-ignore-file no-this-alias

import {
	MAX_32_BITS,
	MAX_16_BITS,
	MAX_8_BITS,
	COMPRESSION_METHOD_DEFLATE,
	COMPRESSION_METHOD_STORE,
	COMPRESSION_METHOD_AES,
	SPLIT_ZIP_FILE_SIGNATURE,
	DATA_DESCRIPTOR_RECORD_SIGNATURE,
	DATA_DESCRIPTOR_RECORD_LENGTH,
	DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH,
	DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH,
	LOCAL_FILE_HEADER_SIGNATURE,
	CENTRAL_FILE_HEADER_SIGNATURE,
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
	EXTRAFIELD_TYPE_USDZ,
	END_OF_CENTRAL_DIR_LENGTH,
	ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH,
	ZIP64_END_OF_CENTRAL_DIR_LENGTH,
	BITFLAG_ENCRYPTED,
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
	FILE_ATTR_UNIX_STICKY_MASK
} from "./constants.js";
import {
	getConfiguration,
	getChunkSize
} from "./configuration.js";
import {
	runWorker,
	CODEC_INFLATE,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSWORD,
	ERR_INVALID_UNCOMPRESSED_SIZE,
	ERR_ABORT_CHECK_PASSWORD
} from "./codec-pool.js";
import {
	initStream,
	readUint8Array,
	BlobReader,
	GenericReader,
	GenericWriter
} from "./io.js";
import { decodeText } from "./util/decode-text.js";
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
	OPTION_CHECK_SIGNATURE,
	OPTION_USE_WEB_WORKERS,
	OPTION_USE_COMPRESSION_STREAM,
	OPTION_TRANSFER_STREAMS,
	OPTION_PREVENT_CLOSE
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
const CHARSET_UTF8 = "utf-8";
const PROPERTY_NAME_UTF8_SUFFIX = "UTF8";
const CHARSET_CP437 = "cp437";
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

class ZipReader {

	constructor(reader, options = {}) {
		Object.assign(this, {
			reader: new GenericReader(reader),
			options,
			config: getConfiguration(),
			readRanges: []
		});
	}

	async* getEntriesGenerator(options = {}) {
		const zipReader = this;
		let { reader } = zipReader;
		const { config } = zipReader;
		await initStream(reader);
		if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
			reader = new BlobReader(await new Response(reader.readable).blob());
			await initStream(reader);
		}
		if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
			throw new Error(ERR_BAD_FORMAT);
		}
		reader.chunkSize = getChunkSize(config);
		const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, reader.size, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS * 16);
		if (!endOfDirectoryInfo) {
			const signatureArray = await readUint8Array(reader, 0, 4);
			const signatureView = getDataView(signatureArray);
			if (getUint32(signatureView) == SPLIT_ZIP_FILE_SIGNATURE) {
				throw new Error(ERR_SPLIT_ZIP_FILE);
			} else {
				throw new Error(ERR_EOCDR_NOT_FOUND);
			}
		}
		const endOfDirectoryView = getDataView(endOfDirectoryInfo);
		let directoryDataLength = getUint32(endOfDirectoryView, 12);
		let directoryDataOffset = getUint32(endOfDirectoryView, 16);
		const commentOffset = endOfDirectoryInfo.offset;
		const commentLength = getUint16(endOfDirectoryView, 20);
		const appendedDataOffset = commentOffset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
		let lastDiskNumber = getUint16(endOfDirectoryView, 4);
		const expectedLastDiskNumber = reader.lastDiskNumber || 0;
		let diskNumber = getUint16(endOfDirectoryView, 6);
		let filesLength = getUint16(endOfDirectoryView, 8);
		let prependedDataLength = 0;
		let startOffset = 0;
		if (directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS || diskNumber == MAX_16_BITS) {
			const endOfDirectoryLocatorArray = await readUint8Array(reader, endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);
			const endOfDirectoryLocatorView = getDataView(endOfDirectoryLocatorArray);
			if (getUint32(endOfDirectoryLocatorView, 0) == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
				directoryDataOffset = getBigUint64(endOfDirectoryLocatorView, 8);
				let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH, -1);
				let endOfDirectoryView = getDataView(endOfDirectoryArray);
				const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
				if (getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = expectedDirectoryDataOffset;
					if (directoryDataOffset > originalDirectoryDataOffset) {
						prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
					}
					endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH, -1);
					endOfDirectoryView = getDataView(endOfDirectoryArray);
				}
				if (getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
					throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
				}
				if (lastDiskNumber == MAX_16_BITS) {
					lastDiskNumber = getUint32(endOfDirectoryView, 16);
				}
				if (diskNumber == MAX_16_BITS) {
					diskNumber = getUint32(endOfDirectoryView, 20);
				}
				if (filesLength == MAX_16_BITS) {
					filesLength = getBigUint64(endOfDirectoryView, 32);
				}
				if (directoryDataLength == MAX_32_BITS) {
					directoryDataLength = getBigUint64(endOfDirectoryView, 40);
				}
				directoryDataOffset -= directoryDataLength;
			}
		}
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
		let directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
		let directoryView = getDataView(directoryArray);
		if (directoryDataLength) {
			const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - directoryDataLength;
			if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
				const originalDirectoryDataOffset = directoryDataOffset;
				directoryDataOffset = expectedDirectoryDataOffset;
				if (directoryDataOffset > originalDirectoryDataOffset) {
					prependedDataLength += directoryDataOffset - originalDirectoryDataOffset;
				}
				directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
				directoryView = getDataView(directoryArray);
			}
		}
		const expectedDirectoryDataLength = endOfDirectoryInfo.offset - directoryDataOffset - (reader.lastDiskOffset || 0);
		if (directoryDataLength != expectedDirectoryDataLength && expectedDirectoryDataLength >= 0) {
			directoryDataLength = expectedDirectoryDataLength;
			directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
			directoryView = getDataView(directoryArray);
		}
		if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
			throw new Error(ERR_BAD_FORMAT);
		}
		const filenameEncoding = getOptionValue(zipReader, options, OPTION_FILENAME_ENCODING);
		const commentEncoding = getOptionValue(zipReader, options, OPTION_COMMENT_ENCODING);
		for (let indexFile = 0; indexFile < filesLength; indexFile++) {
			const fileEntry = new ZipEntry(reader, config, zipReader.options);
			if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
				throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
			}
			readCommonHeader(fileEntry, directoryView, offset + 6);
			const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
			const filenameOffset = offset + 46;
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
			const offsetFileEntry = getUint32(directoryView, offset + 42) + prependedDataLength;
			const decode = getOptionValue(zipReader, options, OPTION_DECODE_TEXT) || decodeText;
			const rawFilenameEncoding = filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437;
			const rawCommentEncoding = commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437;
			let filename = decode(rawFilename, rawFilenameEncoding);
			if (filename === UNDEFINED_VALUE) {
				filename = decodeText(rawFilename, rawFilenameEncoding);
			}
			let comment = decode(rawComment, rawCommentEncoding);
			if (comment === UNDEFINED_VALUE) {
				comment = decodeText(rawComment, rawCommentEncoding);
			}
			Object.assign(fileEntry, {
				versionMadeBy,
				msDosCompatible,
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
			startOffset = Math.max(offsetFileEntry, startOffset);
			readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
			const unixExternalUpper = (fileEntry.externalFileAttributes >> 16) & MAX_16_BITS;
			if (fileEntry.unixMode === UNDEFINED_VALUE && (unixExternalUpper & (FILE_ATTR_UNIX_DEFAULT_MASK | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_TYPE_DIR)) != 0) {
				fileEntry.unixMode = unixExternalUpper;
			}
			const setuid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETUID_MASK);
			const setgid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETGID_MASK);
			const sticky = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_STICKY_MASK);
			const executable = (fileEntry.unixMode !== UNDEFINED_VALUE)
				? ((fileEntry.unixMode & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0)
				: (unixCompatible && ((unixExternalUpper & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0));
			const modeIsDir = fileEntry.unixMode !== UNDEFINED_VALUE && ((fileEntry.unixMode & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR);
			const upperIsDir = ((unixExternalUpper & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR);
			Object.assign(fileEntry, {
				setuid,
				setgid,
				sticky,
				unixExternalUpper,
				internalFileAttribute: fileEntry.internalFileAttributes,
				externalFileAttribute: fileEntry.externalFileAttributes,
				executable,
				directory: modeIsDir || upperIsDir || (msDosCompatible && msdosAttributes.directory) || (filename.endsWith(DIRECTORY_SIGNATURE) && !fileEntry.uncompressedSize),
				zipCrypto: fileEntry.encrypted && !fileEntry.extraFieldAES
			});
			const entry = new Entry(fileEntry);
			entry.getData = (writer, options) => fileEntry.getData(writer, entry, zipReader.readRanges, options);
			entry.arrayBuffer = async options => {
				const writer = new TransformStream();
				const [arrayBuffer] = await Promise.all([
					new Response(writer.readable).arrayBuffer(),
					fileEntry.getData(writer, entry, zipReader.readRanges, options)]);
				return arrayBuffer;
			};
			offset = endOffset;
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
		const extractPrependedData = getOptionValue(zipReader, options, OPTION_EXTRACT_PREPENDED_DATA);
		const extractAppendedData = getOptionValue(zipReader, options, OPTION_EXTRACT_APPENDED_DATA);
		if (extractPrependedData) {
			zipReader.prependedData = startOffset > 0 ? await readUint8Array(reader, 0, startOffset) : new Uint8Array();
		}
		zipReader.comment = commentLength ? await readUint8Array(reader, commentOffset + END_OF_CENTRAL_DIR_LENGTH, commentLength) : new Uint8Array();
		if (extractAppendedData) {
			zipReader.appendedData = appendedDataOffset < reader.size ? await readUint8Array(reader, appendedDataOffset, reader.size - appendedDataOffset) : new Uint8Array();
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
							value.getData(writable);
							return readable;
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

export {
	ZipReader,
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
	ERR_INVALID_PASSWORD,
	ERR_INVALID_UNCOMPRESSED_SIZE,
	ERR_SPLIT_ZIP_FILE,
	ERR_OVERLAPPING_ENTRY
};

class ZipEntry {

	constructor(reader, config, options) {
		Object.assign(this, {
			reader,
			config,
			options
		});
	}

	async getData(writer, fileEntry, readRanges, options = {}) {
		const zipEntry = this;
		const {
			reader,
			offset,
			diskNumberStart,
			extraFieldAES,
			extraFieldZip64,
			compressionMethod,
			config,
			bitFlag,
			signature,
			rawLastModDate,
			uncompressedSize,
			compressedSize
		} = zipEntry;
		const {
			dataDescriptor
		} = bitFlag;
		const localDirectory = fileEntry.localDirectory = {};
		const dataArray = await readUint8Array(reader, offset, HEADER_SIZE, diskNumberStart);
		const dataView = getDataView(dataArray);
		let password = getOptionValue(zipEntry, options, OPTION_PASSWORD);
		let rawPassword = getOptionValue(zipEntry, options, OPTION_RAW_PASSWORD);
		const passThrough = getOptionValue(zipEntry, options, OPTION_PASS_THROUGH);
		password = password && password.length && password;
		rawPassword = rawPassword && rawPassword.length && rawPassword;
		if (extraFieldAES) {
			if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
		}
		if ((compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE && compressionMethod != COMPRESSION_METHOD_DEFLATE_64) && !passThrough) {
			throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		}
		if (getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
			throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
		}
		readCommonHeader(localDirectory, dataView, 4);
		const {
			extraFieldLength,
			filenameLength,
			lastAccessDate,
			creationDate
		} = localDirectory;
		localDirectory.rawExtraField = extraFieldLength ?
			await readUint8Array(reader, offset + HEADER_SIZE + filenameLength, extraFieldLength, diskNumberStart) :
			new Uint8Array();
		readCommonFooter(zipEntry, localDirectory, dataView, 4, true);
		Object.assign(fileEntry, { lastAccessDate, creationDate });
		const encrypted = zipEntry.encrypted && localDirectory.encrypted && !passThrough;
		const zipCrypto = encrypted && !extraFieldAES;
		if (!passThrough) {
			fileEntry.zipCrypto = zipCrypto;
		}
		if (encrypted) {
			if (!zipCrypto && extraFieldAES.strength === UNDEFINED_VALUE) {
				throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
			} else if (!password && !rawPassword) {
				throw new Error(ERR_ENCRYPTED);
			}
		}
		const dataOffset = offset + HEADER_SIZE + filenameLength + extraFieldLength;
		const size = compressedSize;
		const readable = reader.readable;
		Object.assign(readable, {
			diskNumberStart,
			offset: dataOffset,
			size
		});
		const signal = getOptionValue(zipEntry, options, OPTION_SIGNAL);
		const checkPasswordOnly = getOptionValue(zipEntry, options, OPTION_CHECK_PASSWORD_ONLY);
		let checkOverlappingEntry = getOptionValue(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY);
		const checkOverlappingEntryOnly = getOptionValue(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY);
		if (checkOverlappingEntryOnly) {
			checkOverlappingEntry = true;
		}
		const { onstart, onprogress, onend } = options;
		const deflate64 = compressionMethod == COMPRESSION_METHOD_DEFLATE_64;
		let useCompressionStream = getOptionValue(zipEntry, options, OPTION_USE_COMPRESSION_STREAM);
		if (deflate64) {
			useCompressionStream = false;
		}
		const workerOptions = {
			options: {
				codecType: CODEC_INFLATE,
				password,
				rawPassword,
				zipCrypto,
				encryptionStrength: extraFieldAES && extraFieldAES.strength,
				signed: getOptionValue(zipEntry, options, OPTION_CHECK_SIGNATURE) && !passThrough,
				passwordVerification: zipCrypto && (dataDescriptor ? ((rawLastModDate >>> 8) & MAX_8_BITS) : ((signature >>> 24) & MAX_8_BITS)),
				outputSize: passThrough ? compressedSize : uncompressedSize,
				signature,
				compressed: compressionMethod != 0 && !passThrough,
				encrypted: zipEntry.encrypted && !passThrough,
				useWebWorkers: getOptionValue(zipEntry, options, OPTION_USE_WEB_WORKERS),
				useCompressionStream,
				transferStreams: getOptionValue(zipEntry, options, OPTION_TRANSFER_STREAMS),
				deflate64,
				checkPasswordOnly
			},
			config,
			streamOptions: { signal, size, onstart, onprogress, onend }
		};
		if (checkOverlappingEntry) {
			await detectOverlappingEntry({
				reader,
				fileEntry,
				offset,
				diskNumberStart,
				signature,
				compressedSize,
				uncompressedSize,
				dataOffset,
				dataDescriptor: dataDescriptor || localDirectory.bitFlag.dataDescriptor,
				extraFieldZip64: extraFieldZip64 || localDirectory.extraFieldZip64,
				readRanges
			});
		}
		let writable;
		try {
			if (!checkOverlappingEntryOnly) {
				if (checkPasswordOnly) {
					writer = new WritableStream();
				}
				writer = new GenericWriter(writer);
				await initStream(writer, passThrough ? compressedSize : uncompressedSize);
				({ writable } = writer);
				const { outputSize } = await runWorker({ readable, writable }, workerOptions);
				writer.size += outputSize;
				if (outputSize != (passThrough ? compressedSize : uncompressedSize)) {
					throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
				}
			}
		} catch (error) {
			if (error.outputSize !== UNDEFINED_VALUE) {
				writer.size += error.outputSize;
			}
			if (!checkPasswordOnly || error.message != ERR_ABORT_CHECK_PASSWORD) {
				throw error;
			}
		} finally {
			const preventClose = getOptionValue(zipEntry, options, OPTION_PREVENT_CLOSE);
			if (!preventClose && writable && !writable.locked) {
				await writable.getWriter().close();
			}
		}
		return checkPasswordOnly || checkOverlappingEntryOnly ? UNDEFINED_VALUE : writer.getData ? writer.getData() : writable;
	}
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
	const rawExtraFieldView = getDataView(new Uint8Array(rawExtraField));
	let offsetExtraField = 0;
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
		// ignored
	}
	const compressionMethod = getUint16(dataView, offset + 4);
	Object.assign(directory, {
		signature: getUint32(dataView, offset + HEADER_OFFSET_SIGNATURE),
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
	if (extraFieldAES) {
		readExtraFieldAES(extraFieldAES, directory, compressionMethod);
		directory.extraFieldAES = extraFieldAES;
	} else {
		directory.compressionMethod = compressionMethod;
	}
	const extraFieldNTFS = extraField.get(EXTRAFIELD_TYPE_NTFS);
	if (extraFieldNTFS) {
		readExtraFieldNTFS(extraFieldNTFS, directory);
		directory.extraFieldNTFS = extraFieldNTFS;
	}
	const extraFieldUnix = extraField.get(EXTRAFIELD_TYPE_UNIX);
	if (extraFieldUnix) {
		readExtraFieldUnix(extraFieldUnix, directory, false);
		directory.extraFieldUnix = extraFieldUnix;
	} else {
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
}

function readExtraFieldZip64(extraFieldZip64, directory) {
	directory.zip64 = true;
	const extraFieldView = getDataView(extraFieldZip64.data);
	const missingProperties = ZIP64_PROPERTIES.filter(([propertyName, max]) => directory[propertyName] == max);
	for (let indexMissingProperty = 0, offset = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
		const [propertyName, max] = missingProperties[indexMissingProperty];
		if (directory[propertyName] == max) {
			const extraction = ZIP64_EXTRACTION[max];
			directory[propertyName] = extraFieldZip64[propertyName] = extraction.getValue(extraFieldView, offset);
			offset += extraction.bytes;
		} else if (extraFieldZip64[propertyName]) {
			throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
		}
	}
}

function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
	const extraFieldView = getDataView(extraFieldUnicode.data);
	const crc32 = new Crc32();
	crc32.append(fileEntry[rawPropertyName]);
	const dataViewSignature = getDataView(new Uint8Array(4));
	dataViewSignature.setUint32(0, crc32.get(), true);
	const signature = getUint32(extraFieldView, 1);
	Object.assign(extraFieldUnicode, {
		version: getUint8(extraFieldView, 0),
		[propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
		valid: !fileEntry.bitFlag.languageEncodingFlag && signature == getUint32(dataViewSignature, 0)
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
	try {
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
			Object.assign(directory, extraFieldData);
		}
	} catch {
		// ignored
	}
}

function readExtraFieldUnix(extraField, directory, isInfoZip) {
	try {
		const view = getDataView(new Uint8Array(extraField.data));
		let offset = 0;
		const version = getUint8(view, offset++);
		const uidSize = getUint8(view, offset++);
		const uidBytes = extraField.data.subarray(offset, offset + uidSize);
		offset += uidSize;
		const uid = unpackUnixId(uidBytes);
		const gidSize = getUint8(view, offset++);
		const gidBytes = extraField.data.subarray(offset, offset + gidSize);
		offset += gidSize;
		const gid = unpackUnixId(gidBytes);
		let unixMode = UNDEFINED_VALUE;
		if (!isInfoZip && offset + 2 <= extraField.data.length) {
			const base = extraField.data;
			const modeView = new DataView(base.buffer, base.byteOffset + offset, 2);
			unixMode = modeView.getUint16(0, true);
		}
		Object.assign(extraField, { version, uid, gid, unixMode });
		if (uid !== UNDEFINED_VALUE) {
			directory.uid = uid;
		}
		if (gid !== UNDEFINED_VALUE) {
			directory.gid = gid;
		}
		if (unixMode !== UNDEFINED_VALUE) {
			directory.unixMode = unixMode;
		}
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
			directory[propertyName] = extraFieldExtendedTimestamp[propertyName] = new Date(time * 1000);
			const rawPropertyName = timeRawProperties[indexProperty];
			extraFieldExtendedTimestamp[rawPropertyName] = time;
		}
		offset += 4;
	});
}

async function detectOverlappingEntry({
	reader,
	fileEntry,
	offset,
	diskNumberStart,
	signature,
	compressedSize,
	uncompressedSize,
	dataOffset,
	dataDescriptor,
	extraFieldZip64,
	readRanges
}) {
	let diskOffset = 0;
	if (diskNumberStart) {
		for (let indexReader = 0; indexReader < diskNumberStart; indexReader++) {
			const diskReader = reader.readers[indexReader];
			diskOffset += diskReader.size;
		}
	}
	let dataDescriptorLength = 0;
	if (dataDescriptor) {
		if (extraFieldZip64) {
			dataDescriptorLength = DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH;
		} else {
			dataDescriptorLength = DATA_DESCRIPTOR_RECORD_LENGTH;
		}
	}
	if (dataDescriptorLength) {
		const dataDescriptorArray = await readUint8Array(reader, dataOffset + compressedSize, dataDescriptorLength + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH, diskNumberStart);
		const dataDescriptorSignature = getUint32(getDataView(dataDescriptorArray), 0) == DATA_DESCRIPTOR_RECORD_SIGNATURE;
		if (dataDescriptorSignature) {
			const readSignature = getUint32(getDataView(dataDescriptorArray), 4);
			let readCompressedSize;
			let readUncompressedSize;
			if (extraFieldZip64) {
				readCompressedSize = getBigUint64(getDataView(dataDescriptorArray), 8);
				readUncompressedSize = getBigUint64(getDataView(dataDescriptorArray), 16);
			} else {
				readCompressedSize = getUint32(getDataView(dataDescriptorArray), 8);
				readUncompressedSize = getUint32(getDataView(dataDescriptorArray), 12);
			}
			const matchSignature = (fileEntry.encrypted && !fileEntry.zipCrypto) || readSignature == signature;
			if (matchSignature &&
				readCompressedSize == compressedSize &&
				readUncompressedSize == uncompressedSize) {
				dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
			}
		}
	}
	const range = {
		start: diskOffset + offset,
		end: diskOffset + dataOffset + compressedSize + dataDescriptorLength,
		fileEntry
	};
	for (const otherRange of readRanges) {
		if (otherRange.fileEntry != fileEntry && range.start >= otherRange.start && range.start < otherRange.end) {
			const error = new Error(ERR_OVERLAPPING_ENTRY);
			error.overlappingEntry = otherRange.fileEntry;
			throw error;
		}
	}
	readRanges.push(range);
}

async function seekSignature(reader, signature, startOffset, minimumBytes, maximumLength) {
	const signatureArray = new Uint8Array(4);
	const signatureView = getDataView(signatureArray);
	setUint32(signatureView, 0, signature);
	const maximumBytes = minimumBytes + maximumLength;
	return (await seek(minimumBytes)) || await seek(Math.min(maximumBytes, startOffset));

	async function seek(length) {
		const offset = startOffset - length;
		const bytes = await readUint8Array(reader, offset, length);
		for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) {
			if (bytes[indexByte] == signatureArray[0] && bytes[indexByte + 1] == signatureArray[1] &&
				bytes[indexByte + 2] == signatureArray[2] && bytes[indexByte + 3] == signatureArray[3]) {
				return {
					offset: offset + indexByte,
					buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
				};
			}
		}
	}
}

function getOptionValue(zipReader, options, name) {
	return options[name] === UNDEFINED_VALUE ? zipReader.options[name] : options[name];
}

function getDate(timeRaw) {
	const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & MAX_16_BITS;
	try {
		return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
	} catch {
		// ignored
	}
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
	return Number(view.getBigUint64(offset, true));
}

function setUint32(view, offset, value) {
	view.setUint32(offset, value, true);
}

function getDataView(array) {
	return new DataView(array.buffer);
}
