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

### options?

> `readonly` `optional` **options?**: [`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options applied to the entry when the zip file is exported.

#### Remarks

These are the options passed when the entry was added to the filesystem, updated by
[ZipEntry#setOptions](#setoptions). An entry imported from a zip file has none until
[ZipEntry#setOptions](#setoptions) is called.

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

It is updated by the `{@link ZipFileEntry}#replace*()` methods, and it is `0` for an entry holding
a `ReadableStream` instance, whose size is only known once the entry has been read.

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

#### Remarks

A name holding `"/"` is split into path components, like the name passed to a
`{@link ZipDirectoryEntry}#add*()` method, so it moves the entry into the directories it names,
creating them when they do not exist. Renaming an entry to the name it already has does nothing.
Renaming it onto an existing sibling throws an [ERR\_ENTRY\_EXISTS](../variables/ERR_ENTRY_EXISTS.md) error, and renaming it
into itself or into one of its descendants throws.

***

### setOptions()

> **setOptions**(`options`): `void`

Sets the options applied to the entry when the zip file is exported

#### Parameters

##### options

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`void`

#### Remarks

The options are merged into [ZipEntry#options](#options), and an option set to `undefined` is removed
from it instead of being stored. They take precedence over the options passed to
`{@link ZipDirectoryEntry}#export*()` and over the metadata of the entry they were imported from,
exactly like the options passed when adding an entry to the filesystem.

The options describing the data of an entry exported as-is, e.g.
[ZipWriterConstructorOptions#compressionMethod](../interfaces/ZipWriterConstructorOptions.md#compressionmethod) and
[ZipWriterAddDataOptions#uncompressedSize](../interfaces/ZipWriterAddDataOptions.md#uncompressedsize), are ignored: they are always the ones of the
original entry. The [ZipWriterAddDataOptions#directory](../interfaces/ZipWriterAddDataOptions.md#directory) option and the progress callbacks
are ignored as well. Invalid option values are reported when the zip file is exported.
