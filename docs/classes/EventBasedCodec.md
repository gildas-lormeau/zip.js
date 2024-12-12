[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EventBasedCodec

# Class: EventBasedCodec

Represents an event-based implementation of a third-party codec.

## Constructors

### new EventBasedCodec()

> **new EventBasedCodec**(): [`EventBasedCodec`](EventBasedCodec.md)

#### Returns

[`EventBasedCodec`](EventBasedCodec.md)

## Methods

### ondata()

> **ondata**(`data`?): `void`

The function called when a chunk of data has been compressed/decompressed.

#### Parameters

##### data?

`Uint8Array`\<`ArrayBufferLike`\>

The chunk of compressed/decompressed data.

#### Returns

`void`

#### Defined in

[index.d.ts:215](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L215)

***

### push()

> **push**(`data`): `void`

Appends a chunk of data to compress/decompress

#### Parameters

##### data

`Uint8Array`\<`ArrayBufferLike`\>

The chunk of data to append.

#### Returns

`void`

#### Defined in

[index.d.ts:209](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L209)
