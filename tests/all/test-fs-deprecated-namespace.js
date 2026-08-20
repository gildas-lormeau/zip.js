import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	if (zip.fs.FS != zip.ZipFS || zip.fs.ZipDirectoryEntry != zip.ZipDirectoryEntry || zip.fs.ZipFileEntry != zip.ZipFileEntry) {
		throw new Error();
	}
	const filesystem = new zip.fs.FS();
	const file = filesystem.addText(FILENAME, TEXT_CONTENT);
	const directory = filesystem.addDirectory("dir");
	if (!(filesystem instanceof zip.ZipFS) || !(file instanceof zip.ZipFileEntry) || !(directory instanceof zip.ZipDirectoryEntry)) {
		throw new Error();
	}
	if (!(file instanceof zip.ZipEntry) || !(directory instanceof zip.ZipEntry)) {
		throw new Error();
	}
	const blob = await filesystem.exportBlob();
	const importedFilesystem = new zip.fs.FS();
	await importedFilesystem.importBlob(blob);
	await zip.terminateWorkers();
	if (await importedFilesystem.find(FILENAME).getText() != TEXT_CONTENT) {
		throw new Error();
	}
}
