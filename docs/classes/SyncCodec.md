[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SyncCodec

# Class: SyncCodec

Defined in: [index.d.ts:396](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L396)

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

> **append**(`data`): `Uint8Array`

Defined in: [index.d.ts:403](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L403)

Appends a chunk of decompressed data to compress

#### Parameters

##### data

`Uint8Array`

The chunk of decompressed data to append.

#### Returns

`Uint8Array`

A chunk of compressed data.
