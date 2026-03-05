[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryOnprogressOptions

# Interface: EntryOnprogressOptions

Defined in: [index.d.ts:1681](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1681)

Represents options passed to [ZipReader#getEntries](../classes/ZipReader.md#getentries), [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator), and [ZipWriter#close](../classes/ZipWriter.md#close).

## Extended by

- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)
- [`ZipWriterCloseOptions`](ZipWriterCloseOptions.md)

## Methods

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1690](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1690)

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
