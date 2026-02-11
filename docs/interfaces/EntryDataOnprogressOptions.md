[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryDataOnprogressOptions

# Interface: EntryDataOnprogressOptions

Defined in: [index.d.ts:1654](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1654)

Represents options passed to [FileEntry#getData](FileEntry.md#getdata), [ZipWriter.add](../classes/ZipWriter.md#add) and `{@link ZipDirectory}.export*`.

## Extended by

- [`EntryGetDataOptions`](EntryGetDataOptions.md)
- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Methods

### onend()?

> `optional` **onend**(`computedSize`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1676](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1676)

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

Defined in: [index.d.ts:1669](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1669)

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

Defined in: [index.d.ts:1661](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1661)

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\> \| `undefined`

An empty promise or `undefined`.
