[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WorkerConfiguration

# Interface: WorkerConfiguration

Defined in: [index.d.ts:367](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L367)

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

Defined in: [index.d.ts:385](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L385)

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

***

### useCompressionStream?

> `optional` **useCompressionStream?**: `boolean`

Defined in: [index.d.ts:379](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L379)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

Defined in: [index.d.ts:373](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L373)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```
