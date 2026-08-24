[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Reader

# Class: Reader\<Type\>

Represents an instance used to read unknown type of data.

## Examples

Here is an example of custom Reader class used to read binary strings:
```
class BinaryStringReader extends Reader {

  constructor(binaryString) {
    super();
    this.binaryString = binaryString;
  }

  init() {
    super.init();
    this.size = this.binaryString.length;
  }

  readUint8Array(offset, length) {
    const result = new Uint8Array(length);
    for (let indexCharacter = 0; indexCharacter < length; indexCharacter++) {
      result[indexCharacter] = this.binaryString.charCodeAt(indexCharacter + offset) & 0xFF;
    }
    return result;
  }
}
```

Reading a file on the filesystem with random access does not always require a custom Reader:
on runtimes exposing files as lazily-read `Blob` instances, the `Blob` returned by
`await fs.openAsBlob(path)` on Node.js or `Bun.file(path)` on Bun can be passed directly to
[ZipReader](ZipReader.md). Deno has no equivalent API yet, see https://github.com/denoland/deno/issues/32316.
The class below reads a
`Deno.FsFile` with random access instead of buffering it entirely in memory. The `seek()` and `read()`
calls are serialized in a queue because zip.js can read multiple byte ranges concurrently:
```
class FsFileReader extends Reader {

  constructor(file) {
    super();
    this.file = file;
    this.queue = Promise.resolve();
  }

  async init() {
    super.init();
    this.size = (await this.file.stat()).size;
  }

  readUint8Array(offset, length) {
    const result = this.queue.then(async () => {
      await this.file.seek(offset, Deno.SeekMode.Start);
      const data = new Uint8Array(length);
      let bytesRead = 0;
      while (bytesRead < length) {
        const count = await this.file.read(data.subarray(bytesRead));
        if (count === null) {
          return data.subarray(0, bytesRead);
        }
        bytesRead += count;
      }
      return data;
    });
    this.queue = result.catch(() => undefined);
    return result;
  }
}
```

## Extended by

- [`TextReader`](TextReader.md)
- [`BlobReader`](BlobReader.md)
- [`Data64URIReader`](Data64URIReader.md)
- [`Uint8ArrayReader`](Uint8ArrayReader.md)
- [`SplitDataReader`](SplitDataReader.md)
- [`HttpReader`](HttpReader.md)

## Type Parameters

### Type

`Type`

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`ReadableReader`](../interfaces/ReadableReader.md)

## Constructors

### Constructor

> **new Reader**\<`Type`\>(`value`): `Reader`\<`Type`\>

Creates the Reader instance

#### Parameters

##### value

`Type`

The data to read.

#### Returns

`Reader`\<`Type`\>

## Properties

### readable

> **readable**: `ReadableStream`

The `ReadableStream` instance.

#### Implementation of

[`ReadableReader`](../interfaces/ReadableReader.md).[`readable`](../interfaces/ReadableReader.md#readable)

***

### size

> **size**: `number`

The total size of the data in bytes.

## Methods

### createReadable()

> **createReadable**(`options?`): `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Creates a `ReadableStream` of the data, optionally restricted to a byte range.

The default implementation reads the data with [Reader#readUint8Array](#readuint8array). Custom readers can
override this method to return a stream provided natively by the underlying data source.

#### Parameters

##### options?

[`CreateReadableOptions`](../interfaces/CreateReadableOptions.md)

The options.

#### Returns

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The `ReadableStream` instance.

***

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Reads a chunk of data

#### Parameters

##### index

`number`

The byte index of the data to read.

##### length

`number`

The length of the data to read in bytes.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

A promise resolving to a chunk of data. The data must be trucated to the remaining size if the requested length is larger than the remaining size.
