// Type-level test: the `entry` option accepts what `ZipReader#getEntries()` returns, both members of the
// union, without the caller having to narrow it first, which is the point of a copy loop that treats
// directories and files alike. A plain object is not an entry and must not be assignable. Such a loop
// also passes no reader for a directory, so `ZipWriter#add` must accept both empty values.
// Compile with: npm run test-types
import { ZipReader, ZipWriter, Uint8ArrayReader, Uint8ArrayWriter } from "../../index.js";
import type { Entry, DirectoryEntry, FileEntry, ZipWriterAddDataOptions } from "../../index.js";

declare const entry: Entry;
declare const fileEntry: FileEntry;
declare const directoryEntry: DirectoryEntry;

const options: ZipWriterAddDataOptions[] = [
	{ passThrough: true, entry },
	{ passThrough: "compressed", entry: fileEntry },
	{ entry: directoryEntry },
	{}
];

// @ts-expect-error the option is an entry, not an arbitrary bag of properties
const rejected: ZipWriterAddDataOptions = { entry: { filename: "lorem.txt" } };

// an entry with no content is written by omitting the reader, or by passing either empty value, so
// that the conditional expression a copy loop writes needs no narrowing
async function addEmptyEntries(zipWriter: ZipWriter<unknown>): Promise<unknown[]> {
	return [
		await zipWriter.add("directory/"),
		await zipWriter.add("empty.txt", undefined),
		await zipWriter.add("directory-too/", null)
	];
}

async function copy(archive: Uint8Array, prefix: string): Promise<Uint8Array> {
	const zipReader = new ZipReader(new Uint8ArrayReader(archive));
	const zipWriter = new ZipWriter(new Uint8ArrayWriter());
	for (const entry of await zipReader.getEntries()) {
		const reader = entry.directory ? null :
			new Uint8ArrayReader(await entry.getData(new Uint8ArrayWriter(), { passThrough: true }));
		await zipWriter.add(prefix + entry.filename, reader, { passThrough: true, entry });
	}
	await zipReader.close();
	return await zipWriter.close();
}

void [options, rejected, addEmptyEntries, copy];

export { addEmptyEntries, copy };
