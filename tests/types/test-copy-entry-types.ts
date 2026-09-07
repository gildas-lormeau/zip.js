// Type-level test: the `entry` option accepts what `ZipReader#getEntries()` returns, both members of the
// union, without the caller having to narrow it first, which is the point of a copy loop that treats
// directories and files alike. A plain object is not an entry and must not be assignable.
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

async function copy(archive: Uint8Array, prefix: string): Promise<Uint8Array> {
	const zipReader = new ZipReader(new Uint8ArrayReader(archive));
	const zipWriter = new ZipWriter(new Uint8ArrayWriter());
	for (const entry of await zipReader.getEntries()) {
		const reader = entry.directory ? undefined :
			new Uint8ArrayReader(await entry.getData(new Uint8ArrayWriter(), { passThrough: true }));
		await zipWriter.add(prefix + entry.filename, reader, { passThrough: true, entry });
	}
	await zipReader.close();
	return await zipWriter.close();
}

void [options, rejected, copy];

export { copy };
