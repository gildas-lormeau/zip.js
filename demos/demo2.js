/* globals zip, document, URL, MouseEvent, alert */

(() => {

	zip.configure({
		workerScripts: {
			inflate: ["lib/z-worker-pako.js", "lib/pako_inflate.min.js"]
		}
	});

	const model = (() => {

		return {
			getEntries(file, options) {
				return (new zip.ZipReader(new zip.BlobReader(file))).getEntries(options);
			},
			async getEntryFile(entry, options) {
				return URL.createObjectURL(await entry.getData(new zip.BlobWriter(), options));
			}
		};

	})();

	(() => {

		const appContainer = document.getElementById("container");
		const fileInput = document.getElementById("file-input");
		const encodingInput = document.getElementById("encoding-input");
		const fileInputButton = document.getElementById("file-input-button");
		const passwordInput = document.getElementById("password-input");
		const unzipProgress = document.createElement("progress");
		let fileList = document.getElementById("file-list");
		fileInputButton.addEventListener("click", () => fileInput.dispatchEvent(new MouseEvent("click")), false);
		let entries, selectedFile;
		fileInput.onchange = async () => {
			try {
				fileInputButton.disabled = true;
				encodingInput.disabled = true;
				selectedFile = fileInput.files[0];
				await loadFiles();
			} catch (error) {
				alert(error);
			} finally {
				fileInputButton.disabled = false;
				fileInput.value = "";
			}
		};
		encodingInput.onchange = async () => {
			try {
				encodingInput.disabled = true;
				fileInputButton.disabled = true;
				await loadFiles(encodingInput.value);
			} catch (error) {
				alert(error);
			} finally {
				fileInputButton.disabled = false;
			}
		};
		appContainer.addEventListener("click", async event => {
			const target = event.target;
			if (target.dataset.entryIndex !== undefined && !target.download) {
				event.preventDefault();
				try {
					await download(entries[Number(target.dataset.entryIndex)], target.parentElement, target);
				} catch (error) {
					alert(error);
				}
			}
		}, false);

		async function loadFiles(filenameEncoding) {
			entries = await model.getEntries(selectedFile, { filenameEncoding });
			emptyList();
			if (entries && entries.length) {
				fileList.classList.remove("empty");
				const languageEncodingFlagUnset = Boolean(entries.find(entry => !entry.bitFlag.languageEncodingFlag));
				const encrypted = Boolean(entries.find(entry => entry.encrypted));
				encodingInput.value = languageEncodingFlagUnset ? (filenameEncoding || "cp437") : "utf-8";
				encodingInput.disabled = !languageEncodingFlagUnset;
				passwordInput.value = "";
				passwordInput.disabled = !encrypted;
				entries.forEach((entry, entryIndex) => {
					const li = document.createElement("li");
					const anchor = document.createElement("a");
					anchor.dataset.entryIndex = entryIndex;
					anchor.textContent = anchor.title = entry.filename;
					anchor.title = `${entry.filename}\n  Last modification date: ${entry.lastModDate.toLocaleString()}`;
					if (!entry.directory) {
						anchor.href = "";
						anchor.title += `\n  Uncompressed size: ${entry.uncompressedSize.toLocaleString()} bytes`;
					}
					li.appendChild(anchor);
					fileList.appendChild(li);
				});
			}
		}

		async function download(entry, li, a) {
			const blobURL = await model.getEntryFile(entry, {
				password: passwordInput.value,
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

		function emptyList() {
			const newFileList = fileList.cloneNode();
			fileList = fileList.replaceWith(newFileList);
			fileList = newFileList;
		}

	})();

})();
