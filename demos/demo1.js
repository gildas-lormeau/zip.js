/* globals zip, document, URL, MouseEvent, alert */

(() => {

	zip.configure({
		workerScripts: {
			deflate: ["lib/z-worker-pako.js", "lib/pako_deflate.min.js", "lib/crypto.js"]
		}
	});

	const model = (() => {
		let writer, zipWriter;
		return {
			async addFile(file, options) {
				if (!zipWriter) {
					writer = new zip.BlobWriter();
					zipWriter = new zip.ZipWriter(writer);
				}
				await zipWriter.add(file.name, new zip.BlobReader(file), options);
			},
			async getBlobURL() {
				await zipWriter.close();
				const blobURL = URL.createObjectURL(writer.getData());
				zipWriter = null;
				return blobURL;
			}
		};
	})();

	(() => {
		const fileInput = document.getElementById("file-input");
		const zipProgress = document.createElement("progress");
		const downloadButton = document.getElementById("download-button");
		const fileList = document.getElementById("file-list");
		const filenameInput = document.getElementById("filename-input");
		const passwordInput = document.getElementById("password-input");
		fileInput.addEventListener("change", onFileInputClick, false);
		downloadButton.addEventListener("click", onDownloadButtonClick, false);

		async function onFileInputClick() {
			fileInput.disabled = true;
			try {
				downloadButton.removeEventListener("click", onDownloadButtonClick, false);
				await Promise.all(Array.from(fileInput.files).map(async file => {
					const li = document.createElement("li");
					const zipProgress = document.createElement("progress");
					zipProgress.value = 0;
					zipProgress.max = 0;
					li.textContent = file.name;
					fileList.appendChild(li);
					await model.addFile(file, {
						bufferedWrite: true,
						password: passwordInput.value,
						onprogress: (index, max) => {
							li.appendChild(zipProgress);
							zipProgress.value = index;
							zipProgress.max = max;
						}
					});
					zipProgress.remove();
				}));
			} catch (error) {
				alert(error);
			} finally {
				downloadButton.addEventListener("click", onDownloadButtonClick, false);
			}
			zipProgress.remove();
			fileInput.value = "";
			fileInput.disabled = false;
		}

		async function onDownloadButtonClick(event) {
			if (!downloadButton.download) {
				let blobURL;
				try {
					blobURL = await model.getBlobURL();
				} catch (error) {
					alert(error);
				}
				if (blobURL) {
					const clickEvent = new MouseEvent("click");
					downloadButton.href = blobURL;
					downloadButton.download = filenameInput.value;
					downloadButton.dispatchEvent(clickEvent);
					downloadButton.download = "";
					fileList.innerHTML = "";
				}
				event.preventDefault();
			}
		}
	})();

})();
