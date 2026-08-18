/* global ReadableStream, WritableStream, CountQueuingStrategy, setTimeout */

// Regression test for streaming backpressure on the web worker path. Its sibling
// test-writer-backpressure.js covers the in-process pump, which paces the source by awaiting each
// write into the codec. With a worker the codec sits on the other side of postMessage, so the
// pacing comes from the message protocol instead: the worker pulls one chunk at a time and
// acknowledges each write, and both message streams use a high water mark of 1. Nothing else bounds
// the pipeline, so a large entry streamed into a slow output must NOT drain the source far ahead of
// what has been written. Incompressible data keeps output ~= input, so "chunks read but not yet
// written out" is a faithful proxy for retained memory.
//
// The in-process pump is not on this path: removing its awaited write leaves this test green and
// fails the sibling instead. What this one catches is a deeper message pipeline, e.g. raising the
// high water mark of the worker message streams.

import * as zip from "../zip-lib.js";

const CHUNK_SIZE = 64 * 1024;
const CHUNK_COUNT = 256;                 // 16 MB logical input
const MAX_ALLOWED_PULL_AHEAD = 200;      // deepest observed: 154 (bun); unbounded (bug): ~254

export { test };

async function test() {
	// Set chunkSize explicitly: tests run sequentially and a previous one may have left a tiny
	// chunkSize, which would re-chunk the 16 MB input into a huge number of pipeline chunks.
	zip.configure({ chunkSize: CHUNK_SIZE, useWebWorkers: true, useCompressionStream: true });
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
			throw new Error(`source drained ${maxPullAhead} chunks ahead of output (limit ${MAX_ALLOWED_PULL_AHEAD}): streaming backpressure is not being applied across the worker boundary`);
		}
	} finally {
		await zip.terminateWorkers();
	}
}
