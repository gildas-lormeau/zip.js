[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Writer

# Class: Writer\<Type\>

Defined in: [index.d.ts:506](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L506)

Represents an instance used to write unknown type of data.

## Example

Here is an example of custom Writer class used to write binary strings:
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

### Type

`Type`

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### Constructor

> **new Writer**\<`Type`\>(): `Writer`\<`Type`\>

#### Returns

`Writer`\<`Type`\>

## Properties

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:510](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L510)

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`Type`\>

Defined in: [index.d.ts:530](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L530)

Retrieves all the written data

#### Returns

`Promise`\<`Type`\>

A promise resolving to the written data.

***

### init()?

> `optional` **init**(`size`?): `Promise`\<`void`\>

Defined in: [index.d.ts:516](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L516)

Initializes the instance asynchronously

#### Parameters

##### size?

`number`

the total size of the written data in bytes.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)

***

### writeUint8Array()

> **writeUint8Array**(`array`): `Promise`\<`void`\>

Defined in: [index.d.ts:524](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L524)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`\<`ArrayBuffer`\>

The chunk data to append.

#### Returns

`Promise`\<`void`\>
