[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderStream

# Class: ZipReaderStream\<T\>

Defined in: [index.d.ts:648](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L648)

Represents an instance used to create an unzipped stream.

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

• **T**

## Constructors

### new ZipReaderStream()

> **new ZipReaderStream**\<`T`\>(`options`?): [`ZipReaderStream`](ZipReaderStream.md)\<`T`\>

Defined in: [index.d.ts:654](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L654)

Creates the stream.

#### Parameters

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

[`ZipReaderStream`](ZipReaderStream.md)\<`T`\>

## Properties

### readable

> **readable**: `ReadableStream`\<`Omit`\<[`Entry`](../interfaces/Entry.md), `"getData"`\> & `object`\>

Defined in: [index.d.ts:659](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L659)

The readable stream.

***

### writable

> **writable**: `WritableStream`\<`T`\>

Defined in: [index.d.ts:666](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L666)

The writable stream.
