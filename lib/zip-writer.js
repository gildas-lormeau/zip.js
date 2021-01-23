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
import { CODEC_DEFLATE, createCodec } from "./codecs/codec-pool.js";
import { Uint8ArrayWriter } from "./stream.js";
import processData from "./engine.js";

const ERR_DUPLICATED_NAME = "File already exists";
const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
const ERR_INVALID_VERSION = "Version exceeds 65535";
const ERR_INVALID_DATE = "The minimum year for the date is 1980";
const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";

const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
const EXTRAFIELD_LENGTH_ZIP64 = 24;

class ZipWriter {

	constructor(writer, options = {}, config = {}) {
		this.writer = writer;
		this.options = options;
		this.config = config;
		this.files = new Map();
		this.offset = writer.size;
	}

	async add(name = "", reader, options = {}) {
		name = name.trim();
		if (options.directory && (!name.length || name.charAt(name.length - 1) != DIRECTORY_SIGNATURE)) {
			name += DIRECTORY_SIGNATURE;
		}
		if (this.files.has(name)) {
			throw new Error(ERR_DUPLICATED_NAME);
		}
		const rawFilename = (new TextEncoder()).encode(name);
		if (rawFilename.length > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_NAME);
		}
		const comment = options.comment;
		const rawComment = (new TextEncoder()).encode(comment || "");
		if (rawComment.length > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_COMMENT);
		}
		const version = this.options.version || options.version || 0;
		if (version > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		const lastModDate = options.lastModDate || new Date();
		if (lastModDate.getFullYear() < 1980) {
			throw new Error(ERR_INVALID_DATE);
		}
		if (reader && !reader.initialized) {
			await reader.init();
		}
		let rawExtraField = new Uint8Array(0);
		const extraField = options.extraField;
		if (extraField) {
			let extraFieldSize = 4, offset = 0;
			extraField.forEach(data => extraFieldSize += data.length);
			rawExtraField = new Uint8Array(extraFieldSize);
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
		const zip64 = options.zip64 || this.options.zip64 || this.offset >= MAX_32_BITS || (reader && (reader.size >= MAX_32_BITS || this.offset + reader.size >= MAX_32_BITS));
		const password = options.password === undefined ? this.options.password : options.password;
		const level = options.level === undefined ? this.options.level : options.level;
		const useWebWorkers = options.useWebWorkers === undefined ? this.options.useWebWorkers : options.useWebWorkers;
		const fileEntry = await addFile(this, name, reader, Object.assign({}, options, { rawFilename, rawComment, version, lastModDate, rawExtraField, zip64, password, level, useWebWorkers }));
		fileEntry.filename = name;
		fileEntry.comment = comment;
		return fileEntry;
	}

	async close(comment = new Uint8Array(0)) {
		const writer = this.writer;
		const files = this.files;
		let offset = 0, directoryDataLength = 0, directoryOffset = this.offset, filesLength = files.size;
		if (comment.length) {
			if (comment.length <= MAX_16_BITS) {
				setUint16(directoryView, offset + 20, comment.length);
			} else {
				throw new Error(ERR_INVALID_COMMENT);
			}
		}
		for (const [, fileEntry] of files) {
			directoryDataLength += 46 + fileEntry.rawFilename.length + fileEntry.rawComment.length + fileEntry.extraFieldZip64.length + fileEntry.extraFieldAES.length + fileEntry.rawExtraField.length;
		}
		const zip64 = this.options.zip64 || directoryOffset + directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS;
		const directoryArray = new Uint8Array(directoryDataLength + (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH));
		const directoryView = new DataView(directoryArray.buffer);
		for (const [, fileEntry] of files) {
			const rawFilename = fileEntry.rawFilename;
			const extraFieldZip64 = fileEntry.extraFieldZip64;
			const extraFieldAES = fileEntry.extraFieldAES;
			const extraFieldLength = extraFieldZip64.length + extraFieldAES.length + fileEntry.rawExtraField.length;
			setUint32(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
			setUint16(directoryView, offset + 4, fileEntry.version);
			directoryArray.set(fileEntry.headerArray, offset + 6);
			setUint16(directoryView, offset + 30, extraFieldLength);
			setUint16(directoryView, offset + 32, fileEntry.rawComment.length);
			if (fileEntry.directory) {
				setUint8(directoryView, offset + 38, FILE_ATTR_MSDOS_DIR_MASK);
			}
			if (fileEntry.zip64) {
				setUint32(directoryView, offset + 42, MAX_32_BITS);
			} else {
				setUint32(directoryView, offset + 42, fileEntry.offset);
			}
			directoryArray.set(rawFilename, offset + 46);
			directoryArray.set(extraFieldZip64, offset + 46 + rawFilename.length);
			directoryArray.set(extraFieldAES, offset + 46 + rawFilename.length + extraFieldZip64.length);
			directoryArray.set(fileEntry.rawExtraField, 46 + rawFilename.length + extraFieldZip64.length + extraFieldAES.length);
			directoryArray.set(fileEntry.rawComment, offset + 46 + rawFilename.length + extraFieldLength);
			offset += 46 + rawFilename.length + extraFieldLength + fileEntry.rawComment.length;
		}
		if (zip64) {
			setUint32(directoryView, offset, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
			setBigUint64(directoryView, offset + 4, BigInt(44));
			setUint16(directoryView, offset + 12, 45);
			setUint16(directoryView, offset + 14, 45);
			setBigUint64(directoryView, offset + 24, BigInt(filesLength));
			setBigUint64(directoryView, offset + 32, BigInt(filesLength));
			setBigUint64(directoryView, offset + 40, BigInt(directoryDataLength));
			setBigUint64(directoryView, offset + 48, BigInt(directoryOffset));
			setUint32(directoryView, offset + 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
			setBigUint64(directoryView, offset + 64, BigInt(directoryOffset + directoryDataLength));
			setUint32(directoryView, offset + 72, ZIP64_TOTAL_NUMBER_OF_DISKS);
			filesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			offset += 76;
		}
		setUint32(directoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
		setUint16(directoryView, offset + 8, filesLength);
		setUint16(directoryView, offset + 10, filesLength);
		setUint32(directoryView, offset + 12, directoryDataLength);
		setUint32(directoryView, offset + 16, directoryOffset);
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
	ERR_INVALID_DATE,
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
			fileEntry = await createFileEntry(reader, fileWriter, zipWriter.config, options);
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
			setBigUint64(extraFieldZip64View, 20, BigInt(fileEntry.offset));
		}
		zipWriter.offset += fileEntry.length;
		return fileEntry;
	} finally {
		if (resolveLockWrite) {
			zipWriter.lockWrite = null;
			resolveLockWrite();
		}
	}
}

async function createFileEntry(reader, writer, config, options) {
	const rawFilename = options.rawFilename;
	const lastModDate = options.lastModDate;
	const outputPassword = options.password;
	const outputEncrypted = outputPassword && outputPassword.length;
	const level = options.level;
	const outputCompressed = level !== 0 && !options.directory;
	const zip64 = options.zip64;
	let extraFieldAES;
	if (outputEncrypted) {
		extraFieldAES = new Uint8Array(EXTRAFIELD_DATA_AES.length + 2);
		const extraFieldAESView = new DataView(extraFieldAES.buffer);
		setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
		extraFieldAES.set(EXTRAFIELD_DATA_AES, 2);
	} else {
		extraFieldAES = new Uint8Array(0);
	}
	const fileEntry = {
		version: options.version || VERSION_DEFLATE,
		zip64,
		directory: options.directory,
		rawFilename,
		rawComment: options.rawComment,
		extraFieldZip64: zip64 ? new Uint8Array(EXTRAFIELD_LENGTH_ZIP64 + 4) : new Uint8Array(0),
		extraFieldAES,
		rawExtraField: options.rawExtraField
	};
	let bitFlag = BITFLAG_DATA_DESCRIPTOR | BITFLAG_LANG_ENCODING_FLAG;
	let compressionMethod = COMPRESSION_METHOD_STORE;
	if (outputCompressed) {
		compressionMethod = COMPRESSION_METHOD_DEFLATE;
	}
	if (zip64) {
		fileEntry.version = fileEntry.version > VERSION_ZIP64 ? fileEntry.version : VERSION_ZIP64;
	}
	if (outputEncrypted) {
		fileEntry.version = fileEntry.version > VERSION_AES ? fileEntry.version : VERSION_AES;
		bitFlag = bitFlag | BITFLAG_ENCRYPTED;
		compressionMethod = COMPRESSION_METHOD_AES;
		if (outputCompressed) {
			fileEntry.extraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
		}
	}
	const headerArray = fileEntry.headerArray = new Uint8Array(26);
	const headerView = new DataView(headerArray.buffer);
	setUint16(headerView, 0, fileEntry.version);
	setUint16(headerView, 2, bitFlag);
	setUint16(headerView, 4, compressionMethod);
	setUint16(headerView, 6, (((lastModDate.getHours() << 6) | lastModDate.getMinutes()) << 5) | lastModDate.getSeconds() / 2);
	setUint16(headerView, 8, ((((lastModDate.getFullYear() - 1980) << 4) | (lastModDate.getMonth() + 1)) << 5) | lastModDate.getDate());
	setUint16(headerView, 22, rawFilename.length);
	setUint16(headerView, 24, 0);
	const fileDataArray = new Uint8Array(30 + rawFilename.length);
	const fileDataView = new DataView(fileDataArray.buffer);
	setUint32(fileDataView, 0, LOCAL_FILE_HEADER_SIGNATURE);
	fileDataArray.set(headerArray, 4);
	fileDataArray.set(rawFilename, 30);
	let result, unCompressedSize, compressedSize;
	if (reader) {
		unCompressedSize = reader.size;
		const codec = await createCodec(config, {
			codecType: CODEC_DEFLATE,
			codecConstructor: config.Deflate,
			level,
			outputPassword,
			outputSigned: true,
			outputCompressed,
			outputEncrypted,
			useWebWorkers: options.useWebWorkers
		});
		await writer.writeUint8Array(fileDataArray);
		result = await processData(codec, reader, writer, 0, unCompressedSize, config, { onprogress: options.onprogress });
		compressedSize = result.length;
	} else {
		await writer.writeUint8Array(fileDataArray);
	}
	const footerArray = new Uint8Array(zip64 ? 24 : 16);
	const footerView = new DataView(footerArray.buffer);
	setUint32(footerView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
	if (reader) {
		if (!outputEncrypted && result.signature !== undefined) {
			setUint32(headerView, 10, result.signature);
			setUint32(footerView, 4, result.signature);
		}
		if (zip64) {
			const extraFieldZip64View = new DataView(fileEntry.extraFieldZip64.buffer);
			setUint16(extraFieldZip64View, 0, EXTRAFIELD_TYPE_ZIP64);
			setUint16(extraFieldZip64View, 2, EXTRAFIELD_LENGTH_ZIP64);
			setUint32(headerView, 14, MAX_32_BITS);
			setBigUint64(footerView, 8, BigInt(compressedSize));
			setBigUint64(extraFieldZip64View, 12, BigInt(compressedSize));
			setUint32(headerView, 18, MAX_32_BITS);
			setBigUint64(footerView, 16, BigInt(unCompressedSize));
			setBigUint64(extraFieldZip64View, 4, BigInt(unCompressedSize));
		} else {
			setUint32(headerView, 14, compressedSize);
			setUint32(footerView, 8, compressedSize);
			setUint32(headerView, 18, unCompressedSize);
			setUint32(footerView, 12, unCompressedSize);
		}
	}
	await writer.writeUint8Array(footerArray);
	fileEntry.compressedSize = compressedSize;
	fileEntry.unCompressedSize = unCompressedSize;
	fileEntry.lastModDate = lastModDate;
	fileEntry.encrypted = outputEncrypted;
	fileEntry.length = fileDataArray.length + (result ? result.length : 0) + footerArray.length;
	return fileEntry;
}

function setUint8(view, offset, value) {
	view.setUint8(offset, value);
}

function setUint16(view, offset, value) {
	view.setUint16(offset, value, true);
}

function setUint32(view, offset, value) {
	view.setUint32(offset, value, true);
}

function setBigUint64(view, offset, value) {
	view.setBigUint64(offset, value, true);
}