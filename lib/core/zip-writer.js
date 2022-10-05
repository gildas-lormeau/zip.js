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

/* global BigInt, ReadableStream, WritableStream */
// deno-lint-ignore-file no-this-alias

import {
	MAX_32_BITS,
	MAX_16_BITS,
	COMPRESSION_METHOD_DEFLATE,
	COMPRESSION_METHOD_STORE,
	COMPRESSION_METHOD_AES,
	SPLIT_ZIP_FILE_SIGNATURE,
	LOCAL_FILE_HEADER_SIGNATURE,
	DATA_DESCRIPTOR_RECORD_SIGNATURE,
	CENTRAL_FILE_HEADER_SIGNATURE,
	END_OF_CENTRAL_DIR_SIGNATURE,
	ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE,
	ZIP64_END_OF_CENTRAL_DIR_SIGNATURE,
	EXTRAFIELD_TYPE_AES,
	EXTRAFIELD_TYPE_ZIP64,
	EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP,
	EXTRAFIELD_TYPE_NTFS,
	EXTRAFIELD_TYPE_NTFS_TAG1,
	END_OF_CENTRAL_DIR_LENGTH,
	ZIP64_END_OF_CENTRAL_DIR_LENGTH,
	ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH,
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
	MAX_DATE,
	UNDEFINED_VALUE,
	FUNCTION_TYPE
} from "./constants.js";
import {
	getConfiguration,
	getChunkSize
} from "./configuration.js";
import {
	CODEC_DEFLATE,
	runWorker
} from "./codec-pool.js";
import {
	initStream,
	BlobWriter,
	SplitZipWriter
} from "./io.js";
import { encodeText } from "./util/encode-text.js";
import { Entry } from "./zip-entry.js";

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
const EXTRAFIELD_LENGTH_ZIP64 = 28;

let workers = 0;
const pendingEntries = [];

class ZipWriter {

	constructor(writer, options = {}) {
		if (writer.writable === UNDEFINED_VALUE && typeof writer.next == FUNCTION_TYPE) {
			writer = new SplitZipWriter(writer);
		}
		if (writer instanceof WritableStream) {
			writer = { writable: writer };
		}
		if (writer.writable.size === UNDEFINED_VALUE) {
			writer.writable.size = 0;
		}
		const splitZipFile = writer instanceof SplitZipWriter;
		if (!splitZipFile) {
			Object.assign(writer, {
				diskNumber: 0,
				diskOffset: 0,
				availableSize: Infinity
			});
		}
		Object.assign(this, {
			writer,
			addSplitZipSignature: splitZipFile,
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
			await writable.close();
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
	if (getLength(rawFilename) > MAX_16_BITS) {
		throw new Error(ERR_INVALID_ENTRY_NAME);
	}
	const comment = options.comment || "";
	const rawComment = encodeText(comment);
	if (getLength(rawComment) > MAX_16_BITS) {
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
	if (password !== UNDEFINED_VALUE && encryptionStrength !== UNDEFINED_VALUE && (encryptionStrength < 1 || encryptionStrength > 3)) {
		throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
	}
	let rawExtraField = new Uint8Array();
	const { extraField } = options;
	if (extraField) {
		let extraFieldSize = 0;
		let offset = 0;
		extraField.forEach(data => extraFieldSize += 4 + getLength(data));
		rawExtraField = new Uint8Array(extraFieldSize);
		extraField.forEach((data, type) => {
			if (type > MAX_16_BITS) {
				throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
			}
			if (getLength(data) > MAX_16_BITS) {
				throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
			}
			arraySet(rawExtraField, new Uint16Array([type]), offset);
			arraySet(rawExtraField, new Uint16Array([getLength(data)]), offset + 2);
			arraySet(rawExtraField, data, offset + 4);
			offset += 4 + getLength(data);
		});
	}
	let extendedTimestamp = getOptionValue(zipWriter, options, "extendedTimestamp");
	if (extendedTimestamp === UNDEFINED_VALUE) {
		extendedTimestamp = true;
	}
	let maximumCompressedSize = 0;
	let maximumEntrySize = 0;
	let keepOrder = getOptionValue(zipWriter, options, "keepOrder");
	if (keepOrder === UNDEFINED_VALUE) {
		keepOrder = true;
	}
	let uncompressedSize = 0;
	let msDosCompatible = getOptionValue(zipWriter, options, "msDosCompatible");
	if (msDosCompatible === UNDEFINED_VALUE) {
		msDosCompatible = true;
	}
	const internalFileAttribute = getOptionValue(zipWriter, options, "internalFileAttribute") || 0;
	const externalFileAttribute = getOptionValue(zipWriter, options, "externalFileAttribute") || 0;
	let zip64 = getOptionValue(zipWriter, options, "zip64");
	if (reader) {
		if (reader instanceof ReadableStream) {
			reader = {
				readable: reader
			};
		}
		await initStream(reader);
		if (reader.size === UNDEFINED_VALUE) {
			options.dataDescriptor = true;
			if (zip64 || zip64 === UNDEFINED_VALUE) {
				zip64 = true;
				maximumCompressedSize = MAX_32_BITS;
			}
		} else {
			uncompressedSize = reader.size;
			maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
		}
	}
	if (zipWriter.offset + zipWriter.pendingEntriesSize >= MAX_32_BITS ||
		uncompressedSize >= MAX_32_BITS ||
		maximumCompressedSize >= MAX_32_BITS) {
		if (zip64 === false || !keepOrder) {
			throw new Error(ERR_UNSUPPORTED_FORMAT);
		} else {
			zip64 = true;
		}
	}
	zip64 = zip64 || false;
	const level = getOptionValue(zipWriter, options, "level");
	const useWebWorkers = getOptionValue(zipWriter, options, "useWebWorkers");
	const bufferedWrite = getOptionValue(zipWriter, options, "bufferedWrite");
	let dataDescriptor = getOptionValue(zipWriter, options, "dataDescriptor");
	let dataDescriptorSignature = getOptionValue(zipWriter, options, "dataDescriptorSignature");
	const signal = getOptionValue(zipWriter, options, "signal");
	const useCompressionStream = getOptionValue(zipWriter, options, "useCompressionStream");
	if (dataDescriptor === UNDEFINED_VALUE) {
		dataDescriptor = true;
	}
	if (dataDescriptor && dataDescriptorSignature === UNDEFINED_VALUE) {
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
	maximumEntrySize = getLength(headerInfo.localHeaderArray, dataDescriptorInfo.dataDescriptorArray) + maximumCompressedSize;
	zipWriter.pendingEntriesSize += maximumEntrySize;
	let fileEntry;
	try {
		fileEntry = await getFileEntry(zipWriter, name, reader, { headerInfo, dataDescriptorInfo }, options);
	} catch (error) {
		if (!error.corruptedEntry && maximumEntrySize) {
			zipWriter.pendingEntriesSize -= maximumEntrySize;
		}
		throw error;
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
		signal
	} = options;
	const previousFileEntry = Array.from(files.values()).pop();
	let fileEntry = {};
	let bufferedWrite;
	let releaseLockWriter;
	let releaseLockCurrentFileEntry;
	let writingBufferedEntryData;
	let writingEntryData;
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
		const { writable, diskNumber } = writer;
		let { diskOffset } = writer;
		if (zipWriter.addSplitZipSignature) {
			delete zipWriter.addSplitZipSignature;
			const signatureArray = new Uint8Array(4);
			const signatureArrayView = new DataView(signatureArray.buffer);
			setUint32(signatureArrayView, 0, SPLIT_ZIP_FILE_SIGNATURE);
			await writeData(writable, signatureArray);
			zipWriter.offset += 4;
		}
		if (!bufferedWrite) {
			await lockPreviousFileEntry;
		}
		writingEntryData = true;
		fileEntry.diskNumberStart = diskNumber;
		fileEntry = await createFileEntry(reader, fileWriter, fileEntry, entryInfo, zipWriter.config, options);
		writingEntryData = false;
		files.set(name, fileEntry);
		fileEntry.filename = name;
		if (bufferedWrite) {
			await fileWriter.writable.close();
			let blob = await fileWriter.getData();
			await lockPreviousFileEntry;
			await requestLockWriter();
			writingBufferedEntryData = true;
			if (!dataDescriptor) {
				blob = await setMissingInfo(fileEntry, blob, writable, options);
			}
			fileEntry.diskNumberStart = writer.diskNumber;
			diskOffset = writer.diskOffset;
			await blob.stream().pipeTo(writable, { preventClose: true, signal });
			writable.size += blob.size;
			writingBufferedEntryData = false;
		}
		fileEntry.offset = zipWriter.offset - diskOffset;
		if (fileEntry.zip64) {
			setZip64Info(fileEntry);
		} else if (fileEntry.offset >= MAX_32_BITS) {
			throw new Error(ERR_UNSUPPORTED_FORMAT);
		}
		zipWriter.offset += fileEntry.length;
		return fileEntry;
	} catch (error) {
		if ((bufferedWrite && writingBufferedEntryData) || (!bufferedWrite && writingEntryData)) {
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

async function createFileEntry(reader, writer, { diskNumberStart, lock }, entryInfo, config, options) {
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
		lock,
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
		externalFileAttribute,
		diskNumberStart
	};
	let uncompressedSize = 0;
	let signature;
	let compressedSize = 0;
	const { writable } = writer;
	if (reader) {
		reader.chunkSize = getChunkSize(config);
		await writeData(writable, localHeaderArray);
		const readable = reader.readable;
		const size = readable.size = reader.size;
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
				useCompressionStream,
				transferStreams: false
			},
			config,
			streamOptions: { signal, size, onstart, onprogress, onend }
		};
		const result = await runWorker({ readable, writable }, workerOptions);
		writable.size += result.size;
		signature = result.signature;
		uncompressedSize = reader.size = readable.size;
		compressedSize = result.size;
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
		length: getLength(localHeaderArray, dataDescriptorArray) + compressedSize,
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
		lastModDate,
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
	const compressed = level !== 0 && !directory;
	const encrypted = Boolean(password && getLength(password));
	let rawExtraFieldAES;
	if (encrypted && !zipCrypto) {
		rawExtraFieldAES = new Uint8Array(getLength(EXTRAFIELD_DATA_AES) + 2);
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
		setUint16(extraFieldExtendedTimestampView, 2, getLength(rawExtraFieldExtendedTimestamp) - 4);
		const extraFieldExtendedTimestampFlag = 0x1 + (lastAccessDate ? 0x2 : 0) + (creationDate ? 0x4 : 0);
		setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
		setUint32(extraFieldExtendedTimestampView, 5, Math.floor(lastModDate.getTime() / 1000));
		if (lastAccessDate) {
			setUint32(extraFieldExtendedTimestampView, 9, Math.floor(lastAccessDate.getTime() / 1000));
		}
		if (creationDate) {
			setUint32(extraFieldExtendedTimestampView, 13, Math.floor(creationDate.getTime() / 1000));
		}
		try {
			rawExtraFieldNTFS = new Uint8Array(36);
			const extraFieldNTFSView = getDataView(rawExtraFieldNTFS);
			const lastModTimeNTFS = getTimeNTFS(lastModDate);
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
	let version = options.version || VERSION_DEFLATE;
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
	let lastModDateMsDos;
	if (lastModDate < MIN_DATE) {
		lastModDateMsDos = MIN_DATE;
	} else if (lastModDate > MAX_DATE) {
		lastModDateMsDos = MAX_DATE;
	} else {
		lastModDateMsDos = lastModDate;
	}
	setUint16(dateView, 0, (((lastModDateMsDos.getHours() << 6) | lastModDateMsDos.getMinutes()) << 5) | lastModDateMsDos.getSeconds() / 2);
	setUint16(dateView, 2, ((((lastModDateMsDos.getFullYear() - 1980) << 4) | (lastModDateMsDos.getMonth() + 1)) << 5) | lastModDateMsDos.getDate());
	const rawLastModDate = dateArray[0];
	setUint32(headerView, 6, rawLastModDate);
	setUint16(headerView, 22, getLength(rawFilename));
	const extraFieldLength = getLength(rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField);
	setUint16(headerView, 24, extraFieldLength);
	const localHeaderArray = new Uint8Array(30 + getLength(rawFilename) + extraFieldLength);
	const localHeaderView = getDataView(localHeaderArray);
	setUint32(localHeaderView, 0, LOCAL_FILE_HEADER_SIGNATURE);
	arraySet(localHeaderArray, headerArray, 4);
	arraySet(localHeaderArray, rawFilename, 30);
	arraySet(localHeaderArray, rawExtraFieldAES, 30 + getLength(rawFilename));
	arraySet(localHeaderArray, rawExtraFieldExtendedTimestamp, 30 + getLength(rawFilename, rawExtraFieldAES));
	arraySet(localHeaderArray, rawExtraFieldNTFS, 30 + getLength(rawFilename, rawExtraFieldAES, rawExtraFieldExtendedTimestamp));
	arraySet(localHeaderArray, rawExtraField, 30 + getLength(rawFilename, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS));
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
	if ((!encrypted || zipCrypto) && signature !== UNDEFINED_VALUE) {
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

async function setMissingInfo(fileEntry, entryData, writable, { zipCrypto }) {
	const arrayBuffer = await sliceAsArrayBuffer(entryData, 0, 26);
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
	return entryData.slice(arrayBuffer.byteLength);
}

function setZip64Info(fileEntry) {
	const { rawExtraFieldZip64, offset, diskNumberStart } = fileEntry;
	const rawExtraFieldZip64View = getDataView(rawExtraFieldZip64);
	setBigUint64(rawExtraFieldZip64View, 20, BigInt(offset));
	setUint32(rawExtraFieldZip64View, 28, diskNumberStart);
}

async function closeFile(zipWriter, comment, options) {
	const { files, writer } = zipWriter;
	let offset = 0;
	let directoryDataLength = 0;
	const { diskOffset, writable } = writer;
	let { diskNumber } = writer;
	let directoryOffset = zipWriter.offset - diskOffset;
	let filesLength = files.size;
	for (const [, {
		rawFilename,
		rawExtraFieldZip64,
		rawExtraFieldAES,
		rawExtraField,
		rawComment,
		rawExtraFieldExtendedTimestamp,
		rawExtraFieldNTFS
	}] of files) {
		directoryDataLength += 46 +
			getLength(
				rawFilename,
				rawComment,
				rawExtraFieldZip64,
				rawExtraFieldAES,
				rawExtraFieldExtendedTimestamp,
				rawExtraFieldNTFS,
				rawExtraField);
	}
	let zip64 = options.zip64 || zipWriter.options.zip64 || false;
	if (directoryOffset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS) {
		if (options.zip64 === false || zipWriter.options.zip64 === false) {
			throw new Error(ERR_UNSUPPORTED_FORMAT);
		} else {
			zip64 = true;
		}
	}
	const directoryArray = new Uint8Array(directoryDataLength);
	const directoryView = getDataView(directoryArray);
	for (const [indexFileEntry, fileEntry] of Array.from(files.values()).entries()) {
		const {
			offset: fileEntryOffset,
			rawFilename,
			rawExtraFieldZip64,
			rawExtraFieldAES,
			rawExtraFieldNTFS,
			rawExtraField,
			rawComment,
			versionMadeBy,
			headerArray,
			directory,
			zip64,
			msDosCompatible,
			internalFileAttribute,
			externalFileAttribute,
			extendedTimestamp,
			lastModDate,
			diskNumberStart
		} = fileEntry;
		let rawExtraFieldExtendedTimestamp;
		if (extendedTimestamp) {
			rawExtraFieldExtendedTimestamp = new Uint8Array(9);
			const extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
			setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
			setUint16(extraFieldExtendedTimestampView, 2, getLength(rawExtraFieldExtendedTimestamp) - 4);
			setUint8(extraFieldExtendedTimestampView, 4, 0x1);
			setUint32(extraFieldExtendedTimestampView, 5, Math.floor(lastModDate.getTime() / 1000));
		} else {
			rawExtraFieldExtendedTimestamp = new Uint8Array();
		}
		const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField);
		setUint32(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
		setUint16(directoryView, offset + 4, versionMadeBy);
		arraySet(directoryArray, headerArray, offset + 6);
		setUint16(directoryView, offset + 30, extraFieldLength);
		setUint16(directoryView, offset + 32, getLength(rawComment));
		setUint16(directoryView, offset + 34, zip64 ? MAX_16_BITS : diskNumberStart);
		setUint16(directoryView, offset + 36, internalFileAttribute);
		if (externalFileAttribute) {
			setUint32(directoryView, offset + 38, externalFileAttribute);
		} else if (directory && msDosCompatible) {
			setUint8(directoryView, offset + 38, FILE_ATTR_MSDOS_DIR_MASK);
		}
		setUint32(directoryView, offset + 42, zip64 ? MAX_32_BITS : fileEntryOffset);
		arraySet(directoryArray, rawFilename, offset + 46);
		arraySet(directoryArray, rawExtraFieldZip64, offset + 46 + getLength(rawFilename));
		arraySet(directoryArray, rawExtraFieldAES, offset + 46 + getLength(rawFilename, rawExtraFieldZip64));
		arraySet(directoryArray, rawExtraFieldExtendedTimestamp, offset + 46 + getLength(rawFilename, rawExtraFieldZip64, rawExtraFieldAES));
		arraySet(directoryArray, rawExtraFieldNTFS, offset + 46 + getLength(rawFilename, rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp));
		arraySet(directoryArray, rawExtraField, offset + 46 + getLength(rawFilename, rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS));
		arraySet(directoryArray, rawComment, offset + 46 + getLength(rawFilename) + extraFieldLength);
		offset += 46 + getLength(rawFilename, rawComment) + extraFieldLength;
		if (options.onprogress) {
			try {
				await options.onprogress(indexFileEntry + 1, files.size, new Entry(fileEntry));
			} catch (_error) {
				// ignored
			}
		}
	}
	await initStream(writer);
	await writeData(writable, directoryArray);
	const endOfdirectoryArray = new Uint8Array(zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH);
	const endOfdirectoryView = getDataView(endOfdirectoryArray);
	let lastDiskNumber = writer.diskNumber;
	const { availableSize } = writer;
	if (availableSize < endOfdirectoryArray.length) {
		lastDiskNumber++;
	}
	offset = 0;
	if (zip64) {
		setUint32(endOfdirectoryView, 0, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
		setBigUint64(endOfdirectoryView, 4, BigInt(44));
		setUint16(endOfdirectoryView, 12, 45);
		setUint16(endOfdirectoryView, 14, 45);
		setUint32(endOfdirectoryView, 16, lastDiskNumber);
		setUint32(endOfdirectoryView, 20, diskNumber);
		setBigUint64(endOfdirectoryView, 24, BigInt(filesLength));
		setBigUint64(endOfdirectoryView, 32, BigInt(filesLength));
		setBigUint64(endOfdirectoryView, 40, BigInt(directoryDataLength));
		setBigUint64(endOfdirectoryView, 48, BigInt(directoryOffset));
		setUint32(endOfdirectoryView, 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
		setBigUint64(endOfdirectoryView, 64, BigInt(directoryOffset) + BigInt(directoryDataLength));
		setUint32(endOfdirectoryView, 72, lastDiskNumber + 1);
		diskNumber = MAX_16_BITS;
		filesLength = MAX_16_BITS;
		directoryOffset = MAX_32_BITS;
		directoryDataLength = MAX_32_BITS;
		offset += ZIP64_END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH;
	}
	setUint32(endOfdirectoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
	setUint16(endOfdirectoryView, offset + 4, lastDiskNumber);
	setUint16(endOfdirectoryView, offset + 6, diskNumber);
	setUint16(endOfdirectoryView, offset + 8, filesLength);
	setUint16(endOfdirectoryView, offset + 10, filesLength);
	setUint32(endOfdirectoryView, offset + 12, directoryDataLength);
	setUint32(endOfdirectoryView, offset + 16, directoryOffset);
	const commentLength = getLength(comment);
	if (commentLength) {
		if (commentLength <= MAX_16_BITS) {
			setUint16(endOfdirectoryView, offset + 20, commentLength);
		} else {
			throw new Error(ERR_INVALID_COMMENT);
		}
	}
	await writeData(writable, endOfdirectoryArray);
	if (commentLength) {
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
	writable.size += getLength(array);
	await streamWriter.write(array);
	streamWriter.releaseLock();
}

function getTimeNTFS(date) {
	if (date) {
		return ((BigInt(date.getTime()) + BigInt(11644473600000)) * BigInt(10000));
	}
}

function getOptionValue(zipWriter, options, name) {
	return options[name] === UNDEFINED_VALUE ? zipWriter.options[name] : options[name];
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

function getLength(...arrayLikes) {
	let result = 0;
	arrayLikes.forEach(arrayLike => arrayLike && (result += arrayLike.length));
	return result;
}