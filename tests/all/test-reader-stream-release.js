/* global ReadableStream, setTimeout, clearTimeout */

import * as zip from "../zip-lib.js";
import { readTextFromReadable } from "../stream-helpers.js";

export { test };

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ".repeat(64);
const ENTRIES_COUNT = 6;
const MAX_WORKERS = 2;
// Small enough that an entry spans many chunks, so a codec left on an entry the consumer does not
// read blocks on backpressure instead of fitting in the buffer of the stream and completing anyway.
const CHUNK_SIZE = 64;
const TIMEOUT = 5000;

// A ZipReaderStream must not hold a codec on an entry the consumer never reads. It decompresses an
// entry on demand, so skipping one costs nothing, and cancelling the entries stream releases the
// entry being read, the generator behind it and the source, so a partial read does not outlive the
// stream. Every check runs with fewer workers than entries, so a codec left running starves the read
// that follows it, and with the starvation fallback disabled, since it would otherwise serve that
// read inline after workerStarvationTimeout and hide the leak behind a delay.
//
// The readables of the entries that are deliberately not read are collected and cancelled at the
// end: they release nothing when the library already did, and on a regression they release the
// codecs it leaked, so terminateWorkers() resolves and the failure is reported instead of hanging
// the runner, which awaits it after every test.
async function test() {
	zip.configure({
		useWebWorkers: true,
		maxWorkers: MAX_WORKERS,
		chunkSize: CHUNK_SIZE,
		terminateWorkerTimeout: 0,
		workerStarvationTimeout: Infinity
	});
	const unreadReadables = [];
	try {
		await checkSkippedEntriesReleaseTheirCodec(unreadReadables);
		await checkCancelReleasesTheEntryBeingRead(unreadReadables);
		await checkCancelDoesNotWaitForTheSource();
		await checkEveryEntryStillReadsInOrder();
	} finally {
		await Promise.allSettled(unreadReadables.map(readable => readable.locked ? undefined : readable.cancel()));
		await zip.terminateWorkers();
	}
}

// Reading only the last entry of an archive holding more entries than the pool holds workers is the
// "extract one file" pattern; it stalls as soon as a skipped entry keeps a codec.
async function checkSkippedEntriesReleaseTheirCodec(unreadReadables) {
	const data = await buildArchive();
	const lastFilename = filenameOf(ENTRIES_COUNT - 1);
	let content;
	await withTimeout((async () => {
		for await (const entry of readableOf(data).pipeThrough(new zip.ZipReaderStream())) {
			if (entry.filename == lastFilename) {
				content = await readTextFromReadable(entry.readable);
			} else {
				unreadReadables.push(entry.readable);
			}
		}
	})(), "reading the last entry of " + ENTRIES_COUNT + " with " + MAX_WORKERS + " workers");
	assert(content == contentOf(ENTRIES_COUNT - 1), "the entry that is read must hold its content");
	await withTimeout(zip.terminateWorkers(), "terminateWorkers() after skipped entries");
}

async function checkCancelReleasesTheEntryBeingRead(unreadReadables) {
	const data = await buildArchive();
	const reader = readableOf(data).pipeThrough(new zip.ZipReaderStream()).getReader();
	const { value: entry } = await reader.read();
	const entryReader = entry.readable.getReader();
	await entryReader.read();
	entryReader.releaseLock();
	unreadReadables.push(entry.readable);
	await withTimeout(reader.cancel(), "cancelling the entries stream while an entry is being read");
	await withTimeout(zip.terminateWorkers(), "terminateWorkers() after a cancelled read");
}

// The generator buffers the source before yielding, so a cancel that waits for it to finish blocks
// for as long as the archive takes to arrive.
async function checkCancelDoesNotWaitForTheSource() {
	const data = await buildArchive();
	let delivered = 0;
	const source = new ReadableStream({
		async pull(controller) {
			if (delivered == data.length) {
				controller.close();
			} else {
				const end = Math.min(delivered + CHUNK_SIZE, data.length);
				controller.enqueue(data.slice(delivered, end));
				delivered = end;
				await delay(20);
			}
		}
	});
	const reader = source.pipeThrough(new zip.ZipReaderStream()).getReader();
	const entryPromise = reader.read();
	entryPromise.catch(() => { });
	await delay(100);
	const deliveredOnCancel = delivered;
	assert(deliveredOnCancel < data.length, "the source must still be streaming when cancel() is called");
	await withTimeout(reader.cancel(), "cancelling the entries stream while the source is streaming");
	await delay(100);
	assert(delivered == deliveredOnCancel, "cancelling the entries stream must stop the source, " +
		deliveredOnCancel + " bytes were delivered on cancel and " + delivered + " afterwards");
}

async function checkEveryEntryStillReadsInOrder() {
	const data = await buildArchive();
	const contents = [];
	await withTimeout((async () => {
		for await (const entry of readableOf(data).pipeThrough(new zip.ZipReaderStream())) {
			contents.push(await readTextFromReadable(entry.readable));
		}
	})(), "reading every entry");
	assert(contents.length == ENTRIES_COUNT, "every entry must be streamed, got " + contents.length);
	contents.forEach((content, index) =>
		assert(content == contentOf(index), "entry " + index + " must hold its content"));
}

async function buildArchive() {
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	for (let index = 0; index < ENTRIES_COUNT; index++) {
		await writer.add(filenameOf(index), new zip.TextReader(contentOf(index)));
	}
	const data = await writer.close();
	await zip.terminateWorkers();
	return data;
}

function readableOf(data) {
	return new ReadableStream({
		start(controller) {
			controller.enqueue(data);
			controller.close();
		}
	});
}

function filenameOf(index) {
	return "file" + index + ".txt";
}

function contentOf(index) {
	return TEXT_CONTENT + index;
}

function delay(duration) {
	return new Promise(resolve => setTimeout(resolve, duration));
}

async function withTimeout(promise, label) {
	let timeoutId;
	const timeout = new Promise((_, reject) =>
		timeoutId = setTimeout(() => reject(new Error(label + " did not settle within " + TIMEOUT + "ms")), TIMEOUT));
	try {
		return await Promise.race([promise, timeout]);
	} finally {
		clearTimeout(timeoutId);
	}
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}
