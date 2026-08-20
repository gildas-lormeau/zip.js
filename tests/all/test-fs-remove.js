import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const fs = new zip.ZipFS();
	const directory = fs.addDirectory("dir");
	const subDirectory = directory.addDirectory("sub");
	const file = subDirectory.addText("f.txt", TEXT_CONTENT);
	const sibling = fs.addText("sibling.txt", TEXT_CONTENT);
	fs.remove(directory);
	// the removed directory and all its descendants must be unregistered and detached
	if (fs.getById(directory.id) || fs.getById(subDirectory.id) || fs.getById(file.id) ||
		fs.find("dir") || fs.find("dir/sub/f.txt") || directory.parent) {
		throw new Error();
	}
	// other entries must not be affected
	if (fs.getById(sibling.id) != sibling || fs.find("sibling.txt") != sibling) {
		throw new Error();
	}
	fs.remove(sibling);
	if (fs.getById(sibling.id) || fs.find("sibling.txt") || fs.children.length) {
		throw new Error();
	}
	const blob = await fs.exportBlob();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	await zip.terminateWorkers();
	if (entries.length) {
		throw new Error();
	}
}
