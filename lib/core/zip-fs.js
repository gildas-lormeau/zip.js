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
import { toExactUint8Array } from "./util/array.js";

const ERR_ENTRY_EXISTS = "Entry filename already exists";
const ERR_READABLE_CONSUMED = "Readable stream already consumed";

class ZipEntry {

	constructor(fs, name, params, parent) {
		const zipEntry = this;
		if (fs.root && parent && parent.getChildByName(name)) {
			throw new Error(ERR_ENTRY_EXISTS);
		}
		if (!params) {
			params = {};
		}
		Object.assign(zipEntry, {
			fs,
			name,
			data: params.data,
			options: params.options,
			id: fs.entryIdCounter++,
			parent,
			children: [],
			uncompressedSize: params.uncompressedSize || 0,
			passThrough: params.passThrough
		});
		if (parent || !fs.root) {
			fs.entries[zipEntry.id] = zipEntry;
		}
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
			throw new Error(ERR_ENTRY_EXISTS);
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
			const reader = zipEntry.reader = createReader(zipEntry.Reader, zipEntry.data, options);
			const uncompressedSize = zipEntry.data ? zipEntry.data.uncompressedSize : reader.size;
			await Promise.all([initStream(reader), initStream(writer, uncompressedSize)]);
			const { readable } = reader;
			zipEntry.uncompressedSize = reader.size;
			await readable.pipeTo(writer.writable);
			return writer.getData ? writer.getData() : writer.writable;
		}
	}

	isPasswordProtected() {
		return Boolean(this.data && this.data.encrypted);
	}

	async checkPassword(password, options = {}) {
		const zipEntry = this;
		if (zipEntry.isPasswordProtected()) {
			try {
				await zipEntry.data.getData(null, Object.assign({}, options, {
					password,
					checkPasswordOnly: true
				}));
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

	async getArrayBuffer(options) {
		const array = await this.getUint8Array(options);
		return toExactUint8Array(array).buffer;
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
			Reader: getReadableReader(readable),
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
		const clonedEntry = new ZipDirectoryEntry(zipEntry.fs, zipEntry.name, zipEntry);
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
			Reader: getReadableReader(readable),
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
		options = Object.assign({}, options);
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

	exportFileSystemHandle(handle, options = {}) {
		return exportFileSystemHandle(this, handle, options);
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
				path.forEach(pathPart => {
					const previousParent = parent;
					parent = parent.getChildByName(pathPart);
					if (parent) {
						if (!parent.directory) {
							throw new Error(ERR_ENTRY_EXISTS);
						}
					} else {
						parent = new ZipDirectoryEntry(this.fs, pathPart, { data: null }, previousParent);
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
				} else {
					let directoryEntry = parent;
					if (name) {
						directoryEntry = parent.getChildByName(name);
						if (directoryEntry) {
							if (!directoryEntry.directory) {
								throw new Error(ERR_ENTRY_EXISTS);
							}
						} else {
							directoryEntry = new ZipDirectoryEntry(this.fs, name, { data: null }, parent);
							importedEntries.push(directoryEntry);
						}
					}
					if (directoryEntry != this && !directoryEntry.data) {
						directoryEntry.data = entry;
					}
				}
			} catch (error) {
				try {
					error.cause = {
						entry
					};
				} catch {
					// ignored
				}
				throw error;
			}
		}
		return importedEntries;
	}

	async exportZip(writer, options = {}) {
		const zipEntry = this;
		options = Object.assign({}, options);
		if (options.bufferedWrite === UNDEFINED_VALUE) {
			options.bufferedWrite = true;
		}
		const [readers] = await Promise.all([initReaders(zipEntry, options.readerOptions), initStream(writer)]);
		const zipWriter = new ZipWriter(writer, options);
		await exportZip(zipWriter, zipEntry, getTotalSize([zipEntry], "uncompressedSize"), options, readers);
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
		const removedEntries = [entry];
		while (removedEntries.length) {
			const removedEntry = removedEntries.pop();
			this.entries[removedEntry.id] = null;
			for (const child of removedEntry.children) {
				removedEntries.push(child);
			}
		}
		entry.parent = UNDEFINED_VALUE;
	}

	move(entry, destination) {
		if (entry == this.root) {
			throw new Error("Root directory cannot be moved");
		} else {
			if (destination.directory) {
				if (!destination.isDescendantOf(entry)) {
					if (entry != destination) {
						const existingChild = destination.getChildByName(entry.name);
						if (existingChild) {
							if (existingChild != entry) {
								throw new Error(ERR_ENTRY_EXISTS);
							}
						} else {
							detach(entry);
							entry.parent = destination;
							destination.children.push(entry);
							registerEntries(this, entry);
						}
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
		if (!node) {
			node = this.entries.find(entry => entry && (entry == this.root || entry.isDescendantOf(this.root)) &&
				entry.getRelativeName() == fullname);
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
		resetFS(this);
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

	exportFileSystemHandle(handle, options) {
		return this.root.exportFileSystemHandle(handle, options);
	}

	exportZip(writer, options) {
		return this.root.exportZip(writer, options);
	}

	isPasswordProtected() {
		return this.root.isPasswordProtected();
	}

	checkPassword(password, options) {
		return this.root.checkPassword(password, options);
	}
}

const fs = { FS, ZipDirectoryEntry, ZipFileEntry };
export { fs };

function getTotalSize(entries, propertyName) {
	let size = 0;
	const pendingEntries = Array.from(entries);
	while (pendingEntries.length) {
		const entry = pendingEntries.pop();
		size += entry[propertyName] || 0;
		for (const child of entry.children) {
			pendingEntries.push(child);
		}
	}
	return size;
}

function getReadableReader(readable) {
	let consumed;
	return function () {
		if (consumed) {
			throw new Error(ERR_READABLE_CONSUMED);
		}
		consumed = true;
		return { readable };
	};
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
			const data = await zipBlobReader.entry.getData(new BlobWriter(), Object.assign({}, options, zipBlobReader.options));
			zipBlobReader.data = data;
			zipBlobReader.blobReader = new BlobReader(data);
			super.init();
		}

		readUint8Array(index, length) {
			return this.blobReader.readUint8Array(index, length);
		}
	};
}

function createReader(Reader, data, options) {
	return Reader.prototype ? new Reader(data, options) : Reader(data, options);
}

async function initReaders(entry, options) {
	const fileEntries = [];
	const pendingEntries = [entry];
	const readers = new Map();
	while (pendingEntries.length) {
		const pendingEntry = pendingEntries.pop();
		for (const child of pendingEntry.children) {
			if (child.directory) {
				pendingEntries.push(child);
			} else {
				fileEntries.push(child);
			}
		}
	}
	await Promise.all(fileEntries.map(async child => {
		const reader = child.reader = createReader(child.Reader, child.data, options);
		readers.set(child, reader);
		try {
			await initStream(reader);
		} catch (error) {
			try {
				error.entryId = child.id;
				error.cause = {
					entry: child
				};
			} catch {
				// ignored
			}
			throw error;
		}
		if (reader.size !== UNDEFINED_VALUE) {
			child.uncompressedSize = reader.size;
		}
	}));
	return readers;
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

async function exportZip(zipWriter, entry, totalSize, options, readers) {
	const selectedEntry = entry;
	const entryOffsets = new Map();
	await process(zipWriter, entry);

	async function process(zipWriter, entry) {
		await exportChild();

		async function exportChild() {
			if (options.bufferedWrite) {
				const results = await Promise.allSettled(entry.children.map(processChild));
				const errorResult = results.find(result => result.status == "rejected");
				if (errorResult) {
					throw errorResult.reason;
				}
			} else {
				for (const child of entry.children) {
					await processChild(child);
				}
			}
		}

		async function processChild(child) {
			const name = options.relativePath ? child.getRelativeName(selectedEntry) : child.getFullname();
			const childOptions = child.options || {};
			let zipEntryOptions = {};
			if (child.data instanceof Entry) {
				const {
					externalFileAttributes,
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
					externalFileAttributes,
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
			await zipWriter.add(name, readers.get(child), Object.assign({}, options, zipEntryOptions, childOptions, {
				directory: child.directory,
				onprogress: async indexProgress => {
					if (options.onprogress) {
						entryOffsets.set(name, indexProgress);
						try {
							await options.onprogress(Array.from(entryOffsets.values()).reduce((previousValue, currentValue) => previousValue + currentValue), totalSize);
						} catch {
							// ignored
						}
					}
				}
			}));
			await process(zipWriter, child);
		}
	}
}

function addFileSystemHandle(zipEntry, handle, options) {
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
				throw new Error(message, { cause: error });
			}
		}
		return addedEntries;
	}
}

async function exportFileSystemHandle(zipEntry, directoryHandle, options) {
	const totalSize = getTotalSize([zipEntry], "uncompressedSize");
	const writtenSizes = new Map();
	await exportChildren(zipEntry, directoryHandle);
	return directoryHandle;

	async function exportChildren(entry, parentHandle) {
		if (options.concurrent) {
			const results = await Promise.allSettled(entry.children.map(child => exportChild(child, parentHandle)));
			const failedResult = results.find(result => result.status == "rejected");
			if (failedResult) {
				throw failedResult.reason;
			}
		} else {
			for (const child of entry.children) {
				await exportChild(child, parentHandle);
			}
		}
	}

	async function exportChild(child, parentHandle) {
		try {
			if (child.directory) {
				const childDirectoryHandle = await parentHandle.getDirectoryHandle(child.name, { create: true });
				await exportChildren(child, childDirectoryHandle);
			} else {
				const fileHandle = await parentHandle.getFileHandle(child.name, { create: true });
				const writable = await fileHandle.createWritable();
				await child.getData({ writable }, Object.assign({}, options, {
					onprogress: async progress => {
						if (options.onprogress) {
							writtenSizes.set(child.id, progress);
							try {
								await options.onprogress(Array.from(writtenSizes.values()).reduce((previousValue, currentValue) => previousValue + currentValue, 0), totalSize);
							} catch {
								// ignored
							}
						}
					}
				}));
			}
		} catch (error) {
			throw new Error(error.message + (child ? " (" + child.name + ")" : ""), { cause: error });
		}
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
						done: entryIndex == entries.length
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
	fs.entryIdCounter = 0;
	fs.root = new ZipDirectoryEntry(fs);
}

function registerEntries(fs, entry) {
	const pendingEntries = [entry];
	while (pendingEntries.length) {
		const pendingEntry = pendingEntries.pop();
		fs.entries[pendingEntry.id] = pendingEntry;
		for (const child of pendingEntry.children) {
			pendingEntries.push(child);
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