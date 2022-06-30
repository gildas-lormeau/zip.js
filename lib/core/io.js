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

/* global Blob, FileReader, atob, btoa, XMLHttpRequest, document, fetch */

const ERR_HTTP_STATUS = "HTTP error ";
const ERR_HTTP_RANGE = "HTTP Range not supported";
const ERR_NOT_SEEKABLE_READER = "Reader is not seekable";

const CONTENT_TYPE_TEXT_PLAIN = "text/plain";
const HTTP_HEADER_CONTENT_LENGTH = "Content-Length";
const HTTP_HEADER_CONTENT_RANGE = "Content-Range";
const HTTP_HEADER_ACCEPT_RANGES = "Accept-Ranges";
const HTTP_HEADER_RANGE = "Range";
const HTTP_METHOD_HEAD = "HEAD";
const HTTP_METHOD_GET = "GET";
const HTTP_RANGE_UNIT = "bytes";

class Stream {

	constructor() {
		this.size = 0;
	}

	init() {
		this.initialized = true;
	}
}

class Reader extends Stream {
}

class Writer extends Stream {

	writeUint8Array(array) {
		this.size += array.length;
	}
}

class TextReader extends Reader {

	constructor(text) {
		super();
		this.blobReader = new BlobReader(new Blob([text], { type: CONTENT_TYPE_TEXT_PLAIN }));
	}

	init() {
		super.init();
		this.blobReader.init();
		this.size = this.blobReader.size;
	}

	readUint8Array(offset, length) {
		return this.blobReader.readUint8Array(offset, length);
	}
}

class TextWriter extends Writer {

	constructor(encoding) {
		super();
		this.encoding = encoding;
		this.blob = new Blob([], { type: CONTENT_TYPE_TEXT_PLAIN });
	}

	writeUint8Array(array) {
		super.writeUint8Array(array);
		this.blob = new Blob([this.blob, array.buffer], { type: CONTENT_TYPE_TEXT_PLAIN });
	}

	getData() {
		if (this.blob.text) {
			return this.blob.text();
		} else {
			const reader = new FileReader();
			return new Promise((resolve, reject) => {
				reader.onload = event => resolve(event.target.result);
				reader.onerror = () => reject(reader.error);
				reader.readAsText(this.blob, this.encoding);
			});
		}
	}
}

class Data64URIReader extends Reader {

	constructor(dataURI) {
		super();
		this.dataURI = dataURI;
		let dataEnd = dataURI.length;
		while (dataURI.charAt(dataEnd - 1) == "=") {
			dataEnd--;
		}
		this.dataStart = dataURI.indexOf(",") + 1;
		this.size = Math.floor((dataEnd - this.dataStart) * 0.75);
	}

	readUint8Array(offset, length) {
		const dataArray = new Uint8Array(length);
		const start = Math.floor(offset / 3) * 4;
		const bytes = atob(this.dataURI.substring(start + this.dataStart, Math.ceil((offset + length) / 3) * 4 + this.dataStart));
		const delta = offset - Math.floor(start / 4) * 3;
		for (let indexByte = delta; indexByte < delta + length; indexByte++) {
			dataArray[indexByte - delta] = bytes.charCodeAt(indexByte);
		}
		return dataArray;
	}
}

class Data64URIWriter extends Writer {

	constructor(contentType) {
		super();
		this.data = "data:" + (contentType || "") + ";base64,";
		this.pending = [];
	}

	writeUint8Array(array) {
		super.writeUint8Array(array);
		let indexArray = 0;
		let dataString = this.pending;
		const delta = this.pending.length;
		this.pending = "";
		for (indexArray = 0; indexArray < (Math.floor((delta + array.length) / 3) * 3) - delta; indexArray++) {
			dataString += String.fromCharCode(array[indexArray]);
		}
		for (; indexArray < array.length; indexArray++) {
			this.pending += String.fromCharCode(array[indexArray]);
		}
		if (dataString.length > 2) {
			this.data += btoa(dataString);
		} else {
			this.pending = dataString;
		}
	}

	getData() {
		return this.data + btoa(this.pending);
	}
}

class BlobReader extends Reader {

	constructor(blob) {
		super();
		this.blob = blob;
		this.size = blob.size;
	}

	async readUint8Array(offset, length) {
		if (this.blob.arrayBuffer) {
			return new Uint8Array(await this.blob.slice(offset, offset + length).arrayBuffer());
		} else {
			const reader = new FileReader();
			return new Promise((resolve, reject) => {
				reader.onload = event => resolve(new Uint8Array(event.target.result));
				reader.onerror = () => reject(reader.error);
				reader.readAsArrayBuffer(this.blob.slice(offset, offset + length));
			});
		}
	}
}

class BlobWriter extends Writer {

	constructor(contentType) {
		super();
		this.contentType = contentType;
		this.arrayBuffersMaxlength = 8;
		initArrayBuffers(this);
	}

	writeUint8Array(array) {
		super.writeUint8Array(array);
		if (this.arrayBuffers.length == this.arrayBuffersMaxlength) {
			flushArrayBuffers(this);
		}
		this.arrayBuffers.push(array.buffer);
	}

	getData() {
		if (!this.blob) {
			if (this.arrayBuffers.length) {
				flushArrayBuffers(this);
			}
			this.blob = this.pendingBlob;
			initArrayBuffers(this);
		}
		return this.blob;
	}
}

function initArrayBuffers(blobWriter) {
	blobWriter.pendingBlob = new Blob([], { type: blobWriter.contentType });
	blobWriter.arrayBuffers = [];
}

function flushArrayBuffers(blobWriter) {
	blobWriter.pendingBlob = new Blob([blobWriter.pendingBlob, ...blobWriter.arrayBuffers], { type: blobWriter.contentType });
	blobWriter.arrayBuffers = [];
}

class ReadableStreamReader {

	constructor(readableStream) {
		this.readableStream = readableStream;
		this.reader = readableStream.getReader();
		this.size = Infinity;
		this.index = 0;
		this.currentSize = 0;
		this.pendingValue = new Uint8Array();
	}

	init() {
		this.initialized = true;
	}

	async readUint8Array(index, length) {
		if (this.index != index) {
			throw new Error(ERR_NOT_SEEKABLE_READER);
		}
		let data = new Uint8Array(length);
		let size = 0, done;
		do {
			const result = await this.reader.read();
			let { value } = result;
			done = result.done;
			if (value) {
				this.currentSize += value.length;
			} else {
				value = this.pendingValue;
				this.pendingValue = new Uint8Array();
			}
			if (this.pendingValue.length) {
				const newValue = new Uint8Array(this.pendingValue.length + value.length);
				newValue.set(this.pendingValue);
				newValue.set(value, this.pendingValue.length);
				this.pendingValue = new Uint8Array();
				value = newValue;
			}
			if (size + value.length > length) {
				data.set(value.subarray(0, length), size);
				this.pendingValue = value.subarray(length);
				size += length;
			} else {
				data.set(value, size);
				size += value.length;
			}
		} while (size < length && !done);
		if (done && this.size == Infinity) {
			this.size = this.currentSize;
		}
		if (this.size < length) {
			data = data.slice(0, this.size);
			length = this.size;
		}
		this.index += length;
		return data;
	}
}

class WritableStreamWriter extends Writer {

	constructor(writableStream) {
		super();
		this.writableStream = writableStream;
		this.writer = writableStream.getWriter();
	}

	async writeUint8Array(array) {
		await this.writer.ready;
		return this.writer.write(array);
	}

	async getData() {
		await this.writer.ready;
		await this.writer.close();
		return this.writableStream;
	}
}

class FetchReader extends Reader {

	constructor(url, options) {
		super();
		this.url = url;
		this.preventHeadRequest = options.preventHeadRequest;
		this.useRangeHeader = options.useRangeHeader;
		this.forceRangeRequests = options.forceRangeRequests;
		this.options = Object.assign({}, options);
		delete this.options.preventHeadRequest;
		delete this.options.useRangeHeader;
		delete this.options.forceRangeRequests;
		delete this.options.useXHR;
	}

	async init() {
		super.init();
		await initHttpReader(this, sendFetchRequest, getFetchRequestData);
	}

	readUint8Array(index, length) {
		return readUint8ArrayHttpReader(this, index, length, sendFetchRequest, getFetchRequestData);
	}
}

class XHRReader extends Reader {

	constructor(url, options) {
		super();
		this.url = url;
		this.preventHeadRequest = options.preventHeadRequest;
		this.useRangeHeader = options.useRangeHeader;
		this.forceRangeRequests = options.forceRangeRequests;
		this.options = options;
	}

	async init() {
		super.init();
		await initHttpReader(this, sendXMLHttpRequest, getXMLHttpRequestData);
	}

	readUint8Array(index, length) {
		return readUint8ArrayHttpReader(this, index, length, sendXMLHttpRequest, getXMLHttpRequestData);
	}
}

async function initHttpReader(httpReader, sendRequest, getRequestData) {
	if (isHttpFamily(httpReader.url) && (httpReader.useRangeHeader || httpReader.forceRangeRequests)) {
		const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader));
		if (!httpReader.forceRangeRequests && response.headers.get(HTTP_HEADER_ACCEPT_RANGES) != HTTP_RANGE_UNIT) {
			throw new Error(ERR_HTTP_RANGE);
		} else {
			let contentSize;
			const contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);
			if (contentRangeHeader) {
				const splitHeader = contentRangeHeader.trim().split(/\s*\/\s*/);
				if (splitHeader.length) {
					const headerValue = splitHeader[1];
					if (headerValue && headerValue != "*") {
						contentSize = Number(headerValue);
					}
				}
			}
			if (contentSize === undefined) {
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
	if (httpReader.useRangeHeader || httpReader.forceRangeRequests) {
		const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, index, length));
		if (response.status != 206) {
			throw new Error(ERR_HTTP_RANGE);
		}
		return new Uint8Array(await response.arrayBuffer());
	} else {
		if (!httpReader.data) {
			await getRequestData(httpReader, httpReader.options);
		}
		return new Uint8Array(httpReader.data.subarray(index, index + length));
	}
}

function getRangeHeaders(httpReader, index = 0, length = 1) {
	return Object.assign({}, getHeaders(httpReader), { [HTTP_HEADER_RANGE]: HTTP_RANGE_UNIT + "=" + index + "-" + (index + length - 1) });
}

function getHeaders(httpReader) {
	const headers = httpReader.options.headers;
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
	if (!httpReader.size) {
		httpReader.size = httpReader.data.length;
	}
}

async function getContentLength(httpReader, sendRequest, getRequestData) {
	if (httpReader.preventHeadRequest) {
		await getRequestData(httpReader, httpReader.options);
	} else {
		const response = await sendRequest(HTTP_METHOD_HEAD, httpReader, getHeaders(httpReader));
		const contentLength = response.headers.get(HTTP_HEADER_CONTENT_LENGTH);
		if (contentLength) {
			httpReader.size = Number(contentLength);
		} else {
			await getRequestData(httpReader, httpReader.options);
		}
	}
}

async function sendFetchRequest(method, { options, url }, headers) {
	const response = await fetch(url, Object.assign({}, options, { method, headers }));
	if (response.status < 400) {
		return response;
	} else {
		throw new Error(ERR_HTTP_STATUS + (response.statusText || response.status));
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
				reject(new Error(ERR_HTTP_STATUS + (request.statusText || request.status)));
			}
		}, false);
		request.addEventListener("error", event => reject(event.detail.error), false);
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
		this.url = url;
		if (options.useXHR) {
			this.reader = new XHRReader(url, options);
		} else {
			this.reader = new FetchReader(url, options);
		}
	}

	set size(value) {
		// ignored
	}

	get size() {
		return this.reader.size;
	}

	async init() {
		super.init();
		await this.reader.init();
	}

	readUint8Array(index, length) {
		return this.reader.readUint8Array(index, length);
	}
}

class HttpRangeReader extends HttpReader {

	constructor(url, options = {}) {
		options.useRangeHeader = true;
		super(url, options);
	}
}


class Uint8ArrayReader extends Reader {

	constructor(array) {
		super();
		this.array = array;
		this.size = array.length;
	}

	readUint8Array(index, length) {
		return this.array.slice(index, index + length);
	}
}

class Uint8ArrayWriter extends Writer {

	constructor() {
		super();
		this.array = new Uint8Array(0);
	}

	writeUint8Array(array) {
		super.writeUint8Array(array);
		const previousArray = this.array;
		this.array = new Uint8Array(previousArray.length + array.length);
		this.array.set(previousArray);
		this.array.set(array, previousArray.length);
	}

	getData() {
		return this.array;
	}
}

function isHttpFamily(url) {
	if (typeof document != "undefined") {
		const anchor = document.createElement("a");
		anchor.href = url;
		return anchor.protocol == "http:" || anchor.protocol == "https:";
	} else {
		return /^https?:\/\//i.test(url);
	}
}

export {
	Reader,
	Writer,
	TextReader,
	TextWriter,
	Data64URIReader,
	Data64URIWriter,
	BlobReader,
	BlobWriter,
	Uint8ArrayReader,
	Uint8ArrayWriter,
	HttpReader,
	HttpRangeReader,
	ReadableStreamReader,
	WritableStreamWriter,
	ERR_HTTP_RANGE,
	ERR_NOT_SEEKABLE_READER
};
