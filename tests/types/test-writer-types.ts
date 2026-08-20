// Type-level test: the writers must expose the members the library maintains on them, i.e. the
// number of bytes written into any writer it is given, and the MIME type the two writers producing
// typed data apply to it.
// Compile with: npm run test-types
import { BlobWriter, Data64URIWriter, SplitDataWriter, TextWriter, Uint8ArrayWriter } from "../../index.js";
import type { WritableWriter } from "../../index.js";

const blobWriter = new BlobWriter("text/plain");
const data64URIWriter = new Data64URIWriter("text/plain");
const splitDataWriter = new SplitDataWriter((async function* () {
	yield new Uint8ArrayWriter();
	return true;
})());

// the library sets the number of written bytes on every writer, including the ones it is given
const writtenSizes: number[] = [
	blobWriter.size,
	data64URIWriter.size,
	splitDataWriter.size,
	new TextWriter().size,
	new Uint8ArrayWriter().size
];
const writer: WritableWriter = { writable: new WritableStream() };
const writtenSize: number | undefined = writer.size;

// the MIME type passed to the constructor stays readable
const contentTypes: (string | undefined)[] = [blobWriter.contentType, data64URIWriter.contentType];

export { writtenSizes, writtenSize, contentTypes };
