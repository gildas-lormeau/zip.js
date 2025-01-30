/* global Blob */

import * as zip from "../../index.js";
// bash
const TEXT_CONTENT = `#!/bin/bash
echo "Hello, world!"
`;
const FILENAME = "hello.sh";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB), { executable: true });
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	if (entries[0].executable && entries[0].filename == FILENAME) {
		const text = await entries[0].getData(new zip.TextWriter());
		await zipReader.close();
		await zip.terminateWorkers();
		if (TEXT_CONTENT != text) {
			throw new Error();
		}
	} else {
		throw new Error();
	}
}