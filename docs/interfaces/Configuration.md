[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Configuration

# Interface: Configuration

Represents the configuration passed to [configure](../functions/configure.md).

## Extends

- [`WorkerConfiguration`](WorkerConfiguration.md)

## Properties

### chunkSize?

> `optional` **chunkSize**: `number`

The size of the chunks in bytes during data compression/decompression.

#### Default Value

```ts
524288
```

#### Defined in

[index.d.ts:101](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L101)

***

### CompressionStream?

> `optional` **CompressionStream**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

The stream implementation used to compress data when `useCompressionStream` is set to `false`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

#### Defined in

[index.d.ts:119](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L119)

***

### DecompressionStream?

> `optional` **DecompressionStream**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

The stream implementation used to decompress data when `useCompressionStream` is set to `false`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

#### Defined in

[index.d.ts:125](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L125)

***

### Deflate?

> `optional` **Deflate**: *typeof* [`ZipDeflate`](../classes/ZipDeflate.md)

The codec implementation used to compress data.

#### Default Value

[ZipDeflate](../classes/ZipDeflate.md)

#### Defined in

[index.d.ts:107](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L107)

***

### Inflate?

> `optional` **Inflate**: *typeof* [`ZipInflate`](../classes/ZipInflate.md)

The codec implementation used to decompress data.

#### Default Value

[ZipInflate](../classes/ZipInflate.md)

#### Defined in

[index.d.ts:113](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L113)

***

### maxWorkers?

> `optional` **maxWorkers**: `number`

The maximum number of web workers used to compress/decompress data simultaneously.

#### Default Value

`navigator.hardwareConcurrency`

#### Defined in

[index.d.ts:49](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L49)

***

### terminateWorkerTimeout?

> `optional` **terminateWorkerTimeout**: `number`

The delay in milliseconds before idle web workers are automatically terminated. You can call `terminateWorkers()` to terminate idle workers.

#### Default Value

```ts
5000
```

#### Defined in

[index.d.ts:55](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L55)

***

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useCompressionStream`](WorkerConfiguration.md#usecompressionstream)

#### Defined in

[index.d.ts:143](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L143)

***

### useWebWorkers?

> `optional` **useWebWorkers**: `boolean`

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

#### Defined in

[index.d.ts:137](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L137)

***

### workerScripts?

> `optional` **workerScripts**: `object`

The URIs of the compression/decompression scripts run in web workers.

It allows using alternative deflate implementations or specifying a URL to the worker script if the CSP of the page blocks scripts imported from a Blob URI.
The properties `deflate` and `inflate` must specify arrays of URLs to import the deflate/inflate web workers, respectively.
The first URL is relative to the base URI of the document. The other URLs are relative to the URL of the first script. Scripts in the array are executed in order.
If you only use deflation or inflation, the unused `deflate`/`inflate` property can be omitted.

Here is an example:
```
configure({
  workerScripts: {
    deflate: ["library_path/custom-worker.js", "./custom-deflate.js"],
    inflate: ["library_path/custom-worker.js", "./custom-inflate.js"]
  }
});
```

If the CSP of the page blocks scripts imported from a Blob URI you can use `z-worker.js` from https://github.com/gildas-lormeau/zip.js/tree/master/dist and specify the URL where it can be found.

Here is an example:
```
configure({
  workerScripts: {
    deflate: ["library_path/z-worker.js"],
    inflate: ["library_path/z-worker.js"]
  }
});
```

#### deflate?

> `optional` **deflate**: `string`[]

The URIs of the scripts implementing used for compression.

#### inflate?

> `optional` **inflate**: `string`[]

The URIs of the scripts implementing used for decompression.

#### Defined in

[index.d.ts:86](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L86)
