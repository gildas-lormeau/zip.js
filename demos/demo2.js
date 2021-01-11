/* globals zip, document, URL, MouseEvent, alert */

(() => {

	zip.configure({
		workerScriptsPath: "lib/"
	});

	const model = (() => {
		let blobReader;
		return {
			getEntries(file) {
				blobReader = new zip.BlobReader(file);
				const zipReader = new zip.ZipReader(blobReader);
				return zipReader.getEntries();
			},
			async getEntryFile(entry, options) {
				let writer;
				writer = new zip.BlobWriter();
				const blob = await entry.getData(writer, options);
				return URL.createObjectURL(blob);
			}
		};
	})();

	(() => {
		const fileInput = document.getElementById("file-input");
		const unzipProgress = document.createElement("progress");
		const fileList = document.getElementById("file-list");
		fileInput.addEventListener("change", onFileInputChange, false);

		async function onFileInputChange() {
			let entries;
			fileInput.disabled = true;
			try {
				entries = await model.getEntries(fileInput.files[0]);
			} catch (error) {
				alert(error);
			}
			if (entries) {
				fileList.innerHTML = "";
				entries.forEach(entry => {
					const li = document.createElement("li");
					const anchor = document.createElement("a");
					anchor.textContent = entry.filename;
					anchor.href = "#";
					anchor.addEventListener("click", async event => {
						if (!anchor.download) {
							try {
								await download(entry, li, anchor);
							} catch (error) {
								alert(error);
							}
							event.preventDefault();
						}
					}, false);
					li.appendChild(anchor);
					fileList.appendChild(li);
				});
			}
		}

		async function download(entry, li, a) {
			const blobURL = await model.getEntryFile(entry, {
				onprogress: (index, max) => {
					unzipProgress.value = index;
					unzipProgress.max = max;
					li.appendChild(unzipProgress);
				}
			});
			const clickEvent = new MouseEvent("click");
			unzipProgress.remove();
			unzipProgress.value = 0;
			unzipProgress.max = 0;
			a.href = blobURL;
			a.download = entry.filename;
			a.dispatchEvent(clickEvent);
		}

	})();

})();
