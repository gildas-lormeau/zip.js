[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / TextReader

# Class: TextReader

Defined in: [index.d.ts:364](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L364)

Represents a [Reader](Reader.md) instance used to read data provided as a `string`.

## Extends

- [`Reader`](Reader.md)\<`string`\>

## Constructors

### new TextReader()

> **new TextReader**(`value`): [`TextReader`](TextReader.md)

Defined in: [index.d.ts:338](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L338)

Creates the [Reader](Reader.md) instance

#### Parameters

##### value

`string`

The data to read.

#### Returns

[`TextReader`](TextReader.md)

#### Inherited from

[`Reader`](Reader.md).[`constructor`](Reader.md#constructors)

## Properties

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:342](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L342)

The `ReadableStream` instance.

#### Inherited from

[`Reader`](Reader.md).[`readable`](Reader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:346](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L346)

The total size of the data in bytes.

#### Inherited from

[`Reader`](Reader.md).[`size`](Reader.md#size)

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:350](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L350)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Reader`](Reader.md).[`init`](Reader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\>

Defined in: [index.d.ts:358](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L358)

Reads a chunk of data

#### Parameters

##### index

`number`

The byte index of the data to read.

##### length

`number`

The length of the data to read in bytes.

#### Returns

`Promise`\<`Uint8Array`\>

A promise resolving to a chunk of data.

#### Inherited from

[`Reader`](Reader.md).[`readUint8Array`](Reader.md#readuint8array)
