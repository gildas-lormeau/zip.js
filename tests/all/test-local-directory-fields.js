import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	try {
		await checkLocalDirectoryFields();
	} finally {
		await zip.terminateWorkers();
	}
}

async function checkLocalDirectoryFields() {
	const signedDescriptor = await readEntry({}, { checkOverlappingEntry: true });
	assertDescriptor(signedDescriptor, true, "the signature must be reported when the writer wrote it");
	const unsignedDescriptor = await readEntry({ dataDescriptorSignature: false }, { checkOverlappingEntry: true });
	assertDescriptor(unsignedDescriptor, false, "the signature must be reported as absent when the writer omitted it");
	const zip64Descriptor = await readEntry({ zip64: true }, { checkOverlappingEntry: true });
	assertDescriptor(zip64Descriptor, true, "the zip64 record must be read at the zip64 offsets");
	if (!zip64Descriptor.localDirectory.extraFieldZip64) {
		throw new Error("the zip64 case must exercise the zip64 layout of the record");
	}
	const withoutDescriptor = await readEntry({ dataDescriptor: false }, { checkOverlappingEntry: true });
	if (withoutDescriptor.localDirectory.dataDescriptor !== undefined) {
		throw new Error("an entry with no data descriptor must not report one");
	}
	const notChecked = await readEntry({}, {});
	if (notChecked.localDirectory.dataDescriptor !== undefined) {
		throw new Error("the data descriptor must not be read when nothing else needs it");
	}
	const strictEntry = await readEntry({}, { strictness: "strict" });
	const { rawFilename } = strictEntry.localDirectory;
	if (!rawFilename || rawFilename.length != strictEntry.rawFilename.length ||
		rawFilename.some((byteValue, indexByte) => byteValue != strictEntry.rawFilename[indexByte])) {
		throw new Error("the local filename must be reported when it has been read");
	}
	const checkedEntry = await readEntry({}, { checkLocalDirectory: true });
	if (!checkedEntry.localDirectory.rawFilename) {
		throw new Error("the local filename must be reported when the local file header is checked explicitly");
	}
	const balancedEntry = await readEntry({}, {});
	if (balancedEntry.localDirectory.rawFilename !== undefined) {
		throw new Error("the local filename must not be read when nothing else needs it");
	}
}

function assertDescriptor(entry, signature, message) {
	const { dataDescriptor } = entry.localDirectory;
	if (!dataDescriptor || dataDescriptor.signature !== signature) {
		throw new Error(message);
	}
	if (dataDescriptor.crc32 != entry.crc32 ||
		dataDescriptor.compressedSize != entry.compressedSize ||
		dataDescriptor.uncompressedSize != entry.uncompressedSize) {
		throw new Error("the values of the data descriptor must be the values of the entry");
	}
}

async function readEntry(writerOptions, readerOptions) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { bufferedWrite: false });
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), writerOptions);
	const data = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), readerOptions);
	const entries = await zipReader.getEntries();
	await entries[0].getData(new zip.TextWriter(), readerOptions);
	await zipReader.close();
	return entries[0];
}
