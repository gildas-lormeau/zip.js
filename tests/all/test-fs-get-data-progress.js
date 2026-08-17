/* global Blob, btoa, TextDecoder */

// Locks the progress callbacks of the read accessors of a file entry. `onstart`, `onprogress` and
// `onend` are documented on every `get*` method, so they must be called whatever the entry was
// created from, not only for the entries imported from a zip file. They must also be called once
// per read: an imported entry is read by the core reader, which already reports its own progress.
// Each entry is read with an accessor that does not match the `add*` method used to create it,
// because a matching accessor returns the stored data instead of reading it.

import * as zip from "../zip-lib.js";

const CONTENT = new Uint8Array(256 * 1024).fill(65);
const TEXT_CONTENT = new TextDecoder().decode(CONTENT);
const FILENAME = "lorem.txt";

export { test };

async function test() {
	try {
		const zipFs = new zip.fs.FS();
		const entries = [
			[zipFs.addText("text.txt", TEXT_CONTENT), (entry, options) => entry.getUint8Array(options)],
			[zipFs.addBlob("blob.bin", new Blob([CONTENT])), (entry, options) => entry.getUint8Array(options)],
			[zipFs.addUint8Array("array.bin", CONTENT), (entry, options) => entry.getText(null, options)],
			[zipFs.addData64URI("uri.bin", "data:;base64," + btoa(TEXT_CONTENT)), (entry, options) => entry.getUint8Array(options)],
			[zipFs.addReadable("readable.bin", new Blob([CONTENT]).stream()), (entry, options) => entry.getUint8Array(options)]
		];
		for (const [entry, read] of entries) {
			await testProgress(entry.name, options => read(entry, options));
		}
		const importedFs = new zip.fs.FS();
		await importedFs.importBlob(await createSourceBlob());
		const imported = importedFs.getChildByName(FILENAME);
		await testProgress(FILENAME, options => imported.getText(null, options));
	} finally {
		await zip.terminateWorkers();
	}
}

async function createSourceBlob() {
	const zipFs = new zip.fs.FS();
	zipFs.addText(FILENAME, TEXT_CONTENT);
	return zipFs.exportBlob();
}

async function testProgress(name, read) {
	const starts = [];
	const ends = [];
	let previousProgress = 0;
	let progressCount = 0;
	await read({
		onstart: total => starts.push(total),
		onprogress: progress => {
			if (progress < previousProgress) {
				throw new Error("progress went backwards for " + name);
			}
			previousProgress = progress;
			progressCount++;
		},
		onend: computedSize => ends.push(computedSize)
	});
	if (starts.length != 1 || ends.length != 1) {
		throw new Error("expected one onstart and one onend for " + name);
	}
	if (!progressCount || previousProgress != ends[0]) {
		throw new Error("unexpected progress for " + name);
	}
}
