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
| Measured | 2026-09-06 on Node, the runtime comparisons under the runtimes they name; the encryption section on 2026-09-09, also under Bun 1.4.2, Deno 2.9.6, Firefox 154 and Chrome 153 |

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

Level-6 DEFLATE, one entry (or one batch) compressed in the main thread, one codec at a
time. The codecs are not the same kind of code: zip.js and archiver run the host's zlib in
C, through `CompressionStream` and Node's `zlib` module, while jszip (pako) and fflate
deflate in JavaScript. The [Codecs](#codecs-compared-at-equal-output-size) table compares
zip.js's own WASM and JavaScript codecs with fflate's.

Time, with the size each library produced — the two are only meaningful together.

| Workload | @zip.js/zip.js | jszip | fflate | archiver |
|---|--:|--:|--:|--:|
| Compressible text (20 MB) | 703 ms / 6.1 MB | 1714 ms / 6.2 MB | 908 ms / 6.3 MB | **702 ms** / 6.1 MB |
| Incompressible data (20 MB) | 364 ms / 21.0 MB | 858 ms / 21.0 MB | **298 ms** / 21.0 MB | 357 ms / 21.0 MB |
| 5,000 files × ~2 KB | 834 ms / 4.9 MB | 826 ms / 4.7 MB | **305 ms** / 4.8 MB | 431 ms / 4.8 MB |

Peak memory for the same runs (Δ over baseline):

| Workload | @zip.js/zip.js | jszip | fflate | archiver |
|---|--:|--:|--:|--:|
| Compressible text (20 MB) | 90 MB | 69 MB | **62 MB** | 72 MB |
| Incompressible data (20 MB) | 153 MB | 92 MB | 108 MB | **81 MB** |
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

That fallback costs more than a backend switch: how much speed a lower level actually
buys depends on how fast the host's own zlib is, and on Deno it buys nothing at all —
`level: 5` there is slower *and* larger than the default (590 ms / 6.6 MB against
418 ms / 6.2 MB on the 20 MB text, one thread; on Node the same request is the ordinary
trade, 514 ms against 696 ms for 7 % more bytes).

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

A row is beaten when another row is at least as small and faster; the last column names
the fastest one. The rows nothing beats are the real choices: the ones above them cost
more time, the ones below more bytes.

| Codec | Setting | Output | Ratio | Time | Throughput | Beaten by |
|---|---|--:|--:|--:|--:|---|
| WASM zlib | level 8 | 6,115,980 | 3.429 | 1466 ms | 13.6 MB/s | |
| `CompressionStream` | no level control | 6,120,503 | 3.426 | 692 ms | 28.9 MB/s | |
| WASM zlib | level 6 | 6,165,103 | 3.402 | 1023 ms | 19.5 MB/s | `CompressionStream` |
| fflate | level 8 — its best | 6,239,025 | 3.361 | 750 ms | 26.7 MB/s | `CompressionStream` |
| fflate | level 6 | 6,257,881 | 3.351 | 738 ms | 27.1 MB/s | `CompressionStream` |
| WASM zlib | level 5 | 6,562,182 | 3.196 | 494 ms | 40.5 MB/s | |
| fflate | level 5 | 6,648,574 | 3.154 | 534 ms | 37.4 MB/s | WASM zlib level 5 |
| WASM zlib | level 4 | 6,907,987 | 3.036 | 276 ms | 72.4 MB/s | |
| fflate | level 1 | 7,261,700 | 2.888 | 316 ms | 63.3 MB/s | WASM zlib level 4 |
| WASM zlib | level 1 | 7,531,042 | 2.785 | 177 ms | 113.1 MB/s | |

The pure-JS port produces byte-identical output to the WASM codec at every level and is
1.2–2× slower; the full 28-row table is in `benchmarks/results/codecs-results.json`.

Two things to take from it. **Every fflate row is beaten by a zip.js codec** — at every size it
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
excluded. The zip.js column runs the host's `DecompressionStream`, i.e. Node's zlib in C;
jszip and fflate inflate in JavaScript. The [Codecs](#codecs-compared-at-equal-output-size)
table above measures zip.js's own WASM and JavaScript inflaters against fflate's, without
the container, and they come out ahead as well.

| Workload | @zip.js/zip.js | jszip | fflate |
|---|--:|--:|--:|
| Compressible text (20 MB) | **66 ms** | 133 ms | 117 ms |
| 5,000 files × ~2 KB | 603 ms | 445 ms | **104 ms** |

zip.js has the fastest large-stream decompression, with the native inflate here and with
its own in the codec table. On thousands of tiny entries the
per-entry setup cost dominates and **fflate is dramatically faster and lighter** — again
the right tool when you are unpacking many small files.

## Encryption — AES-256, stored entry

An AES entry pays the cipher on every byte, so this section measures the engines zip.js can run
the WinZip cipher on (AES-CTR with the Gladman counter, HMAC-SHA1) against the sjcl code they
replaced after 2.13.1. The entry is stored (level 0) so no codec sits in the pipeline, and the
"before" row is the 2.13.1 bundle measured by the same script. 20 MB of incompressible data,
in-process, single thread, median of 5; the two numbers are one archive written, then read back.

| Engine | Node.js | Bun | Deno |
|---|--:|--:|--:|
| WebAssembly, linked into the module of the WebAssembly builds | **111 / 111 MB/s** | **115 / 115** | 99 / 100 |
| JavaScript, the fallback of those builds and the engine of the native and core builds | 91 / 86 | 102 / 102 | **109 / 103** |
| 2.13.1, sjcl | 26 / 25 | 29 / 29 | 19 / 19 |

The same entry at 32 MB in a browser, through the Web Worker pool, median of 3 passes
([`benchmarks/bench-aes.html`](benchmarks/bench-aes.html)):

| Engine | Firefox 154 | Chrome 153 |
|---|--:|--:|
| WebAssembly | **87 / 89 MB/s** | **99 / 101** |
| JavaScript | 55 / 59 | 77 / 77 |
| 2.13.1, sjcl | 17 / 17 | 22 / 22 |

What to take from it:

- **The JavaScript engine alone is 3.5× sjcl on Node and 3 to 4× in browsers.** sjcl ran the
  cipher 16 bytes at a time through a generic bit-array layer; the new engine works on typed
  arrays and is fed whole chunks. Every build has it.
- **The WebAssembly kernel is the same code in C, and it is flat across hosts: 100 to 115 MB/s
  everywhere.** What varies is the JavaScript engine, within 20 % of the kernel either way on
  Node, Bun and Deno, whose JITs run typed-array code about as fast as wasm, and 1.3 to 1.6×
  slower in browsers (Safari 26.6, measured at the engine level only, sits with Chrome at 1.3×).
  The WebAssembly builds use the kernel whenever their module loads and fall back to the
  JavaScript engine when it cannot, for instance under a Content Security Policy without
  `'wasm-unsafe-eval'`, which is why the fallback stays in the bundle.
- **Neither is hardware AES, and nothing in a browser can be.** OpenSSL on this machine encrypts
  AES-256-CTR at 5.8 GB/s with the ARMv8 instructions and at 245 MB/s with them disabled
  (`OPENSSL_armcap=0`). WebAssembly has no access to them, and Web Crypto cannot run this counter
  mode: it increments the last byte where WinZip increments the first, and it offers no ECB to
  build the keystream from. Software AES in the 100 to 120 MB/s range is the ceiling until a
  platform API exposes the instructions.
- The kernel costs the default bundle 2.1 KB gzipped; the native and core builds carry only the
  JavaScript engine and grew by 0.1 KB.

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

## The runtime's zlib decides zip.js throughput

On bulk data zip.js is a thin wrapper around the platform's `CompressionStream` — it
adds ~7 % over the raw encoder on the 256 MB stream. That means throughput is decided
by **which zlib the runtime vendors**, and they differ a lot. Same 256 MB compressible
file, one thread, level-6-class output everywhere. This is the one table on this page
still carrying its July 2026 measurement: it compares runtimes to each other rather than
zip.js to anything, so it ages with their zlib and not with ours.

| Encoder | Time | Output |
|---|--:|--:|
| zlib-ng — Deno & Bun `CompressionStream` | **4.8–5.1 s** | 79.4 MB |
| Chromium zlib — Node `CompressionStream` / `node:zlib` | 8.9 s | 78.3 MB |
| classic zlib — Apple `gzip -6` | 12.5 s | 78.9 MB |

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
node bench-aes.js      # the AES engines on a stored entry (also: bun / deno run -A); bench-aes.html is the browser page
deno run -A bench-7z.js # zip.js vs the 7zz CLI (also: bun bench-7z.js)
```

`bench-7z.js` needs the 7-Zip CLI (`brew install sevenzip`) and runs under Deno or Bun;
set `ZIPJS_BACKEND=wasm` to measure the WebAssembly codec instead of the native
`CompressionStream`, and `SKIP_HUGE=1` to skip the 256 MB combo.

Both scripts write JSON and a human-readable log to `benchmarks/results/`. Set
`RUNS=<n>` to change the number of repetitions (default 3). The datasets are generated
from a seeded PRNG (`benchmarks/lib/corpus.js`), so every run — and every library —
sees identical bytes.
