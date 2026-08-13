[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Uint8ArrayReader

# Class: Uint8ArrayReader

Defined in: [index.d.ts:722](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L722)

Represents a [Reader](Reader.md) instance used to read data provided as a `Uint8Array` instance.

## Extends

- [`Reader`](Reader.md)\<`Uint8Array`\>

## Constructors

### Constructor

> **new Uint8ArrayReader**(`value`): `Uint8ArrayReader`

Defined in: [index.d.ts:650](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L650)

Creates the [Reader](Reader.md) instance

#### Parameters

##### value

`Uint8Array`

The data to read.

#### Returns

`Uint8ArrayReader`

#### Inherited from

[`Reader`](Reader.md).[`constructor`](Reader.md#constructor)

## Properties

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:654](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L654)

The `ReadableStream` instance.

#### Inherited from

[`Reader`](Reader.md).[`readable`](Reader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:658](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L658)

The total size of the data in bytes.

#### Inherited from

[`Reader`](Reader.md).[`size`](Reader.md#size)

## Methods

### createReadable()

> **createReadable**(`options?`): `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:672](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L672)

Creates a `ReadableStream` of the data, optionally restricted to a byte range.

The default implementation reads the data with [Reader#readUint8Array](Reader.md#readuint8array). Custom readers can
override this method to return a stream provided natively by the underlying data source.

#### Parameters

##### options?

[`CreateReadableOptions`](../interfaces/CreateReadableOptions.md)

The options.

#### Returns

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The `ReadableStream` instance.

#### Inherited from

[`Reader`](Reader.md).[`createReadable`](Reader.md#createreadable)

***

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:662](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L662)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Reader`](Reader.md).[`init`](Reader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:680](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L680)

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
