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

/* global navigator, crypto, FileSystemFileHandle, ReadableStream, WritableStream */

export {
	createSyncAccessHandleTempStream,
	ERR_UNSUPPORTED_CONTEXT
};

const DEFAULT_THRESHOLD = 1024 * 1024;
const DEFAULT_DIRECTORY_NAME = ".zip.js-temp";
const READ_CHUNK_SIZE = 512 * 1024;
const ERR_UNSUPPORTED_CONTEXT = "createSyncAccessHandle is only available in dedicated workers";

function createSyncAccessHandleTempStream(options = {}) {
	const {
		thresholdBytes = DEFAULT_THRESHOLD,
		directoryName = DEFAULT_DIRECTORY_NAME,
		getDirectory
	} = options;
	if (!getDirectory &&
		(typeof FileSystemFileHandle == "undefined" || !FileSystemFileHandle.prototype.createSyncAccessHandle)) {
		throw new Error(ERR_UNSUPPORTED_CONTEXT);
	}
	const getRootDirectory = getDirectory || (() => navigator.storage.getDirectory());
	let directoryHandlePromise;
	function getTempDirectory() {
		if (!directoryHandlePromise) {
			directoryHandlePromise = Promise.resolve(getRootDirectory())
				.then(root => root.getDirectoryHandle(directoryName, { create: true }));
		}
		return directoryHandlePromise;
	}
	return function () {
		const memoryChunks = [];
		let bufferedSize = 0;
		let spilled = false;
		let fileName, accessHandle;
		let writeOffset = 0;
		let readOffset = 0;

		async function spillToFile() {
			const directoryHandle = await getTempDirectory();
			fileName = getRandomFileName();
			const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
			accessHandle = await fileHandle.createSyncAccessHandle();
			spilled = true;
			for (const chunk of memoryChunks) {
				accessHandle.write(chunk, { at: writeOffset });
				writeOffset += chunk.length;
			}
			memoryChunks.length = 0;
		}

		const writable = new WritableStream({
			async write(chunk) {
				if (spilled) {
					accessHandle.write(chunk, { at: writeOffset });
					writeOffset += chunk.length;
				} else {
					memoryChunks.push(chunk);
					bufferedSize += chunk.length;
					if (bufferedSize > thresholdBytes) {
						await spillToFile();
					}
				}
			},
			close() {
				if (accessHandle) {
					accessHandle.flush();
				}
			}
		});

		let memoryIndex = 0;
		const readable = new ReadableStream({
			pull(controller) {
				if (spilled) {
					const remaining = writeOffset - readOffset;
					if (remaining <= 0) {
						controller.close();
						return;
					}
					const buffer = new Uint8Array(Math.min(READ_CHUNK_SIZE, remaining));
					const read = accessHandle.read(buffer, { at: readOffset });
					if (read) {
						readOffset += read;
						controller.enqueue(buffer.subarray(0, read));
					} else {
						controller.close();
					}
				} else if (memoryIndex < memoryChunks.length) {
					controller.enqueue(memoryChunks[memoryIndex++]);
				} else {
					controller.close();
				}
			}
		}, { highWaterMark: 0 });
		async function dispose() {
			if (accessHandle) {
				try {
					accessHandle.close();
				} catch {
					// ignored
				}
				accessHandle = null;
			}
			if (fileName) {
				try {
					const directoryHandle = await getTempDirectory();
					await directoryHandle.removeEntry(fileName);
				} catch {
					// ignored
				}
				fileName = null;
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
