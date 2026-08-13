/* global btoa */

import * as zip from "../zip-lib.js";

export { test };

const COMPRESSION_METHOD_XOR = 93;
const FORMAT_XOR = "xor-import-fallback";
const XOR_MASK = 0x55;
const MAIN_SCOPE_FLAG = "__zipMainScopeFlag";

const TEXT_CONTENT = "The quick brown fox jumps over the lazy dog. ".repeat(40);

const MODULE_CODE = `if (!globalThis.${MAIN_SCOPE_FLAG}) {
	throw new Error("codec module loaded outside the main scope");
}
class XorStream extends TransformStream {
	constructor() {
		super({
			transform(chunk, controller) {
				const output = new Uint8Array(chunk.length);
				for (let indexByte = 0; indexByte < chunk.length; indexByte++) {
					output[indexByte] = chunk[indexByte] ^ ${XOR_MASK};
				}
				controller.enqueue(output);
			}
		});
	}
}
export { XorStream as CompressionStream, XorStream as DecompressionStream };`;

async function test() {
	const OriginalWorker = globalThis.Worker;
	const BaseWorker = OriginalWorker || (await import("web-worker")).default;
	let workerCount = 0;
	globalThis.Worker = class extends BaseWorker {
		constructor(...args) {
			super(...args);
			workerCount++;
		}
	};
	globalThis[MAIN_SCOPE_FLAG] = true;
	try {
		zip.configure({ useWebWorkers: true });
		zip.registerCodec({
			compressionMethod: COMPRESSION_METHOD_XOR,
			format: FORMAT_XOR,
			codecURI: "data:text/javascript;base64," + btoa(MODULE_CODE)
		});
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.add("entry.txt", new zip.TextReader(TEXT_CONTENT), { compressionMethod: COMPRESSION_METHOD_XOR });
		const data = await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { checkSignature: true });
		const [entry] = await zipReader.getEntries();
		const text = await entry.getData(new zip.TextWriter());
		await zipReader.close();
		if (!workerCount) {
			throw new Error("expected a web worker to be instantiated");
		}
		if (text != TEXT_CONTENT) {
			throw new Error("entry did not round-trip");
		}
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_XOR);
		await zip.terminateWorkers();
		delete globalThis[MAIN_SCOPE_FLAG];
		if (OriginalWorker) {
			globalThis.Worker = OriginalWorker;
		} else {
			delete globalThis.Worker;
		}
	}
}
