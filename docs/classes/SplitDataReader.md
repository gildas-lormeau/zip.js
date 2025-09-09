[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitDataReader

# Class: SplitDataReader

Defined in: [index.d.ts:408](https://github.com/gildas-lormeau/zip.js/blob/3fe977a027ef9183833f51be22c11dda80bcb12f/index.d.ts#L408)

Represents a [Reader](Reader.md) instance used to read data provided as an array of [ReadableReader](../interfaces/ReadableReader.md) instances (e.g. split zip files).

## Extends

- [`Reader`](Reader.md)\<[`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[] \| `ReadableStream`[]\>

## Constructors

### Constructor

> **new SplitDataReader**(`value`): `SplitDataReader`

Defined in: [index.d.ts:362](https://github.com/gildas-lormeau/zip.js/blob/3fe977a027ef9183833f51be22c11dda80bcb12f/index.d.ts#L362)

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

Defined in: [index.d.ts:366](https://github.com/gildas-lormeau/zip.js/blob/3fe977a027ef9183833f51be22c11dda80bcb12f/index.d.ts#L366)

The `ReadableStream` instance.

#### Inherited from

[`Reader`](Reader.md).[`readable`](Reader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:370](https://github.com/gildas-lormeau/zip.js/blob/3fe977a027ef9183833f51be22c11dda80bcb12f/index.d.ts#L370)

The total size of the data in bytes.

#### Inherited from

[`Reader`](Reader.md).[`size`](Reader.md#size)

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:374](https://github.com/gildas-lormeau/zip.js/blob/3fe977a027ef9183833f51be22c11dda80bcb12f/index.d.ts#L374)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Reader`](Reader.md).[`init`](Reader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:382](https://github.com/gildas-lormeau/zip.js/blob/3fe977a027ef9183833f51be22c11dda80bcb12f/index.d.ts#L382)

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
