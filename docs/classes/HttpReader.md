[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpReader

# Class: HttpReader

Represents a [Reader](Reader.md) instance used to fetch data from a URL.

## Extends

- [`Reader`](Reader.md)\<[`URLString`](../interfaces/URLString.md)\>

## Extended by

- [`HttpRangeReader`](HttpRangeReader.md)

## Constructors

### new HttpReader()

> **new HttpReader**(`url`, `options`?): [`HttpReader`](HttpReader.md)

Creates the [HttpReader](HttpReader.md) instance

#### Parameters

##### url

The URL of the data.

`URL` | [`URLString`](../interfaces/URLString.md)

##### options?

[`HttpOptions`](../interfaces/HttpOptions.md)

The options.

#### Returns

[`HttpReader`](HttpReader.md)

#### Overrides

[`Reader`](Reader.md).[`constructor`](Reader.md#constructors)

#### Defined in

[index.d.ts:409](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L409)

## Properties

### readable

> **readable**: `ReadableStream`\<`any`\>

The `ReadableStream` instance.

#### Inherited from

[`Reader`](Reader.md).[`readable`](Reader.md#readable)

#### Defined in

[index.d.ts:342](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L342)

***

### size

> **size**: `number`

The total size of the data in bytes.

#### Inherited from

[`Reader`](Reader.md).[`size`](Reader.md#size)

#### Defined in

[index.d.ts:346](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L346)

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Reader`](Reader.md).[`init`](Reader.md#init)

#### Defined in

[index.d.ts:350](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L350)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

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

A promise resolving to a chunk of data.

#### Inherited from

[`Reader`](Reader.md).[`readUint8Array`](Reader.md#readuint8array)

#### Defined in

[index.d.ts:358](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L358)
