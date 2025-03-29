[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EventBasedCodec

# Class: EventBasedCodec

Defined in: [index.d.ts:203](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L203)

Represents an event-based implementation of a third-party codec.

## Constructors

### Constructor

> **new EventBasedCodec**(): `EventBasedCodec`

#### Returns

`EventBasedCodec`

## Methods

### ondata()

> **ondata**(`data`?): `void`

Defined in: [index.d.ts:215](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L215)

The function called when a chunk of data has been compressed/decompressed.

#### Parameters

##### data?

`Uint8Array`\<`ArrayBuffer`\>

The chunk of compressed/decompressed data.

#### Returns

`void`

***

### push()

> **push**(`data`): `void`

Defined in: [index.d.ts:209](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L209)

Appends a chunk of data to compress/decompress

#### Parameters

##### data

`Uint8Array`\<`ArrayBuffer`\>

The chunk of data to append.

#### Returns

`void`
