/* global Blob */

import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const TEXT_CONTENT_REPEAT = 1024;
const BLOB = new Blob([new Array(TEXT_CONTENT_REPEAT).fill(TEXT_CONTENT).join("")]);

export { test };

const writers = [];

function* blobWriterGenerator() {
	while (true) {
		const writer = new zip.BlobWriter();
		writer.maxSize = (8192 - 512) + Math.floor(Math.random() * 1024);
		writers.push(writer);
		yield writer;
	}
}

async function test() {
	zip.configure({ chunkSize: 1024, useWebWorkers: true });
	const splitZipWriter = blobWriterGenerator();
	const zipWriter = new zip.ZipWriter(splitZipWriter);
	await Promise.all([
		zipWriter.add("lorem1.txt", new zip.BlobReader(BLOB)),
		zipWriter.add("lorem2.txt", new zip.BlobReader(BLOB)),
		zipWriter.add("lorem3.txt", new zip.BlobReader(BLOB))
	]);
	await zipWriter.close();
	const readers = await Promise.all(writers.map(async writer => new zip.BlobReader(await writer.getData())));
	const zipReader = new zip.ZipReader(new zip.SplitDataReader(readers));
	const entries = await zipReader.getEntries();
	const results = await Promise.all(entries.map(async entry => (await entry.getData(new zip.TextWriter())).length == TEXT_CONTENT.length * TEXT_CONTENT_REPEAT));
	await zipReader.close();
	zip.terminateWorkers();
	if (results.includes(false)) {
		throw new Error();
	}
}