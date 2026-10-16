/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });
const BITFLAG_DATA_DESCRIPTOR = 0x8;
const VERSION_ZIP64 = 45;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { dataDescriptor: false });
	const entry = await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
	if (entry.compressionMethod == 0x08) {
		await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
		const entries = await zipReader.getEntries();
		if (entries[0].compressionMethod == 0x08) {
			const data = await entries[0].getData(new zip.BlobWriter(zip.getMimeType(entries[0].filename)));
			await zipReader.close();
			if (TEXT_CONTENT != await data.text() || entries[0].filename != FILENAME || entries[0].uncompressedSize != TEXT_CONTENT.length) {
				throw new Error();
			}
		} else {
			throw new Error();
		}
	} else {
		throw new Error();
	}
	await unknownSizeEntries();
	await zip.terminateWorkers();
}

// a readable of unknown size needs the descriptor only when the header is written before the data: on
// the buffered path the header is patched afterwards, so the descriptor is left out like for any other entry.
// It commits to zip64 since the compressed size has no bound, unless the uncompressedSize option gives one;
// the sizes written are always the measured ones, so a wrong hint below 4 GB changes nothing
async function unknownSizeEntries() {
	await checkUnknownSizeEntry("bufferedWrite", { bufferedWrite: true }, {}, { dataDescriptor: false, zip64: true });
	await checkUnknownSizeEntry("dataDescriptor false", { dataDescriptor: false }, {}, { dataDescriptor: false, zip64: true });
	await checkUnknownSizeEntry("default", {}, {}, { dataDescriptor: true, zip64: true });
	await checkUnknownSizeEntry("size hint", {}, { uncompressedSize: TEXT_CONTENT.length }, { dataDescriptor: true, zip64: false });
	await checkUnknownSizeEntry("size hint with bufferedWrite", { bufferedWrite: true }, { uncompressedSize: TEXT_CONTENT.length }, { dataDescriptor: false, zip64: false });
	await checkUnknownSizeEntry("size hint too small", {}, { uncompressedSize: 10 }, { dataDescriptor: true, zip64: false });
	await checkUnknownSizeEntry("size hint as a string", {}, { uncompressedSize: String(TEXT_CONTENT.length) }, { dataDescriptor: true, zip64: false });
}

async function checkUnknownSizeEntry(description, writerOptions, entryOptions, expected) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), writerOptions);
	await zipWriter.add(FILENAME, { readable: BLOB.stream() }, entryOptions);
	const data = await zipWriter.close();
	const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
	const dataDescriptorBit = Boolean(dataView.getUint16(6, true) & BITFLAG_DATA_DESCRIPTOR);
	if (dataDescriptorBit != expected.dataDescriptor) {
		throw new Error(description + ": expected bit 3 to be " + expected.dataDescriptor + ", got " + dataDescriptorBit);
	}
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness: "strict", checkCrc32: true, checkOverlappingEntry: true });
	const entries = await zipReader.getEntries();
	const text = await entries[0].getData(new zip.TextWriter());
	await zipReader.close();
	if (text != TEXT_CONTENT || entries[0].uncompressedSize != TEXT_CONTENT.length) {
		throw new Error(description + ": the entry must read back under strict checks");
	}
	// the central directory never needs zip64 for these sizes, the commitment shows in the local header only
	const localZip64 = dataView.getUint16(4, true) >= VERSION_ZIP64;
	if (localZip64 != expected.zip64) {
		throw new Error(description + ": expected the local header zip64 layout to be " + expected.zip64 + ", got version " + dataView.getUint16(4, true));
	}
}
