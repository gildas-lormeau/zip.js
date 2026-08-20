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
