/* global URL, setTimeout, clearTimeout */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.";
const FILENAME = "lorem.txt";
const SILENT_WORKER_URI = new URL("./../data/silent-worker.js", import.meta.url).href;
const MISSING_WORKER_URI = new URL("./../data/missing-worker.js", import.meta.url).href;
const TEST_TIMEOUT = 10000;

export { test };

async function test() {
	zip.configure({ useWebWorkers: true, workerStartupTimeout: 250, workerURI: SILENT_WORKER_URI });
	const textSilentWorker = await withTimeout(roundTrip());
	await zip.terminateWorkers();
	zip.configure({ useWebWorkers: true, workerStartupTimeout: 250, workerURI: MISSING_WORKER_URI });
	const textMissingWorker = await withTimeout(roundTrip());
	await zip.terminateWorkers();
	if (textSilentWorker != TEXT_CONTENT || textMissingWorker != TEXT_CONTENT) {
		throw new Error();
	}
}

async function roundTrip() {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const text = await entries[0].getData(new zip.TextWriter(), { checkCrc32: true });
	await zipReader.close();
	return text;
}

function withTimeout(promise) {
	let timeout;
	return Promise.race([
		promise,
		new Promise((_, reject) => timeout = setTimeout(() => reject(new Error("test timeout")), TEST_TIMEOUT))
	]).finally(() => clearTimeout(timeout));
}
