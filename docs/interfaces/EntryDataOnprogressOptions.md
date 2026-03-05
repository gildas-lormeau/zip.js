[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryDataOnprogressOptions

# Interface: EntryDataOnprogressOptions

Defined in: [index.d.ts:1653](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1653)

Represents options passed to [FileEntry#getData](FileEntry.md#getdata), [ZipWriter.add](../classes/ZipWriter.md#add) and `{@link ZipDirectory}.export*`.

## Extended by

- [`EntryGetDataOptions`](EntryGetDataOptions.md)
- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Methods

### onend()?

> `optional` **onend**(`computedSize`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1675](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1675)

The function called when ending compression/decompression.

#### Parameters

##### computedSize

`number`

The total number of bytes (computed).

#### Returns

`Promise`\<`void`\> \| `undefined`

An empty promise or `undefined`.

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1668](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1668)

The function called during compression/decompression.

#### Parameters

##### progress

`number`

The current progress in bytes.

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\> \| `undefined`

An empty promise or `undefined`.

***

### onstart()?

> `optional` **onstart**(`total`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1660](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1660)

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\> \| `undefined`

An empty promise or `undefined`.
