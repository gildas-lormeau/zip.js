/* global self, zip, importScripts, fetch, Response */

"use strict";

importScripts("./../../dist/zip-full.min.js");
zip.configure({ useWebWorkers: false });
self.addEventListener("fetch", async (event) => {
	const matchZipEntry = event.request.url.match(/.zip#(.+)$/i);
	if (matchZipEntry) {
		event.respondWith(getFileEntry(event.request.url, matchZipEntry[1])
			.then(body => new Response(body)));
	}
});

async function getFileEntry(url, filenameEntry) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(await (await fetch(url)).blob()));
	const entries = await zipReader.getEntries();
	const fileEntry = entries.find(entry => entry.filename == filenameEntry);
	return fileEntry.getData(new zip.BlobWriter());
}