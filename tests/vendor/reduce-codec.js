/* global TransformStream, Uint8Array */

import { expand } from "./expand.js";

const COMPRESSION_METHOD_REDUCE_1 = 2;

class ReduceDecompressionStream extends TransformStream {
	constructor(format, { compressionMethod, uncompressedSize }) {
		const chunks = [];
		const compressionFactor = compressionMethod - COMPRESSION_METHOD_REDUCE_1 + 1;
		super({
			transform(chunk) {
				chunks.push(chunk);
			},
			flush(controller) {
				const { output } = expand(concat(chunks), uncompressedSize, compressionFactor);
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

export { ReduceDecompressionStream as DecompressionStream };
