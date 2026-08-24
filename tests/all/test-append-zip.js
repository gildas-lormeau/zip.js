import * as zip from "../zip-lib.js";

const LAST_MOD_DATE = new Date(2026, 0, 1, 12, 0, 0);

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });
	try {
		await appendsBetweenAddedEntries();
		await appendsSeveralZipFiles();
		await rejectsDuplicateFilenames();
		await serializesConcurrentCalls();
		await completesBeforeAnUnawaitedClose();
		await keepsThePrependZipGuard();
	} finally {
		await zip.terminateWorkers();
	}
}

async function appendsBetweenAddedEntries() {
	const source = await buildZipFile(["s1.txt", "s2.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter, "a.txt");
	await zipWriter.appendZip(new zip.Uint8ArrayReader(source));
	await addEntry(zipWriter, "b.txt");
	const output = await zipWriter.close();
	const directOutput = await buildZipFile(["a.txt", "s1.txt", "s2.txt", "b.txt"]);
	if (!equalBytes(output, directOutput)) {
		throw new Error("expected the same bytes as a direct write, got " + output.length + " vs " + directOutput.length + " bytes");
	}
	await checkEntries(output, ["a.txt", "s1.txt", "s2.txt", "b.txt"]);
}

async function appendsSeveralZipFiles() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.appendZip(new zip.Uint8ArrayReader(await buildZipFile(["x.txt"])));
	await zipWriter.appendZip(new zip.Uint8ArrayReader(await buildZipFile(["y.txt"])));
	await checkEntries(await zipWriter.close(), ["x.txt", "y.txt"]);
}

async function rejectsDuplicateFilenames() {
	const source = await buildZipFile(["s1.txt", "s2.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter, "s2.txt");
	let error;
	try {
		await zipWriter.appendZip(new zip.Uint8ArrayReader(source));
	} catch (appendError) {
		error = appendError;
	}
	if (!error || error.message != zip.ERR_DUPLICATED_NAME) {
		throw new Error("expected a duplicate filename error, got " + (error ? error.message : "no error"));
	}
	await addEntry(zipWriter, "s1.txt");
	await checkEntries(await zipWriter.close(), ["s2.txt", "s1.txt"]);
}

async function serializesConcurrentCalls() {
	const source = await buildZipFile(["s1.txt", "s2.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	const pendingAdd = addEntry(zipWriter, "a.txt");
	const pendingAppendZip = zipWriter.appendZip(new zip.Uint8ArrayReader(source));
	const pendingLateAdd = addEntry(zipWriter, "b.txt");
	await Promise.all([pendingAdd, pendingAppendZip, pendingLateAdd]);
	await checkEntries(await zipWriter.close(), ["a.txt", "s1.txt", "s2.txt", "b.txt"], { ignoreOrder: true });
}

async function completesBeforeAnUnawaitedClose() {
	const source = await buildZipFile(["s1.txt", "s2.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	zipWriter.appendZip(new zip.Uint8ArrayReader(source));
	await checkEntries(await zipWriter.close(), ["s1.txt", "s2.txt"]);
}

async function keepsThePrependZipGuard() {
	const source = await buildZipFile(["s1.txt"]);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await addEntry(zipWriter, "a.txt");
	let error;
	try {
		await zipWriter.prependZip(new zip.Uint8ArrayReader(source));
	} catch (prependError) {
		error = prependError;
	}
	await zipWriter.close();
	if (!error || error.message != zip.ERR_ZIP_NOT_EMPTY) {
		throw new Error("expected prependZip to reject a non-empty zip, got " + (error ? error.message : "no error"));
	}
}

async function buildZipFile(filenames) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (const filename of filenames) {
		await addEntry(zipWriter, filename);
	}
	return zipWriter.close();
}

function addEntry(zipWriter, filename) {
	return zipWriter.add(filename, new zip.TextReader("content of " + filename), { lastModDate: LAST_MOD_DATE });
}

async function checkEntries(data, expectedFilenames, { ignoreOrder } = {}) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict", checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	let filenames = entries.map(entry => entry.filename);
	if (ignoreOrder) {
		filenames = filenames.slice().sort();
		expectedFilenames = expectedFilenames.slice().sort();
	}
	if (filenames.join() != expectedFilenames.join()) {
		throw new Error("expected entries " + expectedFilenames.join() + ", got " + filenames.join());
	}
	if (!contents.every((content, entryIndex) => content == "content of " + entries[entryIndex].filename)) {
		throw new Error("expected the entry contents to be preserved");
	}
}

function equalBytes(first, second) {
	return first.length == second.length && first.every((byte, index) => byte == second[index]);
}
