/* global URL */

import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const url = new URL("./../data/lorem.zip", import.meta.url).href;

export { test };

async function test() {
	zip.configure({ chunkSize: 128 });
	let zipFs = new zip.fs.FS();
	let directory = zipFs.addDirectory("import");
	await directory.importHttpContent(url, { preventHeadRequest: true });
	const blob = await zipFs.exportBlob({ password: "password" });
	zipFs = new zip.fs.FS();
	let text;
	await zipFs.importBlob(blob);
	directory = zipFs.getChildByName("import");
	const firstEntry = directory.children[0];
	try {
		text = await firstEntry.getText();
	} catch (error) {
		if (error.message == zip.ERR_ENCRYPTED) {
			text = await firstEntry.getText(null, { password: "password" });
		} else {
			throw error;
		}
	}
	zip.terminateWorkers();
	return text == TEXT_CONTENT && firstEntry.uncompressedSize == TEXT_CONTENT.length;
}