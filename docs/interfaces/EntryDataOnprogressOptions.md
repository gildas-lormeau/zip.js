[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryDataOnprogressOptions

# Interface: EntryDataOnprogressOptions

Defined in: [index.d.ts:2220](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L2220)

Represents options passed to [FileEntry#getData](FileEntry.md#getdata), [ZipWriter.add](../classes/ZipWriter.md#add) and `{@link ZipDirectory}.export*`.

## Extended by

- [`EntryGetDataOptions`](EntryGetDataOptions.md)
- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Methods

### onend()?

> `optional` **onend**(`computedSize`): `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:2242](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L2242)

The function called when ending compression/decompression.

#### Parameters

##### computedSize

`number`

The total number of bytes (computed).

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`): `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:2235](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L2235)

The function called during compression/decompression.

#### Parameters

##### progress

`number`

The current progress in bytes.

##### total

`number`

The total number of bytes.

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.

***

### onstart()?

> `optional` **onstart**(`total`): `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:2227](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L2227)

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.
