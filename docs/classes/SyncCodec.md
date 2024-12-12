[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SyncCodec

# Class: SyncCodec

## Extended by

- [`ZipDeflate`](ZipDeflate.md)
- [`ZipInflate`](ZipInflate.md)

## Constructors

### new SyncCodec()

> **new SyncCodec**(): [`SyncCodec`](SyncCodec.md)

#### Returns

[`SyncCodec`](SyncCodec.md)

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

#### Defined in

[index.d.ts:243](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L243)
