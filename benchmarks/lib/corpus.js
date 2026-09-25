// Deterministic corpus generation for the benchmarks.
// Datasets are cached under .corpus/ so every run and every library sees identical bytes.
// No Math.random: a seeded PRNG keeps results reproducible across machines and runs.
// QUICK=1 divides every size by SCALE (lib/settings.js) and caches those datasets under their
// own names, so a quick run never reads a full dataset or overwrites one.

import { mkdirSync, existsSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { QUICK, SCALE } from "./settings.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS_DIR = join(HERE, "..", ".corpus");
const CACHE_SUFFIX = QUICK ? "-quick" : "";

// mulberry32: tiny, fast, deterministic PRNG.
function prng(seed) {
	let a = seed >>> 0;
	return function () {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// A pool of English-ish words so "text" data compresses like real prose/source, not like a dictionary attack.
const WORDS = ("the of and to in a is that for it as was with be by on not he i this are or his from at " +
	"which but have an they all were we when your can said there use each she do how their if will up other " +
	"about out many then them these so some her would make like him into time has look two more write go see " +
	"function return const let var async await import export class extends interface type number string boolean " +
	"void null undefined this new throw catch try finally switch case break continue default while for of").split(" ");

function makeText(rand, bytes) {
	const parts = [];
	let size = 0;
	while (size < bytes) {
		let line = "";
		const words = 6 + Math.floor(rand() * 14);
		for (let i = 0; i < words; i++) {
			line += WORDS[Math.floor(rand() * WORDS.length)] + " ";
		}
		line = line.trimEnd() + ".\n";
		parts.push(line);
		size += line.length;
	}
	return Buffer.from(parts.join(""), "utf8").subarray(0, bytes);
}

function makeRandom(rand, bytes) {
	const buf = Buffer.allocUnsafe(bytes);
	for (let i = 0; i < bytes; i++) {
		buf[i] = (rand() * 256) & 0xff;
	}
	return buf;
}

function ensureDir() {
	if (!existsSync(CORPUS_DIR)) {
		mkdirSync(CORPUS_DIR, { recursive: true });
	}
}

// Workload registry. Each entry yields { files: { name: Uint8Array }, ... } lazily and caches to disk.
// The keys name the full sizes; the labels say what a run actually measured.
const MB = 1024 * 1024;
const TEXT_BYTES = 20 * MB / SCALE;
const HUGE_BYTES = 256 * MB / SCALE;
const SMALL_FILES = 5000 / SCALE;
const PARALLEL_BYTES = 8 * MB / SCALE;
export const megabytes = (bytes) => (bytes / MB).toLocaleString("en-US", { maximumFractionDigits: 1 }) + " MB";

export const WORKLOADS = {
	"text-20mb": { kind: "single", label: `Compressible text (${megabytes(TEXT_BYTES)})`, seed: 1, bytes: TEXT_BYTES, gen: makeText },
	"random-20mb": { kind: "single", label: `Incompressible data (${megabytes(TEXT_BYTES)})`, seed: 2, bytes: TEXT_BYTES, gen: makeRandom },
	"many-files": { kind: "multi", label: `${SMALL_FILES.toLocaleString("en-US")} small files (~2 KB each)`, seed: 4, count: SMALL_FILES, each: 2048, gen: makeText },
	"huge-256mb": { kind: "disk", label: `Large file, disk-to-disk (${megabytes(HUGE_BYTES)})`, seed: 5, bytes: HUGE_BYTES, gen: makeText },
	// A handful of large entries: enough per-entry work that running codecs in parallel matters.
	"parallel-8x8mb": { kind: "multi", label: `8 files x ${megabytes(PARALLEL_BYTES)} (parallel-friendly)`, seed: 6, count: 8, each: PARALLEL_BYTES, gen: makeText }
};

// The path of a cached dataset; a quick run gets its own files (see CACHE_SUFFIX).
export function cachePath(name, extension = ".bin") {
	return join(CORPUS_DIR, name + CACHE_SUFFIX + extension);
}

// Returns { files: { [name]: Uint8Array } } for in-memory workloads.
export function loadFiles(name) {
	ensureDir();
	const w = WORKLOADS[name];
	if (!w) throw new Error("unknown workload: " + name);
	if (w.kind === "multi") {
		const rand = prng(w.seed);
		const files = {};
		for (let i = 0; i < w.count; i++) {
			files["file-" + String(i).padStart(5, "0") + ".txt"] = w.gen(rand, w.each);
		}
		return { files };
	}
	// single / disk: one entry, cached on disk
	const path = cachePath(name);
	if (!existsSync(path)) {
		const rand = prng(w.seed);
		writeFileSync(path, w.gen(rand, w.bytes));
	}
	const data = readFileSync(path);
	return { files: { "data.bin": data }, path };
}

// For disk workloads: ensure the file exists on disk and return its path (no full read).
export function ensureDiskFile(name) {
	ensureDir();
	const w = WORKLOADS[name];
	const path = cachePath(name);
	if (!existsSync(path) || statSync(path).size !== w.bytes) {
		const rand = prng(w.seed);
		writeFileSync(path, w.gen(rand, w.bytes));
	}
	return path;
}

// CLI: pre-generate every cached dataset.
if (process.argv[1] && process.argv[1].endsWith("corpus.js")) {
	for (const [name, w] of Object.entries(WORKLOADS)) {
		if (w.kind === "disk") {
			ensureDiskFile(name);
		} else {
			loadFiles(name);
		}
		console.log("ready:", name, "-", w.label);
	}
}
