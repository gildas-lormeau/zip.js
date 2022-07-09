/* globals zip, document, URL, MouseEvent, AbortController, alert */

(() => {

	if (typeof TransformStream == "undefined") {
		const script = document.createElement("script");
		script.src = "lib/web-streams-polyfill.min.js";
		document.body.appendChild(script);
	}

	const DEFLATE_IMPLEMENTATIONS = {
		"zip.js": ["z-worker.js"],
		"fflate": ["z-worker-fflate.js", "fflate.min.js"],
		"pako": ["z-worker-pako.js", "pako_deflate.min.js"],
	};

	const model = (() => {

		let zipWriter;
		return {
			addFile(file, options) {
				if (!zipWriter) {
					zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
				}
				return zipWriter.add(file.name, new zip.BlobReader(file), options);
			},
			async getBlobURL() {
				if (zipWriter) {
					const blobURL = URL.createObjectURL(await zipWriter.close());
					zipWriter = null;
					return blobURL;
				} else {
					throw new Error("Zip file closed");
				}
			}
		};

	})();

	(() => {

		const fileInput = document.getElementById("file-input");
		const fileInputButton = document.getElementById("file-input-button");
		const zipProgress = document.createElement("progress");
		const downloadButton = document.getElementById("download-button");
		const fileList = document.getElementById("file-list");
		const filenameInput = document.getElementById("filename-input");
		const passwordInput = document.getElementById("password-input");
		const deflateImplementationInput = document.getElementById("deflate-implementation-input");
		fileInputButton.addEventListener("click", () => fileInput.dispatchEvent(new MouseEvent("click")), false);
		downloadButton.addEventListener("click", onDownloadButtonClick, false);
		fileInput.onchange = selectFiles;
		deflateImplementationInput.onchange = selectDeflateImplementation;
		selectDeflateImplementation();

		async function selectFiles() {
			try {
				await addFiles();
				fileInput.value = "";
				downloadButton.disabled = false;
			} catch (error) {
				alert(error);
			} finally {
				zipProgress.remove();
			}
		}

		function selectDeflateImplementation() {
			const deflateImplementation = DEFLATE_IMPLEMENTATIONS[deflateImplementationInput.value];
			zip.configure({ workerScripts: { deflate: deflateImplementation } });
		}

		async function addFiles() {
			downloadButton.disabled = true;
			await Promise.all(Array.from(fileInput.files).map(async file => {
				const li = document.createElement("li");
				const filenameContainer = document.createElement("span");
				const filename = document.createElement("span");
				const zipProgress = document.createElement("progress");
				filenameContainer.classList.add("filename-container");
				li.appendChild(filenameContainer);
				filename.classList.add("filename");
				filename.textContent = file.name;
				filenameContainer.appendChild(filename);
				zipProgress.value = 0;
				zipProgress.max = 0;
				li.appendChild(zipProgress);
				fileList.classList.remove("empty");
				fileList.appendChild(li);
				li.title = file.name;
				li.classList.add("pending");
				const controller = new AbortController();
				const signal = controller.signal;
				const abortButton = document.createElement("button");
				abortButton.onclick = () => controller.abort();
				abortButton.textContent = "✖";
				abortButton.title = "Abort";
				filenameContainer.appendChild(abortButton);
				try {
					const entry = await model.addFile(file, {
						bufferedWrite: true,
						password: passwordInput.value,
						signal,
						onprogress: (index, max) => {
							li.classList.remove("pending");
							li.classList.add("busy");
							zipProgress.value = index;
							zipProgress.max = max;
						},
					});
					li.title += `\n  Last modification date: ${entry.lastModDate.toLocaleString()}\n  Compressed size: ${entry.compressedSize.toLocaleString()} bytes`;
				} catch (error) {
					if (error.message == zip.ERR_ABORT) {
						if (!li.previousElementSibling && !li.nextElementSibling) {
							fileList.classList.add("empty");
						}
						li.remove();
					} else {
						throw error;
					}
				} finally {
					li.classList.remove("busy");
					zipProgress.remove();
				}
			}));
		}

		async function onDownloadButtonClick(event) {
			let blobURL;
			try {
				blobURL = await model.getBlobURL();
			} catch (error) {
				alert(error);
			}
			if (blobURL) {
				const anchor = document.createElement("a");
				const clickEvent = new MouseEvent("click");
				anchor.href = blobURL;
				anchor.download = filenameInput.value;
				anchor.dispatchEvent(clickEvent);
				fileList.innerHTML = "";
				fileList.classList.add("empty");
			}
			downloadButton.disabled = true;
			event.preventDefault();
		}

	})();

})();
