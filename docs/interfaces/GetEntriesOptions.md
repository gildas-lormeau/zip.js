[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / GetEntriesOptions

# Interface: GetEntriesOptions

Defined in: [index.d.ts:820](https://github.com/gildas-lormeau/zip.js/blob/5c4c70530bd9d879d516e190202125e09cc8106f/index.d.ts#L820)

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md), [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)

## Properties

### commentEncoding?

> `optional` **commentEncoding?**: `string`

Defined in: [index.d.ts:828](https://github.com/gildas-lormeau/zip.js/blob/5c4c70530bd9d879d516e190202125e09cc8106f/index.d.ts#L828)

The encoding of the comment of the entry.

***

### filenameEncoding?

> `optional` **filenameEncoding?**: `string`

Defined in: [index.d.ts:824](https://github.com/gildas-lormeau/zip.js/blob/5c4c70530bd9d879d516e190202125e09cc8106f/index.d.ts#L824)

The encoding of the filename of the entry.

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `string` \| `undefined`

Defined in: [index.d.ts:836](https://github.com/gildas-lormeau/zip.js/blob/5c4c70530bd9d879d516e190202125e09cc8106f/index.d.ts#L836)

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
