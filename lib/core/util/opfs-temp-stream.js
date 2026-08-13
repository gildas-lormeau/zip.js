/*
 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* global navigator, crypto, ReadableStream, WritableStream */

export {
	createOPFSTempStream
};

const DEFAULT_THRESHOLD = 1024 * 1024;
const DEFAULT_DIRECTORY_NAME = ".zip.js-temp";

function createOPFSTempStream(options = {}) {
	const {
		thresholdBytes = DEFAULT_THRESHOLD,
		directoryName = DEFAULT_DIRECTORY_NAME,
		getDirectory = () => navigator.storage.getDirectory()
	} = options;
	let directoryHandlePromise;
	function getTempDirectory() {
		if (!directoryHandlePromise) {
			directoryHandlePromise = Promise.resolve(getDirectory())
				.then(root => root.getDirectoryHandle(directoryName, { create: true }));
		}
		return directoryHandlePromise;
	}
	return function () {
		const memoryChunks = [];
		let bufferedSize = 0;
		let spilled = false;
		let fileName, fileHandle, fileWriter, fileReader;

		async function spillToFile() {
			const directoryHandle = await getTempDirectory();
			fileName = getRandomFileName();
			fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
			fileWriter = (await fileHandle.createWritable()).getWriter();
			spilled = true;
			for (const chunk of memoryChunks) {
				await fileWriter.write(chunk);
			}
			memoryChunks.length = 0;
		}

		const writable = new WritableStream({
			async write(chunk) {
				if (spilled) {
					await fileWriter.write(chunk);
				} else {
					memoryChunks.push(chunk);
					bufferedSize += chunk.length;
					if (bufferedSize > thresholdBytes) {
						await spillToFile();
					}
				}
			},
			async close() {
				if (fileWriter) {
					await fileWriter.close();
					fileWriter = null;
				}
			}
		});

		let memoryIndex = 0;
		const readable = new ReadableStream({
			async pull(controller) {
				if (spilled) {
					if (!fileReader) {
						const file = await fileHandle.getFile();
						fileReader = file.stream().getReader();
					}
					const { value, done } = await fileReader.read();
					if (done) {
						controller.close();
					} else {
						controller.enqueue(value);
					}
				} else if (memoryIndex < memoryChunks.length) {
					controller.enqueue(memoryChunks[memoryIndex++]);
				} else {
					controller.close();
				}
			},
			async cancel(reason) {
				if (fileReader) {
					await fileReader.cancel(reason);
				}
			}
		}, { highWaterMark: 0 });
		async function dispose() {
			if (fileWriter) {
				try {
					await fileWriter.close();
				} catch {
					// ignored
				}
				fileWriter = null;
			}
			if (fileName) {
				try {
					const directoryHandle = await getTempDirectory();
					await directoryHandle.removeEntry(fileName);
				} catch {
					// ignored
				}
				fileHandle = fileName = null;
			}
			memoryChunks.length = 0;
		}

		return { writable, readable, dispose };
	};
}

function getRandomFileName() {
	if (crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return Array.from(crypto.getRandomValues(new Uint8Array(16)), byteValue => byteValue.toString(16).padStart(2, "0")).join("");
}
