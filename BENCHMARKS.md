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
| OS | macOS 27.0 (arm64) |
| Runtimes | Node.js v26.7.0, Bun 1.4.2, Deno 2.9.7 |
| Browsers | Firefox 156, Chrome 153, headless (the browser encryption table only) |
| zip.js | 2.18.2 plus the commits up to 96084cc8 on master, which make 256 KB the default `chunkSize` |
| jszip | 3.10.2 |
| fflate | 0.8.3 |
| archiver | 8.0.0 |
| Measured | 2026-09-26 |

## Method

- **Workloads.** Synthetic data from a seeded generator (`benchmarks/lib/corpus.js`), so every
  library and every run sees the same bytes. "Text" is English-looking words that deflate
  compresses about 3.4×, "incompressible" is random bytes, "5,000 files" is 5,000 text files of
  about 2 KB each, and the 8 × 8 MB and 256 MB workloads are text.
- **Isolation.** In `bench.js` and `bench-backends.js`, each (library, operation, workload)
  combination runs in its own freshly spawned Node process under macOS's `/usr/bin/time -l`, so
  the libraries never share a heap and peak memory is per library. Every row of those two
  scripts includes what a fresh process pays on its first operation: the JIT warm-up of each
  library and, for the zip.js WebAssembly rows, the module instantiation, about 20 ms. The
  codec, encryption and runtime scripts run in-process, with one warmup run before the timed
  ones.
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
- **Checks.** No decompression row verifies the CRC-32 of the entries: zip.js and jszip leave
  the check off by default, and fflate has none on read. Turning it on in zip.js makes the
  inflater verify the CRC-32 through a gzip trailer: about 7 ms per 20 MB on the WebAssembly
  codec, within the noise on Node's `DecompressionStream`; the pure-JavaScript port keeps a
  separate pass over the output, about 15 ms.
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
| @zip.js/zip.js | `CompressionStream` | **698 ms** / 6.1 MB | 350 ms / 21.0 MB | 864 ms / 4.9 MB |
| @zip.js/zip.js | WASM zlib | 1049 ms / 6.2 MB | 461 ms / 21.0 MB | 666 ms / 4.9 MB |
| @zip.js/zip.js | pure-JS zlib | 1218 ms / 6.2 MB | 817 ms / 21.0 MB | 1107 ms / 4.9 MB |
| jszip | pako (JavaScript) | 1702 ms / 6.2 MB | 855 ms / 21.0 MB | 834 ms / 4.7 MB |
| fflate | fflate (JavaScript) | 908 ms / 6.3 MB | **296 ms** / 21.0 MB | **276 ms** / 4.8 MB |
| archiver | Node `zlib` (C) | 702 ms / 6.1 MB | 355 ms / 21.0 MB | 421 ms / 4.8 MB |

Peak memory for the same runs (Δ over baseline):

| Library | Codec | Compressible text (20 MB) | Incompressible data (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|--:|
| @zip.js/zip.js | `CompressionStream` | 108 MB | 160 MB | 251 MB |
| @zip.js/zip.js | WASM zlib | 115 MB | 187 MB | 260 MB |
| @zip.js/zip.js | pure-JS zlib | 113 MB | 167 MB | 281 MB |
| jszip | pako (JavaScript) | 69 MB | 93 MB | 261 MB |
| fflate | fflate (JavaScript) | **62 MB** | 108 MB | **103 MB** |
| archiver | Node `zlib` (C) | 71 MB | **74 MB** | 136 MB |

On the text file zip.js with `CompressionStream` and archiver take the same time, 698 and
702 ms, for the same output size: both run Node's zlib. With the codecs that ship with each
library, fflate takes 908 ms for 2 % more bytes, zip.js's WebAssembly zlib 1049 ms, its
pure-JavaScript port 1218 ms and jszip 1702 ms. On incompressible data fflate is the fastest row
and archiver the smallest in memory. On 5,000 small files the WebAssembly backend is 23 % faster
than `CompressionStream`, so a native stream costs more per entry than a WebAssembly one; fflate
takes 41 % of the WebAssembly row's time there against 87 % on the 20 MB file, and the
difference is the work zip.js does per entry, a stream and a header each. The zip.js rows use
the most memory on the two 20 MB files.

### Decompression

Level-6 archives, read back and fully materialized. archiver has no unzip API, so it is
excluded.

| Library | Codec | Compressible text (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|
| @zip.js/zip.js | `DecompressionStream` | **61 ms** | 629 ms |
| @zip.js/zip.js | WASM zlib | 72 ms | 474 ms |
| @zip.js/zip.js | pure-JS zlib | 154 ms | 613 ms |
| jszip | pako (JavaScript) | 133 ms | 440 ms |
| fflate | fflate (JavaScript) | 123 ms | **102 ms** |

Peak memory for the same runs (Δ over baseline):

| Library | Codec | Compressible text (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|
| @zip.js/zip.js | `DecompressionStream` | 135 MB | 348 MB |
| @zip.js/zip.js | WASM zlib | 165 MB | 453 MB |
| @zip.js/zip.js | pure-JS zlib | 155 MB | 467 MB |
| jszip | pako (JavaScript) | 103 MB | 303 MB |
| fflate | fflate (JavaScript) | **92 MB** | **119 MB** |

On the 20 MB stream `DecompressionStream` takes 61 ms and the WebAssembly inflate 72 ms, then
fflate 123 ms, jszip 133 ms and the pure-JavaScript port 154 ms. The WebAssembly row includes
the module instantiation a fresh process pays once, about 20 ms. Warm, the WebAssembly inflate
is 24 % faster than `DecompressionStream` in the [Codecs](#codecs-at-equal-output-size) table.
On 5,000 small files the order reverses: fflate takes 102 ms, jszip 440 ms and the three zip.js
rows 474 to 629 ms, with `DecompressionStream` the slowest of them, the same per-entry cost as
in compression. fflate uses the least memory on both workloads, 34 % of the
`DecompressionStream` row on the small files, and the WebAssembly and pure-JavaScript rows peak
higher than `DecompressionStream`. The three zip.js rows allocate the same 800 MB of stream objects over the
5,000 entries, about 160 KB per entry. The WebAssembly and pure-JavaScript codecs run on the
JavaScript thread, so V8's incremental marking keeps more of that garbage alive between
collections, and that is the difference between the rows.

### Streaming a 256 MB file, disk to disk

One file read with `fs.createReadStream` in 64 KB chunks and one archive written with
`fs.createWriteStream`, one entry, each library's streaming API. zip.js takes Web Streams, so its
rows go through Node's `Readable.toWeb` and `Writable.toWeb` bridges; the other libraries take
the Node streams directly.

| Library | Codec | Median time | Peak memory (Δ) | Output |
|---|---|--:|--:|--:|
| @zip.js/zip.js | `CompressionStream` | **8927 ms** | 85 MB | 78.3 MB |
| archiver | Node `zlib` (C) | 9131 ms | 75 MB | 78.3 MB |
| fflate | fflate (JavaScript) | 12394 ms | **42 MB** | 80.2 MB |
| @zip.js/zip.js | WASM zlib | 13320 ms | 122 MB | 78.9 MB |
| @zip.js/zip.js | pure-JS zlib | 15082 ms | 116 MB | 78.9 MB |
| jszip | pako (JavaScript) | 22243 ms | 74 MB | 78.9 MB |

Every row streams: the peaks stay between 42 MB (fflate) and 122 MB (the WebAssembly zlib)
over baseline on the 256 MB input. zip.js with `CompressionStream` and archiver take the same
time within 3 %; jszip takes 2.5× that. With its WebAssembly zlib zip.js takes 1.5× the
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
| WASM zlib | level 8 | 6,115,980 | 3.429 | 1479 ms | 13.5 MB/s | |
| `CompressionStream` | no level control | 6,120,503 | 3.426 | 693 ms | 28.9 MB/s | |
| WASM zlib | level 6 | 6,165,103 | 3.402 | 1026 ms | 19.5 MB/s | `CompressionStream` |
| fflate | level 8, its best | 6,239,025 | 3.361 | 755 ms | 26.5 MB/s | `CompressionStream` |
| fflate | level 6 | 6,257,881 | 3.351 | 732 ms | 27.3 MB/s | `CompressionStream` |
| WASM zlib | level 5 | 6,562,182 | 3.196 | 494 ms | 40.5 MB/s | |
| fflate | level 5 | 6,648,574 | 3.154 | 532 ms | 37.6 MB/s | WASM zlib level 5 |
| WASM zlib | level 4 | 6,907,987 | 3.036 | 275 ms | 72.7 MB/s | |
| fflate | level 1 | 7,261,700 | 2.888 | 315 ms | 63.6 MB/s | WASM zlib level 4 |
| WASM zlib | level 2 | 7,359,387 | 2.850 | 195 ms | 102.8 MB/s | |
| WASM zlib | level 1 | 7,531,042 | 2.785 | 171 ms | 116.7 MB/s | |

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
| WASM zlib | **42 ms** | 479.8 MB/s |
| `DecompressionStream` | 55 ms | 365.1 MB/s |
| pure-JS zlib | 109 ms | 182.7 MB/s |
| fflate | 121 ms | 165.6 MB/s |

The WebAssembly inflate is 24 % faster than Node's `DecompressionStream`; fflate's inflate takes
2.9× the time of the WebAssembly one, the pure-JavaScript port 2.6×.

Alone, the WebAssembly backend deflates at level 6 in 1.48× the time of `CompressionStream` for
0.7 % more bytes and inflates 24 % faster than `DecompressionStream`. zip.js uses it by itself
when no `CompressionStream` exists or when a level other than the default is requested;
`useCompressionStream: false` selects it on every host, for an output that does not depend on
the host's zlib.

### Concurrent `add()` and the backends

8 files × 8 MB of text, 64 MB in one Node process (`benchmarks/bench-backends.js`), without
Web Workers unless noted. `add()` calls can be issued concurrently, and the table shows what
that buys with each backend.

| Configuration | Median time | Output | vs jszip |
|---|--:|--:|--:|
| **zip.js — `CompressionStream`, concurrent `add()`** | **598 ms** | 19.6 MB | **9.4×** |
| fflate — async (its own worker pool) | 764 ms | 20.0 MB | 7.4× |
| zip.js — `CompressionStream`, sequential `add()` | 2245 ms | 19.6 MB | 2.5× |
| archiver — Node zlib | 2270 ms | 19.6 MB | 2.5× |
| fflate — `zipSync` (single thread) | 3083 ms | 20.0 MB | 1.8× |
| zip.js — WASM zlib, concurrent `add()` | 3369 ms | 19.7 MB | 1.7× |
| zip.js — WASM zlib, sequential `add()` | 3389 ms | 19.7 MB | 1.7× |
| zip.js — pure-JS zlib, concurrent `add()` | 3822 ms | 19.7 MB | 1.5× |
| zip.js — pure-JS zlib, sequential `add()` | 3872 ms | 19.7 MB | 1.5× |
| jszip (pako, single thread) | 5629 ms | 19.7 MB | 1.0× |

With the host's `CompressionStream`, zip.js goes from 2245 ms with sequential `add()` calls to
598 ms with concurrent ones, 3.8×, without Web Workers: Node runs `CompressionStream` off the
main thread, so the entries compress on several cores while the JavaScript thread only feeds
them. fflate's async API, which runs its own worker pool, takes 764 ms on the same input; its
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

| Runtime | sequential `add()` | concurrent `add()` | concurrent `add()`, `chunkSize` 64 KB | concurrent `add()` + `useWebWorkers` |
|---|--:|--:|--:|--:|
| Node.js v26.7.0 | 2.23 s | **0.59 s** | 0.59 s | 0.61 s |
| Bun 1.4.2 | 1.20 s | **0.24 s** | 1.20 s | 0.25 s |
| Deno 2.9.7 | 1.39 s | 1.30 s | 1.31 s | **0.34 s** |

- **Node** runs `CompressionStream` off the JavaScript thread, on the libuv threadpool, four
  threads by default (`UV_THREADPOOL_SIZE`): concurrent `add()` alone is 3.8× faster than
  sequential, and the chunk size changes nothing. Node has no `Worker` global, so
  `useWebWorkers` spawns nothing there and the entries run in-process, in the same time.
- **Bun** runs `CompressionStream` off the JavaScript thread only for writes larger than 128 KB
  (its native implementation, since Bun 1.4 in August 2026). With the 256 KB chunks zip.js
  writes by default, concurrent `add()` alone is 5.0× faster than sequential; with the 64 KB
  chunks that were the default up to version 2.18.2 it gains nothing, and `useWebWorkers: true`
  is 4.8× faster.
- **Deno** runs `CompressionStream` on the JavaScript thread whatever the write size: concurrent
  `add()` alone gains 7 %, `useWebWorkers: true` is 4.1× faster.

### Compression levels

Level 6 runs the host's `CompressionStream`, every other level the bundled WebAssembly zlib, so
whether a lower level buys speed depends on how fast the host's zlib is. The pure-JavaScript
column runs the same JavaScript on each engine. One 20 MB text entry, one thread:

| Runtime | level 6, `CompressionStream` | level 5, WASM zlib | level 5, pure-JS zlib | level 1, WASM zlib |
|---|--:|--:|--:|--:|
| Node.js v26.7.0 | 694 ms / 6.12 MB | 509 ms / 6.56 MB | 773 ms / 6.56 MB | 185 ms / 7.53 MB |
| Bun 1.4.2 | 368 ms / 6.20 MB | 459 ms / 6.56 MB | 661 ms / 6.56 MB | 177 ms / 7.53 MB |
| Deno 2.9.7 | 408 ms / 6.20 MB | 574 ms / 6.56 MB | 666 ms / 6.56 MB | 219 ms / 7.53 MB |

On Node, level 5 on the WebAssembly codec is 27 % faster than the default for 7 % more bytes.
On Bun and Deno the default is already faster than level 5, so level 5 there is slower and
larger; only level 1 buys speed on them, 52 % on Bun and 46 % on Deno, at 21 % more bytes. The
pure-JavaScript port at level 5 takes 1.5× the WebAssembly time on Node, 1.4× on Bun and 1.2×
on Deno, and is slower than the default on every runtime. The two bundled codecs produce the
same size on every runtime; the level-6 sizes differ because they come from three different
zlib builds.

### One 256 MB stream

On bulk data zip.js adds almost nothing over the host's `CompressionStream`, so its throughput is
that of the zlib the runtime ships, and they differ. One 256 MB text file, one thread, in
memory, fed in 256 KB writes as zip.js does; gzip is Apple's, timed as a child process:

| Runtime | `CompressionStream` alone | zip.js, one entry | Output |
|---|--:|--:|--:|
| Node.js v26.7.0 | 8.85 s | 8.91 s | 78.3 MB |
| Bun 1.4.2 | 4.72 s | 4.75 s | 79.4 MB |
| Deno 2.9.7 | 5.05 s | 5.20 s | 79.4 MB |
| Apple `gzip -6`, classic zlib | 12.2 to 12.6 s | | 78.9 MB |

zip.js is within 3 % of the raw stream on every runtime. On this file Bun's `CompressionStream`
takes 53 % of Node's time and Deno's 57 %, for about 1.4 % more bytes; Apple's gzip takes 1.4×
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
| WebAssembly, linked into the module of the WebAssembly builds | **138 / 139 MB/s** | **122 / 124** | 128 / 128 |
| JavaScript, the fallback of those builds and the engine of the native and core builds | 118 / 107 | 115 / 115 | **145 / 145** |
| 2.13.1, sjcl | 26 / 26 | 28 / 28 | 20 / 19 |

The same measurement in a browser, through the Web Worker pool, on 32 MB of bytes generated in
the page (the corpus is not served to the browser), median of 3 passes
([`benchmarks/bench-aes.html`](benchmarks/bench-aes.html), which prints its result and writes no
file):

| Engine | Firefox 156 | Chrome 153 |
|---|--:|--:|
| WebAssembly | **125 / 125 MB/s** | **136 / 138** |
| JavaScript | 79 / 79 | 104 / 104 |
| 2.13.1, sjcl | 17 / 17 | 22 / 22 |

- The JavaScript engine is 4.1 to 4.7× sjcl on Node, Bun and in the two browsers, and 7.3 to
  7.6× on Deno, where sjcl was slowest. sjcl ran the cipher 16 bytes
  at a time through a bit-array layer; the new engine works on typed arrays and is fed whole
  chunks, with the AES rounds and the SHA-1 steps written out. Every build has it.
- The WebAssembly kernel is the same C code on every host, with the same rounds written out:
  122 to 139 MB/s on Node, Bun and Deno, 125 to 138 MB/s in the two browsers. The JavaScript
  engine is within 8 % of it on Bun and 23 % on Node, ahead of it on Deno, and 1.3 to 1.6×
  slower in the browsers. The WebAssembly builds use
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
  2.14.0 gave some of it back, and the three files behind the encryption tables above gzip to
  73,184, 75,050 and 37,264 bytes.

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
