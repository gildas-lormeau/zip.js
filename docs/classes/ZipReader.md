[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReader

# Class: ZipReader\<Type\>

Represents an instance used to read a zip file.

## Example

Here is an example showing how to read the text data of the first entry from a zip file:
```
// create a BlobReader to read with a ZipReader the zip from a Blob object
const reader = new zip.ZipReader(new zip.BlobReader(blob));

// get all entries from the zip
const entries = await reader.getEntries();
if (entries.length) {

  // get first entry content as text by using a TextWriter
  const text = await entries[0].getData(
    // writer
    new zip.TextWriter(),
    // options
    {
      onprogress: (index, max) => {
        // onprogress callback
      }
    }
  );
  // text contains the entry data as a String
  console.log(text);
}

// close the ZipReader
await reader.close();
```

## Type Parameters

### Type

`Type`

## Constructors

### Constructor

> **new ZipReader**\<`Type`\>(`reader`, `options?`): `ZipReader`\<`Type`\>

Creates the instance

#### Parameters

##### reader

`ReadableStream`\<`any`\> \| `ReadableStream`\<`any`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md) \| [`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[] \| [`Reader`](Reader.md)\<`Type`\>

The [Reader](Reader.md) instance used to read data.

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`ZipReader`\<`Type`\>

## Properties

### appendedData?

> `optional` **appendedData?**: `Uint8Array`\<`ArrayBufferLike`\>

The data appended after the zip file.

***

### comment

> **comment**: `Uint8Array`

The global comment of the zip file.

#### Remarks

Unlike [EntryMetaData#comment](../interfaces/EntryMetaData.md#comment), it is exposed as raw bytes because the zip format defines no
way to record its encoding: section 4.4.26 of the zip specification says nothing about it, and the
end of central directory record has neither a general purpose bit flag nor an extra field, so the
language encoding flag (see Appendix D - Language Encoding (EFS)) cannot apply to it. Decode it with
the encoding agreed with the producer of the zip file.

***

### digitalSignature?

> `optional` **digitalSignature?**: `Uint8Array`\<`ArrayBufferLike`\>

The data of the digital signature record of the central directory (see
[ZipWriterCloseOptions#signCentralDirectory](../interfaces/ZipWriterCloseOptions.md#signcentraldirectory)), if the zip file contains one.

#### Remarks

zip.js does not verify signatures. The signed data is the central directory records, read at
[ZipReader#directoryOffset](#directoryoffset), and it never includes the digital signature record itself. Some writers
(e.g. SecureZIP) store that record inside [ZipReader#directoryLength](#directorylength), so verifying the whole declared
range would always fail.

***

### directoryLength?

> `optional` **directoryLength?**: `number`

The length in bytes of the central directory as declared in the end of central directory record. Some
writers (e.g. SecureZIP) include the digital signature record in that length, so subtract
`6 + digitalSignature.length` from it when the record is stored inside the declared range.

***

### directoryOffset?

> `optional` **directoryOffset?**: `number`

The offset of the central directory in the zip file.

***

### prependedData?

> `optional` **prependedData?**: `Uint8Array`\<`ArrayBufferLike`\>

The data prepended before the zip file.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Closes the zip file

#### Returns

`Promise`\<`void`\>

#### Remarks

It cancels the `ReadableStream` instance passed to the constructor when nothing has been read
from it, which is the only resource a ZipReader instance can hold. It does nothing otherwise: the
stream is already consumed once [ZipReader#getEntries](#getentries) has read the entries into memory, and the
[Reader](Reader.md) instances are never closed, they belong to the caller. The entries returned by
[ZipReader#getEntries](#getentries) can therefore still be read after calling it.

***

### getEntries()

> **getEntries**(`options?`): `Promise`\<[`Entry`](../type-aliases/Entry.md)[]\>

Returns all the entries in the zip file

#### Parameters

##### options?

[`ZipReaderGetEntriesOptions`](../interfaces/ZipReaderGetEntriesOptions.md)

The options.

#### Returns

`Promise`\<[`Entry`](../type-aliases/Entry.md)[]\>

A promise resolving to an `array` of [Entry](../type-aliases/Entry.md) instances.

***

### getEntriesGenerator()

> **getEntriesGenerator**(`options?`): `AsyncGenerator`\<[`Entry`](../type-aliases/Entry.md), `boolean`\>

Returns a generator used to iterate on all the entries in the zip file

#### Parameters

##### options?

[`ZipReaderGetEntriesOptions`](../interfaces/ZipReaderGetEntriesOptions.md)

The options.

#### Returns

`AsyncGenerator`\<[`Entry`](../type-aliases/Entry.md), `boolean`\>

An asynchronous generator of [Entry](../type-aliases/Entry.md) instances.
