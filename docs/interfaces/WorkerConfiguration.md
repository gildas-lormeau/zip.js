[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WorkerConfiguration

# Interface: WorkerConfiguration

Defined in: [index.d.ts:131](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L131)

Represents configuration passed to [configure](../functions/configure.md), the constructor of [ZipReader](../classes/ZipReader.md), [Entry#getData](Entry.md#getdata), the constructor of [ZipWriter](../classes/ZipWriter.md), and [ZipWriter#add](../classes/ZipWriter.md#add).

## Extended by

- [`Configuration`](Configuration.md)
- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`EntryGetDataOptions`](EntryGetDataOptions.md)
- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)

## Properties

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

Defined in: [index.d.ts:143](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L143)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

***

### useWebWorkers?

> `optional` **useWebWorkers**: `boolean`

Defined in: [index.d.ts:137](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L137)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```
