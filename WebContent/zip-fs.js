/*
 * Copyright 2012 Gildas Lormeau
 * contact: gildas.lormeau <at> gmail.com
 */

(function(obj) {

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
			size += entry.size;
			entry.children.forEach(function(child) {
				getTotalSize(child);
			});
			return size;
		};
	})();

	var ZipEntryProto = {
		addChild : function(filename, blob) {
			var that = this;
			if (that.directory)
				return new that.constructor(filename, blob, that);
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

	function FS() {
		var root, that = this, entries = [];

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

		function importNext(entries, callback, onprogress, totalSize, currentIndex, entryIndex) {
			var pathIndex, path, entry, parent = root;

			function ongetData(blob) {
				var path = entry.filename.split("/"), name = path.pop();
				currentIndex += blob.size;
				new ZipEntry(name, blob, that.find(path.join("/")) || root);
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
				that.root = root;
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

		function ZipEntry(name, blob, parent) {
			var that = this;
			that.name = name;
			that.children = [];
			if (root && parent && parent.getChildByName(that.name))
				throw "Entry filename already exists.";
			that.parent = parent;
			if (blob) {
				that.blob = blob;
				that.size = blob.size;
			} else {
				that.directory = true;
				that.size = 0;
			}
			that.id = entries.length;
			entries.push(that);
			if (parent)
				that.parent.children.push(that);
		}

		ZipEntry.prototype = ZipEntryProto;
		ZipEntry.prototype.constructor = ZipEntry;
		that.root = root = new ZipEntry();
		that.remove = function(entry) {
			detach(entry);
			entries[entry.id] = null;
		};
		that.find = function(fullname) {
			var index, path = fullname.split("/"), node = root;
			for (index = 0; node && index < path.length; index++)
				node = node.getChildByName(path[index]);
			return node;
		};
		that.getById = function(id) {
			return entries[id];
		};
		that.importZip = function(blobReader, onend, onprogress, onerror) {
			entries = [];
			root = new ZipEntry();
			obj.zip.createReader(blobReader, function(zipReader) {
				zipReader.getEntries(function(entries) {
					importNext(entries, onend, onprogress, blobReader.size);
				});
			}, onerror);
		};
		that.exportZip = function(blobWriter, onend, onprogress, onerror) {
			obj.zip.createWriter(blobWriter, function(writer) {
				exportNext(writer, root, function() {
					writer.close(onend);
				}, onprogress, getTotalSize(root));
			}, onerror);
		};
	}

	obj.zip.FS = FS;

})(this);
