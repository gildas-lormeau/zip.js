/* global Blob, TransformStream, setTimeout, clearTimeout */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME_1 = "first.txt";
const FILENAME_2 = "second.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: "text/plain" });
const DEADLOCK_TIMEOUT = 10000;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, {
		// an asynchronous temp stream opens a window between the buffered-write branch
		// check and the bufferedWrites increment when they are not ordered correctly
		createTempStream: async () => {
			await new Promise(resolve => setTimeout(resolve, 20));
			return new TransformStream(undefined, undefined, { highWaterMark: Infinity });
		}
	});
	let timeoutId;
	const result = await Promise.race([
		(async () => {
			await Promise.all([
				zipWriter.add(FILENAME_1, new zip.BlobReader(BLOB), { bufferedWrite: true }),
				zipWriter.add(FILENAME_2, new zip.BlobReader(BLOB))
			]);
			await zipWriter.close();
			return "done";
		})(),
		new Promise(resolve => timeoutId = setTimeout(() => resolve("deadlock"), DEADLOCK_TIMEOUT))
	]);
	clearTimeout(timeoutId);
	if (result != "done") {
		throw new Error(result);
	}
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()), { checkCrc32: true });
	const entries = await zipReader.getEntries();
	const [firstText, secondText] = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	await zip.terminateWorkers();
	if (entries.length != 2 ||
		entries[0].filename != FILENAME_1 || entries[1].filename != FILENAME_2 ||
		firstText != TEXT_CONTENT || secondText != TEXT_CONTENT) {
		throw new Error();
	}
}
