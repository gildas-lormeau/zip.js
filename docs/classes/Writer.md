[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Writer

# Class: Writer\<Type\>

Defined in: [index.d.ts:674](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L674)

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

Defined in: [index.d.ts:678](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L678)

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`Type`\>

Defined in: [index.d.ts:698](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L698)

Retrieves all the written data

#### Returns

`Promise`\<`Type`\>

A promise resolving to the written data.

***

### init()?

> `optional` **init**(`size?`): `Promise`\<`void`\>

Defined in: [index.d.ts:684](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L684)

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

Defined in: [index.d.ts:692](https://github.com/gildas-lormeau/zip.js/blob/a8683b5808f1a1fcac8b2988f79c4fbbc6b3e88f/index.d.ts#L692)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`

The chunk data to append.

#### Returns

`Promise`\<`void`\>
