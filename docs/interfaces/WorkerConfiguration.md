[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WorkerConfiguration

# Interface: WorkerConfiguration

Defined in: [index.d.ts:388](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L388)

Represents configuration passed to [configure](../functions/configure.md), the constructor of [ZipReader](../classes/ZipReader.md), [FileEntry#getData](FileEntry.md#getdata), the constructor of [ZipWriter](../classes/ZipWriter.md), and [ZipWriter#add](../classes/ZipWriter.md#add).

## Extended by

- [`Configuration`](Configuration.md)
- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`EntryGetDataOptions`](EntryGetDataOptions.md)
- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md)

## Properties

### transferStreams?

> `optional` **transferStreams?**: `boolean`

Defined in: [index.d.ts:408](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L408)

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

***

### useCompressionStream?

> `optional` **useCompressionStream?**: `boolean`

Defined in: [index.d.ts:402](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L402)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

When compressing, the native API is only used when `level` is undefined or equal to 6, see [ZipWriterConstructorOptions#level](ZipWriterConstructorOptions.md#level).

#### Default Value

```ts
true
```

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

Defined in: [index.d.ts:394](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L394)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```
