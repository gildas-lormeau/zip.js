/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

const DIRECTORY_NAME = "dir/";

export { test };

async function test() {
	await testContentlessEntries();
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	let blobWriter = new zip.BlobWriter("application/zip");
	let zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
	await zipWriter.close();
	let zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	let entries = await zipReader.getEntries();
	let data = await entries[0].getData(new zip.BlobWriter(), { passThrough: true });
	await zipReader.close();
	if (data.size != entries[0].compressedSize) {
		throw new Error();
	}
	const signature = entries[0].signature;
	const uncompressedSize = TEXT_CONTENT.length;
	blobWriter = new zip.BlobWriter("application/zip");
	zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.BlobReader(data), { passThrough: true, uncompressedSize, signature });
	await zipWriter.close();
	zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	entries = await zipReader.getEntries();
	data = await entries[0].getData(new zip.TextWriter(), { checkSignature: true });
	await zipReader.close();
	await zip.terminateWorkers();
	if (data != TEXT_CONTENT) {
		throw new Error();
	}
}

// A directory has no content to write as-is, so `passThrough` must be ignored for it instead of
// making the entry unwritable, whichever way the option is set. A file entry without a Reader
// instance keeps throwing: its headers would describe content that is not there.
async function testContentlessEntries() {
	const reference = await writeDirectory({});
	const withOption = await writeDirectory({ passThrough: true });
	const withWriterOption = await writeDirectory({}, { passThrough: true });
	if (!bytesEqual(withOption, reference) || !bytesEqual(withWriterOption, reference)) {
		throw new Error("the passThrough option should not change the bytes of a directory entry");
	}
	const error = await getAddError("empty.txt", { passThrough: true });
	if (!error || error.message != zip.ERR_UNDEFINED_READER) {
		throw new Error("expected an " + zip.ERR_UNDEFINED_READER + " error, got " + (error && error.message));
	}
}

async function writeDirectory(entryOptions, writerOptions = {}) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), Object.assign({ lastModDate: new Date(0) }, writerOptions));
	await zipWriter.add(DIRECTORY_NAME, undefined, entryOptions);
	return zipWriter.close();
}

async function getAddError(name, entryOptions) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	try {
		await zipWriter.add(name, undefined, entryOptions);
	} catch (error) {
		return error;
	}
}

function bytesEqual(left, right) {
	return left.length == right.length && left.every((value, index) => value == right[index]);
}