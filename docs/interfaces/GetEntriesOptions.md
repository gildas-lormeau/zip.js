[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / GetEntriesOptions

# Interface: GetEntriesOptions

Defined in: [index.d.ts:796](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L796)

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md), [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)

## Properties

### commentEncoding?

> `optional` **commentEncoding**: `string`

Defined in: [index.d.ts:804](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L804)

The encoding of the comment of the entry.

***

### filenameEncoding?

> `optional` **filenameEncoding**: `string`

Defined in: [index.d.ts:800](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L800)

The encoding of the filename of the entry.

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `undefined` \| `string`

Defined in: [index.d.ts:812](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L812)

The function called for decoding the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`

The raw text value.

##### encoding

`string`

The encoding of the text.

#### Returns

`undefined` \| `string`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.
