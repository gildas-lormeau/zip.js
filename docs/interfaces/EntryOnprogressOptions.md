[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryOnprogressOptions

# Interface: EntryOnprogressOptions

Defined in: [index.d.ts:2257](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L2257)

Represents options passed to [ZipReader#getEntries](../classes/ZipReader.md#getentries), [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator), and [ZipWriter#close](../classes/ZipWriter.md#close).

## Extended by

- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)
- [`ZipWriterCloseOptions`](ZipWriterCloseOptions.md)

## Methods

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:2266](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L2266)

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
