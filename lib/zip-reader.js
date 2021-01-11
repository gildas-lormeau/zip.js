"use strict";

const ERR_BAD_FORMAT = "File format is not recognized.";
const ERR_ZIP64 = "File is using Zip64 (4gb+ file size).";
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

import createCodec from "./codec.js";
import processData from "./processor.js";

class ZipReader {

	constructor(reader, config = {}) {
		this.reader = reader;
		this.config = config;
	}

	async getEntries() {
		if (!this.readerInitialized) {
			await this.reader.init();
			this.readerInitialized = true;
		}
		const endOfCentralDirectoryRecord = await seekEndOfCentralDirectoryRecord(this.reader);
		if (endOfCentralDirectoryRecord) {
			let dataView = new DataView(endOfCentralDirectoryRecord);
			const dataLength = dataView.getUint32(16, true);
			if (dataLength < 0 || dataLength >= this.reader.size) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const filesLength = dataView.getUint16(8, true);
			const dataArray = await this.reader.readUint8Array(dataLength, this.reader.size - dataLength);
			dataView = new DataView(dataArray.buffer);
			const entries = [];
			let offset = 0;
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const entry = new Entry(this);
				if (dataView.getUint32(offset) != 0x504b0102) {
					throw new Error(ERR_BAD_FORMAT);
				}
				readCommonHeader(entry, dataView, offset + 6, true);
				entry.commentLength = dataView.getUint16(offset + 32, true);
				entry.directory = ((dataView.getUint8(offset + 38) & 0x10) == 0x10);
				entry.offset = dataView.getUint32(offset + 42, true);
				const filename = getString(dataArray.subarray(offset + 46, offset + 46 + entry.filenameLength));
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
		if (dataView.getUint32(0) != 0x504b0304) {
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
	if (entry.compressedSize == 0xFFFFFFFF || entry.uncompressedSize == 0xFFFFFFFF) {
		throw ERR_ZIP64;
	}
	entry.filenameLength = dataView.getUint16(offset + 22, true);
	entry.extraFieldLength = dataView.getUint16(offset + 24, true);
}

async function seekEndOfCentralDirectoryRecord(reader) {
	const minimumBytes = 22;
	if (reader.size < minimumBytes) {
		throw new Error(ERR_BAD_FORMAT);
	}
	const maximumBytes = minimumBytes + 65536;
	let offset = minimumBytes;
	let directoryRecord = await seek(offset);
	if (!directoryRecord) {
		directoryRecord = await seek(Math.min(maximumBytes, reader.size));
	}
	if (!directoryRecord) {
		throw new Error(ERR_BAD_FORMAT);
	}
	return directoryRecord;

	async function seek(length) {
		const bytes = await reader.readUint8Array(reader.size - length, length);
		for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) {
			if (bytes[indexByte] == 0x50 && bytes[indexByte + 1] == 0x4b && bytes[indexByte + 2] == 0x05 && bytes[indexByte + 3] == 0x06) {
				return bytes.slice(indexByte, indexByte + minimumBytes).buffer;
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