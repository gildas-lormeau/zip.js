[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / BlobWriter

# Class: BlobWriter

Defined in: [index.d.ts:818](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L818)

Represents a [WritableWriter](../interfaces/WritableWriter.md) instance used to retrieve the written data as a `Blob` instance.

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### Constructor

> **new BlobWriter**(`mimeString?`): `BlobWriter`

Defined in: [index.d.ts:832](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L832)

Creates the BlobWriter instance

#### Parameters

##### mimeString?

`string`

The MIME type of the content.

#### Returns

`BlobWriter`

## Properties

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:822](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L822)

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`Blob`\>

Defined in: [index.d.ts:838](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L838)

Retrieves all the written data

#### Returns

`Promise`\<`Blob`\>

A promise resolving to the written data.

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:826](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L826)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)
