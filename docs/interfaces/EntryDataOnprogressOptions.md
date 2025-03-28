[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryDataOnprogressOptions

# Interface: EntryDataOnprogressOptions

Defined in: [index.d.ts:1419](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L1419)

Represents options passed to [Entry#getData](Entry.md#getdata), [ZipWriter.add](../classes/ZipWriter.md#add) and `{@link ZipDirectory}.export*`.

## Extended by

- [`EntryGetDataOptions`](EntryGetDataOptions.md)
- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Methods

### onend()?

> `optional` **onend**(`computedSize`): `Promise`\<`void`\>

Defined in: [index.d.ts:1441](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L1441)

The function called when ending compression/decompression.

#### Parameters

##### computedSize

`number`

The total number of bytes (computed).

#### Returns

`Promise`\<`void`\>

An empty promise or `undefined`.

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`): `Promise`\<`void`\>

Defined in: [index.d.ts:1434](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L1434)

The function called during compression/decompression.

#### Parameters

##### progress

`number`

The current progress in bytes.

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\>

An empty promise or `undefined`.

***

### onstart()?

> `optional` **onstart**(`total`): `Promise`\<`void`\>

Defined in: [index.d.ts:1426](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L1426)

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\>

An empty promise or `undefined`.
