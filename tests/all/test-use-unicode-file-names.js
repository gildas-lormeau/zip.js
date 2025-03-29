/* global Blob */

import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

async function test() {
	let blobWriter;
	blobWriter = await buildZip();
	await assertLanguageEncodingFlagIs(true, blobWriter);

	blobWriter = await buildZip({ useUnicodeFileNames: false });
	await assertLanguageEncodingFlagIs(false, blobWriter);
}

async function buildZip(options) {
	const blobWriter = new zip.BlobWriter("application/zip");

	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const zipWriter = new zip.ZipWriter(blobWriter, options);
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
	await zipWriter.close();
	return blobWriter;
}

async function assertLanguageEncodingFlagIs(expectedLanguageEncodingFlag, blobWriter) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const actual = entries[0].bitFlag.languageEncodingFlag;
	if (actual === expectedLanguageEncodingFlag) {
		const data = await entries[0].getData(new zip.BlobWriter(zip.getMimeType(entries[0].filename)));
		await zipReader.close();
		await zip.terminateWorkers();
		if (TEXT_CONTENT != await data.text() || entries[0].filename != FILENAME || entries[0].uncompressedSize != TEXT_CONTENT.length) {
			throw new Error();
		}
	} else {
		throw new Error(`Expected language flag to be ${expectedLanguageEncodingFlag}, but was ${actual}`);
	}
}