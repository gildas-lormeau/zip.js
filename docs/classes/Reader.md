[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Reader

# Class: Reader\<Type\>

Defined in: [index.d.ts:356](https://github.com/gildas-lormeau/zip.js/blob/048592eb3ecd62abf9aa99b38374e6c15b43dfe8/index.d.ts#L356)

Represents an instance used to read unknown type of data.

## Example

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

Defined in: [index.d.ts:362](https://github.com/gildas-lormeau/zip.js/blob/048592eb3ecd62abf9aa99b38374e6c15b43dfe8/index.d.ts#L362)

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

Defined in: [index.d.ts:366](https://github.com/gildas-lormeau/zip.js/blob/048592eb3ecd62abf9aa99b38374e6c15b43dfe8/index.d.ts#L366)

The `ReadableStream` instance.

#### Implementation of

[`ReadableReader`](../interfaces/ReadableReader.md).[`readable`](../interfaces/ReadableReader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:370](https://github.com/gildas-lormeau/zip.js/blob/048592eb3ecd62abf9aa99b38374e6c15b43dfe8/index.d.ts#L370)

The total size of the data in bytes.

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:374](https://github.com/gildas-lormeau/zip.js/blob/048592eb3ecd62abf9aa99b38374e6c15b43dfe8/index.d.ts#L374)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:382](https://github.com/gildas-lormeau/zip.js/blob/048592eb3ecd62abf9aa99b38374e6c15b43dfe8/index.d.ts#L382)

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
