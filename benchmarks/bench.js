// Orchestrator. For every (library, op, workload) combination it spawns run-one.js in a fresh
// process under /usr/bin/time -l, capturing:
//   - internal wall time (performance.now around the measured op), reported by the child as JSON
//   - peak resident set size of the whole child process, reported by /usr/bin/time -l
// Each combo runs RUNS times; we report the median (time) and the max peak RSS.
//
// Isolation matters: one process per combo means no cross-library GC/heap contamination, and peak
// RSS is a true per-library figure. A baseline empty-node RSS is measured and subtracted to report
// the "delta" attributable to the work.

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync } from "node:fs";
import { WORKLOADS } from "./lib/corpus.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUN_ONE = join(HERE, "run-one.js");
const RUNS = Number(process.env.RUNS || 3);

const LIBS = ["zipjs", "jszip", "fflate", "archiver"];
const LIB_LABEL = { zipjs: "@zip.js/zip.js", jszip: "jszip", fflate: "fflate", archiver: "archiver" };

// The benchmark plan: which ops run on which workloads.
const PLAN = [
	{ op: "compress", workloads: ["text-20mb", "random-20mb", "many-files"] },
	{ op: "decompress", workloads: ["text-20mb", "many-files"] },
	{ op: "compressDisk", workloads: ["huge-256mb"] }
];

// zip.js runs both single-threaded (apples-to-apples) and with workers (real-world).
const ZIPJS_MODES = ["single", "workers"];

function measureBaseline() {
	const res = runTimed(["-e", "0"]);
	return res.peakRssBytes || 0;
}

// Spawn `node <args>` under /usr/bin/time -l, parse child JSON stdout + peak RSS from time stderr.
function runTimed(args) {
	const res = spawnSync("/usr/bin/time", ["-l", "node", ...args], {
		cwd: HERE,
		encoding: "utf8",
		maxBuffer: 64 * 1024 * 1024
	});
	const stderr = res.stderr || "";
	const rssMatch = stderr.match(/(\d+)\s+maximum resident set size/);
	const peakRssBytes = rssMatch ? Number(rssMatch[1]) : null;
	let json = null;
	if (res.stdout) {
		const line = res.stdout.trim().split("\n").filter(Boolean).pop();
		try {
			json = JSON.parse(line);
		} catch {
			json = null;
		}
	}
	return { peakRssBytes, json, code: res.status, stderr };
}

function runCombo(lib, op, workload, mode) {
	const args = [RUN_ONE, lib, op, workload];
	if (lib === "zipjs") args.push(mode);
	const times = [];
	let peak = 0;
	let outputSize = null;
	let failed = null;
	for (let i = 0; i < RUNS; i++) {
		const { json, peakRssBytes, code, stderr } = runTimed(args);
		if (code !== 0 || !json) {
			failed = (stderr || "").split("\n").find((l) => l.startsWith("ERROR:")) || `exit ${code}`;
			break;
		}
		times.push(json.ms);
		outputSize = json.outputSize;
		if (peakRssBytes) peak = Math.max(peak, peakRssBytes);
	}
	if (failed) return { failed };
	times.sort((a, b) => a - b);
	const median = times[Math.floor(times.length / 2)];
	return { medianMs: median, peakRssBytes: peak, outputSize, runs: times.length };
}

function main() {
	const baseline = measureBaseline();
	const results = { generatedBy: "bench.js", runtime: process.version, runs: RUNS, baselineRssBytes: baseline, rows: [] };
	console.log(`# Node ${process.version} — ${RUNS} runs/combo — baseline RSS ${(baseline / 1e6).toFixed(0)} MB\n`);

	for (const { op, workloads } of PLAN) {
		for (const workload of workloads) {
			for (const lib of LIBS) {
				const modes = lib === "zipjs" && op !== "decompress" ? ZIPJS_MODES : (lib === "zipjs" ? ["single"] : [null]);
				for (const mode of modes) {
					const label = LIB_LABEL[lib] + (mode === "workers" ? " (workers)" : mode === "single" && lib === "zipjs" ? " (1 thread)" : "");
					process.stdout.write(`${op.padEnd(13)} ${WORKLOADS[workload].label.padEnd(34)} ${label.padEnd(24)} `);
					const r = runCombo(lib, op, workload, mode);
					if (r.failed) {
						console.log("— unsupported/err: " + r.failed.replace(/^ERROR:\s*/, "").slice(0, 60));
						results.rows.push({ op, workload, lib, mode, label, unsupported: true, note: r.failed });
					} else {
						const mb = r.peakRssBytes / 1e6;
						const deltaMb = (r.peakRssBytes - baseline) / 1e6;
						console.log(`${r.medianMs.toFixed(0).padStart(7)} ms   peak ${mb.toFixed(0).padStart(5)} MB (Δ${deltaMb.toFixed(0)} MB)   out ${(r.outputSize / 1e6).toFixed(1)} MB`);
						results.rows.push({ op, workload, lib, mode, label, medianMs: r.medianMs, peakRssBytes: r.peakRssBytes, peakDeltaBytes: r.peakRssBytes - baseline, outputSize: r.outputSize });
					}
				}
			}
			console.log("");
		}
	}

	const outPath = join(HERE, "results", "node-results.json");
	writeFileSync(outPath, JSON.stringify(results, null, 2));
	console.log("wrote " + outPath);
}

main();
