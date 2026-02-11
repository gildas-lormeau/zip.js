import * as zip from "../../index.js";

export { test };

async function test() {
  const CONTENT = "A".repeat(1000); // 1KB per file

  // Create archive with 3 files
  const writer = new zip.Uint8ArraySeekableWriter(16384);
  await writer.init();
  const zipWriter = new zip.ZipWriter(writer, { level: 0 }); // No compression for predictable size
  await zipWriter.add("file1.txt", new zip.TextReader(CONTENT));
  await zipWriter.add("file2.txt", new zip.TextReader(CONTENT));
  await zipWriter.add("file3.txt", new zip.TextReader(CONTENT));
  await zipWriter.close();

  const sizeWith3 = writer.size;
  console.log("Size with 3 files:", sizeWith3);

  // Reopen, remove middle file, and compact
  await writer.seek(0);
  const zipWriter2 = await zip.ZipWriter.openExisting(writer);
  zipWriter2.remove("file2.txt");

  const result = await zipWriter2.compact();
  console.log("Compact result:", result);

  await zipWriter2.close();

  const sizeAfterCompact = writer.size;
  console.log("Size after compact:", sizeAfterCompact);

  // Verify compaction worked
  if (result.reclaimedBytes < 900) { // Should reclaim ~1KB
    throw new Error(`Expected to reclaim ~1KB, got ${result.reclaimedBytes}`);
  }

  if (sizeAfterCompact >= sizeWith3) {
    throw new Error("Archive should be smaller after compact");
  }

  // Verify remaining files are intact
  const data = writer.getData();
  const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries = await zipReader.getEntries();

  if (entries.length !== 2) {
    throw new Error(`Expected 2 entries, got ${entries.length}`);
  }

  const content1 = await entries[0].getData(new zip.TextWriter());
  const content2 = await entries[1].getData(new zip.TextWriter());

  if (content1 !== CONTENT || content2 !== CONTENT) {
    throw new Error("Content mismatch after compact");
  }

  if (entries[0].filename !== "file1.txt" || entries[1].filename !== "file3.txt") {
    throw new Error("Filename mismatch after compact");
  }

  await zipReader.close();

  // Test dryRun option - should report stats without modifying

  // Dry run shouldn't actually be useful on an already-compacted archive,
  // so let's test on a fresh archive with a removed entry
  const writer2 = new zip.Uint8ArraySeekableWriter(16384);
  await writer2.init();
  const zipWriter4 = new zip.ZipWriter(writer2, { level: 0 });
  await zipWriter4.add("a.txt", new zip.TextReader(CONTENT));
  await zipWriter4.add("b.txt", new zip.TextReader(CONTENT));
  await zipWriter4.close();

  await writer2.seek(0);
  const zipWriter5 = await zip.ZipWriter.openExisting(writer2);
  zipWriter5.remove("a.txt");

  const sizeBefore = writer2.size;
  const dryRunResult = await zipWriter5.compact({ dryRun: true });
  const sizeAfterDryRun = writer2.size;

  // Size should NOT change with dryRun
  if (sizeAfterDryRun !== sizeBefore) {
    throw new Error("dryRun should not modify file size");
  }

  // But should still report what would be reclaimed
  if (dryRunResult.reclaimedBytes < 900) {
    throw new Error(`dryRun should report reclaimable space, got ${dryRunResult.reclaimedBytes}`);
  }

  console.log("dryRun result:", dryRunResult);

  await zipWriter5.close();
  await zip.terminateWorkers();
}
