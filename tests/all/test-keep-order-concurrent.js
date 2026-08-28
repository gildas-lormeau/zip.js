/* global setTimeout, TextDecoder */

import * as zip from "../zip-lib.js";

export { test };

// a reader whose init() resolves after a delay, to mimic e.g. a slow HEAD request
class SlowReader extends zip.TextReader {
	constructor(text, delay) {
		super(text);
		this.delay = delay;
	}
	async init() {
		await new Promise(resolve => setTimeout(resolve, this.delay));
		return super.init();
	}
}

// a reader whose init() fails, to exercise the failure cleanup path
class FailingReader extends zip.Reader {
	async init() {
		await new Promise(resolve => setTimeout(resolve, 20));
		throw new Error("simulated reader init failure");
	}
	readUint8Array() {
		return new Uint8Array();
	}
}

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await testConcurrentOrder();
		await testPhysicalOrder();
		await testFailureDoesNotReorderOrPollute();
	} finally {
		await zip.terminateWorkers();
	}
}

// entries added concurrently must be listed in add() call order regardless of how fast
// each reader initializes
async function testConcurrentOrder() {
	for (let slowIndex = 0; slowIndex < 4; slowIndex++) {
		const blob = await writeZip(zipWriter => [0, 1, 2, 3].map(index => zipWriter.add(index + ".txt",
			index == slowIndex ? new SlowReader(String(index), 40) : new zip.TextReader(String(index)))));
		const { filenames, contents } = await readZip(blob);
		if (filenames != "0.txt,1.txt,2.txt,3.txt" || contents != "0,1,2,3") {
			throw new Error("slowIndex " + slowIndex + " -> " + filenames + " | " + contents);
		}
	}
}

// keepOrder also promises the physical order: the local file headers must follow the add() call
// order, whatever the readers do and whichever entries are stored instead of deflated
async function testPhysicalOrder() {
	for (const stored of [false, true]) {
		for (let slowIndex = 0; slowIndex < 4; slowIndex++) {
			const blob = await writeZip(zipWriter => [0, 1, 2, 3].map(index => zipWriter.add(index + ".txt",
				index == slowIndex ? new SlowReader(String(index), 40) : new zip.TextReader(String(index)),
				stored && index % 2 ? { level: 0 } : {})));
			const names = localHeaderNames(new Uint8Array(await blob.arrayBuffer()));
			if (names != "0.txt,1.txt,2.txt,3.txt") {
				throw new Error("stored " + stored + " slowIndex " + slowIndex + " -> " + names);
			}
			const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
			await zipReader.getEntries();
			const { warnings } = zipReader;
			await zipReader.close();
			if (warnings.length) {
				throw new Error(warnings.map(warning => warning.reason).join(","));
			}
		}
	}
}

function localHeaderNames(data) {
	const names = [];
	for (let offset = 0; offset + 30 < data.length; offset++) {
		if (data[offset] == 0x50 && data[offset + 1] == 0x4b && data[offset + 2] == 0x03 && data[offset + 3] == 0x04) {
			const filenameLength = data[offset + 26] | (data[offset + 27] << 8);
			names.push(new TextDecoder().decode(data.subarray(offset + 30, offset + 30 + filenameLength)));
		}
	}
	return names.join(",");
}

// a failed entry must not hang the batch, must not appear in the central directory, and
// must not reorder the surviving entries
async function testFailureDoesNotReorderOrPollute() {
	let results;
	const blob = await writeZip(zipWriter => {
		results = [
			zipWriter.add("first.txt", new SlowReader("first", 40)),
			zipWriter.add("bad.txt", new FailingReader()),
			zipWriter.add("last.txt", new zip.TextReader("last"))
		];
		return results.map(promise => promise.catch(() => { }));
	});
	const statuses = await Promise.allSettled(results);
	if (statuses.map(result => result.status).join(",") != "fulfilled,rejected,fulfilled") {
		throw new Error();
	}
	const { filenames, contents } = await readZip(blob);
	if (filenames != "first.txt,last.txt" || contents != "first,last") {
		throw new Error(filenames + " | " + contents);
	}
	const names = localHeaderNames(new Uint8Array(await blob.arrayBuffer()));
	if (names != "first.txt,last.txt") {
		throw new Error(names);
	}
}

async function writeZip(addEntries) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await Promise.all(addEntries(zipWriter));
	await zipWriter.close();
	return blobWriter.getData();
}

async function readZip(blob) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob), { checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	return {
		filenames: entries.map(entry => entry.filename).join(","),
		contents: contents.join(",")
	};
}
