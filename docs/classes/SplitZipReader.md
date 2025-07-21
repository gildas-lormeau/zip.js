[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitZipReader

# Class: ~~SplitZipReader~~

Defined in: [index.d.ts:546](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L546)

Represents a [Reader](Reader.md) instance used to read data provided as an array of [ReadableReader](../interfaces/ReadableReader.md) instances (e.g. split zip files).

## Deprecated

Use [SplitDataReader](SplitDataReader.md) instead.

## Extends

- [`SplitDataReader`](SplitDataReader.md)

## Constructors

### Constructor

> **new SplitZipReader**(`value`): `SplitZipReader`

Defined in: [index.d.ts:498](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L498)

Creates the [Reader](Reader.md) instance

#### Parameters

##### value

The data to read.

[`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`\<`any`\>[]

#### Returns

`SplitZipReader`

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`constructor`](SplitDataReader.md#constructor)

## Properties

### ~~readable~~

> **readable**: `ReadableStream`

Defined in: [index.d.ts:502](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L502)

The `ReadableStream` instance.

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`readable`](SplitDataReader.md#readable)

***

### ~~size~~

> **size**: `number`

Defined in: [index.d.ts:506](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L506)

The total size of the data in bytes.

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`size`](SplitDataReader.md#size)

## Methods

### ~~init()?~~

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:510](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L510)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SplitDataReader`](SplitDataReader.md).[`init`](SplitDataReader.md#init)

***

### ~~readUint8Array()~~

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:518](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L518)

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

[`SplitDataReader`](SplitDataReader.md).[`readUint8Array`](SplitDataReader.md#readuint8array)
