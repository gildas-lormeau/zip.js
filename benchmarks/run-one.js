// Runs exactly one (library, op, workload, mode) combination in an isolated process and prints a
// single JSON line with the internal timing and output size. Peak RSS is measured by the parent via
// /usr/bin/time -l, so this process must do nothing but the measured work.
//
// Usage: node run-one.js <lib> <op> <workload> [mode]
//   lib:      zipjs | jszip | fflate | archiver
//   op:       compress | decompress | compressDisk
//   workload: a key from WORKLOADS (corpus.js)
//   mode:     zip.js only: single | workers   (default single)

import { performance } from "node:perf_hooks";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { unlinkSync, existsSync } from "node:fs";
import { loadFiles, ensureDiskFile } from "./lib/corpus.js";

const ADAPTERS = {
	zipjs: () => import("./adapters/zipjs.js"),
	jszip: () => import("./adapters/jszip.js"),
	fflate: () => import("./adapters/fflate.js"),
	archiver: () => import("./adapters/archiver.js")
};

async function main() {
	const [, , lib, op, workload, mode = "single", backend = "cs", concurrency = "sequential"] = process.argv;
	const adapter = await ADAPTERS[lib]();
	const opts = { mode, backend, concurrency };

	let result;
	if (op === "compress") {
		const { files } = loadFiles(workload);
		const t0 = performance.now();
		result = await adapter.compress(files, opts);
		result.ms = performance.now() - t0;
	} else if (op === "decompress") {
		// Build the archive first (untimed) with the SAME library, then time only the read.
		const { files } = loadFiles(workload);
		const zipped = await buildArchive(adapter, files);
		const t0 = performance.now();
		result = await adapter.decompress(zipped, opts);
		result.ms = performance.now() - t0;
	} else if (op === "compressDisk") {
		const inputPath = ensureDiskFile(workload);
		const outputPath = join(tmpdir(), `bench-${lib}-${workload}-${process.pid}.zip`);
		const t0 = performance.now();
		result = await adapter.compressDisk(inputPath, outputPath, opts);
		result.ms = performance.now() - t0;
		if (existsSync(outputPath)) unlinkSync(outputPath);
	} else {
		throw new Error("unknown op: " + op);
	}

	process.stdout.write(JSON.stringify(result) + "\n");
}

// Produce an in-memory archive to feed decompress(). zip.js returns a Uint8Array from close();
// jszip/fflate return Uint8Array. archiver can't decompress so it never reaches here.
async function buildArchive(adapter, files) {
	if (adapter.name === "@zip.js/zip.js") {
		const zip = await import("../index.js");
		zip.configure({ useWebWorkers: false, useCompressionStream: true });
		const writer = new zip.Uint8ArrayWriter();
		const zipWriter = new zip.ZipWriter(writer);
		for (const [entryName, data] of Object.entries(files)) {
			await zipWriter.add(entryName, new zip.Uint8ArrayReader(data));
		}
		const out = await zipWriter.close();
		await zip.terminateWorkers();
		return out;
	}
	if (adapter.name === "jszip") {
		const { default: JSZip } = await import("jszip");
		const zip = new JSZip();
		for (const [entryName, data] of Object.entries(files)) zip.file(entryName, data);
		return zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } });
	}
	if (adapter.name === "fflate") {
		const { zipSync } = await import("fflate");
		const input = {};
		for (const [entryName, data] of Object.entries(files)) input[entryName] = [data, { level: 6 }];
		return zipSync(input, {});
	}
	throw new Error("no archive builder for " + adapter.name);
}

main().catch((error) => {
	process.stderr.write("ERROR: " + (error && error.stack || error) + "\n");
	process.exit(1);
});
