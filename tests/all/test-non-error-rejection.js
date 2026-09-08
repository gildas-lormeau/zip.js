/* global WritableStream, ReadableStream, crypto, structuredClone, DOMException, setTimeout */

// A stream cancelled or aborted without a reason rejects with undefined, and a caller aborting one
// is free to pass any value at all. zip.js annotates a codec failure with the number of bytes that
// reached the writer, which only an object can carry, so every reason that cannot carry it has to
// reach the caller unchanged rather than be replaced by the TypeError raised while annotating it.
// REASONS are all primitive on purpose, and the falsy ones doubly so: a falsy reason used to be
// read as "no failure" and made close() return a truncated archive with no error at all. An object
// is not automatically safe either, hence UNANNOTATABLE_REASONS.

import * as zip from "../zip-lib.js";

const REASONS = [undefined, null, "cancelled", 42, 0, ""];
const UNANNOTATABLE_REASONS = [
	() => Object.freeze(new Error("frozen")),
	() => Object.seal(new Error("sealed")),
	() => Object.defineProperty(new Error("read-only"), "outputSize", { value: 0, writable: false })
];
const ENTRY_NAME = "big.bin";
const DATA_LENGTH = 1024 * 1024;
const RANDOM_VALUES_MAX_LENGTH = 65536;
const READ_CHUNKS_BEFORE_CANCEL = 3;
const FAILING_CHUNK_LENGTH = 262144;
const GOOD_ENTRY_NAME = "good.txt";
const GOOD_CONTENT = "good content";
const LOCAL_HEADER_SIGNATURE = [0x50, 0x4b, 0x03, 0x04];
const SLOW_SINK_DELAY = 12;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const END_OF_CENTRAL_DIRECTORY_LENGTH = 22;
const CENTRAL_DIRECTORY_OFFSET_FIELD = 16;
const LOCAL_HEADER_OFFSET_FIELD = 42;

export { test };

async function test() {
	try {
		const data = createIncompressibleData();
		const archive = await createArchive(data);
		await propagatesWriterCancelReason(data);
		await propagatesUnannotatableReason(data);
		await reportsWriterCancelWithWorkers(data);
		await reportsEntryFailureOnClose();
		await keepsEntryOffsetsCorrectAfterFailure(data);
		await keepsWriterAccountingExactAfterFailure(data);
		await propagatesReaderAbortReason(archive);
		await reportsReaderAbortWithWorkers(archive);
	} finally {
		await zip.terminateWorkers();
	}
}

async function propagatesWriterCancelReason(data) {
	for (const reason of REASONS) {
		const result = await cancelWriterStream(data, reason, false);
		assertRejectedWith(result, reason, "cancelling the readable of a ZipWriterStream");
	}
}

// an object is not enough to carry the annotation either: a frozen or sealed error, or one already
// carrying a read-only outputSize, throws on the assignment exactly like a primitive does. With a
// worker the throw used to happen before the promise was rejected, so the entry never settled at all.
async function propagatesUnannotatableReason(data) {
	const label = "cancelling with a reason that cannot carry outputSize";
	for (const makeReason of UNANNOTATABLE_REASONS) {
		const reason = makeReason();
		assertRejectedWith(await cancelWriterStream(data, reason, false), reason, label);
		const workerReason = makeReason();
		const workerResult = await cancelWriterStream(data, workerReason, undefined);
		assertNotMasked(workerResult, label + " with a worker");
		if (workerResult.value.message != workerReason.message) {
			throw new Error("expected " + describe(workerReason) + " when " + label +
				" with a worker, got " + describe(workerResult.value));
		}
	}
}

async function reportsWriterCancelWithWorkers(data) {
	for (const reason of REASONS) {
		const result = await cancelWriterStream(data, reason, undefined);
		assertNotMasked(result, "cancelling the readable of a ZipWriterStream with a worker");
	}
}

async function propagatesReaderAbortReason(archive) {
	for (const reason of REASONS) {
		const result = await abortReaderTarget(archive, reason, false);
		assertRejectedWith(result, reason, "aborting the writable of getData()");
	}
}

// a reason raised on the main thread is only seen by the worker when the streams are transferred to
// it, and it has to come back over a worker message. The worker sends the reason itself whenever it
// can be cloned, so a value that is not an object comes back identical and a DOMException keeps its
// class; where the engine cannot clone an error, the reason is rebuilt from its serialized fields
// and only the absence of the masking TypeError can be checked.
async function reportsReaderAbortWithWorkers(archive) {
	const label = "aborting the writable of getData() with a worker";
	for (const reason of REASONS) {
		const result = await abortReaderTarget(archive, reason, undefined);
		if (errorValuesCrossTheWorker()) {
			assertRejectedWith(result, reason, label);
		} else {
			assertNotMasked(result, label);
		}
	}
	if (errorValuesCrossTheWorker()) {
		const reason = new DOMException("aborted by the test", "AbortError");
		const { value } = await abortReaderTarget(archive, reason, undefined);
		if (!(value instanceof DOMException) || value.name != "AbortError" || value.message != reason.message) {
			throw new Error("expected a DOMException when " + label + ", got " + describe(value));
		}
	}
}

function errorValuesCrossTheWorker() {
	try {
		return typeof structuredClone == "function" && structuredClone(new Error()) instanceof Error;
	} catch {
		return false;
	}
}

// the entry is added without awaiting it, so its failure is only reported by close(): a reason that
// is not an object still has to be reported there instead of being taken for a successful entry.
// The reason itself is not compared here because it does not always survive the failing source: the
// web stream adapter of Node.js replaces a falsy abort reason with an AbortError of its own.
async function reportsEntryFailureOnClose() {
	for (const reason of REASONS) {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { useWebWorkers: false });
		zipWriter.add(ENTRY_NAME, { readable: createFailingReadable(reason) });
		const result = await settle(zipWriter.close());
		if (!result.rejected) {
			throw new Error("close() returned an archive of " + result.value.length +
				" bytes although the entry failed with " + describe(reason));
		}
		assertNotMasked(result, "an unawaited entry fails with " + describe(reason));
	}
}

// after an entry fails mid-write the writer has to advance by the bytes that entry already wrote, or
// every entry added afterwards is recorded at the wrong offset. Nothing throws when that happens: the
// caller observed the entry failure and close() stays silent about it by design, so the only symptom
// is an archive a strict reader rejects. The byte count reaches the writer out of band, because the
// reason itself cannot be relied on to carry it.
// The worker paths are checked too. The count is taken on this thread, where the bytes leave toward
// the writer of the caller, rather than in the worker, which can only see the bytes it handed to the
// stream transferred to it and would over-report whatever is still queued when the failure lands.
async function keepsEntryOffsetsCorrectAfterFailure(data) {
	for (const reason of REASONS) {
		for (const useWebWorkers of [false, undefined]) {
			const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { bufferedWrite: false, useWebWorkers });
			try {
				await zipWriter.add(ENTRY_NAME, { readable: partiallyFailingReadable(data, reason) });
			} catch {
				// the entry is skipped on purpose, which is the salvage documented on close()
			}
			await zipWriter.add(GOOD_ENTRY_NAME, new zip.TextReader(GOOD_CONTENT));
			const archive = await zipWriter.close();
			const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(archive));
			const [entry] = await zipReader.getEntries();
			const content = await entry.getData(new zip.TextWriter());
			await zipReader.close();
			if (entry.filename != GOOD_ENTRY_NAME || content != GOOD_CONTENT) {
				throw new Error("expected the entry added after a failure with " + describe(reason) +
					" to survive, got " + entry.filename);
			}
			assertLocalHeaderAt(archive, getRecordedLocalHeaderOffset(archive), reason, useWebWorkers);
		}
	}
}

// the count of what a failed entry wrote has to be taken once the aborted pipe has settled, because a
// write already in flight still reaches the destination after the failure has been reported. A sink
// that accepts chunks slowly makes that window wide enough to be deterministic: the writer used to
// end up one chunk short, so every entry added afterwards was recorded that far before its real
// position. Comparing what the writer accounts for with what the destination received catches it
// whichever way the two drift apart.
async function keepsWriterAccountingExactAfterFailure(data) {
	for (const reason of REASONS) {
		for (const useWebWorkers of [false, undefined]) {
			let received = 0;
			const writable = new WritableStream({
				async write(chunk) {
					await delay(SLOW_SINK_DELAY);
					received += chunk.length;
				}
			});
			const zipWriter = new zip.ZipWriter({ writable }, { bufferedWrite: false, useWebWorkers });
			try {
				await zipWriter.add(ENTRY_NAME, { readable: partiallyFailingReadable(data, reason) });
			} catch {
				// the entry is skipped on purpose
			}
			if (zipWriter.offset != received) {
				throw new Error("after a failure with " + describe(reason) + " (useWebWorkers=" + useWebWorkers +
					") the writer accounts for " + zipWriter.offset + " bytes and the destination received " +
					received + ", a drift of " + (zipWriter.offset - received));
			}
		}
	}
}

function delay(duration) {
	return new Promise(resolve => setTimeout(resolve, duration));
}

function partiallyFailingReadable(data, reason) {
	let offset = 0;
	return new ReadableStream({
		pull(controller) {
			if (offset < data.length) {
				controller.enqueue(data.slice(offset, offset + FAILING_CHUNK_LENGTH));
				offset += FAILING_CHUNK_LENGTH;
			} else {
				controller.error(reason);
			}
		}
	});
}

// the offset has to be read out of the central directory itself: zip.js tolerates an archive whose
// records are all shifted by the same amount, so EntryMetaData#offset comes back corrected and would
// hide the very drift this checks
function getRecordedLocalHeaderOffset(archive) {
	let endOfCentralDirectoryOffset = archive.length - END_OF_CENTRAL_DIRECTORY_LENGTH;
	while (endOfCentralDirectoryOffset >= 0 && getUint32(archive, endOfCentralDirectoryOffset) != END_OF_CENTRAL_DIRECTORY_SIGNATURE) {
		endOfCentralDirectoryOffset--;
	}
	if (endOfCentralDirectoryOffset < 0) {
		throw new Error("no end of central directory record in the archive");
	}
	const centralDirectoryOffset = getUint32(archive, endOfCentralDirectoryOffset + CENTRAL_DIRECTORY_OFFSET_FIELD);
	return getUint32(archive, centralDirectoryOffset + LOCAL_HEADER_OFFSET_FIELD);
}

function getUint32(array, offset) {
	return ((array[offset] | (array[offset + 1] << 8) | (array[offset + 2] << 16)) >>> 0) + array[offset + 3] * 0x1000000;
}

function assertLocalHeaderAt(archive, offset, reason, useWebWorkers) {
	const found = Array.from(archive.subarray(offset, offset + LOCAL_HEADER_SIGNATURE.length));
	if (found.length != LOCAL_HEADER_SIGNATURE.length || LOCAL_HEADER_SIGNATURE.some((byte, index) => found[index] != byte)) {
		throw new Error("the entry added after a failure with " + describe(reason) + " (useWebWorkers=" +
			useWebWorkers + ") is recorded at offset " + offset + " of " + archive.length + ", where the archive holds " +
			(found.length ? found.join(",") : "nothing, the offset is past the end") + " instead of a local file header");
	}
}

async function cancelWriterStream(data, reason, useWebWorkers) {
	const zipWriterStream = new zip.ZipWriterStream({ useWebWorkers });
	const reader = zipWriterStream.readable.getReader();
	const added = zipWriterStream.zipWriter.add(ENTRY_NAME, new zip.Uint8ArrayReader(data));
	const cancelled = readThenCancel(reader, reason);
	const result = await settle(added);
	await cancelled;
	return result;
}

async function readThenCancel(reader, reason) {
	for (let index = 0; index < READ_CHUNKS_BEFORE_CANCEL; index++) {
		const { done } = await reader.read();
		if (done) {
			throw new Error("the archive ended before the entry could be cancelled");
		}
	}
	await reader.cancel(reason);
}

async function abortReaderTarget(archive, reason, useWebWorkers) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(archive), { useWebWorkers });
	const [entry] = await zipReader.getEntries();
	let chunkCount = 0;
	const writable = new WritableStream({
		write() {
			chunkCount++;
			if (chunkCount == READ_CHUNKS_BEFORE_CANCEL) {
				throw reason;
			}
		}
	});
	const result = await settle(entry.getData({ writable }));
	await zipReader.close();
	return result;
}

async function createArchive(data) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(ENTRY_NAME, new zip.Uint8ArrayReader(data));
	return await zipWriter.close();
}

function createFailingReadable(reason) {
	return new ReadableStream({
		pull(controller) {
			controller.error(reason);
		}
	});
}

function createIncompressibleData() {
	const data = new Uint8Array(DATA_LENGTH);
	for (let index = 0; index < data.length; index += RANDOM_VALUES_MAX_LENGTH) {
		crypto.getRandomValues(data.subarray(index, index + RANDOM_VALUES_MAX_LENGTH));
	}
	return data;
}

async function settle(promise) {
	try {
		return { rejected: false, value: await promise };
	} catch (error) {
		return { rejected: true, value: error };
	}
}

function assertRejectedWith(result, reason, label) {
	assertNotMasked(result, label);
	if (result.value !== reason) {
		throw new Error("expected " + describe(reason) + " when " + label + ", got " + describe(result.value));
	}
}

// the weaker of the two assertions, for the paths where the reason is rebuilt rather than carried:
// whatever reaches the caller, it must not be the TypeError raised while annotating the reason
function assertNotMasked(result, label) {
	if (!result.rejected) {
		throw new Error("expected a rejection when " + label);
	}
	const { value } = result;
	if (value instanceof TypeError || (value && value.name == "TypeError")) {
		throw new Error("the rejection reason was replaced by a TypeError when " + label + ": " + value.message);
	}
}

function describe(value) {
	try {
		if (typeof value == "string") {
			return "\"" + value + "\"";
		}
		return value instanceof Error || value instanceof DOMException
			? value.constructor.name + "/" + value.name + ": " + value.message
			: String(value);
	} catch {
		return "an unprintable " + typeof value;
	}
}
