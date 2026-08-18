import * as zip from "../zip-lib.js";

export { test };

const EXTERNAL_FILE_ATTRIBUTES = (0o100755 << 16) >>> 0;
const INTERNAL_FILE_ATTRIBUTES = 1;

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	const CASES = [
		{
			name: "deprecated-names",
			options: {
				compressionMethod: 0,
				externalFileAttribute: EXTERNAL_FILE_ATTRIBUTES,
				internalFileAttribute: INTERNAL_FILE_ATTRIBUTES
			}
		},
		{
			name: "current-names",
			options: {
				compressionMethod: 0,
				externalFileAttributes: EXTERNAL_FILE_ATTRIBUTES,
				internalFileAttributes: INTERNAL_FILE_ATTRIBUTES
			}
		},
		{
			name: "current-names-win",
			options: {
				compressionMethod: 0,
				externalFileAttributes: EXTERNAL_FILE_ATTRIBUTES,
				externalFileAttribute: 0,
				internalFileAttributes: INTERNAL_FILE_ATTRIBUTES,
				internalFileAttribute: 0
			}
		}
	];

	for (const testCase of CASES) {
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter);
		const addedEntry = await zipWriter.add("hello.txt", new zip.TextReader("Hi"), testCase.options);
		await zipWriter.close();
		if (addedEntry.externalFileAttribute !== addedEntry.externalFileAttributes) {
			throw new Error(`${testCase.name}: ZipWriter#add should return externalFileAttribute (got ${addedEntry.externalFileAttribute})`);
		}
		if (addedEntry.internalFileAttribute !== addedEntry.internalFileAttributes) {
			throw new Error(`${testCase.name}: ZipWriter#add should return internalFileAttribute (got ${addedEntry.internalFileAttribute})`);
		}
		if ((addedEntry.externalFileAttributes >>> 0) !== EXTERNAL_FILE_ATTRIBUTES) {
			throw new Error(`${testCase.name}: ZipWriter#add externalFileAttributes mismatch (got ${(addedEntry.externalFileAttributes >>> 0).toString(16)})`);
		}
		const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
		const entries = await zipReader.getEntries();
		await zipReader.close();
		if (entries.length !== 1) {
			throw new Error(`${testCase.name}: expected 1 entry`);
		}
		const [entry] = entries;
		if ((entry.externalFileAttributes >>> 0) !== EXTERNAL_FILE_ATTRIBUTES) {
			throw new Error(`${testCase.name}: externalFileAttributes mismatch (got ${(entry.externalFileAttributes >>> 0).toString(16)})`);
		}
		if (entry.internalFileAttributes !== INTERNAL_FILE_ATTRIBUTES) {
			throw new Error(`${testCase.name}: internalFileAttributes mismatch (got ${entry.internalFileAttributes})`);
		}
		if (entry.externalFileAttribute !== entry.externalFileAttributes) {
			throw new Error(`${testCase.name}: externalFileAttribute should mirror externalFileAttributes (got ${entry.externalFileAttribute})`);
		}
		if (entry.internalFileAttribute !== entry.internalFileAttributes) {
			throw new Error(`${testCase.name}: internalFileAttribute should mirror internalFileAttributes (got ${entry.internalFileAttribute})`);
		}
	}

	const OTHER_EXTERNAL_FILE_ATTRIBUTES = (0o100600 << 16) >>> 0;
	const PRECEDENCE_CASES = [
		{ name: "writer-options", writerOptions: { externalFileAttribute: EXTERNAL_FILE_ATTRIBUTES }, options: {} },
		{
			name: "entry-deprecated-wins-over-writer",
			writerOptions: { externalFileAttributes: OTHER_EXTERNAL_FILE_ATTRIBUTES },
			options: { externalFileAttribute: EXTERNAL_FILE_ATTRIBUTES }
		},
		{
			name: "entry-current-wins-over-writer",
			writerOptions: { externalFileAttribute: OTHER_EXTERNAL_FILE_ATTRIBUTES },
			options: { externalFileAttributes: EXTERNAL_FILE_ATTRIBUTES }
		}
	];
	for (const testCase of PRECEDENCE_CASES) {
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter, testCase.writerOptions);
		await zipWriter.add("hello.txt", new zip.TextReader("Hi"), Object.assign({ compressionMethod: 0 }, testCase.options));
		await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
		const [entry] = await zipReader.getEntries();
		await zipReader.close();
		if ((entry.externalFileAttributes >>> 0) !== EXTERNAL_FILE_ATTRIBUTES) {
			throw new Error(`${testCase.name}: externalFileAttributes mismatch (got ${(entry.externalFileAttributes >>> 0).toString(16)})`);
		}
	}
	await zip.terminateWorkers();
}
