/* global Blob, ReadableStream, TextEncoder, setTimeout */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const BLOB = new Blob([TEXT_CONTENT], { type: "text/plain" });

export { test };

async function test() {
	await removeAddedEntry();
	await removePendingEntry();
}

async function removeAddedEntry() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, {});
	const addedEntries = await Promise.all([
		zipWriter.add("lorem1.txt", new zip.BlobReader(BLOB)),
		zipWriter.add("lorem2.txt", new zip.BlobReader(BLOB)),
	]);
	if (!zipWriter.remove("not-found.txt")) {
		if (zipWriter.remove(addedEntries[0])) {
			await zipWriter.close();
			const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
			const entries = await zipReader.getEntries();
			const fileData = await entries[0].getData(new zip.TextWriter());
			await zipReader.close();
			await zip.terminateWorkers();
			if (entries.length != 1 || fileData != TEXT_CONTENT || entries[0].filename != "lorem2.txt") {
				throw new Error();
			}
		}
	} else {
		throw new Error();
	}
}

// remove() must not touch an entry whose add() is still in flight: it returns false and the entry
// is written normally once the add completes
async function removePendingEntry() {
	zip.configure({ useWebWorkers: false });
	let releaseReader;
	const gate = new Promise(resolve => releaseReader = resolve);
	const readable = new ReadableStream({
		async pull(controller) {
			await gate;
			controller.enqueue(new TextEncoder().encode(TEXT_CONTENT));
			controller.close();
		}
	});
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	const pendingAdd = zipWriter.add("pending.txt", { readable, size: TEXT_CONTENT.length });
	await new Promise(resolve => setTimeout(resolve, 10));
	const removed = zipWriter.remove("pending.txt");
	releaseReader();
	await pendingAdd;
	const data = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	await zip.terminateWorkers();
	if (removed || entries.length != 1 || entries[0].filename != "pending.txt") {
		throw new Error("expected remove() to return false for a pending entry and keep it, got " +
			removed + " and " + entries.length + " entries");
	}
}