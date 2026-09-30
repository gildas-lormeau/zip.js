# Benchmarks

Measurements of [@zip.js/zip.js](https://www.npmjs.com/package/@zip.js/zip.js) against
[jszip](https://github.com/Stuk/jszip), [fflate](https://github.com/101arrowz/fflate),
[archiver](https://github.com/archiverjs/node-archiver) and the
[ZIP API of `node:zlib`](https://nodejs.org/api/zlib.html#class-zlibzipentry), of zip.js's own
codec backends, and of
the runtimes it runs on. Every number on this page comes from the harness in
[`benchmarks/`](benchmarks/), on the machine, date and versions below. The results are specific
to them; run the harness on your machine before relying on any of them.

The page answers four questions, each from one or two scripts of the harness:

- [How does zip.js compare with jszip, fflate, archiver and node:zlib?](#zipjs-against-jszip-fflate-archiver-and-nodezlib)
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
| Runtimes | Node.js v26.10.0, Bun 1.4.2, Deno 2.9.7 |
| Browsers | Firefox 156, Chrome 153, headless (the browser encryption table only) |
| zip.js | 2.19.0 |
| jszip | 3.10.2 |
| fflate | 0.8.3 |
| archiver | 8.0.0 |
| node:zlib | the ZIP API built into Node.js 26.10.0, experimental, added in 26.8.0 |
| Measured | 2026-09-30; the browser encryption table on 2026-09-26 |

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
- **Versions of this page.** A re-run replaces the whole page, and the runtimes, browsers and OS
  move between two runs along with zip.js, so a number read from an older version of the page
  is not comparable with one here: only a column measured in the same run isolates a single
  variable, as the `chunkSize` 64 KB column of the
  [runtime table](#concurrent-add-per-runtime) does for the default chunk size.
- **Level.** Every library compresses at its own level 6; the ZIP API of `node:zlib` has no level
  option and deflates at zlib's default, which is 6. A level is not a unit shared between
  libraries: zlib's level 6 and fflate's level 6 are different parameter sets and produce
  different sizes, so every time is printed next to the size it achieved, and the
  [Codecs](#codecs-at-equal-output-size) table compares by output size instead.
- **Codecs.** Every head-to-head table names the codec of each row. archiver and the ZIP API of
  `node:zlib` run Node's `zlib` module, the host's zlib written in C; jszip (pako) and fflate
  deflate and inflate in JavaScript. zip.js selects its codec at runtime, so it has one row per backend: the
  `CompressionStream` and `DecompressionStream` of the runtime, Node's zlib here and the default
  where they exist; the bundled WebAssembly zlib; and the pure-JavaScript zlib port. The last two
  ship with the library, like the codecs of jszip and fflate, so those rows compare the
  libraries without the host's zlib in the picture.
- **Checks.** No decompression row verifies the CRC-32 of the entries: zip.js and jszip leave
  the check off by default, fflate has none on read, and `node:zlib` verifies by default so its
  row passes `verify: false`. Turning it on in zip.js makes the
  inflater verify the CRC-32 through a gzip trailer: about 7 ms per 20 MB on the WebAssembly
  codec, within the noise on Node's `DecompressionStream`; the pure-JavaScript port keeps a
  separate pass over the output, about 15 ms.
- **Units.** MB in the tables is 10^6 bytes. The workload sizes (20 MB, 8 MB, 256 MB) and the
  MB/s throughputs use 2^20 bytes.

## zip.js against jszip, fflate, archiver and node:zlib

One Node process per measurement (`benchmarks/bench.js`), one thread, every library at its
level 6. zip.js appears once per codec backend. The `node:zlib` rows use the ZIP API built into
Node.js since 26.8.0: `ZipEntry.create()` and `createZipArchive()` to write, `ZipBuffer` to read.

### Compression

One entry, or one batch of entries, compressed by a single sequence of calls. Time, with the
size each row produced:

| Library | Codec | Compressible text (20 MB) | Incompressible data (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|--:|
| @zip.js/zip.js | `CompressionStream` | 730 ms / 6.1 MB | 357 ms / 21.0 MB | 731 ms / 4.9 MB |
| @zip.js/zip.js | WASM zlib | 1098 ms / 6.2 MB | 460 ms / 21.0 MB | 551 ms / 4.9 MB |
| @zip.js/zip.js | pure-JS zlib | 1229 ms / 6.2 MB | 787 ms / 21.0 MB | 962 ms / 4.9 MB |
| jszip | pako (JavaScript) | 1753 ms / 6.2 MB | 854 ms / 21.0 MB | 846 ms / 4.7 MB |
| fflate | fflate (JavaScript) | 908 ms / 6.3 MB | **298 ms** / 21.0 MB | **278 ms** / 4.8 MB |
| archiver | Node `zlib` (C) | 708 ms / 6.1 MB | 359 ms / 21.0 MB | 423 ms / 4.8 MB |
| node:zlib | Node `zlib` (C) | **678 ms** / 6.1 MB | 346 ms / 21.0 MB | 371 ms / 4.7 MB |

Peak memory for the same runs (Δ over baseline):

| Library | Codec | Compressible text (20 MB) | Incompressible data (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|--:|
| @zip.js/zip.js | `CompressionStream` | 115 MB | 184 MB | 262 MB |
| @zip.js/zip.js | WASM zlib | 139 MB | 206 MB | 244 MB |
| @zip.js/zip.js | pure-JS zlib | 126 MB | 182 MB | 287 MB |
| jszip | pako (JavaScript) | 76 MB | 102 MB | 269 MB |
| fflate | fflate (JavaScript) | 68 MB | 114 MB | **106 MB** |
| archiver | Node `zlib` (C) | 78 MB | 90 MB | 151 MB |
| node:zlib | Node `zlib` (C) | **51 MB** | **82 MB** | 245 MB |

On the text file the three rows that run Node's zlib take the same time within 8 %, for the
same output size: `node:zlib` 678 ms, archiver 708 ms and zip.js with `CompressionStream`
730 ms. With the codecs that ship with each library, fflate takes 908 ms for 2 % more bytes,
zip.js's WebAssembly zlib 1098 ms, its pure-JavaScript port 1229 ms and jszip 1753 ms. On
incompressible data fflate is the fastest row and `node:zlib` the smallest in memory. On 5,000
small files the WebAssembly backend is 25 % faster than `CompressionStream`, so a native stream
costs more per entry than a WebAssembly one; fflate takes 50 % of the WebAssembly row's time
there against 83 % on the 20 MB file, and the difference is the work zip.js does per entry, a
stream and a header each. `node:zlib` takes 371 ms on the same files and archiver 423 ms, both
on the same zlib as `CompressionStream`. The zip.js rows use the most memory on the two 20 MB
files, where `node:zlib`, which holds one buffer per entry and no stream, uses the least.

### Decompression

Level-6 archives, read back and fully materialized. archiver has no unzip API, so it is
excluded.

| Library | Codec | Compressible text (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|
| @zip.js/zip.js | `DecompressionStream` | 64 ms | 485 ms |
| @zip.js/zip.js | WASM zlib | 71 ms | 342 ms |
| @zip.js/zip.js | pure-JS zlib | 155 ms | 527 ms |
| jszip | pako (JavaScript) | 140 ms | 438 ms |
| fflate | fflate (JavaScript) | 116 ms | **101 ms** |
| node:zlib | Node `zlib` (C) | **60 ms** | 183 ms |

Peak memory for the same runs (Δ over baseline):

| Library | Codec | Compressible text (20 MB) | 5,000 files × ~2 KB |
|---|---|--:|--:|
| @zip.js/zip.js | `DecompressionStream` | 151 MB | 355 MB |
| @zip.js/zip.js | WASM zlib | 171 MB | 358 MB |
| @zip.js/zip.js | pure-JS zlib | 158 MB | 353 MB |
| jszip | pako (JavaScript) | 103 MB | 284 MB |
| fflate | fflate (JavaScript) | **97 MB** | **123 MB** |
| node:zlib | Node `zlib` (C) | 99 MB | 255 MB |

On the 20 MB stream `node:zlib` takes 60 ms and `DecompressionStream` 64 ms, the same zlib
reached two ways, then the WebAssembly inflate 71 ms, fflate 116 ms, jszip 140 ms and the
pure-JavaScript port 155 ms. The WebAssembly row includes the module instantiation a fresh
process pays once, about 20 ms. Warm, the WebAssembly inflate is 27 % faster than
`DecompressionStream` in the [Codecs](#codecs-at-equal-output-size) table. On 5,000 small files
the order changes: fflate takes 101 ms, `node:zlib` 183 ms, then the WebAssembly row 342 ms,
jszip 438 ms, `DecompressionStream` 485 ms and the pure-JavaScript port 527 ms, the same
per-entry cost as in compression. fflate uses the least memory on both workloads, 35 % of the
`DecompressionStream` row on the small files. The three zip.js rows allocate the same 800 MB of
stream objects over the 5,000 entries, about 160 KB per entry, and peak within 5 MB of each
other.

### Streaming a 256 MB file, disk to disk

One file read with `fs.createReadStream` in 64 KB chunks and one archive written with
`fs.createWriteStream`, one entry, each library's streaming API. zip.js takes Web Streams, so its
rows go through Node's `Readable.toWeb` and `Writable.toWeb` bridges; the other libraries take
the Node streams directly, `node:zlib` through `ZipEntry.createStream()`.

| Library | Codec | Median time | Peak memory (Δ) | Output |
|---|---|--:|--:|--:|
| node:zlib | Node `zlib` (C) | **8905 ms** | **42 MB** | 78.3 MB |
| @zip.js/zip.js | `CompressionStream` | 8926 ms | 117 MB | 78.3 MB |
| archiver | Node `zlib` (C) | 9167 ms | 81 MB | 78.3 MB |
| fflate | fflate (JavaScript) | 12781 ms | 57 MB | 80.2 MB |
| @zip.js/zip.js | WASM zlib | 13405 ms | 128 MB | 78.9 MB |
| @zip.js/zip.js | pure-JS zlib | 15326 ms | 123 MB | 78.9 MB |
| jszip | pako (JavaScript) | 22809 ms | 83 MB | 78.9 MB |

Every row streams: the peaks stay between 42 MB (`node:zlib`) and 128 MB (the WebAssembly zlib)
over baseline on the 256 MB input. The three rows on Node's zlib take the same time within 3 %;
jszip takes 2.6× that. With its WebAssembly zlib zip.js takes 1.5× the `CompressionStream` time
and 1.05× fflate's, for 1.6 % fewer bytes; the pure-JavaScript port takes 1.2× fflate's time.
The 256 KB chunks zip.js holds at each stage of its pipeline are what separates its
`CompressionStream` row from `node:zlib` in memory, 117 against 42 MB, at the same speed.

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
| WASM zlib | level 8 | 6,115,980 | 3.429 | 1486 ms | 13.5 MB/s | |
| `CompressionStream` | no level control | 6,120,503 | 3.426 | 695 ms | 28.8 MB/s | |
| WASM zlib | level 6 | 6,165,103 | 3.402 | 1025 ms | 19.5 MB/s | `CompressionStream` |
| fflate | level 8, its best | 6,239,025 | 3.361 | 755 ms | 26.5 MB/s | `CompressionStream` |
| fflate | level 6 | 6,257,881 | 3.351 | 751 ms | 26.6 MB/s | `CompressionStream` |
| WASM zlib | level 5 | 6,562,182 | 3.196 | 493 ms | 40.6 MB/s | |
| fflate | level 5 | 6,648,574 | 3.154 | 534 ms | 37.5 MB/s | WASM zlib level 5 |
| WASM zlib | level 4 | 6,907,987 | 3.036 | 277 ms | 72.3 MB/s | |
| fflate | level 1 | 7,261,700 | 2.888 | 319 ms | 62.8 MB/s | WASM zlib level 4 |
| WASM zlib | level 2 | 7,359,387 | 2.850 | 210 ms | 95.0 MB/s | |
| WASM zlib | level 1 | 7,531,042 | 2.785 | 173 ms | 115.8 MB/s | |

The pure-JavaScript port produces the same size as the WebAssembly codec at every level and
takes 1.0 to 1.9× its time, the gap closing at the higher levels; the full 28-row table is in
`benchmarks/results/codecs-results.json`.

Every fflate row is beaten by a zlib row: by the host's `CompressionStream` at fflate's levels 6
to 9, by the WebAssembly codec below. Above ratio 3.361 fflate has no setting, while the
WebAssembly codec reaches 3.429. fflate's level 6 sits between zlib's levels 5 and 6 on ratio,
which is why its output is larger than zip.js's in the library tables.

Decompression of the same stream:

| Codec | Time | Throughput |
|---|--:|--:|
| WASM zlib | **41 ms** | 483.7 MB/s |
| `DecompressionStream` | 56 ms | 359.1 MB/s |
| pure-JS zlib | 108 ms | 185.1 MB/s |
| fflate | 122 ms | 164.4 MB/s |

The WebAssembly inflate is 27 % faster than Node's `DecompressionStream`; fflate's inflate takes
3.0× the time of the WebAssembly one, the pure-JavaScript port 2.6×.

Alone, the WebAssembly backend deflates at level 6 in 1.47× the time of `CompressionStream` for
0.7 % more bytes and inflates 27 % faster than `DecompressionStream`. zip.js uses it by itself
when no `CompressionStream` exists or when a level other than the default is requested;
`useCompressionStream: false` selects it on every host, for an output that does not depend on
the host's zlib.

### Concurrent `add()` and the backends

8 files × 8 MB of text, 64 MB in one Node process (`benchmarks/bench-backends.js`), without
Web Workers unless noted. `add()` calls can be issued concurrently, and the table shows what
that buys with each backend.

| Configuration | Median time | Output | vs jszip |
|---|--:|--:|--:|
| node:zlib — `ZipEntry.create()` for every entry at once | **596 ms** | 19.6 MB | **9.6×** |
| **zip.js — `CompressionStream`, concurrent `add()`** | **602 ms** | 19.6 MB | **9.5×** |
| fflate — async (its own worker pool) | 757 ms | 20.0 MB | 7.6× |
| node:zlib — `ZipEntry.create()` one entry at a time | 2209 ms | 19.6 MB | 2.6× |
| zip.js — `CompressionStream`, sequential `add()` | 2257 ms | 19.6 MB | 2.5× |
| archiver — Node zlib | 2278 ms | 19.6 MB | 2.5× |
| fflate — `zipSync` (single thread) | 3191 ms | 20.0 MB | 1.8× |
| zip.js — WASM zlib, sequential `add()` | 3367 ms | 19.7 MB | 1.7× |
| zip.js — WASM zlib, concurrent `add()` | 3402 ms | 19.7 MB | 1.7× |
| zip.js — pure-JS zlib, sequential `add()` | 3868 ms | 19.7 MB | 1.5× |
| zip.js — pure-JS zlib, concurrent `add()` | 3930 ms | 19.7 MB | 1.5× |
| jszip (pako, single thread) | 5719 ms | 19.7 MB | 1.0× |

With the host's `CompressionStream`, zip.js goes from 2257 ms with sequential `add()` calls to
602 ms with concurrent ones, 3.7×, without Web Workers: Node runs `CompressionStream` off the
main thread, so the entries compress on several cores while the JavaScript thread only feeds
them. The ZIP API of `node:zlib` gets the same 3.7× from the same threadpool when its
`ZipEntry.create()` calls are issued at once, 2209 to 596 ms, the same time as zip.js within
noise; the difference is in memory, not time: `node:zlib` holds every compressed entry until
`createZipArchive()` serializes them, while zip.js writes each entry as its codec finishes.
fflate's async API, which runs its own worker pool, takes 757 ms on the same input; its output
is 2 % larger than the zlib rows, so it does slightly less work. The WebAssembly and
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
| Node.js v26.10.0 | 2.25 s | **0.62 s** | 0.59 s | 0.59 s |
| Bun 1.4.2 | 1.19 s | **0.26 s** | 1.20 s | 0.27 s |
| Deno 2.9.7 | 1.35 s | 1.35 s | 1.39 s | **0.37 s** |

- **Node** runs `CompressionStream` off the JavaScript thread, on the libuv threadpool, four
  threads by default (`UV_THREADPOOL_SIZE`): concurrent `add()` alone is 3.6× faster than
  sequential, and the chunk size changes nothing. Node has no `Worker` global, so
  `useWebWorkers` spawns nothing there and the entries run in-process, in the same time.
- **Bun** runs `CompressionStream` off the JavaScript thread only for writes larger than 128 KB
  (its native implementation, since Bun 1.4 in August 2026). With the 256 KB chunks zip.js
  writes by default, concurrent `add()` alone is 4.5× faster than sequential; with the 64 KB
  chunks that were the default up to version 2.18.2 it gains nothing, and `useWebWorkers: true`
  is 4.5× faster too.
- **Deno** runs `CompressionStream` on the JavaScript thread whatever the write size: concurrent
  `add()` alone gains nothing, `useWebWorkers: true` is 3.6× faster.

### Compression levels

Level 6 runs the host's `CompressionStream`, every other level the bundled WebAssembly zlib, so
whether a lower level buys speed depends on how fast the host's zlib is. The pure-JavaScript
column runs the same JavaScript on each engine. One 20 MB text entry, one thread:

| Runtime | level 6, `CompressionStream` | level 5, WASM zlib | level 5, pure-JS zlib | level 1, WASM zlib |
|---|--:|--:|--:|--:|
| Node.js v26.10.0 | 691 ms / 6.12 MB | 512 ms / 6.56 MB | 774 ms / 6.56 MB | 186 ms / 7.53 MB |
| Bun 1.4.2 | 430 ms / 6.20 MB | 465 ms / 6.56 MB | 665 ms / 6.56 MB | 166 ms / 7.53 MB |
| Deno 2.9.7 | 409 ms / 6.20 MB | 592 ms / 6.56 MB | 682 ms / 6.56 MB | 236 ms / 7.53 MB |

On Node, level 5 on the WebAssembly codec is 26 % faster than the default for 7 % more bytes.
On Bun and Deno the default is already faster than level 5, so level 5 there is slower and
larger; only level 1 buys speed on them, 61 % on Bun and 42 % on Deno, at 21 % more bytes. The
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
| Node.js v26.10.0 | 9.06 s | 9.10 s | 78.3 MB |
| Bun 1.4.2 | 4.74 s | 4.85 s | 79.4 MB |
| Deno 2.9.7 | 5.22 s | 5.21 s | 79.4 MB |
| Apple `gzip -6`, classic zlib | 12.4 to 12.5 s | | 78.9 MB |

zip.js is within 3 % of the raw stream on every runtime. On this file Bun's `CompressionStream`
takes 52 % of Node's time and Deno's 58 %, for about 1.4 % more bytes; Apple's gzip takes 1.4×
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
| WebAssembly, linked into the module of the WebAssembly builds | **134 / 135 MB/s** | **119 / 121** | 124 / 124 |
| JavaScript, the fallback of those builds and the engine of the native and core builds | 119 / 108 | 115 / 117 | **144 / 133** |
| 2.13.1, sjcl (measured on 2026-09-26, Node.js v26.7.0) | 26 / 26 | 28 / 28 | 20 / 19 |

The same measurement in a browser, through the Web Worker pool, on 32 MB of bytes generated in
the page (the corpus is not served to the browser), median of 3 passes
([`benchmarks/bench-aes.html`](benchmarks/bench-aes.html), which prints its result and writes no
file):

| Engine | Firefox 156 | Chrome 153 |
|---|--:|--:|
| WebAssembly | **125 / 125 MB/s** | **136 / 138** |
| JavaScript | 79 / 79 | 104 / 104 |
| 2.13.1, sjcl | 17 / 17 | 22 / 22 |

- The JavaScript engine is 4.1 to 4.7× sjcl on Node, Bun and in the two browsers, and 7.0 to
  7.2× on Deno, where sjcl was slowest. sjcl ran the cipher 16 bytes
  at a time through a bit-array layer; the new engine works on typed arrays and is fed whole
  chunks, with the AES rounds and the SHA-1 steps written out. Every build has it.
- The WebAssembly kernel is the same C code on every host, with the same rounds written out:
  119 to 135 MB/s on Node, Bun and Deno, 125 to 138 MB/s in the two browsers. The JavaScript
  engine is within 4 % of it on Bun and 20 % on Node, ahead of it on Deno, and 1.3 to 1.6×
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
npm install              # jszip, fflate, archiver (zip.js is used from the repository, node:zlib is built in)
npm run corpus           # generate the datasets under .corpus/
node bench.js            # the head-to-head tables: compress, decompress, disk streaming
node bench-backends.js   # the concurrent add() and backends table
node bench-codecs.js     # the codecs alone, sorted by output size
node bench-aes.js        # the AES engines; also: bun bench-aes.js, deno run -A bench-aes.js
node bench-runtimes.js   # the runtime tables; also: bun bench-runtimes.js, deno run -A bench-runtimes.js
```

Each script writes its JSON to `benchmarks/results/`; the `*-run.log` files there are the
console output of the runs behind this page. `RUNS=<n>` sets the number of repetitions (default
3, 5 in `bench-aes.js`). `QUICK=1` divides every workload by 8, runs each measurement once and
writes under `benchmarks/results/quick/`; the scripts then finish in seconds instead of minutes,
which is enough to check that they run and not enough to read a number from.
`ZIPJS_BUNDLE=<path to a previous index.min.js> node bench-aes.js` adds
the row of a previous release; `git show v2.13.1:index.min.js` gave the sjcl row. The browser
encryption table comes from `benchmarks/bench-aes.html`, served from the repository root
(`npx http-server -p 8080`, then `http://localhost:8080/benchmarks/bench-aes.html`), with
`?engine=js` for the JavaScript engine and `?bundle=zipjs-2.13.1.min.js` for a bundle copied next
to the page; it prints the median of its three passes and a JSON line.

Two more scripts feed no table on this page: `bench-crc.js` compares the two ways zip.js can
obtain the CRC-32 of an entry compressed by `CompressionStream`, and `bench-7z.js` compares
zip.js with the 7-Zip command line (`brew install sevenzip`, runs under Deno or Bun).
