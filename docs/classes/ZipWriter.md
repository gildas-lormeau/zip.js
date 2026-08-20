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

## Methods

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
which is interpreted inconsistently by zip tools.

##### reader?

`ReadableStream`\<`any`\> \| `ReadableStream`\<`any`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md) \| [`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[] \| [`Reader`](Reader.md)\<`ReaderType`\>

The  [Reader](Reader.md) instance used to read the content of the entry.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

A promise resolving to an [EntryMetaData](../interfaces/EntryMetaData.md) instance.

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

***

### prependZip()

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

#### Remarks

A split zip file is read as usual and written as a single zip file, its entries being relocated to the
offsets they get once the disks are concatenated.

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
