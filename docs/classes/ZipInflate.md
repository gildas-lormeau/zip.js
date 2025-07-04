[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipInflate

# Class: ZipInflate

Defined in: [index.d.ts:421](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L421)

Represents a codec used to decompress data.

## Extends

- [`SyncCodec`](SyncCodec.md)

## Constructors

### Constructor

> **new ZipInflate**(): `ZipInflate`

#### Returns

`ZipInflate`

#### Inherited from

[`SyncCodec`](SyncCodec.md).[`constructor`](SyncCodec.md#constructor)

## Methods

### append()

> **append**(`data`): `Uint8Array`

Defined in: [index.d.ts:403](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L403)

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

Defined in: [index.d.ts:425](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L425)

Flushes the data

#### Returns

`void`
