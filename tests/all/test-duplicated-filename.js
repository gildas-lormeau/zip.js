import * as zip from "../../index.js";

const FILENAME = "lorem.txt";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
	try {
		await Promise.all([
			zipWriter.add(FILENAME, new zip.TextReader("")),
			zipWriter.add(FILENAME, new zip.TextReader(""))
		]);
	} catch (error) {
		if (error.message == zip.ERR_DUPLICATED_NAME) {
			return;
		}
	} finally {
		await zipWriter.close();
		zip.terminateWorkers();
	}
	throw new Error();
}