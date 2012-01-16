/*
 * Copyright 2012 Gildas Lormeau
 * contact: gildas.lormeau <at> gmail.com
 */

(function(obj) {

	var zipFileEntry, root, entries = [];

	function testUniqueName(entryName, parent) {
		var index;
		if (!parent)
			parent = root;
		for (index = 0; index < parent.children.length; index++)
			if (parent.children[index].name == entryName)
				return false;
		return true;
	}

	function detach(entry) {
		var children = entry.parent.children;
		children.forEach(function(child, index) {
			if (child.id == entry.id)
				children.splice(index, 1);
		});
	}

	var getTotalSize = (function() {
		var size = 0;
		return function(entry) {
			if (!entry)
				entry = root;
			size += entry.size;
			entry.children.forEach(function(child) {
				getTotalSize(child);
			});
			return size;
		};
	})();

	function ZipEntry(name, blob, parent) {
		this.name = name;
		this.children = [];
		if (root && !testUniqueName(this.name, parent))
			throw "Entry already exists.";
		this.parent = parent;
		if (blob) {
			this.blob = blob;
			this.size = blob.size;
		} else {
			this.directory = true;
			this.size = 0;
		}
		this.id = entries.length;
		entries.push(this);
		if (parent)
			this.parent.children.push(this);
	}

	function importNext(entries, callback, onprogress, totalSize, currentIndex, entryIndex) {
		var pathIndex, path, entry, parent = root;

		function ongetData(blob) {
			var path = entry.filename.split("/"), name = path.pop();
			currentIndex += blob.size;
			new ZipEntry(name, blob, obj.zip.fs.find(path.join("/")) || root);
			importNext(entries, callback, onprogress, totalSize, currentIndex, entryIndex + 1);
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
			obj.zip.fs.root = root;
			callback();
		} else {
			path = entry.filename.split("/");
			path.pop();
			for (pathIndex = 0; pathIndex < path.length; pathIndex++)
				parent = parent.getChildByName(path[pathIndex]) || new ZipEntry(path[pathIndex], null, parent);
			if (entry.directory || entry.filename.charAt(entry.filename.length - 1) == "/")
				importNext(entries, callback, onprogress, totalSize, currentIndex, entryIndex + 1);
			else
				entry.getData(new obj.zip.BlobWriter(), ongetData, ongetDataProgress);
		}
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

	ZipEntry.prototype = {
		move : function(target) {
			if (this != target) {
				if (!testUniqueName(this.name, target))
					throw "Entry already exists.";
				detach(this);
				this.parent = target;
				target.children.push(this);
			}
		},
		getChildByName : function(name) {
			var childIndex, child;
			for (childIndex = 0; childIndex < this.children.length; childIndex++) {
				child = this.children[childIndex];
				if (child.name == name)
					return child;
			}
		},
		getFullname : function() {
			var fullname = this.name, entry = this.parent;
			while (entry) {
				fullname = (entry.name ? entry.name + "/" : "") + fullname;
				entry = entry.parent;
			}
			return fullname;
		}
	};

	root = new ZipEntry();

	obj.zip.fs = {
		ZipEntry : ZipEntry,
		root : root,
		add : function(filename, blob, parent) {
			if (!parent)
				parent = root;
			if (parent.directory)
				return new ZipEntry(filename, blob, parent);
			else
				throw "Parent entry is not a directory.";
		},
		remove : function(entry) {
			detach(entry);
			entries[entry.id] = null;
		},
		find : function(fullname) {
			var index, path = fullname.split("/"), node = root;
			for (index = 0; node && index < path.length; index++)
				node = node.getChildByName(path[index]);
			return node;
		},
		getById : function(id) {
			return entries[id];
		},
		importZip : function(blobReader, onend, onprogress, onerror) {
			var that = this;
			entries = [];
			root = new ZipEntry();
			obj.zip.createReader(blobReader, function(zipReader) {
				zipReader.getEntries(function(entries) {
					importNext(entries, onend, onprogress, blobReader.size);
				});
			}, onerror);
		},
		exportZip : function(blobWriter, onend, onprogress, onerror) {
			obj.zip.createWriter(blobWriter, function(writer) {
				exportNext(writer, root, function() {
					writer.close(onend);
				}, onprogress, getTotalSize());
			}, onerror);
		}
	};

})(this);
