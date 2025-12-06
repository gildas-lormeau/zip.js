[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitDataReader

# Class: SplitDataReader

Defined in: [index.d.ts:419](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L419)

Represents a [Reader](Reader.md) instance used to read data provided as an array of [ReadableReader](../interfaces/ReadableReader.md) instances (e.g. split zip files).

## Extends

- [`Reader`](Reader.md)\<[`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[] \| `ReadableStream`[]\>

## Constructors

### Constructor

> **new SplitDataReader**(`value`): `SplitDataReader`

Defined in: [index.d.ts:373](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L373)

Creates the [Reader](Reader.md) instance

#### Parameters

##### value

The data to read.

[`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`\<`any`\>[]

#### Returns

`SplitDataReader`

#### Inherited from

[`Reader`](Reader.md).[`constructor`](Reader.md#constructor)

## Properties

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:377](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L377)

The `ReadableStream` instance.

#### Inherited from

[`Reader`](Reader.md).[`readable`](Reader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:381](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L381)

The total size of the data in bytes.

#### Inherited from

[`Reader`](Reader.md).[`size`](Reader.md#size)

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:385](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L385)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Reader`](Reader.md).[`init`](Reader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:393](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L393)

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

#### Inherited from

[`Reader`](Reader.md).[`readUint8Array`](Reader.md#readuint8array)
