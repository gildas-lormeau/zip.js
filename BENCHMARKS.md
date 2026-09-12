# Benchmarks

Measurements of [@zip.js/zip.js](https://www.npmjs.com/package/@zip.js/zip.js) against
[jszip](https://github.com/Stuk/jszip), [fflate](https://github.com/101arrowz/fflate) and
[archiver](https://github.com/archiverjs/node-archiver), of zip.js's own codec backends, and of
the runtimes it runs on. Every number on this page comes from the harness in
[`benchmarks/`](benchmarks/), on the machine, date and versions below. The results are specific
to them; run the harness on your machine before relying on any of them.

The page answers four questions, each from one or two scripts of the harness:

- [How does zip.js compare with jszip, fflate and archiver?](#zipjs-against-jszip-fflate-and-archiver)
  `bench.js`, on Node.
- [Which codec backend of zip.js is fastest, and what does concurrent `add()` buy?](#the-codec-backends-of-zipjs)
  `bench-codecs.js` and `bench-backends.js`, on Node.
- [How do Node, Bun and Deno differ?](#node-bun-and-deno) `bench-runtimes.js`.
- [How fast is AES encryption?](#encryption-aes-256-on-a-stored-entry) `bench-aes.js` and
  `bench-aes.html`, on the three runtimes and two browsers.

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
| Measured | 2026-09-10; the two encryption tables on 2026-09-12, on the engines that follow 2.14.0 |

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
  are within run-to-run noise. A bold cell is the best number among the alternatives it is
  compared with, one per column in the head-to-head tables and one per runtime in the runtime
  table; it is not a verdict.
- **Memory.** Peak resident set size reported by `/usr/bin/time -l`, as a delta over an empty
  Node process (about 50 MB). It is the highest of the 3 runs, while the time is their median.
- **Level.** Every library compresses at its own level 6. A level is not a unit shared between
  libraries: zlib's level 6 and fflate's level 6 are different parameter sets and produce
  different sizes, so every time is printed next to the size it achieved, and the
  [Codecs](#codecs-at-equal-output-size) table compares by output size instead.
- **Codecs.** Every head-to-head table names the codec of each row. archiver runs Node's `zlib`
  module, the host's zlib written in C; jszip (pako) and fflate deflate and inflate in
  JavaScript. zip.js selects its codec at runtime, so it has one row per backend: the
  `CompressionStream` and `DecompressionStream` of the runtime, Node's zlib here and the default
  where they exist; the bundled WebAssembly zlib; and the pure-JavaScript zlib port. The last two
  ship with the library, like the codecs of jszip and fflate, so those rows compare the
  libraries without the host's zlib in the picture.
- **Units.** MB in the tables is 10^6 bytes. The workload sizes (20 MB, 8 MB, 256 MB) and the
  MB/s throughputs use 2^20 bytes.

## zip.js against jszip, fflate and archiver

One Node process per measurement (`benchmarks/bench.js`), one thread, every library at its
level 6. zip.js appears once per codec backend.

### Compression

One entry, or one batch of entries, compressed by a single sequence of calls. Time, with the
size each row produced:

| Library | Codec | Compressible text (20 MB) | Incompressible data (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|--:|
| @zip.js/zip.js | `CompressionStream` | **700 ms** / 6.1 MB | 365 ms / 21.0 MB | 888 ms / 4.9 MB |
| @zip.js/zip.js | WASM zlib | 1057 ms / 6.2 MB | 475 ms / 21.0 MB | 679 ms / 4.9 MB |
| @zip.js/zip.js | pure-JS zlib | 1238 ms / 6.2 MB | 802 ms / 21.0 MB | 1125 ms / 4.9 MB |
| jszip | pako (JavaScript) | 1723 ms / 6.2 MB | 862 ms / 21.0 MB | 843 ms / 4.7 MB |
| fflate | fflate (JavaScript) | 909 ms / 6.3 MB | **297 ms** / 21.0 MB | **281 ms** / 4.8 MB |
| archiver | Node `zlib` (C) | 702 ms / 6.1 MB | 359 ms / 21.0 MB | 424 ms / 4.8 MB |

Peak memory for the same runs (Δ over baseline):

| Library | Codec | Compressible text (20 MB) | Incompressible data (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|--:|
| @zip.js/zip.js | `CompressionStream` | 91 MB | 153 MB | 245 MB |
| @zip.js/zip.js | WASM zlib | 119 MB | 170 MB | 250 MB |
| @zip.js/zip.js | pure-JS zlib | 114 MB | 172 MB | 276 MB |
| jszip | pako (JavaScript) | 69 MB | 93 MB | 269 MB |
| fflate | fflate (JavaScript) | **62 MB** | 108 MB | **102 MB** |
| archiver | Node `zlib` (C) | 72 MB | **74 MB** | 137 MB |

On the text file zip.js with `CompressionStream` and archiver take the same time, 700 and
702 ms, for the same output size: both run Node's zlib. With the codecs that ship with each
library, fflate takes 909 ms for 2 % more bytes, zip.js's WebAssembly zlib 1057 ms, its
pure-JavaScript port 1238 ms and jszip 1723 ms. On incompressible data fflate is the fastest row
and archiver the smallest in memory. On 5,000 small files the WebAssembly backend is 23 % faster
than `CompressionStream`, so a native stream costs more per entry than a WebAssembly one; fflate
takes 41 % of the WebAssembly row's time there against 86 % on the 20 MB file, and the
difference is the work zip.js does per entry, a stream and a header each. The zip.js rows use
the most memory on the two 20 MB files.

### Decompression

Level-6 archives, read back and fully materialized. archiver has no unzip API, so it is
excluded.

| Library | Codec | Compressible text (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|
| @zip.js/zip.js | `DecompressionStream` | **66 ms** | 628 ms |
| @zip.js/zip.js | WASM zlib | 78 ms | 476 ms |
| @zip.js/zip.js | pure-JS zlib | 180 ms | 615 ms |
| jszip | pako (JavaScript) | 137 ms | 444 ms |
| fflate | fflate (JavaScript) | 116 ms | **102 ms** |

Peak memory for the same runs (Δ over baseline):

| Library | Codec | Compressible text (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|
| @zip.js/zip.js | `DecompressionStream` | 116 MB | 350 MB |
| @zip.js/zip.js | WASM zlib | 163 MB | 484 MB |
| @zip.js/zip.js | pure-JS zlib | 154 MB | 451 MB |
| jszip | pako (JavaScript) | 103 MB | 306 MB |
| fflate | fflate (JavaScript) | **92 MB** | **120 MB** |

On the 20 MB stream `DecompressionStream` takes 66 ms and the WebAssembly inflate 78 ms, then
fflate 116 ms, jszip 137 ms and the pure-JavaScript port 180 ms. On 5,000 small files the order
reverses: fflate takes 102 ms, jszip 444 ms and the three zip.js rows 476 to 628 ms, with
`DecompressionStream` the slowest of them, the same per-entry cost as in compression. fflate
uses the least memory on both workloads, 34 % of the `DecompressionStream` row on the small
files, and the WebAssembly and pure-JavaScript rows peak higher than `DecompressionStream`. The
three zip.js rows allocate the same 800 MB of stream objects over the 5,000 entries, about
160 KB per entry. The WebAssembly and pure-JavaScript codecs run on the JavaScript thread, so
V8's incremental marking keeps more of that garbage alive between collections, and that is the
difference between the rows.

### Streaming a 256 MB file, disk to disk

One file read with `fs.createReadStream` in 64 KB chunks and one archive written with
`fs.createWriteStream`, one entry, each library's streaming API. zip.js takes Web Streams, so its
rows go through Node's `Readable.toWeb` and `Writable.toWeb` bridges; the other libraries take
the Node streams directly.

| Library | Codec | Median time | Peak memory (Δ) | Output |
|---|---|--:|--:|--:|
| @zip.js/zip.js | `CompressionStream` | **9055 ms** | 62 MB | 78.3 MB |
| archiver | Node `zlib` (C) | 9115 ms | 71 MB | 78.3 MB |
| fflate | fflate (JavaScript) | 12456 ms | **41 MB** | 80.2 MB |
| @zip.js/zip.js | WASM zlib | 13629 ms | 88 MB | 78.9 MB |
| @zip.js/zip.js | pure-JS zlib | 15485 ms | 120 MB | 78.9 MB |
| jszip | pako (JavaScript) | 22539 ms | 74 MB | 78.9 MB |

Every row streams: the peaks stay between 41 MB (fflate) and 120 MB (the pure-JavaScript port)
over baseline on the 256 MB input. zip.js with `CompressionStream` and archiver take the same
time within 1 %; jszip takes 2.5× that. With its WebAssembly zlib zip.js takes 1.5× the
`CompressionStream` time and 1.1× fflate's, for 1.6 % fewer bytes; the pure-JavaScript port
takes 1.2× fflate's time.

## The codec backends of zip.js

zip.js selects its codec at runtime: the `CompressionStream` and `DecompressionStream` of the
host when they exist and the level is the default, otherwise the bundled WebAssembly zlib, and
the pure-JavaScript zlib port where WebAssembly cannot load or when it is configured. This
section measures them on Node, alone and then inside the zip pipeline.

### Codecs at equal output size

The same 20 MB text buffer with no zip container around it (`benchmarks/bench-codecs.js`),
sorted by output size rather than by level, because zlib's level 6 and fflate's level 6 are
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

Alone, the WebAssembly backend deflates at level 6 in 1.46× the time of `CompressionStream` for
0.7 % more bytes and inflates within 6 % of `DecompressionStream`. zip.js uses it by itself
when no `CompressionStream` exists or when a level other than the default is requested;
`useCompressionStream: false` selects it on every host, for an output that does not depend on
the host's zlib.

### Concurrent `add()` and the backends

8 files × 8 MB of text, 64 MB in one Node process (`benchmarks/bench-backends.js`), without
Web Workers unless noted. `add()` calls can be issued concurrently, and the table shows what
that buys with each backend.

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

## Node, Bun and Deno

The same zip.js code under the three runtimes, in-process, median of 3
(`benchmarks/bench-runtimes.js`). Browsers were not measured for these tables.

### Concurrent `add()` per runtime

Concurrent `add()` spreads across cores only where the runtime runs `CompressionStream` off the
JavaScript thread. Same 8 × 8 MB workload as the backends table, level 6. That table spawns one
process per run and this one measures in-process after a warmup, which is why their Node numbers
differ:

| Runtime | sequential `add()` | concurrent `add()` | concurrent `add()`, `chunkSize` 256 KB | concurrent `add()` + `useWebWorkers` |
|---|--:|--:|--:|--:|
| Node.js v26.7.0 | 2.25 s | **0.59 s** | 0.59 s | 0.59 s |
| Bun 1.4.2 | 1.19 s | 1.19 s | **0.24 s** | 0.25 s |
| Deno 2.9.6 | 1.31 s | 1.31 s | 1.33 s | **0.34 s** |

- **Node** runs `CompressionStream` off the JavaScript thread, on the libuv threadpool, four
  threads by default (`UV_THREADPOOL_SIZE`): concurrent `add()` alone is 3.8× faster than
  sequential, and the chunk size changes nothing. Node has no `Worker` global, so
  `useWebWorkers` spawns nothing there and the entries run in-process, in the same time.
- **Bun** runs `CompressionStream` off the JavaScript thread only for writes larger than 128 KB
  (its native implementation, since Bun 1.4 in August 2026). zip.js writes 64 KB chunks by
  default, so concurrent `add()` alone gains nothing on Bun; `chunkSize: 256 * 1024` makes it
  4.9× faster, and `useWebWorkers: true` 4.7×.
- **Deno** runs `CompressionStream` on the JavaScript thread whatever the write size: concurrent
  `add()` alone gains nothing, `useWebWorkers: true` is 3.9× faster.

### Compression levels

Level 6 runs the host's `CompressionStream`, every other level the bundled WebAssembly zlib, so
whether a lower level buys speed depends on how fast the host's zlib is. The pure-JavaScript
column runs the same JavaScript on each engine. One 20 MB text entry, one thread:

| Runtime | level 6, `CompressionStream` | level 5, WASM zlib | level 5, pure-JS zlib | level 1, WASM zlib |
|---|--:|--:|--:|--:|
| Node.js v26.7.0 | 686 ms / 6.12 MB | 521 ms / 6.56 MB | 780 ms / 6.56 MB | 192 ms / 7.53 MB |
| Bun 1.4.2 | 371 ms / 6.20 MB | 464 ms / 6.56 MB | 665 ms / 6.56 MB | 168 ms / 7.53 MB |
| Deno 2.9.6 | 403 ms / 6.21 MB | 590 ms / 6.56 MB | 689 ms / 6.56 MB | 228 ms / 7.53 MB |

On Node, level 5 on the WebAssembly codec is 24 % faster than the default for 7 % more bytes.
On Bun and Deno the default is already faster than level 5, so level 5 there is slower and
larger; only level 1 buys speed on them, 55 % on Bun and 44 % on Deno, at 21 % more bytes. The
pure-JavaScript port at level 5 takes 1.5× the WebAssembly time on Node, 1.4× on Bun and 1.2×
on Deno, and is slower than the default on every runtime. The two bundled codecs produce the
same size on every runtime; the level-6 sizes differ because they come from three different
zlib builds.

### One 256 MB stream

On bulk data zip.js adds almost nothing over the host's `CompressionStream`, so its throughput is
that of the zlib the runtime ships, and they differ. One 256 MB text file, one thread, in
memory, fed in 64 KB writes as zip.js does; gzip is Apple's, timed as a child process:

| Runtime | `CompressionStream` alone | zip.js, one entry | Output |
|---|--:|--:|--:|
| Node.js v26.7.0 | 8.99 s | 8.78 s | 78.3 MB |
| Bun 1.4.2 | 4.73 s | 4.77 s | 79.4 MB |
| Deno 2.9.6 | 5.13 s | 5.23 s | 79.5 MB |
| Apple `gzip -6`, classic zlib | 12.3 to 12.4 s | | 78.9 MB |

zip.js is within 2 % of the raw stream on every runtime. On this file Bun's `CompressionStream`
takes 53 % of Node's time and Deno's 57 %, for about 1.5 % more bytes; Apple's gzip takes 1.4×
Node's time. Which zlib each runtime ships is not verified here; the table measures the result.

## Encryption: AES-256 on a stored entry

An AES entry pays the cipher on every byte, so this section measures the engines zip.js can run
the WinZip cipher on (AES-CTR with the counter WinZip specifies, HMAC-SHA1) against the sjcl code
they replaced after 2.13.1. The entry is stored (level 0) so no codec sits in the pipeline, and
the "before" row is the 2.13.1 bundle measured by the same script. 20 MB of incompressible data,
in-process, single thread, median of 5 (`benchmarks/bench-aes.js`); the two numbers of a cell are
one archive written, then read back.

| Engine | Node.js | Bun | Deno |
|---|--:|--:|--:|
| WebAssembly, linked into the module of the WebAssembly builds | **131 / 130 MB/s** | **118 / 121** | 123 / 122 |
| JavaScript, the fallback of those builds and the engine of the native and core builds | 114 / 114 | 112 / 111 | **142 / 129** |
| 2.13.1, sjcl | 25 / 25 | 27 / 27 | 19 / 19 |

The same measurement in a browser, through the Web Worker pool, on 32 MB of bytes generated in
the page (the corpus is not served to the browser), median of 3 passes
([`benchmarks/bench-aes.html`](benchmarks/bench-aes.html), which prints its result and writes no
file):

| Engine | Firefox 154 | Chrome 153 |
|---|--:|--:|
| WebAssembly | **96 / 101 MB/s** | **118 / 121** |
| JavaScript | 68 / 69 | 100 / 98 |
| 2.13.1, sjcl | 17 / 17 | 22 / 22 |

- The JavaScript engine is 4.0 to 4.6× sjcl on Node, Bun and in the two browsers, and 6.8 to
  7.5× on Deno, where sjcl was slowest. sjcl ran the cipher 16 bytes
  at a time through a bit-array layer; the new engine works on typed arrays and is fed whole
  chunks, with the AES rounds and the SHA-1 steps written out. Every build has it.
- The WebAssembly kernel is the same C code on every host, with the same rounds written out:
  118 to 131 MB/s on Node, Bun and Deno, 96 to 121 MB/s in the two browsers. The JavaScript
  engine is within 13 % of it on Node and Bun, ahead of it on Deno, and 1.2 to 1.4× slower in
  the browsers. The WebAssembly builds use
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
  sjcl's removal outweighs the JavaScript engine and the kernel. Writing the rounds out after
  2.14.0 gives some of it back: 71,238, 73,339 and 36,235 bytes for the three files behind the
  encryption tables above.

## Reproduce

The harness lives in [`benchmarks/`](benchmarks/). `bench.js` and `bench-backends.js` need macOS
(`/usr/bin/time -l` for peak memory) and Node; the other scripts run wherever zip.js runs.

```sh
cd benchmarks
npm install              # jszip, fflate, archiver (zip.js is used from the repository)
npm run corpus           # generate the datasets under .corpus/
node bench.js            # the head-to-head tables: compress, decompress, disk streaming
node bench-backends.js   # the concurrent add() and backends table
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
