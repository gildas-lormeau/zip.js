/* global self, zip, importScripts, Response */

"use strict";

importScripts("./../../dist/zip-full.js");
zip.configure({ useWebWorkers: false });
self.addEventListener("fetch", event => {
	const matchZipEntry = event.request.url.match(/.zip#(.+)$/i);
	if (matchZipEntry) {
		event.respondWith(getFileEntry(event.request.url, matchZipEntry[1])
			.then(body => new Response(body)));
	}
});

async function getFileEntry(url, filenameEntry) {
	let zipReader, entries;
	try {
		zipReader = new zip.ZipReader(new zip.HttpRangeReader(url));
		entries = await zipReader.getEntries();
	} catch (error) {
		if (error.message == zip.ERR_HTTP_RANGE) {
			zipReader = new zip.ZipReader(new zip.HttpReader(url));
			entries = await zipReader.getEntries();
		} else {
			throw error;
		}
	}
	const fileEntry = entries.find(entry => entry.filename == filenameEntry);
	const data = await fileEntry.getData(new zip.BlobWriter());
	await zipReader.close();
	return data;
}
