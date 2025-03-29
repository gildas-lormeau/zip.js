[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDeflate

# Class: ZipDeflate

Defined in: [index.d.ts:249](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L249)

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

> **append**(`data`): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:243](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L243)

Appends a chunk of decompressed data to compress

#### Parameters

##### data

`Uint8Array`\<`ArrayBuffer`\>

The chunk of decompressed data to append.

#### Returns

`Uint8Array`\<`ArrayBuffer`\>

A chunk of compressed data.

#### Inherited from

[`SyncCodec`](SyncCodec.md).[`append`](SyncCodec.md#append)

***

### flush()

> **flush**(): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:255](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L255)

Flushes the data

#### Returns

`Uint8Array`\<`ArrayBuffer`\>

A chunk of compressed data.
