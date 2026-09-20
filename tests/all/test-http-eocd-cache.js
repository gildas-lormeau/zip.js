/* global Response */

// with combineSizeEocd the entry data lying in the cached end of the archive is served from the
// cache by the fetch reader too, so a small archive costs the size request and nothing else

import * as zip from "../zip-lib.js";

const CONTENT_URL = "https://eocd-cache.invalid/data.zip";
const EOCD_SEARCH_LENGTH = 65557;
const LARGE_PAYLOAD_LENGTH = 100000;
const SMALL_PAYLOAD_LENGTH = 1000;

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
	zip.configure({ useWebWorkers: false });
	try {
		await testSmallArchive();
		await testCachedTail();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testSmallArchive() {
	const payloads = [createPayload(SMALL_PAYLOAD_LENGTH, 7), createPayload(SMALL_PAYLOAD_LENGTH, 11), createPayload(SMALL_PAYLOAD_LENGTH, 13)];
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("stored.bin", new zip.Uint8ArrayReader(payloads[0]), { level: 0 });
	await zipWriter.add("deflated.bin", new zip.Uint8ArrayReader(payloads[1]));
	await zipWriter.add("last.bin", new zip.Uint8ArrayReader(payloads[2]), { level: 0 });
	const contentArray = await zipWriter.close();
	if (contentArray.length >= EOCD_SEARCH_LENGTH) {
		throw new Error("archive too large for the test: " + contentArray.length);
	}
	const { fetchContent, requests } = createFetch(contentArray);
	const zipReader = new zip.ZipReader(new zip.HttpReader(CONTENT_URL, { fetch: fetchContent, useRangeHeader: true, combineSizeEocd: true }));
	try {
		const entries = await zipReader.getEntries();
		for (let index = 0; index < entries.length; index++) {
			await checkEntry(entries[index], payloads[index]);
		}
	} finally {
		await zipReader.close();
	}
	if (requests.length != 1) {
		throw new Error("expected 1 request for a small archive, got " + requests.length + ": " + requests.join(" "));
	}
	if (requests[0] != "bytes=-" + EOCD_SEARCH_LENGTH) {
		throw new Error("unexpected first request: " + requests[0]);
	}
}

async function testCachedTail() {
	const payloads = [createPayload(LARGE_PAYLOAD_LENGTH, 17), createPayload(SMALL_PAYLOAD_LENGTH, 19)];
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("large.bin", new zip.Uint8ArrayReader(payloads[0]), { level: 0 });
	await zipWriter.add("small.bin", new zip.Uint8ArrayReader(payloads[1]), { level: 0 });
	const contentArray = await zipWriter.close();
	if (contentArray.length <= EOCD_SEARCH_LENGTH) {
		throw new Error("archive too small for the test: " + contentArray.length);
	}
	const { fetchContent, requests } = createFetch(contentArray);
	const zipReader = new zip.ZipReader(new zip.HttpReader(CONTENT_URL, { fetch: fetchContent, useRangeHeader: true, combineSizeEocd: true }));
	try {
		const entries = await zipReader.getEntries();
		const requestCountBeforeSmall = requests.length;
		await checkEntry(entries[1], payloads[1]);
		if (requests.length != requestCountBeforeSmall) {
			throw new Error("the entry in the cached tail was requested: " + requests.slice(requestCountBeforeSmall).join(" "));
		}
		const requestCountBeforeLarge = requests.length;
		await checkEntry(entries[0], payloads[0]);
		if (requests.length == requestCountBeforeLarge) {
			throw new Error("the entry outside the cached tail was not requested");
		}
	} finally {
		await zipReader.close();
	}
}

async function checkEntry(entry, payload) {
	const writer = new BufferConsumingWriter();
	await entry.getData(writer);
	const result = writer.getData();
	if (result.length != payload.length) {
		throw new Error("invalid length for " + entry.filename + ": " + result.length);
	}
	for (let index = 0; index < payload.length; index++) {
		if (result[index] != payload[index]) {
			throw new Error("invalid data for " + entry.filename + " at index " + index);
		}
	}
}

function createFetch(contentArray) {
	const requests = [];

	async function fetchContent(url, { method, headers } = {}) {
		if (url != CONTENT_URL) {
			throw new Error("unexpected url: " + url);
		}
		const rangeHeader = headers && headers.Range;
		if (method == "HEAD" || !rangeHeader) {
			requests.push(method || "GET");
			return new Response(method == "HEAD" ? null : contentArray.slice(), {
				status: 200,
				headers: { "Content-Length": String(contentArray.length), "Accept-Ranges": "bytes" }
			});
		}
		requests.push(rangeHeader);
		const [rangeStartValue, rangeEndValue] = rangeHeader.replace("bytes=", "").split("-");
		let rangeStart, rangeEnd;
		if (rangeStartValue === "") {
			rangeStart = Math.max(0, contentArray.length - Number(rangeEndValue));
			rangeEnd = contentArray.length - 1;
		} else {
			rangeStart = Number(rangeStartValue);
			rangeEnd = rangeEndValue === "" ? contentArray.length - 1 : Math.min(Number(rangeEndValue), contentArray.length - 1);
		}
		return new Response(contentArray.slice(rangeStart, rangeEnd + 1), {
			status: 206,
			headers: {
				"Content-Range": "bytes " + rangeStart + "-" + rangeEnd + "/" + contentArray.length,
				"Accept-Ranges": "bytes"
			}
		});
	}

	return { fetchContent, requests };
}

function createPayload(length, seed) {
	const payload = new Uint8Array(length);
	for (let index = 0; index < payload.length; index++) {
		seed = (seed * 1103515245 + 12345) & 0x7fffffff;
		payload[index] = (seed >> 8) & 255;
	}
	return payload;
}
