[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / GetEntriesOptions

# Interface: GetEntriesOptions

Defined in: [index.d.ts:780](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L780)

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md), [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)

## Properties

### commentEncoding?

> `optional` **commentEncoding**: `string`

Defined in: [index.d.ts:788](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L788)

The encoding of the comment of the entry.

***

### filenameEncoding?

> `optional` **filenameEncoding**: `string`

Defined in: [index.d.ts:784](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L784)

The encoding of the filename of the entry.

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `string`

Defined in: [index.d.ts:796](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L796)

The function called for decoding the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`

The raw text value.

##### encoding

`string`

The encoding of the text.

#### Returns

`string`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.
