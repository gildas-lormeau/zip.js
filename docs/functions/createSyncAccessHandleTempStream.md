[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / createSyncAccessHandleTempStream

# Function: createSyncAccessHandleTempStream()

> **createSyncAccessHandleTempStream**(`options?`): () => [`TempStream`](../interfaces/TempStream.md)

Defined in: [index.d.ts:587](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L587)

Builds a [ZipWriterConstructorOptions.createTempStream](../interfaces/ZipWriterConstructorOptions.md#createtempstream) factory that spills the data of buffered entries to the Origin Private File System (OPFS) via `FileSystemSyncAccessHandle` instead of keeping it in memory.

This is the fastest disk-backed temporary storage on the web platform: it behaves like [createOPFSTempStream](createOPFSTempStream.md) (same options, same bounded-memory profile) but writes roughly 2.5 times faster in Chromium and Firefox and reads back several times faster in Firefox and Safari, making disk-backed staging nearly as fast as the in-memory default.

`FileSystemSyncAccessHandle` is only exposed in dedicated workers, so this helper requires running the [ZipWriter](../classes/ZipWriter.md) inside a worker; it throws when created in an unsupported context unless `getDirectory` is provided.

## Parameters

### options?

[`OPFSTempStreamOptions`](../interfaces/OPFSTempStreamOptions.md)

The options.

## Returns

A factory suitable for [ZipWriterConstructorOptions.createTempStream](../interfaces/ZipWriterConstructorOptions.md#createtempstream).

() => [`TempStream`](../interfaces/TempStream.md)
