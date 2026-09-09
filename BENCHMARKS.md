# Benchmarks

Measurements of [@zip.js/zip.js](https://www.npmjs.com/package/@zip.js/zip.js) against
[jszip](https://github.com/Stuk/jszip), [fflate](https://github.com/101arrowz/fflate) and
[archiver](https://github.com/archiverjs/node-archiver), of zip.js's own codec backends, and of
the runtimes it runs on. Every number on this page comes from the harness in
[`benchmarks/`](benchmarks/), on the machine, date and versions below. The results are specific
to them; run the harness on your machine before relying on any of them.

## Environment

| | |
|---|---|
| Machine | Apple M2, 8 cores (4 performance + 4 efficiency), 16 GB RAM |
| OS | macOS 26.6.2 (arm64) |
| Runtimes | Node.js v26.7.0, Bun 1.4.2, Deno 2.9.6 |
| Browsers | Firefox 154, Chrome 153 (the browser encryption table only) |
| zip.js | 2.14.0 |
| jszip | 3.10.2 |
| fflate | 0.8.3 |
| archiver | 8.0.0 |
| Measured | 2026-09-10; the two encryption tables on 2026-09-09, on the same zip.js version |

## Method

- **Workloads.** Synthetic data from a seeded generator (`benchmarks/lib/corpus.js`), so every
  library and every run sees the same bytes. "Text" is English-looking words that deflate
  compresses about 3.4×, "incompressible" is random bytes, "5,000 files" is 5,000 text files of
  about 2 KB each, and the 8 × 8 MB and 256 MB workloads are text.
- **Isolation.** In `bench.js` and `bench-backends.js`, each (library, operation, workload)
  combination runs in its own freshly spawned Node process under macOS's `/usr/bin/time -l`, so
  the libraries never share a heap and peak memory is per library. The codec, encryption and
  runtime scripts run in-process, with one warmup run before the timed ones.
- **Timing.** `performance.now()` around the measured operation. Each combination runs 3 times
  (5 in the encryption script) and the tables report the median. Differences of a few percent
  are within run-to-run noise; a bold cell is the lowest number in its row, not a verdict.
- **Memory.** Peak resident set size reported by `/usr/bin/time -l`, as a delta over an empty
  Node process (about 50 MB). It is the highest of the 3 runs, while the time is their median.
- **Level.** Every library compresses at its own level 6. A level is not a unit shared between
  libraries: zlib's level 6 and fflate's level 6 are different parameter sets and produce
  different sizes, so every time is printed next to the size it achieved, and the
  [Codecs](#codecs-compared-at-equal-output-size) section compares by output size instead.
- **Codecs.** zip.js and archiver run the host's zlib, written in C, through `CompressionStream`
  and Node's `zlib` module; jszip (pako) and fflate deflate and inflate in JavaScript. zip.js's
  own WebAssembly and JavaScript codecs are measured in the Codecs section.
- **Units.** MB in the tables is 10^6 bytes. The workload sizes (20 MB, 8 MB, 256 MB) and the
  MB/s throughputs use 2^20 bytes.
- **zip.js modes.** "1 thread" is zip.js without its Web Worker pool, "workers" is with it.

## Compression — one entry at a time, no workers

Level-6 DEFLATE, one entry (or one batch) compressed by a single sequence of calls. Time, with
the size each library produced:

| Workload | @zip.js/zip.js | jszip | fflate | archiver |
|---|--:|--:|--:|--:|
| Compressible text (20 MB) | 775 ms / 6.1 MB | 1742 ms / 6.2 MB | 932 ms / 6.3 MB | **717 ms** / 6.1 MB |
| Incompressible data (20 MB) | 374 ms / 21.0 MB | 874 ms / 21.0 MB | **306 ms** / 21.0 MB | 364 ms / 21.0 MB |
| 5,000 files × ~2 KB | 891 ms / 4.9 MB | 859 ms / 4.7 MB | **280 ms** / 4.8 MB | 494 ms / 4.8 MB |

Peak memory for the same runs (Δ over baseline):

| Workload | @zip.js/zip.js | jszip | fflate | archiver |
|---|--:|--:|--:|--:|
| Compressible text (20 MB) | 91 MB | 69 MB | **62 MB** | 72 MB |
| Incompressible data (20 MB) | 154 MB | 93 MB | 108 MB | **83 MB** |
| 5,000 files × ~2 KB | 251 MB | 266 MB | **101 MB** | 140 MB |

On the text file zip.js takes 8 % longer than archiver (775 against 717 ms) for the same output
size; both run Node's zlib. fflate is 20 % slower than zip.js and 2 % larger, jszip 2.2× slower.
On incompressible data fflate is the fastest and zip.js uses the most memory. On 5,000 small
files fflate is 3.2× faster than zip.js and uses 40 % of its memory. Since zip.js's own codecs
are faster than fflate's at equal output size (see [Codecs](#codecs-compared-at-equal-output-size)),
that gap is in the work zip.js does per entry, a stream and a header each, not in the codec.

## Parallelism and codec backends — 8 files × 8 MB, one Node process

The same 64 MB of text entries, compressed in one Node process, without Web Workers unless
noted. zip.js selects its codec backend at runtime, the host's `CompressionStream`, the bundled
WebAssembly zlib or a pure-JavaScript zlib port, and its `add()` calls can be issued
concurrently.

| Configuration | Median time | Output | vs jszip |
|---|--:|--:|--:|
| **zip.js — `CompressionStream`, concurrent `add()`** | **676 ms** | 19.6 MB | **8.6×** |
| fflate — async (its own worker pool) | 768 ms | 20.0 MB | 7.5× |
| archiver — Node zlib | 2324 ms | 19.6 MB | 2.5× |
| zip.js — `CompressionStream`, sequential `add()` | 2421 ms | 19.6 MB | 2.4× |
| fflate — `zipSync` (single thread) | 3165 ms | 20.0 MB | 1.8× |
| zip.js — WASM zlib, sequential `add()` | 3553 ms | 19.7 MB | 1.6× |
| zip.js — WASM zlib, concurrent `add()` | 3577 ms | 19.7 MB | 1.6× |
| zip.js — pure-JS zlib, concurrent `add()` | 3954 ms | 19.7 MB | 1.5× |
| zip.js — pure-JS zlib, sequential `add()` | 4008 ms | 19.7 MB | 1.4× |
| jszip (pako, single thread) | 5788 ms | 19.7 MB | 1.0× |

With the host's `CompressionStream`, zip.js goes from 2421 ms with sequential `add()` calls to
676 ms with concurrent ones, 3.6×, without Web Workers: Node runs `CompressionStream` off the
main thread, so the entries compress on several cores while the JavaScript thread only feeds
them. fflate's async API, which runs its own worker pool, takes 768 ms on the same input; its
output is 2 % larger than the zlib rows, so it does slightly less work. The WebAssembly and
pure-JavaScript backends run on the main thread, and concurrent `add()` changes nothing for them.

Requesting a non-default level, e.g. `{ level: 5 }`, selects the bundled codec instead of
`CompressionStream`, which has no level control, and gives up this parallelism unless
`useWebWorkers` is set. The [Compression levels](#compression-levels) table shows what a lower
level buys on each runtime.

### Runtimes

Concurrent `add()` spreads across cores only where the runtime runs `CompressionStream` off the
JavaScript thread. Same 8 × 8 MB workload, level 6, in-process, median of 3
(`benchmarks/bench-runtimes.js`; the table above spawns one process per run, which is why its
Node numbers differ slightly from this one):

| Runtime | sequential `add()` | concurrent `add()` | concurrent `add()`, `chunkSize` 256 KB | concurrent `add()` + `useWebWorkers` |
|---|--:|--:|--:|--:|
| Node.js v26.7.0 | 2.29 s | 0.62 s | **0.61 s** | 0.78 s |
| Bun 1.4.2 | 1.24 s | 1.23 s | 0.26 s | **0.25 s** |
| Deno 2.9.6 | 1.39 s | 1.43 s | 1.36 s | **0.47 s** |

- **Node** runs `CompressionStream` off the JavaScript thread: concurrent `add()` alone is 3.7×
  faster than sequential, and the chunk size changes nothing. Node has no `Worker` global, so
  `useWebWorkers` spawns nothing there and the entries run in-process.
- **Bun** runs `CompressionStream` off the JavaScript thread only for writes larger than 128 KB
  (its native implementation, since Bun 1.4 in August 2026). zip.js writes 64 KB chunks by
  default, so concurrent `add()` alone gains nothing on Bun; `chunkSize: 256 * 1024` makes it
  4.8× faster, and `useWebWorkers: true` does the same.
- **Deno** runs `CompressionStream` on the JavaScript thread whatever the write size: concurrent
  `add()` alone gains nothing, `useWebWorkers: true` is 3× faster.

Browsers were not measured for this table.

### Compression levels

Level 6 runs the host's `CompressionStream`, every other level the bundled WebAssembly zlib, so
whether a lower level buys speed depends on how fast the host's zlib is. One 20 MB text entry,
one thread, in-process, median of 3 (`benchmarks/bench-runtimes.js`):

| Runtime | level 6, `CompressionStream` | level 5, WASM zlib | level 1, WASM zlib |
|---|--:|--:|--:|
| Node.js v26.7.0 | 717 ms / 6.12 MB | 550 ms / 6.56 MB | 195 ms / 7.53 MB |
| Bun 1.4.2 | 387 ms / 6.20 MB | 481 ms / 6.56 MB | 172 ms / 7.53 MB |
| Deno 2.9.6 | 412 ms / 6.21 MB | 604 ms / 6.56 MB | 232 ms / 7.53 MB |

On Node, level 5 is 23 % faster than the default for 7 % more bytes. On Bun and Deno the
default is already faster than level 5, so level 5 there is slower and larger; only level 1 buys
speed on them, at 21 to 23 % more bytes. The WebAssembly codec produces the same size on every
runtime; the level-6 sizes differ because they come from three different zlib builds.

## Codecs, compared at equal output size

The tables above compare libraries, a whole zip pipeline at each library's "level 6". This one
compares only the codecs, on the same 20 MB text buffer with no zip container around them, and
sorts by output size rather than by level, because zlib's level 6 and fflate's level 6 are
different parameter sets: matched by level, the comparison reads a ratio difference as a speed
difference.

A row is beaten when another row is at least as small and faster; the last column names the
fastest such row. A row with an empty last column is beaten by nothing on the table.

| Codec | Setting | Output | Ratio | Time | Throughput | Beaten by |
|---|---|--:|--:|--:|--:|---|
| WASM zlib | level 8 | 6,115,980 | 3.429 | 1504 ms | 13.3 MB/s | |
| `CompressionStream` | no level control | 6,120,503 | 3.426 | 716 ms | 27.9 MB/s | |
| WASM zlib | level 6 | 6,165,103 | 3.402 | 1047 ms | 19.1 MB/s | `CompressionStream` |
| fflate | level 8, its best | 6,239,025 | 3.361 | 767 ms | 26.1 MB/s | `CompressionStream` |
| fflate | level 6 | 6,257,881 | 3.351 | 815 ms | 24.6 MB/s | `CompressionStream` |
| WASM zlib | level 5 | 6,562,182 | 3.196 | 505 ms | 39.6 MB/s | |
| fflate | level 5 | 6,648,574 | 3.154 | 541 ms | 36.9 MB/s | WASM zlib level 5 |
| WASM zlib | level 4 | 6,907,987 | 3.036 | 278 ms | 71.9 MB/s | |
| fflate | level 1 | 7,261,700 | 2.888 | 318 ms | 62.9 MB/s | WASM zlib level 4 |
| WASM zlib | level 2 | 7,359,387 | 2.850 | 195 ms | 102.5 MB/s | |
| WASM zlib | level 1 | 7,531,042 | 2.785 | 175 ms | 114.1 MB/s | |

The pure-JavaScript port produces the same size as the WebAssembly codec at every level and
takes 1.0 to 1.8× its time, the gap closing at the higher levels; the full 28-row table is in
`benchmarks/results/codecs-results.json`.

Every fflate row is beaten by a zlib row: by the host's `CompressionStream` at fflate's levels 6
to 9, by the WebAssembly codec below. Above ratio 3.361 fflate has no setting, while the
WebAssembly codec reaches 3.429. fflate's level 6 sits between zlib's levels 5 and 6 on ratio,
which is why its output is larger than zip.js's in the library tables.

Decompression of the same stream:

| Codec | Time | Throughput |
|---|--:|--:|
| WASM zlib | **54 ms** | 369.5 MB/s |
| `DecompressionStream` | 57 ms | 352.6 MB/s |
| pure-JS zlib | 111 ms | 180.6 MB/s |
| fflate | 128 ms | 156.0 MB/s |

The WebAssembly inflate and Node's `DecompressionStream` are within 6 % of each other; fflate's
inflate takes 2.4× the time of the WebAssembly one, the pure-JavaScript port 2.1×.

## Decompression

Level-6 archives, read back and fully materialized. archiver has no unzip API, so it is
excluded. The zip.js column runs the host's `DecompressionStream`; jszip and fflate inflate in
JavaScript.

| Workload | @zip.js/zip.js | jszip | fflate |
|---|--:|--:|--:|
| Compressible text (20 MB) | **66 ms** | 137 ms | 126 ms |
| 5,000 files × ~2 KB | 676 ms | 457 ms | **104 ms** |

Peak memory for the same runs (Δ over baseline):

| Workload | @zip.js/zip.js | jszip | fflate |
|---|--:|--:|--:|
| Compressible text (20 MB) | 118 MB | 97 MB | **92 MB** |
| 5,000 files × ~2 KB | 350 MB | 301 MB | **125 MB** |

On the 20 MB stream zip.js takes half the time of jszip and fflate and uses the most memory. On
5,000 small files fflate is 6.5× faster than zip.js and uses 36 % of its memory, and jszip is
1.5× faster than zip.js.

## Encryption — AES-256, stored entry

An AES entry pays the cipher on every byte, so this section measures the engines zip.js can run
the WinZip cipher on (AES-CTR with the counter WinZip specifies, HMAC-SHA1) against the sjcl code
they replaced after 2.13.1. The entry is stored (level 0) so no codec sits in the pipeline, and
the "before" row is the 2.13.1 bundle measured by the same script. 20 MB of incompressible data,
in-process, single thread, median of 5 (`benchmarks/bench-aes.js`); the two numbers of a cell are
one archive written, then read back.

| Engine | Node.js | Bun | Deno |
|---|--:|--:|--:|
| WebAssembly, linked into the module of the WebAssembly builds | **111 / 111 MB/s** | **115 / 115** | 99 / 100 |
| JavaScript, the fallback of those builds and the engine of the native and core builds | 91 / 86 | 102 / 102 | **109 / 103** |
| 2.13.1, sjcl | 26 / 25 | 29 / 29 | 19 / 19 |

The same measurement in a browser, through the Web Worker pool, on 32 MB of bytes generated in
the page (the corpus is not served to the browser), median of 3 passes
([`benchmarks/bench-aes.html`](benchmarks/bench-aes.html), which prints its result and writes no
file):

| Engine | Firefox 154 | Chrome 153 |
|---|--:|--:|
| WebAssembly | **87 / 89 MB/s** | **99 / 101** |
| JavaScript | 55 / 59 | 77 / 77 |
| 2.13.1, sjcl | 17 / 17 | 22 / 22 |

- The JavaScript engine is 3.2 to 3.5× sjcl on Node, Bun and in the two browsers, and 5.7× on
  Deno, where sjcl was slowest. sjcl ran the cipher 16 bytes
  at a time through a bit-array layer; the new engine works on typed arrays and is fed whole
  chunks. Every build has it.
- The WebAssembly kernel is the same C code on every host: 99 to 115 MB/s on Node, Bun and Deno,
  87 to 101 MB/s in the two browsers. The JavaScript engine is within 23 % of it on Node, Bun and
  Deno, ahead of it on Deno, and 1.3 to 1.6× slower in the browsers. The WebAssembly builds use
  the kernel whenever their module loads and fall back to the JavaScript engine when it cannot,
  for instance under a Content Security Policy that does not allow WebAssembly
  (`'wasm-unsafe-eval'`).
- Neither is hardware AES. OpenSSL on this machine (`openssl speed -evp aes-256-ctr`, 8 KB
  blocks) runs AES-256-CTR at 9.4 GB/s with the ARMv8 AES instructions and at
  249 MB/s with them disabled (`OPENSSL_armcap=0`). WebAssembly has no access to those
  instructions, and Web Crypto cannot run this counter mode: it increments the last byte of the
  counter where WinZip increments the first, and it exposes no ECB to build the keystream from.
- The bundles did not grow with the new engines. Gzipped, `dist/zip.min.js` went from 67,869
  bytes in 2.13.1 to 67,820 in 2.14.0, `dist/zip-native.min.js` from 73,798 to 72,060 and
  `dist/zip-core.min.js` from 36,405 to 35,493 (`git show <tag>:<file> | gzip -9 | wc -c`):
  sjcl's removal outweighs the JavaScript engine and the kernel.

## Streaming a large file — 256 MB, disk → zip → disk

The input is streamed from disk and the archive is streamed back to disk; neither is held in
memory by the libraries that support streaming.

| Library | Median time | Peak memory (Δ) | Output |
|---|--:|--:|--:|
| zip.js (1 thread) | **9229 ms** | 62 MB | 78.3 MB |
| archiver | 9466 ms | 72 MB | 78.3 MB |
| zip.js (workers) | 9925 ms | 61 MB | 78.3 MB |
| fflate | 13123 ms | **51 MB** | 80.2 MB |
| jszip | 23241 ms | 479 MB | 78.9 MB |

zip.js, archiver and fflate stream: zip.js peaks 62 MB over baseline on the 256 MB input. jszip
buffers the whole file, 479 MB, and takes 2.5× zip.js's time. The zip.js worker pool is 8 %
slower than one thread on a single entry, since it has nothing to run in parallel and every
chunk crosses a thread boundary.

## The runtime's zlib decides zip.js throughput

On bulk data zip.js adds almost nothing over the host's `CompressionStream`, so its throughput is
that of the zlib the runtime ships, and they differ. One 256 MB text file, one thread, in
memory, fed in 64 KB writes as zip.js does, median of 3 (`benchmarks/bench-runtimes.js`; gzip is
Apple's, timed as a child process):

| Runtime | `CompressionStream` alone | zip.js, one entry | Output |
|---|--:|--:|--:|
| Node.js v26.7.0 | 9.45 s | 9.36 s | 78.3 MB |
| Bun 1.4.2 | 4.79 s | 4.89 s | 79.4 MB |
| Deno 2.9.6 | 5.63 s | 5.50 s | 79.5 MB |
| Apple `gzip -6`, classic zlib | 13.0 to 13.6 s | | 78.9 MB |

zip.js is within 2 % of the raw stream on every runtime. On this file Bun's `CompressionStream`
takes half the time of Node's and Deno's 60 %, for 1.5 % more bytes; Apple's gzip takes 1.4×
Node's time. Which zlib each runtime ships is not verified here; the table measures the result.

The WebAssembly backend, measured in the [Codecs](#codecs-compared-at-equal-output-size) section
on Node, deflates at level 6 in 1.46× the time of `CompressionStream` for 0.7 % more bytes, and
inflates within 6 % of `DecompressionStream`. It is the backend to use when no
`CompressionStream` exists, when a specific level is needed, or when the output must not depend
on the host's zlib.

## Reproduce

The harness lives in [`benchmarks/`](benchmarks/). `bench.js` and `bench-backends.js` need macOS
(`/usr/bin/time -l` for peak memory) and Node; the other scripts run wherever zip.js runs.

```sh
cd benchmarks
npm install              # jszip, fflate, archiver (zip.js is used from the repository)
npm run corpus           # generate the datasets under .corpus/
node bench.js            # the head-to-head tables: compress, decompress, disk streaming
node bench-backends.js   # the parallelism and codec-backend table
node bench-codecs.js     # the codecs alone, sorted by output size
node bench-aes.js        # the AES engines; also: bun bench-aes.js, deno run -A bench-aes.js
node bench-runtimes.js   # the runtime tables; also: bun bench-runtimes.js, deno run -A bench-runtimes.js
```

Each script writes its JSON to `benchmarks/results/`; the `*-run.log` files there are the
console output of the runs behind this page. `RUNS=<n>` sets the number of repetitions (default
3, 5 in `bench-aes.js`). `ZIPJS_BUNDLE=<path to a previous index.min.js> node bench-aes.js` adds
the row of a previous release; `git show v2.13.1:index.min.js` gave the sjcl row. The browser
encryption table comes from `benchmarks/bench-aes.html`, served from the repository root
(`npx http-server -p 8080`, then `http://localhost:8080/benchmarks/bench-aes.html`), with
`?engine=js` for the JavaScript engine and `?bundle=zipjs-2.13.1.min.js` for a bundle copied next
to the page; it prints the median of its three passes and a JSON line.

Two more scripts feed no table on this page: `bench-crc.js` compares the two ways zip.js can
obtain the CRC-32 of an entry compressed by `CompressionStream`, and `bench-7z.js` compares
zip.js with the 7-Zip command line (`brew install sevenzip`, runs under Deno or Bun).
