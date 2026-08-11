/* global TransformStream, Uint8Array */

import { explode } from "./explode.js";

const BITFLAG_LARGE_WINDOW = 0x2;
const BITFLAG_LITERAL_TREE = 0x4;

class ImplodeDecompressionStream extends TransformStream {
	constructor(format, { rawBitFlag, uncompressedSize }) {
		const chunks = [];
		super({
			transform(chunk) {
				chunks.push(chunk);
			},
			flush(controller) {
				const input = concat(chunks);
				const largeWindow = Boolean(rawBitFlag & BITFLAG_LARGE_WINDOW);
				const literalTree = Boolean(rawBitFlag & BITFLAG_LITERAL_TREE);
				let result;
				try {
					result = explode(input, uncompressedSize, largeWindow, literalTree, false);
					if (result.bytesRead != input.length) {
						result = null;
					}
				} catch {
					result = null;
				}
				if (!result) {
					result = explode(input, uncompressedSize, largeWindow, literalTree, true);
				}
				controller.enqueue(result.output);
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

export { ImplodeDecompressionStream as DecompressionStream };
