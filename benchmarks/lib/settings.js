// Settings shared by the scripts. QUICK=1 is the smoke mode: every workload is divided by SCALE,
// each measurement runs once unless RUNS says otherwise, and the JSON goes under results/quick/,
// so a quick run never overwrites the results behind BENCHMARKS.md. Its numbers say that the
// harness runs, not how fast zip.js is: at a few megabytes the fixed costs (process start, WASM
// instantiation, worker spawn) weigh on every row.

import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RESULTS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "results");

export const QUICK = process.env.QUICK == "1";
export const SCALE = QUICK ? 8 : 1;
export const QUICK_NOTE = QUICK ? ` — QUICK: workloads divided by ${SCALE}, results under results/quick/` : "";

export function runs(defaultRuns) {
	return Number(process.env.RUNS || (QUICK ? 1 : defaultRuns));
}

export function resultsPath(name) {
	const dir = QUICK ? join(RESULTS_DIR, "quick") : RESULTS_DIR;
	mkdirSync(dir, { recursive: true });
	return join(dir, name);
}
