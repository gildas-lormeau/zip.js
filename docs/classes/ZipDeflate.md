[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDeflate

# Class: ZipDeflate

Defined in: [index.d.ts:249](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L249)

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

#### Inherited from

[`SyncCodec`](SyncCodec.md).[`append`](SyncCodec.md#append)

***

### flush()

> **flush**(): `Uint8Array`

Defined in: [index.d.ts:255](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L255)

Flushes the data

#### Returns

`Uint8Array`

A chunk of compressed data.
