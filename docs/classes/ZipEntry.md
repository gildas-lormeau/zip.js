[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipEntry

# Class: ZipEntry

Defined in: [index.d.ts:1697](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1697)

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

Defined in: [index.d.ts:1721](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1721)

The children of the entry.

***

### data?

> `optional` **data**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

Defined in: [index.d.ts:1705](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1705)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### id

> **id**: `number`

Defined in: [index.d.ts:1709](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1709)

The ID of the instance.

***

### name

> **name**: `string`

Defined in: [index.d.ts:1701](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1701)

The relative filename of the entry.

***

### parent?

> `optional` **parent**: `ZipEntry`

Defined in: [index.d.ts:1713](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1713)

The parent directory of the entry.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1717](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1717)

The uncompressed size of the content.

## Methods

### checkPassword()

> **checkPassword**(`password`, `options?`): `Promise`\<`boolean`\>

Defined in: [index.d.ts:1749](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1749)

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

Defined in: [index.d.ts:1727](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1727)

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

Defined in: [index.d.ts:1731](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1731)

Returns the full filename of the entry

#### Returns

`string`

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Defined in: [index.d.ts:1735](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1735)

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Defined in: [index.d.ts:1741](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1741)

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

Defined in: [index.d.ts:1745](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1745)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

***

### rename()

> **rename**(`name`): `void`

Defined in: [index.d.ts:1758](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1758)

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`
