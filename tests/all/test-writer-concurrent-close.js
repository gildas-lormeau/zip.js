// Locks the behaviour of concurrent `ZipWriter#close` calls: they share the same closing operation
// and all resolve to the zip file, instead of the second one failing on a locked stream. A close
// call that failed, e.g. on an invalid comment, must not prevent a later successful close.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";

export { test };

async function test() {
	try {
		await testConcurrentClose();
		await testRetryAfterFailure();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testConcurrentClose() {
	const writer = await createWriter();
	const results = await Promise.allSettled([writer.close(), writer.close()]);
	const rejected = results.find(result => result.status == "rejected");
	if (rejected) {
		throw new Error("a concurrent close call failed: " + rejected.reason.message);
	}
	const [first, second] = results.map(result => result.value);
	if (first.size != second.size || !(await isReadable(first))) {
		throw new Error("concurrent close calls returned different results");
	}
}

async function testRetryAfterFailure() {
	const writer = await createWriter();
	let caught;
	try {
		await writer.close("not a Uint8Array");
	} catch (error) {
		caught = error;
	}
	if (!caught || caught.message != zip.ERR_INVALID_COMMENT_TYPE) {
		throw new Error("expected an invalid comment type error, got " + (caught && caught.message));
	}
	const blob = await writer.close();
	if (!(await isReadable(blob))) {
		throw new Error("the close call after a failed one did not produce a readable zip file");
	}
}

async function createWriter() {
	const writer = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
	await writer.add("lorem.txt", new zip.TextReader(TEXT_CONTENT));
	return writer;
}

async function isReadable(blob) {
	const reader = new zip.ZipReader(new zip.BlobReader(blob));
	const entries = await reader.getEntries();
	const text = entries.length == 1 ? await entries[0].getData(new zip.TextWriter()) : "";
	await reader.close();
	return text == TEXT_CONTENT;
}
