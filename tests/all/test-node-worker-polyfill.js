/* global globalThis */

import * as zip from "../zip-lib.js";

export { test };

const CONTENT_REPETITIONS = 10000;

async function test() {
	const { default: NodeWorker } = await import("web-worker");
	let workerCount = 0;
	let workerMessageCount = 0;
	globalThis.Worker = class extends NodeWorker {
		constructor(...args) {
			super(...args);
			workerCount++;
			this.addEventListener("message", () => workerMessageCount++);
		}
	};
	try {
		zip.configure({ useWebWorkers: true });
		const expectedText = "lorem ipsum dolor ".repeat(CONTENT_REPETITIONS);
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 9 });
		await zipWriter.add("entry.txt", new zip.TextReader(expectedText));
		const data = await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		const [entry] = await zipReader.getEntries();
		const text = await entry.getData(new zip.TextWriter());
		await zipReader.close();
		if (!workerCount) {
			throw new Error("expected the polyfilled worker to be instantiated");
		}
		if (workerMessageCount < 2) {
			throw new Error("expected messages from the polyfilled worker");
		}
		if (text != expectedText) {
			throw new Error("unexpected content");
		}
	} finally {
		await zip.terminateWorkers();
		delete globalThis.Worker;
	}
}
