[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipInflate

# Class: ZipInflate

Defined in: [index.d.ts:261](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L261)

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

> **flush**(): `void`

Defined in: [index.d.ts:265](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L265)

Flushes the data

#### Returns

`void`
