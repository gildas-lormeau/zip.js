import * as zip from "../../index.js";

export { test };

async function test() {
  // Create archive with one file
  const writer = new zip.Uint8ArraySeekableWriter(4096);
  await writer.init();
  const zipWriter = new zip.ZipWriter(writer);
  await zipWriter.add("test.txt", new zip.TextReader("content"), {
    lastModDate: new Date("2020-01-01T00:00:00Z")
  });
  await zipWriter.close();

  // Reopen and update metadata
  await writer.seek(0);
  const zipWriter2 = await zip.ZipWriter.openExisting(writer);

  const newDate = new Date("2025-06-15T12:00:00Z");
  const updated = zipWriter2.updateEntry("test.txt", {
    lastModDate: newDate
  });

  if (!updated) throw new Error("updateEntry should return true");

  await zipWriter2.close();

  // Verify the update
  const data = writer.getData();
  const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries = await zipReader.getEntries();
  await zipReader.close();

  const entry = entries[0];
  // DOS date has 2-second resolution
  if (entry.lastModDate.getFullYear() !== 2025) {
    throw new Error(`Expected year 2025, got ${entry.lastModDate.getFullYear()}`);
  }
  if (entry.lastModDate.getMonth() !== 5) { // June is month 5 (0-indexed)
    throw new Error(`Expected month June (5), got ${entry.lastModDate.getMonth()}`);
  }

  // Test updating non-existent entry returns false
  await writer.seek(0);
  const zipWriter3 = await zip.ZipWriter.openExisting(writer);
  const notUpdated = zipWriter3.updateEntry("nonexistent.txt", { lastModDate: new Date() });
  if (notUpdated !== false) {
    throw new Error("updateEntry should return false for non-existent entry");
  }
  await zipWriter3.close();

  await zip.terminateWorkers();
}
