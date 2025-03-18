[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EventBasedCodec

# Class: EventBasedCodec

Defined in: [index.d.ts:203](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L203)

Represents an event-based implementation of a third-party codec.

## Constructors

### new EventBasedCodec()

> **new EventBasedCodec**(): [`EventBasedCodec`](EventBasedCodec.md)

#### Returns

[`EventBasedCodec`](EventBasedCodec.md)

## Methods

### ondata()

> **ondata**(`data`?): `void`

Defined in: [index.d.ts:215](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L215)

The function called when a chunk of data has been compressed/decompressed.

#### Parameters

##### data?

`Uint8Array`

The chunk of compressed/decompressed data.

#### Returns

`void`

***

### push()

> **push**(`data`): `void`

Defined in: [index.d.ts:209](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L209)

Appends a chunk of data to compress/decompress

#### Parameters

##### data

`Uint8Array`

The chunk of data to append.

#### Returns

`void`
