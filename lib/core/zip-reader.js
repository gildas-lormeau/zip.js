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

/* global TextDecoder */

"use strict";

import {
	MAX_32_BITS,
	MAX_16_BITS,
	COMPRESSION_METHOD_DEFLATE,
	COMPRESSION_METHOD_STORE,
	COMPRESSION_METHOD_AES,
	LOCAL_FILE_HEADER_SIGNATURE,
	CENTRAL_FILE_HEADER_SIGNATURE,
	END_OF_CENTRAL_DIR_SIGNATURE,
	ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE,
	ZIP64_END_OF_CENTRAL_DIR_SIGNATURE,
	EXTRAFIELD_TYPE_ZIP64,
	EXTRAFIELD_TYPE_UNICODE_PATH,
	EXTRAFIELD_TYPE_UNICODE_COMMENT,
	EXTRAFIELD_TYPE_AES,
	END_OF_CENTRAL_DIR_LENGTH,
	ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH,
	ZIP64_END_OF_CENTRAL_DIR_LENGTH,
	BITFLAG_ENCRYPTED,
	BITFLAG_LEVEL,
	BITFLAG_DATA_DESCRIPTOR,
	BITFLAG_ENHANCED_DEFLATING,
	BITFLAG_LANG_ENCODING_FLAG,
	FILE_ATTR_MSDOS_DIR_MASK,
	DIRECTORY_SIGNATURE
} from "./constants.js";
import { getConfiguration } from "./configuration.js";
import decodeCP437 from "./util/cp437-decode.js";
import { createCodec, CODEC_INFLATE, ERR_INVALID_SIGNATURE, ERR_INVALID_PASSWORD } from "./codecs/codec-pool.js";
import Crc32 from "./codecs/crc32.js";
import { processData } from "./engine.js";
import Entry from "./zip-entry.js";

const ERR_BAD_FORMAT = "File format is not recognized";
const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
const ERR_EOCDR_ZIP64_NOT_FOUND = "End of Zip64 central directory not found";
const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
const ERR_ENCRYPTED = "File contains encrypted entry";
const ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
const CHARSET_UTF8 = "utf-8";
const ZIP64_PROPERTIES = ["uncompressedSize", "compressedSize", "offset"];

class ZipReader {

	constructor(reader, options = {}) {
		this.reader = reader;
		this.options = options;
		this.config = getConfiguration();
	}

	async getEntries(options = {}) {
		const reader = this.reader;
		if (!reader.initialized) {
			await reader.init();
		}
		if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
			throw new Error(ERR_BAD_FORMAT);
		}
		const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS * 16);
		if (!endOfDirectoryInfo) {
			throw new Error(ERR_EOCDR_NOT_FOUND);
		}
		const endOfDirectoryView = new DataView(endOfDirectoryInfo.buffer);
		let directoryDataLength = getUint32(endOfDirectoryView, 12);
		let directoryDataOffset = getUint32(endOfDirectoryView, 16);
		let filesLength = getUint16(endOfDirectoryView, 8);
		let prependedBytesLength = 0;
		if (directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS) {
			const endOfDirectoryLocatorArray = await reader.readUint8Array(endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);
			const endOfDirectoryLocatorView = new DataView(endOfDirectoryLocatorArray.buffer);
			if (getUint32(endOfDirectoryLocatorView, 0) != ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
				throw new Error(ERR_EOCDR_ZIP64_NOT_FOUND);
			}
			directoryDataOffset = getBigUint64(endOfDirectoryLocatorView, 8);
			let endOfDirectoryArray = await reader.readUint8Array(directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
			let endOfDirectoryView = new DataView(endOfDirectoryArray.buffer);
			const computedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
			if (getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE && directoryDataOffset != computedDirectoryDataOffset) {
				const originalDirectoryDataOffset = directoryDataOffset;
				directoryDataOffset = computedDirectoryDataOffset;
				prependedBytesLength = directoryDataOffset - originalDirectoryDataOffset;
				endOfDirectoryArray = await reader.readUint8Array(directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
				endOfDirectoryView = new DataView(endOfDirectoryArray.buffer);
			}
			if (getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
				throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
			}
			filesLength = getBigUint64(endOfDirectoryView, 24);
			directoryDataLength = getBigUint64(endOfDirectoryLocatorView, 4);
			directoryDataOffset -= getBigUint64(endOfDirectoryView, 40);
		}
		if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
			throw new Error(ERR_BAD_FORMAT);
		}
		let offset = 0;
		let directoryArray = await reader.readUint8Array(directoryDataOffset, reader.size - directoryDataOffset);
		let directoryView = new DataView(directoryArray.buffer);
		const computedDirectoryDataOffset = endOfDirectoryInfo.offset - directoryDataLength;
		if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE && directoryDataOffset != computedDirectoryDataOffset) {
			const originalDirectoryDataOffset = directoryDataOffset;
			directoryDataOffset = computedDirectoryDataOffset;
			prependedBytesLength = directoryDataOffset - originalDirectoryDataOffset;
			directoryArray = await reader.readUint8Array(directoryDataOffset, reader.size - directoryDataOffset);
			directoryView = new DataView(directoryArray.buffer);
		}
		if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
			throw new Error(ERR_BAD_FORMAT);
		}
		const entries = [];
		for (let indexFile = 0; indexFile < filesLength; indexFile++) {
			const fileEntry = new ZipEntry(this.reader, this.config, this.options);
			if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
				throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
			}
			fileEntry.compressedSize = 0;
			fileEntry.uncompressedSize = 0;
			readCommonHeader(fileEntry, directoryView, offset + 6);
			fileEntry.commentLength = getUint16(directoryView, offset + 32);
			fileEntry.directory = (getUint8(directoryView, offset + 38) & FILE_ATTR_MSDOS_DIR_MASK) == FILE_ATTR_MSDOS_DIR_MASK;
			fileEntry.offset = getUint32(directoryView, offset + 42) + prependedBytesLength;
			fileEntry.rawFilename = directoryArray.subarray(offset + 46, offset + 46 + fileEntry.filenameLength);
			const filenameEncoding = getOptionValue(this, options, "filenameEncoding");
			fileEntry.filenameUTF8 = fileEntry.commentUTF8 = Boolean(fileEntry.bitFlag.languageEncodingFlag);
			fileEntry.filename = decodeString(fileEntry.rawFilename, fileEntry.filenameUTF8 ? CHARSET_UTF8 : filenameEncoding);
			if (!fileEntry.directory && fileEntry.filename.endsWith(DIRECTORY_SIGNATURE)) {
				fileEntry.directory = true;
			}
			fileEntry.rawExtraField = directoryArray.subarray(offset + 46 + fileEntry.filenameLength, offset + 46 + fileEntry.filenameLength + fileEntry.extraFieldLength);
			fileEntry.rawComment = directoryArray.subarray(offset + 46 + fileEntry.filenameLength + fileEntry.extraFieldLength, offset + 46
				+ fileEntry.filenameLength + fileEntry.extraFieldLength + fileEntry.commentLength);
			const commentEncoding = getOptionValue(this, options, "commentEncoding");
			fileEntry.comment = decodeString(fileEntry.rawComment, fileEntry.commentUTF8 ? CHARSET_UTF8 : commentEncoding);
			readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
			const entry = new Entry(fileEntry);
			entry.getData = (writer, options) => fileEntry.getData(writer, options);
			entries.push(entry);
			offset += 46 + fileEntry.filenameLength + fileEntry.extraFieldLength + fileEntry.commentLength;
		}
		return entries;
	}

	async close() {
	}
}

export {
	ZipReader,
	ERR_BAD_FORMAT,
	ERR_EOCDR_NOT_FOUND,
	ERR_EOCDR_ZIP64_NOT_FOUND,
	ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND,
	ERR_CENTRAL_DIRECTORY_NOT_FOUND,
	ERR_LOCAL_FILE_HEADER_NOT_FOUND,
	ERR_EXTRAFIELD_ZIP64_NOT_FOUND,
	ERR_ENCRYPTED,
	ERR_UNSUPPORTED_ENCRYPTION,
	ERR_UNSUPPORTED_COMPRESSION,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSWORD
};

class ZipEntry {

	constructor(reader, config, options) {
		this.reader = reader;
		this.config = config;
		this.options = options;
	}

	async getData(writer, options = {}) {
		const reader = this.reader;
		if (!reader.initialized) {
			await reader.init();
		}
		const offset = this.offset;
		const dataArray = await reader.readUint8Array(offset, 30);
		const dataView = new DataView(dataArray.buffer);
		const extraFieldAES = this.extraFieldAES;
		const compressionMethod = this.compressionMethod;
		const config = this.config;
		const bitFlag = this.bitFlag;
		const signature = this.signature;
		let password = getOptionValue(this, options, "password");
		password = password && password.length && password;
		if (extraFieldAES) {
			if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
		}
		if (compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE) {
			throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		}
		if (getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
			throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
		}
		const localDirectory = this.localDirectory = {};
		readCommonHeader(localDirectory, dataView, 4);
		localDirectory.rawExtraField = dataArray.subarray(offset + 30 + localDirectory.filenameLength, offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength);
		readCommonFooter(this, localDirectory, dataView, 4);
		const dataOffset = offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength;
		const encrypted = bitFlag.encrypted && localDirectory.bitFlag.encrypted;
		const zipCrypto = encrypted && !extraFieldAES;
		if (encrypted) {
			if (!zipCrypto && extraFieldAES.strength === undefined) {
				throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
			} else if (!password) {
				throw new Error(ERR_ENCRYPTED);
			}
		}
		const codec = await createCodec(config.Inflate, {
			codecType: CODEC_INFLATE,
			password,
			zipCrypto,
			encryptionStrength: extraFieldAES && extraFieldAES.strength,
			signed: getOptionValue(this, options, "checkSignature"),
			passwordVerification: zipCrypto && (bitFlag.dataDescriptor ? ((this.rawLastModDate >>> 8) & 0xFF) : ((signature >>> 24) & 0xFF)),
			signature,
			compressed: compressionMethod != 0,
			encrypted,
			useWebWorkers: getOptionValue(this, options, "useWebWorkers")
		}, config);
		if (!writer.initialized) {
			await writer.init();
		}
		await processData(codec, reader, writer, dataOffset, this.compressedSize, config, { onprogress: options.onprogress, signal: getOptionValue(this, options, "signal") });
		return writer.getData();
	}
}

function readCommonHeader(directory, dataView, offset) {
	directory.version = getUint16(dataView, offset);
	const rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
	directory.bitFlag = {
		encrypted: (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED,
		level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
		dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
		languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
	};
	directory.encrypted = directory.bitFlag.encrypted;
	directory.rawLastModDate = getUint32(dataView, offset + 6);
	directory.lastModDate = getDate(directory.rawLastModDate);
	directory.filenameLength = getUint16(dataView, offset + 22);
	directory.extraFieldLength = getUint16(dataView, offset + 24);
}

function readCommonFooter(fileEntry, directory, dataView, offset) {
	const rawExtraField = directory.rawExtraField;
	const extraField = directory.extraField = new Map();
	const rawExtraFieldView = new DataView(new Uint8Array(rawExtraField).buffer);
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
	} catch (error) {
		// ignored
	}
	const compressionMethod = getUint16(dataView, offset + 4);
	directory.signature = getUint32(dataView, offset + 10);
	directory.uncompressedSize = getUint32(dataView, offset + 18);
	directory.compressedSize = getUint32(dataView, offset + 14);
	const extraFieldZip64 = directory.extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
	if (extraFieldZip64) {
		readExtraFieldZip64(extraFieldZip64, directory);
	}
	const extraFieldUnicodePath = directory.extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
	if (extraFieldUnicodePath) {
		readExtraFieldUnicode(extraFieldUnicodePath, "filename", "rawFilename", directory, fileEntry);
	}
	const extraFieldUnicodeComment = directory.extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
	if (extraFieldUnicodeComment) {
		readExtraFieldUnicode(extraFieldUnicodeComment, "comment", "rawComment", directory, fileEntry);
	}
	const extraFieldAES = directory.extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
	if (extraFieldAES) {
		readExtraFieldAES(extraFieldAES, directory, compressionMethod);
	} else {
		directory.compressionMethod = compressionMethod;
	}
	if (directory.compressionMethod == COMPRESSION_METHOD_DEFLATE) {
		directory.bitFlag.enhancedDeflating = (directory.rawBitFlag & BITFLAG_ENHANCED_DEFLATING) != BITFLAG_ENHANCED_DEFLATING;
	}
}

function readExtraFieldZip64(extraFieldZip64, directory) {
	directory.zip64 = true;
	const extraFieldView = new DataView(extraFieldZip64.data.buffer);
	extraFieldZip64.values = [];
	for (let indexValue = 0; indexValue < Math.floor(extraFieldZip64.data.length / 8); indexValue++) {
		extraFieldZip64.values.push(getBigUint64(extraFieldView, 0 + indexValue * 8));
	}
	const missingProperties = ZIP64_PROPERTIES.filter(propertyName => directory[propertyName] == MAX_32_BITS);
	for (let indexMissingProperty = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
		extraFieldZip64[missingProperties[indexMissingProperty]] = extraFieldZip64.values[indexMissingProperty];
	}
	ZIP64_PROPERTIES.forEach(propertyName => {
		if (directory[propertyName] == MAX_32_BITS) {
			if (extraFieldZip64 && extraFieldZip64[propertyName] !== undefined) {
				directory[propertyName] = extraFieldZip64[propertyName];
			} else {
				throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
			}
		}
	});
}

function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
	const extraFieldView = new DataView(extraFieldUnicode.data.buffer);
	extraFieldUnicode.version = getUint8(extraFieldView, 0);
	extraFieldUnicode.signature = getUint32(extraFieldView, 1);
	const crc32 = new Crc32();
	crc32.append(fileEntry[rawPropertyName]);
	const dataViewSignature = new DataView(new Uint8Array(4).buffer);
	dataViewSignature.setUint32(0, crc32.get(), true);
	extraFieldUnicode[propertyName] = (new TextDecoder()).decode(extraFieldUnicode.data.subarray(5));
	extraFieldUnicode.valid = !fileEntry.bitFlag.languageEncodingFlag && extraFieldUnicode.signature == getUint32(dataViewSignature, 0);
	if (extraFieldUnicode.valid) {
		directory[propertyName] = extraFieldUnicode[propertyName];
		directory[propertyName + "UTF8"] = true;
	}
}

function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
	if (extraFieldAES) {
		const extraFieldView = new DataView(extraFieldAES.data.buffer);
		extraFieldAES.vendorVersion = getUint8(extraFieldView, 0);
		extraFieldAES.vendorId = getUint8(extraFieldView, 2);
		const strength = getUint8(extraFieldView, 4);
		extraFieldAES.strength = strength;
		extraFieldAES.originalCompressionMethod = compressionMethod;
		directory.compressionMethod = extraFieldAES.compressionMethod = getUint16(extraFieldView, 5);
	} else {
		directory.compressionMethod = compressionMethod;
	}
}

async function seekSignature(reader, signature, minimumBytes, maximumLength) {
	const signatureArray = new Uint8Array(4);
	const signatureView = new DataView(signatureArray.buffer);
	setUint32(signatureView, 0, signature);
	const maximumBytes = minimumBytes + maximumLength;
	return (await seek(minimumBytes)) || await seek(Math.min(maximumBytes, reader.size));

	async function seek(length) {
		const offset = reader.size - length;
		const bytes = await reader.readUint8Array(offset, length);
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
	return options[name] === undefined ? zipReader.options[name] : options[name];
}

function decodeString(value, encoding) {
	if (!encoding || encoding.trim().toLowerCase() == "cp437") {
		return decodeCP437(value);
	} else {
		return (new TextDecoder(encoding)).decode(value);
	}
}

function getDate(timeRaw) {
	const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
	try {
		return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
	} catch (error) {
		// ignored
	}
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