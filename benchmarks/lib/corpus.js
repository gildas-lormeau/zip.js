// Deterministic corpus generation for the benchmarks.
// Datasets are cached under .corpus/ so every run and every library sees identical bytes.
// No Math.random: a seeded PRNG keeps results reproducible across machines and runs.

import { mkdirSync, existsSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS_DIR = join(HERE, "..", ".corpus");

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
const MB = 1024 * 1024;

export const WORKLOADS = {
	"text-20mb": { kind: "single", label: "Compressible text (20 MB)", seed: 1, bytes: 20 * MB, gen: makeText },
	"random-20mb": { kind: "single", label: "Incompressible data (20 MB)", seed: 2, bytes: 20 * MB, gen: makeRandom },
	"many-files": { kind: "multi", label: "5,000 small files (~2 KB each)", seed: 4, count: 5000, each: 2048, gen: makeText },
	"huge-256mb": { kind: "disk", label: "Large file, disk-to-disk (256 MB)", seed: 5, bytes: 256 * MB, gen: makeText },
	// A handful of large entries: enough per-entry work that running codecs in parallel matters.
	"parallel-8x8mb": { kind: "multi", label: "8 files x 8 MB (parallel-friendly)", seed: 6, count: 8, each: 8 * MB, gen: makeText }
};

function cachePath(name) {
	return join(CORPUS_DIR, name + ".bin");
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
		console.log("ready:", name);
	}
}
