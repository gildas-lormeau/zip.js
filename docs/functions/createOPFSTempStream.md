[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / createOPFSTempStream

# Function: createOPFSTempStream()

> **createOPFSTempStream**(`options?`): () => `Promise`\<[`TempStream`](../interfaces/TempStream.md)\>

Defined in: [index.d.ts:441](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L441)

Builds a [ZipWriterConstructorOptions.createTempStream](../interfaces/ZipWriterConstructorOptions.md#createtempstream) factory that spills the data of buffered entries to the Origin Private File System (OPFS) instead of keeping it in memory.

An entry stays in memory until it exceeds `thresholdBytes`, then spills to a temporary OPFS file that is streamed back and deleted afterwards, so peak memory stays bounded on large buffered entries.

OPFS is a browser/worker feature; feature-detect `navigator.storage.getDirectory` (or pass `getDirectory`) before using it, and let the writer use its in-memory default elsewhere.

## Parameters

### options?

[`OPFSTempStreamOptions`](../interfaces/OPFSTempStreamOptions.md)

The options.

## Returns

A factory suitable for [ZipWriterConstructorOptions.createTempStream](../interfaces/ZipWriterConstructorOptions.md#createtempstream).

() => `Promise`\<[`TempStream`](../interfaces/TempStream.md)\>
