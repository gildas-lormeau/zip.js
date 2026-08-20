[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryError

# Interface: EntryError

Represents an error raised while processing an archive or one of its entries, decorated with context.

## Extends

- `Error`

## Properties

### corruptedEntry?

> `optional` **corruptedEntry?**: `boolean`

`true` if the zip file is corrupted because the entry data could not be written entirely.

***

### entryErrors?

> `optional` **entryErrors?**: `EntryError`[]

The other entries that also failed, when [ZipDirectoryEntry#exportFileSystemHandle](../classes/ZipDirectoryEntry.md#exportfilesystemhandle) runs
with `concurrent` set to `true` and more than one entry fails (filesystem API). The error it is
set on is not repeated in the list, and failures raised deeper in the tree are flattened into
it, so the list holds every failure of the export except this one.

***

### entryId?

> `optional` **entryId?**: `number`

The id of the related [ZipEntry](../classes/ZipEntry.md) (filesystem API).

***

### entryName?

> `optional` **entryName?**: `string`

The name of the related [ZipEntry](../classes/ZipEntry.md), or of the related `FileSystemHandle` when importing
one (filesystem API). Set by [ZipDirectoryEntry#addFileSystemHandle](../classes/ZipDirectoryEntry.md#addfilesystemhandle) and
[ZipDirectoryEntry#exportFileSystemHandle](../classes/ZipDirectoryEntry.md#exportfilesystemhandle), which rethrow the original error rather than
wrapping it, so its `message` stays comparable to the exported `ERR_*` constants.

***

### exportedEntryNames?

> `optional` **exportedEntryNames?**: `string`[]

The names of the files [ZipDirectoryEntry#exportFileSystemHandle](../classes/ZipDirectoryEntry.md#exportfilesystemhandle) finished writing before
it failed, relative to the exported entry (filesystem API). Directories are not listed. Every
other file of the export is either missing or empty, so this is the only way to tell a file the
export completed from one it created but never filled.

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

***

### overlappingEntry?

> `optional` **overlappingEntry?**: [`Entry`](../type-aliases/Entry.md)

The entry whose data overlaps the data of the entry being read, set on the
[ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error raised by GetEntriesOptions#checkOverlappingEntry.
It is the only way to identify the other entry of the pair.

***

### reason?

> `optional` **reason?**: `string`

The ambiguity that was detected, set on the [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error raised by
[GetEntriesOptions#strictness](ZipReaderGetEntriesOptions.md#strictness). See [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) for the values it takes.

***

### stack?

> `optional` **stack?**: `string`

#### Inherited from

`Error.stack`
