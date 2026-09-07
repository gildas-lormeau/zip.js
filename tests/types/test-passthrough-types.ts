// Type-level test: `passThrough` accepts the two boolean values and the string naming the stage that is
// still run, on both sides symmetrically, and nothing else. The string literal has to stay assignable
// from a variable typed as the option itself, so that a caller can forward the value it was given.
// Compile with: npm run test-types
import { ZipReader, ZipWriter, Uint8ArrayReader, Uint8ArrayWriter } from "../../index.js";
import type { FileEntry, ZipReaderOptions, ZipWriterConstructorOptions } from "../../index.js";

const readerOptions: ZipReaderOptions[] = [
	{ passThrough: true },
	{ passThrough: false },
	{ passThrough: "compressed" },
	{}
];
const writerOptions: ZipWriterConstructorOptions[] = [
	{ passThrough: true },
	{ passThrough: false },
	{ passThrough: "compressed" },
	{}
];

// the value forwards between the two sides without a cast, which is what a rekey does
const stage: ZipReaderOptions["passThrough"] = "compressed";
const forwarded: ZipWriterConstructorOptions["passThrough"] = stage;

async function rekey(archive: Uint8Array, password: string, newPassword: string): Promise<Uint8Array> {
	const zipReader = new ZipReader(new Uint8ArrayReader(archive));
	const [entry] = await zipReader.getEntries() as FileEntry[];
	const data = await entry.getData(new Uint8ArrayWriter(), { passThrough: "compressed", password });
	await zipReader.close();
	const zipWriter = new ZipWriter(new Uint8ArrayWriter());
	await zipWriter.add(entry.filename, new Uint8ArrayReader(data), {
		passThrough: "compressed",
		password: newPassword,
		compressionMethod: entry.compressionMethod,
		uncompressedSize: entry.uncompressedSize,
		crc32: entry.crc32
	});
	return await zipWriter.close();
}

void [readerOptions, writerOptions, forwarded, rekey];

export { rekey };
