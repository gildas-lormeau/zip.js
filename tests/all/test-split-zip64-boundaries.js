import * as zip from "../zip-lib.js";

const CONTENT = new Uint8Array(1050).map((value, index) => index & 255);
const FIRST_SEGMENT_SIZE = 150;
const LAST_SEGMENT_SIZE = 270;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		for (let maxSize = FIRST_SEGMENT_SIZE; maxSize < LAST_SEGMENT_SIZE; maxSize++) {
			const writers = [];
			const zipWriter = new zip.ZipWriter(blobWriterGenerator(writers, maxSize), { zip64: true });
			await zipWriter.add("data.bin", new zip.Uint8ArrayReader(CONTENT), { level: 0 });
			await zipWriter.close();
			const readers = await Promise.all(writers.map(async writer => new zip.BlobReader(await writer.getData())));
			const zipReader = new zip.ZipReader(new zip.SplitDataReader(readers));
			const entries = await zipReader.getEntries();
			const result = await entries[0].getData(new zip.Uint8ArrayWriter());
			await zipReader.close();
			if (result.length != CONTENT.length || result.some((value, index) => value != CONTENT[index])) {
				throw new Error("invalid data (maxSize " + maxSize + ")");
			}
		}
	} finally {
		await zip.terminateWorkers();
	}
}

function* blobWriterGenerator(writers, maxSize) {
	while (true) {
		const writer = new zip.BlobWriter();
		writer.maxSize = maxSize;
		writers.push(writer);
		yield writer;
	}
}
