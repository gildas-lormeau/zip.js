/* global fetch, URL */

import * as zip from "../zip-lib.js";

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		const bytes = new Uint8Array(await (await fetch(new URL("../data/malformed-local-header.zip", import.meta.url))).arrayBuffer());
		const reader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes));
		const [entry] = await reader.getEntries();
		let error;
		try {
			await entry.getData(new zip.Uint8ArrayWriter());
		} catch (thrown) {
			error = thrown;
		} finally {
			await reader.close();
		}
		if (!error || error.message != zip.ERR_LOCAL_FILE_HEADER_NOT_FOUND) {
			throw new Error("expected " + zip.ERR_LOCAL_FILE_HEADER_NOT_FOUND + ", got " + (error && error.message));
		}
	} finally {
		await zip.terminateWorkers();
	}
}
