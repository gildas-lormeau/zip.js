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

import {
	configure,
	getMimeType,
	initShimAsyncCodec,
	ZipReader,
	ZipWriter,
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
	ERR_HTTP_RANGE,
	ERR_BAD_FORMAT,
	ERR_EOCDR_NOT_FOUND,
	ERR_EOCDR_ZIP64_NOT_FOUND,
	ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND,
	ERR_CENTRAL_DIRECTORY_NOT_FOUND,
	ERR_LOCAL_FILE_HEADER_NOT_FOUND,
	ERR_EXTRAFIELD_ZIP64_NOT_FOUND,
	ERR_ENCRYPTED,
	ERR_UNSUPPORTED_ENCRYPTION,
	ERR_UNSUPPORTED_COMPRESSION,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSORD,
	ERR_DUPLICATED_NAME,
	ERR_INVALID_COMMENT,
	ERR_INVALID_ENTRY_NAME,
	ERR_INVALID_ENTRY_COMMENT,
	ERR_INVALID_VERSION,
	ERR_INVALID_EXTRAFIELD_TYPE,
	ERR_INVALID_EXTRAFIELD_DATA
} from "./zip.js";


const CHUNK_SIZE = 512 * 1024;

class ZipEntry {
	constructor(fs, name, params, parent) {
		if (fs.root && parent && parent.getChildByName(name)) {
			throw new Error("Entry filename already exists");
		}
		if (!params) {
			params = {};
		}
		this.fs = fs;
		this.name = name;
		this.id = fs.entries.length;
		this.parent = parent;
		this.children = [];
		this.zipVersion = params.zipVersion || 0x14;
		this.uncompressedSize = 0;
		fs.entries.push(this);
		if (parent) {
			this.parent.children.push(this);
		}
	}
	moveTo(target) {
		if (target.directory) {
			if (!target.isDescendantOf(this)) {
				if (this != target) {
					if (target.getChildByName(this.name)) {
						throw "Entry filename already exists";
					}
					detach(this);
					this.parent = target;
					target.children.push(this);
				}
			} else {
				throw "Entry is a ancestor of target entry";
			}
		} else {
			throw "Target entry is not a directory";
		}
	}
	getFullname() {
		let fullname = this.name, entry = this.parent;
		while (entry) {
			fullname = (entry.name ? entry.name + "/" : "") + fullname;
			entry = entry.parent;
		}
		return fullname;
	}
	isDescendantOf(ancestor) {
		let entry = this.parent;
		while (entry && entry.id != ancestor.id) {
			entry = entry.parent;
		}
		return Boolean(entry);
	}
}

class ZipFileEntry extends ZipEntry {
	constructor(fs, name, params, parent) {
		super(fs, name, params, parent);
		this.Reader = params.Reader;
		this.Writer = params.Writer;
		this.data = params.data;
		if (params.getData) {
			this.getData = params.getData;
		}
	}
	async getData(writer, options = {}) {
		if (!writer || (writer.constructor == this.Writer && this.data)) {
			return this.data;
		} else {
			if (!this.reader) {
				this.reader = new this.Reader(this.data);
			}
			await this.reader.init();
			await writer.init();
			this.uncompressedSize = this.reader.size;
			return bufferedCopy(this.reader, writer, options);
		}
	}
	getText(encoding, options) {
		return this.getData(new TextWriter(encoding), options);
	}
	getBlob(mimeType, options) {
		return this.getData(new BlobWriter(mimeType), options);
	}
	getData64URI(mimeType, options) {
		return this.getData(new Data64URIWriter(mimeType), options);
	}
}

class ZipDirectoryEntry extends ZipEntry {
	constructor(fs, name, params, parent) {
		super(fs, name, params, parent);
		this.directory = true;
	}
	addDirectory(name) {
		return addChild(this, name, null, true);
	}
	addText(name, text) {
		return addChild(this, name, {
			data: text,
			Reader: TextReader,
			Writer: TextWriter
		});
	}
	addBlob(name, blob) {
		return addChild(this, name, {
			data: blob,
			Reader: BlobReader,
			Writer: BlobWriter
		});
	}
	addData64URI(name, dataURI) {
		return addChild(this, name, {
			data: dataURI,
			Reader: Data64URIReader,
			Writer: Data64URIWriter
		});
	}
	addHttpContent(name, url, options = {}) {
		return addChild(this, name, {
			data: url,
			Reader: options.useRangeHeader ? HttpRangeReader : HttpReader
		});
	}
	addFileEntry(fileEntry) {
		addFileEntry(this, fileEntry);
	}
	async addData(name, params) {
		return addChild(this, name, params);
	}
	async importBlob(blob, options = {}) {
		await this.importZip(new BlobReader(blob), options);
	}
	async importData64URI(dataURI, options = {}) {
		await this.importZip(new Data64URIReader(dataURI), options);
	}
	async importHttpContent(URL, options = {}) {
		await this.importZip(options.useRangeHeader ? new HttpRangeReader(URL) : new HttpReader(URL), options);
	}
	async exportBlob(options = {}) {
		return this.exportZip(new BlobWriter("application/zip"), options);
	}
	async exportData64URI(options = {}) {
		return this.exportZip(new Data64URIWriter("application/zip"), options);
	}
	async importZip(reader, options) {
		await reader.init();
		const zipReader = new ZipReader(reader);
		const entries = await zipReader.getEntries();
		let currentIndex = 0;
		const totalSize = getTotalSize(entries, "compressedSize");
		entries.forEach(entry => {
			let parent = this, path = entry.filename.split("/"), name = path.pop();
			path.forEach(pathPart => parent = parent.getChildByName(pathPart) || new ZipDirectoryEntry(this.fs, pathPart, null, parent));
			if (!entry.directory) {
				let currentIndexEntry = currentIndex;
				addChild(parent, name, {
					data: entry,
					Reader: getZipBlobReader(Object.assign({}, options, {
						onprogress: indexProgress => {
							if (options.onprogress) {
								options.onprogress(currentIndexEntry + indexProgress, totalSize);
							}
						}
					}))
				});
				currentIndex += entry.compressedSize;
			}
		});
	}
	async exportZip(writer, options) {
		await initReaders(this);
		const zipWriter = new ZipWriter(writer);
		await exportZip(zipWriter, this, getTotalSize([this], "uncompressedSize"), options);
		await zipWriter.close();
		return writer.getData();
	}
	getChildByName(name) {
		for (let childIndex = 0; childIndex < this.children.length; childIndex++) {
			const child = this.children[childIndex];
			if (child.name == name)
				return child;
		}
	}
}


class FS {
	constructor() {
		resetFS(this);
	}
	remove(entry) {
		detach(entry);
		this.entries[entry.id] = null;
	}
	find(fullname) {
		const path = fullname.split("/");
		let node = this.root;
		for (let index = 0; node && index < path.length; index++) {
			node = node.getChildByName(path[index]);
		}
		return node;
	}
	getById(id) {
		return this.entries[id];
	}
	async importBlob(blob) {
		resetFS(this);
		await this.root.importBlob(blob);
	}
	async importData64URI(dataURI) {
		resetFS(this);
		await this.root.importData64URI(dataURI);
	}
	async importHttpContent(url, options) {
		this.entries = [];
		this.root = new ZipDirectoryEntry(this);
		await this.root.importHttpContent(url, options);
	}
	async exportBlob(options) {
		return this.root.exportBlob(options);
	}
	async exportData64URI(options) {
		return this.root.exportData64URI(options);
	}
}

const fs = { FS, ZipDirectoryEntry, ZipFileEntry };
export {
	fs,
	configure,
	initShimAsyncCodec,
	getMimeType,
	ZipReader,
	ZipWriter,
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
	ERR_HTTP_RANGE,
	ERR_BAD_FORMAT,
	ERR_EOCDR_NOT_FOUND,
	ERR_EOCDR_ZIP64_NOT_FOUND,
	ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND,
	ERR_CENTRAL_DIRECTORY_NOT_FOUND,
	ERR_LOCAL_FILE_HEADER_NOT_FOUND,
	ERR_EXTRAFIELD_ZIP64_NOT_FOUND,
	ERR_ENCRYPTED,
	ERR_UNSUPPORTED_ENCRYPTION,
	ERR_UNSUPPORTED_COMPRESSION,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PASSORD,
	ERR_DUPLICATED_NAME,
	ERR_INVALID_COMMENT,
	ERR_INVALID_ENTRY_NAME,
	ERR_INVALID_ENTRY_COMMENT,
	ERR_INVALID_VERSION,
	ERR_INVALID_EXTRAFIELD_TYPE,
	ERR_INVALID_EXTRAFIELD_DATA
};
function getTotalSize(entries, propertyName) {
	let size = 0;
	entries.forEach(process);
	return size;

	function process(entry) {
		size += entry[propertyName];
		if (entry.children) {
			entry.children.forEach(process);
		}
	}
}

function getZipBlobReader(options) {
	return class {

		constructor(entry) {
			this.entry = entry;
			this.size = 0;
		}

		async readUint8Array(index, length) {
			if (!this.blobReader) {
				const data = await this.entry.getData(new BlobWriter(), options);
				this.data = data;
				this.blobReader = new BlobReader(data);
			}
			return this.blobReader.readUint8Array(index, length);
		}

		async init() {
			this.size = this.entry.uncompressedSize;
		}
	};
}

async function initReaders(entry) {
	if (entry.children.length) {
		for (const child of entry.children) {
			if (child.directory) {
				await initReaders(child);
			} else {
				child.reader = new child.Reader(child.data);
				await child.reader.init();
				child.uncompressedSize = child.reader.size;
			}
		}
	}
}

function detach(entry) {
	const children = entry.parent.children;
	children.forEach((child, index) => {
		if (child.id == entry.id)
			children.splice(index, 1);
	});
}

async function exportZip(zipWriter, entry, totalSize, options) {
	let currentIndex = 0;
	await process(zipWriter, entry);

	async function process(zipWriter, entry) {
		await exportChild();

		async function exportChild() {
			let index = 0;
			for (const child of entry.children) {
				let currentIndexEntry = currentIndex;
				await zipWriter.add(child.getFullname(), child.reader, Object.assign({
					directory: child.directory,
					version: child.zipVersion
				}, options, {
					onprogress: indexProgress => {
						if (options.onprogress) {
							options.onprogress(currentIndexEntry + index + indexProgress, totalSize);
						}
					}
				}));
				currentIndex += child.uncompressedSize;
				await process(zipWriter, child);
				index++;
			}
		}
	}
}

async function addFileEntry(zipEntry, fileEntry) {
	if (fileEntry.isDirectory) {
		await process(zipEntry, fileEntry);
	} else {
		await new Promise((resolve, reject) => {
			fileEntry.file(file => {
				zipEntry.addBlob(fileEntry.name, file);
				resolve();
			}, reject);
		});
	}

	function getChildren(fileEntry) {
		return new Promise((resolve, reject) => {
			let entries = [];
			if (fileEntry.isDirectory) {
				readEntries(fileEntry.createReader());
			}
			if (fileEntry.isFile) {
				resolve(entries);
			}

			function readEntries(directoryReader) {
				directoryReader.readEntries(temporaryEntries => {
					if (!temporaryEntries.length) {
						resolve(entries);
					} else {
						entries = entries.concat(temporaryEntries);
						readEntries(directoryReader);
					}
				}, reject);
			}
		});
	}

	async function process(zipEntry, fileEntry) {
		const children = await getChildren(fileEntry);
		for (const child of children) {
			if (child.isDirectory) {
				await process(zipEntry.addDirectory(child.name));
			}
			await new Promise((resolve, reject) => {
				if (child.isFile) {
					child.file(file => {
						const childZipEntry = zipEntry.addBlob(child.name, file);
						childZipEntry.uncompressedSize = file.size;
						resolve(childZipEntry);
					}, reject);
				}
			});

		}
	}
}

function resetFS(fs) {
	fs.entries = [];
	fs.root = new ZipDirectoryEntry(fs);
}

async function bufferedCopy(reader, writer, options) {
	return stepCopy();

	async function stepCopy(chunkIndex = 0) {
		const index = chunkIndex * CHUNK_SIZE;
		if (options.onprogress) {
			options.onprogress(index, reader.size);
		}
		if (index < reader.size) {
			const array = await reader.readUint8Array(index, Math.min(CHUNK_SIZE, reader.size - index));
			await writer.writeUint8Array(array);
			return stepCopy(chunkIndex + 1);
		} else {
			return writer.getData();
		}
	}
}

function addChild(parent, name, params, directory) {
	if (parent.directory) {
		return directory ? new ZipDirectoryEntry(parent.fs, name, params, parent) : new ZipFileEntry(parent.fs, name, params, parent);
	} else {
		throw "Parent entry is not a directory";
	}
}