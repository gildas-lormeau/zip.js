/* eslint-disable no-console */
/* global zip, document */

"use strict";

test().catch(error => console.error(error));

async function test() {
	document.body.innerHTML = "...";
	zip.configure({ chunkSize: 128 });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blobWriter.getData()));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	if (!entries.length) {
		document.body.innerHTML = "ok";
	}
}