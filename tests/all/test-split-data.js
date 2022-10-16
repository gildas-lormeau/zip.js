/* global Blob, TextDecoder */

import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const BLOB_CONTENT = new Blob([TEXT_CONTENT]);

export { test };

const writers = [];

function* arrayWriterGenerator() {
	while (true) {
		const writer = new zip.Uint8ArrayWriter();
		writers.push(writer);
		yield writer;
	}
}

async function test() {
	zip.configure({ chunkSize: 1024, useWebWorkers: true });
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter());
	const readers = [
		new zip.TextReader(TEXT_CONTENT),
		new zip.BlobReader(BLOB_CONTENT)
	];
	await zipWriter.add("loremx2.txt", readers);
	const blob = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
	const firstEntry = (await zipReader.getEntries()).shift();
	await firstEntry.getData(new zip.SplitDataWriter(arrayWriterGenerator(), 128));
	const chunks = await Promise.all(writers.map(writer => writer.getData()));
	const text = new TextDecoder().decode(new Uint8Array(chunks.map(data => Array.from(data)).flat()));
	zip.terminateWorkers();
	if (text != TEXT_CONTENT + TEXT_CONTENT) {
		throw new Error();
	}
}