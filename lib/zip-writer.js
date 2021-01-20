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

/* global BigInt */

"use strict";

import {
	MAX_32_BITS,
	MAX_16_BITS,
	COMPRESSION_METHOD_DEFLATE,
	COMPRESSION_METHOD_STORE,
	COMPRESSION_METHOD_AES,
	LOCAL_FILE_HEADER_SIGNATURE,
	DATA_DESCRIPTOR_RECORD_SIGNATURE,
	CENTRAL_FILE_HEADER_SIGNATURE,
	END_OF_CENTRAL_DIR_SIGNATURE,
	ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE,
	ZIP64_END_OF_CENTRAL_DIR_SIGNATURE
} from "./constants.js";
import { CODEC_DEFLATE, createCodec } from "./workers.js";
import { Uint8ArrayWriter } from "./stream.js";
import processData from "./engine.js";

const ERR_DUPLICATED_NAME = "File already exists";
const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
const ERR_INVALID_VERSION = "Version exceeds 65535";
const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";

const EXTRAFIELD_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);

class ZipWriter {

	constructor(writer, options = {}, config = {}) {
		this.writer = writer;
		this.options = options;
		this.config = config;
		this.files = new Map();
		this.offset = writer.size;
		this.zip64 = options.zip64;
	}

	async add(name, reader, options = {}) {
		name = name.trim();
		if (options.directory && name.length && name.charAt(name.length - 1) != "/") {
			name += "/";
		}
		if (this.files.has(name)) {
			throw new Error(ERR_DUPLICATED_NAME);
		}
		options.comment = getBytes(encodeUTF8(options.comment || ""));
		if (options.comment.length > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_COMMENT);
		}
		options.zip64 = options.zip64 || this.zip64;
		await addFile(this, name, reader, options);
	}

	async close(comment) {
		const writer = this.writer;
		const files = this.files;
		let offset = 0, directoryDataLength = 0, directoryOffset = this.offset, filesLength = files.size;
		if (comment && comment.length) {
			if (comment.length <= MAX_16_BITS) {
				directoryDataView.setUint16(offset + 20, comment.length, true);
			} else {
				throw new Error(ERR_INVALID_COMMENT);
			}
		}
		for (const [, fileEntry] of files) {
			directoryDataLength += 46 + fileEntry.filename.length + fileEntry.comment.length + fileEntry.extraFieldZip64.length + fileEntry.extraFieldAES.length + fileEntry.rawExtraField.length;
		}
		if (directoryOffset + directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS) {
			this.zip64 = true;
		}
		const directoryDataArray = new Uint8Array(directoryDataLength + (this.zip64 ? 98 : 22));
		const directoryDataView = new DataView(directoryDataArray.buffer);
		for (const [, fileEntry] of files) {
			const filename = fileEntry.filename;
			const extraFieldZip64 = fileEntry.extraFieldZip64;
			const extraFieldAES = fileEntry.extraFieldAES;
			const extraFieldLength = extraFieldZip64.length + extraFieldAES.length + fileEntry.rawExtraField.length;
			directoryDataView.setUint32(offset, CENTRAL_FILE_HEADER_SIGNATURE);
			if (fileEntry.zip64) {
				directoryDataView.setUint16(offset + 4, 0x2d00);
			} else {
				directoryDataView.setUint16(offset + 4, 0x1400);
			}
			directoryDataArray.set(fileEntry.headerArray, offset + 6);
			directoryDataView.setUint16(offset + 30, extraFieldLength, true);
			directoryDataView.setUint16(offset + 32, fileEntry.comment.length, true);
			if (fileEntry.directory) {
				directoryDataView.setUint8(offset + 38, 0x10);
			}
			if (fileEntry.zip64) {
				directoryDataView.setUint32(offset + 42, MAX_32_BITS, true);
			} else {
				directoryDataView.setUint32(offset + 42, fileEntry.offset, true);
			}
			directoryDataArray.set(filename, offset + 46);
			directoryDataArray.set(extraFieldZip64, offset + 46 + filename.length);
			directoryDataArray.set(extraFieldAES, offset + 46 + filename.length + extraFieldZip64.length);
			directoryDataArray.set(fileEntry.rawExtraField, 46 + filename.length + extraFieldZip64.length + extraFieldAES.length);
			directoryDataArray.set(fileEntry.comment, offset + 46 + filename.length + extraFieldLength);
			offset += 46 + filename.length + extraFieldLength + fileEntry.comment.length;
		}
		if (this.zip64) {
			directoryDataView.setUint32(offset, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
			directoryDataView.setBigUint64(offset + 4, BigInt(44), true);
			directoryDataView.setUint16(offset + 12, 45, true);
			directoryDataView.setUint16(offset + 14, 45, true);
			directoryDataView.setBigUint64(offset + 24, BigInt(filesLength), true);
			directoryDataView.setBigUint64(offset + 32, BigInt(filesLength), true);
			directoryDataView.setBigUint64(offset + 40, BigInt(directoryDataLength), true);
			directoryDataView.setBigUint64(offset + 48, BigInt(directoryOffset), true);
			directoryDataView.setUint32(offset + 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
			directoryDataView.setBigUint64(offset + 64, BigInt(directoryOffset + directoryDataLength), true);
			directoryDataView.setUint32(offset + 72, 1, true);
			filesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			offset += 76;
		}
		directoryDataView.setUint32(offset, END_OF_CENTRAL_DIR_SIGNATURE);
		directoryDataView.setUint16(offset + 8, filesLength, true);
		directoryDataView.setUint16(offset + 10, filesLength, true);
		directoryDataView.setUint32(offset + 12, directoryDataLength, true);
		directoryDataView.setUint32(offset + 16, directoryOffset, true);
		await writer.writeUint8Array(directoryDataArray);
		if (comment && comment.length) {
			await writer.writeUint8Array(comment);
		}
		return writer.getData();
	}
}

export {
	ZipWriter,
	ERR_DUPLICATED_NAME,
	ERR_INVALID_COMMENT,
	ERR_INVALID_ENTRY_NAME,
	ERR_INVALID_ENTRY_COMMENT,
	ERR_INVALID_VERSION,
	ERR_INVALID_EXTRAFIELD_TYPE,
	ERR_INVALID_EXTRAFIELD_DATA
};

async function addFile(zipWriter, name, reader, options) {
	const files = zipWriter.files, writer = zipWriter.writer;
	files.set(name, null);
	let resolveLockWrite;
	try {
		let fileWriter, fileEntry;
		try {
			if ((options.bufferedWrite || zipWriter.options.bufferedWrite) || zipWriter.lockWrite) {
				fileWriter = new Uint8ArrayWriter();
				fileWriter.init();
			} else {
				zipWriter.lockWrite = new Promise(resolve => resolveLockWrite = resolve);
				if (!writer.initialized) {
					await writer.init();
				}
				fileWriter = writer;
			}
			if (zipWriter.offset >= MAX_32_BITS || (reader && (reader.size >= MAX_32_BITS || zipWriter.offset + reader.size >= MAX_32_BITS))) {
				options.zip64 = true;
			}
			fileEntry = await createFileEntry(name, reader, fileWriter, zipWriter.config, zipWriter.options, options);
		} catch (error) {
			files.delete(name);
			throw error;
		}
		files.set(name, fileEntry);
		if (fileWriter != writer) {
			if (zipWriter.lockWrite) {
				await zipWriter.lockWrite;
			}
			await writer.writeUint8Array(fileWriter.getData());
		}
		fileEntry.offset = zipWriter.offset;
		if (fileEntry.zip64) {
			const extraFieldZip64View = new DataView(fileEntry.extraFieldZip64.buffer);
			extraFieldZip64View.setBigUint64(20, BigInt(fileEntry.offset), true);
		}
		zipWriter.offset += fileEntry.length;
	} finally {
		if (resolveLockWrite) {
			zipWriter.lockWrite = null;
			resolveLockWrite();
		}
	}
}

async function createFileEntry(name, reader, writer, config, zipWriterOptions, options) {
	const filename = getBytes(encodeUTF8(name));
	const date = options.lastModDate || new Date();
	const headerArray = new Uint8Array(26);
	const headerView = new DataView(headerArray.buffer);
	const password = options.password === undefined ? zipWriterOptions.password : options.password;
	const outputPassword = password && password.length && password;
	const level = options.level === undefined ? zipWriterOptions.level : options.level;
	const compressed = level !== 0 && !options.directory;
	const outputSigned = password === undefined || !password.length;
	const zip64 = options.zip64;
	let extraFieldAES;
	if (outputPassword) {
		extraFieldAES = new Uint8Array(EXTRAFIELD_AES.length + 2);
		const extraFieldAESView = new DataView(extraFieldAES.buffer);
		extraFieldAESView.setUint16(0, 0x9901, true);
		extraFieldAES.set(EXTRAFIELD_AES, 2);
	} else {
		extraFieldAES = new Uint8Array(0);
	}
	const fileEntry = {
		zip64,
		headerArray: headerArray,
		directory: options.directory,
		filename: filename,
		comment: options.comment,
		extraFieldZip64: zip64 ? new Uint8Array(28) : new Uint8Array(0),
		extraFieldAES,
		rawExtraField: new Uint8Array(0)
	};
	const extraField = options.extraField;
	if (filename.length > MAX_16_BITS) {
		throw new Error(ERR_INVALID_ENTRY_NAME);
	}
	if (extraField) {
		let extraFieldSize = 4, offset = 0;
		extraField.forEach(data => extraFieldSize += data.length);
		const rawExtraField = fileEntry.rawExtraField = new Uint8Array(extraFieldSize);
		extraField.forEach((data, type) => {
			if (type > MAX_16_BITS) {
				throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
			}
			if (data.length > MAX_16_BITS) {
				throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
			}
			rawExtraField.set(new Uint16Array([type]), offset);
			rawExtraField.set(new Uint16Array([data.length]), offset + 2);
			rawExtraField.set(data, offset + 4);
			offset += 4 + data.length;
		});
	}
	options.bitFlag = 0x08;
	options.version = (options.version === undefined ? zipWriterOptions.version : options.version) || 0x14;
	if (options.version > MAX_16_BITS) {
		throw new Error(ERR_INVALID_VERSION);
	}
	options.compressionMethod = COMPRESSION_METHOD_STORE;
	if (compressed) {
		options.compressionMethod = COMPRESSION_METHOD_DEFLATE;
	}
	if (zip64) {
		options.version = options.version > 0x2D ? options.version : 0x2D;
	}
	if (outputPassword) {
		options.version = options.version > 0x33 ? options.version : 0x33;
		options.bitFlag = 0x09;
		options.compressionMethod = COMPRESSION_METHOD_AES;
		if (compressed) {
			fileEntry.extraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
		}
	}
	headerView.setUint16(0, options.version, true);
	headerView.setUint16(2, options.bitFlag, true);
	headerView.setUint16(4, options.compressionMethod, true);
	headerView.setUint16(6, (((date.getHours() << 6) | date.getMinutes()) << 5) | date.getSeconds() / 2, true);
	headerView.setUint16(8, ((((date.getFullYear() - 1980) << 4) | (date.getMonth() + 1)) << 5) | date.getDate(), true);
	headerView.setUint16(22, filename.length, true);
	headerView.setUint16(24, 0, true);
	const fileDataArray = new Uint8Array(30 + filename.length);
	const fileDataView = new DataView(fileDataArray.buffer);
	fileDataView.setUint32(0, LOCAL_FILE_HEADER_SIGNATURE);
	fileDataArray.set(headerArray, 4);
	fileDataArray.set(filename, 30);
	let result;
	if (reader) {
		if (!reader.initialized) {
			await reader.init();
		}
		const codec = await createCodec(config, {
			codecType: CODEC_DEFLATE,
			level,
			outputPassword: password,
			outputSigned,
			outputCompressed: compressed,
			outputEncrypted: Boolean(password)
		});
		await writer.writeUint8Array(fileDataArray);
		result = await processData(codec, reader, writer, 0, reader.size, config, { onprogress: options.onprogress });
		fileEntry.compressedSize = result.length;
	} else {
		await writer.writeUint8Array(fileDataArray);
	}
	const footerArray = new Uint8Array(zip64 ? 24 : 16);
	const footerView = new DataView(footerArray.buffer);
	footerView.setUint32(0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
	if (reader) {
		if (!outputPassword && result.signature !== undefined) {
			headerView.setUint32(10, result.signature, true);
			footerView.setUint32(4, result.signature, true);
		}
		if (zip64) {
			headerView.setUint32(14, MAX_32_BITS, true);
			footerView.setBigUint64(8, BigInt(fileEntry.compressedSize), true);
			headerView.setUint32(18, MAX_32_BITS, true);
			footerView.setBigUint64(16, BigInt(reader.size), true);
			const extraFieldZip64View = new DataView(fileEntry.extraFieldZip64.buffer);
			extraFieldZip64View.setUint16(0, 0x01, true);
			extraFieldZip64View.setUint16(2, 24, true);
			extraFieldZip64View.setBigUint64(4, BigInt(reader.size), true);
			extraFieldZip64View.setBigUint64(12, BigInt(fileEntry.compressedSize), true);
		} else {
			headerView.setUint32(14, fileEntry.compressedSize, true);
			footerView.setUint32(8, fileEntry.compressedSize, true);
			headerView.setUint32(18, reader.size, true);
			footerView.setUint32(12, reader.size, true);
		}
	}
	await writer.writeUint8Array(footerArray);
	fileEntry.length = fileDataArray.length + (result ? result.length : 0) + footerArray.length;
	return fileEntry;
}

function encodeUTF8(string) {
	return unescape(encodeURIComponent(string));
}

function getBytes(string) {
	const bytes = [];
	for (let indexString = 0; indexString < string.length; indexString++) {
		bytes.push(string.charCodeAt(indexString));
	}
	return bytes;
}