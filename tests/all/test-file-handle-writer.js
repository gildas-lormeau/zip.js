// tests/all/test-file-handle-writer.js
// Only runs in Node.js environment

import * as zip from "../../index.js";
import { open, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export { test };

async function test() {
  // Skip in non-Node environments
  if (typeof process === "undefined" || !process.versions?.node) {
    console.log("Skipping Node.js file handle test in non-Node environment");
    return;
  }

  const tempFile = join(tmpdir(), `zip-test-${Date.now()}.zip`);

  try {
    // Create initial archive
    const handle = await open(tempFile, "w+");
    const writer = new zip.FileHandleWriter(handle);
    await writer.init();

    const zipWriter = new zip.ZipWriter(writer);
    await zipWriter.add("file1.txt", new zip.TextReader("Hello"));
    await zipWriter.close();

    // Reopen and add another file
    await writer.seek(0);
    const zipWriter2 = await zip.ZipWriter.openExisting(writer);
    await zipWriter2.add("file2.txt", new zip.TextReader("World"));
    await zipWriter2.close();

    await handle.close();

    // Read back and verify
    const handle2 = await open(tempFile, "r");
    const stats = await handle2.stat();
    const buffer = new Uint8Array(stats.size);
    await handle2.read(buffer, 0, stats.size, 0);
    await handle2.close();

    const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(buffer));
    const entries = await zipReader.getEntries();

    if (entries.length !== 2) {
      await zipReader.close();
      throw new Error(`Expected 2 entries, got ${entries.length}`);
    }

    // Verify entry content
    const entry1 = entries.find(e => e.filename === "file1.txt");
    const entry2 = entries.find(e => e.filename === "file2.txt");

    if (!entry1 || !entry2) {
      await zipReader.close();
      throw new Error("Missing expected entries");
    }

    const content1 = await entry1.getData(new zip.TextWriter());
    const content2 = await entry2.getData(new zip.TextWriter());
    await zipReader.close();

    if (content1 !== "Hello") {
      throw new Error(`Expected "Hello", got "${content1}"`);
    }
    if (content2 !== "World") {
      throw new Error(`Expected "World", got "${content2}"`);
    }

    console.log("Node.js file handle test passed");
  } finally {
    // Cleanup
    try {
      await unlink(tempFile);
    } catch {
      // Ignore cleanup errors
    }
  }
}
