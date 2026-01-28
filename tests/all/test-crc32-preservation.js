import * as zip from "../../index.js";

export { test };

const TEXT_CONTENT = "Hello World - test content for CRC32 verification";

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });

	await testOpenExistingPreservesCRC32();
	await testPrependZipPreservesCRC32();

	await zip.terminateWorkers();
}

async function testOpenExistingPreservesCRC32() {
	console.log("Testing openExisting preserves CRC32...");

	// Step 1: Create initial archive
	const writer = new zip.Uint8ArraySeekableWriter(4096);
	await writer.init();
	const zipWriter1 = new zip.ZipWriter(writer);
	await zipWriter1.add("file1.txt", new zip.TextReader(TEXT_CONTENT));
	await zipWriter1.close();

	// Read initial CRC32
	const data1 = writer.getData();
	const reader1 = new zip.ZipReader(new zip.Uint8ArrayReader(data1));
	const entries1 = await reader1.getEntries();
	const originalCRC32 = entries1[0].signature;
	await reader1.close();

	if (!originalCRC32 || originalCRC32 === 0) {
		throw new Error("Initial archive should have non-zero CRC32");
	}
	console.log("  Initial CRC32: 0x" + originalCRC32.toString(16).padStart(8, "0"));

	// Step 2: Open existing and add another file
	await writer.seek(0);
	const zipWriter2 = await zip.ZipWriter.openExisting(writer);
	await zipWriter2.add("file2.txt", new zip.TextReader("Second file"));
	await zipWriter2.close();

	// Step 3: Verify CRC32 is preserved
	const data2 = writer.getData();
	const reader2 = new zip.ZipReader(new zip.Uint8ArrayReader(data2));
	const entries2 = await reader2.getEntries();
	await reader2.close();

	const file1Entry = entries2.find(e => e.filename === "file1.txt");
	const file2Entry = entries2.find(e => e.filename === "file2.txt");

	if (!file1Entry || !file2Entry) {
		throw new Error("Missing expected entries after openExisting");
	}

	console.log("  After openExisting CRC32: 0x" + (file1Entry.signature || 0).toString(16).padStart(8, "0"));

	if (file1Entry.signature !== originalCRC32) {
		throw new Error(
			"openExisting corrupted CRC32: expected 0x" + originalCRC32.toString(16).padStart(8, "0") +
			", got 0x" + (file1Entry.signature || 0).toString(16).padStart(8, "0")
		);
	}

	if (!file2Entry.signature || file2Entry.signature === 0) {
		throw new Error("New entry should have non-zero CRC32");
	}

	// Verify content can be extracted
	const reader3 = new zip.ZipReader(new zip.Uint8ArrayReader(data2));
	const entries3 = await reader3.getEntries();
	for (const entry of entries3) {
		const content = await entry.getData(new zip.TextWriter());
		if (!content) {
			throw new Error("Failed to extract " + entry.filename);
		}
	}
	await reader3.close();

	console.log("  openExisting CRC32 preservation: PASS");
}

async function testPrependZipPreservesCRC32() {
	console.log("Testing prependZip preserves CRC32...");

	// Step 1: Create initial archive
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1);
	await zipWriter1.add("original.txt", new zip.TextReader(TEXT_CONTENT));
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Read initial CRC32
	const reader1 = new zip.ZipReader(new zip.BlobReader(blob1));
	const entries1 = await reader1.getEntries();
	const originalCRC32 = entries1[0].signature;
	await reader1.close();

	if (!originalCRC32 || originalCRC32 === 0) {
		throw new Error("Initial archive should have non-zero CRC32");
	}
	console.log("  Initial CRC32: 0x" + originalCRC32.toString(16).padStart(8, "0"));

	// Step 2: Prepend and add new file
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2);
	await zipWriter2.prependZip(new zip.BlobReader(blob1));
	await zipWriter2.add("added.txt", new zip.TextReader("New content"));
	await zipWriter2.close();
	const blob2 = await blobWriter2.getData();

	// Step 3: Verify CRC32 is preserved
	const reader2 = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries2 = await reader2.getEntries();
	await reader2.close();

	const originalEntry = entries2.find(e => e.filename === "original.txt");
	const addedEntry = entries2.find(e => e.filename === "added.txt");

	if (!originalEntry || !addedEntry) {
		throw new Error("Missing expected entries after prependZip");
	}

	console.log("  After prependZip CRC32: 0x" + (originalEntry.signature || 0).toString(16).padStart(8, "0"));

	if (originalEntry.signature !== originalCRC32) {
		throw new Error(
			"prependZip corrupted CRC32: expected 0x" + originalCRC32.toString(16).padStart(8, "0") +
			", got 0x" + (originalEntry.signature || 0).toString(16).padStart(8, "0")
		);
	}

	if (!addedEntry.signature || addedEntry.signature === 0) {
		throw new Error("New entry should have non-zero CRC32");
	}

	// Verify content can be extracted
	const reader3 = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries3 = await reader3.getEntries();
	for (const entry of entries3) {
		const content = await entry.getData(new zip.TextWriter());
		if (!content) {
			throw new Error("Failed to extract " + entry.filename);
		}
	}
	await reader3.close();

	console.log("  prependZip CRC32 preservation: PASS");
}
