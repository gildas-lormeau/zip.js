# Benchmarks

A fair, reproducible comparison of **@zip.js/zip.js** against
[jszip](https://github.com/Stuk/jszip), [fflate](https://github.com/101arrowz/fflate)
and [archiver](https://github.com/archiverjs/node-archiver) on a set of realistic
workloads.

The numbers below are honest: zip.js wins clearly on some workloads and loses on
others. The goal is to show *where* each library is the right tool, and to give you a
harness you can re-run on your own hardware — the results are machine-specific and you
should not trust anyone's benchmark (including this one) without reproducing it.

> **TL;DR** — For compressing large or multiple entries, zip.js is the fastest option
> in the field, and it is the only one that parallelizes compression across CPU cores
> **without spawning a single Web Worker** — it lets the platform's native
> `CompressionStream` run on the threadpool while you simply issue concurrent `add()`
> calls. It also streams arbitrarily large files at a flat, low memory ceiling. For
> archives made of thousands of tiny entries, **fflate** is several times faster and much
> lighter — but that gap is zip.js's per-entry orchestration, not its codec: measured on
> their own, the codecs are the other way round (see [Codecs](#codecs-compared-at-equal-output-size)).
> Against native tooling, zip.js on a modern runtime is a bit
> faster *and* tighter than 7-Zip's fast mode on single-file streaming; 7-Zip keeps a
> real edge only on thousands of tiny files.

## Environment

| | |
|---|---|
| Machine | Apple M2, 8 cores (4 performance + 4 efficiency), 16 GB RAM |
| OS | macOS 26.6.2 (arm64) |
| Runtime | Node.js v26.7.0 |
| zip.js | 2.11.2 |
| jszip | 3.10.1 |
| fflate | 0.8.3 |
| archiver | 8.0.0 |
| Measured | 2026-09-06, except the 7-Zip section (see its own note) |

## Method

- **Isolation.** Each `(library, operation, workload)` combination runs in its own
  freshly-spawned Node process under `/usr/bin/time -l`, so there is no cross-library
  GC or heap contamination and peak memory is a true per-library figure.
- **Timing.** `performance.now()` around the measured operation only. Every combination
  runs **3 times**; the table reports the **median**.
- **Memory.** Peak resident set size (RSS) reported by `/usr/bin/time -l`. The "peak"
  column is the delta over an empty-process baseline (~50 MB on this runtime), i.e. the
  memory attributable to the work.
- **Fair work.** All libraries compress at **DEFLATE level 6**, and output sizes are shown
  next to the times. Read them: a "level" is not a unit shared between libraries. zlib's
  level 6 and fflate's level 6 are different parameter sets, so the two do not produce the
  same amount of compression and a time is only comparable next to the size it achieved.
  The [Codecs](#codecs-compared-at-equal-output-size) section compares them by output size
  instead, which is the only axis on which "faster" means anything. The corpus is generated
  from a seeded PRNG, so every library sees byte-for-byte identical input.
- **zip.js modes.** zip.js is measured both **single-threaded** (apples-to-apples with
  the single-threaded libraries) and with its **Web Worker** pool, so the worker
  overhead is never hidden.

## Compression — single process, single thread

Level-6 DEFLATE, one entry (or one batch) compressed in the main thread. This is the
apples-to-apples comparison against the single-threaded libraries.

Time, with the size each library produced — the two are only meaningful together.

| Workload | @zip.js/zip.js | jszip | fflate | archiver |
|---|--:|--:|--:|--:|
| Compressible text (20 MB) | 703 ms / 6.1 MB | 1714 ms / 6.2 MB | 908 ms / 6.3 MB | **702 ms** / 6.1 MB |
| Incompressible data (20 MB) | 364 ms / 21.0 MB | 858 ms / 21.0 MB | **298 ms** / 21.0 MB | 357 ms / 21.0 MB |
| Already-compressed media (20 MB) | 362 ms / 21.0 MB | 860 ms / 21.0 MB | **297 ms** / 21.0 MB | 356 ms / 21.0 MB |
| 5,000 files × ~2 KB | 834 ms / 4.9 MB | 826 ms / 4.7 MB | **305 ms** / 4.8 MB | 431 ms / 4.8 MB |

Peak memory for the same runs (Δ over baseline):

| Workload | @zip.js/zip.js | jszip | fflate | archiver |
|---|--:|--:|--:|--:|
| Compressible text (20 MB) | 90 MB | 69 MB | **62 MB** | 72 MB |
| Incompressible data (20 MB) | 153 MB | 92 MB | 108 MB | **81 MB** |
| Already-compressed media (20 MB) | 154 MB | 93 MB | 108 MB | **74 MB** |
| 5,000 files × ~2 KB | 252 MB | 267 MB | **102 MB** | 137 MB |

On compressible text zip.js and archiver are tied (703 ms against 702 ms, inside the
noise) and both produce the smallest archive; fflate is 29 % slower here *and* 3 % larger,
which is the level-6-is-not-a-unit effect described above. On incompressible data — where
no codec has anything to do — fflate wins on both axes. On 5,000 tiny files fflate is 2.7×
faster than zip.js and uses a third of the memory; that gap is per-entry orchestration
(worker round trips, header writes, one stream per entry), not codec speed, as the
[Codecs](#codecs-compared-at-equal-output-size) section shows.

## Parallelism & codec backends — 8 files × 8 MB, single process

This is the headline. The same 64 MB of compressible entries, compressed several ways
in a **plain Node process** (no worker threads unless noted). zip.js can select its
codec backend at runtime — native `CompressionStream`, the bundled WebAssembly zlib, or
a pure-JavaScript zlib port — and it can issue `add()` calls concurrently.

| Configuration | Median time | Output | vs jszip |
|---|--:|--:|--:|
| **zip.js — `CompressionStream`, concurrent `add()`** | **607 ms** | 19.6 MB | **9.3×** |
| fflate — async (its own worker pool) | 733 ms | 20.0 MB | 7.7× |
| zip.js — `CompressionStream`, sequential | 2214 ms | 19.6 MB | 2.6× |
| archiver — Node zlib (libuv threadpool) | 2278 ms | 19.6 MB | 2.5× |
| fflate — `zipSync` (single thread) | 3118 ms | 20.0 MB | 1.8× |
| zip.js — WASM zlib | 3358 ms | 19.7 MB | 1.7× |
| zip.js — pure-JS zlib | 3840 ms | 19.7 MB | 1.5× |
| jszip (pako, single thread) | 5671 ms | 19.7 MB | 1.0× |

The two fflate rows produce 20.0 MB where every other row produces 19.6–19.7 MB, i.e. ~2 %
more, so they are not doing quite the same work as the rows above and below them.

**The point:** zip.js with the native `CompressionStream` goes from **2214 ms
sequential to 607 ms with concurrent `add()` — a 3.6× speedup — using no Web Workers at
all.** The native codec runs on the platform's threadpool, so independent entries
compress on multiple cores while your code stays on the main thread. That makes it the
fastest configuration measured, ahead of fflate's dedicated worker pool.

One honest caveat, visible in the table: **only the native `CompressionStream` backend
parallelizes this way.** The WASM and pure-JS backends run synchronously on the main
thread, so concurrent `add()` does not speed them up (3358 ms and 3840 ms whether
sequential or "parallel"). Use those backends when a native `CompressionStream` is
unavailable or when you need byte-identical zlib output; use the native backend when you
want this parallelism.

There is a second way to land on the WASM backend by accident: because
`CompressionStream` exposes no level control, requesting any non-default compression
level (e.g. `{ level: 5 }`) makes zip.js fall back to the WASM zlib codec — which, per
the table, does not parallelize via concurrent `add()`. Keep the default level to keep
the native-backend parallelism, or pair a custom level with Web Workers (below).

### Parallelism is runtime-dependent

The table above is measured on **Node**, and its "no Web Workers needed" result does
**not** hold on every runtime: concurrent `add()` only spreads across cores if the
runtime runs `CompressionStream` off the main thread. Same 8 × 8 MB workload, level 6,
median of 3:

| Runtime | sequential | concurrent `add()` | concurrent `add()` + `useWebWorkers` |
|---|--:|--:|--:|
| Node.js | 2.94 s | **0.74 s** | 0.74 s |
| Bun | 1.80 s | **0.36 s** | 0.46 s |
| Deno | 1.84 s | 1.82 s | **0.47 s** |

- **Node and Bun** back `CompressionStream` with a threadpool, so concurrent `add()`
  alone parallelizes — no Web Workers needed (Bun is fastest here).
- **Deno** runs `CompressionStream` on the isolate thread, so concurrent `add()` alone
  gives no speedup (1.82 s ≈ its 1.84 s sequential). Set `useWebWorkers: true` and it
  parallelizes properly (0.47 s), landing right beside the others.
- **Browsers vary by engine.** Safari/WebKit runs `CompressionStream` on the main thread
  (serial, like Deno), so use `useWebWorkers: true` there. Chromium implements it
  separately and may behave differently — check a given browser by compressing several
  large buffers through `CompressionStream` sequentially versus concurrently and comparing
  the wall time.

**Rule of thumb:** on Node and Bun, concurrent `add()` is enough; on Deno and
Safari/WebKit, also set `useWebWorkers: true`. Web Workers are the portable way to get
this parallelism on any runtime — and the only way once you use a non-default level
(which switches to the WASM codec).

## Codecs, compared at equal output size

The tables above compare *libraries* — a whole zip pipeline, at each library's default
"level 6". This one compares only the **codecs**, on the same 20 MB buffer with no zip
container around them, and sorts by output size rather than by level. That matters because
zlib's level 6 and fflate's level 6 are different parameter sets: matched by level, the
comparison silently reads a ratio difference as a speed difference.

`frontier` marks a row that nothing smaller beats on time.

| Codec | Setting | Output | Ratio | Time | Throughput | |
|---|---|--:|--:|--:|--:|---|
| WASM zlib | level 8 | 6,115,980 | 3.429 | 1466 ms | 13.6 MB/s | frontier |
| `CompressionStream` | no level control | 6,120,503 | 3.426 | 692 ms | 28.9 MB/s | frontier |
| WASM zlib | level 6 | 6,165,103 | 3.402 | 1023 ms | 19.5 MB/s | |
| fflate | level 8 — its best | 6,239,025 | 3.361 | 750 ms | 26.7 MB/s | |
| fflate | level 6 | 6,257,881 | 3.351 | 738 ms | 27.1 MB/s | |
| WASM zlib | level 5 | 6,562,182 | 3.196 | 494 ms | 40.5 MB/s | frontier |
| fflate | level 5 | 6,648,574 | 3.154 | 534 ms | 37.4 MB/s | |
| WASM zlib | level 4 | 6,907,987 | 3.036 | 276 ms | 72.4 MB/s | frontier |
| fflate | level 1 | 7,261,700 | 2.888 | 316 ms | 63.3 MB/s | |
| WASM zlib | level 1 | 7,531,042 | 2.785 | 177 ms | 113.1 MB/s | frontier |

The pure-JS port produces byte-identical output to the WASM codec at every level and is
1.2–2× slower; the full 28-row table is in `benchmarks/results/codecs-results.json`.

Two things to take from it. **fflate never lands on the frontier here** — at every size it
reaches, one of zip.js's codecs gets there sooner — and above ratio 3.361 it has no setting
at all, while the WASM codec keeps going to 3.429. Second, the level numbers really are
incomparable: fflate's level 6 falls between zlib's levels 5 and 6 on ratio, which is
exactly why the library tables above show it as both faster *and* larger.

Decompression of the same stream:

| Codec | Time | Throughput |
|---|--:|--:|
| WASM zlib | **46 ms** | 434.7 MB/s |
| `DecompressionStream` | 56 ms | 354.6 MB/s |
| pure-JS zlib | 110 ms | 181.5 MB/s |
| fflate | 123 ms | 162.7 MB/s |

The WASM inflate is 2.7× faster than fflate's, and faster than Node's own
`DecompressionStream`, since the Chromium `inffast_chunk` port landed in 2.11.0.

## Decompression

Level-6 archives, read back and fully materialized. archiver has no unzip API, so it is
excluded.

| Workload | @zip.js/zip.js | jszip | fflate |
|---|--:|--:|--:|
| Compressible text (20 MB) | **66 ms** | 133 ms | 117 ms |
| 5,000 files × ~2 KB | 603 ms | 445 ms | **104 ms** |

zip.js has the fastest large-stream decompression. On thousands of tiny entries the
per-entry setup cost dominates and **fflate is dramatically faster and lighter** — again
the right tool when you are unpacking many small files.

## Streaming a large file — 256 MB, disk → zip → disk

The input is streamed from disk and the archive is streamed back to disk; neither is
ever fully held in memory (for the libraries that support it).

| Library | Median time | Peak memory (Δ) | Output |
|---|--:|--:|--:|
| zip.js (workers) | **8888 ms** | 60 MB | 78.3 MB |
| archiver | 9150 ms | 71 MB | 78.3 MB |
| zip.js (1 thread) | 9296 ms | 62 MB | 78.3 MB |
| fflate | 12549 ms | **43 MB** | 80.2 MB |
| jszip | 22014 ms | 484 MB | 78.9 MB |

zip.js, fflate and archiver all hold memory **flat** while streaming — zip.js peaks ~60 MB
over baseline regardless of the 256 MB input, thanks to real backpressure through the
compression pipeline. **jszip buffers the entire file** and needs ~484 MB, at more than
twice the wall-clock time. If you process files that do not fit comfortably in memory,
avoid jszip.

## Against native tooling — 7-Zip

How far is zip.js from a native archiver? [`benchmarks/bench-7z.js`](benchmarks/bench-7z.js)
compares it against the `7zz` CLI (7-Zip 25.01), disk-to-disk on both sides, under Deno
2.9.3 and Bun 1.3.14 (both runtimes agree within noise; Deno numbers shown). 7-Zip
timings include process spawn (~ms). Unlike the tables above, this section and the next
were measured in July 2026 with zip.js 2.8.29 and have not been re-run; they compare
zip.js against tools that have not changed, so they age slowly, but treat the zip.js
columns as a floor rather than as current.

One comparison is impossible to make perfectly fair: **no 7-Zip preset runs zlib's
algorithm.** `-mx=5+` is a near-optimal parser (much slower, smaller output) and
`-mx=1..4` a greedy one (faster, larger output) — they bracket zlib level 6. So the
table carries two anchors: `-mx=6` as the *ratio* anchor and `-mx=1` as the *speed*
anchor. On this machine the `-mx` ladder on the 256 MB file reads: `-mx=1/3` → 5.9 s,
`-mx=5/6` → 34 s, `-mx=7` → 85 s — the 6× jump at `-mx=5` is the switch from greedy
matching to optimal parsing, and it cannot be hidden by threads (one file = one deflate
stream = one core).

| Workload (compress) | zip.js (workers) | 7-Zip `-mx=6` (mt) | 7-Zip `-mx=1` (mt) |
|---|--:|--:|--:|
| Compressible text (20 MB) | **426 ms** / 6.2 MB | 2606 ms / 5.8 MB | 470 ms / 6.8 MB |
| Incompressible data (20 MB) | **342 ms** | 410 ms | 372 ms |
| 5,000 files × ~2 KB | 780 ms / 5.5 MB | 199 ms / 4.9 MB | **168 ms** / 5.0 MB |
| Large file, disk-to-disk (256 MB) | **5.5 s** / 79.5 MB | 33.4 s / 73.6 MB | 5.9 s / 86.7 MB |

| Workload (decompress) | zip.js (workers) | 7-Zip (mt) |
|---|--:|--:|
| Compressible text (20 MB) | **69 ms** | 88 ms |
| 5,000 files × ~2 KB | 976 ms | **471 ms** |

- **On single-file streaming, zip.js strictly dominates 7-Zip's speed tier**: a bit
  faster *and* ~9 % smaller output, because zlib-6's lazy matching is a better
  speed/ratio point than 7-Zip's greedy fast mode. What `-mx=6` buys for its 6× time is
  ~7 % more compression — a trade zip.js cannot make, but also one most workloads don't
  want.
- **7-Zip legitimately dominates many small files** (~4× on compress, ~2× on
  decompress): its per-entry cost is near zero, while zip.js pays per-entry
  orchestration (worker round trips, header writes, one output stream per extracted
  file). Same lesson as the fflate rows above — tiny-entry workloads are zip.js's cost
  center, and the codec backend is irrelevant there.

## The runtime's zlib decides zip.js throughput

On bulk data zip.js is a thin wrapper around the platform's `CompressionStream` — it
adds ~7 % over the raw encoder on the 256 MB stream. That means throughput is decided
by **which zlib the runtime vendors**, and they differ a lot. Same 256 MB compressible
file, one thread, level-6-class output everywhere:

| Encoder | Time | Output |
|---|--:|--:|
| zlib-ng — Deno & Bun `CompressionStream` | **4.8–5.1 s** | 79.4 MB |
| Chromium zlib — Node `CompressionStream` / `node:zlib` | 8.9 s | 78.3 MB |
| classic zlib — Apple `gzip -6` | 12.5 s | 78.9 MB |
| (reference) 7-Zip `-mx=6` | 33.5 s | 73.6 MB |

Verified in the runtimes' sources: Deno builds `flate2` with vendored
**zlib-ng** (`__vendored_zlib_ng` default feature), Bun vendors **zlib-ng 2.3.3**
(SIMD CRC/adler/match kernels, NEON on arm64) behind `node:zlib` and
`CompressionStream`, and Node vendors **Chromium's zlib fork** (SIMD checksums and
hash sliding, but a match finder much closer to classic zlib).

Consequences worth knowing:

- **The same zip.js code runs ~1.75× faster on Deno/Bun than on Node** for bulk
  compression. A "zip.js is fast/slow" measurement is often really a statement about
  the host's zlib — and the Node tables above are the *pessimistic* end.
- **The WASM backend is a fallback, but a much closer one since 2.11.0.** It used to be
  classic zlib plus WebAssembly overhead, ~3× slower than native on compress. It now
  carries Chromium's zlib: on the codec table above it deflates at level 6 in 1023 ms
  against the native `CompressionStream`'s 692 ms — 1.5× slower for 0.7 % more bytes — and
  it *inflates faster* than the native `DecompressionStream` (46 ms against 56 ms). Reach
  for it when no native `CompressionStream` exists, when you need a specific level, or
  when you need output that does not vary with the host's zlib.
- Output sizes across the zlib family are interchangeable (78–79 MB): it is one
  algorithm at four levels of implementation tuning. zip.js inherits whichever the
  host provides — including future upgrades, for free.

## When to pick which

- **Choose zip.js** for the fastest compression of large or multiple entries
  (parallelism with no Web Workers), the fastest large-stream decompression, flat
  low-memory streaming of huge files, and the broadest ZIP feature set in one library —
  AES & ZipCrypto encryption, Zip64, split/multi-volume archives, and an optional Web
  Worker pool.
- **Choose fflate** for archives of thousands of tiny entries, and when you want the
  smallest memory footprint and the smallest bundle. Note what it does *not* buy you: at
  equal output size its codec is not the fastest one here (see
  [Codecs](#codecs-compared-at-equal-output-size)), so the win is fflate's very low
  per-entry cost, not its deflate.
- **archiver** is a solid streaming compressor on Node but cannot read archives.
- **jszip** is convenient but the slowest here and buffers whole files in memory.

## Reproduce

The harness lives in [`benchmarks/`](benchmarks/). It has no ties to the machine above;
run it on yours.

```sh
cd benchmarks
npm install            # jszip, fflate, archiver (zip.js is used from the repo)
npm run corpus         # generate the deterministic datasets under .corpus/
node bench.js          # the head-to-head tables (compress / decompress / disk streaming)
node bench-backends.js # the parallelism & codec-backend matrix
node bench-codecs.js   # the codecs alone, sorted by output size
deno run -A bench-7z.js # zip.js vs the 7zz CLI (also: bun bench-7z.js)
```

`bench-7z.js` needs the 7-Zip CLI (`brew install sevenzip`) and runs under Deno or Bun;
set `ZIPJS_BACKEND=wasm` to measure the WebAssembly codec instead of the native
`CompressionStream`, and `SKIP_HUGE=1` to skip the 256 MB combo.

Both scripts write JSON and a human-readable log to `benchmarks/results/`. Set
`RUNS=<n>` to change the number of repetitions (default 3). The datasets are generated
from a seeded PRNG (`benchmarks/lib/corpus.js`), so every run — and every library —
sees identical bytes.
