/* global Blob, WritableStream */

import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

async function test() {
	zip.configure({ chunkSize: 128 });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	const entry = await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
	if (entry.compressionMethod == 0x08) {
		await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.BlobReader(blobWriter.getData()));
		const entries = await zipReader.getEntries();
		if (entries[0].compressionMethod == 0x08) {
			const data = new Uint8Array(entries[0].uncompressedSize);
			let dataOffset = 0;
			await entries[0].getData(new zip.WritableStreamWriter(new WritableStream({
				write(chunk) {
					data.set(chunk, dataOffset);
					dataOffset += chunk.length;
				}
			})));
			await zipReader.close();
			zip.terminateWorkers();
			return TEXT_CONTENT == (await new Blob([data]).text());
		}
	}
}