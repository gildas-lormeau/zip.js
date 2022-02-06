import * as zip from "../../index.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128 });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blobWriter.getData()));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	return entries.length == 0;
}