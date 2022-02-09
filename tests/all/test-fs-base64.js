/* global btoa */

import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const DATA_URI = "data:text/plain;base64," + btoa(TEXT_CONTENT);

export { test };

async function test() {
	zip.configure({ chunkSize: 128 });
	let zipFs = new zip.fs.FS();
	zipFs.addData64URI(FILENAME, DATA_URI);
	const data = await zipFs.exportData64URI();
	zipFs = new zip.fs.FS();
	await zipFs.importData64URI(data);
	const firstEntry = zipFs.children[0];
	const dataURI = await firstEntry.getData64URI("text/plain");
	zip.terminateWorkers();
	return dataURI == DATA_URI && firstEntry.name == FILENAME && firstEntry.uncompressedSize == TEXT_CONTENT.length;
}