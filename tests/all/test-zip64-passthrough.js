/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	// a compressed zip64 entry written with a data descriptor
	let blobWriter = new zip.BlobWriter("application/zip");
	let zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB), { zip64: true });
	const compressedZip64Blob = await zipWriter.close();
	let zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	let entries = await zipReader.getEntries();
	let data = await entries[0].getData(new zip.BlobWriter(), { passThrough: true });
	await zipReader.close();
	if (data.size != entries[0].compressedSize) {
		throw new Error();
	}
	// re-wrap the already-compressed data as a zip64 passThrough entry
	const signature = entries[0].signature;
	const uncompressedSize = TEXT_CONTENT.length;
	blobWriter = new zip.BlobWriter("application/zip");
	zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.BlobReader(data), { zip64: true, passThrough: true, uncompressedSize, signature });
	const passThroughZip64Blob = await zipWriter.close();
	zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	entries = await zipReader.getEntries();
	data = await entries[0].getData(new zip.TextWriter(), { checkCrc32: true });
	await zipReader.close();
	await zip.terminateWorkers();
	// the passThrough round-trip must reproduce the original content, and both zip64 entries
	// must carry the local zip64 extra field so streaming readers can size the 8-byte data
	// descriptor (APPNOTE 4.3.9.2)
	if (data != TEXT_CONTENT ||
		!await hasLocalZip64ExtraField(compressedZip64Blob) ||
		!await hasLocalZip64ExtraField(passThroughZip64Blob)) {
		throw new Error();
	}
}

// scan the first local file header's extra fields for the zip64 tag (0x0001)
async function hasLocalZip64ExtraField(blob) {
	const bytes = new Uint8Array(await blob.arrayBuffer());
	const view = new DataView(bytes.buffer);
	const filenameLength = view.getUint16(26, true);
	const extraFieldLength = view.getUint16(28, true);
	let offset = 30 + filenameLength;
	const extraFieldEnd = offset + extraFieldLength;
	while (offset + 4 <= extraFieldEnd) {
		if (view.getUint16(offset, true) == 0x0001) {
			return true;
		}
		offset += 4 + view.getUint16(offset + 2, true);
	}
	return false;
}
