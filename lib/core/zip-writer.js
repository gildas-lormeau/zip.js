/*
 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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

/* global BigInt, FileReader */

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
	EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP,
	EXTRAFIELD_TYPE_NTFS,
	EXTRAFIELD_TYPE_NTFS_TAG1,
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
import encodeText from "./util/encode-text.js";
import { BlobWriter } from "./io.js";
import { processData } from "./engine.js";
import Entry from "./zip-entry.js";

const ERR_DUPLICATED_NAME = "File already exists";
const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
const ERR_INVALID_VERSION = "Version exceeds 65535";
const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
const ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported";

const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
const EXTRAFIELD_LENGTH_ZIP64 = 24;

let workers = 0;

class ZipWriter {

	constructor(writer, options = {}) {
		Object.assign(this, {
			writer,
			options,
			config: getConfiguration(),
			files: new Map(),
			offset: writer.size,
			pendingCompressedSize: 0,
			pendingEntries: [],
			pendingAddFileCalls: new Set()
		});
	}

	async add(name = "", reader, options = {}) {
		const zipWriter = this;
		if (workers < zipWriter.config.maxWorkers) {
			workers++;
			let promiseAddFile;
			try {
				promiseAddFile = addFile(zipWriter, name, reader, options);
				this.pendingAddFileCalls.add(promiseAddFile);
				return await promiseAddFile;
			} finally {
				this.pendingAddFileCalls.delete(promiseAddFile);
				workers--;
				const pendingEntry = zipWriter.pendingEntries.shift();
				if (pendingEntry) {
					zipWriter.add(pendingEntry.name, pendingEntry.reader, pendingEntry.options)
						.then(pendingEntry.resolve)
						.catch(pendingEntry.reject);
				}
			}
		} else {
			return new Promise((resolve, reject) => zipWriter.pendingEntries.push({ name, reader, options, resolve, reject }));
		}
	}

	async close(comment = new Uint8Array(0), options = {}) {
		while (this.pendingAddFileCalls.size) {
			await Promise.all(Array.from(this.pendingAddFileCalls));
		}
		await closeFile(this, comment, options);
		return this.writer.getData();
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
	ERR_INVALID_EXTRAFIELD_DATA,
	ERR_INVALID_ENCRYPTION_STRENGTH,
	ERR_UNSUPPORTED_FORMAT
};

async function addFile(zipWriter, name, reader, options) {
	name = name.trim();
	if (options.directory && (!name.endsWith(DIRECTORY_SIGNATURE))) {
		name += DIRECTORY_SIGNATURE;
	} else {
		options.directory = name.endsWith(DIRECTORY_SIGNATURE);
	}
	if (zipWriter.files.has(name)) {
		throw new Error(ERR_DUPLICATED_NAME);
	}
	const rawFilename = encodeText(name);
	if (rawFilename.length > MAX_16_BITS) {
		throw new Error(ERR_INVALID_ENTRY_NAME);
	}
	const comment = options.comment || "";
	const rawComment = encodeText(comment);
	if (rawComment.length > MAX_16_BITS) {
		throw new Error(ERR_INVALID_ENTRY_COMMENT);
	}
	const version = zipWriter.options.version || options.version || 0;
	if (version > MAX_16_BITS) {
		throw new Error(ERR_INVALID_VERSION);
	}
	const versionMadeBy = zipWriter.options.versionMadeBy || options.versionMadeBy || 20;
	if (versionMadeBy > MAX_16_BITS) {
		throw new Error(ERR_INVALID_VERSION);
	}
	const lastModDate = getOptionValue(zipWriter, options, "lastModDate") || new Date();
	const lastAccessDate = getOptionValue(zipWriter, options, "lastAccessDate");
	const creationDate = getOptionValue(zipWriter, options, "creationDate");
	const password = getOptionValue(zipWriter, options, "password");
	const encryptionStrength = getOptionValue(zipWriter, options, "encryptionStrength") || 3;
	const zipCrypto = getOptionValue(zipWriter, options, "zipCrypto");
	if (password !== undefined && encryptionStrength !== undefined && (encryptionStrength < 1 || encryptionStrength > 3)) {
		throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
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
			arraySet(rawExtraField, new Uint16Array([type]), offset);
			arraySet(rawExtraField, new Uint16Array([data.length]), offset + 2);
			arraySet(rawExtraField, data, offset + 4);
			offset += 4 + data.length;
		});
	}
	let extendedTimestamp = getOptionValue(zipWriter, options, "extendedTimestamp");
	if (extendedTimestamp === undefined) {
		extendedTimestamp = true;
	}
	let maximumCompressedSize = 0;
	let keepOrder = getOptionValue(zipWriter, options, "keepOrder");
	if (keepOrder === undefined) {
		keepOrder = true;
	}
	let uncompressedSize = 0;
	let msDosCompatible = getOptionValue(zipWriter, options, "msDosCompatible");
	if (msDosCompatible === undefined) {
		msDosCompatible = true;
	}
	const internalFileAttribute = getOptionValue(zipWriter, options, "internalFileAttribute") || 0;
	const externalFileAttribute = getOptionValue(zipWriter, options, "externalFileAttribute") || 0;
	if (reader) {
		if (!reader.initialized) {
			await reader.init();
		}
		uncompressedSize = reader.size;
		maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
	}
	let zip64 = options.zip64 || zipWriter.options.zip64 || false;
	if (zipWriter.offset + zipWriter.pendingCompressedSize >= MAX_32_BITS ||
		uncompressedSize >= MAX_32_BITS ||
		maximumCompressedSize >= MAX_32_BITS) {
		if (options.zip64 === false || zipWriter.options.zip64 === false || !keepOrder) {
			throw new Error(ERR_UNSUPPORTED_FORMAT);
		} else {
			zip64 = true;
		}
	}
	zipWriter.pendingCompressedSize += maximumCompressedSize;
	await Promise.resolve();
	const level = getOptionValue(zipWriter, options, "level");
	const useWebWorkers = getOptionValue(zipWriter, options, "useWebWorkers");
	const bufferedWrite = getOptionValue(zipWriter, options, "bufferedWrite");
	let dataDescriptor = getOptionValue(zipWriter, options, "dataDescriptor");
	let dataDescriptorSignature = getOptionValue(zipWriter, options, "dataDescriptorSignature");
	const signal = getOptionValue(zipWriter, options, "signal");
	if (dataDescriptor === undefined) {
		dataDescriptor = true;
	}
	if (dataDescriptor && dataDescriptorSignature === undefined) {
		dataDescriptorSignature = false;
	}
	const fileEntry = await getFileEntry(zipWriter, name, reader, Object.assign({}, options, {
		rawFilename,
		rawComment,
		version,
		versionMadeBy,
		lastModDate,
		lastAccessDate,
		creationDate,
		rawExtraField,
		zip64,
		password,
		level,
		useWebWorkers,
		encryptionStrength,
		extendedTimestamp,
		zipCrypto,
		bufferedWrite,
		keepOrder,
		dataDescriptor,
		dataDescriptorSignature,
		signal,
		msDosCompatible,
		internalFileAttribute,
		externalFileAttribute
	}));
	if (maximumCompressedSize) {
		zipWriter.pendingCompressedSize -= maximumCompressedSize;
	}
	Object.assign(fileEntry, { name, comment, extraField });
	return new Entry(fileEntry);
}

async function getFileEntry(zipWriter, name, reader, options) {
	const files = zipWriter.files;
	const writer = zipWriter.writer;
	const previousFileEntry = Array.from(files.values()).pop();
	let fileEntry = {};
	let bufferedWrite;
	let resolveLockUnbufferedWrite;
	let resolveLockCurrentFileEntry;
	files.set(name, fileEntry);
	try {
		let lockPreviousFileEntry;
		let fileWriter;
		let lockCurrentFileEntry;
		if (options.keepOrder) {
			lockPreviousFileEntry = previousFileEntry && previousFileEntry.lock;
		}
		fileEntry.lock = lockCurrentFileEntry = new Promise(resolve => resolveLockCurrentFileEntry = resolve);
		if (options.bufferedWrite || zipWriter.lockWrite || !options.dataDescriptor) {
			fileWriter = new BlobWriter();
			fileWriter.init();
			bufferedWrite = true;
		} else {
			zipWriter.lockWrite = new Promise(resolve => resolveLockUnbufferedWrite = resolve);
			if (!writer.initialized) {
				await writer.init();
			}
			fileWriter = writer;
		}
		fileEntry = await createFileEntry(reader, fileWriter, zipWriter.config, options);
		fileEntry.lock = lockCurrentFileEntry;
		files.set(name, fileEntry);
		fileEntry.filename = name;
		if (bufferedWrite) {
			let indexWrittenData = 0;
			const blob = fileWriter.getData();
			await Promise.all([zipWriter.lockWrite, lockPreviousFileEntry]);
			let pendingFileEntry;
			do {
				pendingFileEntry = Array.from(files.values()).find(fileEntry => fileEntry.writingBufferedData);
				if (pendingFileEntry) {
					await pendingFileEntry.lock;
				}
			} while (pendingFileEntry && pendingFileEntry.lock);
			fileEntry.writingBufferedData = true;
			if (!options.dataDescriptor) {
				const headerLength = 26;
				const arrayBuffer = await sliceAsArrayBuffer(blob, 0, headerLength);
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
				await writer.writeUint8Array(new Uint8Array(arrayBuffer));
				indexWrittenData = headerLength;
			}
			await writeBlob(writer, blob, indexWrittenData);
			delete fileEntry.writingBufferedData;
		}
		fileEntry.offset = zipWriter.offset;
		if (fileEntry.zip64) {
			const rawExtraFieldZip64View = getDataView(fileEntry.rawExtraFieldZip64);
			setBigUint64(rawExtraFieldZip64View, 20, BigInt(fileEntry.offset));
		} else if (fileEntry.offset >= MAX_32_BITS) {
			throw new Error(ERR_UNSUPPORTED_FORMAT);
		}
		zipWriter.offset += fileEntry.length;
		return fileEntry;
	} catch (error) {
		if ((bufferedWrite && fileEntry.writingBufferedData) || (!bufferedWrite && fileEntry.dataWritten)) {
			error.corruptedEntry = zipWriter.hasCorruptedEntries = true;
			if (fileEntry.uncompressedSize) {
				zipWriter.offset += fileEntry.uncompressedSize;
			}
		}
		files.delete(name);
		throw error;
	} finally {
		resolveLockCurrentFileEntry();
		if (resolveLockUnbufferedWrite) {
			resolveLockUnbufferedWrite();
		}
	}
}

async function createFileEntry(reader, writer, config, options) {
	const {
		rawFilename,
		lastAccessDate,
		creationDate,
		password,
		level,
		zip64,
		zipCrypto,
		dataDescriptor,
		dataDescriptorSignature,
		directory,
		version,
		versionMadeBy,
		rawComment,
		rawExtraField,
		useWebWorkers,
		onprogress,
		signal,
		encryptionStrength,
		extendedTimestamp,
		msDosCompatible,
		internalFileAttribute,
		externalFileAttribute
	} = options;
	const encrypted = Boolean(password && password.length);
	const compressed = level !== 0 && !directory;
	let rawExtraFieldAES;
	if (encrypted && !zipCrypto) {
		rawExtraFieldAES = new Uint8Array(EXTRAFIELD_DATA_AES.length + 2);
		const extraFieldAESView = getDataView(rawExtraFieldAES);
		setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
		arraySet(rawExtraFieldAES, EXTRAFIELD_DATA_AES, 2);
		setUint8(extraFieldAESView, 8, encryptionStrength);
	} else {
		rawExtraFieldAES = new Uint8Array(0);
	}
	let rawExtraFieldNTFS;
	let rawExtraFieldExtendedTimestamp;
	if (extendedTimestamp) {
		rawExtraFieldExtendedTimestamp = new Uint8Array(9 + (lastAccessDate ? 4 : 0) + (creationDate ? 4 : 0));
		const extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
		setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
		setUint16(extraFieldExtendedTimestampView, 2, rawExtraFieldExtendedTimestamp.length - 4);
		const extraFieldExtendedTimestampFlag = 0x1 + (lastAccessDate ? 0x2 : 0) + (creationDate ? 0x4 : 0);
		setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
		setUint32(extraFieldExtendedTimestampView, 5, Math.floor(options.lastModDate.getTime() / 1000));
		if (lastAccessDate) {
			setUint32(extraFieldExtendedTimestampView, 9, Math.floor(lastAccessDate.getTime() / 1000));
		}
		if (creationDate) {
			setUint32(extraFieldExtendedTimestampView, 13, Math.floor(creationDate.getTime() / 1000));
		}
		try {
			rawExtraFieldNTFS = new Uint8Array(36);
			const extraFieldNTFSView = getDataView(rawExtraFieldNTFS);
			const lastModTimeNTFS = getTimeNTFS(options.lastModDate);
			setUint16(extraFieldNTFSView, 0, EXTRAFIELD_TYPE_NTFS);
			setUint16(extraFieldNTFSView, 2, 32);
			setUint16(extraFieldNTFSView, 8, EXTRAFIELD_TYPE_NTFS_TAG1);
			setUint16(extraFieldNTFSView, 10, 24);
			setBigUint64(extraFieldNTFSView, 12, lastModTimeNTFS);
			setBigUint64(extraFieldNTFSView, 20, getTimeNTFS(lastAccessDate) || lastModTimeNTFS);
			setBigUint64(extraFieldNTFSView, 28, getTimeNTFS(creationDate) || lastModTimeNTFS);
		} catch (_error) {
			rawExtraFieldNTFS = new Uint8Array(0);
		}
	} else {
		rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array(0);
	}
	const fileEntry = {
		version: version || VERSION_DEFLATE,
		versionMadeBy,
		zip64,
		directory: Boolean(directory),
		filenameUTF8: true,
		rawFilename,
		commentUTF8: true,
		rawComment,
		rawExtraFieldZip64: zip64 ? new Uint8Array(EXTRAFIELD_LENGTH_ZIP64 + 4) : new Uint8Array(0),
		rawExtraFieldExtendedTimestamp,
		rawExtraFieldNTFS,
		rawExtraFieldAES,
		rawExtraField,
		extendedTimestamp,
		msDosCompatible,
		internalFileAttribute,
		externalFileAttribute
	};
	let uncompressedSize = fileEntry.uncompressedSize = 0;
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
	fileEntry.compressionMethod = compressionMethod;
	const headerArray = fileEntry.headerArray = new Uint8Array(26);
	const headerView = getDataView(headerArray);
	setUint16(headerView, 0, fileEntry.version);
	setUint16(headerView, 2, bitFlag);
	setUint16(headerView, 4, compressionMethod);
	const dateArray = new Uint32Array(1);
	const dateView = getDataView(dateArray);
	let lastModDate;
	if (options.lastModDate < MIN_DATE) {
		lastModDate = MIN_DATE;
	} else if (options.lastModDate > MAX_DATE) {
		lastModDate = MAX_DATE;
	} else {
		lastModDate = options.lastModDate;
	}
	setUint16(dateView, 0, (((lastModDate.getHours() << 6) | lastModDate.getMinutes()) << 5) | lastModDate.getSeconds() / 2);
	setUint16(dateView, 2, ((((lastModDate.getFullYear() - 1980) << 4) | (lastModDate.getMonth() + 1)) << 5) | lastModDate.getDate());
	const rawLastModDate = dateArray[0];
	setUint32(headerView, 6, rawLastModDate);
	setUint16(headerView, 22, rawFilename.length);
	const extraFieldLength = rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length + fileEntry.rawExtraField.length;
	setUint16(headerView, 24, extraFieldLength);
	const localHeaderArray = new Uint8Array(30 + rawFilename.length + extraFieldLength);
	const localHeaderView = getDataView(localHeaderArray);
	setUint32(localHeaderView, 0, LOCAL_FILE_HEADER_SIGNATURE);
	arraySet(localHeaderArray, headerArray, 4);
	arraySet(localHeaderArray, rawFilename, 30);
	arraySet(localHeaderArray, rawExtraFieldAES, 30 + rawFilename.length);
	arraySet(localHeaderArray, rawExtraFieldExtendedTimestamp, 30 + rawFilename.length + rawExtraFieldAES.length);
	arraySet(localHeaderArray, rawExtraFieldNTFS, 30 + rawFilename.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length);
	arraySet(localHeaderArray, fileEntry.rawExtraField, 30 + rawFilename.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length);
	let result;
	let compressedSize = 0;
	if (reader) {
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
		await writer.writeUint8Array(localHeaderArray);
		fileEntry.dataWritten = true;
		result = await processData(codec, reader, writer, 0, () => reader.size, config, { onprogress, signal });
		uncompressedSize = fileEntry.uncompressedSize = reader.size;
		compressedSize = result.length;
	} else {
		await writer.writeUint8Array(localHeaderArray);
		fileEntry.dataWritten = true;
	}
	let dataDescriptorArray = new Uint8Array(0);
	let dataDescriptorView, dataDescriptorOffset = 0;
	if (dataDescriptor) {
		dataDescriptorArray = new Uint8Array(zip64 ? (dataDescriptorSignature ? 24 : 20) : (dataDescriptorSignature ? 16 : 12));
		dataDescriptorView = getDataView(dataDescriptorArray);
		if (dataDescriptorSignature) {
			dataDescriptorOffset = 4;
			setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
		}
	}
	if (reader) {
		const signature = result.signature;
		if ((!encrypted || zipCrypto) && signature !== undefined) {
			setUint32(headerView, 10, signature);
			fileEntry.signature = signature;
			if (dataDescriptor) {
				setUint32(dataDescriptorView, dataDescriptorOffset, signature);
			}
		}
		if (zip64) {
			const rawExtraFieldZip64View = getDataView(fileEntry.rawExtraFieldZip64);
			setUint16(rawExtraFieldZip64View, 0, EXTRAFIELD_TYPE_ZIP64);
			setUint16(rawExtraFieldZip64View, 2, EXTRAFIELD_LENGTH_ZIP64);
			setUint32(headerView, 14, MAX_32_BITS);
			setBigUint64(rawExtraFieldZip64View, 12, BigInt(compressedSize));
			setUint32(headerView, 18, MAX_32_BITS);
			setBigUint64(rawExtraFieldZip64View, 4, BigInt(uncompressedSize));
			if (dataDescriptor) {
				setBigUint64(dataDescriptorView, dataDescriptorOffset + 4, BigInt(compressedSize));
				setBigUint64(dataDescriptorView, dataDescriptorOffset + 12, BigInt(uncompressedSize));
			}
		} else {
			setUint32(headerView, 14, compressedSize);
			setUint32(headerView, 18, uncompressedSize);
			if (dataDescriptor) {
				setUint32(dataDescriptorView, dataDescriptorOffset + 4, compressedSize);
				setUint32(dataDescriptorView, dataDescriptorOffset + 8, uncompressedSize);
			}
		}
	}
	if (dataDescriptor) {
		await writer.writeUint8Array(dataDescriptorArray);
	}
	const length = localHeaderArray.length + compressedSize + dataDescriptorArray.length;
	Object.assign(fileEntry, { compressedSize, lastModDate, rawLastModDate, creationDate, lastAccessDate, encrypted, length });
	return fileEntry;
}

async function closeFile(zipWriter, comment, options) {
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
			fileEntry.rawExtraFieldExtendedTimestamp.length +
			fileEntry.rawExtraFieldNTFS.length +
			fileEntry.rawExtraField.length;
	}
	let zip64 = options.zip64 || zipWriter.options.zip64 || false;
	if (directoryOffset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS) {
		if (options.zip64 === false || zipWriter.options.zip64 === false) {
			throw new Error(ERR_UNSUPPORTED_FORMAT);
		} else {
			zip64 = true;
		}
	}
	const directoryArray = new Uint8Array(directoryDataLength + (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH));
	const directoryView = getDataView(directoryArray);
	if (comment && comment.length) {
		if (comment.length <= MAX_16_BITS) {
			setUint16(directoryView, offset + 20, comment.length);
		} else {
			throw new Error(ERR_INVALID_COMMENT);
		}
	}
	for (const [indexFileEntry, fileEntry] of Array.from(files.values()).entries()) {
		const {
			rawFilename,
			rawExtraFieldZip64,
			rawExtraFieldAES,
			rawExtraField,
			rawComment,
			versionMadeBy,
			headerArray,
			directory,
			zip64,
			msDosCompatible,
			internalFileAttribute,
			externalFileAttribute
		} = fileEntry;
		let rawExtraFieldExtendedTimestamp;
		let rawExtraFieldNTFS;
		if (fileEntry.extendedTimestamp) {
			rawExtraFieldNTFS = fileEntry.rawExtraFieldNTFS;
			rawExtraFieldExtendedTimestamp = new Uint8Array(9);
			const extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
			setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
			setUint16(extraFieldExtendedTimestampView, 2, rawExtraFieldExtendedTimestamp.length - 4);
			setUint8(extraFieldExtendedTimestampView, 4, 0x1);
			setUint32(extraFieldExtendedTimestampView, 5, Math.floor(fileEntry.lastModDate.getTime() / 1000));
		} else {
			rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array(0);
		}
		const extraFieldLength = rawExtraFieldZip64.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length + rawExtraField.length;
		setUint32(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
		setUint16(directoryView, offset + 4, versionMadeBy);
		arraySet(directoryArray, headerArray, offset + 6);
		setUint16(directoryView, offset + 30, extraFieldLength);
		setUint16(directoryView, offset + 32, rawComment.length);
		setUint32(directoryView, offset + 34, internalFileAttribute);
		if (externalFileAttribute) {
			setUint32(directoryView, offset + 38, externalFileAttribute);
		} else if (directory && msDosCompatible) {
			setUint8(directoryView, offset + 38, FILE_ATTR_MSDOS_DIR_MASK);
		}
		if (zip64) {
			setUint32(directoryView, offset + 42, MAX_32_BITS);
		} else {
			setUint32(directoryView, offset + 42, fileEntry.offset);
		}
		arraySet(directoryArray, rawFilename, offset + 46);
		arraySet(directoryArray, rawExtraFieldZip64, offset + 46 + rawFilename.length);
		arraySet(directoryArray, rawExtraFieldAES, offset + 46 + rawFilename.length + rawExtraFieldZip64.length);
		arraySet(directoryArray, rawExtraFieldExtendedTimestamp, offset + 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length);
		arraySet(directoryArray, rawExtraFieldNTFS, offset + 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length);
		arraySet(directoryArray, rawExtraField, offset + 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length);
		arraySet(directoryArray, rawComment, offset + 46 + rawFilename.length + extraFieldLength);
		offset += 46 + rawFilename.length + extraFieldLength + rawComment.length;
		if (options.onprogress) {
			try {
				options.onprogress(indexFileEntry + 1, files.size, new Entry(fileEntry));
			} catch (_error) {
				// ignored
			}
		}
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
	if (comment && comment.length) {
		await writer.writeUint8Array(comment);
	}
}

function sliceAsArrayBuffer(blob, start, end) {
	if (blob.arrayBuffer) {
		if (start || end) {
			return blob.slice(start, end).arrayBuffer();
		} else {
			return blob.arrayBuffer();
		}
	} else {
		const fileReader = new FileReader();
		return new Promise((resolve, reject) => {
			fileReader.onload = event => resolve(event.target.result);
			fileReader.onerror = () => reject(fileReader.error);
			fileReader.readAsArrayBuffer(start || end ? blob.slice(start, end) : blob);
		});
	}
}

async function writeBlob(writer, blob, start = 0) {
	const blockSize = 512 * 1024 * 1024;
	await writeSlice();

	async function writeSlice() {
		if (start < blob.size) {
			const arrayBuffer = await sliceAsArrayBuffer(blob, start, start + blockSize);
			await writer.writeUint8Array(new Uint8Array(arrayBuffer));
			start += blockSize;
			await writeSlice();
		}
	}
}

function getTimeNTFS(date) {
	if (date) {
		return ((BigInt(date.getTime()) + BigInt(11644473600000)) * BigInt(10000));
	}
}

function getOptionValue(zipWriter, options, name) {
	return options[name] === undefined ? zipWriter.options[name] : options[name];
}

function getMaximumCompressedSize(uncompressedSize) {
	return uncompressedSize + (5 * (Math.floor(uncompressedSize / 16383) + 1));
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

function arraySet(array, typedArray, offset) {
	array.set(typedArray, offset);
}

function getDataView(array) {
	return new DataView(array.buffer);
}