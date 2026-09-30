/* global fetch, URL */

import * as zip from "../zip-lib.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const readable = (await fetch(new URL("../data/lorem-overlapping-entries.zip", import.meta.url))).body;
	// the first entry of the fixture announces a data descriptor it does not carry, see test-overlapping-entries.js
	const zipReader = new zip.ZipReader(readable, { checkOverlappingEntryOnly: true, checkLocalDirectory: false });
	const entries = await zipReader.getEntries();
	try {
		for (const entry of entries) {
			await entry.getData();
		}
		throw new Error();
	} catch (error) {
		if (error.message != zip.ERR_OVERLAPPING_ENTRY) {
			throw error;
		}
	} finally {
		await zipReader.close();
		await zip.terminateWorkers();
	}
}