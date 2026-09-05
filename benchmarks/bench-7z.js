// zip.js vs 7-Zip (CLI), disk-to-disk, for Deno and Bun (not Node — see bench.js for that harness).
//   deno run -A bench-7z.js
//   bun bench-7z.js
//
// 7-Zip only works file-to-file, so every combo is disk-to-disk for both sides:
// input is a corpus file (or directory tree) on disk, output is a .zip on disk.
// 7-Zip is native C++ with its own deflate; this is a "distance to native" reference
// line, not a peer comparison. Timings for 7-Zip include process spawn (~ms).
// zip.js keeps its worker pool warm across runs — that reuse is the library's natural
// deployment model, mirroring how 7-Zip's mmap/threads are its own.
//
// Env: RUNS (default 3), SEVENZIP (binary override), SKIP_HUGE=1 to skip the 256 MB combo,
// ZIPJS_BACKEND=wasm to run zip.js on the bundled WebAssembly zlib instead of CompressionStream.

import { spawnSync } from "node:child_process";
import { createReadStream, createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { Readable, Writable } from "node:stream";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import * as zip from "../index.js";
import { WORKLOADS, loadFiles, ensureDiskFile } from "./lib/corpus.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNS = Number(process.env.RUNS || 3);
const LEVEL = 6;
const BACKEND = process.env.ZIPJS_BACKEND || "cs";
const ZIPJS_LABEL = BACKEND === "wasm" ? "zip.js wasm" : "zip.js";

function configureZipjs(useWebWorkers) {
	zip.configure({ useWebWorkers, useCompressionStream: BACKEND !== "wasm" });
}

const RUNTIME = globalThis.Deno ? `deno ${globalThis.Deno.version.deno}` : globalThis.Bun ? `bun ${globalThis.Bun.version}` : `node ${process.version}`;
const RUNTIME_ID = globalThis.Deno ? "deno" : globalThis.Bun ? "bun" : "node";

function findSevenZip() {
	for (const candidate of [process.env.SEVENZIP, "7zz", "7z"].filter(Boolean)) {
		try {
			if (spawnSync(candidate, ["i"], { stdio: "ignore" }).status === 0) {
				return candidate;
			}
		} catch {
			// not installed under this name
		}
	}
	throw new Error("7-Zip CLI not found (tried $SEVENZIP, 7zz, 7z)");
}
const SEVENZIP = findSevenZip();

// The "many-files" workload is in-memory in corpus.js; 7-Zip needs it as a real tree on disk.
function ensureTree(workloadName) {
	const dir = join(HERE, ".corpus", workloadName + "-tree");
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
		const { files } = loadFiles(workloadName);
		for (const [name, data] of Object.entries(files)) {
			writeFileSync(join(dir, name), data);
		}
	}
	return dir;
}

function listTree(dir) {
	return readdirSync(dir).map((name) => ({ name, path: join(dir, name) }));
}

function inputSize(input) {
	return input.kind === "tree"
		? listTree(input.path).reduce((total, { path }) => total + statSync(path).size, 0)
		: statSync(input.path).size;
}

async function zipjsCompress(input, outPath, useWebWorkers) {
	configureZipjs(useWebWorkers);
	const zipWriter = new zip.ZipWriter(Writable.toWeb(createWriteStream(outPath)), { level: LEVEL });
	const entries = input.kind === "tree" ? listTree(input.path) : [{ name: basename(input.path), path: input.path }];
	// Workers mode issues all add() calls at once so independent entries compress in parallel
	// across the pool (like the Node adapter's concurrency: "parallel"); single mode stays sequential.
	if (useWebWorkers) {
		await Promise.all(entries.map(({ name, path }) => zipWriter.add(name, Readable.toWeb(createReadStream(path)))));
	} else {
		for (const { name, path } of entries) {
			await zipWriter.add(name, Readable.toWeb(createReadStream(path)));
		}
	}
	await zipWriter.close();
	return statSync(outPath).size;
}

async function zipjsDecompress(zipPath, outDir, useWebWorkers) {
	configureZipjs(useWebWorkers);
	const reader = new zip.ZipReader(new zip.Uint8ArrayReader(readFileSync(zipPath)));
	for (const entry of await reader.getEntries()) {
		if (!entry.directory) {
			await entry.getData(Writable.toWeb(createWriteStream(join(outDir, basename(entry.filename)))));
		}
	}
	await reader.close();
}

function sevenZip(args) {
	const res = spawnSync(SEVENZIP, ["-bd", "-y", ...args], { stdio: "ignore" });
	if (res.status !== 0) {
		throw new Error(`${SEVENZIP} ${args[0]} exited with ${res.status}`);
	}
}

function sevenZipCompress(input, outPath, threads, level = LEVEL) {
	sevenZip(["a", "-tzip", `-mx=${level}`, `-mmt=${threads}`, outPath, input.kind === "tree" ? join(input.path, "*") : input.path]);
	return statSync(outPath).size;
}

function sevenZipDecompress(zipPath, outDir, threads) {
	sevenZip(["x", `-mmt=${threads}`, "-o" + outDir, zipPath]);
}

const CONTENDERS = [
	{ id: "zipjs-1t", label: `${ZIPJS_LABEL} (1 thread)`, compress: (i, o) => zipjsCompress(i, o, false), decompress: (z, d) => zipjsDecompress(z, d, false) },
	{ id: "zipjs-workers", label: `${ZIPJS_LABEL} (workers)`, compress: (i, o) => zipjsCompress(i, o, true), decompress: (z, d) => zipjsDecompress(z, d, true) },
	{ id: "7z-1t", label: "7-Zip (1 thread)", compress: (i, o) => sevenZipCompress(i, o, 1), decompress: (z, d) => sevenZipDecompress(z, d, 1) },
	{ id: "7z-mt", label: "7-Zip (multithread)", compress: (i, o) => sevenZipCompress(i, o, "on"), decompress: (z, d) => sevenZipDecompress(z, d, "on") },
	// No 7-Zip preset runs zlib's algorithm: -mx=5+ is a near-optimal parser (slower, smaller) and
	// -mx=1..4 a greedy one (faster, larger), bracketing zlib-6. This line is the speed-tier anchor;
	// -mx=6 above is the ratio anchor. Compress-only: deflate decoding is identical at every level.
	{ id: "7z-fast", label: "7-Zip (fast -mx=1)", ops: ["compress"], compress: (i, o) => sevenZipCompress(i, o, "on", 1) }
];

// No 7-Zip preset runs zlib's algorithm, so no single -mx anchor can be fair and a level-matched
// table would read a ratio difference as a speed difference. The ladder measures the whole curve on
// one workload, which is what lets a reader place zip.js on it by output size rather than by preset
// number. Compress only: deflate decoding does not depend on the level it was written at.
const LADDER_WORKLOAD = "text-20mb";
const LADDER_LEVELS = [1, 3, 5, 6, 7, 9];

// runs: 1 for the 256 MB combo — a 33 s 7-Zip sample makes run-to-run noise proportionally tiny,
// and 3 runs would triple the wall time of the whole benchmark for nothing.
const PLAN = [
	{ workload: "text-20mb", ops: ["compress", "decompress"] },
	{ workload: "random-20mb", ops: ["compress"] },
	{ workload: "many-files", ops: ["compress", "decompress"] },
	...(process.env.SKIP_HUGE ? [] : [{ workload: "huge-256mb", ops: ["compress"], runs: 1 }])
];

function median(times) {
	const sorted = [...times].sort((a, b) => a - b);
	return sorted[Math.floor(sorted.length / 2)];
}

function resetDir(dir) {
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
}

async function main() {
	console.log(`# ${RUNTIME} vs ${SEVENZIP} — ${RUNS} runs/combo, median — level ${LEVEL} — zip.js backend: ${BACKEND}\n`);
	const results = { generatedBy: "bench-7z.js", runtime: RUNTIME, sevenZip: SEVENZIP, backend: BACKEND, runs: RUNS, rows: [] };
	const workDir = join(tmpdir(), `bench-7z-${process.pid}`);
	resetDir(workDir);

	for (const { workload, ops, runs = RUNS } of PLAN) {
		const w = WORKLOADS[workload];
		const input = w.kind === "multi"
			? { kind: "tree", path: ensureTree(workload) }
			: { kind: "file", path: ensureDiskFile(workload) };

		// -mmt cannot parallelize a single deflate stream, so on single-file workloads the two
		// 7-Zip variants measure the same thing; keep only the multithreaded one there.
		const contenders = CONTENDERS.filter((contender) => contender.id !== "7z-1t" || input.kind === "tree");
		const bytesIn = inputSize(input);

		for (const op of ops) {
			for (const contender of contenders.filter((c) => !c.ops || c.ops.includes(op))) {
				const zipPath = join(workDir, `${workload}-${contender.id}.zip`);
				const outDir = join(workDir, `out-${workload}-${contender.id}`);
				const times = [];
				let outputSize = null;
				for (let run = 0; run < runs; run++) {
					let t0;
					if (op === "compress") {
						rmSync(zipPath, { force: true });
						t0 = performance.now();
						outputSize = await contender.compress(input, zipPath);
					} else {
						if (!existsSync(zipPath)) {
							await contender.compress(input, zipPath);
						}
						resetDir(outDir);
						t0 = performance.now();
						await contender.decompress(zipPath, outDir);
					}
					times.push(performance.now() - t0);
				}
				const ms = median(times);
				// the size is printed next to every time on purpose: 7-Zip's presets compress by a
				// different amount than zlib does, so a time alone says nothing
				const sizeInfo = outputSize ? `   out ${(outputSize / 1e6).toFixed(1)} MB   ratio ${(bytesIn / outputSize).toFixed(3)}` : "";
				console.log(`${op.padEnd(11)} ${w.label.padEnd(34)} ${contender.label.padEnd(25)} ${ms.toFixed(0).padStart(7)} ms${sizeInfo}`);
				results.rows.push({ op, workload, contender: contender.id, label: contender.label, medianMs: ms, outputSize, inputBytes: bytesIn });
			}
			console.log("");
		}
	}

	await runLadder(workDir, results);

	await zip.terminateWorkers();
	rmSync(workDir, { recursive: true, force: true });
	const outPath = join(HERE, "results", `7z-${RUNTIME_ID}${BACKEND === "wasm" ? "-wasm" : ""}-results.json`);
	writeFileSync(outPath, JSON.stringify(results, null, 2));
	console.log("wrote " + outPath);
}

async function runLadder(workDir, results) {
	const workload = WORKLOADS[LADDER_WORKLOAD];
	const input = { kind: "file", path: ensureDiskFile(LADDER_WORKLOAD) };
	const bytesIn = inputSize(input);
	console.log(`# 7-Zip -mx ladder — ${workload.label} — placed against zip.js by output size\n`);
	const points = [];
	for (const level of LADDER_LEVELS) {
		const zipPath = join(workDir, `ladder-7z-${level}.zip`);
		const times = [];
		let outputSize = 0;
		for (let run = 0; run < RUNS; run++) {
			rmSync(zipPath, { force: true });
			const start = performance.now();
			outputSize = sevenZipCompress(input, zipPath, "on", level);
			times.push(performance.now() - start);
		}
		points.push({ label: `7-Zip -mx=${level}`, contender: `7z-mx${level}`, medianMs: median(times), outputSize });
	}
	for (const useWebWorkers of [false, true]) {
		const zipPath = join(workDir, `ladder-zipjs-${useWebWorkers ? "workers" : "1t"}.zip`);
		const times = [];
		let outputSize = 0;
		for (let run = 0; run < RUNS; run++) {
			rmSync(zipPath, { force: true });
			const start = performance.now();
			outputSize = await zipjsCompress(input, zipPath, useWebWorkers);
			times.push(performance.now() - start);
		}
		points.push({
			label: `${ZIPJS_LABEL} (${useWebWorkers ? "workers" : "1 thread"})`,
			contender: `zipjs-${useWebWorkers ? "workers" : "1t"}`,
			medianMs: median(times),
			outputSize
		});
	}
	points.sort((pointLeft, pointRight) => pointLeft.outputSize - pointRight.outputSize);
	for (const point of points) {
		console.log(`ladder      ${workload.label.padEnd(34)} ${point.label.padEnd(25)} ${point.medianMs.toFixed(0).padStart(7)} ms   out ${(point.outputSize / 1e6).toFixed(1)} MB   ratio ${(bytesIn / point.outputSize).toFixed(3)}`);
		results.rows.push({ op: "ladder", workload: LADDER_WORKLOAD, ...point, inputBytes: bytesIn });
	}
	console.log("");
}

main().catch((error) => {
	process.stderr.write("ERROR: " + (error && error.stack || error) + "\n");
	process.exit(1);
});
