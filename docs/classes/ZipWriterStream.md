[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterStream

# Class: ZipWriterStream

Defined in: [index.d.ts:1216](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1216)

Represents an instance used to create a zipped stream.

## Examples

This example creates a zipped file called numbers.txt.zip containing the numbers 0 - 1000 each on their own line.
```
const readable = ReadableStream.from((function* () {
  for (let i = 0; i < 1000; ++i)
    yield i + '\n'
})())

readable
  .pipeThrough(new ZipWriterStream().transform('numbers.txt'))
  .pipeTo((await Deno.create('numbers.txt.zip')).writable)
```

This example creates a zipped file called Archive.zip containing two files called numbers.txt and letters.txt
```
const readable1 = ReadableStream.from((function* () {
  for (let i = 0; i < 1000; ++i)
    yield i + '\n'
})())
const readable2 = ReadableStream.from((function* () {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
  while (letters.length)
    yield letters.shift() + '\n'
})())

const zipper = new ZipWriterStream()
zipper.readable.pipeTo((await Deno.create('Archive.zip')).writable)
readable1.pipeTo(zipper.writable('numbers.txt'))
readable2.pipeTo(zipper.writable('letters.txt'))
zipper.close()
```

## Constructors

### Constructor

> **new ZipWriterStream**(`options?`): `ZipWriterStream`

Defined in: [index.d.ts:1222](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1222)

Creates the stream.

#### Parameters

##### options?

[`ZipWriterConstructorOptions`](../interfaces/ZipWriterConstructorOptions.md)

The options.

#### Returns

`ZipWriterStream`

## Properties

### readable

> **readable**: `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:1227](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1227)

The readable stream.

***

### zipWriter

> **zipWriter**: [`ZipWriter`](ZipWriter.md)\<`unknown`\>

Defined in: [index.d.ts:1232](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1232)

The ZipWriter property.

## Methods

### close()

> **close**(`comment?`, `options?`): `Promise`\<`unknown`\>

Defined in: [index.d.ts:1259](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1259)

Writes the entries directory, writes the global comment, and returns the content of the zipped file.

#### Parameters

##### comment?

`Uint8Array`

The global comment of the zip file.

##### options?

[`ZipWriterCloseOptions`](../interfaces/ZipWriterCloseOptions.md)

The options.

#### Returns

`Promise`\<`unknown`\>

The content of the zip file.

***

### transform()

> **transform**\<`T`\>(`path`): `object`

Defined in: [index.d.ts:1240](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1240)

Returns an object containing a readable and writable property for the .pipeThrough method

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

The name of the stream when unzipped.

#### Returns

`object`

An object containing readable and writable properties

##### readable

> **readable**: `ReadableStream`\<`T`\>

##### writable

> **writable**: `WritableStream`\<`T`\>

***

### writable()

> **writable**\<`T`\>(`path`): `WritableStream`\<`T`\>

Defined in: [index.d.ts:1250](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1250)

Returns a WritableStream for the .pipeTo method

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

The directory path of where the stream should exist in the zipped stream.

#### Returns

`WritableStream`\<`T`\>

A WritableStream.
