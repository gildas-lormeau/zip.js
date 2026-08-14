[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / createBlobTempStream

# Function: createBlobTempStream()

> **createBlobTempStream**(`options?`): () => [`TempStream`](../interfaces/TempStream.md)

Defined in: [index.d.ts:575](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L575)

Builds a [ZipWriterConstructorOptions.createTempStream](../interfaces/ZipWriterConstructorOptions.md#createtempstream) factory that spills the data of buffered entries into a `Blob` instead of keeping it in memory.

An entry stays in memory until it exceeds `thresholdBytes`, then its data is transferred incrementally into a `Blob` built with `new Response(stream).blob()` and streamed back afterwards.
In Chromium-based browsers, `Blob` data is managed outside the page and paged to disk under memory pressure, so peak memory stays bounded on large buffered entries without any storage permission or cleanup obligation.
In Firefox, the `Blob` stays in memory but the helper still reduces peak memory usage moderately (roughly 30% on large entries) by releasing staged chunks earlier.
In Safari, building the `Blob` retains several copies of the staged data (roughly 4 times the entry size at peak); do not use this helper there.
In non-browser runtimes, the helper stays functional but roughly doubles peak memory usage (staged bytes plus their `Blob` copy).
Outside Chromium-based browsers, prefer [createOPFSTempStream](createOPFSTempStream.md) or a file-backed implementation.

## Parameters

### options?

[`BlobTempStreamOptions`](../interfaces/BlobTempStreamOptions.md)

The options.

## Returns

A factory suitable for [ZipWriterConstructorOptions.createTempStream](../interfaces/ZipWriterConstructorOptions.md#createtempstream).

() => [`TempStream`](../interfaces/TempStream.md)
