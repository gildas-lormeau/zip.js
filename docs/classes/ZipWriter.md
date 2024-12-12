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

• **Type**

## Constructors

### new ZipWriter()

> **new ZipWriter**\<`Type`\>(`writer`, `options`?): [`ZipWriter`](ZipWriter.md)\<`Type`\>

Creates the [ZipWriter](ZipWriter.md) instance

#### Parameters

##### writer

The [Writer](Writer.md) instance where the zip content will be written.

`WritableStream`\<`any`\> | [`WritableWriter`](../interfaces/WritableWriter.md) | `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `boolean`, `any`\> | [`Writer`](Writer.md)\<`Type`\>

##### options?

[`ZipWriterConstructorOptions`](../interfaces/ZipWriterConstructorOptions.md)

The options.

#### Returns

[`ZipWriter`](ZipWriter.md)\<`Type`\>

#### Defined in

[index.d.ts:1115](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1115)

## Properties

### hasCorruptedEntries?

> `readonly` `optional` **hasCorruptedEntries**: `boolean`

`true` if the zip contains at least one entry that has been partially written.

#### Defined in

[index.d.ts:1129](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1129)

## Methods

### add()

> **add**\<`ReaderType`\>(`filename`, `reader`?, `options`?): `Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

Adds an entry into the zip file

#### Type Parameters

• **ReaderType**

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

#### Defined in

[index.d.ts:1138](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1138)

***

### close()

> **close**(`comment`?, `options`?): `Promise`\<`Type`\>

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

#### Defined in

[index.d.ts:1156](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1156)
