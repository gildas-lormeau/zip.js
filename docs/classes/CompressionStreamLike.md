[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CompressionStreamLike

# Class: CompressionStreamLike

Represents a generic class compressing data, e.g. the native `CompressionStream` class.

## Extends

- [`TransformStreamLike`](TransformStreamLike.md)

## Constructors

### Constructor

> **new CompressionStreamLike**(`format`, `options?`): `CompressionStreamLike`

Creates the stream

#### Parameters

##### format

`string`

The compression format.

##### options?

[`CompressionStreamOptions`](../interfaces/CompressionStreamOptions.md)

The options.

#### Returns

`CompressionStreamLike`

#### Overrides

[`TransformStreamLike`](TransformStreamLike.md).[`constructor`](TransformStreamLike.md#constructor)

## Properties

### readable

> **readable**: `ReadableStream`

The readable stream.

#### Inherited from

[`TransformStreamLike`](TransformStreamLike.md).[`readable`](TransformStreamLike.md#readable)

***

### writable

> **writable**: `WritableStream`

The writable stream.

#### Inherited from

[`TransformStreamLike`](TransformStreamLike.md).[`writable`](TransformStreamLike.md#writable)

***

### requiresModule?

> `static` `optional` **requiresModule?**: `boolean`

`true` when the class cannot be constructed before the module the entry point loads is ready, i.e. the
WebAssembly module of zip.js or the module loaded by the `init` function passed to [initWorker](../functions/initWorker.md).
The library then waits for the module before constructing the class, uses `CompressionStream` instead when
the module fails to load, and constructs the class with the `"gzip"` format in order to read the CRC-32 of
the data from the trailer, so the class must support that format.

***

### supportedFormats?

> `static` `optional` **supportedFormats?**: `string`[]

The formats the class supports, e.g. `["deflate-raw", "gzip"]`. When it is declared, the library reads it
instead of probing a format by constructing the class, which a class that requires a module cannot afford.
