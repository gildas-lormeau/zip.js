[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderGetEntriesOptions

# Interface: ZipReaderGetEntriesOptions

Defined in: [index.d.ts:789](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L789)

Represents the options passed to [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extends

- [`GetEntriesOptions`](GetEntriesOptions.md).[`EntryOnprogressOptions`](EntryOnprogressOptions.md)

## Properties

### commentEncoding?

> `optional` **commentEncoding**: `string`

Defined in: [index.d.ts:804](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L804)

The encoding of the comment of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`commentEncoding`](GetEntriesOptions.md#commentencoding)

***

### filenameEncoding?

> `optional` **filenameEncoding**: `string`

Defined in: [index.d.ts:800](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L800)

The encoding of the filename of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`filenameEncoding`](GetEntriesOptions.md#filenameencoding)

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `undefined` \| `string`

Defined in: [index.d.ts:812](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L812)

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

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`decodeText`](GetEntriesOptions.md#decodetext)

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `undefined` \| `Promise`\<`void`\>

Defined in: [index.d.ts:1557](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1557)

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

`undefined` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryOnprogressOptions`](EntryOnprogressOptions.md).[`onprogress`](EntryOnprogressOptions.md#onprogress)
