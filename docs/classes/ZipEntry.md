[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipEntry

# Class: ZipEntry

Defined in: [index.d.ts:1700](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1700)

Represents an entry in a zip file (Filesystem API).

## Extended by

- [`ZipFileEntry`](ZipFileEntry.md)
- [`ZipDirectoryEntry`](ZipDirectoryEntry.md)

## Constructors

### Constructor

> **new ZipEntry**(): `ZipEntry`

#### Returns

`ZipEntry`

## Properties

### children

> **children**: `ZipEntry`[]

Defined in: [index.d.ts:1724](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1724)

The children of the entry.

***

### data?

> `optional` **data**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

Defined in: [index.d.ts:1708](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1708)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### id

> **id**: `number`

Defined in: [index.d.ts:1712](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1712)

The ID of the instance.

***

### name

> **name**: `string`

Defined in: [index.d.ts:1704](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1704)

The relative filename of the entry.

***

### parent?

> `optional` **parent**: `ZipEntry`

Defined in: [index.d.ts:1716](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1716)

The parent directory of the entry.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1720](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1720)

The uncompressed size of the content.

## Methods

### checkPassword()

> **checkPassword**(`password`, `options?`): `Promise`\<`boolean`\>

Defined in: [index.d.ts:1752](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1752)

Tests the password on the entry and all children if any, returns `true` if the entry is not password protected

#### Parameters

##### password

`string`

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

#### Returns

`Promise`\<`boolean`\>

***

### clone()

> **clone**(`deepClone?`): `ZipEntry`

Defined in: [index.d.ts:1730](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1730)

Clones the entry

#### Parameters

##### deepClone?

`boolean`

`true` to clone all the descendants.

#### Returns

`ZipEntry`

***

### getFullname()

> **getFullname**(): `string`

Defined in: [index.d.ts:1734](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1734)

Returns the full filename of the entry

#### Returns

`string`

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Defined in: [index.d.ts:1738](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1738)

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Defined in: [index.d.ts:1744](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1744)

Tests if a [ZipDirectoryEntry](ZipDirectoryEntry.md) instance is an ancestor of the entry

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

The [ZipDirectoryEntry](ZipDirectoryEntry.md) instance.

#### Returns

`boolean`

***

### isPasswordProtected()

> **isPasswordProtected**(): `boolean`

Defined in: [index.d.ts:1748](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1748)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

***

### rename()

> **rename**(`name`): `void`

Defined in: [index.d.ts:1761](https://github.com/gildas-lormeau/zip.js/blob/e33c46e1397305c8ad40070485a20385c5c01618/index.d.ts#L1761)

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`
