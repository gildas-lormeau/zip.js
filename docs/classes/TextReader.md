[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / TextReader

# Class: TextReader

Defined in: [index.d.ts:388](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L388)

Represents a [Reader](Reader.md) instance used to read data provided as a `string`.

## Extends

- [`Reader`](Reader.md)\<`string`\>

## Constructors

### Constructor

> **new TextReader**(`value`): `TextReader`

Defined in: [index.d.ts:362](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L362)

Creates the [Reader](Reader.md) instance

#### Parameters

##### value

`string`

The data to read.

#### Returns

`TextReader`

#### Inherited from

[`Reader`](Reader.md).[`constructor`](Reader.md#constructor)

## Properties

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:366](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L366)

The `ReadableStream` instance.

#### Inherited from

[`Reader`](Reader.md).[`readable`](Reader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:370](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L370)

The total size of the data in bytes.

#### Inherited from

[`Reader`](Reader.md).[`size`](Reader.md#size)

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:374](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L374)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Reader`](Reader.md).[`init`](Reader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:382](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L382)

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
