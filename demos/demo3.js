(function(obj) {

	var model = (function() {
		var fs = new zip.fs.FS(), requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem, URL = obj.webkitURL
				|| obj.mozURL || obj.URL;

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

		return {
			addDirectory : function(name, parent) {
				parent.addDirectory(name);
			},
			addFile : function(name, blob, parent) {
				parent.addBlob(name, blob);
			},
			getRoot : function() {
				return fs.root;
			},
			getById : function(id) {
				return fs.getById(id);
			},
			remove : function(entry) {
				fs.remove(entry);
			},
			rename : function(entry, name) {
				entry.name = name;
			},
			exportZip : function(onend, onprogress, onerror) {
				var zipFileEntry;

				function onexport(blob) {
					if (requestFileSystem)
						onend(zipFileEntry.toURL());
					else
						onend(URL.createObjectURL(blob));
				}

				if (requestFileSystem)
					createTempFile(function(fileEntry) {
						zipFileEntry = fileEntry;
						fs.exportFile(zipFileEntry, onexport, onprogress, onerror);
					});
				else
					fs.exportBlob(onexport, onprogress, onerror);
			},
			importZip : function(blob, onend, onprogress, onerror) {
				fs.importBlob(blob, onend, onprogress, onerror);
			}
		};
	})();

	(function() {
		var newDirectory = document.getElementById("new-directory");
		var exportZip = document.getElementById("export-zip");
		var importZip = document.getElementById("import-zip");
		var progressExport = document.getElementById("progress-export-zip");
		var progressImport = document.getElementById("progress-import-zip");
		var filenameInput = document.getElementById("zip-filename");
		var tree = document.getElementById("tree");
		var listing = document.getElementById("listing");
		var selectedDir, selectedFile, selectedLabel, selectedLabelValue, selectedDrag, hoveredElement;

		function onerror(message) {
			alert(message);
		}

		function getFileNode(element) {
			return element ? model.getById(element.dataset.fileId) : model.getRoot();
		}

		function stopEvent(event) {
			event.stopPropagation();
			event.preventDefault();
		}

		function expandTree(node) {
			if (!node)
				node = model.getRoot();
			if (node.directory) {
				node.expanded = true;
				node.children.forEach(function(child) {
					expandTree(child);
				});
			}
		}

		function refreshTree(node, element) {
			var details, summary, label;

			if (!node) {
				node = model.getRoot();
				element = tree;
				element.innerHTML = "";
			}
			if (node.directory) {
				details = document.createElement("details");
				summary = document.createElement("summary");
				label = document.createElement("span");
				details.dataset.fileId = node.id;
				details.open = node == model.getRoot() || node.expanded;
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
				if (!child.directory) {
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
				var cancel = event.keyCode == "27";
				if (event.keyCode == "13" || cancel) {
					if (labelElement.textContent) {
						resetSelectedLabel(cancel);
						model.rename(node, labelElement.textContent);
					} else {
						model.remove(node);
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
					srcNode.moveTo(targetNode);
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
					model.addFile(file.name, file, getFileNode(selectedDir));
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

		newDirectory.addEventListener("click", function(event) {
			var name = prompt("Directory name");
			if (name) {
				model.addDirectory(name, getFileNode(selectedDir));
				refreshTree();
				if (selectedDir)
					getFileNode(selectedDir).expanded = selectedDir.open = true;
			}
		}, false);

		progressImport.style.opacity = 0;
		importZip.addEventListener('change', function(event) {
			var file = importZip.files[0];
			if (file) {
				progressImport.style.opacity = 1;
				progressImport.offsetHeight;
				model.importZip(file, function() {
					progressImport.style.opacity = 0;
					progressImport.value = 0;
					progressImport.max = 0;
					expandTree();
					refreshTree();
					refreshListing();
				}, function(index, end) {
					progressImport.value = index;
					progressImport.max = end;
				}, onerror);
			}
		}, false);

		progressExport.style.opacity = 0.2;
		exportZip.addEventListener("click", function(event) {
			if (!exportZip.download) {
				progressExport.style.opacity = 1;
				progressExport.offsetHeight;
				model.exportZip(function(blobURL) {
					var clickEvent = document.createEvent("MouseEvent");
					progressExport.style.opacity = 0.2;
					progressExport.value = 0;
					progressExport.max = 0;
					clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					exportZip.href = blobURL;
					exportZip.download = filenameInput.value;
					exportZip.dispatchEvent(clickEvent);
				}, function(index, end) {
					progressExport.value = index;
					progressExport.max = end;
				}, onerror);
				event.preventDefault();
			}
		}, false);

		expandTree();
		refreshTree();
	})();

})(this);
