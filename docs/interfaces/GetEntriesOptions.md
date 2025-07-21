[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / GetEntriesOptions

# Interface: GetEntriesOptions

Defined in: [index.d.ts:944](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L944)

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md), [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)

## Properties

### commentEncoding?

> `optional` **commentEncoding**: `string`

Defined in: [index.d.ts:952](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L952)

The encoding of the comment of the entry.

***

### filenameEncoding?

> `optional` **filenameEncoding**: `string`

Defined in: [index.d.ts:948](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L948)

The encoding of the filename of the entry.

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `undefined` \| `string`

Defined in: [index.d.ts:960](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L960)

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
