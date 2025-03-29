[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / GetEntriesOptions

# Interface: GetEntriesOptions

Defined in: [index.d.ts:775](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L775)

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md), [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)

## Properties

### commentEncoding?

> `optional` **commentEncoding**: `string`

Defined in: [index.d.ts:783](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L783)

The encoding of the comment of the entry.

***

### filenameEncoding?

> `optional` **filenameEncoding**: `string`

Defined in: [index.d.ts:779](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L779)

The encoding of the filename of the entry.

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `string`

Defined in: [index.d.ts:791](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L791)

The function called for decoding the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`\<`ArrayBuffer`\>

The raw text value.

##### encoding

`string`

The encoding of the text.

#### Returns

`string`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.
