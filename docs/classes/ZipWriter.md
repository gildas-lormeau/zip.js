[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriter

# Class: ZipWriter\<Type\>

Defined in: [index.d.ts:1340](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1340)

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

Defined in: [index.d.ts:1347](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1347)

Creates the ZipWriter instance

#### Parameters

##### writer

The [Writer](Writer.md) instance where the zip content will be written.

`WritableStream`\<`any`\> | [`WritableWriter`](../interfaces/WritableWriter.md) | `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `boolean`, `any`\> | [`Writer`](Writer.md)\<`Type`\>

##### options?

[`ZipWriterConstructorOptions`](../interfaces/ZipWriterConstructorOptions.md)

The options.

#### Returns

`ZipWriter`\<`Type`\>

## Properties

### hasCorruptedEntries?

> `readonly` `optional` **hasCorruptedEntries**: `boolean`

Defined in: [index.d.ts:1361](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1361)

`true` if the zip contains at least one entry that has been partially written.

## Methods

### add()

> **add**\<`ReaderType`\>(`filename`, `reader?`, `options?`): `Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

Defined in: [index.d.ts:1388](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1388)

Adds an entry into the zip file

#### Type Parameters

##### ReaderType

`ReaderType`

#### Parameters

##### filename

`string`

The filename of the entry.

##### reader?

The  [Reader](Reader.md) instance used to read the content of the entry.

`ReadableStream`\<`any`\> | [`ReadableReader`](../interfaces/ReadableReader.md) | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`\<`any`\>[] | [`Reader`](Reader.md)\<`ReaderType`\>

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

A promise resolving to an [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### close()

> **close**(`comment?`, `options?`): `Promise`\<`Type`\>

Defined in: [index.d.ts:1416](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1416)

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

***

### prependZip()

> **prependZip**\<`ReaderType`\>(`reader`): `Promise`\<`void`\>

Defined in: [index.d.ts:1370](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1370)

Adds an existing zip file at the beginning of the current zip. This method
cannot be called after the first call to [ZipWriter#add](#add).

#### Type Parameters

##### ReaderType

`ReaderType`

#### Parameters

##### reader

The [Reader](Reader.md) instance used to read the content of the zip file.

`ReadableStream`\<`any`\> | [`ReadableReader`](../interfaces/ReadableReader.md) | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`\<`any`\>[] | [`Reader`](Reader.md)\<`ReaderType`\>

#### Returns

`Promise`\<`void`\>

A promise resolving when the zip file has been added.

***

### remove()

> **remove**(`entry`): `boolean`

Defined in: [index.d.ts:1407](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L1407)

Removes an entry from the zip file. Note that the entry is not removed from the zip file, but it
is not written to the entries directory.

#### Parameters

##### entry

The entry to remove. This can be an [Entry](../type-aliases/Entry.md) instance or the filename of the entry.

`string` | [`Entry`](../type-aliases/Entry.md)

#### Returns

`boolean`

`true` if the entry has been removed, `false` otherwise.
