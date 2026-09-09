// AES-256 encryption throughput, stored entry, single thread. Compares the engines zip.js can run
// the WinZip cipher (AES-CTR with the Gladman counter, HMAC-SHA1) on:
//
//   - WebAssembly : the kernel linked into the zip.js module, used by the WebAssembly builds
//                   whenever the module loads
//   - JavaScript  : the typed-array engine the same builds fall back to when the module cannot
//                   load (a page CSP without 'wasm-unsafe-eval', a build without the module), and
//                   the only engine of the native and core builds
//
// Set ZIPJS_BUNDLE to a previous bundle to add a row measured on that build with its own default
// engine, which is how the "before" number of BENCHMARKS.md was obtained:
//
//   git show v2.13.1:index.min.js > /tmp/zipjs-2.13.1.min.js
//   ZIPJS_BUNDLE=/tmp/zipjs-2.13.1.min.js node bench-aes.js
//
// The entry is stored (level 0) so no codec sits in the pipeline, and no worker is used so the
// number is the engine's and not the pool's. In-process, warmup first, median of RUNS. Runs under
// Node, Bun (bun bench-aes.js) and Deno (deno run -A bench-aes.js).

import { performance } from "node:perf_hooks";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync } from "node:fs";
import { loadFiles, WORKLOADS } from "./lib/corpus.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNS = Number(process.env.RUNS || 5);
const BUNDLE = process.env.ZIPJS_BUNDLE;
const WORKLOAD = "random-20mb";
const PASSWORD = "password";
const MB = 1024 * 1024;
const RUNTIME = globalThis.Deno ? "Deno " + globalThis.Deno.version.deno : globalThis.Bun ? "Bun " + globalThis.Bun.version : "Node " + process.version;

async function writeArchive(zip, data) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("data.bin", new zip.Uint8ArrayReader(data), { password: PASSWORD, level: 0 });
	return zipWriter.close();
}

async function readArchive(zip, archive) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(archive), { password: PASSWORD });
	const [entry] = await zipReader.getEntries();
	const content = await entry.getData(new zip.Uint8ArrayWriter());
	await zipReader.close();
	return content;
}

function median(values) {
	values.sort((a, b) => a - b);
	return values[Math.floor(values.length / 2)];
}

async function measure(zip, data) {
	let archive = await writeArchive(zip, data);
	let content = await readArchive(zip, archive);
	const writeTimes = [];
	const readTimes = [];
	for (let run = 0; run < RUNS; run++) {
		let t0 = performance.now();
		archive = await writeArchive(zip, data);
		writeTimes.push(performance.now() - t0);
		t0 = performance.now();
		content = await readArchive(zip, archive);
		readTimes.push(performance.now() - t0);
	}
	if (content.length != data.length || content.some((value, index) => value != data[index])) {
		throw new Error("the archive did not round-trip");
	}
	return { writeMs: median(writeTimes), readMs: median(readTimes), archiveBytes: archive.length };
}

function report(label, result, bytes) {
	const mb = bytes / MB;
	console.log(`  ${label.padEnd(24)} write ${result.writeMs.toFixed(1).padStart(7)} ms  ${(mb / (result.writeMs / 1000)).toFixed(0).padStart(4)} MB/s   read ${result.readMs.toFixed(1).padStart(7)} ms  ${(mb / (result.readMs / 1000)).toFixed(0).padStart(4)} MB/s`);
}

async function main() {
	const data = Object.values(loadFiles(WORKLOAD).files)[0];
	const label = WORKLOADS[WORKLOAD].label;
	const results = { runtime: RUNTIME, runs: RUNS, workload: WORKLOAD, bytes: data.length, rows: [] };
	console.log(`# AES-256 encryption, stored entry, single thread — ${RUNTIME}, ${RUNS} runs\n`);
	console.log(label);

	const zip = await import("../index.js");
	const engines = [
		{ engine: "wasm", label: "WebAssembly engine", configuration: { useWebWorkers: false } },
		{ engine: "js", label: "JavaScript engine", configuration: { useWebWorkers: false, wasmURI: null } }
	];
	for (const { engine, label: engineLabel, configuration } of engines) {
		await zip.terminateWorkers();
		zip.resetConfiguration();
		zip.configure(configuration);
		const result = await measure(zip, data);
		report(engineLabel, result, data.length);
		results.rows.push({ engine, label: engineLabel, ...result });
	}
	await zip.terminateWorkers();

	if (BUNDLE) {
		const previous = await import(pathToFileURL(BUNDLE).href);
		previous.configure({ useWebWorkers: false });
		const result = await measure(previous, data);
		report(BUNDLE.split("/").pop(), result, data.length);
		results.rows.push({ engine: "bundle", label: BUNDLE, ...result });
		await previous.terminateWorkers();
	}

	const outPath = join(HERE, "results", `aes-${RUNTIME.split(" ")[0].toLowerCase()}-results.json`);
	writeFileSync(outPath, JSON.stringify(results, null, 2));
	console.log("\nwrote " + outPath);
}

main().catch((error) => {
	process.stderr.write("ERROR: " + (error && error.stack || error) + "\n");
	process.exit(1);
});
