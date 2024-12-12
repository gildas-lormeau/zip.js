[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderStream

# Class: ZipReaderStream\<T\>

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

Creates the stream.

#### Parameters

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

[`ZipReaderStream`](ZipReaderStream.md)\<`T`\>

#### Defined in

[index.d.ts:654](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L654)

## Properties

### readable

> **readable**: `ReadableStream`\<`Omit`\<[`Entry`](../interfaces/Entry.md), `"getData"`\> & `object`\>

The readable stream.

#### Defined in

[index.d.ts:659](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L659)

***

### writable

> **writable**: `WritableStream`\<`T`\>

The writable stream.

#### Defined in

[index.d.ts:666](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L666)
