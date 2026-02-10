[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryOnprogressOptions

# Interface: EntryOnprogressOptions

Defined in: [index.d.ts:1682](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L1682)

Represents options passed to [ZipReader#getEntries](../classes/ZipReader.md#getentries), [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator), and [ZipWriter#close](../classes/ZipWriter.md#close).

## Extended by

- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)
- [`ZipWriterCloseOptions`](ZipWriterCloseOptions.md)

## Methods

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1691](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L1691)

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
