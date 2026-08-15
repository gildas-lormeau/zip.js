/* global WritableStream, AbortController */

// Checks that the abort reason passed through the `signal` option of exportFileSystemHandle() reaches
// the caller unchanged. This is split from test-fs-handle-error-identity.js because it needs the
// `reason` argument of AbortController#abort(), which browsers gained much later than the rest of the
// File System Access paths. Where `reason` is unsupported the platform discards the error and there is
// nothing zip.js can recover, so the runner skips this file rather than reporting a failure.

import * as zip from "../zip-lib.js";

const USER_ABORT_MESSAGE = "user abort";

export { test };

async function test() {
	await abortedBeforeExport();
	await abortedDuringExport();
	await zip.terminateWorkers();
}

async function abortedBeforeExport() {
	const fs = new zip.fs.FS();
	fs.addUint8Array("data.bin", new Uint8Array(1024));
	const controller = new AbortController();
	controller.abort(new Error(USER_ABORT_MESSAGE));
	const error = await captureError(() => fs.exportFileSystemHandle(createTargetHandle(), {
		signal: controller.signal
	}));
	assertUserAbort(error, "aborted before export");
}

// Aborting once an entry is streaming takes the cancellation path, which must still report the reason
// of the caller rather than the internal cancellation error.
async function abortedDuringExport() {
	zip.configure({ chunkSize: 128 });
	const fs = new zip.fs.FS();
	fs.addUint8Array("slow.bin", new Uint8Array(512 * 1024));
	const controller = new AbortController();
	const error = await captureError(() => fs.exportFileSystemHandle(
		createTargetHandle(() => controller.abort(new Error(USER_ABORT_MESSAGE))),
		{ signal: controller.signal }));
	assertUserAbort(error, "aborted during export");
}

function createTargetHandle(onFirstChunk) {
	const handle = {
		async getDirectoryHandle() {
			return handle;
		},
		async getFileHandle() {
			return {
				async createWritable() {
					return new WritableStream({
						write() {
							if (onFirstChunk) {
								onFirstChunk();
							}
						}
					});
				}
			};
		}
	};
	return handle;
}

async function captureError(run) {
	try {
		await run();
	} catch (error) {
		return error;
	}
	throw new Error("expected the export to be rejected");
}

function assertUserAbort(error, description) {
	if (!error || error.message != USER_ABORT_MESSAGE) {
		throw new Error(description + ": expected \"" + USER_ABORT_MESSAGE + "\" got \"" + (error && error.message) + "\"");
	}
}
