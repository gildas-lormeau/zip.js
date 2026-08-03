/* global Response */

import * as zip from "../zip-lib.js";

const CONTENT_URL = "https://exact-chunks.invalid/data.zip";
const FILENAME = "data.bin";

export { test };

class BufferConsumingWriter extends zip.Writer {

	constructor() {
		super();
		this.arrayBuffers = [];
	}

	writeUint8Array(array) {
		this.arrayBuffers.push(array.buffer);
	}

	getData() {
		const length = this.arrayBuffers.reduce((total, arrayBuffer) => total + arrayBuffer.byteLength, 0);
		const result = new Uint8Array(length);
		let offset = 0;
		for (const arrayBuffer of this.arrayBuffers) {
			result.set(new Uint8Array(arrayBuffer), offset);
			offset += arrayBuffer.byteLength;
		}
		return result;
	}
}

async function test() {
	zip.configure({ useWebWorkers: false, chunkSize: 64 * 1024 });
	try {
		const payload = new Uint8Array(10000);
		let seed = 7;
		for (let index = 0; index < payload.length; index++) {
			seed = (seed * 1103515245 + 12345) & 0x7fffffff;
			payload[index] = (seed >> 8) & 255;
		}
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.add(FILENAME, new zip.Uint8ArrayReader(payload), { level: 0 });
		const contentArray = await zipWriter.close();

		async function fetchContent(url) {
			if (url != CONTENT_URL) {
				throw new Error("unexpected url: " + url);
			}
			return new Response(contentArray.slice(), { status: 200, headers: { "Content-Length": String(contentArray.length) } });
		}

		const zipReader = new zip.ZipReader(
			new zip.HttpReader(CONTENT_URL, { fetch: fetchContent, preventHeadRequest: true }),
			{ useWebWorkers: false, transferStreams: false, checkSignature: false });
		try {
			const entries = await zipReader.getEntries();
			const writer = new BufferConsumingWriter();
			await entries[0].getData(writer);
			const result = writer.getData();
			if (result.length != payload.length) {
				throw new Error("invalid length: " + result.length);
			}
			for (let index = 0; index < payload.length; index++) {
				if (result[index] != payload[index]) {
					throw new Error("invalid data at index " + index);
				}
			}
		} finally {
			await zipReader.close();
		}
	} finally {
		zip.configure({ useWebWorkers: true });
		await zip.terminateWorkers();
	}
}
