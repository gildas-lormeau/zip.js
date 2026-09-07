/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const FILENAME = "lorem.txt";
const ODD_SECOND = new Date(2025, 0, 1, 12, 0, 1);
const ODD_SECOND_ROUNDED = new Date(2025, 0, 1, 12, 0, 2);
const EVEN_SECOND_FRACTION = new Date(2025, 0, 1, 12, 0, 0, 123);
const EVEN_SECOND = new Date(2025, 0, 1, 12, 0, 0);
const ODD_SECOND_FRACTION = new Date(2025, 0, 1, 12, 0, 1, 500);
const PAST_MSDOS_CEILING = new Date(2200, 5, 15, 12);
const MSDOS_CEILING = new Date(2107, 11, 31, 23, 59, 58);

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await testCase(ODD_SECOND, ODD_SECOND_ROUNDED, { extendedTimestamp: false });
		await testCase(EVEN_SECOND_FRACTION, EVEN_SECOND, { extendedTimestamp: false });
		await testCase(ODD_SECOND_FRACTION, ODD_SECOND_ROUNDED, { extendedTimestamp: false });
		await testCase(ODD_SECOND_FRACTION, ODD_SECOND, {});
		await testCase(PAST_MSDOS_CEILING, MSDOS_CEILING, { extendedTimestamp: false });
	} finally {
		await zip.terminateWorkers();
	}
}

async function testCase(lastModDate, expectedDate, options) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	const metadata = await zipWriter.add(FILENAME, new zip.BlobReader(new Blob([TEXT_CONTENT])), Object.assign({ lastModDate }, options));
	await zipWriter.close();
	if (metadata.lastModDate.getTime() != expectedDate.getTime()) {
		throw new Error("the writer reported " + metadata.lastModDate.toISOString() + " instead of " + expectedDate.toISOString());
	}
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	try {
		const entries = await zipReader.getEntries();
		if (entries[0].lastModDate.getTime() != expectedDate.getTime()) {
			throw new Error();
		}
	} finally {
		await zipReader.close();
	}
}
