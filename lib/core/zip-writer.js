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

/* global BigInt, TextEncoder, FileReader */

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
	DIRECTORY_SIGNATURE,
	MIN_DATE,
	MAX_DATE
} from "./constants.js";
import { getConfiguration } from "./configuration.js";
import { CODEC_DEFLATE, createCodec } from "./codecs/codec-pool.js";
import { BlobWriter } from "./io.js";
import { processData } from "./engine.js";
import Entry from "./zip-entry.js";

const ERR_DUPLICATED_NAME = "File already exists";
const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
const ERR_INVALID_VERSION = "Version exceeds 65535";
const ERR_INVALID_DATE = "The modification date must be between 1/1/1980 and 12/31/2107";
const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";

const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
const EXTRAFIELD_LENGTH_ZIP64 = 24;

class ZipWriter {

	constructor(writer, options = {}) {
		const zipWriter = this;
		zipWriter.writer = writer;
		zipWriter.options = options;
		zipWriter.config = getConfiguration();
		zipWriter.files = new Map();
		zipWriter.offset = writer.size;
		zipWriter.pendingOutputSize = 0;
	}

	async add(name = "", reader, options = {}) {
		const zipWriter = this;
		name = name.trim();
		if (options.directory && (!name.endsWith(DIRECTORY_SIGNATURE))) {
			name += DIRECTORY_SIGNATURE;
		} else {
			options.directory = name.endsWith(DIRECTORY_SIGNATURE);
		}
		if (zipWriter.files.has(name)) {
			throw new Error(ERR_DUPLICATED_NAME);
		}
		const rawFilename = (new TextEncoder()).encode(name);
		if (rawFilename.length > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_NAME);
		}
		const comment = options.comment || "";
		const rawComment = (new TextEncoder()).encode(comment);
		if (rawComment.length > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_COMMENT);
		}
		const version = zipWriter.options.version || options.version || 0;
		if (version > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		const lastModDate = options.lastModDate || new Date();
		if (lastModDate < MIN_DATE || lastModDate > MAX_DATE) {
			throw new Error(ERR_INVALID_DATE);
		}
		const password = getOptionValue(zipWriter, options, "password");
		const encryptionStrength = getOptionValue(zipWriter, options, "encryptionStrength") || 3;
		const zipCrypto = getOptionValue(zipWriter, options, "zipCrypto");
		if (password !== undefined && encryptionStrength !== undefined && (encryptionStrength < 1 || encryptionStrength > 3)) {
			throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
		}
		if (reader && !reader.initialized) {
			await reader.init();
		}
		let rawExtraField = new Uint8Array(0);
		const extraField = options.extraField;
		if (extraField) {
			let extraFieldSize = 0;
			let offset = 0;
			extraField.forEach(data => extraFieldSize += 4 + data.length);
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
		const outputSize = reader ? Math.floor(reader.size * 1.05) : 0;
		zipWriter.pendingOutputSize += outputSize;
		await Promise.resolve();
		const zip64 = options.zip64 || zipWriter.options.zip64 || zipWriter.offset >= MAX_32_BITS || outputSize >= MAX_32_BITS || zipWriter.offset + zipWriter.pendingOutputSize >= MAX_32_BITS;
		const level = getOptionValue(zipWriter, options, "level");
		const useWebWorkers = getOptionValue(zipWriter, options, "useWebWorkers");
		const bufferedWrite = getOptionValue(zipWriter, options, "bufferedWrite");
		let keepOrder = getOptionValue(zipWriter, options, "keepOrder");
		let dataDescriptor = getOptionValue(zipWriter, options, "dataDescriptor");
		const signal = getOptionValue(zipWriter, options, "signal");
		if (dataDescriptor === undefined) {
			dataDescriptor = true;
		}
		if (keepOrder === undefined) {
			keepOrder = true;
		}
		const fileEntry = await addFile(zipWriter, name, reader, Object.assign({}, options, {
			rawFilename,
			rawComment,
			version,
			lastModDate,
			rawExtraField,
			zip64,
			password,
			level,
			useWebWorkers,
			encryptionStrength,
			zipCrypto,
			bufferedWrite,
			keepOrder,
			dataDescriptor,
			signal
		}));
		zipWriter.pendingOutputSize -= outputSize;
		Object.assign(fileEntry, { name, comment, extraField });
		return new Entry(fileEntry);
	}

	async close(comment = new Uint8Array(0)) {
		const zipWriter = this;
		const writer = zipWriter.writer;
		const files = zipWriter.files;
		let offset = 0;
		let directoryDataLength = 0;
		let directoryOffset = zipWriter.offset;
		let filesLength = files.size;
		for (const [, fileEntry] of files) {
			directoryDataLength += 46 +
				fileEntry.rawFilename.length +
				fileEntry.rawComment.length +
				fileEntry.rawExtraFieldZip64.length +
				fileEntry.rawExtraFieldAES.length +
				fileEntry.rawExtraField.length;
		}
		const zip64 = zipWriter.options.zip64 || directoryOffset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS;
		const directoryArray = new Uint8Array(directoryDataLength + (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH));
		const directoryView = new DataView(directoryArray.buffer);
		if (comment.length) {
			if (comment.length <= MAX_16_BITS) {
				setUint16(directoryView, offset + 20, comment.length);
			} else {
				throw new Error(ERR_INVALID_COMMENT);
			}
		}
		for (const [, fileEntry] of files) {
			const rawFilename = fileEntry.rawFilename;
			const rawExtraFieldZip64 = fileEntry.rawExtraFieldZip64;
			const rawExtraFieldAES = fileEntry.rawExtraFieldAES;
			const extraFieldLength = rawExtraFieldZip64.length + rawExtraFieldAES.length + fileEntry.rawExtraField.length;
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
			directoryArray.set(rawExtraFieldZip64, offset + 46 + rawFilename.length);
			directoryArray.set(rawExtraFieldAES, offset + 46 + rawFilename.length + rawExtraFieldZip64.length);
			directoryArray.set(fileEntry.rawExtraField, 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length);
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
			setBigUint64(directoryView, offset + 64, BigInt(directoryOffset) + BigInt(directoryDataLength));
			setUint32(directoryView, offset + 72, ZIP64_TOTAL_NUMBER_OF_DISKS);
			filesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			directoryDataLength = MAX_32_BITS;
			offset += 76;
		}
		setUint32(directoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
		setUint16(directoryView, offset + 8, filesLength);
		setUint16(directoryView, offset + 10, filesLength);
		setUint32(directoryView, offset + 12, directoryDataLength);
		setUint32(directoryView, offset + 16, directoryOffset);
		await writer.writeUint8Array(directoryArray);
		if (comment.length) {
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
	ERR_INVALID_DATE,
	ERR_INVALID_EXTRAFIELD_TYPE,
	ERR_INVALID_EXTRAFIELD_DATA,
	ERR_INVALID_ENCRYPTION_STRENGTH
};

async function addFile(zipWriter, name, reader, options) {
	const files = zipWriter.files;
	const writer = zipWriter.writer;
	files.set(name, null);
	let resolveLockWrite;
	let resolveLockPreviousFile;
	try {
		let lockPreviousFile;
		let fileWriter;
		let fileEntry;
		try {
			if (options.keepOrder) {
				lockPreviousFile = zipWriter.lockPreviousFile;
				zipWriter.lockPreviousFile = new Promise(resolve => resolveLockPreviousFile = resolve);
			}
			if (options.bufferedWrite || zipWriter.lockWrite || !options.dataDescriptor) {
				fileWriter = new BlobWriter();
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
			const blob = fileWriter.getData();
			const fileReader = new FileReader();
			const arrayBufferPromise = new Promise((resolve, reject) => {
				fileReader.onload = event => resolve(event.target.result);
				fileReader.onerror = reject;
				fileReader.readAsArrayBuffer(blob);
			});
			const [arrayBuffer] = await Promise.all([arrayBufferPromise, zipWriter.lockWrite, lockPreviousFile]);
			if (!options.dataDescriptor) {
				const arrayBufferView = new DataView(arrayBuffer);
				if (!fileEntry.encrypted || options.zipCrypto) {
					setUint32(arrayBufferView, 14, fileEntry.signature);
				}
				if (fileEntry.zip64) {
					setUint32(arrayBufferView, 18, MAX_32_BITS);
					setUint32(arrayBufferView, 22, MAX_32_BITS);
				} else {
					setUint32(arrayBufferView, 18, fileEntry.compressedSize);
					setUint32(arrayBufferView, 22, fileEntry.uncompressedSize);
				}
			}
			await writer.writeUint8Array(new Uint8Array(arrayBuffer));
		}
		fileEntry.offset = zipWriter.offset;
		if (fileEntry.zip64) {
			const rawExtraFieldZip64View = new DataView(fileEntry.rawExtraFieldZip64.buffer);
			setBigUint64(rawExtraFieldZip64View, 20, BigInt(fileEntry.offset));
		}
		zipWriter.offset += fileEntry.length;
		return fileEntry;
	} finally {
		if (resolveLockPreviousFile) {
			resolveLockPreviousFile();
		}
		if (resolveLockWrite) {
			resolveLockWrite();
		}
	}
}

async function createFileEntry(reader, writer, config, options) {
	const {
		rawFilename,
		lastModDate,
		password,
		level,
		zip64,
		zipCrypto,
		dataDescriptor,
		directory,
		version,
		rawComment,
		rawExtraField,
		useWebWorkers,
		onprogress,
		signal,
		encryptionStrength
	} = options;
	const encrypted = Boolean(password && password.length);
	const compressed = level !== 0 && !directory;
	let rawExtraFieldAES;
	if (encrypted && !zipCrypto) {
		rawExtraFieldAES = new Uint8Array(EXTRAFIELD_DATA_AES.length + 2);
		const extraFieldAESView = new DataView(rawExtraFieldAES.buffer);
		setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
		rawExtraFieldAES.set(EXTRAFIELD_DATA_AES, 2);
		setUint8(extraFieldAESView, 8, encryptionStrength);
	} else {
		rawExtraFieldAES = new Uint8Array(0);
	}
	const fileEntry = {
		version: version || VERSION_DEFLATE,
		zip64,
		directory: Boolean(directory),
		filenameUTF8: true,
		rawFilename,
		commentUTF8: true,
		rawComment,
		rawExtraFieldZip64: zip64 ? new Uint8Array(EXTRAFIELD_LENGTH_ZIP64 + 4) : new Uint8Array(0),
		rawExtraFieldAES,
		rawExtraField
	};
	let bitFlag = BITFLAG_LANG_ENCODING_FLAG;
	if (dataDescriptor) {
		bitFlag = bitFlag | BITFLAG_DATA_DESCRIPTOR;
	}
	let compressionMethod = COMPRESSION_METHOD_STORE;
	if (compressed) {
		compressionMethod = COMPRESSION_METHOD_DEFLATE;
	}
	if (zip64) {
		fileEntry.version = fileEntry.version > VERSION_ZIP64 ? fileEntry.version : VERSION_ZIP64;
	}
	if (encrypted) {
		bitFlag = bitFlag | BITFLAG_ENCRYPTED;
		if (!zipCrypto) {
			fileEntry.version = fileEntry.version > VERSION_AES ? fileEntry.version : VERSION_AES;
			compressionMethod = COMPRESSION_METHOD_AES;
			if (compressed) {
				fileEntry.rawExtraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
			}
		}
	}
	const headerArray = fileEntry.headerArray = new Uint8Array(26);
	const headerView = new DataView(headerArray.buffer);
	setUint16(headerView, 0, fileEntry.version);
	setUint16(headerView, 2, bitFlag);
	setUint16(headerView, 4, compressionMethod);
	const dateArray = new Uint32Array(1);
	const dateView = new DataView(dateArray.buffer);
	setUint16(dateView, 0, (((lastModDate.getHours() << 6) | lastModDate.getMinutes()) << 5) | lastModDate.getSeconds() / 2);
	setUint16(dateView, 2, ((((lastModDate.getFullYear() - 1980) << 4) | (lastModDate.getMonth() + 1)) << 5) | lastModDate.getDate());
	const rawLastModDate = dateArray[0];
	setUint32(headerView, 6, rawLastModDate);
	setUint16(headerView, 22, rawFilename.length);
	setUint16(headerView, 24, 0);
	setUint16(headerView, 24, rawExtraFieldAES.length + fileEntry.rawExtraField.length);
	const footerArray = new Uint8Array(30 + rawFilename.length + rawExtraFieldAES.length + fileEntry.rawExtraField.length);
	const footerView = new DataView(footerArray.buffer);
	setUint32(footerView, 0, LOCAL_FILE_HEADER_SIGNATURE);
	footerArray.set(headerArray, 4);
	footerArray.set(rawFilename, 30);
	footerArray.set(rawExtraFieldAES, 30 + rawFilename.length);
	footerArray.set(fileEntry.rawExtraField, 30 + rawFilename.length + rawExtraFieldAES.length);
	let result;
	let uncompressedSize = 0;
	let compressedSize = 0;
	if (reader) {
		uncompressedSize = reader.size;
		const codec = await createCodec(config.Deflate, {
			codecType: CODEC_DEFLATE,
			level,
			password,
			encryptionStrength,
			zipCrypto: encrypted && zipCrypto,
			passwordVerification: encrypted && zipCrypto && (rawLastModDate >> 8) & 0xFF,
			signed: true,
			compressed,
			encrypted,
			useWebWorkers
		}, config);
		await writer.writeUint8Array(footerArray);
		result = await processData(codec, reader, writer, 0, uncompressedSize, config, { onprogress, signal });
		compressedSize = result.length;
	} else {
		await writer.writeUint8Array(footerArray);
	}
	let dataDescriptorArray = new Uint8Array(0);
	let dataDescriptorView;
	if (dataDescriptor) {
		dataDescriptorArray = new Uint8Array(zip64 ? 24 : 16);
		dataDescriptorView = new DataView(dataDescriptorArray.buffer);
		setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
	}
	if (reader) {
		if ((!encrypted || zipCrypto) && result.signature !== undefined) {
			setUint32(headerView, 10, result.signature);
			fileEntry.signature = result.signature;
			if (dataDescriptor) {
				setUint32(dataDescriptorView, 4, result.signature);
			}
		}
		if (zip64) {
			const rawExtraFieldZip64View = new DataView(fileEntry.rawExtraFieldZip64.buffer);
			setUint16(rawExtraFieldZip64View, 0, EXTRAFIELD_TYPE_ZIP64);
			setUint16(rawExtraFieldZip64View, 2, EXTRAFIELD_LENGTH_ZIP64);
			setUint32(headerView, 14, MAX_32_BITS);
			setBigUint64(rawExtraFieldZip64View, 12, BigInt(compressedSize));
			setUint32(headerView, 18, MAX_32_BITS);
			setBigUint64(rawExtraFieldZip64View, 4, BigInt(uncompressedSize));
			if (dataDescriptor) {
				setBigUint64(dataDescriptorView, 8, BigInt(compressedSize));
				setBigUint64(dataDescriptorView, 16, BigInt(uncompressedSize));
			}
		} else {
			setUint32(headerView, 14, compressedSize);
			setUint32(headerView, 18, uncompressedSize);
			if (dataDescriptor) {
				setUint32(dataDescriptorView, 8, compressedSize);
				setUint32(dataDescriptorView, 12, uncompressedSize);
			}
		}
	}
	if (dataDescriptor) {
		await writer.writeUint8Array(dataDescriptorArray);
	}
	const length = footerArray.length + (result ? result.length : 0) + dataDescriptorArray.length;
	Object.assign(fileEntry, { compressedSize, uncompressedSize, lastModDate, rawLastModDate, encrypted, length });
	return fileEntry;
}

function getOptionValue(zipWriter, options, name) {
	return options[name] === undefined ? zipWriter.options[name] : options[name];
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