(function(obj) {

	var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem, filename = "file.zip";

	function onerror(message) {
		alert(message);
	}

	function createTempFile(callback) {
		requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
			function create() {
				filesystem.root.getFile(filename, {
					create : true
				}, function(zipFile) {
					callback(zipFile);
				});
			}

			filesystem.root.getFile(filename, null, function(entry) {
				entry.remove(create, create);
			}, create);
		});
	}

	var model = (function() {
		var zipFileEntry, zipWriter, writer, creationMethod, URL = obj.webkitURL || obj.mozURL || obj.URL;

		return {
			setCreationMethod : function(method) {
				creationMethod = method;
			},
			addFiles : function addFiles(files, callbacks) {
				var addIndex = 0;

				function nextFile() {
					var file = files[addIndex], blobReader = new zip.BlobReader(file);
					callbacks.onadd(file);
					zipWriter.add(file.name, blobReader, null, function() {
						addIndex++;
						if (addIndex < files.length)
							nextFile();
						else
							callbacks.onend();
					}, callbacks.onprogress, onerror);
				}

				function createZipWriter() {
					zip.createWriter(writer, false, function(writer) {
						zipWriter = writer;
						callbacks.oninit();
						nextFile();
					}, onerror);
				}

				if (zipWriter)
					nextFile();
				else if (creationMethod == "Blob") {
					writer = new zip.BlobWriter();
					createZipWriter();
				} else {
					createTempFile(function(fileEntry) {
						zipFileEntry = fileEntry;
						writer = new zip.FileWriter(zipFileEntry);
						createZipWriter();
					});
				}
			},
			getBlobURL : function(callback) {
				zipWriter.close(function(blob) {
					callback(creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL());
					zipWriter = null;
				}, onerror);
			}
		};
	})();

	(function() {
		var fileInput = document.getElementById("file-input");
		var zipProgress = document.createElement("progress");
		var downloadButton = document.getElementById("download-button");
		var fileList = document.getElementById("file-list");
		var filenameInput = document.getElementById("filename-input");
		var creationMethodInput = document.getElementById("creation-method-input");
		if (requestFileSystem)
			creationMethodInput.value = "File";
		else
			creationMethodInput.options.length = 1;
		model.setCreationMethod(creationMethodInput.value);
		fileInput.addEventListener('change', function(event) {
			fileInput.disabled = true;
			creationMethodInput.disabled = true;
			model.addFiles(fileInput.files, {
				oninit : function() {
				},
				onadd : function(file) {
					var li = document.createElement("li");
					zipProgress.value = 0;
					zipProgress.max = 0;
					li.textContent = file.name;
					li.appendChild(zipProgress);
					fileList.appendChild(li);
				},
				onprogress : function(current, total) {
					zipProgress.value = current;
					zipProgress.max = total;
				},
				onend : function() {
					if (zipProgress.parentNode)
						zipProgress.parentNode.removeChild(zipProgress);
					fileInput.value = "";
					fileInput.disabled = false;
				}
			});
		}, false);
		creationMethodInput.addEventListener('change', function(event) {
			model.setCreationMethod(creationMethodInput.value);
		}, false);
		downloadButton.addEventListener("click", function(event) {
			var target = event.target, entry;
			if (!downloadButton.download) {
				model.getBlobURL(function(blobURL) {
					var clickEvent = document.createEvent("MouseEvent");
					clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					downloadButton.href = blobURL;
					downloadButton.download = filenameInput.value;
					downloadButton.dispatchEvent(clickEvent);
					creationMethodInput.disabled = false;
					fileList.innerHTML = "";
				});
				event.preventDefault();
				return false;
			}
		}, false);

	})();

})(this);
