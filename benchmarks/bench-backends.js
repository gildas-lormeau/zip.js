// Backend & parallelism matrix. One workload (8 x 8 MB compressible entries) compressed by:
//   - zip.js in each codec backend (native CompressionStream / WASM / pure-JS), sequential vs parallel
//   - jszip (pako, single-threaded)
//   - fflate sync (single-threaded) and async (its worker pool)
//   - archiver (Node zlib on the libuv threadpool)
// The point: zip.js + native CompressionStream + concurrent add() runs codecs on multiple threads
// WITHOUT Web Workers, so it parallelizes even in a plain Node process.
//
// Each combo runs in an isolated child under /usr/bin/time -l; we report median wall time (internal)
// and peak RSS (external).

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync } from "node:fs";
import { WORKLOADS } from "./lib/corpus.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUN_ONE = join(HERE, "run-one.js");
const RUNS = Number(process.env.RUNS || 3);
const WORKLOAD = "parallel-8x8mb";

// Each config: [label, lib, extra args for run-one after workload+mode]
const CONFIGS = [
	["zip.js — CompressionStream, sequential", "zipjs", ["single", "cs", "sequential"]],
	["zip.js — CompressionStream, parallel", "zipjs", ["single", "cs", "parallel"]],
	["zip.js — WASM, sequential", "zipjs", ["single", "wasm", "sequential"]],
	["zip.js — WASM, parallel", "zipjs", ["single", "wasm", "parallel"]],
	["zip.js — pure-JS, sequential", "zipjs", ["single", "js", "sequential"]],
	["zip.js — pure-JS, parallel", "zipjs", ["single", "js", "parallel"]],
	["jszip (pako)", "jszip", []],
	["fflate — zipSync", "fflate", ["single", "cs", "sequential"]],
	["fflate — async (worker pool)", "fflate", ["single", "cs", "parallel"]],
	["archiver (Node zlib)", "archiver", []]
];

function measureBaseline() {
	return runTimed(["-e", "0"]).peakRssBytes || 0;
}

function runTimed(args) {
	const res = spawnSync("/usr/bin/time", ["-l", "node", ...args], { cwd: HERE, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
	const rssMatch = (res.stderr || "").match(/(\d+)\s+maximum resident set size/);
	const peakRssBytes = rssMatch ? Number(rssMatch[1]) : null;
	let json = null;
	if (res.stdout) {
		const line = res.stdout.trim().split("\n").filter(Boolean).pop();
		try { json = JSON.parse(line); } catch { json = null; }
	}
	return { peakRssBytes, json, code: res.status, stderr: res.stderr || "" };
}

function runConfig(lib, extra) {
	const args = [RUN_ONE, lib, "compress", WORKLOAD, ...extra];
	const times = [];
	let peak = 0, outputSize = null, failed = null;
	for (let i = 0; i < RUNS; i++) {
		const { json, peakRssBytes, code, stderr } = runTimed(args);
		if (code !== 0 || !json) {
			failed = (stderr.split("\n").find((l) => l.startsWith("ERROR:")) || `exit ${code}`);
			break;
		}
		times.push(json.ms);
		outputSize = json.outputSize;
		if (peakRssBytes) peak = Math.max(peak, peakRssBytes);
	}
	if (failed) return { failed };
	times.sort((a, b) => a - b);
	return { medianMs: times[Math.floor(times.length / 2)], peakRssBytes: peak, outputSize };
}

function main() {
	const baseline = measureBaseline();
	const inputBytes = WORKLOADS[WORKLOAD].count * WORKLOADS[WORKLOAD].each;
	const results = { runtime: process.version, runs: RUNS, workload: WORKLOADS[WORKLOAD].label, inputBytes, baselineRssBytes: baseline, rows: [] };
	console.log(`# Backend & parallelism — ${WORKLOADS[WORKLOAD].label} — Node ${process.version}, ${RUNS} runs, baseline ${(baseline / 1e6).toFixed(0)} MB\n`);

	// Reference time = zip.js CompressionStream sequential, computed after the run.
	for (const [label, lib, extra] of CONFIGS) {
		process.stdout.write(label.padEnd(42) + " ");
		const r = runConfig(lib, extra);
		if (r.failed) {
			console.log("— err: " + r.failed.replace(/^ERROR:\s*/, "").slice(0, 50));
			results.rows.push({ label, lib, unsupported: true, note: r.failed });
		} else {
			// the output size is printed next to every time on purpose: the libraries do not agree on
			// what "level 6" means, so a time is only comparable alongside the size it achieved
			const ratio = inputBytes / r.outputSize;
			console.log(`${r.medianMs.toFixed(0).padStart(7)} ms   peak ${(r.peakRssBytes / 1e6).toFixed(0).padStart(4)} MB   out ${(r.outputSize / 1e6).toFixed(1)} MB   ratio ${ratio.toFixed(3)}`);
			results.rows.push({ label, lib, medianMs: r.medianMs, peakRssBytes: r.peakRssBytes, outputSize: r.outputSize, ratio });
		}
	}

	// annotate speedups vs zip.js CompressionStream sequential
	const seqRow = results.rows.find((r) => r.label.includes("CompressionStream, sequential"));
	if (seqRow) {
		for (const r of results.rows) if (r.medianMs) r.speedupVsCsSeq = seqRow.medianMs / r.medianMs;
	}

	const outPath = join(HERE, "results", "backends-results.json");
	writeFileSync(outPath, JSON.stringify(results, null, 2));
	console.log("\nwrote " + outPath);
}

main();
