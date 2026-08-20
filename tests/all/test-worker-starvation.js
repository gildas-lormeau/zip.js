/* global TransformStream, setTimeout, clearTimeout, navigator */

import * as zip from "../zip-lib.js";

const ENTRIES_LENGTH = 4;
const MAX_WORKERS = 2;
const CONTENTS = new Array(ENTRIES_LENGTH).fill().map((_, indexContent) => ("entry" + indexContent).repeat(20000));
const TEST_TIMEOUT = 20000;

export { test };

async function test() {
	zip.configure({ maxWorkers: MAX_WORKERS, workerStarvationTimeout: 100, chunkSize: 1024 });
	try {
		const srcBlobWriter = new zip.BlobWriter("application/zip");
		const srcWriter = new zip.ZipWriter(srcBlobWriter);
		for (let indexContent = 0; indexContent < ENTRIES_LENGTH; indexContent++) {
			await srcWriter.add("file" + indexContent + ".txt", new zip.TextReader(CONTENTS[indexContent]));
		}
		await srcWriter.close();
		const zipReader = new zip.ZipReader(new zip.BlobReader(await srcBlobWriter.getData()));
		const entries = await zipReader.getEntries();
		const destBlobWriter = new zip.BlobWriter("application/zip");
		const destWriter = new zip.ZipWriter(destBlobWriter);
		// copying more entries concurrently than available codecs would deadlock without starvation detection
		let timeout;
		await Promise.race([
			Promise.all(entries.map(entry => {
				const { readable, writable } = new TransformStream();
				return Promise.all([destWriter.add(entry.filename, readable), entry.getData(writable)]);
			})),
			new Promise((_, reject) => timeout = setTimeout(() => reject(new Error("deadlock")), TEST_TIMEOUT))
		]);
		clearTimeout(timeout);
		await destWriter.close();
		await zipReader.close();
		const destReader = new zip.ZipReader(new zip.BlobReader(await destBlobWriter.getData()));
		const destEntries = await destReader.getEntries();
		if (destEntries.length != ENTRIES_LENGTH) {
			throw new Error();
		}
		for (const entry of destEntries) {
			const data = await entry.getData(new zip.TextWriter(), { checkCrc32: true });
			if (data != CONTENTS[Number(entry.filename.match(/\d+/)[0])]) {
				throw new Error();
			}
		}
		await destReader.close();
	} finally {
		zip.configure({
			maxWorkers: (typeof navigator != "undefined" && navigator.hardwareConcurrency) || 2,
			workerStarvationTimeout: 5000
		});
		await zip.terminateWorkers();
	}
}
