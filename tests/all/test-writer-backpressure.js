/* global ReadableStream, WritableStream, CountQueuingStrategy, setTimeout */

// Regression test for streaming backpressure. A codec that does not signal backpressure on its
// writable side leaves `writer.ready` resolved, so a ready-gated pipe pulls the whole source into
// the codec and peak memory grows with the entry size. Bun's native CompressionStream does exactly
// that and accepts writes without limit. The other engines bound the queue, and the pure-JS and
// WASM codecs signal backpressure correctly everywhere. zip.js awaits each write instead of
// trusting `ready`, which keeps one chunk in flight whatever `ready` reports. A large entry
// streamed into a slow output must therefore NOT drain the source far ahead of what has been
// written. The configuration below forces the native codec. Incompressible data keeps output ~=
// input, so "chunks read but not yet written out" is a faithful proxy for retained memory.

import * as zip from "../../lib/zip-core.js";

const CHUNK_SIZE = 64 * 1024;
const CHUNK_COUNT = 256;                 // 16 MB logical input
const MAX_ALLOWED_PULL_AHEAD = 128;      // fixed: ~66; unbounded (bug): ~254

export { test };

async function test() {
	// Set chunkSize explicitly: tests run sequentially and a previous one may have left a tiny
	// chunkSize, which would re-chunk the 16 MB input into a huge number of pipeline chunks.
	zip.configure({ chunkSize: CHUNK_SIZE, useWebWorkers: false, useCompressionStream: true });
	try {
		let produced = 0;
		let written = 0;
		let maxPullAhead = 0;
		let seed = 0x12345678;

		const source = new ReadableStream({
			pull(controller) {
				if (produced >= CHUNK_COUNT) {
					controller.close();
					return;
				}
				produced++;
				maxPullAhead = Math.max(maxPullAhead, produced - written);
				const chunk = new Uint8Array(CHUNK_SIZE);
				for (let index = 0; index < CHUNK_SIZE; index++) {
					seed = (seed * 1103515245 + 12345) & 0x7fffffff;
					chunk[index] = seed & 0xff;
				}
				controller.enqueue(chunk);
			}
		}, new CountQueuingStrategy({ highWaterMark: 2 }));

		// A slow, back-pressuring output: one input chunk's worth is treated as drained per write.
		const sink = new WritableStream({
			async write() {
				written = produced;
				await new Promise(resolve => setTimeout(resolve, 0));
			}
		}, new CountQueuingStrategy({ highWaterMark: 2 }));

		const zipWriter = new zip.ZipWriter(sink);
		await zipWriter.add("data.bin", source);
		await zipWriter.close();

		if (maxPullAhead > MAX_ALLOWED_PULL_AHEAD) {
			throw new Error(`source drained ${maxPullAhead} chunks ahead of output (limit ${MAX_ALLOWED_PULL_AHEAD}): streaming backpressure is not being applied`);
		}
	} finally {
		await zip.terminateWorkers();
	}
}
