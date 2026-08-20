/* global WritableStream, ReadableStream, TextEncoder */

// Checks that the File System Access paths of the filesystem API report failures without rewriting
// them: the original error keeps its message and its type, so it stays comparable to the exported
// ERR_* constants the way every other zip.js API is, and it carries an `entryName` property naming
// the entry that failed. The export side sets that name relative to the exported entry, the import
// side relative to the parent of the handle passed in. Nested failures are checked so the name is
// the full path of the failing entry rather than the ancestor the error passed through.

import * as zip from "../zip-lib.js";

const ERROR_MESSAGE = "simulated failure";

export { test };

async function test() {
	await exportDirectoryFailure(false);
	await exportDirectoryFailure(true);
	await exportEntryFailure();
	await importHandleFailure();
	await concurrentFailuresAreCollected();
	await sequentialStopsAtFirstFailure();
	await concurrentSiblingsAreCancelled();
	await manifestListsCompletedFiles();
	await zip.terminateWorkers();
}

async function manifestListsCompletedFiles() {
	const fs = new zip.ZipFS();
	fs.addUint8Array("a.bin", new Uint8Array(8));
	fs.addDirectory("sub").addUint8Array("b.bin", new Uint8Array(8));
	fs.addDirectory("boom");
	fs.addUint8Array("never.bin", new Uint8Array(8));
	const error = await captureError(() => fs.exportFileSystemHandle(createTargetHandle("boom")));
	assertError(error, "TypeError", "boom", "manifest");
	const exported = (error.exportedEntryNames || []).join(",");
	if (exported != "a.bin,sub/b.bin") {
		throw new Error("manifest: expected \"a.bin,sub/b.bin\" got \"" + exported + "\"");
	}
}

async function concurrentSiblingsAreCancelled() {
	zip.configure({ chunkSize: 128 });
	const fs = new zip.ZipFS();
	fs.addUint8Array("slow.bin", new Uint8Array(512 * 1024));
	fs.addDirectory("bad");
	const target = createCancellationTarget();
	const error = await captureError(() => fs.exportFileSystemHandle(target.handle, { concurrent: true }));
	assertError(error, "TypeError", "bad", "cancelled siblings");
	if (error.entryErrors) {
		throw new Error("cancelled siblings: cancellations leaked into entryErrors: " +
			error.entryErrors.map(entryError => entryError.message).join(","));
	}
	if (!target.aborted) {
		throw new Error("cancelled siblings: the in-flight entry was not cancelled");
	}
	if (target.closed) {
		throw new Error("cancelled siblings: the cancelled entry was committed");
	}
}

// Target whose "bad" directory fails only once the sibling entry has started streaming, so the
// sibling is reliably in flight when the export is cancelled.
function createCancellationTarget() {
	const state = { aborted: false, closed: false };
	let onFirstChunk;
	const firstChunk = new Promise(resolve => onFirstChunk = resolve);
	state.handle = {
		async getDirectoryHandle(name) {
			if (name == "bad") {
				await firstChunk;
				throw new TypeError(ERROR_MESSAGE);
			}
			return state.handle;
		},
		async getFileHandle() {
			return {
				async createWritable() {
					return new WritableStream({
						write() {
							onFirstChunk();
						},
						abort() {
							state.aborted = true;
						},
						close() {
							state.closed = true;
						}
					});
				}
			};
		}
	};
	return state;
}

async function concurrentFailuresAreCollected() {
	const error = await captureError(() => buildFailingTree().exportFileSystemHandle(
		createTargetHandle("bad1", "bad2", "bad3"), { concurrent: true }));
	assertError(error, "TypeError", "a/bad1", "concurrent failures");
	const reported = (error.entryErrors || []).map(entryError => entryError.entryName).join(",");
	if (reported != "a/bad2,b/bad3") {
		throw new Error("concurrent failures: expected entryErrors \"a/bad2,b/bad3\" got \"" + reported + "\"");
	}
}

async function sequentialStopsAtFirstFailure() {
	const error = await captureError(() => buildFailingTree().exportFileSystemHandle(
		createTargetHandle("bad1", "bad2", "bad3")));
	assertError(error, "TypeError", "a/bad1", "sequential failures");
	if (error.entryErrors) {
		throw new Error("sequential failures: expected no entryErrors, got " + error.entryErrors.length);
	}
}

function buildFailingTree() {
	const fs = new zip.ZipFS();
	const first = fs.addDirectory("a");
	first.addDirectory("bad1");
	first.addDirectory("bad2");
	fs.addDirectory("b").addDirectory("bad3");
	return fs;
}

async function exportDirectoryFailure(concurrent) {
	const fs = new zip.ZipFS();
	fs.addDirectory("sub").addDirectory("deep").addText("leaf.txt", "content");
	const error = await captureError(() => fs.exportFileSystemHandle(createTargetHandle("deep"), { concurrent }));
	assertError(error, "TypeError", "sub/deep", "export directory (concurrent=" + concurrent + ")");
}

async function exportEntryFailure() {
	const fs = new zip.ZipFS();
	fs.addDirectory("sub").addReadable("bad.txt", new ReadableStream({
		start(controller) {
			controller.enqueue(new TextEncoder().encode("partial"));
		},
		pull(controller) {
			controller.error(new Error(ERROR_MESSAGE));
		}
	}));
	const error = await captureError(() => fs.exportFileSystemHandle(createTargetHandle()));
	assertError(error, "Error", "sub/bad.txt", "export entry");
}

async function importHandleFailure() {
	const fs = new zip.ZipFS();
	const error = await captureError(() => fs.addFileSystemHandle(createSourceHandle()));
	assertError(error, "TypeError", "root/sub/bad.bin", "import handle");
}

async function captureError(run) {
	try {
		await run();
	} catch (error) {
		return error;
	}
	throw new Error("expected the operation to fail");
}

function assertError(error, name, entryName, label) {
	if (error.name != name) {
		throw new Error(label + ": expected error name \"" + name + "\" got \"" + error.name + "\"");
	}
	if (error.message != ERROR_MESSAGE) {
		throw new Error(label + ": expected message \"" + ERROR_MESSAGE + "\" got \"" + error.message + "\"");
	}
	if (error.entryName != entryName) {
		throw new Error(label + ": expected entryName \"" + entryName + "\" got \"" + error.entryName + "\"");
	}
}

function createTargetHandle(...failingDirectoryNames) {
	return makeHandle();

	function makeHandle() {
		return {
			async getDirectoryHandle(name) {
				if (failingDirectoryNames.includes(name)) {
					throw new TypeError(ERROR_MESSAGE);
				}
				return makeHandle();
			},
			async getFileHandle() {
				return {
					async createWritable() {
						return new WritableStream();
					}
				};
			}
		};
	}
}

function createSourceHandle() {
	return directoryHandle("root", [
		directoryHandle("sub", [{
			kind: "file",
			name: "bad.bin",
			getFile() {
				throw new TypeError(ERROR_MESSAGE);
			}
		}])
	]);

	function directoryHandle(name, children) {
		return {
			kind: "directory",
			name,
			async *values() {
				for (const child of children) {
					yield child;
				}
			}
		};
	}
}
