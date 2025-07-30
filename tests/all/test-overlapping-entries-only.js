/* global fetch, URL */

import * as zip from "../../index.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const readable = (await fetch(new URL("../data/lorem-overlapping-entries.zip", import.meta.url))).body;
	const zipReader = new zip.ZipReader(readable, { checkOverlappingEntryOnly: true });
	const entries = await zipReader.getEntries();
	try {
		for (const entry of entries) {
			await entry.getData();
		}
		throw new Error();
	} catch (error) {
		if (error.message !== zip.ERR_OVERLAPPING_ENTRY) {
			throw error;
		}
	} finally {
		await zipReader.close();
		await zip.terminateWorkers();
	}
}