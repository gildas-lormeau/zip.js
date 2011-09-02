(function(obj) {

	var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;

	var model, view, controller;

	function onerror(message) {
		console.error(message);
	}

	function createFile(filesystem, filename, callback) {
		var rootReader = filesystem.root.createReader("/");

		function create() {
			filesystem.root.getFile(filename, {
				create : true
			}, function(zipFile) {
				callback(zipFile);
			});
		}

		rootReader.readEntries(function(entries) {
			var entryIndex = 0;

			function removeNextEntry() {
				function next() {
					entryIndex++;
					removeNextEntry();
				}

				if (entryIndex < entries.length)
					entries[entryIndex].remove(next, next);
				else
					create();
			}

			removeNextEntry();
		}, create);
	}

	model = (function() {
		var zipper, outputFile, filename;

		return {
			setZipFilename : function(name) {
				filename = name;
			},
			addFiles : function addFiles(files, oninit, onaddFiles, onaddFile, onprogressFile) {
				var addIndex = 0;

				function nextFile() {
					var file = files[addIndex];
					onaddFile(file);
					zipper.add(file.name, file, null, function() {
						addIndex++;
						if (addIndex < files.length)
							nextFile();
						else
							onaddFiles();
					}, onprogressFile, onerror);
				}

				if (outputFile)
					nextFile();
				else
					requestFileSystem(TEMPORARY, 1024 * 1024 * 1024, function(filesystem) {
						createFile(filesystem, filename || "Example.zip", function(zipFile) {
							outputFile = zipFile;
							var resourceWriter = new zip.BlobResourceWriter();
							resourceWriter.init(outputFile, function() {
								zipper = zip.createWriter(resourceWriter);
								oninit();
								addFiles(files, oninit, onaddFiles, onaddFile, onprogressFile);
							}, onerror);							
						});
					});
			},
			getZipURL : function(callback) {
				zipper.close(function() {
					callback(outputFile.toURL());
					zipper = null;
					outputFile = null;
					filename = "";
				}, onerror);
			}
		};
	})();

	controller = {
		setZipFilename : function(filename) {
			model.setZipFilename(filename);
		},
		addFiles : function(files, oninit, onaddFiles, onaddFile, onprogressFile) {
			model.addFiles(files, oninit, onaddFiles, onaddFile, onprogressFile);
		},
		downloadZip : function(ondownloadZip) {
			model.getZipURL(function(URL) {
				location.href = URL;
				setTimeout(ondownloadZip, 500);
			});
		}
	};

	view = (function() {
		var fileInput = document.getElementById("file-input");
		var zipProgress = document.createElement("progress");
		var downloadButton = document.getElementById("download-button");
		var fileList = document.getElementById("file-list");
		var filenameInput = document.getElementById("filename-input");
		fileInput.addEventListener('change', function(event) {
			fileInput.disabled = true;
			downloadButton.disabled = true;
			view.onFileInputChange(fileInput);
		}, false);
		filenameInput.addEventListener('change', function(event) {
			view.onFilenameInputChange(filenameInput);
		}, false);
		downloadButton.addEventListener('click', function(event) {
			downloadButton.disabled = true;
			view.onDownloadZip();
			return false;
		}, false);
		return {
			initZip : function() {
				filenameInput.disabled = true;
			},
			addFiles : function() {
				if (zipProgress.parentNode)
					zipProgress.parentNode.removeChild(zipProgress);
				fileInput.value = "";
				fileInput.disabled = false;
				downloadButton.disabled = false;
			},
			addFile : function(file) {
				var li = document.createElement("li");
				zipProgress.value = 0;
				zipProgress.max = 0;
				li.innerText = file.name;
				li.appendChild(zipProgress);
				fileList.appendChild(li);
			},
			progressFile : function(current, total) {
				zipProgress.value = current;
				zipProgress.max = total;
			},
			downloadZip : function() {
				downloadButton.disabled = false;
				filenameInput.disabled = false;
				fileList.innerHTML = "";
			}
		};
	})();

	view.onFilenameInputChange = function(filenameInput) {
		controller.setZipFilename(filenameInput.value);
	};
	view.onFileInputChange = function(fileInput) {
		controller.addFiles(fileInput.files, view.initZip, view.addFiles, view.addFile, view.progressFile);
	};
	view.onDownloadZip = function() {
		controller.downloadZip(view.downloadZip);
	};

})(this);