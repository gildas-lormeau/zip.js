/* global Response */

import * as zip from "../zip-lib.js";

const CONTENT_URL = "https://range-window.invalid/data.zip";
const FILENAME = "data.bin";
const MAXIMUM_RANGE_REQUEST_SIZE = 16 * 1024 * 1024;
const PAYLOAD_LENGTH = 17 * 1024 * 1024;
const PATTERN_LENGTH = 64 * 1024;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		const payload = createPayload();
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.add(FILENAME, new zip.Uint8ArrayReader(payload), { level: 0 });
		const contentArray = await zipWriter.close();
		const rangeRequests = [];

		async function fetchContent(url, { method, headers } = {}) {
			if (url != CONTENT_URL) {
				throw new Error("unexpected url: " + url);
			}
			const rangeHeader = headers && headers.Range;
			if (method == "HEAD" || !rangeHeader) {
				return new Response(contentArray.slice(), {
					status: 200,
					headers: { "Content-Length": String(contentArray.length), "Accept-Ranges": "bytes" }
				});
			}
			const [rangeStart, rangeEnd] = rangeHeader.replace("bytes=", "").split("-").map(Number);
			rangeRequests.push([rangeStart, rangeEnd]);
			return new Response(contentArray.slice(rangeStart, rangeEnd + 1), {
				status: 206,
				headers: {
					"Content-Range": "bytes " + rangeStart + "-" + rangeEnd + "/" + contentArray.length,
					"Accept-Ranges": "bytes"
				}
			});
		}

		const zipReader = new zip.ZipReader(new zip.HttpReader(CONTENT_URL, { fetch: fetchContent, useRangeHeader: true }));
		try {
			const entries = await zipReader.getEntries();
			const requestCountBeforeData = rangeRequests.length;
			const result = await entries[0].getData(new zip.Uint8ArrayWriter());
			const dataRequests = rangeRequests.slice(requestCountBeforeData);
			const requestLengths = dataRequests.map(([rangeStart, rangeEnd]) => rangeEnd - rangeStart + 1);
			const oversizedLengths = requestLengths.filter(requestLength => requestLength > MAXIMUM_RANGE_REQUEST_SIZE);
			if (oversizedLengths.length) {
				throw new Error("range requests larger than " + MAXIMUM_RANGE_REQUEST_SIZE + " bytes: " + oversizedLengths.join(", "));
			}
			const windowRequestCount = requestLengths.filter(requestLength => requestLength >= 1024 * 1024).length;
			if (windowRequestCount < 2) {
				throw new Error("expected the entry data to be read with several range requests, got " + windowRequestCount);
			}
			if (result.length != payload.length || result.some((value, index) => value != payload[index])) {
				throw new Error("invalid data");
			}
		} finally {
			await zipReader.close();
		}
	} finally {
		await zip.terminateWorkers();
	}
}

function createPayload() {
	const pattern = new Uint8Array(PATTERN_LENGTH);
	let seed = 7;
	for (let index = 0; index < pattern.length; index++) {
		seed = (seed * 1103515245 + 12345) & 0x7fffffff;
		pattern[index] = (seed >> 8) & 255;
	}
	const payload = new Uint8Array(PAYLOAD_LENGTH);
	for (let offset = 0; offset < payload.length; offset += pattern.length) {
		payload.set(pattern.subarray(0, Math.min(pattern.length, payload.length - offset)), offset);
	}
	return payload;
}
