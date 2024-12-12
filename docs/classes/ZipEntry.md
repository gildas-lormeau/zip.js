[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipEntry

# Class: ZipEntry

Represents an entry in a zip file (Filesystem API).

## Extended by

- [`ZipFileEntry`](ZipFileEntry.md)
- [`ZipDirectoryEntry`](ZipDirectoryEntry.md)

## Constructors

### new ZipEntry()

> **new ZipEntry**(): [`ZipEntry`](ZipEntry.md)

#### Returns

[`ZipEntry`](ZipEntry.md)

## Properties

### children

> **children**: [`ZipEntry`](ZipEntry.md)[]

The children of the entry.

#### Defined in

[index.d.ts:1469](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1469)

***

### data?

> `optional` **data**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

#### Defined in

[index.d.ts:1453](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1453)

***

### id

> **id**: `number`

The ID of the instance.

#### Defined in

[index.d.ts:1457](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1457)

***

### name

> **name**: `string`

The relative filename of the entry.

#### Defined in

[index.d.ts:1449](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1449)

***

### parent?

> `optional` **parent**: [`ZipEntry`](ZipEntry.md)

The parent directory of the entry.

#### Defined in

[index.d.ts:1461](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1461)

***

### uncompressedSize

> **uncompressedSize**: `number`

The uncompressed size of the content.

#### Defined in

[index.d.ts:1465](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1465)

## Methods

### checkPassword()

> **checkPassword**(`password`, `options`?): `Promise`\<`boolean`\>

Tests the password on the entry and all children if any, returns `true` if the entry is not password protected

#### Parameters

##### password

`string`

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[index.d.ts:1497](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1497)

***

### clone()

> **clone**(`deepClone`?): [`ZipEntry`](ZipEntry.md)

Clones the entry

#### Parameters

##### deepClone?

`boolean`

`true` to clone all the descendants.

#### Returns

[`ZipEntry`](ZipEntry.md)

#### Defined in

[index.d.ts:1475](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1475)

***

### getFullname()

> **getFullname**(): `string`

Returns the full filename of the entry

#### Returns

`string`

#### Defined in

[index.d.ts:1479](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1479)

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

#### Defined in

[index.d.ts:1483](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1483)

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

#### Defined in

[index.d.ts:1489](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1489)

***

### isPasswordProtected()

> **isPasswordProtected**(): `boolean`

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

#### Defined in

[index.d.ts:1493](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1493)

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

#### Defined in

[index.d.ts:1506](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1506)
