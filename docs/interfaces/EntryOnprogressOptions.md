[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryOnprogressOptions

# Interface: EntryOnprogressOptions

Defined in: [index.d.ts:1612](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1612)

Represents options passed to [ZipReader#getEntries](../classes/ZipReader.md#getentries), [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator), and [ZipWriter#close](../classes/ZipWriter.md#close).

## Extended by

- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)
- [`ZipWriterCloseOptions`](ZipWriterCloseOptions.md)

## Methods

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `Promise`\<`void`\>

Defined in: [index.d.ts:1621](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1621)

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

`Promise`\<`void`\>

An empty promise or `undefined`.
