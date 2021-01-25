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

/* global Blob, FileReader, atob, btoa, XMLHttpRequest, document */

"use strict";

const ERR_HTTP_STATUS = "HTTP error ";
const ERR_HTTP_RANGE = "HTTP Range not supported";
const TEXT_PLAIN = "text/plain";

class Stream {

	constructor() {
		this.size = 0;
	}

	async init() {
		this.initialized = true;
	}
}
class Reader extends Stream {
}

class Writer extends Stream {

	async writeUint8Array(array) {
		this.size += array.length;
	}
}

class TextReader extends Reader {

	constructor(text) {
		super();
		this.blobReader = new BlobReader(new Blob([text], { type: TEXT_PLAIN }));
	}

	async init() {
		await super.init();
		this.blobReader.init();
		this.size = this.blobReader.size;
	}

	async readUint8Array(offset, length) {
		return this.blobReader.readUint8Array(offset, length);
	}
}

class TextWriter extends Writer {

	constructor(encoding) {
		super();
		this.encoding = encoding;
		this.blob = new Blob([], { type: TEXT_PLAIN });
	}

	async writeUint8Array(array) {
		await super.writeUint8Array(array);
		this.blob = new Blob([this.blob, array.buffer], { type: TEXT_PLAIN });
	}

	getData() {
		const reader = new FileReader();
		return new Promise((resolve, reject) => {
			reader.onload = event => resolve(event.target.result);
			reader.onerror = reject;
			reader.readAsText(this.blob, this.encoding);
		});
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

	async readUint8Array(offset, length) {
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

	async writeUint8Array(array) {
		await super.writeUint8Array(array);
		let indexArray = 0, dataString = this.pending;
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
		const reader = new FileReader();
		return new Promise((resolve, reject) => {
			reader.onload = event => resolve(new Uint8Array(event.target.result));
			reader.onerror = reject;
			reader.readAsArrayBuffer(this.blob.slice(offset, offset + length));
		});
	}
}

class BlobWriter extends Writer {

	constructor(contentType) {
		super();
		this.offset = 0;
		this.contentType = contentType;
		this.blob = new Blob([], { type: contentType });
	}

	async writeUint8Array(array) {
		await super.writeUint8Array(array);
		this.blob = new Blob([this.blob, array.buffer], { type: this.contentType });
		this.offset = this.blob.size;
	}

	getData() {
		return this.blob;
	}
}

class HttpReader extends Reader {

	constructor(url) {
		super();
		this.url = url;
	}

	async init() {
		await super.init();
		if (isHttpFamily(this.url)) {
			return new Promise((resolve, reject) => {
				const request = new XMLHttpRequest();
				request.addEventListener("load", () => {
					if (request.status < 400) {
						this.size = Number(request.getResponseHeader("Content-Length"));
						if (!this.size) {
							getData().then(() => resolve()).catch(reject);
						} else {
							resolve();
						}
					} else {
						reject(ERR_HTTP_STATUS + (request.statusText || request.status) + ".");
					}
				}, false);
				request.addEventListener("error", reject, false);
				request.open("HEAD", this.url);
				request.send();
			});
		} else {
			await getData();
		}
	}

	async readUint8Array(index, length) {
		if (!this.data) {
			await getData(this, this.url);
		}
		return new Uint8Array(this.data.subarray(index, index + length));
	}
}

class HttpRangeReader extends Reader {

	constructor(url) {
		super();
		this.url = url;
	}

	async init() {
		await super.init();
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.addEventListener("load", () => {
				if (request.status < 400) {
					this.size = Number(request.getResponseHeader("Content-Length"));
					if (request.getResponseHeader("Accept-Ranges") == "bytes") {
						resolve();
					} else {
						reject(new Error(ERR_HTTP_RANGE));
					}
				} else {
					reject(ERR_HTTP_STATUS + (request.statusText || request.status) + ".");
				}
			}, false);
			request.addEventListener("error", reject, false);
			request.open("HEAD", this.url);
			request.send();
		});
	}

	async readUint8Array(index, length) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open("GET", this.url);
			request.responseType = "arraybuffer";
			request.setRequestHeader("Range", "bytes=" + index + "-" + (index + length - 1));
			request.addEventListener("load", () => {
				if (request.status < 400) {
					resolve(new Uint8Array(request.response));
				} else {
					reject(ERR_HTTP_STATUS + (request.statusText || request.status) + ".");
				}
			}, false);
			request.addEventListener("error", reject, false);
			request.send();
		});
	}
}

class Uint8ArrayReader extends Reader {

	constructor(array) {
		super();
		this.array = array;
		this.size = array.length;
	}

	async readUint8Array(index, length) {
		return this.array.slice(index, index + length);
	}
}

class Uint8ArrayWriter extends Writer {

	constructor() {
		super();
		this.array = new Uint8Array(0);
	}

	async writeUint8Array(array) {
		await super.writeUint8Array(array);
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

function getData(httpReader, url) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.addEventListener("load", () => {
			if (request.status < 400) {
				if (!httpReader.size) {
					httpReader.size = Number(request.getResponseHeader("Content-Length")) || Number(request.response.byteLength);
				}
				httpReader.data = new Uint8Array(request.response);
				resolve();
			} else {
				reject(ERR_HTTP_STATUS + (request.statusText || request.status) + ".");
			}
		}, false);
		request.addEventListener("error", reject, false);
		request.open("GET", url);
		request.responseType = "arraybuffer";
		request.send();
	});
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
	HttpReader,
	HttpRangeReader,
	Uint8ArrayWriter,
	Uint8ArrayReader,
	ERR_HTTP_RANGE
};