[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipEntry

# Class: ZipEntry

Defined in: [index.d.ts:1683](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1683)

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

Defined in: [index.d.ts:1707](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1707)

The children of the entry.

***

### data?

> `optional` **data**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

Defined in: [index.d.ts:1691](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1691)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### id

> **id**: `number`

Defined in: [index.d.ts:1695](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1695)

The ID of the instance.

***

### name

> **name**: `string`

Defined in: [index.d.ts:1687](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1687)

The relative filename of the entry.

***

### parent?

> `optional` **parent**: `ZipEntry`

Defined in: [index.d.ts:1699](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1699)

The parent directory of the entry.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1703](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1703)

The uncompressed size of the content.

## Methods

### checkPassword()

> **checkPassword**(`password`, `options?`): `Promise`\<`boolean`\>

Defined in: [index.d.ts:1735](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1735)

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

Defined in: [index.d.ts:1713](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1713)

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

Defined in: [index.d.ts:1717](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1717)

Returns the full filename of the entry

#### Returns

`string`

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Defined in: [index.d.ts:1721](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1721)

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Defined in: [index.d.ts:1727](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1727)

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

Defined in: [index.d.ts:1731](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1731)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

***

### rename()

> **rename**(`name`): `void`

Defined in: [index.d.ts:1744](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1744)

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`
