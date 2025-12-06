[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / GetEntriesOptions

# Interface: GetEntriesOptions

Defined in: [index.d.ts:814](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L814)

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md), [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)

## Properties

### commentEncoding?

> `optional` **commentEncoding**: `string`

Defined in: [index.d.ts:822](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L822)

The encoding of the comment of the entry.

***

### filenameEncoding?

> `optional` **filenameEncoding**: `string`

Defined in: [index.d.ts:818](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L818)

The encoding of the filename of the entry.

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `string` \| `undefined`

Defined in: [index.d.ts:830](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L830)

The function called for decoding the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`

The raw text value.

##### encoding

`string`

The encoding of the text.

#### Returns

`string` \| `undefined`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.
