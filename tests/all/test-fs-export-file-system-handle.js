/* global WritableStream, TextEncoder, TextDecoder */

// Exercises FS#exportFileSystemHandle against an in-memory mock of the File System Access / OPFS
// write surface (no headless runtime exposes OPFS). It builds a small tree, exports it, and checks
// the mock received the exact directory structure and bytes. Both the sequential and concurrent
// strategies are covered.

import * as zip from "../zip-lib.js";

const TEXT_ENCODER = new TextEncoder();
const COMPRESSIBLE_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(200);

export { test };

async function test() {
	await exportTree(false);
	await exportTree(true);
	await exportImportedTree(false);
	await exportImportedTree(true);
	await exportPassThroughTree({ passThrough: true });
	await exportPassThroughTree({ readerOptions: { passThrough: true } });
	await exportTreeIgnoringPreventClose({ preventClose: true });
	await exportTreeIgnoringPreventClose({ readerOptions: { preventClose: true } });
	await exportTreeIgnoringPreventClose({ preventClose: true, concurrent: true });
	await zip.terminateWorkers();
}

async function exportTree(concurrent) {
	const fs = new zip.ZipFS();
	fs.addText("readme.txt", "hello world");
	const subDirectory = fs.addDirectory("sub");
	subDirectory.addText("nested.txt", "nested content");
	subDirectory.addDirectory("empty");
	fs.addUint8Array("data.bin", new Uint8Array([1, 2, 3, 4, 5]));

	const target = createMockWriteDirectory();
	const progress = createProgressWatcher("concurrent=" + concurrent);
	const returned = await fs.exportFileSystemHandle(target.handle, Object.assign({ concurrent }, progress.options));
	if (returned !== target.handle) {
		throw new Error("exportFileSystemHandle did not return the target handle");
	}
	progress.assertCompleted(30);

	const files = flatten(target.root);
	assertText(files["readme.txt"], "hello world", "concurrent=" + concurrent);
	assertText(files["sub/nested.txt"], "nested content", "concurrent=" + concurrent);
	if (!bytesEqual(files["data.bin"], new Uint8Array([1, 2, 3, 4, 5]))) {
		throw new Error("data.bin mismatch (concurrent=" + concurrent + ")");
	}
	if (!dirExists(target.root, ["sub", "empty"])) {
		throw new Error("empty directory not created (concurrent=" + concurrent + ")");
	}
}

async function exportImportedTree(concurrent) {
	const source = new zip.ZipFS();
	source.addText("compressible.txt", COMPRESSIBLE_CONTENT);
	source.addUint8Array("stored.bin", new Uint8Array([1, 2, 3, 4, 5]), { level: 0 });
	const blob = await source.exportBlob({ level: 9 });
	if (blob.size >= COMPRESSIBLE_CONTENT.length) {
		throw new Error("test archive is not compressed (concurrent=" + concurrent + ")");
	}
	const fs = new zip.ZipFS();
	await fs.importBlob(blob);

	const target = createMockWriteDirectory();
	const progress = createProgressWatcher("concurrent=" + concurrent);
	await fs.exportFileSystemHandle(target.handle, Object.assign({ concurrent }, progress.options));
	progress.assertCompleted(COMPRESSIBLE_CONTENT.length + 5);

	const files = flatten(target.root);
	assertText(files["compressible.txt"], COMPRESSIBLE_CONTENT, "concurrent=" + concurrent);
	if (!bytesEqual(files["stored.bin"], new Uint8Array([1, 2, 3, 4, 5]))) {
		throw new Error("stored.bin mismatch (concurrent=" + concurrent + ")");
	}
}

async function exportPassThroughTree(options) {
	const source = new zip.ZipFS();
	source.addText("compressible.txt", COMPRESSIBLE_CONTENT);
	const blob = await source.exportBlob({ level: 9 });
	const fs = new zip.ZipFS();
	await fs.importBlob(blob);
	const { compressedSize } = fs.getChildByName("compressible.txt").data;

	const target = createMockWriteDirectory();
	const progress = createProgressWatcher(JSON.stringify(options));
	await fs.exportFileSystemHandle(target.handle, Object.assign({}, progress.options, options));
	progress.assertCompleted(compressedSize);

	const files = flatten(target.root);
	if (files["compressible.txt"].length != compressedSize) {
		throw new Error("passThrough did not write the raw compressed data with " + JSON.stringify(options));
	}
}

async function exportTreeIgnoringPreventClose(options) {
	const fs = new zip.ZipFS();
	fs.addText("readme.txt", "hello world");
	fs.addDirectory("sub").addText("nested.txt", "nested content");

	const label = JSON.stringify(options);
	const target = createMockWriteDirectory();
	const progress = createProgressWatcher(label);
	await fs.exportFileSystemHandle(target.handle, Object.assign({}, progress.options, options));
	progress.assertCompleted(25);

	const files = flatten(target.root);
	assertText(files["readme.txt"], "hello world", label);
	assertText(files["sub/nested.txt"], "nested content", label);
}

function createProgressWatcher(label) {
	const starts = [];
	const ends = [];
	const totalSizes = new Set();
	let previousProgress = 0;
	let lastProgress = 0;
	let progressCount = 0;
	return {
		options: {
			onstart: total => starts.push(total),
			onprogress: (progress, totalSize) => {
				if (!starts.length) {
					throw new Error("progress reported before onstart (" + label + ")");
				}
				if (progress < previousProgress || progress > totalSize) {
					throw new Error("inconsistent progress " + progress + "/" + totalSize + " (" + label + ")");
				}
				previousProgress = progress;
				lastProgress = progress;
				totalSizes.add(totalSize);
				progressCount++;
			},
			onend: computedSize => ends.push(computedSize)
		},
		assertCompleted(expectedTotalSize) {
			if (!progressCount) {
				throw new Error("no progress reported (" + label + ")");
			}
			if (totalSizes.size != 1 || !totalSizes.has(expectedTotalSize) || lastProgress != expectedTotalSize) {
				throw new Error("progress stopped at " + lastProgress + " of " + [...totalSizes] +
					", expected " + expectedTotalSize + " (" + label + ")");
			}
			assertSingleEvent(starts, "onstart", expectedTotalSize, label);
			assertSingleEvent(ends, "onend", expectedTotalSize, label);
		}
	};
}

function assertSingleEvent(sizes, name, expectedTotalSize, label) {
	if (sizes.length != 1 || sizes[0] != expectedTotalSize) {
		throw new Error("expected one " + name + " with " + expectedTotalSize + ", got [" + sizes + "] (" + label + ")");
	}
}

function assertText(bytes, expected, label) {
	const text = bytes ? new TextDecoder().decode(bytes) : undefined;
	if (text != expected) {
		throw new Error("expected \"" + expected + "\" got \"" + text + "\" (" + label + ")");
	}
	// ensure the entry compressed/decompressed round-trips, not just that some bytes were written
	if (!bytesEqual(bytes, TEXT_ENCODER.encode(expected))) {
		throw new Error("byte mismatch for \"" + expected + "\"");
	}
}

// Mock of the write surface used by exportFileSystemHandle: getDirectoryHandle / getFileHandle /
// createWritable. Directory nodes have `entries`; file nodes have `bytes`.
function createMockWriteDirectory() {
	const root = { entries: new Map() };
	function makeHandle(node) {
		return {
			async getDirectoryHandle(name, { create } = {}) {
				let child = node.entries.get(name);
				if (!child) {
					if (!create) {
						throw new Error("NotFoundError");
					}
					child = { entries: new Map() };
					node.entries.set(name, child);
				}
				return makeHandle(child);
			},
			async getFileHandle(name, { create } = {}) {
				let child = node.entries.get(name);
				if (!child) {
					if (!create) {
						throw new Error("NotFoundError");
					}
					child = { bytes: new Uint8Array(0) };
					node.entries.set(name, child);
				}
				return {
					async createWritable() {
						const chunks = [];
						return new WritableStream({
							write(chunk) {
								chunks.push(new Uint8Array(chunk));
							},
							close() {
								child.bytes = concatChunks(chunks);
							}
						});
					}
				};
			}
		};
	}
	return { handle: makeHandle(root), root };
}

function flatten(node, prefix = "", out = {}) {
	for (const [name, child] of node.entries) {
		if (child.entries) {
			flatten(child, prefix + name + "/", out);
		} else {
			out[prefix + name] = child.bytes;
		}
	}
	return out;
}

function dirExists(node, path) {
	let current = node;
	for (const name of path) {
		current = current.entries && current.entries.get(name);
		if (!current || !current.entries) {
			return false;
		}
	}
	return true;
}

function concatChunks(chunks) {
	let length = 0;
	for (const chunk of chunks) {
		length += chunk.length;
	}
	const result = new Uint8Array(length);
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}
	return result;
}

function bytesEqual(a, b) {
	if (!a || !b || a.length != b.length) {
		return false;
	}
	for (let index = 0; index < a.length; index++) {
		if (a[index] != b[index]) {
			return false;
		}
	}
	return true;
}
