[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Configuration

# Interface: Configuration

Defined in: [index.d.ts:203](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L203)

Represents the configuration passed to [configure](../functions/configure.md).

## Extends

- [`WorkerConfiguration`](WorkerConfiguration.md)

## Properties

### chunkSize?

> `optional` **chunkSize**: `number`

Defined in: [index.d.ts:261](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L261)

The size of the chunks in bytes during data compression/decompression.

#### Default Value

```ts
524288
```

***

### CompressionStream?

> `optional` **CompressionStream**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:279](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L279)

The stream implementation used to compress data when `useCompressionStream` is set to `false`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### DecompressionStream?

> `optional` **DecompressionStream**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:285](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L285)

The stream implementation used to decompress data when `useCompressionStream` is set to `false`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### Deflate?

> `optional` **Deflate**: *typeof* [`ZipDeflate`](../classes/ZipDeflate.md)

Defined in: [index.d.ts:267](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L267)

The codec implementation used to compress data.

#### Default Value

[ZipDeflate](../classes/ZipDeflate.md)

***

### Inflate?

> `optional` **Inflate**: *typeof* [`ZipInflate`](../classes/ZipInflate.md)

Defined in: [index.d.ts:273](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L273)

The codec implementation used to decompress data.

#### Default Value

[ZipInflate](../classes/ZipInflate.md)

***

### maxWorkers?

> `optional` **maxWorkers**: `number`

Defined in: [index.d.ts:209](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L209)

The maximum number of web workers used to compress/decompress data simultaneously.

#### Default Value

`navigator.hardwareConcurrency`

***

### terminateWorkerTimeout?

> `optional` **terminateWorkerTimeout**: `number`

Defined in: [index.d.ts:215](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L215)

The delay in milliseconds before idle web workers are automatically terminated. You can call `terminateWorkers()` to terminate idle workers.

#### Default Value

```ts
5000
```

***

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

Defined in: [index.d.ts:303](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L303)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useCompressionStream`](WorkerConfiguration.md#usecompressionstream)

***

### useWebWorkers?

> `optional` **useWebWorkers**: `boolean`

Defined in: [index.d.ts:297](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L297)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

***

### workerScripts?

> `optional` **workerScripts**: `object`

Defined in: [index.d.ts:246](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L246)

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
