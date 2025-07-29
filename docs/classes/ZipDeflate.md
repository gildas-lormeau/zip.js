[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDeflate

# Class: ZipDeflate

Defined in: [index.d.ts:409](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L409)

Represents an instance used to compress data.

## Extends

- [`SyncCodec`](SyncCodec.md)

## Constructors

### Constructor

> **new ZipDeflate**(): `ZipDeflate`

#### Returns

`ZipDeflate`

#### Inherited from

[`SyncCodec`](SyncCodec.md).[`constructor`](SyncCodec.md#constructor)

## Methods

### append()

> **append**(`data`): `Uint8Array`

Defined in: [index.d.ts:403](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L403)

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

Defined in: [index.d.ts:415](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L415)

Flushes the data

#### Returns

`Uint8Array`

A chunk of compressed data.
