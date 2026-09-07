[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriter

# Class: ZipWriter\<Type\>

Represents an instance used to create a zip file.

## Example

Here is an example showing how to create a zip file containing a compressed text file:
```
// use a BlobWriter to store with a ZipWriter the zip into a Blob object
const blobWriter = new zip.BlobWriter("application/zip");
const writer = new zip.ZipWriter(blobWriter);

// use a TextReader to read the String to add
await writer.add("filename.txt", new zip.TextReader("test!"));

// close the ZipReader
await writer.close();

// get the zip file as a Blob
const blob = await blobWriter.getData();
```

## Type Parameters

### Type

`Type`

## Constructors

### Constructor

> **new ZipWriter**\<`Type`\>(`writer`, `options?`): `ZipWriter`\<`Type`\>

Creates the ZipWriter instance

#### Parameters

##### writer

`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `boolean`, `any`\> \| [`Writer`](Writer.md)\<`Type`\>

The [Writer](Writer.md) instance where the zip content will be written.

##### options?

[`ZipWriterConstructorOptions`](../interfaces/ZipWriterConstructorOptions.md)

The options.

#### Returns

`ZipWriter`\<`Type`\>

## Properties

### hasCorruptedEntries?

> `readonly` `optional` **hasCorruptedEntries?**: `boolean`

`true` if the zip contains at least one entry that has been partially written.

***

### warnings?

> `optional` **warnings?**: [`ArchiveWarning`](../interfaces/ArchiveWarning.md)[]

The non-fatal diagnostics deposited while writing the entries, accumulated over the life of the instance.

#### Remarks

A warning reports an adjustment the writer made silently rather than failing, so what it produced is not
what was asked for: [WARNING\_COMPRESSION\_UNAVAILABLE](../variables/WARNING_COMPRESSION_UNAVAILABLE.md) when no deflate codec is available and the
entries are stored instead, and [WARNING\_CLAMPED\_LAST\_MODIFICATION\_DATE](../variables/WARNING_CLAMPED_LAST_MODIFICATION_DATE.md) when a date outside the
MS-DOS range is written and no extra field carries the original value.

Each reason is deposited once, with the filename of the first entry it applied to, so an archive whose
entries are all affected reports one warning rather than one per entry. Read it after the entries have been
added; [ZipWriter#close](#close) deposits none of its own.

## Methods

### \[asyncDispose\]()

> **\[asyncDispose\]**(): `Promise`\<`void`\>

Calls [ZipWriter#close](#close), making the instance usable with `await using`

#### Returns

`Promise`\<`void`\>

#### Remarks

The zip file is therefore finalized when the block is left, including when it is left by an
error: the entries written until then are readable, like the ones a salvaging
[ZipWriter#close](#close) keeps. Closing the instance explicitly to collect its content stays the
common case, and the disposal that follows does nothing.

The method is only defined when the runtime provides `Symbol.asyncDispose`. Its declaration is
ignored by TypeScript versions that do not declare the symbol either, i.e. before 5.2 or without
the `esnext.disposable` library, so that the declarations of the library keep compiling there.

***

### add()

> **add**\<`ReaderType`\>(`filename`, `reader?`, `options?`): `Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

Adds an entry into the zip file

#### Type Parameters

##### ReaderType

`ReaderType`

#### Parameters

##### filename

`string`

The filename of the entry. Paths must use forward slashes ("/") as separator,
as required by section 4.4.17.1 of the zip specification. The value is stored as-is; in
particular, Windows path separators ("\\") are not converted and become part of the filename,
which is interpreted inconsistently by zip tools, and leading or trailing whitespace is
preserved, which Windows filesystems cannot represent at the end of a name.

##### reader?

`ReadableStream`\<`any`\> \| `ReadableStream`\<`any`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md) \| [`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[] \| [`Reader`](Reader.md)\<`ReaderType`\>

The  [Reader](Reader.md) instance used to read the content of the entry.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

A promise resolving to an [EntryMetaData](../interfaces/EntryMetaData.md) instance.

#### Remarks

The returned promise can safely be left un-awaited: [ZipWriter#close](#close) waits for the entry
and throws its error if it was not caught.

***

### appendZip()

> **appendZip**\<`ReaderType`\>(`reader`): `Promise`\<`void`\>

Adds the entries of an existing zip file into the current zip. This method can be called at any
time, including between calls to [ZipWriter#add](#add) and repeatedly to merge several zip files.

#### Type Parameters

##### ReaderType

`ReaderType`

#### Parameters

##### reader

`ReadableStream`\<`any`\> \| `ReadableStream`\<`any`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md) \| [`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[] \| [`Reader`](Reader.md)\<`ReaderType`\>

The [Reader](Reader.md) instance used to read the content of the zip file.

#### Returns

`Promise`\<`void`\>

A promise resolving when the zip file has been added.

#### Remarks

The data of the zip file is copied, its central directory is rebuilt and its entries are relocated to
the positions they get in the output. The disks of a split zip file passed as input are therefore unrelated to
the disks of the output, which is a single zip file unless the writer is a split zip file writer. The data of
the entries is copied as-is; in particular, the constraints set by [ZipWriterConstructorOptions#usdz](../interfaces/ZipWriterConstructorOptions.md#usdz)
are not applied to the copied entries.

Pending [ZipWriter#add](#add) calls are completed before the data is copied, and add() calls made
while the copy is in progress are written after it. If an entry of the zip file has the same
filename as an entry of the current zip, the method throws with the `ERR_DUPLICATED_NAME` error
message and leaves the current zip unchanged; call [ZipWriter#remove](#remove) beforehand to resolve
the conflicts.

The returned promise can safely be left un-awaited: [ZipWriter#close](#close) waits for the copy
and throws its error if it was not caught.

***

### close()

> **close**(`comment?`, `options?`): `Promise`\<`Type`\>

Writes the entries directory, writes the global comment, and returns the content of the zip file

#### Parameters

##### comment?

`Uint8Array`\<`ArrayBufferLike`\>

The global comment of the zip file.

##### options?

[`ZipWriterCloseOptions`](../interfaces/ZipWriterCloseOptions.md)

The options.

#### Returns

`Promise`\<`Type`\>

The content of the zip file.

#### Remarks

The global comment is passed as raw bytes and the comment of an entry
([ZipWriterAddDataOptions#comment](../interfaces/ZipWriterAddDataOptions.md#comment)) as a string on purpose, see [ZipReader#comment](ZipReader.md#comment).

If [ZipWriter#add](#add) or [ZipWriter#appendZip](#appendzip) calls failed and their rejection was
never handled — e.g. the returned promise was not awaited — this method throws the first of
these errors instead of finalizing the zip file. The `entryErrors` property of the thrown error
contains all of them. Errors already caught by the caller do not resurface here, so entries can
still be skipped by awaiting [ZipWriter#add](#add) and catching the error. Throwing the errors
counts as reporting them: catching the error of this method and calling it again finalizes the
zip file without the failed entries.

Once the zip file has been finalized, calling this method again does nothing and returns the same
content. Only a call that threw can be retried, which is what makes the salvage above possible.

***

### ~~prependZip()~~

> **prependZip**\<`ReaderType`\>(`reader`): `Promise`\<`void`\>

Adds an existing zip file at the beginning of the current zip. This method
cannot be called after the first call to [ZipWriter#add](#add).

#### Type Parameters

##### ReaderType

`ReaderType`

#### Parameters

##### reader

`ReadableStream`\<`any`\> \| `ReadableStream`\<`any`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md) \| [`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[] \| [`Reader`](Reader.md)\<`ReaderType`\>

The [Reader](Reader.md) instance used to read the content of the zip file.

#### Returns

`Promise`\<`void`\>

A promise resolving when the zip file has been added.

#### Deprecated

Use [ZipWriter#appendZip](#appendzip) instead, which is equivalent when the zip file is
empty and can also be called after entries have been added.

***

### remove()

> **remove**(`entry`): `boolean`

Removes an entry from the central directory that will be written for the zip file. The entry
data itself cannot be removed because it has already been streamed to the output.

#### Parameters

##### entry

`string` \| [`Entry`](../type-aliases/Entry.md)

The entry to remove. This can be an [Entry](../type-aliases/Entry.md) instance or the filename of the entry.

#### Returns

`boolean`

`true` if the entry has been removed, `false` otherwise.
