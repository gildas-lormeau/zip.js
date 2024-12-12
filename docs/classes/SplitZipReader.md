[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitZipReader

# Class: ~~SplitZipReader~~

Represents a [Reader](Reader.md) instance used to read data provided as an array of [ReadableReader](../interfaces/ReadableReader.md) instances (e.g. split zip files).

## Deprecated

Use [SplitDataReader](SplitDataReader.md) instead.

## Extends

- [`SplitDataReader`](SplitDataReader.md)

## Constructors

### new SplitZipReader()

> **new SplitZipReader**(`value`): [`SplitZipReader`](SplitZipReader.md)

Creates the [Reader](Reader.md) instance

#### Parameters

##### value

The data to read.

[`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`\<`any`\>[]

#### Returns

[`SplitZipReader`](SplitZipReader.md)

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`constructor`](SplitDataReader.md#constructors)

#### Defined in

[index.d.ts:338](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L338)

## Properties

### ~~readable~~

> **readable**: `ReadableStream`\<`any`\>

The `ReadableStream` instance.

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`readable`](SplitDataReader.md#readable)

#### Defined in

[index.d.ts:342](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L342)

***

### ~~size~~

> **size**: `number`

The total size of the data in bytes.

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`size`](SplitDataReader.md#size)

#### Defined in

[index.d.ts:346](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L346)

## Methods

### ~~init()?~~

> `optional` **init**(): `Promise`\<`void`\>

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`init`](SplitDataReader.md#init)

#### Defined in

[index.d.ts:350](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L350)

***

### ~~readUint8Array()~~

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

[`SplitDataReader`](SplitDataReader.md).[`readUint8Array`](SplitDataReader.md#readuint8array)

#### Defined in

[index.d.ts:358](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L358)
