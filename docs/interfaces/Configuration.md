[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Configuration

# Interface: Configuration

Defined in: [index.d.ts:271](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L271)

Represents the configuration passed to [configure](../functions/configure.md).

## Extends

- [`WorkerConfiguration`](WorkerConfiguration.md)

## Properties

### chunkSize?

> `optional` **chunkSize?**: `number`

Defined in: [index.d.ts:350](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L350)

The size of the chunks in bytes during data compression/decompression.

#### Default Value

```ts
65536
```

***

### CompressionStream?

> `optional` **CompressionStream?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:356](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L356)

The stream implementation used to compress data when `useCompressionStream` is set to `true`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### CompressionStreamFallback?

> `optional` **CompressionStreamFallback?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:368](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L368)

The stream implementation used to compress data when `useCompressionStream` is set to `false`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### ~~CompressionStreamZlib?~~

> `optional` **CompressionStreamZlib?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:378](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L378)

#### Deprecated

Use [Configuration#CompressionStreamFallback](#compressionstreamfallback) instead.

***

### createWorker?

> `optional` **createWorker?**: () => `Worker`

Defined in: [index.d.ts:329](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L329)

The function used to create the web workers, taking precedence over `workerURI`.

It lets bundlers detect the worker script statically and compile it with its imports, e.g. a custom worker script embedding alternative compression streams.

Here is an example with a custom worker script (see [initWorker](../functions/initWorker.md) for the content of the script):
```
configure({
  createWorker: () => new Worker(new URL("./zip-worker.js", import.meta.url), { type: "module" })
});
```

#### Returns

`Worker`

***

### DecompressionStream?

> `optional` **DecompressionStream?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:362](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L362)

The stream implementation used to decompress data when `useCompressionStream` is set to `true`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### DecompressionStreamFallback?

> `optional` **DecompressionStreamFallback?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:374](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L374)

The stream implementation used to decompress data when `useCompressionStream` is set to `false`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### ~~DecompressionStreamZlib?~~

> `optional` **DecompressionStreamZlib?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:382](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L382)

#### Deprecated

Use [Configuration#DecompressionStreamFallback](#decompressionstreamfallback) instead.

***

### maxWorkers?

> `optional` **maxWorkers?**: `number`

Defined in: [index.d.ts:277](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L277)

The maximum number of web workers used to compress/decompress data simultaneously.

#### Default Value

`navigator.hardwareConcurrency`

***

### terminateWorkerTimeout?

> `optional` **terminateWorkerTimeout?**: `number`

Defined in: [index.d.ts:283](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L283)

The delay in milliseconds before idle web workers are automatically terminated. You can call `terminateWorkers()` to terminate idle workers.

#### Default Value

```ts
5000
```

***

### transferStreams?

> `optional` **transferStreams?**: `boolean`

Defined in: [index.d.ts:406](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L406)

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

Defined in: [index.d.ts:400](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L400)

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

Defined in: [index.d.ts:394](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L394)

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

Defined in: [index.d.ts:344](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L344)

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

### workerStartupTimeout?

> `optional` **workerStartupTimeout?**: `number`

Defined in: [index.d.ts:299](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L299)

The delay in milliseconds before a newly created web worker which has not sent any message is considered dead, terminated, and replaced with inline processing.

It allows recovering from environments where web workers fail silently, e.g. extension pages blocking worker scripts via their Content Security Policy.

#### Default Value

```ts
5000
```

***

### workerStarvationTimeout?

> `optional` **workerStarvationTimeout?**: `number`

Defined in: [index.d.ts:291](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L291)

The delay in milliseconds after which the oldest pending compression/decompression task is run without a web worker when no task completes.

It prevents deadlocks when entries read from a `ZipReader` are added concurrently into a `ZipWriter` and all the web workers are waiting for data.

#### Default Value

```ts
5000
```

***

### workerURI?

> `optional` **workerURI?**: `string`

Defined in: [index.d.ts:316](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L316)

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
