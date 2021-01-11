(function(obj) {

	var model = (function() {
		var fs = new zip.fs.FS(), requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem, URL = obj.webkitURL
				|| obj.mozURL || obj.URL;

		function createTempFile(callback) {
			var tmpFilename = "__tmp__";
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
			exportZip : function(entry, onend, onprogress, onerror) {
				var zipFileEntry;

				function onexport(blob) {
					var blobURL;
					if (requestFileSystem)
						onend(zipFileEntry.toURL(), function() {
						});
					else {
						blobURL = URL.createObjectURL(blob);
						onend(blobURL);
					}
				}

				if (requestFileSystem)
					createTempFile(function(fileEntry) {
						zipFileEntry = fileEntry;
						entry.exportFileEntry(zipFileEntry, onexport, onprogress, onerror);
					});
				else
					entry.exportBlob(onexport, onprogress, onerror);
			},
			importZip : function(blob, targetEntry, onend, onprogress, onerror) {
				targetEntry.importBlob(blob, onend, onprogress, onerror);
			},
			getBlobURL : function(entry, onend, onprogress, onerror) {
				entry.getBlob(zip.getMimeType(entry.filename), function(blob) {
					var blobURL = URL.createObjectURL(blob);
					onend(blobURL, function() {
						URL.revokeObjectURL(blobURL);
					});
				}, onprogress, onerror);
			}
		};
	})();

	(function() {
		var progressExport = document.getElementById("progress-export-zip");
		var tree = document.getElementById("tree");
		var listing = document.getElementById("listing");
		var selectedDir, selectedFile, selectedLabel, selectedLabelValue, selectedDrag, hoveredElement;

		function onerror(message) {
			alert(message);
		}

		function getFileNode(element) {
			return element ? model.getById(element.dataset.fileId) : model.getRoot();
		}

		function getFileElement(element) {
			while (element && !element.dataset.fileId)
				element = element.parentElement;
			return element;
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

		function onexport(isFile) {
			function downloadBlobURL(target, filename) {
				return function(blobURL) {
					var clickEvent = document.createEvent("MouseEvent");
					progressExport.style.opacity = 0.2;
					progressExport.value = 0;
					progressExport.max = 0;
					clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					target.href = blobURL;
					target.download = filename;
					target.dispatchEvent(clickEvent);
					target.href = "";
					target.download = "";
				};
			}

			function onprogress(index, end) {
				progressExport.value = index;
				progressExport.max = end;
			}

			return function(event) {
				var filename, target = event.target, node;
				if (!target.download) {
					node = getFileNode(isFile ? selectedFile : selectedDir);
					filename = prompt("Filename", isFile ? node.name : node.parent ? node.name + ".zip" : "example.zip");
					if (filename) {
						progressExport.style.opacity = 1;
						progressExport.offsetHeight;
						if (isFile)
							model.getBlobURL(node, downloadBlobURL(target, filename), onprogress, onerror);
						else
							model.exportZip(node, downloadBlobURL(target, filename), onprogress, onerror);
						event.preventDefault();
					}
				}
			};
		}

		function onnewDirectory(event) {
			var name = prompt("Directory name");
			if (name) {
				model.addDirectory(name, getFileNode(selectedDir));
				refreshTree();
				if (selectedDir)
					getFileNode(selectedDir).expanded = selectedDir.open = true;
			}
		}

		function selectFile(fileElement) {
			resetSelectedFile();
			resetSelectedLabel(true);
			fileElement.className = "selected";
			fileElement.draggable = true;
			selectedFile = fileElement;
		}

		function selectDirectory(directoryElement) {
			resetSelectedDir();
			resetSelectedLabel(true);
			directoryElement.className = "selected";
			directoryElement.draggable = true;
			selectedDir = directoryElement;
			refreshListing();
		}

		function resetSelectedFile() {
			if (selectedFile) {
				selectedFile.classList.remove("selected");
				selectedFile.draggable = false;
			}
		}

		function resetSelectedDir() {
			if (selectedDir) {
				selectedDir.classList.remove("selected");
				selectedDir.draggable = false;
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

		function refreshTree(node, element) {
			var details, summary, label, newDirectory, exportDirectory;

			if (!node) {
				node = model.getRoot();
				element = tree;
				element.innerHTML = "";
			}
			if (node.directory) {
				details = document.createElement("details");
				summary = document.createElement("summary");
				label = document.createElement("span");
				newDirectory = document.createElement("a");
				exportDirectory = document.createElement("a");
				details.dataset.fileId = node.id;
				details.open = node == model.getRoot() || node.expanded;
				if (selectedDir && selectedDir.dataset.fileId == node.id)
					selectDirectory(details);
				summary.className = "dir-summary";
				if (node.parent)
					label.textContent = node.name;
				else
					label.textContent = "<root>";
				label.className = "dir-label";
				newDirectory.className = "newdir-button button";
				newDirectory.title = "Create a new folder";
				newDirectory.addEventListener("click", onnewDirectory, false);
				exportDirectory.className = "save-button button";
				exportDirectory.title = "Export folder content into a zip file";
				exportDirectory.addEventListener("click", onexport(false), false);
				summary.appendChild(label);
				summary.appendChild(newDirectory);
				summary.appendChild(exportDirectory);
				details.appendChild(summary);
				element.appendChild(details);
			}
			if (!node.parent)
				if (node.children.length == 0) {
					tree.parentElement.classList.add("empty");
					selectDirectory(details);
				} else
					tree.parentElement.classList.remove("empty");
			node.children.sort(function(a, b) {
				return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
			}).forEach(function(child) {
				refreshTree(child, details);
			});
		}

		function refreshListing() {
			var li, label, exportFile, node = getFileNode(selectedDir);
			listing.innerHTML = "";
			node.children.sort(function(a, b) {
				return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
			}).forEach(function(child) {
				if (!child.directory) {
					li = document.createElement("li");
					label = document.createElement("span");
					exportFile = document.createElement("a");
					li.dataset.fileId = child.id;
					if (selectedFile && selectedFile.dataset.fileId == child.id)
						selectFile(li);
					label.className = "file-label";
					label.textContent = child.name;
					exportFile.className = "save-button button";
					exportFile.title = "Export this file";
					exportFile.addEventListener("click", onexport(true), false);
					li.appendChild(label);
					li.appendChild(exportFile);
					listing.appendChild(li);
				}
			});
		}

		listing.addEventListener("click", function(event) {
			var target = event.target, li;
			if (target.className == "file-label") {
				li = target.parentElement;
				if (!li.classList.contains("selected"))
					selectFile(target.parentElement);
				else {
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
				refreshListing();
		}, false);

		tree.addEventListener("click", function(event) {
			var target = event.target, details, node, selectedNode;

			if (target.className == "dir-label") {
				details = target.parentElement.parentElement;
				if (!details.classList.contains("selected"))
					selectDirectory(details);
				else if (getFileNode(selectedDir).parent) {
					details.draggable = false;
					editName(target, selectedDir, function(state) {
						if (state == "deleted") {
							resetSelectedDir();
							selectDirectory(details.parentElement);
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
				refreshTree();
				refreshListing();
			}
		}, false);

		tree.addEventListener('drop', function(event) {
			var targetNode, srcNode, file, target = getFileElement(event.target);
			if (target) {
				targetNode = getFileNode(target);
				if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
					file = event.dataTransfer.files[0];
					if (file)
						model.importZip(file, targetNode, function() {
							selectDirectory(target);
							expandTree(targetNode);
							refreshTree();
							refreshListing();
						}, null, onerror);
				} else {
					srcNode = getFileNode(selectedDrag);
					if (targetNode != srcNode && targetNode != srcNode.parent && !targetNode.isDescendantOf(srcNode)) {
						srcNode.moveTo(targetNode);
						targetNode.expanded = target.open = true;
						refreshTree();
						refreshListing();
					} else
						hoveredElement.classList.remove("drag-over");
				}
			}
			stopEvent(event);
		}, false);
		tree.addEventListener('dragover', function(event) {
			if (hoveredElement)
				hoveredElement.classList.remove("drag-over");
			hoveredElement = getFileElement(event.target);
			if (hoveredElement)
				hoveredElement.classList.add("drag-over");
			stopEvent(event);
		}, false);
		tree.addEventListener('dragstart', function(event) {
			event.dataTransfer.effectAllowed = 'copy';
			event.dataTransfer.setData('Text', "");
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
		listing.addEventListener('dragover', stopEvent, false);
		listing.addEventListener('dragstart', function(event) {
			event.dataTransfer.effectAllowed = 'copy';
			event.dataTransfer.setData('Text', "");
			if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length)
				selectedDrag = selectedFile;
		}, false);

		progressExport.style.opacity = 0.2;
		expandTree();
		refreshTree();
	})();

})(this);
