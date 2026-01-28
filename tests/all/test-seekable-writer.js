// tests/all/test-seekable-writer.js
import * as zip from "../../index.js";

export { test };

async function test() {
	// Test Uint8ArraySeekableWriter basic operations
	const writer = new zip.Uint8ArraySeekableWriter(1024);
	await writer.init();

	// Write at position 0
	await writer.writeUint8Array(new Uint8Array([1, 2, 3, 4]));
	if (writer.position !== 4) throw new Error("Position should be 4");

	// Seek to position 2
	await writer.seek(2);
	if (writer.position !== 2) throw new Error("Position should be 2");

	// Overwrite bytes 2-3
	await writer.writeUint8Array(new Uint8Array([10, 11]));

	// Verify by reading
	const data = await writer.readAt(0, 4);
	if (data[0] !== 1 || data[1] !== 2 || data[2] !== 10 || data[3] !== 11) {
		throw new Error("Data mismatch after seek and write");
	}

	// Test truncate
	await writer.seek(2);
	await writer.truncate();
	if (writer.size !== 2) throw new Error("Size should be 2 after truncate");
}
