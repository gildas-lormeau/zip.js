[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipEntry

# Class: ZipEntry

Defined in: [index.d.ts:1567](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1567)

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

Defined in: [index.d.ts:1591](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1591)

The children of the entry.

***

### data?

> `optional` **data**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

Defined in: [index.d.ts:1575](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1575)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### id

> **id**: `number`

Defined in: [index.d.ts:1579](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1579)

The ID of the instance.

***

### name

> **name**: `string`

Defined in: [index.d.ts:1571](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1571)

The relative filename of the entry.

***

### parent?

> `optional` **parent**: `ZipEntry`

Defined in: [index.d.ts:1583](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1583)

The parent directory of the entry.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1587](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1587)

The uncompressed size of the content.

## Methods

### checkPassword()

> **checkPassword**(`password`, `options?`): `Promise`\<`boolean`\>

Defined in: [index.d.ts:1619](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1619)

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

Defined in: [index.d.ts:1597](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1597)

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

Defined in: [index.d.ts:1601](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1601)

Returns the full filename of the entry

#### Returns

`string`

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Defined in: [index.d.ts:1605](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1605)

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Defined in: [index.d.ts:1611](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1611)

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

Defined in: [index.d.ts:1615](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1615)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

***

### rename()

> **rename**(`name`): `void`

Defined in: [index.d.ts:1628](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L1628)

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`
