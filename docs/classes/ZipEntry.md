[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipEntry

# Class: ZipEntry

Defined in: [index.d.ts:1466](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1466)

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

Defined in: [index.d.ts:1490](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1490)

The children of the entry.

***

### data?

> `optional` **data**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

Defined in: [index.d.ts:1474](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1474)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### id

> **id**: `number`

Defined in: [index.d.ts:1478](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1478)

The ID of the instance.

***

### name

> **name**: `string`

Defined in: [index.d.ts:1470](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1470)

The relative filename of the entry.

***

### parent?

> `optional` **parent**: `ZipEntry`

Defined in: [index.d.ts:1482](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1482)

The parent directory of the entry.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1486](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1486)

The uncompressed size of the content.

## Methods

### checkPassword()

> **checkPassword**(`password`, `options`?): `Promise`\<`boolean`\>

Defined in: [index.d.ts:1518](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1518)

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

> **clone**(`deepClone`?): `ZipEntry`

Defined in: [index.d.ts:1496](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1496)

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

Defined in: [index.d.ts:1500](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1500)

Returns the full filename of the entry

#### Returns

`string`

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Defined in: [index.d.ts:1504](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1504)

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Defined in: [index.d.ts:1510](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1510)

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

Defined in: [index.d.ts:1514](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1514)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

***

### rename()

> **rename**(`name`): `void`

Defined in: [index.d.ts:1527](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1527)

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`
