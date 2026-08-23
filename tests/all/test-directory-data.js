/* global URL, fetch */

import * as zip from "../zip-lib.js";

const FIXTURE_URL = new URL("./../data/directory-data.zip", import.meta.url).href;

export { test };

// The fixture was written with java.util.zip.ZipOutputStream: the entry "dir/" carries 7 bytes of
// data, an MS-DOS versionMadeBy and zeroed external attributes. The directory flag must be derived
// from the trailing slash alone, like Info-ZIP, 7-Zip, bsdtar and Python do, so that "dir/file.txt"
// does not collide with a file node named "dir" when the zip file is imported.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		const fixture = new Uint8Array(await (await fetch(FIXTURE_URL)).arrayBuffer());
		const [directoryEntry, fileEntry] = await readEntries(fixture);
		if (!directoryEntry.directory || directoryEntry.filename != "dir/" || !directoryEntry.uncompressedSize) {
			throw new Error("an entry with a trailing slash and data must be reported as a directory");
		}
		if (fileEntry.directory || fileEntry.filename != "dir/file.txt") {
			throw new Error("the file below the directory must be reported as a file");
		}
		const zipFs = new zip.ZipFS();
		await zipFs.importUint8Array(fixture);
		const [directoryNode] = zipFs.root.children;
		if (!directoryNode.directory || directoryNode.name != "dir") {
			throw new Error("the import must build a directory node");
		}
		const [fileNode] = directoryNode.children;
		if (await fileNode.getText() != "hello") {
			throw new Error("the file below the directory must keep its content");
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function readEntries(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	try {
		return await zipReader.getEntries();
	} finally {
		await zipReader.close();
	}
}
