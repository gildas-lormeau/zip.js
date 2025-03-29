[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriter

# Class: ZipWriter\<Type\>

Defined in: [index.d.ts:1120](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1120)

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

> **new ZipWriter**\<`Type`\>(`writer`, `options`?): `ZipWriter`\<`Type`\>

Defined in: [index.d.ts:1127](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1127)

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

Defined in: [index.d.ts:1141](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1141)

`true` if the zip contains at least one entry that has been partially written.

## Methods

### add()

> **add**\<`ReaderType`\>(`filename`, `reader`?, `options`?): `Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

Defined in: [index.d.ts:1150](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1150)

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

`ReadableStream`\<`any`\> | `ReadableStream`\<`any`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md) | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | [`Reader`](Reader.md)\<`ReaderType`\>

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

A promise resolving to an [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### close()

> **close**(`comment`?, `options`?): `Promise`\<`Type`\>

Defined in: [index.d.ts:1168](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1168)

Writes the entries directory, writes the global comment, and returns the content of the zip file

#### Parameters

##### comment?

`Uint8Array`\<`ArrayBuffer`\>

The global comment of the zip file.

##### options?

[`ZipWriterCloseOptions`](../interfaces/ZipWriterCloseOptions.md)

The options.

#### Returns

`Promise`\<`Type`\>

The content of the zip file.
