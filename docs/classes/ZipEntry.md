[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipEntry

# Class: ZipEntry

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

The children of the entry.

***

### data?

> `optional` **data?**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### id

> **id**: `number`

The ID of the instance.

***

### name

> **name**: `string`

The relative filename of the entry.

***

### parent?

> `optional` **parent?**: `ZipEntry`

The parent directory of the entry.

***

### uncompressedSize

> **uncompressedSize**: `number`

The uncompressed size of the content.

#### Remarks

It is the size of the raw compressed content when the entry has been imported with the
`passThrough` option set to `true`, since the entry holds the compressed data in that case. The
uncompressed size of the original entry remains available in [ZipEntry#data](#data).

## Methods

### checkPassword()

> **checkPassword**(`password`, `options?`): `Promise`\<`boolean`\>

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

Returns the full filename of the entry

#### Returns

`string`

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

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

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

***

### rename()

> **rename**(`name`): `void`

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`
