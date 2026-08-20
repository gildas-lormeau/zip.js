/* global Response, Headers */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const FILENAME = "lorem.txt";
// the host does not exist: reading the data can only succeed through the custom fetch function
const CONTENT_URL = "https://custom-fetch.invalid/lorem.zip";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter);
		await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
		await zipWriter.close();
		const contentArray = new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
		let requestCount = 0;

		async function fetchContent(url, { method, headers } = {}) {
			if (url != CONTENT_URL) {
				throw new Error("unexpected url: " + url);
			}
			requestCount++;
			const responseHeaders = { "Content-Length": String(contentArray.length), "Accept-Ranges": "bytes" };
			if (method == "HEAD") {
				return new Response(new Uint8Array(), { status: 200, headers: responseHeaders });
			}
			const rangeHeader = new Headers(headers || {}).get("Range");
			if (rangeHeader) {
				let [start, end] = rangeHeader.replace(/^bytes=/, "").split("-").map(value => value === "" ? undefined : Number(value));
				if (start === undefined) {
					start = contentArray.length - end;
					end = contentArray.length - 1;
				} else if (end === undefined || end >= contentArray.length) {
					end = contentArray.length - 1;
				}
				return new Response(contentArray.slice(start, end + 1), {
					status: 206,
					headers: Object.assign(responseHeaders, { "Content-Range": "bytes " + start + "-" + end + "/" + contentArray.length })
				});
			}
			return new Response(contentArray.slice(), { status: 200, headers: responseHeaders });
		}

		// HEAD request and full download
		await readEntry({ fetch: fetchContent });
		// full download only
		await readEntry({ fetch: fetchContent, preventHeadRequest: true });
		// range requests
		await readEntry({ fetch: fetchContent, useRangeHeader: true, forceRangeRequests: true, preventHeadRequest: true });
		// the custom fetch function takes precedence over useXHR
		await readEntry({ fetch: fetchContent, useXHR: true });
		if (!requestCount) {
			throw new Error();
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function readEntry(options) {
	const zipReader = new zip.ZipReader(new zip.HttpReader(CONTENT_URL, options), { checkCrc32: true });
	try {
		const entries = await zipReader.getEntries();
		if (entries.length != 1 || entries[0].filename != FILENAME) {
			throw new Error();
		}
		const text = await entries[0].getData(new zip.TextWriter());
		if (text != TEXT_CONTENT) {
			throw new Error();
		}
	} finally {
		await zipReader.close();
	}
}
