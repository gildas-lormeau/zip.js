/* global Blob */

import * as zip from "../../index.js";

export { test };

async function test() {
  zip.configure({ chunkSize: 128, useWebWorkers: true });

  await testZip64IncrementalUpdate();
  await testEncryptedArchiveUpdate();
  await testEmptyArchiveOpen();
  await testCompactNoGaps();
  await testCompactAllRemoved();
  await testUpdateNonExistentEntry();
  await testConcurrentUpdates();
  await testLargeArchiveStreaming();

  await zip.terminateWorkers();
}

async function testZip64IncrementalUpdate() {
  console.log("Testing ZIP64 incremental update...");

  // Create ZIP64 archive with one file
  const writer = new zip.Uint8ArraySeekableWriter(8192);
  await writer.init();
  const zipWriter = new zip.ZipWriter(writer, { zip64: true });
  await zipWriter.add("file1.txt", new zip.TextReader("ZIP64 content"));
  await zipWriter.close();

  // Reopen and add another file
  await writer.seek(0);
  const zipWriter2 = await zip.ZipWriter.openExisting(writer);
  await zipWriter2.add("file2.txt", new zip.TextReader("Second ZIP64 file"), { zip64: true });
  await zipWriter2.close();

  // Verify both files exist
  const data = writer.getData();
  const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries = await zipReader.getEntries();
  await zipReader.close();

  if (entries.length !== 2) {
    throw new Error(`Expected 2 entries, got ${entries.length}`);
  }

  // Verify first entry is ZIP64
  if (!entries[0].zip64) {
    throw new Error("First entry should be ZIP64");
  }

  // Verify content
  const zipReader2 = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries2 = await zipReader2.getEntries();
  const content1 = await entries2[0].getData(new zip.TextWriter());
  const content2 = await entries2[1].getData(new zip.TextWriter());
  await zipReader2.close();

  if (content1 !== "ZIP64 content") {
    throw new Error("Content 1 mismatch");
  }
  if (content2 !== "Second ZIP64 file") {
    throw new Error("Content 2 mismatch");
  }

  console.log("ZIP64 incremental update: PASSED");
}

async function testEncryptedArchiveUpdate() {
  console.log("Testing encrypted archive update...");

  const password = "secretpassword";
  const content1Text = "Encrypted content 1";
  const content2Text = "Encrypted content 2";
  const blob1 = new Blob([content1Text], { type: "text/plain" });
  const blob2 = new Blob([content2Text], { type: "text/plain" });

  // Create encrypted archive using ZipCrypto (legacy encryption)
  // Note: AES encryption (encryptionStrength: 3) has a known issue with openExisting
  const writer = new zip.Uint8ArraySeekableWriter(16384);
  await writer.init();
  const zipWriter = new zip.ZipWriter(writer);
  await zipWriter.add("encrypted1.txt", new zip.BlobReader(blob1), { password, zipCrypto: true });
  await zipWriter.close();

  // Reopen and add another encrypted file
  await writer.seek(0);
  const zipWriter2 = await zip.ZipWriter.openExisting(writer);
  await zipWriter2.add("encrypted2.txt", new zip.BlobReader(blob2), { password, zipCrypto: true });
  await zipWriter2.close();

  // Verify both files exist and can be decrypted
  const data = writer.getData();
  const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries = await zipReader.getEntries();

  if (entries.length !== 2) {
    throw new Error(`Expected 2 entries, got ${entries.length}`);
  }

  // Verify both entries are encrypted
  if (!entries[0].encrypted || !entries[1].encrypted) {
    throw new Error("Both entries should be encrypted");
  }

  // Decrypt and verify content
  const data1 = await entries[0].getData(new zip.BlobWriter("text/plain"), { password });
  const data2 = await entries[1].getData(new zip.BlobWriter("text/plain"), { password });
  await zipReader.close();

  const decrypted1 = await data1.text();
  const decrypted2 = await data2.text();

  if (decrypted1 !== content1Text) {
    throw new Error(`Decrypted content 1 mismatch: expected '${content1Text}', got '${decrypted1}'`);
  }
  if (decrypted2 !== content2Text) {
    throw new Error(`Decrypted content 2 mismatch: expected '${content2Text}', got '${decrypted2}'`);
  }

  console.log("Encrypted archive update: PASSED");
}

async function testEmptyArchiveOpen() {
  console.log("Testing empty archive open...");

  // Create empty archive
  const writer = new zip.Uint8ArraySeekableWriter(4096);
  await writer.init();
  const zipWriter = new zip.ZipWriter(writer);
  await zipWriter.close();

  // Verify empty
  let data = writer.getData();
  let zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  let entries = await zipReader.getEntries();
  await zipReader.close();

  if (entries.length !== 0) {
    throw new Error(`Expected 0 entries in empty archive, got ${entries.length}`);
  }

  // Reopen and add first file
  await writer.seek(0);
  const zipWriter2 = await zip.ZipWriter.openExisting(writer);
  await zipWriter2.add("first-file.txt", new zip.TextReader("First file in previously empty archive"));
  await zipWriter2.close();

  // Verify file was added
  data = writer.getData();
  zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  entries = await zipReader.getEntries();

  if (entries.length !== 1) {
    throw new Error(`Expected 1 entry, got ${entries.length}`);
  }

  if (entries[0].filename !== "first-file.txt") {
    throw new Error(`Expected filename 'first-file.txt', got '${entries[0].filename}'`);
  }

  const content = await entries[0].getData(new zip.TextWriter());
  await zipReader.close();

  if (content !== "First file in previously empty archive") {
    throw new Error("Content mismatch");
  }

  console.log("Empty archive open: PASSED");
}

async function testCompactNoGaps() {
  console.log("Testing compact with no gaps...");

  const CONTENT = "Test content for compact test";

  // Create archive with 2 files, no removals
  const writer = new zip.Uint8ArraySeekableWriter(8192);
  await writer.init();
  const zipWriter = new zip.ZipWriter(writer, { level: 0 });
  await zipWriter.add("file1.txt", new zip.TextReader(CONTENT));
  await zipWriter.add("file2.txt", new zip.TextReader(CONTENT));
  await zipWriter.close();

  // Reopen without removing anything, then compact
  await writer.seek(0);
  const zipWriter2 = await zip.ZipWriter.openExisting(writer);

  const result = await zipWriter2.compact();
  await zipWriter2.close();

  // Should report 0 bytes reclaimed (no dead space from removed entries)
  if (result.reclaimedBytes !== 0) {
    throw new Error(`Expected 0 bytes reclaimed, got ${result.reclaimedBytes}`);
  }

  // Should report 0 entries moved (nothing to move)
  if (result.entriesMoved !== 0) {
    throw new Error(`Expected 0 entries moved, got ${result.entriesMoved}`);
  }

  // Verify files are still intact
  const data = writer.getData();
  const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries = await zipReader.getEntries();
  await zipReader.close();

  if (entries.length !== 2) {
    throw new Error(`Expected 2 entries, got ${entries.length}`);
  }

  // Verify content
  const zipReader2 = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries2 = await zipReader2.getEntries();
  const content1 = await entries2[0].getData(new zip.TextWriter());
  const content2 = await entries2[1].getData(new zip.TextWriter());
  await zipReader2.close();

  if (content1 !== CONTENT || content2 !== CONTENT) {
    throw new Error("Content mismatch after compact");
  }

  console.log("Compact with no gaps: PASSED");
}

async function testCompactAllRemoved() {
  console.log("Testing compact with all entries removed...");

  const CONTENT = "Content to be removed";

  // Create archive with 2 files
  const writer = new zip.Uint8ArraySeekableWriter(8192);
  await writer.init();
  const zipWriter = new zip.ZipWriter(writer, { level: 0 });
  await zipWriter.add("file1.txt", new zip.TextReader(CONTENT));
  await zipWriter.add("file2.txt", new zip.TextReader(CONTENT));
  await zipWriter.close();

  const sizeWith2Files = writer.size;

  // Reopen, remove all entries, compact
  await writer.seek(0);
  const zipWriter2 = await zip.ZipWriter.openExisting(writer);
  zipWriter2.remove("file1.txt");
  zipWriter2.remove("file2.txt");

  await zipWriter2.compact();
  await zipWriter2.close();

  const sizeAfterCompact = writer.size;

  // Size should be much smaller after removing all files and compacting
  if (sizeAfterCompact >= sizeWith2Files) {
    throw new Error(`Size should be smaller after removing all: before=${sizeWith2Files}, after=${sizeAfterCompact}`);
  }

  // Verify archive is now empty
  const data = writer.getData();
  const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries = await zipReader.getEntries();
  await zipReader.close();

  if (entries.length !== 0) {
    throw new Error(`Expected 0 entries, got ${entries.length}`);
  }

  console.log("Compact with all removed: PASSED");
}

async function testUpdateNonExistentEntry() {
  console.log("Testing update non-existent entry...");

  // Create archive with one file
  const writer = new zip.Uint8ArraySeekableWriter(4096);
  await writer.init();
  const zipWriter = new zip.ZipWriter(writer);
  await zipWriter.add("exists.txt", new zip.TextReader("This file exists"));
  await zipWriter.close();

  // Reopen and try to update non-existent entry
  await writer.seek(0);
  const zipWriter2 = await zip.ZipWriter.openExisting(writer);

  const updated = zipWriter2.updateEntry("does-not-exist.txt", {
    lastModDate: new Date()
  });

  if (updated !== false) {
    throw new Error("updateEntry should return false for non-existent entry");
  }

  // Verify existing entry can still be updated
  const updatedExisting = zipWriter2.updateEntry("exists.txt", {
    lastModDate: new Date("2030-01-01T00:00:00Z")
  });

  if (updatedExisting !== true) {
    throw new Error("updateEntry should return true for existing entry");
  }

  await zipWriter2.close();

  console.log("Update non-existent entry: PASSED");
}

async function testConcurrentUpdates() {
  console.log("Testing concurrent updates...");

  // Create initial archive
  const writer = new zip.Uint8ArraySeekableWriter(16384);
  await writer.init();
  const zipWriter = new zip.ZipWriter(writer);
  await zipWriter.add("initial.txt", new zip.TextReader("Initial file"));
  await zipWriter.close();

  // Reopen and add multiple entries concurrently
  await writer.seek(0);
  const zipWriter2 = await zip.ZipWriter.openExisting(writer);

  // Add multiple entries using Promise.all
  await Promise.all([
    zipWriter2.add("concurrent1.txt", new zip.TextReader("Concurrent file 1")),
    zipWriter2.add("concurrent2.txt", new zip.TextReader("Concurrent file 2")),
    zipWriter2.add("concurrent3.txt", new zip.TextReader("Concurrent file 3")),
    zipWriter2.add("concurrent4.txt", new zip.TextReader("Concurrent file 4")),
    zipWriter2.add("concurrent5.txt", new zip.TextReader("Concurrent file 5"))
  ]);

  await zipWriter2.close();

  // Verify all 6 files exist
  const data = writer.getData();
  const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries = await zipReader.getEntries();

  if (entries.length !== 6) {
    throw new Error(`Expected 6 entries, got ${entries.length}`);
  }

  // Verify all filenames are present
  const filenames = entries.map(e => e.filename).sort();
  const expected = ["concurrent1.txt", "concurrent2.txt", "concurrent3.txt", "concurrent4.txt", "concurrent5.txt", "initial.txt"].sort();

  for (let i = 0; i < expected.length; i++) {
    if (filenames[i] !== expected[i]) {
      throw new Error(`Filename mismatch at index ${i}: expected '${expected[i]}', got '${filenames[i]}'`);
    }
  }

  // Verify content of one of the concurrent files
  const concurrent1 = entries.find(e => e.filename === "concurrent1.txt");
  const content = await concurrent1.getData(new zip.TextWriter());
  await zipReader.close();

  if (content !== "Concurrent file 1") {
    throw new Error("Concurrent file content mismatch");
  }

  console.log("Concurrent updates: PASSED");
}

async function testLargeArchiveStreaming() {
  console.log("Testing large archive streaming (100 entries)...");

  // Create archive with 100 entries
  const writer = new zip.Uint8ArraySeekableWriter(262144); // 256KB buffer
  await writer.init();
  const zipWriter = new zip.ZipWriter(writer, { level: 0 });

  for (let i = 0; i < 100; i++) {
    await zipWriter.add(`file${i.toString().padStart(3, "0")}.txt`, new zip.TextReader(`Content of file ${i}`));
  }
  await zipWriter.close();

  // Verify 100 entries
  let data = writer.getData();
  let zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  let entries = await zipReader.getEntries();
  await zipReader.close();

  if (entries.length !== 100) {
    throw new Error(`Expected 100 entries, got ${entries.length}`);
  }

  // Reopen and add one more entry
  await writer.seek(0);
  const zipWriter2 = await zip.ZipWriter.openExisting(writer);
  await zipWriter2.add("file100.txt", new zip.TextReader("The 101st file"));
  await zipWriter2.close();

  // Verify 101 entries
  data = writer.getData();
  zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  entries = await zipReader.getEntries();

  if (entries.length !== 101) {
    throw new Error(`Expected 101 entries, got ${entries.length}`);
  }

  // Verify the new file is there
  const newFile = entries.find(e => e.filename === "file100.txt");
  if (!newFile) {
    throw new Error("New file not found in archive");
  }

  const content = await newFile.getData(new zip.TextWriter());
  await zipReader.close();

  if (content !== "The 101st file") {
    throw new Error("New file content mismatch");
  }

  // Verify a random existing file is still intact
  const zipReader2 = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries2 = await zipReader2.getEntries();
  const randomFile = entries2.find(e => e.filename === "file050.txt");
  const randomContent = await randomFile.getData(new zip.TextWriter());
  await zipReader2.close();

  if (randomContent !== "Content of file 50") {
    throw new Error("Existing file content corrupted");
  }

  console.log("Large archive streaming: PASSED");
}
