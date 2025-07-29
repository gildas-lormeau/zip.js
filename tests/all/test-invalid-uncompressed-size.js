/* global fetch, URL */

import * as zip from "../../index.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const readable = (await fetch(new URL("../data/lorem-invalid-uncompressed-size.zip", import.meta.url))).body;
	const zipReader = new zip.ZipReader(readable);
	const entries = await zipReader.getEntries();
	try {
		await entries[0].arrayBuffer();
		throw new Error();
	} catch (error) {
		if (error.message !== zip.ERR_INVALID_UNCOMPRESSED_SIZE) {
			throw error;
		}
		await zipReader.close();
	} finally {
		await zip.terminateWorkers();
	}
}