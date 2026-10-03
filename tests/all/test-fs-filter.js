/* global Blob */

import * as zip from "../zip-lib.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });
	const zipFs = new zip.ZipFS();
	zipFs.addText("root.txt", "root");
	const directoryA = zipFs.addDirectory("a");
	directoryA.addText("a.txt", "a");
	const directoryB = zipFs.addDirectory("b");
	directoryB.addText("b.txt", "b");
	directoryB.addDirectory("c").addText("c.txt", "c");
	const fullBlob = await zipFs.exportBlob();
	const fullNames = await getEntryNames(fullBlob);
	await checkExportFilter(zipFs, fullNames);
	await checkExportSize(zipFs);
	await checkExportUnconsumedReadable();
	await checkImportFilter(fullBlob);
	await checkImportFilterOnData(fullBlob);
	await checkImportFilterBeforeDuplicates(fullBlob);
	await checkImportFilterError(fullBlob);
	await checkInvalidFilter(zipFs, fullBlob);
	await zip.terminateWorkers();
}

async function checkExportFilter(zipFs, fullNames) {
	const visited = [];
	let entryTotal, entryCount = 0;
	const blob = await zipFs.exportBlob({
		filter: entry => {
			visited.push(entry.getFullname());
			return entry.name != "b";
		},
		onentryprogress: (progress, total) => {
			entryCount = progress;
			entryTotal = total;
		}
	});
	const names = await getEntryNames(blob);
	if (names.join() != "a/,a/a.txt,root.txt" && names.join() != "root.txt,a/,a/a.txt") {
		throw new Error("unexpected export " + names.join());
	}
	if (visited.includes("b/b.txt") || visited.includes("b/c") || !visited.includes("b")) {
		throw new Error("unexpected visit " + visited.join());
	}
	if (entryTotal != 3 || entryCount != 3) {
		throw new Error("unexpected entry total " + entryTotal + " " + entryCount);
	}
	if (fullNames.length != 7 || !zipFs.getChildByName("b") || zipFs.getChildByName("b").children.length != 2) {
		throw new Error("tree changed");
	}
	const directoriesBlob = await zipFs.exportBlob({ filter: async entry => entry.directory });
	if ((await getEntryNames(directoriesBlob)).sort().join() != "a/,b/,b/c/") {
		throw new Error("unexpected directories export");
	}
}

async function checkExportSize(zipFs) {
	for (const bufferedWrite of [true, false]) {
		const options = { bufferedWrite, level: 0, filter: entry => entry.name != "c" && entry.name != "root.txt" };
		const size = await zipFs.getExportedSize(options);
		const blob = await zipFs.exportBlob(options);
		if (size != blob.size) {
			throw new Error("unexpected size " + size + " " + blob.size);
		}
	}
}

async function checkExportUnconsumedReadable() {
	const zipFs = new zip.ZipFS();
	zipFs.addText("kept.txt", "kept");
	zipFs.addReadable("stream.txt", new Blob(["stream"]).stream());
	const filter = entry => entry.name == "kept.txt";
	await zipFs.exportBlob({ filter });
	await zipFs.exportBlob({ filter });
	const blob = await zipFs.exportBlob();
	if ((await getEntryNames(blob)).sort().join() != "kept.txt,stream.txt") {
		throw new Error("stream entry lost");
	}
	const imported = new zip.ZipFS();
	await imported.importBlob(blob);
	if (await imported.getChildByName("stream.txt").getText() != "stream") {
		throw new Error("stream content lost");
	}
}

async function checkImportFilter(fullBlob) {
	let zipFs = new zip.ZipFS();
	const seen = [];
	await zipFs.importBlob(fullBlob, {
		filter: entry => {
			seen.push(entry.filename);
			return entry.filename.startsWith("b/");
		}
	});
	if (seen.length != 7) {
		throw new Error("filter not called on every entry");
	}
	if (zipFs.children.length != 1 || zipFs.children[0].name != "b") {
		throw new Error("unexpected import root");
	}
	if (zipFs.find("b/b.txt") === undefined || zipFs.find("b/c/c.txt") === undefined || zipFs.find("a") !== undefined) {
		throw new Error("unexpected import tree");
	}
	zipFs = new zip.ZipFS();
	await zipFs.importBlob(fullBlob, { filter: entry => entry.filename == "b/c/c.txt" });
	const directoryB = zipFs.getChildByName("b");
	if (!directoryB || !directoryB.directory || directoryB.data !== null || zipFs.find("b/c/c.txt") === undefined || zipFs.children.length != 1) {
		throw new Error("implicit parent directory missing");
	}
}

async function checkImportFilterOnData(fullBlob) {
	const zipFs = new zip.ZipFS();
	await zipFs.importBlob(fullBlob, {
		filter: async entry => !entry.directory && await entry.getData(new zip.TextWriter()) == "c"
	});
	if (zipFs.getChildren({ recursive: true }).filter(entry => !entry.directory).length != 1 || !zipFs.find("b/c/c.txt")) {
		throw new Error("data filter failed");
	}
}

async function checkImportFilterBeforeDuplicates(fullBlob) {
	const directory = new zip.ZipFS().addDirectory("target");
	directory.addText("root.txt", "existing");
	await directory.importBlob(fullBlob, { filter: entry => entry.filename != "root.txt" });
	if (await directory.getChildByName("root.txt").getText() != "existing" || !directory.getChildByName("a").getChildByName("a.txt")) {
		throw new Error("filtered entry reached the duplicates policy");
	}
}

async function checkImportFilterError(fullBlob) {
	const zipFs = new zip.ZipFS();
	zipFs.addText("existing.txt", "existing");
	const failure = new Error("filter failure");
	let caught;
	try {
		await zipFs.importBlob(fullBlob, {
			filter: entry => {
				if (entry.filename == "b/c/c.txt") {
					throw failure;
				}
				return true;
			}
		});
	} catch (error) {
		caught = error;
	}
	if (caught !== failure || caught.cause.entry.filename != "b/c/c.txt") {
		throw new Error("filter error not propagated");
	}
	if (zipFs.children.length != 1 || zipFs.children[0].name != "existing.txt") {
		throw new Error("import not rolled back");
	}
}

async function checkInvalidFilter(zipFs, fullBlob) {
	for (const run of [
		() => zipFs.exportBlob({ filter: "a" }),
		() => zipFs.getExportedSize({ filter: 1 }),
		() => new zip.ZipFS().importBlob(fullBlob, { filter: "a" })
	]) {
		let caught;
		try {
			await run();
		} catch (error) {
			caught = error;
		}
		if (!caught || caught.message != zip.ERR_INVALID_FUNCTION_OPTION) {
			throw new Error("invalid filter accepted");
		}
	}
	const unchanged = await zipFs.exportBlob({ filter: null });
	if ((await getEntryNames(unchanged)).length != 7) {
		throw new Error("falsy filter not ignored");
	}
}

async function getEntryNames(blob) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	return entries.map(entry => entry.filename);
}
