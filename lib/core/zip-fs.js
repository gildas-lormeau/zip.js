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

/* global WritableStream, AbortController, DOMException */
// deno-lint-ignore-file no-this-alias

import {
	initStream,
	Reader,
	TextReader,
	TextWriter,
	getTextSize,
	Data64URIReader,
	Data64URIWriter,
	Uint8ArrayReader,
	Uint8ArrayWriter,
	BlobReader,
	BlobWriter,
	HttpReader,
	ownsWritable
} from "./io.js";
import {
	ZipReader,
	ERR_INVALID_PASSWORD
} from "./zip-reader.js";
import {
	ZipWriter,
	getEntriesSize
} from "./zip-writer.js";
import {
	Entry
} from "./zip-entry.js";
import { checkSignalOption } from "./options.js";
import { ProgressWatcherStream, callHandler } from "./codec-worker.js";
import {
	UNDEFINED_VALUE,
	FUNCTION_TYPE,
	OBJECT_TYPE,
	MAX_8_BITS,
	MIN_DATE,
	MAX_DATE,
	EXTRAFIELD_TYPE_ZIP64,
	EXTRAFIELD_TYPE_AES,
	EXTRAFIELD_TYPE_NTFS,
	EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP,
	EXTRAFIELD_TYPE_UNICODE_PATH,
	EXTRAFIELD_TYPE_UNICODE_COMMENT,
	EXTRAFIELD_TYPE_USDZ,
	EXTRAFIELD_TYPE_INFOZIP,
	EXTRAFIELD_TYPE_UNIX,
	EXTRAFIELD_TYPE_UNIX_TYPE1,
	EXTRAFIELD_TYPE_PKWARE_UNIX
} from "./constants.js";
import { toExactUint8Array } from "./util/array.js";
import { toCompatibleReadable, toCompatibleWritable } from "./util/compatible-streams.js";

const ERR_ENTRY_EXISTS = "Entry filename already exists";
const ERR_READABLE_CONSUMED = "Readable stream already consumed";
const ERR_INVALID_PASS_THROUGH = "Invalid passThrough option (use readerOptions.passThrough or set uncompressedSize for each entry)";
const ERR_INVALID_READER_OPTIONS = "Invalid readerOptions (must be an object)";
const ERR_ZIP_CRYPTO_LAST_MOD_DATE = "The last modification date of an entry encrypted with ZipCrypto cannot be changed when passThrough is set";
const ERR_ABORT_EXPORT = "zipjs-abort-export";
const ERR_ABORTED = "The operation was aborted";
const ABORT_ERROR_NAME = "AbortError";
const INFOZIP_EXTRA_FIELD_TYPE = "infozip";
const INTERPRETED_EXTRA_FIELD_TYPES = new Set([
	EXTRAFIELD_TYPE_ZIP64,
	EXTRAFIELD_TYPE_AES,
	EXTRAFIELD_TYPE_NTFS,
	EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP,
	EXTRAFIELD_TYPE_UNICODE_PATH,
	EXTRAFIELD_TYPE_UNICODE_COMMENT,
	EXTRAFIELD_TYPE_USDZ,
	EXTRAFIELD_TYPE_INFOZIP,
	EXTRAFIELD_TYPE_UNIX,
	EXTRAFIELD_TYPE_UNIX_TYPE1,
	EXTRAFIELD_TYPE_PKWARE_UNIX
]);

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
			options: params.options && Object.assign({}, params.options),
			id: fs.entryIdCounter++,
			parent,
			children: [],
			uncompressedSize: params.uncompressedSize || 0,
			undeterminedSize: params.undeterminedSize || params.uncompressedSize === UNDEFINED_VALUE,
			passThrough: params.passThrough,
			defaultLastModDate: params.defaultLastModDate || new Date()
		});
		if (parent || !fs.root) {
			fs.entries[zipEntry.id] = zipEntry;
		}
		if (parent) {
			zipEntry.parent.children.push(zipEntry);
		}
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

	setOptions(options) {
		const entryOptions = Object.assign({}, this.options, options);
		this.options = Object.fromEntries(Object.entries(entryOptions).filter(([, value]) => value !== UNDEFINED_VALUE));
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
		if (!writer || (writer.constructor == zipEntry.Writer && zipEntry.data && keepsContentType(writer, zipEntry.data))) {
			return zipEntry.data;
		} else {
			const reader = zipEntry.reader = createReader(zipEntry.Reader, zipEntry.data, options);
			const dataSize = zipEntry.uncompressedSize || reader.size;
			await Promise.all([initStream(reader), initStream(writer, dataSize)]);
			const signal = checkSignalOption(options.signal);
			const readable = createProgressReadable(zipEntry, reader, options, signal);
			const preventClose = !ownsWritable(writer) && Boolean(options.preventClose);
			zipEntry.uncompressedSize = reader.size;
			await toCompatibleReadable(readable).pipeTo(toCompatibleWritable(writer.writable), { signal, preventClose, preventAbort: preventClose });
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
			uncompressedSize: getTextSize(text)
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
		let zipReader;
		if (reader && typeof reader.getEntries == FUNCTION_TYPE) {
			zipReader = reader;
			options = Object.assign({}, zipReader.options, options);
		} else {
			await initStream(reader);
			zipReader = new ZipReader(reader, options);
		}
		const importedEntries = [];
		const entries = await zipReader.getEntries(options);
		for (const entry of entries) {
			let parent = this;
			try {
				const path = entry.filename.split("/").filter(pathPart => pathPart != "" && pathPart != ".");
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
						uncompressedSize: options.passThrough ? entry.compressedSize : entry.uncompressedSize,
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
		const [readers] = await Promise.all([initReaders(zipEntry, checkReaderOptions(options.readerOptions)), initStream(writer)]);
		const zipWriter = new ZipWriter(writer, options);
		await exportZip(zipWriter, zipEntry, getTotalSize([zipEntry], getUncompressedSize), options, readers);
		await zipWriter.close(options.globalComment);
		return writer.getData ? writer.getData() : writer.writable;
	}

	getExportedSize(options = {}) {
		const zipEntry = this;
		options = Object.assign({}, options);
		checkReaderOptions(options.readerOptions);
		if (options.bufferedWrite === UNDEFINED_VALUE) {
			options.bufferedWrite = true;
		}
		const writeOrderGuaranteed = !options.bufferedWrite ||
			(options.keepOrder !== false && zipEntry.children.every(child => !child.children.length));
		return getEntriesSize(options, zipEntry.getChildren({ recursive: true }).filter(child => !isImplicitDirectory(child)).map(child => {
			const { name, entryOptions } = getChildEntryOptions(child, zipEntry, options);
			return { name, size: child.directory ? 0 : getDeterminedSize(child, isPassThrough(child, options)), options: entryOptions };
		}), writeOrderGuaranteed, options.globalComment);
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

	getChildren(options = {}) {
		return collectChildren(this, options.recursive);
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


class ZipFS {

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

	getChildren(options) {
		return this.root.getChildren(options);
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

	getExportedSize(options) {
		return this.root.getExportedSize(options);
	}

	isPasswordProtected() {
		return this.root.isPasswordProtected();
	}

	checkPassword(password, options) {
		return this.root.checkPassword(password, options);
	}
}

const fs = { FS: ZipFS, ZipDirectoryEntry, ZipFileEntry };
export { ZipFS, ZipEntry, ZipFileEntry, ZipDirectoryEntry, fs, ERR_ENTRY_EXISTS, ERR_READABLE_CONSUMED, ERR_INVALID_PASS_THROUGH, ERR_INVALID_READER_OPTIONS, ERR_ZIP_CRYPTO_LAST_MOD_DATE, ERR_ABORTED };

function getTotalSize(entries, getEntrySize) {
	let size = 0;
	const pendingEntries = Array.from(entries);
	while (pendingEntries.length) {
		const entry = pendingEntries.pop();
		size += getEntrySize(entry) || 0;
		for (const child of entry.children) {
			pendingEntries.push(child);
		}
	}
	return size;
}

function getUncompressedSize(entry) {
	return entry.uncompressedSize;
}

function getExtractedSize(entry, passThrough) {
	const { data } = entry;
	return passThrough && data instanceof Entry ? data.compressedSize : entry.uncompressedSize;
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
			const readerOptions = Object.assign({}, options, zipBlobReader.options);
			const { checkOverlappingEntry, checkOverlappingEntryOnly } = readerOptions;
			const data = await zipBlobReader.entry.getData(new BlobWriter(), Object.assign(readerOptions, {
				checkPasswordOnly: false,
				checkOverlappingEntry: checkOverlappingEntryOnly || checkOverlappingEntry,
				checkOverlappingEntryOnly: false,
				preventClose: false
			}));
			zipBlobReader.data = data;
			zipBlobReader.blobReader = new BlobReader(data);
			zipBlobReader.size = data.size;
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

function keepsContentType(writer, data) {
	const { contentType } = writer;
	if (contentType === UNDEFINED_VALUE) {
		return true;
	} else if (writer.constructor == BlobWriter) {
		return data.type == contentType;
	} else if (writer.constructor == Data64URIWriter) {
		return data.startsWith("data:" + (contentType || "") + ";base64,");
	} else {
		return true;
	}
}

function createProgressReadable(zipEntry, reader, options, signal) {
	const { onstart, onprogress, onend } = options;
	const { readable } = reader;
	const coreReaderReportsProgress = zipEntry.data instanceof Entry;
	if (coreReaderReportsProgress || (!onstart && !onprogress && !onend)) {
		return readable;
	} else {
		return toCompatibleReadable(readable).pipeThrough(new ProgressWatcherStream({ onstart, onprogress, onend, size: reader.size }), { signal });
	}
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
			child.undeterminedSize = false;
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

function forwardAbort(signal, abortController) {
	if (!checkSignalOption(signal)) {
		return () => { };
	}
	if (signal.aborted) {
		abortController.abort(signal.reason);
		return () => { };
	}
	const abort = () => abortController.abort(signal.reason);
	signal.addEventListener("abort", abort, { once: true });
	return () => signal.removeEventListener("abort", abort);
}

function isExportAborted(error) {
	return Boolean(error) && error.message == ERR_ABORT_EXPORT;
}

function aggregateEntryErrors(errors) {
	const [error] = errors;
	const otherErrors = errors
		.slice(1)
		.flatMap(otherError => [otherError, ...(otherError && otherError.entryErrors || [])])
		.filter(otherError => otherError !== error);
	if (otherErrors.length) {
		try {
			error.entryErrors = [...(error.entryErrors || []), ...otherErrors];
		} catch {
			// ignored
		}
	}
	return error;
}

function getChildEntryOptions(child, selectedEntry, options) {
	const name = options.relativePath ? child.getRelativeName(selectedEntry) : child.getFullname();
	const childOptions = child.options || {};
	let zipEntryMetadata = {};
	let passThroughOptions = {};
	if (child.data instanceof Entry) {
		const {
			externalFileAttributes,
			versionMadeBy,
			comment,
			lastModDate,
			rawLastModDate,
			creationDate,
			lastAccessDate,
			uncompressedSize,
			encrypted,
			zipCrypto,
			crc32,
			compressionMethod,
			extraFieldAES,
			internalFileAttributes,
			extraField,
			bitFlag,
			uid,
			gid
		} = child.data;
		zipEntryMetadata = {
			externalFileAttributes,
			versionMadeBy,
			comment,
			lastModDate,
			creationDate,
			lastAccessDate,
			internalFileAttributes
		};
		const userExtraField = getUserExtraField(extraField);
		if (userExtraField) {
			zipEntryMetadata.extraField = userExtraField;
		}
		if (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE) {
			Object.assign(zipEntryMetadata, {
				uid,
				gid,
				unixExtraFieldType: INFOZIP_EXTRA_FIELD_TYPE
			});
		}
		if (isPassThrough(child, options)) {
			let encryptionStrength;
			if (extraFieldAES) {
				encryptionStrength = extraFieldAES.strength;
			}
			passThroughOptions = {
				passThrough: true,
				encrypted,
				zipCrypto,
				crc32,
				uncompressedSize,
				encryptionStrength,
				compressionMethod
			};
			if (bitFlag) {
				passThroughOptions.dataDescriptor = bitFlag.dataDescriptor;
			}
			const lastModDateOverride = childOptions.lastModDate === UNDEFINED_VALUE ? options.lastModDate : childOptions.lastModDate;
			if (lastModDateOverride === UNDEFINED_VALUE) {
				passThroughOptions.rawLastModDate = rawLastModDate;
			} else if (zipCrypto && (!bitFlag || bitFlag.dataDescriptor) && lastModDateOverride instanceof Date &&
				getDosTimeHighByte(lastModDateOverride) != ((rawLastModDate >>> 8) & MAX_8_BITS)) {
				throw new Error(ERR_ZIP_CRYPTO_LAST_MOD_DATE);
			}
		}
	}
	const entryOptions = Object.assign({ lastModDate: child.defaultLastModDate }, zipEntryMetadata, options, childOptions, passThroughOptions, { directory: child.directory });
	if (!child.directory && entryOptions.passThrough && entryOptions.uncompressedSize === UNDEFINED_VALUE) {
		throw new Error(ERR_INVALID_PASS_THROUGH);
	}
	return { name, entryOptions };
}

function getDosTimeHighByte(lastModDate) {
	let dosLastModDate = new Date(Math.ceil(Math.floor(lastModDate.getTime() / 1000) / 2) * 2000);
	if (dosLastModDate < MIN_DATE) {
		dosLastModDate = MIN_DATE;
	} else if (dosLastModDate > MAX_DATE) {
		dosLastModDate = MAX_DATE;
	}
	return ((dosLastModDate.getHours() << 3) | (dosLastModDate.getMinutes() >> 3)) & MAX_8_BITS;
}

function getDeterminedSize(child, passThrough) {
	const { reader } = child;
	if (reader && reader.size !== UNDEFINED_VALUE) {
		return reader.size;
	}
	return child.undeterminedSize ? UNDEFINED_VALUE : getExtractedSize(child, passThrough);
}

function checkReaderOptions(readerOptions) {
	if (readerOptions && (typeof readerOptions != OBJECT_TYPE || Array.isArray(readerOptions))) {
		throw new Error(ERR_INVALID_READER_OPTIONS);
	}
	return readerOptions;
}

function isPassThrough(child, options) {
	const { readerOptions } = options;
	return Boolean(!child.directory && (child.passThrough || (readerOptions && readerOptions.passThrough)));
}

function isImplicitDirectory(child) {
	return child.directory && child.data === null;
}

function getUserExtraField(extraField) {
	if (extraField) {
		const userExtraField = new Map();
		extraField.forEach((field, type) => {
			if (!INTERPRETED_EXTRA_FIELD_TYPES.has(type)) {
				userExtraField.set(type, field.data);
			}
		});
		if (userExtraField.size) {
			return userExtraField;
		}
	}
}

async function exportZip(zipWriter, entry, totalSize, options, readers) {
	const { onstart, onprogress, onend, onentryprogress } = options;
	const selectedEntry = entry;
	const totalEntries = getTotalSize(entry.children, child => isImplicitDirectory(child) ? 0 : 1);
	let writtenSize = 0;
	let writtenEntries = 0;
	if (onstart) {
		await callHandler(onstart, totalSize);
	}
	if (options.bufferedWrite) {
		await processChildren(entry);
	} else {
		for (const child of entry.getChildren({ recursive: true })) {
			await addChild(child);
		}
	}
	if (onend) {
		await callHandler(onend, writtenSize);
	}

	async function processChildren(entry) {
		const results = await Promise.allSettled(entry.children.map(async child => {
			await addChild(child);
			await processChildren(child);
		}));
		const errorResult = results.find(result => result.status == "rejected");
		if (errorResult) {
			throw errorResult.reason;
		}
	}

	async function addChild(child) {
		if (isImplicitDirectory(child)) {
			return;
		}
		const { name, entryOptions } = getChildEntryOptions(child, selectedEntry, options);
		let entryWrittenSize = 0;
		const entryMetadata = await zipWriter.add(name, readers.get(child), Object.assign(entryOptions, {
			onstart: UNDEFINED_VALUE,
			onend: UNDEFINED_VALUE,
			onprogress: async indexProgress => {
				writtenSize += indexProgress - entryWrittenSize;
				entryWrittenSize = indexProgress;
				if (onprogress) {
					await callHandler(onprogress, writtenSize, totalSize);
				}
			}
		}));
		writtenEntries++;
		if (onentryprogress) {
			await callHandler(onentryprogress, writtenEntries, totalEntries, entryMetadata);
		}
	}
}

function addFileSystemHandle(zipEntry, handle, options) {
	return addFile(zipEntry, handle, []);

	async function addFile(parentEntry, handle, addedEntries, parentName = "") {
		if (handle) {
			const entryName = parentName ? parentName + "/" + handle.name : handle.name;
			try {
				if (handle.isFile || handle.isDirectory) {
					handle = await transformToFileSystemhandle(handle);
				}
				if (handle.kind == "file") {
					const file = await handle.getFile();
					addedEntries.push(
						addChild(parentEntry, file.name, {
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
					const directoryEntry = parentEntry.addDirectory(handle.name, options);
					addedEntries.push(directoryEntry);
					for await (const childHandle of handle.values()) {
						await addFile(directoryEntry, childHandle, addedEntries, entryName);
					}
				}
			} catch (error) {
				try {
					if (error.entryName === UNDEFINED_VALUE) {
						error.entryName = entryName;
					}
				} catch {
					// ignored
				}
				throw error;
			}
		}
		return addedEntries;
	}
}

async function exportFileSystemHandle(zipEntry, directoryHandle, options) {
	const { onstart, onprogress, onend } = options;
	const readerOptions = checkReaderOptions(options.readerOptions);
	const abortController = new AbortController();
	const { signal } = abortController;
	const releaseSignal = forwardAbort(options.signal, abortController);
	const getDataOptions = Object.assign({}, options, readerOptions, {
		signal,
		onstart: UNDEFINED_VALUE,
		onprogress: UNDEFINED_VALUE,
		onend: UNDEFINED_VALUE,
		preventClose: false
	});
	const totalSize = getTotalSize([zipEntry], entry => getExtractedSize(entry, getDataOptions.passThrough));
	const exportedEntryNames = [];
	let exportAborted = false;
	let writtenSize = 0;
	try {
		if (onstart) {
			await callHandler(onstart, totalSize);
		}
		await exportChildren(zipEntry, directoryHandle);
		if (onend) {
			await callHandler(onend, writtenSize);
		}
	} catch (error) {
		try {
			error.exportedEntryNames = exportedEntryNames;
		} catch {
			// ignored
		}
		throw error;
	} finally {
		releaseSignal();
	}
	return directoryHandle;

	function createProgressWritable(writable) {
		const writer = writable.getWriter();
		return new WritableStream({
			async write(chunk) {
				await writer.write(chunk);
				writtenSize += chunk.length;
				if (onprogress) {
					await callHandler(onprogress, writtenSize, totalSize);
				}
			},
			close() {
				return writer.close();
			},
			abort(reason) {
				return writer.abort(reason);
			}
		});
	}

	async function exportChildren(entry, parentHandle) {
		if (options.concurrent) {
			const results = await Promise.allSettled(entry.children.map(child => exportChild(child, parentHandle)));
			const rejectedResults = results.filter(result => result.status == "rejected");
			if (rejectedResults.length) {
				const failedResults = rejectedResults.filter(result => !isExportAborted(result.reason));
				const reportedResults = failedResults.length ? failedResults : rejectedResults;
				throw aggregateEntryErrors(reportedResults.map(result => result.reason));
			}
		} else {
			for (const child of entry.children) {
				await exportChild(child, parentHandle);
			}
		}
	}

	async function exportChild(child, parentHandle) {
		if (signal.aborted) {
			if (exportAborted || isExportAborted(signal.reason)) {
				return;
			}
			throw signal.reason === UNDEFINED_VALUE ? new DOMException(ERR_ABORTED, ABORT_ERROR_NAME) : signal.reason;
		}
		try {
			if (child.directory) {
				const childDirectoryHandle = await parentHandle.getDirectoryHandle(child.name, { create: true });
				await exportChildren(child, childDirectoryHandle);
			} else {
				const fileHandle = await parentHandle.getFileHandle(child.name, { create: true });
				const writable = await fileHandle.createWritable();
				try {
					await child.getData({ writable: createProgressWritable(writable) }, getDataOptions);
				} catch (error) {
					throw exportAborted ? new Error(ERR_ABORT_EXPORT) : error;
				}
				exportedEntryNames.push(child.getRelativeName(zipEntry));
			}
		} catch (error) {
			exportAborted = true;
			abortController.abort(new Error(ERR_ABORT_EXPORT));
			try {
				if (error.entryName === UNDEFINED_VALUE) {
					error.entryName = child.getRelativeName(zipEntry);
					error.entryId = child.id;
				}
			} catch {
				// ignored
			}
			throw error;
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

function collectChildren(directory, recursive) {
	const children = [];
	const pendingDirectories = [directory];
	let directoryIndex = 0;
	while (directoryIndex < pendingDirectories.length) {
		for (const child of pendingDirectories[directoryIndex++].children) {
			children.push(child);
			if (recursive) {
				pendingDirectories.push(child);
			}
		}
	}
	return children;
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