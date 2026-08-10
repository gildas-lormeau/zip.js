[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / BlobReader

# Class: BlobReader

Defined in: [index.d.ts:605](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L605)

Represents a [Reader](Reader.md) instance used to read data provided as a `Blob` instance.

## Extends

- [`Reader`](Reader.md)\<`Blob`\>

## Constructors

### Constructor

> **new BlobReader**(`value`): `BlobReader`

Defined in: [index.d.ts:543](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L543)

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

Defined in: [index.d.ts:547](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L547)

The `ReadableStream` instance.

#### Inherited from

[`Reader`](Reader.md).[`readable`](Reader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:551](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L551)

The total size of the data in bytes.

#### Inherited from

[`Reader`](Reader.md).[`size`](Reader.md#size)

## Methods

### createReadable()

> **createReadable**(`options?`): `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:565](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L565)

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

Defined in: [index.d.ts:555](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L555)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Reader`](Reader.md).[`init`](Reader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:573](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L573)

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
