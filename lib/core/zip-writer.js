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

/* global BigInt */

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
import {
	getConfiguration,
	getChunkSize
} from "./configuration.js";
import {
	CODEC_DEFLATE,
	runWorker
} from "./codec-pool.js";
import encodeText from "./util/encode-text.js";
import {
	initStream,
	BlobWriter
} from "./io.js";
import Entry from "./zip-entry.js";

const ERR_DUPLICATED_NAME = "File already exists";
const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
const ERR_INVALID_VERSION = "Version exceeds 65535";
const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
const ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported (make sure 'keepOrder' is set to 'true')";

const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
const EXTRAFIELD_LENGTH_ZIP64 = 24;

let workers = 0;
const pendingEntries = [];

class ZipWriter {

	constructor(writer, options = {}) {
		if (writer.writable.size == undefined) {
			writer.writable.size = 0;
		}
		Object.assign(this, {
			writer,
			options,
			config: getConfiguration(),
			files: new Map(),
			filenames: new Set(),
			offset: writer.writable.size,
			pendingEntriesSize: 0,
			pendingAddFileCalls: new Set()
		});
	}

	async add(name = "", reader, options = {}) {
		const zipWriter = this;
		const {
			pendingAddFileCalls,
			config
		} = zipWriter;
		if (workers < config.maxWorkers) {
			workers++;
		} else {
			await new Promise(resolve => pendingEntries.push(resolve));
		}
		let promiseAddFile;
		try {
			name = name.trim();
			if (zipWriter.filenames.has(name)) {
				throw new Error(ERR_DUPLICATED_NAME);
			}
			zipWriter.filenames.add(name);
			promiseAddFile = addFile(zipWriter, name, reader, options);
			pendingAddFileCalls.add(promiseAddFile);
			return await promiseAddFile;
		} catch (error) {
			zipWriter.filenames.delete(name);
			throw error;
		} finally {
			pendingAddFileCalls.delete(promiseAddFile);
			const pendingEntry = pendingEntries.shift();
			if (pendingEntry) {
				pendingEntry();
			} else {
				workers--;
			}
		}
	}

	async close(comment = new Uint8Array(), options = {}) {
		const { pendingAddFileCalls, writer } = this;
		const { writable } = writer;
		while (pendingAddFileCalls.size) {
			await Promise.all(Array.from(pendingAddFileCalls));
		}
		await closeFile(this, comment, options);
		if (!writer.preventClose && !options.preventClose) {
			await writable.getWriter().close();
		}
		return writer.getData ? writer.getData() : writable;
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
	let rawExtraField = new Uint8Array();
	const { extraField } = options;
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
	let maximumEntrySize = 0;
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
		await initStream(reader);
		if (reader.size === undefined) {
			options.dataDescriptor = true;
		} else {
			uncompressedSize = reader.size;
		}
		maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
	}
	let zip64 = options.zip64 || zipWriter.options.zip64 || false;
	if (zipWriter.offset + zipWriter.pendingEntriesSize >= MAX_32_BITS ||
		uncompressedSize >= MAX_32_BITS ||
		maximumCompressedSize >= MAX_32_BITS) {
		if (options.zip64 === false || zipWriter.options.zip64 === false || !keepOrder) {
			throw new Error(ERR_UNSUPPORTED_FORMAT);
		} else {
			zip64 = true;
		}
	}
	const level = getOptionValue(zipWriter, options, "level");
	const useWebWorkers = getOptionValue(zipWriter, options, "useWebWorkers");
	const bufferedWrite = getOptionValue(zipWriter, options, "bufferedWrite");
	let dataDescriptor = getOptionValue(zipWriter, options, "dataDescriptor");
	let dataDescriptorSignature = getOptionValue(zipWriter, options, "dataDescriptorSignature");
	const signal = getOptionValue(zipWriter, options, "signal");
	const useCompressionStream = getOptionValue(zipWriter, options, "useCompressionStream");
	if (dataDescriptor === undefined) {
		dataDescriptor = true;
	}
	if (dataDescriptor && dataDescriptorSignature === undefined) {
		dataDescriptorSignature = false;
	}
	options = Object.assign({}, options, {
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
		externalFileAttribute,
		useCompressionStream
	});
	const headerInfo = getHeaderInfo(options);
	const dataDescriptorInfo = getDataDescriptorInfo(options);
	maximumEntrySize = headerInfo.localHeaderArray.length + maximumCompressedSize + dataDescriptorInfo.dataDescriptorArray.length;
	zipWriter.pendingEntriesSize += maximumEntrySize;
	const fileEntry = await getFileEntry(zipWriter, name, reader, { headerInfo, dataDescriptorInfo }, options);
	if (maximumEntrySize) {
		zipWriter.pendingEntriesSize -= maximumEntrySize;
	}
	Object.assign(fileEntry, { name, comment, extraField });
	return new Entry(fileEntry);
}

async function getFileEntry(zipWriter, name, reader, entryInfo, options) {
	const {
		files,
		writer
	} = zipWriter;
	const {
		keepOrder,
		dataDescriptor,
		zipCrypto,
		signal
	} = options;
	const previousFileEntry = Array.from(files.values()).pop();
	let fileEntry = {};
	let bufferedWrite;
	let releaseLockWriter;
	let releaseLockCurrentFileEntry;
	let writingBufferedData;
	let fileWriter;
	files.set(name, fileEntry);
	try {
		let lockPreviousFileEntry;
		if (keepOrder) {
			lockPreviousFileEntry = previousFileEntry && previousFileEntry.lock;
			requestLockCurrentFileEntry();
		}
		if (options.bufferedWrite || zipWriter.lockWriter || !dataDescriptor) {
			fileWriter = new BlobWriter();
			fileWriter.writable.size = 0;
			bufferedWrite = true;
			await initStream(writer);
		} else {
			fileWriter = writer;
			zipWriter.lockWriter = Promise.resolve();
			releaseLockWriter = () => delete zipWriter.lockWriter;
		}
		await initStream(fileWriter);
		if (!bufferedWrite) {
			await lockPreviousFileEntry;
		}
		fileEntry.writingData = true;
		fileEntry = await createFileEntry(reader, fileWriter, fileEntry, entryInfo, zipWriter.config, options);
		files.set(name, fileEntry);
		fileEntry.filename = name;
		if (bufferedWrite) {
			await fileWriter.writable.getWriter().close();
			let blob = await fileWriter.getData();
			await lockPreviousFileEntry;
			await requestLockWriter();
			writingBufferedData = true;
			const { writable } = writer;
			if (!dataDescriptor) {
				const arrayBuffer = await sliceAsArrayBuffer(blob, 0, 26);
				const arrayBufferView = new DataView(arrayBuffer);
				if (!fileEntry.encrypted || zipCrypto) {
					setUint32(arrayBufferView, 14, fileEntry.signature);
				}
				if (fileEntry.zip64) {
					setUint32(arrayBufferView, 18, MAX_32_BITS);
					setUint32(arrayBufferView, 22, MAX_32_BITS);
				} else {
					setUint32(arrayBufferView, 18, fileEntry.compressedSize);
					setUint32(arrayBufferView, 22, fileEntry.uncompressedSize);
				}
				await writeData(writable, new Uint8Array(arrayBuffer));
				blob = blob.slice(arrayBuffer.byteLength);
			}
			await blob.stream().pipeTo(writable, { preventClose: true, signal });
			writingBufferedData = false;
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
		if ((bufferedWrite && writingBufferedData) || (!bufferedWrite && fileEntry.writingData)) {
			zipWriter.hasCorruptedEntries = true;
			if (error) {
				error.corruptedEntry = true;
			}
			if (bufferedWrite) {
				zipWriter.offset += fileWriter.writable.size;
			} else {
				zipWriter.offset = fileWriter.writable.size;
			}
		}
		files.delete(name);
		throw error;
	} finally {
		if (releaseLockCurrentFileEntry) {
			releaseLockCurrentFileEntry();
		}
		if (releaseLockWriter) {
			releaseLockWriter();
		}
	}

	function requestLockCurrentFileEntry() {
		fileEntry.lock = new Promise(resolve => releaseLockCurrentFileEntry = resolve);
	}

	async function requestLockWriter() {
		const { lockWriter } = zipWriter;
		if (lockWriter) {
			await lockWriter.then(() => delete zipWriter.lockWriter);
			return requestLockWriter();
		} else {
			zipWriter.lockWriter = new Promise(resolve => releaseLockWriter = resolve);
		}
	}
}

async function createFileEntry(reader, writer, pendingFileEntry, entryInfo, config, options) {
	const {
		headerInfo,
		dataDescriptorInfo
	} = entryInfo;
	const {
		localHeaderArray,
		headerArray,
		lastModDate,
		rawLastModDate,
		encrypted,
		compressed,
		version,
		compressionMethod,
		rawExtraFieldExtendedTimestamp,
		rawExtraFieldNTFS,
		rawExtraFieldAES
	} = headerInfo;
	const { dataDescriptorArray } = dataDescriptorInfo;
	const {
		rawFilename,
		lastAccessDate,
		creationDate,
		password,
		level,
		zip64,
		zipCrypto,
		dataDescriptor,
		directory,
		versionMadeBy,
		rawComment,
		rawExtraField,
		useWebWorkers,
		onstart,
		onprogress,
		onend,
		signal,
		encryptionStrength,
		extendedTimestamp,
		msDosCompatible,
		internalFileAttribute,
		externalFileAttribute,
		useCompressionStream
	} = options;
	const fileEntry = {
		lock: pendingFileEntry.lock,
		versionMadeBy,
		zip64,
		directory: Boolean(directory),
		filenameUTF8: true,
		rawFilename,
		commentUTF8: true,
		rawComment,
		rawExtraFieldExtendedTimestamp,
		rawExtraFieldNTFS,
		rawExtraFieldAES,
		rawExtraField,
		extendedTimestamp,
		msDosCompatible,
		internalFileAttribute,
		externalFileAttribute
	};
	let uncompressedSize = 0;
	let signature;
	let compressedSize = 0;
	const { writable } = writer;
	if (reader) {
		reader.chunkSize = getChunkSize(config);
		await writeData(writable, localHeaderArray);
		const size = () => reader.size;
		const readable = reader.readable;
		readable.size = size;
		const workerOptions = {
			options: {
				codecType: CODEC_DEFLATE,
				level,
				password,
				encryptionStrength,
				zipCrypto: encrypted && zipCrypto,
				passwordVerification: encrypted && zipCrypto && (rawLastModDate >> 8) & 0xFF,
				signed: true,
				compressed,
				encrypted,
				useWebWorkers,
				useCompressionStream
			},
			config,
			streamOptions: { signal, size, onstart, onprogress, onend },
			codecConstructor: config.Deflate
		};
		const previousSize = writable.size;
		signature = (await runWorker({ readable, writable }, workerOptions)).signature;
		uncompressedSize = reader.size = readable.size();
		compressedSize = writable.size - previousSize;
	} else {
		await writeData(writable, localHeaderArray);
	}
	const rawExtraFieldZip64 = zip64 ? new Uint8Array(EXTRAFIELD_LENGTH_ZIP64 + 4) : new Uint8Array();
	if (reader) {
		setEntryInfo({
			signature,
			rawExtraFieldZip64,
			compressedSize,
			uncompressedSize,
			headerInfo,
			dataDescriptorInfo
		}, options);
	}
	if (dataDescriptor) {
		await writeData(writable, dataDescriptorArray);
	}
	Object.assign(fileEntry, {
		compressedSize,
		lastModDate,
		rawLastModDate,
		creationDate,
		lastAccessDate,
		encrypted,
		length: localHeaderArray.length + compressedSize + dataDescriptorArray.length,
		compressionMethod,
		version,
		headerArray,
		signature,
		rawExtraFieldZip64
	});
	return fileEntry;
}

function getHeaderInfo(options) {
	const {
		rawFilename,
		lastAccessDate,
		creationDate,
		password,
		level,
		zip64,
		zipCrypto,
		dataDescriptor,
		directory,
		rawExtraField,
		encryptionStrength,
		extendedTimestamp,
	} = options;
	let version = options.version || VERSION_DEFLATE;
	const compressed = level !== 0 && !directory;
	const encrypted = Boolean(password && password.length);
	let rawExtraFieldAES;
	if (encrypted && !zipCrypto) {
		rawExtraFieldAES = new Uint8Array(EXTRAFIELD_DATA_AES.length + 2);
		const extraFieldAESView = getDataView(rawExtraFieldAES);
		setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
		arraySet(rawExtraFieldAES, EXTRAFIELD_DATA_AES, 2);
		setUint8(extraFieldAESView, 8, encryptionStrength);
	} else {
		rawExtraFieldAES = new Uint8Array();
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
			rawExtraFieldNTFS = new Uint8Array();
		}
	} else {
		rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array();
	}
	let bitFlag = BITFLAG_LANG_ENCODING_FLAG;
	if (dataDescriptor) {
		bitFlag = bitFlag | BITFLAG_DATA_DESCRIPTOR;
	}
	let compressionMethod = COMPRESSION_METHOD_STORE;
	if (compressed) {
		compressionMethod = COMPRESSION_METHOD_DEFLATE;
	}
	if (zip64) {
		version = version > VERSION_ZIP64 ? version : VERSION_ZIP64;
	}
	if (encrypted) {
		bitFlag = bitFlag | BITFLAG_ENCRYPTED;
		if (!zipCrypto) {
			version = version > VERSION_AES ? version : VERSION_AES;
			compressionMethod = COMPRESSION_METHOD_AES;
			if (compressed) {
				rawExtraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
			}
		}
	}
	const headerArray = new Uint8Array(26);
	const headerView = getDataView(headerArray);
	setUint16(headerView, 0, version);
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
	const extraFieldLength = rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length + rawExtraField.length;
	setUint16(headerView, 24, extraFieldLength);
	const localHeaderArray = new Uint8Array(30 + rawFilename.length + extraFieldLength);
	const localHeaderView = getDataView(localHeaderArray);
	setUint32(localHeaderView, 0, LOCAL_FILE_HEADER_SIGNATURE);
	arraySet(localHeaderArray, headerArray, 4);
	arraySet(localHeaderArray, rawFilename, 30);
	arraySet(localHeaderArray, rawExtraFieldAES, 30 + rawFilename.length);
	arraySet(localHeaderArray, rawExtraFieldExtendedTimestamp, 30 + rawFilename.length + rawExtraFieldAES.length);
	arraySet(localHeaderArray, rawExtraFieldNTFS, 30 + rawFilename.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length);
	arraySet(localHeaderArray, rawExtraField, 30 + rawFilename.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length);
	return {
		localHeaderArray,
		headerArray,
		headerView,
		lastModDate,
		rawLastModDate,
		encrypted,
		compressed,
		version,
		compressionMethod,
		rawExtraFieldExtendedTimestamp,
		rawExtraFieldNTFS,
		rawExtraFieldAES
	};
}

function getDataDescriptorInfo(options) {
	const {
		zip64,
		dataDescriptor,
		dataDescriptorSignature
	} = options;
	let dataDescriptorArray = new Uint8Array();
	let dataDescriptorView, dataDescriptorOffset = 0;
	if (dataDescriptor) {
		dataDescriptorArray = new Uint8Array(zip64 ? (dataDescriptorSignature ? 24 : 20) : (dataDescriptorSignature ? 16 : 12));
		dataDescriptorView = getDataView(dataDescriptorArray);
		if (dataDescriptorSignature) {
			dataDescriptorOffset = 4;
			setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
		}
	}
	return {
		dataDescriptorArray,
		dataDescriptorView,
		dataDescriptorOffset
	};
}

function setEntryInfo(entryInfo, options) {
	const {
		signature,
		rawExtraFieldZip64,
		compressedSize,
		uncompressedSize,
		headerInfo,
		dataDescriptorInfo
	} = entryInfo;
	const {
		headerView,
		encrypted
	} = headerInfo;
	const {
		dataDescriptorView,
		dataDescriptorOffset
	} = dataDescriptorInfo;
	const {
		zip64,
		zipCrypto,
		dataDescriptor
	} = options;
	if ((!encrypted || zipCrypto) && signature !== undefined) {
		setUint32(headerView, 10, signature);
		if (dataDescriptor) {
			setUint32(dataDescriptorView, dataDescriptorOffset, signature);
		}
	}
	if (zip64) {
		const rawExtraFieldZip64View = getDataView(rawExtraFieldZip64);
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

async function closeFile(zipWriter, comment, options) {
	const { files } = zipWriter;
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
			rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array();
		}
		const extraFieldLength = rawExtraFieldZip64.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length + rawExtraField.length;
		setUint32(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
		setUint16(directoryView, offset + 4, versionMadeBy);
		arraySet(directoryArray, headerArray, offset + 6);
		setUint16(directoryView, offset + 30, extraFieldLength);
		setUint16(directoryView, offset + 32, rawComment.length);
		setUint16(directoryView, offset + 36, internalFileAttribute);
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
				await options.onprogress(indexFileEntry + 1, files.size, new Entry(fileEntry));
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
	if (comment && comment.length) {
		if (comment.length <= MAX_16_BITS) {
			setUint16(directoryView, offset + 20, comment.length);
		} else {
			throw new Error(ERR_INVALID_COMMENT);
		}
	}
	const { writable } = zipWriter.writer;
	await initStream(zipWriter.writer);
	await writeData(writable, directoryArray);
	if (comment && comment.length) {
		await writeData(writable, comment);
	}
}

function sliceAsArrayBuffer(blob, start, end) {
	if (start || end) {
		return blob.slice(start, end).arrayBuffer();
	} else {
		return blob.arrayBuffer();
	}
}

async function writeData(writable, array) {
	const streamWriter = writable.getWriter();
	await streamWriter.ready;
	writable.size += array.length;
	await streamWriter.write(array);
	streamWriter.releaseLock();
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