/*
 * Copyright 2012 Gildas Lormeau
 * contact: gildas.lormeau <at> gmail.com
 */

(function(obj) {

	var getTotalSize = (function() {
		var size = 0;
		return function(entry) {
			size += entry.size;
			entry.children.forEach(function(child) {
				getTotalSize(child);
			});
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

	function exportNext(zipWriter, entry, callback, onprogress, totalSize, currentIndex) {
		var childIndex = 0, child = entry.children[childIndex];

		function addNode(child, onend, onprogress) {
			zipWriter.add(child.getFullname(), child.directory ? null : new obj.zip.BlobReader(child.blob), onend, onprogress, {
				directory : child.directory
			});
		}

		function onaddNode() {
			currentIndex += child.size;
			if (entry.children[childIndex])
				exportNext(zipWriter, entry.children[childIndex], onexportNext, onprogress, totalSize, currentIndex);
		}

		function onaddNodeProgress(index) {
			if (onprogress)
				onprogress(currentIndex + index, totalSize);
		}

		function onexportNext() {
			var child;
			childIndex++;
			child = entry.children[childIndex];
			if (childIndex < entry.children.length)
				addNode(child, onaddNode, onaddNodeProgress);
			else
				callback();
		}

		if (!currentIndex)
			currentIndex = 0;
		if (child)
			addNode(child, onaddNode, onaddNodeProgress);
		else
			callback();
	}

	function importNext(fs, entries, callback, onprogress, totalSize, currentIndex, entryIndex) {
		var pathIndex, path, entry, parent = fs.root;

		function ongetData(blob) {
			var path = entry.filename.split("/"), name = path.pop();
			currentIndex += blob.size;
			new ZipEntry(fs, name, blob, fs.find(path.join("/")) || fs.root);
			importNext(fs, entries, callback, onprogress, totalSize, currentIndex, entryIndex + 1);
		}

		function ongetDataProgress(index) {
			if (onprogress)
				onprogress(currentIndex + index, totalSize);
		}

		if (!currentIndex)
			currentIndex = 0;
		if (!entryIndex)
			entryIndex = 0;
		entry = entries[entryIndex];
		if (entryIndex == entries.length) {
			callback();
		} else {
			path = entry.filename.split("/");
			path.pop();
			for (pathIndex = 0; pathIndex < path.length; pathIndex++)
				parent = parent.getChildByName(path[pathIndex]) || new ZipEntry(fs, path[pathIndex], null, parent);
			if (entry.directory || entry.filename.charAt(entry.filename.length - 1) == "/")
				importNext(fs, entries, callback, onprogress, totalSize, currentIndex, entryIndex + 1);
			else
				entry.getData(new obj.zip.BlobWriter(), ongetData, ongetDataProgress);
		}
	}

	function ZipEntry(fs, name, blob, parent) {
		var that = this;
		that.fs = fs;
		that.name = name;
		that.children = [];
		if (fs.root && parent && parent.getChildByName(that.name))
			throw "Entry filename already exists.";
		that.parent = parent;
		if (blob) {
			that.blob = blob;
			that.size = blob.size;
		} else {
			that.directory = true;
			that.size = 0;
		}
		that.id = fs.entries.length;
		fs.entries.push(that);
		if (parent)
			that.parent.children.push(that);
	}

	function FS() {
		var that = this;
		that.entries = [];
		that.root = new ZipEntry(that);
	}

	ZipEntry.prototype = {
		addChild : function(filename, blob) {
			var that = this;
			if (that.directory)
				return new that.constructor(that.fs, filename, blob, that);
			else
				throw "Parent entry is not a directory.";
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
		importZip : function(blobReader, onend, onprogress, onerror) {
			var that = this;
			that.entries = [];
			that.root = new ZipEntry(that);
			obj.zip.createReader(blobReader, function(zipReader) {
				zipReader.getEntries(function(entries) {
					importNext(that, entries, onend, onprogress, blobReader.size);
				});
			}, onerror);
		},
		exportZip : function(blobWriter, onend, onprogress, onerror) {
			var root = this.root;
			obj.zip.createWriter(blobWriter, function(writer) {
				exportNext(writer, root, function() {
					writer.close(onend);
				}, onprogress, getTotalSize(root));
			}, onerror);
		}
	};

	obj.zip.FS = FS;

})(this);
