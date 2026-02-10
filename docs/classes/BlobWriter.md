[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / BlobWriter

# Class: BlobWriter

Defined in: [index.d.ts:584](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L584)

Represents a [WritableWriter](../interfaces/WritableWriter.md) instance used to retrieve the written data as a `Blob` instance.

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### Constructor

> **new BlobWriter**(`mimeString?`): `BlobWriter`

Defined in: [index.d.ts:598](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L598)

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

Defined in: [index.d.ts:588](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L588)

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`Blob`\>

Defined in: [index.d.ts:604](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L604)

Retrieves all the written data

#### Returns

`Promise`\<`Blob`\>

A promise resolving to the written data.

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:592](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L592)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)
