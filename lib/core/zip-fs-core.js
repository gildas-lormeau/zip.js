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

/* global WritableStream */
// deno-lint-ignore-file no-this-alias

import {
	initStream,
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
import {
	ZipReader,
	ERR_INVALID_PASSWORD
} from "./zip-reader.js";
import {
	ZipWriter
} from "./zip-writer.js";
import {
	Entry
} from "./zip-entry.js";
import { UNDEFINED_VALUE } from "./constants.js";

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
			options: params.options,
			id: fs.entries.length,
			parent,
			children: [],
			uncompressedSize: params.uncompressedSize || 0,
			passThrough: params.passThrough
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

	rename(name) {
		const parent = this.parent;
		if (parent && parent.getChildByName(name)) {
			throw new Error("Entry filename already exists");
		} else {
			this.name = name;
		}
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

	clone() {
		return new ZipFileEntry(this.fs, this.name, this);
	}

	async getData(writer, options = {}) {
		const zipEntry = this;
		if (!writer || (writer.constructor == zipEntry.Writer && zipEntry.data)) {
			return zipEntry.data;
		} else {
			const reader = zipEntry.reader = new zipEntry.Reader(zipEntry.data, options);
			const uncompressedSize = zipEntry.data ? zipEntry.data.uncompressedSize : reader.size;
			await Promise.all([initStream(reader), initStream(writer, uncompressedSize)]);
			const readable = reader.readable;
			readable.size = zipEntry.uncompressedSize = reader.size;
			await readable.pipeTo(writer.writable);
			return writer.getData ? writer.getData() : writer.writable;
		}
	}

	isPasswordProtected() {
		return this.data.encrypted;
	}

	async checkPassword(password, options = {}) {
		const zipEntry = this;
		if (zipEntry.isPasswordProtected()) {
			options.password = password;
			options.checkPasswordOnly = true;
			try {
				await zipEntry.data.getData(null, options);
				return true;
			} catch (error) {
				if (error.message == ERR_INVALID_PASSWORD) {
					return false;
				} else {
					throw error;
				}
			}
		} else {
			return true;
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

	getWritable(writable = new WritableStream(), options) {
		return this.getData({ writable }, options);
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

	replaceReadable(readable) {
		Object.assign(this, {
			data: null,
			Reader: function () { return { readable }; },
			Writer: null,
			reader: null
		});
	}
}

class ZipDirectoryEntry extends ZipEntry {

	constructor(fs, name, params, parent) {
		super(fs, name, params, parent);
		this.directory = true;
	}

	clone(deepClone) {
		const zipEntry = this;
		const clonedEntry = new ZipDirectoryEntry(zipEntry.fs, zipEntry.name);
		if (deepClone) {
			clonedEntry.children = zipEntry.children.map(child => {
				const childClone = child.clone(deepClone);
				childClone.parent = clonedEntry;
				return childClone;
			});
		}
		return clonedEntry;
	}

	addDirectory(name, options) {
		return addChild(this, name, { options }, true);
	}

	addText(name, text, options = {}) {
		return addChild(this, name, {
			data: text,
			Reader: TextReader,
			Writer: TextWriter,
			options,
			uncompressedSize: text.length
		});
	}

	addBlob(name, blob, options = {}) {
		return addChild(this, name, {
			data: blob,
			Reader: BlobReader,
			Writer: BlobWriter,
			options,
			uncompressedSize: blob.size
		});
	}

	addData64URI(name, dataURI, options = {}) {
		let dataEnd = dataURI.length;
		while (dataURI.charAt(dataEnd - 1) == "=") {
			dataEnd--;
		}
		const dataStart = dataURI.indexOf(",") + 1;
		return addChild(this, name, {
			data: dataURI,
			Reader: Data64URIReader,
			Writer: Data64URIWriter,
			options,
			uncompressedSize: Math.floor((dataEnd - dataStart) * 0.75)
		});
	}

	addUint8Array(name, array, options = {}) {
		return addChild(this, name, {
			data: array,
			Reader: Uint8ArrayReader,
			Writer: Uint8ArrayWriter,
			options,
			uncompressedSize: array.length
		});
	}

	addHttpContent(name, url, options = {}) {
		return addChild(this, name, {
			data: url,
			Reader: class extends HttpReader {
				constructor(url) {
					super(url, options);
				}
			},
			options
		});
	}

	addReadable(name, readable, options = {}) {
		return addChild(this, name, {
			Reader: function () { return { readable }; },
			options
		});
	}

	addFileSystemEntry(fileSystemEntry, options = {}) {
		return addFileSystemHandle(this, fileSystemEntry, options);
	}

	addFileSystemHandle(handle, options = {}) {
		return addFileSystemHandle(this, handle, options);
	}

	addFile(file, options = {}) {
		if (!options.lastModDate) {
			options.lastModDate = new Date(file.lastModified);
		}
		return addChild(this, file.name, {
			data: file,
			Reader: function () {
				const readable = file.stream();
				const size = file.size;
				return { readable, size };
			},
			options,
			uncompressedSize: file.size
		});
	}

	addData(name, params) {
		return addChild(this, name, params);
	}

	importBlob(blob, options) {
		return this.importZip(new BlobReader(blob), options);
	}

	importData64URI(dataURI, options) {
		return this.importZip(new Data64URIReader(dataURI), options);
	}

	importUint8Array(array, options) {
		return this.importZip(new Uint8ArrayReader(array), options);
	}

	importHttpContent(url, options) {
		return this.importZip(new HttpReader(url, options), options);
	}

	importReadable(readable, options) {
		return this.importZip({ readable }, options);
	}

	exportBlob(options = {}) {
		return this.exportZip(new BlobWriter(options.mimeType || "application/zip"), options);
	}

	exportData64URI(options = {}) {
		return this.exportZip(new Data64URIWriter(options.mimeType || "application/zip"), options);
	}

	exportUint8Array(options = {}) {
		return this.exportZip(new Uint8ArrayWriter(), options);
	}

	async exportWritable(writable = new WritableStream(), options = {}) {
		await this.exportZip({ writable }, options);
		return writable;
	}

	async importZip(reader, options = {}) {
		await initStream(reader);
		const zipReader = new ZipReader(reader, options);
		const importedEntries = [];
		const entries = await zipReader.getEntries();
		for (const entry of entries) {
			let parent = this;
			try {
				const path = entry.filename.split("/");
				const name = path.pop();
				path.forEach((pathPart, pathIndex) => {
					const previousParent = parent;
					parent = parent.getChildByName(pathPart);
					if (!parent) {
						parent = new ZipDirectoryEntry(this.fs, pathPart, { data: pathIndex == path.length - 1 ? entry : null }, previousParent);
						importedEntries.push(parent);
					}
				});
				if (!entry.directory) {
					importedEntries.push(addChild(parent, name, {
						data: entry,
						Reader: getZipBlobReader(Object.assign({}, options)),
						uncompressedSize: entry.uncompressedSize,
						passThrough: options.passThrough
					}));
				}
			} catch (error) {
				try {
					error.cause = {
						entry
					};
				} catch (_error) {
					// ignored
				}
				throw error;
			}
		}
		return importedEntries;
	}

	async exportZip(writer, options) {
		const zipEntry = this;
		if (options.bufferedWrite === UNDEFINED_VALUE) {
			options.bufferedWrite = true;
		}
		await Promise.all([initReaders(zipEntry, options.readerOptions), initStream(writer)]);
		const zipWriter = new ZipWriter(writer, options);
		await exportZip(zipWriter, zipEntry, getTotalSize([zipEntry], "uncompressedSize"), options);
		await zipWriter.close();
		return writer.getData ? writer.getData() : writer.writable;
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

	isPasswordProtected() {
		const children = this.children;
		for (let childIndex = 0; childIndex < children.length; childIndex++) {
			const child = children[childIndex];
			if (child.isPasswordProtected()) {
				return true;
			}
		}
		return false;
	}

	async checkPassword(password, options = {}) {
		const children = this.children;
		const result = await Promise.all(children.map(child => child.checkPassword(password, options)));
		return !result.includes(false);
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

	addDirectory(name, options) {
		return this.root.addDirectory(name, options);
	}

	addText(name, text, options) {
		return this.root.addText(name, text, options);
	}

	addBlob(name, blob, options) {
		return this.root.addBlob(name, blob, options);
	}

	addData64URI(name, dataURI, options) {
		return this.root.addData64URI(name, dataURI, options);
	}

	addUint8Array(name, array, options) {
		return this.root.addUint8Array(name, array, options);
	}

	addHttpContent(name, url, options) {
		return this.root.addHttpContent(name, url, options);
	}

	addReadable(name, readable, options) {
		return this.root.addReadable(name, readable, options);
	}

	addFileSystemEntry(fileSystemEntry, options) {
		return this.root.addFileSystemEntry(fileSystemEntry, options);
	}

	addFileSystemHandle(handle, options) {
		return this.root.addFileSystemHandle(handle, options);
	}

	addFile(file, options) {
		return this.root.addFile(file, options);
	}

	addData(name, params) {
		return this.root.addData(name, params);
	}

	importBlob(blob, options) {
		resetFS(this);
		return this.root.importBlob(blob, options);
	}

	importData64URI(dataURI, options) {
		resetFS(this);
		return this.root.importData64URI(dataURI, options);
	}

	importUint8Array(array, options) {
		resetFS(this);
		return this.root.importUint8Array(array, options);
	}

	importHttpContent(url, options) {
		resetFS(this);
		return this.root.importHttpContent(url, options);
	}

	importReadable(readable, options) {
		resetFS(this);
		return this.root.importReadable(readable, options);
	}

	importZip(reader, options) {
		return this.root.importZip(reader, options);
	}

	exportBlob(options) {
		return this.root.exportBlob(options);
	}

	exportData64URI(options) {
		return this.root.exportData64URI(options);
	}

	exportUint8Array(options) {
		return this.root.exportUint8Array(options);
	}

	exportWritable(writable, options) {
		return this.root.exportWritable(writable, options);
	}

	isPasswordProtected() {
		return this.root.isPasswordProtected();
	}

	async checkPassword(password, options) {
		return this.root.checkPassword(password, options);
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
			super.init();
		}

		readUint8Array(index, length) {
			return this.blobReader.readUint8Array(index, length);
		}
	};
}

async function initReaders(entry, options) {
	if (entry.children.length) {
		await Promise.all(entry.children.map(async child => {
			if (child.directory) {
				await initReaders(child, options);
			} else {
				const reader = child.reader = new child.Reader(child.data, options);
				try {
					await initStream(reader);
				} catch (error) {
					try {
						error.entryId = child.id;
						error.cause = {
							entry: child
						};
					} catch (_error) {
						// ignored
					}
					throw error;
				}
				child.uncompressedSize = reader.size;
			}
		}));
	}
}

function detach(entry) {
	if (entry.parent) {
		const children = entry.parent.children;
		children.forEach((child, index) => {
			if (child.id == entry.id) {
				children.splice(index, 1);
			}
		});
	}
}

async function exportZip(zipWriter, entry, totalSize, options) {
	const selectedEntry = entry;
	const entryOffsets = new Map();
	await process(zipWriter, entry);

	async function process(zipWriter, entry) {
		await exportChild();

		async function exportChild() {
			if (options.bufferedWrite) {
				await Promise.allSettled(entry.children.map(processChild));
			} else {
				for (const child of entry.children) {
					await processChild(child);
				}
			}
		}

		async function processChild(child) {
			const name = options.relativePath ? child.getRelativeName(selectedEntry) : child.getFullname();
			let childOptions = child.options || {};
			let zipEntryOptions = {};
			if (child.data instanceof Entry) {
				const {
					externalFileAttribute,
					versionMadeBy,
					comment,
					lastModDate,
					creationDate,
					lastAccessDate,
					uncompressedSize,
					encrypted,
					zipCrypto,
					signature,
					compressionMethod,
					extraFieldAES
				} = child.data;
				zipEntryOptions = {
					externalFileAttribute,
					versionMadeBy,
					comment,
					lastModDate,
					creationDate,
					lastAccessDate
				};
				if (child.passThrough) {
					let level, encryptionStrength;
					if (compressionMethod === 0) {
						level = 0;
					}
					if (extraFieldAES) {
						encryptionStrength = extraFieldAES.strength;
					}
					zipEntryOptions = Object.assign(zipEntryOptions, {
						passThrough: true,
						encrypted,
						zipCrypto,
						signature,
						uncompressedSize,
						level,
						encryptionStrength,
						compressionMethod
					});
				}
			}
			await zipWriter.add(name, child.reader, Object.assign({
				directory: child.directory
			}, Object.assign({}, options, zipEntryOptions, childOptions, {
				onprogress: async indexProgress => {
					if (options.onprogress) {
						entryOffsets.set(name, indexProgress);
						try {
							await options.onprogress(Array.from(entryOffsets.values()).reduce((previousValue, currentValue) => previousValue + currentValue), totalSize);
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

async function addFileSystemHandle(zipEntry, handle, options) {
	return addFile(zipEntry, handle, []);

	async function addFile(parentEntry, handle, addedEntries) {
		if (handle) {
			try {
				if (handle.isFile || handle.isDirectory) {
					handle = await transformToFileSystemhandle(handle);
				}
				if (handle.kind == "file") {
					const file = await handle.getFile();
					addedEntries.push(
						parentEntry.addData(file.name, {
							Reader: function () {
								const readable = file.stream();
								const size = file.size;
								return { readable, size };
							},
							options: Object.assign({}, { lastModDate: new Date(file.lastModified) }, options),
							uncompressedSize: file.size
						})
					);
				} else if (handle.kind == "directory") {
					const directoryEntry = parentEntry.addDirectory(handle.name);
					addedEntries.push(directoryEntry);
					for await (const childHandle of handle.values()) {
						await addFile(directoryEntry, childHandle, addedEntries);
					}
				}
			} catch (error) {
				const message = error.message + (handle ? " (" + handle.name + ")" : "");
				throw new Error(message);
			}
		}
		return addedEntries;
	}
}

async function transformToFileSystemhandle(entry) {
	const handle = {
		name: entry.name
	};
	if (entry.isFile) {
		handle.kind = "file";
		handle.getFile = () =>
			new Promise((resolve, reject) => entry.file(resolve, reject));
	}
	if (entry.isDirectory) {
		handle.kind = "directory";
		const handles = await transformToFileSystemhandles(entry);
		handle.values = () => handles;
	}
	return handle;
}

async function transformToFileSystemhandles(entry) {
	const entries = [];
	function readEntries(directoryReader, resolve, reject) {
		directoryReader.readEntries(async (entriesPart) => {
			if (!entriesPart.length) {
				resolve(entries);
			} else {
				for (const entry of entriesPart) {
					entries.push(await transformToFileSystemhandle(entry));
				}
				readEntries(directoryReader, resolve, reject);
			}
		}, reject);
	}
	await new Promise((resolve, reject) =>
		readEntries(entry.createReader(), resolve, reject)
	);
	return {
		[Symbol.iterator]() {
			let entryIndex = 0;
			return {
				next() {
					const result = {
						value: entries[entryIndex],
						done: entryIndex === entries.length
					};
					entryIndex++;
					return result;
				}
			};
		}
	};
}

function resetFS(fs) {
	fs.entries = [];
	fs.root = new ZipDirectoryEntry(fs);
}

function addChild(parent, name, params, directory) {
	if (parent.directory) {
		return directory ? new ZipDirectoryEntry(parent.fs, name, params, parent) : new ZipFileEntry(parent.fs, name, params, parent);
	} else {
		throw new Error("Parent entry is not a directory");
	}
}