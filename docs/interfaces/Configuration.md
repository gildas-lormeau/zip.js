[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Configuration

# Interface: Configuration

Defined in: [index.d.ts:262](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L262)

Represents the configuration passed to [configure](../functions/configure.md).

## Extends

- [`WorkerConfiguration`](WorkerConfiguration.md)

## Properties

### chunkSize?

> `optional` **chunkSize?**: `number`

Defined in: [index.d.ts:320](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L320)

The size of the chunks in bytes during data compression/decompression.

#### Default Value

```ts
65536
```

***

### CompressionStream?

> `optional` **CompressionStream?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:326](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L326)

The stream implementation used to compress data when `useCompressionStream` is set to `true`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### CompressionStreamZlib?

> `optional` **CompressionStreamZlib?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:338](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L338)

The stream implementation used to compress data when `useCompressionStream` is set to `false`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### DecompressionStream?

> `optional` **DecompressionStream?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:332](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L332)

The stream implementation used to decompress data when `useCompressionStream` is set to `true`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### DecompressionStreamZlib?

> `optional` **DecompressionStreamZlib?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:344](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L344)

The stream implementation used to decompress data when `useCompressionStream` is set to `false`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### maxWorkers?

> `optional` **maxWorkers?**: `number`

Defined in: [index.d.ts:268](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L268)

The maximum number of web workers used to compress/decompress data simultaneously.

#### Default Value

`navigator.hardwareConcurrency`

***

### terminateWorkerTimeout?

> `optional` **terminateWorkerTimeout?**: `number`

Defined in: [index.d.ts:274](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L274)

The delay in milliseconds before idle web workers are automatically terminated. You can call `terminateWorkers()` to terminate idle workers.

#### Default Value

```ts
5000
```

***

### transferStreams?

> `optional` **transferStreams?**: `boolean`

Defined in: [index.d.ts:368](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L368)

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`transferStreams`](WorkerConfiguration.md#transferstreams)

***

### useCompressionStream?

> `optional` **useCompressionStream?**: `boolean`

Defined in: [index.d.ts:362](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L362)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useCompressionStream`](WorkerConfiguration.md#usecompressionstream)

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

Defined in: [index.d.ts:356](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L356)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

***

### wasmURI?

> `optional` **wasmURI?**: `string`

Defined in: [index.d.ts:314](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L314)

The URI of the WebAssembly module used by default implementations to compress/decompress data. It is ignored if `useCompressionStream` is set to `true` and `CompressionStream`/`DecompressionStream` are supported by the environment.

Here is an example to import the WASM module as a URL (see `?url`) and avoid CSP issues:
```
import wasmURI from "@zip.js/zip.js/dist/zip-module.wasm?url";

configure({
  wasmURI
});
```

#### Default Value

```ts
"./core/streams/zlib-wasm/zlib-streams.wasm"
```

***

### workerStarvationTimeout?

> `optional` **workerStarvationTimeout?**: `number`

Defined in: [index.d.ts:282](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L282)

The delay in milliseconds after which the oldest pending compression/decompression task is run without a web worker when no task completes.

It prevents deadlocks when entries read from a `ZipReader` are added concurrently into a `ZipWriter` and all the web workers are waiting for data.

#### Default Value

```ts
5000
```

***

### workerURI?

> `optional` **workerURI?**: `string`

Defined in: [index.d.ts:299](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L299)

The URI of the web worker.

It allows using alternative deflate implementations or specifying a URL to the worker script if the CSP of the page blocks scripts imported from a Data URI.

Here is an example to import the worker module as a URL (see `?url`) and avoid CSP issues:
```
import workerURI from "@zip.js/zip.js/dist/zip-web-worker.js?url";

configure({
  workerURI
});
```

#### Default Value

```ts
"./core/web-worker.js"
```
