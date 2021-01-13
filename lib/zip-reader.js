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

"use strict";

const ERR_BAD_FORMAT = "File format is not recognized.";
const ERR_EOCDR_NOT_FOUND = "End of central directory not found.";
const ERR_ENCRYPTED = "File contains encrypted entry.";
const EXTENDED_US_ASCII = ["\u00C7", "\u00FC", "\u00E9", "\u00E2", "\u00E4", "\u00E0", "\u00E5", "\u00E7", "\u00EA", "\u00EB",
	"\u00E8", "\u00EF", "\u00EE", "\u00EC", "\u00C4", "\u00C5", "\u00C9", "\u00E6", "\u00C6", "\u00F4", "\u00F6", "\u00F2", "\u00FB", "\u00F9",
	"\u00FF", "\u00D6", "\u00DC", "\u00F8", "\u00A3", "\u00D8", "\u00D7", "\u0192", "\u00E1", "\u00ED", "\u00F3", "\u00FA", "\u00F1", "\u00D1",
	"\u00AA", "\u00BA", "\u00BF", "\u00AE", "\u00AC", "\u00BD", "\u00BC", "\u00A1", "\u00AB", "\u00BB", "_", "_", "_", "\u00A6", "\u00A6",
	"\u00C1", "\u00C2", "\u00C0", "\u00A9", "\u00A6", "\u00A6", "+", "+", "\u00A2", "\u00A5", "+", "+", "-", "-", "+", "-", "+", "\u00E3",
	"\u00C3", "+", "+", "-", "-", "\u00A6", "-", "+", "\u00A4", "\u00F0", "\u00D0", "\u00CA", "\u00CB", "\u00C8", "i", "\u00CD", "\u00CE",
	"\u00CF", "+", "+", "_", "_", "\u00A6", "\u00CC", "_", "\u00D3", "\u00DF", "\u00D4", "\u00D2", "\u00F5", "\u00D5", "\u00B5", "\u00FE",
	"\u00DE", "\u00DA", "\u00DB", "\u00D9", "\u00FD", "\u00DD", "\u00AF", "\u00B4", "\u00AD", "\u00B1", "_", "\u00BE", "\u00B6", "\u00A7",
	"\u00F7", "\u00B8", "\u00B0", "\u00A8", "\u00B7", "\u00B9", "\u00B3", "\u00B2", "_", " "];
const MAX_ZIP_COMMENT_SIZE = 65536;

import createCodec from "./codec.js";
import processData from "./processor.js";

class ZipReader {

	constructor(reader, options = {}, config = {}) {
		this.reader = reader;
		this.options = options;
		this.config = config;
	}

	async getEntries() {
		if (!this.reader.initialized) {
			await this.reader.init();
		}
		const directoryInfo = await seekSignature(this.reader, [0x50, 0x4b, 0x05, 0x06], 22, MAX_ZIP_COMMENT_SIZE);
		if (directoryInfo) {
			let zip64, directoryDataView = new DataView(directoryInfo.buffer);
			let dataLength = directoryDataView.getUint32(16, true);
			let filesLength = directoryDataView.getUint16(8, true);
			if (dataLength == 0xffffffff && filesLength == 0xffff) {
				zip64 = true;
				const directoryLocatorArray = await this.reader.readUint8Array(directoryInfo.offset - 20, 20);
				const directoryLocatorView = new DataView(directoryLocatorArray.buffer);
				if (Number(directoryLocatorView.getUint32(0, false)) != 0x504b0607) {
					throw new Error(ERR_BAD_FORMAT);
				}
				dataLength = Number(directoryLocatorView.getBigUint64(8, true));
				const directoryDataArray = await this.reader.readUint8Array(dataLength, 56);
				const directoryDataView = new DataView(directoryDataArray.buffer);
				if (Number(directoryDataView.getUint32(0, false)) != 0x504b0606) {
					throw new Error(ERR_BAD_FORMAT);
				}
				filesLength = Number(directoryDataView.getBigUint64(24, true));
				dataLength -= Number(directoryDataView.getBigUint64(40, true));
			}
			if (dataLength < 0 || (!zip64 && (dataLength >= this.reader.size || filesLength >= 0xffff))) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const dataArray = await this.reader.readUint8Array(dataLength, this.reader.size - dataLength);
			directoryDataView = new DataView(dataArray.buffer);
			const entries = [];
			let offset = 0;
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const entry = new Entry(this);
				if (directoryDataView.getUint32(offset, false) != 0x504b0102) {
					throw new Error(ERR_BAD_FORMAT);
				}
				entry.compressedSize = 0;
				entry.uncompressedSize = 0;
				readCommonHeader(entry, directoryDataView, offset + 6, true);
				entry.commentLength = directoryDataView.getUint16(offset + 32, true);
				entry.directory = ((directoryDataView.getUint8(offset + 38) & 0x10) == 0x10);
				entry.offset = directoryDataView.getUint32(offset + 42, true);
				entry.rawFilename = dataArray.subarray(offset + 46, offset + 46 + entry.filenameLength);
				const filename = getString(entry.rawFilename);
				entry.filename = ((entry.bitFlag & 0x0800) == 0x0800) ? decodeUTF8(filename) : decodeASCII(filename);
				if (!entry.directory && entry.filename.charAt(entry.filename.length - 1) == "/") {
					entry.directory = true;
				}
				entry.extraField = dataArray.subarray(offset + 46 + entry.filenameLength, offset + 46 + entry.filenameLength + entry.extraFieldLength);
				const comment = getString(dataArray.subarray(offset + 46 + entry.filenameLength + entry.extraFieldLength, offset + 46
					+ entry.filenameLength + entry.extraFieldLength + entry.commentLength));
				entry.comment = ((entry.bitFlag & 0x0800) == 0x0800) ? decodeUTF8(comment) : decodeASCII(comment);
				entries.push(entry);
				offset += 46 + entry.filenameLength + entry.extraFieldLength + entry.commentLength;
			}
			return entries;
		} else {
			throw new Error(ERR_EOCDR_NOT_FOUND);
		}
	}

	async close() {
	}
}

export default ZipReader;

class Entry {

	constructor(zipReader) {
		this.reader = zipReader.reader;
		this.config = zipReader.config;
	}

	async getData(writer, options = {}) {
		if (!this.reader.initialized) {
			await this.reader.init();
		}
		const dataArray = await this.reader.readUint8Array(this.offset, 30);
		const dataView = new DataView(dataArray.buffer);
		let inputPassword = options.password && options.password.length && options.password;
		if (dataView.getUint32(0, false) != 0x504b0304) {
			throw ERR_BAD_FORMAT;
		}
		readCommonHeader(this, dataView, 4, false);
		let dataOffset = this.offset + 30 + this.filenameLength + this.extraFieldLength;
		await writer.init();
		if (this.passwordProtected && !inputPassword) {
			throw new Error(ERR_ENCRYPTED);
		}
		const codec = await createCodec(this.config, {
			codecType: "inflate",
			inputPassword,
			inputSigned: options.checkSignature,
			inputSignature: this.signature,
			inputCompressed: this.compressionMethod != 0,
			inputEncrypted: this.passwordProtected
		});
		await processData(codec, this.reader, writer, dataOffset, this.compressedSize, this.config, { onprogress: options.onprogress });
		return writer.getData();
	}
}

function readCommonHeader(entry, dataView, offset, centralDirectory) {
	entry.version = dataView.getUint16(offset, true);
	entry.bitFlag = dataView.getUint16(offset + 2, true);
	entry.compressionMethod = dataView.getUint16(offset + 4, true);
	entry.lastModDateRaw = dataView.getUint32(offset + 6, true);
	entry.lastModDate = getDate(entry.lastModDateRaw);
	if ((entry.bitFlag & 0x01) == 0x01) {
		entry.passwordProtected = true;
		if (entry.extraField) {
			entry.compressionMethod = entry.extraField[9] + 256 * (entry.extraField[10]);
		}
	}
	if (centralDirectory || (entry.bitFlag & 0x0008) != 0x0008) {
		entry.signature = dataView.getUint32(offset + 10, true);
		entry.compressedSize = dataView.getUint32(offset + 14, true);
		entry.uncompressedSize = dataView.getUint32(offset + 18, true);
	}
	entry.filenameLength = dataView.getUint16(offset + 22, true);
	entry.extraFieldLength = dataView.getUint16(offset + 24, true);
	if (entry.compressedSize == 0xFFFFFFFF && entry.uncompressedSize == 0xFFFFFFFF) {
		if (entry.extraField) {
			entry.zip64 = true;
			const extraFieldView = new DataView(entry.extraField.buffer);
			entry.compressedSize = Number(extraFieldView.getBigUint64(4, true));
			entry.uncompressedSize = Number(extraFieldView.getBigUint64(12, true));
		}
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
		throw new Error(ERR_BAD_FORMAT);
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

function decodeASCII(str) {
	let result = "";
	for (let indexTable = 0; indexTable < str.length; indexTable++) {
		const charCode = str.charCodeAt(indexTable) & 0xFF;
		if (charCode > 127) {
			result += EXTENDED_US_ASCII[charCode - 128];
		} else {
			result += String.fromCharCode(charCode);
		}
	}
	return result;
}

function decodeUTF8(string) {
	return decodeURIComponent(escape(string));
}

function getString(bytes) {
	let result = "";
	for (let indexByte = 0; indexByte < bytes.length; indexByte++) {
		result += String.fromCharCode(bytes[indexByte]);
	}
	return result;
}

function getDate(timeRaw) {
	const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
	try {
		return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
	} catch (error) {
		// ignored
	}
}