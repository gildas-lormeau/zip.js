/* global ReadableStream, WritableStream, CountQueuingStrategy, setTimeout, btoa */

// Regression test for streaming backpressure on the web worker path. Its sibling
// test-writer-backpressure.js covers the in-process pump, which paces the source by awaiting each
// write into the codec. With a worker the codec sits on the other side of postMessage, so the
// pacing comes from the message protocol instead: the worker pulls one chunk at a time and
// acknowledges each write, and both message streams use a high water mark of 1. Nothing else bounds
// the pipeline, so a large entry streamed into a slow output must NOT drain the source far ahead of
// what has been written.
//
// The codec running inside the worker is the same hostile codec as the sibling's: its writable
// never signals backpressure, so any pacing has to come from the message protocol, not from the
// codec. A native CompressionStream was used here before, which made the bound a runtime margin
// (bun pulled 156 chunks ahead against a limit of 200 where deno pulled 31) instead of a property
// of the code under test. Raising the high water mark of the worker message streams
// (web-worker-base.js) is what this test fails on.

import * as zip from "../zip-lib.js";

const CHUNK_SIZE = 16 * 1024;
const CHUNK_COUNT = 256;                 // 4 MB logical input
const MAX_ALLOWED_PULL_AHEAD = 32;       // paced: single digits on every runtime; unbounded (bug): ~250
const COMPRESSION_METHOD_FLOODING = 199;
const FORMAT_FLOODING = "flooding-worker-test";

const FLOODING_MODULE_CODE = `class FloodingCompressionStream {
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
		}, { highWaterMark: Number.MAX_SAFE_INTEGER });

		function releaseWrite() {
			if (resolveWrite) {
				const resolve = resolveWrite;
				resolveWrite = undefined;
				resolve();
			}
		}
	}
}
export { FloodingCompressionStream as CompressionStream, FloodingCompressionStream as DecompressionStream };`;

export { test };

async function test() {
	// Set chunkSize explicitly: tests run sequentially and a previous one may have left a tiny
	// chunkSize, which would re-chunk the input into a huge number of pipeline chunks.
	zip.configure({ chunkSize: CHUNK_SIZE, useWebWorkers: true });
	zip.registerCodec({
		compressionMethod: COMPRESSION_METHOD_FLOODING,
		format: FORMAT_FLOODING,
		codecURI: "data:text/javascript;base64," + btoa(FLOODING_MODULE_CODE)
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
			throw new Error(`source drained ${maxPullAhead} chunks ahead of output (limit ${MAX_ALLOWED_PULL_AHEAD}): streaming backpressure is not being applied across the worker boundary`);
		}
	} finally {
		zip.unregisterCodec(COMPRESSION_METHOD_FLOODING);
		await zip.terminateWorkers();
	}
}
