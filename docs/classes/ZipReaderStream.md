[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderStream

# Class: ZipReaderStream\<T\>

Represents an instance used to create an unzipped stream.

## Remarks

The input is entirely read into a `Blob` before the first entry is emitted, because a zip file stores its
central directory at the end. This class is a convenience wrapper around [ZipReader](ZipReader.md) for stream
sources, it does not extract entries while the data is still arriving.

## Example

This example will take a zip file, decompress it and then save its files and directories to disk.
```
import {resolve} from "https://deno.land/std/path/mod.ts";
import {ensureDir, ensureFile} from "https://deno.land/std/fs/mod.ts";

for await (const entry of (await fetch(urlToZippedFile)).body.pipeThrough(new ZipReaderStream())) {
  const fullPath = resolve(destination, entry.filename);
  if (entry.directory) {
    await ensureDir(fullPath);
    continue;
  }

  await ensureFile(fullPath);
  await entry.readable?.pipeTo((await Deno.create(fullPath)).writable);
}
```

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new ZipReaderStream**\<`T`\>(`options?`): `ZipReaderStream`\<`T`\>

Creates the stream.

#### Parameters

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`ZipReaderStream`\<`T`\>

## Properties

### readable

> **readable**: `ReadableStream`\<`Omit`\<[`Entry`](../type-aliases/Entry.md), `"getData"`\> & `object`\>

The readable stream.

#### Remarks

The properties deposited on an entry while its data is read, i.e.
[EntryMetaData#warnings](../interfaces/EntryMetaData.md#warnings) and [EntryMetaData#localDirectory](../interfaces/EntryMetaData.md#localdirectory), are shared with the
chunk, so they are readable on it once its `readable` property has been consumed.

An entry is decompressed on demand, when its `readable` property starts being read, so a chunk
whose data is never read costs nothing and skipping entries is free. Cancelling this stream
releases the entry being read, cancels the source and closes the underlying [ZipReader](ZipReader.md).

***

### writable

> **writable**: `WritableStream`\<`T`\>

The writable stream.
