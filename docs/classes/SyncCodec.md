[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SyncCodec

# Class: SyncCodec

Defined in: [index.d.ts:236](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L236)

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

> **append**(`data`): `Uint8Array`

Defined in: [index.d.ts:243](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L243)

Appends a chunk of decompressed data to compress

#### Parameters

##### data

`Uint8Array`

The chunk of decompressed data to append.

#### Returns

`Uint8Array`

A chunk of compressed data.
