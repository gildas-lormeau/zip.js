[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Writer

# Class: Writer\<Type\>

Represents an instance used to write unknown type of data.

## Example

Here is an example of custom [Writer](Writer.md) class used to write binary strings:
```
class BinaryStringWriter extends Writer {

  constructor() {
    super();
    this.binaryString = "";
  }

  writeUint8Array(array) {
    for (let indexCharacter = 0; indexCharacter < array.length; indexCharacter++) {
      this.binaryString += String.fromCharCode(array[indexCharacter]);
    }
  }

  getData() {
    return this.binaryString;
  }
}
```

## Extended by

- [`TextWriter`](TextWriter.md)
- [`Data64URIWriter`](Data64URIWriter.md)
- [`Uint8ArrayWriter`](Uint8ArrayWriter.md)

## Type Parameters

• **Type**

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### new Writer()

> **new Writer**\<`Type`\>(): [`Writer`](Writer.md)\<`Type`\>

#### Returns

[`Writer`](Writer.md)\<`Type`\>

## Properties

### writable

> **writable**: `WritableStream`\<`any`\>

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

#### Defined in

[index.d.ts:515](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L515)

## Methods

### getData()

> **getData**(): `Promise`\<`Type`\>

Retrieves all the written data

#### Returns

`Promise`\<`Type`\>

A promise resolving to the written data.

#### Defined in

[index.d.ts:535](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L535)

***

### init()?

> `optional` **init**(`size`?): `Promise`\<`void`\>

Initializes the instance asynchronously

#### Parameters

##### size?

`number`

the total size of the written data in bytes.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)

#### Defined in

[index.d.ts:521](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L521)

***

### writeUint8Array()

> **writeUint8Array**(`array`): `Promise`\<`void`\>

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`\<`ArrayBufferLike`\>

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Defined in

[index.d.ts:529](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L529)
