[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / TextWriter

# Class: TextWriter

Represents a [Writer](Writer.md) instance used to retrieve the written data as a `string`.

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### Constructor

> **new TextWriter**(`encoding?`): `TextWriter`

Creates the TextWriter instance

#### Parameters

##### encoding?

`string`

The encoding of the text.

#### Returns

`TextWriter`

## Properties

### encoding?

> `optional` **encoding?**: `string`

The encoding of the text returned by [TextWriter#getData](#getdata).

***

### size

> **size**: `number`

The number of bytes written into the instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`size`](../interfaces/WritableWriter.md#size)

***

### writable

> **writable**: `WritableStream`

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`string`\>

Retrieves all the written data

#### Returns

`Promise`\<`string`\>

A promise resolving to the written data.

***

### init()

> **init**(): `Promise`\<`void`\>

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)
