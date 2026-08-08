/* global fetch, URL */

import * as zip from "../zip-lib.js";

export { test };

async function test() {
	const bytes = new Uint8Array(await (await fetch(new URL("../data/malformed-cd-offset-negative.zip", import.meta.url))).arrayBuffer());
	const reader = new zip.ZipReader(new zip.Uint8ArrayReader(bytes));
	let error;
	try {
		await reader.getEntries();
	} catch (thrown) {
		error = thrown;
	} finally {
		try {
			await reader.close();
		} catch {
			// the archive never opened
		}
	}
	if (!error || error.message != zip.ERR_BAD_FORMAT) {
		throw new Error("expected " + zip.ERR_BAD_FORMAT + ", got " + (error && error.message));
	}
}
