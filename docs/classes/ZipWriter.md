[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriter

# Class: ZipWriter\<Type\>

Defined in: [index.d.ts:1125](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1125)

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

• **Type**

## Constructors

### new ZipWriter()

> **new ZipWriter**\<`Type`\>(`writer`, `options`?): [`ZipWriter`](ZipWriter.md)\<`Type`\>

Defined in: [index.d.ts:1132](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1132)

Creates the [ZipWriter](ZipWriter.md) instance

#### Parameters

##### writer

The [Writer](Writer.md) instance where the zip content will be written.

`WritableStream` | [`WritableWriter`](../interfaces/WritableWriter.md) | `AsyncGenerator`\<`WritableStream` \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `boolean`\> | [`Writer`](Writer.md)\<`Type`\>

##### options?

[`ZipWriterConstructorOptions`](../interfaces/ZipWriterConstructorOptions.md)

The options.

#### Returns

[`ZipWriter`](ZipWriter.md)\<`Type`\>

## Properties

### hasCorruptedEntries?

> `readonly` `optional` **hasCorruptedEntries**: `boolean`

Defined in: [index.d.ts:1146](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1146)

`true` if the zip contains at least one entry that has been partially written.

## Methods

### add()

> **add**\<`ReaderType`\>(`filename`, `reader`?, `options`?): `Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

Defined in: [index.d.ts:1155](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1155)

Adds an entry into the zip file

#### Type Parameters

• **ReaderType**

#### Parameters

##### filename

`string`

The filename of the entry.

##### reader?

The  [Reader](Reader.md) instance used to read the content of the entry.

`ReadableStream` | [`ReadableReader`](../interfaces/ReadableReader.md) | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`[] | [`Reader`](Reader.md)\<`ReaderType`\>

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

A promise resolving to an [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### close()

> **close**(`comment`?, `options`?): `Promise`\<`Type`\>

Defined in: [index.d.ts:1173](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1173)

Writes the entries directory, writes the global comment, and returns the content of the zip file

#### Parameters

##### comment?

`Uint8Array`

The global comment of the zip file.

##### options?

[`ZipWriterCloseOptions`](../interfaces/ZipWriterCloseOptions.md)

The options.

#### Returns

`Promise`\<`Type`\>

The content of the zip file.
