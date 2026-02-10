[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Configuration

# Interface: Configuration

Defined in: [index.d.ts:203](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L203)

Represents the configuration passed to [configure](../functions/configure.md).

## Extends

- [`WorkerConfiguration`](WorkerConfiguration.md)

## Properties

### chunkSize?

> `optional` **chunkSize**: `number`

Defined in: [index.d.ts:253](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L253)

The size of the chunks in bytes during data compression/decompression.

#### Default Value

```ts
65536
```

***

### CompressionStream?

> `optional` **CompressionStream**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:259](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L259)

The stream implementation used to compress data when `useCompressionStream` is set to `true`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### CompressionStreamZlib?

> `optional` **CompressionStreamZlib**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:271](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L271)

The stream implementation used to compress data when `useCompressionStream` is set to `false`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### DecompressionStream?

> `optional` **DecompressionStream**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:265](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L265)

The stream implementation used to decompress data when `useCompressionStream` is set to `true`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### DecompressionStreamZlib?

> `optional` **DecompressionStreamZlib**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:277](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L277)

The stream implementation used to decompress data when `useCompressionStream` is set to `false`.

#### Default Value

[CodecStream](../classes/CodecStream.md)

***

### maxWorkers?

> `optional` **maxWorkers**: `number`

Defined in: [index.d.ts:209](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L209)

The maximum number of web workers used to compress/decompress data simultaneously.

#### Default Value

`navigator.hardwareConcurrency`

***

### terminateWorkerTimeout?

> `optional` **terminateWorkerTimeout**: `number`

Defined in: [index.d.ts:215](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L215)

The delay in milliseconds before idle web workers are automatically terminated. You can call `terminateWorkers()` to terminate idle workers.

#### Default Value

```ts
5000
```

***

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

Defined in: [index.d.ts:295](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L295)

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

Defined in: [index.d.ts:289](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L289)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

***

### wasmURI?

> `optional` **wasmURI**: `string`

Defined in: [index.d.ts:247](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L247)

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

### workerURI?

> `optional` **workerURI**: `string`

Defined in: [index.d.ts:232](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L232)

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
