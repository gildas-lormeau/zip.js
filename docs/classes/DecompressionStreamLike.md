[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / DecompressionStreamLike

# Class: DecompressionStreamLike

Represents a generic class decompressing data, e.g. the native `DecompressionStream` class.

## Extends

- [`TransformStreamLike`](TransformStreamLike.md)

## Constructors

### Constructor

> **new DecompressionStreamLike**(`format`, `options?`): `DecompressionStreamLike`

Creates the stream

#### Parameters

##### format

`string`

The decompression format.

##### options?

[`DecompressionStreamOptions`](../interfaces/DecompressionStreamOptions.md)

The options.

#### Returns

`DecompressionStreamLike`

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
The library then waits for the module before constructing the class, and uses `DecompressionStream`
instead when the module fails to load.

***

### supportedFormats?

> `static` `optional` **supportedFormats?**: `string`[]

The formats the class supports, e.g. `["deflate-raw", "deflate64-raw"]`. When it is declared, the library
reads it instead of probing a format by constructing the class, which a class that requires a module cannot
afford.
