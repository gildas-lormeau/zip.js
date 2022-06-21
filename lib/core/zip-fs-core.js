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

export { ERR_ABORT } from "./engine.js";
import {
	Reader,
	TextReader,
	TextWriter,
	Data64URIReader,
	Data64URIWriter,
	Uint8ArrayReader,
	Uint8ArrayWriter,
	BlobReader,
	BlobWriter,
	HttpReader
} from "./io.js";
import { ZipReader } from "./zip-reader.js";
import { ZipWriter } from "./zip-writer.js";

const CHUNK_SIZE = 512 * 1024;

class ZipEntry {

	constructor(fs, name, params, parent) {
		const zipEntry = this;
		if (fs.root && parent && parent.getChildByName(name)) {
			throw new Error("Entry filename already exists");
		}
		if (!params) {
			params = {};
		}
		Object.assign(zipEntry, {
			fs,
			name,
			data: params.data,
			id: fs.entries.length,
			parent,
			children: [],
			uncompressedSize: 0
		});
		fs.entries.push(zipEntry);
		if (parent) {
			zipEntry.parent.children.push(zipEntry);
		}
	}

	moveTo(target) {
		// deprecated
		const zipEntry = this;
		zipEntry.fs.move(zipEntry, target);
	}

	getFullname() {
		return this.getRelativeName();
	}

	getRelativeName(ancestor = this.fs.root) {
		const zipEntry = this;
		let relativeName = zipEntry.name;
		let entry = zipEntry.parent;
		while (entry && entry != ancestor) {
			relativeName = (entry.name ? entry.name + "/" : "") + relativeName;
			entry = entry.parent;
		}
		return relativeName;
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
		const zipEntry = this;
		zipEntry.Reader = params.Reader;
		zipEntry.Writer = params.Writer;
		if (params.getData) {
			zipEntry.getData = params.getData;
		}
	}

	async getData(writer, options = {}) {
		const zipEntry = this;
		if (!writer || (writer.constructor == zipEntry.Writer && zipEntry.data)) {
			return zipEntry.data;
		} else {
			zipEntry.reader = new zipEntry.Reader(zipEntry.data, options);
			await zipEntry.reader.init();
			if (!writer.initialized) {
				await writer.init();
			}
			zipEntry.uncompressedSize = zipEntry.reader.size;
			return pipe(zipEntry.reader, writer);
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

	getUint8Array(options) {
		return this.getData(new Uint8ArrayWriter(), options);
	}

	replaceBlob(blob) {
		Object.assign(this, {
			data: blob,
			Reader: BlobReader,
			Writer: BlobWriter,
			reader: null
		});
	}

	replaceText(text) {
		Object.assign(this, {
			data: text,
			Reader: TextReader,
			Writer: TextWriter,
			reader: null
		});
	}

	replaceData64URI(dataURI) {
		Object.assign(this, {
			data: dataURI,
			Reader: Data64URIReader,
			Writer: Data64URIWriter,
			reader: null
		});
	}

	replaceUint8Array(array) {
		Object.assign(this, {
			data: array,
			Reader: Uint8ArrayReader,
			Writer: Uint8ArrayWriter,
			reader: null
		});
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

	addUint8Array(name, array) {
		return addChild(this, name, {
			data: array,
			Reader: Uint8ArrayReader,
			Writer: Uint8ArrayWriter
		});
	}

	addHttpContent(name, url, options = {}) {
		return addChild(this, name, {
			data: url,
			Reader: class extends HttpReader {
				constructor(url) {
					super(url, options);
				}
			}
		});
	}

	addFileSystemEntry(fileSystemEntry) {
		return addFileSystemEntry(this, fileSystemEntry);
	}

	addData(name, params) {
		return addChild(this, name, params);
	}

	async importBlob(blob, options = {}) {
		await this.importZip(new BlobReader(blob), options);
	}

	async importData64URI(dataURI, options = {}) {
		await this.importZip(new Data64URIReader(dataURI), options);
	}

	async importUint8Array(array, options = {}) {
		await this.importZip(new Uint8ArrayReader(array), options);
	}

	async importHttpContent(url, options = {}) {
		await this.importZip(new HttpReader(url, options), options);
	}

	exportBlob(options = {}) {
		return this.exportZip(new BlobWriter("application/zip"), options);
	}

	exportData64URI(options = {}) {
		return this.exportZip(new Data64URIWriter("application/zip"), options);
	}

	exportUint8Array(options = {}) {
		return this.exportZip(new Uint8ArrayWriter(), options);
	}

	async importZip(reader, options) {
		if (!reader.initialized) {
			await reader.init();
		}
		const zipReader = new ZipReader(reader, options);
		const entries = await zipReader.getEntries();
		entries.forEach((entry) => {
			let parent = this;
			const path = entry.filename.split("/");
			const name = path.pop();
			path.forEach(pathPart => parent = parent.getChildByName(pathPart) || new ZipDirectoryEntry(this.fs, pathPart, null, parent));
			if (!entry.directory) {
				addChild(parent, name, {
					data: entry,
					Reader: getZipBlobReader(Object.assign({}, options))
				});
			}
		});
	}

	async exportZip(writer, options) {
		const zipEntry = this;
		await initReaders(zipEntry);
		await writer.init();
		const zipWriter = new ZipWriter(writer, options);
		await exportZip(zipWriter, zipEntry, getTotalSize([zipEntry], "uncompressedSize"), options);
		await zipWriter.close();
		return writer.getData();
	}

	getChildByName(name) {
		const children = this.children;
		for (let childIndex = 0; childIndex < children.length; childIndex++) {
			const child = children[childIndex];
			if (child.name == name) {
				return child;
			}
		}
	}
}


class FS {

	constructor() {
		resetFS(this);
	}

	get children() {
		return this.root.children;
	}

	remove(entry) {
		detach(entry);
		this.entries[entry.id] = null;
	}

	move(entry, destination) {
		if (entry == this.root) {
			throw new Error("Root directory cannot be moved");
		} else {
			if (destination.directory) {
				if (!destination.isDescendantOf(entry)) {
					if (entry != destination) {
						if (destination.getChildByName(entry.name)) {
							throw new Error("Entry filename already exists");
						}
						detach(entry);
						entry.parent = destination;
						destination.children.push(entry);
					}
				} else {
					throw new Error("Entry is a ancestor of target entry");
				}
			} else {
				throw new Error("Target entry is not a directory");
			}
		}
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

	getChildByName(name) {
		return this.root.getChildByName(name);
	}

	addDirectory(name) {
		return this.root.addDirectory(name);
	}

	addText(name, text) {
		return this.root.addText(name, text);
	}

	addBlob(name, blob) {
		return this.root.addBlob(name, blob);
	}

	addData64URI(name, dataURI) {
		return this.root.addData64URI(name, dataURI);
	}

	addHttpContent(name, url, options) {
		return this.root.addHttpContent(name, url, options);
	}

	addFileSystemEntry(fileSystemEntry) {
		return this.root.addFileSystemEntry(fileSystemEntry);
	}

	addData(name, params) {
		return this.root.addData(name, params);
	}

	async importBlob(blob, options) {
		resetFS(this);
		await this.root.importBlob(blob, options);
	}

	async importData64URI(dataURI, options) {
		resetFS(this);
		await this.root.importData64URI(dataURI, options);
	}

	async importHttpContent(url, options) {
		resetFS(this);
		await this.root.importHttpContent(url, options);
	}

	exportBlob(options) {
		return this.root.exportBlob(options);
	}

	exportData64URI(options) {
		return this.root.exportData64URI(options);
	}
}

const fs = { FS, ZipDirectoryEntry, ZipFileEntry };
export { fs };

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
	return class extends Reader {

		constructor(entry, options = {}) {
			super();
			this.entry = entry;
			this.options = options;
		}

		async init() {
			const zipBlobReader = this;
			zipBlobReader.size = zipBlobReader.entry.uncompressedSize;
			const data = await zipBlobReader.entry.getData(new BlobWriter(), Object.assign({}, zipBlobReader.options, options));
			zipBlobReader.data = data;
			zipBlobReader.blobReader = new BlobReader(data);
		}

		readUint8Array(index, length) {
			return this.blobReader.readUint8Array(index, length);
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
		if (child.id == entry.id) {
			children.splice(index, 1);
		}
	});
}

async function exportZip(zipWriter, entry, totalSize, options) {
	const selectedEntry = entry;
	const entryOffsets = new Map();
	await process(zipWriter, entry);

	async function process(zipWriter, entry) {
		await exportChild();

		async function exportChild() {
			if (options.bufferedWrite) {
				await Promise.all(entry.children.map(processChild));
			} else {
				for (const child of entry.children) {
					await processChild(child);
				}
			}
		}

		async function processChild(child) {
			const name = options.relativePath ? child.getRelativeName(selectedEntry) : child.getFullname();
			await zipWriter.add(name, child.reader, Object.assign({
				directory: child.directory
			}, Object.assign({}, options, {
				onprogress: indexProgress => {
					if (options.onprogress) {
						entryOffsets.set(name, indexProgress);
						try {
							options.onprogress(Array.from(entryOffsets.values()).reduce((previousValue, currentValue) => previousValue + currentValue), totalSize);
						} catch (_error) {
							// ignored
						}
					}
				}
			})));
			await process(zipWriter, child);
		}
	}
}

async function addFileSystemEntry(zipEntry, fileSystemEntry) {
	if (fileSystemEntry.isDirectory) {
		const entry = zipEntry.addDirectory(fileSystemEntry.name);
		await addDirectory(entry, fileSystemEntry);
		return entry;
	} else {
		return new Promise((resolve, reject) => fileSystemEntry.file(file => resolve(zipEntry.addBlob(fileSystemEntry.name, file)), reject));
	}

	async function addDirectory(zipEntry, fileEntry) {
		const children = await getChildren(fileEntry);
		for (const child of children) {
			if (child.isDirectory) {
				await addDirectory(zipEntry.addDirectory(child.name), child);
			} else {
				await new Promise((resolve, reject) => {
					child.file(file => {
						const childZipEntry = zipEntry.addBlob(child.name, file);
						childZipEntry.uncompressedSize = file.size;
						resolve(childZipEntry);
					}, reject);
				});
			}
		}
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
}

function resetFS(fs) {
	fs.entries = [];
	fs.root = new ZipDirectoryEntry(fs);
}

function pipe(reader, writer) {
	return copyChunk();

	async function copyChunk(chunkIndex = 0) {
		const index = chunkIndex * CHUNK_SIZE;
		if (index < reader.size) {
			const array = await reader.readUint8Array(index, Math.min(CHUNK_SIZE, reader.size - index));
			await writer.writeUint8Array(array);
			return copyChunk(chunkIndex + 1);
		} else {
			return writer.getData();
		}
	}
}

function addChild(parent, name, params, directory) {
	if (parent.directory) {
		return directory ? new ZipDirectoryEntry(parent.fs, name, params, parent) : new ZipFileEntry(parent.fs, name, params, parent);
	} else {
		throw new Error("Parent entry is not a directory");
	}
}