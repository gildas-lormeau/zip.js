/* global AbortController */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet";
const FILENAME = "lorem.txt";

export { test };

// A signal already aborted when the operation starts must be honored without relying on the signal
// option of pipeTo, which the engines below its support floor ignore silently.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await checkWriterRejects();
		await checkReaderRejects();
		await checkWriterRejectsWithoutReason();
		await checkUnabortedSignalStillWorks();
	} finally {
		await zip.terminateWorkers();
	}
}

async function checkWriterRejects() {
	const reason = new Error("aborted before add");
	const controller = new AbortController();
	controller.abort(reason);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	const error = await captureError(() => zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), { signal: controller.signal }));
	assert(error === reason, "add() must reject with the reason of an already aborted signal");
}

async function checkReaderRejects() {
	const data = await buildArchive();
	const reason = new Error("aborted before getData");
	const controller = new AbortController();
	controller.abort(reason);
	const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	try {
		const [entry] = await reader.getEntries();
		const error = await captureError(() => entry.getData(new zip.TextWriter(), { signal: controller.signal }));
		assert(error === reason, "getData() must reject with the reason of an already aborted signal");
	} finally {
		await reader.close();
	}
}

async function checkWriterRejectsWithoutReason() {
	const controller = new AbortController();
	const signal = { aborted: true, reason: undefined, addEventListener: controller.signal.addEventListener.bind(controller.signal) };
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	const error = await captureError(() => zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), { signal }));
	assert(error.name == "AbortError", "a signal aborted without a reason must reject with an AbortError, got " + error.name);
	assert(error.message == zip.ERR_ABORTED, "the error message must be " + JSON.stringify(zip.ERR_ABORTED) + ", got " + JSON.stringify(error.message));
}

async function checkUnabortedSignalStillWorks() {
	const controller = new AbortController();
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), { signal: controller.signal });
	const data = await zipWriter.close();
	const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	try {
		const [entry] = await reader.getEntries();
		const content = await entry.getData(new zip.TextWriter(), { signal: controller.signal });
		assert(content == TEXT_CONTENT, "a signal that is not aborted must not interfere");
	} finally {
		await reader.close();
	}
}

async function buildArchive() {
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await writer.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	return writer.close();
}

async function captureError(run) {
	try {
		await run();
	} catch (error) {
		return error;
	}
	throw new Error("the operation must not resolve");
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}
