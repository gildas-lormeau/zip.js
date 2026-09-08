/* global WritableStream, ReadableStream, crypto, structuredClone, DOMException */

// A stream cancelled or aborted without a reason rejects with undefined, and a caller aborting one
// is free to pass any value at all. zip.js annotates a codec failure with the number of bytes that
// reached the writer, which only an object can carry, so every reason that cannot carry it has to
// reach the caller unchanged rather than be replaced by the TypeError raised while annotating it.
// The reasons below are all falsy or primitive on purpose: a falsy one used to be read as "no
// failure" and made close() return a truncated archive with no error at all.

import * as zip from "../zip-lib.js";

const REASONS = [undefined, null, "cancelled", 42];
const ENTRY_NAME = "big.bin";
const DATA_LENGTH = 1024 * 1024;
const RANDOM_VALUES_MAX_LENGTH = 65536;
const READ_CHUNKS_BEFORE_CANCEL = 3;

export { test };

async function test() {
	try {
		const data = createIncompressibleData();
		const archive = await createArchive(data);
		await propagatesWriterCancelReason(data);
		await reportsWriterCancelWithWorkers(data);
		await reportsEntryFailureOnClose();
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
	if (typeof value == "string") {
		return "\"" + value + "\"";
	}
	return value instanceof Error || value instanceof DOMException
		? value.constructor.name + "/" + value.name + ": " + value.message
		: String(value);
}
