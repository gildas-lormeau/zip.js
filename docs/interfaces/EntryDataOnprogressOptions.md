[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryDataOnprogressOptions

# Interface: EntryDataOnprogressOptions

Defined in: [index.d.ts:1669](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1669)

Represents options passed to [FileEntry#getData](FileEntry.md#getdata), [ZipWriter.add](../classes/ZipWriter.md#add) and `{@link ZipDirectory}.export*`.

## Extended by

- [`EntryGetDataOptions`](EntryGetDataOptions.md)
- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Methods

### onend()?

> `optional` **onend**(`computedSize`): `undefined` \| `Promise`\<`void`\>

Defined in: [index.d.ts:1691](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1691)

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

Defined in: [index.d.ts:1684](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1684)

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

Defined in: [index.d.ts:1676](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1676)

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`undefined` \| `Promise`\<`void`\>

An empty promise or `undefined`.
