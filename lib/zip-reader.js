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
	EXTRA_FIELD_TYPE_ZIP64,
	EXTRA_FIELD_TYPE_UNICODE_PATH,
	EXTRA_FIELD_TYPE_AES,
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
import { createCodec, CODEC_INFLATE, ERR_INVALID_SIGNATURE, ERR_INVALID_PASSORD } from "./workers.js";
import Crc32 from "./codecs/crc32.js";
import processData from "./engine.js";

const ERR_BAD_FORMAT = "File format is not recognized";
const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
const ERR_EOCDR_ZIP64_NOT_FOUND = "End of Zip64 central directory not found";
const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
const ERR_ENCRYPTED = "File contains encrypted entry";
const ERR_UNSUPPORTED_ENCRYPTION = "Encryption not supported";
const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
const CHARSET_UTF8 = "utf-8";
const CHARSET_WIN_1252 = "windows-1252";
const ZIP64_PROPERTIES = ["uncompressedSize", "compressedSize", "offset"];

class ZipReader {

	constructor(reader, options = {}, config = {}) {
		this.reader = reader;
		this.options = options;
		this.config = config;
	}

	async getEntries() {
		const reader = this.reader;
		if (!reader.initialized) {
			await reader.init();
		}
		const directoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS);
		let zip64, directoryDataView = new DataView(directoryInfo.buffer);
		let directoryDataLength = directoryDataView.getUint32(16, true);
		let filesLength = directoryDataView.getUint16(8, true);
		if (directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS) {
			zip64 = true;
			const directoryLocatorArray = await reader.readUint8Array(directoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);
			const directoryLocatorView = new DataView(directoryLocatorArray.buffer);
			if (Number(directoryLocatorView.getUint32(0, false)) != ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
				throw new Error(ERR_EOCDR_ZIP64_NOT_FOUND);
			}
			directoryDataLength = Number(directoryLocatorView.getBigUint64(8, true));
			const directoryDataArray = await reader.readUint8Array(directoryDataLength, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
			const directoryDataView = new DataView(directoryDataArray.buffer);
			if (Number(directoryDataView.getUint32(0, false)) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
				throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
			}
			filesLength = Number(directoryDataView.getBigUint64(24, true));
			directoryDataLength -= Number(directoryDataView.getBigUint64(40, true));
		}
		if (directoryDataLength < 0 || (!zip64 && (directoryDataLength >= reader.size || filesLength >= MAX_16_BITS))) {
			throw new Error(ERR_BAD_FORMAT);
		}
		const directoryDataArray = await reader.readUint8Array(directoryDataLength, reader.size - directoryDataLength);
		directoryDataView = new DataView(directoryDataArray.buffer);
		const entries = [];
		let offset = 0;
		for (let indexFile = 0; indexFile < filesLength; indexFile++) {
			const fileEntry = new Entry(this.reader, this.config, this.options);
			if (directoryDataView.getUint32(offset, false) != CENTRAL_FILE_HEADER_SIGNATURE) {
				throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
			}
			fileEntry.compressedSize = 0;
			fileEntry.uncompressedSize = 0;
			readCommonHeader(fileEntry, directoryDataView, offset + 6);
			fileEntry.commentLength = directoryDataView.getUint16(offset + 32, true);
			fileEntry.directory = ((directoryDataView.getUint8(offset + 38) & FILE_ATTR_MSDOS_DIR_MASK) == FILE_ATTR_MSDOS_DIR_MASK);
			fileEntry.offset = directoryDataView.getUint32(offset + 42, true);
			fileEntry.rawFilename = directoryDataArray.subarray(offset + 46, offset + 46 + fileEntry.filenameLength);
			fileEntry.filename = decodeString(fileEntry.rawFilename, fileEntry.bitFlag.languageEncodingFlag ? CHARSET_UTF8 : this.options.filenameEncoding || CHARSET_WIN_1252);
			if (!fileEntry.directory && fileEntry.filename && fileEntry.filename.charAt(fileEntry.filename.length - 1) == DIRECTORY_SIGNATURE) {
				fileEntry.directory = true;
			}
			fileEntry.rawExtraField = directoryDataArray.subarray(offset + 46 + fileEntry.filenameLength, offset + 46 + fileEntry.filenameLength + fileEntry.extraFieldLength);
			readCommonFooter(fileEntry, fileEntry, directoryDataView, offset + 6);
			fileEntry.rawComment = directoryDataArray.subarray(offset + 46 + fileEntry.filenameLength + fileEntry.extraFieldLength, offset + 46
				+ fileEntry.filenameLength + fileEntry.extraFieldLength + fileEntry.commentLength);
			fileEntry.comment = decodeString(fileEntry.rawComment, fileEntry.bitFlag.languageEncodingFlag ? CHARSET_UTF8 : this.options.commentEncoding || CHARSET_WIN_1252);
			entries.push(fileEntry);
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
	ERR_INVALID_PASSORD
};

class Entry {

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
		const dataArray = await reader.readUint8Array(this.offset, 30);
		const dataView = new DataView(dataArray.buffer);
		const password = options.password === undefined ? this.options.password : options.password;
		let inputPassword = password && password.length && password;
		if (this.extraFieldAES) {
			if (this.extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
			if (this.extraFieldAES.strength != 3) {
				throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
			}
		}
		if (this.compressionMethod != COMPRESSION_METHOD_STORE && this.compressionMethod != COMPRESSION_METHOD_DEFLATE) {
			throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		}
		if (dataView.getUint32(0, false) != LOCAL_FILE_HEADER_SIGNATURE) {
			throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
		}
		const localDirectory = this.localDirectory = {};
		readCommonHeader(localDirectory, dataView, 4);
		localDirectory.rawExtraField = dataArray.subarray(this.offset + 30 + localDirectory.filenameLength, this.offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength);
		readCommonFooter(this, localDirectory, dataView, 4);
		let dataOffset = this.offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength;
		const inputEncrypted = this.bitFlag.encrypted && localDirectory.bitFlag.encrypted;
		if (inputEncrypted && !inputPassword) {
			throw new Error(ERR_ENCRYPTED);
		}
		const codec = await createCodec(this.config, {
			codecType: CODEC_INFLATE,
			inputPassword,
			inputSigned: options.checkSignature === undefined ? this.options.checkSignature : options.checkSignature,
			inputSignature: this.signature,
			inputCompressed: this.compressionMethod != 0,
			inputEncrypted
		});
		if (!writer.initialized) {
			await writer.init();
		}
		await processData(codec, reader, writer, dataOffset, this.compressedSize, this.config, { onprogress: options.onprogress });
		return writer.getData();
	}
}

function readCommonHeader(directory, dataView, offset) {
	directory.version = dataView.getUint16(offset, true);
	const rawBitFlag = directory.rawBitFlag = dataView.getUint16(offset + 2, true);
	directory.bitFlag = {
		encrypted: (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED,
		level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
		dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
		languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
	};
	directory.encrypted = directory.bitFlag.encrypted;
	directory.rawLastModDate = dataView.getUint32(offset + 6, true);
	directory.lastModDate = getDate(directory.rawLastModDate);
	directory.filenameLength = dataView.getUint16(offset + 22, true);
	directory.extraFieldLength = dataView.getUint16(offset + 24, true);
}

function readCommonFooter(fileEntry, directory, dataView, offset) {
	let extraFieldZip64, extraFieldAES, extraFieldUnicodePath;
	const rawExtraField = directory.rawExtraField;
	const extraField = directory.extraField = new Map();
	const rawExtraFieldView = new DataView(new Uint8Array(rawExtraField).buffer);
	let offsetExtraField = 0;
	try {
		while (offsetExtraField < rawExtraField.length) {
			const type = rawExtraFieldView.getUint16(offsetExtraField, true);
			const size = rawExtraFieldView.getUint16(offsetExtraField + 2, true);
			extraField.set(type, {
				type,
				data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
			});
			offsetExtraField += 4 + size;
		}
	} catch (error) {
		// ignored
	}
	const compressionMethod = dataView.getUint16(offset + 4, true);
	directory.signature = dataView.getUint32(offset + 10, true);
	directory.uncompressedSize = dataView.getUint32(offset + 18, true);
	directory.compressedSize = dataView.getUint32(offset + 14, true);
	extraFieldZip64 = directory.extraFieldZip64 = extraField.get(EXTRA_FIELD_TYPE_ZIP64);
	if (extraFieldZip64) {
		readExtraFieldZip64(extraFieldZip64, directory);
	}
	extraFieldUnicodePath = directory.extraFieldUnicodePath = extraField.get(EXTRA_FIELD_TYPE_UNICODE_PATH);
	if (extraFieldUnicodePath) {
		readExtraFieldUnicodePath(extraFieldUnicodePath, directory, fileEntry);
	}
	extraFieldAES = directory.extraFieldAES = extraField.get(EXTRA_FIELD_TYPE_AES);
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
		extraFieldZip64.values.push(Number(extraFieldView.getBigUint64(0 + indexValue * 8, true)));
	}
	const missingProperties = ZIP64_PROPERTIES.filter(propertyName => directory[propertyName] == MAX_32_BITS);
	for (let indexMissingProperty = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
		extraFieldZip64[missingProperties[indexMissingProperty]] = extraFieldZip64.values[indexMissingProperty];
	}
	ZIP64_PROPERTIES.forEach(propertyName => {
		if (directory[propertyName] == MAX_32_BITS) {
			if (extraFieldZip64 && extraFieldZip64[propertyName] !== undefined) {
				directory[propertyName] = extraFieldZip64 && extraFieldZip64[propertyName];
			} else {
				throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
			}
		}
	});
}

function readExtraFieldUnicodePath(extraFieldUnicodePath, directory, fileEntry) {
	const extraFieldView = new DataView(extraFieldUnicodePath.data.buffer);
	extraFieldUnicodePath.version = extraFieldView.getUint8(0);
	extraFieldUnicodePath.signature = extraFieldView.getUint32(1, true);
	const crc32 = new Crc32();
	crc32.append(fileEntry.rawFilename);
	const dataViewSignature = new DataView(new Uint8Array(4).buffer);
	dataViewSignature.setUint32(0, crc32.get());
	extraFieldUnicodePath.filename = (new TextDecoder()).decode(extraFieldUnicodePath.data.subarray(5));
	if (extraFieldUnicodePath.signature == dataViewSignature.getUint32(0, false)) {
		directory.filename = extraFieldUnicodePath.filename;
	}
}

function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
	if (extraFieldAES) {
		const extraFieldView = new DataView(extraFieldAES.data.buffer);
		extraFieldAES.vendorVersion = extraFieldView.getUint8(0);
		extraFieldAES.vendorId = extraFieldView.getUint8(2);
		const strength = extraFieldView.getUint8(4);
		extraFieldAES.strength = strength;
		extraFieldAES.originalCompressionMethod = compressionMethod;
		directory.compressionMethod = extraFieldAES.compressionMethod = extraFieldView.getUint16(5, true);
	} else {
		directory.compressionMethod = compressionMethod;
	}
}

async function seekSignature(reader, signature, minimumBytes, maximumLength) {
	const signatureArray = new Uint8Array(4);
	const signatureView = new DataView(signatureArray.buffer);
	signatureView.setUint32(0, signature);
	if (reader.size < minimumBytes) {
		throw new Error(ERR_BAD_FORMAT);
	}
	const maximumBytes = minimumBytes + maximumLength;
	let offset = minimumBytes;
	let dataInfo = await seek(offset);
	if (!dataInfo) {
		dataInfo = await seek(Math.min(maximumBytes, reader.size));
	}
	if (!dataInfo) {
		throw new Error(ERR_EOCDR_NOT_FOUND);
	}
	return dataInfo;

	async function seek(length) {
		const offset = reader.size - length;
		const bytes = await reader.readUint8Array(offset, length);
		for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) {
			if (bytes[indexByte] == signatureArray[0] && bytes[indexByte + 1] == signatureArray[1] &&
				bytes[indexByte + 2] == signatureArray[2] && bytes[indexByte + 3] == signatureArray[3]) {
				return {
					offset,
					buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
				};
			}
		}
	}
}

function decodeString(value, encoding) {
	return (new TextDecoder(encoding)).decode(value);
}

function getDate(timeRaw) {
	const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
	try {
		return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
	} catch (error) {
		// ignored
	}
}