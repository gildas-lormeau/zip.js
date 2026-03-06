import * as zip from "../../index.js";
import { open, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export { test };

/**
 * Test that openExisting() works correctly for ZIP64 scenarios.
 *
 * The fix ensures:
 * 1. openExisting() doesn't load entire archive into memory (uses SeekableWriterReader)
 * 2. FileHandleWriter uses options object form for read/write operations
 * 3. Size tracking is correct when using openExisting()
 *
 * Note: We can't easily test with actual 4GB+ files, so we verify:
 * - The adapter pattern works correctly
 * - Multiple sequential openExisting() calls work (size tracking)
 * - readAt() is used instead of loading full archive
 */
async function test() {
	// Skip in non-Node environments
	if (typeof process === "undefined" || !process.versions?.node) {
		console.log("Skipping Node.js ZIP64 openExisting test in non-Node environment");
		return;
	}

	await testOpenExistingUsesReadAt();
	await testMultipleOpenExistingCalls();
	await testSizeTrackingCorrect();

	console.log("ZIP64 openExisting tests passed");
}

/**
 * Test that openExisting() uses readAt() calls instead of loading entire archive.
 * We wrap FileHandleWriter to track calls.
 */
async function testOpenExistingUsesReadAt() {
	console.log("Testing openExisting uses readAt (not full load)...");

	const tempFile = join(tmpdir(), "zip64-readat-test-" + Date.now() + ".zip");

	try {
		// Create initial archive
		const handle = await open(tempFile, "w+");
		const writer = new zip.FileHandleWriter(handle);
		await writer.init();

		// Track readAt calls
		let readAtCalls = [];
		const originalReadAt = writer.readAt.bind(writer);
		writer.readAt = async function(offset, length) {
			readAtCalls.push({ offset, length });
			return originalReadAt(offset, length);
		};

		const zipWriter = new zip.ZipWriter(writer);
		await zipWriter.add("file1.txt", new zip.TextReader("Content of file 1"));
		await zipWriter.add("file2.txt", new zip.TextReader("Content of file 2"));
		await zipWriter.close();

		const sizeAfterInitial = writer.size;

		// Reset tracking
		readAtCalls = [];

		// Open existing - should use readAt(), not load entire archive
		await writer.seek(0);
		const zipWriter2 = await zip.ZipWriter.openExisting(writer);

		// Verify readAt was called (not full archive load)
		if (readAtCalls.length === 0) {
			throw new Error("Expected readAt() to be called during openExisting()");
		}

		// Verify no single readAt call tried to read the entire archive
		const fullArchiveRead = readAtCalls.find(call => call.offset === 0 && call.length === sizeAfterInitial);
		if (fullArchiveRead) {
			throw new Error("openExisting() loaded entire archive into memory - this breaks ZIP64 support");
		}

		await zipWriter2.add("file3.txt", new zip.TextReader("Content of file 3"));
		await zipWriter2.close();

		await handle.close();

		// Verify archive is valid
		const handle2 = await open(tempFile, "r");
		const stats = await handle2.stat();
		const buffer = Buffer.alloc(stats.size);
		await handle2.read(buffer, 0, stats.size, 0);
		await handle2.close();

		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(buffer)));
		const entries = await zipReader.getEntries();
		await zipReader.close();

		if (entries.length !== 3) {
			throw new Error(`Expected 3 entries, got ${entries.length}`);
		}

		console.log("  openExisting uses readAt: PASS");
	} finally {
		try {
			await unlink(tempFile);
		} catch {
			// Ignore cleanup errors
		}
	}
}

/**
 * Test multiple sequential openExisting() calls work correctly.
 * This verifies size tracking doesn't get corrupted.
 */
async function testMultipleOpenExistingCalls() {
	console.log("Testing multiple openExisting calls...");

	const tempFile = join(tmpdir(), "zip64-multi-open-test-" + Date.now() + ".zip");

	try {
		const handle = await open(tempFile, "w+");
		const writer = new zip.FileHandleWriter(handle);
		await writer.init();

		// Initial archive
		let zipWriter = new zip.ZipWriter(writer);
		await zipWriter.add("initial.txt", new zip.TextReader("Initial content"));
		await zipWriter.close();

		// Multiple openExisting cycles
		for (let i = 1; i <= 3; i++) {
			await writer.seek(0);
			zipWriter = await zip.ZipWriter.openExisting(writer);
			await zipWriter.add(`added-${i}.txt`, new zip.TextReader(`Content ${i}`));
			await zipWriter.close();
		}

		await handle.close();

		// Verify
		const handle2 = await open(tempFile, "r");
		const stats = await handle2.stat();
		const buffer = Buffer.alloc(stats.size);
		await handle2.read(buffer, 0, stats.size, 0);
		await handle2.close();

		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(buffer)));
		const entries = await zipReader.getEntries();
		await zipReader.close();

		if (entries.length !== 4) {
			throw new Error(`Expected 4 entries, got ${entries.length}`);
		}

		const entryNames = entries.map(e => e.filename).sort();
		const expectedNames = ["added-1.txt", "added-2.txt", "added-3.txt", "initial.txt"];
		if (JSON.stringify(entryNames) !== JSON.stringify(expectedNames)) {
			throw new Error(`Entry names mismatch: ${JSON.stringify(entryNames)}`);
		}

		console.log("  Multiple openExisting calls: PASS");
	} finally {
		try {
			await unlink(tempFile);
		} catch {
			// Ignore cleanup errors
		}
	}
}

/**
 * Test that size tracking is correct after write operations.
 * The fix removed auto-update of _size in writeUint8Array to avoid double-counting.
 */
async function testSizeTrackingCorrect() {
	console.log("Testing size tracking is correct...");

	const tempFile = join(tmpdir(), "zip64-size-test-" + Date.now() + ".zip");

	try {
		const handle = await open(tempFile, "w+");
		const writer = new zip.FileHandleWriter(handle);
		await writer.init();

		if (writer.size !== 0) {
			throw new Error(`Initial size should be 0, got ${writer.size}`);
		}

		const zipWriter = new zip.ZipWriter(writer);
		await zipWriter.add("test.txt", new zip.TextReader("Hello World"));
		await zipWriter.close();

		const sizeAfterClose = writer.size;
		await handle.close();

		// Verify actual file size matches reported size
		const handle2 = await open(tempFile, "r");
		const stats = await handle2.stat();
		await handle2.close();

		if (stats.size !== sizeAfterClose) {
			throw new Error(`Size mismatch: writer reports ${sizeAfterClose}, actual file is ${stats.size}`);
		}

		console.log("  Size tracking correct: PASS");
	} finally {
		try {
			await unlink(tempFile);
		} catch {
			// Ignore cleanup errors
		}
	}
}
