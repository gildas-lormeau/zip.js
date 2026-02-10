[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WorkerConfiguration

# Interface: WorkerConfiguration

Defined in: [index.d.ts:283](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L283)

Represents configuration passed to [configure](../functions/configure.md), the constructor of [ZipReader](../classes/ZipReader.md), [FileEntry#getData](FileEntry.md#getdata), the constructor of [ZipWriter](../classes/ZipWriter.md), and [ZipWriter#add](../classes/ZipWriter.md#add).

## Extended by

- [`Configuration`](Configuration.md)
- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`EntryGetDataOptions`](EntryGetDataOptions.md)
- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md)

## Properties

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

Defined in: [index.d.ts:295](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L295)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

***

### useWebWorkers?

> `optional` **useWebWorkers**: `boolean`

Defined in: [index.d.ts:289](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L289)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```
