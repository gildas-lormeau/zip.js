// Type-level test: `passThrough` accepts the two boolean values and the string naming the stage that is
// still run, on both sides symmetrically, and nothing else. The string literal has to stay assignable
// from a variable typed as the option itself, so that a caller can forward the value it was given.
// Compile with: npm run test-types
import { ZipReader, ZipWriter, Uint8ArrayReader, Uint8ArrayWriter } from "../../index.js";
import type {
	FileEntry, ZipReaderOptions, ZipWriterConstructorOptions,
	ZipDirectoryEntryImportOptions, ZipDirectoryEntryExportOptions
} from "../../index.js";

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

// "nothing else" above is an assertion, so it needs a case that must NOT compile
// @ts-expect-error the option takes the two booleans and "compressed", not any string
const rejectedReaderOptions: ZipReaderOptions = { passThrough: "raw" };
// @ts-expect-error same on the writer side
const rejectedWriterOptions: ZipWriterConstructorOptions = { passThrough: "raw" };

// the filesystem copies each entry through a writer, so it narrows the option back to a boolean; the
// runtime throws ERR_UNSUPPORTED_PASS_THROUGH_VALUE for "compressed" and the types have to say so
const fsImportOptions: ZipDirectoryEntryImportOptions[] = [{ passThrough: true }, { passThrough: false }, {}];
const fsExportOptions: ZipDirectoryEntryExportOptions[] = [{ readerOptions: { passThrough: true } }, {}];
// @ts-expect-error the filesystem does not accept the "compressed" value
const rejectedImportOptions: ZipDirectoryEntryImportOptions = { passThrough: "compressed" };
// @ts-expect-error nor does it accept it through readerOptions
const rejectedExportOptions: ZipDirectoryEntryExportOptions = { readerOptions: { passThrough: "compressed" } };

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

void [readerOptions, writerOptions, forwarded, rekey, rejectedReaderOptions, rejectedWriterOptions,
	fsImportOptions, fsExportOptions, rejectedImportOptions, rejectedExportOptions];

export { rekey };
