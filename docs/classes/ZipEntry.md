[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipEntry

# Class: ZipEntry

Defined in: [index.d.ts:2179](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2179)

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

Defined in: [index.d.ts:2203](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2203)

The children of the entry.

***

### data?

> `optional` **data?**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

Defined in: [index.d.ts:2187](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2187)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### id

> **id**: `number`

Defined in: [index.d.ts:2191](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2191)

The ID of the instance.

***

### name

> **name**: `string`

Defined in: [index.d.ts:2183](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2183)

The relative filename of the entry.

***

### parent?

> `optional` **parent?**: `ZipEntry`

Defined in: [index.d.ts:2195](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2195)

The parent directory of the entry.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:2199](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2199)

The uncompressed size of the content.

## Methods

### checkPassword()

> **checkPassword**(`password`, `options?`): `Promise`\<`boolean`\>

Defined in: [index.d.ts:2231](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2231)

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

Defined in: [index.d.ts:2209](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2209)

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

Defined in: [index.d.ts:2213](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2213)

Returns the full filename of the entry

#### Returns

`string`

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Defined in: [index.d.ts:2217](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2217)

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Defined in: [index.d.ts:2223](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2223)

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

Defined in: [index.d.ts:2227](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2227)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

***

### rename()

> **rename**(`name`): `void`

Defined in: [index.d.ts:2240](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2240)

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`
