[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDeflate

# Class: ZipDeflate

Represents an instance used to compress data.

## Extends

- [`SyncCodec`](SyncCodec.md)

## Constructors

### new ZipDeflate()

> **new ZipDeflate**(): [`ZipDeflate`](ZipDeflate.md)

#### Returns

[`ZipDeflate`](ZipDeflate.md)

#### Inherited from

[`SyncCodec`](SyncCodec.md).[`constructor`](SyncCodec.md#constructors)

## Methods

### append()

> **append**(`data`): `Uint8Array`\<`ArrayBufferLike`\>

Appends a chunk of decompressed data to compress

#### Parameters

##### data

`Uint8Array`\<`ArrayBufferLike`\>

The chunk of decompressed data to append.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

A chunk of compressed data.

#### Inherited from

[`SyncCodec`](SyncCodec.md).[`append`](SyncCodec.md#append)

#### Defined in

[index.d.ts:243](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L243)

***

### flush()

> **flush**(): `Uint8Array`\<`ArrayBufferLike`\>

Flushes the data

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

A chunk of compressed data.

#### Defined in

[index.d.ts:255](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L255)
