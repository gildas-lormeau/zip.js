// The same zip.js code under Node, Bun and Deno. Two parts:
//
//   1. 8 x 8 MB compressible entries at level 6, i.e. the host's CompressionStream: sequential
//      add(), concurrent add(), concurrent add() with 256 KB chunks, and concurrent add() through
//      the Web Worker pool. Concurrent add() alone only parallelizes when the runtime runs the
//      codec off the JS thread, and Bun does so for writes larger than 128 KB only, which is what
//      the chunkSize row shows.
//   2. one 256 MB compressible file, one thread, in memory: the raw CompressionStream fed 64 KB
//      writes (what zip.js writes by default), zip.js around it, and Apple's gzip -6 as a classic
//      zlib reference. This part measures the zlib each runtime vendors, not zip.js.
//   3. one 20 MB compressible entry at the default level, which is the host's CompressionStream,
//      and at levels 5 and 1, which select the bundled WASM zlib because CompressionStream has no
//      level control. Whether a lower level buys speed depends on how fast the host's zlib is.
//      Level 5 also runs on the pure-JavaScript zlib port, the same code on each engine.
//
// In-process, warmup first, median of RUNS. Run with node, bun, or deno run -A; each writes
// results/runtimes-<runtime>-results.json.

import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { loadFiles, ensureDiskFile, WORKLOADS } from "./lib/corpus.js";
import * as zip from "../index.js";
import { CompressionStreamZlib, DecompressionStreamZlib } from "../lib/core/streams/zlib-js/zlib-streams.min.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNS = Number(process.env.RUNS || 3);
const RUNTIME = globalThis.Deno ? "Deno " + globalThis.Deno.version.deno : globalThis.Bun ? "Bun " + globalThis.Bun.version : "Node " + process.version;
const PARALLEL_WORKLOAD = "parallel-8x8mb";
const SINGLE_WORKLOAD = "huge-256mb";
const TEXT_WORKLOAD = "text-20mb";
const MB = 1024 * 1024;

function median(values) {
	values.sort((a, b) => a - b);
	return values[Math.floor(values.length / 2)];
}

async function timed(task) {
	await task();
	const times = [];
	let result;
	for (let run = 0; run < RUNS; run++) {
		const t0 = performance.now();
		result = await task();
		times.push(performance.now() - t0);
	}
	return { medianMs: median(times), ...result };
}

function countingSink() {
	const sink = { bytes: 0 };
	sink.writable = new WritableStream({
		write(chunk) {
			sink.bytes += chunk.length;
		}
	});
	return sink;
}

async function addEntries(files, { concurrent, useWebWorkers, chunkSize }) {
	zip.resetConfiguration();
	zip.configure(chunkSize ? { useWebWorkers, chunkSize } : { useWebWorkers });
	const sink = countingSink();
	const zipWriter = new zip.ZipWriter(sink.writable);
	const adds = Object.entries(files).map(([name, data]) => () => zipWriter.add(name, new zip.Uint8ArrayReader(data)));
	if (concurrent) {
		await Promise.all(adds.map((add) => add()));
	} else {
		for (const add of adds) {
			await add();
		}
	}
	await zipWriter.close();
	await zip.terminateWorkers();
	return { outputBytes: sink.bytes };
}

async function rawCompressionStream(data, writeSize) {
	const sink = countingSink();
	const stream = new CompressionStream("deflate-raw");
	const done = stream.readable.pipeTo(sink.writable);
	const writer = stream.writable.getWriter();
	for (let offset = 0; offset < data.length; offset += writeSize) {
		await writer.write(data.subarray(offset, offset + writeSize));
	}
	await writer.close();
	await done;
	return { outputBytes: sink.bytes };
}

async function zipSingleEntry(data, options, configuration = {}) {
	zip.resetConfiguration();
	zip.configure({ useWebWorkers: false, ...configuration });
	const sink = countingSink();
	const zipWriter = new zip.ZipWriter(sink.writable);
	await zipWriter.add("data.bin", new zip.Uint8ArrayReader(data), options);
	await zipWriter.close();
	await zip.terminateWorkers();
	return { outputBytes: sink.bytes };
}

function gzip(path) {
	const result = spawnSync("sh", ["-c", `gzip -6 -c "${path}" | wc -c`], { encoding: "utf8" });
	if (result.status) {
		throw new Error("gzip failed: " + result.stderr);
	}
	return { outputBytes: Number(result.stdout.trim()) };
}

function report(label, result, inputBytes) {
	const seconds = result.medianMs / 1000;
	console.log(`  ${label.padEnd(36)} ${result.medianMs.toFixed(0).padStart(6)} ms  ${(inputBytes / MB / seconds).toFixed(0).padStart(4)} MB/s   out ${(result.outputBytes / 1e6).toFixed(1)} MB`);
}

async function main() {
	const results = { runtime: RUNTIME, runs: RUNS, rows: [] };
	console.log(`# Runtimes — ${RUNTIME}, ${RUNS} runs\n`);

	const { files } = loadFiles(PARALLEL_WORKLOAD);
	const parallelBytes = WORKLOADS[PARALLEL_WORKLOAD].count * WORKLOADS[PARALLEL_WORKLOAD].each;
	console.log(WORKLOADS[PARALLEL_WORKLOAD].label + ", level 6");
	const PARALLEL = [
		["sequential add()", { concurrent: false, useWebWorkers: false }],
		["concurrent add()", { concurrent: true, useWebWorkers: false }],
		["concurrent add(), chunkSize 256 KB", { concurrent: true, useWebWorkers: false, chunkSize: 256 * 1024 }],
		["concurrent add(), useWebWorkers", { concurrent: true, useWebWorkers: true }]
	];
	for (const [label, options] of PARALLEL) {
		const result = await timed(() => addEntries(files, options));
		report(label, result, parallelBytes);
		results.rows.push({ part: "parallel", label, inputBytes: parallelBytes, ...result });
	}

	const path = ensureDiskFile(SINGLE_WORKLOAD);
	const data = readFileSync(path);
	console.log("\n" + WORKLOADS[SINGLE_WORKLOAD].label + ", one thread, in memory");
	const SINGLE = [
		["CompressionStream, 64 KB writes", () => rawCompressionStream(data, 64 * 1024)],
		["zip.js, one entry", () => zipSingleEntry(data)],
		["gzip -6", () => gzip(path)]
	];
	for (const [label, task] of SINGLE) {
		const result = await timed(task);
		report(label, result, data.length);
		results.rows.push({ part: "single", label, inputBytes: data.length, ...result });
	}

	const text = Object.values(loadFiles(TEXT_WORKLOAD).files)[0];
	console.log("\n" + WORKLOADS[TEXT_WORKLOAD].label + ", one entry, one thread");
	const pureJs = { useCompressionStream: false, CompressionStreamZlib, DecompressionStreamZlib };
	const LEVELS = [
		["level 6 (CompressionStream)", undefined],
		["level 5 (WASM zlib)", { level: 5 }],
		["level 5 (pure-JS zlib)", { level: 5 }, pureJs],
		["level 1 (WASM zlib)", { level: 1 }]
	];
	for (const [label, options, configuration] of LEVELS) {
		const result = await timed(() => zipSingleEntry(text, options, configuration));
		report(label, result, text.length);
		results.rows.push({ part: "levels", label, inputBytes: text.length, ...result });
	}

	const outPath = join(HERE, "results", `runtimes-${RUNTIME.split(" ")[0].toLowerCase()}-results.json`);
	writeFileSync(outPath, JSON.stringify(results, null, 2));
	console.log("\nwrote " + outPath);
}

main().catch((error) => {
	process.stderr.write("ERROR: " + (error && error.stack || error) + "\n");
	process.exit(1);
});
