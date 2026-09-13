/* global TextDecoder */

// Checks that an entry owns the bytes of its raw metadata. The central directory is read in one buffer,
// so views into it would keep the metadata of every entry alive as long as one entry is retained, and
// would expose the whole buffer, e.g. a Node.js Buffer pool, through the .buffer of a raw field.

import * as zip from "../zip-lib.js";

const NAMES = ["first.txt", "second.txt", "third.txt"];
const COMMENT = "comment ".repeat(512);
const POOL_OFFSET = 1024;

export { test };

async function test() {
	const zipData = await buildZip();
	const pool = new Uint8Array(POOL_OFFSET + zipData.length + POOL_OFFSET);
	pool.set(zipData, POOL_OFFSET);
	const zipReader = new zip.ZipReader(new PoolReader(pool, POOL_OFFSET, zipData.length));
	const entries = await zipReader.getEntries();
	if (entries.length != NAMES.length) {
		throw new Error("expected " + NAMES.length + " entries got " + entries.length);
	}
	const [, entry] = entries;
	const { rawFilename, rawExtraField, rawComment } = entry;
	if (Object.getPrototypeOf(rawFilename) !== Uint8Array.prototype) {
		throw new Error("expected rawFilename to be a plain Uint8Array");
	}
	if (rawFilename.buffer === pool.buffer || rawExtraField.buffer === pool.buffer || rawComment.buffer === pool.buffer) {
		throw new Error("expected the raw metadata to be copied out of the reader buffer");
	}
	if (rawFilename.buffer !== rawExtraField.buffer || rawFilename.buffer !== rawComment.buffer) {
		throw new Error("expected the raw metadata of an entry to share one buffer");
	}
	const expectedLength = rawFilename.length + rawExtraField.length + rawComment.length;
	if (!rawExtraField.length || rawFilename.buffer.byteLength != expectedLength) {
		throw new Error("expected a buffer of " + expectedLength + " bytes got " + rawFilename.buffer.byteLength);
	}
	const decoder = new TextDecoder();
	if (decoder.decode(rawFilename) != NAMES[1] || decoder.decode(rawComment) != COMMENT) {
		throw new Error("expected the raw metadata of \"" + NAMES[1] + "\" got \"" + decoder.decode(rawFilename) + "\"");
	}
	const content = await entry.getData(new zip.TextWriter());
	if (content != NAMES[1]) {
		throw new Error("expected the content \"" + NAMES[1] + "\" got \"" + content + "\"");
	}
	await zipReader.close();
	await zip.terminateWorkers();
}

class ViewSliceArray extends Uint8Array {
	slice(start, end) {
		return this.subarray(start, end);
	}
}

class PoolReader extends zip.Reader {
	constructor(pool, poolStart, size) {
		super();
		Object.assign(this, { pool, poolStart, size });
	}

	readUint8Array(index, length) {
		return new ViewSliceArray(this.pool.buffer, this.pool.byteOffset + this.poolStart + index, length);
	}
}

async function buildZip() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (const name of NAMES) {
		await zipWriter.add(name, new zip.TextReader(name), { comment: COMMENT });
	}
	return zipWriter.close();
}
