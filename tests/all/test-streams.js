/* global TransformStream, Blob, Response */

import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const zipStream = new TransformStream();
	const zipWriter = new zip.ZipWriter(zipStream.writable);
	const zipReader = new zip.ZipReader(zipStream.readable);
	const [entries] = await Promise.all([
		zipReader.getEntries(),
		zipWriter.add(FILENAME, new Blob([TEXT_CONTENT]).stream()),
		zipWriter.close()
	]);
	const firstEntry = entries.shift();
	const entryStream = new TransformStream();
	const [entryText] = await Promise.all([
		new Response(entryStream.readable).text(),
		firstEntry.getData(entryStream.writable),
		zipReader.close()
	]);
	await zip.terminateWorkers();
	if (TEXT_CONTENT != entryText || firstEntry.uncompressedSize != TEXT_CONTENT.length || firstEntry.compressedSize <= 0) {
		throw new Error();
	}
}