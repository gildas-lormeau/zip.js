[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryDataOnprogressOptions

# Interface: EntryDataOnprogressOptions

Defined in: [index.d.ts:1607](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1607)

Represents options passed to [FileEntry#getData](FileEntry.md#getdata), [ZipWriter.add](../classes/ZipWriter.md#add) and `{@link ZipDirectory}.export*`.

## Extended by

- [`EntryGetDataOptions`](EntryGetDataOptions.md)
- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Methods

### onend()?

> `optional` **onend**(`computedSize`): `undefined` \| `Promise`\<`void`\>

Defined in: [index.d.ts:1629](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1629)

The function called when ending compression/decompression.

#### Parameters

##### computedSize

`number`

The total number of bytes (computed).

#### Returns

`undefined` \| `Promise`\<`void`\>

An empty promise or `undefined`.

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`): `undefined` \| `Promise`\<`void`\>

Defined in: [index.d.ts:1622](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1622)

The function called during compression/decompression.

#### Parameters

##### progress

`number`

The current progress in bytes.

##### total

`number`

The total number of bytes.

#### Returns

`undefined` \| `Promise`\<`void`\>

An empty promise or `undefined`.

***

### onstart()?

> `optional` **onstart**(`total`): `undefined` \| `Promise`\<`void`\>

Defined in: [index.d.ts:1614](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1614)

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`undefined` \| `Promise`\<`void`\>

An empty promise or `undefined`.
