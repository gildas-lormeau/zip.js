/* global globalThis */
/* eslint-disable no-console */

import Worker from "web-worker";
import { Blob } from "blob-polyfill";
import { BlobWriter, BlobReader, TextWriter, ZipWriter, ZipReader, terminateWorkers } from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const TEXT_PLAIN_MIMETYPE = "text/plain";
const BLOB = new Blob([TEXT_CONTENT], { type: TEXT_PLAIN_MIMETYPE });

globalThis.Blob = Blob;
globalThis.Worker = Worker;
test()
	.then(result => result && console.log("ok"))
	.catch(error => console.error(error));

async function test() {
	const blobWriter = new BlobWriter("application/zip");
	const zipWriter = new ZipWriter(blobWriter);
	const entry = await zipWriter.add(FILENAME, new BlobReader(BLOB));
	if (entry.compressionMethod == 0x08) {
		await zipWriter.close();
		const zipReader = new ZipReader(new BlobReader(blobWriter.getData()));
		const entries = await zipReader.getEntries();
		if (entries[0].compressionMethod == 0x08) {
			const data = await entries[0].getData(new TextWriter());
			await zipReader.close();
			terminateWorkers();
			return TEXT_CONTENT == data && entries[0].filename == FILENAME && entries[0].uncompressedSize == TEXT_CONTENT.length;
		}
	}
} 