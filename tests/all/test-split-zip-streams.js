/* global Blob */

// index.d.ts declares Reader[], ReadableReader[] and ReadableStream[] wherever an array of disks is
// accepted, but only the first form ever worked: SplitDataReader needs a size and readUint8Array on
// every element to map a global offset onto a disk, and a stream has neither. The elements are now
// buffered the same way a single stream source is, so the three declared forms behave alike.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const TEXT_CONTENT_REPEAT = 64;
const CONTENT = new Array(TEXT_CONTENT_REPEAT).fill(TEXT_CONTENT).join("");
const FILENAMES = ["lorem1.txt", "lorem2.txt"];

export { test };

async function test() {
	zip.configure({ chunkSize: 1024, useWebWorkers: true });
	const disks = await buildSplitZip();
	await readSplitZip(disks.map(disk => new zip.BlobReader(disk)), "Reader[]");
	await readSplitZip(disks.map(disk => ({ readable: disk.stream() })), "ReadableReader[]");
	await readSplitZip(disks.map(disk => disk.stream()), "ReadableStream[]");
	await zip.terminateWorkers();
}

async function buildSplitZip() {
	const writers = [];
	const zipWriter = new zip.ZipWriter(blobWriterGenerator(writers));
	for (const filename of FILENAMES) {
		await zipWriter.add(filename, new zip.BlobReader(new Blob([CONTENT])));
	}
	await zipWriter.close();
	return Promise.all(writers.map(writer => writer.getData()));
}

function* blobWriterGenerator(writers) {
	while (true) {
		const writer = new zip.BlobWriter();
		writer.maxSize = 2048;
		writers.push(writer);
		yield writer;
	}
}

async function readSplitZip(disks, description) {
	const zipReader = new zip.ZipReader(disks);
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	const filenames = entries.map(entry => entry.filename);
	if (filenames.join() != FILENAMES.join()) {
		throw new Error("expected " + FILENAMES.join() + " from " + description + " got " + filenames.join());
	}
	if (contents.some(content => content != CONTENT)) {
		throw new Error("unexpected content from " + description);
	}
}
