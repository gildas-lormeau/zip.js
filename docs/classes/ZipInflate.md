[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipInflate

# Class: ZipInflate

Defined in: [index.d.ts:261](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L261)

Represents a codec used to decompress data.

## Extends

- [`SyncCodec`](SyncCodec.md)

## Constructors

### new ZipInflate()

> **new ZipInflate**(): [`ZipInflate`](ZipInflate.md)

#### Returns

[`ZipInflate`](ZipInflate.md)

#### Inherited from

[`SyncCodec`](SyncCodec.md).[`constructor`](SyncCodec.md#constructors)

## Methods

### append()

> **append**(`data`): `Uint8Array`

Defined in: [index.d.ts:243](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L243)

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

> **flush**(): `void`

Defined in: [index.d.ts:265](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L265)

Flushes the data

#### Returns

`void`
