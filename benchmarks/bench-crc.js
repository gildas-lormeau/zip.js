// Write-path CRC strategy, native CompressionStream. Compares the two ways zip.js can obtain the
// per-entry CRC-32 while compressing on the native CompressionStream:
//
//   - gzip-trick : compress the entry as gzip, then strip the 10-byte header + 8-byte trailer to
//                  recover the exact raw-deflate payload and read the CRC-32 out of the trailer.
//                  The CRC is computed in native code, folded into the compression pass — no
//                  separate CRC pass over the data.
//   - baseline   : compress as deflate-raw and run a separate slice-by-8 Crc32Stream alongside it
//                  (the pre-trick behaviour).
//
// Both paths drive the real DeflateStream with the same native compressor; only the CRC strategy
// differs, so the delta is exactly what the gzip trick buys. A spy CompressionStream records the
// format each path actually used, and the two CRCs are cross-checked, so the A/B can't silently
// measure the wrong thing. In-process, median of RUNS, warmup first (CPU time is the point here,
// not RSS — so no isolated child processes, unlike bench-backends.js).
//
// Read the result as: gain ≈ CRC_time / total_time. The slice-by-8 CRC pass the trick removes is
// only ~15 ms/20 MB, while native level-6 deflate on REAL data is 350–700 ms/20 MB — so the trick
// saves only a few percent there. It is a large win only on data that compresses very fast (long
// matches let deflate skip ahead), where the CRC pass is a big fraction of a tiny total. Use the
// real corpus, not repeated-string data, or the number is meaningless.

import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync } from "node:fs";
import { loadFiles, WORKLOADS } from "./lib/corpus.js";
import { DeflateStream } from "../lib/core/streams/zip-entry-stream.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNS = Number(process.env.RUNS || 7);

// Datasets span the compressibility axis so the trick's workload-dependence is visible:
//   - highly-compressible: deflate finishes fast (long matches), CRC is a big fraction -> best case
//   - text-20mb:           realistic prose, real deflate work                          -> typical
//   - random-20mb:         incompressible, deflate searches hardest                    -> worst case
function datasets() {
	const list = [];
	// Best case: 20 MB of a repeated block — compresses to almost nothing, so compression is cheap.
	list.push({ label: "Highly compressible (20 MB, best case)", data: Buffer.from("the quick brown fox jumps over the lazy dog 0123456789 ".repeat((20 * 1024 * 1024) / 54)) });
	for (const workload of ["text-20mb", "random-20mb"]) {
		list.push({ label: WORKLOADS[workload].label, data: Object.values(loadFiles(workload).files)[0], workload });
	}
	return list;
}

// Records the format(s) passed to CompressionStream so each path's code route can be asserted.
let formats = [];
class SpyCompressionStream extends CompressionStream {
	constructor(format, options) {
		super(format, options);
		formats.push(format);
	}
}

// Real DeflateStream, configured so the native compressor is used either through the gzip trick
// (trick) or through the deflate-raw + Crc32Stream fallback (baseline).
function makeDeflateStream(mode) {
	const base = { compressed: true, signed: true, encrypted: false, zipCrypto: false, level: 6 };
	if (mode === "trick") {
		return new DeflateStream({ ...base, useCompressionStream: true }, { chunkSize: 64 * 1024, CompressionStream: SpyCompressionStream });
	}
	return new DeflateStream({ ...base, useCompressionStream: false }, { chunkSize: 64 * 1024, CompressionStreamZlib: SpyCompressionStream });
}

async function compressOnce(data, mode) {
	const deflateStream = makeDeflateStream(mode);
	const readable = new Blob([data]).stream().pipeThrough(deflateStream);
	const reader = readable.getReader();
	let outputSize = 0;
	for (; ;) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		outputSize += value.length;
	}
	return { outputSize, signature: deflateStream.signature >>> 0 };
}

async function measure(data, mode) {
	formats = [];
	for (let i = 0; i < 2; i++) {
		await compressOnce(data, mode);
	}
	const usedFormats = [...new Set(formats)];
	const times = [];
	let outputSize, signature;
	for (let i = 0; i < RUNS; i++) {
		const t0 = performance.now();
		const result = await compressOnce(data, mode);
		times.push(performance.now() - t0);
		({ outputSize, signature } = result);
	}
	times.sort((a, b) => a - b);
	return { medianMs: times[Math.floor(times.length / 2)], outputSize, signature, usedFormats };
}

async function main() {
	const results = { runtime: process.version, runs: RUNS, rows: [] };
	console.log(`# Write-path CRC strategy — native CompressionStream — Node ${process.version}, ${RUNS} runs\n`);
	console.log("#   gzip-trick : compress as gzip, harvest CRC-32 from the trailer (no separate CRC pass)");
	console.log("#   baseline   : compress as deflate-raw + separate slice-by-8 Crc32Stream\n");

	for (const { label, data, workload } of datasets()) {
		const mb = data.length / (1024 * 1024);
		const trick = await measure(data, "trick");
		const baseline = await measure(data, "baseline");
		const savedMs = baseline.medianMs - trick.medianMs;
		const savedPct = (savedMs / baseline.medianMs) * 100;
		const ratio = (trick.outputSize / data.length) * 100;
		const crcMatch = trick.signature === baseline.signature;
		const routesOk = trick.usedFormats.includes("gzip") && baseline.usedFormats.includes("deflate-raw");
		const status = crcMatch && routesOk ? "ok" : "CHECK";

		console.log(`${label}   (compresses to ${ratio.toFixed(0)}%)`);
		console.log(`  gzip-trick : ${trick.medianMs.toFixed(1).padStart(6)} ms   ${(mb / (trick.medianMs / 1000)).toFixed(0).padStart(4)} MB/s in   [${trick.usedFormats.join(",")}]`);
		console.log(`  baseline   : ${baseline.medianMs.toFixed(1).padStart(6)} ms   ${(mb / (baseline.medianMs / 1000)).toFixed(0).padStart(4)} MB/s in   [${baseline.usedFormats.join(",")}]`);
		console.log(`  saved      : ${savedMs.toFixed(1)} ms (${savedPct.toFixed(0)}%)   crc ${trick.signature.toString(16).padStart(8, "0")} match=${crcMatch}   [${status}]\n`);

		results.rows.push({
			workload: workload || "highly-compressible", label, bytes: data.length, compressionRatioPct: ratio,
			gzipTrickMs: trick.medianMs, baselineMs: baseline.medianMs, savedMs, savedPct,
			crc: trick.signature, crcMatch, routesOk
		});
	}

	const outPath = join(HERE, "results", "crc-results.json");
	writeFileSync(outPath, JSON.stringify(results, null, 2));
	console.log("wrote " + outPath);
}

main().catch((error) => {
	process.stderr.write("ERROR: " + (error && error.stack || error) + "\n");
	process.exit(1);
});
