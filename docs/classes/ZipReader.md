[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReader

# Class: ZipReader\<Type\>

Defined in: [index.d.ts:864](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L864)

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

Defined in: [index.d.ts:871](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L871)

Creates the instance

#### Parameters

##### reader

The [Reader](Reader.md) instance used to read data.

`ReadableStream`\<`any`\> | [`ReadableReader`](../interfaces/ReadableReader.md) | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`\<`any`\>[] | [`Reader`](Reader.md)\<`Type`\>

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`ZipReader`\<`Type`\>

## Properties

### appendedData?

> `optional` **appendedData**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:892](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L892)

The data appended after the zip file.

***

### comment

> **comment**: `Uint8Array`

Defined in: [index.d.ts:884](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L884)

The global comment of the zip file.

***

### prependedData?

> `optional` **prependedData**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:888](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L888)

The data prepended before the zip file.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [index.d.ts:912](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L912)

Closes the zip file

#### Returns

`Promise`\<`void`\>

***

### getEntries()

> **getEntries**(`options?`): `Promise`\<[`Entry`](../type-aliases/Entry.md)[]\>

Defined in: [index.d.ts:899](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L899)

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

Defined in: [index.d.ts:906](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L906)

Returns a generator used to iterate on all the entries in the zip file

#### Parameters

##### options?

[`ZipReaderGetEntriesOptions`](../interfaces/ZipReaderGetEntriesOptions.md)

The options.

#### Returns

`AsyncGenerator`\<[`Entry`](../type-aliases/Entry.md), `boolean`\>

An asynchronous generator of [Entry](../type-aliases/Entry.md) instances.
