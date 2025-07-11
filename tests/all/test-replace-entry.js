/* global Blob, URL */

import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const BLOB = new Blob([TEXT_CONTENT], { type: "text/plain" });
const url = new URL("./../data/lorem.zip", import.meta.url).href;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, {});
	await zipWriter.prependZip(new zip.HttpReader(url, { preventHeadRequest: true }));
	if (!zipWriter.remove("not-found.txt")) {
		if (zipWriter.remove("lorem.txt")) {
			await zipWriter.add("lorem.txt", new zip.BlobReader(BLOB));
			await zipWriter.close();
			const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
			const entries = await zipReader.getEntries();
			const files = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
			await zipReader.close();
			await zip.terminateWorkers();
			if (files.length != 1 || files[0] !== TEXT_CONTENT) {
				throw new Error();
			}
		}
	} else {
		throw new Error();
	}
}