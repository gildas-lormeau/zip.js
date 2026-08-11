/* global TransformStream, Uint8Array */

import { unshrink } from "./unshrink.js";

class ShrinkDecompressionStream extends TransformStream {
	constructor(format, { uncompressedSize }) {
		const chunks = [];
		super({
			transform(chunk) {
				chunks.push(chunk);
			},
			flush(controller) {
				const { output } = unshrink(concat(chunks), uncompressedSize);
				controller.enqueue(output);
			}
		});
	}
}

function concat(chunks) {
	const result = new Uint8Array(chunks.reduce((length, chunk) => length + chunk.length, 0));
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}
	return result;
}

export { ShrinkDecompressionStream as DecompressionStream };
