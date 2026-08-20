import * as zip from "../zip-lib.js";

const GOOD_CONTENT = "good-content-".repeat(50);
const SEGMENT_SIZE = 400;

export { test };

// a reader whose data source fails partway through, to trigger the corrupted-entry recovery path
class FailingReader extends zip.Reader {

	constructor(failAfter) {
		super();
		this.failAfter = failAfter;
		this.size = 10000;
	}

	readUint8Array(offset) {
		if (offset >= this.failAfter) {
			throw new Error("simulated source failure");
		}
		return new Uint8Array(Math.min(1000, this.failAfter - offset));
	}
}

async function test() {
	// exercises the worker codec path: when an entry's source fails mid-write, the split
	// writable must not be left locked, so that the next entry can still be added
	zip.configure({ useWebWorkers: true });
	const writers = [];
	try {
		const zipWriter = new zip.ZipWriter(blobWriterGenerator());
		await zipWriter.add("good0.txt", new zip.TextReader(GOOD_CONTENT));
		// this entry fails mid-write; the offset of the next entry must not be corrupted
		try {
			await zipWriter.add("bad.txt", new FailingReader(500));
			throw new Error();
		} catch (error) {
			if (error.message != "simulated source failure") {
				throw error;
			}
		}
		await zipWriter.add("good1.txt", new zip.TextReader(GOOD_CONTENT));
		await zipWriter.close();
		const readers = await Promise.all(writers.map(async writer => new zip.BlobReader(await writer.getData())));
		const zipReader = new zip.ZipReader(new zip.SplitDataReader(readers));
		try {
			const entries = await zipReader.getEntries();
			const goodEntries = entries.filter(entry => entry.filename.startsWith("good"));
			if (goodEntries.length != 2) {
				throw new Error();
			}
			for (const entry of goodEntries) {
				const data = await entry.getData(new zip.TextWriter(), { checkCrc32: true });
				if (data != GOOD_CONTENT) {
					throw new Error();
				}
			}
		} finally {
			await zipReader.close();
		}
	} finally {
		await zip.terminateWorkers();
	}

	function* blobWriterGenerator() {
		while (true) {
			const writer = new zip.BlobWriter();
			writer.maxSize = SEGMENT_SIZE;
			writers.push(writer);
			yield writer;
		}
	}
}
