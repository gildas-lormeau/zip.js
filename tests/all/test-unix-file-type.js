import * as zip from "../zip-lib.js";

export { test };

const TYPE_MASK = 0o170000;
const TYPE_FILE = 0o100000;
const TYPE_DIR = 0o040000;
const TYPE_SYMLINK = 0o120000;

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	const CASES = [
		{ name: "default.txt", options: {}, type: TYPE_FILE },
		{ name: "executable.txt", options: { executable: true }, type: TYPE_FILE },
		{ name: "mode-without-type.txt", options: { unixMode: 0o600 }, type: TYPE_FILE },
		{ name: "mode-with-type.txt", options: { unixMode: 0o100600 }, type: TYPE_FILE },
		{ name: "symlink.txt", options: { unixMode: 0o120777 }, type: TYPE_SYMLINK },
		{ name: "directory/", options: { directory: true }, type: TYPE_DIR },
		{ name: "verbatim.txt", options: { externalFileAttributes: 0 }, type: 0 }
	];

	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	for (const testCase of CASES) {
		await zipWriter.add(testCase.name, new zip.TextReader("Hi"), testCase.options);
	}
	await zipWriter.close();

	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entriesByName = new Map((await zipReader.getEntries()).map(entry => [entry.filename, entry]));
	await zipReader.close();
	for (const testCase of CASES) {
		const entry = entriesByName.get(testCase.name);
		const type = ((entry.externalFileAttributes >>> 16) & TYPE_MASK);
		if (type !== testCase.type) {
			throw new Error(`${testCase.name}: expected file type ${testCase.type.toString(8)}, got ${type.toString(8)}`);
		}
	}
	const msDosBlobWriter = new zip.BlobWriter("application/zip");
	const msDosZipWriter = new zip.ZipWriter(msDosBlobWriter, { msDosCompatible: true });
	await msDosZipWriter.add("msdos.txt", new zip.TextReader("Hi"));
	await msDosZipWriter.close();
	const msDosZipReader = new zip.ZipReader(new zip.BlobReader(await msDosBlobWriter.getData()));
	const [msDosEntry] = await msDosZipReader.getEntries();
	await msDosZipReader.close();
	if ((msDosEntry.externalFileAttributes >>> 16) !== 0) {
		throw new Error("msdos.txt: expected no Unix mode");
	}
	await zip.terminateWorkers();
}
