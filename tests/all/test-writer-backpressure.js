/* global ReadableStream, WritableStream, CountQueuingStrategy, setTimeout */

// Regression test for streaming backpressure. A codec that does not signal backpressure on its
// writable side leaves `writer.ready` resolved, so a ready-gated pipe pulls the whole source into
// the codec and peak memory grows with the entry size. zip.js awaits each write instead of trusting
// `ready`, which keeps one chunk in flight whatever `ready` reports. A large entry streamed into a
// slow output must therefore NOT drain the source far ahead of what has been written.
//
// The codec registered below is that hostile codec: its writable never signals backpressure, while
// its `write()` resolves only once the previous chunk has been read, so awaiting the write paces the
// source and gating on `ready` alone does not. Bun's native CompressionStream behaved exactly that
// way until 1.4.0 fixed it, which is why the test used to force the native codec instead — it then
// only measured the invariant on that one runtime, and stopped measuring anything once it was fixed.
// A registered codec keeps the pump under test on every runtime and makes the numbers deterministic;
// it also takes the same `pipeThroughBackpressured` path as the native one, and its output is never
// parsed, so the codec is free to pass the bytes through unchanged.

import * as zip from "../../lib/zip-core.js";

const CHUNK_SIZE = 16 * 1024;
const CHUNK_COUNT = 256;                 // 4 MB logical input
const MAX_ALLOWED_PULL_AHEAD = 32;       // paced: 8 to 10 on every runtime; ready-gated (bug): ~250
const COMPRESSION_METHOD_FLOODING = 199;
const FORMAT_FLOODING = "flooding-test";
const NO_BACKPRESSURE_HIGH_WATER_MARK = Number.MAX_SAFE_INTEGER;

export { test };

class FloodingCompressionStream {

	constructor() {
		const stream = this;
		let readableController, resolveWrite;
		stream.readable = new ReadableStream({
			start(controller) {
				readableController = controller;
			},
			pull: releaseWrite
		});
		stream.writable = new WritableStream({
			write(chunk) {
				readableController.enqueue(chunk);
				if (readableController.desiredSize <= 0) {
					return new Promise(resolve => resolveWrite = resolve);
				}
			},
			close() {
				readableController.close();
			},
			abort(reason) {
				readableController.error(reason);
				releaseWrite();
			}
		}, { highWaterMark: NO_BACKPRESSURE_HIGH_WATER_MARK });

		function releaseWrite() {
			if (resolveWrite) {
				const resolve = resolveWrite;
				resolveWrite = undefined;
				resolve();
			}
		}
	}
}

async function test() {
	// Set chunkSize explicitly: tests run sequentially and a previous one may have left a tiny
	// chunkSize, which would re-chunk the input into a huge number of pipeline chunks.
	zip.configure({ chunkSize: CHUNK_SIZE, useWebWorkers: false });
	zip.registerCodec({
		compressionMethod: COMPRESSION_METHOD_FLOODING,
		format: FORMAT_FLOODING,
		CompressionStream: FloodingCompressionStream,
		DecompressionStream: FloodingCompressionStream
	});
	try {
		let produced = 0;
		let written = 0;
		let maxPullAhead = 0;

		const source = new ReadableStream({
			pull(controller) {
				if (produced >= CHUNK_COUNT) {
					controller.close();
					return;
				}
				produced++;
				maxPullAhead = Math.max(maxPullAhead, produced - written);
				controller.enqueue(new Uint8Array(CHUNK_SIZE));
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
		await zipWriter.add("data.bin", source, { compressionMethod: COMPRESSION_METHOD_FLOODING });
		await zipWriter.close();

		if (maxPullAhead > MAX_ALLOWED_PULL_AHEAD) {
			throw new Error(`source drained ${maxPullAhead} chunks ahead of output (limit ${MAX_ALLOWED_PULL_AHEAD}): streaming backpressure is not being applied`);
		}
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_FLOODING);
		await zip.terminateWorkers();
	}
}
