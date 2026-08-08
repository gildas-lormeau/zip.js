[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / BlobReader

# Class: BlobReader

Defined in: [index.d.ts:551](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L551)

Represents a [Reader](Reader.md) instance used to read data provided as a `Blob` instance.

## Extends

- [`Reader`](Reader.md)\<`Blob`\>

## Constructors

### Constructor

> **new BlobReader**(`value`): `BlobReader`

Defined in: [index.d.ts:489](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L489)

Creates the [Reader](Reader.md) instance

#### Parameters

##### value

`Blob`

The data to read.

#### Returns

`BlobReader`

#### Inherited from

[`Reader`](Reader.md).[`constructor`](Reader.md#constructor)

## Properties

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:493](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L493)

The `ReadableStream` instance.

#### Inherited from

[`Reader`](Reader.md).[`readable`](Reader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:497](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L497)

The total size of the data in bytes.

#### Inherited from

[`Reader`](Reader.md).[`size`](Reader.md#size)

## Methods

### createReadable()

> **createReadable**(`options?`): `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:511](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L511)

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

Defined in: [index.d.ts:501](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L501)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Reader`](Reader.md).[`init`](Reader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:519](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L519)

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
