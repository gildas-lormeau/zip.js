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

/* global BigInt, TextEncoder */

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
	ZIP64_END_OF_CENTRAL_DIR_SIGNATURE,
	ZIP64_TOTAL_NUMBER_OF_DISKS,
	EXTRAFIELD_TYPE_AES,
	EXTRAFIELD_TYPE_ZIP64,
	END_OF_CENTRAL_DIR_LENGTH,
	ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH,
	BITFLAG_ENCRYPTED,
	BITFLAG_DATA_DESCRIPTOR,
	BITFLAG_LANG_ENCODING_FLAG,
	FILE_ATTR_MSDOS_DIR_MASK,
	VERSION_DEFLATE,
	VERSION_ZIP64,
	VERSION_AES,
	DIRECTORY_SIGNATURE
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

const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);

class ZipWriter {

	constructor(writer, options = {}, config = {}) {
		this.writer = writer;
		this.options = options;
		this.config = config;
		this.files = new Map();
		this.offset = writer.size;
		this.zip64 = options.zip64;
	}

	async add(name = "", reader, options = {}) {
		name = name.trim();
		if (options.directory && (!name.length || name.charAt(name.length - 1) != DIRECTORY_SIGNATURE)) {
			name += DIRECTORY_SIGNATURE;
		}
		if (this.files.has(name)) {
			throw new Error(ERR_DUPLICATED_NAME);
		}
		options.rawFilename = (new TextEncoder()).encode(name);
		if (options.rawFilename.length > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_NAME);
		}
		options.comment = options.comment || "";
		options.rawComment = (new TextEncoder()).encode(options.comment);
		if (options.rawComment.length > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_COMMENT);
		}
		options.version = this.options.version || options.version || 0;
		if (options.version > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		const extraField = options.extraField;
		if (extraField) {
			let extraFieldSize = 4, offset = 0;
			extraField.forEach(data => extraFieldSize += data.length);
			const rawExtraField = options.rawExtraField = new Uint8Array(extraFieldSize);
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
		options.zip64 = options.zip64 || this.zip64;
		await addFile(this, name, reader, options);
	}

	async close(comment = new Uint8Array(0)) {
		const writer = this.writer;
		const files = this.files;
		let offset = 0, directoryDataLength = 0, directoryOffset = this.offset, filesLength = files.size;
		if (comment.length) {
			if (comment.length <= MAX_16_BITS) {
				directoryView.setUint16(offset + 20, comment.length, true);
			} else {
				throw new Error(ERR_INVALID_COMMENT);
			}
		}
		for (const [, fileEntry] of files) {
			directoryDataLength += 46 + fileEntry.rawFilename.length + fileEntry.rawComment.length + fileEntry.extraFieldZip64.length + fileEntry.extraFieldAES.length + fileEntry.rawExtraField.length;
		}
		if (directoryOffset + directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS) {
			this.zip64 = true;
		}
		const directoryArray = new Uint8Array(directoryDataLength + (this.zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH));
		const directoryView = new DataView(directoryArray.buffer);
		for (const [, fileEntry] of files) {
			const rawFilename = fileEntry.rawFilename;
			const extraFieldZip64 = fileEntry.extraFieldZip64;
			const extraFieldAES = fileEntry.extraFieldAES;
			const extraFieldLength = extraFieldZip64.length + extraFieldAES.length + fileEntry.rawExtraField.length;
			directoryView.setUint32(offset, CENTRAL_FILE_HEADER_SIGNATURE);
			directoryView.setUint16(offset + 4, fileEntry.version, true);
			directoryArray.set(fileEntry.headerArray, offset + 6);
			directoryView.setUint16(offset + 30, extraFieldLength, true);
			directoryView.setUint16(offset + 32, fileEntry.rawComment.length, true);
			if (fileEntry.directory) {
				directoryView.setUint8(offset + 38, FILE_ATTR_MSDOS_DIR_MASK);
			}
			if (fileEntry.zip64) {
				directoryView.setUint32(offset + 42, MAX_32_BITS, true);
			} else {
				directoryView.setUint32(offset + 42, fileEntry.offset, true);
			}
			directoryArray.set(rawFilename, offset + 46);
			directoryArray.set(extraFieldZip64, offset + 46 + rawFilename.length);
			directoryArray.set(extraFieldAES, offset + 46 + rawFilename.length + extraFieldZip64.length);
			directoryArray.set(fileEntry.rawExtraField, 46 + rawFilename.length + extraFieldZip64.length + extraFieldAES.length);
			directoryArray.set(fileEntry.rawComment, offset + 46 + rawFilename.length + extraFieldLength);
			offset += 46 + rawFilename.length + extraFieldLength + fileEntry.rawComment.length;
		}
		if (this.zip64) {
			directoryView.setUint32(offset, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
			directoryView.setBigUint64(offset + 4, BigInt(44), true);
			directoryView.setUint16(offset + 12, 45, true);
			directoryView.setUint16(offset + 14, 45, true);
			directoryView.setBigUint64(offset + 24, BigInt(filesLength), true);
			directoryView.setBigUint64(offset + 32, BigInt(filesLength), true);
			directoryView.setBigUint64(offset + 40, BigInt(directoryDataLength), true);
			directoryView.setBigUint64(offset + 48, BigInt(directoryOffset), true);
			directoryView.setUint32(offset + 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
			directoryView.setBigUint64(offset + 64, BigInt(directoryOffset + directoryDataLength), true);
			directoryView.setUint32(offset + 72, ZIP64_TOTAL_NUMBER_OF_DISKS, true);
			filesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			offset += 76;
		}
		directoryView.setUint32(offset, END_OF_CENTRAL_DIR_SIGNATURE);
		directoryView.setUint16(offset + 8, filesLength, true);
		directoryView.setUint16(offset + 10, filesLength, true);
		directoryView.setUint32(offset + 12, directoryDataLength, true);
		directoryView.setUint32(offset + 16, directoryOffset, true);
		await writer.writeUint8Array(directoryArray);
		await writer.writeUint8Array(comment);
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
			if (options.bufferedWrite || zipWriter.options.bufferedWrite || zipWriter.lockWrite) {
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

async function createFileEntry(filename, reader, writer, config, zipWriterOptions, options) {
	const rawFilename = options.rawFilename;
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
		extraFieldAES = new Uint8Array(EXTRAFIELD_DATA_AES.length + 2);
		const extraFieldAESView = new DataView(extraFieldAES.buffer);
		extraFieldAESView.setUint16(0, EXTRAFIELD_TYPE_AES, true);
		extraFieldAES.set(EXTRAFIELD_DATA_AES, 2);
	} else {
		extraFieldAES = new Uint8Array(0);
	}
	const fileEntry = {
		version: options.version || VERSION_DEFLATE,
		zip64,
		headerArray: headerArray,
		directory: options.directory,
		filename,
		rawFilename,
		comment: options.comment,
		rawComment: options.rawComment,
		extraFieldZip64: zip64 ? new Uint8Array(28) : new Uint8Array(0),
		extraFieldAES,
		rawExtraField: options.rawExtraField || new Uint8Array(0)
	};
	let bitFlag = BITFLAG_DATA_DESCRIPTOR | BITFLAG_LANG_ENCODING_FLAG;
	let compressionMethod = COMPRESSION_METHOD_STORE;
	if (compressed) {
		compressionMethod = COMPRESSION_METHOD_DEFLATE;
	}
	if (zip64) {
		fileEntry.version = fileEntry.version > VERSION_ZIP64 ? fileEntry.version : VERSION_ZIP64;
	}
	if (outputPassword) {
		fileEntry.encrypted = true;
		fileEntry.version = fileEntry.version > VERSION_AES ? fileEntry.version : VERSION_AES;
		bitFlag = bitFlag | BITFLAG_ENCRYPTED;
		compressionMethod = COMPRESSION_METHOD_AES;
		if (compressed) {
			fileEntry.extraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
		}
	}
	headerView.setUint16(0, fileEntry.version, true);
	headerView.setUint16(2, bitFlag, true);
	headerView.setUint16(4, compressionMethod, true);
	headerView.setUint16(6, (((date.getHours() << 6) | date.getMinutes()) << 5) | date.getSeconds() / 2, true);
	headerView.setUint16(8, ((((date.getFullYear() - 1980) << 4) | (date.getMonth() + 1)) << 5) | date.getDate(), true);
	headerView.setUint16(22, rawFilename.length, true);
	headerView.setUint16(24, 0, true);
	const fileDataArray = new Uint8Array(30 + rawFilename.length);
	const fileDataView = new DataView(fileDataArray.buffer);
	fileDataView.setUint32(0, LOCAL_FILE_HEADER_SIGNATURE);
	fileDataArray.set(headerArray, 4);
	fileDataArray.set(rawFilename, 30);
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
			outputEncrypted: Boolean(password),
			useWebWorkers: options.useWebWorkers === undefined ? zipWriterOptions.useWebWorkers : options.useWebWorkers
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
			extraFieldZip64View.setUint16(0, EXTRAFIELD_TYPE_ZIP64, true);
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