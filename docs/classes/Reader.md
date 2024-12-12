[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Reader

# Class: Reader\<Type\>

Represents an instance used to read unknown type of data.

## Example

Here is an example of custom [Reader](Reader.md) class used to read binary strings:
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

• **Type**

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`ReadableReader`](../interfaces/ReadableReader.md)

## Constructors

### new Reader()

> **new Reader**\<`Type`\>(`value`): [`Reader`](Reader.md)\<`Type`\>

Creates the [Reader](Reader.md) instance

#### Parameters

##### value

`Type`

The data to read.

#### Returns

[`Reader`](Reader.md)\<`Type`\>

#### Defined in

[index.d.ts:338](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L338)

## Properties

### readable

> **readable**: `ReadableStream`\<`any`\>

The `ReadableStream` instance.

#### Implementation of

[`ReadableReader`](../interfaces/ReadableReader.md).[`readable`](../interfaces/ReadableReader.md#readable)

#### Defined in

[index.d.ts:342](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L342)

***

### size

> **size**: `number`

The total size of the data in bytes.

#### Defined in

[index.d.ts:346](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L346)

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)

#### Defined in

[index.d.ts:350](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L350)

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

A promise resolving to a chunk of data.

#### Defined in

[index.d.ts:358](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L358)
