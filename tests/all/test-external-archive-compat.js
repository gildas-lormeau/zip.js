import * as zip from "../../index.js";

export { test };

/**
 * Test that openExisting() correctly handles archives where the local header
 * extra field length differs from the central directory extra field length.
 * This is common with archives created by external tools like Info-ZIP.
 */
async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });

	await testDifferentExtraFieldLengths();

	await zip.terminateWorkers();
}

async function testDifferentExtraFieldLengths() {
	console.log("Testing openExisting with different local/central extra field lengths...");

	// Create an archive that simulates external tool behavior:
	// - Local header has extra field of length X
	// - Central directory has extra field of length Y (where Y != X)
	//
	// We'll do this by manually constructing such an archive.

	const filename = "file.txt";
	const content = new TextEncoder().encode("Hello World - test content");

	// Build local file header with 28-byte extra field
	const localExtraField = new Uint8Array(28); // Simulating Info-ZIP style
	localExtraField[0] = 0x55; // Extended timestamp tag
	localExtraField[1] = 0x54;
	localExtraField[2] = 24; // Length of extended timestamp data
	localExtraField[3] = 0;
	// Rest is zeros (timestamp data)

	// Build central directory with 24-byte extra field (different!)
	const centralExtraField = new Uint8Array(24);
	centralExtraField[0] = 0x55;
	centralExtraField[1] = 0x54;
	centralExtraField[2] = 20;
	centralExtraField[3] = 0;

	const filenameBytes = new TextEncoder().encode(filename);

	// Local file header
	const localHeader = new Uint8Array(30 + filenameBytes.length + localExtraField.length);
	const localView = new DataView(localHeader.buffer);
	localView.setUint32(0, 0x04034b50, true); // Local file header signature
	localView.setUint16(4, 20, true); // Version needed
	localView.setUint16(6, 0, true); // General purpose bit flag
	localView.setUint16(8, 0, true); // Compression method (store)
	localView.setUint16(10, 0, true); // Mod time
	localView.setUint16(12, 0, true); // Mod date
	localView.setUint32(14, crc32(content), true); // CRC32
	localView.setUint32(18, content.length, true); // Compressed size
	localView.setUint32(22, content.length, true); // Uncompressed size
	localView.setUint16(26, filenameBytes.length, true); // Filename length
	localView.setUint16(28, localExtraField.length, true); // Extra field length
	localHeader.set(filenameBytes, 30);
	localHeader.set(localExtraField, 30 + filenameBytes.length);

	// Central directory header
	const centralHeader = new Uint8Array(46 + filenameBytes.length + centralExtraField.length);
	const centralView = new DataView(centralHeader.buffer);
	centralView.setUint32(0, 0x02014b50, true); // Central file header signature
	centralView.setUint16(4, 20, true); // Version made by
	centralView.setUint16(6, 20, true); // Version needed
	centralView.setUint16(8, 0, true); // General purpose bit flag
	centralView.setUint16(10, 0, true); // Compression method (store)
	centralView.setUint16(12, 0, true); // Mod time
	centralView.setUint16(14, 0, true); // Mod date
	centralView.setUint32(16, crc32(content), true); // CRC32
	centralView.setUint32(20, content.length, true); // Compressed size
	centralView.setUint32(24, content.length, true); // Uncompressed size
	centralView.setUint16(28, filenameBytes.length, true); // Filename length
	centralView.setUint16(30, centralExtraField.length, true); // Extra field length
	centralView.setUint16(32, 0, true); // Comment length
	centralView.setUint16(34, 0, true); // Disk number start
	centralView.setUint16(36, 0, true); // Internal file attributes
	centralView.setUint32(38, 0, true); // External file attributes
	centralView.setUint32(42, 0, true); // Relative offset of local header
	centralHeader.set(filenameBytes, 46);
	centralHeader.set(centralExtraField, 46 + filenameBytes.length);

	// End of central directory
	const eocd = new Uint8Array(22);
	const eocdView = new DataView(eocd.buffer);
	const centralDirOffset = localHeader.length + content.length;
	eocdView.setUint32(0, 0x06054b50, true); // EOCD signature
	eocdView.setUint16(4, 0, true); // Disk number
	eocdView.setUint16(6, 0, true); // Disk with central dir
	eocdView.setUint16(8, 1, true); // Entries on this disk
	eocdView.setUint16(10, 1, true); // Total entries
	eocdView.setUint32(12, centralHeader.length, true); // Central dir size
	eocdView.setUint32(16, centralDirOffset, true); // Central dir offset
	eocdView.setUint16(20, 0, true); // Comment length

	// Combine all parts
	const archiveSize = localHeader.length + content.length + centralHeader.length + eocd.length;
	const archive = new Uint8Array(archiveSize);
	let offset = 0;
	archive.set(localHeader, offset); offset += localHeader.length;
	archive.set(content, offset); offset += content.length;
	archive.set(centralHeader, offset); offset += centralHeader.length;
	archive.set(eocd, offset);

	console.log("  Archive size: " + archiveSize);
	console.log("  Local extra field length: " + localExtraField.length);
	console.log("  Central extra field length: " + centralExtraField.length);
	console.log("  Data ends at: " + (localHeader.length + content.length));

	// Verify the archive is valid
	const reader1 = new zip.ZipReader(new zip.Uint8ArrayReader(archive));
	const entries1 = await reader1.getEntries();
	if (entries1.length !== 1) {
		throw new Error("Expected 1 entry in test archive");
	}
	const originalContent = await entries1[0].getData(new zip.TextWriter());
	await reader1.close();

	if (originalContent !== "Hello World - test content") {
		throw new Error("Original content mismatch: " + originalContent);
	}
	console.log("  Original archive valid, content: \"" + originalContent + "\"");

	// Now use openExisting to add a new file
	const writer = new zip.Uint8ArraySeekableWriter(archiveSize + 1024);
	await writer.init();
	// Copy archive to writer
	await writer.writeUint8Array(archive);
	writer.size = archiveSize;

	await writer.seek(0);
	const zipWriter = await zip.ZipWriter.openExisting(writer);

	console.log("  Append offset calculated by openExisting: " + writer.position);
	const expectedAppendOffset = localHeader.length + content.length;
	if (writer.position !== expectedAppendOffset) {
		console.log("  WARNING: Append offset is " + writer.position + ", expected " + expectedAppendOffset);
	}

	await zipWriter.add("new.txt", new zip.TextReader("New content"));
	await zipWriter.close();

	// Verify both files are readable
	const finalData = writer.getData();
	const reader2 = new zip.ZipReader(new zip.Uint8ArrayReader(finalData));
	const entries2 = await reader2.getEntries();

	if (entries2.length !== 2) {
		throw new Error("Expected 2 entries after openExisting, got " + entries2.length);
	}

	const expectedContent = {
		"file.txt": "Hello World - test content",
		"new.txt": "New content"
	};

	for (const entry of entries2) {
		try {
			const text = await entry.getData(new zip.TextWriter());
			console.log("  " + entry.filename + ": \"" + text + "\"");
			if (text !== expectedContent[entry.filename]) {
				throw new Error(
					"Content mismatch for " + entry.filename +
					": expected \"" + expectedContent[entry.filename] +
					"\", got \"" + text + "\""
				);
			}
		} catch (err) {
			throw new Error("Failed to extract " + entry.filename + ": " + err.message);
		}
	}

	await reader2.close();
	console.log("  External archive compatibility: PASS");
}

// Simple CRC32 implementation for test
function crc32(data) {
	let crc = 0xFFFFFFFF;
	const table = new Uint32Array(256);
	for (let i = 0; i < 256; i++) {
		let c = i;
		for (let j = 0; j < 8; j++) {
			c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
		}
		table[i] = c;
	}
	for (let i = 0; i < data.length; i++) {
		crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
	}
	return (crc ^ 0xFFFFFFFF) >>> 0;
}
