/* global ReadableStream, TextEncoder */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const ERROR_MESSAGE = "simulated stream error";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const fs = new zip.ZipFS();
	fs.addText("good1.txt", TEXT_CONTENT);
	fs.addText("good2.txt", TEXT_CONTENT);
	fs.addReadable("bad.txt", new ReadableStream({
		start(controller) {
			controller.enqueue(new TextEncoder().encode(TEXT_CONTENT));
		},
		pull(controller) {
			controller.error(new Error(ERROR_MESSAGE));
		}
	}));
	try {
		await fs.exportBlob();
		throw new Error();
	} catch (error) {
		if (error.message != ERROR_MESSAGE) {
			throw error;
		}
	} finally {
		await zip.terminateWorkers();
	}
}
