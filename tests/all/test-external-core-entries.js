import * as zip from "../../lib/zip-fs-core-external.js";
import { getMimeType } from "../../lib/zip-mime-types.js";
import { configureExternalAssets } from "../../lib/core/external-assets.js";
import { getConfiguration, setDefaultConfiguration } from "../../lib/core/configuration.js";
import { configureWebWorker } from "../../lib/core/web-worker-inline-wasm.js";
import { configureZlibModule } from "../../lib/core/zlib-streams-inline.js";

export { test };

async function test() {
	try {
		configureExternalAssets();
		const { workerURI, wasmURI } = getConfiguration();
		if (!workerURI.endsWith("/dist/zip-web-worker.js")) {
			throw new Error("unexpected worker URI: " + workerURI);
		}
		if (!wasmURI.endsWith("/dist/zip-module.wasm")) {
			throw new Error("unexpected wasm URI: " + wasmURI);
		}
		if (zip.getMimeType("image.png") != "application/octet-stream") {
			throw new Error("expected the default mime type");
		}
		if (getMimeType("image.png") != "image/png") {
			throw new Error("unexpected mime type");
		}
		const zipFs = new zip.fs.FS();
		const entry = zipFs.addText("entry.txt", "content");
		if (!entry || zipFs.children.length != 1) {
			throw new Error("unexpected filesystem content");
		}
	} finally {
		configureWebWorker(setDefaultConfiguration);
		configureZlibModule(setDefaultConfiguration);
	}
}
