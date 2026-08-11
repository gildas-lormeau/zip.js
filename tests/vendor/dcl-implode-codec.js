/* global TransformStream, Uint8Array */

import { explode, implode } from "./node-pkware/index.js";

class DclImplodeCompressionStream extends TransformStream {
	constructor() {
		const chunks = [];
		super({
			transform(chunk) {
				chunks.push(chunk);
			},
			flush(controller) {
				controller.enqueue(new Uint8Array(implode(concat(chunks).buffer, "binary", "large")));
			}
		});
	}
}

class DclImplodeDecompressionStream extends TransformStream {
	constructor() {
		const chunks = [];
		super({
			transform(chunk) {
				chunks.push(chunk);
			},
			flush(controller) {
				controller.enqueue(new Uint8Array(explode(concat(chunks).buffer)));
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

export { DclImplodeCompressionStream as CompressionStream, DclImplodeDecompressionStream as DecompressionStream };
