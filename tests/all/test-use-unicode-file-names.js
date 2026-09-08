/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

async function test() {
	let blobWriter;
	// the flag announces that the name and the comment are UTF-8, so it is only needed when they hold
	// something outside ASCII, which every other writer decides the same way
	blobWriter = await buildZip();
	await assertLanguageEncodingFlagIs(false, blobWriter);

	blobWriter = await buildZip({ useUnicodeFileNames: true });
	await assertLanguageEncodingFlagIs(true, blobWriter);

	blobWriter = await buildZip({ useUnicodeFileNames: false });
	await assertLanguageEncodingFlagIs(false, blobWriter);

	await assertDerivedFlag({ filename: FILENAME }, false);
	await assertDerivedFlag({ filename: "café.txt" }, true);
	// the flag covers the comment too, so an ASCII name is not enough on its own
	await assertDerivedFlag({ filename: FILENAME, comment: "hello" }, false);
	await assertDerivedFlag({ filename: FILENAME, comment: "café" }, true);

	// the two encodings agree on printable ASCII only: the CP437 table decodes 0x01-0x1f and 0x7f into the
	// IBM graphic characters, deliberately, so a name or a comment holding one of them still needs the flag
	await assertDerivedFlag({ filename: "a\tb.txt" }, true);
	await assertDerivedFlag({ filename: "a\x7Fb.txt" }, true);
	await assertDerivedFlag({ filename: FILENAME, comment: "line1\nline2" }, true);
}

async function buildZip(options) {
	const blobWriter = new zip.BlobWriter("application/zip");

	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const zipWriter = new zip.ZipWriter(blobWriter, options);
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
	await zipWriter.close();
	return blobWriter;
}

async function assertDerivedFlag({ filename, comment }, expectedLanguageEncodingFlag) {
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter());
	await zipWriter.add(filename, new zip.BlobReader(BLOB), comment === undefined ? undefined : { comment });
	const zipReader = new zip.ZipReader(new zip.BlobReader(await zipWriter.close()));
	const [entry] = await zipReader.getEntries();
	await zipReader.close();
	if (entry.bitFlag.languageEncodingFlag != expectedLanguageEncodingFlag) {
		throw new Error(`Expected language flag to be ${expectedLanguageEncodingFlag} for ${JSON.stringify(filename)}` +
			`${comment === undefined ? "" : " with comment " + JSON.stringify(comment)}`);
	}
	if (entry.filename != filename || (comment !== undefined && entry.comment != comment)) {
		throw new Error(`Expected ${JSON.stringify(filename)} to round trip, got ${JSON.stringify(entry.filename)}` +
			`${comment === undefined ? "" : " and comment " + JSON.stringify(entry.comment)}`);
	}
}

async function assertLanguageEncodingFlagIs(expectedLanguageEncodingFlag, blobWriter) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const actual = entries[0].bitFlag.languageEncodingFlag;
	if (actual == expectedLanguageEncodingFlag) {
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