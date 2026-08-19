import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "content";
const DEPTH = 500;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		for (const bufferedWrite of [true, false]) {
			await implicitDirectoriesAreNotExported(bufferedWrite);
			await sourceDirectoriesAreExported(bufferedWrite);
			await addedDirectoriesAreExported(bufferedWrite);
			await onlySourceDirectoriesSurviveAMixedTree(bufferedWrite);
			await exportedNamesAreStableAcrossRoundTrips(bufferedWrite);
		}
		await entryProgressCountsExportedEntriesOnly();
		await exportedSizeMatchesTheExport();
		await aDeepNameDoesNotAmplify();
	} finally {
		await zip.terminateWorkers();
	}
}

// a parent directory that exists only because an entry name contained a slash must not be
// written as an entry of its own: the source had no such entry, and writing one turns a single
// deep name into one entry per level, each storing its full path
async function implicitDirectoriesAreNotExported(bufferedWrite) {
	const fs = await importZip(zipWriter => zipWriter.add("a/b/c.txt", new zip.TextReader(TEXT_CONTENT)));
	await assertExportedNames(fs, ["a/b/c.txt"], bufferedWrite);
	if (!fs.find("a") || !fs.find("a").directory || !fs.find("a/b/c.txt")) {
		throw new Error("expected the implicit directories to stay navigable in the tree");
	}
}

async function sourceDirectoriesAreExported(bufferedWrite) {
	const fs = await importZip(async zipWriter => {
		await zipWriter.add("a/", undefined, { directory: true });
		await zipWriter.add("a/b/", undefined, { directory: true });
		await zipWriter.add("a/b/c.txt", new zip.TextReader(TEXT_CONTENT));
	});
	await assertExportedNames(fs, ["a/", "a/b/", "a/b/c.txt"], bufferedWrite);
}

async function addedDirectoriesAreExported(bufferedWrite) {
	const fs = new zip.fs.FS();
	fs.root.addDirectory("a").addDirectory("b").addText("c.txt", TEXT_CONTENT);
	await assertExportedNames(fs, ["a/", "a/b/", "a/b/c.txt"], bufferedWrite);
}

async function onlySourceDirectoriesSurviveAMixedTree(bufferedWrite) {
	const fs = await importZip(async zipWriter => {
		await zipWriter.add("a/", undefined, { directory: true });
		await zipWriter.add("a/b/c.txt", new zip.TextReader(TEXT_CONTENT));
	});
	await assertExportedNames(fs, ["a/", "a/b/c.txt"], bufferedWrite);
}

// the first export used to add the missing directories, so re-importing it produced a different
// archive than the one that had just been exported
async function exportedNamesAreStableAcrossRoundTrips(bufferedWrite) {
	let fs = await importZip(zipWriter => zipWriter.add("a/b/c.txt", new zip.TextReader(TEXT_CONTENT)));
	for (let round = 0; round < 3; round++) {
		const blob = await fs.exportBlob({ bufferedWrite });
		await assertNames(blob, ["a/b/c.txt"]);
		fs = new zip.fs.FS();
		await fs.importBlob(blob);
	}
}

async function entryProgressCountsExportedEntriesOnly() {
	const fs = await importZip(zipWriter => zipWriter.add("a/b/c.txt", new zip.TextReader(TEXT_CONTENT)));
	const ticks = [];
	await fs.exportBlob({ onentryprogress: (index, total) => ticks.push(index + "/" + total) });
	if (ticks.join() != "1/1") {
		throw new Error("expected the entry total to ignore the implicit directories, got " + ticks.join());
	}
}

async function exportedSizeMatchesTheExport() {
	const fs = await importZip(zipWriter => zipWriter.add("a/b/c.txt", new zip.TextReader(TEXT_CONTENT), { level: 0 }));
	const options = { level: 0, keepOrder: true };
	const predictedSize = await fs.getExportedSize(options);
	const blob = await fs.exportBlob(options);
	if (predictedSize != blob.size) {
		throw new Error("expected the predicted size " + predictedSize + " to match the exported size " + blob.size);
	}
}

async function aDeepNameDoesNotAmplify() {
	const filename = "d/".repeat(DEPTH) + "f.txt";
	const sourceBlob = await writeZip(zipWriter => zipWriter.add(filename, new zip.TextReader(TEXT_CONTENT)));
	const fs = new zip.fs.FS();
	await fs.importBlob(sourceBlob);
	const exportedBlob = await fs.exportBlob();
	await assertNames(exportedBlob, [filename]);
	if (exportedBlob.size > sourceBlob.size * 2) {
		throw new Error("expected no amplification, got " + sourceBlob.size + " bytes in and " + exportedBlob.size + " bytes out");
	}
}

async function assertExportedNames(fs, expectedNames, bufferedWrite) {
	await assertNames(await fs.exportBlob({ bufferedWrite }), expectedNames);
}

async function assertNames(blob, expectedNames) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
	const names = (await zipReader.getEntries()).map(entry => entry.filename);
	await zipReader.close();
	if (names.sort().join() != expectedNames.sort().join()) {
		throw new Error("expected the entries " + expectedNames.join() + ", got " + names.join());
	}
}

async function importZip(addEntries) {
	const fs = new zip.fs.FS();
	await fs.importBlob(await writeZip(addEntries));
	return fs;
}

async function writeZip(addEntries) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await addEntries(zipWriter);
	await zipWriter.close();
	return blobWriter.getData();
}
