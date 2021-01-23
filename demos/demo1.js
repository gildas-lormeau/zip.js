/* globals zip, document, URL, MouseEvent, alert */

(() => {

	zip.configure({
		workerScripts: {
			deflate: ["lib/z-worker-pako.js", "lib/pako_deflate.min.js"]
		}
	});

	const model = (() => {
		let zipWriter;
		return {
			async addFile(file, options) {
				if (!zipWriter) {
					zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
				}
				await zipWriter.add(file.name, new zip.BlobReader(file), options);
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
		fileInputButton.addEventListener("click", () => fileInput.dispatchEvent(new MouseEvent("click")), false);
		downloadButton.addEventListener("click", onDownloadButtonClick, false);
		fileInput.onchange = async () => {
			try {
				await downloadFiles();
				fileInput.value = "";
				downloadButton.disabled = false;
			} catch (error) {
				alert(error);
			} finally {
				zipProgress.remove();
			}
		};

		async function downloadFiles() {
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
				await model.addFile(file, {
					bufferedWrite: true,
					password: passwordInput.value,
					onprogress: (index, max) => {
						zipProgress.value = index;
						zipProgress.max = max;
					}
				});
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
