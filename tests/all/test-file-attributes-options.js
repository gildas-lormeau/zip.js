import * as zip from "../zip-lib.js";

export { test };

const EXTERNAL_FILE_ATTRIBUTES = (0o100755 << 16) >>> 0;
const OTHER_EXTERNAL_FILE_ATTRIBUTES = (0o100600 << 16) >>> 0;
const INTERNAL_FILE_ATTRIBUTES = 1;

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	const addedEntry = await writeEntry({}, {
		compressionMethod: 0,
		externalFileAttributes: EXTERNAL_FILE_ATTRIBUTES,
		internalFileAttributes: INTERNAL_FILE_ATTRIBUTES
	});
	if ((addedEntry.externalFileAttributes >>> 0) !== EXTERNAL_FILE_ATTRIBUTES) {
		throw new Error(`ZipWriter#add externalFileAttributes mismatch (got ${(addedEntry.externalFileAttributes >>> 0).toString(16)})`);
	}
	if (addedEntry.internalFileAttributes !== INTERNAL_FILE_ATTRIBUTES) {
		throw new Error(`ZipWriter#add internalFileAttributes mismatch (got ${addedEntry.internalFileAttributes})`);
	}

	const PRECEDENCE_CASES = [
		{ name: "writer-options", writerOptions: { externalFileAttributes: EXTERNAL_FILE_ATTRIBUTES }, options: {} },
		{
			name: "entry-wins-over-writer",
			writerOptions: { externalFileAttributes: OTHER_EXTERNAL_FILE_ATTRIBUTES },
			options: { externalFileAttributes: EXTERNAL_FILE_ATTRIBUTES }
		}
	];
	for (const testCase of PRECEDENCE_CASES) {
		const entry = await readEntry(testCase.writerOptions, Object.assign({ compressionMethod: 0 }, testCase.options));
		if ((entry.externalFileAttributes >>> 0) !== EXTERNAL_FILE_ATTRIBUTES) {
			throw new Error(`${testCase.name}: externalFileAttributes mismatch (got ${(entry.externalFileAttributes >>> 0).toString(16)})`);
		}
	}
	await zip.terminateWorkers();
}

async function writeEntry(writerOptions, options) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, writerOptions);
	const entry = await zipWriter.add("hello.txt", new zip.TextReader("Hi"), options);
	await zipWriter.close();
	entry.data = await blobWriter.getData();
	return entry;
}

async function readEntry(writerOptions, options) {
	const { data } = await writeEntry(writerOptions, options);
	const zipReader = new zip.ZipReader(new zip.BlobReader(data));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	if (entries.length !== 1) {
		throw new Error("expected 1 entry");
	}
	return entries[0];
}
