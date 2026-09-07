// Type-level test: index.d.ts must compile on its own under a library that does not declare
// Symbol.asyncDispose, which is what a consumer sees whenever skipLibCheck is left off, i.e. the
// default. Its declaration is therefore preceded by a @ts-ignore comment in index.d.ts, and removing
// that comment fails this test with TS2550 while leaving every other one passing.
// Compile with: npm run test-types
import { BlobReader, BlobWriter, ZipReader, ZipWriter } from "../../index.js";
import type { Entry } from "../../index.js";

export async function readEntries(blob: Blob): Promise<Entry[]> {
	const zipReader = new ZipReader(new BlobReader(blob));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	return entries;
}

export async function writeEntry(blob: Blob): Promise<Blob> {
	const zipWriter = new ZipWriter(new BlobWriter());
	await zipWriter.add("entry.txt", new BlobReader(blob));
	return zipWriter.close();
}
