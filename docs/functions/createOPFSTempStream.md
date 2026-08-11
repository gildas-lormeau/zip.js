[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / createOPFSTempStream

# Function: createOPFSTempStream()

> **createOPFSTempStream**(`options?`): () => `Promise`\<[`TempStream`](../interfaces/TempStream.md)\>

Defined in: [index.d.ts:458](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L458)

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
