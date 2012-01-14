(function(obj) {

	var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;

	function onerror(message) {
		alert(message);
	}

	function createTempFile(callback) {
		var tmpFilename = "__tmp__.zip";
		requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
			function create() {
				filesystem.root.getFile(tmpFilename, {
					create : true
				}, function(zipFile) {
					callback(zipFile);
				});
			}

			filesystem.root.getFile(tmpFilename, null, function(entry) {
				entry.remove(create, create);
			}, create);
		});
	}

	var model = (function() {
		var zipFileEntry, root, nodes = [], URL = obj.webkitURL || obj.mozURL || obj.URL;

		function testUnique(node, target) {
			if (!target)
				target = node;
			target.children.forEach(function(child) {
				if (child.name == node.name)
					throw "Filename error";
			});
		}

		function Node(name, blob, size, parent) {
			this.name = name;
			this.children = [];
			testUnique(this);
			this.parent = parent;
			this.blob = blob;
			this.size = size || 0;
			this.id = nodes.length;
			nodes.push(this);
			if (parent)
				this.parent.children.push(this);
		}

		function detachNode(node) {
			var children = node.parent.children;
			children.forEach(function(child, index) {
				if (child.id == node.id)
					children.splice(index, 1);
			});
		}

		Node.prototype = {
			remove : function() {
				detachNode(this);
				nodes[this.id] = null;
			},
			move : function(target) {
				if (this != target) {
					testUnique(this, target);
					detachNode(this);
					this.parent = target;
					target.children.push(this);
				}
			},
			isDescendantOf : function(parent) {
				var node = this.parent;
				while (node && node.id != parent.id)
					node = node.parent;
				return !!node;
			},
			getFullname : function() {
				var fullname = this.name, node = this.parent;
				while (node) {
					fullname = (node.name ? node.name + "/" : "") + fullname;
					node = node.parent;
				}
				return fullname;
			}
		};

		root = new Node();
		return {
			Node : Node,
			createNode : function(name, blob, size, parent) {
				return new Node(name, blob, size, parent ? parent : root);
			},
			root : root,
			getNode : function(id) {
				return nodes[id];
			},
			getZip : function(onend, onprogress) {
				var zipWriter, maxSize, currentIndex = 0;

				function addNode(child, onend, onprogress) {
					zipWriter.add(child.getFullname(), child.blob ? new zip.BlobReader(child.blob) : null, onend, onprogress, child.blob ? null : {
						directory : true
					});
				}

				var getMaxSize = (function() {
					var size = 0;
					return function(node) {
						if (!node)
							node = root;
						size += node.size;
						node.children.forEach(function(child) {
							getMaxSize(child);
						});
						return size;
					};
				})();

				function processNode(node, callback) {
					var addIndex = 0, child = node.children[addIndex];

					function onaddNode() {
						if (node.children[addIndex])
							processNode(node.children[addIndex], function() {
								var child;
								addIndex++;
								child = node.children[addIndex];
								if (addIndex < node.children.length)
									addNode(child, function() {
										currentIndex += child.size;
										onaddNode();
									}, function(index) {
										if (onprogress)
											onprogress(currentIndex + index, maxSize);
									});
								else
									callback();
							});
					}

					if (child)
						addNode(child, function() {
							currentIndex += child.size;
							onaddNode();
						}, function(index) {
							if (onprogress)
								onprogress(currentIndex + index, maxSize);
						});
					else
						callback();
				}

				function process(blobWriter) {
					zip.createWriter(blobWriter, function(writer) {
						zipWriter = writer;
						maxSize = getMaxSize();
						processNode(root, function() {
							zipWriter.close(function(blob) {
								if (zipFileEntry)
									onend(zipFileEntry.toURL());
								else
									onend(URL.createObjectURL(blob));
							});
						});
					}, onerror);
				}

				if (requestFileSystem)
					createTempFile(function(fileEntry) {
						zipFileEntry = fileEntry;
						process(new zip.FileWriter(zipFileEntry));
					});
				else
					process(new zip.BlobWriter());
			}
		};
	})();

	(function() {
		var newDirInput = document.getElementById("new-directory");
		var getZipInput = document.getElementById("get-zip");
		var progressZipInput = document.getElementById("progress-zip");
		var filenameInput = document.getElementById("zip-filename");
		var tree = document.getElementById("tree");
		var listing = document.getElementById("listing");
		var selectedDir, selectedFile, selectedLabel, selectedLabelValue, selectedDrag, hoveredElement;

		function getFileNode(element) {
			return element ? model.getNode(element.dataset.fileId) : model.root;
		}

		function stopEvent(event) {
			event.stopPropagation();
			event.preventDefault();
		}

		function refreshTree(node, element) {
			var details, summary, label;

			if (!node) {
				node = model.root;
				element = tree;
				element.innerHTML = "";
			}
			if (!node.blob) {
				details = document.createElement("details");
				summary = document.createElement("summary");
				label = document.createElement("span");
				details.dataset.fileId = node.id;
				details.open = node == model.root || node.expanded;
				if (selectedDir && selectedDir.dataset.fileId == node.id) {
					details.className = "selected";
					details.draggable = true;
					selectedDir = details;
				}
				summary.className = "dir-summary";
				label.textContent = node.name || "";
				label.className = "dir-label";
				summary.appendChild(label);
				details.appendChild(summary);
				element.appendChild(details);
			}
			node.children.sort(function(a, b) {
				return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
			}).forEach(function(child) {
				refreshTree(child, details);
			});
		}

		function refreshListing() {
			var li, label, node = getFileNode(selectedDir);
			listing.innerHTML = "";
			node.children.sort(function(a, b) {
				return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
			}).forEach(function(child) {
				if (child.blob) {
					li = document.createElement("li");
					li.dataset.fileId = child.id;
					if (selectedFile && selectedFile.dataset.fileId == child.id) {
						li.className = "selected";
						li.draggable = true;
						selectedFile = li;
					}
					label = document.createElement("span");
					label.className = "file-label";
					label.textContent = child.name;
					li.appendChild(label);
					listing.appendChild(li);
				}
			});
		}

		function resetSelectedFile() {
			if (selectedFile) {
				selectedFile.className = "";
				selectedFile.draggable = false;
				selectedFile = null;
			}
		}

		function resetSelectedDir() {
			if (selectedDir) {
				selectedDir.className = "";
				selectedDir.draggable = false;
				selectedDir = null;
				resetSelectedFile();
			}
		}

		function resetSelectedLabel(resetValue) {
			if (selectedLabel) {
				selectedLabel.contentEditable = false;
				selectedLabel.blur();
				if (resetValue)
					selectedLabel.textContent = selectedLabelValue;
				selectedLabel = null;
			}
		}

		function editName(labelElement, nodeElement, callback) {
			var node = getFileNode(nodeElement);
			labelElement.addEventListener("keydown", function(event) {
				var cancel = event.keyIdentifier == "U+001B";
				if (event.keyIdentifier == "Enter" || cancel) {
					if (labelElement.textContent) {
						resetSelectedLabel(cancel);
						node.name = labelElement.textContent;
					} else {
						node.remove();
						callback("deleted");
					}
					event.preventDefault();
					callback(cancel ? "canceled" : "");
				}
			}, true);
			labelElement.contentEditable = true;
			labelElement.focus();
			selectedLabel = labelElement;
			selectedLabelValue = labelElement.textContent;
		}

		function getFileElement(element) {
			while (element && !element.dataset.fileId)
				element = element.parentElement;
			return element;
		}

		listing.addEventListener("click", function(event) {
			var target = event.target, li;
			if (target.className == "file-label") {
				li = target.parentElement;
				if (li.className != "selected") {
					resetSelectedFile();
					resetSelectedLabel(true);
					selectedFile = li;
					li.className = "selected";
					li.draggable = true;
				} else {
					li.draggable = false;
					editName(target, selectedFile, function(state) {
						if (state == "deleted")
							resetSelectedFile();
						if (state == "canceled" || state == "deleted")
							refreshListing();
					});
				}
				event.preventDefault();
			} else
				resetSelectedFile();
		}, false);

		tree.addEventListener("click", function(event) {
			var target = event.target, details, node, selectedNode;

			if (target.className == "dir-label") {
				details = target.parentElement.parentElement;
				if (details.className != "selected") {
					resetSelectedDir();
					resetSelectedLabel(true);
					selectedDir = details;
					refreshListing();
					details.className = "selected";
					details.draggable = true;
				} else {
					details.draggable = false;
					editName(target, selectedDir, function(state) {
						if (state == "deleted") {
							resetSelectedDir();
							refreshTree();
							refreshListing();
						} else if (state == "canceled")
							refreshTree();
					});
				}
				event.preventDefault();
			} else if (target.className == "dir-summary") {
				node = getFileNode(target.parentElement);
				node.expanded = !node.expanded;
				if (selectedDir) {
					selectedNode = getFileNode(selectedDir);
					if (selectedNode.isDescendantOf(node))
						resetSelectedDir();
				}
			} else {
				resetSelectedDir();
				refreshListing();
			}
		}, false);

		tree.addEventListener('drop', function(event) {
			var targetNode, srcNode, target = getFileElement(event.target);
			if (target) {
				targetNode = getFileNode(target);
				srcNode = getFileNode(selectedDrag);
				if (targetNode != srcNode && targetNode != srcNode.parent && !targetNode.isDescendantOf(srcNode)) {
					srcNode.move(targetNode);
					targetNode.expanded = target.open = true;
					refreshTree();
					refreshListing();
				} else
					hoveredElement.classList.remove("drag-over");
			}
			stopEvent(event);
		}, false);
		tree.addEventListener('dragenter', stopEvent, false);
		tree.addEventListener('dragover', function(event) {
			if (hoveredElement)
				hoveredElement.classList.remove("drag-over");
			hoveredElement = getFileElement(event.target);
			if (hoveredElement)
				hoveredElement.classList.add("drag-over");
			stopEvent(event);
		}, false);
		tree.addEventListener('dragleave', stopEvent, false);
		tree.addEventListener('dragstart', function(event) {
			selectedDrag = selectedDir;
		}, false);

		listing.addEventListener('drop', function(event) {
			if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
				Array.prototype.forEach.call(event.dataTransfer.files, function(file) {
					model.createNode(file.name, file, file.size, getFileNode(selectedDir));
				});
				refreshListing();
			}
			stopEvent(event);
		}, false);
		listing.addEventListener('dragenter', stopEvent, false);
		listing.addEventListener('dragover', stopEvent, false);
		listing.addEventListener('dragleave', stopEvent, false);
		listing.addEventListener('dragstart', function(event) {
			if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length)
				selectedDrag = selectedFile;
		}, false);

		newDirInput.addEventListener("click", function(event) {
			var name = prompt("Directory name");
			if (name) {
				model.createNode(name, null, 0, getFileNode(selectedDir));
				refreshTree();
				if (selectedDir)
					getFileNode(selectedDir).expanded = selectedDir.open = true;
			}
		}, false);

		progressZipInput.style.opacity = 0.2;
		getZipInput.addEventListener("click", function(event) {
			if (!getZipInput.download) {
				progressZipInput.style.opacity = 1;
				progressZipInput.offsetHeight;
				model.getZip(function(URL) {
					var clickEvent = document.createEvent("MouseEvent");
					progressZipInput.style.opacity = 0.2;
					progressZipInput.value = 0;
					progressZipInput.max = 0;
					clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					getZipInput.href = URL;
					getZipInput.download = filenameInput.value;
					getZipInput.dispatchEvent(clickEvent);
				}, function(index, end) {
					progressZipInput.value = index;
					progressZipInput.max = end;
				});
				event.preventDefault();
			}
		}, false);

		refreshTree();
	})();

})(this);
