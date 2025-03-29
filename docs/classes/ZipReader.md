[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReader

# Class: ZipReader\<Type\>

Defined in: [index.d.ts:696](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L696)

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

> **new ZipReader**\<`Type`\>(`reader`, `options`?): `ZipReader`\<`Type`\>

Defined in: [index.d.ts:703](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L703)

Creates the instance

#### Parameters

##### reader

The [Reader](Reader.md) instance used to read data.

`ReadableStream`\<`any`\> | `ReadableStream`\<`any`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md) | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | [`Reader`](Reader.md)\<`Type`\>

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`ZipReader`\<`Type`\>

## Properties

### appendedData?

> `optional` **appendedData**: `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:724](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L724)

The data appended after the zip file.

***

### comment

> **comment**: `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:716](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L716)

The global comment of the zip file.

***

### prependedData?

> `optional` **prependedData**: `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:720](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L720)

The data prepended before the zip file.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [index.d.ts:744](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L744)

Closes the zip file

#### Returns

`Promise`\<`void`\>

***

### getEntries()

> **getEntries**(`options`?): `Promise`\<[`Entry`](../interfaces/Entry.md)[]\>

Defined in: [index.d.ts:731](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L731)

Returns all the entries in the zip file

#### Parameters

##### options?

[`ZipReaderGetEntriesOptions`](../interfaces/ZipReaderGetEntriesOptions.md)

The options.

#### Returns

`Promise`\<[`Entry`](../interfaces/Entry.md)[]\>

A promise resolving to an `array` of [Entry](../interfaces/Entry.md) instances.

***

### getEntriesGenerator()

> **getEntriesGenerator**(`options`?): `AsyncGenerator`\<[`Entry`](../interfaces/Entry.md), `boolean`\>

Defined in: [index.d.ts:738](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L738)

Returns a generator used to iterate on all the entries in the zip file

#### Parameters

##### options?

[`ZipReaderGetEntriesOptions`](../interfaces/ZipReaderGetEntriesOptions.md)

The options.

#### Returns

`AsyncGenerator`\<[`Entry`](../interfaces/Entry.md), `boolean`\>

An asynchronous generator of [Entry](../interfaces/Entry.md) instances.
