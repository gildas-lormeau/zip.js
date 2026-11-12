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
  .pipeThrough(new TextEncoderStream())
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
readable1.pipeThrough(new TextEncoderStream()).pipeTo(zipper.writable('numbers.txt'))
readable2.pipeThrough(new TextEncoderStream()).pipeTo(zipper.writable('letters.txt'))
zipper.close()
```

The streams piped into the instance must carry `Uint8Array` chunks: a stream of strings must go through a
`TextEncoderStream` first, as above.

## Constructors

### Constructor

> **new ZipWriterStream**(`options?`): `ZipWriterStream`

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

The readable stream.

***

### zipWriter

> **zipWriter**: [`ZipWriter`](ZipWriter.md)\<`unknown`\>

The ZipWriter property.

## Methods

### close()

> **close**(`comment?`, `options?`): `Promise`\<`unknown`\>

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

#### Remarks

If an entry could not be written, this method aborts the zipped stream with the error — the
readable side of the stream fails instead of ending — and throws it. The `entryErrors` property
of the thrown error contains the errors of all the failed entries.

***

### transform()

> **transform**(`path`): `object`

Returns an object containing a readable and writable property for the .pipeThrough method

#### Parameters

##### path

`string`

The name of the stream when unzipped. Paths must use forward slashes ("/") as
separator (see [ZipWriter#add](ZipWriter.md#add)).

#### Returns

`object`

An object containing readable and writable properties: the writable side accepts the `Uint8Array`
chunks of the entry, the readable side is the zipped stream, i.e. [ZipWriterStream#readable](#readable).

##### readable

> **readable**: `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### writable

> **writable**: `WritableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### writable()

> **writable**(`path`): `WritableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Returns a WritableStream for the .pipeTo method

#### Parameters

##### path

`string`

The directory path of where the stream should exist in the zipped stream. Paths
must use forward slashes ("/") as separator (see [ZipWriter#add](ZipWriter.md#add)).

#### Returns

`WritableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

A WritableStream accepting the `Uint8Array` chunks of the entry.
