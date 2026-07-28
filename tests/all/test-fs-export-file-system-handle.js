/* global WritableStream, TextEncoder, TextDecoder */

// Exercises FS#exportFileSystemHandle against an in-memory mock of the File System Access / OPFS
// write surface (no headless runtime exposes OPFS). It builds a small tree, exports it, and checks
// the mock received the exact directory structure and bytes. Both the sequential and concurrent
// strategies are covered.

import * as zip from "../zip-lib.js";

const TEXT_ENCODER = new TextEncoder();

export { test };

async function test() {
	await exportTree(false);
	await exportTree(true);
	await zip.terminateWorkers();
}

async function exportTree(concurrent) {
	const fs = new zip.fs.FS();
	fs.addText("readme.txt", "hello world");
	const subDirectory = fs.addDirectory("sub");
	subDirectory.addText("nested.txt", "nested content");
	subDirectory.addDirectory("empty");
	fs.addUint8Array("data.bin", new Uint8Array([1, 2, 3, 4, 5]));

	const target = createMockWriteDirectory();
	const returned = await fs.exportFileSystemHandle(target.handle, { concurrent });
	if (returned !== target.handle) {
		throw new Error("exportFileSystemHandle did not return the target handle");
	}

	const files = flatten(target.root);
	assertText(files["readme.txt"], "hello world", concurrent);
	assertText(files["sub/nested.txt"], "nested content", concurrent);
	if (!bytesEqual(files["data.bin"], new Uint8Array([1, 2, 3, 4, 5]))) {
		throw new Error("data.bin mismatch (concurrent=" + concurrent + ")");
	}
	if (!dirExists(target.root, ["sub", "empty"])) {
		throw new Error("empty directory not created (concurrent=" + concurrent + ")");
	}
}

function assertText(bytes, expected, concurrent) {
	const text = bytes ? new TextDecoder().decode(bytes) : undefined;
	if (text != expected) {
		throw new Error("expected \"" + expected + "\" got \"" + text + "\" (concurrent=" + concurrent + ")");
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
