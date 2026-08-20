import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "content";
const DEPTH = 5000;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		// a deeply nested tree, as produced by a single hostile entry name,
		// must be exportable without exhausting the call stack
		const filename = "a/".repeat(DEPTH) + "f.txt";
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter);
		await zipWriter.add(filename, new zip.TextReader(TEXT_CONTENT));
		await zipWriter.close();
		const fs = new zip.ZipFS();
		await fs.importBlob(await blobWriter.getData());
		const exportedBlob = await fs.exportBlob();
		const importedFs = new zip.ZipFS();
		await importedFs.importBlob(exportedBlob);
		const fileEntry = importedFs.find(filename);
		if (!fileEntry || await fileEntry.getText() != TEXT_CONTENT) {
			throw new Error();
		}
	} finally {
		await zip.terminateWorkers();
	}
}
