/*
 * Copyright 2012 Gildas Lormeau
 * contact: gildas.lormeau <at> gmail.com
 */

(function(obj) {

	var getTotalSize = (function() {
		var size = 0;
		return function(entry) {
			size += entry.size || 0;
			entry.children.forEach(getTotalSize);
			return size;
		};
	})();

	function detach(entry) {
		var children = entry.parent.children;
		children.forEach(function(child, index) {
			if (child.id == entry.id)
				children.splice(index, 1);
		});
	}

	var exportNext = (function() {
		var currentIndex = 0;

		return function process(zipWriter, entry, callback, onprogress, totalSize) {
			var childIndex = 0;

			function addChild(child) {
				function add(data) {
					zipWriter.add(child.getFullname(), child.directory ? null : new child.file.Reader(data), function() {
						currentIndex += child.size;
						process(zipWriter, child, function() {
							childIndex++;
							exportChild();
						}, onprogress, totalSize);
					}, function(index) {
						if (onprogress)
							onprogress(currentIndex + index, totalSize);
					}, {
						directory : child.directory
					});
				}

				if (child.directory)
					add();
				else
					child.file.getData(child.file.Writer ? new child.file.Writer() : null, add);
			}

			function exportChild() {
				var child = entry.children[childIndex];
				if (child)
					addChild(child);
				else
					callback();
			}

			exportChild();
		};
	})();

	function Directory(name) {
		this.name = name;
		this.size = 0;
		this.directory = true;
	}

	function File() {
	}
	File.prototype = {
		init : function(name, data, size, dataGetter) {
			var that = this;
			that.name = name;
			that.size = size;
			that.directory = false;
			that.data = data;
			if (!data && dataGetter)
				that.getData = dataGetter;
		},
		getData : function(writer, callback) {
			callback(this.data);
		}
	};

	function FileDeflated(name, entry) {
		this.init(name, null, entry.uncompressedSize, function(writer, callback, onprogress) {
			entry.getData(writer, callback, onprogress);
		});
	}
	FileDeflated.prototype = new File();
	FileDeflated.prototype.Reader = obj.zip.BlobReader;
	FileDeflated.prototype.Writer = obj.zip.BlobWriter;

	function FileBlob(name, blob, size, blobGetter) {
		this.init(name, blob, size == null && blob ? blob.size : size, blobGetter);
	}
	FileBlob.prototype = new File();
	FileBlob.prototype.Reader = obj.zip.BlobReader;

	function FileData64URI(name, dataURI, size, dataURIGetter) {
		this.init(name, dataURI, size == null && dataURI ? Math.floor(dataURI.split(',')[1].replace(/=/g, '').length * .75) : size, dataURIGetter);
	}
	FileData64URI.prototype = new File();
	FileData64URI.prototype.Reader = obj.zip.Data64URIReader;

	function FileText(name, text, size, textGetter) {
		this.init(name, text, size == null && text ? text.length : size, textGetter);
	}
	FileText.prototype = new File();
	FileText.prototype.Reader = obj.zip.TextReader;

	function FileHTTP(name, URL, size) {
		this.init(name, URL, size);
	}
	FileHTTP.prototype = new File();
	FileHTTP.prototype.Reader = obj.zip.HttpReader;

	function FileHTTPRange(name, URL, size) {
		this.init(name, URL, size);
	}
	FileHTTPRange.prototype = new File();
	FileHTTPRange.prototype.Reader = obj.zip.HttpRangeReader;

	function addChild(entry, file) {
		if (entry.directory)
			return new entry.constructor(entry.fs, file, entry);
		else
			throw "Parent entry is not a directory.";
	}

	function ZipEntry(fs, file, parent) {
		var that = this;
		that.fs = fs;
		that.file = file;
		that.name = file.name;
		that.children = [];
		if (fs.root && parent && parent.getChildByName(file.name))
			throw "Entry filename already exists.";
		that.parent = parent;
		that.directory = file.directory;
		that.size = file.size;
		that.id = fs.entries.length;
		fs.entries.push(that);
		if (parent)
			that.parent.children.push(that);
	}
	ZipEntry.prototype = {
		addDirectory : function(name) {
			return addChild(this, new Directory(name));
		},
		addText : function(name, text, size, textGetter) {
			return addChild(this, new FileText(name, text, size, textGetter));
		},
		addBlob : function(name, blob, size, blobGetter) {
			return addChild(this, new FileBlob(name, blob, size, blobGetter));
		},
		addData64URI : function(name, dataURI, size, dataURIGetter) {
			return addChild(this, new FileData64URI(name, dataURI, size, dataURIGetter));
		},
		addHTTPContent : function(name, URL, size, useRangeHeader) {
			return addChild(this, useRangeHeader ? new FileHTTPRange(name, URL, size) : new FileHTTP(name, URL, size));
		},
		addData : function(name, data, size, dataReader, dataGetter) {
			var file;

			function FileData() {
			}

			FileData.prototype = new File();
			FileData.prototype.Reader = dataReader;
			file = new FileData(name, content, size);
			file.init(name, content, size, dataGetter);
			return addChild(this, file);
		},
		moveTo : function(target) {
			var that = this;
			if (target.directory) {
				if (!target.isDescendantOf(that)) {
					if (that != target) {
						if (target.getChildByName(that.name))
							throw "Entry filename already exists.";
						detach(that);
						that.parent = target;
						target.children.push(that);
					}
				} else
					throw "Entry is a ancestor of target entry.";
			} else
				throw "Target entry is not a directory.";
		},
		getChildByName : function(name) {
			var childIndex, child, that = this;
			for (childIndex = 0; childIndex < that.children.length; childIndex++) {
				child = that.children[childIndex];
				if (child.name == name)
					return child;
			}
		},
		getFullname : function() {
			var that = this, fullname = that.name, entry = that.parent;
			while (entry) {
				fullname = (entry.name ? entry.name + "/" : "") + fullname;
				entry = entry.parent;
			}
			return fullname;
		},
		isDescendantOf : function(ancestor) {
			var entry = this.parent;
			while (entry && entry.id != ancestor.id)
				entry = entry.parent;
			return !!entry;
		}
	};
	ZipEntry.prototype.constructor = ZipEntry;

	function FS() {
		var that = this;
		that.entries = [];
		that.root = new ZipEntry(that, new Directory());
	}
	FS.prototype = {
		remove : function(entry) {
			detach(entry);
			this.entries[entry.id] = null;
		},
		find : function(fullname) {
			var index, path = fullname.split("/"), node = this.root;
			for (index = 0; node && index < path.length; index++)
				node = node.getChildByName(path[index]);
			return node;
		},
		getById : function(id) {
			return this.entries[id];
		},
		importBlob : function(blob, onend, onprogress, onerror) {
			this.importZip(new zip.BlobReader(blob), onend, onprogress, onerror);
		},
		importText : function(text, onend, onprogress, onerror) {
			this.importZip(new zip.TextReader(text), onend, onprogress, onerror);
		},
		importData64URI : function(dataURI, onend, onprogress, onerror) {
			this.importZip(new zip.Data64URIReader(dataURI), onend, onprogress, onerror);
		},
		importHTTPContent : function(URL, useRangeHeader, onend, onprogress, onerror) {
			this.importZip(useRangeHeader ? new zip.HTTPRangeReader(URL) : new zip.HTTPReader(URL), onend, onprogress, onerror);
		},
		exportBlob : function(onend, onprogress, onerror) {
			this.exportZip(new zip.BlobWriter(), onend, onprogress, onerror);
		},
		exportText : function(onend, onprogress, onerror) {
			this.exportZip(new zip.TextWriter(), onend, onprogress, onerror);
		},
		exportFile : function(fileEntry, onend, onprogress, onerror) {
			this.exportZip(new zip.FileWriter(fileEntry), onend, onprogress, onerror);
		},
		exportData64URI : function(mimeType, onend, onprogress, onerror) {
			this.exportZip(new zip.Data64URIWriter(mimeType), onend, onprogress, onerror);
		},
		importZip : function(reader, onend, onprogress, onerror) {
			var that = this;
			that.entries = [];
			that.root = new ZipEntry(that, new Directory());
			obj.zip.createReader(reader, function(zipReader) {
				zipReader.getEntries(function(entries) {
					entries.forEach(function(entry) {
						var parent = that.root, path = entry.filename.split("/"), name = path.pop();
						path.forEach(function(pathPart) {
							parent = parent.getChildByName(pathPart) || new ZipEntry(that, new Directory(pathPart), parent);
						});
						if (!entry.directory && entry.filename.charAt(entry.filename.length - 1) != "/")
							addChild(parent, new FileDeflated(name, entry));
					});
					onend();
				});
			}, onerror);
		},
		exportZip : function(writer, onend, onprogress, onerror) {
			var that = this, size = getTotalSize(that.root);
			obj.zip.createWriter(writer, function(zipWriter) {
				exportNext(zipWriter, that.root, function() {
					zipWriter.close(onend);
				}, onprogress, size);
			}, onerror);
		}
	};

	obj.zip.fs = {
		FS : FS
	};

})(this);
