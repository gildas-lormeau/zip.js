/* global TextEncoder, navigator, setTimeout */

import * as zip from "../zip-lib.js";

export { test };

// Errors of add()/appendZip() calls whose promise was never consumed must be thrown by close(),
// while errors the caller already caught (await, .catch()) must not resurface there.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await throwsUnawaitedAddErrorsOnClose();
		await keepsCaughtErrorsSilentOnClose();
		await throwsUnawaitedAppendZipErrorOnClose();
		await waitsForQueuedEntriesOnClose();
	} finally {
		await zip.terminateWorkers();
	}
}

async function throwsUnawaitedAddErrorsOnClose() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	zipWriter.add("first.txt", createFailingReader("first error"));
	zipWriter.add("second.txt", createFailingReader("second error"));
	await zipWriter.add("ok.txt", new zip.TextReader("content"));
	let error;
	try {
		await zipWriter.close();
	} catch (closeError) {
		error = closeError;
	}
	if (!error || error.message != "first error" || error.entryErrors.length != 2 || error.entryErrors[1].message != "second error") {
		throw new Error("expected close() to throw the unawaited entry errors, got " + (error ? error.message : "no error"));
	}
	const data = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = await zipReader.getEntries();
	const content = await entries.find(entry => entry.filename == "ok.txt").getData(new zip.TextWriter());
	await zipReader.close();
	if (content != "content") {
		throw new Error("expected close() to finalize the zip file once the errors were reported");
	}
}

async function keepsCaughtErrorsSilentOnClose() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	try {
		await zipWriter.add("awaited.txt", createFailingReader("awaited error"));
	} catch {
		// the entry is skipped on purpose
	}
	zipWriter.add("handled.txt", createFailingReader("handled error")).catch(() => { });
	await zipWriter.add("ok.txt", new zip.TextReader("content"));
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(await zipWriter.close()));
	const entries = await zipReader.getEntries();
	const content = await entries.find(entry => entry.filename == "ok.txt").getData(new zip.TextWriter());
	await zipReader.close();
	if (content != "content") {
		throw new Error("expected close() to stay silent about caught errors and keep the valid entries");
	}
}

async function throwsUnawaitedAppendZipErrorOnClose() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	zipWriter.appendZip(new zip.Uint8ArrayReader(new Uint8Array([1, 2, 3, 4])));
	let error;
	try {
		await zipWriter.close();
	} catch (closeError) {
		error = closeError;
	}
	if (!error || error.entryErrors.length != 1) {
		throw new Error("expected close() to throw the unawaited appendZip error, got " + (error ? error.message : "no error"));
	}
}

async function waitsForQueuedEntriesOnClose() {
	zip.configure({ maxWorkers: 1 });
	try {
		let releaseGate;
		const gate = new Promise(resolve => releaseGate = resolve);
		const stallingReader = new zip.Uint8ArrayReader(new TextEncoder().encode("slow content"));
		const readUint8Array = stallingReader.readUint8Array.bind(stallingReader);
		stallingReader.readUint8Array = async (...args) => {
			await gate;
			return readUint8Array(...args);
		};
		const busyWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		const pendingSlowAdd = busyWriter.add("slow.txt", stallingReader);
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		zipWriter.add("queued.txt", new zip.TextReader("queued content"));
		setTimeout(releaseGate, 100);
		const data = await zipWriter.close();
		await pendingSlowAdd;
		await busyWriter.close();
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		const [entry] = await zipReader.getEntries();
		const content = await entry.getData(new zip.TextWriter());
		await zipReader.close();
		if (entry.filename != "queued.txt" || content != "queued content") {
			throw new Error("expected close() to wait for the entry queued on the worker pool");
		}
	} finally {
		zip.configure({ maxWorkers: (typeof navigator != "undefined" && navigator.hardwareConcurrency) || 2 });
	}
}

function createFailingReader(message) {
	const reader = new zip.Uint8ArrayReader(new TextEncoder().encode("data"));
	reader.readUint8Array = () => {
		throw new Error(message);
	};
	return reader;
}
