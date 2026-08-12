import * as zip from "../../lib/zip-fs-external.js";
import { configureExternalAssets } from "../../lib/core/external-assets.js";
import { getConfiguration, setDefaultConfiguration } from "../../lib/core/configuration.js";
import { configureWebWorker } from "../../lib/core/web-worker-inline-wasm.js";
import { configureZlibModule } from "../../lib/core/zlib-streams-inline.js";

export { test };

const CONTENT_REPETITIONS = 10000;

async function test() {
	const OriginalWorker = globalThis.Worker;
	const BaseWorker = OriginalWorker || (await import("web-worker")).default;
	let workerCount = 0;
	let workerMessageCount = 0;
	globalThis.Worker = class extends BaseWorker {
		constructor(...args) {
			super(...args);
			workerCount++;
			this.addEventListener("message", () => workerMessageCount++);
		}
	};
	try {
		configureExternalAssets();
		const { workerURI, wasmURI } = getConfiguration();
		if (!workerURI.endsWith("/dist/zip-web-worker.js")) {
			throw new Error("unexpected worker URI: " + workerURI);
		}
		if (!wasmURI.endsWith("/dist/zip-module.wasm")) {
			throw new Error("unexpected wasm URI: " + wasmURI);
		}
		zip.configure({ useWebWorkers: true, useCompressionStream: false });
		const expectedText = "lorem ipsum dolor ".repeat(CONTENT_REPETITIONS);
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 9 });
		await zipWriter.add("entry.txt", new zip.TextReader(expectedText));
		const data = await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		const [entry] = await zipReader.getEntries();
		const text = await entry.getData(new zip.TextWriter());
		await zipReader.close();
		if (!workerCount) {
			throw new Error("expected a web worker instantiated from the external script");
		}
		if (workerMessageCount < 2) {
			throw new Error("expected messages from the external web worker");
		}
		if (text != expectedText) {
			throw new Error("unexpected content");
		}
	} finally {
		await zip.terminateWorkers();
		if (OriginalWorker) {
			globalThis.Worker = OriginalWorker;
		} else {
			delete globalThis.Worker;
		}
		configureWebWorker(setDefaultConfiguration);
		configureZlibModule(setDefaultConfiguration);
	}
}
