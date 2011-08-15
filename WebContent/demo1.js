(function() {

	var requestFileSystem = requestFileSystem || webkitRequestFileSystem || mozRequestFileSystem;
	var model, view, controller;

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
					var reader = new FileReader(), inputFile = files[addIndex];
					reader.onload = function(e) {
						zipper.add(inputFile.name, new Uint8Array(e.target.result), null, function() {
							addIndex++;
							onaddFile(inputFile);
							if (addIndex < files.length)
								nextFile();
							else
								onaddFiles();
						}, onprogressFile);
					};
					reader.readAsArrayBuffer(inputFile);
				}

				if (outputFile)
					nextFile();
				else
					requestFileSystem(TEMPORARY, 1024 * 1024 * 1024, function(filesystem) {
						createFile(filesystem, filename || "output.zip", function(zipFile) {
							outputFile = zipFile;
							zipper = zip.createWriter(outputFile);
							oninit();
							addFiles(files, oninit, onaddFiles, onaddFile, onprogressFile);
						});
					});
			},
			getZipURL : function(callback) {
				zipper.close(function() {
					callback(outputFile.toURL());
					zipper = null;
					outputFile = null;
					filename = "";
				});
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
		var zipProgress = document.getElementById("zip-progress");
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
		}, false);
		return {
			initZip : function() {
				filenameInput.disabled = true;
			},
			addFiles : function() {
				fileInput.value = "";
				fileInput.disabled = false;
				downloadButton.disabled = false;
			},
			addFile : function(file) {
				var li = document.createElement("li");
				zipProgress.value = 0;
				zipProgress.max = 0;
				li.innerText = file.name;
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

})();
