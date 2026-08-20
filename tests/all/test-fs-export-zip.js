import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "folder/lorem.txt";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		const fs = new zip.ZipFS();
		fs.addText(FILENAME, TEXT_CONTENT);
		// FS.exportZip writes to a caller-supplied writer, mirroring FS.importZip
		const blobWriter = new zip.BlobWriter("application/zip");
		await fs.exportZip(blobWriter);
		const blob = await blobWriter.getData();
		// FS.importZip reads from a caller-supplied reader
		const importedFs = new zip.ZipFS();
		// a pre-existing entry must be cleared: importZip replaces the tree like the other import* methods
		importedFs.addText("stale.txt", "stale");
		await importedFs.importZip(new zip.BlobReader(blob));
		const fileEntry = importedFs.find(FILENAME);
		if (!fileEntry || await fileEntry.getText() != TEXT_CONTENT) {
			throw new Error();
		}
		if (importedFs.find("stale.txt")) {
			throw new Error("importZip did not reset the filesystem tree");
		}
	} finally {
		await zip.terminateWorkers();
	}
}
