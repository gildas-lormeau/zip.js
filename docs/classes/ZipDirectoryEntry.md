[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDirectoryEntry

# Class: ZipDirectoryEntry

Represents a directory entry in the zip (Filesystem API).

## Remarks

The `name` passed to an `{@link ZipDirectoryEntry}#add*()` method is split into path
components, exactly like the filename of an imported entry, so `addText("a/b.txt", text)` adds
`"b.txt"` to the `"a"` directory and creates that directory when it does not exist. Empty
components and `"."` components are ignored. The directories created that way are navigable like
any other entry but are not written when the tree is exported, so the zip file holds the same
entries whichever way the path was built.

## Extends

- [`ZipEntry`](ZipEntry.md)

## Constructors

### Constructor

> **new ZipDirectoryEntry**(): `ZipDirectoryEntry`

#### Returns

`ZipDirectoryEntry`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`constructor`](ZipEntry.md#constructor)

## Properties

### children

> **children**: [`ZipEntry`](ZipEntry.md)[]

The children of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`children`](ZipEntry.md#children)

***

### data?

> `optional` **data?**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`data`](ZipEntry.md#data)

***

### directory

> **directory**: `true`

`true` for  ZipDirectoryEntry instances.

***

### id

> **id**: `number`

The ID of the instance.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`id`](ZipEntry.md#id)

***

### name

> **name**: `string`

The relative filename of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`name`](ZipEntry.md#name)

***

### options?

> `readonly` `optional` **options?**: [`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options applied to the entry when the zip file is exported.

#### Remarks

These are the options passed when the entry was added to the filesystem, updated by
[ZipEntry#setOptions](ZipEntry.md#setoptions). An entry imported from a zip file has none until
[ZipEntry#setOptions](ZipEntry.md#setoptions) is called.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`options`](ZipEntry.md#options)

***

### parent?

> `optional` **parent?**: [`ZipEntry`](ZipEntry.md)

The parent directory of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`parent`](ZipEntry.md#parent)

***

### uncompressedSize

> **uncompressedSize**: `number`

The uncompressed size of the content.

#### Remarks

It is the size of the raw compressed content when the entry has been imported with the
`passThrough` option set to `true`, since the entry holds the compressed data in that case. The
uncompressed size of the original entry remains available in [ZipEntry#data](ZipEntry.md#data).

It is updated by the `{@link ZipFileEntry}#replace*()` methods, and it is `0` for an entry holding
a `ReadableStream` instance, whose size is only known once the entry has been read.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`uncompressedSize`](ZipEntry.md#uncompressedsize)

## Methods

### addBlob()

> **addBlob**(`name`, `blob`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`Blob`, `Blob`\>

Adds a entry entry with content provided as a `Blob` instance

#### Parameters

##### name

`string`

The relative filename of the entry.

##### blob

`Blob`

The `Blob` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`Blob`, `Blob`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### addData64URI()

> **addData64URI**(`name`, `dataURI`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

Adds a entry entry with content provided as a Data URI `string` encoded in Base64

#### Parameters

##### name

`string`

The relative filename of the entry.

##### dataURI

`string`

The Data URI `string` encoded in Base64.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### addDirectory()

> **addDirectory**(`name`, `options?`): `ZipDirectoryEntry`

Adds a directory

#### Parameters

##### name

`string`

The relative filename of the directory.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`ZipDirectoryEntry`

A ZipDirectoryEntry instance.

***

### addFile()

> **addFile**(`file`, `options?`): `Promise`\<[`ZipEntry`](ZipEntry.md)\>

Adds an entry with content provided via a `File` instance

#### Parameters

##### file

`File`

The `File` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`ZipEntry`](ZipEntry.md)\>

A promise resolving to a [ZipFileEntry](ZipFileEntry.md) or a ZipDirectoryEntry instance.

***

### addFileSystemEntry()

> **addFileSystemEntry**(`fileSystemEntry`, `options?`): `Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

Adds an entry with content provided via a `FileSystemEntry` instance

The options apply to every entry added, including the directories. The
[ZipWriterConstructorOptions#lastModDate](../interfaces/ZipWriterConstructorOptions.md#lastmoddate) option replaces the last modification date of the
files, which is otherwise taken from each `FileSystemEntry` instance.

#### Parameters

##### fileSystemEntry

[`FileSystemEntryLike`](../interfaces/FileSystemEntryLike.md)

The `FileSystemEntry` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

A promise resolving to an array of [ZipFileEntry](ZipFileEntry.md) or a ZipDirectoryEntry instances.

***

### addFileSystemHandle()

> **addFileSystemHandle**(`fileSystemHandle`, `options?`): `Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

Adds an entry with content provided via a `FileSystemHandle` instance

If a handle cannot be read, the original error is rethrown unmodified as an [EntryError](../interfaces/EntryError.md),
whose [EntryError#entryName](../interfaces/EntryError.md#entryname) is the path of the handle that failed, relative to the parent
of `fileSystemHandle`.

The options apply to every entry added, including the directories. The
[ZipWriterConstructorOptions#lastModDate](../interfaces/ZipWriterConstructorOptions.md#lastmoddate) option replaces the last modification date of the
files, which is otherwise taken from each `FileSystemHandle` instance.

#### Parameters

##### fileSystemHandle

[`FileSystemHandleLike`](../interfaces/FileSystemHandleLike.md)

The `fileSystemHandle` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

A promise resolving to an array of [ZipFileEntry](ZipFileEntry.md) or a ZipDirectoryEntry instances.

***

### addHttpContent()

> **addHttpContent**(`name`, `url`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `void`\>

Adds an entry with content fetched from a URL

#### Parameters

##### name

`string`

The relative filename of the entry.

##### url

`string`

The URL.

##### options?

[`HttpOptions`](../interfaces/HttpOptions.md) & [`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`string`, `void`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### addReadable()

> **addReadable**(`name`, `readable`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`ReadableStream`\<`any`\>, `void`\>

Adds a entry entry with content provided via a `ReadableStream` instance

#### Parameters

##### name

`string`

The relative filename of the entry.

##### readable

`ReadableStream`

The `ReadableStream` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`ReadableStream`\<`any`\>, `void`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### addText()

> **addText**(`name`, `text`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

Adds an entry with content provided as text

#### Parameters

##### name

`string`

The relative filename of the entry.

##### text

`string`

The text.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### addUint8Array()

> **addUint8Array**(`name`, `array`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

Adds an entry with content provided as a `Uint8Array` instance

#### Parameters

##### name

`string`

The relative filename of the entry.

##### array

`Uint8Array`

The `Uint8Array` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

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

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`checkPassword`](ZipEntry.md#checkpassword)

***

### clone()

> **clone**(`deepClone?`): [`ZipEntry`](ZipEntry.md)

Clones the entry

#### Parameters

##### deepClone?

`boolean`

`true` to clone all the descendants.

#### Returns

[`ZipEntry`](ZipEntry.md)

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`clone`](ZipEntry.md#clone)

***

### exportBlob()

> **exportBlob**(`options?`): `Promise`\<`Blob`\>

Returns a `Blob` instance containing a zip file of the entry and its descendants

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`Blob`\>

A promise resolving to the `Blob` instance.

***

### exportData64URI()

> **exportData64URI**(`options?`): `Promise`\<`string`\>

Returns a Data URI `string` encoded in Base64 containing a zip file of the entry and its descendants

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`string`\>

A promise resolving to the Data URI `string` encoded in Base64.

***

### exportFileSystemHandle()

> **exportFileSystemHandle**(`directoryHandle`, `options?`): `Promise`\<`FileSystemDirectoryHandle`\>

Writes the entry and its descendants into a directory as files and sub-directories via the File System Access API (e.g. the Origin Private File System). Files are streamed and directories are merged into the target; colliding files are overwritten. This is the inverse of [ZipDirectoryEntry#addFileSystemHandle](#addfilesystemhandle).

If an entry cannot be written, the original error is rethrown unmodified as an [EntryError](../interfaces/EntryError.md),
whose [EntryError#entryName](../interfaces/EntryError.md#entryname) is the name of the entry that failed, relative to this entry.

The export is not atomic and nothing is rolled back, because the target is merged into rather
than replaced: a file that already existed cannot be restored once overwritten. On failure the
target is left as follows, and [EntryError#exportedEntryNames](../interfaces/EntryError.md#exportedentrynames) lists the files that
completed:
- files written before the failure are left in place, complete and valid;
- a file whose write started but did not finish is left empty, because it is created before its
  content is streamed; this includes the entry that failed and, with `concurrent`, every entry
  cancelled alongside it;
- files that already existed in the target keep their previous content unless they were
  overwritten in full;
- entries not started yet are missing, as are the directories that would have held them.

Running the same export again is the supported way to recover, since directories are merged and
files are overwritten.

#### Parameters

##### directoryHandle

`FileSystemDirectoryHandle`

The target `FileSystemDirectoryHandle` instance.

##### options?

[`ZipDirectoryEntryExportFileSystemHandleOptions`](../interfaces/ZipDirectoryEntryExportFileSystemHandleOptions.md)

The options.

#### Returns

`Promise`\<`FileSystemDirectoryHandle`\>

A promise resolving to the target `FileSystemDirectoryHandle` instance.

#### Remarks

An entry flagged as a symbolic link by [EntryMetaData#symlink](../interfaces/EntryMetaData.md#symlink) is written
as a regular file whose content is the path of the link target, because the File System Access API cannot
create symbolic links.

***

### exportUint8Array()

> **exportUint8Array**(`options?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Returns a `Uint8Array` instance containing a zip file of the entry and its descendants

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

A promise resolving to the `Uint8Array` instance.

***

### exportWritable()

> **exportWritable**(`writable?`, `options?`): `Promise`\<`WritableStream`\<`any`\>\>

Creates a zip file via a `WritableStream` instance containing the entry and its descendants

#### Parameters

##### writable?

`WritableStream`\<`any`\>

The `WritableStream` instance.

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`WritableStream`\<`any`\>\>

A promise resolving to the `Uint8Array` instance.

***

### exportZip()

> **exportZip**(`writer`, `options?`): `Promise`\<`unknown`\>

Creates a zip file via a custom [Writer](Writer.md) instance containing the entry and its descendants

#### Parameters

##### writer

`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\> \| `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `any`, `any`\>

The [Writer](Writer.md) instance.

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`unknown`\>

A promise resolving to the data.

***

### getChildByName()

> **getChildByName**(`name`): [`ZipEntry`](ZipEntry.md) \| `undefined`

Gets a [ZipEntry](ZipEntry.md) child instance from its relative filename

#### Parameters

##### name

`string`

The relative filename.

#### Returns

[`ZipEntry`](ZipEntry.md) \| `undefined`

A [ZipFileEntry](ZipFileEntry.md) or a ZipDirectoryEntry instance (use the [ZipFileEntry#directory](ZipFileEntry.md#directory) and [ZipDirectoryEntry#directory](#directory) properties to differentiate entries).

***

### getChildren()

> **getChildren**(`options?`): [`ZipEntry`](ZipEntry.md)[]

Gets the children of the directory

#### Parameters

##### options?

[`ZipDirectoryEntryGetChildrenOptions`](../interfaces/ZipDirectoryEntryGetChildrenOptions.md)

The options.

#### Returns

[`ZipEntry`](ZipEntry.md)[]

The array of [ZipEntry](ZipEntry.md) instances.

#### Remarks

The returned array is a snapshot taken when the method is called: entries added or removed
afterwards are not reflected, and an entry removed while the array is being iterated is still present
but detached from the filesystem.

With `recursive`, the descendants are ordered level by level, i.e. the children of a directory come
before the children of its subdirectories, like the result of `readdir(path, { recursive: true })` in
Node.js. This is also the order in which `{@link ZipDirectoryEntry}#export*()` writes them.

Unlike [ZipFS#entries](ZipFS.md#entries), the directory itself is not included and removed entries leave no empty slot.

***

### getExportedSize()

> **getExportedSize**(`options?`): `Promise`\<`number`\>

Computes the exact size in bytes of the zip file that `export*()` would produce for the entry
and its descendants, without reading or compressing any data.

Pass the same options object that will be passed to the export method, otherwise the result
will not match. The size is only determinable when every descendant is stored (i.e. `level` is
set to 0) or passed through, and has a known size; [ERR\_UNDETERMINED\_SIZE](../variables/ERR_UNDETERMINED_SIZE.md) is thrown
otherwise. Encryption does not prevent it, the overhead of ZipCrypto and AES being fixed.

The intended use is setting the `Content-Length` header of a zip file streamed over HTTP.

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`number`\>

A promise resolving to the size in bytes.

#### Remarks

Entries added with [ZipDirectoryEntry#addReadable](#addreadable) never have a known size, and
entries added with [ZipDirectoryEntry#addHttpContent](#addhttpcontent) only get one once their content has
been read. The returned size assumes a single output file, it does not apply to split zip files.

[ERR\_UNDETERMINED\_SIZE](../variables/ERR_UNDETERMINED_SIZE.md) is also thrown when the size depends on the order in which the
entries are physically written, which the buffered write path only determines at write time.
This happens when `usdz` is set, since the alignment padding depends on the offset of each
entry, and when the archive exceeds 4GB, since the offsets recorded in the central directory
are then extended to 64 bits. Passing `bufferedWrite: false` makes both determinable again,
as does exporting a directory whose children are all files. A name holding `"/"` creates the
directories it names, so `addText("a/b.txt", text)` builds a tree whose children are not all
files, even though the directories created that way are not written. It is thrown as well when
`signCentralDirectory` is set, the length of the signature being unknown until it is computed.

#### Throws

[ERR\_UNDETERMINED\_SIZE](../variables/ERR_UNDETERMINED_SIZE.md) if the size cannot be determined.

***

### getFullname()

> **getFullname**(): `string`

Returns the full filename of the entry

#### Returns

`string`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`getFullname`](ZipEntry.md#getfullname)

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

`ZipDirectoryEntry`

#### Returns

`string`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`getRelativeName`](ZipEntry.md#getrelativename)

***

### importBlob()

> **importBlob**(`blob`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Extracts a zip file provided as a `Blob` instance into the entry

#### Parameters

##### blob

`Blob`

The `Blob` instance.

##### options?

[`ZipDirectoryEntryImportOptions`](../interfaces/ZipDirectoryEntryImportOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

#### Remarks

Use [ZipDirectoryEntry#importZip](#importzip) with a [ZipReader](ZipReader.md) instance to read the data of the
zip file itself, e.g. its [ZipReader#prependedData](ZipReader.md#prependeddata) or its [ZipReader#comment](ZipReader.md#comment) property.

***

### importData64URI()

> **importData64URI**(`dataURI`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Extracts a zip file provided as a Data URI `string` encoded in Base64 into the entry

#### Parameters

##### dataURI

`string`

The Data URI `string` encoded in Base64.

##### options?

[`ZipDirectoryEntryImportOptions`](../interfaces/ZipDirectoryEntryImportOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

#### Remarks

Use [ZipDirectoryEntry#importZip](#importzip) with a [ZipReader](ZipReader.md) instance to read the data of the
zip file itself, e.g. its [ZipReader#prependedData](ZipReader.md#prependeddata) or its [ZipReader#comment](ZipReader.md#comment) property.

***

### importHttpContent()

> **importHttpContent**(`url`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Extracts a zip file fetched from a URL into the entry

#### Parameters

##### url

`string`

The URL.

##### options?

[`ZipDirectoryEntryImportHttpOptions`](../interfaces/ZipDirectoryEntryImportHttpOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

#### Remarks

Use [ZipDirectoryEntry#importZip](#importzip) with a [ZipReader](ZipReader.md) instance to read the data of the
zip file itself, e.g. its [ZipReader#prependedData](ZipReader.md#prependeddata) or its [ZipReader#comment](ZipReader.md#comment) property.

***

### importReadable()

> **importReadable**(`readable`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Extracts a zip file provided via a `ReadableStream` instance into the entry

#### Parameters

##### readable

`ReadableStream`

The `ReadableStream` instance.

##### options?

[`ZipDirectoryEntryImportOptions`](../interfaces/ZipDirectoryEntryImportOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

#### Remarks

Use [ZipDirectoryEntry#importZip](#importzip) with a [ZipReader](ZipReader.md) instance to read the data of the
zip file itself, e.g. its [ZipReader#prependedData](ZipReader.md#prependeddata) or its [ZipReader#comment](ZipReader.md#comment) property.

The stream is buffered entirely in memory, because reading a zip file requires random access. To import
a large file without buffering it, use [ZipDirectoryEntry#importZip](#importzip) with a seekable input, see
the [ZipReader](ZipReader.md) constructor remarks and the [Reader](Reader.md) examples.

***

### importUint8Array()

> **importUint8Array**(`array`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Extracts a zip file provided as a `Uint8Array` instance into the entry

#### Parameters

##### array

`Uint8Array`

The `Uint8Array` instance.

##### options?

[`ZipDirectoryEntryImportOptions`](../interfaces/ZipDirectoryEntryImportOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

#### Remarks

Use [ZipDirectoryEntry#importZip](#importzip) with a [ZipReader](ZipReader.md) instance to read the data of the
zip file itself, e.g. its [ZipReader#prependedData](ZipReader.md#prependeddata) or its [ZipReader#comment](ZipReader.md#comment) property.

***

### importZip()

> **importZip**(`reader`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Extracts a zip file provided via a custom [Reader](Reader.md) instance or a [ZipReader](ZipReader.md) instance into
the entry

#### Parameters

##### reader

`ReadableStream`\<`any`\> \| `ReadableStream`\<`any`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md) \| [`Reader`](Reader.md)\<`unknown`\> \| [`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[] \| [`ZipReader`](ZipReader.md)\<`unknown`\>

The [Reader](Reader.md) instance or the [ZipReader](ZipReader.md) instance.

##### options?

[`ZipDirectoryEntryImportOptions`](../interfaces/ZipDirectoryEntryImportOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

#### Remarks

The filename of each entry is split into path components to build the tree of entries. Empty
components and `"."` components are ignored, so `"a//b.txt"`, `"./a/b.txt"` and `"a/./b.txt"` all produce
the same `"a/b.txt"` entry. Filenames are normalized and validated beforehand, see
[GetEntriesOptions#normalizeFilename](../interfaces/GetEntriesOptions.md#normalizefilename) and [GetEntriesOptions#filenameValidation](../interfaces/GetEntriesOptions.md#filenamevalidation).

The directories created that way are navigable like any other entry but are not written back when the
tree is exported: only the directories carried by the source zip file and the ones created with
[ZipDirectoryEntry#addDirectory](#adddirectory) are written. A zip file storing no directory entry therefore
round-trips to a zip file storing no directory entry, instead of gaining one entry per path component.

Passing a [ZipReader](ZipReader.md) instance is the way to read the data of the zip file itself, e.g. its
[ZipReader#prependedData](ZipReader.md#prependeddata) or its [ZipReader#comment](ZipReader.md#comment) property, since the instance created
otherwise is not exposed. Its options are used as defaults for the options passed here, and it must not
have read its entries yet when it is created over a `ReadableStream` instance, which can only be read once.

Like the [ZipReader](ZipReader.md) constructor, a `ReadableStream` input is buffered entirely in memory, see
its remarks and the [Reader](Reader.md) examples for reading large seekable resources with random access.

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Tests if a ZipDirectoryEntry instance is an ancestor of the entry

#### Parameters

##### ancestor

`ZipDirectoryEntry`

The ZipDirectoryEntry instance.

#### Returns

`boolean`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`isDescendantOf`](ZipEntry.md#isdescendantof)

***

### isPasswordProtected()

> **isPasswordProtected**(): `boolean`

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`isPasswordProtected`](ZipEntry.md#ispasswordprotected)

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

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`rename`](ZipEntry.md#rename)

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

The options are merged into [ZipEntry#options](ZipEntry.md#options), and an option set to `undefined` is removed
from it instead of being stored. They take precedence over the options passed to
`{@link ZipDirectoryEntry}#export*()` and over the metadata of the entry they were imported from,
exactly like the options passed when adding an entry to the filesystem.

The options describing the data of an entry exported as-is, e.g.
[ZipWriterConstructorOptions#compressionMethod](../interfaces/ZipWriterConstructorOptions.md#compressionmethod) and
[ZipWriterAddDataOptions#uncompressedSize](../interfaces/ZipWriterAddDataOptions.md#uncompressedsize), are ignored: they are always the ones of the
original entry. The [ZipWriterAddDataOptions#directory](../interfaces/ZipWriterAddDataOptions.md#directory) option and the progress callbacks
are ignored as well. Invalid option values are reported when the zip file is exported.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`setOptions`](ZipEntry.md#setoptions)
