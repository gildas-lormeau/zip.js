[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderGetEntriesOptions

# Interface: ZipReaderGetEntriesOptions

Defined in: [index.d.ts:813](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L813)

Represents the options passed to [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extends

- [`GetEntriesOptions`](GetEntriesOptions.md).[`EntryOnprogressOptions`](EntryOnprogressOptions.md)

## Properties

### commentEncoding?

> `optional` **commentEncoding**: `string`

Defined in: [index.d.ts:828](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L828)

The encoding of the comment of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`commentEncoding`](GetEntriesOptions.md#commentencoding)

***

### filenameEncoding?

> `optional` **filenameEncoding**: `string`

Defined in: [index.d.ts:824](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L824)

The encoding of the filename of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`filenameEncoding`](GetEntriesOptions.md#filenameencoding)

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `string` \| `undefined`

Defined in: [index.d.ts:836](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L836)

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

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`decodeText`](GetEntriesOptions.md#decodetext)

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1691](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1691)

The function called each time an entry is read/written.

#### Parameters

##### progress

`number`

The entry index.

##### total

`number`

The total number of entries.

##### entry

[`EntryMetaData`](EntryMetaData.md)

The entry being read/written.

#### Returns

`Promise`\<`void`\> \| `undefined`

An empty promise or `undefined`.

#### Inherited from

[`EntryOnprogressOptions`](EntryOnprogressOptions.md).[`onprogress`](EntryOnprogressOptions.md#onprogress)
