/* globals zip, document, URL, MouseEvent, alert */

(() => {

	const DEFLATE_IMPLEMENTATIONS = {
		fflate: ["lib/z-worker-fflate.js", "fflate.min.js"],
		pako: ["lib/z-worker-pako.js", "pako_deflate.min.js"],
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
		fileInput.onchange = async () => {
			try {
				await addFiles();
				fileInput.value = "";
				downloadButton.disabled = false;
			} catch (error) {
				alert(error);
			} finally {
				zipProgress.remove();
			}
		};
		deflateImplementationInput.onchange = () => {
			const deflateImplementation = DEFLATE_IMPLEMENTATIONS[deflateImplementationInput.value];
			if (deflateImplementation) {
				zip.configure({ workerScripts: { deflate: deflateImplementation } });
			}
		};

		async function addFiles() {
			downloadButton.disabled = true;
			await Promise.all(Array.from(fileInput.files).map(async file => {
				const li = document.createElement("li");
				const zipProgress = document.createElement("progress");
				zipProgress.value = 0;
				zipProgress.max = 0;
				li.textContent = file.name;
				li.appendChild(zipProgress);
				fileList.classList.remove("empty");
				fileList.appendChild(li);
				li.title = file.name;
				li.classList.add("pending");
				const entry = await model.addFile(file, {
					bufferedWrite: true,
					password: passwordInput.value,
					onprogress: (index, max) => {
						li.classList.remove("pending");
						li.classList.add("busy");
						zipProgress.value = index;
						zipProgress.max = max;
					}
				});
				li.classList.remove("busy");
				li.title += `\n  Last modification date: ${entry.lastModDate.toLocaleString()}\n  Compressed size: ${entry.compressedSize.toLocaleString()} bytes`;
				zipProgress.remove();
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
