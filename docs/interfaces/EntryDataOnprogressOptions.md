[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryDataOnprogressOptions

# Interface: EntryDataOnprogressOptions

Defined in: [index.d.ts:1652](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1652)

Represents options passed to [FileEntry#getData](FileEntry.md#getdata), [ZipWriter.add](../classes/ZipWriter.md#add) and `{@link ZipDirectory}.export*`.

## Extended by

- [`EntryGetDataOptions`](EntryGetDataOptions.md)
- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Methods

### onend()?

> `optional` **onend**(`computedSize`): `undefined` \| `Promise`\<`void`\>

Defined in: [index.d.ts:1674](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1674)

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

Defined in: [index.d.ts:1667](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1667)

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

Defined in: [index.d.ts:1659](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1659)

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`undefined` \| `Promise`\<`void`\>

An empty promise or `undefined`.
