[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryError

# Interface: EntryError

Defined in: [index.d.ts:1644](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1644)

Represents an error raised while processing an entry, decorated with entry context.

## Extends

- `Error`

## Properties

### corruptedEntry?

> `optional` **corruptedEntry?**: `boolean`

Defined in: [index.d.ts:1648](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1648)

`true` if the zip file is corrupted because the entry data could not be written entirely.

***

### entryErrors?

> `optional` **entryErrors?**: `EntryError`[]

Defined in: [index.d.ts:1666](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1666)

The other entries that also failed, when [ZipDirectoryEntry#exportFileSystemHandle](../classes/ZipDirectoryEntry.md#exportfilesystemhandle) runs
with `concurrent` set to `true` and more than one entry fails (filesystem API). The error it is
set on is not repeated in the list, and failures raised deeper in the tree are flattened into
it, so the list holds every failure of the export except this one.

***

### entryId?

> `optional` **entryId?**: `number`

Defined in: [index.d.ts:1652](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1652)

The id of the related [ZipEntry](../classes/ZipEntry.md) (filesystem API).

***

### entryName?

> `optional` **entryName?**: `string`

Defined in: [index.d.ts:1659](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1659)

The name of the related [ZipEntry](../classes/ZipEntry.md), or of the related `FileSystemHandle` when importing
one (filesystem API). Set by [ZipDirectoryEntry#addFileSystemHandle](../classes/ZipDirectoryEntry.md#addfilesystemhandle) and
[ZipDirectoryEntry#exportFileSystemHandle](../classes/ZipDirectoryEntry.md#exportfilesystemhandle), which rethrow the original error rather than
wrapping it, so its `message` stays comparable to the exported `ERR_*` constants.

***

### exportedEntryNames?

> `optional` **exportedEntryNames?**: `string`[]

Defined in: [index.d.ts:1673](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1673)

The names of the files [ZipDirectoryEntry#exportFileSystemHandle](../classes/ZipDirectoryEntry.md#exportfilesystemhandle) finished writing before
it failed, relative to the exported entry (filesystem API). Directories are not listed. Every
other file of the export is either missing or empty, so this is the only way to tell a file the
export completed from one it created but never filled.

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1074

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.stack`
