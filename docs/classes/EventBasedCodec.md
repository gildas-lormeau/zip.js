[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EventBasedCodec

# Class: EventBasedCodec

Defined in: [index.d.ts:363](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L363)

Represents an event-based implementation of a third-party codec.

## Constructors

### Constructor

> **new EventBasedCodec**(): `EventBasedCodec`

#### Returns

`EventBasedCodec`

## Methods

### ondata()

> **ondata**(`data?`): `void`

Defined in: [index.d.ts:375](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L375)

The function called when a chunk of data has been compressed/decompressed.

#### Parameters

##### data?

`Uint8Array`\<`ArrayBufferLike`\>

The chunk of compressed/decompressed data.

#### Returns

`void`

***

### push()

> **push**(`data`): `void`

Defined in: [index.d.ts:369](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L369)

Appends a chunk of data to compress/decompress

#### Parameters

##### data

`Uint8Array`

The chunk of data to append.

#### Returns

`void`
