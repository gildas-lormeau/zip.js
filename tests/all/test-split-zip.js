/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const TEXT_CONTENT_REPEAT = 1024;
const BLOB = new Blob([new Array(TEXT_CONTENT_REPEAT).fill(TEXT_CONTENT).join("")]);

export { test };

function* blobWriterGenerator(writers) {
	while (true) {
		const writer = new zip.BlobWriter();
		writer.maxSize = (8192 - 512) + Math.floor(Math.random() * 1024);
		writers.push(writer);
		yield writer;
	}
}

async function test() {
	zip.configure({ chunkSize: 1024, useWebWorkers: true });
	try {
		await testConcurrentAdds();
		await testBufferedFirstEntry();
		await testSpanningCentralDirectory();
		await testSpanningCentralDirectory(true);
	} finally {
		await zip.terminateWorkers();
	}
}

async function testConcurrentAdds() {
	const writers = [];
	const splitZipWriter = blobWriterGenerator(writers);
	const zipWriter = new zip.ZipWriter(splitZipWriter);
	await Promise.all([
		zipWriter.add("lorem1.txt", new zip.BlobReader(BLOB)),
		zipWriter.add("lorem2.txt", new zip.BlobReader(BLOB)),
		zipWriter.add("lorem3.txt", new zip.BlobReader(BLOB))
	]);
	await zipWriter.close();
	const results = await readEntries(writers);
	if (results.includes(false)) {
		throw new Error();
	}
}

// the first entry consumes the spanning signature flag on the buffered path,
// which must write the signature while holding the writer lock
async function testBufferedFirstEntry() {
	const writers = [];
	const splitZipWriter = blobWriterGenerator(writers);
	const zipWriter = new zip.ZipWriter(splitZipWriter);
	zipWriter.add("lorem1.txt", new zip.BlobReader(BLOB), { bufferedWrite: true });
	zipWriter.add("lorem2.txt", new zip.BlobReader(BLOB));
	await zipWriter.close();
	const firstDiskData = new Uint8Array(await writers[0].getData().then(blob => blob.arrayBuffer()));
	const signature = [0x50, 0x4b, 0x07, 0x08];
	const startsWithSignature = signature.every((value, offset) => firstDiskData[offset] == value);
	const duplicatedSignature = signature.every((value, offset) => firstDiskData[offset + 4] == value);
	const results = await readEntries(writers);
	if (!startsWithSignature || duplicatedSignature || results.length != 2 || results.includes(false)) {
		throw new Error("expected the spanning signature to be written once at the start of the first disk");
	}
}

// the "entries on this disk" fields of the end of central directory records must contain
// the number of central directory records stored on the last disk, not the total
async function testSpanningCentralDirectory(zip64) {
	const ENTRY_COUNT = 6;
	const ENTRY_LENGTH = 100;
	const writers = [];
	function* uint8ArrayWriterGenerator() {
		while (true) {
			const writer = new zip.Uint8ArrayWriter();
			writer.maxSize = 150;
			writers.push(writer);
			yield writer;
		}
	}
	const zipWriter = new zip.ZipWriter(uint8ArrayWriterGenerator(), { zip64 });
	for (let indexEntry = 0; indexEntry < ENTRY_COUNT; indexEntry++) {
		await zipWriter.add("entry" + indexEntry + ".bin", new zip.Uint8ArrayReader(new Uint8Array(ENTRY_LENGTH)), { level: 0 });
	}
	await zipWriter.close();
	const disks = writers.map(writer => writer.getData());
	const directoryRecordsPerDisk = disks.map(disk => countSignatures(disk, 0x02014b50));
	const lastDisk = disks[disks.length - 1];
	const lastDiskView = new DataView(lastDisk.buffer, lastDisk.byteOffset, lastDisk.byteLength);
	const endOfDirectoryOffset = findLastSignature(lastDisk, lastDiskView, 0x06054b50);
	let entriesLastDisk = lastDiskView.getUint16(endOfDirectoryOffset + 8, true);
	let entriesTotal = lastDiskView.getUint16(endOfDirectoryOffset + 10, true);
	if (zip64) {
		if (entriesLastDisk != 0xffff || entriesTotal != 0xffff) {
			throw new Error("expected zip64 sentinel entry counts in the end of central directory record");
		}
		const zip64EndOfDirectoryOffset = findLastSignature(lastDisk, lastDiskView, 0x06064b50);
		entriesLastDisk = Number(lastDiskView.getBigUint64(zip64EndOfDirectoryOffset + 24, true));
		entriesTotal = Number(lastDiskView.getBigUint64(zip64EndOfDirectoryOffset + 32, true));
	}
	const zipReader = new zip.ZipReader(new zip.SplitDataReader(disks.map(disk => new zip.Uint8ArrayReader(disk))));
	const entries = await zipReader.getEntries();
	const results = await Promise.all(entries.map(async entry => (await entry.getData(new zip.Uint8ArrayWriter())).length == ENTRY_LENGTH));
	await zipReader.close();
	if (directoryRecordsPerDisk.filter(recordCount => recordCount > 0).length < 2 ||
		entriesTotal != ENTRY_COUNT ||
		entriesLastDisk != directoryRecordsPerDisk[directoryRecordsPerDisk.length - 1] ||
		entries.length != ENTRY_COUNT || results.includes(false)) {
		throw new Error("expected the entry count of the last disk in the end of central directory record");
	}
}

function countSignatures(data, signature) {
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	let result = 0;
	for (let offset = 0; offset + 4 <= data.length; offset++) {
		if (view.getUint32(offset, true) == signature) {
			result++;
		}
	}
	return result;
}

function findLastSignature(data, view, signature) {
	for (let offset = data.length - 4; offset >= 0; offset--) {
		if (view.getUint32(offset, true) == signature) {
			return offset;
		}
	}
	throw new Error("signature not found");
}

async function readEntries(writers) {
	const readers = await Promise.all(writers.map(async writer => new zip.BlobReader(await writer.getData())));
	const zipReader = new zip.ZipReader(new zip.SplitDataReader(readers));
	const entries = await zipReader.getEntries();
	const results = await Promise.all(entries.map(async entry => (await entry.getData(new zip.TextWriter())).length == TEXT_CONTENT.length * TEXT_CONTENT_REPEAT));
	await zipReader.close();
	return results;
}