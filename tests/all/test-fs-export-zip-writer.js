import * as zip from "../zip-lib.js";

const { WARNING_COMPRESSION_UNAVAILABLE } = zip;
const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(64);
const NO_DEFLATE = { CompressionStream: null, CompressionStreamFallback: null, useCompressionStream: false };

export { test };

async function test() {
	try {
		await exportsIntoACallerSuppliedZipWriter();
		await leavesTheArchiveOpenForTheCaller();
		await reportsTheWarningsOfTheExport();
		await reportsTheCentralDirectoryProgress();
		await composesSeveralTreesIntoOneArchive();
		await keepsTheBufferedWriteChoiceOfTheWriter();
		await takesTheWriterOptionsAsDefaults();
		await predictsTheSizeOfASuppliedWriterExport();
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

// getExportedSize computes the archive the export would build for a writer it creates itself, where
// bufferedWrite defaults to true. A supplied writer defaults it to false, which adds a data descriptor per
// entry, so the two only agree once the same value is passed to both. The stated use of the prediction is a
// Content-Length, where being short truncates the response, so the difference is worth pinning.
async function predictsTheSizeOfASuppliedWriterExport() {
	for (const bufferedWrite of [false, true]) {
		const options = { level: 0, bufferedWrite };
		const predicted = await buildFileSystem().getExportedSize(options);
		const blobWriter = new zip.BlobWriter();
		const zipWriter = new zip.ZipWriter(blobWriter);
		await buildFileSystem().exportZip(zipWriter, options);
		await zipWriter.close();
		const written = (await blobWriter.getData()).size;
		if (predicted != written) {
			throw new Error("expected the prediction to match the export with bufferedWrite " + bufferedWrite +
				", predicted " + predicted + " and wrote " + written);
		}
	}
}

// the symmetric counterpart of importZip accepting a ZipReader: the entries land in the writer the caller
// owns, and the promise resolves to that writer rather than to the data of a writer it does not have
async function exportsIntoACallerSuppliedZipWriter() {
	const fs = buildFileSystem();
	const blobWriter = new zip.BlobWriter();
	const zipWriter = new zip.ZipWriter(blobWriter);
	const returned = await fs.exportZip(zipWriter);
	assert(returned === zipWriter, "the promise must resolve to the ZipWriter it was passed");
	const blob = await zipWriter.close();
	assertFilenames(await readFilenames(blob), ["lorem.txt", "folder/", "folder/ipsum.txt"]);
}

// the caller owns the writer, so the export must not close it: closing here would make the two composition
// cases below impossible and would close a writer the caller may still be using
async function leavesTheArchiveOpenForTheCaller() {
	const fs = buildFileSystem();
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter());
	await fs.exportZip(zipWriter);
	await zipWriter.add("added-after.txt", new zip.TextReader(TEXT_CONTENT));
	const blob = await zipWriter.close();
	assertFilenames(await readFilenames(blob), ["lorem.txt", "folder/", "folder/ipsum.txt", "added-after.txt"]);
}

// the reason the hatch exists: with no deflate implementation reachable the writer stores the entries and
// deposits a warning, and before this the filesystem API had no way to reach it. SingleFile builds its
// archives through this API and shipped an all-STORE archive twice with nothing to notice it by
async function reportsTheWarningsOfTheExport() {
	zip.resetConfiguration();
	zip.configure(Object.assign({ useWebWorkers: false }, NO_DEFLATE));
	const fs = buildFileSystem();
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter());
	await fs.exportZip(zipWriter);
	const { warnings } = zipWriter;
	await zipWriter.close();
	assert(warnings.some(warning => warning.reason == WARNING_COMPRESSION_UNAVAILABLE),
		"the export must report the unavailable compression, got " + JSON.stringify(warnings));
	zip.resetConfiguration();
}

// the progress reported while the central directory is written, which ZipWriterCloseOptions#onprogress
// carries and no export* method could reach: forwarding it through the options of the export was never the
// answer, because those already carry the byte-level onprogress and the same function would be called with
// two signatures. Owning the close call settles it, the caller passing the handler where it belongs
async function reportsTheCentralDirectoryProgress() {
	const fs = buildFileSystem();
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter());
	await fs.exportZip(zipWriter);
	const calls = [];
	await zipWriter.close(undefined, {
		onprogress: (index, total, entry) => {
			calls.push({ index, total, filename: entry.filename });
		}
	});
	assert(calls.length == 3, "the central directory of 3 entries must report 3 times, got " + calls.length);
	assert(calls.every(call => call.total == 3), "every call must report the total, got " + JSON.stringify(calls));
	assert(calls.map(call => call.index).join() == "1,2,3", "the calls must count up, got " + JSON.stringify(calls));
	assertFilenames(calls.map(call => call.filename), ["lorem.txt", "folder/", "folder/ipsum.txt"]);
}

// exporting twice into the same writer is the composition the open archive buys, and the names must not
// collide, so each tree is exported under its own root
async function composesSeveralTreesIntoOneArchive() {
	const fs = new zip.ZipFS();
	fs.addText("first/one.txt", TEXT_CONTENT);
	fs.addText("second/two.txt", TEXT_CONTENT);
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter());
	await fs.getChildByName("first").exportZip(zipWriter, { relativePath: false });
	await fs.getChildByName("second").exportZip(zipWriter, { relativePath: false });
	const blob = await zipWriter.close();
	assertFilenames(await readFilenames(blob), ["first/one.txt", "second/two.txt"]);
}

// the export defaults bufferedWrite to true, and it passes its options to every add call, so injecting that
// default unconditionally would override the choice made on a writer the caller configured. The choice is
// visible in the output: a buffered entry knows its sizes before its local header is written and carries no
// data descriptor, an unbuffered one carries it
async function keepsTheBufferedWriteChoiceOfTheWriter() {
	const fs = buildFileSystem();
	const unbuffered = new zip.ZipWriter(new zip.BlobWriter(), { bufferedWrite: false });
	await fs.exportZip(unbuffered);
	const unbufferedEntries = await readFileEntries(await unbuffered.close());
	assert(unbufferedEntries.every(entry => entry.bitFlag.dataDescriptor),
		"bufferedWrite false on the writer must survive the export, got " + JSON.stringify(unbufferedEntries.map(entry => entry.bitFlag.dataDescriptor)));
	const buffered = new zip.ZipWriter(new zip.BlobWriter(), { bufferedWrite: true });
	await fs.exportZip(buffered);
	const bufferedEntries = await readFileEntries(await buffered.close());
	assert(bufferedEntries.every(entry => !entry.bitFlag.dataDescriptor),
		"bufferedWrite true on the writer must survive the export, got " + JSON.stringify(bufferedEntries.map(entry => entry.bitFlag.dataDescriptor)));
}

// nothing merges the options of the writer into the export: they keep governing the entries through the
// writer-level fallback ZipWriter#add already applies, and the options passed to exportZip win over them,
// which is the same precedence as a direct call to add
async function takesTheWriterOptionsAsDefaults() {
	const fs = buildFileSystem();
	const inherited = new zip.ZipWriter(new zip.BlobWriter(), { level: 0 });
	await fs.exportZip(inherited);
	const inheritedEntries = await readEntries(await inherited.close());
	assert(inheritedEntries.every(entry => entry.compressionMethod === 0),
		"the level of the writer must keep governing the entries, got " + JSON.stringify(inheritedEntries.map(entry => entry.compressionMethod)));
	const overridden = new zip.ZipWriter(new zip.BlobWriter(), { level: 0 });
	await fs.exportZip(overridden, { level: 9 });
	const overriddenEntries = await readEntries(await overridden.close());
	assert(overriddenEntries.some(entry => entry.compressionMethod === 8),
		"the option passed to exportZip must win over the option of the writer, got " + JSON.stringify(overriddenEntries.map(entry => entry.compressionMethod)));
}

function buildFileSystem() {
	const fs = new zip.ZipFS();
	fs.addText("lorem.txt", TEXT_CONTENT);
	fs.addDirectory("folder").addText("ipsum.txt", TEXT_CONTENT);
	return fs;
}

async function readEntries(blob) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	return entries;
}

async function readFilenames(blob) {
	return (await readEntries(blob)).map(entry => entry.filename);
}

async function readFileEntries(blob) {
	return (await readEntries(blob)).filter(entry => !entry.directory);
}

function assertFilenames(filenames, expected) {
	assert(filenames.length == expected.length && expected.every(name => filenames.includes(name)),
		"the archive must hold " + JSON.stringify(expected) + ", got " + JSON.stringify(filenames));
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}
