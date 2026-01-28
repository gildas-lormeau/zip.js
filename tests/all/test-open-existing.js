import * as zip from "../../index.js";

const TEXT_CONTENT = "Hello World";

export { test };

async function test() {
  zip.configure({ chunkSize: 128, useWebWorkers: true });

  // Create initial archive
  const initialWriter = new zip.Uint8ArraySeekableWriter(4096);
  await initialWriter.init();
  const zipWriter1 = new zip.ZipWriter(initialWriter);
  await zipWriter1.add("file1.txt", new zip.TextReader(TEXT_CONTENT));
  await zipWriter1.close();

  // Reopen and add another file
  await initialWriter.seek(0); // Reset for reading
  const zipWriter2 = await zip.ZipWriter.openExisting(initialWriter);
  await zipWriter2.add("file2.txt", new zip.TextReader("Second file"));
  await zipWriter2.close();

  // Verify both files exist
  const data = initialWriter.getData();
  const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries = await zipReader.getEntries();
  await zipReader.close();

  if (entries.length !== 2) {
    throw new Error(`Expected 2 entries, got ${entries.length}`);
  }
  if (entries[0].filename !== "file1.txt" || entries[1].filename !== "file2.txt") {
    throw new Error("Filename mismatch");
  }

  // Verify content
  const zipReader2 = new zip.ZipReader(new zip.Uint8ArrayReader(data));
  const entries2 = await zipReader2.getEntries();
  const content1 = await entries2[0].getData(new zip.TextWriter());
  const content2 = await entries2[1].getData(new zip.TextWriter());
  await zipReader2.close();

  if (content1 !== TEXT_CONTENT) {
    throw new Error("Content 1 mismatch");
  }
  if (content2 !== "Second file") {
    throw new Error("Content 2 mismatch");
  }

  await zip.terminateWorkers();
}
