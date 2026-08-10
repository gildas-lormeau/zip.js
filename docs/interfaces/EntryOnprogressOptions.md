[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryOnprogressOptions

# Interface: EntryOnprogressOptions

Defined in: [index.d.ts:2235](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L2235)

Represents options passed to [ZipReader#getEntries](../classes/ZipReader.md#getentries), [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator), and [ZipWriter#close](../classes/ZipWriter.md#close).

## Extended by

- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)
- [`ZipWriterCloseOptions`](ZipWriterCloseOptions.md)

## Methods

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:2244](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L2244)

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

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.
