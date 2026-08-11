[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WorkerConfiguration

# Interface: WorkerConfiguration

Defined in: [index.d.ts:358](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L358)

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

Defined in: [index.d.ts:376](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L376)

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

***

### useCompressionStream?

> `optional` **useCompressionStream?**: `boolean`

Defined in: [index.d.ts:370](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L370)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

Defined in: [index.d.ts:364](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L364)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```
