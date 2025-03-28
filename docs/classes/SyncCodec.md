[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SyncCodec

# Class: SyncCodec

Defined in: [index.d.ts:236](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L236)

## Extended by

- [`ZipDeflate`](ZipDeflate.md)
- [`ZipInflate`](ZipInflate.md)

## Constructors

### Constructor

> **new SyncCodec**(): `SyncCodec`

#### Returns

`SyncCodec`

## Methods

### append()

> **append**(`data`): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:243](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L243)

Appends a chunk of decompressed data to compress

#### Parameters

##### data

`Uint8Array`\<`ArrayBuffer`\>

The chunk of decompressed data to append.

#### Returns

`Uint8Array`\<`ArrayBuffer`\>

A chunk of compressed data.
