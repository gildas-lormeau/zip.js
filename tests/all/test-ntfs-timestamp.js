/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });
const IN_RANGE_DATE = new Date(2021, 0, 1, 12, 30, 20);
const OUT_OF_RANGE_DATE = new Date(2040, 4, 15, 12, 30, 20);

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const defaultEntry = await writeAndReadEntry({ lastModDate: IN_RANGE_DATE });
	if (defaultEntry.extraFieldNTFS || !defaultEntry.extraFieldExtendedTimestamp ||
		defaultEntry.lastModDate.getTime() != IN_RANGE_DATE.getTime()) {
		throw new Error();
	}
	const outOfRangeEntry = await writeAndReadEntry({ lastModDate: OUT_OF_RANGE_DATE });
	if (!outOfRangeEntry.extraFieldNTFS || outOfRangeEntry.extraFieldExtendedTimestamp ||
		outOfRangeEntry.lastModDate.getTime() != OUT_OF_RANGE_DATE.getTime()) {
		throw new Error();
	}
	const creationDateEntry = await writeAndReadEntry({ lastModDate: IN_RANGE_DATE, creationDate: IN_RANGE_DATE });
	if (!creationDateEntry.extraFieldNTFS || creationDateEntry.creationDate.getTime() != IN_RANGE_DATE.getTime()) {
		throw new Error();
	}
	const forcedEntry = await writeAndReadEntry({ lastModDate: IN_RANGE_DATE }, { ntfsTimestamp: true });
	if (!forcedEntry.extraFieldNTFS) {
		throw new Error();
	}
	const disabledEntry = await writeAndReadEntry({ lastModDate: IN_RANGE_DATE, creationDate: IN_RANGE_DATE, ntfsTimestamp: false });
	if (disabledEntry.extraFieldNTFS || !disabledEntry.extraFieldExtendedTimestamp) {
		throw new Error();
	}
	await zip.terminateWorkers();
}

async function writeAndReadEntry(options, writerOptions = {}) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, writerOptions);
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB), options);
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	return entries[0];
}
