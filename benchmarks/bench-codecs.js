/* global WebAssembly, DecompressionStream */

// Codec-level comparison, with no zip container around it: the three codecs zip.js can run
// (the platform CompressionStream, the bundled WebAssembly zlib, the pure-JavaScript zlib port)
// against fflate, on identical bytes.
//
// Why this table reports the compressed size next to every time: the libraries do not agree on what
// a compression "level" is. fflate's levels are its own parameter set, not zlib's, so comparing
// "level 6" to "level 6" compares two different algorithms and reads a ratio difference as a speed
// difference. Sorting the results by output size instead makes the trade visible: a codec is only
// faster than another if it is faster at the same size.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as fflate from "fflate";
import { loadFiles } from "./lib/corpus.js";
import { setWasmExports, CompressionStreamZlib, DecompressionStreamZlib } from "../lib/core/streams/zlib-wasm/zlib-streams.js";
import {
	CompressionStreamZlib as CompressionStreamJS,
	DecompressionStreamZlib as DecompressionStreamJS
} from "../lib/core/streams/zlib-js/zlib-streams.min.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const WASM_PATH = join(HERE, "..", "lib", "core", "streams", "zlib-wasm", "zlib-streams.wasm");
const RUNS = Number(process.env.RUNS || 3);
const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const CHUNK_SIZE = 256 * 1024;
const MB = 1024 * 1024;

setWasmExports((await WebAssembly.instantiate(readFileSync(WASM_PATH))).instance.exports);

const corpus = Object.values(loadFiles("text-20mb").files)[0];
const megabytes = corpus.length / MB;

const compressPoints = [];
for (const level of LEVELS) {
	compressPoints.push(await measure("WASM", `level ${level}`, () => pipe(corpus, new CompressionStreamZlib("deflate-raw", { level }))));
	compressPoints.push(await measure("pure-JS", `level ${level}`, () => pipe(corpus, new CompressionStreamJS("deflate-raw", { level }))));
	compressPoints.push(await measure("fflate", `level ${level}`, () => ({ size: fflate.deflateSync(corpus, { level }).length })));
}
compressPoints.push(await measure("CompressionStream", "no level control", () => pipe(corpus, new CompressionStream("deflate-raw"))));

const deflated = await pipe(corpus, new CompressionStreamZlib("deflate-raw", { level: 6 }));
const decompressPoints = [
	await measure("WASM", "inflate", () => pipe(deflated.data, new DecompressionStreamZlib("deflate-raw"))),
	await measure("pure-JS", "inflate", () => pipe(deflated.data, new DecompressionStreamJS("deflate-raw"))),
	await measure("fflate", "inflate", () => ({ size: fflate.inflateSync(deflated.data).length })),
	await measure("CompressionStream", "inflate", () => pipe(deflated.data, new DecompressionStream("deflate-raw")))
];

report();

function report() {
	console.log(`# Codecs — ${corpus.length} bytes of compressible text — Node ${process.version}, ${RUNS} runs\n`);
	console.log("Compression, sorted by output size. A row is on the frontier when nothing smaller is faster.\n");
	const sorted = [...compressPoints].sort((pointLeft, pointRight) => pointLeft.size - pointRight.size);
	let bestMs = Infinity;
	for (const point of sorted) {
		point.frontier = point.ms < bestMs;
		if (point.frontier) {
			bestMs = point.ms;
		}
		console.log(`${point.codec.padEnd(18)} ${point.setting.padEnd(17)} ${String(point.size).padStart(9)}   ratio ${(corpus.length / point.size).toFixed(3)}   ${point.ms.toFixed(0).padStart(6)} ms   ${(megabytes / (point.ms / 1000)).toFixed(1).padStart(6)} MB/s   ${point.frontier ? "frontier" : ""}`);
	}
	console.log("\nDecompression of the same level-6 stream.\n");
	for (const point of decompressPoints) {
		console.log(`${point.codec.padEnd(18)} ${point.setting.padEnd(17)} ${point.ms.toFixed(0).padStart(6)} ms   ${(megabytes / (point.ms / 1000)).toFixed(1).padStart(6)} MB/s`);
	}
	const outPath = join(HERE, "results", "codecs-results.json");
	writeFileSync(outPath, JSON.stringify({
		runtime: process.version,
		runs: RUNS,
		inputBytes: corpus.length,
		compress: compressPoints,
		decompress: decompressPoints
	}, null, 2));
	console.log("\nwrote " + outPath);
}

async function measure(codec, setting, run) {
	const times = [];
	let last;
	for (let index = 0; index < RUNS; index++) {
		const start = performance.now();
		last = await run();
		times.push(performance.now() - start);
	}
	times.sort((timeLeft, timeRight) => timeLeft - timeRight);
	return { codec, setting, ms: times[Math.floor(times.length / 2)], size: last.size };
}

// the codecs are TransformStreams, so they are driven the way zip.js drives them: a chunked input
// and one output chunk at a time, never a single buffer handed over in one call
async function pipe(data, transformStream) {
	const readable = new ReadableStream({
		start(controller) {
			for (let offset = 0; offset < data.length; offset += CHUNK_SIZE) {
				controller.enqueue(data.subarray(offset, Math.min(offset + CHUNK_SIZE, data.length)));
			}
			controller.close();
		}
	});
	const parts = [];
	let size = 0;
	for await (const part of readable.pipeThrough(transformStream)) {
		parts.push(part);
		size += part.length;
	}
	const output = new Uint8Array(size);
	let offset = 0;
	for (const part of parts) {
		output.set(part, offset);
		offset += part.length;
	}
	return { size, data: output };
}
