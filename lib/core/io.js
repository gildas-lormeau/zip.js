/*
 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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

/* global Blob, atob, btoa, XMLHttpRequest, URL, fetch, ReadableStream, WritableStream, TransformStream */
// deno-lint-ignore-file no-this-alias

import {
	UNDEFINED_VALUE,
	FUNCTION_TYPE,
	UNDEFINED_TYPE,
	END_OF_CENTRAL_DIR_LENGTH,
	EMPTY_UINT8_ARRAY
} from "./constants.js";
import { getConfiguration, getChunkSize, normalizeChunkSize } from "./configuration.js";
import { concat, toExactUint8Array } from "./util/array.js";
import { toCompatibleReadable, toCompatibleWritable, streamToBlob } from "./util/compatible-streams.js";
import { decodeTextRemovingBOM } from "./util/decode-text.js";

const ERR_HTTP_STATUS = "HTTP error ";
const ERR_HTTP_RANGE = "HTTP Range not supported";
const ERR_HTTP_RESOURCE_CHANGED = "HTTP resource changed";
const ERR_ITERATOR_COMPLETED_TOO_SOON = "Writer iterator completed too soon";
const ERR_WRITER_NOT_INITIALIZED = "Writer not initialized";

const CONTENT_TYPE_TEXT_PLAIN = "text/plain";
const HTTP_HEADER_CONTENT_LENGTH = "Content-Length";
const HTTP_HEADER_CONTENT_ENCODING = "Content-Encoding";
const HTTP_HEADER_CONTENT_RANGE = "Content-Range";
const HTTP_HEADER_ACCEPT_RANGES = "Accept-Ranges";
const HTTP_HEADER_RANGE = "Range";
const HTTP_HEADER_ETAG = "Etag";
const HTTP_HEADER_LAST_MODIFIED = "Last-Modified";
const HTTP_METHOD_HEAD = "HEAD";
const HTTP_METHOD_GET = "GET";
const HTTP_RANGE_UNIT = "bytes";
const DEFAULT_BUFFER_SIZE = 256 * 1024;
const DEFAULT_MAXIMUM_RANGE_SIZE = 16 * 1024 * 1024;

const PROPERTY_NAME_WRITABLE = "writable";
const DISK_BOUNDARY = Symbol();

class Stream {

	constructor() {
		this.size = 0;
	}

	init() {
		this.initialized = true;
	}
}

class Reader extends Stream {

	get readable() {
		return this.createReadable();
	}

	createReadable({ offset = 0, size, chunkSize = getChunkSize(getConfiguration()) } = {}) {
		const reader = this;
		let chunkOffset = 0;
		chunkSize = normalizeChunkSize(chunkSize);
		return new ReadableStream({
			async pull(controller) {
				const dataSize = size === UNDEFINED_VALUE ? chunkSize : Math.min(chunkSize, size - chunkOffset);
				const data = await readUint8Array(reader, offset + chunkOffset, dataSize);
				if (data.length) {
					controller.enqueue(data);
				}
				if ((chunkOffset + chunkSize >= size) || (!data.length && dataSize)) {
					controller.close();
				} else {
					chunkOffset += chunkSize;
				}
			}
		});
	}
}

class Writer extends Stream {

	constructor() {
		super();
		const writer = this;
		const writable = new WritableStream({
			write(chunk) {
				if (!writer.initialized) {
					throw new Error(ERR_WRITER_NOT_INITIALIZED);
				}
				return writer.writeUint8Array(toExactUint8Array(chunk));
			}
		});
		Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
			get() {
				return writable;
			}
		});
	}

	writeUint8Array() {
		// abstract
	}
}

class Data64URIReader extends Reader {

	constructor(dataURI) {
		super();
		let dataEnd = dataURI.length;
		while (dataURI.charAt(dataEnd - 1) == "=") {
			dataEnd--;
		}
		const dataStart = dataURI.indexOf(",") + 1;
		Object.assign(this, {
			dataURI,
			dataStart,
			size: Math.floor((dataEnd - dataStart) * 0.75)
		});
	}

	readUint8Array(offset, length) {
		const {
			dataStart,
			dataURI
		} = this;
		const dataArray = new Uint8Array(length);
		const start = Math.floor(offset / 3) * 4;
		const bytes = atob(dataURI.substring(start + dataStart, Math.ceil((offset + length) / 3) * 4 + dataStart));
		const delta = offset - Math.floor(start / 4) * 3;
		let effectiveLength = 0;
		for (let indexByte = delta; indexByte < delta + length && indexByte < bytes.length; indexByte++) {
			dataArray[indexByte - delta] = bytes.charCodeAt(indexByte);
			effectiveLength++;
		}
		if (effectiveLength < dataArray.length) {
			return dataArray.subarray(0, effectiveLength);
		} else {
			return dataArray;
		}
	}
}

class Data64URIWriter extends Writer {

	constructor(contentType) {
		super();
		Object.assign(this, {
			contentType,
			data: "data:" + (contentType || "") + ";base64,",
			pendingCharacters: ""
		});
	}

	writeUint8Array(array) {
		const writer = this;
		let indexArray;
		let dataString = writer.pendingCharacters;
		const delta = writer.pendingCharacters.length;
		writer.pendingCharacters = "";
		for (indexArray = 0; indexArray < (Math.floor((delta + array.length) / 3) * 3) - delta; indexArray++) {
			dataString += String.fromCharCode(array[indexArray]);
		}
		for (; indexArray < array.length; indexArray++) {
			writer.pendingCharacters += String.fromCharCode(array[indexArray]);
		}
		if (dataString.length > 2) {
			writer.data += btoa(dataString);
		} else {
			writer.pendingCharacters = dataString + writer.pendingCharacters;
		}
	}

	getData() {
		return this.data + btoa(this.pendingCharacters);
	}
}

let blobSliceReliable;
let blobSliceProbe;

function probeBlobSliceReliability() {
	blobSliceProbe = (async () => {
		try {
			const slicedBlob = new Blob([new Uint8Array(3)]).slice(1, 2);
			const streamReader = slicedBlob.stream().getReader();
			let streamedLength = 0;
			let result = await streamReader.read();
			while (!result.done) {
				streamedLength += result.value.length;
				result = await streamReader.read();
			}
			blobSliceReliable = streamedLength == 1;
		} catch {
			blobSliceReliable = false;
		}
	})();
}

class BlobReader extends Reader {

	constructor(blob) {
		super();
		Object.assign(this, {
			sourceBlob: blob,
			size: blob.size
		});
		if (!blobSliceProbe) {
			probeBlobSliceReliability();
		}
	}

	createReadable(options) {
		const reader = this;
		const { sourceBlob, size } = reader;
		const { offset = 0, size: readSize = size - offset } = options || {};
		if (!offset && readSize >= size) {
			return toCompatibleReadable(sourceBlob.stream());
		}
		if (blobSliceReliable) {
			return toCompatibleReadable(sourceBlob.slice(offset, offset + readSize).stream());
		}
		return super.createReadable(options);
	}

	async readUint8Array(offset, length) {
		const reader = this;
		const offsetEnd = offset + length;
		const readsWholeBlob = !offset && offsetEnd >= reader.size;
		const blob = readsWholeBlob ? reader.sourceBlob : reader.sourceBlob.slice(offset, offsetEnd);
		let arrayBuffer = await blob.arrayBuffer();
		const sliceIgnoredByBuggyImplementation = arrayBuffer.byteLength > length;
		if (sliceIgnoredByBuggyImplementation) {
			arrayBuffer = arrayBuffer.slice(offset, offsetEnd);
		}
		return new Uint8Array(arrayBuffer);
	}
}

class BlobWriter extends Stream {

	constructor(contentType) {
		super();
		const writer = this;
		const transformStream = new TransformStream();
		Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
			get() {
				return transformStream.writable;
			}
		});
		writer.contentType = contentType;
		writer.blobPromise = streamToBlob(transformStream.readable, contentType);
		writer.blobPromise.catch(() => { });
	}

	getData() {
		return this.blobPromise;
	}
}

class TextReader extends BlobReader {

	constructor(text) {
		super(new Blob([text], { type: CONTENT_TYPE_TEXT_PLAIN }));
	}
}

function getTextSize(text) {
	let size = 0;
	for (let indexCharacter = 0; indexCharacter < text.length; indexCharacter++) {
		const characterCode = text.charCodeAt(indexCharacter);
		if (characterCode < 0x80) {
			size += 1;
		} else if (characterCode < 0x800) {
			size += 2;
		} else if (characterCode < 0xd800 || characterCode >= 0xe000) {
			size += 3;
		} else if (characterCode < 0xdc00 && (text.charCodeAt(indexCharacter + 1) & 0xfc00) == 0xdc00) {
			size += 4;
			indexCharacter++;
		} else {
			size += 3;
		}
	}
	return size;
}

class TextWriter extends BlobWriter {

	constructor(encoding) {
		super();
		Object.assign(this, {
			encoding,
			utf8: !encoding || encoding.toLowerCase() == "utf-8"
		});
	}

	async getData() {
		const {
			encoding,
			utf8
		} = this;
		const blob = await super.getData();
		if (blob.text && utf8) {
			return blob.text();
		} else {
			return decodeTextRemovingBOM(new Uint8Array(await blob.arrayBuffer()), encoding);
		}
	}
}

class FetchReader extends Reader {

	constructor(url, options) {
		super();
		createHttpReader(this, url, options);
	}

	async init() {
		await initHttpReader(this, sendFetchRequest, getFetchRequestData);
		super.init();
	}

	createReadable(options) {
		const reader = this;
		const { useRangeHeader, forceRangeRequests, size } = reader;
		if ((useRangeHeader || forceRangeRequests) && size !== UNDEFINED_VALUE) {
			const { offset = 0, size: readSize = size - offset } = options || {};
			if (readSize > 0 && offset < size) {
				return createRangeReadable(reader, offset, Math.min(readSize, size - offset));
			}
		}
		return super.createReadable(options);
	}

	readUint8Array(index, length) {
		return readUint8ArrayHttpReader(this, index, length, sendFetchRequest, getFetchRequestData);
	}
}

class XHRReader extends Reader {

	constructor(url, options) {
		super();
		createHttpReader(this, url, options);
	}

	async init() {
		await initHttpReader(this, sendXMLHttpRequest, getXMLHttpRequestData);
		super.init();
	}

	readUint8Array(index, length) {
		return readUint8ArrayHttpReader(this, index, length, sendXMLHttpRequest, getXMLHttpRequestData);
	}
}

function createHttpReader(httpReader, url, options) {
	const {
		preventHeadRequest,
		useRangeHeader,
		forceRangeRequests,
		combineSizeEocd,
		checkResourceChanges = true,
		maximumRangeSize = DEFAULT_MAXIMUM_RANGE_SIZE,
		fetch
	} = options;
	options = Object.assign({}, options);
	delete options.preventHeadRequest;
	delete options.useRangeHeader;
	delete options.forceRangeRequests;
	delete options.combineSizeEocd;
	delete options.checkResourceChanges;
	delete options.maximumRangeSize;
	delete options.useXHR;
	delete options.fetch;
	Object.assign(httpReader, {
		url,
		options,
		preventHeadRequest,
		useRangeHeader,
		forceRangeRequests,
		combineSizeEocd,
		checkResourceChanges,
		maximumRangeSize,
		fetch
	});
}

async function initHttpReader(httpReader, sendRequest, getRequestData) {
	const {
		url,
		preventHeadRequest,
		useRangeHeader,
		forceRangeRequests,
		combineSizeEocd
	} = httpReader;
	if (isHttpFamily(url) && (useRangeHeader || forceRangeRequests) && (typeof preventHeadRequest == UNDEFINED_TYPE || preventHeadRequest)) {
		const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, combineSizeEocd ? -END_OF_CENTRAL_DIR_LENGTH : undefined));
		const acceptRanges = response.headers.get(HTTP_HEADER_ACCEPT_RANGES);
		if (!forceRangeRequests && (!acceptRanges || acceptRanges.toLowerCase() != HTTP_RANGE_UNIT)) {
			throw new Error(ERR_HTTP_RANGE);
		} else {
			if (combineSizeEocd) {
				const eocdCache = new Uint8Array(await response.arrayBuffer());
				if (response.status == 206 && eocdCache.length == END_OF_CENTRAL_DIR_LENGTH) {
					httpReader.eocdCache = eocdCache;
				}
			}
			setResourceValidators(httpReader, response);
			const contentSize = getContentRangeSize(response);
			if (contentSize === UNDEFINED_VALUE) {
				await getContentLength(httpReader, sendRequest, getRequestData);
			} else {
				httpReader.size = contentSize;
			}
		}
	} else {
		await getContentLength(httpReader, sendRequest, getRequestData);
	}
}

async function readUint8ArrayHttpReader(httpReader, index, length, sendRequest, getRequestData) {
	const {
		useRangeHeader,
		forceRangeRequests,
		eocdCache,
		size,
		options
	} = httpReader;
	if (useRangeHeader || forceRangeRequests) {
		if (eocdCache && index == size - END_OF_CENTRAL_DIR_LENGTH && length == END_OF_CENTRAL_DIR_LENGTH) {
			return eocdCache;
		}
		if (index >= size || length === 0) {
			return EMPTY_UINT8_ARRAY;
		} else {
			if (index + length > size) {
				length = size - index;
			}
			const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, index, length));
			if (response.status != 206) {
				throw new Error(ERR_HTTP_RANGE);
			}
			const contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);
			if (contentRangeHeader) {
				const rangeStart = Number(contentRangeHeader.trim().split(/[\s-]+/)[1]);
				if (!Number.isNaN(rangeStart) && rangeStart != index) {
					throw new Error(ERR_HTTP_RANGE);
				}
			}
			checkResourceValidators(httpReader, response);
			setResourceValidators(httpReader, response);
			const data = new Uint8Array(await response.arrayBuffer());
			if (data.length != length) {
				throw new Error(ERR_HTTP_RANGE);
			}
			return data;
		}
	} else {
		const { data } = httpReader;
		if (!data) {
			await getRequestData(httpReader, options);
		}
		return httpReader.data.subarray(index, index + length);
	}
}

function createRangeReadable(httpReader, offset, size) {
	let bodyReader;
	let windowOffset = offset;
	let windowRemainingLength = 0;
	let remainingLength = size;
	return new ReadableStream({
		start() {
			return openWindow();
		},
		async pull(controller) {
			if (!bodyReader) {
				await openWindow();
			}
			const { value, done } = await bodyReader.read();
			if (done) {
				throw new Error(ERR_HTTP_RANGE);
			}
			const chunk = value.length > windowRemainingLength ? value.subarray(0, windowRemainingLength) : value;
			windowRemainingLength -= chunk.length;
			remainingLength -= chunk.length;
			if (chunk.length) {
				controller.enqueue(chunk);
			}
			if (!windowRemainingLength) {
				await closeWindow();
				if (!remainingLength) {
					controller.close();
				}
			}
		},
		cancel(reason) {
			return bodyReader && bodyReader.cancel(reason);
		}
	});

	async function openWindow() {
		const windowLength = Math.min(httpReader.maximumRangeSize, remainingLength);
		const response = await sendFetchRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, windowOffset, windowLength));
		if (response.status != 206) {
			throw new Error(ERR_HTTP_RANGE);
		}
		const contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);
		if (contentRangeHeader) {
			const rangeStart = Number(contentRangeHeader.trim().split(/[\s-]+/)[1]);
			if (!Number.isNaN(rangeStart) && rangeStart != windowOffset) {
				throw new Error(ERR_HTTP_RANGE);
			}
		}
		checkResourceValidators(httpReader, response);
		setResourceValidators(httpReader, response);
		windowOffset += windowLength;
		windowRemainingLength = windowLength;
		bodyReader = response.body.getReader();
	}

	async function closeWindow() {
		const currentBodyReader = bodyReader;
		bodyReader = UNDEFINED_VALUE;
		await currentBodyReader.cancel();
	}
}

function getContentRangeSize(response) {
	const contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);
	if (contentRangeHeader) {
		const headerValue = contentRangeHeader.trim().split(/\s*\/\s*/)[1];
		if (headerValue && headerValue != "*") {
			const contentSize = Number(headerValue);
			if (!Number.isNaN(contentSize)) {
				return contentSize;
			}
		}
	}
}

function getResourceValidators({ headers }) {
	return {
		etag: headers.get(HTTP_HEADER_ETAG) || UNDEFINED_VALUE,
		lastModified: headers.get(HTTP_HEADER_LAST_MODIFIED) || UNDEFINED_VALUE
	};
}

function setResourceValidators(httpReader, response) {
	const { checkResourceChanges, resourceValidators } = httpReader;
	if (checkResourceChanges && !resourceValidators && response.status == 206) {
		httpReader.resourceValidators = getResourceValidators(response);
	}
}

function checkResourceValidators(httpReader, response) {
	const { checkResourceChanges, resourceValidators, size } = httpReader;
	if (checkResourceChanges) {
		const contentRangeSize = getContentRangeSize(response);
		if (contentRangeSize !== UNDEFINED_VALUE && size !== UNDEFINED_VALUE && contentRangeSize != size) {
			throw new Error(ERR_HTTP_RESOURCE_CHANGED);
		}
		if (resourceValidators) {
			const validators = getResourceValidators(response);
			const changed = Object.entries(resourceValidators).some(([name, value]) =>
				value !== UNDEFINED_VALUE && validators[name] !== UNDEFINED_VALUE && value != validators[name]);
			if (changed) {
				throw new Error(ERR_HTTP_RESOURCE_CHANGED);
			}
		}
	}
}

function getRangeHeaders(httpReader, index = 0, length = 1) {
	return Object.assign({}, getHeaders(httpReader), { [HTTP_HEADER_RANGE]: HTTP_RANGE_UNIT + "=" + (index < 0 ? index : index + "-" + (index + length - 1)) });
}

function getHeaders({ options }) {
	const { headers } = options;
	if (headers) {
		if (Symbol.iterator in headers) {
			return Object.fromEntries(headers);
		} else {
			return headers;
		}
	}
}

async function getFetchRequestData(httpReader) {
	await getRequestData(httpReader, sendFetchRequest);
}

async function getXMLHttpRequestData(httpReader) {
	await getRequestData(httpReader, sendXMLHttpRequest);
}

async function getRequestData(httpReader, sendRequest) {
	const response = await sendRequest(HTTP_METHOD_GET, httpReader, getHeaders(httpReader));
	httpReader.data = new Uint8Array(await response.arrayBuffer());
	httpReader.size = httpReader.data.length;
}

async function getContentLength(httpReader, sendRequest, getRequestData) {
	if (httpReader.preventHeadRequest) {
		await getRequestData(httpReader, httpReader.options);
	} else {
		const response = await sendRequest(HTTP_METHOD_HEAD, httpReader, getHeaders(httpReader));
		const contentLength = response.headers.get(HTTP_HEADER_CONTENT_LENGTH);
		if (contentLength && !response.headers.get(HTTP_HEADER_CONTENT_ENCODING)) {
			httpReader.size = Number(contentLength);
		} else {
			await getRequestData(httpReader, httpReader.options);
		}
	}
}

async function sendFetchRequest(method, { fetch: fetchFunction = fetch, options, url }, headers) {
	const response = await fetchFunction(url, Object.assign({}, options, { method, headers }));
	if (response.status < 400) {
		return response;
	} else {
		throw response.status == 416 ? new Error(ERR_HTTP_RANGE) : new Error(ERR_HTTP_STATUS + (response.statusText || response.status));
	}
}

function sendXMLHttpRequest(method, { url }, headers) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.addEventListener("load", () => {
			if (request.status < 400) {
				const headers = [];
				request.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach(header => {
					const splitHeader = header.trim().split(/\s*:\s*/);
					splitHeader[0] = splitHeader[0].trim().replace(/^[a-z]|-[a-z]/g, value => value.toUpperCase());
					headers.push(splitHeader);
				});
				resolve({
					status: request.status,
					arrayBuffer: () => request.response,
					headers: new Map(headers)
				});
			} else {
				reject(request.status == 416 ? new Error(ERR_HTTP_RANGE) : new Error(ERR_HTTP_STATUS + (request.statusText || request.status)));
			}
		}, false);
		request.addEventListener("error", event => reject(event.detail ? event.detail.error : new Error("Network error")), false);
		request.open(method, url);
		if (headers) {
			for (const entry of Object.entries(headers)) {
				request.setRequestHeader(entry[0], entry[1]);
			}
		}
		request.responseType = "arraybuffer";
		request.send();
	});
}

class HttpReader extends Reader {

	constructor(url, options = {}) {
		super();
		Object.assign(this, {
			url,
			reader: options.useXHR && !options.fetch ? new XHRReader(url, options) : new FetchReader(url, options)
		});
	}

	set size(value) {
		// ignored
	}

	get size() {
		return this.reader.size;
	}

	async init() {
		await this.reader.init();
		super.init();
	}

	createReadable(options) {
		return this.reader.createReadable(options);
	}

	readUint8Array(index, length) {
		return this.reader.readUint8Array(index, length);
	}
}

class HttpRangeReader extends HttpReader {

	constructor(url, options = {}) {
		super(url, Object.assign({}, options, { useRangeHeader: true }));
	}
}


class Uint8ArrayReader extends Reader {

	constructor(array) {
		super();
		array = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
		Object.assign(this, {
			array,
			size: array.length
		});
	}

	readUint8Array(index, length) {
		return this.array.slice(index, index + length);
	}
}

class Uint8ArrayWriter extends Writer {

	constructor(defaultBufferSize) {
		super();
		this.defaultBufferSize = defaultBufferSize || DEFAULT_BUFFER_SIZE;
	}

	init(initSize = 0) {
		Object.assign(this, {
			offset: 0,
			array: new Uint8Array(initSize > 0 ? initSize : this.defaultBufferSize)
		});
		super.init();
	}

	writeUint8Array(array) {
		const writer = this;
		const requiredLength = writer.offset + array.length;
		if (requiredLength > writer.array.length) {
			let newLength = writer.array.length ? writer.array.length * 2 : writer.defaultBufferSize;
			while (newLength < requiredLength) {
				newLength *= 2;
			}
			const previousArray = writer.array;
			writer.array = new Uint8Array(newLength);
			writer.array.set(previousArray);
		}
		writer.array.set(array, writer.offset);
		writer.offset += array.length;
	}

	getData() {
		if (this.offset === this.array.length) {
			return this.array;
		} else {
			return this.array.slice(0, this.offset);
		}
	}
}

class SplitDataReader extends Reader {

	constructor(readers) {
		super();
		this.readers = readers;
	}

	async init() {
		const reader = this;
		reader.lastDiskNumber = 0;
		const readers = reader.readers = await Promise.all(reader.readers.map(initDiskReader));
		reader.diskOffsets = readers.map(diskReader => {
			const diskOffset = reader.size;
			reader.size += diskReader.size;
			return diskOffset;
		});
		super.init();
	}

	getDiskOffset(diskNumber) {
		const { diskOffsets, size } = this;
		const diskOffset = diskOffsets[diskNumber];
		return diskOffset === UNDEFINED_VALUE ? size : diskOffset;
	}

	async readUint8Array(offset, length) {
		const reader = this;
		const { readers } = this;
		let result;
		let currentDiskNumber = 0;
		let currentReaderOffset = offset;
		while (readers[currentDiskNumber] && currentReaderOffset >= readers[currentDiskNumber].size) {
			currentReaderOffset -= readers[currentDiskNumber].size;
			currentDiskNumber++;
		}
		const currentReader = readers[currentDiskNumber];
		if (currentReader) {
			const currentReaderSize = currentReader.size;
			if (currentReaderOffset + length <= currentReaderSize) {
				result = await readUint8Array(currentReader, currentReaderOffset, length);
			} else {
				const chunkLength = currentReaderSize - currentReaderOffset;
				const firstPart = await readUint8Array(currentReader, currentReaderOffset, chunkLength);
				const secondPart = await reader.readUint8Array(offset + chunkLength, length - chunkLength);
				result = concat(firstPart, secondPart);
			}
		} else {
			result = EMPTY_UINT8_ARRAY;
		}
		reader.lastDiskNumber = Math.max(currentDiskNumber, reader.lastDiskNumber);
		return result;
	}
}

class SplitDataWriter extends Stream {

	constructor(writerGenerator, maxSize = 4294967295) {
		super();
		const writer = this;
		Object.assign(writer, {
			diskNumber: 0,
			diskOffset: 0,
			size: 0,
			maxSize,
			availableSize: maxSize
		});
		let diskSourceWriter, diskWritable, diskWriter;
		const writable = new WritableStream({
			async write(chunk) {
				if (chunk === DISK_BOUNDARY) {
					if (diskWriter) {
						await endDisk();
					}
					return;
				}
				const { availableSize } = writer;
				if (!diskWriter) {
					const { value, done } = await writerGenerator.next();
					if (done && !value) {
						throw new Error(ERR_ITERATOR_COMPLETED_TOO_SOON);
					} else {
						diskSourceWriter = value;
						diskSourceWriter.size = 0;
						if (diskSourceWriter.maxSize) {
							writer.maxSize = diskSourceWriter.maxSize;
						}
						writer.availableSize = writer.maxSize;
						await initStream(diskSourceWriter);
						diskWritable = value.writable;
						diskWriter = diskWritable.getWriter();
					}
					await this.write(chunk);
				} else if (chunk.length >= availableSize) {
					await writeChunk(chunk.subarray(0, availableSize));
					await endDisk();
					if (chunk.length > availableSize) {
						await this.write(chunk.subarray(availableSize));
					}
				} else {
					await writeChunk(chunk);
				}
			},
			async close() {
				if (diskWriter) {
					await diskWriter.ready;
					await closeDiskWriter();
				}
			},
			async abort(reason) {
				if (diskWriter) {
					await diskWriter.abort(reason);
				}
			}
		});
		Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
			get() {
				return writable;
			}
		});

		async function writeChunk(chunk) {
			const chunkLength = chunk.length;
			if (chunkLength) {
				await diskWriter.ready;
				await diskWriter.write(chunk);
				diskSourceWriter.size += chunkLength;
				writer.availableSize -= chunkLength;
			}
		}

		async function endDisk() {
			await closeDiskWriter();
			writer.diskOffset += diskSourceWriter.size;
			writer.diskNumber++;
			diskWriter = null;
			writer.availableSize = writer.maxSize;
		}

		async function closeDiskWriter() {
			await diskWriter.close();
		}
	}

	async closeDisk() {
		const streamWriter = this.writable.getWriter();
		try {
			await streamWriter.ready;
			await streamWriter.write(DISK_BOUNDARY);
		} finally {
			streamWriter.releaseLock();
		}
	}
}

class GenericReader {

	constructor(reader) {
		if (Array.isArray(reader)) {
			reader = new SplitDataReader(reader);
		}
		if (reader instanceof ReadableStream || typeof reader.getReader == FUNCTION_TYPE) {
			reader = {
				readable: toCompatibleReadable(reader)
			};
		}
		return reader;
	}
}

class GenericWriter {

	constructor(writer) {
		if (writer.writable === UNDEFINED_VALUE && typeof writer.next == FUNCTION_TYPE) {
			writer = new SplitDataWriter(writer);
		}
		if (writer instanceof WritableStream || typeof writer.getWriter == FUNCTION_TYPE) {
			writer = {
				writable: toCompatibleWritable(writer)
			};
		}
		if (writer.size === UNDEFINED_VALUE) {
			writer.size = 0;
		}
		return writer;
	}
}

function ownsWritable(writer) {
	return Boolean(writer && writer.getData);
}

function isHttpFamily(url) {
	const { baseURI } = getConfiguration();
	const { protocol } = new URL(url, baseURI);
	return protocol == "http:" || protocol == "https:";
}

async function initStream(stream, initSize) {
	if (stream.init && !stream.initialized) {
		await stream.init(initSize);
	} else {
		return Promise.resolve();
	}
}

async function initDiskReader(diskReader) {
	diskReader = new GenericReader(diskReader);
	await initStream(diskReader);
	if (diskReader.size === UNDEFINED_VALUE || !diskReader.readUint8Array) {
		diskReader = new BlobReader(await streamToBlob(diskReader.readable));
		await initStream(diskReader);
	}
	return diskReader;
}

function readUint8Array(reader, offset, size) {
	return reader.readUint8Array(offset, size);
}

function createReadable(reader, options) {
	if (reader.createReadable) {
		return reader.createReadable(options);
	} else if (reader.readUint8Array) {
		return Reader.prototype.createReadable.call(reader, options);
	} else {
		return reader.readable;
	}
}

export {
	initStream,
	createReadable,
	GenericReader,
	GenericWriter,
	ownsWritable,
	readUint8Array,
	Reader,
	Writer,
	TextReader,
	TextWriter,
	getTextSize,
	Data64URIReader,
	Data64URIWriter,
	BlobReader,
	BlobWriter,
	Uint8ArrayReader,
	Uint8ArrayWriter,
	HttpReader,
	HttpRangeReader,
	SplitDataReader,
	SplitDataWriter,
	ERR_HTTP_RANGE,
	ERR_HTTP_RESOURCE_CHANGED,
	ERR_ITERATOR_COMPLETED_TOO_SOON,
	ERR_WRITER_NOT_INITIALIZED
};