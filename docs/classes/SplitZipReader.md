[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitZipReader

# Class: ~~SplitZipReader~~

Defined in: [index.d.ts:386](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L386)

Represents a [Reader](Reader.md) instance used to read data provided as an array of [ReadableReader](../interfaces/ReadableReader.md) instances (e.g. split zip files).

## Deprecated

Use [SplitDataReader](SplitDataReader.md) instead.

## Extends

- [`SplitDataReader`](SplitDataReader.md)

## Constructors

### Constructor

> **new SplitZipReader**(`value`): `SplitZipReader`

Defined in: [index.d.ts:338](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L338)

Creates the [Reader](Reader.md) instance

#### Parameters

##### value

The data to read.

`ReadableStream`\<`any`\>[] | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[]

#### Returns

`SplitZipReader`

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`constructor`](SplitDataReader.md#constructor)

## Properties

### ~~readable~~

> **readable**: `ReadableStream`

Defined in: [index.d.ts:342](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L342)

The `ReadableStream` instance.

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`readable`](SplitDataReader.md#readable)

***

### ~~size~~

> **size**: `number`

Defined in: [index.d.ts:346](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L346)

The total size of the data in bytes.

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`size`](SplitDataReader.md#size)

## Methods

### ~~init()?~~

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:350](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L350)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`init`](SplitDataReader.md#init)

***

### ~~readUint8Array()~~

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

Defined in: [index.d.ts:358](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L358)

Reads a chunk of data

#### Parameters

##### index

`number`

The byte index of the data to read.

##### length

`number`

The length of the data to read in bytes.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

A promise resolving to a chunk of data.

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`readUint8Array`](SplitDataReader.md#readuint8array)
