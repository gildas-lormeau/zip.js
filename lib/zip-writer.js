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

const ERR_DUPLICATED_NAME = "File already exists.";

import createCodec from "./codec.js";
import { Uint8ArrayWriter } from "./data.js";
import processData from "./processor.js";

class ZipWriter {

	constructor(writer, config = {}) {
		this.writer = writer;
		this.config = config;
		this.files = new Map();
		this.offset = 0;
	}

	async add(name, reader, options = {}) {
		let writer;
		if (options.bufferedWrite) {
			writer = new Uint8ArrayWriter();
			writer.init();
		} else {
			if (!this.writer.initialized) {
				await this.writer.init();
			}
			writer = this.writer;
		}
		name = name.trim();
		if (options.directory && name.charAt(name.length - 1) != "/") {
			name += "/";
		}
		if (this.files.has(name)) {
			throw new Error(ERR_DUPLICATED_NAME);
		}
		const filename = getBytes(encodeUTF8(name));
		const date = options.lastModDate || new Date();
		const headerArray = new Uint8Array(26);
		const headerView = new DataView(headerArray.buffer);
		const outputPassword = options.password && options.password.length && options.password;
		const compressed = options.level !== 0 && !options.directory;
		const outputSigned = this.password === undefined || !this.password.length;
		const fileData = {
			headerArray: headerArray,
			directory: options.directory,
			filename: filename,
			offset: this.offset,
			comment: getBytes(encodeUTF8(options.comment || "")),
			extraField: options.extraField || new Uint8Array([])
		};
		this.files.set(name, fileData);
		if (outputPassword) {
			headerView.setUint32(0, 0x33000900);
			headerView.setUint8(4, 0x63);
			fileData.extraField = new Uint8Array([0x01, 0x99, 0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
			if (compressed) {
				fileData.extraField[9] = 0x08;
			}
		} else {
			headerView.setUint32(0, 0x14000808);
			if (options.version) {
				headerView.setUint8(0, options.version);
			}
			if (compressed) {
				headerView.setUint16(4, 0x0800);
			}
		}
		headerView.setUint16(6, (((date.getHours() << 6) | date.getMinutes()) << 5) | date.getSeconds() / 2, true);
		headerView.setUint16(8, ((((date.getFullYear() - 1980) << 4) | (date.getMonth() + 1)) << 5) | date.getDate(), true);
		headerView.setUint16(22, filename.length, true);
		const extraFieldLength = fileData.extraField.length;
		headerView.setUint16(24, extraFieldLength, true);
		const fileDataArray = new Uint8Array(30 + filename.length + extraFieldLength);
		const fileDataView = new DataView(fileDataArray.buffer);
		fileDataView.setUint32(0, 0x504b0304);
		fileDataArray.set(headerArray, 4);
		fileDataArray.set(filename, 30);
		fileDataArray.set(fileData.extraField, 30 + filename.length);
		await writer.writeUint8Array(fileDataArray);
		let result;
		if (reader) {
			await reader.init();
			const codec = await createCodec(this.config, {
				codecType: "deflate",
				level: options.level,
				outputPassword: options.password,
				outputSigned,
				outputCompressed: compressed,
				outputEncrypted: Boolean(options.password)
			});
			result = await processData(codec, reader, writer, 0, reader.size, this.config, { onprogress: options.onprogress });
		}
		const footerArray = new Uint8Array(16);
		const footerView = new DataView(footerArray.buffer);
		footerView.setUint32(0, 0x504b0708);
		if (reader) {
			if (!outputPassword && result.signature !== undefined) {
				headerView.setUint32(10, result.signature, true);
				footerView.setUint32(4, result.signature, true);
			}
			headerView.setUint32(14, result.length, true);
			footerView.setUint32(8, result.length, true);
			headerView.setUint32(18, reader.size, true);
			footerView.setUint32(12, reader.size, true);
		}
		await writer.writeUint8Array(footerArray);
		if (options.bufferedWrite) {
			await this.writer.writeUint8Array(writer.getData());
			fileData.offset = this.offset;
		}
		this.offset += fileDataArray.length + (result ? result.length : 0) + 16;
	}

	async close(comment) {
		let offset = 0, directoryDataLength = 0;
		for (const [, file] of this.files) {
			directoryDataLength += 46 + file.filename.length + file.comment.length + file.extraField.length;
		}
		const directoryDataArray = new Uint8Array(directoryDataLength + 22);
		const directoryDataView = new DataView(directoryDataArray.buffer);
		for (const [, file] of this.files) {
			directoryDataView.setUint32(offset, 0x504b0102);
			directoryDataView.setUint16(offset + 4, 0x1400);
			directoryDataArray.set(file.headerArray, offset + 6);
			directoryDataView.setUint16(offset + 32, file.comment.length, true);
			if (file.directory) {
				directoryDataView.setUint8(offset + 38, 0x10);
			}
			directoryDataView.setUint32(offset + 42, file.offset, true);
			directoryDataArray.set(file.filename, offset + 46);
			directoryDataArray.set(file.extraField, offset + 46 + file.filename.length);
			directoryDataArray.set(file.comment, offset + 46 + file.filename.length + file.extraField.length);
			offset += 46 + file.filename.length + file.comment.length + file.extraField.length;
		}
		directoryDataView.setUint32(offset, 0x504b0506);
		directoryDataView.setUint16(offset + 8, this.files.size, true);
		directoryDataView.setUint16(offset + 10, this.files.size, true);
		directoryDataView.setUint32(offset + 12, directoryDataLength, true);
		directoryDataView.setUint32(offset + 16, this.offset, true);
		if (comment && comment.length) {
			directoryDataView.setUint16(offset + 20, comment.length, true);
		}
		await this.writer.writeUint8Array(directoryDataArray);
		if (comment && comment.length) {
			await this.writer.writeUint8Array(comment);
		}
		return this.writer.getData();
	}
}

export default ZipWriter;

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