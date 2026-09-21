/* global Blob, AbortController, AbortSignal */

// An add aborted through its signal rejects with the reason of the signal, whether the abort lands
// while the content is still being read (fired from onprogress) or once it has all been read and only
// the compressed data is still being written (fired from onend, the moment the signal used to be
// ignored since it guarded the input pipe alone).

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await expectAbort("onprogress");
		await expectAbort("onend");
	} finally {
		await zip.terminateWorkers();
	}
}

async function expectAbort(eventName) {
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
	const controller = new AbortController();
	const { signal } = controller;
	const options = { signal };
	options[eventName] = () => controller.abort();
	try {
		await zipWriter.add(FILENAME, new zip.BlobReader(BLOB), options);
	} catch (error) {
		if (!("reason" in AbortSignal.prototype) || signal.reason == error || signal.reason.code == error.code) {
			return;
		}
		throw error;
	}
	throw new Error("the add aborted from " + eventName + " did not reject");
}
