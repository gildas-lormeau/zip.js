/* global Response */

import * as zip from "../zip-lib.js";

const CONTENT_URL = "https://single-range.invalid/data.zip";
const FILENAME = "data.bin";
const PAYLOAD_LENGTH = 200000;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false, chunkSize: 16 * 1024 });
	try {
		const payload = new Uint8Array(PAYLOAD_LENGTH);
		let seed = 7;
		for (let index = 0; index < payload.length; index++) {
			seed = (seed * 1103515245 + 12345) & 0x7fffffff;
			payload[index] = (seed >> 8) & 255;
		}
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
			const payloadRequests = dataRequests.filter(([rangeStart, rangeEnd]) => rangeEnd - rangeStart + 1 >= payload.length);
			if (payloadRequests.length != 1) {
				throw new Error("expected 1 request for the entry data, got " + payloadRequests.length + " (" + dataRequests.length + " range requests)");
			}
			if (dataRequests.length > 3) {
				throw new Error("too many range requests: " + dataRequests.length);
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
