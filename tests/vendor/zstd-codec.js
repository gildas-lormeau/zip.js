/* global TransformStream, Uint8Array */

import { Decompress } from "./fzstd/index.js";

const EMPTY_UINT8_ARRAY = new Uint8Array(0);

class ZstdDecompressionStream extends TransformStream {
	constructor() {
		let decompress;
		super({
			start(controller) {
				decompress = new Decompress(chunk => controller.enqueue(chunk));
			},
			transform(chunk) {
				decompress.push(chunk);
			},
			flush() {
				decompress.push(EMPTY_UINT8_ARRAY, true);
			}
		});
	}
}

export { ZstdDecompressionStream as DecompressionStream };
