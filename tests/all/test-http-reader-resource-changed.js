/* global Response, Headers */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const FILENAME = "lorem.txt";
const CONTENT_URL = "https://resource-changed.invalid/lorem.zip";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		const contentArray = await createZipFile(TEXT_CONTENT);
		const sameSizeContentArray = contentArray.slice();
		sameSizeContentArray[contentArray.length >> 1] ^= 0xff;
		const largerContentArray = await createZipFile(TEXT_CONTENT + TEXT_CONTENT);

		await testUnchangedResource();
		await testChangedEtag();
		await testChangedLastModified();
		await testChangedSize();
		await testMissingValidators();
		await testDisabledCheck();

		async function testUnchangedResource() {
			await readEntry(getFetchFunction([{ data: contentArray, etag: "\"v1\"", lastModified: "Mon, 13 Jul 2026 10:00:00 GMT" }]), TEXT_CONTENT);
		}

		async function testChangedEtag() {
			await expectResourceChangedError(getFetchFunction([
				{ data: contentArray, etag: "\"v1\"" },
				{ data: sameSizeContentArray, etag: "\"v2\"" }
			]));
		}

		async function testChangedLastModified() {
			await expectResourceChangedError(getFetchFunction([
				{ data: contentArray, lastModified: "Mon, 13 Jul 2026 10:00:00 GMT" },
				{ data: sameSizeContentArray, lastModified: "Mon, 13 Jul 2026 11:00:00 GMT" }
			]));
		}

		async function testChangedSize() {
			await expectResourceChangedError(getFetchFunction([
				{ data: contentArray },
				{ data: largerContentArray }
			]));
		}

		async function testMissingValidators() {
			await readEntry(getFetchFunction([{ data: contentArray }]), TEXT_CONTENT);
		}

		async function testDisabledCheck() {
			await readEntry(getFetchFunction([
				{ data: contentArray, etag: "\"v1\"" },
				{ data: contentArray, etag: "\"v2\"" }
			]), TEXT_CONTENT, { checkResourceChanges: false });
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function createZipFile(text) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.TextReader(text));
	await zipWriter.close();
	return new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
}

function getFetchFunction(generations) {
	let requestCount = 0;
	return async function (url, { headers } = {}) {
		if (url != CONTENT_URL) {
			throw new Error("unexpected url: " + url);
		}
		const { data, etag, lastModified } = generations[Math.min(requestCount, generations.length - 1)];
		requestCount++;
		const responseHeaders = { "Accept-Ranges": "bytes" };
		if (etag) {
			responseHeaders.ETag = etag;
		}
		if (lastModified) {
			responseHeaders["Last-Modified"] = lastModified;
		}
		const rangeHeader = new Headers(headers || {}).get("Range");
		let [start, end] = rangeHeader.replace(/^bytes=/, "").split("-").map(value => value === "" ? undefined : Number(value));
		if (start === undefined) {
			start = data.length - end;
			end = data.length - 1;
		} else if (end === undefined || end >= data.length) {
			end = data.length - 1;
		}
		return new Response(data.slice(start, end + 1), {
			status: 206,
			headers: Object.assign(responseHeaders, { "Content-Range": "bytes " + start + "-" + end + "/" + data.length })
		});
	};
}

async function readEntry(fetchFunction, expectedText, options = {}) {
	const zipReader = new zip.ZipReader(new zip.HttpRangeReader(CONTENT_URL, Object.assign({
		fetch: fetchFunction,
		forceRangeRequests: true
	}, options)));
	try {
		const entries = await zipReader.getEntries();
		if (entries.length != 1 || entries[0].filename != FILENAME) {
			throw new Error();
		}
		const text = await entries[0].getData(new zip.TextWriter());
		if (expectedText !== undefined && text != expectedText) {
			throw new Error();
		}
	} finally {
		await zipReader.close();
	}
}

async function expectResourceChangedError(fetchFunction) {
	let error;
	try {
		await readEntry(fetchFunction);
	} catch (testError) {
		error = testError;
	}
	if (!error || error.message != zip.ERR_HTTP_RESOURCE_CHANGED) {
		throw new Error();
	}
}
