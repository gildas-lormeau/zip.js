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
		var URL = obj.webkitURL || obj.mozURL || obj.URL;

		return {
			getEntries : function(file, onend) {
				zip.createReader(new zip.BlobReader(file), function(zipReader) {
					zipReader.getEntries(onend);
				}, onerror);
			},
			getEntryFile : function(entry, creationMethod, callbacks) {
				var writer, zipFileEntry;

				function getData() {
					entry.getData(writer, function() {
						if (creationMethod == "Blob")
							writer.getData(function(blob) {
								callbacks.onend(URL.createObjectURL(blob));
							});
						else
							callbacks.onend(zipFileEntry.toURL());
					}, callbacks.onprogress);
				}

				if (creationMethod == "Blob") {
					writer = new zip.BlobWriter();
					getData();
				} else {
					createTempFile(function(fileEntry) {
						zipFileEntry = fileEntry;
						writer = new zip.FileWriter(zipFileEntry);
						getData();
					});
				}
			}
		};
	})();

	(function() {
		var fileInput = document.getElementById("file-input");
		var unzipProgress = document.createElement("progress");
		var fileList = document.getElementById("file-list");
		var creationMethodInput = document.getElementById("creation-method-input");

		function download(entry, li, a) {
			var creationMethod = creationMethodInput.value;
			model.getEntryFile(entry, creationMethod, {
				onend : function(blobURL) {
					var clickEvent = document.createEvent("MouseEvent");
					if (unzipProgress.parentNode)
						unzipProgress.parentNode.removeChild(unzipProgress);
					unzipProgress.value = 0;
					unzipProgress.max = 0;
					clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					a.href = blobURL;
					a.download = entry.filename;
					a.dispatchEvent(clickEvent);
				},
				onprogress : function(current, total) {
					unzipProgress.value = current;
					unzipProgress.max = total;
					li.appendChild(unzipProgress);
				}
			});
		}

		if (requestFileSystem)
			creationMethodInput.value = "File";
		else
			creationMethodInput.options.length = 1;
		fileInput.addEventListener('change', function(event) {
			fileInput.disabled = true;
			model.getEntries(fileInput.files[0], function(entries) {
				fileList.innerHTML = "";
				entries.forEach(function(entry) {
					var li = document.createElement("li");
					var a = document.createElement("a");
					a.textContent = entry.filename;
					a.href = "#";
					a.addEventListener("click", function(event) {
						if (!a.download) {
							download(entry, li, a);
							event.preventDefault();
							return false;
						}
					}, false);
					li.appendChild(a);
					fileList.appendChild(li);
				});
			});
		}, false);
	})();

})(this);
