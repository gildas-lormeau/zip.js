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

/* globals TextDecoder*/

"use strict";

const ERR_BAD_FORMAT = "File format is not recognized";
const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
const ERR_EOCDR_ZIP64_NOT_FOUND = "End of Zip64 central directory not found";
const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
const ERR_EXTRA_FIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
const ERR_ENCRYPTED = "File contains encrypted entry";
const ERR_UNSUPPORTED_ENCRYPTION = "Encryption not supported";
const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
const MAX_ZIP_COMMENT_SIZE = 65536;
const CHARSET_UTF8 = "utf-8";
const CHARSET_WIN_1252 = "windows-1252";

import { CODEC_INFLATE, createCodec, ERR_INVALID_SIGNATURE, ERR_INVALID_PASSORD } from "./codec.js";
import processData from "./engine.js";

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
		const directoryInfo = await seekSignature(reader, [0x50, 0x4b, 0x05, 0x06], 22, MAX_ZIP_COMMENT_SIZE);
		let zip64, directoryDataView = new DataView(directoryInfo.buffer);
		let dataLength = directoryDataView.getUint32(16, true);
		let filesLength = directoryDataView.getUint16(8, true);
		if (dataLength == 0xffffffff || filesLength == 0xffff) {
			zip64 = true;
			const directoryLocatorArray = await reader.readUint8Array(directoryInfo.offset - 20, 20);
			const directoryLocatorView = new DataView(directoryLocatorArray.buffer);
			if (Number(directoryLocatorView.getUint32(0, false)) != 0x504b0607) {
				throw new Error(ERR_EOCDR_ZIP64_NOT_FOUND);
			}
			dataLength = Number(directoryLocatorView.getBigUint64(8, true));
			const directoryDataArray = await reader.readUint8Array(dataLength, 56);
			const directoryDataView = new DataView(directoryDataArray.buffer);
			if (Number(directoryDataView.getUint32(0, false)) != 0x504b0606) {
				throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
			}
			filesLength = Number(directoryDataView.getBigUint64(24, true));
			dataLength -= Number(directoryDataView.getBigUint64(40, true));
		}
		if (dataLength < 0 || (!zip64 && (dataLength >= reader.size || filesLength >= 0xffff))) {
			throw new Error(ERR_BAD_FORMAT);
		}
		const dataArray = await reader.readUint8Array(dataLength, reader.size - dataLength);
		directoryDataView = new DataView(dataArray.buffer);
		const entries = [];
		let offset = 0;
		for (let indexFile = 0; indexFile < filesLength; indexFile++) {
			const entry = new Entry(this.reader, this.config, this.options);
			if (directoryDataView.getUint32(offset, false) != 0x504b0102) {
				throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
			}
			entry.compressedSize = 0;
			entry.uncompressedSize = 0;
			readCommonHeader(entry, directoryDataView, offset + 6);
			entry.commentLength = directoryDataView.getUint16(offset + 32, true);
			entry.directory = ((directoryDataView.getUint8(offset + 38) & 0x10) == 0x10);
			entry.offset = directoryDataView.getUint32(offset + 42, true);
			entry.rawFilename = dataArray.subarray(offset + 46, offset + 46 + entry.filenameLength);
			entry.filename = decodeString(entry.rawFilename, entry.bitFlag.languageEncodingFlag ? CHARSET_UTF8 : this.options.filenameEncoding || CHARSET_WIN_1252);
			if (!entry.directory && entry.filename.charAt(entry.filename.length - 1) == "/") {
				entry.directory = true;
			}
			entry.rawExtraField = dataArray.subarray(offset + 46 + entry.filenameLength, offset + 46 + entry.filenameLength + entry.extraFieldLength);
			readCommonFooter(entry, directoryDataView, offset + 6);
			if (entry.compressionMethod != 0x0 && entry.compressionMethod != 0x08) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
			entry.rawComment = dataArray.subarray(offset + 46 + entry.filenameLength + entry.extraFieldLength, offset + 46
				+ entry.filenameLength + entry.extraFieldLength + entry.commentLength);
			entry.comment = decodeString(entry.rawComment, entry.bitFlag.languageEncodingFlag ? CHARSET_UTF8 : this.options.commentEncoding || CHARSET_WIN_1252);
			entries.push(entry);
			offset += 46 + entry.filenameLength + entry.extraFieldLength + entry.commentLength;
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
	ERR_EXTRA_FIELD_ZIP64_NOT_FOUND,
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
		if (dataView.getUint32(0, false) != 0x504b0304) {
			throw ERR_LOCAL_FILE_HEADER_NOT_FOUND;
		}
		const localDirectory = this.localDirectory = {};
		readCommonHeader(localDirectory, dataView, 4);
		localDirectory.rawExtraField = dataArray.subarray(this.offset + 30 + localDirectory.filenameLength, this.offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength);
		readCommonFooter(localDirectory, dataView, 4);
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

function readCommonHeader(entry, dataView, offset) {
	entry.version = dataView.getUint16(offset, true);
	const rawBitFlag = entry.rawBitFlag = dataView.getUint16(offset + 2, true);
	entry.bitFlag = {
		encrypted: (rawBitFlag & 0x01) == 0x01,
		level: (rawBitFlag & 0x06) >> 1,
		dataDescriptor: (rawBitFlag & 0x08) == 0x08,
		languageEncodingFlag: (rawBitFlag & 0x0800) == 0x0800
	};
	entry.rawLastModDate = dataView.getUint32(offset + 6, true);
	entry.lastModDate = getDate(entry.rawLastModDate);
	entry.filenameLength = dataView.getUint16(offset + 22, true);
	entry.extraFieldLength = dataView.getUint16(offset + 24, true);
}

function readCommonFooter(entry, dataView, offset) {
	let extraFieldZip64, extraFieldAES, extraFieldUnicodePath;
	const rawExtraField = entry.rawExtraField;
	const extraField = entry.extraField = new Map();
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
	entry.signature = dataView.getUint32(offset + 10, true);
	entry.uncompressedSize = dataView.getUint32(offset + 18, true);
	entry.compressedSize = dataView.getUint32(offset + 14, true);
	extraFieldZip64 = entry.extraFieldZip64 = extraField.get(0x01);
	if (extraFieldZip64) {
		readExtraFieldZip64(extraFieldZip64, entry);
	}
	extraFieldUnicodePath = entry.extraFieldUnicodePath = extraField.get(0x7075);
	if (extraFieldUnicodePath) {
		readExtraFieldUnicodePath(extraFieldUnicodePath, entry);
	}
	extraFieldAES = entry.extraFieldAES = extraField.get(0x9901);
	if (extraFieldAES) {
		readExtraFieldAES(extraFieldAES, entry, compressionMethod);
	} else {
		entry.compressionMethod = compressionMethod;
	}
	if (entry.compressionMethod == 0x08) {
		entry.bitFlag.enhancedDeflating = (entry.rawBitFlag & 0x10) != 0x10;
	}
}

function readExtraFieldZip64(extraFieldZip64, entry) {
	entry.zip64 = true;
	const extraFieldView = new DataView(extraFieldZip64.data.buffer);
	extraFieldZip64.values = [];
	for (let indexValue = 0; indexValue < Math.floor(extraFieldZip64.data.length / 8); indexValue++) {
		extraFieldZip64.values.push(Number(extraFieldView.getBigUint64(0 + indexValue * 8, true)));
	}
	const properties = ["uncompressedSize", "compressedSize", "offset"];
	const missingProperties = properties.filter(propertyName => entry[propertyName] == 0xffffffff);
	for (let indexMissingProperty = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
		extraFieldZip64[missingProperties[indexMissingProperty]] = extraFieldZip64.values[indexMissingProperty];
	}
	properties.forEach(propertyName => {
		if (entry[propertyName] == 0xffffffff) {
			if (extraFieldZip64 && extraFieldZip64[propertyName] !== undefined) {
				entry[propertyName] = extraFieldZip64 && extraFieldZip64[propertyName];
			} else {
				throw new Error(ERR_EXTRA_FIELD_ZIP64_NOT_FOUND);
			}
		}
	});
}

function readExtraFieldUnicodePath(extraFieldUnicodePath, entry) {
	const extraFieldView = new DataView(extraFieldUnicodePath.data.buffer);
	extraFieldUnicodePath.version = extraFieldView.getUint8(0);
	extraFieldUnicodePath.signature = extraFieldView.getUint32(1, true);
	entry.filename = extraFieldUnicodePath.filename = (new TextDecoder()).decode(extraFieldUnicodePath.data.subarray(5));
}

function readExtraFieldAES(extraFieldAES, entry, compressionMethod) {
	if (extraFieldAES) {
		if (compressionMethod != 0x63) {
			throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		}
		const extraFieldView = new DataView(extraFieldAES.data.buffer);
		extraFieldAES.vendorVersion = extraFieldView.getUint8(0);
		extraFieldAES.vendorId = extraFieldView.getUint8(2);
		const strength = extraFieldView.getUint8(4);
		extraFieldAES.compressionMethod = extraFieldView.getUint16(5, true);
		if (strength != 3) {
			throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
		}
		entry.compressionMethod = extraFieldAES.compressionMethod;
	} else {
		entry.compressionMethod = compressionMethod;
	}
}

async function seekSignature(reader, signature, minimumBytes, maximumLength) {
	if (reader.size < minimumBytes) {
		throw new Error(ERR_BAD_FORMAT);
	}
	const maximumBytes = minimumBytes + maximumLength;
	let offset = minimumBytes;
	let directoryInfo = await seek(offset);
	if (!directoryInfo) {
		directoryInfo = await seek(Math.min(maximumBytes, reader.size));
	}
	if (!directoryInfo) {
		throw new Error(ERR_EOCDR_NOT_FOUND);
	}
	return directoryInfo;

	async function seek(length) {
		const offset = reader.size - length;
		const bytes = await reader.readUint8Array(offset, length);
		for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) {
			if (bytes[indexByte] == signature[0] && bytes[indexByte + 1] == signature[1] && bytes[indexByte + 2] == signature[2] && bytes[indexByte + 3] == signature[3]) {
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