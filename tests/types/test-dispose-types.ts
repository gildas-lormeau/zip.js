// Type-level test: ZipReader and ZipWriter must be usable with `await using`, which needs the
// declaration of their Symbol.asyncDispose member to be visible when the library declares the symbol.
// The companion test checks the reverse, that the same declaration compiles when it does not, see
// tsconfig-declarations.json.
// Compile with: npm run test-types
import { BlobReader, BlobWriter, ZipReader, ZipWriter } from "../../index.js";
import type { Entry } from "../../index.js";

export async function readEntries(blob: Blob): Promise<Entry[]> {
	await using zipReader = new ZipReader(new BlobReader(blob));
	return zipReader.getEntries();
}

export async function writeEntry(blob: Blob): Promise<Blob> {
	const blobWriter = new BlobWriter();
	{
		await using zipWriter = new ZipWriter(blobWriter);
		await zipWriter.add("entry.txt", new BlobReader(blob));
	}
	return blobWriter.getData();
}

export async function disposeExplicitly(blob: Blob): Promise<void> {
	const zipReader = new ZipReader(new BlobReader(blob));
	await zipReader[Symbol.asyncDispose]();
}
