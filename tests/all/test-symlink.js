import * as zip from "../zip-lib.js";

export { test };

const SYMLINK_UNIX_MODE = 0o120777;
const LINK_TARGET = "../shared/target.txt";

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add("link.txt", new zip.TextReader(LINK_TARGET), { unixMode: SYMLINK_UNIX_MODE, level: 0 });
	await zipWriter.add("link-raw.txt", new zip.TextReader(LINK_TARGET), { externalFileAttributes: ((SYMLINK_UNIX_MODE << 16) >>> 0), level: 0 });
	await zipWriter.add("regular.txt", new zip.TextReader("Hi"), { unixMode: 0o100644 });
	await zipWriter.add("executable.txt", new zip.TextReader("Hi"), { executable: true });
	await zipWriter.add("msdos.txt", new zip.TextReader("Hi"), { msDosCompatible: true });
	await zipWriter.add("directory/", new zip.TextReader(""), { directory: true });
	await zipWriter.close();

	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const entriesByName = new Map(entries.map(entry => [entry.filename, entry]));
	const SYMLINK_NAMES = ["link.txt", "link-raw.txt"];
	for (const filename of SYMLINK_NAMES) {
		const entry = entriesByName.get(filename);
		if (!entry.symlink) {
			throw new Error(`${filename}: expected symlink`);
		}
		if (entry.directory) {
			throw new Error(`${filename}: expected directory to be false`);
		}
		const target = await entry.getData(new zip.TextWriter());
		if (target !== LINK_TARGET) {
			throw new Error(`${filename}: link target mismatch (got ${target})`);
		}
	}
	for (const filename of ["regular.txt", "executable.txt", "msdos.txt", "directory/"]) {
		if (entriesByName.get(filename).symlink) {
			throw new Error(`${filename}: expected symlink to be false`);
		}
	}
	await zipReader.close();
	await zip.terminateWorkers();
}
