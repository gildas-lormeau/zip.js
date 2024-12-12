[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterStream

# Class: ZipWriterStream

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

### new ZipWriterStream()

> **new ZipWriterStream**(`options`?): [`ZipWriterStream`](ZipWriterStream.md)

Creates the stream.

#### Parameters

##### options?

[`ZipWriterConstructorOptions`](../interfaces/ZipWriterConstructorOptions.md)

The options.

#### Returns

[`ZipWriterStream`](ZipWriterStream.md)

#### Defined in

[index.d.ts:1045](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1045)

## Properties

### readable

> **readable**: `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The readable stream.

#### Defined in

[index.d.ts:1050](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1050)

***

### zipWriter

> **zipWriter**: [`ZipWriter`](ZipWriter.md)\<`unknown`\>

The ZipWriter property.

#### Defined in

[index.d.ts:1055](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1055)

## Methods

### close()

> **close**(`comment`?, `options`?): `Promise`\<`unknown`\>

Writes the entries directory, writes the global comment, and returns the content of the zipped file.

#### Parameters

##### comment?

`Uint8Array`\<`ArrayBufferLike`\>

The global comment of the zip file.

##### options?

[`ZipWriterCloseOptions`](../interfaces/ZipWriterCloseOptions.md)

The options.

#### Returns

`Promise`\<`unknown`\>

The content of the zip file.

#### Defined in

[index.d.ts:1082](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1082)

***

### transform()

> **transform**\<`T`\>(`path`): `object`

Returns an object containing a readable and writable property for the .pipeThrough method

#### Type Parameters

• **T**

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

#### Defined in

[index.d.ts:1063](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1063)

***

### writable()

> **writable**\<`T`\>(`path`): `WritableStream`\<`T`\>

Returns a WritableStream for the .pipeTo method

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

The directory path of where the stream should exist in the zipped stream.

#### Returns

`WritableStream`\<`T`\>

A WritableStream.

#### Defined in

[index.d.ts:1073](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1073)
