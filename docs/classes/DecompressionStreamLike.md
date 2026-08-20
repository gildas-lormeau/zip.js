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
